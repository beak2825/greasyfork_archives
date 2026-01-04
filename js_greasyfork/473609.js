// ==UserScript==
// @name         Grundo's Wishing Well
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Autofills the wishing well donation amount to 25. Then targets the wish input to allow the user to just hit enter repeatedly. Change the item wish on line 25.
// @author       Gem
// @match        https://grundos.cafe/wishing/
// @match        https://www.grundos.cafe/wishing/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/473609/Grundo%27s%20Wishing%20Well.user.js
// @updateURL https://update.greasyfork.org/scripts/473609/Grundo%27s%20Wishing%20Well.meta.js
// ==/UserScript==
/* globals $ */

(function() {
    'use strict';

     if (window.location.href.match('grundos.cafe/wishing/')) {

         let donation = document.querySelector('[name="donation"]')
         donation.value = 25;

         let wish = document.querySelector('[name="wish"]');
         wish.value = 'Candychan Stamp';

         document.querySelector('[name="wish"]').focus();
     }

})();