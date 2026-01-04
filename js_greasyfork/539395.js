// ==UserScript==
// @name         Website and Page Blocker
// @namespace    https://greasyfork.org/en/users/1483582-merryberries
// @version      2.0
// @license      MIT
// @author       MerryBerries
// @description  Click-to-block websites, pages, or prefixes — for digital well-being. Supports timed or permanent blocks.
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/539395/Website%20and%20Page%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/539395/Website%20and%20Page%20Blocker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const hostname = location.hostname;
    const fullUrl = location.href;
    const pathname = location.pathname;
    const now = Date.now();

    let siteBlockList = GM_getValue('siteBlockList', {});
    let pageBlockList = GM_getValue('pageBlockList', {});
    let pagePrefixBlockList = GM_getValue('pagePrefixBlockList', {});

    // === Block check logic ===
    function blockPage(message) {
        document.documentElement.innerHTML = `
            <div style="font-size: 2em; color: red; text-align: center; margin-top: 20%;">
                ${message}
            </div>`;
        document.title = "Blocked";
    }

    if (siteBlockList[hostname]) {
        const until = siteBlockList[hostname];
        if (until === -1 || now < until) {
            blockPage(`🚫 The entire site (${hostname}) is blocked.`);
            return;
        } else {
            delete siteBlockList[hostname];
            GM_setValue('siteBlockList', siteBlockList);
        }
    }

    const pageKey = pageBlockList[fullUrl] ? fullUrl : pageBlockList[pathname] ? pathname : null;
    if (pageKey) {
        const until = pageBlockList[pageKey];
        if (until === -1 || now < until) {
            blockPage(`🚫 This page is blocked.`);
            return;
        } else {
            delete pageBlockList[pageKey];
            GM_setValue('pageBlockList', pageBlockList);
        }
    }

    for (const prefix in pagePrefixBlockList) {
        const until = pagePrefixBlockList[prefix];
        if ((until === -1 || now < until) && fullUrl.startsWith(prefix)) {
            blockPage(`🚫 This group of pages is blocked.\n(Matched prefix: ${prefix})`);
            return;
        }
        if (until !== -1 && now >= until) {
            delete pagePrefixBlockList[prefix];
            GM_setValue('pagePrefixBlockList', pagePrefixBlockList);
        }
    }

    // === Draggable floating button ===
    const mainBtn = document.createElement('button');
    mainBtn.innerText = '⚙ Block options';

    // Get saved position or use default
    const savedPosition = GM_getValue('buttonPosition', { top: '10px', right: '10px' });

    Object.assign(mainBtn.style, {
        position: 'fixed',
        top: savedPosition.top,
        right: savedPosition.right,
        left: savedPosition.left || 'auto',
        bottom: savedPosition.bottom || 'auto',
        zIndex: 9999,
        background: '#f44',
        color: '#fff',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '14px',
        cursor: 'move',
        userSelect: 'none',
        opacity: '0.9',
        transition: 'opacity 0.2s ease'
    });

    // Add hover effect
    mainBtn.addEventListener('mouseenter', () => {
        mainBtn.style.opacity = '1';
        mainBtn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
    });

    mainBtn.addEventListener('mouseleave', () => {
        mainBtn.style.opacity = '0.9';
        mainBtn.style.boxShadow = 'none';
    });

    document.body.appendChild(mainBtn);

    // === Drag functionality ===
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let dragStartTime = 0;

    mainBtn.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragStartTime = Date.now();

        const rect = mainBtn.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;

        mainBtn.style.cursor = 'grabbing';
        mainBtn.style.opacity = '0.7';

        // Prevent text selection during drag
        document.body.style.userSelect = 'none';

        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        // Keep button within viewport bounds
        const maxX = window.innerWidth - mainBtn.offsetWidth;
        const maxY = window.innerHeight - mainBtn.offsetHeight;

        const clampedX = Math.max(0, Math.min(newX, maxX));
        const clampedY = Math.max(0, Math.min(newY, maxY));

        // Reset positioning properties
        mainBtn.style.left = clampedX + 'px';
        mainBtn.style.top = clampedY + 'px';
        mainBtn.style.right = 'auto';
        mainBtn.style.bottom = 'auto';

        e.preventDefault();
    });

    document.addEventListener('mouseup', (e) => {
        if (!isDragging) return;

        isDragging = false;
        mainBtn.style.cursor = 'move';
        mainBtn.style.opacity = '0.9';
        document.body.style.userSelect = '';

        // Save position
        const rect = mainBtn.getBoundingClientRect();
        const position = {
            left: rect.left + 'px',
            top: rect.top + 'px',
            right: 'auto',
            bottom: 'auto'
        };
        GM_setValue('buttonPosition', position);

        // If the drag was very short (< 200ms), treat it as a click
        const dragDuration = Date.now() - dragStartTime;
        if (dragDuration < 200) {
            // Small delay to ensure drag state is reset
            setTimeout(() => {
                showMainMenu();
            }, 10);
        }

        e.preventDefault();
    });

    // === Check if item already exists ===
    function checkExistingBlock(type, key) {
        let existing = null;
        let timeText = '';

        if (type === 'site' && siteBlockList[key]) {
            existing = siteBlockList[key];
        } else if (type === 'page' && pageBlockList[key]) {
            existing = pageBlockList[key];
        } else if (type === 'prefix' && pagePrefixBlockList[key]) {
            existing = pagePrefixBlockList[key];
        }

        if (existing !== null) {
            if (existing === -1) {
                timeText = 'permanently';
            } else if (existing > now) {
                timeText = `until ${new Date(existing).toLocaleString()}`;
            } else {
                // Expired block, can be overwritten
                return null;
            }
            return timeText;
        }
        return null;
    }

    // === Popup style with X button ===
    function createPopup(title, buttons, showBlockList = false) {
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        });

        const box = document.createElement('div');
        Object.assign(box.style, {
            background: '#fff',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center',
            minWidth: '300px',
            maxWidth: showBlockList ? '90%' : '90%',
            maxHeight: showBlockList ? '85vh' : 'auto',
            fontSize: '16px',
            position: 'relative',
            overflow: showBlockList ? 'hidden' : 'visible',
            display: 'flex',
            flexDirection: 'column'
        });

        // X button
        const closeBtn = document.createElement('button');
        closeBtn.innerText = '×';
        Object.assign(closeBtn.style, {
            position: 'absolute',
            top: '5px',
            right: '10px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#999',
            padding: '0',
            width: '30px',
            height: '30px'
        });
        closeBtn.onclick = () => document.body.removeChild(overlay);
        box.appendChild(closeBtn);

        const titleEl = document.createElement('div');
        titleEl.innerText = title;
        titleEl.style.marginBottom = '15px';
        titleEl.style.fontSize = '18px';
        titleEl.style.marginRight = '40px'; // Space for X button
        box.appendChild(titleEl);

        if (showBlockList) {
            createBlockListContent(box, overlay);
        }

        buttons.forEach(({ label, color, onClick }) => {
            const btn = document.createElement('button');
            btn.innerText = label;
            Object.assign(btn.style, {
                margin: '6px',
                padding: '8px 14px',
                fontSize: '14px',
                backgroundColor: color,
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
            });
            btn.onclick = () => {
                document.body.removeChild(overlay);
                onClick();
            };
            box.appendChild(btn);
        });

        overlay.appendChild(box);
        document.body.appendChild(overlay);
    }

    // === Block list display with multi-select ===
    function createBlockListContent(container, overlay) {
        let selectedItems = new Set();

        // Control buttons
        const controlsDiv = document.createElement('div');
        Object.assign(controlsDiv.style, {
            marginBottom: '15px',
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            flexWrap: 'wrap'
        });

        const selectAllBtn = document.createElement('button');
        selectAllBtn.innerText = '☑ Select All';
        Object.assign(selectAllBtn.style, {
            padding: '6px 12px',
            fontSize: '12px',
            backgroundColor: '#3498db',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
        });

        const deselectAllBtn = document.createElement('button');
        deselectAllBtn.innerText = '☐ Deselect All';
        Object.assign(deselectAllBtn.style, {
            padding: '6px 12px',
            fontSize: '12px',
            backgroundColor: '#95a5a6',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
        });

        const deleteSelectedBtn = document.createElement('button');
        deleteSelectedBtn.innerText = '🗑 Delete Selected';
        Object.assign(deleteSelectedBtn.style, {
            padding: '6px 12px',
            fontSize: '12px',
            backgroundColor: '#e74c3c',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
        });

        const selectedCountSpan = document.createElement('span');
        selectedCountSpan.innerText = '0 selected';
        Object.assign(selectedCountSpan.style, {
            fontSize: '12px',
            color: '#666',
            alignSelf: 'center'
        });

        controlsDiv.appendChild(selectAllBtn);
        controlsDiv.appendChild(deselectAllBtn);
        controlsDiv.appendChild(deleteSelectedBtn);
        controlsDiv.appendChild(selectedCountSpan);
        container.appendChild(controlsDiv);

        // Scrollable list container
        const listContainer = document.createElement('div');
        Object.assign(listContainer.style, {
            textAlign: 'left',
            flex: '1',
            overflow: 'auto',
            border: '1px solid #ddd',
            padding: '10px',
            borderRadius: '5px',
            minHeight: '200px'
        });

        let hasBlocks = false;
        let allCheckboxes = [];

        function updateSelectedCount() {
            selectedCountSpan.innerText = `${selectedItems.size} selected`;
            deleteSelectedBtn.style.backgroundColor = selectedItems.size > 0 ? '#e74c3c' : '#bdc3c7';
        }

        // Site blocks
        if (Object.keys(siteBlockList).length > 0) {
            hasBlocks = true;
            const siteHeader = document.createElement('h4');
            siteHeader.innerText = '🟥 Blocked Sites:';
            siteHeader.style.color = '#c0392b';
            listContainer.appendChild(siteHeader);

            Object.entries(siteBlockList).forEach(([site, until]) => {
                const { item, checkbox } = createSelectableBlockItem(site, until, 'site', selectedItems, updateSelectedCount);
                allCheckboxes.push(checkbox);
                listContainer.appendChild(item);
            });
        }

        // Page blocks
        if (Object.keys(pageBlockList).length > 0) {
            hasBlocks = true;
            const pageHeader = document.createElement('h4');
            pageHeader.innerText = '🟨 Blocked Pages:';
            pageHeader.style.color = '#f39c12';
            pageHeader.style.marginTop = '15px';
            listContainer.appendChild(pageHeader);

            Object.entries(pageBlockList).forEach(([page, until]) => {
                const { item, checkbox } = createSelectableBlockItem(page, until, 'page', selectedItems, updateSelectedCount);
                allCheckboxes.push(checkbox);
                listContainer.appendChild(item);
            });
        }

        // Prefix blocks
        if (Object.keys(pagePrefixBlockList).length > 0) {
            hasBlocks = true;
            const prefixHeader = document.createElement('h4');
            prefixHeader.innerText = '🟦 Blocked Prefixes:';
            prefixHeader.style.color = '#2980b9';
            prefixHeader.style.marginTop = '15px';
            listContainer.appendChild(prefixHeader);

            Object.entries(pagePrefixBlockList).forEach(([prefix, until]) => {
                const { item, checkbox } = createSelectableBlockItem(prefix, until, 'prefix', selectedItems, updateSelectedCount);
                allCheckboxes.push(checkbox);
                listContainer.appendChild(item);
            });
        }

        if (!hasBlocks) {
            listContainer.innerHTML = '<p style="text-align: center; color: #999;">No active blocks</p>';
            controlsDiv.style.display = 'none';
        }

        container.appendChild(listContainer);

        // Control button events
        selectAllBtn.onclick = () => {
            allCheckboxes.forEach(checkbox => {
                checkbox.checked = true;
                const key = checkbox.dataset.key;
                const type = checkbox.dataset.type;
                selectedItems.add(`${type}:${key}`);
            });
            updateSelectedCount();
        };

        deselectAllBtn.onclick = () => {
            allCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            selectedItems.clear();
            updateSelectedCount();
        };

        deleteSelectedBtn.onclick = () => {
            if (selectedItems.size === 0) {
                alert('No items selected');
                return;
            }

            if (confirm(`Delete ${selectedItems.size} selected item(s)?`)) {
                // Refresh the data from storage before deletion
                siteBlockList = GM_getValue('siteBlockList', {});
                pageBlockList = GM_getValue('pageBlockList', {});
                pagePrefixBlockList = GM_getValue('pagePrefixBlockList', {});

                selectedItems.forEach(item => {
                    const colonIndex = item.indexOf(':');
                    const type = item.substring(0, colonIndex);
                    const key = item.substring(colonIndex + 1);

                    if (type === 'site') {
                        delete siteBlockList[key];
                        GM_setValue('siteBlockList', siteBlockList);
                    } else if (type === 'page') {
                        delete pageBlockList[key];
                        GM_setValue('pageBlockList', pageBlockList);
                    } else if (type === 'prefix') {
                        delete pagePrefixBlockList[key];
                        GM_setValue('pagePrefixBlockList', pagePrefixBlockList);
                    }
                });
                document.body.removeChild(overlay);
                location.reload();
            }
        };

        updateSelectedCount();
    }

    // === Individual selectable block item ===
    function createSelectableBlockItem(url, until, type, selectedItems, updateCallback) {
        const item = document.createElement('div');
        Object.assign(item.style, {
            marginBottom: '8px',
            padding: '8px',
            backgroundColor: '#f9f9f9',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        });

        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.dataset.key = url;
        checkbox.dataset.type = type;
        Object.assign(checkbox.style, {
            transform: 'scale(1.2)',
            cursor: 'pointer'
        });

        checkbox.onchange = () => {
            const itemKey = `${type}:${url}`;
            if (checkbox.checked) {
                selectedItems.add(itemKey);
            } else {
                selectedItems.delete(itemKey);
            }
            updateCallback();
        };

        // Info section
        const info = document.createElement('div');
        info.style.flex = '1';
        info.style.wordBreak = 'break-all';

        const timeText = until === -1 ? 'Permanent' :
            until > now ? `Until ${new Date(until).toLocaleString()}` : 'Expired';

        info.innerHTML = `
            <div style="font-weight: bold; font-size: 14px;">${url}</div>
            <div style="font-size: 12px; color: #666;">${timeText}</div>
        `;

        // Individual delete button
        const removeBtn = document.createElement('button');
        removeBtn.innerText = '🗑';
        Object.assign(removeBtn.style, {
            background: '#e74c3c',
            color: '#fff',
            border: 'none',
            padding: '4px 8px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
        });

        removeBtn.onclick = () => {
            if (confirm(`Remove block for: ${url}?`)) {
                if (type === 'site') {
                    delete siteBlockList[url];
                    GM_setValue('siteBlockList', siteBlockList);
                } else if (type === 'page') {
                    delete pageBlockList[url];
                    GM_setValue('pageBlockList', pageBlockList);
                } else if (type === 'prefix') {
                    delete pagePrefixBlockList[url];
                    GM_setValue('pagePrefixBlockList', pagePrefixBlockList);
                }
                location.reload();
            }
        };

        item.appendChild(checkbox);
        item.appendChild(info);
        item.appendChild(removeBtn);

        return { item, checkbox };
    }

    // === Duration choices ===
    function chooseDuration(callback) {
        createPopup('⏱ How long to block?', [
            { label: '10 min', color: '#666', onClick: () => callback(10) },
            { label: '30 min', color: '#444', onClick: () => callback(30) },
            { label: '1 hour', color: '#222', onClick: () => callback(60) },
            { label: 'Permanent', color: '#000', onClick: () => callback(-1) }
        ]);
    }

    // === Main menu function ===
    function showMainMenu() {
        createPopup('🧱 What do you want to block?', [
            {
                label: '📋 View Block List',
                color: '#8e44ad',
                onClick: () => {
                    createPopup('📋 Current Block List', [], true);
                }
            },
            {
                label: '🟥 Entire Site',
                color: '#c0392b',
                onClick: () => {
                    const existing = checkExistingBlock('site', hostname);
                    if (existing) {
                        if (!confirm(`This site (${hostname}) is already blocked ${existing}.\n\nDo you want to update the block time?`)) {
                            return;
                        }
                    }
                    chooseDuration((minutes) => {
                        const until = minutes === -1 ? -1 : now + minutes * 60 * 1000;
                        siteBlockList[hostname] = until;
                        GM_setValue('siteBlockList', siteBlockList);
                        alert(`Site blocked ${minutes === -1 ? 'permanently' : `for ${minutes} minutes`}.`);
                        location.reload();
                    });
                }
            },
            {
                label: '🟨 This Page',
                color: '#f39c12',
                onClick: () => {
                    const existing = checkExistingBlock('page', fullUrl);
                    if (existing) {
                        if (!confirm(`This page is already blocked ${existing}.\n\nDo you want to update the block time?`)) {
                            return;
                        }
                    }
                    chooseDuration((minutes) => {
                        const until = minutes === -1 ? -1 : now + minutes * 60 * 1000;
                        pageBlockList[fullUrl] = until;
                        GM_setValue('pageBlockList', pageBlockList);
                        alert(`Page blocked ${minutes === -1 ? 'permanently' : `for ${minutes} minutes`}.`);
                        location.reload();
                    });
                }
            },
            {
                label: '🟦 Prefix Match',
                color: '#2980b9',
                onClick: () => {
                    const suggestedPrefix = fullUrl.split(/[?#]/)[0];
                    const input = prompt(`Enter prefix to block`, suggestedPrefix);
                    if (!input) return;

                    const existing = checkExistingBlock('prefix', input);
                    if (existing) {
                        if (!confirm(`This prefix (${input}) is already blocked ${existing}.\n\nDo you want to update the block time?`)) {
                            return;
                        }
                    }

                    chooseDuration((minutes) => {
                        const until = minutes === -1 ? -1 : now + minutes * 60 * 1000;
                        pagePrefixBlockList[input] = until;
                        GM_setValue('pagePrefixBlockList', pagePrefixBlockList);
                        alert(`Prefix "${input}" blocked ${minutes === -1 ? 'permanently' : `for ${minutes} minutes`}.`);
                        location.reload();
                    });
                }
            }
        ]);
    }

    // === Main click logic (separated from drag) ===
    // Click handling is now done in the mouseup event to distinguish from drag
})();