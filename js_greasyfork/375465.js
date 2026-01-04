// ==UserScript==
// @name           hwonk's Steam Friend Checker
// @version        1.1.1
// @namespace      hwonk_steam_frined_checker
// @description    Проверка на заявки в друзья
// @include        https://steamcommunity.com/chat/
// @run-at         document-end
// @require        https://code.jquery.com/jquery-3.3.1.min.js
// @resource       icq https://zvukipro.com/uploads/files/2018-12/1545295992_neiz_esten-z_uk.mp3
// @resource       mario https://zvukipro.com/uploads/files/2019-11/1573714932_16-into-the-pipe.mp3
// @resource       money https://zvukipro.com/uploads/files/2018-12/1543855866_prikol-sms-z_uk.mp3
// @grant          GM_getResourceURL
// @downloadURL https://update.greasyfork.org/scripts/375465/hwonk%27s%20Steam%20Friend%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/375465/hwonk%27s%20Steam%20Friend%20Checker.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //Добавляем квери в код сайта, чтобы можно было ковыряться в консоли
    //let jquery_block = $('<script src="https://steamcommunity-a.akamaihd.net/public/javascript/jquery-1.11.1.min.js"></script>'),
    //    body = $('body');
    //body.append(jquery_block);


    let steam_id = JSON.parse($('#webui_config').eq(0).attr('data-userinfo'))['steamid'],
        audio = new Audio(GM_getResourceURL(localStorage["script_audio"])),
        check_interval = 15;//С какой частотой (в секундах) проверяем список приглашений


    //Запускаем инициирующую функцию
    get_profile();


    //Загружаем профиль игрока, страницу с приглашениями в друзья
    function get_profile() {
        $.ajax({
            url: 'https://steamcommunity.com/profiles/' + steam_id + '/friends/pending',
            success: function(html) {
                //После получения страницы считываем количество приглашений в друзья. Если больше 0, то запускаем звуковое оповещение
                let invites_counter = $(html).find('.search_results > .invite_row').length;

                if (invites_counter > 0) {
                    //Версия с интервалами
                    /*let audio_interval = setInterval( function() {
                        play_audio_alert()
                    }, 10000);

                    setTimeout( function() {
                        clearInterval(audio_interval);
                    }, check_interval * 1000);*/

                    //Без интервалов, звук вызываем один раз
                    play_audio_alert()
                }

                setTimeout( function() {
                    get_profile();
                }, check_interval * 1000);
            },
            error: function() {//В случае ошибки перезагружаем страницу заново
                setTimeout( function() {
                    get_profile();
                }, 5000);
            }
        })
    }


    //Функция запускает проигрывание звука
    function play_audio_alert() {
        audio.play();
    }


    //Настройка выбора звука
    //Задаём дефолтное значение
    if (!localStorage["script_audio"]) {
        localStorage["script_audio"] = 'icq';
    }


    //Создаём плашку для выбора звука
    let audio_settings_panel = $('<div id="audio_settings" style="position: fixed; right: 10px; top: 10px; background-color: white; z-index: 100;"></div>'),
        audio_settings_list = $('<select></select>'),
        audio_settings_options = $(`
            <option value="icq">ICQ</option>
            <option value="mario">Mario</option>
            <option value="money">Money</option>
        `);

    audio_settings_list.append(audio_settings_options);
    audio_settings_panel.append(audio_settings_list);


    //При выборе нового звука обновляем информацию в локальном хранилище
    audio_settings_list.on('change', function() {
        let audio_name = $('option:selected', this).attr('value');

        //Пишем в хранилище
        localStorage["script_audio"] = audio_name;

        //Изменяем сам звук
        audio = new Audio(GM_getResourceURL(localStorage["script_audio"]));
    });


    //Автоматически подставляем опцию в выпадающем списке
    $('#audio_settings').find('option').each(function() {
        if ($(this).attr('value') == localStorage["script_audio"]) {
            $(this).prop('selected', true);
        }
    });


    //Размещаем менюшку с выбором звука на странице
    $('body').append(audio_settings_panel);


})();