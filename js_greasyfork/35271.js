// ==UserScript==
// @name           Virtonomica: скрытие фоновых картинок в подразделениях
// @namespace      virtonomica
// @version 	   1.0
// @description    Скрывает фоновые картинки в подразделениях
// @include        http*://*virtonomic*.*/*/main/unit/view/*
// @downloadURL https://update.greasyfork.org/scripts/35271/Virtonomica%3A%20%D1%81%D0%BA%D1%80%D1%8B%D1%82%D0%B8%D0%B5%20%D1%84%D0%BE%D0%BD%D0%BE%D0%B2%D1%8B%D1%85%20%D0%BA%D0%B0%D1%80%D1%82%D0%B8%D0%BD%D0%BE%D0%BA%20%D0%B2%20%D0%BF%D0%BE%D0%B4%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F%D1%85.user.js
// @updateURL https://update.greasyfork.org/scripts/35271/Virtonomica%3A%20%D1%81%D0%BA%D1%80%D1%8B%D1%82%D0%B8%D0%B5%20%D1%84%D0%BE%D0%BD%D0%BE%D0%B2%D1%8B%D1%85%20%D0%BA%D0%B0%D1%80%D1%82%D0%B8%D0%BD%D0%BE%D0%BA%20%D0%B2%20%D0%BF%D0%BE%D0%B4%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F%D1%85.meta.js
// ==/UserScript==

var run = function() {

  var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
  $ = win.$;

  $('body').css('backgroundImage','').css('background','#fffbf1');
}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}