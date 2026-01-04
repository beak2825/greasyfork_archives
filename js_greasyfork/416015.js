// ==UserScript==
// @name mozz.us Gemini portal - solarized light
// @namespace https://greasyfork.org/users/3759
// @version 1.01
// @description A theme based on Ethan Schoonover's Solarized colorscheme.
// @license CC-0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.portal.mozz.us/*
// @downloadURL https://update.greasyfork.org/scripts/416015/mozzus%20Gemini%20portal%20-%20solarized%20light.user.js
// @updateURL https://update.greasyfork.org/scripts/416015/mozzus%20Gemini%20portal%20-%20solarized%20light.meta.js
// ==/UserScript==

(function() {
let css = `

body {
    background: #eee8d5;
    color: #002b36;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

div {
    background: #fdf6e3;
    padding: 1em 0.5em;
    margin: -1em 0;
  }

input {
    background: #eee8d5;
    color: #002b36;
    border-color: #93a1a1;
  }

table, td {
    border-color: #93a1a1;
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
