// ==UserScript==
// @name         No More CW V3rm
// @namespace    http://v3rm.net/
// @version      1
// @description  remove cw from v3rm.net/forums/
// @author       lfgan
// @match        https://v3rm.net/forums/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508367/No%20More%20CW%20V3rm.user.js
// @updateURL https://update.greasyfork.org/scripts/508367/No%20More%20CW%20V3rm.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function() {
        let elements = document.querySelectorAll('a');

        elements.forEach(function(element) {
            if (element.textContent.includes('[CW]')) {
                let grandparentDiv = element.closest('div').parentElement.parentElement;

                if (grandparentDiv && grandparentDiv.tagName.toLowerCase() === 'div') {
                    grandparentDiv.remove();
                }
            }
        });
    }, false);
})();