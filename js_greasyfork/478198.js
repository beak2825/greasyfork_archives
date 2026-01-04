// ==UserScript==
// @name         COMP9024_slide_helper
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  hope that can help you
// @author       Mingchen & Iwan
// @match        https://www.cse.unsw.edu.au/~cs9024/23T2/lecs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=unsw.edu.au
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478198/COMP9024_slide_helper.user.js
// @updateURL https://update.greasyfork.org/scripts/478198/COMP9024_slide_helper.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const Buttons = document.querySelectorAll("body > a");
  document.addEventListener("keydown", (e) => {
    if (e.key === "A" || e.key === "a" || e.key === "ArrowLeft") {
      Buttons[0].click();
    }
    if (e.key === "w" || e.key === "W") {
      Buttons[1].click();
    }
    if (e.key === "d" || e.key === "D" || e.key === "ArrowRight") {
      Buttons[2].click();
    }
    if (e.key === "s" || e.key === "S") {
      history.back();
    }
  });
})();