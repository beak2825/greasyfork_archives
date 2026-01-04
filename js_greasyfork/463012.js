// ==UserScript==
// @name        TMDb2CL
// @namespace   https://www.cinelounge.org/
// @description Chercher la fiche CL d'une fiche TMDb
// @author      tadanobu
// @version     1.3
// @grant       none
// @icon        https://www.cinelounge.org/images/logot.png
// @require     https://code.jquery.com/jquery-3.5.1.min.js
// @match       https://www.themoviedb.org/movie/*
// @match       https://www.themoviedb.org/tv/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463012/TMDb2CL.user.js
// @updateURL https://update.greasyfork.org/scripts/463012/TMDb2CL.meta.js
// ==/UserScript==
window.addEventListener('load', showCL);
function showCL() {
    var movie_id = document.URL.split("/").pop().split("-")[0];
    var title = document.title.split("(")[0].trim().replace(/ /g, "_").normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
    var h1s = document.getElementsByClassName("release_date");
    for (var i = 0; i < h1s.length; i++) {
        var h1 = h1s[i];
        h1.innerHTML += ' <a href=\'https://www.cinelounge.org/page.php?page=tmdb2cl&TMDb=' + movie_id + '\' target="_blank"><img src=\'https://www.cinelounge.org/images/logo.png\' style=\'vertical-align: middle; width: 20px;\' title=\'Fiche CinéLounge\' /></a>';
    }
}