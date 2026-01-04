// ==UserScript==
// @name         Jump to compare
// @namespace    http://your-namespace.com
// @version      1.0
// @description  Description of your script
// @match        https://www.ternbicycles.com/en/bikes/*/*
// @run-at       document-idle
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/489843/Jump%20to%20compare.user.js
// @updateURL https://update.greasyfork.org/scripts/489843/Jump%20to%20compare.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        var targetClasses = [
            'views-element-container.bg-gray-200.p-12.mt-12',
            'views-element-container.bg-gray-200.p-12'
        ];

        var targetElement = null;
        for (var i = 0; i < targetClasses.length; i++) {
            targetElement = document.querySelector('.' + targetClasses[i]);
            if (targetElement) {
                break;
            }
        }

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        }
    });
})();