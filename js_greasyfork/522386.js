// ==UserScript==
// @name         ChatGPT Temporary Chat Toggle without reloading the web
// @namespace    http://tampermonkey.net/
// @version      3
// @description  Toggle temporary chat mode on chaptgpt with double shift key press without reloading
// @match        https://chatgpt.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522386/ChatGPT%20Temporary%20Chat%20Toggle%20without%20reloading%20the%20web.user.js
// @updateURL https://update.greasyfork.org/scripts/522386/ChatGPT%20Temporary%20Chat%20Toggle%20without%20reloading%20the%20web.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DOUBLE_TAP_TIMEOUT = 500;
    let firstShiftPressTime = null;
    let isShiftHeld = false;
    let savedChatChannel = null;

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    function handleKeyDown(e) {
        if (e.key !== 'Shift'&& e.location===KeyboardEvent.DOM_KEY_LOCATION_LEFT) return;

        if (isShiftHeld) {
            return;
        }

        const currentTime = Date.now();
        isShiftHeld = true;

        if (firstShiftPressTime && currentTime - firstShiftPressTime <= DOUBLE_TAP_TIMEOUT) {
            toggleTemporaryChat();
            firstShiftPressTime = null;
        } else {
            firstShiftPressTime = currentTime;
        }
    }

    function handleKeyUp(e) {
        if (e.key === 'Shift' && e.location===KeyboardEvent.DOM_KEY_LOCATION_LEFT) {
            isShiftHeld = false;
        }
    }

    function toggleTemporaryChat() {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);

        if (params.get('temporary-chat') === 'true') {
            if (savedChatChannel) {
                history.replaceState(null, '', savedChatChannel);
                savedChatChannel = null;
            } else {
                //history.replaceState(null, '', '/');  // fix it can't go to the home page with this
                window.location.href = 'https://chatgpt.com';
            }
        } else {
            if (url.pathname.startsWith('/c/')) {
                savedChatChannel = url.pathname + url.search + url.hash;
            }
            params.set('temporary-chat', 'true');
            history.replaceState(null, '', `/?${params.toString()}`);
        }

        // trigger URL change event for SPA frameworks
        window.dispatchEvent(new PopStateEvent('popstate', { state: history.state }));
    }
})();

// ==Copyright==
// This script is the intellectual property of the author. Unauthorized copying, modification,
// or redistribution of this script, in whole or in part, is strictly prohibited without explicit
// prior written permission from the author.
// ==End of Copyright==