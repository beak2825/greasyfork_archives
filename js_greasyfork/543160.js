// ==UserScript==
// @name         JanitorAI JannyAI Buttons
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Inserts a JannyAI button into  Character and My Chats Pages for convenience.
// @author       firecat (and Selene)
// @match        https://janitorai.com/*
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/543160/JanitorAI%20JannyAI%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/543160/JanitorAI%20JannyAI%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Debug configuration
    const DEBUG_MODE = false; // Set to true for debugging
    let processing = false;
    const DEBOUNCE_DELAY = 300;
    const INITIAL_DELAY = 800;
    let retryCount = 0;
    const MAX_RETRIES = 2;

    const debugLog = (...args) => {
        if (DEBUG_MODE) {
            console.log('[JannyAI-Redirect]', ...args);
        }
    };

    const shouldRunOnPage = () => {
        return window.location.pathname.includes('/characters/') ||
               window.location.pathname === '/my_chats';
    };

    const createJannyButton = (originalUrl) => {
        debugLog('Creating JannyAI button for URL:', originalUrl);
        const button = document.createElement('button');
        button.className = 'jannyai-button';
        button.innerHTML = '<span style="margin-right:6px">🃏</span>JannyAI';
        button.style.cssText = `
            background: #20B2AA !important;
            color: white !important;
            padding: 8px 16px !important;
            border-radius: 4px !important;
            font-size: 0.9rem !important;
            font-family: Jura,sans-serif !important;
            display: inline-flex;
            appearance: none;
            -moz-box-align: center;
            align-items: center;
            -moz-box-pack: center;
            justify-content: center;
            user-select: none;
            position: relative;
            white-space: nowrap;
            vertical-align: middle;
            outline: transparent solid 2px;
            outline-offset: 2px;
            line-height: 1.2;
            border-radius: var(--chakra-radii-md);
            font-weight: var(--chakra-fontWeights-semibold);
            transition-property: var(--chakra-transition-property-common);
            transition-duration: var(--chakra-transition-duration-normal);
            min-width: var(--chakra-sizes-8);
            font-size: var(--chakra-fontSizes-sm);
            padding-inline-start: var(--chakra-space-3);
            padding-inline-end: var(--chakra-space-3);
            background: var(--chakra-colors-red-200);
            color: var(--chakra-colors-gray-800);
        `;
        button.onclick = () => {
            debugLog('Button clicked - redirecting to JannyAI');
            window.open(originalUrl.replace('janitorai.com', 'jannyai.com'), '_blank');
        };
        return button;
    };

    const handle404Page = () => {
        if (!shouldRunOnPage() || processing) {
            debugLog('Already processing or not target page - skipping 404 check');
            return;
        }
        processing = true;
        debugLog('Processing 404 page check');

        const notFoundContainer = document.querySelector('.css-64aicp')?.parentElement;
        if (!notFoundContainer) {
            debugLog('No 404 container found');
            processing = false;
            return;
        }

        if (notFoundContainer.querySelector('.jannyai-button')) {
            debugLog('JannyAI button already exists on 404 page');
            processing = false;
            return;
        }

        const homePageLink = notFoundContainer.querySelector('a[href="/"]');
        if (!homePageLink) {
            debugLog('Home page link not found in 404 container');
            processing = false;
            return;
        }

        debugLog('Injecting JannyAI button into 404 page');
        const jannyButton = createJannyButton(window.location.href);
        notFoundContainer.insertBefore(jannyButton, homePageLink.nextSibling);

        processing = false;
    };

    const handleCharacterPages = () => {
        if (!shouldRunOnPage() || processing) {
            debugLog('Already processing or not target page - skipping character page');
            return;
        }
        processing = true;
        debugLog('Processing character page');

        const targetDiv = document.querySelector('.css-3f016y');
        if (!targetDiv) {
            debugLog('Character page target div not found');

            // Check if this is actually a 404 page first
            if (document.querySelector('.css-64aicp')) {
                debugLog('Found 404 page instead of character page');
                handle404Page();
                return;
            }

            if (retryCount < MAX_RETRIES) {
                debugLog(`Retrying character page check (${retryCount + 1}/${MAX_RETRIES})`);
                retryCount++;
                setTimeout(handleCharacterPages, 500);
            } else {
                debugLog('Max retries reached for character page check');
            }
            processing = false;
            return;
        }

        if (targetDiv.querySelector('.jannyai-button')) {
            debugLog('JannyAI button already exists on character page');
            processing = false;
            return;
        }

        const jannyButton = createJannyButton(window.location.href);
        const actionButtons = targetDiv.querySelector('.css-70qvj9, button');

        if (actionButtons) {
            debugLog('Inserting JannyAI button before action buttons');
            targetDiv.insertBefore(jannyButton, actionButtons);
        } else {
            debugLog('Prepending JannyAI button to target div');
            targetDiv.prepend(jannyButton);
        }

        retryCount = 0;
        setTimeout(() => { processing = false; }, DEBOUNCE_DELAY);
    };

    const handleChatListings = () => {
        if (!shouldRunOnPage() || processing) {
            debugLog('Skipping - wrong page or processing');
            return;
        }
        processing = true;
        debugLog('Scanning chat listings');

        // Only target EXPANDED chat entries (._expanded_jwjj2_15)
        const expandedEntries = document.querySelectorAll('._expanded_jwjj2_15');
        if (!expandedEntries.length && retryCount < MAX_RETRIES) {
            debugLog(`No expanded chats, retrying (${retryCount + 1}/${MAX_RETRIES})`);
            retryCount++;
            setTimeout(handleChatListings, 500);
            processing = false;
            return;
        }

        debugLog(`Processing ${expandedEntries.length} expanded chats`);
        expandedEntries.forEach((expandedEntry) => {
            // Find description container WITHIN expanded entry only
            const descriptionContainer = expandedEntry.querySelector('._descriptionContainer_196o8_1');
            if (!descriptionContainer) return;

            const injectionAttempt = () => {
                const buttonsContainer = descriptionContainer.querySelector('._buttonsContainer_196o8_42');
                if (!buttonsContainer) return false;

                const actionButtons = buttonsContainer.querySelectorAll('._actionButton_196o8_49');
                if (actionButtons.length < 2) return false;

                if (buttonsContainer.querySelector('.jannyai-button')) {
                    debugLog('Button exists - skipping');
                    return true;
                }

                debugLog('Injecting button');
                const jannyButton = createJannyButton(actionButtons[0].href);
                actionButtons[1].insertAdjacentElement('afterend', jannyButton);
                return true;
            };

            if (!injectionAttempt()) {
                setTimeout(injectionAttempt, 10); // Fast retry
            }
        });

        retryCount = 0;
        processing = false;
    };

    const runObserver = () => {
        if (!shouldRunOnPage()) {
            debugLog('Not a target page - observer skipping');
            return;
        }

        debugLog('Observer triggered - checking page state');
        setTimeout(() => {
            if (document.querySelector('.css-64aicp')) {
                debugLog('404 page detected');
                handle404Page();
            } else if (window.location.pathname.includes('/characters/')) {
                debugLog('Character page detected');
                handleCharacterPages();
            } else if (window.location.pathname === '/my_chats') {
                debugLog('Chat listings page detected');
                handleChatListings();
            } else {
                debugLog('Unknown page type - no action taken');
            }
        }, INITIAL_DELAY);
    };

    // New history event handlers
    history.pushState = (f => function pushState() {
        debugLog('pushState detected - dispatching events');
        const ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('pushstate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    })(history.pushState);

    history.replaceState = (f => function replaceState() {
        debugLog('replaceState detected - dispatching events');
        const ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('replacestate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    })(history.replaceState);

    const observer = new MutationObserver((mutations) => {
        debugLog(`Mutation observed - ${mutations.length} changes`);
        if (mutations.some(m => m.addedNodes.length > 0)) {
            debugLog('Added nodes detected - triggering runObserver');
            runObserver();
        }
    });

    // Initial run
    debugLog('Starting initial observer run');
    setTimeout(runObserver, INITIAL_DELAY);

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    window.addEventListener('locationchange', () => {
        debugLog('locationchange event received - resetting retries');
        retryCount = 0;
        runObserver();
    });

    debugLog('JannyAI redirect script initialized');
})();