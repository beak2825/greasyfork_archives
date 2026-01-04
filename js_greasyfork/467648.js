// ==UserScript==
// @name         屏蔽B站彩色渐变弹幕
// @namespace    https://github.com/hny3494317690/bili-vip-danmu-remove
// @version      0.9
// @description  b站新出的彩色渐变弹幕太恶心了，用这个来屏蔽吧
// @author       hny3494317690
// @match        *://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/467648/%E5%B1%8F%E8%94%BDB%E7%AB%99%E5%BD%A9%E8%89%B2%E6%B8%90%E5%8F%98%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/467648/%E5%B1%8F%E8%94%BDB%E7%AB%99%E5%BD%A9%E8%89%B2%E6%B8%90%E5%8F%98%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
 setInterval(()=>{for(const dom of document.querySelectorAll('.bili-dm-vip')) {
  dom.textContent=""
  dom.style.opacity=0
  dom.style.visibility='hidden'
  
     
}}, 100)
    
})();
