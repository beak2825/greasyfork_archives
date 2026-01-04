// ==UserScript==
// @name         Jellyfin2CL
// @namespace    https://www.cinelounge.org/
// @version      1.0
// @description  Ouvrir une fiche CL depuis une fiche Jellyfin
// @author       tadanobu
// @match        http://localhost:8096/web/index.html*
// @require      https://code.jquery.com/jquery-3.6.1.js
// @icon         https://www.cinelounge.org/images/logot.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453299/Jellyfin2CL.user.js
// @updateURL https://update.greasyfork.org/scripts/453299/Jellyfin2CL.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', showCL);
    window.addEventListener('hashchange', showCL);
    function showCL() {
        setTimeout(function (){
            var h1 = $('a[href*="imdb"]');
            var tt = $('a[href*="imdb"]').attr('href').substr(29,8);
            $('h1[class*="parentNameLast"]')[0].innerHTML += ' <a href=\'https://www.cinelounge.org/imdb2cl/' + tt + '-' + $('h1[class*="parentNameLast"]')[0].innerHTML.replaceAll(' ','_').replaceAll(/[^a-zA-Z0-9-_]/g, '') + '\' target="_blank"><img src=\'https://www.cinelounge.org/images/logo.png\' style=\'vertical-align: middle; width: 20px;\' title=\'Fiche CinéLounge\' /></a>';
        }, 200);
    }
})();