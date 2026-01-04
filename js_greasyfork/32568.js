// ==UserScript==
// @name             Usuwanie reklam Allegro
// @name:en          Remove Allegro ads
// @namespace        http://tampermonkey.net/
// @version          1.2.2_2025-08-15
// @description      Usuwa wszystkie reklamy na Allegro.pl, które nie są blokowane przez zwykłe blokery reklam, np. "Sponsorowane produkty" i "sponsorowane" boksy.
// @description:en   Aims to remove all ads on Allegro.pl not blocked by regular ad blockers, like "Sponsorowane produkty" and "sponsorowane" ad boxes.
// @author           adamaru
// @match            *://allegro.pl/*
// @icon             https://www.google.com/s2/favicons?sz=64&domain=allegro.pl
// @grant            none
// @license          CC-BY-NC-4.0; https://creativecommons.org/licenses/by-nc/4.0/
// @run-at           document-start
// @downloadURL https://update.greasyfork.org/scripts/32568/Usuwanie%20reklam%20Allegro.user.js
// @updateURL https://update.greasyfork.org/scripts/32568/Usuwanie%20reklam%20Allegro.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const config = {
        loggingEnabled: false,
        debounceDelay: 50,
        selectors: {
            hideDirectly: [
                'div[data-box-name*="_ads"]',
                'div[data-box-name="seoLazyBelowFilters"]',
                'div[data-box-name^="premium.with.dfp"]',
                'div[data-box-name="layout.advertisement"]',
                'div[data-box-name="ads.dss.listing.bottom.container"]',
                'div[data-box-name="items-v3"] article[data-analytics-view-custom-context="SPONSORED"]',
                'article[data-analytics-view-label="showSponsoredItems"]',
                'div[data-analytics-tags*="content-advertising"]',
            ],
            hideParentByText: {
                selector: 'article[class*="_"] span[class]:has(> span:not([class]) ~ button) > span:not([class])',
                keywords: ["sponsorowane"],
                parentLevel: 1,
            },
            sponsoredProductListings: {
                potentialAdArticles: ".opbox-listing > * > ul > li > article:nth-of-type(-n + 10)",
                thresholdElement: ".opbox-listing > * > ul > li > h2:first-of-type",
            },
        },
    };

    let isProcessing = false;
    let debounceTimer = null;

    const log = (...args) => {
        if (config.loggingEnabled) {
            console.log(...args);
        }
    };

    const hideElement = (element, reason) => {
        if (element && element.style.display !== "none") {
            log(`Hiding ${reason}:`, element);
            element.style.setProperty("display", "none", "important");
            return true;
        }
        return false;
    };

    const removeElementsBySelectors = (selectors, type) => {
        let count = 0;
        selectors.forEach((selector) => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach((el) => {
                    if (hideElement(el, `${type} (selector: ${selector})`)) {
                        count++;
                    }
                });
            } catch (error) {
                log(`Error querying selector "${selector}":`, error);
            }
        });
        if (count > 0) {
            log(`Hid ${count} ${type} elements.`);
        }
    };

    const removeParentByTextContent = (textConfig, type) => {
        const { selector, keywords, parentLevel = 1 } = textConfig;
        let count = 0;
        try {
            const elements = document.querySelectorAll(selector);
            elements.forEach((el) => {
                const textContentLower = el.textContent?.toLowerCase() || "";
                if (keywords.some((keyword) => textContentLower.includes(keyword))) {
                    let parentToHide = el;
                    for (let i = 0; i < parentLevel && parentToHide; i++) {
                        parentToHide = parentToHide.parentElement;
                    }
                    if (hideElement(parentToHide, `${type} (text: "${el.textContent}", selector: ${selector})`)) {
                        count++;
                    }
                }
            });
        } catch (error) {
            log(`Error processing text-based removal for selector "${selector}":`, error);
        }
        if (count > 0) {
            log(`Hid ${count} ${type} elements based on text content.`);
        }
    };

    const removeSponsoredProductListings = () => {
        const { potentialAdArticles, thresholdElement: thresholdSelector } = config.selectors.sponsoredProductListings;
        let count = 0;

        try {
            const threshold = document.querySelector(thresholdSelector);
            if (!threshold) {
                log(`Threshold element not found: "${thresholdSelector}"`);
                return;
            }

            const processArticle = (article) => {
                const opboxListingParent = article.parentElement?.parentElement?.parentElement?.parentElement;
                if (!opboxListingParent?.classList.contains("opbox-listing")) {
                    log(
                        `Coudn't confirm that opbox-listing as proper level ancestor of element:`,
                        article,
                        opboxListingParent
                    );
                    return false;
                }

                if (threshold.compareDocumentPosition(article) & Node.DOCUMENT_POSITION_PRECEDING) {
                    if (hideElement(article, "sponsored product listing (above threshold)")) {
                        return true;
                    }
                }
                return false;
            };

            const directArticles = document.querySelectorAll(potentialAdArticles);
            directArticles.forEach((article) => {
                if (processArticle(article)) {
                    count++;
                }
            });
        } catch (error) {
            log("Error during sponsored product listing removal:", error);
        }
        if (count > 0) {
            log(`Hid ${count} sponsored product listings.`);
        }
    };

    const performAdRemoval = () => {
        if (isProcessing) return;
        isProcessing = true;
        log("--- Running Ad Removal ---");

        try {
            removeElementsBySelectors(config.selectors.hideDirectly, "direct ad");
            removeParentByTextContent(config.selectors.hideParentByText, "sponsored ad (v1 text)");
            removeSponsoredProductListings();
        } catch (error) {
            log("Error during performAdRemoval:", error);
        } finally {
            log("--- Ad Removal Finished ---");
            isProcessing = false;
        }
    };

    const debouncedAdRemovalHandler = () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(performAdRemoval, config.debounceDelay);
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", performAdRemoval);
    } else {
        performAdRemoval();
    }

    log("Setting up MutationObserver.");
    const observer = new MutationObserver(debouncedAdRemovalHandler);
    const observerConfig = {
        childList: true,
        subtree: true,
        attributes: false,
    };

    const startObserver = () => {
        if (document.body) {
            observer.observe(document.body, observerConfig);
            log("MutationObserver started.");
        } else {
            requestAnimationFrame(startObserver);
        }
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", startObserver);
    } else {
        startObserver();
    }
})();
