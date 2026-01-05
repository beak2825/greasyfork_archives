// ==UserScript==
// @name        【电勒】EXTENSION BY PSYCO 
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Macros y ventajas de splits, etc. Requiere tener activado las opciones "Dark theme" y "Show Mass".
// @author       Minish Agario
// @match        http://abs0rb.me/*
// @match        http://agar.io/*
// @match        http://agarabi.com/*
// @match        http://agarly.com/*
// @match        http://agar.pro/*
// @match        http://agar.biz/*
// @match        http://agar.gs/*
// @match        http://gamelo.io/*
// @match        http://play.ogarul.tk/*
// @match        http://warlis.io/*
// @match        http://ogar.pw/BETA/INDEX2.PHP*
// @match        http://ogar.pw/beta/index2.php*
// @match        http://ogar.pw/beta/index.php*
// @match        http://ogar.pw*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/24651/%E3%80%90%E7%94%B5%E5%8B%92%E3%80%91EXTENSION%20BY%20PSYCO.user.js
// @updateURL https://update.greasyfork.org/scripts/24651/%E3%80%90%E7%94%B5%E5%8B%92%E3%80%91EXTENSION%20BY%20PSYCO.meta.js
// ==/UserScript==

//List instructions
var i = document.getElementById("instructions");
i.innerHTML += "<center>EXTENSION BY PSYCOLOGY</center>";
i.innerHTML += "<center>PRESIONA  <b>4 ( 2 VECES SEGUIDAS)</b>PARA TRICKSPLIT</center>";
i.innerHTML += "<center>Presiona <b>3</b>para TRIPLESPLIT</center>";
i.innerHTML += "<center>Presiona <b>2</b>para DOBLESPLIT</center>";
i.innerHTML += "<center>Presiona <b>W SEGUIDO</b>para DAR MASA RAPIDO</center>";
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
var DioMasa = false;
var MovDetenido = false;
var DuracionDelay = 25;
// Función de macro dar masa con W
function funcionmasa() {
    if (DioMasa) {
        window.onkeydown({keyCode: 87});
        window.onkeyup({keyCode: 87});
        setTimeout(funcionmasa, DuracionDelay);
    }
}
// Función de macro split
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