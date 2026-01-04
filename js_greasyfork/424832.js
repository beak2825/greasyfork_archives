// ==UserScript==
// @name            My Twitch Drop Claimer
// @name:ru         My Twitch Drop Claimer
// @namespace       http://www.aazone.ru/
// @version         0.7
// @description     automatically clicks the "Claim" button
// @description:ru  автоматически нажимает кнопку "Получить"
// @author          Aaz
// @match           https://www.twitch.tv/*
// @match           *://*.twitch.tv/*
// @match           *://twitch.tv/*
// @icon            https://static.twitchcdn.net/assets/favicon-32-d6025c14e900565d6177.png
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/424832/My%20Twitch%20Drop%20Claimer.user.js
// @updateURL https://update.greasyfork.org/scripts/424832/My%20Twitch%20Drop%20Claimer.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
 
(function() { 'use strict';
		
	const ClaimButtonNames = [
		'Claim', //English
		'Hent', //Dansk
		'Abholen', //Deutsch
		'Reclamar', //Español
		'Obtenir', //Français
		'Riscatta', //Italiano
		'Megszerzés', //Magyar
		'Claimen', //Nederlands
		'Motta', //Norsk
		'Odbierz', //Polski
		'Resgatar', //Português
		'Solicită', //Română
		'Vyzdvihnúť', //Slovenčina
		'Lunasta', //Suomi
		'Hämta', //Svenska
		'Nhận', //Tiếng Việt
		'Al', //Türkçe
		'Vyzvednout', //Čeština
		'Διεκδίκηση', //Ελληνικά
		'Заявяване', //Български
		'Получить', //Русский
		'เคลม', //ภาษาไทย
		'领取', //中文 简体
		'領取', //中文 繁體
		'受け取る', //日本語
		'받기', //한국어
	]
	
	const CloseChatRulesButtonName = ['chat-rules-ok-button', ]; 
	
	var ClaimButtonClass = '';	
	var CloseChatRulesButtonClass = '';
	
	const GetClass = function (But, PressIt, ignorName) {
		
		let ButtonClass = '';
		
		const yNode = document.querySelectorAll('button');
		
		if (yNode) {
			
			let s = '';
			
			for (let i = 0; i < yNode.length; i++) {
				
				s = '';
				
				if (!ignorName) {
					s = yNode.item(i).textContent;
				}
				
				if (s == '' && yNode.item(i).attributes[1]) {
					s = yNode.item(i).attributes[1].nodeValue;
				}
				
				if (s != '' && But.includes(s)) {
					ButtonClass = '.' + yNode.item(i).classList.value.replace(/ /ig, '.');
					if (PressIt) {
						yNode.item(i).click();	
						console.log('Button "' + s + '" is pressed');
					}
					break;
				}
			}           
		}
 
		return ButtonClass;	
		
	}
	
    const GetClaimButton = () => {
 
		if (ClaimButtonClass == '') {
			ClaimButtonClass = GetClass(ClaimButtonNames, false, false);
		} 
		
		if (ClaimButtonClass != '') {
			const xNode = document.querySelector(ClaimButtonClass);
 
			if (xNode) {
				xNode.click();
				console.log('Claim drop button is pressed');
			}			
		}
		
		if (CloseChatRulesButtonClass == '') {
			CloseChatRulesButtonClass = GetClass(CloseChatRulesButtonName, true, true);
		} 
 
    };
	
	setInterval(GetClaimButton, 5000);

})();