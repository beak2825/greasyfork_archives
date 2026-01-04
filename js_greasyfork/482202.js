// ==UserScript==
// @name         [Black russia]Скрипт для КФ
// @namespace    https://forum.blackrussia.online
// @version      2.8
// @description  По вопросам(ВК): https://vk.com/negritsik
// @author       Oleg Lomov(CHOCO)
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license 	 MIT
// @collaborator none
// @icon  https://cdn-icons-png.flaticon.com/128/4080/4080315.png
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/482202/%5BBlack%20russia%5D%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/482202/%5BBlack%20russia%5D%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4.meta.js
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
      title: 'Oleg Lomov',
      content:
     "[B][CENTER][COLOR=lavender]Не тыкай на мой ник!!!!!!!<br><br>",
      },
     {
      title: '==========>Для Кураторов Форума с логами<=============================================================',
      },
     {
      title: '==========>Жалобы на игроков<=============================================================',
      },
      {
	  title: 'На рассмотрение',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба взята на рассмотрение.<br><br>"+
        "[B][CENTER][COLOR=lavender]Пожалуйста, не создавайте дубликатов темы и ожидайте ответа.⏳<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: PIN_PREFIX,
	  status: true,
	},
     {
	  title: 'Не по форме',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба составлена не по форме.<br><br>"+
           "[B][CENTER][COLOR=RED]ОТКАЗАНО<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
            "[B][CENTER][COLOR=RED]Оставлять жалобу нужно в соответствии с примером, приведенном ниже:<br><br>"+
              "[CENTER][COLOR=lavender]Название: Nick_Name | Суть жалобы.<br><br>"+
           "[CENTER][COLOR=lavender]1.Ваш Nick_Name:<br><br>"+
           "[CENTER][COLOR=lavender]2.Nick_Name игрока:<br><br>"+
            "[CENTER][COLOR=lavender]3.Суть жалобы:<br><br>"+
            "[CENTER][COLOR=lavender]4.Доказательства:<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: 'Передать ГКФ',
	  content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>'+
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба передана [COLOR=blue]Главному куратору форума[/COLOR].<br><br>"+
        "[B][CENTER][COLOR=lavender]Пожалуйста, не создавайте дубликатов темы и ожидайте ответа.⏳<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: VAJNO_PREFIX,
	  status: true,
     },
     {
	  title: 'Передать теху',
	  content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>'+
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба передана [COLOR=orange]Техническому специалисту[/COLOR].<br><br>"+
        "[B][CENTER][COLOR=lavender]Пожалуйста, не создавайте дубликатов темы и ожидайте ответа.⏳<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
		prefix: TEX_PREFIX,
	  status: true,
     },
     {
	  title: 'Передать ГА',
	  content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>'+
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба передана [COLOR=red]Главному администратору[/COLOR].<br><br>"+
        "[B][CENTER][COLOR=lavender]Пожалуйста, не создавайте дубликатов темы и ожидайте ответа.⏳<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
		prefix: GA_PREFIX,
	  status: true,
     },
     {
	  title: 'Передать КП',
	  content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>'+
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба передана [COLOR=yellow]Команде проекта[/COLOR].<br><br>"+
        "[B][CENTER][COLOR=lavender]Пожалуйста, не создавайте дубликатов темы и ожидайте ответа.⏳<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
		prefix: COMMAND_PREFIX,
	  status: true,
      	},
{
	  title: '==========>Причины отказов<=============================================================',
	},
{
	  title: 'Нет в логах',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В системе логирования нарушений не найдено.<br><br>"+
        "[B][CENTER][COLOR=lavender]Приносим свои извинения.<br><br>"+
           "[B][CENTER][COLOR=RED]ОТКАЗАНО<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Нет нарушений',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Игрок совершил действие не нарушающие правила игры.<br><br>"+
        "[B][CENTER][COLOR=lavender]Ознакомтесь с правилами серверов:3<br><br>"+
             "[B][CENTER][COLOR=RED]ОТКАЗАНО<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: '3ие лицо',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба написана от 3-его лица.<br><br>"+
        "[B][CENTER][COLOR=lavender]Напишите жалобу ещё раз, только от 1-ого лица.<br><br>"+
         "[B][CENTER][COLOR=RED]ОТКАЗАНО<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Нету доков',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В вашей жалобе отсутствуют докозательства.<br><br>"+
        "[B][CENTER][COLOR=lavender]Если у вас имеются докозательства, то оставьте ещё раз жалобу, только уже с прекреплёнными докозательствами.<br><br>"+
          "[B][CENTER][COLOR=RED]ОТКАЗАНО<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Мало доков',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваших докозательств недостаточно для вынесения вердикта.<br><br>"+
        "[B][CENTER][COLOR=lavender]Если у вас еще остались непрекриплённые докозательства, создайте новую жалобу с прекриплёнными нарушениями игрока.<br><br>"+
           "[B][CENTER][COLOR=RED]ОТКАЗАНО<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: 'Редактированые доки',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваши докозательства были отредактированы.<br><br>"+
        "[B][CENTER][COLOR=lavender]Редактировать докозательства - это плохо!<br><br>"+
            "[B][CENTER][COLOR=RED]ОТКАЗАНО<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: 'Доки выложены через попу',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Докозательства выложены через соц. сеть.<br><br>"+
        "[B][CENTER][COLOR=lavender]Загрузите докозательства на фото/видео хостинг(YouTube, Япикс, imgur).<br><br>"+
           "[B][CENTER][COLOR=RED]ОТКАЗАНО<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Доки сломаны',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваши докозательства не работают.<br><br>"+
        "[B][CENTER][COLOR=lavender]Почините докозательства и отправьте жалобу повторно.<br><br>"+
           "[B][CENTER][COLOR=RED]ОТКАЗАНО<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: 'Нету /time',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]На докозательствах отсутствует /time.<br><br>"+
        "[B][CENTER][COLOR=lavender]Докозательства без /time не принимаются.<br><br>"+
           "[B][CENTER][COLOR=RED]ОТКАЗАНО<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Нужен фрапс',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Для этого нарушения должна быть видео фиксация(фрапс).<br><br>"+
        "[B][CENTER][COLOR=lavender]В случиях по типу: Nrp обман, DM, DB, читы - нужен фрапс.<br><br>"+
           "[B][CENTER][COLOR=RED]ОТКАЗАНО<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: 'Неполный фрапс',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваших докозательств недостаточно для принятия решения.<br><br>"+
        "[B][CENTER][COLOR=lavender]Чем больше докозательств, тем лучше!<br><br>"+
           "[B][CENTER][COLOR=RED]ОТКАЗАНО<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Нету условий сделки',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Нету условий сделки.<br><br>"+
        "[B][CENTER][COLOR=lavender]Без этого мы не можем узнать обманули ли вас или нет.<br><br>"+
           "[B][CENTER][COLOR=RED]ОТКАЗАНО<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Нету Тайм-кодов',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Нету Тайм-кодов.<br><br>"+
        "[B][CENTER][COLOR=lavender]На докозательствах 3-х минут и более должны быть тайм-коды.<br><br>"+
           "[B][CENTER][COLOR=RED]ОТКАЗАНО<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
      {
	  title: 'Промо лигальный',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Промокод от Black russia.<br><br>"+
        "[B][CENTER][COLOR=lavender]Наказание даётся лишь за рекламу сторонних промокодов.<br><br>"+
           "[B][CENTER][COLOR=RED]ОТКАЗАНО<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'На жалобу уже ответили',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Уже был дан ответ.<br><br>"+
        "[B][CENTER][COLOR=lavender]На одну из ваших предыдущих жалоб уже ответили.<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: 'Уже был наказан',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Нарушитель уже был наказан.<br><br>"+
        "[B][CENTER][COLOR=lavender]Администрация работает быстрее игроков:3<br><br>"+
           "[B][CENTER][COLOR=RED]ОТКАЗАНО<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Прошло 3 дня',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Вы выложили жалобу спустя 72 часа с момента нарушения.<br><br>"+
        "[B][CENTER][COLOR=lavender]Срок написания жалобы составляет три дня(72 часа) с момента совершенного нарушения со стороны игрока сервера.<br><br>"+
           "[B][CENTER][COLOR=RED]ОТКАЗАНО<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'Долг не через банк',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Долг не через банк.<br><br>"+
        "[B][CENTER][COLOR=lavender]Займ может быть осуществлен только через зачисление игровых ценностей на банковский счет.<br><br>"+
           "[B][CENTER][COLOR=RED]ОТКАЗАНО<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
      {
	  title: 'После срока возрата долга прошло 10 дней',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Прошло 10 дней, после срока возрата долга.<br><br>"+
        "[B][CENTER][COLOR=lavender]Не грустите и скушайте печеньку:3<br><br>"+
           "[B][CENTER][COLOR=RED]ОТКАЗАНО<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: 'Договор о долге в другом месте',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Договор о долге в другом месте.<br><br>"+
        "[B][CENTER][COLOR=lavender]В следующий раз берите кредит в игре, а не в ВК или другом месте:3<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
      {
	  title: '==========>Одобренные жалобы<=============================================================',
	},
   {
	  title: 'DM',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | Jail 60 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'DB',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | Jail 60 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'RK',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]2.14. Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти | Jail 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'TK',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | Jail 60 минут / Warn (за два и более убийства)[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'SK',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | Jail 60 минут / Warn (за два и более убийства)[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Массовый DM',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | Warn / Ban 3 - 7 дней[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'ЕПП',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]2.46. Запрещено ездить по полям на любом транспорте | Jail 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'ЕПП(фура/инко)',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]2.47. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) | Jail 60 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Уход от рп',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | Jail 30 минут / Warn[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Обман в /do',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]2.10. Запрещено в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже | Jail 30 минут / Warn[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Затяг рп проц',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]2.12. Запрещено целенаправленное затягивание Role Play процесса | Jail 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Помеха рп',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]2.51. Запрещено вмешательство в Role Play процесс с целью помехи и препятствования дальнейшего развития Role Play процесса | Jail 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Nrp акс',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Адм инфа',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]2.27. Запрещено распространение информации и материалов, которые имеют непосредственное отношение к работе администрации проекта | PermBan + ЧС проекта[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Назв бизнеса',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]2.53. Запрещено устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной наклонности | Ban 1 день / При повторном нарушении обнуление бизнеса[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Баг анимки',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. | Jail 60 / 120 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Ущерб эко',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]2.30. Запрещено пытаться нанести ущерб экономике сервера | Ban 15 - 30 дней / PermBan[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Обход системы',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]2.21. Запрещено пытаться обходить игровую систему или использовать любые баги сервера | Ban 15 - 30 дней/PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов)[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Слив склада',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле | Ban 15 - 30 дней / PermBan[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Действия 18+',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | Jail 30 минут / Warn[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Невозврат долга',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]2.57. Запрещается брать в долг игровые ценности и не возвращать их. | Ban 30 дней / permban[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Читы',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | Ban 15 - 30 дней / PermBan[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Оск проекта',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
  {
	  title: '==========>Нарушения в организациях<=============================================================',
	},
	{
	  title: 'Арест в казино/ауке',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]2.50. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий | Ban 7 - 15 дней + увольнение из организации[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Госс подработка',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]1.07. Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции | Jail 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Тс в лич целях',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]1.08. Запрещено использование фракционного транспорта в личных целях | Jail 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Одиноч конвой/патруль',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]1.11. Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника | Jail 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Прогул рд',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]1.13. Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работы в форме фракции | Jail 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Аррест биз вар',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]1.14. Сотрудникам правоохранительных органов запрещается задерживать состав участников войны за бизнес за 10 минут непосредственно до начала самого бизвара. | Jail 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Не по ПРО',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]4.01. Запрещено редактирование объявлений, не соответствующих ПРО | Mute 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Не по ППЭ',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]4.02. Запрещено проведение эфиров, не соответствующих Role Play правилам и логике | Mute 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Nrp редакт',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]4.04. Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком | Ban 7 дней + ЧС организации[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Nrp повед УМВД',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]6.03. Запрещено nRP поведение | Warn[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Nrp штраф',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]7.02. Запрещено выдавать розыск, штраф без Role Play причины | Warn[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Отбр права во время погони',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]7.04. Запрещено отбирать водительские права во время погони за нарушителем | Warn[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Нарушения /d',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]За нарушение правил общения в рации департамента будет выдана блокировка чата на 30 минут.[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Пепестрелка ОПГ в люд месте',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]6. Запрещено устраивать перестрелки с другими ОПГ в людных местах | Jail 60 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Реклама в чат ОПГ',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]7. Запрещена любая реклама (семей, транспортных и строительных компаний и т.д.), предложения о купле, продаже, обмене чего-либо в чате организации | Mute 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Уход во время погонм на базу',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]8. Запрещено уходить от погони со стороны правоохранительных органов путем заезда на территорию своей банды для того чтобы скрыться или получить численное преимущество | Jail 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Наруш правил нападения на в/ч',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]За нарушение правил нападения на Войсковую Часть выдаётся предупреждение | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Нападение не через КПП',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]Нападение на военную часть разрешено только через блокпост КПП с последовательностью взлома | /Warn NonRP В/Ч[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Аптечка на биз вар',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]2.07. Запрещено использовать аптечки во время перестрелки | Jail 15 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
  {
	  title: '==========>Нарушения в чатах<=============================================================',
	},
    {
	  title: 'Капс',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | Mute 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Флуд',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | Mute 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: 'МГ',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | Mute 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Оск чего-то в /n',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | Mute 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'OOC угрозы',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]2.37. Запрещены OOC угрозы, в том числе и завуалированные | Mute 120 минут / Ban 7 дней[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Распр инфы людей',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]2.38. Запрещено распространять личную информацию игроков и их родственников | Ban 15 - 30 дней / PermBan[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Разногласия по религ и нации',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]2.35. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | Mute 120 минут / Ban 7 дней[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Упом родни',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | Mute 120 минут / Ban 7 - 15 дней[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Маты в /v',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]3.23. Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате | Mute 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Слив в глоб чат',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]3.08. Запрещены любые формы «слива» посредством использования глобальных чатов | PermBan[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Угрозы наказанием',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]3.09. Запрещены любые угрозы о наказании игрока со стороны администрации | Mute 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Неув к адм',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]2.54. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | Mute 180 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Ввод в забл командами',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]3.11. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | Ban 15 - 30 дней / PermBan[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Оск 18+',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]3.07. Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата | Mute 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Транслит',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]3.20. Запрещено использование транслита в любом из чатов | Mute 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Общение на другом языке',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]3.01. Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке | Устное замечание / Mute 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Обьявы на тт госс',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) | Mute 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Перенос конфликта из OOC и IC',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]2.36. Запрещено переносить конфликты из IC в OOC и наоборот | Warn[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Реклама',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]2.31. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное | Ban 7 дней / PermBan[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Реклама промо',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | Ban 30 дней[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
	  title: 'Выдача за адм',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]3.10. Запрещена выдача себя за администратора, если таковым не являетесь | Ban 7 - 15 + ЧС администрации[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
	  title: 'Злоуп знаками',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]3.06. Запрещено злоупотребление знаков препинания и прочих символов | Mute 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: '==========>Nrp нарушения<=============================================================',
	},
      {
	  title: 'Nrp поведение',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | Jail 30 минут[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
	  title: 'Nrp обман',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | PermBan[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
title: 'Nrp розыск',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]6.02. Запрещено выдавать розыск без Role Play причины | Warn[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	 {
	  title: '==========>Нарушения в нике<=============================================================',
	},
    	{
	  title: 'Оск в нике',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]4.09. Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) | Устное замечание + смена игрового никнейма / PermBan[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: 'Копия ника',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Проверив вашу жалобу, я выношу вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]<br><br>"+
        "[B][CENTER][COLOR=lavender]Игрок получит следующие наказание<br><br>"+
        "[B][CENTER][COLOR=lavender][Spoiler]4.10. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию | Устное замечание + смена игрового никнейма / PermBan[/Spoiler]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: '==========>В другой раздел<=============================================================',
	},
    {
	  title: 'В жб на адм',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=RED]Извините, но вы ошиблись разделом.<br><br>"+
        "[B][CENTER][COLOR=lavender]Вам нужно в жалобы на администрацию!<br><br>"+
        "[CENTER][COLOR=lavender]Список серверов>ваш сервер>жалобы>жалобы на администацию.<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'В жб на лд',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=RED]Извините, но вы ошиблись разделом.<br><br>"+
        "[B][CENTER][COLOR=lavender]Вам нужно в жалобы на лидеров!<br><br>"+
                "[CENTER][COLOR=lavender]Список серверов>ваш сервер>жалобы>жалобы на лидеров.<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    	{
	  title: 'В жб на хелпера',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=RED]Извините, но вы ошиблись разделом.<br><br>"+
        "[B][CENTER][COLOR=lavender]Вам нужно в жалобы на агентов поддержки!<br><br>"+
                "[CENTER][COLOR=lavender]Список серверов>ваш сервер>раздел для хелперов сервера>жалобы на хелпер.<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'В жб на сотр',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=RED]Извините, но вы ошиблись разделом.<br><br>"+
        "[B][CENTER][COLOR=lavender]Вам нужно в жалобы на сотрудников!<br><br>"+
                "[CENTER][COLOR=lavender]Список серверов>ваш сервер>государственные/криминальные организации>организация которая вам нужна>жалобы на сотрудников.<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'В жб на техов',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=RED]Извините, но вы ошиблись разделом.<br><br>"+
        "[B][CENTER][COLOR=lavender]Вам нужно в жалобы на тех. специалистов!<br><br>"+
                "[CENTER][COLOR=lavender]Список серверов>технический раздел>жалобы на тех. специалистов>ваш сервер.<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'В обжалование',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=RED]Извините, но вы ошиблись разделом.<br><br>"+
        "[B][CENTER][COLOR=lavender]Вам нужно в обжалование наказания!<br><br>"+
                "[CENTER][COLOR=lavender]Список серверов>ваш сервер>жалобы>обжалование наказаний.<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: CLOSE_PREFIX,
	  status: false,
      },
     {
      title: '==========>Для Кураторов Форума без логов<=============================================================',
      },
      {
	  title: 'На рассмотрение',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=yellow]Взято на рассмотрение.<br><br>"+
        "[B][CENTER][COLOR=lavender]Пожалуйста, не создавайте дубликатов темы и ожидайте ответа.⏳<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: PIN_PREFIX,
	  status: true,
      },
     {
      title: '==========>РП биографии<=============================================================',
	},
   {
	  title: 'Био одобрено',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Я проверил вашу RolePlay биографию и выношу следующий вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'Био отказано',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Я проверил вашу RolePlay биографию и выношу следующий вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=red]ОТКАЗАНО[/COLOR]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'Био отк не по форме',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Я проверил вашу RolePlay биографию и выношу следующий вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=red]ОТКАЗАНО, так как составлено не по форме[/COLOR]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'Мало описания',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Я проверил вашу RolePlay биографию и выношу следующий вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=red]ОТКАЗАНО, так как в вашей биографии мало описания жизни персонажа[/COLOR]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'Био отк не от 1 лица',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Я проверил вашу RolePlay биографию и выношу следующий вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=red]ОТКАЗАНО, так как биография должна быть составлена от 1-го лица[/COLOR]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'Био отк не от 3 лица',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Я проверил вашу RolePlay биографию и выношу следующий вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=red]ОТКАЗАНО, так как биография должна быть составлена от 3-го лица[/COLOR]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
   },
   {
	  title: 'Био отк нет фото',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Я проверил вашу RolePlay биографию и выношу следующий вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=red]ОТКАЗАНО, так как отсутствует фото персонажа[/COLOR]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'Био отк недост инф',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Я проверил вашу RolePlay биографию и выношу следующий вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=red]ОТКАЗАНО, так как в вашей биографии недостаточно информации[/COLOR]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
   },
   {
	  title: 'Био отк нед инф детство',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Я проверил вашу RolePlay биографию и выношу следующий вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=red]ОТКАЗАНО, так как в пнкте Детство недостаточно информации[/COLOR]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
   },
   {
	  title: 'Био отк нед инф юность и взр жизнь',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Я проверил вашу RolePlay биографию и выношу следующий вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=red]ОТКАЗАНО, так как в пункте Юность и взрослая жизнь недостаточно информации[/COLOR]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
   },
   {
	  title: 'Био отк нед инф юность',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Я проверил вашу RolePlay биографию и выношу следующий вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=red]ОТКАЗАНО, так как в пункте Юность недостаточно информации[/COLOR]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
   },
   {
	  title: 'Био отк нед инф взросление',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Я проверил вашу RolePlay биографию и выношу следующий вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=red]ОТКАЗАНО, так как в пункте Взросление недостаточно информации[/COLOR]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
   },
   {
	  title: 'Био отк нед инф зрелость',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Я проверил вашу RolePlay биографию и выношу следующий вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=red]ОТКАЗАНО, так как в пункте Зрелость недостаточно информации[/COLOR]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
   },
   {
	  title: 'Био отк нед инф наши дни',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Я проверил вашу RolePlay биографию и выношу следующий вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=red]ОТКАЗАНО, так как в пункте Наши дни недостаточно информации[/COLOR]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
   },
   {
	  title: 'Био отк нед инф наст вр',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Я проверил вашу RolePlay биографию и выношу следующий вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=red]ОТКАЗАНО, так как в пункте Настоящее время недостаточно информации[/COLOR]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
   },
   {
	  title: 'Био отк нед инф описание внешка',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Я проверил вашу RolePlay биографию и выношу следующий вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=red]ОТКАЗАНО, так как в разделе Описание внешности недостаточно информации[/COLOR]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'Био отк заголовок',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Я проверил вашу RolePlay биографию и выношу следующий вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=red]ОТКАЗАНО, так как заголовок биографии составлен не по форме[/COLOR]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'Био отк меньше 18 лет',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Я проверил вашу RolePlay биографию и выношу следующий вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=red]ОТКАЗАНО, так как персонаж младше 18-и лет[/COLOR]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'Био отк возраст и дата',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Я проверил вашу RolePlay биографию и выношу следующий вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=red]ОТКАЗАНО, так как возраст и дата рождения не совподают[/COLOR]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
   },
   {
	  title: 'Био отк дата не полн',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Я проверил вашу RolePlay биографию и выношу следующий вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=red]ОТКАЗАНО, так как дата рождения прописана не полностью[/COLOR]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'Био отк нрп ник',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Я проверил вашу RolePlay биографию и выношу следующий вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=red]ОТКАЗАНО, так как у вас nrp ник[/COLOR]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'Био отк копия',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Я проверил вашу RolePlay биографию и выношу следующий вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=red]ОТКАЗАНО, так как биография была скопирована[/COLOR]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'Био отк ПГ',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Я проверил вашу RolePlay биографию и выношу следующий вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=red]ОТКАЗАНО, так как в вашей биографии присутствует PG[/COLOR]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'Био отк разная инф',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Я проверил вашу RolePlay биографию и выношу следующий вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=red]ОТКАЗАНО, так как информация между собой отличается[/COLOR]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'Био отк инф и возраст',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Я проверил вашу RolePlay биографию и выношу следующий вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=red]ОТКАЗАНО, так как в вашей биографии информация не соответствует возрасту[/COLOR]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'Био отк расизм',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Я проверил вашу RolePlay биографию и выношу следующий вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=red]ОТКАЗАНО, так как запрещена пропаганда религиозных или националистических взглядов или высказываний.[/COLOR]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'Био отк неадекват',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Я проверил вашу RolePlay биографию и выношу следующий вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=red]ОТКАЗАНО, так как она отклоняется от RolePlay[/COLOR]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'Био отк грамотность',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Я проверил вашу RolePlay биографию и выношу следующий вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=red]ОТКАЗАНО, так как она составлена не грамотно[/COLOR]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'Био отк разные имена',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Я проверил вашу RolePlay биографию и выношу следующий вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=red]ОТКАЗАНО, так как в ней используются разные имена и фамилии[/COLOR]<br><br>"+
        "[B][CENTER][COLOR=lavender]Используйте в качестве имени и фамилии ваш Nick_Name в игре:3[/COLOR]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
      },
     {
      title: '==========>РП организация<=============================================================',
	},
   {
	  title: 'Организация одобрена',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Я проверил вашу Неофициальную RP организацию и выношу следующий вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'Организация отказана',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Я проверил вашу Неофициальную RP организацию и выношу следующий вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=red]ОТКАЗАНО[/COLOR]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'Орг отк не по форме',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Я проверил вашу Неофициальную RP организацию и выношу следующий вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=red]ОТКАЗАНО, так как составлено не по форме[/COLOR]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'Орг отк название',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Я проверил вашу Неофициальную RP организацию и выношу следующий вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=red]ОТКАЗАНО, так как название составлено не по форме[/COLOR]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
      },
     {
      title: '==========>РП ситуация<=============================================================',
      },
     {
	  title: 'Рп ситуация одобрена',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Я проверил вашу RP ситуацию и выношу следующий вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=green]ОДОБРЕНО[/COLOR]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'РП ситуация отказана',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Я проверил вашу RP ситуацию и выношу следующий вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=red]ОТКАЗАНО[/COLOR]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'РП отк не по форме',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Я проверил вашу RP ситуацию и выношу следующий вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=red]ОТКАЗАНО, так как составлено не по форме[/COLOR]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'РП отк не по рп',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmt4hX1Z/image.jpg[/img][/url]<br>' +
	    "[B][CENTER][COLOR=#1ABC9C][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Я проверил вашу RP ситуацию и выношу следующий вердикт...<br><br>"+
        "[B][CENTER][COLOR=lavender][COLOR=red]ОТКАЗАНО, так как RP ситуация сильно отклоняется он норм RolePlay процесса[/COLOR]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/rmyvbGJJ/image.jpg[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
];
 
$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
	// Добавление кнопок при загрузке страницы
   	addButton('Одоб✅', 'accepted');
    addButton('Отказ❌', 'unaccept');
    addButton('😈 А СУДЬИ КТО? 👼', 'selectAnswer');
 
	// Поиск информации о теме
	const threadData = getThreadData();
 
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
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
        'Добрейшего денёчка' :
        15 < hours && hours <= 21 ?
        'Hello' :
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


     