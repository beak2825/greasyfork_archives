// ==UserScript==
// @name            TUM WZW Shuttlebus Assistent
// @name:en         TUM WZW Shuttlebus Assistent
// @version         1.1
// @description     Erweiterung für die Website der Fakultät für Biowissenschaften der Technischen Universität München über die der Shuttlebus-Fahrplan zur Verfügung gestellt wird. Durch Hinzufügen des URL-Parameters "load" können Sie den aktuellen (load=0) und den Busfahrplan der nächsten Woche (load=1) abrufen. For more information on how to set up the script, please see https://greasyfork.org/de/scripts/34060.
// @description:en  Extension for the website of the Faculty of Biosciences at the Technical University of Munich providing the shuttlebus timetable. By adding the URL parameter "load", you can retrieve the current (load=0) and next week's bus schedule (load=1). For more information on how to set up the script, please see https://greasyfork.org/de/scripts/34060.
// @author          zsewa
// @namespace       https://greasyfork.org/users/57483
// @match           http://www.sf-biowiss.wzw.tum.de/index.php?id=258*
// @grant           none

// @require         https://code.jquery.com/jquery-3.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/34060/TUM%20WZW%20Shuttlebus%20Assistent.user.js
// @updateURL https://update.greasyfork.org/scripts/34060/TUM%20WZW%20Shuttlebus%20Assistent.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url = new URL(location.href);
    var c = url.searchParams.get("load");
    //console.log(c);
    if(c == 0||c == 1){location.href = $('.download')[c].href;}
})();