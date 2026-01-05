// ==UserScript==
// @name         Disable GIF autoplay in TweetDeck
// @namespace    http://yal.cc
// @version      1.0
// @description  See https://yal.cc/tweetdeck-no-gif-autoplay/
// @author       YellowAfterlife
// @match        https://tweetdeck.twitter.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30201/Disable%20GIF%20autoplay%20in%20TweetDeck.user.js
// @updateURL https://update.greasyfork.org/scripts/30201/Disable%20GIF%20autoplay%20in%20TweetDeck.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function() {
        var nodes = document.querySelectorAll(".js-media-preview-container.is-gif:not(.cc_yal_tweetdeck_gif_autopause)");
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if (!node.classList.contains("is-manually-paused") && !node.parentElement.classList.contains("detail-preview")) {
                var pauseButton = node.querySelector(".gif-pause");
                if (!pauseButton) continue;
                pauseButton.click();
                if (!node.classList.contains("is-manually-paused")) continue;
            }
            node.classList.add("cc_yal_tweetdeck_gif_autopause");
        }
    }, 500);
})();