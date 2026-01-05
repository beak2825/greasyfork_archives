// ==UserScript==
// @name         T411 - gray torrents over 5go
// @name:fr      T411 - grise les torrents de plus de 5go
// @namespace    T411 - gray torrents over 5go
// @version      0.0.2
// @description  gray torrents over 5go T411
// @description:fr  grise les torrents de plus de 5go T411
// @author       rot
// @match        *://*.t411.ai/torrents/search/*
// @match        *://*.t411.ai/top/week*
// @match        *://*.t411.ai/top/today*
// @match        *://*.t411.ai/top/month*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/28836/T411%20-%20gray%20torrents%20over%205go.user.js
// @updateURL https://update.greasyfork.org/scripts/28836/T411%20-%20gray%20torrents%20over%205go.meta.js
// ==/UserScript==

$(document).ready(function() {
    $data = $('table.results tbody tr');

    $.each($data, function(index, val) {
        $currtd = $(val).find('td:nth-child(6)'); //colonne du poids
        $text = $currtd.text();
        $match = $text.match(/.+GB$/i);


		var number = parseFloat($text);


		//si trouve GB dans la cellule
        if ($match) {

            // defini couleurs selon la taille trouvee :

            // 5 GB a 10 GB
            if (number>5 && number<10){
				text_rgb = ' #777'; //gris foncé
			}
            // 10 GB et plus
            else if(number>=10){
				text_rgb = ' #bbb'; // gris clair
			}
            // defaut : 1 GB a 5 GB
            else{
				text_rgb = ' #000'; // noir d'origine
            }


            // pour couleur unique (griser si > 5 GB)
			// if (number>5) text_rgb = ' #888';

            //
            // applique le style
            $( "td,a", val).css({
                'color' : text_rgb
            }).removeClass('up down');

        }

    });
});