// ==UserScript==
// @name         Auto Scavenger with optimizer
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Script Auto Scavenging for Tribal Wars single village.
// @author       MrNobody97
// @match        *://*/*game.php?*screen=place&mode=scavenge
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523404/Auto%20Scavenger%20with%20optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/523404/Auto%20Scavenger%20with%20optimizer.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // Costanti per lo stato
    const STATE_START = 'start';
    const STATE_STOP = 'stop';

    // Variabile per il timer
    let timerInterval = null;

    // Attendi che la pagina sia completamente caricata
    window.addEventListener('load', function () {
        console.log('Pagina completamente caricata, aggiungo la UI...');
        addUI(); // Aggiungi la UI dopo il caricamento della pagina
        restoreState(); // Ripristina lo stato salvato
    });

    // Configura jQuery per caricare script
    $.ajaxSetup({ dataType: 'script' });

    // Carica lo script esterno
    $.getScript('https://cdn.jsdelivr.net/gh/MrNobody97/wewe@main/outstanding_organizer.js')
        .done(function () {
            console.log('Script outstanding_organizer.js caricato con successo!');
        })
        .fail(function (jqxhr, settings, exception) {
            console.error('Errore durante il caricamento dello script:', exception);
        });

    // Funzione per aggiungere la UI
    function addUI() {
        // Crea un contenitore per la UI
        const uiContainer = document.createElement('div');
        uiContainer.id = 'scavengeUI'; // Usa l'ID specificato

        // Applica lo stile personalizzato (ripristinato alla posizione originale)
        uiContainer.style.position = 'fixed';
        uiContainer.style.left = '8%'; // Posizione originale
        uiContainer.style.top = '50%'; // Posizione originale
        uiContainer.style.transform = 'translateY(-50%)'; // Centrato verticalmente
        uiContainer.style.backgroundColor = 'rgba(245, 245, 245, 0.95)'; // Sfondo chiaro
        uiContainer.style.border = '1px solid #967444'; // Bordo marrone
        uiContainer.style.borderRadius = '4px'; // Bordi arrotondati
        uiContainer.style.padding = '8px'; // Spazio interno
        uiContainer.style.zIndex = '9999';
        uiContainer.style.width = '140px'; // Larghezza originale
        uiContainer.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'; // Ombra leggera
        uiContainer.style.fontFamily = 'Arial, sans-serif'; // Font originale
        uiContainer.style.fontSize = '14px'; // Dimensione del font originale
        uiContainer.style.color = '#333'; // Testo scuro

        // Crea un pulsante "Start"
        const startButton = document.createElement('button');
        startButton.id = 'startButton';
        startButton.innerText = 'Start';
        startButton.style.width = '100%';
        startButton.style.padding = '5px'; // Spazio interno
        startButton.style.marginBottom = '10px'; // Margine inferiore
        startButton.style.cursor = 'pointer';
        startButton.style.backgroundColor = '#4CAF50'; // Verde
        startButton.style.color = '#fff'; // Testo bianco
        startButton.style.border = 'none';
        startButton.style.borderRadius = '4px'; // Bordi arrotondati
        startButton.onclick = function () {
            console.log('Pulsante Start cliccato, avvio il timer...');
            startAutomation();
        };

        // Crea un pulsante "Stop"
        const stopButton = document.createElement('button');
        stopButton.id = 'stopButton';
        stopButton.innerText = 'Stop';
        stopButton.style.width = '100%';
        stopButton.style.padding = '5px'; // Spazio interno
        stopButton.style.marginBottom = '10px'; // Margine inferiore
        stopButton.style.cursor = 'pointer';
        stopButton.style.backgroundColor = '#f44336'; // Rosso
        stopButton.style.color = '#fff'; // Testo bianco
        stopButton.style.border = 'none';
        stopButton.style.borderRadius = '4px'; // Bordi arrotondati
        stopButton.onclick = function () {
            console.log('Pulsante Stop cliccato, interrompo il timer...');
            stopAutomation();
        };

        // Crea un elemento per visualizzare il timer di avvio
        const timerElement = document.createElement('div');
        timerElement.id = 'timer';
        timerElement.innerText = 'Avvio tra: 10 secondi';
        timerElement.style.marginBottom = '10px'; // Margine inferiore
        timerElement.style.fontWeight = 'bold';
        timerElement.style.textAlign = 'center'; // Allineamento al centro

        // Crea un elemento per visualizzare l'orario del prossimo refresh
        const refreshTimeElement = document.createElement('div');
        refreshTimeElement.id = 'refresh-time';
        refreshTimeElement.innerText = 'Prossimo refresh: calcolo...';
        refreshTimeElement.style.fontWeight = 'bold';
        refreshTimeElement.style.textAlign = 'center'; // Allineamento al centro

        // Aggiungi gli elementi al contenitore
        uiContainer.appendChild(startButton);
        uiContainer.appendChild(stopButton);
        uiContainer.appendChild(timerElement);
        uiContainer.appendChild(refreshTimeElement);

        // Aggiungi il contenitore al corpo della pagina
        document.body.appendChild(uiContainer);
        console.log('UI aggiunta con successo!');
    }

    // Funzione per ripristinare lo stato salvato
    function restoreState() {
        const savedState = localStorage.getItem('scavengeState');
        if (savedState === STATE_START) {
            console.log('Ripristino lo stato: Start');
            toggleButtons(true); // Mostra "Stop" e nascondi "Start"
            startAutomationAfterDelay(); // Avvia il timer
        } else {
            console.log('Ripristino lo stato: Stop');
            toggleButtons(false); // Mostra "Start" e nascondi "Stop"
        }
    }

    // Funzione per alternare la visibilità dei pulsanti
    function toggleButtons(isStart) {
        const startButton = document.getElementById('startButton');
        const stopButton = document.getElementById('stopButton');
        if (isStart) {
            startButton.style.display = 'none'; // Nascondi "Start"
            stopButton.style.display = 'block'; // Mostra "Stop"
        } else {
            startButton.style.display = 'block'; // Mostra "Start"
            stopButton.style.display = 'none'; // Nascondi "Stop"
        }
    }

    // Funzione per avviare l'automazione
    function startAutomation() {
        // Salva lo stato "Start" nel localStorage
        localStorage.setItem('scavengeState', STATE_START);

        // Mostra "Stop" e nascondi "Start"
        toggleButtons(true);

        // Avvia il timer
        startAutomationAfterDelay();
    }

    // Funzione per interrompere l'automazione
    function stopAutomation() {
        // Salva lo stato "Stop" nel localStorage
        localStorage.setItem('scavengeState', STATE_STOP);

        // Mostra "Start" e nascondi "Stop"
        toggleButtons(false);

        // Interrompi il timer
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }

        // Resetta il timer nella UI
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.innerText = 'Avvio tra: 10 secondi';
        }
    }

    // Funzione per avviare l'automazione dopo un ritardo
    function startAutomationAfterDelay() {
        const delay = 10000; // Ritardo di 10 secondi (puoi modificare questo valore)
        let timeLeft = delay / 1000; // Tempo rimanente in secondi

        // Aggiorna il timer ogni secondo
        timerInterval = setInterval(() => {
            timeLeft -= 1;
            const timerElement = document.getElementById('timer');
            if (timerElement) {
                timerElement.innerText = `Avvio tra: ${timeLeft} secondi`;
            }

            // Se il tempo è scaduto, avvia l'automazione e ferma il timer
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                automateScavenging();
            }
        }, 1000);
    }

    // Funzione principale per automatizzare le azioni
    async function automateScavenging() {
        console.log("Avvio automazione...");

        // 1. Clicca su "All troops"
        if (await clickButtonWithRetry("All troops", 3)) {
            console.log("Cliccato su 'All troops'");
            await wait(5000); // Attendi 5 secondi (invece di 3)
        } else {
            console.error("Pulsante 'All troops' non trovato dopo 3 tentativi!");
            return;
        }

        // 2. Clicca su "Distribute"
        if (await clickButtonWithRetry("Distribute", 3)) {
            console.log("Cliccato su 'Distribute'");
            await wait(5000); // Attendi 5 secondi (invece di 3)
        } else {
            console.error("Pulsante 'Distribute' non trovato dopo 3 tentativi!");
            return;
        }

        // 3. Clicca sui pulsanti "Fill" per i livelli attivi
        await clickFillButtons(); // Attendiamo il completamento della funzione
        await wait(5000); // Attendi 5 secondi (invece di 3)

        console.log("Automazione completata!");

        // Programma il refresh della pagina dopo un intervallo casuale tra 8 e 12 minuti
        schedulePageRefresh();
    }

    // Funzione per cliccare un pulsante con tentativi ripetuti
    async function clickButtonWithRetry(buttonText, maxRetries) {
        for (let i = 0; i < maxRetries; i++) {
            if (clickButton(buttonText)) {
                return true; // Pulsante trovato e cliccato
            }
            console.log(`Tentativo ${i + 1} fallito per il pulsante: ${buttonText}`);
            await wait(4000); // Attendi 4 secondi (invece di 2)
        }
        return false; // Pulsante non trovato dopo i tentativi
    }

    // Funzione per cliccare un pulsante in base al testo
    function clickButton(buttonText) {
        const buttons = document.querySelectorAll("button, a");
        for (const button of buttons) {
            if (button.innerText.trim() === buttonText && !button.disabled) {
                console.log(`Trovato pulsante: ${buttonText}`);
                button.click();
                return true; // Pulsante trovato e cliccato
            }
        }
        console.error(`Pulsante non trovato: ${buttonText}`);
        return false; // Pulsante non trovato
    }

    // Funzione per cliccare sui pulsanti "Fill" e procedere con lo "Start" dopo 4 secondi
    async function clickFillButtons() {
        console.log("Clicco sui pulsanti 'Fill'...");

        const fillButtons = document.querySelectorAll("button.btn[title='Fill']:not(.btn-disabled)");
        if (fillButtons.length === 0) {
            console.error("Nessun pulsante 'Fill' attivo trovato!");
            return;
        }

        for (let i = 0; i < fillButtons.length; i++) {
            const button = fillButtons[i];
            console.log(`Tentativo di clic su: ${button.innerText.trim()} (indice ${i})`);
            try {
                button.click(); // Simula il clic sul pulsante
                console.log(`Cliccato su: ${button.innerText.trim()} (indice ${i})`);

                // Attendi 4 secondi dopo il "Fill" (invece di 2)
                await wait(4000);

                // Procedi con lo "Start" del livello
                await clickStartButtons();
            } catch (error) {
                console.error(`Errore durante il clic su ${button.innerText.trim()}:`, error);
            }
        }
    }

    // Funzione per attendere un determinato tempo
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Funzione per cliccare sui pulsanti "Inizia" e attendere il completamento
    async function clickStartButtons() {
        console.log("Clicco sui pulsanti 'Inizia'...");

        const levels = [
            { level: 1, title: "Razziatore svogliato", selector: "a.free_send_button:not([disabled])" },
            { level: 2, title: "Trasportatori Umili", selector: "a.free_send_button:not([disabled])" },
            { level: 3, title: "Rovistamento astuto", selector: "a.free_send_button:not([disabled])" },
            { level: 4, title: "Ottimi Raccoglitori", selector: "a.free_send_button:not([disabled])" }
        ];

        for (const level of levels) {
            const levelContainer = findLevelContainer(level.title);
            if (levelContainer) {
                console.log(`Trovato contenitore per il livello: ${level.title}`);
                const startButton = levelContainer.querySelector(level.selector);
                if (startButton) {
                    console.log(`Tentativo di clic su: ${level.title} (Livello ${level.level})`);
                    try {
                        startButton.click(); // Simula il clic sul pulsante
                        console.log(`Cliccato su: ${level.title} (Livello ${level.level})`);

                        // Attendi che l'operazione di "Start" sia completata
                        await waitForStartCompletion();
                    } catch (error) {
                        console.error(`Errore durante il clic su ${level.title}:`, error);
                    }
                } else {
                    console.error(`Pulsante "Inizia" non trovato o disabilitato per il livello: ${level.title}`);
                }
            } else {
                console.error(`Contenitore del livello non trovato: ${level.title}`);
            }
        }
    }

