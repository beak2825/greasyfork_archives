// ==UserScript==
// @name         чисто кастыли
// @namespace    https://greasyfork.org/ru/users/1032828-crystalby
// @version      1000-7
// @description  zxc?
// @author       точно не станчин
// @match        https://forum.blackrussia.online/admin.php?moderators*
// @include      https://forum.blackrussia.online/admin.php?moderators
// @icon         https://icons.iconarchive.com/icons/iconarchive/incognito-animal-2/256/Sheep-icon.png
// @grant        none
// @license 	 none
// @downloadURL https://update.greasyfork.org/scripts/500960/%D1%87%D0%B8%D1%81%D1%82%D0%BE%20%D0%BA%D0%B0%D1%81%D1%82%D1%8B%D0%BB%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/500960/%D1%87%D0%B8%D1%81%D1%82%D0%BE%20%D0%BA%D0%B0%D1%81%D1%82%D1%8B%D0%BB%D0%B8.meta.js
// ==/UserScript==
(async function() {
     'use strict';
    // люблю кастыли <3 <3 <3
    const mne_skychno = {
        "ld": [
            'Использование модерации для тем/сообщений',
            'Закрепление/открепление тем',
            'Закрытие/открытие тем',
            'Удаление любых сообщений',
            'Управление любыми тегами'
        ],
        'st_adm': [
            'Использование модерации для тем/сообщений',
            'Закрепление/открепление тем',
            'Закрытие/открытие тем',
            'Управление (перемещение, объединение и т.п.) любыми темами',
            'Удаление любых тем',
            'Удаление любых сообщений',
            'Управление любыми тегами',
            'Просмотр скрытых тем/сообщений',
            'Восстановление тем/сообщений'
        ],
        'kf': [
            'Использование модерации для тем/сообщений',
            'Закрепление/открепление тем',
            'Закрытие/открытие тем',
            'Управление (перемещение, объединение и т.п.) любыми темами',
            'Удаление любых тем',
            'Удаление любых сообщений',
            'Управление любыми тегами',
            'Просмотр скрытых тем/сообщений',
        ],
        'skinte_sotky': [
            'Использование модерации для тем/сообщений',
            'Закрепление/открепление тем',
            'Закрытие/открытие тем',
            'Управление (перемещение, объединение и т.п.) любыми темами',
            'Удаление любых тем',
            'Удаление любых сообщений',
            'Управление любыми тегами',
            'Просмотр скрытых тем/сообщений',
        ]
    }

    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        // Добавление кнопок при загрузке страницы
        addButton('СТ АДМ', 'st_adm');
        addButton('Кф', 'kf');
        addButton('ЖБ на игроков', 'skinte_sotky');
        addButton('лд', 'ld');

        $('button#st_adm').click(() => add_rights("st_adm"));
        $('button#kf').click(() =>     add_rights("kf"));
        $(`button#skinte_sotky`).click(() => add_rights("skinte_sotky"));
        $(`button#ld`).click(() => add_rights("ld"));
    })
    function addButton(name, id) {
        $('.button--icon--save').before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 5px; margin-right: 7px;">${name}</button>`,
        );
    }
    // люблю кастыли <3 <3 <3
    function add_rights(type){
        mne_skychno[type].forEach((item, index, arr) => {
            console.log(1)
            javascript:$(".iconic").each(function(){
                console.log($(this).text())
                if($(this).text() == mne_skychno[type][index]) return  $(this).click()

            })
        })
        alert("Т.к я ленивый - не забываем убрать галочку с отоброжения как Команда форума" )
    }
})();