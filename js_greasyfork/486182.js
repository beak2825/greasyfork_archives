// ==UserScript==
// @name         Boring Training
// @namespace    http://tampermonkey.net/
// @version      2024-02-01
// @description  Defeat required and painstakingly boring training from NYC
// @author       Santa Caluse
// @match        https://www.nyc.gov/assets/cchr/training/english/index.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nyc.gov
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486182/Boring%20Training.user.js
// @updateURL https://update.greasyfork.org/scripts/486182/Boring%20Training.meta.js
// ==/UserScript==

(function() {
    'use strict';
     console.log('a');


        // Execute the function with a slight delay to ensure the button is present in the DOM.
        setTimeout(function(){
         console.log('c');
         window.cp.PB.mainMovie.jumpToFrame(88000);
         }, 5000); // Adjust the delay as needed.


})();