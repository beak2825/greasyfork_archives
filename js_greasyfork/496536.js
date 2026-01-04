// ==UserScript==
// @name         B站动态页面隐藏充电专属
// @namespace    windworkshop
// @version      0.0.4
// @description  充电专属可以理解，但不能强制推送，我选择隐藏。
// @author       whenwind
// @match        *://t.bilibili.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496536/B%E7%AB%99%E5%8A%A8%E6%80%81%E9%A1%B5%E9%9D%A2%E9%9A%90%E8%97%8F%E5%85%85%E7%94%B5%E4%B8%93%E5%B1%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/496536/B%E7%AB%99%E5%8A%A8%E6%80%81%E9%A1%B5%E9%9D%A2%E9%9A%90%E8%97%8F%E5%85%85%E7%94%B5%E4%B8%93%E5%B1%9E.meta.js
// ==/UserScript==

(function() {
    setInterval(() => {
        var items = document.getElementsByClassName("bili-dyn-item");
        for(var i = 0;i < items.length;i++) {
            if(items[i].getElementsByClassName("bili-dyn-card-video__badge").length !== 0) {
                var item = items[i].getElementsByClassName("bili-dyn-card-video__badge")[0];
                if(item.innerText == "充电专属" || item.innerText == "抢先看") {
                    items[i].setAttribute("style", "display: none");
                }
            }
            if(items[i].getElementsByClassName("dyn-blocked-mask").length !== 0) {
                items[i].setAttribute("style", "display: none");
            }
        }
    }, 1000)
})();