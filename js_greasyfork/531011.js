// ==UserScript==
// @name         Удаление рекламы с mail.ru
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Удаляет динамичную рекламу справа от писем
// @author       resursator
// @license      MIT
// @match        https://e.mail.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mail.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531011/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D1%8B%20%D1%81%20mailru.user.js
// @updateURL https://update.greasyfork.org/scripts/531011/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D1%8B%20%D1%81%20mailru.meta.js
// ==/UserScript==

function removeDynamicAds() {
    'use strict';

    // Get all elements with class "noads-button"
    const noadsButtons = document.getElementsByClassName('noads-button');

    // Loop through each button and remove its grandparent div (two levels up)
    for (let button of noadsButtons) {
        let current = button;
        // Move up three levels
        for (let i = 0; i < 3; i++) {
            if (current && current.parentNode){
                current = current.parentNode;
            }
        }
        // Now, current is the third-level ancestor or null
        // Check if it has a parent (fourth-level ancestor)
        if (current && current.parentNode) {
            current.parentNode.remove();
        }
    }
}

function triggering() {
    for (var i = 0; i < 10; i++) {
        setTimeout(removeDynamicAds, 250 * i);
    }
}

window.addEventListener('load', triggering);