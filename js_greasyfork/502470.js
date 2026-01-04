// ==UserScript==
// @name         Bonk.io Unlimited Players
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Tenta modificar o limite de jogadores em Bonk.io
// @author       Leptark
// @match        https://bonk.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502470/Bonkio%20Unlimited%20Players.user.js
// @updateURL https://update.greasyfork.org/scripts/502470/Bonkio%20Unlimited%20Players.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para alterar o limite de jogadores
    function modifyPlayerLimit() {
        // Código para modificar o limite de jogadores
        // Este código é apenas um exemplo fictício e pode não funcionar
        // sem acesso ao código real do jogo.

        // Exemplo fictício de como você poderia alterar a configuração
        // Verifique a estrutura da página e o código fonte para encontrar
        // a variável ou a configuração correta.
        
        try {
            // Acesso fictício ao objeto de configuração do jogo
            let gameConfig = window.gameConfig; // Modifique conforme necessário
            if (gameConfig) {
                gameConfig.maxPlayers = 999999999; // Novo limite de jogadores
                console.log(`Número máximo de jogadores atualizado para: ${gameConfig.maxPlayers}`);
            } else {
                console.log("Não foi possível acessar a configuração do jogo.");
            }
        } catch (e) {
            console.error("Erro ao modificar o limite de jogadores:", e);
        }
    }

    // Execute a função quando o jogo estiver carregado
    window.addEventListener('load', modifyPlayerLimit);
})();
