// ==UserScript==
// @name         YouTube Live Chat Popout: Silent Switch to Live Chat
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Switch YouTube live chat popout to "Live chat" automatically, without triggering requestStorageAccessFor error
// @match        https://www.youtube.com/live_chat*
// @grant        none
// @license 	 MIT
// @downloadURL https://update.greasyfork.org/scripts/535711/YouTube%20Live%20Chat%20Popout%3A%20Silent%20Switch%20to%20Live%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/535711/YouTube%20Live%20Chat%20Popout%3A%20Silent%20Switch%20to%20Live%20Chat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for an element to appear in the DOM
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const interval = 100;
            let elapsed = 0;
            const checkExist = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(checkExist);
                    resolve(el);
                }
                elapsed += interval;
                if (elapsed >= timeout) {
                    clearInterval(checkExist);
                    reject(`Element ${selector} not found`);
                }
            }, interval);
        });
    }

    async function silentSwitchToLiveChat() {
        try {
            // Wait for the dropdown menu to be rendered (it is always in the DOM, just hidden)
            const listbox = await waitForElement('tp-yt-paper-listbox#menu');

            // Find all <a> options
            const options = Array.from(listbox.querySelectorAll('a.yt-simple-endpoint.style-scope.yt-dropdown-menu'));

            // Find the "Live chat" option and the currently selected option
            let liveChatOption = null, selectedOption = null;
            for (const opt of options) {
                const itemDiv = opt.querySelector('div.item');
                if (itemDiv) {
                    if (itemDiv.textContent.trim() === "Live chat") {
                        liveChatOption = opt;
                    }
                    if (opt.classList.contains('iron-selected')) {
                        selectedOption = opt;
                    }
                }
            }

            if (liveChatOption && !liveChatOption.classList.contains('iron-selected')) {
                // Deselect the currently selected option
                if (selectedOption) {
                    selectedOption.classList.remove('iron-selected');
                    selectedOption.setAttribute('aria-selected', 'false');
                }

                // Select the Live chat option
                liveChatOption.classList.add('iron-selected');
                liveChatOption.setAttribute('aria-selected', 'true');

                // Dispatch the correct events so Polymer/YouTube notices the change
                // First, dispatch the native 'click' event (not mouse event)
                liveChatOption.dispatchEvent(new Event('click', {bubbles: true}));

                // Also dispatch the Polymer 'iron-select' event on the listbox
                listbox.selected = options.indexOf(liveChatOption);
                listbox.dispatchEvent(new CustomEvent('iron-select', {bubbles: true, detail: {item: liveChatOption}}));

                // Optionally, reload chat messages (YouTube usually does this automatically)
                // document.querySelector('yt-live-chat-item-list-renderer').reload(); // Uncomment if needed

                console.log('[YT Live Chat] Switched to Live chat silently');
            } else {
                console.log('[YT Live Chat] Already in Live chat or option not found');
            }
        } catch (e) {
            console.error('[YT Live Chat] Error:', e);
        }
    }

    // Run on load and on YouTube SPA navigation
    window.addEventListener('yt-page-data-updated', () => setTimeout(silentSwitchToLiveChat, 1000));
    window.addEventListener('load', () => setTimeout(silentSwitchToLiveChat, 1000));
    setTimeout(silentSwitchToLiveChat, 2000);
})();
