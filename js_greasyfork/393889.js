// ==UserScript==
// @name         [smshub.org] Helper
// @namespace    tuxuuman:smsclub.org:helper
// @version      0.1
// @description  Автоматическое выставление ползунков
// @author       tuxuuman<tuxuuman@gmail.com, vk.com/tuxuuman>
// @match        https://agent.smshub.org/dashboard/cost
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/393889/%5Bsmshuborg%5D%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/393889/%5Bsmshuborg%5D%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // названия всех сервисов нужно указывать маленькими буквами

    // настройка значений для сервисов. тут можно указать как значение по умолчанию для всех, так и для конкретного сервиса
    const INCOME_VALUES = {
        // это значения по умолчанию для всех сервисов
        "_default": 0.5,
        // также вы можете указать настройки для конкретного сервиса
        "rambler": 0.78, // не забывайте ставить запятую после каждой нового значения
    };

    // сервисы которые нужно исключить. перечислять через запятую, в ковысках.
    const EXCLUDES = ["discord", "alibaba"];

    function eachServices(cb) {
        return new Promise(function(res, rej) {
            try {
                let cards = $('.serviceCard');
                for (let card of cards) {
                    let $e = $(card);
                    let serviceName = $e.find('img').eq(0).parent().text().toLowerCase();
                    let serviceId = $e.attr('service');
                    let maxPrice = +$e.find('input.sliderClass').attr('max');
                    let minCost = +$e.find('input.sliderClass').attr('mincost');
                    let price = +$e.find('input.sliderClass').val();
                    cb({
                        id: serviceId,
                        name: serviceName,
                        maxPrice,
                        price,
                        minCost
                    });
                }
                res();
            } catch (err) {
                console.error("eachServices error", err);
                rej(err);
            }
        });
    }

    GM_registerMenuCommand("Запустить скрипт", function()  {
         let promises = [];
            eachServices(function(service) {
                if (!EXCLUDES.includes(service.name)) {
                    let cost = INCOME_VALUES[service.name] || INCOME_VALUES._default;
                    console.log("Меняем настройки сервиса", service, cost);
                    const body = new FormData();
                    body.append('cat', 'scripts');
                    body.append('act', 'manageCost');
                    body.append('asc', 'setReward');
                    body.append('country', '0');
                    body.append('service', service.id);
                    body.append('cost', INCOME_VALUES[service.name] || INCOME_VALUES._default);

                    promises.push (fetch('https://agent.smshub.org/api.php', {
                        method: 'POST',
                        body: body
                    }));
                }
            })
                .then(() => Promise.all(promises))
                .then(() => { alert("Настройки сервисов успешно изменены!"); location.reload() })
                .catch(err => console.error(err) && alert("Ошибка. "+err.message));
    }, "S");

    GM_registerMenuCommand("Сброс сервисов", function()  {
        let promises = [];
        eachServices(function(service) {
            console.log("Сбрасываем настройки сервиса", service);
            const body = new FormData();
            body.append('cat', 'scripts');
            body.append('act', 'manageCost');
            body.append('asc', 'setReward');
            body.append('country', '0');
            body.append('service', service.id);
            body.append('cost', service.maxPrice);

            promises.push (fetch('https://agent.smshub.org/api.php', {
                method: 'POST',
                body: body
            }));
        })
            .then(() => Promise.all(promises))
            .then(() => { alert("Сброс сервисов успешно завершен!"); location.reload() })
            .catch(err => console.error(err) && alert("Ошибка. "+err.message));
    }, "R");
})();