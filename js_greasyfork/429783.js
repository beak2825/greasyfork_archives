// ==UserScript==
// @name         Confirm and Upload - Imgur
// @namespace    ConfirmandUpload
// @version      5
// @description  Auto clicks on the Confirm and Upload button on Imgur.
// @author       hacker09
// @match        https://imgur.com/*
// @icon         https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://imgur.com/upload&size=64
// @require      https://update.greasyfork.org/scripts/519092/arrivejs%20%28Latest%29.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429783/Confirm%20and%20Upload%20-%20Imgur.user.js
// @updateURL https://update.greasyfork.org/scripts/429783/Confirm%20and%20Upload%20-%20Imgur.meta.js
// ==/UserScript==

(function() {
  'use strict';
  document.arrive('.TosConfirmationDialog-confirm--do', (async function() { //Creates a new async function
    document.querySelector('.TosConfirmationDialog-confirm--do').click(); //Click on the Confirm and Upload button
    Arrive.unbindAllArrive(); //Remove the advent listener arrive for better page performance
  })); //Finishes the async function
})();