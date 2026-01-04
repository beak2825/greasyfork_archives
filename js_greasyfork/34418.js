// ==UserScript==
// @name               [Helper] SNIR Compagnon
// @namespace          https://greasyfork.org/en/users/105361-randomusername404
// @description        Permet au chat de s'afficher correctement.
// @include            http://embed.tlk.io/*
// @version            1.04
// @run-at             document-start
// @require            https://code.jquery.com/jquery-3.2.1.min.js
// @author             RandomUsername404
// @grant              none
// @icon               https://tlk.io/images/apple-touch-icon-114x114-precomposed.png
// @downloadURL https://update.greasyfork.org/scripts/34418/%5BHelper%5D%20SNIR%20Compagnon.user.js
// @updateURL https://update.greasyfork.org/scripts/34418/%5BHelper%5D%20SNIR%20Compagnon.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
$(document).ready(function () {

    $("html").css("background","#26282c");
    $("#channel").append(" | alt+x");
    $("#channel").css({"margin-left":"25%","margin-right":"25%"});
       
        $(document).keyup(function(e) {
	    if(e.which == 18) {
	        isAlt = false; }
	});
	$(document).keydown(function(e) {
		if(e.which == 18) {
            isAlt = true; }
		if(e.which == 88 && isAlt) { 
            if ($("html").css('background') == "transparent") {
                $("html").css({"background":"rgb(38, 40, 44)","overflow":"auto"});
            }
            else {
                $("html").css({"background":"transparent","overflow":"hidden"});
            }
            $("body").toggle();} 
	});
    
    // Connaitre valeur de la touche : http://jsfiddle.net/gFcuU/

});