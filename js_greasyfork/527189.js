// ==UserScript==
// @name         Zed City Mobile Timers & Junk Store Tools
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Displays timers and Junk Store buy-limit info for Zed City on mobile. Alerts removed.
// @match        https://www.zed.city/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527189/Zed%20City%20Mobile%20Timers%20%20Junk%20Store%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/527189/Zed%20City%20Mobile%20Timers%20%20Junk%20Store%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // A simple function to format seconds into H:MM:SS (or days if long)
    function timeReadable(sec) {
        if (sec >= 86400) return `${(sec / 86400).toFixed(1)} Days`;
        const d = new Date(sec * 1000);
        const pad = n => ("0" + n).slice(-2);
        let hours = d.getUTCHours() ? d.getUTCHours() + ":" : "";
        return hours + pad(d.getUTCMinutes()) + ":" + pad(d.getUTCSeconds());
    }

    // Example: Energy Timer Display
    function updateEnergyTimer() {
        let timerElem = document.getElementById("energyTimer");
        if (!timerElem) {
            timerElem = document.createElement("div");
            timerElem.id = "energyTimer";
            timerElem.style.position = "fixed";
            timerElem.style.bottom = "10px";
            timerElem.style.left = "10px";
            timerElem.style.backgroundColor = "rgba(0,0,0,0.5)";
            timerElem.style.color = "white";
            timerElem.style.padding = "5px 10px";
            timerElem.style.borderRadius = "5px";
            document.body.appendChild(timerElem);
        }
        const energyFullAt = Number(localStorage.getItem("script_energyFullAtTimestamp")) || Date.now();
        const timeLeft = Math.floor((energyFullAt - Date.now()) / 1000);
        timerElem.textContent = timeLeft > 0 ? `Energy: ${timeReadable(timeLeft)}` : "Energy: FULL";
    }
    setInterval(updateEnergyTimer, 500);

    // Junk Store Buy Limit Display
    function addBuyLimitInfo() {
        if (!window.location.href.includes("/store/junk")) return;
        const rowContainer = document.querySelector(".title > div.row.q-col-gutter-xs.q-px-xs");
        if (!rowContainer) return;
        const allCols = rowContainer.querySelectorAll(".col");
        const targetCol = allCols[1]; // adjust index if needed
        if (!targetCol) return;
        let infoElem = document.getElementById("script_buyLimitInfo");
        if (!infoElem) {
            infoElem = document.createElement("div");
            infoElem.id = "script_buyLimitInfo";
            infoElem.style.textAlign = "center";
            infoElem.style.color = "white";
            infoElem.style.fontSize = "12px";
            infoElem.style.marginRight = "130px";
            targetCol.appendChild(infoElem);
        }
        const limitLeft = Number(localStorage.getItem("script_junkStore_limit_left")) || 0;
        const totalLimit = 360;
        let used = totalLimit - limitLeft;
        if (used < 0) used = 0;
        const storeResetTimestamp = Number(localStorage.getItem("script_junkStoreResetTimestamp"));
        const storeTimeLeftSec = Math.floor((storeResetTimestamp - Date.now()) / 1000);
        const storeTimeText = storeTimeLeftSec > 0 ? timeReadable(storeTimeLeftSec) : "Refreshed";
        if (limitLeft > 0) {
            infoElem.innerHTML = `Buy Limit: ${used}/${totalLimit} (Resets in ${storeTimeText})`;
        } else {
            infoElem.innerHTML = `<span style="color:red;">BUY LIMIT REACHED</span> — Next reset in ${storeTimeText}`;
        }
    }
    setInterval(addBuyLimitInfo, 500);

    // Additional timer or junk store features can be added here

function addMaxBuySellButton() {
  const modal = document.querySelector(".small-modal");
  if (!modal) return;
  if (modal.querySelector(".script-store-btn")) return;
  const input = modal.querySelector("input");
  if (!input) return;
  const allButtons = modal.querySelectorAll("button");
  let buySellButton = null;
  for (const btn of allButtons) {
    const txt = btn.textContent.trim().toLowerCase();
    if (txt === "buy" || txt === "sell") {
      buySellButton = btn;
      break;
    }
  }
  if (!buySellButton) return;
  const isBuyPopup = buySellButton.textContent.trim().toLowerCase() === "buy";
  const isSellPopup = buySellButton.textContent.trim().toLowerCase() === "sell";
  const isJunkStore = window.location.href.includes("/store/junk");
  const itemImgSrc = modal.querySelector(".zed-item-img__content img")?.src || "";
  const itemMapping = {
    "iron_bar": "script_junkStore_ironBarStock",
    "logs": "script_junkStore_logsStock",
    "scrap": "script_junkStore_scrapStock",
    "nails": "script_junkStore_nailsStock"
  };
  const matchedKey = Object.keys(itemMapping).find(key => itemImgSrc.includes(key));
  const storageKey = matchedKey ? itemMapping[matchedKey] : null;
  const isBuyableItem = Boolean(storageKey);

  if (isBuyPopup) {
    if (isJunkStore && isBuyableItem) {
      const stock = Number(localStorage.getItem(storageKey)) || 0;
      const limitLeft = Number(localStorage.getItem("script_junkStore_limit_left")) || 0;
      let buyNum = Math.min(stock, limitLeft);
      if (buyNum < 0) buyNum = 0;
      const buyLimitBtn = document.createElement("button");
      buyLimitBtn.className = "script-store-btn";
      buyLimitBtn.style.cssText = `
        position: absolute;
        bottom: 10px;
        right: 10px;
        z-index: 1000;
        pointer-events: auto;
        white-space: pre;
      `;
      buyLimitBtn.textContent = buyNum.toString();
      buyLimitBtn.addEventListener("click", () => {
        input.value = buyNum;
        const event = new Event("input", { bubbles: true });
        input.dispatchEvent(event);
      });
      modal.style.position = "relative";
      modal.appendChild(buyLimitBtn);
    }
  } else if (isSellPopup) {
    const maxBtn = document.createElement("button");
    maxBtn.className = "script-store-btn";
    maxBtn.textContent = "Max";
    maxBtn.style.cssText = `
      position: absolute;
      bottom: 10px;
      right: 10px;
      z-index: 1000;
      pointer-events: auto;
    `;
    maxBtn.addEventListener("click", () => {
      input.value = 999999;
      const event = new Event("input", { bubbles: true });
      input.dispatchEvent(event);
    });
    modal.style.position = "relative";
    modal.appendChild(maxBtn);
  }
}
setInterval(addMaxBuySellButton, 500);

})();