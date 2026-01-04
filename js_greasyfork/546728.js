// ==UserScript==
// @name         PH Tagger
// @version      1.0.2
// @description  Tag authors on Pornhub, search by tags, manage tags, backup tags
// @namespace    PH Tagger
// @author       glauthentica
// @match        https://*.pornhub.com/model/*
// @match        https://*.pornhub.com/channels/*
// @match        https://*.pornhub.com/pornstar/*
// @match        https://*.pornhubpremium.com/model/*
// @match        https://*.pornhubpremium.com/channels/*
// @match        https://*.pornhubpremium.com/pornstar/*
// @homepageURL      https://boosty.to/glauthentica
// @contributionURL  https://boosty.to/glauthentica
// @license      MIT
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.addValueChangeListener
// @grant        GM_addStyle
// @run-at       document-end
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAlUlEQVR4AWP4P5Eh/v8EhvdA/J9EfB+klwHEAAmQid8zgBiUYMoN2J8DJBhQsQAnw/8GD4gCBxWQGKqmBDOIGFAvzACIwvlREKwgBBFbn0y0ASBBhIINyRCxBg8yXDAhEJsLQGIILMCJYQAMIxT3B6KGQYMHAhtIE/ACAhP2wsAbMAhSInk5EZEjgfHFkEBmjnwP0gsANaYm9OkBQ8oAAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/546728/PH%20Tagger.user.js
// @updateURL https://update.greasyfork.org/scripts/546728/PH%20Tagger.meta.js
// ==/UserScript==

