// ==UserScript==
// @name         Discord monospace
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Convert discord chat messages to monospace
// @author       Gibrietas Daughter of the Cosmos
// @match        *://discord.com/*
// @grant        GM_addStyle
// @license.     MIT
// @downloadURL https://update.greasyfork.org/scripts/447718/Discord%20monospace.user.js
// @updateURL https://update.greasyfork.org/scripts/447718/Discord%20monospace.meta.js
// ==/UserScript==

GM_addStyle(`
[class*="messageContent"] {
    font-family: monospace;
}
`)
