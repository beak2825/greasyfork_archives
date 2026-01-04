// ==UserScript==
// @name         Mover Botón Ataque
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Mueve el botón de ataque
// @match        https://*.grepolis.com/game/*
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/462966/Mover%20Bot%C3%B3n%20Ataque.user.js
// @updateURL https://update.greasyfork.org/scripts/462966/Mover%20Bot%C3%B3n%20Ataque.meta.js
// ==/UserScript==
//          _____                    _____                    _____                    _____
//         /\    \                  /\    \                  /\    \                  /\    \
//        /::\    \                /::\    \                /::\    \                /::\    \
//       /::::\    \              /::::\    \              /::::\    \              /::::\    \
//      /::::::\    \            /::::::\    \            /::::::\    \            /::::::\    \
//     /:::/\:::\    \          /:::/\:::\    \          /:::/\:::\    \          /:::/\:::\    \
//    /:::/  \:::\    \        /:::/__\:::\    \        /:::/__\:::\    \        /:::/__\:::\    \
//   /:::/    \:::\    \      /::::\   \:::\    \      /::::\   \:::\    \      /::::\   \:::\    \
//  /:::/    / \:::\    \    /::::::\   \:::\    \    /::::::\   \:::\    \    /::::::\   \:::\    \
// /:::/    /   \:::\    \  /:::/\:::\   \:::\    \  /:::/\:::\   \:::\____\  /:::/\:::\   \:::\    \
///:::/____/     \:::\____\/:::/__\:::\   \:::\____\/:::/  \:::\   \:::|    |/:::/  \:::\   \:::\____\
//\:::\    \      \::/    /\:::\   \:::\   \::/    /\::/    \:::\  /:::|____|\::/    \:::\  /:::/    /
// \:::\    \      \/____/  \:::\   \:::\   \/____/  \/_____/\:::\/:::/    /  \/____/ \:::\/:::/    /
//  \:::\    \               \:::\   \:::\    \               \::::::/    /            \::::::/    /
//   \:::\    \               \:::\   \:::\____\               \::::/    /              \::::/    /
//    \:::\    \               \:::\   \::/    /                \::/____/               /:::/    /
//     \:::\    \               \:::\   \/____/                  ~~                    /:::/    /
//      \:::\    \               \:::\    \                                           /:::/    /
//       \:::\____\               \:::\____\                                         /:::/    /
//        \::/    /                \::/    /                                         \::/    /
//         \/____/                  \/____/                                           \/____/





/////////////////////////////////////////////////////////////////
//                                                             //
//  Parte principal del script,carga las funciones e inteerfaz //
//     (Copiado completamente del script de lanuevacepa)       //
//                                                             //
/////////////////////////////////////////////////////////////////


var ajustesTimming = GM_getValue("settingTimming", 0);
documentoCargado();
cargarCSS();
observadorAjax();
adjuntarScript("moverMarco", moverMarco.toString())
moverMarco = new moverMarco;


////////////////////////////////////////////////////////////////////////////////
//                                                                            //
//     Funcion para comprobar si el grepolis ha sido cargado completamente.   //
//     Si es asi, carga la interfaz del Script y añade los Ajax Observers     //
//     (Copiado completamente del script de lanuevacepa)                      //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////

function documentoCargado() {
    var intervalo = setInterval(function () {
        if (
            document.readyState === "complete" &&
            $(".tb_activities.toolbar_activities .middle")[0]
        ) {
            clearInterval(intervalo);
            cargarBoton();
            var cambioEnJuego = new MutationObserver(function () {
            });
            cambioEnJuego.observe(document.getElementsByTagName("body")[0], {
                childList: true,
            });
            var observadorOrdenes = new MutationObserver(function () {
                cambioEnOrdenes();
            });
            observadorOrdenes.observe(
                document.getElementById("toolbar_activity_commands_list"),
                { attributes: true, subtree: true }
            );
        }
    }, 100);
}
////////////////////////////////////////////////////////////////////////////////
//                                                                            //
//     Funcion para cargar la hoja de estilos (como se ve la pagina)          //
//     (Copiado completamente del script de lanuevacepa)                      //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////

function cargarCSS() {
    var css = document.createElement('style');
    var style='.sandy-box .item.command{   height: 54px !important;}.indicatorAankomst {	color: rgba(0, 0, 0, 0.5) ;	font-size: xx-small ;   position: relative;   display: flex;   line-height: 0px;}'
    css.appendChild(document.createTextNode(style));
    document.getElementsByTagName("head")[0].appendChild(css);
}



