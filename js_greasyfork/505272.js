// ==UserScript==
// @name        Google Search Results Redirect Disabler
// @namespace   https://greasyfork.org/en/users/34131-velc-gf
// @version     1.0.1
// @description Prevents Google from tracking the search result links that you clicked
// @author      Velarde, Louie C.
// @match       https://*.google.*/search?*
// @icon        https://www.google.com/s2/favicons?domain=google.com&sz=64
// @license     LGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/505272/Google%20Search%20Results%20Redirect%20Disabler.user.js
// @updateURL https://update.greasyfork.org/scripts/505272/Google%20Search%20Results%20Redirect%20Disabler.meta.js
// ==/UserScript==

let links = document.querySelectorAll('a[data-jsarwt]');
for (let link of links) {
  link.removeAttribute('data-jsarwt');
}