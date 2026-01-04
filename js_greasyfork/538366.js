// ==UserScript==
// @name         Google Cookie Consent Remover
// @namespace    https://gist.github.com/WoLpH/985a6072b35926eb4a3f9d2cdd0a2dad
// @version      0.8
// @description  Remove Google and Youtube's annoying cookie consent questions (especially annoying for Incognito windows)
// @author       Wolph
// @include      /https:\/\/(www|consent)\.(google|youtube)\.*\w+\/.*$/
// @include      https://consent.google.com/*
// @match        *://*.google.*/*
// @match        *://*.youtube.*/*
// @homepage     https://gist.github.com/WoLpH/985a6072b35926eb4a3f9d2cdd0a2dad
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/538366/Google%20Cookie%20Consent%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/538366/Google%20Cookie%20Consent%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_NAME = "GoogleCookieConsentRemover";
    const DEBUG = true; // Set to false to reduce console output

    function log(message) {
        if (DEBUG) {
            console.log(`[${SCRIPT_NAME}] ${message}`);
        }
    }

    function warn(message) {
        console.warn(`[${SCRIPT_NAME}] ${message}`);
    }

    function error(err, context = "") {
        console.error(`[${SCRIPT_NAME}] Error ${context}:`, err);
    }

    // XPaths for common light DOM structures
    const XPATHS = [
        // English
        '//button[.//span[contains(text(),"Reject all")]]', // YouTube new structure (if in light DOM)
        '//button[.//div[contains(text(),"Reject all")]]',
        '//button[contains(., "Reject all")]',
        '//input[@type="submit" and contains(@value,"Reject all")]',
        // Dutch ("Alles afwijzen")
        '//button[.//span[contains(text(),"Alles afwijzen")]]',
        '//button[.//div[contains(text(),"Alles afwijzen")]]',
        '//button[contains(., "Alles afwijzen")]',
        '//input[@type="submit" and contains(@value,"Alles afwijzen")]',
        // German ("Alle ablehnen")
        '//button[.//span[contains(text(),"Alle ablehnen")]]',
        '//button[.//div[contains(text(),"Alle ablehnen")]]',
        '//button[contains(., "Alle ablehnen")]',
        '//input[@type="submit" and contains(@value,"Alle ablehnen")]',
        // French ("Tout refuser")
        '//button[.//span[contains(text(),"Tout refuser")]]',
        '//button[.//div[contains(text(),"Tout refuser")]]',
        '//button[contains(., "Tout refuser")]',
        '//input[@type="submit" and contains(@value,"Tout refuser")]',
        // Spanish ("Rechazar todo")
        '//button[.//span[contains(text(),"Rechazar todo")]]',
        '//button[.//div[contains(text(),"Rechazar todo")]]',
        '//button[contains(., "Rechazar todo")]',
        '//input[@type="submit" and contains(@value,"Rechazar todo")]',
        // Italian ("Rifiuta tutto")
        '//button[.//span[contains(text(),"Rifiuta tutto")]]',
        '//button[.//div[contains(text(),"Rifiuta tutto")]]',
        '//button[contains(., "Rifiuta tutto")]',
        '//input[@type="submit" and contains(@value,"Rifiuta tutto")]',
        // Generic form-based fallback
        '//form[contains(@action, "consent") or contains(@action, "reject")]/button[not(@jsname) or @jsname="LgbsSe" or @jsname="ZUkOIc"]',
        '//form[contains(@action, "consent") or contains(@action, "reject")]//button[translate(normalize-space(.), "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz") = "reject all"]',
        // YouTube specific aria-labels (usually for tp-yt-paper-button or button)
        // Note: The deep search below is better for aria-labels in Shadow DOM
        '//button[contains(translate(@aria-label, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "reject all")]',
        '//tp-yt-paper-button[contains(translate(@aria-label, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "reject all")]',
    ];

    // Keywords for deep search (aria-label or text content)
    // Order by likely prevalence or specificity.
    const DEEP_SEARCH_KEYWORDS = [
        "Reject the use of cookies and other data for the purposes described", // Exact YouTube aria-label
        "Reject all", "Alles afwijzen", "Alle ablehnen", "Tout refuser", "Rechazar todo", "Rifiuta tutto"
    ];


    let isHandled = false;
    let observer = null;
    let observerTimeoutId = null;
    let periodicCheckIntervalId = null;
    let periodicCheckMasterTimeoutId = null;

    const OBSERVER_MAX_DURATION_MS = 30000;
    const PERIODIC_CHECK_INTERVAL_MS = 1000;
    const PERIODIC_CHECK_DURATION_MS = 10000;

    function cleanup(reason) {
        log(`Cleanup called. Reason: ${reason}`);
        if (periodicCheckIntervalId) { clearInterval(periodicCheckIntervalId); periodicCheckIntervalId = null; log("Periodic check interval cleared."); }
        if (periodicCheckMasterTimeoutId) { clearTimeout(periodicCheckMasterTimeoutId); periodicCheckMasterTimeoutId = null; log("Periodic check master timeout cleared."); }
        if (observer) { observer.disconnect(); observer = null; log("MutationObserver disconnected."); }
        if (observerTimeoutId) { clearTimeout(observerTimeoutId); observerTimeoutId = null; log("MutationObserver master timeout cleared."); }
    }

    /**
     * Recursively searches for elements matching the selector, piercing Shadow DOM.
     * @param {string} selector - The CSS selector to match.
     * @param {Element|ShadowRoot} rootNode - The node to start searching from.
     * @returns {Element[]} An array of found elements.
     */
    function deepQuerySelectorAll(selector, rootNode = document.documentElement) {
        const results = [];
        const elementsToSearchIn = [rootNode];

        while (elementsToSearchIn.length > 0) {
            const currentElement = elementsToSearchIn.shift();
            if (!currentElement || typeof currentElement.querySelectorAll !== 'function') {
                continue;
            }

            // Search in the light DOM of the current element
            results.push(...Array.from(currentElement.querySelectorAll(selector)));

            // Search in the shadow DOM of all children of currentElement
            const shadowHosts = currentElement.querySelectorAll('*');
            for (const host of shadowHosts) {
                if (host.shadowRoot) {
                    // Add shadowRoot itself to search inside it.
                    // Its children's shadowRoots will be processed from shadowHosts.
                    results.push(...Array.from(host.shadowRoot.querySelectorAll(selector)));
                    elementsToSearchIn.push(host.shadowRoot); // Also queue the shadowRoot for deeper traversal of its children's shadowRoots
                }
            }
        }
        return results;
    }


    /**
     * Checks visibility and attempts to click the element.
     * @param {HTMLElement} element - The element to click.
     * @param {string} foundByType - Description of how the element was found (for logging).
     * @returns {boolean} True if clicked successfully, false otherwise.
     */
    function attemptClickOnElement(element, foundByType) {
        log(`Found potential button by ${foundByType}. Details: Tag=${element.tagName}, Text="${element.textContent?.trim().substring(0, 50)}", Aria="${element.getAttribute('aria-label')?.substring(0, 50)}"`);

        const style = window.getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0' || element.disabled || element.getAttribute('aria-hidden') === 'true') {
            log(`Button seems non-interactable (display: ${style.display}, visibility: ${style.visibility}, opacity: ${style.opacity}, disabled: ${element.disabled}, aria-hidden: ${element.getAttribute('aria-hidden')}). Skipping.`);
            return false;
        }

        try {
            log("Attempting to click the button...");
            element.click();
            log(`Button clicked successfully (found by ${foundByType}).`);
            return true;
        } catch (e) {
            error(e, `while clicking button found by ${foundByType}`);
            return false;
        }
    }


    function findAndClickButtonOnly() {
        log("findAndClickButtonOnly: Searching for consent button...");

        // Phase 1: XPath search (primarily for Light DOM, faster)
        log("Phase 1: XPath search (Light DOM).");
        for (const xpath of XPATHS) {
            let buttonNode = null;
            try {
                buttonNode = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            } catch (e) {
                error(e, `while evaluating XPath: ${xpath}`);
                continue;
            }
            if (buttonNode && (buttonNode instanceof HTMLElement)) {
                if (attemptClickOnElement(buttonNode, `XPath: ${xpath}`)) return true;
            }
        }
        log("Phase 1: XPath search did not find a clickable button.");

        // Phase 2: Deep search (piercing Shadow DOMs)
        log("Phase 2: Deep search (Shadow DOM piercing).");
        const clickableElementSelectors = 'button, input[type="submit"], tp-yt-paper-button'; // Common clickable elements
        let allPotentialClickableElements = [];
        try {
            allPotentialClickableElements = deepQuerySelectorAll(clickableElementSelectors);
        } catch (e) {
            error(e, "during deepQuerySelectorAll execution");
            return false; // Critical failure in deep search
        }

        log(`Deep search found ${allPotentialClickableElements.length} potential elements using selector: "${clickableElementSelectors}".`);

        for (const element of allPotentialClickableElements) {
            // 1. Check ARIA label
            const ariaLabel = element.getAttribute('aria-label');
            if (ariaLabel) {
                for (const keyword of DEEP_SEARCH_KEYWORDS) {
                    if (ariaLabel.toLowerCase().includes(keyword.toLowerCase())) {
                        if (attemptClickOnElement(element, `Deep search - ARIA label ("${ariaLabel.substring(0,50)}") matching keyword "${keyword}"`)) return true;
                        // Don't break here, element might also match text or a more specific aria keyword
                    }
                }
            }

            // 2. Check Text Content (or value for inputs)
            let textContent = "";
            const tagName = element.tagName.toLowerCase();

            if (tagName === 'input') {
                textContent = element.value || "";
            } else { // For <button> or <tp-yt-paper-button>
                // Standard way to get text for tp-yt-paper-button label
                const paperButtonLabel = element.querySelector('#text, #label'); // #text is common in yt-formatted-string inside paper-button
                if (paperButtonLabel && paperButtonLabel.textContent) {
                    textContent = paperButtonLabel.textContent.trim();
                } else if (element.textContent) { // General text content
                     textContent = element.textContent.trim();
                }
                // For specific YouTube buttons, text is in a nested span
                const ytButtonSpan = element.querySelector('span.yt-core-attributed-string, .button-renderer span, .yt-spec-button-shape-next__button-text-content span');
                if (ytButtonSpan && ytButtonSpan.textContent && ytButtonSpan.textContent.trim().length > (textContent.length / 2) ) { // Prefer specific span if its text is substantial
                    textContent = ytButtonSpan.textContent.trim();
                }
            }

            if (textContent) {
                for (const keyword of DEEP_SEARCH_KEYWORDS) {
                    if (textContent.toLowerCase().includes(keyword.toLowerCase())) { // Using includes for partial matches like "Reject all cookies"
                        if (attemptClickOnElement(element, `Deep search - Text ("${textContent.substring(0,50)}") matching keyword "${keyword}"`)) return true;
                    }
                }
            }
        }
        log("Phase 2: Deep search did not find a clickable button.");
        log("No suitable consent button found after all search phases.");
        return false;
    }

    function attemptToHandleConsent(triggerSource) {
        if (isHandled) return true;
        log(`Attempting to handle consent (triggered by: ${triggerSource}).`);
        if (findAndClickButtonOnly()) {
            isHandled = true;
            cleanup(`Consent handled (source: ${triggerSource})`);
            log(`Consent successfully handled by ${triggerSource}. All checks stopped.`);
            return true;
        }
        return false;
    }

    // --- Main Execution ---
    log("Script started.");

    const MAIN_CONSENT_PAGE_HOST_REGEX = /^(www|consent)\.(google|youtube)\./i;
    const GENERAL_GOOGLE_YOUTUBE_HOST_REGEX = /(\.google\.|\.youtube\.)/i;
    const isLikelyFullConsentPage = MAIN_CONSENT_PAGE_HOST_REGEX.test(window.location.hostname);
    const isAnyGoogleYouTubeDomain = GENERAL_GOOGLE_YOUTUBE_HOST_REGEX.test(window.location.hostname);
    const pathMightHaveConsentPopup = /\/(consent|watch|results|search|embed|$)/i.test(window.location.pathname); // Includes root "/"
    const isRootPath = window.location.pathname === "/";

    if (isAnyGoogleYouTubeDomain && !isLikelyFullConsentPage && !pathMightHaveConsentPopup && !isRootPath) {
        log(`Current page (${window.location.href}) is a Google/YouTube domain but unlikely for full consent. Performing a single quick check.`);
        if (attemptToHandleConsent("initial check on less-likely page")) {
            log("Consent dialog handled on less-likely page type.");
        } else {
            log("No consent dialog found on less-likely page type. Script will now exit for this page.");
        }
        return;
    }

    if (attemptToHandleConsent("initial synchronous check")) {
        log("Dialog handled on initial synchronous check. Script finished.");
        return;
    }

    if (!isHandled) {
        log(`Starting periodic checks every ${PERIODIC_CHECK_INTERVAL_MS / 1000}s for up to ${PERIODIC_CHECK_DURATION_MS / 1000}s.`);
        periodicCheckIntervalId = setInterval(() => {
            if (isHandled || document.hidden) {
                if (document.hidden && !isHandled) log("Tab is hidden, skipping periodic check's attemptToHandleConsent.");
                return;
            }
            attemptToHandleConsent("periodic check");
        }, PERIODIC_CHECK_INTERVAL_MS);

        periodicCheckMasterTimeoutId = setTimeout(() => {
            if (periodicCheckIntervalId) {
                clearInterval(periodicCheckIntervalId); periodicCheckIntervalId = null;
                log("Periodic checks completed their duration without success.");
            }
        }, PERIODIC_CHECK_DURATION_MS);
    }

    if (!isHandled) {
        log("Setting up MutationObserver.");
        observer = new MutationObserver((mutationsList, obs) => {
            if (isHandled) {
                obs.disconnect(); observer = null;
                log("MutationObserver: Consent already handled. Disconnecting self.");
                return;
            }
            log(`DOM changes detected by MutationObserver. Mutations: ${mutationsList.length}`);
            let potentiallyRelevantChange = false;
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    potentiallyRelevantChange = true; break;
                }
                if (mutation.type === 'attributes') { // Sometimes dialog appears by changing attributes
                    potentiallyRelevantChange = true; break;
                }
            }
            if (!potentiallyRelevantChange) return;
            attemptToHandleConsent("MutationObserver");
        });

        observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true });
        log("MutationObserver started. Waiting for DOM changes or observer timeout.");

        observerTimeoutId = setTimeout(() => {
            if (!isHandled) {
                warn(`MutationObserver timed out after ${OBSERVER_MAX_DURATION_MS / 1000}s.`);
                cleanup(`Max observation duration reached for observer.`);
            }
        }, OBSERVER_MAX_DURATION_MS);
    }
    log("Initial setup complete. Waiting for consent dialog or timeouts.");
})();