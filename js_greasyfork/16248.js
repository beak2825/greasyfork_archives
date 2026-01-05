// ==UserScript==
// @name        New Extencion ( IGARIO )
// @namespace   Striker ^^
// @description New Extencion!
// @include     https://agar.io/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @author      irmgrx
// @version     1
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/16248/New%20Extencion%20%28%20IGARIO%20%29.user.js
// @updateURL https://update.greasyfork.org/scripts/16248/New%20Extencion%20%28%20IGARIO%20%29.meta.js
// ==/UserScript==

console.log("GreaseMonkey Loading");

(function(){
    var JQUERY = "https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"
    var MAINOUT = "https://googledrive.com/host/0B-pE6yLMAbwMemcwSlNzZjNlOEU";
    var CSSFILE = "https://googledrive.com/host/0B-pE6yLMAbwMX1dtRkdiM3M1WWM";
    var SOCKETIO = "https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.7/socket.io.min.js";

    if(location.host == "agar.io" && location.pathname=="/"){
        location.href="http://agar.io/igar" + location.hash;
        return;
    }
    $("head").append('<link rel="stylesheet" href="'+ CSSFILE +'">');
    $.getScript(JQUERY, function( data, textStatus, jqxhr ) {
      $.getScript(SOCKETIO, function( data, textStatus, jqxhr ) {
        $.getScript(MAINOUT);
      });
    });
})();
