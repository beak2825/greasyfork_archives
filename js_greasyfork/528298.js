// ==UserScript==
// @name         PteroSort Category
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  Pterodactyl server sorter with categories
// @homepage     https://github.com/Ricman-MC/PteroSort
// @author       Ricman
// @license      Apache 2.0
// @match        https://panel.your-server.eu/
// @match        https://panel.your-second-server.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528298/PteroSort%20Category.user.js
// @updateURL https://update.greasyfork.org/scripts/528298/PteroSort%20Category.meta.js
// ==/UserScript==

// IMPORTANT
// To make this script work on your Pterodactyl panel, you need to add the panel's full URL manually.
// Go to Tampermonkey dashboard → click the script name → Settings tab → look for Includes/Excludes → User matches → click Add...
// Then add the full HTTPS URL of your panel there (e.g., https://panel.your-server.eu/)
// You can add multiple panel URLs if needed.
// Script supports vanilla pterodactyl panel v.1.11.10 (its possible it will work on diferent versions not tested)
// IMPORTANT

// this script has some hardcoded parts it could break when update of pterodactyl panel comes



(function () {
    'use strict';

    const STORAGE_KEY_YOURS = 'ptero_server_order_yours_v2';
    const STORAGE_KEY_OTHERS = 'ptero_server_order_others_v2';
    const STORAGE_KEY_CATEGORIES_YOURS = 'ptero_categories_yours_v2';
    const STORAGE_KEY_CATEGORIES_OTHERS = 'ptero_categories_others_v2';
    const containerSelector = 'section > div';
    const serverSelector = '.DashboardContainer___StyledServerRow-sc-1topkxf-2';
    const categoryRowClass = 'dashboard-category-row';
    const categoryColorStripeClass = 'category-color-stripe';
    const collapsedCategoryClass = 'collapsed-category';
    const categoryStoragePrefix = 'category_';
    const toggleSelector = 'input[name="show_all_servers"]';
    const buttonContainerSelector = '.DashboardContainer___StyledDiv-sc-1topkxf-0';

    let dragLockEnabled = localStorage.getItem('dragLockEnabled') === 'true';
    let categories = [];

    function getStorageKey() {
        return document.querySelector(toggleSelector)?.checked ? STORAGE_KEY_OTHERS : STORAGE_KEY_YOURS;
    }

    function getCategoryStorageKey() {
        return document.querySelector(toggleSelector)?.checked ? STORAGE_KEY_CATEGORIES_OTHERS : STORAGE_KEY_CATEGORIES_YOURS;
    }

    function generateCategoryId() {
        return categoryStoragePrefix + Math.random().toString(36).substring(2, 15);
    }

    function saveCategories() {
        localStorage.setItem(getCategoryStorageKey(), JSON.stringify(categories));
    }

    function loadCategories() {
        categories = JSON.parse(localStorage.getItem(getCategoryStorageKey()) || '[]');
    }

    function saveOrder() {

        const container = document.querySelector(containerSelector);
        if (!container) return;

        const order = [];
        for (const child of container.children) {

            if (child.matches(serverSelector) && !child.classList.contains(categoryRowClass)) {
                order.push({ type: 'server', id: child.href.split('/').pop(), categoryId: child.dataset.categoryId || null });
            } else if (child.classList.contains(categoryRowClass)) {
                order.push({ type: 'category', id: child.dataset.categoryId });
            }
        }
        localStorage.setItem(getStorageKey(), JSON.stringify(order));
        saveCategories();
    }

    function loadOrder() {
        loadCategories();

        const savedOrder = JSON.parse(localStorage.getItem(getStorageKey()) || '[]');

        const container = document.querySelector(containerSelector);
        if (!container) return;

        const servers = Array.from(document.querySelectorAll(`${serverSelector}:not(.${categoryRowClass})`));
        const serverMap = new Map(servers.map(el => [el.href.split('/').pop(), el]));
        const categoryMap = new Map(categories.map(cat => [cat.id, cat]));

        const existingRows = container.querySelectorAll(`${serverSelector}, .${categoryRowClass}`);
        console.log(`PteroSort: Removing ${existingRows.length} existing server/category rows before loading.`);
        existingRows.forEach(row => row.remove());

        const placedServerIds = new Set();

        savedOrder.forEach(item => {
            if (item.type === 'server') {
                if (serverMap.has(item.id)) {
                    const serverElement = serverMap.get(item.id);
                    serverElement.dataset.categoryId = item.categoryId || '';
                    container.appendChild(serverElement);
                    placedServerIds.add(item.id);
                }
            } else if (item.type === 'category') {
                if (categoryMap.has(item.id)) {
                    container.appendChild(createCategoryElement(categoryMap.get(item.id)));
                }
            }
        });

        servers.forEach(serverElement => {
            const serverId = serverElement.href.split('/').pop();
            if (!placedServerIds.has(serverId)) {
                serverElement.dataset.categoryId = '';
                container.appendChild(serverElement);
            }
        });
    }

    function createCategoryElement(categoryData) {
        const categoryElement = document.createElement('a');

        categoryElement.className = `GreyRowBox-sc-1xo9c6v-0 ServerRow__StatusIndicatorBox-sc-1ibsw91-2 dyLna-D fRwFrz DashboardContainer___StyledServerRow-sc-1topkxf-2 jbVWLN ${categoryRowClass}`;

        categoryElement.draggable = !dragLockEnabled;
        categoryElement.dataset.categoryId = categoryData.id;
        categoryElement.style.marginTop = '8px';
        categoryElement.style.cursor = 'grab';

        categoryElement.innerHTML = `
            <div class="${categoryColorStripeClass}" style="background-color: ${categoryData.color};"></div>
            <div class="ServerRow___StyledDiv-sc-1ibsw91-3 ecJXa-d" style="margin-left: 20px; display:flex; align-items:center; justify-content: flex-start; flex-grow: 1;">
                <p class="ServerRow___StyledP-sc-1ibsw91-4 LWXmF" style="font-weight: bold;">${categoryData.name}</p>
            </div>
            <div class="ServerRow___StyledDiv4-sc-1ibsw91-10 gQExFz category-controls" style="justify-content: flex-end; margin-right: 10px; display:flex; align-items:center; flex-shrink: 0;">
                <div class="ServerRow___StyledDiv9-sc-1ibsw91-18 fZEUwy" style="align-items: center; display:flex;">
                     <div class="category-collapse-wrapper" style="padding: 5px; cursor: pointer; margin-left: 5px;">
                        <svg class="category-collapse-icon" viewBox="0 0 24 24" style="width: 1.5em; height: 1.5em; display: block; transition: transform 0.2s ease-in-out;">
                            <path fill="currentColor" d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
                        </svg>
                    </div>
                    <div class="ServerRow___StyledDiv10-sc-1ibsw91-19 juhRZD category-description-wrapper" style="align-items: center; display:flex;">
                        <p class="ServerRow__IconDescription-sc-1ibsw91-1 kVwOgb category-description" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; text-align: right; color: #a7b4c0; font-size: 0.9em;">${categoryData.description || ''}</p>
                    </div>
                </div>
            </div>
        `;

        const deleteButtonWrapper = document.createElement('div');
        deleteButtonWrapper.className = 'category-delete-wrapper';
        deleteButtonWrapper.style.justifyContent = 'flex-end';
        deleteButtonWrapper.style.marginLeft = '10px';
        deleteButtonWrapper.style.display = 'flex';
        deleteButtonWrapper.style.alignItems = 'center';
        deleteButtonWrapper.style.flexShrink = '0';

        const deleteButtonInner = document.createElement('div');
        deleteButtonInner.className = 'ServerRow___StyledDiv11-sc-1ibsw91-21 iELGrp';
        deleteButtonInner.style.backgroundColor = 'rgb(239, 68, 68)';
        deleteButtonInner.style.padding = '4px';
        deleteButtonInner.style.borderRadius = '4px';
        deleteButtonInner.style.cursor = 'pointer';
        deleteButtonInner.style.display = 'flex';
        deleteButtonInner.style.alignItems = 'center';
        deleteButtonInner.style.justifyContent = 'center';
        deleteButtonInner.title = 'Delete Category';

        const deleteIconDiv = document.createElement('div');
        deleteIconDiv.className = 'ServerRow___StyledDiv12-sc-1ibsw91-22';
        deleteIconDiv.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="18px" height="18px">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
        `;

        deleteButtonInner.appendChild(deleteIconDiv);
        deleteButtonWrapper.appendChild(deleteButtonInner);

        const controlsInnerContainer = categoryElement.querySelector('.ServerRow___StyledDiv9-sc-1ibsw91-18');
        if (controlsInnerContainer && controlsInnerContainer.parentNode) {

            controlsInnerContainer.parentNode.appendChild(deleteButtonWrapper);
        } else {
            console.error("PteroSort: Could not find controls container to append delete button.");
        }

        deleteButtonWrapper.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            deleteCategory(categoryData.id, categoryData.name);
        });

        categoryElement.addEventListener('click', (event) => {

            if (!event.target.closest('.category-collapse-wrapper') && !event.target.closest('.category-delete-wrapper')) {
                 event.preventDefault();
            }
        });

        const collapseWrapper = categoryElement.querySelector('.category-collapse-wrapper');
        const collapseIconSvg = categoryElement.querySelector('.category-collapse-icon');
        collapseWrapper.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            toggleCategoryCollapse(categoryElement, categoryData.id, collapseIconSvg);
        });

        if (categoryData.collapsed) {
            categoryElement.classList.add(collapsedCategoryClass);
            collapseCategoryVisual(categoryElement, collapseIconSvg);

        }

        return categoryElement;
    }

    function toggleCategoryCollapse(categoryElement, categoryId, collapseIcon) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        const isCollapsed = categoryElement.classList.contains(collapsedCategoryClass);
        const category = categories.find(cat => cat.id === categoryId);
        if (!category) return;

        if (isCollapsed) {
            expandCategoryVisual(categoryElement, collapseIcon);
            categoryElement.classList.remove(collapsedCategoryClass);
            category.collapsed = false;

            for (const child of container.children) {
                if (child.matches(serverSelector) && child.dataset.categoryId === categoryId) {
                    child.style.display = '';
                }
            }
        } else {
            collapseCategoryVisual(categoryElement, collapseIcon);
            categoryElement.classList.add(collapsedCategoryClass);
            category.collapsed = true;

            for (const child of container.children) {
                if (child.matches(serverSelector) && child.dataset.categoryId === categoryId) {
                    child.style.display = 'none';
                }
            }
        }
        saveCategories();
        fixSpacing();
    }

    function collapseCategoryVisual(categoryElement, collapseIcon) {
        if (collapseIcon) {
            collapseIcon.style.transform = 'rotate(-90deg)';
        }
    }

    function expandCategoryVisual(categoryElement, collapseIcon) {
        if (collapseIcon) {
            collapseIcon.style.transform = 'rotate(0deg)';
        }
    }

    function deleteCategory(categoryId, categoryName) {
        if (confirm(`Are you sure you want to delete the category "${categoryName}"?\nServers within it will become uncategorized.`)) {

            categories = categories.filter(cat => cat.id !== categoryId);

            const categoryElement = document.querySelector(`.${categoryRowClass}[data-category-id="${categoryId}"]`);
            if (categoryElement) categoryElement.remove();

            const serversToUnassign = document.querySelectorAll(`${serverSelector}[data-category-id="${categoryId}"]`);
            serversToUnassign.forEach(server => {
                delete server.dataset.categoryId;

                server.querySelector('.server-category-indicator')?.remove();
                server.style.marginLeft = '0px';
                server.style.display = '';
            });

            saveCategories();
            saveOrder();
            fixSpacing();
            enableDragAndDrop();
            console.log(`PteroSort: Deleted category ${categoryId}`);
        }
    }

    function enableDragAndDrop() {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        let dragged = null;
        let draggedType = null;

        function resetDragListeners(el) {
            el.removeEventListener('dragstart', handleDragStart);
            el.removeEventListener('dragover', handleDragOver);
            el.removeEventListener('drop', handleDrop);
            el.removeEventListener('dragend', handleDragEnd);
        }

        function addDragListeners(el, type) {
            el.addEventListener('dragstart', (e) => handleDragStart(e, type));
            el.addEventListener('dragover', handleDragOver);
            el.addEventListener('drop', handleDrop);
            el.addEventListener('dragend', handleDragEnd);
        }

        document.querySelectorAll(`${serverSelector}:not(.${categoryRowClass})`).forEach(el => {
            el.draggable = !dragLockEnabled;
            resetDragListeners(el);
            if (!dragLockEnabled) {
                addDragListeners(el, 'server');
            }
        });
        document.querySelectorAll(`.${categoryRowClass}`).forEach(el => {
            el.draggable = !dragLockEnabled;
            resetDragListeners(el);
            if (!dragLockEnabled) {
                addDragListeners(el, 'category');
            }
        });

        function handleDragStart(e, type) {
            if (dragLockEnabled) {
                e.preventDefault();
                return;
            }

            dragged = e.target.closest(`${serverSelector}, .${categoryRowClass}`);
            if (!dragged) return;

            draggedType = type;
            e.dataTransfer.effectAllowed = 'move';

            dragged.classList.add('dragging-active');

             try {
                e.dataTransfer.setData('text/plain', dragged.dataset.categoryId || dragged.href || 'dragged');
            } catch (err) {
                console.warn("Could not set drag data:", err);
            }

            if (draggedType === 'category' && !dragged.classList.contains(collapsedCategoryClass)) {

                 setTimeout(() => {
                    if (dragged && dragged.classList.contains('dragging-active')) {
                        dragged.dataset.wasExpandedBeforeDrag = 'true';

                        toggleCategoryCollapse(dragged, dragged.dataset.categoryId, dragged.querySelector('.category-collapse-icon'));
                    }
                 }, 0);
            }

        }

        function handleDragOver(e) {
            if (dragLockEnabled || !dragged) return;
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';

            const target = e.target.closest(`${serverSelector}, .${categoryRowClass}`);
            if (!target || target === dragged) return;

            const bounding = target.getBoundingClientRect();
            const offset = e.clientY - bounding.top;
            const middle = bounding.height / 2;

            let insertedElement = null;
            if (offset < middle) {
                insertedElement = target.parentNode.insertBefore(dragged, target);
            } else {
                insertedElement = target.parentNode.insertBefore(dragged, target.nextSibling);
            }

            if (draggedType === 'category' && insertedElement) {
                const container = insertedElement.parentNode;
                if (!container) return;

                const categoryId = insertedElement.dataset.categoryId;

                const serversToMove = Array.from(container.querySelectorAll(`${serverSelector}[data-category-id="${categoryId}"]`));

                let anchorElement = insertedElement;
                serversToMove.forEach(server => {

                    container.insertBefore(server, anchorElement.nextSibling);

                    anchorElement = server;
                });
            }
        }

        function handleDrop(e) {
            if (dragLockEnabled || !dragged) return;
            e.preventDefault();
            e.stopPropagation();

            const dropTarget = e.target.closest(`.${categoryRowClass}`);

             if (draggedType === 'server') {
                 let assignedCategoryId = '';
                 if (dropTarget && dropTarget !== dragged) {

                     assignedCategoryId = dropTarget.dataset.categoryId;
                 } else {

                     const previousElement = dragged.previousElementSibling;
                     if (previousElement) {
                         if (previousElement.classList.contains(categoryRowClass)) {

                             assignedCategoryId = previousElement.dataset.categoryId;
                         } else if (previousElement.matches(serverSelector) && previousElement.dataset.categoryId) {

                             assignedCategoryId = previousElement.dataset.categoryId;
                         }
                     }

                 }
                 dragged.dataset.categoryId = assignedCategoryId;
             }

             if (draggedType === 'category') {
                 const categoryId = dragged.dataset.categoryId;
                 const container = dragged.parentNode;
                 if (container && categoryId) {
                     const serversToMove = Array.from(container.querySelectorAll(`${serverSelector}[data-category-id="${categoryId}"]`));
                     let anchorElement = dragged;
                     serversToMove.forEach(server => {
                         container.insertBefore(server, anchorElement.nextSibling);
                         anchorElement = server;
                     });
                 }
             }

             if(dragged) {
                dragged.classList.remove('dragging-active');
             }

            saveOrder();
            fixSpacing();

        }

        function handleDragEnd(e) {
            console.log("PteroSort: Drag End");

            let categoryIdToExpand = null;
            let shouldExpandAfterDrag = false;

            if (dragged) {

                if (dragged.classList.contains(categoryRowClass) && dragged.dataset.wasExpandedBeforeDrag === 'true') {
                    shouldExpandAfterDrag = true;
                    categoryIdToExpand = dragged.dataset.categoryId;
                }
                dragged.classList.remove('dragging-active');
            }

            if (shouldExpandAfterDrag && categoryIdToExpand) {

                setTimeout(() => {

                    const finalDraggedElement = document.querySelector(`.${categoryRowClass}[data-category-id="${categoryIdToExpand}"]`);
                    if (finalDraggedElement) {
                        const container = finalDraggedElement.parentNode;
                        let needsFixSpacing = false;

                        const serversToMove = container ? Array.from(container.querySelectorAll(`${serverSelector}[data-category-id="${categoryIdToExpand}"]`)) : [];

                        if (container && serversToMove.length > 0) {

                            container.insertBefore(finalDraggedElement, serversToMove[0]);
                        }

                        if (finalDraggedElement.dataset.wasExpandedBeforeDrag === 'true') {
                            toggleCategoryCollapse(finalDraggedElement, finalDraggedElement.dataset.categoryId, finalDraggedElement.querySelector('.category-collapse-icon'));
                            delete finalDraggedElement.dataset.wasExpandedBeforeDrag;
                            needsFixSpacing = true;
                        }

                        if (needsFixSpacing) {
                            fixSpacing();
                        }
                        saveOrder(); //fixed saving after moving category
                    }
                }, 0);
            }

            dragged = null;
            draggedType = null;
        }
    }

    function fixSpacing() {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        for (const child of container.children) {
            child.style.marginTop = '8px';

            if (child.classList.contains(categoryRowClass)) {

                child.style.marginLeft = '0px';

                child.style.display = '';
                child.querySelector('.server-category-indicator')?.remove();

            } else if (child.matches(serverSelector)) {

                const categoryId = child.dataset.categoryId;
                let indicator = child.querySelector('.server-category-indicator');

                if (categoryId) {

                    const category = categories.find(cat => cat.id === categoryId);
                    child.style.marginLeft = '40px';

                    child.style.display = (category && category.collapsed) ? 'none' : '';

                    if (category) {
                        if (!indicator) {
                            indicator = document.createElement('div');
                            indicator.className = 'server-category-indicator';
                            child.prepend(indicator);
                        }
                        indicator.style.backgroundColor = category.color;
                        indicator.style.display = '';
                    } else {

                        if (indicator) indicator.remove();
                        child.style.marginLeft = '0px';
                        child.style.display = '';
                        delete child.dataset.categoryId;
                    }
                } else {

                    child.style.marginLeft = '0px';
                    child.style.display = '';

                    if (indicator) {
                        indicator.remove();
                    }
                }
            }
        }

        if (container.firstElementChild) {
            container.firstElementChild.style.marginTop = '0px';
        }
    }

    function createButtons() {
        const container = document.querySelector(buttonContainerSelector);
        const toggleSwitch = document.querySelector(toggleSelector);

        if (!container || !toggleSwitch) return;

        if (document.getElementById('categoryButton')) return;

        const buttonWrapper = document.createElement('div');
        buttonWrapper.style.display = 'flex';
        buttonWrapper.style.gap = '10px';

        buttonWrapper.style.float = 'right';

        const categoryButton = document.createElement('button');
        categoryButton.id = 'categoryButton';
        categoryButton.title = 'Create new category';
        categoryButton.style.cursor = 'pointer';
        categoryButton.style.padding = '5px 10px';
        categoryButton.style.color = 'rgb(16, 185, 129)';
        categoryButton.style.backgroundColor = 'transparent';
        categoryButton.style.border = '1px solid rgb(16, 185, 129)';
        categoryButton.style.borderRadius = '4px';
        categoryButton.style.fontWeight = 'bold';
        categoryButton.style.fontSize = '1.2em';
        categoryButton.innerText = '+';
        categoryButton.addEventListener('click', () => {
            openCategoryOverlay();
        });

        const lockButton = document.createElement('button');
        lockButton.id = 'lockDragButton';
        lockButton.title = 'Toggle drag lock';
        lockButton.style.padding = '5px 10px';
        lockButton.style.cursor = 'pointer';
        lockButton.innerText = dragLockEnabled ? '🔒' : '🔓';
        lockButton.addEventListener('click', () => {
            dragLockEnabled = !dragLockEnabled;
            localStorage.setItem('dragLockEnabled', dragLockEnabled);
            lockButton.innerText = dragLockEnabled ? '🔒' : '🔓';

            enableDragAndDrop();
        });

        const settingsButton = document.createElement('button');
        settingsButton.id = 'settingsButton';
        settingsButton.title = 'Open Settings';
        settingsButton.style.padding = '5px 10px';
        settingsButton.style.cursor = 'pointer';
        settingsButton.innerText = '⚙️';
        settingsButton.addEventListener('click', () => {
            openSettingsOverlay();
        });

        buttonWrapper.appendChild(categoryButton);
        buttonWrapper.appendChild(lockButton);

        buttonWrapper.appendChild(settingsButton);

        console.log("PteroSort: Creating buttons...");

        const newButtonContainer = document.getElementById('pterosort-button-container');

        if (newButtonContainer) {

            newButtonContainer.innerHTML = '';

            buttonWrapper.style.display = 'flex';
            buttonWrapper.style.justifyContent = 'flex-end';
            buttonWrapper.style.alignItems = 'center';
            buttonWrapper.style.width = '100%';
            buttonWrapper.style.gap = '10px';
            buttonWrapper.style.float = 'none';
            buttonWrapper.style.position = 'static';

            newButtonContainer.appendChild(buttonWrapper);
            console.log("PteroSort: Appended button wrapper to new container:", newButtonContainer);

        } else {
            console.error("PteroSort: Could not find the new button container (#pterosort-button-container). Buttons not added.");
        }

    }

    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'ptero-sort-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = 'rgba(0, 0, 0, 0.6)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = '10000';

        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                overlay.remove();
            }
        });
        return overlay;
    }

    function createOverlayBox() {
        const box = document.createElement('div');
        box.className = 'ptero-sort-overlay-box';
        box.style.padding = '25px';
        box.style.background = 'var(--secondary-background-color, #2a3542)';
        box.style.color = 'var(--secondary-foreground-color, #ffffff)';
        box.style.boxShadow = '0px 5px 15px rgba(0,0,0,0.3)';
        box.style.borderRadius = '8px';
        box.style.textAlign = 'center';
        box.style.minWidth = '350px';
        box.style.maxWidth = '90vw';

        box.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        return box;
    }

    function openCategoryOverlay(editCategory = null) {
        const overlay = createOverlay();
        const box = createOverlayBox();

        const categoryId = editCategory ? editCategory.id : generateCategoryId();
        const isEditMode = !!editCategory;

        box.innerHTML = `
            <h3 style="margin-bottom: 20px; font-size: 1.3em;">${isEditMode ? 'Edit Category' : 'Create New Category'}</h3>
            <div style="display: flex; flex-direction: column; gap: 15px; text-align: left;">
                <div>
                    <label for="categoryName" style="display: block; margin-bottom: 5px;">Name:</label>
                    <input type="text" id="categoryName" value="${editCategory ? editCategory.name : ''}" class="overlay-input">
                </div>
                <div>
                    <label for="categoryColor" style="display: block; margin-bottom: 5px;">Color:</label>
                    <input type="color" id="categoryColor" value="${editCategory ? editCategory.color : '#4CAF50'}" style="width: 100%; height: 35px; border: none; border-radius: 5px; cursor: pointer; background-color: transparent;">
                </div>
                <div>
                    <label for="categoryDescription" style="display: block; margin-bottom: 5px;">Description:</label>
                    <textarea id="categoryDescription" class="overlay-input" style="height: 70px; resize: vertical;">${editCategory ? editCategory.description : ''}</textarea>
                </div>
            </div>
            <div style="margin-top: 25px; display: flex; justify-content: space-between; gap: 10px;">
                ${isEditMode ? `<button id="deleteCategory" class="overlay-button danger-button">Delete</button>` : '<div></div>'}
                <div>
                    <button id="cancelCategory" class="overlay-button secondary-button" style="margin-right: 10px;">Cancel</button>
                    <button id="confirmCategory" class="overlay-button primary-button">${isEditMode ? 'Save' : 'Create'}</button>
                </div>
            </div>
        `;

        overlay.appendChild(box);
        document.body.appendChild(overlay);

        document.getElementById('categoryName').focus();

        document.getElementById('confirmCategory').addEventListener('click', () => {
            const name = document.getElementById('categoryName').value.trim();
            const color = document.getElementById('categoryColor').value;
            const description = document.getElementById('categoryDescription').value.trim();

            if (!name) {
                alert('Category name cannot be empty.');
                return;
            }

            if (isEditMode) {

                editCategory.name = name;
                editCategory.color = color;
                editCategory.description = description;

                const categoryElement = document.querySelector(`.${categoryRowClass}[data-category-id="${editCategory.id}"]`);
                if (categoryElement) {
                    categoryElement.querySelector('.ServerRow___StyledP-sc-1ibsw91-4').textContent = name;
                    categoryElement.querySelector(`.${categoryColorStripeClass}`).style.backgroundColor = color;
                    categoryElement.querySelector('.category-description').textContent = description;
                }
            } else {

                const newCategory = { id: categoryId, name, color, description, collapsed: false };
                categories.push(newCategory);

                 const categoryElement = createCategoryElement(newCategory);
                 const container = document.querySelector(containerSelector);
                 if (container) {

                     const firstItem = container.querySelector(`${serverSelector}, .${categoryRowClass}`);

                     container.insertBefore(categoryElement, firstItem);
                 }
             }

            saveCategories();
            saveOrder();
            enableDragAndDrop();
            fixSpacing();
            overlay.remove();
        });

        document.getElementById('cancelCategory').addEventListener('click', () => {
            overlay.remove();
        });

        if (isEditMode) {
            document.getElementById('deleteCategory').addEventListener('click', () => {

                deleteCategory(editCategory.id, editCategory.name);
                overlay.remove();
            });
        }
    }

    function openSettingsOverlay() {
        const overlay = createOverlay();
        const box = createOverlayBox();

        box.innerHTML = `
            <h3 style="margin-bottom: 20px; font-size: 1.3em;">Settings & Data</h3>
            <div style="display: flex; flex-direction: column; gap: 15px;">
                <button id="importSettings" class="overlay-button secondary-button">Import Settings</button>
                <button id="exportSettings" class="overlay-button secondary-button">Export Settings</button>
                <button id="clearAllStorage" class="overlay-button danger-button">Clear All Saved Data</button>
            </div>
            <div style="margin-top: 25px; text-align: right;">
                <button id="closeSettings" class="overlay-button primary-button">Close</button>
            </div>
        `;
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        document.getElementById('importSettings').addEventListener('click', () => {
            overlay.remove();
            openImportOverlay();
        });

        document.getElementById('exportSettings').addEventListener('click', () => {
            exportSettings();

        });

        document.getElementById('clearAllStorage').addEventListener('click', () => {
            overlay.remove();
            openClearConfirmationOverlay();
        });

        document.getElementById('closeSettings').addEventListener('click', () => {
            overlay.remove();
        });
    }

    function openImportOverlay() {
        const overlay = createOverlay();
        const box = createOverlayBox();

        box.innerHTML = `
            <h3 style="margin-bottom: 15px;">Import Settings</h3>
            <p style="margin-bottom: 15px; font-size: 0.9em;">Paste the exported JSON data below.</p>
            <textarea id="importTextArea" class="overlay-input" placeholder="{...}" style="width: 100%; height: 150px; resize: vertical; margin-bottom: 20px;"></textarea>
            <div style="display: flex; justify-content: flex-end; gap: 10px;">
                <button id="cancelImport" class="overlay-button secondary-button">Cancel</button>
                <button id="confirmImport" class="overlay-button primary-button">Import & Reload</button>
            </div>
        `;
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        document.getElementById('confirmImport').addEventListener('click', () => {
            const settingsJson = document.getElementById('importTextArea').value.trim();
            if (!settingsJson) {
                alert('Import data cannot be empty.');
                return;
            }
            try {
                const settings = JSON.parse(settingsJson);

                if (typeof settings !== 'object' || settings === null ||
                    (!settings.order_yours && !settings.order_others && !settings.categories_yours && !settings.categories_others)) {
                     throw new Error("Invalid settings format.");
                }
                importSettings(settings);
                overlay.remove();
                alert('Settings imported successfully! Reloading page...');
                location.reload();
            } catch (e) {
                console.error("Import Error:", e);
                alert('Failed to import settings. Invalid JSON data or format.\n\n' + e.message);
            }
        });

        document.getElementById('cancelImport').addEventListener('click', () => {
            overlay.remove();
        });
    }

    function exportSettings() {
        const settings = {

            categories_yours: JSON.parse(localStorage.getItem(STORAGE_KEY_CATEGORIES_YOURS) || '[]'),
            categories_others: JSON.parse(localStorage.getItem(STORAGE_KEY_CATEGORIES_OTHERS) || '[]'),
            order_yours: JSON.parse(localStorage.getItem(STORAGE_KEY_YOURS) || '[]'),
            order_others: JSON.parse(localStorage.getItem(STORAGE_KEY_OTHERS) || '[]'),

            dragLockEnabled: localStorage.getItem('dragLockEnabled')
        };

        const settingsJson = JSON.stringify(settings, null, 2);
        const blob = new Blob([settingsJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[-T:]/g, '');
        downloadLink.href = url;
        downloadLink.download = `pterosort_settings_${timestamp}.json`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
    }

    function importSettings(settings) {

        if (settings.categories_yours) localStorage.setItem(STORAGE_KEY_CATEGORIES_YOURS, JSON.stringify(settings.categories_yours));
        if (settings.categories_others) localStorage.setItem(STORAGE_KEY_CATEGORIES_OTHERS, JSON.stringify(settings.categories_others));
        if (settings.order_yours) localStorage.setItem(STORAGE_KEY_YOURS, JSON.stringify(settings.order_yours));
        if (settings.order_others) localStorage.setItem(STORAGE_KEY_OTHERS, JSON.stringify(settings.order_others));

        if (settings.dragLockEnabled !== undefined && settings.dragLockEnabled !== null) localStorage.setItem('dragLockEnabled', settings.dragLockEnabled);
    }

    function openClearConfirmationOverlay() {
        const overlay = createOverlay();
        const box = createOverlayBox();
        box.innerHTML = `
            <h3 style="margin-bottom: 15px; color: #ef4444;">Confirm Deletion</h3>
            <p style="margin-bottom: 20px;">Are you sure you want to delete ALL saved server orders and categories? This cannot be undone.</p>
            <div style="display: flex; justify-content: flex-end; gap: 10px;">
                <button id="cancelDeleteAll" class="overlay-button secondary-button">Cancel</button>
                <button id="confirmDeleteAll" class="overlay-button danger-button">Yes, Delete All</button>
            </div>
        `;
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        document.getElementById('confirmDeleteAll').addEventListener('click', () => {
            localStorage.removeItem(STORAGE_KEY_YOURS);
            localStorage.removeItem(STORAGE_KEY_OTHERS);
            localStorage.removeItem(STORAGE_KEY_CATEGORIES_YOURS);
            localStorage.removeItem(STORAGE_KEY_CATEGORIES_OTHERS);

            overlay.remove();
            alert('All saved order and category data has been deleted. Reloading page...');
            location.reload();
        });

        document.getElementById('cancelDeleteAll').addEventListener('click', () => {
            overlay.remove();
        });
    }

    function createButtonContainerDiv() {

        if (document.getElementById('pterosort-button-container')) {
            console.log("PteroSort: Button container already exists.");
            return;
        }

        const originalHeader = document.querySelector(buttonContainerSelector);
        if (!originalHeader) {
            console.error("PteroSort: Could not find original header container:", buttonContainerSelector);
            return;
        }

        const newContainer = originalHeader.cloneNode(false);

        newContainer.id = 'pterosort-button-container';
        newContainer.style.cssText = '';
        newContainer.style.marginTop = '10px';
        newContainer.style.display = 'flex';
        newContainer.style.alignItems = 'center';
        newContainer.style.padding = '0 1.5rem';

        originalHeader.parentNode.insertBefore(newContainer, originalHeader.nextSibling);
        console.log("PteroSort: Created and inserted new button container div.");
    }

    function init() {
        console.log("PteroSort: Running init()...");
        createButtonContainerDiv();

        loadOrder();
        enableDragAndDrop();
        fixSpacing();

        setTimeout(createButtons, 50);
        console.log("PteroSort: init() finished.");
    }

    function observePageChanges() {
        let lastUrl = location.href;

        let lastPath = location.pathname;

        const observer = new MutationObserver(() => {

            if (location.href !== lastUrl) {
                lastUrl = location.href;
                if (location.pathname !== lastPath) {
                    console.log("PteroSort: Path changed, re-initializing.");
                    lastPath = location.pathname;
                    waitForElement(serverSelector, init);
                }
            }
        });

        observer.observe(document.body, { attributes: true, attributeFilter: ['href', 'class'] });

        setInterval(() => {
            if (location.pathname !== lastPath) {
                console.log("PteroSort: Path change detected by interval, re-initializing.");
                lastPath = location.pathname;
                waitForElement(serverSelector, init);
            }
        }, 1500);
    }

    function observeViewSwitch() {
        const toggleSwitch = document.querySelector(toggleSelector);
        if (toggleSwitch) {
            toggleSwitch.addEventListener('change', () => {

                setTimeout(() => {
                    waitForElement(serverSelector, () => {
                        console.log("PteroSort: View switched, re-initializing.");

                        loadOrder();
                        enableDragAndDrop();
                        fixSpacing();

                    });
                }, 0);
            });
        } else {
            console.warn("PteroSort: Could not find view toggle switch.");
        }
    }

    function waitForElement(selector, callback) {
        const observer = new MutationObserver(() => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                callback();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    waitForElement(serverSelector, () => {
        console.log("PteroSort: Initializing...");
        init();
        observePageChanges();
        observeViewSwitch();
    });

    const style = document.createElement('style');
    style.textContent = `

        .${categoryRowClass} {
            background-color: rgba(0, 0, 0, 0.15);
            border-left: none;
            cursor: grab;
            position: relative;
            padding-left: 0 !important;
        }
        .${categoryRowClass}:hover {
            background-color: rgba(0, 0, 0, 0.25);
        }
        .${categoryColorStripeClass} {
            width: 0.6rem;
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            border-radius: 5px 0 0 5px;

        }

        .${categoryRowClass} > div:not(.${categoryColorStripeClass}) {
             margin-left: calc(0.6rem + 15px);
        }

        .${categoryRowClass} .ServerRow___StyledDiv4-sc-1ibsw91-10 {
            margin-left: auto;
            padding-right: 15px;
        }
        .${categoryRowClass} .category-description {
             color: #a7b4c0;
             font-size: 0.9em;
        }

        .server-category-indicator {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: #ccc;
            box-shadow: 0 0 3px rgba(0,0,0,0.5);
            z-index: 1;
        }

        .dragging-active {
            opacity: 0.6;
            border: 2px dashed #888;
        }

        .ptero-sort-overlay-box {
            background-color: #2a3542;
            color: #e1e7ec;
            border: 1px solid #4f5d6a;
        }
        .overlay-input, .ptero-sort-overlay-box textarea {
            padding: 10px;
            border: 1px solid #4f5d6a;
            background-color: #1e2730;
            color: #e1e7ec;
            border-radius: 4px;
            width: 100%;
            box-sizing: border-box;
        }
         .overlay-input:focus, .ptero-sort-overlay-box textarea:focus {
             outline: none;
             border-color: #687f96;
             box-shadow: 0 0 0 2px rgba(104, 127, 150, 0.3);
         }

        .overlay-button {
            padding: 8px 16px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 500;
            transition: background-color 0.2s ease, box-shadow 0.2s ease;
        }
        .primary-button {
            background-color: #3498db;
            color: white;
        }
        .primary-button:hover {
            background-color: #2980b9;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .secondary-button {
            background-color: #5f7387;
            color: white;
        }
         .secondary-button:hover {
             background-color: #4e6072;
             box-shadow: 0 2px 4px rgba(0,0,0,0.2);
         }
        .danger-button {
            background-color: #e74c3c;
            color: white;
        }
         .danger-button:hover {
             background-color: #c0392b;
             box-shadow: 0 2px 4px rgba(0,0,0,0.2);
         }

         .flex.items-center + div[style*="float: right"] {
             display: flex;
             align-items: center;
         }
         .flex.items-center + div[style*="float: right"] > button {
             height: 32px;
             display: inline-flex;
             align-items: center;
             justify-content: center;
             background-color: var(--secondary-background-color, #2a3542);
             color: var(--secondary-foreground-color, #ffffff);
             border: 1px solid #4f5d6a;
             border-radius: 4px;
         }
          .flex.items-center + div[style*="float: right"] > button:hover {
              background-color: #3a4a5a;
          }
          .flex.items-center + div[style*="float: right"] > button#categoryButton {
             border-color: rgb(16, 185, 129);
             color: rgb(16, 185, 129);
             background-color: transparent;
          }
           .flex.items-center + div[style*="float: right"] > button#categoryButton:hover {
               background-color: rgba(16, 185, 129, 0.1);
           }

    `;
    document.head.appendChild(style);

})();