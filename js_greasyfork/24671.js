// ==UserScript==
// @name        GitHub night mode with reversed colors
// @description Blindlingly white backgrounds at night? No problem, tiny and futureproof.
// @namespace   https://greasyfork.org/users/4813-swyter
// @match       *://github.com/*
// @version     3
// @grant       GM_addStyle
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/24671/GitHub%20night%20mode%20with%20reversed%20colors.user.js
// @updateURL https://update.greasyfork.org/scripts/24671/GitHub%20night%20mode%20with%20reversed%20colors.meta.js
// ==/UserScript==

GM_addStyle
(`
  html
  {
    background-color: white;
    color: black;
    filter: contrast(110%) invert(85%) hue-rotate(90deg);
  }

  img
  {
    filter: invert(125%) hue-rotate(-90deg);
  }

  /* swy: the header is now dark; so more hacks */

  div.header[role=banner]
  {
    filter: invert(85%);
    z-index: 40000;
  }

  div.header[role=banner] img
  {
    filter: hue-rotate(265deg);
  }

  div.header[role=banner] div.dropdown-menu
  {
    filter: invert(85%);
  }
`)

/* swy: fix the weird left cutoff edge in the original page's logo */
document.addEventListener('DOMContentLoaded', function()
{
  if ((logo = document.querySelector("a.header-logo-invertocat svg.octicon-mark-github")))
    logo.viewBox.baseVal.height = 17; /* swy: was 16 */
});