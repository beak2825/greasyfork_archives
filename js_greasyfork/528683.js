// ==UserScript==
// @name         unity-faction
// @namespace    unity-faction.zero.nao
// @version      0.1
// @description  faction data interface in torn for unity
// @author       nao [2669774]
// @match        https://www.torn.com/profiles.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_xmlhttpRequest
// @connect      docs.google.com

// @downloadURL https://update.greasyfork.org/scripts/528683/unity-faction.user.js
// @updateURL https://update.greasyfork.org/scripts/528683/unity-faction.meta.js
// ==/UserScript==

let api = localStorage.getItem("api_full");
let rfc = getRFC();

let factionData = {};

function getRFC() {
  var rfc = $.cookie("rfc_v");
  if (!rfc) {
    var cookies = document.cookie.split("; ");
    for (var i in cookies) {
      var cookie = cookies[i].split("=");
      if (cookie[0] == "rfc_v") {
        return cookie[1];
      }
    }
  }
  return rfc;
}

// https://docs.google.com/spreadsheets/d/191fVfbLNVWClxMorMSmmwYgixRSLQXFAZ70Joh4XvWY/edit?gid=494942296#gid=494942296
const sheetId = "191fVfbLNVWClxMorMSmmwYgixRSLQXFAZ70Joh4XvWY";
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheetName = "Activity Report";
const query = encodeURIComponent("Select *");
const url = `${base}&sheet=${sheetName}&tq=${query}`;

async function getData() {
  return new Promise((resolve, reject) => {
    GM.xmlHttpRequest({
      method: "GET",
      url: url,
      onload: function (response) {
        try {
          var rep = response.responseText;
          var jdata = JSON.parse(rep.substr(47).slice(0, -2));

          console.log(jdata);

          var sheetData = parseFactionData(jdata);
          console.log(sheetData);
          resolve(sheetData);
        } catch (error) {
          reject(error);
        }
      },
      onerror: function (error) {
        reject(error);
      },
    });
  });
}

function parseFactionData(data) {
  let sheetData = {};

  let columnTitles = data.table.cols.map((col) => col.label || col.id);

  data.table.rows.forEach((row) => {
    let playerNameCell = row.c[1]; // Column B: "Members Name"
    if (playerNameCell && playerNameCell.v) {
      let playerName = playerNameCell.v;
      let rowData = [];

      for (let col = 0; col < row.c.length; col++) {
        let cell = row.c[col];
        let cellValue = cell && cell.v;
        rowData.push(cellValue);
      }

      sheetData[playerName] = rowData;
    }
  });

  return sheetData;
}

async function main() {
  const data = await getData();
  factionData = data;
  console.log(data);
  if (window.location.href.includes("profiles.php")) {
    insertProfileData(data);
  }
}

let keys = {
  "Xanax 1d": 9,
  "Xanax 7d": 10,
  "Xanax 30d": 11,
  "Xanax Rank": 12,
  "Erefills 1d": 13,
  "Erefills 7d": 14,
  "Erefills 30d": 15,
  "Erefills Rank": 16,
  "Crimes 1d": 17,
  "Crimes 7d": 18,
  "Crimes 30d": 19,
  "Crimes Rank": 20,
  "Gym 1d": 29,
  "Gym 7d": 30,
  "Gym 30d": 31,
  "Gym Rank": 32,
  "Attacks 1d": 33,
  "Attacks 7d": 34,
  "Attacks 30d": 35,
  "Attacks Rank": 36,
  "GymEfficiency 1d": 41,
  "GymEfficiency 7d": 42,
  "GymEfficiency 30d": 43,
  "GymEfficiency Rank": 44,
};

function insertProfileData(data) {
  const userName = document
    .querySelector(
      "ul.info-table:nth-child(2) > li:nth-child(1) > div:nth-child(2) > span:nth-child(1)",
    )
    .innerText.split(" ")[0];

  if (factionData[userName]) {
    let userData = factionData[userName];
    console.log(userData);
    let table = document.createElement("table");
    table.style.borderCollapse = "collapse";
    table.style.width = "100%";
    table.style.marginTop = "10px";
    table.style.border = "1px solid black";
    table.style.color = "white";

    let headerRow = document.createElement("tr");
    headerRow.style.backgroundColor = "#333";
    headerRow.style.color = "white";

    let headerCellStat = document.createElement("th");
    headerCellStat.innerText = "Stat";
    headerCellStat.style.border = "1px solid black";
    headerCellStat.style.padding = "5px";
    headerCellStat.style.color = "white";
    headerRow.appendChild(headerCellStat);

    let headerCell1d = document.createElement("th");
    headerCell1d.innerText = "1 day";
    headerCell1d.style.border = "1px solid black";
    headerCell1d.style.padding = "5px";
    headerCell1d.style.color = "white";
    headerRow.appendChild(headerCell1d);

    let headerCell7d = document.createElement("th");
    headerCell7d.innerText = "7 days";
    headerCell7d.style.border = "1px solid black";
    headerCell7d.style.padding = "5px";
    headerCell7d.style.color = "white";
    headerRow.appendChild(headerCell7d);

    let headerCell30d = document.createElement("th");
    headerCell30d.innerText = "30 days";
    headerCell30d.style.border = "1px solid black";
    headerCell30d.style.padding = "5px";
    headerCell30d.style.color = "white";
    headerRow.appendChild(headerCell30d);

    let headerCellRank = document.createElement("th");
    headerCellRank.innerText = "Rank";
    headerCellRank.style.border = "1px solid black";
    headerCellRank.style.padding = "5px";
    headerCellRank.style.color = "white";
    headerRow.appendChild(headerCellRank);

    table.appendChild(headerRow);

    const stats = [
      "Xanax",
      "Erefills",
      "Crimes",
      "Gym",
      "Attacks",
      "GymEfficiency",
    ];
    const suffices = ["1d", "7d", "30d", "Rank"];

    stats.forEach((stat, index) => {
      let row = document.createElement("tr");
      row.style.backgroundColor = "#333";
      row.style.color = "white";
      let statCell = document.createElement("td");
      statCell.innerText = stat;
      statCell.style.border = "1px solid black";
      statCell.style.padding = "5px";
      statCell.style.color = "white";
      row.appendChild(statCell);
      suffices.forEach((suffix, index) => {
        let valueCell = document.createElement("td");
        const key = stat + " " + suffix;
        const value =
          stat.includes("Efficiency") && suffix !== "Rank"
            ? (userData[keys[key]] * 100).toFixed(2)
            : userData[keys[key]] || "N/A";
        valueCell.innerText = value || "N/A";

        valueCell.style.border = "1px solid black";
        valueCell.style.padding = "5px";
        valueCell.style.color = "white";
        row.appendChild(valueCell);
      });
      table.appendChild(row);
    });

    let container = document.createElement("div");
    container.appendChild(table);
    container.style.marginTop = "20px";

    let insetPoint = document.querySelector(".profile-wrapper");
    insetPoint.appendChild(container);
  }
}
main();
