// ==UserScript==
// @name         MTS-Link Auto Confirm & Close (Контроль присутствия для mts-link.ru)
// @author       ilia.dront
// @license      GNU GPLv3
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Автоматически нажимает кнопку в окне контроля присутствия на my.mts-link.ru, проверяет каждые 30 сек или быстрее
// @match        https://my.mts-link.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527237/MTS-Link%20Auto%20Confirm%20%20Close%20%28%D0%9A%D0%BE%D0%BD%D1%82%D1%80%D0%BE%D0%BB%D1%8C%20%D0%BF%D1%80%D0%B8%D1%81%D1%83%D1%82%D1%81%D1%82%D0%B2%D0%B8%D1%8F%20%D0%B4%D0%BB%D1%8F%20mts-linkru%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527237/MTS-Link%20Auto%20Confirm%20%20Close%20%28%D0%9A%D0%BE%D0%BD%D1%82%D1%80%D0%BE%D0%BB%D1%8C%20%D0%BF%D1%80%D0%B8%D1%81%D1%83%D1%82%D1%81%D1%82%D0%B2%D0%B8%D1%8F%20%D0%B4%D0%BB%D1%8F%20mts-linkru%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const checkAndHandle = () => {
        // Приоритет 1: Закрыть окно успеха
        const successCloseButton = document.querySelector(
            '[data-testid="AttentionControlSuccessModal.action.cancel"]'
        );
        if (successCloseButton) {
            successCloseButton.click();
            console.log('Окно успеха закрыто');
            return;
        }

        // Приоритет 2: Подтвердить присутствие
        const confirmButton = document.querySelector(
            '[data-testid="AttentionControlModal.action.submit.Button"]'
        );
        if (confirmButton) {
            confirmButton.click();
            console.log('Присутствие подтверждено');
        }
    };

    // MutationObserver для мгновенной реакции на изменения
    const observer = new MutationObserver(checkAndHandle);
    observer.observe(document.body, {
        subtree: true,
        childList: true,
        attributes: false
    });

    // Резервный интервал на 30 секунд
    setInterval(checkAndHandle, 30000); // 30 000 мс = 30 сек
})();