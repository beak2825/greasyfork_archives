// ==UserScript==
// @name         Carimbador GED
// @namespace    http://tampermonkey.net/
// @version      2023-12-26
// @description  Carimba os documentos GED do eemop!
// @author       Lucas de Souza Monteiro
// @license      MIT
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @match        http://sigeduca.seduc.mt.gov.br/ged/hwgedteladocumento.aspx?*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484254/Carimbador%20GED.user.js
// @updateURL https://update.greasyfork.org/scripts/484254/Carimbador%20GED.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var aTags = document.getElementsByTagName("span");
    var searchText1 = "Secretário(a)";
    var searchText2 = "Diretor(a)";
    var secretario = " Lucas de Souza Monteiro \r\n Secretário Escolar \r\n Portaria nº1.677/2023/GS/SEDUC/MT ";
    var diretor = " Rodrigo Leandro Lemes Gonçalves \r\n Diretor Escolar \r\n Portaria nº1.678/2023/GS/SEDUC/MT ";
    var found;

    for (var i = 0; i < aTags.length; i++) {
        if (aTags[i].textContent == searchText1) {
            console.log(aTags[i]);
            aTags[i].setAttribute('style', 'white-space: pre;font-size: 12px');
            aTags[i].textContent = secretario;
        }
        if (aTags[i].textContent == searchText2) {
            console.log(aTags[i]);
            aTags[i].setAttribute('style', 'white-space: pre;font-size: 12px');
            aTags[i].textContent = diretor;
        }
    }



})();
