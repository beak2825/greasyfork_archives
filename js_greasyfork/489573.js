// ==UserScript==
// @name    Contador de votos BBB
// @description Esse script adiciona um contador simples de votos na página de votos por torcida. Para resetar a contagem, basta clicar em limpar
// @author Mael
// @version  1
// @license MIT
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js 
// @require https://update.greasyfork.org/scripts/383527/701631/Wait_for_key_elements.js
// @include https://gshow.globo.com/realities/bbb/bbb-24/voto-unico/*
// @include https://gshow.globo.com/realities/bbb/bbb-24/voto-da-torcida/*
// @grant    GM.getValue
// @grant    GM.setValue
// @grant    GM.deleteValue
// @namespace https://greasyfork.org/users/1273152
// @downloadURL https://update.greasyfork.org/scripts/489573/Contador%20de%20votos%20BBB.user.js
// @updateURL https://update.greasyfork.org/scripts/489573/Contador%20de%20votos%20BBB.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

const targetNode = document.getElementById("roulette-root");
const config = { attributes: true, childList: true, subtree: true };
let counted = false;
const observer = new MutationObserver(async mut => {
  const voteArea$ = $('button:contains("Votar Novamente")');
  const name = voteArea$.parent().parent().first().first().find('h1').children().last().text();
  if(name.length) {
    const count = await GM.getValue('votes', 0);
    if(!counted) {
			GM.setValue('votes', count + 1);
      counted = true;
      updateCounter();
    }
  } else {
    counted = false;
  }
});

observer.observe(targetNode, config);

async function updateCounter() {
  const count = await GM.getValue('votes', 0);
  area = $("#contador");
  if(area.length) {
  	area.remove(); 
  }

  $('#main-content').append(`<div id="contador" style="font-size: 20px;">Votos: <span style="font-weight: normal">${count}</span><small id="limpar" style="font-size: 10px; margin-left: 12px; color:red; cursor:pointer">Limpar</small></div>`);
  $('#limpar').click(function() {
    GM.setValue('votes', 0);
    updateCounter();
  });
}

waitForKeyElements('#main-content', function(){
  updateCounter();

});