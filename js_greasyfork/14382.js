// ==UserScript==
// @name        eRep Msg Test
// @namespace   http://no.ne
// @description erep frist msger test
// @version     0.2.3
// @grant       none
// @include http://*erepublik.com/*/main/messages-compose/*/1
// @include http://*erepublik.com/*/main/messages-compose/*/1
// @downloadURL https://update.greasyfork.org/scripts/14382/eRep%20Msg%20Test.user.js
// @updateURL https://update.greasyfork.org/scripts/14382/eRep%20Msg%20Test.meta.js
// ==/UserScript==

  var msg_subject = "Seja Bem-Vindo!";
  var msg_description = "Olá, Caro Novato!\n\nSeja bem-vindo ao eRepublik. Inicialmente, vão algumas [b]dicas super importantes[/b]:\n\n- Guarde todo o seu gold e dinheiro. Não gaste com nada.\n- Foque na sua força e não lute, assim você ficará mais forte com nível mais baixo.\n\nAlém disso, gostaria de me disponibilizar parar [b]tirar qualquer dúvida[/b]. Basta [b]responder esta mensagem[/b] ou me chamar no chat no canto inferior direito da sua tela! Estarei sempre disposto a ajudar.\n\nEspero que divirta-se!\nStor Vali.";

  var subjectBox= document.getElementById('citizen_subject');
  subjectBox.value = msg_subject;

  var msgBox = document.getElementById('citizen_message');
  msgBox.value= msg_description;

  var submit = document.getElementsByClassName('message_submit');

  if(submit.length >= 1){
    submit[0].click();
  }

  setTimeout( function() { window.close(); }, 2800);
