// ==UserScript==
// @name           hwonk's Rocket League Trader
// @version        1.00.14
// @namespace      hwonk_rl_trader
// @description    Торговый бот для RL
// @include        https://rocket-league.com/player/*
// @run-at         document-end
// @require        https://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/371883/hwonk%27s%20Rocket%20League%20Trader.user.js
// @updateURL https://update.greasyfork.org/scripts/371883/hwonk%27s%20Rocket%20League%20Trader.meta.js
// ==/UserScript==

(function () {
    var colors = {//Записываем все цвета для дальнейшей работы с интерфейсом
        'none': '#FFFFFF',
        'Burnt Sienna': '#4C1100',
        'Lime': '#7FFF00',
        'Titanium White': '#FFFFFF',
        'Cobalt': '#3F51B5',
        'Crimson': '#D50000',
        'Forest Green': '#4CAF50',
        'Grey': '#777777',
        'Orange': '#F4B400',
        'Pink': '#FF4081',
        'Purple': '#9C27B0',
        'Saffron': '#FFEB3B',
        'Sky Blue': '#03A9F4',
        'Black': '#111111'
    };
    var colorsID = {//Для дальнейшего использования при создании лота
        'none': '0',
        'Burnt Sienna': '1',
        'Lime': '2',
        'Titanium White': '3',
        'Cobalt': '4',
        'Crimson': '5',
        'Forest Green': '6',
        'Grey': '7',
        'Orange': '8',
        'Pink': '9',
        'Purple': '10',
        'Saffron': '11',
        'Sky Blue': '12',
        'Black': '13'
    };
    var colorsIDReverse = {//Для дальнейшего использования при создании комментария
        '0':'Default',
        '1':'Burnt Sienna',
        '2':'Lime',
        '3':'Titanium White',
        '4':'Cobalt',
        '5':'Crimson',
        '6':'Forest Green',
        '7':'Grey',
        '8':'Orange',
        '9':'Pink',
        '10':'Purple',
        '11':'Saffron',
        '12':'Sky Blue',
        '13':'Black'
    };

    localStorage.setItem('isWorking', 'no');//очистка состояния скрипта в случае перезагрузки страницы
    var init = 0;//флаг для проверки инициализации
    var csrfToken = csrf_token;//инициализация токена
    var playerID = window.location.href.replace('https://rocket-league.com/player/','');//Логин игрока

    //Создаём кнопку для запуска скрипта
    var buttonStart = $('<button id="buttonStart">').append('Запустить скрипт').on('click', function() {
        if (localStorage.getItem('isWorking') == 'no' && init == 0)
        {
            initScript();
        }
    });
    $('.rlg-header-main').before('<div id="scriptDiv" style="font-family: arial;"></div>');
    $('#scriptDiv').append(buttonStart);//размещаем кнопку запуска

    //Функция инициализации - создание дополнительных кнопок, скачивание инвентаря и т.д.
    function initScript() {
        init = 1;//инициализация прошла, смена флага

        //Вывод состояния скрипта
        var scriptState = $('<span id="state">').text('Скрипт запущен');

        //Кнопка запуска торговли
        var buttonTrade = $('<button id="buttonTrade">').append('Начать торговлю').on('click', function() {
            if (localStorage.getItem('isWorking') == 'no') {
                localStorage.setItem('isWorking', 'yes');//В localStorage записываем переменную о работе скрипта
                startTrading();
                scriptState.text('Запущена торговля');

                //Остановка торговли по таймеру
                var stop_timer = +JSON.parse(localStorage["stop_timer"]);
                if (stop_timer > 0){
                    setTimeout(function() { localStorage.setItem('isWorking', 'no'); scriptState.text('Торговля автоматически остановлена'); }, stop_timer * 1000);
                }
            }
        });

        //Кнопка остановки торговли
        var buttonStop = $('<button id="buttonStop">').append('Остановить торговлю').on('click', function() {
            if (localStorage.getItem('isWorking') == 'yes') {
                localStorage.setItem('isWorking', 'no');//Обновляем переменную в хранилище, останавливаем торговлю
                scriptState.text('Торговля остановлена.');
            }
            //$('#itemTable').remove();
            //$('#spanTable').remove();
            //$('#buttonHideOrShow').remove();
            //loadItems();
        });

        var buttonDeleteTrades = $('<button id="buttonDeleteTrades">').append('Удалить активные лоты').on('click', function() {
            deleteTrades();
        });

        //Проверка на наличие дефолтных настроек
        if (!localStorage["timer_between_trades"]) {
            localStorage.setItem('timer_between_trades', '40');
        }
        if (!localStorage["timer_between_trades_random"]) {
            localStorage.setItem('timer_between_trades_random', '20');
        }
        if (!localStorage["timer_delete"]) {
            localStorage.setItem('timer_delete', '600')
        }
        if (!localStorage["timer_delete_random"]) {
            localStorage.setItem('timer_delete_random', '60');
        }
        if (!localStorage["default_note"]) {
            localStorage.setItem('default_note','I DO ACCEPT KEYS ONLY');
        }
        if (!localStorage["stop_timer"]) {
            localStorage.setItem('stop_timer','900');
        }

        //Область управления настройками
        var settingsArea = $(`<div id="settingsDiv" style="border: 1px solid gray; padding: 15px; margin: 15px;">
        <div style="float: left;"><span>Время работы скрипта, в сек</span></div>&nbsp
        <input type="text" class="inputTradesSettings" id="stop_timer" size="3" value="` + +JSON.parse(localStorage["stop_timer"]) + `">
        <br>
        <div style="float: left;"><span>Интервал между созданием лотов, в сек</span></div>&nbsp
        <input type="text" class="inputTradesSettings" id="timer_between_trades" size="3" value="` + +JSON.parse(localStorage["timer_between_trades"]) + `">
        <br>
        <div style="float: left;"><span>Рандом между созданием лотов, в сек</span></div>&nbsp
        <input type="text" class="inputTradesSettings" id="timer_between_trades_random" size="3" value="` + +JSON.parse(localStorage["timer_between_trades_random"]) + `">
        <br>
        <div style="float: left;"><span>Время до удаления лота, в сек</span></div>&nbsp
        <input type="text" class="inputTradesSettings" id="timer_delete" size="3" value="` + +JSON.parse(localStorage["timer_delete"]) + `">
        <br>
        <div style="float: left;"><span>Рандом удаления лота, в сек</span></div>&nbsp
        <input type="text" class="inputTradesSettings" id="timer_delete_random" size="3" value="` + +JSON.parse(localStorage["timer_delete_random"]) + `">
        <br>
        <div><span>Текст, добавляемый ко всем лотам</span></div>
        <textarea style="width: 600px;" class="inputTradesSettings" id="default_note">` + localStorage["default_note"].replace(/"/g,'') + `</textarea>
        </div>`);

        $('#buttonStart').after(buttonTrade,buttonStop,buttonDeleteTrades,settingsArea).before(scriptState,'<br>');


        //При изменении настроек сохранение их в хранилище
        $('.inputTradesSettings').on('change', function() {
            var id = $(this).attr('id');
            var value = $(this).prop('value');

            var obj = JSON.stringify(value);
            //console.log(obj);

            localStorage.setItem(id, obj);
        })

        //Загрузка списка предметов
        loadItems();
    }

    //Функция загрузки списка товаров
    function loadItems() {
        //getToken();//Обновление токена
        $.ajax({
            url: 'https://rocket-league.com/functions/updatePricingPref.php',
            async: true,
            type: 'post',
            data: 'csrf_token=' + csrfToken + '&price=1&urlref=newtrade',
            dataType: 'html',
            success: function(html){
                $('#state').text('Предметы загружены.');

                var storage = $(html);
                var id, name, separator, minPrice = 0, maxPrice = 0, matcher, isHidden = 'true', img;

                //Таблица со всеми вещами
                var itemTable = $('<div id="itemTable" style="/*display: flex; width: 100%; flex-wrap: wrap;*/">');
                $('#settingsDiv').after('<span id="spanTable">Таблица с вещами<br></span>',itemTable);

                var buttonHideOrShow = $('<button id="buttonHideOrShow">').text('Показать таблицу').on('click', function() {
                    if (isHidden == 'false') { $('#itemTable').hide(); $('#buttonHideOrShow').text('Показать таблицу'); isHidden = 'true'; return; }//Скрываем таблицу, меняем кнопку и флаг
                    if (isHidden == 'true') { $('#itemTable').show(); $('#buttonHideOrShow').text('Скрыть таблицу'); isHidden = 'false'; }
                });
                itemTable.before(buttonHideOrShow);//размещаем кнопку сокрытия таблицы

                var uncheckAllButton = $('<button id="uncheckAll">').text('Убрать все галки').on('click', function() {
                    uncheckAll();
                })
                itemTable.before(uncheckAllButton);

                //Прячем таблицу
                itemTable.hide();

                //Таблица с торгуемыми вещами
                var tradeTable = $('<span>Таблица торгуемых вещей</span><br><div id="tradeTable" style="display: flex; width: 100%; flex-wrap: wrap;"></div>');

                //Кнопка инвертирования
                var invertButton = $('<button id="invertCheckbox">').text('Инвертировать галки').on('click', function() {
                    invertCheckbox();
                })

                //Кнопка "Раскрыть все" для второй таблицы
                let showAllButton = $('<button id="showAllButton">').text('Раскрыть все').on('click', function() {
                    $('[id*="tradingListDiv"]').show();
                    $('[id*="tradeSectionBody"]').attr('isHidden', 'false');
                })

                //Кнопка "Спрятать все" для второй таблицы
                let hideAllButton = $('<button id="hideAllButton">').text('Спрятать все').on('click', function() {
                    $('[id*="tradingListDiv"]').hide();
                    $('[id*="tradeSectionBody"]').attr('isHidden', 'true');
                })

                itemTable.after('<br>',tradeTable);
                $('#tradeTable').before(invertButton, showAllButton, hideAllButton);


                //Счётчик выставленных лотов
                let counter = $('<div id="counter" style="position: fixed; right: 0; top: 5px; background-color: white; font-size: 12px; line-height: 1em;"></div>');
                counter.append(`<div id="counter-total" style="display: flex; justify-content: flex-end;">
                    <span>Всего:&nbsp</span>
                    <span id="counter-total-sell" style="background-color: #FEAFAF; min-width: 40px;">0</span>
                    <span id="counter-total-buy" style="background-color: #AFFECB; min-width: 40px;">0</span>
                </div>`);

                $('#scriptDiv').append(counter);

                storage.find('.rlg-trade-selector-section').each(function() {
                    var sectionName = $(this).children('span').eq(0).text();
                    let sectionNameShorten = sectionName.replace(/\s/g,'');

                    var sectionHeader = $('<br><span id="sectionName-' + sectionNameShorten + '" style="font-size: 20px; font-weight: bold;">' + sectionName + '</span><br>');
                    var section = $('<div id="sectionBody-' + sectionNameShorten + '" style="display: flex; width: 100%; flex-wrap: wrap;" isHidden="true"></div>');

                    let tradeSectionHeader = $('<span id="tradeSectionName-' + sectionNameShorten + '" style="font-size: 24px; font-weight: bold;">' + sectionName + '</span>');
                    let tradeSection = $('<div id="tradeSectionBody-' + sectionNameShorten + '" style="display: flex; width: 100%; flex-wrap: wrap; margin: 15px 0px;" isHidden="false"></div>');


                    let sectionCounter = $(`<div id="counter-` + sectionNameShorten + `" style="display: flex; justify-content: flex-end;">
                        <span>` + sectionName + `:&nbsp</span>
                        <span id="counter-` + sectionNameShorten + `-sell" style="background-color: #FEAFAF; min-width: 40px;">0</span>
                        <span id="counter-` + sectionNameShorten + `-buy" style="background-color: #AFFECB; min-width: 40px;">0</span>
                    </div>`);
                    sectionCounter.hide();
                    counter.append(sectionCounter);


                    itemTable.append(sectionHeader,section);
                    $('#tradeTable').append(tradeSectionHeader,tradeSection);


                    $(this).children('.rlg-trade-selector-item').each(function() {
                        //сброс ценников
                        minPrice = 0;
                        maxPrice = 0;

                        img = $(this).children('img').attr('src');
                        id = $(this).attr('data-item');//id вещи для дальнейших операций
                        separator = $(this).children().eq(0).text().lastIndexOf('\n');//место разделения названия и стоимости
                        name = $(this).children().eq(0).text().substring(1, separator);//название вещи
                        matcher = $(this).children().eq(0).text().substring(separator+1).match(/[\d.]+/g);//Вытаскиваем цены
                        if (matcher) {
                            minPrice = matcher[0];//нижняя граница цены
                            maxPrice = matcher[1];//верхняя граница
                        }

                        //Создаём объект для хранения информации о товаре. Скачиваем из хранилища, обновляем ценники
                        var obj = {};
                        if (!localStorage.getItem(id) == false){
                            obj = JSON.parse(localStorage.getItem(id));
                        }
                        obj["o_name"] = name;
                        obj["o_minPrice"] = minPrice;
                        obj["o_maxPrice"] = maxPrice;
                        obj["o_img_src"] = img;
                        obj["o_section"] = sectionNameShorten;

                        var serialObj = JSON.stringify(obj);
                        localStorage.setItem(id, serialObj);

                        section.append(`<div style="width: 10%; min-width: 100px;" class="itemTable-item"><div style="padding: 15px; text-align: center; height: 100%;"><span>` + name + `</span>
                        <br>
                        <input id="checkBox-` + id + `" class="traderCheckBox" type="checkbox" item-id="` + id + `"></div></div>`)

                        //Сразу заполняем таблицу с торгуемыми вещами
                        if (JSON.parse(localStorage.getItem(id))["tradeList"] == 'yes') {
                            $('#checkBox-' + id).prop('checked', true);//если запомнена торговля, то поставить галку
                            $('#checkBox-' + id).parent().css('font-weight','bold');
                            toTradeList(id, true);//добавляем в таблицу торгуемых предметов
                        }
                    })

                    section.children('.itemTable-item').hide();

                    //При нажатии на название секции она скрывается (код для обеих таблиц)
                    $('[id="sectionName-' + sectionNameShorten + '"]').on('click', function() {
                        let sectionBody = $('[id="sectionBody-' + sectionNameShorten + '"]');
                        if (sectionBody.attr('isHidden') == 'true') {
                            sectionBody.children('.itemTable-item').show();
                            sectionBody.attr('isHidden', 'false');
                        }
                        else {
                            sectionBody.children('.itemTable-item').hide();
                            sectionBody.attr('isHidden', 'true');
                        }
                    })

                    $('[id="tradeSectionName-' + sectionNameShorten + '"]').on('click', function() {
                        let sectionBody = $('[id="tradeSectionBody-' + sectionNameShorten + '"]');
                        if (sectionBody.attr('isHidden') == 'true') {
                            sectionBody.children('[id*="tradingListDiv"]').show();
                            sectionBody.attr('isHidden', 'false');
                        }
                        else {
                            sectionBody.children('[id*="tradingListDiv"]').hide();
                            sectionBody.attr('isHidden', 'true');
                        }
                    })
                });

                //К чекбоксам привязываем событие по клику для добавления в список на торговлю
                $('.traderCheckBox').on('click', function() {
                    id = $(this).attr('item-id');
                    if ($('#checkBox-' + id).parent().css('font-weight') == '700') $('#checkBox-' + id).parent().css('font-weight','normal');
                    else $('#checkBox-' + id).parent().css('font-weight','bold');
                    traderCheckboxClick($(this).prop('checked'), id);
                })
            },
            error: function() {
                $('#state').text('Ошибка загрузки предметов. Повторная отправка запроса.')
                setTimeout(function() {loadItems()}, 5000);
            }
            /*statusCode: {
                500: function() {
                    $('#state').text('Ошибка загрузки предметов. Повторная отправка запроса.')
                    setTimeout(function() {loadItems()}, 5000);
                },
                522: function() {
                    $('#state').text('Ошибка загрузки предметов. Повторная отправка запроса.')
                    setTimeout(function() {loadItems()}, 5000);
                }
            }*/
        });
    }

    function traderCheckboxClick(isChecked, id) {
        //console.log(isChecked,id);
        var serialObj = localStorage.getItem(id);//получаем текущий предмет из хранилища
        var returnObj = JSON.parse(serialObj);

        if (isChecked) {
            returnObj["buyPrice"] = returnObj["o_minPrice"];
            returnObj["sellPrice"] = returnObj["o_maxPrice"];
            returnObj["tradeList"] = 'yes';//задаём цену покупки и продажи, разрешаем торговлю
        }
        else {
            returnObj["tradeList"] = 'no';//запрещаем торговлю
        }

        serialObj = JSON.stringify(returnObj);
        localStorage.setItem(id, serialObj);
        //console.log(localStorage.getItem(id));

        toTradeList(id, isChecked);//добавляем в таблицу торгуемых предметов
    }

    function toTradeList(id, flag) {
        if (flag) {
            var serialObj = localStorage.getItem(id);//получаем текущий предмет из хранилища
            var returnObj = JSON.parse(serialObj);

            //Создаём карточки товаров
            $('#tradeTable > [id="tradeSectionBody-' + returnObj['o_section'] + '"]').append(`<div id="tradingListDiv-` + id + `" style="padding: 15px; /*text-align: center;*/ width: 100%; /*min-width: 400px;*/">
            <div id="hideItem-` + id + `" isHidden="false">
            <span style="font-weight: bold;">` + returnObj["o_name"] + `</span>
            <img src="` + returnObj["o_img_src"] + `" style="height: 140px; width: 140px;">
            <span style="display: none;" class="id-span">` + id + `</span>
            <br><span>Цены: покупка: ` + returnObj["o_minPrice"] + ` || продажа: ` + returnObj["o_maxPrice"] + `</span><br></div></div>`);

            $('#tradingListDiv-' + id).append('<div id="tradingListTable-' + id + '" style="display: flex; width: 100%;"><div class="left" style="min-width:250px;"></div><div class="right" style="display: flex; width: 100%; flex-wrap: wrap;"></div></div>');

            //console.log(colors);
            //Перебираем все цвета и добавляем в блок, созданный выше
            for (var key in colors){
                //console.log(key);
                //В случае, если параметры не заданы, то задаём их
                if (!returnObj[key]) {
                    //console.log('kek');
                    returnObj[key] = {};
                    //console.log(returnObj[key]);
                    if (!returnObj[key]["buyPrice"]) returnObj[key]["buyPrice"] = '';
                    if (!returnObj[key]["sellPrice"]) returnObj[key]["sellPrice"] = '';
                    if (!returnObj[key]["buy_amount"]) returnObj[key]["buy_amount"] = '';
                    if (!returnObj[key]["sell_amount"]) returnObj[key]["sell_amount"] = '';
                    if (!returnObj[key]["sell_isTrading"]) returnObj[key]["sell_isTrading"] = 'no';
                    if (!returnObj[key]["buy_isTrading"]) returnObj[key]["buy_isTrading"] = 'no';
                    //console.log(returnObj[key]);
                }

                //Вертикальный вариант размещения
                /*$('#tradingListTable-' + id).append(`<div style="border: 1px solid gray; text-align: left; padding-top: 5px;">
                <div><div style="width: 15px; height: 15px; outline: 1px solid gray; float: left; margin-right: 10px; background-color: ` + colors[key] + `;"></div>` + key + `</div>
                <div style="display: flex; width: 100%:">
                <div style="width: 50%; padding: 5px; border: 1px solid gray">
                <div style="min-width: 70px; float: left;"><span>Продажа</span></div>&nbsp
                <input class="checkbox-trade ` + id + ` ` + key + `" item-id="` + id + `" item-key="` + key + `"  checkbox-type="sell" type="checkbox">
                <br>
                <span>Цена</span>&nbsp
                <input type="text" class="inputPrice" item-id="` + id + `" item-key="` + key + `" trade-type="sell" size="3" value="` + returnObj[key]["sellPrice"] + `">
                <br>
                <span>Кол-во</span>&nbsp
                <input type="text" class="inputAmount" item-id="` + id + `" item-key="` + key + `" trade-type="sell" size="2" value="` + returnObj[key]["sell_amount"] + `">
                </div>
                <div style="width: 50%; padding: 5px; border: 1px solid gray">
                <div style="min-width: 70px; float: left;"><span>Покупка</span></div>&nbsp
                <input class="checkbox-trade ` + id + ` ` + key + `" item-id="` + id + `" item-key="` + key + `" checkbox-type="buy" type="checkbox">
                <br>
                <span>Цена</span>&nbsp
                <input type="text" class="inputPrice" item-id="` + id + `" item-key="` + key + `" trade-type="buy" size="3" value="` + returnObj[key]["buyPrice"] + `">
                <br>
                <span>Кол-во</span>&nbsp
                <input type="text" class="inputAmount" item-id="` + id + `" item-key="` + key + `" trade-type="buy" size="2" value="` + returnObj[key]["buy_amount"] + `">
                </div>
                </div>
                </div>`);*/

                //Горизонтальный вариант
                var keyBlock = $(`<div style="border: 1px solid gray; text-align: left; padding-top: 5px;">
                <div><div style="width: 15px; height: 15px; outline: 1px solid gray; float: left; margin-right: 10px; background-color: ` + colors[key] + `;"></div>` + key + `</div>
                <div style="display: flex; width: 100%;" class="divKeyTrading">
                <div style="width: 50%; padding: 5px; border: 1px solid gray">
                <div style="min-width: 70px; float: left;"><span>Продажа</span></div>&nbsp
                <input class="checkbox-trade ` + id + ` ` + key + `" item-id="` + id + `" item-key="` + key + `"  checkbox-type="sell" type="checkbox">
                <br>
                <span>Цена</span>&nbsp
                <input type="text" class="inputPrice" item-id="` + id + `" item-key="` + key + `" trade-type="sell" size="3" value="` + returnObj[key]["sellPrice"] + `">
                <br>
                <span>Кол-во</span>&nbsp
                <input type="text" class="inputAmount" item-id="` + id + `" item-key="` + key + `" trade-type="sell" size="2" value="` + returnObj[key]["sell_amount"] + `">
                </div>
                <div style="width: 50%; padding: 5px; border: 1px solid gray">
                <div style="min-width: 70px; float: left;"><span>Покупка</span></div>&nbsp
                <input class="checkbox-trade ` + id + ` ` + key + `" item-id="` + id + `" item-key="` + key + `" checkbox-type="buy" type="checkbox">
                <br>
                <span>Цена</span>&nbsp
                <input type="text" class="inputPrice" item-id="` + id + `" item-key="` + key + `" trade-type="buy" size="3" value="` + returnObj[key]["buyPrice"] + `">
                <br>
                <span>Кол-во</span>&nbsp
                <input type="text" class="inputAmount" item-id="` + id + `" item-key="` + key + `" trade-type="buy" size="2" value="` + returnObj[key]["buy_amount"] + `">
                </div>
                </div>
                </div>`);

                if (key == 'none') {
                    $('#tradingListTable-' + id).children('.left').append(keyBlock);
                }
                else {
                    $('#tradingListTable-' + id).children('.right').append(keyBlock);
                }

                //Добавляем галки чекбоксам
                $('[class="checkbox-trade ' + id + ' ' + key + '"]').each(function() {
                    var type = $(this).attr('checkbox-type');

                    if (returnObj[key][type + "_isTrading"] == "yes") {
                        $(this).prop('checked', true);
                        if (type == 'buy') {
                            $('[class="checkbox-trade ' + id + ' ' + key + '"]').eq(1).parent().css('background-color', '#AFFECB');
                        }
                        if (type == 'sell') {
                            $('[class="checkbox-trade ' + id + ' ' + key + '"]').eq(0).parent().css('background-color', '#FEAFAF');
                        }
                    }
                    //console.log('Галка установлена для ' + returnObj);
                })
            }

            //Записываем в хранилище информацию о предметах
            //console.log(returnObj);
            serialObj = JSON.stringify(returnObj);
            //console.log(serialObj);
            //console.log(id);
            localStorage.setItem(id, serialObj);
            //setTimeout(function() {localStorage.setItem(id, serialObj);}, 250);//по неизвестной мне причине без задержки результат не записывается

            //При клике по блоку с названием прячем предмет
            $('[id="hideItem-' + id + '"] > img').on('click', function() {
                if ($(this).parent().attr('isHidden') == 'true') {
                    $(this).parent().parent().children('[id*="tradingListTable"]').show();
                    $(this).parent().attr('isHidden', 'false');
                }
                else {
                    $(this).parent().parent().children('[id*="tradingListTable"]').hide();
                    $(this).parent().attr('isHidden', 'true');
                }
            })

            //При клике на чекбокс заменяем информацию в хранилище для соответствующей операции
            $('.checkbox-trade').on('click', function() {
                id = $(this).attr('item-id');
                key = $(this).attr('item-key');
                var type = $(this).attr('checkbox-type');

                var serialObj = localStorage.getItem(id);//получаем текущий предмет из хранилища
                var returnObj = JSON.parse(serialObj);

                if (this.checked) {
                    returnObj[key][type + "_isTrading"] = "yes";

                    if (type == 'buy') {
                        $('[class="checkbox-trade ' + id + ' ' + key + '"]').eq(1).parent().css('background-color', '#AFFECB');
                    }
                    if (type == 'sell') {
                        $('[class="checkbox-trade ' + id + ' ' + key + '"]').eq(0).parent().css('background-color', '#FEAFAF');
                    }
                }
                else {
                    returnObj[key][type + "_isTrading"] = "no";

                    if (type == 'buy') {
                        $('[class="checkbox-trade ' + id + ' ' + key + '"]').eq(1).parent().css('background-color', 'white');
                    }
                    if (type == 'sell') {
                        $('[class="checkbox-trade ' + id + ' ' + key + '"]').eq(0).parent().css('background-color', 'white');
                    }
                }

                serialObj = JSON.stringify(returnObj);
                localStorage.setItem(id, serialObj);

                //Обновляем счётчик
                //tradesCounter();
            })

            //Автоформатирование для цены в таблице торговли
            $('.inputPrice').on('change', function() {
                //console.log($(this).val();
                $(this).val(function (i, v) { return v.replace(/[^\d]/g,''); });//форматирование

                //В случае обновления цены заносим новые данные в хранилище
                id = $(this).attr('item-id');
                key = $(this).attr('item-key');
                var type = $(this).attr('trade-type');

                serialObj = localStorage.getItem(id);
                returnObj = JSON.parse(serialObj);

                returnObj[key][type + "Price"] = $(this).val();

                serialObj = JSON.stringify(returnObj);
                localStorage.setItem(id, serialObj);
            })

            //Автоформатирование для количества в таблице торговли
            $('.inputAmount').on('change', function() {
                $(this).val(function (i, v) { return v.replace(/[^\d]/g,''); });//форматирование

                //В случае обновления количества заносим новые данные в хранилище
                id = $(this).attr('item-id');
                key = $(this).attr('item-key');
                var type = $(this).attr('trade-type');

                serialObj = localStorage.getItem(id);
                returnObj = JSON.parse(serialObj);

                returnObj[key][type + "_amount"] = $(this).val();

                serialObj = JSON.stringify(returnObj);
                localStorage.setItem(id, serialObj);
            })

            //Обновляем счётчик
            //tradesCounter();
        }
        else {//если чекбокс неактивен, то удаляем форму
            $('#tradingListDiv-' + id).remove();
        }
    }

    //Функция торговли
    var i = 0;//Вспомогательная переменная для отсчёта предметов в каждый лот
    var buyArrayHave = [];//Список предметов на лот покупки
    var buyArrayWant = [];
    var sellArrayHave = [];//Список на лот продажи
    var sellArrayWant = [];
    function startTrading(){
        //console.log('startTrading запущен');
        if (localStorage.getItem('isWorking') == 'yes') {
            if (i <= $('.checkbox-trade').length) {
                var obj = $('.checkbox-trade').eq(i);//Находим объекты для торговли по чекбоксу
                //console.log('i ='+i+'. Чекбокс найден')
            }
            else {//Если чекбоксы кончились, то возвращаемся в начало
                i = 0;
                //console.log(i);
                //console.log('startTrading вернулся в начало - кончились чекбоксы');
                startTrading();
                return;
            }

            if (obj.prop('checked') == true) {
                var id = obj.attr('item-id');
                var key = obj.attr('item-key');
                var type = obj.attr('checkbox-type');

                //timer - задержка между отправкой лотов
                var timer = +JSON.parse(localStorage.getItem('timer_between_trades')) * 1000 - 0.5 * +JSON.parse(localStorage.getItem('timer_between_trades_random')) * 1000 + Math.random() * 1000 * +JSON.parse(localStorage.getItem('timer_between_trades_random'));

                var serialObj = localStorage.getItem(id);//Вытаскиваем предмет из хранилища и преобразуем в объект
                var returnObj = JSON.parse(serialObj);

                if (type == 'buy'){
                    //Пополнение лота
                    //Левая часть
                    if (returnObj[key][type + 'Price'] > 1) {
                        buyArrayHave.push({"itemId":496,"paint":0,"cert":0,"quantity":returnObj[key][type + 'Price']});
                    }
                    else {
                        buyArrayHave.push({"itemId":496,"paint":0,"cert":0});
                    }
                    //Правая часть
                    if (returnObj[key][type + '_amount'] > 1) {
                        buyArrayWant.push({"itemId":id,"paint":colorsID[key],"cert":0,"quantity":returnObj[key][type + '_amount']});
                    }
                    else {
                        buyArrayWant.push({"itemId":id,"paint":colorsID[key],"cert":0});
                    }


                    if (buyArrayHave.length == 10) {//При достижении 10 предметов отправляем на создание лота, массив очищаем
                        createLot(buyArrayHave, buyArrayWant); buyArrayHave = []; buyArrayWant = [];
                        i++;
                        //console.log(i);
                        //console.log('Набрано 10 предметов на покупку, createLot отправлен, startTrading перезапущен. i ='+i+'.');
                        setTimeout(function() { startTrading(); }, timer);
                        return;
                    }

                    i++;
                    //console.log(i);
                    //console.log('Десять предметов на покупку не набрано, startTrading отправлен дальше. i ='+i+'.');
                    startTrading();
                    return;
                }

                if (type == 'sell'){
                    //Пополнение лота
                    //Левая часть
                    if (returnObj[key][type + '_amount'] > 1) {
                        sellArrayHave.push({"itemId":id,"paint":colorsID[key],"cert":0,"quantity":returnObj[key][type + '_amount']});
                    }
                    else {
                        sellArrayHave.push({"itemId":id,"paint":colorsID[key],"cert":0});
                    }
                    //Правая часть
                    if (returnObj[key][type + 'Price'] > 1) {
                        sellArrayWant.push({"itemId":496,"paint":0,"cert":0,"quantity":returnObj[key][type + 'Price']});
                    }
                    else {
                        sellArrayWant.push({"itemId":496,"paint":0,"cert":0});
                    }

                    if (sellArrayHave.length == 10) {//При достижении 10 предметов отправляем на создание лота, массив очищаем
                        createLot(sellArrayHave, sellArrayWant); sellArrayHave = []; sellArrayWant = [];
                        i++;
                        //console.log(i);
                        //console.log('Набрано 10 предметов на продажу, createLot отправлен, startTrading перезапущен. i ='+i+'.');
                        setTimeout(function() { startTrading(); }, timer);
                        return;
                    }

                    i++;
                    //console.log(i);
                    //console.log('Десять предметов на продажу не набрано, startTrading отправлен дальше. i ='+i+'.');
                    startTrading();
                }
            }
            else {
                i++;
                //console.log(i);
                //console.log('Чекбокс не чекнут, startTrading отправлен дальше. i ='+i+'.');
                startTrading();
            }
        }
    }

    //Функция рандомизации массива
    function randomArray() {
        return Math.random() - 0.5;
    }

    //Функция создания лотов
    function createLot(haveArray, wantArray){
        //console.log(haveArray, wantArray);
        var queueArray = [0,1,2,3,4,5,6,7,8,9];//Вспомогательный массив для рандомизации лотов
        queueArray.sort(randomArray).sort(randomArray);//Для пущей рандомизации проводим её дважды

        var ownerItems = [];
        var tradeItems = [];

        var sender = 'platform=1&btnSubmit=Add+trade';//Строка с отправляемыми данными

        //Добавление комментария
        var note = '&note=' + localStorage.getItem('default_note').replace(/"/g,'').replace(/\s/g,'+');

        //Добавление в комментарии подробностей о лоте. Вырезано по просьбе
        $(queueArray).each(function(i) {
            ownerItems[i] = haveArray[+this];
            tradeItems[i] = wantArray[+this];

            //Добавление предметов в комментарий
            // Предметы левой части
            /*var serialObj = localStorage.getItem(haveArray[+this]["itemId"]);
            var returnObj = JSON.parse(serialObj);
            var name = returnObj["o_name"];
            var color = colorsIDReverse[haveArray[+this]["paint"]];
            var amount = haveArray[+this]["quantity"];
            if (typeof amount == 'undefined') { amount = 1; }

            if (name == 'Key') {
                note += ' [H: ' + amount + ' ' + name + " /";
            }
            else {
                note += ' [H: ' + amount + ' ' + name + ' ' + color + " /";
            }

            //Предметы правой части
            serialObj = localStorage.getItem(wantArray[+this]["itemId"]);
            returnObj = JSON.parse(serialObj);
            name = returnObj["o_name"];
            color = colorsIDReverse[wantArray[+this]["paint"]];
            amount = wantArray[+this]["quantity"];
            if (typeof amount == 'undefined') { amount = 1; }

            if (name == 'Key') {
                note += ' W: ' + amount + ' ' + name + "].";
            }
            else {
                note += ' W: ' + amount + ' ' + name + ' ' + color + "].";
            }*/
        });
        //Переводим в строчный вид
        ownerItems = JSON.stringify(ownerItems);
        tradeItems = JSON.stringify(tradeItems);

        sender += '&ownerItems=' + ownerItems + '&tradeItems=' + tradeItems;

        //Добавляем комментарий
        note.replace(/\s/g,'+');
        sender += note;

        //getToken();
        sender += '&csrf_token=' + csrfToken;

        //задаём таймер для удаления лота
        var timer2 = +JSON.parse(localStorage.getItem('timer_delete')) * 1000 - 0.5 * +JSON.parse(localStorage.getItem('timer_delete_random')) * 1000 + Math.random() * 1000 * +JSON.parse(localStorage.getItem('timer_delete_random'));

        $.ajax({
            url: 'https://rocket-league.com/functions/addTrade.php',
            async: true,
            type: 'post',
            dataType: 'html',
            data: sender,
            success: function(html,status,xhr){
                var tradeID = xhr.responseText.match(/trade\/.*'/)[0].replace('trade/','').replace(/'/g,'');//вытаскиваем из ответа айди лота
                setTimeout(function() { deleteLot(tradeID); }, timer2);//удаляем лот через заданный промежуток
            },
            error: function(){
                setTimeout(function() {createLot(haveArray, wantArray)}, 3000);
            }
            /*statusCode: {
                500: function() {
                    setTimeout(function() {createLot(haveArray, wantArray)}, 3000);
                },
                522: function() {
                    setTimeout(function() {createLot(haveArray, wantArray)}, 3000);
                }
            }*/
        })
    }

    //Получение токена
    setInterval(function() { getToken(); }, 300000);//Обновляем токен каждые 5 минут
    function getToken(){
        $.ajax({
            url: 'https://rocket-league.com/messages',
            async: true,
            type: 'get',
            dataType: 'html',
            success: function(html){
                csrfToken = html.match(/window.csrf_token = ".*"/)[0].replace('window.csrf_token = ','').replace(/"/g,'');
            },
            error: function(){
                setTimeout(function() {getToken()}, 3000);
            }
            /*statusCode: {
                500: function() {
                    setTimeout(function() {getToken()}, 3000);
                },
                522: function() {
                    setTimeout(function() {getToken()}, 3000);
                }
            }*/
        })
    }

    //Удаление лота
    function deleteLot(id){
        $.ajax({
            url: 'https://rocket-league.com/functions/disableTrade.php?trade=' + id + '&source=mytrades',
            async: true,
            type: 'get',
            error: function(){
                setTimeout(function() {deleteLot(id)}, 3000);
            }
            /*statusCode: {
                500: function() {
                    setTimeout(function() {deleteLot(id)}, 3000);
                },
                522: function() {
                    setTimeout(function() {deleteLot(id)}, 3000);
                }
            }*/
        })
    }

    //При остановке торговли удаляем все активные сделки
    function deleteTrades() {
        $.ajax({
            url: 'https://rocket-league.com/trades/' + playerID,
            async: true,
            type: 'get',
            success: function(html) {
                $(html).find('[href*="/functions/disableTrade.php?trade="]').each(function() {
                    var link = $(this).attr('href');
                    var id = link.replace('/functions/disableTrade.php?trade=','').replace('&source=mytrades','');

                    deleteLot(id);
                })
            },
            error: function() {
                setTimeout(function() {deleteTrades(id)}, 3000);
            }
            /*statusCode: {
                500: function() {
                    setTimeout(function() {deleteTrades(id)}, 3000);
                },
                522: function() {
                    setTimeout(function() {deleteTrades(id)}, 3000);
                }
            }*/
        })
    }

    //Из первой таблицы убираются все галки
    function uncheckAll() {
        $('.traderCheckBox').each(function () {
            if ($(this).prop('checked') == true) {
                var id = $(this).attr('item-id');

                $(this).prop('checked', false);

                if ($('#checkBox-' + id).parent().css('font-weight') == '700') $('#checkBox-' + id).parent().css('font-weight','normal');
                else $('#checkBox-' + id).parent().css('font-weight','bold');

                traderCheckboxClick($(this).prop('checked'), id);
            }
        });


        //Обновляем счётчик
        //tradesCounter();
    }

    function invertCheckbox() {
        $('.divKeyTrading').each(function () {
            var checkboxSell = $(this).children().children('input[checkbox-type="sell"]');
            var checkboxBuy = $(this).children().children('input[checkbox-type="buy"]');

            if (checkboxBuy.prop('checked') == true && checkboxSell.prop('checked') == true) { return; }
            if (checkboxBuy.prop('checked') == true) {
                let id = checkboxBuy.attr('item-id');
                let key = checkboxBuy.attr('item-key');
                let type = 'buy';

                let serialObj = localStorage.getItem(id);//получаем текущий предмет из хранилища
                let returnObj = JSON.parse(serialObj);

                returnObj[key][type + "_isTrading"] = "no";
                returnObj[key]["sell_isTrading"] = "yes";

                $('[class="checkbox-trade ' + id + ' ' + key + '"]').eq(1).parent().css('background-color', 'white');
                $('[class="checkbox-trade ' + id + ' ' + key + '"]').eq(0).parent().css('background-color', '#FEAFAF');

                serialObj = JSON.stringify(returnObj);
                localStorage.setItem(id, serialObj);

                checkboxBuy.prop('checked', false);
                checkboxSell.prop('checked', true);


                //Обновляем счётчик
                //tradesCounter();

                return;
            }
            if (checkboxSell.prop('checked') == true) {
                let id = checkboxSell.attr('item-id');
                let key = checkboxSell.attr('item-key');
                let type = 'sell';

                let serialObj = localStorage.getItem(id);//получаем текущий предмет из хранилища
                let returnObj = JSON.parse(serialObj);

                returnObj[key][type + "_isTrading"] = "no";
                returnObj[key]["buy_isTrading"] = "yes";

                $('[class="checkbox-trade ' + id + ' ' + key + '"]').eq(0).parent().css('background-color', 'white');
                $('[class="checkbox-trade ' + id + ' ' + key + '"]').eq(1).parent().css('background-color', '#AFFECB');

                serialObj = JSON.stringify(returnObj);
                localStorage.setItem(id, serialObj);

                checkboxSell.prop('checked', false);
                checkboxBuy.prop('checked', true);
            }
        });


        //Обновляем счётчик
        //tradesCounter();
    }


    //Пересчёт значений счётчика и изменение видимости строк
    setInterval(function() { tradesCounter(); }, 5000);
    function tradesCounter() {
        //Обнуляем текущие счётчики
        $('span[id*="counter-"]').each(function() {
            $(this).text('0');
        });

        //Заполняем счётчики в соответствии с типами
        $('[class*="checkbox-trade"]:checked').each(function() {
            let checkbox_type = $(this).attr('checkbox-type'),
                section = $(this).parents('[id*="tradeSectionBody"]').attr('id').replace('tradeSectionBody-','');

            //Строка "всего"
            let counter_total = $('span[id="counter-total-' + checkbox_type + '"]'),
                total_num = +counter_total.text();

            counter_total.text(total_num + 1);

            //Строка секции
            let counter_section = $('span[id="counter-' + section + '-' + checkbox_type + '"]'),
                section_num = +counter_section.text();

            counter_section.text(section_num + 1);
        });


        //Меняем видимость строк
        $('div[id*="counter-"]').each(function() {
            let sell_num = +$(this).children('span[id$="-sell"]').text(),
                buy_num = +$(this).children('span[id$="-buy"]').text();

            if (sell_num == 0 && buy_num == 0) {
                $(this).hide();
            }
            else {
                $(this).show();
            }
        });
    }

})(window);