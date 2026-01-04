// ==UserScript==
// @name        Internet Roadtrip Fix odometer
// @namespace   jdranczewski.github.io
// @match       https://neal.fun/internet-roadtrip/*
// @version     0.1.2
// @author      jdranczewski
// @description Add a digit to the Internet Roadtrip odometer.
// @license     MIT
// @grant        GM.addStyle
// @icon        https://neal.fun/favicons/internet-roadtrip.png
// @require     https://cdn.jsdelivr.net/npm/internet-roadtrip-framework@0.4.1-beta
// @downloadURL https://update.greasyfork.org/scripts/540853/Internet%20Roadtrip%20Fix%20odometer.user.js
// @updateURL https://update.greasyfork.org/scripts/540853/Internet%20Roadtrip%20Fix%20odometer.meta.js
// ==/UserScript==

// This works together with irf.d.ts to give us type hints
/**
 * Internet Roadtrip Framework
 * @typedef {typeof import('internet-roadtrip-framework')} IRF
 */

(async function() {
    // Style
    GM.addStyle(".car-radio a:first-child {position: absolute; left: -20px;}");

    // Get map methods and various objects
    const odometer = await IRF.vdom.odometer;

    // Override the method
    odometer.state.updateDisplay = new Proxy(odometer.methods.updateDisplay, {
        apply: (target, thisArg, args) => {
            let t;
            let e = (t = Math.max(0, Math.min(99999, args[0]))).toString().padStart(5, '0');
            thisArg.digits = e.split(''),
            thisArg.currentValue = t;
        },
    });
})();