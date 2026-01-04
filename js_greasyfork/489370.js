// ==UserScript==
// @name            ⚙️ HotPot.ai display enable
// @namespace       Wizzergod
// @version         1.0.1
// @description     Enabled Hided oe disabled functionals!
// @description:ru  Включает отключёный или скрытй функционал!
// @icon            https://www.google.com/s2/favicons?sz=64&domain=hotpot.ai
// @license         MIT
// @author          Wizzergod
// @match           *://hotpot.ai/art-generator*
// @match           *://hotpot.ai/remove-background*
// @match           *://hotpot.ai/anime-generator*
// @match           *://hotpot.ai/logo-generator*
// @match           *://hotpot.ai/headshot/train*
// @match           *://hotpot.ai/colorize-picture*
// @match           *://hotpot.ai/restore-picture*
// @match           *://hotpot.ai/enhance-face*
// @match           *://hotpot.ai/drive*
// @match           *://hotpot.ai/s/*
// @match           *://hotpot.ai/upscale-photo*
// @match           *://hotpot.ai/sparkwriter*
// @match           *://hotpot.ai/background-generator*
// @match           *://hotpot.ai/lunar-new-year-headshot*
// @match           *://hotpot.ai/ai-avatar*
// @match           *://hotpot.ai/ai-editor*
// @match           *://hotpot.ai/ai-stock-photo*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/489370/%E2%9A%99%EF%B8%8F%20HotPotai%20display%20enable.user.js
// @updateURL https://update.greasyfork.org/scripts/489370/%E2%9A%99%EF%B8%8F%20HotPotai%20display%20enable.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function showHiddenElements() {
        var elementsToCheck = document.querySelectorAll('#controlBox, #sidebarBox');
        elementsToCheck.forEach(function(element) {
            var hiddenElements = element.querySelectorAll('[style*="display:none"]');
            hiddenElements.forEach(function(hiddenElement) {
                hiddenElement.style.display = 'block';
            });
        });
    }

    // Показывать скрытые элементы при загрузке страницы
    showHiddenElements();

    // Отслеживание изменений каждые 2 секунды
    setInterval(function() {
        showHiddenElements();
    }, 2000);
})();