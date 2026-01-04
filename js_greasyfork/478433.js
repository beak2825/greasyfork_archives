// ==UserScript==
// @name         Remove Age Verification
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove age verification elements from ph
// @author       You
// @match        https://rt.pornhub.com/
// @grant        none
// @icon         https://cdn1.iconfinder.com/data/icons/organic-and-food-value-1/512/ph_balanced-1024.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478433/Remove%20Age%20Verification.user.js
// @updateURL https://update.greasyfork.org/scripts/478433/Remove%20Age%20Verification.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function() {
        var elements = ['age-verification-wrapper', 'age-verification-container'];
        elements.forEach(function(id) {
            var element = document.getElementById(id);
            if (element) {
                element.parentNode.removeChild(element);
            }
        });
    };
})();