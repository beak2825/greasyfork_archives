// ==UserScript==
// @name         Discourse Emoji Panel Integrado
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Añade un botón a la barra del editor para insertar emojis rápidamente en foros Discourse.
// @author       Annthizze
// @license      MIT
// @match        https://www.waze.com/discuss/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/538863/Discourse%20Emoji%20Panel%20Integrado.user.js
// @updateURL https://update.greasyfork.org/scripts/538863/Discourse%20Emoji%20Panel%20Integrado.meta.js
// ==/UserScript==

(function() {

    'use strict';



    console.log('Discourse Emoji Panel v3.2.7 - Cargado. Iniciando observador persistente...');



    /**

     * =================================================================

     * ESTILOS CSS

     * =================================================================

     */

    GM_addStyle(`

        .emoji-custom-toolbar {

            padding-bottom: 5px; margin-bottom: 5px;

            border-bottom: 1px solid var(--primary-low, #ddd);

        }

        .emoji-custom-button {

            background: var(--primary-very-low, #f0f0f0); border: 1px solid var(--primary-low, #ccc);

            color: var(--primary-medium, #444); font-size: 1.4em; padding: 5px 10px;

            border-radius: 4px; cursor: pointer; line-height: 1;

            transition: background-color 0.2s;

        }

        .emoji-custom-button:hover { background-color: var(--primary-low, #e0e0e0); }

        .emoji-custom-button[disabled] { cursor: wait; opacity: 0.5; }



        #emoji-panel-container {

            position: fixed; width: 380px; height: 420px; border-radius: 8px;

            display: none; flex-direction: column; z-index: 2147483647; /* Z-INDEX MÁXIMO */

            box-shadow: 0 10px 25px -5px rgba(0,0,0,0.2), 0 8px 10px -6px rgba(0,0,0,0.2);

            overflow: hidden;

        }

        #emoji-panel-container.visible { display: flex; }



        .emoji-panel-header { padding: 8px; flex-shrink: 0; }

        .emoji-search-wrapper { position: relative; display: flex; align-items: center; }



        #emoji-search-input {

            width: 100%; padding: 8px 12px 8px 36px; border-radius: 6px;

            border: 1px solid transparent; font-size: 14px;

        }

        #emoji-search-input:focus {

            outline: none; border-color: var(--tertiary, #87b3de);

            box-shadow: 0 0 0 2px var(--tertiary-low, rgba(135,179,222,0.2));

        }



        .emoji-search-icon { position: absolute; left: 12px; width: 16px; height: 16px; pointer-events: none; }

        .emoji-panel-body { display: flex; flex-direction: row; flex-grow: 1; overflow: hidden; }

        #emoji-categories { width: 50px; padding: 8px 0; display: flex; flex-direction: column; align-items: center; flex-shrink: 0; overflow-y: auto; }

        .emoji-category-btn {

            width: 36px; height: 36px; border-radius: 6px; border: none; background-color: transparent;

            cursor: pointer; margin: 2px 0; padding: 4px; transition: background-color 0.2s ease; flex-shrink: 0;

        }

        .emoji-category-btn img { width: 100%; height: 100%; pointer-events: none; }

        #emoji-grid-area { display: flex; flex-direction: column; flex-grow: 1; overflow: hidden; }

        #emoji-category-title { font-size: 12px; font-weight: 600; text-transform: uppercase; padding: 8px 12px; margin: 0; flex-shrink: 0; }

        #emoji-grid { flex-grow: 1; padding: 0 4px 8px 12px; overflow-y: auto; }

        .emoji-item { display: inline-flex; justify-content: center; align-items: center; width: 40px; height: 40px; padding: 4px; border-radius: 6px; cursor: pointer; transition: background-color 0.2s ease; }

        .emoji-item img { width: 30px; height: 30px; pointer-events: none; }

        

        /* --- ESTILOS PERSONALIZADOS TEMA CLARO --- */

        html.light-scheme #emoji-panel-container { border: 1px solid #e8e8ea !important; }

        html.light-scheme .emoji-panel-header { background-color: #f8f8f9 !important; border-bottom: 1px solid #e8e8ea !important; }

        html.light-scheme #emoji-search-input { background-color: #ffffff !important; border-color: #ced4da !important; color: #495057 !important; }

        html.light-scheme .emoji-search-icon { color: #6c757d !important; }

        html.light-scheme #emoji-categories { background-color: #e8e8ea !important; }

        html.light-scheme #emoji-grid-area { background-color: #ffffff !important; }

        html.light-scheme #emoji-category-title { color: #6c757d !important; }

        html.light-scheme .emoji-category-btn.active { background-color: #ced4da !important; }

        html.light-scheme .emoji-item:hover { background-color: #e9ecef !important; }



        /* --- ESTILOS PERSONALIZADOS TEMA OSCURO --- */

        html.dark-scheme #emoji-panel-container { border: 1px solid #2d323a !important; }

        html.dark-scheme .emoji-panel-header { background-color: #25292f !important; border-bottom: 1px solid #2d323a !important; }

        html.dark-scheme #emoji-search-input { background-color: #202124 !important; border-color: #555 !important; color: #e0e0e0 !important; }

        html.dark-scheme #emoji-search-input::placeholder { color: #aaa !important; }

        html.dark-scheme .emoji-search-icon { color: #aaa !important; }

        html.dark-scheme #emoji-categories { background-color: #2d323a !important; }

        html.dark-scheme #emoji-grid-area { background-color: #202124 !important; }

        html.dark-scheme #emoji-category-title { color: #aaa !important; }

        html.dark-scheme .emoji-category-btn.active { background-color: #4a4a4a !important; }

        html.dark-scheme .emoji-item:hover { background-color: #4a4a4a !important; }



        /* --- ESTILOS SCROLLBAR --- */

        #emoji-grid::-webkit-scrollbar, #emoji-categories::-webkit-scrollbar { width: 8px; }

        html.light-scheme #emoji-grid::-webkit-scrollbar-track, html.light-scheme #emoji-categories::-webkit-scrollbar-track { background: #fcfcfc !important; }

        html.light-scheme #emoji-grid::-webkit-scrollbar-thumb, html.light-scheme #emoji-categories::-webkit-scrollbar-thumb { background: #636363 !important; }

        html.dark-scheme #emoji-grid::-webkit-scrollbar-track, html.dark-scheme #emoji-categories::-webkit-scrollbar-track { background: #2c2c2c !important; }

        html.dark-scheme #emoji-grid::-webkit-scrollbar-thumb, html.dark-scheme #emoji-categories::-webkit-scrollbar-thumb { background: #9f9f9f !important; }

    `);



    /**

     * =================================================================

     * LÓGICA DEL SCRIPT (Sin cambios)

     * =================================================================

     */

    let emojiDataCache = null;



    function addCustomToolbar() {

        const editorContainer = document.querySelector('.d-editor-container');

        if (!editorContainer || editorContainer.querySelector('.emoji-custom-toolbar')) return;

        const discourseToolbar = editorContainer.querySelector('div.d-editor-button-bar');

        if (!discourseToolbar) return;



        const customToolbar = document.createElement('div');

        customToolbar.className = 'emoji-custom-toolbar';

        const btn = document.createElement('button');

        btn.id = 'custom-emoji-panel-btn';

        btn.className = 'emoji-custom-button';

        btn.title = 'Abrir panel de emojis';

        btn.textContent = '💬';

        btn.addEventListener('click', (e) => {

            e.preventDefault();

            handlePanelActivation(e.currentTarget);

        });

        customToolbar.appendChild(btn);

        discourseToolbar.parentNode.insertBefore(customToolbar, discourseToolbar);

    }



    async function getEmojiData() {

        if (emojiDataCache) return emojiDataCache;

        try {

            const response = await fetch('/discuss/emojis.json');

            if (!response.ok) throw new Error(`Error de red: ${response.status}`);

            const data = await response.json();

            

            emojiDataCache = {

                categoryOrder: Object.keys(data),

                categories: data

            };

            return emojiDataCache;

        } catch (error) {

            showNotification('Error al cargar la lista de emojis.', 'error');

            return null;

        }

    }



    async function handlePanelActivation(triggerButton) {

        triggerButton.disabled = true;

        const emojiData = await getEmojiData();

        triggerButton.disabled = false;

        if (!emojiData) return;



        if (!document.getElementById('emoji-panel-container')) {

            createEmojiPanel(emojiData);

            addGlobalEventListeners();

        }

        togglePanel(triggerButton);

    }



    function createEmojiPanel(emojiData) {

        const container = document.createElement('div');

        container.id = 'emoji-panel-container';



        const header = document.createElement('div');

        header.className = 'emoji-panel-header';

        header.innerHTML = `

            <div class="emoji-search-wrapper">

                <svg class="emoji-search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"/></svg>

                <input type="text" id="emoji-search-input" placeholder="Busca por nombre de emoji y alias...">

            </div>

        `;

        container.appendChild(header);



        const body = document.createElement('div');

        body.className = 'emoji-panel-body';



        const categoriesContainer = document.createElement('div');

        categoriesContainer.id = 'emoji-categories';

        categoriesContainer.addEventListener('click', (e) => handleCategoryClick(e, emojiData));



        const gridArea = document.createElement('div');

        gridArea.id = 'emoji-grid-area';

        const gridTitle = document.createElement('h2');

        gridTitle.id = 'emoji-category-title';

        const gridContainer = document.createElement('div');

        gridContainer.id = 'emoji-grid';

        gridContainer.addEventListener('click', handleEmojiClick);



        gridArea.append(gridTitle, gridContainer);

        body.append(categoriesContainer, gridArea);

        container.appendChild(body);

        document.body.appendChild(container);



        document.getElementById('emoji-search-input').addEventListener('input', (e) => handleSearch(e, emojiData));



        populateCategories(emojiData);

        if (emojiData.categoryOrder.length > 0) {

            displayEmojisForCategory(emojiData.categoryOrder[0], emojiData);

            const firstCategoryBtn = categoriesContainer.querySelector('.emoji-category-btn');

            if (firstCategoryBtn) firstCategoryBtn.classList.add('active');

        }

    }



    function togglePanel(triggerButton) {

        const container = document.getElementById('emoji-panel-container');

        if (!container || !triggerButton) return;

        if (container.classList.contains('visible')) {

            container.classList.remove('visible');

        } else {

            const triggerRect = triggerButton.getBoundingClientRect();

            container.style.top = `${triggerRect.bottom + 5}px`;

            let leftPosition = triggerRect.left;

            if (leftPosition + container.offsetWidth > window.innerWidth) {

                leftPosition = window.innerWidth - container.offsetWidth - 10;

            }

            container.style.left = `${leftPosition}px`;

            container.classList.add('visible');

        }

    }

    

    function addGlobalEventListeners() {

        document.addEventListener('click', (event) => {

            const container = document.getElementById('emoji-panel-container');

            const trigger = document.getElementById('custom-emoji-panel-btn');

            if (container && container.classList.contains('visible')) {

                if (!container.contains(event.target) && (!trigger || !trigger.contains(event.target))) {

                    container.classList.remove('visible');

                }

            }

        });

        document.addEventListener('keydown', (event) => {

            if (event.key === 'Escape') {

                const container = document.getElementById('emoji-panel-container');

                if (container && container.classList.contains('visible')) {

                    container.classList.remove('visible');

                }

            }

        });

    }



    function populateCategories(emojiData) {

        const container = document.getElementById('emoji-categories');

        container.innerHTML = '';

        emojiData.categoryOrder.forEach(categoryId => {

            const firstEmoji = emojiData.categories[categoryId]?.[0];

            if (!firstEmoji) return;

            const btn = document.createElement('button');

            btn.className = 'emoji-category-btn';

            btn.dataset.category = categoryId;

            btn.title = categoryId.replace(/_/g, ' ');

            const img = document.createElement('img');

            img.src = firstEmoji.url;

            img.alt = categoryId;

            btn.appendChild(img);

            container.appendChild(btn);

        });

    }



    function displayEmojis(emojiList) {

        const grid = document.getElementById('emoji-grid');

        grid.innerHTML = '';

        emojiList.forEach(emoji => {

            const item = document.createElement('div');

            item.className = 'emoji-item';

            item.dataset.code = `:${emoji.name}:`;

            item.title = emoji.name.replace(/_/g, ' ');

            const img = document.createElement('img');

            img.src = emoji.url;

            img.alt = emoji.name;

            item.appendChild(img);

            grid.appendChild(item);

        });

        grid.scrollTop = 0;

    }



    function displayEmojisForCategory(categoryId, emojiData) {

        document.getElementById('emoji-category-title').textContent = categoryId.replace(/_/g, ' ');

        displayEmojis(emojiData.categories[categoryId] || []);

    }



    function handleSearch(event, emojiData) {

        const searchTerm = event.target.value.toLowerCase().trim();

        const categoryTitle = document.getElementById('emoji-category-title');

        const categoriesContainer = document.getElementById('emoji-categories');



        if (!searchTerm) {

            const activeCategory = categoriesContainer.querySelector('.active')?.dataset.category || emojiData.categoryOrder[0];

            displayEmojisForCategory(activeCategory, emojiData);

            categoriesContainer.style.opacity = '1';

            categoryTitle.style.display = 'block';

            return;

        }



        categoriesContainer.style.opacity = '0.5';

        categoryTitle.style.display = 'none';

        

        const allEmojis = Object.values(emojiData.categories).flat();

        const searchResults = allEmojis.filter(emoji => {

            const nameMatch = emoji.name.toLowerCase().includes(searchTerm);

            const aliasMatch = emoji.search_aliases?.some(alias => alias.toLowerCase().includes(searchTerm));

            return nameMatch || aliasMatch;

        });



        displayEmojis(searchResults);

    }



    function handleCategoryClick(event, emojiData) {

        const btn = event.target.closest('.emoji-category-btn');

        if (!btn) return;

        const searchInput = document.getElementById('emoji-search-input');

        if (searchInput.value) {

            searchInput.value = '';

            searchInput.dispatchEvent(new Event('input'));

        }



        const categoryId = btn.dataset.category;

        if (categoryId) {

            document.querySelectorAll('#emoji-categories .emoji-category-btn').forEach(b => b.classList.remove('active'));

            btn.classList.add('active');

            displayEmojisForCategory(categoryId, emojiData);

        }

    }



    function handleEmojiClick(event) {

        const item = event.target.closest('.emoji-item');

        if (!item) return;

        const codeToInsert = item.dataset.code + ' ';

        const editorTextarea = document.querySelector('textarea.d-editor-input');

        if (editorTextarea) {

            insertAtCursor(editorTextarea, codeToInsert);

            editorTextarea.focus();

        }

    }



    function insertAtCursor(field, textToInsert) {

        const startPos = field.selectionStart;

        const endPos = field.selectionEnd;

        field.value = field.value.substring(0, startPos) + textToInsert + field.value.substring(endPos, field.value.length);

        field.selectionStart = startPos + textToInsert.length;

        field.selectionEnd = startPos + textToInsert.length;

        const event = new Event('input', { bubbles: true, cancelable: true });

        field.dispatchEvent(event);

    }

    

    function showNotification(message, type = 'error') {

        let notification = document.querySelector('.emoji-panel-notification');

        if (!notification) {

            notification = document.createElement('div');

            document.body.appendChild(notification);

        }

        notification.className = `emoji-panel-notification ${type}`;

        notification.textContent = message;

        setTimeout(() => notification.classList.add('show'), 10);

        setTimeout(() => {

            notification.classList.remove('show');

            notification.addEventListener('transitionend', () => notification.remove(), { once: true });

        }, 3500);

    }



    function initialize() {

        const observer = new MutationObserver(addCustomToolbar);

        observer.observe(document.body, { childList: true, subtree: true });

        addCustomToolbar();

    }



    if (document.readyState === 'complete') {

        setTimeout(initialize, 250);

    } else {

        window.addEventListener('load', () => setTimeout(initialize, 250));

    }



})();