// ==UserScript==
// @name         Sitraffic sX - Button
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Sitraffic sX - Archivbuttons beim mehr als 24h Zeitfenster wieder aktivieren (bei OMC 3.2, 3.3 nötig)
// @author       Ralf Beckebans
// @match        http*://192.168.128.3/guiprovider/CommonBuild.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=128.3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505757/Sitraffic%20sX%20-%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/505757/Sitraffic%20sX%20-%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function sitraffic_sx() {

        function enable_buttons() {

            // Buttons beim mehr als 24h Zeitfenster wieder aktivieren
            var notification_neu = document.getElementById('notificationPanel').getElementsByTagName('div')[0].innerHTML;
            if(notification_neu == 'Ausgewählte Dauer ist länger als 24 Stunden. Bitte Dauer reduzieren, um die Buttons unten zu aktivieren.') {
                var buttons_disabled0 = document.getElementById('actionsPanel').getElementsByTagName('button');
                for(var bd = 0, buttons_disabled; !!(buttons_disabled=buttons_disabled0[bd]); bd++) {
                    buttons_disabled.removeAttribute('disabled');
                }
            }

        }
        var button_class = document.getElementById('actionsPanel').getElementsByTagName('div')[0].getElementsByTagName('button')[0].getAttribute('class');
        if(button_class == 'gwt-Button GAYVOU2BLMB' || button_class == 'gwt-Button GAYVOU2BNMB') { // GAYVOU2BLMB = OMC 3.2, GAYVOU2BNMB = OMC 3.3, GAYVOU2BCNB = OMC 3.4 (nicht mehr nötig), GAYVOU2BDNB = OMC 3.6 (nicht mehr nötig)
            document.getElementById('actionsPanel').getElementsByTagName('div')[0].insertAdjacentHTML('afterBegin','<button tpye="button" class="gwt-Button GAYVOU2BNMB" id="ralf" title="Buttons freigeben"><div style="width: 18px; height: 18px; margin: auto; display: inline-block; vertical-align: middle;"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAPUlEQVR42mNgIAzmM1AI/lNqyH9KDflPyJD/JOL5lBqAYch/Sg35T6khA2bA/AELxPlUT0h0ScoUZSa8mgF8NYF5uPwDDwAAAABJRU5ErkJggg==" width="16" height="16" class="gwt-Image"></div></button>');
            document.getElementById('ralf').addEventListener('click', enable_buttons, false);
        }

    }

    // Auf Element der Seite warten
    function daten_gefunden() {
        waitForElm('#actionsPanel').then((elm) => {
            sitraffic_sx();
        });
    }

    // Daten nachgeladen?
    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    // DOM vollständig aufgebaut?
    if (/complete|interactive|loaded/.test(document.readyState)) {
        daten_gefunden();
    } else {
        document.addEventListener('DOMContentLoaded', daten_gefunden, false);
    }

})();