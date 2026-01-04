// ==UserScript==
// @name         Auto Bet Script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automate betting on the mentioned website
// @author       You
// @match        https://betfury.io/inhouse/mines?tab=all
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475451/Auto%20Bet%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/475451/Auto%20Bet%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Defina suas configurações aqui
    const maxRounds = 2; // Número máximo de rodadas
    const initialBetAmount = 10; // Quantidade inicial de aposta
    const doubleOnLoss = true; // Dobrar a aposta em caso de perda
    const decreaseOnWin = true; // Diminuir a aposta em caso de vitória
    const stopOnProfit = 0; // Parar após atingir esse valor de lucro
    const stopOnLoss = 0; // Parar após atingir essa perda

    let currentRound = 0;
    let currentBetAmount = initialBetAmount;

    function placeBet() {
        // Preencha o campo de aposta e clique no botão de aposta
        document.querySelector('input[placeholder="0"]').value = currentBetAmount;
        document.querySelector('.bet-amount__btn_max').click();

        // Simule o clique no botão de aposta
        console.log(`Apostando ${currentBetAmount} FUNFURY na rodada ${currentRound}`);
    }

    function handleResult(win) {
        if (win) {
            if (decreaseOnWin) {
                currentBetAmount = initialBetAmount;
            }
        } else {
            if (doubleOnLoss) {
                currentBetAmount *= 2;
            }
        }

        currentRound++;

        // Verificar se devemos continuar a apostar
        if ((maxRounds === 0 || currentRound < maxRounds) && 
            (stopOnProfit === 0 || currentBetAmount < stopOnProfit) && 
            (stopOnLoss === 0 || currentBetAmount < stopOnLoss)) {
            setTimeout(placeBet, 1000); // Aguarde 1 segundo antes de fazer a próxima aposta
        } else {
            console.log("Encerrando a automação.");
        }
    }

    // Adicione um ouvinte de eventos para detectar o resultado da aposta
    document.querySelector('.game__history').addEventListener('DOMNodeInserted', function(event) {
        if (event.target.classList.contains('game__history__item')) {
            const win = event.target.querySelector('.game__history__result').textContent.includes('Win');
            handleResult(win);
        }
    });

    // Inicie o processo de apostas
    placeBet();
})();
