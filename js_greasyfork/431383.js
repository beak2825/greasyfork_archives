// ==UserScript==
// @name         АвтоДикаяОхота Волки Mistwar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  АвтоДикаяОхота для MistWar.ru
// @author       GG Creators
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @icon         https://www.google.com/s2/favicons?domain=mistwar.ru
// @match        *://*.mistwar.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431383/%D0%90%D0%B2%D1%82%D0%BE%D0%94%D0%B8%D0%BA%D0%B0%D1%8F%D0%9E%D1%85%D0%BE%D1%82%D0%B0%20%D0%92%D0%BE%D0%BB%D0%BA%D0%B8%20Mistwar.user.js
// @updateURL https://update.greasyfork.org/scripts/431383/%D0%90%D0%B2%D1%82%D0%BE%D0%94%D0%B8%D0%BA%D0%B0%D1%8F%D0%9E%D1%85%D0%BE%D1%82%D0%B0%20%D0%92%D0%BE%D0%BB%D0%BA%D0%B8%20Mistwar.meta.js
// ==/UserScript==

/* global $ */

(function() {
    'use strict';

    // Your code here...
    function autoOxota() {
       const volkBut = document.querySelector('input[value="Охотиться на Волков"]')
       const volkImg = document.querySelector('a[href*="main.php?carav_id=8"]')
       const vernytsa = document.querySelector('input[value="Вернуться"]')
       if (volkBut != null) {
        volkBut.click()
                   if (volkImg != null) {
        volkImg.click()
       }
       }
        if (vernytsa != null)
        {
            vernytsa.click()
        }
                if ( volkImg == null && vernytsa == null) {
            return
        }
    }

    autoOxota()
    setInterval(autoOxota, 5000);
})();