// ==UserScript==
// @name           Agendador de coordenado
// @author         Marcos V.S. Marques
// @email          tribalwarsbr100@gmail.com
// @namespace      https://www.youtube.com/channel/UCIngQdlpQxocFDB4Vk6yERg
// @version        2.4 (JUN/2017)
// @grant          Publico
// @description    BOOT ANTI SNIPE  (linguagem: javascript-ECMAscript5;)
// @Realiza        ATAQUES MINUCIOSOS COM MILLESIMOS DE SEGUNDOS COM PERFEIÇÃO MAXIMA.
// @Opções         OPÇÃO DELAY PARA ATRASAR SEU ATAQUE, OU ADIANTAR SEU ATAQUE OPÇÃO VAI DE ACORDO COM VELOCIDADE DA SUA INTERNET, E OUTROS FATORES
// @Utilização     NA PRAÇA DE REUNIÃO OPÇÃO CONFIRMAR ATAQUE (ULTIMA ETAPA DE UM ATAQUE)
// @include        https://*screen=place&try=confirm*
// @run-at         document-start
// @icon           https://media.innogamescdn.com/com_DS_FR/Quickbar/priest.png
// @downloadURL https://update.greasyfork.org/scripts/397326/Agendador%20de%20coordenado.user.js
// @updateURL https://update.greasyfork.org/scripts/397326/Agendador%20de%20coordenado.meta.js
// ==/UserScript==

/*	Changelog versão 2.3
*        Equipe do Canal Youtube TW 100 Foi Realizado a Mais Recente Atualização Para Implatação da universalização do conteudo do canal, assim tornando nosso conteudo cada vez mais usual e presente em todos servidores de tribalwars.
*        Equipe do Canal Youtube TW 100 Solicita humildemente a colaboração dos usuarios dos conteudos abragidos no canal com likes, curtidas, comentarios nos videos, e com compartilhamento dos videos, isso era proporcionar um crescimen to do canal, e com isso cada vez  mais iremos trazer mais conteudo.
*        Equipe do Canal Youtube TW 100 se reserva ao direito de possuir a posse do codigo-fonte  do script, quaisquer modificação deve ser solicitado via email, segundos regras da Licença Pública Geral GNU
*        Equipe do Canal Youtube TW 100 não se responsabiliza por eventuais danos causados pela utilização do script
*        Equipe do Canal Youtube TW 100 promove a canpanha "Software livre não e virus nem boot" abraça e se solidariza com os scripts de tampermonkey voltados para o game tribal wars, do qual as equipes inesperientes de suporte, sem conhecimento, e sem saber a historia dos primordios do game, impõe um pensamento de que os script de tampermonkey são proibidos. Muitas das melhorias no game, que se deu atraves de scrips de tampermonkey, feitos de players para players, Alem do qual esse pensamento foi uma forma da da grande empresa tutora do game promover seus ganhos com recursos pagos, e assim prejudicando os jogadores que não utiliza de dinheiro para jogar, *EQUIPE TW 100 DEIXA CLARO, QUE NÃO E PRECISO TER FUNÇÕES PAGAS PARA USUFLUIR DO GAME, TEMOS A MISSÃO DE TRAZER UMA INGUALAÇÃO DO QUAL OS PLAYERS QUE NÃO USUFLEM DE RECURSOS PREMIUNS TENHA A SUA DIPONIBILIDADE OS MESMO RECURSOS DOS QUE TEM*/
/*		 Equipe do Canal Youtube TW 100 no dia 25/06/2017 v2.0i primeira versão para atualização TW 8.89
*        Equipe do Canal Youtube TW 100 Script em desenvolvimento, ao longo do tempo, de acordo com o tempo disponivel iremos adicionar mais funções
*/


/*TW100*/ /* LOGO IREMOS CRIAR NOSSA PLAYLIST NO YOUTUBE SOMENTE COM SCRIPT TAMPERMONKEY*/

