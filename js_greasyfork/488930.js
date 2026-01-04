// ==UserScript==
// @name            HotPot.ai ResultCount
// @namespace       Wizzergod
// @version         1.0.5
// @description     Add Result Count how many iamges genereated.
// @description:ru  Добавляет счетчик сколько было сгенерировано изображений.
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
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/488930/HotPotai%20ResultCount.user.js
// @updateURL https://update.greasyfork.org/scripts/488930/HotPotai%20ResultCount.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var lastCount = -1;

    function countAndDisplayResultBoxes() {
        var resultListBox = document.getElementById('resultListBox');
        if (resultListBox) {
            var resultBoxes = resultListBox.querySelectorAll('.resultBox');
            var count = resultBoxes.length;

            // Проверяем, изменилось ли количество
            if (count !== lastCount) {
                updateWindowTitle(count);
            }
        }
    }

    function updateWindowTitle(count) {
        var originalTitle = document.title;

        // Удаляем предыдущее GENERATED: и добавляем новое значение
        document.title = originalTitle.replace(/ ✨ GENERATED: \d+ ✨/, '') + ' ✨ GENERATED: ' + count + ' ✨';

        lastCount = count;
    }

    countAndDisplayResultBoxes();

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Проверяем, произошли ли изменения внутри #resultListBox
            if (mutation.target.id === 'resultListBox' && mutation.addedNodes.length > 0) {
                countAndDisplayResultBoxes();
            }
        });
    });

    // Наблюдаем только за изменениями внутри #resultListBox
    var resultListBox = document.getElementById('resultListBox');
    if (resultListBox) {
        observer.observe(resultListBox, { childList: true });
    }
})();