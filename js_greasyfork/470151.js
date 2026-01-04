// ==UserScript==
// @name         Quizlet Test AutoCompletetion Disabler
// @version      1.2
// @author       refracta
// @description  Remove lag-causing autocompletion in Quizlet test
// @match        https://quizlet.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=quizlet.com
// @license      MIT
// @namespace https://greasyfork.org/users/467840
// @downloadURL https://update.greasyfork.org/scripts/470151/Quizlet%20Test%20AutoCompletetion%20Disabler.user.js
// @updateURL https://update.greasyfork.org/scripts/470151/Quizlet%20Test%20AutoCompletetion%20Disabler.meta.js
// ==/UserScript==
(async function () {
    'use strict';
    if (location.pathname.includes('/test/')) {
        Array.prototype.push = (function (original) {
            return function (...args) {
                const isAutoCompleteElement = args.some(arg =>
                        arg && typeof arg === 'object' &&
                        Object.keys(arg).length === 2 &&
                        'character' in arg &&
                        'lang' in arg);
                if (isAutoCompleteElement) {
                    return this.length;
                } else {
                    return original.apply(this, args);
                }
            };
        })(Array.prototype.push);
    }
})();