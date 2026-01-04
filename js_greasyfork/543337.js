// ==UserScript==
// @name         Claude Internal Chat API
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  API interna di Claude con form chat - API complete per VB.NET - Upload file con formato API standard base64
// @author       Flejta & Claude
// @license      MIT
// @match        https://claude.ai/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/543337/Claude%20Internal%20Chat%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/543337/Claude%20Internal%20Chat%20API.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('💬 Claude Internal Chat API v2.5 avviato');

    // Configurazione
    const CONFIG = {
        maxTokens: 2000,
        model: 'claude-3-5-sonnet-20241022',
        rateLimit: {
            requests: 3,
            windowMs: 60000 // 1 minuto
        },
        maxFileSize: 10 * 1024 * 1024, // 10MB
        maxFiles: 5
    };

    // Stato della chat
    let chatState = {
        messages: [],
        isLoading: false,
        organizationId: null,
        conversationId: null,
        lastRequestTime: [],
        chatVisible: false,
        selectedFiles: [],
        uploadedFiles: [] // Store degli UUID dei file caricati
    };

    // Funzione per validare gli ID
    function isValidUUID(id) {
        const uuidRegex = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
        return id && uuidRegex.test(id);
    }

    // Converti file in base64
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                // Rimuovi il prefisso "data:type/subtype;base64,"
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = error => reject(error);
        });
    }

    // Cerca credenziali nei tag script (dalla v1.0)
    function searchScriptTags() {
        const scripts = document.getElementsByTagName('script');

        for (let i = 0; i < scripts.length; i++) {
            const content = scripts[i].textContent || scripts[i].innerHTML || '';

            // Organization ID
            const orgMatch = content.match(/"organizationID":"([a-f0-9-]+)"/);
            if (orgMatch && isValidUUID(orgMatch[1])) {
                console.log('✅ Org ID trovato:', orgMatch[1]);
                return orgMatch[1];
            }
        }

        return null;
    }

    // Intercetta fetch per catturare Organization ID e Conversation ID
    function interceptFetch() {
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const [url, options] = args;

            if (typeof url === 'string') {
                // Intercetta Organization ID
                const orgMatch = url.match(/\/organizations\/([a-f0-9-]+)/);
                if (orgMatch && isValidUUID(orgMatch[1]) && !chatState.organizationId) {
                    chatState.organizationId = orgMatch[1];
                    console.log('✅ Org ID intercettato:', orgMatch[1]);
                    updateStatus('Chat pronta!');
                }

                // Intercetta Conversation ID
                const convMatch = url.match(/\/chat_conversations\/([a-f0-9-]+)/);
                if (convMatch && isValidUUID(convMatch[1])) {
                    chatState.conversationId = convMatch[1];
                    console.log('✅ Conversation ID intercettato:', convMatch[1]);
                }
            }

            return originalFetch.apply(this, args);
        };
    }

    // ===== FUNZIONI PER GESTIONE FILE =====

    // Upload file a Claude e ottieni UUID
    async function uploadFile(file) {
        if (!chatState.organizationId) {
            throw new Error('Organization ID non trovato');
        }

        const uploadUrl = `https://claude.ai/api/${chatState.organizationId}/upload`;

        const formData = new FormData();
        formData.append('file', file);

        console.log(`📤 Upload file: ${file.name} (${(file.size / 1024).toFixed(1)}KB)`);

        const response = await fetch(uploadUrl, {
            method: 'POST',
            credentials: 'include',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Upload fallito: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Upload completato:', data);

        return {
            uuid: data.file_uuid,
            name: data.file_name,
            size: data.size_bytes,
            type: data.file_kind
        };
    }

    // Gestione selezione file
    function handleFileSelect(event) {
        const newFiles = Array.from(event.target.files);

        // Controlla numero massimo file
        if (newFiles.length > CONFIG.maxFiles) {
            updateStatus(`Massimo ${CONFIG.maxFiles} file permessi`, true);
            return;
        }

        // Controlla dimensione file
        chatState.selectedFiles = [];
        for (const file of newFiles) {
            if (file.size > CONFIG.maxFileSize) {
                updateStatus(`File "${file.name}" troppo grande (max 10MB)`, true);
                continue;
            }
            chatState.selectedFiles.push(file);
        }

        updateFileDisplay();
    }

    // Aggiorna display file selezionati
    function updateFileDisplay() {
        const fileInfo = document.getElementById('file-info');
        if (!fileInfo) return;

        if (chatState.selectedFiles.length === 0) {
            fileInfo.textContent = '';
            return;
        }

        const fileNames = chatState.selectedFiles.map(f =>
                                                      `${f.name} (${(f.size / 1024).toFixed(1)}KB)`
        ).join(', ');
        fileInfo.textContent = `📎 ${chatState.selectedFiles.length} file: ${fileNames}`;
        fileInfo.style.color = '#60a5fa';
    }

    // Pulisci file selezionati
    function clearSelectedFiles() {
        chatState.selectedFiles = [];
        chatState.uploadedFiles = [];
        const fileInput = document.getElementById('file-input');
        if (fileInput) fileInput.value = '';
        updateFileDisplay();
    }

    // Crea UI della chat
    function createChatUI() {
        // Container principale
        const container = document.createElement('div');
        container.id = 'claude-chat-ui';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 350px;
            height: 500px;
            background: #1a1a1a;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            display: flex;
            flex-direction: column;
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: none;
        `;

        // Header
        const header = document.createElement('div');
        header.style.cssText = `
            padding: 15px;
            background: #2a2a2a;
            border-radius: 12px 12px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #333;
        `;
        header.innerHTML = `
            <h3 style="margin: 0; color: #60a5fa; font-size: 16px;">💬 Claude Chat v2.5</h3>
            <div>
                <button id="new-chat-btn" style="background: #059669; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-right: 5px; font-size: 12px;">Nuova Chat</button>
                <button id="close-chat-btn" style="background: none; border: none; color: #888; cursor: pointer; font-size: 18px;">✖</button>
            </div>
        `;

        // Area messaggi
        const messagesArea = document.createElement('div');
        messagesArea.id = 'chat-messages';
        messagesArea.style.cssText = `
            flex: 1;
            overflow-y: auto;
            padding: 15px;
            background: #0a0a0a;
        `;

        // Area input
        const inputArea = document.createElement('div');
        inputArea.style.cssText = `
            padding: 15px;
            border-top: 1px solid #333;
            background: #1a1a1a;
            border-radius: 0 0 12px 12px;
        `;
        inputArea.innerHTML = `
            <div style="display: flex; gap: 10px; margin-bottom: 8px;">
                <textarea id="chat-input" placeholder="Scrivi un messaggio..." style="
                    flex: 1;
                    padding: 8px;
                    background: #2a2a2a;
                    color: white;
                    border: 1px solid #444;
                    border-radius: 6px;
                    resize: none;
                    font-family: inherit;
                    font-size: 14px;
                    height: 60px;
                "></textarea>
                <div style="display: flex; flex-direction: column; gap: 5px;">
                    <button id="send-btn" style="
                        background: #3b82f6;
                        color: white;
                        border: none;
                        padding: 8px 15px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                    ">Invia</button>
                    <label for="file-input" style="
                        background: #059669;
                        color: white;
                        border: none;
                        padding: 8px 15px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                        text-align: center;
                    ">📎 File</label>
                    <input type="file" id="file-input" multiple accept="*/*" style="display: none;">
                </div>
            </div>
            <div id="file-info" style="font-size: 12px; color: #666; margin-bottom: 5px; word-wrap: break-word;"></div>
            <div id="chat-status" style="font-size: 12px; color: #666;"></div>
        `;

        // Assembla UI
        container.appendChild(header);
        container.appendChild(messagesArea);
        container.appendChild(inputArea);
        document.body.appendChild(container);

        // Event listeners
        document.getElementById('close-chat-btn').onclick = toggleChat;
        document.getElementById('new-chat-btn').onclick = newChat;
        document.getElementById('send-btn').onclick = sendMessage;
        document.getElementById('file-input').onchange = handleFileSelect;

        // Invio con Enter
        document.getElementById('chat-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    // Crea pulsante toggle chat
    function createToggleButton() {
        const button = document.createElement('button');
        button.id = 'claude-chat-toggle';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
            z-index: 9999;
            font-size: 24px;
        `;
        button.innerHTML = '💬';
        button.onclick = toggleChat;

        document.body.appendChild(button);
    }

    // Toggle visualizzazione chat
    function toggleChat() {
        chatState.chatVisible = !chatState.chatVisible;
        const chatUI = document.getElementById('claude-chat-ui');
        const toggleBtn = document.getElementById('claude-chat-toggle');

        if (chatState.chatVisible) {
            chatUI.style.display = 'flex';
            toggleBtn.style.display = 'none';
            document.getElementById('chat-input').focus();
        } else {
            chatUI.style.display = 'none';
            toggleBtn.style.display = 'block';
        }
    }

    // Nuova chat
    function newChat() {
        if (confirm('Sei sicuro di voler iniziare una nuova chat?')) {
            chatState.messages = [];
            chatState.conversationId = null;
            clearSelectedFiles();
            updateMessagesDisplay();
            updateStatus('Nuova chat iniziata');
        }
    }

    // Aggiorna display messaggi
    function updateMessagesDisplay() {
        const messagesArea = document.getElementById('chat-messages');
        messagesArea.innerHTML = '';

        if (chatState.messages.length === 0) {
            messagesArea.innerHTML = '<div style="text-align: center; color: #666; margin-top: 50px;">Inizia una conversazione con Claude!</div>';
            return;
        }

        chatState.messages.forEach((msg) => {
            const messageDiv = document.createElement('div');
            messageDiv.style.cssText = `
                margin-bottom: 15px;
                display: flex;
                ${msg.role === 'user' ? 'justify-content: flex-end' : 'justify-content: flex-start'}
            `;

            const bubble = document.createElement('div');
            bubble.style.cssText = `
                max-width: 80%;
                padding: 10px 15px;
                border-radius: 12px;
                ${msg.role === 'user'
                ? 'background: #3b82f6; color: white; border-bottom-right-radius: 4px;'
            : 'background: #2a2a2a; color: #e0e0e0; border-bottom-left-radius: 4px;'}
                word-wrap: break-word;
                font-size: 14px;
                line-height: 1.5;
            `;

            bubble.textContent = msg.content;

            // Aggiungi indicatore file se presenti
            if (msg.files && msg.files.length > 0) {
                const fileIndicator = document.createElement('div');
                fileIndicator.style.cssText = 'font-size: 11px; margin-top: 5px; opacity: 0.8;';
                const fileNames = msg.files.map(f => f.name || 'file').join(', ');
                fileIndicator.textContent = `📎 ${msg.files.length} file: ${fileNames}`;
                bubble.appendChild(fileIndicator);
            }

            messageDiv.appendChild(bubble);
            messagesArea.appendChild(messageDiv);
        });

        messagesArea.scrollTop = messagesArea.scrollHeight;
    }

    // Aggiorna status
    function updateStatus(text, isError = false) {
        const statusDiv = document.getElementById('chat-status');
        if (statusDiv) {
            statusDiv.textContent = text;
            statusDiv.style.color = isError ? '#ef4444' : '#666';
        }
    }

    // Invia messaggio con formato API standard per file
    async function sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();

        if ((!message && chatState.selectedFiles.length === 0) || chatState.isLoading) return;

        if (!chatState.organizationId) {
            updateStatus('Errore: Organization ID non trovato. Ricarica la pagina.', true);
            return;
        }

        input.disabled = true;
        document.getElementById('send-btn').disabled = true;
        chatState.isLoading = true;

        try {
            // CASO 1: Messaggio SENZA file
            if (chatState.selectedFiles.length === 0) {
                chatState.messages.push({ role: 'user', content: message });
                updateMessagesDisplay();
                input.value = '';
                updateStatus('Claude sta pensando...');

                const response = await fetch(`/api/organizations/${chatState.organizationId}/proxy/v1/messages`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        model: CONFIG.model,
                        max_tokens: CONFIG.maxTokens,
                        messages: chatState.messages
                    })
                });

                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                const data = await response.json();
                const content = data.content?.[0]?.text || 'Risposta vuota';

                chatState.messages.push({ role: 'assistant', content: content });
                updateMessagesDisplay();
                updateStatus('');
            }
            // CASO 2: Messaggio CON file - invia direttamente come base64
            else {
                updateStatus('Preparazione file...');

                // Costruisci content array con testo e immagini
                const contentArray = [];

                // Aggiungi il testo se presente
                if (message) {
                    contentArray.push({
                        type: 'text',
                        text: message
                    });
                }

                // Converti ogni file in base64 e aggiungilo
                for (const file of chatState.selectedFiles) {
                    const base64Data = await fileToBase64(file);

                    // Determina il tipo corretto
                    let contentType = 'image';
                    if (file.type.includes('pdf')) {
                        contentType = 'document';
                    }

                    contentArray.push({
                        type: contentType,
                        source: {
                            type: 'base64',
                            media_type: file.type,
                            data: base64Data
                        }
                    });
                }

                // Aggiungi alla UI
                chatState.messages.push({
                    role: 'user',
                    content: message || '(File allegati)',
                    files: chatState.selectedFiles.map(f => ({ name: f.name }))
                });
                updateMessagesDisplay();
                clearSelectedFiles();
                input.value = '';
                updateStatus('Claude sta analizzando...');

                // Invia con il formato corretto
                const response = await fetch(`/api/organizations/${chatState.organizationId}/proxy/v1/messages`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        model: CONFIG.model,
                        max_tokens: CONFIG.maxTokens,
                        messages: [{
                            role: 'user',
                            content: contentArray
                        }]
                    })
                });

                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                const data = await response.json();
                const content = data.content?.[0]?.text || 'Risposta vuota';

                chatState.messages.push({ role: 'assistant', content: content });
                updateMessagesDisplay();
                updateStatus('');
            }

        } catch (error) {
            console.error('Errore:', error);
            updateStatus(`Errore: ${error.message}`, true);
            chatState.messages.pop();
            updateMessagesDisplay();
        } finally {
            input.disabled = false;
            document.getElementById('send-btn').disabled = false;
            chatState.isLoading = false;
            input.focus();
        }
    }
    // Inizializzazione
    function init() {
        console.log('🚀 Inizializzazione Claude Chat...');

        // Installa intercettore
        interceptFetch();

        // Cerca Organization ID negli script
        const orgId = searchScriptTags();
        if (orgId) {
            chatState.organizationId = orgId;
            console.log('✅ Organization ID iniziale:', orgId);
        }

        // Cerca conversation ID nell'URL
        const urlMatch = window.location.href.match(/\/chat\/([a-f0-9-]+)/);
        if (urlMatch && isValidUUID(urlMatch[1])) {
            chatState.conversationId = urlMatch[1];
            console.log('✅ Conversation ID dall\'URL:', urlMatch[1]);
        }

        // Crea UI
        createChatUI();
        createToggleButton();

        // Se non abbiamo ancora l'org ID, continua a cercare
        if (!chatState.organizationId) {
            console.log('⏳ Organization ID non trovato, intercettazione attiva...');
            updateStatus('Caricamento... Naviga in un progetto Claude.');
        } else {
            updateStatus('Chat pronta!');
        }
    }

    // ========================================
    // INTERFACCIA GLOBALE PER VB.NET
    // ========================================

    window.ClaudeChat = {
        // Invia singolo messaggio
        sendMessage: async function(prompt) {
            if (!chatState.organizationId) {
                return { success: false, error: 'Organization ID non trovato' };
            }

            try {
                const response = await fetch(`/api/organizations/${chatState.organizationId}/proxy/v1/messages`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        model: CONFIG.model,
                        max_tokens: CONFIG.maxTokens,
                        messages: [{ role: 'user', content: prompt }]
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();
                const content = data.content?.[0]?.text || '';

                return { success: true, content: content };

            } catch (error) {
                return { success: false, error: error.message };
            }
        },

        // Invia conversazione completa con contesto
        sendConversation: async function(messages) {
            if (!chatState.organizationId) {
                return { success: false, error: 'Organization ID non trovato' };
            }

            // Valida formato messaggi
            if (!Array.isArray(messages)) {
                return { success: false, error: 'messages deve essere un array' };
            }

            try {
                const response = await fetch(`/api/organizations/${chatState.organizationId}/proxy/v1/messages`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        model: CONFIG.model,
                        max_tokens: CONFIG.maxTokens,
                        messages: messages
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();
                const content = data.content?.[0]?.text || '';

                return { success: true, content: content };

            } catch (error) {
                return { success: false, error: error.message };
            }
        },

        // Upload file da base64 e ottieni UUID
        uploadFileBase64: async function(base64Data, fileName, mimeType) {
            if (!chatState.organizationId) {
                return { success: false, error: 'Organization ID non trovato' };
            }

            try {
                // Converti base64 in blob
                const byteCharacters = atob(base64Data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: mimeType });
                const file = new File([blob], fileName, { type: mimeType });

                // Upload e ottieni UUID
                const result = await uploadFile(file);

                return {
                    success: true,
                    file_uuid: result.uuid,
                    file_name: result.name,
                    file_size: result.size
                };

            } catch (error) {
                return { success: false, error: error.message };
            }
        },

        // Invia messaggio con file in base64 (formato API standard)
        sendMessageWithFileBase64: async function(prompt, fileBase64, fileName, mimeType) {
            if (!chatState.organizationId) {
                return { success: false, error: 'Organization ID non trovato' };
            }

            try {
                // Determina il tipo di contenuto basato sul MIME type
                const isImage = mimeType.startsWith('image/');
                const contentType = isImage ? 'image' : 'document';

                const requestBody = {
                    model: CONFIG.model,
                    max_tokens: CONFIG.maxTokens,
                    messages: [{
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: prompt || 'Analizza questo file'
                            },
                            {
                                type: contentType,
                                source: {
                                    type: 'base64',
                                    media_type: mimeType,
                                    data: fileBase64 // base64 senza prefisso data:
                                }
                            }
                        ]
                    }]
                };

                const response = await fetch(`/api/organizations/${chatState.organizationId}/proxy/v1/messages`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(requestBody)
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();
                const content = data.content?.[0]?.text || '';

                return { success: true, content: content };

            } catch (error) {
                return { success: false, error: error.message };
            }
        },

        // Invia messaggio con UUID dei file (metodo legacy)
        sendMessageWithFiles: async function(prompt, fileUUIDs) {
            if (!chatState.organizationId) {
                return { success: false, error: 'Organization ID non trovato' };
            }

            try {
                const requestBody = {
                    prompt: prompt || '',
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    model: CONFIG.model,
                    files: fileUUIDs || [], // Array di UUID
                    attachments: [],
                    rendering_mode: 'messages'
                };

                const url = chatState.conversationId
                ? `/api/organizations/${chatState.organizationId}/chat_conversations/${chatState.conversationId}/completion`
                    : `/api/organizations/${chatState.organizationId}/proxy/v1/messages`;

                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'text/event-stream, text/event-stream'
                    },
                    credentials: 'include',
                    body: JSON.stringify(requestBody)
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                // Parse streaming response
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let assistantResponse = '';

                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const jsonStr = line.slice(6);
                                if (jsonStr && jsonStr !== '[DONE]') {
                                    const data = JSON.parse(jsonStr);
                                    if (data.completion) {
                                        assistantResponse = data.completion;
                                    }
                                }
                            } catch (e) {
                                // Ignora
                            }
                        }
                    }
                }

                return { success: true, content: assistantResponse };

            } catch (error) {
                return { success: false, error: error.message };
            }
        },

        // Reset chat (pulisce UI e storico)
        resetChat: function() {
            chatState.messages = [];
            chatState.conversationId = null;
            clearSelectedFiles();
            updateMessagesDisplay();
            updateStatus('Chat resettata');
            return { success: true };
        },

        // Ottieni storico conversazione
        getHistory: function() {
            return {
                success: true,
                messages: chatState.messages,
                count: chatState.messages.length
            };
        },

        // Toggle UI chat
        toggleUI: function() {
            toggleChat();
            return {
                success: true,
                visible: chatState.chatVisible
            };
        },

        // Mostra UI chat
        showUI: function() {
            if (!chatState.chatVisible) {
                toggleChat();
            }
            return { success: true };
        },

        // Nascondi UI chat
        hideUI: function() {
            if (chatState.chatVisible) {
                toggleChat();
            }
            return { success: true };
        },

        // Aggiungi messaggio allo storico UI senza inviare
        addToHistory: function(role, content) {
            if (!['user', 'assistant'].includes(role)) {
                return { success: false, error: 'role deve essere "user" o "assistant"' };
            }

            chatState.messages.push({ role, content });
            updateMessagesDisplay();
            return { success: true };
        },

        // Imposta storico completo
        setHistory: function(messages) {
            if (!Array.isArray(messages)) {
                return { success: false, error: 'messages deve essere un array' };
            }

            chatState.messages = messages;
            updateMessagesDisplay();
            return { success: true };
        },

        // Get Organization ID
        getOrgId: function() {
            return chatState.organizationId;
        },

        // Get Conversation ID
        getConversationId: function() {
            return chatState.conversationId;
        },

        // Set Organization ID manualmente
        setOrgId: function(orgId) {
            if (isValidUUID(orgId)) {
                chatState.organizationId = orgId;
                updateStatus('Organization ID impostato manualmente');
                return { success: true };
            }
            return { success: false, error: 'Organization ID non valido' };
        },

        // Set Conversation ID manualmente
        setConversationId: function(convId) {
            if (isValidUUID(convId)) {
                chatState.conversationId = convId;
                return { success: true };
            }
            return { success: false, error: 'Conversation ID non valido' };
        },

        // Get stato chat
        getState: function() {
            return {
                organizationId: chatState.organizationId,
                conversationId: chatState.conversationId,
                messageCount: chatState.messages.length,
                isLoading: chatState.isLoading,
                isVisible: chatState.chatVisible,
                hasFiles: chatState.selectedFiles.length > 0,
                uploadedFiles: chatState.uploadedFiles,
                lastMessage: chatState.messages[chatState.messages.length - 1] || null
            };
        },

        // Invia messaggio e aggiorna UI
        sendMessageWithUI: async function(prompt) {
            if (!chatState.organizationId) {
                return { success: false, error: 'Organization ID non trovato' };
            }

            // Aggiungi alla UI
            chatState.messages.push({ role: 'user', content: prompt });
            updateMessagesDisplay();
            updateStatus('Claude sta pensando...');

            try {
                const response = await fetch(`/api/organizations/${chatState.organizationId}/proxy/v1/messages`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        model: CONFIG.model,
                        max_tokens: CONFIG.maxTokens,
                        messages: chatState.messages
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();
                const content = data.content?.[0]?.text || '';

                // Aggiungi risposta alla UI
                chatState.messages.push({ role: 'assistant', content: content });
                updateMessagesDisplay();
                updateStatus('');

                return { success: true, content: content };

            } catch (error) {
                // Rimuovi messaggio utente in caso di errore
                chatState.messages.pop();
                updateMessagesDisplay();
                updateStatus(`Errore: ${error.message}`, true);
                return { success: false, error: error.message };
            }
        }
    };

    console.log('🔌 ClaudeChat API complete disponibili per VB.NET');
    console.log('📎 v2.5: Upload con formato API standard base64 - Migliorata gestione file');

    // Avvia quando DOM è pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }

})();