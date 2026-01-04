// ==UserScript==
// @name         Alterna o movimento de sprites de dragão no Scratch
// @namespace    https://greasyfork.org/pt-BR/users/305931-emerson-bardusco
// @version      1.1
// @description  Alterna o movimento de sprites de dragão entre MOVES.ClapHigh e MOVES.ClapLow a cada 2 medidas no Scratch.
// @license      MIT
// @author       EmersonxD
// @match        https://scratch.mit.edu/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465549/Alterna%20o%20movimento%20de%20sprites%20de%20drag%C3%A3o%20no%20Scratch.user.js
// @updateURL https://update.greasyfork.org/scripts/465549/Alterna%20o%20movimento%20de%20sprites%20de%20drag%C3%A3o%20no%20Scratch.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const DRAGON_SPRITE_1 = makeNewDanceSprite("DRAGON", null, {x: 100, y: 200});
  const DRAGON_SPRITE_2 = makeNewDanceSprite("DRAGON", null, {x: 300, y: 200});
  setBackgroundEffectWithPalette("disco_ball", "rand");
  const TIMESTAMP_MEASURES = 2;

  // Define uma função que alterna o movimento do sprite entre MOVES.ClapHigh e MOVES.ClapLow
  function alternarMovimento(sprite, movimento1, movimento2) {
    const movimentoAtual = sprite.getMove();
    if (movimentoAtual === movimento1) {
      sprite.setMove(movimento2, 1);
    } else {
      sprite.setMove(movimento1, 1);
    }
  }

  // Alterna o movimento dos sprites de dragão a cada 2 medidas
  atTimestamp(TIMESTAMP_MEASURES, "measures", function () {
    alternarMovimento(DRAGON_SPRITE_1, MOVES.ClapHigh, MOVES.ClapLow);
    alternarMovimento(DRAGON_SPRITE_2, MOVES.ClapLow, MOVES.ClapHigh);
  });

})();