// ==UserScript==
// @name         Copilot Token Observer
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Intercetta WebSocket per catturare il token di Copilot
// @author       Flejta & Claude
// @match        https://copilot.microsoft.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545604/Copilot%20Token%20Observer.user.js
// @updateURL https://update.greasyfork.org/scripts/545604/Copilot%20Token%20Observer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[Copilot Observer v5.0] Intercettazione WebSocket attivata');

    // Intercetta WebSocket IMMEDIATAMENTE
    const originalWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
        console.log('[Observer] 🔌 WebSocket intercettato:', url);
        
        // Estrai il token dall'URL
        if (url && url.includes('accessToken=')) {
            const match = url.match(/accessToken=([^&]+)/);
            if (match) {
                const token = decodeURIComponent(match[1]);
                window.copilotObserver.token = token;
                window.copilotObserver.wsUrl = url;
                console.log('[Observer] ✅ TOKEN CATTURATO!');
                console.log('[Observer] Token (primi 50 char):', token.substring(0, 50) + '...');
                
                // Salva anche altri parametri utili
                if (url.includes('conversationId=')) {
                    const convMatch = url.match(/conversationId=([^&]+)/);
                    if (convMatch) {
                        window.copilotObserver.conversationId = convMatch[1];
                        console.log('[Observer] Conversation ID:', convMatch[1]);
                    }
                }
            }
        }
        
        // Intercetta anche i messaggi del WebSocket
        const ws = new originalWebSocket(url, protocols);
        
        // Intercetta invio messaggi
        const originalSend = ws.send;
        ws.send = function(data) {
            try {
                const parsed = JSON.parse(data);
                console.log('[Observer] 📤 Messaggio inviato:', parsed.event, parsed);
                
                // Se è un challengeResponse, cattura il token Clarity
                if (parsed.event === 'challengeResponse') {
                    window.copilotObserver.clarityToken = parsed.token;
                    console.log('[Observer] Token Clarity catturato');
                }
            } catch (e) {
                // Non è JSON, ignora
            }
            return originalSend.call(this, data);
        };
        
        // Intercetta ricezione messaggi
        ws.addEventListener('message', function(event) {
            try {
                const parsed = JSON.parse(event.data);
                console.log('[Observer] 📥 Messaggio ricevuto:', parsed.event);
                
                // Cattura il requestId quando si connette
                if (parsed.event === 'connected' && parsed.requestId) {
                    window.copilotObserver.requestId = parsed.requestId;
                    console.log('[Observer] Request ID:', parsed.requestId);
                }
            } catch (e) {
                // Non è JSON, ignora
            }
        });
        
        return ws;
    };

    // Oggetto globale per accedere ai dati catturati
    window.copilotObserver = {
        token: null,
        wsUrl: null,
        conversationId: null,
        requestId: null,
        clarityToken: null,
        
        // Metodo per testare l'invio di un messaggio
        async testMessage(text = "Ciao, questo è un test!") {
            if (!this.token || !this.wsUrl) {
                console.error('[Observer] ❌ Token o URL non disponibili. Attendi che venga creata una connessione.');
                return;
            }
            
            console.log('[Observer] 🧪 Test invio messaggio...');
            console.log('[Observer] Usa la console per creare una connessione WebSocket con:');
            console.log(`
const ws = new WebSocket('${this.wsUrl}');
ws.onopen = () => {
    console.log('Connesso!');
    // Invia challenge response se necessario
    ws.send(JSON.stringify({
        event: 'challengeResponse',
        token: '${this.clarityToken || "CLARITY_TOKEN_QUI"}',
        method: 'clarity'
    }));
};
ws.onmessage = (e) => console.log('Ricevuto:', JSON.parse(e.data));

// Dopo il connected, invia il messaggio:
ws.send(JSON.stringify({
    event: 'send',
    conversationId: '${this.conversationId || "CONVERSATION_ID"}',
    content: [{type: 'text', text: '${text}'}],
    mode: 'chat'
}));
            `);
        },
        
        // Mostra tutti i dati catturati
        showData() {
            console.log('═══════════════════════════════════════');
            console.log('📊 DATI CATTURATI:');
            console.log('Token:', this.token ? '✅ ' + this.token.substring(0, 50) + '...' : '❌ Non catturato');
            console.log('URL WebSocket:', this.wsUrl ? '✅ Disponibile' : '❌ Non catturato');
            console.log('Conversation ID:', this.conversationId || '❌ Non catturato');
            console.log('Request ID:', this.requestId || '❌ Non catturato');
            console.log('Clarity Token:', this.clarityToken ? '✅ Catturato' : '❌ Non catturato');
            console.log('═══════════════════════════════════════');
        }
    };

    // Controlla storage all'avvio (metodo di backup)
    setTimeout(() => {
        console.log('[Observer] Controllo storage di backup...');
        for (let key in localStorage) {
            if (localStorage[key].includes('eyJ')) {
                console.log('[Observer] Possibile token in localStorage:', key.substring(0, 50) + '...');
            }
        }
    }, 3000);

    // Istruzioni
    console.log(`
╔═══════════════════════════════════════════════╗
║        COPILOT OBSERVER v5.0 (WebSocket)      ║
╠═══════════════════════════════════════════════╣
║ Intercetta automaticamente il WebSocket       ║
║                                               ║
║ Comandi disponibili:                          ║
║ ▶ window.copilotObserver.showData()          ║
║ ▶ window.copilotObserver.testMessage()       ║
║ ▶ window.copilotObserver.token               ║
║                                               ║
║ Apri una chat su Copilot e il token verrà    ║
║ catturato automaticamente!                    ║
╚═══════════════════════════════════════════════╝
    `);

})();