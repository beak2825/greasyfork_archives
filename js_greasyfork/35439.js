// ==UserScript==
// @name         PRF Sistema SISCOM - Permite o Download do Auto de Infração em HTML
// @namespace    br.gov.prf.siscom.scripts.downloadautohtml
// @description  Permite o Download do Auto de Infração em HTML
// @match        *://www.prf.gov.br/multa/imprimirautoeletronico.do?*
// @match        *://www.prf.gov.br/multa2/imprimirautoeletronico.do?*
// @author       Marcelo Barros
// @run-at       document-end
// @version      1.1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35439/PRF%20Sistema%20SISCOM%20-%20Permite%20o%20Download%20do%20Auto%20de%20Infra%C3%A7%C3%A3o%20em%20HTML.user.js
// @updateURL https://update.greasyfork.org/scripts/35439/PRF%20Sistema%20SISCOM%20-%20Permite%20o%20Download%20do%20Auto%20de%20Infra%C3%A7%C3%A3o%20em%20HTML.meta.js
// ==/UserScript==

(function() {

    'use strict';

    document.body.onload = null;

    var div = document.createElement('div');
    div.id = 'printable';
    div.style.position = 'absolute';
    div.style.left = '0';

    document.body.insertBefore(div, document.body.firstChild);
    let htmlBotoes = '<style type="text/css"> @media print { #printable { display: none; }}</style>';
    htmlBotoes += '<button id="imprimir1Via">Download</button><br><button onclick="window.print()">Imprimir</button>';
    div.innerHTML = htmlBotoes;

    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/html;charset:UTF-8,%EF%BB%BF' + encodeURIComponent(text));
        element.setAttribute('download', filename + '.html');

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    document.getElementById('imprimir1Via').onclick = function() {
        let htmlAuto = document.implementation.createHTMLDocument('Auto1aVia');
        htmlAuto.body.innerHTML = document.querySelectorAll('body>table')[0].outerHTML.replace(/src="/g, 'src="' + window.location.origin);

        htmlAuto.head.innerHTML = '<meta charset="UTF-8">';

        let styleAuto = htmlAuto.createElement('style');
        styleAuto.innerHTML = document.head.getElementsByTagName('style')[0].innerHTML;
        htmlAuto.head.insertBefore(styleAuto, null);

        let numeroAuto = new URL(location.href).searchParams.get('numeroAuto');

        download(numeroAuto, htmlAuto.firstElementChild.outerHTML);
    };
    
    var elementoData = document.querySelector('#table01-01>tbody>tr>td:nth-child(6)>div>b');
    if (elementoData) {
        var inputData = document.createElement('input');
        inputData.type = 'hidden';
        inputData.id = 'dataAuto';
        inputData.value = elementoData.innerHTML;
        document.body.insertBefore(inputData, null);
    }
        
})();