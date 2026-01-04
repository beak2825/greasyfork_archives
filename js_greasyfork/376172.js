// ==UserScript==
// @name           HWM_All_Class_Change
// @author         ElMarado (Идею дал HWM_Quick_Class_Change от Рианти)
// @description    Смена класса любой фракции с домашней страницы (2018.11.17)
// @version        1.32
// @include	   *//*.heroeswm.*/home.php*
// @include	   *//178.248.235.15/home.php*
// @icon           https://app.box.com/representation/file_version_34029013909/image_2048/1.png?shared_name=hz97b2qwo2ycc5ospb7ccffn13w3ehc4
// @namespace https://greasyfork.org/users/14188
// @downloadURL https://update.greasyfork.org/scripts/376172/HWM_All_Class_Change.user.js
// @updateURL https://update.greasyfork.org/scripts/376172/HWM_All_Class_Change.meta.js
// ==/UserScript==

(function () {
//*******
var url_cur = location.href;
var _formAction = location.protocol+'//'+location.hostname+'/castle.php';
var _ajaxTimeout = 7000;

var all_Class = [
		[1, 'Рыцарь', 0, 'http://hwm.cdnvideo.ru/i/f/r1.png?v=1.1'],
		[1, 'Рыцарь Света', 1, 'http://hwm.cdnvideo.ru/i/f/r101.png?v=1.1'],
		[2, 'Некромант', 0, 'http://hwm.cdnvideo.ru/i/f/r2.png?v=1.1'],
		[2, 'Некромант Повелитель Смерти', 1, 'http://hwm.cdnvideo.ru/i/f/r102.png?v=1.1'],
		[3, 'Маг', 0, 'http://hwm.cdnvideo.ru/i/f/r3.png?v=1.1'],
		[3, 'Маг-разрушитель', 1, 'http://hwm.cdnvideo.ru/i/f/r103.png?v=1.1'],
		[4, 'Эльф', 0, 'http://hwm.cdnvideo.ru/i/f/r4.png?v=1.1'],
		[4, 'Эльф-заклинатель', 1, 'http://hwm.cdnvideo.ru/i/f/r104.png?v=1.1'],
		[5, 'Варвар', 0, 'http://hwm.cdnvideo.ru/i/f/r5.png?v=1.1'],
		[5, 'Варвар Крови', 1, 'http://hwm.cdnvideo.ru/i/f/r105.png?v=1.1'],
		[5, 'Варвар Шаман', 2, 'http://hwm.cdnvideo.ru/i/f/r205.png?v=1.1'],
		[6, 'Темный эльф', 0, 'http://hwm.cdnvideo.ru/i/f/r6.png?v=1.1'],
		[6, 'Темный эльф-укротитель', 1, 'http://hwm.cdnvideo.ru/i/f/r106.png?v=1.1'],
		[7, 'Демон', 0, 'http://hwm.cdnvideo.ru/i/f/r7.png?v=1.1'],
		[7, 'Демон Тьмы', 1, 'http://hwm.cdnvideo.ru/i/f/r107.png?v=1.1'],
		[8, 'Гном', 0, 'http://hwm.cdnvideo.ru/i/f/r8.png?v=1.1'],
		[9, 'Степной варвар', 0, 'http://hwm.cdnvideo.ru/i/f/r9.png?v=1.1']
];

// Делаем запрос на сервер.
// target - адрес
// params - передаваемые параметры
// ajaxCallback - что выполнить при удачном исходе
// timeoutHandler - что выполнить при неудачном (не получаем ответа в течении _ajaxTimeout мс)
function postRequest(target, params, ajaxCallback, timeoutHandler)
{
    var xmlhttp;
    if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
    else xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            ajaxCallback(xmlhttp.responseText);
        }
    }
    xmlhttp.open('POST', target, true);
    xmlhttp.overrideMimeType('text/plain; charset=windows-1251');
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.timeout = _ajaxTimeout;
    xmlhttp.ontimeout = function(){
        timeoutHandler();
    }
    xmlhttp.send(params);
}

// Сообщение игроку, если за 7 сек не получили ответа от сервера на смену класса/фракции
function alert_error(){
	document.body.style.cursor = 'default';
	alert('Ошибка, проверьте связь с интернетом.');
}

//  подфункция смена класса(только) на "cl"
function changeClass(cl){
	document.body.style.cursor = 'progress';
	postRequest(_formAction, 'classid=' + cl,
        	function (){ setTimeout(function(){location.reload()}, 300); },
	        function (){ alert_error();}
	);
}

// функция смены класса/фракции
function changeFractClass(fr,cl){
	document.body.style.cursor = 'progress';
	if (fr == cur_fr)
	{
		changeClass(cl);
		return;
	}

	if (cl == 0) {
	    postRequest(_formAction, 'fract='+fr,
	        function (){ setTimeout(function(){location.reload()}, 300); },
        	function (){ alert_error();}
	    );
		return;
	}

	    postRequest(_formAction, 'fract='+fr,
		function (){ changeClass(cl);},
        	function (){ alert_error();}
	    );
}

// обрабаытваем клик мышки и вызываем смену на соответствующий класс
function appendEvent(fr,cl){
    document.getElementById('fc'+fr+'-'+cl).onclick = function(){changeFractClass(fr,cl); this.style.cursor = 'progress'};
}

// получаем место вставки иконок класса
var icons = document.querySelector('.wb > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > center:nth-child(1)').getElementsByTagName('img');
var icon = icons[icons.length - 1];
var cur_ico = 'http://hwm.cdnvideo.ru/i/f/'+icon.src.substring(icon.src.lastIndexOf("/")+1,icon.src.length);
// выводим все иконки
var ii, elem, cur_fr, content = '<br><font style="color:#0070FF;">Изменить на:</font> ';
for (ii=0; ii < all_Class.length; ii++){
	if (all_Class[ii][3] == cur_ico) cur_fr =all_Class[ii][0];
	elem = all_Class[ii];
        content += (ii?' ':'') + '<img src="' + elem[3] + '" title="Изменить на: ' + elem[1] + '" align="absmiddle" border="0" height="15" width="15" style="cursor: pointer" id="fc' + elem[0]+'-'+elem[2] + '">';
}
icon.parentNode.innerHTML += content;
// назначаем на иконки события
for (ii=0; ii < all_Class.length; ii++){
	elem = all_Class[ii];
	appendEvent(elem[0],elem[2]);
}
//*********
})();