// ==UserScript==
// @name            Le Parisiene Full Text Articles
// @name:it         Le Parisiene Articoli
// @namespace       *
// @version         2.0.0
// @description     Show the full text of Le Parisiene
// @description:it  Mostra il testo completo degli articoli su Le Parisiene
// @description:fr  Afficher le texte intégral des articles Le Parisiene
// @author          Matteo De Marchi
// @match           https://www.leparisien.fr/*
// @grant           none
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/421193/Le%20Parisiene%20Full%20Text%20Articles.user.js
// @updateURL https://update.greasyfork.org/scripts/421193/Le%20Parisiene%20Full%20Text%20Articles.meta.js
// ==/UserScript==


(function () {
  'use strict';
    var timer = setInterval(function() {
        /*CHECK EVERY 1 SECONDS BECAUSE OBFUSCATION START AFTER N SECONDS*/
        var _elements = document.getElementsByClassName("content paywall-abo blurText")
        if(_elements){
            var i;
            for (i = 0; i < _elements.length; i++) {
                _elements[i].classList.remove("blurText");
            }
            clearInterval(timer);
        }
    }, 1000);
})()




