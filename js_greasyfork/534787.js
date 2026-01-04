// ==UserScript==
// @name         Remove Emoji from Tweets on X.com
// @namespace    http://tampermonkey.net/
// @version      2025.05.03
// @description  Removes all emoji characters from tweets and replies on X.com (Twitter)
// @author       GPT
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/534787/Remove%20Emoji%20from%20Tweets%20on%20Xcom.user.js
// @updateURL https://update.greasyfork.org/scripts/534787/Remove%20Emoji%20from%20Tweets%20on%20Xcom.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Emoji regex (covers most modern emojis)
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

    // Replace emojis in tweet content
    function removeEmojis() {
        const tweetTextNodes = document.querySelectorAll('article div[lang]');
        tweetTextNodes.forEach(node => {
            if (!node.dataset.emojiStripped) {
                node.innerText = node.innerText.replace(emojiRegex, '');
                node.dataset.emojiStripped = "true";
            }
        });
    }

    // Run on new content periodically
    const interval = setInterval(removeEmojis, 1500);

    // Optional: Stop after 10 minutes to save resources
    // setTimeout(() => clearInterval(interval), 600000);
})();
