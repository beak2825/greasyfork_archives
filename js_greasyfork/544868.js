// ==UserScript==
// @name         Show Only Revives Above X% (Full Row Color)
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Shows only revives above a certain % and colors the row
// @match        https://www.torn.com/hospital*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544868/Show%20Only%20Revives%20Above%20X%25%20%28Full%20Row%20Color%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544868/Show%20Only%20Revives%20Above%20X%25%20%28Full%20Row%20Color%29.meta.js
// ==/UserScript==

(function () {
  "use strict";
  let minChance = parseFloat(localStorage.getItem("RRBX_chance")) || 20;

  const addButton = () => {
    if (document.querySelector(".rrbx")) return;
    const btn = document.createElement("button");
    btn.innerHTML = "% Setting";
    btn.className = "rrbx t-clear h c-pointer m-icon line-h24 right last";
    btn.onclick = () => {
      let input = parseFloat(prompt("Show only revive chances ABOVE what %?", minChance));
      if (!isNaN(input) && input >= 0 && input <= 100) {
        minChance = input;
        localStorage.setItem("RRBX_chance", minChance);
      }
    };
    document.querySelector("#top-page-links-list")?.appendChild(btn);
  };

  const getColorForChance = (percent) => {
    if (percent > 90) return "#4CAF50";      // Green
    else if (percent > 60) return "#FFD700"; // Gold
    else if (percent > 40) return "#FFA500"; // Orange
    else return "#DC143C";                   // Red
  };

  const filterAndColorRevives = () => {
    document.querySelectorAll(".revive > li").forEach(row => {
      if (row.querySelector("a.reviveNotAvailable")) {
        row.remove();
        return;
      }

      const percentText = row.querySelector(".ajax-action b")?.textContent;
      if (!percentText) return;

      const percent = parseFloat(percentText.replace("%", ""));
      if (isNaN(percent)) return;

      // Remove if below or equal to the minChance
      if (percent <= minChance) {
        row.remove();
        return;
      }

      // Color the whole row
      const color = getColorForChance(percent);
      row.style.backgroundColor = color;
      row.style.color = (percent > 60 ? "black" : "white");
      row.style.fontWeight = "bold";
    });
  };

  setInterval(() => {
    addButton();
    filterAndColorRevives();
  }, 300);
})();
