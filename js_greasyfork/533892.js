// ==UserScript==
// @name         Ultimate Eval Enabler v3
// @namespace    http://fuckdebuggers.com/
// @version      3.0.0
// @description  Bypasses SES/Lockdown and CSP to enable eval() and console access.
// @author       virtualdmns
// @match        http*://*.com/*
// @run-at       document-start
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533892/Ultimate%20Eval%20Enabler%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/533892/Ultimate%20Eval%20Enabler%20v3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper to unfreeze and redefine globals
    const unfreezeAndRedefine = (obj, prop, newValue) => {
        try {
            Object.defineProperty(obj, prop, {
                value: newValue,
                writable: true,
                configurable: true
            });
            console.log(`Redefined ${prop}`);
        } catch (e) {
            console.warn(`Failed to redefine ${prop}: ${e.message}`);
        }
    };

    // Unfreeze critical globals to undo SES/Lockdown
    const unfreezeGlobals = () => {
        const globalsToUnfreeze = ['eval', 'Function', 'Object', 'Array', 'Reflect', 'Proxy', 'console'];
        for (const prop of globalsToUnfreeze) {
            if (Object.isFrozen(window[prop]) || Object.isSealed(window[prop])) {
                try {
                    Object.defineProperty(window, prop, {
                        value: window[prop],
                        writable: true,
                        configurable: true
                    });
                    console.log(`Unfroze ${prop}`);
                } catch (e) {
                    console.warn(`Failed to unfreeze ${prop}: ${e.message}`);
                }
            }
        }
    };

    // Override eval to bypass restrictions
    const originalEval = window.eval;
    const newEval = function(code) {
        if (typeof code !== 'string') return originalEval.call(window, code);
        let sanitized = code
            .replace(/debugger/g, '')
            .replace(/while\s*\(\s*true\s*\)\s*{/g, 'while (false) {')
            .replace(/console\.clear\(\)/g, '');
        try {
            return originalEval.call(window, sanitized);
        } catch (e) {
            console.warn('Eval intercepted:', e.message);
            return null;
        }
    };
    unfreezeAndRedefine(window, 'eval', newEval);

    // Override Function constructor
    const originalFunction = window.Function;
    const newFunction = function(...args) {
        if (args.length > 0 && typeof args[args.length - 1] === 'string') {
            args[args.length - 1] = args[args.length - 1]
                .replace(/debugger/g, '')
                .replace(/while\s*\(\s*true\s*\)\s*{/g, 'while (false) {')
                .replace(/console\.clear\(\)/g, '');
        }
        try {
            return originalFunction.apply(this, args);
        } catch (e) {
            console.warn('Function constructor intercepted:', e.message);
            return function() {};
        }
    };
    newFunction.prototype = originalFunction.prototype;
    unfreezeAndRedefine(window, 'Function', newFunction);

    // Protect console
    const originalConsole = window.console;
    const newConsole = { ...originalConsole };
    newConsole.log = (...args) => originalConsole.log.apply(originalConsole, args);
    newConsole.warn = (...args) => originalConsole.warn.apply(originalConsole, args);
    newConsole.error = (...args) => originalConsole.error.apply(originalConsole, args);
    unfreezeAndRedefine(window, 'console', newConsole);

    // Neutralize Lockdown/SES by re-enabling intrinsics
    const restoreIntrinsics = () => {
        if (typeof window.lockdown === 'function') {
            console.log('Lockdown detected, attempting to bypass...');
            window.harden = (obj) => obj; // Stub out harden
            if (window.Compartment) {
                const originalCompartment = window.Compartment;
                window.Compartment = function(...args) {
                    const comp = new originalCompartment(...args);
                    comp.evaluate = (code) => newEval(code);
                    return comp;
                };
            }
        }
    };

    // Override toString to hide modifications
    const originalToString = Function.prototype.toString;
    Function.prototype.toString = function() {
        if (this === window.eval || this === window.Function) {
            return 'function ' + this.name + '() { [native code] }';
        }
        return originalToString.call(this);
    };

    // Execute everything directly in the userscript context
    try {
        unfreezeGlobals();
        restoreIntrinsics();
        console.log('Eval enabler v3 loaded successfully.');
    } catch (e) {
        console.error('Failed to execute overrides:', e.message);
    }

    // Test if eval works
    try {
        window.eval('console.log("Eval test successful!")');
    } catch (e) {
        console.error('Eval test failed:', e.message);
    }
})();