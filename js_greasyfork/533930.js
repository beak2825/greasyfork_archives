// ==UserScript==
// @name         Globo.com - Anti-Adblock Bypass
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Tenta esconder o banner anti-adblock (Google Funding Choices) do globo.com e restaurar scroll.
// @author       Seu Nome Aqui
// @match        *://*.globo.com/*
// @match        *://globo.com/*
// @grant        GM_addStyle
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/533930/Globocom%20-%20Anti-Adblock%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/533930/Globocom%20-%20Anti-Adblock%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Tentando bloquear anti-adblock Globo (Funding Choices)...');

    // --- Seletores específicos para o Google Funding Choices encontrados ---
    const selectorsToHide = [
        '.fc-ab-root',          // Contêiner principal do Funding Choices
        '.fc-dialog-overlay',   // Sobreposição que bloqueia a página
        '.fc-ab-dialog',        // A caixa de diálogo em si
        // '.fc-dialog-container' // Descomente se os acima não forem suficientes
    ];

    // --- CSS para esconder os elementos ---
    // Usamos !important para tentar sobrescrever estilos do site.
    let css = selectorsToHide.join(',\n') + ' {\n';
    css += '    display: none !important;\n';
    css += '    visibility: hidden !important;\n';
    css += '    z-index: -9999 !important; \n'; // Tenta jogar para trás
    css += '    position: absolute !important;\n'; // Tira do fluxo normal
    css += '    top: -9999px !important;\n'; // Move para fora da tela
    css += '    left: -9999px !important;\n';
    css += '}\n';

    // --- CSS para garantir que a rolagem da página funcione ---
    // O banner geralmente adiciona 'overflow: hidden' ao body ou html.
    css += 'body, html {\n';
    css += '    overflow: auto !important;\n';
    css += '    height: auto !important;\n'; // Garante altura automática
    // Adiciona remoção de possível classe de bloqueio (comum no Funding Choices)
    // css += '    position: static !important;\n'; // Pode ser necessário em alguns casos
    css += '}\n';

    // Injeta o CSS na página o mais cedo possível
    GM_addStyle(css);
    console.log('CSS anti-adblock (Funding Choices) injetado.');

    // --- Abordagem Adicional: Remover elementos via JS ---
    // Útil se esconder via CSS não for suficiente ou se o site os reativar.
    function removeAnnoyingElements() {
        let removed = false;
        selectorsToHide.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    if (el && typeof el.remove === 'function') {
                        console.log('Removendo elemento:', el);
                        el.remove();
                        removed = true;
                    } else if (el) {
                        // Fallback se .remove() não existir (muito improvável)
                        el.style.display = 'none';
                        el.style.visibility = 'hidden';
                    }
                });
            } catch (e) {
                console.error('Erro ao tentar remover seletor:', selector, e);
            }
        });

        // Tenta reativar o scroll novamente via JS, caso CSS não funcione
        // e remove classes comuns que bloqueiam scroll
        try {
            document.body.style.overflow = 'auto';
            document.documentElement.style.overflow = 'auto';
            document.body.style.position = 'static'; // Tenta resetar posição
            document.documentElement.style.position = 'static';
            // Remove classes comuns de bloqueio (ajuste se necessário)
            document.body.classList.remove('fc-ab-locked');
            document.documentElement.classList.remove('fc-ab-locked');
        } catch (e) {
             console.error('Erro ao tentar reativar scroll/remover classes via JS:', e);
        }

        if (removed) {
            console.log('Elementos anti-adblock removidos via JS.');
        }
        return removed;
    }

    // Tenta remover após um pequeno atraso e depois periodicamente por um tempo
    // (caso o banner apareça depois do carregamento inicial)
    setTimeout(removeAnnoyingElements, 500);  // 0.5 segundos
    setTimeout(removeAnnoyingElements, 1500); // 1.5 segundos
    setTimeout(removeAnnoyingElements, 3000); // 3 segundos

    // Observador de Mutações (alternativa mais avançada e eficiente que setInterval)
    // Observa se os elementos são adicionados ao DOM depois
    const observer = new MutationObserver((mutationsList, observer) => {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                if (removeAnnoyingElements()) {
                    // Se removemos algo, podemos parar de observar por um tempo
                    // ou até mesmo desconectar se o problema for resolvido.
                    // console.log('Elemento detectado e removido pelo MutationObserver.');
                    // observer.disconnect(); // Descomente se quiser parar após a primeira detecção/remoção
                }
            }
        }
    });

    // Inicia a observação no body, procurando por adições de nós filhos
    observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
    console.log('MutationObserver iniciado para detectar adições tardias do banner.');

    // Para o observador após um tempo para não rodar indefinidamente (opcional)
    // setTimeout(() => {
    //     observer.disconnect();
    //     console.log('MutationObserver desconectado.');
    // }, 30000); // Desconecta após 30 segundos

})();
