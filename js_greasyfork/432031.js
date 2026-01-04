// ==UserScript==
// @name            Youtube Utils
// @version         2.2.1
// @namespace       4f9da7f6dc55e285bc626dc2dfa5fc8fa9855155
// @description     A low-tech solution to a high-tech problem!
// @author          rigid_function (original code: SteveJobzniak)
// @license         https://www.apache.org/licenses/LICENSE-2.0
// @match           *://www.youtube.com/*
// @exclude         *://www.youtube.com/tv*
// @exclude         *://www.youtube.com/embed/*
// @compatible      chrome Chrome + Tampermonkey or Violentmonkey
// @compatible      firefox Firefox + Greasemonkey or Tampermonkey or Violentmonkey
// @compatible      opera Opera + Tampermonkey or Violentmonkey
// @compatible      edge Edge + Tampermonkey or Violentmonkey
// @compatible      safari Safari + Tampermonkey or Violentmonkey
// @grant           window.onurlchange
// @run-at          document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/432031/Youtube%20Utils.user.js
// @updateURL https://update.greasyfork.org/scripts/432031/Youtube%20Utils.meta.js
// ==/UserScript==
//* eslint-env browser, es6, greasemonkey */

(() => {
    'use strict';

    const config = {
        enable_dark: false, // Deprecated since Youtube now uses 'prefers-color-scheme'
        remove_PlayOnTV: true,
        remove_MiniPlayer: true,
        hijack_MiniPlayerKeybind: true, // Will disable the keybind only for the "i" character
        disable_AutoPlay: true,
        shorts_redirect: false, // Redirects shorts to the normal player like any other video
        run_on_url_change: true, // If disabled, the script will only run on page load
        verbose_logging: false
    }

    const logger = (...args) => {
        if (!config.verbose_logging) {
            return;
        }
        console.log('[YU]', ...args);
    }

    if (config.hijack_MiniPlayerKeybind) {
        logger('Hijacked miniplayer keybind')
        addEventListener("keydown", (event) => {
            // console.log('%cCalled!','color:cyan; font-size:2em', event, event.target.tagName);

            if (event.keyCode === 73) {
                if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.contentEditable === "true")
                    return;

                event.preventDefault();
                event.stopPropagation();
                return;
            }
        }, true);
    }


    /* --- START: Utils-MultiRetry v1.1 by SteveJobzniak --- */

    /* Performs multiple retries of a function call until it either succeeds or has failed all attempts. */
    const retryFnCall = function(fnCallback, maxAttempts, waitDelay) {
        try {
            // Default parameters: 40 * 50ms = Max ~2 seconds of additional retries.
            maxAttempts = (typeof maxAttempts !== 'undefined') ? maxAttempts : 40;
            waitDelay = (typeof waitDelay !== 'undefined') ? waitDelay : 50;

            // If we don't succeed immediately, we'll perform multiple retries.
            var success = fnCallback();
            if (!success) {
                var attempt = 0;
                var searchTimer = setInterval(() => {
                    var success = fnCallback();

                    // If we've reached max attempts or found success, we must now stop the interval timer.
                    if (++attempt >= maxAttempts || success) {
                        clearInterval(searchTimer);
                    }
                }, waitDelay);
            }
        }
        // Use of try in case of an error the script will not stop.
        catch (err) {
            console.error(err)
        }
    };

    /* --- END: Utils-MultiRetry by SteveJobzniak --- */

    /* --- START: Utils-ElementFinder v1.3 by SteveJobzniak --- */

    /* Searches for a specific element. */
    const findElement = function(parentElem, elemQuery, expectedLength, selectItem, fnCallback) {
        var elems = parentElem.querySelectorAll(elemQuery);
        if (elems.length === expectedLength) {
            var item = elems[selectItem];
            fnCallback(item);
            return true;
        }

        //console.log('Debug: Cannot find "'+elemQuery+'".');
        return false;
    };

    const retryFindElement = function(parentElem, elemQuery, expectedLength, selectItem, fnCallback, maxAttempts, waitDelay) {
        // If we can't find the element immediately, we'll perform multiple retries.
        retryFnCall(() => {
            return findElement(parentElem, elemQuery, expectedLength, selectItem, fnCallback);
        }, maxAttempts, waitDelay);
    };

    /* Searches for multiple different elements and uses the earliest match. */
    const multiFindElement = function(queryList, fnCallback) {
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

    const retryMultiFindElement = function(queryList, fnCallback, maxAttempts, waitDelay) {
        // If we can't find any of the elements immediately, we'll perform multiple retries.
        retryFnCall(() => {
            return multiFindElement(queryList, fnCallback);
        }, maxAttempts, waitDelay);
    };

    /* --- END: Utils-ElementFinder by SteveJobzniak --- */



    /* Automatically enables YouTube's dark mode theme. */
    const enableDark = () => {
        // Refuse to proceed if the user is on the old non-Material YouTube theme (which has no dark mode).
        // NOTE: This is just to avoid getting "error reports" by people who aren't even on YouTube's new theme.
        const oldYouTube = document.getElementById('body-container');
        if (oldYouTube && document.body.id === 'body') {
            console.error("You are using the old YouTube theme.\nThe Dark Mode only works in Youtube's new version.")
            return;
        }

        // Wait until the settings menu is available, to ensure that YouTube's "dark mode state" and code has been loaded...
        // Note that this particular menu button always exists (both when logged in and when logged out of your account),
        // but its actual icon and the list of submenu choices differ. However, its "dark mode" submenus are the same in either case.
        retryFnCall(() => {
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
                return true // Stop retrying...
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
                        setTimeout(() => {
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

    /* Automatically redirect shorts videos to the normal youtube video URL */
    const shortsRedirect = () => {
        if(!config.shorts_redirect) return;

        if (window.location.href.indexOf('youtube.com/shorts') > -1) {
            logger('Redirecting short...');
            window.location.replace(window.location.toString().replace('/shorts/', '/watch?v='));
        }
    }

    /* Automatically removes YouTube's Play on TV button. */
    const removePlayOnTV = () => {
        logger('Removing PlayOnTV...')
        retryFnCall(() => {
            // Find the element with the svg's patch id.
            const button = document.getElementsByClassName("ytp-remote-button")[0]
            if (!button) {
                logger('PlayOnTV element not found')
                return false // Failed to find any of the expected menu button counts. Retry...
            }

            // Remove the button from the video tab
            if (button) {
                logger('PlayOnTV Removed')
                button.remove();
                return true // Stop retrying...
            }
        })
    }

    /* Automatically removes YouTube's Miniplayer button. */
    const removeMiniPlayer = () => {
        logger('Removing MiniPlayer...')
        retryFnCall(() => {
            const button = document.querySelector('[data-tooltip-target-id="ytp-miniplayer-button"]');
            if (!button) {
                logger('MiniPlayer element not found')
                return false // Failed to find any of the expected menu button counts. Retry...
            }

            // Remove the button from the video tab
            if (button) {
                logger('MiniPlayer Removed')
                button.remove()
                return true // Stop retrying...
            }
        })
    }

    /* Automatically disables Autoplay mode. */
    const disableAutoPlay = () => {
        logger('Disabling Autoplay...')
        retryFnCall(() => {
            const button = document.querySelector('.ytp-autonav-toggle-button')
            const att_to_check = 'aria-checked'

            // Check the button checked state and abort processing if is already disabled.
            // Else, click the button.
            if (button) {
                if(button.getAttribute(att_to_check) === 'true') {
                    if (button.parentElement.nodeName === 'BUTTON') {
                        logger('Clicked autoplay parent button.', button.parentElement)
                        button.parentElement.click()
                    } else {
                        logger('Clicked autoplay button.', button)
                        button.click()
                    }
                    logger('Autoplay disabled!')
                    return false // Forcefully so, in case isn't loaded yet, will loop again to disable it
                } else {
                    logger('Autoplay is already disabled.')
                    return true // Stop retrying...
                }
            } else {
                logger('Autoplay element not found')
                return false // Not found, retrying
            }
        })
    }

    const runOnURLChange = () => {
        logger('runOnURLChange()')
        if (window.onurlchange === null) {
            logger('onurlchange supported')
            window.addEventListener('urlchange', (info) => {
                logger('URL Changed', info)
                awaitPageLoad(enable())
            })
        }
    }

    const enable = () => {
        logger('Enabled!')
        shortsRedirect();
        if(config.enable_dark) enableDark();
        if(config.remove_PlayOnTV) removePlayOnTV();
        if(config.remove_MiniPlayer) removeMiniPlayer();
        if(config.disable_AutoPlay) disableAutoPlay();
    }

    const awaitPageLoad = (callback) => {
        if (document.readyState === 'complete') {
            logger('Completed!')
            callback
        } else {
            logger('Document not ready, adding Event Listener...')
            document.addEventListener('readystatechange', (evt) => {
                logger('Completed!')
                if (document.readyState === 'complete') {
                    callback
                }
            })
        }
    }

    shortsRedirect();
    awaitPageLoad(enable());
    if (config.run_on_url_change) runOnURLChange();
})();
