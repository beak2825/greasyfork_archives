// ==UserScript==
// @name         [ebesucher.de] Авто-очистка куки
// @namespace    tuxuuman:ebesucher.de:auto-delete-cookie
// @version      1.2.0
// @description  Автоматическое удаление куки и перезагрузка страницы
// @author       <tuxuuman@gmail.com, vk.com/tuxuuman>
// @match        https://www.ebesucher.de/*
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/421660/%5Bebesucherde%5D%20%D0%90%D0%B2%D1%82%D0%BE-%D0%BE%D1%87%D0%B8%D1%81%D1%82%D0%BA%D0%B0%20%D0%BA%D1%83%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/421660/%5Bebesucherde%5D%20%D0%90%D0%B2%D1%82%D0%BE-%D0%BE%D1%87%D0%B8%D1%81%D1%82%D0%BA%D0%B0%20%D0%BA%D1%83%D0%BA%D0%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var timeout = 30; // время в секундах, по истечению которого будут очищены куки и перезагружена страница

    function clearCookies() {
        unsafeWindow.document.cookie.split(";").forEach(function(c) {
            unsafeWindow.document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
    }

    function reloadPage(hash) {
        unsafeWindow.location.reload();
    }

    function start() {
        setTimeout(function() {
            clearCookies();
            reloadPage();
        }, timeout * 1000);
    }

    start();
})();