// ==UserScript==
// @name        KG2CL
// @namespace   https://www.cinelounge.org/
// @description Ouvrir une fiche CL depuis une fiche KG
// @author      tadanobu
// @icon        https://www.cinelounge.org/images/logot.png
// @include     https://karagarga.in/details.php?id=*
// @version     2.6
// @grant       none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/30641/KG2CL.user.js
// @updateURL https://update.greasyfork.org/scripts/30641/KG2CL.meta.js
// ==/UserScript==
$("td:contains(Internet Link)")
    .next().text(function(){
        if ($(this).text().indexOf("imdb") >= 0) {
            if ($(this).text().indexOf("https") >= 0) {
                var imdb = $(this).text().substr(29,8);
            }
            else {
                var imdb = $(this).text().substr(28,8);
            }
            var title = $("h1").html().substring($("h1").html().lastIndexOf("-")+2,$("h1").html().lastIndexOf("(")-1).replaceAll(' ','_').replaceAll(/[^a-zA-Z0-9-_]/g, '').split('aka')[0].split('AKA')[0];
            $(this).html('<a href="https://www.cinelounge.org/imdb2cl/' + imdb + '-' + title + '" target="_blank" ><img src=\'https://www.cinelounge.org/images/logot.png\' style=\'vertical-align: middle; width: 18px;\' title=\'Fiche CinéLounge\' /></a> <a href="http://www.imdb.com/title/tt' + imdb + '" target="_blank" ><img src=\'https://ia.media-imdb.com/images/G/01/imdb/images/favicon-2165806970\' style=\'vertical-align: middle; width: 20px;\' title=\'Fiche IMDb\' /></a>');
        }
    });