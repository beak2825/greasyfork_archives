// ==UserScript==
// @name           Virtonomica: дополнительные реалмы
// @namespace      virtonomica
// @description    Добовляет реалмы Lien и Mary
// @include        http://virtonomica.*/*/main/*
// @version        1
// @downloadURL https://update.greasyfork.org/scripts/2777/Virtonomica%3A%20%D0%B4%D0%BE%D0%BF%D0%BE%D0%BB%D0%BD%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D1%80%D0%B5%D0%B0%D0%BB%D0%BC%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/2777/Virtonomica%3A%20%D0%B4%D0%BE%D0%BF%D0%BE%D0%BB%D0%BD%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D1%80%D0%B5%D0%B0%D0%BB%D0%BC%D1%8B.meta.js
// ==/UserScript==


var run = function() {

    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;

    $('#realmselect')
        .append($('<a>').attr('href', '/mary/main/user/privat/headquarters').text('Реалм mary'))
        .append($('<a>').attr('href', '/lien/main/user/privat/headquarters').text('Реалм lien'));
}

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);