// ==UserScript==
// @name         学堂在线助手
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自动切换1.25倍速，高清
// @author       You
// @match        https://*.xuetangx.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406978/%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/406978/%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    function fun(className, selector)
    {
        var mousemove = document.createEvent("MouseEvent");
        mousemove.initMouseEvent("mousemove", true, true, window, 0, 10, 10, 10, 10, 0, 0, 0, 0, 0, null);
        document.getElementsByClassName(className)[0].dispatchEvent(mousemove);
        document.querySelector(selector).click();
    }
    setInterval(function() {
        if (document.querySelector("xt-quality").innerText !== "高清") {
            fun("xt_video_player_quality", "[keyt=高清]");
            fun("xt_video_player_speed", "[keyt='1.25']");
        }
    }, 500);
})();