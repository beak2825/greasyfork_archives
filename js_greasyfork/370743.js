// ==UserScript==
// @name         НЯК клуб
// @namespace    http://tampermonkey.net/
// @version      Релиз
// @description  Выводит кнопку "Перейти в профиль" на открытых постах в Клубе Народной карты.
// @author       @nikitabalakovo (портировано @TehnicMan)
// @match        https://yandex.ru/blog/narod-karta/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370743/%D0%9D%D0%AF%D0%9A%20%D0%BA%D0%BB%D1%83%D0%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/370743/%D0%9D%D0%AF%D0%9A%20%D0%BA%D0%BB%D1%83%D0%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    javascript:
var a = [];

var a = [];
a = document.getElementsByClassName('b-article_yablogs-not-draft _init');

for(var i = 0; i < a.length; i++){
    var f = 0;
    var b = a[i].dataset.options;
    var j = 0;
    do{
        j++;
        if((b[j] == undefined) || (b[j] == null)){
            f = 1;
            break;
        }
    }
    while((b[j]+b[j+1]+b[j+2]+b[j+3]+b[j+4]+b[j+5]+b[j+6]+b[j+7]+b[j+8]+b[j+9]+b[j+10]+b[j+11]) != 'author":{"id');
    if(f==1){
        alert("authorId не найден");
        break;
    }
    j += 15;
    var link = 'https://n.maps.yandex.ru/#!/users/';
    do{
        link += b[j];
        j++
    }
    while(b[j] != '"');

    var m = a[i].getElementsByClassName('b-article_yablogs-not-draft__date');
    m[0].insertAdjacentHTML('afterEnd', '<button class="y-button_islet-load _init" data-block="y-button" style="margin-left: 20px"><a class="y-button_islet-load__text" href="'+link+'">Перейти в профиль</a></button>');
    }

a = document.getElementsByClassName('b-comment-group_yablogs _init');

for(var i = 0; i < a.length; i++){
    var f = 0;
    var b = a[i].dataset.options;
    var j = 0;
    do{
        j++;
        if((b[j] == undefined) || (b[j] == null)){
            f = 1;
            break;
        }
    }
    while((b[j]+b[j+1]+b[j+2]+b[j+3]+b[j+4]+b[j+5]+b[j+6]+b[j+7]) != "authorId");
    if(f==1){
        alert("authorId не найден");
        break;
    }
    j += 11;
    var link = 'https://n.maps.yandex.ru/#!/users/';
    do{
        link += b[j];
        j++
    }
    while(b[j] != '"');

    var m = a[i].getElementsByClassName('b-comment-group_yablogs__date');
    m[0].insertAdjacentHTML('afterEnd', '<button class="y-button_islet-load _init" data-block="y-button" style="margin-left: 15px"><a class="y-button_islet-load__text" href="'+link+'">Перейти в профиль</a></button>');
    }
})();