// ==UserScript==
// @name         LubimyCzytać szukajka
// @namespace    https://lubimyczytac.pl
// @version      14.8
// @description  przejmuje WSZYSTKIE panele "Kup" z opcją przełączania
// @match        https://lubimyczytac.pl/*
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      beerware
// @downloadURL https://update.greasyfork.org/scripts/521125/LubimyCzyta%C4%87%20szukajka.user.js
// @updateURL https://update.greasyfork.org/scripts/521125/LubimyCzyta%C4%87%20szukajka.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === DOMYŚLNA BAZA DANYCH ===
    const DEFAULT_BUTTONS_DATA = [
        { id: 'annas', text: 'Anna\'s Arch', color: '#3498db', url: 'https://annas-archive.org/search?q={title}+{author}', enabled: true, includeInAll: true },
        { id: 'libgen', text: 'LibGen', color: '#e74c3c', url: 'https://libgen.is/search.php?req={title}+{author}', enabled: true, includeInAll: true },
        { id: 'zlibrary', text: 'Z-Library', color: '#1e90ff', url: 'https://z-library.ec/s/{title}+{author}', enabled: true, includeInAll: true },
        { id: 'googlepdf', text: 'Google PDF', color: '#4285f4', url: 'https://www.google.com/search?q={title}+{author}+pdf', enabled: true, includeInAll: true },
        { id: 'docer', text: 'Docer', color: '#0073e6', url: 'https://docer.pl/show/?q={title}+{author}', enabled: true, includeInAll: false },
        { id: 'doci', text: 'Doci', color: '#28a745', url: 'https://doci.pl/search/all/{title}+{author}', enabled: true, includeInAll: false },
        { id: 'bt4g', text: 'BT4G', color: '#8e44ad', url: 'https://bt4gprx.com/search?q={title}+{author}', enabled: true, includeInAll: false },
        { id: 'btdig', text: 'BTDigg', color: '#2c3e50', url: 'https://btdig.com/search?q={title}+{author}', enabled: true, includeInAll: false },
        { id: 'chomikuj', text: 'Google (Chomik)', color: '#f39c12', url: 'https://www.google.com/search?q=site%3Ahttps%3A%2F%2Fchomikuj.pl+{title}+{author}', enabled: true, includeInAll: false },
        { id: 'olx', text: 'OLX', color: '#f39c12', url: 'https://www.olx.pl/oferty/q-{title}+{author}', enabled: false, includeInAll: false },
        { id: 'allegrolok', text: 'Allegro Lok', color: '#2d8cc4', url: 'https://allegrolokalnie.pl/oferty/q/{title}+{author}', enabled: false, includeInAll: false },
        { id: 'skupszop', text: 'SkupSzop', color: '#5eaaa8', url: 'https://skupszop.pl/wyszukaj?with_filters&keyword={author}+-+{title}', enabled: false, includeInAll: false },
    ];
    const DEFAULT_OPEN_ALL_TEXT = 'BOMBY POSZLI';

    // === FUNKCJA POBIERANIA DANYCH ===
    function getTitleAndAuthorFromPage() {
        const titleElement = document.querySelector('.book__title');
        const authorElement = document.querySelector('.link-name');
        if (!titleElement || !authorElement) { return null; }
        let title = titleElement.textContent.trim();
        let author = authorElement.textContent.trim();
        if (author.includes(',')) { author = author.split(',')[0].trim(); }
        const MAX_TYTULU = 90;
        if (title.length > MAX_TYTULU) { title = title.substring(0, MAX_TYTULU); title = title.substring(0, Math.min(title.length, title.lastIndexOf(" "))); }
        return { title, author };
    }

    // === NOWA FUNKCJA DO GÓRNYCH PANELI (DESKTOP I MOBILE) - WERSJA ZUNIFIKOWANA ===
    function injectTopPanel(targetBox, bookInfo, buttonsData, openAllText) {
        if (!targetBox || targetBox.dataset.szukajka === 'true') return;
        targetBox.dataset.szukajka = 'true';

        const openAllButton = document.createElement('button');
        openAllButton.textContent = openAllText;
        openAllButton.className = 'btn';
        openAllButton.style.cssText = 'flex-grow: 3; background-color: #d35400; color: white; border: 1px solid #c0392b;';
        openAllButton.onclick = () => {
            const reverseOrder = GM_getValue('reverseOpenAllOrder', false);
            const buttonsToOpen = buttonsData.filter(b => b.enabled && b.includeInAll);
            if (reverseOrder) { buttonsToOpen.reverse(); }
            buttonsToOpen.forEach(buttonData => {
                const url = buttonData.url.replace('{title}', encodeURIComponent(bookInfo.title)).replace('{author}', encodeURIComponent(bookInfo.author));
                GM_openInTab(url, { active: false, setParent: true });
            });
        };

        const settingsButton = document.createElement('button');
        settingsButton.textContent = '⚙️';
        settingsButton.title = 'Ustawienia wyszukiwarki';
        settingsButton.className = 'btn';
        settingsButton.style.cssText = 'flex-grow: 1; background-color: #34495e; color: white; border: 1px solid #2c3e50;';
        settingsButton.onclick = () => { GM_openInTab('https://lubimyczytac.pl/moje-ustawienia-szukajki', { active: true, setParent: true }); };

        const toggleSidebarButton = document.createElement('button');
        toggleSidebarButton.textContent = '🛒';
        toggleSidebarButton.title = 'Pokaż/Ukryj oferty sklepów w panelu bocznym';
        toggleSidebarButton.className = 'btn';
        toggleSidebarButton.style.cssText = 'flex-grow: 1; background-color: #00BCD4; color: white; border: 1px solid #0097A7;';
        toggleSidebarButton.onclick = () => {
            const originalSidebar = document.getElementById('szukajka-sidebar-original');
            const customSidebar = document.getElementById('szukajka-sidebar-custom');
            if (!originalSidebar || !customSidebar) return;
            const isCustomVisible = customSidebar.style.display !== 'none';
            if (isCustomVisible) {
                customSidebar.style.display = 'none';
                originalSidebar.style.display = 'block';
                toggleSidebarButton.textContent = '🔍';
                toggleSidebarButton.title = 'Pokaż wyszukiwarki w panelu bocznym';
            } else {
                customSidebar.style.display = 'flex';
                originalSidebar.style.display = 'none';
                toggleSidebarButton.textContent = '🛒';
                toggleSidebarButton.title = 'Pokaż oferty sklepów w panelu bocznym';
            }
        };

        targetBox.innerHTML = '';
        targetBox.style.cssText = 'padding: 5px 10px; margin: 10px 0; display: flex; flex-direction: row; gap: 10px; align-items: stretch;';
        targetBox.appendChild(openAllButton);
        targetBox.appendChild(settingsButton);
        targetBox.appendChild(toggleSidebarButton);
    }

    // === NOWA, PROSTSZA FUNKCJA DLA PANELU BOCZNEGO ===
    function injectSidebarPanel(bookInfo, buttonsData) {
        const targetBox = document.querySelector('.buy-box-body');
        if (!targetBox || targetBox.dataset.szukajka === 'true') return;
        targetBox.dataset.szukajka = 'true';

        const originalContainer = document.createElement('div');
        originalContainer.id = 'szukajka-sidebar-original';
        originalContainer.style.display = 'none';
        while (targetBox.firstChild) { originalContainer.appendChild(targetBox.firstChild); }

        const szukajkaContainer = document.createElement('div');
        szukajkaContainer.id = 'szukajka-sidebar-custom';
        szukajkaContainer.style.display = 'flex';
        szukajkaContainer.style.flexDirection = 'column';
        szukajkaContainer.style.gap = '5px';
        buttonsData.filter(b => b.enabled).forEach(buttonData => {
            const link = document.createElement('a');
            link.href = buttonData.url.replace('{title}', encodeURIComponent(bookInfo.title)).replace('{author}', encodeURIComponent(bookInfo.author));
            link.target = '_blank';
            link.className = 'btn';
            link.textContent = buttonData.text;
            link.style.backgroundColor = buttonData.color;
            link.style.color = 'white';
            link.style.textAlign = 'left';
            szukajkaContainer.appendChild(link);
        });

        targetBox.innerHTML = '';
        targetBox.style.padding = '5px';
        targetBox.appendChild(originalContainer);
        targetBox.appendChild(szukajkaContainer);
    }

    // === PANEL STEROWANIA (Bez zmian) ===
    function buildSettingsPage() {
        GM_addStyle(`
            body { background-color: #1a1a1b !important; font-family: sans-serif; color: #d7dadc; }
            .settings-container { max-width: 1000px; margin: 20px auto; padding: 20px; background: #272729; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); color: #d7dadc; }
            h1, h2 { color: #ffffff; border-bottom: 2px solid #d35400; }
            p.info { background: #3a3a3c; border: 1px solid #555; color: #d7dadc; padding: 10px; border-radius: 4px; }
            .button-list { list-style: none; padding: 0; }
            .button-item { display: flex; align-items: center; gap: 10px; padding: 10px; border-bottom: 1px solid #3a3a3c; flex-wrap: wrap; cursor: move; user-select: none; transition: background-color 0.2s; }
            .button-item.dragging { opacity: 0.5; background: #3a3a3c; }
            .button-item.over { background-color: #4a4a4e; }
            .button-item:last-child { border: none; }
            .button-item input[type="text"] { padding: 8px; border: 1px solid #555; border-radius: 4px; font-size: 14px; background-color: #1a1a1b; color: #d7dadc; }
            .button-item input[type="color"] { padding: 0; border: 1px solid #555; border-radius: 4px; width: 40px; height: 35px; cursor: pointer; background-color: transparent; }
            .button-item input[type="checkbox"] { width: 18px; height: 18px; }
            .button-item input.field-text { flex-grow: 1; min-width: 100px; }
            .button-item input.field-url { flex-grow: 3; min-width: 300px; }
            .button-item label { display: flex; flex-direction: column; align-items: center; font-size: 12px; color: #d7dadc; }
            .btn { padding: 8px 12px; font-size: 14px; border: none; border-radius: 4px; cursor: pointer; color: white; }
            .btn-delete { background-color: #e74c3c; } .btn-delete:hover { background-color: #c0392b; }
            .btn-save { background-color: #2ecc71; font-size: 18px; padding: 12px 20px; font-weight: bold; } .btn-save:hover { background-color: #27ae60; }
            .btn-add { background-color: #3498db; } .btn-add:hover { background-color: #2980b9; }
            #save-status { color: #2ecc71; font-weight: bold; margin-left: 15px; display: none; }
            #global-settings { background: #3a3a3c; padding: 15px; border-radius: 5px; margin-bottom: 20px; display: flex; align-items: center; gap: 15px; flex-wrap: wrap; }
            #global-settings label { font-weight: bold; color: #ffffff; }
            #global-settings input { padding: 8px; border: 1px solid #555; border-radius: 4px; font-size: 14px; flex-grow: 1; background-color: #1a1a1b; color: #d7dadc; }
            #io-section { display: flex; gap: 10px; margin-top: 20px; }
            .btn-export { background-color: #0984e3; } .btn-export:hover { background-color: #005f9e; }
            .btn-import { background-color: #fdcb6e; color: #333; } .btn-import:hover { background-color: #e1b12c; }
            #import-popup { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); z-index: 9998; display: flex; align-items: center; justify-content: center; }
            #import-container { background: #272729; padding: 20px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); width: 600px; z-index: 9999; border: 1px solid #555; }
            #import-container h3 { margin-top: 0; color: white; }
            #import-textarea { width: 100%; height: 200px; background: #1a1a1b; color: #d7dadc; border: 1px solid #555; font-family: monospace; }
            #import-popup-buttons { margin-top: 10px; display: flex; justify-content: flex-end; gap: 10px; }
        `);
        let currentButtons = GM_getValue('searchButtons', DEFAULT_BUTTONS_DATA);
        let openAllText = GM_getValue('openAllButtonText', DEFAULT_OPEN_ALL_TEXT);
        let reverseOrder = GM_getValue('reverseOpenAllOrder', false);
        document.body.innerHTML = `
            <div class="settings-container">
                <h1>⚙️ Ustawienia Wyszukiwarki</h1>
                <p class="info">Przeciągaj wiersze, aby zmienić kolejność! Użyj <code>{title}</code> i <code>{author}</code> w URL.</p>
                <div id="global-settings">
                    <label for="open-all-text-input">Tekst przycisku "Szukaj Wszędzie":</label>
                    <input type="text" id="open-all-text-input" value="${openAllText}">
                    <label style="margin-left: 20px; display: flex; align-items: center; gap: 5px;">
                        <input type="checkbox" id="reverse-order-checkbox" ${reverseOrder ? 'checked' : ''}>
                        Odwróć kolejność otwierania
                    </label>
                </div>
                <ul id="button-list-container" class="button-list"></ul>
                <hr style="border-color: #3a3a3c;">
                <h2>Dodaj nowy przycisk</h2>
                <div class="button-item" id="add-new-form" style="cursor: default; border: none;">
                    <label>Włączony<input type="checkbox" id="new-enabled" checked></label>
                    <label>W "Szukaj Wsz."<input type="checkbox" id="new-include-in-all" checked></label>
                    <input type="text" id="new-text" placeholder="Nazwa (np. Google)" class="field-text">
                    <input type="color" id="new-color" value="#3498db">
                    <input type="text" id="new-url" placeholder="URL (np. https://google.com/search?q={title})" class="field-url">
                    <button id="add-new-button" class="btn btn-add">Dodaj</button>
                </div>
                <hr style="border-color: #3a3a3c;">
                <button id="save-all-button" class="btn btn-save">ZAPISZ WSZYSTKIE ZMIANY</button>
                <span id="save-status">Zapisano!</span>
                <div id="io-section">
                    <button id="export-button" class="btn btn-export">Eksportuj Ustawienia</button>
                    <button id="import-button" class="btn btn-import">Importuj Ustawienia</button>
                </div>
            </div>
            <div id="import-popup" style="display: none;">
                <div id="import-container">
                    <h3>Importuj Ustawienia</h3>
                    <p>Wklej zawartość pliku <code>ustawienia_szukajki.json</code> poniżej:</p>
                    <textarea id="import-textarea"></textarea>
                    <div id="import-popup-buttons">
                        <button id="import-cancel" class="btn btn-delete">Anuluj</button>
                        <button id="import-confirm" class="btn btn-save">Wczytaj i Zapisz</button>
                    </div>
                </div>
            </div>
        `;
        const listContainer = document.getElementById('button-list-container');
        let draggedItem = null;
        function renderList() {
            listContainer.innerHTML = '';
            currentButtons.forEach((button, index) => {
                const item = document.createElement('li');
                item.className = 'button-item';
                item.dataset.id = button.id;
                item.draggable = true;
                item.innerHTML = `
                    <label>Włączony<input type="checkbox" class="field-enabled" ${button.enabled ? 'checked' : ''}></label>
                    <label>W "Szukaj Wsz."<input type="checkbox" class="field-include-in-all" ${button.includeInAll ? 'checked' : ''}></label>
                    <input type="text" class="field-text" value="${button.text}">
                    <input type="color" class="field-color" value="${button.color}">
                    <input type="text" class="field-url" value="${button.url}">
                    <button class="btn btn-delete">Usuń</button>
                `;
                item.querySelector('.btn-delete').addEventListener('click', () => {
                    if (confirm(`Na pewno chcesz usunąć "${button.text}"?`)) {
                        currentButtons = currentButtons.filter(b => b.id !== button.id);
                        renderList();
                    }
                });
                listContainer.appendChild(item);
            });
        }
        listContainer.addEventListener('dragstart', (e) => { draggedItem = e.target.closest('.button-item'); draggedItem.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; });
        listContainer.addEventListener('dragend', () => { if (draggedItem) draggedItem.classList.remove('dragging'); draggedItem = null; });
        listContainer.addEventListener('dragover', (e) => { e.preventDefault(); const target = e.target.closest('.button-item'); if (target && target !== draggedItem) { listContainer.querySelectorAll('.over').forEach(el => el.classList.remove('over')); target.classList.add('over'); } });
        listContainer.addEventListener('dragleave', (e) => { const target = e.target.closest('.button-item'); if (target) target.classList.remove('over'); });
        listContainer.addEventListener('drop', (e) => { e.preventDefault(); const target = e.target.closest('.button-item'); if (target && draggedItem && target !== draggedItem) { listContainer.insertBefore(draggedItem, target); } listContainer.querySelectorAll('.over').forEach(el => el.classList.remove('over')); });
        document.getElementById('add-new-button').addEventListener('click', () => {
            const text = document.getElementById('new-text').value, url = document.getElementById('new-url').value, color = document.getElementById('new-color').value;
            const enabled = document.getElementById('new-enabled').checked, includeInAll = document.getElementById('new-include-in-all').checked;
            if (!text || !url) return alert('Musisz podać przynajmniej nazwę i URL!');
            const id = 'custom_' + Date.now();
            currentButtons.push({ id, text, color, url, enabled, includeInAll });
            renderList();
            document.getElementById('new-text').value = ''; document.getElementById('new-url').value = '';
        });
        document.getElementById('export-button').addEventListener('click', () => {
            saveAllSettings(false);
            const settingsToExport = { openAllButtonText: GM_getValue('openAllButtonText', DEFAULT_OPEN_ALL_TEXT), reverseOpenAllOrder: GM_getValue('reverseOpenAllOrder', false), searchButtons: GM_getValue('searchButtons', DEFAULT_BUTTONS_DATA) };
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settingsToExport, null, 2));
            const dlAnchorElem = document.createElement('a');
            dlAnchorElem.setAttribute("href", dataStr); dlAnchorElem.setAttribute("download", "ustawienia_szukajki.json");
            dlAnchorElem.click(); dlAnchorElem.remove();
        });
        const importPopup = document.getElementById('import-popup');
        document.getElementById('import-button').addEventListener('click', () => { importPopup.style.display = 'flex'; });
        document.getElementById('import-cancel').addEventListener('click', () => { importPopup.style.display = 'none'; document.getElementById('import-textarea').value = ''; });
        document.getElementById('import-confirm').addEventListener('click', () => {
            const importText = document.getElementById('import-textarea').value;
            if (!importText) return alert('Musisz coś wkleić!');
            try {
                const importedSettings = JSON.parse(importText);
                if (importedSettings.searchButtons && typeof importedSettings.openAllButtonText !== 'undefined') {
                    GM_setValue('searchButtons', importedSettings.searchButtons); GM_setValue('openAllButtonText', importedSettings.openAllButtonText);
                    GM_setValue('reverseOpenAllOrder', importedSettings.reverseOpenAllOrder || false);
                    currentButtons = importedSettings.searchButtons; openAllText = importedSettings.openAllButtonText; reverseOrder = importedSettings.reverseOpenAllOrder || false;
                    document.getElementById('open-all-text-input').value = openAllText;
                    document.getElementById('reverse-order-checkbox').checked = reverseOrder;
                    renderList();
                    alert('Sukces! Ustawienia zostały wczytane!');
                    importPopup.style.display = 'none'; document.getElementById('import-textarea').value = '';
                } else { alert('Błąd! Plik nie ma odpowiedniej struktury.'); }
            } catch (e) { alert('O nie! To... to nie jest poprawny plik JSON! Błąd: ' + e); }
        });
        function saveAllSettings(showStatus = true) {
            const newOpenAllText = document.getElementById('open-all-text-input').value;
            GM_setValue('openAllButtonText', newOpenAllText);
            const newReverseOrder = document.getElementById('reverse-order-checkbox').checked;
            GM_setValue('reverseOpenAllOrder', newReverseOrder);
            const newList = [];
            const items = listContainer.querySelectorAll('.button-item');
            items.forEach(item => {
                const id = item.dataset.id, text = item.querySelector('.field-text').value, color = item.querySelector('.field-color').value, url = item.querySelector('.field-url').value;
                const enabled = item.querySelector('.field-enabled').checked, includeInAll = item.querySelector('.field-include-in-all').checked;
                newList.push({ id, text, color, url, enabled, includeInAll });
            });
            currentButtons = newList; GM_setValue('searchButtons', currentButtons);
            if (showStatus) { const status = document.getElementById('save-status'); status.style.display = 'inline'; setTimeout(() => { status.style.display = 'none'; }, 2000); }
        }
        document.getElementById('save-all-button').addEventListener('click', () => { saveAllSettings(true); renderList(); });
        renderList();
    }

    // === FUNKCJA PROFANACJI LOGA I POZŁACANIA KRÓLA ===
    function profaneLogo() {
        let logoRetries = 10;
        const logoInterval = setInterval(() => {
            const logo = document.querySelector('.logo__link');
            if (logo) {
                clearInterval(logoInterval);
                if (logo.querySelector('.nasz-tekst')) return;
                try {
                    const logoImg = logo.querySelector('img');
                    if (logoImg) {
                        logoImg.style.display = 'none';
                        const newText = document.createElement('span');
                        newText.className = 'nasz-tekst';
                        newText.textContent = 'lubimy walić do Mistrza i Małgorzaty';
                        newText.style.cssText = 'font-size: 22px; font-weight: bold; color: #E95420; font-family: Merriweather, serif; line-height: 1.2;';
                        logo.appendChild(newText);
                    }
                } catch (e) { console.error('Ostateczny cios się nie udał... smuteczek. 😩', e); }
            }
            if (--logoRetries <= 0) { clearInterval(logoInterval); }
        }, 1000);
    }
    function gildNickname(targetNode) {
        const walker = document.createTreeWalker(targetNode, NodeFilter.SHOW_TEXT, null, false);
        let node;
        const nodesToReplace = [];
        while ((node = walker.nextNode())) {
            if (node.parentElement.tagName.match(/SCRIPT|STYLE|TEXTAREA/) || node.parentElement.classList.contains('złoty-knifers')) continue;
            if (node.nodeValue.includes('knifers')) nodesToReplace.push(node);
        }
        nodesToReplace.forEach(node => {
            if (node.parentElement.classList.contains('złoty-knifers')) return;
            const newContent = document.createDocumentFragment();
            node.nodeValue.split('knifers').forEach((text, i, arr) => {
                newContent.appendChild(document.createTextNode(text));
                if (i < arr.length - 1) {
                    const goldSpan = document.createElement('span');
                    goldSpan.textContent = 'knifers';
                    goldSpan.className = 'złoty-knifers';
                    goldSpan.style.cssText = 'color: #FFD700; font-weight: bold; text-shadow: 0 0 5px #DAA520, 0 0 2px #FFF;';
                    newContent.appendChild(goldSpan);
                }
            });
            node.parentNode.replaceChild(newContent, node);
        });
    }

    // === GŁÓWNY ROUTER ===
    profaneLogo();
    gildNickname(document.body);
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(newNode => {
                    if (newNode.nodeType === Node.ELEMENT_NODE) { gildNickname(newNode); }
                });
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    if (window.location.href.includes('/moje-ustawienia-szukajki')) {
        buildSettingsPage();
    } else if (window.location.href.includes('/ksiazka/')) {
        let bookRetries = 10;
        const bookInterval = setInterval(() => {
            const title = document.querySelector('.book__title');
            if (title) {
                clearInterval(bookInterval);
                const bookInfo = getTitleAndAuthorFromPage();
                if (!bookInfo) { return; }
                const buttonsData = GM_getValue('searchButtons', DEFAULT_BUTTONS_DATA);
                const openAllText = GM_getValue('openAllButtonText', DEFAULT_OPEN_ALL_TEXT);

                injectSidebarPanel(bookInfo, buttonsData);

                const desktopTarget = document.querySelector('.book__btn-hld--desktop');
                if (desktopTarget) injectTopPanel(desktopTarget, bookInfo, buttonsData, openAllText);

                const mobileCta = document.querySelector('.buybox-offer__cta--mobile');
                if (mobileCta) {
                    const mobileTarget = mobileCta.closest('.d-md-none');
                    if (mobileTarget) injectTopPanel(mobileTarget, bookInfo, buttonsData, openAllText);
                }
            }
            if (--bookRetries <= 0) { clearInterval(bookInterval); }
        }, 1000);
    }
})();