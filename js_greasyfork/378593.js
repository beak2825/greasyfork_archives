// ==UserScript==
// @name         Reddit Unit Converter
// @version      0.5.2
// @description  Converts lbs to kgs
// @author       Mario O.M.
// @namespace    https://github.com/marioortizmanero/RedditLbsToKgsConverter
// @match        *://*.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378593/Reddit%20Unit%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/378593/Reddit%20Unit%20Converter.meta.js
// ==/UserScript==

(function() {
  /*
   * You can change the match tag at the top to something like '*://*.reddit.com/r/Brogress/*' to
   * only use it on your preferred subreddits. Just keep adding new match tags for every
   * subreddit you want to use it on.
   *
   * Change 'round' below to 'true' if you prefer a double decimal result like '25.83'
   * instead of '26'.
   *
   * Change 'reverseConverter' to 'true' if you want to convert from kgs to lbs instead.
   *
   * Change 'updateForRES' to 'true' if you want the auto-scroll feature from RES to work.
   * (titles won't get updated in RES with the automatic page loads). This feature is disabled
   * by default because it consumes resources and has issues with other extensions like Imagus.
  */
  'use strict';
  const reverseConverter = false;
  const round = false;
  const updateForRES = false;

  const lbsToKgRegex = /(\d*\.?\d+)\s?(lbs?|pounds?)/gi;
  const kgToLbsRegex = /(\d*\.?\d+)\s?(kgs?|kilograms?)/gi;
  const lbsToKgsConst = 2.205;

  var convertUnits = function () {
    var comments = document.querySelectorAll("p");
    var titles = document.querySelectorAll("h2");

    // Modifies the numbers and units
    function lbsToKg(match,p1,p2) {
      let unit = "kg";
      let num = round ? Math.round(p1/lbsToKgsConst*100)/100 : Math.round(p1/lbsToKgsConst);
      return [num, unit].join("");
    }
    function kgToLbs(match,p1,p2) {
      let unit = "lbs";
      let num = round ? Math.round(p1*lbsToKgsConst*100)/100 : Math.round(p1*lbsToKgsConst);
      return [num, unit].join("");
    }

    // Regex expressions:
    for (let i=0;i<titles.length; i++) {
      if(reverseConverter) {
        titles[i].innerHTML = titles[i].innerHTML.replace(kgToLbsRegex, kgToLbs);
      } else {
        titles[i].innerHTML = titles[i].innerHTML.replace(lbsToKgRegex, lbsToKg);
      }
    }
    for (let i=0;i<comments.length; i++) {
      if(reverseConverter) {
        comments[i].innerHTML = comments[i].innerHTML.replace(kgToLbsRegex, kgToLbs);
      } else {
        comments[i].innerHTML = comments[i].innerHTML.replace(lbsToKgRegex, lbsToKg);
      }
    }
  }

  convertUnits();
  if (updateForRES) {
    // Updater for RES
    var updater = function () {
      if (!updater.timer) {
        updater.timer = window.setTimeout(function () {
            convertUnits();
            updater.timer = false;
          }, 500);
        }
      };
      new MutationObserver(updater)
      .observe(document.getElementById("siteTable"), { subtree: true, attributes: true, characterData:true });
  }
})();
