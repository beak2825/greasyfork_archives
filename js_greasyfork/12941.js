// ==UserScript==
// @name        Remove "Search Google Keep" Text
// @namespace   n/a
// @description Removes placeholder text from search bar in google keep.
// @include     *keep.google.com*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12941/Remove%20%22Search%20Google%20Keep%22%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/12941/Remove%20%22Search%20Google%20Keep%22%20Text.meta.js
// ==/UserScript==

document.getElementById("gbqfq").placeholder = "";