// ==UserScript==
// @name           Seterra (by GeoGuessr) Fullscreen Mode
// @name:de        Seterra Vollbildmodus
// @name:fr        Mode plein écran Seterra
// @name:it        Modalità schermo intero Seterra
// @name:ja        Seterra フルスクリーンモード
// @name:nl        Seterra Volledig Scherm Modus
// @name:tr        Seterra Tam Ekran Modu
// @name:es        Modo de pantalla completa de Seterra
// @name:pt        Modo de tela cheia Seterra
// @name:sv        Seterra Helskärmsläge
// @name:pl        Tryb pełnoekranowy Seterra
// @namespace      http://tampermonkey.net/
// @version        1.3.1
// @description    Adds a fullscreen mode button to Seterra
// @description:de Fügt eine Vollbildmodus-Schaltfläche zu Seterra hinzu
// @description:fr Ajoute un bouton de mode plein écran à Seterra
// @description:it Aggiunge un pulsante per la modalità a schermo intero in Seterra
// @description:ja Seterraにフルスクリーンモードボタンを追加します
// @description:nl Voegt een volledig scherm knop toe aan Seterra
// @description:tr Seterra'ya tam ekran modu düğmesi ekler
// @description:es Agrega un botón de modo de pantalla completa a Seterra
// @description:pt Adiciona um botão de modo de tela cheia ao Seterra
// @description:sv Lägger till en helskärmsläge-knapp till Seterra
// @description:pl Dodaje przycisk trybu pełnoekranowego do Seterra
// @author         TWolf01
// @license        MIT
// @match          https://www.geoguessr.com/vgp/*
// @match          https://www.geoguessr.com/*/vgp/*
// @icon           https://www.geoguessr.com/favicon.ico
// @run-at         document-end
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/522210/Seterra%20%28by%20GeoGuessr%29%20Fullscreen%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/522210/Seterra%20%28by%20GeoGuessr%29%20Fullscreen%20Mode.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const GAME_MAP_SELECTOR = "[class^='game-page_gameAreaWrapper__']";
    const FOOTER_BUTTONS_SELECTOR = "[class^='area-list_section__']";
    const FULLSCREEN_STYLE_CLASS = "custom-fullscreen-style";
    const FULLSCREEN_BUTTON_CLASS = "custom-fullscreen-button";

    const languageCode = document.documentElement.lang || navigator.language || "en";

    const translations = {
        de: "Vollbild",
        fr: "Plein écran",
        it: "Schermo intero",
        ja: "全画面",
        nl: "Volledig scherm",
        tr: "Tam ekran",
        es: "Pantalla completa",
        pt: "ecrã inteiro",
        sv: "Helskärm",
        pl: "Pełny ekran"
    };

    const fullscreenText = translations[languageCode] || "Fullscreen";

    function updateStyle(stylesheet, selectors, padding) {
        const content = `${selectors} { padding-left: ${padding}px; padding-right: ${padding}px; }`;
        if (stylesheet) {
            if (!stylesheet.textContent.includes(`padding-left: ${padding}px`)) stylesheet.textContent = content;
        } else {
            const style = document.createElement('style');
            style.className = FULLSCREEN_STYLE_CLASS;
            style.textContent = content;
            document.head.appendChild(style);
        }
    }

    function createFullscreenStyles(gameMap) {
        const heightRatio = (window.screen.height - gameMap.clientHeight) / gameMap.clientHeight;
        const padding = (window.screen.width - (gameMap.clientWidth * (1 + heightRatio))) / 4;

        if (padding > 5 && padding < 100000) {
            const selectors = `
            :fullscreen,
            :fullscreen div[class^='game-header'],
            :fullscreen div[class^='corner-image_wrapper'],
            :fullscreen div[class^='game-area_mapWrapper']`;
            updateStyle(document.head.querySelector(`style.${FULLSCREEN_STYLE_CLASS}`), selectors, padding);
        }
    }

    function createFullscreenButton(footerContainer, gameMap) {
        if (footerContainer.querySelector(`.${FULLSCREEN_BUTTON_CLASS}`)) return;

        const button = document.createElement("button");
        button.textContent = fullscreenText;
        button.className = FULLSCREEN_BUTTON_CLASS;
        Object.assign(button.style, {
            padding: "10px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
        });

        button.addEventListener("click", () => {
            gameMap.requestFullscreen?.() || gameMap.webkitRequestFullscreen?.() || gameMap.msRequestFullscreen?.();
        });

        footerContainer.appendChild(button);
    }

    function initializeFullscreenButton() {
        const gameMap = document.querySelector(GAME_MAP_SELECTOR);
        const footerButtons = document.querySelector(FOOTER_BUTTONS_SELECTOR);
        if (gameMap && footerButtons) {
            createFullscreenStyles(gameMap);
            createFullscreenButton(footerButtons, gameMap);
        }
    }

    new MutationObserver(initializeFullscreenButton).observe(document.body, {
        childList: true,
        subtree: true
    });
    initializeFullscreenButton();
})();