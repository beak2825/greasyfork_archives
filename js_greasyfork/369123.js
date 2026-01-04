// ==UserScript==
// @name         Gutscheinbox
// @version      0.3
// @description  Kaufen Button immer anzeigen
// @author       rabe85
// @match        https://*.radiogutscheine.de/*
// @grant        none
// @namespace    https://greasyfork.org/users/156194
// @downloadURL https://update.greasyfork.org/scripts/369123/Gutscheinbox.user.js
// @updateURL https://update.greasyfork.org/scripts/369123/Gutscheinbox.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function gutscheinbox() {

        // Kaufen Button immer anzeigen, außer wenn ausverkauft
        if(document.getElementsByClassName('buy-now-btn more-grey-btn')[0].innerHTML.trim() != "AUSVERKAUFT") {
            if(document.getElementsByClassName('buy-now-btn launched')[0]) {
                document.getElementsByClassName('buy-now-btn launched')[0].setAttribute('style','display:inline;');
            } else {
                var url_array = window.location.pathname.split("_");
                var url_array_lenght = url_array.length - 1;
                var url_nummer = url_array[url_array_lenght];
                document.getElementsByClassName('buy-now-button mega')[0].innerHTML = "<a href=\"/gutschein/" + url_nummer + "/kaufen\" class=\"buy-now-btn launched\" style=\"display:inline;\">JETZT BESTELLEN</a>" + document.getElementsByClassName('buy-now-button mega')[0].innerHTML;
            }
        }

    }

    // DOM vollständig aufgebaut?
    if (/complete|interactive|loaded/.test(document.readyState)) {
        gutscheinbox();
    } else {
        document.addEventListener("DOMContentLoaded", gutscheinbox, false);
    }

})();