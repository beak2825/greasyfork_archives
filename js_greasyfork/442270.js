// ==UserScript==
// @name         Meteoblue Astro Now
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Highlight current hour in meteoblue "Astronomy Seeing"-table
// @author       Groodion
// @match        https://www.meteoblue.com/de/wetter/outdoorsports/seeing/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442270/Meteoblue%20Astro%20Now.user.js
// @updateURL https://update.greasyfork.org/scripts/442270/Meteoblue%20Astro%20Now.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let styleElement = document.createElement('style');
    document.head.appendChild(styleElement);

    let styleSheet = styleElement.sheet;

    styleSheet.insertRule('.now>td:nth-child(-n+4) { border: 1px solid red }', 0);

    let line = null;

    function update() {
        if(line) line.classList.remove("now");
        line = document.querySelector(`tr[data-day="0"][data-hour="${new Date().getHours()}"]`);
        if(!line) {
            line = document.querySelector(`tr[data-day="1"][data-hour="${new Date().getHours()}"]`);
        }
        line.classList.add("now");
    }

    setInterval(update, 60000);
    update();
})();