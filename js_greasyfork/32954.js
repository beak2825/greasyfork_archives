// ==UserScript==
// @name            Automatic Material Dark-Mode for YouTube
// @namespace       SteveJobzniak
// @version         1.7.0
// @description     A low-tech solution to a high-tech problem! Automatically clicks YouTube's "Dark Mode" button if dark mode isn't already active.
// @author          SteveJobzniak
// @homepage        https://greasyfork.org/scripts/32954-automatic-material-dark-mode-for-youtube
// @license         https://www.apache.org/licenses/LICENSE-2.0
// @contributionURL https://www.paypal.me/Armindale/0usd
// @match           *://www.youtube.com/*
// @exclude         *://www.youtube.com/tv*
// @exclude         *://www.youtube.com/embed/*
// @run-at          document-end
// @grant           none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/32954/Automatic%20Material%20Dark-Mode%20for%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/32954/Automatic%20Material%20Dark-Mode%20for%20YouTube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* --- START: Utils-MultiRetry v1.1 by SteveJobzniak --- */

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

    /* --- START: Utils-ElementFinder v1.3 by SteveJobzniak --- */

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

    /* Automatically enables YouTube's dark mode theme. */
    var enableDark = function() {
        // Refuse to proceed if the user is on the old non-Material YouTube theme (which has no dark mode).
        // NOTE: This is just to avoid getting "error reports" by people who aren't even on YouTube's new theme.
        var oldYouTube = document.getElementById('body-container');
        if (oldYouTube && document.body.id === 'body') {
            var errorMessage = 'You are using the old YouTube theme. Enable the new theme <a href="https://youtube.com/new" style="color:#fff;text-decoration:underline">here</a>.';
            var errorDiv = document.createElement('div');
            errorDiv.style.position = 'fixed';
            errorDiv.style.bottom = 0;
            errorDiv.style.left = 0;
            errorDiv.style.width = '100%';
            errorDiv.style.padding = '10px';
            errorDiv.style.textAlign = 'center';
            errorDiv.style.fontSize = '130%';
            errorDiv.style.fontWeight = 'bold';
            errorDiv.style.color = '#fff';
            errorDiv.style.backgroundColor = 'rgba(244, 67, 54, 0.9)';
            errorDiv.style.zIndex = '99999';
            errorDiv.innerHTML = errorMessage;
            document.body.appendChild(errorDiv);

            return;
        }

        // Wait until the settings menu is available, to ensure that YouTube's "dark mode state" and code has been loaded...
        // Note that this particular menu button always exists (both when logged in and when logged out of your account),
        // but its actual icon and the list of submenu choices differ. However, its "dark mode" submenus are the same in either case.
        retryFnCall(function() {
            // The menu button count varies based on the browser. We expect to find either 2 or 3 buttons, and the settings menu
            // is always the last button (even when logged in). Sadly there is no better way to find the correct button,
            // since YouTube doesn't have any identifiable language-agnostic labels or icons in the HTML. Sigh...
            var buttons = document.querySelectorAll('ytd-topbar-menu-button-renderer button');
            if (buttons.length !== 2 && buttons.length !== 3) {
                return false; // Failed to find any of the expected menu button counts. Retry...
            }
            var settingsMenuButton = buttons[buttons.length - 1];

            // Check the dark mode state "flag" and abort processing if dark mode is already active.
            if (document.documentElement.getAttribute('dark') === 'true') {
                return true; // Stop retrying...
            }

            // We MUST open the "settings" menu, otherwise nothing will react to the "toggle dark mode" event!
            settingsMenuButton.click();

            // Wait a moment for the settings-menu to open up after clicking...
            retryFindElement(document, 'div#label.style-scope.ytd-toggle-theme-compact-link-renderer', 1, 0, function(darkModeSubMenuButton) {
                // Next, go to the "toggle dark mode" settings sub-page.
                darkModeSubMenuButton.click();

                // Wait a moment for the settings sub-page to switch...
                retryFindElement(document, 'ytd-toggle-item-renderer.style-scope.ytd-multi-page-menu-renderer', 1, 0, function(darkModeSubPageContainer) {
                    // Get a reference to the "activate dark mode" button...
                    retryFindElement(darkModeSubPageContainer, 'paper-toggle-button.style-scope.ytd-toggle-item-renderer', 1, 0, function(darkModeButton) {
                        // We MUST now use this very ugly, hardcoded sleep-timer to ensure that YouTube's "activate dark mode" code is fully
                        // loaded; otherwise, YouTube will be completely BUGGED OUT and WON'T save the fact that we've enabled dark mode!
                        // Since JavaScript is single-threaded, this timeout simply ensures that we'll leave our current code so that we allow
                        // YouTube's event handlers to deal with loading the settings-page, and then the timeout gives control back to us.
                        setTimeout(function() {
                            // Now simply click YouTube's button to enable their dark mode.
                            darkModeButton.click();

                            // And lastly, give keyboard focus back to the input search field... (We don't need any setTimeout here...)
                            retryFindElement(document, 'input#search', 1, 0, function(searchField) {
                                searchField.click(); // First, click the search-field to force the settings-panel to close...
                                searchField.focus(); // ...and finally give the search-field focus! Voila!
                            });
                        }, 30); // We can use 0ms here for "as soon as possible" instead, but our "at least 30ms" might be safer just in case.
                    });
                });
            });

            return true; // Stop retrying, since we've found and clicked the menu...
        }, 120, 50); // 120 * 50ms = ~6 seconds of retries.

        // Alternative method, which switches using an internal YouTube event instead of clicking
        // the menus... I decided to disable this method, since it relies on intricate internal
        // details, and it still requires their menu to be open to work anyway (because their
        // code for changing theme isn't active until the Dark Mode settings menu is open),
        // so we may as well just click the actual menu items. ;-)
        /*
        var ytDebugMenu = document.querySelectorAll('ytd-debug-menu');
        ytDebugMenu = (ytDebugMenu.length === 1 ? ytDebugMenu[0] : undefined);
        if( ytDebugMenu ) {
            ytDebugMenu.fire(
                'yt-action',
                {
                    actionName:'yt-signal-action-toggle-dark-theme-on',
                    optionalAction:false,
                    args:[
                        {signalAction:{signal:'TOGGLE_DARK_THEME_ON'}},
                        toggleMenuElem,
                        undefined
                    ],
                    returnValue: []
                },
                {}
            );
        }
        */

        // Also note that it may be possible to simply modify the YouTube cookies, by changing
        // "PREF=f1=50000000;" to "PREF=f1=50000000&f6=400;" (dark mode on) and then reloading the page.
        // However, a reload is always slower than toggling the settings menu, so I didn't do that.
    };

    if (document.readyState === 'complete') {
        enableDark();
    } else {
        document.addEventListener('readystatechange', function(evt) {
            if (document.readyState === 'complete') {
                enableDark();
            }
        });
    }
})();