// ==UserScript==
// @name        BlackList
// @namespace   stc
// @description Черный список для табуна
// @include     http://tabun.everypony.ru/blog/*
// @version     1.5.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12763/BlackList.user.js
// @updateURL https://update.greasyfork.org/scripts/12763/BlackList.meta.js
// ==/UserScript==

//Текст, на который замещаются комментарии людей из черного списка
replace = "Комментарий удален"

//Список имен пользователей, находящихся в черном списке. Пример заполнения:
//users = ["Имя Первого пользователя", "Имя Второго Пользователя"]
//Пользователей может быть любое количество.
users = ["Sasha-Flyer"]

DeleteComments = function(){
    for(c=0; c<users.length;c++){
        els = document.getElementsByClassName("comment-author")
        for(i=0; i<els.length;i++){
            if(els[i].innerText==" "+users[c]){
                els[i].parentNode.parentNode.getElementsByClassName("text")[0].innerText = replace;
            }
        }
    }
}
DeleteComments()
setInterval(DeleteComments, 2000)