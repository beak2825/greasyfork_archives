// ==UserScript==
// @name         Douban Time Display Button
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Display current time on douban.com with a big button
// @match        https://www.douban.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502202/Douban%20Time%20Display%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/502202/Douban%20Time%20Display%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addTimeButton() {
        // Create a button element
        var timeButton = document.createElement('button');
        timeButton.id = 'show-time-button';
        timeButton.textContent = '显示时间';
        timeButton.style.position = 'fixed';
        timeButton.style.top = '10px';
        timeButton.style.left = '50%';
        timeButton.style.transform = 'translateX(-50%)';
        timeButton.style.zIndex = '9999';
        timeButton.style.padding = '10px 20px';
        timeButton.style.fontSize = '18px';
        timeButton.style.fontWeight = 'bold';
        timeButton.style.backgroundColor = '#007722';
        timeButton.style.color = 'white';
        timeButton.style.border = 'none';
        timeButton.style.borderRadius = '5px';
        timeButton.style.cursor = 'pointer';

        // Create a div to display the time
        var timeDisplay = document.createElement('div');
        timeDisplay.id = 'time-display';
        timeDisplay.style.position = 'fixed';
        timeDisplay.style.top = '60px';
        timeDisplay.style.left = '50%';
        timeDisplay.style.transform = 'translateX(-50%)';
        timeDisplay.style.zIndex = '9999';
        timeDisplay.style.padding = '10px';
        timeDisplay.style.fontSize = '16px';
        timeDisplay.style.backgroundColor = 'white';
        timeDisplay.style.border = '2px solid #007722';
        timeDisplay.style.borderRadius = '5px';
        timeDisplay.style.display = 'none';

        // Function to update and show the time
        function showTime() {
            var now = new Date();
            timeDisplay.textContent = '当前时间: ' + now.toLocaleTimeString();
            timeDisplay.style.display = 'block';
            
            // Hide the time after 5 seconds
            setTimeout(function() {
                timeDisplay.style.display = 'none';
            }, 5000);
        }

        // Add click event to the button
        timeButton.addEventListener('click', showTime);

        // Add elements to the page
        document.body.appendChild(timeButton);
        document.body.appendChild(timeDisplay);
    }

    // Run the function when the page is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addTimeButton);
    } else {
        addTimeButton();
    }
})();