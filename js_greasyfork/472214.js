// ==UserScript==
// @name        Keyword Finder
// @namespace   http://tampermonkey.net/
// @version     1.0
// @description Find and save keywords in webpage source code
// @match       *://*/*
// @grant       GM_download
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/472214/Keyword%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/472214/Keyword%20Finder.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Palavras-chave para procurar
    var palavrasChave = ['admin', 'src', 'js'];
    var codigoFonte = $('html').html();
    var resultados = {};

    // Varra o código-fonte
    palavrasChave.forEach(function(palavraChave) {
        var regex = new RegExp(palavraChave, 'g');
        var correspondencias = codigoFonte.match(regex);
        if (correspondencias) {
            resultados[palavraChave] = correspondencias.length;
        }
    });

    // Salve os resultados
    localStorage.setItem('resultados', JSON.stringify(resultados));

    // Imprima os resultados no console
    console.log('Resultados: ', JSON.parse(localStorage.getItem('resultados')));

    // Crie um objeto Blob com os resultados
    var blob = new Blob([JSON.stringify(resultados)], {type: 'application/json'});

    // Use a função GM_download para baixar o arquivo
    GM_download(blob, 'resultados.json');
})();