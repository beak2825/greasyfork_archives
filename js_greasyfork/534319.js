// ==UserScript==
// @name         Remove 'Get Pro' Bar on GeoGuessr
// @namespace
// @version      1.0
// @description  Removes the "Get pro now!" bar.
// @author       spartanoah
// @match        https://www.geoguessr.com/*
// @grant        none
// @namespace https://greasyfork.org/users/1463370
// @downloadURL https://update.greasyfork.org/scripts/534319/Remove%20%27Get%20Pro%27%20Bar%20on%20GeoGuessr.user.js
// @updateURL https://update.greasyfork.org/scripts/534319/Remove%20%27Get%20Pro%27%20Bar%20on%20GeoGuessr.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function removeTicketBar() {
        const ticketBar = document.querySelector('.ticket-bar-view_root__EQofO');
        if (ticketBar) {
            ticketBar.remove();
            console.log('Ad bar removed');
        }
    }

    const observer = new MutationObserver(removeTicketBar);
    observer.observe(document.body, { childList: true, subtree: true });

    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            console.log('url changed, rechecking');
            removeTicketBar();
        }
    }, 500);
})();