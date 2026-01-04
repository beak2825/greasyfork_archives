// ==UserScript==
// @name         YouTube Safe Auto-Liker (Ultimate Fix)
// @namespace    http://tampermonkey.net/
// @version      7.1
// @description  BEZPIECZNE auto-lajkowanie z pełną kontrolą i naprawionymi błędami
// @author       You
// @match        https://www.youtube.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @icon         https://www.youtube.com/favicon.ico
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/532554/YouTube%20Safe%20Auto-Liker%20%28Ultimate%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/532554/YouTube%20Safe%20Auto-Liker%20%28Ultimate%20Fix%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. KONFIGURACJA DOMYŚLNA
    const defaults = {
        enabled: true,
        requireSubscription: true,
        requireNoDislike: true,
        goldLike: true,
        delayBeforeCheck: 3000,
        delayBeforeLike: 1500,
        maxAttempts: 7,
        debug: false,
        useAdvancedClick: true,
        showUI: true  // Nowa opcja - czy pokazywać interfejs użytkownika
    };

    // 2. ŁADOWANIE USTAWIEN
    let config = {};
    Object.keys(defaults).forEach(key => {
        config[key] = GM_getValue(key, defaults[key]);
    });

    // 3. NAPRAWIONY PANEL KONFIGURACYJNY
    function showSettings() {
        // Usuń istniejący panel jeśli jest
        removeElementById('ytal-panel');

        // Stylizacja
        GM_addStyle(`
            #ytal-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #282828;
                color: white;
                padding: 20px;
                border-radius: 10px;
                z-index: 99999;
                box-shadow: 0 0 20px rgba(0,0,0,0.5);
                font-family: 'Roboto', Arial, sans-serif;
                width: 380px;
            }
            #ytal-panel .ytal-title {
                font-size: 18px;
                margin-bottom: 20px;
                color: #FF0000;
                text-align: center;
                font-weight: bold;
            }
            #ytal-panel .ytal-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
            }
            #ytal-panel .ytal-label {
                margin-right: 15px;
                font-size: 14px;
            }
            #ytal-panel .ytal-switch {
                position: relative;
                display: inline-block;
                width: 50px;
                height: 24px;
            }
            #ytal-panel .ytal-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #606060;
                transition: .4s;
                border-radius: 24px;
            }
            #ytal-panel .ytal-slider:before {
                position: absolute;
                content: "";
                height: 16px;
                width: 16px;
                left: 4px;
                bottom: 4px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }
            #ytal-panel .ytal-checkbox:checked + .ytal-slider {
                background-color: #FF0000;
            }
            #ytal-panel .ytal-checkbox:checked + .ytal-slider:before {
                transform: translateX(26px);
            }
            #ytal-panel .ytal-input {
                width: 70px;
                padding: 4px;
                border-radius: 4px;
                border: 1px solid #606060;
                background: #404040;
                color: white;
                font-size: 14px;
            }
            #ytal-panel .ytal-buttons {
                display: flex;
                justify-content: space-between;
                margin-top: 20px;
            }
            #ytal-panel .ytal-button {
                background: #FF0000;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 4px;
                cursor: pointer;
                flex: 1;
                margin: 0 5px;
                font-size: 14px;
            }
            #ytal-status {
                position: fixed;
                bottom: 10px;
                right: 70px;
                background: #FF0000;
                color: white;
                padding: 6px 12px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 9998;
                display: flex;
                align-items: center;
                font-family: 'Roboto', Arial, sans-serif;
            }
            #ytal-menu-btn {
                position: fixed;
                bottom: 10px;
                right: 10px;
                z-index: 9999;
                background: #FF0000;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 8px 12px;
                cursor: pointer;
                display: flex;
                align-items: center;
                font-family: 'Roboto', Arial, sans-serif;
                font-size: 14px;
                font-weight: bold;
                box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            }
            #ytal-menu-btn:hover {
                background: #cc0000;
            }
        `);

        // Tworzenie panelu
        const panel = document.createElement('div');
        panel.id = 'ytal-panel';
        panel.innerHTML = `
            <div class="ytal-title">YouTube Safe Auto-Liker</div>
            <div class="ytal-row">
                <span class="ytal-label">Włącz skrypt:</span>
                <label class="ytal-switch">
                    <input type="checkbox" class="ytal-checkbox" id="ytal-enabled" ${config.enabled ? 'checked' : ''}>
                    <span class="ytal-slider"></span>
                </label>
            </div>
            <div class="ytal-row">
                <span class="ytal-label">Pokazuj interfejs:</span>
                <label class="ytal-switch">
                    <input type="checkbox" class="ytal-checkbox" id="ytal-show-ui" ${config.showUI ? 'checked' : ''}>
                    <span class="ytal-slider"></span>
                </label>
            </div>
            <div class="ytal-row">
                <span class="ytal-label">Wymagaj subskrypcji:</span>
                <label class="ytal-switch">
                    <input type="checkbox" class="ytal-checkbox" id="ytal-require-sub" ${config.requireSubscription ? 'checked' : ''}>
                    <span class="ytal-slider"></span>
                </label>
            </div>
            <div class="ytal-row">
                <span class="ytal-label">Blokuj przy dislike:</span>
                <label class="ytal-switch">
                    <input type="checkbox" class="ytal-checkbox" id="ytal-no-dislike" ${config.requireNoDislike ? 'checked' : ''}>
                    <span class="ytal-slider"></span>
                </label>
            </div>
            <div class="ytal-row">
                <span class="ytal-label">Złoty kolor łapki:</span>
                <label class="ytal-switch">
                    <input type="checkbox" class="ytal-checkbox" id="ytal-gold-like" ${config.goldLike ? 'checked' : ''}>
                    <span class="ytal-slider"></span>
                </label>
            </div>
            <div class="ytal-row">
                <span class="ytal-label">Zaawansowane kliknięcie:</span>
                <label class="ytal-switch">
                    <input type="checkbox" class="ytal-checkbox" id="ytal-advanced-click" ${config.useAdvancedClick ? 'checked' : ''}>
                    <span class="ytal-slider"></span>
                </label>
            </div>
            <div class="ytal-row">
                <span class="ytal-label">Opóźnienie sprawdzania (ms):</span>
                <input type="number" id="ytal-delay-check" class="ytal-input" value="${config.delayBeforeCheck}" min="500" max="10000">
            </div>
            <div class="ytal-row">
                <span class="ytal-label">Opóźnienie lajkowania (ms):</span>
                <input type="number" id="ytal-delay-like" class="ytal-input" value="${config.delayBeforeLike}" min="0" max="5000">
            </div>
            <div class="ytal-row">
                <span class="ytal-label">Maks. prób:</span>
                <input type="number" id="ytal-attempts" class="ytal-input" value="${config.maxAttempts}" min="1" max="10">
            </div>
            <div class="ytal-row">
                <span class="ytal-label">Tryb debug:</span>
                <label class="ytal-switch">
                    <input type="checkbox" class="ytal-checkbox" id="ytal-debug" ${config.debug ? 'checked' : ''}>
                    <span class="ytal-slider"></span>
                </label>
            </div>
            <div class="ytal-buttons">
                <button class="ytal-button" id="ytal-save">Zapisz</button>
                <button class="ytal-button" id="ytal-close">Zamknij</button>
            </div>
        `;

        document.body.appendChild(panel);

        // Obsługa przycisków
        document.getElementById('ytal-save').addEventListener('click', saveSettings);
        document.getElementById('ytal-close').addEventListener('click', () => {
            panel.remove();
        });

        function saveSettings() {
            try {
                config.enabled = document.getElementById('ytal-enabled').checked;
                config.showUI = document.getElementById('ytal-show-ui').checked;
                config.requireSubscription = document.getElementById('ytal-require-sub').checked;
                config.requireNoDislike = document.getElementById('ytal-no-dislike').checked;
                config.goldLike = document.getElementById('ytal-gold-like').checked;
                config.useAdvancedClick = document.getElementById('ytal-advanced-click').checked;
                config.delayBeforeCheck = parseInt(document.getElementById('ytal-delay-check').value) || defaults.delayBeforeCheck;
                config.delayBeforeLike = parseInt(document.getElementById('ytal-delay-like').value) || defaults.delayBeforeLike;
                config.maxAttempts = parseInt(document.getElementById('ytal-attempts').value) || defaults.maxAttempts;
                config.debug = document.getElementById('ytal-debug').checked;

                Object.keys(config).forEach(key => {
                    GM_setValue(key, config[key]);
                });

                panel.remove();
                showMessage('Ustawienia zapisane!');
                updateUI();
            } catch (error) {
                console.error('Błąd zapisywania ustawień:', error);
                showMessage('Błąd zapisywania ustawień!', 5000);
            }
        }
    }

    // 4. FUNKCJE POMOCNICZE
    function removeElementById(id) {
        const element = document.getElementById(id);
        if (element) element.remove();
    }

    function showMessage(text, duration = 3000) {
        if (!config.showUI) return;

        removeElementById('ytal-message');

        const msg = document.createElement('div');
        msg.id = 'ytal-message';
        msg.textContent = text;
        msg.style.position = 'fixed';
        msg.style.bottom = '60px';
        msg.style.right = '10px';
        msg.style.background = '#FF0000';
        msg.style.color = 'white';
        msg.style.padding = '8px 16px';
        msg.style.borderRadius = '4px';
        msg.style.zIndex = '99999';
        msg.style.fontFamily = 'Roboto, Arial, sans-serif';
        msg.style.fontSize = '14px';
        document.body.appendChild(msg);

        setTimeout(() => {
            removeElementById('ytal-message');
        }, duration);
    }

    function updateUI() {
        if (config.showUI) {
            updateStatus();
            addMenuButton();
        } else {
            removeElementById('ytal-status');
            removeElementById('ytal-menu-btn');
        }
    }

    function updateStatus() {
        let status = document.getElementById('ytal-status');
        if (!status) {
            status = document.createElement('div');
            status.id = 'ytal-status';
            document.body.appendChild(status);
        }

        status.innerHTML = `
            <span class="ytal-status-icon">${config.enabled ? '✅' : '❌'}</span>
            ${config.enabled ? 'AKTYWNY' : 'NIEAKTYWNY'} |
            ${config.requireSubscription ? 'WYMAGANA SUB' : 'BRAK SUB'} |
            ${config.useAdvancedClick ? 'ZAWA. KLIK' : 'PROSTE KLIK'}
        `;
    }

    function debugLog(...args) {
        if (config.debug) {
            console.log('%c[YT-AutoLike]', 'color: #FF0000; font-weight: bold', ...args);
        }
    }

    // 5. NAPRAWIONE DODAWANIE PRZYCISKU MENU
    function addMenuButton() {
        if (!config.showUI) return;

        removeElementById('ytal-menu-btn');

        const menuBtn = document.createElement('button');
        menuBtn.id = 'ytal-menu-btn';
        menuBtn.innerHTML = '⚙️ Auto-Liker';
        menuBtn.title = 'Kliknij aby otworzyć ustawienia';

        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showSettings();
        });

        document.body.appendChild(menuBtn);
    }

    // 6. ULEPSZONA METODA KLIKNIĘCIA
    function clickLikeButton(attempt = 1) {
        if (attempt > config.maxAttempts) {
            debugLog(`Osiągnięto maks. liczbę prób (${config.maxAttempts})`);
            return false;
        }

        const likeButton = findLikeButton();
        if (!likeButton) {
            debugLog(`Nie znaleziono przycisku like (próba ${attempt})`);
            setTimeout(() => clickLikeButton(attempt + 1), 1000);
            return false;
        }

        if (likeButton.getAttribute('aria-pressed') === 'true') {
            debugLog('Film już polubiony - pomijam');
            return true;
        }

        debugLog(`Znaleziono przycisk like - próba ${attempt}`);

        if (config.useAdvancedClick) {
            advancedClick(likeButton);
        } else {
            simpleClick(likeButton);
        }

        applyGoldLike();
        return true;
    }

    function findLikeButton() {
        const selectors = [
            'like-button-view-model button',
            'ytd-like-button-renderer button',
            '#like-button',
            '#segmented-like-button',
            'ytd-toggle-button-renderer[aria-label*="Lubię"]',
            'ytd-toggle-button-renderer[aria-label*="Like"]',
            'yt-icon-button[aria-label*="Like"]',
            '.like-button-renderer-like-button',
            '.yt-uix-button[aria-label*="Like"]'
        ];

        for (const selector of selectors) {
            try {
                const button = document.querySelector(selector);
                if (button && button.offsetParent !== null) { // Sprawdza czy element jest widoczny
                    return button;
                }
            } catch (e) {
                debugLog('Błąd wyszukiwania przycisku:', e);
            }
        }
        return null;
    }

    function simpleClick(element) {
        try {
            element.click();
            debugLog('Wykonano proste kliknięcie');
        } catch (error) {
            debugLog('Błąd prostego kliknięcia:', error);
        }
    }

    function advancedClick(element) {
        try {
            // 1. Aktywacja elementu
            element.focus();

            // 2. Pobranie współrzędnych
            const rect = element.getBoundingClientRect();
            const clientX = rect.left + rect.width / 2;
            const clientY = rect.top + rect.height / 2;

            // 3. Pełna symulacja interakcji
            const eventTypes = ['mouseover', 'mousedown', 'mouseup', 'click'];

            eventTypes.forEach(eventType => {
                const event = new MouseEvent(eventType, {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: clientX,
                    clientY: clientY,
                    buttons: 1
                });
                element.dispatchEvent(event);
            });

            // 4. Dodatkowe zabezpieczenie
            if (typeof element.click === 'function') {
                element.click();
            }

            debugLog('Wykonano zaawansowane kliknięcie');
        } catch (error) {
            debugLog('Błąd zaawansowanego kliknięcia:', error);
            // Fallback do prostego kliknięcia
            simpleClick(element);
        }
    }

    // 7. FUNKCJE DODATKOWE
    function applyGoldLike() {
        if (!config.goldLike) return;

        const elements = [
            ...document.querySelectorAll('like-button-view-model path, #like-button path'),
            ...document.querySelectorAll('ytd-toggle-button-renderer path, #like-button svg')
        ];

        elements.forEach(element => {
            try {
                if (element.tagName === 'path' && element.getAttribute('fill') !== '#ffd700') {
                    element.style.fill = '#ffd700';
                } else if (element.tagName === 'svg') {
                    const paths = element.querySelectorAll('path');
                    paths.forEach(p => p.style.fill = '#ffd700');
                }
            } catch (error) {
                debugLog('Błąd aplikowania złotego koloru:', error);
            }
        });
    }

    function checkRequirements() {
        if (!config.enabled) {
            debugLog('Skrypt wyłączony - pomijam');
            return false;
        }

        if (config.requireSubscription && !isSubscribed()) {
            debugLog('Nie subskrybujesz kanału - pomijam');
            return false;
        }

        if (config.requireNoDislike && hasDislike()) {
            debugLog('Wykryto dislike - pomijam');
            return false;
        }

        debugLog('Wszystkie wymagania spełnione');
        return true;
    }

    function isSubscribed() {
        const checks = [
            () => document.querySelector('#subscribe-button[subscribed]'),
            () => document.querySelector('button[aria-label^="Subskrybujesz"]'),
            () => document.querySelector('button[aria-label^="Subscribed"]'),
            () => document.querySelector('ytd-subscribe-button-renderer[subscribed]'),
            () => {
                const text = document.querySelector('#subscribe-button')?.textContent;
                return text && (text.includes("Subskrybujesz") || text.includes("Subscribed"));
            }
        ];

        for (const check of checks) {
            try {
                const result = check();
                if (result) return true;
            } catch (e) {
                debugLog('Błąd sprawdzania subskrypcji:', e);
            }
        }

        return false;
    }

    function hasDislike() {
        const selectors = [
            'dislike-button-view-model button[aria-pressed="true"]',
            'ytd-toggle-button-renderer[aria-label*="Nie lubię"][aria-pressed="true"]',
            'ytd-toggle-button-renderer[aria-label*="Dislike"][aria-pressed="true"]'
        ];

        for (const selector of selectors) {
            try {
                if (document.querySelector(selector)) {
                    return true;
                }
            } catch (e) {
                debugLog('Błąd sprawdzania dislike:', e);
            }
        }

        return false;
    }

    // 8. OBSŁUGA STRONY
    function processVideo() {
        if (!window.location.href.includes("/watch")) return;

        // Dodatkowe sprawdzenie czy strona jest gotowa
        if (!document.querySelector('ytd-watch-flexy, #player-container')) {
            debugLog('Strona nie jest w pełni załadowana...');
            setTimeout(processVideo, 1000);
            return;
        }

        debugLog('Rozpoczynanie przetwarzania filmu...');

        setTimeout(() => {
            if (checkRequirements()) {
                clickLikeButton();
            }
        }, config.delayBeforeCheck);
    }

    // 9. INICJALIZACJA
    function init() {
        // Dodaj przycisk menu i status
        updateUI();

        // Obserwuj zmiany w DOM
        const observer = new MutationObserver((mutations) => {
            if (config.showUI && !document.getElementById('ytal-menu-btn')) {
                addMenuButton();
            }

            // Sprawdzaj czy to nowa strona wideo
            const addedNodes = mutations.flatMap(m => Array.from(m.addedNodes));
            if (addedNodes.some(node => node.nodeType === 1 &&
                (node.querySelector('ytd-watch-flexy, #player-container') ||
                 node.matches('ytd-watch-flexy, #player-container')))) {
                processVideo();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });

        // Początkowe uruchomienie
        setTimeout(() => {
            processVideo();
            updateUI();
        }, 2000);

        // Menu Tampermonkey
        GM_registerMenuCommand('Otwórz ustawienia', showSettings);
        GM_registerMenuCommand('Włącz/Wyłącz skrypt', () => {
            config.enabled = !config.enabled;
            GM_setValue('enabled', config.enabled);
            showMessage(`Skrypt ${config.enabled ? 'włączony' : 'wyłączony'}`);
            updateUI();
        });
        GM_registerMenuCommand('Pokazuj/Ukryj interfejs', () => {
            config.showUI = !config.showUI;
            GM_setValue('showUI', config.showUI);
            showMessage(`Interfejs ${config.showUI ? 'widoczny' : 'ukryty'}`);
            updateUI();
        });

        debugLog('Skrypt został zainicjalizowany');
    }

    // Uruchomienie
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1000);
    } else {
        window.addEventListener('DOMContentLoaded', () => setTimeout(init, 1000));
        window.addEventListener('load', () => setTimeout(init, 1000));
    }
})();