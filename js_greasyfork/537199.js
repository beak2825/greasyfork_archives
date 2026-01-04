// ==UserScript==
// @name         Gemini PROmpt editor
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Enhances Google Gemini with an advanced prompt editor (EN/IT, themes, smart formatting & more).
// @author       Ustanojevic & Gemini 2.5 Pro
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/537199/Gemini%20PROmpt%20editor.user.js
// @updateURL https://update.greasyfork.org/scripts/537199/Gemini%20PROmpt%20editor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- LANGUAGE CONFIGURATION ---
    const LANG_STRINGS = {
        EN: {
            modalTitle: "Gemini PROmpt Editor",
            btnApply: "Apply Prompt & Close",
            btnCancel: "Cancel",
            btnSelectAll: "Select All",
            langSelectLabel: "Language:", // Non usata attualmente, ma pronta se serve
            ariaOpenEditor: "Open Gemini PROmpt Editor",
            sections: [
                { header: "**### CONTEXT ###**", placeholder: "[Provide general context or background information here]", optional: true },
                { header: "**### OBJECTIVE / SPECIFIC QUESTION ###**", placeholder: "[Clearly describe what you want Gemini to do, what question to answer, or task to perform]", optional: true },
                { header: "**### OUTPUT FORMAT (Optional) ###**", placeholder: "[Specify desired output: e.g., bullet list, table, JSON, paragraph, email, etc.]", optional: true },
                { header: "**### RULES / CONSTRAINTS (Optional) ###**", placeholder: "[Specify any restrictions, style, things to avoid, maximum length, etc.]", optional: true },
                { header: "**### EXAMPLE (Optional) ###**", placeholder: "[Provide a brief example of desired input/output, if applicable]", optional: true }
            ]
        },
        IT: {
            modalTitle: "Gemini PROmpt editor",
            btnApply: "Applica Prompt e Chiudi",
            btnCancel: "Annulla",
            btnSelectAll: "Seleziona Tutto",
            langSelectLabel: "Lingua:",
            ariaOpenEditor: "Apri Gemini PROmpt editor",
            sections: [
                { header: "**### CONTESTO ###**", placeholder: "[Inserisci qui il contesto generale o le informazioni di base necessarie]", optional: true },
                { header: "**### OBIETTIVO / DOMANDA SPECIFICA ###**", placeholder: "[Descrivi chiaramente cosa vuoi che Gemini faccia, quale domanda deve rispondere o quale compito deve svolgere]", optional: true },
                { header: "**### FORMATO OUTPUT (Opzionale) ###**", placeholder: "[Indica come desideri l'output: es. lista puntata, tabella, codice JSON, paragrafo, email, ecc.]", optional: true },
                { header: "**### REGOLE / VINCOLI (Opzionale) ###**", placeholder: "[Specifica eventuali restrizioni, stile da adottare, cose da evitare, lunghezza massima, ecc.]", optional: true },
                { header: "**### ESEMPIO (Opzionale) ###**", placeholder: "[Fornisci un breve esempio di input/output desiderato, se applicabile]", optional: true }
            ]
        }
    };

    let currentLang = GM_getValue('promptEditorLang', 'EN'); // Default a Inglese
    let STRINGS = LANG_STRINGS[currentLang] || LANG_STRINGS['EN'];
    let PROMPT_SECTIONS = STRINGS.sections;

    function generatePromptTemplate(sectionsArray) {
        return sectionsArray.map(s => `${s.header}\n${s.placeholder}`).join("\n\n");
    }
    let PROMPT_TEMPLATE = generatePromptTemplate(PROMPT_SECTIONS);

    const GEMINI_DARK_MODE_CLASS = 'dark-theme';
    const GEMINI_MAIN_CONTENT_SELECTOR = 'bard-sidenav-content';

    // --- STILI CSS ---
    GM_addStyle(`
        #promptEditorButton {
            background-color: #1a73e8; color: white; padding: 0; width: 40px; height: 40px;
            border: none; border-radius: 50%; cursor: pointer;
            margin: 0 4px; display: inline-flex; align-items: center; justify-content: center;
            transition: background-color 0.2s ease-in-out; flex-shrink: 0;
            font-family: 'Google Symbols', 'Material Symbols Outlined', 'Material Icons', sans-serif; /* Per l'icona */
            font-size: 20px; /* Dimensione icona Material */
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            overflow: hidden;
        }
        #promptEditorButton:hover { background-color: #1765cc; }

        #promptEditorModalOverlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0,0,0,0.5); z-index: 10000;
            display: none;
        }
        #promptEditorModal {
            font-family: Roboto, Arial, sans-serif; width: 750px; max-width: 95%;
            background-color: #fff; color: #202124;
            border: 1px solid #dfe1e5; border-radius: 12px;
            box-shadow: 0 8px 16px rgba(0,0,0,0.15);
            padding: 28px; display: flex; flex-direction: column;
            gap: 20px; z-index: 10001;
            position: fixed; margin: 0;
        }
        #promptEditorModal h3 {
            margin-top: 0; margin-bottom: 4px; color: #3c4043;
            font-size: 22px; font-weight: 500; text-align: center;
        }
        #promptEditorTextarea {
            width: 100%; box-sizing: border-box; height: 450px; padding: 12px;
            border: 1px solid #dadce0; border-radius: 6px;
            font-family: "Google Sans", "Helvetica Neue", Arial, sans-serif;
            font-size: 16px; font-weight: 400; line-height: 1.6;
            resize: vertical;
            background-color: #f8f9fa; color: #3c4043;
        }
        #promptEditorTextarea:focus {
            border-color: #1a73e8; box-shadow: 0 0 0 1px #1a73e8;
            outline: none; background-color: #fff;
        }
        #promptEditorControls {
            display: flex; justify-content: space-between;
            align-items: center; gap: 12px; margin-top: 8px;
        }
        #promptEditorControls .left-controls { display: flex; align-items: center; gap: 10px; }
        #promptEditorControls .right-buttons { display: flex; gap: 12px; }
        #promptEditorControls button {
            font-family: 'Google Sans', Roboto, Arial, sans-serif;
            padding: 10px 24px; border: none; border-radius: 6px;
            cursor: pointer; font-weight: 500; font-size: 14px;
            text-transform: none;
            transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        #copyAndCloseBtn { background-color: #1a73e8; color: white; }
        #copyAndCloseBtn:hover {
            background-color: #1765cc;
            box-shadow: 0 1px 3px 0 rgba(60,64,67,0.302), 0 2px 6px 2px rgba(60,64,67,0.149);
        }
        #cancelBtn { background-color: #fff; color: #1a73e8; border: 1px solid #dadce0; }
        #cancelBtn:hover { background-color: rgba(26,115,232,0.04); border-color: #adcaf3; }
        #selectAllBtn {
            background-color: transparent; color: #5f6368;
            border: 1px solid #dadce0; padding: 9px 18px;
        }
        #selectAllBtn:hover { background-color: rgba(0,0,0,0.03); border-color: #c6c6c6; }
        #langSelect {
            padding: 8px 10px; border-radius: 4px; border: 1px solid #dadce0;
            background-color: #f8f9fa; color: #3c4043; font-size: 13px;
            font-family: 'Google Sans', Roboto, Arial, sans-serif;
            height: 38px; /* Per allineare con i bottoni */
        }

        /* Stili Tema Scuro */
        .prompt-editor-dark-theme #promptEditorModal {
            background-color: #202124; color: #e8eaed; border-color: #5f6368;
        }
        .prompt-editor-dark-theme #promptEditorModal h3 { color: #e8eaed; }
        .prompt-editor-dark-theme #promptEditorTextarea {
            background-color: #2d2e30; color: #e8eaed; border-color: #5f6368;
        }
        .prompt-editor-dark-theme #promptEditorTextarea:focus {
            border-color: #8ab4f8; box-shadow: 0 0 0 1px #8ab4f8; background-color: #202124;
        }
        .prompt-editor-dark-theme #copyAndCloseBtn { background-color: #8ab4f8; color: #202124; }
        .prompt-editor-dark-theme #copyAndCloseBtn:hover { background-color: #99c0fa; }
        .prompt-editor-dark-theme #cancelBtn {
            background-color: #2d2e30; color: #8ab4f8; border-color: #5f6368;
        }
        .prompt-editor-dark-theme #cancelBtn:hover { background-color: #3c4043; border-color: #8ab4f8;}
        .prompt-editor-dark-theme #selectAllBtn {
            background-color: transparent; color: #bdc1c6; border-color: #5f6368;
        }
        .prompt-editor-dark-theme #selectAllBtn:hover { background-color: rgba(255,255,255,0.08); border-color: #7f8286;}
        .prompt-editor-dark-theme #langSelect {
            background-color: #2d2e30; color: #e8eaed; border-color: #5f6368;
        }
    `);

    let editorButton = null;
    let modalOverlay = null;
    let modal = null;
    let promptTextarea = null;
    let geminiInputTarget = null;
    let resizeTimeout;
    let langSelectElement = null;

    function findGeminiInputArea() {
        const inputElement = document.querySelector('div.ql-editor[aria-label="Enter a prompt here"][contenteditable="true"]');
        if (inputElement) {
            let buttonHostContainer = inputElement.closest('div.text-input-field');
            if (!buttonHostContainer) buttonHostContainer = inputElement.closest('.text-input-field-main-area') || inputElement.closest('.text-input-field_textarea-wrapper');
            if (!buttonHostContainer) {
                const richTextParent = inputElement.closest('rich-textarea')?.parentElement?.parentElement;
                buttonHostContainer = richTextParent || inputElement.parentElement?.parentElement || document.body;
                if (buttonHostContainer === document.body) console.warn("Gemini PROmpt editor: Usato document.body come fallback per buttonHostContainer.");
            }
            return { container: buttonHostContainer, input: inputElement, type: 'div' };
        }
        return null;
    }

    function applyCurrentTheme() {
        if (modalOverlay) {
            if (document.body.classList.contains(GEMINI_DARK_MODE_CLASS) ||
                document.documentElement.classList.contains(GEMINI_DARK_MODE_CLASS)) {
                modalOverlay.classList.add('prompt-editor-dark-theme');
            } else {
                modalOverlay.classList.remove('prompt-editor-dark-theme');
            }
        }
    }

    function positionModal() {
        if (!modal || !modalOverlay || modalOverlay.style.display === 'none') return;
        const modalWidth = modal.offsetWidth;
        const modalHeight = modal.offsetHeight;
        const targetElement = document.querySelector(GEMINI_MAIN_CONTENT_SELECTOR);
        let modalLeft, modalTop;
        if (targetElement) {
            const targetRect = targetElement.getBoundingClientRect();
            modalLeft = targetRect.left + (targetRect.width / 2) - (modalWidth / 2);
            modalTop = (window.innerHeight / 2) - (modalHeight / 2);
            modalLeft = Math.max(10, Math.min(modalLeft, window.innerWidth - modalWidth - 10));
            modalTop = Math.max(10, Math.min(modalTop, window.innerHeight - modalHeight - 10));
        } else {
            console.warn(`Gemini PROmpt editor: Elemento target "${GEMINI_MAIN_CONTENT_SELECTOR}" non trovato. Uso centraggio viewport.`);
            modalLeft = (window.innerWidth / 2) - (modalWidth / 2);
            modalTop = (window.innerHeight / 2) - (modalHeight / 2);
        }
        modal.style.left = `${modalLeft}px`;
        modal.style.top = `${modalTop}px`;
    }

    function updateUIStrings() {
        STRINGS = LANG_STRINGS[currentLang] || LANG_STRINGS['EN']; // Assicura fallback a EN
        PROMPT_SECTIONS = STRINGS.sections;
        PROMPT_TEMPLATE = generatePromptTemplate(PROMPT_SECTIONS);

        if (modal) {
            modal.querySelector('h3').textContent = STRINGS.modalTitle;
            modal.querySelector('#selectAllBtn').textContent = STRINGS.btnSelectAll;
            modal.querySelector('#cancelBtn').textContent = STRINGS.btnCancel;
            modal.querySelector('#copyAndCloseBtn').textContent = STRINGS.btnApply;
        }
        if (editorButton) editorButton.setAttribute('aria-label', STRINGS.ariaOpenEditor);
        // Il valore del langSelectElement viene aggiornato dal suo event listener, non qui direttamente
        // per evitare loop se updateUIStrings fosse chiamato dall'event listener stesso.
    }

    function updatePromptTextareaOnLangChange(oldLangValue) {
        if (!promptTextarea) return;
        const oldTemplate = generatePromptTemplate(LANG_STRINGS[oldLangValue]?.sections || LANG_STRINGS['EN'].sections);
        if (promptTextarea.value.trim() === "" || promptTextarea.value === oldTemplate) {
            promptTextarea.value = PROMPT_TEMPLATE; // PROMPT_TEMPLATE è già stato aggiornato per currentLang
        }
    }

    function createEditorModal() {
        if (document.getElementById('promptEditorModalOverlay')) return;
        modalOverlay = document.createElement('div');
        modalOverlay.id = 'promptEditorModalOverlay';
        modal = document.createElement('div');
        modal.id = 'promptEditorModal';

        const titleElement = document.createElement('h3');
        modal.appendChild(titleElement);

        promptTextarea = document.createElement('textarea');
        promptTextarea.id = 'promptEditorTextarea';
        modal.appendChild(promptTextarea);

        const controlsDiv = document.createElement('div');
        controlsDiv.id = 'promptEditorControls';

        const leftControlsDiv = document.createElement('div');
        leftControlsDiv.className = 'left-controls';

        const selectAllBtn = document.createElement('button');
        selectAllBtn.id = 'selectAllBtn';
        leftControlsDiv.appendChild(selectAllBtn);

        langSelectElement = document.createElement('select');
        langSelectElement.id = 'langSelect';
        for (const langCode in LANG_STRINGS) {
            const option = document.createElement('option');
            option.value = langCode;
            option.textContent = langCode.toUpperCase();
            if (langCode === currentLang) option.selected = true;
            langSelectElement.appendChild(option);
        }
        leftControlsDiv.appendChild(langSelectElement);
        controlsDiv.appendChild(leftControlsDiv);

        const rightButtonsDiv = document.createElement('div');
        rightButtonsDiv.className = 'right-buttons';
        const cancelEditorBtn = document.createElement('button');
        cancelEditorBtn.id = 'cancelBtn';
        rightButtonsDiv.appendChild(cancelEditorBtn);
        const copyAndCloseEditorBtn = document.createElement('button');
        copyAndCloseEditorBtn.id = 'copyAndCloseBtn';
        rightButtonsDiv.appendChild(copyAndCloseEditorBtn);
        controlsDiv.appendChild(rightButtonsDiv);

        modal.appendChild(controlsDiv);
        modalOverlay.appendChild(modal);
        document.body.appendChild(modalOverlay);

        updateUIStrings(); // Imposta testi iniziali

        selectAllBtn.addEventListener('click', () => {
            if (promptTextarea) { promptTextarea.focus(); promptTextarea.select(); }
        });

        copyAndCloseEditorBtn.addEventListener('click', () => {
            let fullText = promptTextarea.value;
            let outputParts = [];
            const sectionRegex = /(\*\*### [^*]+ ###\*\*\s*[\s\S]*?(?=\n\n\*\*###|$))/g;
            let match;
            const localPromptSections = STRINGS.sections; // Usa le sezioni della lingua corrente
            const foundSections = [];
            while ((match = sectionRegex.exec(fullText)) !== null) {
                foundSections.push(match[0].trim());
            }

            if (foundSections.length > 0) {
                for (const sectionText of foundSections) {
                    let headerInfo = null;
                    let sectionContent = "";
                    for (const def of localPromptSections) {
                        if (sectionText.startsWith(def.header)) {
                            headerInfo = def;
                            sectionContent = sectionText.substring(def.header.length).trim();
                            break;
                        }
                    }
                    if (headerInfo) {
                        if (sectionContent !== "" && sectionContent !== headerInfo.placeholder.trim()) {
                            outputParts.push(headerInfo.header + '\n' + sectionContent);
                        }
                    } else {
                         outputParts.push(sectionText);
                    }
                }
            } else if (fullText.trim() !== "" && fullText.trim() !== generatePromptTemplate(localPromptSections).trim()) {
                 // Se non ci sono sezioni strutturate ma c'è testo diverso dal template vuoto, copia tutto
                outputParts.push(fullText.trim());
            } // Altrimenti non copia nulla se il template è vuoto e non ci sono sezioni

            const textToCopy = outputParts.join("\n\n").trim();

            if (geminiInputTarget && geminiInputTarget.input) {
                geminiInputTarget.input.focus();
                geminiInputTarget.input.innerText = textToCopy;
                geminiInputTarget.input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                geminiInputTarget.input.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
                const placeholder = geminiInputTarget.input.parentElement?.querySelector('.input-placeholder, .ql-placeholder');
                if (placeholder) placeholder.style.display = 'none';
                setTimeout(() => {
                    geminiInputTarget.input.dispatchEvent(new Event('keyup', { bubbles: true, cancelable: true }));
                }, 50);
            } else {
                console.error("Gemini PROmpt editor: Target input di Gemini non trovato per copiare.");
            }
            modalOverlay.style.display = 'none';
        });

        cancelEditorBtn.addEventListener('click', () => { modalOverlay.style.display = 'none'; });
        modalOverlay.addEventListener('keydown', (event) => { if (event.key === 'Escape') modalOverlay.style.display = 'none'; });
        modal.addEventListener('click', (event) => event.stopPropagation());
        modalOverlay.addEventListener('click', () => modalOverlay.style.display = 'none');

        langSelectElement.addEventListener('change', (event) => {
            const oldLang = currentLang;
            currentLang = event.target.value;
            GM_setValue('promptEditorLang', currentLang);
            updateUIStrings();
            updatePromptTextareaOnLangChange(oldLang);
        });
    }

    function addOpenEditorButton() {
        if (document.getElementById('promptEditorButton')) return;
        const inputInfo = findGeminiInputArea();
        if (inputInfo && inputInfo.input && inputInfo.container) {
            geminiInputTarget = inputInfo;
            editorButton = document.createElement('button');
            editorButton.id = 'promptEditorButton';
            editorButton.classList.add('google-symbols'); // Classe per font Material Symbols
            // editorButton.classList.add('mat-ligature-font'); // Potrebbe non essere necessaria se 'google-symbols' è sufficiente
            editorButton.textContent = 'edit_note'; // Ligatura per l'icona
            editorButton.setAttribute('aria-label', STRINGS.ariaOpenEditor);

            editorButton.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!modalOverlay) createEditorModal();

                modalOverlay.style.visibility = 'hidden';
                modalOverlay.style.display = 'block';
                if (modal) modal.style.display = 'flex';

                applyCurrentTheme();
                positionModal();

                modalOverlay.style.visibility = 'visible';

                if (promptTextarea) { // Assicurati che promptTextarea sia definito
                    const currentTemplateForLang = generatePromptTemplate(STRINGS.sections);
                    if (promptTextarea.value.trim() === "" ||
                        !promptTextarea.value.includes(STRINGS.sections[0].header) || // Controllo più generico basato sulla prima intestazione
                        promptTextarea.value.length < currentTemplateForLang.length / 2 ) { // Se troppo corto
                       promptTextarea.value = currentTemplateForLang;
                    }
                    promptTextarea.focus();
                    promptTextarea.scrollTop = 0;
                }
            });

            if (!inputInfo.container || !(inputInfo.container instanceof Element)) {
                 console.error("Gemini PROmpt editor: inputInfo.container non è un Elemento valido.", inputInfo.container);
                return;
            }
            const inputButtonsWrapperBottom = inputInfo.container.querySelector('div.input-buttons-wrapper-bottom');
            if (inputButtonsWrapperBottom) {
                const micButtonContainer = inputButtonsWrapperBottom.querySelector('div.mic-button-container');
                if (micButtonContainer) inputButtonsWrapperBottom.insertBefore(editorButton, micButtonContainer);
                else inputButtonsWrapperBottom.prepend(editorButton);
            } else {
                const trailingActionsWrapper = inputInfo.container.querySelector('div.trailing-actions-wrapper');
                if (trailingActionsWrapper) trailingActionsWrapper.prepend(editorButton);
                else {
                    const leadingActionsWrapper = inputInfo.container.querySelector('div.leading-actions-wrapper');
                    if (leadingActionsWrapper) {
                        const uploaderContainer = leadingActionsWrapper.querySelector('div.uploader-button-container');
                        if (uploaderContainer) leadingActionsWrapper.insertBefore(editorButton, uploaderContainer);
                        else leadingActionsWrapper.prepend(editorButton);
                    } else {
                        const mainInputArea = inputInfo.input.closest('.text-input-field-main-area');
                        if (mainInputArea) mainInputArea.appendChild(editorButton);
                        else inputInfo.container.appendChild(editorButton);
                    }
                }
            }
        }
    }

    // --- INIZIALIZZAZIONE ---
    console.log(`Gemini PROmpt editor: Script v${GM_info.script.version} avviato. Lingua: ${currentLang.toUpperCase()}`);
    const observer = new MutationObserver(() => {
        if (!document.getElementById('promptEditorButton')) addOpenEditorButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('load', () => {
        setTimeout(() => { if (!document.getElementById('promptEditorButton')) addOpenEditorButton(); }, 3000);
    });
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(positionModal, 100);
    });

})();