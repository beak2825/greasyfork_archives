// ==UserScript==
// @name         adfreeway
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  O amanhã poderá ser tarde demais !!!
// @author       Keno venas
// @license       MIT
// @match        https://adfreeway.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=adfreeway.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492447/adfreeway.user.js
// @updateURL https://update.greasyfork.org/scripts/492447/adfreeway.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style = document.createElement('style');
    style.innerHTML = `
        #contador {
            position: fixed;
            top: 10px;
            left: 10px;
            color: black;
            background-color: blue;
            padding: 5px 10px;
            border-radius: 5px;
            z-index: 9999;
        }
    `;
    document.head.appendChild(style);
    var contadorElement = $('<div id="contador">');
    $('body').append(contadorElement);
    function atualizarContador(segundos) {
        contadorElement.text(segundos);
    }
    function recarregarPagina() {
        var segundos = 10;
        atualizarContador(segundos);

        setInterval(function() {
            segundos--;
            atualizarContador(segundos);

            if (segundos === 0) {
                location.reload();
            }
        }, 1000);
    }
    recarregarPagina();
    function clickButtons() {
        var buttons = document.querySelectorAll('.left-btn-form > input:nth-child(3)');
        buttons.forEach(function(button) {
            setTimeout(function() {
                button.click();
            }, 5000);
        });
    }
    function clickLikeNatureButton() {
        var likeNatureButton = document.querySelector('img#like-nature');
        if (likeNatureButton) {
            setTimeout(function() {
                likeNatureButton.click();
            }, 5000);
        }
    }
    window.addEventListener('load', function() {
        clickButtons();
        clickLikeNatureButton();
    });
})();