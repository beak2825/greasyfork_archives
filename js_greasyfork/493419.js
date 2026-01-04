// ==UserScript==
// @name        Twitter No Media Sensitive
// @namespace   MegaPiggy
// @match       https://twitter.com/*/media
// @match       https://x.com/*/media
// @include     https://twitter.com/*/media
// @include     https://x.com/*/media
// @version     1.0
// @author      MegaPiggy
// @license     MIT
// @description Stops the silly sensitive content censor
// @downloadURL https://update.greasyfork.org/scripts/493419/Twitter%20No%20Media%20Sensitive.user.js
// @updateURL https://update.greasyfork.org/scripts/493419/Twitter%20No%20Media%20Sensitive.meta.js
// ==/UserScript==


(function () {
  'use strict';

    function clicker(item) {
      if (item.textContent === 'Show'){
        item.click();
        item.children[0].click();
      }
    }

    function runScript() {
      for (const element of document.getElementsByClassName("r-1loqt21")) {
        clicker(element);
      }
    }

    runScript();
    setInterval(runScript, 1000);
})();