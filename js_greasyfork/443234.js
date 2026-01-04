// ==UserScript==
// @name        Background Youtube Music
// @match       *://music.youtube.com/*
// @version     1.0
// @author      Rowan_CH
// @license MIT
// @description Blocks "visibilitychange" event on the YouTube music webpage, allowing music to still play if the browser or tab are not in focus.
// @namespace https://greasyfork.org/users/901201
// @downloadURL https://update.greasyfork.org/scripts/443234/Background%20Youtube%20Music.user.js
// @updateURL https://update.greasyfork.org/scripts/443234/Background%20Youtube%20Music.meta.js
// ==/UserScript==

document.addEventListener("visibilitychange", function(event) {event.stopImmediatePropagation();}, true);

