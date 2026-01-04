// ==UserScript==
// @name         Добавляем originalview к каждой ссылке
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Add ?originalview to all links on getcourse
// @author       You
// @license      MIT
// @include      *://*/teach/control/*
// @include      *://*/pl/notifications/*
// @include      *://*/sales/control/*
// @include      *://*/pl/*
// @include      *://*/cms/*
// @include      *://*/user/my/*
// @include      *://*/sales/shop/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=getscript.ru
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/479435/%D0%94%D0%BE%D0%B1%D0%B0%D0%B2%D0%BB%D1%8F%D0%B5%D0%BC%20originalview%20%D0%BA%20%D0%BA%D0%B0%D0%B6%D0%B4%D0%BE%D0%B9%20%D1%81%D1%81%D1%8B%D0%BB%D0%BA%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/479435/%D0%94%D0%BE%D0%B1%D0%B0%D0%B2%D0%BB%D1%8F%D0%B5%D0%BC%20originalview%20%D0%BA%20%D0%BA%D0%B0%D0%B6%D0%B4%D0%BE%D0%B9%20%D1%81%D1%81%D1%8B%D0%BB%D0%BA%D0%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

   // Получите все элементы <a> на странице
    var links = document.getElementsByTagName("a");

    // Пройдитесь по каждой ссылке и добавьте "?originalview" к ее href
    for (var i = 0; i < links.length; i++) {
        var href = links[i].getAttribute("href");
        if (href) {
            links[i].setAttribute("href", href + "?originalview");
        }
    }


    // Your code here...
})();