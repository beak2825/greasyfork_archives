// ==UserScript==
// @name         TYT - CodeMirror IDE Integration
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds an IDE integration using CodeMirror to specific textareas in the AEM interface for Toyota websites.
// @author       You
// @match        https://aem-author-prod.toyota.eu/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/508691/TYT%20-%20CodeMirror%20IDE%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/508691/TYT%20-%20CodeMirror%20IDE%20Integration.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function loadCodeMirror(callback) {
        // Load CodeMirror JS
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.2/codemirror.min.js';
        document.head.appendChild(script);

        // Load CodeMirror CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.2/codemirror.min.css';
        document.head.appendChild(link);

        // Load CodeMirror theme (Monokai)
        const themeLink = document.createElement('link');
        themeLink.rel = 'stylesheet';
        themeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.2/theme/monokai.min.css';
        document.head.appendChild(themeLink);

        // Wait for CodeMirror to be fully loaded
        script.onload = callback;
    }

    function initializeCodeMirror() {
        console.log("CodeMirror Loaded");

        // Define modes to be loaded
        const modes = ['xml', 'javascript', 'css', 'htmlmixed'];
        let loadedModes = 0;

        modes.forEach((mode) => {
            const modeScript = document.createElement('script');
            modeScript.src = `https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.2/mode/${mode}/${mode}.min.js`;
            document.head.appendChild(modeScript);

            modeScript.onload = () => {
                console.log(`${mode} mode loaded`);
                loadedModes++;

                // Initialize CodeMirror after all modes are loaded
                if (loadedModes === modes.length) {
                    const textareas = document.querySelectorAll('textarea[name="./html"], textarea[name="./javascript"], textarea[name="./css"]');
                    textareas.forEach((textarea) => {
                        if (textarea.getAttribute('data-codemirror-initialized')) {
                            return;
                        }

                        let mode;
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
                        const editor = CodeMirror.fromTextArea(textarea, {
                            lineNumbers: true,
                            mode: mode,
                            theme: 'monokai',
                            lineWrapping: true,
                        });
                        textarea.setAttribute('data-codemirror-initialized', 'true');
                    });
                }
            };
        });
    }

    function addIdeButton() {
        // Create IDE button
        const buttonIDE = document.createElement('button');
        buttonIDE.innerHTML = 'IDE';
        buttonIDE.id = 'IDE-button';
        buttonIDE.style.position = 'fixed';
        buttonIDE.style.bottom = '20px';
        buttonIDE.style.left = '20px';
        buttonIDE.style.zIndex = '99999';
        document.body.appendChild(buttonIDE);

        // Add event listener to load CodeMirror on click
        buttonIDE.addEventListener('click', () => {
            loadCodeMirror(initializeCodeMirror);
        });
    }

    // Only run on the AEM Author domain
    if (window.location.origin === 'https://aem-author-prod.toyota.eu') {
        addIdeButton();
    }

        // Créer un élément de style pour injecter du CSS personnalisé
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
    .CodeMirror.cm-s-monokai.CodeMirror-wrap {
    resize: vertical;
    }
    `;

    // Injecter le CSS dans la balise <head>
    document.getElementsByTagName('head')[0].appendChild(style);
})();
