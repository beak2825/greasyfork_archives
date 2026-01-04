// ==UserScript==
// @name         Auto-Click "Wyślij natychmiast" (z zapamiętywaniem stanu)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Klikanie w ikonę "Wyślij natychmiast" w statusie błędnie wysłanych wiadomości
// @author       Dawid
// @match        *://premiumtechpanel.sellasist.pl/admin/messages/edit?type=all&created_at_from=&created_at_to=&receiver=&status=error&new_filters=1*
// @grant        none
// @license      Proprietary
// @downloadURL https://update.greasyfork.org/scripts/525061/Auto-Click%20%22Wy%C5%9Blij%20natychmiast%22%20%28z%20zapami%C4%99tywaniem%20stanu%29.user.js
// @updateURL https://update.greasyfork.org/scripts/525061/Auto-Click%20%22Wy%C5%9Blij%20natychmiast%22%20%28z%20zapami%C4%99tywaniem%20stanu%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let clickQueue = [];
    const STORAGE_KEY = 'autoClickerState';

    function saveState(isRunning) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ isRunning }));
    }

    function loadState() {
        const state = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return state ? state.isRunning : false;
    }

    function createControlPanel() {
        if (document.getElementById('auto-clicker-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'auto-clicker-panel';
        panel.style.position = 'fixed';
        panel.style.top = '40px';
        panel.style.right = '0px';
        panel.style.zIndex = '10000';
        panel.style.display = 'flex';
        panel.style.gap = '10px';
        panel.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        panel.style.border = '1px solid #ccc';
        panel.style.padding = '10px';
        panel.style.borderRadius = '8px';
        panel.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';

        // Przycisk Start
        const startButton = document.createElement('button');
        startButton.textContent = 'Start Auto-Clicker';
        startButton.style.cssText = `
            padding: 20px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
        `;
        startButton.addEventListener('click', () => {
            saveState(true);
            console.log('Auto-Clicker włączony');
            processQueue();
        });

        // Przycisk Stop
        const stopButton = document.createElement('button');
        stopButton.textContent = 'Stop Auto-Clicker';
        stopButton.style.cssText = `
            padding: 20px 20px;
            background-color: #f44336;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
        `;
        stopButton.addEventListener('click', () => {
            saveState(false);
            clickQueue = [];
            console.log('Auto-Clicker zatrzymany');
            showPausePopup();
        });

        panel.appendChild(startButton);
        panel.appendChild(stopButton);
        document.body.appendChild(panel);
    }

    function processQueue() {
        if (!loadState()) return;

        const icons = document.querySelectorAll('img[title="Wyślij natychmiast"]:not(.clicked-icon)');
        icons.forEach(icon => {
            if (!clickQueue.includes(icon)) {
                clickQueue.push(icon);
            }
        });

        if (clickQueue.length === 0) {
            console.log('Kolejka jest pusta. Wszystkie wiadomości zostały wysłane.');
            alert('Wszystkie wiadomości zostały wysłane!');
            saveState(false); // Automatyczne zatrzymanie
            return;
        }

        // Kliknij kolejną ikonę w kolejce
        const icon = clickQueue.shift();
        if (icon) {
            icon.click();
            console.log('Kliknięto ikonę "Wyślij natychmiast".');
            icon.classList.add('clicked-icon');
        }

        setTimeout(() => {
            processQueue();
        }, 5000);
    }

    function showPausePopup() {
        const popup = document.createElement('div');
        popup.id = 'pause-popup';
        popup.textContent = 'Wysyłanie wstrzymane';
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.padding = '20px';
        popup.style.backgroundColor = '#f44336';
        popup.style.color = 'white';
        popup.style.borderRadius = '8px';
        popup.style.fontSize = '18px';
        popup.style.zIndex = '10001';
        popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        popup.style.opacity = '0.9';
        popup.style.transition = 'opacity 4s'; // Animacja zanikania
        document.body.appendChild(popup);

        setTimeout(() => {
            popup.style.opacity = '0';
            setTimeout(() => document.body.removeChild(popup), 4000);
        }, 0);
    }

    window.addEventListener('load', () => {
        console.log('Strona załadowana. Inicjalizacja skryptu...');
        createControlPanel();

        if (loadState()) {
            console.log('Wznowiono Auto-Clicker po odświeżeniu.');
            processQueue();
        }
    });
})();
