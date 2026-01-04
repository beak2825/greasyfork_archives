// ==UserScript==
// @name         [daazweb] Авто-регулировка сделок
// @namespace    tuxuuman:daazweb:autozakupka
// @version      1.2
// @description  Автоматическое включение/отключение сделок в зависимости от цен
// @author       tuxuuman<vk.com/tuxuuman>
// @match        https://daazweb.com/dashboard/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=daazweb.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/441969/%5Bdaazweb%5D%20%D0%90%D0%B2%D1%82%D0%BE-%D1%80%D0%B5%D0%B3%D1%83%D0%BB%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0%20%D1%81%D0%B4%D0%B5%D0%BB%D0%BE%D0%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/441969/%5Bdaazweb%5D%20%D0%90%D0%B2%D1%82%D0%BE-%D1%80%D0%B5%D0%B3%D1%83%D0%BB%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0%20%D1%81%D0%B4%D0%B5%D0%BB%D0%BE%D0%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $.fn.triggerNative = function(eventName) {
        return this.each(function() {
            var el = $(this).get(0);
            triggerNativeEvent(el, eventName);
        });
    };

    function triggerNativeEvent(el, eventName){
        if (el.fireEvent) { // < IE9
            (el.fireEvent('on' + eventName));
        } else {
            var evt = document.createEvent('Events');
            evt.initEvent(eventName, true, false);
            el.dispatchEvent(evt);
        }
    }

    function getSitePrice() {
        return fetch('https://daazweb.com/dashboard/orders')
            .then(r => r.text())
            .then(html => html.match(/Binancep2p BTC-RUB:([\d ]+)/i))
            .then(n => parseInt(n[1]?.replace(/ /g, '')));
    }

    function toggleSellerDealEnable(status) {
        $('#cb3').attr('checked', status).triggerNative("change");
    }

    function getSellerDealStatus() {
        return document.getElementById('cb3')?.checked ?? null;
    }

    function numFormat(num) {
        return new Intl.NumberFormat('ru').format(num);
    }

    const statusBar = jQuery(`
    <div style="position: fixed; right: 10px; bottom: 10px; padding: 10px 20px; background: white; border: 2px solid #273142; border-radius: 5px;">
        <div style="border-bottom: 1px solid #273142; font-weight: bold; margin-bottom: 10px;">${GM_info.script.name}</div>
        <div id="statusTextContainer">Инициализация...</div>
    </div>
    `);

    const statusTextContainer = statusBar.find('#statusTextContainer');

    jQuery('body').append(statusBar);

    async function update() {
        const sitePrice = await getSitePrice();
        const myPrice = GM_getValue('myPrice');

        if (myPrice) {
            if (sitePrice < myPrice) {
                toggleSellerDealEnable(false);
            } else {
                toggleSellerDealEnable(true);
            }
        }

        const dEnabled = getSellerDealStatus();

        statusTextContainer.html(`
        <b>Цена сайта:</b> ${numFormat(sitePrice)}<br/>
        <b>Ваша цена:</b> ${myPrice ? numFormat(myPrice) : '<span style="color: orange">Не установлено</span>'}<br/>
        <b style="color: ${dEnabled ? "lightgreen" : "gray"}">${dEnabled ? "Включено" : "Отключено"}</b>
        `);
    }

    statusBar.on("click", () => {
        const priceText = prompt("Хотите изменить цену?", GM_getValue('myPrice') ?? 0);
        if (priceText) {
            const price = parseInt(priceText);
            if (Number.isNaN(price)) {
                return alert('Введите число');
            }
            GM_setValue('myPrice', price);
            update();
        }
    });

    update();
    setInterval(update, 10000);
})();