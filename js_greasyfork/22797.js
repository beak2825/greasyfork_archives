// ==UserScript==
// @name        PRF Sistema SEI - Copia Número do Processo
// @namespace   br.gov.prf.sei.scripts.copianumeroprocesso
// @description Cria um botão que copia o número do processo
// @include     /^https?:\/\/sei\.prf\.gov\.br\/sei\/controlador\.php\?.*acao=procedimento_visualizar.*$/
// @author      Marcelo Barros
// @run-at      document-idle
// @version     1.1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22797/PRF%20Sistema%20SEI%20-%20Copia%20N%C3%BAmero%20do%20Processo.user.js
// @updateURL https://update.greasyfork.org/scripts/22797/PRF%20Sistema%20SEI%20-%20Copia%20N%C3%BAmero%20do%20Processo.meta.js
// ==/UserScript==

var srcImgCopiar = 'data:image/gif;base64,R0lGODdhEAAQAMZNAAQCBISCdERCPMzCpGxmVOzixHRyXCQiHKyijNzStGxqXPTu3FxaTMS6nBQWFHx2bPz23ExORNTKrGRmZDQyLOTavGxqZERCRPTq1HRyZMS6pAwKDKSejMzGrGRiXCwqJPz27HR2ZOzizLSqlNzWvGxuXPzy5FxeXCQeHOTaxGxuZERGRMS+pGRmXAQGBJSKdExGPNTGpCwmJPzy3GReVMy6nBwWFHx6bPz25NzOtGxmZDw6NPTu1HxyZAwODKSelNTGrCwuJPz67Hx2ZPTmzLSulOTWvHRuXOTexHRuZExGRMy+pGxmXP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////ywAAAAAEAAQAAAHqoAnNEOEhYaEDDsMOCAgOIyOjZAQDAaMODOXlzNCjiFHJjOioQClAJmPISUYrKylrQA8oRklRLZEpbe3GAsZCgXABaXBwCIiGL4VSMulSMrLyyJJCkbVRqXW2SkqTAneCaXf4iQWLRLn56XoAOc55UDw8aYAQDExQBYeAwNL+/z7/Zb00+FhCYsaGhDWMIhQg4YlEwQAaUCx4sSKDYCscHHBg8ePID1e2BAIADs=';
var srcImgEspaco = '/infra_css/imagens/espaco.gif';

function gerarInserirLink(element, numeroDocumento, numeroSei, nomeDocumento) {

    var linkSei = document.createElement('a');
    linkSei.id = 'lnkSei' + numeroDocumento;
    linkSei.className = 'ancoraSei';
    linkSei.innerHTML = numeroSei;

    var spanNotEditable = document.createElement('span');
    spanNotEditable.setAttribute('contenteditable', 'false');
    spanNotEditable.appendChild(linkSei);

    var spanGeral = document.createElement('span');
    if (nomeDocumento) spanGeral.innerHTML = nomeDocumento + ' (';
    spanGeral.appendChild(spanNotEditable);
    if (nomeDocumento) spanGeral.innerHTML += ')';
    spanGeral.style.display = 'none';

    var spanParent = element.parentNode;
    spanParent.parentNode.insertBefore(spanGeral, spanParent.nextSibling);

    return spanGeral;
}

function gerarInserirCopy(span, title) {

    var imgCopiar = document.createElement('img');
    imgCopiar.src = srcImgCopiar;
    imgCopiar.title = title;

    var imgEspaco = document.createElement('img');
    imgEspaco.src = srcImgEspaco;

    var spanParent = span.parentNode;
    spanParent.parentNode.insertBefore(imgCopiar, spanParent.nextSibling);
    spanParent.parentNode.insertBefore(imgEspaco, spanParent.nextSibling);

    return imgCopiar;
}

function getNumeroDocumento(text) {
    var resultIdRegex = /^span([0-9]{7,8})$/g.exec(text);
    if (resultIdRegex) return resultIdRegex[1];
}

function copiarNumero(spanGeral) {
    spanGeral.style.display = 'block';
    var range = document.createRange();
    range.selectNodeContents(spanGeral);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    try {
        document.execCommand('copy');
        sel.removeAllRanges();
    } catch (err) {
        alert('Infelizmente, seu sistema não permite copiar automaticamente. Pressione Ctrl + C para copiar.');
    }
    spanGeral.style.display = 'none';
}

function iniciar() {
    var span = document.querySelector('#divArvore>a>span');
    if (span) {

        var numeroDocumento = getNumeroDocumento(span.id);
        if (numeroDocumento) {

            var spanGeral = gerarInserirLink(span, numeroDocumento, span.innerHTML.trim());
            gerarInserirCopy(span, 'Copiar Número do Processo').addEventListener('click', function() { copiarNumero(spanGeral); });
        }
    }

    [].forEach.call(document.querySelectorAll('#divArvore>div.infraArvore>a>span'), function(element, index) {

        var numeroSei;
        var nomeDocumento;
        var numeroDocumento = getNumeroDocumento(element.id);

        var resultNomeRegex = /^(.+)\s+\(?([0-9]{7,8})\)?$/.exec(element.title);
        if (resultNomeRegex) {
            nomeDocumento = resultNomeRegex[1];
            numeroSei = resultNomeRegex[2];
        }

        if (numeroSei && numeroDocumento && nomeDocumento) {

            var spanGeral = gerarInserirLink(element, numeroDocumento, numeroSei, nomeDocumento);
            gerarInserirCopy(element, 'Copiar Documento').addEventListener('click', function() { copiarNumero(spanGeral); });
        }
    });
}

(function() {
    'use strict';
    setTimeout(iniciar, 400);
})();