// ==UserScript==
// @name         Olx
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Remove todas as cidades que não são BH
// @author       Marcello Cavazza
// @match        https://www.olx.com.br/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/b/b3/Logo_olx.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541279/Olx.user.js
// @updateURL https://update.greasyfork.org/scripts/541279/Olx.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var button = document.createElement('button');

    button.textContent = 'Remover cidades';
    button.style.zIndex = '99999999';
    button.style.position = 'fixed';
    button.style.top = '20px';
    button.style.left = '20px';
    button.style.background = '#007bff';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.padding = '10px 20px';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    document.body.appendChild(button);

    button.addEventListener('click', function () {
    console.log('starting olx cleaning script')
      const lojasGrid = document.getElementsByClassName('AdListing_gridLayout__DTjHC');

      lojasGrid[0].childNodes.forEach((loja) => {
          var lojaLocalizacao = loja.textContent.trim();
          
          if (lojaLocalizacao.toLowerCase().replaceAll(" ", "").indexOf("belohorizonte") == -1)
          {
            loja.style.display = 'none'
          }
      });
    console.log('ending olx cleaning script')
    });
})();