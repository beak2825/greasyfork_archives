// ==UserScript==
// @name        RU-Board Remove adlinks
// @author      http://forum.ru-board.com/profile.cgi?action=show&member=Hippoglossus
// @homepage    http://forum.ru-board.com/topic.cgi?forum=13&topic=2300&glp#lt
// @namespace   https://greasyfork.org/ru/scripts/14377-ru-board-remove-adlinks
// @include     http://forum.ru-board.com/*
// @icon        http://forum.ru-board.com/favicon.ico
// @description Удаляет рекламные ссылки,автоматически подставляемые по ключевым словами в пользовательские посты.Благодарности Hippoglossus,автору скрипта.
// @run-at      document-start
// @version     0.2.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/14377/RU-Board%20Remove%20adlinks.user.js
// @updateURL https://update.greasyfork.org/scripts/14377/RU-Board%20Remove%20adlinks.meta.js
// ==/UserScript==
 
document.addEventListener('DOMContentLoaded', function() {
    Array.slice(document.querySelectorAll("a[href^='http://forum.ru-board.com/g2m/'],a[href^='http://forum.ru-board.com/antipiracy/'],a[href^='http://forum.ru-board.com/cmws/'],a[href^='http://forum.ru-board.com/cmws_/'],a[href^='http://forum.ru-board.com/mbs/'],a[href^='http://forum.ru-board.com/mva/']")).forEach(function(adlinks) {
        adlinks.outerHTML = adlinks.textContent;
    });
}, false); 