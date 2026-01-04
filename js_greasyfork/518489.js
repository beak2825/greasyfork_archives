// ==UserScript==
// @name         Steam Workshop Subscribe Button Injector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enhances Steam Workshop browsing by adding subscribe buttons to items lacking them.
// @author       Your Name
// @match        https://steamcommunity.com/workshop/browse/?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518489/Steam%20Workshop%20Subscribe%20Button%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/518489/Steam%20Workshop%20Subscribe%20Button%20Injector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to inject subscribe buttons into workshop items
    function injectSubscribeButtons() {
        // Selecting all workshop items on the page
        var items = document.querySelectorAll('.ugc');
        
        // Iterating through each item
        items.forEach(function(item) {
            // Retrieving item and app IDs
            var itemID = item.dataset.publishedfileid;
            var appID = item.dataset.appid;
            
            // Checking if IDs are present
            if (itemID && appID) {
                // Creating HTML for subscribe button and controls
                var controlsHTML = `
                    <div class="workshopItemSubscriptionControls aspectratio_square" style="position: relative; top: -35px;">
                        <span class="action_wait" id="action_wait_${itemID}" style="display: none;">
                            <img src="https://community.fastly.steamstatic.com/public/images/login/throbber.gif">
                        </span>
                        <span onclick="SubscribeInlineItem('${itemID}', '${appID}'); return false;" id="SubscribeItemBtn${itemID}" class="general_btn subscribe">
                            <div class="subscribeIcon"></div>
                        </span>
                    </div>
                `;
                
                // Inserting the subscribe button HTML into the item
                item.insertAdjacentHTML('beforeend', controlsHTML);
            }
        });
    }

    // Event listener for when the page finishes loading
    window.addEventListener('load', injectSubscribeButtons);

})();
