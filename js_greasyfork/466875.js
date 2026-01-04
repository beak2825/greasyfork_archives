// ==UserScript==
// @name         Скрипт для АП || Purple
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Скрипт для АП
// @author       Raf Khumaryan
// @match        https://forum.blackrussia.online/index.php?threads/*
// @icon         https://klike.net/uploads/posts/2021-12/1638345168_12.jpg
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/466875/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%90%D0%9F%20%7C%7C%20Purple.user.js
// @updateURL https://update.greasyfork.org/scripts/466875/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%90%D0%9F%20%7C%7C%20Purple.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCСEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCСEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const buttons = [
{
title: '| Одобрено |',
content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVrBgppJ/QY7Mg.gif[/img][/url]<br>' +
"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
"[B][CENTER][COLOR=lavender] Ваша заявка получает статус - [COLOR=#00FF00]Одобрено[/COLOR]<br><br>"+
"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]PURPLE[/COLOR].<br><br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>",
},
{
title: '| Отказано |',
content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/GhfpTWzK/image.gif[/img][/url]<br>' +
"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
"[B][CENTER][COLOR=lavender] Ваша заявка получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
"[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=indigo]PURPLE[/COLOR].<br><br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>",
},

$(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов


    // Добавление кнопок при загрузке страницы
    addButton('Одобрено✅', 'accepted');
    addButton('Отказано⛔', 'unaccept');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
    $('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));

    function getFormData(data) {
const formData = new FormData();
Object.entries(data).forEach(i => formData.append(i[0], i[1]));
return formData;
}
}
)];
})();