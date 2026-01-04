// ==UserScript==
// @name        Script do Anão - fatalmodel.com
// @namespace   Violentmonkey Scripts
// @match       https://fatalmodel.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 10/12/2023, 14:37:28
// @downloadURL https://update.greasyfork.org/scripts/481892/Script%20do%20An%C3%A3o%20-%20fatalmodelcom.user.js
// @updateURL https://update.greasyfork.org/scripts/481892/Script%20do%20An%C3%A3o%20-%20fatalmodelcom.meta.js
// ==/UserScript==

document.addEventListener('click', function() {
    setTimeout(function() {
        verificarERemoverAutoBlocked();
        removerElementosPremium();
    }, 500);
});

function verificarERemoverAutoBlocked() {
    var elementosAutoBlocked = document.querySelectorAll('.grid-gallery__post.grid-gallery__post–auto-blocked');

    elementosAutoBlocked.forEach(function(elemento) {
        elemento.classList.remove('grid-gallery__post–auto-blocked');
    });
}


function removerElementosPremium() {
    var elementosPremium = document.querySelectorAll('.grid-gallery__post.grid-gallery__post–premium');

    elementosPremium.forEach(function(elemento) {
         elemento.classList.remove('grid-gallery__post–premium');
    });
}