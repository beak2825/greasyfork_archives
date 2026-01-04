// ==UserScript==
// @name        Toggle EN/JP bilingualmanga.org
// @namespace   Violentmonkey Scripts
// @match       https://bilingualmanga.org/manga/*
// @grant       none
// @version     1.0
// @author      matt.LLVW
// @description Just press 't' to toggle EN/JP.
// @license MIT
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// @downloadURL https://update.greasyfork.org/scripts/477721/Toggle%20ENJP%20bilingualmangaorg.user.js
// @updateURL https://update.greasyfork.org/scripts/477721/Toggle%20ENJP%20bilingualmangaorg.meta.js
// ==/UserScript==
// #langb > button:nth-child(1)
VM.shortcut.register('t', () => {
  document.querySelectorAll("#langb > button:nth-child(1)")[0].click()
})