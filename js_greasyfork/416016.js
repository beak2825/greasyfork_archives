// ==UserScript==
// @name mozz.us Gemini portal - solarized dark
// @namespace https://greasyfork.org/users/3759
// @version 1.01
// @description A theme based on Ethan Schoonover's Solarized colorscheme.
// @license CC-0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.portal.mozz.us/*
// @downloadURL https://update.greasyfork.org/scripts/416016/mozzus%20Gemini%20portal%20-%20solarized%20dark.user.js
// @updateURL https://update.greasyfork.org/scripts/416016/mozzus%20Gemini%20portal%20-%20solarized%20dark.meta.js
// ==/UserScript==

(function() {
let css = `

body {
    background: #002b36;
    color: #fdf6e3;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

div {
    background: #073642;
    padding: 1em 0.5em;
    margin: -1em 0;
  }

input {
    background: #002b36;
    color: #fdf6e3;
    border-color: #586e75;
  }

table, td {
    border-color: #586e75;
  }

a {
    color: #268bd2;
  }

a:active {
    color: #dc322f;
  }

a:visited {
    color: #6c71c4;
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
