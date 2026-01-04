// ==UserScript==
// @name         RRDailyProfit
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Shows Russian Roulette total profit of the current UTC day.
// @author       bot_7420 [2937420]
// @match        https://www.torn.com/page.php?sid=russianRoulette*
// @run-at       document-start
// @grant        GM.xmlHttpRequest
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/488507/RRDailyProfit.user.js
// @updateURL https://update.greasyfork.org/scripts/488507/RRDailyProfit.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const API_KEY = "123456789abcdefg"; // Input you Full Access API key here.
  let $controlBtn = null;

  window.onload = function () {
    initControlButton();
  };

  function initControlButton() {
    const $title = $("div.linksContainer___LiOTN");
    if ($title.length === 0) {
      console.log("RRDailyProfit: nowhere to put control panel button");
    }
    $controlBtn = $(`<a class="linkContainer___X16y4 inRow___VfDnd greyLineV___up8VP link-container-LastRolls" style="font-weight:Bold;">RRDailyProfit</a>`);

    const record = localStorage.getItem("Script_RRDailyProfit_record");
    const recordTimestamp = localStorage.getItem("Script_RRDailyProfit_recordTimestamp");
    if (recordTimestamp && Date.now() - recordTimestamp < 60000 && record) {
      console.log("RRDailyProfit: display record");
      setControlButtonText(Number(record));
    } else {
      getDailyProfit();
    }

    $title.prepend($controlBtn);

    $controlBtn.click(function () {
      console.log("RRDailyProfit: click");
      getDailyProfit();
    });
  }

  async function getDailyProfit() {
    console.log("RRDailyProfit: getDailyProfit");
    $controlBtn.text("Checking...");
    $controlBtn.css("color", "grey");

    const now = new Date();
    const startOfDay = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const startOfDayTimestamp = startOfDay / 1000;

    const winLogs = await fetchRRWinLogs(startOfDayTimestamp);
    const loseLogs = await fetchRRLoseLogs(startOfDayTimestamp);
    if (!winLogs || !winLogs.log || !loseLogs || !loseLogs.log) {
      $controlBtn.text("Error");
      $controlBtn.css("color", "grey");
      return;
    }

    let winTotal = 0;
    let loseTotal = 0;
    for (const l of Object.values(winLogs.log)) {
      winTotal += l.data.pot / 2;
    }
    for (const l of Object.values(loseLogs.log)) {
      loseTotal += l.data.pot / 2;
    }
    const total = winTotal - loseTotal;
    console.log("RRDailyProfit: " + winTotal + " " + loseTotal + " " + total);

    localStorage.setItem("Script_RRDailyProfit_record", total);
    localStorage.setItem("Script_RRDailyProfit_recordTimestamp", Date.now());

    setControlButtonText(total);
  }

  function fetchRRWinLogs(fromTimestamp) {
    return new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        url: `https://api.torn.com/user/?selections=log&log=8395&from=${fromTimestamp}&key=${API_KEY}`,
        method: "POST",
        synchronous: true,
        onload: async (response) => {
          if (response.status == 200) {
            const body = JSON.parse(response.responseText);
            resolve(body);
          } else {
            console.error("RRDailyProfit: fetchRRWinLogs onload with HTTP status " + response.status);
            resolve(null);
          }
        },
        onabort: () => {
          console.error("RRDailyProfit: fetchRRWinLogs onabort");
          resolve(null);
        },
        onerror: () => {
          console.error("RRDailyProfit: fetchRRWinLogs onerror");
          resolve(null);
        },
        ontimeout: () => {
          console.error("RRDailyProfit: fetchRRWinLogs ontimeout");
          resolve(null);
        },
      });
    });
  }

  function fetchRRLoseLogs(fromTimestamp) {
    return new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        url: `https://api.torn.com/user/?selections=log&log=8396&from=${fromTimestamp}&key=${API_KEY}`,
        method: "POST",
        synchronous: true,
        onload: async (response) => {
          if (response.status == 200) {
            const body = JSON.parse(response.responseText);
            resolve(body);
          } else {
            console.error("RRDailyProfit: fetchRRLoseLogs onload with HTTP status " + response.status);
            resolve(null);
          }
        },
        onabort: () => {
          console.error("RRDailyProfit: fetchRRLoseLogs onabort");
          resolve(null);
        },
        onerror: () => {
          console.error("RRDailyProfit: fetchRRLoseLogs onerror");
          resolve(null);
        },
        ontimeout: () => {
          console.error("RRDailyProfit: fetchRRLoseLogs ontimeout");
          resolve(null);
        },
      });
    });
  }

  function setControlButtonText(totalProfit) {
    $controlBtn.text("Today: " + (totalProfit <= 0 ? "" : "+") + totalProfit.toLocaleString());

    if (totalProfit > 0) {
      $controlBtn.css("color", "green");
    } else if (totalProfit < 0) {
      $controlBtn.css("color", "red");
    } else {
      $controlBtn.css("color", "black");
    }
  }
})();
