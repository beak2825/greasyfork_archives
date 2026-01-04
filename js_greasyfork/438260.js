// ==UserScript==
// @name         Redirect to imgur
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      2
// @description  Seaching for imgur on google auto redirects to https://imgur.com/upload/
// @author       hacker09
// @include      *://www.google.*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://www.google.com&size=64
// @run-at       document-start
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/438260/Redirect%20to%20imgur.user.js
// @updateURL https://update.greasyfork.org/scripts/438260/Redirect%20to%20imgur.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if (location.href.match('imgur') !== null) { //Starts the if condition
    location.href = 'https://imgur.com/upload/'; //Redirect to https://imgur.com/upload/
  } //Finishes the if condition
})();