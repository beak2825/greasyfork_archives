// ==UserScript==
// @name         Botao Atalho BUG Maestro X SOC (Uso Interno)
// @description  Script de Criação de Botão no Maestro Para Abrir SOC com Dados do BUG Preenchidos
// @author       Ricardo Henrique
// @include      https://www.maestro.inf.br/maestro/Cad038Action!workflow.action
// @version      0.0.4
// @run-at       document-end
// @namespace https://greasyfork.org/users/152380
// @downloadURL https://update.greasyfork.org/scripts/33108/Botao%20Atalho%20BUG%20Maestro%20X%20SOC%20%28Uso%20Interno%29.user.js
// @updateURL https://update.greasyfork.org/scripts/33108/Botao%20Atalho%20BUG%20Maestro%20X%20SOC%20%28Uso%20Interno%29.meta.js
// ==/UserScript==

$(document).ready(function() {
    iniciaAplicacao();
});

var ConstantesConfiguraveisPadrao = {
  CODIGO_COLABORADOR: '',
  TEMPO_PREVISTO: '00:00',
};

var SOLPadraoSOCeMaestro = {
    SOL_PADRAO_SOC:     '8822',
    SOL_PADRAO_MAESTRO: '8823',
};

var iniciaAplicacao = function (){
    buscaInformacoesDoProcessoESetaNasVariaveis();
    montaUrlGetComParametrosDoProcesso();
    montaBotaoDeIntegracao();

    if(verificaSeBotoesDeProximaTarefaExistem()){
        montaBotaoSelecionaProximaTarefa();
    }

    aumentaTamanhoDosTextAreasComInformacoesNivelDois();
};

var buscaInformacoesDoProcessoESetaNasVariaveis = function(){
    nomeProgramaAssoc = '';

    numeroProcesso    = $("tr td.label:contains('Número')").next('td.campo').first().text().trim();
    assuntoProcesso   = $("tr td.label:contains('Assunto')").next('td.campo').first().text().trim() + ' - ' + numeroProcesso;
    nomeSolicitante   = $("tr td.label:contains('Nome')").next('td.personalitem').first().find('input:text').val().trim();
    emailSolicitante  = $("tr td.label:contains('Email')").next('td.personalitem').first().find('input:text').val().trim();
    ehBugDoSoc        = $("tr td.label:contains('Sistema ?')").next('td.personalitem').first().find('input:hidden').val().trim() == '1' ? true : false;
    infNivelDois      = $("tr td.label:contains('Detalhes Suporte 2º Nível')").next('td.personalitem').first().find('input:hidden').val();
    resultadoEsperado = $("tr td.label:contains('Resultado esperado')").next('td.personalitem').first().find('input:hidden').val();
    if(ehBugDoSoc){
       nomeProgramaAssoc = $("tr td.label:contains('Programa SOC')").next('td.personalitem').first().find('input:text').val().trim();
    }

    var regExp = /\((\d[^)]+)\)/;
    //\(\d.+?\)
    var matches = regExp.exec($("tr td.label:contains('Cliente')").next('td.campo').first().text().trim());
    codEmpresaChamado = 0;
    if(matches){
        codEmpresaChamado = matches[1];
    }

    codigoProgramaSocNoMaestro = $("tr td.label:contains('Programa SOC')").next('td.personalitem').first().find('input:hidden').val();
};

var montaUrlGetComParametrosDoProcesso = function (){
    var urlGetBase = 'https://www.soc.com.br/WebSoc/sis054.do?ac=inc&';
    var and = '&';
    var codigoSolPadrao = ehBugDoSoc ? SOLPadraoSOCeMaestro.SOL_PADRAO_SOC : SOLPadraoSOCeMaestro.SOL_PADRAO_MAESTRO;
    var codigoSistemaBug = ehBugDoSoc ? 0 : 1;
    var tempoPadraoSol = ConstantesConfiguraveisPadrao.TEMPO_PREVISTO;
    var codigoColaborador = ConstantesConfiguraveisPadrao.CODIGO_COLABORADOR;

    urlFinalComParametros = '';

    urlFinalComParametros += urlGetBase + DeParaCampoNameSOC.TITULO_CHAMADO + "=" + assuntoProcesso + and
        + DeParaCampoNameSOC.EMPRESA_CHAMADO    + "=" + codEmpresaChamado + and
        + DeParaCampoNameSOC.NOME_SOLICITANTE   + "=" + nomeSolicitante + and
        //+ DeParaCampoNameSOC.EMAIL_SOLICITANTE  + "=" + emailSolicitante + and
        + DeParaCampoNameSOC.CODIGO_MAESTRO     + "=" + numeroProcesso + and
        + DeParaCampoNameSOC.CODIGO_SOLICITACAO + "=" + codigoSolPadrao + and
        + DeParaCampoNameSOC.CODIGO_SISTEMA     + "=" + codigoSistemaBug + and
        + DeParaCampoNameSOC.TEMPO_PREVISTO     + "=" + tempoPadraoSol + and
        + DeParaCampoNameSOC.COLABORADOR_ASSOC  + "=" + codigoColaborador + and
        + DeParaCampoNameSOC.CODIGO_SOLIC       + "=" + codigoSolPadrao + and
        + DeParaCampoNameSOC.PROGRAMA_ASSOC     + "=" + nomeProgramaAssoc + and
        + DeParaCampoNameSOC.RESULT_ESPERADO    + "=" + resultadoEsperado;
};

