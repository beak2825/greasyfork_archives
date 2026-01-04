// ==UserScript==
// @name         PreencheDadosBasicosIndFront
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Script para preencher as informações básicas para lançar a indenização de fronteira no siapenet
// @author       Leobons
// @match        https://www4.siapenet.gov.br/orgao/ConcessaoAdicional*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405071/PreencheDadosBasicosIndFront.user.js
// @updateURL https://update.greasyfork.org/scripts/405071/PreencheDadosBasicosIndFront.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url_atual = window.location.href;

    switch(url_atual){
        case "https://www4.siapenet.gov.br/orgao/ConcessaoAdicional.do?method=iniciarInclusao":
            var adicional = document.getElementById("adicional");
            adicional.value = "10";
            break;

        case "https://www4.siapenet.gov.br/orgao/ConcessaoAdicional.do?method=gravarConcessaoFrequencia":

        case "https://www4.siapenet.gov.br/orgao/ConcessaoAdicional.do?method=incluirTipo1":
            var codigo = document.getElementById("codigoDiplomaLegal");
            codigo.value = "01";

            var numero = document.getElementById("numeroDiplomaLegal");
            numero.value = "12855";

            var data = document.getElementById("dataPublicacaoDiplomaLegal");
            data.value = "02/09/2013";

            var hora = document.getElementById("qtHoras");
            hora.value = "";

            var dataInicio = document.getElementById("dataInicio");
            dataInicio.value = "";
            dataInicio.focus();
            break;
    }



})();