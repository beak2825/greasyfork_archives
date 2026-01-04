// ==UserScript==
// @name         自动移除星号列表项
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  每3秒自动移除页面中的所有仅包含星号(*)的列表项
// @author       ferryboat
// @match        *://*.zhile.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483362/%E8%87%AA%E5%8A%A8%E7%A7%BB%E9%99%A4%E6%98%9F%E5%8F%B7%E5%88%97%E8%A1%A8%E9%A1%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/483362/%E8%87%AA%E5%8A%A8%E7%A7%BB%E9%99%A4%E6%98%9F%E5%8F%B7%E5%88%97%E8%A1%A8%E9%A1%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定时器，每3秒执行一次
    setInterval(function() {
        const listItems = document.querySelectorAll('li');
        listItems.forEach(li => {
            if (li.textContent.trim() === '*') {
                li.style.display = 'none';
            }
        });
    }, 300);
})();
