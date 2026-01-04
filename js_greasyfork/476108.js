// ==UserScript==
// @name         all4 adblocker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  a non detected ad blocker for all4/channel4
// @author       chard15
// @match        https://www.channel4.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=channel4.com
// @grant        none
// @license      chard
// @downloadURL https://update.greasyfork.org/scripts/476108/all4%20adblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/476108/all4%20adblocker.meta.js
// ==/UserScript==

(function() {
    'use strict';


function clearSrc() {

  var freewheelPlayer = document.getElementById('freewheelPlayer');


  if (freewheelPlayer) {

    freewheelPlayer.src = '';
  } else {
    console.log("no ad found");
  }
}


setInterval(clearSrc, 10);

})();