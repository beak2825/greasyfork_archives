// ==UserScript==
// @name         JPDB Stroke Order Remover
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Removes stroke order on JPDB Kanji
// @author       Oian
// @match        https://jpdb.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jpdb.io
// @grant        none
// @license      CC BY 4.0
// @downloadURL https://update.greasyfork.org/scripts/491747/JPDB%20Stroke%20Order%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/491747/JPDB%20Stroke%20Order%20Remover.meta.js
// ==/UserScript==

(function() {
    // Function to remove or hide stroke order elements
    function removeStrokeOrder() {
        var strokeOrderElements = document.querySelectorAll('.sn-bg, .sn-d, .sn');
        strokeOrderElements.forEach(function(element) {
            element.style.display = 'none';
        });
    }
    
    // Function to repeatedly call the removeStrokeOrder function every second
    function triggerRemovalEverySecond() {
        setInterval(removeStrokeOrder, 1000); // 1000 milliseconds = 1 second
    }
    
    // Call the function to trigger removal every second
    triggerRemovalEverySecond();
})();
