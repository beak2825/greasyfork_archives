// ==UserScript==
// @name         Fix .com to .ru "gatewayAdapt=glo2rus" aliexpress redirect for Ukraine.
// @name:uk      Фіксить редірект на aliexpress "gatewayAdapt=glo2rus" з .com на .ru для України.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description After visiting aliexpress.ru it can mess up the locale settings on aliexpress.com - "com" will redirect to "ru" ("gatewayAdapt=glo2rus") and reset the location/language/currency settings. This script pins locale settings cookie, sets currency to USD, language to EN, country to UA, and redirects "ru" to "com". Please clear cookies on all "aliexpress" domains before using this userscript.
// @description:uk  Після кожного відвідування aliexpress.ru той ламає налаштування локалі на aliexpress.com, після чого "com" починає редиректити на "ru" ("gatewayAdapt=glo2rus") та скидати налаштування локації/мови/валюти. Цей скрипт фіксить куку з налаштуваннями, встановлює валюту USD, мову EN, країну UA, та редиректить всі лінки з "com" на "ru". Перед використанням раджу очистити кукі в усіх доменах, де зустрічається "aliexpress".
// @author       Зальотне дитя мемарні 🇺🇦✌️
// @match        *://www.aliexpress.ru
// @match        *://www.aliexpress.ru/*
// @match        *://*.aliexpress.ru/*
// @match        *://www.aliexpress.com
// @match        *://www.aliexpress.com/*
// @match        *://*.aliexpress.com/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliexpress.com
// @downloadURL https://update.greasyfork.org/scripts/447465/Fix%20com%20to%20ru%20%22gatewayAdapt%3Dglo2rus%22%20aliexpress%20redirect%20for%20Ukraine.user.js
// @updateURL https://update.greasyfork.org/scripts/447465/Fix%20com%20to%20ru%20%22gatewayAdapt%3Dglo2rus%22%20aliexpress%20redirect%20for%20Ukraine.meta.js
// ==/UserScript==

const FORCE_SITE = 'glo'
const FORCE_REGION = 'UA'
const FORCE_LOCALE = 'en_US'
const FORCE_CURRENCY = 'USD'
const CURRENCY_BLACKLIST = 'RUB'

function getCookie(cName) {
    var match = document.cookie.match(new RegExp('(^| )' + cName + '=([^;]+)'));
    if (match) {
        return match[2];
    } else {
        return '';
    }
}

function setCookie(cName, cValue, expDays) {
    let date = new Date();
    date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${cName}=${cValue}; ${expires}; path=/`;
}

const cookie = getCookie('aep_usuc_f');
const isCookieOkay = (cookie.includes(`site=${FORCE_SITE}`)
                      && cookie.includes(`region=${FORCE_REGION}`)
                      && cookie.includes(`b_locale=${FORCE_LOCALE}`)
                      && !cookie.includes(`c_tp=${CURRENCY_BLACKLIST}`)
                     );

if (!isCookieOkay) {
    const newCookie = `site=${FORCE_SITE}&c_tp=${FORCE_CURRENCY}&region=${FORCE_REGION}&b_locale=${FORCE_LOCALE}`;
    // alert(`Replacing "${cookie}" with "${newCookie}"`);
    setCookie('aep_usuc_f', newCookie, 9999);
} else {
    // alert(`Cookie ok "${cookie}"');
}

if (window.location.href.includes('aliexpress.ru')) {
    window.stop();
    const oldLocation = window.location.href;
    const newLocation = oldLocation.replace('gatewayAdapt=glo2rus', '').replace('aliexpress.ru', "aliexpress.com")
    // alert('Redirecting to ' + newLocation);
    window.location = newLocation;
}