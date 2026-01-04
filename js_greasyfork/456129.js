// ==UserScript==
// @name        Unreal contests Lolzteam
// @namespace   unreal_contests_lolz
// @match       https://zelenka.guru/threads/*
// @grant       none
// @version     1.0
// @author      its_niks
// @icon        https://zelenka.guru/favicon.ico
// @description Скрипт для "увеличения шансов" в розыгрышах
// @downloadURL https://update.greasyfork.org/scripts/456129/Unreal%20contests%20Lolzteam.user.js
// @updateURL https://update.greasyfork.org/scripts/456129/Unreal%20contests%20Lolzteam.meta.js
// ==/UserScript==

var element = document.querySelector('body > div.breadBoxTop > div > nav > fieldset > span > span:nth-child(4) > a > span');

var local_twisted_contests = localStorage['twisted_contests']
if(local_twisted_contests){
	twisted_contests = localStorage['twisted_contests'].split(',')
} else {
	twisted_contests = []
};

if(element) {
	if (element.textContent == 'Розыгрыши'){
		var thread_id = document.getElementsByClassName('item messageDateHeader datePermalink hashPermalink OverlayTrigger muted')[0].href.split('/')[4];
		if(twisted_contests.indexOf(thread_id) == -1){
			var podkrut = document.createElement('a');
			podkrut.className = "LztContest button mn-15-0-0 primary";
			podkrut.id = 'twisted_contest_button'
			podkrut.href= "javascript:void(null);";
			podkrut.textContent = "Подкрутить";

			var container = document.getElementsByClassName('ContestCaptcha mn-15-0-0')[0];
			if(container){
				container.insertBefore(podkrut, container.lastChild);}
		}

	}
};

$("#twisted_contest_button").on('click', function (){
	var random_num = Math.floor(Math.random() * 3);

	if(random_num === 1) {
		XenForo.alert('Подкрутка была успешно активирована...', 'Admin Menu #'+(Math.random() + 1).toString(36).substring(2));
		podkrut.remove();
		twisted_contests.push(thread_id);
		localStorage['twisted_contests'] = twisted_contests
	}
	else { XenForo.alert('Увы. Этот розыгрыш неудачный.', 'Admin Menu #'+(Math.random() + 1).toString(36).substring(2));
		podkrut.remove();
		twisted_contests.push(thread_id);
		localStorage['twisted_contests'] = twisted_contests;
	};
});