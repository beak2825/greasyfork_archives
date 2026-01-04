// ==UserScript==
// @name         Remove spaces
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove spaces from text area
// @author       Austin
// @license      MIT
// @match        https://www.1factory.com/plans/drawing*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1factory.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530372/Remove%20spaces.user.js
// @updateURL https://update.greasyfork.org/scripts/530372/Remove%20spaces.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var area = document.getElementById('js-note');
    var saveButton = document.getElementById('js-save');
    saveButton.addEventListener('click', function() {
        area.value = area.value.replace(/\s+/g, ' ').replace(/\s\./g, '.').replace(/\s,/g, ',').trim();
    }, true);
})();