/* SettingsAPI: CANAL DO YOUTUBE TW 100
		-------------------------------------------------------------------------------------
		+---++---++-+-+++---+++---     +---++---+     ++--+++---+++-+++----+++-+++--+-+---+     +----+------     -++-+---++---+
¦+-+¦¦+-+¦¦¦++¦¦¦+-+¦¦¦---     ++++¦¦+-+¦     ¦++++¦¦+-+¦¦¦-¦¦¦++++¦¦¦-¦¦¦++¦-¦+--+     ¦++++¦------     ++¦-¦+-+¦¦+-+¦
¦¦-++¦¦-¦¦¦++++¦¦¦-¦¦¦¦---     -¦¦¦¦¦¦-¦¦     ++++++¦¦-¦¦¦¦-¦¦++¦¦++¦¦-¦¦¦++++¦+--+     ++¦¦++++++++     ++¦-¦¦¦¦¦¦¦¦¦¦
¦¦-++¦+-+¦¦¦++¦¦¦+-+¦¦¦-++     -¦¦¦¦¦¦-¦¦     -++++-¦¦-¦¦¦¦-¦¦--¦¦--¦¦-¦¦¦+-+¦¦+--+     --¦¦--¦++++¦     -¦¦-¦¦¦¦¦¦¦¦¦¦
¦+-+¦¦+-+¦¦¦-¦¦¦¦+-+¦¦+-+¦     ++++¦¦+-+¦     --¦¦--¦+-+¦¦+-+¦--¦¦--¦+-+¦¦+-+¦¦+--+     --¦¦--++++++     ++++¦+-+¦¦+-+¦
+---+++-++++-+-+++-+++---+     +---++---+     --++--+---++---+--++--+---++---++---+     --++---++++-     +--++---++---+
+----+------     -++-+---++---+
¦++++¦------     ++¦-¦+-+¦¦+-+¦
++¦¦++++++++     ++¦-¦¦¦¦¦¦¦¦¦¦
--¦¦--¦++++¦     -¦¦-¦¦¦¦¦¦¦¦¦¦
--¦¦--++++++     ++++¦+-+¦¦+-+¦
--++---++++-     +--++---++---+
¦¦¦?¦¦¦¦¦¦¦ ]____________?
?_?¦¦¦¦¦¦¦¦¦?_??
I¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦¦].
???????????????...
*/

CommandSender = {
 confirmButton: null,
 duration: null,
 dateNow: null,
 offset: null,
 init: function() {
  $($('#command-data-form').find('tbody')[0]).append('<tr><td>Chegada:</td><td> <input type="datetime-local" id="CStime" step=".001"> </td></tr><tr> <td>Offset:</td><td> <input type="number" id="CSoffset"> <button type="button" id="CSbutton" class="btn">Confirmar</button> </td></tr>');
  this.confirmButton = $('#troop_confirm_go');
  this.duration = $('#command-data-form').find('td:contains("Duração:")').next().text().split(':').map(Number);
  this.offset = localStorage.getItem('CS.offset') || -250;
  this.dateNow = this.convertToInput(new Date());
  $('#CSoffset').val(this.offset);
  $('#CStime').val(this.dateNow);
  $('#CSbutton').click(function() {
   var offset = Number($('#CSoffset').val());
   var attackTime = CommandSender.getAttackTime();
   localStorage.setItem('CS.offset', offset);
   CommandSender.confirmButton.addClass('btn-disabled');
   setTimeout(function() {
    CommandSender.confirmButton.click();
   },attackTime-Timing.getCurrentServerTime()+offset);
   this.disabled = true;
  });
 },
 getAttackTime: function() {
  var d = new Date($('#CStime').val().replace('T',' '));
  d.setHours(d.getHours()-this.duration[0]);
  d.setMinutes(d.getMinutes()-this.duration[1]);
  d.setSeconds(d.getSeconds()-this.duration[2]);
  return d;
 },
 convertToInput: function(t) {
  t.setHours(t.getHours()+this.duration[0]);
  t.setMinutes(t.getMinutes()+this.duration[1]);
  t.setSeconds(t.getSeconds()+this.duration[2]);
  var a = {
   y: t.getFullYear(),
   m: t.getMonth() + 1,
   d: t.getDate(),
   time: t.toTimeString().split(' ')[0],
   ms: t.getMilliseconds()
  };
  if (a.m < 10) {
   a.m = '0' + a.m;
  }
  if (a.d < 10) {
   a.d = '0' + a.d;
  }
  if (a.ms < 100) {
   a.ms = '0' + a.ms;
   if (a.ms < 10) {
    a.ms = '0' + a.ms;
   }
  }
  return a.y + '-' + a.m + '-' + a.d + 'T' + a.time + '.' + a.ms;
 },
 addGlobalStyle: function(css) {
  var head, style;
     head = document.getElementsByTagName('head')[0];
     if (!head) { return; }
     style = document.createElement('style');
     style.type = 'text/css';
     style.innerHTML = css;
     head.appendChild(style);
 }
};
CommandSender.addGlobalStyle('#CStime, #CSoffset {font-size: 9pt;font-family: Verdana,Arial;}#CSbutton {float:right;}');
var a = setInterval(function(){
 if (document.getElementById('command-data-form') && jQuery) {
  CommandSender.init();
  clearInterval(a);
 }
},1); // faster load