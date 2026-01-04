// ==UserScript==
// @name         Price Rounder
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Rounds prices ending in .90 or higher to the nearest whole number. Works on Amazon and most shopping sites I've tested.
// @author       Tempo918
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545853/Price%20Rounder.user.js
// @updateURL https://update.greasyfork.org/scripts/545853/Price%20Rounder.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === Settings ===
    const isEnabled = GM_getValue('roundingEnabled', true);

    GM_registerMenuCommand(isEnabled ? "Disable Price Rounding" : "Enable Price Rounding", () => {
        GM_setValue('roundingEnabled', !isEnabled);
        location.reload();
    });

    if (!isEnabled) return;

    // === Rounding Logic ===
    function shouldRound(num) {
        return num % 1 >= 0.90;
    }

    function roundPrice(num) {
        return shouldRound(num) ? Math.ceil(num) : num;
    }

    // === Amazon-Specific Handling ===
    function handleAmazonListPage() {
        const elems = document.getElementsByClassName("a-price-fraction");
        for (let i = 0; i < elems.length; i++) {
            const centsElem = elems[i];
            const wholeElem = centsElem.parentNode.querySelector(".a-price-whole");
            if (!wholeElem) continue;

            const price = parseFloat(wholeElem.textContent.replace(/[^\d]/g, '') + '.' + centsElem.textContent);
            const newPrice = roundPrice(price).toFixed(2);
            wholeElem.textContent = newPrice.slice(0, -3);
            centsElem.textContent = newPrice.slice(-2);
        }
    }

    function handleAmazonProductPage() {
        const elems = document.getElementsByClassName("apexPriceToPay");
        for (let i = 0; i < elems.length; i++) {
            const priceElem = elems[i].querySelector("span:nth-child(2)");
            if (!priceElem) continue;

            const price = parseFloat(priceElem.textContent.replace(/[^0-9.]/g, ''));
            priceElem.textContent = "$" + roundPrice(price).toFixed(2);
        }
    }

    // === Generic Price Rounding ===
    const priceRegex = /\b\d{1,3}(?:,\d{3})*(?:\.\d{2})\b/g;

    function isVisible(el) {
        return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
    }

    function roundPricesInNode(node) {
        if (node.nodeType === Node.TEXT_NODE && node.parentElement && isVisible(node.parentElement)) {
            const originalText = node.textContent;
            const newText = originalText.replace(priceRegex, match => {
                const num = parseFloat(match.replace(/,/g, ''));
                return shouldRound(num) ? Math.ceil(num).toString() : match;
            });
            if (newText !== originalText) {
                node.textContent = newText;
            }
        }
    }

    function scanPage() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while ((node = walker.nextNode())) {
            roundPricesInNode(node);
        }
    }

    // === Observe Dynamic Changes ===
    function observeMutations() {
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        roundPricesInNode(node);
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        node.querySelectorAll('*').forEach(el => {
                            el.childNodes.forEach(roundPricesInNode);
                        });
                    }
                });
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // === Run Script ===
    window.addEventListener('load', () => {
        handleAmazonProductPage();
        handleAmazonListPage();
        scanPage();
        observeMutations();

        setInterval(() => {
            handleAmazonListPage();
        }, 2000);
    });
})();
