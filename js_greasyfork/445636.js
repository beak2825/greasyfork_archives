// ==UserScript==
// @name         My live actions time counter - MAL
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      1
// @description  My live actions Time Counter
// @author       hacker09
// @include      /https:\/\/myanimelist\.net\/profile\/[^\/]+(\/)?$/
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445636/My%20live%20actions%20time%20counter%20-%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/445636/My%20live%20actions%20time%20counter%20-%20MAL.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var totlines = []; //Creates a new blank array
  var TotalHrs = []; //Creates a new blank array
  var TotalHrMins = []; //Creates a new blank array
  document.querySelectorAll("span.spoiler_content")[3].childNodes.forEach(function(node) { //For each listed entry row childNodes elements
    if (node.nodeType === 3 && node.data !== null && node.data.match(/(\d+)h (\d+)min/) !== null) //If the line has h and min
    { //Starts the if condition
      TotalHrs.push(node.data.match(/(\d+)h (\d+)min/)[1]); //Add the hrs to the array
      TotalHrMins.push(node.data.match(/(\d+)min/)[1]); //Add the mins to the array
    } //Finishes the if condition
    if (node.nodeType === 3 && node.data !== null && node.data.match(/Total (\d+)min/) !== null) //If the line has only Total Xmin
    { //Starts the if condition
      TotalHrMins.push(node.data.match(/Total (\d+)min/)[1]); //Add the mins to the array
    } //Finishes the if condition
    if (node.nodeType === 3 && node.data !== null && node.data.match(/ (\d+)h$/) !== null) //If the line has only h
    { //Starts the if condition
      TotalHrs.push(node.data.match(/ (\d+)h$/)[1]); //Add the hrs to the array
    } //Finishes the if condition
    if (node.nodeType === 3 && node.data !== null && node.data.match(/(\d+) eps? of (\d+)/) !== null) //If the line has eps of
    { //Starts the if condition
      TotalHrMins.push(node.data.match(/(\d+) eps? of (\d+)/)[1] * node.data.match(/(\d+) eps? of (\d+)/)[2]); //Add the mins to the array (eps*mins)
    } //Finishes the if condition

    if (node.nodeType === 3 && node.data !== null && node.data.match(/((\d+))/)) //If the line has the release (year)
    { //Starts the if condition
      totlines.push(0); //Add the number 0 to the array
    } //Finishes the if condition

    if (node.nodeType === 3 && node.data !== null && node.data.match(/(\d+) eps? of (\d+)/) === null && node.data.match(/ (\d+)h$/) === null && node.data.match(/(\d+)h (\d+)min/) === null && node.data.match(/ watched /) === null && node.data.match(/\n/) === null) { //Starts the if condition
      alert('UNMATCHED  ' + node.data); //If none of the matches above matched a line show the line that didn't match
    } //Finishes the if condition
  }) //Finishes the for each loop

  const TotalMinsResult = TotalHrMins.filter(Boolean).map(i => Number(i)).reduce((a, b) => a + b); //Sum Hrs in Mins + Total Mins
  const TotalHrsResult = TotalHrs.filter(Boolean).map(i => Number(i)).reduce((a, b) => a + b); //Sum Hrs in Mins + Total Mins
  const TotMinsFinal = TotalHrsResult * 60 + TotalMinsResult; //Store the final total minutes in a variable
  const Lines = totlines.length - 1; //Store the total amount of lines

  document.title += '  Total Watched=' + Lines + ' | Total Time Spent=' + TotMinsFinal + '.min'; //Show the total watched lines and total time spent in minutes
  //Lines has -1 to remove the line "I've tried to find ALL Live actions on 02/may/2020, for every single anime that I've watched till 02/may/2020."
})();