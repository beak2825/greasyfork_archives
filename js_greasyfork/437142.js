// ==UserScript==
// @name         [R2 Hazy Helper]
// @namespace    hazy.systems/helper
// @version      0.2
// @description  Запуск хелпера
// @author       vk.com/tuxuuman
// @match        https://hazy.systems/*
// @icon         https://www.google.com/s2/favicons?domain=hazy.systems
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/437142/%5BR2%20Hazy%20Helper%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/437142/%5BR2%20Hazy%20Helper%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // IP логин-сервера
    const LOGINSERVER_IP = "185.71.66.201";

    function rndstr(length) {
        let str = "";
        for (let i=0;i<length / 5;i++) {
            str += Math.random().toString(36).substr(2, 6)
        }
        return str.substr(0, length);
    }

    // фэйковая инфа о системе, можно подменить любые данные
    const SYSTEM_INFO = {
        "SystemName": "DESKTOP-" + rndstr(5),
        "CPU": {
            "ProcessorID": "To be filled by O.E.M."
        },
        "DiskDrive": [
            {
                "DeviceID": "\\\\.\\PHYSICALDRIVE1",
                "SerialNumber": Math.round(100000 + Math.random() * 10000).toString()
            }
        ],
        "Hash": rndstr(32)
    }

    GM_registerMenuCommand("Запустить", () => {
        send("start_game", {
            info: JSON.stringify(SYSTEM_INFO)
        }, (res, r) => {
            if (res.key1 && res.key2) {
                const helperUrl = `hazy-helper:${res.key1}-${res.key2}-1-${LOGINSERVER_IP}-RU`;
                console.log("Запускаем хэлпер", helperUrl);
                window.location = helperUrl;
                console.log(window.location);
            } else {
                console.error("Не найдены ключи запуска", [res, r]);
                alert("Запуск не удался. Подробности в консоли");
            }
        });
    });
})();