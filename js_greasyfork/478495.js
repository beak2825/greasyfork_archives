// ==UserScript==
// @name         GC Sidebar Timezone and Remaining Time
// @namespace    http://tampermonkey.net/
// @version      0.41
// @description  Changes the times of stuff in the aio sidebar to both be user's local timezone, adds how many hours/minutes until that time, and highlights quest timers if less than 15 mins remain.
// @author       Twiggies
// @match        *://www.grundos.cafe/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478495/GC%20Sidebar%20Timezone%20and%20Remaining%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/478495/GC%20Sidebar%20Timezone%20and%20Remaining%20Time.meta.js
// ==/UserScript==

//MINUTES remaining before quest text will be highlighted red as a warning. Set to -1 to disable this.
const warningTime = 15;

function getOffsetBetweenTimezonesForDate(date, timezone1, timezone2) {
  const timezone1Date = convertDateToAnotherTimeZone(date, timezone1);
  const timezone2Date = convertDateToAnotherTimeZone(date, timezone2);
  return timezone1Date.getTime() - timezone2Date.getTime();
}

function convertDateToAnotherTimeZone(date, timezone) {
  const dateString = date.toLocaleString('en-US', {
    timeZone: timezone
  });
  return new Date(dateString);
}

let offset = getOffsetBetweenTimezonesForDate(new Date(), 'PST8PDT', Intl.DateTimeFormat().resolvedOptions().timeZone);

let rightMeow = new Date()
let nowTime = new Date(1970, 1, 1, rightMeow.getHours(), rightMeow.getMinutes())

const questTimeList = document.querySelectorAll('span.aio-subtext'); //#aio_sidebar div.quests div.aioImg div span.aio-subtext
for (let i = 0; i < questTimeList.length; i++) {
    //First remove the word 'next: ' from it just in case, and also 'nst'
    let timeText = questTimeList[i].innerText.replace(/next: /gi, '').replace(/nst/gi,'').trim();
    //Now split it.
    let splitTime = timeText.split(/[\s:]+/)
    //If the time is not in the format we expect (11:11 am) then skip ie farie quests
    if (splitTime.length != 3 || isNaN(Number(splitTime[0])) || isNaN(Number(splitTime[1])) || (splitTime[2] != 'am' && splitTime[2] != 'pm')) {
        continue;
    }
    //[0] = Hour, [1] = minutes, [2] = am/pm
    if (splitTime[2] == 'pm' && splitTime[0] != 12) {
        //Add 12 hours to the hour if it's pm but not 12.
        splitTime[0] = Number(splitTime[0]) + 12;
    }
    let questTime = new Date(1970, 1, 1, splitTime[0], splitTime[1])
    let localTime = new Date(questTime.getTime() - offset);

    questTimeList[i].innerText = localTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    var diffMs = (localTime - nowTime); // milliseconds between server time and goal time
    var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

    const totalMinutes = (diffHrs*60) + diffMins;
    const timeTo = (diffHrs > 0 ? diffHrs + " hr " + (diffHrs == 1 ? "" : "s ") : "") + diffMins + " mins";
    questTimeList[i].insertAdjacentHTML('beforeend',`<br style="display:block;"><span style="font-size:0.75em">${timeTo}</span>`);

    //If this is a quest item.. Mark the text red is there is less than x mins until the thing.
    if (questTimeList[i].closest('div.quests')) {
        if (totalMinutes <= warningTime) {
            questTimeList[i].style.color = 'red';
        }
    }

}