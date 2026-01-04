// ==UserScript==
// @name         fandom bookmark
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Custom bookmark system for Aigis Wiki (but wok for any fandom) 
// @author       veho
// @match        https://*.fandom.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536228/fandom%20bookmark.user.js
// @updateURL https://update.greasyfork.org/scripts/536228/fandom%20bookmark.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Store user preferences
    const preferences = {
        openInNewTab: JSON.parse(localStorage.getItem('aigisOpenInNewTab') || 'true'),
        autoRefresh: JSON.parse(localStorage.getItem('aigisAutoRefresh') || 'false'),
        showThumbnails: JSON.parse(localStorage.getItem('aigisShowThumbnails') || 'true')
    };

    // CSS styles
    const style = document.createElement('style');
    style.textContent = `
        #bookmark-panel {
            position: fixed;
            top: 50px;
            right: 20px;
            z-index: 9999;
            background: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 10px;
            width: 300px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            max-height: 80vh;
            overflow-y: auto;
            display: none;
        }
        #bookmark-header {
            position: relative;
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        #bookmark-header h4 {
            margin: 0 45px 0 0; /* Espace pour le bouton collapse */
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        #bookmark-toggle {
            position: fixed;
            top: 50px;
            right: 20px;
            z-index: 9998;
            background: #2E86AB;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 8px 12px;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .bookmark-entry {
            display: flex;
            align-items: center;
            margin: 5px 0;
            padding: 5px;
            border-bottom: 1px solid #eee;
        }
        .bookmark-entry img {
            width: 32px;
            height: 32px;
            margin-right: 8px;
            object-fit: contain;
        }
        .remove-btn {
            background: #e74c3c;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 3px 6px;
            cursor: pointer;
            margin-left: auto;
        }
        .refresh-btn, .add-btn, .options-btn, .collapse-btn {
            background: #f0f0f0;
            color: #333;
            border: none;
            border-radius: 4px;
            padding: 3px 6px;
            cursor: pointer;
            margin-left: 5px;
        }
        .collapse-btn {
            position: absolute;
            top: 0;
            right: 0;
            min-width: 45px;
            z-index: 10;
        }
        .options-menu {
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            display: none;
            z-index: 10000;
            min-width: 150px;
        }
        .options-menu label {
            display: block;
            margin: 5px 0;
        }
        /* Nouveau style pour le conteneur de boutons principaux */
        .main-buttons {
            display: flex;
            align-items: center;
            margin-right: 50px; /* Espace pour le bouton collapse */
        }
    `;
    document.head.appendChild(style);

    // DOM elements
    const panel = document.createElement('div');
    panel.id = 'bookmark-panel';
    panel.innerHTML = `
        <div id="bookmark-header">
            <button class="options-btn">⚙️</button>
            <div class="main-buttons">
                <h4>Bookmarks</h4>
                <button class="refresh-btn" title="Manual refresh (Auto-refresh is enabled)">🔄</button>
                <span style="flex-grow:1;"></span>
                <button class="add-btn">+</button>
            </div>
            <button class="collapse-btn">▼</button>
            <div class="options-menu">
                <label><input type="radio" name="openTabOption" value="new" checked> Open in new tab</label>
                <label><input type="radio" name="openTabOption" value="current"> Open in current tab</label>
                <hr>
                <label><input type="checkbox" id="autoRefreshOption"> Auto-refresh on open</label>
                <label><input type="checkbox" id="showThumbnails"> Show thumbnails</label>
            </div>
        </div>
        <div id="bookmark-list"></div>
        <button id="add-bookmark" style="width:100%; margin-top:10px;">Add Page</button>
    `;
    document.body.appendChild(panel);

    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'bookmark-toggle';
    toggleBtn.textContent = '☰ Bookmarks';
    document.body.appendChild(toggleBtn);

    // Initialize preferences
    function initializePreferences() {
        const savedPref = localStorage.getItem('aigisOpenInNewTab');
        const autoRefresh = localStorage.getItem('aigisAutoRefresh');
        const showThumbs = localStorage.getItem('aigisShowThumbnails');
        
        preferences.openInNewTab = savedPref !== null ? JSON.parse(savedPref) : true;
        preferences.autoRefresh = autoRefresh !== null ? JSON.parse(autoRefresh) : false;
        preferences.showThumbnails = showThumbs !== null ? JSON.parse(showThumbs) : true;

        const autoRefreshCheckbox = panel.querySelector('#autoRefreshOption');
        const thumbsCheckbox = panel.querySelector('#showThumbnails');
        
        if (autoRefreshCheckbox) autoRefreshCheckbox.checked = preferences.autoRefresh;
        if (thumbsCheckbox) thumbsCheckbox.checked = preferences.showThumbnails;

        if (autoRefreshCheckbox) {
            autoRefreshCheckbox.addEventListener('change', () => {
                preferences.autoRefresh = autoRefreshCheckbox.checked;
                localStorage.setItem('aigisAutoRefresh', preferences.autoRefresh);
                updateRefreshButtonState();
            });
        }

        if (thumbsCheckbox) {
            thumbsCheckbox.addEventListener('change', () => {
                preferences.showThumbnails = thumbsCheckbox.checked;
                localStorage.setItem('aigisShowThumbnails', preferences.showThumbnails);
                renderBookmarks();
            });
        }

        const radioButtons = panel.querySelectorAll('input[name="openTabOption"]');
        radioButtons.forEach(radio => {
            radio.checked = radio.value === (preferences.openInNewTab ? 'new' : 'current');
            radio.addEventListener('change', () => {
                preferences.openInNewTab = document.querySelector('input[name="openTabOption"]:checked').value === 'new';
                localStorage.setItem('aigisOpenInNewTab', preferences.openInNewTab);
            });
        });
    }

    // Update refresh button state based on auto-refresh
    function updateRefreshButtonState() {
        const refreshBtn = panel.querySelector('.refresh-btn');
        if (refreshBtn) {
            refreshBtn.title = preferences.autoRefresh 
                ? "Manual refresh (Auto-refresh is enabled)" 
                : "Manual refresh (Auto-refresh is disabled)";
            refreshBtn.style.opacity = preferences.autoRefresh ? "0.5" : "1";
        }
    }

    // Bookmark management
    function getBookmarks() {
        return JSON.parse(localStorage.getItem('aigisBookmarks') || '[]');
    }

    function saveBookmarks(bookmarks) {
        localStorage.setItem('aigisBookmarks', JSON.stringify(bookmarks));
    }

    function addBookmark(url, title, imageUrl) {
        const bookmarks = getBookmarks();
        if (!bookmarks.some(b => b.url === url)) {
            bookmarks.push({url, title, imageUrl});
            saveBookmarks(bookmarks);
            renderBookmarks();
        }
    }

    function removeBookmark(url) {
        const bookmarks = getBookmarks().filter(b => b.url !== url);
        saveBookmarks(bookmarks);
        renderBookmarks();
    }

    function renderBookmarks() {
        const list = document.getElementById('bookmark-list');
        list.innerHTML = '';
        const bookmarks = getBookmarks();

        bookmarks.forEach(b => {
            const entry = document.createElement('div');
            entry.className = 'bookmark-entry';
            
            if (preferences.showThumbnails) {
                entry.innerHTML = `
                    <img src="${b.imageUrl}" alt="">
                    <span>${b.title}</span>
                    <button class="remove-btn">✕</button>
                `;
            } else {
                entry.innerHTML = `
                    <span>${b.title}</span>
                    <button class="remove-btn">✕</button>
                `;
            }
            
            entry.querySelector('.remove-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                removeBookmark(b.url);
            });

            entry.addEventListener('click', () => {
                if (preferences.openInNewTab) {
                    window.open(b.url, '_blank');
                } else {
                    window.location.href = b.url;
                }
            });

            list.appendChild(entry);
        });
    }

    // Event listeners
    toggleBtn.addEventListener('click', () => {
        if (preferences.autoRefresh) {
            renderBookmarks();
        }
        panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
    });

    panel.querySelector('.collapse-btn').addEventListener('click', () => {
        panel.style.display = 'none';
    });

    panel.querySelector('.refresh-btn').addEventListener('click', () => {
        if (preferences.autoRefresh) {
            preferences.autoRefresh = false;
            localStorage.setItem('aigisAutoRefresh', false);
            updateRefreshButtonState();
        }
        renderBookmarks();
    });

    panel.querySelector('.add-btn').addEventListener('click', () => {
        const pageTitle = document.title.replace(/\s*\|\s*Aigis\s*Wiki\s*\|\s*Fandom/g, "").trim();
        const icon = document.querySelector(".page-header__main .wds-image img") || 
                     document.querySelector(".article-image img") || 
                     document.querySelector(".mw-parser-output img");
        
        const imageUrl = icon ? icon.src : "https://static.wikia.nocookie.net/aigis/images/0/05/Time_Crystal_Icon.png ";
        addBookmark(window.location.href, pageTitle, imageUrl);
    });

    // Options button toggle
    const optionsBtn = panel.querySelector('.options-btn');
    const optionsMenu = panel.querySelector('.options-menu');
    
    optionsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        optionsMenu.style.display = optionsMenu.style.display === 'block' ? 'none' : 'block';
    });

    // Close options menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!optionsMenu.contains(e.target) && !optionsBtn.contains(e.target)) {
            optionsMenu.style.display = 'none';
        }
    });

    document.getElementById('add-bookmark').addEventListener('click', () => {
        const pageTitle = document.title.replace(/\s*\|\s*Aigis\s*Wiki\s*\|\s*Fandom/g, "").trim();
        const icon = document.querySelector(".page-header__main .wds-image img") || 
                     document.querySelector(".article-image img") || 
                     document.querySelector(".mw-parser-output img");
        
        const imageUrl = icon ? icon.src : "https://static.wikia.nocookie.net/aigis/images/0/05/Time_Crystal_Icon.png ";
        addBookmark(window.location.href, pageTitle, imageUrl);
    });

    // Initial setup
    initializePreferences();
    updateRefreshButtonState();
    
    // Initial render
    window.addEventListener('load', () => {
        renderBookmarks();
    });
})();