// ==UserScript==
// @name        ShowUp.TV AutoWarner
// @author      fapka
// @namespace   fapkamaster@gmail.com
// @description Ostrzeżenie przed opuszczeniem własnej transmisji.
// @include     https://showup.tv/site/start_transmission*
// @version     0.1.1
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/33441/ShowUpTV%20AutoWarner.user.js
// @updateURL https://update.greasyfork.org/scripts/33441/ShowUpTV%20AutoWarner.meta.js
// ==/UserScript==

//Ostrzeżenie przed opuszczeniem własnej transmisji (dowolny link lub zamknięcie strony - również wyświetla się przy akceptowaniu priva).
window.onbeforeunload = function(evt) {
   var message = 'Opuszczenie strony wyłączy transmisję! Kontynuować?';
   if (typeof evt == 'undefined') {
    evt = window.event;}
   if (evt) {
    evt.returnValue = message;     }
    return message
    };
