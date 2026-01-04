// ==UserScript==
// @name         GC - MI training school pet reorganizer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  puts pets that are on a course at the top of the page
// @author       wibreth
// @match        https://www.grundos.cafe/island/training/?type=status*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/456927/GC%20-%20MI%20training%20school%20pet%20reorganizer.user.js
// @updateURL https://update.greasyfork.org/scripts/456927/GC%20-%20MI%20training%20school%20pet%20reorganizer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals $:false */

    GM_addStyle('.threequarters-width {\
    display: flex;\
    flex-direction: column;\
}');


    $('document').ready(() => {
        let order = 0;

        // check each pet
        $('.flex.med-gap.center-items').each(function() {
            //not on a course
            if (!$.trim($(this).find('.center.flex-grow').html()).length)
                return;

            $(this).css('order', --order);
            $(this).prev().css('order', --order);
        });
    });
})();