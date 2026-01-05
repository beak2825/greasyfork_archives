// ==UserScript==
// @name           Virtonomica: пагинация
// @version        2.2
// @namespace      virtonomica
// @description    Увеличивает количество элементов на страницу до 800/1600/3200
// @include        http*://virtonomic*.*/*/main/company/view/*/unit_list
// @include        http*://virtonomic*.*/*/main/company/view/*/unit_list*
// @downloadURL https://update.greasyfork.org/scripts/16330/Virtonomica%3A%20%D0%BF%D0%B0%D0%B3%D0%B8%D0%BD%D0%B0%D1%86%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/16330/Virtonomica%3A%20%D0%BF%D0%B0%D0%B3%D0%B8%D0%BD%D0%B0%D1%86%D0%B8%D1%8F.meta.js
// ==/UserScript==

var run = function() {

    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;
	
    var cookieName = 'unit_list_page_size';
    var newUnits = [800, 1600, 3200, 6400];
    var upp = JSON.parse(window.localStorage.getItem(cookieName));
    if (upp == null) {
        upp = '50';
    }
	//#mainContent > div:nth-child(6) > ul.pager_options.pull-left > li:nth-child(5) > a
    var pagingUrl = $('div > ul.pager_options.pull-left > li > a').eq(0).attr('href').replace(/\d+$/i,'');
	
	//var pagingUrl = location.pathname.replace(/\/main\/company\/view\/\d+\/unit_list*/i, "/main/common/util/setpaging/dbunit/unitListWithProduction/");
	//http://virtonomica.ru/olga/main/common/util/setpaging/dbunit/unitListWithEquipment/400
	//http://virtonomica.ru/olga/main/common/util/setpaging/dbunit/unitListWithProduction/100
	
    var links = $('div > ul.pager_options.pull-left > li');
	links.parent().append('<li><a href="'+pagingUrl+'800">800</a></li>');
	links.parent().append('<li><a href="'+pagingUrl+'1600">1600</a></li>');
	links.parent().append('<li><a href="'+pagingUrl+'3200">3200</a></li>');
	
    links = $('div > ul.pager_options.pull-left > li');
    links.each(function(i) {
        var link = $(this);

        if (link.text().trim() == upp) {
            link.addClass('selected');
            link.children().remove();
            link.text(upp);
        }

    }).click(function() {
        upp = $(this).text().trim();
		window.localStorage.setItem(cookieName,JSON.stringify(upp));
    });
}

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);