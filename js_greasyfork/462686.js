// ==UserScript==
// @name         СКРИПТ КФ 
// @namespace    https://forum.blackrussia.online
// @version      1.0
// @description  none
// @author       O.Wilson
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license      MIT
// @collaborator
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/462686/%D0%A1%D0%9A%D0%A0%D0%98%D0%9F%D0%A2%20%D0%9A%D0%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/462686/%D0%A1%D0%9A%D0%A0%D0%98%D0%9F%D0%A2%20%D0%9A%D0%A4.meta.js
// ==/UserScript==
 
(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RASSMOTRENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to Chief Administrator
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to Project Team
const WATCHED_PREFIX = 9;  // Prefix that will be set when thread reviewed by
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closed
const TEX_PREFIX = 13; // Prefix that will be set when thread send to Technical Specialist
const SPEC_PREFIX = 11; // Prefix that will be set when thread send to Special Administrator
const buttons = [
	{
	  title: '----------  Передать жалобу  ------------------------------------------------------------------------------------------------------------------------',
	},
     {
      title: 'На рассмотрении',
      content:
	"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
		        "[B][CENTER]Ваша жалоба взята на рассмотрение.<br>" +
		        'Не нужно создавать копии данной темы.<br>' +
		        "[B][CENTER]В противном случае Вам будет выдана блокировка Форумного Аккаунта.<br><br>" +
		        '[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: PIN_PREFIX,
	  status: true,
    },
	 {
      title: 'ГКФ',
      content:
	"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
		"Ваша жалоба передана на рассмотрение Главному Куратору Форума.<br>" +
		'Не нужно создавать копии данной темы.<br>' +
		"В противном случае Вам будет выдана блокировка Форумно Аккаунта.<br><br>" +
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
     {
      title: 'ГА',
      content:
	"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}[/B][/COLOR]<br><br>"+
		"Ваша жалоба передана на рассмотрение Главному Администратору сервера.<br>" +
		'Не нужно создавать копии данной темы.<br>' +
		"В противном случае Вам будет выдана блокировка Форумного Акааунта.<br><br>" +
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: GA_PREFIX,
	  status: true,
    },	
	{
      title: 'Тех. Специалисту',
      content:
	"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
		"Ваша жалоба передана на рассмотрение Техническому Специалисту.<br>" +
		'Не нужно создавать копии данной темы.<br>' +
		"В противном случае Вам будет выдана блокировка Форумного Аккаунта.<br><br>" +
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: TEX_PREFIX,
	  status: false,
    },	
	 {
      title: 'КП',
      content:
	"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
		"Ваша жалоба передана на рассмотрение Команде Проекта <br>" +
		'Не нужно создавать копии данной темы.<br>' +
		"В противном случае Вам будет выдана блокировка ФА.<br><br>" +
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: COMMAND_PREFIX,
	  status: true,
	},
	{
      title: 'Спец Адм',
      content:
	"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
		"Ваша жалоба передана на рассмотрение Специальному Администратору или же его Заместителю.<br>" +
		'Не нужно создавать копии данной темы.<br>' +
		"В противном случае Вам будет выдана блокировка ФА.<br><br>" +
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: SPEC_PREFIX,
	  status: true,
	},
	 {
	  title: '----------  Правила казино/СТО/клуба  --------------------------------------------------------------------------------------------------------',
	},
	{
      title: 'Инвайт за деньги',
      content:
         "[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
		"[CENTER]Нарушитель будет наказан по Пункту Правил:<br>" +
		'2.01. Владельцу и менеджерам казино и ночного клуба запрещено принимать работников за денежные средства на должность охранника, крупье или механика. [COLOR=rgb(226, 80, 65)]| Ban 3 - 5 дней[/COLOR][/CENTER]<br><br>' +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	   prefix: ACCEPT_PREFIX,
	   status: false,
    },
	{
      title: 'Налоги за работу в казино/клубе',
      content:
        "[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
		"[CENTER]Нарушитель будет наказан по Пункту Правил:<br>" +
		'2.02. Владельцу и менеджерам казино и ночного клуба запрещено взимать у работников налоги в виде денежных средств за должность в казино [COLOR=rgb(226, 80, 65)]| Ban 3 - 5 дней[/COLOR][/CENTER]<br><br>' +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	   prefix: ACCEPT_PREFIX,
	   status: false,
    },
	{
      title: 'Выгоняет без причины из казино',
      content:
        "[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
		"[CENTER]Нарушитель будет наказан по Пункту Правил:<br>" +
		'2.03. Охраннику казино запрещено выгонять игрока без причины [COLOR=rgb(226, 80, 65)]| Увольнение с должности | Jail 30 минут[/COLOR][/CENTER]<br><br>' +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	   prefix: ACCEPT_PREFIX,
	   status: false,
    },
	{
      title: 'Ставка выше чем просят',
      content:
        "[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[CENTER]Нарушитель будет наказан по Пункту Правил:<br>" +
		'2.04. Крупье запрещено делать ставку выше, чем просят игроки [COLOR=rgb(226, 80, 65)]| Увольнение с должности[/COLOR][/CENTER]<br><br>' +
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	   prefix: ACCEPT_PREFIX,
	   status: false,
    },
    {
	  title: '----------  Дополнительно  --------------------------------------------------------------------------------------------------------------------------',
	},
    {
      title: 'Приветствие',
      content:
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]',
    },	
	{
      title: 'ФА уже наказали',
      content:
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>' +
		"[CENTER]Форумный аккаунт нарушителя уже наказан другими Администраторами[/CENTER]<br><br>" +
		'[ICODE]Закрыто[/ICODE][/font][/center]',
	   prefix: CLOSE_PREFIX,
	   status: false,
    },
    {
	  title: '----------  Перенаправить  ---------------------------------------------------------------------------------------------------------------------------',
	},
	{
      title: 'Жалобы на Адм',
	  content:
	    "[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
		"[CENTER]Вы ошиблись разделом, подайте жалобу в раздел Жалобы На Администрацию[/CENTER]<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
      title: 'Жалобы на Лд',
	  content:
	    "[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
		"[CENTER]Вы ошиблись разделом, подайте жалобу в раздел Жалобы На Лидеров[/CENTER]<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
      title: 'Жалобы на Сотрудников',
	  content:
	    "[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
		"[CENTER]Вы ошиблись разделом, подайте жалобу в раздел Жалобы На Сотрудников фракции[/CENTER]<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
      title: 'РП Биографии',
	  content:
	    "[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
		"[CENTER]Вы ошиблись разделом, напишите эту тему в раздел РП Биографии[/CENTER]<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
		{
      title: 'РП Ситуации',
	  content:
	    "[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
		"[CENTER]Вы ошиблись разделом, напишите эту тему в раздел РП Ситуации[/CENTER]<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
      title: 'Обжалование',
	  content:
	    "[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+		
                "[CENTER]Вы ошиблись разделом, подайте жалобу в Обжалование Наказаний[/CENTER]<br><br>" +
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
      title: 'Ошиблись сервером',
	  content:
	    "[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
		"Вы ошиблись сервером, подайте жалобу в раздел жалоб своего сервера<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: '----------  Отказать жалобу  ---------------------------------------------------------------------------------------------------------------------',
	},
	{
      title: 'За /try нету наказания',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
		"[CENTER]За игру в /try нету наказаний от Администрации. Это уже ваше дело и игрока, отдавать деньги или нет.[/CENTER]<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'РП отыгрывать не нужно',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]]<br><br>"+
		"[CENTER]Сотрудникам правоохранительных органов необязательно отыгрывать РП, за них это делает система.[/CENTER]<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Жалоба от 3 лица',
	  content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
		"[CENTER]Жалобы от 3-х лиц не рассматриваются.[/CENTER]<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Нету доказательств',
	  content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
		"[CENTER]В Вашей жалобе отсутствуют доказательства. Просьба написать новую жалобу и прикрепить к ней доказательства о нарушении игрока[/CENTER]<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Нет доступа к доказательствам',
	  content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
		"К Ваш[CENTER]им доказательствам нету доступа или вы указали нерабочую ссылку. Просьба написать новую жалобу и предоставить доступ к доказательствам<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Неадекватная жалоба',
	  content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
		"[CENTER]Составьте жалобу в адекватной форме - без нецензурной лексики, оскорблений и т.д.[/CENTER]<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	{
	title: 'Нету условий сделки',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]В данных доказательствах отсутствуют условия сделки[/CENTER]<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Укажите таймкоды',
	  content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
		"[CENTER]Укажите тайм коды нарушений игрока[/CENTER]<br><br>" +
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: PIN_PREFIX,
	  status: true,
    },
	{
	  title: 'Нарушений не найдено',
	  content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
		"[CENTER]Нарушений со стороны данного игрока не было найдено[/CENTER]<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
      title: 'Дублирование',
      content:
       "[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Ранее вам уже был дан корректный ответ на подобную жалобу, просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован[/CENTER]<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Форма темы',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Ваша жалоба составлена не по форме<br>" +
		'Убедительная просьба ознакомиться с правилами подачи жалоб[/CENTER]<br><br>' +
		'[B][CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Нужна видеофиксация',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]В таких случаях нужна видеофиксация нарушения.[/CENTER]<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Нету /time',
	  content:
        "[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
		"[CENTER]На ваших доказательствах отсутствует /time[/CENTER]<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Доква в соц сетях',
      content:
        "[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Доказательства в социальных сетях и т.д. не принимаются, загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapix и так далее<br>" +
        'Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован[/CENTER]<br><br>' +
		'[B][CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
	{
	  title: 'Док-ва отредактированы',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Ваши доказательства отредактированы, создайте жалобу с первоначальными доказательствами[/CENTER]<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'Недостаточно доказательств',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Недостаточно доказательств на нарушение от данного игрока<br>" +
		'Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока[/CENTER]<br><br>' +
		'[B][CENTER][COLOR=RED][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: '----------  Игровые Аккаунты  ---------------------------------------------------------------------------------------------------------------------',
	},
	{
      title: 'Мультиаккаунт',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил:<br>" +
		'4.04. Разрешается зарегистрировать максимально только три игровых аккаунта на сервере [COLOR=rgb(226, 80, 65)]| PermBan[/COLOR][/CENTER]<br><br>' +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'ППВ',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил:<br>" +
		'4.03. Запрещена совершенно любая передача игровых аккаунтов третьим лицам [COLOR=rgb(226, 80, 65)]| PermBan[/COLOR][/CENTER]<br><br>' +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'ППиВ',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил:<br>" +
		'2.42. Попытка продажи любого игрового имущества или игрового аккаунта за реальные деньги [COLOR=rgb(226, 80, 65)]| PermBan[/COLOR][/CENTER]<br><br>' +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'Трансфер',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил:<br>" +
		'4.05. Запрещено передавать любые игровые ценности между игровыми аккаунтами, а также в целях удержания имущества [COLOR=rgb(226, 80, 65)]| Ban 15 - 30 дней / PermBan[/COLOR][/CENTER]<br><br>' +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',    
  prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'Оск ник',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил:<br>" +
		'4.09. Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [COLOR=rgb(226, 80, 65)]| Устное замечание + смена игрового никнейма / PermBan[/COLOR][/CENTER]<br><br>' +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'Фейк',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил:<br>" +
		'4.10. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [COLOR=rgb(226, 80, 65)]| Устное замечание + смена игрового никнейма / PermBan[/CENTER][/COLOR]<br><br>' +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'АФК С/К / Т/К',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил:<br>" +
		'4.14. Запрещено, имея транспортную или строительную компанию не проявлять активность в игре. [COLOR=rgb(226, 80, 65)]| Обнуление компании без компенсации[/COLOR][/CENTER]<br><br>' +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'АФК АЗС / Бизнес',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил:<br>" +
		'4.13. Запрещено, имея бизнес или автозаправочную станцию (АЗС), заходить в игру только ради его оплаты и не проявлять активность в игре. [COLOR=rgb(226, 80, 65)]| Обнуление владения бизнесом[/CENTER][/COLOR]<br><br>' +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
      title: 'Копирование промо',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил:<br>" +
 		'4.15. Запрещено создавать промокод, идентичный промокоду блогера проекта, а также любой промокод, который не относится к рефералу и имеет возможность пассивного заработка. [COLOR=rgb(226, 80, 65)] | PermBan / Обнуление имущества, заработанного с помощью промокода, а также самого промокода.[/CENTER][/COLOR]<br><br>' +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: '----------  Одобрить жалобу  ----------------------------------------------------------------------------------------------------------------------',
	},
    {
      title: 'DM',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил:<br>" +
		'2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [COLOR=rgb(226, 80, 65)]| Jail 60 минут[/CENTER][/COLOR]<br><br>' +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'DB',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+        
		"[CENTER]Нарушитель будет наказан по пункту общих правил:<br>" +
		'2.13.  Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [COLOR=rgb(226, 80, 65)]| Jail 60 минут[/CENTER][/COLOR]<br><br>' +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'SK',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил:<br>"+
		'2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [COLOR=rgb(226, 80, 65)]| Jail 60 минут / Warn (за два и более убийства)[/CENTER][/COLOR]<br><br>'+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'PG',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил:"+
		'2.17. Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [COLOR=rgb(226, 80, 65)]| Jail 30 минут[/CENTER][/COLOR] <br><br>'+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
		
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'RK',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил:"+
		'2.14. Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [COLOR=rgb(226, 80, 65)]| Jail 30 минут[/CENTER][/COLOR]<br><br>'+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'MG',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил:"+
		'2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [COLOR=rgb(226, 80, 65)]| Mute 30 минут[/CENTER][/COLOR]<br><br>'+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
		
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Caps',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил:"+
		'3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [COLOR=rgb(226, 80, 65)]| Mute 30 минут[/CENTER][/COLOR]<br><br>'+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
		
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Flood',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил:"+
		'3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [COLOR=rgb(226, 80, 65)]| Mute 30 минут[/CENTER][/COLOR]<br><br>'+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
		
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Оскорбление',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил:"+
		'3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [COLOR=rgb(226, 80, 65)]| Mute 30 минут[/CENTER][/COLOR]<br><br>'+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
		
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Упом родни',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил:<br>" +
		'3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [COLOR=rgb(226, 80, 65)]| Mute 120 минут / Ban 7 - 15 дней[/CENTER][/COLOR]<br><br>' +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
		
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Транслит',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил:<br>"+
        "3.20. Запрещено использование транслита в любом из чатов [COLOR=rgb(226, 80, 65)]| Mute 30 минут.[/COLOR]<br>Пример: «Privet», «Kak dela», «Narmalna».<br><br>[/CENTER][/COLOR]" +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Объявы на территории ГОСС',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "Нарушитель будет наказан по пункту общих правил: <br>"+
        "3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [COLOR=rgb(226, 80, 65)]| Mute 30 минут[/COLOR] " +
        "Пример: в помещении центральной больницы писать в чат: «Продам эксклюзивную шапку дешево!!!»<br><br>" +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Угрозы наказанием со стороны Адм',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил:" +
        "3.09. Запрещены любые угрозы о наказании игрока со стороны администрации [COLOR=rgb(226, 80, 65)]| Mute 30 минут[/CENTER][/COLOR]<br><br>" +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'OOC угрозы',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил:"+
        "2.37. Запрещены OOC угрозы, в том числе и завуалированные [COLOR=rgb(226, 80, 65)]| Mute 120 минут / Ban 7 дней[/COLOR][/CENTER]<br><br>" +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Помеха РП',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил:"+
        "2.51. Запрещено вмешательство в Role Play процесс с целью помехи и препятствования дальнейшего развития Role Play процесса [COLOR=rgb(226, 80, 65)]| Jail 30 минут.[/COLOR][/CENTER]" +
        "Пример: вмешательство в Role Play процесс при задержании игрока сотрудниками ГИБДД, вмешательство в проведение тренировки или мероприятия какой-либо фракции и тому подобные ситуации.<br><br>" +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'NonRP аксессуар',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил:"+
        "2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [COLOR=rgb(226, 80, 65)]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/COLOR][/CENTER]<br><br>" +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'NonRP поведение',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил:<br>" +
        "2.01 Запрещено поведение, нарушающее нормы процессов Role Play режима игры [COLOR=rgb(226, 80, 65)]| Jail 30 минут[/COLOR][/CENTER]<br><br>" +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'NRP drive',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил:<br>"+
        "2.03. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [COLOR=rgb(226, 80, 65)]| Jail 30 минут[/COLOR][/CENTER]<br><br>" +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'NRP drive фура/инко',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил:<br>"+
        "2.47. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [COLOR=rgb(226, 80, 65)]| Jail 60 минут[/COLOR][/CENTER].<br><br>" +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Постороннее ПО/Изм. Файлов игры',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил:<br>"+
        "2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [COLOR=rgb(226, 80, 65)]|  Ban 15 - 30 дней / PermBan[/COLOR][/CENTER]<br><br>" +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
    title: 'NRP обман',
      content:
       "[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
       "[CENTER]Нарушитель буден наказан по следующему пункту общих правил:<br><br>" +
       '2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [COLOR=rgb(226, 80, 65)]| PermBan[/COLOR]<br>' +
       "[QUOTE][B][COLOR=rgb(226, 80, 65)]Примечание:[/COLOR][/B] после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/QUOTE]"+
       "[B][QUOTE][COLOR=rgb(226, 80, 65)]Примечание[/COLOR]: разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/B][/QUOTE]<br><br>" +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
	{
      title: 'Слив склада',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил:<br>"+
        "2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [COLOR=rgb(226, 80, 65)]| Ban 15 - 30 дней / PermBan[/COLOR][/CENTER]<br><br>" +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Масс ДМ',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил: <br>"+
        "2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины более трем игрокам [COLOR=rgb(226, 80, 65)]| Warn / Ban 3 - 7 дней[/COLOR][/CENTER]<br><br>" +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Реклама промо',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил: <br>"+
        "3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [COLOR=rgb(226, 80, 65)]| Ban 30 дней[/COLOR][/CENTER]<br><br>" +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Продажа промо',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил: <br>"+
        "2.43. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [COLOR=rgb(226, 80, 65)]| Mute 120 минут[/COLOR][/CENTER]<br><br>" +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неув обр. к Адм',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил: <br>"+
        "2.54. Запрещено неуважительное обращение, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [COLOR=rgb(226, 80, 65)]| Mute 180 минут[/COLOR][/CENTER]<br><br>" +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  status: false,
    },
    {
	  title: 'Обман адм',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил: <br>"+
        "2.32. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [COLOR=rgb(226, 80, 65)]| Ban 7 - 15 дней / PermBan[/COLOR][/CENTER]<br><br>" +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Выдача себя за адм',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил: <br>"+
        "3.10. Запрещена выдача себя за администратора, если таковым не являетесь [COLOR=rgb(226, 80, 65)]| Ban 15 - 30 + ЧС администрации[/COLOR][/CENTER]<br><br>" +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Оск. Проекта',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил: <br>"+
        "2.40.  Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [COLOR=rgb(226, 80, 65)]|Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/COLOR][/CENTER]<br><br>" +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Призыв покинуть проект',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил: <br>"+
        "2.40.  Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [COLOR=rgb(226, 80, 65)]|Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/COLOR][/CENTER]<br><br>" +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Сбив аним',
      content:
        "[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель буден наказан по следующему пункту общих правил:<br><br>" +
        '2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. [COLOR=rgb(226, 80, 65)]| Jail 60 / 120 минут[/COLOR]<br><br>' +
        "[B][QUOTE][COLOR=rgb(226, 80, 65)]Пример:[/COLOR] если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде Jail на 120 минут. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками.<br><br>[COLOR=rgb(226, 80, 65)] [/COLOR][B][COLOR=rgb(226, 80, 65)]Пример:[/COLOR][/B] если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде Jail на 60 минут. [/B][/QUOTE][/CENTER]<br><br>" +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
	{
	  title: 'Ввод в заблуждение',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил: <br>"+
        "2.32. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [COLOR=rgb(226, 80, 65)]| Ban 7 - 15 дней[/COLOR][/CENTER]<br><br>" +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Уход от РП',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил: <br>"+
        "2.02 Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [COLOR=rgb(226, 80, 65)]| Jail 30 минут / Warn[/COLOR][/CENTER] <br>" +
		'[QUOTE][COLOR=rgb(226, 80, 65)][B]Примечание:[/COLOR] например, уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания / ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснутся Вашего персонажа и так далее.[/B][/QUOTE]<br><br>' +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Политика',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "[CENTER]Нарушитель будет наказан по пункту общих правил: <br>"+
        "3.18. Запрещено политическое и религиозное пропагандирование [COLOR=rgb(226, 80, 65)]| Mute 120 минут / Ban 10 дней[/COLOR][/CENTER]<br><br>" +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: '-----  Правила ГОСС  -----------------------------------------------------------------------------------------------------------------------------------',
	},
	{
      title: 'НРП розыск/штраф',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
		"[CENTER]Нарушитель будет наказан по пункту общих правил для Гос. Организаций:<br>" +
		'7.02. Запрещено выдавать розыск, штраф без Role Play причины [COLOR=rgb(226, 80, 65)]| Warn [/COLOR][/CENTER]<br><br>' +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'ДМ на территории УМВД/ГИБДД/ФСБ/ФСИН',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
		"[CENTER]Нарушитель будет наказан по пункту общих правил для Гос. Организаций:<br>" +
		'Запрещено наносить урон игрокам без Role Play причины на территории УМВД / ГИБДД / ФСБ / ФСИН [COLOR=rgb(226, 80, 65)]| DM / Jail 60 минут / Warn [/COLOR][/CENTER]<br><br>' +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'ДМ игроков вне территории ВЧ',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
		"[CENTER]Нарушитель будет наказан по пункту общих правил для Гос. Организаций:<br>" +
		'2.02. Наносить урон игрокам, которые находятся вне территории воинской части, запрещено [COLOR=rgb(226, 80, 65)]| DM / Jail 60 минут / Warn [/CENTER][/COLOR]<br>' +
		"[QUOTE][B][COLOR=rgb(226, 80, 65)]Примечание:[/COLOR] предупреждение (Warn) выдается только в случае Mass DM. [/B][/QUOTE]<br><br>" +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'Правоохран. ограны на территории Bizwar за 10 мин до начала',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
		"[CENTER]Нарушитель будет наказан по пункту общих правил для Гос. Организаций:<br>" +
		'1.14. Сотрудникам правоохранительных органов запрещается задерживать состав участников войны за бизнес за 10 минут непосредственно до начала самого бизвара. [COLOR=rgb(226, 80, 65)]| Jail 30 минут [/COLOR][/CENTER]<br>' +
		"[QUOTE][B][COLOR=rgb(226, 80, 65)]Исключение: [/COLOR]в случае, если состав участников войны за бизнес первый начал совершать действия, которые нарушают закон.[/B][/QUOTE]<br><br>" +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'Подработка в РФ',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
		"[CENTER]Нарушитель будет наказан по пункту общих правил для Гос. Организаций:<br>" +
		'1.07. Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [COLOR=rgb(226, 80, 65)]| Jail 30 минут [/COLOR][/CENTER]<br><br>' +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'Нарушение ПРО',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+		
		"[CENTER]Нарушитель будет наказан по пункту общих правил для Гос. Организаций:<br>" +
		'4.01. Запрещено редактирование объявлений, не соответствующих ПРО [COLOR=rgb(226, 80, 65)]| Mute 30 минут[/COLOR] [/CENTER]<br><br>' +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'НРП эфир ',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
		"[CENTER]Нарушитель будет наказан по пункту общих правил для Гос. Организаций:<br>" +
		'4.02. Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [COLOR=rgb(226, 80, 65)]| Mute 30 минут [/COLOR][/CENTER]<br><br>' +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'Редакт объяв в лич целях',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
		"[CENTER]Нарушитель будет наказан по пункту общих правил для Гос. Организаций:<br>" +
		'4.04. Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [COLOR=rgb(226, 80, 65)]| Ban 7 дней + ЧС организации[/COLOR] [/CENTER]<br><br>' +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'НРП поведение',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
		"[CENTER]Нарушитель будет наказан по пункту общих правил для Гос. Организаций:<br>" +
		'6.03. Запрещено nRP поведение [COLOR=rgb(226, 80, 65)]| Warn [/COLOR][/CENTER]<br><br>' +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'Отбор В/У во время погони',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
		"[CENTER]Нарушитель будет наказан по пункту общих правил для Гос. Организаций:<br>" +
		'7.04. Запрещено отбирать водительские права во время погони за нарушителем [COLOR=rgb(226, 80, 65)]| Warn[/COLOR][/CENTER]<br><br>' +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'Исп Т/С фракции в лич целях',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
		"[CENTER]Нарушитель будет наказан по пункту общих правил для Гос. Организаций:<br>" +
		'1.08. Запрещено использование фракционного транспорта в личных целях [COLOR=rgb(226, 80, 65)]| Jail 30 минут[/COLOR][/CENTER]<br><br>' +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'Одиночный патруль',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
		"[CENTER]Нарушитель будет наказан по пункту общих правил для Гос. Организаций:<br>" +
		'1.11. Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника [COLOR=rgb(226, 80, 65)]| Jail 30 минут[/COLOR][/CENTER]<br><br>' +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'БУ/Казино/Конты/Вышки в РФ',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
		"[CENTER]Нарушитель будет наказан по пункту общих правил для Гос. Организаций:<br>" +
		'1.13. Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работы в форме фракции [COLOR=rgb(226, 80, 65)]| Jail 30 минут [/COLOR][/CENTER]<br><br>' +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: '-----  Правила ОПГ  -------------------------------------------------------------------------------------------------------------------------------------',
	},
	{
      title: 'Nrp ВЧ',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
		"[CENTER]Нарушитель будет наказан по Пункту Правил ОПГ 2.<br>" +
		'2. За нарушение правил нападения на Войсковую Часть выдаётся предупреждение [COLOR=rgb(226, 80, 65)]| Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ) [/COLOR][/CENTER]<br><br>' +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'Вторжение через забор',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
		"[CENTER]Нарушитель будет наказан по Пункту Правил ОПГ 15.<br>" +
		'15. Нападение на военную часть разрешено только через блокпост "КПП" с последовательностью взлома [COLOR=rgb(226, 80, 65)]| /Warn NonRP В/Ч [/COLOR][/CENTER]<br><br>' +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: '-----  РП Биографии  -----------------------------------------------------------------------------------------------------------------------------------',
	},
     {
      title: 'Одобрено',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "Ваша РП Биография получает статус: "+
        "[COLOR=rgb(97, 189, 109)]одобрено[/COLOR][/CENTER]<br><br>",
		
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Отказано',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]"+
        "Ваша РП Биография получает статус: " +
		'[B][CENTER][COLOR=red]Отказано[/COLOR][/CENTER][/B] </p>' +
		"Причиной могло послужить любое нарушение Правил Подачи РП Биографии.<br>" +
		'Ознакомится с ними можно тут - [url=https://forum.blackrussia.online/index.php?threads/spb-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-%D0%A0%D0%9F-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.1873455/]*кликабельно*[/url][/center]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
     {
	  title: 'На доработку',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "Ваша РП Биография получает статус: " +
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
      prefix: PIN_PREFIX,
	  status: true,
    },
	 {
      title: 'Изменений не найдено',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "Ваша РП Биография получает статус: " +
		'[B][CENTER][COLOR=RED]Отказано[/COLOR][/CENTER][/B]</p>' +
		"<br>Причиной послужило не дорабатывание своей РП Биографии в течении 24 часов.<br>" +
		'Ознакомится с правилами написания РП Биографии можно тут - [url=https://forum.blackrussia.online/index.php?threads/rostov-%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.2757909/https://forum.blackrussia.online/index.php?threads/spb-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-%D0%A0%D0%9F-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.1873455/]*кликабельно*[/url][/center]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Не по форме',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "Ваша РП Биография получает статус: " +
		'[B][CENTER][COLOR=RED]Отказано[/COLOR][/CENTER][/B] </p>' +
		"Причиной послужило написание РП Биографии не по форме.<br>" +
		'Ознакомится с ней можно тут - [url=https://forum.blackrussia.online/index.php?threads/spb-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-%D0%A0%D0%9F-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.1873455/]*кликабельно*[/url][/center]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'От 3-го лица',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "Ваша РП Биография получает статус: " +
		'[B][CENTER][COLOR=RED]Отказано[/COLOR][/CENTER][/B] </p>' +
		"Причиной послужило написание РП Биографии от 1-го лица.<br>" +
		'Ознакомится с правилами написания РП Биографии можно тут - [url=https://forum.blackrussia.online/index.php?threads/spb-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-%D0%A0%D0%9F-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.1873455/]*кликабельно*[/url][/center]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Копипаст',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+        
		"Ваша РП Биография получает статус: " +
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B] </p>' +
		"Причиной послужило полное или частичное копирование чужой биографии.<br>" +
		'Ознакомится с правилами написания РП Биографии можно тут - [url=https://forum.blackrussia.online/index.php?threads/spb-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-%D0%A0%D0%9F-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.1873455/]*кликабельно*[/url][/center]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Дублирование',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "Ваша РП Биография получает статус: " +
		'[B][CENTER][COLOR=RED]Отказано[/COLOR][/CENTER][/B] </p>' +
		"Причиной послужило дублирование РП Биографии.<br>" +
		'Ознакомится с правилами написания РП Биографии можно тут - [url=https://forum.blackrussia.online/index.php?threads/spb-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-%D0%A0%D0%9F-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.1873455/]*кликабельно*[/url][/center]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Ошибки в словах',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "Ваша РП Биография получает статус: " +
		'[B][CENTER][COLOR=RED]Отказано[/COLOR][/CENTER][/B] </p>' +
		"Причиной послужило написание РП Биографии с грамматическими / орфографическими ошибками.<br>" +
		'Ознакомится с правилами написания РП Биографии можно тут - [url=https://forum.blackrussia.online/index.php?threads/spb-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-%D0%A0%D0%9F-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.1873455/]*кликабельно*[/url][/center]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Заговолок',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "Ваша РП Биография получает статус: " +
		'[B][CENTER][COLOR=RED]Отказано[/COLOR][/CENTER][/B] </p>' +
		"Причиной послужило написание заговолка РП Биографии не по форме.<br>" +
		'Ознакомится с правилами написания РП Биографии можно тут - [url=https://forum.blackrussia.online/index.php?threads/spb-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-%D0%A0%D0%9F-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.1873455/]*кликабельно*[/url][/center]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Нету имени родных',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "Ваша РП Биография получает статус: " +
		'[B][CENTER][COLOR=RED]Отказано[/COLOR][/CENTER][/B] </p>' +
		"Причиной послужило то, что вы не написали имя родителей и т.д.<br>" +
		'Ознакомится с правилами написания РП Биографии можно тут - [url=https://forum.blackrussia.online/index.php?threads/spb-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-%D0%A0%D0%9F-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.1873455/]*кликабельно*[/url][/center]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: '2 Био на 1 Акк',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "Ваша РП Биография получает статус: " +
		'[B][CENTER][COLOR=RED]Отказано[/COLOR][/CENTER][/B] </p>' +
		"Причиной послужило написание второй Биографии на один игровой аккаунт, что же запрещено правилами написаний РП Биографий.<br>" +
		'Ознакомится с правилами написания РП Биографии можно тут - [url=https://forum.blackrussia.online/index.php?threads/spb-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-%D0%A0%D0%9F-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.1873455/]*кликабельно*[/url][/center]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Мало текста',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "Ваша РП Биография получает статус: " +
		'[B][CENTER][COLOR=RED]Отказано[/COLOR][/CENTER][/B] </p>' +
		"Причиной послужило то, что Вы написали мало текста в своей РП Биографии.<br>" +
		'Ознакомится с правилами написания РП Биографии можно тут - [url=https://forum.blackrussia.online/index.php?threads/spb-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-%D0%A0%D0%9F-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.1873455/]*кликабельно*[/url][/center]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Не красиво',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]]<br><br>"+
        "Ваша РП Биография получает статус: " +
		'[B][CENTER][COLOR=RED]Отказано[/COLOR][/CENTER][/B] </p>' +
		"Причиной послужило написание Вашей РП Биографии не в опрятом виде / не приятно для глаз читателей.<br>" +
		'Ознакомится с правилами написания РП Биографии можно тут - [url=https://forum.blackrussia.online/index.php?threads/spb-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-%D0%A0%D0%9F-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.1873455/]*кликабельно*[/url][/center]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
	  title: '-----  РП Ситуации  -------------------------------------------------------------------------------------------------------------------------------------',
	},
	 {
      title: 'Одобрено',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "Ваша РП Ситуация получает статус: " +
		'[B][CENTER][COLOR=#00FA9A]Одобрено[/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Отказано',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "Ваша РП Ситуация получает статус: " +
		'[B][CENTER][COLOR=RED]Отказано[/COLOR][/CENTER][/B]' +
		"Причиной могло послужить любое нарушение Правил Написания РП Ситуации<br>" +
		'Ознакомится с Правилами Написания РП Ситуаций можно тут - [url=https://forum.blackrussia.online/index.php?threads/spb-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B8.4371363/]*кликабельно*[/url][/center][/font]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
	  title: 'На доработку',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "Ваша РП Ситуации получает статус: " +
		'[B][CENTER][COLOR=yellow]На рассмотрении[/COLOR][/CENTER][/B]',
      prefix: PIN_PREFIX,
	  status: true,
    },
	 {
      title: 'Копипаст',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "Ваша РП Ситуация получает статус: " +
		'[B][CENTER][COLOR=RED]Отказано[/COLOR][/CENTER][/B]' +
		"Причиной послужило копирование чужой темы<br>" +
		'Ознакомится с Правилами Написания РП Ситуаций можно тут - [url=https://forum.blackrussia.online/index.php?threads/spb-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B8.4371363/]*кликабельно*[/url][/center][/font]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Дублирование',
      content:
		"[CENTER][COLOR=rgb(255, 255, 255)][B]Доброго времени суток, [/B][/COLOR][COLOR=rgb(84, 172, 210)][B]{{ user.name }}![/B][/COLOR]<br><br>"+
        "Ваша РП Ситуация получает статус: " +
		'[B][CENTER][COLOR=RED]Отказано[/COLOR][/CENTER][/B]' +
		"Причиной послужило дублирование темы<br>" +
		'Ознакомится с Правилами Написания РП Ситуаций можно тут - [url=https://forum.blackrussia.online/index.php?threads/spb-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B8.4371363/]*кликабельно*[/url][/center][/font]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
	  title: '-----  РП Организации  -------------------------------------------------------------------------------------------------------------------------------',
	},
	 {
      title: 'Одобрено',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "Ваша Неофициальная РП Организация получает статус: " +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Отказано',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "Ваша Неофициальная РП Организация получает статус: " +
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]' +
		"Причиной могло послужить любое нарушение Правил Подачи Заявления На Неофициальную РП Организацию<br>" +
		'Ознакомится с Правилами Написания Неофициальной РП Организации  можно тут - [url=https://forum.blackrussia.online/index.php?threads/rostov-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B0-%D0%9D%D0%B5%D0%BE%D1%84%D0%B8%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D1%83%D1%8E-rp-%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8E.2757945/]*кликабельно*[/url][/center][/font]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
	  title: 'На доработку',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "Ваша Неофициальная РП Организация получает статус<br><br>" +
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]',
      prefix: PIN_PREFIX,
	  status: true,
    },
	 {
      title: 'Копипаст',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "Ваша Неофициальная РП Организация получает статус<br><br>" +
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]' +
		"Причиной послужило копирование текста / темы<br>" +
		'Ознакомится с Правилами Написания Неофициальной РП Организации  можно тут - [url=https://forum.blackrussia.online/index.php?threads/rostov-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B0-%D0%9D%D0%B5%D0%BE%D1%84%D0%B8%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D1%83%D1%8E-rp-%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8E.2757945/]*кликабельно*[/url][/center][/font]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Дублирование',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "Ваша Неофициальная РП Организация получает статус<br><br>" +
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]' +
		"Причиной послужило дублирование темы<br>" +
		'Ознакомится с Правилами Написания Неофициальной РП Организации  можно тут - [url=https://forum.blackrussia.online/index.php?threads/rostov-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B0-%D0%9D%D0%B5%D0%BE%D1%84%D0%B8%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D1%83%D1%8E-rp-%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8E.2757945/]*кликабельно*[/url][/center][/font]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
  ];
  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
    // Добавление кнопок при загрузке страницы
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('На рассмотрение', 'pin');
    addButton('Закрыто', 'close');
	addButton('Рассмотрено', 'rassmotreno');
	addButton('Теху', 'texy');
	addButton('ГА', 'ga');
    addButton('Ответы', 'selectAnswer');
 
    // Поиск информации о теме
    const threadData = getThreadData();
 
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false));
	$('button#texy').click(() => editThreadData(TEX_PREFIX, true));
    $('button#ga').click(() => editThreadData(GA_PREFIX, true));
 
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
        'Доброе утро' :
        11 < hours && hours <= 15 ?
        'Добрый день' :
        15 < hours && hours <= 21 ?
        'Добрый вечер' :
        'Доброй ночи',
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