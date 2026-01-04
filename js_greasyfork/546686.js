// ==UserScript==
// @name         Msg Dumper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extrait les messages, les dates, les tri.
// @author       Laïn
// @match        https://www.dreadcast.net/Main*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546686/Msg%20Dumper.user.js
// @updateURL https://update.greasyfork.org/scripts/546686/Msg%20Dumper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let scanMode = false;
    let scanButton;
    let dumpWindow;
    let originalXHROpen;
    let currentConversationId = null;
    let messageIds = [];
    let messageData = [];
    let messageTimestamps = {}; // Store timestamps for each message ID
    let currentMessageIndex = 0;
    let isReversed = false;
    let filteredMessages = [];
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let isCollapsed = false;
    let isScanning = false;
    let scanningInterval = null;
    
    // Progress tracking variables
    let scanStartTime = null;
    let processedCount = 0;
    let failedCount = 0;
    let progressUpdateInterval = null;

    // Create the scan button
    function createScanButton() {
        scanButton = document.createElement('button');
        scanButton.innerHTML = '🤖';
        scanButton.style.cssText = `
            position: fixed;
            top: 40px;
            left: 40px;
            z-index: 100001;
            width: 60px;
            height: 60px;
            border: none;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4), 0 4px 10px rgba(0,0,0,0.2);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        scanButton.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) translateY(-2px)';
            this.style.background = 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)';
            this.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.6), 0 6px 15px rgba(0,0,0,0.3)';
        });
        
        scanButton.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) translateY(0)';
            this.style.background = scanMode ? 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            this.style.boxShadow = scanMode ? '0 8px 25px rgba(72, 187, 120, 0.4), 0 4px 10px rgba(0,0,0,0.2)' : '0 8px 25px rgba(102, 126, 234, 0.4), 0 4px 10px rgba(0,0,0,0.2)';
        });
        
        scanButton.addEventListener('click', toggleScanMode);
        document.body.appendChild(scanButton);
    }

    // Create the dump window
    function createDumpWindow() {
        dumpWindow = document.createElement('div');
        dumpWindow.style.cssText = `
            position: fixed;
            top: 100px;
            right: 40px;
            width: 520px;
            height: 650px;
            z-index: 100001;
            background: linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5), 0 10px 25px rgba(0, 0, 0, 0.3);
            display: none;
            flex-direction: column;
            user-select: none;
            backdrop-filter: blur(20px);
            overflow: hidden;
        `;

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
            <span style="font-size: 16px; display: flex; align-items: center; gap: 10px;">
                <span style="background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 18px;">📝</span>
                Extraction de Messages
            </span>
            <div style="display: flex; gap: 8px;">
                ${createModernButton('stopScan', '⏸️', 'Arrêter le scan', 'linear-gradient(135deg, #ff6b6b, #ee5a52)', 'none')}
                ${createModernButton('copyToClipboard', '📋', 'Copier tous les messages dans le presse-papiers', 'linear-gradient(135deg, #9c27b0, #673ab7)')}
                ${createModernButton('reverseOrder', '🔄', 'Inverser l\'ordre des messages', 'linear-gradient(135deg, #ff9800, #f57c00)')}
                ${createModernButton('clearDump', '🗑️', 'Effacer tous les messages', 'linear-gradient(135deg, #f44336, #d32f2f)')}
                ${createModernButton('closeWindow', '✖️', 'Fermer la fenêtre', 'linear-gradient(135deg, #757575, #616161)')}
            </div>
        `;

        // Search controls
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
            <input type="text" id="searchKeywords" placeholder="Rechercher mots-clés..." style="
                flex: 1;
                min-width: 180px;
                padding: 12px 16px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 12px;
                background: rgba(255, 255, 255, 0.05);
                color: white;
                font-size: 13px;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
            " onfocus="this.style.borderColor='rgba(102, 126, 234, 0.8)'; this.style.background='rgba(255, 255, 255, 0.1)'" onblur="this.style.borderColor='rgba(255, 255, 255, 0.2)'; this.style.background='rgba(255, 255, 255, 0.05)'">
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
            " onfocus="this.style.borderColor='rgba(102, 126, 234, 0.8)'; this.style.background='rgba(255, 255, 255, 0.1)'" onblur="this.style.borderColor='rgba(255, 255, 255, 0.2)'; this.style.background='rgba(255, 255, 255, 0.05)'">
            ${createModernButton('clearSearch', '✖️', 'Effacer la recherche', 'linear-gradient(135deg, #607d8b, #546e7a)')}
        `;

        const content = document.createElement('div');
        content.id = 'dumpContent';
        content.style.cssText = `
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

        const status = document.createElement('div');
        status.id = 'dumpStatus';
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
                <span id="statusText" style="font-weight: 500;">Prêt à scanner...</span>
                ${createModernButton('stopScanBottom', '⏸️', 'Arrêter le scan', 'linear-gradient(135deg, #ff6b6b, #ee5a52)', 'none', '8px', '10px')}
            </div>
            <div id="progressContainer" style="display: none; animation: slideDown 0.3s ease-out;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 11px; opacity: 0.9;">
                    <span id="progressText" style="font-weight: 500;">0 / 0 messages</span>
                    <span id="progressStats" style="color: #81c784;">✓ 0  ✗ 0</span>
                    <span id="progressPercentage" style="font-weight: 600; color: #4fc3f7;">0%</span>
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
                        background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #48bb78 100%);
                        border-radius: 12px; 
                        transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                        position: relative;
                        overflow: hidden;
                        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
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
                    <span id="progressSpeed" style="color: #ffb74d;">⚡ -- msg/s</span>
                    <span id="progressETA" style="color: #ff8a65;">⏱️ Calcul du temps restant...</span>
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

        dumpWindow.appendChild(header);
        dumpWindow.appendChild(searchControls);
        dumpWindow.appendChild(content);
        dumpWindow.appendChild(status);
        document.body.appendChild(dumpWindow);

        // Setup drag functionality
        setupDragFunctionality(header);
        
        // Setup header double-click collapse
        header.addEventListener('dblclick', toggleWindowCollapse);

        // Setup button functionality
        setupWindowControls();
        
        // Setup search functionality
        setupSearchFunctionality();
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

    // Toggle scan mode
    function toggleScanMode() {
        scanMode = !scanMode;
        
        if (scanMode) {
            scanButton.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
            scanButton.style.boxShadow = '0 8px 25px rgba(72, 187, 120, 0.4), 0 4px 10px rgba(0,0,0,0.2)';
            scanButton.innerHTML = '⏹️';
            dumpWindow.style.display = 'flex';
            updateStatus('Mode scan activé. Surveillance des requêtes réseau...');
            setupNetworkInterception();
        } else {
            scanButton.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            scanButton.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4), 0 4px 10px rgba(0,0,0,0.2)';
            scanButton.innerHTML = '🤖';
            // Don't close the window automatically - let user decide
            updateStatus('Mode scan désactivé.');
            restoreNetworkInterception();
            resetScanData();
        }
    }

    // Update status
    function updateStatus(message) {
        const statusText = document.getElementById('statusText');
        if (statusText) {
            statusText.textContent = message;
        }
    }

    // Setup network interception
    function setupNetworkInterception() {
        if (!originalXHROpen) {
            originalXHROpen = XMLHttpRequest.prototype.open;
        }

        XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
            this.addEventListener('load', function() {
                if (scanMode && url.includes('action=OpenMessage')) {
                    handleOpenMessage(url, this.responseText);
                }
            });
            
            return originalXHROpen.apply(this, arguments);
        };
    }

    // Restore network interception
    function restoreNetworkInterception() {
        if (originalXHROpen) {
            XMLHttpRequest.prototype.open = originalXHROpen;
        }
    }

    // Handle OpenMessage response
    function handleOpenMessage(url, responseText) {
        // Extract conversation ID from URL
        const conversationMatch = url.match(/id_conversation=(\d+)/);
        if (!conversationMatch) return;

        currentConversationId = conversationMatch[1];
        updateStatus(`Conversation ${currentConversationId} trouvée. Extraction des IDs de messages...`);

        // Extract message IDs and timestamps
        const extractionResult = extractMessageIdsAndTimestamps(responseText);
        messageIds = extractionResult.ids;
        messageTimestamps = extractionResult.timestamps;
        
        if (messageIds.length > 0) {
            updateStatus(`${messageIds.length} messages trouvés. Début de l'extraction...`);
            messageData = [];
            filteredMessages = [];
            currentMessageIndex = 0;
            startScanning();
            fetchNextMessage();
        } else {
            updateStatus('Aucun message trouvé dans la conversation.');
        }
    }

    // Extract message IDs and timestamps from the response
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

    // Extract message IDs from the response (legacy function, replaced by extractMessageIdsAndTimestamps)
    function extractMessageIds(responseText) {
        const ids = [];
        const regex = /id="convers_(\d+)"/g;
        let match;
        
        while ((match = regex.exec(responseText)) !== null) {
            ids.push(match[1]);
        }
        
        // Sort IDs to get chronological order (assuming higher ID = newer message)
        return ids.sort((a, b) => parseInt(a) - parseInt(b));
    }

    // Fetch next message
    function fetchNextMessage() {
        if (currentMessageIndex >= messageIds.length || !scanMode || !isScanning) {
            if (scanMode && isScanning) {
                stopScanning();
                displayMessages();
                
                // Show completion notification
                const successCount = messageData.length;
                const totalCount = messageIds.length;
                const failedCount = totalCount - successCount;
                
                let statusMessage = `✅ Extraction terminée ! ${successCount} messages extraits`;
                if (failedCount > 0) {
                    statusMessage += ` (${failedCount} échecs)`;
                }
                
                updateStatus(statusMessage);
                showCompletionNotification(successCount, failedCount);
            }
            return;
        }

        const messageId = messageIds[currentMessageIndex];

        const xhr = new XMLHttpRequest();
        xhr.open('GET', `https://www.dreadcast.net/Menu/Messaging/action=ReadMessage&id_message=${messageId}&id_conversation=${currentConversationId}`, true);
        
        xhr.onload = function() {
            if (this.status === 200) {
                const messageInfo = parseMessageResponse(this.responseText, messageId);
                if (messageInfo) {
                    messageData.push(messageInfo);
                }
            }
            
            currentMessageIndex++;
            processedCount++;
            
            if (isScanning) {
                setTimeout(fetchNextMessage, 100); // Small delay to avoid overwhelming the server
            }
        };
        
        xhr.onerror = function() {
            currentMessageIndex++;
            processedCount++;
            failedCount++;
            
            if (isScanning) {
                setTimeout(fetchNextMessage, 100);
            }
        };
        
        xhr.send();
    }

    // Show completion notification
    function showCompletionNotification(successCount, failedCount) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, rgba(72, 187, 120, 0.95), rgba(56, 161, 105, 0.95));
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
            <div>Extraction terminée !</div>
            <div style="font-size: 14px; margin-top: 8px; opacity: 0.9;">
                ${successCount} messages extraits${failedCount > 0 ? ` • ${failedCount} échecs` : ''}
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'completionBounce 0.5s ease-out reverse';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    // Parse message response
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

    // Display messages in the dump window
    function displayMessages() {
        const content = document.getElementById('dumpContent');
        if (!content) return;

        let messagesToDisplay = filteredMessages.length > 0 ? filteredMessages : messageData;
        
        if (isReversed) {
            messagesToDisplay = [...messagesToDisplay].reverse();
        }

        let html = `
            <div style="
                text-align: center; 
                margin-bottom: 25px; 
                padding: 20px;
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
                border-radius: 16px;
                border: 1px solid rgba(102, 126, 234, 0.2);
            ">
                <h3 style="
                    margin: 0; 
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    font-size: 18px;
                    font-weight: 700;
                ">Conversation ${currentConversationId}</h3>
                <p style="
                    margin: 8px 0 0 0; 
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 14px;
                    font-weight: 500;
                ">${messagesToDisplay.length} messages</p>
            </div>
        `;
        
        messagesToDisplay.forEach((msg, index) => {
            html += `
                <div style="
                    margin-bottom: 20px; 
                    padding: 18px; 
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%);
                    border-radius: 16px; 
                    border-left: 4px solid linear-gradient(135deg, #667eea, #764ba2);
                    border-left: 4px solid #667eea;
                    user-select: text;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.3s ease;
                " onmouseover="this.style.background='linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)'" onmouseout="this.style.background='linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)'">
                    <div style="
                        color: #4fc3f7; 
                        font-weight: 600; 
                        margin-bottom: 8px; 
                        user-select: text;
                        font-size: 14px;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    ">
                        <span style="
                            background: linear-gradient(135deg, #4fc3f7, #29b6f6);
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

        content.innerHTML = html;
        content.scrollTop = content.scrollHeight;
    }

    // Setup drag functionality
    function setupDragFunctionality(header) {
        header.addEventListener('mousedown', function(e) {
            if (e.target.tagName === 'BUTTON') return; // Don't drag when clicking buttons
            
            isDragging = true;
            const rect = dumpWindow.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            
            header.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            const newX = e.clientX - dragOffset.x;
            const newY = e.clientY - dragOffset.y;
            
            // Keep window within viewport bounds
            const maxX = window.innerWidth - dumpWindow.offsetWidth;
            const maxY = window.innerHeight - dumpWindow.offsetHeight;
            
            dumpWindow.style.left = Math.max(0, Math.min(newX, maxX)) + 'px';
            dumpWindow.style.top = Math.max(0, Math.min(newY, maxY)) + 'px';
            dumpWindow.style.right = 'auto'; // Remove right positioning when dragging
        });

        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                header.style.cursor = 'move';
            }
        });
    }

    // Toggle window collapse
    function toggleWindowCollapse() {
        isCollapsed = !isCollapsed;
        const content = document.getElementById('dumpContent');
        const searchControls = dumpWindow.children[1];
        const status = document.getElementById('dumpStatus');
        
        if (isCollapsed) {
            content.style.display = 'none';
            searchControls.style.display = 'none';
            status.style.display = 'none';
            dumpWindow.style.height = 'auto';
        } else {
            content.style.display = 'block';
            searchControls.style.display = 'flex';
            status.style.display = 'block';
            dumpWindow.style.height = '600px';
        }
    }

    // Setup window controls
    function setupWindowControls() {
        // Stop scan button functionality (header)
        document.getElementById('stopScan').addEventListener('click', function() {
            stopScanning();
            updateStatus(`Scan arrêté. ${messageData.length} messages extraits.`);
            if (messageData.length > 0) {
                displayMessages();
            }
        });

        // Stop scan button functionality (bottom status bar)
        document.getElementById('stopScanBottom').addEventListener('click', function() {
            stopScanning();
            updateStatus(`Scan arrêté. ${messageData.length} messages extraits.`);
            if (messageData.length > 0) {
                displayMessages();
            }
        });

        // Close window button functionality
        document.getElementById('closeWindow').addEventListener('click', function() {
            dumpWindow.style.display = 'none';
            // Stop scan mode when window is closed
            if (scanMode) {
                scanMode = false;
                scanButton.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                scanButton.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4), 0 4px 10px rgba(0,0,0,0.2)';
                scanButton.innerHTML = '🤖';
                restoreNetworkInterception();
                resetScanData();
                updateStatus('Mode scan désactivé.');
            }
        });

        // Clear button functionality
        document.getElementById('clearDump').addEventListener('click', function() {
            document.getElementById('dumpContent').innerHTML = '';
            updateStatus('Extraction effacée.');
            messageData = [];
            filteredMessages = [];
        });

        // Copy to clipboard functionality
        document.getElementById('copyToClipboard').addEventListener('click', function() {
            const messagesToCopy = filteredMessages.length > 0 ? filteredMessages : messageData;
            let displayMessages = isReversed ? [...messagesToCopy].reverse() : messagesToCopy;
            
            let textContent = `Conversation ${currentConversationId} - ${displayMessages.length} messages\n`;
            textContent += '='.repeat(60) + '\n\n';
            
            displayMessages.forEach((msg, index) => {
                textContent += `${index + 1}. ${msg.author} (ID: ${msg.id})\n`;
                textContent += `📅 ${msg.timestamp}\n`;
                textContent += `${msg.message}\n`;
                textContent += '-'.repeat(40) + '\n\n';
            });
            
            navigator.clipboard.writeText(textContent).then(() => {
                updateStatus('Messages copiés dans le presse-papiers !');
                setTimeout(() => {
                    updateStatus(scanMode ? 'Mode scan actif.' : 'Prêt à scanner...');
                }, 2000);
            }).catch(() => {
                updateStatus('Échec de la copie dans le presse-papiers.');
            });
        });

        // Reverse order functionality
        document.getElementById('reverseOrder').addEventListener('click', function() {
            isReversed = !isReversed;
            this.style.background = isReversed ? 'linear-gradient(135deg, #4caf50, #388e3c)' : 'linear-gradient(135deg, #ff9800, #f57c00)';
            this.title = isReversed ? 'Afficher l\'ordre chronologique' : 'Inverser l\'ordre des messages';
            displayMessages();
        });
    }

    // Start scanning animation and show stop button
    function startScanning() {
        isScanning = true;
        scanStartTime = Date.now();
        processedCount = 0;
        failedCount = 0;
        
        // Show progress container with animation
        const progressContainer = document.getElementById('progressContainer');
        progressContainer.style.display = 'block';
        
        // Show stop buttons with pulsing animation
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
        startProgressUpdates();
        
        updateStatus('🔍 Initialisation du scan...');
    }

    // New function to handle progress updates
    function startProgressUpdates() {
        progressUpdateInterval = setInterval(() => {
            if (!isScanning) {
                clearInterval(progressUpdateInterval);
                return;
            }
            updateProgressDisplay();
        }, 250); // Update every 250ms for smooth animation
    }

    // Comprehensive progress display update
    function updateProgressDisplay() {
        const totalMessages = messageIds.length;
        const processed = currentMessageIndex;
        const successful = messageData.length;
        const failed = processed - successful;
        const percentage = totalMessages > 0 ? Math.round((processed / totalMessages) * 100) : 0;
        
        // Update progress bar with smooth animation
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        const progressStats = document.getElementById('progressStats');
        const progressPercentage = document.getElementById('progressPercentage');
        const progressSpeed = document.getElementById('progressSpeed');
        const progressETA = document.getElementById('progressETA');
        
        if (progressFill) {
            progressFill.style.width = percentage + '%';
            
            // Change color based on progress
            if (percentage < 30) {
                progressFill.style.background = 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)';
            } else if (percentage < 70) {
                progressFill.style.background = 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #9c27b0 100%)';
            } else {
                progressFill.style.background = 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #48bb78 100%)';
            }
        }
        
        if (progressText) {
            progressText.textContent = `${processed} / ${totalMessages} messages`;
        }
        
        if (progressStats) {
            progressStats.innerHTML = `<span style="color: #81c784;">✓ ${successful}</span>  <span style="color: #f44336;">✗ ${failed}</span>`;
        }
        
        if (progressPercentage) {
            progressPercentage.textContent = percentage + '%';
            // Add color coding for percentage
            if (percentage < 50) {
                progressPercentage.style.color = '#4fc3f7';
            } else if (percentage < 80) {
                progressPercentage.style.color = '#9c27b0';
            } else {
                progressPercentage.style.color = '#48bb78';
            }
        }
        
        // Calculate and display speed
        if (progressSpeed && scanStartTime && processed > 0) {
            const elapsed = (Date.now() - scanStartTime) / 1000; // seconds
            const speed = processed / elapsed;
            progressSpeed.innerHTML = `⚡ ${speed.toFixed(1)} msg/s`;
        }
        
        // Calculate and display ETA
        if (progressETA && processed > 0 && scanStartTime) {
            const elapsed = Date.now() - scanStartTime;
            const avgTimePerMessage = elapsed / processed;
            const remaining = totalMessages - processed;
            const etaMs = remaining * avgTimePerMessage;
            
            let etaText = 'Calcul...';
            if (etaMs > 0 && etaMs < 86400000) { // Less than 24 hours
                const etaMinutes = Math.floor(etaMs / 60000);
                const etaSeconds = Math.floor((etaMs % 60000) / 1000);
                
                if (etaMinutes > 60) {
                    const hours = Math.floor(etaMinutes / 60);
                    const mins = etaMinutes % 60;
                    etaText = `${hours}h ${mins}m`;
                } else if (etaMinutes > 0) {
                    etaText = `${etaMinutes}m ${etaSeconds}s`;
                } else {
                    etaText = `${etaSeconds}s`;
                }
            }
            
            progressETA.innerHTML = `⏱️ ${etaText}`;
        }
        
        // Update main status text with dynamic dots
        const dots = '.'.repeat((Math.floor(Date.now() / 500) % 3) + 1);
        const statusEmoji = getStatusEmoji(percentage);
        updateStatus(`${statusEmoji} Scan en cours${dots} (${processed}/${totalMessages})`);
    }

    // Get appropriate emoji based on progress
    function getStatusEmoji(percentage) {
        if (percentage < 25) return '🔍';
        if (percentage < 50) return '⚡';
        if (percentage < 75) return '🚀';
        return '🎯';
    }

    // Stop scanning animation and hide stop button
    function stopScanning() {
        isScanning = false;
        
        // Clear progress updates
        if (progressUpdateInterval) {
            clearInterval(progressUpdateInterval);
            progressUpdateInterval = null;
        }
        
        // Hide progress container with animation
        const progressContainer = document.getElementById('progressContainer');
        if (progressContainer) {
            progressContainer.style.animation = 'slideUp 0.3s ease-out';
            setTimeout(() => {
                progressContainer.style.display = 'none';
                progressContainer.style.animation = '';
            }, 300);
        }
        
        // Clear existing intervals
        if (scanningInterval) {
            clearInterval(scanningInterval);
            scanningInterval = null;
        }
        
        // Hide stop buttons and remove pulsing
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

    // Setup search functionality
    function setupSearchFunctionality() {
        const keywordSearch = document.getElementById('searchKeywords');
        const authorSearch = document.getElementById('searchAuthor');
        const clearSearch = document.getElementById('clearSearch');

        function performSearch() {
            const keywordQuery = keywordSearch.value.toLowerCase().trim();
            const authorQuery = authorSearch.value.toLowerCase().trim();
            
            if (!keywordQuery && !authorQuery) {
                filteredMessages = [];
                displayMessages();
                return;
            }
            
            filteredMessages = messageData.filter(msg => {
                const matchesKeyword = !keywordQuery || msg.message.toLowerCase().includes(keywordQuery);
                const matchesAuthor = !authorQuery || msg.author.toLowerCase().includes(authorQuery);
                return matchesKeyword && matchesAuthor;
            });
            
            displayMessages();
            updateStatus(`${filteredMessages.length} messages trouvés correspondant aux critères de recherche.`);
        }

        keywordSearch.addEventListener('input', performSearch);
        authorSearch.addEventListener('input', performSearch);
        
        clearSearch.addEventListener('click', function() {
            keywordSearch.value = '';
            authorSearch.value = '';
            filteredMessages = [];
            displayMessages();
            updateStatus(scanMode ? 'Recherche effacée.' : 'Prêt à scanner...');
        });

        // Enter key support
        keywordSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') performSearch();
        });
        authorSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') performSearch();
        });
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Reset scan data
    function resetScanData() {
        stopScanning(); // This will clear progress display
        
        currentConversationId = null;
        messageIds = [];
        messageData = [];
        messageTimestamps = {};
        filteredMessages = [];
        currentMessageIndex = 0;
        isReversed = false;
        
        // Reset progress tracking variables
        scanStartTime = null;
        processedCount = 0;
        failedCount = 0;
        
        // Reset reverse button
        const reverseBtn = document.getElementById('reverseOrder');
        if (reverseBtn) {
            reverseBtn.style.background = 'linear-gradient(135deg, #ff9800, #f57c00)';
            reverseBtn.title = 'Inverser l\'ordre des messages';
        }
        
        // Clear search fields
        const keywordSearch = document.getElementById('searchKeywords');
        const authorSearch = document.getElementById('searchAuthor');
        if (keywordSearch) keywordSearch.value = '';
        if (authorSearch) authorSearch.value = '';
        
        // Reset progress display
        const progressContainer = document.getElementById('progressContainer');
        if (progressContainer) {
            progressContainer.style.display = 'none';
        }
    }

    // Initialize the script
    function init() {
        // Wait for page to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(init, 1000);
            });
            return;
        }

        createScanButton();
        createDumpWindow();
        
        console.log('Dreadcast Message Dumper initialisé !');
    }

    // Start the script
    init();

})();
