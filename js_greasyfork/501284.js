// ==UserScript==
// @name         隐藏B站直播网页全屏聊天
// @description  隐藏网页全屏时右侧烦躁的聊天窗口，最好用较新一点的浏览器
// @license      MIT
// @grant        GM_addStyle
// @version      1.3
// @author       yinghuaile
// @match        https://live.bilibili.com/*
// @namespace yinghuaile
// @downloadURL https://update.greasyfork.org/scripts/501284/%E9%9A%90%E8%97%8FB%E7%AB%99%E7%9B%B4%E6%92%AD%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E8%81%8A%E5%A4%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/501284/%E9%9A%90%E8%97%8FB%E7%AB%99%E7%9B%B4%E6%92%AD%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E8%81%8A%E5%A4%A9.meta.js
// ==/UserScript==

// 现在B站增加了可选隐藏网页全屏聊天，可以不订阅该脚本了。
(function () {
    var body = document.body;
    var rightBar
    var findRightBarTimer
    var findRightBar = function () {
        rightBar = document.querySelector("#aside-area-vm");
        if (rightBar != null) {
            GM_addStyle(".player-full-win .player-section{width:100% !important;}");
            clearInterval(findRightBarTimer);
        }
    };

    findRightBarTimer = setInterval(findRightBar, 1000);

    var testObserver = new MutationObserver(function (mutations) {
        try {
            if(rightBar == null){
                return
            }
            //new Blob([l]).size
            let classLength = body.className.replace(/\s/g,"").length
            if (classLength <= 22) {
                rightBar.style.display = "block";
            } else {
                rightBar.style.display = "none";
            }
        } catch (error) {
            console.log(error)
        }
    });
    testObserver.observe(body, {
        attributeFilter: ["class"],
    });
})();
