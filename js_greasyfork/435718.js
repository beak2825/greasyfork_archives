// ==UserScript==
// @name         Hide Entry Score
// @namespace    ScoreHider
// @version      7
// @description  Hide the score on anime/manga on MAL as soon as the page loads. To see the entry store hover the mouse over the score.
// @author       hacker09
// @include      /^https:\/\/myanimelist\.net\/(anime|manga)(id=)?(\.php\?id=)?\/?\d+\/?(?!.*\/).*(\?q=.*&cat=anime|manga)?$/
// @match        https://myanimelist.net/stacks/*
// @match        https://myanimelist.net/topanime.php*
// @match        https://myanimelist.net/anime/season*
// @match        https://myanimelist.net/anime/genre/*
// @match        https://myanimelist.net/anime/producer/*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435718/Hide%20Entry%20Score.user.js
// @updateURL https://update.greasyfork.org/scripts/435718/Hide%20Entry%20Score.meta.js
// ==/UserScript==

(function() {
  'use strict';
  document.head.insertAdjacentHTML('beforeend', '<style>.score-label, .stars {display: none;}</style>'); //Hide the scores

  if (location.href.match("genre") !== null) //If the user is on a genre page
  { //Starts the if condition
    document.head.insertAdjacentHTML('beforeend', '<style>tr > td.borderClass.ac.bgColor0:nth-child(5), tr > td.borderClass.ac.bgColor1:nth-child(5) {color: #ffffff00;}</style>'); //Hide the scores on genre pages
    document.head.insertAdjacentHTML('beforeend', '<style>td.borderClass.bgColor1.ac.fw-b:nth-child(5) {color: #1c439b;}</style>'); //Show the score column on genre pages
  } //Finishes the if condition

  window.addEventListener("load", function() //Wait the window load
    { //Starts the load event listener
      if (document.querySelector("span[style*='color: #787878;']") !== null) //If the user is on a producer page with the List View enabled
      { //Starts the if condition
        document.querySelectorAll("span[style*='color: #787878;']").forEach(el => el.style.display = 'none'); //Hide the scores
      } //Finishes the if condition

      document.querySelectorAll("div.fl-l.score,.js-statistics-info,td.score.ac,td.your-score.ac,.scormem,.widget,.icon-people-score-star,td.borderClass.bgColor1.ac.fw-b:nth-child(5)").forEach(function(el) { //Starts a for loop
        el.onmousemove = async function() { //Creates a new function to run when the mouse is hovering the score
          if (document.querySelector(".icon-people-score-star") !== null) //If the user is on a producer page with the List View enabled
          { //Starts the if condition
            document.querySelectorAll("span[style*='color: rgb(120, 120, 120);']").forEach(el => el.style.display = 'contents'); //Show the scores
          } //Finishes the if condition
          else //If the user is not on a producer page with the List View enabled
          { //Starts the else condition
            document.querySelectorAll(".score-label, .stars").forEach(el => el.style.display = 'contents'); //Show the scores

            if (location.href.match("genre") !== null) //If the user is on a genre page
            { //Starts the if condition
              document.head.insertAdjacentHTML('beforeend', '<style>tr > td.borderClass.ac.bgColor0:nth-child(5), tr > td.borderClass.ac.bgColor1:nth-child(5) {color: black;}</style>'); //Hide the scores on genre pages
            } //Finishes the if condition

          } //Finishes the else condition
        }; //Finishes the onmousemove event listener
      }); //Finishes the for loop
    }); //Finishes the load event listener
})();