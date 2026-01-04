// ==UserScript==
// @name         Herramientas Wazeopedia utilizable
// @namespace    http://tampermonkey.net/
// @version      3.1.4
// @description  Añade botones y herramientas para la edición en Wazeopedia desde el foro de Waze (Discourse).
// @author       Annthizze & Gemini
// @match        https://www.waze.com/discuss/*
// @grant        GM_addStyle
// @grant        GM_info
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538279/Herramientas%20Wazeopedia%20utilizable.user.js
// @updateURL https://update.greasyfork.org/scripts/538279/Herramientas%20Wazeopedia%20utilizable.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- ESTRUCTURA DE DATOS PARA PLANTILLAS DE TOC ---
    const tocTemplates = {
        laneGuidance: {
            title: "GUIAS DE CARRIL",
            structure: ["1. Introducción", "2. Trabajando con guías de carril", "2.1. Creación", "2.2. Asignación de carriles", "2.3. Modificación de giros", "2.4. Instrucciones proporcionadas por Waze", "2.5. Instrucciones forzadas de giro", "3. Criterios para utilizar la guía de carril", "3.1. Autopistas y autovías", "3.2. Vías de servicio", "3.3. Carreteras", "3.4. Vías urbanas", "4. Dónde no utilizar una guía de carril", "5. Otras consideraciones", "6. Biografía y Enlaces", "7. Foro de discusión"]
        },
        tolls: {
            title: "PEAJES",
            structure: ["1. Introducción", "2. Restricciones en la edición de peajes", "3. Navegación y Penalizaciones por Peajes", "4. Gestión y Precios de Peajes", "5. Preguntas Frecuentes", "6. Biografía y Enlaces", "7. Foro de discusión"]
        },
        levelCrossings: {
            title: "PASOS A NIVEL",
            structure: ["1. Introducción", "2. Cómo funciona", "3. Mapeando pasos a nivel", "4. Consideraciones a tener en cuenta", "5. Preguntas Frecuentes", "6. Biografía y Enlaces", "7. Foro de discusión"]
        },
        chargingStations: {
            title: "ESTACIONES DE CARGA",
            structure: ["1. Introducción", "2. Características de los puntos de carga", "3. Cómo manejamos los PURs", "3.1. Qué información debemos verificar:", "3.2. Cómo resolvemos los problemas", "3.3. Cómo los nombramos", "4. Situaciones", "4.1. PUR en un lugar donde no existía el POI", "4.2. PUR en un lugar donde existía el POI", "4.3. PUR no está en la hoja", "4.4. Consideraciones a tener en cuenta", "5. Biografía y Enlaces", "6. Foro de discusión"]
        },
        gasStations: {
            title: "ESTACIONES DE GAS",
            structure: ["1. Introducción", "2. Trabajando con las estaciones de gas", "3. Consideraciones a tener en cuenta", "4. Creando nuevas estaciones de gas", "4.1. Qué información debemos verificar:", "4.2. Como las nombramos", "5. Editando estaciones de gas", "5.1. Establecer opciones", "5.1.1. General", "5.1.2. Más información", "5.2. Consideraciones a la hora de editar una estación de gas", "6. Biografía y Enlaces", "7. Foro de discusión"]
        }
    };

    // --- CONFIGURACIÓN DE BOTONES ---
    const buttonConfigs = [{
            id: 'wz-btn-toc',
            text: 'TOC',
            title: 'Mostrar guía de Tabla de Contenidos',
            action: showTocGuideModal
        },
        {
            id: 'wz-btn-hr',
            text: '---',
            title: 'Insertar línea horizontal',
            action: applyHrFormatting
        },
        {
            id: 'wz-btn-headings',
            text: 'H↕',
            title: 'Insertar Encabezado (H1-H6)',
            isDropdown: true,
            dropdownItems: [
                { text: 'H1', title: 'Insertar Encabezado de Nivel 1', action: (textarea) => applyHeadingFormatting(textarea, 1) },
                { text: 'H2', title: 'Insertar Encabezado de Nivel 2', action: (textarea) => applyHeadingFormatting(textarea, 2) },
                { text: 'H3', title: 'Insertar Encabezado de Nivel 3', action: (textarea) => applyHeadingFormatting(textarea, 3) },
                { text: 'H4', title: 'Insertar Encabezado de Nivel 4', action: (textarea) => applyHeadingFormatting(textarea, 4) },
                { text: 'H5', title: 'Insertar Encabezado de Nivel 5', action: (textarea) => applyHeadingFormatting(textarea, 5) },
                { text: 'H6', title: 'Insertar Encabezado de Nivel 6', action: (textarea) => applyHeadingFormatting(textarea, 6) },
            ]
        },
        {
            id: 'wz-btn-blocks-dropdown',
            text: '🧱 Bloques',
            title: 'Insertar bloques de contenido comunes',
            isDropdown: true,
            dropdownItems: [
                { text: '👑 Título y Estado', title: 'Insertar/Editar bloque de Título y Estado', action: showTitleConfigModal },
                { text: '📰 Introducción', title: 'Insertar/Editar bloque de Introducción', action: showIntroductionConfigModal },
                { text: '📜 Biografía', title: 'Insertar/Editar bloque de Biografía y Enlaces', action: showBiographyConfigModal },
                { text: '💬 Foro Discusión', title: 'Insertar/Actualizar bloque de Foro de Discusión', action: applyForumDiscussionFormatting },
                { isSeparator: true },
                { text: '❔ FAQs', title: 'Insertar/Editar bloque de Preguntas Frecuentes', action: showFaqConfigModal }
            ]
        }
    ];

    // --- ESTILOS CSS ---
    GM_addStyle(`
        /* --- ESTILOS GENERALES Y MODO CLARO --- */
        div.d-editor-button-bar, div.discourse-markdown-toolbar { display: flex !important; flex-wrap: wrap !important; padding-bottom: 5px !important; }
        .wz-button-container { display: inline-flex; flex-wrap: wrap; align-items: center; border-left: 1px solid #ddd; margin-left: 10px; padding-left: 10px; }
        .wz-custom-button { background-color: #32CD32; color: white; padding: 6px 12px; border: none; border-radius: 5px; cursor: pointer; font-size: 0.9em; font-weight: bold; text-shadow: 1px 1px 1px rgba(0,0,0,0.2); transition: background-color 0.2s ease; margin-left: 6px; margin-bottom: 5px; }
        .wz-custom-button:hover { background-color: #28a428; }
        .wz-button-container > .wz-custom-button:first-child, .wz-button-container > .wz-dropdown:first-child { margin-left: 0; }
        .wz-dropdown { position: relative; display: inline-block; margin-left: 6px; margin-bottom: 5px; }
        .wz-dropdown-content { display: none; position: absolute; background-color: #f9f9f9; min-width: 160px; box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2); z-index: 1001; border-radius: 4px; padding: 5px 0; top: 100%; left: 0; margin-top: 3px; }
        .wz-dropdown-content.wz-show { display: block; }
        .wz-dropdown-content button { color: black; padding: 8px 12px; text-decoration: none; display: block; width: 100%; text-align: left; background-color: transparent; border: none; cursor: pointer; font-size: 0.9em; }
        .wz-dropdown-content button:hover { background-color: #e9e9e9; }
        .wz-dropdown-content hr { margin: 4px 8px; border-color: #ddd; border-style: solid; border-width: 1px 0 0 0; }
        .wz-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 2000; }
        .wz-modal-content { background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); min-width: 400px; max-width: 700px; text-align: left; max-height: 80vh; display: flex; flex-direction: column; border: 1px solid #ccc; }
        .wz-modal-content h3 { margin-top: 0; margin-bottom: 15px; text-align: center; color: #333; }
        .wz-modal-content p { margin-bottom: 15px; font-size: 1em; color: #333; }
        .wz-modal-content label { display: block; margin-bottom: 5px; font-weight: bold; color: #444; }
        .wz-modal-content input[type="text"], .wz-modal-content textarea, .wz-modal-content select { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 10px; font-size: 0.9em; box-sizing: border-box; background-color: #fff; color: #222; }
        .wz-modal-content textarea { min-height: 60px; }
        .wz-modal-content .wz-checkbox-group { margin-bottom: 10px; display: flex; align-items: center; }
        .wz-modal-content .wz-checkbox-group input[type="checkbox"] { margin-right: 8px; }
        .wz-modal-content .wz-hidden-section { display: none; }
        .wz-modal-scrollable-content { overflow-y: auto; flex-grow: 1; padding-right: 10px; }
        .wz-modal-buttons { text-align: right; margin-top: 20px; padding-top:10px; border-top: 1px solid #eee;}
        .wz-modal-buttons button { padding: 8px 15px; margin-left: 10px; border-radius: 4px; border: 1px solid #ccc; cursor: pointer; font-size: 0.9em; }
        .wz-modal-buttons button.wz-confirm { background-color: #4CAF50; color: white; border-color: #4CAF50; }
        .wz-modal-buttons button.wz-cancel { background-color: #f44336; color: white; border-color: #f44336; }
        .wz-toc-guide-modal { position: fixed; top: 20px; right: 20px; width: 450px; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.25); z-index: 2100; display: flex; flex-direction: column; max-height: 90vh; }
        .wz-toc-guide-modal select { width: 100%; }
        #wz-toc-outline-display { background-color: #f4f4f4; border: 1px solid #ddd; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 0.9em; flex-grow: 1; overflow-y: auto; margin-top: 10px; min-height: 200px; }
        .wz-toc-item { padding: 4px 8px; border-radius: 3px; cursor: pointer; white-space: pre; }
        .wz-toc-item:hover { background-color: #d4edff; color: #004085; }
        #wz-toc-copy-feedback { color: green; font-style: italic; display: inline-block; margin-right: auto; }
        .wz-bio-entry details, .wz-faq-entry details { border: 1px solid #eee; border-radius: 4px; margin-bottom: 10px; }
        .wz-bio-entry summary, .wz-faq-entry summary { padding: 10px; background-color: #f9f9f9; cursor: pointer; font-weight: bold; border-radius: 3px 3px 0 0; color: #555; }
        .wz-bio-entry summary:hover, .wz-faq-entry summary:hover { background-color: #efefef; }
        .wz-bio-entry details[open] summary, .wz-faq-entry details[open] summary { background-color: #e0e0e0; }
        .wz-bio-entry .wz-bio-entry-content, .wz-faq-entry .wz-faq-entry-content { padding: 10px; border-top: 1px solid #eee; }
        .wz-bio-entry .wz-bio-remove-btn, .wz-faq-entry .wz-faq-remove-btn { background-color: #ff6b6b; color:white; border:none; padding: 5px 10px; border-radius:3px; cursor:pointer; float:right; margin-top: -5px; }
        .wz-bio-add-entry-btn, .wz-faq-add-entry-btn { display:block; margin: 10px auto 0; padding: 8px 15px; }
        .wz-bio-modal-error, .wz-title-modal-error, .wz-faq-modal-error { color: #D32F2F; font-size: 0.9em; text-align: center; margin-bottom: 10px; padding: 5px; border: 1px solid #ffcdd2; background-color: #ffebee; border-radius: 3px; }
        .wz-bio-preview-label, .wz-faq-preview-label { font-weight: bold; margin-top:10px; margin-bottom:3px; font-size:0.9em; color: #444;}
        .wz-bio-entry-preview, .wz-faq-entry-preview { margin-top: 5px; padding: 8px; background-color: #f0f0f0; color: #333; border: 1px dashed #ccc; border-radius: 4px; font-size: 0.9em; white-space: pre-wrap; word-wrap: break-word; min-height: 2em; }
        .wz-bio-entry-preview a, .wz-faq-entry-preview a { color: blue; text-decoration: underline; cursor: help; }

        /* --- ESTILOS MODO OSCURO --- */
        .wz-dark-mode .wz-button-container { border-left-color: #555; }
        .wz-dark-mode .wz-custom-button { background-color: #3a3a3a; color: #e0e0e0; border: 1px solid #555; text-shadow: none; }
        .wz-dark-mode .wz-custom-button:hover { background-color: #007bff; border-color: #007bff; color: white; }
        .wz-dark-mode .wz-modal-content, .wz-dark-mode .wz-toc-guide-modal { background-color: #2b2b2b; color: #e0e0e0; border: 1px solid #555; }
        .wz-dark-mode .wz-modal-content h3, .wz-dark-mode .wz-modal-content p, .wz-dark-mode .wz-modal-content label { color: #e0e0e0; }
        .wz-dark-mode .wz-modal-content input[type="text"], .wz-dark-mode .wz-modal-content textarea, .wz-dark-mode .wz-modal-content select, .wz-dark-mode .wz-toc-guide-modal select { background-color: #3a3a3a; color: #e0e0e0; border: 1px solid #666; }
        .wz-dark-mode .wz-modal-content input[type="text"]:focus, .wz-dark-mode .wz-modal-content textarea:focus, .wz-dark-mode .wz-modal-content select:focus { border-color: #007bff; box-shadow: 0 0 0 1px #007bff; }
        .wz-dark-mode .wz-modal-buttons { border-top-color: #444; }
        .wz-dark-mode .wz-modal-buttons button.wz-confirm { background-color: #007bff; border-color: #007bff; }
        .wz-dark-mode .wz-modal-buttons button.wz-cancel { background-color: #555; border-color: #555; color: #e0e0e0; }
        .wz-dark-mode .wz-dropdown-content { background-color: #3a3a3a; border: 1px solid #555; }
        .wz-dark-mode .wz-dropdown-content button { color: #e0e0e0; }
        .wz-dark-mode .wz-dropdown-content button:hover { background-color: #007bff; color: white; }
        .wz-dark-mode .wz-dropdown-content hr { border-color: #555; }
        .wz-dark-mode #wz-toc-outline-display { background-color: #3a3a3a; color: #e0e0e0; border-color: #555; }
        .wz-dark-mode .wz-toc-item:hover { background-color: #007bff; color: white; }
        .wz-dark-mode #wz-toc-copy-feedback { color: #28a745; }
        .wz-dark-mode .wz-bio-entry details, .wz-dark-mode .wz-faq-entry details { border-color: #444; }
        .wz-dark-mode .wz-bio-entry summary, .wz-dark-mode .wz-faq-entry summary { background-color: #3a3a3a; color: #e0e0e0; }
        .wz-dark-mode .wz-bio-entry summary:hover, .wz-dark-mode .wz-faq-entry summary:hover { background-color: #4a4a4a; }
        .wz-dark-mode .wz-bio-entry details[open] summary, .wz-dark-mode .wz-faq-entry details[open] summary { background-color: #007bff; color: white; }
        .wz-dark-mode .wz-bio-entry .wz-bio-entry-content, .wz-dark-mode .wz-faq-entry .wz-faq-entry-content { border-top-color: #444; }
        .wz-dark-mode .wz-bio-entry-preview, .wz-dark-mode .wz-faq-entry-preview { background-color: #3a3a3a; color: #e0e0e0; border-color: #555; }
        .wz-dark-mode .wz-bio-modal-error, .wz-dark-mode .wz-title-modal-error, .wz-dark-mode .wz-faq-modal-error { background-color: #5d3434; color: #ffcdd2; border-color: #8b4444; }
        .wz-dark-mode .wz-forum-update-modal-item { background-color: #3a3a3a; border-color: #555; }
        .wz-dark-mode .wz-forum-update-modal-item .label { color: #bbb; }
        .wz-dark-mode .wz-forum-update-modal-item .value { background-color: #2b2b2b; border-color: #555; }
    `);

    // --- Funciones de Modal General ---
    function showModal(message, type = 'alert', callback, isSubModal = false) {
        if (!isSubModal) closeAllModals();
        const overlay = document.createElement('div');
        overlay.className = 'wz-modal-overlay';
        if (isSubModal) overlay.style.zIndex = 2000 + document.querySelectorAll('.wz-modal-overlay').length;
        const content = document.createElement('div'); content.className = 'wz-modal-content';
        const messageP = document.createElement('p'); messageP.style.textAlign = 'center'; messageP.textContent = message; content.appendChild(messageP);
        const buttonsDiv = document.createElement('div'); buttonsDiv.className = 'wz-modal-buttons'; buttonsDiv.style.textAlign = 'center';
        if (type === 'confirm') {
            buttonsDiv.appendChild(createButton('Sí', 'wz-confirm', () => { closeAllModals(); if (callback) callback(true); }));
            buttonsDiv.appendChild(createButton('No', 'wz-cancel', () => { closeAllModals(); if (callback) callback(false); }));
        } else {
            buttonsDiv.appendChild(createButton('Aceptar', 'wz-confirm', () => { overlay.remove(); if (callback) callback(true); }));
        }
        content.appendChild(buttonsDiv); overlay.appendChild(content); document.body.appendChild(overlay);
        setupModalEscape(overlay, type, callback);
    }
    function createButton(text, className, onClick) {
        const button = document.createElement('button');
        button.textContent = text; button.className = className; button.onclick = onClick;
        return button;
    }
    function setupModalEscape(overlay, type, callback) {
        const escapeHandler = e => {
            if (e.key === 'Escape') {
                const allOverlays = document.querySelectorAll('.wz-modal-overlay, .wz-toc-guide-modal-overlay');
                let maxZ = 0; allOverlays.forEach(ov => maxZ = Math.max(maxZ, parseInt(getComputedStyle(ov).zIndex) || 0));
                const overlayZ = parseInt(getComputedStyle(overlay).zIndex) || 0;
                if (overlayZ < maxZ) return;
                closeAllModals();
                if (type === 'confirm' && callback) callback(false); else if (type === 'form' && callback) callback(false); else if (callback) callback(true);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        overlay.tabIndex = -1; overlay.focus(); document.addEventListener('keydown', escapeHandler, { once: true });
    }
    function closeAllModals() {
        document.querySelectorAll('.wz-modal-overlay, .wz-toc-guide-modal').forEach(modal => modal.remove());
        const tocOverlay = document.getElementById('wz-toc-guide-overlay');
        if (tocOverlay) tocOverlay.remove();
    }

    // --- Funciones Principales del Script ---
    function insertTextAtCursor(textarea, text, cursorOffsetInfo = false) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const textBefore = textarea.value.substring(0, start);
        const textAfter = textarea.value.substring(end);
        textarea.value = textBefore + text + textAfter;
        if (cursorOffsetInfo && typeof cursorOffsetInfo.position === 'number') {
            const finalPos = start + cursorOffsetInfo.position;
            textarea.selectionStart = textarea.selectionEnd = finalPos;
        } else if (cursorOffsetInfo === false) {
            textarea.selectionStart = start;
            textarea.selectionEnd = start + text.length;
        } else {
            textarea.selectionStart = textarea.selectionEnd = start + text.length;
        }
        textarea.focus();
        textarea.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
    }
    function ensureProperSpacing(currentText, newBlockText, position, relativeBlockData) {
        let before = "", after = "", middle = newBlockText;
        const twoNewlines = "\n\n";
        switch (position) {
            case 'start':
                before = ""; after = currentText;
                if (after.trim().length > 0 && !middle.endsWith(twoNewlines) && !after.startsWith("\n")) { middle += (middle.endsWith("\n") ? "\n" : twoNewlines); }
                else if (after.trim().length > 0 && middle.endsWith("\n") && !middle.endsWith(twoNewlines) && !after.startsWith("\n")){ middle += "\n"; }
                break;
            case 'end':
                before = currentText; after = "";
                if (before.trim().length > 0 && !middle.startsWith(twoNewlines) && !before.endsWith("\n")) { middle = (before.endsWith("\n") ? "\n" : twoNewlines) + middle; }
                else if (before.trim().length > 0 && !middle.startsWith(twoNewlines) && before.endsWith("\n") && !before.endsWith(twoNewlines) ){ middle = "\n" + middle; }
                break;
            case 'afterRelative':
                if (!relativeBlockData) return ensureProperSpacing(currentText, newBlockText, 'start');
                before = currentText.substring(0, relativeBlockData.endIndex);
                after = currentText.substring(relativeBlockData.endIndex);
                if (!before.endsWith(twoNewlines) && !before.endsWith("\n")) middle = twoNewlines + middle;
                else if (before.endsWith("\n") && !before.endsWith(twoNewlines) && !middle.startsWith("\n")) middle = "\n" + middle;
                if (after.trim().length > 0 && !middle.endsWith(twoNewlines) && !after.startsWith("\n")) { middle += (middle.endsWith("\n") ? "\n" : twoNewlines); }
                else if (after.trim().length > 0 && middle.endsWith("\n") && !middle.endsWith(twoNewlines) && !after.startsWith("\n")){ middle += "\n"; }
                break;
            case 'beforeRelative':
                 if (!relativeBlockData) return ensureProperSpacing(currentText, newBlockText, 'end');
                 before = currentText.substring(0, relativeBlockData.startIndex);
                 after = currentText.substring(relativeBlockData.startIndex);
                 if (before.trim().length > 0 && !middle.startsWith(twoNewlines) && !before.endsWith("\n")) { middle = (before.endsWith("\n") ? "\n" : twoNewlines) + middle; }
                 else if (before.trim().length > 0 && !middle.startsWith(twoNewlines) && before.endsWith("\n") && !before.endsWith(twoNewlines) ){ middle = "\n" + middle; }
                 if (!middle.endsWith(twoNewlines) && !after.startsWith("\n")) { middle += (middle.endsWith("\n") ? "\n" : twoNewlines); }
                 else if (middle.endsWith("\n") && !middle.endsWith(twoNewlines) && !after.startsWith("\n")){ middle += "\n"; }
                 break;
            default: return { textToInsert: newBlockText.trim(), cursorPosition: newBlockText.trim().length };
        }
        return { textToInsert: before + middle + after, cursorPosition: (before + middle).length };
    }
    function applyHeadingFormatting(textarea, level, text = '') {
        const selectedText = text || textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
        const markdownPrefix = '#'.repeat(level) + ' ';
        const wzhTagOpen = `[wzh=${level}]`; const wzhTagClose = `[/wzh]`;
        let coreText = selectedText ? `${markdownPrefix}${wzhTagOpen}${selectedText}${wzhTagClose}` : `${markdownPrefix}${wzhTagOpen}${wzhTagClose}`;
        const textBeforeSelection = textarea.value.substring(0, textarea.selectionStart);
        let prefix = "";
        if (textarea.selectionStart > 0 && !textBeforeSelection.endsWith("\n\n") && !textBeforeSelection.endsWith("\n")) { prefix = "\n\n"; }
        else if (textarea.selectionStart > 0 && textBeforeSelection.endsWith("\n") && !textBeforeSelection.endsWith("\n\n")) { prefix = "\n"; }
        let textToInsert = prefix + coreText;
        const cursorPosition = selectedText ? textToInsert.length : (prefix + markdownPrefix + wzhTagOpen).length;
        insertTextAtCursor(textarea, textToInsert, { position: cursorPosition });
    }
    function applyHrFormatting(textarea) {
        let textToInsert = "\n---\n";
        const textBefore = textarea.value.substring(0, textarea.selectionStart);
        if (textBefore.trim() === '') { textToInsert = "---\n\n"; }
        else if (!textBefore.endsWith('\n\n')) { textToInsert = (textBefore.endsWith('\n') ? '\n' : '\n\n') + '---'; }
        else { textToInsert = '---'; }
        const textAfter = textarea.value.substring(textarea.selectionEnd);
        if (textAfter.trim() === '') { textToInsert += '\n'; }
        else if (!textAfter.startsWith('\n\n')) { textToInsert += (textAfter.startsWith('\n') ? '\n' : '\n\n'); }
        insertTextAtCursor(textarea, textToInsert, { position: textToInsert.length });
    }

    // --- Lógica para Guía de Plantillas TOC ---
    function formatLineAsHeader(line) {
        if (!line.trim()) return "";
        const text = line.replace(/^[\d\.]+\s*/, '').trim();
        const numberMatch = line.match(/^([\d\.]+)/);
        const level = numberMatch ? (numberMatch[1].match(/\d+/g) || []).length : 1;
        const markdownPrefix = '#'.repeat(level) + ' ';
        return `${markdownPrefix}[wzh=${level}]${text}[/wzh]`;
    }
    function showTocGuideModal() {
        if (document.getElementById('wz-toc-guide-modal')) return;
        const modal = document.createElement('div');
        modal.className = 'wz-toc-guide-modal';
        modal.id = 'wz-toc-guide-modal';
        const title = document.createElement('h3');
        title.textContent = 'Guía de Plantillas TOC';
        const selectLabel = document.createElement('label');
        selectLabel.textContent = 'Selecciona un modelo de contenido:';
        selectLabel.htmlFor = 'wz-toc-template-select';
        const select = document.createElement('select');
        select.id = 'wz-toc-template-select';
        Object.keys(tocTemplates).forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = tocTemplates[key].title;
            select.appendChild(option);
        });
        const display = document.createElement('div');
        display.id = 'wz-toc-outline-display';
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'wz-modal-buttons';
        const copyFeedback = document.createElement('span');
        copyFeedback.id = 'wz-toc-copy-feedback';
        const copyBtn = createButton('Copiar Esquema', 'wz-confirm', () => {
            const selectedKey = select.value;
            const template = tocTemplates[selectedKey];
            if (!template) return;
            const textToCopy = template.structure.map(formatLineAsHeader).join('\n\n');
            const tempTextarea = document.createElement('textarea');
            tempTextarea.style.position = 'absolute'; tempTextarea.style.left = '-9999px';
            tempTextarea.value = textToCopy;
            document.body.appendChild(tempTextarea);
            tempTextarea.select();
            document.execCommand('copy');
            document.body.removeChild(tempTextarea);
            copyFeedback.textContent = '¡Esquema copiado!';
            setTimeout(() => { copyFeedback.textContent = ''; }, 2500);
        });
        const closeBtn = createButton('Cerrar', 'wz-cancel', () => modal.remove());
        buttonsDiv.append(copyFeedback, copyBtn, closeBtn);
        modal.append(title, selectLabel, select, display, buttonsDiv);
        document.body.appendChild(modal);

        const formatTocOutlineForDisplay = (structure) => {
            display.innerHTML = '';
            const textarea = document.querySelector('textarea.d-editor-input, #reply-control textarea, .composer-container textarea');
            structure.forEach(line => {
                const numberMatch = line.match(/^([\d\.]+)/);
                if (!numberMatch) return;
                const level = (numberMatch[1].match(/\d+/g) || []).length;
                const indent = '&nbsp;&nbsp;'.repeat(Math.max(0, level - 1));
                const item = document.createElement('div');
                item.className = 'wz-toc-item';
                item.innerHTML = indent + line;
                item.addEventListener('click', () => {
                    if (textarea) {
                        const headerText = line.replace(/^[\d\.]+\s*/, '').trim();
                        applyHeadingFormatting(textarea, level, headerText);
                    }
                });
                display.appendChild(item);
            });
        };
        const updateDisplay = () => {
            const template = tocTemplates[select.value];
            if (template) { formatTocOutlineForDisplay(template.structure); }
        };
        select.addEventListener('change', updateDisplay);
        updateDisplay();
        select.focus();

        const editorObserver = new MutationObserver(() => {
            if (!document.querySelector('div.d-editor-button-bar, div.discourse-markdown-toolbar, .editor-toolbar')) {
                modal.remove();
                editorObserver.disconnect();
            }
        });
        editorObserver.observe(document.body, { childList: true, subtree: true });
    }

    // --- Lógica de Bloque de Foro ---
    const FORUM_BLOCK_IDENTIFIER = "# [wzh=1]Foro de discusión:[/wzh]";
    const FORUM_BLOCK_IMAGE = "[center]![image|128x128, 50%](upload://2cmYNNfUCAykbh8vW92usPC9Sf3.png)[/center]";
    const FORUM_BLOCK_REGEX_STR = `(?:^|\\n)---` + `\\s*${FORUM_BLOCK_IMAGE.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}` + `\\s*${FORUM_BLOCK_IDENTIFIER.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}` + `[\\s\\S]*?` + `href="https://www\\.waze\\.com/discuss/new-topic\\?category=spain-usuarios-y-editores/wazeopedia-es/4779[^"]*">→aquí←</a>`;
    function getForumBlockRegex() { return new RegExp(FORUM_BLOCK_REGEX_STR, 'm'); }
    function generateBodyContentAndTitleParams(cleanedPostTitleForDisplay) {
        const isEditing = window.location.href.includes('/t/');
        let linkUrl = isEditing ? window.location.href : `https://www.waze.com/discuss/t/${cleanedPostTitleForDisplay.toLowerCase().replace(/\s+/g, '-').replace(/-+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
        const markdownEscapedPostTitle = cleanedPostTitleForDisplay.replace(/([\[\]\(\)])/g, '\\$1');
        return { bodyContentText: `[${markdownEscapedPostTitle}](${linkUrl})`, urlEncodedTitleForNewTopic: encodeURIComponent(cleanedPostTitleForDisplay) };
    }
    function generateFullForumBlock(_, bodyContentTextForTemplate, urlEncodedNewTopicTitle) {
        const bodyParamUnencoded = `Hola editores,\n\nHe leído la información en la Wazeopedia y me gustaría hacer una sugerencia o proponer un cambio relacionado con la información contenida en la pagina de ${bodyContentTextForTemplate}. A continuación detallaré mi idea, error o modificación:\n\n< Pon aquí tu sugerencia, error o cambio >`;
        return `---
${FORUM_BLOCK_IMAGE}
${FORUM_BLOCK_IDENTIFIER}
Si observas cualquier tipo de error en la información aquí contenida, así como si deseas mejorarla o incluso solicitar algún tipo de cambio en los criterios para su uso, puedes informar en el foro correspondiente <a rel="nofollow" class="external text" href="https://www.waze.com/discuss/new-topic?category=spain-usuarios-y-editores/wazeopedia-es/4779&title=WAZO%20-%20${urlEncodedNewTopicTitle}&body=${encodeURIComponent(bodyParamUnencoded)}">→aquí←</a>`;
    }
    function showForumUpdateConfirmModal(textarea, existingBlockInfo, newParams, currentParams) {
        closeAllModals();
        const overlay = document.createElement('div'); overlay.className = 'wz-modal-overlay';
        const modalContent = document.createElement('div'); modalContent.className = 'wz-modal-content';
        let htmlContent = `<h3>Estado del Bloque de Discusión</h3><div class="wz-modal-scrollable-content">`;
        let needsUpdate = false;
        if (!existingBlockInfo) {
            htmlContent += `<p>El bloque 'Foro de discusión' no existe en el editor.</p>`;
        } else {
            const bodyContentMatches = currentParams.bodyContent === newParams.bodyContentText;
            htmlContent += `<div class="wz-forum-update-modal-item"><p><span class="status-icon ${bodyContentMatches ? 'wz-status-ok">✔️' : 'wz-status-mismatch">❌'}</span><span class="label">Contenido del enlace (cuerpo):</span></p>${!bodyContentMatches ? `<p><span class="label">Actual:</span> <span class="value">${currentParams.bodyContent || 'No encontrado'}</span></p>` : ''}<p><span class="label">Esperado:</span> <span class="value">${newParams.bodyContentText}</span></p></div>`;
            if (!bodyContentMatches) needsUpdate = true;
            const newTopicTitleMatches = currentParams.urlEncodedTitle === newParams.urlEncodedTitleForNewTopic;
            htmlContent += `<div class="wz-forum-update-modal-item"><p><span class="status-icon ${newTopicTitleMatches ? 'wz-status-ok">✔️' : 'wz-status-mismatch">❌'}</span><span class="label">Título para "Nuevo Tema":</span></p>${!newTopicTitleMatches ? `<p><span class="label">Actual:</span> <span class="value">${decodeURIComponent(currentParams.urlEncodedTitle || 'No encontrado')}</span></p>` : ''}<p><span class="label">Esperado:</span> <span class="value">${decodeURIComponent(newParams.urlEncodedTitleForNewTopic)}</span></p></div>`;
            if (!newTopicTitleMatches) needsUpdate = true;
            if (!needsUpdate) htmlContent += `<p style="text-align:center; color:green; margin-top:15px;">El bloque ya está actualizado.</p>`;
        }
        htmlContent += `</div>`;
        modalContent.innerHTML = htmlContent;
        const buttonsDiv = document.createElement('div'); buttonsDiv.className = 'wz-modal-buttons';
        if (!existingBlockInfo) {
            buttonsDiv.appendChild(createButton('Insertar Bloque', 'wz-confirm', () => {
                const fullBlock = generateFullForumBlock(newParams.cleanedPostTitleForDisplay, newParams.bodyContentText, newParams.urlEncodedTitleForNewTopic);
                const { textToInsert: finalContent, cursorPosition } = ensureProperSpacing(textarea.value, fullBlock, 'end');
                textarea.value = finalContent;
                textarea.selectionStart = textarea.selectionEnd = cursorPosition;
                textarea.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                closeAllModals();
            }));
        } else if (needsUpdate) {
            buttonsDiv.appendChild(createButton('Actualizar Bloque', 'wz-confirm', () => {
                const updatedFullBlock = generateFullForumBlock(newParams.cleanedPostTitleForDisplay, newParams.bodyContentText, newParams.urlEncodedTitleForNewTopic);
                textarea.value = textarea.value.substring(0, existingBlockInfo.startIndex) + updatedFullBlock + textarea.value.substring(existingBlockInfo.endIndex);
                textarea.selectionStart = textarea.selectionEnd = existingBlockInfo.startIndex + updatedFullBlock.length; textarea.focus();
                textarea.dispatchEvent(new Event('input', { bubbles: true, cancelable: true })); closeAllModals();
            }));
        } else {
            buttonsDiv.appendChild(createButton('Aceptar', 'wz-confirm', closeAllModals));
        }
        buttonsDiv.appendChild(createButton('Cancelar', 'wz-cancel', closeAllModals));
        modalContent.appendChild(buttonsDiv); overlay.appendChild(modalContent); document.body.appendChild(overlay);
        setupModalEscape(overlay, 'form', closeAllModals);
    }
    function applyForumDiscussionFormatting(textarea) {
        const titleInputElement = document.getElementById('reply-title');
        if (!titleInputElement) { showModal("Error: Campo de título #reply-title no encontrado.", 'alert'); return; }
        let postTitle = titleInputElement.value.trim();
        if (!postTitle) { showModal("Error: El título del post no puede estar vacío.", 'alert'); return; }
        const cleanedPostTitleForDisplay = postTitle.replace(/:[a-zA-Z0-9\_+-]+:/g, '').trim();
        if (!cleanedPostTitleForDisplay) { showModal("Error: Título (sin emojis) no puede estar vacío.", 'alert'); return; }
        const newGeneratedParams = { ...generateBodyContentAndTitleParams(cleanedPostTitleForDisplay), cleanedPostTitleForDisplay };
        const forumBlockRegex = getForumBlockRegex();
        const existingBlockMatch = textarea.value.match(forumBlockRegex);
        if (!existingBlockMatch) {
            const fullBlock = generateFullForumBlock(newGeneratedParams.cleanedPostTitleForDisplay, newGeneratedParams.bodyContentText, newGeneratedParams.urlEncodedTitleForNewTopic);
            const { textToInsert: finalContent, cursorPosition } = ensureProperSpacing(textarea.value, fullBlock, 'end', null);
            textarea.value = finalContent;
            textarea.selectionStart = textarea.selectionEnd = cursorPosition;
            textarea.focus();
            textarea.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
        } else {
            const existingBlockText = existingBlockMatch[0];
            const existingBlockInfo = { text: existingBlockText, startIndex: existingBlockMatch.index, endIndex: existingBlockMatch.index + existingBlockText.length };
            const bodyMatch = existingBlockText.match(/pagina de (\[.*?\]\(.*?\))/);
            const newTopicMatch = existingBlockText.match(/title=WAZO%20-%20([^&"]+)/);
            const currentParams = { bodyContent: (bodyMatch && bodyMatch[1]) || '', urlEncodedTitle: (newTopicMatch && newTopicMatch[1]) || '' };
            if (currentParams.bodyContent === newGeneratedParams.bodyContentText && currentParams.urlEncodedTitle === newGeneratedParams.urlEncodedTitleForNewTopic) {
                showModal("El bloque 'Foro de discusión' ya está actualizado.", 'alert');
            } else {
                showForumUpdateConfirmModal(textarea, existingBlockInfo, newGeneratedParams, currentParams);
            }
        }
    }

    // --- Lógica de Bloque de Introducción ---
    const INTRO_BLOCK_HEADER_FULL = "[center][wzh=0]![Info64x64|64x64](upload://1cG8aFsGrCONmfJ4R1Bzb5PP9Ia.png)[/wzh][/center]\n\n# [wzh=1]Introducción[/wzh]";
    const INTRO_NOTE_PREFIX = "> :bookmark: ";
    const INTRO_BLOCK_END_MARKER = "\n\n---";
    function parseExistingIntroductionBlock(editorText) {
        const fullHeaderSearchIndex = editorText.indexOf(INTRO_BLOCK_HEADER_FULL);
        if (fullHeaderSearchIndex === -1) return null;
        const contentStartAfterFullHeader = fullHeaderSearchIndex + INTRO_BLOCK_HEADER_FULL.length;
        if (!editorText.substring(contentStartAfterFullHeader).startsWith("\n\n")) return null;
        const actualMainTextStartIndex = contentStartAfterFullHeader + 2;
        let searchFrom = actualMainTextStartIndex;
        let endOfBlockIndex = -1;
        while (searchFrom < editorText.length) {
            const tempEndOfBlockIndex = editorText.indexOf(INTRO_BLOCK_END_MARKER, searchFrom);
            if (tempEndOfBlockIndex === -1) break;
            const potentialBlockContent = editorText.substring(actualMainTextStartIndex, tempEndOfBlockIndex);
            if (potentialBlockContent.indexOf(INTRO_BLOCK_HEADER_FULL) === -1) {
                endOfBlockIndex = tempEndOfBlockIndex;
                break;
            }
            searchFrom = editorText.indexOf(INTRO_BLOCK_HEADER_FULL, searchFrom) + INTRO_BLOCK_HEADER_FULL.length;
        }
        if (endOfBlockIndex === -1) return null;
        const blockContentBetween = editorText.substring(actualMainTextStartIndex, endOfBlockIndex);
        let mainText = blockContentBetween, noteText = "", additionalText = "", hasNote = false, hasAdditional = false;
        const noteBlockPattern = "\n\n" + INTRO_NOTE_PREFIX;
        const noteStartIndex = blockContentBetween.indexOf(noteBlockPattern);
        if (noteStartIndex !== -1) {
            hasNote = true;
            mainText = blockContentBetween.substring(0, noteStartIndex).trim();
            const afterNotePrefix = blockContentBetween.substring(noteStartIndex + noteBlockPattern.length);
            const additionalTextSeparator = "\n\n";
            const additionalTextIndex = afterNotePrefix.indexOf(additionalTextSeparator);
            if (additionalTextIndex !== -1) {
                noteText = afterNotePrefix.substring(0, additionalTextIndex).trim();
                additionalText = afterNotePrefix.substring(additionalTextIndex + additionalTextSeparator.length).trim();
                if (additionalText) hasAdditional = true;
            } else {
                noteText = afterNotePrefix.trim();
            }
        } else {
            mainText = blockContentBetween.trim();
        }
        return { mainText, noteText, additionalText, hasNote, hasAdditional, startIndex: fullHeaderSearchIndex, endIndex: endOfBlockIndex + INTRO_BLOCK_END_MARKER.length };
    }
    function showIntroductionConfigModal(textarea) {
        closeAllModals();
        const existingBlockData = parseExistingIntroductionBlock(textarea.value);
        const initialData = existingBlockData || { mainText: "", noteText: "", additionalText: "", hasNote: false, hasAdditional: false };
        const overlay = document.createElement('div'); overlay.className = 'wz-modal-overlay';
        const content = document.createElement('div'); content.className = 'wz-modal-content';
        content.innerHTML = `<h3>Configurar Bloque de Introducción</h3><div class="wz-modal-scrollable-content"><label for="wz-intro-main">Texto Principal:</label><textarea id="wz-intro-main"></textarea><div class="wz-checkbox-group"><input type="checkbox" id="wz-intro-add-note-check"><label for="wz-intro-add-note-check">Añadir nota</label></div><div id="wz-intro-note-section" class="wz-hidden-section"><label for="wz-intro-note">Texto de Nota (${INTRO_NOTE_PREFIX.trim()} se añadirá):</label><textarea id="wz-intro-note" placeholder="Ej: Edición limitada..."></textarea></div><div class="wz-checkbox-group"><input type="checkbox" id="wz-intro-add-additional-check"><label for="wz-intro-add-additional-check">Añadir texto adicional</label></div><div id="wz-intro-additional-section" class="wz-hidden-section"><label for="wz-intro-additional">Texto Adicional:</label><textarea id="wz-intro-additional"></textarea></div></div>`;
        const mainTextEl = content.querySelector('#wz-intro-main'), addNoteCheckEl = content.querySelector('#wz-intro-add-note-check'), noteSectionEl = content.querySelector('#wz-intro-note-section'), noteTextEl = content.querySelector('#wz-intro-note'), addAdditionalCheckEl = content.querySelector('#wz-intro-add-additional-check'), additionalSectionEl = content.querySelector('#wz-intro-additional-section'), additionalTextEl = content.querySelector('#wz-intro-additional');
        mainTextEl.value = initialData.mainText; noteTextEl.value = initialData.noteText; additionalTextEl.value = initialData.additionalText;
        addNoteCheckEl.checked = initialData.hasNote; if (initialData.hasNote) noteSectionEl.style.display = 'block'; addNoteCheckEl.onchange = () => noteSectionEl.style.display = addNoteCheckEl.checked ? 'block' : 'none';
        addAdditionalCheckEl.checked = initialData.hasAdditional; if (initialData.hasAdditional) additionalSectionEl.style.display = 'block'; addAdditionalCheckEl.onchange = () => additionalSectionEl.style.display = addAdditionalCheckEl.checked ? 'block' : 'none';
        const buttonsDiv = document.createElement('div'); buttonsDiv.className = 'wz-modal-buttons';
        const saveBtn = createButton(existingBlockData ? 'Actualizar Bloque' : 'Insertar Bloque', 'wz-confirm', () => {
            let blockParts = [INTRO_BLOCK_HEADER_FULL, "\n\n" + mainTextEl.value.trim()];
            if (addNoteCheckEl.checked) blockParts.push("\n\n" + INTRO_NOTE_PREFIX + noteTextEl.value.trim());
            if (addAdditionalCheckEl.checked) blockParts.push("\n\n" + additionalTextEl.value.trim());
            blockParts.push(INTRO_BLOCK_END_MARKER);
            const finalBlock = blockParts.join('');
            if (existingBlockData) {
                const textBefore = textarea.value.substring(0, existingBlockData.startIndex);
                const textAfter = textarea.value.substring(existingBlockData.endIndex);
                textarea.value = textBefore + finalBlock + textAfter;
            } else {
                const titleBlockData = parseExistingTitleBlock(textarea.value);
                const { textToInsert, cursorPosition } = ensureProperSpacing(textarea.value, finalBlock, titleBlockData ? 'afterRelative' : 'start', titleBlockData);
                textarea.value = textToInsert;
                textarea.selectionStart = textarea.selectionEnd = cursorPosition;
            }
            textarea.focus();
            textarea.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
            closeAllModals();
        });
        buttonsDiv.appendChild(createButton('Cancelar', 'wz-cancel', closeAllModals)); buttonsDiv.appendChild(saveBtn);
        content.querySelector('.wz-modal-scrollable-content').after(buttonsDiv);
        overlay.appendChild(content); document.body.appendChild(overlay);
        setupModalEscape(overlay, 'form', closeAllModals);
        setTimeout(() => mainTextEl.focus(), 100);
    }

    // --- Lógica de Bloque de Biografía ---
    const BIO_BLOCK_IMAGE_AND_HEADER = "[center][wzh=0]![image|128x128, 50%](upload://UTuWTJ1XEX6BVzoj1FIhLjAb6i.png)[/wzh][/center]\n\n# [wzh=2]Biografía y Enlaces[/wzh]";
    const MAX_BIO_ENTRIES = 15;
    function getBioEntryPrefix(dateText) {
        dateText = (dateText || "").trim();
        if (/^\d{1,2} de [a-zA-ZáéíóúÁÉÍÓÚñÑ]+ de \d{4}$/i.test(dateText)) return "* El ";
        if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+ de \d{4}$/i.test(dateText)) return "* En ";
        if (/^\d{4}$/.test(dateText)) return "* En el año ";
        return "* El ";
    }
    function parseExistingBiographyBlock(editorText) {
        const blockStartIndex = editorText.indexOf(BIO_BLOCK_IMAGE_AND_HEADER);
        if (blockStartIndex === -1) return null;
        const contentStartIndex = blockStartIndex + BIO_BLOCK_IMAGE_AND_HEADER.length;
        const nextBlockRegex = /(?:\n\n---|# \[wzh=[12]\]|Foro de discusión:)/;
        const nextBlockMatch = editorText.substring(contentStartIndex).match(nextBlockRegex);
        const endIndex = nextBlockMatch ? contentStartIndex + nextBlockMatch.index : editorText.length;
        const blockContent = editorText.substring(contentStartIndex, endIndex).trim();
        const entries = [];
        if (blockContent) {
            blockContent.split('\n').forEach(line => {
                if (!line.startsWith('* ')) return;
                const core = line.substring(2).trim();
                const linkMatch = core.match(/^(?:El |En el año |En )?\[([^\]]+)\]\(([^)]+)\)\s*(.*)/);
                if (linkMatch) {
                    entries.push({ dateText: linkMatch[1], url: linkMatch[2], description: linkMatch[3].replace(/\.$/, '') });
                } else {
                    entries.push({ dateText: '', url: '', description: core.replace(/\.$/, '') });
                }
            });
        }
        return { entries, startIndex: blockStartIndex, endIndex };
    }
    function updateBioEntryPreview(dateInput, urlInput, descInput, previewElement) {
        const dateText = dateInput.value.trim(); const url = urlInput.value.trim(); const description = descInput.value.trim();
        const prefix = getBioEntryPrefix(dateText);
        let descWithPeriod = description; if (descWithPeriod && !/[.!?]$/.test(descWithPeriod)) descWithPeriod += '.';
        previewElement.innerHTML = `* ${prefix.substring(2)}${url ? `[<a href="#" onclick="return false;">${dateText || 'Fecha'}</a>]` : dateText}${description ? ' ' + descWithPeriod : '.'}`;
    }
    function createBioEntryElement(entry = { dateText: '', url: '', description: '' }, index, container) {
        const details = document.createElement('details'); details.className = 'wz-bio-entry'; details.name = 'bio-accordion';
        const summary = document.createElement('summary'); summary.appendChild(document.createTextNode(entry.dateText || `Entrada ${index + 1}`));
        const contentDiv = document.createElement('div'); contentDiv.className = 'wz-bio-entry-content';
        contentDiv.innerHTML = `<label>Fecha (texto):</label><input type="text" class="wz-bio-date" placeholder="Ej: 25 de agosto de 2024" value="${entry.dateText}"><label>URL (opcional):</label><input type="text" class="wz-bio-url" placeholder="https://ejemplo.com" value="${entry.url}"><label>Descripción:</label><textarea class="wz-bio-desc">${entry.description}</textarea><div class="wz-bio-preview-label">Previsualización:</div><div class="wz-bio-entry-preview"></div>`;
        const removeBtn = createButton('Eliminar', 'wz-bio-remove-btn', () => { details.remove(); updateBioSummaries(container); });
        summary.appendChild(removeBtn);
        details.append(summary, contentDiv);
        const dateInput = contentDiv.querySelector('.wz-bio-date'), urlInput = contentDiv.querySelector('.wz-bio-url'), descInput = contentDiv.querySelector('.wz-bio-desc'), preview = contentDiv.querySelector('.wz-bio-entry-preview');
        const updateFn = () => {
            updateBioEntryPreview(dateInput, urlInput, descInput, preview);
            summary.firstChild.textContent = dateInput.value.trim() || `Entrada ${Array.from(container.children).indexOf(details) + 1}`;
        };
        [dateInput, urlInput, descInput].forEach(el => el.addEventListener('input', updateFn));
        updateFn();
        return details;
    }
    function updateBioSummaries(container) {
        container.querySelectorAll('details.wz-bio-entry').forEach((details, idx) => {
            const dateInput = details.querySelector('.wz-bio-date');
            details.querySelector('summary').firstChild.textContent = dateInput.value.trim() || `Entrada ${idx + 1}`;
        });
    }
    function showBiographyConfigModal(textarea) {
        closeAllModals();
        const existingBlock = parseExistingBiographyBlock(textarea.value);
        let entries = existingBlock ? existingBlock.entries : [{ dateText: '', url: '', description: '' }];
        const overlay = document.createElement('div'); overlay.className = 'wz-modal-overlay';
        const modalContent = document.createElement('div'); modalContent.className = 'wz-modal-content';
        modalContent.innerHTML = `<h3>Configurar Biografía y Enlaces</h3><div class="wz-bio-modal-error" style="display:none;"></div><div class="wz-modal-scrollable-content"><div id="wz-bio-entry-list"></div></div>`;
        const errorDiv = modalContent.querySelector('.wz-bio-modal-error'), entryList = modalContent.querySelector('#wz-bio-entry-list');
        entries.forEach((entry, i) => entryList.appendChild(createBioEntryElement(entry, i, entryList)));
        const addBtn = createButton('Añadir Entrada', 'wz-bio-add-entry-btn wz-confirm', () => {
            if (entryList.children.length < MAX_BIO_ENTRIES) {
                const newEl = createBioEntryElement(undefined, entryList.children.length, entryList);
                entryList.appendChild(newEl);
                newEl.open = true;
                newEl.scrollIntoView({ behavior: 'smooth' });
            } else { errorDiv.textContent = `Máximo ${MAX_BIO_ENTRIES} entradas.`; errorDiv.style.display = 'block'; }
        });
        modalContent.querySelector('.wz-modal-scrollable-content').appendChild(addBtn);
        const buttonsDiv = document.createElement('div'); buttonsDiv.className = 'wz-modal-buttons';
        const saveButton = createButton(existingBlock ? 'Actualizar Bloque' : 'Insertar Bloque', 'wz-confirm', () => {
            let bioContent = BIO_BLOCK_IMAGE_AND_HEADER;
            const currentEntries = Array.from(entryList.querySelectorAll('.wz-bio-entry')).map(el => ({ dateText: el.querySelector('.wz-bio-date').value.trim(), url: el.querySelector('.wz-bio-url').value.trim(), description: el.querySelector('.wz-bio-desc').value.trim() }));
            if (currentEntries.every(e => !e.dateText && !e.url && !e.description)) {
                 if (existingBlock) {
                    showModal("¿Eliminar bloque de biografía vacío?", "confirm", confirmed => {
                        if (confirmed) { textarea.value = textarea.value.substring(0, existingBlock.startIndex) + textarea.value.substring(existingBlock.endIndex); closeAllModals(); }
                    }, true);
                }
                return;
            }
            currentEntries.forEach(entry => {
                if (!entry.dateText && !entry.description) return;
                const prefix = getBioEntryPrefix(entry.dateText);
                const link = entry.url ? `[${entry.dateText}](${entry.url})` : entry.dateText;
                let desc = entry.description; if (desc && !/[.!?]$/.test(desc)) desc += '.';
                bioContent += `\n${prefix}${link}${desc ? ' ' + desc : '.'}`;
            });
            if (existingBlock) {
                textarea.value = textarea.value.substring(0, existingBlock.startIndex) + bioContent + textarea.value.substring(existingBlock.endIndex);
            } else {
                const { textToInsert, cursorPosition } = ensureProperSpacing(textarea.value, bioContent, 'end');
                textarea.value = textToInsert;
                textarea.selectionStart = textarea.selectionEnd = cursorPosition;
            }
            closeAllModals();
        });
        buttonsDiv.append(createButton('Cancelar', 'wz-cancel', closeAllModals), saveButton);
        modalContent.appendChild(buttonsDiv);
        overlay.appendChild(modalContent);
        document.body.appendChild(overlay);
        setupModalEscape(overlay, 'form', closeAllModals);
    }

    // --- Lógica de Bloque de FAQs (NUEVO v3.1.0) ---
    const FAQ_BLOCK_HEADER = "# [wzh=1]Preguntas Frecuentes[/wzh]";
    const FAQ_BLOCK_REGEX = /(?:^|\n)---\s*\n+# \[wzh=1\]Preguntas Frecuentes\[\/wzh\]\s*\n+([\s\S]*?)\n+---\s*(?:\n|$)/;
    function parseExistingFaqBlock(editorText) {
        const match = editorText.match(FAQ_BLOCK_REGEX);
        if (!match) return null;
        const content = match[1];
        const entries = [];
        const questionRegex = /\*\*🔹 (.*?)\*\*\s*\n(.*?)(?=\n\n\*\*🔹|$(?![\r\n]))/gs;
        let qaMatch;
        while ((qaMatch = questionRegex.exec(content)) !== null) {
            entries.push({
                question: qaMatch[1].trim(),
                answer: qaMatch[2].trim()
            });
        }
        return {
            entries,
            startIndex: match.index === 0 ? 0 : match.index + 1,
            endIndex: match.index === 0 ? match[0].length : match.index + match[0].length,
        };
    }
    function updateFaqEntryPreview(questionInput, answerInput, previewElement) {
        const question = questionInput.value.trim();
        const answer = answerInput.value.trim();
        previewElement.innerHTML = `<strong>🔹 ${question || 'Pregunta'}</strong><br>${answer || 'Respuesta...'}`;
    }
    function createFaqEntryElement(entry = { question: '', answer: '' }, index, container) {
        const details = document.createElement('details');
        details.className = 'wz-faq-entry';
        details.name = 'faq-accordion';
        const summary = document.createElement('summary');
        summary.textContent = entry.question || `FAQ #${index + 1}`;
        const contentDiv = document.createElement('div');
        contentDiv.className = 'wz-faq-entry-content';
        contentDiv.innerHTML = `
            <label>Pregunta:</label>
            <input type="text" class="wz-faq-question" placeholder="Escribe la pregunta..." value="${entry.question.replace(/"/g, '&quot;')}">
            <label>Respuesta:</label>
            <textarea class="wz-faq-answer" placeholder="Escribe la respuesta...">${entry.answer}</textarea>
            <div class="wz-faq-preview-label">Previsualización:</div>
            <div class="wz-faq-entry-preview"></div>
        `;
        const removeBtn = createButton('Eliminar', 'wz-faq-remove-btn', () => {
            details.remove();
            container.querySelectorAll('.wz-faq-entry summary').forEach((s, i) => {
                const qInput = s.nextElementSibling.querySelector('.wz-faq-question');
                if (!s.textContent.startsWith('FAQ #')) return;
                if (!qInput.value.trim()) s.textContent = `FAQ #${i + 1}`;
            });
        });
        summary.appendChild(removeBtn);
        details.append(summary, contentDiv);
        const questionInput = contentDiv.querySelector('.wz-faq-question');
        const answerInput = contentDiv.querySelector('.wz-faq-answer');
        const previewElement = contentDiv.querySelector('.wz-faq-entry-preview');
        const updateFn = () => {
            updateFaqEntryPreview(questionInput, answerInput, previewElement);
            summary.firstChild.textContent = questionInput.value.trim() || `FAQ #${Array.from(container.children).indexOf(details) + 1}`;
        };
        [questionInput, answerInput].forEach(el => el.addEventListener('input', updateFn));
        updateFn();
        return details;
    }
    function showFaqConfigModal(textarea) {
        closeAllModals();
        const existingBlock = parseExistingFaqBlock(textarea.value);
        const entries = existingBlock ? existingBlock.entries : [{ question: '', answer: '' }];
        const overlay = document.createElement('div');
        overlay.className = 'wz-modal-overlay';
        const modalContent = document.createElement('div');
        modalContent.className = 'wz-modal-content';
        modalContent.innerHTML = `<h3>Configurar Preguntas Frecuentes (FAQs)</h3><div class="wz-faq-modal-error" style="display:none;"></div><div class="wz-modal-scrollable-content"><div id="wz-faq-entry-list"></div></div>`;
        const errorDiv = modalContent.querySelector('.wz-faq-modal-error');
        const entryListContainer = modalContent.querySelector('#wz-faq-entry-list');
        entries.forEach((entry, index) => entryListContainer.appendChild(createFaqEntryElement(entry, index, entryListContainer)));
        const addBtn = createButton('Añadir FAQ', 'wz-faq-add-entry-btn wz-confirm', () => {
            const newFaq = createFaqEntryElement(undefined, entryListContainer.children.length, entryListContainer);
            entryListContainer.appendChild(newFaq);
            newFaq.open = true;
            newFaq.querySelector('.wz-faq-question').focus();
        });
        modalContent.querySelector('.wz-modal-scrollable-content').appendChild(addBtn);
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'wz-modal-buttons';
        const saveButton = createButton(existingBlock ? 'Actualizar Bloque' : 'Insertar Bloque', 'wz-confirm', () => {
            const faqEntries = Array.from(entryListContainer.querySelectorAll('.wz-faq-entry')).map(details => ({
                question: details.querySelector('.wz-faq-question').value.trim(),
                answer: details.querySelector('.wz-faq-answer').value.trim()
            })).filter(e => e.question && e.answer);

            if (faqEntries.length === 0) {
                if (existingBlock) {
                    showModal("No hay FAQs. ¿Eliminar bloque existente?", "confirm", confirmed => {
                        if (confirmed) {
                            textarea.value = textarea.value.substring(0, existingBlock.startIndex) + textarea.value.substring(existingBlock.endIndex);
                            closeAllModals();
                        }
                    }, true);
                } else {
                    errorDiv.textContent = "No hay entradas para guardar.";
                    errorDiv.style.display = 'block';
                }
                return;
            }

            let faqContent = faqEntries.map(e => `**🔹 ${e.question}**\n\n${e.answer}`).join('\n\n');
            let finalBlock = `---\n\n${FAQ_BLOCK_HEADER}\n\n${faqContent}\n\n---`;

            if (existingBlock) {
                textarea.value = textarea.value.substring(0, existingBlock.startIndex) + finalBlock + textarea.value.substring(existingBlock.endIndex);
            } else {
                const { textToInsert, cursorPosition } = ensureProperSpacing(textarea.value, finalBlock, 'end');
                textarea.value = textToInsert;
                textarea.selectionStart = textarea.selectionEnd = cursorPosition;
            }
            textarea.focus();
            closeAllModals();
        });
        buttonsDiv.append(createButton('Cancelar', 'wz-cancel', closeAllModals), saveButton);
        modalContent.appendChild(buttonsDiv);
        overlay.appendChild(modalContent);
        document.body.appendChild(overlay);
        setupModalEscape(overlay, 'form', closeAllModals);
    }

    // --- Lógica de Bloque de Título ---
    const TITLE_BLOCK_TOC_MARKER = "<div data-theme-toc=\"true\"> </div>";
    const TITLE_BLOCK_WZBOX_START = "[wzBox]";
    const TITLE_BLOCK_WZBOX_END = "[/wzBox]";
    const TITLE_BLOCK_IMAGE = "[center][wzh=0]![waze64x64|64x64](upload://jRTDuEOGZWkysIHHifIg9ce3nh0.png)[/wzh][/center]";
    const TITLE_STATUS_OPTIONS = {
        aprobado: { label: "Aprobado", text: "> :shield: [color=green]***Artículo aprobado y verificado***[/color]\nEl contenido de este artículo ha sido revisado y aprobado por los ![image|25x25, 100%](upload://vhFGhej3zdZALIqhbHknwTJ1JZk.png) **Champs** de la comunidad. La información aquí presentada es considerada oficial y fiable como guía de referencia." },
        pendiente: { label: "Pendiente de Aprobación", text: "> :hourglass_done: [color=blue]***Artículo pendiente de aprobación***[/color]\nEste artículo ha sido completado y está **pendiente de revisión y aprobación final** por parte de los ![image|25x25, 100%](upload://vhFGhej3zdZALIqhbHknwTJ1JZk.png) <b>Champs</b> de la comunidad. Mientras este mensaje esté visible, el contenido **no debe utilizarse como criterio definitivo**." },
        desarrollo: { label: "En Desarrollo", text: "> :construction: [color=orange]***Artículo en desarrollo***[/color]\nEste artículo está siendo creado o actualizado. La información podría estar incompleta o contener errores. Agradecemos tu paciencia. Si eres ![image|25x25](upload://wsHHONE4FYyBvMShtoQYLmFEJy8.png) **editor wiki**, puedes consultar el [→foro←]({{FORUM_URL}}) para colaborar en su desarrollo.", requiresUrl: true },
        incompleto: { label: "Incompleto", text: "> :puzzle_piece: [color=#FFC300]***Artículo incompleto***[/color]\nA este artículo le falta información relevante o secciones importantes. Si eres ![image|25x25](upload://wsHHONE4FYyBvMShtoQYLmFEJy8.png) <b>editor wiki</b>, por favor, dirígete al [→foro←](https://www.waze.com/discuss/c/editors/spain-usuarios-y-editores/wazeopedia-es/4779) para conocer los detalles y colaborar en su mejora." },
        deficiente: { label: "Deficiente", text: "> :chart_decreasing: [color=orangered]***Información deficiente en el artículo***[/color]\nEl contenido actual de este artículo ha sido señalado como deficiente. Puede contener imprecisiones, estar desactualizado, o carecer de la claridad o fuentes necesarias. Si eres ![image|25x25](upload://wsHHONE4FYyBvMShtoQYLmFEJy8.png) <b>editor wiki</b>, por favor, revisa el [→foro←](https://www.waze.com/discuss/c/editors/spain-usuarios-y-editores/wazeopedia-es/4779) para discutir y aplicar las mejoras necesarias." },
        borrar: { label: "Borrar", text: "> :wastebasket: [color=red]***Artículo pendiente de borrar***[/color]\nEste artículo ha sido marcado para su eliminación por los ![image|25x25, 100%](upload://vhFGhej3zdZALIqhbHknwTJ1JZk.png) **Administradores** de la Wazeopedia Española, generalmente por obsolescencia, contenido incorrecto, duplicidad o incumplimiento de directrices. Para más detalles o alegaciones, consulta el [→foro←](https://www.waze.com/discuss/c/editors/spain-usuarios-y-editores/wazeopedia-es/4779)" }
    };
    function parseExistingTitleBlock(editorText) {
        if (!editorText.startsWith(TITLE_BLOCK_TOC_MARKER)) return null;
        const wzBoxStartIndex = editorText.indexOf(TITLE_BLOCK_WZBOX_START);
        if (wzBoxStartIndex === -1) return null;
        const wzBoxEndIndex = editorText.indexOf(TITLE_BLOCK_WZBOX_END, wzBoxStartIndex);
        if (wzBoxEndIndex === -1) return null;
        const content = editorText.substring(wzBoxStartIndex + TITLE_BLOCK_WZBOX_START.length, wzBoxEndIndex);
        const titleMatch = content.match(/\[center\]\[wzh=1\](.*?)\[\/wzh\]\[\/center\]/);
        const title = titleMatch ? titleMatch[1].trim() : "";
        let statusKey = "aprobado", forumUrl = "";
        for (const key in TITLE_STATUS_OPTIONS) {
            if (content.includes(TITLE_STATUS_OPTIONS[key].text.split('***')[1])) {
                statusKey = key;
                if (TITLE_STATUS_OPTIONS[key].requiresUrl) {
                    const urlMatch = content.match(/\[→foro←\]\(([^)]+)\)/);
                    forumUrl = urlMatch ? urlMatch[1] : "";
                }
                break;
            }
        }
        return { title, statusKey, forumUrl, startIndex: 0, endIndex: wzBoxEndIndex + TITLE_BLOCK_WZBOX_END.length };
    }
    function showTitleConfigModal(textarea) {
        closeAllModals();
        const existingData = parseExistingTitleBlock(textarea.value);
        const initial = existingData || { title: "", statusKey: "aprobado", forumUrl: "" };
        const overlay = document.createElement('div'); overlay.className = 'wz-modal-overlay';
        const modalContent = document.createElement('div'); modalContent.className = 'wz-modal-content';
        modalContent.innerHTML = `<h3>Configurar Título y Estado</h3><div class="wz-modal-scrollable-content"><div class="wz-title-modal-error" style="display:none;"></div><label for="wz-title-main">Título Artículo:</label><input type="text" id="wz-title-main" value="${initial.title}"><label for="wz-title-status-select">Estado Artículo:</label><select id="wz-title-status-select">${Object.keys(TITLE_STATUS_OPTIONS).map(k => `<option value="${k}" ${initial.statusKey === k ? 'selected' : ''}>${TITLE_STATUS_OPTIONS[k].label}</option>`).join('')}</select><div id="wz-title-forum-url-section" style="display: ${TITLE_STATUS_OPTIONS[initial.statusKey]?.requiresUrl ? 'block' : 'none'};"><label for="wz-title-forum-url">URL Foro:</label><input type="text" id="wz-title-forum-url" placeholder="https://..." value="${initial.forumUrl}"></div></div>`;
        const errorDiv = modalContent.querySelector('.wz-title-modal-error'), titleInput = modalContent.querySelector('#wz-title-main'), statusSelect = modalContent.querySelector('#wz-title-status-select'), forumUrlSection = modalContent.querySelector('#wz-title-forum-url-section'), forumUrlInput = modalContent.querySelector('#wz-title-forum-url');
        statusSelect.onchange = () => forumUrlSection.style.display = TITLE_STATUS_OPTIONS[statusSelect.value]?.requiresUrl ? 'block' : 'none';
        const buttonsDiv = document.createElement('div'); buttonsDiv.className = 'wz-modal-buttons';
        const saveBtn = createButton(existingData ? 'Actualizar Bloque' : 'Insertar Bloque', 'wz-confirm', () => {
            const title = titleInput.value.trim(), statusKey = statusSelect.value, forumUrl = forumUrlInput.value.trim();
            if (!title) { errorDiv.textContent = "Título no puede estar vacío."; errorDiv.style.display = 'block'; return; }
            if (TITLE_STATUS_OPTIONS[statusKey]?.requiresUrl && !forumUrl) { errorDiv.textContent = 'URL de foro requerida.'; errorDiv.style.display = 'block'; return; }
            const statusText = TITLE_STATUS_OPTIONS[statusKey].text.replace("{{FORUM_URL}}", forumUrl);
            const newBlock = `${TITLE_BLOCK_TOC_MARKER}\n\n${TITLE_BLOCK_WZBOX_START}\n${TITLE_BLOCK_IMAGE}\n[center][wzh=1]${title}[/wzh][/center]\n\n${statusText}\n${TITLE_BLOCK_WZBOX_END}`;
            if (existingData) {
                textarea.value = newBlock + textarea.value.substring(existingData.endIndex);
            } else {
                const { textToInsert, cursorPosition } = ensureProperSpacing(textarea.value, newBlock, 'start');
                textarea.value = textToInsert;
                textarea.selectionStart = textarea.selectionEnd = cursorPosition;
            }
            closeAllModals();
        });
        buttonsDiv.append(createButton('Cancelar', 'wz-cancel', closeAllModals), saveBtn);
        modalContent.querySelector('.wz-modal-scrollable-content').after(buttonsDiv);
        overlay.appendChild(modalContent); document.body.appendChild(overlay);
        setupModalEscape(overlay, 'form', closeAllModals);
        setTimeout(() => titleInput.focus(), 100);
    }

    // --- Lógica de Desplegables ---
    function closeAllDropdowns() {
        document.querySelectorAll('.wz-dropdown-content.wz-show').forEach(dd => dd.classList.remove('wz-show'));
        document.removeEventListener('click', handleClickOutsideDropdowns);
    }
    function handleClickOutsideDropdowns(event) {
        if (!event.target.closest('.wz-dropdown')) closeAllDropdowns();
    }
    function toggleDropdown(buttonElement, dropdownContentElement) {
        const isCurrentlyShown = dropdownContentElement.classList.contains('wz-show');
        closeAllDropdowns();
        if (!isCurrentlyShown) {
            dropdownContentElement.classList.add('wz-show');
            setTimeout(() => document.addEventListener('click', handleClickOutsideDropdowns), 0);
        }
    }

    // --- Montaje de Botones ---
    function addCustomButtons() {
        const editorToolbar = document.querySelector('div.d-editor-button-bar, div.discourse-markdown-toolbar, .editor-toolbar');
        if (!editorToolbar) return;
        let buttonBarContainer = editorToolbar.querySelector('.wz-button-container');
        if (buttonBarContainer && buttonBarContainer.dataset.wzToolsProcessed === 'true') return;
        if (!buttonBarContainer) {
            buttonBarContainer = document.createElement('div');
            buttonBarContainer.className = 'wz-button-container';
            const lastGroup = Array.from(editorToolbar.children).filter(el => el.matches('.btn-group, button')).pop();
            if (lastGroup) lastGroup.insertAdjacentElement('afterend', buttonBarContainer); else editorToolbar.appendChild(buttonBarContainer);
        }
        buttonBarContainer.innerHTML = '';
        buttonBarContainer.dataset.wzToolsProcessed = 'true';
        const textarea = document.querySelector('textarea.d-editor-input, #reply-control textarea, .composer-container textarea');
        if (!textarea) return;
        buttonConfigs.forEach(config => {
            if (config.isDropdown) {
                const wrapper = document.createElement('div');
                wrapper.className = 'wz-dropdown';
                const btn = createButton(config.text, 'wz-custom-button btn wz-dropdown-toggle', e => { e.stopPropagation(); toggleDropdown(btn, content); });
                btn.id = config.id; btn.title = config.title;
                const content = document.createElement('div'); content.className = 'wz-dropdown-content';
                config.dropdownItems.forEach(item => {
                    if (item.isSeparator) {
                        const separator = document.createElement('hr');
                        separator.style.margin = '4px 8px';
                        separator.style.borderColor = '#ddd';
                        content.appendChild(separator);
                        return;
                    }
                    const ddBtn = createButton(item.text, '', e => {
                        e.stopPropagation();
                        if (typeof item.action === 'function') { item.action(textarea); }
                        closeAllDropdowns();
                    });
                    ddBtn.title = item.title || `Insertar ${item.text}`;
                    content.appendChild(ddBtn);
                });
                wrapper.append(btn, content);
                buttonBarContainer.appendChild(wrapper);
            } else {
                const btn = createButton(config.text, 'wz-custom-button btn', e => {
                    e.preventDefault(); e.stopPropagation();
                    if (typeof config.action === 'function') { config.action(textarea); }
                });
                btn.id = config.id; btn.title = config.title;
                buttonBarContainer.appendChild(btn);
            }
        });
    }

    // --- INICIALIZACIÓN Y GESTIÓN DEL TEMA ---
    function applyTheme() {
        const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.classList.toggle('wz-dark-mode', isDark);
    }

    const editorObserver = new MutationObserver(() => {
        if (document.querySelector('div.d-editor-button-bar, div.discourse-markdown-toolbar, .editor-toolbar') && !document.getElementById('wz-btn-toc')) {
            addCustomButtons();
            applyTheme();
        }
    });

    editorObserver.observe(document.body, { childList: true, subtree: true });
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
    addCustomButtons();
    applyTheme();

    console.log(`Herramientas Wazeopedia: Script cargado y observando (v${GM_info.script.version}).`);
})();
