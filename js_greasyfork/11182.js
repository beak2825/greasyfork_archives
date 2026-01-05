// ==UserScript==
// @name           Virtonomica: кнопка на реалм Mary
// @version        1.03
// @namespace      virtonomica
// @description    Добавляет кнопку для перехода на реалм Mary в выпадающий список реалмов
// @include        http*://virtonomica.*/*/main/*
// @downloadURL https://update.greasyfork.org/scripts/11182/Virtonomica%3A%20%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%D0%BD%D0%B0%20%D1%80%D0%B5%D0%B0%D0%BB%D0%BC%20Mary.user.js
// @updateURL https://update.greasyfork.org/scripts/11182/Virtonomica%3A%20%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%D0%BD%D0%B0%20%D1%80%D0%B5%D0%B0%D0%BB%D0%BC%20Mary.meta.js
// ==/UserScript==


var run = function() {

    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;

    $('.menu_settings > li:nth-child(5)')
        .append($('<a>').attr('href', '/mary/main/user/privat/headquarters').text('Mary'))
}

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);