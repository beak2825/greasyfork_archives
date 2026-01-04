// ==UserScript==
// @name         Выключить комментарии VK
// @version      1.0.0
// @description  Выключение комментариев в Вконтакте.  Я сам создал для себя этот скрипт, потому-что уже надоели эти глупые комментарии. 
// @authors      dimden (Eff the cops)
// @match        https://vk.com/feed
// @namespace https://greasyfork.org/users/222541
// @downloadURL https://update.greasyfork.org/scripts/376107/%D0%92%D1%8B%D0%BA%D0%BB%D1%8E%D1%87%D0%B8%D1%82%D1%8C%20%D0%BA%D0%BE%D0%BC%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D0%B8%D0%B8%20VK.user.js
// @updateURL https://update.greasyfork.org/scripts/376107/%D0%92%D1%8B%D0%BA%D0%BB%D1%8E%D1%87%D0%B8%D1%82%D1%8C%20%D0%BA%D0%BE%D0%BC%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D0%B8%D0%B8%20VK.meta.js
// ==/UserScript==

setInterval(function(){
    for(var k in document.getElementsByClassName('replies_list _replies_list')) {
        if(document.getElementsByClassName('replies_list _replies_list')[k].childElementCount !== 0 ) {
            document.getElementsByClassName('replies_list _replies_list')[k].firstChild.remove();
        }
    }
},200);