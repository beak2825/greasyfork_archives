JavaScript:
// ==UserScript==
// @name        Удалить Яндекс-Турбо
// @description Переадресация с турбо-страниц яндекса на целевую страницу.
// @run-at      document_start
// @include     https://yandex.ru/turbo?*
// @version 0.0.1.20200213203026
// @namespace https://greasyfork.org/users/444771
// @downloadURL https://update.greasyfork.org/scripts/396403/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B8%D1%82%D1%8C%20%D0%AF%D0%BD%D0%B4%D0%B5%D0%BA%D1%81-%D0%A2%D1%83%D1%80%D0%B1%D0%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/396403/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B8%D1%82%D1%8C%20%D0%AF%D0%BD%D0%B4%D0%B5%D0%BA%D1%81-%D0%A2%D1%83%D1%80%D0%B1%D0%BE.meta.js
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

var UrlLandingPage = getUrlVar();
window.top.location.href = (decodeURIComponent(UrlLandingPage['text']));