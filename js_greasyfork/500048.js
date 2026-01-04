// ==UserScript==
// @name         Transfermarkt Hide Non-Live Results and Categories
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide tables without liveresult
// @author       Your Name
// @include      /^https?:\/\/(www\.)?transfermarkt\..*\/ticker\/index\/live/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=transfermarkt.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500048/Transfermarkt%20Hide%20Non-Live%20Results%20and%20Categories.user.js
// @updateURL https://update.greasyfork.org/scripts/500048/Transfermarkt%20Hide%20Non-Live%20Results%20and%20Categories.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide tables without 'liveresult' class and their preceding 'kategorie' divs
    function hideNonLiveResultTablesAndCategories() {
        const tables = document.querySelectorAll('#spieltagsbox > table');
        tables.forEach(table => {
            if (!table.querySelector('.liveresult')) {
                table.style.display = 'none';
                // Find the preceding sibling with class 'kategorie' and hide it
                let prevSibling = table.previousElementSibling;
                while (prevSibling) {
                    if (prevSibling.classList && prevSibling.classList.contains('kategorie')) {
                        prevSibling.style.display = 'none';
                        break;
                    }
                    prevSibling = prevSibling.previousElementSibling;
                }
            }
        });
    }

    // Wait for the content to fully load before running the function
    window.addEventListener('load', hideNonLiveResultTablesAndCategories);
})();
