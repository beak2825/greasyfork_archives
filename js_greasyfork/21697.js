// ==UserScript==
// @name		 [устарел] Включить новое оформление VK.com
// @version		 1.4
// @description	 Включает новое оформление ВКонтакта, с возможностью обратного перехода. Больше не работает.
// @author		 ICP
//=	=	^^^ Автор, версия и название скрипта ^^^
// @match		 *://vk.com/*
//=	=	^^^ Перехватываемые URL ^^^
// @run-at		 document-start
//=	=	^^^ Включение скрипта при старте загрузки документа ^^^
// @connect		 vk.com
// @namespace	 ICP
// @downloadURL https://update.greasyfork.org/scripts/21697/%5B%D1%83%D1%81%D1%82%D0%B0%D1%80%D0%B5%D0%BB%5D%20%D0%92%D0%BA%D0%BB%D1%8E%D1%87%D0%B8%D1%82%D1%8C%20%D0%BD%D0%BE%D0%B2%D0%BE%D0%B5%20%D0%BE%D1%84%D0%BE%D1%80%D0%BC%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20VKcom.user.js
// @updateURL https://update.greasyfork.org/scripts/21697/%5B%D1%83%D1%81%D1%82%D0%B0%D1%80%D0%B5%D0%BB%5D%20%D0%92%D0%BA%D0%BB%D1%8E%D1%87%D0%B8%D1%82%D1%8C%20%D0%BD%D0%BE%D0%B2%D0%BE%D0%B5%20%D0%BE%D1%84%D0%BE%D1%80%D0%BC%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20VKcom.meta.js
// ==/UserScript==

(function() {
//	window.stop(); // останавливаем текущую загрузку страницы
//	document.documentElement.innerHTML = null; // очищаем страницу для удаления возможных остаточных форм ввода самого vk

//	var head = document.getElementsByTagName('head')[0]; // определение действующего хеад-а, должно работать в любом браузере
//	var meta = document.createElement('meta'); // создание новго мета-тега
//	meta.httpEquiv = "Pragma"; // Имя
//	meta.content = "no-cache"; // Значение запрещающее кеширование
//	head.appendChild(meta); // вставляем метатег запрета кеширования

//	var urls = window.location.href; // получаем строку текущего URL
//	urls = /al_wall.php\?/i.test(urls)?
//		urls.replace(/(http[s]{0,1}:\/\/).*act=get_replies.*replies([^&]*).*/i, '$1new.vk.com/wall$2?offset=last&f=replies'):
//		urls.replace(/(http[s]{0,1}):\/\/vk\.com\//i, '$1://new.vk.com/');
		// замена домена на new.vk.com, а если это разворачивание комментариев
		// которое не работает из-за переадресации внутри страницы, то перейти на полный просмотр
//	var form = document.createElement('form'); // создаём пустую форму
//	form.method = 'POST'; // формат отправки данных мешающий дальнейшему редиректу
//	form.action = urls; // страница для открытия
//	head.appendChild(form); // добавляем форму на страницу
//	form.submit(); // активируем её
})();