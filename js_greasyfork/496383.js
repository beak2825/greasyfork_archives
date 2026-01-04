// ==UserScript==
// @name         JewishGen Search Unlocker
// @namespace    nikku
// @license      MIT
// @version      0.1
// @description  Unlock Advanced Database Search Features on JewishGen
// @author       nikku
// @match        https://www.jewishgen.org/databases/*
// @match        https://jewishgen.org/databases/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jewishgen.org
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496383/JewishGen%20Search%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/496383/JewishGen%20Search%20Unlocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var tbody = document.querySelector('tbody[onmouseover]');
    if (tbody) {
        tbody.removeAttribute('onmouseover');
        tbody.querySelectorAll('select, input').forEach(function(el) {
            el.removeAttribute('disabled');
        });
    }
})();
