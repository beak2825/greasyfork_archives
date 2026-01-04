// ==UserScript==
// @name         WME City Changer
// @description  Helps remove or change the primary city.  Does NOT check for anything else.  https://greasyfork.org/en/scripts/460814-wme-city-changer
// @author       TxAgBQ
// @version      20230313.001
// @namespace    https://greasyfork.org/en/users/820296-txagbq/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @match        https://*.waze.com/*/editor*
// @match        https://*.waze.com/editor*
// @exclude      https://*.waze.com/user/editor*
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460814/WME%20City%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/460814/WME%20City%20Changer.meta.js
// ==/UserScript==

/* global W */

(function() {
    'use strict';

    document.addEventListener('keydown', (event) => {
    // Change city to None: Clicks the pencil, checks the None box, then clicks Apply to REMOVE a city -- only works when there are no HNs
        if (event.key == '`' && event.ctrlKey) {
            document.querySelector('.full-address-container .edit-button').click();
            document.querySelector('.in-label.toggle-empty wz-checkbox.empty-city').click();

            // Adds a delay to press the Apply key.  Without the delay it wasn't working
            setTimeout(() => {
                document.querySelector('.action-buttons wz-button.save-button').click();
            }, 10); // Delay the execution of the function by 10 milliseconds
        }

        // Replace the city: Clicks the pencil to allow editing and highlights the city so you can type over it to replace it
        if (event.key == '`') {
            document.querySelector('.full-address-container .edit-button').click();

            // Adds a delay to move to the city field.  Without the delay it wasn't working
            setTimeout(() => {
                // Select the text field
                let primaryCity = document.querySelector('#segment-edit-general > div.address-edit > div.address-edit-view > wz-card > form > div:nth-child(3) > wz-autocomplete').shadowRoot.querySelector('#text-input').shadowRoot.querySelector('#id');

                // Set focus on the text field
                primaryCity.focus();

                // Select any text that's already in the text field
                primaryCity.select();
            }, 10); // Delay the execution of the function by 10 milliseconds
        }
    });
})();
