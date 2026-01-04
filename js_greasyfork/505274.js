// ==UserScript==
// @name         一键无图模式
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为页面右下角添加一个按钮，点击后切换无图模式，再次点击切回。
// @author       yjy
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @license      CC
// @downloadURL https://update.greasyfork.org/scripts/505274/%E4%B8%80%E9%94%AE%E6%97%A0%E5%9B%BE%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/505274/%E4%B8%80%E9%94%AE%E6%97%A0%E5%9B%BE%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a button to toggle visibility
    const toggleButton = document.createElement('button');
    toggleButton.innerText = '无图';
    toggleButton.style.fontSize = '12px';
    toggleButton.style.position = 'fixed';
    toggleButton.style.bottom = '20px';
    toggleButton.style.right = '40px';
    toggleButton.style.zIndex = '9999';
    document.body.appendChild(toggleButton);


    var noImageMode = false;

    // Function to toggle image and video visibility
    function toggleNoImageMode() {
        noImageMode = !noImageMode;
        var displayValue = noImageMode ? 'none' : '';

        document.querySelectorAll('img, video').forEach(function(element) {
            element.style.display = displayValue;
        });
    }

    // Add click event listener to the button
    toggleButton.addEventListener('click', toggleNoImageMode);
})();
