// ==UserScript==
// @name         Shoptet "Zvetseni fontu mnozstvi produktu 1"
// @namespace    mailto:azuzula.cz@gmail.com
// @version      0.41
// @description  Na stránce objednávky zvětší čísla množství produktů a podbarví pole, když je víc než 1ks
// @author       Zuzana Nyiri
// @match        */admin/objednavky-detail/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422210/Shoptet%20%22Zvetseni%20fontu%20mnozstvi%20produktu%201%22.user.js
// @updateURL https://update.greasyfork.org/scripts/422210/Shoptet%20%22Zvetseni%20fontu%20mnozstvi%20produktu%201%22.meta.js
// ==/UserScript==
// link https://greasyfork.org/cs/scripts/422210-shoptet-zvetseni-fontu-mnozstvi-produktu-1

(function() {
    'use strict'
    $("td.v2table__cell--number").each(function() {
        var myStr = $(this)[0].innerHTML;
        myStr = myStr.substring(0, myStr.indexOf('&nbsp'));
        myStr = $($.parseHTML(myStr)).text().trim();
        if(myStr>1){
            $(this).css({backgroundColor:'yellow',
                         fontSize:'large',
                         fontWeight:'bold',})
        }
    });
})();