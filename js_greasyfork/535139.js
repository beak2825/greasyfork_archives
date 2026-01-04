// ==UserScript==
// @name         quizlet paywall remover
// @namespace    http://quizlet.com/
// @version      2025-05-06
// @description  Kill the paywall
// @author       smshxrae
// @match        https://quizlet.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535139/quizlet%20paywall%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/535139/quizlet%20paywall%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var currentURL = window.location.href;
    var match = currentURL.match(/quizlet\.com\/explanations/i);
    if(match){
        let elements = document.getElementsByClassName('o3dpi86 pxrylku');
        if (elements.length > 0) {
            elements[0].remove(); // Removes the first matching element
        }
        let elements2 = document.getElementsByClassName('LoginWall wugyavo');
        if (elements2.length > 0) {
            elements2[0].remove(); // Removes the first matching element
        }
        let elements3 = document.getElementsByClassName('b1xkd811');
        while (elements3.length > 0) {
            elements3[0].className = 'my-new-class'; // Overwrites all existing classes
        }
    }

})();