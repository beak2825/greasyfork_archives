// ==UserScript==
// @name         FranceTV Player Overlay
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Remove the dark overlay on FranceTV player
// @author       You
// @license      MIT
// @match        https://www.france.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=france.tv
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/523465/FranceTV%20Player%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/523465/FranceTV%20Player%20Overlay.meta.js
// ==/UserScript==

GM_addStyle ( `
.ftv-magneto-main {
    background-image: none !important;
}
` );

