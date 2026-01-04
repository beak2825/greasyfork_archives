// ==UserScript==
// @name         Rimuovi Contenuto suggerito per te su Facebook
// @namespace    https://greasyfork.org/users/237458
// @version      0.2
// @description  Rimuove il contenuto suggerito per te , reels, persone che postresti conoscere su Facebook
// @author       figuccio
// @match        https://www.facebook.com/*
// @icon         https://facebook.com/favicon.ico
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482420/Rimuovi%20Contenuto%20suggerito%20per%20te%20su%20Facebook.user.js
// @updateURL https://update.greasyfork.org/scripts/482420/Rimuovi%20Contenuto%20suggerito%20per%20te%20su%20Facebook.meta.js
// ==/UserScript==

(function() {
    'use strict';
setInterval(gtfo, 500);
var $ = window.jQuery;//$z evita triangolo giallo
function gtfo() {
    //Contenuto suggerito per te
$("span:contains('Suggested for you')" ).closest('[data-pagelet*="FeedUnit"]').hide();
$( "span:contains('Contenuto suggerito per te')" ).closest('[data-pagelet*="FeedUnit"]').hide();//dicembre 2023
$( "span:contains('Reel e video brevi')" ).closest('[data-pagelet*="FeedUnit"]').hide();//25-12-2023
$( "span:contains('Reels')" ).closest('[data-pagelet*="FeedUnit"]').hide();//25-12-2023  toglie reel condivisi dagli amici
$( "span:contains('Persone che potresti conoscere')" ).closest('[data-pagelet*="FeedUnit"]').hide();//25-12-2023
}

})();
