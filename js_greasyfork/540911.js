// ==UserScript==
// @name         JeetDelete X.com
// @namespace    http://tampermonkey.net/
// @version      1.7.0
// @description  Stable spam hiding on X with targeted languages, display names, and phrase blocking
// @author       hearing_echoes
// @match        https://x.com/*
// @match        https://www.x.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/540911/JeetDelete%20Xcom.user.js
// @updateURL https://update.greasyfork.org/scripts/540911/JeetDelete%20Xcom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // -----------------------------
    // Phrase Blocking (targeted only)
    // -----------------------------
    const blockedPhrases = [
        "https://inv.debot.ai/r/DEVIP",
        "https://web3.okx.com/join/OKVIPS",
        "debot.ai",
        "axiom.exchange",
        "solaxiom.pro",
        "AXIOMPro",
        "okai.HK",
        "OKAI.HK"
    ];

    function containsBlockedPhrase(text) {
        if (!text) return false;
        const lower = text.toLowerCase();
        return blockedPhrases.some(p => lower.includes(p.toLowerCase()));
    }

    // -----------------------------
    // Script / Language Detection
    // -----------------------------
    function isTargetLanguage(text) {
        if (!text || typeof text !== 'string') return false;

        const ranges = [
            /[\u0900-\u097F]/,  // Devanagari (Hindi etc.)
            /[\u0B80-\u0BFF]/, /[\u0C00-\u0C7F]/, /[\u0980-\u09FF]/, /[\u0A80-\u0AFF]/,
            /[\u0B00-\u0B7F]/, /[\u0A00-\u0A7F]/, /[\u0C80-\u0CFF]/, /[\u0D00-\u0D7F]/,
            /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/,  // Arabic
            /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/,  // Japanese/CJK
            /[\u0E00-\u0E7F]/,  // Thai
            /[\u0400-\u04FF]/,  // Cyrillic
            /[\uAC00-\uD7AF]/   // Hangul
        ];

        return ranges.some(rx => rx.test(text));
    }

    // -----------------------------
    // Process a single tweet
    // -----------------------------
    function processTweet(tweet) {
        if (tweet.dataset.jdProcessed) return;
        tweet.dataset.jdProcessed = "1";

        if (tweet.style.display === 'none') return;

        // Tweet text
        const textEl = tweet.querySelector('div[data-testid="tweetText"]');
        const txt = textEl?.textContent || '';

        // Display name (more targeted selector)
        const nameEl = tweet.querySelector('div[data-testid="User-Name"] span');
        const nameTxt = nameEl?.textContent || '';

        if (containsBlockedPhrase(txt) || isTargetLanguage(txt) || isTargetLanguage(nameTxt)) {
            tweet.style.display = 'none';
            console.log('Hid spam tweet (v1.7.0)');
        }
    }

    // -----------------------------
    // Timeline Observer (process only new nodes)
    // -----------------------------
    function waitForTimeline() {
        const timeline = Array.from(document.querySelectorAll('div[aria-label]')).find(el =>
            (el.getAttribute('aria-label') || '').toLowerCase().includes('timeline')
        );

        if (timeline) {
            // Initial pass
            timeline.querySelectorAll('article[data-testid="tweet"]').forEach(processTweet);

            // Observe only new additions
            const observer = new MutationObserver(mutations => {
                let debounceTimer = null;
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    mutations.forEach(mutation => {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                if (node.matches('article[data-testid="tweet"]')) {
                                    processTweet(node);
                                }
                                node.querySelectorAll && node.querySelectorAll('article[data-testid="tweet"]').forEach(processTweet);
                            }
                        });
                    });
                }, 300); // Slower debounce for stability
            });

            observer.observe(timeline, { childList: true, subtree: true });
            console.log('JeetDelete v1.7.0 (stable) initialized');
        } else {
            requestAnimationFrame(waitForTimeline);
        }
    }

    requestAnimationFrame(waitForTimeline);

})();