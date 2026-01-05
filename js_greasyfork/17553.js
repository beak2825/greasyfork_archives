// ==UserScript==
// @name            Hide Retweets
// @version         0.4
// @description     Hide all retweets from Twitter feed
// @author          Drazen Bjelovuk
// @match           *://*.twitter.com/*
// @grant           none
// @noframes
// @run-at          document-start
// @namespace       https://greasyfork.org/users/11679
// @contributionURL https://goo.gl/dYIygm
// @downloadURL https://update.greasyfork.org/scripts/17553/Hide%20Retweets.user.js
// @updateURL https://update.greasyfork.org/scripts/17553/Hide%20Retweets.meta.js
// ==/UserScript==

var css = document.createElement("style");
css.type = "text/css";
css.innerHTML = "div[data-retweeter] { display: none }";

document.head.appendChild(css);