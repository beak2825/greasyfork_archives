//⭐ PRESSIONE A TECLA "Y" APÓS ATIVAR O SCRIPT PARA ABRIR A TELA DE CHANGELOG COM INFORMAÇÕES DETALHADAS DAS MUDANÇAS EM CADA VERSÃO
//⭐ PRESSIONE A TECLA "T" APÓS ATIVAR O SCRIPT PARA ABRIR A TELA DE AJUDA COM INFORMAÇÕES DETALHADAS SOBRE CADA FUNÇÃO
//⭐ AS OPÇÕES DE TEMPO SÃO CUSTOMIZÁVEIS, AS LINHAS ESTÃO INDICADAS POR UM "⭕"
//⭐ CONFIGURAÇÕES ACERCA DO ENVIO DE COMANDO AO FINAL DO SCRIPT
//⭐ O SCRIPT RODA AS COORDENADAS DE FORMA CONSECUTIVA!
//⭐ LEGENDA ABAIXO:
/*
⭐ = TÓPICO IMPORTANTE
⛔ = NÃO ENCOSTE, IGNORE!
⚫ = CUSTOMIZAÇÃO LIBERADA
⚪ = MEXER APENAS SE TIVER CONSCIÊNCIA
⭕ = CONFIGURAÇÕES DE TEMPO (MENSAGENS DE ERROR && TROCA DE ALDEIAS && COMANDOS EM GERAL)
⚡ = INFORMAÇÃO ADICIONAL SOBRE CADA SEÇÃO CUSTOMIZÁVEL
*/

/* ⚫⚫⚫⚫⚫ INÍCIO DA SEÇÃO DE CONFIGURAÇÕES GERAIS ⚫⚫⚫⚫⚫ */


//⚫ SEÇÃO PARA CONFIGURAÇÃO DE ENVIO DE COMANDOS
//⭐ APENAS UM DEVE ESTAR ATIVO(ATAQUE OU APOIO):

/*⚡ DEFINA SE O SCRIPT PARA DE ENVIAR COMANDOS QUANDO SEM TROPAS  ⚡*/ var SemTropas = true; // Pode ser utilizada em conjunto com Ataque ou Apoio
/*⚡ DEFINA SE O SCRIPT IRÁ CLICAR EM ATACAR AUTOMATICAMENTE       ⚡*/ var Ataque    = true;
/*⚡ DEFINA SE O SCRIPT IRÁ CLICAR EM APOIAR AUTOMATICAMENTE       ⚡*/ var Apoio     = false;

//⚫ SEÇÃO PARA CONFIGURAÇÃO DE TROPAS E COORDENADAS

/*⚡ DEFINIR NÚMERO DE EXPLORADORES ENVIADOS POR ATAQUE/APOIO      ⚡*/ var Exploradores=5;
/*⚡ DEFINIR ORDEM PRIORITÁRIA E TROPAS (0=IGNORAR)                ⚡*/ var Ordem_de_Unidades={light:0,ram:0,catapult:0,sword:0,spear:0,axe:0,archer:0,marcher:0,heavy:0}; // Altere a Ordem das unidades para definir a ordem prioritária, em seguida selecione a quantidade de unidades a ser enviada a cada Comando!
/*⚡ DEFINIR AS COORDENADAS A SEREM ATACADAS                       ⚡*/ var Coordenadas='559|574 555|574 557|580 560|572 549|570 552|567 560|562 556|568 559|564 562|562 562|565 548|577 545|578 556|569 568|565 559|571 550|577 566|563 555|583 568|567 549|581 550|567 569|567 546|584 554|583 550|578 553|566 567|570 568|575 564|580 551|572 546|576 553|584 553|568 552|565 565|575 565|580 567|579 561|565';

//⚫ SEÇÃO PARA CONFIGURAÇÃO DE NOMES DOS COOKIES

var config={
/*⚡ DEFINIR NOME DA LISTA DE ALVOS                                ⚡*/ Lista_de_Alvos:'FarmBr95', // Colocar o Nick do(s) Jogadore(s) Alvo
/*⚡ DEFINIR QUANTAS VEZES CADA COORDENADA DEVERÁ SER ATACADA      ⚡*/ Repetições:1,
/*⚡ COOKIE DOS SCRIPTS (SALVA SEQUÊNCIA ATUAL DE ALDEIAS)         ⚡*/ Nome_do_Cookie:'FarmBr95'}; // Sempre utilize Nomes diferentes para cada Scipt. Caso contrário a sequencia das coordenadas atacadas em um irá interferir na outra!

//⚫ SEÇÃO PARA PREENCHIMENTO DE TROPAS TOTAIS
//⭐ Seleciona por Unidade ou Tropas Totais, é possível ativar Múltiplas Var's

/*⚡ TRUE = SELECIONA TODOS OS LANCEIROS DISPONÍVEIS               ⚡*/ var Lança     = false;
/*⚡ TRUE = SELECIONA TODOS OS ESPADACHINS DISPONÍVEIS             ⚡*/ var Espada    = false;
/*⚡ TRUE = SELECIONA TODOS OS BÁRBAROS DISPONÍVEIS                ⚡*/ var Machado   = false;
/*⚡ TRUE = SELECIONA TODOS OS ARQUEIROS DISPONÍVEIS               ⚡*/ var Arco      = false;
/*⚡ TRUE = SELECIONA TODOS OS EXPLORADORES DISPONÍVEIS            ⚡*/ var Spy       = false;
/*⚡ TRUE = SELECIONA TODAS AS CAVALARIAS LEVES DISPONÍVEIS        ⚡*/ var C_Leve    = false;
/*⚡ TRUE = SELECIONA TODOS OS ARQUEIROS À CAVALO DISPONÍVEIS      ⚡*/ var C_Arco    = false;
/*⚡ TRUE = SELECIONA TODAS AS CAVALARIAS PESADAS DISPONÍVEIS      ⚡*/ var C_Pesada  = false;
/*⚡ TRUE = SELECIONA TODOS OS ARÍETES DISPONÍVEIS                 ⚡*/ var Ariete    = false;
/*⚡ TRUE = SELECIONA TODAS AS CATAPULTAS DISPONÍVEIS              ⚡*/ var Catas     = false;
/*⚡ TRUE = SELECIONA TODOS OS NOBRES DISPONÍVEIS                  ⚡*/ var Nobre     = false;

