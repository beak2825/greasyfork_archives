// ==UserScript==
// @name         Block screenTop and screenLeft
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Override screenTop and screenLeft with 0
// @author       You
// @match        *://*/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480596/Block%20screenTop%20and%20screenLeft.user.js
// @updateURL https://update.greasyfork.org/scripts/480596/Block%20screenTop%20and%20screenLeft.meta.js
// ==/UserScript==

(function() {
    'use strict';

    Object.defineProperty(window, 'screenLeft', {
        get: function () {
            return 0;
        }
    });

    Object.defineProperty(window, 'screenTop', {
        get: function () {
            return 0;
        }
    });
})();
