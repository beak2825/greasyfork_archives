// ==UserScript==
// @name         Ссылки на профиль в Клубе Народной карты Яндекс
// @version      2.0.1
// @description  Скрипт добавляет кнопки «Перейти в профиль» возле имени пользователя и даты написания поста/комментария
// @author       Nikita Yushkov
// @match        https://yandex.ru/blog/narod-karta*
// @namespace    https://greasyfork.org/users/199854
// @downloadURL https://update.greasyfork.org/scripts/371085/%D0%A1%D1%81%D1%8B%D0%BB%D0%BA%D0%B8%20%D0%BD%D0%B0%20%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8C%20%D0%B2%20%D0%9A%D0%BB%D1%83%D0%B1%D0%B5%20%D0%9D%D0%B0%D1%80%D0%BE%D0%B4%D0%BD%D0%BE%D0%B9%20%D0%BA%D0%B0%D1%80%D1%82%D1%8B%20%D0%AF%D0%BD%D0%B4%D0%B5%D0%BA%D1%81.user.js
// @updateURL https://update.greasyfork.org/scripts/371085/%D0%A1%D1%81%D1%8B%D0%BB%D0%BA%D0%B8%20%D0%BD%D0%B0%20%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8C%20%D0%B2%20%D0%9A%D0%BB%D1%83%D0%B1%D0%B5%20%D0%9D%D0%B0%D1%80%D0%BE%D0%B4%D0%BD%D0%BE%D0%B9%20%D0%BA%D0%B0%D1%80%D1%82%D1%8B%20%D0%AF%D0%BD%D0%B4%D0%B5%D0%BA%D1%81.meta.js
// ==/UserScript==

(function() {
    window.onload = function(){
var a = [];
var b;
var prokr = 0;
if(document.getElementsByClassName('b-post_yablogs-club _init').length > 0){prokr = (document.getElementsByClassName('b-post_yablogs-club _init').length/20)-1;}
var Interval;
function cl(){
b=undefined;
a = document.getElementsByClassName('b-post_yablogs-club _init');
var temp;
var n = 0;
var i;
for(var j = prokr*20; j < a.length; j++){
temp = a[j].getElementsByClassName('b-round-avatar__image')[0].src;
n=0;
for(i = 0; i<100; i++){
    if(temp[i]=='/')n+=1;
    if(n==5)break;
}
if(i < 99) {
    i+=1;
    b=temp[i];
    for(i+=1; i<100; i++){
        if(temp[i]!='-')b+=temp[i];else break;
    }
}    
if(!((b === undefined) || (b === null) || (isNaN(b)))){m = a[j].getElementsByClassName('b-post_yablogs-club__date');
if (!((m[0] === null) || (m[0] === undefined) || (b == 0))){
m[0].insertAdjacentHTML('afterEnd', '<div class="y-button_islet _init" data-block="y-button" style="margin-left: 15px"><a class="y-button_islet__text" href="https://n.maps.yandex.ru/#!/users/'+b+'" target="_blank">Перейти в профиль</a></div>');}}} 
if(a.length != 0){document.getElementsByClassName('b-post-list_yablogs__more')[0].onclick = function(){Interval = setInterval(function(){if(a.length > (prokr*20)+20){prokr+=1; prom();}},10)};}}

function prom(){clearInterval(Interval); cl();}

a = document.getElementsByClassName('b-comment-group_yablogs _init');
for(var j = 0; j < a.length; j++){
b = JSON.parse(a[j].dataset.options).options.authorId;
if(!((b === undefined) || (b === null) || (isNaN(b)))){m = a[j].getElementsByClassName('b-comment-group_yablogs__date');
if (!((m[0] === null) || (m[0] === undefined))){
m[0].insertAdjacentHTML('afterEnd', '<div class="y-button_islet _init" data-block="y-button" style="margin-left: 15px"><a class="y-button_islet__text" href="https://n.maps.yandex.ru/#!/users/'+b+'" target="_blank">Перейти в профиль</a></div>');}}}

b=undefined;
a = document.getElementsByClassName('b-article_yablogs-not-draft _init');
if ((a[0] === null) || (a[0] === undefined))a = document.getElementsByClassName('b-article_yablogs-draft _init');
if(!((a[0] === null) || (a[0] === undefined)))b = JSON.parse(a[0].dataset.options).options.post.author.id;
if(!((b === undefined) || (b === null) || (isNaN(b)))){var m = a[0].getElementsByClassName('b-article_yablogs-not-draft__date');
if ((m[0] === null) || (m[0] === undefined))m = a[0].getElementsByClassName('b-user_yablogs__user-data');
m[0].insertAdjacentHTML('afterEnd', '<div class="y-button_islet _init" data-block="y-button" style="margin-left: 20px"><a class="y-button_islet__text" href="https://n.maps.yandex.ru/#!/users/'+b+'" target="_blank">Перейти в профиль</a></div>');}

cl();
    }
})();