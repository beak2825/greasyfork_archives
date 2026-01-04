// ==UserScript==
// @name         Modo Foco Balta.io
// @version      1.2
// @description  Ativa o Modo Foco na página de player do Balta.io, ocultando a barra lateral, alerta, navbar e outros elementos.
// @author       Italo Guerra Pinheiro
// @match        https://balta.io/player/assistir/*
// @icon         https://baltaio.blob.core.windows.net/static/images/dark/balta-logo.svg
// @supportURL   https://github.com/Italoguerrapii
// @license MIT
// @namespace https://greasyfork.org/users/1403346
// @downloadURL https://update.greasyfork.org/scripts/519080/Modo%20Foco%20Baltaio.user.js
// @updateURL https://update.greasyfork.org/scripts/519080/Modo%20Foco%20Baltaio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // @region Seleção dos elementos HTML
    const sidebar = document.querySelector('.uk-width-1-4\\@s');
    const alertBox = document.querySelector('.uk-alert-primary.announcement.uk-alert');
    const navbar = document.querySelector('.uk-navbar-container.uk-margin-top.uk-margin-large-bottom.uk-navbar');
    const rightSide = document.querySelector('.uk-width-1-2.uk-text-right');
    // @endregion

    // @region Criação e estilo do botão
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Modo Foco Desativado';

    Object.assign(toggleButton.style, {
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        zIndex: '1000',
        backgroundColor: '#8726d2',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s'
    });
    // @endregion

    // @region Efeitos de hover no botão
    toggleButton.addEventListener('mouseover', () => {
        toggleButton.style.transform = 'scale(1.05)';
        toggleButton.style.boxShadow = '0px 6px 8px rgba(0, 0, 0, 0.2)';
    });

    toggleButton.addEventListener('mouseout', () => {
        toggleButton.style.transform = 'scale(1)';
        toggleButton.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
    });
    // @endregion

    // @region Adiciona o botão à página
    document.body.appendChild(toggleButton);
    // @endregion

    // @region Funcionalidade do botão (Alternar Modo Foco)
    toggleButton.addEventListener('click', () => {
        const isSidebarVisible = sidebar && sidebar.style.display !== 'none';

        if (sidebar) sidebar.style.display = isSidebarVisible ? 'none' : 'block';
        if (alertBox) alertBox.style.display = isSidebarVisible ? 'none' : 'block';
        if (navbar) navbar.style.display = isSidebarVisible ? 'none' : 'block';
        if (rightSide) rightSide.style.display = isSidebarVisible ? 'none' : 'block';

        toggleButton.textContent = isSidebarVisible ? 'Modo Foco Ativo' : 'Modo Foco Desativado';
    });
    // @endregion

})();
