// ==UserScript==
// @name           hwm_banlist_60
// @author         omne
// @namespace      omne & Pauk-prizrak & Cassiel & Demin
// @description    Добавляет смотрителям #60 ссылку "Банлист" на страницу персонажа (by omne & Pauk-prizrak & Cassiel & Demin)
// @version        1.2
// @include /^https{0,1}:\/\/((www|qrator|my)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/.+/
// @exclude /^https{0,1}:\/\/((www|qrator|my)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/(login|war|cgame|frames|chat|chatonline |ch_box|chat_line|ticker|chatpost|rightcol|brd|frames)\.php.*/
// @downloadURL https://update.greasyfork.org/scripts/446209/hwm_banlist_60.user.js
// @updateURL https://update.greasyfork.org/scripts/446209/hwm_banlist_60.meta.js
// ==/UserScript==

// (c) 2022, omne

(function() {

var version = '1.0';

if (!this.GM_getValue || (this.GM_getValue.toString && this.GM_getValue.toString().indexOf("not supported")>-1)) {
	this.GM_getValue=function (key,def) {
		return localStorage[key] || def;
	};
	this.GM_setValue=function (key,value) {
		return localStorage[key]=value;
	};
	this.GM_deleteValue=function (key) {
		return delete localStorage[key];
	};
}

var script_name = "HWM mod - Set banlist for (by omne & Pauk-prizrak & Cassiel & Demin)";
var url_cur = location.href;
var url = 'http://'+location.hostname+'/';


if ( url_cur.match('pl_info.php') )
{
	var el = document.querySelector("a[href^='sms-create.php']");
	var el2 = document.querySelector(".wblight").querySelector("a[href^='pl_warlog.php?id=']");
	pid = (/\d+/).exec( el2.href );
	item_name = document.querySelector('.wb').innerHTML.match(/>([а-яА-Яa-zA-Z0-9ёЁ_\-\*&\;]+)&nbsp;&nbsp;\[/)[1].replaceAll("&nbsp;", " ");
	if ( item_name ) {
		span = document.createElement('span');
		span.innerHTML = "<p style='margin-top:0px; margin-left:8px;'><a style='text-decoration:none;'target='_blank' href='chat_pl_ban.php?"+"id="+pid+"'><b><font style='color:red;'>Банлист</font></b></a></p>";
		el.parentNode.insertBefore( span, el.nextSibling );
	}
}





function urlDecode(string) {
	var codes = '%E0%E1%E2%E3%E4%E5%B8%E6%E7%E8%E9%EA%EB%EC%ED%EE%EF%F0%F1%F2%F3%F4%F5%F6%F7%F8%F9%FA%FB%FC%FD%FE%FF';
	codes += '%C0%C1%C2%C3%C4%C5%A8%C6%C7%C8%C9%CA%CB%CC%CD%CE%CF%D0%D1%D2%D3%D4%D5%D6%D7%D8%D9%DA%DB%DC%DD%DE%DF%20';
	codes = codes.split('%');
	var chars = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
	chars += 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ ';
	for (var i=0; i<codes.length; i++) string = string.split('%'+codes[i+1]).join(chars[i]);
	return string;
}

function $(id) { return document.querySelector("#"+id); }

function addEvent(elem, evType, fn) {
	if (elem.addEventListener) {
		elem.addEventListener(evType, fn, false);
	}
	else if (elem.attachEvent) {
		elem.attachEvent("on" + evType, fn);
	}
	else {
		elem["on" + evType] = fn;
	}
}

})();