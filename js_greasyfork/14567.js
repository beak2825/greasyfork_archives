// ==UserScript==
// @name        RIP Twitter Moments
// @namespace   misentropic.com
// @version 0.1
// @description Removes Twitter Moments from the web client
// @match    https://twitter.com/*
// @copyright Chris Engel
// @license WTFPL v2; http://www.wtfpl.net/about/

// @downloadURL https://update.greasyfork.org/scripts/14567/RIP%20Twitter%20Moments.user.js
// @updateURL https://update.greasyfork.org/scripts/14567/RIP%20Twitter%20Moments.meta.js
// ==/UserScript==
var moments = document.querySelector('.moments');

if (moments) {
  moments.parentNode.removeChild(moments);
}