// ==UserScript==
// @name         Search Bar Autofocus
// @version      1.0.1
// @description  Focus the youtube search bar. time saved  is time saved.
// @author       steffanossa
// @match        https://www.youtube.com/
// @match        https://greasyfork.org/
// @match        https://greasyfork.org/de
// @grant        none
// @namespace https://greasyfork.org/users/1168376
// @downloadURL https://update.greasyfork.org/scripts/487852/Search%20Bar%20Autofocus.user.js
// @updateURL https://update.greasyfork.org/scripts/487852/Search%20Bar%20Autofocus.meta.js
// ==/UserScript==

(function() {
    'use strict';
  console.log("hi");
  if (document.querySelector('input[type=search]') != null)
    document.querySelector('input[type=search]').focus();
  


})();