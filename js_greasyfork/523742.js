// ==UserScript==
// @name         江门教师培训学习一个个看版
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      1.1.5
// @description  舒筋健腰丸
// @author       舒筋健腰丸
// @license      MIT
// @match        https://jsgl.jiangmen.cn/*
// @match        https://jsxx.gdedu.gov.cn/*
// @downloadURL https://update.greasyfork.org/scripts/523742/%E6%B1%9F%E9%97%A8%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD%E5%AD%A6%E4%B9%A0%E4%B8%80%E4%B8%AA%E4%B8%AA%E7%9C%8B%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/523742/%E6%B1%9F%E9%97%A8%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD%E5%AD%A6%E4%B9%A0%E4%B8%80%E4%B8%AA%E4%B8%AA%E7%9C%8B%E7%89%88.meta.js
// ==/UserScript==


window.addEventListener('load', function () {
    createButton();  
    main();  
});

let completedXPath = "//span[contains(text(), '已完成')]"; 
let watchTextXPath = "//span[contains(text(), '您已观看')]"; 
let clickInterval
let isScriptRunning = false;  
let checkInterval;  
let hasClickedNext = false;  
let isWatchTextPresent = false; 

function main() {
    
    startScript();  
}
async function startScript() {
    const videoDiv = document.querySelector("#video");
    const video = videoDiv ? videoDiv.querySelector("video") : null;

    const nextButtonXPath = "/html/body/div[1]/div/div/div/div[2]/div/div/div/div/div/div/div/div[2]/div/div[2]/div/div[2]/div[2]/div/div[1]/div[1]/div[3]/span[1]";
    const nextButton = document.evaluate(nextButtonXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    if (video) {
        
        const observer = new MutationObserver(() => {
            setTimeout(async () => {
                await new Promise(resolve => setTimeout(resolve, 8000));  
                const completedElement = document.evaluate(completedXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                console.log('观看时长状态:', completedElement ? completedElement.textContent.trim() : '无状态');
        
                const watchTextElement = document.evaluate(watchTextXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                isWatchTextPresent = watchTextElement && watchTextElement.textContent.trim().includes("您已观看");
        
                if (completedElement && completedElement.textContent.trim().includes("已完成")) {
                    console.log("检测到 '已完成' 文本，视频将停止播放");
                    //video.pause();  

                    
                    if (!hasClickedNext) { 
                        hasClickedNext = true;
                        clickNextButtonLoop(nextButton);
                    }
                    return;  
                }

                
                if (video.ended && !hasClickedNext) {
                    console.log("视频播放完毕，获取下一个按钮并点击");
                    //video.pause();  
                    if (nextButton) {
                        await clickMiddleOfButton(nextButton);  
                        hasClickedNext = true;  
                    }
                }

              checkWatchTextPresence()

                
                if (video.paused) {
                    const specificElementXPath = "/html/body/div[1]/div/div/div/div[2]/div/div/div/div/div/div/div/div[2]/div/div[2]/div/div[2]/div[2]/div/div[1]/div[2]/div/div/div/div/div[3]/div[2]/button[1]";
                    clickInterval = setInterval(async () => {
                        await clickElementMiddle(specificElementXPath);
                        //video.play();
                        console.log("视频暂停，重新播放...");
                    }, 8000);
                }
            }, 5000); 
        });

        
        observer.observe(document.body, { childList: true, subtree: true });
    }
}


function checkWatchTextPresence() {
    setInterval(() => {
        setTimeout(() => {  
            if (isWatchTextPresent) {
                console.log("检测到 '您已观看' 文本，停止之前的视频播放并播放新视频");
                video.pause();  
                playNewVideo();  
                clearInterval(checkInterval);  
            }
        }, 9000);  
    }, 10000);  
}


function resetScriptState() {
    hasClickedNext = false;  
    isWatchTextPresent = false;  
}


function clickNextButtonLoop(nextButton) {
    let timeoutTimer; 

    const nextButtonClickInterval = setInterval(async () => {
        const completedElement = document.evaluate(completedXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const specificElementXPath = "/html/body/div[1]/div/div/div/div[2]/div/div/div/div/div/div/div/div[2]/div/div[2]/div/div[2]/div[2]/div/div[1]/div[2]/div/div/div/div/div[3]/div[2]/button[1]";

        
        clearTimeout(timeoutTimer);
        timeoutTimer = setTimeout(() => {
           
            console.log("长时间未点击，重置 hasClickedNext 为 false");
            hasClickedNext = false;  
        }, 30000);  

        const isPageReady = await checkPageReady();
        if (isPageReady) {
        if (completedElement && completedElement.textContent.trim().includes("已完成")) {
            console.log("继续点击 '下一个' 按钮，因为状态仍为 '已完成'");
            if (nextButton) {
                await clickMiddleOfButton(nextButton);  
            }
        } else {
            console.log("状态不再为 '已完成'，停止点击 '下一个' 按钮");
            await clickElementMiddle(specificElementXPath); 
            clearInterval(nextButtonClickInterval); 
        }
    } else {
        console.log("页面尚未准备好，等待下一次尝试");
    }
    }, 8000); 
}



async function checkPageReady() {
    return new Promise(resolve => {
        const checkInterval = setInterval(() => {
            const someElement = document.querySelector('video'); 
            if (someElement && someElement.clientHeight > 0) {
                clearInterval(checkInterval);
                resolve(true);  
            }
        }, 200);  
    });
}

async function playNewVideo() {
    const specificElementXPath = "/html/body/div[1]/div/div/div/div[2]/div/div/div/div/div/div/div/div[2]/div/div[2]/div/div[2]/div[2]/div/div[1]/div[2]/div/div/div/div/div[3]/div[2]/button[1]";
    if (video.paused) {
        await clickElementMiddle(specificElementXPath);
        console.log("播放视频");
    } else {
        await clickElementMiddle(specificElementXPath);
    }
}


function disableClickEvents() {
    document.body.style.pointerEvents = 'none';  
    console.log("页面点击事件已禁用");
}


function enableClickEvents() {
    document.body.style.pointerEvents = 'auto';  
    console.log("页面点击事件已恢复");
}


async function clickMiddleOfButton(button) {
    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const event = new MouseEvent('click', {
        clientX: x,
        clientY: y,
        bubbles: true,
        cancelable: true
    });
    button.dispatchEvent(event);
    console.log("模拟点击了按钮中间位置");
}


async function clickElementMiddle(xpath) {
    const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (element) {
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        const event = new MouseEvent('click', {
            clientX: x,
            clientY: y,
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(event);
        console.log("模拟点击了指定元素中间位置");
    } else {
        console.log("未找到指定元素");
    }
}


function createButton() {
    button = document.createElement("button");
    button.textContent = "启动脚本一个个看版（点了一次之后全程不要动）（记得看下载页面说明）";
    button.style.position = "fixed";  
    button.style.top = "10px";  
    button.style.right = "10px";  
    button.style.padding = "10px 20px";  
    button.style.backgroundColor = "#FFEB3B";  
    button.style.color = "black";  
    button.style.border = "none";  
    button.style.borderRadius = "5px";  
    button.style.cursor = "pointer"; 
    button.style.zIndex = "9999";  
    button.style.display = "block";  
    button.style.pointerEvents = "auto";  


    document.body.insertBefore(button, document.body.firstChild);

    
    addButtonClickListener();
}


function addButtonClickListener() {
    button.addEventListener("click", () => {
        console.log("按钮点击事件触发");
        if (isScriptRunning) {
           
            console.log("停止脚本按钮被点击");
            clearInterval(checkInterval);
            resetScriptState();  
            button.textContent = "启动脚本";  
            console.log("脚本已停止");

            
            enableClickEvents();
            isScriptRunning = false;  
        } else {
            
            console.log("启动脚本按钮被点击");
            isScriptRunning = true;
            button.textContent = "停止脚本"; 
            console.log("脚本已启动");

            
            disableClickEvents();

           
            startScript();  
        }
    });
}


createButton();
