// ==UserScript==
// @name         АвтоАпхор Mistwar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  АвтоАпхор для MistWar.ru
// @author       GG Creators
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @icon         https://www.google.com/s2/favicons?domain=mistwar.ru
// @match        *://*.mistwar.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431401/%D0%90%D0%B2%D1%82%D0%BE%D0%90%D0%BF%D1%85%D0%BE%D1%80%20Mistwar.user.js
// @updateURL https://update.greasyfork.org/scripts/431401/%D0%90%D0%B2%D1%82%D0%BE%D0%90%D0%BF%D1%85%D0%BE%D1%80%20Mistwar.meta.js
// ==/UserScript==

/* global $ */

(function() {
    'use strict';

    // Your code here...
    function autoApxor() {
        const enterBut = document.querySelector('a[href="main.php?caravan=10"]')
        const But1 = document.querySelector('a[href*="main.php?fore_id=1"]')
        const But2 = document.querySelector('a[href*="main.php?fore_id=2"]')
        const But3 = document.querySelector('a[href*="main.php?fore_id=3"]')
        const But4 = document.querySelector('a[href*="main.php?fore_id=4"]')
        const But5 = document.querySelector('a[href*="main.php?fore_id=5"]')
        const But6 = document.querySelector('a[href*="main.php?fore_id=6"]')
        const vernytsa = document.querySelector('input[value="Вернуться"]')
        const timer = document.querySelector('div[class="timer"]')
        if (enterBut != null) {
            enterBut.click()
            if (But1 != null) {
                But1.click()
            }
            if (But2 != null) {
                But2.click()
            }
            if (But3 != null) {
                But3.click()
            }
            if (But4 != null) {
                But4.click()
            }
            if (But5 != null) {
                But5.click()
            }
            if (But6 != null) {
                But6.click()
            }

        }
        if ( timer != null) {
            return;
        }
        if (vernytsa != null)
        {
            vernytsa.click()
        }
    }

    autoApxor()
    setInterval(autoApxor, 5000);
})();