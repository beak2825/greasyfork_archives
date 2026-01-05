// ==UserScript==
// @version			15.07.17.1122
// @name			forum.infostart.ru
// @include	        *forum.infostart.ru/*
// @description		forum.infostart.ru cleaner
// @icon			http://forum.infostart.ru/bitrix/templates/one_columns/components/bitrix/forum/infostart/images/is.png
// @grant   		none
// @homepageURL     https://greasyfork.org/ru/scripts/11020
// @supportURL      https://greasyfork.org/users/9550
// @run-at			document-start
// @namespace https://greasyfork.org/users/9550
// @downloadURL https://update.greasyfork.org/scripts/11020/foruminfostartru.user.js
// @updateURL https://update.greasyfork.org/scripts/11020/foruminfostartru.meta.js
// ==/UserScript==
// @icon64			http://forum.infostart.ru/bitrix/templates/one_columns/components/bitrix/forum/infostart/images/is.png
// @icon            
// @author          melimu
// @namespace		https://greasyfork.org/users/9550
// @match			*forum.infostart.ru/*

(function(){
	
	//var element = document.querySelector('div');
	//console.log(888,document);

	window.addEventListener('DOMContentLoaded',function(){
		
		//console.log(777);

		function remove(query) {
			var e=document.querySelectorAll(query)
			var l=e.length;
			for(var i=0;i<l;i++){
				//console.log(i,e[i]);
				e[i].parentNode.removeChild(e[i]);
			}
		}

		function removt(query,text) {
			var e=document.querySelectorAll(query)
			var l=e.length;
			for(var i=0;i<l;i++){
				if(e[i].textContent.indexOf(text)>-1){
					e[i].parentNode.removeChild(e[i]);
				}
			}
		}
		
		remove('script');
		remove('noscript');
		
		remove('div.menu-padd-fix');
		remove('div.hidden');
		remove('div#panel');
		remove('div.ur_wrp1');
		remove('div.float_line');
		
		remove('div#banner1');
		remove('div#footer');
		
		removt('div.forum-reply-header','Фотография');
		removt('div.forum-reply-fields','$m');
		removt('div.forum-reply-fields','анонимно');
		removt('div.forum-header-title','Форма ответов');
		removt('div.forum-reply-header','Добавить вознаграждение за ответ в теме');
		removt('div.forum-reply-header','Текст сообщения');
		removt('div.forum-reply-header','Опции сообщения');
		
		remove('div#anon_block');
		
		remove('div.is-forum-right-banner');
		
	},false);


})();
