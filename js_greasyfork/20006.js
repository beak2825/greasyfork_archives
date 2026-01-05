// ==UserScript==
// @name          Virtonomica:Убираем бонусный комплект
// @namespace    Virtonomica: Убираем комплект
// @version 	   1.1
// @description   Убираем комплект с главной стр
// @include      http://virtonomic*.*/*/main/company/view/*/unit_list


// @downloadURL https://update.greasyfork.org/scripts/20006/Virtonomica%3A%D0%A3%D0%B1%D0%B8%D1%80%D0%B0%D0%B5%D0%BC%20%D0%B1%D0%BE%D0%BD%D1%83%D1%81%D0%BD%D1%8B%D0%B9%20%D0%BA%D0%BE%D0%BC%D0%BF%D0%BB%D0%B5%D0%BA%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/20006/Virtonomica%3A%D0%A3%D0%B1%D0%B8%D1%80%D0%B0%D0%B5%D0%BC%20%D0%B1%D0%BE%D0%BD%D1%83%D1%81%D0%BD%D1%8B%D0%B9%20%D0%BA%D0%BE%D0%BC%D0%BF%D0%BB%D0%B5%D0%BA%D1%82.meta.js
// ==/UserScript==

var run = function() {

    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;
  $("div.assetbox").remove()

  
   }
  if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}