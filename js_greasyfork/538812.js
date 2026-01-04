// ==UserScript==
// @name         Passei Direto - Bypass
// @version      1.0
// @description  Custom modifications to Passei Direto for enhanced viewing.
// @author       Rocymar Júnior
// @license      MIT
// @match        *://*.passeidireto.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=passeidireto.com
// @grant        GM_addStyle
// @grant        GM.addStyle
// @run-at       document-start
// @namespace https://greasyfork.org/users/1464973
// @downloadURL https://update.greasyfork.org/scripts/538812/Passei%20Direto%20-%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/538812/Passei%20Direto%20-%20Bypass.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Função para adicionar estilos (compatível com diferentes gerenciadores de userscript)
    const addGlobalStyle = (css) => {
        try {
            if (typeof GM_addStyle !== "undefined") {
                GM_addStyle(css);
            } else if (typeof GM !== "undefined" && typeof GM.addStyle !== "undefined") {
                GM.addStyle(css);
            } else {
                let head = document.getElementsByTagName('head')[0];
                if (!head) {
                    // Adicionar head se não existir (caso raro em document-start muito cedo)
                    head = document.createElement('head');
                    document.documentElement.insertBefore(head, document.body);
                 }
                let style = document.createElement('style');
                style.type = 'text/css';
                style.id = 'pd-custom-bypass-styles'; // Adicionar um ID para fácil identificação/remoção
                style.innerHTML = css;
                head.appendChild(style);
            }
            // console.log("Passei Direto Custom Bypass: Estilos CSS injetados.");
        } catch (e) {
            console.error("Passei Direto Custom Bypass: Erro ao injetar CSS global:", e);
        }
    };

    // CSS principal para correções visuais
    const bypassCSS = `
        /* --- Remover Overlays e Paywalls --- */
        div[data-v-06c00051], /* Overlay principal de arquivo identificado */
        .mv-content-limitation-fake-page, /* Container do overlay de arquivo */
        div[class*="ModalPaywall"],
        div[class*="ViewContent_paywall"],
        div[class*="card-paywall"], /* Paywall em páginas de pergunta */
        div[class*="BannerSuspenso"],
        [class*="BannerSelector_banner-container"],
        [id^="promote-app"], /* Promover app */
        [class*="GoogleSignIn"], /* Botões de login do Google sobrepondo conteúdo */
        [class*="pd-tooltip-coachmark"] /* Tooltips de "novidade" */
         {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            width: 0 !important; /* Para elementos que podem ocupar espaço mesmo com display: none */
            height: 0 !important;
            position: absolute !important; /* Tira do fluxo normal */
            left: -9999px !important; /* Move para fora da tela */
            pointer-events: none !important;
        }

        /* --- Remover Blur --- */
        .page-content,
        .page-content *, /* Inclui imagens de fundo dentro das páginas, ex: img.bi */
        [data-testid="answer-card"] [class*="AnswerCard_answer-content-container"] *,
        [style*='filter: blur'] {
            filter: none !important;
            -webkit-filter: none !important;
        }

        /* --- Remover Hachuras/Padrões de Fundo em Overlays (Especulativo) --- */
        body::before, body::after,
        #file-viewer::before, #file-viewer::after,
        .document-viewer::before, .document-viewer::after,
        .page-container::before, .page-container::after,
        .page-content::before, .page-content::after {
            background-image: none !important;
            background: none !important;
        }

        /* --- Garantir Scroll e Visibilidade Global --- */
        body, html {
            overflow: auto !important;
            position: static !important;
        }

        /* --- Ajustes para Containers de Página (Preservar Layout de Paginação) --- */
        .document-fragment {
            /* Normalmente não precisa de intervenção direta, a menos que cause overflow:hidden */
        }

        .page-container,
        [id^='pf'],
        [class*="PageContainer"] {
            /* Altura deve ser controlada pelo site para paginação correta */
            /* height: auto !important; // NÃO USAR, quebra a paginação */
            min-height: initial !important; /* Resetar min-height problemático */
            max-height: none !important;   /* Permitir que o conteúdo expanda se necessário */
            overflow: visible !important; /* Mostrar todo o conteúdo da página */
            position: relative !important; /* Ajuda a conter elementos internos posicionados absolutamente */
            margin-bottom: 10px !important; /* Adiciona um pequeno espaço entre as páginas visuais, se necessário */
        }

        .page-content {
            /* Estilos de layout (width, height, transform, top, left) são gerenciados pelo site */
            opacity: 1 !important;
            visibility: visible !important;
            position: relative !important; /* Pode ajudar no posicionamento de conteúdo interno */
        }

        /* Garantir que o texto e imagens dentro do conteúdo da página sejam visíveis */
        .page-content *,
        [data-testid="answer-card"] [class*="AnswerCard_answer-content-container"],
        [data-testid="answer-card"] [class*="AnswerCard_answer-content-container"] * {
            opacity: 1 !important;
            visibility: visible !important;
        }
    `;

    // Injetar o CSS o mais cedo possível
    addGlobalStyle(bypassCSS);

    function importMathJaxLib() {
        if (document.querySelector("script[src*='MathJax.js']")) return;
        try {
            const MathJaxScript = document.createElement("script");
            MathJaxScript.type = "text/javascript";
            MathJaxScript.src = "https://cdn.jsdelivr.net/npm/mathjax@2/MathJax.js?config=TeX-AMS_CHTML";
            (document.head || document.documentElement).appendChild(MathJaxScript);
            console.log("Passei Direto Custom Bypass: MathJax importado.");
        } catch (e) {
            console.error("Passei Direto Custom Bypass: Erro ao importar MathJax:", e);
        }
    }

    function runDelayedFixes() {
        const path = window.location.pathname;

        try {
            // Remover overlays explicitamente (complementar ao CSS)
            document.querySelectorAll(
                "div[data-v-06c00051], .mv-content-limitation-fake-page, [class*='BannerSelector_banner-container']"
            ).forEach(el => {
                if (el && el.parentElement) el.parentElement.removeChild(el);
            });

            if (path.includes("/pergunta/")) {
                if (document.querySelector(".math-tex, mjx-container")) {
                    importMathJaxLib();
                }
            } else if (path.includes("/arquivo/") || path.includes("/conteudo/") || path.includes("/material/")) {
                document.body.style.overflow = 'auto'; // Redundante com CSS, mas não custa
                document.documentElement.style.overflow = 'auto';
                if (document.querySelector(".math-tex, mjx-container")) {
                    importMathJaxLib();
                }
            }
        } catch (e) {
            console.error("Passei Direto Custom Bypass: Erro nas correções JS atrasadas:", e);
        }
    }

    // Usar MutationObserver para garantir que as correções persistam
    let observerDebounceTimeout = null;
    const debouncedReapply = () => {
        clearTimeout(observerDebounceTimeout);
        observerDebounceTimeout = setTimeout(() => {
            // console.log("Passei Direto Custom Bypass: MutationObserver detectou mudança, re-aplicando.");
            addGlobalStyle(bypassCSS); // Re-injeta o CSS para garantir
            runDelayedFixes();    // Roda correções JS caso algo tenha sido recriado
        }, 350); // Debounce para evitar execuções excessivas
    };

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            let needsReapply = false;
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Verificar se um overlay conhecido foi adicionado
                        if (node.matches && (
                            node.matches("div[data-v-06c00051], .mv-content-limitation-fake-page, [class*='ModalPaywall'], [class*='card-paywall']") ||
                            node.querySelector("div[data-v-06c00051], .mv-content-limitation-fake-page, [class*='ModalPaywall'], [class*='card-paywall']")
                        )) {
                            // console.log("Passei Direto Custom Bypass: Overlay re-adicionado detectado:", node);
                            needsReapply = true;
                            break;
                        }
                    }
                }
            } else if (mutation.type === 'attributes' && (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
                const target = mutation.target;
                if (target && target.style && target.style.filter && target.style.filter.includes('blur') && target.style.filter !== 'none') {
                    // console.log("Passei Direto Custom Bypass: Blur re-aplicado detectado:", target);
                    needsReapply = true;
                }
            }
            if (needsReapply) {
                debouncedReapply();
                return; // Sair após detectar uma mudança relevante
            }
        }
    });

    // Iniciar lógica do script após o DOM estar pronto ou quase pronto
    const initializeBypass = () => {
        // console.log("Passei Direto Custom Bypass: Inicializando.");
        runDelayedFixes();
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style', 'class'] // Observar apenas mudanças de estilo e classe
            });
        } else {
            // Se o body ainda não estiver pronto, tentar novamente em breve
            // Isso é um fallback, @run-at document-start e DOMContentLoaded devem cobrir
            setTimeout(initializeBypass, 100);
        }
    };

    if (window.document.readyState === "loading") {
        window.document.addEventListener("DOMContentLoaded", initializeBypass);
    } else {
        initializeBypass();
    }

})();