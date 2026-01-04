// ==UserScript==
// @name        KGBrowse2CL
// @namespace   https://www.cinelounge.org/
// @description Ouvrir une fiche CL depuis la navigation sur KG
// @author      tadanobu
// @include     https://karagarga.in/browse.php*
// @include     https://karagarga.in/bookmarks.php*
// @include     https://karagarga.in/history.php*
// @version     1.04
// @grant       none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453167/KGBrowse2CL.user.js
// @updateURL https://update.greasyfork.org/scripts/453167/KGBrowse2CL.meta.js
// ==/UserScript==
$('a').each(function() {
    if ($(this).is('[href*="imdb"')) {
        if ($(this).attr('href').indexOf("https") >= 0) {
                var imdb = $(this).attr('href').substr(29,8);
            }
            else {
                var imdb = $(this).attr('href').substr(28,8);
            }
        $(this).before('<a href="https://www.cinelounge.org/imdb2cl/' + imdb + '" target="_blank" ><img src=\'https://www.cinelounge.org/images/logot.png\' style=\'width: 14px;\' title=\'Fiche CinéLounge\' /></a> ');
    }
});