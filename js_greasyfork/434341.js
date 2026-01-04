// ==UserScript==
// @name         Автокладбище Mistwar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Автокладбище для MistWar.ru
// @author       GG Creators
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @icon         https://www.google.com/s2/favicons?domain=habr.com
// @match        *://*.mistwar.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434341/%D0%90%D0%B2%D1%82%D0%BE%D0%BA%D0%BB%D0%B0%D0%B4%D0%B1%D0%B8%D1%89%D0%B5%20Mistwar.user.js
// @updateURL https://update.greasyfork.org/scripts/434341/%D0%90%D0%B2%D1%82%D0%BE%D0%BA%D0%BB%D0%B0%D0%B4%D0%B1%D0%B8%D1%89%D0%B5%20Mistwar.meta.js
// ==/UserScript==

/* global $ */

(function() {
    'use strict';

    // Your code here...
    function autoKlad() {
        const priroda = document.querySelector('input[value=\"Вернуться\"]')
        const kladbiwe = document.querySelector('a[onclick*="main.php?bot_id=1"]')
        if (priroda != null) {
            priroda.click()
        }
        if (kladbiwe != null) {
            kladbiwe.click()
        }
    }

    autoKlad()
    setInterval(autoKlad, 5000);
})();