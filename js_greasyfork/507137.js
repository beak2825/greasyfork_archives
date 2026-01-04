// ==UserScript==
// @name         WME Enhanced Actions
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Automate Waze editing tasks with shortcuts and streamlined actions.
// @author       Astheron
// @match        https://www.waze.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507137/WME%20Enhanced%20Actions.user.js
// @updateURL https://update.greasyfork.org/scripts/507137/WME%20Enhanced%20Actions.meta.js
// ==/UserScript==

/**
 * License and Credits:
 *
 * This script is licensed under the MIT License:
 * Copyright (c) 2024 Astheron
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this script and associated documentation files (the "Script"), to deal
 * in the Script without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Script, and to permit persons to whom the Script is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Script.
 *
 * THE SCRIPT IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SCRIPT OR THE USE OR OTHER DEALINGS IN THE
 * SCRIPT.
 *
 * **Contact:** For more details or inquiries, you can contact the author, Astheron, on the Waze forum.
 */

(function() {
    'use strict';

    let autoSaveEnabled = JSON.parse(localStorage.getItem('autoSaveEnabled')) || false;
    let saveKeyCombination = JSON.parse(localStorage.getItem('saveKeyCombination')) || [];
    let isRecording = false;

        function getEditorLanguage() {
        const url = window.location.href;
        if (url.includes('/es/')) {
            return 'es';
        } else if (url.includes('/ca/')) {
            return 'ca';
        }
        return 'en';
    }

    const lang = getEditorLanguage();
    const isSpanish = lang === 'es';
    const isCatalan = lang === 'ca';

    const translations = {
        en: {
            title: 'WME Enhanced Actions',
            setSaveKey: 'Set Save Shortcut:',
            saveHint: 'Use Ctrl, Alt, Shift with other keys.',
            recording: 'Waiting for assignment...',
            toggleRecording: 'Record',
            toggleRecordingOn: 'Recording: On',
            additionalFeatures: 'Features:',
            featureList: '<ul><li>Press Enter to quickly confirm actions.</li><li>Auto-save edits with a custom shortcut.</li><li>Streamline your workflow with automated tools.</li></ul>',
            about: 'About:',
            description: 'This script helps Waze editors automate tasks, assign shortcuts, and improve efficiency during map editing.',
            developedBy: 'Script developed by <a href="https://www.waze.com/user/editor/Astheron" target="_blank" style="color: #007BFF; text-decoration: none;">Astheron</a>. For questions, visit the forum: ',
            forumLink: 'https://www.waze.com/discuss/t/script-wme-enhanced-actions/304400'
        },
        es: {
            title: 'WME Enhanced Actions',
            setSaveKey: 'Configurar Atajo de Guardado Inteligente:',
            saveHint: 'Usa teclas o combinaciones con Ctrl, Alt, Shift y otras teclas.',
            recording: 'Esperando asignación...',
            toggleRecording: 'Grabar',
            toggleRecordingOn: 'Grabación: Encendido',
            additionalFeatures: 'Funciones:',
            featureList: '<ul><li>Presiona Enter para confirmar acciones rápidamente.</li><li>Guardado automático con un atajo personalizado.</li><li>Optimiza tu flujo de trabajo con herramientas automáticas.</li></ul>',
            about: 'Acerca de:',
            description: 'Este script ayuda a los editores de Waze a automatizar tareas, asignar atajos y mejorar la eficiencia durante la edición de mapas.',
            developedBy: 'Script programado por <a href="https://www.waze.com/user/editor/Astheron" target="_blank" style="color: #007BFF; text-decoration: none;">Astheron</a>. Para preguntas, visita el foro: ',
            forumLink: 'https://www.waze.com/discuss/t/script-wme-enhanced-actions/304400'
        },
        ca: {
            title: 'WME Enhanced Actions',
            setSaveKey: 'Configurar drecera de desament:',
            saveHint: 'Utilitza tecles o combinacions amb Ctrl, Alt, Shift i altres tecles.',
            recording: 'Esperant assignació...',
            toggleRecording: 'Enregistrar',
            toggleRecordingOn: 'Enregistrament: Activat',
            additionalFeatures: 'Funcions:',
            featureList: '<ul><li>Prem Enter per confirmar accions ràpidament.</li><li>Desament automàtic amb una drecera personalitzada.</li><li>Optimitza el teu flux de treball amb eines automàtiques.</li></ul>',
            about: 'Sobre:',
            description: 'Aquest script ajuda els editors de Waze a automatitzar tasques, assignar dreceres i millorar l`eficiència durant l`edició de mapes.',
            developedBy: 'Script desenvolupat per <a href="https://www.waze.com/user/editor/Astheron" target="_blank" style="color: #007BFF; text-decoration: none;">Astheron</a>. Per a preguntes, visita el fòrum: ',
            forumLink: 'https://www.waze.com/discuss/t/script-wme-enhanced-actions/304400'
        }
    };

    const t = isSpanish ? translations.es : isCatalan ? translations.ca : translations.en;

    function initializeSidebarTab() {
        const { tabLabel, tabPane } = W.userscripts.registerSidebarTab("enhanced-actions");

        tabLabel.innerText = t.title;
        tabLabel.title = 'Configure Auto Save and Shortcuts';

        tabPane.innerHTML = `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ccc; border-radius: 10px; background: linear-gradient(to right, #f9f9f9, #ffffff); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #007BFF; font-size: 2em; margin-bottom: 15px; text-align: center;">${t.title}</h2>

        <div style="margin-bottom: 25px; text-align: center;">
            <label for="saveKeyInput" style="font-weight: bold; font-size: 1.1em;">${t.setSaveKey}</label>
            <input type="text" id="saveKeyInput" readonly placeholder="Recording..."
                   style="width: 270px; padding: 10px; margin-top: 10px; margin-bottom: 10px; border: 2px solid #007BFF; border-radius: 5px; box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);">
            <button id="toggleRecordingButton" style="margin: 20px; padding: 10px 15px; background-color: #465d9c; color: white; border: none; border-radius: 5px; cursor: pointer; box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2); font-weight: bold; text-align: center;">${t.toggleRecording}</button>
            <p style="font-size: 0.9em; color: #555; margin: 20px 0;">${t.saveHint}</p>
        </div>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

        <h3 style="color: #007BFF; font-size: 1.4em; text-align: center;">${t.additionalFeatures}</h3>
        <div style="font-size: 1em; color: #444; margin: 20px;">
            ${t.featureList}
        </div>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

        <h3 style="color: #007BFF; font-size: 1.4em; text-align: center;">${t.about}</h3>
        <p style="font-size: 0.95em; color: #555; text-align: center; margin: 20px 0;">${t.description}</p>
        <p style="font-size: 0.8em; color: #555; text-align: center; margin: 20px 0;">${t.developedBy}<a href="${t.forumLink}" target="_blank" style="color: #007BFF; text-decoration: none;">Waze forum</a>.</p>
    </div>
`;

        const saveKeyInput = tabPane.querySelector('#saveKeyInput');
        const toggleRecordingButton = tabPane.querySelector('#toggleRecordingButton');

        saveKeyInput.value = saveKeyCombination.join('+');

        toggleRecordingButton.addEventListener('click', () => {
            if (!isRecording) {
                startRecordingKeyCombination(saveKeyInput, 'save');
                saveKeyInput.value = t.recording;
                toggleRecordingButton.textContent = t.toggleRecordingOn;
                toggleRecordingButton.style.backgroundColor = '#dc3545';
                isRecording = true;
            } else {
                stopRecordingKeyCombination(saveKeyInput, 'save');
                toggleRecordingButton.textContent = t.toggleRecording;
                toggleRecordingButton.style.backgroundColor = '#465d9c';
                isRecording = false;
            }
        });

        W.userscripts.waitForElementConnected(tabPane).then(() => {
            console.log("Enhanced Actions tab connected.");
        });
    }

    function startRecordingKeyCombination(inputField, type) {
        let combination = [];

        const keydownListener = (event) => {
            if (!isRecording) return;

            // Do not prevent default behavior for inputs, textareas, or wz-textarea elements
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.closest('wz-textarea')) {
                return;
            }

            event.preventDefault();

            let key = event.key;
            if (event.ctrlKey && !combination.includes('Ctrl')) {
                combination.push('Ctrl');
            }
            if (event.altKey && !combination.includes('Alt')) {
                combination.push('Alt');
            }
            if (event.shiftKey && !combination.includes('Shift')) {
                combination.push('Shift');
            }
            if (!['Control', 'Shift', 'Alt', 'Meta'].includes(key)) {
                combination.push(key);
            }

            inputField.value = combination.join('+');
        };

        document.addEventListener('keydown', keydownListener);
    }

    function stopRecordingKeyCombination(inputField, type) {
        document.removeEventListener('keydown', startRecordingKeyCombination);
        inputField.classList.remove('recording');
        if (type === 'save') {
            saveKeyCombination = inputField.value.split('+');
            localStorage.setItem('saveKeyCombination', JSON.stringify(saveKeyCombination));
            autoSaveEnabled = saveKeyCombination.length > 0;
            localStorage.setItem('autoSaveEnabled', JSON.stringify(autoSaveEnabled));
        }
    }

    function blurActiveInput() {
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
            activeElement.blur();
        }
    }

    function handleEnterPress(event) {
        if (event.key === 'Enter' &&
            !(document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || document.activeElement.closest('wz-textarea'))) {
            event.preventDefault();

            blurActiveInput();

            let applyButton = document.querySelector('wz-button.save-button');
            if (applyButton) {
                setTimeout(() => {
                    applyButton.click();
                }, 100);
            } else {
                console.log("Apply button not found.");
            }
        }
    }

    function handleSaveKeyPress(event) {
        if (document.activeElement.tagName === 'INPUT' ||
            document.activeElement.tagName === 'TEXTAREA' ||
            document.activeElement.closest('wz-textarea') ||
            document.activeElement.isContentEditable) {
            return;
        }

        const pressedCombination = [];

        if (event.ctrlKey) pressedCombination.push('Ctrl');
        if (event.altKey) pressedCombination.push('Alt');
        if (event.shiftKey) pressedCombination.push('Shift');
        if (!['Control', 'Shift', 'Alt', 'Meta'].includes(event.key)) {
            pressedCombination.push(event.key);
        }

        if (JSON.stringify(pressedCombination) === JSON.stringify(saveKeyCombination) && autoSaveEnabled) {
            event.preventDefault();

            blurActiveInput();

            let saveButton = document.querySelector('wz-button#save-button');
            if (saveButton && saveButton.getAttribute('disabled') !== "true") {
                setTimeout(() => {
                    saveButton.click();
                }, 100);
            } else {
                console.log("Save button not found or disabled.");
            }
        }

        // Handle confirmation dialog "Guardar de todos modos"
        let alarmingSaveButton = document.querySelector('wz-button.save[alarming="true"]');
        if (alarmingSaveButton && JSON.stringify(pressedCombination) === JSON.stringify(saveKeyCombination)) {
            event.preventDefault();
            alarmingSaveButton.click();
        }
    }

    function initializeMyUserscript() {
        initializeSidebarTab();
        document.addEventListener('keydown', handleEnterPress, true);
        document.addEventListener('keydown', handleSaveKeyPress, true);
    }

    if (W?.userscripts?.state.isReady) {
        initializeMyUserscript();
    } else {
        document.addEventListener("wme-ready", initializeMyUserscript, { once: true });
    }

})();
