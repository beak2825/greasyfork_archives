// ==UserScript==
// @name         Чисто для ВП или не чисто
// @version      1.0.1
// @description  Текстик
// @author       V.Ruchnikov
// @match        https://forum.amazing-online.com/threads/*
// @include      https://forum.amazing-online.com/threads
// @namespace    krosoven
// @grant        none
// @license      MIT
// @icon         https://images.icon-icons.com/4233/PNG/512/chase_canine_patrol_paw_patrol_icon_263864.png
// @downloadURL https://update.greasyfork.org/scripts/536009/%D0%A7%D0%B8%D1%81%D1%82%D0%BE%20%D0%B4%D0%BB%D1%8F%20%D0%92%D0%9F%20%D0%B8%D0%BB%D0%B8%20%D0%BD%D0%B5%20%D1%87%D0%B8%D1%81%D1%82%D0%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/536009/%D0%A7%D0%B8%D1%81%D1%82%D0%BE%20%D0%B4%D0%BB%D1%8F%20%D0%92%D0%9F%20%D0%B8%D0%BB%D0%B8%20%D0%BD%D0%B5%20%D1%87%D0%B8%D1%81%D1%82%D0%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ranks = [
        "рядовой",
        "ефрейтор",
        "младший сержант",
        "сержант",
        "старший сержант",
        "старшина",
        "прапорщик",
        "старший прапорщик",
        "майор",
        "подполковник",
        "полковник",
        "генерал майор"
    ];

    const positions = [
        "механика-водителя",
        "курсанта",
        "стрелка",
        "военнослужащего ВП",
        "заместителя командира РМТО",
        "заместителя командира ДШБ",
        "заместителя командира ВУЦ",
        "заместителя командира ВП",
        "заместителя коменданта ВП",
        "командира РМТО",
        "командира ДШБ",
        "командира ВУЦ",
        "командира ШУВ",
        "командира ВП"
    ];


    $(document).ready(() => {
        addButton('Требование', 'requirement');
        $('button#requirement').click(() => showComplaintForm());
    });

    function showComplaintForm() {
        $('.complaint-form').remove();

        const formHTML = `
        <div class="complaint-form" style="padding: 15px;">
            <h3 style="text-align: center; margin-bottom: 20px;">Форма жалобы</h3>

            <div class="form-group" style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px;">ФИО нарушителя:</label>
                <input type="text" id="violatorName" class="input" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ddd;">
            </div>

            <div class="form-group" style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px;">Звание нарушителя:</label>
                <select id="violatorRank" class="input" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ddd;">
                    ${ranks.map(rank => `<option value="${rank}">${rank}</option>`).join('')}
                </select>
            </div>

            <div class="form-group" style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px;">Должность нарушителя:</label>
                <select id="violatorPosition" class="input" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ddd;">
                    ${positions.map(pos => `<option value="${pos}">${pos}</option>`).join('')}
                </select>
                <input type="text" id="customPosition" class="input" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ddd; margin-top: 5px; display: none;" placeholder="Укажите должность">
            </div>

            <div class="form-group" style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px;">Мое ФИО:</label>
                <input type="text" id="myNickname" class="input" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ddd;">
            </div>

            <div class="form-group" style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px;">Мое звание:</label>
                <select id="myRank" class="input" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ddd;">
                    ${ranks.map(rank => `<option value="${rank}" ${rank === "майор" ? "selected" : ""}>${rank}</option>`).join('')}
                </select>
            </div>

            <div class="form-group" style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px;">Моя должность:</label>
                <select id="myPosition" class="input" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ddd;">
                    ${positions.map(pos => `<option value="${pos}">${pos}</option>`).join('')}
                </select>
                <input type="text" id="myCustomPosition" class="input" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ddd; margin-top: 5px; display: none;" placeholder="Укажите должность">
            </div>

            <div class="form-group" style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px;">Требуемое наказание:</label>
                <select id="disciplinaryAction" class="input" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ddd;">
                    <option value="замечание">Замечание</option>
                    <option value="выговор">Выговор</option>
                    <option value="переаттестация">Переаттестация</option>
                    <option value="понижение в звании">Понижение в звании</option>
                    <option value="увольнение">Увольнение</option>
                </select>
            </div>

            <div class="form-group" style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px;">Пункт устава который нарушили:</label>
                <input type="text" id="violationDescription" class="input" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ddd;" placeholder="Например: п. 5.2 Устава"></div>

            <div class="form-group" style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px;">Ссылка на доказательства:</label>
                <input type="text" id="violationEvidence" class="input" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ddd;" placeholder="Ссылка на скриншот/видео">
            </div>

            <div class="form-group" style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 5px;">Дата и время нарушения:</label>
                <input type="datetime-local" id="violationDateTime" class="input" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ddd;">
            </div>

            <button id="submitComplaint" class="button--primary button rippleButton" style="width: 100%; padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 4px;">Отправить жалобу</button>
        </div>
        `;

        XF.alert(formHTML, null, 'Форма жалобы');

        // Установка текущей даты и времени
        const now = new Date();
        const timezoneOffset = now.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(now - timezoneOffset)).toISOString().slice(0, 16);
        document.getElementById('violationDateTime').value = localISOTime;

        $('#violatorPosition').off('change').change(function() {
            $('#customPosition').toggle($(this).val() === "Другое (указать)");
        });

        $('#myPosition').off('change').change(function() {
            $('#myCustomPosition').toggle($(this).val() === "Другое (указать)");
        });

        $('#submitComplaint').on('click', generateComplaint);
    }

    function generateComplaint() {
        if (!$('#violatorName').val() || !$('#violationDescription').val()) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }

        const formData = {
            violatorName: $('#violatorName').val(),
            violatorRank: $('#violatorRank').val(),
            violatorPosition: $('#violatorPosition').val() === "Другое (указать)"
                ? $('#customPosition').val()
                : $('#violatorPosition').val(),
            myNickname: $('#myNickname').val(),
            myRank: $('#myRank').val(),
            myPosition: $('#myPosition').val() === "Другое (указать)"
                ? $('#myCustomPosition').val()
                : $('#myPosition').val(),
            action: $('#disciplinaryAction').val(),
            violationDescription: $('#violationDescription').val(),
            violationEvidence: $('#violationEvidence').val(),
            violationDateTime: $('#violationDateTime').val()
        };


        const now = new Date();
        const currentDate = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`;


        const complaintText =
        `[RIGHT][FONT=Times New Roman][SIZE=15px]Командиру<br>` +
        `Войсковой части №20115<br>` +
        `Московского военного округа<br>` +
        `генерал-майору Романову М. Е.[/SIZE][/FONT][/RIGHT]<br>` +
        `[SIZE=15px][FONT=Times New Roman][/FONT][/SIZE]<br>` +
        `[CENTER][SIZE=15px][FONT=Times New Roman]РАПОРТ[/FONT][/SIZE][/CENTER]<br>` +
        `[SIZE=15px][FONT=Times New Roman]<br>` +
        `Я, ${formData.myPosition}, ${formData.myRank} ${formData.myNickname}, требую военнослужащего ${formData.violatorName}, находящегося в должности ${formData.iolatorPosition}, в звании ${formData.violatorRank}, ` +
        `привлечь к дисциплинарной ответственности: ${formData.action}, по факту нарушения устава воинской части №20115 ${formData.violationDescription}.<br><br>` +
        `К требованию прилагаю следующие подтверждающие документы:<br>` +
        `1. Фиксация нарушения военнослужащего: [URL='${formData.violationEvidence}']доказательства[/URL]<br>` +
        `2. Дата и время нарушения: ${formData.violationDateTime}<br>` +
        `[/FONT][/SIZE]<br>` +
        `[RIGHT][SIZE=15px][FONT=Times New Roman]Дата подачи рапорта: ${currentDate}[/FONT][/SIZE]<br>` +
        `[FONT=Times New Roman][SIZE=15px]Подпись военнослужащего: [/SIZE][/FONT][/RIGHT]`;


        const $editor = $('.fr-element.fr-view');
        $editor.html(complaintText.replace(/\n/g, '<br>'));

        $('.overlay-titleCloser').trigger('click');
    }

    function addButton(name, id) {
        $('.button--icon--reply').before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 5px; margin-right: 7px;">${name}</button>`,
        );
    }
})();