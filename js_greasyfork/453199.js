// ==UserScript==
// @name         B站直播间弹幕发送反馈
// @namespace    http://shenhaisu.cc/
// @version      1.3
// @description  拦截并显示直播间弹幕发送的反馈
// @author       ShenHaiSu
// @match        https://live.bilibili.com/*
// @run-at       document-start
// @grant        unsafeWindow
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/453199/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E5%BC%B9%E5%B9%95%E5%8F%91%E9%80%81%E5%8F%8D%E9%A6%88.user.js
// @updateURL https://update.greasyfork.org/scripts/453199/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E5%BC%B9%E5%B9%95%E5%8F%91%E9%80%81%E5%8F%8D%E9%A6%88.meta.js
// ==/UserScript==

(function () {
    let messageSpan = false;
    function showMessage(input) {
        if (!messageSpan) createMessageSpan();
        messageSpan.innerText = input;
    }
    function createMessageSpan() {
        let spanE = document.createElement("span");
        let divE = document.createElement("div");
        let targetDiv = document.getElementsByClassName("bottom-actions")[0];
        spanE.innerText = "弹幕发送发反馈信息"; 
        divE.style.backgroundColor = "#ffffff";
        divE.style.padding = "3px 10px 3px 10px";
        divE.style.borderRadius = "3px";
        divE.style.display = "inline";
        divE.appendChild(spanE);
        messageSpan = spanE;
        targetDiv.appendChild(divE);
    }
    const originFetch = fetch;
    window.unsafeWindow.fetch = (url, options) => {
        return originFetch(url, options).then(async (response) => {
            if (!url.match("/msg/send")) return await response;
            // console.log(url)
            let responseClone = await response.clone();
            let res = await responseClone.json();
            // console.log(res);
            switch (res.msg) {
                case "":
                    showMessage("弹幕发送成功");
                    break;
                case "f":
                    showMessage("检测到敏感词,发送失败.");
                    break;
                default:
                    showMessage(res.msg);
                    break;
            }
            let responseNew = new Response(JSON.stringify(res), response);
            return responseNew;
        });
    };
})();