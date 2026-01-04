// ==UserScript==
// @name Rule34 URL Fixer
// @version 1
// @description rule34 irl fixer
// @grant none
// @include https://rule34hentai.net/*
// @namespace https://greasyfork.org/users/1445698
// @downloadURL https://update.greasyfork.org/scripts/529822/Rule34%20URL%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/529822/Rule34%20URL%20Fixer.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
var currentURL = window.location.href;
var fixedURL = currentURL.replace(/%20|\s/g, '+');
if (currentURL !== fixedURL) {
window.location.href = fixedURL;
}
}, false);