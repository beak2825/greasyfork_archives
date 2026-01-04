// ==UserScript==
// @name         [daazweb.com] Авто-буст
// @namespace    tuxuuman:daazweb:auto-boost
// @version      0.1.2
// @description  Автоматическая активация буста
// @author       tuxuuman<vk.com/tuxuuman>
// @match        https://daazweb.com/dashboard*
// @icon         https://www.google.com/s2/favicons?domain=daazweb.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435377/%5Bdaazwebcom%5D%20%D0%90%D0%B2%D1%82%D0%BE-%D0%B1%D1%83%D1%81%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/435377/%5Bdaazwebcom%5D%20%D0%90%D0%B2%D1%82%D0%BE-%D0%B1%D1%83%D1%81%D1%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const bearer = document.body.innerHTML.match(/HTTP_AUTHORIZATION.+(Bearer.+)"/)?.[1];

    if (!bearer) {
        return alert(`[${GM_info.script.name}] Не удалось запустить скрипт`);
    }

    async function getBoostInfo() {
        return fetch("https://daazweb.com/dashboard/check_exchange_order_count").then(r => r.json());
    }

    async function activateBoost() {
        const resp = await fetch("https://daazweb.com/api/getBoost?mode=neotk", {
            "headers": {
                "HTTP_AUTHORIZATION": bearer
            }
        }).then(r => r.json());

        if (resp.status === "error") throw resp;
    }

    async function checkBoost() {
        try {
            const resp = await getBoostInfo();
            const { boost_status, free_que_neotk } = resp.data;

            if (boost_status === "active" && free_que_neotk > 0) {
                await activateBoost();
            } else if (boost_status !== "boosted") {
                console.warn("Невозможно активировать буст", { boost_status, free_que_neotk });
            }
        } catch (err) {
            console.error("Не удалось проверить буст", err);
        }

        setTimeout(checkBoost, 3000);
    }

    checkBoost();
})();