var DeParaCampoNameSOC = {
  CODIGO_SISTEMA: 'codigoSistema',
  EMPRESA_CHAMADO: 'emp',
  TITULO_CHAMADO: 'nomeTitulo',
  NOME_SOLICITANTE: 'nomeSolicitante',
  EMAIL_SOLICITANTE: 'emailSolicitante',
  CODIGO_MAESTRO: 'codigoAtendimento',
  DESC_DETALHADA: 'descricaoDetalhada',
  RESULT_ESPERADO: 'descricaoAndamento',
  CODIGO_SOLICITACAO: 'codigoSolicitacao',
  TEMPO_PREVISTO: 'atividadeTempoPrevisto',
  COLABORADOR_ASSOC: 'colaboradorAssociadoAux',
  CODIGO_SOLIC: 'codigoSolicitacaoAux',
  PROGRAMA_ASSOC: 'programaAssociadoAux',
};

function montaBotaoDeIntegracao(){

    /* Create button */
    var imgBtnCriacaoSoc = document.createElement('img');
    imgBtnCriacaoSoc.setAttribute('src', "/maestro/icones/melhorias_m.png");
    imgBtnCriacaoSoc.setAttribute('onmouseover', "showTooltip(event,'Criar BUG no SOC =D'); return false;");
    imgBtnCriacaoSoc.setAttribute('onmouseout', "hideTooltip()");
    imgBtnCriacaoSoc.setAttribute('tooltype', "Criar no SOC \o/");
    imgBtnCriacaoSoc.setAttribute('id', "botaoCriarNoSoc");

    var linkComCriacao = document.createElement('a');
    linkComCriacao.setAttribute('href', "#");
    linkComCriacao.appendChild(imgBtnCriacaoSoc);

    linkComCriacao.onclick = function () {
        abrirLinkCriacaoNoSoc();
    };

    /* Adicionando na Coluna de Botoes */
    var targetElement = document.querySelectorAll("[id='coluna4']");

    for(var i = 0; i < targetElement.length; i++){
        targetElement[i].appendChild(linkComCriacao);
    }
}

function montaBotaoSelecionaProximaTarefa(){

    /* Create button */
    var imgBtnCriacaoSoc = document.createElement('img');
    imgBtnCriacaoSoc.setAttribute('src', "https://www.soc.com.br/estatico/webcontext/icones/seleciona_todos.png");
    imgBtnCriacaoSoc.setAttribute('onmouseover', "showTooltip(event,'Selecionar Prox Tarefa / Como Bug e SALVA'); return false;");
    imgBtnCriacaoSoc.setAttribute('onmouseout', "hideTooltip()");
    imgBtnCriacaoSoc.setAttribute('tooltype', "Selecionar Prox Tarefa / Como Bug e SALVA");
    imgBtnCriacaoSoc.setAttribute('id', "botaoProxTarefa");

    var linkComCriacao = document.createElement('a');
    linkComCriacao.setAttribute('href', "#");
    linkComCriacao.appendChild(imgBtnCriacaoSoc);

    linkComCriacao.onclick = function () {
        selecionaProximaTarefaEDefineComoBug();
        doAcao('save_wf');
    };

     /* Adicionando na Coluna de Botoes */
    var targetElement = document.querySelectorAll("[id='coluna2']");

    for(var i = 0; i < targetElement.length; i++){
        targetElement[i].appendChild(linkComCriacao);
    }
}

var verificaSeBotoesDeProximaTarefaExistem = function (){
    var $inputRadioComProximaTarefa = $("tr td.labelTituloBloco").find('input[name=proximaTarefa]');
    var $comboComDefinicaoDoProcesso = $("tr td.label:contains('Tipo de Chamado')").next('td.personalitem').first().find('select');

    if($comboComDefinicaoDoProcesso.length && $inputRadioComProximaTarefa.length){
        return true;
    }
    else{
        return false;
    }
};

var abrirLinkCriacaoNoSoc = function (){
    transfereInfoDetalheSuporteN2ParaAreaDeTransferencia();
    window.open(urlFinalComParametros);
};


var transfereInfoDetalheSuporteN2ParaAreaDeTransferencia = function (){
    var textAreaComInfNivelDois = $("tr td.label:contains('Detalhes Suporte 2º Nível')").next('td.personalitem').first().find('textarea');
    textAreaComInfNivelDois.select();
    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
    } catch (err) {
        console.log('Oops, unable to copy');
    }
};

var aumentaTamanhoDosTextAreasComInformacoesNivelDois = function () {
    var $inputDetalhes = $("tr td.label:contains('Detalhes Suporte 2º Nível')").next('td.personalitem').first().find('textarea');
    var $inputResultado = $("tr td.label:contains('Resultado esperado')").next('td.personalitem').first().find('textarea');

    $inputDetalhes.css("width", 900).css("height", 350);
    $inputResultado.css("width", 900).css("height", 200);
};

var selecionaProximaTarefaEDefineComoBug = function (){
    var $inputRadioComProximaTarefa = $("tr td.labelTituloBloco").find('input[name=proximaTarefa]');
    var $comboComDefinicaoDoProcesso = $("tr td.label:contains('Tipo de Chamado')").next('td.personalitem').first().find('select');

    $comboComDefinicaoDoProcesso.val(2);
    $inputRadioComProximaTarefa.prop('checked', true);
};