/*⚡ TRUE = SELECIONA TODAS AS TROPAS DISPONÍVEIS NA ALDEIA        ⚡*/ var Todas_as_Tropas = false;


/* ⚫⚫⚫⚫⚫ FIM DA SEÇÃO DE CONFIGURAÇÕES GERAIS ⚫⚫⚫⚫⚫ */


/* ⚪⚪⚪ INÍCIO DAS CONFIGURAÇÕES DE PERSONALIZAÇÃO ⚪⚪⚪ */


var Dialog1;(function(){'use strict';Dialog1={MAX_WIDTH:1200,closeCallback:null,show:function(id,content,closeCallback,options){options=$.extend({class_name:'',close_from_fader:true},options);this.closeCallback=closeCallback;var fullscreenElement=document.fullscreenElement||document.mozFullScreenElement||document.webkitFullscreenElement,container=fullscreenElement||'body',$container=$('.popup_box_container'),$box,$fader,$content,show_anim=false;if(!$container.length){show_anim=true;$container=$('<div class="popup_box_container" />');$box=$('<div class="popup_box" />').attr('id','popup_box_'+id).addClass(options.class_name).data('name',id).appendTo($container);$fader=$('<div class="fader" />').appendTo($container);$content=$('<div class="popup_box_content" />').appendTo($box);$container.appendTo($(container))}else{$box=$container.find('.popup_box');if($box.data('name')!==id){Dialog1.close();Dialog1.show(id,content,closeCallback,options);return};$content=$container.find('.popup_box_content');$box.css('width','auto')};$content.html(content);var height_buffer=125;if($(window).width()<500||$(window).height()<$content.height()+height_buffer){$box.addClass('mobile');$('.popup_box_content').css({'max-height':$(window).height()-(height_buffer/2)+'px'})};var border_width;if(typeof window.getComputedStyle==='function'){border_width=parseInt(getComputedStyle($box[0],null).borderLeftWidth)}else border_width=parseInt($box.css('border-left-width'));var min_width=200,width=Math.min(this.MAX_WIDTH,$content.width(),$(window).width()-border_width);if(width<min_width)width=min_width;if(!Modernizr.borderimage)width+=20;$box.css('width',width+'px');var hotkey_hint=(!mobile&&!mobiledevice&&HotKeys.enabled)?' :: ΟΟΞ½ΟΟΞΌΞ΅ΟΟΞ· ΟΞ»Ξ·ΞΊΟΟΞΏΞ»ΞΏΞ³Ξ―ΞΏΟ: <b>Esc</b>':'',tooltip_class=(!mobile&&!mobiledevice)?'tooltip-delayed':'',$close=$('<a class="popup_box_close '+tooltip_class+'" title="ΞΞ»Ξ΅Ξ―ΟΞ΅'+hotkey_hint+'" href="#">&nbsp;</a>').prependTo($content);UI.ToolTip($close,{delay:400});var close_elements=options.close_from_fader?'.fader, .popup_box_close, .popup_closer':'.popup_box_close, .popup_closer';$container.on('click',close_elements,function(){Dialog1.close(true);return false});if(show_anim)setTimeout(function(){$box.addClass('show')},50);UI.init();UnitPopup.init();setTimeout(QuestArrows.init,500)},close:function(by_user){$('.popup_box_container').remove();if(Dialog1.closeCallback)Dialog1.closeCallback(by_user);inlinePopupClose();$('.popup_style').hide();QuestArrows.init();return false},fetch:function(name,screen,get_params,callback,Dialog1_options,closeCallback){TribalWars.get(screen,get_params,function(data){Dialog1.show(name,data.Dialog1,closeCallback,Dialog1_options);if(callback)callback()})}}})();

	 window.addEventListener("keydown", AtalhoCommander, false);
     function AtalhoCommander(e) {

 if (e.keyCode == "84") {
	  var contact_url = "https://forum.tribalwars.com.br/index.php?members/tikabum.58522/";
	   var content = '<div style=max-width:1000px;>' +
'<h2 class="popup_box_header"><center><u><font color="darkred">## COMMANDER ##</font></u></center></h2>' +
'<center><img class="tooltip-delayed" title="<font color=darkred>## STRIKE TEAM ##</font>" src="https://i.imgur.com/j3jpjYV.png" style="cursor:help; position: relative"></center>' +
'<h5 class="popup_box_header"><center><u><font color="black">Aperte "T" DUAS vezes!</font></u></center></h2>' +
'<hr><p><font color=maroon><b><u>⭐ Método de Inserção de Unidades</u></b></font></p>' +
'<p><br>⚡ <font color="red"><b>Ordem prioritária:</b></font> O Script usará Apenas <b>UM</b> Tipo de Unidade, Baseado na <b>Ordem Prioritária</b>. O que Significa que a Proxima Unidade da Ordem será Selecionada sempre que a Atual se Esgotar!</p>'+
'<p>⚡ <font color="red"><b>Tropas Totais:</b></font> O Script selecionará a quantidade <b>TOTAL</b> de tropas, por <b>Unidade</b> ou <b>Geral</b>. Sendo possível utilizar para enviar Nukes, por exemplo num Full Padrão <i>(<b>Basta Selecionar:</b> Bárbaros, Cavalaria Leve e Aríetes)</i></p>'+
'<p><hr><font color=maroon><b><u>⭐ Método de Inserção de Coordenadas</u></b></font></p>' +
'<p><br>O Script Coordena os Ataques de forma <b>CONSECUTIVA</b>, você também pode Selecionar <b>QUALQUER</b> Coordenada da Lista de Alvos.</p>'+
'<p><hr><font color=maroon><b><u>⭐ Variáveis Normais</u></b></font></p>' +
'<br>⚡ <font color="red"><b>Coordenadas:</b></font> Escolha as Coordenadas de seus Alvos Desejados. Adicione quantas Desejar, sempre <b>Separando-as</b> com um Espaço <i>(Ex: 532|516 451|450 430|420)</i>.'+
'<br><br>⚡ <font color="red"><b>Repetições:</b></font> Defina quantas vezes o Script irá Atacar cada Coordenada antes de <b>Passar à Próxima</b>.'+
'<br><br>⚡ <font color="red"><b>Var Unidade:</b></font> Defina se o Script deverá Selecionar <b>TODAS as Unidades</b> <i>(Seja Lança, Espada, Bárbaro, Arco.. etc</i>.)'+
'<br><br>⚡ <font color="red"><b>Exploradores:</b></font> Defina o Número de Exploradores a ser Enviado em cada <b>COMANDO</b>.'+
'<br><br>⚡ <font color="red"><b>Lista_de_Alvos:</b></font> Escolha a Palavra que será Utilizada como <b>Nome da Lista</b> de Alvos.'+
'<br><br>⚡ <font color="red"><b>Nome_do_Cookie:</b></font> Escolha a Palavra que será Utilizada como o <b>Nome do Cookie</b> nas Configurações do Script.'+
'<br><br>⚡ <font color="red"><b>Todas_as_Tropas:</b></font> Defina se o Script deverá Selecionar <b>TODAS as Tropas</b>.'+
'<br><br>⚡ <font color="red"><b>Ordem_de_Unidades:</b></font> Defina a <b>Ordem Prioritária</b> alterando a Ordem das Unidades, e a Quantidade a ser Enviada de cada uma.'+
'<p><hr><font color=maroon><b><u>⭐ Variáveis Extra</u></b></font></p>' +
'<p><br>⚡ <font color="red"><b>Apoio:</b></font> Defina se o Script deverá <b>Clicar em Apoiar</b> Atutomaticamente.'+
'<br><br>⚡ <font color="red"><b>Ataque:</b></font> Defina se o Script deverá <b>Clicar em Atacar</b> Atutomaticamente.'+
'<br><br>⚡ <font color="red"><b>SemTropas:</b></font> Defina se o Script para de <b>Enviar Comandos</b> quando Sem Tropas.</p>'+
           '<center><img class="tooltip-delayed" title="<font color=darkred>## STRIKE ~ COMMANDER ##</font>" src="https://i.imgur.com/RrAg5YW.gif" style="cursor:help; position: relative"></center><br><center>Sinta-se livre para Relatar qualquer BUG do Script ou Enviar Sugestões de Melhoria. <a href="'+contact_url+'" title="Perfil do TiKa" target="_blank">⚡ TiKa ⚡</a></center>' +
'</div>';
Dialog1.show('commander_info', content);
$("#go_man").click(function () { window.location.assign(game_data.link_base_pure+"place");});
$("#close_this").click(function () { var close_this = document.getElementsByClassName('popup_box_close'); close_this[0].click(); });
 }
 else if (e.keyCode == "89") {
	  var contact_url1 = "https://forum.tribalwars.com.br/index.php?members/tikabum.58522/";
	   var content1 = '<div style=max-width:1000px;>' +
'<h2 class="popup_box_header"><center><u><font color="darkred">## CHANGELOG ##</font></u></center></h2>' +
'<center><img class="tooltip-delayed" title="<font color=darkred>## STRIKE TEAM ##</font>" src="https://i.imgur.com/j3jpjYV.png" style="cursor:help; position: relative"></center>' +
'<h5 class="popup_box_header"><center><u><font color="black">Aperte "Y" DUAS vezes!</font></u></center></h2>' +
'<hr><p><font color=maroon><b><u>⭐ Versão 1.0</u></b></font></p>' +
'<p>⚡ <font color="red"><b>1.0:</b></font> Script do Tsalkapone</p>'+
'<p><hr><font color=maroon><b><u>⭐ Versão 2.0</u></b></font></p>' +
'<p>⚡ <font color="red"><b>2.0:</b></font> Traduzido para o Pt/Br</p>'+
'<p>⚡ <font color="red"><b>2.1:</b></font> Script Otimizado</p>'+
'<p>⚡ <font color="red"><b>2.2:</b></font> Variável de Ataque/Apoio Adicionada</p>'+
'<p>⚡ <font color="red"><b>2.3:</b></font> Adicionada Seção para Preenchimento de Tropas Totais</p>'+
'<p><hr><font color=maroon><b><u>⭐ Versão 3.0</u></b></font></p>' +
'<p>⚡ <font color="red"><b>3.0:</b></font> Script Apelidado como COMMANDER</p>'+
'<p>⚡ <font color="red"><b>3.1:</b></font> Adicionadas Legendas, Tópicos e Informações Adicionais</p>'+
'<p>⚡ <font color="red"><b>3.2:</b></font> Adicionadas Variáveis de Troca de Aldeia, e Variável de Ataque/Apoio Otimizada</p>'+
'<p>⚡ <font color="red"><b>3.3:</b></font> Nome do Script Alterado de "COMMANDER" para "## COMMANDER ##"</p>'+
'<p>⚡ <font color="red"><b>3.4:</b></font> Adicionadas Configurações de Tempos de Notificação (⭕)</p>'+
'<p>⚡ <font color="red"><b>3.5:</b></font> Variáveis Completamente Traduzidas para Pt/Br</p>'+
'<p>⚡ <font color="red"><b>3.6:</b></font> Corrigido Bug que Impedia o Script de Enviar as Unidades se o Número Selecionado for Igual ao Disponível na Aldeia</p>'+
'<p>⚡ <font color="red"><b>3.7:</b></font> Encontrado Bug na Var "SemTropas", Onde as Aldeias Continuavam a ser Passadas num LOOP Infinito (Var Desabilitada)</p>'+
'<p>⚡ <font color="red"><b>3.8:</b></font> Variáveis de Troca de Aldeia Transferidas ao ## CONFIRMATOR ##</p>'+
'<p>⚡ <font color="red"><b>3.9:</b></font> Erros de Ortografia Corrigidos!</p>'+
'<p><hr><font color=maroon><b><u>⭐ Versão 4.0</u></b></font></p>' +
'<p>⚡ <font color="red"><b>4.0:</b></font> Variáveis de Tempo SINCRONIZADAS (Commander e Officer)</p>'+
'<p>⚡ <font color="red"><b>4.1:</b></font> Adicionado Ícone e Página com Ícones Pré-Selecionados para Facilidade de Personalização</p>'+
'<p>⚡ <font color="red"><b>4.2:</b></font> Adicionada Variável "SemTropas" onde o Script para de Enviar Comandos quando as Unidades Acabam</p>'+
'<p>⚡ <font color="red"><b>4.3:</b></font> Erros de Tradução Corrigidos</p>'+
'<p>⚡ <font color="red"><b>4.4:</b></font> Adicionada Descrição</p>'+
'<p>⚡ <font color="red"><b>4.5:</b></font> Códigos para Atualização Automática Incluídos!</p>'+
'<p>⚡ <font color="red"><b>4.6:</b></font> Script Revisado, Informações e Erros de Ortografia Corrigidos!</p>'+
'<p>⚡ <font color="red"><b>4.7:</b></font> Script Otimizado</p>'+
'<p>⚡ <font color="red"><b>4.8:</b></font> UserScript Movido ao Fim do Código</p>'+
'<p>⚡ <font color="red"><b>4.9:</b></font> Informações Corrigidas e Otimizadas</p>'+
'<p><hr><font color=maroon><b><u>⭐ Versão 5.0</u></b></font></p>' +
'<p>⚡ <font color="red"><b>5.0:</b></font> Códigos de Tradução Retirados!</p>'+
'<p>⚡ <font color="red"><b>5.1:</b></font> Telas de Ajuda e Redirecionamento Otimizadas!</p>'+
'<p>⚡ <font color="red"><b>5.2:</b></font> Contato do FTW Adicionado</p>'+
'<p>⚡ <font color="red"><b>5.3:</b></font> Tela de ChangeLog Adicionada</p>'+
'<p>⚡ <font color="red"><b>5.4:</b></font> Corrigido Bug que Impedia o Script de Enviar os Exploradores se o Número Selecionado fosse Igual ao Disponível na Aldeia</p>'+
'<p>⚡ <font color="red"><b>5.5:</b></font> Corrigidos Erros de Tradução</p>'+
'<p>⚡ <font color="red"><b>5.6:</b></font> Adicionada Função para Mostrar MS</p>'+
'<p>⚡ <font color="red"><b>5.7:</b></font> Adicionada Função para Pausar Temporizadores</p>'+
           '<center><img class="tooltip-delayed" title="<font color=darkred>## STRIKE ~ CHANGELOG ##</font>" src="https://i.imgur.com/RrAg5YW.gif" style="cursor:help; position: relative"></center><br><center>Sinta-se livre para Relatar qualquer BUG do Script ou Enviar Sugestões de Melhoria. <a href="'+contact_url1+'" title="Perfil do TiKa" target="_blank">⚡ TiKa ⚡</a></center>' +
'</div>';
Dialog1.show('changelog_info', content1);
$("#go_man").click(function () { window.location.assign(game_data.link_base_pure+"place");});
$("#close_this").click(function () { var close_this = document.getElementsByClassName('popup_box_close'); close_this[0].click(); });
 }
		  }

	var doc=document;
