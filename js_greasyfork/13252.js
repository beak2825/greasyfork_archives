// ==UserScript==
// @name        Clear Input
// @description Clear text of text inputs when middle clicked.
// @namespace   855495743
// @author      Jenie
// @include     *
// @version     0.3
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/13252/Clear%20Input.user.js
// @updateURL https://update.greasyfork.org/scripts/13252/Clear%20Input.meta.js
// ==/UserScript==

var inputs = Array.prototype.slice.call(document.querySelectorAll('input, textarea'));
inputs.forEach(function(i) {
    i.addEventListener("mousedown", function(e) {
        if (e.which === 2) {
        	e.preventDefault();
            e.target.value = '';
            e.target.focus();
        }
    });
});