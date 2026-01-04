// ==UserScript==
// @name         Entferne Spiegel+ Artikel von spiegel.de
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Entfernt Spiegel+ Artikel von allen Seiten auf spiegel.de
// @author       flomei
// @match        https://www.spiegel.de/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spiegel.de
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463864/Entferne%20Spiegel%2B%20Artikel%20von%20spiegelde.user.js
// @updateURL https://update.greasyfork.org/scripts/463864/Entferne%20Spiegel%2B%20Artikel%20von%20spiegelde.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function () {
        removeSPlusArticles();
    }, 100);

})();

function removeSPlusArticles() {
    var grid_list = document.querySelectorAll('span[data-flag-name="Spplus-paid"]');
    var grid_array = [...grid_list];

    grid_array.forEach(
        function(e) {
            var sparticle = e.closest('article');
            console.log(sparticle);
            sparticle.remove();
        }
    )
}