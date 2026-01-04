// ==UserScript==
// @name         Авторыбалка Mistwar
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Авторыбалка для MistWar.ru
// @author       GG Creators
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @icon         https://www.google.com/s2/favicons?domain=mistwar.ru
// @match        *://*.mistwar.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431406/%D0%90%D0%B2%D1%82%D0%BE%D1%80%D1%8B%D0%B1%D0%B0%D0%BB%D0%BA%D0%B0%20Mistwar.user.js
// @updateURL https://update.greasyfork.org/scripts/431406/%D0%90%D0%B2%D1%82%D0%BE%D1%80%D1%8B%D0%B1%D0%B0%D0%BB%D0%BA%D0%B0%20Mistwar.meta.js
// ==/UserScript==
 
/* global $ */
 
(function() {
    'use strict';
 
    // Your code here...
    function autoRyb() {
        const close = document.querySelector('a[href=\"javascript: MessBoxDivClose();\"]')
        const rybalka = document.querySelector('input[value=\"Рыбалка\"]')
        const priroda = document.querySelector('input[value=\"Природа\"]')
        const primanka = document.querySelector('input[value=\"418\"]') // 417-хлеб / 418-червяк
        const cath = document.querySelector('a[class=\"but lov\"]')
        try{
            const timer = window.getComputedStyle(document.getElementById('timerdiv'), null).getPropertyValue("display")
            if(close != null)
            {
                close.click()
            }
            rybalka.click()
            primanka.click()
            cath.click()
        } catch {
            if(priroda != null) {
                priroda.click()
            }
        }
    }
 
    autoRyb()
    setInterval(autoRyb, 1000);
})();