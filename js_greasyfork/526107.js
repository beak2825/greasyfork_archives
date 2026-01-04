// ==UserScript==
// @name         Redirect X Home to List
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Redirect any X home URL to a specific list, even on client-side navigations
// @author       Max
// @match        *://x.com/*
// @match        *://twitter.com/*
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526107/Redirect%20X%20Home%20to%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/526107/Redirect%20X%20Home%20to%20List.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let listUrl = "https://x.com/i/lists/1867287535287669056";

    function redirectIfHome() {
        let path = window.location.pathname.toLowerCase();
        let params = window.location.search.toLowerCase();

        if (path === "/" || path.includes("/home") || params.includes("home")) {
            window.location.replace(listUrl);
        }
    }

    // Run on first load
    redirectIfHome();

    // Detect URL changes (client-side navigation)
    const observer = new MutationObserver(() => {
        redirectIfHome();
    });

    observer.observe(document, { subtree: true, childList: true });
})();
