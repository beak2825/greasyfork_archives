// ==UserScript==
// @name         Finish Airing Date - MAL
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      4
// @description  Calculate the expected finished airing date for anime entries and automatically open the anime entry link once it finishes airing.
// @author       hacker09
// @match        https://myanimelist.net/anime/*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @run-at       document-end
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/482053/Finish%20Airing%20Date%20-%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/482053/Finish%20Airing%20Date%20-%20MAL.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var expectedFinishedAiringDate;
  const startDateElement = [...[...document.querySelectorAll("h2")].find(h2 => h2.textContent === "Information").parentNode.querySelectorAll("div")].find(info => info.innerText.includes("Aired")).querySelector("span"); //Get the start date from the page
  if (startDateElement.parentNode.textContent.match(/\?/) !== null && document.querySelector("#curEps").innerText !== '?') { //If the finished date is unknown and the total entry eps are known
    const startDateMatch = startDateElement.parentNode.textContent.match(/(\w{3})\s((\d{1,2}),\s)?(\d{4})/); //Save the start date
    const month = {'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6, 'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12}[startDateMatch[1]]; //Convert start month to number
    const startDate = new Date(parseInt(startDateMatch[4]), month - 1, startDateMatch[2] === undefined ? 0 : parseInt(startDateMatch[2])); //Save start date Year, month, day
    expectedFinishedAiringDate = new Date(startDate.getTime() + parseInt(document.querySelector("#curEps").innerText) * 7 * 24 * 60 * 60 * 1000); //Calculate the expected finished date

    startDateElement.parentNode.className += ' dark_text'; //Make the text bold
    startDateElement.nextSibling.textContent = startDateElement.nextSibling.textContent.replace(/\?/g, ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][expectedFinishedAiringDate.getMonth()] + ' ' + (startDateMatch[2] === undefined ? '' : expectedFinishedAiringDate.getDate() + ', ') + expectedFinishedAiringDate.getFullYear()); //Replace ? with the finished and formatted date

    if (document.body.innerText.search("Add to List") === -1) { //If the entry is on the user list

      GM_listValues().forEach(function(el) { //For each stored value on tampermonkey
        if (Date.now() >= GM_getValue(el)) //If the expectedFinishedAiringDate is today or has passed
        { //Starts the if condition
          GM_openInTab(`https://myanimelist.net/anime/${el.match(/\d+/)[0]}/`); //Open the link on a new tab
          GM_deleteValue(el); //Remove the opened link from the storage
        } //Finishes the if condition
      }); //Finishes the forEach loop

      if (new Date() < expectedFinishedAiringDate) { //If the expectedFinishedAiringDate hasn't passed yet
        startDateElement.nextSibling.textContent += 'ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ﹌﹌﹌﹌﹌﹌'; //Add an underline to the expected finish date if the user will have the anime link opened on that day
        GM_setValue(location.href.split('/')[4], expectedFinishedAiringDate.getTime()); //Store the Entry id and the expectedFinishedAiringDate
      } //Finishes the if condition

    } //Finishes the if condition
  } //Finishes the if condition
})();