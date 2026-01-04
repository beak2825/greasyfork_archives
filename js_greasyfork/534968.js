// ==UserScript==
// @name         Bypass DevTools Detection
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Prevent websites from detecting DevTools (Inspect Element) is open
// @author       Serial Desegnation J
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534968/Bypass%20DevTools%20Detection.user.js
// @updateURL https://update.greasyfork.org/scripts/534968/Bypass%20DevTools%20Detection.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Override debugger to noop ---
    window.debugger = function() {};

    // Spoof Function.prototype.constructor to strip debugger statements from strings
    const originalConstructor = Function.prototype.constructor;
    Function.prototype.constructor = new Proxy(originalConstructor, {
        apply(target, thisArg, args) {
            if (args[0] && typeof args[0] === 'string' && args[0].includes('debugger')) {
                args[0] = args[0].replace(/debugger/g, '');
            }
            return Reflect.apply(target, thisArg, args);
        }
    });

    // Spoof Function.prototype.toString to hide overrides (especially debugger function)
    const originalToString = Function.prototype.toString;
    Function.prototype.toString = new Proxy(originalToString, {
        apply(target, thisArg, args) {
            if (thisArg === window.debugger) {
                return 'function debugger() { [native code] }';
            }
            return Reflect.apply(target, thisArg, args);
        }
    });

    // Override eval to strip debugger statements from any eval'd code
    const originalEval = window.eval;
    window.eval = function(code) {
        if (typeof code === 'string') {
            code = code.replace(/debugger;?/g, '');
        }
        return originalEval(code);
    };

    // Override console methods to disable traps and weird behaviors
    ['log', 'debug', 'error', 'info', 'warn'].forEach(method => {
        const originalMethod = console[method];
        console[method] = function(...args) {
            // Skip logging if args include certain trap images or weird data (optional)
            for (const arg of args) {
                if (arg instanceof Image) return;
            }
            return originalMethod.apply(console, args);
        };
    });

    // Block console.clear to prevent wiping logs
    console.clear = function () {
        console.log('[Tampermonkey] Blocked console.clear()');
    };

    // Spoof window.outerWidth and outerHeight to match inner dimensions (for devtools detection)
    function spoofWindowSize() {
        Object.defineProperty(window, 'outerWidth', {
            get: () => window.innerWidth,
            configurable: true
        });
        Object.defineProperty(window, 'outerHeight', {
            get: () => window.innerHeight,
            configurable: true
        });
    }
    spoofWindowSize();
    // Repeat periodically to counter site attempts to redefine
    setInterval(spoofWindowSize, 1000);

    // Override requestAnimationFrame to fudge timestamps (blocks timing detection)
    const originalRAF = window.requestAnimationFrame;
    window.requestAnimationFrame = function(callback) {
        return originalRAF(function(time) {
            callback(time + 1000);
        });
    };

    // Prevent key combos that open DevTools or View Source
    document.addEventListener('keydown', function(e) {
        if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
            (e.ctrlKey && e.key.toUpperCase() === 'U')
        ) {
            e.stopImmediatePropagation();
            e.preventDefault();
        }
    }, true);

    // Prevent detection via image get traps (used in object inspection)
    const imageProto = Object.getPrototypeOf(new Image());
    if (imageProto) {
        Object.defineProperty(imageProto, 'id', {
            get: function() {
                return null;
            },
            configurable: true
        });
    }

    // Spoof performance navigation type to hide reload detection
    try {
        if (performance.getEntriesByType("navigation")[0].type === "reload") {
            Object.defineProperty(performance, 'getEntriesByType', {
                value: () => [{ type: "navigate" }],
                configurable: true
            });
        }
    } catch (e) {}

    // Spoof navigator.plugins and navigator.languages to look real
    Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3],
        configurable: true
    });
    Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en'],
        configurable: true
    });

    // Spoof HTMLElement.prototype.toString to prevent element inspection detection
    const originalGetOwnPropDesc = Object.getOwnPropertyDescriptor;
    Object.getOwnPropertyDescriptor = new Proxy(originalGetOwnPropDesc, {
        apply(target, thisArg, args) {
            if (args[0] === HTMLElement.prototype && args[1] === 'toString') {
                return {
                    configurable: true,
                    enumerable: false,
                    value: () => '[object HTMLElement]'
                };
            }
            return Reflect.apply(target, thisArg, args);
        }
    });

    // Debugging confirmation message
    console.log('[Tampermonkey] DevTools detection blocked (enhanced).');

})();
