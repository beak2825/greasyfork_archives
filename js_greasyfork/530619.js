// ==UserScript==
// @name         Simple URL Unshortener
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Unshortens URLs by following redirect chains (console only)
// @author       maanimis
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530619/Simple%20URL%20Unshortener.user.js
// @updateURL https://update.greasyfork.org/scripts/530619/Simple%20URL%20Unshortener.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Register the menu command
    GM_registerMenuCommand("Unshorten URL", startUrlUnshortener);

    function startUrlUnshortener() {
        // Ask user for the shortened URL
        const shortUrl = prompt("Enter the shortened URL to unshorten:");

        if (!shortUrl) {
            console.log("No URL entered. Operation cancelled.");
            return;
        }

        // Validate URL format
        try {
            new URL(shortUrl);
        } catch (e) {
            console.log("Invalid URL format. Please enter a valid URL.");
            return;
        }

        // Start the unshortening process
        console.log("Starting URL unshortening process...");
        console.log("Initial URL:", shortUrl);

        const redirectChain = [shortUrl];
        followRedirect(shortUrl, redirectChain, 0);
    }

    function followRedirect(url, redirectChain, step) {
        // Maximum of 3 redirects
        if (step >= 3) {
            console.log("Reached maximum redirect depth (3)");
            displayResults(redirectChain);
            return;
        }

        console.log(`Following step ${step+1}: ${url}`);

        GM_xmlhttpRequest({
            method: "HEAD",
            url: url,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            },
            timeout: 10000, // 10 second timeout
            anonymous: true, // Don't send cookies
            fetch: true, // Use fetch mode if available
            onload: function(response) {
                console.log(`Received response for ${url} with status: ${response.status}`);

                // Check if we have a redirect status code
                if (response.status >= 300 && response.status < 400) {
                    let nextUrl = null;

                    // Try to get location from response headers
                    if (response.responseHeaders) {
                        const locationMatch = response.responseHeaders.match(/location:\s*(.*?)(?:\r?\n|$)/i);
                        if (locationMatch && locationMatch[1]) {
                            nextUrl = locationMatch[1].trim();
                        }
                    }

                    // If we still don't have a nextUrl, try finalUrl
                    if (!nextUrl && response.finalUrl && response.finalUrl !== url) {
                        nextUrl = response.finalUrl;
                    }

                    // Process relative URLs if needed
                    if (nextUrl && !nextUrl.match(/^https?:\/\//i)) {
                        try {
                            const urlObj = new URL(url);
                            if (nextUrl.startsWith('/')) {
                                nextUrl = `${urlObj.protocol}//${urlObj.host}${nextUrl}`;
                            } else {
                                const path = urlObj.pathname.substring(0, urlObj.pathname.lastIndexOf('/') + 1);
                                nextUrl = `${urlObj.protocol}//${urlObj.host}${path}${nextUrl}`;
                            }
                        } catch (e) {
                            console.error("Error processing relative URL:", e);
                        }
                    }

                    if (nextUrl && nextUrl !== url) {
                        console.log(`Redirect found: ${nextUrl}`);
                        redirectChain.push(nextUrl);
                        followRedirect(nextUrl, redirectChain, step + 1);
                    } else {
                        console.log("No valid redirect found or redirect to same URL.");
                        displayResults(redirectChain);
                    }
                } else {
                    // No redirect, we've reached the final URL
                    console.log(`Final URL reached: ${url}`);
                    displayResults(redirectChain);
                }
            },
            onerror: function(error) {
                console.error(`Error following redirect for ${url}:`, error);
                displayResults(redirectChain);
            },
            ontimeout: function() {
                console.error(`Request timed out for ${url}`);
                displayResults(redirectChain);
            }
        });
    }

    function displayResults(redirectChain) {
        console.log("\n===== URL UNSHORTENING RESULTS =====");
        console.log("Complete redirect chain:");

        redirectChain.forEach((url, index) => {
            console.log(`${index + 1}. ${url}`);
        });

        console.log(`\nTotal URLs in chain: ${redirectChain.length}`);
        console.log("======================================\n");
    }
})();

