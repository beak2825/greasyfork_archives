// ==UserScript==
// @name          Ru-Board_Extrim_Fix-CSS
// @namespace     https://greasyfork.org
// @description	  Портирование аналогичного функционала из Ad-Охотника в Maxthon4 и Maxthon5. Для работы с форумом Ru-Board. Экстремальная часть.
// @author        ALeXkRU
// @homepage      https://greasyfork.org/ru/scripts/409177-ru-board-extrim-fix-css
// @icon          http://forum.ru-board.com/favicon.ico
// @include       http://forum.ru-board.com/*
// @include       https://forum.ru-board.com/*
// @include       http://178.17.165.22/*
// @include       https://178.17.165.22/*
// @include       http://94.156.128.*
// @include       https://94.156.128.*
// @include       http://latestnewsofusa.org/*
// @run-at        document-start
// @license       CC BY-SA
// @version       0.20200917020007
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/409177/Ru-Board_Extrim_Fix-CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/409177/Ru-Board_Extrim_Fix-CSS.meta.js
// ==/UserScript==
	// -!! для ВКЛючения фильтра В НАЧАЛЕ СТРОКИ убрать символы // ! (два слэша, пробел, восклицательный знак)
	// -!! для ОТКЛючения фильтра перед строкой поставить // ! (два слэша, пробел, восклицательный знак)
	// -!!
	// -!! строки, начинающиеся с пробелов и знаков // -!! это комментарии. Их НЕ ТРОГАТЬ!!
	// -!!
	// -!! ===============================================================================
