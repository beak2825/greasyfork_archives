// ==UserScript==
// @name         New airing anime fix - MAL
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      3
// @description  Open the anime entry page instead of the season page for "The anime you plan to watch will begin airing on..." notifications.
// @author       hacker09
// @match        https://myanimelist.net/*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490506/New%20airing%20anime%20fix%20-%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/490506/New%20airing%20anime%20fix%20-%20MAL.meta.js
// ==/UserScript==

setTimeout(() => {
  'use strict';
  new MutationObserver(function() { //Creates a new mutation observer
    setTimeout(() => { //Delay execution of forEach loop
      document.querySelectorAll('.header-notification-dropdown > div > div > ol > li > a').forEach(function(el) { //For each notification
        if (el.href === 'https://myanimelist.net/anime/season') //If the notification has the anime season link
        { //Starts the if condition
          el.href = el.parentNode.querySelector('div > div > span > span > a').href; //Replace the anime season link with the entry link
        } //Finishes the if condition
      }); //Finishes the for each loop
    }, 1000); //Finishes the setTimeout function
  }).observe(document.querySelector('.header-notification-dropdown'), { attributes: true, attributeFilter: ['style'] }); //Declare changes to be observed
}, 0);