// ==UserScript==
// @name         АвтоКараван 16 Mistwar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  АвтоКараван для MistWar.ru
// @author       GG Creators
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @icon         https://www.google.com/s2/favicons?domain=mistwar.ru
// @match        *://*.mistwar.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432704/%D0%90%D0%B2%D1%82%D0%BE%D0%9A%D0%B0%D1%80%D0%B0%D0%B2%D0%B0%D0%BD%2016%20Mistwar.user.js
// @updateURL https://update.greasyfork.org/scripts/432704/%D0%90%D0%B2%D1%82%D0%BE%D0%9A%D0%B0%D1%80%D0%B0%D0%B2%D0%B0%D0%BD%2016%20Mistwar.meta.js
// ==/UserScript==

/* global $ */

(function() {
    'use strict';

    // Your code here...
    function autoKaravan() {
        const karBut = document.querySelector('a[href*="main.php?carav_id=5"]')
        const karImg = document.querySelector('a[href="main.php?car=2"]')
        const vernytsa = document.querySelector('input[value="Вернуться"]')
        if (karImg != null) {
            karImg.click()
            if (karBut != null) {
                karBut.click()
            }
            if ( karBut == null && vernytsa == null) {
                return
            }
        }
        if (vernytsa != null)
        {
            vernytsa.click()
        }
    }

    autoKaravan()
    setInterval(autoKaravan, 5000);
})();