// ==UserScript==
// @name         Mangago Multi Pages/Full Load Fix
// @version      0.1.2
// @description  When loading all pages on Mangago through the "multi pages" option, remove spaces between images for a better experience. Works on full page load so may be delayed for 2-3 seconds before fixing.
// @author       Kie
// @match        *://www.mangago.me/read-manga/*/*/*/*
// @match        *://www.mangago.me/read-manga/*/*/*
// @icon         https://www.mangago.me/images/ywz-1-7070.png
// @namespace    https://greasyfork.org/users/101138

// @downloadURL https://update.greasyfork.org/scripts/393056/Mangago%20Multi%20PagesFull%20Load%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/393056/Mangago%20Multi%20PagesFull%20Load%20Fix.meta.js
// ==/UserScript==

$(window).on('load', function() {
     $('[class^="loading"]').css('height', '0px');
})();