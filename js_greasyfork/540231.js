// ==UserScript==
// @name         Hide Promoted Tweets
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically hides promoted tweets on Twitter/X
// @author       Welsh
// @match        *://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540231/Hide%20Promoted%20Tweets.user.js
// @updateURL https://update.greasyfork.org/scripts/540231/Hide%20Promoted%20Tweets.meta.js
// ==/UserScript==

(function () {
  'use strict';

  //Function to detect and remove the promoted tweets
  function removePromoted() {
    const tweets = document.querySelectorAll('article');

    tweets.forEach((tweet) => {
      //looking for promoted text inside tweets
      if (tweet.innerText.includes("Promoted")) {
        tweet.remove();
        console.log("Removed a promoted tweet.");
      }
    });
  }


  //run on load
  window.addEventListener('load', () => {
    setInterval(removePromoted, 2000); //check after every 2 seconds
  });
})();