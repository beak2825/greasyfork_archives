// ==UserScript==
// @name         Hookshot Media Fix YouTube
// @namespace    http://tampermonkey.net/
// @version      1.1
// @license      GPLv3
// @description  Fix broken YouTube video embeds on Hookshot Media sites (Nintendo Life, Push Square, Pure Xbox) when using uBlock Origin/Pi-hole
// @author       xdpirate
// @match        https://www.nintendolife.com/*
// @match        https://www.pushsquare.com/*
// @match        https://www.purexbox.com/*
// @match        https://www.timeextension.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nintendolife.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441481/Hookshot%20Media%20Fix%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/441481/Hookshot%20Media%20Fix%20YouTube.meta.js
// ==/UserScript==

let vids = document.querySelectorAll("figure.youtube");

for(let i = 0; i < vids.length; i++) {
    let vidLink = "https://www.youtube.com/embed/" + vids[i].getAttribute("data-videoid");
    vids[i].innerHTML = `<iframe class="resize" src="${vidLink}" style="border: none;"></iframe>`;
}