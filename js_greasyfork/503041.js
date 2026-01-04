// ==UserScript==
// @name         Bet365
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Altera estilos, oculta elementos e ajusta fontes em páginas do Bet365
// @match        https://www.bet365.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503041/Bet365.user.js
// @updateURL https://update.greasyfork.org/scripts/503041/Bet365.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para aplicar as alterações de estilo e ocultar elementos
    function ajustarEstilosEOcultar() {
        // Ajusta os estilos dos elementos
        const pitchContainers = document.querySelectorAll('.ml1-MatchLiveSoccerModule_PitchContainer');
        pitchContainers.forEach(element => {
            // Aplica o estilo desejado
            element.style.setProperty('--ml1-scale', '0.78');

            // Remove as propriedades indesejadas
            element.style.removeProperty('--ml1-sceneXTranslate');
            element.style.removeProperty('--ml1-sceneYTranslate');
            element.style.removeProperty('--ml1-sceneZAdjustment');
            element.style.removeProperty('--ml1-sceneXAdjustment');
        });

        // Define as novas propriedades no :root
        const root = document.documentElement;
        root.style.setProperty('--ml1-sceneXRotation', 'calc(55deg + var(--ml1-sceneXAdjustment))');
        root.style.setProperty('--ml1-sceneYTranslate', '-30px');
        root.style.setProperty('--ml1-animationOutlineText1', 'hsla(0,0%,100%,1)');
        root.style.setProperty('--ml1-animationOutlineText2', 'hsla(0,0%,100%,1)');
        root.style.setProperty('--ml1-animation-duration', '1s');

        // Oculta os elementos específicos
        const elementosParaOcultar = [
            '.ml1-AdBoardsSection_LeftBoard',
            '.ml1-AdBoardsSection_CentreBoard',
            '.ml1-AdBoardsSection_TopLeftBoard',
            '.ml1-AdBoardsSection_TopRightBoard',
            '.ml1-AdBoardsSection_RightBoard',
            '.ml1-Stadium'
        ];

        elementosParaOcultar.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.style.display = 'none';
            });
        });

        // Aplica os estilos para o texto do relógio e outros elementos
        const adicionarEstilosTexto = () => {
            const style = document.createElement('style');
            style.textContent = `
                .ml1-SoccerClock_AdditionalText,
                .ml1-SoccerClock_Timer {
                    font-size: 15px;
                    line-height: 15px;
                    color: #ffffff;
                    background-color: rgb(0 0 0);
                }
                .ml1-SoccerClock_InjuryTime {
                    font-size: 15px;
                    line-height: 15px;
                    color: #ffffff;
                }
            `;
            document.head.appendChild(style);
        };

        adicionarEstilosTexto();
    }

    // Executa a função quando a página carregar
    window.addEventListener('load', ajustarEstilosEOcultar);

    // Caso a página seja dinâmica e o conteúdo possa mudar, você pode monitorar e aplicar as mudanças repetidamente
    const observer = new MutationObserver(ajustarEstilosEOcultar);
    observer.observe(document.body, { childList: true, subtree: true });

})();
