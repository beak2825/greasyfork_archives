// ==UserScript==
// @name         HotAir - Axe Allahpundit
// @namespace    https://yournamespace.com/
// @version      0.1
// @description  Remove Allahpundit's posts from HotAir
// @author       You
// @match        https://hotair.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391150/HotAir%20-%20Axe%20Allahpundit.user.js
// @updateURL https://update.greasyfork.org/scripts/391150/HotAir%20-%20Axe%20Allahpundit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var i = 0;
    var thisElement;
    var removed = 0;
    var candidateElements = document.getElementsByClassName('author text-uppercase');

    for (i; i < candidateElements.length; i++) {
        thisElement = candidateElements[i].firstChild;
        if (thisElement.nodeValue == 'Allahpundit') {
            console.log('HotAir: Found an element to remove\n');
            thisElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.remove();
            removed++;
        }
    }

    console.log('HotAir: Removed %d elements\n', removed);
})();