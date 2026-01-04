// ==UserScript==
// @name         起点图评价跳转
// @namespace    https://www.qidian.com/book/*
// @version      1.0
// @description  跳转到起点图对应评价页
// @author       mety
// @match        https://www.qidian.com/book/*
// @match        https://www.qidiantu.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494894/%E8%B5%B7%E7%82%B9%E5%9B%BE%E8%AF%84%E4%BB%B7%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/494894/%E8%B5%B7%E7%82%B9%E5%9B%BE%E8%AF%84%E4%BB%B7%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a circular button
    const button = document.createElement('button');
    button.textContent = window.location.hostname === 'www.qidian.com' ? '评价' : '返回';
    button.style.cssText = `
    position: fixed;
    left: 50px;
    bottom: 50px;
    width: 1.5cm;
    height: 1.5cm;
    border-radius: 50%;
    background-color: #615d53; /* 半透明的深灰色 */
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    opacity: 0.8; /* 半透明效果 */
  `;

    // Append the button to the page
    document.body.appendChild(button);

    // Button click event handler
    button.addEventListener('click', function() {
        if (window.location.hostname === 'www.qidian.com') {
            // Add "tu" after "qidian" in the URL and navigate
            const newUrl = window.location.href.replace('qidian', 'qidiantu');
            window.location.href = newUrl;
        } else {
            // Go back to the previous page
            window.history.back();
        }
    });
})();
