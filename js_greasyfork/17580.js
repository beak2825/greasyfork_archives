// ==UserScript==
// @name       Netflix - Import Cookie
// @version    1.1
// @description  Import Netflix Cookies
// @match      http*://*.netflix.com/*
// @copyright  2013+, You
// @namespace https://greasyfork.org/users/32340
// @downloadURL https://update.greasyfork.org/scripts/17580/Netflix%20-%20Import%20Cookie.user.js
// @updateURL https://update.greasyfork.org/scripts/17580/Netflix%20-%20Import%20Cookie.meta.js
// ==/UserScript==

function setCookie(key, valor) {
	var hoje = new Date();
	minute = 999 * 24 * 60; 
	var expira = new Date(hoje.getTime() + minute * 60 * 1000);
	var expira = expira.toGMTString();
    var domain2 = ';domain=.netflix.com';
	document.cookie = key + '=' + valor + ';expires=' + expira + domain2;
}

var msg = "Coloque la cookie Aqui!!!";

function apply(){
	cont = $('#cookie_text').val();
	if (cont.length > 0){
		txt = cont.split('\n');
		lentxt = txt.length;

		for (i = 0; i < lentxt; i++){
			line = txt[i].split('\t');
			len = line.length;
			key = line[len-2];
			value = line[len-1];
			setCookie(key, value);
		}

		alert('Se cargo la cookie... Actualizando');
		location.href='https://movies.netflix.com/WiHome';
	} else alert(msg);
}

local = $('.form-container');
if ($(local)[0] == null) local = $('header:first').next();
if (location.href.indexOf('movies') == -1)
    $(local).children().first().before('<div style="width: 100%; max-width: 500px; padding: 5px;font-weight: bold; border: #000 solid 4px; background-color: #FFF;text-align: center;"><span>'+msg+'</span><br><textarea id="cookie_text" style="width:98%; height: 400px;"></textarea><br><center><a href="#" onclick="return false;" style="color:#FFF; background-color: red;" id="cookie_login">Login Cookie</a></center></div>');
$('#cookie_login').bind('click', apply);

void(0);