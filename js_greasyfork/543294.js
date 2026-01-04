// ==UserScript==
// @name          Real Discount 'Get Course' Auto-Redirect
// @namespace     https://www.linkedin.com/in/bernando-jr-minguita/
// @version       1.1.3
// @description   Automatically redirects to a Udemy course link with a coupon on real.discount offer pages, including dynamic content handling and Linksynergy deep links.
// @author        Bernando Jr Minguita
// @match         https://*.real.discount/offer/*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=real.discount
// @grant         none
// @license       MIT
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/543294/Real%20Discount%20%27Get%20Course%27%20Auto-Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/543294/Real%20Discount%20%27Get%20Course%27%20Auto-Redirect.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2025 Bernando Jr Minguita

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function () {
    'use strict';

    console.log('[Real Discount] Script loaded and running...');

    let redirected = false; // Ensures we only redirect once
    let observer = null; // For watching dynamically loaded content

    /**
     * Scans an array of anchor elements for a valid, decoded Udemy coupon URL.
     * Works with both direct and redirected Udemy tracking links (trk.udemy.com, etc.)
     * @param {HTMLAnchorElement[]} links - An array-like collection of anchor elements.
     * @returns {string | null} The first valid, decoded Udemy coupon URL found, or null.
     */
    function getUdemyCouponUrl(links) {
        console.log('[Real Discount] Scanning links for Udemy coupon URL...');

        const isCouponUrl = (url) =>
            url &&
            url.startsWith('https://www.udemy.com/course/') &&
            url.includes('couponCode=');

        const extractUdemyFromRedirect = (url) => {
            try {
                const uMatch = url.match(/[?&]u=([^&]+)/i);
                if (uMatch && uMatch[1]) {
                    const decodedInner = decodeURIComponent(uMatch[1]);
                    console.log('[Real Discount] Extracted inner Udemy URL:', decodedInner);
                    return decodedInner;
                }
            } catch (e) {
                console.warn('[Real Discount] Error extracting inner URL:', e.message);
            }
            return null;
        };

        const checkAndReturnUrl = (urlToCheck) => {
            if (!urlToCheck) return null;

            try {
                const decodedUrl = decodeURIComponent(urlToCheck);
                console.log(`[Real Discount] Decoded href: ${decodedUrl}`);

                if (isCouponUrl(decodedUrl)) {
                    console.log('[Real Discount] Found direct Udemy coupon URL:', decodedUrl);
                    return decodedUrl;
                }

                // Check if it contains a nested Udemy URL (redirect style)
                const innerUdemy = extractUdemyFromRedirect(decodedUrl);
                if (innerUdemy && isCouponUrl(innerUdemy)) {
                    console.log('[Real Discount] Found nested Udemy coupon URL:', innerUdemy);
                    return innerUdemy;
                }
            } catch (e) {
                console.warn('[Real Discount] Error decoding href:', urlToCheck, e.message);
            }

            return null;
        };

        for (const anchor of links) {
            let foundUrl = null;

            // 1. Check the resolved href (absolute)
            foundUrl = checkAndReturnUrl(anchor.href);
            if (foundUrl) return foundUrl;

            // 2. Fallback: raw href attribute (heavily encoded)
            const rawHref = anchor.getAttribute('href');
            foundUrl = checkAndReturnUrl(rawHref);
            if (foundUrl) return foundUrl;
        }

        console.log('[Real Discount] No valid Udemy coupon URL found in links.');
        return null;
    }

    /**
     * Extracts Udemy coupon URL from Linksynergy affiliate deep links.
     * @param {string} linksynergyUrl - The full Linksynergy affiliate link.
     * @returns {string|null} - Decoded Udemy coupon URL or null.
     */
    function getUdemyUrlFromLinksynergy(linksynergyUrl) {
        try {
            const url = new URL(linksynergyUrl);
            const murlParam = url.searchParams.get('murl');

            if (murlParam) {
                const decodedUrl = decodeURIComponent(murlParam);
                console.log('[Real Discount] Decoded Linksynergy murl:', decodedUrl);

                if (
                    decodedUrl.startsWith('https://www.udemy.com/course/') &&
                    decodedUrl.includes('couponCode=')
                ) {
                    console.log('[Real Discount] Found Udemy coupon URL in Linksynergy:', decodedUrl);
                    return decodedUrl;
                }
            }
        } catch (e) {
            console.warn('[Real Discount] Failed to parse Linksynergy URL:', e.message);
        }

        return null;
    }

    /**
     * Main redirect logic:
     * - Scans the page for valid Udemy coupon links (direct or via affiliate).
     * - Redirects user to the found coupon URL if not already there.
     */
    function tryRedirect() {
        if (redirected) {
            console.log('[Real Discount] Already redirected. Skipping...');
            return;
        }

        const links = document.querySelectorAll('a');
        console.log(`[Real Discount] Checking ${links.length} links on the page...`);

        let targetUrl = getUdemyCouponUrl(links);

        // If no direct link, check for affiliate Linksynergy links
        if (!targetUrl) {
            for (let i = 0; i < links.length; i++) {
                const href = links[i].href;

                if (
                    href &&
                    href.startsWith('https://click.linksynergy.com/deeplink?') &&
                    href.includes('murl=https%3A%2F%2Fwww.udemy.com%2Fcourse%2F')
                ) {
                    targetUrl = getUdemyUrlFromLinksynergy(href);
                    if (targetUrl) break;
                }
            }
        }

        if (!targetUrl) {
            console.log('[Real Discount] No coupon URL found. Will keep watching...');
            return;
        }

        // Stop watching the DOM if target is found
        if (observer) observer.disconnect();

        if (location.href !== targetUrl) {
            console.log('[Real Discount] Redirecting to:', targetUrl);
            redirected = true;
            window.location.replace(targetUrl);
        } else {
            console.log('[Real Discount] Already on the target URL.');
            redirected = true;
        }
    }

    // MutationObserver: watches for new links loaded via AJAX or JS
    if (document.body) {
        observer = new MutationObserver(() => {
            tryRedirect();
            if (redirected && observer) {
                console.log('[Real Discount] Redirect complete. Disconnecting observer.');
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    // Initial immediate scan
    tryRedirect();

    // Safety timeout: stop observer after 15 seconds if nothing found
    setTimeout(() => {
        if (!redirected) {
            console.log('[Real Discount] Timeout: No coupon URL found after 15s. Stopping observer.');
            if (observer) observer.disconnect();
        }
    }, 15000);
})();