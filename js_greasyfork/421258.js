// ==UserScript==
// @name         [SIH] авто-удалятель
// @namespace    tuxuuman:SHI:auto-remove
// @version      1.2.1
// @description  Автоматическое удаление предметов с завышенной ценой
// @author       <tuxuuman@gmail.com, vk.com/tuxuuman>
// @match        https://steamcommunity.com/market*
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/421258/%5BSIH%5D%20%D0%B0%D0%B2%D1%82%D0%BE-%D1%83%D0%B4%D0%B0%D0%BB%D1%8F%D1%82%D0%B5%D0%BB%D1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/421258/%5BSIH%5D%20%D0%B0%D0%B2%D1%82%D0%BE-%D1%83%D0%B4%D0%B0%D0%BB%D1%8F%D1%82%D0%B5%D0%BB%D1%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const settings = {
        maxWorkTime: 60, // максимальное время (в секундах) работы скрипта, после которого он будет принудительно перезагружен ( если скрипт завис и т.д)
        delayReload: 30, // задержка перед перезагрузкой страницы после нормального завершения работы скрипта
        beforeRmoveDelay: 30, // задержка перед выбором предметов и началом их удаления
        removeAllItemsInterval: 1800, // промежуток времени (в секундах) по истечению которого нужно удалять все предметы
    };

    let started = false;
    let autostart = false;

    const AUTOSTART_HASH = "autostart";

    function reloadPage(timeout = 0, hash = "") {
        setTimeout(() => {
            unsafeWindow.location.hash = `${hash}-${Date.now()}`;
            unsafeWindow.location.reload();
        }, timeout);
    }

    // ожидание загрузки страницы
    function waitSiteInit(timeout = 15) {
        return new Promise((res, rej) => {
            let initialized = false;
            let timer = setInterval(() => {
                if ($('#_priceQueueCont').length) {
                    initialized = true;
                    clearInterval(timer);
                    res(unsafeWindow.sgame);
                }
            }, 500);
            setTimeout(() => {
                if (!initialized) {
                    clearInterval(timer);
                    rej(new Error("Время ожидания истекло"));
                }
            }, timeout * 1000);
        });
    }

    function onDomElementStyleChange(element, cb) {
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(cb);
        });

        observer.observe(element, { attributes : true, attributeFilter : ['style'] });
    }

    function removeItems() {
        if (!+GM_getValue("lastRemoveAllItems")) {
            GM_setValue("lastRemoveAllItems", Date.now());
        }

        if (Date.now() - GM_getValue("lastRemoveAllItems") > settings.removeAllItemsInterval * 1000) {
            // клик по чекбоксу выбора всех лотов выставленых на продажу
            $('#tabContentsMyActiveMarketListingsTable div.market_listing_table_header .market_listing_edit_buttons input.select-checkbox').click();
            GM_setValue("lastRemoveAllItems", Date.now());
        } else {
            // кликаем по кнопке "Выбрать все с завышеной ценой"
            $('#tabContentsMyActiveMarketListingsTable .inventory_filters span.item_market_action_button_contents').click();
        }

        // кликаем по кнопку "Удалить выбраное"
        setTimeout(() => $('.inventory_filters a.btnControl .icon-trash').click(), 2000);
        reloadPage(settings.delayReload * 1000, AUTOSTART_HASH);
    }

    function start() {
        if (started) return alert("Скрипт уже запущен");

        reloadPage(settings.maxWorkTime * 1000, AUTOSTART_HASH);

        started = true;
        unsafeWindow.document.title = "● Скрипт запущен";

        GM_registerMenuCommand("Остановить скрипт", () => {
            unsafeWindow.location.hash = "";
            unsafeWindow.location.reload();
        });

        let priceQueueContEl = $('#_priceQueueCont');

        if (priceQueueContEl.css('display') == "none") {
            setTimeout(removeItems, settings.beforeRmoveDelay * 1000);
        } else {
            onDomElementStyleChange(priceQueueContEl[0], (m) => {
                if (m.target.style.display == "none") {
                    setTimeout(removeItems, settings.beforeRmoveDelay * 1000);
                }
            });
        }
    }

    autostart = location.hash.includes(AUTOSTART_HASH);

    waitSiteInit().then(() => {
        if (autostart) start(true);
        GM_registerMenuCommand("Начать авто-удаление", start);
    }).catch(() => {
        // если не удалось дождаться загрузки страницы и назначен авто-запуск
        if (autostart) reloadPage(15000, AUTOSTART_HASH);
    })
})();