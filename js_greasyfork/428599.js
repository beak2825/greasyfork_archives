// ==UserScript==
// @name         Grayscale AtCoder
// @description  Change images in AtCoder to grayscale with mouse over.
// @include      https://atcoder.jp/*
// @grant        GM_addStyle
// @run-at       document-start
// @version 0.0.1.20210628153314
// @namespace https://greasyfork.org/users/788211
// @downloadURL https://update.greasyfork.org/scripts/428599/Grayscale%20AtCoder.user.js
// @updateURL https://update.greasyfork.org/scripts/428599/Grayscale%20AtCoder.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
GM_addStyle ( `
img:hover {
-webkit-filter: grayscale(100%);
-moz-filter: grayscale(100%);
-ms-filter: grayscale(100%);
-o-filter: grayscale(100%);
filter: grayscale(100%);
}
` );
