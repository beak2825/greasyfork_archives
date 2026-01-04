// ==UserScript==
// @name         AI-MIDI 'Buy me a coffee' disabler
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Removes the 'Buy me a coffee' prompt
// @author       TheApkDownloader
// @icon         https://ai-midi.com/favicon.png
// @license      GNU GPLv3
// @match        https://ai-midi.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521344/AI-MIDI%20%27Buy%20me%20a%20coffee%27%20disabler.user.js
// @updateURL https://update.greasyfork.org/scripts/521344/AI-MIDI%20%27Buy%20me%20a%20coffee%27%20disabler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeModalAndEnableScroll() {
        const modal = document.querySelector('.MuiModal-root.css-8ndowl');
        if (modal) {
            modal.remove();
        }

        document.body.style.overflow = 'auto';
    }

    const observer = new MutationObserver(() => {
        removeModalAndEnableScroll();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    removeModalAndEnableScroll();

    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const response = await originalFetch(...args);
        const clone = response.clone();
        clone.text().then(text => {
            if (args[0].includes('buy_me_a_coffee.png')) {
                location.reload();
            }
        });
        return response;
    };
})();
