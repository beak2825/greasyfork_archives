// ==UserScript==
// @name         yandex fs client sarcher
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description:ru  приложение заменяет "кинопоиск" на ссылку  внешнего приложение "fs client"
// @description The application replaces the "kinopoisk" on the link external application "FS Client"
// @author       You
// @match        https://yandex.ru/search/*
// @icon         https://www.google.com/s2/favicons?domain=yandex.ru
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437431/yandex%20fs%20client%20sarcher.user.js
// @updateURL https://update.greasyfork.org/scripts/437431/yandex%20fs%20client%20sarcher.meta.js
// ==/UserScript==


window.onload = function() {
    var title = $( 'div.entity-search__header-title-wrapper > div').text();
    var elem = $( 'div > a[href*="https://kinopoisk.ru/"]' );
    elem.attr('href', 'fsclient://search?site=TMDb&request='+title);
    elem.attr('data-counter', '');
    elem.text("fs client");
}