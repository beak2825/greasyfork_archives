// ==UserScript==
// @name         Telegram Stickers to Emoji
// @namespace    Telegram Stickers to Emoji
// @version      1.0
// @description  Convert Telegram Stickers to Emoji for simplier viewing
// @author       Anon043
// @match        https://web.telegram.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33726/Telegram%20Stickers%20to%20Emoji.user.js
// @updateURL https://update.greasyfork.org/scripts/33726/Telegram%20Stickers%20to%20Emoji.meta.js
// ==/UserScript==
(function() {
    setInterval(function() {
        $( "img[alt*='Sticker']" ).each(function() {
            $(this).parent("div.clickable").removeAttr("style"); // Remove sticker size
            $(this).replaceWith($(this).attr("alt").replace("[", "").replace(" Sticker]", "")); // [*emoji* Sticker] --> Emoji
        });
    }, 500);
})();