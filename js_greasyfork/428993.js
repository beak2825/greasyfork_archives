// ==UserScript==
// @name         Remove ads yandex mail
// @version      0.7
// @description  Удаляет рекламу из почты yandex
// @author       BaHeK
// @match        http*://mail.yandex.ru/*
// @grant        none
// @downloadUrl  https://github.com/BaHeK1994/remove-ads-yandex-mail/raw/main/script.user.js
// @updateUrl    https://github.com/BaHeK1994/remove-ads-yandex-mail/raw/main/script.user.js
// @namespace https://greasyfork.org/users/791055
// @downloadURL https://update.greasyfork.org/scripts/428993/Remove%20ads%20yandex%20mail.user.js
// @updateURL https://update.greasyfork.org/scripts/428993/Remove%20ads%20yandex%20mail.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let observer = null;

    // Отслеживаем изменения HTML через observer
    let startObserver = () => {
        observer = new MutationObserver(() => {
            remove();
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });
    };

    let remove = () => {
        // Ищем div с class="DirectLine"
        document.querySelectorAll('div[class="DirectLine"]').forEach((e) => {
            let banner = e;

            // Уже скрыто
            if (banner.style.display === "none") {
                return;
            }

            // Отключаем листенер изменения DOM, иначе будет рекурсия
            if (observer !== null) {
                observer.disconnect();
                observer = null;
            }

            // Скрываем элемент рекламы
            banner.style.display = 'none';
        });

        // Скрываем родительский элемент .BannersBlock
        document.querySelectorAll('.BannersBlock').forEach((e) => {
            let parent = e.parentElement;

            // Уже скрыто
            if (parent.style.display === "none") {
                return;
            }

            // Отключаем листенер изменения DOM, иначе будет рекурсия
            if (observer !== null) {
                observer.disconnect();
                observer = null;
            }

            // Скрываем
            parent.style.display = 'none';
        });

        // Запускаем observer
        if (observer === null) {
            startObserver();
        }
    };

    // Моментально скрываем рекламу, не дожидаясь изменений на странице
    remove();
})();
