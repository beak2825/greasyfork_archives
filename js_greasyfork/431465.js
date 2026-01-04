// ==UserScript==
// @name         АвтоВосточнаяБашня Mistwar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  АвтоВосточнаяБашня для MistWar.ru
// @author       GG Creators
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @icon         https://www.google.com/s2/favicons?domain=mistwar.ru
// @match        *://*.mistwar.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431465/%D0%90%D0%B2%D1%82%D0%BE%D0%92%D0%BE%D1%81%D1%82%D0%BE%D1%87%D0%BD%D0%B0%D1%8F%D0%91%D0%B0%D1%88%D0%BD%D1%8F%20Mistwar.user.js
// @updateURL https://update.greasyfork.org/scripts/431465/%D0%90%D0%B2%D1%82%D0%BE%D0%92%D0%BE%D1%81%D1%82%D0%BE%D1%87%D0%BD%D0%B0%D1%8F%D0%91%D0%B0%D1%88%D0%BD%D1%8F%20Mistwar.meta.js
// ==/UserScript==

/* global $ */

(function() {
    'use strict';

    // Your code here...
    function autoBash() {
        const But7 = document.querySelector('a[href*="main.php?fore_id=7"]')
        const But8 = document.querySelector('a[href*="main.php?fore_id=8"]')
        const But9 = document.querySelector('a[href*="main.php?fore_id=9"]')
        const But10 = document.querySelector('a[href*="main.php?fore_id=10"]')
        const But11 = document.querySelector('a[href*="main.php?fore_id=11"]')
        const But12 = document.querySelector('a[href*="main.php?fore_id=12"]')
        const But13 = document.querySelector('a[href*="main.php?fore_id=13"]')
        const But14 = document.querySelector('a[href*="main.php?fore_id=14"]')
        const But15 = document.querySelector('a[href*="main.php?fore_id=15"]')
        const But16 = document.querySelector('a[href*="main.php?fore_id=16"]')
        const vernytsa = document.querySelector('input[value="Вернуться"]')
        const timer = document.querySelector('div[class="timer"]')
        if (But7 != null) {
            But7.click()
        }
        if (But8 != null) {
            But8.click()
        }
        if (But9 != null) {
            But9.click()
        }
        if (But10 != null) {
            But10.click()
        }
        if (But11 != null) {
            But11.click()
        }
        if (But12 != null) {
            But12.click()
        }
        if (But13 != null) {
            But13.click()
        }
        if (But14 != null) {
            But14.click()
        }
        if (But15 != null) {
            But15.click()
        }
        if (But16 != null) {
            But16.click()
        }
        if ( timer != null) {
            return;
        }
        if (vernytsa != null)
        {
            vernytsa.click()
        }
    }

    autoBash()
    setInterval(autoBash, 5000);
})();