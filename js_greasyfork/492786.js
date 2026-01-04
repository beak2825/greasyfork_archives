// ==UserScript==
// @name         Cartola
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  This script shows an approximate "minimum to value" value on the cartola website
// @author       HenriqueM
// @match        https://cartola.globo.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=globo.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492786/Cartola.user.js
// @updateURL https://update.greasyfork.org/scripts/492786/Cartola.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function mostrarMinimo() {
        // Seleciona todos os elementos que possuem o atributo "card-atleta"
        const elementos = document.querySelectorAll('[card-atleta]');

        // Obtém o objeto "jogadores" armazenado na LocalStorage
        const jogadoresLocalStorage = localStorage.getItem('jogadores');
        let jogadores = {};

        // Verifica se há algum objeto armazenado
        if (jogadoresLocalStorage) {
            jogadores = JSON.parse(jogadoresLocalStorage);
        }

        // Itera sobre os elementos encontrados
        elementos.forEach(elemento => {
            // Busca a div com a classe "cartola-atletas__card" dentro do elemento atual
            const divCartola = elemento.querySelector('.cartola-atletas__card');
            
            // Verifica se a div foi encontrada
            if (divCartola) {
                // Busca o elemento <estrela-atleta-favorito> dentro da div
                const estrelaAtleta = divCartola.querySelector('estrela-atleta-favorito');
                
                // Verifica se o elemento foi encontrado e se possui o atributo "atletaid"
                if (estrelaAtleta && estrelaAtleta.hasAttribute('atletaid')) {
                    // Obtém o valor do atributo "atletaid"
                    const atletaId = estrelaAtleta.getAttribute('atletaid');
                    
                    // Verifica se há um jogador correspondente na LocalStorage
                    if (jogadores[atletaId] && jogadores[atletaId].pm) {
                        // Busca a div com a classe "small-collapse" dentro do elemento atual
                        const divSmallCollapse = divCartola.querySelector('.small-collapse');
                        
                        // Verifica se a div foi encontrada
                        if (divSmallCollapse) {
                            // Busca a div com a classe "cartola-atletas__scout--minval" dentro da div "small-collapse"
                            const divScoutMinval = divSmallCollapse.querySelector('.cartola-atletas__scout--minval');
                            
                            // Verifica se a div foi encontrada
                            if (divScoutMinval) {
                                // Substitui o conteúdo da div pelo valor de "pm"
                                divScoutMinval.textContent = jogadores[atletaId].pm;
                            }
                        }
                    }
                }
            }
        });
    }

    // Realiza a chamada AJAX para a URL fornecida
    fetch('https://pb89hpsof3.execute-api.us-east-1.amazonaws.com/prod/escalar/rodadas_anteriores/10')
    .then(response => {
        // Verifica se a resposta da requisição foi bem-sucedida (status code 200)
        if (response.ok) {
            // Converte a resposta para JSON
            return response.json();
        }
        // Se a resposta não for bem-sucedida, lança um erro
        throw new Error('Erro ao carregar os dados');
    })
    .then(data => {
        // Verifica se a propriedade "jogadores" está presente no objeto retornado
        if (data && data.jogadores) {
            // Armazena o objeto "jogadores" na LocalStorage
            localStorage.setItem('jogadores', JSON.stringify(data.jogadores));
            console.log('Objeto "jogadores" armazenado na LocalStorage.');

                // ---------

                new MutationObserver(() => {
                    mostrarMinimo();
                    console.log("callback that runs when observer is triggered");
                }).observe(document.querySelector(".cartola-atletas__listagem"), {
                    subtree: true,
                    childList: true,
                });
        } else {
            console.log('Objeto "jogadores" não encontrado na resposta.');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });


})();