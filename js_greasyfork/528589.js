// ==UserScript==
// @name         viperZero Travel Tracker
// @namespace    zero.ztravel.torn
// @version      0.3
// @description  Shows travel time from multiple sheets
// @author       nao [2669774]
// @match        https://www.torn.com/profiles.php?XID=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM.xmlHttpRequest
// @connect      docs.google.com
// @downloadURL https://update.greasyfork.org/scripts/528589/viperZero%20Travel%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/528589/viperZero%20Travel%20Tracker.meta.js
// ==/UserScript==
// https://docs.google.com/spreadsheets/d/1KA54SbpvO603ICaoTgdf-MYzaHKxaeiNsyAPaeO4J14/edit?usp=sharing

const sheetId = "1SxUuGfM72vxdVBnMX6u-ukxG1JS5Kt013gYQ4fJFrAQ";
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheets = ["Faction", "Players"];
var data = {};
var locurl = window.location.href;
var curTime = Math.round(Date.now() / 1000);
var travel_data = {};
var location_url = window.location.href;
var playerId = location_url.split("XID=")[1];
var dataFound = false;

const countryTimes = {
  Argentina: 167,
  Canada: 41,
  Islands: 35,
  China: 242,
  Hawaii: 134,
  Japan: 225,
  Mexico: 26,
  Africa: 297,
  Switzerland: 175,
  UAE: 271,
  Kingdom: 159,
};

const flightModifier = {
  standard: 1.0,
  airstrip: 0.7,
  private: 0.5,
  business: 0.3,
};

function checkTravel() {
  if ($(".main-desc").length > 0) {
    if (
      $(".main-desc").text().includes("Returning") ||
      $(".main-desc").text().includes("Traveling")
    ) {
      var desc = $(".main-desc").text().trim().split(" ");
      var destination = desc[desc.length - 1];
      if (countryTimes[destination]) {
        var time_taken =
          flightModifier[typeOfTravel()] * countryTimes[destination];
        console.log("Time Taken: " + time_taken);
        fetchAllSheets(time_taken);
      }
    }
  } else {
    setTimeout(checkTravel, 200);
  }
}

function typeOfTravel() {
  if ($(".profile-status").hasClass("private")) {
    return "private";
  }
  if ($(".profile-status").hasClass("airstrip")) {
    return "airstrip";
  }
  return "business";
}

function main() {
  console.log("viperZero Travel Tracker started");
  checkTravel();
}

function fetchAllSheets(extra_time) {
  // Reset data found flag for new query
  dataFound = false;

  // Create promises for each sheet fetch
  const promises = sheets.map((sheetName) => {
    return new Promise((resolve) => {
      const query = encodeURIComponent("Select *");
      const url = `${base}&sheet=${sheetName}&tq=${query}`;

      GM.xmlHttpRequest({
        method: "GET",
        url: url,
        onload: function (response) {
          const rep = response.responseText;
          try {
            const jdata = JSON.parse(rep.substr(47).slice(0, -2));
            processSheetData(jdata, sheetName, extra_time);
            resolve();
          } catch (e) {
            console.error(`Error parsing data from ${sheetName} sheet:`, e);
            resolve();
          }
        },
        onerror: function (error) {
          console.error(`Error fetching ${sheetName} sheet:`, error);
          resolve();
        },
      });
    });
  });

  // After all sheets are processed, update the display
  Promise.all(promises).then(() => {
    updateDisplay();
  });
}

function processSheetData(jdata, sheetName, extra_time) {
  console.log(`Processing data from ${sheetName} sheet`);

  for (var row = 0; row < jdata.table.rows.length; row++) {
    const rowId = jdata.table.rows[row].c[0]?.v;

    // Skip if no ID or not a match
    if (!rowId) continue;

    // Check if this row contains our player ID
    if (rowId == playerId) {
      console.log(`Found player ${playerId} in ${sheetName} sheet`);

      // If we have a timestamp in column 3
      if (jdata.table.rows[row].c[2]) {
        let colNum = sheetName == "Faction" ? 2 : 3;
        const timestamp = parseInt(jdata.table.rows[row].c[colNum].v);
        var now = new Date((timestamp + extra_time * 60) * 1000);
        var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

        const formattedTime = `${utc.getHours().toString().padStart(2, "0")}:${utc.getMinutes().toString().padStart(2, "0")}:${utc.getSeconds().toString().padStart(2, "0")}`;

        travel_data[playerId] = {
          time: formattedTime,
          source: sheetName,
        };

        dataFound = true;
        console.log(
          `Landing time calculated: ${formattedTime} (from ${sheetName})`,
        );
      }
    }
  }
}

function updateDisplay() {
  console.log("Updating display with player ID:", playerId);

  if (travel_data[playerId]) {
    $(".sub-desc").html(
      `Landing after ${travel_data[playerId].time} (data from ${travel_data[playerId].source})`,
    );
    console.log("Display updated with landing time");
  } else {
    console.log("No travel data found for this player");
  }
}

main();
