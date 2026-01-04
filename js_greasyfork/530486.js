// ==UserScript==
// @name         container words visible
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  telefonda chatda konuşurken gelip rahatsız eden çizim sırası yerini siler
// @author       Ryzex
// @match        *://gartic.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530486/container%20words%20visible.user.js
// @updateURL https://update.greasyfork.org/scripts/530486/container%20words%20visible.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = `
        .containerWords {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            position: absolute !important;
            top: -9999px !important;
            left: -9999px !important;
        }
    `;
    document.head.appendChild(style);

})();