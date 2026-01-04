// ==UserScript==
// @name         Black List DTF
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @icon         https://dtfstaticbf19cf1-a.akamaihd.net/static/build/dtf.ru/favicons/apple-touch-icon-180x180.png
// @homepageURL  https://greasyfork.org/ru/scripts/415740-black-list-dtf
// @description  Черный список для постов на DTF
// @author       Fenrir
// @match        https://dtf.ru/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415740/Black%20List%20DTF.user.js
// @updateURL https://update.greasyfork.org/scripts/415740/Black%20List%20DTF.meta.js
// ==/UserScript==

//!!!!!READ ME!!!!!
//Добавьте в blackList никнеймы, ссылки на профили или ID людей,
//которых вы не хотите видеть в ленте
//Пользователь не может сменить свой ID на сайте, поэтому такой способ блокировки самый надежный
// 3 элемента в списке ниже даны для примера и закомментированы
// <-- символы комментария, скрипт не обрабатывает такие строки

var blackList = [
//    'Riverander',
//    'https://dtf.ru/u/138169-mio-phileo',
//    1922, //Apanasik комментарий для напоминания кто забанен
//    91430 // Гусь Хмурый
];


addEventListener("DOMContentLoaded", function() {
    deletePost();
//     console.log("blacklist worked");
});
addEventListener("DOMNodeInserted", function() {
    deletePost();
//     console.log("blacklist worked");
});

function deletePost() {
    if (document.querySelector('div.feed__container') !== null) {
        var feed = document.querySelector('div.feed__container')
        var chunks = feed.querySelectorAll('div.feed__chunk');
        var count;
        for (count = 0; count < chunks.length; count++) {
            var posts = chunks[count].querySelectorAll('div.feed__item');
            var i;
            var j;
            for (i = posts.length-1; i >= 0; i--) {
                var link = posts[i].querySelectorAll('div>a.content-header-author');
                var a1;
                var idIndex1;
                if (typeof link[1] !== 'undefined') {
                    a1 = link[1].getAttribute('href');
                    idIndex1 = a1.split('/').pop().split('-')[0];
                }
                var a0 = link[0].getAttribute('href');
                var idIndex0 = a0.split('/').pop().split('-')[0];
                for (j = 0; j < blackList.length; ++j) {
                    if ( (posts[i].getElementsByClassName("content-header-author__name")[0].textContent.indexOf(blackList[j]) != -1) ||
                        (a0 == blackList[j]) ||
                        (a1 == blackList[j]) ||
                        (idIndex0 == blackList[j]) ||
                        (idIndex1 == blackList[j])
                       ) {
                        posts[i].remove();
                    }
                };
            };
        };
    };
};