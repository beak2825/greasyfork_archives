// ==UserScript==
// @name        osu: clickable points of failure chart
// @description Clicking on the "points of failure" chart will open the editor to that location.
// @match       https://osu.ppy.sh/*
//
// @author      quat
// @namespace   https://highlysuspect.agency/
// @version     1.1
// @license     CC0
//
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/476931/osu%3A%20clickable%20points%20of%20failure%20chart.user.js
// @updateURL https://update.greasyfork.org/scripts/476931/osu%3A%20clickable%20points%20of%20failure%20chart.meta.js
// ==/UserScript==

!function() {
  window.addEventListener("click", e => {
    //have we clicked on a chart?
    let chartElem = document.querySelector(".beatmap-success-rate__chart");
    if(!chartElem.contains(e.target)) return;

    //how far along the chart did we click?
    let chartRect = chartElem.getBoundingClientRect();
    let percent = (e.clientX - chartRect.x) / (chartRect.width);

    //(rounded to the middle of each bar of the chart)
    let barCount = chartElem.querySelectorAll(".stacked-bar-chart__col").length;
    percent = (0.5 + Math.round(percent * barCount)) / barCount;

    //what mapset is this, and what diff are we looking at
    let mapsetData = JSON.parse(document.getElementById("json-beatmapset").textContent);
    let mapId = window.location.hash.split("/")[1];
    let mapData = mapsetData.beatmaps.find(map => map.id = mapId);

    //compute mm:ss:SSS format timestamp corresponding to click location
    let totalSeconds = mapData.total_length * percent;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds) - minutes * 60;
    let milliseconds = Math.floor(totalSeconds) - seconds;

    //create and click link
    let pad = (n, digits) => n.toLocaleString("en-US", { minimumIntegerDigits: digits, useGrouping: false});
    let href = `osu://edit/${pad(minutes, 2)}:${pad(seconds, 2)}:${pad(milliseconds, 3)}`;

    let a = document.createElement("a");
    a.href = href;
    a.click();
    a.remove();
  }, {
    passive: true
  });

  //inject a stylesheet in a way where turbolinks won't eat it
  window.addEventListener("turbolinks:load", e => {
    let id = "clickable-failchart-injected-style";

    let existingStyle = document.getElementById(id);
    if(!existingStyle) {
      let style = document.createElement("style");
      style.id = "clickable-failchart-injected-style";
      style.innerHTML = `
      .beatmap-success-rate__chart:hover {
        cursor: pointer;
      }

      .beatmap-success-rate__chart .stacked-bar-chart__col:hover {
        background-color: hsl(var(--hsl-red-3));
      }
      `;
      document.head.appendChild(style);
    }
  });
}();