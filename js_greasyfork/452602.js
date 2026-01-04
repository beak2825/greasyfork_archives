// ==UserScript==
// @license MIT
// @name Urbtix
// @namespace http://tampermonkey.net/
// @version 0.1
// @description TEST
// @author TEST
// @include http://msg.urbtix.hk/*
// @include http://busy.urbtix.hk/*
// @include http://urbtix.hk/

// @grant none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/452602/Urbtix.user.js
// @updateURL https://update.greasyfork.org/scripts/452602/Urbtix.meta.js
// ==/UserScript==

(function() {

Object.defineProperty(window, 'remainTime', { value: 100 });

'use strict';
location.replace("http://urbtix.hk/");
})();

unsafeWindow.alert=function (str) {
console.log ("Greasemonkey intercepted alert: ", str);}