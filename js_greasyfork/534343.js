// ==UserScript==
// @name         Pikabu Disable Vote Animation
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Отключает анимацию голосования на Пикабу
// @author       ChantGPT
// @match        https://pikabu.ru/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534343/Pikabu%20Disable%20Vote%20Animation.user.js
// @updateURL https://update.greasyfork.org/scripts/534343/Pikabu%20Disable%20Vote%20Animation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Способ 1: Скрыть через CSS
    GM_addStyle(`
        div.vote-animation-container {
            display: none !important;
        }
    `);

    // Способ 2: Следить за DOM и удалять
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1 && node.matches('.vote-animation-container')) {
                    node.remove();
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Способ 3: Перехватить функцию анимации
    const patchAnimationFunction = () => {
        try {
            const chunks = window.webpackChunkpikabu;
            if (!chunks) return;

            for (const chunk of chunks) {
                for (const module of Object.values(chunk[1])) {
                    if (typeof module === 'function') {
                        const code = module.toString();
                        if (code.includes('vote-animation-container') && code.includes('requestAnimationFrame')) {
                            const original = module;
                            module = function() {}; // подменяем на пустую функцию
                            console.log('[Pikabu Vote Animation] Animation function disabled.');
                            return;
                        }
                    }
                }
            }
        } catch (err) {
            console.error('Failed to patch vote animation:', err);
        }
    };

    // Пытаемся сразу, или после загрузки страницы
    if (document.readyState === 'complete') {
        patchAnimationFunction();
    } else {
        window.addEventListener('load', patchAnimationFunction);
    }

})();
