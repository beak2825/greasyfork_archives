// ==UserScript==
// @name         [tradeit.gg] TradeBot
// @namespace    tradeit.gg:tuxuuman:trade-bot
// @version      1.0.1
// @description  Автоматический поиск и покупка нужных предметов
// @author       tuxuuman<vk.com/tuxuuman, tuxuuman@gmail.com>
// @match        https://tradeit.gg/*
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_notification
// @grant        GM_info
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/421064/%5Btradeitgg%5D%20TradeBot.user.js
// @updateURL https://update.greasyfork.org/scripts/421064/%5Btradeitgg%5D%20TradeBot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // настройки бота
    const botSettings =  {
        debug: true,
        shoppingList: {
            // PUBG
            "578080": [],
            // RUST
            "252490": [],
            // H1Z1
            "433850": [],
            // Dota2
            "570": [
                "Vigil Triumph",
                "Inscribed Voidhammer"
            ],
            // CS:GO
            "730": [
                "AWP | Fade (Factory New)",
                "MP9 | Orange Peel"
            ]
        },
        usingFilter: true, // нужно ли учитывать фильтры с сайта
        delayFind: 10, // задержка между повторным поиском в секундах. не рекоммендую делать меньше 5
        tradeTimeout: 300, // таймаут обмена в секундах
        silent: false, // включить тихий режим без уведомлений
    };

    // статус бота (запущен или нет)
    let botIsStarted = false;
    // идентификатор команды запуска
    let startCmdId = GM_registerMenuCommand("Запустить бота", botStart);
    // идентификатор команды остановки
    let stopCmdId = 0;
    // тут будет "true", если бот запущен автоматически
    let autostarted = false;
    // счетчик "тиков"
    let tickCounter = 0;

    // благодоря этому кошмарному коду, сохраняются фильтры после перезагрузки страницы
    function initFilters() {
        csgo_float_low = 0;
        csgo_float_high = 1;

        minPrice = +(GM_getValue("lprange") / conversions.rates[currency] * 100)|| minPrice;
        $('#lprange').val(GM_getValue("lprange") || minPrice);
        $('#lprange').on("change", (e) => {
            minPrice = e.target.value / conversions.rates[currency] * 100;
            GM_setValue("lprange", e.target.value);
        });

        maxPrice = +(GM_getValue("hprange") / conversions.rates[currency] * 100) || maxPrice;
        $('#hprange').val(GM_getValue("hprange") || maxPrice);
        $('#hprange').on("change", (e) => {
            maxPrice = e.target.value / conversions.rates[currency] * 100;
            GM_setValue("hprange", e.target.value);
        });

        xbonusonly = GM_getValue("xbonusonly") || xbonusonly;
        $('#xbonusonly').prop("checked", GM_getValue("xbonusonly") || xbonusonly);
        $('#xbonusonly').on("change", (e) => {
            xbonusonly = e.target.checked;
            GM_setValue("xbonusonly", e.target.checked);
        });

        tradableonly = GM_getValue("tradableonly") || tradableonly;
        $('#tradableonly').prop("checked", GM_getValue("tradableonly") || tradableonly);
        $('#tradableonly').on("change", (e) => {
            tradableonly = e.target.checked;
            GM_setValue("tradableonly", e.target.checked);
        });

        tradelock_only = GM_getValue("7daylock_only") || tradelock_only;
        $('#7daylock_only').prop("checked", GM_getValue("7daylock_only") || tradelock_only);
        $('#7daylock_only').on("change", (e) => {
            tradelock_only = e.target.checked;
            GM_setValue("7daylock_only", e.target.checked);
        });

        hideuserlistings = GM_getValue("hideuserlistings") || hideuserlistings;
        $('#hideuserlistings').prop("checked", GM_getValue("hideuserlistings") || hideuserlistings);
        $('#hideuserlistings').on("change", (e) => {
            hideuserlistings = e.target.checked;
            GM_setValue("hideuserlistings", e.target.checked);
        });

        favonly = GM_getValue("favonly") || favonly;
        $('#favonly').prop("checked", GM_getValue("favonly") || favonly);
        $('#favonly').on("change", (e) => {
            favonly = e.target.checked;
            GM_setValue("favonly", e.target.checked);
        });

        pubg_slot_type = GM_getValue("pubg-slot-type") || pubg_slot_type;
        $('#pubg-slot-type').val(GM_getValue("pubg-slot-type") || pubg_slot_type);
        $('#pubg-slot-type').on("change", (e) => {
            pubg_slot_type = e.target.value;
            GM_setValue("pubg-slot-type", e.target.value);
        });

        pubg_rarity_type = GM_getValue("pubg-rarity-type") || pubg_rarity_type;
        $('#pubg-rarity-type').val(GM_getValue("pubg-rarity-type") || pubg_rarity_type);
        $('#pubg-rarity-type').on("change", (e) => {
            pubg_rarity_type = e.target.value;
            GM_setValue("pubg-rarity-type", e.target.value);
        });

        dota_rarity_type = GM_getValue("dota_rarity-type") || dota_rarity_type;
        $('#dota_rarity-type').val(GM_getValue("dota_rarity-type") || dota_rarity_type);
        $('#dota_rarity-type').on("change", (e) => {
            dota_rarity_type = e.target.value;
            GM_setValue("dota_rarity-type", e.target.value);
        });

        dota_item_type = GM_getValue("dota_item_type") || dota_item_type;
        $('#dota_item_type').val(GM_getValue("dota_item_type") || dota_item_type);
        $('#dota_item_type').on("change", (e) => {
            dota_item_type = e.target.value;
            GM_setValue("dota_item_type", e.target.value);
        });

        h1z1_slot_type = GM_getValue("h1z1-slot-type") || h1z1_slot_type;
        $('#h1z1-slot-type').val(GM_getValue("h1z1-slot-type") || h1z1_slot_type);
        $('#h1z1-slot-type').on("change", (e) => {
            h1z1_slot_type = e.target.value;
            GM_setValue("h1z1-slot-type", e.target.value);
        });

        h1z1_rarity_type = GM_getValue("h1z1-rarity-type") || h1z1_rarity_type;
        $('#h1z1-rarity-type').val(GM_getValue("h1z1-rarity-type") || h1z1_rarity_type);
        $('#h1z1-rarity-type').on("change", (e) => {
            h1z1_rarity_type = e.target.value;
            GM_setValue("h1z1-rarity-type", e.target.value);
        });

        rust_main_type = GM_getValue("rust-main-type") || rust_main_type;
        $('#rust-main-type').val(GM_getValue("rust-main-type") || rust_main_type);
        $('#rust-main-type').on("change", (e) => {
            rust_main_type = e.target.value;
            GM_setValue("rust-main-type", e.target.value);
        });

        rust_sub_type = GM_getValue("rust-sub-type") || rust_sub_type;
        $('#rust-sub-type').val(GM_getValue("rust-sub-type") || rust_sub_type);
        $('#rust-sub-type').on("change", (e) => {
            rust_sub_type = e.target.value;
            GM_setValue("rust-sub-type", e.target.value);
        });

        tf_quality_type = GM_getValue("tf-quality-type") || tf_quality_type;
        $('#tf-quality-type').val(GM_getValue("tf-quality-type") || tf_quality_type);
        $('#tf-quality-type').on("change", (e) => {
            tf_quality_type = e.target.value;
            GM_setValue("tf-quality-type", e.target.value);
        });

        tf_type_type = GM_getValue("tf-type-type") || tf_type_type;
        $('#tf-type-type').val(GM_getValue("tf-type-type") || tf_type_type);
        $('#tf-type-type').on("change", (e) => {
            tf_type_type = e.target.value;
            GM_setValue("tf-type-type", e.target.value);
        });

        tf_class_type = GM_getValue("tf-class-type") || tf_class_type;
        $('#tf-class-type').val(GM_getValue("tf-class-type") || tf_class_type);
        $('#tf-class-type').on("change", (e) => {
            tf_class_type = e.target.value;
            GM_setValue("tf-class-type", e.target.value);
        });

        tf_marketable_type = GM_getValue("tf-marketable-type") || tf_marketable_type;
        $('#tf-marketable-type').val(GM_getValue("tf-marketable-type") || tf_marketable_type);
        $('#tf-marketable-type').on("change", (e) => {
            tf_marketable_type = e.target.value;
            GM_setValue("tf-marketable-type", e.target.value);
        });

        csgo_float_low = GM_getValue("csgo-float-low") || csgo_float_low;
        $('#csgo-float-low').val(GM_getValue("csgo-float-low") || csgo_float_low);
        $('#csgo-float-low').on("change", (e) => {
            csgo_float_low = e.target.value;
            GM_setValue("csgo-float-low", e.target.value);
        });

        csgo_float_high = GM_getValue("csgo-float-high") || csgo_float_high;
        $('#csgo-float-high').val(GM_getValue("csgo-float-high") || csgo_float_high);
        $('#csgo-float-high').on("change", (e) => {
            csgo_float_high = e.target.value;
            GM_setValue("csgo-float-high", e.target.value);
        });

        csgo_sticker_type = GM_getValue("csgo-stickers-type") || csgo_sticker_type;
        $('#csgo-stickers-type').val(GM_getValue("csgo-stickers-type") || csgo_sticker_type);
        $('#csgo-stickers-type').on("change", (e) => {
            csgo_sticker_type = e.target.value;
            GM_setValue("csgo-stickers-type", e.target.value);
        });

        csgo_stattrak_type = GM_getValue("csgo-stattrak-type") || csgo_stattrak_type;
        $('#csgo-stattrak-type').val(GM_getValue("csgo-stattrak-type") || csgo_stattrak_type);
        $('#csgo-stattrak-type').on("change", (e) => {
            csgo_stattrak_type = e.target.value;
            GM_setValue("csgo-stattrak-type", e.target.value);
        });

        csgo_collection_type = GM_getValue("csgo-collection-type") || csgo_collection_type;
        $('#csgo-collection-type').val(GM_getValue("csgo-collection-type") || csgo_collection_type);
        $('#csgo-collection-type').on("change", (e) => {
            csgo_collection_type = e.target.value;
            GM_setValue("csgo-collection-type", e.target.value);
        });

        csgo_exterior_type = GM_getValue("csgo-exterior-type") || csgo_exterior_type;
        $('#csgo-exterior-type').val(GM_getValue("csgo-exterior-type") || csgo_exterior_type);
        $('#csgo-exterior-type').on("change", (e) => {
            csgo_exterior_type = e.target.value;
            GM_setValue("csgo-exterior-type", e.target.value);
        });

        csgo_rarity_type = GM_getValue("csgo-rarity-type") || csgo_rarity_type;
        $('#csgo-rarity-type').val(GM_getValue("csgo-rarity-type") || csgo_rarity_type);
        $('#csgo-rarity-type').on("change", (e) => {
            csgo_rarity_type = e.target.value;
            GM_setValue("csgo-rarity-type", e.target.value);
        });

        csgo_item_type = GM_getValue("csgo-item-type") || csgo_item_type;
        $('#csgo-item-type').val(GM_getValue("csgo-item-type") || csgo_item_type);
        $('#csgo-item-type').on("change", (e) => {
            csgo_item_type = e.target.value;
            GM_setValue("csgo-item-type", e.target.value);
        });
    }

    // показать уведомление
    function notify(text) {
        console.log(`[${GM_info.script.name}]`, text);
        if (!botSettings.silent) GM_notification({
            silent: true,
            text,
            title: GM_info.name,
            icon: GM_info.icon,
            timeout: 5000
        });
    }

    // получить список предметов для указанной игры
    function getItems(gameId) {
        return new Promise((resolve, reject) => {
            unsafeWindow.$.getJSON(jsonurl + "/" + gameId, function(data) {
                try {
                    let items = [];
                    let tempAllItems = {};
                    data.forEach(function(bot, i) {
                        for (let gameKey in bot) {
                            for (let itemKey in bot[gameKey].items) {
                                let item = bot[gameKey].items[itemKey];
                                let newKey = gameKey == 730? itemKey : item.q;

                                if (gameKey != 73099) {
                                    item.g = gameKey;
                                } else {
                                    item.g = 730;
                                }
                                item.gameType = 0;
                                if (gameKey == 730) {
                                    item.gameType = 1;
                                }
                                if (gameKey == 73099) {
                                    item.gameType = 2;
                                }

                                item.n = getFullName(item, itemKey, gameKey);
                                item.g = gameKey;
                                item.context = getContextID(item);
                                item.c = itemKey.split('_')[0];
                                item.d.forEach(function(d) {
                                    d.b = i;
                                    d.c = item.c;
                                    if (item.cp) {
                                        d.cp = item.cp;
                                    }
                                });

                                if (item.cp) {
                                    item.p = item.cp;
                                    delete item.cp;
                                } else {
                                    counts[newKey] = (counts[newKey]) ? counts[newKey] + item.d.length : item.d.length;
                                }

                                if (tempAllItems[newKey]) {
                                    tempAllItems[newKey].d = tempAllItems[newKey].d.concat(item.d);
                                } else {
                                    tempAllItems[newKey] = item;
                                }
                            }
                        }
                    });

                    for (itemKey in tempAllItems) {
                        shuffle(tempAllItems[itemKey].d);
                        items.push(tempAllItems[itemKey]);
                    }

                    items.sort(function(a, b) {
                        var diff = (b.d[0].hi || b.hi) - (a.d[0].hi || a.hi);
                        if (diff == 0) {
                            return (b.d[0].p || b.p) - (a.d[0].p || a.p);
                        }
                        return diff;
                    });

                    resolve(items);
                } catch (err) {
                    console.error("Не удалось получить список предметов", err);
                    console.error(data);
                    err.message = "Не удалось получить список предметов. " + err.message,
                        reject(err);
                }
            }).fail(reject);
        });
    }

    // перезагрузка страницы для последующего авто-перезапуска скрипта
    function reloadPage(timeout = 0, message = "") {
        setTimeout(() => {
            if (!botIsStarted) return;
            botStop(message);
            unsafeWindow.location.href = "https://tradeit.gg/#autostart-" + Date.now(); // благодоря хэшу "#autostart" в url, скрипт поймер что нужно автоматически запустится
            unsafeWindow.location.reload();
        }, timeout);
    }

    // проверка состояния обмена
    // возвращает true если обмен состоялся, false если обмен не завершен и "error" если трейд не запущен
    function checkTrade() {
        if (inMultiTradeView) {
            let processorTr = $('#multitrade-modal table tr.trade-processor');

            let process = processorTr.map((i, e) => {
                return {
                    error: (e.innerHTML.match(/circle.+stroke="#D06079"/g) || []).length,
                    success: (e.innerHTML.match(/circle.+stroke="#73AF55"/g) || []).length
                }
            }).toArray();

            let tradesCount = processorTr.length;
            let completeTradeCount = process.filter(p => p.error || p.success >= 3).length;

            return completeTradeCount >= tradesCount;
        } else if (inNormalTradeView) {
            let tradedmodalBodyHtml = $('#tradedmodal .modal-body').html();
            let errorCount = (tradedmodalBodyHtml.match(/stroke="#D06079"/) || []).length;
            let successCount = (tradedmodalBodyHtml.match(/stroke="#73AF55"/) || []).length;
            return (errorCount || successCount >= 3) == true;
        } else {
            return "error";
        }
    }

    // начинает обмен
    function startTrade(items) {
        return new Promise((resolve, reject) => {
            console.log("startTrade", items);
            notify(`Начинаем обмен предметов:\n\n${items.map(i => i.n).join("\n")}`);
            let sselected = [];
            let typeMap = {};
            // формат строки с информацией о выбраном предмете: gameId_itemContext_itemId_itemClass_itemName
            // пример массива строк = ["570_2_15894329864_996698934_Inscribed Jewel of Aeons_8_0_134", "570_2_15892980491_996698934_Inscribed Jewel of Aeons_33_0_134"];

            for(let item of items) {
                for(let id of item.d) {
                    let tradeStr = `${item.g}_${item.context}_${id.i}_${item.c}_${item.n}_${id.b}_${item.a}_${item.p}`;
                    sselected.push(tradeStr);
                    typeMap[tradeStr] = {type: "1"};
                }
            }

            unsafeWindow.sselected = sselected;
            unsafeWindow.typeMap = typeMap;
            unsafeWindow.$('#trade').click();

            $('#multitrade-modal table tr.trade-processor').each((i, e) => {
                e = $(e);
                let tradeId = e.attr('id').split('-')[1];
                let tradeData = (trades[tradeId] || {tradeData: []}).tradeData;
                let names = tradeData.map(t => t.split('_')[5]).join(', ');
                e.append(`<td style="font-size: 10px;">${names}</td>`);
            });

            let startDate = Date.now();

            // таймер проверки завершения обмена
            let checkTimer = setInterval(() => {
                let status = checkTrade();
                if (status === "error") reject(new Error("Не удалось запустить обмен"));
                else if (status === true) resolve();
                else if ((Date.now() - startDate) > 1000 * botSettings.tradeTimeout) reject(new Error("Превышен лимит ожидания звершения трейда"));
            }, 1000);
        });
    }

    // замедляет вызов функции
    function slowDown(fn, duration) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try { resolve(fn()); }
                catch (err) { reject(err); }
            }, duration);
        });
    }

    // данная функция вызывает сама-себя пока не найдет хотябы один нужный предмет, после чего запустит обмен и потом перезагрузит страницу
    async function botTick() {
        if (botIsStarted) {
            let itemsName = botSettings.shoppingList[unsafeWindow.sgame];

            if (!itemsName || !itemsName.length) {
                return botStop("Невозможно запустить бота. Не указаны названия покупаемых предметов!");
            }

            try {
                // если это первый тик то мы берем предметы из списка sallItems, иначе запрашиваем по сети
                let items = tickCounter == 0 ? await slowDown(() => sallItems, 5000) : await getItems(unsafeWindow.sgame);
                let foundItems = items.filter(item => itemsName.includes(item.n));

                if (botSettings.usingFilter) {
                    foundItems = foundItems.filter(unsafeWindow.itemFilter);
                }

                if (foundItems.length) {
                    console.log("Найдены предметы!", foundItems);
                    await startTrade(foundItems);
                    if (botIsStarted) reloadPage(20000, "Обмен завершен. Обновляем страницу");
                } else {
                    setTimeout(botTick, botSettings.delayFind * 1000);
                }
            } catch(err) {
                console.error(err);
                reloadPage(20000, "В процессе работы бота возникла ошибка. Перезагружаем страницу");
            }
            tickCounter++;
        }
    }

    // запуск бота
    function botStart(autostart = false) {
        if (!botIsStarted) {
            autostarted = autostart;
            botIsStarted = true;
            stopCmdId = GM_registerMenuCommand("Остановить бота", botStop);
            GM_unregisterMenuCommand(startCmdId);
            botTick();
            unsafeWindow.document.title = "● Бот запущен";
            if (!autostart) notify("Бот запущен"); // уведомляем только если это не автостарт. т.к если это так, значит скрипт просто продолжает свою работу
            return true;

        } else return false;
    }

    // остановить бота
    function botStop(stopMsg = "■ Бот остановлен") {
        if (botIsStarted) {
            botIsStarted = false;
            document.location.hash = ""
            startCmdId = GM_registerMenuCommand("Запустить бота", botStart);
            GM_unregisterMenuCommand(stopCmdId);
            unsafeWindow.document.title = stopMsg || "";
            if (stopMsg) notify(stopMsg);
            return true;
        } else return false;
    }

    // ожидание полной загрузки сайта
    function waitSiteInit() {
        return new Promise((res) => {
            let timer = setInterval(() => {
                if (unsafeWindow.sgame) {
                    clearInterval(timer);
                    res(unsafeWindow.sgame);
                }
            }, 500);
        });
    }

    waitSiteInit().then((r) => {
        initFilters();
        console.log("site is load", r);
        // если в url присутсвует хэш #autostart то скрипт запустится автоматически
        if (location.hash.includes("#autostart")) {
            botStart(true);
        }
    });

})();
