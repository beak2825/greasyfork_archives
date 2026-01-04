// ==UserScript==
// @name         Civitai Showcase All
// @namespace    http://tampermonkey.net/
// @version      2025-10-15
// @description  Showcase all items in Civitai user page
// @author       SLAPaper
// @match        https://civitai.com/user/*
// @match        https://civitai.green/user/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=civitai.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543940/Civitai%20Showcase%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/543940/Civitai%20Showcase%20All.meta.js
// ==/UserScript==

function deal_with_rows(el) {
    el.style.removeProperty('--rows');
    el.style.setProperty('grid-auto-rows', 'auto');
}

(function() {
    'use strict';

    // Your code here...
    const observer = new MutationObserver(() => {
        const elements = document.querySelectorAll('div[class^="ShowcaseGrid_grid__"]');
        elements.forEach(el => deal_with_rows(el));
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();