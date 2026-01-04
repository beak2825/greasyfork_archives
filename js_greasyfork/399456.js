// ==UserScript==
// @name         Google Play Casino Abuse
// @namespace    Casino, Google Play
// @version      1.0
// @description  Жалоба на казино в Google Play
// @author       BaNru
// @match        https://play.google.com/store/apps/details?id*
// @match        https://support.google.com/googleplay/android-developer/contact/takedown
// @match        https://support.google.com/googleplay/contact/rap_family
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399456/Google%20Play%20Casino%20Abuse.user.js
// @updateURL https://update.greasyfork.org/scripts/399456/Google%20Play%20Casino%20Abuse.meta.js
// ==/UserScript==

(function() {
    'use strict';

	var AbuseText = 'CASINO! Запрещенное казино с возрастными ограничениями 3+, не в той категории и размещение рекламы в семейных приложениях. Фейковое название. Накрученные отзывы.';

    if(/details/.test(window.location.href)){
		var btn = document.createElement('span');
		btn.textContent = '⚠️';
		btn.style = "color:#c00;cursor:pointer;padding:0 8px;float:right;";
		var id = window.location.search.split('=')[1];
		var name = document.querySelector('h1').textContent;
		btn.onclick = ()=>{
			window.open('https://support.google.com/googleplay/android-developer/contact/takedown#'+id, '_blank').focus();
			window.open('https://support.google.com/googleplay/contact/rap_family#'+id+'|'+name, '_blank').focus();
		}
		document.querySelector('h1').appendChild(btn);
	}

	if(/takedown/.test(window.location.href)){
		document.querySelector('#reason_for_flagging--gambling').click()
		document.querySelector('#details_flag_text').value = AbuseText;
		document.querySelector('#in_store--Yes').click();
		document.querySelector('#country').value = '';
		document.querySelector('#appid').value = window.location.hash.substring(1);
	}

	if(/rap_family/.test(window.location.href)){
		// О каком типе контента Вы хотите сообщить? - Игры и приложения для всей семьи
		document.querySelector('#type').value = 'apps';
		// Кто Вы? - Пользователь Google Play
		document.querySelector('#best_describes').value = 'google_play_user';
		// Ваша жалоба касается приложения для детей или для всей семьи? - Да
		document.querySelector('#flagging--yes').click();

		var h = window.location.hash.substring(1).split('|');
		// Название контента
		document.querySelector('#title').value = decodeURI(h[1]);
		// Ссылка на приложение в Google Play
		document.querySelector('#link').value = 'https://play.google.com/store/apps/details?id='+h[0];

		// Где именно Вы заметили нарушение? - В контенте приложения
		document.getElementById('problem--in-app content').click();
		// В чем заключается проблема с контентом в приложении? - Приложение пропагандирует противозаконные действия
		document.querySelector('#problem_inapp_content--illegal').click();
		// Опишите проблему как можно подробнее.
		document.querySelector('#describe').value = AbuseText;
	}
})();