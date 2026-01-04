// ==UserScript==
// @name         RW Reward Value Calculator
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Show value of RW rewards.
// @author       bot_7420 [2937420]
// @match        https://www.torn.com/war.php?step=rankreport*
// @run-at       document-start
// @grant        GM.xmlHttpRequest
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/526881/RW%20Reward%20Value%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/526881/RW%20Reward%20Value%20Calculator.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let API_KEY = "6Ue69hVAQqYN4odY";  // Insert your API key here.

  let marketValueMap = new Map();
  let pointMarketValue = 0;

  const checkRows = async () => {
    const selectedElements = document.querySelectorAll("div.memberBonusRow___XJqsX");
    if (selectedElements.length == 2) {
      console.log("RWAwardValue: found rows");
      clearInterval(timer);
      await valueRow(selectedElements[0]);
      await valueRow(selectedElements[1]);
    }
  };
  let timer = setInterval(checkRows, 200);

  async function valueRow(row) {
    let startingIndex = row.innerText.indexOf("bonus respect, ") + 15;
    let awardsString = row.innerText.substring(startingIndex, row.innerText.length);
    console.log("RWAwardValue: " + awardsString);

    let rowTotalValue = 0;
    const backgroundColor = document.body.classList.contains("dark-mode") ? "#002800" : "#b5e7a0";
    let appendInnerHTML = `<div style="background-color: ${backgroundColor};">`;

    for (const item of awardsString.split(", ")) {
      if (item.includes("points")) {
        const pointValue = await valuePoint();
        const numOfPoints = parseInt(item.substring(0, item.indexOf(" ")).replace(",", ""));
        rowTotalValue += pointValue * numOfPoints;
        const resultString = item + "(" + numberFormatter(pointValue) + ")<br>";
        appendInnerHTML += resultString;
      } else if (item.includes("Armor Cache")) {
        const cacheValue = await valueCache(1118);
        rowTotalValue += cacheValue * parseInt(item.substring(0, item.indexOf("x")));
        const resultString = item + "(" + numberFormatter(cacheValue) + ")<br>";
        appendInnerHTML += resultString;
      } else if (item.includes("Melee Cache")) {
        const cacheValue = await valueCache(1119);
        rowTotalValue += cacheValue * parseInt(item.substring(0, item.indexOf("x")));
        const resultString = item + "(" + numberFormatter(cacheValue) + ")<br>";
        appendInnerHTML += resultString;
      } else if (item.includes("Small Arms Cache")) {
        const cacheValue = await valueCache(1120);
        rowTotalValue += cacheValue * parseInt(item.substring(0, item.indexOf("x")));
        const resultString = item + "(" + numberFormatter(cacheValue) + ")<br>";
        appendInnerHTML += resultString;
      } else if (item.includes("Medium Arms Cache")) {
        const cacheValue = await valueCache(1121);
        rowTotalValue += cacheValue * parseInt(item.substring(0, item.indexOf("x")));
        const resultString = item + "(" + numberFormatter(cacheValue) + ")<br>";
        appendInnerHTML += resultString;
      } else if (item.includes("Heavy Arms Cache")) {
        const cacheValue = await valueCache(1122);
        rowTotalValue += cacheValue * parseInt(item.substring(0, item.indexOf("x")));
        const resultString = item + "(" + numberFormatter(cacheValue) + ")<br>";
        appendInnerHTML += resultString;
      }
    }

    appendInnerHTML += "Total value: " + numberFormatter(rowTotalValue, 2);
    appendInnerHTML += `</div>`;
    row.innerHTML += appendInnerHTML;
  }

  function valueCache(itemId) {
    if (marketValueMap.has(itemId)) {
      return marketValueMap.get(itemId);
    }

    return new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        url: `https://api.torn.com/torn/${itemId}?selections=items&key=${API_KEY}`,
        method: "POST",
        synchronous: true,
        onload: (response) => {
          if (response.status == 200) {
            const body = JSON.parse(response.responseText);
            const marketValue = body.items[itemId].market_value;
            marketValueMap.set(itemId, marketValue);
            resolve(marketValue);
          } else {
            console.error("RWAwardValue: valueCache API fetch onload with HTTP status " + response.status);
            resolve(0);
          }
        },
        onabort: () => {
          console.error("RWAwardValue: valueCache API fetch onabort");
          resolve(0);
        },
        onerror: () => {
          console.error("RWAwardValue: valueCache API fetch onerror");
          resolve(0);
        },
        ontimeout: () => {
          console.error("RWAwardValue: valueCache API fetch ontimeout");
          resolve(0);
        },
      });
    });
  }

  function valuePoint() {
    if (pointMarketValue > 0) {
      return pointMarketValue;
    }

    return new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        url: `https://api.torn.com/market/?selections=pointsmarket&key=${API_KEY}`,
        method: "POST",
        synchronous: true,
        onload: (response) => {
          if (response.status == 200) {
            const body = JSON.parse(response.responseText);
            pointMarketValue = body.pointsmarket[Object.keys(body.pointsmarket)[1]].cost;
            resolve(pointMarketValue);
          } else {
            console.error("RWAwardValue: valuePoint API fetch onload with HTTP status " + response.status);
            resolve(0);
          }
        },
        onabort: () => {
          console.error("RWAwardValue: valuePoint API fetch onabort");
          resolve(0);
        },
        onerror: () => {
          console.error("RWAwardValue: valuePoint API fetch onerror");
          resolve(0);
        },
        ontimeout: () => {
          console.error("RWAwardValue: valuePoint API fetch ontimeout");
          resolve(0);
        },
      });
    });
  }

  function numberFormatter(num, digits = 1) {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "B" },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup
      .slice()
      .reverse()
      .find(function (item) {
        return num >= item.value;
      });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
  }
})();
