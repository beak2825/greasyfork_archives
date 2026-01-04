// ==UserScript==
// @name         TYT - Toyota AEM UI Enhancements
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Améliorations de l'interface utilisateur pour l'éditeur AEM Toyota: ajustement des styles et de la mise en page.
// @author       You
// @match        https://aem-author-prod.toyota.eu/*
// @match        https://*.toyota.be/*
// @match        https://*.toyota.lu/*
// @match        https://*.toyota.de/*
// @match        https://*.toyota.nl/*
// @match        https://*.toyota.fr/*
// @match        https://*.lexus.be/*
// @match        https://*.lexus.eu/*
// @match        https://*.lexus.de/*
// @match        https://*.lexus.lu/*
// @match        https://*.lexus.fr/*
// @match        https://*.lexus.nl/*
// @match        https://*.lexus.be/*
// @match        https://be-nl.dxp-prod-preview.toyota.eu/*
// @match        https://be-fr.dxp-prod-preview.toyota.eu/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=toyota.eu
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508688/TYT%20-%20Toyota%20AEM%20UI%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/508688/TYT%20-%20Toyota%20AEM%20UI%20Enhancements.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Créer un élément de style pour injecter du CSS personnalisé
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
    /* Suppression de la limite de hauteur pour le coral-tree */
    coral-tree.coral3-Tree { 
        max-height: none; 
    }
    
    /* Agrandir les textarea dans les formulaires */
    .coral-Form-fieldwrapper textarea {
        min-height: 200px;
        resize: both;
    }

    /* Ajuster la hauteur des textarea en mode fullscreen */
    .coral3-Dialog--fullscreen .coral-Form-fieldwrapper textarea {
        min-height: 400px;
    }

    /* Ajustement de la largeur des colonnes en mode fullscreen */
    .coral3-Dialog--fullscreen .coral3-Dialog-wrapper .coral-FixedColumn-column {
        width: 85%;
    }

    /* Résolution du problème de hauteur dans l'éditeur de composants */
    .editor-ComponentBrowser-component-title {
        height: 3rem !important;
    }

    /* Masquer le widget Smartsupp */
    #smartsupp-widget-container {
        display: none;
    }
    /* Amméliorer la disposition de la page d'édition des redirections */
    #acs-commons-redirectmappage-app .content-container-inner {
        width: unset;
        margin: 0 1em;
    }
    #acs-commons-redirectmappage-app table#entry-table {
        table-layout: auto;
    }
    #acs-commons-redirectmappage-app .fixed-height {
        max-height: unset;
    }
    /* Montre le titre complet des médias dans la recherche de médias */
    coral-card-title.foundation-collection-item-title.coral3-Card-title {
        white-space: normal;
    }
    `;
    
    // Injecter le CSS dans la balise <head>
    document.getElementsByTagName('head')[0].appendChild(style);

})();
