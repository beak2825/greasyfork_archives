// ==UserScript==
// @name         Hotel Photos Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Use the '1' key on the top row to rotate between images.
// @author       pyro
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @include      *www.mturkcontent.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25212/Hotel%20Photos%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/25212/Hotel%20Photos%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if ($("h3:contains('Please select the applicable choices below each image.')").length || $("h2:contains('Please indicate the most accurate description of the hotel area depicted in the image.')").length) {
        console.log("Hotel Photos");
        $('img[onerror="imgError(this);"]').each( function(x) {
           $(this).attr('id', 'image' + x);
        });
        let key = 0;
        document.onkeydown = function (k) {
            switch (k.keyCode) {
                case 49: window.scrollTo(0, $("#image" + ((key % 5))).offset().top);
                         key++;
                         break;
            }
        };
    }
})();