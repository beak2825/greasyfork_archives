// ==UserScript==
// @name         Udemy.com Courses Auto-Enroll & Auto-Checkout
// @namespace    https://www.linkedin.com/in/bernando-jr-minguita/
// @version      1.1.1
// @description  Instantly auto-clicks "Enroll now" on Udemy with coupons/discounts; shows popup banner at bottom-right before clicking button immediately.
// @author       Bernando Jr Minguita
// @match        https://www.udemy.com/course/*?*couponCode=*
// @match        https://www.udemy.com/payment/checkout/express/course/*?*discountCode=*
// @match        https://www.udemy.com/payment/checkout/express/course/*?*couponCode=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=udemy.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543560/Udemycom%20Courses%20Auto-Enroll%20%20Auto-Checkout.user.js
// @updateURL https://update.greasyfork.org/scripts/543560/Udemycom%20Courses%20Auto-Enroll%20%20Auto-Checkout.meta.js
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

(() => {
    'use strict';

    const OBSERVER_TIMEOUT_MS = 30000;

    function log(msg) {
        console.log(`[Udemy Auto-Enroll] ${msg}`);
    }

    function showBanner(message, bgColor = '#0073e6', timeout = 2000) {
        const banner = document.createElement('div');
        banner.textContent = message;
        Object.assign(banner.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 16px',
            backgroundColor: bgColor,
            color: '#fff',
            fontSize: '14px',
            fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif',
            borderRadius: '6px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            zIndex: '999999',
            maxWidth: '300px',
            wordBreak: 'break-word',
            opacity: '1',
            transition: 'opacity 0.5s ease'
        });
        document.body.appendChild(banner);
        setTimeout(() => {
            banner.style.opacity = '0';
            setTimeout(() => banner.remove(), 500);
        }, timeout);
    }

    // ----------- Unified Auto-Enroll & Checkout Observer -----------
    function initAutoEnroll() {
        let clicked = false;
        let observer = null;

        function disconnectObserver() {
            if (observer) {
                observer.disconnect();
                observer = null;
                log('MutationObserver disconnected.');
            }
        }

        function tryAutoClick() {
            if (clicked) return;

            // Stop immediately if redirected to cart success
            if (/^https:\/\/www\.udemy\.com\/cart\/success\/\d+\/?$/.test(window.location.href)) {
                log('Redirected to cart success page. Observer disconnected.');
                disconnectObserver();
                return;
            }

            const pageText = document.body.innerText;

            // --- Course page checks ---
            if (pageText.includes('Buy now')) {
                log('Paid course detected. Stopping script.');
                disconnectObserver();
                return;
            }

            if (pageText.includes('You purchased this course on')) {
                log('Course already owned. Stopping script.');
                disconnectObserver();
                return;
            }

            // --- Course page "Enroll now" button ---
            const courseButton1 = document.querySelector('button[data-purpose="buy-this-course-button"]');
            if (courseButton1 && pageText.includes('Enroll now')) {
                clicked = true;
                log('"Enroll now" button found on course page. Clicking now.');
                showBanner('Auto-clicking "Enroll now" on this course...', '#0073e6');
                requestAnimationFrame(() => courseButton1.click());
                return;
            }

            // --- Course page "Enroll now" button ---
            const courseButton2 = document.querySelector('button[data-purpose="buy-now-button"]');
            if (courseButton2 && pageText.includes('Enroll now')) {
                clicked = true;
                log('"Enroll now" button found on course page. Clicking now.');
                showBanner('Auto-clicking "Enroll now" on this course...', '#0073e6');
                requestAnimationFrame(() => courseButton2.click());
                return;
            }

            // --- Payment checkout page "Enroll now" button ---
            const xpath = `//button[contains(@class, 'checkout-button--checkout-button--button--') and .//span[text()='Enroll now']]`;
            const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            const checkoutButton = result.singleNodeValue;

            if (checkoutButton) {
                clicked = true;
                if (checkoutButton.disabled) {
                    log('Checkout button found but disabled. Enabling manually.');
                    checkoutButton.disabled = false;
                }
                log('Checkout button found and enabled. Clicking now.');
                showBanner('Auto-clicking "Enroll now" on checkout...', '#d9534f');
                requestAnimationFrame(() => checkoutButton.click());
            }
        }

        function startObserver() {
            observer = new MutationObserver(() => tryAutoClick());
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true
            });

            setTimeout(() => {
                disconnectObserver();
                log('Observer stopped after timeout.');
            }, OBSERVER_TIMEOUT_MS);
        }

        // Run once immediately in case button is already present
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', tryAutoClick);
        } else {
            tryAutoClick();
        }

        startObserver();
    }

    // ----------- Main Execution -----------
    const url = window.location.href;

    if ((/^https:\/\/www\.udemy\.com\/course\/.+\?/.test(url) && url.includes('couponCode=')) ||
        (/^https:\/\/www\.udemy\.com\/payment\/checkout\/express\/course\/.+\?/.test(url) && url.includes('discountCode=')) ||
        (/^https:\/\/www\.udemy\.com\/payment\/checkout\/express\/course\/.+\?/.test(url) && url.includes('couponCode='))) {
        log('Udemy auto-enroll/checkout script active.');
        initAutoEnroll();
    } else {
        log('No matching page detected. Script will not run.');
    }

})();
