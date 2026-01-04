// ==UserScript==
// @name         Remove Ad Banner on "Yandex"
// @name:ru      Удалить баннер рекламы на "Яндекс"
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      2024-05-11
// @description  Simple but effective banner remover
// @description:ru Простой, но эффективный инструмент для удаления баннеров рекламы
// @author       You
// @match        https://ya.ru/
// @match        https://yandex.ru/games
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ya.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494762/Remove%20Ad%20Banner%20on%20%22Yandex%22.user.js
// @updateURL https://update.greasyfork.org/scripts/494762/Remove%20Ad%20Banner%20on%20%22Yandex%22.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let bannerClass = document.querySelector('.banner');
    let bannerId = document.getElementById('yandex-adv-sticky-banner-desktop');

    if (bannerClass) {
        bannerClass.innerHTML = '';
        bannerClass.remove();
    }

    if (bannerId) {
        bannerId.innerHTML = '';
        bannerId.remove();
    }
})();