"use strict";

// ==UserScript==
// @name        GitHub large fonts
// @description Change all GitHub repository and gist pages to be full width and dynamically sized
// @version     0.0.4
// @namespace   http://tampermonkey.net/
// @license     MIT
// @match       https://github.com/*
// @match       https://gist.github.com/*
// @downloadURL https://update.greasyfork.org/scripts/494522/GitHub%20large%20fonts.user.js
// @updateURL https://update.greasyfork.org/scripts/494522/GitHub%20large%20fonts.meta.js
// ==/UserScript==

var styleSheet = "" +
".comment-body {" +
  "font-size: 1em;" +
"}" +
".markdown-body {" +
  "font-size: 1em;" +
"}" +
"code {" +
  "font-size: 1em;" +
"}" +
".TimelineItem-body {" +
  "font-size: 1em;" +
"}" +
"body, table, thead, th, td, tr {" +
  "font-size: 1em;" +
"}" +

"";

(function () {
  var s = document.createElement('style');
  s.type = "text/css";
  s.innerHTML = styleSheet;
  (document.head || document.documentElement).appendChild(s);
})();