(async () => {
    'use strict';
    console.log('[Pornhub Tagger] v17.1 (Compact UI) Script starting...');

    const DB_KEY = 'pornhub_user_tags_db';

    GM_addStyle(`
        #pht-tags-display-container {
            position: absolute;
            width: 200px; /* ИЗМЕНЕНО: Ширина уменьшена до 200px */
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            z-index: 9;
        }

        #pht-input-container {
            position: absolute; padding: 0; border: none; background-color: transparent;
            box-sizing: border-box;
            width: 200px; /* ИЗМЕНЕНО: Ширина уменьшена до 200px */
            z-index: 10;
        }
        body.pht-panel-open { overflow: hidden; }

        #pht-tag-input {
            width: 100%; padding: 6px 2px; background-color: transparent; border: none;
            border-bottom: 1px solid #555; color: #fff; border-radius: 0;
            box-sizing: border-box; transition: border-bottom-color 0.3s;
            text-shadow: 0 0 4px rgba(0, 0, 0, 0.8), 0 0 2px rgba(0, 0, 0, 0.8);
        }
        #pht-tag-input:focus {
            outline: none; border-bottom-color: #ff9900;
        }
        #pht-tag-input::placeholder {
            color: #ccc; opacity: 1;
            text-shadow: 0 0 4px rgba(0, 0, 0, 0.8), 0 0 2px rgba(0, 0, 0, 0.8);
        }

        .pht-tag { background-color: #ff9900; color: #000; padding: 3px 8px; border-radius: 10px; font-size: 12px; font-weight: bold; display: inline-flex; align-items: center; cursor: default; }
        .pht-tag-remove { margin-left: 5px; cursor: pointer; font-weight: bold; color: #502d00; }
        .pht-tag-remove:hover { color: #000; }
        #pht-manage-btn { position: fixed; bottom: 20px; right: 20px; width: 50px; height: 50px; background-color: #ff9900; color: #000; border-radius: 50%; border: none; font-size: 24px; line-height: 50px; text-align: center; cursor: pointer; z-index: 9998; box-shadow: 0 2px 10px rgba(0,0,0,0.5); }
        .pht-panel-header { padding: 15px; background-color: #111; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #444; } .pht-panel-header h2 { margin: 0; font-size: 18px; color: #ff9900; } #pht-close-panel { font-size: 24px; cursor: pointer; color: #888; } #pht-close-panel:hover { color: #fff; } .pht-panel-body { display: flex; flex-grow: 1; overflow: hidden; }
        .pht-panel-footer { padding: 15px; background-color: #111; border-top: 1px solid #444; display: flex; gap: 10px; } .pht-btn { padding: 8px 15px; background-color: #555; border: none; color: #fff; cursor: pointer; border-radius: 4px; } .pht-btn:hover { background-color: #666; } .pht-btn.primary { background-color: #ff9900; color: #000; font-weight: bold; } .pht-btn.primary:hover { background-color: #ffac33; }
        .pht-user-row a { color: #fff; text-decoration: none; flex-grow: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pht-user-remove-btn { background-color: #5e2828; color: #ddd; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-weight: bold; font-size: 16px; line-height: 1; flex-shrink: 0; margin-left: 10px; transition: background-color 0.2s, color 0.2s; }
        .pht-user-remove-btn:hover { background-color: #c53030; color: #fff; }
        #pht-panel-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.8); z-index: 9999; display: none; justify-content: flex-end; align-items: center; padding-right: 20px; box-sizing: border-box; }
        #pht-panel { background-color: #1e1e1e; color: #fff; width: 80%; max-width: 600px; height: 95vh; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.7); display: flex; flex-direction: column; overflow: hidden; }
        .pht-tags-list-container { width: 45%; padding: 15px; overflow-y: auto; border-right: 1px solid #444; overscroll-behavior: contain; }
        .pht-users-list-container { width: 55%; padding: 15px; overflow-y: auto; overscroll-behavior: contain; }
        .pht-panel-body h4 { margin-bottom: 15px; }
        .pht-user-row { display: flex; justify-content: space-between; align-items: center; padding: 4px 10px; border-radius: 4px; margin-bottom: 1px; }
        .pht-user-row:hover { background-color: #2a2a2a; }
        #pht-autocomplete-container { position: absolute; top: 100%; left: 0; right: 0; background-color: #2a2a2a; border: 1px solid #555; border-top: none; border-radius: 0 0 4px 4px; box-sizing: border-box; z-index: 100; max-height: 150px; overflow-y: auto; }
        .pht-autocomplete-item { padding: 8px 10px; font-size: 13px; color: #ddd; cursor: pointer; }
        .pht-autocomplete-item:hover, .pht-autocomplete-item.highlight { background-color: #ff9900; color: #000; font-weight: bold; }
        .pht-kb-highlight { background-color: #4a4a4a !important; border: 1px solid #ff9900 !important; }
        .pht-panel-tag { display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; margin-bottom: 5px; background-color: #333; border-radius: 4px; cursor: pointer; border: 1px solid transparent; }
        .pht-panel-tag.active, .pht-panel-tag:hover { background-color: #ff9900; color: #000; font-weight: bold; }
        .pht-tag-count-badge { background-color: #555; color: #ddd; padding: 1px 7px; border-radius: 10px; font-size: 11px; font-weight: bold; margin-left: 10px; }
        .pht-panel-tag.active .pht-tag-count-badge, .pht-panel-tag:hover .pht-tag-count-badge { background-color: #ab6800; color: #fff; }
    `);


    // --- ЧАСТЬ 2: ОБЪЕКТ ДЛЯ РАБОТЫ С БАЗОЙ ДАННЫХ ---
    const DB = {
        data: {},
        async load() { this.data = await GM.getValue(DB_KEY, {}); },
        async save() { await GM.setValue(DB_KEY, this.data); },
        getUser(usernameKey) { return this.data[usernameKey.toLowerCase()]; },
        updateUser(usernameKey, displayName, url) {
            const dbKey = usernameKey.toLowerCase();
            if (!this.data[dbKey]) {
                this.data[dbKey] = { displayName: displayName, url: url, tags: [] };
            } else {
                this.data[dbKey].displayName = displayName;
                this.data[dbKey].url = url;
            }
        },
        async addTag(usernameKey, displayName, url, tag) {
            const dbKey = usernameKey.toLowerCase();
            if (!this.data[dbKey]) {
                this.data[dbKey] = { displayName: displayName, url: url, tags: [] };
            }
            const user = this.data[dbKey];
            if (!user.tags.includes(tag)) {
                user.tags.push(tag);
                user.tags.sort();
                await this.save();
            }
        },
        async removeTag(usernameKey, tag) {
            const dbKey = usernameKey.toLowerCase();
            const user = this.data[dbKey];
            if (user) {
                user.tags = user.tags.filter(t => t !== tag);
                if (user.tags.length === 0) {
                    delete this.data[dbKey];
                }
                await this.save();
            }
        },
        getAllTags() {
            const allTags = new Set();
            Object.values(this.data).forEach(user => user.tags.forEach(tag => allTags.add(tag)));
            return Array.from(allTags).sort();
        },
        getUsersForTag(tag) {
            const users = [];
            for (const key in this.data) {
                const user = this.data[key];
                if (user.tags.includes(tag)) {
                    users.push({ displayName: user.displayName || key, url: user.url, keyName: key });
                }
            }
            return users.sort((a, b) => a.displayName.localeCompare(b.displayName));
        }
    };

    // --- ЧАСТЬ 3 и 4: ОСНОВНОЙ ИНТЕРФЕЙС (UI) И ЗАПУСК ---
    const UI = {
        currentUserInfo: null, inputContainerElement: null, tagsDisplayContainerElement: null,
        anchorElement: null, resizeObserver: null,
        injectionParent: null, autocompleteIndex: -1, panelFocusColumn: 'tags', panelTagIndex: -1, panelUserIndex: -1, scrollbarWidth: 0,

        async init() {
            const scrollDiv = document.createElement('div'); scrollDiv.style.width = '100px'; scrollDiv.style.height = '100px'; scrollDiv.style.overflow = 'scroll'; scrollDiv.style.position = 'absolute'; scrollDiv.style.top = '-9999px'; document.body.appendChild(scrollDiv); this.scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth; document.body.removeChild(scrollDiv);
            await DB.load(); this.createManagementPanel();
            const manageBtn = document.createElement('button'); manageBtn.id = 'pht-manage-btn'; manageBtn.innerHTML = '&#9737;'; manageBtn.title = "Manage Tags (Hotkey: 'T')"; manageBtn.onclick = () => this.togglePanel(); document.body.appendChild(manageBtn);

            this.anchorElement = document.querySelector('h1[itemprop="name"], .name');
            const urlInfo = this.getUserInfoFromUrl();
            if (this.anchorElement && urlInfo) {
                console.log('[PHT v17.0] Anchor and URL info found. Showing all tags.');
                this.injectionParent = this.anchorElement.closest('.topProfileHeader, .header-container, .profile-header, [class*="HeaderContainer"]') || document.body;
                const displayName = this.anchorElement.textContent.trim();
                const finalUserInfo = { keyName: urlInfo.keyName, displayName: displayName, url: urlInfo.url };
                DB.updateUser(finalUserInfo.keyName, finalUserInfo.displayName, finalUserInfo.url); DB.save();
                this.injectTaggingUI(finalUserInfo);
                if (this.resizeObserver) this.resizeObserver.disconnect();
                this.resizeObserver = new ResizeObserver(() => this.repositionUI());
                this.resizeObserver.observe(this.injectionParent);
                window.addEventListener('scroll', () => this.repositionUI(), true);
                window.addEventListener('resize', () => this.repositionUI());
            } else { console.error('[PHT v17.0] Failed to find anchor element or user info on page load.'); }

            GM.addValueChangeListener(DB_KEY, (name, oldValue, newValue, remote) => { if (remote) this.handleStorageChange(newValue); });

            document.addEventListener('click', (e) => {
                if (!e.target.closest('#pht-input-container')) this.hideAutocomplete();
            });
            document.addEventListener('keydown', (e) => { if (e.code === 'KeyT' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); this.togglePanel(); } else if (document.getElementById('pht-panel-overlay')?.style.display === 'flex') { if (e.key === 'Escape') this.togglePanel(); else this.handlePanelKeyboardNav(e); } });
        },

        injectTaggingUI(userInfo) {
            this.currentUserInfo = userInfo;
            if (!this.inputContainerElement) {
                this.inputContainerElement = document.createElement('div'); this.inputContainerElement.id = 'pht-input-container';
                const tagInput = document.createElement('input'); tagInput.type = 'text'; tagInput.id = 'pht-tag-input'; tagInput.placeholder = 'Add a tag...'; tagInput.autocomplete = 'off';
                this.inputContainerElement.appendChild(tagInput);
                this.tagsDisplayContainerElement = document.createElement('div');
                this.tagsDisplayContainerElement.id = 'pht-tags-display-container';

                const parentStyle = window.getComputedStyle(this.injectionParent);
                if (parentStyle.position === 'static') { this.injectionParent.style.position = 'relative'; }
                this.injectionParent.appendChild(this.inputContainerElement);
                this.injectionParent.appendChild(this.tagsDisplayContainerElement);

                this.renderUserTags();
                tagInput.addEventListener('input', () => this.handleAutocomplete(tagInput));
                tagInput.addEventListener('keydown', (e) => this.handleKeyboard(e, tagInput));
            } else {
                this.renderUserTags();
            }
        },

        repositionUI() {
            if (!this.anchorElement || !document.body.contains(this.anchorElement)) {
                if (this.inputContainerElement) this.inputContainerElement.style.display = 'none';
                if (this.tagsDisplayContainerElement) this.tagsDisplayContainerElement.style.display = 'none';
                return;
            }

            this.inputContainerElement.style.display = 'block';
            const gap = 10;
            const anchorRect = this.anchorElement.getBoundingClientRect();
            const parentRect = this.injectionParent.getBoundingClientRect();
            const topRelativeToParent = anchorRect.top - parentRect.top;
            const leftRelativeToParent = anchorRect.left - parentRect.left;
            const scrollTop = this.injectionParent.scrollTop || 0;
            const scrollLeft = this.injectionParent.scrollLeft || 0;

            const tagsHeight = this.tagsDisplayContainerElement.offsetHeight;
            const tagsTop = scrollTop + topRelativeToParent - tagsHeight - gap;
            const tagsLeft = scrollLeft + leftRelativeToParent;
            this.tagsDisplayContainerElement.style.top = `${tagsTop}px`;
            this.tagsDisplayContainerElement.style.left = `${tagsLeft}px`;

            const anchorHeight = this.anchorElement.offsetHeight;
            const inputTop = scrollTop + topRelativeToParent + anchorHeight + gap;
            const inputLeft = scrollLeft + leftRelativeToParent;
            this.inputContainerElement.style.top = `${inputTop}px`;
            this.inputContainerElement.style.left = `${inputLeft}px`;
        },

        renderUserTags() {
            const container = this.tagsDisplayContainerElement;
            if (!container || !this.currentUserInfo) return;
            container.innerHTML = '';
            const user = DB.getUser(this.currentUserInfo.keyName);
            if (user && user.tags.length > 0) {
                user.tags.forEach(tag => {
                    const tagEl = document.createElement('span'); tagEl.className = 'pht-tag'; tagEl.textContent = tag;
                    const removeEl = document.createElement('span'); removeEl.className = 'pht-tag-remove'; removeEl.innerHTML = '&times;';
                    removeEl.onclick = async () => { await DB.removeTag(this.currentUserInfo.keyName, tag); this.renderUserTags(); };
                    tagEl.appendChild(removeEl); container.appendChild(tagEl);
                });
                container.style.display = 'flex';
            } else {
                container.style.display = 'none';
            }
            setTimeout(() => this.repositionUI(), 0);
        },

        handleAutocomplete(inputElement) { const value = inputElement.value.trim().toLowerCase(); if (!value) { this.hideAutocomplete(); return; } const user = DB.getUser(this.currentUserInfo.keyName); const currentUserTags = user ? user.tags : []; const filtered = DB.getAllTags().filter(tag => tag.startsWith(value) && !currentUserTags.includes(tag)); if (filtered.length > 0) { this.showAutocomplete(filtered); } else { this.hideAutocomplete(); } },
        showAutocomplete(suggestions) { this.hideAutocomplete(); this.autocompleteIndex = -1; const container = document.createElement('div'); container.id = 'pht-autocomplete-container'; suggestions.forEach((tag) => { const item = document.createElement('div'); item.className = 'pht-autocomplete-item'; item.textContent = tag; item.onmousedown = (e) => { e.preventDefault(); this.addTagFromSuggestion(tag); }; container.appendChild(item); }); this.inputContainerElement.appendChild(container); },
        hideAutocomplete() { const container = document.getElementById('pht-autocomplete-container'); if (container) container.remove(); },
        async addTagFromSuggestion(tag) { const tagInput = document.getElementById('pht-tag-input'); await DB.addTag(this.currentUserInfo.keyName, this.currentUserInfo.displayName, this.currentUserInfo.url, tag); this.renderUserTags(); tagInput.value = ''; this.hideAutocomplete(); tagInput.focus(); },
        handleKeyboard(e, inputElement) { const container = document.getElementById('pht-autocomplete-container'); if (e.key === 'Escape') { this.hideAutocomplete(); return; } if (!container) { if (e.key === 'Enter' && inputElement.value.trim() !== '') { this.addTagFromSuggestion(inputElement.value.trim().toLowerCase()); } return; } const items = container.querySelectorAll('.pht-autocomplete-item'); if (!items.length) return; if (e.key === 'ArrowDown') { e.preventDefault(); this.autocompleteIndex = (this.autocompleteIndex + 1) % items.length; } else if (e.key === 'ArrowUp') { e.preventDefault(); this.autocompleteIndex = (this.autocompleteIndex - 1 + items.length) % items.length; } else if (e.key === 'Enter') { e.preventDefault(); if (this.autocompleteIndex > -1) { this.addTagFromSuggestion(items[this.autocompleteIndex].textContent); } else if (inputElement.value.trim() !== '') { this.addTagFromSuggestion(inputElement.value.trim().toLowerCase()); } return; } this.highlightAutocompleteItem(items); },
        highlightAutocompleteItem(items) { items.forEach(item => item.classList.remove('highlight')); if (this.autocompleteIndex > -1) { items[this.autocompleteIndex].classList.add('highlight'); items[this.autocompleteIndex].scrollIntoView({ block: 'nearest' }); } },
        getUserInfoFromUrl() { const path = window.location.pathname.split('/'); if (['model', 'users', 'channels', 'pornstar'].includes(path[1]) && path[2]) { return { keyName: decodeURIComponent(path[2]), url: window.location.pathname }; } return null; },
        handleStorageChange(newValue) { DB.data = newValue; if (this.inputContainerElement && this.currentUserInfo) { this.renderUserTags(); } if (document.getElementById('pht-panel-overlay')?.style.display === 'flex') { this.refreshManagementPanel(); } },

        createManagementPanel() { const overlay = document.createElement('div'); overlay.id = 'pht-panel-overlay'; overlay.innerHTML = `<div id="pht-panel"><div class="pht-panel-header"><h2>Tag Management</h2><span id="pht-close-panel">&times;</span></div><div class="pht-panel-body"><div class="pht-tags-list-container" id="pht-all-tags-list"></div><div class="pht-users-list-container" id="pht-users-for-tag"><p>Select a tag.</p></div></div><div class="pht-panel-footer"><button id="pht-backup-btn" class="pht-btn primary">Backup Data</button><button id="pht-restore-btn" class="pht-btn">Restore from Backup</button></div></div>`; document.body.appendChild(overlay); document.getElementById('pht-close-panel').onclick = () => this.togglePanel(); overlay.onclick = (e) => { if (e.target === overlay) this.togglePanel(); }; document.getElementById('pht-backup-btn').onclick = () => this.backupData(); document.getElementById('pht-restore-btn').onclick = () => this.restoreData(); return overlay; },
        refreshManagementPanel() { const tagsListContainer = document.getElementById('pht-all-tags-list'); const usersListContainer = document.getElementById('pht-users-for-tag'); if (tagsListContainer) this.renderAllTagsList(tagsListContainer); if (usersListContainer) usersListContainer.innerHTML = '<p>Select a tag on the left.</p>'; },
        renderAllTagsList(container) { container.innerHTML = '<h4>All Tags</h4>'; const tags = DB.getAllTags(); if (tags.length === 0) { container.innerHTML += '<p>No tags yet.</p>'; return; } tags.forEach((tag, index) => { const userCount = DB.getUsersForTag(tag).length; const tagEl = document.createElement('div'); tagEl.className = 'pht-panel-tag'; tagEl.innerHTML = `<span>${tag}</span><span class="pht-tag-count-badge" title="${userCount} user(s) with this tag">${userCount}</span>`; tagEl.onclick = () => { document.querySelectorAll('.pht-panel-tag.active').forEach(el => el.classList.remove('active')); tagEl.classList.add('active'); this.renderUsersForTag(document.getElementById('pht-users-for-tag'), tag); this.panelUserIndex = -1; this.panelFocusColumn = 'tags'; this.panelTagIndex = index; this.updatePanelHighlight(); }; container.appendChild(tagEl); }); },
        renderUsersForTag(container, tag) { container.innerHTML = `<h4>Users with tag: "${tag}"</h4>`; const users = DB.getUsersForTag(tag); if (users.length === 0) { container.innerHTML += '<p>No users found for this tag.</p>'; return; } users.forEach(user => { const row = document.createElement('div'); row.className = 'pht-user-row'; row.dataset.keyName = user.keyName; row.innerHTML = `<a href="${user.url}" target="_blank">${user.displayName}</a><span class="pht-user-remove-btn" title="Remove tag '${tag}' from ${user.displayName}">&times;</span>`; row.querySelector('.pht-user-remove-btn').onclick = async (e) => { e.stopPropagation(); await DB.removeTag(user.keyName, tag); if (this.currentUserInfo && this.currentUserInfo.keyName === user.keyName) { this.renderUserTags(); } const activeTagElement = document.querySelector('.pht-panel-tag.active'); this.refreshManagementPanel(); const allTagElements = document.querySelectorAll('.pht-panel-tag'); if (allTagElements.length > 0) { const newIndex = Math.min(this.panelTagIndex, allTagElements.length - 1); allTagElements[newIndex]?.click(); } else { document.getElementById('pht-users-for-tag').innerHTML = '<p>Select a tag on the left.</p>'; } }; container.appendChild(row); }); },
        togglePanel() { const panelOverlay = document.getElementById('pht-panel-overlay'); if (!panelOverlay) return; const isVisible = panelOverlay.style.display === 'flex'; const pageHasScrollbar = document.documentElement.scrollHeight > document.documentElement.clientHeight; if (isVisible) { panelOverlay.style.display = 'none'; document.body.classList.remove('pht-panel-open'); document.body.style.paddingRight = ''; } else { panelOverlay.style.display = 'flex'; if (pageHasScrollbar) { document.body.style.paddingRight = `${this.scrollbarWidth}px`; } document.body.classList.add('pht-panel-open'); this.refreshManagementPanel(); this.panelFocusColumn = 'tags'; this.panelTagIndex = 0; this.panelUserIndex = -1; this.updatePanelHighlight(); } },
        handlePanelKeyboardNav(e) { const tagItems = document.querySelectorAll('#pht-all-tags-list .pht-panel-tag'); const userItems = document.querySelectorAll('#pht-users-for-tag .pht-user-row'); if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Delete'].includes(e.key)) e.preventDefault(); switch (e.key) { case 'ArrowDown': if (this.panelFocusColumn === 'tags' && tagItems.length > 0) this.panelTagIndex = (this.panelTagIndex + 1) % tagItems.length; else if (this.panelFocusColumn === 'users' && userItems.length > 0) this.panelUserIndex = (this.panelUserIndex + 1) % userItems.length; break; case 'ArrowUp': if (this.panelFocusColumn === 'tags' && tagItems.length > 0) this.panelTagIndex = (this.panelTagIndex - 1 + tagItems.length) % tagItems.length; else if (this.panelFocusColumn === 'users' && userItems.length > 0) this.panelUserIndex = (this.panelUserIndex - 1 + userItems.length) % userItems.length; break; case 'ArrowRight': if (this.panelFocusColumn === 'tags' && document.querySelector('.pht-panel-tag.active') && userItems.length > 0) { this.panelFocusColumn = 'users'; this.panelUserIndex = 0; } break; case 'ArrowLeft': if (this.panelFocusColumn === 'users') { this.panelFocusColumn = 'tags'; this.panelUserIndex = -1; } break; case 'Enter': if (this.panelFocusColumn === 'tags' && this.panelTagIndex > -1) tagItems[this.panelTagIndex]?.click(); else if (this.panelFocusColumn === 'users' && this.panelUserIndex > -1) userItems[this.panelUserIndex]?.querySelector('a')?.click(); break; case 'Delete': if (this.panelFocusColumn === 'users' && this.panelUserIndex > -1) { userItems[this.panelUserIndex]?.querySelector('.pht-user-remove-btn')?.click(); } break; } this.updatePanelHighlight(); },
        updatePanelHighlight() { document.querySelectorAll('.pht-kb-highlight').forEach(el => el.classList.remove('pht-kb-highlight')); if (this.panelFocusColumn === 'tags') { const items = document.querySelectorAll('#pht-all-tags-list .pht-panel-tag'); if (this.panelTagIndex > -1 && items[this.panelTagIndex]) { items[this.panelTagIndex].classList.add('pht-kb-highlight'); items[this.panelTagIndex].scrollIntoView({ block: 'nearest' }); } } else if (this.panelFocusColumn === 'users') { const items = document.querySelectorAll('#pht-users-for-tag .pht-user-row'); if (this.panelUserIndex > -1 && items[this.panelUserIndex]) { items[this.panelUserIndex].classList.add('pht-kb-highlight'); items[this.panelUserIndex].scrollIntoView({ block: 'nearest' }); } } },
        backupData() {
            const dataStr = JSON.stringify(DB.data, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `PH Tagger backup (${new Date().toISOString().slice(0, 10)}).json`;
            a.click();
            URL.revokeObjectURL(url);
            alert('Backup created.');
        },
        restoreData() {
            if (!confirm('This will overwrite ALL current tags. Are you sure?')) return;
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = e => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = async (event) => {
                    try {
                        const restoredData = JSON.parse(event.target.result);
                        if (typeof restoredData === 'object' && restoredData !== null) {
                            DB.data = restoredData;
                            await DB.save();
                            alert('Data restored!');
                            this.refreshManagementPanel();
                            if (this.currentUserInfo) this.renderUserTags();
                        } else throw new Error('Invalid file format.');
                    } catch (err) {
                        alert('Error restoring file: ' + err.message);
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        },
    };

    UI.init();

})();