// ==UserScript==
// @name         Kpal's CSS
// @match        *://krunker.io/*
// @description  A fresh CSS for the blockgame
// @version      1.0
// @namespace    https://skidlamer.github.io/css/kpal.css
// @grant        GM_addStyle
// @connect      github.io
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/420968/Kpal%27s%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/420968/Kpal%27s%20CSS.meta.js
// ==/UserScript==

const customCssLink = "https://skidlamer.github.io/css/kpal.css"

GM_xmlhttpRequest({
    method: "GET",
    url: customCssLink,
    onload: (res) => {
        GM_addStyle(res.responseText)
    }
})