// ==UserScript==
// @name         Universal Bypass
// @namespace    https://github.com/x3ric
// @version      1.54
// @description  Bypass common web restrictions: right-click, copy-paste, text selection, console, debugger, and more.
// @author       x3ric
// @license      MIT
// @match        *://*/*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_notification
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/511405/Universal%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/511405/Universal%20Bypass.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const settings = GM_getValue('universal_bypass_options', {
        rightClick: false,
        copyPaste: true,
        textSelection: true,
        consoleBypass: false,
        debuggerBypass: false
    });

    const saveSettings = () => GM_setValue('universal_bypass_options', settings);

    const applyBypasses = () => {
        // Right-click bypass
        if (settings.rightClick) {
            window.addEventListener('contextmenu', e => e.stopImmediatePropagation(), { capture: true });
        }

        // Copy/Paste/Cut bypass
        if (settings.copyPaste) {
            ['copy', 'paste', 'cut'].forEach(ev => {
                document.addEventListener(ev, e => { // Check if the event originates from a restricted element
                    const target = e.target;
                    const restrictedElements = ['INPUT', 'TEXTAREA', 'DIV'];
                    if (restrictedElements.includes(target.tagName) && target.isContentEditable) {
                        e.stopImmediatePropagation();
                    }
                }, { capture: true });
            });
        }

        // Text selection bypass with minimal DOM manipulation
        if (settings.textSelection) {
            if (!document.getElementById('universalBypass-style')) {
                const style = document.createElement('style');
                style.id = 'universalBypass-style';
                style.textContent = `
                    * { user-select: text !important; }
                    ::selection { background: #b3d4fc; color: #000; }
                `;
                document.head.appendChild(style);
            }
        }

        // Console bypass
        if (settings.consoleBypass) {
            const noop = () => {};
            ['clear', 'debug', 'log', 'warn', 'error'].forEach(method => {
                console[method] = noop;
            });
        }

        // Debugger bypass
        if (settings.debuggerBypass) {
            unsafeWindow.eval = new Proxy(unsafeWindow.eval, {
                apply: (target, thisArg, args) => {
                    args[0] = args[0].replace(/debugger/g, ''); // Remove debugger statements
                    return Reflect.apply(target, thisArg, args);
                }
            });
        }
    };

    // Handle setting toggling
    const toggleSetting = key => {
        settings[key] = !settings[key];
        saveSettings();
        applyBypasses();
        GM_notification({
            text: `${key.replace(/([A-Z])/g, ' $1').trim()} is now ${settings[key] ? 'ON' : 'OFF'}`,
            title: 'Universal Bypass',
            timeout: 3000
        });
        updateMenuCommand(key);
    };

    // Update the GM menu
    const menuCommands = {};
    const updateMenuCommand = (key) => {
        if (menuCommands[key]) GM_unregisterMenuCommand(menuCommands[key]);
        menuCommands[key] = GM_registerMenuCommand(
            `${key.replace(/([A-Z])/g, ' $1').trim()} (${settings[key] ? 'ON' : 'OFF'})`,
            () => toggleSetting(key)
        );
    };

    // Set up menu and apply initial bypasses
    Object.keys(settings).forEach(updateMenuCommand);
    applyBypasses();

    // Minimal DOM monitoring (trigger bypasses only when relevant changes occur)
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                applyBypasses();
            }
        }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Reapply bypasses on page navigation events
    ['load', 'popstate', 'pushstate', 'replacestate'].forEach(event =>
        window.addEventListener(event, applyBypasses, true)
    );
})();
