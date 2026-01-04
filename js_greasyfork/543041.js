// ==UserScript==
// @name         Commons File Bookmark
// @namespace    http://tampermonkey.net/
// @version      2025-07-18
// @description  Bookmark files on Wikimedia Commons.
// @author       Franco Brignone
// @match        https://commons.wikimedia.org/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543041/Commons%20File%20Bookmark.user.js
// @updateURL https://update.greasyfork.org/scripts/543041/Commons%20File%20Bookmark.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'wm_commons_file_bookmarks';

    function loadBookmarks() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch {
            return [];
        }
    }

    function saveBookmarks(b) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(b));
    }

    function isBookmarked(title) {
        return loadBookmarks().some(b => b.title === title);
    }

    function addBookmark(title, url, imageUrl) {
        const bookmarks = loadBookmarks();
        if (!bookmarks.some(b => b.title === title)) {
            bookmarks.push({ title, url, imageUrl });
            saveBookmarks(bookmarks);
        }
    }

    function removeBookmark(title) {
        saveBookmarks(loadBookmarks().filter(b => b.title !== title));
    }

    function createBookmarkButton(title, url, imageUrl) {
        const btn = document.createElement('button');
        btn.textContent = isBookmarked(title) ? '🚩 Bookmarked' : '🚩 Bookmark File';
        btn.className = 'bookmark-file-btn';
        btn.style.marginLeft = '6px';
        btn.style.padding = '2px 5px';
        btn.style.fontSize = '11px';
        btn.style.cursor = 'pointer';
        btn.style.border = '1px solid #cc0000';
        btn.style.borderRadius = '3px';
        btn.style.backgroundColor = isBookmarked(title) ? '#ffe6e6' : '#fff';
        btn.style.color = '#cc0000';

        btn.addEventListener('click', () => {
            if (isBookmarked(title)) {
                removeBookmark(title);
                btn.textContent = '🚩 Bookmark File';
                btn.style.backgroundColor = '#fff';
            } else {
                addBookmark(title, url, imageUrl);
                btn.textContent = '🚩 Bookmarked';
                btn.style.backgroundColor = '#ffe6e6';
            }
        });

        return btn;
    }

    function addViewBookmarksButton() {
        if (document.querySelector('#view-file-bookmarks-btn')) return;

        const container = document.createElement('div');
        container.id = 'bookmark-buttons-container';
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '20px';
        container.style.zIndex = 9999;
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'flex-end';
        container.style.gap = '5px';

        const btn = document.createElement('button');
        btn.id = 'view-file-bookmarks-btn';
        btn.textContent = '📌 View Bookmarked Files';
        btn.style.backgroundColor = '#cc0000';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.padding = '8px 12px';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
        btn.style.fontWeight = 'bold';
        btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        btn.style.minWidth = '160px';

        btn.addEventListener('click', showBookmarkList);

        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'toggle-bookmark-btn';
        toggleBtn.style.backgroundColor = '#444';
        toggleBtn.style.color = 'white';
        toggleBtn.style.border = 'none';
        toggleBtn.style.padding = '3px 6px';
        toggleBtn.style.borderRadius = '5px';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.style.fontSize = '12px';
        toggleBtn.style.width = '80px';

        const hidden = localStorage.getItem('bookmarkBtnHidden') === 'true';
        let isHidden = hidden;

        toggleBtn.addEventListener('click', () => {
            isHidden = !isHidden;
            localStorage.setItem('bookmarkBtnHidden', isHidden ? 'true' : 'false');
            if (isHidden) {
                btn.style.display = 'none';
                toggleBtn.textContent = '👁 Show';
            } else {
                btn.style.display = 'inline-block';
                toggleBtn.textContent = '👁 Hide';
            }
        });

        container.appendChild(toggleBtn);
        container.appendChild(btn);
        document.body.appendChild(container);

        if (isHidden) {
            btn.style.display = 'none';
            toggleBtn.textContent = '👁 Show';
        } else {
            toggleBtn.textContent = '👁 Hide';
        }
    }

    function showBookmarkList() {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        overlay.style.zIndex = 10000;
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';

        const modal = document.createElement('div');
        modal.style.backgroundColor = '#fff';
        modal.style.padding = '15px';
        modal.style.borderRadius = '8px';
        modal.style.width = '420px';
        modal.style.maxHeight = '80vh';
        modal.style.overflowY = 'auto';
        modal.style.position = 'relative';

        const title = document.createElement('h2');
        title.textContent = 'Bookmarked Files';
        modal.appendChild(title);

        const bookmarks = loadBookmarks();
        if (bookmarks.length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.textContent = 'No files bookmarked yet.';
            modal.appendChild(emptyMsg);
        } else {
            const list = document.createElement('ul');
            list.style.listStyle = 'none';
            list.style.padding = 0;

            bookmarks.forEach(b => {
                const li = document.createElement('li');
                li.style.marginBottom = '10px';
                li.style.display = 'flex';
                li.style.alignItems = 'center';

                const img = document.createElement('img');
                img.src = b.imageUrl || '';
                img.alt = b.title;
                img.style.width = '50px';
                img.style.height = '50px';
                img.style.objectFit = 'cover';
                img.style.marginRight = '10px';
                img.style.border = '1px solid #ccc';

                // Handle deleted or missing image
                img.onerror = () => {
                    img.remove(); // remove broken <img>
                    const placeholder = document.createElement('div');
                    placeholder.textContent = '❌';
                    placeholder.style.width = '50px';
                    placeholder.style.height = '50px';
                    placeholder.style.display = 'flex';
                    placeholder.style.alignItems = 'center';
                    placeholder.style.justifyContent = 'center';
                    placeholder.style.fontSize = '24px';
                    placeholder.style.color = '#cc0000';
                    placeholder.style.background = '#f8f8f8';
                    placeholder.style.border = '1px solid #ccc';
                    placeholder.style.marginRight = '10px';
                    li.insertBefore(placeholder, li.firstChild);
                };

                const link = document.createElement('a');
                link.href = b.url;
                link.textContent = b.title;
                link.target = '_blank';
                link.style.flex = '1';
                link.style.color = '#cc0000';
                link.style.fontWeight = 'bold';
                link.style.textDecoration = 'none';
                link.style.whiteSpace = 'nowrap';
                link.style.overflow = 'hidden';
                link.style.textOverflow = 'ellipsis';
                link.style.maxWidth = '280px';

                const removeBtn = document.createElement('button');
                removeBtn.textContent = 'Remove';
                removeBtn.style.marginLeft = '5px';
                removeBtn.style.backgroundColor = '#cc0000';
                removeBtn.style.color = 'white';
                removeBtn.style.border = 'none';
                removeBtn.style.padding = '3px 6px';
                removeBtn.style.borderRadius = '3px';
                removeBtn.style.cursor = 'pointer';
                removeBtn.style.fontSize = '12px';

                removeBtn.addEventListener('click', () => {
                    removeBookmark(b.title);
                    li.remove();
                });

                li.appendChild(img);
                li.appendChild(link);
                li.appendChild(removeBtn);
                list.appendChild(li);
            });

            modal.appendChild(list);

            // Copy button below the list
            const copyBtn = document.createElement('button');
            copyBtn.textContent = 'Copy Bookmarks';
            copyBtn.style.backgroundColor = '#cc0000';
            copyBtn.style.color = 'white';
            copyBtn.style.border = 'none';
            copyBtn.style.padding = '8px 12px';
            copyBtn.style.borderRadius = '5px';
            copyBtn.style.cursor = 'pointer';
            copyBtn.style.fontWeight = 'bold';
            copyBtn.style.marginTop = '10px';
            copyBtn.style.width = '100%';

            copyBtn.addEventListener('click', () => {
                const textToCopy = bookmarks.map(b => {
                    const cleanTitle = b.title.startsWith('File:') ? b.title.slice(5) : b.title;
                    return `${cleanTitle} - ${b.url}`;
                }).join('\n');

                navigator.clipboard.writeText(textToCopy).then(() => {
                    copyBtn.textContent = 'Copied';
                    setTimeout(() => {
                        copyBtn.textContent = 'Copy Bookmarks';
                    }, 2000);
                }).catch(() => {
                    copyBtn.textContent = 'Failed to copy';
                    setTimeout(() => {
                        copyBtn.textContent = 'Copy Bookmarks';
                    }, 2000);
                });
            });

            modal.appendChild(copyBtn);
        }

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '10px';
        closeBtn.style.right = '10px';
        closeBtn.style.background = 'transparent';
        closeBtn.style.border = 'none';
        closeBtn.style.fontSize = '20px';
        closeBtn.style.cursor = 'pointer';

        closeBtn.addEventListener('click', () => overlay.remove());

        modal.appendChild(closeBtn);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    function injectListFilesButtons() {
        document.querySelectorAll('tr').forEach(row => {
            const tdName = row.querySelector('td.TablePager_col_img_name');
            if (!tdName || tdName.querySelector('.bookmark-file-btn')) return;

            const link = tdName.querySelector('a[href^="/wiki/File:"]');
            if (!link) return;

            const title = decodeURIComponent(link.getAttribute('title'));
            const url = link.href;

            const fileLink = tdName.querySelector('a[href^="https://upload.wikimedia.org"]');
            if (!fileLink) return;

            const imageUrl = fileLink.href;

            tdName.appendChild(createBookmarkButton(title, url, imageUrl));
        });
    }

    function injectFilePageButton() {
        if (!window.location.pathname.startsWith('/wiki/File:')) return;
        if (document.querySelector('.bookmark-file-btn')) return;

        const title = decodeURIComponent(window.location.pathname.split('/').pop());
        const url = window.location.href;
        const fileLink = document.querySelector('.fullMedia a[href^="https://upload.wikimedia.org"]');
        const imageUrl = fileLink ? fileLink.href : '';

        const header = document.querySelector('#firstHeading');
        if (header) header.appendChild(createBookmarkButton(title, url, imageUrl));
    }

    function init() {
        addViewBookmarksButton();

        if (window.location.pathname.startsWith('/wiki/Special:ListFiles')) {
            injectListFilesButtons();
            new MutationObserver(injectListFilesButtons).observe(document.body, { childList: true, subtree: true });
        } else if (window.location.pathname.startsWith('/wiki/File:')) {
            injectFilePageButton();
        }
    }

    init();
})();