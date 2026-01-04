// ==UserScript==
// @name         Ice Torrent Torrente Colorate
// @namespace    ICE Torrents baby ;)
// @version      0.1
// @description  adaugă cuvintele care te interesează şi torrentele vor fi colorate ca să nu le pierzi din vedere, dacă ai altă temă şi doreşti altă culoare o poţi schimba uşor editînd scriptul
// @author       drakulaboy
// @include      *icetorrent.org/browse.php*
// @grant        none
// @icon         https://www.icetorrent.org/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/34678/Ice%20Torrent%20Torrente%20Colorate.user.js
// @updateURL https://update.greasyfork.org/scripts/34678/Ice%20Torrent%20Torrente%20Colorate.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
(function() {
    'use strict';
    var include = [
                   'Scorpion',
                   'ADAUGĂ_AICI',
                   'ADAUGĂ_AICI_ALTCEVA',
                   //COPIE ŞI MAI ADAUGĂ DACĂ MAI AIC CEVA
                  ];
    include.forEach(function(i){
        $('tr.torrent.screenshot:contains(' + i + ')').css("background-color", "#e0f9e2") ;
    });
})();