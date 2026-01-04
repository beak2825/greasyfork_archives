// ==UserScript==
// @name         VK Video Live Auto Claim
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  VK Video Live Channel Currency Auto Claim Script
// @author       edvardeishen
// @match        https://live.vkvideo.ru/*
// @match        *://*.live.vkvideo.ru/*
// @match        *://live.vkvideo.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=live.vkvideo.ru
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541859/VK%20Video%20Live%20Auto%20Claim.user.js
// @updateURL https://update.greasyfork.org/scripts/541859/VK%20Video%20Live%20Auto%20Claim.meta.js
// ==/UserScript==

(function () {
  'use strict';
  function pressButton() {
    var AutoPoint = document.querySelectorAll('button[class*="PointActions_buttonBonus_"]');
    if (AutoPoint.length >= 1) {
		AutoPoint[0].click();
		console.log("Climed");
	}
    timeClick();
  }
  function timeClick() {
    setTimeout(function () {
      pressButton();
    }, Math.random() * 1870 + 7600);
  }
  timeClick();
})();