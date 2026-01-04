// ==UserScript==
// @name         Greasy Fork Direct Install
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Modifies Greasy Fork "Install" buttons to point directly to the .user.js file, bypassing the intermediate page.
// @author       r9em97
// @match        https://greasyfork.org/*/scripts/*-*
// @exclude      https://greasyfork.org/*/scripts/*-*/code
// @exclude      https://greasyfork.org/*/scripts/*-*/code/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      greasyfork.org
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536737/Greasy%20Fork%20Direct%20Install.user.js
// @updateURL https://update.greasyfork.org/scripts/536737/Greasy%20Fork%20Direct%20Install.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Selector for the main "Install this script" button on script overview pages
    const installButtonSelector = 'a.install-link#install-button[href*="/code"]';
    const installButton = document.querySelector(installButtonSelector);

    if (installButton) {
        const codePageUrl = installButton.href; // URL to the intermediate /code page

        // Ensure it's a link to a /code page and not already a .user.js link
        if (codePageUrl && codePageUrl.includes('/code') && !codePageUrl.endsWith('.user.js')) {
            console.log('[GF Direct Install] Found install button. Fetching code page:', codePageUrl);

            GM_xmlhttpRequest({
                method: "GET",
                url: codePageUrl,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, "text/html");

                        // Selector for the actual .user.js link on the /code page
                        // This link is usually within a div with id="install-area" or similar,
                        // and it's an <a> tag with href ending in .user.js
                        // GreasyFork seems to use `a.install-link` for this too.
                        const directInstallLinkElement = doc.querySelector('#install-area a.install-link[href$=".user.js"], a.install-link[href$=".user.js"]');

                        if (directInstallLinkElement) {
                            const directUserJsUrl = directInstallLinkElement.href;
                            console.log('[GF Direct Install] Found direct .user.js URL:', directUserJsUrl);

                            // Update the original button's href
                            installButton.href = directUserJsUrl;

                            // Optional: Visual feedback
                            installButton.textContent += ' (Direct)'; // Append text
                            GM_addStyle(`
                                ${installButtonSelector} {
                                    background-color: #4CAF50 !important; /* A nice green */
                                    border-color: #388E3C !important;
                                    color: white !important;
                                }
                                ${installButtonSelector}:hover {
                                    background-color: #388E3C !important;
                                }
                            `);
                            console.log('[GF Direct Install] Button updated for direct installation.');
                        } else {
                            console.warn('[GF Direct Install] Could not find the direct .user.js link on the fetched code page:', codePageUrl);
                            // For debugging, you might want to log the response if the link isn't found
                            // console.log(response.responseText);
                        }
                    } else {
                        console.error('[GF Direct Install] Failed to fetch code page. Status:', response.status, response.statusText);
                    }
                },
                onerror: function(error) {
                    console.error('[GF Direct Install] Error fetching code page:', error);
                }
            });
        } else if (codePageUrl && codePageUrl.endsWith('.user.js')) {
            // This case should ideally not be hit if the main selector is correct,
            // but good to log if it does.
            console.log('[GF Direct Install] Button already points to .user.js, no action needed.');
        } else {
            console.log('[GF Direct Install] Install button found, but its href does not seem to be a /code page link:', codePageUrl);
        }
    } else {
        // This message will appear on pages that don't have the primary install button, which is normal.
        // console.log('[GF Direct Install] No primary install button found on this page.');
    }
})();