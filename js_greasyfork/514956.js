// ==UserScript==
// @name         EP Anti-snitch
// @namespace    http://greasyfork.org/
// @version      1.0
// @description  No more EP snitching on you being on another tab/window!
// @author       JoshAtticus
// @match        *://*.educationperfect.com/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/514956/EP%20Anti-snitch.user.js
// @updateURL https://update.greasyfork.org/scripts/514956/EP%20Anti-snitch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Block the specified URLs
    const blockedUrls = [
        'services.educationperfect.com/json.rpc?target=nz.co.LanguagePerfect.Services.PortalsAsync.App.AppServicesPortal.SubmitTaskMonitoringStatus',
        'services.educationperfect.com/json.rpc?target=nz.co.LanguagePerfect.Services.PortalsAsync.App.UserProfileFactsPortal.GetValues',
        'services.educationperfect.com/json.rpc?target=nz.co.LanguagePerfect.Services.PortalsAsync.App.AppServicesPortal.GetTaskMonitoringStatus',
        'services.educationperfect.com/json.rpc?target=nz.co.LanguagePerfect.Services.PortalsAsync.App.UserProfileFactsPortal.SetValues'
    ];

    // Intercept and block the requests to the specified URLs
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        for (const url of blockedUrls) {
            if (arguments[1].includes(url)) {
                console.log(`Blocked request to: ${arguments[1]}`);
                return; // Cancel the request
            }
        }
        originalOpen.apply(this, arguments);
    };

    // Function to remove the focus tracking popup element
    function removeFocusTrackingPopup() {
        const popup = document.querySelector('ep-focus-tracking-popup');
        if (popup) {
            popup.remove();
            console.log('Focus tracking popup removed');
        }
    }

    // Create a MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver(() => {
        removeFocusTrackingPopup();
    });

    // Start observing the document for changes
    observer.observe(document, { childList: true, subtree: true });

    // Initial removal of the popup if it's already present
    removeFocusTrackingPopup();
})();
