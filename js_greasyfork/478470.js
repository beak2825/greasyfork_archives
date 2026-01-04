// ==UserScript==
// @name         Give Url
// @namespace    http://tampermonkey.net/
// @version      1.1.00
// @description  Gives you website url
// @author       TKTK1234567
// @match        https://*/*
// @match        *.html
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478470/Give%20Url.user.js
// @updateURL https://update.greasyfork.org/scripts/478470/Give%20Url.meta.js
// ==/UserScript==

(function() {
    'use strict';
addEventListener("keydown", (event) => {
  if (event.keyCode === 192) {
    const currentUrl = window.location.href;
      window.alert("The url is: " + currentUrl)
  }
  // do something
})();
    // Your code here...
})();