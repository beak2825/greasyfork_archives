// ==UserScript==
// @name         Auto-resize textarea
// @namespace    http://leaked.wiki
// @version      0.1
// @description  Auto resize a textarea based on the number of input characters up to 28,000
// @include      https://dust.tt/w/0b51efd2e1/u/gens
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472094/Auto-resize%20textarea.user.js
// @updateURL https://update.greasyfork.org/scripts/472094/Auto-resize%20textarea.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let textarea = document.querySelector('textarea');
    let button = document.querySelector('button');
    let toggle = document.querySelector('input[type="checkbox"]');

    textarea.addEventListener('input', function() {
        if (textarea.value.length <= 30000 && textarea.value.length > 0 && toggle.checked) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    });

    toggle.addEventListener('change', function() {
        if (textarea.value.length <= 30000 && textarea.value.length > 0 && toggle.checked) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    });

    button.addEventListener('click', function() {
        if (button.disabled === false) {
        }
    });
})();