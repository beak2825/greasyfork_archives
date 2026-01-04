// ==UserScript==
// @name         Cricheroes Redirect
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Přesměruje do zdrojáku Cricheroes.
// @author       MK
// @match        https://cricheroes.com/*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/530266/Cricheroes%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/530266/Cricheroes%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function redirect() {
        const script = document.querySelector('script[src*="_buildManifest.js"]');
        const hash = script.src.match(/static\/(.*?)\/_buildManifest.js/)[1];
        const matchId = window.location.href.match(/scorecard\/(.*)\/.?/)[1];
        window.location.href = `https://cricheroes.com/_next/data/${hash}/scorecard/${matchId}/scorecard.json`;
    }
    const checkUrlObserver = new MutationObserver(() => {
        if (window.location.href.includes("cricheroes.com/scorecard")) {
            redirect();
        }
    });

    checkUrlObserver.observe(document.body, {childList: true, subtree: true});
})();
