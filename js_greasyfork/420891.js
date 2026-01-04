// ==UserScript==
// @name        Mobile Wikipedia for Desktop: A Modern Design
// @namespace   A
// @include     /^https?://..\.wikipedia\.org/.*$/
// @version     1.1
// @grant       none
// @description Open Wikipedia in a better looking mobile mode.
// Original Author Krishna
// Updated by nascent
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/420891/Mobile%20Wikipedia%20for%20Desktop%3A%20A%20Modern%20Design.user.js
// @updateURL https://update.greasyfork.org/scripts/420891/Mobile%20Wikipedia%20for%20Desktop%3A%20A%20Modern%20Design.meta.js
// ==/UserScript==



var newHost = window.location.host
var host = newHost.slice(0, 3) + "m." + newHost.slice(3);

var newURL = window.location.protocol + "//" + host + "" + window.location.pathname;

window.open(newURL,"_self");