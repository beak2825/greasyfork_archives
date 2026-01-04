// ==UserScript==
// @name kiwiSpotify
// @license MIT
// @namespace https://t.co/V5A0eSOppW
// @version 0.1
// @run-at document-start
// @description make spotify working on mobile
// @author tngroup
// @include http*://*.spotify.com/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/476689/kiwiSpotify.user.js
// @updateURL https://update.greasyfork.org/scripts/476689/kiwiSpotify.meta.js
// ==/UserScript==
(function() {
'use strict';
var _scr = {};
for (const key in screen) {
switch (key) {
case "width":
_scr[key] = 1080;
break;
case "height":
_scr[key] = 1920;
break;
default:
_scr[key] = screen[key];
break;
}
}
    window.screen = _scr;
})();