// ==UserScript==
// @name         Copiar Tempo Atv SGD (Uso Interno)
// @description  Copiar Tempo Previsto para Realizado no SGD
// @author       Ricardo Henrique
// @include      https://www.soc.com.br/WebSoc/sis104!crud.action*
// @version      0.0.1
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/152380
// @downloadURL https://update.greasyfork.org/scripts/33110/Copiar%20Tempo%20Atv%20SGD%20%28Uso%20Interno%29.user.js
// @updateURL https://update.greasyfork.org/scripts/33110/Copiar%20Tempo%20Atv%20SGD%20%28Uso%20Interno%29.meta.js
// ==/UserScript==

$(document).ready(function() {
    iniciaAplicacao();
});

var iniciaAplicacao = function (){
    montaBotaoLinkParaCopia();
};

var montaBotaoLinkParaCopia = function (){
    var imgBtnCriacaoSoc = document.createElement('img');
    imgBtnCriacaoSoc.setAttribute('src', "https://www.soc.com.br/estatico/webcontext/icones/cron3.png");
    imgBtnCriacaoSoc.setAttribute('onmouseover', "showTooltip(event,'Copiar Tempo'); return false;");
    imgBtnCriacaoSoc.setAttribute('onmouseout', "hideTooltip()");
    imgBtnCriacaoSoc.setAttribute('id', "botaoCriarNoSoc");
    var linkComCriacao = document.createElement('a');
    linkComCriacao.setAttribute('href', "#");
    linkComCriacao.appendChild(imgBtnCriacaoSoc);

     linkComCriacao.onclick = function () {
        copiaTempoPrevistoParaRealizado();
    };

    var imgBtnCopiaStatusESalva = document.createElement('img');
    imgBtnCopiaStatusESalva.setAttribute('src', "https://www.soc.com.br/estatico/webcontext/icones/tipo_tarefas.png");
    imgBtnCopiaStatusESalva.setAttribute('onmouseover', "showTooltip(event,'Copia Tempo / Conclui / Salva'); return false;");
    imgBtnCopiaStatusESalva.setAttribute('onmouseout', "hideTooltip()");
    imgBtnCopiaStatusESalva.setAttribute('id', "botaoCriarNoSoc");
    var linkComAcaoCopiarESalvar = document.createElement('a');
    linkComAcaoCopiarESalvar.setAttribute('href', "#");
    linkComAcaoCopiarESalvar.appendChild(imgBtnCopiaStatusESalva);

    linkComAcaoCopiarESalvar.onclick = function () {
        copiaTempoConcluiESalva();
    };

    //Verificando se Pega do Input ou Hidden
    $tempoPrevisto = $("input#tempoPrevisto").length ? $("input#tempoPrevisto") : $("#sis104_solicitacaoAtividadeVo_tempoPrevisto");

    $tempoPrevisto.after(linkComCriacao);
    $tempoPrevisto.after(linkComAcaoCopiarESalvar);
};

var copiaTempoConcluiESalva = function (){
    copiaTempoPrevistoParaRealizado();
    $('#sis104_solicitacaoAtividadeVo_statusAtividade').val('3');
    doAcao('save');
};

var copiaTempoPrevistoParaRealizado = function (){
    var tempoPrevisto = $tempoPrevisto.val();
    if(tempoPrevisto){
        $('#tempoEfetivo').val(tempoPrevisto);
    }
};