//if(window.frames.length>0)doc=window.main.document;url=document.URL;

	var Activepage = location.href.indexOf('screen=place') > -1;
    var Activepage1 = location.href.indexOf('&mode=sim') > -1;
    var Activepage2 = location.href.indexOf('&try=confirm') > -1;
// ⭐⭐ MOSTRAR MS ⭐⭐
function setMS()
{
    var element1=document.getElementById("serverTime");
    var element2=document.getElementById("tsal_tw_ms");
    var time=element1.innerHTML.match(/^\d+\:\d+\:\d+/);
    var date=new Date();
    var ms=(date.getMilliseconds()).toString();
while(ms.length<3){ms="0"+ms;};
    var x=Number(ms); if (x<200) { $("#tsal_tw_ms").css("color", "black");}
  else if (x<400) { $("#tsal_tw_ms").css("color", "darkgreen");}
  else if (x<600) { $("#tsal_tw_ms").css("color", "darkyellow");}
  else if (x<800) { $("#tsal_tw_ms").css("color", "darkred");}
  else { $("#tsal_tw_ms").css("color", "red");}
           element2.innerHTML=ms;}
  if (!document.getElementById('tsal_tw_ms')) {
    var server_ms='';
    var server_lag=Number(Timing.offset_to_server)-70;
         $('.server_info').append('<span class="server_info">|<font color=darkred><b> Ms: <span  id="tsal_tw_ms">'+server_ms+'</b></font></span><span id="tsal_tw_lag" class="server_info">|<font color=red><b> Lag: '+server_lag+' ms</b></font></span>');
         $(".server_info").css("color", "darkred"); $(".server_info").css("font-size", "large");
    var tnt_show_ms = window.setInterval(setMS,1);
 }
			if (!Activepage && !Activepage1 && !Activepage2 && !Activepage3) {

				var contact_url = "https://forum.tribalwars.com.br/index.php?members/tikabum.58522/";
	   var content = '<div style=max-width:1000px;>' +
'<h2 class="popup_box_header"><center><u><font color="darkred">## COMMANDER ##</font></u></center></h2>' +
'<center><img class="tooltip-delayed" title="<font color=darkred>## STRIKE TEAM ##</font>" src="https://i.imgur.com/j3jpjYV.png" style="cursor:help; position: relative"></center>' +
'<hr><p><center><font color=maroon><b>O Script deve ser Ativado na Praça de Reunião</b></font></center></p>' +
'<p><center><font color=maroon><b>Você gostaria de ser Redirecionado à Praça?</b></font></center></p>' +
'<br><br><center><input type="button" class="btn evt-confirm-btn btn-confirm-yes" id="go_man" value="Sim">&emsp;<input type="button" class="btn evt-cancel-btn btn-confirm-no" id="close_this" value="Não"></center>'+
'<br><br><hr><center><img class="tooltip-delayed" title="<font color=darkred>## STRIKE ~ COMMANDER ##</font>" src="https://i.imgur.com/RrAg5YW.gif" style="cursor:help; position: relative"></center><br><center><p>Sinta-se livre para Relatar qualquer BUG do Script ou Enviar Sugestões de Melhoria. <a href="'+contact_url+'" title="Perfil do TiKa" target="_blank">⚡ TiKa ⚡</a>.</p></center>' +
'</div>';
Dialog.show('commander_info_intro', content);
$("#go_man").click(function () { window.location.assign(game_data.link_base_pure+"place");});
$("#close_this").click(function () { var close_this = document.getElementsByClassName('popup_box_close'); close_this[0].click(); });
	}
	else if(Coordenadas.replace(/^\s\s*/,'').replace(/\s\s*$/,'')==='')
