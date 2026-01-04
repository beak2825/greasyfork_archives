// ==UserScript==
// @name        OSRS Wiki Auto Dark Mode
// @description Automatic Dark Mode switcher for Old School Runescape Wiki
// @version     1.1
// @author      pirssi
// @namespace   https://pirss.in
// @match       *://oldschool.runescape.wiki/*
// @grant       none
// @license     MIT
// @homepageURL https://github.com/pirssi/osrswiki-auto-dark/
// @supportURL  https://github.com/pirssi/osrswiki-auto-dark/
// @downloadURL https://update.greasyfork.org/scripts/496788/OSRS%20Wiki%20Auto%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/496788/OSRS%20Wiki%20Auto%20Dark%20Mode.meta.js
// ==/UserScript==

// BROWNTOWN THEME
// whether to use new "Browntown" theme instead of the normal blueish Dark theme
const USE_BROWNTOWN = false;

// CUSTOM TIME FRAME
// whether to use custom time frame in which to follow the user's system theme prefence
// true = use a custom time frame (set below)
// false = always follow system theme preference
const USE_TIMEFRAME = false;

// set the time here, 24-hour time format with no leading zeroes. ignored if USE_TIMEFRAME is set to false.
// (e.g. enable following theme prefence when system clock is 07:01 pm: START_HOUR = 19 & START_MINUTES = 1)
const START_HOUR = 19;
const START_MINUTES = 0;
const END_HOUR = 7;
const END_MINUTES = 0;

// ---

// function to check if current time is between the start time and the end time when USE_TIMEFRAME is set to true
function checkTime() {
  if (!USE_TIMEFRAME) {
    return true;
  } else {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 60 + minutes; // current time (minutes since midnight)
    const startTime = START_HOUR * 60 + START_MINUTES;
    const endTime = END_HOUR * 60 + END_MINUTES;
    return (
      (startTime < endTime && startTime < currentTime && currentTime < endTime) ||
      (startTime > endTime && startTime < currentTime && currentTime > endTime) ||
      (startTime > endTime && startTime > currentTime && currentTime < endTime)
    );
  }
}

// function to set theme based on system preference and time
function setTheme() {
  if (window.matchMedia) {
    const systemIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const useDarkMode = systemIsDark && checkTime();
    if (useDarkMode && USE_BROWNTOWN) {
      // brown
      document.body.classList.remove("wgl-lightmode");
      document.body.classList.remove("wgl-theme-light");
      document.body.classList.remove("wgl-darkmode");
      document.body.classList.remove("wgl-theme-dark");
      document.body.classList.add("wgl-theme-browntown");
    } else if (useDarkMode && !USE_BROWNTOWN) {
      // dark
      document.body.classList.remove("wgl-lightmode");
      document.body.classList.remove("wgl-theme-light");
      document.body.classList.remove("wgl-theme-browntown");
      document.body.classList.add("wgl-darkmode");
      document.body.classList.add("wgl-theme-dark");
    } else {
      // light
      document.body.classList.remove("wgl-darkmode");
      document.body.classList.remove("wgl-theme-dark");
      document.body.classList.remove("wgl-theme-browntown");
      document.body.classList.add("wgl-lightmode");
      document.body.classList.add("wgl-theme-light");
    }
  }
}

// set initial theme on load
setTheme();

// update theme once a minute
setInterval(setTheme, 60000);

// add listener for system theme changes
if (window.matchMedia) {
  const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  darkModeQuery.addEventListener("change", setTheme);
}

// update when the page becomes visible again
document.addEventListener("visibilitychange", function () {
  if (!document.hidden) {
    setTheme();
  }
});
