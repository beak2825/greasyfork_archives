// ==UserScript==
// @name         [AoR] Фарм-Макрос-хуякрос 
// @namespace    tuxuuman:aor.free.macros.farm
// @version      0.1.0
// @description  Модифицированный макрос хуякрос. Теперь он умеет полноценно фармить.
// @author       tuxuuman<tuxuuman@gmail.com>
// @match        http://game.aor-game.ru/*
// @grant        GM_notification
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/372472/%5BAoR%5D%20%D0%A4%D0%B0%D1%80%D0%BC-%D0%9C%D0%B0%D0%BA%D1%80%D0%BE%D1%81-%D1%85%D1%83%D1%8F%D0%BA%D1%80%D0%BE%D1%81.user.js
// @updateURL https://update.greasyfork.org/scripts/372472/%5BAoR%5D%20%D0%A4%D0%B0%D1%80%D0%BC-%D0%9C%D0%B0%D0%BA%D1%80%D0%BE%D1%81-%D1%85%D1%83%D1%8F%D0%BA%D1%80%D0%BE%D1%81.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var $ = unsafeWindow.$;
    var mode = 0; // 0 - хуякрос, 1 - стандартный макрос
    var botData = {};
    var timeItemsTimer;
    var botStarted = false;
    var macroData = null;
    var farmLocation = null;
    var drop = {};
    var farmMacroStatus = -1;
    var gameMap = [
        {
            "id": 119,
            "name": "Каменный молот"
        },
        {
            "id": 15,
            "name": "Владения Байрон"
        },
        {
            "id": 16,
            "name": "Логово жуков"
        },
        {
            "id": 127,
            "name": "Подводная пещера Эгира"
        },
        {
            "id": 39,
            "name": "Холм эльфов"
        },
        {
            "id": 54,
            "name": "Башня огня"
        },
        {
            "id": 62,
            "name": "Оплот гноллов"
        },
        {
            "id": 63,
            "name": "Лес гремлинов"
        },
        {
            "id": 67,
            "name": "Владения Фуриэ"
        },
        {
            "id": 135,
            "name": "Подземелье Валлефора"
        },
        {
            "id": 28,
            "name": "Долина ветра"
        },
        {
            "id": 118,
            "name": "Лес пауков"
        },
        {
            "id": 31,
            "name": "Темные пещеры"
        },
        {
            "id": 121,
            "name": "Берег тритонов"
        },
        {
            "id": 115,
            "name": "Река Раргон"
        },
        {
            "id": 104,
            "name": "Лагерь орков"
        },
        {
            "id": 30,
            "name": "Храм раздора"
        },
        {
            "id": 74,
            "name": "Гробница короля"
        },
        {
            "id": 20,
            "name": "Болото черного Дракона"
        },
        {
            "id": 81,
            "name": "Внешний храм Метеоса"
        },
        {
            "id": 29,
            "name": "Деревня кобольдов"
        },
        {
            "id": 122,
            "name": "Подземелье нежити"
        },
        {
            "id": 14,
            "name": "Храм апостолов"
        },
        {
            "id": 66,
            "name": "Гнездовье гарпий"
        },
        {
            "id": 8,
            "name": "Древний город Нарту"
        },
        {
            "id": 60,
            "name": "Алтарь вурдалака"
        },
        {
            "id": 105,
            "name": "Пещера древних пиратов"
        },
        {
            "id": 80,
            "name": "Лабиринт Манога"
        },
        {
            "id": 61,
            "name": "Водопад гигантов"
        },
        {
            "id": 120,
            "name": "Озеро времени"
        },
        {
            "id": 37,
            "name": "Аллея Джаратан"
        },
        {
            "id": 116,
            "name": "Красная лощина"
        },
        {
            "id": 9,
            "name": "Лестница древних"
        },
        {
            "id": 1,
            "name": "Брошенная деревня"
        },
        {
            "id": 131,
            "name": "Безымянная пещера"
        },
        {
            "id": 53,
            "name": "Терраса злодея"
        },
        {
            "id": 117,
            "name": "Роденский обрыв"
        },
        {
            "id": 93,
            "name": "Руины полнолуния"
        },
        {
            "id": 137,
            "name": "Деревня Эшборн"
        },
        {
            "id": 46,
            "name": "Эльтер"
        },
        {
            "id": 38,
            "name": "Возвышенность Эгира"
        }
    ];
    var currentLocation = null;
    var characterHpMp = { hp: 100, max_hp: 100 };
    var dropHistory = {};
    var dropCfg = {};
    var crazyFarmEnabled = false;

    unsafeWindow.getDrop = () => drop;

    function Chat(options) {
        unsafeWindow.Chat(options);
        console.log(options.chatType, options.message);
    }

    
    GM_registerMenuCommand("Упоротый фарм ВКЛ/ВЫКЛ", () => {
        if (crazyFarmEnabled) {
            crazyFarmEnabled = false;
            Chat({ chatType: "System", message: "Упоротый фарм ОТКЛЮЧЕН", color: "yellow" });
        } else if (farmMacroStatus == -1) {
            crazyFarmEnabled = true;
            Chat({ chatType: "System", message: "Упоротый фарм ВКЛЮЧЕН", color: "yellow" });
        }
    });

    function getCharName() {
       return unsafeWindow.clientData.characters[unsafeWindow.clientData.charID];
    }

    function notification (msg, title, ...args) {
        msg = `[${getCharName()}]` + msg;
        GM_notification(msg, title, ...args);
    }


    /**
     * Оборачивает оригинальную функцию из unsafeWindow
     * @param {string} fname Название функции
     * @param {(next: Function, ...args) => {}} fn Промежуточная функция
     */
    function fwrapUnsafeWindow(fname, fn) {

        if (typeof (unsafeWindow[fname]) != "function") {
            throw new Error(`unsafeWindow[${fname}] is not function`);
        }

        let oldFn = unsafeWindow[`old_${fname}`] = unsafeWindow[fname];
        unsafeWindow[fname] = function (...args) {
            if (typeof (fn) == "function") {
                fn((() => oldFn(...args)), ...args);
            } else {
                oldFn(...args);
            }
        }

        return unsafeWindow[fname];
    }

    function initGameMap() {
        if (gameMap.initialized) return;

        // заполняем карту подлокациями
        for (let m of gameMap) {
            let location = unsafeWindow.Config.locations[m.id];
            m.locations = [location.id];

            let next = location.next;
            while (next && !m.locations.includes(next)) {
                m.locations.push(next);
                next = unsafeWindow.Config.locations[next].next;
            }

            let prev = location.prev;
            while (prev && !m.locations.includes(prev)) {
                m.locations.unshift(prev);
                prev = unsafeWindow.Config.locations[prev].prev;
            }
        }

        gameMap.initialized = true;
    }

    function SendPacket(e) {
        var f = true;
        if (f) {
            var g = {
                encode: function (s, k) {
                    var c = '';
                    var d = '';
                    d = s.toString();
                    for (var i = 0; i < s.length; i++) {
                        var a = s.charCodeAt(i);
                        var b = a ^ k;
                        c = c + String.fromCharCode(b);
                    }
                    return c;
                },
                getNum: function () {
                    if (!unsafeWindow['clientData'].numeric) {
                        unsafeWindow['clientData'].numeric = 0;
                        return 0;
                    } else {
                        return parseInt(unsafeWindow['clientData'].numeric);
                    }
                }
            };
            e.numericPacket = g.getNum();
            e = g.encode(JSON.stringify(e), (199429672276830).toString());
            client.send(e);
            unsafeWindow['clientData'].numeric++;
            if (unsafeWindow['clientData'].numeric > 255) {
                unsafeWindow['clientData'].numeric = 0;
            }
        }
    }

    // спарсить настройки макроса
    function parseMacroData() {
        let hp_items = [];
        // find hp items
        for (let i = 1; i <= 3; i++) {
            let item = $('#macrosItem' + i).children('.item');
            if (item.length == 0) continue;
            let realid = item.data('realid');
            let itemid = item.data('itemid');
            let hp = $('#changeMacrosHp' + i).val();

            if (item.data("from") != "skill") {
                hp_items.push({
                    type: 0,
                    item_id: realid,
                    id: itemid,
                    hp
                });
            } else {
                hp_items.push({
                    type: 1,
                    id: realid,
                    hp
                });
            }
        }

        let time_items = [];
        //time_items
        $('.macrosSkillsPotionsItem:not(.macrosSkillsPotionsBlockedItem)').each((i, e) => {
            e = $(e);
            let item = e.find('.item');

            if (item.length == 0) return;
            let realid = item.data('realid');
            let itemid = item.data('itemid');
            let time = parseInt(e.find('.macrosTimeWaiting').val());

            if (item.data("from") != "skill") {
                time_items.push({
                    type: 0,
                    item_id: realid,
                    id: itemid,
                    time
                });
            } else {
                time_items.push({
                    type: 1,
                    id: realid,
                    time
                });
            }
        })

        let mob = $("#macrosMob").data('value');

        return {
            hp_items, time_items, mob
        }
    }

    function getInventoryItem(propName, value) {
        for (let i in unsafeWindow.clientData.inventory) {
            let item = unsafeWindow.clientData.inventory[i];
            if (item.hasOwnProperty(propName) && item[propName] == value) return item;
        }

        return null;
    }

    // получить локацию фарма
    function getFarmLocation() {
        if (macroData) {
            let locations = Object.values(unsafeWindow.Config.locations);
            for (let loc of locations) {
                if (loc.mobs && loc.mobs.find(mob => mob.id == macroData.mob)) {
                    return loc;
                }
            }
        } else return 0;
    }

    // получить инфу о выбитом дропе
    function getDrop() {
        return Object.values(drop);
    }

    //очистить дроп
    function clearDrop() {
        drop = {};
    }

    function addDrop(item) {

        let cfgItem = Config.items[item.item_id];
        // не учитываем серебро и шмотки пол замком
        if (![409].includes(item.item_id) && !item.lock) {
            if (drop[item.unique_id] == undefined) {
                drop[item.unique_id] = Object.assign({}, item);
            } else {
                drop[item.unique_id].amount += item.amount;
            }
        }

        console.log("AddDrop", cfgItem.name, item.amount);

        if (dropHistory[item.item_id] == undefined) {
            dropHistory[item.item_id] = Object.assign({}, item);
        } else {
            dropHistory[item.item_id].amount += item.amount;
        }
    }

    // получить дроп на продажу
    function getSoldDrop() {
        return getDrop().filter((item) => dropCfg[item.item_id] == 2);
    }

    // получить дроп на хранение
    function getStorableDrop() {
        return getDrop().filter((item) => dropCfg[item.item_id] != 2);
    }

    // получить список покупаемых банок у алхимика
    function getShopItems() {
        let items = [];

        if (macroData) {
            for (let item of [].concat(macroData.hp_items, macroData.time_items)) {
                if (item.type == 0 && item.maxAmount) {
                    // ищем такую банку в инвентаре
                    let invItem = getInventoryItem("item_id", item.item_id);
                    let count = item.maxAmount;

                    if (invItem) {
                        count -= invItem.amount;
                    }

                    if (count > 0) {
                        items.push({
                            item_id: item.item_id,
                            amount: count,
                            type: "BuyItem",
                            id: 17 // id npc
                        });
                    }

                }
            }
        }

        // обязательно покупаем 1 зельку тп, елси про них забыли
        if (!items.find(item => item.item_id == 357) && !getInventoryItem("item_id", 357)) {
            items.push({
                item_id: 357,
                amount: 1,
                type: "BuyItem",
                id: 17
            });
        }

        return items;
    }

    function getMacroData() {
        return {
            mob: macroData.mob,
            hp_items: macroData.hp_items.map((item) => {
                if (item.type == 0) {
                    item.id = (getInventoryItem("item_id", item.item_id) || {}).unique_id
                }
                return item;
            }).sort((a, b) => { // сортируем хп итмесы по кол-ву хп в убывании
                // если это зелька тп то она должна быть первой
                if (a.item_id == 357 || b.item_id == 357) {
                    return 1;
                }

                let aTest = /%/.test(String(a.hp));
                let bTest = /%/.test(String(b.hp));

                if (aTest && bTest) {
                    let aHp = parseInt(a.hp.replace("%", ""));
                    let bHp = parseInt(b.hp.replace("%", ""));

                    if (aHp < bHp) return -1;
                    else if (aHp > bHp) return 1;
                    return 0;

                } else if (aTest) {
                    return 1;
                } else if (bTest) {
                    return -1;
                } else {
                    if (a.hp < b.hp) return -1;
                    else if (a.hp > b.hp) return 1;
                    return 0;
                }
            }),
            time_items: macroData.time_items.map((item) => {
                if (item.type == 0) {
                    return {
                        id: (getInventoryItem("item_id", item.item_id) || {}).unique_id,
                        item_id: item.item_id,
                        type: 0,
                        time: item.time
                    }
                } else {
                    return item;
                }
            })
        }
    }

    function initConfigs() {
        if (unsafeWindow.Config.initialized) return;

        // добавляем недостающего шмота в конфигах
        unsafeWindow.Config.npcs[17].sale_items.push({ item_id: 7424, price: 150 });

        unsafeWindow.Config.initialized = true;
    }

    function initGui() {
        $('.macrosSkillsPotionsItem').removeClass('macrosSkillsPotionsBlockedItem');
        $('.macrosTimeWaiting').prop('disabled', false);

        var hyacrosBtn = $('<span>', {
            text: "Хуякрос",
            css: {
                cursor: "pointer"
            }
        });

        var macrosBtn = $('<span>', {
            text: "Макрос",
            css: {
                "text-decoration": "line-through",
                cursor: "pointer"
            }
        });

        hyacrosBtn.on("click", function () {
            if (botStarted) return;
            $(this).css("text-decoration", "none");
            macrosBtn.css("text-decoration", "line-through");
            mode = 0;
        });

        macrosBtn.on("click", function () {
            if (botStarted) return;
            $(this).css("text-decoration", "none");
            hyacrosBtn.css("text-decoration", "line-through");
            mode = 1;
        });

        $('.macros>.windowHeader').html("").append(macrosBtn, " ", hyacrosBtn);

        $("#startMacros").off('click');
        $("#startMacros").on('click', function () {
            if ($(this).hasClass('disabled')) return;

            macroData = parseMacroData();
            farmLocation = getFarmLocation();

            for (let item of [].concat(macroData.hp_items, macroData.time_items)) {
                // если это предмет и он продатся у алхимика
                if (item.type == 0 && unsafeWindow.Config.npcs[17].sale_items.find(i => i.item_id == item.item_id)) {
                    let invItem = getInventoryItem("item_id", item.item_id);
                    if (invItem) {
                        item.maxAmount = invItem.amount;
                    }

                }
            }
            botStart();
        });

        $("#stopMacros").off("click");
        $("#stopMacros").on('click', function () {
            if ($(this).hasClass('disabled')) return;
            botStop();
        });
    }

    fwrapUnsafeWindow("BlockDrop", function () {

    });

    fwrapUnsafeWindow("DropList", function (next, data) {
        next();

        $(".dropItem").attr("disabled", null);
        $(".dropItem").unbind('click');

        let setBgColor = (el, item_id) => {
            switch (dropCfg[el.data("dropid")]) {
                case 0: el.css({ "background-color": "inherit" }); break;
                case 1: el.css({ "background-color": "red" }); break;
                case 2: el.css({ "background-color": "green" }); break;
            }
        }

        $(".dropItem").each((i, e) => setBgColor($(e)));

        $(".dropItem").on("click", function () {
            let el = $(this);
            let item_id = el.data("dropid");
            let item_view = el.data('view');

            if (dropCfg[item_id] == undefined) {
                dropCfg[item_id] = 0;
            }

            dropCfg[item_id] += 1;

            if (dropCfg[item_id] > 2) {
                dropCfg[item_id] = 0;
            }

            if (dropCfg[item_id] == 1) {
                SendPacket({
                    type: "BlockDrop",
                    item_id,
                    item_view,
                    disabled: false
                });
            } else if (dropCfg[item_id] == 2) {
                SendPacket({
                    type: "BlockDrop",
                    item_id,
                    item_view,
                    disabled: true
                });
            }


            setBgColor(el);

        })
    });

    fwrapUnsafeWindow("StartGame", function (next, startData) {
        next();

        initConfigs();
        initGameMap();
        initGui();

        client.off("message", messageHandler);
        currentLocation = unsafeWindow.Config.locations[startData.location];
        console.log("Бот готов к использованию!");
    });

    function botStart() {
        if (botStarted) return;

        botData = getMacroData();

        if (!Config.monsters[botData.mob]) {
            Chat({ message: "Не выбран монстр!", chatType: "System", color: "red" });
            return;
        }

        botStarted = true;
        farmMacroStatus = -1;
        clearDrop();

        currentLocation = farmLocation;


        $('.macrosSkillsPotionsItem').removeClass('macrosSkillsPotionsBlockedItem');
        $('.macrosTimeWaiting').prop('disabled', false);

        $("#startMacros").addClass('disabled');
        $("#stopMacros").removeClass('disabled');

        if (mode == 0) {
            client.on("message", messageHandler);

            timeItemsTimer = setInterval(function () {
                // первым делом юзаем хп итемы
                let pcHp = Math.round(characterHpMp.hp / characterHpMp.max_hp * 100); // текущее hp в процентах
                for (let item of botData.hp_items) {
                    // если это банка тп и мы уже в деревне то пропускаем её
                    if (item.item_id == 357) {
                        if (currentLocation && currentLocation.name == "Деревня Эшборн") {
                            continue;
                        }
                    }

                    let heal = false;

                    if (/%/.test(item.hp)) { // процентное сравнение hp
                        let pc = parseInt(item.hp.replace("%", "")) || 80; // при скольки % юзать предмет, по умолчанию 80
                        if (pcHp < pc) {
                            heal = true;
                        }
                    } else if (characterHpMp.hp <= parseInt(item.hp)) { // числовое сравнение
                        heal = true;
                    }

                    if (heal) {
                        if (item.type == 0) useItem(item.id);
                        else useSkill(item.id);
                        break;
                    }
                }

                // потом если с хп все норм юзаем тайм итемсы
                for (let item of botData.time_items) {
                    if (item.lastUse < Date.now() || item.lastUse == undefined) {
                        if (item.type == 1) {
                            useSkill(item.id);
                        } else {
                            useItem(item.id);
                        }
                        item.lastUse = Date.now() + item.time * 1000;
                        break;
                    }
                }
            }, 1000);
            setTarget();
            Chat({ message: "Хуякрос запущен!", chatType: "System", color: "green" });
        } else {
            SendPacket({
                type: "StartMacros",
                data: botData
            });
            Chat({ message: "Макрос запущен!", chatType: "System", color: "green" });
        }
    }

    let messages = [
        "что это",
        "чо эт такое?",
        "какого хрена",
        "блэд, как я суда попал",
        "где это я",
        "опять? :/",
        "что за баг",
        "?????",
        "wtf",
        "4to eto",
        "мама я в телике :D здарова",
        "оооооо, привет! ))",
        "Дратути ^^, Чем могу помоч?",
        "Сеееергооо  :))). Что делаем",
        "ого. сам админ :D. замутите ивент на пушки",
        "как отсюда уйти, помогите"
    ];

    function rnd(max) {
        return Math.floor(Math.random() * max);
    }

    function getRandomMessage() {
        return messages[rnd(messages.length)];
    }

    function useTp() {
        let tpitem = getInventoryItem("item_id", 357);

        if (tpitem) {
            useItem(tpitem);
        } else {
            Chat({ message: "Нет банок тп", chatType: "System", color: "green" });
        }
    }

    // получить карту локации
    function getLocationMap(locationId) {
        return gameMap.find(m => m.locations.includes(locationId))
    }

    function moveToLocation(currentLocId, targetLocId) {
        let currentLoc = unsafeWindow.Config.locations[currentLocId];
        let targetLoc = unsafeWindow.Config.locations[targetLocId];

        if (currentLoc == targetLoc) {
            console.log("Мы в нужной локации", targetLoc);
            return true;
        }

        // для пп перемещение немного другое
        if (targetLocId == 113 || targetLocId == 114) {
            if (currentLoc.name == "Деревня Эшборн") {
                if (currentLoc.id == 152) {
                    SendPacket({
                        "type": "Dialog",
                        "id": 11,
                        "num": 0
                    });
                    setTimeout(() => {
                        SendPacket({
                            "type": "NPC_EnterPremium2",
                            "id": 11
                        });
                    }, 1000);
                } else {
                    SendPacket({ type: "MoveLocation", id: currentLoc.next });
                }
            } else if (currentLocId == 113) {
                SendPacket({ type: "MoveLocation", id: 114 });
            } else {
                SendPacket({ type: "Map", id: 137 });
            }

            return;
        }

        // перемещение для акры
        if ([3, 4, 5, 6].includes(targetLocId)) {
            if (currentLoc.name == "Деревня Эшборн") {
                if (currentLoc.id != 156) {
                    SendPacket({ type: "MoveLocation", id: currentLoc.next });
                } else {
                    SendPacket({ type: "Dialog", id: 15, num: 0 });
                    setTimeout(() => {
                        SendPacket({ type: "NPC_Teleport", to: 4, id: 15 });
                    }, 500);
                }
                return;
            }
        }

        let currentLocMap = getLocationMap(currentLoc.id);
        let targetLocMap = getLocationMap(targetLoc.id);

        // чекаем есть ли лока на карте
        if (currentLocMap == targetLocMap) {
            console.log("Мы находимся в нужной карте", targetLocMap);
            if (currentLoc.id < targetLoc.id) {
                console.log("Идем вперед", currentLoc.next);
                SendPacket({ type: "MoveLocation", id: currentLoc.next });
            } else {
                console.log("Идем назад", currentLoc.prev);
                SendPacket({ type: "MoveLocation", id: currentLoc.prev });
            }
        } else {
            console.log("Мы находимся в разных картах. Нужно тпхаться сюда:", targetLocMap);
            SendPacket({ type: "Map", id: targetLocMap.id });
        }

        return false;
    }

    function printDropHistory() {
        let chatMsg = "<pre>\nНафармлено:\n";
        for (let item of Object.values(dropHistory)) {
            let cfg = unsafeWindow.Config.items[item.item_id];
            chatMsg += `    ${cfg.name} ${item.amount} шт.\n`;
        }
        chatMsg += "\n</pre>"
        Chat({ chatType: "System", message: chatMsg, color: "green" })
        console.log(chatMsg);
    }

    function clearDropHistory() {
        dropHistory = {};
    }

    unsafeWindow.printDropHistory = printDropHistory;

    function botStop() {
        if (!botStarted) return;
        printDropHistory();
        clearDropHistory();
        clearDrop();
        botStarted = false;
        farmMacroStatus = -1;
        if (mode == 0) {
            clearInterval(timeItemsTimer);
            client.off("message", messageHandler);
            $("#startMacros").removeClass('disabled');
            $("#stopMacros").addClass('disabled');
            Chat({ message: "Хуякрос остановлен!", chatType: "System", color: "orange" });
        } else {
            SendPacket({
                type: "StopMacros"
            });
            Chat({ message: "Макрос остановлен!", chatType: "System", color: "orange" });
        }
    }

    function setTarget() {
        setTimeout(function () {
            SendPacket({ type: "SetTarget", is: "mob", id: botData.mob });
        }, Math.round(Math.random() * 200 + 100));
    }

    function messageHandler(e) {
        switch (e.type) {
            // отмена цели
            case "UnTarget":
                setTarget();
                break;

            // изменение hp
            case "CharacterHpMp":
                characterHpMp = e;

                if ((characterHpMp.hp / characterHpMp.max_hp * 100) < 15 && currentLocation.name != "Деревня Эшборн") {
                    Chat({ message: `Критически низкий ур здоровья: ${characterHpMp.hp}. Тп в город.`, chatType: "System", color: "orange" });
                    useTp();
                }

                break;

            case "CharacterWeight":
                // если вес больше 70% то тп в город чтоб сложить хлам в кладовку
                if ((e.weight / e.max_weight * 100) > 70 && currentLocation.name != "Деревня Эшборн") {
                    Chat({ message: `Персонаж загружен на ${Math.round((e.weight / e.max_weight * 100))}%`, chatType: "System", color: "orange" });
                    useTp();
                }
                break;

            case "AddItemToInventory":
                if (farmMacroStatus == -1) {
                    let item = unsafeWindow.decodeItem(e.item);
                    addDrop(item);
                } else {
                    console.log("AddDropError farmMacroStatus != -1");
                }

                break;

            case "NewsInfo":
                if (e.newsType == "YOU_IN_TARGET") {
                    if (!crazyFarmEnabled) {
                        notification(`На вас напал ${e.attr[0]}\n Бот отключен!`, "[ФармХуякрос]");
                        botStop();
                    } else {
                        notification(`На вас напал ${e.attr[0]}\n Но мне пох, продожаем фармить ^^,`, "[ФармХуякрос]");
                        farmMacroStatus = -2;
                    }
                }
                break;

            case "InitLocation":
                currentLocation = unsafeWindow.Config.locations[e.location];

                if (e.location == 158) { // знач мы в локи админов
                    botStop();
                    notification("ВАС ПРОВЕРЯЕТ АДМИН", "СРОЧНО!!");
                    setTimeout(function () {
                        SendPacket({ type: "Chat", chatType: "Simple", message: getRandomMessage() });
                    }, rnd(3000) + 1000);

                    setTimeout(function () {
                        let tpitem = getInventoryItem("item_id", 357);
                        if (tpitem) useItem(tpitem.unique_id);
                    }, 500);
                } else {
                    if (!botStarted) return;

                    if (currentLocation == undefined) {
                        console.error("ЛОКАЦИЯ НЕ НАЙДЕНА", e)
                        return;
                    }

                    if (currentLocation.name == "Деревня Эшборн" && farmMacroStatus != 2) {
                        switch (farmMacroStatus) {
                            case -2:
                                let duraion = 1000 * 60 * 3; // 3 мин
                                duraion += rnd(1000 * 60 * 2); // + рандомные пару мин
                                console.log(`Ждем ${Math.round(duraion / 1000)} сек и снова фармить ^^,`);
                                setTimeout(() => {
                                    if (farmMacroStatus != -2) return;
                                    farmMacroStatus = 0;
                                    SendPacket({
                                        type: "MoveLocation",
                                        id: currentLocation.prev
                                    });
                                }, duraion)
                                break;
                            case -1:  // ожидаем окончания боя (пару сек) потом идем дальше
                                console.log("Ждем окончания боя");
                                setTimeout(() => {
                                    if (farmMacroStatus != -1) return;
                                    farmMacroStatus = 0;
                                    SendPacket({
                                        type: "MoveLocation",
                                        id: currentLocation.prev
                                    });
                                }, 5000);
                                break;
                            case 0: // идем складировать шмот
                                if (e.location == 153) {
                                    console.log("Складываем шмот!!", getStorableDrop());
                                    for (let item of getStorableDrop()) {
                                        SendPacket({
                                            type: "PutItem",
                                            id: 10,
                                            unique_id: item.unique_id,
                                            amount: item.amount
                                        });
                                    }
                                    farmMacroStatus = 1;
                                    setTimeout(() => {
                                        SendPacket({
                                            type: "MoveLocation",
                                            id: currentLocation.prev
                                        });
                                    }, 3000);
                                } else {
                                    console.log("Идем к кладовке..");
                                    SendPacket({
                                        type: "MoveLocation",
                                        id: currentLocation.prev
                                    });
                                }

                                break;

                            case 1: // продаем хлам и закупаемся хилками у алхимика
                                if (e.location == 137) {
                                    console.log("Продаем хлам!", getSoldDrop());
                                    for (let item of getSoldDrop()) {
                                        SendPacket({
                                            type: "SellItem",
                                            id: 17,
                                            unique_id: item.unique_id,
                                            amount: item.amount
                                        });
                                    }

                                    console.log("Закупаемся у алхимика", getShopItems());
                                    for (let packet of getShopItems()) {
                                        SendPacket(packet);
                                    }
                                    farmMacroStatus = 2;
                                    setTimeout(() => {
                                        botData = getMacroData();
                                        SendPacket({
                                            type: "MoveLocation",
                                            id: currentLocation.prev
                                        });
                                    }, 5000);
                                } else {
                                    console.log("Идем к алхимику.");

                                    SendPacket({
                                        type: "MoveLocation",
                                        id: currentLocation.prev
                                    });
                                }
                                break;
                        }
                    } else if (farmMacroStatus == 2) {
                        //идем на фарм
                        if (moveToLocation(currentLocation.id, farmLocation.id)) {
                            clearDrop();
                            farmMacroStatus = -1;
                            botData = getMacroData();
                            console.log("Мы прибыли к месту фарма. Запускаем макрос!", farmLocation, botData);
                            setTarget();
                        } else {
                            console.log("Шагаем к месту фарма", farmLocation);
                        }
                    }
                }
                break;
        }
    }

    function useItem(data) {
        if (typeof (data) == "object") {
            SendPacket({ type: "UseItem", uniqueID: data.unique_id });
        } else {
            if (getInventoryItem("unique_id", data)) {
                SendPacket({ type: "UseItem", uniqueID: data });
            } else {
                Chat({ message: `Несуществующий предмет ${data}`, chatType: "System", color: "red" });
            }
        }
    }

    function useSkill(skill_id) {
        let skillInfo = unsafeWindow.Config.skills[skill_id];
        let items = [];

        if (skillInfo.params.need_item) {
            for (let need_item of skillInfo.params.need_item) {
                let item = getInventoryItem("item_id", need_item.id);
                items.push(item.unique_id);
            }
        }

        SendPacket({ type: "UseSkill", id: skill_id, target: "", items: items, friends: false });
    }
})();