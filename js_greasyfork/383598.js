// ==UserScript==
// @name        slashdot de-hostname
// @namespace   slashdot
// @description redirect from hostname.slashdot.org to slashdot.org
// @include     https://*.slashdot.org/*
// @exclude     https://slashdot.org/*
// @version     0.1a
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/383598/slashdot%20de-hostname.user.js
// @updateURL https://update.greasyfork.org/scripts/383598/slashdot%20de-hostname.meta.js
// ==/UserScript==

var loc = window.location.href;
loc = loc.substring(loc.indexOf('//') + 1, loc.length);
window.location.href = "https://" + loc.substring(loc.indexOf('.') + 1, loc.length);