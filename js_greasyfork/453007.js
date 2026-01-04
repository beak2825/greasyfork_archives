// ==UserScript==
// @name Archive Of Our Own - Scrolling Tag List
// @namespace https://greasyfork.org/users/3759
// @version 1.001
// @description Shortens the list of tags on /works lists and allows scrolling to see the overflow.
// @license CC-0
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/453007/Archive%20Of%20Our%20Own%20-%20Scrolling%20Tag%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/453007/Archive%20Of%20Our%20Own%20-%20Scrolling%20Tag%20List.meta.js
// ==/UserScript==

(function() {
let css = `ul.tags.commas {
	max-height: 100px; /* Adjust as desired to make the list taller or shorter.*/
	overflow: scroll;
}

h5.fandoms.heading {
	max-height: 5em; /* Adjust as desired to make the list taller or shorter.*/
	overflow: scroll;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
