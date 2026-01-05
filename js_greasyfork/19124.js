// ==UserScript==
// @name          fb skrypt
// @author        Szczot3k
// @homepage      https://www.facebook.com/szczoteek
// @description	  Usuwa wszystkie posty z nimi związane
// @require       http://code.jquery.com/jquery-2.2.1.min.js
// @grant         none
// @include       *.facebook.com/*
// @include       https://*.facebook.com/*
// @version       1.1
// @namespace     https://greasyfork.org/pl/users/40472-szczot3k
// @downloadURL https://update.greasyfork.org/scripts/19124/fb%20skrypt.user.js
// @updateURL https://update.greasyfork.org/scripts/19124/fb%20skrypt.meta.js
// ==/UserScript==

var debile = ["Poborczyk Roksana", "Weronika Spała", "Krystian Gwiździński"];

$( document ).on( "mouseover", function(){
        var i;
        for	(i = 0; i < debile.length; i++) {
            $("div:contains('"+debile[i]+"')").parents("div[data-ft*='fbfeed_location']").remove();
        }
})();