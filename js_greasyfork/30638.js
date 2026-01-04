// ==UserScript==
// @name        IMDb2CL
// @namespace   https://www.cinelounge.org/
// @description Chercher la fiche CL d'une fiche IMDb
// @author      tadanobu
// @version     1.9
// @grant       none
// @icon        https://www.cinelounge.org/images/logot.png
// @require     https://code.jquery.com/jquery-3.5.1.min.js
// @match       https://*.imdb.com/title/tt*
// @match       http*://*.imdb.com/title/tt*/?ref*
// @match       http*://*.imdb.com/title/tt*/reference*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/30638/IMDb2CL.user.js
// @updateURL https://update.greasyfork.org/scripts/30638/IMDb2CL.meta.js
// ==/UserScript==
window.addEventListener('load', showCL);
function showCL() {
    var movie_id = document.URL.match(/\/tt([0-9]+)\//)[1].trim('tt');
    var h1s = document.getElementsByTagName("h1");
    var title = document.title
    .split('(')[0] // Sépare le titre au premier '(' et prend la première partie
    .trim() // Supprime les espaces de début et de fin
    .normalize("NFKD") // Normalise les caractères unicode
    .replace(/[\u0300-\u036f]/g, "") // Supprime les diacritiques
    .replace(/[^\w\s\']/g, "") // Supprime tous les caractères sauf alphanumériques, espaces et apostrophes
    .replace(/\s+/g, "_");
    for (var i = 0; i < h1s.length; i++) {
        var h1 = h1s[i];
        h1.innerHTML += ' <a href=\'https://www.cinelounge.org/imdb2cl/' + movie_id + '-' + title + '\' target="_blank"><img src=\'https://www.cinelounge.org/images/logo.png\' style=\'vertical-align: middle; width: 20px;\' title=\'Fiche CinéLounge\' /></a>';
    }
}