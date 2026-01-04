// ==UserScript==
// @name         [Русь]Скрипт для КФ Руси
// @namespace    https://forum.russia-game.ru/
// @version      0.0.9
// @description  Скрипт для КФ на Русь Мобайл вк автора @whdywbpwjd по вопросам и предложениям писать туда.
// @author       Grant Lukovskiy (@whdywbpwjd)
// @match        https://forum.russia-game.ru/*
// @include      https://forum.russia-game.ru/
// @license 	 MIT
// @collaborator none
// @icon  https://wblitz.net/media/images/clans/logo/3582.jpg
// @downloadURL https://update.greasyfork.org/scripts/497299/%5B%D0%A0%D1%83%D1%81%D1%8C%5D%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20%D0%A0%D1%83%D1%81%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/497299/%5B%D0%A0%D1%83%D1%81%D1%8C%5D%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20%D0%A0%D1%83%D1%81%D0%B8.meta.js
// ==/UserScript==
 
(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Отказано
const ACCEPT_PREFIX = 8; // Одобрено
const RESHENO_PREFIX = 6; // Решено
const PIN_PREFIX = 2; // на рассмотрение 
const GA_PREFIX = 12; // ГА
const COMMAND_PREFIX = 10; // Команде проекта
const CLOSE_PREFIX = 7; // Закрыто
const VAJNO_PREFIX = 1; // важно
const WATCHED_PREFIX = 9;
const TEX_PREFIX = 13; // теху
const PREFIKS = 0; // нету
const buttons = [

     {
      title: '≈≈≈≈≈≈≈≈≈≈≈≈≈>by Grant Lukovskiy<≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈',
      },
      {
	  title: '==========>Одобренные жалобы<==========================',
	},
	{
	title: '——————————>Наказания за поведение<——————————————',
	},
   {
	  title: 'DM',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]4.12 Запрещено убийство или нанесение урона без убедительной внутриигровой причины (DM) I [COLOR=yellow]Деморган 60 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'DB',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]4.07 Запрещено убийство или нанесение урона любым видом транспорта без убедительной ролевой причины (DB) I [COLOR=yellow]Деморган на 60 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'RK',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]4.08 Запрещено убийство игрока с целью мести, возвращение на место смерти в течение 15 минут и использование информации, которая привела к смерти, в дальнейшем. (RK) I [COLOR=yellow]Деморган от 30 до 60 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'TK',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]4.09 Запрещено убийство члена вашей организации без наличия убедительной ролевой причины (TK) I [COLOR=yellow]Деморган на 60 минут / Warn за 2 и более убийства[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'SK',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]4.10 Запрещено убийство или нанесение урона на территории фракции или организации, а также на месте появления игрока или выхода из закрытых интерьеров и их окрестностей. (SK) I [COLOR=yellow]Деморган на 60 минут / Warn за 2 и более убийства[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
		{
	  title: 'PG',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]4.11 Запрещено присваивание персонажу свойств, которые не соответствуют реальности, а также игра без учета страха за свою жизнь (PG) I [COLOR=yellow]Деморган на 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	title: 'Масс DM',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]4.12.1 Запрещено убийство или нанесение урона трём или более игрокам без убедительной внутриигровой причины. I [COLOR=yellow]Warn / Бан на 3-7 дней[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	title: 'Аморал действия',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]4.14 Запрещены любые формы аморального сексуального поведения в отношении других игроков. I [color=yellow]Деморган на 30 минут / Warn[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	title: 'Попытка OOC IC обмана',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]4.15 Запрещены любые попытки OOC обмана, а также IC обманы, нарушающие правила и логику ролевой игры. I [color=yellow]Бан навсегда[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	title: 'Обман в /do',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]4.16 Запрещено использовать обман в команде /do, даже если это может негативно сказаться на вашем игровом персонаже. I [color=yellow]Деморган на 60 минут / Warn[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	title: 'Nrp акс',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]4.17 Запрещено размещать аксессуары на теле персонажа таким образом, что это нарушает нормы морали и этики, а также увеличивать аксессуары до слишком больших размеров. I [color=yellow]Предупреждение / Деморган на 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	  },
	  {
	  title: 'Скрытие инфы о нарушителях',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]4.19 Запрещено скрывать от администрации информацию о нарушителях или злоумышленниках. I [color=yellow]Бан на 15-30 дней / Пермбан + ЧСП[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	  },
	  {
	  title: 'Умыш. наносение вреда ресурсам проекта',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]4.20 Запрещено умышленно наносить вред ресурсам проекта, включая игровые серверы, форумы, официальные Discord-серверы и прочее. I [color=yellow]Пермбан + ЧСП[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	  },
	  {
	  title: 'Слив адм. инфы',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]4.21 Запрещено распространение информации и материалов, которые непосредственно связаны с работой администрации проекта. I [color=yellow]Пермбан + ОЧСА[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	title: 'Ввод адм. в заблуж',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]4.22 Запрещено вводить администрацию проекта в заблуждение или обманывать её на всех ресурсах проекта. I [color=yellow]Бан на 10-15 дней[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	  },
	  {
	  title: 'Юзать уязв. правил',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]4.24 Запрещено пользоваться уязвимостью правил I [color=yellow]Бан на 15-30 дней[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	  },
	  {
	  title: 'Уход от наказания',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]4.25 Запрещен уход от наказания I [color=yellow]Бан на 7-30 дней[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	  },
	  {
	  title: 'Разглашение инфы игрока',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]4.26 Запрещено разглашать личную информацию игроков и их близких лиц. I [color=yellow]Бан на 15-30 дней[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	  },
	  {
	  title: 'Нарушение правил 7+ раз',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]4.27 Повторное нарушение правил сервера семь раз или более будет рассматриваться как злоупотребление. I [color=yellow]Бан на 15-30 дней[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	  },
	  {
	  title: 'Любая форма слива',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]4.28 Запрещены любые формы слива I [color=yellow]Бан навсегда[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	  },
	  {
	  title: '——————————>Нарушения в игровом чате<————————-—————————',
	  },
	 {
	 title: 'Общ. не на русском',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]5.01 Общепризнанный язык сервера - Русский. Общение в IC чате обязательно должно проходить на Русском языке. I [color=yellow]Блокировка чата на 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	  },
	  {
	   title: 'MG',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]5.01 Запрещено использовать OOC информацию в IC чате. (Meta Gaming) I [color=yellow]Блокировка чата на 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	  },
	  {
	   title: 'флуд',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]5.02 Нельзя повторять однотипные сообщения более двух раз подряд (Флудить) I [color=yellow]Блокировка чата на 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	  },
	  {
	   title: 'CapsLock',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]5.03 В чатах сервера запрещено использование CapsLock (Чрезмерное использование верхнего регистра) I [color=yellow]Блокировка чата на 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	  },
	  {
	   title: 'Злоуп.симв',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]5.04 Запрещено чрезмерное использование знаков препинания и других символов. I[color=yellow] Блокировка чата на 30 минут.[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	  },
	  {
	   title: 'Реклама проектов итд',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]5.05 Рекламирование других проектов, серверов, сайтов, своих каналов запрещено. I [color=yellow]Блокировка аккаунта на 30 дней / Перманентная блокировка[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	  },
	  {
	   title: 'Оск игроков/расизм',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]5.06 Оскорбление других игроков, а так-же любые формы расизма, дискриминации, издевательств, национальной враждебностью запрещено, за исключением случаев, когда оно является частью RolePlay ситуации. I [color=yellow]Блокировка чата на 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	  },
	  {
	   title: 'Реклама промо',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]5.07 Запрещена реклама промокодов в игре I [color=yellow]Блокировка аккаунта на 15 дней[CENTER][color=yellow]Исключение: [color=white]Промокоды созданные командой проекта[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	  },
	  {
	   title: 'Угрозы админом',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]5.08 Запрещены любые угрозы наказанием со стороны администрации I [color=yellow]Блокировка чата на 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	  },
	  {
	   title: 'Реклама в зданиях госс орг.',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]5.09 В зданиях государственных структур, запрещено устраивать рынки или рекламировать семьи и бизнесы. I [color=yellow]Блокировка чата на 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	  },
	  {
	   title: 'Призыв к меж. нац враждам',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]5.10 Запрещено подстрекательство или пропагандирование к межнациональной вражде или травле других игроков. I[color=yellow] Блокировка чата на 120 минут / Блокировка аккаунта на 7-15 дней[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	  },
	  {
	   title: 'упом/оск род',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]5.11 Запрещено упоминание/оскорбление родителей или близких других игроков. I [color=yellow]Блокировка чата на 120 минут / Блокировка аккаунта на 7-15 дней[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	  },
	  {
	   title: 'Оск адм',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]5.12 Запрещено оскорбление администрации проекта. I[color=yellow] Блокировка чата на 120 минут / Блокировка аккаунта от 15 до 30 дней[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	  },
	  {
	   title: 'Оск проекта',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]5.13 Запрещены оскорбления и клевета в сторону проекта I [color=yellow]Бан навсегда[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	  },
	  {
	   title: 'ввод игрока/ов в забл',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]5.15 Запрещено введение игроков в заблуждение путем злоупотребления командами I[color=yellow] Бан на 7-15 дней / Бан навсегда[CENTER][color=yellow]Пример:[color=white] /do У John_Beezy упал кошелек, введите /pay 111 2500 что-бы поднять.[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	  },
	  {
	   title: 'Угрозы ООС',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]5.16 Запрещены OOC угрозы, в том числе и завуалированные I[color=yellow] Мут на 180 минут / Бан на 7-15 дней[CENTER][B][color=yellow]Пример: [color=white]Да я тебя в реальной жизни *****.[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	  },
	  {
	   title: 'Выдача за адм',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]5.01 Общепризнанный язык сервера - Русский. Общение в IC чате обязательно должно проходить на Русском языке. I [color=yellow]Блокировка чата на 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	  },
	  {
	   title: 'Слив глоб. чатов',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]5.18 Запрещены любые формы Слива глобальных чатов I[color=yellow] Бан навсегда[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	  },
	  {
	   title: 'Нарушения в гс чат',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]5.19 Запрещено использование голосового чата с целью намеренного нарушения игры другим игрокам, таким как включение музыки, крики, различные звуки и т. д., запрещено. I [color=yellow]Мут голосового чата на 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	  },
	  {
	   title: 'Музыка в войс чат',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]5.20 Воспроизведение музыки в голосовом чате запрещено. I [color=yellow]Мут голосового чата на 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	  },
	  {
	   title: 'Софт голос в войс',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]5.21 Запрещено использование любого софта для изменения голоса I [color=yellow]Мут голосового чата на 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	  },
	  {
	  title: '———————->Рп биографии<———————————',
	  },
	{
	title: 'био одобрено',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу RolePlay биографию, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]Одобрено[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	  },
	  {
	  title: 'био отказано',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу RolePlay биографию, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=red]Отказано[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=white]Причиной послужили - Правила Написания Role Play биографий[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
		prefix: UNACCEPT_PREFIX,
	  status: false,
		},
		{
		title: 'допиши био',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу RolePlay биографию, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=red]Отказано[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=white]Допишите свою RolePlay биографию[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNQzdmyf/6.png[/img][/url]<br>',
		prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	
	
];
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
   // остальная часть
$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
	// Добавление кнопок при загрузке страницы
   	
   	
   	// дефолт
    addButton('Меню', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();
 // деф
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	// не деф
	
	
	
	
		$('button#unpin').click(() => editThreadData(PIN_PREFIX, false));
	// деф
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(UNACCEPT_PREFIX, false));
 
	$(`button#selectAnswer`).click(() => {
		XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
		buttons.forEach((btn, id) => {
			if(id > 1) {
				$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
			} else {
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
 
	if(send == true){
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
        'Здравствуйте' :
        11 < hours && hours <= 15 ?
        'Доброго дня' :
        15 < hours && hours <= 21 ?
        'Здравствуйте' :
        'Приветствую',
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
	}
	if(pin == true){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
}
 
function getFormData(data) {
	const formData = new FormData();
	Object.entries(data).forEach(i => formData.append(i[0], i[1]));
	return formData;
  }
})();


     