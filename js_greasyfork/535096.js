// ==UserScript==
// @name         Gemini JSON Wrapper – Highlight-Safe, 
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Unwraps Gemini JSON, soft-fixes \\n, preserves highlight
// @author       copypaste
// @match        *://gemini.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535096/Gemini%20JSON%20Wrapper%20%E2%80%93%20Highlight-Safe%2C.user.js
// @updateURL https://update.greasyfork.org/scripts/535096/Gemini%20JSON%20Wrapper%20%E2%80%93%20Highlight-Safe%2C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        wrapStyles: {
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            overflowX: 'auto',
            maxWidth: '100%',
            fontFamily: 'monospace',
            fontSize: '13px',
            lineHeight: '1.4'
        },
        targetSelectors: [
            '[data-text-generation-response] pre',
            '[data-text-generation-response] code',
            '.text-generation-response pre',
            '.text-generation-response code',
            '.response-output pre',
            '.response-output code',
            'pre',
            'code'
        ],
        checkInterval: 2000,
        minJsonLength: 100,
        dataAttribute: 'data-json-wrapped'
    };

    function looksLikeJSON(str) {
        const trimmed = str.trim();
        if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return false;
        try {
            JSON.parse(trimmed);
            return true;
        } catch {
            return false;
        }
    }

    function softUnescape(str) {
        return str.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
    }

    function processCodeElements() {
        let changes = 0;
        CONFIG.targetSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (el.hasAttribute(CONFIG.dataAttribute)) return;

                const hasSpans = el.innerHTML.includes('<span');
                if (!hasSpans) {
                    const txt = el.textContent.trim();
                    if (txt.length >= CONFIG.minJsonLength && looksLikeJSON(txt)) {
                        el.textContent = softUnescape(txt);
                        changes++;
                    }
                }

                Object.assign(el.style, CONFIG.wrapStyles);
                el.setAttribute(CONFIG.dataAttribute, 'true');
            });
        });

        if (changes > 0) console.debug(`[JSON Wrapper] Updated ${changes} elements`);
    }

    function debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    const debouncedProcess = debounce(processCodeElements, 500);

    function initObserver() {
        const observer = new MutationObserver((mutations) => {
            let shouldProcess = false;
            for (const mutation of mutations) {
                if (
                    mutation.type === 'childList' && mutation.addedNodes.length > 0 ||
                    (mutation.type === 'attributes' &&
                     CONFIG.targetSelectors.some(sel => sel.includes(mutation.attributeName)))
                ) {
                    shouldProcess = true;
                    break;
                }
            }
            if (shouldProcess) debouncedProcess();
        });

        const containers = document.querySelectorAll('.response-output, [data-text-generation-response]');
        if (containers.length > 0) {
            containers.forEach(container => {
                observer.observe(container, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['class', 'data-text-generation-response']
                });
            });
        } else {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    function init() {
        processCodeElements(); // Initial run
        initObserver();        // Watch for dynamic loads

        setInterval(() => {
            debouncedProcess(); // Lazy interval refresh in case observer misses something
        }, CONFIG.checkInterval);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
