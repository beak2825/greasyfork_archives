// ==UserScript==
// @name         Enchant Toggle Mine-Craft.io - Mine-Craft.fun
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Enchant Toggle with J (Change it in Line 14 if you want a other button)
// @author       Junes
// @match        https://mine-craft.io/*
// @match        https://mine-craft.fun/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513937/Enchant%20Toggle%20Mine-Craftio%20-%20Mine-Craftfun.user.js
// @updateURL https://update.greasyfork.org/scripts/513937/Enchant%20Toggle%20Mine-Craftio%20-%20Mine-Craftfun.meta.js
// ==/UserScript==

(function() {
    let enchantEnabled = true;
    document.addEventListener('keydown', function(e) {
        if (e.key === 'j' || e.key === 'J') {
            let enchantElements = document.querySelectorAll('.enchant-mask, [class=""]');
            enchantElements.forEach(function(element) {
                if (enchantEnabled) {
                    element.classList.remove('enchant-mask');
                } else {
                    element.classList.add('enchant-mask');
                }
            });
            enchantEnabled = !enchantEnabled;
        }
    });
})();