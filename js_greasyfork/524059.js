// ==UserScript==
// @name Hacker News Comment Indentation Colours
// @namespace https://greasyfork.org/users/16594
// @version 0.0.1.20250117154736
// @description Adds an edge next to comments, in differing colours depending on the comment depth
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/524059/Hacker%20News%20Comment%20Indentation%20Colours.user.js
// @updateURL https://update.greasyfork.org/scripts/524059/Hacker%20News%20Comment%20Indentation%20Colours.meta.js
// ==/UserScript==

(function() {
let css = `.ind[indent="0"] {
  border-right: solid 5px #ff6600;
}
.ind[indent="1"] {
  border-right: solid 5px #ffc800;
}
.ind[indent="2"] {
  border-right: solid 5px #a6ff00;
}
.ind[indent="3"] {
  border-right: solid 5px #00ff9d;
}
.ind[indent="4"] {
  border-right: solid 5px #00eaff;
}
.ind[indent="5"] {
  border-right: solid 5px #007bff;
}
.ind[indent="6"] {
  border-right: solid 5px #5100ff;
}
.ind[indent="7"] {
  border-right: solid 5px #bf00ff;
}
.ind[indent="8"] {
  border-right: solid 5px #f09;
}
.ind[indent="9"] {
  border-right: solid 5px #ff0015;
}
.ind {
  border-right: solid 5px #000;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
