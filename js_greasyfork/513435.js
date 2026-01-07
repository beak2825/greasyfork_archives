// ==UserScript==
// @name         AO3 FicTracker
// @author       infiniMotis
// @version      1.6.6.2
// @namespace    https://github.com/infiniMotis/AO3-FicTracker
// @description  Track your favorite, finished, to-read and disliked fanfics on AO3 with sync across devices. Customizable tags and highlights make it easy to manage and spot your tracked works. Full UI customization on the preferences page.
// @license      GNU GPLv3
// @icon         https://archiveofourown.org/favicon.ico
// @match        *://archiveofourown.org/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @supportURL   https://github.com/infiniMotis/AO3-FicTracker/issues
// @contributionURL https://ko-fi.com/infinimotis
// @contributionAmount 1 USD
// @downloadURL https://update.greasyfork.org/scripts/513435/AO3%20FicTracker.user.js
// @updateURL https://update.greasyfork.org/scripts/513435/AO3%20FicTracker.meta.js
// ==/UserScript==


// Description:
// FicTracker is designed for you to effectively manage their fanfics on AO3.
// It allows you to mark fics as finished, favorite, to-read, or disliked, providing an easy way to organize their reading list.

// Key Features:
// **Custom "To-Read" Feature:** Users can filter and search through their to-read list, enhancing the experience beyond AO3's default functionality.
// **Data Synchronization:** Information is linked to the user's AO3 account, enabling seamless syncing across devices.
// **Google Sheets Storage Sync:** Syncs advanced tracking data such as highlighting and custom notes across multiple devices using a Google Sheets document.
// **User-Friendly Access:** Users can conveniently access tracking options from a dropdown menu, making the process intuitive and straightforward.
// **Optimized performance:** The script runs features only on relevant pages, ensuring quick and efficient performance.

// Usage Instructions:
// 1. **Tracking Fics:** On the fics page, click the status button, on search result/fics listing pages - in the right bottom corner of each work there is a dropdown.
// 2. **Settings Panel:** At the end of the user preferences page, you will find a settings panel to customize your tracking options.
// 3. **Accessing Your Lists:** In the dropdown menu at the top right corner, you'll find links to your tracked lists for easy access.
// 4. **Multi-Device Sync (Optional):**
//    - On your main device, initialize Google Sheets storage via the settings panel.
//    - On other devices, use the same Sheet URL and initialize - data will sync automatically.
//    - Highlighting and custom notes will sync across devices using this feature.

