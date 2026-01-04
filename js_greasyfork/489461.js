// ==UserScript==
// @name         Twitter Disable Twemoji
// @namespace    https://lit.link/toracatman
// @version      2025-02-16
// @description  Disable Twemoji on Twitter.
// @author       トラネコマン
// @match        https://x.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489461/Twitter%20Disable%20Twemoji.user.js
// @updateURL https://update.greasyfork.org/scripts/489461/Twitter%20Disable%20Twemoji.meta.js
// ==/UserScript==

(() => {
    setInterval(() => {
        var a = document.querySelectorAll('img[src*="emoji"]');
        for (var i = 0; i < a.length; i++) {
            var b = document.createTextNode(a[i].alt);
            a[i].replaceWith(b);
        }
    }, 100);
})();