// ==UserScript==
// @name         Fix Popcat Wrong Words
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fix some wrong words on the popcat webpage
// @author       Misaka-L
// @match        https://popcat.click/
// @icon         https://popcat.click/icons/favicon-32x32.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430817/Fix%20Popcat%20Wrong%20Words.user.js
// @updateURL https://update.greasyfork.org/scripts/430817/Fix%20Popcat%20Wrong%20Words.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function(){
        var items = document.getElementsByClassName("country")
        for (var i = 0; i < items.length; i++)
        {
            switch (items[i].innerText)
            {
                case 'Taiwan':
                    items[i].innerText = "China Taiwan"
                    break;
                case 'Hong Kong':
                    items[i].innerText = "Hong Kong SAR"
                    break;
            }
        }
    }, 1000);
})();