// ==UserScript==
// @name         Scan vieux messages
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Trouve les messages du personnage
// @author       Laïn
// @match        https://www.dreadcast.net/Main*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546706/Scan%20vieux%20messages.user.js
// @updateURL https://update.greasyfork.org/scripts/546706/Scan%20vieux%20messages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let scannerButton;
    let browserWindow;
    let currentFolderId = 0; // Always scan inbox (folder 0)
    let isScanning = false;
    let conversations = [];
    let filteredConversations = [];
    let isReversed = false;
    let currentConversationData = null;
    let activeTab = 'folder'; // 'folder' or 'conversation'

    // Progress tracking
    let scanStartTime = null;
    let currentBatch = 0;
    let totalConversations = 0;
    let progressUpdateInterval = null;

    // Message loading variables
    let messageIds = [];
    let messageData = [];
    let messageTimestamps = {};
    let currentMessageIndex = 0;
    let isLoadingMessages = false;
    let messageProgressInterval = null;

    // Create the scanner button
    function createScannerButton() {
        scannerButton = document.createElement('button');
        scannerButton.innerHTML = '🗂️';
        scannerButton.style.cssText = `
            position: fixed;
            top: 40px;
            left: 120px;
            z-index: 100001;
            width: 60px;
            height: 60px;
            border: none;
            border-radius: 50%;
            background: linear-gradient(135deg, #e91e63 0%, #ad1457 100%);
            color: white;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 8px 25px rgba(233, 30, 99, 0.4), 0 4px 10px rgba(0,0,0,0.2);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        scannerButton.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) translateY(-2px)';
            this.style.background = 'linear-gradient(135deg, #c2185b 0%, #880e4f 100%)';
            this.style.boxShadow = '0 12px 35px rgba(233, 30, 99, 0.6), 0 6px 15px rgba(0,0,0,0.3)';
        });

        scannerButton.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) translateY(0)';
            this.style.background = isScanning ? 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)' : 'linear-gradient(135deg, #e91e63 0%, #ad1457 100%)';
            this.style.boxShadow = isScanning ? '0 8px 25px rgba(76, 175, 80, 0.4), 0 4px 10px rgba(0,0,0,0.2)' : '0 8px 25px rgba(233, 30, 99, 0.4), 0 4px 10px rgba(0,0,0,0.2)';
        });

        scannerButton.addEventListener('click', toggleScanning);
        document.body.appendChild(scannerButton);
    }

    // Create the browser window
    function createBrowserWindow() {
        browserWindow = document.createElement('div');
        browserWindow.style.cssText = `
            position: fixed;
            top: 100px;
            right: 40px;
            width: 600px;
            height: 700px;
            z-index: 100001;
            background: linear-gradient(145deg, #2d1b2e 0%, #1a2332 50%, #0f1b2e 100%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5), 0 10px 25px rgba(0, 0, 0, 0.3);
            display: none;
            flex-direction: column;
            user-select: none;
            backdrop-filter: blur(20px);
            overflow: hidden;
        `;

        // Header with tabs
        const header = document.createElement('div');
        header.style.cssText = `
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
            color: white;
            padding: 20px;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            user-select: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
        `;

        header.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <span style="font-size: 16px; display: flex; align-items: center; gap: 10px;">
                    <span style="background: linear-gradient(135deg, #e91e63, #ad1457); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 18px;">🗂️</span>
                    Explorateur de Dossiers
                </span>
                <div style="display: flex; gap: 5px;">
                    ${createTabButton('folderTab', '📋 Dossier', true)}
                    ${createTabButton('conversationTab', '💬 Conversation', false)}
                </div>
            </div>
            <div style="display: flex; gap: 8px;">
                ${createModernButton('stopScan', '⏸️', 'Arrêter le scan', 'linear-gradient(135deg, #ff6b6b, #ee5a52)', 'none')}
                ${createModernButton('reverseOrder', '🔄', 'Inverser l\'ordre', 'linear-gradient(135deg, #ff9800, #f57c00)')}
                ${createModernButton('exportFolder', '📤', 'Exporter la liste', 'linear-gradient(135deg, #9c27b0, #673ab7)')}
                ${createModernButton('closeWindow', '✖️', 'Fermer', 'linear-gradient(135deg, #757575, #616161)')}
            </div>
        `;

        // Content area (will hold folder list or conversation view)
        const content = document.createElement('div');
        content.id = 'browserContent';
        content.style.cssText = `
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        `;

        // Folder list tab content
        const folderContent = document.createElement('div');
        folderContent.id = 'folderContent';
        folderContent.style.cssText = `
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        `;

        // Search controls for folder
        const searchControls = document.createElement('div');
        searchControls.style.cssText = `
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
            padding: 20px;
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        `;
        searchControls.innerHTML = `
            <input type="text" id="searchAuthor" placeholder="Rechercher auteur..." style="
                flex: 1;
                min-width: 140px;
                padding: 12px 16px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 12px;
                background: rgba(255, 255, 255, 0.05);
                color: white;
                font-size: 13px;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
            " onfocus="this.style.borderColor='rgba(233, 30, 99, 0.8)'; this.style.background='rgba(255, 255, 255, 0.1)'" onblur="this.style.borderColor='rgba(255, 255, 255, 0.2)'; this.style.background='rgba(255, 255, 255, 0.05)'">
            <input type="text" id="searchTitle" placeholder="Rechercher titre..." style="
                flex: 1;
                min-width: 140px;
                padding: 12px 16px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 12px;
                background: rgba(255, 255, 255, 0.05);
                color: white;
                font-size: 13px;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
            " onfocus="this.style.borderColor='rgba(233, 30, 99, 0.8)'; this.style.background='rgba(255, 255, 255, 0.1)'" onblur="this.style.borderColor='rgba(255, 255, 255, 0.2)'; this.style.background='rgba(255, 255, 255, 0.05)'">
            ${createModernButton('clearSearch', '✖️', 'Effacer la recherche', 'linear-gradient(135deg, #607d8b, #546e7a)')}
        `;

        // Conversation list
        const conversationList = document.createElement('div');
        conversationList.id = 'conversationList';
        conversationList.style.cssText = `
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            color: #ffffff;
            font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            font-size: 13px;
            line-height: 1.6;
        `;

        folderContent.appendChild(searchControls);
        folderContent.appendChild(conversationList);

        // Conversation view tab content
        const conversationContent = document.createElement('div');
        conversationContent.id = 'conversationContent';
        conversationContent.style.cssText = `
            flex: 1;
            display: none;
            flex-direction: column;
            overflow: hidden;
        `;

        // Conversation header
        const conversationHeader = document.createElement('div');
        conversationHeader.id = 'conversationHeader';
        conversationHeader.style.cssText = `
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
            padding: 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            color: white;
            font-weight: 600;
        `;

        // Conversation messages
        const conversationMessages = document.createElement('div');
        conversationMessages.id = 'conversationMessages';
        conversationMessages.style.cssText = `
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            color: #ffffff;
            font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            font-size: 13px;
            line-height: 1.6;
            user-select: text;
            cursor: text;
        `;

        conversationContent.appendChild(conversationHeader);
        conversationContent.appendChild(conversationMessages);

        content.appendChild(folderContent);
        content.appendChild(conversationContent);

        // Status bar with progress
        const status = document.createElement('div');
        status.id = 'scannerStatus';
        status.style.cssText = `
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
            padding: 15px 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.8);
            font-size: 12px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            backdrop-filter: blur(10px);
        `;
        status.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span id="statusText" style="font-weight: 500;">Prêt à scanner le dossier...</span>
                ${createModernButton('stopScanBottom', '⏸️', 'Arrêter le scan', 'linear-gradient(135deg, #ff6b6b, #ee5a52)', 'none', '8px', '10px')}
            </div>
            <div id="progressContainer" style="display: none; animation: slideDown 0.3s ease-out;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 11px; opacity: 0.9;">
                    <span id="progressText" style="font-weight: 500;">Batch 0 / ?</span>
                    <span id="progressStats" style="color: #81c784;">📬 0 conversations</span>
                    <span id="progressPercentage" style="font-weight: 600; color: #e91e63;">0%</span>
                </div>
                <div style="
                    width: 100%;
                    background: rgba(255,255,255,0.1);
                    border-radius: 12px;
                    height: 10px;
                    overflow: hidden;
                    box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
                    position: relative;
                ">
                    <div id="progressFill" style="
                        width: 0%;
                        height: 100%;
                        background: linear-gradient(90deg, #e91e63 0%, #ad1457 50%, #4caf50 100%);
                        border-radius: 12px;
                        transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                        position: relative;
                        overflow: hidden;
                        box-shadow: 0 2px 8px rgba(233, 30, 99, 0.3);
                    ">
                        <div style="
                            position: absolute;
                            top: 0;
                            left: -100%;
                            width: 100%;
                            height: 100%;
                            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                            animation: shimmer 2s infinite ease-in-out;
                        "></div>
                    </div>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 10px; opacity: 0.8;">
                    <span id="progressSpeed" style="color: #ffb74d;">⚡ -- batch/s</span>
                    <span id="progressETA" style="color: #ff8a65;">⏱️ Estimation...</span>
                </div>
            </div>
            <style>
                @keyframes shimmer {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideUp {
                    from { opacity: 1; transform: translateY(0); }
                    to { opacity: 0; transform: translateY(-10px); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                .pulsing {
                    animation: pulse 1.5s infinite;
                }
                @keyframes completionBounce {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                    50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                    100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }
            </style>
        `;

        browserWindow.appendChild(header);
        browserWindow.appendChild(content);
        browserWindow.appendChild(status);
        document.body.appendChild(browserWindow);

        // Setup functionality
        setupDragFunctionality(header);
        setupTabSwitching();
        setupWindowControls();
        setupSearchFunctionality();
    }

    // Helper function to create tab buttons
    function createTabButton(id, text, active) {
        const activeStyle = active ? 'background: linear-gradient(135deg, #e91e63, #ad1457); color: white;' : 'background: rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.7);';
        return `
            <button id="${id}" style="
                ${activeStyle}
                border: none;
                padding: 8px 16px;
                border-radius: 20px;
                cursor: pointer;
                font-size: 11px;
                font-weight: 600;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
            " onmouseover="if(this.id !== '${activeTab}Tab') { this.style.background='rgba(255, 255, 255, 0.15)'; this.style.color='white'; }" onmouseout="if(this.id !== '${activeTab}Tab') { this.style.background='rgba(255, 255, 255, 0.1)'; this.style.color='rgba(255, 255, 255, 0.7)'; }">${text}</button>
        `;
    }

    // Helper function to create modern buttons
    function createModernButton(id, icon, title, gradient, display = 'inline-block', padding = '10px 12px', fontSize = '12px') {
        return `
            <button id="${id}" title="${title}" style="
                background: ${gradient};
                color: white;
                border: none;
                padding: ${padding};
                border-radius: 10px;
                cursor: pointer;
                font-size: ${fontSize};
                display: ${display};
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(0, 0, 0, 0.3)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0, 0, 0, 0.2)'">${icon}</button>
        `;
    }

    // Toggle scanning
    function toggleScanning() {
        if (isScanning) {
            stopScanning();
        } else {
            startFolderScan();
        }
    }

    // Start folder scan
    function startFolderScan() {
        isScanning = true;
        scanStartTime = Date.now();
        currentBatch = 0;
        conversations = [];
        filteredConversations = [];
        totalConversations = 0;

        // Update button appearance
        scannerButton.style.background = 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)';
        scannerButton.style.boxShadow = '0 8px 25px rgba(76, 175, 80, 0.4), 0 4px 10px rgba(0,0,0,0.2)';
        scannerButton.innerHTML = '⏹️';

        // Show window and progress
        browserWindow.style.display = 'flex';
        switchToTab('folder');
        showProgress();

        updateStatus('🔍 Démarrage du scan du dossier...');

        // Start scanning from batch 1 (numero=19)
        scanNextBatch(19);
    }

    // Scan next batch of conversations
    function scanNextBatch(numero) {
        if (!isScanning) return;

        currentBatch++;
        updateProgress();

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://www.dreadcast.net/Menu/Messaging/OpenFolder', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onload = function() {
            if (this.status === 200) {
                const conversationsFound = parseConversationsResponse(this.responseText);

                if (conversationsFound.length === 0) {
                    // No more conversations, scanning complete
                    stopScanning();
                    displayConversations();
                    showCompletionNotification();
                    updateStatus(`✅ Scan terminé ! ${totalConversations} conversations trouvées.`);
                } else {
                    // Add conversations and continue
                    conversations.push(...conversationsFound);
                    totalConversations = conversations.length;

                    // Continue with next batch
                    setTimeout(() => {
                        if (isScanning) {
                            scanNextBatch(numero + 20);
                        }
                    }, 200); // Small delay to avoid overwhelming server
                }
            } else {
                console.error('Error scanning folder:', this.status);
                stopScanning();
                updateStatus('❌ Erreur lors du scan du dossier.');
            }
        };

        xhr.onerror = function() {
            console.error('Network error scanning folder');
            stopScanning();
            updateStatus('❌ Erreur réseau lors du scan.');
        };

        xhr.send(`id_folder=${currentFolderId}&numero=${numero}`);
    }

    // Parse conversations from XML response
    function parseConversationsResponse(responseText) {
        const conversations = [];

        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(responseText, "text/xml");

            // Find all <li> elements with message data
            const messageElements = xmlDoc.querySelectorAll('li[id^="message_"]');

            messageElements.forEach(li => {
                const messageId = li.id.replace('message_', '');
                const author = li.querySelector('.message_auteur')?.textContent?.trim() || 'Inconnu';
                const title = li.querySelector('.message_titre')?.textContent?.trim() || '(Sans titre)';
                const dateElement = li.querySelector('.message_date');
                const avatarImg = li.querySelector('img');

                let date = 'Date inconnue';
                if (dateElement) {
                    // Parse date like "23:29<br />20/08/25"
                    const dateText = dateElement.innerHTML.replace('<br />', ' ').replace('<br>', ' ').trim();
                    date = dateText;
                }

                let avatar = '';
                if (avatarImg) {
                    avatar = avatarImg.src;
                }

                conversations.push({
                    id: messageId,
                    author: author,
                    title: title,
                    date: date,
                    avatar: avatar,
                    timestamp: parseDateForSorting(date)
                });
            });
        } catch (error) {
            console.error('Error parsing conversations response:', error);
        }

        return conversations;
    }

    // Parse date for sorting (convert to comparable format)
    function parseDateForSorting(dateString) {
        try {
            // Format: "23:29 20/08/25"
            const parts = dateString.trim().split(' ');
            if (parts.length >= 2) {
                const time = parts[0]; // "23:29"
                const date = parts[1]; // "20/08/25"

                const dateParts = date.split('/');
                if (dateParts.length === 3) {
                    const day = dateParts[0];
                    const month = dateParts[1];
                    const year = '20' + dateParts[2]; // Convert "25" to "2025"

                    // Create a sortable date string: "2025-08-20 23:29"
                    return new Date(`${year}-${month}-${day} ${time}`);
                }
            }
        } catch (error) {
            console.error('Error parsing date for sorting:', error);
        }

        return new Date(0); // Return epoch if parsing fails
    }

    // Display conversations in the list
    function displayConversations() {
        const conversationList = document.getElementById('conversationList');
        if (!conversationList) return;

        let conversationsToDisplay = filteredConversations.length > 0 ? filteredConversations : conversations;

        // Create a copy to avoid modifying the original array
        let sortedConversations = [...conversationsToDisplay];

        // Sort by timestamp (newest first by default)
        sortedConversations.sort((a, b) => {
            return b.timestamp - a.timestamp; // Newest first
        });

        // If reversed, simply reverse the already sorted array
        if (isReversed) {
            sortedConversations.reverse();
        }

        let html = `
            <div style="
                text-align: center;
                margin-bottom: 25px;
                padding: 20px;
                background: linear-gradient(135deg, rgba(233, 30, 99, 0.1) 0%, rgba(173, 20, 87, 0.1) 100%);
                border-radius: 16px;
                border: 1px solid rgba(233, 30, 99, 0.2);
            ">
                <h3 style="
                    margin: 0;
                    background: linear-gradient(135deg, #e91e63, #ad1457);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    font-size: 18px;
                    font-weight: 700;
                ">📬 Boîte de Réception</h3>
                <p style="
                    margin: 8px 0 0 0;
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 14px;
                    font-weight: 500;
                ">${sortedConversations.length} conversations ${isReversed ? '(Ordre: Ancien → Nouveau)' : '(Ordre: Nouveau → Ancien)'}</p>
            </div>
        `;

        sortedConversations.forEach((conv, index) => {
            html += `
                <div class="conversation-item" data-conversation-id="${conv.id}" style="
                    margin-bottom: 15px;
                    padding: 16px;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%);
                    border-radius: 14px;
                    border-left: 4px solid #e91e63;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.3s ease;
                    cursor: pointer;
                " onmouseover="this.style.background='linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)'; this.style.transform='translateY(0)'">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                        <img src="${conv.avatar}" style="width: 32px; height: 32px; border-radius: 50%; border: 2px solid rgba(255, 255, 255, 0.2);" onerror="this.style.display='none'">
                        <div style="flex: 1;">
                            <div style="
                                color: #e91e63;
                                font-weight: 600;
                                font-size: 14px;
                                margin-bottom: 2px;
                            ">${conv.author}</div>
                            <div style="
                                color: rgba(255, 255, 255, 0.8);
                                font-size: 13px;
                                font-weight: 500;
                            ">${conv.title}</div>
                        </div>
                        <div style="
                            color: rgba(255, 255, 255, 0.6);
                            font-size: 11px;
                            text-align: right;
                            background: rgba(255, 255, 255, 0.1);
                            padding: 4px 8px;
                            border-radius: 8px;
                        ">
                            ${conv.date}
                        </div>
                    </div>
                    <div style="
                        color: rgba(255, 255, 255, 0.5);
                        font-size: 11px;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                    ">
                        <span>💬</span>
                        <span>Cliquez pour ouvrir la conversation</span>
                        <span style="margin-left: auto; color: rgba(233, 30, 99, 0.7);">ID: ${conv.id}</span>
                    </div>
                </div>
            `;
        });

        conversationList.innerHTML = html;

        // Add click handlers to conversation items
        document.querySelectorAll('.conversation-item').forEach(item => {
            item.addEventListener('click', function() {
                const conversationId = this.dataset.conversationId;
                openConversation(conversationId);
            });
        });

        conversationList.scrollTop = 0;
    }

    // Open a conversation (switch to conversation tab and load messages)
    function openConversation(conversationId) {
        const conversation = conversations.find(c => c.id === conversationId);
        if (!conversation) return;

        // Store current conversation data for copy functionality
        currentConversationData = conversationId;

        switchToTab('conversation');

        // Update conversation header
        const header = document.getElementById('conversationHeader');
        header.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <img src="${conversation.avatar}" style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid rgba(255, 255, 255, 0.2);" onerror="this.style.display='none'">
                <div>
                    <div style="font-size: 16px; margin-bottom: 4px;">${conversation.title || '(Sans titre)'}</div>
                    <div style="font-size: 12px; color: rgba(255, 255, 255, 0.7);">Avec ${conversation.author} • ${conversation.date}</div>
                </div>
                <div style="margin-left: auto;">
                    ${createModernButton('backToFolder', '👈', 'Retour au dossier', 'linear-gradient(135deg, #607d8b, #546e7a)')}
                </div>
            </div>
        `;

        // Setup back button
        document.getElementById('backToFolder').addEventListener('click', () => {
            switchToTab('folder');
        });

        // Load conversation messages
        loadConversationMessages(conversationId);
    }

    // Load messages for a conversation (reuse logic from message dumper)
    function loadConversationMessages(conversationId) {
        const messagesContainer = document.getElementById('conversationMessages');
        messagesContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: rgba(255, 255, 255, 0.7);">
                <div style="font-size: 32px; margin-bottom: 16px;">⏳</div>
                <div>Chargement de la conversation...</div>
            </div>
        `;

        // Reset message variables
        messageIds = [];
        messageData = [];
        messageTimestamps = {};
        currentMessageIndex = 0;
        isLoadingMessages = true;

        // Start message loading process
        loadConversationData(conversationId);
    }

    // Load conversation data (equivalent to OpenMessage in message dumper)
    function loadConversationData(conversationId) {
        updateStatus('🔍 Chargement de la conversation...');

        const xhr = new XMLHttpRequest();
        xhr.open('GET', `https://www.dreadcast.net/Menu/Messaging/action=OpenMessage&id_conversation=${conversationId}`, true);

        xhr.onload = function() {
            if (this.status === 200) {
                const extractionResult = extractMessageIdsAndTimestamps(this.responseText);
                messageIds = extractionResult.ids;
                messageTimestamps = extractionResult.timestamps;

                if (messageIds.length > 0) {
                    updateStatus(`💬 ${messageIds.length} messages trouvés. Extraction...`);
                    messageData = [];
                    currentMessageIndex = 0;
                    startMessageExtraction(conversationId);
                } else {
                    updateStatus('Aucun message trouvé dans la conversation.');
                    showNoMessagesPlaceholder();
                }
            } else {
                console.error('Error loading conversation:', this.status);
                updateStatus('❌ Erreur lors du chargement de la conversation.');
                showErrorPlaceholder();
            }
        };

        xhr.onerror = function() {
            console.error('Network error loading conversation');
            updateStatus('❌ Erreur réseau lors du chargement.');
            showErrorPlaceholder();
        };

        xhr.send();
    }

    // Extract message IDs and timestamps from conversation response
    function extractMessageIdsAndTimestamps(responseText) {
        const ids = [];
        const timestamps = {};

        // Regex to match conversation divs with IDs and timestamps
        const regex = /<div id="convers_(\d+)"[^>]*>[\s\S]*?<span class="ligne1">([^<]+)<\/span>[\s\S]*?<\/div>/g;
        let match;

        while ((match = regex.exec(responseText)) !== null) {
            const messageId = match[1];
            const timestampText = match[2].trim();

            ids.push(messageId);
            timestamps[messageId] = parseTimestamp(timestampText);
        }

        // Sort IDs to get chronological order (assuming higher ID = newer message)
        const sortedIds = ids.sort((a, b) => parseInt(a) - parseInt(b));

        return {
            ids: sortedIds,
            timestamps: timestamps
        };
    }

    // Parse timestamp from French format "DD/MM/YYYY HH:MM" to a more readable format
    function parseTimestamp(timestampText) {
        try {
            // Format: "20/08/2025 23:58"
            const parts = timestampText.split(' ');
            if (parts.length !== 2) return timestampText; // Return original if can't parse

            const datePart = parts[0]; // "20/08/2025"
            const timePart = parts[1]; // "23:58"

            const dateComponents = datePart.split('/');
            if (dateComponents.length !== 3) return timestampText;

            const day = dateComponents[0];
            const month = dateComponents[1];
            const year = dateComponents[2];

            // Return in a more readable format
            return `${day}/${month}/${year} ${timePart}`;
        } catch (error) {
            console.error('Error parsing timestamp:', error);
            return timestampText; // Return original on error
        }
    }

    // Start message extraction with progress tracking
    function startMessageExtraction(conversationId) {
        isLoadingMessages = true;
        showMessageProgress();
        fetchNextMessage(conversationId);
    }

    // Show message loading progress
    function showMessageProgress() {
        const messagesContainer = document.getElementById('conversationMessages');
        messagesContainer.innerHTML = `
            <div style="text-align: center; padding: 30px;">
                <div style="font-size: 24px; margin-bottom: 16px;">📥</div>
                <div style="color: white; font-weight: 600; margin-bottom: 16px;">Extraction des messages...</div>
                <div style="
                    width: 100%;
                    background: rgba(255,255,255,0.1);
                    border-radius: 12px;
                    height: 8px;
                    margin: 16px 0;
                    overflow: hidden;
                ">
                    <div id="messageProgressBar" style="
                        width: 0%;
                        height: 100%;
                        background: linear-gradient(90deg, #e91e63, #ad1457);
                        border-radius: 12px;
                        transition: width 0.3s ease;
                    "></div>
                </div>
                <div id="messageProgressText" style="color: rgba(255, 255, 255, 0.8); font-size: 13px;">
                    0 / ${messageIds.length} messages
                </div>
            </div>
        `;

        // Start progress updates
        messageProgressInterval = setInterval(updateMessageProgress, 300);
    }

    // Update message extraction progress
    function updateMessageProgress() {
        if (!isLoadingMessages) return;

        const progressBar = document.getElementById('messageProgressBar');
        const progressText = document.getElementById('messageProgressText');

        if (progressBar && progressText) {
            const percentage = messageIds.length > 0 ? Math.round((currentMessageIndex / messageIds.length) * 100) : 0;
            progressBar.style.width = percentage + '%';
            progressText.textContent = `${currentMessageIndex} / ${messageIds.length} messages`;
        }

        // Update main status
        const dots = '.'.repeat((Math.floor(Date.now() / 400) % 3) + 1);
        updateStatus(`💬 Extraction en cours${dots} (${currentMessageIndex}/${messageIds.length})`);
    }

    // Fetch next message from conversation
    function fetchNextMessage(conversationId) {
        if (currentMessageIndex >= messageIds.length || !isLoadingMessages) {
            if (isLoadingMessages) {
                stopMessageExtraction();
                displayConversationMessages();
                updateStatus(`✅ ${messageData.length} messages extraits de la conversation.`);
            }
            return;
        }

        const messageId = messageIds[currentMessageIndex];

        const xhr = new XMLHttpRequest();
        xhr.open('GET', `https://www.dreadcast.net/Menu/Messaging/action=ReadMessage&id_message=${messageId}&id_conversation=${conversationId}`, true);

        xhr.onload = function() {
            if (this.status === 200) {
                const messageInfo = parseMessageResponse(this.responseText, messageId);
                if (messageInfo) {
                    messageData.push(messageInfo);
                }
            }

            currentMessageIndex++;
            if (isLoadingMessages) {
                setTimeout(() => fetchNextMessage(conversationId), 100); // Small delay to avoid overwhelming server
            }
        };

        xhr.onerror = function() {
            currentMessageIndex++;
            if (isLoadingMessages) {
                setTimeout(() => fetchNextMessage(conversationId), 100);
            }
        };

        xhr.send();
    }

    // Parse individual message response
    function parseMessageResponse(responseText, messageId) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(responseText, "text/xml");

            const author = xmlDoc.querySelector('nomAuteur')?.textContent || 'Inconnu';
            const message = xmlDoc.querySelector('message')?.textContent || 'Aucun contenu';
            const avatar = xmlDoc.querySelector('avatarAuteur')?.textContent || '';

            // Get timestamp from the stored timestamps
            const timestamp = messageTimestamps[messageId] || 'Heure inconnue';

            return {
                id: messageId,
                author: author,
                message: message,
                avatar: avatar,
                timestamp: timestamp
            };
        } catch (error) {
            console.error('Error parsing message response:', error);
            return null;
        }
    }

    // Stop message extraction
    function stopMessageExtraction() {
        isLoadingMessages = false;

        if (messageProgressInterval) {
            clearInterval(messageProgressInterval);
            messageProgressInterval = null;
        }
    }

    // Display extracted conversation messages
    function displayConversationMessages() {
        const messagesContainer = document.getElementById('conversationMessages');
        if (!messagesContainer) return;

        let html = `
            <div style="
                text-align: center;
                margin-bottom: 25px;
                padding: 20px;
                background: linear-gradient(135deg, rgba(233, 30, 99, 0.1) 0%, rgba(173, 20, 87, 0.1) 100%);
                border-radius: 16px;
                border: 1px solid rgba(233, 30, 99, 0.2);
            ">
                <h3 style="
                    margin: 0;
                    background: linear-gradient(135deg, #e91e63, #ad1457);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    font-size: 18px;
                    font-weight: 700;
                ">💬 Messages de la Conversation</h3>
                <p style="
                    margin: 8px 0 0 0;
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 14px;
                    font-weight: 500;
                ">${messageData.length} messages</p>
                <div style="margin-top: 12px;">
                    ${createModernButton('copyConversation', '📋', 'Copier la conversation', 'linear-gradient(135deg, #4caf50, #388e3c)', 'inline-block', '8px 12px', '11px')}
                    ${createModernButton('reverseMessages', '🔄', 'Inverser l\'ordre', 'linear-gradient(135deg, #ff9800, #f57c00)', 'inline-block', '8px 12px', '11px')}
                </div>
            </div>
        `;

        // Sort messages chronologically (oldest first by default)
        let sortedMessages = [...messageData].sort((a, b) => parseInt(a.id) - parseInt(b.id));

        sortedMessages.forEach((msg, index) => {
            html += `
                <div style="
                    margin-bottom: 20px;
                    padding: 18px;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%);
                    border-radius: 16px;
                    border-left: 4px solid #e91e63;
                    user-select: text;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.3s ease;
                " onmouseover="this.style.background='linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)'" onmouseout="this.style.background='linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)'">
                    <div style="
                        color: #e91e63;
                        font-weight: 600;
                        margin-bottom: 8px;
                        user-select: text;
                        font-size: 14px;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    ">
                        <span style="
                            background: linear-gradient(135deg, #e91e63, #ad1457);
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                            font-weight: 700;
                        ">${index + 1}.</span>
                        <span style="color: #81c784;">${msg.author}</span>
                        <span style="
                            color: rgba(255, 255, 255, 0.5);
                            font-size: 11px;
                            font-weight: 400;
                            background: rgba(255, 255, 255, 0.1);
                            padding: 2px 8px;
                            border-radius: 12px;
                        ">ID: ${msg.id}</span>
                    </div>
                    <div style="
                        color: rgba(255, 255, 255, 0.7);
                        font-size: 11px;
                        margin-bottom: 12px;
                        user-select: text;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                    ">
                        <span style="color: #ffb74d;">📅</span>
                        <span style="font-weight: 500;">${msg.timestamp}</span>
                    </div>
                    <div style="
                        color: rgba(255, 255, 255, 0.95);
                        white-space: pre-wrap;
                        word-wrap: break-word;
                        user-select: text;
                        line-height: 1.6;
                        font-size: 13px;
                    ">
                        ${escapeHtml(msg.message)}
                    </div>
                </div>
            `;
        });

        messagesContainer.innerHTML = html;

        // Add event listeners for new buttons
        document.getElementById('copyConversation').addEventListener('click', copyConversationToClipboard);
        document.getElementById('reverseMessages').addEventListener('click', reverseMessageOrder);

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Copy conversation to clipboard
    function copyConversationToClipboard() {
        const conversation = conversations.find(c => c.id === currentConversationData);
        let textContent = `Conversation avec ${conversation?.author || 'Inconnu'}\n`;
        textContent += `Titre: ${conversation?.title || '(Sans titre)'}\n`;
        textContent += `Date: ${conversation?.date || 'Date inconnue'}\n`;
        textContent += '='.repeat(60) + '\n\n';

        messageData.forEach((msg, index) => {
            textContent += `${index + 1}. ${msg.author} (ID: ${msg.id})\n`;
            textContent += `📅 ${msg.timestamp}\n`;
            textContent += `${msg.message}\n`;
            textContent += '-'.repeat(40) + '\n\n';
        });

        navigator.clipboard.writeText(textContent).then(() => {
            updateStatus('📋 Conversation copiée dans le presse-papiers !');
            setTimeout(() => {
                updateStatus('Conversation chargée.');
            }, 2000);
        }).catch(() => {
            updateStatus('❌ Échec de la copie.');
        });
    }

    // Reverse message order
    function reverseMessageOrder() {
        messageData.reverse();
        displayConversationMessages();
    }

    // Show placeholder when no messages found
    function showNoMessagesPlaceholder() {
        const messagesContainer = document.getElementById('conversationMessages');
        messagesContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: rgba(255, 255, 255, 0.7);">
                <div style="font-size: 32px; margin-bottom: 16px;">📭</div>
                <div style="font-size: 16px; margin-bottom: 8px;">Aucun message trouvé</div>
                <div style="font-size: 12px; opacity: 0.7;">
                    Cette conversation semble être vide.
                </div>
            </div>
        `;
    }

    // Show error placeholder
    function showErrorPlaceholder() {
        const messagesContainer = document.getElementById('conversationMessages');
        messagesContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: rgba(255, 255, 255, 0.7);">
                <div style="font-size: 32px; margin-bottom: 16px;">❌</div>
                <div style="font-size: 16px; margin-bottom: 8px;">Erreur de chargement</div>
                <div style="font-size: 12px; opacity: 0.7;">
                    Impossible de charger les messages de cette conversation.
                </div>
            </div>
        `;
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Tab switching functionality
    function setupTabSwitching() {
        document.getElementById('folderTab').addEventListener('click', () => switchToTab('folder'));
        document.getElementById('conversationTab').addEventListener('click', () => switchToTab('conversation'));
    }

    function switchToTab(tabName) {
        activeTab = tabName;

        // Update tab buttons
        document.getElementById('folderTab').style.background = tabName === 'folder' ? 'linear-gradient(135deg, #e91e63, #ad1457)' : 'rgba(255, 255, 255, 0.1)';
        document.getElementById('folderTab').style.color = tabName === 'folder' ? 'white' : 'rgba(255, 255, 255, 0.7)';
        document.getElementById('conversationTab').style.background = tabName === 'conversation' ? 'linear-gradient(135deg, #e91e63, #ad1457)' : 'rgba(255, 255, 255, 0.1)';
        document.getElementById('conversationTab').style.color = tabName === 'conversation' ? 'white' : 'rgba(255, 255, 255, 0.7)';

        // Show/hide content
        document.getElementById('folderContent').style.display = tabName === 'folder' ? 'flex' : 'none';
        document.getElementById('conversationContent').style.display = tabName === 'conversation' ? 'flex' : 'none';
    }

    // Progress tracking functions
    function showProgress() {
        const progressContainer = document.getElementById('progressContainer');
        progressContainer.style.display = 'block';

        // Show stop buttons with pulsing
        const stopBtn = document.getElementById('stopScan');
        const stopBtnBottom = document.getElementById('stopScanBottom');
        if (stopBtn) {
            stopBtn.style.display = 'inline-block';
            stopBtn.classList.add('pulsing');
        }
        if (stopBtnBottom) {
            stopBtnBottom.style.display = 'inline-block';
            stopBtnBottom.classList.add('pulsing');
        }

        // Start progress updates
        progressUpdateInterval = setInterval(updateProgress, 500);
    }

    function updateProgress() {
        if (!isScanning) return;

        const progressText = document.getElementById('progressText');
        const progressStats = document.getElementById('progressStats');
        const progressFill = document.getElementById('progressFill');
        const progressSpeed = document.getElementById('progressSpeed');
        const progressETA = document.getElementById('progressETA');

        if (progressText) {
            progressText.textContent = `Batch ${currentBatch}`;
        }

        if (progressStats) {
            progressStats.innerHTML = `📬 ${totalConversations} conversations`;
        }

        // Simulate progress (since we don't know total batches beforehand)
        const simulatedProgress = Math.min(95, currentBatch * 10);
        if (progressFill) {
            progressFill.style.width = simulatedProgress + '%';
        }

        // Calculate speed
        if (progressSpeed && scanStartTime) {
            const elapsed = (Date.now() - scanStartTime) / 1000;
            const speed = currentBatch / elapsed;
            progressSpeed.innerHTML = `⚡ ${speed.toFixed(1)} batch/s`;
        }

        // Update status with dots animation
        const dots = '.'.repeat((Math.floor(Date.now() / 500) % 3) + 1);
        updateStatus(`🔍 Scan en cours${dots} (Batch ${currentBatch})`);
    }

    function hideProgress() {
        const progressContainer = document.getElementById('progressContainer');
        if (progressContainer) {
            progressContainer.style.animation = 'slideUp 0.3s ease-out';
            setTimeout(() => {
                progressContainer.style.display = 'none';
                progressContainer.style.animation = '';
            }, 300);
        }

        if (progressUpdateInterval) {
            clearInterval(progressUpdateInterval);
            progressUpdateInterval = null;
        }

        // Hide stop buttons
        const stopBtn = document.getElementById('stopScan');
        const stopBtnBottom = document.getElementById('stopScanBottom');
        if (stopBtn) {
            stopBtn.style.display = 'none';
            stopBtn.classList.remove('pulsing');
        }
        if (stopBtnBottom) {
            stopBtnBottom.style.display = 'none';
            stopBtnBottom.classList.remove('pulsing');
        }
    }

    // Stop scanning
    function stopScanning() {
        isScanning = false;

        // Update button appearance
        scannerButton.style.background = 'linear-gradient(135deg, #e91e63 0%, #ad1457 100%)';
        scannerButton.style.boxShadow = '0 8px 25px rgba(233, 30, 99, 0.4), 0 4px 10px rgba(0,0,0,0.2)';
        scannerButton.innerHTML = '🗂️';

        hideProgress();
    }

    // Show completion notification
    function showCompletionNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, rgba(233, 30, 99, 0.95), rgba(173, 20, 87, 0.95));
            color: white;
            padding: 20px 30px;
            border-radius: 20px;
            font-size: 16px;
            font-weight: 600;
            z-index: 100002;
            backdrop-filter: blur(15px);
            border: 2px solid rgba(255, 255, 255, 0.2);
            animation: completionBounce 0.8s ease-out;
            pointer-events: none;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        `;

        notification.innerHTML = `
            <div style="font-size: 32px; margin-bottom: 10px;">🎉</div>
            <div>Scan terminé !</div>
            <div style="font-size: 14px; margin-top: 8px; opacity: 0.9;">
                ${totalConversations} conversations trouvées
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'completionBounce 0.5s ease-out reverse';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    // Update status
    function updateStatus(message) {
        const statusText = document.getElementById('statusText');
        if (statusText) {
            statusText.textContent = message;
        }
    }

    // Setup window controls
    function setupWindowControls() {
        // Stop scan buttons
        document.getElementById('stopScan').addEventListener('click', stopScanning);
        document.getElementById('stopScanBottom').addEventListener('click', stopScanning);

        // Close window
        document.getElementById('closeWindow').addEventListener('click', function() {
            browserWindow.style.display = 'none';
            if (isScanning) {
                stopScanning();
            }
        });

        // Reverse order button - completely rewritten
        document.getElementById('reverseOrder').addEventListener('click', function() {
            // Simple toggle
            isReversed = !isReversed;

            // Update button appearance
            this.style.background = isReversed ? 'linear-gradient(135deg, #4caf50, #388e3c)' : 'linear-gradient(135deg, #ff9800, #f57c00)';
            this.innerHTML = isReversed ? '🔽' : '🔄';
            this.title = isReversed ? 'Ordre: Ancien → Nouveau (cliquer pour nouveau → ancien)' : 'Ordre: Nouveau → Ancien (cliquer pour ancien → nouveau)';

            // Refresh display immediately
            displayConversations();

            // Show feedback
            const orderText = isReversed ? 'Ancien en premier' : 'Nouveau en premier';
            updateStatus(`🔄 Ordre changé: ${orderText}`);
            setTimeout(() => {
                updateStatus(isScanning ? 'Scan en cours...' : 'Prêt à scanner le dossier...');
            }, 2000);
        });

        // Export folder
        document.getElementById('exportFolder').addEventListener('click', function() {
            exportConversationList();
        });
    }

    // Export conversation list
    function exportConversationList() {
        const conversationsToExport = filteredConversations.length > 0 ? filteredConversations : conversations;

        // Use the same sorting logic as displayConversations
        let exportConversations = [...conversationsToExport];

        // Sort by timestamp (newest first by default)
        exportConversations.sort((a, b) => {
            return b.timestamp - a.timestamp; // Newest first
        });

        // If reversed, simply reverse the already sorted array
        if (isReversed) {
            exportConversations.reverse();
        }

        let textContent = `Dossier de Conversations - ${exportConversations.length} conversations\n`;
        textContent += `Ordre: ${isReversed ? 'Ancien → Nouveau' : 'Nouveau → Ancien'}\n`;
        textContent += '='.repeat(60) + '\n\n';

        exportConversations.forEach((conv, index) => {
            textContent += `${index + 1}. ${conv.author}\n`;
            textContent += `   Titre: ${conv.title}\n`;
            textContent += `   Date: ${conv.date}\n`;
            textContent += `   ID: ${conv.id}\n`;
            textContent += '-'.repeat(40) + '\n\n';
        });

        navigator.clipboard.writeText(textContent).then(() => {
            updateStatus('📋 Liste des conversations copiée !');
            setTimeout(() => {
                updateStatus(isScanning ? 'Scan en cours...' : 'Prêt à scanner le dossier...');
            }, 2000);
        }).catch(() => {
            updateStatus('❌ Échec de la copie.');
        });
    }

    // Setup search functionality
    function setupSearchFunctionality() {
        const authorSearch = document.getElementById('searchAuthor');
        const titleSearch = document.getElementById('searchTitle');
        const clearSearch = document.getElementById('clearSearch');

        function performSearch() {
            const authorQuery = authorSearch.value.toLowerCase().trim();
            const titleQuery = titleSearch.value.toLowerCase().trim();

            if (!authorQuery && !titleQuery) {
                filteredConversations = [];
                displayConversations();
                return;
            }

            filteredConversations = conversations.filter(conv => {
                const matchesAuthor = !authorQuery || conv.author.toLowerCase().includes(authorQuery);
                const matchesTitle = !titleQuery || conv.title.toLowerCase().includes(titleQuery);
                return matchesAuthor && matchesTitle;
            });

            displayConversations();
            updateStatus(`🔍 ${filteredConversations.length} conversations trouvées.`);
        }

        authorSearch.addEventListener('input', performSearch);
        titleSearch.addEventListener('input', performSearch);

        clearSearch.addEventListener('click', function() {
            authorSearch.value = '';
            titleSearch.value = '';
            filteredConversations = [];
            displayConversations();
            updateStatus('Recherche effacée.');
        });

        // Enter key support
        authorSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') performSearch();
        });
        titleSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') performSearch();
        });
    }

    // Setup drag functionality
    function setupDragFunctionality(header) {
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };

        header.addEventListener('mousedown', function(e) {
            if (e.target.tagName === 'BUTTON') return;

            isDragging = true;
            const rect = browserWindow.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;

            header.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;

            const newX = e.clientX - dragOffset.x;
            const newY = e.clientY - dragOffset.y;

            const maxX = window.innerWidth - browserWindow.offsetWidth;
            const maxY = window.innerHeight - browserWindow.offsetHeight;

            browserWindow.style.left = Math.max(0, Math.min(newX, maxX)) + 'px';
            browserWindow.style.top = Math.max(0, Math.min(newY, maxY)) + 'px';
            browserWindow.style.right = 'auto';
        });

        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                header.style.cursor = 'move';
            }
        });
    }

    // Initialize the script
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(init, 1000);
            });
            return;
        }

        createScannerButton();
        createBrowserWindow();

        console.log('Dreadcast Folder Scanner initialisé !');
    }

    // Start the script
    init();

})();
