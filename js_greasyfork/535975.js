// ==UserScript==
// @name         Fimfiction: Permanently Hide Stories (Except Library & Story Page)
// @namespace    https://fimfiction.net/
// @version      1.4
// @description  Hide stories in search/main listings (never in library/bookshelves or on story pages) with a "Hide" button. Remembers choices via localStorage.
// @author       YourName
// @match        https://www.fimfiction.net/*
// @icon         https://www.fimfiction.net/images/favicon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535975/Fimfiction%3A%20Permanently%20Hide%20Stories%20%28Except%20Library%20%20Story%20Page%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535975/Fimfiction%3A%20Permanently%20Hide%20Stories%20%28Except%20Library%20%20Story%20Page%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const HIDDEN_STORIES_KEY = 'ffn-hidden-stories';
    let hiddenStories = JSON.parse(localStorage.getItem(HIDDEN_STORIES_KEY) || '[]');

    function saveHiddenStories() {
        localStorage.setItem(HIDDEN_STORIES_KEY, JSON.stringify(hiddenStories));
    }

    function getStoryIdFromElement(el) {
        if (el.dataset && el.dataset.story) {
            return el.dataset.story;
        }
        let link = el.querySelector('a.story_link, a[href*="/story/"]');
        if (link) {
            let match = link.href.match(/\/story\/(\d+)/);
            if (match) {
                return match[1];
            }
        }
        if (el.dataset && el.dataset.storyId) {
            return el.dataset.storyId;
        }
        return null;
    }

    // Checks if this element is inside a library/bookshelf context
    function isInLibrary(el) {
        if (
            location.pathname.startsWith('/bookshelf') ||
            location.pathname.startsWith('/bookshelves')
        ) {
            return true;
        }
        if (el.classList.contains('bookshelf_story')) return true;
        if (
            document.body.classList.contains('user-bookshelves-page') ||
            document.body.classList.contains('bookshelf-page')
        ) return true;
        if (el.closest('.bookshelf_stories')) return true;
        return false;
    }

    // Checks if current page is a story page (e.g., /story/12345 or /story/12345/title)
    function isStoryPage() {
        // /story/12345 or /story/12345/title
        return /^\/story\/\d+(\/|$)/.test(location.pathname);
    }

    function hideStoryElement(el, storyId) {
        el.style.display = 'none';
    }

    function addHideButton(el, storyId) {
        if (el.querySelector('.ffn-hide-story-btn')) return;

        let btn = document.createElement('button');
        btn.textContent = 'Hide';
        btn.className = 'ffn-hide-story-btn';
        btn.style.marginLeft = '8px';
        btn.style.background = '#c00';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.padding = '2px 8px';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '0.9em';

        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (!hiddenStories.includes(storyId)) {
                hiddenStories.push(storyId);
                saveHiddenStories();
            }
            hideStoryElement(el, storyId);
        });

        let insertRef = el.querySelector('.story_title, .story_name, h2, .group_title');
        if (insertRef) {
            insertRef.appendChild(btn);
        } else {
            el.appendChild(btn);
        }
    }

    function processStories() {
        // Don't run on story pages
        if (isStoryPage()) return;

        let storyElems = document.querySelectorAll(
            '.story_container, .group_story, .story_list_item, .story-card, .featured_story, .new_story_container'
        );

        storyElems.forEach(el => {
            if (isInLibrary(el)) return;
            let storyId = getStoryIdFromElement(el);
            if (!storyId) return;

            if (hiddenStories.includes(storyId)) {
                hideStoryElement(el, storyId);
            } else {
                addHideButton(el, storyId);
            }
        });
    }

    // Mutation observer to catch dynamically loaded stories (e.g., infinite scroll)
    const observer = new MutationObserver(processStories);
    observer.observe(document.body, { childList: true, subtree: true });

    // Add a "Manage Hidden Stories" panel
    function createManagePanel() {
        if (document.getElementById('ffn-manage-hidden-panel')) return;
        let panel = document.createElement('div');
        panel.id = 'ffn-manage-hidden-panel';
        panel.style.position = 'fixed';
        panel.style.bottom = '20px';
        panel.style.right = '20px';
        panel.style.background = '#222';
        panel.style.color = '#fff';
        panel.style.padding = '10px';
        panel.style.borderRadius = '10px';
        panel.style.zIndex = '99999';
        panel.style.fontSize = '1em';
        panel.style.boxShadow = '0 2px 8px #0008';

        panel.innerHTML = `
            <strong>Hidden Stories</strong>
            <ul id="ffn-hidden-list" style="max-height:120px;overflow:auto;padding-left:18px;margin:8px 0 8px 0;"></ul>
            <button id="ffn-manage-close" style="margin-right:8px;">Close</button>
            <button id="ffn-manage-clearall">Unhide All</button>
        `;

        panel.style.display = 'none';
        document.body.appendChild(panel);

        let showBtn = document.createElement('button');
        showBtn.id = 'ffn-manage-show-btn';
        showBtn.textContent = 'Manage Hidden Stories';
        showBtn.style.position = 'fixed';
        showBtn.style.bottom = '20px';
        showBtn.style.right = '20px';
        showBtn.style.zIndex = '99998';
        showBtn.style.background = '#444';
        showBtn.style.color = '#fff';
        showBtn.style.border = 'none';
        showBtn.style.padding = '7px 10px';
        showBtn.style.borderRadius = '7px';
        showBtn.style.fontSize = '1em';
        showBtn.style.cursor = 'pointer';
        showBtn.style.boxShadow = '0 2px 8px #0005';

        showBtn.addEventListener('click', () => {
            panel.style.display = 'block';
            showBtn.style.display = 'none';
            updateHiddenList();
        });
        document.body.appendChild(showBtn);

        document.getElementById('ffn-manage-close').onclick = function() {
            panel.style.display = 'none';
            showBtn.style.display = 'block';
        };
        document.getElementById('ffn-manage-clearall').onclick = function() {
            hiddenStories = [];
            saveHiddenStories();
            processStories();
            updateHiddenList();
        };

        function updateHiddenList() {
            let ul = document.getElementById('ffn-hidden-list');
            ul.innerHTML = '';
            if (hiddenStories.length === 0) {
                let li = document.createElement('li');
                li.textContent = 'No hidden stories!';
                ul.appendChild(li);
            } else {
                hiddenStories.forEach(storyId => {
                    let li = document.createElement('li');
                    let a = document.createElement('a');
                    a.href = `/story/${storyId}`;
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer';
                    a.textContent = `Story #${storyId}`;
                    a.style.color = '#8cf';
                    a.style.textDecoration = 'underline';

                    let unhideBtn = document.createElement('button');
                    unhideBtn.textContent = 'Unhide';
                    unhideBtn.style.marginLeft = '8px';
                    unhideBtn.style.fontSize = '0.9em';
                    unhideBtn.onclick = function() {
                        hiddenStories = hiddenStories.filter(id => id !== storyId);
                        saveHiddenStories();
                        processStories();
                        updateHiddenList();
                    };

                    li.appendChild(a);
                    li.appendChild(unhideBtn);
                    ul.appendChild(li);
                });
            }
        }
    }

    processStories();
    createManagePanel();
})();