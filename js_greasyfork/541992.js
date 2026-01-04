// ==UserScript==
// @name         GTM Injector
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Injects a GTM container with a dynamic ID, visual feedback, and advanced debugging for testing purposes.
// @author       johncarter2021
// @license      MIT
// @homepageURL  
// @supportURL   
// @match        *://*.*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/541992/GTM%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/541992/GTM%20Injector.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- IMPROVEMENT: Dynamic Configuration ---
    // Use Tampermonkey's storage to allow changing the GTM ID without editing the script.
    const CONFIG = {
        defaultGtmId: 'GTM-WVX6GFMQ', // A fallback ID
        get gtmId() {
            // GM_getValue can be synchronous if the value is already cached.
            return GM_getValue('utsGtmId', this.defaultGtmId);
        },
        set gtmId(id) {
            GM_setValue('utsGtmId', id);
        }
    };

    // --- IMPROVEMENT: Menu Command for Configuration ---
    // Adds an option in the Tampermonkey extension menu to change the GTM ID.
    GM_registerMenuCommand('Set UTS GTM ID', () => {
        const newId = prompt('Enter the new GTM Container ID:', CONFIG.gtmId);
        if (newId && newId.trim().toUpperCase().startsWith('GTM-')) {
            CONFIG.gtmId = newId.trim();
            alert(`GTM ID set to ${CONFIG.gtmId}. The page will now reload.`);
            location.reload();
        } else if (newId) {
            alert('Invalid GTM ID format. It should start with "GTM-".');
        }
    });


    // --- SCRIPT EXECUTION ---
    const gtmId = CONFIG.gtmId; // Get the currently configured GTM ID

    // Prevent re-injection
    if (window.utsGtmInjected || document.querySelector(`script[src*="gtm.js?id="]`)) {
        // Check for ANY GTM script, not just ours, to avoid conflicts.
        console.log('%c UTS GTM Injector: A GTM container is already on this page. Aborting.', 'color: orange;');
        return;
    }
    window.utsGtmInjected = true;

    console.log(
        `%c UTS Injecting GTM Container: ${gtmId}`,
        'color: blue; font-weight: bold;'
    );

    // 1. Set up dataLayer and Consent Mode v2
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('consent', 'default', { ad_storage: 'denied', analytics_storage: 'denied' });
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

    // 2. Inject GTM Head Script
    function injectGtmHeadScript() {
        const head = document.head;
        const gtmScript = document.createElement('script');
        gtmScript.async = true;
        gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
        head.insertBefore(gtmScript, head.firstChild);
        console.log('%c UTS QA: GTM head script injected successfully.', 'color: green;');
    }

    // 3. Inject GTM Body Noscript
    function injectGtmBodyNoscript() {
        const body = document.body;
        const noscript = document.createElement('noscript');
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
        iframe.height = '0';
        iframe.width = '0';
        iframe.style.cssText = 'display:none;visibility:hidden';
        noscript.appendChild(iframe);
        body.insertBefore(noscript, body.firstChild);
        console.log('%c UTS QA: GTM noscript injected successfully.', 'color: green;');
    }

    // --- IMPROVEMENT: Visual Feedback Indicator ---
    function createVisualIndicator() {
        // Use GM_addStyle to inject CSS without polluting the DOM with <style> tags
        GM_addStyle(`
            #uts-gtm-indicator {
                position: fixed;
                bottom: 10px;
                right: 10px;
                background-color: #007bff;
                color: white;
                padding: 8px 12px;
                border-radius: 5px;
                font-family: sans-serif;
                font-size: 12px;
                z-index: 999999;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                cursor: pointer;
                transition: background-color 0.2s;
            }
            #uts-gtm-indicator:hover {
                background-color: #0056b3;
            }
        `);

        const indicator = document.createElement('div');
        indicator.id = 'uts-gtm-indicator';
        indicator.textContent = `UTS GTM: ${gtmId}`;
        indicator.title = 'Click to open GTM Debug Mode';

        // --- IMPROVEMENT: One-Click Debug Link ---
        indicator.addEventListener('click', () => {
            const debugUrl = new URL(window.location.href);
            debugUrl.searchParams.set('gtm_debug', new Date().getTime()); // Add debug param
            window.open(debugUrl.href, '_self'); // Open in the same tab
        });

        document.body.appendChild(indicator);
        console.log('%c UTS QA: Visual indicator created.', 'color: green;');
    }

    // --- IMPROVEMENT: Advanced CSP Error Detection ---
    function listenForCspErrors() {
        document.addEventListener('securitypolicyviolation', (e) => {
            if (e.blockedURI.includes('googletagmanager.com')) {
                console.error(
                    '%c UTS QA: GTM script was BLOCKED by the site\'s Content Security Policy (CSP). Check the console for details on the "Content-Security-Policy" header.',
                    'color: red; font-weight: bold; font-size: 14px;'
                );
                // Optionally update the visual indicator
                const indicator = document.getElementById('uts-gtm-indicator');
                if (indicator) {
                    indicator.textContent += ' (CSP Blocked!)';
                    indicator.style.backgroundColor = '#dc3545'; // Red color
                    indicator.title = 'GTM was blocked by the site\'s Content Security Policy.';
                }
            }
        });
    }

    // --- EXECUTION FLOW ---
    injectGtmHeadScript();
    listenForCspErrors(); // Start listening for errors right away.

    // Wait for the DOM to be ready before injecting into the <body>
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            injectGtmBodyNoscript();
            createVisualIndicator();
        });
    } else {
        injectGtmBodyNoscript();
        createVisualIndicator();
    }
})();