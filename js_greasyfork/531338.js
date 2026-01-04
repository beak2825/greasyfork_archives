// ==UserScript==
// @name         Deck assistant
// @namespace    http://tampermonkey.net/
// @version      2.5.4
// @description  copy - export - scanlist - clear
// @author       Laïn
// @match        https://www.dreadcast.eu/Main*
// @match        https://www.dreadcast.net/Main*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531338/Deck%20assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/531338/Deck%20assistant.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const triggerCommandScanlist = "scanlist";
    const commandsToSend = [
        "action Einor", "action Barshabba", "action Neetuhl", "action Crowley",
        "action Gus", "action Skara", "action Achab", "action Shade",
        "action Heaven", "action Jiànyè", "action Sylas", "action Tadzio",
        "action Dex", "action Brahms", "action Sköll", "action Darius",
        "action Velkris", "action Gadblush", "action Rinoca",
        "reactivite Einor", "reactivite Barshabba", "reactivite Neetuhl", "reactivite Crowley",
        "reactivite Gus", "reactivite Skara", "reactivite Achab", "reactivite Shade",
        "reactivite Heaven", "reactivite Jiànyè", "reactivite Sylas", "reactivite Tadzio",
        "reactivite Dex", "reactivite Brahms", "reactivite Sköll", "reactivite Darius",
        "reactivite Velkris", "reactivite Gadblush", "reactivite Rinoca",
    ];
    const minDelayBetweenCommands = 500;
    const maxDelayBetweenCommands = 1750;
    const delayAfterScanlistTrigger = 300;
    const activeInputSelector = '.deck_main .ligne_ecriture input.texte:not([disabled])';
    const formSelector = 'form.deck_main';
    const reactiviteCommandPrefix = "reactivite";

    let listenerAttached = false;
    let isSequenceRunning = false;
    let storedResults = [];

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function showNotification(message, duration = 3000) {
        const notification = document.createElement('div');
        notification.innerText = message;
        Object.assign(notification.style, {
            position: 'fixed', bottom: '25px', left: '50%', transform: 'translateX(-50%)',
            background: '#143e56', color: '#fff', padding: '19px 22px', borderRadius: '5px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)', zIndex: '1000000', opacity: '0',
            transition: 'opacity 0.5s', fontSize: '1.125em'
        });
        document.body.appendChild(notification);
        void notification.offsetWidth;
        notification.style.opacity = '1';
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 500);
        }, duration);
    }

    function parseDuration(text) {
        let hours = 0, minutes = 0, seconds = 0;
        const hoursMatch = text.match(/(\d+)\s*h/);
        if (hoursMatch) hours = parseInt(hoursMatch[1], 10);
        const minutesMatch = text.match(/(\d+)\s*min/);
        if (minutesMatch) minutes = parseInt(minutesMatch[1], 10);
        const secondsMatch = text.match(/(\d+)\s*sec/);
        if (secondsMatch) seconds = parseInt(secondsMatch[1], 10);
        return hours * 3600 + minutes * 60 + seconds;
    }

    function getCommandFromPrevLine(lineEcriteFixed) {
        return lineEcriteFixed?.querySelector('input.texte')?.value.trim().toLowerCase() || "";
    }

    function getLastWordOfCommand(lineEcriteFixed) {
        const inputText = lineEcriteFixed?.querySelector('input.texte')?.value.trim() || "";
        const tokens = inputText.split(/\s+/);
        return tokens[tokens.length - 1] || "";
    }


    async function runAutomatedSequence() {
        if (isSequenceRunning) return;
        isSequenceRunning = true;
        showNotification("Scanlist sequence démarrée.");

        await sleep(delayAfterScanlistTrigger);

        const inputField = document.querySelector(activeInputSelector);
        if (!inputField) {
            showNotification("Erreur: Champ de saisie non trouvé.", 4000);
            isSequenceRunning = false;
            return;
        }

        inputField.focus();
        await sleep(100);

        for (const command of commandsToSend) {
            const currentInputField = document.querySelector(activeInputSelector);
            if (!currentInputField) {
                 showNotification("Erreur: Champ de saisie disparu pendant la séquence.", 4000);
                 break;
            }

            if (currentInputField.value !== '') {
                 currentInputField.value = '';
                 await sleep(50);
            }

            currentInputField.value = command;
            currentInputField.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
            await sleep(50);

            const parentForm = currentInputField.closest(formSelector);
            currentInputField.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true }));
            await sleep(50);
            currentInputField.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true }));
            await sleep(50);

             if (parentForm) {
                 if (typeof parentForm.requestSubmit === 'function') {
                    parentForm.requestSubmit();
                 } else {
                    parentForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                 }
             }

            const randomDelay = getRandomInt(minDelayBetweenCommands, maxDelayBetweenCommands);
            await sleep(randomDelay);
        }

        isSequenceRunning = false;
        showNotification("Scanlist sequence terminée. Utilisez 'export' pour voir les résultats.");
    }

    function processScan() {
        const zoneEcrit = document.querySelector('.deck_main .zone_ecrit');
        if (!zoneEcrit) {
            showNotification("Erreur: Zone d'écriture non trouvée pour l'export.", 4000);
            return;
        }

        const resultLines = zoneEcrit.querySelectorAll('.ligne_resultat_fixed');
        let resultsArray = [];

        resultLines.forEach((resultLine) => {
            const resultText = resultLine.innerText.trim();
            const prevLine = resultLine.previousElementSibling;

            if (prevLine && prevLine.classList.contains('ligne_ecrite_fixed')) {
                const commandText = getCommandFromPrevLine(prevLine);

                if (resultText.includes("depuis")) {
                    const lastWord = getLastWordOfCommand(prevLine);
                    const combined = lastWord + " " + resultText;
                    const duration = parseDuration(resultText);
                    resultsArray.push({ text: combined, duration: duration, type: 'duration' });
                }
                else if (commandText.startsWith(reactiviteCommandPrefix)) {
                    if (resultText.includes("est connecté(e)")) {
                        resultsArray.push({ text: resultText, duration: null, type: 'connected' });
                    } else if (resultText.includes("n'est pas connecté(e)")) {
                        resultsArray.push({ text: resultText, duration: null, type: 'disconnected' });
                    }
                }
            }
        });

        if (resultsArray.length === 0) {
            showDreadcastModal("Résultats du Scan", "Aucun résultat pertinent (durée ou réactivité) détecté dans l'historique.", null);
            return;
        }

        resultsArray.sort((a, b) => {
            const typeOrder = { duration: 1, connected: 2, disconnected: 3 };
            const typeA = typeOrder[a.type] || 99;
            const typeB = typeOrder[b.type] || 99;

            if (typeA !== typeB) {
                return typeA - typeB;
            }

            if (a.type === 'duration') {
                return a.duration - b.duration;
            } else {
                return a.text.localeCompare(b.text);
            }
        });


        storedResults = resultsArray;
        const initialSortedText = resultsArray.map(item => item.text).join("\n");

        showDreadcastModal("Résultats du Scan", initialSortedText, resultsArray);
    }

    function processCopy() {
        const zoneEcrit = document.querySelector('.deck_main .zone_ecrit');
        if (!zoneEcrit) {
            showNotification("Erreur: Zone d'écriture non trouvée pour la copie.", 4000);
            return;
        }

        const allLines = zoneEcrit.children;
        let textAcc = "";

        for (let i = 0; i < allLines.length; i++) {
            const line = allLines[i];

            if (line.classList.contains('ligne_ecrite_fixed')) {
                const nextLine = allLines[i+1];
                if (nextLine && nextLine.classList.contains('ligne_resultat_fixed')) {
                    const commandText = getCommandFromPrevLine(line);
                    const resultText = nextLine.innerText.trim();

                    if (resultText.includes("depuis")) {
                        const lastWord = getLastWordOfCommand(line);
                        const combined = lastWord + " " + resultText;
                        if (combined.trim()) {
                            if (textAcc) textAcc += "\n";
                            textAcc += combined;
                        }
                        i++;
                    }
                    else if (commandText.startsWith(reactiviteCommandPrefix) &&
                             (resultText.includes("est connecté(e)") || resultText.includes("n'est pas connecté(e)"))) {
                        if (resultText) {
                             if (textAcc) textAcc += "\n";
                             textAcc += resultText;
                        }
                        i++;
                    }
                }
            }
        }

        if (textAcc) {
            navigator.clipboard.writeText(textAcc)
                .then(() => {
                    showNotification("Résultats pertinents copiés dans le presse papier.");
                })
                .catch(err => {
                     showNotification("Erreur lors de la copie.", 4000);
                 });
        } else {
            showNotification("Aucun résultat pertinent (durée, réactivité) à copier.", 3000);
        }
    }

    function showDreadcastModal(title, message, resultsArray) {
        const existingModal = document.getElementById('dreadcast-modal');
        if (existingModal) existingModal.remove();

        const overlay = document.createElement('div');
        overlay.id = 'dreadcast-modal';
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: '999999'
        });

        const box = document.createElement('div');
        Object.assign(box.style, {
            backgroundColor: '#1a1a1a', color: '#fff', padding: '20px', borderRadius: '4px',
            minWidth: '320px', maxWidth: '80vw', maxHeight: '80vh', overflowY: 'auto',
            boxShadow: '0 0 15px rgba(0, 0, 0, 0.8)', fontFamily: 'sans-serif', border: '1px solid #555'
        });

        const titleElem = document.createElement('h2');
        titleElem.innerText = title;
        Object.assign(titleElem.style, { marginTop: '0', marginBottom: '10px', color: '#00b4ff' });
        box.appendChild(titleElem);

        const textArea = document.createElement('textarea');
        textArea.value = message;
        textArea.readOnly = false;
        Object.assign(textArea.style, {
            width: 'calc(100% - 10px)',
            minHeight: '200px',
            height: '250px',
            maxHeight: '60vh',
            marginBottom: '10px', resize: 'vertical', boxSizing: 'border-box',
            backgroundColor: '#333', color: '#fff', border: '1px solid #555', padding: '5px',
            fontFamily: 'monospace',
            fontSize: '0.9em'
        });
        box.appendChild(textArea);

        const buttonBar = document.createElement('div');
        Object.assign(buttonBar.style, { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px'});

        const copyAllBtn = document.createElement('button');
        copyAllBtn.innerText = 'Tout copier';
        Object.assign(copyAllBtn.style, { padding: '5px 10px', cursor: 'pointer', backgroundColor: '#444', color: '#fff', border: '1px solid #555', borderRadius: '3px' });
        copyAllBtn.addEventListener('click', () => {
             navigator.clipboard.writeText(textArea.value)
                 .then(() => showNotification('Texte copié!', 2000))
                 .catch(err => {
                     showNotification('Erreur copie', 2000);
                 });
        });
        buttonBar.appendChild(copyAllBtn);

        if (resultsArray && resultsArray.length > 0) {
            const rangerBtn = document.createElement('button');
            rangerBtn.innerText = 'Ranger';
            Object.assign(rangerBtn.style, { padding: '5px 10px', cursor: 'pointer', backgroundColor: '#444', color: '#fff', border: '1px solid #555', borderRadius: '3px' });
            rangerBtn.addEventListener('click', () => {
                const categories = {
                    "- 15m": [],
                    "15m - 30m": [],
                    "30m - 4h": [],
                    "+ 4h": [],
                    "Eveillé": [],
                    "Endormi": []
                };

                storedResults.forEach(item => {
                    if (item.type === 'connected') {
                        categories["Eveillé"].push(item.text);
                    } else if (item.type === 'disconnected') {
                        categories["Endormi"].push(item.text);
                    } else if (item.type === 'duration') {
                        if (item.duration < 15 * 60) categories["- 15m"].push(item.text);
                        else if (item.duration < 30 * 60) categories["15m - 30m"].push(item.text);
                        else if (item.duration < 4 * 3600) categories["30m - 4h"].push(item.text);
                        else categories["+ 4h"].push(item.text);
                    }
                });

                let groupedText = "";
                const order = ["- 15m", "15m - 30m", "30m - 4h", "+ 4h", "Eveillé", "Endormi"];

                order.forEach(catKey => {
                    if (categories[catKey] && categories[catKey].length > 0) {
                        groupedText += `--- ${catKey} ---\n`;
                        groupedText += categories[catKey].sort((a,b) => a.localeCompare(b)).join("\n") + "\n\n";
                    }
                });

                textArea.value = groupedText.trim();
            });
            buttonBar.appendChild(rangerBtn);
        }

        const closeBtn = document.createElement('button');
        closeBtn.innerText = 'Fermer';
        Object.assign(closeBtn.style, { padding: '5px 10px', cursor: 'pointer', backgroundColor: '#444', color: '#fff', border: '1px solid #555', borderRadius: '3px' });
        closeBtn.addEventListener('click', () => { overlay.remove(); });
        buttonBar.appendChild(closeBtn);

        box.appendChild(buttonBar);
        overlay.appendChild(box);
        document.body.appendChild(overlay);

         overlay.addEventListener('click', (event) => {
             if (event.target === overlay) {
                 overlay.remove();
             }
         });
    }

    function processClear() {
        const zoneEcrit = document.querySelector('.deck_main .zone_ecrit');
        if (!zoneEcrit) {
            showNotification("Erreur: Zone d'écriture non trouvée pour effacer.", 4000);
            return;
        }

        const historyLines = zoneEcrit.querySelectorAll('.ligne_ecrite_fixed, .ligne_resultat_fixed');

        if (historyLines.length === 0) {
            showNotification("Historique déjà vide.", 3000);
            return;
        }

        historyLines.forEach(line => line.remove());

        showNotification("Historique effacé.", 3000);
         storedResults = [];
    }


    function handleUserInput(e) {
        if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey) {
            const inputField = e.target;
            const command = inputField.value.trim().toLowerCase();

            switch(command) {
                case "copy":
                    e.preventDefault();
                    processCopy();
                    inputField.value = "";
                    break;

                case "export":
                    e.preventDefault();
                    processScan();
                    inputField.value = "";
                    break;

                case triggerCommandScanlist:
                     if (!isSequenceRunning) {
                         e.preventDefault();
                         inputField.value = "";
                         setTimeout(runAutomatedSequence, 50);
                     } else {
                        e.preventDefault();
                        showNotification("Séquence scanlist déjà en cours.", 3000);
                     }
                    break;

                case "clear":
                    e.preventDefault();
                    processClear();
                    inputField.value = "";
                    break;

                default:
                    break;
            }
        }
    }

    function attachCommandListener() {
        if (listenerAttached) return;
        const input = document.querySelector(activeInputSelector);
        if (input) {
            input.addEventListener("keydown", handleUserInput);
            listenerAttached = true;
        }
    }

    function detachCommandListener() {
        const input = document.querySelector(activeInputSelector);
        if (input && listenerAttached) {
            input.removeEventListener("keydown", handleUserInput);
            listenerAttached = false;
        }
    }

    const observerTargetNode = document.body;
    const observerConfig = { childList: true, subtree: true };

    const deckObserver = new MutationObserver((mutationsList, observer) => {
        if (!listenerAttached && document.querySelector(activeInputSelector)) {
            attachCommandListener();
        }
        else if (listenerAttached && !document.querySelector(activeInputSelector)) {
             detachCommandListener();
        }
    });

    deckObserver.observe(observerTargetNode, observerConfig);

    setTimeout(attachCommandListener, 500);

})();