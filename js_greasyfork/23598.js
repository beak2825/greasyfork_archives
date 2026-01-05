// ==UserScript==
// @name         Afkøl og Vind
// @namespace    http://kostecki.dk/
// @version      1.0
// @description  Just trying to make things a bit easier ¯\_(ツ)_/¯
// @author       Jacob Kostecki (kostecki.dk)
// @match        https://promotions.coca-cola.com/dk/da/sommer/*
// @downloadURL https://update.greasyfork.org/scripts/23598/Afk%C3%B8l%20og%20Vind.user.js
// @updateURL https://update.greasyfork.org/scripts/23598/Afk%C3%B8l%20og%20Vind.meta.js
// ==/UserScript==

(function() {
  'use strict';
  $('<div class="counter"><h2 id="count">1/3</h2> <button id="clear">Clear counter</button></div>').appendTo('.header');
  $("<style type='text/css'> #janrainModalOverlay:nth-of-type(22), #janrainModal:nth-of-type(23) {display: none !important;} .counter {position: fixed; background: black; padding: 10px; z-index: 1000;} #count {color: yellow; font-size: 5rem;}</style>").appendTo("head");

  $(function() {
    setCounter();
    $('#Optin').prop('checked', true);
    $('#confirmTermsConditions').prop('checked', true);
  });

  function doCounter() {
    if (!localStorage.counter) {
      localStorage.setItem("counter", 1);
    } else {
      if (localStorage.counter < 3) {
        localStorage.counter = Number(localStorage.counter) + 1;
      } else {
        localStorage.setItem("counter", 1);
      }
    }
    setCounter();
    console.log(localStorage.counter + '/3');
  }

  function setCounter() {
    if (!localStorage.counter) {
      $('#count').html("1/3");
    } else {
      $('#count').html(localStorage.counter + '/3');
    }
  }

  function clearCounter() {
    localStorage.setItem("counter", 1);
    setCounter();
  }

  $('#clear').click(function() {
    clearCounter();
  });

  $('#competitionFormSubmit').click(function() {
    doCounter();
  });
})();