// ==UserScript==
// @name Hide Piazza Stories Badge
// @description Exclude Piazza Stories from the overall notifications badge
// @match *://piazza.com/*
// @grant none
// @noframes
// @version 1.1
// @icon https://piazza.com/favicon.ico
// @namespace https://greasyfork.org/users/167667
// @downloadURL https://update.greasyfork.org/scripts/37679/Hide%20Piazza%20Stories%20Badge.user.js
// @updateURL https://update.greasyfork.org/scripts/37679/Hide%20Piazza%20Stories%20Badge.meta.js
// ==/UserScript==

//console.log("Userscript is running");

globalBadge = document.getElementById("global_notifications_indicator");
if (globalBadge === null || globalBadge === undefined) {
  console.log("Userscript error: Global notification indicator not found");
  return;
}

storiesBadge = document.getElementById("dropdown_notifications_stories_ixoaerg0y5u6e6");
if (storiesBadge === null || storiesBadge === undefined) {
  console.log("Userscript error: Piazza Stories notification badge not found");
  return;
}

storiesNum = Number(storiesBadge.innerText);
if (storiesNum === null || storiesNum === undefined || isNaN(storiesNum)) {
  console.log("Userscript error: Piazza Stories notification badge has non-numeric value");
  return;
} else if (storiesNum < 0) {
  console.log("Userscript error: Piazza Stories notification badge has negative value");
  return;
}

globalNum = Number(globalBadge.innerText) - storiesNum;

if (globalNum === null || globalNum === undefined) {
  return;
} else if (globalNum < 0) {
  console.log("Userscript error: Notification number shouldn't be negative!");
  return;
} else if (globalNum === 0) {
  globalBadge.parentNode.style.visibility = 'hidden';
} else {
  globalBadge.innerText = globalNum;
}
