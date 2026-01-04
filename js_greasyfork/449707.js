// ==UserScript==
// @name         SUAP-TRIVALE
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Helper para trabalhar processos TRIVALE!
// @author       Rômulo Barros
// @match        https://suap.ifpi.edu.br/processo_eletronico/caixa_processos/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.br
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449707/SUAP-TRIVALE.user.js
// @updateURL https://update.greasyfork.org/scripts/449707/SUAP-TRIVALE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let titulos_processos = document.querySelectorAll('div.primary-info > h4');
    let bola_do_num = document.querySelectorAll('div.primary-info > h4 > small');
    let modulos_processos = document.querySelectorAll('div.general-box');

    const aumenta_bola = function(bola) {
        bola.style.left = "-2%";
        bola.style.top = "5%";
        bola.style.height = "50px";
        bola.style.width = "50px";
    }

    const pinta_bola = function(bola, cor) {
        bola.style.backgroundColor = cor;
        bola.style.color = "white";
    }

    const ajusta_texto_bola = function(bola) {
        bola.style.fontSize = "20px";
        bola.style.lineHeight = "38px";
    }

    const escreve_na_bola = function(bola, texto) {
        bola.innerText = texto;
    }

    const formata_bola = function(bola, cor, texto) {
        aumenta_bola(bola);
        pinta_bola(bola, cor);
        ajusta_texto_bola(bola);
        escreve_na_bola(bola, texto);
    }

    for (let i = 0; i < titulos_processos.length; i++) {

        let titulo = titulos_processos[i];
        let bola = bola_do_num[i];

        if(titulo.innerText.match(/(ABASTECIMENTO)/gi) != null) {
            formata_bola(bola, "green", "Ab");

        } else if (titulo.innerText.match(/(MANUTENÇÃO)/gi) != null) {
            formata_bola(bola, "blue", "Ma");
        }

        titulo.innerHTML = titulo.innerHTML.replace(/(CAMPUS \D+$)/gi, '<strong style="background-color:black;color:white">$1</strong>');

        /*if(titulo.innerText.match("ABASTECIMENTO") != null) {
            titulo.parentElement.parentElement.style.backgroundColor = "#88d82e33";
        } else if (titulo.innerText.match("MANUTENÇÃO") != null) {
            titulo.parentElement.parentElement.style.backgroundColor = "#2e31d833";
        }*/
    }

})();