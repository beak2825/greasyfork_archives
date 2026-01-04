// ==UserScript==
// @name         Bookmarklet Hub
// @namespace    http://tampermonkey.net/
// @version      1.91
// @description  A hub to manage and run bookmarklets. Ctrl+Alt+B to open panel. Import/Export JSON and Drag & Drop added. FIXES ADDING BOOKMARKLETS.
// @author       Dijon The Mustard and *A LOT* of ChatGPT
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535789/Bookmarklet%20Hub.user.js
// @updateURL https://update.greasyfork.org/scripts/535789/Bookmarklet%20Hub.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PANEL_ID = 'bookmarklet-hub-panel';
    const STORAGE_KEY = 'bookmarkletHubData';

    let bookmarklets = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    let draggedItem = null;

    function saveBookmarklets() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarklets));
    }

    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;600&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    const style = document.createElement('style');
    style.textContent = `
        .bm-folder-items {
            overflow: hidden;
            max-height: 0;
            opacity: 0;
            transition: max-height 0.5s ease, opacity 0.5s ease;
        }
        .bm-folder-items.open {
            max-height: 1000px;
            opacity: 1;
        }
        .hub-button {
            background: transparent;
            color: #00c853;
            border: 1px solid #00c853;
            border-radius: 4px;
            padding: 4px 8px;
            font-weight: bold;
            font-size: 14px;
            cursor: pointer;
            margin-right: 6px;
        }
        .hub-button:hover {
            background-color: #00c85311;
        }
        .bookmarklet-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 6px;
            cursor: grab;
        }
        .bookmarklet-item.dragging {
            opacity: 0.5;
        }
        .folder-summary {
            cursor: pointer;
            font-weight: bold;
            margin-top: 8px;
            display: flex;
            align-items: center;
        }
        .folder-summary span {
            color: #ffd83d;
            margin-right: 4px;
        }
        .folder-summary.drag-over {
            background-color: rgba(255, 216, 61, 0.1);
        }
    `;
    document.head.appendChild(style);

    function createPanel() {
        if (document.getElementById(PANEL_ID)) return;

        const panel = document.createElement('div');
        panel.id = PANEL_ID;
        panel.style.position = 'fixed';
        panel.style.top = '10px';
        panel.style.left = '10px';
        panel.style.zIndex = 99999;
        panel.style.padding = '12px';
        panel.style.background = '#222';
        panel.style.color = 'white';
        panel.style.border = '1px solid #444';
        panel.style.borderRadius = '10px';
        panel.style.boxShadow = '0 0 15px rgba(0,0,0,0.6)';
        panel.style.maxWidth = '340px';
        panel.style.fontFamily = "'Outfit', sans-serif";
        panel.style.cursor = 'move';

        panel.innerHTML = `
            <div id="bookmarklet-hub-header" style="margin-bottom:10px; font-weight:600; font-size:22px; cursor:move; text-align: center; letter-spacing: 1px; color: #ffd83d;">
                >> Bookmarklet Hub <<
                <button id="close-hub" style="
                    float:right;
                    background:transparent;
                    color:#ff0033;
                    border:1px solid #ff0033;
                    border-radius:6px;
                    padding:0 8px;
                    cursor:pointer;
                    font-weight:bold;
                    font-size:14px;
                ">✕</button>
            </div>
            <input id="search-bar" type="text" placeholder="Search bookmarklets..." style="width: 100%; padding: 6px 8px; margin-bottom: 12px; border-radius: 4px; border: none; font-size: 14px;" />
            <ul id="bookmarklet-list" style="list-style:none; padding-left:0; max-height:300px; overflow-y: auto;"></ul>
            <hr style="margin:12px 0; border:1px solid #999;">
            <div style="margin-bottom: 10px;">
                <input id="bm-name" placeholder="Name" style="width:45%; margin:6px 0; padding:4px; border-radius:4px; border:none;" />
                <input id="bm-code" placeholder="Code (no javascript:)" style="width:100%; margin-bottom:6px; padding:4px; border-radius:4px; border:none;" />
                <input id="bm-folder" placeholder="Folder (optional)" style="width:100%; margin-bottom:6px; padding:4px; border-radius:4px; border:none;" />
                <button id="add-bookmarklet" style="
                    background: transparent;
                    background-clip: text;
                    -webkit-background-clip: text;
                    color: #00c853;
                    border: none;
                    padding:6px 12px;
                    font-weight:bold;
                    font-size:14px;
                    cursor:pointer;
                ">+ Add Bookmarklet</button>
            </div>
            <hr style="margin:12px 0; border:1px solid #999;">
            <div style="display: flex; gap: 8px; margin-top: 10px;">
                <button id="import-bookmarklets" class="hub-button">Import JSON</button>
                <button id="export-bookmarklets" class="hub-button">Export JSON</button>
            </div>
        `;

        document.body.appendChild(panel);

        let isDraggingPanel = false;
        let panelOffsetX = 0;
        let panelOffsetY = 0;

        const header = panel.querySelector('#bookmarklet-hub-header');

        header.addEventListener('mousedown', (e) => {
            isDraggingPanel = true;
            panelOffsetX = e.clientX - panel.offsetLeft;
            panelOffsetY = e.clientY - panel.offsetTop;
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mouseup', () => {
            isDraggingPanel = false;
            document.body.style.userSelect = '';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDraggingPanel) {
                panel.style.left = (e.clientX - panelOffsetX) + 'px';
                panel.style.top = (e.clientY - panelOffsetY) + 'px';
            }
        });

        panel.querySelector('#close-hub').onclick = () => panel.remove();

        panel.querySelector('#add-bookmarklet').onclick = () => {
            const name = panel.querySelector('#bm-name').value.trim();
            const code = panel.querySelector('#bm-code').value.trim();
            const folder = panel.querySelector('#bm-folder').value.trim() || 'Root';
            if (!name || !code) return;
            bookmarklets.push({ name, code, folder });
            saveBookmarklets();
            renderList();
        };

        panel.querySelector('#search-bar').addEventListener('input', function() {
            const query = this.value.toLowerCase();
            renderList(query);
        });

        panel.querySelector('#import-bookmarklets').addEventListener('click', () => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'application/json';
            fileInput.onchange = (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            const importedData = JSON.parse(e.target.result);
                            if (Array.isArray(importedData)) {
                                bookmarklets = importedData;
                                saveBookmarklets();
                                renderList();
                                alert('Bookmarklets imported successfully!');
                            } else {
                                alert('Invalid JSON format.');
                            }
                        } catch (error) {
                            alert('Error parsing JSON file.');
                        }
                    };
                    reader.readAsText(file);
                }
            };
            fileInput.click();
        });

        panel.querySelector('#export-bookmarklets').addEventListener('click', () => {
            const jsonString = JSON.stringify(bookmarklets, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'bookmarklets.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });

        renderList();
    }

    function renderList(query = '') {
        const list = document.querySelector('#bookmarklet-list');
        if (!list) return;

        list.innerHTML = '';
        const folders = {};

        bookmarklets.forEach((bm, index) => { // Use the top-level bookmarklets array
            const folder = bm.folder || 'Root';
            if (!folders[folder]) folders[folder] = [];
            folders[folder].push({ ...bm, _index: index });
        });

        Object.entries(folders).forEach(([folderName, items]) => {
            const folderEl = document.createElement('li');

            const summary = document.createElement('div');
            summary.classList.add('folder-summary');
            summary.innerHTML = `<span aria-hidden="true">⮞</span> ${folderName}`;
            let isExpanded = false;
            const itemList = document.createElement('ul');
            itemList.classList.add('bm-folder-items');
            itemList.style.listStyle = 'none';
            itemList.style.paddingLeft = '12px';

            summary.onclick = () => {
                isExpanded = !isExpanded;
                itemList.classList.toggle('open', isExpanded);
                summary.querySelector('span').textContent = isExpanded ? '⮟' : '⮞';
            };

            summary.addEventListener('dragover', (e) => {
                e.preventDefault();
                if (draggedItem && draggedItem.folder !== folderName) {
                    summary.classList.add('drag-over');
                }
            });

            summary.addEventListener('dragleave', () => {
                summary.classList.remove('drag-over');
            });

            summary.addEventListener('drop', (e) => {
                e.preventDefault();
                summary.classList.remove('drag-over');
                if (draggedItem && draggedItem.folder !== folderName) {
                    const oldIndex = bookmarklets.findIndex(bm => bm.name === draggedItem.name && bm.code === draggedItem.code && bm.folder === draggedItem.folder);
                    if (oldIndex !== -1) {
                        bookmarklets[oldIndex].folder = folderName;
                        saveBookmarklets();
                        renderList();
                    }
                    draggedItem = null;
                }
            });

            items.forEach((bm) => {
                if (query && !bm.name.toLowerCase().includes(query)) return;

                const li = document.createElement('li');
                li.classList.add('bookmarklet-item');
                li.draggable = true;
                li.dataset.index = bm._index;

                const controls = document.createElement('div');
                controls.style.display = 'flex';
                controls.style.alignItems = 'center';

                const runBtn = document.createElement('button');
                runBtn.textContent = '⮞';
                runBtn.style.background = 'transparent';
                runBtn.style.color = '#00c853';
                runBtn.style.border = '1px solid #00c853';
                runBtn.style.borderRadius = '4px';
                runBtn.style.marginRight = '6px';
                runBtn.style.padding = '2px 6px';
                runBtn.style.cursor = 'pointer';
                runBtn.onclick = () => {
                    try {
                        const fn = new Function(bm.code);
                        fn();
                    } catch (e) {
                        alert('Error running bookmarklet: ' + e);
                    }
                };
                controls.appendChild(runBtn);

                const nameSpan = document.createElement('span');
                nameSpan.textContent = bm.name;
                nameSpan.style.flexGrow = '1';
                controls.appendChild(nameSpan);

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = '✕';
                deleteBtn.style.background = 'transparent';
                deleteBtn.style.color = '#d50000';
                deleteBtn.style.border = '1px solid #d50000';
                deleteBtn.style.borderRadius = '4px';
                deleteBtn.style.padding = '2px 6px';
                deleteBtn.style.cursor = 'pointer';
                deleteBtn.onclick = () => {
                    bookmarklets.splice(bookmarklets.findIndex(b => b._index === bm._index), 1);
                    saveBookmarklets();
                    renderList();
                };
                controls.appendChild(deleteBtn);

                li.appendChild(controls);
                itemList.appendChild(li);

                li.addEventListener('dragstart', (e) => {
                    draggedItem = { name: bm.name, code: bm.code, folder: bm.folder, index: bm._index };
                    li.classList.add('dragging');
                    e.dataTransfer.setData('text/plain', ''); // Required for Firefox
                });

                li.addEventListener('dragend', () => {
                    li.classList.remove('dragging');
                    draggedItem = null;
                });
            });

            // Open the folder if there are any matching items
            if (query) {
                const hasMatch = items.some(bm => bm.name.toLowerCase().includes(query));
                if (hasMatch) {
                    itemList.classList.add('open');
                    summary.querySelector('span').textContent = '⮟';
                }
            }

            folderEl.appendChild(summary);
            folderEl.appendChild(itemList);
            list.appendChild(folderEl);
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.altKey && e.key === 'b') {
            e.preventDefault();
            createPanel();
        }
    });
})();