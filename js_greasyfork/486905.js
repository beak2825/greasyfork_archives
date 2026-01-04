// ==UserScript==
// @name         哔哩哔哩去除直播间马赛克
// @description  将哔哩哔哩直播间的马赛克清除
// @author       KscDvfmCnuJFmiCqDWyf
// @match        https://live.bilibili.com/*
// @grant        none
// @icon         https://www.bilibili.com/favicon.ico
// @version      0.5
// @license      MIT
// @namespace https://greasyfork.org/users/1259036
// @downloadURL https://update.greasyfork.org/scripts/486905/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8E%BB%E9%99%A4%E7%9B%B4%E6%92%AD%E9%97%B4%E9%A9%AC%E8%B5%9B%E5%85%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/486905/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8E%BB%E9%99%A4%E7%9B%B4%E6%92%AD%E9%97%B4%E9%A9%AC%E8%B5%9B%E5%85%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function() {
    document.getElementsByClassName("web-player-module-area-mask")[0].remove()
    }, 5000)
})();