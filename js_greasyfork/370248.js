// ==UserScript==
// @name		WebiSmile
// @namespace	WS
// @version		0.1
// @author		Virality VeboTok
// @description Permet d'avoir plus d'emojis perso sur Webidev
// @include     http://webidev.fr/*
// @icon		https://image.ibb.co/mCskK8/webismile.png
// @iconURL     https://image.ibb.co/mCskK8/webismile.png
// @copyright	2018, D Vnh
// @require		http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @grant		GM_info
// @grant		GM_setValue
// @grant		GM_getValue
// @grant		GM_deleteValue
// @grant		GM_xmlhttpRequest
// @grant		GM_getResourceURL
// @downloadURL https://update.greasyfork.org/scripts/370248/WebiSmile.user.js
// @updateURL https://update.greasyfork.org/scripts/370248/WebiSmile.meta.js
// ==/UserScript==
var version = '0.1';
var uw = unsafeWindow || window, $ = uw.jQuery || jQuery, DATA, GM;
// GM-API
GM = (typeof GM_info === 'object');

// HTML
$('footer').append('<div class="WebiSmile" style="position:absolute;width:32px;height:32px;background:url(https://image.ibb.co/gWvGRo/webismall.png);top:4px;left:8px;"></div>');

// EMOJIS
var WebiSmileList = "https://image.ibb.co/gWvGRo/webismall.png\n" +
                    "https://image.ibb.co/iRr198/32x32.png\n" +
                    "findeliste";

// Parcours
var retour = WebiSmileList.match(/^.+/g);
var compt = 900;
while (retour[0] != "findeliste") {
    // Actualise la liste de smiley en enlevant celui prélevé plus tôt
    WebiSmileList = WebiSmileList.substring(retour[0].length+1);
    // Place le smileymoji dans la liste.
    $('.liste_smiley').append('<span class="icone_smiley" id="val-'+String(compt)+'"><img class="WebiSmiley_smiley" src="'+retour[0] +'"></span>');
    // Actualise le retour
    retour = WebiSmileList.match(/^.+/g);
}

// Onclick
$('.WebiSmiley_smiley').click(function() {
   var val = $(this).attr('src');
   $('#message').val($('#message').val() + " [img]" + val + "[/img]");
});


