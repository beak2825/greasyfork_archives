// ==UserScript==
// @name             GameTracker Time Played
// @namespace        http://www.tampermonkey.net/
// @homepage         https://greasyfork.org/ro/scripts/465218-gametracker-time-played
// @version          2.0
// @description      Displays the time played in days, hours, and minutes for a player on GameTracker.
// @match            https://www.gametracker.com/player/*
// @icon             https://www.gametracker.com/images/icons/icon16x16_gt.png
// @grant            none
// @require          https://code.jquery.com/jquery-3.6.0.min.js
// @source           https://raw.githubusercontent.com/ALeX400/UserScripts/main/GameTrackerTimePlayed.js
// @license          MIT
// @downloadURL https://update.greasyfork.org/scripts/465218/GameTracker%20Time%20Played.user.js
// @updateURL https://update.greasyfork.org/scripts/465218/GameTracker%20Time%20Played.meta.js
// ==/UserScript==

(function(){'use strict';const sectionTitles=document.querySelectorAll('div.section_title');for(const sectionTitle of sectionTitles){if(sectionTitle.textContent.includes("ALL TIME STATS")){const itemColorTitles=sectionTitle.parentElement.querySelectorAll('span.item_color_title');for(const title of itemColorTitles){if(title.textContent.includes("Minutes Played:")){const minutesPlayedText=title.nextSibling;const minutesPlayed=parseInt(minutesPlayedText.textContent,10);const timePlayed=convertMinutesToTimePlayed(minutesPlayed);const timePlayedString=formatTimePlayedString(timePlayed);const separator="\n\t\t\t\t\t\t\t";const totalTimeTitle=document.createElement('span');totalTimeTitle.classList.add('item_color_title');const totalTimeText=document.createTextNode(`${separator}Total Time:${separator}`);totalTimeTitle.appendChild(totalTimeText);const totalTimeNum=document.createTextNode(`${separator}${timePlayedString}${separator}`);title.parentElement.insertBefore(document.createElement('br'),minutesPlayedText.nextSibling);title.parentElement.insertBefore(totalTimeTitle,minutesPlayedText.nextSibling.nextSibling);title.parentElement.insertBefore(totalTimeNum,totalTimeTitle.nextSibling);break}}
break}}
function convertMinutesToTimePlayed(minutes){const minutesInHour=60;const hoursInDay=24;const minutesInDay=minutesInHour*hoursInDay;const days=Math.floor(minutes/minutesInDay);const hours=Math.floor((minutes%minutesInDay)/minutesInHour);const remainingMinutes=minutes%minutesInHour;return{days:days,hours:hours,minutes:remainingMinutes}}
function formatTimePlayedString(timePlayed){let timePlayedString="";let timeComponents=[];if(timePlayed.days>0){timeComponents.push(`${timePlayed.days} ${timePlayed.days === 1 ? 'day' : 'days'}`)}
if(timePlayed.hours>0){timeComponents.push(`${timePlayed.hours} ${timePlayed.hours === 1 ? 'hour' : 'hours'}`)}
if(timePlayed.minutes>0){timeComponents.push(`${timePlayed.minutes} ${timePlayed.minutes === 1 ? 'minute' : 'minutes'}`)}
if(timeComponents.length>1){const lastComponent=timeComponents.pop();timePlayedString=timeComponents.join(', ')+' and '+lastComponent}else{timePlayedString=timeComponents[0]}
return timePlayedString}})()
