// ==UserScript==
// @name        adElementRemover
// @namespace   adElementRemover
// @match       https://outlook.live.com/*
// @grant       none
// @version     2.03
// @author      -
// @description 2/21/2023, 5:31:23 p.m.
//
// @downloadURL https://update.greasyfork.org/scripts/460478/adElementRemover.user.js
// @updateURL https://update.greasyfork.org/scripts/460478/adElementRemover.meta.js
// ==/UserScript==

console.log("UserScript Loaded");

function runWhenReady(readySelector) {
  console.log("Entering Script");
  var numAttempts = 0;
  console.log(numAttempts);
  var tryNow = function () {
    var elem = document.querySelector(readySelector);
    console.log(elem);
    if (elem) {
      elem.remove();
    } else {
      numAttempts++;
      if (numAttempts >= 34) {
        console.warn(
          "Giving up after 34 attempts. Could not find: " + readySelector
        );
      } else {
        setTimeout(tryNow, 250 * Math.pow(1.1, numAttempts));
      }
    }
  };
  console.log("tryNow fucn exec");
  tryNow();
}

runWhenReady(".GssDD");
runWhenReady(".Ogqyq");
setTimeout( runWhenReady(".CCkr1") , 10000) ;