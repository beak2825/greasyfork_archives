// ==UserScript==
// @name         HNU AutoCpp
// @namespace    http://hnulib.xyz
// @version      0.2
// @description  Make it smiple to submit your code in HNU CG system.
// @author       Archen
// @match        http://202.197.98.89/assignment/*
// @icon         http://202.197.98.89/images/cgicon.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450319/HNU%20AutoCpp.user.js
// @updateURL https://update.greasyfork.org/scripts/450319/HNU%20AutoCpp.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var select = document.getElementById("languages");
    select.value = "c++";
})();