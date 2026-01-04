// ==UserScript==
// @name         Greasy Fork - Analyze from posted scripts
// @namespace    ScriptAnalyzer
// @version      14
// @description  Shows the total amount for each rating, total/daily installs, and scripts posted on any user profile and search pages.
// @author       hacker09
// @match        https://greasyfork.org/*/users/*
// @match        https://greasyfork.org/*/scripts?q=*
// @match        https://greasyfork.org/*/scripts/by-site/*
// @icon         https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://greasyfork.org/&size=64
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468184/Greasy%20Fork%20-%20Analyze%20from%20posted%20scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/468184/Greasy%20Fork%20-%20Analyze%20from%20posted%20scripts.meta.js
// ==/UserScript==

(async function() {
  'use strict';
  const data = await (await fetch(document.querySelector('link[href$=".json"]').href)).json(); //Fetch and parse the response
  var LatestCreated, LatestUpdated, ok, bad, good, DailyTotal, TotalInstalls, element, SignedIN, ScriptsArray = data.scripts; //Create new variables

  SignedIN = document.querySelector('.user-profile-link a')?.href.match(/\d+/)[0] === String(data.id) ? ' + Deleted + Unlisted + Libraries' : ''; //If the user is on their own profile page
  element = location.href.match(/org\/.*\/scripts/) ? ".width-constraint:nth-child(2)" : "#user-script-sets-section, #user-script-list-section"; //If the current page is a script search page

  LatestCreated = new Date(Math.max(...ScriptsArray.map(obj => new Date(obj.created_at)))); //Get the latest created script
  LatestUpdated = new Date(Math.max(...ScriptsArray.map(obj => new Date(obj.code_updated_at)))); //Get the latest updated script
  ok = ScriptsArray.map(obj => obj.ok_ratings).reduce((acc, curr) => acc + curr, 0); //Sum the total amount of ok ratings
  bad = ScriptsArray.map(obj => obj.bad_ratings).reduce((acc, curr) => acc + curr, 0); //Sum the total amount of bad ratings
  good = ScriptsArray.map(obj => obj.good_ratings).reduce((acc, curr) => acc + curr, 0); //Sum the total amount of good ratings
  DailyTotal = ScriptsArray.map(obj => obj.daily_installs).reduce((acc, curr) => acc + curr, 0); //Sum the total amount of daily total installs
  TotalInstalls = ScriptsArray.map(obj => obj.total_installs).reduce((acc, curr) => acc + curr, 0); //Sum the total amount of total installs

  document.querySelector(element).insertAdjacentHTML("afterbegin", `<style>.list-option:not(.list-current) {display: flex; flex-direction: row; align-items: center;} .list-option:not(.list-current) > span {position: relative; left: -7px;} .list-option.list-current > span {position: relative; left: 5px;}</style> <section><header><h3>Total</h3></header><section class="text-content"><ul><li><b>Script posts${SignedIN}</b>: ${ScriptsArray.length}</li><li><b>Daily installs</b>: ${DailyTotal.toLocaleString()}</li><li><b>Total installs</b>: ${TotalInstalls.toLocaleString()}</li><li><b>Total ok ratings</b>: ${ok.toLocaleString()}</li><li><b>Total bad ratings</b>: ${bad.toLocaleString()}</li><li><b>Total good ratings</b>: ${good.toLocaleString()}</li><li><b>Latest created</b>: ${LatestCreated}</li><li><b>Latest updated</b>: ${LatestUpdated}</li></ul></section></section>`); //Add the information on the page
  document.querySelector(".list-option").innerHTML += `<span>(${DailyTotal.toLocaleString()})</span>`; //Add the Dailytotal number on the sidebar
  document.querySelector(".list-option:nth-child(2)").innerHTML += `<span>(${TotalInstalls.toLocaleString()})</span>`; //Add the total number on the sidebar
  document.querySelector(".list-option:nth-child(3)").innerHTML += `<span>(${ok+bad+good.toLocaleString()})</span>`; //Add the ratings number on the sidebar
})();