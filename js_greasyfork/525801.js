// ==UserScript==
// @name         YouTube Layout Enhancer & Search Focus
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Melhora o layout do YouTube, organiza conteúdo e filtra resultados de pesquisa
// @author       EmersonxD
// @match        *://*.youtube.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/525801/YouTube%20Layout%20Enhancer%20%20Search%20Focus.user.js
// @updateURL https://update.greasyfork.org/scripts/525801/YouTube%20Layout%20Enhancer%20%20Search%20Focus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Estilos CSS personalizados
    GM_addStyle(`
        /* Layout Geral */
        #page-manager {
            max-width: 1400px !important;
            margin: 0 auto !important;
            padding: 20px !important;
        }

        /* Grade de Vídeos */
        ytd-rich-grid-row {
            justify-content: center !important;
            gap: 20px !important;
            margin: 30px 0 !important;
        }

        ytd-rich-item-renderer {
            width: 300px !important;
            margin: 10px !important;
            border-radius: 8px !important;
            transition: transform 0.2s !important;
        }

        ytd-rich-item-renderer:hover {
            transform: translateY(-5px) !important;
        }

        /* Barra de Pesquisa */
        #search-container {
            max-width: 800px !important;
            margin: 0 auto !important;
        }

        /* Filtro de Conteúdo */
        .secondary-content {
            display: none !important;
        }

        /* Paginação */
        #pagination-container {
            display: flex !important;
            justify-content: center !important;
            margin: 40px 0 !important;
            gap: 15px !important;
        }

        .pagination-btn {
            padding: 8px 16px !important;
            border-radius: 4px !important;
            background: #f0f0f0 !important;
            cursor: pointer !important;
        }
    `);

    // Filtro de Pesquisa Aprimorado
    const applySearchFilter = () => {
        const searchQuery = new URLSearchParams(window.location.search).get('search_query')?.toLowerCase();
        if (!searchQuery) return;

        document.querySelectorAll('ytd-video-renderer, ytd-rich-item-renderer').forEach(video => {
            const title = video.querySelector('#video-title')?.textContent.toLowerCase();
            const match = title?.includes(searchQuery);
            video.style.display = match ? 'block' : 'none';
        });
    };

    // Sistema de Paginação
    const createPagination = () => {
        const container = document.createElement('div');
        container.id = 'pagination-container';
        
        ['Anterior', '1', '2', '3', 'Próximo'].forEach(text => {
            const btn = document.createElement('button');
            btn.className = 'pagination-btn';
            btn.textContent = text;
            container.appendChild(btn);
        });

        const mainContent = document.querySelector('ytd-app');
        if (mainContent) mainContent.appendChild(container);
    };

    // Observador de Mudanças Dinâmicas
    const observer = new MutationObserver(mutations => {
        if (window.location.pathname === '/results') {
            applySearchFilter();
            createPagination();
        }
    });

    // Inicialização
    window.addEventListener('load', () => {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        if (window.location.pathname === '/results') {
            applySearchFilter();
            createPagination();
        }
    });

    // Hotkey para Recarregar Filtros (Ctrl + Shift + F)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'F') {
            applySearchFilter();
        }
    });
})();