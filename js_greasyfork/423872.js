// ==UserScript==
// @name         Quizlet Show Hidden Flashcards
// @namespace    QuizletHack
// @version      26
// @description  Show the hidden flashcards and the first explanation in Quizlet without logging in.
// @author       hacker09
// @match        *://quizlet.com/*
// @icon         https://assets.quizlet.com/a/j/dist/i/favicon.6e263725c926227.ico
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423872/Quizlet%20Show%20Hidden%20Flashcards.user.js
// @updateURL https://update.greasyfork.org/scripts/423872/Quizlet%20Show%20Hidden%20Flashcards.meta.js
// ==/UserScript==

(async function() {
  'use strict';
  var TimesExecuted = 0; //Creates a new variable
  const DisableReading = true; //If true the Reading function will be disabled
  const RemoveNeedlessThings = true; //If true the Needless Things will be removed

  setTimeout(function() { //Starts the setimeout function

    document.head.insertAdjacentHTML('beforeend', '<style>.b1sa2ccx {filter: none !important;}</style>'); //Show cards
    document.head.insertAdjacentHTML('beforeend', '<style>.hnqbbas {max-height: unset;}</style>'); //Show cards
    if (DisableReading === true) //If the DisableReading const is true
    { //Starts the if condition
      document.querySelectorAll(".SetPageTerms-termsList").forEach((el) => { //Starts the forEach loop
        el.innerHTML = el.innerHTML; //Remove the audio of the FlashCard element
      }); //Finishes the forEach loop
    } //Finishes the if condition

    if (RemoveNeedlessThings === true) //If the RemoveNeedlessThings const is true
    { //Starts the if condition
      document.head.insertAdjacentHTML('beforeend', '<style>.SetPageStickyHeader.hgmlhdt, .SetPageTermsStickyBanner.SetPageTermsStickyBanner--hasAdz, .SetPageWall.SetPageWall--normal, .TopNavigationWrapper, .SetPage-setDetailsInfoWrapper, footer, .SetPage-setIntro, .wugyavo, .SetPage-setLinksWrapper, .SetPage-setIntroWrapper, .SetPageEmbeddedAd-wrapper, .SetPageTerms-embeddedDesktopAdz, .SetPageStudyModesBanner-body, .ReactModalPortal, .bb8jmnf, #UniversalUpsellTarget > div, .hideBelow--m, .h1nkdy1n, .d1d5k0iq, .s1lf1hve, .r1vwlny8, .r1sd9oxv, .pfdaoy0 {display: none !important;}</style>'); //Hide the top menu, the stick footer banner, the Sign Up Box and the white overlay above this box, the top navigation menu, the user name that created the quiz, the needlessly big footer, the big flashcards box, the 2 stick footer banner, the related questions below all the cards, title of the cards set, big flash cards box and study/play columns below the big flash cars box, ads in between card rows, more ads, want to learn this set quickly? question box below all card rows, "save time with an expert" message, "turn messy notes into" " message, "Automatically turn messy notes into Magic Notes" message, "Students also viewed" message, Created by and share btns, Flashcards/Learn/Test/Match/Q-Chat btns, Created by and share btns, Flashcards/Learn/Test/Match/Q-Chat btns, hide the "Upgrade for complete access to the Q&A library" overlay
    } //Finishes the if condition
  }, 1500); //Finishes the setimeout function
})();