// ==UserScript==
// @name         Nitan User Tags
// @namespace    NUT
// @version      0.2.0
// @description  Add user tags to Nitan forum users
// @icon         https://static.thenounproject.com/png/888732-200.png
// @author       s5kf
// @contributor  cucco-io
// @license      CC BY-NC-ND 4.0
// @match        *://www.uscardforum.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496955/Nitan%20User%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/496955/Nitan%20User%20Tags.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        STORAGE_KEY: 'userTags',
        DEBOUNCE_MS: 100,
        SAVE_ANIMATION_MS: 2000,
        TAG_SEPARATOR: ',',
        PROCESSED_ATTR: 'data-nut-processed',
        USERNAME_ATTR: 'data-nut-username'
    };

    // Storage functions with error handling
    function getTagMap() {
        try {
            const tagJsonStr = localStorage.getItem(CONFIG.STORAGE_KEY);
            return tagJsonStr ? JSON.parse(tagJsonStr) : {};
        } catch (e) {
            console.error('[NUT] Failed to load tags:', e);
            return {};
        }
    }

    function saveTagMap(tagMap) {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(tagMap));
            return true;
        } catch (e) {
            console.error('[NUT] Failed to save tags:', e);
            return false;
        }
    }

    function getTagsForUser(username) {
        const tagMap = getTagMap();
        const tagString = tagMap[username];
        if (!tagString) return [];
        return tagString.split(CONFIG.TAG_SEPARATOR).map(t => t.trim()).filter(t => t);
    }

    function saveTagsForUser(username, tagString, button, container) {
        const tagMap = getTagMap();
        if (tagString && tagString.trim()) {
            tagMap[username] = tagString.trim();
        } else {
            delete tagMap[username];
        }

        if (saveTagMap(tagMap)) {
            console.log(`[NUT] Saved tags for "${username}": "${tagString}"`);
            showSaveAnimation(button, container);
            refreshUserTags(username);
        }
    }

    function refreshUserTags(username) {
        const userElements = document.querySelectorAll(`.username[${CONFIG.USERNAME_ATTR}="${username}"]`);
        console.log(`[NUT] Refreshing tags for "${username}", found ${userElements.length} elements`);
        userElements.forEach(userElement => {
            updateTagDisplay(userElement, username);

            // Also update the input field in the tag UI
            const tagInput = userElement.querySelector('.tag-input');
            if (tagInput) {
                const currentTags = getTagsForUser(username);
                tagInput.value = currentTags.join(', ');
            }
        });
    }

    // UI display and update functions
    function updateTagDisplay(userElement, username) {
        // Remove existing tag elements
        const existingTags = userElement.querySelectorAll('.user-tag');
        existingTags.forEach(tag => tag.remove());

        // Add current tags
        const tags = getTagsForUser(username);
        tags.forEach((tag, index) => {
            const tagElement = createInteractiveTag(tag, index, username, userElement);

            // Insert before tag icon if it exists, otherwise append
            const tagIcon = userElement.querySelector('.tag-icon');
            if (tagIcon) {
                userElement.insertBefore(tagElement, tagIcon);
            } else {
                userElement.appendChild(tagElement);
            }
        });
    }

    function createInteractiveTag(tagText, index, username, userElement) {
        const tagElement = document.createElement('span');
        tagElement.className = 'user-tag';
        tagElement.setAttribute('data-tag-index', index);
        tagElement.setAttribute('draggable', 'true');

        // Tag text container
        const textSpan = document.createElement('span');
        textSpan.className = 'user-tag-text';
        textSpan.textContent = tagText;

        // Click to edit tag
        textSpan.addEventListener('click', (e) => {
            e.stopPropagation();
            const tagUI = userElement.querySelector('.tag-ui-container');
            const input = tagUI.querySelector('.tag-input');
            const currentTags = getTagsForUser(username);

            // Focus the tag being edited
            input.value = currentTags.join(', ');
            tagUI.style.display = 'flex';
            input.focus();

            // Select the specific tag in the input
            setTimeout(() => {
                const tagPosition = currentTags.slice(0, index).join(', ').length;
                const start = tagPosition + (index > 0 ? 2 : 0); // account for ", "
                const end = start + tagText.length;
                input.setSelectionRange(start, end);
            }, 0);
        });

        // Remove button
        const removeBtn = document.createElement('span');
        removeBtn.className = 'user-tag-remove';
        removeBtn.innerHTML = '×';
        removeBtn.setAttribute('title', 'Remove tag');

        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const currentTags = getTagsForUser(username);
            currentTags.splice(index, 1);
            const newTagString = currentTags.join(', ');

            const tagMap = getTagMap();
            if (newTagString.trim()) {
                tagMap[username] = newTagString;
            } else {
                delete tagMap[username];
            }
            saveTagMap(tagMap);
            refreshUserTags(username);
        });

        // Drag and drop handlers
        tagElement.addEventListener('dragstart', (e) => {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', index.toString());
            tagElement.classList.add('dragging');
        });

        tagElement.addEventListener('dragend', (e) => {
            tagElement.classList.remove('dragging');
        });

        tagElement.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';

            const draggingTag = userElement.querySelector('.user-tag.dragging');
            if (draggingTag && draggingTag !== tagElement) {
                tagElement.classList.add('drag-over');
            }
        });

        tagElement.addEventListener('dragleave', (e) => {
            tagElement.classList.remove('drag-over');
        });

        tagElement.addEventListener('drop', (e) => {
            e.preventDefault();
            tagElement.classList.remove('drag-over');

            const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
            const toIndex = index;

            if (fromIndex !== toIndex) {
                const currentTags = getTagsForUser(username);
                const [movedTag] = currentTags.splice(fromIndex, 1);
                currentTags.splice(toIndex, 0, movedTag);

                const newTagString = currentTags.join(', ');
                const tagMap = getTagMap();
                tagMap[username] = newTagString;
                saveTagMap(tagMap);
                refreshUserTags(username);
            }
        });

        tagElement.appendChild(textSpan);
        tagElement.appendChild(removeBtn);

        return tagElement;
    }

    function showSaveAnimation(button, container) {
        button.innerHTML = '✔️';
        button.classList.add('saved');

        setTimeout(() => {
            button.innerHTML = 'Save';
            button.classList.remove('saved');
            container.style.display = 'none';
        }, CONFIG.SAVE_ANIMATION_MS);
    }

    function createTagUI(userElement) {
        // Prevent duplicate UI creation
        if (userElement.hasAttribute(CONFIG.PROCESSED_ATTR)) {
            return;
        }
        userElement.setAttribute(CONFIG.PROCESSED_ATTR, 'true');

        // Extract clean username before adding any tags
        const username = userElement.textContent.trim();
        if (!username) return;

        // Store username as data attribute for later reference
        userElement.setAttribute(CONFIG.USERNAME_ATTR, username);

        // Skip if inside avatar elements
        if (userElement.closest('.post-avatar') ||
            userElement.closest('.topic-avatar') ||
            userElement.closest('.topic-poster')) {
            return;
        }

        // Add initial tags
        updateTagDisplay(userElement, username);

        // Create tag icon
        const tagIcon = document.createElement('span');
        tagIcon.className = 'tag-icon';
        tagIcon.textContent = '🏷️';

        // Create tag UI container
        const tagUIContainer = document.createElement('div');
        tagUIContainer.className = 'tag-ui-container';
        tagUIContainer.style.display = 'none'; // Initialize display state

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'tag-input';
        input.placeholder = 'Enter tags (comma-separated)';
        const currentTags = getTagsForUser(username);
        input.value = currentTags.join(', ');

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'tag-button-container';

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.className = 'tag-save-button';

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'tag-delete-button';

        // Event handlers
        saveButton.addEventListener('click', () => {
            saveTagsForUser(username, input.value, saveButton, tagUIContainer);
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                saveTagsForUser(username, input.value, saveButton, tagUIContainer);
            } else if (e.key === 'Escape') {
                tagUIContainer.style.display = 'none';
            }
        });

        deleteButton.addEventListener('click', () => {
            saveTagsForUser(username, '', saveButton, tagUIContainer);
            input.value = '';
        });

        tagIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            tagUIContainer.style.display = tagUIContainer.style.display === 'none' ? 'flex' : 'none';
            if (tagUIContainer.style.display === 'flex') {
                input.focus();
            }
        });

        // Assemble UI
        buttonContainer.appendChild(saveButton);
        buttonContainer.appendChild(deleteButton);
        tagUIContainer.appendChild(input);
        tagUIContainer.appendChild(buttonContainer);

        userElement.appendChild(tagIcon);
        userElement.appendChild(tagUIContainer);
    }

    function processAllUsers() {
        const userElements = document.querySelectorAll('.username');
        userElements.forEach(userElement => {
            createTagUI(userElement);
        });
    }

    // Inject CSS styles using forum's color scheme
    const style = document.createElement('style');
    style.textContent = `
        :root {
            /* Tag styling - uses tertiary (blue) color */
            --nut-tag-bg: var(--tertiary, #0f82af);
            --nut-tag-color: var(--secondary, #222222);
            --nut-tag-border: var(--tertiary, #0f82af);

            /* Icon styling */
            --nut-icon-color: var(--primary-medium, rgb(143.65, 143.65, 143.65));
            --nut-icon-hover: var(--primary-high, rgb(165.75, 165.75, 165.75));

            /* Input styling - follows forum theme */
            --nut-input-bg: var(--secondary, #222222);
            --nut-input-border: var(--primary-low-mid, rgb(121.55, 121.55, 121.55));
            --nut-input-color: var(--primary, #dddddd);
            --nut-input-focus-border: var(--tertiary, #0f82af);

            /* Button styling - uses tertiary color */
            --nut-button-bg: var(--tertiary, #0f82af);
            --nut-button-color: var(--secondary, #222222);
            --nut-button-hover: var(--highlight, #a87137);

            /* Delete button - uses danger color */
            --nut-delete-bg: transparent;
            --nut-delete-color: var(--danger, #e45735);
            --nut-delete-hover-bg: var(--danger, #e45735);
            --nut-delete-hover-color: var(--secondary, #222222);

            /* Save success - uses success color */
            --nut-saved-bg: var(--success, #1ca551);

            /* UI container */
            --nut-container-bg: var(--secondary, #222222);
            --nut-container-border: var(--primary-medium, rgb(143.65, 143.65, 143.65));
            --nut-container-shadow: rgba(0, 0, 0, 0.3);
        }

        .user-tag {
            display: inline-flex;
            align-items: center;
            gap: 3px;
            margin-left: 4px;
            padding: 1px 6px;
            font-size: 0.857em; /* Matches forum's relative sizing */
            font-weight: 600;
            line-height: 1.3;
            color: var(--nut-tag-color);
            background: var(--nut-tag-bg);
            border-radius: 2px;
            vertical-align: baseline;
            position: relative;
            top: -1px; /* Fine-tune vertical alignment */
            cursor: move;
            transition: all 0.2s ease;
        }

        .user-tag:hover {
            opacity: 0.9;
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .user-tag.dragging {
            opacity: 0.5;
            cursor: grabbing;
        }

        .user-tag.drag-over {
            border: 1px dashed var(--nut-tag-color);
            padding-left: 5px;
            padding-right: 5px;
        }

        .user-tag-text {
            cursor: pointer;
            user-select: none;
        }

        .user-tag-text:hover {
            text-decoration: underline;
        }

        .user-tag-remove {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 14px;
            height: 14px;
            margin-left: 2px;
            font-size: 16px;
            font-weight: 700;
            line-height: 1;
            color: var(--nut-tag-color);
            opacity: 0.6;
            cursor: pointer;
            border-radius: 2px;
            transition: all 0.15s ease;
            user-select: none;
        }

        .user-tag-remove:hover {
            opacity: 1;
            background: rgba(0, 0, 0, 0.2);
            color: var(--danger, #e45735);
        }

        .tag-icon {
            display: inline-block;
            margin-left: 4px;
            font-size: 0.9em; /* Slightly smaller emoji */
            color: var(--nut-icon-color);
            cursor: pointer;
            vertical-align: baseline;
            position: relative;
            top: 0px;
            opacity: 0.7;
            transition: opacity 0.2s ease, color 0.2s ease;
        }

        .tag-icon:hover {
            color: var(--nut-icon-hover);
            opacity: 1;
        }

        .tag-ui-container {
            display: none;
            flex-direction: column;
            gap: 6px;
            margin-top: 6px;
            padding: 8px;
            background: var(--nut-container-bg);
            border: 1px solid var(--nut-container-border);
            border-radius: 3px;
            box-shadow: 0 2px 6px var(--nut-container-shadow);
            max-width: 280px;
        }

        .tag-input {
            width: 100%;
            padding: 6px 8px;
            font-size: 0.929em; /* 13px equivalent, forum-matched */
            color: var(--nut-input-color);
            background: var(--nut-input-bg);
            border: 1px solid var(--nut-input-border);
            border-radius: 2px;
            outline: none;
            box-sizing: border-box;
            transition: border-color 0.2s ease;
            line-height: 1.4;
        }

        .tag-input:focus {
            border-color: var(--nut-input-focus-border);
        }

        .tag-input::placeholder {
            color: var(--primary-medium, rgb(143.65, 143.65, 143.65));
            opacity: 0.8;
        }

        .tag-button-container {
            display: flex;
            gap: 6px;
        }

        .tag-save-button, .tag-delete-button {
            flex: 1;
            padding: 6px 10px;
            font-size: 0.857em; /* 12px equivalent, compact */
            font-weight: 600;
            cursor: pointer;
            border: none;
            border-radius: 2px;
            transition: all 0.2s ease;
            line-height: 1.4;
        }

        .tag-save-button {
            background: var(--nut-button-bg);
            color: var(--nut-button-color);
        }

        .tag-save-button:hover {
            background: var(--nut-button-hover);
            color: var(--nut-button-color);
        }

        .tag-save-button.saved {
            background: var(--nut-saved-bg);
            color: var(--secondary, #222222);
        }

        .tag-delete-button {
            background: var(--nut-delete-bg);
            color: var(--nut-delete-color);
            border: 1px solid var(--nut-delete-color);
        }

        .tag-delete-button:hover {
            background: var(--nut-delete-hover-bg);
            color: var(--nut-delete-hover-color);
            border-color: var(--nut-delete-hover-bg);
        }
    `;
    document.head.appendChild(style);

    // Initialize with debouncing
    function init() {
        console.log('[NUT] Nitan User Tags initialized');
        processAllUsers();

        // Debounced MutationObserver to prevent performance issues
        const observer = new MutationObserver(() => {
            clearTimeout(window.nutProcessTimeout);
            window.nutProcessTimeout = setTimeout(() => {
                processAllUsers();
            }, CONFIG.DEBOUNCE_MS);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
