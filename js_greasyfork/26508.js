// ==UserScript==
// @name         SwepSplit
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Swep extensão, para funcionar ative o "DarkTheme" e o "ShowMass".
// @author       Swep(Mateus)
// @match        *.agar.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/26508/SwepSplit.user.js
// @updateURL https://update.greasyfork.org/scripts/26508/SwepSplit.meta.js
// ==/UserScript==

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
var DioMasa = false;
var MovDetenido = false;
var DuracionDelay = 25;
AplicarConfiguracion();
function AplicarConfiguracão() {
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
// Função de Swep dar massa com W
function FunçãoMassa() {
    if (DioMasa) {
        window.onkeydown({keyCode: 87});
        window.onkeyup({keyCode: 87});
        setTimeout(funcionmasa, DuracionDelay);
    }
}
// Função de Swep Split
function DarSplit() {
    $("body").trigger($.Event("keydown", { keyCode: 32}));
    $("body").trigger($.Event("keyup", { keyCode: 32}));
}
function keydown(event) {
    if (event.keyCode == 87 && DioMasa === false) {
        DioMasa = true;
        setTimeout(funcionmasa, DuracionDelay);
    } // Dar massa
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
    } // Split Normal (Split 1x)
    if (event.keyCode == 83) {
        X = window.innerWidth/2;
        Y = window.innerHeight/2;
        $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
    } // Detener movimiento
}
// Quando o jogador parar de der massa com w ele para.
function keyup(event) {
    if (event.keyCode == 87) {
        DioMasa = false;
    }
}