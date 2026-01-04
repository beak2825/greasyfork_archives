// ==UserScript==
// @name         Web Tycoon Bot
// @namespace    Web Tycoon Bot
// @version      1.00.0
// @description  Hahahohoho
// @match        https://game.web-tycoon.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/373567/Web%20Tycoon%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/373567/Web%20Tycoon%20Bot.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //Добавляем квери в код сайта, чтобы можно было ковыряться в консоли
    let jquery_block = $('<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>'),
        body = $('body');
    body.append(jquery_block);


    //Инициируем объект-хранилище информации
    let object_from_storage;
    //Загружаем на старте имеющуюся информацию из хранилища
    if (localStorage['web_tycoon_bot']) {
        object_from_storage = JSON.parse(localStorage['web_tycoon_bot']);
    }
    //Если информация отсутствует, то заполняем первичную информацию
    else {
        object_from_storage = {'ad_start_time':{}};
    }


    //Блок переменных
    let data,//Переменная для хранения данных о компании в целом
        data_previous = null,//для части функций необходимо сравнение с тем, что было в последний цикл - можно заметить зависших сотрудников
        token = localStorage.token,//токен, записываемый игрой в хранилище
        content_workers_list = ['5c8d808651346824c1cbcf40','5c8a3a9b58bac0573292ae9b','5c8a78233cba762f49ff2a60','5c9cc799f21cb8626ca195cc','5c9ccef1cebb144e987dee63','5c9ccceecebb144e987deb84'],//список работников маркетинга
        ts = +($.now() / 1000).toFixed(),//Переменная для хранения текущего моммента времени
        //ts = $.now(),
        min_energy = 5,//минимальная энергия, при которой работники начинают и заканчивают работать
        team1 = ['5c8a791d3cba762f49ff2ad2','5c8a6f7c3cba762f49ff269f','5c8a67ca3cba762f49ff222a'],//первая команда разработчиков. Порядок записи важен - фиолетовый, синий, рыжий
        global_ad_importunity = 41,//под какую назойливость рекламы всё настраиваем. 12, 41, 100
        request_counter,//Счётчик для отпрвавки запросов
        global_timer = 1000,//Шаг для отправки запросов
        content_worker_checker = false,//Проверка для маркетинговых работников. Если отправляли на работу, то не отправляем на обучение
        player_id = '5c8a3a9b58bac0573292ae9a';


    //Создание и размещение кнопки для запуска скрипта
    let button_start = $('<button id="button_start">').append('Запустить скрипт').on('click', function() {
        request_data();

        /*setInterval( function() {
            contract_search();
        }, 310 * 1000);*/
    });
    body.append(button_start);//размещаем кнопку запуска


    //request_data();
    //setTimeout( function() { location.reload(); }, 170000);


    //Основная функция. Получает по апи данные о компании и раздаёт подфункциям
    function request_data(){
        token = localStorage.token;//обновляем токен
        ts = +($.now() / 1000).toFixed();

        $.ajax({
            url:'https://game.web-tycoon.com/api/users/' + player_id + '/init?access_token=' + token + '&ts=' + ts * 1000,
            success: function(response){
                data_previous = data;//запись прошлого ответа
                data = response;//запись ответа сервера для дальнейшей обработки подфункциями

                content_worker_checker = false;

                request_counter = 1;

                ts = +($.now() / 1000).toFixed();//обновление времени

                anti_spam();

                publish_content();
                publish_version();

                //prolong_gadget();
                prolong_domain();
                prolong_hosting();
                give_salary();

                //koef_changer();

                advertisement_delete();
                advertisement_activate();
                advertisement_search();

                content_remove_wrong_content();
                content_remove_worker();
                content_creation();

                vacation();
                //vacation_return();
                //task_restarter();

                //contract_delete_non_btc();
                //contract_search(); Поиск контрактов переведён в интервал
                //quest_btc_mining(team1, 'forquest-t1.free');
                //quest_btc_mining(team2, 'forquest-t2.free');

                //gadget_market_refresh();
                //energy_market_refresh();
                //education_market_refresh();

                //auto_webdog_creator(team1, 'for-level-1.free', 35);
                //auto_webdog_creator(team2, 'forquest-t2.free');

                make_site(team1, 'for-level-1.free');


                //energizer(team1);
                //energizer(team2);
                //energizer(team3);
                //energizer(team4);
                //energizer(content_workers_list);
                //energizer([93107]);

                //teach_workers([],'design');//рыжая квала
                //teach_workers([],'backend');//фиолетовая
                //teach_workers([],'frontend');//синяя
                //teach_workers([93107],'marketing');//зеленая

                //delete_education_notifications();

                //find_worker('marketing');

                refill_storage();


                setTimeout( function() { request_data(); }, 140000);//Перезапуск функции на следующую итерацию
            },
            /*statusCode: {
                401: function() {
                    $.ajax({
                        url:'https://game.web-tycoon.com/api/users/login?ts=' + ts,
                        type: 'post',
                        data: {"email":"kimdmitry2008@gmail.com","password":"edcftg91"},
                        dataType: 'json'
                    })
                }
            },*/
            error: function(){
                console.log('Ошибка в request_data, перезапуск');
                setTimeout( function() { request_data(); }, 120000);//перезапуск функции в случае ошибки
            }
        })
    }


    //Функция удаления спама
    //Функция проходит по всем сайтам и по их ссылкам, по типу ссылки определяет спам и отправляет запрос на удаление
    function anti_spam(){
        for (let site in data.sites){
            let site_status = data.sites[site].status;//Статус сайта позволяет отделить неработающие от работающих

            if (site_status == 1){
                let site_links = data.sites[site].links,
                    site_id = data.sites[site].id,
                    site_domain = data.sites[site].domain;

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


    //Функция автопубликации контента
    //Функция находит все сайты, где отсутствует бафф контентом, при этом имеется контент, который к публикации
    function publish_content() {
        for (let site in data.sites){
            let site_buffs = data.sites[site].buffs,
                site_id = data.sites[site].id,
                site_status = data.sites[site].status,
                site_content = data.sites[site].content,
                buff_checker = false,
                current_content_type,
                needed_content_type = 1,
                optimal_content = [1,2,3,4],
                publish_check = false;

            if (site_status != 5) {
                //Если бафф на контент уже есть, то не трогаем
                for (let buff in site_buffs) {
                    if (site_buffs[buff].name == 'site.content') buff_checker = true;
                }

                //Если бафа на контент нет, то ищем, что опубликовать
                if (buff_checker == false) {
                    /*for (let content in site_content) {
                        if (site_content[content].status == 2) {
                            current_content_type = site_content[content].contenttypeId;

                            if (current_content_type < 5) {
                                //for (let i in optimal_content) {
                                    if (optimal_content[i] == current_content_type) {
                                        needed_content_type = current_content_type + 1;
                                    }

                                    if (current_content_type == 4) {
                                        needed_content_type = 1;
                                    }
                                //}

                                needed_content_type = current_content_type + 1;

                                if (current_content_type == 4) {
                                    needed_content_type = 1;
                                }
                            }
                            else {
                                needed_content_type = 1;
                            }
                        }
                    }*/

                    //Определяем текущий контент, чтобы не повторяться
                    for (let content in site_content) {
                        if (site_content[content].status == 2) {
                            current_content_type = site_content[content].contenttypeId;
                        }
                    }

                    for (let content in site_content) {
                        if (site_content[content].status == 1) {
                            let content_id = site_content[content].id,
                                content_type = site_content[content].contenttypeId;

                            if (content_type != current_content_type) {
                                publish_check = true;


                                request_counter++;
                                setTimeout( function() {
                                    $.ajax({
                                        url: 'https://game.web-tycoon.com/api/content/' + player_id + '/' + site_id + '/' + content_id + '?access_token=' + token + '&ts=' + ts,
                                        type: 'post'
                                    });
                                }, request_counter * global_timer);

                                break;
                            }
                        }
                    }

                    //На случай, если весь контент однотипный
                    if (publish_check == false) {
                        for (let content in site_content) {
                            if (site_content[content].status == 1) {
                                let content_id = site_content[content].id;

                                request_counter++;
                                setTimeout( function() {
                                    $.ajax({
                                        url: 'https://game.web-tycoon.com/api/content/' + player_id + '/' + site_id + '/' + content_id + '?access_token=' + token + '&ts=' + ts,
                                        type: 'post'
                                    });
                                }, request_counter * global_timer);

                                break;
                            }
                        }
                    }
                }
            }
        }
    }


    //Функция автопубликации версий
    //Функция находит все сайты, где текущий прогресс равен лимиту
    function publish_version() {
        for (let site in data.sites){
            let site_id = data.sites[site].id,
                site_status = data.sites[site].status,
                site_limit = data.sites[site].limit,
                site_progress = data.sites[site].progress;

            if (site_status != 5) {
                if (
                    site_limit.frontend <= site_progress.frontend &&
                    site_limit.backend <= site_progress.backend &&
                    site_limit.design <= site_progress.design
                ) {
                    request_counter++;
                    setTimeout( function() {
                        $.ajax({
                            url: 'https://game.web-tycoon.com/api/sites/' + player_id + '/' + site_id + '/levelUp?access_token=' + token + '&ts=' + ts,
                            type: 'post'
                        });
                    }, request_counter * global_timer);
                }
            }
        }
    }


    //Функция продления бафов работников (гаджетов)
    function prolong_gadget() {
        for (let worker in data.workers) {
            let worker_buffs = data.workers[worker].buffs;

            for (let buff in worker_buffs) {
                let buff_end_time = worker_buffs[buff].endTime,
                    buff_currency = worker_buffs[buff].currency;

                //Если бафф скоро заканчивается, то продлеваем его)
                if (ts > (buff_end_time - 12 * 60 * 60) && buff_currency == 'usd') {
                    let worker_id = data.workers[worker].id,
                        worker_buff = worker_buffs[buff].buffId;

                    for (let gadget in data.gadgetMarket.gadgetThings) {
                        let gadget_buff = data.gadgetMarket.gadgetThings[gadget].buffId,
                            gadget_id = data.gadgetMarket.gadgetThings[gadget].id;

                        if (gadget_buff == worker_buff) {
                            request_counter++;
                            setTimeout( function() {
                                $.ajax({
                                    url: 'https://game.web-tycoon.com/api/gadget/' + worker_id +'/' + gadget_id + '/buy?access_token=' + token + '&ts=' + ts,
                                    type: 'post',
                                    data: 'personId=' + player_id + ''
                                });
                            }, request_counter * global_timer);

                            return;
                        }
                    }
                }
            }
        }
    }


    //Функция продления домена
    function prolong_domain(){
        for (let site in data.sites){
            let site_id = data.sites[site].id,
                site_status = data.sites[site].status,
                site_domain_till = data.sites[site].domainTill;

            if (site_status != 5) {
                if ((ts + 14 * 24 * 60 * 60) > site_domain_till && site_domain_till != null) {
                    request_counter++;
                    setTimeout( function() {
                        $.ajax({
                            url: 'https://game.web-tycoon.com/api/domains/' + player_id + '/' + site_id + '/payInAdvance?access_token=' + token + '&ts=' + ts,
                            type: 'post'
                        });
                    }, request_counter * global_timer);
                }
            }
        }
    }


    //Функция продления хостинга
    function prolong_hosting(){
        for (let site in data.sites){
            let site_id = data.sites[site].id,
                site_status = data.sites[site].status,
                site_hosting_till = data.sites[site].hostingPaidTill;

            if (site_status != 5) {
                if ((ts + 1 * 24 * 60 * 60) > site_hosting_till && site_hosting_till != null) {
                    request_counter++;
                    setTimeout( function() {
                        $.ajax({
                            url: 'https://game.web-tycoon.com/api/hostings/' + player_id + '/' + site_id + '/payInAdvance?access_token=' + token + '&ts=' + ts,
                            type: 'post'
                        });
                    }, request_counter * global_timer);
                }
            }
        }
    }


    //Функция выдачи зарплаты
    function give_salary(){
        for (let worker in data.workers){
           let worker_id = data.workers[worker].id,
               worker_paid_till = data.workers[worker].paidTill;

           if ((ts + 24 * 60 * 60) > worker_paid_till && worker_paid_till != null){
                request_counter++;
                setTimeout( function() {
                    $.ajax({
                        url: 'https://game.web-tycoon.com/api/workers/' + player_id + '/' + worker_id + '/payInAdvance?access_token=' + token + '&ts=' + ts,
                        type: 'post'
                    });
                }, request_counter * global_timer);
           }
        }
    }


    //Функция удаления неподходящей рекламы
    //Также удаляем старую работающую рекламу
    function advertisement_delete(){
        for (let site in data.sites){
            let site_theme = data.sites[site].sitethemeId,
                site_status = data.sites[site].status,
                site_advertisement = data.sites[site].ad;

            if (site_status != 5) {
                for (let advert in site_advertisement) {
                    let ad_theme = site_advertisement[advert].adthemeId,
                        ad_id = site_advertisement[advert].id,
                        ad_status = site_advertisement[advert].status,
                        ad_importunity = site_advertisement[advert].importunity,
                        ad_start_time;

                    //Удаление неподходящей
                    if (((ad_theme != site_theme && site_theme != 19) || ad_importunity != global_ad_importunity)/* && ad_status === 0*/) {
                        request_counter++;
                        setTimeout( function() {
                            $.ajax({
                                url: 'https://game.web-tycoon.com/api/ad_s/' + player_id + '/' + ad_id + '/delete?access_token=' + token + '&ts=' + ts,
                                type: 'delete'
                            });
                        }, request_counter * global_timer);
                    }


                    //Удаление с низким ctr
                    let ad_ctr = site_advertisement[advert].ctrBase;

                    /*if (ad_ctr <= 3.5) {
                        request_counter++;
                        setTimeout( function() {
                            $.ajax({
                                url: 'https://game.web-tycoon.com/api/ad_s/' + player_id + '/' + ad_id + '/delete?access_token=' + token + '&ts=' + ts,
                                type: 'delete'
                            });
                        }, request_counter * global_timer);
                    }*/

                    //Удаление старой
                    ad_start_time = object_from_storage['ad_start_time'][ad_id];

                    if (ad_status == 1 && ts > (ad_start_time + 3 * 24 * 60 * 60)) {

                        request_counter++;
                        setTimeout( function() {
                            $.ajax({
                                url: 'https://game.web-tycoon.com/api/ad_s/' + player_id + '/' + ad_id + '/delete?access_token=' + token + '&ts=' + ts,
                                type: 'delete',
                                success: function() {
                                    delete object_from_storage['ad_start_time'][ad_id];//Удаляем запись о рекламе
                                }
                            });
                        }, request_counter * global_timer);

                        break;
                    }
                }
            }
        }
    }


    //Функция активации подходящей рекламы
    function advertisement_activate(){
        for (let site in data.sites){
            let site_id = data.sites[site].id,
                site_status = data.sites[site].status,
                site_theme = data.sites[site].sitethemeId,
                site_advertisement = data.sites[site].ad;

            if (site_status != 5) {
                for (let advert in site_advertisement) {
                    let ad_id = site_advertisement[advert].id,
                        ad_theme = site_advertisement[advert].adthemeId,
                        ad_status = site_advertisement[advert].status,
                        ad_importunity = site_advertisement[advert].importunity,
                        ad_active_counter = 0;

                    //Подсчитываем число активных реклам
                    for (let advert in site_advertisement) {
                        let ad_status = site_advertisement[advert].status;

                        if (ad_status == 1) {
                            ad_active_counter += 1;
                        }
                    }

                    if (ad_status === 0 && (ad_theme == site_theme || site_theme == 19) && ad_importunity == global_ad_importunity && ad_active_counter < 1) {
                        request_counter++;
                        setTimeout( function() {
                            $.ajax({
                                url: 'https://game.web-tycoon.com/api/ad_s/' + player_id + '/' + site_id + '/add?access_token=' + token + '&ts=' + ts,
                                type: 'post',
                                dataType: 'json',
                                data: 'adId=' + ad_id,
                                success: function() {
                                    //Записываем в объект-хранилище время активации рекламы
                                    object_from_storage['ad_start_time'][ad_id] = ts;
                                }
                            });
                        }, request_counter * global_timer);

                        break;
                    }
                }
            }
        }
    }


    //Функция запуска поиска рекламы на свободное место
    function advertisement_search(){
        for (let site in data.sites){
            let site_id = data.sites[site].id,
                site_status = data.sites[site].status,
                site_advertisement = data.sites[site].ad,
                ad_length = site_advertisement.length,
                site_domain = data.sites[site].domain,//не ищем рекламу для сайтов под квесты
                site_level = data.sites[site].level,
                ad_slots = data.sites[site].adSlots;

            if (site_status != 5 && site_domain.indexOf('forquest') == -1 && site_level >= 1) {
                //if (ad_length < ad_slots) {
                if (ad_length < 2) {
                    let task_checker = true;

                    for (let task in data.tasks) {
                        let task_type_id = data.tasks[task].tasktypeId;

                        if (task_type_id == 36) {
                            let task_site_id = data.tasks[task].siteId;

                            if (task_site_id == site_id) { task_checker = false; }
                        }
                    }

                    if (task_checker == true) {
                        request_counter++;
                        setTimeout( function() {
                            $.ajax({
                                url: 'https://game.web-tycoon.com/api/ad_s/ad/' + player_id + '/generateOffers/' + site_id + '/2?access_token=' + token + '&ts=' + ts,
                                type: 'post'
                            });
                        }, request_counter * global_timer);
                    }
                }
            }
        }
    }


    //Функция заверешения поиска рекламы за битки
    function boost_advertisiment_search(){

    }


    //Отмена задания на контент, если написаны 4 статьи
    function content_remove_worker() {
        let optimal_content = [1, 4, 7, 8];

        for (let task in data.tasks){
            let task_type = data.tasks[task].tasktypeId;

            if (task_type == 4){
                let task_id = data.tasks[task].id,
                    task_worker_id = data.tasks[task].workers[0],
                    task_site_id = data.tasks[task].siteId;

               //Проверка, имеются ли уже 4 статьи на сайте
                let site_content,
                    //content_counter = 0,
                    optimal_content_counter = 0;
                    //optimal_checker = 0;

                for (let site in data.sites){
                    if (data.sites[site].id == task_site_id) {
                        site_content = data.sites[site].content;
                    }
                }

                for (let content in site_content){
                    if (site_content[content].status == 1) {
                        //content_counter++;
                        let content_type = site_content[content].contenttypeId;

                        for (let i in optimal_content) {
                            if (content_type == optimal_content[i]) {
                                /*if (optimal_content_counter[i] == 0) {
                                    optimal_content_counter[i] += 1;
                                }*/
                                optimal_content_counter += 1;
                            }
                        }
                    }

                }

                /*for (let i in optimal_content_counter) {
                    if (optimal_content_counter[i] == 1) {
                        optimal_checker += 1;
                    }
                }*/

                //if (content_counter >= 4){
                if (optimal_content_counter == 4){
                    request_counter++;
                    setTimeout( function() {
                        $.ajax({
                            url: 'https://game.web-tycoon.com/api/sites/' + player_id + '/' + task_site_id + '/' + task_worker_id + '?access_token=' + token + '&ts=' + ts,
                            type: 'delete',
                            data: 'taskId=' + task_id
                        })
                    }, request_counter * global_timer);


                    //Код ниже удалял работника с баганутого состояния, когда "обучение" идёт на работающем сайте
                    /*request_counter++;
                    setTimeout( function() {
                        $.ajax({
                            url: 'https://game.web-tycoon.com/api/tasks/' + player_id + '/' + task_worker_id + '/cancelEducation?access_token=' + token + '&ts=' + ts,
                            type: 'post'
                        })
                    }, request_counter * global_timer);*/
                }
            }
        }
    }


    //Отправка в отпуск незанятых работников с энергией меньше минимальной
    function vacation(){
        for (let worker in data.workers) {
            let worker_status = data.workers[worker].status;

            if (worker_status == 1) {
                let worker_energy = data.workers[worker].progress.energy;

                if (worker_energy < min_energy) {
                    let worker_id = data.workers[worker].id;

                    request_counter++;
                    setTimeout( function() {
                        $.ajax({
                            url: 'https://game.web-tycoon.com/api/workers/' + player_id + '/vacation/send/' + worker_id + '?access_token=' + token + '&ts=' + ts,
                            type: 'post'
                        });
                    }, request_counter * global_timer);
                }
            }
        }
    }


    //Функция создания контента для сайтов
    //Если имеется свободный работник в сфере маркетинга, то ищем сайт с незаполненным контентом
    function content_creation() {
        if (content_worker_checker == true) { return; }

        $.each(content_workers_list, function() {
            for (let worker in data.workers) {
                let worker_id = data.workers[worker].id;
                if (this == worker_id) {
                    let worker_status = data.workers[worker].status,
                        worker_energy = data.workers[worker].progress.energy;

                    if (worker_status == 1 && worker_energy >= min_energy) {
                        for (let site in data.sites) {
                            let site_status = data.sites[site].status,
                                site_level = data.sites[site].level,
                                site_domain = data.sites[site].domain;

                            if (site_status != 5 && site_domain.indexOf('forquest') == -1 && site_domain.indexOf('for-level') == -1 && site_level <= 30 && site_level >= 1) {
                                let content_counter = 0,
                                    site_content = data.sites[site].content,
                                    site_id = data.sites[site].id,
                                    task_check = true;

                                for (let content in site_content) {
                                    if (site_content[content].status == 1) {
                                        content_counter++;
                                    }
                                }

                                if (content_counter < 3) {
                                    for (let task in data.tasks) {
                                        let task_type = data.tasks[task].tasktypeId;

                                        if (task_type == 4) {
                                            let task_site_id = data.tasks[task].siteId;

                                            if (task_site_id == site_id) {
                                                task_check = false;
                                            }
                                        }
                                    }

                                    if (task_check == true) {
                                        request_counter++;
                                        setTimeout( function() {
                                            $.ajax({
                                                url: 'https://game.web-tycoon.com/api/sites/' + player_id + '/' + site_id + '/4/addTask?access_token=' + token + '&ts=' + ts,
                                                type: 'post',
                                                data: {"workerIds":[worker_id]}
                                            });
                                        }, request_counter * global_timer);

                                        content_worker_checker = true;

                                        return false;
                                    }
                                }
                            }
                        }

                        /*
                        //Контент для высокоуровневых сайтов
                        for (let site in data.sites) {
                            let site_status = data.sites[site].status,
                                site_level = data.sites[site].level,
                                site_domain = data.sites[site].domain;

                            //Оставляем одного из работников вне данной задачи, чтобы всегда была подстраховка для мелких сайтов
                            if (site_status != 5 && site_domain.indexOf('forquest') == -1 && site_level > 35 && worker_id != 59576) {
                                let content_counter = 0,
                                    site_content = data.sites[site].content,
                                    site_id = data.sites[site].id,
                                    task_check = true;

                                for (let content in site_content) {
                                    if (site_content[content].status == 1) {
                                        content_counter++;
                                    }
                                }

                                if (content_counter < 4) {
                                    for (let task in data.tasks) {
                                        let task_type = data.tasks[task].tasktypeId;

                                        if (task_type == 4) {
                                            let task_site_id = data.tasks[task].siteId;

                                            if (task_site_id == site_id) {
                                                task_check = false;
                                            }
                                        }
                                    }

                                    if (task_check == true) {
                                        request_counter++;
                                        setTimeout( function() {
                                            $.ajax({
                                                url: 'https://game.web-tycoon.com/api/sites/' + player_id + '/' + site_id + '/4/addTask?access_token=' + token + '&ts=' + ts,
                                                type: 'post',
                                                data: {"workerIds":[worker_id]}
                                            });
                                        }, request_counter * global_timer);

                                        content_worker_checker = true;

                                        return false;
                                    }
                                }
                            }
                        }*/
                    }
                }
            }
        })
    }


    /*
    1 - audio
    2 - video
    3 - stream
    4 - pictures
    5 - material
    6 - overview
    7 - announcement
    8 - quiz
     */
    //Функция для удаления неподходящего контента с сайтов
    function content_remove_wrong_content() {
        let optimal_content = [1, 4, 7, 8];

        for (let site in data.sites) {
            let site_id = data.sites[site].id,
                site_status = data.sites[site].status,
                site_content = data.sites[site].content;
                //optimal_content_counter = [0,0,0,0];


            if (site_status != 5) {
                for (let content in site_content) {
                    if (site_content[content].status == 1) {
                        let content_id = site_content[content].id,
                            content_type = site_content[content].contenttypeId,
                            optimal_checker = false;

                        /*for (let i in optimal_content) {
                            //Удаляем лишний подходящий контент
                            if (content_type == optimal_content[i]) {
                                if (optimal_content_counter[i] > 0) {
                                    request_counter++;
                                    setTimeout( function() {
                                        $.ajax({
                                            url: 'https://game.web-tycoon.com/api/content/' + player_id + '/' + site_id + '/' + content_id + '/deleteOffer?access_token=' + token + '&ts=' + ts,
                                            type: 'delete'
                                        });
                                    }, request_counter * global_timer);
                                }

                                if (optimal_content_counter[i] == 0) {
                                    optimal_content_counter[i] += 1;
                                }
                            }
                        }

                        //Удаляем неподходящий контент
                        if (content_type > 4) {
                            request_counter++;
                            setTimeout( function() {
                                $.ajax({
                                    url: 'https://game.web-tycoon.com/api/content/' + player_id + '/' + site_id + '/' + content_id + '/deleteOffer?access_token=' + token + '&ts=' + ts,
                                    type: 'delete'
                                });
                            }, request_counter * global_timer);
                        }*/

                        for (let i in optimal_content) {
                            if (content_type == optimal_content[i]) {
                                optimal_checker = true;
                            }
                        }

                        if (optimal_checker == false) {
                            request_counter++;
                            setTimeout( function() {
                                $.ajax({
                                    url: 'https://game.web-tycoon.com/api/content/' + player_id + '/' + site_id + '/' + content_id + '/deleteOffer?access_token=' + token + '&ts=' + ts,
                                    type: 'delete'
                                });
                            }, request_counter * global_timer);
                        }
                    }
                }
            }
        }
    }


    //Функция отмены отпуска в случае 100% энергии
    function vacation_return() {
        for (let task in data.tasks) {
            let task_type_id = data.tasks[task].tasktypeId;

            if (task_type_id == 23) {
                let task_worker_id = data.tasks[task].workers[0];

                for (let worker in data.workers) {
                    let worker_id = data.workers[worker].id,
                        worker_status = data.workers[worker].status,
                        worker_energy = data.workers[worker].progress.energy;

                    if (worker_id == task_worker_id && worker_status == 4 && worker_energy >= 100) {
                        let task_id = data.tasks[task].id;

                        request_counter++;
                        setTimeout( function() {
                            $.ajax({
                                url: 'https://game.web-tycoon.com/api/tasks/' + player_id + '/' + task_id + '/' + worker_id + '/cancelVacation?access_token=' + token + '&ts=' + ts,
                                type: 'post'
                            });
                        }, request_counter * global_timer);

                    }
                }
            }
        }
    }


    //Функция спасения зависшего работника
    function task_restarter() {
        //Защита от пустого значения data_previous
        if (data_previous === null || typeof data_previous == 'undefined') { return; }

        for (let task in data.tasks) {
            let task_type = data.tasks[task].tasktypeId,
                task_site_id = data.tasks[task].siteId;

            if (task_type <= 4 && task_type >= 1) {
                let task_worker_id = data.tasks[task].workers[0];

                for (let site in data.sites) {
                    let site_id = data.sites[site].id;

                    if (site_id == task_site_id){
                        let site_progress = data.sites[site].progress,
                            site_limit = data.sites[site].limit,
                            site_progress_previous = data_previous.sites[site].progress,
                            task_scope = data.tasks[task].scope,//текстовое название вида работ, нужно для верного сопоставления на сайте
                            task_id = data.tasks[task].id;

                        //Проверяем прогресс по таскам. Если нет движения, то сбрасываем работника и переназначаем
                        if (site_progress[task_scope] == site_progress_previous[task_scope] && site_progress[task_scope] != site_limit[task_scope]) {
                            request_counter++;
                            setTimeout( function() {
                                $.ajax({
                                    url: 'https://game.web-tycoon.com/api/sites/' + player_id + '/' + task_site_id + '/' + task_worker_id + '?access_token=' + token + '&ts=' + ts,
                                    type: 'delete',
                                    data: 'taskId=' + task_id
                                })
                            }, request_counter * global_timer);

                            request_counter += 5;
                            setTimeout( function() {
                                $.ajax({
                                    url: 'https://game.web-tycoon.com/api/sites/' + player_id + '/' + site_id + '/' + task_type + '/addTask?access_token=' + token + '&ts=' + ts,
                                    type: 'post',
                                    data: 'workerIds=[' + task_worker_id + ']'
                                });
                            }, request_counter * global_timer);

                            //Выполняем задачу только один раз, т.к. большое повышение request_counter может сделать исполнение слишком долгим
                            return;
                        }
                    }
                }
            }
        }
    }


    //Функция поиска контрактов
    function contract_search() {
        //Версия для request_data
        /*let task_checker = true;

        for (let task in data.tasks) {
            let task_type_id = data.tasks[task].tasktypeId;

            if (task_type_id == 37) {
                task_checker = false;
            }
        }
        if (task_checker == true) {
            let contract_slots = data.person.questSlots;

            if (data.person.questContracts.length < contract_slots) {
                $.ajax({
                    url: 'https://game.web-tycoon.com/api/questContract/findOffers/' + player_id + '/1?access_token=' + token + '&ts=' + ts,
                    type: 'post'
                })
            }
        }*/

        //Версия для интервала
        let contract_slots = data.person.questSlots;

        ts = +($.now() / 1000).toFixed();//Обновляем время

        if (data.person.questContracts.length < contract_slots) {
            $.ajax({
                url: 'https://game.web-tycoon.com/api/questContract/findOffers/' + player_id + '/1?access_token=' + token + '&ts=' + ts,
                type: 'post'
            })
        }
    }


    //Функция удаления заданий без биткоинов
    function contract_delete_non_btc() {
        for (let contract in data.person.questContracts) {
            let btc_prize = data.person.questContracts[contract].questContractType.prizeBtc,
                contract_status = data.person.questContracts[contract].status;

            if (btc_prize == null && contract_status == 1) {
                let contract_id = data.person.questContracts[contract].id;

                request_counter++;
                setTimeout( function() {
                    $.ajax({
                        url: 'https://game.web-tycoon.com/api/questContract/' + player_id + '/' + contract_id + '/delete?access_token=' + token + '&ts=' + ts,
                        type: 'delete'
                    });
                }, request_counter * global_timer);
            }
        }
    }


    //Функция майнинга биткоинов на заданиях 2 уровня
    function quest_btc_mining(team, domain) {
       let active_quest = false;//Логическая переменная для хранения информации о том, активен ли контракт

        //Проверяем все сайты, ищем квестовый сайт
        for (let site in data.sites) {
            let site_domain = data.sites[site].domain,
                site_status = data.sites[site].status;

            //Если нашли квестовый сайт, то проверяем, работают ли над ним работники (при условии, что сайт ещё не готов к сдаче)
            if (site_domain == domain && site_status != 5) {
                active_quest = true;//Квест активен
                let site_id = data.sites[site].id,
                    site_level = data.sites[site].level;

                //Если уровень сайта меньше 20, то проверяем, занята ли команда. Назначем, если необходимо.
                if (site_level < 20) {
                    //Ищем свободного работника и отправляем пахать
                    //if (task_checker == false) {
                        for (let worker in data.workers) {
                            let worker_id = data.workers[worker].id,
                                worker_status = data.workers[worker].status,
                                worker_energy = data.workers[worker].progress.energy;

                            for (let i in team) {
                                if (worker_id == team[i] && worker_status == 1 && worker_energy >= min_energy) {
                                    request_counter++;
                                    setTimeout( function() {
                                        $.ajax({
                                            url: 'https://game.web-tycoon.com/api/sites/' + player_id + '/' + site_id + '/' + (+i + 1) + '/addTask?access_token=' + token + '&ts=' + ts,
                                            type: 'post',
                                            data: 'workerIds=["' + worker_id + '"]'
                                        });
                                    }, request_counter * global_timer);
                                }
                            }
                        }
                    //}
                }
                //Если уровень сайта 20 или больше, то сдаём сайт
                else {
                    //Начинаем искать задание, которое и надо сдать
                    let site_theme = data.sites[site].sitethemeId;

                    for (let contract in data.person.questContracts) {
                        let contract_status = data.person.questContracts[contract].status,
                            contract_id = data.person.questContracts[contract].id,
                            contract_site_theme = data.person.questContracts[contract].sitethemeId;

                        //Если контракт активен и подходит под сайт, то сдаём сайт
                        if (contract_status == 2 && contract_site_theme == site_theme) {
                            request_counter++;
                            setTimeout( function() {
                                $.ajax({
                                    url: 'https://game.web-tycoon.com/api/questContract/' + player_id + '/' + site_id + '/' + contract_id + '/finish?access_token=' + token + '&ts=' + ts,
                                    type: 'post'
                                });
                            }, request_counter * global_timer);

                        }
                    }
                }
            }
        }
        //Если сайт так и не нашли, то ищем контракт для подписания
        if (active_quest == false) {
            //Проверяем, чтобы работники были отдохнувшими
            let workers_ready = true;
            for (let worker in data.workers) {
                let worker_id = data.workers[worker].id,
                    worker_energy = data.workers[worker].progress.energy,
                    worker_status = data.workers[worker].status;

                for (let i in team) {
                    if (worker_id == team[i] && (worker_energy < min_energy || worker_status != 1)) {
                        workers_ready = false;
                    }
                }

            }

            if (workers_ready == true) {
                for (let contract in data.person.questContracts) {
                    let btc_prize = data.person.questContracts[contract].questContractType.prizeBtc,
                    contract_status = data.person.questContracts[contract].status;

                    if (btc_prize != null && contract_status == 1) {
                        let contract_id = data.person.questContracts[contract].id,
                            contract_site_theme = data.person.questContracts[contract].sitethemeId;

                        //Подписываем контракт
                        request_counter++;
                        setTimeout( function() {
                            $.ajax({
                                url:'https://game.web-tycoon.com/api/questContract/' + player_id + '/' + contract_id + '/1?access_token=' + token + '&ts=' + ts,
                                type: 'post'
                            })
                        }, request_counter * global_timer);

                        //Создаём сайт в соответствии с контрактом
                        request_counter++;
                        setTimeout( function() {
                            $.ajax({
                                url:'https://game.web-tycoon.com/api/users/' + player_id + '/sites?access_token=' + token + '&ts=' + ts,
                                type: 'post',
                                data: {"domain": domain,"sitetypeId":3,"sitethemeId": contract_site_theme,"engineId":7,"domainzoneId":1}
                            })
                        }, request_counter * global_timer);

                        return;
                    }
                }
            }
        }
    }


    //Функция смены коэфов
    function koef_changer() {
        for (let site in data.sites) {
            let site_id = data.sites[site].id,
                site_level = data.sites[site].level,
                site_kf = data.sites[site].kfParam,//Коэффициенты сайта
                site_status = data.sites[site].status;

            //Проверяем и перепланируем, если необходимо
            if (site_kf.custom == false && site_level >= 1 && site_status != 5) {
                request_counter++;
                setTimeout( function() {
                    $.ajax({
                        url: 'https://game.web-tycoon.com/api/sitekfparams/' + player_id + '/' + site_id + '/add?access_token=' + token + '&ts=' + ts,
                        type: 'post',
                        data: 'params={"design":33,"frontend":33,"backend":34}'
                    })
                }, request_counter * global_timer);
            }
        }
    }


    //Обновление гаджетов, если закончились
    //Если count=1 (количество товара) либо длина меньше 8 (число товаров), то обновляем
    function gadget_market_refresh() {
        let gadget_length = data.gadgetMarket.gadgetThings.length;

        for (let gadget in data.gadgetMarket.gadgetThings) {
            let gadget_count = data.gadgetMarket.gadgetThings[gadget].count;

            if (gadget_count == 1 || gadget_length < 8) {
                request_counter++;
                setTimeout( function() {
                    $.ajax({
                        url:'https://game.web-tycoon.com/api/gadget/' + player_id + '/resetMarket?access_token=' + token + '&ts=' + ts,
                        type: 'post'
                    });
                }, request_counter * global_timer);

                return;
            }
        }
    }


    //Функция автопрокачки сайтов на движке Вебдог
    function auto_webdog_creator(team, domain, target_level) {
        let active_site = false;//Логическая переменная для хранения информации о том, активен ли контракт

        //Проверяем все сайты, ищем сайт
        for (let site in data.sites) {
            let site_domain = data.sites[site].domain,
                site_status = data.sites[site].status;

            //Если нашли сайт, то проверяем, работают ли над ним работники (при условии, что сайт ещё не готов к сдаче)
            if (site_domain == domain && site_status != 5) {
                active_site = true;//Квест активен
                let site_id = data.sites[site].id,
                    site_level = data.sites[site].level,
                    site_kf = data.sites[site].kfParam;//Коэффициенты сайта

                //Если уровень сайта меньше target_level, то проверяем, занята ли команда. Назначем, если необходимо.
                if (site_level < target_level) {
                    //Ищем свободного работника и отправляем пахать
                    //if (task_checker == false) {
                        for (let worker in data.workers) {
                            let worker_id = data.workers[worker].id,
                                worker_status = data.workers[worker].status,
                                worker_energy = data.workers[worker].progress.energy;

                            for (let i in team) {
                                if (worker_id == team[i] && worker_status == 1 && worker_energy >= min_energy) {
                                    request_counter++;
                                    setTimeout( function() {
                                        $.ajax({
                                            url: 'https://game.web-tycoon.com/api/sites/' + player_id + '/' + site_id + '/' + (+i + 1) + '/addTask?access_token=' + token + '&ts=' + ts,
                                            type: 'post',
                                            data: 'workerIds=["' + worker_id + '"]'
                                        });
                                    }, request_counter * global_timer);
                                }
                            }
                        }
                    //}
                }

                //Проверяем и перепланируем, если необходимо
                if (site_kf.custom == false && site_level >= 1 && site_status != 5) {
                    request_counter++;
                    setTimeout( function() {
                        $.ajax({
                            url: 'https://game.web-tycoon.com/api/sitekfparams/' + player_id + '/' + site_id + '/add?access_token=' + token + '&ts=' + ts,
                            type: 'post',
                            data: 'params={"design":34,"frontend":33,"backend":33}'
                        })
                    }, request_counter * global_timer);
                }


                //Если уровень сайта target_level или больше, то удаляем сайт
                else {
                    request_counter++;
                    setTimeout( function() {
                        $.ajax({
                            url: 'https://game.web-tycoon.com/api/sites/' + player_id + '/' + site_id + '?access_token=' + token + '&ts=' + ts,
                            type: 'delete'
                        });
                    }, request_counter * global_timer);

                }
            }
        }
        //Если сайт так и не нашли, то создаём новый
        if (active_site == false) {
            //Проверяем, чтобы работники были отдохнувшими
            let workers_ready = true;
            for (let worker in data.workers) {
                let worker_id = data.workers[worker].id,
                    worker_energy = data.workers[worker].progress.energy,
                    worker_status = data.workers[worker].status;

                for (let i in team) {
                    if (worker_id == team[i] && (worker_energy < min_energy || worker_status != 1)) {
                        workers_ready = false;
                    }
                }

            }

            if (workers_ready == true) {
                request_counter++;
                setTimeout( function() {
                    $.ajax({
                        url:'https://game.web-tycoon.com/api/users/' + player_id + '/sites?access_token=' + token + '&ts=' + ts * 1000,
                        type: 'post',
                        contentType: 'application/json;charset=utf-8',
                        //data: {"domain": domain,"sitetypeId":3,"sitethemeId":1,"domainzoneId":1}
                        data: {"domain": domain,"sitetypeId":3,"sitethemeId":1,"engineId":7,"domainzoneId":1}
                        //data: 'domain=' + domain + '&sitetypeId=3&sitethemeId=1&engineId=7&domainzoneId=1'
                    });
                }, request_counter * global_timer);
            }
        }
    }

    //Функция автопрокачки существующих сайтов
    function make_site(team, domain) {
        //Проверяем все сайты, ищем сайт
        for (let site in data.sites) {
            let site_domain = data.sites[site].domain,
                site_status = data.sites[site].status;

            //Если нашли сайт, то проверяем, работают ли над ним работники (при условии, что сайт ещё не готов к сдаче)
            if (site_domain == domain && site_status != 5) {
                let site_id = data.sites[site].id;

                //Ищем свободного работника и отправляем пахать
                for (let worker in data.workers) {
                    let worker_id = data.workers[worker].id,
                        worker_status = data.workers[worker].status,
                        worker_energy = data.workers[worker].progress.energy;

                    for (let i in team) {
                        if (worker_id == team[i] && worker_status == 1 && worker_energy >= min_energy) {
                            request_counter++;
                            setTimeout( function() {
                                $.ajax({
                                    url: 'https://game.web-tycoon.com/api/sites/' + player_id + '/' + site_id + '/' + (+i + 1) + '/addTask?access_token=' + token + '&ts=' + ts,
                                    type: 'post',
                                    data: 'workerIds=["' + worker_id + '"]'
                                });
                            }, request_counter * global_timer);
                        }
                    }
                }
            }
        }
    }


    //Функция поения работников энергетиком
    function energizer(team) {
        for (let worker in data.workers) {
            let worker_id = data.workers[worker].id,
                worker_energy = data.workers[worker].progress.energy;

            for (let i in team) {
                if (worker_id == team[i] && worker_energy < min_energy) {
                    for (let energizer in data.energyMarket.energyThings) {
                        let energizer_value = data.energyMarket.energyThings[energizer].energyValue,
                            energizer_id = data.energyMarket.energyThings[energizer].id;

                        if (energizer_value == 100) {
                            request_counter++;
                            setTimeout( function() {
                                $.ajax({
                                    url: 'https://game.web-tycoon.com/api/energy/' + worker_id + '/' + energizer_id + '/buy?access_token=' + token + '&ts=' + ts,
                                    type: 'post',
                                    data: 'personId=' + player_id + ''
                                });
                            }, request_counter * global_timer);
                        }
                    }
                }
            }
        }
    }


    //Пополнение энергетиков в магазине
    function energy_market_refresh() {
        let energy_market_length = data.energyMarket.energyThings.length;

        for (let energizer in data.energyMarket.energyThings) {
            let energizer_count = data.energyMarket.energyThings[energizer].count;

            if (energizer_count == 1 || energy_market_length < 3) {
                request_counter++;
                setTimeout( function() {
                    $.ajax({
                        url:'https://game.web-tycoon.com/api/energy/' + player_id + '/resetMarket?access_token=' + token + '&ts=' + ts,
                        type: 'post'
                    });
                }, request_counter * global_timer);
            }
        }
    }


    //Пополнение учебных материалов
    function education_market_refresh() {
        let design_checker = false,
            frontend_checker = false,
            backend_checker = false,
            marketing_checker = false;

        for (let manual in data.educationMarket.educationThings) {
            let manual_zone = data.educationMarket.educationThings[manual].zone,
                manual_currency = data.educationMarket.educationThings[manual].currency;

            if (manual_currency == 'usd') {
                switch (manual_zone) {
                    case 'design': design_checker = true; break;
                    case 'frontend': frontend_checker = true; break;
                    case 'backend': backend_checker = true; break;
                    case 'marketing': marketing_checker = true; break;
                }
            }
        }

        //let checker = design_checker && frontend_checker && backend_checker && marketing_checker;
        let checker = marketing_checker;

        if (checker == false) {
            request_counter++;
            setTimeout( function() {
                $.ajax({
                    url:'https://game.web-tycoon.com/api/education/' + player_id + '/resetMarket?access_token=' + token + '&ts=' + ts,
                    type: 'post'
                });
            }, request_counter * global_timer);
        }
    }


    //Функция обучения сотрудников
    function teach_workers(team, education_type) {
        if (education_type == 'marketing' && content_worker_checker == true) { return; }

        for (let worker in data.workers) {
            let worker_id = data.workers[worker].id,
                worker_energy = data.workers[worker].progress.energy,
                worker_status = data.workers[worker].status;

            for (let i in team) {
                if (worker_id == team[i] && worker_energy >= min_energy && worker_status == 1) {
                    let best_manual_id = 0,
                        best_manual_exp_factor = 0;

                    for (let manual in data.educationMarket.educationThings) {
                        let manual_zone = data.educationMarket.educationThings[manual].zone,
                            manual_id = data.educationMarket.educationThings[manual].id,
                            manual_exp_factor = data.educationMarket.educationThings[manual].experienceFactor,
                            manual_currency = data.educationMarket.educationThings[manual].currency;

                        if (manual_exp_factor > best_manual_exp_factor && manual_zone == education_type && manual_currency == 'usd') {
                            best_manual_exp_factor = manual_exp_factor;
                            best_manual_id = manual_id;
                        }
                    }

                    request_counter++;
                    setTimeout( function() {
                        $.ajax({
                            url: 'https://game.web-tycoon.com/api/education/' + worker_id + '/' + best_manual_id + '/buy?access_token=' + token + '&ts=' + ts,
                            type: 'post',
                            data: 'personId=' + player_id + ''
                        });
                    }, request_counter * global_timer);
                }
            }
        }
    }


    //Функция удаления оповещений об обучении
    function delete_education_notifications() {
        //Защита от пустого значения data_previous
        if (data_previous === null || typeof data_previous == 'undefined') { return; }

        for (let notification in data.notifications) {
            let notification_id = data.notifications[notification].id,
                notification_double_checker = false;//Логическая переменная для проверки факта совпадения id двух нотификаций

            //Ищем в прошлой дате совпадение по нотификации. Если находим, то отправляем запрос на удаление
            for (let previous_notification in data_previous.notifications) {
                let previous_notification_id = data_previous.notifications[previous_notification].id;

                if (notification_id == previous_notification_id) {
                    notification_double_checker = true;

                    break;
                }
            }

            if (notification_double_checker == true) {
                request_counter++;
                setTimeout( function() {
                    $.ajax({
                        url: 'https://game.web-tycoon.com/api/notification/' + player_id + '/' + notification_id + '?access_token=' + token + '&ts=' + ts,
                        type: 'delete'
                    })
                }, request_counter * global_timer);
            }
        }
    }


    //Функция поиска нового работника
    function find_worker(worker_type) {
        for (let worker_offer in data.workerOffers) {
            let worker_skills = {
                    'backend': data.workerOffers[worker_offer].backend,
                    'frontend': data.workerOffers[worker_offer].frontend,
                    'design': data.workerOffers[worker_offer].design,
                    'marketing': data.workerOffers[worker_offer].marketing
                },
                delete_worker_checker = false,
                max_skill = 0,
                worker_id = data.workerOffers[worker_offer].id,
                high_skills = 0;

            //Удаляем воркеров с высокими скилами или несоответствующим скиллом
            for (let i in worker_skills) {
                if (worker_skills[i] > 2) {
                    high_skills += 1;
                }

                if (high_skills > 1) {
                    delete_worker_checker = true;
                }

                if (worker_skills[i] > max_skill) {
                    max_skill = worker_skills[i];
                }
            }

            //Удаляем воркера
            if (delete_worker_checker == true || max_skill > worker_skills[worker_type]) {
                request_counter++;
                setTimeout( function() {
                    $.ajax({
                        url: 'https://game.web-tycoon.com/api/workers/' + player_id + '/' + worker_id + '/deleteOffer?access_token=' + token + '&ts=' + ts,
                        type: 'delete'
                    })
                }, request_counter * global_timer);
            }
        }

        for (let task in data.tasks) {
            let task_type_id = data.tasks[task].tasktypeId;

            if (task_type_id == 35) {
                return;
            }
        }

        //Запускаем поиск воркера
        if (data.workerOffers.length < 3) {
            request_counter++;
            setTimeout( function() {
                $.ajax({
                    url: 'https://game.web-tycoon.com/api/workers/' + player_id + '/generateOffers/0?access_token=' + token + '&ts=' + ts,
                    type: 'post'
                })
            }, request_counter * global_timer);
        }
    }


    //Функция заполнения локального хранилища в конце цикла
    function refill_storage() {
        //Обрабатываем записи в объекте для хранения - удаляем оттуда старые неактуальные записи
        for (let ad_object in object_from_storage['ad_start_time']) {
            let ad_object_start_time = object_from_storage['ad_start_time'][ad_object];

            if (ad_object_start_time < ts - 4 * 24 * 60 * 60) {
                delete object_from_storage['ad_start_time'][ad_object];
            }
        }

        //Вносим в хранилище
        localStorage['web_tycoon_bot'] = JSON.stringify(object_from_storage);
    }

})();

/*
//Удаление сайта
var site_id = ''.replace(/.*sites\//g,''),
    player_id = '5c8a3a9b58bac0573292ae9a',
    token = localStorage.token,
    ts = +($.now() / 1000).toFixed();

$.ajax({
    url: 'https://game.web-tycoon.com/api/sites/' + player_id + '/' + site_id + '?access_token=' + token + '&ts=' + ts,
    type: 'delete'
});

//Создание нового сайта
var site_name = '',
    site_theme = 4,
    player_id = '5c8a3a9b58bac0573292ae9a',
    token = localStorage.token,
    ts = +($.now() / 1000).toFixed();


$.ajax({
    url:'https://game.web-tycoon.com/api/users/' + player_id + '/sites?access_token=' + token + '&ts=' + ts * 1000,
    type: 'post',
    data: {"domain": site_name,"sitetypeId":2,"sitethemeId": site_theme,"engineId":7,"domainzoneId":1}
});
 */