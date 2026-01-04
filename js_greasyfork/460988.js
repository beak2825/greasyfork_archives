// ==UserScript==
// @name Reader by Kai
// @version 0.4
// @author folfcoder
// @description Read Kompas.com and Tribunnews.com without ads and distractions.
// @namespace https://gist.github.com/folfcoder/c80ebb177db1e83dd12e24432a9b58b6/raw/reader.user.js
// @match *://*.kompas.com/*read*
// @match *://*.kompas.id/baca*
// @match *://*.tribunnews.com/*/*/*/*
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460988/Reader%20by%20Kai.user.js
// @updateURL https://update.greasyfork.org/scripts/460988/Reader%20by%20Kai.meta.js
// ==/UserScript==

var currentUrl = window.location.href;
window.location.replace("https://reader.fcd.im/" + currentUrl);