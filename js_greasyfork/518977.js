// ==UserScript==
// @name            Custom Change Color Script
// @name:ru         Скрипт для замены указанного цвета на странице
// @namespace       http://tampermonkey.net/
// @version         1.1
// @description:en  Change specific colors to another on selected domains
// @description:ru  Заменяет указанные цвета на других доменах
// @author          Shaman_Lesnoy
// @match           *://*/*
// @grant           none
// @license         GPL-3.0
// @description Заменяет указанные цвета на других доменах
// @downloadURL https://update.greasyfork.org/scripts/518977/Custom%20Change%20Color%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/518977/Custom%20Change%20Color%20Script.meta.js
// ==/UserScript==

const SOURCE_COLOR = '#5cdd8b'; // целевой hex цвет
const TARGET_COLOR = '#93fab9'; // новый hex цвет
const ALLOWED_DOMAINS = ['example.com', 'anotherdomain.com']; // Список доменов

(function() {
    'use strict';

    const currentDomain = window.location.hostname;

    if (!ALLOWED_DOMAINS.some(domain => currentDomain.includes(domain))) {
        return;
    }

    function hexToRgb(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgb(${r}, ${g}, ${b})`;
    }

    const sourceRgb = hexToRgb(SOURCE_COLOR);
    const targetColor = TARGET_COLOR;

    function updateColors() {
        document.querySelectorAll('*').forEach(el => {
            const styles = getComputedStyle(el);
            if (styles.color === sourceRgb) {
                el.style.setProperty('color', targetColor, 'important');
            }
            if (styles.backgroundColor === sourceRgb) {
                el.style.setProperty('background-color', targetColor, 'important');
            }
            if (styles.borderColor === sourceRgb) {
                el.style.setProperty('border-color', targetColor, 'important');
            }
        });
    }

    function processShadowRoots(node) {
        if (node.shadowRoot) {
            updateColorsInShadow(node.shadowRoot);
        }
        node.childNodes.forEach(child => processShadowRoots(child));
    }

    function updateColorsInShadow(shadowRoot) {
        shadowRoot.querySelectorAll('*').forEach(el => {
            const styles = getComputedStyle(el);
            if (styles.color === sourceRgb) {
                el.style.setProperty('color', targetColor, 'important');
            }
            if (styles.backgroundColor === sourceRgb) {
                el.style.setProperty('background-color', targetColor, 'important');
            }
            if (styles.borderColor === sourceRgb) {
                el.style.setProperty('border-color', targetColor, 'important');
            }
        });
    }

    const observer = new MutationObserver(() => {
        updateColors();
        processShadowRoots(document.body);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    updateColors();
    processShadowRoots(document.body);
})();
