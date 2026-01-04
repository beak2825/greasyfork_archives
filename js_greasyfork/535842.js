// ==UserScript==
// @name         Anti-Click Hijack Pro 🚫
// @namespace    https://awdescargas.com/
// @version      2.0
// @description  Bloquea popups externos que se abren con cualquier clic en AWDescargas 🔥 sin romper la página
// @author       Charly
// @match        https://awdescargas.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/535842/Anti-Click%20Hijack%20Pro%20%F0%9F%9A%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/535842/Anti-Click%20Hijack%20Pro%20%F0%9F%9A%AB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 🧼 BLOQUEA scripts que inyectan popups
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'SCRIPT') {
                    const suspicious = node.textContent.includes('window.open') ||
                                       node.textContent.includes('popunder') ||
                                       node.textContent.includes('click');
                    if (suspicious) {
                        console.warn("Script sospechoso bloqueado 🧨");
                        node.remove();
                    }
                }
            });
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // 🛑 BLOQUEA cualquier window.open() en eventos de click globales
    let trapClicks = true;
    const originalOpen = window.open;
    window.open = function(...args) {
        if (trapClicks) {
            console.warn('Intento de abrir popup bloqueado 🔐', args[0]);
            return null;
        }
        return originalOpen.apply(this, args);
    };

    document.addEventListener('click', function(e) {
        // Desactiva popups si el target no es un link real
        const isLegitClick = e.target.closest('a')?.href?.startsWith('http');
        trapClicks = !isLegitClick;
        setTimeout(() => trapClicks = true, 500); // reactiva el escudo
    }, true);

    // 🔒 Limpia onclicks que abren popups
    const cleanOnClick = () => {
        document.querySelectorAll('[onclick]').forEach(el => {
            if (el.getAttribute('onclick')?.includes('window.open')) {
                el.removeAttribute('onclick');
                console.log('onclick removido ☠️');
            }
        });
    };

    window.addEventListener('DOMContentLoaded', cleanOnClick);
    setInterval(cleanOnClick, 1500); // Sigue limpiando por si los regeneran

})();
