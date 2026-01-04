// ==UserScript==
// @name         Numéro de compte - Focus
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @license MIT
// @description  Ce script permet de focus la barre de recherche de numéro de compte.
// @author       You
// @match        *.praxedo.com/eTech/displayAccountList.do
// @icon         https://www.google.com/s2/favicons?sz=64&domain=praxedo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499493/Num%C3%A9ro%20de%20compte%20-%20Focus.user.js
// @updateURL https://update.greasyfork.org/scripts/499493/Num%C3%A9ro%20de%20compte%20-%20Focus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector("input[type='submit']").click()
    // Your code here...
})();