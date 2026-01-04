// ==UserScript==
// @name         GitHub Contribute Modifier
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  try to take over the world!
// @author       SheldonCoulson
// @match        *://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421273/GitHub%20Contribute%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/421273/GitHub%20Contribute%20Modifier.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let rect = document.getElementsByClassName("ContributionCalendar-day");
  let total = 0;
  for (let i = 0; i < rect.length - 6; i++) {
    let RNum = Math.floor(Math.random() * 10);
    if (!(Math.abs(RNum * i + i) % RNum)) {
      rect[i].attributes["data-count"].value = Math.abs(Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10)) - Math.PI * 16 / 25;
      let color = rect[i].attributes["data-count"].value;
      if (color >= 1 && color <= 10) {
        rect[i].attributes["data-level"].value = 1;
      } else if (color > 10 && color <= 15) {
        rect[i].attributes["data-level"].value = 2;
      } else if (color > 15 && color <= 20) {
        rect[i].attributes["data-level"].value = 3;
      } else if (color > 20) {
        rect[i].attributes["data-level"].value = 4;
      } else {
        rect[i].attributes["data-level"].value = 0;
      }
    }
    total += parseInt(rect[i].attributes["data-count"].value);
  }
  let NUM = document.getElementsByClassName("f4 text-normal mb-2");
  NUM[1].innerText = total + " contributions in the last year";
})();