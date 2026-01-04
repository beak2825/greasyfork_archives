// ==UserScript==
// @name         Автоприманка Mistwar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Автоприманка для MistWar.ru
// @author       GG Creators
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @icon         https://www.google.com/s2/favicons?domain=habr.com
// @match        *://*.mistwar.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431373/%D0%90%D0%B2%D1%82%D0%BE%D0%BF%D1%80%D0%B8%D0%BC%D0%B0%D0%BD%D0%BA%D0%B0%20Mistwar.user.js
// @updateURL https://update.greasyfork.org/scripts/431373/%D0%90%D0%B2%D1%82%D0%BE%D0%BF%D1%80%D0%B8%D0%BC%D0%B0%D0%BD%D0%BA%D0%B0%20Mistwar.meta.js
// ==/UserScript==

/* global $ */

(function() {
    'use strict';

    // Your code here...
    function autoPrim() {
        const priroda = document.querySelector('input[value=\"Природа\"]')
        const primanka = document.querySelector('input[id=\"priman\"]')
        if (priroda != null) {
            priroda.click()
        }
        if (primanka != null) {
            primanka.click()
        }
    }

    autoPrim()
    setInterval(autoPrim, 5000);
})();