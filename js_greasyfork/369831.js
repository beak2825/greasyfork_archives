// ==UserScript==
// @name auto adjust youtube video speed
// @namespace Violentmonkey Scripts
// @description set youtube video speed to 1.5x(you can set your own speed) automatically.
// @match *://*.youtube.com/*
// @match *://*.bilibili.com/video/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require  https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @grant    GM_addStyle
// @version 0.0.3
// @downloadURL https://update.greasyfork.org/scripts/369831/auto%20adjust%20youtube%20video%20speed.user.js
// @updateURL https://update.greasyfork.org/scripts/369831/auto%20adjust%20youtube%20video%20speed.meta.js
// ==/UserScript==

waitForKeyElements ("video", function() {
  'use strict';
  // set your desired play speed here
  var rate = 1.7;
  document.querySelector('video').onplay=function() {
    document.querySelector('video').playbackRate = rate;
  }
  document.querySelector('video').playbackRate = rate;
});