// ==UserScript==
// @name         Brainscape - Enchancer
// @version      2.2
// @description  Bloqueia CTAs de subscrição, remove o blur e esconde a janela de classificação dos flashcards no Brainscape.
// @author       Rocymar Júnior & Gemini
// @match        https://www.brainscape.com/flashcards/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=brainscape.com
// @grant        GM_addStyle
// @run-at       document-idle
// @namespace https://greasyfork.org/users/1464973
// @downloadURL https://update.greasyfork.org/scripts/538813/Brainscape%20-%20Enchancer.user.js
// @updateURL https://update.greasyfork.org/scripts/538813/Brainscape%20-%20Enchancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("[Brainscape Custom Script] Iniciado.");

    // Injeta todas as regras de CSS de uma vez para esconder elementos indesejados.
    // Esta é a forma mais eficiente de bloquear elementos visuais.
    GM_addStyle(`
        /* 1. Esconde o botão de subscrição específico que aparece com o blur */
        a.subscribe-link.rect-button.primary-cta.tertiary.blurred-answer-study-cta {
            display: none !important;
            visibility: hidden !important;
        }

        /* 2. Esconde a janela de classificação de confiança (1-5) que aparece após revelar a resposta */
        .confidence-scale {
            display: none !important;
        }
    `);
    // console.log("[Brainscape Custom Script] CSS para esconder elementos indesejados injetado.");

    // Função para realizar modificações que o CSS não pode fazer (como remover classes).
    function applyModifications() {
        let modifiedSomething = false;

        // 3. Remover a classe 'is-blurrable' dos flashcards para prevenir o efeito de blur
        const flashcards = document.querySelectorAll('.flashcard-row.thin-card.is-blurrable.is-hydrated');
        let unblurredCount = 0;
        flashcards.forEach(card => {
            if (card.classList.contains('is-blurrable')) {
                card.classList.remove('is-blurrable');
                unblurredCount++;
                modifiedSomething = true;
            }
        });

        if (unblurredCount > 0) {
            // console.log(`[Brainscape Custom Script] ${unblurredCount} flashcards tiveram 'is-blurrable' removido.`);
        }

        // 4. Remover o overlay que pode acompanhar o blur, como uma garantia extra
        const overlays = document.querySelectorAll('.primary-ctas.flashcard-blurred-overlay');
        let overlaysRemovedCount = 0;
        overlays.forEach(el => {
            el.remove();
            overlaysRemovedCount++;
            modifiedSomething = true;
        });

        if (overlaysRemovedCount > 0) {
            // console.log(`[Brainscape Custom Script] ${overlaysRemovedCount} overlays '.primary-ctas.flashcard-blurred-overlay' removidos.`);
        }

        // if (modifiedSomething) {
        //     console.log("[Brainscape Custom Script] Modificações dinâmicas aplicadas.");
        // }
    }

    // Executa as modificações quando o DOM estiver pronto e em mudanças
    applyModifications();

    // Observe o corpo do documento para elementos adicionados dinamicamente (novos flashcards)
    const observer = new MutationObserver((mutationsList) => {
        // Apenas re-aplicamos as modificações de classe, pois o CSS injetado
        // pelo GM_addStyle já se aplica automaticamente a novos elementos.
        applyModifications();
    });

    // Configurações do observer: observar adições de nós filhos em todo o corpo do documento.
    observer.observe(document.body, { childList: true, subtree: true });

    // Um fallback adicional para garantir a execução
    if (document.readyState === "interactive" || document.readyState === "complete") {
        applyModifications();
    } else {
        window.addEventListener('DOMContentLoaded', applyModifications, { once: true });
    }

})();