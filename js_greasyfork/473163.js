// ==UserScript==
// @name         Copy Current Time
// @namespace    your-namespace
// @version      1.1
// @license      MIT
// @description  Add a button to copy current time in YYYY-MM-DD HH:mm:ss format to clipboard on Feishu Starcross Wiki site.
// @match        https://starcross.feishu.cn/wiki/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=feishu.cn
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/473163/Copy%20Current%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/473163/Copy%20Current%20Time.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the button element
    var button = document.createElement('button');
    button.textContent = 'Copy Time';

    // Add some styles to the button
    button.style.position = 'fixed';
    button.style.bottom = '120px';
    button.style.right = '20px';
    button.style.backgroundColor = '#1d4ed8';
    button.style.padding = '4px 6px 6px';
    button.style.borderRadius = '6px';
    button.style.color = 'white';
    button.style.zIndex = '1';

    // Append the button to the document body
    document.body.appendChild(button);

    // Add click event listener to the button
    button.addEventListener('click', function() {
        var now = new Date();
        now.setHours(now.getHours() + 8); // Add 8 hours to match Beijing time (GMT+8)
        var currentTime = now.toISOString().replace('T', ' ').substring(0, 19);
        GM_setClipboard(currentTime);

        // Show success indicator
        var successIndicator = document.createElement('span');
        successIndicator.textContent = '✓';
        successIndicator.style.color = 'white';
        successIndicator.style.marginLeft = '5px';
        button.appendChild(successIndicator);

        // Remove success indicator after 2 seconds
        setTimeout(function() {
            successIndicator.remove();
        }, 2000);

        console.log('Current time copied to clipboard: ' + currentTime);
    });
})();
