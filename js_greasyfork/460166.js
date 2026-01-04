// ==UserScript==
// @name         设置Talos日志区域高度
// @namespace    http://tampermonkey.net/
// @description  set horn
// @license      MIT
// @version      0.1
// @match        https://talos.sankuai.com/*
// @grant        GM_log
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/460166/%E8%AE%BE%E7%BD%AETalos%E6%97%A5%E5%BF%97%E5%8C%BA%E5%9F%9F%E9%AB%98%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/460166/%E8%AE%BE%E7%BD%AETalos%E6%97%A5%E5%BF%97%E5%8C%BA%E5%9F%9F%E9%AB%98%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_log("Tampermonkey: Rome+Talos");

    function setHeight() {
        const list = document.querySelectorAll(".log-theme > div");
        GM_log('i')
        list.forEach(function(i){
            i.setAttribute("style", "height: 600px; overflow-y: auto;");
        })
        GM_log('j')
    }

    const loaded =
    document.readyState == "complete" ||
    document.readyState == "loaded" ||
    document.readyState == "interactive";
    // talos页面加载可能稍慢
    const mountAfterDelay = () => setTimeout(setHeight, 3000);
    if (loaded) {
        mountAfterDelay();
    } else {
        window.addEventListener("DOMContentLoaded", mountAfterDelay);
    }
})();