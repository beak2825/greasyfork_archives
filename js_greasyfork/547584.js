// ==UserScript==
// @name         Replace Google AI Studio Redirect Links with Actual Links (Link Auto-cleaner)
// @namespace    Violentmonkey userscripts by ReporterX
// @author       ReporterX
// @version      1.0
// @description  Replaces Google redirect URLs on Google AI Studio with their actual destination links. It will replace the redirect URLs once they appear. 
// @match        https://aistudio.google.com/*
// @grant        GM_xmlhttpRequest
// @connect      vertexaisearch.cloud.google.com
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?domain=aistudio.google.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547584/Replace%20Google%20AI%20Studio%20Redirect%20Links%20with%20Actual%20Links%20%28Link%20Auto-cleaner%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547584/Replace%20Google%20AI%20Studio%20Redirect%20Links%20with%20Actual%20Links%20%28Link%20Auto-cleaner%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Use a Set to keep track of links that are being processed or have been processed.
    const processedLinks = new WeakSet();

    function resolveFinalUrl(link) {
        // Mark the link as processed to avoid repeated requests.
        processedLinks.add(link);

        GM_xmlhttpRequest({
            method: "HEAD",
            url: link.href,
            onload: function(response) {
                if (response.finalUrl && response.finalUrl !== link.href) {
                    link.href = response.finalUrl;
                    // Optional: Add a visual indicator that the link has been resolved.
                    link.style.textDecoration = "underline";
                    link.style.color = '#1a0dab'; // A more traditional "visited" link color
                }
            },
            onerror: function(error) {
                console.error("Userscript Error: Could not fetch final URL for", link.href, error);
                 // Optional: Style the link to indicate an error occurred.
                link.style.color = 'red';
            }
        });
    }


    function cleanAllRedirects() {
        const links = document.querySelectorAll('a[href*="google.com/url?"], a[href*="vertexaisearch.cloud.google.com"]');

        links.forEach(link => {
            if (processedLinks.has(link)) {
                return;
            }

            let currentHref = link.href;

            // First, handle the initial google.com/url redirect if it exists.
            if (currentHref.includes('google.com/url?')) {
                 try {
                    const url = new URL(currentHref);
                    const destination = url.searchParams.get('q');
                    if (destination) {
                        currentHref = decodeURIComponent(destination);
                        link.href = currentHref; // Set the intermediate href
                    }
                } catch (e) {
                    console.error("Userscript Error: Failed to parse Google redirect URL.", e);
                    processedLinks.add(link); // Mark as processed to avoid retrying a bad link
                    return;
                }
            }


            // Now, if the link is a vertex AI redirect, resolve it to its final destination.
            if (currentHref.includes('vertexaisearch.cloud.google.com')) {
                 // Change link style to indicate it's being processed
                link.style.color = '#5f6368'; // A muted color
                link.style.textDecoration = 'underline dotted';
                resolveFinalUrl(link);
            } else {
                 // If it was just a standard google.com/url, we're done with it.
                 processedLinks.add(link);
            }
        });
    }

    // Run the function on initial page load.
    cleanAllRedirects();

    // Use a MutationObserver to handle dynamically loaded content efficiently.
    const observer = new MutationObserver(cleanAllRedirects);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();