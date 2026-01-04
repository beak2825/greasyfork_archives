// ==UserScript==
// @name         Kwai Customizer
// @namespace    Kwai Customizer
// @version      0.1
// @license      MIT
// @description  Aceito PIX Para Futuras Att 48898955820
// @author       https://greasyfork.org/pt-BR/users/305931-emerson-bardusco
// @match        https://www.kwai.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507180/Kwai%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/507180/Kwai%20Customizer.meta.js
// ==/UserScript==

(function() {
  'use strict';
  // Altera o fundo do site para preto
  document.body.style.background = '#000';

  // Altera a cor do texto para branco
  document.body.style.color = '#fff';

  // Esconde elementos desnecessários
  const elementosParaEsconder = [
    '.header',
    '.footer',
    '.ads',
    '.sidebar',
    '.nav',
  ];
  elementosParaEsconder.forEach((seletor) => {
    const elementos = document.querySelectorAll(seletor);
    elementos.forEach((elemento) => {
      elemento.style.display = 'none';
    });
  });

  // Reorganiza a disposição dos elementos
  const conteudoPrincipal = document.querySelector('.main-content');
  conteudoPrincipal.style.width = '80%';
  conteudoPrincipal.style.margin = '0 auto';

  // Adiciona um estilo personalizado ao site
  const estiloPersonalizado = document.createElement('style');
  estiloPersonalizado.innerHTML = `
    .video-card {
      background-color: #333;
      padding: 10px;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }
    .botao {
      background-color: #333;
      color: #fff;
      padding: 10px;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }
  `;
  document.head.appendChild(estiloPersonalizado);
})();