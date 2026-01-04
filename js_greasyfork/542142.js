// ==UserScript==
// @name         Google Sponsored result removal
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Removing google sponsorship from search results
// @author       Marcello Cavazza
// @match        https://www.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542142/Google%20Sponsored%20result%20removal.user.js
// @updateURL https://update.greasyfork.org/scripts/542142/Google%20Sponsored%20result%20removal.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var tries = 0;
    var loop = setInterval(() =>
      {
          var sponsored = document.getElementById('taw');
          if (sponsored != null)
          {
            sponsored.style.display = 'none';
            clearInterval(loop);
            return;
          }
        if (tries == 30)
        {
            clearInterval(loop);
            return;
        }
        tries++;
      },
    1000);
})();