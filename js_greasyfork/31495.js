// ==UserScript==
// @name        Hide Liked Pseudoretweets
// @namespace   https://lrnj.com/monkey
// @description Hide all tweets Twitter inserted in your timeline just because someone liked them.
// @author      Darrell Johnson
// @match       *://*.twitter.com/*
// @version     3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/31495/Hide%20Liked%20Pseudoretweets.user.js
// @updateURL https://update.greasyfork.org/scripts/31495/Hide%20Liked%20Pseudoretweets.meta.js
// ==/UserScript==
// a very small edit of "Hide Retweets" 0.4 by Drazen Bjelovuk
// https://greasyfork.org/en/scripts/17553-hide-retweets
// my first *Monkey script... I don't know what I'm doing, but it seems to work

var css = document.createElement("style");
css.type = "text/css";
css.innerHTML = "div[data-component-context=\"suggest_activity_tweet\"] { display: none }";

document.head.appendChild(css);