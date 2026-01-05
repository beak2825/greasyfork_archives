// ==UserScript==
// @name        MV ref tpm
// @namespace   elraro@elraro.eu
// @description Block ref links in MV
// @include http*://mediavida.com/*
// @include http*://www.mediavida.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24151/MV%20ref%20tpm.user.js
// @updateURL https://update.greasyfork.org/scripts/24151/MV%20ref%20tpm.meta.js
// ==/UserScript==

var scriptCode = []; // Vamos a guardar el script aqui
var expression = new RegExp(/https?:\/\/(www\.)?amazon\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)

scriptCode.push('function amazon(){}'); // Vamos a reemplazar la función
var script = document.createElement('script'); // Creamos el objeto script
script.innerHTML = scriptCode.join('\n');
scriptCode.length = 0;
document.getElementsByTagName('head') [0].appendChild(script);

var links = document.getElementsByTagName('a');
var url;
for(var i=0; i<links.length; i++) {
  if (expression.test(links[i].href)) {
    url = links[i].href.split('%3F')
    links[i].setAttribute('href', url[0])
  }
}
