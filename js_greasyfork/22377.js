// ==UserScript==
// @name         SPARTAN DZ GAMER agario y copias de agario
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  SPARTAN y ventajas de splits, etc. Requiere tener activado las opciones "Dark theme" y "Show Mass".
// @author       Minish Agario
// @match        http://abs0rb.me/*
// @match        http://agar.io/*
// @match        http://agarabi.com/*
// @match        http://agarly.com/*
// @match        http://agar.pro/*
// @match        http://agar.biz/*
// @match        http://agar.gs/*
// @match        http://gamelo.io/*
// @match        http://petridish.pw/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/22377/SPARTAN%20DZ%20GAMER%20agario%20y%20copias%20de%20agario.user.js
// @updateURL https://update.greasyfork.org/scripts/22377/SPARTAN%20DZ%20GAMER%20agario%20y%20copias%20de%20agario.meta.js
// ==/UserScript==
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
var DioMasa = false;
var MovDetenido = false;
var DuracionDelay = 25;
AplicarConfiguracion();
function AplicarConfiguracion() {
    if (document.getElementById("overlays").style.display!="none") {
        document.getElementById("settings").style.display = "block";
        if (document.getElementById('showMass').checked) {document.getElementById('showMass').click();}
        document.getElementById('showMass').click();
        if (document.getElementById('darkTheme').checked) {document.getElementById('darkTheme').click();}
        document.getElementById('darkTheme').click();
    } else {
        setTimeout(AplicarConfiguracion, 100);
    }
}
// Función de SPARTAN dar masa con W
function funcionmasa() {
    if (DioMasa) {
        window.onkeydown({keyCode: 87});
        window.onkeyup({keyCode: 87});
        setTimeout(funcionmasa, DuracionDelay);
    }
}
// Función de SPARTAN split
function DarSplit() {
    $("body").trigger($.Event("keydown", { keyCode: 32}));
    $("body").trigger($.Event("keyup", { keyCode: 32}));
}
function keydown(event) {
    if (event.keyCode == 87 && DioMasa === false) {
        DioMasa = true;
        setTimeout(funcionmasa, DuracionDelay);
    } // Dar masa
    if (event.keyCode == 52) {
        DarSplit();
        setTimeout(DarSplit, DuracionDelay);
        setTimeout(DarSplit, DuracionDelay*2);
        setTimeout(DarSplit, DuracionDelay*3);
    } // Tricksplit (Split 4x)
    if (event.keyCode == 51) {
        DarSplit();
        setTimeout(DarSplit, DuracionDelay);
        setTimeout(DarSplit, DuracionDelay*2);
    } // Triplesplit (Split 3x)
    if (event.keyCode == 50) {
        DarSplit();
        setTimeout(DarSplit, DuracionDelay);
    } // Doublesplit (Split 2x)
    if (event.keyCode == 49) {
        DarSplit();
    } // Split normal (Split 1x)
    if (event.keyCode == 83) {
        X = window.innerWidth/2;
        Y = window.innerHeight/2;
        $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
    } // Detener movimiento
}
// Cuando el jugador para de dar con W, deja de dar masa.
function keyup(event) {
    if (event.keyCode == 87) {
        DioMasa = false;
    }
}