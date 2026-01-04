// ==UserScript==
// @name        Show all Jira 9 comments (and more), in chronological order
// @namespace   https://greasyfork.org/users/1047370
// @description Clicks all 'show more' buttons, and (shift-)clicks 'oldest first'. Works on Jira 9.4.5. Inspired by https://greasyfork.org/scripts/432731 (no external dependencies).
// @include     https://jira.*
// @include     http://jira.*
// @match       https://jira.*
// @match       http://jira.*
// @version     0.2
// @author      Marnix Klooster <marnix.klooster@gmail.com>
// @copyright   public domain
// @license     public domain
// @homepage    https://greasyfork.org/scripts/472161
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/472161/Show%20all%20Jira%209%20comments%20%28and%20more%29%2C%20in%20chronological%20order.user.js
// @updateURL https://update.greasyfork.org/scripts/472161/Show%20all%20Jira%209%20comments%20%28and%20more%29%2C%20in%20chronological%20order.meta.js
// ==/UserScript==

// Configuration options
// ---------------------
const forceSortOrder = true; // whether or not to force the sort order at page load
const useOldestFirstSorting = true; // if forcing sort order, whether to use 'oldest first' == 'asc'
// END Configuration options

(function() {
    var theInterval = null;
    var warnedMultipleSortButtons = false;
    var clickedSortorderButton = false;
    var sortOrderInFinalState = false;
    var clickedShowmoreButton = null;
    var tabSwitchEventHandlerInstalled = false;

    function start() {
        if (theInterval) {
            console.log(`SOMETHING WENT WRONG.  Ignoring this call to start().`);
            return;
        }

        theInterval = setInterval(function() {
            // make sure sort order is as desired (direction determined by useOldestFirstSorting)
            if (forceSortOrder && !sortOrderInFinalState) {
                var sortButtons = document.querySelectorAll('button#sort-button');
                if (sortButtons.length > 1) {
                    if (!warnedMultipleSortButtons) {
                        console.log(`WARN: ${b.length} sort buttons found, will not try to change sort order`);
                        warnedMultipleSortButtons = true;
                    }
                } else if (sortButtons.length == 0) {
                    // retry later
                } else {
                    if (sortButtons[0].getAttribute('data-order') == (useOldestFirstSorting ? 'asc': 'desc')) {
                        if (!clickedSortorderButton) {
                            console.log(`Clicking the sort order button to switch to '${sortButtons[0].getAttribute('data-order')}'...`);
                            sortButtons[0].click();
                            clickedSortorderButton = true;
                            return;
                        }
                        console.log(`waiting for sort order change`);
                        // don't do anything else until we know the sort order is as we want it to be
                        return;
                    }
                }
            }

            // click any 'show more' button in sight...
            var showmoreButtons = document.querySelectorAll('button.show-more-tab-items');
            if (clickedShowmoreButton) {
                for (var b of showmoreButtons) {
                    if (b.isEqualNode(clickedShowmoreButton)) {
                        console.log(`waiting for last "show more..." click to have been handled`);
                        return;
                    }
                }
                clickedShowmoreButton = null;
                console.log(`wait one more round, just to be certain, before we potentially click other "show more..." buttons`);
                return;
            }
            if (showmoreButtons.length > 0) {
                clickedShowmoreButton = showmoreButtons[0];
                console.log(`Shift-clicking the button marked "${clickedShowmoreButton.innerText}"...`);
                const shiftClickEvent = document.createEvent("Event");
                shiftClickEvent.initEvent("click", true, true);
                shiftClickEvent.shiftKey = true;
                clickedShowmoreButton.dispatchEvent(shiftClickEvent);
                return;
            }

            // LATER: Enable the following code, once we know how to detect a tab switch
            //function tabSwitchEventHandler() {
            //    console.log(`tab bar may have been clicked, restart if needed...`);
            //    if (!theInterval) {
            //        console.log(`...restarting`);
            //        start();
            //    }
            //}
            //
            //if (!tabSwitchEventHandlerInstalled) {
            //    // TODO: somewhere register tabSwitchEventHandler...
            //    tabSwitchEventHandlerInstalled = true;
            //}
            //
            //console.log(`Everything is at it should be now; stop, and restart the interval on tab switch.`);
            //clearInterval(theInterval);
            //theInterval = null;
        }, 1000);
    }

    start();
})();