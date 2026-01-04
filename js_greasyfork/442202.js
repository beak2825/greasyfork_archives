// ==UserScript==
// @name          Кастомизация профиля Lolzteam
// @description	  Бесплатные уник, лычка и фон в профиле от MALWARE
// @author        MALWARE
// @homepage      https://t.me/notmalware/
// @include       http://lolz.guru/*
// @include       https://lolz.guru/*
// @include       http://*.lolz.guru/*
// @include       https://*.lolz.guru/*
// @grant         GM_addStyle
// @version       2.1
// @license MIT
// @icon          https://lolz.guru/favicon.ico
// @namespace     https://greasyfork.org/users/894312
// @downloadURL https://update.greasyfork.org/scripts/442202/%D0%9A%D0%B0%D1%81%D1%82%D0%BE%D0%BC%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F%20%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8F%20Lolzteam.user.js
// @updateURL https://update.greasyfork.org/scripts/442202/%D0%9A%D0%B0%D1%81%D1%82%D0%BE%D0%BC%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F%20%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D1%8F%20Lolzteam.meta.js
// ==/UserScript==
var unik = 'text-shadow: 3px 4px 6px rgba(164, 189, 192, 0.6), 1px 5px 7px rgba(109, 129, 246, 0.1), 2px 2px 1px rgba(6, 38, 175, 0.9), 3px 4px 4px rgba(119, 130, 41, 0.8), 3px 2px 9px rgba(238, 199, 227, 0.5), 6px 1px 1px rgba(233, 75, 160, 0.5), 5px 2px 2px rgba(238, 234, 240, 0.6), 1px 3px 3px rgba(97, 196, 37, 0.7), 4px 2px 6px rgba(223, 204, 60, 0.4), 5px 5px 3px rgba(157, 116, 68, 0.8); background: radial-gradient(circle 45px, rgb(205, 68, 72) 33%, rgb(229, 142, 61) 48%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;'; //Вставьте сюда стиль уника В ОДНУ СТРОКУ! (просто уберите новые строки)
var lichka = 'background: linear-gradient(135deg, #a67ce0, #f39ede, #edd2e1, #bae5ea, #8eb6fc, #a680e3); color: #000;text-shadow: 0px 0px 1px #fff, 0px 0px 3px #fff, 0px 0px 5px #fff'; //Вставьте сюда стиль лычки
var lichka_text = 'Пример'; //Вставьте сюда текст лычки
var background_url = 'https://media.discordapp.net/attachments/814830535402455062/961326658386817034/unknown.png'; //Вставьте сюда ссылку на фон профиля
var short_url = 'example'; //Вставьте сюда ваш адрес профиля (не ник!). Если у вас его нет, не изменяйте.
var member_id = '916895'; //Вставьте сюда ваш ID. Узнать тут: https://lolz.guru/account/personal-details
//Подробнее в моей статье: https://lolz.guru/threads/3692187/



//Больше ничего редактировать не нужно!
var css = [
    'a[href="'+short_url+'/"] {'+unik+'}',
    'a[href="https://lolz.guru/members/'+member_id+'/"] {'+unik+'}',
    'a[href="members/'+member_id+'/"] {'+unik+'}',
    'a[href="malware/"] {background: linear-gradient(1000000deg, #0070FF , #FFA500); -webkit-background-clip: text; -webkit-text-fill-color: transparent;}',
    'a[href="https://lolz.guru/members/3985842/"] {background: linear-gradient(1000000deg, #0070FF , #FFA500); -webkit-background-clip: text; -webkit-text-fill-color: transparent;}',
    'a[href="members/3985842/"] {background: linear-gradient(1000000deg, #0070FF , #FFA500); -webkit-background-clip: text; -webkit-text-fill-color: transparent;}',
    'li[data-author="Реклама"] {display: none;}',
    '.text_Ads.mn-0-0-15 {display: none;}',
    '.section.monthMaecenas {display: none;}',
    'a[href="https://xenforo.com"] {display: none;}',
    '.hasUnreadArticles {display: none;}',
    '.panel.Notice.DismissParent.notice_34 {display: none;}'
    ].join("\n");
(function() {
    'use strict';
if ((short_url == 'example') & (member_id == '916895')) {
    css+=('.Popup {display:none}');
    var warning_element = document.createElement('li');
    warning_element.innerHTML = '<a href="https://lolz.guru/threads/3736719/" style="background-color: red;">СКРИПТ НУЖНО НАСТРОИТЬ!</a>';
    document.getElementsByClassName('secondaryContent blockLinksList')[0].appendChild(warning_element);
}
else {
    css+=('b[id="NavigationAccountUsername"] {'+unik+'}');
}
if ((window.location.href == "https://lolz.guru/"+short_url+"/") || (window.location.href == "https://lolz.guru/members/"+member_id+"/")) {
    css+=('.page_top .username {'+unik+'}');
    css+=('body {background-image: linear-gradient(rgba(54, 54, 54, 0.5), rgba(54, 54, 54, 0.5)), url('+background_url+')}');
    var lichka_element = document.createElement('div');
    lichka_element.innerHTML = '<em style="'+lichka+'" class="userBanner wrapped" itemprop="title"><span class="before"></span><strong>'+lichka_text+'</strong><span class="after"></span></em>';
    document.getElementsByClassName('avatarScaler')[0].appendChild(lichka_element);
}
if ((window.location.href == "https://lolz.guru/malware/") || (window.location.href == "https://lolz.guru/members/3985842/")) {
    css+=('.page_top .username {background: linear-gradient(1000000deg, #0070FF , #FFA500); -webkit-background-clip: text; -webkit-text-fill-color: transparent;}');
    css+=('body {background-image: linear-gradient(rgba(54, 54, 54, 0.5), rgba(54, 54, 54, 0.5)), url(https://media.discordapp.net/attachments/814830535402455062/961315570060521492/unknown.png)}');
    var malw_lichka_element = document.createElement ('div');
    malw_lichka_element.innerHTML = '<em style="background: linear-gradient(13deg, #0000FF , #FFA500)" class="userBanner wrapped" itemprop="title"><span class="before"></span><strong>Скачать</strong><span class="after"></span></em>';
    document.getElementsByClassName('avatarScaler')[0].appendChild(malw_lichka_element);
}
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		document.documentElement.appendChild(node);
	}
}
})();