/*⭕ NOFICIAÇÃO DE "NENHUMA COORDENADA" ⭕*/	{UI.ErrorMessage('<font color=gold><b><center><u>NOTIFICAÇÃO ~ ## STRIKE TEAM ##</u></center></b></font> <br><br> Nenhuma Coordenada Detectada. Definal Alguns Alvos e Tente Novamente!',/*⭕TEMPO*/ 50);} /* ⚡ DEFINE TEMPO EM QUE A MENSAGEM DE "NENHUMA COORDENADA DETECTADA" PERMANECERÁ NA TELA ⚡ */
{

    /* ⚪⚪⚪ FIM DAS CONFIGURAÇÕES DE PERSONALIZAÇÃO ⚪⚪⚪ */

    /* ⛔⛔⛔⛔⛔ INICIO DO SCRIPT DO TSALKAPONE ⛔⛔⛔⛔⛔ */

			/*==== register ====*/
var script = {
	scriptname: 'Fake Script No2',
	version: '1.0',
	author: 'Tsalkapone',
	email: 'tsalkapone@hotmail.com',
	broken: false
};
$.post(ScriptAPI.url,script);

var coords=Coordenadas.split(' ');
function escapeStr(text)
{var specials=['/','.',',','~','`','@','#','%','-','_','*','+','?','|','$','=',':','!','^','<','>','(',')','[',']','{','}','\\'];
var sRE=new RegExp('(\\'+specials.join('|\\')+')','g');
return text.replace(sRE,'\\$1');}
function zeroPad(number,length)
{var n=number.toString();while(n.length<length){n='0'+n;}return n;}
function fnWriteCookie(index)
{var cookie_date=new Date(2099,11,11);
eleDoc.cookie=config.Nome_do_Cookie+'='+(index + 1)+';expires='+cookie_date.toGMTString();}
function incrementaCookie(){let cookieFarmPlayer=indexAtualCookie();$.cookie(config.Nome_do_Cookie,cookieFarmPlayer++);}
function indexAtualCookie(){return parseInt($.cookie(config.Nome_do_Cookie))||0;}
function fnAssignTsalkapone_μονάδες(index,isManualReset)
{if((index<0)||(index>=coords.length))
{index=0;
/*⭕ NOTIFICAÇÃO DE "ÚLTIMA COORDENADA" ⭕*/
 if(eleDoc.fakeSequence==1){
     UI.ErrorMessage('<span id=tsalkaponelastsyn><b><font color=gold><u>NOTIFICAÇÃO ~ ## STRIKE TEAM ##</u></font></b></span><br><br>Essas foram as Últimas Coordenadas Selecionadas!',/*⭕TEMPO*/ 50);}} /* ⚡ DEFINE TEMPO EM QUE A MENSAGEM DE "ÚLTIMA COORDENADA" PERMANECERÁ NA TELA ⚡ */
//eleDoc.getElementById('fakescript2_Tsalkapone').selectedIndex=index;
index = indexAtualCookie()
var villa=coords[index].split('|');
if(!isManualReset&&(eleDoc.fakeSequence<=config.Repetições))
{eleDoc.fakeSequence++;}
else{eleDoc.fakeSequence=(isManualReset?2:1);
fnWriteCookie(isManualReset?index-1:index);}
var eleForm=document.forms[0];eleForm.x.value=villa[0];eleForm.y.value=villa[1];
var count;
if(Exploradores>0)
{count=parseInt(eleForm.spy.nextSibling.nextSibling.innerHTML.match(/\d+/));
if(count>0&&Exploradores<=count){
	eleForm.spy.value=Math.min(Exploradores,count);}}
	for(var Commander in Ordem_de_Unidades){
		if(Ordem_de_Unidades.hasOwnProperty(Commander)){
			if((Ordem_de_Unidades[Commander]>0)&&(typeof(eleForm[Commander])!="undefined"))
			{count=parseInt(eleForm[Commander].nextSibling.nextSibling.innerHTML.match(/\d+/));
		if(count>0&&Ordem_de_Unidades[Commander]<=count)
		{eleForm[Commander].value=Math.min(Ordem_de_Unidades[Commander],count);break;}
}}}}
//	var eleDoc=(window.frames.length>0)?window.main.document:document;
var eleDoc=document;
	if(typeof(eleDoc.fakeSequence)=='undefined'){eleDoc.fakeSequence=1;}
	var scrape,vScreen=(scrape=eleDoc.URL.match(/\&screen=(\w+)/i))?scrape[1]:null;
	var vWorld=(scrape=eleDoc.URL.match(/\/\/(\w+)\./i))?scrape[1]:null;
	var village=eleDoc.getElementsByTagName('title')[0].innerHTML.match(/\(\d+\|\d+\)/);
	if(vScreen=='place'){
		var index=0;var twCookie=eleDoc.cookie.match('[^|;]s?'+escapeStr(vWorld+'$'+config.Lista_de_Alvos+'$'+config.Nome_do_Cookie+'=')+'([^;]*)[;|$]');
		if(twCookie){index=parseInt(twCookie[1],10);}
		if(!eleDoc.getElementById('fakescript2_Tsalkapone'))
		{var eleInputs=eleDoc.getElementsByTagName('input');
	if(eleInputs){for(var ii=0;ii<eleInputs.length;ii++)
	{if(eleInputs[ii].name=='support')
	{var optionList='';
for(var jj=0;jj<coords.length;jj++){optionList+='<option>'+zeroPad(jj+1,4)+':'+coords[jj]+'</option>';}
var fakeonoma = config.Lista_de_Alvos;
var Commander_Table='<TD rowspan="2"><div id="fakes"><table class="main"><tr><td id="tsalkapone_fake_script2"><span style="font-weight:bold">';
Commander_Table+='<font color=darkred>⚡ Lista de Alvos ~ <font color=red>'+fakeonoma+'</font> ⚡ :</font>';
Commander_Table+='</span><select id="fakescript2_Tsalkapone" name="fakescript2_Tsalkapone" size="1" onchange="fnAssignTsalkapone_μονάδες(this.selectedIndex,true);">';
Commander_Table+=''+optionList+'</select>';
Commander_Table+="&emsp;<span class='tsaltooltip'><a onclick='Timing.pause();'><img class='tooltip' id=Tsalpausixronou1 src='https://dl.dropboxusercontent.com/s/eonrw4xocuy22xq/Tsalkapone_time.GIF' style='cursor: pointer; height: 20px; border: 20; top: +3px; position: relative; left: -1px'></a><span class='info' ></span></span></td></tr></table></div></TD>";

eleInputs[ii].parentNode.parentNode.innerHTML+=Commander_Table;
break;}

     /* ⚪⚪ TABELA DE TESTES ⚪⚪
var AtaqueFilter = (Ataque === true);
var config_table = "";
	config_table+='<div id="commander_config" class="clearfix vis float_right" style="position:absolute;margin-left:500px;margin-top:200px;z-index:1"><h4><font color="darkred"><center> ## CONFIGURAÇÕES ##</center></font></h4><table bottom="200px" class="vis" style="width: 100%"><tbody>';
	config_table+='<tr><td><font color="darkred"><b>Ativar Ataque</b></font></td>';
    config_table+='<td><label class="switch"><span class="slider"><input type="checkbox"></span></label>';
    config_table+='</tbody></table></div>';
if (! document.getElementById('commander_config')){
		$('#content_value').prepend(config_table);
}*/
     /* ⚪⚪ TABELA DE TESTES 2 ⚪⚪
var config_table = "";
   var config_table ='<div id="commander_config"><table class="vis"><tr><th colspan="40"><font color=maroon><center>Units Configuration</center></font></th></tr><tr>';
    config_table+='<td><img title="Aríete" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_ram.png"></td>';
 config_table+='<td><img title="Catapulta" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_cat.png"></td>';
    config_table+='<td><img title="Espadachin" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_sword.png"></td>';
config_table+='<td><img title="Lanceiro" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_spear.png"></td>';
config_table+='<td><img title="Bárbaro" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_axe.png"></td>';
config_table+='<td><img title="Arqueiro" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_archer.png"></td>';
    config_table+='<td><img title="C. Pesada" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_hc.png"></td>';
    config_table+='<td><img title="C. Arqueira" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_ma.png"></td>';
 config_table+='<td><img title="C. Leve" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_lc.png"></td>';
config_table+='<td><img title="Explorador" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_scout.png"></td>';
config_table+='</tr><tr><td><input id="ram4" type="number" placeholder="0" value="" min="0"></td>';
config_table+='<td><input id="cat4" type="number" placeholder="0" value="" min="0"></td>';
    config_table+='<td><input id="sword4" type="number" placeholder="0" value="" min="0"></td>';
config_table+='<td><input id="spear4" type="number" placeholder="0" value="" min="0"></td>';
 config_table+='<td><input id="axe4" type="number" placeholder="0" value="" min="0"></td>';
  config_table+='<td><input id="archer4" type="number" placeholder="0" value="" min="0"></td>';
    config_table+='<td><input id="heavy4" type="number" placeholder="0" value="" min="0"></td>';
    config_table+='<td><input id="marcher4" type="number" placeholder="0" value="" min="0"></td>';
    config_table+='<td><input id="light4" type="number" placeholder="0" value="" min="0"></select></td>';
config_table+='<td><input id="spy4" type="number" placeholder="0" value="" min="0"></td>';
config_table+='</tr><tr><th colspan="40"><font color=maroon><center>Configurações Gerais</center></font></th></tr>';
config_table+='<tr><td colspan="4"><font color=darkmagenta><b>Select the method of inserting coordinates</b></font></td>';
config_table+='<td colspan="6"><select id="tsalscriptmethod4"><option value="Random order">Random order</option>';
config_table+='<option value="Consecutive & Selective order">Consecutive & Selective order</option></select></td></tr>';
config_table+='<tr><td colspan="4"><font color=darkmagenta><b>Enter the coordinates of the targets</b></font></td>';
    config_table+='<td colspan="6"><textarea id=tsalcoords4 value="" rows="1" cols="50"></textarea></td></tr>';
    config_table+='<tr><td colspan="4"><font color=darkmagenta><b>Assign a shortcut key to Fake Settings</b></font></td>';
    config_table+='<td colspan="6"><input type="text" id=tsalkey4 value=""  size="35"></td></tr>';
    config_table+='<tr><td colspan="4"><font color=darkmagenta><b>Assign a shortcut key to Fake Script button</b></font></td>';
    config_table+='<td colspan="6"><input type="text" id=tsalakey4 value="" size="35"></td></tr>';
    config_table+='<tr><td colspan="4"><font color=darkmagenta><b>Enter a title for the Fake Button and cookie value</b></font></td>';
    config_table+='<td colspan="6"><input type="text" id=tsalname4 value="" size="35"></td></tr>';
    config_table+='</table></div><br>';
config_table+='<span class="tsaltooltip"><input id=Tsalsave4 type="button" class="btn tsalbutton" value="Save Settings"><span class="tsalinfo" >Click here to save the selected settings of this script. <br><br> If you dont save the settings the selected values wont be applied.</span></span>';
    config_table+='<span class="tsaltooltip"><input id=Tsalhide type="button" class="btn tsalbutton" value="Hide Settings"><span class="tsalinfo" >Click here to hide the current settings menu.</span></span>';
    config_table+='<span class="tsaltooltip"><input id=Tsalreset4 type="button" class="btn tsalbutton" value="Reset Settings"><span class="tsalinfo" >Click here to reset the settings of this script to their default values.</span></span>';
    config_table+='<span class="tsaltooltip"><input id=Tsalcount4 type="button" class="btn tsalbutton" value="Reset Counting"><span class="tsalinfo" >Click here to reset the counting clicks of this script.</span></span>';
     config_table+='</tbody></table></div>';
config_table+='<div class="target-select clearfix vis float_left"><h4><font color=maroon>Tsalkapone. Script Buttons List</font></h4><table class="vis" style="width: 100%"><tbody><tr><td>';
config_table+='<span class="tsaltooltip"><input type="button" id="Tsalactivate1" class="attack btn tsalbutton btn tsalbutton-attack btn tsalbutton-target-action" value="Nuke Script"><span class="tsalinfo" >Click here to activate the Nuke Script</span></span>';
config_table+='<span class="tsaltooltip"><input type="button" id="Tsalactivate3" class="attack btn tsalbutton btn tsalbutton-attack btn tsalbutton-target-action" value="Farming Script"><span class="tsalinfo" >Click here to activate the Farming Script</span></span>';
config_table+='<span class="tsaltooltip"><input type="button" id="Tsalactivate2" class="support btn tsalbutton btn tsalbutton-support btn tsalbutton-target-action" value="Support Script"><span class="tsalinfo" >Click here to activate the Support Script</span></span>';
config_table+='<span class="tsaltooltip"><input type="button" id="Tsalactivate4" class="btn tsalbutton btn tsalbutton-recruit" value="Fake Script"><span class="tsalinfo" >Click here to activate the Fake Script</span></span>';
config_table+="&emsp;<span class='tsaltooltip'><a onclick='Timing.pause();'><img class='tooltip' id=Tsalpausixronou1 src='https://dl.dropboxusercontent.com/s/eonrw4xocuy22xq/Tsalkapone_time.GIF' style='height: 20px; border: 20; top: +3px; position: relative; left: -1px'></a><span class='tsalinfo' >Click to pause every time counter on the page. Click again to restart the counters.</span></span>";
config_table+='</tr></tbody></table></div><br><br><br><br><br><hr>';
if (! document.getElementById('commander_config')){
		$('#command-data-form').prepend(config_table);
}*/
	}}}}
fnAssignTsalkapone_μονάδες(index,false);

    /* ⛔⛔⛔⛔⛔ FIM DO SCRIPT DO TSALKAPONE ⛔⛔⛔⛔⛔ */

    /* ⚪⚪⚪ CONFIGURAÇÕES DE SELEÇÃO DE UNIDADES TOTAIS ⚪⚪⚪ */

    var allUnits = ['Lança','Machado','Espada','C_Leve','Spy','C_Pesada','Ariete','Catas','Nobre','Arco','C_Arco'];
    if(Lança)document.getElementById('units_entry_all_spear').click();
    if(Machado)document.getElementById('units_entry_all_axe').click();
    if(Espada)document.getElementById('units_entry_all_sword').click();
    if(C_Leve)document.getElementById('units_entry_all_light').click();
    if(Spy)document.getElementById('units_entry_all_spy').click();
    if(C_Pesada)document.getElementById('units_entry_all_heavy').click();
    if(Ariete)document.getElementById('units_entry_all_ram').click();
    if(Catas)document.getElementById('units_entry_all_catapult').click();
    if(Nobre)document.getElementById('units_entry_all_snob').click();
    if(Arco)document.getElementById('units_entry_all_archer').click();
    if(C_Arco)document.getElementById('units_entry_all_marcher').click();
    if(Todas_as_Tropas)document.getElementById('selectAllUnits').click();

if (document.getElementById('units_entry_all_spear')) {   var Lança = parseInt( $('#units_entry_all_spear').text().replace(/[^0-9]/gi, ''));} else { Lança = 0;}
if (document.getElementById('units_entry_all_axe')) {   var Machado = parseInt( $('#units_entry_all_axe').text().replace(/[^0-9]/gi, ''));} else { Machado = 0;}
if (document.getElementById('units_entry_all_sword')) {   var Espada = parseInt( $('#units_entry_all_sword').text().replace(/[^0-9]/gi, ''));} else { Espada= 0;}
if (document.getElementById('units_entry_all_light')) {   var C_Leve = parseInt( $('#units_entry_all_light').text().replace(/[^0-9]/gi, ''));} else { C_Leve = 0;}
if (document.getElementById('units_entry_all_spy')) {   var Spy = parseInt( $('#units_entry_all_spy').text().replace(/[^0-9]/gi, ''));} else { Spy = 0;}
if (document.getElementById('units_entry_all_heavy')) {   var C_Pesada = parseInt( $('#units_entry_all_heavy').text().replace(/[^0-9]/gi, ''));} else { C_Pesada = 0;}
if (document.getElementById('units_entry_all_ram')) {   var Ariete = parseInt( $('#units_entry_all_ram').text().replace(/[^0-9]/gi, ''));} else { Ariete = 0;}
if (document.getElementById('units_entry_all_catapult')) {   var Catas = parseInt( $('#units_entry_all_catapult').text().replace(/[^0-9]/gi, ''));} else { Catas = 0;}
if (document.getElementById('units_entry_all_snob')) {   var Nobre = parseInt( $('#units_entry_all_snob').text().replace(/[^0-9]/gi, ''));} else { Nobre = 0;}
if (document.getElementById('unit_input_archer')) {
if (document.getElementById('units_entry_all_archer')) { var Arco = parseInt( $('#units_entry_all_archer').text().replace(/[^0-9]/gi, '')); }else { Arco = 0;}
if (document.getElementById('units_entry_all_marcher')) { var C_Arco = parseInt( $('#units_entry_all_marcher').text().replace(/[^0-9]/gi, ''));} else { C_Arco = 0;}
}

    /* ⚪⚪⚪ FIM DAS CONFIGURAÇÕES DE SELEÇÃO DE UNIDADES TOTAIS ⚪⚪⚪ */

    if (SemTropas)
{
    var erroFaltaUnid = document.getElementsByClassName("error_box");
    var found = false;
    for (i = 0; i < erroFaltaUnid.length && !found; i++)
    {
        var Error1 = erroFaltaUnid[i].innerHTML.search("Nenhuma unidade escolhida") != -1;
        var Error2 = erroFaltaUnid[i].innerHTML.search("Não existem unidades suficientes") != -1;
        var Error3 = erroFaltaUnid[i].innerHTML.search("A força de ataque precisa do mínimo de ") != -1;
        if (Error1 || Error2 || Error3)
        {
            found = true;
        }
    }
    if (found)
    {
        Ataque = false;
        Apoio = false;
}
}


        /* ⚫⚫⚫⚫⚫ CONFIGURAÇÕES EXTRA ~ ENVIO DE COMANDO (TEMPO) ⚫⚫⚫⚫⚫ */


            setTimeout(function() {
                if(Ataque === true) {
                    if(mobile === false) $("#target_attack").click(); else $("button[name = 'attack']").click();
                } else {
                    var link = null;
                }
/* ⭕ Var Ataque ⭕*/           },/*⭕TEMPO*/ 700,500);    /*⚡ SELECIONAR TEMPO PARA CLICAR EM ATAQUE(1000 = 1 SEG) | TEMPO ALEATÓRIO ENTRE OS DOIS SELECIONADOS ⚡*/
            console.log("DEBUG: Done!");

            setTimeout(function() {
                if(Apoio === true) {
                    if(mobile === false) $("#target_support").click(); else $("button[name = 'support']").click();
                } else {
                    var link = null;
                }
/* ⭕ Var Apoio ⭕*/            },/*⭕TEMPO*/ 700,500);    /*⚡ SELECIONAR TEMPO PARA CLICAR EM APOIO (1000 = 1 SEG) | TEMPO ALEATÓRIO ENTRE OS DOIS SELECIONADOS ⚡*/
            console.log("DEBUG: Done!");

    /* ⚫⚫⚫⚫⚫ FIM DAS CONFIGURAÇÕES EXTRA ⚫⚫⚫⚫⚫ */

}    /* ⛔⛔⛔⛔⛔ FIM DO SCRIPT ⛔⛔⛔⛔⛔ */

