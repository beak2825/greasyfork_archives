// ==UserScript==
// @name         CHIEF SCRIPT
// @namespace    https://forum.blackrussia.online
// @version      99999999999999999999999999999999
// @description  Мой
// @author       Roman Onix
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license 	 MIT
// @icon https://grizly.club/uploads/posts/2023-08/1691524743_grizly-club-p-kartinki-znachok-blek-rasha-bez-fona-1.png
// @downloadURL https://update.greasyfork.org/scripts/494962/CHIEF%20SCRIPT.user.js
// @updateURL https://update.greasyfork.org/scripts/494962/CHIEF%20SCRIPT.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECIAL_PREFIX = 11;
const TECH_PREFIX = 13;
const buttons = [
    {
	  title: '----> Раздел Жалоб <-----',
	},
	  {
	  title: '| На рассмотрение |',
	  content:
		"[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
		"[B][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman] Ваша жалоба взята на рассмотрение, ожидайте вердикта.[/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=#fff700][ICODE]На рассмотрении[/ICODE][/CENTER][/B]",
	  prefix: PIN_PREFIX,
	  status: false,
},
  {
      title: 'Не по теме',
      content:
        "[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
        "[CENTER][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Ваша жалоба отказана, так как она никаким образом не относится к предназначению данного раздела.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][ICODE]Закрыто[/ICODE][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
   {
      title: 'Не по форме',
      content:
        "[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]<br>"+
        "[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(209, 213, 216)]Ваша жалоба отказана, так как составлена не по форме.[/COLOR][/CENTER]<br><br>" +
        "[CENTER][COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила составления жалоб - [url=https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3429349/]*правила подачи жалоб *[/url] [/COLOR][/I][/FONT][/SIZE][/CENTER]<br><br>" +
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][ICODE]Закрыто[/ICODE][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
	{
	  title: '| Нет /time |',
	  content:
		"[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
		"[B][CENTER][COLOR=rgb(209, 213, 216)]Ваша жалоба отказана, так как в предоставленных доказательств отсутствует время (/time), следовательно не подлежит рассмотрению.<br><br>"+
		'[B][CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: '| От 3 лица |',
	  content:
		"[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
		"[B][CENTER][COLOR=rgb(209, 213, 216)]Ваша жалоба отказана, так как она составлена от третьего лица. В связи с чем мы не можем ее рассмотреть. <br><br>"+
		'[B][CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},

{
	  title: '| Док-ва не открываются |',
	  content:

		"[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
		"[B][CENTER][COLOR=rgb(209, 213, 216)] Прикрепленные вами доказательства не открываются/работают либо нужно получить ваш доступ для просмотра, для этого они должны быть рабочими и доступными.<br><br>"+
       '[B][CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
},
	{
	  title: '| Нужен фрапс |',
	  content:
        "[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
		"[B][CENTER][COLOR=rgb(209, 213, 216)]В данной ситуации обязательно должен быть фрапс (видео фиксация) всех моментов, в противном случае жалоба будет отказано.<br><br>"+
		'[B][CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
        {
	  title: '| Неполный фрапс |',
	  content:
        "[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
		"[B][CENTER][COLOR=rgb(209, 213, 216)]Видео запись не полная либо же нет условии сделки, к сожелению мы вынуждены отказать.<br><br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: '| Док-ва отредактированы |',
	  content:
        "[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
		"[B][CENTER][COLOR=rgb(209, 213, 216)] Представленные доказательства были отредактированные или в плохом качестве, пожалуйста прикрепите оригинал.<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: '| Прошло более 48 часов |',
	  content:
        "[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
		"[B][CENTER][COLOR=rgb(209, 213, 216)] С момента выдачи наказания прошло более 48-ми часов, жалоба не подлежит рассмотрению.<br><br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
  {
	  title: '| Отсутствуют док-ва |',
	  content:
      "[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
      "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
      "[B][CENTER][COLOR=rgb(209, 213, 216)] Ваша жалоба отказана, так как доказательств на нарушение от данного администратора отсутствуют. <br><br>"+
      "[B][CENTER][COLOR=rgb(209, 213, 216)]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
      "[B][CENTER][COLOR=rgb(209, 213, 216)]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=crimson]CHILLI[/COLOR].<br><br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
	{
	  title: '| Не рабочие док-ва |',
	  content:
        "[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
		"[B][CENTER][COLOR=rgb(209, 213, 216)] Предоставленные доказательства не рабочие либо же битая ссылка, пожалуйста загрузите доказательства на фото/видео хостинге.<br><br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: '| Окно бана |',
	  content:
		"[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
		"[B][CENTER][COLOR=rgb(209, 213, 216)] Зайдите в игру и сделайте скрин окна с баном после чего, заново напишите жалобу.<br><br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
     },
     {
title: 'Бан по ip',
content:
       "[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
       "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
       "[B][CENTER][COLOR=rgb(209, 213, 216)]Смените wi-fi соединение или же ip адрес на тот с которого вы играли раньше, дело именно в нем.<br><br>"+
       "Перезагрузите ваш роутер или используйте VPN. <br>"+
       '[B][CENTER] [COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR][/CENTER][/B]',
      prefix: CLOSE_PREFIX,
      status: false,
     },
     {
	  title: '| Дублирование |',
	  content:
		"[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
		"[B][CENTER][COLOR=rgb(209, 213, 216)] Напоминаю, за дублирование тем ваш форумный аккаунт может быть заблокирован.<br><br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	  {
        title: 'Ответ уже был дан',
        content:
          "[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
          "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
          "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=tahoma]Ответ на Вашу жалобу был дан в прошлой вашей теме, прочитайте вердикт более внимательнее.[/FONT][/SIZE][/COLOR]<br><br>"+
          '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=tahoma][ICODE]Закрыто.[/ICODE][/FONT][/SIZE][/COLOR][/CENTER]',
        prefix: CLOSE_PREFIX,
        status:false,
    },
	{
	  title: '| Проинструктировать |',
	  content:
		"[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
		"[B][CENTER][COLOR=rgb(209, 213, 216)] Благодарим за ваше обращение! Администратор будет проинструктирован.<br><br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Неверный вердикт, беседа',
	  content:
        "[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
        "[SIZE=4][FONT=tahoma][COLOR=rgb(209, 213, 216)]Администратор будет проинструктирован по поводу проверок жалоб.[/COLOR][/FONT][/SIZE]<br><br>"+
        '[COLOR=rgb(0, 255, 0)][SIZE=4][FONT=tahoma][ICODE]Одобрено.[/ICODE][/FONT][/SIZE][/COLOR][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Неверный вердикт, Наказание',
	  content:
        "[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
        "[SIZE=4][FONT=tahoma][COLOR=rgb(209, 213, 216)]Администратор получит наказание за халатное рассмотрение жалоб.[/COLOR][/FONT][/SIZE]<br><br>"+
        '[COLOR=rgb(0, 255, 0)][SIZE=4][FONT=tahoma][ICODE]Одобрено[/ICODE][/FONT][/SIZE][/COLOR][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Беседа с админом |',
	  content:
		"[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
		"[B][CENTER][COLOR=rgb(209, 213, 216)] Ваша жалоба была одобрена и будет проведена беседа с администратором.<br><br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Строгая беседа с админом |',
	  content:
		"[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
		"[B][CENTER][COLOR=rgb(209, 213, 216)] Ваша жалоба была одобрена и будет проведена строгая беседа с администратором.<br><br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Админ будет наказан |',
	  content:
		"[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
		"[B][CENTER][COLOR=rgb(209, 213, 216)] Ваша жалоба была одобрена и администратор получит наказание.<br><br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Нет нарушений |',
	  content:
		"[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
		"[B][CENTER][COLOR=rgb(209, 213, 216)] Исходя из выше приложенных доказательств, нарушения со стороны администратора - не имееться!<br><br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	 {
	  title: 'Не указан никнейм администратора',
	  content:
         "[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
         "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=tahoma]В вашей жалобе не указан Nickname администратора, жалоба не подлежит рассмотрению.[/FONT][/SIZE][/COLOR]<br><br>"+
         '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=tahoma][ICODE]Закрыто.[/ICODE][/FONT][/SIZE][/COLOR][/B][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	 {
	  title: 'Не указан никнейм игрока',
	  content:
         "[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
         "[COLOR=rgb(230, 230, 250)][SIZE=4][FONT=tahoma]В вашей жалобе не указан Nickname игрока, жалоба не подлежит рассмотрению.[/FONT][/SIZE][/COLOR]<br><br>"+
         '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=tahoma][ICODE]Закрыто.[/ICODE][/FONT][/SIZE][/COLOR][/B][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	 {
	  title: 'Нужна ссылка на жалобу',
	  content:
         "[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
         "[COLOR=rgb(230, 230, 250)][SIZE=4][FONT=tahoma]Нужна ссылка на жалобу, пожалуйста предоставьте ссылку на данную жалобу.[/FONT][/SIZE][/COLOR]<br><br>"+
         '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=tahoma][ICODE]Закрыто.[/ICODE][/FONT][/SIZE][/COLOR][/B][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	 {
	  title: 'Нужен /myreports',
	  content:
         "[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
         "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
         "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=tahoma]В ваших доказательств отсутствует /myreports. Без данной команды жалоба не будет рассмотрена.[/FONT][/SIZE][/COLOR]<br><br>"+
         '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=tahoma][ICODE]Закрыто.[/ICODE][/FONT][/SIZE][/COLOR][/B][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: '| Наказание верное |',
	  content:
	    "[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
		"[B][CENTER][COLOR=rgb(209, 213, 216)] Проверив доказательства администратора, было принято решение, что наказание выдано верно.<br><br>"+
		'[B][CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: '| Наказание по ошибке |',
	  content:
		"[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
		"[B][CENTER][COLOR=rgb(209, 213, 216)] В следствие беседы с администратором, было выяснено, наказание было выдано по ошибке.<br><br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Админ Снят/ПСЖ |',
	  content:
		"[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
		"[B][CENTER][COLOR=rgb(209, 213, 216)] Администратор был снят/ушел с поста администратора.<br><br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Рассмотрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: WATCHED_PREFIX,
	  status: false,
	},
	 {
              title: 'Передано ГА',
      content:
        "[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
        "[CENTER][COLOR=rgb(209, 213, 216)][FONT=georgia]Ваша жалоба переадресована Главному Администратору.[/FONT][/COLOR][/CENTER]<br>" +
        '[FONT=georgia][SIZE=4][COLOR=rgb(209, 213, 216)]Ожидайте ответа в данной теме, копии создавать не нужно.[/COLOR][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(250, 197, 28)]На рассмотрении[/COLOR][/FONT]',
      prefix: GA_PREFIX,
      status: false,
    },
	 {
              title: 'Передано ЗГА',
      content:
        "[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
        "[CENTER][COLOR=rgb(209, 213, 216)][FONT=georgia]Ваша жалоба переадресована Заместителю Главного Администратора.[/FONT][/COLOR][/CENTER]<br>" +
        '[COLOR][CENTER][FONT=georgia][COLOR=rgb(209, 213, 216)]Ожидайте ответа в данной теме, копии создавать не нужно.[/FONT][/CENTER][/COLOR]<br>' +
        '[CENTER][COLOR=rgb(250, 197, 28)]На рассмотрени [/COLOR]',
        prefix: PIN_PREFIX,
	  status: false,
    },
    {
	  title: 'Рук. МД',
	  content:
       "[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
        "[COLOR=rgb(209, 213, 216)]Ваша жалоба передана [/COLOR][COLOR=rgb(30, 144, 255)]Руководителю модерации Discord[/COLOR][COLOR=rgb(230, 230, 250)]. [/COLOR]<br><br>"+
        '[COLOR=rgb(255, 140, 0)][ICODE]Взято на рассмотрение..[/ICODE] [/COLOR][/FONT][/SIZE][/B][/CENTER]',
     prefix: PIN_PREFIX,
	 status: false,
	},
	{
                      title: 'Передано КП',
      content:
        "[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
        "[COLOR=rgb(209, 213, 216)][I][FONT=georgia][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Команде Проекта[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/I][/COLOR]<br><br>" +
        '[CENTER][COLOR=rgb(250, 197, 28)]На рассмотрении[/COLOR][/FONT][/SIZE][/CENTER]',
      prefix: COMMAND_PREFIX,
	  status: false,
    },
	{
	  title: '| Передано Спецу и Заму Спеца |',
	  content:
		"[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
		"[B][CENTER][COLOR=rgb(209, 213, 216)] Жалоба передана Специальному Администратору, а так же его Заместителю - @Sander_Kligan / @Clarence Crown, пожалуйста ожидайте ответа..<br>"+
		'[B][CENTER][COLOR=red][ICODE]Передано Специальному Администратору[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: SPECIAL_PREFIX,
	  status: true,
	},
{
title: '-*- Отказ (Соц Сети)',
content:
    "[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
    "[COLOR=rgb(209, 213, 216)][FONT=Courier New]Благодарим Вас за потраченное время на обращение к нам в связи с ограничениями, наложенными на Ваш игровой аккаунт.[/FONT][/COLOR]<br><br>"+
    "[COLOR=rgb(209, 213, 216)][FONT=Courier New]Мы сожалеем, но мы не можем принимать доказательства, размещенные в социальных сетях.[/FONT][/COLOR]<br>"+
    "[COLOR=rgb(209, 213, 216)][FONT=Courier New]Но не волнуйтесь, у нас есть альтернативные варианты: Вы можете загрузить свои доказательства на известные фото-хостинги, такие как Imgur или PostIMG, или видео-хостинги, такие как Yandex, Google или YouTube, а также на другие доступные сервисы.[/FONT][/COLOR]<br><br>"+
    "[COLOR=rgb(209, 213, 216)][FONT=Courier New]Как только вы загрузите свои доказательства на один из этих хостингов, создайте новую тему и мы с радостью её рассмотрим.[/FONT][/COLOR]<br>"+
    '[COLOR=rgb(209, 213, 216)][SIZE=17][FONT=Courier New][Color=IndianRed]Тема была рассмотрена и закрыта.',
prefix: WATCHED_PREFIX,
status: false,
},
	{
	  title: '| В Тех раздел |',
	  content:
		"[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
		"[B][CENTER][COLOR=rgb(209, 213, 216)] Пожалуйста составьте свою жалобу в Технический раздел сервера : [URL= https://forum.blackrussia.online/index.php?forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-chilli.1007/]*Нажмите сюда*[/URL]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
  {
	  title: '| В ЖБ на теха |',
	  content:
		"[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
		"[B][CENTER][COLOR=rgb(209, 213, 216)] Вам было выдано наказания Техническим специалистом, вы можете написать жалобу здесь : [URL= https://forum.blackrussia.online/index.php?forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9621-chilli.1202/]*Нажмите сюда*[/URL]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
{
      title: 'В обжалования',
      content:
        "[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
        "[I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Обратитесь в раздел обжалований наказаний.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Обжалования ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
 {
      title: 'Обжалование отказано',
      content:
        "[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=georgia]Администрация не готова сократить или снять вам наказание.[/FONT][/SIZE]<br>" +
        "[SIZE=4][FONT=georgia]В обжаловании отказано.[/FONT][/SIZE][/I][/COLOR]<br><br>" +
        "[FONT=georgia][COLOR=rgb(209, 213, 216)][SIZE=4][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/COLOR][/FONT]<br><br>" +
        '[FONT=georgia][COLOR=rgb(255, 0, 0)][SIZE=4]Закрыто.[/SIZE][/COLOR]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Обжалование не подлежит',
      content:
        "[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=georgia][COLOR=rgb(209, 213, 216)]Данное нарушение обжалованию не подлежит.[/COLOR][/FONT][/SIZE][/COLOR]<br>" +
        "[FONT=georgia][COLOR=rgb(209, 213, 216)][SIZE=4]Внимательно прочитайте правила подачи обжалования, https://forum.blackrussia.online/index.php?threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/ <br>" +
        "В обжаловании отказано.<br><br>" +
        "Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/COLOR][/FONT]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman][ICODE]Закрыто[/ICODE][/FONT][/SIZE][/COLOR][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
title: '-*- Отказ (Не по форме)',
content:
        "[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
        "[FONT=Courier New][COLOR=rgb(209, 213, 216)]Благодарим Вас за потраченное время на обращение к нам в связи с ограничениями, наложенными на Ваш игровой аккаунт.[/FONT][/COLOR]<br>"+
        "[FONT=Courier New][COLOR=rgb(209, 213, 216)]К несчастью, Вы использовали некорректную формулировку темы обращения, что не позволяет нам рассмотреть Ваше обращение.[/FONT][/COLOR]<br>"+
        "[FONT=Courier New][COLOR=rgb(209, 213, 216)]Вы можете ознакомиться с правильной формулировкой темы в закрепленном сообщении данного раздела и повторно создать новую тему.[/FONT][/COLOR]<br><br>"+
        "'Тема была закрыта.'",
prefix: CLOSE_PREFIX,
status: false,
},
    {
      title: 'Обжалование передано ГА',
      content:
        "[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
        "[COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Ваше обжалование переадресовано[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4] Главному Администратору[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)[FONT=times new roman][SIZE=4].[/SIZE][/FONT][/I][/COLOR]<br>" +
        '[FONT=georgia][SIZE=4][I][COLOR=rgb(209, 213, 216)]Ожидайте ответа в данной теме, копии создавать не нужно.[/COLOR][/I][/SIZE][/FONT][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(250, 197, 28)][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER]',
      prefix: GA_PREFIX,
      status: false,
    },
    {
      title: 'Обжалование одобрено',
      content:
        "[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman]Ваше наказание будет снято / снижено в ближайшее время.[/FONT][/SIZE]<br>" +
        "[FONT=georgia][COLOR=rgb(209, 213, 216)][SIZE=4]Пожалуйста, впредь не повторяйте ошибок, которые могут привести к таким последствиям, а также внимательно изучите общие правила серверов - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL].[/SIZE][/COLOR][/FONT]<br><br>" +
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=georgia]Обжалование одобрено.[/FONT][/SIZE]<br><br>" +
        '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4]Закрыто.[/SIZE][/COLOR][/FONT][/I][/COLOR][/CENTER]',
	      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Снижено до 30 дней',
      content:
        "[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=georgia]Ваше наказание будет снижено до бана на 30 дней в ближайшее время.[/FONT][/SIZE]<br>" +
        "[FONT=georgia][COLOR=rgb(209, 213, 216)][SIZE=4]Пожалуйста, впредь не повторяйте ошибок, которые могут привести к таким последствиям, а также внимательно изучите общие правила серверов - [/I][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL].[/SIZE][/COLOR][/FONT]<br><br>" +
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=georgia]Обжалование одобрено.[/FONT][/SIZE]<br><br>" +
        '[FONT=georgia][COLOR=rgb(255, 0, 0)][SIZE=4]Закрыто.[/SIZE][/COLOR][/FONT][/I][/COLOR][/CENTER]',
	      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Снижено до 15 дней',
      content:
        "[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=georgia]Ваше наказание будет снижено до бана на 15 дней в ближайшее время.[/FONT][/SIZE]<br>" +
        "[FONT=georgia][COLOR=rgb(209, 213, 216)][SIZE=4]Пожалуйста, впредь не повторяйте ошибок, которые могут привести к таким последствиям, а также внимательно изучите общие правила серверов - [/I][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL].[/SIZE][/COLOR][/FONT]<br><br>" +
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=georgia]Обжалование одобрено.[/FONT][/SIZE]<br><br>" +
        '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4]Закрыто[/SIZE][/COLOR][/FONT][/I][/COLOR][/CENTER]',
	      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Снижено до 7 дней',
      content:
        "[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=georgia]Ваше наказание будет снижено до бана на 7 дней в ближайшее время.[/FONT][/SIZE]<br>" +
        "[FONT=georgia][COLOR=rgb(209, 213, 216)][SIZE=4]Пожалуйста, впредь не повторяйте ошибок, которые могут привести к таким последствиям, а также внимательно изучите общие правила серверов - [/I][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL].[/SIZE][/COLOR][/FONT]<br><br>" +
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=georgia]Обжалование одобрено.[/FONT][/SIZE]<br><br>" +
        '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4]Закрыто[/SIZE][/COLOR][/FONT][/I][/COLOR][/CENTER]',
	      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Снижено до 120 мута',
      content:
        "[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=georgia]Ваше наказание будет снижено до мута в 120 минут в ближайшее время.[/FONT][/SIZE]<br>" +
        "[FONT=georgia][COLOR=rgb(209, 213, 216)][SIZE=4]Пожалуйста, впредь не повторяйте ошибок, которые могут привести к таким последствиям, а также внимательно изучите общие правила серверов - [/I][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL].[/SIZE][/COLOR][/FONT]<br><br>" +
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=georgia]Обжалование одобрено.[/FONT][/SIZE]<br><br>" +
        '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4][I]Закрыто.[/I][/SIZE][/COLOR][/FONT][/I][/COLOR][/CENTER]',
	      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Уже обжалован',
      content:
        "[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=georgia]Ранее вам уже было одобрено обжалование и ваше наказание было снижено - повторного обжалования не будет.[/FONT]<br>" +
        "[FONT=georgia][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/FONT][/SIZE][/COLOR]<br><br>" +
        '[COLOR=rgb(209, 213, 216)][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4]Закрыто[/SIZE][/COLOR][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
},
    {
	  title: '| ОБЖ на рассмотрение |',
	  content:
		"[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
		"[B][CENTER][COLOR=rgb(209, 213, 216)]Ваше обжалование взято на рассмотрение, пожалуйста не создавайте дубликатов. Ожидайте ответа.<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрение[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: PIN_PREFIX,
	  status: false,
	},
    {
      title: 'Просрочка ЖБ',
      content:
        "[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
        "[COLOR=rgb(209, 213, 216)][SIZE=4]В вашем случае нужно было сразу реагировать на выданное наказание и обращаться в раздел жалоб на администрацию, в настоящий момент срок написания жалобы прошел.[/I][/SIZE][/COLOR]<br>" +
        "[SIZE=4][COLOR=rgb(209, 213, 216)]Если вы все же согласны с решением администратора - составьте новую тему, предварительно прочитав правила подачи обжалований, закреплённые в данном разделе.[/I][/COLOR][/SIZE]<br>" +
        "[COLOR=rgb(209, 213, 216)][SIZE=4]Просьба не создавать копии данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/COLOR][/FONT]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman]Закрыто.[/FONT][/I][/SIZE][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
	{
	  title: '| В жб на админов |',
	  content:
		"[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
		"[B][CENTER][COLOR=rgb(209, 213, 216)] Если вы не согласны с выданным наказанием, то напишите в раздел Жалобы на Администрацию.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
		},
  {
      title: 'NonRP обман (2)',
      content:
        "[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
        "[COLOR=rgb(209, 213, 216)]Обжалование в вашу пользу должен писать игрок, которого вы обманули.[/COLOR]<br>" +
        "[COLOR=rgb(209, 213, 216)]В доказательствах должны иметься: окно блокировки вашего аккаунта, переписка с обманутым игроком, где вы решили на какую компенсацию он согласен и ваше сообщение, в котором вы признаете совершенную ошибку и впредь обязуетесь не повторять ее.[/COLOR]<br>" +
        "[COLOR=rgb(209, 213, 216)]После всего этого главная администрация рассмотрит обжалование, но это не гарантирует того, что вас обжалуют.[/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Использование ПО',
      content:
        "[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=georgia]Ваш игровой акаунт был заблокирован навсегда за использование стороннего ПО.[/FONT][/SIZE]<br>" +
        "[SIZE=4][FONT=georgia][COLOR=rgb(209, 213, 216)]В обжаловании отказано.[/FONT][/SIZE][/I][/COLOR]<br><br>" +
        "[FONT=georgia][COLOR=rgb(209, 213, 216)][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/COLOR][/FONT]<br><br>" +
        '[FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4]Закрыто.[/I][/SIZE][/COLOR]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
       title: 'Окно бана',
      content:
        "[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
        '[COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Прикрепите в доказательства скриншот окна блокировки, которое появляется сразу после входа в игру.<br>' +
        '[COLOR=rgb(209, 213, 216)]Приятной игры на BLACK RUSSIA[/SIZE][/FONT][/COLOR]<br><br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
       title: 'Разблокировка 24ч',
      content:
        "[B][CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman]{{ greeting }}, уважаемый [/COLOR]{{ user.name }} [/CENTER][/B]"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/NGJ4XCRp/W9QTj.png[/img][/url][/CENTER]"+
        '[COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Ваш аккаунт будет разблокирован на 24 часа.<br>' +
        '[COLOR=rgb(209, 213, 216)]У вас есть 24 чтобы сменить Nickname[/SIZE][/FONT][/COLOR]<br><br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]На рассмотрении.[/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: PIN_PREFIX,
      status: false,
    }
];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('Меню ответов', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
	$(`button#techspec`).click(() => editThreadData( TECH_PREFIX , true));
	$(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
	$(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
	$(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true));
	$(`button#specialAdmin`).click(() => editThreadData(SPECIAL_PREFIX, true));	
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
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
	4 < hours && hours <= 11
	  ? 'Доброе утро'
	  : 11 < hours && hours <= 15
	  ? 'Добрый день'
	  : 15 < hours && hours <= 21
	  ? 'Добрый вечер'
	  : 'Доброй ночи',
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