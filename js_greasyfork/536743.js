// ==UserScript==
// @name         Greasy Fork Direct Install (TypeScript)
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Modifies Greasy Fork "Install" buttons to point directly to the .user.js file, bypassing the intermediate page. (TS Version)
// @author       Your Name/AI
// @match        https://greasyfork.org/*/scripts/*-*
// @exclude      https://greasyfork.org/*/scripts/*-*/code
// @exclude      https://greasyfork.org/*/scripts/*-*/code/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      greasyfork.org
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536743/Greasy%20Fork%20Direct%20Install%20%28TypeScript%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536743/Greasy%20Fork%20Direct%20Install%20%28TypeScript%29.meta.js
// ==/UserScript==

"use strict";
(function () {
    'use strict';
    const installButtonSelector = 'a.install-link#install-button[href*="/code"]';
    const installButton = document.querySelector(installButtonSelector);
    if (installButton) {
        const codePageUrl = installButton.href;
        if (codePageUrl && codePageUrl.includes('/code') && !codePageUrl.endsWith('.user.js')) {
            console.log('[GF Direct Install TS] Found install button. Initiating fetch for direct link...');
            const originalButtonText = installButton.textContent || 'Install';
            installButton.textContent = 'Fetching Direct Link...';
            installButton.style.opacity = '0.7'; // Dim the button
            GM_xmlhttpRequest({
                method: "GET",
                url: codePageUrl,
                timeout: 10000, // Add a timeout (e.g., 10 seconds)
                onload: function (response) {
                    installButton.textContent = originalButtonText; // Restore text
                    installButton.style.opacity = '1'; // Restore opacity
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(response.responseText, "text/html");
                            const directInstallLinkElement = doc.querySelector('#install-area a.install-link[href$=".user.js"], a.install-link[href$=".user.js"]');
                            if (directInstallLinkElement) {
                                const directUserJsUrl = directInstallLinkElement.href;
                                console.log('[GF Direct Install TS] Direct .user.js URL found:', directUserJsUrl);
                                installButton.href = directUserJsUrl;
                                installButton.textContent = originalButtonText + ' (Direct)';
                                GM_addStyle(`
                                    ${installButtonSelector} {
                                        background-color: #4CAF50 !important;
                                        border-color: #388E3C !important;
                                        color: white !important;
                                    }
                                    ${installButtonSelector}:hover {
                                        background-color: #388E3C !important;
                                    }
                                `);
                                console.log('[GF Direct Install TS] Install button successfully updated for direct installation.');
                            }
                            else {
                                console.warn('[GF Direct Install TS] Direct .user.js link not found on the fetched code page:', codePageUrl);
                            }
                        }
                        catch (e) { // Catch specific error type if possible, or use 'any'/'unknown'
                            console.error('[GF Direct Install TS] Error parsing code page DOM:', e.message || e);
                        }
                    }
                    else {
                        console.error(`[GF Direct Install TS] Failed to fetch code page. Status: ${response.status} - ${response.statusText}`);
                    }
                },
                onerror: function (response) {
                    installButton.textContent = originalButtonText; // Restore text
                    installButton.style.opacity = '1'; // Restore opacity
                    // Use response.error for the primary error message
                    console.error(`[GF Direct Install TS] Network error fetching code page: ${response.error || response.statusText || 'Unknown network error'} (Status: ${response.status})`, response);
                },
                ontimeout: function () {
                    installButton.textContent = originalButtonText; // Restore text
                    installButton.style.opacity = '1'; // Restore opacity
                    console.warn('[GF Direct Install TS] Request timed out while fetching code page.');
                }
            });
        }
        else if (codePageUrl && codePageUrl.endsWith('.user.js')) {
            console.log('[GF Direct Install TS] Button already points to a .user.js file. No action needed.');
        }
        else {
            console.log('[GF Direct Install TS] Install button found, but its href does not appear to be a /code page link:', codePageUrl);
        }
    }
    else {
        console.log('[GF Direct Install TS] No primary install button found on this page.');
    }
})();
