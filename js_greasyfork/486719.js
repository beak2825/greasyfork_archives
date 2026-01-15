// ==UserScript==
// @name         Hide Opened Movies - YIFY Movies
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      6
// @description  Hide all movies you were previously opened while browsing YTS.
// @author       hacker09
// @include      https://yts.*/browse-movies/*
// @include      https://yts.*/movies/*
// @icon         https://yts.*/assets/images/website/apple-touch-icon-180x180.png
// @grant        GM_registerMenuCommand
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/486719/Hide%20Opened%20Movies%20-%20YIFY%20Movies.user.js
// @updateURL https://update.greasyfork.org/scripts/486719/Hide%20Opened%20Movies%20-%20YIFY%20Movies.meta.js
// ==/UserScript==

(function() {
  'use strict';
  GM_registerMenuCommand("Enable/Disable Hide opened movies", (function() { //Adds an option to the tampermonkey menu
    if (GM_getValue("Hide_All") === true) { //If the last config was true, set as false
      GM_setValue("Hide_All", false); //Defines the variable as false
      alert('Disabled'); //Show a message
    } //Finishes the if condition
    else { //If the last config was false, set to true
      GM_setValue("Hide_All", true); //Defines the variable as true
      alert('Enabled'); //Show a message
    } //Finishes the else condition
    location.reload(); //Reloads the page
  })); //Finishes the TamperMonkey menu option function

  if (GM_getValue('Hide_All') === true) { //If Hide_All is true
    if (location.href.match('/movies') !== null) { //If the opened link is a movie page
      GM_setValue(location.href.split('?')[0], location.href.split('?')[0]); //Store the URL
    } //Finishes the if condition

    setInterval(function() { //Starts the setInterval function
      GM_listValues().forEach((link) => { //ForEach stored URL
        link !== 'Hide_All' && (document.querySelector(`[href*="${new URL(GM_getValue(link).split('?')[0]).pathname}"]`) ? document.querySelector(`[href*="${new URL(GM_getValue(link).split('?')[0]).pathname}"]`).parentNode.style.display = 'none' : ''); //Hide the previously opened movie page
      }); //Finishes the ForEach loop
    }, 2000)} //Finishes the setInterval function and finishes the if condition

  //hide if only 1 Genre is found document.querySelectorAll("figcaption").querySelectorAll("h4").parentNode.parentNode.parentNode.parentNode
  //if len === 2 only 1 genre, if len 3 it has two genres

  //future or this update, rating filter
  //highlighy biography? and genres option
})();