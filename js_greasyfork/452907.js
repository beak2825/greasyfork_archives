// ==UserScript==
// @name Urbtix
// @namespace http://tampermonkey.net/
// @version 1.1
// @description TEST
// @author TEST
// @include http://msg.urbtix.hk/*
// @include http://busy.urbtix.hk/*
// @include http://urbtix.hk/

// @grant none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/452907/Urbtix.user.js
// @updateURL https://update.greasyfork.org/scripts/452907/Urbtix.meta.js
// ==/UserScript==

function redirect() {

'use strict';
location.replace("http://urbtix.hk/");
}
window.setTimeout(function(){redirect()},100);