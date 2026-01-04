// ==UserScript==
// @name         HM SPODNIE Dostępność
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Zagraj muzyczkę jak będą dostępne
// @author       Eryk Wróbel
// @match        http://www2.hm.com/pl_pl/productpage.0491912001.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32799/HM%20SPODNIE%20Dost%C4%99pno%C5%9B%C4%87.user.js
// @updateURL https://update.greasyfork.org/scripts/32799/HM%20SPODNIE%20Dost%C4%99pno%C5%9B%C4%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $( window ).on( "load", function() {
         // Tutaj wstaw selector elementu do obserwowania
    var to_watch = $('#filter-size-0491912001008');
    var mp3_link = 'http://mp3red.me/stream/15955518/rick-roll-never-gonna-give-you-up.mp3';
    var aSound = document.createElement('audio');

    if (to_watch.is(':disabled') === false) {
        aSound.setAttribute('src', mp3_link);
        aSound.play();

    } else {
        setInterval(function() {
            window.location.reload();
        }, 60000);    
    }
    });
    
    

   
})();