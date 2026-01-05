// ==UserScript==
// @name           Virtonomica: пагинация by Agor71
// @version        1.00
// @author         Agor71
// @namespace      virtonomica
// @description    Увеличивает количество элементов на страницу
// @include        http*://*virtonomic*.*/*
// @downloadURL https://update.greasyfork.org/scripts/26581/Virtonomica%3A%20%D0%BF%D0%B0%D0%B3%D0%B8%D0%BD%D0%B0%D1%86%D0%B8%D1%8F%20by%20Agor71.user.js
// @updateURL https://update.greasyfork.org/scripts/26581/Virtonomica%3A%20%D0%BF%D0%B0%D0%B3%D0%B8%D0%BD%D0%B0%D1%86%D0%B8%D1%8F%20by%20Agor71.meta.js
// ==/UserScript==

var run = function() {

    if($(".pager_options").length){
		$(".pager_options").append( $(".pager_options :eq(1)")[0].outerHTML.replace(/10/g, "1000") 
								   +$(".pager_options :eq(1)")[0].outerHTML.replace(/10/g, "2000") 
								   +$(".pager_options :eq(1)")[0].outerHTML.replace(/10/g, "4000") 
								   +$(".pager_options :eq(1)")[0].outerHTML.replace(/10/g, "10000") 
								   +$(".pager_options :eq(1)")[0].outerHTML.replace(/10/g, "20000") 
		);
	}
}

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);