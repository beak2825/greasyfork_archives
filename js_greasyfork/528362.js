// ==UserScript==
// @name         Woolworths check stock
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Check if the commodity you want to buy is in stock of a particular Woolworths store.
// @author       dont-be-evil
// @match        https://www.woolworths.co.nz/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/528362/Woolworths%20check%20stock.user.js
// @updateURL https://update.greasyfork.org/scripts/528362/Woolworths%20check%20stock.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a MutationObserver to detect changes in the document
    const observer = new MutationObserver(() => {
        if (!location.href.includes("/shop/productdetails")) {
            return;
        }
        const params = new URLSearchParams(location.search);
        let store = params.get("store");
        if (store) {
            localStorage.setItem("store", store);
        } else {
            const new_url = new URL(location.href);
            const saved_store = localStorage.getItem("store");
            if (saved_store) {
                store = saved_store;
            } else {
                store = 9057; // Ponsonby, Auckland
            }
            new_url.searchParams.set("store", store);
            location.href = new_url.toString();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
