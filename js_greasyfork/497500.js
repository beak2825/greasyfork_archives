// ==UserScript==
// @name         Sklad Repair
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Parse HTML, click on the repair link with the highest "Вам" value, and reload page at random intervals
// @match        https://my.lordswm.com/sklad_info.php*
// @match        https://heroeswm.ru/sklad_info.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497500/Sklad%20Repair.user.js
// @updateURL https://update.greasyfork.org/scripts/497500/Sklad%20Repair.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to get a random number between min and max (inclusive)
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Function to parse and extract the desired values, then click the appropriate link
    function parseAndClick() {
        // Get all relevant elements
        var elements = document.querySelectorAll('td[bgcolor="#eeeeee"] font');

        // Regular expression to match "Ремонт: 10,000, Вам: 100"
        var regex = /Ремонт: [\d,]+, Вам: (\d+)/;

        // Variables to track the maximum value and the corresponding link
        var maxVamValue = -1;
        var maxLink = null;

        // Iterate through elements and apply the regex
        elements.forEach(function(element) {
            var textContent = element.innerHTML;

            var match = textContent.match(regex);

            if (match) {
                var vamValue = parseInt(match[1].replace(/,/g, ''), 10); // Convert to integer
                if (vamValue > maxVamValue) {
                    maxVamValue = vamValue;
                    maxLink = element.querySelector('a');
                }
            }
        });

        // Click the link with the highest "Вам" value after a random delay (2-10 seconds)
        if (maxLink) {
            var delay = getRandomInt(2000, 10000);
            setTimeout(function() {
                maxLink.click();
            }, delay);
        } else {
            console.log('No matching elements found');
        }
    }

    // Function to reload the page at random intervals (10-15 minutes)
    function scheduleReload() {
        var interval = getRandomInt(2 * 60 * 1000, 10 * 60 * 1000); // 10-15 minutes in milliseconds
        setTimeout(function() {
            location.reload();
        }, interval);
    }

    // Execute the function after the page fully loads
    window.addEventListener('load', function() {
        parseAndClick();
        scheduleReload();
    });
})();
