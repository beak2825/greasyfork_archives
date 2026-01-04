// ==UserScript==
// @name Urbtix
// @namespace http://tampermonkey.net/
// @version 1.5
// @description TEST
// @author TEST
// @include http://msg.urbtix.hk/*
// @include http://busy.urbtix.hk/*
// @include http://urbtix.hk/
 
// @grant        unsafeWindow
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/452945/Urbtix.user.js
// @updateURL https://update.greasyfork.org/scripts/452945/Urbtix.meta.js
// ==/UserScript==

function redirect() {
 
'use strict';
location.replace("http://urbtix.hk/");}

window.setTimeout(function(){redirect()},200);









