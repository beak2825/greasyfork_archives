// ==UserScript==
// @name     Crunchyroll Adblock Fix
// @namespace   nkfarwell.com
// @description Defeats AdBlock detecter on crunchyroll
// @include	 https://*.crunchyroll.com/*
// @version  1
// @downloadURL https://update.greasyfork.org/scripts/382136/Crunchyroll%20Adblock%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/382136/Crunchyroll%20Adblock%20Fix.meta.js
// ==/UserScript==

  var ipaidforpremium = function() {
      var suckItTrebeck = new CustomEvent('SEGMENT_IDENTIFY_EXECUTED', {detail: {segment_anonymous_id: 42}});
      document.dispatchEvent(suckItTrebeck);
  };
  
  var playthedamnvideo = document.createElement('script');
  playthedamnvideo.appendChild(document.createTextNode('('+ ipaidforpremium +')();'));
  (document.body || document.head || document.documentElement).appendChild(playthedamnvideo);