// ==UserScript==
// @name         ECOD-Live-Warnings
// @namespace    ecod.live.warnings
// @version      1.0.3
// @description  Warn Users for PROD envs
// @author       CRK

// @match        https://www.retailecoscore.net/*
// @match        https://retailecoscore.net/*
// @match        https://www.ecodesigncloud.com/*
// @match        https://ecodesigncloud.com/*
// @match        https://deployment.ecodesigncloud.com/*
// @match        https://cluster-dashboard.ecodesigncloud.com/*
// @match        https://pgadmin.ecodesigncloud.com/*
// @match        https://apim.ecodesigncloud.com/*
// @match        https://rollouts-dashboard.ecodesigncloud.com/*
// @match        https://workflows.ecodesigncloud.com/*

// @grant        none
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.13.6/underscore-umd-min.js
// @downloadURL https://update.greasyfork.org/scripts/492739/ECOD-Live-Warnings.user.js
// @updateURL https://update.greasyfork.org/scripts/492739/ECOD-Live-Warnings.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Debounce function
    function debounce(func, delay) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, delay);
        };
    }
    // Function to create and append the live text
    function createLiveText() {
        var liveText = document.createElement('div');
        liveText.innerHTML = 'LIVE';
        liveText.style.position = 'fixed';
        liveText.style.padding = '3px';
        liveText.style.top = '0';
        liveText.style.left = '0';
        liveText.style.color = 'white';
        liveText.style.backgroundColor = 'red';
        liveText.style.fontSize = '40px';
        liveText.style.fontFamily = 'Arial';
        liveText.style.fontWeight = 'bold';
        liveText.style.zIndex = '9999'; // Make sure it's always on top
        document.documentElement.appendChild(liveText);
    }

    // Initial creation of the live text
    createLiveText();

    // Function to reapply live text after AJAX updates, with debounce
    const debouncedReapplyLiveText = debounce(function() {
        var liveText = document.querySelector('#liveText');
        if (!liveText) {
            createLiveText();
        }
    }, 5000); // Debounce for 5 seconds

    // Create a MutationObserver to detect changes in the DOM
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            debouncedReapplyLiveText();
        });
    });

    // Configuration of the MutationObserver
    var config = { attributes: true, childList: true, subtree: true };

    // Start observing the document
    observer.observe(document.body, config);
})();