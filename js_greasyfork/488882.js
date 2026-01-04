// ==UserScript==
// @name         去除b站首页推广
// @version      1.2.1
// @namespace    https://github.com/odarkblade
// @description  去除b站首页的推广，侧栏广告
// @author       https://github.com/odarkblade
// @match        https://www.bilibili.com/
// @match        https://www.bilibili.com/?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488882/%E5%8E%BB%E9%99%A4b%E7%AB%99%E9%A6%96%E9%A1%B5%E6%8E%A8%E5%B9%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/488882/%E5%8E%BB%E9%99%A4b%E7%AB%99%E9%A6%96%E9%A1%B5%E6%8E%A8%E5%B9%BF.meta.js
// ==/UserScript==

function runCode() {
    try {
        const ads = [
            ...document.getElementsByClassName("bili-video-card__info--ad"),
            ...document.getElementsByClassName("bili-video-card__info--creative-ad"),
            ...document.getElementsByClassName("btn-ad"),
            ...document.getElementsByClassName("floor-single-card"),
            ...document.getElementsByClassName("adcard"),
            ...document.getElementsByClassName('desktop-download-tip'),
            ...document.querySelectorAll('.bili-video-card.is-rcmd:not(.enable-no-interest)'),
            ...document.querySelectorAll("三国：谋定天下"),
            ...document.querySelectorAll('h3.bili-video-card__info--tit[title*="三角洲行动"]')

        ];


        ads.forEach(ad => {
              handleAdContainer(ad);
        });


        if (ads.length === 0) {
            console.log("No ads found");
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

let retryCount = 0;
const maxRetries = 5;
function handleAdContainer(adContainer) {
    try {
        if (adContainer) {
            const AdContainer_feed = adContainer.closest('.feed-card');
            const AdContainer_rcmd = adContainer.closest('bili-video-card is-rcmd');
            if (AdContainer_feed && AdContainer_feed.parentNode) {
                AdContainer_feed.parentNode.appendChild(AdContainer_feed);
                AdContainer_feed.style.display = 'none';
            }
            else if (AdContainer_rcmd && AdContainer_rcmd.parentNode) {
                AdContainer_rcmd.parentNode.removeChild(AdContainer_rcmd);
                AdContainer_rcmd.style.display = 'none';
                AdContainer_rcmd.remove();
            }
            else {
                    adContainer.parentNode.removeChild(adContainer);
                    adContainer.remove();
                    adContainer.style.display = 'none';
            }
        } else {
            console.log("Ad container is undefined.");
        }
        retryCount = 0;
    } catch (error) {
        console.error("remove error:", error);

        if (retryCount < maxRetries) {
            retryCount++;
            console.log(`Retrying... Attempt ${retryCount}`);
            setTimeout(() => {
                runCode();
            }, 1000);
        } else {
            console.log("fatal error Please refresh the website");
        }
    }
}

window.addEventListener('load', function() {

    console.log("start");
    runCode();
    waitForElementById("floor-single-card", 1000);
});




function waitForElementById(elementId, timeout = 5000) {
    let timeoutId;

    const callback = (message) => {
        executeCode();
    };


    timeoutId = setTimeout(() => {
        callback(`${elementId} `);
    }, timeout);

    const observer = new MutationObserver(() => {
        const element = document.getElementById(elementId);
        if (element) {
            clearTimeout(timeoutId); 
            observer.disconnect();
            callback(); 
        }
    });


    observer.observe(document.body, {
        childList: true, 
        subtree: true 
    });
}

function executeCode() {

    runCode();
    try {
        const ref_btn = document.getElementsByClassName("primary-btn roll-btn")[0];
        const ref_btn1 = document.getElementsByClassName("flexible-roll-btn")[0];

        if (ref_btn) {
            ref_btn.addEventListener('click', function() {
                setTimeout(runCode, 500);
            });
        }
        if (ref_btn1) {
            ref_btn1.addEventListener('click', function() {
                waitForElementById("floor-single-card", 1000);

            });
        }
    } catch(error) {
        console.log("refresh error:", error);
    }
    setTimeout(console.log("end"), 500);
    runCode();
}

const targetNode = document.querySelector('.bili-feed4');

const config = { childList: true, subtree: true };

const callback = function(mutationsList, observer) {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'IMG') {
                    waitForElementById("floor-single-card", 1000);
                }
            });
        }
    }
};

const observer = new MutationObserver(callback);

if (targetNode) {
    observer.observe(targetNode, config);
} else {
    console.error('未找到目标元素');
}

let scrollCount = 0;
let timeoutId;


const handleScroll = () => {
    scrollCount++;

    if (scrollCount >= 2) {
        runCode();
        scrollCount = 0;
    }

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        runCode();
    }, 500);
};


window.addEventListener('load', function() {
    console.log("开始监听滚动");
    window.addEventListener('scroll', handleScroll);
});
