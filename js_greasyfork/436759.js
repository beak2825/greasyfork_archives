// ==UserScript==
// @name         [daazweb.com] Парсер-уведомитель
// @namespace    tuxuuman:daazweb:notifier
// @version      0.2.1
// @description  Парсинг и уведомления о нужных закупах
// @author       tuxuuman<vk.com/tuxuuman>
// @match        https://daazweb.com/dashboard*
// @icon         https://www.google.com/s2/favicons?domain=daazweb.com
// @noframes
// @grant        GM_notification
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/436759/%5Bdaazwebcom%5D%20%D0%9F%D0%B0%D1%80%D1%81%D0%B5%D1%80-%D1%83%D0%B2%D0%B5%D0%B4%D0%BE%D0%BC%D0%B8%D1%82%D0%B5%D0%BB%D1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/436759/%5Bdaazwebcom%5D%20%D0%9F%D0%B0%D1%80%D1%81%D0%B5%D1%80-%D1%83%D0%B2%D0%B5%D0%B4%D0%BE%D0%BC%D0%B8%D1%82%D0%B5%D0%BB%D1%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //const directions = ["сбер", "sberbank", "sber", "тинькофф", "tinkoff"].map(i => i.toLowerCase());
    const ordersHistory = [];
    const CHATS = [391763942, 388219882];
    const BOT_TOKEN = "5152407021:AAEFuufquDCLe1pu0JTtlUrwM23FWcSzkG4";
    let dateCallApi = Date.now();

    function tgBotApi(method, data) {
        const now = Date.now();
        const timeLeft = dateCallApi - now;
        const timeout = timeLeft > 0 ? timeLeft : 0;
        dateCallApi = now + 100 + (timeLeft > 0 ? timeLeft : 0);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
                    "mode": "cors",
                    "method": "POST",
                    "headers": {
                        'Content-Type': 'application/json'
                    },
                    "body": data ? JSON.stringify(data) : undefined,
                }).then(r => r.json()).then(r => {
                    if (r.ok) {
                        return r.result;
                    } else {
                        throw new Error(JSON.stringify(r));
                    }
                }).then(resolve).catch(reject);
            }, timeout);
        });
    }

    function sendMessageToChats(text) {
        return Promise.allSettled(CHATS.map(chat_id => tgBotApi("sendMessage", { chat_id, text }).catch(err => console.error(`Не удалось отправить сообщение в чат "${chat_id}"`, err))));
    }

    function orderNotification(order) {
        const text = `${order.btc_amount} -> ${order.rub_amount}\nКурс: ${order.rate}\nДата: ${order.created_at}\b+${order.bonus_fiat} RUB`;
        GM_notification({
            title: order.direction,
            text,
            timeout: 1000
        });
        sendMessageToChats(`${order.direction}\n\n${text}`);
    }

    function checkOrder(order) {
        if (ordersHistory.includes(order.exchange_id)) {
            return false;
        } else {
            ordersHistory.push(order.exchange_id);
        }
        //const dir = order.direction.toLowerCase();
        //return directions.some(d => dir.includes(d));
        return true;
    }

    async function checkOrders() {
        try {
            const res = await fetch("https://daazweb.com/api/getExchangeOrders/?status=Active&amount=100&page_number=1&summ=0&order_id=0&requisities=").then(r => r.json());

            if (res.status === "success") {
                const orders = res.orders.filter(checkOrder);
                if (orders.length) {
                    orders.forEach(orderNotification);
                }
            }
        } catch (err) {
            console.error("не удалось проверить заявки",err);
        } finally {
            setTimeout(checkOrders, 10000);
        }
    }

    checkOrders();
})();