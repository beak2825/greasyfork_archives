// ==UserScript==
// @name         Virtonomica:ChangeEquipmentButton
// @namespace    Virtonomica
// @version      1.1
// @description  Изменение кнопки "Оборудование" для открытия немного большего окна, чем по-умолчанию
// @author       UnclWish
// @include      http*://virtonomic*.*/*/main/unit/view/*
// @exclude      http*://virtonomic*.*/*/main/unit/view/*/*
// @downloadURL https://update.greasyfork.org/scripts/369354/Virtonomica%3AChangeEquipmentButton.user.js
// @updateURL https://update.greasyfork.org/scripts/369354/Virtonomica%3AChangeEquipmentButton.meta.js
// ==/UserScript==

var run = (function() {
	var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
	var $ = win.$;
	$(document).ready(function() {
        var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
        var $ = win.$;
        $(document).ready(function() {
                var a2=$('div.title').text().trim();
                if (a2.indexOf("Офис") == -1 ) return; //Выход если главная страница не нашей компании
                var links = $('a[href*="/window/unit/equipment"]');
				for (var i=0; i<links.length; i++) {
					//console.log(this);
					links[i].setAttribute('onclick','return doWindow(this, 1104, 768);');};
                //document.querySelector('a[href*="/window/unit/equipment"]').onclick = function(){ return doWindow(this, 1280, 768); };
})
})
})

var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);