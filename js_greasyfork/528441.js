// ==UserScript==
// @name         Remove Ozon Recommendations
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Убирает блоки рекомендаций на Ozon
// @author       Ты
// @match        https://www.ozon.ru/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/528441/Remove%20Ozon%20Recommendations.user.js
// @updateURL https://update.greasyfork.org/scripts/528441/Remove%20Ozon%20Recommendations.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeSkuGrid() {
        document.querySelectorAll('[data-widget="skuGrid"]').forEach(el => el.remove());
    }
    
    // Удаляем сразу после загрузки страницы
    removeSkuGrid();

    // Следим за динамическими изменениями (lazy loading)
    const observer = new MutationObserver(() => removeSkuGrid());
    observer.observe(document.body, { childList: true, subtree: true });
})();
