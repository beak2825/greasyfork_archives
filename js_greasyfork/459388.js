// ==UserScript==
// @name        Twitter Blue Be Gone
// @namespace   Violentmonkey Scripts
// @match       https://twitter.com/*
// @grant       none
// @version     1.1
// @author      SanaRinomi
// @description 03/02/2023, 00:56:41
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/459388/Twitter%20Blue%20Be%20Gone.user.js
// @updateURL https://update.greasyfork.org/scripts/459388/Twitter%20Blue%20Be%20Gone.meta.js
// ==/UserScript==


(function() {
    'use strict';

    let twitterBlued = false;
    let blueRemoved = false;
    var starter = setInterval(() => {

      let blue = document.querySelectorAll("a[href='/i/twitter_blue_sign_up']");

      if(!twitterBlued && blue) {
        console.log("Twitter Blue! >:(");
        twitterBlued = true;
      }

      blue = blue ? blue[0] : null;
      let hasClass = blue.getAttribute("style") === "display:none"

      if(blue && !hasClass) {
        blueRemoved = false;
        blue.setAttribute("style", "display:none");
      } else if(blue && !blueRemoved && twitterBlued) {
        console.log("No Twitter Blue~! :3");
        blueRemoved = true;
        clearInterval(starter);
      }

    }, 1000);

})();