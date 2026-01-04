// ==UserScript==
// @name         RunPod 200 Pods per page, Remaining GPU numbers
// @namespace    http://tampermonkey.net/
// @version      2024-12-06
// @author       Ganlv
// @description  Hook webpack chunk loader to replace the literal 12 with 200, and improve some React templates.
// @match        https://www.runpod.io/console/*
// @icon         https://www.runpod.io/favicon.ico
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531220/RunPod%20200%20Pods%20per%20page%2C%20Remaining%20GPU%20numbers.user.js
// @updateURL https://update.greasyfork.org/scripts/531220/RunPod%20200%20Pods%20per%20page%2C%20Remaining%20GPU%20numbers.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const REPLACERS = [
        [/useState\)\(12\)/g, 'useState)(200)'],
        [
            // children:"".concat(ev.gpuCount," x ").concat(null===(eo=ev.machine)||void 0===eo?void 0:eo.gpuDisplayName)
            /children:""\.concat\((\w+)\.gpuCount," x "\)\.concat\(null===\(\w+=\w+\.machine\)\|\|void 0===\w+\?void 0:\w+\.gpuDisplayName\)/g,
            'color:($1?.desiredStatus === "EXITED" ? ($1?.machine?.gpuAvailable > 0 ? "#33c2ff" : "red") : ""),children:"".concat($1.gpuCount," x ").concat(null===(nt=$1.machine)||void 0===nt?void 0:nt.gpuDisplayName + ($1.desiredStatus === "EXITED" ? " (" + nt.gpuAvailable + " Remaining)" : ""))',
        ]
    ];

    unsafeWindow.webpackChunk_N_E = unsafeWindow.webpackChunk_N_E || [];
    unsafeWindow.webpackChunk_N_E = new Proxy(unsafeWindow.webpackChunk_N_E, {
        get(target, property) {
            const value = Reflect.get(target, property);
            if (property === 'push') {
                return function (...args) {
                    for (const key in args[0][1]) {
                        let s = args[0][1][key].toString();
                        let changed = false;
                        for (const [searchValue, replaceValue] of REPLACERS) {
                            if (searchValue.test(s)) {
                                s = s.replace(searchValue, replaceValue);
                                changed = true;
                            }
                        }
                        if (changed) {
                            const newFunc = new Function('return ' + s)();
                            console.log(`chunk ${args[0][0]} key ${key}`, 'old', args[0][1][key], 'new', newFunc);
                            args[0][1][key] = newFunc;
                        }
                    }
                    return Reflect.apply(value, target, args);
                };
            }
            return value;
        }
    });
})();