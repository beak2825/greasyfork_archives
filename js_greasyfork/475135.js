// ==UserScript==
// @name         System Clock and Calendar
// @description  Display the system clock and calendar at the bottom right corner of the site in Chrome browser.
// @namespace    https://github.com/Rainman69/
// @version      1.0
// @author       https://t.me/TheErfon
// @match        *://*/*
// @grant        none
// @license      CC BY-NC-ND 4.0
// @licenseURL   https://github.com/Rainman69/live-Time-date-for-browser/blob/main/LICENSE
// @downloadURL https://update.greasyfork.org/scripts/475135/System%20Clock%20and%20Calendar.user.js
// @updateURL https://update.greasyfork.org/scripts/475135/System%20Clock%20and%20Calendar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var systemDateDiv = document.createElement('div');
    systemDateDiv.style.position = 'fixed';
    systemDateDiv.style.bottom = '0';
    systemDateDiv.style.right = '0';
    systemDateDiv.style.width = '40%';
    systemDateDiv.style.padding = '5px';
    systemDateDiv.style.fontFamily = 'digital-7 (mono)';
    systemDateDiv.style.fontSize = '12px';
    systemDateDiv.style.textAlign = 'center';
    systemDateDiv.style.zIndex = '9999';
    systemDateDiv.style.textShadow = '0px -2px 4px rgba(0, 0, 0, 0.3)';
    systemDateDiv.style.transition = 'opacity 0.5s ease-in-out';

    function updateTime() {
        var currentDate = new Date();
        var options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
        var formattedDate = currentDate.toLocaleString('en-US', options);

        systemDateDiv.textContent = formattedDate;
    }

    function handleScroll() {
        if (isScrolling) {
            clearTimeout(scrollingTimer);
        } else {
            systemDateDiv.style.opacity = '0';
        }

        isScrolling = true;

        scrollingTimer = setTimeout(function() {
            isScrolling = false;
            systemDateDiv.style.opacity = '1';
        }, 1000);
    }

    var isScrolling = false;
    var scrollingTimer;

    updateTime();

    window.addEventListener('scroll', handleScroll);

    document.body.appendChild(systemDateDiv);

    // Update the time every second
    setInterval(updateTime, 1000);
})();