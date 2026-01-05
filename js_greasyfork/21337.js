// ==UserScript==
// @name         Sticky Search Bar for Google SERP
// @description  Keeps Google Search Bar sticky (fixed position) for use in SEO research with GoogleMonkeyR's infinite scroll/ease of use
// @author       Nyk Zukowski
// @include      https://www.google.com/*
// @grant        GM_addStyle
// @version      1.0.1
// @namespace https://greasyfork.org/users/54551
// @downloadURL https://update.greasyfork.org/scripts/21337/Sticky%20Search%20Bar%20for%20Google%20SERP.user.js
// @updateURL https://update.greasyfork.org/scripts/21337/Sticky%20Search%20Bar%20for%20Google%20SERP.meta.js
// ==/UserScript==

/*jshint multistr: true */

/* Found these elements by Inspecting in Chrome, applied custom CSS and duplicated here; working cleanly as of 12 July 2016 */

GM_addStyle(" .sfbg { position: fixed; } }");

GM_addStyle(" #searchform { position: fixed !important; margin: -10px 0 0 !important; }");

GM_addStyle(" .div.sfbg, div.sfbgg { height: 80px !important; }");