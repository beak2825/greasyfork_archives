// ==UserScript==
// @name ChatVisionZ Spam Bot
// @namespace http://tampermonkey.net/
// @version 1.0
// @description Spamma quello che vuoi su ChatVisionZ.com
// @author Mr-Zanzibar
// @match *://chatvisionz.com/*
// @license MIT
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/498908/ChatVisionZ%20Spam%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/498908/ChatVisionZ%20Spam%20Bot.meta.js
// ==/UserScript==

let messageCount = 0;
const messages = ['INSERISCI-IL-MESAGGIO-QUI', 'INSERISCI-IL-MESAGGIO-QUI']; // messaggi da inviare (non lo avevi capito?)

async function spam() {
    try {
        const chatInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('send');
        const nextButton = document.getElementById('next');

        if (!chatInput || !sendButton || !nextButton) {
            console.error("Impossibile trovare gli elementi della chat.");
            console.log('%Reporta questo errore nella pagina ufficiale di Github: https://github.com/Mr-Zanzibar/ChatVisionZ-SpamBot', 'color: magenta; font-weight: bold;');
        }

        if (messageCount < messages.length) { // Controlla se sono stati inviati entrambi i messaggi
            chatInput.value = messages[messageCount];
            sendButton.click();
            console.log('%cMessaggio inviato: ' + messages[messageCount], 'color: green; font-weight: bold;');
            messageCount++;
        } else {
            nextButton.click();
            messageCount = 0; // Resetta per ricominciare
            console.log('%cProssima Chat', 'color: blue;');
        }
    } catch (error) {
        console.error("Errore durante lo spam:", error);
        setTimeout(spam, 2000); // Riprova dopo 2 secondi in caso di errore
    }
}

// Intervallo di 3 secondi
const spamInterval = setInterval(spam, 3000); 
