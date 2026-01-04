// ==UserScript==
// @name        Google Scholar Auto Redirect
// @version     0.1.2
// @author      sincostandx
// @description Automatically redirect to publisher website when there is only one result in a Google Scholar search
// @namespace   https://greasyfork.org/users/171198
// @grant       none
// @match       https://scholar.google.*/scholar*
// @downloadURL https://update.greasyfork.org/scripts/395028/Google%20Scholar%20Auto%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/395028/Google%20Scholar%20Auto%20Redirect.meta.js
// ==/UserScript==

const links = document.querySelectorAll('.gs_rt > a');
if (links.length !== 1)
  return;
if (sessionStorage.getItem(location.href) === null) {
  // Prevent redirection when back button is pressed
  sessionStorage.setItem(location.href,'1');
  links[0].click();
}