// ==UserScript==
// @name        GeoGuessr Readable UI
// @namespace   https://greasyfork.org/en/users/1435525-rawblocky
// @match       https://www.geoguessr.com/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant       GM_addStyle
// @license     MIT
// @version     1.0
// @author      Rawblocky
// @description Removes forced UPPERCASE and italics on all text. Some text may have incorrect casing.
// @downloadURL https://update.greasyfork.org/scripts/527053/GeoGuessr%20Readable%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/527053/GeoGuessr%20Readable%20UI.meta.js
// ==/UserScript==


GM_addStyle(`
* {text-transform: none !important}
* {font-style: normal !important}
`);