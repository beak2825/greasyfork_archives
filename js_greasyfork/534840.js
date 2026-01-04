// ==UserScript==
// @name         Dreadcast notifications (alert)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Notifications dans une interface avec options
// @author       Laïn
// @match        https://www.dreadcast.net/Main*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/534840/Dreadcast%20notifications%20%28alert%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534840/Dreadcast%20notifications%20%28alert%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Constants ---
    const CHECK_URL = 'https://www.dreadcast.net/Check';
    const MAX_HISTORY_ENTRIES = 50;
    const SCRIPT_Z_INDEX_BASE = 100001;
    const ALERT_BOX_SELECTOR = 'div.evilBox.un-combat-eclate--, div.evilBox[id^="eb_combat_"], div.evilBox[id^="eb_attaque_"]';
    const BELL_MARGIN_TOP = 10;
    const MAX_RETRIES = 10;
    const RETRY_DELAY = 750;
    const SHAKE_ANIMATION_DURATION = 800;

    // --- Default Settings ---
    const DEFAULT_COMBAT_SOUND_URL = 'https://www.myinstants.com/media/sounds/tindeck_1.mp3';
    const DEFAULT_COMBAT_VOLUME = 0.7;
    const DEFAULT_OTHER_SOUND_URL = 'https://www.myinstants.com/media/sounds/pusheen_the_cat.mp3';
    const DEFAULT_OTHER_VOLUME = 0.5;
    const DEFAULT_BELL_SIZE_EM = 2.7;

    // --- localStorage Keys ---
    const LS_BELL_SIZE = 'dcNotify_bellSize';
    const LS_BELL_POS_TOP = 'dcNotify_bellPosTop';
    const LS_BELL_POS_LEFT = 'dcNotify_bellPosLeft';
    const LS_COMBAT_SOUND_URL = 'dcNotify_combatSoundUrl';
    const LS_COMBAT_SOUND_VOLUME = 'dcNotify_combatSoundVolume';
    const LS_OTHER_SOUND_URL = 'dcNotify_otherSoundUrl';
    const LS_OTHER_SOUND_VOLUME = 'dcNotify_otherSoundVolume';

    // --- State Variables ---
    let evilBoxHistory = [];
    let notificationCategories = new Set();
    let combatAlertAudio = null;
    let otherAlertAudio = null;
    let historyPanel = null;
    let settingsPanel = null;
    let unreadCount = 0;
    let counterElement = null;
    let addBellIconTimeout = null;
    let addBellIconRetryCount = 0;
    let isDraggingPanel = false;
    let initialMouseX = 0, initialMouseY = 0, initialPanelTop = 0, initialPanelLeft = 0;
    let currentFilter = 'Tous';
    let bellElement = null;
    let isBellMoveModeActive = false;
    let isDraggingBell = false;
    let initialBellDragX = 0, initialBellDragY = 0, initialBellTop = 0, initialBellLeft = 0;

    // --- Settings Variables ---
    let currentBellSize = parseFloat(localStorage.getItem(LS_BELL_SIZE) || DEFAULT_BELL_SIZE_EM);
    let currentCombatSoundUrl = localStorage.getItem(LS_COMBAT_SOUND_URL) || DEFAULT_COMBAT_SOUND_URL;
    let currentCombatVolume = parseFloat(localStorage.getItem(LS_COMBAT_SOUND_VOLUME) || DEFAULT_COMBAT_VOLUME);
    let currentOtherSoundUrl = localStorage.getItem(LS_OTHER_SOUND_URL) || DEFAULT_OTHER_SOUND_URL;
    let currentOtherVolume = parseFloat(localStorage.getItem(LS_OTHER_SOUND_VOLUME) || DEFAULT_OTHER_VOLUME);
    let savedBellPos = {
        top: localStorage.getItem(LS_BELL_POS_TOP),
        left: localStorage.getItem(LS_BELL_POS_LEFT)
    };

    // --- Sound Functions ---
    function playCombatSound() {
        // Play only if history panel is closed
        if (historyPanel && historyPanel.parentNode) {
            console.log("History panel open, skipping combat sound.");
            return;
        }
        // Use the saved/current settings
        testSound('combat', currentCombatSoundUrl, currentCombatVolume);
    }

    function playOtherSound() {
        // Play only if history panel is closed
        if (historyPanel && historyPanel.parentNode) {
            console.log("History panel open, skipping other sound.");
             return;
         }
        // Use the saved/current settings
        testSound('other', currentOtherSoundUrl, currentOtherVolume);
    }

    // Function to test sound directly from settings panel values
    function testSound(type, url, volume) {
        let audioObject;
        let logPrefix;

        if (type === 'combat') {
            audioObject = combatAlertAudio;
            logPrefix = "Combat";
        } else if (type === 'other') {
            audioObject = otherAlertAudio;
            logPrefix = "Other";
        } else {
            console.error("Invalid sound type for testing:", type);
            return;
        }

        // Validate URL basic check
        if (!url || !(url.startsWith('http://') || url.startsWith('https://'))) {
            console.warn(`${logPrefix} test sound: Invalid or empty URL: ${url}`);
            alert(`URL ${logPrefix} invalide ou vide.`);
            return;
        }

        // Validate Volume
        volume = parseFloat(volume);
        if (isNaN(volume) || volume < 0 || volume > 1) {
             console.warn(`${logPrefix} test sound: Invalid volume: ${volume}. Using 0.5`);
             volume = 0.5; // Fallback volume
        }

        try {
            // Always create a new Audio object for testing to ensure it reflects current settings
            // and avoids issues with already playing sounds.
            console.log(`${logPrefix} test sound: Playing ${url} at volume ${volume}`);
            const testAudio = new Audio(url);
            testAudio.volume = volume;
            testAudio.play().catch(error => {
                console.error(`${logPrefix} test audio play failed:`, error);
                alert(`Erreur lors de la lecture du son ${logPrefix}: ${error.message}`);
            });
        } catch (e) {
            console.error(`Error creating test Audio object for ${type}:`, e);
            alert(`Erreur lors de la création de l'objet audio ${logPrefix}. Vérifiez l'URL.`);
        }
    }


    // --- UI Update Functions ---
    // ... (updateUnreadCounterDisplay, applyBellSize, applyBellPosition remain the same)
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


    // --- History Panel Functions ---
    // ... (dismissNotification, createNotificationElement, filterNotifications, showHistoryPanel, closeHistoryPanel, toggleHistoryPanel remain the same)
    function dismissNotification(idToDismiss) {
        const initialLength = evilBoxHistory.length;
        evilBoxHistory = evilBoxHistory.filter(entry => entry.id !== idToDismiss);
        const removed = initialLength > evilBoxHistory.length;

        if (removed && historyPanel) {
            const itemElement = historyPanel.querySelector(`.history-item[data-id="${idToDismiss}"]`);
            if (itemElement) { itemElement.remove(); }
            const contentArea = historyPanel.querySelector('.history-content');
            if (contentArea && evilBoxHistory.length === 0 && !contentArea.querySelector('p > i')) {
                 contentArea.innerHTML = "<p><i>Aucune notification détectée pour le moment.</i></p>";
            } else if (contentArea && !contentArea.querySelector('.history-item:not([style*="display: none"])') && currentFilter !== 'Tous') {
                filterNotifications(currentFilter, historyPanel.querySelector('.filter-button-container'));
            }
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
        try { timeSpan.textContent = entry.timestamp.toLocaleTimeString([], timeOptions); }
        catch (e) { timeSpan.textContent = entry.timestamp.toLocaleTimeString(); }

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
            console.error("Error rendering notification content:", e, entry.html);
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

     function filterNotifications(category, buttonContainer) {
        currentFilter = category;
        if (!buttonContainer) return;

        const buttons = buttonContainer.querySelectorAll('.filter-button');
        buttons.forEach(btn => {
            if (btn.dataset.category === category) { btn.classList.add('active'); }
            else { btn.classList.remove('active'); }
        });
        const contentArea = historyPanel?.querySelector('.history-content');
        if (!contentArea) return;
        const items = contentArea.querySelectorAll('.history-item');
        let hasVisibleItems = false;
        items.forEach(item => {
            let categories = [];
            try { categories = JSON.parse(item.dataset.categories || '[]'); } catch(e) { console.warn("Failed to parse categories:", item.dataset.categories)}
            if (category === 'Tous' || (Array.isArray(categories) && categories.includes(category))) {
                item.style.display = ''; hasVisibleItems = true;
            } else {
                item.style.display = 'none';
            }
        });

        const emptyMsgElement = contentArea.querySelector('.empty-filter-message');
        if (emptyMsgElement) { emptyMsgElement.remove(); }

        if (!hasVisibleItems && category !== 'Tous' && evilBoxHistory.length > 0) {
            const p = document.createElement('p'); p.className = 'empty-filter-message';
            p.innerHTML = `<i>Aucune notification pour la catégorie "${category}".</i>`;
            contentArea.appendChild(p);
        } else if (evilBoxHistory.length === 0 && !contentArea.querySelector('p > i')) {
             contentArea.innerHTML = "<p><i>Aucune notification détectée pour le moment.</i></p>";
        }
    }

    function showHistoryPanel() {
        closeSettingsPanel();
        unreadCount = 0;
        updateUnreadCounterDisplay();

        historyPanel = document.createElement('div');
        historyPanel.id = 'evilbox-history-panel';

        const header = document.createElement('div');
        header.className = 'history-header';

        const titleSpan = document.createElement('span');
        titleSpan.textContent = "Historique des Notifications";

        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'history-header-controls';

        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'settings-btn';
        settingsBtn.innerHTML = '⚙️';
        settingsBtn.title = 'Ouvrir les paramètres';
        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSettingsPanel();
        });

        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-btn';
        closeBtn.innerHTML = '×';
        closeBtn.title = 'Fermer l\'historique';
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeHistoryPanel();
        });

        controlsDiv.appendChild(settingsBtn);
        controlsDiv.appendChild(closeBtn);
        header.appendChild(titleSpan);
        header.appendChild(controlsDiv);
        historyPanel.appendChild(header);
        header.addEventListener('mousedown', (e) => dragStart(e, historyPanel));

        const filterArea = document.createElement('div');
        filterArea.className = 'filter-button-container';
        function createFilterButton(category, text) {
            const button = document.createElement('button');
            button.className = 'filter-button';
            button.textContent = text;
            button.dataset.category = category;
            if (currentFilter === category) button.classList.add('active');
            button.addEventListener('click', () => filterNotifications(category, filterArea));
            return button;
        }
        filterArea.appendChild(createFilterButton('Tous', 'Tous'));
        Array.from(notificationCategories).sort().forEach(category => {
            const displayText = category.charAt(0).toUpperCase() + category.slice(1);
            filterArea.appendChild(createFilterButton(category, displayText));
        });
        historyPanel.appendChild(filterArea);

        const contentArea = document.createElement('div');
        contentArea.className = 'history-content';
        historyPanel.appendChild(contentArea);

        if (evilBoxHistory.length === 0) {
            contentArea.innerHTML = "<p><i>Aucune notification détectée pour le moment.</i></p>";
        } else {
             [...evilBoxHistory].reverse().forEach((entry) => {
                const itemElement = createNotificationElement(entry);
                let categories = entry.categories || [];
                if (currentFilter !== 'Tous' && !categories.includes(currentFilter)) {
                    itemElement.style.display = 'none';
                }
                contentArea.appendChild(itemElement);
            });
            const visibleItems = contentArea.querySelectorAll('.history-item:not([style*="display: none"])');
            if(visibleItems.length === 0 && currentFilter !== 'Tous') {
                const p = document.createElement('p'); p.className = 'empty-filter-message'; p.innerHTML = `<i>Aucune notification pour la catégorie "${currentFilter}".</i>`; contentArea.appendChild(p);
            }
        }
        document.body.appendChild(historyPanel);
    }

    function closeHistoryPanel() {
         if (historyPanel && historyPanel.parentNode) {
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


    // --- Settings Panel Functions ---
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

        // --- Bell Settings ---
        content.appendChild(createSettingSectionTitle('Apparence'));
        content.appendChild(createSettingItem(
            'Taille de la cloche (em):',
            `<input type="range" id="setting-bell-size" min="1.5" max="4.5" step="0.1" value="${currentBellSize}"> <span id="bell-size-value">${currentBellSize}em</span>`
        ));
        content.appendChild(createSettingItem(
            'Position de la cloche:',
            `<button id="setting-move-bell">Activer le déplacement</button>`
        ));

        // --- Combat Sound Settings ---
        content.appendChild(createSettingSectionTitle('Son Notification Combat/Attaque'));
        content.appendChild(createSettingItem(
            'URL Son (Combat):',
            `<input type="text" id="setting-combat-sound-url" value="${currentCombatSoundUrl}" placeholder="URL .mp3, .wav, .ogg">`
        ));
        content.appendChild(createSettingItem(
            'Volume Son (Combat):',
            `<input type="range" id="setting-combat-sound-volume" min="0" max="1" step="0.05" value="${currentCombatVolume}">
             <span id="combat-volume-value">${Math.round(currentCombatVolume * 100)}%</span>
             <button class="test-sound-btn" data-type="combat" title="Tester le son Combat">🔊</button>` // Added Test Button
        ));

        // --- Other Sound Settings ---
        content.appendChild(createSettingSectionTitle('Son Notification Autre'));
        content.appendChild(createSettingItem(
            'URL Son (Autre):',
            `<input type="text" id="setting-other-sound-url" value="${currentOtherSoundUrl}" placeholder="URL .mp3, .wav, .ogg">`
        ));
        content.appendChild(createSettingItem(
            'Volume Son (Autre):',
            `<input type="range" id="setting-other-sound-volume" min="0" max="1" step="0.05" value="${currentOtherVolume}">
             <span id="other-volume-value">${Math.round(currentOtherVolume * 100)}%</span>
             <button class="test-sound-btn" data-type="other" title="Tester le son Autre">🔊</button>` // Added Test Button
        ));

        settingsPanel.appendChild(content);
        document.body.appendChild(settingsPanel);

        // --- Add Event Listeners for Controls ---

        // Bell Size
        const bellSizeInput = settingsPanel.querySelector('#setting-bell-size');
        const bellSizeValueSpan = settingsPanel.querySelector('#bell-size-value');
        bellSizeInput.addEventListener('input', () => {
            currentBellSize = parseFloat(bellSizeInput.value);
            bellSizeValueSpan.textContent = `${currentBellSize}em`;
            applyBellSize(currentBellSize);
            localStorage.setItem(LS_BELL_SIZE, currentBellSize);
        });

        // Move Bell
        const moveBellButton = settingsPanel.querySelector('#setting-move-bell');
        moveBellButton.addEventListener('click', toggleBellMoveMode);

        // Combat Sound URL
        const combatSoundUrlInput = settingsPanel.querySelector('#setting-combat-sound-url');
        combatSoundUrlInput.addEventListener('change', () => {
            const newUrl = combatSoundUrlInput.value.trim();
            if (newUrl && (newUrl.startsWith('http://') || newUrl.startsWith('https://'))) {
                 currentCombatSoundUrl = newUrl;
                 localStorage.setItem(LS_COMBAT_SOUND_URL, currentCombatSoundUrl);
                 combatAlertAudio = null;
             } else if (!newUrl) {
                 currentCombatSoundUrl = DEFAULT_COMBAT_SOUND_URL;
                 localStorage.removeItem(LS_COMBAT_SOUND_URL);
                 combatAlertAudio = null;
                 combatSoundUrlInput.value = currentCombatSoundUrl;
             } else {
                 alert("URL invalide. Doit commencer par http:// or https://");
                 combatSoundUrlInput.value = currentCombatSoundUrl;
             }
        });

        // Combat Sound Volume
        const combatVolumeInput = settingsPanel.querySelector('#setting-combat-sound-volume');
        const combatVolumeValueSpan = settingsPanel.querySelector('#combat-volume-value');
        combatVolumeInput.addEventListener('input', () => {
            currentCombatVolume = parseFloat(combatVolumeInput.value);
            combatVolumeValueSpan.textContent = `${Math.round(currentCombatVolume * 100)}%`;
            // No need to update live object here, test button reads directly
            localStorage.setItem(LS_COMBAT_SOUND_VOLUME, currentCombatVolume);
        });

        // Other Sound URL
        const otherSoundUrlInput = settingsPanel.querySelector('#setting-other-sound-url');
        otherSoundUrlInput.addEventListener('change', () => {
            const newUrl = otherSoundUrlInput.value.trim();
            if (newUrl && (newUrl.startsWith('http://') || newUrl.startsWith('https://'))) {
                 currentOtherSoundUrl = newUrl;
                 localStorage.setItem(LS_OTHER_SOUND_URL, currentOtherSoundUrl);
                 otherAlertAudio = null;
             } else if (!newUrl) {
                 currentOtherSoundUrl = DEFAULT_OTHER_SOUND_URL;
                 localStorage.removeItem(LS_OTHER_SOUND_URL);
                 otherAlertAudio = null;
                 otherSoundUrlInput.value = currentOtherSoundUrl;
             } else {
                 alert("URL invalide. Doit commencer par http:// or https://");
                 otherSoundUrlInput.value = currentOtherSoundUrl;
             }
        });

        // Other Sound Volume
        const otherVolumeInput = settingsPanel.querySelector('#setting-other-sound-volume');
        const otherVolumeValueSpan = settingsPanel.querySelector('#other-volume-value');
        otherVolumeInput.addEventListener('input', () => {
            currentOtherVolume = parseFloat(otherVolumeInput.value);
            otherVolumeValueSpan.textContent = `${Math.round(currentOtherVolume * 100)}%`;
            // No need to update live object here, test button reads directly
            localStorage.setItem(LS_OTHER_SOUND_VOLUME, currentOtherVolume);
        });

        // Test Sound Buttons Listener (using event delegation on the content area)
        content.addEventListener('click', (event) => {
            if (event.target.classList.contains('test-sound-btn')) {
                const type = event.target.dataset.type;
                let url, volume;
                if (type === 'combat') {
                    url = combatSoundUrlInput.value.trim(); // Get current value from input
                    volume = combatVolumeInput.value;
                } else if (type === 'other') {
                    url = otherSoundUrlInput.value.trim(); // Get current value from input
                    volume = otherVolumeInput.value;
                } else {
                    return; // Should not happen
                }
                testSound(type, url, volume); // Call test function with current input values
            }
        });
    }

    // Helper to create section titles in settings
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
            settingsPanel.parentNode.removeChild(settingsPanel);
            settingsPanel = null;
        }
    }

    function toggleSettingsPanel() {
        if (settingsPanel && settingsPanel.parentNode) {
            closeSettingsPanel();
        } else {
            createSettingsPanel();
        }
    }

    // --- Dragging Functions (Panel & Bell) ---
    // ... (dragStart, dragMove, dragEnd, toggleBellMoveMode, bellDragStart, bellDragMove, bellDragEnd, saveBellPosition remain the same)
    function dragStart(e, panelElement) {
        if (e.button !== 0 || e.target.closest('button, input, select, textarea')) return;
        isDraggingPanel = true;
        const targetPanel = panelElement;
        initialMouseX = e.clientX;
        initialMouseY = e.clientY;
        const styles = window.getComputedStyle(targetPanel);
        initialPanelTop = parseFloat(targetPanel.style.top || styles.top) || 50;
        initialPanelLeft = parseFloat(targetPanel.style.left || styles.left) || (window.innerWidth - (parseFloat(styles.width) || 360) - 100); // Adjusted width

        if (styles.position !== 'fixed' && styles.position !== 'absolute') {
             targetPanel.style.position = 'fixed';
        }
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
        saveBellPosition();
    }

     function saveBellPosition() {
        if (bellElement) {
            const finalTop = bellElement.style.top;
            const finalLeft = bellElement.style.left;
            localStorage.setItem(LS_BELL_POS_TOP, finalTop);
            localStorage.setItem(LS_BELL_POS_LEFT, finalLeft);
            savedBellPos.top = finalTop;
            savedBellPos.left = finalLeft;
            console.log(`Bell position saved: top=${finalTop}, left=${finalLeft}`);
        }
     }


    // --- Bell Icon Creation and Positioning ---
    // ... (positionBellIcon, addBellIcon remain the same)
     function positionBellIcon() {
         if (!bellElement) return;
         const logoutLi = document.querySelector('li.logout');
         const parentUl = logoutLi ? logoutLi.closest('ul') : null;
         if (!logoutLi || !parentUl) return;

         if (savedBellPos.top !== null && savedBellPos.left !== null) {
             console.log("Applying saved bell position:", savedBellPos);
             applyBellPosition(savedBellPos.top, savedBellPos.left);
         } else {
             console.log("Calculating default bell position.");
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
                     console.error("Error calculating bell position:", e);
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
                console.log(`Bell target not found, retrying (${addBellIconRetryCount}/${MAX_RETRIES})...`);
                addBellIconTimeout = setTimeout(addBellIcon, RETRY_DELAY);
            } else {
                console.error("Failed to find bell anchor element after multiple retries.");
            }
            return;
        }

        console.log("Found bell anchor, creating icon.");
        addBellIconRetryCount = 0;

        const parentStyle = window.getComputedStyle(parentUl);
        if (parentStyle.position === 'static') {
             console.log("Setting parent UL position to relative.");
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


    // --- XHR Interception ---
    // ... (XMLHttpRequest prototype modifications remain the same)
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
                         let categoriesChanged = false;

                         allEvilBoxDivs.forEach((boxDiv, index) => {
                            const parentEvilBoxElement = boxDiv.closest('evilbox') || boxDiv;
                            let historyHtml = parentEvilBoxElement.outerHTML;
                            const currentCategories = Array.from(boxDiv.classList).filter(cls =>
                                cls !== 'evilBox' && !cls.startsWith('eb_') && !cls.startsWith('un-') && cls.trim() !== ''
                            );

                            currentCategories.forEach(cat => {
                                if (!notificationCategories.has(cat)) {
                                    notificationCategories.add(cat);
                                    categoriesChanged = true;
                                }
                            });

                            const uniqueId = `${baseTimestamp}-${index}`;
                            const historyEntry = {
                                id: uniqueId,
                                timestamp: new Date(),
                                html: historyHtml,
                                categories: currentCategories
                            };

                            evilBoxHistory.push(historyEntry);
                            newEntriesForThisCheck.push(historyEntry);

                            if (evilBoxHistory.length > MAX_HISTORY_ENTRIES) {
                                evilBoxHistory.shift();
                            }

                            // --- Sound Playing Logic ---
                            if (!soundPlayedThisCycle) {
                                 if (boxDiv.matches(ALERT_BOX_SELECTOR)) {
                                     playCombatSound(); // Uses saved/current settings
                                     soundPlayedThisCycle = true;
                                 } else {
                                     playOtherSound(); // Uses saved/current settings
                                     soundPlayedThisCycle = true;
                                 }
                            }
                         });

                         // --- UI Update ---
                         if (newEntriesForThisCheck.length > 0) {
                             if (bellElement) {
                                 bellElement.classList.remove('shake');
                                 void bellElement.offsetWidth;
                                 bellElement.classList.add('shake');
                             }

                             if (historyPanel && historyPanel.parentNode) {
                                 const contentArea = historyPanel.querySelector('.history-content');
                                 if (contentArea) {
                                     const emptyMsg = contentArea.querySelector('p > i');
                                     if (emptyMsg && emptyMsg.textContent.includes('Aucune notification')) {
                                         contentArea.innerHTML = '';
                                     }

                                     if (categoriesChanged) {
                                         const filterArea = historyPanel.querySelector('.filter-button-container');
                                         if (filterArea) {
                                             filterArea.innerHTML = '';
                                             function createFilterButton(category, text) {
                                                const button = document.createElement('button'); button.className = 'filter-button'; button.textContent = text; button.dataset.category = category; if (currentFilter === category) button.classList.add('active'); button.addEventListener('click', () => filterNotifications(category, filterArea)); return button;
                                             }
                                             filterArea.appendChild(createFilterButton('Tous', 'Tous'));
                                             Array.from(notificationCategories).sort().forEach(category => { const displayText = category.charAt(0).toUpperCase() + category.slice(1); filterArea.appendChild(createFilterButton(category, displayText)); });
                                         }
                                     }

                                     newEntriesForThisCheck.reverse().forEach(entry => {
                                         const itemElement = createNotificationElement(entry);
                                         if (currentFilter !== 'Tous' && !entry.categories.includes(currentFilter)) {
                                             itemElement.style.display = 'none';
                                         }
                                         contentArea.prepend(itemElement);
                                     });

                                     filterNotifications(currentFilter, historyPanel.querySelector('.filter-button-container'));

                                      const historyItemsInDOM = contentArea.querySelectorAll('.history-item');
                                      if (historyItemsInDOM.length > MAX_HISTORY_ENTRIES) {
                                          console.log(`Trimming DOM history from ${historyItemsInDOM.length} to ${MAX_HISTORY_ENTRIES}`);
                                          for (let i = MAX_HISTORY_ENTRIES; i < historyItemsInDOM.length; i++) {
                                              historyItemsInDOM[i].remove();
                                          }
                                      }
                                 }
                             } else {
                                 unreadCount += newEntriesForThisCheck.length;
                                 updateUnreadCounterDisplay();
                             }
                         }
                     } catch (e) {
                         console.error("Error processing XHR response:", e, this.responseText);
                     }
                 } else if (this.readyState === 4 && this.status !== 200) {
                     console.warn(`XHR request to ${this._requestUrl} failed with status ${this.status}`);
                 }
             });
        }
        return originalXhrSend.apply(this, arguments);
    };


    // --- Styles ---
    GM_addStyle(`
        /* --- General & Animations --- */
        /* ... (shake animation) ... */
         @keyframes shake {
            10%, 90% { transform: translate3d(-2px, 0, 0) rotate(-2deg); }
            20%, 80% { transform: translate3d(4px, 0, 0) rotate(4deg); }
            30%, 50%, 70% { transform: translate3d(-6px, 0, 0) rotate(-6deg); }
            40%, 60% { transform: translate3d(6px, 0, 0) rotate(6deg); }
        }
        .shake {
            animation: shake ${SHAKE_ANIMATION_DURATION / 1000}s cubic-bezier(.36,.07,.19,.97) both;
            transform-origin: center bottom;
            backface-visibility: hidden;
            perspective: 1000px;
        }

        /* --- Hide Original EvilBoxes --- */
        /* ... (evilbox hiding) ... */
        body > evilbox, body > div.evilBox {
            position: absolute !important; left: -9999px !important; top: -9999px !important;
            opacity: 0 !important; pointer-events: none !important; visibility: hidden !important;
            width: 1px !important; height: 1px !important; overflow: hidden !important;
            display: block !important; z-index: -1 !important;
        }

        /* --- Bell Icon --- */
        /* ... (bell styles, bell-moving, counter) ... */
         #evilbox-history-bell {
            line-height: 1 !important; vertical-align: middle; user-select: none;
            transition: transform 0.2s ease-out, opacity 0.2s ease;
            transform-origin: center center;
        }
        #evilbox-history-bell > span:first-of-type {
             vertical-align: middle; display: inline-block; transition: transform 0.2s ease;
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
            position: absolute; bottom: -10px; left: -14px; font-size: 16px;
            min-width: 27px; height: 27px; background-color: red; color: white;
            border-radius: 50%; font-weight: bold; display: flex;
            justify-content: center; align-items: center; line-height: 1;
            z-index: ${SCRIPT_Z_INDEX_BASE}; pointer-events: none; box-sizing: border-box;
            user-select: none;
        }


        /* --- Base Panel Style --- */
        /* ... (panel common styles, default positions, dragging) ... */
        #evilbox-history-panel, #evilbox-settings-panel {
            position: fixed; width: 370px; /* Slightly wider again */
            max-height: 80vh; background-color: #2f2f2f; border: 1px solid #777;
            border-radius: 6px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
            z-index: ${SCRIPT_Z_INDEX_BASE}; color: #ddd; font-size: 14px;
            display: flex; flex-direction: column; overflow: hidden;
            box-sizing: border-box; cursor: default;
        }
        #evilbox-history-panel { top: 50px; right: 100px; left: unset; }
        #evilbox-settings-panel { top: 60px; right: 120px; left: unset; z-index: ${SCRIPT_Z_INDEX_BASE + 1}; }

        #evilbox-history-panel.dragging, #evilbox-settings-panel.dragging {
             cursor: grabbing !important; user-select: none; opacity: 0.9;
        }
        #evilbox-history-panel[style*="visibility: hidden"],
        #evilbox-settings-panel[style*="visibility: hidden"] { visibility: visible !important; }
        #evilbox-history-panel[style*="display: none"],
        #evilbox-settings-panel[style*="display: none"] { display: flex !important; }


        /* --- Panel Headers --- */
        /* ... (header styles, controls, buttons) ... */
        .history-header, .settings-header {
            display: flex; justify-content: space-between; align-items: center;
            padding: 10px 15px; background-color: #3a3a3a; border-bottom: 1px solid #555;
            font-weight: bold; flex-shrink: 0; cursor: grab; user-select: none;
        }
        .history-header:active, .settings-header:active { cursor: grabbing; }

        .history-header-controls { display: flex; align-items: center; gap: 8px; }

        .history-header .close-btn, .settings-header .close-btn,
        .history-header .settings-btn {
            background: none; border: none; color: #ccc; font-size: 1.6em; line-height: 1;
            cursor: pointer; padding: 0 5px; font-weight: bold; transition: color 0.2s ease;
            vertical-align: middle;
        }
         .history-header .settings-btn { font-size: 1.3em; }
        .history-header .close-btn:hover, .settings-header .close-btn:hover,
        .history-header .settings-btn:hover { color: #fff; }


        /* --- History Panel Specific --- */
        /* ... (filter styles, content, item, timestamp, dismiss, empty message) ... */
        .filter-button-container {
            padding: 8px 12px; background-color: #333; border-bottom: 1px solid #555;
            flex-shrink: 0; display: flex; flex-wrap: wrap; gap: 8px;
        }
        .filter-button {
            background-color: #555; color: #ddd; border: 1px solid #777; border-radius: 4px;
            padding: 4px 10px; font-size: 0.9em; cursor: pointer;
            transition: background-color 0.2s ease, border-color 0.2s ease; user-select: none;
        }
        .filter-button:hover { background-color: #666; border-color: #888; }
        .filter-button.active {
            background-color: #8ab4f8; color: #1a1a1a; border-color: #8ab4f8; font-weight: bold;
        }

        #evilbox-history-panel .history-content {
            padding: 5px 12px 10px 12px; overflow-y: auto; flex-grow: 1; min-height: 50px;
        }
        #evilbox-history-panel .history-item {
            position: relative; border-bottom: 1px dashed #555; padding: 10px 25px 10px 5px;
            margin-bottom: 5px;
        }
        #evilbox-history-panel .history-item:last-child { border-bottom: none; padding-bottom: 5px; margin-bottom: 0; }
        #evilbox-history-panel .history-timestamp {
            display: block; font-size: 0.85em; color: #999; margin-bottom: 6px;
        }
        #evilbox-history-panel .dismiss-btn {
            position: absolute; top: 8px; right: 5px; background: none; border: none;
            color: #888; font-size: 1.5em; font-weight: bold; line-height: 1;
            padding: 0 4px; cursor: pointer; opacity: 0.7; z-index: 1;
            transition: color 0.2s, opacity 0.2s;
        }
        #evilbox-history-panel .dismiss-btn:hover { color: #eee; opacity: 1; }
        #evilbox-history-panel .empty-filter-message,
        #evilbox-history-panel .history-content > p > i {
            text-align: center; color: #888; margin-top: 15px; font-style: italic;
        }

        /* --- History EvilBox Content Display --- */
        /* ... (styles for .history-evilbox-content, .evilBox, .couleurX, .link, .titre, .content) ... */
         #evilbox-history-panel .history-evilbox-content evilbox,
        #evilbox-history-panel .history-evilbox-content div.evilBox {
            display: block !important; visibility: visible !important; position: relative !important;
            left: auto !important; top: auto !important; opacity: 1 !important;
            padding: 8px 10px; margin: 0 0 5px 0; border: 1px solid #444;
            background-color: #383838; border-radius: 4px; min-height: 10px;
            box-sizing: border-box; z-index: auto !important; width: auto !important;
            height: auto !important; overflow: visible !important; color: #ccc;
        }
        #evilbox-history-panel .history-evilbox-content .action { display: none !important; }
        #evilbox-history-panel .history-evilbox-content .couleur4 { color: #FFC107 !important; }
        #evilbox-history-panel .history-evilbox-content .couleur2 { color: #90EE90 !important; }
        #evilbox-history-panel .history-evilbox-content .couleur5 { color: #bbb !important; }
        #evilbox-history-panel .history-evilbox-content .link { cursor: pointer !important; text-decoration: underline !important; color: #8ab4f8 !important; }
        #evilbox-history-panel .history-evilbox-content .link:hover { color: #a8c7fa !important; }
        #evilbox-history-panel .history-evilbox-content .titre { font-weight: bold !important; margin-bottom: 4px !important; display: block !important; color: #eee !important; }
        #evilbox-history-panel .history-evilbox-content .content { margin-bottom: 4px !important; display: block !important; line-height: 1.4; }


        /* --- Settings Panel Specific --- */
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
        .setting-item label {
            font-weight: bold; color: #bbb; font-size: 0.95em;
        }
        .setting-control {
            display: flex; align-items: center; gap: 8px; /* Slightly reduced gap */
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
         .setting-control button:not(.test-sound-btn) { /* Style for non-test buttons */
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
             user-select: none; /* Prevent selecting percentage text */
         }
         /* Test Sound Button Specific Style */
         .setting-control .test-sound-btn {
            background: none;
            border: none;
            color: #bbb;
            font-size: 1.6em; /* Make speaker icon larger */
            line-height: 1;
            padding: 0 5px;
            cursor: pointer;
            transition: color 0.2s ease;
            order: 3; /* Ensure it appears after slider and value */
            margin-left: 5px; /* Space before the button */
         }
         .setting-control .test-sound-btn:hover {
            color: #fff;
         }
         .setting-control .test-sound-btn:active {
             transform: scale(0.9); /* Click feedback */
         }
    `);

    // --- Initialization ---
    function initializeScript() {
        console.log("Initializing Dreadcast Notifier Script v1.5...");
        addBellIconRetryCount = 0;
        addBellIcon();
    }

    // --- Run ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        initializeScript();
    }

})();