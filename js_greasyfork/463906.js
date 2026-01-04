// ==UserScript==
// @name         discord 當一個一直發箭頭的建種by ㄐㄐ人
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  會自己發箭頭
// @author       ㄐㄐ人
// @match        *://*.discord.com/channels/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463906/discord%20%E7%95%B6%E4%B8%80%E5%80%8B%E4%B8%80%E7%9B%B4%E7%99%BC%E7%AE%AD%E9%A0%AD%E7%9A%84%E5%BB%BA%E7%A8%AEby%20%E3%84%90%E3%84%90%E4%BA%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/463906/discord%20%E7%95%B6%E4%B8%80%E5%80%8B%E4%B8%80%E7%9B%B4%E7%99%BC%E7%AE%AD%E9%A0%AD%E7%9A%84%E5%BB%BA%E7%A8%AEby%20%E3%84%90%E3%84%90%E4%BA%BA.meta.js
// ==/UserScript==

// ==UserScript==
// @name         discord 自動點表情符號by ㄐㄐ人
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  會自己點表情符號
// @author       ㄐㄐ人
// @match        *://*.discord.com/channels/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // 聚焦到網頁文件
    window.focus();
    
    // 將文字複製到剪貼簿
    navigator.clipboard.writeText('+:arrow_upper_left:');
    
    // 延遲一秒後進行貼上及按下 Enter 鍵的操作
    setTimeout(function() {
      // 模擬按下 Ctrl+V 鍵
      document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'v', 'ctrlKey': true}));
    
      // 模擬按下 Enter 鍵
      document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Enter'}));
    }, 1000);

})();
