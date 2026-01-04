// ==UserScript==
// @name         Автоматическое заполнение формы списания
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Скрипт автоматически вставляет в поле "Сумма" сумму к списанию в размере 101. А так же добавляет в коментарий количество привязанных карт у клиента. Если карт не добавлено, страница сама закроется
// @author       HYDRA
// @match        https://svoi-ludi.ru/manager/recurring/add?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=svoi-ludi.ru
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502111/%D0%90%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B5%20%D0%B7%D0%B0%D0%BF%D0%BE%D0%BB%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%84%D0%BE%D1%80%D0%BC%D1%8B%20%D1%81%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/502111/%D0%90%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B5%20%D0%B7%D0%B0%D0%BF%D0%BE%D0%BB%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%84%D0%BE%D1%80%D0%BC%D1%8B%20%D1%81%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    CloseIfError();
    AddRecurringAmount();
    AddCardsCount();
    

    function CloseIfError() {
        if (document.body.className === "body_404"){
            window.close();
        }
    }

    function AddRecurringAmount() {
        let recurringformAmount = document.querySelector("#recurringform-amount");
        recurringformAmount.value = 101;
    }

    function AddCardsCount() {
        let recurringformComment = document.querySelector("#recurringform-comment");
        let recurringformCardid = document.querySelector("#recurringform-cardid");
        let cardsCount = recurringformCardid.childElementCount

        if (cardsCount === 0) {
            window.close();
        }

        recurringformComment.value = cardsCount
    }
})();