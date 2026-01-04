// ==UserScript==
// @name         Fortune Apple Checker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show options containing apples in Fortune Apple game cells
// @author       Your name
// @match        https://1xbetbd.com/allgamesentrance/fortuneapple
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490367/Fortune%20Apple%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/490367/Fortune%20Apple%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS styles for displaying information
    const style = document.createElement('style');
    style.innerHTML = `
        .apple-info {
            position: absolute;
            background-color: rgba(255, 255, 255, 0.9);
            border: 1px solid #ccc;
            padding: 5px;
            font-size: 14px;
            z-index: 9999;
        }
    `;
    document.head.appendChild(style);

    // Function to show options containing apples
    function showAppleOptions() {
        const cells = document.querySelectorAll('.fortune-apple-row__item');
        cells.forEach(cell => {
            if (cell.classList.contains('fortune-apple-row__item--win')) {
                const options = cell.closest('.fortune-apple-row').querySelector('.fortune-apple-row__rate').innerText.trim();
                const cellRect = cell.getBoundingClientRect();
                const appleInfo = document.createElement('div');
                appleInfo.className = 'apple-info';
                appleInfo.style.top = cellRect.top + 'px';
                appleInfo.style.left = cellRect.right + 'px';
                appleInfo.innerText = 'Options: ' + options;
                document.body.appendChild(appleInfo);
            }
        });
    }

    // Run the function when the page is loaded
    window.addEventListener('load', showAppleOptions);
})();
