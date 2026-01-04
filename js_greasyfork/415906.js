// ==UserScript==
// @name Pin Comments Form to window
// @namespace https://greasyfork.org/en/users/703495
// @version 1.1
// @description Pin the Fimfiction comments form to the bottom of the window
// @author @YR Foxtaur
// @license CC-BY 4.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.fimfiction.net/*
// @downloadURL https://update.greasyfork.org/scripts/415906/Pin%20Comments%20Form%20to%20window.user.js
// @updateURL https://update.greasyfork.org/scripts/415906/Pin%20Comments%20Form%20to%20window.meta.js
// ==/UserScript==

(function() {
let css = `
/*pin rule*/
  #add_comment_box
  {
    position: sticky !important;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 5;
    margin-bottom: 0 !important;
  }

/*autoscroll kill*/
  #new_comment
  {
    position: fixed !important;
    top: 0 !important;
    right: 0;
  }

/*[[compactify]]*/
/*Collapse Rules*/
  #add_comment_box #comment_comment
  {
    display: none !important;
  }

  #add_comment_box:hover #comment_comment
  {
    display: block !important;
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
