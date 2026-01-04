// ==UserScript==
// @name        Fastest aternos adblocker
// @namespace   Violentmonkey Scripts
// @match       https://aternos.org/*
// @grant       none
// @version     1.0
// @author      rundik
// @description Blocks ads on aternos.org (adjust timing for your internet connection I guess)
// @downloadURL https://update.greasyfork.org/scripts/411698/Fastest%20aternos%20adblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/411698/Fastest%20aternos%20adblocker.meta.js
// ==/UserScript==
(function () {

  const body = document.querySelector(".body");
  const header = document.querySelector("header.header");
  document.querySelector("div[style*='#F62451']").remove();
  setTimeout(function() {
    body.setAttribute("style", "");
    header.setAttribute("style", "");
    body.style.zIndex = "999999999";
    body.style.width = "100vw";
    body.style.height = "100vh";
  }, 300)
})();