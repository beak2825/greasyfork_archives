// ==UserScript==
// @name         SURGUT | Скрипт для Кураторов Форума [by Chiko_Avgansex & D.Merk]
// @namespace    https://forum.blackrussia.online
// @version      3.9
// @description  По вопросам (ВК): https://vk.com/id751215897
// @author       Dmitrij Merkułow
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @license      chikoo
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsZuQBwjnssiEtAnN-ASNBKkiXRaOcXZUJWQ&s
// @downloadURL
// @updateURL
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/482409/SURGUT%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%5Bby%20Chiko_Avgansex%20%20DMerk%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/482409/SURGUT%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%5Bby%20Chiko_Avgansex%20%20DMerk%5D.meta.js
// ==/UserScript==

    (function () {
	'use strict';
	const PIN_PREFIX = 2; //  префикс закрепить
	const COMMAND_PREFIX = 10; // команде проекта
	const CLOSE_PREFIX = 7; // префикс закрыто
	const DECIDED_PREFIX = 6; // префикс решено
	const TECHADM_PREFIX = 13 // тех администратору
	const WATCHED_PREFIX = 9; // рассмотрено
	const WAIT_PREFIX = 14; // ожидание
    const ACCEPT_PREFIX = 8; // префикс одобрено
    const UNACCEPT_PREFIX = 4; // префикс отказано
    const GA_PREFIX = 12; // передать га
    const VAJNO_PREFIX = 1; // передать гкф
  const SPECY_PREFIX = 11 // передать спецу
    const NO_PREFIX = 0;
	const buttons = [
       {
      title: 'Привет',
      content:
        '[SIZE=4][COLOR=rgb(139, 69, 19)][I][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/I][/COLOR][/SIZE]',
      },
     {
      title: '|-(-->--- Раздел Жалобы на игроков ---<--)-|',
      color: 'oswald: 3px; color: #FFFF00; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
      },
      {
	  title: '| На рассмотрение |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
	    "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба взята на рассмотрение, не создавайте дубликатов и ожидайте ответа от администрации.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FFFF00]На рассмотрении.<br>' ,
	  prefix: PIN_PREFIX,
	  status: true,
	},
     {
	  title: '| Не по форме |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Вашa жалобa составленa не по форме, пожалуйста ознакомьтесь с правилами подачи жалоб.<br>"+
		"[CENTER][B][COLOR=RED]| [URL='https://forum.blackrussia.online/index.php?threads/3429394/'][Color=lavender]Правила подачи жалоб[/URL] [COLOR=RED]|<br>"+
	    "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: '|-(--(--(->------ Причины отказов ------<)--)--)-|',
      color: 'oswald: 3px; color: #FFFF00; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
	},
{
	  title: '| Нету в системе логов |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В системе логирования нарушений не обнаружено...<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
		   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Нет нарушений |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Со стороны игрока не найдены какие либо нарушение, пожалуйста ознакомьтесь с правилами проекта..<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
		   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: '| От 3 лица |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Жалоба составлена от 3-го лица, мы не можем ее рассмотреть.<br>"+
         "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Отсутствуют док-ва |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Вы не предоставили какие либо доказательства, прикрепите доказательства загруженные на фото/видео хостинг.<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Недостаточно док-в |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Предоставленные доказательства недостаточно для принятие решения, если у вас имеют дополнительные доказательства прикрепите.<br>"+
	  "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
			'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: '| Док-ва отредактированы |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Доказательства были подвергнуты редактированию - следовательно, рассмотрению не подлежит. <br>"+
	   "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
			'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: '| Док-ва в соц-сети |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Вашa жалобa отказана т.к доказательства загруженные в соцсети не принимаются. Загрузите док-ва в фото/видео хостинги как YouTube, Imgur, Япикс. <br><br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
			'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Не работают док-ва |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваши доказательства не рабочие или же битая ссылка, пожалуйста загрузите на видео/фото хостинге.<br>"+
		 	   "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| Нету /time |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В предоставленных доказательств отсутствует время (/time), не подлежит рассмотрению.<br>"+
	 	   "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
			'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Нужен фрапс |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В данной ситуации обязательно должен быть фрапс (видео фиксация) всех моментов, в противном случае жалоба будет отказана.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: '| Неполный фрапс |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Видео запись не полная, к сожелению мы вынуждены отказать.<br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Нету условий сделки |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] В ваших доказательствах отсутствуют условия сделки, соответственно рассмотрению не подлежит.<br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
			'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Нету Тайм-кодов |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Если видео длится 3х и более минут, вам следует указать таймкоды, в противном случае жалоба будет отказана.<br>"+
	  "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
      {
	  title: '| Системный промо |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была проверена и вердикт такой: данный промокод является системным, или был выпущен  разработчиками [/Spoiler]"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
			'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Уже был ответ |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Вам уже был дан ответ в прошлой жалобе, пожалуйста перестаньте делать дубликаты, иначе ваш Форумный аккаунт будет заблокирован.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| Уже был наказан |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба отказана, т.к нарушитель уже был наказан ранее. Просьба не создавать дубликаты данной темы.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
			'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Прошло 72 часа |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]С момента совершения нарушения прошло 72 часа, не подлежит рассмотрению.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: '| Долг был дан не через банк |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Займ может быть осуществлен только через зачисление игровых ценностей на банковский счет  [/Spoiler]"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
			'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
      {
	  title: '| После срока возврата долга прошло 10 дней |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Жалоба на должника подается в течение 10 дней после истечения срока займа.  [/Spoiler]"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: '| Условия о долге в соц. сетях |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Договоры вне игры не будут считаться доказательствами.  [/Spoiler]"+
	   "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
      {
	  title: '|-(--(--(->-------- RP Нарушения --------<-)--)--)-|',
      color: 'oswald: 3px; color: #FFFF00; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
	},
   {
	  title: '| DM |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]2.19 | [color=lavender] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины.[color=red]  | Jail 60 минут[/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
	  "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| DB |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]2.13 | [color=lavender] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [color=red] | Jail 60 минут. [/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| RK |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]2.14 | [color=lavender] Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [color=red] | Jail 30 минут. [/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| TK |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]2.15 | [color=lavender] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины.[color=red]  | Jail 60 минут / Warn (за два и более убийства)[/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| SK |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]2.16 | [color=lavender] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них.[color=red]  | Jail 60 минут / Warn (за два и более убийства)[/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Mass DM |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]2.20 | [color=lavender] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более.[color=red]  | Warn / Бан 7-15 дней.[/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| ЕПП  |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]2.47 | [color=lavender] Запрещено ездить по полям на легковые машины и мотоциклах. [color=red]  | Jail 30 минут[/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| ЕПП фура/инко |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]2.47 | [color=lavender] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [color=red]  | Jail 60 минут[/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Уход от RolePlay |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]2.02 | [color=lavender] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [color=red] | Jail 30 минут / Warn [/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Сбив анимки |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]2.55 | [color=lavender] Запрещается багоюз связанный с анимацией в любых проявлениях. [color=red]  | Jail 60-120 минут[/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| NonRP акс |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]2.52 | [color=lavender] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [color=red]  | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Слив склада |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]2.21 | [color=lavender] 2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [color=red]  | Ban 15-30 дней / Permban[/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Аморальные действия |',
	  content:

		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]2.08 | [color=lavender] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [color=red]  | Jail 30 минут / Warn[/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Обман на долг |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]2.57 | [color=lavender] Запрещается брать в долг игровые ценности и не возвращать их.[color=red]  | Ban 30 дней / Permban[/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
     "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
      title: '| Обход системы |',
      content:
        '[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]2.21 | [color=lavender] Запрещено пытаться обходить игровую систему или использовать любые баги сервера [color=red] | Ban 15-30 дней / Permban[/Spoiler]"+
        "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
        '[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
	{
	  title: '| Читы/Стороннее ПО/Сборка |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]2.05 | [color=lavender] Запрещено хранить / использовать / распространять стороннее программное обеспечение, сборки или любые другие средства, позволяющие получить преимущество над другими игроками[color=red] | Ban 15 - 30 дней / PermBan [/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Редактирование в личных целях |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]*  [color=lavender] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком[color=red]  | Ban 7 дней + ЧС организации [/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Убийство при задержании |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler] | [color=lavender] Запрещено целенаправленно убивать преступника во время задержания без весомой Role Play причины.  [color=red]  | Warn [/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Арест в казино/аукционе |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]2.50  | [color=lavender] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [color=red]  | Ban 7 - 15 дней + увольнение из организации[/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: '| Помеха ИП 2.04 |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]2.04  | [color=lavender] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы [color=red]  | Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
  {
	  title: '|-(--(--(->------- Чат Нарушения -------<-)--)--)-|',
      color: 'oswald: 3px; color: #FFFF00; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
	},
    {
	  title: '| КАПС |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]3.02 | [color=lavender] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [color=red]  | Mute 30 минут[/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Флуд |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]3.05 | [color=lavender] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока[color=red]  | Mute 30 минут[/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: '| MG |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]2.18  [color=lavender] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе.[color=red]  | Mute 30 минут.[/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Оск в /n |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]3.03 | [color=lavender] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены[color=red]  | Mute 30 минут[/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Оск/Упом родни |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]3.04 | [color=lavender] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC)  [color=red]  | Mute 120 минут / Ban 7-15 дней.[/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Мат в /v |',
      content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]3.23 | [color=lavender] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате[color=red]  | Mute 30 минут[/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Слив чата |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]3.08 | [color=lavender] Запрещены любые формы «слива» посредством использования глобальных чатов[color=red]  | Permban[/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Угрозы наказаниями |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]3.09 | [color=lavender] Запрещены любые угрозы о наказании игрока со стороны администрации [color=red]  | Mute 30 минут[/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Оск адм |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]2.54 | [color=lavender]   Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации.   [color=red]  | Mute 180 минут.[/Spoiler]"+
        "[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Ввод в забл. (командами) |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]3.11 | [color=lavender] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами[color=red]  | Ban 15-30 / Permban[/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Полит/Религ/Подстрек на наруш игроков |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]3.18 | [color=lavender] Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов[color=red]  | Mute 120 минут / Ban 10 дней. [/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Транслит |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]3.20 | [color=lavender] Запрещено использование транслита в любом из чатов[color=red]  | Mute 30 минут[/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Общение на других языках |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]3.01 | [color=lavender] Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке [color=red]  | Mute 30 минут [/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Промокоды |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
        "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]3.21 | [color=lavender] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [color=red]  | Ban 30 дней.[/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Объявления в госс |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]3.22 | [color=lavender] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [color=red]  | Mute 30 минут[/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
	  title: '| ООС угрозы |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]2.37 | [color=lavender] Запрещены OOC угрозы, в том числе и завуалированные [color=red]  | Ban 15-30 дней / Permban [/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Перенос конфликта |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]2.36 | [color=lavender] Запрещено переносить конфликты из IC в OOC, и наоборот [color=red]  | Warn / Ban 15-30 дней [/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
	   "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Реклама |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]2.31 | [color=lavender] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное  [color=red] | Ban 7 дней / PermBan [/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
	  title: '| Оскорбление адм |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]*  | [color=lavender] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации[color=red]  | Mute 180 минут[/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
	  title: '| Выдача себя за адм |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]*  | [color=lavender] Запрещена выдача себя за администратора, если таковым не являетесь[color=red]  | Ban 7 - 15 + ЧС администрации[/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: '|-(--(--)->------ NonRP нарушения ------<-)--)--)-|',
      color: 'oswald: 3px; color: #FFFF00; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
	},
      {
	  title: '| NonRP поведение |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]2.13 | [color=lavender] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [color=red] | Jail 30 минут. [/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
	  title: '| NonRP обман |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]2.05 | [color=lavender] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики[color=red]  | Permban[/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
	  title: '| NonRP edit |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]*  [color=lavender] Запрещено редактирование объявлений, не соответствующих ПРО[color=red]  | Mute 30 минут[/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
	  title: '| NonRP эфир |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]* | [color=lavender] Запрещено проведение эфиров, не соответствующих Role Play правилам и логике[color=red]  | Mute 30 минут[/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
title: '| NonRP розыск |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]* | [color=lavender] Запрещено выдавать розыск без Role Play причины[color=red]  | Warn / Jail 30 минут [/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| NonRP В/ч |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]* | [color=lavender] Запрещено нападать на военную часть нарушая Role Play [color=red]  | Warn (для ОПГ) / Jail 30 минут (для Гражданских)  [/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
	  title: '| NonRP охранник |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]*  | [color=lavender] Охраннику казино запрещено выгонять игрока без причины[color=red]  | Увольнение с должности | Jail 30 минут[/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	 {
	  title: '|-(--(--(->------------ Nick_Name ------------<-)--)--)-|',
      color:'oswald: 3px; color: #FFFF00; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
	},
    	{
	  title: '| Nick_Name оск |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]*  | [color=lavender] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные)[color=red]  | Устное замечание + смена игрового никнейма / PermBan[/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| Фейк |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующее наказание.[Spoiler][color=red]* 4.10 | [color=lavender] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию. Пример: подменять букву i на L и так далее, по аналогии. [color=red]  | PermBan [/Spoiler]"+
		"[CENTER][COLOR=lavender] Наказание будет выдано в течение 24 часов.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: '|-(--(--(->------ Передаю жалобу ------<-)--)--)-|',
      color: 'oswald: 3px; color: #FFFF00; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
	},
     {
	  title: '| Передать ГКФ/ЗГКФ |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была передана [COLOR=#7b68ee]Главному Куратору Форума / Заместителью Главного Куратора Форума[/COLOR] на рассмотрение<br>"+
        "[B][CENTER][COLOR=lavender]Возможно на рассмотрении жалобы потребуется больше времени. Просьба ожидать ответа и не создавать копий данной темы. <br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FFFF00]На рассмотрении.<br>',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: '| Передать Тех |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была передана Техническому специалисту сервера на рассмотрение<br>"+
        "[B][CENTER][COLOR=lavender]Возможно на рассмотрении жалобы потребуется больше времени. Просьба ожидать ответа и не создавать копий данной темы. <br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FFFF00]На рассмотрении.<br>',
	  prefix: TECHADM_PREFIX,
	  status: true,
	},
{
	  title: '| Передать Га |',
	  content:
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была передана [COLOR=RED]Главному Администратору[/COLOR] на рассмотрение<br>"+
        "[B][CENTER][COLOR=lavender]Возможно на рассмотрении жалобы потребуется больше времени. Просьба ожидать ответа и не создавать копий данной темы. <br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FFFF00]На рассмотрении.<br>',
	  prefix: GA_PREFIX,
	  status: true,
	},
    {
	  title: '|-(--(--(->------- В другой раздел -------<-)--)--)-|',
      color: 'oswald: 3px; color: #FFFF00; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
	},
    {
	  title: '| В жалобы на АДМ |',
	  content:

		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Вы ошиблись разделом, обратитесь пожалуйста в раздел жалоб на администрацию. <br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FFFF00]На рассмотрении.<br>',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: '| В жалобы на лидеров |',
	  content:

		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Вы ошиблись разделом, обратитесь пожалуйста в раздел жалоб на лидеров. <br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FFFF00]На рассмотрении.<br>',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: '| В обжалования |',
	  content:

		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Вы ошиблись разделом, обратитесь пожалуйста в раздел обжалования наказаний. <br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FFFF00]На рассмотрении.<br>',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    	{
	  title: '| В жалобы на хелперов |',
	  content:

		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Обратитесь в раздел жало на агентов поддержки. <br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: '| В жалобы на сотрудников |',
	  content:

		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Вы ошиблись разделом, обратитесь в раздел жалоб на сотрудников данной организации. <br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
      title: '|-(--(->------ RolePlay биографии ------<-)--)-|',
      color: 'oswald: 3px; color: #FFFF00; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
    },
	{
	
	  title: '| Отказано |',
	  content:
      "[B][CENTER]<i>{{ greeting }}, Уважаемый {{ user.name }} [/CENTER][/B]</i><br><br>"+
      "[B][CENTER]<i>Ваша RolePlay биография [COLOR=RED]Отказана[/COLOR]!</i><br>"+
      "[B][CENTER]<i>Приятной игры на сервере</i> [COLOR=#4169E1]Surgut[/COLOR]<br><br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 
    	{
	  title: '| Одобрено |',
	  content:
		"[B][CENTER]<i>{{ greeting }}, Уважаемый {{ user.name }}[/CENTER][/B]</i><br><br>"+
		"[B][CENTER]<i>Ваша RolePlay - биография [COLOR=#00FF00] Одобрена.[/COLOR][/B]</i><br><br>"+
		"[B][CENTER]<i>Приятной игры на сервере</i> [COLOR=#4169E1]Surgut[/COLOR]<br><br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	
 	{
	  title: '| Не по форме |',
	  content:
        "[B][CENTER]<i>{{ greeting }}, Уважаемый {{ user.name }} [/CENTER][/B]</i><br><br>"+
		"[B][CENTER]<i> Ваша RolePlay биография составлена не по форме.</i><br>"+
		"[B][CENTER]<i> Внимательно прочтите правила создания РП биографий закрепленые в данном разделе.[/B]</i><br>"+
        "[B][CENTER]<i>Приятной игры на сервере</i> [COLOR=#4169E1]Surgut[/COLOR]<br><br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
{
	  title: '| Не в тот раздел |',
	  content:
        "[B][CENTER]<i>{{ greeting }}, Уважаемый {{ user.name }} [/CENTER][/B]</i><br><br>"+
		"[B][CENTER]<i> Ошиблись разделом.</i><br>"+
		"[B][CENTER]<i> Обратитесь в нужный Вам раздел форума проекта.[/B]</i><br>"+
        "[B][CENTER]<i>Приятной игры на сервере</i> [COLOR=#4169E1]Surgut[/COLOR]<br><br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: '| Заголовок не по форме |',
	  content:
		"[B][CENTER]<i>{{ greeting }}, Уважаемый {{ user.name }}[/CENTER][/B]</i><br><br>"+
		"[B][CENTER]<i>Заголовок вашей RolePlay биографии составлен не по форме.</i><br>"+
		"[B][CENTER]<i> Внимательно прочтите правила создания РП биографий закрепленые в данном разделе.[/B]</i><br>"+
       "[B][CENTER]<i>Приятной игры на сервере</i> [COLOR=#4169E1]Surgut[/COLOR]<br><br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: '| Не совпадает возраст с датой рождения или текущей датой |',
	  content:
		"[B][CENTER]<i>{{ greeting }}, Уважаемый {{ user.name }}[/CENTER][/B]</i><br><br>"+
		"[B][CENTER]<i>Ваша биография отказана т.к. не совпадает возраст с датой рождения</i><br>"+
        "[B][CENTER]<i> Внимательно прочтите правила создания РП биографий закрепленые в данном разделе.[/B]</i><br>"+
        "[B][CENTER]<i>Приятной игры на сервере</i> [COLOR=#4169E1]Surgut[/COLOR]<br><br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Не дополнил в течении 24 часов |',
	  content:
		"[B][CENTER]<i>{{ greeting }}, Уважаемый {{ user.name }}[/CENTER][/B]</i><br><br>"+
		"[B][CENTER]<i>Ваша RolePlay - биография [COLOR=RED]отказана[/COLOR] т.к вы ее не дополнили.</i><br><br>"+ 
        "[B][CENTER]<i> Внимательно прочтите правила создания РП биографий закрепленые в данном разделе.[/B]</i><br>"+
        "[B][CENTER]<i>Приятной игры на сервере</i> [COLOR=#4169E1]Surgut[/COLOR]<br><br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
{
	  title: '| Недостаточно информации в 9 пункте|',
	  content:
		"[B][CENTER]<i>{{ greeting }}, Уважаемый {{ user.name }}[/CENTER][/B]</i><br><br>"+
		"[B][CENTER]<i>Ваша RolePlay - биография [COLOR=RED]отказана[/COLOR] т.к в 9 пункте очень мало инфорамации.</i><br><br>"+ 
        "[B][CENTER]<i> Внимательно прочтите правила создания РП биографий закрепленые в данном разделе.[/B]</i><br>"+
        "[B][CENTER]<i>Приятной игры на сервере</i> [COLOR=#4169E1]Surgut[/COLOR]<br><br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: '| Недостаточно информации о семье |',
	  content:
		"[B][CENTER]<i>{{ greeting }}, Уважаемый {{ user.name }}[/CENTER][/B]</i><br><br>"+
		"[B][CENTER]<i>Ваша RolePlay - биография [COLOR=RED]отказана[/COLOR] т.к мало инфорамации о семье.</i><br>"+
        "[B][CENTER]<i>Кратко опишите биографию каждого из ваших родственников[/B]</i><br>"+
        "[B][CENTER]<i> Внимательно прочтите правила создания РП биографий закрепленые в данном разделе.[/B]</i><br>"+
        "[B][CENTER]<i>Приятной игры на сервере</i> [COLOR=#4169E1]Surgut[/COLOR]<br><br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
{
	  title: '| Недостаточно информации о детстве |',
	  content:
		"[B][CENTER]<i>{{ greeting }}, Уважаемый {{ user.name }}[/CENTER][/B]</i><br><br>"+
		"[B][CENTER]<i>Даю вам 24 часа на дополнение информации о детстве[/B]</i><br>"+
                "[B][CENTER][COLOR=#FF8C00]На доработке![/COLOR]<br><br>",
	  prefix: PIN_PREFIX,
	  status: true,
	},
{
	  title: '| Недостаточно информации о юности |',
	  content:
		"[B][CENTER]<i>{{ greeting }}, Уважаемый {{ user.name }}[/CENTER][/B]</i><br><br>"+
		"[B][CENTER]<i>Даю вам 24 часа на дополнение информации о юности[/B]</i><br>"+
                "[B][CENTER][COLOR=#FF8C00]На доработке![/COLOR]<br><br>",
	  prefix: PIN_PREFIX,
	  status: true,
	},
{
	  title: '| Недостаточно информации о взрослой жизни |',
	  content:
		"[B][CENTER]<i>{{ greeting }}, Уважаемый {{ user.name }}[/CENTER][/B]</i><br><br>"+
		"[B][CENTER]<i>Даю вам 24 часа на дополнение информации о взрослой жизни[/B]</i><br>"+
                "[B][CENTER][COLOR=#FF8C00]На доработке![/COLOR]<br><br>",
	  prefix: PIN_PREFIX,
	  status: true,
	},
{
	  title: '| Недостаточно информации о настоящем времени |',
	  content:
		"[B][CENTER]<i>{{ greeting }}, Уважаемый {{ user.name }}[/CENTER][/B]</i><br><br>"+
		"[B][CENTER]<i>Даю вам 24 часа на дополнение информации о настоящем времени[/B]</i><br>"+
                "[B][CENTER][COLOR=#FF8C00]На доработке![/COLOR]<br><br>",
	  prefix: PIN_PREFIX,
	  status: true,
	},

  	{
	  title: '| От 3-ого лица |',
	  content:
		"[B][CENTER]<i>{{ greeting }}, Уважаемый {{ user.name }}[/CENTER][/B]</i><br><br>"+
		"[B][CENTER]<i>Ваша RolePlay - биография [COLOR=RED]отказана[/COLOR] т.к она написана от 3-ого лица.</i><br><br>"+ 
        "[B][CENTER]<i>Внимательно прочтите правила создания РП биографий закрепленые в данном разделе.[/B]</i><br>"+
        "[B][CENTER]<i>Приятной игры на сервере</i> [COLOR=#4169E1]Surgut[/COLOR]<br><br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
{
	  title: '| Не совпадает ник в заголовке и био |',
	  content:
		"[B][CENTER]<i>{{ greeting }}, Уважаемый {{ user.name }}[/CENTER][/B]</i><br><br>"+
		"[B][CENTER]<i>Ваша RolePlay - биография [COLOR=RED]отказана[/COLOR] т.к имя в заголовке и самой биографии не совпадают.</i><br><br>"+ 
        "[B][CENTER]<i>Внимательно прочтите правила создания РП биографий закрепленые в данном разделе.[/B]</i><br>"+
        "[B][CENTER]<i>Приятной игры на сервере</i> [COLOR=#4169E1]Surgut[/COLOR]<br><br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},

  	{
	  title: '| Более 1 биографии на акк |',
	  content:
		"[B][CENTER]<i>{{ greeting }}, Уважаемый {{ user.name }}[/CENTER][/B]</i><br><br>"+
		"[B][CENTER]<i>Ваша RolePlay - биография [COLOR=RED]отказана[/COLOR] т.к на вашем аккаунте более 1 биографии.</i><br><br>"+ 
        "[B][CENTER]<i>Внимательно прочтите правила создания РП биографий закрепленые в данном разделе.[/B]</i><br>"+
       "[B][CENTER]<i>Приятной игры на сервере</i> [COLOR=#4169E1]Surgut[/COLOR]<br><br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
         
 	{
	  title: '| Копипаст |',
	  content:
		"[B][CENTER]<i>{{ greeting }}, Уважаемый {{ user.name }}[/CENTER][/B]</i><br><br>"+
		"[B][CENTER]<i>Ваша RolePlay - биография [COLOR=RED]отказана[/COLOR] т.к вы ее скопировали.</i><br><br>"+ 
        "[B][CENTER]<i>Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.[/B]</i><br>"+
		"[B][CENTER]<i>Приятной игры на сервере</i> [COLOR=#4169E1]Surgut[/COLOR]<br><br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},

        {
	  title: '| Известная личность|',
	  content:
		"[B][CENTER]<i>{{ greeting }}, Уважаемый {{ user.name }}[/CENTER][/B]</i><br><br>"+
		"[B][CENTER]<i>Ваша RolePlay - биография [COLOR=RED]отказана[/COLOR] т.к она принадлежит известной личности.</i><br><br>"+ 
        "[B][CENTER]<i>Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.[/B]</i><br>"+
		"[B][CENTER]<i>Приятной игры на сервере</i> [COLOR=#4169E1]Surgut[/COLOR]<br><br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},

        {
	  title: '| Супер-способности |',
	  content:
		"[B][CENTER]<i>{{ greeting }}, Уважаемый {{ user.name }}[/CENTER][/B]</i><br><br>"+
		"[B][CENTER]<i>Ваша RolePlay - биография [COLOR=RED]отказана[/COLOR] т.к Ваш персонаж имеет супер-способности.</i><br><br>"+ 
        "[B][CENTER]<i>Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.[/B]</i><br>"+
		"[B][CENTER]<i>Приятной игры на сервере</i> [COLOR=#4169E1]Surgut[/COLOR]<br><br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},

        {
	  title: '| Политика |',
	  content:
		"[B][CENTER]<i>{{ greeting }}, Уважаемый {{ user.name }}[/CENTER][/B]</i><br><br>"+
		"[B][CENTER]<i>Ваша RolePlay - биография [COLOR=RED]отказана[/COLOR] т.к в ней содержатся полит/религиозные высказывания.</i><br><br>"+ 
        "[B][CENTER]<i>Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.[/B]</i><br>"+
		"[B][CENTER]<i>Приятной игры на сервере</i> [COLOR=#4169E1]Surgut[/COLOR]<br><br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},

 	{
	  title: '| Нонрп ник |',
	  content:
		"[B][CENTER]<i>{{ greeting }}, Уважаемый {{ user.name }}[/CENTER][/B]</i><br><br>"+
		"[B][CENTER]<i>Ваша RolePlay - биография [COLOR=RED]отказана[/COLOR] т.к у вас NonRP NickName.</i><br><br>"+
		"[B][CENTER]<i>Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе[/B]</i><br>"+
		"[B][CENTER]<i>Приятной игры на сервере</i> [COLOR=#4169E1]Surgut[/COLOR]<br><br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},

 	{
	  title: '| Ник англ |',
	  content:
		"[B][CENTER]<i>{{ greeting }}, уважаемый {{ user.name }}[/CENTER][/B]</i><br><br>"+
		"[B][CENTER]<i>Ваш NickName должен быть написан на русском языке</i><br>"+
		"[B][CENTER]<i>Даю 24 часа на исправление[/B]</i><br>"+
                "[B][CENTER][COLOR=#FF8C00]На доработке![/COLOR]<br><br>",
	  prefix: PIN_PREFIX,
	  status: true,
	},

	{
	  title: '| Нижнее подчеркивание в нике |',
	  content:
		"[B][CENTER]<i>{{ greeting }}, уважаемый {{ user.name }}[/CENTER][/B]</i><br><br>"+
		"[B][CENTER]<i>Ваш NickName должен быть написан без нижнего подчеркивания</i><br>"+
		"[B][CENTER]<i>Даю 24 часа на исправление[/B]</i><br>"+
        "[B][CENTER][COLOR=#FF8C00]На доработке![/COLOR]<br><br>",
	  prefix: PIN_PREFIX,
	  status: true,
	},
{
	  title: '| Неграмотно |',
	  content:
		"[B][CENTER]<i>{{ greeting }}, уважаемый {{ user.name }}[/CENTER][/B]</i><br><br>"+
		"[B][CENTER]<i>Ваша RolePlay - биография [COLOR=RED]отказана[/COLOR] т.к в ней присутствуют грамматические ошибки.</i><br><br>"+
		"[B][CENTER]<i>Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе[/B]</i><br>"+
		"[B][CENTER]<i>Приятной игры на сервере</i> [COLOR=#4169E1]Surgut[/COLOR]<br><br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
        title: '|-(--(->------- RolePlay ситуации -------<-)--)-|',
        color: 'oswald: 3px; color: #FFFF00; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
    },
    	{
	  title: '| Одобрено |',
	  content:

		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - ситуация одобрена.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
     	{
	  title: '| Отказано |',
	  content:

		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - ситуация отказана. <br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| Не по форме |',
	  content:

		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - ситуация отказана т.к она составлена не по форме. <br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| Заголовок не по форме |',
	  content:

		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Заголовок вашей RolePlay ситуации составлен не по форме. Внимательно прочтите правила создания РП ситуаций закрепленые в данном разделе.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  {
	  title: '| На доработке |',
	  content:

		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В вашей RolePlay - ситуации недостаточно информации. Даю вам 24 часа на ее дополнение/ исправление, иначе РП ситуация будет отказана.  <br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FFFF00]На рассмотрении.<br>',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    	{
	  title: '| Не дополнил |',
	  content:

		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - ситуация отказана т.к вы ее не дополнили. Внимательно прочтите правила создания РП ситуаций закрепленые в данном разделе.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: '| Не туда |',
	  content:

		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - ситуация отказана т.к вы не туда попали. <br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| Не пишите лишнее(Счет банка и т.п. |',
	  content:

		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - ситуация отказана. Оформите ее без добавлений от себя, по типу (Банк счет...) и тд...<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: '| Неграмотно |',
	  content:

		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - ситуация отказана т.к она оформлена неграмотно. <br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: '| Копипаст |',
	  content:

		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - ситуация отказана т.к вы ее скопировали у другого человека. Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе. <br>"+
 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Супергерой |',
	  content:

		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - ситуация отказана т.к вы приписали суперспособности своему персонажу. Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе. <br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: '|-(--(->---- Неоф. RP организации ----<-)--)-|',
      color: 'oswald: 3px; color: #FFFF00; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
    },
    {
	  title: '| Одобрено |',
	  content:

		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - организация одобрена.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| Не по форме |',
	  content:

		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - организация отказана т.к она составлена не по форме. <br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
       {
	  title: '| На доработке |',
	  content:

		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В вашей RolePlay - организации недостаточно информации. Даю вам 24 часа на ее дополнение/ исправление, иначе РП организация  будет отказана.  <br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FFFF00]На рассмотрении.<br>',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: '| Не дополнил |',
	  content:

		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - организация отказана т.к вы ее не дополнили. Внимательно прочтите правила создания РП организаций закрепленые в данном разделе.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: '| Не туда |',
	  content:

		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - организация отказана т.к вы не туда попали. <br>"+
 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: '| Ник по англ(нужно русские) |',
	  content:

		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - организация отказана т.к ваш все никнеймы должны быть написаны на русском языке. Внимательно прочитайте правила создания RP - организаций закрепленные в данном разделе. <br>"+
 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: '| Неграмотно |',
	  content:

		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - организация отказана т.к она оформлена неграмотно. <br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: '| Копипаст |',
	  content:

		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - организация отказана т.к вы ее скопировали у другого человека. Внимательно прочитайте правила создания RP - организаций закрепленные в данном разделе. <br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] [COLOR=#4F27DF]SURGUT[/COLOR] <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
];
    	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
  addButton('Ожидание', 'wait', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(173, 216, 230, 10);');
  addButton('На расмотрение', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 140, 0, 10);');
  addButton('Важно', 'vajno', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(128, 0, 0, 10);');
	addButton('Одобрено', 'accept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(110, 192, 113, 10);');
	addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 10);');
  addButton('Главному Админу', 'ga', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(178, 34, 34, 10);');
  addButton('Тех админу', 'techspec', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 0, 139, 10);');
  addButton('Команде проекта', 'teamProject', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 255, 0, 10);');
  addButton('Спец админу', 'Spec', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 10);');
	addAnswers();

	// Поиск информации о теме
	const threadData = getThreadData();

	$(`button#ff`).click(() => pasteContent(8, threadData, true));
	$(`button#prr`).click(() => pasteContent(2, threadData, true));
	$(`button#zhb`).click(() => pasteContent(21, threadData, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
	$('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#closed_complaint').click(() => editThreadData(CLOSE_PREFIX, false, false));
    $('button#accept').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#techspec').click(() => editThreadData(TECHADM_PREFIX, true));
    $('button#ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#vajno').click(() => editThreadData(VAJNO_PREFIX, true));
  $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
  $('button#wait').click(() => editThreadData(WAIT_PREFIX, false));

	$(`button#selectAnswer`).click(() => {
	XF.alert(buttonsMarkup(buttons), null, 'ВЫБЕРИТЕ ОТВЕТ');
	buttons.forEach((btn, id) => {
	if (id > 1) {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
	}
	else {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
	}
	});
	});
	});

   function addButton(name, id, hex = "grey") {
		$('.button--icon--reply').before(
		`<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 25px; margin-right: 5px; background-color: ${hex}">${name}</button>`,
		);
	}
	function addAnswers() {
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 5px; margin-top: 10px; border-radius: 13px;">Готовые ответы</button>`,
	);
	}

	function buttonsMarkup(buttons) {
		return `<div class="select_answer">${buttons
		  .map(
			(btn, i) =>
			  `<button id="answers-${i}" class="button--primary button ` +
			  `rippleButton" style="margin:5px; background-color: ${btn.color || "grey"}"><span class="button-text">${btn.title}</span></button>`,
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
	'Доброе утро' :
	11 < hours && hours <= 15 ?
	'Добрый день' :
	15 < hours && hours <= 21 ?
	'Добрый вечер' :
	'Доброй ночи',
	};
	}


         function editThreadData(prefix, pin = false, kumiho = true) {
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
  }
  if(pin == true){
   fetch(`${document.URL}edit`, {
     method: 'POST',
     body: getFormData({
    prefix_id: prefix,
    title: threadTitle,
    discussion_open: 1,
    sticky: 1,
    _xfToken: XF.config.csrf,
    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
    _xfWithData: 1,
    _xfResponseType: 'json',
     }),
   }).then(() => location.reload());
  }
}


 function moveThread(prefix, type) {
 // Перемещение темы
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
 })();

const bgButtons = document.querySelector(".pageContent");
const buttonConfig = (text, href) => {
  const button = document.createElement("button");
  button.textContent = text;
  button.classList.add("bgButton");
  button.addEventListener("click", () => {
    window.location.href = href;
  });
  return button;
};

    const Button2 = buttonConfig("Общие правила серверов", "https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/");

    bgButtons.append(Button2);


(function () {
    'use strict';

    function createAnimatedSnow() {

        const snowflakes = [];

        function setupCanvas() {
            const canvas = document.createElement('canvas');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            canvas.id = 'snow-flakes';
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '99999';
            canvas.style.filter = 'blur(2px)';
            document.body.appendChild(canvas);

            return canvas.getContext('2d');
        }

        function createSnowflake(x, y) {
            const size = Math.random() * 2 + 1;
            const speedY = Math.random() * 1 + 1;
            const speedX = (Math.random() - 0.5) * 2;

            return { x, y, size, speedY, speedX };
        }

        function drawSnowflake(ctx, snowflake) {
            ctx.beginPath();
            ctx.arc(snowflake.x, snowflake.y, snowflake.size, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.closePath();
        }

        function updateSnowflakes(ctx) {
            for (let i = 0; i < snowflakes.length; i++) {
                const snowflake = snowflakes[i];

                snowflake.y += snowflake.speedY;
                snowflake.x += snowflake.speedX;

                if (snowflake.y > window.innerHeight || snowflake.x > window.innerWidth) {
                    snowflakes[i] = createSnowflake(Math.random() * window.innerWidth, Math.random() * -window.innerHeight);
                }

                drawSnowflake(ctx, snowflake);
            }
        }

        function animateSnow() {
            const ctx = setupCanvas();

            for (let i = 0; i < 500; i++) {
                snowflakes.push(createSnowflake(Math.random() * window.innerWidth, Math.random() * window.innerHeight));
            }

            function animate() {
                ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                updateSnowflakes(ctx);
                requestAnimationFrame(animate);
            }

            animate();
        }

        animateSnow();

    }

    function removeAnimatedSnow() {
        const snowCanvas = document.querySelector('#snow-flakes');
        document.body.removeChild(snowCanvas);
    }

    const uixLogo = document.querySelector('a.uix_logo img');
    uixLogo.src = 'https://i.postimg.cc/JzQPT4Wc/blackrussia.png';
    uixLogo.srcset = 'https://i.postimg.cc/JzQPT4Wc/blackrussia.png';

    const messageCellUser = document.querySelectorAll('.message-cell--user');
    messageCellUser.forEach(function (cell) {
        cell.style.background = '#29586c88';
    });

    const messageCellMain = document.querySelectorAll('.message-cell--main');
    messageCellMain.forEach(function (cell) {
        cell.style.background = '#15293788';
    });

    const scrollbarStyle = document.createElement('style');
    scrollbarStyle.id = 'style-scrollbar';
    scrollbarStyle.textContent = `
    `;
    document.head.appendChild(scrollbarStyle);

    const pageHeader = document.querySelector('.pageContent');
    const switchStyleBlock = document.createElement('label');
    switchStyleBlock.className = 'switch';
    switchStyleBlock.innerHTML = `
            <input type="checkbox" id="styleToggleCheck">
            <span class="slider round" style="padding-right: 10px;">
            <span class="addingText" style="display: block; width: max-content; margin: 5px; margin-left: 45px; margin-top: 2px;">Снег</span>
            </span>
        `;
    pageHeader.appendChild(switchStyleBlock);

    const styleToggleCheck = document.getElementById('styleToggleCheck');
    if (localStorage.getItem('snowEnabled') === 'true') {
        styleToggleCheck.checked = true;
        createAnimatedSnow();
    }
    styleToggleCheck.addEventListener('change', function () {
        if (styleToggleCheck.checked) {
            createAnimatedSnow();
            localStorage.setItem('snowEnabled', 'true');
        } else {
            removeAnimatedSnow();
            localStorage.setItem('snowEnabled', 'false');
        }
    });

    const sliderStyle = document.createElement('style');
    sliderStyle.id = 'slider-style';
    sliderStyle.textContent = `
    .switch {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 20px;
        padding-left: 20px;
        margin: 0 30px 0 auto;
    }
    .switch input { display: none; }
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 1px solid #34aaeb;
        background-color: #212428;
        transition: all .4s ease;
    }
    .slider:hover{
        background-color: #29686d;
    }
    .slider:before {
        position: absolute;
        content: "";
        height: 14px;
        width: 14px;
        left: 2px;
        bottom: 2px;
        background-color: #32a0a8;
        box-shadow: 0 0 5px #000000;
        transition: all .4s ease;
    }
    input:checked + .slider {
        background-color: #212428;
    }
    input:checked + .slider:hover {
        background-color: #29686d;
    }
    input:focus + .slider {
        box-shadow: 0 0 5px #222222;
        background-color: #444444;
    }
    input:checked + .slider:before {
        transform: translateX(19px);
    }
    .slider.round {
        border-radius: 34px;
    }
    .slider.round:before {
        border-radius: 50%;
    }
`;
    document.head.appendChild(sliderStyle);
})();