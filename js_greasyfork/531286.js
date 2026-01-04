// ==UserScript==
// @name         GGn Select All Notifications
// @namespace    http://tampermonkey.net/
// @version      1.1
// @match        https://gazellegames.net/torrents.php*action=delete_notify*
// @match        https://gazellegames.net/torrents.php*action=notify*
// @description  Add a "Select All" button to select all checkboxes for torrents on both the notifications page and delete notification page
// @author       SleepingGiant
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531286/GGn%20Select%20All%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/531286/GGn%20Select%20All%20Notifications.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addSelectAllButton() {
        var selectAllButton = document.createElement('button');
        selectAllButton.innerText = 'Select All';

        // Add the 'button' class to apply the existing page styles
        selectAllButton.classList.add('button', 'input[type=submit]', 'input[type=button]');

        var container = document.querySelector('.center');

        if (container) {
            // Insert the button into the container
            container.appendChild(selectAllButton);

            selectAllButton.addEventListener('click', function () {
                var checkboxes = document.querySelectorAll('input[type="checkbox"]');
                if (checkboxes.length > 0) {
                    var allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
                    checkboxes.forEach(function (checkbox) {
                        checkbox.checked = !allChecked;
                    });
                }
            });

            // Once the button is added, stop further retries
            clearInterval(intervalId);
        }
    }

    // Retry adding the button every 100ms, up to 100 times
    let retryCount = 0;
    let maxRetries = 100;
    let intervalId = setInterval(function() {
        addSelectAllButton();
        retryCount++;

        if (retryCount >= maxRetries) {
            clearInterval(intervalId);
            console.log('Max retries reached. Stopping attempts.');
        }
    }, 75);
})();
