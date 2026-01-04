// ==UserScript==
// @name Space Kings: Inactive players
// @namespace https://greasyfork.org/ru/users/229054-rovor
// @description Space Kings: Показывает имена неактивных игроков.
// @version 2.1
// @creator Rovor
// @include http://*uni1.spacekings.ru/galaxy.php*
// @downloadURL https://update.greasyfork.org/scripts/374916/Space%20Kings%3A%20Inactive%20players.user.js
// @updateURL https://update.greasyfork.org/scripts/374916/Space%20Kings%3A%20Inactive%20players.meta.js
// ==/UserScript==

//В следующей версии:
// добавить вывод в текстовый файл.
// добавить скан полей обломков.
// добавить запись координат всех игроков.

(function() {
var i=0;
if (!!$("td:contains('(i)')")[0]) {
var $mainTr = $(".galaxy_row:contains('(i)')");
var $galaxy_name = $("b:contains(Система)")[1].innerText;
//Записываем неактивных игроков в sessionStorage
for (i=0;i<$mainTr.length;i++) {sessionStorage.setItem($galaxy_name+":"+(i+1), $mainTr[i].innerHTML)};
}
//Проверяем текущую систему и галактику
    if ($("[name~='system']")[0].value != 499 || $("[name~='galaxy']")[0].value != 9) {
    if ($("[name~='system']")[0].value != 499){
galaxy_submit('systemRight');
    }
    else {
$("[name~='system']")[0].value = 1;
galaxy_submit('galaxyRight');
    }}
    else {
//Выводим всех игроков внизу окна системы
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
    }
})();