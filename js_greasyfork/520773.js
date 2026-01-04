// ==UserScript==
// @name        GPT提示词浮窗
// @namespace   Violentmonkey Scripts
// @match       https://chat.deepseek.com/*
// @match       https://demo.fuclaude.com/*
// @match       https://chatgpt.com/*
// @grant       GM_setValue
// @grant       GM_getValue
// @version     1.5
// @author      -
// @description 2024/8/9 23:35:04
// @downloadURL https://update.greasyfork.org/scripts/520773/GPT%E6%8F%90%E7%A4%BA%E8%AF%8D%E6%B5%AE%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/520773/GPT%E6%8F%90%E7%A4%BA%E8%AF%8D%E6%B5%AE%E7%AA%97.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Keep existing Modal functions
    function createModal() {
        const modalOverlay = document.createElement('div');
        modalOverlay.style.position = 'fixed';
        modalOverlay.style.top = '0';
        modalOverlay.style.left = '0';
        modalOverlay.style.width = '100%';
        modalOverlay.style.height = '100%';
        modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modalOverlay.style.display = 'flex';
        modalOverlay.style.justifyContent = 'center';
        modalOverlay.style.alignItems = 'center';
        modalOverlay.style.zIndex = '1001';

        const modalContent = document.createElement('div');
        modalContent.style.backgroundColor = '#2d3748';
        modalContent.style.padding = '20px';
        modalContent.style.borderRadius = '12px';
        modalContent.style.width = '400px';
        modalContent.style.maxWidth = '90%';
        modalContent.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        modalContent.style.position = 'relative';

        return { modalOverlay, modalContent };
    }

    // Confirmation modal for delete
    function createConfirmModal(message) {
        return new Promise((resolve) => {
            const { modalOverlay, modalContent } = createModal();

            const messageElement = document.createElement('p');
            messageElement.textContent = message;
            messageElement.style.color = '#e2e8f0';
            messageElement.style.marginBottom = '20px';

            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.gap = '10px';
            buttonContainer.style.justifyContent = 'flex-end';

            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancel';
            cancelButton.style.padding = '8px 16px';
            cancelButton.style.borderRadius = '6px';
            cancelButton.style.border = '1px solid #4a5568';
            cancelButton.style.backgroundColor = '#4a5568';
            cancelButton.style.color = '#e2e8f0';
            cancelButton.style.cursor = 'pointer';

            const confirmButton = document.createElement('button');
            confirmButton.textContent = 'Delete';
            confirmButton.style.padding = '8px 16px';
            confirmButton.style.borderRadius = '6px';
            confirmButton.style.border = 'none';
            confirmButton.style.backgroundColor = '#e53e3e';
            confirmButton.style.color = 'white';
            confirmButton.style.cursor = 'pointer';

            cancelButton.onclick = () => {
                document.body.removeChild(modalOverlay);
                resolve(false);
            };

            confirmButton.onclick = () => {
                document.body.removeChild(modalOverlay);
                resolve(true);
            };

            buttonContainer.appendChild(cancelButton);
            buttonContainer.appendChild(confirmButton);

            modalContent.appendChild(messageElement);
            modalContent.appendChild(buttonContainer);
            modalOverlay.appendChild(modalContent);
            document.body.appendChild(modalOverlay);
        });
    }

    // Modified input modal to support title and content
    function createInputModal(type = 'add', initialTitle = '', initialContent = '') {
        return new Promise((resolve) => {
            const { modalOverlay, modalContent } = createModal();

            const titleElement = document.createElement('h3');
            titleElement.textContent = type === 'add' ? 'Add New Phrase' : 'Edit Phrase';
            titleElement.style.color = '#e2e8f0';
            titleElement.style.marginTop = '0';
            titleElement.style.marginBottom = '15px';
            titleElement.style.fontSize = '18px';

            // Title input
            const titleLabel = document.createElement('label');
            titleLabel.textContent = 'Title:';
            titleLabel.style.color = '#e2e8f0';
            titleLabel.style.display = 'block';
            titleLabel.style.marginBottom = '5px';

            const titleInput = document.createElement('input');
            titleInput.value = initialTitle;
            titleInput.style.width = '100%';
            titleInput.style.padding = '8px 12px';
            titleInput.style.borderRadius = '6px';
            titleInput.style.border = '1px solid #4a5568';
            titleInput.style.backgroundColor = '#3f495e';
            titleInput.style.color = '#e2e8f0';
            titleInput.style.fontSize = '14px';
            titleInput.style.marginBottom = '15px';
            titleInput.style.boxSizing = 'border-box';

            // Content input
            const contentLabel = document.createElement('label');
            contentLabel.textContent = 'Content:';
            contentLabel.style.color = '#e2e8f0';
            contentLabel.style.display = 'block';
            contentLabel.style.marginBottom = '5px';

            const contentInput = document.createElement('textarea');
            contentInput.value = initialContent;
            contentInput.style.width = '100%';
            contentInput.style.padding = '8px 12px';
            contentInput.style.borderRadius = '6px';
            contentInput.style.border = '1px solid #4a5568';
            contentInput.style.backgroundColor = '#3f495e';
            contentInput.style.color = '#e2e8f0';
            contentInput.style.fontSize = '14px';
            contentInput.style.minHeight = '100px';
            contentInput.style.resize = 'vertical';
            contentInput.style.marginBottom = '15px';
            contentInput.style.boxSizing = 'border-box';

            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.gap = '10px';
            buttonContainer.style.justifyContent = 'flex-end';

            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancel';
            cancelButton.style.padding = '8px 16px';
            cancelButton.style.borderRadius = '6px';
            cancelButton.style.border = '1px solid #4a5568';
            cancelButton.style.backgroundColor = '#4a5568';
            cancelButton.style.color = '#e2e8f0';
            cancelButton.style.cursor = 'pointer';

            const saveButton = document.createElement('button');
            saveButton.textContent = 'Save';
            saveButton.style.padding = '8px 16px';
            saveButton.style.borderRadius = '6px';
            saveButton.style.border = 'none';
            saveButton.style.backgroundColor = '#4299e1';
            saveButton.style.color = 'white';
            saveButton.style.cursor = 'pointer';

            cancelButton.onclick = () => {
                document.body.removeChild(modalOverlay);
                resolve(null);
            };

            saveButton.onclick = () => {
                const title = titleInput.value.trim();
                const content = contentInput.value.trim();
                if (title && content) {
                    document.body.removeChild(modalOverlay);
                    resolve({ title, content });
                } else {
                    if (!title) titleInput.style.border = '1px solid #f56565';
                    if (!content) contentInput.style.border = '1px solid #f56565';
                }
            };

            buttonContainer.appendChild(cancelButton);
            buttonContainer.appendChild(saveButton);

            modalContent.appendChild(titleElement);
            modalContent.appendChild(titleLabel);
            modalContent.appendChild(titleInput);
            modalContent.appendChild(contentLabel);
            modalContent.appendChild(contentInput);
            modalContent.appendChild(buttonContainer);
            modalOverlay.appendChild(modalContent);
            document.body.appendChild(modalOverlay);

            titleInput.focus();
        });
    }

    // Create floating window
    const floatingWindow = document.createElement('div');
    floatingWindow.style.position = 'fixed';
    floatingWindow.style.top = '50%';
    floatingWindow.style.right = '0';
    floatingWindow.style.transform = 'translateY(-50%)';
    floatingWindow.style.backgroundColor = '#2d3748';
    floatingWindow.style.color = '#e2e8f0';
    floatingWindow.style.borderRadius = '8px 0 0 8px';
    floatingWindow.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    floatingWindow.style.zIndex = '1000';
    floatingWindow.style.transition = 'all 0.3s ease';
    floatingWindow.style.cursor = 'pointer';

    // Collapsed label
    const collapsedLabel = document.createElement('div');
    collapsedLabel.textContent = '提示词助手';
    collapsedLabel.style.padding = '10px';
    collapsedLabel.style.writingMode = 'vertical-lr';
    collapsedLabel.style.textOrientation = 'upright';

    // Grid container
    const gridContainer = document.createElement('div');
    gridContainer.style.display = 'none';
    gridContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
    gridContainer.style.gap = '10px';
    gridContainer.style.padding = '15px';
    gridContainer.style.maxWidth = '400px';
    gridContainer.style.maxHeight = '80vh';
    gridContainer.style.overflowY = 'auto';

    // Load data
    let phrases = GM_getValue('phrases', []);

    // Update display
    function updateGrid() {
        gridContainer.innerHTML = '';

        const pinnedPhrases = phrases.filter(p => p.isPinned);
        const unpinnedPhrases = phrases.filter(p => !p.isPinned);
        const sortedPhrases = [...pinnedPhrases, ...unpinnedPhrases];

        sortedPhrases.forEach((phrase, index) => {
            const phraseBox = document.createElement('div');
            phraseBox.style.backgroundColor = '#3f495e';
            phraseBox.style.padding = '10px';
            phraseBox.style.borderRadius = '6px';
            phraseBox.style.position = 'relative';
            phraseBox.style.cursor = 'pointer';

            const title = document.createElement('div');
            title.textContent = phrase.title;
            title.style.marginRight = '25px';
            title.style.marginBottom = '20px'; // Add space for buttons

            // Container for action buttons
            const actionButtons = document.createElement('div');
            actionButtons.style.position = 'absolute';
            actionButtons.style.bottom = '5px';
            actionButtons.style.right = '5px';
            actionButtons.style.display = 'flex';
            actionButtons.style.gap = '5px';

            // Edit button
            const editButton = document.createElement('button');
            editButton.textContent = '✏️';
            editButton.style.border = 'none';
            editButton.style.backgroundColor = 'transparent';
            editButton.style.cursor = 'pointer';
            editButton.style.fontSize = '14px';

            // Delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '🗑️';
            deleteButton.style.border = 'none';
            deleteButton.style.backgroundColor = 'transparent';
            deleteButton.style.cursor = 'pointer';
            deleteButton.style.fontSize = '14px';

            // Pin button
            const pinButton = document.createElement('button');
            pinButton.textContent = phrase.isPinned ? '📌' : '📍';
            pinButton.style.position = 'absolute';
            pinButton.style.top = '5px';
            pinButton.style.right = '5px';
            pinButton.style.border = 'none';
            pinButton.style.backgroundColor = 'transparent';
            pinButton.style.cursor = 'pointer';
            pinButton.style.fontSize = '14px';

            // Edit functionality
            editButton.onclick = async (e) => {
                e.stopPropagation();
                const result = await createInputModal('edit', phrase.title, phrase.content);
                if (result) {
                    const index = phrases.findIndex(p =>
                        p.title === phrase.title && p.content === phrase.content
                    );
                    if (index !== -1) {
                        phrases[index] = { ...phrases[index], ...result };
                        savePhrases();
                        updateGrid();
                    }
                }
            };

            // Delete functionality
            deleteButton.onclick = async (e) => {
                e.stopPropagation();
                const confirmed = await createConfirmModal('Are you sure you want to delete this phrase?');
                if (confirmed) {
                    phrases = phrases.filter(p =>
                        !(p.title === phrase.title && p.content === phrase.content)
                    );
                    savePhrases();
                    updateGrid();
                }
            };

            pinButton.onclick = (e) => {
                e.stopPropagation();
                const phraseIndex = phrases.findIndex(p =>
                    p.title === phrase.title && p.content === phrase.content
                );

                if (phraseIndex !== -1) {
                    const updatedPhrase = {...phrases[phraseIndex]};

                    if (!updatedPhrase.isPinned) {
                        const lastPinnedIndex = phrases.map(p => p.isPinned).lastIndexOf(true);
                        updatedPhrase.isPinned = true;
                        phrases.splice(phraseIndex, 1);
                        phrases.splice(lastPinnedIndex + 1, 0, updatedPhrase);
                    } else {
                        updatedPhrase.isPinned = false;
                        const firstUnpinnedIndex = phrases.findIndex(p => !p.isPinned);
                        phrases.splice(phraseIndex, 1);
                        phrases.splice(firstUnpinnedIndex === -1 ? phrases.length : firstUnpinnedIndex, 0, updatedPhrase);
                    }

                    savePhrases();
                    updateGrid();
                }
            };

            phraseBox.onclick = () => {
                navigator.clipboard.writeText(phrase.content);
                showTooltip(phrase.content);
            };

            actionButtons.appendChild(editButton);
            actionButtons.appendChild(deleteButton);
            phraseBox.appendChild(title);
            phraseBox.appendChild(pinButton);
            phraseBox.appendChild(actionButtons);
            gridContainer.appendChild(phraseBox);
        });
    }

    // Save data
    function savePhrases() {
        GM_setValue('phrases', phrases);
    }

    // Add button
    const addButton = document.createElement('button');
    addButton.textContent = '+ Add New';
    addButton.style.width = '100%';
    addButton.style.backgroundColor = '#4299e1';
    addButton.style.color = 'white';
    addButton.style.border = 'none';
    addButton.style.padding = '8px';
    addButton.style.borderRadius = '6px';
    addButton.style.marginTop = '10px';
    addButton.style.cursor = 'pointer';
    addButton.style.display = 'none';

    addButton.onclick = async () => {
        const result = await createInputModal('add');
        if (result) {
            phrases.push({
                title: result.title,
                content: result.content,
                isPinned: false
            });
            savePhrases();
            updateGrid();
        }
    };

    // Show copy tooltip
    function showTooltip(text) {
        const tooltip = document.createElement('div');
        tooltip.textContent = 'Copied: ' + (text.length > 30 ? text.substring(0, 30) + '...' : text);
        tooltip.style.position = 'fixed';
        tooltip.style.top = '20px';
        tooltip.style.right = '20px';
        tooltip.style.backgroundColor = '#48bb78';
        tooltip.style.color = 'white';
        tooltip.style.padding = '8px 12px';
        tooltip.style.borderRadius = '6px';
        tooltip.style.zIndex = '1001';
        tooltip.style.animation = 'fadeInOut 2s ease-in-out';

        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateY(-20px); }
                10% { opacity: 1; transform: translateY(0); }
                90% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-20px); }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(tooltip);
        setTimeout(() => {
            document.body.removeChild(tooltip);
            document.head.removeChild(style);
        }, 2000);
    }

    // Add expand/collapse functionality
    let isExpanded = false;

    function toggleWindow() {
        if (isExpanded) {
            gridContainer.style.display = 'none';
            collapsedLabel.style.display = 'block';
            floatingWindow.style.width = 'auto';
            addButton.style.display = 'none';
        } else {
            gridContainer.style.display = 'grid';
            collapsedLabel.style.display = 'none';
            floatingWindow.style.width = '400px';
            addButton.style.display = 'block';
        }
        isExpanded = !isExpanded;
    }

    floatingWindow.onmouseenter = () => {
        if (!isExpanded) toggleWindow();
    };

    floatingWindow.onmouseleave = () => {
        if (isExpanded) toggleWindow();
    };

    // Assemble interface
    floatingWindow.appendChild(collapsedLabel);
    floatingWindow.appendChild(gridContainer);
    floatingWindow.appendChild(addButton);
    document.body.appendChild(floatingWindow);

    // Initialize display
    updateGrid();
})();