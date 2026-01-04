// ==UserScript==
// @name         Discord Emoji URL Extractor (Shift Modifier)
// @namespace    https://greasyfork.org/en/scripts/531175-discord-emoji-url-extractor-shift-modifier
// @version      1.2
// @description  Quickly extract emoji URL from Discord when Shift+Clicking and copy it to clipboard with size=48, otherwise use default behavior. This is useful if you don't have nitro and still want to use animated emotes or any emote as a gif instead as a cheap mans emoji.
// @author       Cragsand
// @license      MIT
// @match        *://discord.com/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/531175/Discord%20Emoji%20URL%20Extractor%20%28Shift%20Modifier%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531175/Discord%20Emoji%20URL%20Extractor%20%28Shift%20Modifier%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('click', async function(event) {
        // Check if Shift is held down
        if (!event.shiftKey) {
            return; // Allow normal Discord behavior
        }

        // Find the closest emoji button based on stable attributes
        let emojiButton = event.target.closest('button[data-type="emoji"]');
        if (emojiButton) {
            event.stopPropagation();
            event.preventDefault();

            // Find the emoji image inside the button
            let emojiImg = emojiButton.querySelector('img[src*="cdn.discordapp.com/emojis/"]');
            if (emojiImg && emojiImg.src) {
                let emojiURL = new URL(emojiImg.src);
                emojiURL.searchParams.set('size', '48'); // Force size=48

                // Copy modified emoji URL to clipboard
                try {
                    await navigator.clipboard.writeText(emojiURL.toString());
                } catch (err) {
                    console.error("Clipboard copy failed, using fallback:", err);
                    GM_setClipboard(emojiURL.toString()); // Tampermonkey fallback
                }
            }
        }
    }, true);
})();
