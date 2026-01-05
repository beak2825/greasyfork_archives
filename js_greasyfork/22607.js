// ==UserScript==
// @name        PRF Sistema SEI - Selecionar Múltiplos Processos
// @namespace   br.gov.prf.sei.scripts.selecionarmultiplos
// @description Seleciona vários processos quando se segura a tecla Shift.
// @require     https://code.jquery.com/jquery-2.2.4.min.js
// @include     /^https?:\/\/sei\.prf\.gov\.br\/sei\/controlador\.php\?.*acao=procedimento_controlar.*$/
// @include     /^https?:\/\/sei\.prf\.gov\.br\/sei\/controlador\.php\?.*acao=rel_bloco_protocolo_listar.*$/
// @author      Marcelo Barros
// @version     1.0.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22607/PRF%20Sistema%20SEI%20-%20Selecionar%20M%C3%BAltiplos%20Processos.user.js
// @updateURL https://update.greasyfork.org/scripts/22607/PRF%20Sistema%20SEI%20-%20Selecionar%20M%C3%BAltiplos%20Processos.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

var shifted = false;
var desativarClick = false;

var elementos = [
    {id: 'chkDetalhadoItem'},
    {id: 'chkRecebidosItem'},
    {id: 'chkGeradosItem'},
    {id: 'chkInfraItem'},
];

function alteradoCheckbox(chkbox, element) {
    if (!desativarClick) {
        if (shifted) {
            var chkboxs = $(element.selectorCheckbox).get();
            var index1 = chkboxs.indexOf(chkbox);
            var index2 = chkboxs.indexOf(element.lastElement);

            if (index1 <= index2)
                efetuarClique(chkboxs, index1, index2);
            else
                efetuarClique(chkboxs, index2, index1);

        } else {
            element.lastElement = chkbox;
        }
    }
}

function efetuarClique(array, index1, index2) {
    desativarClick = true;
    for (var i = index1 + 1; i < index2; i++) {
        if (array[i].offsetParent !== null)
            $(array[i]).click();
    }
    desativarClick = false;
}

(function() {

    'use strict';

    $(document).on('keyup keydown', function(e) {
        shifted = e.shiftKey;
    });

    $.each(elementos, function(index, element) {
        element.selectorCheckbox = 'input:checkbox[id^="' + element.id + '"]';
        $(element.selectorCheckbox).change(function() {
            alteradoCheckbox(this, element);
        });
    });

})();