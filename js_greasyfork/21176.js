// ==UserScript==
// @name         Anti Anti Adblocker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Lad lige være. Vil jeg bruge adblocker, er det det jeg gør.
// @author       ;)
// @match        http://politiken.dk/*
// @match        http://ekstrabladet.dk/*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/21176/Anti%20Anti%20Adblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/21176/Anti%20Anti%20Adblocker.meta.js
// ==/UserScript==


(function() {
    'use strict';
        var ind = -1;
        $("body > div").each(function( index ) {
            if ($( this ).css('position') == 'fixed' && $( this ).css('z-index') >= 10000){
                ind = index;
            }
        });

        if (ind != -1){
            console.log('found this: '+$("body > div").children()[ind]);
            $("body > div")[ind].remove();
            $("body").css('overflow','auto');
        } else {
            location.reload();
        }


})();