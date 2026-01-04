// ==UserScript==
// @name         Gerador Commit BUG's SGD (Uso Interno)
// @description  Adiciona Botão para Gerar Commit de Atividades Relacionadas a BUG's no SGD
// @author       Ricardo Henrique
// @include      https://www.soc.com.br/WebSoc/sis050*
// @version      0.0.1
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/152380
// @downloadURL https://update.greasyfork.org/scripts/33989/Gerador%20Commit%20BUG%27s%20SGD%20%28Uso%20Interno%29.user.js
// @updateURL https://update.greasyfork.org/scripts/33989/Gerador%20Commit%20BUG%27s%20SGD%20%28Uso%20Interno%29.meta.js
// ==/UserScript==

$(document).ready(function() {
    iniciaAplicacao();
});

var iniciaAplicacao = function (){
    montaBotaoLinkParaCopia();
};

var montaBotaoLinkParaCopia = function (){
    var htmlJanelaCopia = "<div id='migrarAtividadesDiv' style='position: absolute; width: 273px; height: 110px; z-index: 1; left: 757px; top: 1911px; display: none;' class='window'> <div id='topBar' class='windowTopBarActive'><img src='https://www.soc.com.br/estatico/webcontext/imagens/transparent.gif' width='10' height='5'>Gerador de Commit</div> 		<div id='topClose' class='windowTopClose'><img id=\"botaoFechaJanela\" src='https://www.soc.com.br/estatico/webcontext/imagens/bot_close.gif' border='0'></div>		<div id='preencher' style='position:absolute;top:20px;width:100%;overflow:hidden;height:100%;'>			<table width='100%' border='0' cellspacing='0'><tbody><tr><td class='label' width='10%'><img class=\"classLinkCopiaClipBoard\" id=\"idLinkCopiaClipBoard\" src='http://i.picresize.com/images/2017/10/03/BP5I6.png' onmouseover=\"showTooltip(event,'Copiar - Commit Style'); return false;\" onmouseout=\"hideTooltip()\" tooltype='Migra atividade'></td><td class='campo' width='90%' align='left'><input type='text' name='nomeCommit' id='nomeCommit' maxlength='16' size='8' value='' style='text-align: left; width: 205px;'>&nbsp;</td></tr>  <tr><td class='label' width='10%'><img class=\"classLinkCopiaClipBoardSkype\" id=\"idLinkCopiaClipBoardSkype\" src='http://www.sibratec.ind.br/imagens/link_skype.png' onmouseover=\"showTooltip(event,'Copiar - Skype Style'); return false;\" onmouseout=\"hideTooltip()\" tooltype='Migra atividade'></td><td class='campo' width='90%' align='left'><input type='text' name='nomeCommitSkype' id='nomeCommitSkype' maxlength='16' size='8' value='' style='text-align: left; width: 205px;'>&nbsp;</td></tr>   </tbody></table>	</div></div>";

    //Verificando se Pega do Input ou Hidden
    $elementoForm = $("#maisFiltros");
    $elementoForm.after(htmlJanelaCopia);

    $('#minhaIteracao').on('click', function() {
        setTimeout(function(){
            criaBotoesUpDownPagina();
            aplicarEventosCompleto();
        }, 500);
    });
};

