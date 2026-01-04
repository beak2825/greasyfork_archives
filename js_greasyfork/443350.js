// ==UserScript==
// @name         SDT Enhancer Advanced
// @namespace    http://tishka.xyz/sdt
// @version      0.3.0.66
// @description  backend enhancer
// @author       Tishka
// @match        https://marketing-jet.lux-casino.co/*
// @match        https://marketing-sol.lux-casino.co/*
// @match        https://marketing-rox.lux-casino.co/*
// @match	     https://marketing.lux-casino.co/*
// @match		 https://marketing-fresh.lux-casino.co/*
// @match		 https://marketing-izzi.lux-casino.co/*
// @require 	 https://greasyfork.org/scripts/28536-gm-config/code/GM_config.js?version=184529
// @icon         https://www.google.com/s2/favicons?domain=mozilla.org
// @grant       GM.getValue
// @grant       GM_getValue
// @grant       GM.setValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/443350/SDT%20Enhancer%20Advanced.user.js
// @updateURL https://update.greasyfork.org/scripts/443350/SDT%20Enhancer%20Advanced.meta.js
// ==/UserScript==
//changelog
//07.12.2021: add SOL support xD zabil ran'she + collect top igr usera + ispravil link na cashback, otkrivalo jet
//10.12.2021: переделан блок в таблицу для красоты
//11.12.2021: dobavil status 4eker esli prem pokazhet + esli susПетр tags estb to tozhe + COMMENT scripti + prokrutka esli dubli +fix OGROMNIH 4ISEL wagera esli zapyataya)))
//15.12.2021: (0.2.9.2) добавлен скрипт на дубли, вейджер для сола теперь считает по х1 и показывает текущий вейджер, функции работы с таблицами и числами кое-как сделаны глобальными
//15.12.2021: (0.2.9.3) пофикшена выборка таблицы депов, теперь привязана не к номеру таблицы.
//16.12.2021: (0.2.9.4) убрал немного лишнего кода, добавил копирование списка фриспинов
//16.12.2021: (0.2.9.5) из коммента про основной аккаунт дубликата убрана строка (Основной аккаунт) + fixed подписка
//17.12.2021: (0.2.9.5) пофиксил скрипт фриспинов.
//18.12.2021: (0.2.9.6) фикс отображения группы на иззи(опять номер таблицы) (ТЕСТ) + изменил способ проверки почты, теперь будет писать, если акк заблочен
//23.12.2021: (0.2.9.7) фикс статусов для проектов кроме джет и иззи
//27.12.2021: (0.2.9.8) добавлен блок дубликатов под основным меню энхенсера
//31.12.2021: (0.2.9.8) фикс комментов хз каким образом
//05.01.2022: (0.2.9.9) добавлено копирование списком платежных карт
//08.01.2022: (0.2.9.9) пофикшено последние 20 транзакций
//11.01.2022: (0.3.0.0) в чекер вейджера добавлена проверка спорта
//12.01.2022: (0.3.0.1) костыльный фикс чекера вейджера, потому что бэк любит грузится по сто лет и ничего не сделать(
//14.01.2022: (0.3.0.2) новый вейджер чекер + скрипт по 20 транзакциям должен работать шустрее
//19.01.2022: (0.3.0.3) опять фикс статусов на иззм - теги premium_bezdep
//22.01.2022: (0.3.0.4) добавлен скрипт вейджера бонусов + исправлен расчет вейджера для сола, добавлен лоадер и ссылка на справку
//23.01.2022: (0.3.0.5) FIX IZZI! чекер статуса сломался) + подсветка активного бездепа в списке бонусов + подсветка бонуса если он найден в трелло
//26.01.2022: (0.3.0.6) еще один фикс вейджерчекера, теперь должно работать стабильнее, покрасили випов и премов еще раз
//26.01.2022: (0.3.0.7) фикс статуса чаржей + списка карт на вулкане + трехкратки на соле и вулкане
//28.01.2022: (0.3.0.7) изменен скрипт для сола, убрано "трехкратный"
//28.01.2022: (0.3.0.7) подсветка обычных юзеров, настраивается
//28.01.2022: (0.3.0.8) добавлена пара настроек, подсветка випов обновлена
//04.02.2022: (0.3.0.10) фикс спорта, что-то в бэке поменялось?
//05.02.2022: (0.3.0.11) подсветка активных фриспинов
//09.02.2022: (0.3.0.12) отключено копирование карт на фреше - ломает все, пофикшу некст тайм
//09.02.2022: (0.3.0.13) отключено копирование списком до фикса, багнутое
//10.02.2022: (0.3.0.17) пофикшено копирование карт и изменена ссылка на GM_config - обновление списка использованных карт поломало все плюс был недоступен ресурс с гм-конфигом, добавлен скрипт для заявок на вывод средств
//11.02.2022: (0.3.0.18) оповещение об удаленных фотках
//11.02.2022: (0.3.0.19) фиксед выбор подсвечивааемых статусов
//12.02.2022: (0.3.0.20) сохранение дат кешбека для каждого проекта отдельно
//15.02.2022: (0.3.0.21) альфа расчет кешбека, пока только джет
//17.02.2022: (0.3.0.22) костыльный расчет кеша для иззи
//21.02.2022: (0.3.0.25) расчет кешбека включен и для рокса по аналогии с джетом
//23.02.2022: (0.3.0.26) добавлен чекер др. альфа., список транзакций теперь пронумерован
//24.02.2022: (0.3.0.27) добавлен чекер запрещенных регионов по региону номера. дефолтный блэклист в скрипте плюс сравнивает с базой на сайте.
//27.02.2022: (0.3.0.28) недокешбек! на странице профиля! в следующей версии нужно доделать.
//28.02.2022: (0.3.0.30) кешбек чекер фиксед... два раза минус...
//02.03.2022: (0.3.0.32) кешбек для иззи + возможность отключения рестриктед флага
//03.03.2022: (0.3.0.34) формат тикет для деп-выплат
//05.03.2022: (0.3.0.35) формат тикет для игр
//14.03.2022: (0.3.0.36) фикс расчета кешбека если у пользователя несколько валют в профиле
//17.03.2022: (0.3.0.40) фикс подсветки chargeback_vip тегов, fixed 20 операция с запятыми, простой фрод-чекер, кешбек фреш...
//18.03.2022: (0.3.0.43) отключение панели Marketing, добавлено "последнего внесенного" в скрипт про отыгрыш депозита
//21.03.2022: (0.3.0.45) bezdepvip исключен тег, временный фикс волны трехкратка
//22.03.2022: (0.3.0.46) волна добавлена подсветка статусов
//23.03.2022: (0.3.0.47) сол расчет кешбека
//25.03.2022: (0.3.0.48) сол расчет кешбека // штоблять?
//25.03.2022: (0.3.0.49) волна фиксед скрипт вывод
//27.03.2022: (0.3.0.51) подсветка бонусов vip по бд фриспины тоже добавлены
//27.03.2022: (0.3.0.52) коммент шаблон: почта подтверждена вручную после письма
//29.03.2022: (0.3.0.55) коммент шаблон: изменение почты, СОЛ - вейджер считает по х3, если отыгрыш идет в спорте, а не слотах, вернул цвет цифр
//30.03.2022: (0.3.0.60) отключить функцию восстановления старого отображения цифр теперь нельзя, потому что влияет на расчет кешбека, поменял еще раз, на волне добавлена проверка по баллам для группы новичок, исправил Да на ДА!!!!!!!!!
//31.03.2022: (0.3.0.62) фиксы: чекер рассылок, скрипт на депы-выводы, уведомление о баллах на волне. Подсветка вип-фриспинов
//03.04.2022: (0.3.0.64) фикс копирования карт и скрипта по выплатам, кеш волна
//04.04.2022: (0.3.0.65) фреш фикс вейджерчекер
//08.04.2022: (0.3.0.66) фикс краша при дополнительных параметрах в урл на странице игрока в бэке, нужно для корректной работы панели маркетинг в нужной валюте
(async function() {
    'use strict';
    if (window.top != window.self) {return}; // во фрейме не работать
    //инициализируем важные переменные
    let enhancer = {};
    enhancer.debugMode = 0;
    enhancer.currentURL = window.location.href;
    let debugMode = 0;
    let url = window.location.href;
    let projectName = window.location.href.split("/")[2].split(".")[0].split("-")[1];
    if(!projectName){projectName = "";} else {projectName = "-"+projectName;}
    let userid = window.location.href.split("/")[5].split("?")[0];
    let emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi
    // щас будет костыль, надо исправлять -
    //let userEmail1 = document.getElementById("page_title").innerHTML.split("-"); // это фиксить, выборка может дать ошибку, правильная выборка в userEmail1
    if(url.split("/")[4].startsWith("players") && url.split("/")[5]){
        var userEmail = document.getElementById("page_title").innerHTML.match(emailRegex)[0].trim();
        var userCurrency = document.querySelector(".status_tag.yes").innerHTML;
    }
    //console.log(userEmail1);
    let loaderImage = getLoaderImage();

    // инициализация функций, важно, чтобы это оставлось вверху, иначе функция не определена и будет function is undefined
    var tableToObj = function(table) { // переделывает таблицу в архив, нужно для работы 3х чекера и т.д.
        var trs = table.rows,
            trl = trs.length,
            i = 0,
            j = 0,
            keys = [],
            obj, ret = [];

        for (; i < trl; i++) {
            if (i == 0) {
                for (; j < trs[i].children.length; j++) {
                    keys.push(trs[i].children[j].innerHTML);
                }
            } else {
                obj = {};
                for (j = 0; j < trs[i].children.length; j++) {
                    obj[keys[j]] = trs[i].children[j].innerHTML;
                }
                ret.push(obj);
            }
        }

        return ret;
    };
    function declOfNum(n, text_forms) { // возвращает правильную форму слову, первым параметром число, вторым - набор форм числа !!!(рубль, рубля, рублей)!!!
        n = Math.abs(n) % 100;
        var n1 = n % 10;
        if (n > 10 && n < 20) { return text_forms[2]; }
        if (n1 > 1 && n1 < 5) { return text_forms[1]; }
        if (n1 == 1) { return text_forms[0]; }
        return text_forms[2];
    }

    function fixNumber(n){ // какой-то адовый пиздец для разделения числа по три цифры... спасибо стековерфлоу...
        var s = n.toString().split('.');
        var r = '';
        for(var i = s[0].length-3; i > 0; i-=3)
            r = s[0].substr(i, 3) + ' ' + r;
        r = s[0].substr(0, i+3) + ' ' + r;
        r = r.substr(0, r.length-1);
        s[1] = s[1] || '00';
        return r+'.'+s[1];
    }

    function toRightForm(n, currency){
        let normalizedSum = fixNumber(n);
        const currencyForms = new Map([
            ['RUB', ['рубль','рубля','рублей']],
            ['UAH', ['гривна','гривны','гривен']],
            ['KZT', ['тенге','тенге','тенге']],
            ['USD', ['доллар','доллара','долларов']],
            ['EUR', ['евро','евро','евро']],
            ['PLN', ['злотый','злотых','злотых']]
        ]);
        let normalizedCurrencyForm = declOfNum(n, currencyForms.get(currency));
        let output = normalizedSum.split(".")[0] + " " + normalizedCurrencyForm;
        return output;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms)); // функция сна
    }
    // ПОИСК ТАБЛИЦ
    // в пейментс тейбл находит таблицу депов
    var h3Labels = document.getElementsByTagName("h3"); // выбирает всех h3 надписи
    for(var i=0;i<h3Labels.length;i++){
        if(h3Labels[i].innerHTML == 'Последние платежи'){
            var paymentsBlock = h3Labels[i].parentNode; // ищет надпись последние платежи, идет на блок выше и в нем ищет таблицу
        }
        if(h3Labels[i].innerHTML == 'Groups'){
            var groupsPanel = h3Labels[i].parentNode.querySelector(".panel_contents"); // блок групп
        }
        if(h3Labels[i].innerHTML == 'Tags'){
            var tagsPanel = h3Labels[i].parentNode.querySelector(".panel_contents"); // блок тегов
        }
        // if(h3Labels[i].innerHTML == 'Приоритет платёжной системы'){
        // 	var paymentsMethodsPanel = h3Labels[i].parentNode; // ищет надпись последние платежи, идет на блок выше и в нем ищет таблицу
        // }

        //Телефоны
        if(h3Labels[i].innerHTML == 'Счет в баллах'){
            var casinoPointsPanel = h3Labels[i].parentNode; // список карт на вулкане
        }
        if(h3Labels[i].innerHTML == 'Инструменты платежа'){
            var paymentsMethodsPanel = h3Labels[i].parentNode; // список карт на вулкане
        }
        if(h3Labels[i].innerHTML == 'Телефоны'){
            var phoneNumbersPanel = h3Labels[i].parentNode; // блок с номерами телефонов справа
        }
        if(h3Labels[i].innerHTML == 'Выданные бонусы казино'){
            var casinoBonusesPanel = h3Labels[i].parentNode; // ищет надпись выданные бонусы, идет на блок выше и в нем ищет таблицу
        }
        if(h3Labels[i].innerHTML == 'Активные лимиты'){
            var selfExclusionPanel = h3Labels[i].parentNode; // ищет надпись активные лимиты, идет на блок выше и в нем ищет таблицу
        }
        if(h3Labels[i].innerHTML == 'Выданные фриспины'){
            var casinoFreespinsPanel = h3Labels[i].parentNode; // ищет надпись выданные фриспины, идет на блок выше и в нем ищет таблицу
        }
        if(h3Labels[i].innerHTML == 'Счета'){
            var casinoCurrencyPanel = h3Labels[i].parentNode; // ищет надпись выданные фриспины, идет на блок выше и в нем ищет таблицу
        }
        if(h3Labels[i].innerHTML == 'Документы'){
            var casinoDocumentsPanel = h3Labels[i].parentNode; // ищет надпись выданные фриспины, идет на блок выше и в нем ищет таблицу
        }
        if(h3Labels[i].innerHTML == 'Последние события'){
            var userEventsPanel = h3Labels[i].parentNode; // список событий(входы)
        }
        if(h3Labels[i].innerHTML == 'Дополнительные сведения'){
            var userParametersPanel = h3Labels[i].parentNode; // список событий(входы)
        }
        if(h3Labels[i].innerHTML == 'Marketing'){
            var marketingPanel = h3Labels[i].parentNode; // список событий(входы)
        }
    }

    function injectSettingsButton(){
        let enhancerButton = document.createElement("span");
        enhancerButton.innerHTML = "<a id='enhancerSettings'>SDT ENHANCER</a>";
        enhancerButton.classList.add("action_item");
        let anchorElement = document.getElementById("titlebar_right").querySelector(".action_items");
        anchorElement.insertBefore(enhancerButton, anchorElement.firstChild);
        //anchorElement.prepend(enhancerButton);
    }



    GM_config.init(
        {
            'id': 'MyConfig', // The id used for this instance of GM_config
            'title': 'Настройки скрипта',
            'fields': // Fields object
            {
                'enhanceComments': // This is the id of the field
                {
                    'label': 'Улучшение комментариев', // Appears next to field
                    'type': 'checkbox', // Makes this setting a text field
                    'default': 'true' // Default value if user doesn't change it
                },
                // // 'scriptTest': // This is the id of the field
                // // {
                // // 	'label': 'Скрипт 1', // Appears next to field
                // // 	'type': 'textarea', // Makes this setting a text field
                // // 	'default': '1' // Default value if user doesn't change it
                // // },
                // 'advancedVipHighlight': // This is the id of the field
                // {
                // 	'label': 'Яркая подсветка випов', // Appears next to field
                // 	'type': 'checkbox', // Makes this setting a text field
                // 	'default': 'false' // Default value if user doesn't change it
                // }
                'vipNotifyCurrencyBlock': // This is the id of the field
                {
                    'label': 'VIP подсветка: блок "Счета"', // Appears next to field
                    'type': 'checkbox', // Makes this setting a text field
                    'default': 'true' // Default value if user doesn't change it
                },
                'vipNotifyBackgroundColor': // This is the id of the field
                {
                    'label': 'VIP подсветка: цвет фона бэка', // Appears next to field
                    'type': 'checkbox', // Makes this setting a text field
                    'default': 'true' // Default value if user doesn't change it
                },
                'vipNotifyAlert': // This is the id of the field
                {
                    'label': 'VIP подсветка: уведомление', // Appears next to field
                    'type': 'checkbox', // Makes this setting a text field
                    'default': 'true' // Default value if user doesn't change it
                },
                'vipNotifyHighlightDefault': // This is the id of the field
                {
                    'label': 'Выделение статуса: обычный пользователь', // Appears next to field
                    'type': 'checkbox', // Makes this setting a text field
                    //'default': 'false' // Default value if user doesn't change it
                },
                'vipNotifyHighlightPremium': // This is the id of the field
                {
                    'label': 'Выделение статуса: Premium', // Appears next to field
                    'type': 'checkbox', // Makes this setting a text field
                    'default': 'true' // Default value if user doesn't change it
                },
                'vipNotifyHighlightVip': // This is the id of the field
                {
                    'label': 'Выделение статуса: VIP', // Appears next to field
                    'type': 'checkbox', // Makes this setting a text field
                    'default': 'true' // Default value if user doesn't change it
                },
                'disableAdvancedFlags': // This is the id of the field
                {
                    'label': 'Отключить расширенные возможности ', // Appears next to field
                    'type': 'checkbox', // Makes this setting a text field
                    //'default': 'false' // Default value if user doesn't change it
                },
                'disableDuplicatesBlock': // This is the id of the field
                {
                    'label': 'Отключить блок дубликатов ', // Appears next to field
                    'type': 'checkbox', // Makes this setting a text field
                    //'default': 'false' // Default value if user doesn't change it
                },
                'addBirthdayLabel': // This is the id of the field
                {
                    'label': 'Добавить строку "День рождения" (альфа) ', // Appears next to field
                    'type': 'checkbox', // Makes this setting a text field
                    // 'default': 'true' // Default value if user doesn't change it
                },
                'restrictedLocationsFlag': // This is the id of the field
                {
                    'label': 'Предупреждение о использовании запрещенных локаций', // Appears next to field
                    'type': 'checkbox', // Makes this setting a text field
                    'default': 'true' // Default value if user doesn't change it
                },
                'fraudChecker': // This is the id of the field
                {
                    'label': 'Фрод-чекер', // Appears next to field
                    'type': 'checkbox', // Makes this setting a text field
                    //'default': 'true' // Default value if user doesn't change it
                },
                'disableMarketingPanel': // This is the id of the field
                {
                    'label': 'Отключить панель Marketing', // Appears next to field
                    'type': 'checkbox', // Makes this setting a text field
                    //'default': 'true' // Default value if user doesn't change it
                },
                'highlightVipBonuses': // This is the id of the field
                {
                    'label': 'Подсветка бонусов vip', // Appears next to field
                    'type': 'checkbox', // Makes this setting a text field
                    //'default': 'true' // Default value if user doesn't change it
                },
            },

        });

    enhancer.settings = {};
    //enhancer.settings.enhanceBonuses = GM_config.get("Name");
    enhancer.settings.enhanceComments = GM_config.get("enhanceComments");
    //enhancer.settings.disableEnhancerBlock = GM_config.get("disableEnhancerBlock");
    enhancer.settings.disableEnhancerBlock = 0;
    enhancer.settings.vipNotifyCurrencyBlock = GM_config.get("vipNotifyCurrencyBlock");
    enhancer.settings.vipNotifyBackgroundColor = GM_config.get("vipNotifyBackgroundColor");
    enhancer.settings.vipNotifyAlert = GM_config.get("vipNotifyAlert");

    enhancer.settings.disableAdvancedFlags = GM_config.get("disableAdvancedFlags");
    enhancer.settings.disableDuplicatesBlock = GM_config.get("disableDuplicatesBlock");
    enhancer.settings.addBirthdayLabel = GM_config.get("addBirthdayLabel");

    enhancer.settings.vipNotifyHighlightVip = GM_config.get("vipNotifyHighlightVip");
    enhancer.settings.vipNotifyHighlightPremium = GM_config.get("vipNotifyHighlightPremium");
    enhancer.settings.vipNotifyHighlightDefault = GM_config.get("vipNotifyHighlightDefault");
    enhancer.settings.restrictedLocationsFlag =  GM_config.get("restrictedLocationsFlag");
    enhancer.settings.fraudChecker = GM_config.get("fraudChecker");
    enhancer.settings.disableMarketingPanel = GM_config.get("disableMarketingPanel");
    enhancer.settings.highlightVipBonuses = GM_config.get("highlightVipBonuses");

    enhancer.userProfile = {
        emailConfirmed: 0,
        hasDuplicates: 0,
        isUsingRestrictedNumber: 0,
        isUsingRestrictedRegion: 0,
        userStatus: ""
    };

    let includedBonuses;
    if(enhancer.settings.highlightVipBonuses == true){
        includedBonuses = await getHighlightedBonusesList();
    }



    function disableMarketingPanel(){
        if(marketingPanel) marketingPanel.setAttribute("hidden", "hidden");

    }

    function restoreColor(){
        let list = document.querySelectorAll("span");
        for(let value of list){
            // if(value.getAttribute("style") == "color: black; font-size: 1em"){
            if(value.classList.value.match(/status_tag/)){
                value.setAttribute("style", "0.9em");
                value.innerText = value.innerText.replace(/\s/g, "");
            }
        }
    }
    restoreColor();

    async function createParser(url, parserid){
        let parser = document.createElement("iframe");
        parser.setAttribute("src", url);
        parser.setAttribute("width", 100);
        parser.setAttribute("height", 100);
        parser.setAttribute("id", parserid);
        let anchorElement = document.getElementById("debugMenu");
        // anchorElement.insertBefore(parser, anchorElement.firstChild);
        while(!anchorElement)
        {
            anchorElement = document.getElementById("debugMenu");
            await sleep(10);
        }
        parser = anchorElement.appendChild(parser);

        let isLoaded = 0;
        document.getElementById(parserid).addEventListener("load", function(){
            console.log("Загружено: " + parserid);
            isLoaded = 1;
        });
        while(!isLoaded){
            await sleep(10);
        }
        return parser;
    }

    function collectBaseData(){
        // console.log(userParametersPanel);
        let userDataTable = userParametersPanel.querySelector("table");
        let firstName = userDataTable.querySelector(".row.row-first_name").querySelector("td").innerText;
        let lastName = userDataTable.querySelector(".row.row-last_name").querySelector("td").innerText;
        let birthdate = userDataTable.querySelector(".row.row-date_of_birth").querySelector("td").innerText;
        enhancer.userProfile = {firstName: firstName, lastName: lastName, birthdate: birthdate};
        //console.log(enhancer.userProfile);
    }


    // еще один парсер, на этот раз через фетч, стаковерфлоу
    async function fetchDocument(url) {
        let response = await fetch(url, {method: 'GET', credentials: 'include', mode:'same-origin',});
        let text = await response.text();
        if (!fetchDocument.parser) fetchDocument.parser = new DOMParser(); // the dom parser is reusable
        return fetchDocument.parser.parseFromString(text, "text/html");
    }

    // запрашивает список бонусов, которые надо выделять
    async function getHighlightedBonusesList(){
        let fetchedData = await fetch(`https://tishka.xyz/sdt/advancedApi.php?action=getBonusesList`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            //console.log(data);
            return data;
        });
        return fetchedData;
    }



    // инжект блока энхенсера если страница игрока в бэке
    if(url.split("/")[4].startsWith("players") && url.split("/")[5]){
        // если на странице игрока в бэке, инжект
        injectEnhancerBlock(); // блок энхенсера

        injectDuplicatesBlock(); // блок дублей
        collectBaseData();
        checkDuplicates();
        checkPhoneNumber();
        stagGrabber();
        subscribeChecker();
        checkEmail();
        statusChecker();
        enhanceUserEvents();
        getUniqueCards();
        enhanceBonuses();
        enhanceFreespins();
        enhanceDocuments();
        selfExclusionCheck();
        //checkWager(); // в приоритете ее меняем на новый чекер.
        newWagerChecker();
        enhancePayments();
        injectSettingsButton();
        enhanceBirthday();
        if(enhancer.settings.disableMarketingPanel == true){disableMarketingPanel();}
        if(enhancer.settings.fraudChecker == true){fraudChecker();}
        if(enhancer.settings.enhanceComments == 1){injectCommentBlock();		enhancerCommentScripts();} // блок для комментов
        //document.getElementById("checkWagerButton").addEventListener("click", checkWager); // Слушает клик по кнопке ЧЕК ВЕЙДЖЕР
        let cashbackDates = GM_getValue("cashbackDates");
        if(cashbackDates != undefined){
            if(cashbackDates[projectName] != undefined){
                document.getElementById("startTrip").value = cashbackDates[projectName]["startDate"];
                document.getElementById("endTrip").value = cashbackDates[projectName]["endDate"];
            }
            else{
                cashbackDates[projectName] = {startDate: "", endDate: ""};
                GM_setValue("cashbackDates", cashbackDates);
            }
        }
        else
        {
            cashbackDates = {};
            cashbackDates[projectName] = {startDate: "", endDate: ""};
            GM_setValue("cashbackDates", cashbackDates);
        }
        document.getElementById("cashbackCount").addEventListener("click", enhanceCashback);
        // var startTrip = document.getElementById("startTrip").value; // после инжекта эн
        // var endTrip = document.getElementById("endTrip").value;
        document.getElementById("enhancerSettings").addEventListener("click", function(){
            GM_config.open();
        });
        document.getElementById("openCashbackLinksButton").addEventListener("click", openCashbackLinks); // Слушает клик по кнопке СТАТА ЗА ПЕРИОД
        document.getElementById("enhancerScriptTopUserGames").addEventListener("click", function(){
            parseData("topUserGames");
        } );
        // ТЕСТОВАЯ КНОПКА
        document.getElementById("enhancerScriptPaymentHistory").addEventListener("click", depOutScript); // Слушает клик по кнопке ЧЕК ВЕЙДЖЕР

        document.getElementById("enhancerScriptPayment20History").addEventListener("click", paymentsTransactionsScript);

        //GM_config.open();
    } //
    if(url.split("/")[4] == "freespin_issues"){
        // если на странице фриспина в бэке, инжект
        injectFreespinsBlock();
    }

    if(url.split("/")[4].startsWith("players_reports")){
        enhancePlayersReports();
    }

    if(url.split("/")[4].startsWith("clients_reports")){
        enhanceClientsReports();
    }
    if(url.split("/")[4].startsWith("payments")){
        document.querySelector(".panel").querySelector("h3").innerHTML += ` <a id="enhancerCopyTicketScript">Формат: тикет</a>`;
        document.getElementById("enhancerCopyTicketScript").addEventListener("click", enhancePaymentsPage)
    }
    if(url.split("/")[4].startsWith("bets") && url.split("/")[5] != undefined){
        document.querySelector(".panel").querySelector("h3").innerHTML += ` <a id="enhancerCopyTicketScript">Формат: тикет</a>`;
        document.getElementById("enhancerCopyTicketScript").addEventListener("click", enhanceBetsPage)
    }
    if(url.split("/")[4].startsWith("bonus_issues?")){
        if(enhancer.settings.highlightVipBonuses == true) enhanceBonusesListPage();
    }
    if(url.split("/")[4].startsWith("freespin_issues?")){
        if(enhancer.settings.highlightVipBonuses == true) enhanceFreespinsListPage();
    }
    // пеймент //enhancePaymentsPage();





    function injectCommentBlock()
    {
        var enhancerCommentHelperBlock;
        enhancerCommentHelperBlock = document.createElement( 'div' );
        enhancerCommentHelperBlock.innerHTML = `
								<select id="enhancerCommentSelector">
									<option value="" selected>Choose here</option>
									<option value="enhancerBlockComment">Блокировка</option>
									<option value="enhancerChangePersonalData">Смена данных</option>
									<option value="enhancerPassChange">Смена пароля</option>
									<option value="enhancerEmailChange">Смена ПОЧТЫ</option>
									<option value="enhancerLittleEmailChange">Смена ПОЧТЫ незначительно</option>
									<option value="enhancerLittleChangePersonalData">Незначительная</option>
									<option value="enhancerPhoneNumberChange">Смена номера</option>
									<option value="enhancerCardBlock">Блок карты 3ЛИЦО</option>
									<option value="enhancerWhomAcc">Принадлежит</option>
                                    <option value="enhancerMailChangedAfterSending">Почта изменена по письму</option>
                                    <option value="enhancerMailConfirmedAfterSending">После письма на почту саппорта</option>

								</select>
								<a id="enhancerCommentThisDuplicate">Это дубликат</a>
								<a id="enhancerCommentThisMain">Это основной</a>
								<a id="enhancerCommentDontKnow">Незнаком</a>
								<a id="enhancerCommentOwnerIs">Знаком, принадлежит</a>
                                <a id="enhancerCommentManualConfirmedEmail">Почта без письма</a>
								<br><br>
								`
        var enhancerCommentBlock = document.getElementById("active_admin_comment_body"); // элемент, в которой вкидывает, ставит первым наследником этого объекта
        var enhancerCommentElement = enhancerCommentHelperBlock; // код, который мы инжектим
        enhancerCommentBlock.before(enhancerCommentElement);
        document.querySelector("fieldset.actions").innerHTML += `<li><p>Адрес текущего аккаунта:</p><a id="enhancerCommentsEmailCopy">${userEmail}</a></li>`;
        document.getElementById("enhancerCommentsEmailCopy").addEventListener("click", function(){
            navigator.clipboard.writeText(userEmail);
            document.getElementById("enhancerCommentsEmailCopy").style.color = "red";
        });
        //
    }

    function injectFreespinsBlock()
    {
        let freespinGamesListElement = document.querySelector(".row.row-games").querySelector("td"); // список игр, элемент
        let freespinGamesList = document.querySelector(".row.row-games").querySelector("td").innerText; // список игр, сам текст
        let freespinsCount = document.querySelector(".row.row-freespins_total").querySelector("td").innerText; // количество фриспинов
        let freespinsCurrentState = document.querySelector(".row.row-stage").querySelector("td").innerText;
        if(debugMode == 1){console.log(freespinsCurrentState);}
        freespinGamesListElement.innerHTML = `<a id="enhancerFreespinGamesListButton">${freespinGamesList}</a>` // меняет список игр на ссылку

        freespinGamesList = [...new Set(freespinGamesList.split(", "))]; // разделяет по запятой с пробелом и
        var gameListScriptText = "";
        var cleanGameArray = [];
        for(let value of freespinGamesList)
        {
            if(!value.match(/Touch/))
            {
                gameListScriptText += value + ", ";
                cleanGameArray.push(value);
            }
        }
        gameListScriptText = gameListScriptText.trim(); // чтобы не было рандомной херни в конце скрипта
        if(debugMode == 1){console.log("Массив cleanGameArray: "+ cleanGameArray)};
        let activateFreespinText = "";
        if(freespinsCurrentState == "Выдан"){
            if(projectName == "-jet" || projectName == "-izzi"){
                activateFreespinText = ' Активируйте их в разделе "Баланс", он доступен по нажатию на ваш никнейм в правом верхнем углу сайта. ';
            }
        }
        let scriptText = "";
        switch(cleanGameArray.length){
            case 1:
                scriptText = "Вам "+ declOfNum(freespinsCount,["доступен","доступно","доступно"])+ " "+ freespinsCount + " "+ declOfNum(freespinsCount,["фриспин","фриспина","фриспинов"]) + " в игре " + cleanGameArray[0]+  activateFreespinText + ', в которую вы можете перейти в разделе "Активность". Желаю вам приятной игры! ';
                break;
            case 2:
                scriptText = "Вам "+ declOfNum(freespinsCount,["доступен","доступно","доступно"])+ " "+ freespinsCount + " "+ declOfNum(freespinsCount,["фриспин","фриспина","фриспинов"]) + " в играх " + cleanGameArray[0] + " и " + cleanGameArray[1]  + activateFreespinText + '. В которые вы можете перейти в разделе "Активность". Желаю вам приятной игры! ';
                break
            default:
                scriptText = "Вам "+ declOfNum(freespinsCount,["доступен","доступно","доступно"])+ " "+ freespinsCount + " "+ declOfNum(freespinsCount,["фриспин","фриспина","фриспинов"]) + " в следующих играх: " + gameListScriptText.slice(0, -1) + activateFreespinText + '. В которые вы можете перейти в разделе "Активность". Желаю вам приятной игры! ';
                break;
        }
        if(debugMode == 1){console.log("Текст scriptText фриспины:"+scriptText);}
        document.getElementById("enhancerFreespinGamesListButton").addEventListener("click", function(){
            navigator.clipboard.writeText(scriptText);
        });
        // выбирает список игр  document.querySelector(".row.row-games").querySelector("td").innerHTML = "<a>"+document.querySelector(".row.row-games").querySelector("td").innerText+"</a>"
        // var enhancerFreespinsBlock;
        // enhancerFreespinsBlock = document.createElement( 'div' );
        // enhancerFreespinsBlock.innerHTML = `
        // 	<a id="enhancerFreespinsCopyGames"> СКОПИРОВАТЬ</a>
        // 	`
        // var freespinsBlock = document.getElementById("active_admin_comment_body"); // элемент, в которой вкидывает, ставит первым наследником этого объекта
        // var enhancerFreespinsElement = enhancerFreespinsBlock; // код, который мы инжектим
        // freespinsBlock.before(enhancerFreespinsElement);

    }

    function enhancerCommentScripts()
    {
        let commentBlockScripts = document.getElementById("active_admin_comment_body");
        var neededComment;
        document.getElementById("enhancerCommentThisDuplicate").addEventListener("click", function(){ // change
            commentBlockScripts.value = "Дубликат. Основной аккаунт пользователя: АДРЕСОСНОВЫ";
        } );
        document.getElementById("enhancerCommentThisMain").addEventListener("click", function(){ // change
            commentBlockScripts.value = "Аккаунт АДРЕСДУБЛЯ заблокирован как дублирующий";
        } );
        document.getElementById("enhancerCommentDontKnow").addEventListener("click", function(){ // change
            commentBlockScripts.value = "Со слов игрока, аккаунт АДРЕСДУБЛЯ незнаком";
        } );
        document.getElementById("enhancerCommentOwnerIs").addEventListener("click", function(){ // change
            commentBlockScripts.value = "Со слов игрока, аккаунт АДРЕСДУБЛЯ знаком, принадлежит КОМУПРИНАДЛЕЖИТ";
        } );
        document.getElementById("enhancerCommentManualConfirmedEmail").addEventListener("click", function(){ // change
            commentBlockScripts.value = "Почта подтверждена вручную (без письма).";
        } );

        document.getElementById("enhancerCommentSelector").addEventListener("change", function(){ // change
            let selectedComment = document.getElementById("enhancerCommentSelector").value;
            switch(selectedComment){
                case "enhancerBlockComment":
                    neededComment = "Аккаунт заблокирован.\nПричина: ПРИЧИНА\nСрок: СРОК.";
                    break;
                case "enhancerBlockLudomanComment":
                    neededComment = "Аккаунт заблокирован по просьбе игрока. Причина: лудомания.";
                    break;
                case "enhancerChangePersonalData":
                    neededComment = "Персональные данные пользователя изменены по причине ПРИЧИНА. Игрок загрузил селфи с документом и корректно ответил на вопросы в звонке.";
                    break;
                case "enhancerLittleChangePersonalData":
                    neededComment = "Данные в профиле были изменены в соответствии с паспортными. Было внесено изменение (КАКОЕ).";
                    break;
                case "enhancerEmailChange":
                    neededComment = "Игрок сменил почту по причине (причина смены почты). Почта игрока была изменена с СТАРЫЙАДРЕС на НОВЫЙАДРЕС после отправки письма на почту саппорта, загрузки селфи с паспортом и верификации по телефону";
                    break;
                case "enhancerLittleEmailChange":
                    neededComment = "Почта игрока была изменена с СТАРЫЙАДРЕС на НОВЫЙАДРЕС после отправки письма на почту саппорта.";
                    break;
                case "enhancerPhoneNumberChange":
                    neededComment = "Номер телефона изменен по причине ПРИЧИНА. Игрок загрузил селфи с документом и корректно ответил на вопросы в звонке.";
                    break;
                case "enhancerPassChange":
                    neededComment = "Установлен временный пароль после загрузки селфи с паспортом и звонка игроку.";
                    break;
                case "enhancerCardBlock":
                    neededComment = "Карта КАРТАЗДЕСЬ принадлежит третьему лицу. Игрок уведомлен о том, что при повторном использовании карт третьих лиц аккаунт будет заблокирован.";
                    break;
                case "enhancerWhomAcc":
                    neededComment = "Со слов игрока ИГРОК, аккаунт АККАУНТ принадлежит КОМУ.";
                    break;
                case "enhancerMailChangedAfterSending":
                    neededComment = "Адрес электронной почты изменен с СТАРЫЙАДРЕС на НОВЫЙАДРЕС после отправки письма на почту саппорта.";
                    break;
                case "enhancerMailConfirmedAfterSending":
                    neededComment = "Адрес электронной почты подтвержден после отправки письма на почту саппорта.";
                    break;
            }
            commentBlockScripts.value = neededComment;
        } );
    }

    function enhancerScrollerDuplicates(){
        let el = document.getElementById("user_duplicate_chain_id");
        el.scrollIntoView({block: "center", inline: "center"});
    }

    function getUniqueCards(){
        let tablePaymentsMethods;
        paymentsMethodsPanel.querySelector("h3").innerHTML = paymentsMethodsPanel.querySelector("h3").innerText + `
			<a id="enhancerCopyPaymentsMethodsList">Копировать списком </a>
			 <input type="checkbox" id="enhancerPaymentsCopyOnlyVerified">Только верифицированные</input>
			`;
        document.getElementById("enhancerCopyPaymentsMethodsList").addEventListener("click", function(){
            tablePaymentsMethods = tableToObj(paymentsMethodsPanel.querySelector("table"));
            let onlyVerifiedFlag = document.getElementById("enhancerPaymentsCopyOnlyVerified").checked;
            let cardsList = [];
            for (let value of tablePaymentsMethods){
                console.log(value["Инструмент платежа"]);
                if(onlyVerifiedFlag){
                    if(value["Верифицирован"].match(/(?<=>)(.*?)(?=<)/)[0] == "ДА" && value["Инструмент платежа"].match(/\d{6}\*{6}\d{4}/gim))
                    {
                        cardsList.push(value["Инструмент платежа"]);
                    }
                }
                else{
                    if(value["Инструмент платежа"].match(/\d{6}\*{6}\d{4}/gim)){
                        cardsList.push(value["Инструмент платежа"]);
                    }
                }
            }
            let scriptText = "";
            for(let value of cardsList)
            {
                scriptText += `${value}\n`;
            }
            //console.log(cardsList);


            document.getElementById("enhancerCopyPaymentsMethodsList").style.color = "red";
            navigator.clipboard.writeText(scriptText);
        });
    }

    function vipNotify(status){
        let playerStatus = status;
        if(playerStatus == "default" && enhancer.settings.vipNotifyHighlightDefault == 0){return;}
        let bgEnabled = enhancer.settings.vipNotifyBackgroundColor;
        let currencyBlockEnabled = enhancer.settings.vipNotifyCurrencyBlock;
        let alertEnabled = enhancer.settings.vipNotifyAlert;
        let colors = {
            premium: ["rgba(27, 161, 226, 0.25)", "rgba(27, 161, 226, 1)" ],
            vip: ["rgba(170, 0, 255, 0.25)", "rgba(170, 0, 255, 1)"],
            warning: ["rgba(231, 76, 60, 0.25)", "rgba(231, 76, 60, 1)"],
            default: ["rgba(44, 62, 80, 0.25)","rgba(44, 62, 80, 1)"]
        };
        if(bgEnabled == 1){
            document.body.style.backgroundColor = colors[playerStatus][0];
        }
        if(currencyBlockEnabled == 1){
            casinoCurrencyPanel.querySelector("h3").style.color = "#FAFAFA";
            casinoCurrencyPanel.querySelector("h3").style.backgroundColor = colors[playerStatus][1];
            casinoCurrencyPanel.querySelector("h3").style.backgroundImage = "none";
            casinoCurrencyPanel.querySelector("h3").style.textShadow = "none";
        }
        if(alertEnabled == 1){
            alert("ВНИМАНИЕ! СТАТУС ИГРОКА: " + playerStatus.toUpperCase());
        }
    };
    //vipNotify("warning");



    function injectEnhancerBlock(){// сама функция инжекта

        // пофиксить выборку панели, потому что оно берет ее по номеру, и если у чела самоограничение, то ошибка, потому что номер другой


        var lastDepTime;
        let table = tableToObj(paymentsBlock.querySelector("table"));

        for(let value of table){
            let action = value["Действие"];
            let success = value["Успешно"];
            let actionClean = action.replace(/<\/?[^>]+(>|$)/g, "");
            let successClean = success.replace(/<\/?[^>]+(>|$)/g, "");
            let volnaDepLabel = "Deposit";
            let anyDepLabel = "Депозит";
            let needLabel = projectName == "" ? volnaDepLabel : anyDepLabel;

            if(actionClean == needLabel && successClean == "ДА")
            {
                lastDepTime = value["Завершено в"];
                if(debugMode == 1){console.log("injectEnhancer-lastDepTime: "+lastDepTime);}
                break;
            }
        }

        let blockCashback = 0;
        if(projectName == "-jet" || projectName == "-izzi" || projectName == "-rox" || projectName == "-fresh" || projectName == "-sol" || projectName == ""){
            blockCashback = 0;
        }
        else{
            blockCashback = 1;
            console.log("BLOCK");
            console.log(projectName);
        }

        var enhancerBlock ;
        enhancerBlock = document.createElement( 'div' );
        enhancerBlock.innerHTML = `
									<div class="sidebar_section panel" id="sdt_enhancer_panel">
										<h3 >[SDT Enhancer] User Profile <b><a style="float:right" href="http://tishka.xyz/sdt/" target="_blank">FAQ</a></b></h3>
										<div class="panel_contents" ${enhancer.settings.disableEnhancerBlock == 1 ? "hidden" : ""}>
										<div class="attributes_table">
											<table>
												<tr>
													<td><b><u>СТАТУС:</u></b></td>
													<td><span id="enhancerStatusFlag" class="player-tag" style="display:inline-block">Обычный</span></td>
												</tr>
												<tr ${enhancer.settings.disableAdvancedFlags == 1 ? "hidden" : ""}>
													<td><b><u>ПОЧТА:</u></b></td>
													<td><span id="enhancerEmailFlag" class="player-tag" style="display:inline-block">STATUS</span></td>
												</tr>
												<tr ${enhancer.settings.disableAdvancedFlags == 1 ? "hidden" : ""}>
													<td><b><u>ТЕЛЕФОН:</u></b></td>
													<td><span id="enhancerPhoneFlag" class="player-tag" style="display:inline-block">STATUS</span></td>
												</tr>
												<tr ${enhancer.settings.disableAdvancedFlags == 1 || enhancer.settings.disableDuplicatesBlock == 1 ? "hidden" : ""}>
													<td><b><u>ДУБЛИКАТЫ:</u></b></td>
													<td><span id="enhancerDuplicatesFlag" class="player-tag"  style="display:inline-block">STATUS</span></td>
												</tr>
												<tr ${enhancer.settings.disableAdvancedFlags == 1 || enhancer.settings.addBirthdayLabel == 0 ? "hidden" : ""}>
													<td><b><u>ДАТА ДР:</u></b></td>
													<td><span id="enhancerBirthdayFlag" class="player-tag"  style="display:inline-block">STATUS</span></td>
												</tr>
												<tr>
													<td><b><u>ПРОМО:</u></b></td>
													<td><span id="enhancerSubFlag" class="player-tag"  style="display:inline-block">здесь</span></td>
												</tr>
												<tr ${enhancer.settings.disableAdvancedFlags == 1 ? "hidden" : ""}>
													<td><b><u>РЕЙХСТАГ:</u></b></td>
													<td><a id="enhancerStagFlag" class="player-tag"  style="display:inline-block">здесь</a> <a style="display:inline" id="trelloLink" href="https://trello.com/appSwitcherLogin?login_hint=minsk-support%40jetmail.cc" target="_blank">(TRELLO)</a></td>
												</tr>
											</table>
										</div>
										<div id="enhancerTagList">

										</div>
										<br>
											<div>
												<center>
													<a id="wagerLabel"><img src="data:image/png;base64, ${loaderImage}" height=16 width=16></a></a>
												</center>
													<div class="attributes_table user" id="enhancerWagerTable" >
													<table>
														<tr>
															<td><b><u>ВЕЙДЖЕР</u></b></td>
															<td><a id="enhancerWagerSumLabel"><img src="data:image/png;base64, ${loaderImage}" height=16 width=16></a></td>
														</tr>
														<tr>
															<td><b><u>СЛОТЫ</u></b></td>
															<td><a id="enhancerBetsSumLabel"><img src="data:image/png;base64, ${loaderImage}" height=16 width=16></a></a></td>
														</tr>
														<tr>
															<td><b><u>СПОРТ</u></b></td>
															<td><a id="enhancerSportBetsSumLabel"><img src="data:image/png;base64, ${loaderImage}" height=16 width=16></a></a></td>
														</tr>
													</table>
													</div>
												</div>
												<br>
												<details>
													<summary>Кешбек расчет</summary>
													<div class="attributes_table user" id="enhancerCashbackTable">
													<table ${blockCashback == 1 ? "hidden" : ""}>
														<tr>
															<td><b><u>ВСЕ ВРЕМЯ</u></b></td>
															<td><a id="enhancerCashbackAllTimeDiff"><img src="data:image/png;base64, ${loaderImage}" height=16 width=16></td>
														</tr>
														<tr>
															<td><b><u>РАСЧЕТНЫЙ</u></b></td>
															<td><a id="enhancerCashbackCurrentDiff"><img src="data:image/png;base64, ${loaderImage}" height=16 width=16></a></td>
														</tr>
														<tr>
															<td><b><u>СТАВКИ</u></b></td>
															<td><a id="enhancerCashbackBetsDiff"><img src="data:image/png;base64, ${loaderImage}" height=16 width=16></a></td>
														</tr>
														<tr>
															<td><b><u>КЕШБЕК</u></b></td>
															<td><a id="enhancerCashbackSum"><img src="data:image/png;base64, ${loaderImage}" height=16 width=16></a></td>
														</tr>
													</table>
													<center>
													<p>Расчетный период</p>
															 <input type="date" id="startTrip" name="trip-start">
															 <input type="date" id="endTrip" name="trip-end">
														<button id="openCashbackLinksButton">Стата за период</button>
                                                        <button id="cashbackCount" ${blockCashback == 1 ? "hidden" : ""}>Посчитать</button>
														</center>
													</div>
												</details>
												<details>
													<summary>Скрипты</summary>
														<a id="enhancerScriptPaymentHistory" style="display:inline-block">История деп-вывод</a><br>
														<a id="enhancerScriptPayment20History" style="display:inline-block">История 20</a><br>
														<a id="enhancerScriptTopUserGames" style="display:inline-block">ТОП-6 игр</a>
												</details>
												<br>


												<details id="debugMenu" ${debugMode == 0 ? "hidden" : ""}>
													<summary ">Дебаг</summary>
													<iframe id="wagerParser" hidden src="https://marketing`+projectName+`.lux-casino.co/backend/bets?q%5Baccount_user_id_eq%5D=`+userid+`&q%5Bcreated_at_gteq%5D=`+lastDepTime+`" height="600" width="800"></iframe>
													<button id="parseButton">Parser</button>
													<button id="dbgButton">DEBUG</button>
												   <div class="testBox">
													<a id="testLabel"></a>
												</center>
													<div class="attributes_table user" id="testTable">
													<table>
														<tr>
															<td><b><u>ВЕЙДЖЕР</u></b></td>
															<td><a id="testLabel1"></a></td>
														</tr>
														<tr>
															<td><b><u>СУММА СТАВОК</u></b></td>
															<td><a id="testLabel2"></a></td>
														</tr>
													</table>
													</div>
												</div>
												</details>
												</div>
											</div>
										</div>
									 </div>
								` ;
        let eElement = document.getElementById( 'sidebar' );; // элемент, в которой вкидывает, ставит первым наследником этого объекта
        let newFirstElement = enhancerBlock; // код, который мы инжектим
        eElement.insertBefore(newFirstElement, eElement.firstChild); // инжект
    }

    function enhancerAddTag(tagClass, tagStyle, tagText,){
        document.getElementById("enhancerTagList").innerHTML += `<span class="player-tag ${tagClass}" style="${tagStyle}">${tagText}</span>`;
    };

    function injectElement(elementToInject, anchorElement){

        return 0;
    }


    function injectDuplicatesBlock(){// сама функция инжекта

        // сюда функцию коллекта дублей есть есть
        let duplicatesBlock = document.getElementById("duplications_sidebar_section");
        let duplicatesLabel = duplicatesBlock.querySelector("h3");
        let duplicatesEmailsBlock = document.querySelector(".duplicates_table_container");
        let emailRegex = /([+a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;

        let commentsList = document.getElementById("active_admin_comments_for_user_"+userid).querySelectorAll(".active_admin_comment");
        let commentsBlock = document.getElementById("active_admin_comments_for_user_"+userid);
        if(debugMode == 1){console.log(commentsList);}

        let duplicatesEmails = [...new Set(duplicatesBlock.innerText.match(emailRegex))];
        if(debugMode == 1){console.log(duplicatesEmails);}
        if(debugMode == 1){console.log(commentsList);}
        if(duplicatesEmails.length == 0){return;} // если дублей нет - блок и не нужен
        var duplicatesWithoutComments = [];
        if(duplicatesEmails){
            var duplicatesList = "";
            for(let value of duplicatesEmails)
            {
                let duplicateComment = 0;
                let neededStyle = "";
                let neededText = "";
                if(commentsBlock.innerHTML.match(value)){
                    duplicateComment = 1;
                    neededStyle = "player-tag player-tag-verified";
                    neededText = "";
                    if(debugMode == 1){console.log(value + duplicateComment);}
                    commentsBlock.innerHTML = commentsBlock.innerHTML.replaceAll(value, `<a style='color:green' href="https://marketing${projectName}.lux-casino.co/backend/players/find_user?filters[id_or_email]=${value.replace(/\+/, "%2b")}">${value}</a>`);
                }
                else
                {
                    neededStyle = "player-tag player-tag-asked_for_docs";
                    duplicateComment = 0;
                    neededText = "Нет";
                    duplicatesWithoutComments.push(value);
                    commentsBlock.innerHTML = commentsBlock.innerHTML.replaceAll(value, `<a style='color:green' href="https://marketing${projectName}.lux-casino.co/backend/players/find_user?filters[id_or_email]=${value.replace(/\+/, "%2b")}">${value}</a>`);
                    if(debugMode == 1){console.log(duplicatesWithoutComments);}
                }


                let duplicateLink = "https://marketing"+projectName+".lux-casino.co/backend/players?q%5Bemail_contains%5D="+value.replace(/\+/, "%2b")+"&commit=%D0%A4%D0%B8%D0%BB%D1%8C%D1%82%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C&localized=true&order=id_desc'>"+value;
                let duplicateRow = `<tr>
															<td><span id="enhancerDuplicateAccountComment" class="${neededStyle}" style="display:inline-block">${neededText}</span></td>
															<td><a id="enhancerDuplicateAccount"><a target="_blank" href="${duplicateLink}" >${value}</a></td>
														</tr>
														`;
                //if(debugMode==1){console.log(duplicateRow);}
                duplicatesList += duplicateRow;
            }
        }

        // <tr>
        // 	<td><span id="enhancerDuplicateAccountComment" class="player-tag" style="display:inline-block">Нет комментария</span></td>
        // 	<td><a id="enhancerDuplicateAccount">Дубликат</a></td>
        // </tr>
        var duplicatesBlockElement ;
        duplicatesBlockElement = document.createElement( 'div' );
        //<td><a id="enhancerDuplicateAccount">Тест</a></td>
        duplicatesBlockElement.innerHTML = `
									<div class="sidebar_section panel" id="sdt_duplicates_panel" ${enhancer.settings.disableDuplicatesBlock == 1 ? "hidden" : ""}>
										<h3>[SDT Enhancer] User Duplicates</h3>
										<div class="panel_contents">
										<div class="attributes_table">
											<table>
											${duplicatesList}
											<tr>
											<td><a id="enhancerDuplicateAccountScript">Скрипт</a></td>
											</tr>
											</table>
										</div>
												</div>
											</div>
										</div>
									 </div>
								` ;
        var duplicatesWithoutCommentsScript = "";

        let duplicatesScript = "";
        //let duplicatesEmailsSet = [...new Set(duplicatesEmails)];
        let duplicatesListScript = "";

        switch(duplicatesWithoutComments.length)
        {
                // акк один
            case 1:
                duplicatesScript = `Уточните, пожалуйста, вам знаком аккаунт ${duplicatesWithoutComments[0]}?`;
                break;
                // аккаунтов две штуки
            case 2:
                duplicatesScript = `Уточните, пожалуйста, вам знакомы аккаунты ${duplicatesWithoutComments[0]} и ${duplicatesWithoutComments[1]}?`;
                break;
                // аккаунтов больше
            default:
                duplicatesList = "";
                for(let value of duplicatesWithoutComments)
                {
                    duplicatesList = duplicatesList+value+", ";
                }
                duplicatesList = duplicatesList.slice(0,-2);
                duplicatesScript = `Уточните, пожалуйста, вам знакомы данные аккаунты: ${duplicatesList}?`;
                break;
        }

        if(debugMode ==1) {console.log(duplicatesScript);}
        let eElement = document.getElementById( 'sidebar' );; // элемент, в которой вкидывает, ставит первым наследником этого объекта
        let newFirstElement = duplicatesBlockElement; // код, который мы инжектим
        eElement.insertBefore(newFirstElement, eElement.firstChild.nextSibling); // инжект
        document.getElementById("enhancerDuplicateAccountScript").addEventListener("click", function(){
            navigator.clipboard.writeText(duplicatesScript);
            document.getElementById("enhancerDuplicateAccountScript").style.color = "red";
        });
        //
    }
    // if(debugMode == 1){injectDuplicatesBlock();}


    async function enhancePayments(){
        let paymentsTable = paymentsBlock.querySelector("table");
        let payments = tableToObj(paymentsTable);

        let waitingCounter = 0;
        let processingCounter = 0;
        let scriptToCopy = "";

        let currentRowsCount = paymentsTable.querySelectorAll("tr").length;
        let rowsCounter = 1;
        function numberRows(){
            paymentsTable = paymentsBlock.querySelector("table");
            let headerRow = document.createElement("th");
            headerRow.class = "col-number";
            headerRow.innerHTML = "НОМЕР";
            paymentsTable.querySelector("thead").querySelector("tr").prepend(headerRow);
            let rows = paymentsTable.querySelector("tbody").querySelectorAll("tr");
            for(let value of rows){
                if(value.querySelector(".col-number")){
                    console.log("1");
                    continue;
                }
                let rowNum = document.createElement("td");
                rowNum.className = "col-number";
                rowNum.innerHTML = rowsCounter;
                value.prepend(rowNum);
                rowsCounter++;
            }
        }
        numberRows();
        rowsCounter = 1;
        document.querySelector(".player-action-all-payments").addEventListener("click", async function(){
            while(true){
                if(paymentsBlock.querySelector("table").querySelectorAll("tr").length != currentRowsCount){
                    numberRows();
                    rowsCounter = 1;
                    break;
                }
                await sleep(100);
            }

        });
        paymentsBlock.querySelector("h3").innerHTML += ` [<a id="enhancerPaymentsScriptCopy"> Скрипт заявок на вывод </a>]`;
        for(let value of payments){
            if(value["Действие"].match(/(?<=>).*(?=<)/g)[0] != "Выплаты" && value["Действие"].match(/(?<=>).*(?=<)/g)[0] != "Cashout") continue; // скипаем депы пока что
            // console.log(value["Действие"].match(/(?<=>).*(?=<)/g)[0]);
            switch(value["Успешно"].match(/(?<=>).*(?=<)/g)[0]){
                case "ОЖИДАЕТ":
                    waitingCounter++;
                    break;
                case "В ОБРАБОТКЕ":
                    processingCounter++;
                    break;
            }
        }
        // Если только одна заявка в ожидании и нет в обработке
        if(waitingCounter == 1 && processingCounter == 0){
            scriptToCopy = `ваша заявка на вывод средств ожидает обработки. Как правило, заявки на выплату обрабатываются специалистами в течение пары часов, максимальное время обработки финансовым отделом составляет 4 часа. Ожидайте, пожалуйста.`;
        }
        // если несколько в ожидании и нет в обработке
        if(waitingCounter > 1 && processingCounter == 0){
            scriptToCopy = `ваши заявки на вывод средств ожидают обработки. Как правило, заявки на выплату обрабатываются специалистами в течение пары часов, максимальное время обработки финансовым отделом составляет 4 часа. Ожидайте, пожалуйста.`;
        }
        // если нет в ожидании и только одна в обработке
        if(waitingCounter == 0 && processingCounter == 1){
            scriptToCopy = `ваша заявка была одобрена финансовым отделом. Пожалуйста, ожидайте обработки вашей заявки платёжной системой. Как правило, это занимает до 24 часов.`;
        }
        // если нет в ожидании и больше одной в обработке
        if(waitingCounter == 0 && processingCounter > 1){
            scriptToCopy = `ваши заявки были одобрены финансовым отделом. Пожалуйста, ожидайте обработки ваших заявок платёжной системой. Как правило, это занимает до 24 часов.`;
        }
        // если одна в ожидании и одна в обработке
        if(waitingCounter == 1 && processingCounter == 1){
            scriptToCopy = `одна из ваших заявок была одобрена финансовым отделом и передана в обработку платежной системе, вторая заявка на данный момент ожидает рассмотрения финансовым отделом.`;
        }
        document.getElementById("enhancerPaymentsScriptCopy").addEventListener("click", function(){
            navigator.clipboard.writeText(scriptToCopy);
        });
        //console.log(`Ожидает: ${waitingCounter}. В обработке: ${processingCounter}.`);
    }



    function enhancePaymentsPage(){
        // сделать скрипт для копирования инфы о пейменте в тикет
        let paymentSum = document.querySelector(".row.row-amount").querySelector("td").innerText;
        let paymentId = window.location.href.split("/")[5];
        let paymentCreatedAt = document.querySelector(".row.row-created_at").querySelector("td").innerText

        let scriptText = `ID: ${paymentId}\nСумма: ${paymentSum}\nВремя: ${paymentCreatedAt}`;
        console.log(scriptText);
        navigator.clipboard.writeText(scriptText);
        document.getElementById("enhancerCopyTicketScript").style.color = "red";
    }
    //enhancePaymentsPage();

    function enhanceBetsPage(){
        // сделать скрипт для копирования инфы о ставке в тикет

        let betId = window.location.href.split("/")[5];
        let betGameName = document.querySelector(".row.row-game_table").querySelector("td").innerText;
        let betCreatedAt = document.querySelector(".row.row-created_at").querySelector("td").innerText;
        let betSum = document.querySelector(".row.row-total_bets_money").querySelector("td").innerText;
        let betBalanceBefore = document.querySelector(".row.row-balance_before_money").querySelector("td").innerText
        let betBalanceAfter = document.querySelector(".row.row-balance_after_money").querySelector("td").innerText;

        let scriptText = `Игра: ${betGameName}\nID ставки: ${betId}\nВремя: ${betCreatedAt}\nСтавка: ${betSum}\nБаланс до: ${betBalanceBefore}\nБаланс после: ${betBalanceAfter}\n`;
        navigator.clipboard.writeText(scriptText);
        document.getElementById("enhancerCopyTicketScript").style.color = "red";
        console.log(scriptText);
    }
    //enhanceBetsPage();
    function birthdayAvailabilityChecker(){
        let reason = "";
        let available = 1;
        // 1. Наличие группы "Happy Birthday" в профиле (заменяет пункты 1 и 2 из условий ручного начисления);
        if(projectName == "-jet" || projectName == "-rox" || projectName == "-fresh"){
            if(!groupsPanel.innerText.match(/Happy Birthday/)){
                reason += `Нет нужного количества депозитов\n`;
                available = 0;
            }
        }
        if(projectName == "-sol" || projectName == ""){
            if(!groupsPanel.innerText.match(/HAPPY BIRTHDAY BONUS/) && groupsPanel.innerText.match(/HAPPY BIRTHDAY \(NO BONUS\)/)){
                reason += `Нет нужного количества депозитов\n`;
                available = 0;
            }
        }
        if(projectName == "-izzi"){
            if(!groupsPanel.innerText.match(/HAPPY BIRTHDAY/)){
                reason += `Нет нужного количества депозитов\n`;
                available = 0;
            }
        }
        // 2. В профиле пользователя проставлен тег "VERIFIED";
        let isProfileVerified = tagsPanel.innerText.match(/verified/);
        if(!isProfileVerified){
            reason += `Аккаунт не верифицирован\n`;
            available = 0;
        }
        // 3. У пользователя нет дублирующих аккаунтов;
        if(enhancer.userProfile.restrictions == 1){
            reason += `Установлены ограничения\n`;
            available = 0;
        }
        // 4. Адрес почты в профиле подтвержден.
        if(!enhancer.userProfile.emailConfirmed){
            reason += `Почта не подтверждена\n`;
            available = 0;
        }
        //projectName == "-jet" || projectName == "-rox" || projectName == "-fresh"

        console.log(reason);
        let out = [available, reason];
        return out;

    }


    function enhanceBirthday(){
        let birthDate = document.querySelector(".row.row-date_of_birth").querySelector("td").innerText;
        let birthdayFlag = 	document.getElementById("enhancerBirthdayFlag");
        if(birthDate == "ПУСТО"){
            birthdayFlag.classList.add('player-tag-asked_for_docs');
            birthdayFlag.innerHTML = `Не указана`;
        }
        else{

            //birthdayFlag.classList.add('player-tag-verified');
            birthdayFlag.innerHTML = `${birthDate}`;
            let currentDate = new Date(birthDate);
            let currentYear = new Date(Date.now()).getFullYear();
            currentDate.setFullYear(currentYear);
            let checker = birthdayAvailabilityChecker();
            let isBonusAvailable = checker[0];
            let unavailableReason = checker[1];
            if(!isBonusAvailable){
                birthdayFlag.addEventListener("click", function(){
                    alert(unavailableReason);
                });
                birthdayFlag.classList.add('player-tag-asked_for_docs');
                return;
            }

            let diff = Date.now()/1000 - currentDate.getTime()/1000;
            let weekDiff = 604800;
            let dayDiff = 86400;
            let isBirthdayToday = diff > 0 && diff <= dayDiff;
            let isBirthdayWeek = diff > 0 && diff < weekDiff;
            if(isBirthdayToday || isBirthdayWeek)
            {
                // др сегодня
                birthdayFlag.style.backgroundColor = "#653294";
            }
            // else if(){
            // 	// Идет неделя после др
            // 	birthdayFlag.style.backgroundColor = "#653294";
            // }
            else if(diff < 0 && Math.abs(diff) < weekDiff)
            {
                // Идет неделя перед др
                birthdayFlag.style.backgroundColor = "#fb9e00";

            }
            else{
                birthdayFlag.classList.add('player-tag-verified');
                //birthdayFlag.style.backgroundColor = "#fb9e00";
            }
        }
    }


    function enhanceFreespins(){
        let freespinsTable = tableToObj(casinoFreespinsPanel.querySelector("table"));
        let currentFreespin = 0;
        let activeFreespinsCount = 0;

        for(let value of freespinsTable){
            let freespinState = value['Состояние'];
            let freespinName = value.ID.match(/(?<=>).*(?=<)/g)[0];
            if(freespinState.match(/Активирован|Выдан/) != null){
                activeFreespinsCount++;
                casinoFreespinsPanel.querySelector("table").querySelector("tbody").querySelectorAll("tr")[currentFreespin].querySelector(".col.col-id").innerHTML += ` <span class="player-tag  player-tag-Premium">Активен</span>`;
            }
            if(enhancer.settings.highlightVipBonuses == true){
                for(let value of includedBonuses){
                    if(freespinName == value.bonusName){
                        casinoFreespinsPanel.querySelector("table").querySelector("tbody").querySelectorAll("tr")[currentFreespin].querySelector(".col.col-id").innerHTML += ` <span class="player-tag" style="background-color:#f44e3b">PERSONAL VIP</span>`;
                    }
                }
            }
            currentFreespin++;
        }
        if(activeFreespinsCount > 0){
            enhancerAddTag("","background-color:#653294", "Активные фриспины");
        }
    }

    async function enhanceBonusesListPage(){
        let includedBonusesList = await getHighlightedBonusesList();
        let bonusesTable = document.getElementById("index_table_bonus_issues").querySelector("tbody");
        let bonusesList = bonusesTable.querySelectorAll("tr");
        for(let value of bonusesList){
            let bonusName = value.querySelector(".col.col-title").innerText;
            for(let currentBonus of includedBonusesList){
                if(bonusName == currentBonus.bonusName){
                    // если есть такой в списке выделенных, то
                    value.classList.remove("even");
                    value.style.backgroundColor = "#e73c3c66";
                }
            }
        }
        console.log(bonusesList[1]);
    }
    async function enhanceFreespinsListPage(){
        let includedBonusesList = await getHighlightedBonusesList();
        let freespinsTable = document.getElementById("index_table_freespin_issues").querySelector("tbody");
        let freespinsList = freespinsTable.querySelectorAll("tr");
        for(let value of freespinsList){
            let freespinName = value.querySelector(".col.col-title").innerText;
            for(let currentBonus of includedBonusesList){
                if(freespinName == currentBonus.bonusName){
                    // если есть такой в списке выделенных, то
                    value.classList.remove("even");
                    value.style.backgroundColor = "#e73c3c66";
                }
            }
        }
        console.log(freespinsList[1]);
    }



    async function enhanceBonuses(){

        //
        let bonusesTable = tableToObj(casinoBonusesPanel.querySelector("table"));
        let currentBonus = 0; // ID текущего бонуса
        let activeBonusesCount = 0; // каунт активных бонусов
        //
        let totalBonusesSum = 0;
        let totalBonusesWager = 0;
        let totalBonusesWagerBets = 0;
        //
        for(let value of bonusesTable){
            let needWager = 0;
            if(bonusesTable.length == 0){return;}
            let bonusName = value.ID.match(/(?<=>).*(?=<)/g)[0]; // название бонуса
            let bonusSum = value["Сумма"]; // сумма бонуса
            let bonusState = value["Состояние"]; // состояние бонуса: Активен, Проигран и т.д.
            // достаем сумму общую сумму вейджера и уже откгрынную
            let bonusWager = Number.parseInt(value["Вэйджер"].split("/")[1].replace(/\([0-9]+ %\)/, "").replace(/[A-Z][A-Z][A-Z]/, "").replace(/\s/g,"").trim()); // общий вейджер
            let bonusBetsSum = Number.parseInt(value["Вэйджер"].split("/")[0].replace(/[A-Z][A-Z][A-Z]/, "").replace(/\s/,"").trim()); // сколько уже совершил ставок
            needWager = bonusWager - bonusBetsSum; // считаем сколько осталось отыграть для конкретного бонуса
            //
            //console.log(`Бонус ${bonusName} в состоянии ${bonusState}. Сумма бонуса: ${bonusSum}. Вейджер ${bonusWager}. Отыграно: ${bonusBetsSum}. Осталось отыграть: ${needWager}`);
            // если бонус активен, добавляем его сумму ставок и вейджер в общие
            if(enhancer.settings.highlightVipBonuses == true){
                for(let value of includedBonuses){
                    if(bonusName == value.bonusName){
                        casinoBonusesPanel.querySelector("table").querySelector("tbody").querySelectorAll("tr")[currentBonus].querySelector(".col.col-id").innerHTML += ` <span class="player-tag" style="background-color:#f44e3b">PERSONAL VIP</span>`;
                    }
                }
            }
            if(bonusName.match(/BEZDEP/) != null)
            {
                casinoBonusesPanel.querySelector("table").querySelector("tbody").querySelectorAll("tr")[currentBonus].querySelector(".col.col-id").innerHTML += ` <span class="player-tag  player-tag-Premium">BEZDEP</span>`;
            }
            if(bonusName.match(/HAPPY BIRTHDAY/) != null)
            {
                casinoBonusesPanel.querySelector("table").querySelector("tbody").querySelectorAll("tr")[currentBonus].querySelector(".col.col-id").innerHTML += ` <span class="player-tag" style="background-color:#fb9e00">HAPPY BIRTHDAY</span>`;
            }
            if(bonusName.match(/COUPON/) != null)
            {
                casinoBonusesPanel.querySelector("table").querySelector("tbody").querySelectorAll("tr")[currentBonus].querySelector(".col.col-id").innerHTML += ` <span class="player-tag" style="background-color:#653294">STREAMER</span>`;
            }
            if(bonusName.match(/Freespin Set/) != null)
            {
                casinoBonusesPanel.querySelector("table").querySelector("tbody").querySelectorAll("tr")[currentBonus].querySelector(".col.col-id").innerHTML += ` <span class="player-tag" style="background-color:#68bc00">ALTERNATIVE</span>`;
            }
            if(bonusState == "Активный"){
                activeBonusesCount++;
                totalBonusesWager = totalBonusesWager + needWager; // добавляем ОСТАВШУЮСЯ СУММУ ОТЫГРЫША КОНКРЕТНОГО БОНУСА
                casinoBonusesPanel.querySelector("table").querySelector("tbody").querySelectorAll("tr")[currentBonus].querySelector(".col.col-sostoyanie").innerHTML = `<a id="bonusWagerScript-${currentBonus}">${casinoBonusesPanel.querySelector("table").querySelector("tbody").querySelectorAll("tr")[currentBonus].querySelector(".col.col-sostoyanie").innerHTML} </a>(${needWager} ${userCurrency})`;


                document.getElementById("bonusWagerScript-" + currentBonus).addEventListener("click", function(){
                    navigator.clipboard.writeText(`Для отыгрыша активного бонуса вам необходимо совершить ставок на сумму ${toRightForm(needWager, userCurrency)}.`);
                });
            }

            currentBonus++;
        }
        casinoBonusesPanel.querySelector("h3").innerHTML = casinoBonusesPanel.querySelector("h3").innerHTML + ` <a id="bonusWagerTotalScript">Скрипт суммы бонусов </a> [ WAGER: ${totalBonusesWager} ]`;
        if(activeBonusesCount >= 2){
            enhancerAddTag("","background-color:#fb9e00", "Активный бонус");
            document.getElementById("bonusWagerTotalScript").addEventListener("click", function(){
                navigator.clipboard.writeText(`Для отыгрыша активных бонусов вам необходимо совершить ставок на сумму ${toRightForm(totalBonusesWager, userCurrency)}.`);
            });
        }
        else if(activeBonusesCount == 1)
        {
            enhancerAddTag("","background-color:#fb9e00", "Активный бонус");
            document.getElementById("bonusWagerTotalScript").addEventListener("click", function(){
                navigator.clipboard.writeText(`Для отыгрыша активного бонуса вам необходимо совершить ставок на сумму ${toRightForm(totalBonusesWager, userCurrency)}.`);
            });
        }
    }


    function birthdateChecker(){
        console.log("1");
        let birthdate = document.querySelector(".row.row-date_of_birth").querySelector("td").innerText;
        if(birthdate != "ПУСТО"){
            birthdate = new Date(birthdate);
            let birthdateSeconds = birthdate.getTime() / 1000;
            let dateNow = new Date();

            dateNow = dateNow.getTime() / 1000;
            let diff = dateNow - birthdateSeconds;
            if(Math.abs(diff) < 604800){
                enhancerAddTag("","background-color:#fb9e00", "Период ДР");
            }
            console.log("Дифф:  " + diff);
            console.log(birthdateSeconds, dateNow);
        }
    }
    //birthdateChecker();
    async function trelloBonusFinder(query){
        let boardId = {jet: "5f1e9a8c5aaec75d35f2adfc", fresh: "5aeadf4dc15b8ed3256e50ee", izzi:"619b48e4260f7a199427e872", rox: "597859883068891d82539c61", sol: "5bffcd913b67598bf0905c3b", vulcan: "62388a86c72d0051fa384a88"};
        let token = "ea983c2fb944eb3f5ec4977b4e205e03a27df351580f0c37485ad11a46728864";
        let key = "853acd332be328f69694cb2ccf58d778";
        let idBoard = projectName == "" ? boardId["vulcan"] : boardId[projectName.slice(1,100)];
        let fetchedData = await fetch(`https://api.trello.com/1/search?query=${query}&key=${key}&token=${token}&idBoards=${idBoard}`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            //console.log(data);
            return data;
        });
        if(fetchedData.cards[0] != undefined){
            console.log(fetchedData.cards[0].desc);
            //console.log(fetchedData.cards[0].name);
            //alert(fetchedData.cards[0].name);
            return 1;
        }
        //console.log(fetchedData);
    }

    //await trelloBonusFinder("181662");
    function enhanceDocuments(){
        let documentsTable = casinoDocumentsPanel.querySelector("table");
        let documents = JSON.parse(documentsTable.getAttribute("data-documents"));
        let removedDocsCounter = 0;
        let waitingForApprovalCounter = 0;

        for(let value of documents){
            if(value["removed"] == true){
                removedDocsCounter++;
            }
            if(value["status"] == "pending" && value["removed"] == !true){
                waitingForApprovalCounter++;
            }
        }
        if(removedDocsCounter > 0){
            enhancerAddTag("","background-color:#f44e3b", "Фото в удаленных");
            casinoDocumentsPanel.querySelector("h3").innerHTML += ` <span class="player-tag " style="background-color:#f44e3b">УДАЛЕННЫЕ</span>`;
        }
        if(waitingForApprovalCounter > 0){
            enhancerAddTag("","background-color:#fb9e00", "Фото ожидают");
        }
    }


    function statusChecker(){
        let excludedTags = ["chargeback_vip", "bezdepvip"]; // список тегов
        if(projectName != "-izzi" && projectName != "")
        {
            let userTags = document.querySelector(".current-tags").innerText;
            let userStatuses = {default: 1, premium: 0, vip: 0, warning: 0};
            let userTagsNew = JSON.parse(document.getElementById("user_tags").getAttribute("data-tags"));
            for(let value of userTagsNew){
                if(value.match(/Premium/) != null){
                    userStatuses.premium = 1;
                    userStatuses.default = 0;
                }
                if(value.match(/VIP|vip|Vip/i) != null && !excludedTags.includes(value)){
                    userStatuses.vip = 1;
                    userStatuses.default = 0;
                }
                if(value.match(/carder|nocard|no-bonus|BonusHunter|sport_suspect|\bchargeback\b|no_bonus/i) != null){
                    userStatuses.warning = 1;
                    userStatuses.default = 0;
                }
                // console.log(userStatuses);
            }

            let enhancerStatusFlag = document.getElementById("enhancerStatusFlag");
            if(userStatuses.vip != 0)
            {
                if(enhancer.settings.vipNotifyHighlightVip == 1) vipNotify("vip");
                document.getElementById("page_title").innerHTML += `<b style="color:purple"> [VIP]</b>`;
                enhancerStatusFlag.innerHTML = "VIP";
                // alert
                enhancerStatusFlag.classList.add('player-tag-vip');
            }
            else if(userStatuses.premium != 0)
            {
                if(enhancer.settings.vipNotifyHighlightPremium == true) vipNotify("premium");
                document.getElementById("page_title").innerHTML += `<b style="color:blue"> [PREMIUM]</b>`;
                enhancerStatusFlag.innerHTML = "PREMIUM";
                enhancerStatusFlag.classList.add('player-tag-Premium');
            }
            else{
                enhancerStatusFlag.classList.add('player-tag-verified');
                if(enhancer.settings.vipNotifyHighlightDefault == 1) vipNotify("default");
            }
            if(userStatuses.warning != 0)
            {
                vipNotify("warning");
                document.getElementById("page_title").innerHTML += `<b style="color:red"> [WARNING]</b>`;
                enhancerStatusFlag.innerHTML = "ВНИМАНИЕ!";
                enhancerStatusFlag.classList.add('player-tag-asked_for_docs');
            }
            // /carder|nocard|no-bonus|BonusHunter|sport_suspect/
        }

        //  волна теги другие, принцип иззи = смотрим по группе

        if(projectName == ""){
            let pointsTable = tableToObj(casinoPointsPanel.querySelector("table"));
            let statusPoints;
            for(let value of pointsTable)
            {
                if(value["Тип аккаунта"] == "Статусные"){
                    statusPoints = parseInt(value["Баллы"]);
                }
            }
            console.log("Статусных баллов" + statusPoints);
            let userTags = document.querySelector(".current-tags").innerText;
            let userStatuses = {default: 1, premium: 0, vip: 0, warning: 0};
            let userTagsNew = JSON.parse(document.getElementById("user_tags").getAttribute("data-tags"));
            let enhancerStatusFlag = document.getElementById("enhancerStatusFlag");

            for(let value of userTagsNew){
                if(value.match(/carder|nocard|no-bonus|BonusHunter|sport_suspect|chargeback|no_bonus/i) != null){
                    userStatuses.warning = 1;
                    userStatuses.default = 0;
                }

            }


            let userGroups = groupsPanel.querySelectorAll("span");


            for(let value of userGroups)
            {
                switch(value.innerText)
                {
                    case "Group: Новичок":
                        if(statusPoints > 1500) alert("Много баллов, аккаунт не верифицирован!");
                        if(debugMode == 1){console.log("Найден тег иззи: Новичок");}
                        if(enhancer.settings.vipNotifyHighlightDefault == 1) vipNotify("default");
                        enhancerStatusFlag.classList.add('player-tag-asked_for_docs');
                        enhancerStatusFlag.innerHTML = "Новичок";
                        enhancer.userProfile.userStatus = "Новичок";
                        break;
                    case "Group: Знаток":
                        if(debugMode == 1){console.log("Найден тег волна: Знаток");}
                        if(enhancer.settings.vipNotifyHighlightDefault == 1) vipNotify("default");
                        enhancerStatusFlag.innerHTML = "Знаток";
                        enhancerStatusFlag.classList.add('player-tag-verified');
                        enhancer.userProfile.userStatus = "Знаток";
                        break;
                    case "Group: Мастер":
                        if(debugMode == 1){console.log("Найден тег волна: Мастер");}
                        if(enhancer.settings.vipNotifyHighlightPremium == true) vipNotify("premium");
                        document.getElementById("page_title").innerHTML += `<b style="color:blue"> [PREMIUM]</b>`;
                        enhancerStatusFlag.innerHTML = "Мастер";
                        enhancer.userProfile.userStatus = "Мастер";
                        enhancerStatusFlag.classList.add('player-tag-Premium');
                        break;
                    case "Group: Профессионал":
                        if(debugMode == 1){console.log("Найден тег волна: профессонал");}
                        if(enhancer.settings.vipNotifyHighlightVip == 1) vipNotify("vip");
                        document.getElementById("page_title").innerHTML += `<b style="color:purple"> [VIP]</b>`;
                        enhancerStatusFlag.innerHTML = "Профессионал";
                        enhancer.userProfile.userStatus = "Профессионал";
                        enhancerStatusFlag.classList.add('player-tag-vip');
                        break;
                    default:
                        if(debugMode == 1){console.log("Проверка группы ИЗЗИ: "+value.innerText);}
                        break;
                }
            }
            if(userStatuses.warning != 0)
            {
                document.getElementById("page_title").innerHTML += `<b style="color:red"> [WARNING]</b>`;
                enhancerStatusFlag.innerHTML = "ВНИМАНИЕ!";
                enhancerStatusFlag.classList.add('player-tag-asked_for_docs');
                vipNotify("warning");
            }


        }

        if(projectName == "-izzi")
        {
            let userTags = document.querySelector(".current-tags").innerText;
            let userStatuses = {default: 1, premium: 0, vip: 0, warning: 0};
            let userTagsNew = JSON.parse(document.getElementById("user_tags").getAttribute("data-tags"));
            let enhancerStatusFlag = document.getElementById("enhancerStatusFlag");

            for(let value of userTagsNew){
                if(value.match(/carder|nocard|no-bonus|BonusHunter|sport_suspect|chargeback|no_bonus/i) != null){
                    userStatuses.warning = 1;
                    userStatuses.default = 0;
                }

            }


            let userGroups = groupsPanel.querySelectorAll("span");



            for(let value of userGroups)
            {
                switch(value.innerText)
                {
                    case "Group: NEW":
                        if(debugMode == 1){console.log("Найден тег иззи: new");}
                        if(enhancer.settings.vipNotifyHighlightDefault == 1) vipNotify("default");
                        enhancerStatusFlag.classList.add('player-tag-asked_for_docs');
                        enhancerStatusFlag.innerHTML = "NEW";
                        enhancer.userProfile.userStatus = "NEW";
                        break;
                    case "Group: REGULAR":
                        if(debugMode == 1){console.log("Найден тег иззи: REGULAR");}
                        if(enhancer.settings.vipNotifyHighlightDefault == 1) vipNotify("default");
                        enhancerStatusFlag.innerHTML = "REGULAR";
                        enhancerStatusFlag.classList.add('player-tag-verified');
                        enhancer.userProfile.userStatus = "REGULAR";
                        break;
                    case "Group: PREMIUM":
                        if(debugMode == 1){console.log("Найден тег иззи: Premium");}
                        if(enhancer.settings.vipNotifyHighlightPremium == true) vipNotify("premium");
                        document.getElementById("page_title").innerHTML += `<b style="color:blue"> [PREMIUM]</b>`;
                        enhancerStatusFlag.innerHTML = "PREMIUM";
                        enhancer.userProfile.userStatus = "PREMIUM";
                        enhancerStatusFlag.classList.add('player-tag-Premium');
                        break;
                    case "Group: VIP":
                        if(debugMode == 1){console.log("Найден тег иззи: VIP");}
                        if(enhancer.settings.vipNotifyHighlightVip == 1) vipNotify("vip");
                        document.getElementById("page_title").innerHTML += `<b style="color:purple"> [VIP]</b>`;
                        enhancerStatusFlag.innerHTML = "VIP";
                        enhancer.userProfile.userStatus = "VIP";
                        enhancerStatusFlag.classList.add('player-tag-vip');
                        break;
                    default:
                        if(debugMode == 1){console.log("Проверка группы ИЗЗИ: "+value.innerText);}
                        break;
                }
            }
            if(userStatuses.warning != 0)
            {
                document.getElementById("page_title").innerHTML += `<b style="color:red"> [WARNING]</b>`;
                enhancerStatusFlag.innerHTML = "ВНИМАНИЕ!";
                enhancerStatusFlag.classList.add('player-tag-asked_for_docs');
                vipNotify("warning");
            }

        }


    }

    function selfExclusionCheck(){
        if(selfExclusionPanel){
            enhancerAddTag('player-tag-asked_for_docs', "", "Самоограничение");
        }
    }


    // чекер мошенники фрод
    async function fraudChecker(){
        // enhancer.userProfile = {firstName: firstName, lastName: lastName, birthdate: birthdate};
        let fraudParser = await createParser(`https://marketing${projectName}.lux-casino.co/backend/players?q[profile_first_name_equals]=${enhancer.userProfile.firstName}&q[profile_last_name_equals]=${enhancer.userProfile.lastName}&commit=%D0%A4%D0%B8%D0%BB%D1%8C%D1%82%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C&localized=true&order=id_desc&scope=all`, `fraudChecker`);
        let duplicatesCount = fraudParser.contentWindow.document.querySelector(".pagination_information").querySelector("b").innerText;
        if(duplicatesCount > 1 && duplicatesCount < 3){
            enhancerAddTag('', "background-color:#fb9e00", `${duplicatesCount} аккаунтов с ФИО`);
        }
        else if(duplicatesCount < 10){
            enhancerAddTag('', "background-color:#fb9e00", `${duplicatesCount} аккаунтов с ФИО`);
        }
        else{
            enhancerAddTag('player-tag-asked_for_docs', "", `${duplicatesCount} аккаунтов с ФИО`);
            vipNotify("warning");
            alert(`Количество дубликатов с ФИО: ${duplicatesCount}`);
        }
    }




    function checkEmail(){
        var emailVerifiedFlag = document.querySelector(".player-statuses").getElementsByTagName("th")[0].innerText;
        //document.querySelector(".player-statuses").getElementsByTagName("th")[0].innerText
        // новый чекер:
        // АКТИВНЫЙ активный акк
        // НЕ ПОДТВЕРЖДЁН почта не привязана
        // ЗАБЛОКИРОВАН заблокирован
        // ОТКЛЮЧЕНО: ВРУЧНУЮ
        //
        if(debugMode == 1){console.log("checkEmail:emailVerifiedFlag:"+emailVerifiedFlag);}
        var isEmailVerified;
        var enhancerEmailFlag = document.getElementById("enhancerEmailFlag");
        if(emailVerifiedFlag == "АКТИВНЫЙ")
        {
            if(debugMode == 1){console.log("checkEmail: подтверждена");}
            enhancerEmailFlag.innerText = "Подтверждена";
            enhancerEmailFlag.classList.add('player-tag-verified');
            enhancer.userProfile.emailConfirmed = 1;
        }
        else if(emailVerifiedFlag == "НЕ ПОДТВЕРЖДЁН")
        {
            if(debugMode == 1){console.log("checkEmail: не подтверждена");}
            enhancerEmailFlag.innerText = "Не подтверждена";
            enhancerEmailFlag.classList.add('player-tag-asked_for_docs');
        }
        else if(emailVerifiedFlag == "ОТКЛЮЧЕНО: ВРУЧНУЮ")
        {
            if(debugMode == 1){console.log("checkEmail: отключен вручную");}
            enhancerEmailFlag.innerText = "Отключен";
            enhancerEmailFlag.classList.add('player-tag-asked_for_docs');
        }
        else if(emailVerifiedFlag == "ЗАБЛОКИРОВАН")
        {
            if(debugMode == 1){console.log("checkEmail: блок попытки");}
            enhancerEmailFlag.innerText = "Попытки входа";
            enhancerEmailFlag.classList.add('player-tag-asked_for_docs');
        }
        else
        {
            if(debugMode == 1){console.log("checkEmail: заблокирован");}
            enhancerEmailFlag.innerText = "Заблокирован";
            enhancerEmailFlag.classList.add('player-tag-asked_for_docs');
        }


    }

    async function parseData(type){
        let parserDebug = 1;
        console.log("parser started");
        let parser = document.createElement("iframe");
        if(type == "topUserGames")
        {

            parser.setAttribute("src", "https://marketing"+projectName+".lux-casino.co/backend/players/"+userid+"/player_games?order=ratio_wins_loss_desc");
            parser.setAttribute("id","dataParser");
            let parserElement = document.getElementById("debugMenu");
            parserElement.insertBefore(parser, parserElement.firstChild);
            await sleep(1500);
            // СТАРТ ОБРАБОТКИ ДАННЫХ
            let table = tableToObj(parser.contentWindow.document.querySelector("table"));
            var gamesCount = 0;
            var gamesArchive = "";
            for(let value of table)
            {
                if(gamesCount > 6){break;}
                let game = value["Game"].split(">")[1].split("<")[0];
                let winPercent = parseInt(value[`<a href="/backend/players/`+userid+`/player_games?order=ratio_wins_loss_asc">Выплата</a>`].split(">")[1].split("<")[0]);
                if(winPercent > 100){
                    gamesArchive += game + ", ";
                    gamesCount++;
                }
            }
            gamesArchive = gamesArchive.substring(0, gamesArchive.length-2) + ".";
            navigator.clipboard.writeText("У вас наблюдалась хорошая статистика в следующих играх: "+gamesArchive);
            document.getElementById("enhancerScriptTopUserGames").style.color = "red";
        }
        parser.remove();
    }

    // Открывает ссылки для кэшбэка
    function openCashbackLinks(){
        var startTrip = document.getElementById("startTrip").value;
        var endTrip = document.getElementById("endTrip").value;
        window.open("https://marketing"+projectName+".lux-casino.co/backend/players_reports?q%5Bcreated_at_gteq_datetime%5D="+startTrip+"&q%5Bcreated_at_lteq_datetime%5D="+endTrip+"&q%5Bcurrency_eq%5D="+userCurrency+"&q%5Buser_email_eq%5D="+userEmail+"&commit=%D0%A4%D0%B8%D0%BB%D1%8C%D1%82%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C&localized=true", '_blank');
        var correctDate = new Date(document.getElementById("endTrip").value);
        correctDate.setDate(correctDate.getDate()+1);
        correctDate = correctDate.getFullYear()+"-"+String(correctDate.getMonth()+1)+"-"+correctDate.getDate();
        window.open("https://marketing"+projectName+".lux-casino.co/backend/clients_reports?created_at_gteq="+startTrip+"&created_at_lteq="+correctDate+"&sum_by=year&group_by%5B%5D=date&currency_eq="+userCurrency+"&user_eq%5B%5D="+userEmail+"&game_category_eq%5B%5D=slots&commit=%D0%A4%D0%B8%D0%BB%D1%8C%D1%82%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C", "_blank");
        // document.getElementById("startTrip").value = cashbackDates[projectName]["startDate"];
        let startDate = document.getElementById("startTrip").value;
        let endDate = document.getElementById("endTrip").value;
        let cashbackProjectDates = {startDate: startDate, endDate: endDate};
        let dates = GM_getValue("cashbackDates");
        dates[projectName] = cashbackProjectDates;
        GM_setValue("cashbackDates", dates);
        // document.getElementById("endTrip").value = cashbackDates[projectName]["endDate"];
    }
    // кешбек КЭШБЭК
    async function enhanceCashback(){
        // let allTimeDiff = Number.parseFloat(casinoCurrencyPanel.querySelector("tbody .col.col-potracheno_v_kazino").innerText.replace(",", "."));
        let allTimeTable = tableToObj(casinoCurrencyPanel.querySelector("table"));
        let allTimeDiff = 0;
        for(let value of allTimeTable){
            if(value["Валюта"].match(userCurrency)){
                allTimeDiff = Number.parseFloat(value["Потрачено в казино"].replace(/(<([^>]+)>)/ig, "").replace(",", "."));
            }
        }
        let cashbackAllTimeDiffFlag = document.getElementById("enhancerCashbackAllTimeDiff");
        let cashbackCurrentDiffFlag = document.getElementById("enhancerCashbackCurrentDiff");
        let cashbackBetsDiffFlag = document.getElementById("enhancerCashbackBetsDiff");
        //

        // enhancerCashbackCurrentDiff
        //
        console.log(`Дифф за все время: ${allTimeDiff}`);
        let startTrip = document.getElementById("startTrip").value;
        let endTrip = document.getElementById("endTrip").value;
        let playersReports = await createParser("https://marketing"+projectName+".lux-casino.co/backend/players_reports?q%5Bcreated_at_gteq_datetime%5D="+startTrip+"&q%5Bcreated_at_lteq_datetime%5D="+endTrip+"&q%5Bcurrency_eq%5D="+userCurrency+"&q%5Buser_email_eq%5D="+userEmail+"&commit=%D0%A4%D0%B8%D0%BB%D1%8C%D1%82%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C&localized=true", 'playersReportsParser');
        let correctDate = new Date(document.getElementById("endTrip").value);
        correctDate.setDate(correctDate.getDate()+1);
        correctDate = correctDate.getFullYear()+"-"+String(correctDate.getMonth()+1)+"-"+correctDate.getDate();
        let clientsReports = await createParser("https://marketing"+projectName+".lux-casino.co/backend/clients_reports?created_at_gteq="+startTrip+"&created_at_lteq="+correctDate+"&sum_by=day&group_by%5B%5D=date&currency_eq="+userCurrency+"&user_eq%5B%5D="+userEmail+"&game_category_eq%5B%5D=slots&commit=%D0%A4%D0%B8%D0%BB%D1%8C%D1%82%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C", "clientsReportsParser");
        // document.getElementById("startTrip").value = cashbackDates[projectName]["startDate"];
        let startDate = document.getElementById("startTrip").value;
        let endDate = document.getElementById("endTrip").value;

        let neededDiff = {
            RUB: 5000,
            EUR: 100,
            USD: 100,
            UAH: 2000,
            KZT: 30000,
            NOK: 750,
            PLN: 250,
            TRY: 250,
            CAD: 150,
            AUD: 150,
            NZD: 150,
            BRL: 500
        };
        let neededDiffFresh = {
            RUB: 5000,
            EUR: 100,
            USD: 100,
            UAH: 2000,
            KZT: 25000,
            NOK: 500,
            PLN: 250,
            TRY: 500,
            CAD: 100,
            AUD: 100,
            AZN: 200,
            NZD: 100,
            BRL: 500
        };
        if(projectName == "-fresh"){
            neededDiff = neededDiffFresh;
        }
        let playerHasEnoughDeps = allTimeDiff > neededDiff[userCurrency];
        let playerHasEnoughDepsPeriod = 0; // у игрока депов больше, чем требуется для кешбека
        let playerHasNeedBetsDiff = 0; // у игрока сумма ставок больше чем сумма выигрышей
        /////////////////////////////////////////////////////////////////
        // playersReports - депы и выводы.
        /////////////////////////////////////////////////////////////////
        // селекторы
        let depSumColSelector = "tbody .col.col-summa_depozitov"; // селектор столбца с суммой депов
        let wdrSumColSelector = "tbody .col.col-summa_vyplat"; // селектор столбца с суммой выплат
        let currencySelector = "option[selected"; // селектор выбранной валюты. скорее всего не потребуется.
        //
        // проверить player reports - ошибка, если ноль депов и выводов
        let playerDepSum = 0;
        let playerWdrSum = 0;
        let depWdrDiff = 0;
        if(!playersReports.contentWindow.document.querySelector(depSumColSelector) && !playersReports.contentWindow.document.querySelector(wdrSumColSelector)){
            playerDepSum = 0;
            playerWdrSum = 0;
            depWdrDiff = 0;
            playerHasEnoughDepsPeriod = depWdrDiff > neededDiff[userCurrency];
            // не найдено ничего в списке депов выводов - значит их и нет
            console.log(`Cashback - селектор playersReports - не найдено в списке ничего`);
        }
        else
        {
            playerDepSum = Number.parseFloat(playersReports.contentWindow.document.querySelector(depSumColSelector).innerText.replace(",", "."));
            playerWdrSum = Number.parseInt(playersReports.contentWindow.document.querySelector(wdrSumColSelector).innerText.replace(",", "."));
            depWdrDiff = playerDepSum - playerWdrSum;
            playerHasEnoughDepsPeriod = depWdrDiff > neededDiff[userCurrency]; // условие, по которому депы игрока превышают выводы на требуемую сумму
            console.log(`Депы: ${playerDepSum}. Выводы: ${playerWdrSum}. Дифф: ${playerHasEnoughDeps}`);
        }
        /////////////////////////////////////////////////////////////////
        // clientsReports - ставки в играх
        /////////////////////////////////////////////////////////////////

        // селекторы
        let defaultIncomeSelector = "tbody .col.col-obschaya_pribyl"; // селектор общей суммы прибыли (столбец 1)
        let bonusIncomeSelector = "tbody .col.col-bonusnaya_chast_valovoy_pribyli"; // селектор бонусной части прибыли (столбец 2)
        let userCurrencySelector = "tbody .col.col-valyuta"; // селектор валюты. Скорее всего, не потребуется
        //
        let defaultIncome = 0; // общая прибыль - столбец 1
        let bonusIncome = 0; // бонусная часть - столбец 2
        let clientsReportsList = clientsReports.contentWindow.document.querySelectorAll("table tbody tr");
        if(!clientsReportsList){
            // НЕ нашло списка депов - нет их там, значит, не было активности никакой((
            console.log(`Cashback - селектор clientsReports - не найдено в списке ничего`);
            defaultIncome = 0;
            bonusIncome = 0;
        }
        else{
            // получаем всю общую и бонусную прибыль
            for(let value of clientsReportsList){
                defaultIncome += Number.parseFloat(value.querySelector(defaultIncomeSelector).innerText.replace(",", ".").replace(/\s/g, ""));
                bonusIncome += Number.parseFloat(value.querySelector(bonusIncomeSelector).innerText.replace(",", ".").replace(/\s/g, ""));
            }
            console.log(`Вся прибыль: ${defaultIncome}. Бонусная часть: ${bonusIncome}`);
        }

        let summary = 0;
        if(defaultIncome >= 0 && bonusIncome >= 0){
            summary = defaultIncome - bonusIncome;
        }
        else if(defaultIncome >= 0 && bonusIncome <= 0){
            summary = defaultIncome + Math.abs(bonusIncome);
        }
        else if(defaultIncome <= 0 && bonusIncome <= 0 ){
            summary = bonusIncome - defaultIncome;
        }
        else if(defaultIncome <= 0 && bonusIncome >= 0){
            summary = bonusIncome + defaultIncome;
        }
        else{
            alert("Где-то ошибка...");
        }
        playerHasNeedBetsDiff = summary >= neededDiff[userCurrency];
        console.log(`Дифф ставки: ${playerHasNeedBetsDiff}`);
        let cashbackSumFlag = document.getElementById("enhancerCashbackSum");
        let scriptText = "";
        if(playerHasEnoughDeps && playerHasEnoughDepsPeriod && playerHasNeedBetsDiff){
            // если выполнены все условия получения кешбека

            if(projectName == "-jet" || projectName == "-rox" || projectName == ""){
                let cashbackFactor = 0.1;
                let cashbackSum = Math.floor(summary * cashbackFactor);

                cashbackSumFlag.innerHTML = `<a style="color:green" id="enhancerCopyCashbackSum">${cashbackSum} ${userCurrency}</a>`;
                document.getElementById("enhancerCopyCashbackSum").addEventListener("click", function(){
                    navigator.clipboard.writeText(`вам доступен кешбек. По предварительным данным, сумма кешбека составляет ${toRightForm(cashbackSum, userCurrency)}.`);
                });
                console.log(`Кешбек доступен. Проект: ${projectName}. Сумма: ${cashbackSum}`);
            }
            if(projectName == "-izzi"){
                let cashbackFactor = 0;
                switch(enhancer.userProfile.userStatus){
                    case "NEW":
                        cashbackFactor = 0.05;
                        break;
                    case "REGULAR":
                        cashbackFactor = 0.1
                        break;
                    case "PREMIUM":
                        cashbackFactor = 0.1
                        break;
                    case "VIP":
                        cashbackFactor = 0.1
                        break;
                }
                let cashbackSum = Math.floor(summary * cashbackFactor);
                cashbackSumFlag.innerHTML = `<a style="color:green" id="enhancerCopyCashbackSum">${cashbackSum} ${userCurrency}</a>`;
                document.getElementById("enhancerCopyCashbackSum").addEventListener("click", function(){
                    navigator.clipboard.writeText(`вам доступен кешбек. По предварительным данным, сумма кешбека составляет ${toRightForm(cashbackSum, userCurrency)}.`);
                });
                console.log(`Кешбек доступен. Проект: ${projectName}. Сумма: ${cashbackSum}`);
                console.log(`izzi CASHBACK FACTOR: ${cashbackFactor}`);
            }

            if(projectName == "-sol"){
                // let cashbackGroups = {
                //     Crystal: []
                // };
                let cashbackFactor = "";
                let userGroups = groupsPanel.querySelectorAll("span");
                for(let value of userGroups){
                    switch(value.innerText){
                        case "Group: CASHBACK 10%":
                            cashbackFactor = 0.1;
                            break;
                        case "Group: CASHBACK 20%":
                            cashbackFactor = 0.2;
                            break;
                    }
                }
                let cashbackSum = Math.floor(summary * cashbackFactor);
                cashbackSumFlag.innerHTML = `<a style="color:green" id="enhancerCopyCashbackSum">${cashbackSum} ${userCurrency}</a>`;
                document.getElementById("enhancerCopyCashbackSum").addEventListener("click", function(){
                    navigator.clipboard.writeText(`вам доступен кешбек. По предварительным данным, сумма кешбека составляет ${toRightForm(cashbackSum, userCurrency)}.`);
                });
                console.log(`Кешбек доступен. Проект: ${projectName}. Сумма: ${cashbackSum}`);
                console.log(`SOL CASHBACK FACTOR: ${cashbackFactor}`);

            }
            if(projectName == "-fresh"){
                let cashbackFactor = 0;
                let ranges = {
                    RUB: [5000, 10001, 25001, 50001, 100001, 200001, 500000],
                    EUR: [100, 201, 301, 501, 1501, 3001, 6000],
                    USD: [100, 201, 301, 501, 1501, 3001, 6000],
                    UAH: [2000, 4001, 10001, 20001, 40001, 80001, 200000],
                    KZT: [25000, 50001, 100001, 200001, 500001, 1000001, 5000000],
                    NOK: [500, 1001, 2501, 5001, 10001, 20001, 50000],
                    PLN: [250, 501, 1001, 2501, 5001, 10001, 25000],
                    TRY: [500, 1001, 2501, 5001, 10001, 20001, 50000],
                    CAD: [100, 201, 301, 501, 1501, 3001, 6000],
                    AUD: [100, 201, 301, 501, 1501, 3001, 6000],
                    AZN: [200, 401, 601, 1001, 3001, 6001, 12000],
                    NZD: [100, 201, 301, 501, 1501, 3001, 6000],
                    BRL: [500, 1001, 1501, 1501, 2501, 7501, 15001, 30000]
                };
                // ПРОЦЕНТ БЕРЕМ ОТ НАИМЕНЬШЕГО ЗНАЧЕНИЯ, НО ОТСЧИТЫВАЕМ СУММУ ОТ СТАВОК В СЛОТАХ
                console.log("Депы-выплаты фрешдифф:" + depWdrDiff);
                console.log("Сумма ставок рилмани фреш: " + summary);
                let cashbackDiff = depWdrDiff > summary ? summary : depWdrDiff;
                let cashbackRange4 = cashbackDiff > ranges[userCurrency][0] && cashbackDiff < ranges[userCurrency][1];
                let cashbackRange5 = cashbackDiff > ranges[userCurrency][1] && cashbackDiff < ranges[userCurrency][2];
                let cashbackRange6 = cashbackDiff > ranges[userCurrency][2] && cashbackDiff < ranges[userCurrency][3];
                let cashbackRange7 = cashbackDiff > ranges[userCurrency][3] && cashbackDiff < ranges[userCurrency][4];
                let cashbackRange8 = cashbackDiff > ranges[userCurrency][4] && cashbackDiff < ranges[userCurrency][5];
                let cashbackRange9 = cashbackDiff > ranges[userCurrency][5] && cashbackDiff < ranges[userCurrency][6];
                let cashbackRange10 = cashbackDiff > ranges[userCurrency][6] && cashbackDiff < ranges[userCurrency][7];
                if(cashbackRange4) cashbackFactor = 0.04;
                if(cashbackRange5) cashbackFactor = 0.05;
                if(cashbackRange6) cashbackFactor = 0.06;
                if(cashbackRange7) cashbackFactor = 0.07;
                if(cashbackRange8) cashbackFactor = 0.08;
                if(cashbackRange9) cashbackFactor = 0.09;
                if(cashbackRange10) cashbackFactor = 0.1;

                let cashbackSum = Math.floor(summary * cashbackFactor);
                console.log(cashbackSum);
                cashbackSumFlag.innerHTML = `<a style="color:green" id="enhancerCopyCashbackSum">${cashbackSum} ${userCurrency}</a>`;
                document.getElementById("enhancerCopyCashbackSum").addEventListener("click", function(){
                    navigator.clipboard.writeText(`вам доступен кешбек. По предварительным данным, сумма кешбека составляет ${toRightForm(cashbackSum, userCurrency)}.`);
                });
                console.log(`Кешбек доступен. Проект: ${projectName}. Сумма: ${cashbackSum}`);
                console.log(`izzi CASHBACK FACTOR: ${cashbackFactor}`);


            }



            let startDate = document.getElementById("startTrip").value;
            let endDate = document.getElementById("endTrip").value;
            let cashbackProjectDates = {startDate: startDate, endDate: endDate};
            let dates = GM_getValue("cashbackDates");
            dates[projectName] = cashbackProjectDates;
            GM_setValue("cashbackDates", dates);


            // 		let cashbackAllTimeDiffFlag = document.getElementById("enhancerCashbackAllTimeDiff");
            // 		let cashbackCurrentDiffFlag = document.getElementById("enhancerCashbackCurrentDiff");
            // 		let cashbackBetsDiffFlag = document.getElementById("enhancerCashbackBetsDiff");


        }


        else if(!playerHasEnoughDeps){
            // не выполнено условие по депам за все время
            scriptText = `кешбек вам недоступен, так как сумма депозитов за все время активности на проекте не превышает сумму выплат более чем на ${toRightForm(neededDiff[userCurrency], userCurrency)}.`;
            cashbackSumFlag.innerHTML = `<a style="color:red" id="enhancerCopyCashbackSum">НЕДОСТУПЕН</a>`;
            document.getElementById("enhancerCopyCashbackSum").addEventListener("click", function(){
                navigator.clipboard.writeText(scriptText);
            });
            cashbackBetsDiffFlag.innerHTML = `<a><b style="color:red">НЕДОСТУПЕН</b></a>`;
        }
        else if(!playerHasEnoughDepsPeriod){
            // не выполнено условие по депам за расчетный
            scriptText = `кешбек вам недоступен, так как сумма депозитов за расчетный период не превышает сумму выплат более чем на ${toRightForm(neededDiff[userCurrency], userCurrency)}.`;
            cashbackBetsDiffFlag.innerHTML = `<a><b style="color:red">НЕДОСТУПЕН</b></a>`;
            cashbackSumFlag.innerHTML = `<a style="color:red" id="enhancerCopyCashbackSum">НЕДОСТУПЕН</a>`;
            document.getElementById("enhancerCopyCashbackSum").addEventListener("click", function(){
                navigator.clipboard.writeText(scriptText);
            });
        }
        else if(!playerHasNeedBetsDiff){
            // не выполнено условие по сумме ставок
            scriptText = `кешбек вам недоступен, так как сумма ставок за расчетный период не превышает сумму выигрышей более чем на ${toRightForm(neededDiff[userCurrency], userCurrency)}.`;
            cashbackBetsDiffFlag.innerHTML = `<a><b style="color:red">НЕДОСТУПЕН</b></a>`;
            cashbackSumFlag.innerHTML = `<a style="color:red" id="enhancerCopyCashbackSum">НЕДОСТУПЕН</a>`;
            document.getElementById("enhancerCopyCashbackSum").addEventListener("click", function(){
                navigator.clipboard.writeText(scriptText);
            });
        }
        console.log(scriptText)
        cashbackAllTimeDiffFlag.innerHTML = `<b><a style="color: ${playerHasEnoughDeps ? "green" : "red"}">${Math.floor(allTimeDiff)} ${userCurrency}</a></b>`;
        cashbackCurrentDiffFlag.innerHTML = `<b><a style="color: ${playerHasEnoughDepsPeriod ? "green" : "red"}">${Math.floor(depWdrDiff)}  ${userCurrency}</a></b> `;
        cashbackBetsDiffFlag.innerHTML = `<b><a style="color: ${playerHasNeedBetsDiff ? "green" : "red"}">${summary} ${userCurrency}</a></b>`;


    }



    function enhancePlayersReports(){
        let depSumColSelector = ".col.col-summa_depozitov";
        let wdrSumColSelector = ".col.col-summa_vyplat";
        let currencySelector = "option[selected";

        let neededDiff = {
            RUB: 5000,
            EUR: 100,
            USD: 100,
            UAH: 2000,
            KZT: 30000,
            NOK: 750,
            PLN: 250,
            TRY: 250,
            CAD: 150,
            AUD: 150,
            NZD: 150,
            BRL: 500
        };

        let userCurrency = document.querySelector(currencySelector).value;
        if(!userCurrency) return;
        console.log(userCurrency);
        let tableReports = document.querySelector("table").querySelector("tbody");
        let tableReportsHead = document.querySelector("table").querySelector("thead").querySelector("tr");

        tableReportsHead.innerHTML += `<th class="sortable col col-difference"><a>CASHBACK DIFF</a></th>`;

        let playersList = tableReports.querySelectorAll("tr");
        for(let value of playersList){
            let depSum = value.querySelector(depSumColSelector).innerText;
            let wdrSum = value.querySelector(wdrSumColSelector).innerText;
            let diff = Number.parseInt(depSum) - Number.parseInt(wdrSum);

            if(diff < 0){
                if(Math.abs(diff) >= neededDiff[userCurrency]){
                    console.log("Доступен");
                }
            }
            value.innerHTML += `<td class="col col-diff"><span id="enhancerCashbackDiffLabel-${value}" class="status_tag ${Math.abs(diff) >= neededDiff[userCurrency] ? "red" : "green"}">${diff} ${userCurrency}</span></td>`;
            if(Math.abs(diff) >= neededDiff[userCurrency]){
                // НИЧего
            }
            else{
                document.getElementById(`enhancerCashbackDiffLabel-${value}`).addEventListener("click", function(){
                    navigator.clipboard.writeText(`кешбек вам недоступен, так как сумма депозитов за расчетный период не превышает сумму выплат более чем на 5 000 рублей.`);
                    document.getElementById(`enhancerCashbackDiffLabel-${value}`).classList.remove(`status_tag`, `${Math.abs(diff) >= neededDiff[userCurrency] ? "red" : "green"}`);
                    document.getElementById(`enhancerCashbackDiffLabel-${value}`).classList.add(`status_tag` ,`yes`);
                });
            }
        }
    }

    function enhanceClientsReports(){
        let defaultIncomeSelector = ".col.col-obschaya_pribyl";
        let bonusIncomeSelector = ".col.col-bonusnaya_chast_valovoy_pribyli";
        let userCurrencySelector = ".col.col-valyuta";

        let tableClients = document.querySelector("table").querySelector("tbody");
        let tableClientsHead = document.querySelector("table").querySelector("thead").querySelector("tr");


        tableClientsHead.innerHTML += `<th class=""><a>CASHBACK DIFF</a></th>`;
        let playersList = tableClients.querySelectorAll("tr");
        let neededDiff = {
            RUB: 5000,
            EUR: 100,
            USD: 100,
            UAH: 2000,
            KZT: 30000,
            NOK: 750,
            PLN: 250,
            TRY: 250,
            CAD: 150,
            AUD: 150,
            NZD: 150,
            BRL: 500
        };
        let cashbackFactor = 0.1;
        let cashbackSum = 0;
        for(let value of playersList){
            let realMoney = parseFloat(value.querySelector(defaultIncomeSelector).innerText.replace(",", "."));
            let bonusMoney = parseFloat(value.querySelector(bonusIncomeSelector).innerText.replace(",", "."));
            let userCurrency = value.querySelector(userCurrencySelector).innerText;
            let summary = 0;
            if(realMoney >= 0 && bonusMoney >= 0){
                summary = realMoney - bonusMoney;
                console.log(1);
            }
            else if(realMoney >= 0 && bonusMoney <= 0){
                summary = realMoney + Math.abs(bonusMoney);
                console.log(2);
            }
            else if(realMoney <= 0 && bonusMoney <= 0){
                summary = bonusMoney - realMoney;
                console.log(3);
            }
            else if(realMoney <= 0 && bonusMoney >= 0){
                summary = bonusMoney - realMoney;
                console.log(4);
            }
            else{console.log("ВТФ ОШИБКА???? как лол...")}
            console.log(summary, neededDiff[userCurrency]);
            if(summary >= neededDiff[userCurrency]){
                if(projectName == "-jet" || projectName == "-rox"){
                    cashbackSum = Math.floor(summary * cashbackFactor);
                    value.innerHTML += `
						<td class="col-enhancerCashback">
							${projectName == "-jet" ? "<span class='player-tag' style='background-color:#7b64ff'>JET </span>" : ""}
							${projectName == "-rox" ? "<span class='player-tag' style='background-color:#fb9e00'>ROX </span>" : ""}
							<span class="status_tag red" id="enhancerCashbackSum">${cashbackSum}</span>
						</td>`
                    console.log(`Доступен: ${cashbackSum}`);
                    document.getElementById("enhancerCashbackSum").addEventListener("click", function(){
                        navigator.clipboard.writeText(`вам доступен кешбек. По предварительным данным, сумма составляет ${toRightForm(cashbackSum, userCurrency)}`);
                        document.getElementById(`enhancerCashbackSum`).classList.remove(`status_tag`, `${Math.abs(diff) >= neededDiff[userCurrency] ? "red" : "green"}`);
                        document.getElementById(`enhancerCashbackSum`).classList.add(`status_tag` ,`yes`);
                    })
                }
                if(projectName == "-izzi"){
                    let cashbackFactor1 = 0.05;
                    let cashbackFactor2 = 0.1;
                    let cashbackSum1 = Math.floor(summary * cashbackFactor1);
                    let cashbackSum2 = Math.floor(summary * cashbackFactor2);

                    value.innerHTML += `
						<td class="col-enhancerCashback">
							<span class="player-tag" style="background-color:#14141e">IZZI </span>
							<br><br>
							<span class="status_tag red" id="enhancerCashbackSum1">5% - ${cashbackSum1}</span><br>
							<br>
							<span class="status_tag red" id="enhancerCashbackSum2">10% - ${cashbackSum2}</span>
						</td>`;
                    document.getElementById("enhancerCashbackSum1").addEventListener("click", function(){
                        navigator.clipboard.writeText(`вам доступен кешбек. По предварительным данным, сумма кешбека составит ${toRightForm(cashbackSum1, userCurrency)}. Кешбек начисляется автоматически каждый четверг до 13:00 по московскому времени.`);
                    });
                    document.getElementById("enhancerCashbackSum2").addEventListener("click", function(){
                        navigator.clipboard.writeText(`вам доступен кешбек. По предварительным данным, сумма кешбека составит ${toRightForm(cashbackSum2, userCurrency)}. Кешбек начисляется автоматически каждый четверг до 13:00 по московскому времени.`);
                    })

                }
            }
            else{
                value.innerHTML += `
						<td class="col-enhancerCashback">
							<span id="enhancerNoCashback" class="status_tag red">Недоступен</span>
						</td>`
                document.getElementById("enhancerNoCashback").addEventListener("click", function(){
                    navigator.clipboard.writeText(`кешбек вам недоступен, так как сумма ставок за расчетный период не превышает сумму выигрышей более чем на 5 000 рублей.`);
                });
                //Кешбек вам недоступен, так как сумма ставок за расчетный период не превышает сумму выигрышей более чем на 5 000 рублей.
                console.log("недоступен кэшбек");
            }
            //console.log(cashbackSum);
        }
    }


    // создает объект lastDepData с переменными sum(сумма ласт депа) и time(время ласт депа)
    function lastDepData(){
        let lastDepData = {};
        let table = tableToObj(paymentsBlock.querySelector("table"));
        // let table = await loadAllPayments();
        for(let value of table){

            let action = value["Действие"];
            let success = value["Успешно"];

            let actionClean = action.replace(/<\/?[^>]+(>|$)/g, "").trim();
            let successClean = success.replace(/<\/?[^>]+(>|$)/g, "").trim();
            if(debugMode == 1){console.log(successClean);}
            let volnaDepLabel = "Deposit";
            let anyDepLabel = "Депозит";
            let needLabel = projectName == "" || projectName == "-fresh" ? volnaDepLabel : anyDepLabel;

            if(actionClean == needLabel && successClean == "ДА")
            {
                //var lastDepSum = value["Сумма"].split(" ")[0];
                let numberPattern = /\d+/g;
                let lastDepSum;
                lastDepSum = value["Сумма"].split(",")[0];
                lastDepSum = lastDepSum.match(numberPattern).join(); // объединяет массив после регулярки, которая находит только цифры
                lastDepSum = lastDepSum.replace(/[^0-9]/g,""); // оставляет только цифры в строке
                lastDepData.sum = lastDepSum;
                lastDepData.time = value["Завершено в"];
                break;
            }
        }

        return lastDepData;
    }

    async function loadAllPayments(){
        let paymentsData = await createParser("https://marketing"+projectName+".lux-casino.co/backend/players/"+userid+"/payments", "paymentsParser1");
        let paymentsTable;
        let paymentsTableObj;
        while(!paymentsTable)
        {
            paymentsTable = paymentsData.contentWindow.document.querySelector("table");
            await sleep(10);
        }
        let paymentsCount;
        while(true){
            paymentsTableObj = tableToObj(paymentsTable);
            await sleep(50);
            if(paymentsCount == Object.keys(paymentsTableObj).length) {break;}
            paymentsCount = Object.keys(paymentsTableObj).length;
        }
        return paymentsTableObj;
    }
    //console.log(await loadAllPayments());



    async function checkSportBets(){
        let table = tableToObj(paymentsBlock.querySelector("table"));
        let lastDepSum;
        let startCheckTime;
        for(let value of table){
            let action = value["Действие"];
            let success = value["Успешно"];
            let actionClean = action.replace(/<\/?[^>]+(>|$)/g, "").trim();
            let successClean = success.replace(/<\/?[^>]+(>|$)/g, "").trim();
            if(debugMode == 1){console.log(successClean);}
            if(actionClean == "Депозит" && successClean == "Да")
            {
                //var lastDepSum = value["Сумма"].split(" ")[0];
                let numberPattern = /\d+/g;
                lastDepSum = value["Сумма"].split(",")[0];
                lastDepSum = lastDepSum.match(numberPattern).join(); // объединяет массив после регулярки, которая находит только цифры
                lastDepSum = lastDepSum.replace(/[^0-9]/g,""); // оставляет только цифры в строке
                //console.log("Строка ДЕПОЗИТ из таблицы:"+actionClean.trim());
                startCheckTime = value["Завершено в"];
                break;
            }
        }
        let data = await createParser("https://marketing"+projectName+".lux-casino.co/admin/sport/bets?filters%5BuserId%5D="+userid+"&filters%5BcreatedAfter%5D="+startCheckTime, "checkSportsWager");
        // await sleep(4000);
        while(!data.contentWindow.document.querySelector("[data-v-30bb8812] .sidebar table"))
        {
            await sleep(500);
            console.log("Ждем чекспортбетс");
        }
        data = tableToObj(data.contentWindow.document.querySelector("[data-v-30bb8812] .sidebar table"));
        let betsSum = data[0]["Ставки"];
        if(debugMode == 1){console.log("Сумма ставок после ласт депа:" + betsSum)};
        return betsSum;
        // выборка бокса с результатами document.querySelector("[data-v-30bb8812] .sidebar table")
    }
    // checkSportBets();


    async function newWagerChecker(){
        // элементы таблицы вейджера
        let wagerSumLabel = document.getElementById("enhancerWagerSumLabel");
        let betsSumLabel = document.getElementById("enhancerBetsSumLabel");
        let betsSportSumLabel = document.getElementById("enhancerSportBetsSumLabel")

        let sportsBetsSum = 0;
        let slotsBetsSum = 0;

        let wagerFactorSlots = projectName == "-sol" ? 1 : 3;
        let wagerFactorSport = 3;
        let wagerFactor;
        let remainingWagerToPlay;
        let LDD = lastDepData();
        // Если данные о последнем депе не получены, выкидывает ошибка
        if(!LDD.sum){
            console.log("New Wagerchecker: Deposit Error");
            document.getElementById("wagerLabel").innerHTML = "<b><i>DEPOSIT ERROR</i></b>";
            document.getElementById("enhancerWagerTable").setAttribute("hidden", "hidden");
            return;
        }
        let neededWagerSlots = LDD.sum.split(",")[0] * wagerFactorSlots;
        let neededWagerSport = LDD.sum.split(",")[0] * wagerFactorSport;

        let sportsBetsData = await createParser("https://marketing"+projectName+".lux-casino.co/admin/sport/bets?filters%5BuserId%5D="+userid+"&commit=Фильтровать&filters%5BcreatedAfter%5D="+LDD.time, "sportsBetsData");
        let slotsBetsData = await createParser("https://marketing"+projectName+".lux-casino.co/backend/bets?q%5Baccount_user_id_eq%5D="+userid+"&commit=Фильтровать&q%5Bcreated_at_gteq%5D="+LDD.time, "slotsBetsData");

        let slotsBetsAggregatedBlock; //= slotsBetsData.contentWindow.document.getElementById("aggregated_data_sidebar_section");
        let sportsBetsAggregatedBlock ;//= sportsBetsData.contentWindow.document.querySelector("[data-v-30bb8812] .sidebar");

        // обновляет данные пока не получит нужные элементы
        while(!slotsBetsAggregatedBlock & !sportsBetsAggregatedBlock)
        {
            await sleep(50);
            slotsBetsAggregatedBlock = slotsBetsData.contentWindow.document.getElementById("aggregated_data_sidebar_section");
            sportsBetsAggregatedBlock = sportsBetsData.contentWindow.document.querySelector("[data-v-0819270e] .sidebar");
        }

        if(slotsBetsAggregatedBlock)
        {
            let isTable;
            while(!isTable)
            {
                isTable = slotsBetsAggregatedBlock.querySelector("table");
                await sleep(100);
            }
            let aggregatedSlotsData = tableToObj(slotsBetsAggregatedBlock.querySelector("table"));
            if(aggregatedSlotsData[0] != undefined){
                if(debugMode == 1)console.log(aggregatedSlotsData[0].Bets.split(",")[0]);
                slotsBetsSum = aggregatedSlotsData[0].Bets.split(",")[0];
            }
            else {slotsBetsSum = 0;console.log(slotsBetsSum);}


        }
        if(sportsBetsAggregatedBlock)
        {
            let isTable;
            while(!isTable)
            {
                isTable = sportsBetsAggregatedBlock.querySelector("table");
                await sleep(100);
            }
            let aggregatedSportsData = tableToObj(sportsBetsAggregatedBlock.querySelector("table"));
            if(aggregatedSportsData[0] != undefined){
                if(debugMode == 1)console.log(aggregatedSportsData[0]["Ставки"].split(",")[0]);
                sportsBetsSum = aggregatedSportsData[0]["Ставки"].split(",")[0];
            }
        }
        if(slotsBetsSum >= neededWagerSlots || sportsBetsSum >= neededWagerSport) // Если вейджер отыгран(сумма ставок на слоты ИЛИ на спорт больше чем вейджер)
        {
            function scriptCopy(){ //
                navigator.clipboard.writeText(`Условие ${projectName != "-sol" ? "трехкратного " : ""}отыгрыша последнего внесенного депозита выполнено.`);
                document.getElementById("wagerLabel").style.color = "red";
            }
            document.getElementById("wagerLabel").innerHTML = "<b> ОТЫГРАНО.</b>";
            document.getElementById("wagerLabel").addEventListener("click", scriptCopy);
            document.getElementById("wagerLabel").style.color = "green";
            let slotsBetsWager = neededWagerSlots - slotsBetsSum;
            let sportsBetsWager = neededWagerSport - sportsBetsSum;
            remainingWagerToPlay = slotsBetsWager >= sportsBetsWager ? sportsBetsWager : slotsBetsWager;
            wagerFactor = slotsBetsWager >= sportsBetsWager ? wagerFactorSport : wagerFactorSlots;
        }
        else // Если вейджер не отыгран
        {
            let slotsBetsWager = neededWagerSlots - slotsBetsSum;
            let sportsBetsWager = neededWagerSport - sportsBetsSum;
            remainingWagerToPlay = slotsBetsWager >= sportsBetsWager ? sportsBetsWager : slotsBetsWager;
            wagerFactor = slotsBetsWager >= sportsBetsWager ? wagerFactorSport : wagerFactorSlots;
            console.log(slotsBetsWager, sportsBetsWager, remainingWagerToPlay, wagerFactor);

            //let maxBetsStat = slotsBetsSum >= sportsBetsSum ? slotsBetsSum : sportsBetsSum;
            //let wagerToPlay = neededWager - maxBetsStat;
            //if(debugMode == 1)console.log("Отыграть еще: " + remainingWagerToPlay);
            document.getElementById("wagerLabel").innerHTML = "<b> Отыграть еще </b>"+ remainingWagerToPlay + " " + userCurrency;
            //для успешного вывода средств вам необходимо выполнить условие трехкратного отыгрыша депозита. Для этого вам необходимо совершить ставок на сумму 1 707 рублей
            function scriptCopy(){ //
                navigator.clipboard.writeText(`для успешного вывода средств вам необходимо выполнить условие ${projectName != "-sol" ? "трехкратного " : ""}отыгрыша последнего внесенного депозита. Для этого вам осталось совершить ставок на сумму ` + toRightForm(remainingWagerToPlay, userCurrency) + ".");
                document.getElementById("wagerLabel").style.color = "red";
            }
            document.getElementById("wagerLabel").addEventListener("click", scriptCopy);
        }
        wagerSumLabel.innerHTML = `(x${wagerFactor}) ` + remainingWagerToPlay + " " + userCurrency;
        betsSumLabel.innerHTML = slotsBetsSum + " " + userCurrency;
        betsSportSumLabel.innerHTML = sportsBetsSum + " " + userCurrency;
    }


    async function paymentsTransactionsScript()
    {
        //document.querySelector(".player-action-all-payments").click();
        if(debugMode == 1){console.log("paymentsTransactionsScript: sleep");}
        //await sleep(5000);
        if(debugMode == 1){console.log("paymentsTransactionsScript: sleep ended");}
        //  let tableHistory = tableToObj(paymentsBlock.querySelector("table")); // таблица выбирается отдельно, потому что нужна актуальная, а не сохраненная в переменной...
        let tableHistory = await loadAllPayments();
        let i = 0;
        var depSum = 0;
        var wdrSum = 0;
        var lastDepSum = 0;
        var isWdr = 0;
        let wdrText = projectName == "" ? "Cashout" : "Выплаты";
        let depText = projectName == "" ? "Deposit" : "Депозит";
        for(let value of tableHistory)
        {
            if(i == 20){break;}
            let action = value["Действие"].replace(/<\/?[^>]+(>|$)/g, "").trim();
            let success = value["Успешно"].replace(/<\/?[^>]+(>|$)/g, "").trim();
            if(action == depText && success == "Да")
            {
                let lastDepSum = parseFloat(value['Сумма'].replace(/\s+/g, "").replace(/[^0-9.,]+/, '').replace(",", "."));
                depSum = depSum + lastDepSum;
                if(debugMode == 1){console.log(lastDepSum);}
            }
            if(action == wdrText && success == "Да")
            {
                let lastWdrSum = parseFloat(value['Сумма'].replace(/\s+/g, "").replace(/[^0-9.,]+/, '').replace(",", "."));
                wdrSum = wdrSum + lastWdrSum;
                if(debugMode == 1){console.log(lastWdrSum);}
            }
            if(action == wdrText){
                isWdr = 1;
            }
            i++;
        }
        console.log(tableHistory );
        if(wdrSum != 0){
            navigator.clipboard.writeText("Сумма ваших депозитов за последние 20 операций составляет " + toRightForm(depSum, userCurrency) + ", сумма выплат составляет " + toRightForm(wdrSum, userCurrency) + ".");
        }
        else
        {
            navigator.clipboard.writeText("Сумма ваших депозитов за последние 20 операций составляет " + toRightForm(depSum, userCurrency) + ", выплаты за данный период отсутствуют.");
        }
        if(debugMode == 1){console.log(depSum, wdrSum, userCurrency);}
        document.getElementById("enhancerScriptPayment20History").style.color = "red";
    }


    function depOutScript(){
        let tableDep = tableToObj(document.querySelectorAll("table")[0]);
        for(let value of tableDep)
        {
            let userCur = value["Валюта"];
            let depSum = value["Сумма депозитов"].split(",")[0];
            let wdrSum = value["Сумма выплат"].split(",")[0];
            console.log(depSum, wdrSum, userCur);

            if(userCur.startsWith("<span class=\"status_tag yes\""))
            {
                if(wdrSum != 0){
                    navigator.clipboard.writeText("Сумма ваших депозитов за все время составляет " + toRightForm(depSum, userCurrency) + ", сумма ваших выплат составляет " + toRightForm(wdrSum, userCurrency)+ ".");
                    document.getElementById("enhancerScriptPaymentHistory").style.color = "red";
                }
                else
                {
                    navigator.clipboard.writeText("Сумма ваших депозитов за все время составляет " + toRightForm(depSum, userCurrency) + ", заявок на выплату оформлено не было.");
                    document.getElementById("enhancerScriptPaymentHistory").style.color = "red";
                }
                break;
            }
            else
            {
                if(debugMode == 1){console.log("error:depOutScript");}
            }

        }
    }

    async function stagGrabber(){

        let stag = document.querySelector(".row.row-s_tag_affiliate").querySelector("td").innerText;
        if(stag != "ПУСТО"){
            let bonus = await trelloBonusFinder(stag);
            if(bonus == 1){
                document.getElementById("enhancerStagFlag").classList.add('player-tag-verified');
            }
        }
        document.getElementById("enhancerStagFlag").innerText = stag;
        function copyStag(){
            navigator.clipboard.writeText(stag);
            document.getElementById("enhancerStagFlag").style.color = "red";
        }
        document.getElementById("enhancerStagFlag").addEventListener("click", copyStag);
    }

    function subscribeChecker(){
        let subFlag = document.querySelector(".row.row-receive_promos").querySelector("td").querySelector("span").innerText;
        let subDisagreeFlag = document.querySelector(".row.row-unsubscribed").querySelector("td").querySelector("span").innerHTML;
        let enhancerSubFlag = document.getElementById("enhancerSubFlag");
        if(subFlag == "ДА" && subDisagreeFlag == "НЕТ")
        {
            enhancerSubFlag.innerText = "Подписан";
            enhancerSubFlag.classList.add('player-tag-verified');
            //enhancerSubFlag.style.backgroundColor = "#68bc00";
        }
        else
        {
            //enhancerSubFlag.classList.add('player-tag');
            enhancerSubFlag.classList.add('player-tag-asked_for_docs');
            enhancerSubFlag.innerText = "Отписан";
            //enhancerSubFlag.style.color = "red";
        }
    }

    function checkDuplicates(){
        let duplicateFlag = document.querySelector(".primary-duplicate.red.status_tag");
        let duplicateLabel = document.getElementById("enhancerDuplicatesFlag");
        if(!duplicateFlag){
            duplicateLabel.classList.add('player-tag-verified');
            duplicateLabel.innerHTML = "Ограничений нет";
        }
        else
        {
            enhancer.userProfile.restrictions = 1;
            duplicateLabel.innerHTML = "Есть ограничения";
            duplicateLabel.classList.add('player-tag-asked_for_docs');
            document.getElementById("enhancerDuplicatesFlag").addEventListener("click", enhancerScrollerDuplicates);
        }
    }

    async function checkRegionRestrictions(region){
        let country = region;
        let restrictedCountries = ["Американское Самоа", "Аруба", "Афганистан", "Беларусь", "Бельгия", "Бона́йре, Синт-Эста́тиус и Са́ба", "Великобритания","Виргинские острова, Британские",
                                   "Гонконг", "Гренландия", "Греция", "Гуам", "Дания", "Израиль", "Иордания", "Иран", "Ирак", "Ирландия", "Испания", "Италия",
                                   "Йемен", "Кипр", "КНДР", "Кот-д’Ивуар", "Кувейт", "Кюрасао", "Майотт", "Макао", "Мальта", "Нидерланды", "Объединенные Арабские Эмираты",
                                   "Оман", "Пакистан", "Португалия", "Пуэрто-Рико", "Румыния", "Саудовская Аравия", "Сен-Мартен (Французская часть)", "Сингапур",
                                   "Сирия", "Словакия", "США", "Франция", "Швеция", "Эфиопия", "ЮАР", "Соединенные Штаты Америки"];

        let isCountryBlocked = await fetch(`https://tishka.xyz/sdt/nametyper.php?action=getCountry&country=${country}`);
        isCountryBlocked = await isCountryBlocked.text();
        if(isCountryBlocked == "1"){
            console.log(`чекаем `+ region);
            if(enhancer.settings.restrictedLocationsFlag == 1){
                vipNotify("warning");
                document.getElementById("page_title").innerHTML += `<b style="color:red"> [RESTRICTED]</b>`;
            }
        }
        if(isCountryBlocked == "0"){

            // console.log(country);
            let isAlreadyNotified = 0;
            for(let value of restrictedCountries){
                if(value == country){
                    console.log(`чекаем `+ region);
                    console.log("++");
                    isCountryBlocked = 1;
                    if(enhancer.settings.restrictedLocationsFlag == 1 && !isAlreadyNotified){
                        vipNotify("warning");
                        document.getElementById("page_title").innerHTML += `<b style="color:red"> [RESTRICTED]</b>`;
                        isAlreadyNotified = 1;
                    }
                }
            }
        }
        return isCountryBlocked;
    }

    async function enhanceUserEvents(){
        let eventsList = tableToObj(userEventsPanel.querySelector("table"));
        let countriesList = [];
        for(let value of eventsList){
            countriesList.push(value["Страна"]);
        }
        let uniqueCountries = [...new Set(countriesList)];
        //console.log(uniqueCountries);
        for(let value of uniqueCountries){
            checkRegionRestrictions(value);
        }
    }

    async function checkPhoneNumber(){
        let phoneNumberFlag = document.getElementById("phones_sidebar_section").innerHTML;
        let phoneNumberLabel = document.getElementById("enhancerPhoneFlag");
        if(phoneNumberFlag.match(/Добавить телефон/) == null){
            if(phoneNumberFlag.match(/(Активный, Подтвержденный)/) != null){
                let country = phoneNumbersPanel.querySelector("ul").querySelectorAll("li")[0].querySelector("div").innerText.split("Страна: ")[1];
                // если в профиле активный + подтвержденный
                checkRegionRestrictions(country);
                phoneNumberLabel.classList.add('player-tag-verified');
                phoneNumberLabel.innerHTML = "Подтвержден";
                if(debugMode == 1){console.log("checkPhoneNumber: активный подтвержденный");}
            }
            else if(phoneNumberFlag.match(/(Активный, Неподтвержденный)/) != null){
                let country = phoneNumbersPanel.querySelector("ul").querySelectorAll("li")[0].querySelector("div").innerText.split("Страна: ")[1];
                // если в профиле активен, но не подтвержден
                checkRegionRestrictions(country);
                phoneNumberLabel.style.backgroundColor = "#fb9e00";
                phoneNumberLabel.classList.add('player-tag-verified');//BGCOLOR
                phoneNumberLabel.innerHTML = "Привязан";
                if(debugMode == 1){console.log("checkPhoneNumber: активный неподтвержденный");}
            }
        }
        else
        {
            //не добавлен
            phoneNumberLabel.classList.add('player-tag-asked_for_docs');
            phoneNumberLabel.innerHTML = "Не привязан";
            if(debugMode == 1){console.log("checkPhoneNumber: не привязан");}
        }

    }

    function getLoaderImage(){
        let loaderImage = "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";
        return loaderImage;
    }


})();