// ==UserScript==
// @name         Humble LibGen Companion
// @namespace    https://github.com/source-guilherme
// @version      4.3
// @description  Adds a floating panel to Humble Bundle book pages with quick LibGen search links by book title or author, supporting fiction/non-fiction modes, query sanitizing, and persistent dark mode.
// @author       Source-Guilherme
// @match        https://www.humblebundle.com/books/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533348/Humble%20LibGen%20Companion.user.js
// @updateURL https://update.greasyfork.org/scripts/533348/Humble%20LibGen%20Companion.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let searchMode = localStorage.getItem('libgenSearchMode') || 'nonfiction';
    let searchField = localStorage.getItem('libgenSearchField') || 'book';
    let searchSource = localStorage.getItem('libgenSearchSource') || 'libgen';
    let theme = localStorage.getItem('libgenPanelTheme') || 'light';
    let libgenViewMode = 'simple';

    const seenTitles = new Set();
    const libgenIconURL = 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Emoji_u1f517.svg';

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    const panel = document.createElement('div');
    panel.id = 'libgen-panel';
    panel.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        width: 340px;
        max-height: 70vh;
        overflow-y: auto;
        background: #fff;
        color: #000;
        border: 1px solid #ccc;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.3);
        z-index: 9999;
        padding: 10px;
        font-size: 14px;
        font-family: Arial, sans-serif;
        display: none;
    `;

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = '📚 Show LibGen Panel';
    toggleBtn.style = `
        position: fixed;
        top: 10px;
        right: 360px;
        z-index: 10000;
        background: #0073e6;
        color: white;
        border: none;
        border-radius: 6px;
        padding: 6px 12px;
        cursor: pointer;
        font-size: 14px;
    `;
    toggleBtn.onclick = () => {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    };

    const controls = document.createElement('div');
    controls.style = 'margin-bottom: 10px; display: flex; flex-wrap: wrap; gap: 6px; justify-content: center;';

    const themeBtn = document.createElement('button');
    themeBtn.textContent = `🌓 Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`;
    themeBtn.style = 'padding: 4px 8px; cursor: pointer;';
    themeBtn.style.width = '140px'; // or whatever size fits nicely
    themeBtn.style.textAlign = 'center';
    themeBtn.style.overflow = 'hidden';
    themeBtn.style.whiteSpace = 'nowrap';
    themeBtn.style.textOverflow = 'ellipsis'; // optional, if you want ellipsis
    themeBtn.onclick = () => {
        theme = theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('libgenPanelTheme', theme);
        themeBtn.textContent = `🌓 Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`;
        applyTheme();
    };

    const modeBtn = document.createElement('button');
    modeBtn.textContent = `🔍 Mode: ${searchMode === 'fiction' ? 'Fiction' : 'Non-Fiction'}`;
    modeBtn.style = 'padding: 4px 8px; cursor: pointer;';
    modeBtn.style.width = '140px'; // or whatever size fits nicely
    modeBtn.style.textAlign = 'center';
    modeBtn.style.overflow = 'hidden';
    modeBtn.style.whiteSpace = 'nowrap';
    modeBtn.style.textOverflow = 'ellipsis'; // optional, if you want ellipsis
    modeBtn.onclick = () => {
        searchMode = searchMode === 'fiction' ? 'nonfiction' : 'fiction';
        localStorage.setItem('libgenSearchMode', searchMode);
        modeBtn.textContent = `🔍 Mode: ${searchMode === 'fiction' ? 'Fiction' : 'Non-Fiction'}`;

        if (searchSource === 'libgen') {
            viewBtn.style.visibility = searchMode === 'fiction' ? 'hidden' : 'visible';
        }

        addLibgenLinks(true);
    };


    const fieldBtn = document.createElement('button');
    fieldBtn.textContent = `👤 Search: ${searchField === 'author' ? 'Author' : 'Book'}`;
    fieldBtn.style = 'padding: 4px 8px; cursor: pointer;';
    fieldBtn.style.width = '140px'; // or whatever size fits nicely
    fieldBtn.style.textAlign = 'center';
    fieldBtn.style.overflow = 'hidden';
    fieldBtn.style.whiteSpace = 'nowrap';
    fieldBtn.style.textOverflow = 'ellipsis'; // optional, if you want ellipsis
    fieldBtn.onclick = () => {
        searchField = searchField === 'book' ? 'author' : 'book';
        localStorage.setItem('libgenSearchField', searchField);
        fieldBtn.textContent = `👤 Search: ${searchField === 'author' ? 'Author' : 'Book'}`;
        addLibgenLinks(true);
    };

    const sourceBtn = document.createElement('button');
    sourceBtn.textContent = `🌐 Source: ${searchSource === 'anna' ? 'Anna' : 'LibGen'}`;
    sourceBtn.style = 'padding: 4px 8px; cursor: pointer;';
    sourceBtn.style.width = '140px'; // or whatever size fits nicely
    sourceBtn.style.textAlign = 'center';
    sourceBtn.style.overflow = 'hidden';
    sourceBtn.style.whiteSpace = 'nowrap';
    sourceBtn.style.textOverflow = 'ellipsis'; // optional, if you want ellipsis
    sourceBtn.onclick = () => {
        searchSource = searchSource === 'libgen' ? 'anna' : 'libgen';
        localStorage.setItem('libgenSearchSource', searchSource);
        sourceBtn.textContent = `🌐 Source: ${searchSource === 'anna' ? 'Anna' : 'LibGen'}`;

        const isLibgen = searchSource === 'libgen';
        viewBtn.style.visibility = isLibgen && searchMode !== 'fiction' ? 'visible' : 'hidden';
        modeBtn.style.visibility = isLibgen ? 'visible' : 'hidden';
        fieldBtn.style.visibility = 'visible'; // always
        themeBtn.style.visibility = 'visible'; // always
        sourceBtn.style.visibility = 'visible'; // always

        addLibgenLinks(true);
    };


    const viewBtn = document.createElement('button');
    viewBtn.textContent = `🔄 View: ${libgenViewMode === 'simple' ? 'Simple' : 'Detailed'}`;
    viewBtn.style = 'padding: 4px 8px; cursor: pointer;';
    viewBtn.style.width = '140px'; // or whatever size fits nicely
    viewBtn.style.textAlign = 'center';
    viewBtn.style.overflow = 'hidden';
    viewBtn.style.whiteSpace = 'nowrap';
    viewBtn.style.textOverflow = 'ellipsis'; // optional, if you want ellipsis
    viewBtn.onclick = () => {
        if (searchSource !== 'libgen') {
            alert('🔔 View switch only works in LibGen source mode.');
            return;
        }
        libgenViewMode = libgenViewMode === 'simple' ? 'detailed' : 'simple';
        viewBtn.textContent = `🔄 View: ${libgenViewMode.charAt(0).toUpperCase() + libgenViewMode.slice(1)}`;
        addLibgenLinks(true);
    };
    viewBtn.style.visibility = (searchSource === 'libgen' && searchMode !== 'fiction') ? 'inline-block' : 'none';
    modeBtn.style.visibility = searchSource === 'libgen' ? 'inline-block' : 'none';
    fieldBtn.style.visibility = 'inline-block';

    controls.appendChild(themeBtn);
    controls.appendChild(modeBtn);
    controls.appendChild(fieldBtn);
    controls.appendChild(sourceBtn);
    controls.appendChild(viewBtn);

    const linksContainer = document.createElement('div');
    linksContainer.id = 'libgen-links';

    panel.appendChild(controls);
    panel.appendChild(linksContainer);
    document.body.appendChild(toggleBtn);
    document.body.appendChild(panel);

    function applyTheme() {
        panel.style.background = theme === 'dark' ? '#222' : '#fff';
        panel.style.color = theme === 'dark' ? '#eee' : '#000';
        [themeBtn, modeBtn, fieldBtn, sourceBtn, viewBtn].forEach(btn => {
            btn.style.background = theme === 'dark' ? '#555' : '#ddd';
            btn.style.color = theme === 'dark' ? '#eee' : '#000';
        });
        [...linksContainer.querySelectorAll('a')].forEach(link => {
            link.style.color = theme === 'dark' ? '#9cf' : '#1a0dab';
        });
    }

    function addLibgenLinks(forceClear = false) {
        if (forceClear) seenTitles.clear();
        linksContainer.innerHTML = '';
        const bookBlocks = document.querySelectorAll('div.tier-item-details-view');
        bookBlocks.forEach(block => {
            const titleEl = block.querySelector('h2.heading-medium');
            if (!titleEl) return;
            let bookTitle = titleEl.textContent.trim();
            bookTitle = bookTitle.replace(/\b(\d+(st|nd|rd|th)|First|Second|Third|Fourth|Fifth) Edition\b/gi, '').trim();
            if (!bookTitle || seenTitles.has(bookTitle)) return;
            seenTitles.add(bookTitle);

            let author = null;
            const pubInfoBlocks = block.querySelectorAll('.publishers-and-developers');
            pubInfoBlocks.forEach(info => {
                if (info.textContent.includes('Author:')) {
                    const span = info.querySelector('span');
                    if (span) author = span.textContent.trim();
                }
            });

            let rawQuery = searchField === 'author' ? author : bookTitle;
            if (!rawQuery) return;

            // 🔥 New cleaner query logic
            let query = rawQuery
            .replace(/\b(\d+(st|nd|rd|th)|First|Second|Third|Fourth|Fifth) Edition\b/gi, '') // remove editions
            .replace(/,/g, '') // remove commas
            .replace(/[\/\\:;'"“”‘’\[\](){}<>|*!?&#@%^~=`$]/g, '') // remove other unwanted characters
            .replace(/\s+/g, '+') // replace spaces with +
            .trim();

            let url = '';
            if (searchSource === 'anna') {
                if (searchField === 'author') {
                    url = `https://annas-archive.org/search?q=${query}`;
                } else {
                    url = `https://annas-archive.org/search?q=${query}`;
                }
            } else if (searchMode === 'fiction') {
                // Fiction Mode
                if (searchField === 'author') {
                    url = `https://libgen.is/fiction/?q=${query}&criteria=authors`;
                } else {
                    url = `https://libgen.is/fiction/?q=${query}`;
                }
            } else {
                // Non-Fiction Mode
                if (searchField === 'author') {
                    url = `https://libgen.is/search.php?req=${query}&view=${libgenViewMode}&column=author`;
                } else {
                    url = `https://libgen.is/search.php?req=${query}&view=${libgenViewMode}&column=title`;
                }
            }


            // 🔥 Clean the visible title too
            let cleanTitle = bookTitle
            .replace(/\b(\d+(st|nd|rd|th)|First|Second|Third|Fourth|Fifth) Edition\b/gi, '')
            .replace(/,/g, '')
            .replace(/\s+/g, ' ')
            .trim();

            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank';
            link.style.display = 'block';
            link.style.marginBottom = '8px';
            link.style.textDecoration = 'none';

            const icon = document.createElement('img');
            icon.src = libgenIconURL;
            icon.alt = '🔗';
            icon.width = 14;
            icon.height = 14;
            icon.style.marginRight = '6px';
            icon.style.verticalAlign = 'middle';

            link.appendChild(icon);
            link.appendChild(document.createTextNode(cleanTitle));
            linksContainer.appendChild(link);
        });
        applyTheme();
    }

    const debouncedAddLibgenLinks = debounce(() => addLibgenLinks(false), 1000);
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if ([...mutation.addedNodes].some(node => node.nodeType === 1 && node.matches && node.matches('div.tier-item-details-view'))) {
                debouncedAddLibgenLinks();
                break;
            }
        }
    });
    observer.observe(document.querySelector('div.content-container') || document.body, { childList: true, subtree: true });

    addLibgenLinks(true);
})();
