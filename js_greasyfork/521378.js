// ==UserScript==
// @name         smena shapok prikol`naya
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  An auto interval hat switcher for glar.io
// @author       yt:0b3zb4
// @match        *://glar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521378/smena%20shapok%20prikol%60naya.user.js
// @updateURL https://update.greasyfork.org/scripts/521378/smena%20shapok%20prikol%60naya.meta.js
// ==/UserScript==
(function() {
  'use strict';

  const GAME_URL_PART = "eyJpcCI6ImZyYW5rZnVydC5nbGFyLmlvIiwicG9ydCI6ODQ0Mywic3NsIjp0cnVlLCJpZCI6MTF9";
  const HAT_LIST_ID = "ui-hat-list-container";
  const HAT_ITEM_CLASS = "ui-hat-list-item";
  let pressed = false;
  let i = 0;
  let hatsInterval;
  let hatItems;

  // Redirect to the game if on the main page
  if (window.location.href.includes('glar.io') && !window.location.href.includes(GAME_URL_PART)) {
    window.location.href = `https://glar.io/?game=${GAME_URL_PART}`;
    return;
  }

  // Check if on the game page and add event listener
  if (window.location.href.includes(GAME_URL_PART)) {
    document.addEventListener('keydown', function(e) {
      if (e.keyCode === 81) { // Q key
        const hatList = document.getElementById(HAT_LIST_ID);
        if (!hatList) return; // Check if hat list exists

        if (!pressed) {
          hatList.style.left = '-1000px';
          hatItems = document.getElementsByClassName(HAT_ITEM_CLASS); // Get hat items once
          hatsInterval = setInterval(changeHat, 750);
          pressed = true;
        } else {
          hatList.style.left = '50%';
          clearInterval(hatsInterval);
          pressed = false;
        }
      }
    });

    function changeHat() {
      if (hatItems && hatItems.length > 0) {
        if (i < hatItems.length) {
          hatItems[i].click();
          i++;
        } else {
          i = 0;
        }
      }
    }
  }
})();