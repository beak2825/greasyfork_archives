// ==UserScript==
// @name         Paltalk Remover addon for Bodega Bot
// @namespace    http://tampermonkey.net/
// @version      0.11
// @author       Bort Mack
// @icon        https://media1.giphy.com/avatars/FeedMe1219/aBrdzB77IQ5c.gif
// @description  Remove Paltalk banner on Tinychat homepage
// @match        https://tinychat.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501693/Paltalk%20Remover%20addon%20for%20Bodega%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/501693/Paltalk%20Remover%20addon%20for%20Bodega%20Bot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removePaltalkBanner() {
        const banner = document.getElementById('paltalk-bar');
        if (banner) {
            banner.style.display = 'none';
        }
    }

    // Run the function when the page loads
    removePaltalkBanner();

    // Also run the function when the DOM content is loaded (in case of dynamic content)
    document.addEventListener('DOMContentLoaded', removePaltalkBanner);

    // Create a MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                removePaltalkBanner();
            }
        });
    });

    // Configure the observer to watch for changes in the body
    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);
})();