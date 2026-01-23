// ==UserScript==
// @name         Portál Stavební Správy - Autofill
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Automatické vyplňování na portálu stavební správy a plány BOZP s minimalistickým a funkčním rozhraním.
// @author       Teodor Tomáš
// @match        https://portal.stavebnisprava.gov.cz/*
// @match        https://planybozp.cz/*
// @match        https://www.planybozp.cz/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @license      GNU GPLv3
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://portal.stavebnisprava.gov.cz/
// @downloadURL https://update.greasyfork.org/scripts/545805/Port%C3%A1l%20Stavebn%C3%AD%20Spr%C3%A1vy%20-%20Autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/545805/Port%C3%A1l%20Stavebn%C3%AD%20Spr%C3%A1vy%20-%20Autofill.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =================================================================
    // ROUTER - Spustí správný kód podle aktuální stránky
    // =================================================================
    const hostname = window.location.hostname;

    if (hostname === 'portal.stavebnisprava.gov.cz') {
        runPortalStavebniSpravyScript();
    } else if (hostname.endsWith('planybozp.cz')) {
        runBozpScript();
    }


    // =================================================================
    // KÓD PRO: portal.stavebnisprava.gov.cz (s opravou UI)
    // =================================================================
    function runPortalStavebniSpravyScript() {
        const DB_KEY = 'autofillManagerSets';

        // --- Configuration Variables ---
        const CONFIG = {
            SCROLL_DELAY: 100,       // Čas na scroll (ms)
            ACTION_DELAY: 20,        // Základní prodleva mezi akcemi (ms)
            ARES_POLL_INTERVAL: 10,  // Interval kontroly pole po kliknutí na ARES (ms)
            RETRY_MULTIPLIER: 2      // Násobič času při opakování po chybě
        };
        let timeMult = 1; // Aktuální násobič času

        // --- Minimalist UI Styles ---
        const styles = `
            :root {
                --ui-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                --ui-bg: #fdfdfd;
                --ui-surface: #ffffff;
                --ui-border: #e1e4e8;
                --ui-text: #24292e;
                --ui-text-secondary: #586069;
                --ui-accent: #0366d6;
                --ui-accent-hover: #005cc5;
                --ui-danger: #d73a49;
                --ui-danger-hover: #cb2431;
                --ui-warning: #f0ad4e;
                --ui-warning-hover: #ec971f;
                --ui-radius: 6px;
                --ui-shadow: 0 3px 12px rgba(27, 31, 35, 0.08);
            }
            #autofill-manager-container { position: fixed; top: 70px; right: -420px; width: 400px; height: calc(100vh - 90px); background: var(--ui-bg); border: 1px solid var(--ui-border); border-radius: var(--ui-radius); box-shadow: var(--ui-shadow); z-index: 10001; transition: right 0.3s ease-in-out; display: flex; flex-direction: column; font-family: var(--ui-font); }
            #autofill-manager-container.visible { right: 20px; }
            #autofill-manager-toggle { position: fixed; top: 70px; right: 20px; background: var(--ui-surface); color: var(--ui-text); border: 1px solid var(--ui-border); width: 44px; height: 44px; border-radius: var(--ui-radius); cursor: pointer; z-index: 10002; font-size: 20px; line-height: 1; display:flex; align-items:center; justify-content:center; transition: background-color 0.2s; }
            #autofill-manager-toggle:hover { background-color: #f6f8fa; }
            .autofill-header { padding: 16px; font-size: 18px; font-weight: 600; text-align: center; color: var(--ui-text); border-bottom: 1px solid var(--ui-border); }
            .autofill-body { padding: 16px; overflow-y: auto; flex-grow: 1; display: flex; flex-direction: column; gap: 12px; }
            .autofill-footer { padding: 12px; border-top: 1px solid var(--ui-border); text-align: center; background: var(--ui-bg); border-radius: 0 0 var(--ui-radius) var(--ui-radius); }
            .autofill-button { font-family: var(--ui-font); font-size: 14px; font-weight: 600; border: 1px solid var(--ui-border); padding: 8px 16px; border-radius: var(--ui-radius); cursor: pointer; transition: background-color 0.2s; background-color: var(--ui-surface); color: var(--ui-text); }
            .autofill-button:hover { background-color: #f6f8fa; }
            .autofill-button.primary { background: var(--ui-accent); color: white; border-color: var(--ui-accent); }
            .autofill-button.primary:hover { background: var(--ui-accent-hover); }
            .autofill-button.edit { color: var(--ui-warning-hover); border-color: var(--ui-warning); }
            .autofill-button.delete { color: var(--ui-danger); border-color: var(--ui-danger); }
            .scenario-list-item { display: flex; flex-direction: column; gap: 12px; padding: 16px; border-radius: var(--ui-radius); border: 1px solid var(--ui-border); background: var(--ui-surface); }
            .scenario-list-item .title { font-weight: 600; font-size: 16px; color: var(--ui-text); flex-grow: 1; }
            .scenario-list-item .actions { display: flex; justify-content: flex-end; flex-wrap: wrap; gap: 8px; }
            #creation-bar { position: fixed; bottom: 0; left: 0; width: 100%; background: #f6f8fa; padding: 16px; z-index: 10001; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 -2px 10px rgba(0,0,0,0.07); border-top: 1px solid var(--ui-border); font-family: var(--ui-font); }
            #creation-bar-main { display: flex; align-items: center; gap: 12px; }
            #creation-bar-label { font-weight: 600; color: var(--ui-text); }
            #creation-bar-input { font-size: 14px; padding: 8px 12px; border: 1px solid var(--ui-border); border-radius: var(--ui-radius); width: 280px; transition: all 0.2s ease; }
            #creation-bar-input:focus { border-color: var(--ui-accent); box-shadow: 0 0 0 3px rgba(3, 102, 214, 0.3); outline: none; }
            #creation-bar-files { margin-top: 16px; font-size: 14px; width: 600px; background: var(--ui-surface); padding: 16px; border-radius: var(--ui-radius); border: 1px solid var(--ui-border); display: flex; flex-direction: column; gap: 10px; }
            .file-creator-row { display: flex; justify-content: space-between; align-items: center; gap: 15px; }
            .file-title { flex-shrink: 0; }
            .file-controls { display: flex; align-items: center; gap: 10px; min-width: 0; }
            .file-status { color: var(--ui-text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex-shrink: 1; }
            /* Toasts */
            #autofill-warning-toast { position: fixed; bottom: 20px; right: 20px; background: #fff3cd; color: #856404; border: 1px solid #ffeeba; padding: 12px 20px; border-radius: var(--ui-radius); box-shadow: var(--ui-shadow); z-index: 10003; font-family: var(--ui-font); font-size: 14px; display: none; align-items: center; gap: 10px; }
            #autofill-success-toast { position: fixed; bottom: 20px; right: 20px; background: #d4edda; color: #155724; border: 1px solid #c3e6cb; padding: 12px 20px; border-radius: var(--ui-radius); box-shadow: var(--ui-shadow); z-index: 10003; font-family: var(--ui-font); font-size: 14px; display: none; align-items: center; gap: 10px; }
            #autofill-error-toast { position: fixed; bottom: 20px; right: 20px; background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; padding: 12px 20px; border-radius: var(--ui-radius); box-shadow: var(--ui-shadow); z-index: 10004; font-family: var(--ui-font); font-size: 14px; display: none; align-items: center; gap: 10px; }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        const warningToast = document.createElement('div');
        warningToast.id = 'autofill-warning-toast';
        warningToast.innerText = '⚠️ Validace selhala, opakuji vyplňování (pomaleji)...';
        document.body.appendChild(warningToast);

        const successToast = document.createElement('div');
        successToast.id = 'autofill-success-toast';
        successToast.innerText = '✅ Úspěšně vyplněno.';
        document.body.appendChild(successToast);

        const errorToast = document.createElement('div');
        errorToast.id = 'autofill-error-toast';
        errorToast.innerText = '❌ Bohužel se stále nedaří vyplnit. Vyplňte ručně zvýrazněná pole.';
        document.body.appendChild(errorToast);

        class StorageManager { constructor() { this.key = DB_KEY; } async getSets() { return await GM_getValue(this.key, {}); } async saveSet(name, sequence) { const allSets = await this.getSets(); allSets[name] = sequence; await GM_setValue(this.key, allSets); } async deleteSet(name) { const allSets = await this.getSets(); if (allSets[name]) { delete allSets[name]; await GM_setValue(this.key, allSets); } } }
        class SequenceEngine {
            async executeWithRetry(sequence) {
                timeMult = 1;
                // Vyčistit předchozí highlighty (pokud existují)
                this.clearHighlights(sequence);

                await this.execute(sequence);
                if (this.validate(sequence)) {
                    this.showSuccess(true);
                    setTimeout(() => this.showSuccess(false), 3000);
                    return;
                }

                // Pokud validace selže - pokus č. 2
                this.showWarning(true);
                console.log('Validace selhala, aktivuji bezpečný režim (4x pomaleji).');
                timeMult = CONFIG.RETRY_MULTIPLIER;
                await this.execute(sequence);
                timeMult = 1;
                this.showWarning(false);

                if (this.validate(sequence)) {
                    this.showSuccess(true);
                    setTimeout(() => this.showSuccess(false), 3000);
                } else {
                    // FATÁLNÍ SELHÁNÍ
                    console.log('Ani druhý pokus nevyšel. Zvýrazňuji chyby.');
                    this.highlightErrors(sequence);
                    this.showError(true);
                    setTimeout(() => this.showError(false), 8000); // Zobrazit na 8s
                }
            }
            validate(sequence) {
                for (const step of sequence) {
                    if (step.action === 'fill' || step.action === 'select') {
                        const el = this.findElement(step.selector);
                        if (!el || el.value != step.value) return false;
                    }
                }
                return true;
            }
            highlightErrors(sequence) {
                for (const step of sequence) {
                    if (step.action === 'fill' || step.action === 'select') {
                        const el = this.findElement(step.selector);
                        if (el && el.value != step.value) {
                             el.style.border = '2px solid var(--ui-danger)';
                             el.style.boxShadow = '0 0 5px var(--ui-danger)';
                        }
                    }
                }
            }
            clearHighlights(sequence) {
                 for (const step of sequence) {
                    if (step.action === 'fill' || step.action === 'select') {
                        const el = this.findElement(step.selector);
                        if (el) {
                             el.style.border = '';
                             el.style.boxShadow = '';
                        }
                    }
                }
            }
            showWarning(show) { const t = document.getElementById('autofill-warning-toast'); if(t) t.style.display = show ? 'flex' : 'none'; }
            showSuccess(show) { const t = document.getElementById('autofill-success-toast'); if(t) t.style.display = show ? 'flex' : 'none'; }
            showError(show) { const t = document.getElementById('autofill-error-toast'); if(t) t.style.display = show ? 'flex' : 'none'; }

            async execute(sequence) {
                console.log("Spouštím scénář:", sequence, "Multiplikátor:", timeMult);
                const toggleBtn = document.getElementById('autofill-manager-toggle');
                toggleBtn.innerText = '⚙️';
                let aresJustClicked = false;
                for (let i = 0; i < sequence.length; i++) {
                    const step = sequence[i];
                    const element = this.findElement(step.selector);
                    if (element) {
                        try {
                            element.scrollIntoView({ behavior: 'auto', block: 'center' });
                            await this.sleep(CONFIG.SCROLL_DELAY * timeMult);

                            if (aresJustClicked && step.action === 'fill' && element.value) {
                                console.log(`Přeskakuji pole ${step.selector}, bylo vyplněno z ARES.`);
                                continue;
                            }
                            element.focus();
                            let sleepTime = CONFIG.ACTION_DELAY * timeMult;

                            switch(step.action) {
                                case 'click':
                                    element.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
                                    if (element.type === 'radio') sleepTime = 700 * timeMult; // Rádia potřebují více času
                                    aresJustClicked = false;
                                    break;
                                case 'click-ares':
                                    element.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
                                    // Dynamická kontrola ARES
                                    // Podíváme se na další krok ve scénáři, což je pravděpodobně Název firmy (fill)
                                    if (sequence[i+1] && sequence[i+1].action === 'fill') {
                                        const nextSelector = sequence[i+1].selector;
                                        const nextEl = this.findElement(nextSelector);
                                        if (nextEl) {
                                            let checks = 0;
                                            while(nextEl.value === '' && checks < 300) { // Max 3s (300 * 10ms)
                                                await this.sleep(CONFIG.ARES_POLL_INTERVAL);
                                                checks++;
                                            }
                                        } else {
                                            await this.sleep(1500 * timeMult); // Fallback
                                        }
                                    } else {
                                         await this.sleep(1500 * timeMult); // Fallback pokud není další krok
                                    }
                                    sleepTime = CONFIG.ACTION_DELAY * timeMult;
                                    aresJustClicked = true;
                                    break;
                                case 'fill':
                                case 'select':
                                    this.setNativeValue(element, step.value);
                                    if (step.action === 'select') element.dispatchEvent(new Event('change', { bubbles: true }));
                                    aresJustClicked = false;
                                    break;
                                case 'upload':
                                    const file = this.base64ToFile(step.data, step.name, step.type);
                                    const dataTransfer = new DataTransfer();
                                    dataTransfer.items.add(file);
                                    element.dispatchEvent(new DragEvent('drop', { dataTransfer, bubbles: true, cancelable: true }));
                                    sleepTime = 800 * timeMult;
                                    break;
                            }
                            await this.sleep(sleepTime);
                            if (document.activeElement === element) element.blur();
                            await this.sleep(CONFIG.ACTION_DELAY * timeMult);
                        } catch (e) { console.error(`Chyba při kroku pro selector ${step.selector}:`, e); }
                    } else { console.warn(`Element nenalezen:`, step); }
                }
                toggleBtn.innerText = '🛠️';
                console.log("Scénář dokončen.");
            }
            generate(formContainer, fileData) { const sequence = []; const elements = Array.from(formContainer.querySelectorAll('input, select, textarea')); const icoFilled = new Set(); elements.sort((a, b) => (a.type === 'radio' ? 0 : 1) - (b.type === 'radio' ? 0 : 1)); elements.forEach(el => { const selector = this.getSelector(el); if (!selector) return; if (el.type === 'radio' && el.checked) { sequence.push({ action: 'click', selector }); } else if (el.type === 'checkbox' && el.checked) { sequence.push({ action: 'click', selector }); } else if (el.classList.contains('with-ico') && el.value && !icoFilled.has(selector)) { sequence.push({ action: 'fill', selector, value: el.value }); const aresButton = el.parentElement.querySelector('button.ico-btn'); if (aresButton) { const btnSelector = this.getSelector(aresButton); if(btnSelector) sequence.push({ action: 'click-ares', selector: btnSelector }); } icoFilled.add(selector); } else if ((el.type === 'text' || el.type === 'date' || el.tagName.toLowerCase() === 'textarea') && el.value && !el.classList.contains('with-ico')) { sequence.push({ action: 'fill', selector, value: el.value }); } else if (el.tagName.toLowerCase() === 'select' && el.value) { sequence.push({ action: 'select', selector, value: el.value }); } }); for (const selector in fileData) { sequence.push({ action: 'upload', selector, ...fileData[selector] }); } return sequence; } getSelector(el) { if (el.id && document.querySelectorAll(`#${CSS.escape(el.id)}`).length === 1) return `#${CSS.escape(el.id)}`; if (el.type === 'radio' && el.name && el.value) return `input[type="radio"][name="${CSS.escape(el.name)}"][value="${CSS.escape(el.value)}"]`; let path = ''; let current = el; while (current && current.nodeType === Node.ELEMENT_NODE && current.tagName.toLowerCase() !== 'body') { let segment = current.tagName.toLowerCase(); if (current.className && typeof current.className === 'string') { const classNames = current.className.trim().replace(/\s+/g, '.'); if(classNames) segment += '.' + classNames; } const siblings = Array.from(current.parentNode.children); const sameTagSiblings = siblings.filter(sibling => sibling.tagName === current.tagName); if (sameTagSiblings.length > 1) { segment += `:nth-of-type(${sameTagSiblings.indexOf(current) + 1})`; } path = segment + (path ? ' > ' + path : ''); if (current.parentElement && current.parentElement.id && document.querySelectorAll(`#${CSS.escape(current.parentElement.id)}`).length === 1) { path = '#' + CSS.escape(current.parentElement.id) + ' > ' + path; break; } current = current.parentElement; } return path; } base64ToFile(dataurl, filename, mimeType) { const arr=dataurl.split(','),bstr=atob(arr[1]);let n=bstr.length;const u8arr=new Uint8Array(n);while(n--){u8arr[n]=bstr.charCodeAt(n)}return new File([u8arr],filename,{type:mimeType}) } findElement(selector) { try { return document.querySelector(selector); } catch (e) { console.error(`Neplatný selector: "${selector}"`, e); return null; }} setNativeValue(element, value) { const s=Object.getOwnPropertyDescriptor(element.constructor.prototype,'value').set;s.call(element,value);element.dispatchEvent(new Event('input',{bubbles:true})); } sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); } }

        class UIManager {
            constructor(storage, engine) { this.storage = storage; this.engine = engine; }
            createPanel() {
                this.container = document.createElement('div'); this.container.id = 'autofill-manager-container'; document.body.appendChild(this.container);
                const toggleButton = document.createElement('button'); toggleButton.id = 'autofill-manager-toggle'; toggleButton.innerHTML = '🛠️'; toggleButton.onclick = () => this.container.classList.toggle('visible'); document.body.appendChild(toggleButton);
                this.renderListView();
            }
            async renderListView() {
                 this.container.innerHTML = `
                    <div class="autofill-header">Správce scénářů</div>
                    <div class="autofill-body" id="autofill-body-content"></div>
                    <div class="autofill-footer"><button id="create-new-scenario-btn" class="autofill-button primary">+ Vytvořit nový scénář</button></div>`;
                this.body = document.getElementById('autofill-body-content');
                const sets = await this.storage.getSets();
                if (Object.keys(sets).length === 0) {
                    this.body.innerHTML = '<p style="text-align:center;color:var(--ui-text-secondary);">Žádné uložené scénáře.</p>';
                } else {
                    for (const name in sets) {
                        const item = document.createElement('div'); item.className = 'scenario-list-item';
                        item.innerHTML = `<div class="title">${name}</div>
                            <div class="actions">
                                <button class="autofill-button" data-run-scenario="${name}">Spustit</button>
                                <button class="autofill-button edit" data-edit-scenario="${name}">Upravit</button>
                                <button class="autofill-button delete" data-delete-scenario="${name}">Smazat</button>
                            </div>`;
                        this.body.appendChild(item);
                    }
                }
                this.attachListListeners();
            }
            enterCreationMode(scenarioNameToEdit = null, scenarioData = null) {
                this.container.classList.remove('visible');
                const bar = document.createElement('div'); bar.id = 'creation-bar';
                bar.innerHTML = `
                    <div id="creation-bar-main">
                        <span id="creation-bar-label">${scenarioNameToEdit ? 'Upravit scénář' : 'Nový scénář'}</span>
                        <input id="creation-bar-input" type="text" placeholder="Zadejte název...">
                        <button id="creation-bar-save" class="autofill-button primary">Uložit</button>
                        <button id="creation-bar-cancel" class="autofill-button">Zrušit</button>
                    </div>
                    <div id="creation-bar-files"></div>`;
                document.body.appendChild(bar);
                if (scenarioNameToEdit) { document.getElementById('creation-bar-input').value = scenarioNameToEdit; }
                this.populateFileCreators(scenarioData);
                document.getElementById('creation-bar-cancel').onclick = () => this.exitCreationMode();
                document.getElementById('creation-bar-save').onclick = async () => {
                    const name = document.getElementById('creation-bar-input').value.trim();
                    if (!name) { alert('Prosím, zadejte název scénáře.'); return; }
                    const fileData = {};
                    document.querySelectorAll('.file-creator-row input[type="file"]').forEach(input => { if (input.dataset.fileData) { fileData[input.dataset.targetSelector] = { data: input.dataset.fileData, name: input.dataset.fileName, type: input.dataset.fileType }; } });
                    const formContainer = document.querySelector('.pe-lg-3.col-xl-8');
                    const sequence = this.engine.generate(formContainer, fileData);
                    await this.storage.saveSet(name, sequence);
                    this.exitCreationMode();
                };
            }
            populateFileCreators(scenarioData = null) {
                const filesContainer = document.getElementById('creation-bar-files');
                const dropZones = document.querySelectorAll('.file-drop-target');
                if(dropZones.length > 0) {
                    filesContainer.innerHTML = '<div style="text-align:center; font-size:12px; color:var(--ui-text-secondary); margin-bottom:4px;">Tip: Nejprve nastavte přepínače (např. \'právnická osoba\'), aby se zobrazily relevantní pole pro nahrání souborů.</div>';
                }
                dropZones.forEach((zone, index) => {
                    const title = zone.closest('.row-wrapper')?.querySelector('h3.id-title')?.innerText || `Nahrávání souboru #${index + 1}`;
                    const selector = this.engine.getSelector(zone);
                    const foundFileStep = scenarioData ? scenarioData.find(step => step.action === 'upload' && step.selector === selector) : null;
                    const row = document.createElement('div');
                    row.className = 'file-creator-row';
                    // --- OPRAVENÝ HTML KÓD PRO ZAROVNÁNÍ ---
                    row.innerHTML = `
                        <span class="file-title">${title}:</span>
                        <div class="file-controls">
                            <label class="autofill-button" for="file-creator-${index}" style="padding: 4px 10px; font-size:12px; flex-shrink: 0;">Vybrat soubor</label>
                            <input type="file" id="file-creator-${index}" data-target-selector="${selector}" style="display:none;">
                            <span class="file-status" id="file-status-${index}">${foundFileStep ? `${foundFileStep.name}` : 'Nevybrán'}</span>
                        </div>`;
                    filesContainer.appendChild(row);
                    const fileInput = row.querySelector('input[type="file"]');
                    if(foundFileStep){
                        fileInput.dataset.fileData = foundFileStep.data;
                        fileInput.dataset.fileName = foundFileStep.name;
                        fileInput.dataset.fileType = foundFileStep.type;
                    }
                    fileInput.addEventListener('change', (e) => {
                        const file = e.target.files[0];
                        const statusSpan = document.getElementById(`file-status-${index}`);
                        if (!file) {
                            delete fileInput.dataset.fileData;
                            statusSpan.textContent = 'Nevybrán';
                            return;
                        }
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            fileInput.dataset.fileData = event.target.result;
                            fileInput.dataset.fileName = file.name;
                            fileInput.dataset.fileType = file.type;
                            statusSpan.textContent = `${file.name}`;
                        };
                        reader.readAsDataURL(file);
                    });
                });
            }
            exitCreationMode() { const e = document.getElementById('creation-bar'); if (e) e.remove(); this.renderListView(); }
            attachListListeners() {
                document.getElementById('create-new-scenario-btn').onclick = () => this.enterCreationMode();
                this.container.querySelectorAll('[data-run-scenario]').forEach(btn => { btn.onclick = async () => { const name = btn.dataset.runScenario; const sets = await this.storage.getSets(); if (sets[name]) { this.container.classList.remove('visible'); await this.engine.executeWithRetry(sets[name]); } }; });
                this.container.querySelectorAll('[data-edit-scenario]').forEach(btn => { btn.onclick = async () => { const name = btn.dataset.editScenario; const sets = await this.storage.getSets(); if (sets[name]) { this.container.classList.remove('visible'); await this.engine.executeWithRetry(sets[name]); this.enterCreationMode(name, sets[name]); } }; });
                this.container.querySelectorAll('[data-delete-scenario]').forEach(btn => { btn.onclick = async () => { const name = btn.dataset.deleteScenario; if (confirm(`Opravdu chcete smazat scénář "${name}"?`)) { await this.storage.deleteSet(name); this.renderListView(); } }; });
            }
        }
        setTimeout(() => { try { const storage = new StorageManager(); const engine = new SequenceEngine(); const ui = new UIManager(storage, engine); ui.createPanel(); } catch(e) { console.error("Chyba při inicializaci Autofill Manažeru:", e); } }, 1500);
    }


    // =================================================================
    // KÓD PRO: planybozp.cz (beze změn)
    // =================================================================
    function runBozpScript() {
        const BOZP_SETTINGS_KEY = 'ico_autofill_settings';
        const BOZP_GLOBAL_KEY = 'ico_autofill_global';

        if (GM_getValue(BOZP_GLOBAL_KEY, undefined) === undefined) { GM_setValue(BOZP_GLOBAL_KEY, true); }

        function getSettings() { let stored = GM_getValue(BOZP_SETTINGS_KEY, null); if (stored === null) { GM_setValue(BOZP_SETTINGS_KEY, JSON.stringify([])); return []; } try { return JSON.parse(stored); } catch (e) { return []; } }
        function saveSettings(settings) { GM_setValue(BOZP_SETTINGS_KEY, JSON.stringify(settings)); }
        function fillFields() { if (!GM_getValue(BOZP_GLOBAL_KEY, true)) return; let tiskCheckbox = document.getElementById("tisk_korespondence"); if (tiskCheckbox && tiskCheckbox.checked) { tiskCheckbox.checked = false; tiskCheckbox.dispatchEvent(new Event('change', { bubbles: true })); } const settings = getSettings(); settings.forEach(entry => { if (entry.enabled === false) return; entry.ids.forEach(id => { let field = document.getElementById(id); if (field && field.value === '') { field.value = entry.value; field.dispatchEvent(new Event('input', { bubbles: true })); } }); }); }

        function addStyles() {
            const style = document.createElement('style');
            style.textContent = `
                :root {
                    --ui-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    --ui-bg: #fdfdfd;
                    --ui-surface: #ffffff;
                    --ui-border: #e1e4e8;
                    --ui-text: #24292e;
                    --ui-text-secondary: #586069;
                    --ui-accent: #0366d6;
                    --ui-accent-hover: #005cc5;
                    --ui-danger: #d73a49;
                    --ui-danger-hover: #cb2431;
                    --ui-warning: #f0ad4e;
                    --ui-warning-hover: #ec971f;
                    --ui-radius: 6px;
                    --ui-shadow: 0 3px 12px rgba(27, 31, 35, 0.08);
                }
                #bozp-manager-container { position: fixed; top: 20px; right: -420px; width: 400px; height: calc(100vh - 40px); background: var(--ui-bg); border: 1px solid var(--ui-border); border-radius: var(--ui-radius); box-shadow: var(--ui-shadow); z-index: 10001; transition: right 0.3s ease-in-out; display: flex; flex-direction: column; font-family: var(--ui-font); }
                #bozp-manager-container.visible { right: 20px; }
                #bozp-manager-toggle { position: fixed; top: 20px; right: 20px; background: var(--ui-surface); color: var(--ui-text); border: 1px solid var(--ui-border); width: 44px; height: 44px; border-radius: var(--ui-radius); cursor: pointer; z-index: 10002; font-size: 20px; line-height: 1; display:flex; align-items:center; justify-content:center; transition: background-color 0.2s; }
                #bozp-manager-toggle:hover { background-color: #f6f8fa; }
                .bozp-header { padding: 16px; font-size: 18px; font-weight: 600; text-align: center; color: var(--ui-text); border-bottom: 1px solid var(--ui-border); }
                .bozp-body { padding: 16px; overflow-y: auto; flex-grow: 1; display: flex; flex-direction: column; gap: 12px; }
                .bozp-footer { padding: 12px; border-top: 1px solid var(--ui-border); text-align: center; background: var(--ui-bg); border-radius: 0 0 var(--ui-radius) var(--ui-radius); }
                .bozp-button { font-family: var(--ui-font); font-size: 14px; font-weight: 600; border: 1px solid var(--ui-border); padding: 8px 16px; border-radius: var(--ui-radius); cursor: pointer; transition: background-color 0.2s; background-color: var(--ui-surface); color: var(--ui-text); }
                .bozp-button:hover { background-color: #f6f8fa; }
                .bozp-button.primary { background: var(--ui-accent); color: white; border-color: var(--ui-accent); }
                .bozp-button.primary:hover { background: var(--ui-accent-hover); }
                .bozp-button.edit { color: var(--ui-warning-hover); border-color: var(--ui-warning); }
                .bozp-button.delete { color: var(--ui-danger); border-color: var(--ui-danger); }
                .bozp-setting-item { display: flex; flex-direction: column; gap: 12px; padding: 16px; border-radius: var(--ui-radius); border: 1px solid var(--ui-border); background: var(--ui-surface); }
                .bozp-input { width: 100%; box-sizing: border-box; font-size: 14px; padding: 8px 12px; border: 1px solid var(--ui-border); border-radius: var(--ui-radius); }
                .bozp-id-list { font-size: 12px; color: var(--ui-text-secondary); word-break: break-all; }
                .bozp-setting-item .actions { display: flex; justify-content: flex-end; gap: 8px; }
                .bozp-global-toggle { padding-bottom: 16px; margin-bottom: 12px; border-bottom: 1px solid var(--ui-border); }
                .bozp-checkbox-label { display: flex; align-items: center; cursor: pointer; gap: 8px; font-weight: 600; font-size: 16px; color: var(--ui-text); }
                #af-add-panel { position: fixed; bottom: 0; left: 0; width: 100%; background: #f6f8fa; padding: 16px; z-index: 10001; display: flex; align-items: center; justify-content: center; gap: 15px; box-shadow: 0 -2px 10px rgba(0,0,0,0.07); border-top: 1px solid var(--ui-border); font-family: var(--ui-font); }
            `;
            document.head.appendChild(style);
        }

        function createPanel() {
            const container = document.createElement('div'); container.id = 'bozp-manager-container'; document.body.appendChild(container);
            const toggleButton = document.createElement('button'); toggleButton.id = 'bozp-manager-toggle'; toggleButton.innerHTML = '🛠️'; toggleButton.title = 'Správa BOZP AutoFill'; toggleButton.onclick = () => { container.classList.toggle('visible'); if (container.classList.contains('visible')) { renderManagementList(); } }; document.body.appendChild(toggleButton);
            container.innerHTML = `<div class="bozp-header">BOZP Autofill</div>
                <div class="bozp-body" id="bozp-body-content"></div>
                <div class="bozp-footer"><button id="bozp-add-new-btn" class="bozp-button primary">+ Přidat nové pravidlo</button></div>`;
            document.getElementById('bozp-add-new-btn').onclick = () => { container.classList.remove('visible'); openAddModePanel(); };
        }

        function renderManagementList() {
            const body = document.getElementById('bozp-body-content'); body.innerHTML = '';
            const globalToggleContainer = document.createElement('div'); globalToggleContainer.className = 'bozp-global-toggle';
            const globalCheckbox = document.createElement('input'); globalCheckbox.type = 'checkbox'; globalCheckbox.id = 'bozp-global-toggle-cb'; globalCheckbox.checked = GM_getValue(BOZP_GLOBAL_KEY, true); globalCheckbox.addEventListener('change', () => { GM_setValue(BOZP_GLOBAL_KEY, globalCheckbox.checked); fillFields(); });
            const globalLabel = document.createElement('label'); globalLabel.textContent = 'Autofill aktivní'; globalLabel.className = 'bozp-checkbox-label'; globalLabel.htmlFor = 'bozp-global-toggle-cb'; globalLabel.prepend(globalCheckbox); globalToggleContainer.appendChild(globalLabel); body.appendChild(globalToggleContainer);

            const settings = getSettings();
            if (settings.length === 0) {
                body.innerHTML += '<p style="text-align:center;color:var(--ui-text-secondary);">Žádná uložená pravidla.</p>';
            } else {
                settings.forEach((entry, index) => {
                    const item = document.createElement('div'); item.className = 'bozp-setting-item';
                    const entryCheckboxId = `bozp_entry_cb_${index}`;
                    item.innerHTML = `
                        <label for="${entryCheckboxId}" class="bozp-checkbox-label" style="font-size:14px; font-weight:normal;">
                            <input type="checkbox" id="${entryCheckboxId}" ${entry.enabled !== false ? 'checked' : ''}>Povoleno
                        </label>
                        <input type="text" class="bozp-input" value="${entry.value}" placeholder="Text k vyplnění...">
                        <div class="bozp-id-list"><b>Cílová pole:</b> ${entry.ids.join(', ')}</div>
                        <div class="actions">
                            <button class="bozp-button edit" data-edit-idx="${index}">Upravit pole</button>
                            <button class="bozp-button delete" data-delete-idx="${index}">Smazat</button>
                        </div>`;
                    item.querySelector('input[type="checkbox"]').addEventListener('change', (e) => { let s = getSettings(); s[index].enabled = e.target.checked; saveSettings(s); fillFields(); });
                    item.querySelector('input[type="text"]').addEventListener('change', (e) => { let s = getSettings(); s[index].value = e.target.value; saveSettings(s); fillFields(); });
                    item.querySelector('.edit').onclick = () => { document.getElementById('bozp-manager-container').classList.remove('visible'); openEditIDsPanel(index); };
                    item.querySelector('.delete').onclick = () => { if (confirm('Opravdu chcete toto pravidlo smazat?')) { let s = getSettings(); s.splice(index, 1); saveSettings(s); renderManagementList(); } };
                    body.appendChild(item);
                });
            }
        }

        function openAddModePanel(isEdit = false, index = -1) {
            const panelId = 'af-add-panel'; if (document.getElementById(panelId)) return;
            const panelContainer = document.createElement('div'); panelContainer.id = panelId;
            panelContainer.innerHTML = `
                <div style="font-weight:600; color: var(--ui-text);">${isEdit ? 'Režim úpravy: Klikněte na nová pole.' : 'Režim výběru: Klikněte na pole, která chcete přidat.'}</div>
                <div id="af-selected-list" style="color: var(--ui-text-secondary); font-size:14px;">Vybrané ID: žádné</div>
                <div>
                    <button class="bozp-button primary">${isEdit ? 'Uložit změny' : 'Hotovo'}</button>
                    <button class="bozp-button">Zrušit</button>
                </div>`;
            document.body.appendChild(panelContainer);
            let selectedIds = new Set();
            const updateSelectedDisplay = () => { panelContainer.querySelector('#af-selected-list').innerHTML = `Vybrané ID: <b>${Array.from(selectedIds).join(', ') || 'žádné'}</b>`; };
            const selectionListener = e => { if (panelContainer.contains(e.target) || (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') || !e.target.id) return; e.preventDefault(); e.stopPropagation(); if (selectedIds.has(e.target.id)) { selectedIds.delete(e.target.id); e.target.style.outline = ''; } else { selectedIds.add(e.target.id); e.target.style.outline = '2px solid var(--ui-danger)'; } updateSelectedDisplay(); };
            document.addEventListener('click', selectionListener, true);
            const cleanup = () => { document.removeEventListener('click', selectionListener, true); selectedIds.forEach(id => { let field = document.getElementById(id); if (field) field.style.outline = ''; }); panelContainer.remove(); };
            panelContainer.querySelector('.primary').onclick = () => {
                if (selectedIds.size === 0) { alert('Nevybrali jste žádné pole.'); cleanup(); return; }
                let settings = getSettings();
                if (isEdit) { settings[index].ids = Array.from(selectedIds); } else { const textValue = prompt('Zadejte text, který se má vyplnit do vybraných polí:'); if (textValue === null) { cleanup(); return; } settings.push({ ids: Array.from(selectedIds), value: textValue, enabled: true }); }
                saveSettings(settings); fillFields(); cleanup();
            };
            panelContainer.querySelector('.bozp-button:not(.primary)').onclick = cleanup;
        }
        function openEditIDsPanel(index) { openAddModePanel(true, index); }

        const observer = new MutationObserver(fillFields);
        observer.observe(document.body, { childList: true, subtree: true });
        fillFields();
        addStyles();
        createPanel();
    }
})();