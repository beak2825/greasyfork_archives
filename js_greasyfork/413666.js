// ==UserScript==
// @name         Torn Travel OC Warning
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Give a prominent warning, when you enter travel page, and an OC is ready (or almost ready)
// @author       kontamusse
// @match        http*://www.torn.com/travelagency.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413666/Torn%20Travel%20OC%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/413666/Torn%20Travel%20OC%20Warning.meta.js
// ==/UserScript==

(function() {
   'use strict';

   var span = document.getElementsByClassName("t-red")[0]
   alert( span.innerText ) ;
})();