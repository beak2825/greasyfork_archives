// ==UserScript==
// @name         prayer-streak
// @namespace    prayer-streak.zero.nao
// @version      0.1
// @description  prayer streak reminder
// @author       nao [2669774]
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/526815/prayer-streak.user.js
// @updateURL https://update.greasyfork.org/scripts/526815/prayer-streak.meta.js
// ==/UserScript==

let api = "";
let url = window.location.href;
let requestURL = `https://api.torn.com/user/log?selections=log&log=5971&key=${api}`;

let prayedToday = false;

function calculatePrayerStreak(logData) {
  // If no data or empty log, return 0
  if (!logData || !logData.log || Object.keys(logData.log).length === 0) {
    return 0;
  }

  // Convert all timestamps to dates and store unique dates
  const prayerDates = new Set();
  Object.values(logData.log).forEach((entry) => {
    const date = new Date(entry.timestamp * 1000).toDateString();
    prayerDates.add(date);
  });

  // Get today and yesterday's dates
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // check if prayed today
  if (prayerDates.has(today.toDateString())) {
    prayedToday = true;
  }

  // If they haven't prayed yesterday, streak is 0
  if (!prayerDates.has(yesterday.toDateString())) {
    return 0;
  }

  // Count consecutive days backwards from yesterday
  let streak = 0;
  let currentDate = new Date(yesterday);

  while (prayerDates.has(currentDate.toDateString())) {
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
}

async function getLog() {
  const response = await $.getJSON(requestURL);
  return response;
}

async function main() {
  const logData = await getLog();
  const streak = calculatePrayerStreak(logData);
  console.log(streak);

  // check if prayed today and after 9 pm
  if (!prayedToday && new Date().getHours() >= 21) {
    alert("Don't forget to pray today!");
  }
  insertStreak(streak);
}

function insertStreak(n) {
  if ($("div[class^='content_']").length == 0) {
    setTimeout(insertStreak, 1000);
    return;
  }

  const inputData = `<div><b>Prayer Streak:</b> ${n}</div>`;
  $("div[class^='content_']")[0].insertAdjacentHTML("afterend", inputData);
}

main();
