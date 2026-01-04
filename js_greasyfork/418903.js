// ==UserScript==
// @name         Buoni Carburante IP - Credito Residuo & Scadenza
// @namespace    http://ivanomarchetti.net/
// @include      http://ecard.resdata.it/external/check_residuo_in.htm
// @version      1.1
// @description  Questo script fornisce un'interfaccia semplificata per controllare il Credito Residuo e la Scadenza dei Buoni Carburante IP.
// @copyright    2020+, Ivano Marchetti - GPLv3 License
// @require      https://code.jquery.com/jquery-latest.min.js
// @license      GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/418903/Buoni%20Carburante%20IP%20-%20Credito%20Residuo%20%20Scadenza.user.js
// @updateURL https://update.greasyfork.org/scripts/418903/Buoni%20Carburante%20IP%20-%20Credito%20Residuo%20%20Scadenza.meta.js
// ==/UserScript==
var codice = prompt("Inserire il codice numerico di 19 caratteri presente in basso a destra nel retro della carta",);
if (codice != null) {
    for (var i = 0; i < codice.length; i++) {
        $('#'+(i+1)).val(''+codice.charAt(i));
    }
    $("#submit").click();
}