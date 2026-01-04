// ==UserScript==
// @name         fix ugly youtube player
// @namespace    John R.
// @version      0.1
// @description  downsizes the buttons in the youtube player
// @author       John R.
// @match        https://www.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433444/fix%20ugly%20youtube%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/433444/fix%20ugly%20youtube%20player.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function fixPlayer () {
document.querySelector(".ytp-exp-bigger-button-like-mobile").setAttribute("class","html5-video-player ytp-transparent ytp-hide-info-bar")
}


function waitForElementToDisplay(selector, callback, checkFrequencyInMs, timeoutInMs) {
  var startTimeInMs = Date.now();
  (function loopSearch() {
    if (document.querySelector(selector) != null) {
      callback();
      return;
    }
    else {
      setTimeout(function () {
        if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs)
          return;
        loopSearch();
      }, checkFrequencyInMs);
    }
  })();
}

waitForElementToDisplay(`.ytp-exp-bigger-button-like-mobile`,function(){fixPlayer();},1000,20000);
})();