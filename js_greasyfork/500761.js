// ==UserScript==
// @name         Manganato Hide Manga
// @icon         https://manganato.com/favicon-96x96.png
// @namespace    Manganato
// @version      0.1.9
// @description  Hide manga on Manganato based url
// @author       fafnirtelu
// @match        https://manganato.com/*
// @match        https://chapmanganato.to/*
// @license MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/500761/Manganato%20Hide%20Manga.user.js
// @updateURL https://update.greasyfork.org/scripts/500761/Manganato%20Hide%20Manga.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let mangaToHide = GM_getValue('hiddenManga', []);
    let isHidingEnabled = GM_getValue('isHidingEnabled', true);

    function getMangaId(element) {
        const link = element.querySelector('a[href*="/manga-"]');
        if (link) {
            const href = link.getAttribute('href');
            return href.split('/manga-')[1];
        }
        return null;
    }

    function getCurrentMangaId() {
        const path = window.location.pathname;
        if (path.includes('/manga-')) {
            return path.split('/manga-')[1];
        }
        return null;
    }

    function getMangaTitle(element) {
        let title = element.querySelector('.item-title')?.textContent.trim() ||
                    element.querySelector('h3.item-title')?.textContent.trim() ||
                    element.querySelector('.genres-item-name')?.textContent.trim() ||
                    element.querySelector('h1')?.textContent.trim();
        if (!title) {
            title = document.querySelector('h1')?.textContent.trim() || 'Unknown Title';
        }
        return title;
    }

    function createHideButton() {
        const hideButton = document.createElement('button');
        hideButton.textContent = '❌ Hide this manga';
        hideButton.className = 'hide-manga-button';
        hideButton.style.cssText = `
            display: block;
            margin-top: 5px;
            margin-bottom: 5px;
            cursor: pointer;
            border: 1px solid #888;
            background: var(--block-btn-bgcolor, #eee);
            color: var(--block-btn-color, inherit);
            padding: 5px 10px;
            border-radius: 3px;
        `;

        hideButton.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();

            const container = this.closest('.content-homepage-item, .search-story-item, .content-genres-item, .panel-story-info');
            const mangaId = getCurrentMangaId() || getMangaId(container);
            const title = getMangaTitle(container || document);

            if (mangaId && !mangaToHide.includes(mangaId)) {
                mangaToHide.push(mangaId);
                GM_setValue('hiddenManga', mangaToHide);
                GM_setValue(`manga_${mangaId}`, title);

                if (window.location.hostname === 'chapmanganato.to') {
                    window.location.href = 'https://manganato.com/';
                } else if (window.location.pathname.includes('/manga-')) {
                    window.location.href = '/';
                } else {
                    hideManga();
                }
            }
        });

        return hideButton;
    }

    function addHideButton(item) {
        if (!item.querySelector('.hide-manga-button')) {
            const hideButton = createHideButton();

            if (item.classList.contains('content-homepage-item')) {
                const titleElement = item.querySelector('.item-title');
                if (titleElement) {
                    titleElement.parentNode.insertBefore(hideButton, titleElement.nextSibling);
                }
            } else if (item.classList.contains('content-genres-item')) {
                const genresItemInfo = item.querySelector('.genres-item-info');
                if (genresItemInfo) {
                    const titleElement = genresItemInfo.querySelector('h3');
                    if (titleElement) {
                        titleElement.parentNode.insertBefore(hideButton, titleElement.nextSibling);
                    }
                }
            } else {
                const targetElement = item.querySelector('.item-right') || item;
                targetElement.appendChild(hideButton);
            }
        }
    }

    function hideManga() {
        const mangaItems = document.querySelectorAll('.content-homepage-item, .search-story-item, .content-genres-item');
        mangaItems.forEach(item => {
            const mangaId = getMangaId(item);
            if (mangaId) {
                if (isHidingEnabled && mangaToHide.includes(mangaId)) {
                    item.style.display = 'none';
                } else {
                    item.style.display = '';
                    addHideButton(item);
                }
            }
        });
    }

    function addHideButtonToMangaPage() {
        const storyInfoLeft = document.querySelector('.story-info-left');
        if (storyInfoLeft && !storyInfoLeft.querySelector('.hide-manga-button')) {
            const hideButton = createHideButton();
            hideButton.style.marginTop = '10px';
            storyInfoLeft.appendChild(hideButton);
        }
    }

    function exportHiddenManga() {
        const exportData = mangaToHide.map(id => {
            const title = GM_getValue(`manga_${id}`, 'Unknown Title');
            return `${id}:${title}`;
        }).join('\n');

        const blob = new Blob([exportData], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'hidden_manga_list.txt';
        a.click();

        URL.revokeObjectURL(url);
    }

    function importHiddenManga(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const content = e.target.result;
                const lines = content.split('\n');
                lines.forEach(line => {
                    const [id, title] = line.split(':');
                    if (id && title && !mangaToHide.includes(id)) {
                        mangaToHide.push(id);
                        GM_setValue(`manga_${id}`, title);
                    }
                });
                GM_setValue('hiddenManga', mangaToHide);
                alert('Import completed. Settings window will refresh.');
                openSettingsWindow();
            };
            reader.readAsText(file);
        }
    }

    function openSettingsWindow() {
        const settingsWindow = document.createElement('div');
        settingsWindow.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.3);
            z-index: 9999;
            max-height: 80vh;
            overflow-y: auto;
            width: 350px;
            font-family: Arial, sans-serif;
        `;

        const title = document.createElement('h2');
        title.textContent = 'Manganato Hide Settings';
        title.style.cssText = `
            margin-top: 0;
            color: #333;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
            text-align: center;
            font-weight: bold;
        `;
        settingsWindow.appendChild(title);

        // Hide Manga Checkbox
        const hideCheckboxDiv = document.createElement('div');
        hideCheckboxDiv.style.marginBottom = '20px';
        const hideCheckbox = document.createElement('input');
        hideCheckbox.type = 'checkbox';
        hideCheckbox.id = 'hide-manga-checkbox';
        hideCheckbox.checked = isHidingEnabled;
        const hideLabel = document.createElement('label');
        hideLabel.htmlFor = 'hide-manga-checkbox';
        hideLabel.textContent = 'Hide Manga';
        hideLabel.style.marginLeft = '10px';
        hideCheckboxDiv.appendChild(hideCheckbox);
        hideCheckboxDiv.appendChild(hideLabel);
        settingsWindow.appendChild(hideCheckboxDiv);

        hideCheckbox.addEventListener('change', function() {
            isHidingEnabled = this.checked;
            GM_setValue('isHidingEnabled', isHidingEnabled);
            hideManga();
        });

        // Hidden Manga List
        const listTitle = document.createElement('h3');
        listTitle.textContent = 'Hidden Manga List';
        listTitle.style.marginBottom = '10px';
        settingsWindow.appendChild(listTitle);

        const listDiv = document.createElement('div');
        listDiv.style.cssText = `
            max-height: 200px;
            overflow-y: auto;
            border: 1px solid #ccc;
            padding: 10px;
            margin-bottom: 20px;
            border-radius: 5px;
        `;

        mangaToHide.forEach(id => {
            const itemDiv = document.createElement('div');
            itemDiv.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 5px;
            `;
            const mangaTitle = GM_getValue(`manga_${id}`, 'Unknown Title');
            const titleSpan = document.createElement('span');
            titleSpan.textContent = mangaTitle;
            titleSpan.style.overflow = 'hidden';
            titleSpan.style.textOverflow = 'ellipsis';
            titleSpan.style.whiteSpace = 'nowrap';
            titleSpan.style.marginRight = '10px';
            itemDiv.appendChild(titleSpan);

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.style.cssText = `
                padding: 2px 5px;
                background: #f44336;
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                white-space: nowrap;
            `;
            removeButton.addEventListener('click', () => {
                mangaToHide = mangaToHide.filter(item => item !== id);
                GM_setValue('hiddenManga', mangaToHide);
                GM_deleteValue(`manga_${id}`);
                itemDiv.remove();
                hideManga();
            });

            itemDiv.appendChild(removeButton);
            listDiv.appendChild(itemDiv);
        });
        settingsWindow.appendChild(listDiv);

        // Export button
        const exportButton = document.createElement('button');
        exportButton.textContent = 'Export to TXT';
        exportButton.style.cssText = `
            margin-right: 10px;
            padding: 5px 10px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        `;
        exportButton.addEventListener('click', exportHiddenManga);
        settingsWindow.appendChild(exportButton);

        // Import button and file input
        const importButton = document.createElement('button');
        importButton.textContent = 'Import from TXT';
        importButton.style.cssText = `
            padding: 5px 10px;
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        `;
        const importInput = document.createElement('input');
        importInput.type = 'file';
        importInput.accept = '.txt';
        importInput.style.display = 'none';
        importInput.addEventListener('change', importHiddenManga);
        importButton.addEventListener('click', () => importInput.click());
        settingsWindow.appendChild(importButton);
        settingsWindow.appendChild(importInput);

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.cssText = `
            display: block;
            margin-top: 20px;
            padding: 5px 10px;
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        `;
        closeButton.addEventListener('click', () => document.body.removeChild(settingsWindow));
        settingsWindow.appendChild(closeButton);

        document.body.appendChild(settingsWindow);
    }

