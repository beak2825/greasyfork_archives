// ==UserScript==
// @name		 [alpha] Убрать новый дизайн VK.com (CSS)
// @version		 2.5.41
// @description	 Удаляем новое оформление ВКонтакта, возвращая старый дизайн. (Тест версии css из сети)
// @author		 ICP
//=	=	^^^ Автор, версия и название скрипта ^^^
// @match		 *://vk.com/*
//=	=	^^^ Перехватываемые URL ^^^
// @exclude		 *://vk.com/notifier.php*
// @exclude		 *://vk.com/al_*
// @exclude		 *://vk.com/upload_fails.php
// @exclude		 *://vk.com/ads_rotate.php*
// @exclude		 *://vk.com/share.php*
//=	=	^^^ Исключённые URL, перехват которых запрещён ^^^
// @run-at		 document-end
// @grant		 GM_xmlhttpRequest
//=	=	^^^ Включение скрипта при старте загрузки документа ^^^
// @connect		 userstyles.org
// @namespace		 ICP
// @require      http://code.jquery.com/jquery-3.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/21529/%5Balpha%5D%20%D0%A3%D0%B1%D1%80%D0%B0%D1%82%D1%8C%20%D0%BD%D0%BE%D0%B2%D1%8B%D0%B9%20%D0%B4%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD%20VKcom%20%28CSS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/21529/%5Balpha%5D%20%D0%A3%D0%B1%D1%80%D0%B0%D1%82%D1%8C%20%D0%BD%D0%BE%D0%B2%D1%8B%D0%B9%20%D0%B4%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD%20VKcom%20%28CSS%29.meta.js
// ==/UserScript==
(function() {
  console.time('Инициализация и загрузка CSS.');
  document.querySelector("link[rel*='icon']").href = "http://vkontakte.ru/images/favicon.ico"; // замена иконки VK на привычное В
  unsafeWindow.setFavIcon = function(sup){ // Перехватываем и заменяем иконку сайта, если требуется (меняем только основную, остальные логируем)
	return function() {
	  if (arguments[0].search(/\/fav_logo\.ico/i) != -1) {
		debugLog("Подменяем - "+arguments[0]);
		arguments[0]="http://vkontakte.ru/images/favicon.ico";
	  } else debugLog("Без замены - "+arguments[0]);
	return sup.apply(this, arguments);
	};
  }(setFavIcon);

  unsafeWindow.addEvent = function(sup){ // При обновлении контекста страницы должно проверять на нужность сжатия колонки, при обновлении страницы внедриться и сработать не успеваеттрогаю)
	return function() {
	  if (arguments[1] === 'blur' && arguments[0] instanceof HTMLDivElement)
	  {
		FindCont = inWin("div.page_gif_large[ResMin!=true], div.page_album_wrap[ResMin!=true], div.reply_text div.page_post_sized_thumbs[ResMin!=true], div.copy_quote > div.page_post_sized_thumbs[ResMin!=true], div._wall_post_cont > div.page_post_sized_thumbs[ResMin!=true], div._wall_post_cont > div.page_post_thumb_wrap[ResMin!=true]");
		for(var i=0;i<FindCont.length;i++) {
		  var Factor=FindCont[i].parentNode.offsetWidth/FindCont[i].offsetWidth;
		  zWin(FindCont[i], Factor+0.01);
		  $("div[ResMin!=true],a[ResMin!=true]", FindCont[i]).each(function() {
			var inCont = this;
			zWin(inCont, Factor);
			return true;
		  });
		}
	  }
	return sup.apply(this, arguments);
	};
  }(addEvent);

  var addCSS = function () {/*
body {
	background: #FFFFFF; // Выбеливаем фон
}

body:before {
	color: rgba(0,0,0,.20); // Изменение цвета объявленной альфы на чёрный, с прозрачностью 80%
}


.ui_search {
	padding: 7px 7px 7px;
	margin: 1px; // форма ввода поиска
}

.im-page.im-page_classic .im-page--dcontent {
	padding-top: 17px; // Смещение списка диалогов, был частично закрыт даже при пустом баре
}

.page_square_photo {
	width: 150px;
	margin-left: 0px; // стыковка фотостатусов в единый блок
}

.nim-dialog:not(.nim-dialog_deleted).nim-dialog_unread.nim-dialog_classic {
	background: #85f78a; // Изменение фоновой подсветки непрочитанных диалогов
}

.nim-dialog.nim-dialog_unread .nim-dialog--unread {
	display: block !important;
	border-radius: 5px;
	background: #72b693; // Кол-во непрочитанных
}

.nim-dialog.nim-dialog_unread-out:not(.nim-dialog_failed) .nim-dialog--unread {
	display: block !important;
	background: rgba(200,147,173,.9);
	border-radius: 50% !important; // Знак непрочитанного своего
}

.nim-dialog.nim-dialog_unread-out:not(.nim-dialog_failed) .nim-dialog--text-preview {
	background: rgba(200,255,200,.9); // Фон непрочитанного своего
}

.wide_column_left .narrow_column_wrap {
	position: fixed; // Оформление групп
}

.ui_rmenu {
	width: 607px; // калибровка верхнего меню настроек
}

.wide_column_left .narrow_column_wrap {
	position: relative; // включена навигация настроек (автор почему-то её выключил)
}

.scroll_fix {
	overflow-x: overlay; // Если страница не помещается (приложения), дать горизонтальный скролл
}

._im_ui_peers_list {
	display: block; // Восстанавливаю панель открытых диалогов. Которую зачем-то скрыли в .44
}

.im-page_history-show + .im-right-menu ._im_ui_peers_list {
	top: 35px; // Смещение панели открытых на подходящее место внутри диалога
}

.im-page.im-page_classic .im-page--header-chat {
	height: 0; // Убираем сделанный невидимым - блок шапки, руки надо отрывать за такую вёрстку.
}

.im-page .im-page--header-inner {
	height: 0; // И второй
}

.page_square_photo {
	background-size: 99px;
	width: 99px;
	height: 99px;
	zoom: 1;
	-moz-transform: scale(1); // Исправляем масштабирование фотостатусов на странице
}

.im-mess-stack .im-mess-stack--content .im-mess-stack--pname {
	top: 0px;
	padding-top: 11px;
	height: 0px; // Исправление контейнера сообщения диалога
}

.im-dialog-select .im-dialog-select--btn, #ui_rmenu_fav {
	height: 13px; // Исправление размеров кнопок зведы сплюсом.
}

.im-dialog-select .im-dialog-select--btn, #ui_rmenu_fav {
	padding: 6px 16px 7px; // Исправление размеров кнопок зведы сплюсом.
}

.im-create .im-create--dcontent {
	width: 100% !important; // Ширина списка добавляемых в беседу
}

.im-create.im-create_classic .im-create--dcontent .ui_scroll_content {
	width: 103%;
	margin-left: -1%;
  -webkit-column-count: 2;
  -webkit-column-gap: 1px;
     -moz-column-count: 2;
     -moz-column-gap: 1px;
          column-count: 2;
          column-gap: 1px; // Два столбца для +, по порядку (пары строк) - размеры, Chrome и Safari 3, Firefox 3.5+, Opera 11+ и новые
}

.page_post_sized_thumbs, .post_thumbed_media {
	zoom: 100%;
	-moz-transform: scale(1);
	-moz-transform-origin: left center; // Подключил масштабирование, отключаю зум глючный
}

#public .narrow_column.fixed, #group .narrow_column.fixed, #profile .narrow_column.fixed {
	position: absolute !important; // Что-б не мешал расширению столбца контекста.
}

.img_small {
	margin: 0 2px 3px 0 !important;
	padding-top: 0px; // Изменение шаблона для уменьшенных
}

.wall_post_tex {
	width: auto; // фикс ширины текстовой части при расширении
}
/* Окончание добавленного CSS*/}.toString().slice(15,-1); // Добавление многострочной переменной, для редактирования и изменения подключаемого стиля.

  GM_xmlhttpRequest({ // Загрузка CSS
	method: "GET", // Метод
	url: 'http://userstyles.org/styles/128986.css', // Адрес
	onload: function(event) { // Если получен
	  console.timeEnd('Инициализация и загрузка CSS.'); // Значение секундомера в лог
	  console.time('Формирование и вставка CSS');
	  var VK_CURRENT_CSS_CODE = event.responseText.slice(32,-1); // Отделяем чистый CSS
	  VK_CURRENT_CSS_CODE = VK_CURRENT_CSS_CODE.replace(/(body:before[\s\S]{1,10}content:.{1,10}alpha).{0,50}(";|';)/i, '$1$2'); // чистим избыточную инфу
	  VK_CURRENT_CSS_CODE = VK_CURRENT_CSS_CODE.replace(/(@-moz-document.*)/i, '/*$1*/'); // Стайлесный хлам
	  VK_CURRENT_CSS_CODE = VK_CURRENT_CSS_CODE.replace(/{\s?/g, ' {\n\t'); // восстанавливаем после минимизации - оформляем начала правил
	  VK_CURRENT_CSS_CODE = VK_CURRENT_CSS_CODE.replace(/;(?!base64)/g, ';\n\t'); // восстанавливаем после минимизации - разделяем строки
	  VK_CURRENT_CSS_CODE = VK_CURRENT_CSS_CODE.replace(/(})\s?/g, ';\n$1\n\n'); // восстанавливаем после минимизации - завершение правила
	  VK_CURRENT_CSS_CODE = VK_CURRENT_CSS_CODE.replace(/(.*:)(?!image\/)(.*;)/g, '$1 $2'); // восстанавливаем после минимизации - отделяем значение
	  var head = document.getElementsByTagName('html')[0]; // определение действующего html-а, должно работать в любом браузере
	  var styleElement = document.createElement("style"); // Создайм стиль
	  styleElement.type = 'text/css'; // Тип
	  styleElement.appendChild(document.createTextNode('/*--- Применение старого стиля ---*/\n'+VK_CURRENT_CSS_CODE+"\n"+addCSS)); // Собираем вместе
	  head.appendChild(styleElement); // вставляем метатег внешнего стиля
	  console.timeEnd('Формирование и вставка CSS'); // Значение секундомера в лог
	  debugLog('Стиль добавлен! - '+window.location.href); // Рапортуем в лог с указанием URL функцией ВК, с указанием тайм-лайн кода.
	}
  });

  var nonZoom = true;
  var Factor,FindCont;
  document.onscroll = function () { // Сравнение высоты и прокрутки, расширение/сужение если требуется, где надо
	var cc=ge("narrow_column");
	if (!cc) return;
 	if (cur.module=="profile" || cur.module=="groups" || cur.module=="public" || cur.module=="event") cc.setAttribute("style", "display: fixed;");
	if (cc.offsetHeight && (cur.module=="profile" || cur.module=="groups" || cur.module=="public" || cur.module=="event")) {
	  if(cc.offsetHeight<=-cc.getBoundingClientRect().top) {
		if (nonZoom) {
		  ge("wide_column").style.width="597px";
		  nonZoom = false;
		  $("[ResMin=true]").each(function() {zWin(this, 1);});
		}
	  } else if (!nonZoom) {
		ge("wide_column").style.width="397px";
		nonZoom = true;
		$("div.page_gif_large[ResMin=false], div.page_album_wrap[ResMin=false], div.reply_text div.page_post_sized_thumbs[ResMin=false], div.copy_quote > div.page_post_sized_thumbs[ResMin=false], div._wall_post_cont > div.page_post_sized_thumbs[ResMin=false], div._wall_post_cont > div.page_post_thumb_wrap[ResMin=false]").each(function() {
		  for(var i=0;i<FindCont.length;i++) {
			var Factor=this[i].parentNode.offsetWidth/this[i].offsetWidth;
			zWin(this[i], Factor+0.01);
			$("[ResMin=false]", this[i]).each(function() {
			  var inCont = this;
			  zWin(inCont, Factor);
			  return true;
			});
		  }
		});
	  }
	  if (nonZoom) {
		FindCont = inWin("div.page_gif_large[ResMin!=true], div.page_album_wrap[ResMin!=true], div.reply_text div.page_post_sized_thumbs[ResMin!=true], div.copy_quote > div.page_post_sized_thumbs[ResMin!=true], div._wall_post_cont > div.page_post_sized_thumbs[ResMin!=true], div._wall_post_cont > div.page_post_thumb_wrap[ResMin!=true]");
		for(var i=0;i<FindCont.length;i++) {
		  var Factor=FindCont[i].parentNode.offsetWidth/FindCont[i].offsetWidth;
		  zWin(FindCont[i], Factor+0.01);
		  $("div[ResMin!=true],a[ResMin!=true]", FindCont[i]).each(function() {
			var inCont = this;
			zWin(inCont, Factor);
			return true;
		  });
		}
	  }
	  return;
	}
  };

  function zWin(c, Factor) {
	if (c.matches('div[class *= video]')) return;
	if (c.getAttribute('ResMin') !== nonZoom || (nonZoom && c.getAttribute('ResMin') !== false))
	if(Factor<1) {
	  var w, h;
	  if(!c.hasAttribute("OiginalSize")) {
		w=c.offsetWidth;
		h=c.offsetHeight;
		c.setAttribute("OiginalSize", w+","+h);
	  } else {
		sz=c.getAttribute("OiginalSize").split(",");
		w=parseInt(sz[0]);
		h=parseInt(sz[1]);
	  }
	  c.setAttribute("ResMin", true);
	  c.style.width=Math.round(w*Factor)+"px";
	  c.style.height=Math.round(h*Factor)+"px";
	  c.classList.add("img_small");
	} else if(c.hasAttribute("OiginalSize")) {
	  sz=c.getAttribute("OiginalSize").split(",");
	  c.style.width=sz[0]+"px";
	  c.style.height=sz[1]+"px";
	  c.setAttribute("ResMin", false);
	  c.classList.remove("img_small");
	}
  }

  setTimeout(function(){
	FindCont = inWin("div.page_gif_large[ResMin!=true], div.page_album_wrap[ResMin!=true], div.reply_text div.page_post_sized_thumbs[ResMin!=true], div.copy_quote > div.page_post_sized_thumbs[ResMin!=true], div._wall_post_cont > div.page_post_sized_thumbs[ResMin!=true], div._wall_post_cont > div.page_post_thumb_wrap[ResMin!=true]");
	for(var i=0;i<FindCont.length;i++) {
	  var Factor=FindCont[i].parentNode.offsetWidth/FindCont[i].offsetWidth;
	  zWin(FindCont[i], Factor+0.01);
	  $("div[ResMin!=true],a[ResMin!=true]", FindCont[i]).each(function() {
		var inCont = this;
		zWin(inCont, Factor);
		return true;
	  });
	}
  }, 1000);

})();

function inWin(s) {
  var scrollTop = $(window).scrollTop()<500?0:$(window).scrollTop()-500;
  var windowHeight = $(window).height()+1000;
  var currentEls = $(s);
  var result = [];
  currentEls.each(function(){
    var el = $(this);
    var offset = el.offset();
    if(scrollTop <= offset.top && (el.height() + offset.top) < (scrollTop + windowHeight))
      result.push(this);
  });
  return $(result);
}