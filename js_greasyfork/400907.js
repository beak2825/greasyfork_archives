// ==UserScript==
// @name         Tabun Swarm
// @version      0.8.2
// @description  Замена стандартных аватарок на чейнджлингов. Есть мужские и женские версии.
// @author       seshok
// @license      MIT
// @include      http*://tabun.everypony.ru/*

// @grant        none

// @namespace https://greasyfork.org/ru/scripts/400907-tabun-swarm
// @downloadURL https://update.greasyfork.org/scripts/400907/Tabun%20Swarm.user.js
// @updateURL https://update.greasyfork.org/scripts/400907/Tabun%20Swarm.meta.js
// ==/UserScript==

//Замена надписи в шапке сайта
document.querySelector('#logolink a').text = 'Нет, это — Рой!';

//Замена аватарок
var Avatar="//static.everypony.ru/local/avatar_" //Сокращение ссылок на аватарки
var newAvatar="//cdn.everypony.ru/storage/00/28/16/2020/03/19/"

var image = document.getElementsByTagName('img');

[].forEach.call(image,function(element) {
    if (element.getAttribute('src') == Avatar+'male_100x100.png') {
        element.setAttribute('src', newAvatar+'4dac2ae27e.jpg');
    }
    if (element.getAttribute('src') == Avatar+'female_100x100.png') {
        element.setAttribute('src', newAvatar+'4d43849b81.jpg');
    }
    if (element.getAttribute('src') == Avatar+'male_48x48.png') {
        element.setAttribute('src', newAvatar+'02dcb0e9c1.jpg');
    }
    if (element.getAttribute('src') == Avatar+'female_48x48.png') {
        element.setAttribute('src', newAvatar+'be9038d210.jpg');
    }
    if (element.getAttribute('src') == Avatar+'male_24x24.png') {
        element.setAttribute('src', newAvatar+'b76b8f4e75.jpg');
    }
    if (element.getAttribute('src') == Avatar+'female_24x24.png') {
        element.setAttribute('src', newAvatar+'f46f457af7.jpg');
    }
});

function change_avatar() { //Отдельная функция для замены аватарок у новых комментариев.

[].forEach.call(image,function(element) {
    if (element.getAttribute('src') == Avatar+'male_24x24.png') {
        element.setAttribute('src', newAvatar+'b76b8f4e75.jpg');
    }
    if (element.getAttribute('src') == Avatar+'female_24x24.png') {
        element.setAttribute('src', newAvatar+'f46f457af7.jpg');
    }
});
}

document.getElementById('count-comments').addEventListener('DOMSubtreeModified', function() { //Смотрит число комментариев и при изменении запускает смену аватарок. Без этого новые комментарии будут с обычными аватарками.
    change_avatar() });