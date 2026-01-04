// ==UserScript==
// @name YouTube Video Hider with 🚫 Icon and Shorts Toggle
// @name:de YouTube Video Ausblender mit 🚫 Symbol und Shorts Umschalter
// @name:es Ocultador de Videos de YouTube con Icono 🚫 y Alternador de Shorts
// @name:fr Masqueur de Vidéos YouTube avec Icône 🚫 et Basculeur de Shorts
// @name:it Nascondi Video YouTube con Icona 🚫 e Interruttore Shorts
// @namespace http://tampermonkey.net/
// @version 2025.9.26
// @description Adds a 🚫 symbol to video metadata for hiding videos, excludes Shorts thumbnails, with persistent Shorts toggle state
// @description:de Fügt ein 🚫 Symbol zu Video-Metadaten hinzu, exklusive Shorts, und einen kompakten Button zum Ein-/Ausblenden von Shorts mit persistentem Zustand
// @description:es Agrega un símbolo 🚫 a los metadatos de video, excluyendo Shorts, y un botón compacto para alternar Shorts con estado persistente
// @description:fr Ajoute un symbole 🚫 aux métadonnées des vidéos, sauf pour les Shorts, et un bouton compact pour activer/désactiver les Shorts avec état persistant
// @description:it Aggiunge un simbolo 🚫 ai metadati dei video, esclusi i Shorts, e un pulsante compatto per attivare/disattivare i Shorts con stato persistente
// @icon https://youtube.com/favicon.ico
// @author Copiis
// @license MIT
// @match https://www.youtube.com/*
// @grant GM_setValue
// @grant GM_getValue
// If you find this script useful and would like to support my work, consider making a small donation!
// Bitcoin (BTC): bc1quc5mkudlwwkktzhvzw5u2nruxyepef957p68r7
// PayPal: https://www.paypal.com/paypalme/Coopiis?country.x=DE&locale.x=de_DE
// @downloadURL https://update.greasyfork.org/scripts/535329/YouTube%20Video%20Hider%20with%20%F0%9F%9A%AB%20Icon%20and%20Shorts%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/535329/YouTube%20Video%20Hider%20with%20%F0%9F%9A%AB%20Icon%20and%20Shorts%20Toggle.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Konfigurationsobjekt
    const config = {
        hideButtonSize: '24px',
        hideButtonOpacity: '0.7',
        shortsCheckInterval: 2000, // Erhöht auf 2000ms
        maxShortsAttempts: 30, // Erhöht auf 30 Versuche
        debugMode: true,
        reapplyInterval: 1000,
        menuLoadDelay: 150,
        maxMenuAttempts: 15
    };

    // Spracherkennung
    const userLang = (navigator.language || navigator.languages[0] || 'en').substring(0, 2);
    if (config.debugMode) console.log(`[Initializer] Erkannte Sprache: ${userLang}`);

    // Übersetzungen
    const translations = {
        en: {
            hideVideosFound: 'Found videos: ${count}',
            hideButtonAdded: 'Video ${index}: Button added',
            hideNoMenuButton: 'Video ${index}: No menu button found',
            hideMenuOpened: 'Video ${index}: Menu opened',
            hideOptionClicked: 'Video ${index}: Hide option clicked',
            hideOptionNotFound: 'Video ${index}: Hide option not found',
            hideError: 'Video ${index}: Error while hiding: ${error}',
            hideConfirmClicked: 'Video ${index}: Confirm button clicked',
            hideConfirmNotFound: 'Video ${index}: Confirm button not found',
            shortsNoTopbar: 'Topbar or YouTube logo not found',
            shortsButtonExists: 'Toggle button already exists, skipping',
            shortsButtonAdded: 'Toggle button added to topbar',
            shortsNotFound: 'Shorts section not found',
            shortsFound: 'Shorts section found: ${details}',
            shortsSectionHidden: 'Shorts section: hidden',
            shortsSectionShown: 'Shorts section: shown',
            shortsButtonText: 'Shorts',
            initStarted: 'Script initialized',
            initAttempt: 'Attempt ${current} of ${max} for Shorts section',
            initMaxAttempts: 'Maximum attempts reached, no Shorts section found',
            initError: 'Error during initialization: ${error}',
            observerError: 'Error in MutationObserver: ${error}',
            noMetadataFound: 'Video ${index}: No metadata container found'
        },
        de: {
            hideVideosFound: 'Gefundene Videos: ${count}',
            hideButtonAdded: 'Video ${index}: Button hinzugefügt',
            hideNoMenuButton: 'Video ${index}: Kein Menü-Button gefunden',
            hideMenuOpened: 'Video ${index}: Menü geöffnet',
            hideOptionClicked: 'Video ${index}: Ausblenden geklickt',
            hideOptionNotFound: 'Video ${index}: Ausblenden-Option nicht gefunden',
            hideError: 'Video ${index}: Fehler beim Ausblenden: ${error}',
            hideConfirmClicked: 'Video ${index}: Bestätigen-Button geklickt',
            hideConfirmNotFound: 'Video ${index}: Bestätigen-Button nicht gefunden',
            shortsNoTopbar: 'Obere Leiste oder YouTube-Logo nicht gefunden',
            shortsButtonExists: 'Toggle-Button bereits vorhanden, überspringe',
            shortsButtonAdded: 'Toggle-Button in oberer Leiste hinzugefügt',
            shortsNotFound: 'Shorts-Abschnitt nicht gefunden',
            shortsFound: 'Shorts-Abschnitt gefunden: ${details}',
            shortsSectionHidden: 'Shorts-Abschnitt: ausgeblendet',
            shortsSectionShown: 'Shorts-Abschnitt: eingeblendet',
            shortsButtonText: 'Shorts',
            initStarted: 'Skript initialisiert',
            initAttempt: 'Versuch ${current} von ${max} für Shorts-Abschnitt',
            initMaxAttempts: 'Maximale Versuche erreicht, kein Shorts-Abschnitt gefunden',
            initError: 'Fehler bei der Initialisierung: ${error}',
            observerError: 'Fehler im MutationObserver: ${error}',
            noMetadataFound: 'Video ${index}: Kein Metadaten-Container gefunden'
        }
    };

    const t = translations[userLang] || translations.en;

    // Funktion zum Formatieren von Übersetzungen
    function formatTranslation(key, params = {}) {
        let str = t[key] || translations.en[key] || key;
        Object.keys(params).forEach(param => {
            str = str.replace(`\${${param}}`, params[param]);
        });
        return str;
    }

    // Funktion zum Warten auf ein Element
    async function waitForElement(selector, timeout = 3000, maxAttempts = 5) {
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            const start = Date.now();
            while (Date.now() - start < timeout) {
                const element = document.querySelector(selector);
                if (element) return element;
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            if (config.debugMode) console.log(`[Wait Debug] Versuch ${attempt}/${maxAttempts}: Element ${selector} nicht gefunden`);
        }
        return null;
    }

    // Funktion zum Simulieren eines Klicks
    function simulateClick(element) {
        const events = [
            new MouseEvent('mousedown', { bubbles: true, cancelable: true }),
            new MouseEvent('click', { bubbles: true, cancelable: true }),
            new MouseEvent('mouseup', { bubbles: true, cancelable: true })
        ];
        element.focus();
        events.forEach(event => element.dispatchEvent(event));
    }

    // Debounce-Funktion
    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Funktion zum Hinzufügen des Ausblende-Buttons
    const addHideButton = debounce(async () => {
        const videoContainers = document.querySelectorAll('yt-lockup-view-model:not([data-hide-button-added])');
        if (videoContainers.length > 0) {
            console.log(formatTranslation('hideVideosFound', { count: videoContainers.length }));
        } else if (config.debugMode) {
            console.log('[Debug] Keine Videos gefunden mit erweitertem Selektor');
        }
        for (let index = 0; index < videoContainers.length; index++) {
            const video = videoContainers[index];
            const metadataContainer = video.querySelector('.yt-lockup-metadata-view-model');
            if (!metadataContainer) {
                console.log(formatTranslation('noMetadataFound', { index }));
                continue;
            }
            const avatarContainer = metadataContainer.querySelector('.yt-lockup-metadata-view-model__avatar');
            if (!avatarContainer) {
                console.log(`[Hide Debug] Kein Avatar-Container für Video ${index} gefunden`);
                continue;
            }
            if (avatarContainer.querySelector('.hide-video-btn')) {
                if (config.debugMode) console.log(`[Hide Debug] Button bereits vorhanden für Video ${index}`);
                continue;
            }
            const hideButton = document.createElement('div');
            hideButton.className = 'hide-video-btn';
            hideButton.textContent = '🚫';
            Object.assign(hideButton.style, {
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: config.hideButtonSize,
                height: config.hideButtonSize,
                borderRadius: '50%',
                fontSize: '16px',
                color: 'white',
                backgroundColor: `rgba(0, 0, 0, ${config.hideButtonOpacity})`,
                cursor: 'pointer',
                pointerEvents: 'auto',
                visibility: 'visible',
                opacity: '1',
                marginLeft: '8px',
                zIndex: '10003'
            });
            avatarContainer.appendChild(hideButton);
            video.setAttribute('data-hide-button-added', 'true');
            console.log(formatTranslation('hideButtonAdded', { index }));
            if (config.debugMode) console.log(`[Hide Debug] Button hinzugefügt zu: ${avatarContainer.outerHTML.slice(0, 100)}`);
            hideButton.addEventListener('click', async (e) => {
                e.stopPropagation();
                e.preventDefault();
                try {
                    const menuButton = video.querySelector(
                        'button-view-model button.yt-spec-button-shape-next, ' +
                        'yt-icon-button#button.dropdown-trigger, ' +
                        'button.yt-icon-button'
                    );
                    if (!menuButton) {
                        console.log(formatTranslation('hideNoMenuButton', { index }));
                        return;
                    }
                    simulateClick(menuButton);
                    console.log(formatTranslation('hideMenuOpened', { index }));
                    let menu = null;
                    let attempt = 0;
                    while (!menu && attempt < config.maxMenuAttempts) {
                        attempt++;
                        menu = document.querySelector('tp-yt-iron-dropdown:not([aria-hidden="true"])');
                        if (!menu) {
                            await new Promise(resolve => setTimeout(resolve, config.menuLoadDelay));
                        }
                    }
                    if (!menu) {
                        console.log(formatTranslation('hideOptionNotFound', { index }));
                        return;
                    }
                    let hideOption = null;
                    attempt = 0;
                    while (!hideOption && attempt < config.maxMenuAttempts) {
                        attempt++;
                        const menuItems = menu.querySelectorAll('yt-list-item-view-model');
                        hideOption = Array.from(menuItems).find(item => {
                            const textElement = item.querySelector('span.yt-core-attributed-string');
                            const text = textElement?.textContent?.trim().toLowerCase();
                            return text?.includes('ausblenden') || text?.includes('hide');
                        });
                        if (hideOption) {
                            hideOption.focus();
                            simulateClick(hideOption);
                            console.log(formatTranslation('hideOptionClicked', { index }));
                            await new Promise(resolve => setTimeout(resolve, config.menuLoadDelay));
                        } else {
                            await new Promise(resolve => setTimeout(resolve, config.menuLoadDelay));
                        }
                    }
                    if (!hideOption) {
                        console.log(formatTranslation('hideOptionNotFound', { index }));
                        if (config.debugMode) {
                            const menuItems = menu.querySelectorAll('yt-list-item-view-model');
                            const menuItemDetails = Array.from(menuItems).map(item => ({
                                html: item.outerHTML.slice(0, 100),
                                text: item.querySelector('span.yt-core-attributed-string')?.textContent?.trim() || 'Kein Text'
                            }));
                            console.log('[Hide Debug] Verfügbare Menü-Elemente:', JSON.stringify(menuItemDetails, null, 2));
                            console.log('[Hide Debug] Gesamte Menüstruktur:', menu.outerHTML.slice(0, 500));
                        }
                        return;
                    }
                    const confirmButton = await waitForElement(
                        'yt-button-renderer#confirm-button, ' +
                        'tp-yt-paper-button:not([disabled]), ' +
                        'yt-button-shape button[aria-label*="Bestätigen" i], ' +
                        'yt-button-shape button[aria-label*="Confirm" i]',
                        3000, 5
                    );
                    if (confirmButton) {
                        simulateClick(confirmButton);
                        console.log(formatTranslation('hideConfirmClicked', { index }));
                    } else {
                        console.log(formatTranslation('hideConfirmNotFound', { index }));
                    }
                } catch (err) {
                    console.error(formatTranslation('hideError', { index, error: err.message }));
                }
            });
        }
    }, 100);

    // Funktion zum Hinzufügen des Shorts-Toggle-Buttons
    let shortsButton = null;
    let shortsSection = null;
    let isShortsHidden = GM_getValue('isShortsHidden', false); // Lade gespeicherten Zustand

    function addShortsToggleButton() {
        const topbar = document.querySelector('ytd-masthead #masthead-container') || document.querySelector('ytd-masthead');
        if (!topbar) {
            console.log(formatTranslation('shortsNoTopbar'));
            return;
        }
        if (document.querySelector('.shorts-toggle-wrapper')) {
            console.log(formatTranslation('shortsButtonExists'));
            return;
        }
        const toggleWrapper = document.createElement('div');
        toggleWrapper.className = 'shorts-toggle-wrapper';
        shortsButton = document.createElement('button');
        shortsButton.className = 'shorts-toggle-btn';
        const textSpan = document.createElement('span');
        textSpan.textContent = formatTranslation('shortsButtonText');
        const iconSpan = document.createElement('span');
        iconSpan.className = 'shorts-toggle-icon';
        iconSpan.textContent = '🚫';
        shortsButton.appendChild(textSpan);
        shortsButton.appendChild(iconSpan);
        Object.assign(shortsButton.style, {
            padding: '2px 8px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: 'transparent',
            color: 'white',
            cursor: 'pointer',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
        });
        toggleWrapper.appendChild(shortsButton);
        const logoContainer = topbar.querySelector('#logo') || topbar.querySelector('#container');
        if (logoContainer) {
            logoContainer.appendChild(toggleWrapper);
            console.log(formatTranslation('shortsButtonAdded'));
        }
        const checkShortsSection = () => {
            shortsSection = document.querySelector(
                'ytd-rich-shelf-renderer[is-shorts], ' +
                'ytd-rich-section-renderer ytd-rich-shelf-renderer[is-shorts], ' +
                'ytd-rich-shelf-renderer span#title-container span#title[textContent*="Shorts" i], ' +
                'ytd-reel-shelf-renderer, ' +
                'ytm-shorts-lockup-view-model, ' +
                'a[href*="/shorts/"], ' +
                'ytd-rich-item-renderer[is-shelf-item], ' + // Neue Selektoren
                'div[id*="contents"] ytd-rich-shelf-renderer' // Breitere Suche nach Shorts
            );
            if (shortsSection) {
                console.log(formatTranslation('shortsFound', { details: shortsSection.outerHTML.slice(0, 100) }));
                shortsButton.disabled = false;
                iconSpan.style.display = isShortsHidden ? 'none' : 'inline';
                if (shortsSection.tagName === 'YTM-SHORTS-LOCKUP-VIEW-MODEL' || shortsSection.tagName === 'A' || shortsSection.tagName === 'YTD-RICH-ITEM-RENDERER') {
                    const shortsItems = document.querySelectorAll('ytm-shorts-lockup-view-model, a[href*="/shorts/"], ytd-rich-item-renderer[is-shelf-item]');
                    shortsItems.forEach(item => {
                        const parent = item.closest('ytd-rich-item-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer');
                        if (parent) parent.style.display = isShortsHidden ? 'none' : '';
                    });
                } else {
                    shortsSection.style.display = isShortsHidden ? 'none' : '';
                }
            } else {
                console.log(formatTranslation('shortsNotFound'));
                console.log('[Debug] Verfügbare Sektionen:', Array.from(document.querySelectorAll('ytd-rich-shelf-renderer, ytd-rich-section-renderer, ytm-shorts-lockup-view-model, ytd-reel-shelf-renderer, a[href*="/shorts/"], ytd-rich-item-renderer[is-shelf-item], div[id*="contents"] ytd-rich-shelf-renderer')).map(el => ({
                    tag: el.tagName,
                    outerHTML: el.outerHTML.slice(0, 100)
                })));
                shortsButton.disabled = true;
                iconSpan.style.display = 'none';
            }
        };
        checkShortsSection();
        shortsButton.addEventListener('click', () => {
            if (shortsSection) {
                isShortsHidden = !isShortsHidden;
                GM_setValue('isShortsHidden', isShortsHidden);
                if (shortsSection.tagName === 'YTM-SHORTS-LOCKUP-VIEW-MODEL' || shortsSection.tagName === 'A' || shortsSection.tagName === 'YTD-RICH-ITEM-RENDERER') {
                    const shortsItems = document.querySelectorAll('ytm-shorts-lockup-view-model, a[href*="/shorts/"], ytd-rich-item-renderer[is-shelf-item]');
                    shortsItems.forEach(item => {
                        const parent = item.closest('ytd-rich-item-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer');
                        if (parent) parent.style.display = isShortsHidden ? 'none' : '';
                    });
                } else {
                    shortsSection.style.display = isShortsHidden ? 'none' : '';
                }
                iconSpan.style.display = isShortsHidden ? 'none' : 'inline';
                console.log(isShortsHidden
                    ? formatTranslation('shortsSectionHidden')
                    : formatTranslation('shortsSectionShown'));
            }
        });
        if (isShortsHidden && shortsSection) {
            if (shortsSection.tagName === 'YTM-SHORTS-LOCKUP-VIEW-MODEL' || shortsSection.tagName === 'A' || shortsSection.tagName === 'YTD-RICH-ITEM-RENDERER') {
                const shortsItems = document.querySelectorAll('ytm-shorts-lockup-view-model, a[href*="/shorts/"], ytd-rich-item-renderer[is-shelf-item]');
                shortsItems.forEach(item => {
                    const parent = item.closest('ytd-rich-item-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer');
                    if (parent) parent.style.display = 'none';
                });
            } else {
                shortsSection.style.display = 'none';
            }
            iconSpan.style.display = 'none';
        }
        // Kontinuierlicher Check für Shorts
        setInterval(checkShortsSection, config.shortsCheckInterval);
    }

    // CSS hinzufügen
    const style = document.createElement('style');
    style.textContent = `
        .hide-video-btn {
            color: white !important;
            background-color: rgba(0, 0, 0, ${config.hideButtonOpacity}) !important;
            border-radius: 50% !important;
            font-size: 16px !important;
            width: ${config.hideButtonSize} !important;
            height: ${config.hideButtonSize} !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            pointerEvents: auto !important;
            z-index: 10003 !important;
            visibility: visible !important;
            opacity: 1 !important;
        }
        .hide-video-btn:hover {
            background-color: rgba(0, 0, 0, 0.9) !important;
            box-shadow: 0 0 10px 2px rgba(255, 215, 0, 0.8) !important;
        }
        .yt-lockup-metadata-view-model__avatar {
            display: flex !important;
            align-items: center !important;
        }
        .shorts-toggle-btn {
            transition: color 0.2s !important;
        }
        .shorts-toggle-btn:not(:disabled):hover {
            color: #cc0000 !important;
        }
        .shorts-toggle-wrapper {
            display: inline-flex !important;
            align-items: center !important;
            margin-left: 8px !important;
            z-index: 10001 !important;
        }
        .shorts-toggle-icon {
            display: none;
            font-size: 12px;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, 0.7);
            text-align: center;
            line-height: 16px;
            color: white;
        }
    `;
    document.head.appendChild(style);

    // Initiale Ausführung
    function initialize() {
        try {
            addHideButton();
            addShortsToggleButton();
            console.log(formatTranslation('initStarted'));
            let attempts = 0;
            const interval = setInterval(() => {
                console.log(formatTranslation('initAttempt', { current: attempts + 1, max: config.maxShortsAttempts }));
                const shortsSection = document.querySelector(
                    'ytd-rich-shelf-renderer[is-shorts], ' +
                    'ytd-rich-section-renderer ytd-rich-shelf-renderer[is-shorts], ' +
                    'ytd-rich-shelf-renderer span#title-container span#title[textContent*="Shorts" i], ' +
                    'ytd-reel-shelf-renderer, ' +
                    'ytm-shorts-lockup-view-model, ' +
                    'a[href*="/shorts/"], ' +
                    'ytd-rich-item-renderer[is-shelf-item], ' +
                    'div[id*="contents"] ytd-rich-shelf-renderer'
                );
                if (shortsSection) {
                    addShortsToggleButton();
                    clearInterval(interval);
                } else if (attempts >= config.maxShortsAttempts) {
                    console.log(formatTranslation('initMaxAttempts'));
                    clearInterval(interval);
                }
                attempts++;
            }, config.shortsCheckInterval);
            setInterval(addHideButton, config.reapplyInterval);
        } catch (err) {
            console.error(formatTranslation('initError', { error: err.message }));
        }
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(initialize, 1000);
    } else {
        document.addEventListener('DOMContentLoaded', () => setTimeout(initialize, 1000));
    }

    // MutationObserver
    const observerTarget = document.querySelector('ytd-app #contents') || document.body;
    const observer = new MutationObserver((mutations) => {
        try {
            const hasRelevantChanges = mutations.some(mutation =>
                mutation.addedNodes.length > 0 &&
                mutation.addedNodes[0]?.nodeType === Node.ELEMENT_NODE &&
                (mutation.target.matches('yt-lockup-view-model, ytd-rich-grid-media, ytd-grid-video-renderer, ytd-compact-video-renderer, ytd-rich-shelf-renderer, ytd-rich-section-renderer, ytm-shorts-lockup-view-model, ytd-reel-shelf-renderer, a[href*="/shorts/"], ytd-rich-item-renderer[is-shelf-item], div[id*="contents"] ytd-rich-shelf-renderer') ||
                 mutation.target.querySelector('yt-lockup-view-model, ytd-rich-grid-media, ytd-grid-video-renderer, ytd-compact-video-renderer, ytd-rich-shelf-renderer[is-shorts], ytd-rich-section-renderer, ytm-shorts-lockup-view-model, ytd-reel-shelf-renderer, a[href*="/shorts/"], ytd-rich-item-renderer[is-shelf-item], div[id*="contents"] ytd-rich-shelf-renderer, .yt-lockup-metadata-view-model')))
            if (hasRelevantChanges) {
                addHideButton();
                addShortsToggleButton();
            }
        } catch (err) {
            console.error(formatTranslation('observerError', { error: err.message }));
        }
    });
    observer.observe(observerTarget, { childList: true, subtree: true });
})();