// ==UserScript==
// @name         LemanaPro (a.k.a. Leroy Merlin) autoredirect to subdomain
// @description  Сайт Леруа не умеет сохранять выбранный город и каждый раз открывает московский регион. Скрипт будет автоматически редиректить на указанный поддомен.
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @author       undfndusr
// @match        https://*.lemanapro.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lemanapro.ru
// @run-at       document-start
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500737/LemanaPro%20%28aka%20Leroy%20Merlin%29%20autoredirect%20to%20subdomain.user.js
// @updateURL https://update.greasyfork.org/scripts/500737/LemanaPro%20%28aka%20Leroy%20Merlin%29%20autoredirect%20to%20subdomain.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const city = ''; // ВВЕДИТЕ НАЗВАНИЕ ГОРОДА ИЗ АДРЕСНОЙ СТРОКИ

    const url = new URL(location);
    const hostSplit = url.host.split('.');
    const [currentCity, ...restHostParams] = hostSplit;
    const hasCity = hostSplit.length > 2;
    let newHost = '';

    if (isImgUrl || currentCity === city || currentCity === 'auth' || currentCity === 'cdn') {
        return;
    }

    if (hasCity) {
        newHost = [city, ...restHostParams].join('.');
    } else {
        newHost = [city, ...hostSplit].join('.');
    }

    url.host = newHost;
    location.href = url.href;
})();