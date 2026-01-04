// ==UserScript==
// @name     Stadium Videos Widescreen
// @description Watch stadium videos to fit browser width
// @version 1.0
// @license MIT
// @namespace watchstadium.com
// @match    *watchstadium.com/*
// @grant    GM_addStyle
// @run-at   document-start
// @downloadURL https://update.greasyfork.org/scripts/440233/Stadium%20Videos%20Widescreen.user.js
// @updateURL https://update.greasyfork.org/scripts/440233/Stadium%20Videos%20Widescreen.meta.js
// ==/UserScript==



GM_addStyle(`
.livePage__player { max-width: unset !important ; }
`)

