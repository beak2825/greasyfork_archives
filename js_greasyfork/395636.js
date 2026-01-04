// ==UserScript==
// @name           Yes, C-SPAN, I'm Still Watching!
// @description    Prevents timeout popup from interrupting playback.
// @version        0.0.1
// @author         okradonkey
// @namespace      okradonkey
// @icon           https://static.thenounproject.com/png/1939987-200.png
// @match          https://www.c-span.org/networks/*
// @downloadURL https://update.greasyfork.org/scripts/395636/Yes%2C%20C-SPAN%2C%20I%27m%20Still%20Watching%21.user.js
// @updateURL https://update.greasyfork.org/scripts/395636/Yes%2C%20C-SPAN%2C%20I%27m%20Still%20Watching%21.meta.js
// ==/UserScript==

$("#brightcove-player-embed").data('skipbctimeout',true);
console.log("Yes, C-SPAN, I'm Still Watching!  Timeouts removed.");

