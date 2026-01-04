// ==UserScript==
// @name         TabunAva Reborn (upgrade from TabunAva)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Установка своего аватара на Табуне!
// @author       Kujivunia или Niko_de_Andjelo
// @match        https://tabun.everypony.ru/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/435497/TabunAva%20Reborn%20%28upgrade%20from%20TabunAva%29.user.js
// @updateURL https://update.greasyfork.org/scripts/435497/TabunAva%20Reborn%20%28upgrade%20from%20TabunAva%29.meta.js
// ==/UserScript==
// Я не умею писать скрипты, поэтому "TabunAva" являет собой вольную переделку НЕ моего "Tabun Swarm" https://greasyfork.org/ru/scripts/400907-tabun-swarm
//IDENTICON: https://avatars.dicebear.com/styles/identicon
//Замена аватарок
var Avatar="https://cdn.everypony.ru/static/local/avatar_" ;//Сокращение ссылок на аватарки
var identicon = "https://avatars.dicebear.com/api/identicon/:"
var identiconParams = ".svg?scale=100&size=24"
var avaPost = "https://tabun.everypony.ru/blog/uniblog/203681.html";
var cInf = document.getElementsByClassName('comment-info');
var comments = document.getElementsByClassName('comment');
var dictUserAva = new Object();

fetch(avaPost)
    .then((response) => {
    return response.text();
})
    .then((data) => {
    var parser = new DOMParser();
    var htmlDocument = parser.parseFromString(data, "text/html");
    var comments = htmlDocument.getElementsByClassName('comment');
    //*****************************Выше была какая-то чёрная магия************************************
    //Собираю аватарки из ава-поста.
    [].forEach.call(comments,function(element) {
        if (element.getElementsByClassName('comment-author')[0].children[0].children[0].src == (Avatar + 'male_24x24.png') || element.getElementsByClassName('comment-author')[0].children[0].children[0].src == (Avatar + 'female_24x24.png')){
            var temp = element.getElementsByClassName('comment-author');
            var name = temp[0].children[1].innerText;
            var tempComment = element.getElementsByClassName('comment-content')[0];
            if (tempComment.getElementsByClassName('text')[0].getElementsByTagName('img')[0] != null){
                if (tempComment.getElementsByClassName('text')[0].getElementsByTagName('img')[0].hasAttribute('src')){
                    var tempAvaLink = tempComment.getElementsByClassName('text')[0].getElementsByTagName('img')[0].getAttribute('src');
                    dictUserAva[name]=tempAvaLink;
                }
            }
        }
    });
    console.log(dictUserAva);
    //Выставляем аватарки
    [].forEach.call(cInf,function(element) {
        if (element.getElementsByClassName('comment-author')[0].children[0].children[0].src == (Avatar + 'male_24x24.png') || element.getElementsByClassName('comment-author')[0].children[0].children[0].src == (Avatar + 'female_24x24.png')){
            var temp = element.getElementsByClassName('comment-author');
            var name = temp[0].children[1].innerText;
            if (dictUserAva[name])
            {
                temp[0].children[0].children[0].src = dictUserAva[name];
            }
            else
            {
                temp[0].children[0].children[0].src = identicon + name + identiconParams;
            }
        }
    });

    function change_avatar() { //Отдельная функция для замены аватарок у новых комментариев.

        [].forEach.call(cInf,function(element) {
            if (element.getElementsByClassName('comment-author')[0].children[0].children[0].src == (Avatar + 'male_24x24.png') || element.getElementsByClassName('comment-author')[0].children[0].children[0].src == (Avatar + 'female_24x24.png')){
                var temp = element.getElementsByClassName('comment-author');
                var name = temp[0].children[1].innerText;
                if (dictUserAva[name])
                {
                    temp[0].children[0].children[0].src = dictUserAva[name];
                }
                else
                {
                    temp[0].children[0].children[0].src = identicon + name + identiconParams;
                }
            }
        });
    }

    document.getElementById('count-comments').addEventListener('DOMSubtreeModified', function() { //Смотрит число комментариев и при изменении запускает смену аватарок. Без этого новые комментарии будут с обычными аватарками.
        change_avatar() });

});