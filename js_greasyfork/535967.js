// ==UserScript==
// @name         GitHub Repo Notes
// @name:zh-CN   GitHub 仓库备注工具
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Add local notes to GitHub repository, support data export and import
// @description:zh-CN  为 GitHub 仓库添加本地备注，支持数据导出和导入
// @author       Ivans
// @match        https://github.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @icon         https://cdn.simpleicons.org/github/808080
// @license      MIT
// @supportURL   https://github.com/Ivans-11/github-repo-notes/issues
// @downloadURL https://update.greasyfork.org/scripts/535967/GitHub%20Repo%20Notes.user.js
// @updateURL https://update.greasyfork.org/scripts/535967/GitHub%20Repo%20Notes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const NOTE_KEY_PREFIX = 'gh_repo_note_';

    // Get the full name of the repository
    function getRepoFullName(card) {
        const link = card.querySelector('h3 a[itemprop="name codeRepository"]') || 
                    card.querySelector('h3 a') || 
                    card.querySelector('.search-title a') ||
                    card.querySelector('a.Link--primary.Link.text-bold[data-hovercard-type="repository"]');
        if (!link) return null;
        const href = link.getAttribute('href');
        if (!href) return null;
        return href.substring(1);
    }

    // Get the note from local storage
    function getNote(repoFullName) {
        // Convert to lowercase
        return GM_getValue(NOTE_KEY_PREFIX + repoFullName.toLowerCase(), '');
    }
    // Set the note to local storage
    function setNote(repoFullName, note) {
        if (note) {
            GM_setValue(NOTE_KEY_PREFIX + repoFullName.toLowerCase(), note);
        } else {
            GM_deleteValue(NOTE_KEY_PREFIX + repoFullName.toLowerCase());
        }
    }

    // Create the note button
    function createNoteButton(repoFullName, note, onClick) {
        const btn = document.createElement('button');
        const icon = document.createElement('span');
        icon.innerHTML = `<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" style="vertical-align: text-bottom; margin-right: 8px; fill: var(--fgColor-muted,var(--color-fg-muted));">
            <path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H8.06l-2.573 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Z"></path>
        </svg>`;
        btn.appendChild(icon);
        btn.appendChild(document.createTextNode(note ? 'Edit' : 'Add'));
        
        btn.style.margin = '4px';
        btn.style.borderRadius = '6px';
        btn.style.padding = '2px 8px';
        btn.style.fontSize = '12px';
        btn.style.cursor = 'pointer';
        btn.style.fontFamily = 'var(--fontStack-sansSerif)';
        btn.style.lineHeight = '20px';
        btn.style.fontWeight = '600';
        btn.style.color = 'var(--button-default-fgColor-rest, var(--color-btn-text))';
        btn.style.backgroundColor = 'var(--button-default-bgColor-rest, var(--color-btn-bg))';
        btn.style.border = '1px solid var(--button-default-borderColor-rest,var(--color-btn-border))';
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.height = 'var(--control-small-size,1.75rem)';
        btn.addEventListener('click', onClick);
        return btn;
    }

    // Create the note display
    function createNoteDisplay(note) {
        const div = document.createElement('div');
        const icon = document.createElement('span');
        icon.innerHTML = `<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" style="vertical-align: text-bottom; margin-right: 8px; fill: var(--fgColor-muted,var(--color-fg-muted));">
            <path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H8.06l-2.573 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Z"></path>
        </svg>`;
        div.appendChild(icon);
        div.appendChild(document.createTextNode(note));
        
        div.style.borderRadius = '6px';
        div.style.padding = '4px 8px';
        div.style.marginTop = '2px';
        div.style.marginBottom = '6px';
        div.style.fontSize = '13px';
        div.style.fontFamily = 'var(--fontStack-sansSerif)';
        div.style.lineHeight = '20px';
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        return div;
    }

    // Prompt the user to input the note
    function promptNote(oldNote) {
        let note = prompt('Please input your notes (leave blank to be deleted):', oldNote || '');
        if (note === null) return undefined;
        note = note.trim();
        return note;
    }

    // Insert the button and note on the card
    function enhanceCard(card) {
        if (card.dataset.noteEnhanced) return; // Avoid duplicate
        const repoFullName = getRepoFullName(card);
        if (!repoFullName) return;
        card.dataset.noteEnhanced = '1';
        // Find the star button
        let starBtn = card.querySelector('.js-toggler-container.js-social-container.starring-container, .Box-sc-g0xbh4-0.fvaNTI');
        if (!starBtn) return;
        // Create the button
        let note = getNote(repoFullName);
        let btn = createNoteButton(repoFullName, note, function() {
            let newNote = promptNote(note);
            if (typeof newNote === 'undefined') return;
            setNote(repoFullName, newNote);
            // Re-render
            card.dataset.noteEnhanced = '';
            enhanceCard(card);
        });
        // Insert the button
        if (starBtn.parentElement) {
            // Avoid duplicate insertion
            let oldBtn = starBtn.parentElement.querySelector('.gh-note-btn');
            if (oldBtn) oldBtn.remove();
            btn.classList.add('gh-note-btn');
            starBtn.parentElement.appendChild(btn);
        }
        // Note display
        let oldNoteDiv = card.querySelector('.gh-note-display');
        if (oldNoteDiv) oldNoteDiv.remove();
        if (note) {
            let noteDiv = createNoteDisplay(note);
            noteDiv.classList.add('gh-note-display');
            // Put it before the data bar
            let dataInfo = card.querySelector('.f6.color-fg-muted.mt-0.mb-0.width-full, .f6.color-fg-muted.mt-2, .Box-sc-g0xbh4-0.bZkODq');
            if (dataInfo && dataInfo.parentElement) {
                dataInfo.parentElement.insertBefore(noteDiv, dataInfo);
            }
        }
    }

    // Select all repository cards
    function findAllRepoCards() {
        // Adapt to multiple card structures
        let cards = Array.from(document.querySelectorAll(`
            .col-12.d-block.width-full.py-4.border-bottom.color-border-muted,
            li.col-12.d-flex.flex-justify-between.width-full.py-4.border-bottom.color-border-muted,
            .Box-sc-g0xbh4-0.iwUbcA,
            .Box-sc-g0xbh4-0.flszRz,
            .Box-sc-g0xbh4-0.jbaXRR,
            .Box-sc-g0xbh4-0.bmHqGc,
            .Box-sc-g0xbh4-0.hFxojJ,
            section[aria-label="card content"]
        `));
        // Filter out cards without a repository full name
        return cards.filter(card => getRepoFullName(card));
    }

    // Determine if it is a repository page
    function isRepoPage() {
        const path = window.location.pathname;
        const parts = path.split('/').filter(Boolean);
        return (parts.length === 2 || (parts.length === 4 && parts[2] === 'tree')) && 
               !path.includes('/blob/') && 
               !path.includes('/issues/') && 
               !path.includes('/pulls/');
    }

    // Repository page processing function
    function enhanceRepoPage() {
        if (document.body.dataset.noteEnhanced) return; // Avoid duplicate
        // Get the repository name from the link
        const path = window.location.pathname;
        const parts = path.split('/').filter(Boolean);
        const repoFullName = parts.slice(0, 2).join('/');
        if (!repoFullName) return;
        document.body.dataset.noteEnhanced = '1';

        // Create the first button
        let note = getNote(repoFullName);
        let btn = createNoteButton(repoFullName, note, function() {
            let newNote = promptNote(note);
            if (typeof newNote === 'undefined') return;
            setNote(repoFullName, newNote);
            // Re-render
            document.body.dataset.noteEnhanced = '';
            enhanceRepoPage();
        });

        // Find the button bar
        let actionsList = document.querySelector('.pagehead-actions');
        if (actionsList) {
            // Create a new li element
            let li = document.createElement('li');
            li.appendChild(btn);

            // Avoid duplicate insertion
            let oldLi = actionsList.querySelector('.gh-note-li');
            if (oldLi) oldLi.remove();
            li.classList.add('gh-note-li');

            // Add to the button bar
            actionsList.appendChild(li);
        }

        // Create the second button
        let btn2 = createNoteButton(repoFullName, note, function() {
            let newNote = promptNote(note);
            if (typeof newNote === 'undefined') return;
            setNote(repoFullName, newNote);
            // Re-render
            document.body.dataset.noteEnhanced = '';
            enhanceRepoPage();
        });

        // Find the container
        let container = document.querySelector('.container-xl:not(.d-flex):not(.clearfix)');
        if (container) {
            // Find the star button
            let starBtn = container.querySelector('div[data-view-component="true"].js-toggler-container.starring-container');
            if (starBtn && starBtn.parentElement) {
                // Avoid duplicate insertion
                let oldBtn = starBtn.parentElement.querySelector('.gh-note-btn');
                if (oldBtn) oldBtn.remove();
                let newBtn = btn2;
                newBtn.classList.add('gh-note-btn');
                starBtn.parentElement.appendChild(newBtn);
            }
        }

        // Remove the old note display
        let oldNoteDiv = document.querySelector('.gh-note-display');
        if (oldNoteDiv) oldNoteDiv.remove();
        let oldNoteDiv2 = document.querySelector('.gh-note-display2');
        if (oldNoteDiv2) oldNoteDiv2.remove();
    
        if (note) {
            // Create the first note display
            let noteDiv = createNoteDisplay(note);
            noteDiv.classList.add('gh-note-display');
            
            // Find the description
            let description = document.querySelector('.f4.my-3, .f4.my-3.color-fg-muted.text-italic');
            if (description && description.parentElement) {
                description.parentElement.insertBefore(noteDiv, description.nextSibling);
            }

            // Create the second note display
            let noteDiv2 = createNoteDisplay(note);
            noteDiv2.classList.add('gh-note-display2');            

            if (container) {
                // Try finding the description
                let newDescription = container.querySelector('p.f4.mb-3.color-fg-muted');
                if (newDescription && newDescription.parentElement) {
                    newDescription.parentElement.insertBefore(noteDiv2, newDescription.nextSibling);
                } else {
                    // If there is no description, find the flex container
                    let flexContainer = container.querySelector('div.d-flex.gap-2.mt-n3.mb-3.flex-wrap');
                    if (flexContainer && flexContainer.parentElement) {
                        flexContainer.parentElement.insertBefore(noteDiv2, flexContainer.nextSibling);
                    }
                }
            }
        }
    }

    // Export notes data
    function exportNotes() {
        const notes = {};
        const keys = GM_listValues();
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (key.startsWith(NOTE_KEY_PREFIX)) {
                notes[key] = GM_getValue(key);
            }
        }
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notes));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "github_repo_notes.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    // Import notes data
    function importNotes() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const notes = JSON.parse(event.target.result);
                        for (const key in notes) {
                            if (notes.hasOwnProperty(key) && key.startsWith(NOTE_KEY_PREFIX)) {
                                GM_setValue(key, notes[key]);
                            }
                        }
                        alert('Import successfully!');
                        enhanceAll();
                    } catch (error) {
                        alert('Error:' + error.message);
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    // Clear all notes data
    function clearNotes() {
        const keys = GM_listValues();
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (key.startsWith(NOTE_KEY_PREFIX)) {
                GM_deleteValue(key);
            }
        }
    }

    // Create the floating button
    function createFloatingButton(text, onClick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.margin = '5px';
        btn.style.borderRadius = '6px';
        btn.style.backgroundColor = 'var(--button-default-bgColor-rest, var(--color-btn-bg))';
        btn.style.color = 'var(--button-default-fgColor-rest, var(--color-btn-text))';
        btn.style.border = '1px solid var(--button-default-borderColor-rest,var(--color-btn-border))';
        btn.addEventListener('click', onClick);
        return btn;
    }

    // Create the bottom floating button
    function createBottomButton() {
        if (document.querySelector('.gh-import-export-btn')) return; // Avoid duplicate
        const bottomBtn = document.createElement('button');
        bottomBtn.textContent = '☰';
        bottomBtn.classList.add('gh-import-export-btn');
        bottomBtn.style.position = 'fixed';
        bottomBtn.style.bottom = '20px';
        bottomBtn.style.right = '20px';
        bottomBtn.style.zIndex = '1000';
        bottomBtn.style.padding = '10px 20px';
        bottomBtn.style.backgroundColor = 'var(--button-default-bgColor-rest, var(--color-btn-bg))';
        bottomBtn.style.color = 'var(--button-default-fgColor-rest, var(--color-btn-text))';
        bottomBtn.style.border = '1px solid var(--button-default-borderColor-rest,var(--color-btn-border))';
        bottomBtn.style.borderRadius = '50%';
        bottomBtn.style.fontSize = '14px';
        bottomBtn.style.cursor = 'pointer';
        bottomBtn.addEventListener('click', () => {
            if (document.querySelector('.gh-import-export-dialog')) {
                document.querySelector('.gh-import-export-dialog').remove();
                bottomBtn.textContent = '☰';
                bottomBtn.style.borderRadius = '50%';
                return;
            }

            // Expand the button
            bottomBtn.textContent = 'Import/Export notes data';
            bottomBtn.style.borderRadius = '8px';

            // Create the dialog
            const dialog = document.createElement('div');
            dialog.classList.add('gh-import-export-dialog');
            dialog.style.position = 'fixed';
            dialog.style.bottom = '60px';
            dialog.style.right = '20px';
            dialog.style.backgroundColor = 'rgba(255, 255, 255, 0)';
            dialog.style.border = 'none';
            dialog.style.padding = '10px';
            dialog.style.zIndex = '1001';

            const exportBtn = createFloatingButton('Export', () => {
                exportNotes();
                dialog.remove();
                bottomBtn.textContent = '☰';
                bottomBtn.style.borderRadius = '50%';
            });

            const importBtn = createFloatingButton('Import', () => {
                importNotes();
                dialog.remove();
                bottomBtn.textContent = '☰';
                bottomBtn.style.borderRadius = '50%';
            });

            const clearBtn = createFloatingButton('Clear', () => {
                if (!confirm('Are you sure you want to clear all notes?')) return;
                clearNotes();
                dialog.remove();
                bottomBtn.textContent = '☰';
                bottomBtn.style.borderRadius = '50%';
            });

            dialog.appendChild(exportBtn);
            dialog.appendChild(importBtn);
            dialog.appendChild(clearBtn);
            document.body.appendChild(dialog);
        });
        document.body.appendChild(bottomBtn);
    }

    // Initial processing
    function enhanceAll() {
        if (isRepoPage()) {
            enhanceRepoPage();
        } else {
            findAllRepoCards().forEach(enhanceCard);
        }
        createBottomButton();
    }

    // Listen for DOM changes to adapt to dynamic loading
    const observer = new MutationObserver(() => {
        enhanceAll();
    });
    observer.observe(document.body, {childList: true, subtree: true});

    // First load
    enhanceAll();
})();
