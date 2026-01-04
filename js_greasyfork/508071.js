// ==UserScript==
// @name         [59768]循环case倒数提醒
// @version      v1.0
// @author       lulzhang
// @description  循环case的倒数第2及第1期进行留言提醒
// @match        https://fe.winston.a2z.com/JP/task/*
// @namespace https://greasyfork.org/users/1326983
// @downloadURL https://update.greasyfork.org/scripts/508071/%5B59768%5D%E5%BE%AA%E7%8E%AFcase%E5%80%92%E6%95%B0%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/508071/%5B59768%5D%E5%BE%AA%E7%8E%AFcase%E5%80%92%E6%95%B0%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==

let isAlertShown = false;

function waitForElement(selector, callback) {
    const targetNode = document.body;
    const config = { childList: true, subtree: true };

    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    callback();
                }
            }
        }
    });

    observer.observe(targetNode, config);
}

function checkCaseTimes() {
    const caseInfoElements = document.getElementsByClassName("awsui-util-pl-s");

    if (!caseInfoElements || caseInfoElements.length < 3) {
        console.log(`网页中没有相关元素`);
        return;
    }

    const caseInfoText = caseInfoElements[2].textContent.match(/\d+/g);
    if (!caseInfoText || caseInfoText.length < 2) {
        console.log(`没有找到匹配的数字`);
        return;
    }

    const numCases = parseInt(caseInfoText[1]) - parseInt(caseInfoText[0]);
    console.log(`循环差: ${numCases} 次!`);

    // ""中的提醒语句可以任意更换, numCases < {数字}也可根据需求调整
    if (numCases < 2 && numCases !== 0 && !isAlertShown) {
        alert(`请确认: 循环 case 次数仅剩 ${numCases} 次!`);
        isAlertShown = true;
    }
}

waitForElement("#WinstonApp > div > div:nth-child(2) > div:nth-child(1) > div > awsui-badge.awsui-util-pl-s > span > div > span > a", checkCaseTimes);