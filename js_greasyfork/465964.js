// ==UserScript==
// @name         MH Stats
// @author       Warden Slayer
// @namespace    https://greasyfork.org/en/users/227259-wardenslayer
// @version      1.0.2
// @description  Daily MH stat logger
// @icon         https://www.mousehuntgame.com/images/items/weapons/974151e440f297f1b6d55385310ac63c.jpg?cv=2
// @include      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @include      http://www.mousehuntgame.com/*
// @include      https://www.mousehuntgame.com/*
// @grant        GM_xmlhttpRequest
// @connect      self
// @connect      script.google.com
// @connect      script.googleusercontent.com
//
// @downloadURL https://update.greasyfork.org/scripts/465964/MH%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/465964/MH%20Stats.meta.js
// ==/UserScript==
$(document).ready(function () {
  //yes, very interesting
  localStorage.setItem("ws.mh.stats.results", "");
  loadFunction();
});

function loadFunction() {
  const debug = localStorage.getItem("ws.debug");
  const dateTimeBefore = localStorage.getItem("ws.mh.stats.last.timestamp");
  //const dateTimeBefore = 7;
  const dateTimeNow = new Date().toString().split(" G")[0].split(" ");
  const timestampNow = [dateTimeNow[1], dateTimeNow[2], dateTimeNow[3]].join(
    " "
  );
  console.log(dateTimeBefore, timestampNow);
  if (dateTimeBefore == timestampNow) {
    if (debug == true) {
      console.log("Date has not changed, no stat submission");
    }
    return false;
  } else {
    getStatsNow(timestampNow);
  }
}

function getStatsNow(timestamp) {
  const itemsOfInterest = [
    "num_active_turns",
    "num_passive_turns",
    "num_link_turns",
    "num_total_turns",
    "map_num_clues_found",
    "map_num_maps_dusted",
    "wisdom",
    "gold",
    "points",
    "num_friends",
    "not_actually_a_real_field",
  ];
  //
  let statArray = [];
  hg.utils.User.getUserData(
    [user.sn_user_id],
    itemsOfInterest,
    function (data) {
      const points = data[0].points;
      const gold = data[0].gold;
      const wisdom = data[0].wisdom;
      const mapClues = data[0].map_num_clues_found;
      const mapsDusted = data[0].map_num_maps_dusted;
      const turns = data[0].num_total_turns;
      const friends = data[0].num_friends;
      [points, gold, wisdom, mapClues, mapsDusted, turns, friends].forEach(
        function (arrayItem, i) {
          statArray.push(arrayItem);
        }
      );
      //console.log('UserData',timestamp,statArray)
      localStorage.setItem("ws.mh.stats.results", JSON.stringify(statArray));
      getStatItems(timestamp);
    }
  );
}

//HUD Code
function getStatItems(timestamp) {
  let statArray = JSON.parse(localStorage.getItem("ws.mh.stats.results"));
  const theseItems = [
    "super_brie_cheese",
    "rare_map_dust_stat_item",
    "desert_warpath_victory_stat_item",
  ];
  hg.utils.UserInventory.getItems(
    theseItems,
    function (data) {
      data.forEach(function (arrayItem, i) {
        statArray.push(arrayItem.quantity);
        //console.log('FOR EACH WPV',i,timestamp,statArray)
      });
    },
    true
  );
  setTimeout(function () {
    //console.log('WPV',timestamp,statArray)
    localStorage.setItem("ws.mh.stats.results", JSON.stringify(statArray));
    publishResults(timestamp);
    localStorage.setItem("ws.mh.stats.last.timestamp", timestamp);
  }, 1000);
}

function publishResults(timestamp_label) {
  const debug = localStorage.getItem("ws.debug");
  const webAppURL =
    "https://script.google.com/macros/s/AKfycbwMBvgt2EzZU7ReCDoXM_XR8Z-5jyrhTE0BNRN-H5U3xlM3kbHDaE65Am--xHGtwBYj/exec";
  const resultsArray = localStorage.getItem("ws.mh.stats.results");
  //console.log('pub',timestamp_label,resultsArray)
  if (webAppURL) {
    GM_xmlhttpRequest({
      method: "POST",
      url: webAppURL,
      data: JSON.stringify({ stats: resultsArray, timestamp: timestamp_label }),
      onload: function (response) {
        if (debug == true) {
          console.log("Stats Submitted");
        }
      },
      onerror: function (response) {
        if (debug == true) {
          console.log("No Good, Error");
        }
      },
    });
  } else {
  }
}
