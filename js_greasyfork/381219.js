// ==UserScript==
// @name         MouseHunt - Wisdom Stats
// @author       Tran Situ (tsitu)
// @namespace    https://greasyfork.org/en/users/232363-tsitu
// @version      1.5
// @description  Displays your wisdom stats in the HUD
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/381219/MouseHunt%20-%20Wisdom%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/381219/MouseHunt%20-%20Wisdom%20Stats.meta.js
// ==/UserScript==

(function() {
  const target = document.querySelector(".mousehuntHud-userStat-row.points");
  if (target) render(true);

  function render(isInit) {
    // Remove existing div
    const existing = document.querySelector(
      ".mousehuntHud-userStat-row.wisdom"
    );
    if (existing) existing.remove();

    // Retrieve and format cached current wisdom value
    let wisdomValue = "N/A";
    const wisdomRaw = localStorage.getItem("tsitu-wisdom-value");
    if (wisdomRaw) {
      wisdomValue = parseInt(wisdomRaw);
      if (this.numberFormat) wisdomValue = numberFormat(wisdomValue);
    }

    // Build HTML
    const wisdomDiv = document.createElement("div");
    wisdomDiv.className = "mousehuntHud-userStat-row wisdom";

    const wisdomA = document.createElement("a");
    wisdomA.addEventListener("click", function() {
      requestWisdom();
    });

    const labelSpan = document.createElement("span");
    labelSpan.className = "label";
    labelSpan.title = "Click to refresh!";
    labelSpan.innerText = "Wisdom";
    wisdomA.appendChild(labelSpan);

    const wisdomSpan = document.createElement("span");
    wisdomSpan.className = "value";
    wisdomSpan.id = "hud_wisdom";
    wisdomSpan.innerText = wisdomValue;

    wisdomDiv.appendChild(wisdomA);
    wisdomDiv.appendChild(wisdomSpan);
    target.insertAdjacentElement("afterend", wisdomDiv);

    // Check for a previous value to calculate difference
    const prevVal =
      parseInt(localStorage.getItem("tsitu-wisdom-previous")) || 0;
    const currVal = parseInt(wisdomRaw);

    const diff = currVal - prevVal;
    if (diff > 0) {
      if (this.blinkText && !isInit) blinkText(wisdomSpan, "#0f0", "#fff");
    }

    let formatDiff = diff;
    let activeDiff = diff > 25 ? diff - 25 : 0;
    let passiveDiff = diff > 15 ? diff - 15 : 0;
    if (this.numberFormat) {
      formatDiff = numberFormat(diff);
      activeDiff = numberFormat(activeDiff);
      passiveDiff = numberFormat(passiveDiff);
    }

    // Grab timestamps for previous and latest fetches
    let tsPrevStr = "N/A";
    const tsPrevRaw = localStorage.getItem("tsitu-wisdom-time-prev");
    if (tsPrevRaw) {
      tsPrevStr = new Date(parseInt(tsPrevRaw)).toLocaleString();
    }

    let tsLatestStr = "N/A";
    const tsLatestRaw = localStorage.getItem("tsitu-wisdom-time-latest");
    if (tsLatestRaw) {
      tsLatestStr = new Date(parseInt(tsLatestRaw)).toLocaleString();
    }

    const output = `· Difference from last value: ${formatDiff}\n· Active Hunt ("I sounded"): ${activeDiff}\n· Friend Hunt / Trap Check: ${passiveDiff}\n\n· Previous fetch: ${tsPrevStr}\n· Latest fetch: ${tsLatestStr}`;
    wisdomSpan.title = output;
    wisdomSpan.addEventListener("click", function() {
      alert(output);
    });
  }

  // Request, parse, and cache latest/previous wisdom values
  function requestWisdom() {
    const xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "https://www.mousehuntgame.com/item.php?item_type=wisdom_stat_item"
    );
    xhr.onload = function() {
      const data = xhr.responseText;
      const parser = new DOMParser();
      const dom = parser.parseFromString(data, "text/html");
      const wisdomItem = dom.querySelector(".itemView-sidebar-quantity");
      if (wisdomItem) {
        const wisdom = wisdomItem.textContent
          .split("Own: ")[1]
          .replace(/,/g, "");
        const oldWisdom = localStorage.getItem("tsitu-wisdom-value");
        const oldTime = localStorage.getItem("tsitu-wisdom-time-latest");
        if (oldWisdom != wisdom) {
          if (oldWisdom) {
            localStorage.setItem("tsitu-wisdom-previous", oldWisdom);
          }
          if (oldTime) {
            localStorage.setItem("tsitu-wisdom-time-prev", oldTime);
          }
          localStorage.setItem("tsitu-wisdom-value", wisdom);
          localStorage.setItem("tsitu-wisdom-time-latest", Date.now());
          render(false);
        }
      }
    };
    xhr.onerror = function() {
      console.error(xhr.statusText);
    };
    xhr.send();
  }
})();
