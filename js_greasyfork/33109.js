// ==UserScript==
// @name         Preencher Dados Complementares BUG no SOC (Uso Interno) (Complemento de Script)
// @description  Preencher Dados na Tela de BUGS do SOC vindos do Maestro (Utilizar em Conjunto com o Script 'Botao Atalho BUG MaestroXSOC')
// @author       Ricardo Henrique
// @include      https://www.soc.com.br/WebSoc/sis054.do?ac=inc*
// @version      0.0.1
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/152380
// @downloadURL https://update.greasyfork.org/scripts/33109/Preencher%20Dados%20Complementares%20BUG%20no%20SOC%20%28Uso%20Interno%29%20%28Complemento%20de%20Script%29.user.js
// @updateURL https://update.greasyfork.org/scripts/33109/Preencher%20Dados%20Complementares%20BUG%20no%20SOC%20%28Uso%20Interno%29%20%28Complemento%20de%20Script%29.meta.js
// ==/UserScript==

$(document).ready(function() {
    iniciaAplicacao();
});

var iniciaAplicacao = function (){
    var ehBugDoSoc = $('#codigoSistema').val() == '0' ? true : false;

    preencheColaboradorAssociado();
    preencheCodigoSolicitacaoPadrao();
    if(ehBugDoSoc){
        exibeProgramasDoArray();
    }

    limparOsHiddensAuxiliaresParaNaoImpactarEmOutrasRequests();
};

var preencheColaboradorAssociado = function (){
    var codigoColaborador = $('#colaboradorAssociadoAux').val();
    if(codigoColaborador){
        $('#colaboradorAssociar').val(codigoColaborador);
        associar('colaboradorAssociar', 'colaboradorAssociado');
    }
};

var preencheCodigoSolicitacaoPadrao = function (){
    var codigoSolPadrao = $('#codigoSolicitacaoAux').val();
    if(codigoSolPadrao){
        $('#inputCodigoSolicitacao').val(codigoSolPadrao);
    }
};

var exibeProgramasDoArray = function (){
    var nomeProgramaAssoc = $('#programaAssociadoAux').val();
    if(nomeProgramaAssoc){
        percorreListaDeProgramasProcurandoEquivalenciaDeNomes(nomeProgramaAssoc);
    }
};

var percorreListaDeProgramasProcurandoEquivalenciaDeNomes = function (nomePrograma){
    var codigosMenusProgramasSocArray = [10,20,30,40];
    var tamanhoArrayProgramas = codigosMenusProgramasSocArray.length;
    var codigoMenu;

    for (var i = 0; i < tamanhoArrayProgramas; i++) {
        codigoMenu = codigosMenusProgramasSocArray[i];
        percorreProgramasDeUmMenuProcurandoPorNomeAdicionandoNoCombo(codigoMenu, nomePrograma);
    }
};

var percorreProgramasDeUmMenuProcurandoPorNomeAdicionandoNoCombo = function (codigoMenu, nomePrograma){
    var subMenus = menuMap[codigoMenu],
        programas,
        programa,
        $optGroup;
    var ehSubMenuNaoSelecionavel = false;
    $comboProgramasSelec = $('#programasSelecionados');
    for (var i in subMenus){
        programas = subMenus[i];
        $optGroup = $('<optgroup>');

        for (var c in programas){
            programa = programas[c];
            ehSubMenuNaoSelecionavel = programa['optGroup'];
            if (!ehSubMenuNaoSelecionavel && nomePrograma.indexOf(programa.nome) >= 0){
                $optGroup.append('<option value="' + programa.codigo + '">' + programa.nome + '</option>');
                $optGroup = $optGroup.children();
                $comboProgramasSelec.append($optGroup);
            }
        }
    }
};

var limparOsHiddensAuxiliaresParaNaoImpactarEmOutrasRequests = function (){
    $('#codigoSolicitacaoAux').val('');
    $('#colaboradorAssociadoAux').val('');
    $('#programaAssociadoAux').val('');
};