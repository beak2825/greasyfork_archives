// ==UserScript==
// @name         Force Spell Check in AI Dungeon
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically enables spell check on AI Dungeon input fields
// @author       JerTheDudeBear
// @match        https://play.aidungeon.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534584/Force%20Spell%20Check%20in%20AI%20Dungeon.user.js
// @updateURL https://update.greasyfork.org/scripts/534584/Force%20Spell%20Check%20in%20AI%20Dungeon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to enable spell check on text inputs
    function enableSpellCheck() {
        const elements = document.querySelectorAll('textarea, [contenteditable]');
        elements.forEach(el => {
            el.spellcheck = true;
            el.setAttribute('spellcheck', 'true'); // Ensure attribute is set
        });
    }

    // Run immediately on page load
    enableSpellCheck();

    // Use a MutationObserver to catch dynamically loaded input fields
    const observer = new MutationObserver((mutations) => {
        enableSpellCheck();
    });

    // Observe changes to the DOM (e.g., when new input fields appear)
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Optional: Re-run on focus or click events for extra reliability
    document.addEventListener('focusin', enableSpellCheck);
    document.addEventListener('click', enableSpellCheck);
})();