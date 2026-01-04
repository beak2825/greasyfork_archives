// ==UserScript==
// @name         scientificamerican.com Paywall Bypass
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hooks react on scientificamerican.com to bypass paywalls :D
// @author       November2246
// @match        https://*.scientificamerican.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scientificamerican.com
// @grant        none
// @license      ISC
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/514383/scientificamericancom%20Paywall%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/514383/scientificamericancom%20Paywall%20Bypass.meta.js
// ==/UserScript==

const { log, warn, error, debug } = window.console;

// Object containing prop replacements, used in hook on JSX
const propReplacements = {
    'paywall_exempt': true,
};

// Hooks React Fragments
Object.defineProperty(Object.prototype, 'jsxs', {
    set(value) {
        if (this.Fragment === Symbol.for('react.fragment')) {
            hookJSX(this);
        }
        this._jsxs = value;
    },
    get() {
        return this._jsxs;
    }
});

// Hooks JSX on the fragment
function hookJSX(fragment) {
    if (typeof fragment.jsx !== 'function') return warn('fragment.jsx is not a function!', fragment.jsx);
    fragment.jsx = new Proxy(fragment.jsx, {
        apply(target, thisArg, argArr) {
            argArr = hookProps(argArr);
            return Reflect.apply(...arguments);
        },
    });
}

// Hooks props on the JSX
function hookProps(args) {
    if (!Array.isArray(args)) return args;
    args.forEach(arg => {
        if (typeof arg !== 'object') return; // Ignore functions
        if (typeof arg?.children !== 'object' || typeof arg?.children?.props !== 'object') return; // Find prop with children object containing props

        const props = arg.children.props;
        if (!props.data) return; // Skip props without data

        Object.entries(propReplacements).forEach(([key, value]) => {
            props.data[key] = value;
        });
    });
    return args;
}