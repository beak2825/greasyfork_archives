// ==UserScript==
// @name         Кураторы Форума ЖБ скрипт Black Russia.
// @namespace    https://forum.blackrussia.online
// @version      1.2.4.2
// @description  Обновление 1.2.4 - добавлено: три кнопки для отказа жалоб по различным причинам.
// @author       R.Lokamp
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license    MIT
// @icon         http://postimg.su/image/BztXCdkf/image.png
// @downloadURL https://update.greasyfork.org/scripts/530367/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%D0%96%D0%91%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20Black%20Russia.user.js
// @updateURL https://update.greasyfork.org/scripts/530367/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%D0%96%D0%91%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20Black%20Russia.meta.js
// ==/UserScript==

(function () {
  'use strict';
const ВАЖНО = 1;
const НАРАССМОТРЕНИИ = 2;
const ОТКАЗАНО = 4;
const РЕАЛИЗОВАНО = 5;
const РЕШЕНО = 6;
const ЗАКРЫТО = 7;
const ОДОБРЕНО = 8;
const РАССМОТРЕНО = 9;
const КОМАНДЕПРОЕКТА = 10;
const СПЕЦАДМИНУ = 11;
const ГЛАВНОМУАДМИНУ = 12;
const ТЕХСПЕЦУ = 13;
const ОЖИДАНИЕ = 14;
const ПРОВЕРЕНОКК = 15;
const buttons = [
     {
      title: 'Отказано, закрыто',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Убедительная просьба ознакомиться с [U][B][url=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/]правилами подачи жалоб[/url][/U][/B].[/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#ec0000][FONT=GEORGIA][CENTER]Отказано & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ЗАКРЫТО,
	  status: false,
    },
    {
      title: 'Одобрено, закрыто',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по надлежащему пункту.[/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	 status: false,
    },
    {
      title: 'На рассмотрении...',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Ваша жалоба находится на рассмотрении, просьба не создавать дублирующие темы.[/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#ffd100][FONT=GEORGIA][CENTER]Закрыто & На рассмотрении.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: НАРАССМОТРЕНИИ,
	  status: false,
    },
    {
     title: '- - - - - -  - - - - - - - - -  - - - - - - - - - - - - - - - - - Отказанные жалобы - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
     {
      title: 'нет нарушений',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]На предоставленных вами доказательствах, нарушений со стороны игрока нет.<br>Убедительная просьба ознакомиться с [U][B][url=https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/]общими правилами серверов[/url][/U][/B].[/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#ec0000][FONT=GEORGIA][CENTER]Отказано & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ЗАКРЫТО,
	  status: false,
    },
     {
      title: 'нет доказательств',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]В данной жалобе не были прикреплены доказательства о нарушении со стороны игрока.<br>Убедительная просьба ознакомиться с [U][B][url=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/]правилами подачи жалоб[/url][/U][/B].[/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#ec0000][FONT=GEORGIA][CENTER]Отказано & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОТКАЗАНО,
	  status: false,
    },
     {
      title: 'нужен фрапс',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Для нарушений подобного типа требуется видеофиксация (фрапс).<br>Убедительная просьба ознакомиться с [U][B][url=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/]правилами подачи жалоб[/url][/U][/B].[/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#ec0000][FONT=GEORGIA][CENTER]Отказано & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОТКАЗАНО,
	  status: false,
    },
     {
      title: 'недостаточно док-в',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Прикреплённых вами доказательств недостаточно для выдачи наказания.<br>Убедительная просьба ознакомиться с [U][B][url=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/]правилами подачи жалоб[/url][/U][/B].[/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#ec0000][FONT=GEORGIA][CENTER]Отказано & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОТКАЗАНО,
	  status: false,
    },
     {
      title: 'мат/оск в жалобе',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]В вашей жалобе содержаться оскорбления или матерные выражения.<br>Убедительная просьба ознакомиться с [U][B][url=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/]правилами подачи жалоб[/url][/U][/B].[/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#ec0000][FONT=GEORGIA][CENTER]Отказано & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОТКАЗАНО,
	  status: false,
    },
     {
      title: 'повторная жалоба',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]На данную жалобу уже был дан ответ в предыдущей теме или она находится на рассмотрении.<br>Убедительная просьба ознакомиться с [U][B][url=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/]правилами подачи жалоб[/url][/U][/B].[/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#ec0000][FONT=GEORGIA][CENTER]Отказано & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ЗАКРЫТО,
	  status: false,
    },
     {
      title: 'поддельные док-ва',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]В вашей жалобе прикреплены поддельные доказательства.<br>Убедительная просьба ознакомиться с [U][B][url=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/]правилами подачи жалоб[/url][/U][/B].[/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#ec0000][FONT=GEORGIA][CENTER]Отказано & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ЗАКРЫТО,
	  status: false,
    },
     {
      title: 'прошло 3 дня',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]С момента нарушения игрока прошло более 72 часов.<br>Убедительная просьба ознакомиться с [U][B][url=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/]правилами подачи жалоб[/url][/U][/B].[/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#ec0000][FONT=GEORGIA][CENTER]Отказано & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ЗАКРЫТО,
	  status: false,
    },
     {
      title: 'Жалоба от 3-го лица',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Ваша жалоба написана от 3-го лица, не причастного к конфликту.<br>Убедительная просьба ознакомиться с [U][B][url=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/]правилами подачи жалоб[/url][/U][/B].[/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#ec0000][FONT=GEORGIA][CENTER]Отказано & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ЗАКРЫТО,
	  status: false,
    },
     {
      title: 'OFFTOP',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Ваша тема создана без смысловой нагрузки или фактической жалобы.<br>Убедительная просьба ознакомиться с [U][B][url=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/]правилами подачи жалоб[/url][/U][/B].[/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#6eff3c][FONT=GEORGIA][CENTER]Рассмотрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: РАССМОТРЕНО,
	  status: false,
    },
     {
      title: 'неуказан nickname нарушителя/автора жалобы',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]В вашей жалобе неуказан игровой NickName нарушителя или автора жалобы.<br>Убедительная просьба ознакомиться с [U][B][url=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/]правилами подачи жалоб[/url][/U][/B].[/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#ec0000][FONT=GEORGIA][CENTER]Отказано & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОТКАЗАНО,
	  status: false,
    },
     {
      title: 'Монтаж на доказательствах',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]На ваших доказательствах были использованы средства монтажа, обрезки и т.д.<br>Убедительная просьба ознакомиться с [U][B][url=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/]правилами подачи жалоб[/url][/U][/B].[/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#ec0000][FONT=GEORGIA][CENTER]Отказано & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОТКАЗАНО,
	  status: false,
    },
     {
      title: 'Ошиблись сервером',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Ваша жалоба не имеет отношения к специфике данного раздела.<br>Нарушение совершено на другом сервере.[/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#6eff3c][FONT=GEORGIA][CENTER]Рассмотрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: РАССМОТРЕНО,
	  status: false,
    },
     {
      title: 'Ошиблись разделом',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Ваша жалоба не имеет отношения к специфике данного раздела.<br>Возможно вы ошиблись разделом.[/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#6eff3c][FONT=GEORGIA][CENTER]Рассмотрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: РАССМОТРЕНО,
	  status: false,
    },
     {
      title: 'Жалоба на АП (не нарушение общих правил)',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Ваша жалоба не имеет отношения к специфике данного раздела.<br>Обратитесь в раздел жалоб на [color=#9ee572]Агентов Поддержки[/color].[/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#6eff3c][FONT=GEORGIA][CENTER]Рассмотрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: РАССМОТРЕНО,
	  status: false,
    },
     {
      title: 'Жалоба на Лд (не нарушение общих правил)',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Ваша жалоба не имеет отношения к специфике данного раздела.<br>Обратитесь в раздел жалоб на [color=#3c92ff]Лидеров[/color].[/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#6eff3c][FONT=GEORGIA][CENTER]Рассмотрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: РАССМОТРЕНО,
	  status: false,
    },
     {
      title: 'Жалоба на Адм',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Ваша жалоба не имеет отношения к специфике данного раздела.<br>Обратитесь в раздел жалоб на [color=#e20000]Администрацию[/color].[/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#6eff3c][FONT=GEORGIA][CENTER]Рассмотрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: РАССМОТРЕНО,
	  status: false,
    },
     {
      title: 'не логируется',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Нарушение, указанное в жалобе, не логируется и проверить мы его не можем.<br>Приносим извенения за доставленные неудобства.[/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#ec0000][FONT=GEORGIA][CENTER]Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ЗАКРЫТО,
	  status: false,
    },
     {
      title: 'не по форме',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться с [U][B][url=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/]правилами подачи жалоб[/url][/U][/B].[/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#ec0000][FONT=GEORGIA][CENTER]Отказано & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОТКАЗАНО,
	  status: false,
    },
     {
      title: 'нет условий сделки',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]В ваших доказательствах отсутствуют условия сделки.<br>Убедительная просьба ознакомиться с [U][B][url=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/]правилами подачи жалоб[/url][/U][/B].[/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#ec0000][FONT=GEORGIA][CENTER]Отказано & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОТКАЗАНО,
	  status: false,
    },
     {
      title: 'нет /time',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]На предоставленных вами доказательствах отсутствует /time.<br>Убедительная просьба ознакомиться с [U][B][url=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/]правилами подачи жалоб[/url][/U][/B].[/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#ec0000][FONT=GEORGIA][CENTER]Отказано & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОТКАЗАНО,
	  status: false,
    },
     {
      title: 'фотохостинги',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Доказательства должны быть загружены на определённые фотохостинги: YouTube, Япикс, Imgur.<br>Убедительная просьба ознакомиться с [U][B][url=https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/]правилами подачи жалоб[/url][/U][/B].[/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#ec0000][FONT=GEORGIA][CENTER]Отказано & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОТКАЗАНО,
	  status: false,
    },
    {
     title: '- - - - - -  - - - - - - - - -  - - - - - - - - - - - - - - - - - Одобренные жалобы - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
     title: '- - - - - -  - - - - - - - - -  - - - - - - - - - - - - - - - - - Глава №2 (Правила ИП) - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'Игрок будет наказан',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан.[/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#99eb00][FONT=GEORGIA][CENTER]Решено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: РАССМОТРЕНО,
	  status: false,
    },
{
      title: 'nRP-Поведение [2.01]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.01.[/color][/b] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [color=#ff0000]| [b]Jail 30 минут[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'Уход от RP [2.02]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.02.[/color][/b] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [color=#ff0000]| [b]Jail 30 минут[/b] / [b]Warn[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'nRP Drive [2.03]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.03.[/color][/b] Запрещен NonRP Drive–вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [color=#ff0000]| [b]Jail 30 минут[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
	  status: false,
    },
{
      title: 'Помеха ИП [2.04]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.04.[/color][/b] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. [color=#ff0000]| [b]Ban 10 дней[/b] / [b]Обнуление[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'nRP Обман [2.05]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.05.[/color][/b] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [color=#ff0000]| [b]Permban[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'Аморал. действия [2.08]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.08.[/color][/b] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [color=#ff0000]| [b]Jail 30 минут[/b] / [b]Warn[/b][/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'Слив склада [2.09]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.09.[/color][/b] Запрещено сливать склад фракции / семьи путем взятия большого количества ресурсов или превышая допустимый лимит, установленный лидером [color=#ff0000]| [b]Ban 15 - 30 дней[/b] / [b]Permban[/b][/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'Обман в /do [2.10]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.10.[/color][/b] Запрещено в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже [color=#ff0000]| [b]Jail 30 минут[/b] / [b]Warn[/b][/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'Раб. т/с в лич. целях [2.11]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.11.[/color][/b] Запрещено использование рабочего или фракционного транспорта в личных целях [color=#ff0000]| [b]Jail 30 минут[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'Помеха блогерам [2.12]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.12.[/color][/b] Запрещена помеха в работе блогеров, стримеров (медиа лиц), которые находятся на официальном сотрудничестве с проектом [color=#ff0000]| [b]Ban 7 дней[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'DB [2.13]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.13.[/color][/b] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [color=#ff0000]| [b]Jail 60 минут[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'TK [2.15]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.15.[/color][/b] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [color=#ff0000]| [b]Jail 60 минут[/b] / [b]Warn[/b] (за два и более убийства).[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'SK [2.16]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.16.[/color][/b] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [color=#ff0000]| [b]Jail 60 минут[/b] / [b]Warn[/b] (за два и более убийства).[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'MG [2.18]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.18.[/color][/b] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [color=#ff0000]| [b]Mute 30 минут[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'DM [2.19]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.19.[/color][/b] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [color=#ff0000]| [b]Jail 60 минут[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'Mass DM [2.20]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.20.[/color][/b] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [color=#ff0000]| [b]Warn[/b] / [b]Ban 3 - 7 дней[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'Багоюз [2.21]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.21.[/color][/b] Запрещено пытаться обходить игровую систему или использовать любые баги сервера [color=#ff0000]| [b]Ban 15 - 30 дней[/b] / [b]Permban[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'Стороннее ПО [2.22]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.22.[/color][/b] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [color=#ff0000]| [b]Ban 15 - 30 дней[/b] / [b]Permban[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'Сокрытие/распространение игр. ошибок [2.23]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.23.[/color][/b] Запрещено скрывать от администрации ошибки игровых систем, а также распространять их игрокам [color=#ff0000]| [b]Ban 15 - 30 дней[/b] / [b]Permban[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'Сокрытие нарушителей [2.24]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.24.[/color][/b] Запрещено скрывать от администрации нарушителей или злоумышленников [color=#ff0000]| [b]Ban 15 - 30 дней[/b] / [b]Permban + ЧС Проекта[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'Нанесени (или попытка) вреда проекту [2.25]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.25.[/color][/b] Запрещены попытки или действия, которые могут навредить репутации проекта [color=#ff0000]| [b]Permban + ЧС Проекта[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'Вред ресурсам проекта [2.26]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.26.[/color][/b] Запрещено намеренно наносить вред ресурсам проекта (игровые серверы, форум, официальные Discord-серверы и так далее) [color=#ff0000]| [b]Permban + ЧС Проекта[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'Слив адм. инфы [2.27]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.27.[/color][/b] Запрещено распространение информации и материалов, непосредственно связанных с деятельностью администрации проекта, которые могут повлиять на работу и систему администрации [color=#ff0000]| [b]Permban + ЧС Проекта[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'Порча экономики [2.30]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.30.[/color][/b] Запрещено пытаться нанести ущерб экономике сервера [color=#ff0000]| [b]Ban 15 - 30 дней[/b] / [b]Permban[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'Реклама [2.31]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.31.[/color][/b] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube-каналы и тому подобное [color=#ff0000]| [b]Ban 7 дней[/b] / [b]Permban[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'Ввод в заблуждение [2.32]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.32.[/color][/b] Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [color=#ff0000]| [b]Ban 7 - 15 дней[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'Использование уязвимости правил [2.33]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.33.[/color][/b] Запрещено пользоваться уязвимостью правил [color=#ff0000]| [b]Ban 7 - 15 дней[/b] / [b]Permban[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'Полит/Религиоз конфликты [2.35]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.35.[/color][/b] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [color=#ff0000]| [b]Mute 120 минут[/b] / [b]Ban 7 дней[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'OOC Угрозы [2.37]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.37.[/color][/b] Запрещены OOC-угрозы, в том числе и завуалированные, а также угрозы наказанием со стороны администрации [color=#ff0000]| [b]Mute 120 минут[/b] / [b]Ban 7 - 15 дней[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'Распростр. лич. инфы игроков [2.38]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.38.[/color][/b] Запрещено распространять личную информацию игроков и их родственников [color=#ff0000]| [b]Ban 15 - 30 дней[/b] / [b]PermBan + ЧС проекта[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'Злоуп. нарушениями [2.39]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.39.[/color][/b] Злоупотребление нарушениями правил сервера [color=#ff0000]| [b]Ban 7 - 15 дней[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'Оск. проекта [2.40]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.40.[/color][/b] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [color=#ff0000]| [b]Mute 300 минут[/b] / [b]Ban 30 дней (Ban выдается по согласованию с главным администратором)[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'Попытка продажи Игр. имущ/акк [2.42]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.42.[/color][/b] Попытка продажи любого игрового имущества или игрового аккаунта за реальные деньги [color=#ff0000]| [b]Permban[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'Продажа (или попытка) промокодов от проекта [2.43]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.43.[/color][/b] Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [color=#ff0000]| [b]Mute 120 минут[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'ЕПП [2.46]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.46.[/color][/b] Запрещено ездить по полям на любом транспорте [color=#ff0000]| [b]Jail 30 минут[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'ЕПП Фура/Инкас [2.47]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.47.[/color][/b] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [color=#ff0000]| [b]Jail 60 минут[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'Арест в Каз/Аук/Сист. МП [2.50]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.50.[/color][/b] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [color=#ff0000]| [b]Ban 7 - 15 дней + увольнение из организации[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'nRP Аксессуар [2.52]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.52.[/color][/b] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера [color=#ff0000]| [b]Обнуление аксессуаров[/b] / [b]Обнуление аксессуаров + JAIL 30 минут[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'Оск/Неуваж адм. [2.54]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.54.[/color][/b] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [color=#ff0000]| [b]Mute 180 минут[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'Сбив аним / Сбив темпа стрельбы [2.55]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.55.[/color][/b] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [color=#ff0000]| [b]Jail 60 минут[/b] / [b]Jail 120 минут[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'Невозврат долга [2.57]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]2.57.[/color][/b] Запрещается брать в долг игровые ценности и не возвращать их. [color=#ff0000]| [b]Ban 30 дней[/b] / [b]Permban[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
    {
     title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Глава №3 (Игровые чаты) - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
{
      title: 'CAPSLOCK [3.02]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]3.02.[/color][/b] Запрещено использование верхнего регистра (Caps Lock) при написании любого текста в любом чате [color=#ff0000]| [b]Mute 30 минут[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'оскорбление [3.03]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]3.03.[/color][/b] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [color=#ff0000]| [b]Mute 30 минут[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'оск/упом родни [3.04]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]3.04.[/color][/b] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [color=#ff0000]| [b]Mute 120 минут[/b] / [b]Ban 7 - 15 дней[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'флуд [3.05]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]3.05.[/color][/b] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [color=#ff0000]| [b]Mute 30 минут[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'злоуп. симв. [3.06]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]3.06.[/color][/b] Запрещено злоупотребление знаков препинания и прочих символов [color=#ff0000]| [b]Mute 30 минут[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'слив глобал. чата [3.08]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]3.08.[/color][/b] Запрещены любые формы «слива» посредством использования глобальных чатов [color=#ff0000]| [b]PermBan[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'выдача себя за адм [3.10]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]3.10.[/color][/b] Запрещена выдача себя за администратора, если таковым не являетесь [color=#ff0000]| [b]Ban 7 - 15 дней[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'ввод в заблуждение командами [3.11]',
      content: '[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]'+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]3.11.[/color][/b] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [color=#ff0000]| [b]Ban 15 - 30 дней[/b] / [b]PermBan[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'offtop/Мат/Caps в репорт [3.12]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]3.12.[/color][/b] Запрещено подавать репорт, написанный транслитом, с сообщением не по теме (Offtop), с включённым Caps Lock, с использованием нецензурной брани, и повторять обращение (если ответ уже был дан ранее) [color=#ff0000]| [b]Report Mute 30 минут[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'музыка в voice chat [3.14]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]3.14.[/color][/b] Запрещено включать музыку в Voice Chat [color=#ff0000]| [b]Mute 60 минут[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'шум в voice chat [3.16]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]3.16.[/color][/b] Запрещено создавать посторонние шумы или звуки [color=#ff0000]| [b]Mute 30 минут[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'полит/религиоз пропаганда | призыв к флуду. [3.18]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]3.18.[/color][/b] Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов [color=#ff0000]| [b]Mute 120 минут[/b] / [b]Ban 10 дней[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'Смена голоса в voice chat [3.19]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]3.19.[/color][/b] Запрещено использование любого софта для изменения голоса [color=#ff0000]| [b]Mute 60 минут[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'транслит [3.20]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]3.20.[/color][/b] Запрещено использование транслита в любом из чатов [color=#ff0000]| [b]Mute 30 минут[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'Реклама промокода [3.21]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]3.21.[/color][/b] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах [color=#ff0000]| [b]Ban 30 дней[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'Объявления на территории госс [3.22]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]3.22.[/color][/b] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [color=#ff0000]| [b]Mute 30 минут[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'мат в vip [3.23]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]3.23.[/color][/b] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [color=#ff0000]| [b]Mute 30 минут[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
    {
     title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Глава №4 (Игровые Аккаунты) - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
{
      title: 'оск/мат nickname [4.09]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]4.09.[/color][/b] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [color=#ff0000]| [b]PermBan[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
{
      title: 'fake nickname [4.10]',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Игрок будет наказан по следующему пункту правил:<br>[quote][color=#ff0000][font=verdana][b]4.10.[/color][/b] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [color=#ff0000]| [b]PermBan[/b].[/quote][/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Спасибо за Ваше обращение! Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#59ff00][FONT=GEORGIA][CENTER]Одобрено & Закрыто.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ОДОБРЕНО,
	  status: false,
    },
    {
     title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Передача Жалобы Руководству - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'Передать ГКФ/ЗГКФ',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Ваша жалоба передана на рассмотрение [color=#00a2ff]Главному Куратору Форума или его заместителю[/color].<br>Срок рассмотрения может занять более 2 суток, просьба не создавать дублирующие темы.[/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#ffd100][FONT=GEORGIA][CENTER]Закрыто & На рассмотрении.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: НАРАССМОТРЕНИИ,
	  status: false,
    },
    {
      title: 'Передать ГА/ЗГА',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Ваша жалоба передана на рассмотрение [color=#ff0000]Главному Администратору или его заместителям[/color].<br>Срок рассмотрения может занять более 2 суток, просьба не создавать дублирующие темы.[/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#ffd100][FONT=GEORGIA][CENTER]Закрыто & На рассмотрении.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ГЛАВНОМУАДМИНУ,
	  status: false,
    },
    {
      title: 'Передать Тех. Спец-у',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Ваша жалоба передана на рассмотрение [color=#ff8000]Техническому Специалисту[/color].<br>Срок рассмотрения может занять более 2 суток, просьба не создавать дублирующие темы.[/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#ffd100][FONT=GEORGIA][CENTER]Закрыто & На рассмотрении.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: ТЕХСПЕЦУ,
	  status: false,
    },
    {
      title: 'Передать СА/ЗСА',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Ваша жалоба передана на рассмотрение [color=#e20000]Специальному Администратору или его заместителям[/color].<br>Срок рассмотрения может занять более 2 суток, просьба не создавать дублирующие темы.[/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#ffd100][FONT=GEORGIA][CENTER]Закрыто & На рассмотрении.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: СПЕЦАДМИНУ,
	  status: false,
    },
    {
      title: 'Передать КП',
      content: "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]"+
        "{{ greeting }} {{ user.name }} [/HEADING][/FONT][/COLOR][/CENTER][/B]"+
        "[CENTER][COLOR=#beb7ff][font=Courier New][heading=2]Ваша жалоба передана на рассмотрение [color=#fff944]Команде проекта[/color].<br>Срок рассмотрения может занять более 2 суток, просьба не создавать дублирующие темы.[/heading][/font][/COLOR][/CENTER]<hr><br>" +
		"[Color=#f1c40f][CENTER][FONT=VERDANA][HEADING=3]Приятной игры на сервере №77 KOSTROMA.[/HEADING][/FONT][/CENTER][/color]<br>" +
		"[quote][size=5][Color=#ffd100][FONT=GEORGIA][CENTER]Закрыто & На рассмотрении.[/CENTER][/color][/FONT][/size][/quote]"+
        "[CENTER][IMG]http://postimg.su/image/ednh7EcK/unnamed.gif[/IMG]",
      prefix: КОМАНДЕПРОЕКТА,
	  status: false,
    },
  ];

  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение', 'pin');
    addButton('КП', 'teamProject');
    addButton('Га', 'Ga');
    addButton('Спецу', 'Spec');
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('Тех. Специалисту', 'Texy');
    addButton('Решено', 'Resheno');
    addButton('Закрыто', 'Zakrito');
    addButton('Ответы', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(НАРАССМОТРЕНИИ, true));
    $('button#accepted').click(() => editThreadData(ОДОБРЕНО, false));
    $('button#Ga').click(() => editThreadData(ГЛАВНОМУАДМИНУ, true));
    $('button#Spec').click(() => editThreadData(СПЕЦАДМИНУ, true));
    $('button#teamProject').click(() => editThreadData(КОМАНДЕПРОЕКТА, true));
    $('button#unaccept').click(() => editThreadData(ОТКАЗАНО, false));
    $('button#Texy').click(() => editThreadData(ТЕХСПЕЦУ, false));
    $('button#Resheno').click(() => editThreadData(РЕШЕНО, false));
    $('button#Zakrito').click(() => editThreadData(ЗАКРЫТО, false));

    $(`button#selectAnswer`).click(() => {
      XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
      buttons.forEach((btn, id) => {
        if (id > 0) {
          $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
        }
        else {
          $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
        }
      });
    });
  });

  function addButton(name, id) {
    $('.button--icon--reply').before(
      `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`,
    );
  }

  function buttonsMarkup(buttons) {
    return `<div class="select_answer">${buttons
  .map(
  (btn, i) =>
    `<button id="answers-${i}" class="button--primary button ` +
    `rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`,
  )
  .join('')}</div>`;
  }

  function pasteContent(id, data = {}, send = false) {
    const template = Handlebars.compile(buttons[id].content);
    if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

    $('span.fr-placeholder').empty();
    $('div.fr-element.fr-view p').append(template(data));
    $('a.overlay-titleCloser').trigger('click');

    if (send == true) {
      editThreadData(buttons[id].prefix, buttons[id].status);
      $('.button--icon.button--icon--reply.rippleButton').trigger('click');
    }
  }

  function getThreadData() {
    const authorID = $('a.username')[0].attributes['data-user-id'].nodeValue;
    const authorName = $('a.username').html();
    const hours = new Date().getHours();
    return {
      user: {
        id: authorID,
        name: authorName,
        mention: `[USER=${authorID}]${authorName}[/USER]`,
      },
      greeting: () =>
        4 < hours && hours <= 11 ?
        '[B][CENTER][COLOR=#fff364][FONT=GEORGIA][HEADING=2]Доброго утра, уважаемый':
        11 < hours && hours <= 15 ?
        '[B][CENTER][COLOR=#64ffd2][FONT=GEORGIA][HEADING=2]Доброго дня, уважаемый':
        15 < hours && hours <= 21 ?
        '[B][CENTER][COLOR=#ff7c00][FONT=GEORGIA][HEADING=2]Доброго вечера, уважаемый':
        '[B][CENTER][COLOR=#2294ff][FONT=GEORGIA][HEADING=2]Доброй ночи, уважаемый',
    };
  }

    function editThreadData(prefix, pin = false) {
// Получаем заголовок темы, так как он необходим при запросе
	const threadTitle = $('.p-title-value')[0].lastChild.textContent;

	if(pin == false){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	} else  {
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
			pin: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}




 if(pin == false){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	} else  {
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
			pin: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
		   }


function moveThread(prefix, type) {
// Получаем заголовок темы, так как он необходим при запросе
const threadTitle = $('.p-title-value')[0].lastChild.textContent;

fetch(`${document.URL}move`, {
  method: 'POST',
  body: getFormData({
	prefix_id: prefix,
	title: threadTitle,
	target_node_id: type,
	redirect_type: 'none',
	notify_watchers: 1,
	starter_alert: 1,
	starter_alert_reason: "",
	_xfToken: XF.config.csrf,
	_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
	_xfWithData: 1,
	_xfResponseType: 'json',
  }),
}).then(() => location.reload());
}

function getFormData(data) {
	const formData = new FormData();
	Object.entries(data).forEach(i => formData.append(i[0], i[1]));
	return formData;
  }
    }
})();