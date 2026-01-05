// ==UserScript==
// @name        GA members link
// @namespace   glav.su
// @description Модифицирует все ссылки-ники пользователей, с тем чтобы они сразу вели на страницу "Сообщения" в профиле пользователя.
// @include     http://glav.su/*
// @include     https://glav.su/*
// @version     1.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25890/GA%20members%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/25890/GA%20members%20link.meta.js
// ==/UserScript==
/* Значение переменной default_page можно изменить, чтобы ссылки-ники сразу вели на:
'messages'	- раздел СООБЩЕНИЯ
'profile'	- раздел ПРОФИЛЬ
'follows'	- раздел ЧИТАЕМЫЕ
'followers'	- раздел ЧИТАТЕЛИ
*/
var default_page = 'messages';
$('a[href^="'+APP_URL+'/members/"]').each(function(ax,a){
	if( (href=$(a).attr('href')).match(/.*?\/members\/\d+\/$/) && !$(a).hasClass("cMenuItemHome") ){
		$(a).attr({ 'href': href + default_page, 'target': "_blank" }).removeAttr('onclick');
	}
});