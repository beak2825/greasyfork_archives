// ==UserScript==
// @name            Automatic Privacy Reminder Killer for YouTube
// @namespace       SteveJobzniak
// @version         1.0.2
// @description     Makes YouTube shut up about its obnoxious privacy policy reminder.
// @author          SteveJobzniak
// @homepage        https://greasyfork.org/scripts/33378-automatic-privacy-reminder-killer-for-youtube
// @license         https://www.apache.org/licenses/LICENSE-2.0
// @contributionURL https://www.paypal.me/Armindale/0usd
// @match           *://www.youtube.com/*
// @exclude         *://www.youtube.com/tv*
// @exclude         *://www.youtube.com/embed/*
// @run-at          document-end
// @grant           none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/33378/Automatic%20Privacy%20Reminder%20Killer%20for%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/33378/Automatic%20Privacy%20Reminder%20Killer%20for%20YouTube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* --- START: Utils-MultiRetry v1.1.0 by SteveJobzniak --- */

    /* Performs multiple retries of a function call until it either succeeds or has failed all attempts. */
    var retryFnCall = function(fnCallback, maxAttempts, waitDelay) {
        // Default parameters: 40 * 50ms = Max ~2 seconds of additional retries.
        maxAttempts = (typeof maxAttempts !== 'undefined') ? maxAttempts : 40;
        waitDelay = (typeof waitDelay !== 'undefined') ? waitDelay : 50;

        // If we don't succeed immediately, we'll perform multiple retries.
        var success = fnCallback();
        if (!success) {
            var attempt = 0;
            var searchTimer = setInterval(function() {
                var success = fnCallback();

                // If we've reached max attempts or found success, we must now stop the interval timer.
                if (++attempt >= maxAttempts || success) {
                    clearInterval(searchTimer);
                }
            }, waitDelay);
        }
    };

    /* --- END: Utils-MultiRetry by SteveJobzniak --- */

    /* --- START: Utils-ElementFinder v1.3.0 by SteveJobzniak --- */

    /* Searches for a specific element. */
    var findElement = function(parentElem, elemQuery, expectedLength, selectItem, fnCallback) {
        var elems = parentElem.querySelectorAll(elemQuery);
        if (elems.length === expectedLength) {
            var item = elems[selectItem];
            fnCallback(item);
            return true;
        }

        //console.log('Debug: Cannot find "'+elemQuery+'".');
        return false;
    };

    var retryFindElement = function(parentElem, elemQuery, expectedLength, selectItem, fnCallback, maxAttempts, waitDelay) {
        // If we can't find the element immediately, we'll perform multiple retries.
        retryFnCall(function() {
            return findElement(parentElem, elemQuery, expectedLength, selectItem, fnCallback);
        }, maxAttempts, waitDelay);
    };

    /* Searches for multiple different elements and uses the earliest match. */
    var multiFindElement = function(queryList, fnCallback) {
        for (var i = 0, len = queryList.length; i < len; ++i) {
            var query = queryList[i];
            var success = findElement(query.parentElem, query.elemQuery, query.expectedLength, query.selectItem, fnCallback);
            if (success) {
                // Don't try any other queries, since we've found a successful match.
                return true;
            }
        }

        return false;
    };

    var retryMultiFindElement = function(queryList, fnCallback, maxAttempts, waitDelay) {
        // If we can't find any of the elements immediately, we'll perform multiple retries.
        retryFnCall(function() {
            return multiFindElement(queryList, fnCallback);
        }, maxAttempts, waitDelay);
    };

    /* --- END: Utils-ElementFinder by SteveJobzniak --- */

    /* Automatically closes YouTube's privacy policy reminder. */
    var killPrivacyReminder = function() {
        // This privacy reminder element only exists during the page-loads that have a privacy reminder.
        // After it has been dismissed, the DOM element will be missing on subsequent website/page loads.
        retryFindElement(document, 'ytd-consent-bump-renderer ytd-button-renderer#remind-me-later-button', 1, 0, function(privacyReminderCloseButton) {
            // We don't want to interfere with any currently open popup menus (such as the settings menu),
            // so wait until no popup menus are open... (This is mainly for compatibility with my auto-dark mode script.)
            retryFnCall(function() {
                var menuIsOpen = document.querySelectorAll('iron-dropdown:not([style*="display: none"])').length > 0;
                if (menuIsOpen) {
                    return false;
                }

                // Now just click "Remind me later". It's safe to click it again
                // even if the user has already clicked it and hidden the element.
                privacyReminderCloseButton.click();
                return true;
            }, 20, 300); // If a popup menu is open, do 20 retries at 300ms intervals.
        }, 4, 750); // If privacy reminder not found, do 4 retries at 750ms intervals.
    };

    if (document.readyState === 'complete') {
        killPrivacyReminder();
    } else {
        document.addEventListener('readystatechange', function(evt) {
            if (document.readyState === 'complete') {
                killPrivacyReminder();
            }
        });
    }
})();