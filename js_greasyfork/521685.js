// ==UserScript==
// @name         VLADIVOSTOK Скрипт для Кураторов Форума by Jajco_Darknet
// @namespace    https://forum.blackrussia.online
// @version      1.2
// @description  По вопросам (ВК): https://vk.com/nosok268
// @author       JDarknet
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @license      JDarknet
// @icon         https://cdn-icons-png.flaticon.com/128/4080/4080314.png
// @downloadURL
// @updateURL
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/521685/VLADIVOSTOK%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20by%20Jajco_Darknet.user.js
// @updateURL https://update.greasyfork.org/scripts/521685/VLADIVOSTOK%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20by%20Jajco_Darknet.meta.js
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
    const NO_PREFIX = 0;
	const buttons = [
        {
	  title: 'Для ГС/ЗГС (Госс/ОПГ)',
      color:'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
	},
    {
	  title: 'На рассмотрение(ЖБ)',
	  content:
		"[CENTER][FONT=book antiqua]Доброго времени суток![/FONT][/CENTER]<br><br>"+
         "[CENTER][FONT=book antiqua]Ваша жалоба была взята на рассмотрение...[/FONT][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Просьба не создавать копии данной темы, ожидайте ответа в данной теме![/FONT][/CENTER]<br><br>"+
	 "[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>"+
		'[CENTER][COLOR=rgb(251, 160, 38)][FONT=book antiqua]на рассмотрении...[/FONT][/COLOR][/CENTER]<br>',
	  prefix: PIN_PREFIX,
	  status: false,
	},
     {
	  title: 'Одобрено(ЖБ)',
	  content:
		"[CENTER][FONT=book antiqua]Доброго времени суток![/FONT][/CENTER]<br><br>"+
         "[CENTER][FONT=book antiqua]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт![/FONT][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Ваша жалоба одобрена, и с лидером будет проведена беседа![/FONT][/CENTER]<br><br>"+
	 '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: 'Одобрено для восстановления(ЖБ)',
	  content:
		"[CENTER][FONT=book antiqua]Доброго времени суток![/FONT][/CENTER]<br><br>"+
         "[CENTER][FONT=book antiqua]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт![/FONT][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Лидер видимо допустил ошибку, поэтому отправьте скриншот данного сообщения в заявления на восстановление, чтобы вас восстановили на тот-же ранг![/FONT][/CENTER]<br><br>"+
	 '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: 'не достаточно докв(ЖБ)',
	  content:
		"[CENTER][FONT=book antiqua]Доброго времени суток![/FONT][/CENTER]<br><br>"+
         "[CENTER][FONT=book antiqua]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт![/FONT][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Ваша жалоба была отказана, т.к не достаточно доказательств для подтверждения нарушения![/FONT][/CENTER]<br><br>"+
	 '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
      {
	  title: 'Нарушения не увидел(ЖБ)',
	  content:
		"[CENTER][FONT=book antiqua]Доброго времени суток![/FONT][/CENTER]<br><br>"+
         "[CENTER][FONT=book antiqua]Нарушения со стороны Лидера/Заместителя я не увидел![/FONT][/CENTER]<br><br>"+
	 '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: 'нету /time (ЖБ)',
	  content:
		"[CENTER][FONT=book antiqua]Доброго времени суток![/FONT][/CENTER]<br><br>"+
         "[CENTER][FONT=book antiqua]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт![/FONT][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Ваша жалоба была отказана, т.к на скринах отсутствует /time![/FONT][/CENTER]<br><br>"+
	 '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
      {
	  title: 'Лидер предоставил доква(ЖБ)',
	  content:
		"[CENTER][FONT=book antiqua]Доброго времени суток![/FONT][/CENTER]<br><br>"+
         "[CENTER][FONT=book antiqua]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт![/FONT][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Ваша жалоба была отказана, т.к лидер предоставил док-ва о вашем нарушении и наказание было выдано верно![/FONT][/CENTER]<br><br>"+
	 '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: 'Прошло много дней(ЖБ)',
	  content:
		"[CENTER][FONT=book antiqua]Доброго времени суток![/FONT][/CENTER]<br><br>"+
         "[CENTER][FONT=book antiqua]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт![/FONT][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Ваша жалоба была отказана, т.к с момента нарушения прошло более трех дней![/FONT][/CENTER]<br><br>"+
	 '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
      title: 'Раздел Жалобы на игроков',
      color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
      },
      {
	  title: 'На рассмотрение',
	  content:
	    "[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Ваша жалоба была взята на рассмотрение! Убедительная просьба не создавать дубликаты данной темы и ожидать ответа в данной теме![/FONT][/CENTER]<br><br>"+
        '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: PIN_PREFIX,
	  status: true,
	},
     {
	  title: 'Не по форме',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Ваша жалоба была составлена не по форме![/FONT][/CENTER]<br>"+
        "[CENTER][FONT=book antiqua]Внимательно прочтите правила составления жалоб чтобы впредь не создавать данных ошибок![/FONT][/CENTER]<br><br>"+
		"[URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3429349/']*Жмяк*[/URL]<br>"+
	    '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: 'Причины для отказа',
      color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
	},
{
	  title: 'Нету в системе логов',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Данное нарушение в системе логирования было не обнаружено...[/FONT][/CENTER]<br>"+
        '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Нет нарушений',
	  content:
        "[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Со стороны игрока нарушения не было...[/FONT][/CENTER]<br>"+
        "[CENTER][FONT=book antiqua]Внимательно прочтите правила серверов - [/FONT][URL='https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/'][FONT=book antiqua]*жмяк*[/FONT][/URL][/CENTER]<br>"+
        '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: 'От 3 лица',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Ваша жалоба была составлена от 3-его лица, мы не можем ее рассмотреть...[/FONT][/CENTER]<br>"+
        '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Отсутствуют док-ва',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Вы не предоставили какие-либо доказательства нарушения со стороны игрока! Используйте фото/видео хостинг для отправки доказательств![/FONT][/CENTER]<br>"+
        '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Недостаточно док-в',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Предоставленных доказательств не достаточно чтобы подтвердить нарушение со стороны игрока![/FONT][/CENTER]<br>"+
	    '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: 'Док-ва отредактированы',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Доказательства которые вы представили были отредактированы, поэтому рассмотрению не подлежит![/FONT][/CENTER]<br>"+
	    '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: 'Док-ва в соц-сети',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"Ваша жалоба была отказана, т.к доказательства сделанные в соц. сети не принимаются! Используйте фото/видео хостинги Youtube, imgut, Яписк и подобные!<br><br>"+
		 '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Не работают док-ва',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Предоставленные доказательства не работают! В следующий раз загружайте доказательства через фото/видео хостинг![/FONT][/CENTER]<br>"+
		 '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: 'Нету /time',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]В предоставленных доказательства отсутствует /time! В следующий раз не забывайте при каждом нарушении делать скриншот с /time![/FONT][/CENTER]<br>"+
	 '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Нужен фрапс',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]В данном нарушении нужна видеофиксация, поэтому данная жалоба рассмотрению не подлежит! [/FONT][/CENTER]<br>"+
	 '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: 'Неполный фрапс',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Видео запись была не полная, поэтому мы вынуждены отказать! [/FONT][/CENTER]<br>"+
		 '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Нету условий сделки',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]В ваших доказательствах отсутствует условие сделки, поэтому данная жалоба рассмотрению не подлежит! [/FONT][/CENTER]<br>"+
		 '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Отсутствуют Тайм-коды',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Если видео длится более 3-ех минут, вам следует указать таймкоды, иначе ваша жалоба будет отказана! [/FONT][/CENTER]<br>"+
	  '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
      {
	  title: 'Системный промо ',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Ваша жалоба была отказана, т.к промокод является системным или выпущен разработчиками! [/FONT][/CENTER]"+
	 '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Уже был ответ ',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Вам ранее был дан ответ на вашу жалобу, убедительная просьба прекратить создавать дубликаты данной темы, в противном случае ваш форумный аккаунт будет заблокирован! [/FONT][/CENTER]<br>"+
	 '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: 'Уже был наказан',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Ваша жалоба была отказана, т.к игрок был ранее наказан! [/FONT][/CENTER]<br>"+
	 '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Более 72-ух часов',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Ваша жалоба была отказана, т.к с момента нарушения прошло более 72-ух часов! [/FONT][/CENTER]<br>"+
	 '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'Долг был дан не через банк',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Ваша жалоба была отказана, т.к займы должны выдаваться строго через банковские счета! [/FONT][/CENTER]"+
		 '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
      {
	  title: 'После срока возврата долга прошло 10 дней',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Ваша жалоба была отказана, т.к с момента истечения срока займа прошло более 10-ти дней! [/FONT][/CENTER]"+
		 '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: 'Условия о долге в соц. сетях',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Ваша жалоба была отказана, т.к договор о долге был сделан через соц. сети, поэтому жалоба рассмотрению не подлежит! [/FONT][/CENTER]"+
	   '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
      {
	  title: 'Нарушения правил в Игровом Процессе',
      color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
	},
   {
	  title: 'DM',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![Spoiler[/FONT][/COLOR][COLOR=lavender][FONT=book antiqua]] [COLOR=red]2.19 | [/COLOR][/FONT][COLOR=red][FONT=book antiqua][COLOR=lavender] [/COLOR][COLOR=rgb(255, 255, 255)]Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины.[/COLOR][COLOR=lavender][COLOR=red]  | Jail 60 минут[/COLOR][/COLOR][/FONT][/COLOR][/COLOR][COLOR=rgb(255, 255, 255)][FONT=book antiqua][/Spoiler][/FONT][/COLOR][/B][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
	  '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'DB',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![Spoiler] [/FONT][/COLOR][COLOR=lavender][FONT=book antiqua][COLOR=red]2.13 |[/COLOR][/FONT][/COLOR][COLOR=lavender][COLOR=red][FONT=book antiqua][COLOR=rgb(255, 255, 255)] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта[/COLOR][COLOR=lavender] [COLOR=red] | Jail 60 минут. [/COLOR][/COLOR][/FONT][/COLOR][/COLOR][COLOR=rgb(255, 255, 255)][[FONT=book antiqua]/Spoiler][/FONT][/COLOR][/B][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		 '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'RK',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![Spoiler][/FONT][/COLOR][COLOR=lavender][FONT=book antiqua] [COLOR=red]2.14 | [/COLOR][/FONT][COLOR=red][FONT=book antiqua][COLOR=lavender] [/COLOR][COLOR=rgb(255, 255, 255)]Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти[/COLOR][COLOR=lavender] [COLOR=red] | Jail 30 минут. [/COLOR][/COLOR][/FONT][/COLOR][/COLOR][COLOR=rgb(255, 255, 255)][FONT=book antiqua][/Spoiler][/FONT][/COLOR][/B][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
	 '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'TK',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![Spoiler][/FONT][/COLOR][COLOR=lavender][FONT=book antiqua] [COLOR=red]2.15 | [/COLOR][/FONT][COLOR=red][FONT=book antiqua][COLOR=rgb(255, 255, 255)] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины.[/COLOR][COLOR=lavender][COLOR=rgb(255, 255, 255)] [/COLOR][COLOR=red] | Jail 60 минут / Warn (за два и более убийства)[/COLOR][/COLOR][/FONT][/COLOR][/COLOR][COLOR=rgb(255, 255, 255)][FONT=book antiqua][/Spoiler][/FONT][/COLOR][/B][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		 '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'SK',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![Spoiler] [/FONT][/COLOR][COLOR=lavender][FONT=book antiqua][COLOR=red]2.16 | [/COLOR][/FONT][COLOR=red][FONT=book antiqua][COLOR=rgb(255, 255, 255)] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них.[/COLOR][COLOR=lavender][COLOR=rgb(255, 255, 255)] [/COLOR][COLOR=red] | Jail 60 минут / Warn (за два и более убийства)[/COLOR][/COLOR][/FONT][/COLOR][/COLOR][COLOR=rgb(255, 255, 255)][FONT=book antiqua][/Spoiler][/FONT][/COLOR][/B][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		 '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Mass DM',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![Spoiler][/FONT][/COLOR][COLOR=lavender][FONT=book antiqua] [COLOR=red]2.20 | [/COLOR][/FONT][COLOR=red][FONT=book antiqua][COLOR=lavender] [/COLOR][COLOR=rgb(255, 255, 255)]Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более.[/COLOR][COLOR=lavender][COLOR=red]  | Warn / Бан 7-15 дней.[/COLOR][/COLOR][/FONT][/COLOR][/COLOR][COLOR=rgb(255, 255, 255)][FONT=book antiqua][/Spoiler][/FONT][/COLOR][/B][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		 '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'ЕПП',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![SPOILER][COLOR=rgb(255, 255, 255)][FONT=book antiqua] [/FONT][/COLOR][COLOR=lavender][FONT=book antiqua][COLOR=red]2.47 | [/COLOR][/FONT][COLOR=red][FONT=book antiqua] [COLOR=rgb(255, 255, 255)]Запрещено ездить по полям на легковые машины и мотоциклах. [/COLOR][COLOR=lavender][COLOR=red] | Jail 30 минут[/COLOR][/COLOR][/FONT][/COLOR][/COLOR][/SPOILER][/FONT][/COLOR][/B][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		 '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'ЕПП фура/инкас',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![Spoiler] [COLOR=red]2.47 | [COLOR=lavender] [/COLOR][COLOR=rgb(255, 255, 255)]Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [/COLOR][COLOR=lavender][COLOR=red]| Jail 60 минут[/COLOR][/COLOR][/COLOR][/Spoiler][/FONT][/COLOR][/B][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		 '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Уход от RP',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![/COLOR][/FONT][/B][/CENTER]"+
        "[SPOILER][COLOR=rgb(255, 0, 0)]2.02[/COLOR]. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [COLOR=rgb(255, 0, 0)]| Jail 30 минут / WarnПримечание:[/COLOR] уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания или ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа. Уходить в интерьер или зеленую зону во время перестрелки с целью избежать смерти или уйти от Role Play процесса и так далее.[/SPOILER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		 '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Багоюз анимации',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![/COLOR][/FONT][/B][/CENTER]"+
        "[SPOILER][COLOR=rgb(255, 0, 0)]2.55.[/COLOR] Запрещается багоюз связанный с анимацией в любых проявлениях. [COLOR=rgb(255, 0, 0)]| Jail 60 / 120 минут[/COLOR][/SPOILER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		 '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'NonRP аксессуар',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту! [/COLOR][/FONT][/B][/CENTER]"+
        "[SPOILER][CENTER][B][COLOR=lavender][FONT=book antiqua][COLOR=red]2.52 |[/COLOR] [/FONT][COLOR=red][FONT=book antiqua][COLOR=rgb(255, 255, 255)] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [/COLOR][COLOR=lavender][COLOR=red]  | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут     [/COLOR][/COLOR][/FONT][/COLOR][/COLOR][COLOR=lavender][COLOR=red][FONT=book antiqua][COLOR=lavender][COLOR=red]  [/COLOR][/COLOR][/FONT][/COLOR][/COLOR][/B][/CENTER][/SPOILER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		 '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Слив склада',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![Spoiler][COLOR=red]2.21 | [COLOR=rgb(255, 255, 255)] 2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [/COLOR][COLOR=lavender][COLOR=red]  | Ban 15-30 дней / Permban[/COLOR][/COLOR][/COLOR][/Spoiler][/COLOR][/FONT][/B][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		 '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Аморальные действия',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![Spoiler][COLOR=red]2.08 | [COLOR=lavender] [/COLOR][COLOR=rgb(255, 255, 255)]Запрещена любая форма аморальных действий сексуального характера в сторону игроков[/COLOR][COLOR=lavender] [COLOR=red]  | Jail 30 минут / Warn[/COLOR][/COLOR][/COLOR][/Spoiler][/COLOR][/FONT][/B][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		 '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Обман на долг',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![Spoiler][COLOR=red]2.57 | [COLOR=lavender] [/COLOR][COLOR=rgb(255, 255, 255)]Запрещается брать в долг игровые ценности и не возвращать их.[/COLOR][COLOR=lavender][COLOR=rgb(255, 255, 255)]  [/COLOR][COLOR=red]| Ban 30 дней / Permban[/COLOR][/COLOR][/COLOR][/Spoiler][/COLOR][/FONT][/B][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		 '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Обход игровой системы багами и недоработками',
      content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
        "[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![Spoiler][COLOR=red]2.21 | [COLOR=rgb(255, 255, 255)] Запрещено пытаться обходить игровую систему или использовать любые баги сервера [/COLOR][COLOR=lavender][COLOR=red] | Ban 15-30 дней / Permban[/COLOR][/COLOR][/COLOR][/Spoiler][/COLOR][/FONT][/B][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		 '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
	{
	  title: 'Читы/Стороннее ПО/Сборка',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![Spoiler][COLOR=red]2.05 | [COLOR=rgb(255, 255, 255)]Запрещено хранить / использовать / распространять стороннее программное обеспечение, сборки или любые другие средства, позволяющие получить преимущество над другими игроками[/COLOR][COLOR=lavender][COLOR=red] | Ban 15 - 30 дней / PermBan [/COLOR][/COLOR][/COLOR][/Spoiler][/COLOR][/FONT][/B][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		 '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Редактирование в личных целях',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту! [SPOILER][COLOR=rgb(255, 255, 255)]Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком[/COLOR][COLOR=lavender] [COLOR=red] | Ban 7 дней + ЧС организации [/COLOR][/COLOR][/SPOILER][/FONT][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		 '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Убийство при задержании',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![Spoiler] | [FONT=book antiqua][COLOR=rgb(255, 255, 255)] Запрещено целенаправленно убивать преступника во время задержания без весомой Role Play причины.  [/COLOR][COLOR=lavender][COLOR=red]  | Warn [/COLOR][/COLOR][/FONT][/Spoiler][/COLOR][/FONT][/B][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		 '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Арест в казино/аукционе',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![/COLOR][/FONT][/B][/CENTER][SPOILER][FONT=book antiqua][COLOR=rgb(255, 255, 255)]2.50  | [COLOR=rgb(255, 255, 255)] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [/COLOR][/COLOR][/FONT][COLOR=red][FONT=book antiqua][COLOR=lavender][COLOR=red]  | Ban 7 - 15 дней + увольнение из организации [/COLOR][/COLOR][/FONT][/COLOR][/SPOILER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		 '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Помеха игр. процессу',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![SPOILER]2.04. Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. | Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/SPOILER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
	  '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
  {
	  title: 'Нарушение правил текстового чата',
      color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
	},
    {
	  title: 'Capslock',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту! [/COLOR][/FONT][/B][FONT=book antiqua][SPOILER][COLOR=rgb(255, 0, 0)]3.02.[/COLOR] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/SPOILER][/FONT][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Flood',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту! [/COLOR][/FONT][/B][FONT=book antiqua][SPOILER][COLOR=red]3.05. [/COLOR][COLOR=rgb(255, 255, 255)]Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока[/COLOR][COLOR=red] [COLOR=red]| Mute 30 минут[/COLOR][/COLOR][/SPOILER][/FONT][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: 'Metagaming',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![SPOILER][/COLOR][COLOR=rgb(255, 0, 0)]2.18.[/COLOR][COLOR=rgb(255, 255, 255)] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [/COLOR][COLOR=rgb(255, 0, 0)]| Mute 30 минутПримечание:[/COLOR][COLOR=rgb(255, 255, 255)] использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/COLOR][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR][COLOR=rgb(255, 255, 255)] телефонное общение также является IC чатом.[/COLOR][COLOR=rgb(255, 0, 0)]Исключение:[/COLOR][COLOR=rgb(255, 255, 255)] за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.[/SPOILER][/COLOR][/FONT][/B][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Оскорбление в nRP Чат',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![/COLOR][/FONT][/B][FONT=book antiqua][SPOILER][COLOR=rgb(255, 0, 0)]3.03.[/COLOR] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/SPOILER][/FONT][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Оскорбление/упоминание родни',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![/COLOR][/FONT][/B][/CENTER][SPOILER][CENTER][FONT=book antiqua][COLOR=rgb(255, 0, 0)]3.04[/COLOR]. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 - 15 днейПримечание:[/COLOR] термины MQ, rnq расценивается, как упоминание родных.[COLOR=rgb(255, 0, 0)]Исключение:[/COLOR] если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/FONT][/CENTER][/SPOILER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Мат в вип чат',
      content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![/COLOR][/FONT][/B][/CENTER][FONT=book antiqua][SPOILER][COLOR=rgb(255, 0, 0)]3.23.[/COLOR] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/SPOILER][/FONT]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Слив глобального чата',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![/COLOR][/FONT][/B][FONT=book antiqua][SPOILER][COLOR=rgb(255, 0, 0)]3.08.[/COLOR] Запрещены любые формы «слива» посредством использования глобальных чатов [COLOR=rgb(255, 0, 0)]| PermBan[/COLOR][/SPOILER][/FONT][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Угроза о наказании от адм',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![/COLOR][/FONT][/B][FONT=book antiqua][SPOILER][COLOR=rgb(255, 0, 0)]3.09.[/COLOR] Запрещены любые угрозы о наказании игрока со стороны администрации [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/SPOILER][/FONT][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Оскорбление/неуважительное отношение к адм',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![/COLOR][/FONT][/B][SPOILER][FONT=book antiqua][COLOR=rgb(255, 0, 0)]2.54.[/COLOR] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [COLOR=rgb(255, 0, 0)]| Mute 180 минутПример[/COLOR]: оформление жалобы в игре с текстом: Быстро починил меня, Админы вы задрали уже когда работать будете меня тут ДБшат я 3 жалобы уже подал!!!!!!!!, МОЗГИ ВКЛЮЧИТЕ Я УВОЛЮ ВАС ЩА и т.д. и т.п., а также при взаимодействии с другими игроками.[COLOR=rgb(255, 0, 0)]Пример[/COLOR]: оскорбление администрации в любой чат, включая репорт подлежит наказанию в виде блокировки доступа к использованию всех видов чатов [COLOR=rgb(255, 0, 0)]- Mute 180 минут.[/COLOR][/FONT][/SPOILER][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Ввод в заблуждение(командами)',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![/COLOR][/FONT][/B][SPOILER][FONT=book antiqua][COLOR=rgb(255, 0, 0)]3.11.[/COLOR] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBanПримечание:[/COLOR] /me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена.[/FONT][/SPOILER][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Пропаганда/Провокация и коллективный флуд',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![/COLOR][/FONT][/B][SPOILER][FONT=book antiqua][COLOR=rgb(255, 0, 0)]3.18.[/COLOR] Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов [COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 10 дней[/COLOR][/FONT][/SPOILER][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Транслит',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![/COLOR][/FONT][/B][SPOILER][FONT=book antiqua][COLOR=rgb(255, 0, 0)]3.20.[/COLOR] Запрещено использование транслита в любом из чатов [COLOR=rgb(255, 0, 0)]| Mute 30 минутПример:[/COLOR] «Privet», «Kak dela», «Narmalna».[/FONT][/SPOILER][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Общение на других языках',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![/COLOR][/FONT][/B][SPOILER][FONT=book antiqua][COLOR=rgb(255, 0, 0)]3.01[/COLOR]. Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке [COLOR=rgb(255, 0, 0)]| Устное замечание / Mute 30 минут[/COLOR][/FONT][/SPOILER][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Промокоды ',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![/COLOR][/FONT][/B][SPOILER][FONT=book antiqua][COLOR=rgb(255, 0, 0)]3.21.[/COLOR] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [COLOR=rgb(255, 0, 0)]| Ban 30 дней[/COLOR][/SPOILER][/FONT][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Торг в интерьере госс',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![/COLOR][/FONT][/B][SPOILER][FONT=book antiqua][COLOR=rgb(255, 0, 0)]3.22.[/COLOR] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC)[COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/FONT][/SPOILER][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
	  title: 'ООС угрозы',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![/COLOR][/FONT][/B][SPOILER][FONT=book antiqua][COLOR=rgb(255, 0, 0)]2.37.[/COLOR] Запрещены OOC угрозы, в том числе и завуалированные [COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 дней[/COLOR][/SPOILER][/FONT][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Перенос конфликта из IC в OOC и наоборот',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![/COLOR][/FONT][/B][SPOILER][FONT=book antiqua][COLOR=rgb(255, 0, 0)]2.36.[/COLOR] Запрещено переносить конфликты из IC в OOC и наоборот [COLOR=rgb(255, 0, 0)]| Warn[/COLOR][/FONT][/SPOILER][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Реклама',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![/COLOR][/FONT][/B][SPOILER][FONT=book antiqua][COLOR=rgb(255, 0, 0)]2.31.[/COLOR] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [COLOR=rgb(255, 0, 0)]| Ban 7 дней / PermBan[/COLOR][/FONT][/SPOILER][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
	  title: 'Выдача себя за адм',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![/COLOR][/FONT][/B][SPOILER][FONT=book antiqua][COLOR=rgb(255, 0, 0)]3.10.[/COLOR] Запрещена выдача себя за администратора, если таковым не являетесь [COLOR=rgb(255, 0, 0)]| Ban 7 - 15 + ЧС администрации[/COLOR][/FONT][/SPOILER][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: 'NonRP нарушения',
      color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
	},
      {
	  title: 'nRP поведение',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![SPOILER][COLOR=rgb(255, 0, 0)]2.01.[/COLOR] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][/SPOILER][/FONT][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
	  title: 'nRP обман',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![SPOILER][COLOR=rgb(255, 0, 0)]2.05.[/COLOR] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [COLOR=rgb(255, 0, 0)]| PermBan[/COLOR][/SPOILER][/FONT][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
	  title: 'nRP edit',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![SPOILER]Запрещено редактирование объявлений, не соответствующих ПРО[color=red]  [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/SPOILER][/FONT][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
	  title: 'nRP эфир',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![SPOILER]Запрещено проведение эфиров, не соответствующих Role Play правилам и логике[color=red]  [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/SPOILER][/FONT][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
title: 'nRP розыск',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![SPOILER]Запрещено выдавать розыск без Role Play причины[color=red]  [COLOR=rgb(255, 0, 0)]| Warn / Jail 30 минут [/COLOR][/SPOILER][/FONT][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: 'nRP Воинская Часть',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![/FONT][SPOILER][FONT=book antiqua]Запрещено нападать на военную часть нарушая Role Play  [COLOR=rgb(255, 0, 0)]| Warn (для ОПГ) / Jail 30 минут (для Гражданских)[/COLOR][/FONT][/SPOILER][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	 {
	  title: 'Нарушения в NickName',
      color:'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
	},
    	{
	  title: 'Оскорбительный NickName',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![/FONT][SPOILER][FONT=book antiqua][COLOR=rgb(255, 0, 0)]4.09.[/COLOR] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [COLOR=rgb(255, 0, 0)]| Устное замечание + смена игрового никнейма / PermBan[/COLOR][/FONT][/SPOILER][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: 'Фейковый NickName',
	  content:
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Ваша жалоба была рассмотрена и я готов(-а) вынести вердикт! Игрок получит наказание по следующему пункту![/FONT][SPOILER][FONT=book antiqua][COLOR=rgb(255, 0, 0)]4.10.[/COLOR] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию[COLOR=rgb(255, 0, 0)] | Устное замечание + смена игрового никнейма / PermBan[/COLOR][/FONT][/SPOILER][/CENTER]"+
		"[CENTER][FONT=book antiqua]Наказание будет выдано в течение 24-х часов![/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'В другой раздел',
      color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
	},
    {
	  title: 'В жалобы на Администраторов',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Вы ошиблись разделом, обратитесь пожалуйста в жалобы на администрацию - [/FONT][URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1994/'][FONT=book antiqua]*тык*[/FONT][/URL][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'В жалобы на лидеров',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Вы ошиблись разделом, обратитесь пожалуйста в жалобы на лидеров -  [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.1995/']*тык*[/URL][/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'В обжалования',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Вы ошиблись разделом, обратитесь пожалуйста в жалобы на лидеров -  [URL='https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1997/']*тык*[/URL][/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
         {
	  title: 'В жалобы на игроков',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Вы ошиблись разделом, обратитесь пожалуйста в жалобы на игроков - [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1996/']*тык*[/URL][/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    	{
	  title: 'В жалобы на хелперов',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Вы ошиблись разделом, обратитесь пожалуйста в жалобы на Агентов Поддержки - [URL='https://forum.blackrussia.online/threads/%E2%98%ACvladivostok-%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D0%BE%D0%B2-%D0%9F%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.5243015/']*тык*[/URL][/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'В жалобы на сотрудников',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Вы ошиблись разделом, обратитесь пожалуйста в жалобы на Сотрудников - [URL='https://forum.blackrussia.online/forums/%D0%93%D0%BE%D1%81%D1%83%D0%B4%D0%B0%D1%80%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5-%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8.1971/']*тык*[/URL][/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
      title: 'RolePlay Биографии',
      color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
    },
	{
	  title: 'Одобрено',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][COLOR=rgb(255, 255, 255)] [FONT=book antiqua]Поздравляю, ваша RolePlay Биография одобрена![/FONT][/COLOR]<3[/CENTER]<br>"+
	 '[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: 'Не по форме',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Ваша RolePlay Биография имеет статус отказано т.к она была составлена не по форме![/FONT][/CENTER]<br>"+
	 "[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)] Внимательно прочтите правила создания RolePlay Биографий, чтобы впредь не допускать данных ошибок![/COLOR][/FONT][/B][/CENTER]<br><br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: 'Заголовок не по форме',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Ваша RolePlay Биография имеет статус отказано т.к заголовок был составлен не по форме![/FONT][/CENTER]<br>"+
	 "[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)] Внимательно прочтите правила создания RolePlay Биографий, чтобы впредь не допускать данных ошибок![/COLOR][/FONT][/B][/CENTER]<br><br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Уже одобрена',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Ваша RolePlay Биография имеет статус отказано, т.к она была ранее одобрена![/FONT][/CENTER]<br>"+
	 "[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)] Внимательно прочтите правила создания RolePlay Биографий, чтобы впредь не допускать данных ошибок![/COLOR][/FONT][/B][/CENTER]<br><br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Детство, Юность и В.Ж не раздельно',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B] [COLOR=rgb(255, 255, 255)][FONT=book antiqua]Ваша RolePlay биография имеет статус отказано, т.к пункты Детство, Юность и Взрослая жизнь должны быть написаны отдельно![/FONT][/COLOR][/B][/CENTER]<br>"+
	 "[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)] Внимательно прочтите правила создания RolePlay Биографий, чтобы впредь не допускать данных ошибок![/COLOR][/FONT][/B][/CENTER]<br><br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: 'Меньше 18-ти лет',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B] [COLOR=rgb(255, 255, 255)][FONT=book antiqua]Ваша RolePlay биография имеет статус отказано, т.к возраст в вашей биографии меньше 18-ти лет![/FONT][/COLOR][/B][/CENTER]<br>"+
	 "[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)] Внимательно прочтите правила создания RolePlay Биографий, чтобы впредь не допускать данных ошибок![/COLOR][/FONT][/B][/CENTER]<br><br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: 'Недостаточно инфы',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B] [COLOR=rgb(255, 255, 255)][FONT=book antiqua]Ваша RolePlay биография имеет статус отказано, т.к в ней недостаточно информации![/FONT][/COLOR][/B][/CENTER]<br>"+
	 "[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)] Внимательно прочтите правила создания RolePlay Биографий, чтобы впредь не допускать данных ошибок![/COLOR][/FONT][/B][/CENTER]<br><br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Неграмотно',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)]Ваша RolePlay биография имеет статус отказано, т.к в ней  присутствуют грамматические ошибки![/COLOR][/FONT][/B][/CENTER]<br>"+
	 "[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)] Внимательно прочтите правила создания RolePlay Биографий, чтобы впредь не допускать данных ошибок![/COLOR][/FONT][/B][/CENTER]<br><br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Недостаточно инфы во внешности',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)] Ваша RolePlay биография имеет статус отказано, т.к в ней присутствует недостаточно информации об описании внешности.[/COLOR][/FONT][/B][/CENTER]<br>"+
	 "[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)] Внимательно прочтите правила создания RolePlay Биографий, чтобы впредь не допускать данных ошибок![/COLOR][/FONT][/B][/CENTER]<br><br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
{
	  title: 'Недостаточно инфы о характере',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)] Ваша RolePlay биография имеет статус отказано, т.к в ней присутствует недостаточно информации об описании характера.[/COLOR][/FONT][/B][/CENTER]<br>"+
	 "[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)] Внимательно прочтите правила создания RolePlay Биографий, чтобы впредь не допускать данных ошибок![/COLOR][/FONT][/B][/CENTER]<br><br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
{
	  title: 'Недостаточно инфы об детстве',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)] Ваша RolePlay биография имеет статус отказано, т.к в ней присутствует недостаточно информации об описании о детстве![/COLOR][/FONT][/B][/CENTER]<br>"+
	 "[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)] Внимательно прочтите правила создания RolePlay Биографий, чтобы впредь не допускать данных ошибок![/COLOR][/FONT][/B][/CENTER]<br><br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
{
	  title: 'Недостаточно инфы о юности',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)] Ваша RolePlay биография имеет статус отказано, т.к в ней недостаточно информации об описания Юности![/COLOR][/FONT][/B][/CENTER]<br>"+
	 "[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)] Внимательно прочтите правила создания RolePlay Биографий, чтобы впредь не допускать данных ошибок![/COLOR][/FONT][/B][/CENTER]<br><br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
{
	  title: 'Недостаточно информации о взрослой жизни',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)] Ваша RolePlay биография имеет статус отказано, т.к в ней недостаточно информации об описания Взрослой жизни![/COLOR][/FONT][/B][/CENTER]<br>"+
	 "[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)] Внимательно прочтите правила создания RolePlay Биографий, чтобы впредь не допускать данных ошибок![/COLOR][/FONT][/B][/CENTER]<br><br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
{
	  title: 'Мало информации о семье',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)] Ваша RolePlay биография имеет статус отказано, т.к в ней вы указали недостаточно информации о семье![/COLOR][/FONT][/B][/CENTER]<br>"+
	 "[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)] Внимательно прочтите правила создания RolePlay Биографий, чтобы впредь не допускать данных ошибок![/COLOR][/FONT][/B][/CENTER]<br><br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: 'От 3-его лица',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)] Ваша RolePlay биография имеет статус отказано, т.к вы написали её от 3-его лица![/COLOR][/FONT][/B][/CENTER]<br>"+
	 "[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)] Внимательно прочтите правила создания RolePlay Биографий, чтобы впредь не допускать данных ошибок![/COLOR][/FONT][/B][/CENTER]<br><br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Супергерой ',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)] Ваша RolePlay биография имеет статус отказано, т.к вы приписали своему персонажи супергеройские способности[/COLOR][/FONT][/B][/CENTER]<br>"+
		 "[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)] Внимательно прочтите правила создания RolePlay Биографий, чтобы впредь не допускать данных ошибок![/COLOR][/FONT][/B][/CENTER]<br><br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: 'Copypaste',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)] Ваша RolePlay биография имеет статус отказано, т.к вы ее скопировали![/COLOR][/FONT][/B][/CENTER]<br>"+
		 "[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)] Внимательно прочтите правила создания RolePlay Биографий, чтобы впредь не допускать данных ошибок![/COLOR][/FONT][/B][/CENTER]<br><br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: 'nRP Nickname',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)] Ваша RolePlay биография имеет статус отказано, т.к у вас non RolePlay Nickname[/COLOR][/FONT][/B][/CENTER]<br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)] Внимательно прочтите правила создания RolePlay Биографий, чтобы впредь не допускать данных ошибок![/COLOR][/FONT][/B][/CENTER]<br><br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: 'Nickname написан на английском',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)] Ваша RolePlay биография имеет статус отказано, т.к у ваш NickName должен быть написан на русском языке![/COLOR][/FONT][/B][/CENTER]<br>"+
	 "[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)] Внимательно прочтите правила создания RolePlay Биографий, чтобы впредь не допускать данных ошибок![/COLOR][/FONT][/B][/CENTER]<br><br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Д.Р. не совпадает с годом',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)] Ваша RolePlay биография имеет статус отказано, т.к возраст вашего персонажа не совпадает с датой рождения![/COLOR][/FONT][/B][/CENTER]<br>"+
		 "[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)] Внимательно прочтите правила создания RolePlay Биографий, чтобы впредь не допускать данных ошибок![/COLOR][/FONT][/B][/CENTER]<br><br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: 'Дата рождения не полностью',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)] Ваша RolePlay биография имеет статус отказано, т.к дата рождения вашего персонажа расписана не полностью![/COLOR][/FONT][/B][/CENTER]<br>"+
	 "[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)] Внимательно прочтите правила создания RolePlay Биографий, чтобы впредь не допускать данных ошибок![/COLOR][/FONT][/B][/CENTER]<br><br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
        title: 'RolePlay Ситуации',
        color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
    },
    	{
	  title: 'Одобрено',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Поздравляю, Ваша RolePlay Ситуация была одобрена!)[/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
      {
	  title: 'Не по форме',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Внимательно посмотрев вашу RolePlay Ситуацию, могу вынести вердикт![/FONT][/CENTER]<br>"+
		"[CENTER][FONT=book antiqua]Ваша RolePlay Ситуация имеет статус отказано, т.к она составлена не по форме![/FONT][/CENTER]<br>"+
        "[CENTER][FONT=book antiqua]Внимательно прочтите правила создания RolePlay Ситуаций, чтобы впредь не допускать данных ошибок!/FONT][/FONT][/CENTER][/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: 'Заголовок не по форме',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Внимательно посмотрев вашу RolePlay Ситуацию, могу вынести вердикт![/FONT][/CENTER]<br>"+
		"[CENTER][FONT=book antiqua]Ваша RolePlay Ситуация имеет статус отказано, т.к заголовок был составлен не по форме![/FONT][/CENTER]<br>"+
        "[CENTER][FONT=book antiqua]Внимательно прочтите правила создания RolePlay Ситуаций, чтобы впредь не допускать данных ошибок!/FONT][/FONT][/CENTER][/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
        {
	  title: 'Перепутал раздел',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Возможно вы ошиблись раздел, для ознакомления с данным разделом прочтите закрепленную тему![/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
      {
	  title: 'Нету смысловой нагрузки',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Внимательно посмотрев вашу RolePlay Ситуацию, могу вынести вердикт![/FONT][/CENTER]<br>"+
		"[CENTER][FONT=book antiqua]Ваша RolePlay Ситуация имеет статус отказано, т.к в ней нету какой-либо смысловой нагрузки![/FONT][/CENTER]<br>"+
        "[CENTER][FONT=book antiqua]Внимательно прочтите правила создания RolePlay Ситуаций, чтобы впредь не допускать данных ошибок!/FONT][/FONT][/CENTER][/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
       {
	  title: 'Неграмотно',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Внимательно посмотрев вашу RolePlay Ситуацию, могу вынести вердикт![/FONT][/CENTER]<br>"+
		"[CENTER][FONT=book antiqua]Ваша RolePlay Ситуация имеет статус отказано, т.к в ней присутствуют грамматические ошибки![/FONT][/CENTER]<br>"+
        "[CENTER][FONT=book antiqua]Внимательно прочтите правила создания RolePlay Ситуаций, чтобы впредь не допускать данных ошибок!/FONT][/FONT][/CENTER][/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
        {
	  title: 'ПГ, нРП поведение и т.д',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Внимательно посмотрев вашу RolePlay Ситуацию, могу вынести вердикт![/FONT][/CENTER]<br>"+
		"[CENTER][FONT=book antiqua]Ваша RolePlay Ситуация имеет статус отказано, т.к в ней вы нарушаете все возможные правила RolePlay Логики![/FONT][/CENTER]<br>"+
        "[CENTER][FONT=book antiqua]Внимательно прочтите правила создания RolePlay Ситуаций, чтобы впредь не допускать данных ошибок!/FONT][/FONT][/CENTER][/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
         {
	  title: 'Copypaste',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Внимательно посмотрев вашу RolePlay Ситуацию, могу вынести вердикт![/FONT][/CENTER]<br>"+
		"[CENTER][FONT=book antiqua]Ваша RolePlay Ситуация имеет статус отказано, т.к вы её скопировали![/FONT][/CENTER]<br>"+
        "[CENTER][FONT=book antiqua]Внимательно прочтите правила создания RolePlay Ситуаций, чтобы впредь не допускать данных ошибок!/FONT][/FONT][/CENTER][/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Неофициальные RolePlay Огранизации',
      color: 'oswald: 3px; color: #FFFFFF; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
    },
    {
	  title: 'Одобрено',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Поздравляю, Ваша Неофициальная RolePlay Организация имеет статус одобрено!)[/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Не по форме',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Внимательно посмотрев информацию о вашей Неофициальной RolePlay Организации, могу вынести вердикт![/FONT][/CENTER]<br>"+
		"[CENTER][FONT=book antiqua]Ваша Неофициальная RolePlay Организация имеет статус отказано, т.к она составлена не по форме![/FONT][/CENTER]<br>"+
        "[CENTER][FONT=book antiqua]Внимательно прочтите правила создания Неофициальных RolePlay Организаций, чтобы впредь не допускать данных ошибок!/FONT][/FONT][/CENTER][/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Заголовок не по форме',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Внимательно посмотрев информацию о вашей Неофициальной RolePlay Организации, могу вынести вердикт![/FONT][/CENTER]<br>"+
		"[CENTER][FONT=book antiqua]Ваша Неофициальная RolePlay Организация имеет статус отказано, т.к заголовок был составлен не по форме![/FONT][/CENTER]<br>"+
        "[CENTER][FONT=book antiqua]Внимательно прочтите правила создания Неофициальных RolePlay Организаций, чтобы впредь не допускать данных ошибок!/FONT][/FONT][/CENTER][/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Заголовок не по форме',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Внимательно посмотрев информацию о вашей Неофициальной RolePlay Организации, могу вынести вердикт![/FONT][/CENTER]<br>"+
		"[CENTER][FONT=book antiqua]Ваша Неофициальная RolePlay Организация имеет статус отказано, т.к заголовок был составлен не по форме![/FONT][/CENTER]<br>"+
        "[CENTER][FONT=book antiqua]Внимательно прочтите правила создания Неофициальных RolePlay Организаций, чтобы впредь не допускать данных ошибок!/FONT][/FONT][/CENTER][/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Перепутали раздел',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Возможно вы перепутали раздел, для того чтобы узнать предназначение данного раздела прочитайте закрепленную тему![/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Copypaste',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Внимательно посмотрев информацию о вашей Неофициальной RolePlay Организации, могу вынести вердикт![/FONT][/CENTER]<br>"+
		"[CENTER][FONT=book antiqua]Ваша Неофициальная RolePlay Организация имеет статус отказано, т.к вы её скопировали![/FONT][/CENTER]<br>"+
        "[CENTER][FONT=book antiqua]Внимательно прочтите правила создания Неофициальных RolePlay Организаций, чтобы впредь не допускать данных ошибок!/FONT][/FONT][/CENTER][/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br>',
	  prefix: UNACCEPT_PREFIX,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: 'Nickname на Английском',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Внимательно посмотрев информацию о вашей Неофициальной RolePlay Организации, могу вынести вердикт![/FONT][/CENTER]<br>"+
		"[CENTER][FONT=book antiqua]Ваша Неофициальная RolePlay Организация имеет статус отказано, т.к Игровые никнеймы игроков написаны на английском языке![/FONT][/CENTER]<br>"+
        "[CENTER][FONT=book antiqua]Внимательно прочтите правила создания Неофициальных RolePlay Организаций, чтобы впредь не допускать данных ошибок!/FONT][/FONT][/CENTER][/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br>',
	  prefix: UNACCEPT_PREFIX,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: 'Неграмотно',
	  content:

		"[CENTER][B][FONT=book antiqua][COLOR=rgb(255, 255, 255)][ICODE]Здравствуйте уважаемый {{ user.name }} [/ICODE][/COLOR][/FONT][/B][/CENTER]<br><br>"+
		"[CENTER][FONT=book antiqua]Внимательно посмотрев информацию о вашей Неофициальной RolePlay Организации, могу вынести вердикт![/FONT][/CENTER]<br>"+
		"[CENTER][FONT=book antiqua]Ваша Неофициальная RolePlay Организация имеет статус отказано, т.к в ней содержится больше количество грамматических ошибок![/FONT][/CENTER]<br>"+
        "[CENTER][FONT=book antiqua]Внимательно прочтите правила создания Неофициальных RolePlay Организаций, чтобы впредь не допускать данных ошибок!/FONT][/FONT][/CENTER][/FONT][/CENTER]<br>"+
		'[CENTER][FONT=book antiqua]Приятной игры на [COLOR=rgb(44, 130, 201)]Vladivostok[/COLOR]![/FONT][/CENTER]<br>',
	  prefix: UNACCEPT_PREFIX,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
];
    	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницs
	addButton('Одобрено', 'accept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(110, 192, 113, 0.5);');
    addButton('Рассмотрено', 'watched', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(110, 192, 113, 0.5);');
    addButton('Закрыто', 'close', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);');
    addButton('Решено', 'decided', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);');
	addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);');
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
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 5px; margin-top: 10px; border-radius: 13px;">Шаблончики</button>`,
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


         function editThreadData(prefix, pin = false, JDarknet = true) {
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

    const Button2 = buttonConfig("ОПС", "https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/");

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
            <span class="slider round" style="padding-right: 20px;">
            <span class="addingText" style="display: block; width: max-content; margin: 5px; margin-left: 42px; margin-top: 2px;">Снег</span>
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