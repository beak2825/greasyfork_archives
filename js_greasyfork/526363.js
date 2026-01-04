// ==UserScript==
// @name         YouTube Ultimate Enhancer
// @namespace    YouTube Ultimate Enhancer
// @version      1.3
// @description  Melhora a pesquisa, layout e funcionalidades do YouTube.
// @author       You
// @match        *://www.youtube.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526363/YouTube%20Ultimate%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/526363/YouTube%20Ultimate%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para criar botões de controle
    const createToggleButton = (id, label, defaultVisible) => {
        const button = document.createElement('button');
        button.id = id;
        button.textContent = label;
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '1000';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = '#ff0000';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        document.body.appendChild(button);

        const targetElement = document.querySelector(id === 'toggle-sidebar' ? '#secondary' : 'ytd-comments');
        if (targetElement) {
            targetElement.style.display = defaultVisible ? 'block' : 'none';
        }

        button.addEventListener('click', () => {
            if (targetElement) {
                const isVisible = targetElement.style.display === 'block';
                targetElement.style.display = isVisible ? 'none' : 'block';
                button.textContent = isVisible ? `Mostrar ${label}` : `Esconder ${label}`;
            }
        });
    };

    // Forçar pesquisa limpa e adicionar filtros
    const forceCleanSearch = () => {
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.has('search_query')) {
            searchParams.delete('sp');
            searchParams.set('sp', 'EgIQAQ%3D%3D'); // Resultados exatos
            searchParams.set('sp', 'EgIIAQ%3D%3D'); // Vídeos curtos
            const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
            window.history.replaceState(null, null, newUrl);
        }
    };

    // Layout melhorado
    const improvedLayout = () => {
        GM_addStyle(`
            /* Layout principal */
            #primary.ytd-page-manager {
                max-width: 1400px !important;
                margin: 0 auto !important;
                padding: 20px !important;
            }

            /* Grade de vídeos melhorada */
            ytd-rich-grid-row {
                display: grid !important;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)) !important;
                gap: 20px !important;
                padding: 15px 0 !important;
            }

            /* Pesquisa aprimorada */
            ytd-searchbox {
                max-width: 800px !important;
                margin: 0 auto !important;
            }

            /* Remover elementos desnecessários */
            ytd-banner-promo-renderer,
            ytd-rich-shelf-renderer,
            #masthead-container,
            #container.ytd-masthead {
                display: none !important;
            }

            /* Miniaturas maiores */
            ytd-thumbnail {
                width: 100% !important;
                height: 180px !important;
                border-radius: 12px !important;
                transition: transform 0.2s ease !important;
            }
            ytd-thumbnail:hover {
                transform: scale(1.05) !important;
            }

            /* Tipografia melhorada */
            #video-title {
                font-size: 1.6rem !important;
                color: #333 !important;
                font-family: 'Arial', sans-serif !important;
            }
            yt-formatted-string.ytd-video-renderer {
                color: #666 !important;
            }

            /* Player de vídeo */
            video.html5-main-video {
                width: 100% !important;
                height: auto !important;
            }
            .ytp-chrome-top {
                display: none !important;
            }

            /* Botões com bordas 3D realçadas */
            .ytp-button {
                background-color: #ff0000 !important;
                border-radius: 50% !important;
                border: 2px solid #fff !important;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2) !important;
            }

            /* Responsividade */
            @media (max-width: 768px) {
                ytd-rich-grid-row {
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)) !important;
                }
                #primary.ytd-page-manager {
                    padding: 10px !important;
                }
            }

            /* Remover anúncios */
            ytd-promoted-sparkles-web-renderer,
            ytd-promoted-video-renderer {
                display: none !important;
            }
        `);
    };

    // Função para inicializar o script
    const initializeScript = () => {
        forceCleanSearch();
        improvedLayout();
        createToggleButton('toggle-sidebar', 'Esconder Barra Lateral', false);
        createToggleButton('toggle-comments', 'Esconder Comentários', false);
    };

    // Executar inicialmente
    initializeScript();

    // Observar mudanças dinâmicas
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                initializeScript();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Usar window.navigation API para detectar mudanças de rota
    if (window.navigation) {
        window.navigation.addEventListener('navigate', (event) => {
            initializeScript();
        });
    }
})();