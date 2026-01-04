// ==UserScript==
// @name         Replace Currency, Username, Image, and Fees
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Replace Rp, usernames, images, fee text, and 200000 (persistent & flicker-free) even in inputs or editable elements on Roobet UI changes.
// @match        *://roobet.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/533797/Replace%20Currency%2C%20Username%2C%20Image%2C%20and%20Fees.user.js
// @updateURL https://update.greasyfork.org/scripts/533797/Replace%20Currency%2C%20Username%2C%20Image%2C%20and%20Fees.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const imageReplacements = {
        "https://roobet.com/cdn-cgi/image/dpr=1,width=38.4,height=24,quality=85/https://roobet.com/assets/images/rewards/levelcons/silver1.624b198715a79ea0b39d.png":
            "https://roobet.com/cdn-cgi/image/dpr=1,width=42.67,height=26.67,quality=85/https://roobet.com/assets/images/rewards/levelcons/champion3.aff06b192ef5e2a8b51e.png",

        "https://roobet.com/cdn-cgi/image/dpr=1,width=auto,height=auto,quality=80/https://roobet.com/assets/images/rewards/levelcons/silver1.624b198715a79ea0b39d.png":
            "https://roobet.com/cdn-cgi/image/dpr=1,width=auto,height=auto,quality=80/https://roobet.com/assets/images/rewards/levelcons/champion3.aff06b192ef5e2a8b51e.png"
    };

    function replaceTextContent(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const original = node.nodeValue;
            let replaced = original
                .replace(/\bRp(?=\d)/g, "$")
                .replace(/\bjustinbtc\b/gi, "lol")
                .replace(/\bRp\b/gi, "$")
                .replace(/\b200000\.00\b/g, "10.00")
                .replace(/\b200000\b/g, "10")
                .replace("Minimum purchase amount $200,000.00", "Minimum purchase amount $10.00")
                .replace("Minimum withdrawal amount $200,000.00", "Minimum withdrawal amount $10.00")
                .replace("Remaining balance after tip must be $200,000.00 or greater", "Remaining balance after tip must be $10.00 or greater")
                .replace("Silver I", "Champion III")
                .replace("02/05/2025", "10/01/2024");

            if (original !== replaced) {
                node.nodeValue = replaced;
            }
        }
    }

    function replaceInputValues() {
        const allInputs = document.querySelectorAll("input, textarea, [contenteditable='true']");

        allInputs.forEach(el => {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                if (el.value && el.value.includes("200000")) {
                    el.value = el.value.replace(/\b200000\b/g, "10");
                    el.setAttribute("value", el.value);
                }
            } else if (el.isContentEditable && el.innerText.includes("200000")) {
                el.innerText = el.innerText.replace(/\b200000\b/g, "10");
            }
        });
    }

    function traverseDOM(element) {
        element.childNodes.forEach(child => {
            if (child.nodeType === Node.ELEMENT_NODE) {
                traverseDOM(child);
            } else {
                replaceTextContent(child);
            }
        });
    }

    function replaceImageSrc() {
        document.querySelectorAll("img").forEach(img => {
            const currentSrc = img.src;
            Object.keys(imageReplacements).forEach(oldSrc => {
                if (currentSrc.includes(oldSrc.split("/").pop())) {
                    img.src = imageReplacements[oldSrc];
                }
            });
        });
    }

    function replaceEstimatedFee() {
        const allSpans = document.querySelectorAll("span, div, p, strong");

        allSpans.forEach(el => {
            if (/^\$\d{1,6}(\.\d{2})? Estimated Transaction Fee$/.test(el.textContent.trim())) {
                el.textContent = "$0.01 Estimated Transaction Fee";
            }
        });
    }



    function handleMutations(mutationsList) {
        mutationsList.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        traverseDOM(node);
                        replaceImageSrc();
                        replaceInputValues();
                        replaceEstimatedFee();
                    } else {
                        replaceTextContent(node);
                    }
                });
            } else if (mutation.type === 'characterData') {
                replaceTextContent(mutation.target);
            } else if (mutation.type === 'attributes' && mutation.target instanceof HTMLElement) {
                replaceInputValues();
            }
        });
    }

    const observer = new MutationObserver(handleMutations);
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['value']
    });

    // Initial execution
    traverseDOM(document.body);
    replaceImageSrc();
    replaceInputValues();
    replaceEstimatedFee();

    // Periodic enforcement to persist changes
    setInterval(() => {
        replaceImageSrc();
        replaceInputValues();
        traverseDOM(document.body);
        replaceEstimatedFee();
    }, 750);
})();