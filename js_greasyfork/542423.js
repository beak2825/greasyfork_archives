// ==UserScript==
// @name         GeoGuessr Rebind N Key
// @namespace    https://your-namespace.example.com
// @version      1.0
// @description  Rebind any key (e.g. T) to act like the N key in GeoGuessr. The N key still functions.
// @author       YourName
// @match        https://www.geoguessr.com/*
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/542423/GeoGuessr%20Rebind%20N%20Key.user.js
// @updateURL https://update.greasyfork.org/scripts/542423/GeoGuessr%20Rebind%20N%20Key.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // == 🔧 SET YOUR TRIGGER KEY BELOW ==
    // Change this to any letter key you'd like to use instead of 'N'
    const triggerKey = 't'; // Example: 'q' would make Q act like N

    // == DO NOT CHANGE BELOW ==
    const targetKey = 'n'; // Always simulates N key (compass toggle in GeoGuessr)

    const keyCodeMap = {
        a: 65, b: 66, c: 67, d: 68, e: 69,
        f: 70, g: 71, h: 72, i: 73, j: 74,
        k: 75, l: 76, m: 77, n: 78, o: 79,
        p: 80, q: 81, r: 82, s: 83, t: 84,
        u: 85, v: 86, w: 87, x: 88, y: 89, z: 90
    };

    document.addEventListener('keydown', function (e) {
        const isInput = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
        if (e.key.toLowerCase() === triggerKey.toLowerCase() && !isInput) {
            e.preventDefault();

            const simulatedEvent = new KeyboardEvent('keydown', {
                key: targetKey,
                code: 'Key' + targetKey.toUpperCase(),
                keyCode: keyCodeMap[targetKey],
                which: keyCodeMap[targetKey],
                bubbles: true,
                cancelable: true
            });

            document.dispatchEvent(simulatedEvent);
        }
    });
})();
