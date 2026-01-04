// ==UserScript==
// @name            Копирование ss:// URI сочетанием клавиш
// @namespace       github.com/a2kolbasov
// @version         1.0.0
// @description     Добавляет возможность скопировать ссылку ss:// сочетанием клавиш
// @author          Aleksandr Kolbasov
// @icon            https://www.google.com/s2/favicons?sz=64&domain=outline.network
// @match           https://outline.network/access-keys/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/478804/%D0%9A%D0%BE%D0%BF%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20ss%3A%20URI%20%D1%81%D0%BE%D1%87%D0%B5%D1%82%D0%B0%D0%BD%D0%B8%D0%B5%D0%BC%20%D0%BA%D0%BB%D0%B0%D0%B2%D0%B8%D1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/478804/%D0%9A%D0%BE%D0%BF%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20ss%3A%20URI%20%D1%81%D0%BE%D1%87%D0%B5%D1%82%D0%B0%D0%BD%D0%B8%D0%B5%D0%BC%20%D0%BA%D0%BB%D0%B0%D0%B2%D0%B8%D1%88.meta.js
// ==/UserScript==

// Copyright © 2022 Aleksandr Kolbasov

(() => {
    'use strict';

    const ssCopyBtn = document.querySelector('[id|=dce-clipboard-btn]');
    ssCopyBtn.accessKey = 'C';

    const style = document.createElement('style');
    style.textContent = `\
        [id^=dce-clipboard-btn-]::after {
            content: " [ ${ssCopyBtn.accessKeyLabel} ]";
        }
    `;
    document.body.append(style);
})();
