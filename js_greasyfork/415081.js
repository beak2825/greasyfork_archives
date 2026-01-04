// ==UserScript==
// @name           hwm_forum_moder
// @namespace      Demin + Cassiel + omne
// @description    HWM mod - Forum moder
// @version        2.3
// @include /^https{0,1}:\/\/((www|qrator|my)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/.+/
// @exclude /^https{0,1}:\/\/((www|qrator|my)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/(login|war|cgame|frames|chat|chatonline |ch_box|chat_line|ticker|chatpost|rightcol|brd|frames)\.php.*/
// @downloadURL https://update.greasyfork.org/scripts/415081/hwm_forum_moder.user.js
// @updateURL https://update.greasyfork.org/scripts/415081/hwm_forum_moder.meta.js
// ==/UserScript==


var url_cur = location.href;
var url = '//'+location.hostname+'/';

try {

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

if ( (tag('body'))[0] ) {


// vklychit' modera
if ( location.pathname=='/forum_messages.php' ) {
var all_a = tag('a');
var a_len = all_a.length;
for (var i= 0; i < a_len; i++) {
var a_i = all_a[i];

if ( a_i.href.match(/&md=0/) && a_i.innerHTML.match(/\/\//) ) {

// dobavit' ssylki zabanit' dlya zabanenyh
var all_a = tag('tr');
var a_len = all_a.length;
for (var j = 0; j < a_len; j++) {
var a_i = all_a[j];

if ( a_i.className=='message_footer' && !all_a[j+2].innerHTML.match(/return searchf/) ) {

var mid = (/name=.?(\d+)/).exec(a_i.innerHTML)[1];
var pid = (/pl_info\.php\?id=(\d+)/).exec(a_i.innerHTML)[1];

var del_mes = document.createElement('div');
del_mes.setAttribute('id', 'del' + j);
del_mes.setAttribute('style', 'text-decoration:none !important');
makeRequest(pid, mid, j);
all_a[j+2].lastChild.appendChild(del_mes);

if ( a_i.className=='message_footer' && !all_a[j+2].innerHTML.match(/forum_ban.php/) ) {
//http://www.heroeswm.ru/forum_messages.php?tid=1721654
//http://www.heroeswm.ru/forum_ban.php?mid=26356510&pid=3928999&page=0


var add_ban = document.createElement('div');
add_ban.setAttribute('align', 'right');
add_ban.innerHTML = "<a href='forum_ban.php?mid="+mid+"&pid="+pid+"'>\u0417\u0430\u0431\u0430\u043d\u0438\u0442\u044c</a>";
all_a[j+2].lastChild.appendChild(add_ban);
}
}
}

break;
}
}
}

// posle bana nazad k teme
if ( location.pathname=='/forum_ban.php' ) {
var all_a = tag('a');
var a_len = all_a.length;
for (var i=a_len; i--;) {
var a_i = all_a[i];
if ( a_i.parentNode.innerHTML.match(/<\/a><br><br>\u0417\u0430\u0431\u0430\u043d\u0435\u043d.<br>/) ) {
setTimeout(function() { window.location=a_i.href; }, 500);
break;
}
}
}

}

} finally { update_n() }

function urlEncode(str) {
    // Простая проверка
    if (!str || typeof(str) == "undefined") return;
    // Создаем хеш для хранения символов, где ключ - сам символ,
    // а значение - его шестнадцатеричеый эквивалент
    var utf8Array = {};
    // Сначала добавляем стандартные 255 символов
    var i = j = j2 = 0;
    for (i = 0; i <= 255; i++) {
        j = parseInt(i/16); var j2 = parseInt(i%16);
        utf8Array[String.fromCharCode(i)] = ('%' + j.toString(16) + j2.toString(16)).toUpperCase();
    }
    // И отдельно проработаем кириллицу
    var rusAdditional = {
        '_' : '%5F', 'А' : '%C0', 'Б' : '%C1', 'В' : '%C2', 'Г' : '%C3', 'Д' : '%C4', 'Е' : '%C5',
        'Ж' : '%C6', 'З' : '%C7', 'И' : '%C8', 'Й' : '%C9', 'К' : '%CA', 'Л' : '%CB', 'М' : '%CC',
        'Н' : '%CD', 'О' : '%CE', 'П' : '%CF', 'Р' : '%D0', 'С' : '%D1', 'Т' : '%D2', 'У' : '%D3',
        'Ф' : '%D4', 'Х' : '%D5', 'Ц' : '%D6', 'Ч' : '%D7', 'Ш' : '%D8', 'Щ' : '%D9', 'Ъ' : '%DA',
        'Ы' : '%DB', 'Ь' : '%DC', 'Э' : '%DD', 'Ю' : '%DE', 'Я' : '%DF', 'а' : '%E0', 'б' : '%E1',
        'в' : '%E2', 'г' : '%E3', 'д' : '%E4', 'е' : '%E5', 'ж' : '%E6', 'з' : '%E7', 'и' : '%E8',
        'й' : '%E9', 'к' : '%EA', 'л' : '%EB', 'м' : '%EC', 'н' : '%ED', 'о' : '%EE', 'п' : '%EF',
        'р' : '%F0', 'с' : '%F1', 'т' : '%F2', 'у' : '%F3', 'ф' : '%F4', 'х' : '%F5', 'ц' : '%F6',
        'ч' : '%F7', 'ш' : '%F8', 'щ' : '%F9', 'ъ' : '%FA', 'ы' : '%FB', 'ь' : '%FC', 'э' : '%FD',
        'ю' : '%FE', 'я' : '%FF', 'ё' : '%B8', 'Ё' : '%A8'
    }
    for (i in rusAdditional) utf8Array[i] = rusAdditional[i];
    // Посимвольно заменяем символы на их шестнадцатиречные эквиваленты
    var res = "";
    for(i = 0; i < str.length; i++) {
        var simbol = str.substr(i,1);
        res += typeof utf8Array[simbol] != "undefined" ? utf8Array[simbol] : simbol;
    }
    // Пробелы заменяем на плюсы
//    res = res.replace(/\s/g, "+");
//alert(res);
    return res;
}

function $( id ) { return document.getElementById( id ); }

function tag( id ) { return document.getElementsByTagName( id ); }

function createXMLHttpReq(rndm)
{
	var objXMLHttpReq;

	if (window.XMLHttpRequest)
	{
		// Real browsers ;)
		//
		objXMLHttpReq = new XMLHttpRequest();
	}
	else if (window.ActiveXObject)
	{
		// IE
		//
		objXMLHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
	}

	return objXMLHttpReq;
}


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


if ( url_cur.match('pl_info.php') ) {
    console.log("aa");
	let el = document.querySelector("a[href^='sms-create.php']");
	let el2 = document.querySelector(".wblight").querySelector("a[href^='pl_warlog.php?id=']");
	pid = (/\d+/).exec( el2.href );
	let item_name = document.querySelector('.wb').innerHTML.match(/>([^<]+)<\/h1>/)[1].replaceAll("&nbsp;", " ");
	if ( item_name ) {
		let span = document.createElement('span');
		span.innerHTML = "<p style='margin-top:0px; margin-left:8px;'><a style='text-decoration:none;' href='forum_ban.php?mid=38934823&pid="+pid+"'><b><font style='color:red;'>Банлист</font></b></a></p>";
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


function update_n() {
if ( (parseInt(GM_getValue('last_update', '0')) + 86400000 <= (new Date().getTime())) || (parseInt(GM_getValue('last_update', '0')) > (new Date().getTime())) ) {
var objXMLHttpReqUpd = createXMLHttpReq(Math.random()* 1000000);
objXMLHttpReqUpd.open('GET', url + 'photo_pl_photos.php?aid=1777' + '&rand=' + (Math.random()* 1000000), true);
objXMLHttpReqUpd.onreadystatechange = function() { update(objXMLHttpReqUpd); }
objXMLHttpReqUpd.send(null);
}
}



  function makeRequest(plid, mid, num) {
        var httpRequest = false;
        if (window.XMLHttpRequest) { // Mozilla, Safari, ...
            httpRequest = new XMLHttpRequest();
            if (httpRequest.overrideMimeType) {
                httpRequest.overrideMimeType('text/xml; charset=windows-1251');
            }
        } else if (window.ActiveXObject) { // IE
            try {
                httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {}
            }
        }

        if (!httpRequest) {
            return false;
        }
        httpRequest.onreadystatechange = function() { alertContents(httpRequest, num); };
        httpRequest.open('GET', url + "forum_ban.php?mid=" + mid + "&pid=" + plid, true);
        httpRequest.send(null);
      return (alertContents(httpRequest));

    }

    function alertContents(httpRequest, num) {

        if (httpRequest.readyState == 4) {
            var r = 'zx';
            if (httpRequest.status == 200) {
				let test = new DOMParser().parseFromString(httpRequest.responseText, "text/html");
                let text = test.querySelector('.wbwhite').innerHTML;
                text = text.replace("<u>", '');
                document.querySelector('#del' + num).innerHTML = text;
            }

        }
    }

