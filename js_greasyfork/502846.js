// ==UserScript==
// @name         Zendesk Enhancements
// @namespace    http://tampermonkey.net/
// @version      1.3.3
// @description  Améliore l'interface Zendesk et ajoute des fonctionnalités supplémentaires
// @author       Morgan & gann
// @match        https://*.zendesk.com/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502846/Zendesk%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/502846/Zendesk%20Enhancements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Définition d'un style commun pour les éléments personnalisés
    var customCSS = `
.custom-button, .djm-task-link, .copy-conversation-button {
    padding: 5px 10px;
    background-color: limegreen;
    font-size: 16px;
    color: black;
    border: 1px solid transparent;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    margin: 5px;
    transition: background-color 0.15s ease, color 0.15s ease;
    &:hover {
        background-color: darkgreen; /* Couleur de fond au survol */
        color: white; /* Couleur du texte au survol */
    }
}

.sc-1oduqug-0.jdCBDY {
    margin-top: 30px;
}

iframe#web-messenger-container {
    display: none;
}

.app_view.app-1019154.apps_ticket_sidebar iframe {
    height: 80vh!important;
}
/* Enhence copy conversation btn */
.sc-1nvv38f-3.cjpyOe {
    flex: unset;
}
/*Enhence next conversation btn */
.jGrowl-notification {
    top: 30px;
}
    `;

    GM_addStyle(customCSS);

    // Initialisation des fonctions personnalisées
    setTimeout(function() {
        customFunction()
    }, 500);

    function customFunction(message) {
        setTimeout(function() {
            checkUrlAndRunScriptInitializeInputLinks();
            checkUrlAndRunScriptTransformUrlsToLinks();
        }, 500);
    }

    // Écoute les changements de navigation
    window.addEventListener('popstate', function() {
        customFunction('Chemin changé: ' + window.location.pathname);
    });

    // Surcharge des méthodes d'historique
    function overrideHistoryMethod(methodName) {
        var originalMethod = history[methodName];
        history[methodName] = function(state) {
            if (typeof history['on' + methodName] == "function") {
                history['on' + methodName]({state: state});
            }
            customFunction('Chemin changé par ' + methodName + ': ' + window.location.pathname);
            return originalMethod.apply(history, arguments);
        };
    }

    overrideHistoryMethod('pushState');
    overrideHistoryMethod('replaceState');

    window.history.onpushstate = function(e) {
        window.dispatchEvent(new CustomEvent('pushstate', e));
    };
    window.history.onreplacestate = function(e) {
        window.dispatchEvent(new CustomEvent('replacestate', e));
    };

    // Événements sur les en-têtes de tableau
    var theads = document.querySelectorAll('thead');
    theads.forEach(function(thead) {
        thead.addEventListener('click', function(event) {
            customFunction('Un thead a été cliqué' + event.target);
        });
    });

    function transformUrlsToLinks() {
        const cells = document.querySelectorAll('.beWvMU');
        const urlRegex = /(https?:\/\/[^\s]+)/g;

        if (cells.length > 0) {
            cells.forEach((cell, index) => {
                const textContent = cell.textContent;

                if (urlRegex.test(textContent)) {
                    const link = document.createElement('a');
                    link.setAttribute('href', textContent.match(urlRegex)[0]);
                    link.textContent = textContent.match(urlRegex)[0];
                    link.classList.add('custom-button');
                    cell.textContent = '';
                    cell.appendChild(link);
                }
            });
        }
    }

    function checkUrlAndRunScriptTransformUrlsToLinks() {
        if (window.location.pathname.startsWith('/agent/filters/')) {
            transformUrlsToLinks();
        }
    }

    function initializeInputLinks() {
        var inputElements = document.querySelectorAll('.custom_field_14504424601628 input');

        inputElements.forEach(function(inputElement) {
            var existingLink = inputElement.parentNode.parentNode.querySelector('.djm-task-link');
            if (existingLink) {
                existingLink.remove();
            }

            var linkElement = document.createElement('a');
            linkElement.textContent = 'Tâche';
            linkElement.style.display = 'none';
            linkElement.classList.add('djm-task-link');
            inputElement.parentNode.parentNode.insertBefore(linkElement, inputElement.nextSibling);

            checkForUrl(inputElement, linkElement);

            inputElement.addEventListener('input', function() {
                console.log('Événement input détecté.');
                checkForUrl(inputElement, linkElement);
            });
        });
    }

    function checkForUrl(inputElement, linkElement) {
        if (inputElement.value.match(/(https?:\/\/[^\s]+)/g)) {
            linkElement.href = inputElement.value;
            linkElement.style.display = 'inline-block';
        } else {
            linkElement.style.display = 'none';
        }
    }

    function checkUrlAndRunScriptInitializeInputLinks() {
        if (window.location.pathname.startsWith('/agent/tickets/')) {
            initializeInputLinks();
        }
    }

    // Fonction pour fermer tous les onglets inactifs
    function closeInactiveTabs() {
        const closeButtons = [...document.querySelectorAll('div[role="tab"][data-selected="false"] button[data-test-id="close-button"]')];
        closeButtons.forEach(btn => btn.click());
    }

    // Fonction pour ajouter le bouton "Close All"
    function addCloseAllButton() {
        const toolbar = document.querySelector('div[data-test-id="header-tablist"] > div.sc-19uji9v-0');
        if (toolbar && !document.getElementById('close-all-button')) {
            const closeButton = document.createElement('button');
            closeButton.id = 'close-all-button';
            closeButton.textContent = 'X Close all';
            closeButton.className = 'custom-button';
            closeButton.addEventListener('click', closeInactiveTabs);

            toolbar.appendChild(closeButton);
        }
    }

    // Ajout du bouton "Close All" au chargement de la page
    window.addEventListener('load', addCloseAllButton);

    // Observer les changements dans le DOM pour charger dynamiquement le bouton
    const observer = new MutationObserver(addCloseAllButton);
    observer.observe(document.body, { childList: true, subtree: true });



    function addCopyButtons() {
        // Get all 'ember-view workspace has-play' elements
        const workspaces = document.querySelectorAll('.ember-view.workspace');

        workspaces.forEach((workspace, index) => {
            // Find the 'sc-1nvv38f-3 cjpyOe' element within each workspace
            const headerElement = workspace.querySelector('.sc-1nvv38f-3.cjpyOe');

            if (headerElement) {
                // Check if the button already exists to avoid duplicates
                if (!headerElement.querySelector('.copy-conversation-button')) {
                    // Create a new button
                    const button = document.createElement('button');
                    button.innerText = 'Copy Conversation';
                    button.style.marginLeft = '10px';
                    button.classList.add('copy-conversation-button'); // Add a class for easy selection

                    // Add the click event to copy conversation text
                    button.addEventListener('click', () => {
                        // Find the conversation text container
                        const conversationContainer = workspace.querySelector('.sc-175iuw8-0.ecaNtR.conversation-polaris.polaris-react-component.rich_text');

                        if (conversationContainer) {
                            const textToCopy = conversationContainer.innerText;

                            // Append "[Ma réponse au client]" to the text
                            const modifiedText = textToCopy + '\n[Ma réponse au client]\n';

                            // Copy the modified text to clipboard
                            copyToClipboard(modifiedText);
                        }
                    });

                    // Append the button to the header element
                    headerElement.appendChild(button);
                }
            }
        });
    }

    // Function to copy text to clipboard
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }

    // Run the function every second
    setInterval(addCopyButtons, 1000);



})();