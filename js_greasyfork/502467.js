// ==UserScript==
// @name         Bonk.io Unlimited Players
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Modifica o jogo Bonk.io para permitir um número ilimitado de jogadores em uma sala
// @author LepTark
// @match        *://bonk.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502467/Bonkio%20Unlimited%20Players.user.js
// @updateURL https://update.greasyfork.org/scripts/502467/Bonkio%20Unlimited%20Players.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function modifyGame() {
        console.log('Modifying game...');

        // Exemplo: Modificar o número de jogadores permitidos em uma sala
        // Esta função é fictícia e não funcionará de verdade sem conhecer a estrutura interna do jogo

        const originalJoinRoomFunction = window.joinRoomFunction;
        
        if (originalJoinRoomFunction) {
            window.joinRoomFunction = function(roomId) {
                // Permitir número ilimitado de jogadores
                let playerCount = 1000000; // Defina um número muito alto para simular "jogadores infinitos"

                // Chame a função original com o novo valor
                return originalJoinRoomFunction.apply(this, [roomId, playerCount]);
            };
            console.log('Game modified to allow unlimited players in a room.');
        } else {
            console.log('Original join room function not found.');
        }
    }

    // Esperar o jogo carregar completamente antes de modificar
    window.addEventListener('load', function() {
        setTimeout(modifyGame, 3000); // Atraso para garantir que o jogo tenha carregado
    });
})();
