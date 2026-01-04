// ==UserScript==
// @name         Chat Spam Filter For fishtank.live
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Filters repeated characters and phrases in chat, with toggle via Shift+T
// @author       Blungs
// @match        https://*.fishtank.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fishtank.live
// @license      MIT
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/515188/Chat%20Spam%20Filter%20For%20fishtanklive.user.js
// @updateURL https://update.greasyfork.org/scripts/515188/Chat%20Spam%20Filter%20For%20fishtanklive.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONSECUTIVE_LIMIT = 4;
    let showFiltered = false;

    function filterRepeatedChars(text) {
        return text.replace(/(\w)\1{3,}/g, (match, char) => char.repeat(CONSECUTIVE_LIMIT));
    }

    function filterRepeatedWords(text) {
        const words = text.split(/\s+/);
        const seen = new Set();
        const result = [];

        for (const word of words) {
            const lower = word.toLowerCase();
            if (!seen.has(lower)) {
                seen.add(lower);
                result.push(word);
            }
        }
        return result.join(' ');
    }

    function processSpan(span) {
        if (!span || span.dataset.filteredProcessed === "true") return;

        const original = span.textContent.trim();
        if (!original) return;

        let filtered = filterRepeatedChars(original);
        filtered = filterRepeatedWords(filtered);

        const wasModified = original !== filtered;

        if (wasModified) {
            console.log(`[Filter] Original: "${original}" → Filtered: "${filtered}"`);

            const wrapper = document.createElement("span");
            wrapper.className = "filtered-spam-message";
            wrapper.dataset.filteredProcessed = "true";
            wrapper.textContent = showFiltered ? filtered : filtered.slice(0, 4) + "...";
            wrapper.title = original;

            span.style.display = "none"; // Hide original visually
            span.after(wrapper); // Place new filtered span
        }
    }

    function observeChat() {
        const chat = document.getElementById('chat-messages');
        if (!chat) return setTimeout(observeChat, 1000);

        const observer = new MutationObserver(mutations => {
            mutations.forEach(m => {
                m.addedNodes.forEach(node => {
                    if (node.nodeType !== 1) return;

                    if (node.tagName === 'SPAN') {
                        processSpan(node);
                    } else {
                        node.querySelectorAll('span').forEach(processSpan);
                    }
                });
            });
        });

        observer.observe(chat, { childList: true, subtree: true });
        console.log("[ChatSpamFilter] Observer started.");
    }

    function handleToggle(e) {
        if (e.shiftKey && e.key.toLowerCase() === 't') {
            showFiltered = !showFiltered;
            document.querySelectorAll('.filtered-spam-message').forEach(span => {
                const original = span.title;
                const display = showFiltered ? original : original.slice(0, 4) + "...";
                span.textContent = display;
            });
            console.log(`[ChatSpamFilter] Filtered messages are now ${showFiltered ? "visible" : "collapsed"}`);
        }
    }

    window.addEventListener('keydown', handleToggle);

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        observeChat();
    } else {
        window.addEventListener('DOMContentLoaded', observeChat);
    }
})();
