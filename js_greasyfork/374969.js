// ==UserScript==
// @name Space Kings: Show inactive players
// @namespace https://greasyfork.org/ru/users/229054-rovor
// @description Space Kings: Выводит имена неактивных игроков.
// @version 1.0
// @creator Rovor
// @include http://*uni1.spacekings.ru/galaxy.php*
// @downloadURL https://update.greasyfork.org/scripts/374969/Space%20Kings%3A%20Show%20inactive%20players.user.js
// @updateURL https://update.greasyfork.org/scripts/374969/Space%20Kings%3A%20Show%20inactive%20players.meta.js
// ==/UserScript==

(function() {
    var i=0;
    var $table = $("table")[8];
    var i_row = Array();
    var g_row = Array();
    //var g_row = document.createElement("tr");
    for (i=0;i<=sessionStorage.length;i++) {
        g_row[i] = document.createElement("tr");
        g_row[i].innerHTML=$table.rows[0].innerHTML;
        g_row[i].children[0].children[0].innerText = sessionStorage.key(i);
        $table.appendChild(g_row[i]);
        i_row[i] = document.createElement("tr");
        i_row[i].classList.add("galaxy_row");
        i_row[i].innerHTML=sessionStorage[sessionStorage.key(i)];
        $table.appendChild(i_row[i]);
    }

$('.galaxy_info').hover(function () {
		$('#tooltip').remove();
		var pos = $(this).offset();
		$('body').append('<div id="tooltip" style="display:none; position: absolute; top:'+((pos.top - 135)>0 ? (pos.top - 135) : 0 )+'px; left:'+(pos.left)+'px;">'+($(this).data("info"))+'</div>');
		$('#tooltip').stop(false, true).fadeIn();
	});
$('.galaxy_info2').hover(function () {
		$('#tooltip').remove();
		var pos = $(this).offset();
		$('body').append('<div id="tooltip" style="display:none; position: absolute; top:'+((pos.top - 112)>0 ? (pos.top - 112) : 0 )+'px; left:'+((pos.left + 180)>window.innerWidth ? pos.left - 90 : pos.left )+'px;">'+($(this).data("info"))+'</div>');
		$('#tooltip').stop(false, true).fadeIn();
	});
})();