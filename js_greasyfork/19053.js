// ==UserScript==
// @name           Virtonomica: автопереход на следующую страницу при строительстве
// @version        1.5
// @include        http*://*virtonomic*.*/*/main/unit/create/*
// @description    Добавляет автопереход на следующую страницу при выборе варианта строительства
// @author         cobra3125
// @namespace      virtonomica
// @downloadURL https://update.greasyfork.org/scripts/19053/Virtonomica%3A%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4%20%D0%BD%D0%B0%20%D1%81%D0%BB%D0%B5%D0%B4%D1%83%D1%8E%D1%89%D1%83%D1%8E%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D1%83%20%D0%BF%D1%80%D0%B8%20%D1%81%D1%82%D1%80%D0%BE%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/19053/Virtonomica%3A%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4%20%D0%BD%D0%B0%20%D1%81%D0%BB%D0%B5%D0%B4%D1%83%D1%8E%D1%89%D1%83%D1%8E%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D1%83%20%D0%BF%D1%80%D0%B8%20%D1%81%D1%82%D1%80%D0%BE%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%B5.meta.js
// ==/UserScript==

var run = function() {

	var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
	$ = win.$;
	
	$('form > table.list > tbody > tr > td > input[type="radio"]').each(function() {
        var cbox = $(this);
        cbox.change(function() {
            if ($(this).is(':checked')) {
              	setTimeout( function(){ $('input[type="submit"][name="next"]').click(); }, 200);
            }
        });
        cbox.parent().parent().click(function() {
            cbox.prop('checked',true).change();
        });
	});
}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}