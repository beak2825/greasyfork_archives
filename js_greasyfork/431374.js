// ==UserScript==
// @name         АвтоОхрамон Хромарвор Mistwar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  АвтоОхрамон для MistWar.ru
// @author       GG Creators
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @icon         https://www.google.com/s2/favicons?domain=habr.com
// @match        *://*.mistwar.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431374/%D0%90%D0%B2%D1%82%D0%BE%D0%9E%D1%85%D1%80%D0%B0%D0%BC%D0%BE%D0%BD%20%D0%A5%D1%80%D0%BE%D0%BC%D0%B0%D1%80%D0%B2%D0%BE%D1%80%20Mistwar.user.js
// @updateURL https://update.greasyfork.org/scripts/431374/%D0%90%D0%B2%D1%82%D0%BE%D0%9E%D1%85%D1%80%D0%B0%D0%BC%D0%BE%D0%BD%20%D0%A5%D1%80%D0%BE%D0%BC%D0%B0%D1%80%D0%B2%D0%BE%D1%80%20Mistwar.meta.js
// ==/UserScript==

/* global $ */

(function() {
    'use strict';

    // Your code here...
    function autoXromowar() {
       const xromowar = document.querySelector('a[href*="main.php?prec_id=3"]')
       const vernytsa = document.querySelector('input[value="Вернуться"]')
       if (xromowar != null) {
        xromowar.click()
       }
        if (vernytsa != null)
        {
            vernytsa.click()
        }
        if ( xromowar == null && vernytsa == null) {
            return
        }
    }

    autoXromowar()
    setInterval(autoXromowar, 5000);
})();