// ==UserScript==
// @name Ma belle Orion
// @namespace InGame
// @author Uriel (Original : https://greasyfork.org/fr/scripts/377251-dc-rebuilt/code )
// @date 26/01/2021
// @version 2.0.0
// @license WTF Public License; http://en.wikipedia.org/wiki/WTF_Public_License
// @include https://www.dreadcast.net/Main
// @include https://www.dreadcast.eu/Main
// @compat Firefox, Chrome, Opera
// @description Change la carte des extérieurs de DC
// @downloadURL https://update.greasyfork.org/scripts/420698/Ma%20belle%20Orion.user.js
// @updateURL https://update.greasyfork.org/scripts/420698/Ma%20belle%20Orion.meta.js
// ==/UserScript==
 
// Choix des rues impériales
// Lorkah 2013 : https://i.imgur.com/S6QxN9c.png
// Lumières rouges : https://i.imgur.com/EeD5Pud.jpg
// Lumières blanches (par défaut) : https://i.imgur.com/MOiCUpJ.jpg
// Lumières bleues : https://i.imgur.com/3IR8Ihk.jpg
// Changez l'url entre parenthèse ci-dessous
var mapS1 = "url(https://i.imgur.com/MOiCUpJ.jpg)";

// Choix des rues rebelles
// Lumières rouges (par défaut) : https://i.imgur.com/CSKqfYp.jpg
// Lumières blanches : https://i.imgur.com/8w1e2tg.jpg
// Lumières bleues : https://i.imgur.com/3IIBqRt.jpg
// Changez l'url entre parenthèse ci-dessous
var mapS3 = "url(https://i.imgur.com/CSKqfYp.jpg)";

window.setInterval(function(){

    if($('#carte_fond').css('background-image')==("url(\"https://www.dreadcast.net/images/carte/carte_rues_s2.png\")")){
        $('#carte_fond').css('background-image', mapS3);
        $('#carte_fond').css('background-color','rgb(57 57 57)');
    };

    if($('#carte_fond').css('background-image')==("url(\"https://www.dreadcast.net/images/carte/carte_rues_s1.png\")")){
        $('#carte_fond').css('background-image', mapS1);
        $('#carte_fond').css('background-color','rgb(57 57 57)');
    };
}, 500 );