function addConfigureButton() {
    const headerMenu = document.querySelector('.header-menu');
    if (headerMenu && !headerMenu.querySelector('#configure-hidden-manga')) {
        const configureButton = document.createElement('a');
        configureButton.id = 'configure-hidden-manga';
        configureButton.className = 'a-h';
        configureButton.href = 'javascript:void(0);';
        configureButton.title = 'Configure Hidden Manga';
        configureButton.textContent = 'CONFIGURE';
        configureButton.style.cssText = `
            float: left;
            height: 55px;
            color: #fff;
            font-size: 16px;
            line-height: 55px;
            padding: 0 20px;
            cursor: pointer;
        `;

        // Add separate stylesheet
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 800px) {
                #configure-hidden-manga {
                    width: 100% !important;
                    background: #fff !important;
                    color: #fd5e18 !important;
                }
            }
        `;
        document.head.appendChild(style);

        configureButton.addEventListener('click', openSettingsWindow);

        headerMenu.appendChild(configureButton);
    }
}

    function resetAllHiddenManga() {
        if (confirm('Are you sure you want to reset all hidden manga? This action cannot be undone.')) {
            mangaToHide.forEach(id => {
                GM_deleteValue(`manga_${id}`);
            });
            mangaToHide = [];
            GM_setValue('hiddenManga', []);
            alert('All hidden manga have been reset.');
            hideManga();
        }
    }

    GM_registerMenuCommand("Configure", openSettingsWindow);
    GM_registerMenuCommand("Reset All Hidden Manga", resetAllHiddenManga);

    function init() {
        hideManga();
        addConfigureButton();
        addHideButtonToMangaPage();
    }

    window.addEventListener('load', init);

    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.type === 'childList') {
                init();
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();