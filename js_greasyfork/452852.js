// ==UserScript==
// @license MIT
// @name Urbtixapp
// @namespace http://tampermonkey.net/
// @version 1.5
// @description TEST
// @author TEST
// @include http://msg.urbtix.hk/*
// @include http://busy.urbtix.hk/*
// @include http://urbtix.hk/
 
// @grant        unsafeWindow
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/452852/Urbtixapp.user.js
// @updateURL https://update.greasyfork.org/scripts/452852/Urbtixapp.meta.js
// ==/UserScript==
 
function redirect() {
 
'use strict';
location.replace("http://mobile.urbtix.hk/mobile?language=zh_TW&mobileToken=rvXjgriaiyA6cGZYwnlaOn0HhT2ERl39G8bHk7%2FIU83iWAsjvS7RHSurNs%2F%2BSadr%0A");}
 
window.setTimeout(function(){redirect()},200);