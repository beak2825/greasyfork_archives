// ==UserScript==
// @name         Close Ads
// @namespace    https://www.lookmovie2.to/
// @version      0.6.3
// @description  Closes ads on LookMovie and removes specific reCAPTCHA, banner ads from the page
// @author       JJJ
// @match        https://www.lookmovie2.to/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lookmovie2.to
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495537/Close%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/495537/Close%20Ads.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Exclude specific URL path
    if (window.location.href.includes('/threat-protection/')) {
        console.log('Ad closer script is disabled on this page.');
        return;
    }

    const config = {
        closePlayerAdSelector: '.pre-init-ads--close',
        IPreferAdsSelector: 'button.no.stay-free[data-notify-html="buttonStayFree"]',
        notifyDivSelector: 'div.notifyjs-corner',
        bannerAdSelector: '.banner-become-affiliate',
        reCaptchaDivStyles: [
            'background-color: rgb(255, 255, 255);',
            'border: 1px solid rgb(204, 204, 204);',
            'z-index: 2000000000;',
            'position: absolute;'
        ],
        maxAttempts: 50,
        debounceTime: 200,
        continuousCheck: true,
        threatProtectionBaseUrl: 'https://www.lookmovie2.to/threat-protection/'
    };

    let attempts = 0;
    let observer = null;
    let debounceTimeout = null;

    // Function to interact with elements like clicking or removing
    const interactWithElement = (selector, action = 'remove') => {
        const element = document.querySelector(selector);
        if (element) {
            if (action === 'click') {
                element.click();
                console.log(`${selector} clicked`);
            } else {
                element.remove();
                console.log(`${selector} removed`);
            }
            return true;
        }
        return false;
    };

    // Function to remove elements with specific inline styles
    const removeElementByStyles = (styles) => {
        const element = document.querySelector(`div[style*="${styles.join('"][style*="')}"]`);
        if (element) {
            element.remove();
            console.log('Element with matching styles removed');
            return true;
        }
        return false;
    };

    // Function to handle ad closing and element interactions
    const handleAds = () => {
        try {
            // Prioritize removal of reCAPTCHA, notification, and banner ads
            if (removeElementByStyles(config.reCaptchaDivStyles) ||
                interactWithElement(config.notifyDivSelector) ||
                interactWithElement(config.bannerAdSelector) ||
                interactWithElement(config.closePlayerAdSelector, 'click') ||
                interactWithElement(config.IPreferAdsSelector, 'click')) {
                return true;
            }
        } catch (error) {
            console.error('Error while handling ads or buttons:', error);
        }
        return false;
    };

    // Debounced function to handle ad removal during mutations
    const debouncedHandleAds = () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            if (handleAds()) {
                attempts = 0;
            } else {
                attempts++;
            }

            if (!config.continuousCheck && attempts >= config.maxAttempts) {
                stopObserver();
                console.log('Ad handling process finished');
            }
        }, config.debounceTime);
    };

    // Function to handle DOM mutations
    const handleMutations = () => {
        debouncedHandleAds();
    };

    // Function to start the MutationObserver
    const startObserver = () => {
        if (observer) return;

        observer = new MutationObserver(handleMutations);
        observer.observe(document.body, { childList: true, subtree: true });
        console.log('MutationObserver started');
    };

    // Function to stop the MutationObserver
    const stopObserver = () => {
        if (observer) {
            observer.disconnect();
            observer = null;
            console.log('MutationObserver stopped');
        }
    };

    // Function to initialize the ad closer
    const initAdCloser = () => {
        console.log('Ad closer initialized');
        if (handleAds()) {
            attempts = 0;
        }

        startObserver();
        window.addEventListener('beforeunload', stopObserver);
    };

    // Initialize once the document is ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initAdCloser();
    } else {
        document.addEventListener('DOMContentLoaded', initAdCloser);
    }

    setTimeout(initAdCloser, 1000);

    // Polyfill for MutationObserver if not supported
    if (!window.MutationObserver) {
        window.MutationObserver = window.WebKitMutationObserver || window.MozMutationObserver || class {
            constructor(callback) {
                this.callback = callback;
            }
            observe() {
                console.warn('MutationObserver not supported by this browser.');
            }
            disconnect() { }
        };
    }
})();