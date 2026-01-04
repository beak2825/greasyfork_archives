// ==UserScript==
// @name         Stats to left
// @namespace    http://tampermonkey.net/
// @version      1.1.3
// @description  Changes your jstris stats to be vertical and to the left
// @author       Erickmack
// @match        https://jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422267/Stats%20to%20left.user.js
// @updateURL https://update.greasyfork.org/scripts/422267/Stats%20to%20left.meta.js
// ==/UserScript==

(function () {
  "use strict";
  let nStats = 0;
  // Your code here...
  const ALIGN_STATS_TO_TOP = false; // set true or false depending on what you want
  function putToLeft() {
    document.querySelectorAll("#main>div")[3].style.position = "relative";
    let gstats = document.querySelector("#gstats");
    gstats.style.position = "absolute";
    gstats.style.left = "-120px";
    if (ALIGN_STATS_TO_TOP) {
      gstats.style.top = `-400px`;
    } else {
      gstats.style.bottom = "12px";
    }
    let statLabels = document.querySelector("#statLabels");
    statLabels.style.marginLeft = "10px";
    statLabels.style.position = "absolute";
    statLabels.lineHeight = 0;
    let sTag = document.createElement("style");
    sTag.innerText =
      "#statLabels>span{text-align:left;line-height:1;display:block;height:50px;font-size:20px}";
    document.head.appendChild(sTag);
    const targetNode = document.getElementById("statLabels");
    const config = { childList: true };
    const callback = function (mutationsList, observer) {
      // Use traditional 'for loops' for IE 11
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          canvHeight();
          return;
        }
      }
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  }

  function canvHeight() {
    let labelsArr = Array.from(document.querySelectorAll("#statLabels>span"));
    let glstats = document.querySelector("#glstats");
    let height = labelsArr.length * 50;
    if (!nStats || nStats < labelsArr.length) {
      glstats.style.height = height + "px";
    }
    if (!ALIGN_STATS_TO_TOP) {
      let gstats = document.querySelector("#gstats");
      gstats.style.height = height + 24 + "px";
    }
    nStats = labelsArr.length;
    glstats.style.marginTop = "23px";
    glstats.style.filter =
      "sepia(1) brightness(0.5) hue-rotate(24deg) saturate(5550) brightness(206%)";
  }
  setTimeout(() => {
    putToLeft();
  }, 1000);
})();