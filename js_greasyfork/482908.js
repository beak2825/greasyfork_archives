// ==UserScript==
// @name         Lucky Dice Refill and Bet
// @namespace    LubuRomanov
// @version      0.1
// @description  Go To The Mooon Baby
// @match        https://luckydice.com/en/app/bonuses
// @match        https://luckydice.com/pt/app/bonuses
// @match        https://luckydice.com/en/app/casino/default
// @match        https://luckydice.com/pt/app/casino/default
// @match        https://*.luckydice.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482908/Lucky%20Dice%20Refill%20and%20Bet.user.js
// @updateURL https://update.greasyfork.org/scripts/482908/Lucky%20Dice%20Refill%20and%20Bet.meta.js
// ==/UserScript==

   (function() {
    'use strict';

    let botaoClicado = false;
    let elementoErro;



            botaoClicado = true;

    async function iniciarAutomacao() {
        window.onload = function() {
            const esperaInicial = Math.random() * (2000 - 1000) + 1000;
            setTimeout(function() {
                botaoClicado = true;

                const elementosSpan = document.querySelectorAll('span.sc-eqUAAy.dZuBcV');
                let elementoSpan;
                for (const elemento of elementosSpan) {
                    if (elemento.textContent === "Faucet grátis") {
                        elementoSpan = elemento;
                        break;
                    }
                }

                if (elementoSpan) {
                    const eventoClique = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    elementoSpan.dispatchEvent(eventoClique);
                    setTimeout(function() {
                    }, );

                    const intervaloEspera = Math.random() * (6000 - 4800) + 4800;
                    setTimeout(() => {
                    }, intervaloEspera);
                }
            }, esperaInicial);
        };
    }

    try {
        iniciarAutomacao();
    } catch (erro) {
        console.error('Um erro ocorreu:', erro);
    }
})();

(function() {
    'use strict';

    // Função para clicar no botão de recarga da torneira
    function clicarBotaoRecargaTorneira() {
        const botaoRecargaTorneira = document.querySelector('button.sc-imWYAI.sc-ibQAlb.kjbZxE.bbTZxp'); // Seleciona o botão usando sua classe
        if (botaoRecargaTorneira) {
            botaoRecargaTorneira.click();
        }
    }

    // Função para clicar no botão em um intervalo aleatório entre os milissegundos mínimo e máximo
    function intervaloClique(min, max) {
        const intervalo = Math.random() * (max - min) + min;
        setTimeout(function() {
            clicarBotaoRecargaTorneira();
            intervaloClique(min, max);
        }, intervalo);
    }

    // Clique inicial
    clicarBotaoRecargaTorneira();

    // Iniciar cliques em um intervalo aleatório entre 1 e 3 minutos (60000 a 180.000 milissegundos)
    intervaloClique(60000, 180000);
})();