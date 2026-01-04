// ==UserScript==
// @name         paupau - Personal Capper
// @namespace    https://greasyfork.org/users/156194
// @version      0.1
// @description  Personal Capper Test
// @author       rabe85
// @match        http://personal.munzeemeetsowl.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369971/paupau%20-%20Personal%20Capper.user.js
// @updateURL https://update.greasyfork.org/scripts/369971/paupau%20-%20Personal%20Capper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function personal_capper() {

        var url_path = window.location.pathname;
        var url_array = url_path.split("/");
        var url_array_lenght = url_array.length - 1;
        var url_switch = url_array[url_array_lenght];


        var link_personalcap = document.querySelector("a[href='personalcap.php']");
        if(link_personalcap) {
            // getLocation Script laden
            var getlocation_script_start = document.createElement('script');
            var getlocation_script_function = document.createTextNode('function getLocation() { if (navigator.geolocation) { navigator.geolocation.getCurrentPosition(showPosition); } } function showPosition(position) { if(position.coords.latitude != 0 && position.coords.longitude != 0) { document.querySelector("a[href=\'personalcap.php\']").href = document.querySelector("a[href=\'personalcap.php\']").href + \'&lat_aktuell=\' + position.coords.latitude + \'&lng_aktuell=\' + position.coords.longitude; document.querySelector("a[href=\'personalcap.php\']").innerHTML += \' <i class="fas fa-location-arrow">\'; } } ');
            getlocation_script_start.appendChild(getlocation_script_function);
            document.head.appendChild(getlocation_script_start);
            document.body.setAttribute('onload','getLocation();');
        }

        if(url_array[1] == 'personalcap.php') {
            var personals_col = document.getElementsByClassName('8u')[0];
            if(personals_col) {

                // Funktion für nächsten Personal laden
                var personal_script_start = document.createElement('script');
                var personal_script_function = document.createTextNode('function naechster_personal() { var aktueller_personal_id = document.getElementsByClassName(\'8u\')[0].querySelector("div[data-show=\'1\']").getAttribute(\'id\'); var aktueller_personal_style = document.getElementById(aktueller_personal_id).getAttribute(\'style\'); document.getElementById(aktueller_personal_id).setAttribute(\'style\', aktueller_personal_style + \' display:none !important;\'); document.getElementById(aktueller_personal_id).setAttribute(\'data-show\', \'0\'); var naechster_personal_id = parseInt(aktueller_personal_id) + 1; var naechster_personal_style = document.getElementById(naechster_personal_id).getAttribute(\'style\'); document.getElementById(naechster_personal_id).setAttribute(\'style\', naechster_personal_style + \' display:inline !important;\'); document.getElementById(naechster_personal_id).setAttribute(\'data-show\', \'1\'); }');
                personal_script_start.appendChild(personal_script_function);
                document.head.appendChild(personal_script_start);

                var personals_div0 = personals_col.querySelectorAll("div");
                for(var pd = 0, personals_div; !!(personals_div=personals_div0[pd]); pd++) {
                    // Allen div eine id geben
                    personals_div.setAttribute('id',pd+1);
                    // Alle div (außer dem ersten) ausblenden
                    if(pd == 0) {
                        personals_div.setAttribute('data-show', '1');
                    } else {
                        var personals_div_style = personals_div.getAttribute('style');
                        personals_div.setAttribute('style', personals_div_style + ' display:none;');
                    }
                }
                // Anzahl der Personals in der Überschrift einfügen
                personals_col.querySelector("h1").innerHTML = (pd+1) + ' neue ' + personals_col.querySelector("h1").innerHTML;
                // Weiter-Link einfügen, falls es mehr als einen Personal gibt
                if((pd+1) > 1) {
                    personals_col.insertAdjacentHTML('beforeend', '<a onclick="naechster_personal();">Nächsten Personal anzeigen</a>');
                }

            }
        }

        // Header ausblenden
        document.getElementById('banner').remove();

        // Footer ausblenden
        document.getElementById('footer').remove();

    }


    // DOM vollständig aufgebaut?
    if (/complete|interactive|loaded/.test(document.readyState)) {
        personal_capper();
    } else {
        document.addEventListener("DOMContentLoaded", personal_capper, false);
    }

})();