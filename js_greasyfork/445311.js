// ==UserScript==
// @name         Timer Watch
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      2
// @description  Displays the timer on timerminutes.com and also shows a digital clock.
// @author       hacker09
// @match        https://www.timerminutes.com/*
// @icon         https://www.timerminutes.com/favicon.ico
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445311/Timer%20Watch.user.js
// @updateURL https://update.greasyfork.org/scripts/445311/Timer%20Watch.meta.js
// ==/UserScript==


(function() {
  'use strict';
  document.querySelector("#btnreset").style.display = 'none'; //Hides the element
  document.querySelector("div.header").style.display = 'none'; //Hides the element
  document.querySelector("div.footer").style.display = 'none'; //Hides the element
  document.querySelector("#timer-form").style.display = 'none'; //Hides the element
  document.querySelector("main > div > h1").style.display = 'none'; //Hides the element
  document.querySelector("main > div > h2").style.display = 'none'; //Hides the element
  document.querySelector("main > div > h3").style.display = 'none'; //Hides the element
  document.querySelectorAll("p").forEach(el => el.style.display = 'none'); //Hides the element
  document.querySelectorAll("ul.listh").forEach(el => el.style.display = 'none'); //Hides the element
  document.querySelectorAll("div.margin10.center").forEach(el => el.style.display = 'none'); //Hides the element

  document.querySelector("#result > span").insertAdjacentHTML('afterEnd', `<br><span class="time"></span>`); //Show the time

  function showTime() { //Creates a new function
    var date = new Date(); //Creates a variable to hold the computer date on the local time zone
    var h = date.getHours(); //Get the hours in the computer date on the local time zone
    var m = date.getMinutes(); //Get the minutes in the computer date on the local time zone
    var s = date.getSeconds(); //Get the seconds in the computer date on the local time zone

    document.querySelector(".time").innerText = h + ":" + m + ":" + s; //Adds the current time to the time element
    setTimeout(showTime, 1000); //Update the time every second
  } //Finishes the showTime function

  showTime(); //Runs the showTime function
})();