////////////////////////////////////////////////////////////////////////////////
//                                                                            //
//     Funcion para poder mover el cuadro de ordenes por la pantalla          //
//     (copiada completamente importada del pulpo)                            //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////


function moverMarco() {
    function f() {
        if (0 == $("#toolbar_activity_commands_list").length) {
            setTimeout(function () {
                f();
            }, 500);
        } else {
            var A = document.querySelector("#toolbar_activity_commands_list");
            if (0 == $("#grcrt_taclWrap").length) {
                if ($("#toolbar_activity_commands_list").wrap($("<div/>", { "class": "grcrt_taclWrap", id: "grcrt_taclWrap" })), true) {
                    $("#toolbar_activity_commands_list").addClass("grcrt_tacl");
                    $("#grcrt_taclWrap").draggable().draggable("enable");
                    var c = new MutationObserver(function (h) {
                        h.forEach(function (k) {
                            $(A).hasClass("grcrt_tacl") && $("#grcrt_taclWrap").attr("style") && "none" == $(A).css("display") && $(".activity.commands").trigger("mouseenter");
                        });
                    });
                    0 == $("#toolbar_activity_commands_list>.js-dropdown-list>a.cancel").length && $("#toolbar_activity_commands_list>.js-dropdown-list").append($("<a/>", { href: "#n", "class": "cancel", style: "display:none;" }).click(function () {
                        $("#grcrt_taclWrap").removeAttr("style");
                    }));
                    c.observe(A, { attributes: !0, childList: !1, characterData: !1 });
                } else {
                    $("#toolbar_activity_commands_list").removeClass("grcrt_tacl"), $("#grcrt_taclWrap").draggable().draggable("disable").removeAttr("style");
                }
            }
            $(A).hasClass("grcrt_tacl") && $("#grcrt_taclWrap").attr("style") && $(".activity.commands").trigger("mouseenter");
        }
    }
    $("head").append($("<style/>").append($("<style/>").append(".showImportant { bisplay: block !important}").append("#grcrt_taclWrap { left:312px; position: absolute; top: 29px;}").append("#grcrt_taclWrap>#toolbar_activity_commands_list { left: 0 !important; top: 0 !important;}").append(".grcrt_tacl { z-index:5000 !important;}").append(".grcrt_tacl>.js-dropdown-list>a.cancel { position: relative; float: right; margin-bottom: 11px;display:none; opacity: 0; visibility: hidden; transition: visibility 0s, opacity 0.5s linear;}").append(".grcrt_tacl>.js-dropdown-list:hover>a.cancel { display: block !important; visibility: visible; opacity: 0.5;}").append(".grcrt_tacl>.js-dropdown-list>a.cancel:hover { opacity: 1;}")));
    $.Observer(GameEvents.command.send_unit).subscribe("moverMarco_command_send", function () {
        f();
    });
    f();
}


////////////////////////////////////////////////////////////////////////////////
//                                                                            //
//     Funcion para adjuntar todo el script creado al navegador para que      //
//     que pueda ser usado                                                    //
//     (Copiado completamente del script de lanuevacepa)                      //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////

function adjuntarScript(f, A) {
    var c = document.createElement("script");
    c.type = "text/javascript";
    c.id = f;
    c.textContent = A;
    document.body.appendChild(c);
}



////////////////////////////////////////////////////////////////////////////////
//                                                                            //
//     Funcion para mover ligeramente el boton de "atacar" para que           //
//     este  quede mas cerca y puedas cancelar y mandar la orden de una       //
//     manera mas rapida                                                      //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////

function unidadMandada() {
var boton = document.getElementById('btn_attack_town');
boton.style.position = 'relative';
boton.style.left = '490px';
boton.style.top = '-285px';
}




/////////////////////////////////////////////////////////////////////////////////
//                                                                             //
//     Funcion encargada de detectar los cambios en las ordenes y la pantalla  //
//     de mandar "ataque" o "refuerzo" y ejecutar la funcion en cuestion       //
//     (Copiado completamente del script de lanuevacepa)                       //
//                                                                             //
/////////////////////////////////////////////////////////////////////////////////
function observadorAjax() {
    $(document).ajaxComplete(function (e, xhr, opt) {
        var url = opt.url.split("?"), action = "";
        if (typeof (url[1]) !== "undefined" && typeof (url[1].split(/&/)[1]) !== "undefined") {
            action = url[0].substr(5) + "/" + url[1].split(/&/)[1].substr(7);
        }
        switch (action) {
            case "/town_info/attack":
            case "/town_info/support":
                unidadMandada();
                break;
        }
    });
}