// ==UserScript==
// @name         豆瓣模拟点击加载更多
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  一无是处！
// @author       nyzx0322
// @match       https://movie.douban.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428251/%E8%B1%86%E7%93%A3%E6%A8%A1%E6%8B%9F%E7%82%B9%E5%87%BB%E5%8A%A0%E8%BD%BD%E6%9B%B4%E5%A4%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/428251/%E8%B1%86%E7%93%A3%E6%A8%A1%E6%8B%9F%E7%82%B9%E5%87%BB%E5%8A%A0%E8%BD%BD%E6%9B%B4%E5%A4%9A.meta.js
// ==/UserScript==

(function() {

function ScrollEvent() {
        var wScrollY = window.scrollY; // 当前滚动条位置
        var wInnerH = window.innerHeight; // 设备窗口的高度（不会变）
        var bScrollH = document.body.scrollHeight; // 滚动条总高度
        if (wScrollY + wInnerH >= bScrollH) {
            document.querySelectorAll(".more")[0].click();
        }
    }

window.addEventListener("scroll", ScrollEvent, false);

})();