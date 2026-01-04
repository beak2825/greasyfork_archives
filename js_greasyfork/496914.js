// ==UserScript==
// @name         TG_YescoinFarm
// @namespace    Melonium/TG
// @version      2024-11-23
// @description  Фармим yescoin за счёт рекламы и дейликов.
//У них нет проверки сколько раз ты это сделал. Для работы открываем бота в веб версии телеги https://web.telegram.org/k/#@realyescoinbot
//Баланс не будет обновляться в реальном времени, можете проверять его с другого устройства
//код не идеален, сделал просто чтоб работало.
//Рефка: https://t.me/realyescoinbot?start=t_5634889740_283026
// @author       MeloniuM
// @match        https://miniapp.yesco.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yesco.in
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496914/TG_YescoinFarm.user.js
// @updateURL https://update.greasyfork.org/scripts/496914/TG_YescoinFarm.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function() {
        fetch("https://clownfish-app-f7unk.ondigitalocean.app/v2/tasks/claimAdsgramAdReward", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                "cache-control": "no-cache",
                "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryohgEsvv6NfgqFITi",
                "launch-params": window.Telegram.WebApp.initData,
                "pragma": "no-cache",
                "sec-ch-ua": "\"Not-A.Brand\";v=\"99\", \"Chromium\";v=\"124\"",
                "sec-ch-ua-mobile": "?1",
                "sec-ch-ua-platform": "\"Android\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site"
            },
            "referrer": "https://miniapp.yesco.in/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": "------WebKitFormBoundaryohgEsvv6NfgqFITi\r\nContent-Disposition: form-data; name=\"viewCompletedAt\"\r\n\r\n"+(new Date).getTime()+"\r\n------WebKitFormBoundaryohgEsvv6NfgqFITi\r\nContent-Disposition: form-data; name=\"reference\"\r\n\r\n81\r\n------WebKitFormBoundaryohgEsvv6NfgqFITi--\r\n",
            "method": "POST",
            "mode": "cors",
            "credentials": "omit"
        });
    }, Math.floor(Math.random() * (15 - 8 + 1) + 8)*1000)
    setInterval(function() {
        fetch("https://clownfish-app-f7unk.ondigitalocean.app/v2/tasks/claimDailyReward", {
            "headers": {
                "accept": "*/*",
                "accept-language": "ru,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
                "content-type": "application/json",
                "launch-params": window.Telegram.WebApp.initData,
                "priority": "u=1, i",
                "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Microsoft Edge\";v=\"126\", \"Microsoft Edge WebView2\";v=\"126\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site",
                "Referer": "https://miniapp.yesco.in/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": "{}",
            "method": "POST"
        });
        fetch("https://clownfish-app-f7unk.ondigitalocean.app/v2/tasks/getDailyReward", {
            "headers": {
                "accept": "*/*",
                "accept-language": "ru,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
                "content-type": "application/json",
                "launch-params": window.Telegram.WebApp.initData,
                "priority": "u=1, i",
                "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Microsoft Edge\";v=\"126\", \"Microsoft Edge WebView2\";v=\"126\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site",
                "Referer": "https://miniapp.yesco.in/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": "{}",
            "method": "POST"
        });
    }, Math.floor(Math.random() * (15 - 8 + 1) + 8)*1000)
    setInterval(function() {
        fetch("https://api.yesco.in/v2/user/updateLastActivities", {
            "headers": {
                "accept": "*/*",
                "accept-language": "ru,en;q=0.9,en-GB;q=0.8,en-US;q=0.7",
                "content-type": "application/json",
                "launch-params": window.Telegram.WebApp.initData,
                "priority": "u=1, i",
                "sec-ch-ua": "\"Chromium\";v=\"130\", \"Microsoft Edge\";v=\"130\", \"Not?A_Brand\";v=\"99\", \"Microsoft Edge WebView2\";v=\"130\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site"
            },
            "referrer": "https://miniapp.yesco.in/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": "{\"type\":\"mantleWalletConnectAt\"}",
            "method": "POST",
            "mode": "cors",
            "credentials": "omit"
        });
    }, 2000);
})();
