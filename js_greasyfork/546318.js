// ==UserScript==
// @name        KF_script_buttons_simple
// @namespace   https://forum.blackrussia.online
// @match       https://forum.blackrussia.online/threads/*
// @description prefix
// @version 1.0.
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546318/KF_script_buttons_simple.user.js
// @updateURL https://update.greasyfork.org/scripts/546318/KF_script_buttons_simple.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const buttons = [
        { icon: '⏳', title: 'На рассмотрении', value: 2 },
        { icon: '🚫', title: 'Отказано', value: 4 },
        { icon: '✅', title: 'Одобрено', value: 8 },
        { icon: '🛠️', title: 'Передано теху', value: 14 }
    ];

    $(document).ready(() => {
        // Добавляем кнопку открытия выбора
        $('.button--icon--reply').before(
            `<button type="button" class="button rippleButton" id="selectAnswer" 
              style="border-radius: 13px; margin-right: 5px; border: 2px solid #007777;">
              ❄️ by. A.Elemental ❄️
            </button>`
        );

        // Клик по кнопке выбора
        $('#selectAnswer').click(() => {
            XF.alert(buttonsMarkup(buttons), null, 'Выберите статус:');
            buttons.forEach((btn, id) => {
                $(`#answers-${id}`).click(() => {
                    pasteContentWithPrefix(btn.value);
                });
            });
        });
    });

    function buttonsMarkup(buttons) {
        return `<div class="select_answer">${buttons.map((btn, i) =>
            `<button id="answers-${i}" class="button--primary button rippleButton" style="margin:4px;">
                <span class="button-text">${btn.icon} ${btn.title}</span>
            </button>` 
        ).join('')}</div>`;
    }

    function pasteContentWithPrefix(prefixValue) {
        const threadTitle = $('.p-title-value')[0].lastChild.textContent;

        fetch(`${document.URL}edit`, {
            method: 'POST',
            body: getFormData({
                prefix_id: prefixValue,
                title: threadTitle,
                _xfToken: XF.config.csrf,
                _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                _xfWithData: 1,
                _xfResponseType: 'json',
            }),
        }).then(() => location.reload());
    }

    function getFormData(data) {
        const formData = new FormData();
        Object.entries(data).forEach(i => formData.append(i[0], i[1]));
        return formData;
    }

})();
