// ==UserScript==
// @name         Web Tycoon Vasil
// @namespace    Web Tycoon Vasil
// @version      1.00.4
// @description  Для Василия
// @match        https://game.web-tycoon.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @author       Agor71
// @downloadURL https://update.greasyfork.org/scripts/374048/Web%20Tycoon%20Vasil.user.js
// @updateURL https://update.greasyfork.org/scripts/374048/Web%20Tycoon%20Vasil.meta.js
// ==/UserScript==
// Email для связи с автором: kimdmitry2008@gmail.com

(function() {
    'use strict';


    //Блок переменных
    let player_data,//Переменная для хранения данных о компании в целом
        token = localStorage.token,//токен, записываемый игрой в хранилище
        ts = +($.now() / 1000).toFixed(),//Переменная для хранения текущего момента времени в серверном формате
        player_id = localStorage.userId;//Айдишка игрока. Используется во всех ajax запросах


    request_data();//Запускаем скрипт на выполнение


    function request_data() {
        token = localStorage.token;//обновляем токен
        ts = +($.now() / 1000).toFixed();//обновляем время
//ts = $.now();
        $.ajax({
            url: 'https://game.web-tycoon.com/api/users/' + player_id + '/init?access_token=' + token + '&ts=' + ts,
            success: function (response) {
                player_data = response;//запись ответа сервера для дальнейшей обработки подфункциями

                delete_spam();//Чистим от спама
                contract_search();//ищем задания под битки
                contract_delete_non_btc();//удаляем задания с иными наградами

                //Рекурсивно замыкаем функцию на себя
                setTimeout(function() { request_data(); }, 180000);
            },
            error: function() {
                setTimeout(function() { request_data(); }, 60000);
            }
        })
    }


    //Функция для удаления спама. Проходит по всем сайтам, ищет ссылки с признаком спама. Как находит - удаляет
    function delete_spam() {
        for (let site in player_data.sites){
            let site_status = player_data.sites[site].status;//Статус сайта позволяет отделить неработающие от работающих

            if (site_status == 1){
                let site_links = player_data.sites[site].links,
                    site_id = player_data.sites[site].id,
                    site_domain = player_data.sites[site].domain;

                for (let link in site_links){
                    let domain_from = site_links[link].fromDomain;//С какого сайта исходит ссылка. Удаляем только те, где с собственного сайта игрока идёт спам

                    if (site_links[link].type == 2 && domain_from == site_domain){
                        $.ajax({
                            url: 'https://game.web-tycoon.com/api/links/' + player_id + '/' + site_id + '/spam?access_token=' + token + '&ts=' + ts,
                            type: 'delete'
                        });
                        return;//Прерываем выполнение функции, чтобы не плодить запросы
                    }
                }
            }
        }
    }


    //Функция поиска контрактов
    function contract_search() {
        let task_checker = true;

        for (let task in player_data.tasks) {
            let task_type_id = player_data.tasks[task].tasktypeId;

            if (task_type_id == 37) {
                task_checker = false;
            }
        }
        if (task_checker == true) {
            let contract_slots = player_data.person.questSlots;

            if (player_data.person.questContracts.length < contract_slots) {
                $.ajax({
                    url: 'https://game.web-tycoon.com/api/questContract/findOffers/' + player_id + '/1?access_token=' + token + '&ts=' + ts,
                    type: 'post'
                })
            }
        }
    }


    //Функция удаления заданий без биткоинов
    function contract_delete_non_btc() {
        for (let contract in player_data.person.questContracts) {
            let btc_prize = player_data.person.questContracts[contract].questContractType.prizeBtc,
                contract_status = player_data.person.questContracts[contract].status;

            if (btc_prize == null && contract_status == 1) {
                let contract_id = player_data.person.questContracts[contract].id;

                $.ajax({
                    url: 'https://game.web-tycoon.com/api/questContract/' + player_id + '/' + contract_id + '/delete?access_token=' + token + '&ts=' + ts,
                    type: 'delete'
                })
            }
        }
    }

})();