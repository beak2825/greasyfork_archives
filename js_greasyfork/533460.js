// ==UserScript==
// @name         GPT Dictation Toggle (Alt+S) - Stable Edition
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Toggles voice dictation in ChatGPT using Alt+S (works even after browser restarts)
// @author       Kamil
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533460/GPT%20Dictation%20Toggle%20%28Alt%2BS%29%20-%20Stable%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/533460/GPT%20Dictation%20Toggle%20%28Alt%2BS%29%20-%20Stable%20Edition.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * Toggles between voice dictation start and stop buttons.
     * - If dictation is not active, starts it.
     * - If dictation is active, stops it.
     */
    function toggleVoiceDictation() {
        const startBtn = document.querySelector('button.composer-btn[aria-label="Dictate button"]');
        const stopBtn = document.querySelector('button.composer-btn[aria-label="Submit dictation"]');

        if (stopBtn) {
            stopBtn.click();
            console.log("🛑 Voice dictation stopped.");
        } else if (startBtn) {
            startBtn.click();
            console.log("🎤 Voice dictation started.");
        } else {
            console.warn("❌ No dictation button found (neither start nor stop).");
        }
    }

    /**
     * Listens for Alt+S to trigger the voice toggle.
     */
    document.addEventListener('keydown', function (e) {
        if (e.altKey && e.key.toLowerCase() === 's') {
            e.preventDefault();
            toggleVoiceDictation();
        }
    });

    console.log("✅ OpenAI Voice Toggle (Alt+S) script loaded.");
})();
