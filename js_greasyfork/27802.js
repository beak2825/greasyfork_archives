// ==UserScript==
// @name         T411 - surligne les torrents Presse informatique et jeux video
// @name:fr      T411 - surligne les torrents Presse informatique et jeux video
// @namespace    T411 - surligne les torrents Presse informatique et jeux video
// @version      0.0.2
// @description  T411 - highlight pc, video game, hardware, etc related magazines
// @description:fr  T411 - surligne les torrents Presse informatique et jeux video
// @author       rot
// @match        *://*.t411.ai/torrents/search/*
// @match        *://*.t411.ai/top/week/*
// @match        *://*.t411.ai/top/today/*
// @match        *://*.t411.ai/top/month/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/27802/T411%20-%20surligne%20les%20torrents%20Presse%20informatique%20et%20jeux%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/27802/T411%20-%20surligne%20les%20torrents%20Presse%20informatique%20et%20jeux%20video.meta.js
// ==/UserScript==

$(document).ready(function() {

    /*
    script verifie d'abord le type de page affichée :
    soit "resultats de recherche" ! 1 seul tableau results
    soit "torrents du jour/mois..." 1 tableau results par catégorie
    */
    var bg_rgb = "LemonChiffon"; // " rgba(0,250,0,0.2)";
    var text_rgb = "#009000 !important";
    var match_str = /.*(PC|INFO|DEV|HACK|PIRATE|HARDWARE|DOWNLOAD|MICRO|WINDOWS|INTERNET|GAME|JEUX|CSS|HTML|WEB|PROGRAM).*$/i;

    // on teste si cet element existe pour determiner si on est dans la page "resultats de recherche"
    $p2 = $("h2>span:contains('Résultats de Recherche')");
    if ($p2.length > 0) { // si titre "resultats recherche" existe

        /*
         * PAGE RESULTATS DE RECHERCHE
        **/

        //si titre existe, il n'y aura qu'un seul tableau results dans la page, le seul a cibler
        $data2 = $('table.results tbody tr');

        $.each($data2, function(index, val) {

            // cible categorie Presse
            $c_currtd = $(val).find('td:nth-child(1)');
            $c_link = $c_currtd.find('a:first');
            $c_match = $c_link.attr('href').match(/.*subcat=410.*/i);


            // verifie le titre du torrent
            $currtd = $(val).find('td:nth-child(2)');
            $link = $currtd.find('a:first');
            $match = $link.attr('title').match(match_str);

            //si category=Presse && si le titre matche avec le texte recherché
            if ($c_match && $match) {

                // applique un BG sur la TD
                $currtd.css({
                    "background-color" : bg_rgb,
                });

                // applique COLOR sur texte du lien
                $link.css({
                    "color" : text_rgb
                });

            }

        });

    }
    else{ //si le titre "resultats ..." n'est pas present

        /*
         * PAGE CONTENANT CATEGORIES (PRESSE,films, apps) (TORRENTS DU JOUR/MOIS/ETC)
        **/

        //cible le tableau results situé en dessous au titre "Presse"
        $p = $("h3:contains('Presse')");
        $data = $p.next('table.results').find('tbody tr');

        $.each($data, function(index, val) {
            $currtd = $(val).find('td:nth-child(2)');
            $link = $currtd.find('a:first');
            $match = $link.attr('title').match(match_str);

            //si trouve le texte dans un titre
            if ($match) {


                // applique un BG sur la TD
                $currtd.css({
                    "background-color" : bg_rgb,
                });

                // applique COLOR sur texte du lien
                $link.css({
                    "color" : text_rgb
                });

            }

        });

    }


});