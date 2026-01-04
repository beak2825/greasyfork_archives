// ==UserScript==
// @name         deepseek 页签显示聊天标题
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  动态更新页签标题DeepSeek聊天标题
// @author       wzj042
// @match        https://chat.deepseek.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepseek.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525536/deepseek%20%E9%A1%B5%E7%AD%BE%E6%98%BE%E7%A4%BA%E8%81%8A%E5%A4%A9%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/525536/deepseek%20%E9%A1%B5%E7%AD%BE%E6%98%BE%E7%A4%BA%E8%81%8A%E5%A4%A9%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
setInterval(()=>{
    let title = document.title;
    let chat = document.querySelector('.d8ed659a');
    if (chat && chat.innerText !== title){
        document.title = chat.innerText;
    }
}, 500);
})();