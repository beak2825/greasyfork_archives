// ==UserScript==
// @name         Infoeduka Plus
// @namespace    student.racunarstvo.hr
// @version      0.5
// @description  Dodaje potreban preostali broj dolazaka i minimalan postotak za potpis.
// @author       Kristijan Rosandić
// @match        *://student.racunarstvo.hr/*
// @match        *://student.algebra.hr/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445666/Infoeduka%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/445666/Infoeduka%20Plus.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let updated = false;
  setInterval(update, 100);

  function update() {
    const attendancesEl = document.querySelector("#attendances-stats");
    if (!attendancesEl) return (updated = false);
    const [statsA, statsB] = attendancesEl.children;
    setRemainingCount(statsA, 0.5);
    setRemainingCount(statsB, 0.6);
    updated = true;
  }

  function setRemainingCount(statsEl, perc) {
    const [presentCount, totalCount] = [
      ...statsEl.querySelectorAll("strong"),
    ].map((el) => parseInt(el.textContent));
    const listEl = statsEl.querySelector(".list-container");
    const arrivalsTotal = listEl.querySelectorAll("li").length;
    const hoursPerArrival = totalCount / arrivalsTotal;
    const requiredCount = Math.ceil(perc * totalCount);
    const requiredPerc = ((requiredCount / totalCount) * 100).toFixed(2);
    const remainingCount = Math.max(0, requiredCount - presentCount);
    const remainingArrivals =
      Math.round((remainingCount / hoursPerArrival) * 10) / 10;
    const text = `Još ${remainingArrivals}👤 za ${requiredPerc}%`;
    if (updated) listEl.firstElementChild.textContent = text;
    else {
      const div = document.createElement("div");
      listEl.prepend(div);
      div.setAttribute("style", "margin-top: 15px; text-align: center;");
      div.textContent = text;
    }
  }
})();
