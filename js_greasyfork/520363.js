// ==UserScript==
// @name        Open short as normal YouTube video via userscript menu
// @namespace   https://github.com/AbdurazaaqMohammed/userscripts
// @version     1.0
// @description Adds button in userscript manager on YouTube shorts to open current short as normal YouTube video
// @match       https://www.youtube.com/shorts/*
// @grant       GM_registerMenuCommand
// @license     The Unlicense
// @homepage    https://github.com/AbdurazaaqMohammed/userscripts
// @supportURL  https://github.com/AbdurazaaqMohammed/userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/520363/Open%20short%20as%20normal%20YouTube%20video%20via%20userscript%20menu.user.js
// @updateURL https://update.greasyfork.org/scripts/520363/Open%20short%20as%20normal%20YouTube%20video%20via%20userscript%20menu.meta.js
// ==/UserScript==

(function() {
  'use strict';

  GM_registerMenuCommand('Go To Normal Video', function () {
    const regularVideoUrl = window.location.href.replace('shorts/', 'watch?v=');
    window.location.href = regularVideoUrl;
    // Comment/remove the above line and uncomment the below to open in a new tab rather than replacing the current page.
    //window.open(regularVideoUrl);
  });
})();