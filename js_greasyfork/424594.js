// ==UserScript==
// @name          Offline time shortener
// @version       1.1
// @namespace     Zahonek
// @description   Shorten that long offline time on chracter selection page.
// @author        Mrkef
// @match         *://*.idlescape.com/characters
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/424594/Offline%20time%20shortener.user.js
// @updateURL https://update.greasyfork.org/scripts/424594/Offline%20time%20shortener.meta.js
// ==/UserScript==

let send = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function() {
    send.apply(this, arguments);
    this.addEventListener('readystatechange', function() {
        if (this.responseURL.includes("api/auth/character-info") && this.readyState === 4) {
        let agoes = document.getElementsByClassName("character-last-logged-in");
        for (let a of agoes) {
            a.textContent = a.textContent.replace("Last logged in: ", "").replace(" hours", "h").replace(" hour", "h").replace(" minutes", "m").replace(" minute", "m").replace(" seconds", "s").replace(" second", "s").replace(" ago", "");
        }
        }
    }, false);
};