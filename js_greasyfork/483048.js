// ==UserScript==
// @name         Freebitcoin Auto - Roll
// @namespace    http://daromalk
// @version      3.0.11
// @description  To support, register on my free bitco.in referral link : https://freebitco.in/?r=52394392
// @author       Daro
// @match        https://freebitco.in/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/483048/Freebitcoin%20Auto%20-%20Roll.user.js
// @updateURL https://update.greasyfork.org/scripts/483048/Freebitcoin%20Auto%20-%20Roll.meta.js
// ==/UserScript==

// Función principal para ejecutar el script
function main() {
    console.log("Status: Page loaded.");

    // Hacer clic en el botón  (entre 2 y 4 segundos)
    setTimeout(function () {
        $('#free_play_form_button').click();
        console.log("Status: Button ROLL clicked.");
        closePopup(); // Cerrar el popup después de otro tiempo aleatorio
    }, random(2000, 4000));
}

// Función para cerrar el popup después de un tiempo aleatorio (entre 12 y 18 segundos)
function closePopup() {
    setTimeout(function () {
        $('.close-reveal-modal')[0].click();
        console.log("Status: Button CLOSE POPUP clicked.");
        setTimeout(main, random(3605000, 3615000)); // Llamar a la función principal después de un tiempo aleatorio
    }, random(12000, 18000));
}

// Función para generar un número aleatorio entre un rango
function random(min, max) {
    return min + Math.random() * (max - min);
}

// Llamar a la función principal al cargar el documento
$(document).ready(function () {
    main();
});
