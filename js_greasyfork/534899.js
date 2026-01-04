// ==UserScript==
// @name         DC Notif'
// @namespace    http://tampermonkey.net/
// @version      1.6.6
// @description  Notifications traitées dans une interface
// @author       Laïn
// @match        https://www.dreadcast.net/Main*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/534899/DC%20Notif%27.user.js
// @updateURL https://update.greasyfork.org/scripts/534899/DC%20Notif%27.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CHECK_URL = 'https://www.dreadcast.net/Check';
    const MAX_HISTORY_ENTRIES = 50;
    const SCRIPT_Z_INDEX_BASE = 100001;
    const BELL_MARGIN_TOP = 10;
    const MAX_RETRIES = 10;
    const RETRY_DELAY = 750;
    const SHAKE_ANIMATION_DURATION = 800;
    const PERIODIC_CLEANUP_INTERVAL = 15000; // 15 seconds

    const DEFAULT_NOTIFY_SOUND_URL = 'none';
    const DEFAULT_NOTIFY_VOLUME = 0.6;
    const DEFAULT_BELL_SIZE_EM = 2.75;
    const DEFAULT_HIDE_ORIGINAL_NOTIFS = true;

    const LS_BELL_SIZE = 'dcNotify_bellSize';
    const LS_BELL_POS_TOP = 'dcNotify_bellPosTop';
    const LS_BELL_POS_LEFT = 'dcNotify_bellPosLeft';
    const LS_NOTIFY_SOUND_URL = 'dcNotify_notifySoundUrl';
    const LS_NOTIFY_SOUND_VOLUME = 'dcNotify_notifySoundVolume';
    const LS_HISTORY_PANEL_POS_TOP = 'dcNotify_historyPanelPosTop';
    const LS_HISTORY_PANEL_POS_LEFT = 'dcNotify_historyPanelPosLeft';
    const LS_SETTINGS_PANEL_POS_TOP = 'dcNotify_settingsPanelPosTop';
    const LS_SETTINGS_PANEL_POS_LEFT = 'dcNotify_settingsPanelPosLeft';
    const LS_HIDE_ORIGINAL_NOTIFS = 'dcNotify_hideOriginalNotifs';
    const LS_NOTIFICATION_CATEGORIES = 'dcNotify_notificationCategories';
    const LS_CATEGORY_STATES = 'dcNotify_categoryStates';
    const LS_FILTERS_COLLAPSED = 'dcNotify_filtersCollapsed';

    const BODY_CLASS_HIDE_ORIGINAL = 'dc-notify-hide-original';

    const NOTIF_PREFIX_ALERTE = 'alerte-';
    const NOTIF_PREFIX_VENTE = 'objet-vendu';

    const GENERIC_KEY_ALERTE = 'Alerte';
    const GENERIC_KEY_VENTE = 'Objet-vendu';

    let evilBoxHistory = [];
    let notificationCategories;
    let categoryStates = {};
    let notifyAlertAudio = null;
    let historyPanel = null;
    let settingsPanel = null;
    let unreadCount = 0;
    let counterElement = null;
    let addBellIconTimeout = null;
    let addBellIconRetryCount = 0;
    let isDraggingPanel = false;
    let initialMouseX = 0, initialMouseY = 0, initialPanelTop = 0, initialPanelLeft = 0;
    let bellElement = null;
    let isBellMoveModeActive = false;
    let isDraggingBell = false;
    let initialBellDragX = 0, initialBellDragY = 0, initialBellTop = 0, initialBellLeft = 0;

    let currentBellSize = parseFloat(localStorage.getItem(LS_BELL_SIZE) || DEFAULT_BELL_SIZE_EM);
    let currentNotifySoundUrl = localStorage.getItem(LS_NOTIFY_SOUND_URL) || DEFAULT_NOTIFY_SOUND_URL;
    let currentNotifyVolume = parseFloat(localStorage.getItem(LS_NOTIFY_SOUND_VOLUME) || DEFAULT_NOTIFY_VOLUME);
    let hideOriginalNotifications = localStorage.getItem(LS_HIDE_ORIGINAL_NOTIFS) === null ? DEFAULT_HIDE_ORIGINAL_NOTIFS : localStorage.getItem(LS_HIDE_ORIGINAL_NOTIFS) === 'true';
    let filtersCollapsed = localStorage.getItem(LS_FILTERS_COLLAPSED) === 'true';

    let savedBellPos = {
        top: localStorage.getItem(LS_BELL_POS_TOP),
        left: localStorage.getItem(LS_BELL_POS_LEFT)
    };
    let savedHistoryPanelPos = {
        top: localStorage.getItem(LS_HISTORY_PANEL_POS_TOP),
        left: localStorage.getItem(LS_HISTORY_PANEL_POS_LEFT)
    };
    let savedSettingsPanelPos = {
        top: localStorage.getItem(LS_SETTINGS_PANEL_POS_TOP),
        left: localStorage.getItem(LS_SETTINGS_PANEL_POS_LEFT)
    };

    let evilBoxDismissQueue = new Set();
    let cleanupIntervalId = null;

    function getEffectiveCategoryKey(category) {
        const lowerCategory = category.toLowerCase();
        if (lowerCategory.startsWith(NOTIF_PREFIX_VENTE)) {
            return GENERIC_KEY_VENTE;
        }
        if (lowerCategory.startsWith(NOTIF_PREFIX_ALERTE)) {
            return GENERIC_KEY_ALERTE;
        }
        return category;
    }

    function loadNotificationCategories() {
        const storedCategories = localStorage.getItem(LS_NOTIFICATION_CATEGORIES);
        if (storedCategories) {
            try {
                const parsedCategories = JSON.parse(storedCategories);
                notificationCategories = new Set(parsedCategories.map(cat => getEffectiveCategoryKey(cat)));
            } catch (e) {
                notificationCategories = new Set();
            }
        } else {
            notificationCategories = new Set();
        }
    }

    function saveNotificationCategories() {
        localStorage.setItem(LS_NOTIFICATION_CATEGORIES, JSON.stringify(Array.from(notificationCategories)));
    }

    function loadCategoryStates() {
        const storedStates = localStorage.getItem(LS_CATEGORY_STATES);
        let loadedStates;
        try {
            loadedStates = storedStates ? JSON.parse(storedStates) : {};
        } catch (e) {
            loadedStates = {};
        }

        categoryStates = {};
        let changed = false;

        notificationCategories.forEach(cat => {
            categoryStates[cat] = 'inactive';
            if (loadedStates[cat] && ['active', 'excluded', 'inactive'].includes(loadedStates[cat])) {
                 categoryStates[cat] = loadedStates[cat];
            }
        });

        Object.keys(loadedStates).forEach(loadedCatKey => {
            const effectiveKey = getEffectiveCategoryKey(loadedCatKey);
            if (notificationCategories.has(effectiveKey)) {
                if (!categoryStates[effectiveKey] || categoryStates[effectiveKey] === 'inactive') {
                     if (loadedStates[loadedCatKey] && ['active', 'excluded'].includes(loadedStates[loadedCatKey])) {
                        categoryStates[effectiveKey] = loadedStates[loadedCatKey];
                        changed = true;
                     }
                }
            } else {
                 if (loadedStates[loadedCatKey] && effectiveKey && !notificationCategories.has(effectiveKey)) {
                    notificationCategories.add(effectiveKey);
                    categoryStates[effectiveKey] = loadedStates[loadedCatKey];
                    changed = true;
                 }
            }
        });


        notificationCategories.forEach(cat => {
            if (!(cat in categoryStates)) {
                categoryStates[cat] = 'inactive';
                changed = true;
            }
        });

        Object.keys(categoryStates).forEach(cat => {
            const effectiveCat = getEffectiveCategoryKey(cat);
            if (!notificationCategories.has(effectiveCat) && cat !== effectiveCat) {
                delete categoryStates[cat];
                changed = true;
            } else if (!notificationCategories.has(cat) && cat === effectiveCat) {
                 delete categoryStates[cat];
                 changed = true;
            }
        });

        if (changed) {
            saveCategoryStates();
            saveNotificationCategories();
        }
    }


    function saveCategoryStates() {
        localStorage.setItem(LS_CATEGORY_STATES, JSON.stringify(categoryStates));
    }

    loadNotificationCategories();
    loadCategoryStates();


    function playNotificationSound() {
        if (historyPanel && historyPanel.parentNode) {
             return;
        }
        testSound(currentNotifySoundUrl, currentNotifyVolume);
    }

    function testSound(url, volume) {
        if (!url || url === DEFAULT_NOTIFY_SOUND_URL || !(url.startsWith('http://') || url.startsWith('https://'))) {
            return;
        }
        volume = parseFloat(volume);
        if (isNaN(volume) || volume < 0 || volume > 1) {
             volume = DEFAULT_NOTIFY_VOLUME;
        }
        try {
            const testAudio = new Audio(url);
            testAudio.volume = volume;
            testAudio.play().catch(error => {});
        } catch (e) {}
    }

    function updateUnreadCounterDisplay() {
        if (!counterElement) return;
        if (unreadCount > 0) {
            counterElement.textContent = unreadCount;
            counterElement.style.display = 'flex';
        } else {
            counterElement.style.display = 'none';
        }
    }

    function applyBellSize(sizeEm) {
        if (bellElement) {
            bellElement.style.fontSize = `${sizeEm}em`;
            positionBellIcon();
        }
    }

    function applyBellPosition(top, left) {
        if (bellElement) {
            bellElement.style.position = 'absolute';
            bellElement.style.top = top;
            bellElement.style.left = left;
            bellElement.style.transform = '';
        }
    }

    function applyPanelPosition(panel, savedPos) {
        if (!panel || !savedPos) return;
        if (savedPos.top !== null && savedPos.left !== null) {
             panel.style.position = 'fixed';
             panel.style.top = savedPos.top;
             panel.style.left = savedPos.left;
             panel.style.right = 'unset';
             panel.style.bottom = 'unset';
        }
    }

    function savePanelPosition(panel, lsKeyTop, lsKeyLeft, savedPosObject) {
         if (!panel || !panel.parentNode) return;
         const currentTop = panel.style.top;
         const currentLeft = panel.style.left;

         if (currentTop && currentLeft) {
             localStorage.setItem(lsKeyTop, currentTop);
             localStorage.setItem(lsKeyLeft, currentLeft);
             if (savedPosObject) {
                 savedPosObject.top = currentTop;
                 savedPosObject.left = currentLeft;
             }
         }
    }

    function dismissNotification(idToDismiss) {
        const initialLength = evilBoxHistory.length;
        evilBoxHistory = evilBoxHistory.filter(entry => entry.id !== idToDismiss);
        const removed = initialLength > evilBoxHistory.length;

        if (removed && historyPanel) {
            const itemElement = historyPanel.querySelector(`.history-item[data-id="${idToDismiss}"]`);
            if (itemElement) { itemElement.remove(); }
            filterNotifications(historyPanel.querySelector('.filter-button-container'));
        }
    }

    function createNotificationElement(entry) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'history-item';
        itemDiv.dataset.id = entry.id;
        itemDiv.dataset.categories = JSON.stringify(entry.categories || []);

        const timeSpan = document.createElement('span');
        timeSpan.className = 'history-timestamp';
        const timeOptions = { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
        try {
            timeSpan.textContent = entry.timestamp.toLocaleTimeString([], timeOptions);
        } catch (e) {
            timeSpan.textContent = entry.timestamp.toLocaleTimeString();
        }

        const contentDiv = document.createElement('div');
        contentDiv.className = 'history-evilbox-content';
        const template = document.createElement('template');
        try {
            if (entry.html && entry.html.trim()) {
                template.innerHTML = entry.html.trim();
                let contentToAppend = template.content.querySelector('div.evilBox') || template.content.firstChild;
                if (contentToAppend) {
                     if (contentToAppend.nodeName.toLowerCase() === 'evilbox' || contentToAppend.classList?.contains('evilBox')) {
                          contentToAppend.style.display = 'block';
                     }
                    contentDiv.appendChild(contentToAppend.cloneNode(true));
                } else {
                    contentDiv.innerHTML = '<i>Contenu invalide ou vide après parsing.</i>';
                }
            } else {
                contentDiv.innerHTML = '<i>Contenu vide.</i>';
            }
        } catch (e) {
            contentDiv.innerHTML = '<i>Erreur d\'affichage.</i>';
        }

        const dismissBtn = document.createElement('button');
        dismissBtn.className = 'dismiss-btn'; dismissBtn.innerHTML = '×'; dismissBtn.title = 'Supprimer cette notification';
        dismissBtn.addEventListener('click', (e) => { e.stopPropagation(); dismissNotification(entry.id); });

        itemDiv.appendChild(timeSpan);
        itemDiv.appendChild(contentDiv);
        itemDiv.appendChild(dismissBtn);
        return itemDiv;
    }

    function handleFilterButtonClick(categoryKey, filterAreaElement) {
        if (categoryKey === 'Tous') {
            Object.keys(categoryStates).forEach(cat => categoryStates[cat] = 'inactive');
        } else {
            const currentState = categoryStates[categoryKey] || 'inactive';
            if (currentState === 'inactive') {
                categoryStates[categoryKey] = 'active';
            } else if (currentState === 'active') {
                categoryStates[categoryKey] = 'excluded';
            } else {
                categoryStates[categoryKey] = 'inactive';
            }
        }
        saveCategoryStates();
        filterNotifications(filterAreaElement);
    }

    function removeCategoryFilterAndRebuild(categoryKeyToRemove, filterAreaElement) {
        notificationCategories.delete(categoryKeyToRemove);
        delete categoryStates[categoryKeyToRemove];
        saveNotificationCategories();
        saveCategoryStates();
        rebuildFilterButtonsUI(filterAreaElement);
        filterNotifications(filterAreaElement);
    }


    function rebuildFilterButtonsUI(filterAreaElement) {
        filterAreaElement.innerHTML = '';

        const createFilterButtonElement = (categoryKey, text) => {
            const button = document.createElement('button');
            button.className = 'filter-button';
            button.dataset.category = categoryKey;

            const textSpan = document.createElement('span');
            textSpan.className = 'filter-button-text';
            textSpan.textContent = text;
            button.appendChild(textSpan);

            button.addEventListener('click', (e) => {
                if (e.target.classList.contains('remove-category-btn')) {
                    return;
                }
                handleFilterButtonClick(categoryKey, filterAreaElement);
            });

            if (categoryKey !== 'Tous') {
                const removeBtn = document.createElement('span');
                removeBtn.className = 'remove-category-btn';
                removeBtn.innerHTML = '×';
                removeBtn.title = `Supprimer le filtre '${text}'`;
                removeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    removeCategoryFilterAndRebuild(categoryKey, filterAreaElement);
                });
                button.appendChild(removeBtn);
            }
            return button;
        };

        filterAreaElement.appendChild(createFilterButtonElement('Tous', 'Tous'));
        Array.from(notificationCategories).sort().forEach(category => {
            const displayText = category.charAt(0).toUpperCase() + category.slice(1);
            filterAreaElement.appendChild(createFilterButtonElement(category, displayText));
        });
    }


    function filterNotifications(filterButtonContainer) {
        if (!historyPanel || !filterButtonContainer) return;

        const buttons = filterButtonContainer.querySelectorAll('.filter-button');
        buttons.forEach(btn => {
            const cat = btn.dataset.category;
            btn.classList.remove('active', 'excluded');
            if (cat === 'Tous') {
                 const hasActiveOrExcludedFilter = Object.keys(categoryStates).some(key => notificationCategories.has(key) && categoryStates[key] !== 'inactive');
                 if (!hasActiveOrExcludedFilter) btn.classList.add('active');
            } else if (categoryStates[cat] === 'active') {
                btn.classList.add('active');
            } else if (categoryStates[cat] === 'excluded') {
                btn.classList.add('excluded');
            }
        });

        const contentArea = historyPanel.querySelector('.history-content');
        if (!contentArea) return;

        const activeFilters = Object.entries(categoryStates).filter(([, state]) => state === 'active').map(([cat]) => cat);
        const excludedFilters = Object.entries(categoryStates).filter(([, state]) => state === 'excluded').map(([cat]) => cat);

        const items = contentArea.querySelectorAll('.history-item');
        let hasVisibleItems = false;
        items.forEach(item => {
            let itemSpecificCategories = [];
            try { itemSpecificCategories = JSON.parse(item.dataset.categories || '[]'); } catch(e) {}

            const isExcluded = itemSpecificCategories.some(specificCat => {
                const effectiveCat = getEffectiveCategoryKey(specificCat);
                return excludedFilters.includes(effectiveCat);
            });

            if (isExcluded) {
                item.style.display = 'none';
                return;
            }

            let matchesActive;
            if (activeFilters.length > 0) {
                matchesActive = itemSpecificCategories.some(specificCat => {
                    const effectiveCat = getEffectiveCategoryKey(specificCat);
                    return activeFilters.includes(effectiveCat);
                });
            } else {
                matchesActive = true;
            }

            if (matchesActive) {
                item.style.display = '';
                hasVisibleItems = true;
            } else {
                item.style.display = 'none';
            }
        });

        const emptyMsgElement = contentArea.querySelector('.empty-filter-message');
        if (emptyMsgElement) { emptyMsgElement.remove(); }

        if (evilBoxHistory.length === 0) {
             const existingEmptyMsg = contentArea.querySelector('p > i');
             if (!existingEmptyMsg || !existingEmptyMsg.textContent.startsWith("Aucune notification détectée")) {
                contentArea.innerHTML = "<p><i>Aucune notification détectée pour le moment.</i></p>";
            }
        } else if (!hasVisibleItems) {
            const p = document.createElement('p');
            p.className = 'empty-filter-message';
            p.innerHTML = `<i>Aucune notification ne correspond aux filtres sélectionnés.</i>`;
            contentArea.appendChild(p);
        }
    }

    function toggleFiltersArea(button, areaWrapper) {
        filtersCollapsed = !filtersCollapsed;
        localStorage.setItem(LS_FILTERS_COLLAPSED, filtersCollapsed);
        areaWrapper.classList.toggle('collapsed', filtersCollapsed);
        button.textContent = filtersCollapsed ? 'Afficher catégories ►' : 'Masquer catégories ▼';
    }

    function showHistoryPanel() {
        closeSettingsPanel();
        unreadCount = 0;
        updateUnreadCounterDisplay();

        if (!historyPanel) {
            historyPanel = document.createElement('div');
            historyPanel.id = 'evilbox-history-panel';

            const header = document.createElement('div');
            header.className = 'history-header';
            const titleSpan = document.createElement('span');
            titleSpan.textContent = "Historique des Notifications";

            const controlsDiv = document.createElement('div');
            controlsDiv.className = 'history-header-controls';

            const settingsBtn = document.createElement('button');
            settingsBtn.className = 'settings-btn'; settingsBtn.innerHTML = '⚙️'; settingsBtn.title = 'Ouvrir les paramètres';
            settingsBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleSettingsPanel(); });

            const closeBtn = document.createElement('button');
            closeBtn.className = 'close-btn'; closeBtn.innerHTML = '×'; closeBtn.title = 'Fermer l\'historique';
            closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeHistoryPanel(); });

            controlsDiv.appendChild(settingsBtn); controlsDiv.appendChild(closeBtn);
            header.appendChild(titleSpan); header.appendChild(controlsDiv);
            historyPanel.appendChild(header);
            header.addEventListener('mousedown', (e) => dragStart(e, historyPanel));

            const filtersToggleAndContainer = document.createElement('div');
            filtersToggleAndContainer.className = 'filters-toggle-container';

            const toggleFiltersButton = document.createElement('button');
            toggleFiltersButton.className = 'toggle-filters-btn';
            filtersToggleAndContainer.appendChild(toggleFiltersButton);

            const filterButtonsWrapper = document.createElement('div');
            filterButtonsWrapper.className = 'filter-buttons-wrapper';
            if (filtersCollapsed) {
                filterButtonsWrapper.classList.add('collapsed');
            }
            toggleFiltersButton.textContent = filtersCollapsed ? 'Afficher catégories ►' : 'Masquer catégories ▼';


            const filterArea = document.createElement('div');
            filterArea.className = 'filter-button-container';

            toggleFiltersButton.addEventListener('click', () => toggleFiltersArea(toggleFiltersButton, filterButtonsWrapper));

            rebuildFilterButtonsUI(filterArea);

            filterButtonsWrapper.appendChild(filterArea);
            filtersToggleAndContainer.appendChild(filterButtonsWrapper);
            historyPanel.appendChild(filtersToggleAndContainer);

            const contentArea = document.createElement('div');
            contentArea.className = 'history-content';
            historyPanel.appendChild(contentArea);

             [...evilBoxHistory].reverse().forEach((entry) => {
                const itemElement = createNotificationElement(entry);
                contentArea.appendChild(itemElement);
            });

            filterNotifications(filterArea);

            document.body.appendChild(historyPanel);
            applyPanelPosition(historyPanel, savedHistoryPanelPos);
        }
    }

    function closeHistoryPanel() {
         if (historyPanel && historyPanel.parentNode) {
            savePanelPosition(historyPanel, LS_HISTORY_PANEL_POS_TOP, LS_HISTORY_PANEL_POS_LEFT, savedHistoryPanelPos);
            historyPanel.parentNode.removeChild(historyPanel);
            historyPanel = null;
            closeSettingsPanel();
        }
    }

    function toggleHistoryPanel() {
        if (historyPanel && historyPanel.parentNode) {
            closeHistoryPanel();
        } else {
            showHistoryPanel();
        }
    }

    function updateOriginalNotificationVisibility() {
        if (hideOriginalNotifications) {
            document.body.classList.add(BODY_CLASS_HIDE_ORIGINAL);
        } else {
            document.body.classList.remove(BODY_CLASS_HIDE_ORIGINAL);
        }
    }

    function resetBellPosition() {
        if (bellElement) {
            savedBellPos.top = null;
            savedBellPos.left = null;
            localStorage.removeItem(LS_BELL_POS_TOP);
            localStorage.removeItem(LS_BELL_POS_LEFT);
            positionBellIcon();
        }
    }

    function createSettingsPanel() {
        if (settingsPanel) return;

        settingsPanel = document.createElement('div');
        settingsPanel.id = 'evilbox-settings-panel';

        const header = document.createElement('div');
        header.className = 'settings-header';
        header.innerHTML = `<span>Paramètres</span><button class="close-btn" title="Fermer les paramètres">×</button>`;
        settingsPanel.appendChild(header);
        header.querySelector('.close-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            closeSettingsPanel();
        });
        header.addEventListener('mousedown', (e) => dragStart(e, settingsPanel));

        const content = document.createElement('div');
        content.className = 'settings-content';
        content.appendChild(createSettingSectionTitle('Apparence'));
        content.appendChild(createSettingItem(
            'Taille de la cloche (em):',
            `<input type="range" id="setting-bell-size" min="1.5" max="4.5" step="0.1" value="${currentBellSize}"> <span id="bell-size-value">${currentBellSize}em</span>`
        ));
        content.appendChild(createSettingItem(
            'Position de la cloche:',
            `<button id="setting-move-bell">Activer le déplacement</button>`
        ));
        content.appendChild(createSettingItem(
            'Masquer Notifications originales:',
            `<label class="switch"><input type="checkbox" id="setting-hide-original" ${hideOriginalNotifications ? 'checked' : ''}><span class="slider round"></span></label>`
        ));

        content.appendChild(createSettingSectionTitle('Son Notification'));
        content.appendChild(createSettingItem(
            'URL Son:',
            `<input type="text" id="setting-notify-sound-url" value="${currentNotifySoundUrl === DEFAULT_NOTIFY_SOUND_URL ? '' : currentNotifySoundUrl}" placeholder="URL .mp3, .wav, .ogg (ou laisser vide)">`
        ));
        content.appendChild(createSettingItem(
            'Volume Son:',
            `<input type="range" id="setting-notify-sound-volume" min="0" max="1" step="0.05" value="${currentNotifyVolume}">
             <span id="notify-volume-value">${Math.round(currentNotifyVolume * 100)}%</span>
             <button class="test-sound-btn" title="Tester le son">🔊</button>`
        ));
        settingsPanel.appendChild(content);

        document.body.appendChild(settingsPanel);
        applyPanelPosition(settingsPanel, savedSettingsPanelPos);

        const bellSizeInput = settingsPanel.querySelector('#setting-bell-size');
        const bellSizeValueSpan = settingsPanel.querySelector('#bell-size-value');
        bellSizeInput.addEventListener('input', () => {
            currentBellSize = parseFloat(bellSizeInput.value);
            bellSizeValueSpan.textContent = `${currentBellSize}em`;
            applyBellSize(currentBellSize);
            localStorage.setItem(LS_BELL_SIZE, currentBellSize);
        });

        const moveBellButton = settingsPanel.querySelector('#setting-move-bell');
        moveBellButton.addEventListener('click', toggleBellMoveMode);

        const hideOriginalCheckbox = settingsPanel.querySelector('#setting-hide-original');
        hideOriginalCheckbox.addEventListener('change', () => {
            hideOriginalNotifications = hideOriginalCheckbox.checked;
            localStorage.setItem(LS_HIDE_ORIGINAL_NOTIFS, hideOriginalNotifications);
            updateOriginalNotificationVisibility();
        });

        const notifySoundUrlInput = settingsPanel.querySelector('#setting-notify-sound-url');
        notifySoundUrlInput.addEventListener('change', () => {
            const newUrl = notifySoundUrlInput.value.trim();
            if (!newUrl) {
                 currentNotifySoundUrl = DEFAULT_NOTIFY_SOUND_URL;
                 localStorage.setItem(LS_NOTIFY_SOUND_URL, currentNotifySoundUrl);
                 notifyAlertAudio = null;
                 notifySoundUrlInput.value = '';
             } else if (newUrl.startsWith('http://') || newUrl.startsWith('https://')) {
                 currentNotifySoundUrl = newUrl;
                 localStorage.setItem(LS_NOTIFY_SOUND_URL, currentNotifySoundUrl);
                 notifyAlertAudio = null;
             } else {
                 notifySoundUrlInput.value = (currentNotifySoundUrl === DEFAULT_NOTIFY_SOUND_URL) ? '' : currentNotifySoundUrl;
             }
        });

        const notifyVolumeInput = settingsPanel.querySelector('#setting-notify-sound-volume');
        const notifyVolumeValueSpan = settingsPanel.querySelector('#notify-volume-value');
        notifyVolumeInput.addEventListener('input', () => {
            currentNotifyVolume = parseFloat(notifyVolumeInput.value);
            notifyVolumeValueSpan.textContent = `${Math.round(currentNotifyVolume * 100)}%`;
            localStorage.setItem(LS_NOTIFY_SOUND_VOLUME, currentNotifyVolume);
        });

        content.addEventListener('click', (event) => {
            if (event.target.classList.contains('test-sound-btn')) {
                const url = notifySoundUrlInput.value.trim() || DEFAULT_NOTIFY_SOUND_URL;
                const volume = notifyVolumeInput.value;
                testSound(url, volume);
            }
        });
    }

    function createSettingSectionTitle(title) {
        const titleDiv = document.createElement('div');
        titleDiv.className = 'setting-section-title';
        titleDiv.textContent = title;
        return titleDiv;
    }

    function createSettingItem(label, controlHtml) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'setting-item';
        itemDiv.innerHTML = `<label>${label}</label><div class="setting-control">${controlHtml}</div>`;
        return itemDiv;
    }

    function closeSettingsPanel() {
        if (settingsPanel && settingsPanel.parentNode) {
            if (isBellMoveModeActive) {
                 toggleBellMoveMode();
            }
            savePanelPosition(settingsPanel, LS_SETTINGS_PANEL_POS_TOP, LS_SETTINGS_PANEL_POS_LEFT, savedSettingsPanelPos);
            settingsPanel.parentNode.removeChild(settingsPanel);
            settingsPanel = null;
        }
    }

    function toggleSettingsPanel() {
        if (settingsPanel && settingsPanel.parentNode) {
            closeSettingsPanel();
        } else {
            if (historyPanel && historyPanel.parentNode) {
                closeHistoryPanel();
            }
            createSettingsPanel();
        }
    }

    function dragStart(e, panelElement) {
        if (e.button !== 0 || e.target.closest('button, input, select, textarea, .filter-button, .switch, .toggle-filters-btn, .remove-category-btn')) return;

        isDraggingPanel = true;
        const targetPanel = panelElement;

        initialMouseX = e.clientX;
        initialMouseY = e.clientY;

        const styles = window.getComputedStyle(targetPanel);
        const currentTop = targetPanel.style.top || styles.top;
        const currentLeft = targetPanel.style.left || styles.left;
        initialPanelTop = parseFloat(currentTop) || 50;
        initialPanelLeft = parseFloat(currentLeft) || (window.innerWidth - (parseFloat(styles.width) || 350) - 100);

        targetPanel.style.position = 'fixed';
        targetPanel.style.top = `${initialPanelTop}px`;
        targetPanel.style.left = `${initialPanelLeft}px`;
        targetPanel.style.right = 'unset';
        targetPanel.style.bottom = 'unset';

        e.preventDefault();
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', dragEnd);
        targetPanel.classList.add('dragging');
    }

    function dragMove(e) {
        if (!isDraggingPanel) return;
        const targetPanel = (settingsPanel && settingsPanel.classList.contains('dragging')) ? settingsPanel : historyPanel;
        if (!targetPanel) return;

        const dx = e.clientX - initialMouseX;
        const dy = e.clientY - initialMouseY;
        targetPanel.style.top = `${initialPanelTop + dy}px`;
        targetPanel.style.left = `${initialPanelLeft + dx}px`;
    }

    function dragEnd(e) {
        if (!isDraggingPanel) return;
        isDraggingPanel = false;
        const targetPanel = (settingsPanel && settingsPanel.classList.contains('dragging')) ? settingsPanel : historyPanel;

        document.removeEventListener('mousemove', dragMove);
        document.removeEventListener('mouseup', dragEnd);
        if (targetPanel) {
            targetPanel.classList.remove('dragging');
        }
    }

    function toggleBellMoveMode() {
        isBellMoveModeActive = !isBellMoveModeActive;
        const button = settingsPanel?.querySelector('#setting-move-bell');
        if (!bellElement || !button) return;

        if (isBellMoveModeActive) {
            bellElement.classList.add('bell-moving');
            bellElement.addEventListener('mousedown', bellDragStart);
            button.textContent = 'Arrêter le déplacement';
            button.classList.add('active');
        } else {
            bellElement.classList.remove('bell-moving');
            bellElement.removeEventListener('mousedown', bellDragStart);
            button.textContent = 'Activer le déplacement';
            button.classList.remove('active');
            saveBellPosition();
        }
    }

    function bellDragStart(e) {
        if (e.button !== 0 || !isBellMoveModeActive) return;
        e.preventDefault();
        e.stopPropagation();

        isDraggingBell = true;
        initialBellDragX = e.clientX;
        initialBellDragY = e.clientY;
        initialBellLeft = bellElement.offsetLeft;
        initialBellTop = bellElement.offsetTop;
        bellElement.style.cursor = 'grabbing';

        document.addEventListener('mousemove', bellDragMove);
        document.addEventListener('mouseup', bellDragEnd);
    }

    function bellDragMove(e) {
        if (!isDraggingBell) return;
        e.preventDefault();

        const dx = e.clientX - initialBellDragX;
        const dy = e.clientY - initialBellDragY;
        const newTop = initialBellTop + dy;
        const newLeft = initialBellLeft + dx;

        bellElement.style.left = `${newLeft}px`;
        bellElement.style.top = `${newTop}px`;
    }

    function bellDragEnd(e) {
        if (!isDraggingBell) return;
        e.preventDefault();
        isDraggingBell = false;
        bellElement.style.cursor = 'pointer';

        document.removeEventListener('mousemove', bellDragMove);
        document.removeEventListener('mouseup', bellDragEnd);
    }

     function saveBellPosition() {
        if (bellElement) {
            const finalTop = bellElement.style.top;
            const finalLeft = bellElement.style.left;
            localStorage.setItem(LS_BELL_POS_TOP, finalTop);
            localStorage.setItem(LS_BELL_POS_LEFT, finalLeft);
            savedBellPos.top = finalTop;
            savedBellPos.left = finalLeft;
        }
     }

     function positionBellIcon() {
         if (!bellElement) return;

         const logoutLi = document.querySelector('li.logout');
         const parentUl = logoutLi ? logoutLi.closest('ul') : null;
         if (!logoutLi || !parentUl) return;

         if (savedBellPos.top !== null && savedBellPos.left !== null) {
             applyBellPosition(savedBellPos.top, savedBellPos.left);
         } else {
            requestAnimationFrame(() => {
                 try {
                     const logoutLiRect = logoutLi.getBoundingClientRect();
                     const parentRect = parentUl.getBoundingClientRect();
                     const bellRect = bellElement.getBoundingClientRect();
                     const topOffset = (logoutLiRect.bottom - parentRect.top) + BELL_MARGIN_TOP;
                     const bellWidth = bellRect.width;
                     const effectiveBellWidth = Math.max(1, bellWidth);
                     const leftOffset = (logoutLiRect.left + logoutLiRect.width / 2) - parentRect.left - (effectiveBellWidth / 2);
                     applyBellPosition(`${topOffset}px`, `${leftOffset}px`);
                 } catch(e) {
                     applyBellPosition('60px', '20px');
                 }
             });
         }
         bellElement.style.visibility = 'visible';
    }

    function addBellIcon() {
        clearTimeout(addBellIconTimeout);
        if (document.getElementById('evilbox-history-bell')) return;

        const logoutLi = document.querySelector('li.logout');
        const parentUl = logoutLi ? logoutLi.closest('ul') : null;

        if (!logoutLi || !parentUl) {
            addBellIconRetryCount++;
            if (addBellIconRetryCount <= MAX_RETRIES) {
                addBellIconTimeout = setTimeout(addBellIcon, RETRY_DELAY);
            }
            return;
        }
        addBellIconRetryCount = 0;

        const parentStyle = window.getComputedStyle(parentUl);
        if (parentStyle.position === 'static') {
             parentUl.style.position = 'relative';
        }

        bellElement = document.createElement('li');
        bellElement.id = 'evilbox-history-bell';
        bellElement.className = 'link couleur5';
        bellElement.title = "Afficher/Masquer l'historique des notifications";
        bellElement.style.position = 'absolute';
        bellElement.style.cursor = 'pointer';
        bellElement.style.zIndex = SCRIPT_Z_INDEX_BASE - 1;
        bellElement.style.padding = '2px 5px';
        bellElement.style.margin = '0';
        bellElement.style.listStyle = 'none';
        bellElement.style.whiteSpace = 'nowrap';
        bellElement.style.visibility = 'hidden';
        applyBellSize(currentBellSize);

        const bellEmojiSpan = document.createElement('span');
        bellEmojiSpan.textContent = '🔔';
        bellElement.appendChild(bellEmojiSpan);

        counterElement = document.createElement('span');
        counterElement.id = 'evilbox-unread-counter';
        counterElement.style.display = 'none';
        bellElement.appendChild(counterElement);

        parentUl.appendChild(bellElement);

        bellElement.addEventListener('animationend', () => {
            if (bellElement) bellElement.classList.remove('shake');
        });
        bellElement.addEventListener('click', toggleHistoryPanel);

        positionBellIcon();
        updateUnreadCounterDisplay();
    }

    function initializeKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key.toLowerCase() === 'p') {
                e.preventDefault();
                resetBellPosition();
            }
        });
    }

    function processDismissQueue() {
        if (evilBoxDismissQueue.size === 0) {
            return;
        }

        const idsToDismiss = Array.from(evilBoxDismissQueue);
        evilBoxDismissQueue.clear();

        idsToDismiss.forEach(evilBoxId => {
            const liveEvilBox = document.getElementById(evilBoxId);
            if (liveEvilBox && document.body.contains(liveEvilBox)) {
                if (typeof $ === 'function' && $(liveEvilBox).length) {
                    $(liveEvilBox).trigger('click');
                } else if (typeof liveEvilBox.click === 'function') {
                    liveEvilBox.click();
                }
            }
        });
    }


    const originalXhrOpen = XMLHttpRequest.prototype.open;
    const originalXhrSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
        this._requestMethod = method;
        this._requestUrl = url;
        return originalXhrOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function() {
        if (this._requestMethod?.toUpperCase() === 'POST' && this._requestUrl?.includes(CHECK_URL)) {
             this.addEventListener('load', function() {
                 if (this.readyState === 4 && this.status === 200 && this.responseText) {
                     try {
                         const parser = new DOMParser();
                         const doc = parser.parseFromString(this.responseText, "text/html");
                         const allEvilBoxDivs = doc.querySelectorAll('div.evilBox');

                         let soundPlayedThisCycle = false;
                         const newEntriesForThisCheck = [];
                         const baseTimestamp = Date.now();
                         let newCategoriesDiscoveredInThisBatch = false;
                         let newAlertableNotificationsCount = 0;

                         allEvilBoxDivs.forEach((boxDiv, index) => {
                            const parentEvilBoxElement = boxDiv.closest('evilbox') || boxDiv;
                            let historyHtml = parentEvilBoxElement.outerHTML;

                            const originalEntryCategories = Array.from(boxDiv.classList).filter(cls =>
                                cls !== 'evilBox' && !cls.startsWith('eb_') && !cls.startsWith('un-') && cls.trim() !== ''
                            );

                            originalEntryCategories.forEach(cat => {
                                const effectiveCat = getEffectiveCategoryKey(cat);
                                if (!notificationCategories.has(effectiveCat)) {
                                    notificationCategories.add(effectiveCat);
                                    categoryStates[effectiveCat] = 'inactive';
                                    newCategoriesDiscoveredInThisBatch = true;
                                }
                            });

                            const uniqueId = `${baseTimestamp}-${index}`;
                            const historyEntry = { id: uniqueId, timestamp: new Date(), html: historyHtml, categories: originalEntryCategories };
                            evilBoxHistory.push(historyEntry);
                            newEntriesForThisCheck.push(historyEntry);
                            if (evilBoxHistory.length > MAX_HISTORY_ENTRIES) { evilBoxHistory.shift(); }

                            const isExcludedByFilter = originalEntryCategories.some(specificCat => {
                                const effectiveCat = getEffectiveCategoryKey(specificCat);
                                return categoryStates[effectiveCat] === 'excluded';
                            });

                            if (hideOriginalNotifications && isExcludedByFilter) {
                                const evilBoxId = boxDiv.id;
                                if (evilBoxId) {
                                    evilBoxDismissQueue.add(evilBoxId);
                                }
                            }

                            if (!isExcludedByFilter) {
                                newAlertableNotificationsCount++;
                                if (!soundPlayedThisCycle && hideOriginalNotifications) {
                                    playNotificationSound();
                                    soundPlayedThisCycle = true;
                                }
                            }
                         });

                         if (newCategoriesDiscoveredInThisBatch) {
                             saveNotificationCategories();
                             saveCategoryStates();
                         }

                         if (newEntriesForThisCheck.length > 0) {
                             if (newAlertableNotificationsCount > 0 && bellElement) {
                                 bellElement.classList.remove('shake');
                                 void bellElement.offsetWidth;
                                 bellElement.classList.add('shake');
                             }
                             if (historyPanel && historyPanel.parentNode) {
                                 const contentArea = historyPanel.querySelector('.history-content');
                                 if (contentArea) {
                                     if (newCategoriesDiscoveredInThisBatch) {
                                         loadCategoryStates();
                                         const filterArea = historyPanel.querySelector('.filter-button-container');
                                         if (filterArea) {
                                            rebuildFilterButtonsUI(filterArea);
                                         }
                                     }
                                     newEntriesForThisCheck.reverse().forEach(entry => {
                                         const itemElement = createNotificationElement(entry);
                                         contentArea.prepend(itemElement);
                                     });
                                      const historyItemsInDOM = contentArea.querySelectorAll('.history-item');
                                      if (historyItemsInDOM.length > MAX_HISTORY_ENTRIES) {
                                          for (let i = MAX_HISTORY_ENTRIES; i < historyItemsInDOM.length; i++) { historyItemsInDOM[i].remove(); }
                                      }
                                     filterNotifications(historyPanel.querySelector('.filter-button-container'));
                                 }
                             } else {
                                 unreadCount += newAlertableNotificationsCount;
                                 updateUnreadCounterDisplay();
                             }
                         }
                     } catch (e) {}
                 }
             });
        }
        return originalXhrSend.apply(this, arguments);
    };

    GM_addStyle(`
        @keyframes shake {
            10%, 90% { transform: translate3d(-2px, 0, 0) rotate(-2deg); }
            20%, 80% { transform: translate3d(4px, 0, 0) rotate(4deg); }
            30%, 50%, 70% { transform: translate3d(-6px, 0, 0) rotate(-6deg); }
            40%, 60% { transform: translate3d(6px, 0, 0) rotate(6deg); }
        }
        .shake {
            animation: shake ${SHAKE_ANIMATION_DURATION / 1000}s cubic-bezier(.36,.07,.19,.97) both;
            transform-origin: center bottom;
            backface-visibility: hidden; perspective: 1000px;
        }
        body.${BODY_CLASS_HIDE_ORIGINAL} > evilbox,
        body.${BODY_CLASS_HIDE_ORIGINAL} > div.evilBox,
        body.${BODY_CLASS_HIDE_ORIGINAL} #zone_evilBox {
            position: absolute !important; left: -9999px !important; top: -9999px !important;
            opacity: 0 !important; pointer-events: none !important; visibility: hidden !important;
            width: 1px !important; height: 1px !important; overflow: hidden !important;
            display: block !important;
            z-index: -1 !important;
        }
        #evilbox-history-bell {
            line-height: 1 !important;
            vertical-align: middle;
            user-select: none;
            transition: transform 0.2s ease-out, opacity 0.2s ease;
            transform-origin: center center;
        }
        #evilbox-history-bell > span:first-of-type {
             vertical-align: middle; display: inline-block;
             transition: transform 0.2s ease;
        }
        #evilbox-history-bell.bell-moving {
            border: 2px dashed #FFEB3B;
            background-color: rgba(255, 235, 59, 0.25);
            cursor: grabbing !important;
            box-shadow: 0 0 8px rgba(255, 235, 59, 0.5);
        }
        #evilbox-history-bell:hover:not(.bell-moving) {
            transform: scale(1.1);
        }
        #evilbox-unread-counter {
            position: absolute;
            bottom: -10px;
            left: -14px;
            font-size: 16px;
            min-width: 27px;
            height: 27px;
            background-color: red; color: white;
            border-radius: 50%;
            font-weight: bold;
            display: flex; justify-content: center; align-items: center;
            line-height: 1;
            z-index: ${SCRIPT_Z_INDEX_BASE};
            pointer-events: none;
            box-sizing: border-box;
            user-select: none;
        }
        #evilbox-history-panel, #evilbox-settings-panel {
            position: fixed;
            width: 350px;
            max-height: 80vh;
            background-color: #2f2f2f;
            border: 1px solid #777;
            border-radius: 6px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
            z-index: ${SCRIPT_Z_INDEX_BASE};
            color: #ddd;
            font-size: 14px;
            display: flex; flex-direction: column;
            overflow: hidden;
            box-sizing: border-box;
            cursor: default;
        }
        #evilbox-history-panel { top: 50px; right: 100px; left: unset; }
        #evilbox-settings-panel { top: 60px; right: 120px; left: unset; z-index: ${SCRIPT_Z_INDEX_BASE + 1}; }
        #evilbox-history-panel.dragging, #evilbox-settings-panel.dragging {
             cursor: grabbing !important;
             user-select: none;
             opacity: 0.9;
        }
        #evilbox-history-panel[style*="visibility: hidden"],
        #evilbox-settings-panel[style*="visibility: hidden"] { visibility: visible !important; }
        #evilbox-history-panel[style*="display: none"],
        #evilbox-settings-panel[style*="display: none"] { display: flex !important; }
        .history-header, .settings-header {
            display: flex; justify-content: space-between; align-items: center;
            padding: 10px 15px;
            background-color: #3a3a3a;
            border-bottom: 1px solid #555;
            font-weight: bold;
            flex-shrink: 0;
            cursor: grab;
            user-select: none;
        }
        .history-header:active, .settings-header:active { cursor: grabbing; }
        .history-header-controls { display: flex; align-items: center; gap: 8px; }
        .history-header .close-btn, .settings-header .close-btn,
        .history-header .settings-btn {
            background: none; border: none; color: #ccc;
            font-size: 1.6em;
            line-height: 1; cursor: pointer; padding: 0 5px;
            font-weight: bold; transition: color 0.2s ease;
            vertical-align: middle;
        }
         .history-header .settings-btn { font-size: 1.3em; }
        .history-header .close-btn:hover, .settings-header .close-btn:hover,
        .history-header .settings-btn:hover { color: #fff; }

        .filters-toggle-container {
            background-color: #333;
            border-bottom: 1px solid #555;
            flex-shrink: 0;
        }
        .toggle-filters-btn {
            background-color: transparent;
            color: #ccc;
            border: none;
            padding: 6px 12px;
            width: 100%;
            text-align: left;
            font-size: 0.9em;
            cursor: pointer;
            user-select: none;
            transition: background-color 0.2s;
        }
        .toggle-filters-btn:hover {
            background-color: #404040;
        }
        .filter-buttons-wrapper {
            max-height: 300px;
            overflow-y: auto;
            transition: max-height 0.3s ease-out, padding 0.3s ease-out, opacity 0.3s ease-out;
            padding: 8px 12px;
            opacity: 1;
        }
        .filter-buttons-wrapper.collapsed {
            max-height: 0;
            padding-top: 0;
            padding-bottom: 0;
            opacity: 0;
            overflow: hidden;
        }
        .filter-button-container {
            display: flex; flex-wrap: wrap; gap: 8px;
        }
        .filter-button {
            background-color: #555; color: #ddd; border: 1px solid #777; border-radius: 4px;
            padding: 4px 6px 4px 10px; font-size: 0.9em; cursor: pointer;
            transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease; user-select: none;
            display: inline-flex; align-items: center;
        }
        .filter-button:hover { background-color: #666; border-color: #888; }
        .filter-button.active {
            background-color: #8ab4f8;
            color: #1a1a1a;
            border-color: #8ab4f8; font-weight: bold;
        }
        .filter-button.excluded {
            background-color: #f28b82;
            color: #1a1a1a;
            border-color: #f28b82; font-weight: bold;
        }
        .filter-button.excluded .filter-button-text {
             text-decoration: line-through;
        }
        .filter-button-text {
            margin-right: 4px;
            flex-grow: 1;
            text-align: left;
        }
        .remove-category-btn {
            font-size: 1.1em;
            font-weight: bold;
            color: #aaa;
            margin-left: 5px;
            padding: 0 4px;
            border-radius: 3px;
            line-height: 1;
            cursor: pointer;
            transition: color 0.2s ease, background-color 0.2s ease;
        }
        .filter-button:hover .remove-category-btn {
            color: #ddd;
        }
        .remove-category-btn:hover {
            background-color: rgba(0,0,0,0.2);
            color: #fff !important;
        }
        .filter-button.active .remove-category-btn,
        .filter-button.excluded .remove-category-btn {
            color: #333;
        }
        .filter-button.active:hover .remove-category-btn,
        .filter-button.excluded:hover .remove-category-btn {
            color: #000;
        }


        #evilbox-history-panel .history-content {
            padding: 5px 12px 10px 12px;
            overflow-y: auto;
            flex-grow: 1;
            min-height: 50px;
        }
        #evilbox-history-panel .history-item {
            position: relative;
            border-bottom: 1px dashed #555;
            padding: 10px 25px 10px 5px;
            margin-bottom: 5px;
        }
        #evilbox-history-panel .history-item:last-child { border-bottom: none; padding-bottom: 5px; margin-bottom: 0; }
        #evilbox-history-panel .history-timestamp {
            display: block; font-size: 0.85em; color: #999;
            margin-bottom: 6px;
        }
        #evilbox-history-panel .dismiss-btn {
            position: absolute; top: 8px; right: 5px;
            background: none; border: none; color: #888;
            font-size: 1.5em; font-weight: bold; line-height: 1;
            padding: 0 4px; cursor: pointer; opacity: 0.7;
            z-index: 1;
            transition: color 0.2s, opacity 0.2s;
        }
        #evilbox-history-panel .dismiss-btn:hover { color: #eee; opacity: 1; }
        #evilbox-history-panel .empty-filter-message,
        #evilbox-history-panel .history-content > p > i {
            text-align: center; color: #888; margin-top: 15px; font-style: italic;
        }
        #evilbox-history-panel .history-evilbox-content evilbox,
        #evilbox-history-panel .history-evilbox-content div.evilBox {
            display: block !important; visibility: visible !important; position: relative !important;
            left: auto !important; top: auto !important; opacity: 1 !important;
            padding: 8px 10px; margin: 0 0 5px 0; border: 1px solid #444;
            background-color: #383838; border-radius: 4px; min-height: 10px;
            box-sizing: border-box; z-index: auto !important; width: auto !important;
            height: auto !important; overflow: visible !important; color: #ccc;
            font-size: 1em;
        }
        #evilbox-history-panel .history-evilbox-content .action { display: none !important; }
        #evilbox-history-panel .history-evilbox-content .couleur4 { color: #FFC107 !important; }
        #evilbox-history-panel .history-evilbox-content .couleur2 { color: #90EE90 !important; }
        #evilbox-history-panel .history-evilbox-content .couleur5 { color: #bbb !important; }
        #evilbox-history-panel .history-evilbox-content .link {
             cursor: pointer !important; text-decoration: underline !important; color: #8ab4f8 !important;
        }
        #evilbox-history-panel .history-evilbox-content .link:hover { color: #a8c7fa !important; }
        #evilbox-history-panel .history-evilbox-content .titre {
             font-weight: bold !important; margin-bottom: 4px !important; display: block !important; color: #eee !important;
        }
        #evilbox-history-panel .history-evilbox-content .content {
             margin-bottom: 4px !important; display: block !important; line-height: 1.4;
        }
        #evilbox-settings-panel .settings-content {
            padding: 15px 20px; overflow-y: auto; flex-grow: 1;
        }
         .setting-section-title {
            font-size: 1.1em; font-weight: bold; color: #eee; margin-top: 20px;
            margin-bottom: 15px; padding-bottom: 5px; border-bottom: 1px solid #555;
         }
         .setting-section-title:first-of-type { margin-top: 0; }
        .setting-item {
            margin-bottom: 15px; display: flex; flex-direction: column; gap: 6px;
        }
        .setting-item label:not(.switch) {
            font-weight: bold; color: #bbb; font-size: 0.95em;
            display: block;
            margin-bottom: 4px;
        }
        .setting-control {
            display: flex; align-items: center; gap: 8px;
        }
        .setting-control input[type="range"] {
            flex-grow: 1; cursor: pointer; margin: 0 5px;
        }
         .setting-control input[type="text"] {
             flex-grow: 1; padding: 6px 9px; background-color: #444;
             border: 1px solid #666; color: #ddd; border-radius: 4px;
             font-size: 0.95em;
         }
         .setting-control input[type="text"]:focus {
             outline: none; border-color: #8ab4f8; box-shadow: 0 0 3px rgba(138, 180, 248, 0.5);
         }
         .setting-control button:not(.test-sound-btn) {
            background-color: #555; color: #ddd; border: 1px solid #777; border-radius: 4px;
            padding: 6px 14px; font-size: 0.9em; cursor: pointer;
            transition: background-color 0.2s ease; user-select: none;
         }
         .setting-control button:not(.test-sound-btn):hover { background-color: #666; }
         .setting-control button#setting-move-bell.active {
             background-color: #c8a03a; color: #1a1a1a; border-color: #c8a03a; font-weight: bold;
         }
         .setting-control span {
             font-size: 0.9em; color: #aaa; min-width: 45px; text-align: right;
             user-select: none;
         }
         .setting-control .test-sound-btn {
            background: none; border: none; color: #bbb; font-size: 1.6em; line-height: 1;
            padding: 0 5px; cursor: pointer; transition: color 0.2s ease;
            order: 3; margin-left: 5px;
         }
         .setting-control .test-sound-btn:hover { color: #fff; }
         .setting-control .test-sound-btn:active { transform: scale(0.9); }

         .setting-control .switch {
             position: relative;
             display: inline-block;
             width: 40px;
             height: 14px;
             margin: 2px 0;
         }
         .setting-control .switch input {
             opacity: 0;
             width: 0;
             height: 0;
         }
         .setting-control .slider {
             position: absolute;
             cursor: pointer;
             top: 0;
             left: 0;
             right: 0;
             bottom: 0;
             background-color: #393939;
             transition: .2s ease-in-out;
             border-radius: 7px;
             border: 1px solid #555;
             box-shadow: inset 0 1px 1px rgba(0,0,0,0.15);
         }
         .setting-control .slider:before {
             position: absolute;
             content: "";
             height: 10px;
             width: 10px;
             left: 2px;
             top: 50%;
             transform: translateY(-50%);
             background-color: #fff;
             transition: .2s ease-in-out;
             border-radius: 50%;
             box-shadow: 0 1px 2px rgba(0,0,0,0.2);
         }
         .setting-control input:checked + .slider {
             background-color: #2196F3;
             border-color: #1976D2;
         }
         .setting-control input:checked + .slider:before {
             transform: translateY(-50%) translateX(25px);
         }
         .setting-control input:focus + .slider {
             border-color: #8ab4f8;
             box-shadow: 0 0 1px #8ab4f8;
         }
         .setting-control .slider:hover {
             border-color: #666;
             background-color: #424242;
         }
         .setting-control input:checked + .slider:hover {
             border-color: #1976D2;
             background-color: #42A5F5;
         }
         .setting-item .setting-control label.switch {
             margin: 0;
         }
    `);

    function initializeScript() {
        addBellIconRetryCount = 0;
        addBellIcon();
        initializeKeyboardShortcuts();
        updateOriginalNotificationVisibility();
        if (cleanupIntervalId === null) {
            cleanupIntervalId = setInterval(processDismissQueue, PERIODIC_CLEANUP_INTERVAL);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        initializeScript();
    }

})();