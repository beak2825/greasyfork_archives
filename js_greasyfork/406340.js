// ==UserScript==
// @name         Удалить Яндекс-Турбо
// @description  Переадресация с турбо-страниц яндекса на целевую страницу.
// @run-at       document_start
// @version      1.0
// @include      https://yandex.ru/*
// @namespace https://greasyfork.org/users/662208
// @downloadURL https://update.greasyfork.org/scripts/406340/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B8%D1%82%D1%8C%20%D0%AF%D0%BD%D0%B4%D0%B5%D0%BA%D1%81-%D0%A2%D1%83%D1%80%D0%B1%D0%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/406340/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B8%D1%82%D1%8C%20%D0%AF%D0%BD%D0%B4%D0%B5%D0%BA%D1%81-%D0%A2%D1%83%D1%80%D0%B1%D0%BE.meta.js
// ==/UserScript==

function getUrlVar() {
    var urlVar = window.location.search;
    var arrayVar = [];
    var valueAndKey = [];
    var resultArray = [];
    arrayVar = (urlVar.substr(1)).split('&');
    if (arrayVar[0] == "") return false;
    for (i = 0; i < arrayVar.length; i++) {
        valueAndKey = arrayVar[i].split('=');
        resultArray[valueAndKey[0]] = valueAndKey[1];
    }
    return resultArray;
}

var urlLandingPage = getUrlVar();
var urlPathname = window.location.pathname;

if (urlPathname == '/turbo') {
    top.location.replace(decodeURIComponent(urlLandingPage['text']));
} else if (urlPathname.indexOf('/turbo/s/') != -1) {
    top.location.replace('https://' + urlPathname.substr(urlPathname.indexOf('/turbo/s/') + 9));
} else if (urlPathname == '/search/touch/') {
    $('a[data-sc-host]').each(function() {
        var urlYaTurbo = $(this).attr('href');
        var dataCounter = JSON.parse($(this).attr('data-counter'));
        if ((urlYaTurbo.indexOf('https://yandex.ru/turbo/s/') != -1) || (urlYaTurbo.indexOf('https://yandex.ru/turbo?text=') != -1)) {
            $(this).attr('data-bem', '{"link":{}}');
            if (dataCounter[0] == 'b') {
                $(this).attr('href', dataCounter[1]);
            } else if (dataCounter[0] == 'w') {
                $(this).attr('href', dataCounter[3]);
            }
        }
    });
}