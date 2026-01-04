// ==UserScript==
// @name         GameBanana Toggle Categories
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Menu to hide/show Mods, Tutorials, Tools, Sounds, Concepts, WIPs, Sprays, Polls, Threads, Requests, Questions everywhere in gamebanana.com.
// @author       ChatGPT
// @match        https://gamebanana.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547654/GameBanana%20Toggle%20Categories.user.js
// @updateURL https://update.greasyfork.org/scripts/547654/GameBanana%20Toggle%20Categories.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'gbToggleCategoriesOptions';

    const categories = [
        { label: 'Mods', className: 'ModRecord', keyword: 'mods', hidden: false },
        { label: 'Tutorials', className: 'TutorialRecord', keyword: 'tutorials', hidden: false },
        { label: 'Tools', className: 'ToolRecord', keyword: 'tools', hidden: false },
        { label: 'Sounds', className: 'SoundRecord', keyword: 'sounds', hidden: false },
        { label: 'Concepts', className: 'ConceptRecord', keyword: 'concepts', hidden: false },
        { label: 'WIPs', className: 'WipRecord', keyword: 'wips', hidden: false },
        { label: 'Sprays', className: 'SprayRecord', keyword: 'sprays', hidden: false },
        { label: 'Polls', className: 'PollRecord', keyword: 'polls', hidden: false },
        { label: 'Threads', className: 'ThreadRecord', keyword: 'threads', hidden: false },
        { label: 'Requests', className: 'RequestRecord', keyword: 'requests', hidden: false },
        { label: 'Questions', className: 'QuestionRecord', keyword: 'questions', hidden: false }
    ];

    // Load preferences
    function loadOptions() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                categories.forEach(cat => {
                    const savedCat = parsed.find(c => c.className === cat.className);
                    if (savedCat && typeof savedCat.hidden === 'boolean') {
                        cat.hidden = savedCat.hidden;
                    }
                });
            } catch(e) {
                console.warn('Error loading options:', e);
            }
        }
    }

    // Save preferences
    function saveOptions() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    }

    loadOptions();

    // Create foldable menu
    const container = document.createElement('div');
    Object.assign(container.style, {
        position: 'fixed',
        top: '70px',
        left: '8px',
        width: '260px',
        backgroundColor: '#1b1b1b',
        border: '1px solid #444',
        borderRadius: '5px',
        boxShadow: '0 0 12px rgba(0,0,0,0.8)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: '#ccc',
        zIndex: 99999,
        userSelect: 'none',
        overflow: 'hidden',
        transition: 'height 0.25s ease',
    });

    // Foldable button
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = 'Show / Hide categories';
    Object.assign(toggleBtn.style, {
        width: '100%',
        backgroundColor: '#222',
        border: 'none',
        color: '#ccc',
        fontWeight: '600',
        padding: '10px 0',
        cursor: 'pointer',
        fontSize: '14px',
        outline: 'none',
        userSelect: 'none',
        borderRadius: '5px 5px 0 0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    });
    toggleBtn.addEventListener('mouseenter', () => toggleBtn.style.backgroundColor = '#333');
    toggleBtn.addEventListener('mouseleave', () => toggleBtn.style.backgroundColor = '#222');

    container.appendChild(toggleBtn);

    // Option container
    const optionsContainer = document.createElement('div');
    Object.assign(optionsContainer.style, {
        backgroundColor: '#181818',
        padding: '12px 16px',
        display: 'none', // folded by default
        maxHeight: '300px',
        overflowY: 'auto',
    });

    // Create checkboxes
    categories.forEach(cat => {
        const label = document.createElement('label');
        Object.assign(label.style, {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '8px',
            fontSize: '13px',
            cursor: 'pointer',
            userSelect: 'none',
            color: '#ccc',
        });

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = !cat.hidden;
        checkbox.style.marginRight = '10px';
        checkbox.style.cursor = 'pointer';

        checkbox.addEventListener('change', () => {
            cat.hidden = !checkbox.checked;
            saveOptions();
            applyDisplay();
        });

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(cat.label));
        optionsContainer.appendChild(label);
    });

    container.appendChild(optionsContainer);
    document.body.appendChild(container);

    // Manage folding/unfolding
    let isOpen = false;
    function updateContainer() {
        if (isOpen) {
            optionsContainer.style.display = 'block';
            container.style.height = 'auto';
        } else {
            optionsContainer.style.display = 'none';
            container.style.height = toggleBtn.offsetHeight + 'px';
        }
    }

    toggleBtn.addEventListener('click', () => {
        isOpen = !isOpen;
        updateContainer();
    });

    updateContainer();

    // Display / hide function
    function applyDisplay() {
        categories.forEach(cat => {
            // Per class
            document.querySelectorAll(`.${cat.className}`).forEach(el => {
                el.style.display = cat.hidden ? 'none' : '';
            });

            // By data-cat-url for elements close parent (for game section)
            document.querySelectorAll(`[data-cat-url*="${cat.keyword}"]`).forEach(el => {
                el.style.display = cat.hidden ? 'none' : '';
            });

            // For elements and sections where we identify by href links (ex: game section)
            document.querySelectorAll('a[href*="' + cat.keyword + '"]').forEach(a => {
                let el = a.closest('div.Record');
                if (el) {
                    el.style.display = cat.hidden ? 'none' : '';
                }
            });
        });
    }

    applyDisplay();

    // MutationObserver to detect and add dynamically
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (!(node instanceof HTMLElement)) return;
                categories.forEach(cat => {
                    // By class
                    if (node.classList && node.classList.contains(cat.className)) {
                        node.style.display = cat.hidden ? 'none' : '';
                    }
                    // By data-cat-url
                    if (node.hasAttribute && node.hasAttribute('data-cat-url') && node.getAttribute('data-cat-url').includes(cat.keyword)) {
                        node.style.display = cat.hidden ? 'none' : '';
                    }
                    // By href link
                    node.querySelectorAll && node.querySelectorAll('a[href*="' + cat.keyword + '"]').forEach(a => {
                        let el = a.closest('div.Record');
                        if (el) {
                            el.style.display = cat.hidden ? 'none' : '';
                        }
                    });
                    // Search per class
                    node.querySelectorAll && node.querySelectorAll(`.${cat.className}`).forEach(el => {
                        el.style.display = cat.hidden ? 'none' : '';
                    });
                    // Search per data-cat-url
                    node.querySelectorAll && node.querySelectorAll(`[data-cat-url*="${cat.keyword}"]`).forEach(el => {
                        el.style.display = cat.hidden ? 'none' : '';
                    });
                });
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
