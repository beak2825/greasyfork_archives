// ==UserScript==
// @name         purple sandbox
// @namespace    Indow
// @version      0.1
// @description  sandbox mat2 purple bg
// @author       mat
// @match        https://cs27.salesforce.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21369/purple%20sandbox.user.js
// @updateURL https://update.greasyfork.org/scripts/21369/purple%20sandbox.meta.js
// ==/UserScript==

(function() {
    'use strict';
document.getElementsByClassName('sfdcBody')[0].style["background-color"] = "purple";
    // Your code here...
})();