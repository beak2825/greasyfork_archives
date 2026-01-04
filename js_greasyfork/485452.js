// ==UserScript==
// @name        4 column results
// @namespace   Violentmonkey Scripts
// @match       https://www.microcenter.com/search/search_results.aspx*
// @grant       none
// @version     1.0
// @author      DPASK
// @description 1/22/2024, 10:27:51 AM
// @downloadURL https://update.greasyfork.org/scripts/485452/4%20column%20results.user.js
// @updateURL https://update.greasyfork.org/scripts/485452/4%20column%20results.meta.js
// ==/UserScript==

document.head.appendChild(document.createElement('style')).textContent = `
  #productGrid.col3 ul li {
    width: calc(25% - 3px);
  }
`;