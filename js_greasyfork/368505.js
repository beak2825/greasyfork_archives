// ==UserScript==
// @name         NativeScript
// @author       Lp
// @version      0.0.5
// @description  LoremLoremLorem.
// @license      MIT License.
// @include *
// @namespace https://greasyfork.org/users/164367
// @downloadURL https://update.greasyfork.org/scripts/368505/NativeScript.user.js
// @updateURL https://update.greasyfork.org/scripts/368505/NativeScript.meta.js
// ==/UserScript==
//***********************************

/**
 * Getnative jQuery Auto Add Translation
 * @param {number} addInterval Add Translation button click interval in seconds
 * @param {number} nextInterval Next button click interval in seconds
 * @param {number} newTranslateInterval Machine Translation button click interval in seconds
 */

function auto(addInterval, nextInterval, newTranslateInterval) {
    // click translate 
    $('.translate-mode-icon').click();

     setTimeout(function() {
         $('.right button').click();
     }, addInterval * 1000);    

     setTimeout(function() {
         $('.next-sentence-translate-view').click();
     }, nextInterval * 1000);

     setTimeout(function() {
         auto(addInterval, nextInterval, newTranslateInterval);
     }, newTranslateInterval * 1000);  
};

auto(2, 2.5, 3);