// ==UserScript==
// @name        Suprimir colunas com transbordamento de conteúdo - e-desk.com.br
// @namespace   Violentmonkey Scripts
// @match       https://nebrasil.e-desk.com.br/Portal/ListaSolicitacao.aspx
// @grant       none
// @version     1.1
// @author      Ramiro Fróes Ferrão <rfferrao@nebrasil.com.br>
// @description 17/03/2022 14:30:41
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/441672/Suprimir%20colunas%20com%20transbordamento%20de%20conte%C3%BAdo%20-%20e-deskcombr.user.js
// @updateURL https://update.greasyfork.org/scripts/441672/Suprimir%20colunas%20com%20transbordamento%20de%20conte%C3%BAdo%20-%20e-deskcombr.meta.js
// ==/UserScript==

// Detalhamento trabalho existe?

function suprimirDetalhamentoTrabalho() {
  var dtExiste = Array.from(window.document.querySelectorAll('th.rgHeader a')).some(th => th.text == 'Detalhamento Trabalho');
  
  if (dtExiste) {
    // Percorre cada linha — ou tr, referente a cada chamado da fila — da tabela
    Array.from(window.document.getElementsByClassName('rgRow')).forEach(row => {
      // Procura por maior td dentro de linha (tr) da tabela
      var td = Array.from(row.getElementsByTagName('td')).reduce((a, b) => a.textContent.length > b.textContent.length ? a : b);
      
      if (td.offsetWidth > 500 || td.offsetHeight > 50) {
        td.title = td.textContent;
        td.style.cssText += 'white-space: nowrap; text-overflow: ellipsis;'
      }
    });
  }
}

suprimirDetalhamentoTrabalho();

var divSolicitacoes = window.document.getElementById('cph1_uppS');

var observer = new MutationObserver(function(mutationsList, observer) {
  suprimirDetalhamentoTrabalho();
});

observer.observe(divSolicitacoes, {characterData: false, childList: true, attributes: false});