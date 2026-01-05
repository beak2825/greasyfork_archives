// ==UserScript==
// @name        PRF Sistema SEI - Filtrar Processos por Atribuição
// @namespace   br.gov.prf.sei.scripts.filtraprocessosatribuicao
// @description Permite filtrar os processos do SEI conforme estejam atribuídos
// @require     https://code.jquery.com/jquery-2.2.4.min.js
// @require     https://greasyfork.org/scripts/27243-prf-sistema-sei-lib-filtra-processos/code/PRF%20Sistema%20SEI%20-%20Lib%20-%20Filtra%20Processos.js?version=174320
// @include     /^https?:\/\/sei\.prf\.gov\.br\/sei\/controlador\.php\?.*acao=procedimento_controlar.*$/
// @author      Marcelo Barros
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @version     1.1.1
// @downloadURL https://update.greasyfork.org/scripts/22216/PRF%20Sistema%20SEI%20-%20Filtrar%20Processos%20por%20Atribui%C3%A7%C3%A3o.user.js
// @updateURL https://update.greasyfork.org/scripts/22216/PRF%20Sistema%20SEI%20-%20Filtrar%20Processos%20por%20Atribui%C3%A7%C3%A3o.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

function inicio() {

    var idTabelaProcessosRecebidos = 'tblProcessosRecebidos';
    var idTabelaProcessosGerados = 'tblProcessosGerados';
    var idTabelaProcessosDetalhado = 'tblProcessosDetalhado';

    var tabelaRecebidos = getTabela(idTabelaProcessosRecebidos);
    var tabelaGerados = getTabela(idTabelaProcessosGerados);
    var tabelaDetalhado = getTabela(idTabelaProcessosDetalhado);

    if ($('#divInfraBarraLocalizacao').text() == 'Controle de Processos' && (tabelaRecebidos.length > 0 || tabelaGerados.length > 0 || tabelaDetalhado.length > 0)) {

        var keyAtribuido = 'atribuido';

        var trsRecebidos = getProcessos(tabelaRecebidos);
        var trsGerados = getProcessos(tabelaGerados);
        var trsDetalhado = getProcessos(tabelaDetalhado);

        var captionRecebidos = getTabelaCaption(tabelaRecebidos);
        var captionGerados = getTabelaCaption(tabelaGerados);
        var captionDetalhado = getTabelaCaption(trsDetalhado);

        var trs = trsRecebidos.add(trsGerados).add(trsDetalhado);

        var idVerSomenteMeusProcessos = 'divFiltro';

        var selectVerProcessosDe = newElement('select')
        .change(function() {
            changeSelectVerProcess(this.value, tabelaRecebidos, trsRecebidos, keyAtribuido);
            changeSelectVerProcess(this.value, tabelaGerados, trsGerados, keyAtribuido);
            changeSelectVerProcess(this.value, tabelaDetalhado, trsDetalhado, keyAtribuido);
        }).append([
            newElement('option')
            .attr('value', '*')
            .text('Ver todos os processos'),
            newElement('option')
            .attr('value', '')
            .text('Ver processos não atribuídos')
        ]);

        adicionarOptionAtribuido(selectVerProcessosDe, trs);

        atualizaSelect(selectVerProcessosDe, keyAtribuido);

        $('#' + idVerSomenteMeusProcessos).css('height', 'auto').css('font-size', 'smaller').prepend(criarTabelaNova(selectVerProcessosDe));
    }
}

function newElement(elemento) {
    return $(document.createElement(elemento));
}

function criarTabelaNova(selectNovo) {
    let novaTabela = newElement('table').css('width', '100%');
    let novoTr = newElement('tr').appendTo(newElement('tbody')).appendTo(novaTabela);
    console.log(novoTr);
    novoTr.append(newElement('td').append(selectNovo));
    novoTr.append(newElement('td').append($('#divMeusProcessos').css('position', 'initial')));
    novoTr.append(newElement('td').append($('#divVerPorMarcadores').css('position', 'initial').css('text-align', 'center')));
    novoTr.append(newElement('td').append($('#divTipoVisualizacao').css('position', 'initial').css('text-align', 'right')));
    return novaTabela;
}

function atualizaSelect(select, keyAtribuido) {
    var value = GM_getValue(keyAtribuido);
    if (typeof value !== 'undefined') {
        if (select.children("option[value='" + value + "']").length > 0)
            select.val(value).change();
        else
            GM_deleteValue(keyAtribuido);
    }
}

function adicionarOptionAtribuido(select, trs) {
    var nomes = getLinkAtribuido(trs).map(function() {
        return $(this).text();
    });

    $.each($.grep(nomes, function(value, index){
        return $.inArray(value, nomes) === index;
    }).sort(), function(index, element) {
        select.append(
            newElement('option')
            .attr('value', element)
            .text('Ver processos atribuídos à ' + element)
        );
    });
}

var classeFiltro = 'PorAtribuicao';

function changeSelectVerProcess(value, tabela, trs, keyAtribuido) {
    if (value !== '*') {
        filtrarTabela(tabela, trs, classeFiltro, function(indexTr, tr) {
            var alink = getLinkAtribuido($(tr));
            return (value === "" && alink.length === 0) || alink.text() === value;
        });
    } else {
        removerFiltroTabela(tabela, trs, classeFiltro);
    }
    GM_setValue(keyAtribuido, value);
}

function getLinkAtribuido(trs) {
    return trs.find('td:nth-child(4) a');
}

function getAtribuido(tr) {
    return getLinkAtribuido($(tr)).first().text();
}

function getTabela(idTabelaProcessos) {
    return $('#' + idTabelaProcessos).first();
}

function getProcessos(tabela) {
    return tabela.children('tbody').first().children('tr[class^="infraTr"]');
}

function getTabelaCaption(tabela) {
    return tabela.children('caption.infraCaption');
}

inicio();