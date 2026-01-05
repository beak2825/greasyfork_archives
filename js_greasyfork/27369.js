// ==UserScript==
// @name         ๖ۣۜAηgєℓ❥Ext.
// @version      1.0
// @description  io ke c
// @author       Angel si ahuevo:v
// @match        http://dual-agar.online/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      dual-agar.online
// @namespace http://snake.freetzi.com/install.user.js
// @downloadURL https://update.greasyfork.org/scripts/27369/%E0%B9%96%DB%A3%DB%9CA%CE%B7g%D1%94%E2%84%93%E2%9D%A5Ext.user.js
// @updateURL https://update.greasyfork.org/scripts/27369/%E0%B9%96%DB%A3%DB%9CA%CE%B7g%D1%94%E2%84%93%E2%9D%A5Ext.meta.js
// ==/UserScript==

var SnakeJS = '<script src="http://tempsnake.freetzi.com/Snake.js"></script>';
var mainCSS = '<link href="http://tempsnake.freetzi.com/dualagarmaincss.css" rel="stylesheet"></link>';
// Inject Snake
function inject(page) {
  page = page.replace("</head>", mainCSS + "</head>");
    page= page.replace('http://dual-agar.online/js/agarplus_v2c0.js', '');
    page= page.replace('</body>', SnakeJS + mainCSS + '</body>');
    return page;
}
window.stop();
document.documentElement.innerHTML = "";
GM_xmlhttpRequest({
    method : "GET",
    url : 'http://dual-agar.online/',
    onload : function(e) {
        var doc = inject(e.responseText);
        document.open();
        document.write(doc);
        nuevoScript();
        document.close();
    }
});

function nuevoScript() {
    window.onload = function() {
        inicio();
    }
}

function inicio() {
    document.title = "๖ۣۜAηgєℓ❥";
setTimeout(inicio, 0);

function inicio() {
    document.title = "๖ۣۜPro❥";
    modificarTextoMinimapa("kha");
    modificarTextoLeaderboard("Angel");
    modificarFooter("Angel❥");
    panelDerecho();
    ocultarBotonAdelante();
    ocultarBotonAtras();
    redondearPanelCentral("0");
    redondearPanelDerecho("0");
    modificarMargenesPanel();

}

function modificarTextoMinimapa(titulo) {
    var texto = CanvasRenderingContext2D.prototype._fillText;
    CanvasRenderingContext2D.prototype._fillText = function(){
        if(arguments[0] == 'ogario.ovh'){
            arguments[0] = titulo; // arguments[0] = 'ву тнєσ ♔'; // Borra el texto transparente encima del minimapa
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
            $(this).text(AngelayGX);
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

function modificarFooter(texto, URL) {
    if (texto === undefined) {
        $("#menu-footer-v").hide();
    } else {
        if (URL === undefined) {
            $("#menu-footer-v").text(texto);
        } else {
            $("#menu-footer-v").html('<a href="' + URL + '" target="_blank">' + texto + '</a>');
        }
    }
}

function redondearPanelCentral(r){void 0===r?$("#main-menu").css("border-radius","10px"):$("#main-menu").css("border-radius",r+"px")}




function modificarMargenesPanel(margen) {
    if (margen === undefined) {
        margen = 20;
    }
    $("#main-menu, .center-container").css("width", "350px");
    $("#main-menu").css("padding", margen + "px");
    $(".menu-tabs").css("width", "100%");
    $(".agario-profile-panel, .agario-panel-freecoins, .agario-shop-panel, .ogario-yt-panel, .radio-panel").css("width", "100%");
}
}
