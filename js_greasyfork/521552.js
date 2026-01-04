// ==UserScript==
// @name         Remove garland from VK
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Удаляет новогоднюю гирлянду на vk.com
// @author       dmg_b
// @match        https://vk.com/*
// @grant        none
// @license      dmg_b
// @downloadURL https://update.greasyfork.org/scripts/521552/Remove%20garland%20from%20VK.user.js
// @updateURL https://update.greasyfork.org/scripts/521552/Remove%20garland%20from%20VK.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // эта штука удаляет гирлянду
    function removeUnwantedElement() {
        const unwantedElement = document.querySelector('div[style*="pointer-events: none;"][style*="position: absolute;"]');
        if (unwantedElement) {
            unwantedElement.remove();
            console.log('Новогодняя гирлянда снята со странички');
        }
    }

    // эта штука делает первичную проверку этого элемента
    removeUnwantedElement();

    // эта штука наблюдает за изменениями в DOM
    const observer = new MutationObserver(() => {
        removeUnwantedElement();
    });

    // эта штука наблюдает за изменениями документа
    observer.observe(document.body, { childList: true, subtree: true });
})();
