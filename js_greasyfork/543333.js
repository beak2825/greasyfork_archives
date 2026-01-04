// ==UserScript==
// @name         Claude Internal Chat API
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  API interna di Claude con form chat - Versione semplificata
// @author       Flejta
// @license      MIT
// @match        https://claude.ai/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/543333/Claude%20Internal%20Chat%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/543333/Claude%20Internal%20Chat%20API.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('💬 Claude Internal Chat API avviato');

    // Configurazione
    const CONFIG = {
        maxTokens: 2000,
        model: 'claude-3-5-sonnet-20241022',
        rateLimit: {
            requests: 3,
            windowMs: 60000 // 1 minuto
        }
    };

    // Stato della chat
    let chatState = {
        messages: [],
        isLoading: false,
        organizationId: null,
        lastRequestTime: [],
        chatVisible: false
    };

    // Funzione per validare gli ID
    function isValidUUID(id) {
        const uuidRegex = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
        return id && uuidRegex.test(id);
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

    // Intercetta fetch per catturare Organization ID
    function interceptFetch() {
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const [url, options] = args;
            
            if (typeof url === 'string') {
                const orgMatch = url.match(/\/organizations\/([a-f0-9-]+)/);
                if (orgMatch && isValidUUID(orgMatch[1]) && !chatState.organizationId) {
                    chatState.organizationId = orgMatch[1];
                    console.log('✅ Org ID intercettato:', orgMatch[1]);
                    updateStatus('Chat pronta!');
                }
            }
            
            return originalFetch.apply(this, args);
        };
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
            <h3 style="margin: 0; color: #60a5fa; font-size: 16px;">💬 Claude Chat</h3>
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
            <div style="display: flex; gap: 10px;">
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
                <button id="send-btn" style="
                    background: #3b82f6;
                    color: white;
                    border: none;
                    padding: 0 15px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                ">Invia</button>
            </div>
            <div id="chat-status" style="margin-top: 8px; font-size: 12px; color: #666;"></div>
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

    // Invia messaggio
    async function sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message || chatState.isLoading) return;
        
        // Controlla Organization ID
        if (!chatState.organizationId) {
            updateStatus('Errore: Organization ID non trovato. Ricarica la pagina.', true);
            return;
        }
        
        // Aggiungi messaggio utente
        chatState.messages.push({ role: 'user', content: message });
        updateMessagesDisplay();
        
        // Pulisci input
        input.value = '';
        input.disabled = true;
        document.getElementById('send-btn').disabled = true;
        chatState.isLoading = true;
        updateStatus('Claude sta pensando...');
        
        try {
            // Chiama API
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
            const content = data.content?.[0]?.text || 'Risposta vuota';
            
            // Aggiungi risposta
            chatState.messages.push({ role: 'assistant', content: content });
            updateMessagesDisplay();
            updateStatus('');
            
        } catch (error) {
            console.error('Errore:', error);
            updateStatus(`Errore: ${error.message}`, true);
            chatState.messages.pop(); // Rimuovi messaggio utente
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
        
        // Get Organization ID
        getOrgId: function() {
            return chatState.organizationId;
        },
        
        // Set Organization ID manualmente
        setOrgId: function(orgId) {
            if (isValidUUID(orgId)) {
                chatState.organizationId = orgId;
                updateStatus('Organization ID impostato manualmente');
                return { success: true };
            }
            return { success: false, error: 'Organization ID non valido' };
        }
    };
    
    console.log('🔌 ClaudeChat API disponibile');

    // Avvia quando DOM è pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }

})();