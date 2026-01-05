// ==UserScript==
// @name         Confirm SoundCloud leave (Alpha)
// @namespace    https://brennced.github.io/
// @version      0.1
// @description  Shows a confirm box when closing SoundCloud tab.
// @author       Brennced
// @match        https://soundcloud.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22180/Confirm%20SoundCloud%20leave%20%28Alpha%29.user.js
// @updateURL https://update.greasyfork.org/scripts/22180/Confirm%20SoundCloud%20leave%20%28Alpha%29.meta.js
// ==/UserScript==

(function(){window.onbeforeunload=function(){return"Are you sure you want to leave? Your music will stop";};})();