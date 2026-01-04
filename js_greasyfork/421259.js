// ==UserScript==
// @name         [SIH] авто-продаватель
// @namespace    tuxuuman:SHI:auto-trade
// @version      1.2.0
// @description  Автоматическое выставление предметов на продажу
// @author       <tuxuuman@gmail.com, vk.com/tuxuuman>
// @match        https://steamcommunity.com/id/*/inventory*
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getTab
// @grant        GM_saveTab
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/421259/%5BSIH%5D%20%D0%B0%D0%B2%D1%82%D0%BE-%D0%BF%D1%80%D0%BE%D0%B4%D0%B0%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/421259/%5BSIH%5D%20%D0%B0%D0%B2%D1%82%D0%BE-%D0%BF%D1%80%D0%BE%D0%B4%D0%B0%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D1%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const settings = {
        maxWorkTime: 180, // максимальное время (в секундах) работы скрипта, после которого он будет принудительно перезагружен ( если скрипт завис и т.д)
        delayReload: 30, // задержка перед перезагрузкой страницы после нормального завершения работы скрипта
        adjustValue: "0.01", // текст который нужно ввести в поле ввода "Автоматическое регулирование цен"
    };

    // переменные принадлежащие текущей вкладке
    // будут хранится пока вкладка открыта
    let tabVars = {
        gameId: "",
        started: false
    };

    // загружает переменные вкладки
    function loadTabVars() {
        return new Promise((resolve) => {
            GM_getTab(vars => resolve(tabVars =vars) );
        });
    }

    // сохраняет переменные вкладки
    function saveTabVars() {
        GM_saveTab(tabVars);
    }

    function reloadPage(timeout = 0) {
        setTimeout(() => {
            // сохраняем переменные перед перезагрузкой страницы
            saveTabVars();
            unsafeWindow.location.reload();
        }, timeout);
    }

    // ожидание загрузки страницы
    function waitSiteInit(timeout = 15) {
        return new Promise((res, rej) => {
            let initialized = false;
            let timer = setInterval(() => {
                if ($('#selectPanel').length) {
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

    function pause(timeout) {
        return new Promise((res) => setTimeout(res, timeout));
    }

    function onDomElementStyleChange(element, cb) {
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(cb);
        });

        observer.observe(element, { attributes : true, attributeFilter : ['style'] });
    }

    async function start() {
        if (!tabVars.started) {
            tabVars.started = true;
        }

        // авто-перезагрузка по истечению макс. времени
        reloadPage(settings.maxWorkTime * 1000);

        unsafeWindow.document.title = "● Скрипт запущен";

        GM_registerMenuCommand("Остановить скрипт", () => {
            tabVars.started = false;
            reloadPage(0);
        });

        if (tabVars.gameId != g_ActiveInventory.appid) {
            unsafeWindow.ShowItemInventory(tabVars.gameId);
            await pause(5000);
        }

        await pause(2000);
        $('#selectPanel #Lnk_Sellall').click(); // кликаем на кнопку "Выбрать все"

        await pause(2000);
        $('#tradePanel #Lnk_ShowSellMulti').click(); // кликаем на кнопку "Продать выбрано"

        await pause(2000);
        $('#autosell').click(); // в появившемся окне, выбираем вкладку "Автопродажа"

        if (!$('#market_sell_dialog_accept_ssa').prop("checked")) { // если условия еще не приняты
            await pause(2000);
            $('#market_sell_dialog_accept_ssa').click(); // принимаем условия стима
        }

        await pause(2000);
        $('#ck_autoadjust').click(); // включаем авто-регулировку цен

        await pause(2000);
        $('#Txt_adjust').val(settings.adjustValue); // выставляем текст в поле ввода авто-регулировки цен

        await pause(2000);
        $('#market_sell_dialog_accept span').click(); // нажимаем на кнопку "Да, выставить на продажу"

        await pause(2000);
        $('#market_sell_dialog_ok span').click(); // нажимаем на кнопку "ОК" подтверждая проверку

        reloadPage(settings.delayReload * 1000);
    }

    (async () => {
        await loadTabVars();
        await waitSiteInit();
        if (tabVars.started) {
            start();
        } else {
            let cmdId = GM_registerMenuCommand("Начать авто-продажу", async () => {
                tabVars.gameId = g_ActiveInventory.appid;
                await start();
                GM_unregisterMenuCommand(cmdId);
            });
        }
    })().catch(err => {
        console.error(err);
        if (tabVars.started) reloadPage(15000);
    });
})();