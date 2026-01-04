// ==UserScript==
// @name         Bir eimor suggestion
// @namespace    http://token.com
// @version      2.2
// @description  recommendation suggestion bar.
// @author       John Park
// @match        https://*.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422360/Bir%20eimor%20suggestion.user.js
// @updateURL https://update.greasyfork.org/scripts/422360/Bir%20eimor%20suggestion.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    window.addEventListener("load", function () {
        var divElement = document.querySelector("#secondary-inner")
        divElement.remove();
 
    }, false)
})();