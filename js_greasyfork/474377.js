// ==UserScript==
// @name        含羞草视频无限看
// @namespace   Violentmonkey Scripts
// @match       *://*/play/video/*
// @grant       none
// @license     MIT
// @version     2.2
// @author      youngyy
// @description 含羞草视频无限看、自动播放，免费看VIP，支持手机端，付费视频无法解决
// @downloadURL https://update.greasyfork.org/scripts/474377/%E5%90%AB%E7%BE%9E%E8%8D%89%E8%A7%86%E9%A2%91%E6%97%A0%E9%99%90%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/474377/%E5%90%AB%E7%BE%9E%E8%8D%89%E8%A7%86%E9%A2%91%E6%97%A0%E9%99%90%E7%9C%8B.meta.js
// ==/UserScript==

function getNowDay() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();

    return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`
}

const open1 = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
    if (url.indexOf(".m3u8") > -1) {
        url = url.replace(/start=\d+\&end=\d+\&/, "")
    }
    open1.apply(this, arguments);
};

function findNodeByText(text, startNode = document.body) {
    let stack = [startNode];
    while (stack.length > 0) {
        const currentNode = stack.shift();
        if (currentNode.nodeType === Node.TEXT_NODE) {
            if (currentNode.textContent.trim() === text) {
                return currentNode.parentNode;
            }
        } else if (currentNode.nodeType === Node.ELEMENT_NODE) {
            if (currentNode.childNodes.length > 0) {
                stack = stack.concat(Array.from(currentNode.childNodes));
            }
        }
    }
    return null;
}

function initVideoCountTimes() {
    const obj = {
        time: getNowDay(),
        preNum: 99,
        count: 1,
        num: -94
    };
    localStorage.setItem("preInfo", JSON.stringify(obj))
    localStorage.setItem("tryPlayNum", JSON.stringify(obj))
}

(function () {
    'use strict';
    initVideoCountTimes()

    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'characterData') {
                setTimeout(() => {
                    initVideoCountTimes()

                    const foundNode = findNodeByText("试看");
                    foundNode?.click()
                }, 300)
            }
        });
    });
    const config = {characterData: true, subtree: true};
    observer.observe(document.body, config);
})();