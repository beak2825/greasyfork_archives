// ==UserScript==
// @name           HWM All Class Change
// @description    Смена фракции и класса с домашней страницы (версия от 2025.03.20)
// @author         ElMarado (Идею дал HWM_Quick_Class_Change от Рианти)
// @version        1.60
// @include        https://www.heroeswm.ru/home.php*
// @include        https://www.lordswm.com/home.php*
// @include        http://178.248.235.15/home.php*
// @icon           https://app.box.com/representation/file_version_34029013909/image_2048/1.png?shared_name=hz97b2qwo2ycc5ospb7ccffn13w3ehc4
// @namespace 	   https://greasyfork.org/users/14188
// @license        GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/11673/HWM%20All%20Class%20Change.user.js
// @updateURL https://update.greasyfork.org/scripts/11673/HWM%20All%20Class%20Change.meta.js
// ==/UserScript==

(function () {
//*******
var url_cur = location.href;
var _formAction = location.protocol+'//'+location.hostname+'/castle.php';
var _ajaxTimeout = 5000;
var sign = document.body.innerHTML.match(/sign=([a-z0-9]+)/);
if(sign) sign = sign[1];
    else return;

var all_Class = [
		[1, 'Рыцарь', 0, 'http://dcdn.heroeswm.ru/i/f/r1.png?v=1.1'],
		[1, 'Рыцарь света', 1, 'http://dcdn.heroeswm.ru/i/f/r101.png?v=1.1'],
		[2, 'Некромант', 0, 'http://dcdn.heroeswm.ru/i/f/r2.png?v=1.1'],
		[2, 'Некромант - повелитель смерти', 1, 'http://dcdn.heroeswm.ru/i/f/r102.png?v=1.1'],
		[3, 'Маг', 0, 'http://dcdn.heroeswm.ru/i/f/r3.png?v=1.1'],
		[3, 'Маг - разрушитель', 1, 'http://dcdn.heroeswm.ru/i/f/r103.png?v=1.1'],
		[4, 'Эльф', 0, 'http://dcdn.heroeswm.ru/i/f/r4.png?v=1.1'],
		[4, 'Эльф - заклинатель', 1, 'http://dcdn.heroeswm.ru/i/f/r104.png?v=1.1'],
		[5, 'Варвар', 0, 'http://dcdn.heroeswm.ru/i/f/r5.png?v=1.1'],
		[5, 'Варвар крови', 1, 'http://dcdn.heroeswm.ru/i/f/r105.png?v=1.1'],
		[5, 'Варвар - шаман', 2, 'http://dcdn.heroeswm.ru/i/f/r205.png?v=1.1'],
		[6, 'Темный эльф', 0, 'http://dcdn.heroeswm.ru/i/f/r6.png?v=1.1'],
		[6, 'Темный эльф - укротитель', 1, 'http://dcdn.heroeswm.ru/i/f/r106.png?v=1.1'],
		[7, 'Демон', 0, 'http://dcdn.heroeswm.ru/i/f/r7.png?v=1.1'],
		[7, 'Демон тьмы', 1, 'http://dcdn.heroeswm.ru/i/f/r107.png?v=1.1'],
		[8, 'Гном', 0, 'http://dcdn.heroeswm.ru/i/f/r8.png?v=1.1'],
		[8, 'Гном огня', 1, 'http://dcdn.heroeswm.ru/i/f/r108.png?v=1.1'],
		[9, 'Степной варвар', 0, 'http://dcdn.heroeswm.ru/i/f/r9.png?v=1.1'],
		[9, 'Степной варвар ярости', 1, 'http://dcdn.heroeswm.ru/i/f/r109.png?v=1.1'],
		[10, 'Фараон', 0, 'http://dcdn.heroeswm.ru/i/f/r10.png?v=1.1']
];

// Делаем з-прос на сервер.
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
    xmlhttp.open('GET', target+params, true);
    xmlhttp.overrideMimeType('text/plain; charset=windows-1251');
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


// функция смены класса/фракции
function changeFractClass(fr,cl){
	document.body.style.cursor = 'progress';
	postRequest(_formAction, '?change_clr_to='+(cl?cl+'0'+fr:fr)+'&sign='+sign,
	        function (){ setTimeout(function(){location.reload()}, 300); },
        	function (){ alert_error();}
	);
}

// обрабаытваем клик мышки и вызываем смену на соответствующий класс
function appendEvent(fr,cl){
    document.getElementById('fc'+fr+'-'+cl).onclick = function(){changeFractClass(fr,cl); this.style.cursor = 'progress'};
}

// получаем место вставки иконок класса

var icons = document.querySelectorAll("a[href*='castle.php?change_faction_dialog']");
var icon = icons[0].childNodes[0];
var newInterface = false;
if (icon.tagName == "DIV") {newInterface = true; icon = icon.childNodes[0];}
var cur_ico = 'https://dcdn.heroeswm.ru/i/f/'+icon.src.substring(icon.src.lastIndexOf("/")+1,icon.src.length);
// выводим все иконки
var ii, elem, cur_fr, content = '<br>';
if (newInterface) content += '<DIV align="right">';
content += '<font style="color:#0070FF;">Изменить класс на:</font> ';
for (ii=0; ii < all_Class.length; ii++){
	if (all_Class[ii][3] == cur_ico) cur_fr =all_Class[ii][0];
	elem = all_Class[ii];
        content += (ii?' ':'') + '<img src="' + elem[3] + '" title="Изменить на: ' + elem[1] + '" align="absmiddle" border="0" height="15" width="15" style="cursor: pointer" id="fc' + elem[0]+'-'+elem[2] + '">';
}
if (newInterface) content +="</DIV>";;

icons[0].parentNode.innerHTML += content;
// назначаем на иконки события
for (ii=0; ii < all_Class.length; ii++){
	elem = all_Class[ii];
	appendEvent(elem[0],elem[2]);
}
//*********
})();