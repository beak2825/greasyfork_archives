// ==UserScript==
// @name        dogecoin picture killer for Twitter
// @namespace   Violentmonkey Scripts
// @match       https://*.twitter.com/*
// @license     MIT
// @grant       none
// @version     1.3
// @author      -
// @description 04/04/2023 11:00:07
// @downloadURL https://update.greasyfork.org/scripts/463233/dogecoin%20picture%20killer%20for%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/463233/dogecoin%20picture%20killer%20for%20Twitter.meta.js
// ==/UserScript==

function ConsolePrint(message){
  var startTime = new Date();
  console.log('[DOGECOIN-KILLER] '+ startTime.toLocaleTimeString() + ' ' + message) ;
}

ConsolePrint("RUN")

/* On cherche une image de height="115" */

function SearchDogeCoin(){
  var images = document.getElementsByTagName('image');
  for (var i = 0; i < images.length; ++i) {
    images[i].style.display = 'none';
  }
}

/* Application */

if (self == top) { /* run only in the top frame. we do our own frame parsing */
  ConsolePrint('STARTED');
  setInterval(SearchDogeCoin, 3000);
}

