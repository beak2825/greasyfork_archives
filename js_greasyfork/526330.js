// ==UserScript==
// @name www.roblox.com/users/1/profile
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description A new userstyle
// @author Me
// @grant GM_addStyle
// @run-at document-start
// @match https://www.roblox.com/users/1/profile*
// @downloadURL https://update.greasyfork.org/scripts/526330/wwwrobloxcomusers1profile.user.js
// @updateURL https://update.greasyfork.org/scripts/526330/wwwrobloxcomusers1profile.meta.js
// ==/UserScript==

(function() {
let css = `

 /* E */

`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
