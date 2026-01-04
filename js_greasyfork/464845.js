// ==UserScript==
// @name         Bitbucket PR copy code
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Copy code to Bitbucket PR
// @author       IgnaV
// @license      MIT
// @match        https://bitbucket.org/*/*/pull-requests/*
// @icon         http://bitbucket.org/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464845/Bitbucket%20PR%20copy%20code.user.js
// @updateURL https://update.greasyfork.org/scripts/464845/Bitbucket%20PR%20copy%20code.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        document.querySelectorAll('code').forEach((element) => {
            element.addEventListener('dblclick', () => {
                const seleccion = window.getSelection();
                const rango = document.createRange();
                rango.selectNodeContents(element);
                seleccion.removeAllRanges();
                seleccion.addRange(rango);
            });
        });
    });
})();