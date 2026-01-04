// ==UserScript==
// @name         Fake Date
// @namespace    fake-date-script
// @version      1.2
// @description  Set a fake date in your browser globally using Tampermonkey
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529562/Fake%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/529562/Fake%20Date.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const fakeDateValue = '2025-04-10T00:00:00.000Z';
    const fakeDate = new Date(fakeDateValue);
    const fakeTimestamp = fakeDate.getTime();
    const baseTime = Date.now(); // Capture the real time when script loads
    const timeDifference = fakeTimestamp - baseTime;
    const OriginalDate = Date;

    function FakeDate(...args) {
        if (args.length === 0) {
            // Return current fake date when no args provided
            return new OriginalDate(OriginalDate.now() + timeDifference);
        }
        return new OriginalDate(...args);
    }

    // Ensure all static methods are properly copied
    FakeDate.now = function() {
        return OriginalDate.now() + timeDifference;
    };

    FakeDate.parse = OriginalDate.parse;
    FakeDate.UTC = OriginalDate.UTC;

    // Properly copy prototype chain
    FakeDate.prototype = OriginalDate.prototype;
    FakeDate.toString = function() { return OriginalDate.toString(); };
    FakeDate[Symbol.species] = OriginalDate;

    // Override Date
    window.Date = FakeDate;

    // Override performance.now() to align with fake date
    if (window.performance && window.performance.now) {
        const originalNow = window.performance.now.bind(window.performance);
        const perfTimeOrigin = performance.timeOrigin || 0;

        window.performance.now = function() {
            return originalNow() + (timeDifference);
        };

        // Update timeOrigin if it exists
        if ('timeOrigin' in window.performance) {
            Object.defineProperty(window.performance, 'timeOrigin', {
                get: function() {
                    return perfTimeOrigin + timeDifference;
                }
            });
        }
    }

    console.log('Fake Date script loaded. Current fake date:', new Date().toISOString());
})();
