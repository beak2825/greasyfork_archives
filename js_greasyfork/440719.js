// ==UserScript==
// @name         BetterTTV
// @namespace    https://giuseppe.eletto.org
// @description  This script loads BetterTTV.
// @author       Giuseppe Eletto
// @version      1.0.1
// @license      MIT
// @match        *://*.twitch.tv/*
// @downloadURL https://update.greasyfork.org/scripts/440719/BetterTTV.user.js
// @updateURL https://update.greasyfork.org/scripts/440719/BetterTTV.meta.js
// ==/UserScript==

(function() {
    // Constants
    const BTTV_CDN = 'https://cdn.betterttv.net'

    // Create element to load BetterTTV js
    const jsNode = document.createElement('script')
    jsNode.setAttribute('src', `${BTTV_CDN}/betterttv.js`)

    // Append elements to document
    document.body.appendChild(jsNode)
})()