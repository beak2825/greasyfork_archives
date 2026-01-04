// ==UserScript==
// @name         Time Spent on Youtube
// @version      2022.08.30.07.46
// @description  A simple timer that shows how much time you spent on Youtube today.
// @license      MIT
// @author       Marco Dalla Gatta
// @namespace    https://github.com/marcodallagatta/userscripts/raw/main/youtube-time-spent/
// @match        https://www.youtube.com/*
// @icon         https://icons.duckduckgo.com/ip2/youtube.com.ico
// @downloadURL https://update.greasyfork.org/scripts/447817/Time%20Spent%20on%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/447817/Time%20Spent%20on%20Youtube.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const background = false; // 'true' also counts when YT is in a background tab, 'false' only counts active tab
  const showInTitle = true; // 'true' prepend the minutes before the title in the tab
  const originalTitle = document.title;
  const resetTime = 4; // time when the timer resets, 24h time (0 = midnight, 4 = 4AM, 15 = 3PM)

  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  const todayYYMMDD = yyyy + mm + dd;
  const hours = today.getHours();

  let spent = 0;
  
  if (localStorage.getItem("date") !== todayYYMMDD && hours >= resetTime) {
    localStorage.setItem("date", todayYYMMDD);
    localStorage.setItem("spent", 0);
  } else {
    spent = parseFloat(localStorage.getItem("spent"));
  }

  const inDOM = document.getElementById("start");
  let elem = document.createElement("span");
  elem.style = "color:white;font-size:2rem";
  inDOM.appendChild(elem);
  
  function showAlert(time) {
    const mm = (Math.trunc(time) % 60).toString();
    if (time > 60) {
      const hh = Math.trunc(time / 60).toString();
      elem.innerText = `${hh}h ${mm}m`;
      if (showInTitle) document.title = `${hh}h${mm.padStart(2, "0")}m ${originalTitle}`;
    } else {
      elem.innerText = `${mm}m`;
      if (showInTitle) document.title = `${mm.padStart(2, "0")}m ${originalTitle}`;
    }
  }

  setInterval(function () {
    if (background || document.hasFocus()) {
      spent = parseFloat(localStorage.getItem("spent")) + 0.25;
      localStorage.setItem("spent", spent);
      showAlert(spent);
    }
  }, 15000); // 15s

  // triggers after a few seconds since by default YT overwrites titlebar after a while on load \_(ツ)_/
  setTimeout(function () { showAlert(spent) }, 2000);

})();
