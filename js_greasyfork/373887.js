// ==UserScript==
// @name         Web Tycoon Anti Spam
// @namespace    Web Tycoon Anti Spam
// @version      1.02.0
// @description  Автоматически удаляет спам с сайтов
// @match        https://game.web-tycoon.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @author       Agor71
// @downloadURL https://update.greasyfork.org/scripts/373887/Web%20Tycoon%20Anti%20Spam.user.js
// @updateURL https://update.greasyfork.org/scripts/373887/Web%20Tycoon%20Anti%20Spam.meta.js
// ==/UserScript==
// Email для связи с автором: kimdmitry2008@gmail.com

(function() {
    'use strict';


    //Блок переменных
    let player_data,//Переменная для хранения данных о компании в целом
        token = localStorage.token,//токен, записываемый игрой в хранилище
        ts = +($.now() / 1000).toFixed(),//Переменная для хранения текущего момента времени в серверном формате
        player_id = localStorage.userId,//Айдишка игрока. Используется во всех ajax запросах
        global_timer = 1500,//Шаг для отправки запросов
        request_counter;//Счётчик для отпрвавки запросов


    //Инициируем объект-хранилище информации
    let storage_object = {};
    //Загружаем на старте имеющуюся информацию из хранилища
    if (localStorage['web_tycoon_keker_bot']) {
        storage_object = JSON.parse(localStorage['web_tycoon_keker_bot']);
    }
    //Если информация отсутствует, то заполняем первичную информацию
    else {
        storage_object['last_check'] = 0;
    }


    request_data();//Запускаем скрипт на выполнение


    function request_data() {
        token = localStorage.token;//обновляем токен
        ts = +($.now() / 1000).toFixed();//обновляем время
        
        if (+storage_object['last_check'] <= ts - 5 * 60) {
            $.ajax({
                url: 'https://game.web-tycoon.com/api/users/' + player_id + '/init?access_token=' + token + '&ts=' + ts * 1000,
                success: function (response) {
                    player_data = response;//запись ответа сервера для дальнейшей обработки подфункциями
    
                    request_counter = 1;
    
                    delete_spam();//Чистим от спама


                    //Обновляем объект
                    storage_object['last_check'] = ts;
                    refill_storage();
    
                    //Рекурсивно замыкаем функцию на себя
                    setTimeout(function() { request_data(); }, 180000);
                },
                error: function() {
                    setTimeout(function() { request_data(); }, 15000);
                }
            })
        }
        else {
            setTimeout(function() { request_data(); }, 180000);
        }
    }


    //Функция для удаления спама. Проходит по всем сайтам, ищет ссылки с признаком спама. Как находит - удаляет
    function delete_spam(){
        for (let site in player_data.sites){
            let site_status = player_data.sites[site].status;//Статус сайта позволяет отделить неработающие от работающих

            if (site_status == 1){
                let site_links = player_data.sites[site].links,
                    site_id = player_data.sites[site].id,
                    site_domain = player_data.sites[site].domain;

                for (let link in site_links){
                    let domain_from = site_links[link].fromDomain;//С какого сайта исходит ссылка. Удаляем только те, где с собственного сайта игрока идёт спам

                    if (site_links[link].type == 2 && domain_from == site_domain){
                        request_counter++;
                        setTimeout( function() {
                            $.ajax({
                                url: 'https://game.web-tycoon.com/api/links/' + player_id + '/' + site_id + '/spam?access_token=' + token + '&ts=' + ts,
                                type: 'delete'
                            });
                        }, request_counter * global_timer);
                    }
                }
            }
        }
    }
    
    //Функция заполнения локального хранилища в конце цикла
    function refill_storage() {
        //Вносим в хранилище
        localStorage['web_tycoon_keker_bot'] = JSON.stringify(storage_object);
    }


    setInterval(load_storage, 20 * 1000);//Циклично обновляем данные об объекте
    //Функция загрузки данных из хранилища
    function load_storage() {
        storage_object = JSON.parse(localStorage['web_tycoon_keker_bot']);
    }

})();