(function() {
    'use strict';

    // Default script settings
    let settings = {
        version: GM_info.script.version,
        statuses: [
            {
                tag: 'Finished Reading',
                dropdownLabel: 'My Finished Fanfics',
                positiveLabel: '✔️ Mark as Finished',
                negativeLabel: '🗑️ Remove from Finished',
                selector: 'finished_reading_btn',
                storageKey: 'FT_finished',
                enabled: true,
                collapse: false,
                displayInDropdown: true,
                highlightColor: "#000000",
                borderSize: 0,
                opacity: .6,
                borderOpacity: 255,
                hide: false
            },
            {
                tag: 'Favorite',
                dropdownLabel: 'My Favorite Fanfics',
                positiveLabel: '❤️ Mark as Favorite',
                negativeLabel: '💔 Remove from Favorites',
                selector: 'favorite_btn',
                storageKey: 'FT_favorites',
                enabled: true,
                collapse: false,
                displayInDropdown: true,
                highlightColor: "#F95454",
                borderSize: 2,
                opacity: 1,
                borderOpacity: 255,
                hide: false
            },
            {
                tag: 'To Read',
                dropdownLabel: 'My To Read Fanfics',
                positiveLabel: '📚 Mark as To Read',
                negativeLabel: '🧹 Remove from To Read',
                selector: 'to_read_btn',
                storageKey: 'FT_toread',
                enabled: true,
                collapse: false,
                displayInDropdown: true,
                highlightColor: "#3BA7C4",
                borderSize: 2,
                opacity: 1,
                borderOpacity: 255,
                hide: false
            },
            {
                tag: 'Disliked Work',
                dropdownLabel: 'My Disliked Fanfics',
                positiveLabel: '👎 Mark as Disliked',
                negativeLabel: '🧹 Remove from Disliked',
                selector: 'disliked_btn',
                storageKey: 'FT_disliked',
                enabled: true,
                collapse: true,
                displayInDropdown: true,
                highlightColor: "#000000",
                borderSize: 0,
                opacity: .6,
                borderOpacity: 255,
                hide: false
            }
        ],
        loadingLabel: '⏳Loading...',
        hideDefaultToreadBtn: true,
        newBookmarksPrivate: true,
        newBookmarksRec: false,
        lastExportTimestamp: null,
        displayBottomActionButtons: true,
        deleteEmptyBookmarks: true,
        debug: false,
        displayUserNotes: true,
        expandUserNoteDetails: true,
        sheetUrl: "",
        syncInterval: 60,
        syncEnabled: false,
        syncDBInitialized: false,
        syncWidgetEnabled: true,
        syncWidgetOpacity: .5,
        exportStatusesConfig: true,
        collapseAndHideOnBookmarks: false,
        displayMyNotesButton: true

    };

    // Toggle debug info
    let DEBUG = settings.debug;

    // Utility function for status settings retrieval
    function getStatusSettingsByStorageKey(storageKey) {
        return settings.statuses.find(status => status.storageKey === storageKey);
    }

    // Utility function to check if current page is users own bookmarks page
    function isOwnBookmarksPage() {
        const userMenu = document.querySelector('ul.menu.dropdown-menu');
        const username = userMenu?.previousElementSibling?.getAttribute('href')?.split('/').pop() ?? '';
        if (!username) return false;
    
        const url = window.location.pathname + window.location.search;
        return url.includes('/bookmarks') && url.includes(username);
    }
    

    // Utility function for displaying modals
    function displayModal(modalTitle, htmlContent) {
        // Check if temp-content already exists, remove if yes (to avoid duplicates)
        const existing = document.getElementById('temp-content');
        if (existing) existing.remove();

        // Create hidden container
        const tempDiv = document.createElement('div');
        tempDiv.id = 'temp-content';
        tempDiv.style.display = 'none';
        tempDiv.innerHTML = htmlContent;

        document.body.appendChild(tempDiv);

        // Show modal using ao3modal
        ao3modal.show('#temp-content', modalTitle);
    }


    function escapeHTML(str) {
        return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }


    // Utility class for injecting CSS
    class StyleManager {
        // Method to add custom styles to the page
        static addCustomStyles(styles) {
            const customStyle = document.createElement('style');
            customStyle.innerHTML = styles;
            document.head.appendChild(customStyle);

            DEBUG && console.info('[FicTracker] Custom styles added successfully.');
        }

        static generateStatusStyles() {
            let css = '';

            settings.statuses.forEach(status => {
                if (!status.enabled) return;

                const className = `glowing-border-${status.storageKey}`;
                const color = status.highlightColor;
                const bOpacity = Math.round((status?.borderOpacity ?? 255)).toString(16)
                const border = `${status.borderSize}px solid ${color + bOpacity}`;
                const boxShadow = `0 0 10px ${color + bOpacity}, 0 0 20px ${color + bOpacity}`;
                const boxShadowHover = `0 0 15px ${color + bOpacity}, 0 0 30px ${color + bOpacity}`;
                const opacity = status.opacity;
                const hasBorder = status.borderSize > 0;
                const hide = status.hide;
                
                // Check if we should hide this status based on bookmarks page setting
                const ownBookmarksPage = isOwnBookmarksPage();
                const shouldHide = hide && ((ownBookmarksPage && settings.collapseAndHideOnBookmarks) || !ownBookmarksPage);            

                css += `
                    .${className} {
                        ${shouldHide ? 'display: none !important;' : ''}
                        ${hasBorder ? `border: ${border} !important;` : 'border: none !important;'}
                        border-radius: 8px !important;
                        padding: 15px !important;
                        background-color: transparent !important;
                        ${hasBorder ? `box-shadow: ${boxShadow} !important;` : 'box-shadow: none !important;'}
                        transition: box-shadow 0.3s ease, opacity 0.3s ease !important;
                        opacity: ${opacity};
                    }
                    .${className}:hover {
                        ${hasBorder ? `box-shadow: ${boxShadowHover} !important;` : 'box-shadow: none !important;'}
                        opacity: 1;
                    }
                `;

            });

            return css;
        }
    }

    // Class for handling API requests
    class RequestManager {
        constructor(baseApiUrl) {
            this.baseApiUrl = baseApiUrl;
        }

        // Retrieve the authenticity token from a meta tag
        getAuthenticityToken() {
            const metaTag = document.querySelector('meta[name="csrf-token"]');
            return metaTag ? metaTag.getAttribute('content') : null;
        }

        // Send an API request with the specified method
        sendRequest(url, formData = null, headers = null, method = "POST") {
            const options = {
                method: method,
                mode: "cors",
                credentials: "include",
            };

            // Attach headers if there are any
            if (headers) {
                options.headers = headers;
            }

            // If it's not a GET request, we include the formData in the request body
            if (method !== "GET" && formData) {
                options.body = formData;
            }

            return fetch(url, options)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Request failed with status ${response.status}`);
                    }
                    return response;
                })
                .catch(error => {
                    DEBUG && console.error('[FicTracker] Error during API request:', error);
                    throw error;
                });
        }

        // Create a bookmark for fanfic with given data
        createBookmark(workId, authenticityToken, bookmarkData) {
            const url = `${this.baseApiUrl}/works/${workId}/bookmarks`;
            const headers = this.getRequestHeaders();
            const formData = this.createFormData(authenticityToken, bookmarkData);

            DEBUG && console.info('[FicTracker] Sending CREATE request for bookmark:', {
                url,
                headers,
                bookmarkData
            });

            return this.sendRequest(url, formData, headers)
                .then(response => {
                    if (response.ok) {
                        const bookmarkId = response.url.split('/').pop();

                        DEBUG && console.log('[FicTracker] Created bookmark ID:', bookmarkId);
                        return bookmarkId;
                    } else {
                        throw new Error("Failed to create bookmark. Status: " + response.status);
                    }
                })
                .catch(error => {
                    DEBUG && console.error('[FicTracker] Error creating bookmark:', error);
                    throw error;
                });
        }

        // Update a bookmark for fanfic with given data
        updateBookmark(bookmarkId, authenticityToken, updatedData) {
            const url = `${this.baseApiUrl}/bookmarks/${bookmarkId}`;
            const headers = this.getRequestHeaders();
            const formData = this.createFormData(authenticityToken, updatedData, 'update');

            DEBUG && console.info('[FicTracker] Sending UPDATE request for bookmark:', {
                url,
                headers,
                updatedData
            });

            return this.sendRequest(url, formData, headers)
                .then(data => {
                    DEBUG && console.log('[FicTracker] Bookmark updated successfully:', data);
                })
                .catch(error => {
                    DEBUG && console.error('[FicTracker] Error updating bookmark:', error);
                });
        }

        // Delete a bookmark by ID
        deleteBookmark(bookmarkId, authenticityToken) {
            const url = `${this.baseApiUrl}/bookmarks/${bookmarkId}`;
            const headers = this.getRequestHeaders();

            // FormData for this one is minimalist, method call is not needed
            const formData = new FormData();
            formData.append('authenticity_token', authenticityToken);
            formData.append('_method', 'delete');

            DEBUG && console.info('[FicTracker] Sending DELETE request for bookmark:', {
                url,
                headers,
                authenticityToken
            });

            return this.sendRequest(url, formData, headers)
                .then(data => {
                    DEBUG && console.log('[FicTracker] Bookmark deleted successfully:', data);
                })
                .catch(error => {
                    DEBUG && console.error('[FicTracker] Error deleting bookmark:', error);
                });
        }

        // Retrieve the request headers
        getRequestHeaders() {
            const headers = {
                "Accept": "text/html", // Accepted content type
                "Cache-Control": "no-cache", // Prevent caching
                "Pragma": "no-cache", // HTTP 1.0 compatibility
            };


            DEBUG && console.log('[FicTracker] Retrieving request headers:', headers);

            return headers;
        }

        // Create FormData for bookmarking actions based on action type
        createFormData(authenticityToken, bookmarkData, type = 'create') {
            const formData = new FormData();

            // Append required data to FormData
            formData.append('authenticity_token', authenticityToken);
            formData.append("bookmark[pseud_id]", bookmarkData.pseudId);
            formData.append("bookmark[bookmarker_notes]", bookmarkData.notes);
            formData.append("bookmark[tag_string]", bookmarkData.bookmarkTags.join(','));
            formData.append("bookmark[collection_names]", bookmarkData.collections.join(','));
            formData.append("bookmark[private]", +bookmarkData.isPrivate);
            formData.append("bookmark[rec]", +bookmarkData.isRec);

            // Append action type
            formData.append("commit", type === 'create' ? "Create" : "Update");
            if (type === 'update') {
                formData.append("_method", "put");
            }

            DEBUG && console.log('[FicTracker] FormData created successfully:');
            DEBUG && console.table(Array.from(formData.entries()));

            return formData;
        }

    }

    // Class for managing custom user notes
    class CustomUserNotesManager {
        constructor(storageManager, remoteSyncManager = null) {
            this.storageManager = storageManager;
            this.remoteSyncManager = remoteSyncManager;
        }

        // Get all saved notes
        getAllNotes() {
            try {
                return JSON.parse(this.storageManager.getItem("FT_userNotes")) || {};
            } catch (e) {
                return {};
            }
        }

        // Get note for specific work
        getNote(workId) {
            const notes = this.getAllNotes();
            return notes[workId] || null;
        }

        // Save note
        saveNote(workId, noteText, ficDetails) {
            const notes = this.getAllNotes();
            const date = new Date().toISOString();
            
            if (noteText.trim() === "") {
                delete notes[workId];
            } else {
                notes[workId] = {
                    ...notes[workId],
                    text: noteText,
                    date,
                };

                if (ficDetails && !('title' in notes[workId])) {
                    Object.assign(notes[workId], ficDetails);
                }
            }

            this.storageManager.setItem("FT_userNotes", JSON.stringify(notes));
            
            if (this.remoteSyncManager) {
                this.remoteSyncManager.addPendingNoteUpdate(workId, noteText, date);
            }

            return { text: noteText, date };
        }

        // Delete note
        deleteNote(workId) {
            const notes = this.getAllNotes();
            delete notes[workId];
            this.storageManager.setItem("FT_userNotes", JSON.stringify(notes));
            
            if (this.remoteSyncManager) {
                this.remoteSyncManager.addPendingNoteUpdate(workId, "", null);
            }
        }

        // Generate note block HTML
        generateNoteHtml(workId, isWorkPage = false, isNoteAggregatorModal = false) {
            const note = this.getNote(workId);
            const noteText = note?.text || '';
            const noteDate = note?.date || '';
            const displayDate = noteDate ? new Date(noteDate).toLocaleDateString() : '';
            const detailsOpen = settings.expandUserNoteDetails ? 'open' : '';


            // If note was deleted from note modal manager - leave empty space
            if (!noteText && isNoteAggregatorModal === true)
                return ''

            // If no note exists, show create button
            if (!noteText) {
                return `
                    <div class="user-note-preview" data-work-id="${workId}" style="order: 999; flex-basis: 100%;">
                        <div style="display: flex; justify-content: center; padding: ${isWorkPage ? '10px' : '3px'};">
                            <button class="create-note-btn" style="${isWorkPage ? 'width: 30%;' : ''} padding: 4px 6px; display: flex; justify-content: center; align-items: center; gap: 8px; border: 1px dashed currentColor; border-radius: 4px; background: transparent; color: currentColor; cursor: pointer; opacity: 0.7;">
                                <span style="color: currentColor;">📝</span>
                                <span>Add Note</span>
                            </button>
                        </div>
                    </div>
                `;
            }

            let ficDetails;
            if (isNoteAggregatorModal) {
                ficDetails = this.getFicDetailsHTML(workId, note);
            }

            return `
                <div class="user-note-preview" data-work-id="${workId}" style="order: 999; flex-basis: 100%;">
                    <style>
                        @media screen and (max-width: 42em) {
                            .user-note-preview[data-work-id="${workId}"]>div>div {
                                width: 100% !important;
                            }
                        }
                    </style>
                    <div style="display: flex; justify-content: center;">
                        <!-- Config edit form for works listing or fic page itself -->
                        <div style="width: ${isWorkPage ? '60%' : '100%'};">
                            <details ${detailsOpen} style="margin: 18px 0 1px 0;; border: 1px solid currentColor; border-radius: 4px; padding: 0;">
                                <summary style="padding: 4px 6px; cursor: pointer; font-weight: bold; background: rgba(128,128,128,0.1); display: flex; justify-content: space-between; align-items: center;">
                                    <div style="display: flex; align-items: center; gap: 8px;">
                                        <span>${isNoteAggregatorModal ? ficDetails.outerHTML : '📝 Your Note'}</span>
                                    </div>
                                    <div class="note-actions" style="display: flex; gap: 8px;">
                                        <button class="edit-note-btn" title="Edit Note" style="background: none; border: none; cursor: pointer;">✏️</button>
                                        <button class="delete-note-btn" title="Delete Note" style="background: none; border: none; cursor: pointer;">🗑️</button>
                                    </div>
                                </summary>
                                <div class="note-body" style="padding: 12px; border-top: 1px solid rgba(128,128,128,0.2); background: rgba(128,128,128,0.05);">
                                    <div style="line-height: 1.4; white-space: pre-wrap;">${escapeHTML(noteText)}</div>
                                    <div style="margin-top: 8px; font-size: 0.85em; opacity: 0.7;">
                                        📅 Last updated: ${displayDate} | 📏 ${noteText.length} characters
                                    </div>
                                </div>
                                <div class="note-edit-form" style="display: none; padding: 12px; border-top: 1px solid rgba(128,128,128,0.2); background: rgba(128,128,128,0.05);">
                                    <textarea class="note-textarea" style="box-sizing: border-box; width: 100%; min-height: 100px; margin-bottom: 8px; padding: 8px; border: 1px solid rgba(128,128,128,0.2); border-radius: 4px;">${escapeHTML(noteText)}</textarea>
                                    <div style="display: flex; gap: 8px; justify-content: flex-end;">
                                        <button class="save-note-btn" style="cursor: pointer;">💾 Save</button>
                                        <button class="cancel-edit-btn" style="cursor: pointer;">❌ Cancel</button>
                                    </div>
                                </div>
                            </details>
                        </div>
                    </div>
                </div>
            `;
        }

        // Setup event handlers
        setupNoteHandlers(container, isWorkPage = false, isNoteAggregatorModal = false) {
            container.addEventListener("click", (e) => {
                const noteBlock = e.target.closest(".user-note-preview");
                if (!noteBlock) return;

                const workId = noteBlock.dataset.workId;
                const btn = e.target.closest("button");
                if (!btn) return;

                if (btn.classList.contains("create-note-btn")) {
                    noteBlock.innerHTML = this.generateEditFormHtml(isWorkPage);
                }

                if (btn.classList.contains("edit-note-btn")) {
                    // Prevent details from toggling
                    e.preventDefault();
                    const noteContent = noteBlock.querySelector("details");
                    noteContent.querySelector(".note-body").style.display = "none";
                    noteContent.querySelector(".note-edit-form").style.display = "block";

                    btn.closest('details').open = true;
                }

                if (btn.classList.contains("save-note-btn")) {
                    const textarea = noteBlock.querySelector(".note-textarea");
                    const ficDetails = this.getFicDetails(workId, isWorkPage);
                    this.saveNote(workId, textarea.value, ficDetails);
                    this.updateNoteDisplay(noteBlock, workId, isWorkPage, isNoteAggregatorModal);
                }

                if (btn.classList.contains("cancel-edit-btn")) {
                    this.updateNoteDisplay(noteBlock, workId, isWorkPage, isNoteAggregatorModal);
                }

                if (btn.classList.contains("delete-note-btn")) {
                    // Prevent details from toggling
                    e.preventDefault();
                    if (confirm("Delete this note?")) {
                        this.deleteNote(workId);
                        this.updateNoteDisplay(noteBlock, workId, isWorkPage, isNoteAggregatorModal);
                    }
                }
            });
        }

        generateEditFormHtml(isWorkPage = false) {
            return `
                <style>
                    @media screen and (max-width: 42em) {
                        .user-note-preview > div > div {
                            width: 100% !important;
                        }
                    }
                </style>
                <div style="display: flex; justify-content: center;">
                    <div style="margin: 18px 0 1px 0; border: 1px solid currentColor; border-radius: 4px; padding: 12px; background: rgba(128,128,128,0.05); box-sizing: border-box !important; width: ${isWorkPage ? '60%' : '100%'};">
                        <textarea class="note-textarea" placeholder="Write your note here..." style="box-sizing: border-box; width: 100%; min-height: 100px; margin-bottom: 8px; padding: 8px; border: 1px solid rgba(128,128,128,0.2); border-radius: 4px;"></textarea>
                        <div style="display: flex; gap: 8px; justify-content: flex-end;">
                            <button class="save-note-btn" style="cursor: pointer;">💾 Save</button>
                            <button class="cancel-edit-btn" style="cursor: pointer;">❌ Cancel</button>
                        </div>
                    </div>
                </div>
            `;
        }


        updateNoteDisplay(noteBlock, workId, isWorkPage = false, isNoteAggregatorModal = false) {
            noteBlock.outerHTML = this.generateNoteHtml(workId, isWorkPage, isNoteAggregatorModal);
        }


        getFicDetails(workId, isWorkPage = false) {
            if (isWorkPage) {
                const title = document.querySelector('h2.title.heading').textContent.trim();
                const author = document.querySelector('a[rel="author"]')?.textContent;
                const fandom = document.querySelector('dd.fandom.tags ul a.tag').textContent;
                return {title, author, fandom}
            } else {              
                const fic = document.querySelector(`li#work_${workId}, li.work-${workId}`);
                if (!fic) return;  

                const header = fic.querySelector('div.header.module');
                const title = header.querySelector('a[href^="/works/"]').textContent;
                const author = header.querySelector('a[rel="author"]')?.textContent;
                // explicitly save only one fandom to avoid clutter
                const fandom = header.querySelector('h5.fandoms.heading > a.tag').textContent;
                return {title, author, fandom}
            }
        }


        getFicDetailsHTML(workId, note) {
            const container = document.createElement('span');

            if (note.title) {
                const fandomLink = document.createElement('a');
                fandomLink.target = '_blank';
                fandomLink.href = `/tags/${encodeURIComponent(note.fandom)}/works`;
                fandomLink.textContent = note.fandom;

                const workLink = document.createElement('a');
                workLink.target = '_blank';
                workLink.href = `/works/${workId}`;
                workLink.textContent = note.title;

                const authorLink = document.createElement('a');
                authorLink.target = '_blank';
                authorLink.href = `/users/${encodeURIComponent(note.author)}`;
                authorLink.textContent = note.author;

                container.append(fandomLink, ' - ', workLink, ' by ', authorLink);
            } else {
                // legacy fallback - only work link
                const workLink = document.createElement('a');
                workLink.target = '_blank';
                workLink.href = `/works/${workId}`;
                workLink.textContent = `Work #${workId}`;
                container.append(workLink);
            }

            return container;
        }


        // Add sorting options later
        getNotesSorted() {
            const userNotesObj = this.getAllNotes();
            const notesEntries = Object.entries(userNotesObj);
            // sort by most recent
            notesEntries.sort(([, noteA], [, noteB]) => new Date(noteB.date) - new Date(noteA.date));

            return notesEntries;
        }


        // Retrieve an arr of notes html specifically for MyNotes manager
        getNotesHTML(notesEntries) {
            const htmlNotesList = notesEntries.map(([workId, note]) => {
                return this.generateNoteHtml(workId, false, true);
            });
            return htmlNotesList;
        }


        getMyNotesModalHTML(htmlNotesList) {
            const notesModalHTML = `
                <div style="position: sticky;top: 0;z-index: 10;">
                    <label for="notes_search">Search Notes:</label>
                    <input type="search" id="ft_notes_search">
                </div>
                <div id='ft_notesList'>
                    ${htmlNotesList.join("")}
                </div>
            `;
            return notesModalHTML;
        }


        filterNotes(searchQuery) {
            const sortedNotes = this.getNotesSorted();
            const searchTokens = searchQuery
                .trim()
                .toLowerCase()
                .split(/\s+/);

            if (searchTokens.length === 0) return sortedNotes;

            const filteredNotes = sortedNotes.filter(([, note]) => {
                const noteTokens = [
                    ...(note.title || '').toLowerCase().split(/\s+/),
                    ...(note.author || '').toLowerCase().split(/\s+/),
                    ...(note.fandom || '').toLowerCase().split(/\s+/),
                    ...note.text.toLowerCase().split(/\s+/)
                ];

                // every search token must be present, ordering doent matter
                return searchTokens.every(token =>
                    noteTokens.some(word => word.startsWith(token))
                );
            });

            return filteredNotes;
        }
    }

    
    // Class for managing storage caching
    class StorageManager {
        // Store a value in local storage
        setItem(key, value) {
            localStorage.setItem(key, value);
        }

        // Retrieve a value from local storage
        getItem(key) {
            const value = localStorage.getItem(key);
            return value;
        }

        // Add an ID to a specific category
        addIdToCategory(category, id) {
            const existingIds = this.getItem(category);
            const idsArray = existingIds ? existingIds.split(',') : [];

            if (!idsArray.includes(id)) {
                idsArray.push(id);
                this.setItem(category, idsArray.join(',')); // Update the category with new ID
                DEBUG && console.debug(`[FicTracker] Added ID to category "${category}": ${id}`);
            }
        }

        // Remove an ID from a specific category
        removeIdFromCategory(category, id) {
            const existingIds = this.getItem(category);
            const idsArray = existingIds ? existingIds.split(',') : [];

            const idx = idsArray.indexOf(id);
            if (idx !== -1) {
                idsArray.splice(idx, 1); // Remove the ID
                this.setItem(category, idsArray.join(',')); // Update the category
                DEBUG && console.debug(`[FicTracker] Removed ID from category "${category}": ${id}`);
            }
        }

        // Get IDs from a specific category
        getIdsFromCategory(category) {
            const existingIds = this.getItem(category) || '';
            const idsArray = existingIds.split(',');
            DEBUG && console.debug(`[FicTracker] Retrieved IDs from category "${category}"`);
            return idsArray;
        }
    }

    // Manages syncing data between local storage and a remote backend (google sheets api)
    class RemoteStorageSyncManager {
        constructor() {
            this.storageManager = new StorageManager();
            // Sync all configured status storage keys dynamically
            this.syncedKeys = settings.statuses.map(s => s.storageKey);
            this.PENDING_CHANGES_KEY = 'FT_pendingChanges';
            this.LAST_SYNC_KEY = 'FT_lastSync';

            // Configuration
            this.syncInterval = settings.syncInterval * 1000 //seconds
            this.syncTimer = null;
            this.isOnline = navigator.onLine;

            // Floating widget props
            this.syncWidget = null;
            this.timeUntilNextSync = 0;
            this.isSyncing = false;

            // Preserve this context
            this.handleOnline = this.handleOnline.bind(this);
            this.handleOffline = this.handleOffline.bind(this);
            this.handleVisibilityChange = this.handleVisibilityChange.bind(this);

            DEBUG && console.log('[FicTracker] Initialized RemoteStorageSyncManager with syncInterval:', this.syncInterval / 1000, 's');
        }

        // Initialize sync system
        init() {
            // Initialize pending changes storage if not present
            if (!this.storageManager.getItem(this.PENDING_CHANGES_KEY)) {
                this.storageManager.setItem(this.PENDING_CHANGES_KEY, JSON.stringify({
                    operations: [],
                    notes: []
                }));
            }

            DEBUG && console.log('[FicTracker] Pending changes storage initialized');

            // Set up event listeners for (dis)connecting to network, tab focus change
            window.addEventListener('online', this.handleOnline);
            window.addEventListener('offline', this.handleOffline);

            document.addEventListener('visibilitychange', this.handleVisibilityChange);

            // Start sync timer
            this.startSyncTimer();

            // Add widget with timer
            if (settings.syncWidgetEnabled && settings.syncDBInitialized) {
                this.updateSyncWidget();
                setInterval(() => {
                    if (this.timeUntilNextSync > 0) this.timeUntilNextSync--;
                    this.updateSyncWidget(this.isOnline ? (this.isSyncing ? 'syncing' : 'normal') : 'offline');
                }, 1000);
            }
        }

        // Method to create widget and handle all updates
        updateSyncWidget(state = 'normal') {
            if (!settings.syncWidgetEnabled || !settings.syncDBInitialized) return;

            // create widget if it doesn't exist
            if (!this.syncWidget) {
                const mobile = window.innerWidth <= 768;

                document.body.insertAdjacentHTML('beforeend', `
                    <div id="ft-sync-widget" style="position:fixed;bottom:15px;left:10px;z-index:10000;display:flex;align-items:center; opacity: ${settings.syncWidgetOpacity};gap:${mobile?'2px':'4px'};padding:${mobile?'2px 3px':'3px 5px'};background:#fff;border:1px solid #ddd;border-radius:${mobile?'10px':'16px'};cursor:pointer;font:${mobile?'11px':'12px'} -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#666;box-shadow:0 2px 8px rgba(0,0,0,0.1);transition:all 0.2s;user-select:none">
                        <svg width="${mobile?'12':'14'}" height="${mobile?'12':'14'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="transition:transform 0.3s">
                            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                        </svg>
                        <span style="font-weight:500;">Sync</span>
                        <span id="ft-sync-badge" style="display:none;background:#ff9800;color:white;border-radius:6px;padding:1px ${mobile?'3px':'5px'};font-size:${mobile?'9px':'10px'};font-weight:bold;margin-left:2px">0</span>
                    </div>
                `);

                this.syncWidget = document.getElementById('ft-sync-widget');
                this.syncBadge = document.getElementById('ft-sync-badge');

                // spin animation
                if (!document.getElementById('ft-spin')) {
                    document.head.insertAdjacentHTML('beforeend', '<style id="ft-spin">@keyframes ft-spin{to{transform:rotate(360deg)}}</style>');
                }

                // click handler
                this.syncWidget.onclick = () => this.isOnline && !this.isSyncing && this.performSync();

                // hover effect
                this.syncWidget.onmouseenter = () => !this.isSyncing && Object.assign(this.syncWidget.style, {
                    opacity: '1',
                    background: '#f8f9fa',
                    borderColor: '#0066cc',
                    transform: 'translateY(-1px)'
                });
                this.syncWidget.onmouseleave = () => {
                    this.syncWidget.style.opacity = settings.syncWidgetOpacity;
                    this.updateSyncWidget(this.isSyncing ? 'syncing' : 'normal');
                };
            }

            // Update badge based on pending count
            const pendingChanges = this.getPendingChanges();
            const pendingCount = (pendingChanges.operations?.length || 0) + (pendingChanges.notes?.length || 0);
            if (pendingCount > 0) {
                this.syncBadge.style.display = 'inline-block';
                this.syncBadge.textContent = pendingCount;
            } else {
                this.syncBadge.style.display = 'none';
            }

            // Update widget based on state
            const states = {
                normal: ['#fff', '#ddd', '#666', 'none', 'pointer', this.timeUntilNextSync <= 0 ? 'Sync now' : (this.timeUntilNextSync > 60 ? `${Math.floor(this.timeUntilNextSync/60)}m ${this.timeUntilNextSync%60}s` : `${this.timeUntilNextSync}s`)],
                syncing: ['#e3f2fd', '#2196f3', '#1976d2', 'ft-spin 1s linear infinite', 'default', 'Syncing...'],
                success: ['#e8f5e8', '#4caf50', '#2e7d32', 'none', 'pointer', 'Synced!'],
                error: ['#ffebee', '#f44336', '#c62828', 'none', 'pointer', 'Failed'],
                offline: ['#f5f5f5', '#ccc', '#999', 'none', 'default', 'Offline']
            };

            const [bg, border, color, animation, cursor, text] = states[state] || states.normal;
            const [icon, textEl, badge] = this.syncWidget.children;

            Object.assign(this.syncWidget.style, {
                background: bg,
                borderColor: border,
                cursor
            });
            Object.assign(icon.style, {
                animation,
                color
            });
            textEl.textContent = text;
            textEl.style.color = color;

            // Auto-revert success to normal
            if (state === 'success') {
                setTimeout(() => this.updateSyncWidget('normal'), 2000);
            }
        }

        // Only sync when tab is focused to prevent redundant requests form multiple tabs
        handleVisibilityChange() {
            if (document.visibilityState === 'visible') {
                DEBUG && console.log('[FicTracker] Tab is visible – starting sync timer');
                this.startSyncTimer();
            } else {
                DEBUG && console.log('[FicTracker] Tab hidden – stopping sync timer');
                this.stopSyncTimer();
            }
        }

        // Start periodic sync timer
        startSyncTimer() {
            // Stop any existing sync timers to avoid duplicates
            this.stopSyncTimer();

            // If syncing is disabled in settings, update UI and exit
            if (!settings.syncEnabled) {
                DEBUG && console.log('[FicTracker] Sync is disabled, timer not started.');
                this.updateSyncWidget();
                return;
            }

            const now = Date.now();
            const lastSync = parseInt(this.storageManager.getItem(this.LAST_SYNC_KEY)) || 0;
            // Calculate how long it's been since the last successful sync
            const timeSinceLastSync = (now - lastSync);

            DEBUG && console.log(`[FicTracker] Time since last sync: ${timeSinceLastSync / 1000}s`);

            // If enough time has passed, sync immediately and start interval
            if (timeSinceLastSync >= this.syncInterval) {
                DEBUG && console.log('[FicTracker] Sync interval exceeded - performing immediate sync');
                this.timeUntilNextSync = 0;
                this.performSync();
                this.syncTimer = setInterval(() => {
                    if (this.isOnline) this.performSync();
                }, this.syncInterval);

                // If not enough time has passed, schedule a one-time timeout to sync later    
            } else {
                const timeUntilNextSync = this.syncInterval - timeSinceLastSync;
                this.timeUntilNextSync = Math.ceil(timeUntilNextSync / 1000);

                DEBUG && console.log(`[FicTracker] Sync interval not yet reached - scheduling in ${timeUntilNextSync / 1000}s`);

                this.syncTimeout = setTimeout(() => {
                    if (this.isOnline) this.performSync();
                    this.syncTimer = setInterval(() => {
                        if (this.isOnline) this.performSync();
                    }, this.syncInterval);
                    this.syncTimeout = null; // clear reference
                }, timeUntilNextSync);
            }
        }

        // Stop sync timer
        stopSyncTimer() {
            DEBUG && console.log('[FicTracker] Stopping sync timers...');

            // Clear the periodic sync interval if it's active
            if (this.syncTimer) {
                clearInterval(this.syncTimer);
                this.syncTimer = null;
            }

            // Clear any scheduled one-time sync timeout if it's active
            if (this.syncTimeout) {
                clearTimeout(this.syncTimeout);
                this.syncTimeout = null;
            }
        }

        // Handle online event
        handleOnline() {
            this.isOnline = true;
            DEBUG && console.log('[FicTracker] Back online, resuming sync');
            this.performSync();
        }

        // Handle offline event
        handleOffline() {
            this.isOnline = false;
            DEBUG && console.log('[FicTracker] Gone offline, pausing sync');
        }

        // Add a change to the pending queue
        addPendingStatusChange(action, statusKey, fanficId) {
            const pendingChanges = this.getPendingChanges();

            // Optimize operations - remove conflicting operations
            const newOperation = {
                action,
                key: statusKey,
                value: fanficId
            };

            DEBUG && console.log(`[FicTracker] Queuing pending status change: ${action} ${statusKey} → ${fanficId}`);
            this.optimizeOperations(pendingChanges.operations, newOperation);

            pendingChanges.operations.push(newOperation);
            this.savePendingChanges(pendingChanges);
        }

        // Add a note update to the pending queue
        addPendingNoteUpdate(fanficId, text, date) {
            const pendingChanges = this.getPendingChanges();
            DEBUG && console.log(`[FicTracker] Updating note for fanficId="${fanficId}", text="${text}", date="${date}"`);

            // Remove any existing note update for this fanfic
            pendingChanges.notes = pendingChanges.notes.filter(
                update => update.fanficId !== fanficId
            );

            pendingChanges.notes.push({
                fanficId,
                text: text || '',
                date: date || null
            });
            
            this.savePendingChanges(pendingChanges);
        }

        // Optimize operations by removing conflicting ones
        optimizeOperations(operations, newOperation) {
            const {
                action,
                key,
                value
            } = newOperation;

            // Find and remove conflicting operations
            for (let i = operations.length - 1; i >= 0; i--) {
                const existing = operations[i];

                if (existing.key === key && existing.value === value) {
                    // Same key-value pair
                    if (existing.action !== action) {
                        // Conflicting actions (add vs remove) - remove the existing one
                        operations.splice(i, 1);
                        DEBUG && console.log(`[FicTracker] Optimized conflicting operations for ${key}:${value}`);
                    } else {
                        // Same action - remove duplicate
                        DEBUG && console.log(`[FicTracker] Removed duplicate operation for ${key}:${value}`);
                        return; // Don't add the new operation either
                    }
                }
            }
        }

        // Get pending changes from localStorage
        getPendingChanges() {
            try {
                const changes = this.storageManager.getItem(this.PENDING_CHANGES_KEY);
                return changes ? JSON.parse(changes) : {
                    operations: [],
                    notes: []
                };
            } catch (error) {
                DEBUG && console.error('[FicTracker] Error parsing pending changes:', error);
                return {
                    operations: [],
                    notes: []
                };
            }
        }

        // Save pending changes to localStorage
        savePendingChanges(changes) {
            this.storageManager.setItem(this.PENDING_CHANGES_KEY, JSON.stringify(changes));
            DEBUG && console.log('[FicTracker] Saved pending changes to storage');
        }

        // Clear pending changes
        clearPendingChanges() {
            // Reset pending operations and notes to an empty state in storage
            this.storageManager.setItem(this.PENDING_CHANGES_KEY, JSON.stringify({
                operations: [],
                notes: []
            }));
            DEBUG && console.log('[FicTracker] Cleared all pending changes (operations and notes).');
        }

        // Perform sync
        async performSync() {
            if (!this.isOnline) {
                DEBUG && console.log('[FicTracker] Offline, skipping sync');
                return;
            }

            // update widget appropriately
            this.isSyncing = true;
            this.updateSyncWidget('syncing');

            const pendingChanges = this.getPendingChanges();
            DEBUG && console.log('[FicTracker] Performing sync, pending operations:', pendingChanges.operations.length, 'notes:', pendingChanges.notes.length);

            try {
                let syncData = {
                    action: 'sync',
                    queue: pendingChanges
                }

                DEBUG && console.log('[FicTracker] Starting sync:', syncData);

                const response = await this.sendSyncRequest(syncData);

                if (response.success) {
                    // Update local storage with server data
                    this.updateLocalStorage(response.status_data);

                    this.timeUntilNextSync = this.syncInterval / 1000;
                    this.isSyncing = false;
                    this.updateSyncWidget('success');

                    // Update notes if provided
                    if (response.notes) {
                        this.updateLocalNotes(response.notes);
                    }

                    // Clear pending changes
                    this.clearPendingChanges();

                    // Update last sync timestamp
                    this.storageManager.setItem(this.LAST_SYNC_KEY, Date.now().toString());

                    DEBUG && console.log('[FicTracker] Sync completed successfully');
                } else {
                    DEBUG && console.error('[FicTracker] Sync failed:', response.error || 'Unknown error');
                    this.isSyncing = false;
                    this.updateSyncWidget('error');
                }

            } catch (error) {
                this.isSyncing = false;
                this.updateSyncWidget('error');
                DEBUG && console.error('[FicTracker] Sync failed:', error);
            }
        }

        // Send sync request to server
        async sendSyncRequest(data) {
            // Wrap the sync request in a promise to handle async response with resolve/reject
            return new Promise((resolve, reject) => {
                DEBUG && console.log('[FicTracker] Sending sync request to:', settings.sheetUrl);

                // Use GM_xmlhttpRequest instead of fetch to avoid CORS
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: settings.sheetUrl,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(data),
                    timeout: 15000, // 15s timeout
                    onload: (response) => {
                        try {
                            const result = JSON.parse(response.responseText);
                            DEBUG && console.log('[FicTracker] Server response received and parsed successfully:', result);
                            resolve(result);
                        } catch (error) {
                            // Reject if server returns non-JSON or fails to parse
                            reject(new Error('Invalid JSON response'));
                        }
                    },
                    onerror: (error) => {
                        DEBUG && console.error('[FicTracker] Sync request failed due to network error:', error);
                        reject(new Error('Network error'));
                    },
                    ontimeout: () => {
                        DEBUG && console.warn('[FicTracker] Sync request timed out.');
                        reject(new Error('Request timeout'));
                    }
                });
            });
        }

        // Update local storage with server data
        updateLocalStorage(serverData) {
            // Iterate through the list of keys that are eligible for syncing
            for (const key of this.syncedKeys) {
                // If the server response contains the key, update local storage with its value
                if (serverData.hasOwnProperty(key)) {
                    this.storageManager.setItem(key, serverData[key]);
                    DEBUG && console.log(`[FicTracker] Synced key "${key}" updated from server data.`);
                }
            }
        }

        // Update local storage with server notes data
        updateLocalNotes(serverNotes) {
            // Overwrite local user notes with the latest version from the server
            this.storageManager.setItem('FT_userNotes', JSON.stringify(serverNotes));
            DEBUG && console.log('[FicTracker] Local user notes updated from server.');
        }

        // Get sync status info
        getSyncStatus() {
            // Retrieve current pending operations and notes from storage
            const pendingChanges = this.getPendingChanges();
            const lastSync = this.storageManager.getItem(this.LAST_SYNC_KEY);

            DEBUG && console.log('[FicTracker] Sync status retrieved:', {
                pendingOperations: pendingChanges.operations.length,
                pendingNoteUpdates: pendingChanges.notes.length,
                lastSync: lastSync ? new Date(parseInt(lastSync)) : null,
                isOnline: this.isOnline
            });


            // Return an object summarizing sync status for UI/debug purposes
            return {
                pendingOperations: pendingChanges.operations.length,
                pendingNoteUpdates: pendingChanges.notes.length,
                lastSync: lastSync ? new Date(parseInt(lastSync)) : null,
                isOnline: this.isOnline
            };
        }
    }


    // Class for bookmark data and tag management abstraction to keep things DRY
    class BookmarkTagManager {
        constructor(htmlSource) {
            // If it's already a document, use it directly, otherwise parse the HTML string
            if (htmlSource instanceof Document) {
                this.doc = htmlSource;
            } else {
                // Use DOMParser to parse the HTML response
                const parser = new DOMParser();
                this.doc = parser.parseFromString(htmlSource, 'text/html');
            }
        }

        // Get the work ID from the DOM
        getWorkId() {
            return this.doc.getElementById('kudo_commentable_id')?.value || null;
        }

        // Get the bookmark ID from the form's action attribute
        getBookmarkId() {
            const bookmarkForm = this.doc.querySelector('div#bookmark_form_placement form');
            return bookmarkForm ? bookmarkForm.getAttribute('action').split('/')[2] : null;
        }

        // Get the pseud ID from the input
        getPseudId() {
            const singlePseud = this.doc.querySelector('input#bookmark_pseud_id');

            if (singlePseud) {
                return singlePseud.value;
            } else {
                // If user has multiple pseuds - use the default one to create bookmark
                const pseudSelect = this.doc.querySelector('select#bookmark_pseud_id');
                return pseudSelect?.value || null;
            }
        }

        // Gather all bookmark-related data into an object
        getBookmarkData() {
            return {
                workId: this.getWorkId(),
                bookmarkId: this.getBookmarkId(),
                pseudId: this.getPseudId(),
                bookmarkTags: this.getBookmarkTags(),
                notes: this.getBookmarkNotes(),
                collections: this.getBookmarkCollections(),
                isPrivate: this.isBookmarkPrivate(),
                isRec: this.isBookmarkRec()
            };
        }

        getBookmarkTags() {
            return this.doc.querySelector('#bookmark_tag_string').value.split(', ').filter(tag => tag.length > 0);;
        }

        getBookmarkNotes() {
            return this.doc.querySelector('textarea#bookmark_notes').textContent;
        }

        getBookmarkCollections() {
            return this.doc.querySelector('#bookmark_collection_names').value.split(',').filter(col => col.length > 0);;
        }

        isBookmarkPrivate() {
            return this.doc.querySelector('#bookmark_private')?.checked || false;
        }

        isBookmarkRec() {
            return this.doc.querySelector('#bookmark_recommendation')?.checked || false;
        }

        async processTagToggle(tag, isTagPresent, bookmarkData, authenticityToken, storageKey, storageManager, requestManager, remoteSyncManager) {
            // Toggle the bookmark tag and log the action
            if (isTagPresent) {
                DEBUG && console.log(`[FicTracker] Removing tag: ${tag}`);
                bookmarkData.bookmarkTags.splice(bookmarkData.bookmarkTags.indexOf(tag), 1);
                storageManager.removeIdFromCategory(storageKey, bookmarkData.workId);
                
            if (remoteSyncManager) {
                remoteSyncManager.addPendingStatusChange('remove', storageKey, bookmarkData.workId);
            }

            } else {
                DEBUG && console.log(`[FicTracker] Adding tag: ${tag}`);
                bookmarkData.bookmarkTags.push(tag);
                storageManager.addIdToCategory(storageKey, bookmarkData.workId);

                if (remoteSyncManager) {
                    remoteSyncManager.addPendingStatusChange('add', storageKey, bookmarkData.workId);
                }
            }


            // If the bookmark exists - update it, if not - create a new one
            if (bookmarkData.workId !== bookmarkData.bookmarkId) {
                // If bookmark becomes empty (no notes, tags, collections) after status change - delete it
                const hasNoData = bookmarkData.notes === "" && bookmarkData.bookmarkTags.length === 0 && bookmarkData.collections.length === 0;

                if (settings.deleteEmptyBookmarks && hasNoData) {
                    DEBUG && console.log(`[FicTracker] Deleting empty bookmark ID: ${bookmarkData.bookmarkId}`);
                    await requestManager.deleteBookmark(bookmarkData.bookmarkId, authenticityToken);
                    bookmarkData.bookmarkId = bookmarkData.workId;
                } else {
                    // Update the existing bookmark
                    await requestManager.updateBookmark(bookmarkData.bookmarkId, authenticityToken, bookmarkData);
                }

            } else {
                // Create a new bookmark
                bookmarkData.isPrivate = settings.newBookmarksPrivate;
                bookmarkData.isRec = settings.newBookmarksRec;
                bookmarkData.bookmarkId = await requestManager.createBookmark(bookmarkData.workId, authenticityToken, bookmarkData);

                DEBUG && console.log(`[FicTracker] Created bookmark ID: ${bookmarkData.bookmarkId}`);
            }

            return bookmarkData
        }
    }


    // Class for managing bookmark status updates
    class BookmarkManager {
        constructor(baseApiUrl) {
            this.requestManager = new RequestManager(baseApiUrl);
            this.storageManager = new StorageManager();
            this.bookmarkTagManager = new BookmarkTagManager(document);

            // Start remote manager if enabled in settings
            if (settings.syncEnabled) {
                this.remoteSyncManager = new RemoteStorageSyncManager();
                this.remoteSyncManager.init();
            }

            // Initialize user notes manager
            this.userNotesManager = new CustomUserNotesManager(this.storageManager, this.remoteSyncManager);


            // Extract bookmark-related data from the DOM
            this.bookmarkData = this.bookmarkTagManager.getBookmarkData();

            DEBUG && console.log(`[FicTracker] Initialized BookmarkManager with data:`);
            DEBUG && console.table(this.bookmarkData)

            // Hide the default "to read" button if specified in settings
            if (settings.hideDefaultToreadBtn) {
                document.querySelector('li.mark').style.display = "none";
            }

            this.addButtons();
        }

        // Add action buttons and notes to the UI
        addButtons() {
            const actionsMenu = document.querySelector('ul.work.navigation.actions');
            const bottomActionsMenu = document.querySelector('div#feedback > ul');
            
            // Add user notes if enabled
            if (settings.displayUserNotes) {
                const ficWrapperContainer = document.querySelector('#main div.wrapper');
                const containerForNotes = ficWrapperContainer.parentElement;

                ficWrapperContainer.insertAdjacentHTML('afterend', 
                    this.userNotesManager.generateNoteHtml(this.bookmarkData.workId, true)
                );
                this.userNotesManager.setupNoteHandlers(containerForNotes, true);
            }

            settings.statuses.forEach(({
                tag,
                positiveLabel,
                negativeLabel,
                selector,
                enabled
            }) => {

                // Skip rendering btn for disabled status
                if (!enabled) return;

                // Case insensitive tag matching
                const isTagged = this.bookmarkData.bookmarkTags.some(
                    t => t.toLowerCase() === tag.toLowerCase()
                );

                const buttonHtml = `<li class="mark-as-read" id="${selector}"><a href="#">${isTagged ? negativeLabel : positiveLabel}</a></li>`;

                actionsMenu.insertAdjacentHTML('beforeend', buttonHtml);

                // insert button duplicate at the bottom
                if (settings.displayBottomActionButtons) {
                    bottomActionsMenu.insertAdjacentHTML('beforeend', buttonHtml);
                }
            });

            this.setupClickListeners();
        }

        // Set up click listeners for each action button
        setupClickListeners() {
            settings.statuses.forEach(({
                selector,
                tag,
                positiveLabel,
                negativeLabel,
                storageKey,
                enabled
            }) => {
                // Don't setup listener for disabled btn
                if (!enabled) return;

                // Use querySelectorAll to get all elements with the duplicate ID (bottom menu)
                document.querySelectorAll(`#${selector}`).forEach(button => {
                    button.addEventListener('click', (event) => {
                        event.preventDefault();

                        this.handleActionButton(tag, positiveLabel, negativeLabel, selector, storageKey);
                    });
                });
            });
        }

        // Handle the action for adding/removing/deleting a bookmark tag
        async handleActionButton(tag, positiveLabel, negativeLabel, selector, storageKey) {
            const authenticityToken = this.requestManager.getAuthenticityToken();
            const isTagPresent = this.bookmarkData.bookmarkTags.includes(tag);

            // Consider button bottom menu duplication
            const buttons = document.querySelectorAll(`#${selector} a`);

            // Disable the buttons and show loading state
            buttons.forEach((btn) => {
                btn.innerHTML = settings.loadingLabel;
                btn.disabled = true;
            });

            try {
                // Send tag toggle request and modify cached bookmark data
                this.bookmarkData = await this.bookmarkTagManager.processTagToggle(tag, isTagPresent, this.bookmarkData, authenticityToken,
                    storageKey, this.storageManager, this.requestManager, this.remoteSyncManager);

                // Update the labels for all buttons
                buttons.forEach((btn) => {
                    btn.innerHTML = isTagPresent ? positiveLabel : negativeLabel;
                });

            } catch (error) {
                console.error(`[FicTracker] Error during bookmark operation:`, error);
                buttons.forEach((btn) => {
                    btn.innerHTML = 'Error! Try Again';
                });
            } finally {
                buttons.forEach((btn) => {
                    btn.disabled = false;
                });
            }
        }


    }

    // Class for handling features on works list page
    class WorksListHandler {
        constructor() {
            this.storageManager = new StorageManager();
            this.requestManager = new RequestManager('https://archiveofourown.org/');

            // Start remote manager if enabled in settings
            if (settings.syncEnabled) {
                this.remoteSyncManager = new RemoteStorageSyncManager();
                this.remoteSyncManager.init();
            }

            // Initialize user notes manager
            this.userNotesManager = new CustomUserNotesManager(this.storageManager, this.remoteSyncManager);

            this.loadStoredIds();

            // Update the work list upon initialization
            this.updateWorkList();

            // Listen for clicks on quick tag buttons
            this.setupQuickTagListener();

            this.setupOnPageSorting();
        }


        // Retrieve stored IDs for different statuses
        loadStoredIds() {
            this.worksStoredIds = settings.statuses.reduce((acc, status) => {
                if (status.enabled) {
                    acc[status.storageKey] = this.storageManager.getIdsFromCategory(status.storageKey);
                }
                return acc;
            }, {});
        }

        // Execute features for each work on the page
        updateWorkList() {
            const works = document.querySelectorAll('li.work.blurb, li.bookmark.blurb');
            works.forEach(work => {
                // Skip deleted works that show the "deleted" message
                if (work.querySelector('.message')?.textContent.includes('has been deleted')) {
                    DEBUG && console.log('[FicTracker] Skipping deleted work:', work.id);
                    return;
                }

                const workId = this.getWorkId(work);
                // Skip if we couldn't get a valid work ID
                if (!workId) {
                    DEBUG && console.log('[FicTracker] Skipping work - could not get work ID');
                    return;
                }

                // Only status highlighting for now, TBA
                this.highlightWorkStatus(work, workId, true);

                // Reload stored IDs to reflect any changes in storage (from fic card)
                this.loadStoredIds(); 

                this.addQuickTagDropdown(work);

                // Display note management btn if enabled
                if (settings.displayUserNotes) {
                    this.addNoteButton(work);
                }
            });

            // Prefill all notes, listen for edits
            this.prefillNotes();
        }

        // Get the work ID from DOM
        getWorkId(work) {
            const link = work.querySelector('h4.heading a');
            const workId = link.href.split('/').pop();
            return workId;
        }

        // Change the visuals of each work's status
        highlightWorkStatus(work, workId, cardToStorageSync = false) {
            let shouldBeCollapsable = false;
            const appliedStatuses = new Set();

            // First check localStorage statuses
            Object.entries(this.worksStoredIds).forEach(([status, storedIds]) => {
                const statusClass = `glowing-border-${status}`;
                const hasStatus = storedIds.includes(workId);

                if (hasStatus) {
                    // Add appropriate class for collapsable works
                    work.classList.add(statusClass);
                    appliedStatuses.add(status);

                    const statusSettings = getStatusSettingsByStorageKey(status);
                    if (statusSettings?.collapse === true) {
                        shouldBeCollapsable = true;
                    }
                } else {
                    work.classList.remove(statusClass);
                }
            });

            // If no status was found in localStorage, check for bookmark tags in the card
            if (appliedStatuses.size === 0 && cardToStorageSync === true) {
                const userModule = work.querySelector('div.own.user.module.group');
                DEBUG && console.debug(`[FicTracker] Checking bookmark card for work ${workId}`);
                if (userModule) {
                    const tagsList = userModule.querySelector('ul.meta.tags.commas');
                    if (tagsList) {
                        const tagElements = tagsList.querySelectorAll('a.tag');
                        tagElements.forEach(tagElement => {
                            const tagText = tagElement.textContent.trim();
                            // Find matching status in settings
                            const matchingStatus = settings.statuses.find(status => status.tag === tagText);
                            if (matchingStatus) {
                                const statusClass = `glowing-border-${matchingStatus.storageKey}`;
                                work.classList.add(statusClass);
                                appliedStatuses.add(matchingStatus.storageKey);
                                DEBUG && console.log(`[FicTracker] Found status tag: ${tagText}`);

                                // Add the work ID to storage if it's not there yet
                                this.storageManager.addIdToCategory(matchingStatus.storageKey, workId);
                                DEBUG && console.log(`[FicTracker] Synced work ${workId} to storage for status: ${matchingStatus.storageKey}`);

                                if (matchingStatus.collapse === true) {
                                    shouldBeCollapsable = true;
                                }
                            }
                        });
                    }
                }
            }

            const ownBookmarksPage = isOwnBookmarksPage();
            const collapseAllowed = !ownBookmarksPage || settings.collapseAndHideOnBookmarks;
            
            // If at least one of the statuses of the work is set to be collapsable - let it be so
            // But check if we're on own bookmarks page and collapse is disabled there
            if (shouldBeCollapsable && collapseAllowed) {
                work.classList.add('FT_collapsable');
            } else {
                work.classList.remove('FT_collapsable');
            }
        }


        // Add quick tag toggler dropdown to the work
        addQuickTagDropdown(work) {
            const workId = this.getWorkId(work);

            // Generate the dropdown options dynamically based on the status categories
            const dropdownItems = Object.entries(this.worksStoredIds).map(([status, storedIds], index) => {
                let statusSettings = getStatusSettingsByStorageKey(status);
                // Don't render disabled statuses
                if (!statusSettings.enabled) return;

                const statusLabel = statusSettings[storedIds.includes(workId) ? 'negativeLabel' : 'positiveLabel'];
                return `<li><a href="#" class="work_quicktag_btn" data-work-id="${workId}" data-status-tag="${statusSettings.tag}" data-status-name="${status}">${statusLabel}</a></li>`;
            });

            // No status is enabled, dont render Change Status menu
            if (dropdownItems.length === 0) return;

            work.querySelector('dl.stats').insertAdjacentHTML('beforeend', `
                <header id="header" class="region" style="padding: 0; font-size: 1em !important; cursor: pointer; opacity: 1; word-spacing: normal !important; display: inline;">
                <ul class="navigation actions">
                    <li class="dropdown" aria-haspopup="true" style="position: relative !important;>
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" data-target="#">✨ Change Status ▼</a>
                        <ul class="menu dropdown-menu" style="width: auto !important;">
                            ${dropdownItems.join('')}
                        </ul>
                    </li>
                </ul>
                </header>
            `);
        }

        // Listen for clicks on quicktag dropdown items
        setupQuickTagListener() {
            const worksContainer = document.querySelector('div#main.region');
            // Event delegation for optimization
            worksContainer.addEventListener('click', async (event) => {
                if (event.target.matches('a.work_quicktag_btn')) {
                    const targetStatusTag = event.target.dataset.statusTag;
                    const workId = event.target.dataset.workId;
                    const storageKey = event.target.dataset.statusName;
                    const statusSettings = getStatusSettingsByStorageKey(storageKey);

                    event.target.innerHTML = settings.loadingLabel;

                    // Get request to retrieve work bookmark data
                    const bookmarkData = await this.getRemoteBookmarkData(event.target);
                    const authenticityToken = this.requestManager.getAuthenticityToken();
                    const tagExists = bookmarkData.bookmarkTags.includes(targetStatusTag);

                    try {
                        // Send tag toggle request and modify cached bookmark data
                        this.bookmarkData = await this.bookmarkTagManager.processTagToggle(targetStatusTag, tagExists, bookmarkData, authenticityToken,
                            storageKey, this.storageManager, this.requestManager, this.remoteSyncManager);

                        // Handle both search page and bookmarks page cases for work retrieval
                        const work = document.querySelector(`li#work_${workId}`) || document.querySelector(`li.work-${workId}`);
                        // Update data from localStorage to properly highlight work
                        this.loadStoredIds();
                        this.highlightWorkStatus(work, workId);
                        event.target.innerHTML = tagExists ?
                            statusSettings.positiveLabel :
                            statusSettings.negativeLabel;
                    } catch (error) {
                        console.error(`[FicTracker] Error during bookmark operation:`, error);
                    }

                }
            })
        }

        // Add note functionality to the work
        addNoteButton(work) {
            const workId = this.getWorkId(work);
            // div.header.module | ul.tags.commas | blockquote.userstuff.summary
            const container = work.querySelector('dl.stats');
            
            // Add the note block
            //beforeend | afterend
            container.insertAdjacentHTML('beforebegin', 
                this.userNotesManager.generateNoteHtml(workId)
            );
        }

        // Setup note handlers for the works list
        prefillNotes() {
            if (!settings.displayUserNotes) return;
            
            // div#main.filtered.region, div#main.works-search.region, div#main.series-show.region
            const container = document.querySelector('div#main.region');
            this.userNotesManager.setupNoteHandlers(container);
        }

        // Retrieves bookmark data (if exists) for a given work, by sending HTTP GET req
        async getRemoteBookmarkData(workElem) {
            DEBUG && console.log(`[FicTracker] Quicktag status change, requesting bookmark data workId=${workElem.dataset.workId}`);

            try {
                const data = await this.requestManager.sendRequest(`/works/${workElem.dataset.workId}`, null, null, 'GET');
                DEBUG && console.log('[FicTracker] Bookmark data request successful:');
                DEBUG && console.table(data);

                // Read the response body as text
                const html = await data.text();
                this.bookmarkTagManager = new BookmarkTagManager(html);
                const bookmarkData = this.bookmarkTagManager.getBookmarkData();

                DEBUG && console.log('[FicTracker] HTML parsed successfully:');
                DEBUG && console.table(bookmarkData);

                return bookmarkData;

            } catch (error) {
                DEBUG && console.error('[FicTracker] Error retrieving bookmark data:', error);
            }
        }

        // Setup on-page sorting functionality on own bookmarks page
        setupOnPageSorting() {
            if (isOwnBookmarksPage() && document.querySelector('form#bookmark-filters')) {
                this.injectSortUI();
                this.setupSortListener();
            }
        }

        // Inject sorting UI into the filters form
        injectSortUI() {
            const filtersForm = document.querySelector('form#bookmark-filters fieldset dl');
            if (filtersForm) {
                const sortUI = `
                    <dt class="sort">
                        <label style="cursor: help;" for="ft_onpage_sort" title="AO3's regular sort only works on works search, not bookmarks. This on-page sort lets you reorder the items currently loaded on this page. Note: it only sorts the works visible on this page, not across multiple pages.">Sort by (on-page)</label>
                    </dt>
                    <dd class="sort" style="margin-bottom: 30px;">
                        <select id="ft_onpage_sort">
                            <option value="">-</option>
                            <option value="authors_to_sort_on">Creator</option>
                            <option value="title_to_sort_on">Title</option>
                            <option value="revised_at">Date Updated</option>
                            <option value="word_count">Word Count</option>
                            <option value="hits">Hits</option>
                            <option value="kudos_count">Kudos</option>
                            <option value="comments_count">Comments</option>
                            <option value="bookmarks_count">Bookmarks</option>
                        </select>
                    </dd>
                `;
                filtersForm.insertAdjacentHTML('afterbegin', sortUI);
            }
        }

        // Setup listener for sort selection changes
        setupSortListener() {
            const sortSelect = document.getElementById('ft_onpage_sort');
            if (sortSelect) {
                sortSelect.addEventListener('change', (event) => {
                    const sortBy = event.target.value;
                    if (sortBy) {
                        this.sortBookmarks(sortBy);
                    }
                });
            }
        }

        // Sort bookmarks on the page based on selected criteria
        sortBookmarks(sortBy) {
            const container = document.querySelector('ol.bookmark.index.group');
            if (!container) return;

            const bookmarks = Array.from(container.querySelectorAll('li.bookmark.blurb'));

            const getSortableValue = (bookmark, criteria) => {
                let value;
                switch (criteria) {
                    case 'authors_to_sort_on':
                        value = bookmark.querySelector('a[rel="author"]')?.textContent.trim().toLowerCase();
                        return value || '';
                    case 'title_to_sort_on':
                        value = bookmark.querySelector('h4.heading a')?.textContent.trim().toLowerCase();
                        return value || '';
                    case 'revised_at':
                        value = bookmark.querySelector('p.datetime').textContent.trim();
                        return new Date(bookmark.querySelector('p.datetime').textContent.trim()).getTime() || 0;
                    case 'word_count':
                        value = bookmark.querySelector('dd.words')?.textContent.replace(/,/g, '');
                        return parseInt(value) || 0;
                    case 'hits':
                        value = bookmark.querySelector('dd.hits')?.textContent.replace(/,/g, '');
                        return parseInt(value) || 0;
                    case 'kudos_count':
                        value = bookmark.querySelector('dd.kudos a')?.textContent.replace(/,/g, '');
                        return parseInt(value) || 0;
                    case 'comments_count':
                        value = bookmark.querySelector('dd.comments a')?.textContent.replace(/,/g, '');
                        return parseInt(value) || 0;
                    case 'bookmarks_count':
                        value = bookmark.querySelector('dd.bookmarks a')?.textContent.replace(/,/g, '');
                        return parseInt(value) || 0;
                    default:
                        return 0;
                }
            };

            bookmarks.sort((a, b) => {
                const valA = getSortableValue(a, sortBy);
                const valB = getSortableValue(b, sortBy);

                if (typeof valA === 'string') {
                    return valA.localeCompare(valB);
                } else {
                    // For numeric values, sort descending (more is better)
                    return valB - valA;
                }
            });

            // Re-append sorted bookmarks
            bookmarks.forEach(bookmark => container.appendChild(bookmark));
        }


    }


    // Class for handling the UI & logic for the script settings panel
    class SettingsPageHandler {
        constructor(settings) {
            this.settings = settings;
            this.init();
            
            if (this.settings.syncEnabled) {
                this.initRemoteSyncManager();
            }

        }

        init() {
            // Inject PetiteVue & insert the UI after
            this.injectVueScript(() => {
                this.loadSettingsPanel();
            });
        }

        initRemoteSyncManager() {
            if (!this.remoteSyncManager) {
                this.remoteSyncManager = new RemoteStorageSyncManager();
                this.remoteSyncManager.init();
            }
        }

        // Adding lightweight Vue.js fork (6kb) via CDN
        // Using it saves a ton of repeated LOC to attach event handlers & data binding
        // PetiteVue Homepage: https://github.com/vuejs/petite-vue
        injectVueScript(callback) {
            const vueScript = document.createElement('script');
            vueScript.src = 'https://unpkg.com/petite-vue';
            document.head.appendChild(vueScript);
            vueScript.onload = callback;
        }

        // Load HTML template for the settings panel from GitHub repo
        // Insert into the AO3 preferences page & attach Vue app
        loadSettingsPanel() {
            const container = document.createElement('fieldset');

            // HTML template for the settings panel
            const settingsPanelHtml = `
                <div v-scope @vue:mounted="onMounted">
                <!-- FicTracker Settings Panel HTML -->
                <h1>FicTracker Settings</h1>
                <section>
                    <label for="status_select">Tag to Configure:</label>
                    <div style="display:flex; align-items:center; gap:8px; flex-wrap: wrap;">
                        <select id="status_select" v-model="selectedStatus">
                            <option v-for="(s, idx) in ficTrackerSettings.statuses" :key="s.storageKey || idx" :value="idx">{{ s.tag }}</option>
                        </select>
                        <input type="submit" value="＋ Add Tag" @click="addStatus">
                        <input type="submit" :disabled="!canDeleteSelected" value="🗑️ Delete Tag" @click="deleteStatus">
                    </div>
                    <details style="margin-top: 10px;">
                        <summary>Change Tag Order</summary>
                        <div style="border: 1px solid #ccc; padding: 10px; border-radius: 5px; margin-top: 10px;">
                            <p>Use arrows to change order. This will affect the order of buttons on work pages and in "Change Status" dropdown.</p>
                            <ul style="list-style: none; padding: 0;">
                                <li v-for="(s, idx) in ficTrackerSettings.statuses" :key="s.storageKey || idx" 
                                    :style="{padding: '5px', borderRadius: '3px', background: selectedStatus === idx ? 'rgba(0, 0, 0, 0.3)' : 'transparent', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}">
                                    <span @click="selectedStatus = idx" :style="{cursor: 'pointer'}" :title="'Click to edit ' + s.tag">{{ idx + 1 }}. {{ s.tag }}</span>
                                    <div style="display: flex; gap: 5px;">
                                        <button @click.stop="moveStatus(idx, -1)" :disabled="idx === 0" title="Move Up" style="cursor: pointer;">⬆️</button>
                                        <button @click.stop="moveStatus(idx, 1)" :disabled="idx === ficTrackerSettings.statuses.length - 1" title="Move Down" style="cursor: pointer;">⬇️</button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </details>
                    <details open>
                        <summary>Tag And Labels Settings</summary>
                        <ul id="input_settings">
                            <li>
                                <input type="checkbox" id="toggle_enabled" v-model="currentSettings.enabled">
                                <label for="toggle_enabled">Enabled</label>
                            </li>
                            <li>
                                <input type="checkbox" id="toggle_collapsable" v-model="currentSettings.collapse">
                                <label for="toggle_collapsable" title="If enabled, fanfics with this tag will be collapsed. You can uncollapse them by hovering over.">
                                    Collapse works with this tag
                                </label>
                            </li>
                            <li>
                                <input type="checkbox" id="toggle_hide" v-model="currentSettings.hide">
                                <label for="toggle_hide" title="If enabled, fanfics with this tag will be completely hidden from your view.">
                                    Hide works with this tag
                                </label>
                            </li>
                            <li>
                                <input type="checkbox" id="toggle_displayInDropdown" v-model="currentSettings.displayInDropdown">
                                <label for="toggle_displayInDropdown" title="If enabled, this tag will appear in the top right dropdown.">
                                    Display this tag in dropdown
                                </label>
                            </li>
                            <li>
                                <label for="tag_name">Tag Name:</label>
                                <input type="text" id="tag_name" v-model="currentSettings.tag">
                            </li>
                            <li>
                                <small>Storage key: <code>{{ currentSettings.storageKey }}</code></small>
                            </li>
                            <li>
                                <label for="dropdown_label">Dropdown Label:</label>
                                <input type="text" id="dropdown_label" v-model="currentSettings.dropdownLabel">
                            </li>
                            <li>
                                <label for="positive_label">Action Label:</label>
                                <input type="text" id="positive_label" v-model="currentSettings.positiveLabel">
                            </li>
                            <li>
                                <label for="negative_label">Remove Action Label:</label>
                                <input type="text" id="negative_label" v-model="currentSettings.negativeLabel">
                            </li>
                        </ul>
                    </details>
                </section>
                <section>
                    <details id="highlighting_settings">
                        <summary>Highlighting Settings</summary>
                        <ul>
                            <li>
                                <label for="highlight_color">Highlight Color:</label>
                                <input type="color" id="highlight_color" v-model="currentSettings.highlightColor">
                            </li>
                            <li>
                                <label for="border_size">Border Size:</label>
                                <input type="range" id="border_size" min="0" max="20" v-model="currentSettings.borderSize">
                            </li>
                            <li>
                                <label for="border_opacity">Border Opacity:</label>
                                <input type="range" id="border_opacity" min="0" max="255" step="1" v-model="currentSettings.borderOpacity">
                            </li>
                            <li>
                                <label for="highlight_opacity">Opacity:</label>
                                <input type="range" id="highlight_opacity" min="0" max="1" step="0.1" v-model="currentSettings.opacity">
                            </li>
                            <li>
                                <strong>Preview:</strong>
                                <div :style="previewStyle" id="highlighting_preview">
                                    This is a preview box
                                </div>
                            </li>
                        </ul>
                    </details>
                </section>
                <br>
                <section>
                    <!-- Additional Settings -->
                    <h4 class="heading">Additional Settings</h4>
                    <ul>
                        <!-- Core Functionality -->
                        <li>
                            <input type="checkbox" id="toggle_displayUserNotes" v-model="ficTrackerSettings.displayUserNotes">
                            <label for="toggle_displayUserNotes" 
                                title="Shows the "Add note" button on each work card and your saved notes as collapsible sections">
                                Display "Add Note" button and your notes in work cards
                            </label>
                        </li>
                        <li>
                            <input type="checkbox" id="toggle_displayMyNotesBtn" v-model="ficTrackerSettings.displayMyNotesButton">
                            <label for="toggle_displayMyNotesBtn" 
                                title="Show or hide the 'My Notes' button in the navigation bar for quick access/search">
                                Display "My Notes" button at the navigation bar
                            </label>
                        </li>
                        <li>
                            <input type="checkbox" id="toggle_expandUserNoteDetails" v-model="ficTrackerSettings.expandUserNoteDetails">
                            <label for="toggle_expandUserNoteDetails" title="If enabled, your saved notes will appear expanded in work cards by default. You can still collapse them manually.">
                                Auto-expand your notes in work cards
                            </label>
                        </li>
                        
                        <!-- Bookmark Behavior -->
                        <li>
                            <input type="checkbox" id="toggle_private" v-model="ficTrackerSettings.newBookmarksPrivate">
                            <label for="toggle_private" title="All new bookmarks will be marked as private by default">New bookmarks private by default</label>
                        </li>
                        <li>
                            <input type="checkbox" id="toggle_rec" v-model="ficTrackerSettings.newBookmarksRec">
                            <label for="toggle_rec" title="All new bookmarks will be marked as recommendations by default">New bookmarks marked as rec by default</label>
                        </li>
                        <li>
                            <input type="checkbox" id="toggle_deleteEmptyBookmarks" v-model="ficTrackerSettings.deleteEmptyBookmarks">
                            <label for="toggle_deleteEmptyBookmarks" title="Automatically deletes bookmarks that have no notes, tags, or collections when removing status. Only completely empty bookmarks will be removed.">
                            Auto-delete empty bookmarks
                            </label>
                        </li>
                        <li>
                            <input type="checkbox" id="toggle_collapseAndHideOnBookmarks" v-model="ficTrackerSettings.collapseAndHideOnBookmarks">
                            <label for="toggle_collapseAndHideOnBookmarks" title="If enabled, works on your bookmarks page will collapse or be hidden based on your tag settings, just like on works browsing pages. If disabled, all bookmarked works will remain uncollapsed and visible.">
                                Collapse and hide works on my bookmarks page
                            </label>
                        </li>                        
                        <!-- Interface Customization -->
                        <li>
                            <input type="checkbox" id="hide_default_toread" v-model="ficTrackerSettings.hideDefaultToreadBtn">
                            <label for="hide_default_toread" title="Hides AO3's default 'Mark For Later' button to reduce clutter">Hide default Mark For Later button</label>
                        </li>
                        <li>
                            <input type="checkbox" id="toggle_displayBottomActionButtons" v-model="ficTrackerSettings.displayBottomActionButtons">
                            <label for="toggle_displayBottomActionButtons" title="Adds duplicate tracking buttons at the bottom of long work lists for easier access">Duplicate action buttons at page bottom</label>
                        </li>
                        
                        <!-- Advanced Options -->
                        <li>
                            <input type="checkbox" id="toggle_debug" v-model="ficTrackerSettings.debug">
                            <label for="toggle_debug" title="Enables console logging and debug information for troubleshooting">Debug mode (for troubleshooting)</label>
                        </li>
                        
                        <!-- Reset Option -->
                        <li style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ccc;">
                            <input type="submit" id="reset_settings" value="Reset Settings to Default"
                            title="Reset all FicTracker settings to their original default values"
                            @click="resetSettings">
                        </li>
                    </ul>
                </section>
                <br>
                <section>
                <!-- Automatic Google Sheet Sync -->
                    <h4 class="heading">
                        Google Sheet Storage
                        <a href="https://greasyfork.org/en/scripts/513435-ao3-fictracker" target="_blank" style="font-size: 0.8em; margin-left: 10px;">[Setup Guide]</a>
                        <a href="#" @click.prevent="displayModal('What is Google Sheets Storage Sync', modalGoogleSyncInfo)" style="font-size: 0.8em; margin-left: 5px;">[What's this?]</a>
                    </h4>
                    <ul>
                        <li>
                            <label>
                                <input type="checkbox" v-model="ficTrackerSettings.syncEnabled"> 
                                Enable automatic sync
                            </label>
                        </li>
                        <div v-show="ficTrackerSettings.syncEnabled">
                            <li>
                                <label title="Show a floating sync status indicator with countdown timer and manual sync button">
                                    <input type="checkbox" v-model="ficTrackerSettings.syncWidgetEnabled"> 
                                    Show sync status widget
                                </label>
                            </li>
                            <li v-if="ficTrackerSettings.syncWidgetEnabled">
                                <label for="sync_widget_opacity">Sync widget opacity:</label>
                                <input type="range" id="sync_widget_opacity" 
                                    v-model="ficTrackerSettings.syncWidgetOpacity" 
                                    min="0.1" max="1" step="0.1"
                                    style="width: 200px; margin-right: 10px;">
                                <strong>{{ ficTrackerSettings.syncWidgetOpacity }}</strong>
                            </li>
                            <li>
                                <label for="sheet_url">Google Script URL:</label>
                                <input type="text" id="sheet_url" v-model="ficTrackerSettings.sheetUrl" :disabled="ficTrackerSettings.syncDBInitialized" placeholder="https://script.google.com/macros/s/AKfyc.../exec">
                            </li>
                            <li>
                                <label for="sync_interval">Sync interval:</label>
                                <input type="range" id="sync_interval" 
                                    v-model="ficTrackerSettings.syncInterval" 
                                    min="60" max="3600" step="60"
                                    style="width: 200px; margin-right: 10px;">
                                <strong>{{ ficTrackerSettings.syncInterval }} seconds</strong>
                            </li>
                            <li v-if="lastSyncTime && ficTrackerSettings.syncDBInitialized">
                                <strong><label>Last sync:</label>
                                <span>{{ lastSyncTimeFormatted }}</span>
                                <br>
                                <span>
                                    Next sync in {{ timeUntilSync }}s</strong>
                                </span>
                            </li>

                            <!-- Status display with loading states -->
                            <li>
                                <div v-if="loadingStates.testConnection" style="color: #0066cc;">
                                    🔄 Testing connection...
                                </div>
                                <div v-else-if="loadingStates.sync" style="color: #0066cc;">
                                    🔄 Syncing data...
                                </div>
                                <div v-else-if="loadingStates.initialize" style="color: #0066cc;">
                                    🔄 Initializing Google Sheet...
                                </div>
                                <div v-else-if="Object.keys(sheetConnectionStatus).length > 0" :style="{color: sheetConnectionStatus.success ? 'green' : 'red'}">
                                    {{ sheetConnectionStatus.success ? '✅' : '❌' }} {{ sheetConnectionStatus.message }}
                                </div>
                                <div v-else-if="Object.keys(syncFeedback).length > 0" :style="{color: syncFeedback.success ? 'green' : 'red'}">
                                    {{ syncFeedback.success ? '✅' : '❌' }} {{ syncFeedback.message }}
                                </div>
                            </li>

                            <li>
                                <input type="submit" 
                                    @click="testSheetConnection" 
                                    :value="loadingStates.testConnection ? 'Testing...' : 'Test Connection'"
                                    :disabled="loadingStates.testConnection || loadingStates.sync || loadingStates.initialize">
                                
                                <input v-if="ficTrackerSettings.syncDBInitialized" 
                                    type="submit" 
                                    @click="syncNow" 
                                    :value="loadingStates.sync ? 'Syncing...' : 'Sync Now'"
                                    :disabled="loadingStates.testConnection || loadingStates.sync || loadingStates.initialize">
                                
                                <input type="submit" 
                                    v-if="ficTrackerSettings.syncDBInitialized" 
                                    @click="resetSyncSettings" 
                                    value="Reset Sync Settings"
                                    :disabled="loadingStates.testConnection || loadingStates.sync || loadingStates.initialize">

                                <li v-if="readyToInitDB && !ficTrackerSettings.syncDBInitialized">
                                    <input type="submit" 
                                        @click="initializeSheetStorage" 
                                        :value="loadingStates.initialize ? 'Initializing...' : 'Initialize Google Sheet Storage'"
                                        :disabled="loadingStates.testConnection || loadingStates.sync || loadingStates.initialize">
                                </li>
                            </li>
                        </div>
                    </ul>
                </section>
                <br>
                <section>
                    <!-- Manual Import/Export -->
                    <h4 class="heading">Manual Data Import/Export</h4>
                    <ul>
                        <li>
                            Last data export: {{ ficTrackerSettings.lastExportTimestamp }}
                        </li>
                        <li>
                            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                                <input type="checkbox" id="export_status_config" v-model="ficTrackerSettings.exportStatusesConfig" style="margin-right: 8px;">
                                <label for="export_status_config" title="When enabled, exports your customized status settings (colors, labels, tags) along with your data. Useful when setting up FicTracker on another device or sharing your configuration with others. Disable if you only want to export your lists without configuration.">
                                    Export status configuration
                                </label>
                            </div>
                        </li>
                        <li>
                            <div style="display: flex;column-gap: 20px;">
                            <!-- Hidden file input -->
                            <input type="file" id="import_file" accept=".json" style="display: none;" @change="importData">
                            <input type="submit" id="import_data" value="Import data from file..."
                                title="Load your bookmarks data from a local file"
                                @click="document.getElementById('import_file').click(); return false;">
                            <input type="submit" id="export_data" value="Export data to file..."
                                title="Export your bookmarks data to a local file" @click='exportData'>
                            </div>
                        </li>
                    </ul>
                </section>
                <section>
                    <!-- Save Settings -->
                    <div style="text-align: right;">
                        <input type="submit" id="save_settings" value="Save Settings" @click="saveSettings();alert('Settings successfully saved :)')">
                    </div>
                </section>
                </div>
            `
            // Fetching the HTML for settings panel, outsourced for less clutter
            container.innerHTML = settingsPanelHtml;

            document.querySelector('#main').appendChild(container);

            // Initialize the Vue app instance
            PetiteVue.createApp({
                selectedStatus: 0,
                ficTrackerSettings: this.settings,
                lastSyncTime: null,
                timeUntilSync: null,
                sheetConnectionStatus: {},
                syncFeedback: {},
                initStatus: null,
                readyToInitDB: false,
                modalGoogleSyncInfo: "<h2>What is Google Sheets Storage Sync?</h2><p>This feature allows you to sync all your FicTracker data across multiple devices by using Google Sheets as the <b>source of truth</b> data storage. When you first initialize the database on a device, the storage fills with your current data.</p><p><b>Recommendation:</b> If you only use FicTracker on one device, basic syncing via AO3 storage is sufficient. However, if you use multiple devices and want near real-time syncing (~60 seconds), connecting to Google Sheets is worth it. The setup takes only 2-3 minutes.</p><h3>How to connect two devices:</h3><ol><li><b>Master device:</b> Initialize the database by clicking <i>Initialize DB</i> to create your Google Sheets storage.</li><li><b>Second device:</b> Use the same Google Sheets link and click <i>Initialize DB</i>. It will detect the storage is already initialized and sync your data.</li></ol><p>After setup, syncing happens automatically and quickly, keeping your data up-to-date on all devices.</p><h3>What is synced automatically? (Without Google Sheets connection)</h3><ul><li>Bookmarked fics with appropriate tags</li><li>Bookmark notes - these are stored directly on AO3 servers</li></ul><p>Due to technical limitations, <b>fic highlighting</b> and <b>custom user notes</b> cannot be saved on AO3 and require external storage. Google Sheets provides a free, simple, and reliable way to store and sync this data across devices.</p><h3>What requires Google Sheets DB connection?</h3><ul><li>Highlighting sync</li><li>User notes sync</li></ul>",

                // Loading states for different sync feature ops
                loadingStates: {
                    testConnection: false,
                    sync: false,
                    initialize: false
                },

                // Computed 
                get currentSettings() {
                    return this.ficTrackerSettings.statuses[this.selectedStatus];
                },

                get canDeleteSelected() {
                    // Prevent deleting built-ins 
                    const builtInKeys = ['FT_finished', 'FT_favorites', 'FT_toread', 'FT_disliked'];
                    return !builtInKeys.includes(this.ficTrackerSettings.statuses[this.selectedStatus].storageKey);
                },

                get previewStyle() {
                    const s = this.currentSettings;
                    const borderSize = s.borderSize ?? 0;
                    const hasBorder = borderSize > 0;
                    const bOpacity = Math.round((s?.borderOpacity ?? 255)).toString(16)

                    return {
                        height: '50px',
                        border: hasBorder ? `${s.borderSize}px solid ${s.highlightColor + bOpacity}` : 'none',
                        boxShadow: hasBorder ?
                            `0 0 10px ${s.highlightColor + bOpacity}, 0 0 20px ${s.highlightColor + bOpacity}` :
                            'none',
                        opacity: s.opacity
                    };
                },

                get lastSyncTimeFormatted() {
                    if (!this.lastSyncTime) return 'Never';

                    const ts = parseInt(this.lastSyncTime);
                    const date = isNaN(ts) ? null : new Date(ts);

                    return date ? date.toLocaleString() : 'Never';
                },

                // Core Methods
                exportData: this.exportSettings.bind(this),
                importData: this.importSettings.bind(this),
                initRemoteSyncManager: this.initRemoteSyncManager.bind(this),

                // Conditionally add sync method only if remote sync manager is initialized
                performSync: async () => {
                    if (this.remoteSyncManager) {
                        return await this.remoteSyncManager.performSync();
                    } else {
                        console.warn('Sync is not available - sync manager not initialized');
                        throw new Error('Sync is not available');
                    }
                },

                // Pass func through global scope
                displayModal: displayModal,

                // Status CRUD
                moveStatus(index, direction) {
                    const statuses = this.ficTrackerSettings.statuses;
                    const selectedObject = statuses[this.selectedStatus];
                    const newIndex = index + direction;

                    if (newIndex < 0 || newIndex >= statuses.length) return;

                    const [movedStatus] = statuses.splice(index, 1);
                    statuses.splice(newIndex, 0, movedStatus);

                    // Wait until Vue updates the DOM and reactivity system after the reorder,
                    // then recalculate the selected index to keep the correct status selected.
                    this.$nextTick(() => {
                        this.selectedStatus = statuses.indexOf(selectedObject);
                    });
                },
                
                addStatus() {
                    const baseKey = 'FT_custom_' + Date.now();
                    const newStatus = {
                        tag: 'New Tag',
                        dropdownLabel: 'My New Tag Fanfics',
                        positiveLabel: '➕ Add Tag',
                        negativeLabel: '🧹 Remove Tag',
                        selector: baseKey + '_btn',
                        storageKey: baseKey,
                        enabled: true,
                        collapse: false,
                        displayInDropdown: true,
                        highlightColor: '#888888',
                        borderSize: 2,
                        opacity: 1,
                        borderOpacity: 255,
                        hide: false
                    };
                    this.ficTrackerSettings.statuses.push(newStatus);
                    this.selectedStatus = this.ficTrackerSettings.statuses.length - 1;
                },

                deleteStatus() {
                    if (!this.canDeleteSelected) return;
                    const status = this.ficTrackerSettings.statuses[this.selectedStatus];
                    const confirmMsg = `Delete tag "${status.tag}" and its highlighting settings?\nThis will not remove any AO3 bookmarks or tags.`;
                    if (!confirm(confirmMsg)) return;

                    // Remove local storage lists for this custom tag if we used any
                    // We only stored lists under storageKey. Clean it.
                    try { localStorage.removeItem(status.storageKey); } catch (e) {}

                    // Remove from list and clamp selected index
                    this.ficTrackerSettings.statuses.splice(this.selectedStatus, 1);
                    this.selectedStatus = Math.max(0, Math.min(this.selectedStatus, this.ficTrackerSettings.statuses.length - 1));

                    this.saveSettings();
                },

                saveSettings() {
                    localStorage.setItem('FT_settings', JSON.stringify(this.ficTrackerSettings));
                    DEBUG && console.log('[FicTracker] Settings saved.');
                },

                resetSettings() {
                    const confirmed = confirm("Are you sure you want to reset all settings to default? This will delete all saved settings.");
                    if (confirmed) {
                        localStorage.removeItem('FT_settings');
                        alert("Settings have been reset to default.");
                    }
                },

                // Reset all seting related to cloud data sync
                resetSyncSettings() {
                    const confirmed = window.confirm(
                        "This will disable the current database connection.\n\n" +
                        "You can still connect again later using a different link.\n\n" +
                        "Do you want to proceed?"
                    );

                    if (!confirmed) return;

                    this.ficTrackerSettings.sheetUrl = '';
                    this.ficTrackerSettings.syncDBInitialized = false;
                    this.ficTrackerSettings.syncEnabled = false;
                    localStorage.removeItem('FT_lastSync');
                    this.saveSettings();

                    // Clear any existing status messages
                    this.sheetConnectionStatus = {};
                    this.syncFeedback = {};
                },

                // New: Google Sheet Sync logic
                async syncNow() {
                    DEBUG && console.log('[FicTracker] Manual sync initiated...');

                    // Indicate that a sync operation is in progress (for UI/loading indicators)
                    this.loadingStates.sync = true;
                    // Clear previous sync feedback and connection status indicators
                    this.syncFeedback = {};
                    this.sheetConnectionStatus = {};

                    try {
                        // Attempt to perform the sync and update the last successful sync timestamp
                        await this.performSync();
                        this.updateLastSyncTime();

                        // Set success feedback message to inform the user
                        this.syncFeedback = {
                            success: true,
                            message: 'Sync completed successfully!'
                        };

                        // Auto-clear success message after 5 seconds
                        setTimeout(() => {
                            if (this.syncFeedback && this.syncFeedback.success) {
                                this.syncFeedback = {};
                            }
                        }, 5000);

                        // Handle and log sync errors, provide user-facing error message
                    } catch (error) {
                        DEBUG && console.error('[FicTracker] Sync failed:', error);
                        this.syncFeedback = {
                            success: false,
                            message: `Sync failed: ${error.message}`
                        };

                        // Ensure loading state is reset whether sync succeeds or fails
                    } finally {
                        this.loadingStates.sync = false;
                    }
                },

                updateLastSyncTime() {
                    // Retrieve the last sync timestamp from local storage and update internal state
                    const ts = localStorage.getItem('FT_lastSync');
                    this.lastSyncTime = ts;
                },

                // Tests connectivity to the provided Google Sheets URL by sending a ping request.
                // Updates the UI with the result and saves settings if successful.
                testSheetConnection() {
                    const url = this.ficTrackerSettings.sheetUrl;
                    DEBUG && console.log('[FicTracker] Testing connection to Google Sheets URL:', url);

                    // Validate if the Google Sheets URL is provided
                    if (!url) {
                        // Indicate that a test connection is in progress and reset status messages
                        this.sheetConnectionStatus = {
                            success: false,
                            message: 'URL is empty'
                        };
                        return;
                    }

                    this.loadingStates.testConnection = true;
                    this.sheetConnectionStatus = {};
                    this.syncFeedback = {};

                    // Send a ping request to the Google Sheets endpoint to verify connection
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `${url}?action=ping`,
                        onload: (response) => {
                            this.loadingStates.testConnection = false;

                            try {
                                // Parse the response and update connection status based on server reply
                                const data = JSON.parse(response.responseText);
                                if (data.status === 'success') {
                                    DEBUG && console.log('[FicTracker] Sheet connection successful:', data);

                                    // If connection is successful, save settings and display a confirmation message
                                    this.sheetConnectionStatus = {
                                        success: true,
                                        message: data.data || 'Connection successful!'
                                    };

                                    this.readyToInitDB = true;
                                    this.saveSettings();

                                    // Auto-clear success message after 5 seconds
                                    setTimeout(() => {
                                        if (this.sheetConnectionStatus && this.sheetConnectionStatus.success) {
                                            this.sheetConnectionStatus = {};
                                        }
                                    }, 5000);

                                } else {
                                    DEBUG && console.warn('[FicTracker] Sheet connection failed:', data);

                                    // Handle and display error message if the server returned a failure status
                                    this.sheetConnectionStatus = {
                                        success: false,
                                        message: data.message || 'Unknown error'
                                    };
                                }

                                // Catch JSON parsing errors and report invalid server response
                            } catch (e) {
                                DEBUG && console.error('[FicTracker] Failed to parse server response during test connection:', response.responseText);

                                this.sheetConnectionStatus = {
                                    success: false,
                                    message: 'Invalid response from server'
                                };
                            }
                        },
                        // Handle connection-level errors like CORS or unreachable URL
                        onerror: (err) => {
                            DEBUG && console.error('[FicTracker] Network error during sheet connection test:', err);

                            this.loadingStates.testConnection = false;
                            this.sheetConnectionStatus = {
                                success: false,
                                message: 'Network error - check your connection'
                            };
                        }
                    });
                },

                // Initializes Google Sheets storage by uploading current local FicTracker data.
                // Marks DB as initialized and updates sync timestamp on success.
                initializeSheetStorage() {
                    const url = this.ficTrackerSettings.sheetUrl;
                    // Validate that the Google Sheets URL is set
                    if (!url) {
                        this.sheetConnectionStatus = {
                            success: false,
                            message: 'URL is empty'
                        };
                        return;
                    }

                    // Set loading state and clear any previous status or feedback
                    this.loadingStates.initialize = true;
                    this.sheetConnectionStatus = {};
                    this.syncFeedback = {};

                    // Gather current local storage data to be uploaded to Google Sheets
                    const initData = {
                        FT_userNotes: JSON.stringify(JSON.parse(localStorage.getItem('FT_userNotes') || '{}')),
                    };
                    try {
                        const allStatuses = this.ficTrackerSettings.statuses;
                        for (const s of allStatuses) {
                            initData[s.storageKey] = localStorage.getItem(s.storageKey) || '';
                        }
                    } catch (e) {
                        DEBUG && console.warn('[FicTracker] Failed to build initData for dynamic statuses:', e);
                    }

                    DEBUG && console.log('[FicTracker] Initializing Google Sheets with data:', initData);

                    // Send initialization request to Google Sheets endpoint
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: url,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify({
                            action: 'initialize',
                            initData
                        }),
                        onload: (response) => {
                            this.loadingStates.initialize = false;

                            try {
                                // Parse and handle successful initialization response
                                const data = JSON.parse(response.responseText);
                                DEBUG && console.log('[FicTracker] DB Initialization response data:', data);

                                if (data.status === 'success') {
                                    // Store sync initialization status, timestamp, and update UI
                                    this.sheetConnectionStatus = {
                                        success: true,
                                        message: data.data?.message || 'Google Sheet initialized successfully!'
                                    };
                                    this.ficTrackerSettings.syncDBInitialized = true;

                                    if (this.ficTrackerSettings.syncEnabled && !this.remoteSyncManager) {
                                        this.initRemoteSyncManager();
                                    }

                                    localStorage.setItem('FT_lastSync', Date.now().toString());
                                    this.saveSettings();
                                    this.updateLastSyncTime();

                                    // Auto-clear success message after 7 seconds
                                    setTimeout(() => {
                                        if (this.sheetConnectionStatus && this.sheetConnectionStatus.success) {
                                            this.sheetConnectionStatus = {};
                                        }
                                    }, 7000);

                                } else {
                                    // Handle error response from server
                                    this.sheetConnectionStatus = {
                                        success: false,
                                        message: data.message || 'Initialization failed'
                                    };
                                }
                                // Catch JSON parsing errors and log them
                            } catch (e) {
                                DEBUG && console.error('[FicTracker] Invalid JSON response during initialization:', response.responseText);

                                this.sheetConnectionStatus = {
                                    success: false,
                                    message: 'Invalid response from server'
                                };
                            }
                        },
                        // Handle connection errors like timeouts or offline state
                        onerror: (err) => {
                            DEBUG && console.error('[FicTracker] Network error during initialization:', err);

                            this.loadingStates.initialize = false;
                            this.sheetConnectionStatus = {
                                success: false,
                                message: 'Network error - check your connection'
                            };
                        }
                    });
                },

                // Lifecycle hook that sets up real-time countdown for next sync based on last sync timestamp.
                onMounted() {
                    // Function to calculate and update time remaining until next sync
                    const trackSyncTime = () => {
                        this.updateLastSyncTime();

                        const elapsed = Date.now() - parseInt(this.lastSyncTime);
                        const remaining = this.ficTrackerSettings.syncInterval - elapsed / 1000;
                        this.timeUntilSync = Math.max(0, Math.round(remaining));
                    }

                    // Initial update on component mount
                    trackSyncTime();
                    // Update the countdown every second
                    setInterval(() => {
                        trackSyncTime();
                    }, 1000);
                }

            }).mount();

        }

        // Exports user data (all statuses, notes, and statuses config) into a JSON file
        exportSettings() {
            // Formatted timestamp for export
            const exportTimestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
            const exportData = {
                FT_userNotes: localStorage.getItem('FT_userNotes'),
            };
            try {
                const allStatuses = this.settings.statuses;
                for (const s of allStatuses) {
                    exportData[s.storageKey] = localStorage.getItem(s.storageKey);
                }
            } catch (e) {
                DEBUG && console.warn('[FicTracker] Failed to collect dynamic status keys for export:', e);
            }

            // Only include status configuration if the setting is enabled
            if (this.settings.exportStatusesConfig) {
                exportData.FT_statusesConfig = JSON.stringify(this.settings.statuses);
            }

            // Create a Blob object from the export data, converting it to JSON format
            const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
            });

            // Generate a URL for the Blob object to enable downloading
            const url = URL.createObjectURL(blob);

            // Create a temp link to download the generated file data
            const a = document.createElement('a');
            a.href = url;
            a.download = `fictracker_export_${exportTimestamp}.json`;
            document.body.appendChild(a);

            // Trigger a click on the link to initiate the download
            a.click();

            // Cleanup after the download
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            // Update the last export timestamp
            this.settings.lastExportTimestamp = exportTimestamp;
            localStorage.setItem('FT_settings', JSON.stringify(this.settings));
            DEBUG && console.log('[FicTracker] Data exported at:', exportTimestamp);
        }

        // Imports user data (favorites, finished, toread) from a JSON file
        // Existing storage data is not removed, only new items from file are appended
        importSettings(event) {
            const file = event.target.files[0];
            if (!file) return;

            // Warn user when Google Sheets sync is enabled to prevent imported data being overwritten
            if (this.settings && this.settings.syncEnabled) {
                const proceed = confirm("Google Sheets sync is currently ENABLED.\n\nIf you import now, the next sync may overwrite your imported data with what is currently stored in the Sheet.\n\nRecommended options:\n  1) Disable Google Sheets sync, import your file. Re-enabling with the same Sheet will overwrite your import.\n  2) OR: Temporarily Disable sync, import, then re-enable sync using a NEW Google Sheet URL to avoid pulling stale data.\n\nDo you still want to proceed with the import right now?");

                if (!proceed) {
                    event.target.value = '';
                    return;
                }
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    this.mergeImportedData(importedData);
                    // Reset the file input to allow reimporting the same file
                    event.target.value = '';
                } catch (err) {
                    DEBUG && console.error('[FicTracker] Error importing data:', err);
                    alert('Error importing data. Please check if the file is valid.');
                }
            };
            reader.onerror = () => {
                DEBUG && console.error('[FicTracker] Error reading file:', reader.error);
                alert('Error reading file. Please try again.');
                event.target.value = '';
            };
            reader.readAsText(file);
        }

        mergeImportedData(importedData) {
            // First, if statuses config provided, load it so we know all dynamic keys
            if (importedData.FT_statusesConfig) {
                try {
                    const importedStatuses = JSON.parse(importedData.FT_statusesConfig);
                    this.settings.statuses = importedStatuses;
                    localStorage.setItem('FT_settings', JSON.stringify(this.settings));
                } catch (err) {
                    DEBUG && console.error('[FicTracker] Error importing status configuration:', err);
                }
            }

            // Track new entries per known keys + notes at the end
            let newEntriesMap = {};

            // Merge all status list keys found in the file that are in our configured statuses
            const knownKeys = new Set((this.settings.statuses || []).map(s => s.storageKey));
            Object.keys(importedData).forEach((key) => {
                if (!knownKeys.has(key)) return;
                const currentData = localStorage.getItem(key) ? localStorage.getItem(key).split(',') : [];
                const newData = (importedData[key] || '').split(',').filter(Boolean);
                const initialLen = currentData.length;
                const mergedData = [...new Set([...currentData, ...newData])];
                newEntriesMap[key] = mergedData.length - initialLen;
                localStorage.setItem(key, mergedData.join(','));
            });

            // Handle user notes (JSON data)
            if (importedData.FT_userNotes) {
                try {
                    const currentNotes = JSON.parse(localStorage.getItem('FT_userNotes') || '{}');
                    const importedNotes = JSON.parse(importedData.FT_userNotes);
                    
                    // Merge notes, keeping newer versions if there are conflicts
                    const mergedNotes = { ...currentNotes, ...importedNotes };
                    localStorage.setItem('FT_userNotes', JSON.stringify(mergedNotes));
                    
                    const newNotesCount = Object.keys(importedNotes).length - Object.keys(currentNotes).length;
                    newEntriesMap['FT_userNotes'] = Math.max(0, newNotesCount);
                } catch (err) {
                    DEBUG && console.error('[FicTracker] Error merging user notes:', err);
                    newEntriesMap['FT_userNotes'] = 0;
                }
            }

            // Build a dynamic summary
            let summaryLines = [];
            (this.settings.statuses || []).forEach((s) => {
                const count = newEntriesMap[s.storageKey] || 0;
                summaryLines.push(`${s.tag}: ${count}`);
            });
            const notesAdded = newEntriesMap['FT_userNotes'] || 0;
            summaryLines.push(`Notes: ${notesAdded}`);

            alert(`Data imported successfully!\n` + summaryLines.join('\n'));
            DEBUG && console.log('[FicTracker] Data imported successfully. Stats:', newEntriesMap);
        }

    }

    // Class for managing URL patterns and executing corresponding handlers based on the current path
    class URLHandler {
        constructor() {
            this.handlers = [];
        }

        // Add a new handler with associated patterns to the handlers array
        addHandler(patterns, handler) {
            this.handlers.push({
                patterns,
                handler
            });
        }

        // Iterate through registered handlers to find a match for the current path
        matchAndHandle(currentPath) {
            for (const {
                    patterns,
                    handler
                }
                of this.handlers) {
                if (patterns.some(pattern => pattern.test(currentPath))) {
                    // Execute the corresponding handler if a match is found
                    handler();

                    DEBUG && console.log('[FicTracker] Matched pattern for path:', currentPath);
                    return true;
                }
            }
            DEBUG && console.log('[FicTracker] Unrecognized page', currentPath);
            return false;
        }
    }

    // Main controller that integrates all components of the AO3 FicTracker
    class FicTracker {
        constructor() {

            // Merge stored settings to match updated structure, assign default  settings on fresh installation
            this.mergeSettings();

            // Load settings and initialize other features
            this.settings = this.loadSettings();

            // Filter out disabled statuses
            // this.settings.statuses = this.settings.statuses.filter(status => status.enabled !== false);

            this.initStyles();
            this.addDropdownOptions();
            this.setupURLHandlers();

            // Only initialize storages on global scope if My Notes manager enabled
            if(settings.displayMyNotesButton) {
                this.storageManager = new StorageManager();
                if (settings.syncEnabled) {
                    this.remoteSyncManager = new RemoteStorageSyncManager();
                }
                this.userNotesManager = new CustomUserNotesManager(this.storageManager, this.remoteSyncManager);
                this.setupMyNotesButton();
            }
        }

        // Method to merge settings / store the default ones
        mergeSettings() {
            // Check if settings already exist in localStorage
            let storedSettings = JSON.parse(localStorage.getItem('FT_settings'));

            if (!storedSettings) {
                // No settings found, save default settings
                localStorage.setItem('FT_settings', JSON.stringify(settings));
                console.log('[FicTracker] Default settings have been stored.');
            } else {
                // Check if the version matches the current version from Tampermonkey metadata
                const currentVersion = GM_info.script.version;
                if (!storedSettings.version || storedSettings.version !== currentVersion) {
                    // If versions don't match, merge and update the version
                    storedSettings = _.defaultsDeep(storedSettings, settings);

                    // Update the version marker
                    storedSettings.version = currentVersion;

                    // Save the updated settings back to localStorage
                    localStorage.setItem('FT_settings', JSON.stringify(storedSettings));
                    console.log('[FicTracker] Settings have been merged and updated to the latest version.');
                } else {
                    console.log('[FicTracker] Settings are up to date, no merge needed.');
                }
            }
        }

        // Load settings from the storage or fallback to default ones
        loadSettings() {
            // Measure performance of loading settings from localStorage
            const startTime = performance.now();
            let savedSettings = localStorage.getItem('FT_settings');

            if (savedSettings) {
                try {
                    settings = JSON.parse(savedSettings);
                    DEBUG = settings.debug;
                    DEBUG && console.log(`[FicTracker] Settings loaded successfully:`, savedSettings);
                } catch (error) {
                    DEBUG && console.error(`[FicTracker] Error parsing settings: ${error}`);
                }
            } else {
                DEBUG && console.warn(`[FicTracker] No saved settings found, using default settings.`);
            }

            const endTime = performance.now();
            DEBUG && console.log(`[FicTracker] Settings loaded in ${endTime - startTime} ms`);
            return settings;
        }

        // Initialize custom styles based on loaded settings
        initStyles() {
            // Dynamic styles generation for each status, this will allow adding custom statuses in the future updates
            const statusStyles = StyleManager.generateStatusStyles();

            StyleManager.addCustomStyles(`
                ${statusStyles}

                li.FT_collapsable .landmark,
                li.FT_collapsable .tags,
                li.FT_collapsable .series,
                li.FT_collapsable h5.fandoms.heading,
                li.FT_collapsable .userstuff {
                    display: none;
                }

                /* Uncollapse on hover */
                li.FT_collapsable:hover .landmark,
                li.FT_collapsable:hover .tags,
                li.FT_collapsable:hover ul.series,
                li.FT_collapsable:hover h5.fandoms.heading,
                li.FT_collapsable:hover .userstuff {
                    display: block;
                }

        `);
        }

        // Add new dropdown options for each status to the user menu
        addDropdownOptions() {
            const userMenu = document.querySelector('ul.menu.dropdown-menu');
            const username = userMenu?.previousElementSibling?.getAttribute('href')?.split('/').pop() ?? '';

            if (username) {
                // Loop through each status and add corresponding dropdown options
                this.settings.statuses.forEach((status) => {
                    if (status.displayInDropdown) {
                        userMenu.insertAdjacentHTML(
                            'beforeend',
                            `<li><a href="https://archiveofourown.org/bookmarks?bookmark_search%5Bother_bookmark_tag_names%5D=${status.tag}&user_id=${username}">${status.dropdownLabel}</a></li>`
                        );
                    }
                });
            } else {
                DEBUG && console.warn('[FicTracker] Cannot parse the username!');
            }

            DEBUG && console.log('[FicTracker] Successfully added dropdown options!');
        }


        setupMyNotesButton() {
            const topBar = document.querySelector('ul.primary.navigation.actions');
            if (!topBar) return;
        
            const notesUI = `
                <li class="dropdown" aria-haspopup="true">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" id="ft_my_notes">My Notes</a>
                </li>
            `;
            topBar.insertAdjacentHTML('beforeend', notesUI);

            const container = document.querySelector('div.content.userstuff');
            this.userNotesManager.setupNoteHandlers(container, false, true);

            document.querySelector('#ft_my_notes').addEventListener('click', () => {
                const sortedNotes = this.userNotesManager.getNotesSorted();
                const htmlNotesList = this.userNotesManager.getNotesHTML(sortedNotes);
                const notesModalHTML = this.userNotesManager.getMyNotesModalHTML(htmlNotesList);

                displayModal(`Total Notes: ${htmlNotesList.length}`, notesModalHTML);

                document.querySelector('#ft_notes_search').addEventListener('input', (e) => {
                    this.filterAndRenderNotesModal(e.target.value);
                });
            });
        }


        // Naive filtering, mb implement fuzzy later
        filterAndRenderNotesModal(searchQuery) {
            const filteredNotes = this.userNotesManager.filterNotes(searchQuery);
            const htmlNotesList = this.userNotesManager.getNotesHTML(filteredNotes);
            const container = document.querySelector('#ft_notesList');
            container.innerHTML = htmlNotesList.join('');
            //this.userNotesManager.setupNoteHandlers(container, false, true);
        }


        // Setup URL handlers for different pages
        setupURLHandlers() {
            const urlHandler = new URLHandler();

            // Handler for fanfic pages (chapters, entire work, one shot)
            urlHandler.addHandler(
                [/\/works\/.*(?:chapters|view_full_work)/, /works\/\d+(#\w+-?\w*)?$/, /\/chapters\/\d+\?show_comments/],
                () => {
                    const bookmarkManager = new BookmarkManager("https://archiveofourown.org/");
                }
            );

            // Handler for fanfics search/tag list pages & other pages that include a list of fics
            urlHandler.addHandler([
                    /\/works\/search/,
                    /\/works\?.*/,
                    /\/bookmarks$/,
                    /\/bookmarks\/\d+$/,
                    /\/users\/bookmarks/,
                    /\/users\/.*\/works/,
                    /\/users\/[^/]+\/pseuds\/[^/]+/,
                    /\/bookmarks\?page=/,
                    /\/bookmarks\?bookmark_search/,
                    /\/bookmarks\?commit=Sort\+and\+Filter&bookmark_search/,
                    /\/series\/.+/,
                    /\/collections\/.+/,
                    /\/works\?commit=Sort/,
                    /\/works\?work_search/,
                    /\/tags\/.*\/works/
                ],
                () => {
                    const worksListHandler = new WorksListHandler();
                }
            );

            // Handler for user preferences page
            urlHandler.addHandler(
                [/\/users\/.+\/preferences/],
                () => {
                    const settingsPage = new SettingsPageHandler(this.settings);
                }
            );

            // Execute handler based on the current URL
            const currentPath = window.location.href;
            urlHandler.matchAndHandle(currentPath);
        }

    }


    // Instantiate the FicTracker class
    const ficTracker = new FicTracker();

})();
