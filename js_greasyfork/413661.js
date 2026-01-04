// ==UserScript==
// @name         Show The Average Score For Animes/Mangas Instead Of N/A
// @namespace    AverageScore
// @version      18
// @description  Shows the average score of unpopular entries that have unweighted scores "N/A" on MAL.
// @author       hacker09
// @include      /^https:\/\/myanimelist\.net\/(anime|manga)(id=)?(\.php\?id=)?\/?\d+\/?(?!.*\/).*(\?q=.*&cat=anime|manga)?$/
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413661/Show%20The%20Average%20Score%20For%20AnimesMangas%20Instead%20Of%20NA.user.js
// @updateURL https://update.greasyfork.org/scripts/413661/Show%20The%20Average%20Score%20For%20AnimesMangas%20Instead%20Of%20NA.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if (document.querySelector("div.score-label.score-na") !== null) { //If the N/A score exists
    var TimesExecuted = 0; //Creates a new variable
    window.onmousemove = async function() { //Creates a new function to run when the mouse is hovering the page
      TimesExecuted += 1; //Sum the amount of times that the mouse hovered the page
      if (TimesExecuted === 1) { //On the first time that the page is hovered
        const response = await fetch(document.querySelector("a[href*='stats']").href); //Fetch the stats page
        const html = await response.text(); //Gets the fetch response
        const newDocument = new DOMParser().parseFromString(html, 'text/html'); //Parses the fetch response

        const votes = [...newDocument.querySelectorAll(".score-stats td")].map(row => row.textContent)
        const scoreDictionary = {}
        for (let i = 1; i < votes.length; i += 2) {
          const vote = votes[i];
          const score = votes[i - 1];
          scoreDictionary[score] = vote;
        }

        for (let i in scoreDictionary)
          scoreDictionary[i] = Number(scoreDictionary[i].match(/.*\((\d+) votes?\)/)[1]);
        const totalVotes = Object.values(scoreDictionary).reduce((acc, val) => acc + val);
        let average = 0;

        for (let i in scoreDictionary)
          average += scoreDictionary[i] * i;
        var result = average /= totalVotes;

        document.querySelector("div.score-label.score-na").innerText = result.toFixed(2); //Show the Average Score results
        document.querySelectorAll("div.fl-l.score")[0].dataset.user = totalVotes + ' users'; //Show the total users that voted
      } // //Finishes the if condition
    }; //Finishes the onmousemove event listener
  } //Finishes the if statement
})();