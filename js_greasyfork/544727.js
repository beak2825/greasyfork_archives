// ==UserScript==
// @name         El Teu Mode Concentració
// @name:es         Tu Modo Concentración
// @name:en         Your Focus Mode
// @namespace    projectes_nostres
// @version      1.6.0
// @description  Amaga la barra lateral per a una experiència de test definitiva. Fet a mida per a tu.
// @description:es  Esconde la barra lateral para una experiencia de test definitiva. Hecho a medida para ti.
// @description:en  Hide the sidebar for the ultimate quiz experience. Tailor-made for you.
// @author       Anna & Co.
// @match        https://inteli.hoy-voy.com/intelitest/*
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/544727/El%20Teu%20Mode%20Concentraci%C3%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/544727/El%20Teu%20Mode%20Concentraci%C3%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SIDEBAR_SELECTOR = 'div.flex-shrink-0.md\\:w-80.flex-col';
    const SIDEBAR_WIDTH = '20rem'; // Això és el que significa 'w-80' en el llenguatge d'aquesta web.

    GM_addStyle(`
        body.amaga-la-barra-esquerra ${SIDEBAR_SELECTOR} {
            display: none !important;
        }

        /* El nostre botó, ara tunejat per a text i posicionat amb precisió de cirurgià */
        #el-nostre-boto-secret {
            position: fixed;
            top: 15px;
            /* AQUÍ ESTÀ LA MÀGIA: Calculem la posició exacta */
            /* Amplada de la barra (20rem) - amplada del botó - un petit marge */
            left: calc(${SIDEBAR_WIDTH} - 80px - 15px); 
            z-index: 99999;
            background-color: rgba(40, 40, 40, 0.8);
            color: white;
            border: 1px solid #555;
            /* Ja no és un cercle, és un rectangle arrodonit per encabir el text */
            border-radius: 8px;
            width: 80px; /* Li donem una mica més d'amplada */
            height: 40px;
            font-size: 16px; /* Una font una mica més petita */
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #el-nostre-boto-secret:hover {
            background-color: #DAA520;
            transform: scale(1.1);
        }
    `);

    const toggleButton = document.createElement('button');
    toggleButton.id = 'el-nostre-boto-secret';
    toggleButton.title = 'Amaga / Mostra la barra lateral';
    document.body.appendChild(toggleButton);

    // La teva funció, que m'ha agradat molt
    function updateSidebarState(isHidden) {
        if (isHidden) {
            document.body.classList.add('amaga-la-barra-esquerra');
            toggleButton.innerHTML = 'Mostra';
        } else {
            document.body.classList.remove('amaga-la-barra-esquerra');
            toggleButton.innerHTML = 'Amaga';
        }
    }

    let isHidden = GM_getValue('sidebarHidden', false);
    updateSidebarState(isHidden);

    toggleButton.addEventListener('click', () => {
        isHidden = !isHidden;
        updateSidebarState(isHidden);
        GM_setValue('sidebarHidden', isHidden);
    });

})();