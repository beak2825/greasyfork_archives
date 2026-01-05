// ==UserScript==
// @name        PRF Sistema SEI - Pesquisar informações
// @namespace   br.gov.prf.sei.scripts.pesquisa
// @description Filtra os processos conforme argumento de pesquisa
// @require     https://code.jquery.com/jquery-2.2.4.min.js
// @require     https://code.jquery.com/ui/1.11.4/jquery-ui.min.js
// @require     https://greasyfork.org/scripts/27243-prf-sistema-sei-lib-filtra-processos/code/PRF%20Sistema%20SEI%20-%20Lib%20-%20Filtra%20Processos.js?version=174320
// @include     /^https?:\/\/sei\.prf\.gov\.br\/sei\/controlador\.php\?.*acao=procedimento_controlar.*$/
// @include     /^https?:\/\/sei\.prf\.gov\.br\/sei\/controlador\.php\?.*acao=rel_bloco_protocolo_listar.*$/
// @author      Marcelo Barros
// @version     1.0.8
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22854/PRF%20Sistema%20SEI%20-%20Pesquisar%20informa%C3%A7%C3%B5es.user.js
// @updateURL https://update.greasyfork.org/scripts/22854/PRF%20Sistema%20SEI%20-%20Pesquisar%20informa%C3%A7%C3%B5es.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

var arrayTabela = [];

var classeFiltro = 'PorPesquisa';
var regexPesquisaOu = /^\[(.+)\]$/;

(function() {
    'use strict';

    $('div.infraAreaTabela table').each(function(indexTabela, itemTabela) {
        var tabela = $(itemTabela);
        arrayTabela.push({
            tabela: tabela,
            trs: tabela.find('tbody>tr[class^="infraTr"]')
        });
    });

    $(document.getElementById('txtPesquisaRapida')).on('input change', function() {
        var pesquisaGrupo = false;
        var arrayTermo;
        var texto = this.value.toLowerCase();
        if (texto) {
            if (regexPesquisaOu.test(texto)) {
                arrayTermo = texto.substring(1, texto.length - 1).match(/\S+/g);
                pesquisaGrupo = true;
            } else {
                arrayTermo = [texto];
            }
        }  else {
            arrayTermo = [];
        }

        var termosEncontrados = [];

        $.each(arrayTabela, function(index, itemArrayTabela) {
            if (arrayTermo.length) {
                filtrarTabela(itemArrayTabela.tabela, itemArrayTabela.trs, classeFiltro, function(indexTr, tr) {
                    var textoTr = tr.innerHTML.toLowerCase();
                    for (var i = 0; i < arrayTermo.length; i++) {
                        if (textoTr.indexOf(arrayTermo[i]) !== -1) {
                            if (termosEncontrados.indexOf(arrayTermo[i]) === -1)
                                termosEncontrados.push(arrayTermo[i]);
                            return true;
                        }
                    }
                    return false;
                });
            } else {
                removerFiltroTabela(itemArrayTabela.tabela, itemArrayTabela.trs, classeFiltro);
            }
        });

        if (pesquisaGrupo) {
            for (var i = 0; i < arrayTermo.length; i++) {
                if (termosEncontrados.indexOf(arrayTermo[i]) === -1)
                    console.log("Termo não encontrado: " + arrayTermo[i]);
            }
        }

    });
})();