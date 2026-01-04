// ==UserScript==
// @name         Web Text Reader (Read with VibeVoice.info TTS)
// @namespace    https://vibevoice.info/
// @version      1.1
// @description  Adds a right-click context menu item to read any selected text on a webpage using the free, high-quality VibeVoice.info AI TTS service.
// @author       VibeVoice.info
// @match        *://*/*
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @icon         data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' fill='%23818CF8'%3e%3cpath d='M0 48C0 21.5 21.5 0 48 0H464c26.5 0 48 21.5 48 48V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V48zM128 152c0-13.3-10.7-24-24-24s-24 10.7-24 24V360c0 13.3 10.7 24 24 24s24-10.7 24-24V152zm128 40c0-13.3-10.7-24-24-24s-24 10.7-24 24V360c0 13.3 10.7 24 24 24s24-10.7 24-24V192zm128-72c0-13.3-10.7-24-24-24s-24 10.7-24 24V360c0 13.3 10.7 24 24 24s24-10.7 24-24V120z'/%3e%3c/svg%3e
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547439/Web%20Text%20Reader%20%28Read%20with%20VibeVoiceinfo%20TTS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547439/Web%20Text%20Reader%20%28Read%20with%20VibeVoiceinfo%20TTS%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Register a command in the right-click context menu.
    GM_registerMenuCommand("🔊 Read with VibeVoice TTS", () => {
        // 1. Get the text currently highlighted by the user.
        const selectedText = window.getSelection().toString().trim();

        // 2. Check if any text was actually selected.
        if (selectedText) {
            // 3. Construct the URL for vibevoice.info, adding the selected text as a parameter.
            const baseUrl = 'https://vibevoice.info/';
            const url = new URL(baseUrl);
            // Use URLSearchParams to safely encode any special characters.
            url.searchParams.set('text', selectedText);

            // 4. Open the generated link in a new, active browser tab.
            GM_openInTab(url.href, { active: true });
        } else {
            // If no text is selected, provide a helpful alert.
            alert("Please select some text first, then use the 'Read with VibeVoice TTS' feature.");
        }
    });
})();