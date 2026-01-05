// ==UserScript==
// @name        Add accesskey shortcut to Google search
// @namespace   tpenguinltg
// @description Adds accesskey+f as shortcut for accessing Google search bar
// @include     https://www.google.*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19554/Add%20accesskey%20shortcut%20to%20Google%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/19554/Add%20accesskey%20shortcut%20to%20Google%20search.meta.js
// ==/UserScript==

var searchBar = document.querySelector("input[name=q]");
if (searchBar) {
  searchBar.accessKey="f";
}
