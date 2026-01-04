// ==UserScript==
// @name        Buscar Palavras-chave
// @namespace   http://greasyfork.org
// @description buscar palavras chaves  
// @include     * // https://emojitera.com
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/472275/Buscar%20Palavras-chave.user.js
// @updateURL https://update.greasyfork.org/scripts/472275/Buscar%20Palavras-chave.meta.js
// ==/UserScript==

// Define a palavra-chave que você deseja buscar
var keyword = 'emojiterra';

// Cria uma expressão regular com a palavra-chave
var regex = new RegExp(keyword, 'i');

// Busca todos os elementos do documento
var elements = document.querySelectorAll('*');

// Filtra os elementos para encontrar aqueles que contêm a palavra-chave
var matchingElements = Array.from(elements).filter(element => regex.test(element.textContent));

// Imprime os elementos que contêm a palavra-chave, junto com seu código fonte
matchingElements.forEach(element => {
  console.log(element);
  console.log(element.outerHTML);
});