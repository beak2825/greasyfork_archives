// ==UserScript==
// @name         SDT Freespins Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  backend enhancer
// @author       Tishka
// @license mit
// @match        https://marketing-jet.lux-casino.co/*
// @match        https://marketing-sol.lux-casino.co/*
// @match        https://marketing-rox.lux-casino.co/*
// @match	     https://marketing.lux-casino.co/*
// @match		 https://marketing-fresh.lux-casino.co/*
// @match		 https://marketing-izzi.lux-casino.co/*
// @icon         https://www.google.com/s2/favicons?domain=mozilla.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437628/SDT%20Freespins%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/437628/SDT%20Freespins%20Script.meta.js
// ==/UserScript==

(function() {
	'use strict';


	var tableToObj = function(table) { // переделывает таблицу в архив, нужно для работы 3х чекера и т.д.
		var trs = table.rows,
			trl = trs.length,
			i = 0,
			j = 0,
			keys = [],
			obj, ret = [];

		for (; i < trl; i++) {
			if (i == 0) {
				for (; j < trs[i].children.length; j++) {
					keys.push(trs[i].children[j].innerHTML);
				}
			} else {
				obj = {};
				for (j = 0; j < trs[i].children.length; j++) {
					obj[keys[j]] = trs[i].children[j].innerHTML;
				}
				ret.push(obj);
			}
		}

		return ret;
	};
	function declOfNum(n, text_forms) { // возвращает правильную форму слову, первым параметром число, вторым - набор форм числа !!!(рубль, рубля, рублей)!!!
		n = Math.abs(n) % 100;
		var n1 = n % 10;
		if (n > 10 && n < 20) { return text_forms[2]; }
		if (n1 > 1 && n1 < 5) { return text_forms[1]; }
		if (n1 == 1) { return text_forms[0]; }
		return text_forms[2];
	}

	function fixNumber(n){ // какой-то адовый пиздец для разделения числа по три цифры... спасибо стековерфлоу...
		var s = n.toString().split('.');
		var r = '';
		for(var i = s[0].length-3; i > 0; i-=3)
			r = s[0].substr(i, 3) + ' ' + r;
		r = s[0].substr(0, i+3) + ' ' + r;
		r = r.substr(0, r.length-1);
		s[1] = s[1] || '00';
		return r+'.'+s[1];
	}

	function toRightForm(n, currency){
		let normalizedSum = fixNumber(n);
		const currencyForms = new Map([
			['RUB', ['рубль','рубля','рублей']],
			['UAH', ['гривна','гривны','гривен']],
			['KZT', ['тенге','тенге','тенге']],
			['USD', ['доллар','доллара','долларов']],
			['EUR', ['евро','евро','евро']],
			['PLN', ['злотый','злотых','злотых']]
		]);
		let normalizedCurrencyForm = declOfNum(n, currencyForms.get(currency));
		let output = normalizedSum.split(".")[0] + " " + normalizedCurrencyForm;
		return output;
	}

	function injectFreespinsBlock()
	{
		let freespinGamesListElement = document.querySelector(".row.row-games").querySelector("td"); // список игр, элемент
		let freespinGamesList = document.querySelector(".row.row-games").querySelector("td").innerText; // список игр, сам текст
		let freespinsCount = document.querySelector(".row.row-freespins_total").querySelector("td").innerText; // количество фриспинов
		let freespinsCurrentState = document.querySelector(".row.row-stage").querySelector("td").innerText;
		freespinGamesListElement.innerHTML = `<a id="enhancerFreespinGamesListButton">${freespinGamesList}</a>` // меняет список игр на ссылку

		freespinGamesList = [...new Set(freespinGamesList.split(", "))]; // разделяет по запятой с пробелом и
		var gameListScriptText = "";
		var cleanGameArray = [];
		for(let value of freespinGamesList)
		{
			if(!value.match(/Touch/))
			{
				gameListScriptText += value + ", ";
				cleanGameArray.push(value);
			}
		}
		gameListScriptText = gameListScriptText.trim(); // чтобы не было рандомной херни в конце скрипта
		let activateFreespinText = "";
		if(freespinsCurrentState == "Выдан"){
			activateFreespinText = ' Активируйте их в разделе "Баланс", он доступен по нажатию на ваш никнейм в правом верхнем углу сайта. ';
		}
		let scriptText = "";
		switch(cleanGameArray.length){
			case 1:
				scriptText = "Вам "+ declOfNum(freespinsCount,["доступен","доступно","доступно"])+ " "+ freespinsCount + " "+ declOfNum(freespinsCount,["фриспин","фриспина","фриспинов"]) + " в игре " + cleanGameArray[0]+ "." + activateFreespinText;
				break;
			case 2:
				scriptText = "Вам "+ declOfNum(freespinsCount,["доступен","доступно","доступно"])+ " "+ freespinsCount + " "+ declOfNum(freespinsCount,["фриспин","фриспина","фриспинов"]) + " в играх " + cleanGameArray[0] + " и " + cleanGameArray[1] + "." + activateFreespinText;
				break
			default:
				scriptText = "Вам "+ declOfNum(freespinsCount,["доступен","доступно","доступно"])+ " "+ freespinsCount + " "+ declOfNum(freespinsCount,["фриспин","фриспина","фриспинов"]) + " в следующих играх: " + gameListScriptText.slice(0, -1) + "." + activateFreespinText;
				break;
		}
		document.getElementById("enhancerFreespinGamesListButton").addEventListener("click", function(){
			navigator.clipboard.writeText(scriptText);
		});
		// выбирает список игр  document.querySelector(".row.row-games").querySelector("td").innerHTML = "<a>"+document.querySelector(".row.row-games").querySelector("td").innerText+"</a>"
		// var enhancerFreespinsBlock;
		// enhancerFreespinsBlock = document.createElement( 'div' );
		// enhancerFreespinsBlock.innerHTML = `
		// 	<a id="enhancerFreespinsCopyGames"> СКОПИРОВАТЬ</a>
		// 	`
		// var freespinsBlock = document.getElementById("active_admin_comment_body"); // элемент, в которой вкидывает, ставит первым наследником этого объекта
		// var enhancerFreespinsElement = enhancerFreespinsBlock; // код, который мы инжектим
		// freespinsBlock.before(enhancerFreespinsElement);
	}
	injectFreespinsBlock();
	// Your code here...
})();