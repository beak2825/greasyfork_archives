// ==UserScript==
// @name         Rent First
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Moves rent to the top on Numbeo's Cost of Living calculator
// @author       https://github.com/NoahBPeterson
// @match        https://www.numbeo.com/cost-of-living/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507576/Rent%20First.user.js
// @updateURL https://update.greasyfork.org/scripts/507576/Rent%20First.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var table_children = document.getElementsByClassName("category_title")[7].parentElement.parentElement.parentElement.children;
    for (let i = 0; i < 5; i++) {
        document.getElementsByClassName("category_title")[7].parentElement.parentElement.parentElement.insertBefore(table_children[58], document.getElementsByClassName("category_title")[7].parentElement.parentElement.parentElement.firstChild);
    }
})();