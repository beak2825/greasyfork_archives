// ==UserScript==
// @name         千峰pmp空格暂停
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.codingke.com/
// @grant        none
// @include      http://*codingke.com/*
// @downloadURL https://update.greasyfork.org/scripts/411334/%E5%8D%83%E5%B3%B0pmp%E7%A9%BA%E6%A0%BC%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/411334/%E5%8D%83%E5%B3%B0pmp%E7%A9%BA%E6%A0%BC%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
document.addEventListener('keydown', function(e) {
  if (!e) {
    e = window.event;
  }
  var myPlayer = document.getElementById('codingke_video_html5_api');
  if (e.keyCode === 32) {
    if (myPlayer.paused) {
      myPlayer.play();
    } else {
      myPlayer.pause();
    }
  }
})
})();