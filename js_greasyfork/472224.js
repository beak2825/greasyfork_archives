// ==UserScript==
// @name        Pesquisa de Palavras-chave Extensas
// @namespace   GreasyforkUser
// @description Pesquisa palavras-chave extensas em qualquer página da web
// @include     *://*/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/472224/Pesquisa%20de%20Palavras-chave%20Extensas.user.js
// @updateURL https://update.greasyfork.org/scripts/472224/Pesquisa%20de%20Palavras-chave%20Extensas.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
  var input, filter, body, text, i, txtValue;
  var markedWords = [];
  input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('id', 'myInput');
  input.setAttribute('placeholder', 'Pesquise por palavras-chave..');
  input.setAttribute('style', 'position: fixed; top: 0; z-index: 1000');
  document.body.appendChild(input);

  var downloadBtn = document.createElement('button');
  downloadBtn.innerText = 'Download Keywords';
  downloadBtn.setAttribute('style', 'position: fixed; top: 50px; z-index: 1000');
  document.body.appendChild(downloadBtn);

  function myFunction() {
    // limpa as marcações antigas
    var marked = document.querySelectorAll('mark');
    marked.forEach(function(mark) {
      var parent = mark.parentNode;
      while (mark.firstChild) {
        parent.insertBefore(mark.firstChild, mark);
      }
      parent.removeChild(mark);
    });

    filter = input.value.toLowerCase();
    var bodyTextNodes = textNodesUnder(document.body);
    var range, content, newNode;

    bodyTextNodes.forEach(function(node) {
      content = node.textContent;
      if (content.toLowerCase().includes(filter)) {
        range = document.createRange();
        range.selectNodeContents(node);
        newNode = document.createElement('mark');
        newNode.textContent = filter;
        range.deleteContents();
        range.insertNode(newNode);
        markedWords.push(filter);
      }
    });
  }

  // returns a flat array of all text nodes under an element
  function textNodesUnder(el) {
    var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
    while(n=walk.nextNode()) a.push(n);
    return a;
  }

  input.addEventListener('keyup', myFunction);

  downloadBtn.addEventListener('click', () => {
    var textToSave = markedWords.join('\n');
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:attachment/text,' + encodeURI(textToSave);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'keywords.txt';
    hiddenElement.click();
  });
}, false);