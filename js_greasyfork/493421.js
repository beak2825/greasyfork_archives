// ==UserScript==
// @name        Twitch Video Logger
// @namespace   MegaPiggy
// @match       https://www.twitch.tv/*/clip/*
// @include     https://www.twitch.tv/*/clip/*
// @version     1.0
// @author      MegaPiggy
// @license     MIT
// @description Logs the video source in the console
// @downloadURL https://update.greasyfork.org/scripts/493421/Twitch%20Video%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/493421/Twitch%20Video%20Logger.meta.js
// ==/UserScript==

(function () {
  'use strict';
  console.log(document.getElementsByTagName("video")[0].src);
})();