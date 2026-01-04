// ==UserScript==
// @name LNMTL DATES
// @namespace Violentmonkey Scripts
// @match https://lnmtl.com/novel/*
// @require https://unpkg.com/moment
// @description date and time in ISD format
// @version 0.2
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/377979/LNMTL%20DATES.user.js
// @updateURL https://update.greasyfork.org/scripts/377979/LNMTL%20DATES.meta.js
// ==/UserScript==

console.log("I am alive.");

var dates_arr = document.getElementsByClassName("label-default");

function addDate(date,hours,minutes){
  return moment(date.innerHTML,'YYYY-MM-DD hh:mm').add(hours,'hour').add(minutes,'minutes').format("YYYY-MMM-DD hh:mm");
}

for(var i = 0; i<dates_arr.length; i++ ){
  dates_arr[i].innerHTML = addDate(dates_arr[i], 5,30);
}