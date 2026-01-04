// ==UserScript==
// @name         Extract Wireframe Data
// @namespace    tampermonkey.org
// @version      1.1
// @description  Extracts wireframe data from Example Domain website
// @match        https://poe.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480215/Extract%20Wireframe%20Data.user.js
// @updateURL https://update.greasyfork.org/scripts/480215/Extract%20Wireframe%20Data.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract wireframe data
    function extractWireframe() {
        // Create a basic wireframe structure
        var wireframe = {
            'estrutura': [],
            'layout': [],
            'espacamento_alinhamento': [],
            'navegacao': [],
            'hierarquia_visual': [],
            'grade_alinhamento': [],
            'anotacoes_descricoes': [],
            'fluxo_navegacao_interacao': []
        };

        // Extract the structure of the page
        wireframe['estrutura'] = document.querySelectorAll('*');

        // Extract the layout of content
        wireframe['layout'] = document.querySelectorAll('*');

        // Extract the spacing and alignment
        wireframe['espacamento_alinhamento'] = document.querySelectorAll('*');

        // Extract the navigation
        wireframe['navegacao'] = document.querySelectorAll('*');

        // Extract the visual hierarchy
        wireframe['hierarquia_visual'] = document.querySelectorAll('*');

        // Extract the grid and alignment
        wireframe['grade_alinhamento'] = document.querySelectorAll('*');

        // Extract the annotations and descriptions
        wireframe['anotacoes_descricoes'] = document.querySelectorAll('*');

        // Extract the navigation and interaction flow
        wireframe['fluxo_navegacao_interacao'] = document.querySelectorAll('*');

        console.log(wireframe); // Output the wireframe data to the console
    }

    // Call the extractWireframe function when the page finishes loading
    window.addEventListener('load', extractWireframe);
})();