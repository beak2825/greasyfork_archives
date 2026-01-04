// ==UserScript==
// @name         Helper
// @namespace    https://github.com/analit1538
// @version      1.2
// @description  for a happy admin.
// @author       Tsvetkov V.O.
// @match        https://dnevnik.mos.ru/*
// @match        https://school.mos.ru/*
// @match        https://mes-reports.mos.ru/*
// @match        https://school1538.ru/*
// @match        https://autoreports.ru/*
// @match        https://schoolanalytics.ru/*
// @icon         https://autoreports.ru/img/favicon-3.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493742/Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/493742/Helper.meta.js
// ==/UserScript==

function SearchDomain(){
	let Url = location.href.split('/');
	return Url[2];
}
function innerTitle(Title, str){
	if(Status != str){
		Title.innerText = str;
		Status = str;
	}
}

var Status = '';
function CheckCookie(){
	let Domain = SearchDomain();
    console.log(Domain)
	if(Domain == 'school.mos.ru'){
		let arr = document.cookie.split('; '),
			aupd_token = '';

		for(var i in arr){
			let par = arr[i].split('=');
			if(par[0] == 'aupd_token')
				aupd_token = par[1];
		}

		if('aupd_token' != ''){
			setTimeout(function() {
				var el = document.getElementsByClassName('tF2NPCKZ3eaKOckJRe0n')[0],
				html = el.innerHTML+'<div class="TciHvsl_CxnRqfRMTN9L"><a class="V6PjQJ7weyUcKY0zptpl ZXxCsYNE3sUx6LH0VmLy" href="https://dnevnik.mos.ru/?token='+aupd_token+'&direct_auth=1&backurl=https%3A%2F%2Fdnevnik.mos.ru%2Fdesktop&Organization-Id=null" type="button"><span class=" EAxiWc9rb2n8OzGlGRwu"><svg class="NQp5PvHbsg3zw0dqR7BG tcpt9oq21v1w8DS00Gdq Kwq17kqGR1gd2i3e8T4j iHQYNPDlyB9iKeoLOX6w"><use xlink:href="#icon-redo"></use></svg></span></a><div class=" DDpvXP1rPaRHhW6onleB G8a1eT_Q6QHgr8WDUFsy"><div class="FvttCWqiM44WYHqhUs4p V4ygaxyk0ifWOlJCKR9J _bd5jPMo80ovfoE_xbfv" style="width: 8.75rem;"><span class="h_bZe6tdj6yyr6BaThAq IhWORM0RCfM_znxFDK4e">Возврат к старому интерфейсу</span></div></div></div>';
				el.innerHTML = html;
			}, 1000);

		}


	}
	else if(Domain == 'dnevnik.mos.ru'){
		chrome.storage.local.set({key: document.cookie});
	}
	else if(Domain == 'mes-reports.mos.ru'){
		chrome.storage.local.set({key2: document.cookie});
	}
	else if(Domain == 'school1538.ru'){
		chrome.storage.local.get(['key'], function(result) {
			var cookie = result.key;
			if(typeof cookie != 'undefined'){
				//if(cookie.indexOf('profile_roles') != -1 && (cookie.indexOf('principal') != -1 || cookie.indexOf('deputy') != -1 || cookie.indexOf('school_admin') != -1 || cookie.indexOf('school_admin_read_only') != -1)){
					document.getElementById('coockie').value = cookie;
					document.getElementById('dropdown-notifications-menu2').style.display = 'block';
				//}
			}
		});
	}
	else{
		if (document.getElementById('coockie')) {
			let Title = document.getElementById('modal-title');
			chrome.storage.local.get(['key'], function(result) {
				var cookie = result.key;
				if(typeof cookie != 'undefined'){
					//if(cookie.indexOf('profile_roles') != -1 && (cookie.indexOf('principal') != -1 || cookie.indexOf('deputy') != -1 || cookie.indexOf('school_admin') != -1 || cookie.indexOf('school_admin_read_only') != -1)){
						document.getElementById('coockie').value = cookie;
						innerTitle(Title, 'Происходит проверка аккаунта');
					//}
					//else
					//	innerTitle(Title, 'Произошла ошибка, пожалуйста, повторите вход в ЭЖД');
				}
				else
					innerTitle(Title, 'Для продолжения работы необходимо авторизоваться в ЭЖД');
			});
		}
		else if(document.getElementById('coockie_mes_rep')){
			let Title = document.getElementById('modal-title');
			innerTitle(Title, 'Происходит проверка аккаунта');
			chrome.storage.local.get(['key2'], function(result) {
				var coockie_mes_rep = result.key2;
				if(typeof coockie_mes_rep != 'undefined'){
					document.getElementById('coockie_mes_rep').value = coockie_mes_rep;
				}
			});
		}
	}
}

(function() {
    CheckCookie();
})();