function aplicarEventosCompleto(){

    //For das Tds
    var tdComCodigoDaSol = 1;
    var tdComNomeDaSol = 2;
    var teste = 0;
    var html = "<a href=\"#\" class='linkGeraCommit'><img src='http://i.picresize.com/images/2017/10/04/0LlXN.png' onmouseover='showTooltip(event,\"Gerar Commit\"); return false;' onmouseout='hideTooltip()' tooltype='Criar no SOC o' id='botaoCriarNoSoc' class='botaoGeraCommit'></a>";
    $("table#resultados tr.atividade ").each(function() {
        var $this = $(this);
        var $tdComCodigoDaSol = "";
        var countTd = 1;
        teste++;

        $this.children("td.campo:visible").each(function(){
            if(countTd == tdComCodigoDaSol){
                $(this).css("width", 160);
                $tdComCodigoDaSol = $(this);
            }
            if(countTd == tdComNomeDaSol){
                var assuntoAtividadeCompleto = $(this).text().trim();
                var prefixoAtividadeComBug = assuntoAtividadeCompleto.split(":")[0];
                if(prefixoAtividadeComBug.indexOf('CORREÇÃO') >= 0 && prefixoAtividadeComBug.indexOf('BLOQUEIO') < 0){
                    $tdComCodigoDaSol.append(html);
                    var regExp = /\d+/g;
                    var matches = prefixoAtividadeComBug.match(regExp);
                    var codigoBug = matches[1];
                    $this.attr("data-codigobug", codigoBug);
                }
            }

            countTd++;
        });
    });

    $icone = $('#migrarAtividadesDiv');
    $btn = $('.botaoGeraCommit');

    $btn.on('mouseover', function() {
        //hideTooltip();
        var $trComDadosDaSolicitacao = $(this).closest("tr");
        var codigoSol = $trComDadosDaSolicitacao.data('codigosolicitacao');
        var codigoAtv = $trComDadosDaSolicitacao.data('codigoatividade');
        var codigoBug = $trComDadosDaSolicitacao.data('codigobug');
        var nomeGerar = "SOL " + codigoSol + ":" + codigoAtv + ", " + "BUG " + codigoBug;
        $('#nomeCommit').val(nomeGerar);

        var nomeGerarSkype = "*SOL " + codigoSol + ":" + codigoAtv + ", " + "BUG " + codigoBug + "* _No *BSOC*_";
        $('#nomeCommitSkype').val(nomeGerarSkype);

        $btn = $(this);
        var top = $btn.offset().top;
        var left = $btn.offset().left;

        $icone.css({top: top, left: left}).show('fast');
    });

    $icone.on('mouseleave', function() {
        $(this).hide('fast');
    });

    $('#botaoFechaJanela').on('click', function() {
        $('#migrarAtividadesDiv').hide();
    });

    //Evento no Botão Commit
    var copyTextareaBtn = document.getElementById("idLinkCopiaClipBoard");

    copyTextareaBtn.addEventListener('click', function(event) {
        var copyTextarea = document.getElementById("nomeCommit");
        copyTextarea.select();

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text command was ' + msg);
        } catch (err) {
            console.log('Oops, unable to copy');
        }
    });

    //Evento no Botão Skype
    var copyTextareaBtnSkype = document.getElementById("idLinkCopiaClipBoardSkype");

    copyTextareaBtnSkype.addEventListener('click', function(event) {
        var copyTextareaSkype = document.getElementById("nomeCommitSkype");
        copyTextareaSkype.select();

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text command was ' + msg);
        } catch (err) {
            console.log('Oops, unable to copy');
        }
    });

}

function escondeDiv(idDiv){
    document.getElementById(idDiv).style.display = 'none';
}

var criaBotoesUpDownPagina = function (){
    var htmlBotaoUp = '<img src="http://i.picresize.com/images/2017/10/04/yaxdL.png" onmouseover="showTooltip(event,&quot;To UP!&quot;); return false;" onmouseout="hideTooltip()" tooltype="" id="rolarParaCima" class="botaoRolarParaCima">';
    var htmlBotaoDown = '<img src="http://i.picresize.com/images/2017/10/04/pPyvt.png" onmouseover="showTooltip(event,&quot;To DOWN!&quot;); return false;" onmouseout="hideTooltip()" tooltype="" id="rolarParaBaixo" class="botaoRolarParaBaixo">';
    var $colunaBotao = $('#coluna3').next('td').first();

    var jaExisteOsBotoes = false;
    if($('#rolarParaCima').length && $('#rolarParaBaixo').length){
        jaExisteOsBotoes = true;
    }


    if($colunaBotao.length && !jaExisteOsBotoes){
        $colunaBotao.append(htmlBotaoUp);
        $colunaBotao.append('&nbsp;');
        $colunaBotao.append(htmlBotaoDown);

        $('#rolarParaCima').on('click', function() {
            moverJanelaUp();
        });

        $('#rolarParaBaixo').on('click', function() {
            moverJanelaDown();
        });
    }
};

var moverJanelaUp = function (){
    window.scrollTo(0, 0);
};

var moverJanelaDown = function (){
    window.scrollTo(0,document.body.scrollHeight);
};