// ==UserScript==
// @name YouTube - Remove clickable labels on "Watch Later" and "Add to Queue" buttons
// @namespace lednerg
// @version 21.3.7
// @description Removes those annoying, clickable labels on the "Watch Later" and "Add to Queue" buttons so you won't accidentally click on them.
// @author lednerg
// @license CC-BY-NC-SA-4.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/422843/YouTube%20-%20Remove%20clickable%20labels%20on%20%22Watch%20Later%22%20and%20%22Add%20to%20Queue%22%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/422843/YouTube%20-%20Remove%20clickable%20labels%20on%20%22Watch%20Later%22%20and%20%22Add%20to%20Queue%22%20buttons.meta.js
// ==/UserScript==

(function() {
let css = `
 
    div#hover-overlays div#label-container {
        display: none !important;
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
