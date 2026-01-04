// ==UserScript==
// @name        Pesquisa de Palavras-chave Extensas
// @namespace   wolftbd
// @description Pesquisa palavras-chave extensas no Greasyfork
// @include     http://greasyfork.org/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/472219/Pesquisa%20de%20Palavras-chave%20Extensas.user.js
// @updateURL https://update.greasyfork.org/scripts/472219/Pesquisa%20de%20Palavras-chave%20Extensas.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
  var input, filter, div, script, a, i, txtValue;
  input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('id', 'myInput');
  input.setAttribute('placeholder', 'Pesquise por palavras-chave..');
  input.addEventListener('keyup', myFunction);
  document.body.insertBefore(input, document.body.firstChild);

  function myFunction() {
    filter = input.value.toUpperCase();
    div = document.getElementById('script-list');
    script = div.getElementsByTagName('div');

    for (i = 0; i < script.length; i++) {
      a = script[i].getElementsByTagName('a')[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        script[i].style.display = "";
      } else {
        script[i].style.display = "none";
      }
    }
  }
}, false);