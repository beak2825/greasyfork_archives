// ==UserScript==
// @name         youtube 移除聊天
// @namespace    mscststs
// @version      0.1
// @description  移除聊天模块
// @author       mscststs
// @match        https://www.youtube.com/watch?*
// @match        https://www.youtube.com/live_chat*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423501/youtube%20%E7%A7%BB%E9%99%A4%E8%81%8A%E5%A4%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/423501/youtube%20%E7%A7%BB%E9%99%A4%E8%81%8A%E5%A4%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(~location.href.indexOf("live_chat")){
        location.href="https://www.google.com"
    }else{
        let style = document.createElement("style")
        style.innerHTML = "#chat{display:none}"
        document.body.appendChild(style)
    }
})();