// Funzione per attendere il completamento dello "Start"
async function waitForStartCompletion() {
    console.log("Attendo il completamento dello 'Start'...");

    const maxWaitTime = 5000; // Tempo massimo di attesa: 5 secondi
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
        const confirmationMessage = document.querySelector(".confirmation-message");
        if (confirmationMessage && confirmationMessage.innerText.includes("Missione avviata")) {
            console.log("Operazione di 'Start' completata!");
            return;
        }
        await wait(500); // Controlla ogni 500 millisecondi
    }

    console.log("Timeout: procedo senza conferma dello 'Start'.");
}

    // Funzione per trovare il contenitore di un livello in base al titolo
    function findLevelContainer(levelTitle) {
        const titles = document.querySelectorAll("div.title");
        for (const title of titles) {
            if (title.innerText.trim() === levelTitle) {
                return title.closest("div.scavenge-option"); // Restituisce il contenitore del livello
            }
        }
        return null; // Livello non trovato
    }

    // Funzione per programmare il refresh della pagina
    function schedulePageRefresh() {
        const randomTime = Math.floor(Math.random() * (12 - 8 + 1) + 8) * 60000; // Tempo casuale tra 8 e 12 minuti
        const refreshTime = new Date(Date.now() + randomTime);

        // Aggiorna l'UI con l'orario del prossimo refresh
        const refreshTimeElement = document.getElementById('refresh-time');
        if (refreshTimeElement) {
            refreshTimeElement.innerText = `Prossimo refresh: ${refreshTime.toLocaleTimeString()}`;
        }

        console.log(`Riavvio della pagina alle ${refreshTime.toLocaleTimeString()}...`);
        setTimeout(() => {
            window.location.reload();
        }, randomTime);
    }
})();