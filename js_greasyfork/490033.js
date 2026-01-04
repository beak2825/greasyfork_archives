// ==UserScript==
// @name         Auto Convert after upload on ezgif
// @namespace    https://github.com/AbdurazaaqMohammed
// @version      1.0
// @author       Abdurazaaq Mohammed
// @description  Automatically clicks the convert button after you upload an image to ezgif to convert
// @match        https://ezgif.com/*/*.*
// @grant        none
// @homepage     https://github.com/AbdurazaaqMohammed/userscripts
// @license      The Unlicense
// @supportURL   https://github.com/AbdurazaaqMohammed/userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/490033/Auto%20Convert%20after%20upload%20on%20ezgif.user.js
// @updateURL https://update.greasyfork.org/scripts/490033/Auto%20Convert%20after%20upload%20on%20ezgif.meta.js
// ==/UserScript==

//check if the result image is there. The convert button remains after converting so we can't just check for that

(function() {
  'use strict';
  setTimeout( function(){
  const form = document.querySelector(".primary.btn"); //submit button
  if(form) {
    if(!document.querySelector("#output").querySelector('img')) {
      form.click();
    }
  }}, 500);
})();
