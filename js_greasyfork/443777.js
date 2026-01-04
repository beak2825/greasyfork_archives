// ==UserScript==
// @name         Friends Average Score - MAL
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      10
// @description  Show all your friends weighted score for an entry.
// @author       hacker09
// @include      /^https:\/\/myanimelist\.net\/(anime|manga)(id=)?(\.php\?id=)?\/?\d+\/?(?!.*\/).*(\?q=.*&cat=anime|manga)?$/
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443777/Friends%20Average%20Score%20-%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/443777/Friends%20Average%20Score%20-%20MAL.meta.js
// ==/UserScript==

(async function() {
  'use strict';
  document.querySelector("div.fl-l.score").style.cursor = 'pointer'; //Make the score look like it's clickable
  document.querySelector("div.fl-l.score").onclick = async function GetScores() { //Creates a new function to run when the mouse is hovering the page
    var Average; //Global Variable
    var array = []; //Create a new array
    var nextpagenum = 0; //Create a variable to hold the page number
    const increaseby = 75; //Create a variable to Increase the list page number

    while (true) { //Fetch until there's no next page
      const response = await fetch(document.querySelector("a[href*='stats']").href.split('?')[0] + '?show=' + nextpagenum); //Fetch
      const html = await response.text(); //Gets the fetch response
      const newDocument = new DOMParser().parseFromString(html, 'text/html'); //Parses the fetch response
      nextpagenum += increaseby; //Increase the next page number
      newDocument.querySelectorAll("table.table-recently-updated > tbody > tr > td:nth-child(2)").forEach(async function(el) { //For each friend score
        if (el.innerText.match(/\d+/) !== null) //If the score is not = -
        { //Start the if condition
          array.push(parseInt(el.innerText.match(/\d+/)[0])); //Add each score to an array
          var ScoresTotal = array.filter(Boolean).map(i => Number(i)).reduce((a, b) => a + b); //Sum all scores
          Average = (ScoresTotal / array.length).toFixed(2); //Divide all scores by total amount of scores and convert the average to show numbers only up to 2 decimal places
        } //Finishes the if condition
      }); //Finishes the for each loop
      document.querySelector("div.fl-l.score").title = 'Average based on 0 Friend scores.'; //Show the amount of friends friends score
      if (response.status === 404) { //If the next page does not exist
        if (Average !== undefined) //If the Average is not = undefined
        { //Start the if condition
          document.querySelector("div.fl-l.score").dataset.title += '(' + Average + ')'; //Show the friends entry average
          document.querySelector("div.fl-l.score").title = 'Average based on ' + array.length + ' Friend scores.'; //Show the amount of friends friends score
        } //Finishes the if condition
        return; //End the fetching loop
      } //Finishes the if condition
      await new Promise(resolve => setTimeout(resolve, 600)); //Wait 600 ms to fetch the next page
    } //Finishes the while condition
  }; //Finishes the onmousemove event listener
})();