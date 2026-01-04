// ==UserScript==
// @name         360 Training - click next button and alert for quiz
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Keep clicking the "next" button regardless of the timer - unless we are on a quiz page
// @author       You
// @license      MIT
// @match        https://player.360training.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=360training.com
// @grant        none
// @require http://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/456305/360%20Training%20-%20click%20next%20button%20and%20alert%20for%20quiz.user.js
// @updateURL https://update.greasyfork.org/scripts/456305/360%20Training%20-%20click%20next%20button%20and%20alert%20for%20quiz.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

(function () {
  'use strict';
  function tryClickNext() {
    console.log('you should see me every 10 seconds!');
    const beginQuizButton = $('#BeginLessonAssessmentButton');
    if(beginQuizButton.length > 0){
        console.log('take the quiz...');
    }
    else {
      console.log('no quiz right now...');
      const nextButton = $('#PlaybuttonEna a');
      if(nextButton.length > 0) {
          console.log('clicking...');
          $('span#PlaybuttonEna a #PlaybuttonEnText').click();
          console.log('clicked...');
      }
    }
  };

  // check every 10 seconds
  setInterval(tryClickNext, 10000);
})();