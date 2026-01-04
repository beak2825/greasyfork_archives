// ==UserScript==
// @name         Make TikToks clickable
// @namespace    http://tamtampermonkey.net/
// @description  Fixes TikTok's annoying link behavior so you can middle-click to open videos in a new tab, just like any normal link.
// @license      MIT
// @version      1
// @grant        GM.addStyle
// @match        *://*.tiktok.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/528402/Make%20TikToks%20clickable.user.js
// @updateURL https://update.greasyfork.org/scripts/528402/Make%20TikToks%20clickable.meta.js
// ==/UserScript==

GM.addStyle('.css-1rjlivr-LinkNonClickable { pointer-events: auto !important; }');