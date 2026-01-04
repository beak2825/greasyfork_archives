// ==UserScript==
// @name         Marcar Hora en ventana
// @namespace    Marcar Hora en ventana
// @version      0.1.1
// @description  Marca la hora de llegada de la orden en la ventana flotante
// @author       You
// @match        https://*.grepolis.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grepolis.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488346/Marcar%20Hora%20en%20ventana.user.js
// @updateURL https://update.greasyfork.org/scripts/488346/Marcar%20Hora%20en%20ventana.meta.js
// ==/UserScript==


(function() {
    'use strict';
documentoCargado();
observadorAjax();
moverMarco = new moverMarco;
var cuenta = 0

// Funciones generales
//////////////////////
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


function documentoCargado() {
    var intervalo = setInterval(function () {
        if (
            document.readyState === "complete" &&
            $(".tb_activities.toolbar_activities .middle")[0]
        ) {
            clearInterval(intervalo);

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

function formatearFecha(timestamp){
    var tiempoTotal = new Date(timestamp*1000);
    var tiempoHora = tiempoTotal.getHours();
    if (tiempoTotal.getHours() < 10){
        tiempoHora = "0" + tiempoTotal.getHours();
    }
    var tiempoMin = tiempoTotal.getMinutes();
    if (tiempoTotal.getMinutes() < 10){
        tiempoMin = "0" + tiempoTotal.getMinutes();
    }
    var tiempoSeg = tiempoTotal.getSeconds();
    if (tiempoTotal.getSeconds() < 10){
        tiempoSeg = "0" + tiempoTotal.getSeconds();
    }
    var tiempoInfo = tiempoHora + ":" + tiempoMin + ":" + tiempoSeg;
    return tiempoInfo
}

function stringToTimestamp(dateString) { // DateString format => "hh:mm:ss"
    const divisions = dateString.split(":");
    let hora = parseInt(divisions[0], 10);
    let min = parseInt(divisions[1], 10);
    let seg = parseInt(divisions[2],10);
    return hora*3600 + min*60 +seg // Paso la fecha a segundos
}

function loadCSS(){
    var css = document.createElement('style');
    var style='.sandy-box .item.command{ height: 54px !important;}.indicador { color: red ; font-size: 100% ; position: relative; display: flex; line-height: 0px; margin-top: -2px}'
    css.appendChild(document.createTextNode(style));
    document.getElementsByTagName("head")[0].appendChild(css);
}



function cambioEnOrdenes() {
    var commandList = document.querySelector("#toolbar_activity_commands_list");
    var movimientos = commandList.querySelector(".js-dropdown-item-list");
    for (var i = 0; i < movimientos.children.length; i++) {
        var movimiento = movimientos.children[i];
        var fecha = movimiento.dataset.timestamp;
        var tiempoInfo = formatearFecha(movimiento.dataset.timestamp)

        if (movimiento.children[0].children[1].children[2] == null || !movimiento.children[0].children[1].children[2].classList.contains("indicador")){
            if (!indicador || indicador.length < movimientos.children.length){
                var indicador = document.createElement("div");
                indicador.className = "indicador";
                var indicadorTexto = document.createElement("p");
                indicadorTexto.innerHTML = tiempoInfo;
                indicador.appendChild(indicadorTexto);
                indicadorTexto.style.fontSize = "1.2em";
                indicadorTexto.style.fontWeight = "bold";
                var textoElemento = document.createElement("div");
                indicador.appendChild(textoElemento);
                var indicatorAjuste = document.createElement("div");
                indicatorAjuste.setAttribute("style", "width:1em;background:red;margin-left: 0.3em;");
                loadCSS();
                if (movimiento.children[0].children[1].children[2] == null){
                    movimiento.children[0].children[1].appendChild(indicador)
                }else{
                    var oldIndicator = movimiento.children[0].children[1].children[2];
                    oldIndicator.style.display = "none";
                    movimiento.children[0].children[1].replaceChild(indicador, movimiento.children[0].children[1].children[2]);
                    movimiento.children[0].children[1].appendChild(oldIndicator)
                }
            }

        }

    }
}
// Esto no se que hace pero ahi lo dejo xd
//////////////////////////////////////////
function unidadMandada() {
    $('<style>' +
      '.attack_support_window .send_units_form .button_wrapper { text-align:left; padding-left:1px; }' +
      '#gt_delete { display: none; }' +
      '.attack_support_window .additional_info_wrapper .town_info_duration_pos_alt { min-height: 50px; } ' +
      '.attack_support_window .additional_info_wrapper .town_info_duration_pos { min-height: 62px!important; } ' +
      '</style>').appendTo($('.attack_support_window').parent());
    $('.breaker').remove()
}


// Función encargada de interceptar los cambios en la página.
/////////////////////////////////////////////////////////////
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
    })();