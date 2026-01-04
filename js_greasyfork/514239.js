// ==UserScript==
// @name         Bonk.io Level Up to 102
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Aumenta o nível do personagem para 102
// @match        https://bonk.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514239/Bonkio%20Level%20Up%20to%20102.user.js
// @updateURL https://update.greasyfork.org/scripts/514239/Bonkio%20Level%20Up%20to%20102.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Aguarde o jogo carregar completamente
    const checkGameLoaded = setInterval(() => {
        if (typeof window.player !== 'undefined') {
            clearInterval(checkGameLoaded);
            setPlayerLevel(102);
        }
    }, 1000); // Verifica a cada segundo

    function setPlayerLevel(level) {
        if (typeof window.player !== 'undefined') {
            player.level = level; // Define o nível do jogador para 102
            console.log("Nível do jogador definido para:", player.level);
        }
    }
})();
