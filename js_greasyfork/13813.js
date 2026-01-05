// ==UserScript==
// @name       Netflix - Import Cookie Premium
// @author     Miguel Machado
// @namespace  com.fernandoxlr.netflix
// @version    1.0
// @description  Import Netflix Cookies
// @match      http*://*.netflix.com/*
// @copyright  2013+, You
// @downloadURL https://update.greasyfork.org/scripts/13813/Netflix%20-%20Import%20Cookie%20Premium.user.js
// @updateURL https://update.greasyfork.org/scripts/13813/Netflix%20-%20Import%20Cookie%20Premium.meta.js
// ==/UserScript==

function setCookie(key, valor) {
	var hoje = new Date();
	minute = 999 * 24 * 60; 
	var expira = new Date(hoje.getTime() + minute * 60 * 1000);
	var expira = expira.toGMTString();
    var domain2 = ';domain=.netflix.com';
	document.cookie = key + '=' + valor + ';expires=' + expira + domain2;
}

var msg = "Cole o conteúdo do arquivo do cookie nessa área de texto e clique no botão!";

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

		alert('Processo concluído, aguarde o carregamento da página, se não funcionou tente outro cookie\n\n\t\t\tby Miguel Machado');
		location.href='https://movies.netflix.com/WiHome';
	} else alert(msg);
}

local = $('.form-container');
if ($(local)[0] == null) local = $('header:first').next();
if (location.href.indexOf('movies') == -1)
    $(local).children().first().before('<div style="width: 100%; max-width: 500px; padding: 5px; border: #000 solid 3px; background-color: #FFF;"><span>'+msg+'</span><br><textarea id="cookie_text" style="width:98%; height: 400px;"></textarea><br><center><a href="#" onclick="return false;" style="color:#FFF; background-color: red;" id="cookie_login">Login com Cookie</a></center><br><span style="float: right;">by Miguel Machado</span><br></div>');
$('#cookie_login').bind('click', apply);

void(0);