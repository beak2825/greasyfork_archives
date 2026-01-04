// ==UserScript==
// @name         OBSOLETE TYT - Enhanced Toyota AEM Editor
// @namespace    http://tampermonkey.net/
// @version      0.5.1
// @description  Améliorations de l'interface AEM pour Toyota: vue arborescente sans restriction, édition de texte facilitée, IDE intégré pour le code, accès rapide à l'édition de page, et amélioration générale de l'utilisation.
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
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491641/OBSOLETE%20TYT%20-%20Enhanced%20Toyota%20AEM%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/491641/OBSOLETE%20TYT%20-%20Enhanced%20Toyota%20AEM%20Editor.meta.js
// ==/UserScript==

(function () {
    'use strict';


    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
    coral-tree.coral3-Tree { max-height: none; }
    .coral-Form-fieldwrapper textarea {
        min-height: 200px;
        resize:both;
    }
    .coral3-Dialog--fullscreen .coral-Form-fieldwrapper textarea {
        min-height: 400px;
    }
    .coral3-Dialog--fullscreen .coral3-Dialog-wrapper .coral-FixedColumn-column {
        width: 85%;
    }
    #IDE-button, #Sort-button {
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 99999;
    }
        #Sort-button {
        left: 60px;
    }
    .CodeMirror.cm-s-monokai.CodeMirror-wrap {
    resize: vertical;
    }
    #smartsupp-widget-container {
    display:none;
    }
    
    /* Fix component heigth on page editor */
    .editor-ComponentBrowser-component-title {
        height: 3rem!important;
    }
    `;
    document.getElementsByTagName('head')[0].appendChild(style);

   function addIdeButton() {
    // Créer un bouton "IDE"
    var buttonIDE = document.createElement('button');
    buttonIDE.innerHTML = 'IDE';
    buttonIDE.id = 'IDE-button';
    document.body.appendChild(buttonIDE);

    buttonIDE.addEventListener('click', function () {
        var script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.2/codemirror.min.js';
        document.head.appendChild(script);

        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.2/codemirror.min.css';
        document.head.appendChild(link);

        var themeLink = document.createElement('link');
        themeLink.rel = 'stylesheet';
        themeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.2/theme/monokai.min.css';
        document.head.appendChild(themeLink);

        // Attendez que CodeMirror soit chargé
        script.onload = function () {
            console.log("CodeMirror Loaded");

            // Chargez les modes de CodeMirror
            var modes = ['xml', 'javascript', 'css', 'htmlmixed'];
            var loadedModes = 0;

            modes.forEach(function (mode) {
                var modeScript = document.createElement('script');
                modeScript.src = `https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.2/mode/${mode}/${mode}.min.js`;
                document.head.appendChild(modeScript);

                modeScript.onload = function () {
                    console.log(mode + " mode loaded");
                    loadedModes++;

                    // Lorsque tous les modes sont chargés, initialisez CodeMirror
                    if (loadedModes === modes.length) {
                        var textareas = document.querySelectorAll('textarea[name="./html"], textarea[name="./javascript"], textarea[name="./css"]');
                        textareas.forEach(function (textarea) {
                            // Check if CodeMirror has already been initialized for this textarea
                            if (textarea.getAttribute('data-codemirror-initialized')) {
                                return;
                            }

                            var mode;
                            switch (textarea.name) {
                                case './html':
                                    mode = 'htmlmixed';
                                    break;
                                case './javascript':
                                    mode = 'javascript';
                                    break;
                                case './css':
                                    mode = 'css';
                                    break;
                            }

                            console.log('Initializing CodeMirror with mode ' + mode);
                            var editor = CodeMirror.fromTextArea(textarea, {
                                lineNumbers: true, mode: mode, theme: 'monokai', lineWrapping: true
                            });
                            textarea.setAttribute('data-codemirror-initialized', 'true');
                        });
                    }
                };
            });
        };
    });

    // Créer un bouton "Sort"
    var buttonSort = document.createElement('button');
    buttonSort.innerHTML = 'Sort';
    buttonSort.id = 'Sort-button';
    document.body.appendChild(buttonSort);

    buttonSort.addEventListener('click', function () {
        // Sélectionne tous les éléments contenant les items
        const allColumnContents = document.querySelectorAll('coral-columnview-column-content');

        // Pour chaque liste trouvée
        allColumnContents.forEach(columnContent => {
            // Récupère tous les items (coral-columnview-item) de la liste actuelle
            const items = Array.from(columnContent.querySelectorAll('coral-columnview-item'));

            // Sépare les items en deux catégories : avec titre et sans titre
            const itemsWithTitle = [];
            const itemsWithoutTitle = [];

            items.forEach(item => {
                const titleElement = item.querySelector('.foundation-collection-item-title');
                const title = titleElement ? titleElement.textContent.trim() : '';

                if (title) {
                    itemsWithTitle.push(item);
                } else {
                    itemsWithoutTitle.push(item);
                }
            });

            // Trie les items qui ont un titre par ordre alphabétique
            itemsWithTitle.sort((a, b) => {
                const titleA = a.querySelector('.foundation-collection-item-title').textContent.trim();
                const titleB = b.querySelector('.foundation-collection-item-title').textContent.trim();
                return titleA.localeCompare(titleB);
            });

            // Supprime les items actuels du DOM de la liste actuelle
            items.forEach(item => columnContent.removeChild(item));

            // Ajoute les items triés avec titre, puis ceux sans titre à la fin
            itemsWithTitle.forEach(item => columnContent.appendChild(item));
            itemsWithoutTitle.forEach(item => columnContent.appendChild(item));
        });
    });
}

if (window.location.origin == 'https://aem-author-prod.toyota.eu') {
    addIdeButton();
}



    // Sélectionner l'élément avec la classe "search-results"
    var element = document.querySelector('.search-results');

    // Vérifier si l'élément a l'attribut "data-root"
    if (element.hasAttribute('data-root')) {
        // Récupérer la valeur de l'attribut "data-root"
        var dataRootValue = 'https://aem-author-prod.toyota.eu/editor.html' + element.getAttribute('data-root') + '.html';
        console.log(dataRootValue); // Affiche la valeur dans la console

        // Créer un lien "Edit Page"
        var editLink = document.createElement('a');
        editLink.innerHTML = 'Edit Page';
        editLink.href = dataRootValue;
        editLink.target = '_self';
        editLink.style.position = 'fixed';
        editLink.style.bottom = '60px'; // pour ne pas chevaucher le premier bouton
        editLink.style.left = '20px';
        editLink.style.zIndex = '99999';
        editLink.style.backgroundColor = 'rgba(255, 255, 255, .25)';

        document.body.appendChild(editLink);

        function addRefreshCacheButton() {
            // Créer un bouton "Refresh Cache"
            var button = document.createElement('button');
            button.innerHTML = 'Refresh Cache';
            button.id = 'refresh-cache-button';
            button.style.position = 'fixed';
            button.style.bottom = '100px'; // ajuster la position pour éviter de chevaucher les autres boutons
            button.style.left = '20px';
            button.style.zIndex = '99999';
            button.style.backgroundColor = 'rgba(255, 255, 255, .25)';

            document.body.appendChild(button);

            // Ajouter l'écouteur d'événements pour rafraîchir le cache
            button.addEventListener('click', function () {
                // Récupérer l'URL actuelle sans paramètres de cache
                var url = new URL(window.location.href);
                var searchParams = url.searchParams;

                // Supprimer les paramètres de cache existants
                searchParams.delete('cache');

                // Ajouter un nouveau paramètre de cache avec la date et l'heure actuelle
                var dateHeure = new Date().getTime();
                searchParams.set('cache', dateHeure);

                // Recharger la page avec les nouveaux paramètres de cache
                window.location.href = url.href;
            });
        }
        // Ajouter le bouton pour rafraîchir le cache
        addRefreshCacheButton();
    }

// add cache to all urls
function addCacheParamToLinks() {
    // Récupérer l'URL actuelle et les paramètres de recherche
    var url = new URL(window.location.href);
    var searchParams = url.searchParams;

 //   console.log('URL actuelle:', url.href);

    // Vérifier si le paramètre de cache est présent
    if (searchParams.has('cache')) {
        // Récupérer la valeur du paramètre de cache
        var cacheValue = searchParams.get('cache');

     //   console.log('Paramètre de cache trouvé:', cacheValue);

        // Sélectionner tous les liens de la page
        var links = document.querySelectorAll('a');

    //    console.log('Nombre de liens trouvés sur la page:', links.length);

        // Parcourir chaque lien et ajouter le paramètre de cache
        links.forEach(function(link, index) {
            try {
                // Construire une nouvelle URL basée sur le lien actuel
                var linkUrl = new URL(link.href, window.location.origin);
                var linkSearchParams = linkUrl.searchParams;
                linkSearchParams.set('cache', cacheValue);
                link.href = linkUrl.href;

           //     console.log('Lien mis à jour', index, link.href);
            } catch (e) {
           //     console.error('Erreur avec le lien', index, link.href, e.message);
            }
        });
    } else {
     //   console.log('Aucun paramètre de cache n\'est présent dans l\'URL actuelle.');
    }
}

// Appeler la fonction pour ajouter le paramètre de cache aux liens
addCacheParamToLinks();

})();