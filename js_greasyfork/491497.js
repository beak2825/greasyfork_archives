// ==UserScript==
// @name        Standardise sandwich rotation on rotatingsandwiches.com
// @namespace   rotatingsandwiches.com.danq.me
// @match       https://rotatingsandwiches.com/*
// @grant       GM_addStyle
// @version     1.0
// @author      Dan Q <https://danq.me/>
// @license     The Unlicense / Public Domain
// @description Some sandwiches on rotatingsandwiches.com rotate in the opposite direction to the majority. 😡 Let's fix that.
// @downloadURL https://update.greasyfork.org/scripts/491497/Standardise%20sandwich%20rotation%20on%20rotatingsandwichescom.user.js
// @updateURL https://update.greasyfork.org/scripts/491497/Standardise%20sandwich%20rotation%20on%20rotatingsandwichescom.meta.js
// ==/UserScript==

GM_addStyle('.wp-image-216, .wp-image-217 { transform: scaleX(-1); }');
