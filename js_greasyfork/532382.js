// ==UserScript==
// @name         IDRT
// @namespace    http://tampermonkey.net/
// @version      20250410.1.0
// @description  DZ+R
// @author       xabd
// @license      azab
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @match        http://fc-spaceman-idrt-dub.aka.amazon.com/*
// @match        https://routing-tool-dub.aka.amazon.com/tote-route*
// @downloadURL https://update.greasyfork.org/scripts/532382/IDRT.user.js
// @updateURL https://update.greasyfork.org/scripts/532382/IDRT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        ROUTING: {
            baseRoutes: ["dz-P-MANSORTTOTE", "dz-P-DOCKSORT", "dz-P-DECANT", "ATAC"]
        },
        IDRT: {
            baseDZs: ["dz-P-RPI-CF", "dz-P-ISS-exceptions", "dz-P-UPPREP", "dz-P-NONSORT"]
        }
    };

    const styles = `
        .routing-helper {
            position: fixed;
            top: 300px;
            left: -50px;
            right: -50px;
            background: #232F3E;
            padding: 10px 60px;
            z-index: 1000;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            width: calc(100% + 100px);
        }

        .routing-button {
            background: #FF9900;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 10px 20px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s ease;
            min-width: 180px;
            text-align: center;
        }

        .routing-button:hover {
            background: #FF8000;
            transform: translateY(-1px);
        }
    `;

    function addStyles() {
        const styleSheet = document.createElement("style");
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    function createContainer() {
        const container = document.createElement('div');
        container.className = 'routing-helper';
        return container;
    }

    function createButton(text) {
        const button = document.createElement('button');
        button.className = 'routing-button';
        button.textContent = text;
        return button;
    }

    function handleRoutingToolClick(value) {
        const input = document.querySelector('input[type="text"]');
        if (input) {
            input.value = value;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, which: 13 }));
        }
    }

    function handleIDRTClick(value) {
        const input = document.getElementById('scan_input');
        if (input) {
            input.value = value;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            const form = input.closest('form');
            if (form) form.submit();
        }
    }

    function init() {
        const currentURL = window.location.href;

        // Vérification pour les pages de routing spécifiques
        if (currentURL.includes('/tote-route?jobName=RouteSingle') ||
            currentURL.includes('/tote-route?jobName=RouteMultipleHandScanner')) {

            addStyles();
            const container = createContainer();

            CONFIG.ROUTING.baseRoutes.forEach(route => {
                const button = createButton(route);
                button.addEventListener('click', () => handleRoutingToolClick(route));
                container.appendChild(button);
            });

            document.body.appendChild(container);
        }
        // Vérification pour IDRT
        else if (currentURL.includes('fc-spaceman-idrt-dub.aka.amazon.com')) {
            addStyles();
            const container = createContainer();

            CONFIG.IDRT.baseDZs.forEach(dz => {
                const button = createButton(dz);
                button.addEventListener('click', () => handleIDRTClick(dz));
                container.appendChild(button);
            });

            document.body.appendChild(container);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
