// ==UserScript==
// @name         Advent of Code Mobile View
// @namespace    http://tampermonkey.net/
// @version      0.3.0
// @description  Try to make AoC days easier to view on mobile.
// @license MIT
// @author       myklosbotond
// @match        https://adventofcode.com/*/day/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=adventofcode.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/482744/Advent%20of%20Code%20Mobile%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/482744/Advent%20of%20Code%20Mobile%20View.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
body {
  min-width: min(60em, 100vw);
  max-width: 100vw;
}

@media only screen and (max-width: 600px) {
  header {
    overflow: auto;
  }

  #sidebar {
    float: none;
    border-top: 1px solid white;
    width: 100%;
    margin: 0;
    padding: 10px 0 0;
  }
}

main {
  max-width: 100vw;
}

main article, main p {
  max-width: 100%;
}

span[title] {
  outline: 1px dashed gold;
  outline-offset: 2px;
  line-height: calc(1em + 10px);
}

span[title]::after {
  content: ' (' attr(title) ')';
  font-size: .8em;
}
    `);

    document.head.innerHTML += `<meta name="viewport" content="width=device-width, initial-scale=${1}">`;

    if (window.innerWidth < 600) {
        document.body.appendChild(document.getElementById("sidebar"));
    }
})();