// ==UserScript==
// @name         Claude Continue Button
// @name:it      Pulsante Continua per Claude
// @name:es      Botón Continuar para Claude
// @name:fr      Bouton Continuer pour Claude
// @name:de      Weiter-Button für Claude
// @namespace    https://greasyfork.org/users/Flejta
// @version      1.1.0
// @description  Adds a 'Continue' button to Claude AI chat interface when message length limit is reached. Allows one-click continuation of Claude's response.
// @description:it  Aggiunge un pulsante 'Continua' all'interfaccia di Claude AI quando viene raggiunto il limite di lunghezza. Permette di continuare la risposta di Claude con un solo clic.
// @description:es  Añade un botón 'Continuar' a la interfaz de Claude AI cuando se alcanza el límite de longitud del mensaje. Permite continuar la respuesta de Claude con un solo clic.
// @description:fr  Ajoute un bouton 'Continuer' à l'interface de Claude AI lorsque la limite de longueur du message est atteinte. Permet de continuer la réponse de Claude en un seul clic.
// @description:de  Fügt der Claude AI-Oberfläche eine 'Weiter'-Schaltfläche hinzu, wenn die Nachrichtenlängenbegrenzung erreicht wird. Ermöglicht die Fortsetzung der Antwort von Claude mit einem Klick.
// @author       Flejta
// @match        https://claude.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=claude.ai
// @grant        none
// @license      MIT
// @supportURL   https://github.com/flejta/claude-scripts/issues
// @homepageURL  https://github.com/flejta/claude-scripts
// @downloadURL https://update.greasyfork.org/scripts/533427/Claude%20Continue%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/533427/Claude%20Continue%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Prompts in different languages
    const continuePrompts = {
        'en': "Your platform informs me that you've reached the maximum message length and has paused your response. Please continue from where you left off, and if you were working on an artifact, please continue updating the same one instead of starting over.",
        'it': "La tua piattaforma mi informa che hai raggiunto la lunghezza massima per un messaggio e ha messo in pausa la risposta. Per favore continua da dove eri rimasto, se stavi lavorando su un artefatto continua ad aggiornare lo stesso e non ricominciare da capo.",
        'es': "Tu plataforma me informa que has alcanzado la longitud máxima del mensaje y ha pausado tu respuesta. Por favor, continúa desde donde lo dejaste, y si estabas trabajando en un artefacto, continúa actualizando el mismo en lugar de empezar de nuevo.",
        'fr': "Votre plateforme m'informe que vous avez atteint la longueur maximale du message et a mis votre réponse en pause. Veuillez continuer là où vous vous êtes arrêté, et si vous travailliez sur un artefact, veuillez continuer à mettre à jour le même au lieu de recommencer.",
        'de': "Ihre Plattform teilt mir mit, dass Sie die maximale Nachrichtenlänge erreicht haben und Ihre Antwort pausiert wurde. Bitte fahren Sie dort fort, wo Sie aufgehört haben, und wenn Sie an einem Artefakt gearbeitet haben, aktualisieren Sie bitte dasselbe, anstatt von vorne zu beginnen."
    };

    // Warning messages to detect in different languages
    const warningMessages = {
        'en': /Claude has reached the maximum message length and has paused the response|has reached its response length limit/i,
        'it': /Claude ha raggiunto la lunghezza massima per un messaggio e ha messo in pausa la risposta/i,
        'es': /Claude ha alcanzado la longitud máxima del mensaje y ha pausado la respuesta/i,
        'fr': /Claude a atteint la longueur maximale du message et a mis en pause la réponse/i,
        'de': /Claude hat die maximale Nachrichtenlänge erreicht und hat die Antwort pausiert/i
    };

    // Get user's browser language (default to English if not supported)
    const browserLang = navigator.language.split('-')[0];
    const continuePrompt = continuePrompts[browserLang] || continuePrompts['en'];

    // Function to wait for an element to appear in the DOM
    function waitForElement(selector, callback, checkFrequencyInMs = 100, timeoutInMs = 10000) {
        let startTimeInMs = Date.now();
        (function loopSearch() {
            if (Date.now() - startTimeInMs > timeoutInMs) {
                console.log("Element search timed out for: ", selector);
                return;
            }
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
                return;
            } else {
                setTimeout(loopSearch, checkFrequencyInMs);
            }
        })();
    }

    // Function to create the Continue button for the input area
    function createContinueButton() {
        // Create a new container div for the button (similar to existing divs)
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'relative shrink-0';
        buttonContainer.innerHTML = `
            <div>
                <div class="flex items-center">
                    <div class="flex shrink-0" style="opacity: 1; transform: none; transform-origin: 50% 50% 0px;">
                        <button class="inline-flex items-center justify-center relative shrink-0 can-focus select-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:drop-shadow-none border-0.5 transition-all h-8 min-w-8 rounded-lg flex items-center px-[7.5px] group !pointer-events-auto text-text-300 border-border-300 active:scale-[0.98] hover:text-text-200/90 hover:bg-bg-100" 
                               type="button" 
                               id="claude-continue-button" 
                               aria-label="Continue" 
                               title="Ask Claude to continue">
                            <div class="flex flex-row items-center justify-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                                    <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
                                </svg>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
            <div class="w-[20rem] absolute max-w-[calc(100vw-16px)] bottom-10 hidden"></div>
        `;

        return buttonContainer;
    }

    // Create button for warning message
    function createWarningButton() {
        const button = document.createElement('button');
        button.className = 'claude-warning-continue-button inline-flex items-center justify-center ml-2 px-2 py-1 bg-bg-100 rounded-md hover:bg-bg-200 text-text-200 transition-colors';
        button.title = "Click to continue";
        button.innerHTML = `
            <span class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 256 256" class="mr-1">
                    <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
                </svg>
                Continue
            </span>
        `;
        return button;
    }

    // Function to insert the continuation text into the ProseMirror editor
    function insertContinueText() {
        // Find the ProseMirror contenteditable element
        const proseMirrorEditor = document.querySelector('div.ProseMirror[contenteditable="true"]');
        
        if (proseMirrorEditor) {
            // Clear the editor and insert the new text
            proseMirrorEditor.innerHTML = `<p>${continuePrompt}</p>`;
            
            // Simulate an input event to activate any listeners
            proseMirrorEditor.dispatchEvent(new Event('input', { bubbles: true }));
            
            // Focus on the editor
            proseMirrorEditor.focus();
            
            // Position the cursor at the end of the text
            const selection = window.getSelection();
            const range = document.createRange();
            const lastChild = proseMirrorEditor.lastChild;
            if (lastChild) {
                range.selectNodeContents(lastChild);
                range.collapse(false); // Collapse to the end
                selection.removeAllRanges();
                selection.addRange(range);
            }
            
            console.log('Continue prompt inserted into the editor');
        } else {
            console.log('ProseMirror editor not found');
        }
    }

    // Function to insert the button after the tools button
    function insertContinueButton() {
        waitForElement('#input-tools-menu-trigger', function(toolsButton) {
            // Check if the button doesn't already exist
            if (document.getElementById('claude-continue-button')) {
                return;
            }
            
            // Find the container div of the tools button
            const toolsContainer = toolsButton.closest('.relative.shrink-0');
            if (toolsContainer) {
                // Create and insert the continue button after the tools button
                const continueButton = createContinueButton();
                toolsContainer.parentNode.insertBefore(continueButton, toolsContainer.nextSibling);
                
                // Add event listener to the button
                document.getElementById('claude-continue-button').addEventListener('click', function() {
                    insertContinueText();
                });
                
                console.log('Continue button added successfully');
            }
        });
    }

    // Function to check for warning messages and add buttons to them
    function checkForWarningMessages() {
        // Get all warning messages
        const warningElements = document.querySelectorAll('[data-testid="message-warning"]');
        
        // Process only the most recent warning if there are multiple
        let latestWarning = null;
        
        warningElements.forEach(warning => {
            // Check if the warning is about message length limit
            const text = warning.textContent || '';
            let isLengthWarning = false;
            
            for (const lang in warningMessages) {
                if (warningMessages[lang].test(text)) {
                    isLengthWarning = true;
                    break;
                }
            }
            
            // Remove existing buttons from all warnings
            const existingButton = warning.querySelector('.claude-warning-continue-button');
            if (existingButton) {
                existingButton.remove();
            }
            
            // If it's a length warning, mark it as the latest
            if (isLengthWarning) {
                latestWarning = warning;
            }
        });
        
        // Add button only to the latest warning
        if (latestWarning) {
            const p = latestWarning.querySelector('p');
            if (p && !p.querySelector('.claude-warning-continue-button')) {
                const button = createWarningButton();
                p.appendChild(button);
                
                // Add event listener
                button.addEventListener('click', function() {
                    insertContinueText();
                });
            }
        }
    }

    // Initial setup
    function initialize() {
        insertContinueButton();
        checkForWarningMessages();
    }

    // Check if the page is already loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initialize();
    } else {
        // Otherwise, wait for the page to fully load
        window.addEventListener('DOMContentLoaded', initialize);
    }

    // Periodically check, to handle SPA navigation and dynamic content
    setInterval(function() {
        if (!document.getElementById('claude-continue-button')) {
            insertContinueButton();
        }
        checkForWarningMessages();
    }, 2000);
})();