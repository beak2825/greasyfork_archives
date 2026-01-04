// ==UserScript==
// @name         Scroll to Top and Bottom Buttons
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add buttons to scroll to the top and bottom of the page
// @author       1010n111
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532870/Scroll%20to%20Top%20and%20Bottom%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/532870/Scroll%20to%20Top%20and%20Bottom%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮元素
    const topButton = document.createElement('button');
    topButton.innerHTML = '&#8593;'; // 向上箭头
    topButton.style.position = 'fixed';
    topButton.style.left = '20px';
    topButton.style.top = '50%';
    topButton.style.transform = 'translateY(-100%)';
    topButton.style.zIndex = '9999';
    topButton.style.fontSize = '24px';
    topButton.style.padding = '8px 12px';
    topButton.style.border = 'none';
    topButton.style.borderRadius = '8px';
    topButton.style.backgroundColor = '#444';
    topButton.style.color = 'white';
    topButton.style.cursor = 'pointer';
    topButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
    topButton.addEventListener('mouseenter', () => {
        topButton.style.backgroundColor = '#555';
    });
    topButton.addEventListener('mouseleave', () => {
        topButton.style.backgroundColor = '#444';
    });
    topButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    const bottomButton = document.createElement('button');
    bottomButton.innerHTML = '&#8595;'; // 向下箭头
    bottomButton.style.position = 'fixed';
    bottomButton.style.left = '20px';
    bottomButton.style.top = 'calc(50% + 60px)';
    bottomButton.style.zIndex = '9999';
    bottomButton.style.fontSize = '24px';
    bottomButton.style.padding = '8px 12px';
    bottomButton.style.border = 'none';
    bottomButton.style.borderRadius = '8px';
    bottomButton.style.backgroundColor = '#444';
    bottomButton.style.color = 'white';
    bottomButton.style.cursor = 'pointer';
    bottomButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
    bottomButton.addEventListener('mouseenter', () => {
        bottomButton.style.backgroundColor = '#555';
    });
    bottomButton.addEventListener('mouseleave', () => {
        bottomButton.style.backgroundColor = '#444';
    });
    bottomButton.addEventListener('click', () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    });

    // 将按钮添加到页面
    document.body.appendChild(topButton);
    document.body.appendChild(bottomButton);
})();    