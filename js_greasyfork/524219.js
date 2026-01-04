// ==UserScript==
// @name fix Channel Banner for Hitchhiker layouts
// @namespace github.com/openstyles/stylus
// @version 1.0
// @description idk
// @author me
// @grant GM_addStyle
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/524219/fix%20Channel%20Banner%20for%20Hitchhiker%20layouts.user.js
// @updateURL https://update.greasyfork.org/scripts/524219/fix%20Channel%20Banner%20for%20Hitchhiker%20layouts.meta.js
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
