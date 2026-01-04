// ==UserScript==
// @name         Seed Picks
// @namespace    http://tampermonkey.net/
// @version      2024-03-09
// @description  做种精选
// @author       bahtyar
// @match        https://*.tjupt.org/torrents.php*
// @match        https://pt.keepfrds.com/torrents.php*
// @icon         none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488863/Seed%20Picks.user.js
// @updateURL https://update.greasyfork.org/scripts/488863/Seed%20Picks.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var site_url = decodeURI(location.href);
  // console.log(site_url)\

  var siteData = {
    "tjupt": {
      values: {
        "T0": 4,
        "B0": 7,
        "N0": 130,
        "L": 300,
      }, // T0, N0, B0, L
    },
    "keepfrds": {
      values: {
        "T0":52,
        "B0": 7,
        "N0": 100,        
        "L": 900,
      }, // T0, N0, B0, L
    },
  };
  function calculateA(Ti, T0, Si, Ni, N0) {
    const term1 = 1 - Math.pow(10, -Ti / T0);
    const term2 = Si * (1 + Math.sqrt(2) * Math.pow(10, -(Ni - 1) / (N0 - 1)));
    return term1 * term2;
  }

  function calculateB(A, L, B0) {
    const pi = Math.PI;
    const arctanValue = Math.atan(A / L);
    const result = ((B0 * 2) / pi) * arctanValue;
    return result;
  }

  function addColumnToTable() {
    if (site_url.includes("tjupt.org")) {
      addtjuptColumns();
    } else if (site_url.includes("keepfrds.com")) {
      addkeepfrdsColumns();
    }
  }

  function calculateTimeDifference(timeString) {
    const currentTime = new Date();
    const uploadTime = new Date(timeString.replace("<br>", " "));
    const timeDifferenceInMilliseconds = currentTime - uploadTime;
    return timeDifferenceInMilliseconds / (1000 * 60 * 60 * 7 * 24); // 转换为周
  }

  function convertToGB(inputString) {
    if (site_url.includes("tjupt.org")) {
      return tjuptConvertToGB(inputString);
    } else if (site_url.includes("keepfrds.com")) {
      return keepfrdsConvertToGB(inputString);
    }
  }

  function addtjuptColumns() {
    const table0 = document.getElementsByClassName("torrents")[0];
    if (!table0) {
      console.error('Table with class "torrents" not found.');
      return;
    }
    const table = table0.tBodies[0];
    const rows = table.children;
    const valueA = document.createElement("td");
    valueA.textContent = "A值";
    valueA.className = "colhead";
    rows[0].appendChild(valueA);
    const point = document.createElement("td");
    point.textContent = "时魔";
    point.className = "colhead";
    rows[0].appendChild(point);
    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].children;
      const tr = cells[i];
      // 获取时间差（单位：小时）、体积（单位：GB）、#seeders
      const timeString = cells[3].innerHTML;
      const timeDifference = calculateTimeDifference(timeString); // 计算时间差
      const volume = parseFloat(convertToGB(cells[4].textContent.trim()));
      const seeders = parseFloat(cells[5].textContent.trim());
      // console.log(timeString, timeDifference, volume, seeders)
      const resultA = calculateA(timeDifference, 4, volume, seeders, 7);
      // console.log(resultA)
      const result = calculateB(resultA, 300, 130);
      const resultACell = document.createElement("td");
      resultACell.textContent = resultA.toFixed(2);
      rows[i].appendChild(resultACell);
      const resultCell = document.createElement("td");
      resultCell.textContent = result.toFixed(2); // 保留两位小数
      rows[i].appendChild(resultCell);
    }
  }

  function addkeepfrdsColumns() {
    const table0 = document.getElementsByClassName("torrents")[0];
    if (!table0) {
      console.error('Table with class "torrents" not found.');
      return;
    }
    const table = table0.tBodies[0];
    // console.log(table);
    const rows = table.children;
    const valueA = document.createElement("td");
    valueA.textContent = "A值";
    valueA.className = "colhead";
    rows[0].appendChild(valueA);
    const point = document.createElement("td");
    point.textContent = "时魔";
    point.className = "colhead";
    rows[0].appendChild(point);
    console.log("rows")
    // console.log(rows[1]);
    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].children;
      console.log(cells);
      const tr = cells[i];
      // 获取时间差（单位：小时）、体积（单位：GB）、#seeders
      const timeString = cells[3].querySelector('span[title]').getAttribute('title');
      console.log(timeString);
      const timeDifference = calculateTimeDifference(timeString); // 计算时间差
      const volume = parseFloat(convertToGB(cells[4].textContent.trim()));
      const seeders = parseFloat(cells[5].textContent.trim());
      // console.log(timeString, timeDifference, volume, seeders)
      let T0 = siteData["keepfrds"]["values"]["T0"];
      let N0 = siteData["keepfrds"]["values"]["N0"];
      let B0 = siteData["keepfrds"]["values"]["B0"];
      let L = siteData["keepfrds"]["values"]["L"];
      const resultA = calculateA(timeDifference, T0, volume, seeders, N0);
      // console.log(resultA)
      const result = calculateB(resultA, L, B0);
      const resultACell = document.createElement("td");
      resultACell.textContent = resultA.toFixed(2);
      rows[i].appendChild(resultACell);
      const resultCell = document.createElement("td");
      resultCell.textContent = result.toFixed(2); // 保留两位小数
      rows[i].appendChild(resultCell);
    }
  }

  function tjuptConvertToGB(inputString) {
    const regex = /(\d+(\.\d+)?)\s*([KkMmGgTt]?i?[Bb])/;
    const match = inputString.match(regex);

    if (match) {
      const value = parseFloat(match[1]);
      const unit = match[3].toUpperCase();

      switch (unit) {
        case "KIB":
          return value / (1024 * 1024);
        case "MIB":
          return value / 1024;
        case "GIB":
          return value;
        case "TIB":
          return value * 1024;
        default:
          console.error("Unsupported unit:", unit);
          return NaN;
      }
    } else {
      console.error("Invalid input string:", inputString);
      return NaN;
    }
  }

  function keepfrdsConvertToGB(inputString) {
    const regex = /(\d+(\.\d+)?)\s*([KkMmGgTt]?[Bb])/;
    const match = inputString.match(regex);
    if (match) {
      const value = parseFloat(match[1]);
      const unit = match[3].toUpperCase();

      switch (unit) {
        case "KB":
          return value / (1024 * 1024);
        case "MB":
          return value / 1024;
        case "GB":
          return value;
        case "TB":
          return value * 1024;
        default:
          console.error("Unsupported unit:", unit);
          return NaN;
      }
    }
  }

  window.addEventListener("load", addColumnToTable);
})();
