// ==UserScript==
// @name         Shoptet "link na telefon"
// @namespace    mailto:azuzula.cz@gmail.com
// @version      1.0
// @description  V detailu objednávky z telefoního čísla zákazníka vytvoří klikatelný odkaz. Z prohlížeče Chrome se dá tento odkaz odeslat přímo do vašeho smartphonu přes Google synchronizaci.
// @author       Zuzana Nyiri
// @match        */admin/objednavky-detail/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410682/Shoptet%20%22link%20na%20telefon%22.user.js
// @updateURL https://update.greasyfork.org/scripts/410682/Shoptet%20%22link%20na%20telefon%22.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var spans = document.getElementById("customer-contact").getElementsByTagName("span");
    var substring = "Telefon";
    var i;
    for(i=0;i<spans.length;i++)
    {
        var string = spans[i].innerHTML;
        if (string.includes(substring)) {
            if (string.length>9){
                string = string.substring(9, string.length);
                spans[i].innerHTML = "Telefon: <a href='tel:"+string.replace(/ +/g,"")+"'>"+string+"</a>";
            }
        }
    }
})();