// ==UserScript==
// @name               ## COMMANDER OLD ##
// @namespace          https://pastebin.com/raw/18jkyETb
// @icon               https://i.imgur.com/U5lNIvW.png
//⭐ESCOLHA SEU ÍCONE  https://pastebin.com/raw/wpcDVCdE
// @author             TiKa and Tsalkapone
// @include            https://br*.tribalwars.com.br/*&screen=place*
// @version            5.8 (16/06/2019)
// @description        Comandante que Envia Ordens ao Oficial Encarregado!
// @changelog          ⌛ PARA MOSTRAR/OCULTAR CLIQUE NA SETA AO LADO DO NÚMERO "347" NA LINHA ABAIXO! ⌛
/*
1.0 - Script do Tsalkapone
2.0 - Traduzido para o Pt/Br
2.1 - Script Otimizado
2.2 - Variável de Ataque/Apoio Adicionada
2.3 - Adicionada Seção para Preenchimento de Tropas Totais
3.0 - Script Apelidado como COMMANDER
3.1 - Adicionadas Legendas, Tópicos e Informações Adicionais
3.2 - Adicionadas Var's de Troca de Aldeia, e Var de Ataque/Apoio Otimizada
3.3 - Nome do Script Alterado de "COMMANDER" para "## COMMANDER ##"
3.4 - Adicionadas Configurações de Tempos de Notificação (⭕)
3.5 - Var's Completamente Traduzidas para Pt/Br
3.6 - Corrigido Bug que Impedia o Script de Enviar as Unidades se o Número Selecionado for Igual ao Disponível na Aldeia
3.7 - Encontrado Bug na Var "SemTropas", Onde as Aldeias Continuavam a ser Passadas num LOOP Infinito (Var Desabilitada)
3.8 - Variáveis de Troca de Aldeia Transferidas ao ## CONFIRMATOR ##
3.9 - Erros de Ortografia Corrigidos!
4.0 - Variáveis de Tempo SINCRONIZADAS (Commander e Officer)
4.1 - Adicionado Ícone e Página com Ícones Pré-Selecionados para Facilidade de Personalização
4.2 - Adicionada Variável "SemTropas" onde o Script para de Enviar Comandos quando as Unidades Acabam
4.3 - Erros de Tradução Corrigidos
4.4 - Adicionada Descrição
4.5 - Códigos para Atualização Automática Incluídos!
4.6 - Script Revisado, Informações e Erros de Ortografia Corrigidos!
4.7 - Script Otimizado
4.8 - UserScript Movido ao Fim do Código
4.9 - Informações Corrigidas e Otimizadas
5.0 - Códigos de Tradução Retirados!
5.1 - Telas de Ajuda e Redirecionamento Otimizadas!
5.2 - Contato do FTW Adicionado
5.3 - Tela de ChangeLog Adicionada
5.4 - Corrigido Bug que Impedia o Script de Enviar os Exploradores se o Número Selecionado fosse Igual ao Disponível na Aldeia
5.5 - Corrigidos Erros de Tradução
5.6 - Adicionada Função para Mostrar MS
5.7 - Adicionada Função para Pausar Temporizadores
5.8 - Corrigido Bug na Geração de Cookies (Lista de Alvos Desabilitada)
*/
// @downloadURL https://update.greasyfork.org/scripts/36602/%20COMMANDER%20OLD%20.user.js
// @updateURL https://update.greasyfork.org/scripts/36602/%20COMMANDER%20OLD%20.meta.js
// ==/UserScript==