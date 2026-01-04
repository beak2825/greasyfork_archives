// ==UserScript==
// @name Global light style - changes everything to LIGHT
// @namespace https://greasyfork.org/users/16594
// @version 20250215
// @description Converts all websites to a light theme.
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/526780/Global%20light%20style%20-%20changes%20everything%20to%20LIGHT.user.js
// @updateURL https://update.greasyfork.org/scripts/526780/Global%20light%20style%20-%20changes%20everything%20to%20LIGHT.meta.js
// ==/UserScript==

(function() {
let css = `html {
    background: #fff !important;
}

/*----- DEFAULT TEXT, BORDER & BACKGROUND COLORS -----*/
* {
    color: #000 !important;
    text-shadow: 0 0 2px #FFF !important;
    box-shadow: none !important;
    background-color: transparent !important;
    border-color: #CCC !important;
}

body {
    background: transparent !important;
}

*:before, *:after {
    background-color: transparent !important;
    border-color: #DDD !important;
}

a, a * {
    color: #0066CC !important;
    text-decoration: none !important;
}

a:hover, a:hover * {
    color: #003399 !important;
}

a:visited, a:visited * {
    color: #94017f !important;
}

a.highlight, a.active, .selected, .selected * {
    color: #222 !important;
    font-weight: bold !important;
}

h1, h2, h3, h4, h5, h6, strong {
    color: #222 !important;
}

/*----- SELECTION COLORS -----*/
::-moz-selection {
    background: #CCE5FF !important;
    color: #000 !important;
}

::selection {
    background: #CCE5FF !important;
    color: #000 !important;
}

:focus {
    outline: none !important;
}

/*----- MENU & PANEL BACKGROUNDS -----*/
div[style="display: block;"], div[role="navigation"] {
    background: rgba(255, 255, 255, 0.9) !important;
}

table {
    background: rgba(255, 255, 255, 0.8) !important;
    border-radius: 6px !important;
}

table > tbody > tr:nth-child(even) {
    background-color: rgba(240, 240, 240, 0.7) !important;
}

header, #header, footer, #footer {
    background: rgba(245, 245, 245, 0.9) !important;
    box-shadow: 0 0 5px #AAA !important;
}

[id*="overlay"], [id*="lightbox"], blockquote {
    background-color: rgba(255, 255, 255, 0.95) !important;
}

/*----- BUTTONS, INPUTS & FORMS -----*/
input, select, button, [role="button"], a.button {
    background: #EEE !important;
    color: #333 !important;
    border: 2px solid #BBB !important;
    border-radius: 4px !important;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.1) !important;
}

input:hover, select:hover, button:hover {
    border: 2px solid #999 !important;
}

input:focus, select:focus {
    box-shadow: 0 0 5px #66B !important;
}

button:active, input[type="submit"]:active, input[type="button"]:active {
    background: #DDD !important;
    color: #222 !important;
}

/*----- TEXTAREAS -----*/
textarea {
    background: rgba(255, 255, 255, 0.9) !important;
    border: 1px solid #BBB !important;
    border-radius: 3px !important;
}

textarea, textarea * {
    color: #222 !important;
}

textarea:hover, textarea:focus:hover {
    border-color: #888 !important;
}

textarea:focus {
    background: rgba(255, 255, 255, 1) !important;
    border-color: #666 !important;
}

/*----- CHECKBOXES & RADIO BUTTONS -----*/
input[type="checkbox"], input[type="radio"] {
    border: 2px solid #666 !important;
    background: #FFF !important;
    box-shadow: 0 0 2px #AAA !important;
}

input[type="checkbox"]:checked, input[type="radio"]:checked {
    background: #0099FF !important;
    border-color: #0066CC !important;
    box-shadow: 0 0 5px #0099FF !important;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
