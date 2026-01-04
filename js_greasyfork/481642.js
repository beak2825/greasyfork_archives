    // ==UserScript==
    // @name         AllInOne
    // @namespace    http://tampermonkey.net/
    // @version      0.2
    // @description  AllInOne - Super Pacotão de Scripts
    // @author       VSCoutinho
    // @match        */*
    // @match        *://spoon.rekreasi.co.id/*
    // @icon         https://static-00.iconduck.com/assets.00/clock-stop-icon-256x256-evvlirzq.png
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481642/AllInOne.user.js
// @updateURL https://update.greasyfork.org/scripts/481642/AllInOne.meta.js
    // ==/UserScript==



// Aguarde o carregamento completo da página
document.addEventListener('DOMContentLoaded', function() {
    // Selecione o elemento do cronômetro pelo seletor de classe "_rnd-inner-counter_countdown"
    var cronometro = document.querySelector('._rnd-inner-counter_countdown');

    // Verifique se o elemento foi encontrado
    if (cronometro) {
        // Defina o valor do cronômetro como zero
        cronometro.innerText = '0:00';
    } else {
        console.error('Elemento do cronômetro não encontrado.');
    }
});
