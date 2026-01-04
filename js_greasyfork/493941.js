// ==UserScript==
// @name         Oracle Cloud Console Session Keep-Alive
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  keep Oracle Cloud Console session alive by making AJAX requests
// @author       Your Name
// @match        https://cloud.oracle.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493941/Oracle%20Cloud%20Console%20Session%20Keep-Alive.user.js
// @updateURL https://update.greasyfork.org/scripts/493941/Oracle%20Cloud%20Console%20Session%20Keep-Alive.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configure the request interval (in milliseconds).
    var requestInterval = 60000; // 1 min
    
    if(!window.oracleCloudkeepAliveScriptInitialized) window.oracleCloudkeepAliveScriptInitialized=1; else return;

    setInterval(function() {
        // URL to request; ensure it's correct and allowed to be requested from the browser.
        var url = 'https://cloud.oracle.com/plugins/compute/latest/prod-oc1-index.tpl.html?region=sa-saopaulo-1';

        // Fetch the URL
        fetch(url, {
            method: 'GET', // or 'POST' depending on what's necessary for your context
            credentials: 'include' // This might be necessary to include session cookies
        })
        .then(response => {
            if (response.ok) {
                console.log('Session refresh successful.');
                return response.text(); // or process it differently if needed
            }
            throw new Error('Session refresh failed: ' + response.statusText);
        })
        .catch(error => {
            console.error('Error refreshing session:', error);
        });
    }, requestInterval);
})();
