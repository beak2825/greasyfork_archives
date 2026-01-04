// ==UserScript==
// @name        Pesquisa de Palavras-chave Extensas
// @namespace   GreasyforkUser
// @description Pesquisa palavras-chave extensas em qualquer página da web
// @include     *://*/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/472222/Pesquisa%20de%20Palavras-chave%20Extensas.user.js
// @updateURL https://update.greasyfork.org/scripts/472222/Pesquisa%20de%20Palavras-chave%20Extensas.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
  var input, filter, body, text, i, txtValue;
  input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('id', 'myInput');
  input.setAttribute('placeholder', 'Pesquise por palavras-chave..');
  input.setAttribute('style', 'position: fixed; top: 0; z-index: 1000');
  document.body.appendChild(input);

  function myFunction() {
    filter = input.value.toUpperCase();
    body = document.body;
    text = body.getElementsByTagName('p');

    for (i = 0; i < text.length; i++) {
      txtValue = text[i].textContent || text[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        text[i].style.display = "";
      } else {
        text[i].style.display = "none";
      }
    }
  }

  input.addEventListener('keyup', myFunction);
}, false);