// ==UserScript==
// @name         Macro AGMA.IO
// @namespace https://greasyfork.org/pt-BR/users/305931-emerson-bardusco
// @version      6.1
// @license      MIT
// @description  Editado por EmersonxD
// @author       EmersonxD
// @match        http://agma.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/465877/Macro%20AGMAIO.user.js
// @updateURL https://update.greasyfork.org/scripts/465877/Macro%20AGMAIO.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Configurações globais
  const FEEDING_KEY = 'W';
  const FEEDING_INTERVAL = 20;
  const SPLIT_KEY = 'Space';
  const SPLIT_INTERVAL = 50;
  const SPLIT_COUNT_KEY = 'Q';
  const SPLIT_COUNT_DEFAULT = 4;
  const CUSTOM_SPLIT_COUNT_PROMPT = 'Digite a quantidade de vezes que deseja dividir a célula:';
  const CUSTOM_SPLIT_COUNT_MIN = 2;
  const MOVE_KEY = 'Shift';
  const MOVE_KEY_ALT = '4';
  const FEED_MOUSE_KEY = 'R';
  const FEED_MOUSE_MESSAGE = 'nick';

  // Variáveis globais
  let feeding = false;
  let splitCount = SPLIT_COUNT_DEFAULT;

  // Função para alimentar a célula
  function feed() {
    if (feeding) {
      const eventKeyDown = new KeyboardEvent('keydown', { keyCode: getKeyCode(FEEDING_KEY) });
      const eventKeyUp = new KeyboardEvent('keyup', { keyCode: getKeyCode(FEEDING_KEY) });
      document.dispatchEvent(eventKeyDown);
      document.dispatchEvent(eventKeyUp);
      setTimeout(feed, FEEDING_INTERVAL);
    }
  }

  // Função para dividir a célula em várias partes
  function split() {
    const eventKeyDown = new KeyboardEvent('keydown', { keyCode: getKeyCode(SPLIT_KEY) });
    const eventKeyUp = new KeyboardEvent('keyup', { keyCode: getKeyCode(SPLIT_KEY) });
    document.dispatchEvent(eventKeyDown);
    document.dispatchEvent(eventKeyUp);
  }

  // Função para executar o truque de divisão
  function doSplitTrick() {
    split();
    setTimeout(split, SPLIT_INTERVAL);
    setTimeout(split, SPLIT_INTERVAL * 2);
    setTimeout(split, SPLIT_INTERVAL * 3);
  }

  // Função para executar a divisão personalizada
  function doCustomSplit() {
    splitCount = prompt(CUSTOM_SPLIT_COUNT_PROMPT, splitCount);
    splitCount = parseInt(splitCount, 10);
    if (isNaN(splitCount) || splitCount < CUSTOM_SPLIT_COUNT_MIN) {
      alert(`A quantidade de divisão deve ser um número maior ou igual a ${CUSTOM_SPLIT_COUNT_MIN}.`);
      return;
    }
    for (let i = 0; i < splitCount; i++) {
      split();
    }
  }

  // Função para mover a célula para o centro da tela
  function moveToCenter() {
    const x = window.innerWidth / 2;
    const y = window.innerHeight / 2;
    const eventMouseMove = new MouseEvent('mousemove', { clientX: x, clientY: y });
    document.querySelector('canvas').dispatchEvent(eventMouseMove);
  }

  // Função para executar a ação do botão do mouse
  function doFeedMouse() {
    const nick = document.getElementById(FEED_MOUSE_MESSAGE).value;
    const eventRspwn = new CustomEvent('rspwn', { detail: { nick } });
    document.dispatchEvent(eventRspwn);
  }

  // Função para lidar com a tecla pressionada
  function onKeyDown(event) {
    switch (getKeyCode(event)) {
      case getKeyCode(FEEDING_KEY):
        feeding = true;
        feed();
        break;
      case getKeyCode(MOVE_KEY):
      case getKeyCode(MOVE_KEY_ALT):
        moveToCenter();
        break;
      case getKeyCode(SPLIT_KEY):
        split();
        break;
      case getKeyCode(SPLIT_COUNT_KEY):

        doCustomSplit();

        break;

      case getKeyCode(FEED_MOUSE_KEY):

        doFeedMouse();

        break;

      default:

        break;

    }

  }


  // Função para lidar com a tecla solta

  function onKeyUp(event) {

    if (getKeyCode(event) === getKeyCode(FEEDING_KEY)) {

      feeding = false;

    }

  }


  // Função para obter o código da tecla

  function getKeyCode(event) {

    return event.keyCode || event.which;

  }


  // Função para adicionar event listeners para as teclas pressionadas e soltas

  function addEventListeners() {

    document.addEventListener('keydown', onKeyDown);

    document.addEventListener('keyup', onKeyUp);

  }


  // Função para inicializar o script

  function init() {

    addEventListeners();

  }


  // Inicializa o script quando a página é carregada

  window.addEventListener('load', init);

})();