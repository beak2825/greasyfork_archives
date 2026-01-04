// ==UserScript==
// @name         NHentai Doujin Hider/Manual Blacklist
// @namespace    *://nhentai.net/
// @version      1.0
// @description  Hide/toggle visibility of NHentai doujins using a checkbox, cloud-synced via GitHub Gist
// @author       Incontinentia Botox
// @license GPL-3.0
// @match        *://nhentai.net/*
// @exclude      *://nhentai.net/g/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536007/NHentai%20Doujin%20HiderManual%20Blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/536007/NHentai%20Doujin%20HiderManual%20Blacklist.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const GIST_ID = 'YOUR_GIST_ID_HERE';
    const GITHUB_TOKEN = 'YOUR_GITHUB_TOKEN_HERE'; // 🔒 BEWARE, DON'T SHARE THIS TOKEN WITH ANYONE
    const FILENAME = 'nhentai-blacklist.json';

    let hiddenShown = false;
    let inMemoryBlacklist = null;
    let saveTimeout = null;

    async function getBlacklist() {
        try {
            const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`
                }
            });

            const data = await response.json();
            const content = data.files[FILENAME].content;
            return JSON.parse(content).blacklist || [];
        } catch (err) {
            console.error('Failed to fetch blacklist from Gist:', err);
            return [];
        }
    }

    async function loadBlacklistOnce() {
        if (inMemoryBlacklist === null) {
            inMemoryBlacklist = await getBlacklist();
        }
        return inMemoryBlacklist;
    }

    function scheduleSaveBlacklist() {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            saveBlacklist(inMemoryBlacklist);
        }, 500);
    }

    async function saveBlacklist(list) {
        try {
            const updatedContent = {
                files: {
                    [FILENAME]: {
                        content: JSON.stringify({ blacklist: list }, null, 2)
                    }
                }
            };

            await fetch(`https://api.github.com/gists/${GIST_ID}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedContent)
            });
        } catch (err) {
            console.error('Failed to update blacklist in Gist:', err);
        }
    }

    async function addToBlacklist(id) {
        const list = await loadBlacklistOnce();
        if (!list.includes(id)) {
            list.push(id);
            scheduleSaveBlacklist();
        }
    }

    async function removeFromBlacklist(id) {
        const list = await loadBlacklistOnce();
        const index = list.indexOf(id);
        if (index !== -1) {
            list.splice(index, 1);
            scheduleSaveBlacklist();
        }
    }

    async function shouldHide(id) {
        const list = await loadBlacklistOnce();
        return list.includes(id);
    }

    function createCheckbox(id, container) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'hide-doujin-checkbox';
        checkbox.style.position = 'absolute';
        checkbox.style.top = '5px';
        checkbox.style.right = '5px';
        checkbox.style.zIndex = 10;

        checkbox.addEventListener('change', async () => {
            if (checkbox.checked) {
                await addToBlacklist(id);
                container.classList.add('hidden-doujin');
                if (!hiddenShown) {
                    container.style.display = 'none';
                } else {
                    container.style.opacity = '0.4';
                    container.style.border = '2px dashed red';
                    container.style.display = '';
                }
            } else {
                await removeFromBlacklist(id);
                container.classList.remove('hidden-doujin');
                container.style.display = '';
                container.style.opacity = '';
                container.style.border = '';
            }
        });

        return checkbox;
    }

    async function processGalleryItems() {
        const blacklist = await loadBlacklistOnce();

        document.querySelectorAll('.gallery').forEach(gallery => {
            const link = gallery.querySelector('a');
            const href = link?.href || '';
            const idMatch = href.match(/\/g\/(\d+)\//);
            const id = idMatch?.[1];

            if (!id) return;

            gallery.dataset.doujinId = id;

            const isHidden = blacklist.includes(id);
            if (isHidden) {
                gallery.classList.add('hidden-doujin');
                if (!hiddenShown) {
                    gallery.style.display = 'none';
                } else {
                    gallery.style.opacity = '0.4';
                    gallery.style.border = '2px dashed red';
                }
            } else {
                gallery.style.display = '';
            }

            if (!gallery.querySelector('.hide-doujin-checkbox')) {
                gallery.style.position = 'relative';
                const checkbox = createCheckbox(id, gallery);
                checkbox.checked = isHidden;
                gallery.appendChild(checkbox);
            }
        });
    }

    function toggleHiddenDoujins() {
        hiddenShown = !hiddenShown;

        document.querySelectorAll('.gallery.hidden-doujin').forEach(gallery => {
            if (hiddenShown) {
                gallery.style.display = '';
                gallery.style.opacity = '0.4';
                gallery.style.border = '2px dashed red';
            } else {
                gallery.style.display = 'none';
                gallery.style.opacity = '';
                gallery.style.border = '';
            }
        });

        const btn = document.querySelector('#show-hidden-btn');
        if (btn) btn.textContent = hiddenShown ? '🙈 Hide Hidden' : '👁️ Show Hidden';
    }

    function createShowHiddenButton() {
        const btn = document.createElement('button');
        btn.id = 'show-hidden-btn';
        btn.textContent = '👁️ Show Hidden';
        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 9999,
            padding: '8px 12px',
            background: '#444',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '4px'
        });

        btn.addEventListener('click', toggleHiddenDoujins);

        document.body.appendChild(btn);
    }

    createShowHiddenButton();
    processGalleryItems();

    // Observe for dynamically loaded content
    const observer = new MutationObserver(() => {
        processGalleryItems();
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();
