// ==UserScript==
// @name MyScript delete underlines on yandex.ru
// @namespace GRU
// @name:ru Удаляет все подчеркивания на yandex.ru
// @description MyScript delete underlines on yandex
// @description:ru Удаляет все подчеркивания после загрузки страницы на yandex.ru
// @version 1.1
// @run-at  document-ready
// @include http://www.yandex.ru*/*
// @include https://yandex.ru*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @author  valpelron
// @icon    http://yandex.ru/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/33434/MyScript%20delete%20underlines%20on%20yandexru.user.js
// @updateURL https://update.greasyfork.org/scripts/33434/MyScript%20delete%20underlines%20on%20yandexru.meta.js
// ==/UserScript==

$(document).ready(function () {

    $('a').css('text-decoration','none');

});