(function() {var css = "";
css += [
		"@namespace url(http://www.w3.org/1999/xhtml);",
		"",
		"/* Модификация структуры форума(доработка) */"
	].join("\n");
if (false || (document.domain == "ru-board.com" || document.domain.substring(document.domain.indexOf(".ru-board.com") + 1) == "ru-board.com") || (document.domain == "latestnewsofusa.org" || document.domain.substring(document.domain.indexOf(".latestnewsofusa.org") + 1) == "latestnewsofusa.org"))
	css += [
	// -!! для ВКЛючения фильтра В НАЧАЛЕ СТРОКИ убрать символы // ! (два слэша, пробел, восклицательный знак)
	// -!! для ОТКЛючения фильтра перед строкой поставить // ! (два слэша, пробел, восклицательный знак)
	// -!!
	// -!! =======   ПРАВКА  СТРУКТУРЫ   =======
	// -!!
	// -!!   смещаем логотип Ru-Board вниз, на уровень верхнего меню
	// -!!!   не работает вместе с вытянутым в строку меню!!
		" img[src=\"http://forum.ru-board.com/board/images/remake1.gif\"]{position: absolute!important; top:0px!important;}",
		" img[src=\"http://forum.ru-board.com/board/images/ru-board_ny_new.gif\"]{position: absolute!important; top:0px!important;}",
		" img[src=\"http://i.ru-board.com/images/remake1.gif\"]{position: absolute!important; top:0px!important;}",
		" img[src=\"http://i.ru-board.com/images/ru-board_ny_new.gif\"]{position: absolute!important; top:0px!important;}",
	// -!! убираем логотип Ru-Board
    // -!! Внимание! следующая строка спрячет элементы управления расширения Ru-Board++
// !		" body>table:nth-of-type(1)[width=\"95%\"][cellpadding=\"0\"][align=\"center\"]:not([cellpadding=\"3\"]){display: none !important;}",
		" img[src=\"http://forum.ru-board.com/board/images/remake1.gif\"]{display: none !important;}",
		" img[src=\"http://i.ru-board.com/images/remake1.gif\"]{display: none !important;}",
		" img[src=\"http://i.ru-board.com/images/ru-board_ny_new.gif\"]{display: none !important;}",
	// -!! убираем строку с кнопками  "Новая тема", "Создать опрос"..
		" body>table>tbody>tr>td[bgcolor=\"#dddddd\"][align=\"left\"][valign=\"middle\"]{display: none !important;}",
	// -!! ОБЛАГОРАЖИВАЕМ ВИД
	// -!!   верхнее меню -> в одну строку (требует правило в АВР)
	// -!!		" ##body>table:nth-of-type(2)>tbody>tr>td.sh1> br",
// !		" body>table:nth-of-type(2)>tbody>tr>td.sh1>a:nth-of-type(2)::after{content:\"  • \";color:#000000!important;}",
// !		" body>table:nth-of-type(2)>tbody>tr>td.sh1>a:nth-of-type(5)::after{content:\"  • \";color:#000000!important;}",
	// -!!   скрыть верхнее меню
		" body>table:nth-of-type(2)>tbody>tr>td.sh1{display: none!important;}",
	// -!!   уплотнение /скрыть пустые строки/
		" body>br+center{display: none!important;}",
		" body>br{display: none!important;}",
		" body>center>br{display: none!important;}",
		" body>center>center{display: none!important;}",
		" body>center>table[width=\"80%\"]{display: none!important;}",
		" body center a.small{display: none!important;}",
		" body p + center{display: none!important;}",
		" body br + center{display: none!important;}",
	// -!!   ширина колонки с никами/аватарами. Значение (10% - 12%) зависит от разрешения монитора!
		" table.tb td[class=\"dats\"] {width: 10% !important}",
	// -!!   обрезка длинных имён и титлов (при наведении курсора имя будет видно полностью)
// !		" a.m> b {width: 6em !important; display: inline-block !important; overflow: hidden !important;}",
// !		" a.m> b:hover {overflow: visible !important;}",
	// -!!   затеняем часть элементов вокруг поста
		" td.tpc:first-line, td.tpc> a.tpc, td.bottomline, span.tpc, a.tpc {color: #9C9C9C!important;}",
		" hr[size=\"1\"][width=\"100%\"][color=\"#9C9C9C\"]{visibility: hidden !important;}",
	// -!!   затеняем подпись
		" table[class=\"sing\"] a,table[class=\"sing\"] td {color: #9C9C9C!important;}",
	// -!!   затеняем список страниц и меню возврата при просмотре одного сообщения
		" td.small a {font-size: 8px !important;color: #9C9C9C !important;}",
		" td.small b {color: #9C9C9C !important;border-color: #9C9C9C !important;border-style: solid !important;border-top-width: 2px !important;border-right-width: 2px !important;border-bottom-width: 2px !important;border-left-width: 2px !important;}",
	// -!! !!   =====================================
	// -!!  ЭКСТРИМ!! (желающие раскомментируют нужное.. ПРАВИЛА МОГУТ РАБОТАТЬ НЕКОРРЕКТНО!
	// -!! !!   =====================================
	// -!!   первый пост/шапка свёрнут - "СПОЙЛЕР" от Zakkazak
		" body>script+table.tb>tbody>tr>td>table>tbody>tr:first-of-type{position: relative !important; display: block !important; height: 2em !important;width: 16em !important; overflow: auto !important; border-color: SlateGrey !important; border-style: solid !important;border-width: 2px !important;}",
		" body>script+table.tb>tbody>tr>td>table>tbody>tr:first-of-type:hover {height: 70em !important; width: auto !important;} ", // ! сам спойлер
		" body>script+table.tb td.tpc {position: absolute !important;}",
// !		" body>script+table.tb>tbody>tr>td>table::before {content: \"СПОЙЛЕР! Сообщение скрыто. Навести курсор для просмотра содержимого \"; color:#DA1006!important;}",
	// -!!   первый пост во всю ширину экрана  !! НЕ ВИДЕН АВТОР поста/шапки!
		" body>script+table.tb td.dats {display: none;}",
	// -!!   уменьшаем размер изображений в шапке
		" body>script+table.tb td.tpc img {max-height: 35px !important;}",
	// -!!   и возвращаем при наведении курсора
		" body>script+table.tb td.tpc img:hover {max-height: 100% !important;}",
	// -!!   подсветка и предупреждение о рекламных ссылках (СПАМ) в сообщениях
	// -!!   скрываем ссылку и подчеркиваем пунктиром
// !		" a[href^=\"http://forum.ru-board.com/\"][href$=\"/\"][target=\"_blank\"]{color:#333!important; text-decoration: none; border-bottom: 1px dashed #333 !important;}",
// !		" a[href^=\"https://forum.ru-board.com/\"][href$=\"/\"][target=\"_blank\"]{color:#333!important; text-decoration: none; border-bottom: 1px dashed #333 !important;}",
	// -!!   выделяем СПАМ-ссылку сиреневым цветом
		" a[href^=\"http://forum.ru-board.com/\"][href$=\"/\"][target=\"_blank\"]{color:#DA70D6!important;}",
		" a[href^=\"https://forum.ru-board.com/\"][href$=\"/\"][target=\"_blank\"]{color:#DA70D6!important;}",
	// -!!   добавляем предупреждение о СПАМ-ссылке
		" a[href^=\"http://forum.ru-board.com/\"][href$=\"/\"][target=\"_blank\"]:after {content: \" ( !!!СПАМ-ссылка! ОСТОРОЖНО! ..ваш Ad-Охотник)\"; color:#DA70D6!important;}",
	" a[href^=\"https://forum.ru-board.com/\"][href$=\"/\"][target=\"_blank\"]:after {content: \" ( !!!СПАМ-ссылка! ОСТОРОЖНО! ..ваш Ad-Охотник)\"; color:#DA70D6!important;}",
	// -!!   изменить размер шрифта на странице
// !		" *{font-size: 12pt!important}",
	// -!!   включаем подпись
		" input[name=\"signature\"]{color:#003399!important;\"checked\" !important;}",
	// -!!   игнор-лист: копируем строку, заменяем НИК_в_ИГНОР, удаляем ! -воскл.знак- в начале
	// -!! ! a.tpc[href$="НИК_в_ИГНОР"] ~ .post",
	// -!!   НОСТАЛЬГИЯ     (как в Maxthon2 + плагин R2)
	// -!!   стиль поля ввода
// !		" textarea{background-color:#003399!important;color:#FFFFFF!important;font-weight:bold!important;}",
	// -!!   размер поля ввода
		" textarea{height: 170px!important;width: 1000px!important;}",
	// -!! следующую строку НЕ ТРОГАТЬ!
		" "
	// -!! === конец фильтра ===
	// -!!
	// -!! дальше - ничего не менять
	// -!!
	].join("\n");
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
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
})();