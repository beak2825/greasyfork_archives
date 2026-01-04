// ==UserScript==
// @name         Github issue bigger input
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Makes the textarea inputs bigger and resized automatically on edit.
// @author       You
// @match        https://github.com/*/issues/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466036/Github%20issue%20bigger%20input.user.js
// @updateURL https://update.greasyfork.org/scripts/466036/Github%20issue%20bigger%20input.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll('textarea').forEach(function (element) {
        element.style.boxSizing = 'border-box';
        var offset = element.offsetHeight - element.clientHeight;
        run(offset, element);
        element.addEventListener('input', function (event) {
            run(offset, event.target);
        });
    });

    document.addEventListener('click', function (event) {
        document.querySelectorAll('textarea').forEach(function (element) {
            element.style.boxSizing = 'border-box';
            var offset = element.offsetHeight - element.clientHeight;
            run(offset, element);
        });
    });

    function run(offset, element) {
        element.style.height = 'auto';
        element.style.height = element.scrollHeight + offset + 'px';
        element.style.maxHeight = element.style.height;
    }
})();