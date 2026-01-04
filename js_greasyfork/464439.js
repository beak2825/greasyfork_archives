// ==UserScript==
// @name         Macro Agario Massa Quente
// @namespace    http://tampermonkey.net/
// @version      1.3
// @author       EmersonxD
// @match        https://emupedia.net/emupedia-game-agar.io/*
// @grant        none
// @run-at       document-end
// @description  Editado por EmersonxD
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464439/Macro%20Agario%20Massa%20Quente.user.js
// @updateURL https://update.greasyfork.org/scripts/464439/Macro%20Agario%20Massa%20Quente.meta.js
// ==/UserScript==
// Configurações
const config = {
  Feed: false,
  Speed: 20,
  Keyboard: {
    Feed: 87, // W
    Center: 83, // S
    Split: 69, // Shift
    TripleSplit: [52, 'yourkey', 'yourkey2'], // 4, custom keys
    Respawn: 82, // R
  },
};

// Funções
function triggerKeyDown(keyCode) {
  const event = $.Event('keydown', { keyCode });
  $('body').trigger(event);
}

function triggerKeyUp(keyCode) {
  const event = $.Event('keyup', { keyCode });
  $('body').trigger(event);
}

function split() {
  triggerKeyDown(config.Keyboard.Split);
  triggerKeyUp(config.Keyboard.Split);
}

function mass() {
  if (config.Feed) {
    triggerKeyDown(config.Keyboard.Feed);
    triggerKeyUp(config.Keyboard.Feed);
    setTimeout(mass, config.Speed);
  }
}

function keyDownHandler(event) {
  switch (event.keyCode) {
    case config.Keyboard.Feed:
      config.Feed = true;
      setTimeout(mass, config.Speed);
      break;
    case config.Keyboard.Center:
      centerCell();
      break;
    case config.Keyboard.Split:
      split();
      break;
    case config.Keyboard.Respawn:
      closeStats();
      respawn();
      break;
  }

  // Triple split
  if (config.Keyboard.TripleSplit.includes(event.keyCode)) {
    split();
    setTimeout(split, config.Speed);
    setTimeout(split, config.Speed * 2);
    setTimeout(split, config.Speed * 3);
  }
}

function keyUpHandler(event) {
  if (event.keyCode === config.Keyboard.Feed) {
    config.Feed = false;
  }
}

function centerCell() {
  const X = window.innerWidth / 2;
  const Y = window.innerHeight / 2;
  const event = $.Event('mousemove', { clientX: X, clientY: Y });
  $('canvas').trigger(event);
}

// Inicialização
$(document).ready(() => {
  $(window).on('keydown', keyDownHandler);
  $(window).on('keyup', keyUpHandler);
});