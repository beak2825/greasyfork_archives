// ==UserScript==
// @name         Выключить репост-рекламу VK
// @version      1.0.0
// @description  Удаляет всю рекламу с репостами, потому-что обычные адблоки не могут увидеть такую рекламу.
// @authors      dimden (Eff the cops)
// @match        https://vk.com/feed
// @namespace https://greasyfork.org/users/222541
// @downloadURL https://update.greasyfork.org/scripts/376108/%D0%92%D1%8B%D0%BA%D0%BB%D1%8E%D1%87%D0%B8%D1%82%D1%8C%20%D1%80%D0%B5%D0%BF%D0%BE%D1%81%D1%82-%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D1%83%20VK.user.js
// @updateURL https://update.greasyfork.org/scripts/376108/%D0%92%D1%8B%D0%BA%D0%BB%D1%8E%D1%87%D0%B8%D1%82%D1%8C%20%D1%80%D0%B5%D0%BF%D0%BE%D1%81%D1%82-%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D1%83%20VK.meta.js
// ==/UserScript==

setInterval(function(){
    for(var k in document.getElementsByClassName('copy_quote')) {
        document.getElementsByClassName('copy_quote')[k].parentElement.parentElement.parentElement.parentElement.parentElement.remove();
    }
},200);