// ==UserScript==
// @name        Skip Link Filter Steam
// @namespace   s4nji
// @description Skips the link filter on steam
// @include     https://steamcommunity.com/linkfilter/?url=*
// @version     1
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/3231/Skip%20Link%20Filter%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/3231/Skip%20Link%20Filter%20Steam.meta.js
// ==/UserScript==

(function() {
var pat = /\??url=(.+)\&?/i;
var url = window.location.search;

window.location = url.match(pat)[1];
})();