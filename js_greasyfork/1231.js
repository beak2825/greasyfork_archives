// ==UserScript==
// @name           hwm_battlelinks
// @author         Demin
// @namespace      Demin
// @description    Быстрые ссылки на итоги боя; начало, конец, чат боя (by Demin)
// @homepage       https://greasyfork.org/users/1602-demin
// @icon           http://i.imgur.com/LZJFLgt.png
// @version        3.6
// @encoding 	   utf-8
// @include        http://*heroeswm.ru/*
// @include        http://178.248.235.15/*
// @include        http://*lordswm.com/*
// @include        http://*hwmguide.ru/*
// @exclude        */rightcol.php*
// @exclude        */ch_box.php*
// @exclude        */chat*
// @exclude        */ticker.html*
// @exclude        */frames*
// @exclude        */brd.php*
// @exclude        */auction.php*
// @grant          GM_deleteValue
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_setValue
// @grant          GM_addStyle
// @grant          GM_log
// @grant          GM_openInTab
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/1231/hwm_battlelinks.user.js
// @updateURL https://update.greasyfork.org/scripts/1231/hwm_battlelinks.meta.js
// ==/UserScript==

// (c) 2010-2015, demin  ( http://www.heroeswm.ru/pl_info.php?id=15091 )

(function() {
setTimeout(function() {

var version = '3.6';


var blank = ' target="_blank"';
//var blank = '';


if (typeof GM_deleteValue != 'function') {
	this.GM_getValue=function (key,def) {return localStorage[key] || def;};
	this.GM_setValue=function (key,value) {return localStorage[key]=value;};
	this.GM_deleteValue=function (key) {return delete localStorage[key];};

	this.GM_addStyle=function (key) {
		var style = document.createElement('style');
		style.textContent = key;
		document.querySelector("head").appendChild(style);
	}

	this.GM_xmlhttpRequest=function (details) {
		function setupEvent(xhr, url, eventName, callback) {
			xhr[eventName] = function() {
				var isComplete = xhr.readyState == 4;
				var responseState = {
					responseText: xhr.responseText,
					readyState: xhr.readyState,
					responseHeaders: isComplete ? xhr.getAllResponseHeaders() : "",
					status: isComplete ? xhr.status : 0,
					statusText: isComplete ? xhr.statusText : "",
					finalUrl: isComplete ? url : ""
				};
				callback(responseState);
			};
		}
		var xhr = new XMLHttpRequest();
		var eventNames = ["onload", "onerror", "onreadystatechange"];
		for (var i = 0; i < eventNames.length; i++) {
			var eventName = eventNames[i];
			if (eventName in details) {
				setupEvent(xhr, details.url, eventName, details[eventName]);
			}
		}
		xhr.open(details.method, details.url);
		if (details.overrideMimeType) {
			xhr.overrideMimeType(details.overrideMimeType);
		}
		if (details.headers) {
			for (var header in details.headers) {
				xhr.setRequestHeader(header, details.headers[header]);
			}
		}
		xhr.send(details.data ? details.data : null);
	}
}


var script_num = 92536;
var script_name = 'hwm_battlelinks: Быстрые ссылки на итоги боя; начало, конец, чат боя (by Demin)';
// see down

var url_cur = location.href;
var url = 'http://'+location.hostname+'/';


var a = document.querySelectorAll("a[href*='warid=']");
var warid = /warid=(\d+)/;
var ai, warid_ai, bt;

if ( url=='http://www.heroeswm.ru/' || url=='http://qrator.heroeswm.ru/' || url=='http://178.248.235.15/' || url=='http://www.lordswm.com/' ) { update_n(version,script_num,script_name); }
	else { url = 'http://www.heroeswm.ru/'; }

for ( var i=a.length; i--; ) {
	ai = a[i];
	if ( warid_ai = warid.exec(ai) ) {
		warid_ai = warid_ai[1];
		bt = document.createElement('span');

		bt.innerHTML = '&nbsp;[<a href="'+url+'war.php?lt=-1&warid='+warid_ai+'"'+blank+'>#</a>'+
		'&nbsp;<a href="'+url+'battlechat.php?warid='+warid_ai+'"'+blank+'>chat</a>'+
		'&nbsp;<a href="'+url+'war.php?warid='+warid_ai+'"'+blank+'>$</a>'+
		'&nbsp;<a href="'+url+'battle.php?lastturn=-3&warid='+warid_ai+'"'+blank+'>E</a>]';

		ai.parentNode.insertBefore(bt, ai.nextSibling);
		addEvent(ai, "click", show_result);
	}
}

function show_result(event)
{
event = event || window.event;
event.preventDefault ? event.preventDefault() : (event.returnValue=false);
var ai = event.target || event.srcElement;

while ( !warid.exec(ai.href) ) { ai = ai.parentNode; }
// for home page (once) && pl_info page (in battle) (twice)
warid_ai = warid.exec(ai.href)[1];

GM_addStyle('\
#war_result table, #war_result td {background-image: none; text-align: left; border: 0px; margin: 0px; padding: 0px; line-height: 16px; border-collapse: separate;}\
#war_result td, #war_result a, #war_result b {FONT-SIZE: 9pt; COLOR: #592C08; FONT-FAMILY: verdana, geneva, arial cyr;}\
#war_result font {FONT-SIZE: 9pt; FONT-FAMILY: verdana, geneva, arial cyr}\
');

var newdiv = $('war_result');
if ( !newdiv ) {
	newdiv = document.createElement('div');
	newdiv.setAttribute('id', 'war_result');
	with ( newdiv.style ) {
		position = 'absolute';
		borderStyle = 'solid';
		borderColor = '#000000';
		borderWidth = '2px';
		padding = '0px';
		zIndex = '3';
	}
}

newdiv.style.left = event.pageX + 5;
newdiv.style.top = event.pageY + 5;

newdiv.innerHTML = '<table cellspacing=4 cellpadding=0 bgcolor="#f5f3ea"><tr>'+
	'<td align="left">warid: '+warid_ai+

	'&nbsp;[<a href="'+url+'war.php?lt=-1&warid='+warid_ai+'"'+blank+'>#</a>'+
	'&nbsp;<a href="'+url+'battlechat.php?warid='+warid_ai+'"'+blank+'>chat</a>'+
	'&nbsp;<a href="'+url+'war.php?warid='+warid_ai+'"'+blank+'>$</a>'+
	'&nbsp;<a href="'+url+'battle.php?lastturn=-3&warid='+warid_ai+'"'+blank+'>E</a>]'+

	'</td><td width=100></td>'+
	'<td align="right" id="close_div_result" title="Close" style="text-align: right;">[x]</td></tr>'+
	'<tr><td align="left" id="war_result_cont" colspan="3"><br>'+loaders()+'</td></tr>'+
	'</table>';

ai.parentNode.insertBefore(newdiv, ai.nextSibling);
addEvent($("close_div_result"), "click", div_close_result);

/*
if ( url != 'http://'+location.hostname+'/' ) {
	var div = $('war_result_cont');
	div.innerHTML = '<br>Не выполнимо на данном домене';
	return;
}
*/

GM_xmlhttpRequest
({
	method: "GET",
	url: url + 'battle.php?lastturn=-2&warid=' + warid_ai,
	onload: function(obj)
	{
		handleHttpResponseWid(obj);
	}
});

/*
var objXMLHttpReqWid = new XMLHttpRequest();
objXMLHttpReqWid.open('GET', url + 'battle.php?lastturn=-2&warid=' + warid_ai, true);
//objXMLHttpReqWid.overrideMimeType("text/plain; charset=windows-1251");
objXMLHttpReqWid.onreadystatechange = function() { handleHttpResponseWid(objXMLHttpReqWid); }
objXMLHttpReqWid.send(null);
*/

}

function div_close_result() {
	var temp_rez = $('war_result');
	temp_rez.parentNode.removeChild(temp_rez);
}

function handleHttpResponseWid(obj) {
	if ( obj.readyState != 4 ) return;
	var div = $('war_result_cont');
	if ( obj.status != 200 ) {
		div.innerHTML = "<br>Http error "+String(obj.status);
		return;
	}
	var arr = obj.responseText.split(";/", 2);

	var lwm = 0;
	if ( url.match('lordswm') ) {
		var regexp_exp = /(\d+) exp/;
		var regexp_skill = /(\d*\.?\d+) skill/;
		var err = "Parse error.";

		lwm = 1;
		var pos = arr[0].indexOf('#f_en');
		if ( pos==-1 ) { lwm = 0; pos = arr[0].indexOf('f<font size="18"><b>'); } // esli staryi boj na lwm.com do ob'edinenija
	} else {
		var regexp_exp = /(\d+) опыт/;
		var regexp_skill = /(\d*\.?\d+) умение/;
		var err = "Результаты боя не найдены.";

		var pos = arr[0].indexOf('f<font size="18"><b>');
	}

	if ( pos==-1 ) {
		div.innerHTML = "<br>" + err;
		return;
	}

	if ( lwm==1 ) {
		var tmp = arr[0].substr(pos+5);
	} else {
		var tmp = arr[0].substr(pos+1);
	}

	tmp = tmp.substr(0, tmp.indexOf('|#')).replace(/ size="18"/g, '').replace(/font color="/g, 'font style="color: ');

	arr = tmp.split("<br");
	var exp1, um1;
	for (var i in arr) {
		if ( exp1 = regexp_exp.exec( arr[i] ) ) {
			um1 = regexp_skill.exec( arr[i] )[1];
			if ( um1 != 0 ) {
				arr[i] = arr[i].slice(0, -1) + " (" + Math.ceil( exp1[1] / um1 ) + ").";
			}
		}
	}

	div.innerHTML = '<br>' + arr.join("<br");
}

function loaders() {
return '<img border="0" align="absmiddle" height="11" src="data:image/gif;base64,'+
'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'+
'fySDhGYQdDWGQyUhADs=">';
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

function update_n(a,b,c,d,e){if(e){e++}else{e=1;d=(Number(GM_getValue(b+'_update_script_last2','0'))||0)}if(e>3){return}var f=new Date().getTime();var g=document.querySelector('#update_demin_script2');if(g){if((d+86400000<f)||(d>f)){g=g.innerHTML;if(/100000=1.1/.exec(g)){var h=new RegExp(b+'=(\\d+\\.\\d+)=(\\d+)').exec(g);var i=/url7=([^%]+)/.exec(g);if(a&&h&&i){if(Number(h[1])>Number(a))setTimeout(function(){if(confirm('\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u043E \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u0441\u043A\u0440\u0438\u043F\u0442\u0430: "'+c+'".\n\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u0443\u044E \u0432\u0435\u0440\u0441\u0438\u044E \u0441\u0435\u0439\u0447\u0430\u0441?\n\nThere is an update available for the script: "'+c+'".\nWould you like install the script now?')){if(typeof GM_openInTab=='function'){GM_openInTab(i[1].replace(/\s/g,'')+h[2])}else{window.open(i[1].replace(/\s/g,'')+h[2],'_blank')}}},500)}GM_setValue(b+'_update_script_last2',''+f)}else{setTimeout(function(){update_n(a,b,c,d,e)},1000)}}}else{var j=document.querySelector('body');if(j){var k=GM_getValue(b+'_update_script_array2');if(e==1&&((d+86400000<f)||(d>f)||!k)){if(k){GM_deleteValue(b+'_update_script_array2')}setTimeout(function(){update_n(a,b,c,d,e)},1000);return}var l=document.createElement('div');l.id='update_demin_script2';l.setAttribute('style','position: absolute; width: 0px; height: 0px; top: 0px; left: 0px; display: none;');l.innerHTML='';j.appendChild(l);if((d+86400000<f)||(d>f)||!k){var m=new XMLHttpRequest();m.open('GET','photo_pl_photos.php?aid=1777'+'&rand='+(Math.random()*100),true);m.onreadystatechange=function(){update(m,a,b,c,d,e)};m.send(null)}else{document.querySelector('#update_demin_script2').innerHTML=k;setTimeout(function(){update_n(a,b,c,d,e)},10)}}}}function update(a,b,c,d,e,f){if(a.readyState==4&&a.status==200){a=a.responseText;var g=/(\d+=\d+\.\d+(=\d+)*)/g;var h='';var i=/(url7=[^%]+\%)/.exec(a);if(i){h+=i[1]}while((i=g.exec(a))!=null){if(h.indexOf(i[1])==-1){h+=' '+i[1]}};GM_setValue(c+'_update_script_array2',''+h);var j=document.querySelector('#update_demin_script2');if(j){j.innerHTML=h;setTimeout(function(){update_n(b,c,d,e,f)},10)}}}

}, 100);
})();
