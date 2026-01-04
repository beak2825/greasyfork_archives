// ==UserScript==
// @name         Copy Paste Instagram Images
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Removes the element that blocks copying images on instagram
// @author       Minnie
// @match        https://www.instagram.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469226/Copy%20Paste%20Instagram%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/469226/Copy%20Paste%20Instagram%20Images.meta.js
// ==/UserScript==

 /* note, this is my 2nd ever thing i made with javascript EVER
     so, it's probably majorly inefficient and janky, oh well, it works
     i am only posting this here so i can let my friends try it out
     thanks for understanding */

(function() {
    'use strict';

    function removeElement() {
        const blocker = document.querySelector('._aagw');
        if (blocker) {
            console.log('ELEMENT REMOVED');
            blocker.remove();
        }
    }

    document.addEventListener('click', removeElement);
    


})();