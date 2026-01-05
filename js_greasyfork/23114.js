// ==UserScript==
// @name         Agarplus
// @version      2.5
// @author       Phantasy
// @match        http://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      agar.io
// @description  Es privado
// @namespace https://greasyfork.org/users/65396
// @downloadURL https://update.greasyfork.org/scripts/23114/Agarplus.user.js
// @updateURL https://update.greasyfork.org/scripts/23114/Agarplus.meta.js
// ==/UserScript==

// Copyright © 2016 ogario.ovh | OAG

if (location.host == "agar.io" && location.pathname == "/") {
    location.href = "http://agar.io/hslolite" + location.hash;
    return;
}
var fonts = '<link href="https://fonts.googleapis.com/css?family=Oswald:400,300" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500" rel="stylesheet">';
var hsloJS = '<script src="http://oag-agar.tk/HSLOLITE/main.js" charset="utf-8"></script>';
var hsloSniffJS = '<script src="http://oag-agar.tk/HSLOLITE/sniff.js"></script>';
var hsloCSS = '<link href="http://oag-agar.tk/HSLOLITE/style.css" rel="stylesheet"></link>';
var cpickerJS = '<script src="http://ogario.ovh/download/v2/dep/bootstrap-colorpicker.min.js"></script>';
var cpickerCSS = '<link href="http://ogario.ovh/download/v2/dep/bootstrap-colorpicker.min.css" rel="stylesheet"></link>';
var toastrJS = '<script src="http://ogario.ovh/download/v2/dep/toastr.min.js" charset="utf-8"></script>';
var toastrCSS = '<link href="http://ogario.ovh/download/v2/dep/toastr.min.css" rel="stylesheet"></link>';

function inject(page) {
    var _page = page.replace("</head>", cpickerCSS + toastrCSS + hsloCSS + cpickerJS + toastrJS + hsloSniffJS + fonts + "</head>");
    _page = _page.replace(/<script.*?>[\s]*?.*?window\.NREUM[\s\S]*?<\/script>/, "");
    _page = _page.replace(/<script.*?src=".*?agario\.core\.js.*?><\/script>/, "");
    _page = _page.replace("</body>", hsloJS + "</body>");
    return _page;
}

window.stop();
document.documentElement.innerHTML = "";
GM_xmlhttpRequest({
    method : "GET",
    url : "http://agar.io/",
    onload : function(e) {
        var doc = inject(e.responseText);
        document.open();
        document.write(doc);
        nuevoScript ();
        document.close();
    }
});

function nuevoScript() {
     window.onload = function() {
          inicio();
     }
}

function inicio() {
modificarTextoLeaderboard("Leaderboard")
document.title="Agarplus.io";
panelDerecho();
ocultarBotonAdelante();
ocultarBotonAtras();
redondearPanelCentral("20");
redondearPanelDerecho("20");
modificarMargenesPanel();
redondearControles("20");
colorPanelCentral
colorPanelDerecho
nuevoCursor("http://cur.cursors-4u.net/cursors/cur-11/cur1054.cur");


}

function modificarTextoMinimapa(titulo) {
    var texto = CanvasRenderingContext2D.prototype._fillText;
    CanvasRenderingContext2D.prototype._fillText = function(){
        if(arguments[0] == 'ogario.ovh'){
            arguments[0] = titulo;
        }
        return texto.apply(this,arguments);
    };
}
 
function modificarTextoLeaderboard(titulo) {
    var texto = $("h4.main-color").text();
    if (texto === "ogario.ovh") {
        $("h4.main-color").text(titulo);
    }
 
    // Cambia el leaderboard
    $("h4.main-color").on('DOMSubtreeModified', function() {
        var texto = $(this).text();
        if (texto !== "Leaderboard") {
            $(this).text(titulo);
        }
    });
}
 
function modificarCanalYoutube(titulo, ID) {
    $(".ogario-yt-panel").remove();
    $("#profile").append('<div class="agario-panel ogario-yt-panel"></div>');
    $(".ogario-yt-panel").append('<h5 class="main-color">' + titulo + '</h5>');
    $(".ogario-yt-panel").append(
        '<center><div class="g-ytsubscribe" data-channelid="' + ID + '" data-layout="full" data-theme="dark" data-count="default"></div></center>');
    $(".ogario-yt-panel").insertBefore(".radio-panel");
}