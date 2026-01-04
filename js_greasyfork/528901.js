// ==UserScript==
// @name         Wanikani Forums: Restore Apple Emojis
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Replaces Discourse emojis with Apple emojis from Emojipedia
// @author       latepotato
// @include      https://community.wanikani.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528901/Wanikani%20Forums%3A%20Restore%20Apple%20Emojis.user.js
// @updateURL https://update.greasyfork.org/scripts/528901/Wanikani%20Forums%3A%20Restore%20Apple%20Emojis.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // Fetch emoji mapping (Discourse shortcode -> Emojipedia shortname)
    let emojiMap = {};
    try {
        const response = await fetch("https://mynameisbjoern.github.io/discourse-to-emojipedia-mappings/emoji_mappings.json");
        emojiMap = await response.json();
    } catch (error) {
        console.error("Failed to load emoji mappings:", error);
        return;
    }

    function replaceEmojis() {
        document.querySelectorAll("img.emoji").forEach(img => {
            const match = img.src.match(/\/apple\/([^\/]+)\.png/);
            if (match) {
                const shortcode = match[1];
                if (emojiMap[shortcode]) {
                    const emojipediaName = emojiMap[shortcode][0].toLowerCase().replace(': ', '-').replace(' & ', '-').replace(' - ', '-').replace(/ /g, '-');
                    const unicode = emojiMap[shortcode][1].toLowerCase().replace(/ /g, '-');

                    // Construct new image URL
                    const newUrl = `https://em-content.zobj.net/source/apple/391/${emojipediaName}_${unicode}.png`;
                    img.src = newUrl;
                }
            }
        });
    }

    // Run on page load and when new content is added
    replaceEmojis();
    const observer = new MutationObserver(replaceEmojis);
    observer.observe(document.body, { childList: true, subtree: true });

})();