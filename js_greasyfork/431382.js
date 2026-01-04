// ==UserScript==
// @name         АвтоДикаяОхота Кабаны Mistwar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  АвтоДикаяОхота для MistWar.ru
// @author       GG Creators
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @icon         https://www.google.com/s2/favicons?domain=mistwar.ru
// @match        *://*.mistwar.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431382/%D0%90%D0%B2%D1%82%D0%BE%D0%94%D0%B8%D0%BA%D0%B0%D1%8F%D0%9E%D1%85%D0%BE%D1%82%D0%B0%20%D0%9A%D0%B0%D0%B1%D0%B0%D0%BD%D1%8B%20Mistwar.user.js
// @updateURL https://update.greasyfork.org/scripts/431382/%D0%90%D0%B2%D1%82%D0%BE%D0%94%D0%B8%D0%BA%D0%B0%D1%8F%D0%9E%D1%85%D0%BE%D1%82%D0%B0%20%D0%9A%D0%B0%D0%B1%D0%B0%D0%BD%D1%8B%20Mistwar.meta.js
// ==/UserScript==

/* global $ */

(function() {
    'use strict';

    // Your code here...
    function autoOxota() {
        const kabanBut = document.querySelector('input[value="Охотиться на Кабанов"]')
        const kabanImg = document.querySelector('a[href*="main.php?carav_id=6"]')
        const vernytsa = document.querySelector('input[value="Вернуться"]')
        const konec = document.querySelector('div[class="timer"]')
        if (kabanBut != null) {
            kabanBut.click()
            if (kabanImg != null) {
                kabanImg.click()
            }
        }
        if (vernytsa != null)
        {
            vernytsa.click()
        }
        if ( konec != null) {
            return
        }
    }

    autoOxota()
    setInterval(autoOxota, 5000);
})();