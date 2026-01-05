// ==UserScript==
// @name        Post Enter - Voxed
// @namespace   https://voxed.net
// @version     1.0
// @description Comentar con la tecla Enter.
// @match       voxed.net/*
// @copyright   2016, Hhaz.
// @author      Hhaz
// @downloadURL https://update.greasyfork.org/scripts/25030/Post%20Enter%20-%20Voxed.user.js
// @updateURL https://update.greasyfork.org/scripts/25030/Post%20Enter%20-%20Voxed.meta.js
// ==/UserScript==

    $("#content").keypress(function(e){
        if ( e.which == 13 && e.shiftKey ){
        }else if(e.which == 13){
            $("#comBoton").click();
 	 	}
    });

$(document).ready(function(){
    $(".control").click(function(){
        $(this).css("content", "url(http://i.imgur.com/UPhSha9.png)");
        $(this).css("width", "105px");
        $(this).css("height", "52px");
    });
});