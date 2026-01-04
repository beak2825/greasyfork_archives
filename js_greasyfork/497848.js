// ==UserScript==
// @name         FreeGOG No Countdown
// @namespace    https://greasyfork.org/en/users/807108-jeremy-r
// @version      0.1
// @description  Changes the class of the DLINK div to "fade-in" and hides countdown
// @author       JRem
// @match        http*://gdl.freegogpcgames.xyz/download-gen.php?url=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freegogpcgames.xyz
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497848/FreeGOG%20No%20Countdown.user.js
// @updateURL https://update.greasyfork.org/scripts/497848/FreeGOG%20No%20Countdown.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the DOM to be fully loaded
    window.addEventListener('load', function() {
        const dlinkDiv = document.getElementById('DLINK');
        if (dlinkDiv) {
            dlinkDiv.classList.remove('hide');
            dlinkDiv.classList.add('fade-in');
        };
        const itemkDiv = document.getElementsByClassName('item');
        if (itemkDiv) {
            itemkDiv[0].classList.add('hide');
        };
    });
})();
