// ==UserScript==
// @name         OLX filtrador de anúncios
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Filtra anúncios na OLX que não correspondem à pesquisa do usuário.
// @match        https://www.olx.com.br/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502438/OLX%20filtrador%20de%20an%C3%BAncios.user.js
// @updateURL https://update.greasyfork.org/scripts/502438/OLX%20filtrador%20de%20an%C3%BAncios.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    const FILTER_STATE_KEY = 'olxFilterActive';
    let isFilterActive = JSON.parse(localStorage.getItem(FILTER_STATE_KEY) || 'false');
 
    const BUTTON_STYLES = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        padding: 10px 15px;
        font-size: 14px;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        transition: background-color 0.3s;
    `;
 
    function getSearchQuery() {
        return new URLSearchParams(window.location.search).get('q')?.toLowerCase() || '';
    }
 
    function toggleFilter() {
        isFilterActive = !isFilterActive;
        localStorage.setItem(FILTER_STATE_KEY, JSON.stringify(isFilterActive));
        updateButtonState();
        if (isFilterActive) {
            applyFilter();
        } else {
            restoreAds();
        }
    }
 
    function applyFilter() {
        const searchQuery = getSearchQuery();
        if (!searchQuery) return;
 
        const adElements = document.querySelectorAll('section[data-ds-component="DS-AdCard"]');
        let hiddenCount = 0;
 
        adElements.forEach(ad => {
            const linkElement = ad.querySelector('a[data-ds-component="DS-NewAdCard-Link"]');
            if (!linkElement) return;
 
            const titleId = linkElement.getAttribute('aria-labelledby');
            const titleElement = document.getElementById(titleId);
            if (!titleElement) return;
 
            const adTitleText = titleElement.textContent.toLowerCase();
            if (!adTitleText.includes(searchQuery)) {
                ad.style.display = 'none';
                ad.dataset.filtered = 'true';
                hiddenCount++;
            }
        });
 
        console.log(`Filtro aplicado. ${hiddenCount} anúncios ocultados.`);
    }
 
    function restoreAds() {
        const filteredAds = document.querySelectorAll('section[data-ds-component="DS-AdCard"][data-filtered="true"]');
        filteredAds.forEach(ad => {
            ad.style.display = '';
            ad.dataset.filtered = 'false';
        });
        console.log(`Filtro removido. ${filteredAds.length} anúncios restaurados.`);
    }
 
    function updateButtonState() {
        const button = document.getElementById('olxFilterToggle');
        if (button) {
            button.textContent = isFilterActive ? 'Desativar Filtro' : 'Ativar Filtro';
            button.style.backgroundColor = isFilterActive ? '#ff8924' : '#6e0ad6';
        }
    }
 
    function createFilterButton() {
        const button = document.createElement('button');
        button.id = 'olxFilterToggle';
        button.style.cssText = BUTTON_STYLES;
        button.addEventListener('click', toggleFilter);
        button.addEventListener('mouseover', () => button.style.backgroundColor = isFilterActive ? '#ffaa63' : '#8c2bff');
        button.addEventListener('mouseout', () => updateButtonState());
        document.body.appendChild(button);
        updateButtonState();
    }
 
    function init() {
        createFilterButton();
        if (isFilterActive) {
            applyFilter();
        }
 
        // Observa mudanças na URL para replicar o comportamento de SPA
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                if (isFilterActive) {
                    setTimeout(applyFilter, 1000); // Delay para garantir que o novo conteúdo foi carregado
                }
            }
        }).observe(document, {subtree: true, childList: true});
    }
 
    // Inicia o script quando a página estiver totalmente carregada
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();