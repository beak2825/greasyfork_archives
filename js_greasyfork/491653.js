// ==UserScript==
// @name         New Userscript
// @namespace     https://poki.com/en/g/sword-masters
// @version      2024-04-04
// @description  1-shot sword
// @author       You
// @match        https://poki.com/en/g/sword-masters
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491653/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/491653/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // (function() {
    const swords = document.querySelectorAll('.sword');
    swords.forEach(sword => sword.onclick = function() {
        this.style.display = 'none';
    });

})();