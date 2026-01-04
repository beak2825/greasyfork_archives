// ==UserScript==
// @name         Block WebAdvisor Logo
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Blocks the WebAdvisor logo element on every site
// @author       Emree.el on instagram
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507840/Block%20WebAdvisor%20Logo.user.js
// @updateURL https://update.greasyfork.org/scripts/507840/Block%20WebAdvisor%20Logo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the WebAdvisor logo element
    function removeWebAdvisorLogo() {
        const webAdvisorLogo = document.querySelector('img[src^="chrome-extension://fheoggkfdfchfphceeifdbepaooicaho/images/web_advisor/logo.png"]');
        if (webAdvisorLogo) {
            webAdvisorLogo.remove();
        }
    }

    // Use a MutationObserver to detect changes to the DOM
    const observer = new MutationObserver(() => {
        removeWebAdvisorLogo();
    });

    // Observe changes in the entire document
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Remove the WebAdvisor logo initially
    removeWebAdvisorLogo();
})();