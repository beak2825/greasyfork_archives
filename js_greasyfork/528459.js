// ==UserScript==
// @name         UTILS_FUNCTION Library
// @namespace    dannysaurus.epik
// @version      1.0
// @description  library to modify functions and arrow functions
//
// @license      MIT
// ==/UserScript==

/* jslint esversion: 11 */
/* global unsafeWindow */
(() => {
    'use strict';
    unsafeWindow.dannysaurus_epik ||= {};
    unsafeWindow.dannysaurus_epik.libraries ||= {};

    unsafeWindow.dannysaurus_epik.libraries.UTILS_FUNCTION = (() => {

        /**
          * Throttle function calls with a timeOut between calls.
          * 
          * The timeout is not reset if the function is called again before the timeout has expired.
          * 
          * @param {Function} func - The function to throttle.
          * @param {number} waitMs - The time to wait between function calls in milliseconds.
          * @returns {Function} The throttled function.
          */
        const throttle = (func, waitMs) => {
            let timeout = null;
            let argumnentsForNextCall = null;

            // Funktion, die später aufgerufen wird
            const runAfterTimeout = () => {
                if (argumnentsForNextCall) {
                    func.apply(null, argumnentsForNextCall);
                    argumnentsForNextCall = null;

                    timeout = setTimeout(runAfterTimeout, waitMs);
                } else {
                    timeout = null;
                }
            };

            return (...args) => {
                if (!timeout) {
                    func.apply(null, args);

                    timeout = setTimeout(runAfterTimeout, waitMs);
                } else {
                    argumnentsForNextCall = args;
                }
            };
        };

        return {
            throttle,
        };
    })();
})();