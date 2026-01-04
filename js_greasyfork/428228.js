// ==UserScript==
// @name         Time Left on Tab - Canvas Instructure
// @namespace    CanvasTimeHelper
// @version      3
// @description  Shows the test/quiz/exam time left on the browser tab and also keeps the questions and time fixed on the screen.
// @author       hacker09
// @match        https://*.instructure.com/courses/*/quizzes/*
// @icon         https://du11hjcvx0uqb.cloudfront.net/br/dist/images/favicon-e10d657a73.ico
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428228/Time%20Left%20on%20Tab%20-%20Canvas%20Instructure.user.js
// @updateURL https://update.greasyfork.org/scripts/428228/Time%20Left%20on%20Tab%20-%20Canvas%20Instructure.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if (document.querySelector("div.time_running") !== null) //If the timer element exists on the page
  { //Starts the if condition
    setInterval(function() { //Starts the settimeout function
      document.title = document.querySelector("div.time_running").innerText;
    }, 1000); //Update the tab title to have the current test/quiz/exam left duration time
  } //Finishes the if condition

  document.querySelector("#right-side-wrapper").style.position = 'fixed'; //Make the questions and time elements position fixed on the screen
  document.querySelector("#right-side-wrapper").style.right = '0px'; //Make the questions and time elements position fixed on the right side of the screen
  document.querySelector("#right-side-wrapper").style.top = '0px'; //Make the questions and time elements position fixed on the top side of the screen
  document.querySelector("#questions").style.width = '70%'; //Keep the questions element the same width
  document.querySelector("#question_list").style.maxHeight = '430px'; //Fit 18 questions instead of 8

})();