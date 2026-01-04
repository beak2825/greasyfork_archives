// ==UserScript==
// @name         AutoRefresh 2 sec
// @namespace    http://tampermonkey.net/
// @version      0.0.6
// @description  Помогает сохранить жизнь мышке
// @author       Vladislav Makeka
// @match        *https://dvclients.helpdeskeddy.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dostavista.ru
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496322/AutoRefresh%202%20sec.user.js
// @updateURL https://update.greasyfork.org/scripts/496322/AutoRefresh%202%20sec.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const docurl = document.URL;
    let filter_page = docurl.includes(".helpdeskeddy.com");

    let startRefresh = setInterval(function () {
        const nowHref = location.href;
        if(nowHref.includes("ru/ticket/list/filter/id/158/page/1")) {
            let refresh_btn = document.querySelectorAll('.ticket-topbar-actions__refresh-button')[0];
            refresh_btn.click();
        }

    }, 5000);

})();