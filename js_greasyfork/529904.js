// ==UserScript==
// @name         牛客网禁用 Ctrl+S 保存
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在牛客网禁用 Ctrl+S 保存，以避免笔试过程中被判断为跳出，Block Meta+S on NowCoder to prevent saving the webpage。
// @author       Littleor
// @match        *://www.nowcoder.com/*
// @match        *://*.nowcoder.com/*
// @grant        none
// @license MI
// @downloadURL https://update.greasyfork.org/scripts/529904/%E7%89%9B%E5%AE%A2%E7%BD%91%E7%A6%81%E7%94%A8%20Ctrl%2BS%20%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/529904/%E7%89%9B%E5%AE%A2%E7%BD%91%E7%A6%81%E7%94%A8%20Ctrl%2BS%20%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        // Check if either Meta (Command on Mac) or Ctrl is pressed with 'S'
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
            event.preventDefault();
            // Optionally, you can add an alert here to notify the user
            // alert('Meta+S (Command+S) has been disabled on NowCoder.');
        }
    });
})();