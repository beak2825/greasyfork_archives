// ==UserScript==
// @name         Simple Dice Refill 
// @namespace    LubuRomanov
// @version      0.5
// @description  Go To The Mooon Baby
// @match        https://simpledice.com/pt/app/bonuses
// @match        https://*.simpledice.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483313/Simple%20Dice%20Refill.user.js
// @updateURL https://update.greasyfork.org/scripts/483313/Simple%20Dice%20Refill.meta.js
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
        const botaoRecargaTorneira = document.querySelector('button.sc-imWYAI.sc-ibQAlb.eHZLZr.bbTZxp'); // Seleciona o botão usando sua classe
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

(function() {
    'use strict';

    // Função para clicar no botão de recarga
    function clicarBotaoRecarga() {
        const botaoRecarga = document.querySelector('button.sc-imWYAI.bmYjPt.btn'); // Seleciona o botão usando sua classe
        if (botaoRecarga) {
            botaoRecarga.click();
        }
    }

    // Função para clicar no botão em um intervalo aleatório entre os milissegundos mínimo e máximo
    function intervaloClique(min, max) {
        const intervalo = Math.random() * (max - min) + min;
        setTimeout(function() {
            clicarBotaoRecarga();
            intervaloClique(min, max);
        }, intervalo);
    }

    // Clique inicial
    clicarBotaoRecarga();

    // Iniciar cliques em um intervalo aleatório entre 1 e 3 segundos (60000 a 180.000 milissegundos)
    intervaloClique(1000,3000);
})();