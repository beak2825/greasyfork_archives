// ==UserScript==
// @name Twitch Restore Font
// @namespace https://greasyfork.org/users/692488
// @version 1.0
// @description Restores original font for twitch.tv
// @grant GM_addStyle
// @run-at document-start
// @include /^(?:https?:\/\/(.+?\.)?twitch\.tv\/?(.+)?)$/
// @downloadURL https://update.greasyfork.org/scripts/412466/Twitch%20Restore%20Font.user.js
// @updateURL https://update.greasyfork.org/scripts/412466/Twitch%20Restore%20Font.meta.js
// ==/UserScript==

(function() {
let css = `
 body {
  --font-base: Roobert,Helvetica Neue,Helvetica,Arial,sans-serif;
 }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
