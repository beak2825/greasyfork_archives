// ==UserScript==
// @name 2021 Roblox Avatar Editor
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description Brings Back The 2021 Avatar Editor code is by Vue2016 https://userstyles.world/user/Vue2016
// @author Vue2016
// @grant GM_addStyle
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/513173/2021%20Roblox%20Avatar%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/513173/2021%20Roblox%20Avatar%20Editor.meta.js
// ==/UserScript==

(function() {
let css = "";
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
