// ==UserScript==
// @name            Profile Showcase Tools
// @version         1.0
// @description     Steam Profile Showcase Changer
// @author          Nitoned (Origionally made by Chr_)
// @namespace       https://github.com/encumber
// @supportURL      https://github.com/encumber
// @include        /^https:\/\/steamcommunity\.com\/id\/[^/]+\/edit\/showcases\/?$/
// @include        /^https:\/\/steamcommunity\.com\/profiles\/\d+\/edit\/showcases\/?$/
// @license         AGPL-3.0
// @icon            https://steamuserimages-a.akamaihd.net/ugc/2269315845080321942/B191519C397E204A4B3CED3CAAE61AFCFF3D4119/?imw=66&imh=66&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true
// @downloadURL https://update.greasyfork.org/scripts/483891/Profile%20Showcase%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/483891/Profile%20Showcase%20Tools.meta.js
// ==/UserScript==

// Init
(() => {
  "use strict";

  function getAvilebleShowcases() {
    const select = document.querySelector("select[name='profile_showcase[]']");
    const options = select.querySelectorAll("option");
    const pointShowcases = [];

    for (let opt of options) {
      if (!opt.disabled && !opt.selected) {
        const purchaseId = opt.getAttribute("data-purchaseid");
        if (parseInt(purchaseId) > 0) {
          pointShowcases.push(purchaseId);
        }
      }
    }

    console.log(pointShowcases.length);
    return pointShowcases;
 }

  function addReplaceButton() {
    const bars = document.querySelectorAll("div.profile_showcase_selection_options_ctn");
    for (let bar of bars) {
      const select = bar.querySelector("select");
      const btn = document.createElement("button");
      const slot = select.getAttribute("data-slot");
      btn.className = "st_btn";
      btn.textContent = "Replace Showcase";
      btn.addEventListener("click", () => { doReplace(slot) });
      bar.appendChild(btn);
    }
  }

  function doReplace(slot) {
    const avilableIds = getAvilebleShowcases();

    if (avilableIds.length === 0) {
      ShowAlertDialog("Not Enough Showcases");
      return;
    }

    const div = document.createElement("div");
    const select = document.createElement("select");
    select.className = "gray_bevel";
    Object.entries({
      "Steam Year In Review": 24,
      "Completionist": 23,
      "Featured Artwork": 22,
      "Awards Showcase": 21,
      "SAliens": 20,
      "Achievement": 17,
      "My Guides": 16,
      "Favorite Guide": 15,
      "Video": 14,
      "Artwork": 13,
      "My Workshop": 12,
      "Workshop": 11,
      "Review": 10,
      "Favorite Group": 9,
      "Custom Info": 8,
      "Screenshot": 7,
      "Favorite Game": 6,
      "Badge Collector": 5,
      "Items for Trade": 4,
      "Item": 3,
      "Game Collector": 2,
      "Rarest Achievement": 1
    }).reverse().map(([k, v]) => {
      const option = document.createElement("option");
      option.value = v;
      option.textContent = k;
      option.title = k;
      select.appendChild(option);
    });
    div.appendChild(select);

    const dialog = ShowDialog("Which kind of showcase should be replaced?", div);

    const button = document.createElement("button");
    button.textContent = "Apply (Refresh Page for it to take effect)";
    button.addEventListener("click", () => {
      const pid = avilableIds[0];
      const rs = document.getElementById(`showcase_${slot}_select`);
      rs.value = select.value;

      const allOpts = document.querySelectorAll(`option[data-purchaseid='${pid}']`);
      for (let opt of allOpts) {
        opt.textContent = "The showcase will change after saving and refreshing";
        opt.disabled = true;
      }
      const op = rs.querySelector(`option[data-purchaseid='${pid}']`);
      op.value = select.value;
      op.selected = true;
      op.disabled = false;
      document.getElementById(`showcase_${slot}_purchaseid`).value = pid;
      console.log(pid, select.value);
      dialog.Dismiss();
    });
    div.appendChild(button);
  }
  addReplaceButton();
})();