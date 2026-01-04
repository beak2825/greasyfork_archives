// ==UserScript==
// @name        IMDb2CL - Perso
// @namespace   https://www.cinelounge.org/
// @description Chercher la fiche CL d'une fiche IMDb - Personnalités
// @include     https://*.imdb.com/name/nm*
// @icon        https://www.cinelounge.org/images/logot.png
// @version     1.7
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/30664/IMDb2CL%20-%20Perso.user.js
// @updateURL https://update.greasyfork.org/scripts/30664/IMDb2CL%20-%20Perso.meta.js
// ==/UserScript==
var adr = window.location.href.split('/nm');
if(adr[1].substr(7,1)=='/')
{
    var tt = adr[1].substr(0, 7);
}
else
{
    var tt = adr[1].substr(0, 8);
}
var h1s = document.getElementsByTagName("h1");
for (var i = 0; i < h1s.length; i++) {
    var h1 = h1s[i];
    h1.innerHTML += ' <a href=\'https://www.cinelounge.org/imdb2clp/' + tt + '\' target="_blank"><img src=\'https://www.cinelounge.org/images/logo.png\' style=\'padding-top: 10px; width: 20px;\' title=\'Fiche CinéLounge\' /></a>';
}
