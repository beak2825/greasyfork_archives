// ==UserScript==
// @name         DIO Scroll
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Rola a página do bootcamp para a última lição concluída
// @author       Valdinei Ferreira
// @match        https://web.dio.me/track/*
// @icon         https://www.google.com/s2/favicons?domain=dio.me
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438488/DIO%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/438488/DIO%20Scroll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const elements = Array.from(document.querySelectorAll(".timeline-icon-success"));

    if (elements) {
        const el = elements[elements.length-1];
        if (el) el.scrollIntoView();
    }
})();