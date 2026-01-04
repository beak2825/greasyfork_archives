// ==UserScript==
// @name         ECOD-Demo-Warnings
// @namespace    ecod.demo.warnings
// @version      1.0.4
// @description  Warn Users for DEMO envs
// @author       CRK

// @match        https://demo.retailecoscore.net/*
// @match        https://demo.ecodesigncloud.com/*
// @match        https://www.demo.retailecoscore.net/*
// @match        https://www.demo.ecodesigncloud.com/*
// @match        https://cluster-dashboard.demo.ecodesigncloud.com/*
// @match        https://deployment.demo.ecodesigncloud.com/*
// @match        https://workflows.demo.ecodesigncloud.com/*
// @match        https://rollouts-dashboard.demo.ecodesigncloud.com/*
// @match        https://apim.demo.ecodesigncloud.com/*
// @match        https://pgadmin.demo.ecodesigncloud.com/*

// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492740/ECOD-Demo-Warnings.user.js
// @updateURL https://update.greasyfork.org/scripts/492740/ECOD-Demo-Warnings.meta.js
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
        liveText.innerHTML = 'DEMO';
        liveText.style.position = 'fixed';
        liveText.style.padding = '3px';
        liveText.style.top = '0';
        liveText.style.left = '0';
        liveText.style.color = 'white';
        liveText.style.backgroundColor = 'magenta';
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