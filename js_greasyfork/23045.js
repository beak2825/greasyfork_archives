// ==UserScript==
// @name         Anti Anti Adblock LEQUIPE.fr
// @require http://code.jquery.com/jquery-latest.js
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Syntaxlb
// @match        http://www.lequipe.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23045/Anti%20Anti%20Adblock%20LEQUIPEfr.user.js
// @updateURL https://update.greasyfork.org/scripts/23045/Anti%20Anti%20Adblock%20LEQUIPEfr.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(function() {
        
        function removeAds()
        {
            
            $('#ab-tutorial').parent().parent().remove();
            setTimeout(removeAds(), 1000);
        }
        removeAds();
    });
        

})();