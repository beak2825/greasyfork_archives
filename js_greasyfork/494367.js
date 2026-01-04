// ==UserScript==
// @name         Ascending Size - RARGB
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      3
// @description  Automatically sorts links using the ascending size order.
// @author       hacker09
// @include      https://rargb.to/search/?search=*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://rargb.to
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494367/Ascending%20Size%20-%20RARGB.user.js
// @updateURL https://update.greasyfork.org/scripts/494367/Ascending%20Size%20-%20RARGB.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if (location.href.match('&order=') === null) { //Starts the if condition
    location.href += '&order=size&by=ASC'; //Replace the URL
  } //Finishes the if condition
})();