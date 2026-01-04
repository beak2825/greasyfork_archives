// ==UserScript==
// @name         PaderGIS - MapSolution
// @namespace    https://greasyfork.org/users/305651
// @version      1.2
// @description  Benutzerdaten auf der Loginseite speichern
// @author       Ralf Beckebans
// @match        http*://giscloud.gkdpb.de/MapSolution/apps/app/client/intra/StadtPB/spb_app_standard
// @match        http*://giscloud.gkdpb.de/MapSolution/apps/app/client/intra/StadtPB/spb_app_standard/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/396576/PaderGIS%20-%20MapSolution.user.js
// @updateURL https://update.greasyfork.org/scripts/396576/PaderGIS%20-%20MapSolution.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function mapsolution() {


        var benutzerdaten_username = '';
        var benutzerdaten_passwort = '';


        var logindiv = document.querySelector('DIV[data-dojo-type="ipsyscon.login.Login"]');
        if(logindiv) {

            var username = logindiv.getAttribute('usernameDefault');
            var passwort = logindiv.getAttribute('passwordDefault');

            if(username == '' && passwort == '') {

                // Benutzerdaten laden
                benutzerdaten_username = GM_getValue('benutzerdaten_username', '');
                benutzerdaten_passwort = GM_getValue('benutzerdaten_passwort', '');
                var benutzerdaten_speichern = GM_getValue('benutzerdaten_speichern', '');

                if(benutzerdaten_speichern == 'ja') {
                    if(!benutzerdaten_username) {
                        // Popup Username eingeben
                        var username_eingegeben = prompt('Benutzername:', '');
                        if(typeof username_eingegeben !== 'undefined') {
                            benutzerdaten_username = username_eingegeben;
                            GM_setValue('benutzerdaten_username', username_eingegeben);
                        }
                    }

                    if(!benutzerdaten_passwort) {
                        // Popup Passwort eingeben
                        var passwort_eingegeben = prompt('Passwort:', '');
                        if(typeof passwort_eingegeben !== 'undefined') {
                            benutzerdaten_passwort = passwort_eingegeben;
                            GM_setValue('benutzerdaten_passwort', passwort_eingegeben);
                        }
                    }

                    if(typeof benutzerdaten_username !== 'undefined' && typeof benutzerdaten_passwort !== 'undefined') {
                        logindiv.setAttribute('usernameDefault',benutzerdaten_username);
                        logindiv.setAttribute('passwordDefault',benutzerdaten_passwort);
                    }
                } else {
                    if(benutzerdaten_speichern != 'ja' && benutzerdaten_speichern != 'nein') {
                        var benutzerdaten_speichern_abfrage = confirm("Sollen die Benutzerdaten auf dieser Seite gespeichert werden?");
                        if (benutzerdaten_speichern_abfrage == true) {
                            GM_setValue('benutzerdaten_speichern', 'ja');
                            location.reload();
                        } else {
                            GM_setValue('benutzerdaten_speichern', 'nein');
                        }
                    }
                }
            }

            var logindiv_benutzerdaten_speichern_loeschen = 'speichern';
            if(benutzerdaten_username || benutzerdaten_passwort) { logindiv_benutzerdaten_speichern_loeschen = 'l&ouml;schen'; }
            logindiv.insertAdjacentHTML('beforebegin', '<div style="position: fixed;z-index: 1000;right: 20px;top: 5px;"><span id="benutzerdaten_loeschen" style="cursor: pointer;">Benutzerdaten ' + logindiv_benutzerdaten_speichern_loeschen + '</span></div>');
        }


        var appdiv = document.getElementById('App');
        if(appdiv) {
            var username_eingeloggt = '';
            var appdiv_benutzerdaten_speichern_loeschen = 'speichern';
            if(GM_getValue('benutzerdaten_username', '')) { username_eingeloggt = ' als ' + GM_getValue('benutzerdaten_username', ''); }
            if(username_eingeloggt || GM_getValue('benutzerdaten_passwort', '')) { appdiv_benutzerdaten_speichern_loeschen = 'l&ouml;schen'; }
            appdiv.insertAdjacentHTML('beforebegin', '<div style="position: fixed;z-index: 1;right: 20px;top: 5px;">Eingeloggt' + username_eingeloggt + '&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;<span id="benutzerdaten_loeschen" style="cursor: pointer;">Benutzerdaten ' + appdiv_benutzerdaten_speichern_loeschen + '</span></div>');
        }


        function benutzerdaten_loeschen() {
            GM_deleteValue('benutzerdaten_username');
            GM_deleteValue('benutzerdaten_passwort');
            GM_deleteValue('benutzerdaten_speichern');
            location.reload();
        }


        document.getElementById('benutzerdaten_loeschen').addEventListener('click', benutzerdaten_loeschen, false);

    }


    // DOM vollständig aufgebaut?
    if (/complete|interactive|loaded/.test(document.readyState)) {
        mapsolution();
    } else {
        document.addEventListener('DOMContentLoaded', mapsolution, false);
    }

})();