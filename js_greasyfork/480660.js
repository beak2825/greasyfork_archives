// ==UserScript==
// @name         Reddit NSFW Content Pop-Up Blocker
// @namespace    「𓆩╰‿╯𓆪」︎➤  𝐂ʀᴇᴀᴛᴇᴅ 𝐁ʏ 𝐁ᴏᴛ𝐗ᴄʀᴀᴄ𝐊
// @version      Premium
// @description  Blocks NSFW Content Pop-Up On Reddit
// @author       「𓆩╰‿╯𓆪」︎➤  𝐁ᴏᴛ𝐗ᴄʀᴀᴄ𝐊
// @run-at       document-start
// @match        https://www.reddit.com/r/*
// @match        https://www.reddit.com/user/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480660/Reddit%20NSFW%20Content%20Pop-Up%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/480660/Reddit%20NSFW%20Content%20Pop-Up%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

var loaders = document.getElementsByTagName("shreddit-async-loader");
var popup = loaders[loaders.length - 1];
if (popup.classList.contains("theme-beta")) {
    popup.remove();
    var blurElement =
        document.getElementsByTagName("reddit-breadcrumbs")[0]
            ?.nextElementSibling;
    if (blurElement !== undefined) {
        blurElement.style = "";
        document.body.style = "";

        document
            .getElementsByTagName("xpromo-nsfw-blocking-container")[0]
            ?.shadowRoot.children[1].remove();
    }
}
})();