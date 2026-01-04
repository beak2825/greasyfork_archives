// ==UserScript==
// @name         Discord 2000 Character Limit Remover
// @namespace    https://discord.com/*
// @version      1.5
// @description  Remove o limite de 2000 caracteres do Discord no navegador
// @author       EmersonxD
// @match        https://discord.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526919/Discord%202000%20Character%20Limit%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/526919/Discord%202000%20Character%20Limit%20Remover.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

(function() {
    'use strict';

    const overrideLimit = () => {
        const NativeTextInput = window.NativeTextInput.prototype;
        
        NativeTextInput._getMaxLength = function() {
            return null; // Remove a restrição de 2000 caracteres
        };

        NativeTextInput._onInput = function(e) {
            e.target.value = e.target.value; // Ignora validações em tempo real
            this.emit('change', e.target.value);
        };

        if (window.DiscordNative && window.DiscordNative.window) {
            const originalSend = window.DiscordNative.window.sendMessage;
            window.DiscordNative.window.sendMessage = (message) => {
                return originalSend(message); // Bypassa validação final
            };
        }
    };

    const observer = new MutationObserver(() => {
        if (document.querySelector('[data-slate-editor="true"]')) {
            overrideLimit();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    if (document.querySelector('[data-slate-editor="true"]')) {
        overrideLimit();
    }
})();