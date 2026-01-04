// ==UserScript==
// @name         F95 Tag Filter
// @namespace    http://tampermonkey.net/
// @version      4.6
// @description  Advanced tag filtering for F95zone with liked/disliked/hated tags and status filtering
// @author       Tsmox
// @match        https://f95zone.to/sam/latest_alpha/*
// @icon         https://f95zone.to/favicon.ico
// @license      GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531531/F95%20Tag%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/531531/F95%20Tag%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default styles with proper opacity values
    const defaultStyles = {
        likedColor: '#4CAF50',
        likedOpacity: 0.7,
        dislikedColor: '#ec5555',
        dislikedOpacity: 0.7,
        bothColor: '#FFA500',
        bothOpacity: 0.7,
        mostlyLikedColor: '#2E7D32',
        mostlyLikedOpacity: 0.7,
        mostlyDislikedColor: '#C62828',
        mostlyDislikedOpacity: 0.7,
        dislikedElementOpacity: 1.0,
        abandonedOpacity: 1.0,
        completedOpacity: 1.0,
        onHoldOpacity: 1.0,
        hatedElementOpacity: 0.3,
        hideAbandoned: false,
        hideCompleted: false,
        hideOnHold: false
    };

    // Load and validate styles
    let styles = JSON.parse(localStorage.getItem('tagWatcherStyles')) || {...defaultStyles};
    styles = {
        ...defaultStyles,
        ...styles,
        likedOpacity: clampOpacity(styles.likedOpacity),
        dislikedOpacity: clampOpacity(styles.dislikedOpacity),
        bothOpacity: clampOpacity(styles.bothOpacity),
        mostlyLikedOpacity: clampOpacity(styles.mostlyLikedOpacity),
        mostlyDislikedOpacity: clampOpacity(styles.mostlyDislikedOpacity),
        dislikedElementOpacity: clampOpacity(styles.dislikedElementOpacity),
        abandonedOpacity: clampOpacity(styles.abandonedOpacity),
        completedOpacity: clampOpacity(styles.completedOpacity),
        onHoldOpacity: clampOpacity(styles.onHoldOpacity),
        hatedElementOpacity: clampOpacity(styles.hatedElementOpacity),
        hideAbandoned: Boolean(styles.hideAbandoned),
        hideCompleted: Boolean(styles.hideCompleted),
        hideOnHold: Boolean(styles.hideOnHold)
    };

    // Helper functions
    function clampOpacity(value) {
        const num = parseFloat(value);
        return isNaN(num) ? 0.7 : Math.min(1, Math.max(0, num));
    }

    function hexToRgba(hex, opacity) {
        opacity = clampOpacity(opacity);
        hex = hex.replace('#', '');

        let r = 255, g = 255, b = 255;
        if (hex.length === 3) {
            r = parseInt(hex[0] + hex[0], 16);
            g = parseInt(hex[1] + hex[1], 16);
            b = parseInt(hex[2] + hex[2], 16);
        } else if (hex.length === 6) {
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        }
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    // Extract tags from the script in the HTML
    const scriptContent = document.querySelector('body script')?.textContent;
    if (!scriptContent) {
        console.error('Could not find script containing tags.');
        return;
    }

    const tagsMatch = scriptContent.match(/"tags":(\{.*?\})/);
    if (!tagsMatch) {
        console.error('Could not extract tags from script.');
        return;
    }

    const tags = JSON.parse(tagsMatch[1]);

    // Load watched tags from localStorage
    let likedTags = new Set();
    let dislikedTags = new Set();
    let hatedTags = new Set();
    const storedLikedTags = localStorage.getItem('likedTags');
    const storedDislikedTags = localStorage.getItem('dislikedTags');
    const storedHatedTags = localStorage.getItem('hatedTags');

    if (storedLikedTags) {
        try {
            const parsedTags = JSON.parse(storedLikedTags);
            if (Array.isArray(parsedTags)) {
                likedTags = new Set(parsedTags);
            }
        } catch (e) {
            console.error('Failed to parse stored liked tags:', e);
        }
    }

    if (storedDislikedTags) {
        try {
            const parsedTags = JSON.parse(storedDislikedTags);
            if (Array.isArray(parsedTags)) {
                dislikedTags = new Set(parsedTags);
            }
        } catch (e) {
            console.error('Failed to parse stored disliked tags:', e);
        }
    }

    if (storedHatedTags) {
        try {
            const parsedTags = JSON.parse(storedHatedTags);
            if (Array.isArray(parsedTags)) {
                hatedTags = new Set(parsedTags);
            }
        } catch (e) {
            console.error('Failed to parse stored hated tags:', e);
        }
    }

    // Create the button and menu
    function createMenu() {
        const button = document.createElement('a');
        button.className = 'p-navEl';
        button.href = '#';
        button.textContent = 'Tag Watcher';
        button.style.marginLeft = '10px';
        button.style.cursor = 'pointer';

        const targetButton = document.querySelector('.p-nav-list > li:nth-child(4) > div:nth-child(1) > a:nth-child(2)');
        if (targetButton) {
            targetButton.parentNode.insertBefore(button, targetButton.nextSibling);
        } else {
            const navList = document.querySelector('.p-nav-list');
            if (navList) {
                navList.appendChild(button);
            } else {
                console.error('Could not find navigation bar to append the button.');
                return;
            }
        }

        const menu = document.createElement('div');
        menu.style.position = 'fixed';
        menu.style.backgroundColor = '#242629';
        menu.style.border = '1px solid rgba(255, 255, 255, 0.12)';
        menu.style.borderRadius = '3px';
        menu.style.padding = '10px';
        menu.style.zIndex = '10000';
        menu.style.display = 'none';
        menu.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        menu.style.width = '350px';

        // Function to update menu position
        function updateMenuPosition() {
            if (menu.style.display === 'block') {
                const rect = button.getBoundingClientRect();
                menu.style.top = `${rect.bottom}px`;
                menu.style.left = `${rect.left}px`;
            }
        }

        window.addEventListener('scroll', throttle(updateMenuPosition, 100));
        window.addEventListener('resize', throttle(updateMenuPosition, 100));

        button.addEventListener('click', (e) => {
            e.preventDefault();
            updateMenuPosition();
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
            updateWatchedTagsDisplay();
            updateButtonStates();
        });

        // Create tab container
        const tabContainer = document.createElement('div');
        tabContainer.style.display = 'flex';
        tabContainer.style.marginBottom = '10px';
        tabContainer.style.borderBottom = '1px solid rgba(255, 255, 255, 0.12)';

        // Create tabs
        const tagsTab = document.createElement('div');
        tagsTab.textContent = 'Tags';
        tagsTab.style.padding = '5px 10px';
        tagsTab.style.cursor = 'pointer';
        tagsTab.style.borderBottom = '2px solid ' + styles.likedColor;
        tagsTab.style.fontWeight = 'bold';

        const styleTab = document.createElement('div');
        styleTab.textContent = 'Style';
        styleTab.style.padding = '5px 10px';
        styleTab.style.cursor = 'pointer';
        styleTab.style.marginLeft = '5px';
        styleTab.style.opacity = '0.7';

        const filterTab = document.createElement('div');
        filterTab.textContent = 'Filters';
        filterTab.style.padding = '5px 10px';
        filterTab.style.cursor = 'pointer';
        filterTab.style.marginLeft = '5px';
        filterTab.style.opacity = '0.7';

        // Create content containers
        const tagsContent = document.createElement('div');
        tagsContent.style.display = 'block';

        const styleContent = document.createElement('div');
        styleContent.style.display = 'none';

        const filterContent = document.createElement('div');
        filterContent.style.display = 'none';

        // Tab switching functionality
        const switchToTab = (tabName) => {
            [tagsTab, styleTab, filterTab].forEach(tab => {
                tab.style.borderBottom = 'none';
                tab.style.fontWeight = 'normal';
                tab.style.opacity = '0.7';
            });

            [tagsContent, styleContent, filterContent].forEach(content => {
                content.style.display = 'none';
            });

            if (tabName === 'tags') {
                tagsTab.style.borderBottom = '2px solid ' + styles.likedColor;
                tagsTab.style.fontWeight = 'bold';
                tagsTab.style.opacity = '1';
                tagsContent.style.display = 'block';
            } else if (tabName === 'style') {
                styleTab.style.borderBottom = '2px solid ' + styles.likedColor;
                styleTab.style.fontWeight = 'bold';
                styleTab.style.opacity = '1';
                styleContent.style.display = 'block';
            } else if (tabName === 'filter') {
                filterTab.style.borderBottom = '2px solid ' + styles.likedColor;
                filterTab.style.fontWeight = 'bold';
                filterTab.style.opacity = '1';
                filterContent.style.display = 'block';
            }
        };

        tagsTab.addEventListener('click', () => switchToTab('tags'));
        styleTab.addEventListener('click', () => switchToTab('style'));
        filterTab.addEventListener('click', () => switchToTab('filter'));

        // Add tabs to container
        tabContainer.appendChild(tagsTab);
        tabContainer.appendChild(styleTab);
        tabContainer.appendChild(filterTab);

        // Tags tab content
        const tagSelect = document.createElement('select');
        tagSelect.style.backgroundColor = '#181a1d';
        tagSelect.style.color = '#eeeeee';
        tagSelect.style.border = '1px solid rgba(255, 255, 255, 0.12)';
        tagSelect.style.borderRadius = '3px';
        tagSelect.style.padding = '6px';
        tagSelect.style.marginBottom = '10px';
        tagSelect.style.width = '100%';

        const sortedTags = Object.entries(tags).sort((a, b) => a[1].localeCompare(b[1]));
        sortedTags.forEach(([id, name]) => {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = name;
            tagSelect.appendChild(option);
        });

        const addLikedButton = document.createElement('button');
        addLikedButton.textContent = 'Add Liked Tag';
        addLikedButton.style.backgroundColor = styles.likedColor;
        addLikedButton.style.color = '#fff';
        addLikedButton.style.border = 'none';
        addLikedButton.style.borderRadius = '3px';
        addLikedButton.style.padding = '6px 12px';
        addLikedButton.style.cursor = 'pointer';
        addLikedButton.style.marginBottom = '10px';

        const addDislikedButton = document.createElement('button');
        addDislikedButton.textContent = 'Add Disliked Tag';
        addDislikedButton.style.backgroundColor = styles.dislikedColor;
        addDislikedButton.style.color = '#fff';
        addDislikedButton.style.border = 'none';
        addDislikedButton.style.borderRadius = '3px';
        addDislikedButton.style.padding = '6px 12px';
        addDislikedButton.style.cursor = 'pointer';
        addDislikedButton.style.marginBottom = '10px';

        const addHatedButton = document.createElement('button');
        addHatedButton.textContent = 'Add Hated Tag';
        addHatedButton.style.backgroundColor = '#333';
        addHatedButton.style.color = '#fff';
        addHatedButton.style.border = 'none';
        addHatedButton.style.borderRadius = '3px';
        addHatedButton.style.padding = '6px 12px';
        addHatedButton.style.cursor = 'pointer';
        addHatedButton.style.marginBottom = '10px';

        // Function to update button states
        function updateButtonStates() {
            const selectedTagId = tagSelect.value;
            addLikedButton.disabled = dislikedTags.has(selectedTagId) || hatedTags.has(selectedTagId);
            addDislikedButton.disabled = likedTags.has(selectedTagId) || hatedTags.has(selectedTagId);
            addHatedButton.disabled = likedTags.has(selectedTagId) || dislikedTags.has(selectedTagId);

            // Visual feedback for disabled buttons
            [addLikedButton, addDislikedButton, addHatedButton].forEach(btn => {
                if (btn.disabled) {
                    btn.style.opacity = '0.5';
                    btn.style.cursor = 'not-allowed';
                } else {
                    btn.style.opacity = '1';
                    btn.style.cursor = 'pointer';
                }
            });
        }

        // Add event listeners for buttons
        addLikedButton.addEventListener('click', () => {
            const selectedTagId = tagSelect.value;
            if (!likedTags.has(selectedTagId)) {
                // Remove from disliked/hated if they're there
                if (dislikedTags.has(selectedTagId)) {
                    dislikedTags.delete(selectedTagId);
                    saveDislikedTags();
                }
                if (hatedTags.has(selectedTagId)) {
                    hatedTags.delete(selectedTagId);
                    saveHatedTags();
                }
                likedTags.add(selectedTagId);
                saveLikedTags();
                updateWatchedTagsDisplay();
                highlightTags();
                updateButtonStates();
            }
        });

        addDislikedButton.addEventListener('click', () => {
            const selectedTagId = tagSelect.value;
            if (!dislikedTags.has(selectedTagId)) {
                // Remove from liked/hated if they're there
                if (likedTags.has(selectedTagId)) {
                    likedTags.delete(selectedTagId);
                    saveLikedTags();
                }
                if (hatedTags.has(selectedTagId)) {
                    hatedTags.delete(selectedTagId);
                    saveHatedTags();
                }
                dislikedTags.add(selectedTagId);
                saveDislikedTags();
                updateWatchedTagsDisplay();
                highlightTags();
                updateButtonStates();
            }
        });

        addHatedButton.addEventListener('click', () => {
            const selectedTagId = tagSelect.value;
            if (!hatedTags.has(selectedTagId)) {
                // Remove from liked/disliked if they're there
                if (likedTags.has(selectedTagId)) {
                    likedTags.delete(selectedTagId);
                    saveLikedTags();
                }
                if (dislikedTags.has(selectedTagId)) {
                    dislikedTags.delete(selectedTagId);
                    saveDislikedTags();
                }
                hatedTags.add(selectedTagId);
                saveHatedTags();
                updateWatchedTagsDisplay();
                highlightTags();
                updateButtonStates();
            }
        });

        // Update button states when tag selection changes
        tagSelect.addEventListener('change', updateButtonStates);

        const watchedTagsDisplay = document.createElement('div');
        watchedTagsDisplay.className = 'watched-tags';
        watchedTagsDisplay.style.maxHeight = '200px';
        watchedTagsDisplay.style.overflowY = 'auto';

        // Style tab content
        const styleForm = document.createElement('div');
        styleForm.style.display = 'flex';
        styleForm.style.flexDirection = 'column';
        styleForm.style.gap = '10px';

        function createColorInput(label, property, defaultValue) {
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.justifyContent = 'space-between';

            const labelElement = document.createElement('label');
            labelElement.textContent = label;
            labelElement.style.color = '#eeeeee';
            labelElement.style.marginRight = '10px';

            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.value = styles[property] || defaultValue;
            colorInput.style.width = '60px';
            colorInput.style.height = '30px';
            colorInput.style.cursor = 'pointer';
            colorInput.style.border = 'none';
            colorInput.style.outline = 'none';
            colorInput.style.padding = '0';
            colorInput.style.backgroundColor = 'transparent';

            const opacityInput = document.createElement('input');
            opacityInput.type = 'range';
            opacityInput.min = '0';
            opacityInput.max = '1';
            opacityInput.step = '0.1';
            opacityInput.value = styles[`${property}Opacity`] || '0.7';
            opacityInput.style.width = '100px';
            opacityInput.style.cursor = 'pointer';

            const opacityValue = document.createElement('span');
            opacityValue.textContent = opacityInput.value;
            opacityValue.style.color = '#eeeeee';
            opacityValue.style.width = '30px';
            opacityValue.style.textAlign = 'center';

            opacityInput.addEventListener('input', () => {
                opacityValue.textContent = opacityInput.value;
            });

            container.appendChild(labelElement);
            container.appendChild(colorInput);
            container.appendChild(opacityInput);
            container.appendChild(opacityValue);

            return { container, colorInput, opacityInput };
        }

        const likedColorInput = createColorInput('Liked Color:', 'likedColor', defaultStyles.likedColor);
        const dislikedColorInput = createColorInput('Disliked Color:', 'dislikedColor', defaultStyles.dislikedColor);
        const bothColorInput = createColorInput('Both Color:', 'bothColor', defaultStyles.bothColor);
        const mostlyLikedColorInput = createColorInput('Mostly Liked:', 'mostlyLikedColor', defaultStyles.mostlyLikedColor);
        const mostlyDislikedColorInput = createColorInput('Mostly Disliked:', 'mostlyDislikedColor', defaultStyles.mostlyDislikedColor);

        function createOpacityControl(label, property, defaultValue) {
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.justifyContent = 'space-between';

            const labelElement = document.createElement('label');
            labelElement.textContent = label;
            labelElement.style.color = '#eeeeee';
            labelElement.style.marginRight = '10px';

            const opacityInput = document.createElement('input');
            opacityInput.type = 'range';
            opacityInput.min = '0';
            opacityInput.max = '1';
            opacityInput.step = '0.1';
            opacityInput.value = styles[property] || defaultValue;
            opacityInput.style.width = '100px';
            opacityInput.style.cursor = 'pointer';

            const opacityValue = document.createElement('span');
            opacityValue.textContent = opacityInput.value;
            opacityValue.style.color = '#eeeeee';
            opacityValue.style.width = '30px';
            opacityValue.style.textAlign = 'center';

            opacityInput.addEventListener('input', () => {
                opacityValue.textContent = opacityInput.value;
            });

            container.appendChild(labelElement);
            container.appendChild(opacityInput);
            container.appendChild(opacityValue);

            return { container, opacityInput };
        }

        const dislikedElementOpacity = createOpacityControl('Disliked Opacity:', 'dislikedElementOpacity', defaultStyles.dislikedElementOpacity);
        const abandonedOpacity = createOpacityControl('Abandoned Opacity:', 'abandonedOpacity', defaultStyles.abandonedOpacity);
        const completedOpacity = createOpacityControl('Completed Opacity:', 'completedOpacity', defaultStyles.completedOpacity);
        const onHoldOpacity = createOpacityControl('Onhold Opacity:', 'onHoldOpacity', defaultStyles.onHoldOpacity);
        const hatedElementOpacity = createOpacityControl('Hated Opacity:', 'hatedElementOpacity', defaultStyles.hatedElementOpacity);

        styleForm.appendChild(likedColorInput.container);
        styleForm.appendChild(dislikedColorInput.container);
        styleForm.appendChild(bothColorInput.container);
        styleForm.appendChild(mostlyLikedColorInput.container);
        styleForm.appendChild(mostlyDislikedColorInput.container);
        styleForm.appendChild(dislikedElementOpacity.container);
        styleForm.appendChild(abandonedOpacity.container);
        styleForm.appendChild(completedOpacity.container);
        styleForm.appendChild(onHoldOpacity.container);
        styleForm.appendChild(hatedElementOpacity.container);

        const saveStyleButton = document.createElement('button');
        saveStyleButton.textContent = 'Save Styles';
        saveStyleButton.style.backgroundColor = styles.likedColor;
        saveStyleButton.style.color = '#fff';
        saveStyleButton.style.border = 'none';
        saveStyleButton.style.borderRadius = '3px';
        saveStyleButton.style.padding = '8px 12px';
        saveStyleButton.style.cursor = 'pointer';
        saveStyleButton.style.marginTop = '10px';

        saveStyleButton.addEventListener('click', () => {
            styles = {
                likedColor: likedColorInput.colorInput.value,
                likedOpacity: parseFloat(likedColorInput.opacityInput.value),
                dislikedColor: dislikedColorInput.colorInput.value,
                dislikedOpacity: parseFloat(dislikedColorInput.opacityInput.value),
                bothColor: bothColorInput.colorInput.value,
                bothOpacity: parseFloat(bothColorInput.opacityInput.value),
                mostlyLikedColor: mostlyLikedColorInput.colorInput.value,
                mostlyLikedOpacity: parseFloat(mostlyLikedColorInput.opacityInput.value),
                mostlyDislikedColor: mostlyDislikedColorInput.colorInput.value,
                mostlyDislikedOpacity: parseFloat(mostlyDislikedColorInput.opacityInput.value),
                dislikedElementOpacity: parseFloat(dislikedElementOpacity.opacityInput.value),
                abandonedOpacity: parseFloat(abandonedOpacity.opacityInput.value),
                completedOpacity: parseFloat(completedOpacity.opacityInput.value),
                onHoldOpacity: parseFloat(onHoldOpacity.opacityInput.value),
                hatedElementOpacity: parseFloat(hatedElementOpacity.opacityInput.value),
                hideAbandoned: styles.hideAbandoned,
                hideCompleted: styles.hideCompleted,
                hideOnHold: styles.hideOnHold
            };
            localStorage.setItem('tagWatcherStyles', JSON.stringify(styles));

            // Update button colors
            addLikedButton.style.backgroundColor = styles.likedColor;
            addDislikedButton.style.backgroundColor = styles.dislikedColor;
            saveStyleButton.style.backgroundColor = styles.likedColor;
            tagsTab.style.borderBottom = '2px solid ' + styles.likedColor;

            highlightTags();
            updateWatchedTagsDisplay();
        });

        styleContent.appendChild(styleForm);
        styleContent.appendChild(saveStyleButton);

        // Filter tab content
        const filterForm = document.createElement('div');
        filterForm.style.display = 'flex';
        filterForm.style.flexDirection = 'column';
        filterForm.style.gap = '10px';

        // Abandoned filter
        const abandonedFilterContainer = document.createElement('div');
        abandonedFilterContainer.style.display = 'flex';
        abandonedFilterContainer.style.alignItems = 'center';
        abandonedFilterContainer.style.justifyContent = 'space-between';

        const abandonedFilterLabel = document.createElement('label');
        abandonedFilterLabel.textContent = 'Hide Abandoned:';
        abandonedFilterLabel.style.color = '#eeeeee';
        abandonedFilterLabel.style.marginRight = '10px';

        const abandonedFilterCheckbox = document.createElement('input');
        abandonedFilterCheckbox.type = 'checkbox';
        abandonedFilterCheckbox.checked = styles.hideAbandoned;
        abandonedFilterCheckbox.style.cursor = 'pointer';

        abandonedFilterContainer.appendChild(abandonedFilterLabel);
        abandonedFilterContainer.appendChild(abandonedFilterCheckbox);

        // Completed filter
        const completedFilterContainer = document.createElement('div');
        completedFilterContainer.style.display = 'flex';
        completedFilterContainer.style.alignItems = 'center';
        completedFilterContainer.style.justifyContent = 'space-between';

        const completedFilterLabel = document.createElement('label');
        completedFilterLabel.textContent = 'Hide Completed:';
        completedFilterLabel.style.color = '#eeeeee';
        completedFilterLabel.style.marginRight = '10px';

        const completedFilterCheckbox = document.createElement('input');
        completedFilterCheckbox.type = 'checkbox';
        completedFilterCheckbox.checked = styles.hideCompleted;
        completedFilterCheckbox.style.cursor = 'pointer';

        completedFilterContainer.appendChild(completedFilterLabel);
        completedFilterContainer.appendChild(completedFilterCheckbox);

        // Onhold filter
        const onHoldFilterContainer = document.createElement('div');
        onHoldFilterContainer.style.display = 'flex';
        onHoldFilterContainer.style.alignItems = 'center';
        onHoldFilterContainer.style.justifyContent = 'space-between';

        const onHoldFilterLabel = document.createElement('label');
        onHoldFilterLabel.textContent = 'Hide Onhold:';
        onHoldFilterLabel.style.color = '#eeeeee';
        onHoldFilterLabel.style.marginRight = '10px';

        const onHoldFilterCheckbox = document.createElement('input');
        onHoldFilterCheckbox.type = 'checkbox';
        onHoldFilterCheckbox.checked = styles.hideOnHold;
        onHoldFilterCheckbox.style.cursor = 'pointer';

        onHoldFilterContainer.appendChild(onHoldFilterLabel);
        onHoldFilterContainer.appendChild(onHoldFilterCheckbox);

        const saveFilterButton = document.createElement('button');
        saveFilterButton.textContent = 'Save Filters';
        saveFilterButton.style.backgroundColor = styles.likedColor;
        saveFilterButton.style.color = '#fff';
        saveFilterButton.style.border = 'none';
        saveFilterButton.style.borderRadius = '3px';
        saveFilterButton.style.padding = '8px 12px';
        saveFilterButton.style.cursor = 'pointer';
        saveFilterButton.style.marginTop = '10px';

        saveFilterButton.addEventListener('click', () => {
            styles.hideAbandoned = abandonedFilterCheckbox.checked;
            styles.hideCompleted = completedFilterCheckbox.checked;
            styles.hideOnHold = onHoldFilterCheckbox.checked;
            localStorage.setItem('tagWatcherStyles', JSON.stringify(styles));
            highlightTags();
        });

        filterForm.appendChild(abandonedFilterContainer);
        filterForm.appendChild(completedFilterContainer);
        filterForm.appendChild(onHoldFilterContainer);
        filterForm.appendChild(saveFilterButton);

        filterContent.appendChild(filterForm);

        function createTagElement(tagId, type) {
            const tagDiv = document.createElement('div');
            tagDiv.style.display = 'flex';
            tagDiv.style.justifyContent = 'space-between';
            tagDiv.style.alignItems = 'center';
            tagDiv.style.marginBottom = '5px';
            tagDiv.style.padding = '2px 5px';
            tagDiv.style.borderRadius = '3px';

            const tagName = document.createElement('span');
            tagName.textContent = tags[tagId];

            // Set color based on type
            if (type === 'liked') {
                tagName.style.color = styles.likedColor;
            } else if (type === 'disliked') {
                tagName.style.color = styles.dislikedColor;
            } else if (type === 'hated') {
                tagName.style.color = '#999';
            }

            tagName.style.padding = '2px 5px';
            tagName.style.borderRadius = '3px';
            tagName.style.flexGrow = '1';

            const removeButton = document.createElement('button');
            removeButton.textContent = '×';
            removeButton.style.backgroundColor = 'transparent';
            removeButton.style.color = '#fff';
            removeButton.style.border = 'none';
            removeButton.style.borderRadius = '3px';
            removeButton.style.padding = '2px 5px';
            removeButton.style.cursor = 'pointer';
            removeButton.style.marginLeft = '5px';
            removeButton.style.fontWeight = 'bold';

            removeButton.addEventListener('click', () => {
                if (type === 'liked') {
                    likedTags.delete(tagId);
                    saveLikedTags();
                } else if (type === 'disliked') {
                    dislikedTags.delete(tagId);
                    saveDislikedTags();
                } else if (type === 'hated') {
                    hatedTags.delete(tagId);
                    saveHatedTags();
                }
                updateWatchedTagsDisplay();
                highlightTags();
                updateButtonStates();
            });

            tagDiv.appendChild(tagName);
            tagDiv.appendChild(removeButton);
            return tagDiv;
        }

        function updateWatchedTagsDisplay() {
            watchedTagsDisplay.innerHTML = '';

            if (likedTags.size > 0) {
                const likedHeader = document.createElement('h4');
                likedHeader.textContent = 'Liked Tags:';
                likedHeader.style.margin = '5px 0';
                likedHeader.style.color = styles.likedColor;
                watchedTagsDisplay.appendChild(likedHeader);

                likedTags.forEach(tagId => {
                    watchedTagsDisplay.appendChild(createTagElement(tagId, 'liked'));
                });
            }

            if (dislikedTags.size > 0) {
                const dislikedHeader = document.createElement('h4');
                dislikedHeader.textContent = 'Disliked Tags:';
                dislikedHeader.style.margin = '5px 0';
                dislikedHeader.style.color = styles.dislikedColor;
                watchedTagsDisplay.appendChild(dislikedHeader);

                dislikedTags.forEach(tagId => {
                    watchedTagsDisplay.appendChild(createTagElement(tagId, 'disliked'));
                });
            }

            if (hatedTags.size > 0) {
                const hatedHeader = document.createElement('h4');
                hatedHeader.textContent = 'Hated Tags:';
                hatedHeader.style.margin = '5px 0';
                hatedHeader.style.color = '#999';
                watchedTagsDisplay.appendChild(hatedHeader);

                hatedTags.forEach(tagId => {
                    watchedTagsDisplay.appendChild(createTagElement(tagId, 'hated'));
                });
            }

            if (likedTags.size === 0 && dislikedTags.size === 0 && hatedTags.size === 0) {
                const noTagsMessage = document.createElement('div');
                noTagsMessage.textContent = 'No tags being watched';
                noTagsMessage.style.color = '#aaa';
                noTagsMessage.style.textAlign = 'center';
                noTagsMessage.style.padding = '10px';
                watchedTagsDisplay.appendChild(noTagsMessage);
            }
        }

        function saveLikedTags() {
            localStorage.setItem('likedTags', JSON.stringify([...likedTags]));
        }

        function saveDislikedTags() {
            localStorage.setItem('dislikedTags', JSON.stringify([...dislikedTags]));
        }

        function saveHatedTags() {
            localStorage.setItem('hatedTags', JSON.stringify([...hatedTags]));
        }

        // Add elements to their respective containers
        tagsContent.appendChild(tagSelect);
        tagsContent.appendChild(addLikedButton);
        tagsContent.appendChild(addDislikedButton);
        tagsContent.appendChild(addHatedButton);
        tagsContent.appendChild(watchedTagsDisplay);

        // Add all to menu
        menu.appendChild(tabContainer);
        menu.appendChild(tagsContent);
        menu.appendChild(styleContent);
        menu.appendChild(filterContent);
        document.body.appendChild(menu);

        // Initialize
        updateWatchedTagsDisplay();
        updateButtonStates();
    }

    function highlightTags() {
        const resourceTiles = document.querySelectorAll('div.resource-tile');
        resourceTiles.forEach((tile) => {
            // Check status first
            const statusLabel = tile.querySelector('.resource-tile_label-wrap_right');
            let statusOpacity = 1.0;
            let shouldHide = false;

            if (statusLabel) {
                const statusText = statusLabel.textContent.trim().toLowerCase();

                // Check for hidden statuses
                if (styles.hideAbandoned && statusText.includes('abandoned')) {
                    shouldHide = true;
                }
                else if (styles.hideCompleted && statusText.includes('completed')) {
                    shouldHide = true;
                }
                else if (styles.hideOnHold && statusText.includes('onhold')) {
                    shouldHide = true;
                }

                // Apply opacity for visible statuses
                if (!shouldHide) {
                    if (statusText.includes('abandoned')) {
                        statusOpacity = styles.abandonedOpacity;
                    }
                    else if (statusText.includes('completed')) {
                        statusOpacity = styles.completedOpacity;
                    }
                    else if (statusText.includes('onhold')) {
                        statusOpacity = styles.onHoldOpacity;
                    }
                }
            }

            if (shouldHide) {
                tile.style.display = 'none';
                return;
            } else {
                tile.style.display = '';
            }

            const tileTags = tile.getAttribute('data-tags');
            if (tileTags) {
                const matchingLikedTags = Array.from(likedTags).filter(tagId => tileTags.split(',').includes(tagId));
                const matchingDislikedTags = Array.from(dislikedTags).filter(tagId => tileTags.split(',').includes(tagId));
                const matchingHatedTags = Array.from(hatedTags).filter(tagId => tileTags.split(',').includes(tagId));

                // Reset styles
                tile.style.border = '';
                tile.style.backgroundColor = '';
                tile.style.opacity = statusOpacity;
                const existingTagDisplay = tile.querySelector('.tag-display');
                if (existingTagDisplay) existingTagDisplay.remove();

                // Create tag display (we'll show all matching tags regardless of hated status)
                const tagDisplay = document.createElement('div');
                tagDisplay.className = 'tag-display';
                Object.assign(tagDisplay.style, {
                    position: 'absolute',
                    color: 'white',
                    padding: '2px 5px',
                    borderRadius: '3px',
                    fontSize: '12px',
                    zIndex: '16',
                    top: '2px',
                    right: '0px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-end',
                    alignContent: 'flex-start',
                    gap: '4px 2px',
                    lineHeight: '1.5'
                });

                // Add all matching tags to display
                const displayTags = [];

                if (matchingLikedTags.length > 0) {
                    displayTags.push(...matchingLikedTags.map(tagId =>
                        `<span style="background-color: ${hexToRgba(styles.likedColor, 0.8)}; padding: 2px 5px; border-radius: 3px;">${tags[tagId]}</span>`
                    ));
                }
                if (matchingDislikedTags.length > 0) {
                    displayTags.push(...matchingDislikedTags.map(tagId =>
                        `<span style="background-color: ${hexToRgba(styles.dislikedColor, 0.8)}; padding: 2px 5px; border-radius: 3px;">${tags[tagId]}</span>`
                    ));
                }
                if (matchingHatedTags.length > 0) {
                    displayTags.push(...matchingHatedTags.map(tagId =>
                        `<span style="background-color: rgba(100, 100, 100, 0.8); padding: 2px 5px; border-radius: 3px;">${tags[tagId]}</span>`
                    ));
                }

                tagDisplay.innerHTML = displayTags.map(tag => `<span style="white-space: nowrap;">${tag}</span>`).join('');
                tile.appendChild(tagDisplay);

                // Apply styling based on tag combinations
                if (matchingHatedTags.length > 0) {
                    // Hated tags take highest priority for opacity
                    tile.style.opacity = styles.hatedElementOpacity * statusOpacity;
                    tile.style.border = `2px solid rgba(150, 150, 150, ${styles.hatedElementOpacity})`;
                }
                else if (matchingLikedTags.length > 0 || matchingDislikedTags.length > 0) {
                    let highlightColor, backgroundColor, borderOpacity;

                    if (matchingLikedTags.length > 0 && matchingDislikedTags.length > 0) {
                        if (matchingLikedTags.length > matchingDislikedTags.length) {
                            // Mostly liked
                            highlightColor = styles.mostlyLikedColor;
                            backgroundColor = hexToRgba(styles.mostlyLikedColor, styles.mostlyLikedOpacity);
                            borderOpacity = styles.mostlyLikedOpacity;
                        } else if (matchingDislikedTags.length > matchingLikedTags.length) {
                            // Mostly disliked
                            highlightColor = styles.mostlyDislikedColor;
                            backgroundColor = hexToRgba(styles.mostlyDislikedColor, styles.mostlyDislikedOpacity);
                            borderOpacity = styles.mostlyDislikedOpacity;
                            tile.style.opacity = styles.dislikedElementOpacity * statusOpacity;
                        } else {
                            // Equal count - use both color
                            highlightColor = styles.bothColor;
                            backgroundColor = hexToRgba(styles.bothColor, styles.bothOpacity);
                            borderOpacity = styles.bothOpacity;
                        }
                    } else if (matchingLikedTags.length > 0) {
                        highlightColor = styles.likedColor;
                        backgroundColor = hexToRgba(styles.likedColor, styles.likedOpacity);
                        borderOpacity = styles.likedOpacity;
                    } else {
                        highlightColor = styles.dislikedColor;
                        backgroundColor = hexToRgba(styles.dislikedColor, styles.dislikedOpacity);
                        borderOpacity = styles.dislikedOpacity;
                        tile.style.opacity = styles.dislikedElementOpacity * statusOpacity;
                    }

                    tile.style.border = `2px solid ${hexToRgba(highlightColor, borderOpacity)}`;
                    tile.style.backgroundColor = backgroundColor;
                }
            } else {
                tile.style.border = '';
                tile.style.backgroundColor = '';
                tile.style.opacity = statusOpacity;
                const existingTagDisplay = tile.querySelector('.tag-display');
                if (existingTagDisplay) {
                    existingTagDisplay.remove();
                }
            }
        });
    }

    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    }

    const observer = new MutationObserver(
        throttle(() => {
            highlightTags();
        }, 500)
    );

    observer.observe(document.body, { childList: true, subtree: true });

    createMenu();
    highlightTags();
})();