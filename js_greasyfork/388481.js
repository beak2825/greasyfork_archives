// ==UserScript==
// @name        哔哩哔哩直播去掉系统消息
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  干掉哪些烦人的东西
// @author       You
// @match        https://live.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388481/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E5%8E%BB%E6%8E%89%E7%B3%BB%E7%BB%9F%E6%B6%88%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/388481/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E5%8E%BB%E6%8E%89%E7%B3%BB%E7%BB%9F%E6%B6%88%E6%81%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';
setInterval(() => {
    document.querySelectorAll(".chat-item.system-msg.border-box").forEach(element => {
        element.remove()
    });
}, 100);
})();