// ==UserScript==
// @name         RepoNotes
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  RepoNotes is a lightweight browser extension script for Tampermonkey that enhances your GitHub stars with personalized notes. Ever starred a repository but later forgot why? RepoNotes solves this problem by allowing you to attach custom annotations to your starred repositories.
// @author       malagebidi
// @match        https://github.com/*
// @icon         https://github.githubassets.com/favicons/favicon.svg
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531335/RepoNotes.user.js
// @updateURL https://update.greasyfork.org/scripts/531335/RepoNotes.meta.js
// ==/UserScript==
(async function() {
    'use strict';
    // --- Configuration ---
    const NOTE_PLACEHOLDER = 'Enter your note...';
    const ADD_BUTTON_TEXT = 'Add Note';
    const EDIT_BUTTON_TEXT = 'Edit Note';
    const SAVE_BUTTON_TEXT = 'Save';
    const CANCEL_BUTTON_TEXT = 'Cancel';
    const DELETE_BUTTON_TEXT = 'Delete';
    // --- Styles ---
    GM_addStyle(`
        .ghsn-container {
            padding-right: var(--base-size-24, 24px) !important;
            color: var(--fgColor-muted, var(--color-fg-muted)) !important;
            width: 74.99999997%;
        }
        .ghsn-display {
            border: var(--borderWidth-thin) solid var(--borderColor-default, var(--color-border-default, #d2dff0));
            border-radius: 100px;
            padding: 2.5px 5px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: block;
            max-width: fit-content;
        }
        .ghsn-textarea {
            width: 100%;
            min-height: 60px;
            margin-bottom: 5px;
            padding: 5px;
            border: 1px solid var(--color-border-default);
            border-radius: 3px;
            background-color: var(--color-canvas-default);
            color: var(--color-fg-default);
            box-sizing: border-box;
        }
        .ghsn-buttons button {
            margin-right: 5px;
            padding: 3px 8px;
            font-size: 0.9em;
            cursor: pointer;
            border-radius: 4px;
            border: 1px solid var(--color-border-muted);
        }
        .ghsn-buttons button.ghsn-save {
            background-color: var(--color-btn-primary-bg);
            color: var(--color-btn-primary-text);
            border-color: var(--color-btn-primary-border);
        }
        .ghsn-buttons button.ghsn-delete {
            background-color: var(--color-btn-danger-bg);
            color: var(--color-btn-danger-text);
            border-color: var(--color-btn-danger-border);
        }
        .ghsn-buttons button.ghsn-cancel {
            background-color: var(--color-btn-bg);
            color: var(--color-btn-text);
        }
        .ghsn-buttons button:hover {
            filter: brightness(1.1);
        }
        .ghsn-hidden {
            display: none !important;
        }
        .ghsn-note-btn {
            margin-left: 16px;
            color: var(--fgColor-muted);
            cursor: pointer;
            text-decoration: none;
        }
        .ghsn-note-btn:hover {
            color: var(--fgColor-accent) !important;
            -webkit-text-decoration: none;
            text-decoration: none;
        }
        .ghsn-note-btn svg {
            margin-right: 4px;
        }
    `);
    // --- Core Logic ---
    // Get repo unique identifier (owner/repo)
    function getRepoFullName(repoElement) {
        const link = repoElement.querySelector('div[itemprop="name codeRepository"] > a, h3 > a, h2 > a');
        if (link && link.pathname) {
            return link.pathname.substring(1).replace(/\/$/, '');
        }
        const starForm = repoElement.querySelector('form[action^="/stars/"]');
        if (starForm && starForm.action) {
            const match = starForm.action.match(/\/stars\/([^/]+\/[^/]+)\/star/);
            if (match && match[1]) {
                return match[1];
            }
        }
        console.warn('RepoNotes: Could not find repo name for element:', repoElement);
        return null;
    }
    // Create note button with icon
    function createNoteButton(isEdit = false) {
        const button = document.createElement('a');
        button.className = 'ghsn-note-btn';
        button.href = 'javascript:void(0);'; // 使用 void(0) 避免页面跳转
        // SVG icon (pencil)
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('height', '16');
        svg.setAttribute('width', '16');
        svg.setAttribute('viewBox', '0 0 16 16');
        svg.setAttribute('fill', 'currentColor');
        svg.setAttribute('class', 'octicon octicon-star');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        // Pencil icon path data
        path.setAttribute('d', 'M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Zm.176 4.823L9.75 4.81l-6.286 6.287a.253.253 0 0 0-.064.108l-.558 1.953 1.953-.558a.253.253 0 0 0 .108-.064Zm1.238-3.763a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354Z');
        svg.appendChild(path);
        button.appendChild(svg);
        const textNode = document.createTextNode(isEdit ? EDIT_BUTTON_TEXT : ADD_BUTTON_TEXT);
        button.appendChild(textNode);
        button.updateText = function(isEditing) {
            textNode.textContent = isEditing ? EDIT_BUTTON_TEXT : ADD_BUTTON_TEXT;
        };
        return button;
    }
    // Add note UI for a single repository
    async function addNoteUI(repoElement) {
        if (repoElement.querySelector('.ghsn-container')) {
            // console.log('RepoNotes: UI already exists for this repo element. Skipping.');
            return;
        }
        const existingButton = repoElement.querySelector('.ghsn-star-row .ghsn-note-btn');
         if (existingButton) {
            // console.log('RepoNotes: Button already exists in star row. Skipping.');
            return;
         }
        const repoFullName = getRepoFullName(repoElement);
        if (!repoFullName) {
            // console.warn('RepoNotes: Could not get repo full name. Skipping element:', repoElement);
            return;
        }
        const storageKey = `ghsn_${repoFullName}`;
        let currentNote = await GM_getValue(storageKey, '');
        const starLink = repoElement.querySelector('a[href$="/stargazers"]');
        if (!starLink) {
            // console.warn(`RepoNotes: Could not find star link for repo: ${repoFullName}. Skipping.`);
            return;
        }
        let starRow = starLink.parentNode;
        if (!starRow.classList.contains('d-flex') && !starRow.classList.contains('float-right')) {
             const potentialRow = starLink.closest('span, div.d-inline-block, div.color-fg-muted');
             if (potentialRow) {
                 starRow = potentialRow;
             }
        }
        starRow.classList.add('ghsn-star-row');
        const noteButton = createNoteButton(!!currentNote); // !!currentNote 将其转为布尔值
        const container = document.createElement('div');
        container.className = 'ghsn-container';
        if (!currentNote) {
            container.classList.add('ghsn-hidden');
        }
        const displaySpan = document.createElement('span');
        displaySpan.className = 'ghsn-display';
        displaySpan.textContent = currentNote;
        if (!currentNote) {
            displaySpan.classList.add('ghsn-hidden');
        }
        const noteTextarea = document.createElement('textarea');
        noteTextarea.className = 'ghsn-textarea ghsn-hidden';
        noteTextarea.placeholder = NOTE_PLACEHOLDER;
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'ghsn-buttons ghsn-hidden';
        const saveButton = document.createElement('button');
        saveButton.textContent = SAVE_BUTTON_TEXT;
        saveButton.className = 'ghsn-save';
        const cancelButton = document.createElement('button');
        cancelButton.textContent = CANCEL_BUTTON_TEXT;
        cancelButton.className = 'ghsn-cancel';
        const deleteButton = document.createElement('button');
        deleteButton.textContent = DELETE_BUTTON_TEXT;
        deleteButton.className = 'ghsn-delete';
        noteButton.addEventListener('click', (e) => {
            e.preventDefault();
            const isEditing = !noteTextarea.classList.contains('ghsn-hidden');
            if (!isEditing) {
                noteTextarea.value = currentNote;
                displaySpan.classList.add('ghsn-hidden');
                noteTextarea.classList.remove('ghsn-hidden');
                buttonsDiv.classList.remove('ghsn-hidden');
                if (currentNote) {
                    deleteButton.classList.remove('ghsn-hidden');
                } else {
                    deleteButton.classList.add('ghsn-hidden');
                }
                container.classList.remove('ghsn-hidden');
                noteTextarea.focus();
            } else {
                 cancelButton.click();
            }
        });
        cancelButton.addEventListener('click', () => {
            noteTextarea.classList.add('ghsn-hidden');
            buttonsDiv.classList.add('ghsn-hidden');
            if (currentNote) {
                displaySpan.textContent = currentNote;
                displaySpan.classList.remove('ghsn-hidden');
                container.classList.remove('ghsn-hidden');
            } else {
                container.classList.add('ghsn-hidden');
            }
        });
        saveButton.addEventListener('click', async () => {
            const newNote = noteTextarea.value.trim();
            await GM_setValue(storageKey, newNote);
            currentNote = newNote;
            noteButton.updateText(!!newNote);
            if (newNote) {
                displaySpan.textContent = newNote;
                displaySpan.classList.remove('ghsn-hidden');
                container.classList.remove('ghsn-hidden');
            } else {
                displaySpan.classList.add('ghsn-hidden');
                container.classList.add('ghsn-hidden');
                await GM_deleteValue(storageKey);
            }
            noteTextarea.classList.add('ghsn-hidden');
            buttonsDiv.classList.add('ghsn-hidden');
        });
        deleteButton.addEventListener('click', async () => {
            if (window.confirm(`Are you sure you want to delete the note for "${repoFullName}"?`)) {
                await GM_deleteValue(storageKey);
                currentNote = '';
                noteButton.updateText(false);
                displaySpan.classList.add('ghsn-hidden');
                noteTextarea.classList.add('ghsn-hidden');
                buttonsDiv.classList.add('ghsn-hidden');
                container.classList.add('ghsn-hidden');
            }
        });
        buttonsDiv.appendChild(deleteButton);
        buttonsDiv.appendChild(saveButton);
        buttonsDiv.appendChild(cancelButton);
        container.appendChild(displaySpan);
        container.appendChild(noteTextarea);
        container.appendChild(buttonsDiv);
        // 修改这里：将按钮作为starRow的最后一个元素
        starRow.appendChild(noteButton);
        const description = repoElement.querySelector('p.color-fg-muted');
        const topics = repoElement.querySelector('.topic-tag-list');
        const insertAfterElement = topics || description || repoElement.querySelector('h3, h2');
        if (insertAfterElement && insertAfterElement.parentNode) {
            insertAfterElement.parentNode.insertBefore(container, insertAfterElement.nextSibling);
        } else {
            repoElement.appendChild(container);
            console.warn(`RepoNotes: Could not find ideal insertion point for note container in repo: ${repoFullName}. Appending to end.`);
        }
    }
    // --- Process all repositories on the page ---
    function processRepositories() {
        const repoSelector = 'div.col-12.d-block.width-full.py-4.border-bottom.color-border-muted, article.Box-row';
        const repoElements = document.querySelectorAll(repoSelector);
        // console.log(`RepoNotes: Found ${repoElements.length} repository elements.`);
        if (repoElements.length === 0) {
             // console.log("RepoNotes: No repository elements found with selector:", repoSelector);
             const fallbackSelector = 'li[data-view-component="true"].Box-row';
             const fallbackElements = document.querySelectorAll(fallbackSelector);
             fallbackElements.forEach(addNoteUI);
        } else {
            repoElements.forEach(addNoteUI);
        }
    }

    // --- Observe DOM changes (handle dynamic loading like infinite scroll) ---
    let observer = null;

    function setupObserver() {
        if (observer) {
            observer.disconnect();
        }

        const targetNode = document.getElementById('user-repositories-list') || document.querySelector('main') || document.body;

        if (!targetNode) {
            console.error('RepoNotes: Could not find target node for MutationObserver.');
            return;
        }
        // console.log('RepoNotes: Setting up MutationObserver on target:', targetNode);

        observer = new MutationObserver(mutations => {
            // console.log('RepoNotes: MutationObserver detected changes.');
            let needsProcessing = false;
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        const repoSelector = 'div.col-12.d-block.width-full.py-4.border-bottom.color-border-muted, article.Box-row, li[data-view-component="true"].Box-row';
                        if (node.matches(repoSelector)) {
                            // console.log('RepoNotes: Added node matches repo selector:', node);
                            addNoteUI(node);
                            needsProcessing = true;
                        } else {
                            const nestedRepos = node.querySelectorAll(repoSelector);
                            if (nestedRepos.length > 0) {
                                // console.log(`RepoNotes: Found ${nestedRepos.length} nested repos in added node:`, node);
                                nestedRepos.forEach(addNoteUI);
                                needsProcessing = true;
                            }
                        }
                    }
                });
            });
        });

        observer.observe(targetNode, {
            childList: true,
            subtree: true
        });
    }

    // --- Startup and Navigation Handling ---

    function initializeOrReinitialize() {
        if (window.location.search.includes('tab=stars') || document.querySelector('div.col-12.d-block.width-full.py-4') || document.querySelector('article.Box-row')) {
            // console.log('RepoNotes: Running processRepositories.');
            processRepositories();
            // console.log('RepoNotes: Setting up observer.');
            setupObserver();
        } else {
             // console.log('RepoNotes: Not on a relevant page, skipping processing and observer setup.');
             if(observer) {
                observer.disconnect();
                // console.log('RepoNotes: Disconnected observer.');
             }
        }
    }

    document.addEventListener('turbo:load', () => {
        // console.log('RepoNotes: turbo:load event detected.');
        initializeOrReinitialize();
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeOrReinitialize);
    } else {
        initializeOrReinitialize();
    }

})();
