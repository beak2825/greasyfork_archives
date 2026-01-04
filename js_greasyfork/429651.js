// ==UserScript==
// @name        Salto autoskip
// @description This script skips the 10 second countdown on Salto
// @author MMARC
// @match https://www.salto.fr/*
// @version     1.0
// @namespace https://greasyfork.org/users/795529
// @downloadURL https://update.greasyfork.org/scripts/429651/Salto%20autoskip.user.js
// @updateURL https://update.greasyfork.org/scripts/429651/Salto%20autoskip.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(
        function(){
            if(document.querySelectorAll('.sc-1veuio6-0').length == 12){
                document.querySelector('.sc-1xujysn-15').click();
            }
        }
        ,1000);
})();