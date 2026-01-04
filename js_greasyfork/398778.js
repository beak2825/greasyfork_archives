// ==UserScript==
// @name         Auto click youtube pause buttons
// @description  Clicks on the pause buttons of youtube.
// @include      *://*.youtube.com/*
// @version      1
// @grant        none
// @namespace https://greasyfork.org/users/410526
// @downloadURL https://update.greasyfork.org/scripts/398778/Auto%20click%20youtube%20pause%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/398778/Auto%20click%20youtube%20pause%20buttons.meta.js
// ==/UserScript==

setInterval(function() {
    'use strict';
    if (document.getElementById('confirm-button').offsetParent !== null) {
      document.getElementById('confirm-button').click();
      console.log("Pause button clicked");
      return;
    }
  	if (document.getElementById('action-button').offsetParent !== null) {
      document.getElementById('action-button').click();
      console.log("Action button clicked");
      return;
    }
  	
}, 1000)();