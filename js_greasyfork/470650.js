// ==UserScript==
// @name         Hello World Overlay
// @namespace    http://your-namespace.com
// @version      1.0
// @description  Add a button that displays a "Hello World" overlay when clicked
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/470650/Hello%20World%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/470650/Hello%20World%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';
     const button = document.createElement('button');
           button.textContent = '按钮';
           button.style.position = 'fixed';
           button.style.bottom = '20px';
           button.style.right = '20px';
           button.style.zIndex = '9999';
    const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.bottom = '0';
        overlay.style.right = '0';
        overlay.style.width = '30%';
        overlay.style.height = '30%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '99999';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';

  const text = document.createElement('span');
        text.textContent = 'Hello World';
        text.style.color = 'white';
        text.style.fontSize = '24px';
        text.style.fontWeight = 'bold';

        overlay.appendChild(text);
        document.body.appendChild(overlay);
        overlay.style.display= "none"
 const close = document.createElement('span');
        close.textContent = 'X';
        close.style.color = 'white';
        close.style.fontSize = '24px';
        close.style.fontWeight = 'bold';
        close.style.position = 'fixed';
        close.style.bottom = '25%';
        close.style.right = '1%';
        close.style. cursor= "pointer";

        overlay.appendChild(close);
        document.body.appendChild(overlay);

    // 点击按钮时显示蒙层
    button.addEventListener('click', function() {
         overlay.style.display= "block"
    });
    // 关闭
    close.addEventListener('click', function() {
         overlay.style.display= "none"
    });

    // 将按钮添加到页面中
    document.body.appendChild(button);
    // Your code here...
})();