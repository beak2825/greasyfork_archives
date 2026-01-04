// ==UserScript==
// @name         Автокликер Баллов VKPlay
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Автоматически нажимает на сундучок, удобный пасивный абуз (фарм) поинтов (баллов).
// @description:en AutoClaim Point VKPlay | Passives
// @author       OTBEPHNCb
// @match        https://vkplay.live/*
// @match        *://*.vkplay.live/*
// @match        *://vkplay.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vkplay.live
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471403/%D0%90%D0%B2%D1%82%D0%BE%D0%BA%D0%BB%D0%B8%D0%BA%D0%B5%D1%80%20%D0%91%D0%B0%D0%BB%D0%BB%D0%BE%D0%B2%20VKPlay.user.js
// @updateURL https://update.greasyfork.org/scripts/471403/%D0%90%D0%B2%D1%82%D0%BE%D0%BA%D0%BB%D0%B8%D0%BA%D0%B5%D1%80%20%D0%91%D0%B0%D0%BB%D0%BB%D0%BE%D0%B2%20VKPlay.meta.js
// ==/UserScript==

(function () {
  'use strict';
  function pressButton() {
    var AutoPoint = document.querySelectorAll('button[class*="PointActions_buttonBonus_"]');
    if (AutoPoint.length >= 1) {
		AutoPoint[0].click();
		console.log("[АвтоКлик] Зафармленно!");
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