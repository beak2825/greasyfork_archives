// ==UserScript==
// @name        Mobile Wikipedia
// @namespace   A
// @include     https://en.wikipedia.org/*
// @version     1
// @grant       none
// @description Open Wikipedia in a better looking mobile mode.
// @description:en Open Wikipedia in a better looking mobile mode.
// @downloadURL https://update.greasyfork.org/scripts/17371/Mobile%20Wikipedia.user.js
// @updateURL https://update.greasyfork.org/scripts/17371/Mobile%20Wikipedia.meta.js
// ==/UserScript==



var newHost = window.location.host
var host = newHost.slice(0, 3) + "m." + newHost.slice(3);

var newURL = window.location.protocol + "//" + host + "" + window.location.pathname;

console.log(newURL);

window.open(newURL,"_self");