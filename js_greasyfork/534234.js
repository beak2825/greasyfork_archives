// ==UserScript==
// @name         Youtube Home Rescaler
// @namespace    LeKAKiD
// @version      2025-04-25
// @description  I can fix it
// @author       LeKAKiD
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534234/Youtube%20Home%20Rescaler.user.js
// @updateURL https://update.greasyfork.org/scripts/534234/Youtube%20Home%20Rescaler.meta.js
// ==/UserScript==

(async function() {
    const grid = await new Promise((resolve) => {
        const observer = new MutationObserver(() => {
            const element = document.querySelector('#primary > ytd-rich-grid-renderer');
            if(element) {
                resolve(element);
                observer.disconnect();
            }
        });
        observer.observe(document.body, {childList: true, subtree: true});
    });

    grid.style.setProperty('--ytd-rich-grid-items-per-row', 4);
    const observer = new MutationObserver(() => {
        grid.style.setProperty('--ytd-rich-grid-items-per-row', 4);
    });
    observer.observe(grid, {attributes: true});
})();