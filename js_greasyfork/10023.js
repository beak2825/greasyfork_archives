// ==UserScript==
// @name           Virtonomica: выделение первого варианта в окне расширения здания
// @namespace      virtonomica
// @version 	   1.2
// @description    Выделяет первый доступный вариант в окне расширения завода и других юнитов
// @include        http*://*virtonomic*.*/*/window/unit/upgrade/*
// @downloadURL https://update.greasyfork.org/scripts/10023/Virtonomica%3A%20%D0%B2%D1%8B%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BF%D0%B5%D1%80%D0%B2%D0%BE%D0%B3%D0%BE%20%D0%B2%D0%B0%D1%80%D0%B8%D0%B0%D0%BD%D1%82%D0%B0%20%D0%B2%20%D0%BE%D0%BA%D0%BD%D0%B5%20%D1%80%D0%B0%D1%81%D1%88%D0%B8%D1%80%D0%B5%D0%BD%D0%B8%D1%8F%20%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/10023/Virtonomica%3A%20%D0%B2%D1%8B%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BF%D0%B5%D1%80%D0%B2%D0%BE%D0%B3%D0%BE%20%D0%B2%D0%B0%D1%80%D0%B8%D0%B0%D0%BD%D1%82%D0%B0%20%D0%B2%20%D0%BE%D0%BA%D0%BD%D0%B5%20%D1%80%D0%B0%D1%81%D1%88%D0%B8%D1%80%D0%B5%D0%BD%D0%B8%D1%8F%20%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F.meta.js
// ==/UserScript==

var run = function() {

    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;

    if($('input[type=radio]').length == 1){
       $('input[type=radio]:first').attr('checked' , true);
    }
}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}