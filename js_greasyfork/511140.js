// ==UserScript==
// @name         AZURE | Скрипт для Кураторов Форума | 1.1.4 версия Test
// @namespace    https://forum.blackrussia.online
// @version      1.1.4
// @description  Специально для BlackRussia | AZURE |  P.Toretto
// @author       P.Toretto
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MITblackrussia
// @collaborator P.Toretto
// @icon https://icons.iconarchive.com/icons/google/noto-emoji-people-bodyparts/512/12003-OK-hand-light-skin-tone-icon.png
// @downloadURL https://update.greasyfork.org/scripts/511140/AZURE%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20114%20%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F%20Test.user.js
// @updateURL https://update.greasyfork.org/scripts/511140/AZURE%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20114%20%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F%20Test.meta.js
// ==/UserScript==

(function () {
  'use strict';
'esversion 6' ;
const UNACCEPT_PREFIX = 4; // Префикс, который будет установлен при закрытии потока
const ACCEPT_PREFIX = 8; // Префикс, который будет установлен при принятии потока
const PIN_PREFIX = 2; // Префикс, который будет установлен при намотке штифтов
const COMMAND_PREFIX = 10; // Префикс, который будет установлен при отправке потока команде проекта
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7; // Префикс, который будет установлен при закрытии потока.
const TEX_PREFIX = 13;
const GA_PREFIX = 12;
const V_PREFIX = 1;
const buttons = [
      {
          title: '------------------------------------------------------- Передать жалобу -------------------------------------------------------------',
    },
    {
      title: 'Приветствие',
      content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]',
     },
     {
      title: 'На рассмотрении',
      content:
	           "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
	            "[CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		        "[FONT=Times new roman][B][CENTER]Ваша жалоба взята на рассмотрение.<br>" +
		        'Не нужно создавать копии данной темы.<br>' +
		        "[B][CENTER]В противном случае Вам будет выдана блокировка ФА.<br><br>" +
		        '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=YELLOW]  На рассмотрении [/COLOR][/FONT] [/CENTER]'+
		        "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]" +
                '"[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+<br>',
	  prefix: PIN_PREFIX,
	  status: true,
    },
	 {
      title: 'ГКФ',
      content:
         "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
	"[CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple] {{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		"[FONT=times new roman][CENTER]Ваша жалоба передана на рассмотрение Главному Куратору Форума.<br>" +
		'Не нужно создавать копии данной темы.<br>' +
		"В противном случае Вам будет выдана блокировка ФА.<br><br>" +
         "@ <br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

	  prefix: PIN_PREFIX,
	  status: true,
	},

     {
      title: 'ГА',
      content:
         "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
	"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ，уважаемый-(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
		" [FONT=georgia] [B][CENTER]Ваша жалоба передана на рассмотрение Главному Администратору сервера.<br>" +
		'Не нужно создавать копии данной темы.<br>' +
		"В противном случае Вам будет выдана блокировка ФА.<br><br>" +
         "@ <br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
	  prefix: GA_PREFIX,
	  status: true,
    },
	{
      title: 'Теху',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
        "[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}},уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		" [FONT=georgia] [B][CENTER]Ваша жалоба передана на рассмотрение Техническому Специалисту сервера.<br>" +
		'Не нужно создавать копии данной темы.<br>' +
		"В противном случае Вам будет выдана блокировка ФА.<br><br>" +
        " @ <br>" +
	"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
	  prefix: TEX_PREFIX,
	  status: false,
    },
    {
 title: 'ЗГКФ',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
	"[CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple] {{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		"[FONT=times new roman][CENTER]Ваша жалоба передана на рассмотрение Заместителю Главного Куратора Форума.<br>" +
		'Не нужно создавать копии данной темы.<br>' +
		"В противном случае Вам будет выдана блокировка ФА.<br><br>" +
         "@  <br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

	  prefix: PIN_PREFIX,
	  status: true,
	},

     {

	  title: '-------------------------------------------------- Перенаправить ------------------------------------------------------------------------------------',
         },
	{
      title: 'Ошиблись сервером',
	  content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
	    "[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ， уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Скорее всего, Вы ошиблись сервером.<br>" +
        '[FONT=georgia] [B][CENTER]Перенапровляю в нужный раздел.<br>' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
	},
	{
      title: 'Жалобы на Адм',
	  content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
	    "[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ， уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Скорее всего, Вы ошиблись разделом, подайте жалобу в раздел Жалобы На Администрацию<br><br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
 prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
      title: 'Жалобы на Лд',
	  content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
	    "[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ，уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Скорее всего, Вы ошиблись разделом, подайте жалобу в раздел Жалобы На Лидеров<br><br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
      title: 'Жалобы на Сотрудников',
	  content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
	    "[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}， уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Скорее всего, Вы ошиблись разделом, подайте жалобу в раздел Жалобы На Сотрудников фракции<br><br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
      title: 'РП Биографии',
	  content:
	    "[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ，уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Скорее всего, Вы ошиблись разделом, напишите эту тему в раздел РП Биографии<br><br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

	  prefix: CLOSE_PREFIX,
	  status: false,
	},

	{
      title: 'Обжалование',
	  content:
	    "[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}， уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

                " [FONT=georgia] [B][CENTER]Скорее всего, Вы ошиблись разделом, подайте жалобу в Обжалование Наказаний<br><br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
		prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
      title: 'Ошиблись разделом',
	  content:
        "[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Скорее всего, Вы ошиблись разделом, подайте жалобу в правильный на эту тему раздел<br><br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: '-------------------------------------------------------- Отказать жалобу -------------------------------------------------------------------------',
},
	{
      title: 'Доква через другие сайты',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]загрузите доказательства на такие фотохостинги как yapix, imgur, postimages, youtube.<br>"+
         "[FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами подачи жалоб на игроков можно [/COLOR][URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.885160/'][Color=crimson][U]*тут*[/U][/color][/URL].[/CENTER]<br><br>" +
		'[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED] Отказано [/COLOR][/FONT] [/CENTER]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

      prefix: CLOSE_PREFIX,
	  status: false,
      },
	{
      title: 'Nick_Name нарушителя не по форме',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER] Игровой ник автора жалобы, ник игрока, на которого подается жалоба, должны быть указаны в соответствии с правилами подачи жалоб, даже если эта информация присутствует на доказательствах или в тексте жалобы.<br>"+
         "[FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами подачи жалоб на игроков можно [/COLOR][URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.885160/'][Color=crimson][U]*тут*[/U][/color][/URL].[/CENTER]<br><br>" +
		'[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED] Отказано [/COLOR][/FONT] [/CENTER]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

      prefix: CLOSE_PREFIX,
	  status: false,
    },
	{
      title: 'Заголовок не по форме',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]В названии темы необходимо указать никнейм игрока, на которого подается жалоба, и суть жалобы: Nick_Name | Суть жалобы.<br>"+
         "[FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами подачи жалоб на игроков можно [/COLOR][URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.885160/'][Color=crimson][U]*тут*[/U][/color][/URL].[/CENTER]<br><br>" +
		'[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED] Отказано [/COLOR][/FONT] [/CENTER]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'За /try нету наказания',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]За игру в /try нету наказаний от Администрации. Это уже ваше дело и игрока, если отдавать деньги или нет.<br><br>" +
		'[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED] Отказано [/COLOR][/FONT] [/CENTER]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
	prefix: CLOSE_PREFIX,
	  status: false,
    },
{
      title: 'Неполный фрапс',
      content:
        '[Color=MediumPurple][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый-(ая) {{ user.mention }}.[/color][/CENTER]<br>' +

        "[CENTER][B][I][FONT=georgia]Фрапс обрывается. Загрузите полный фрапс на ютуб.[/CENTER]" +
        '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+

        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

      prefix: UNACCEPT_PREFIX,
      status: false,
    },
	{
      title: 'РП отыгрывать не нужно',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Сотрудники правоохранительных органов не должны отыгрывать РП, за них это делает система.<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Жалоба от 3 лица',
	  content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Жалоба должна быть написана от 1 лица<br><br>" +
		"[FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами подачи жалоб на игроков можно [/COLOR][URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.885160/'][Color=crimson][U]*тут*[/U][/color][/URL].[/CENTER]<br><br>" +
		'[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
	prefix: CLOSE_PREFIX,
	  status: false,
    },
	{
	  title: 'Нету доказательств',
	  content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]В Вашей жалобе отсуствуют доказательства. Просьба написать новую жалобу и прикрепить к ней доказательства о нарушении игрока<br><br>" +
		"[FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами подачи жалоб на игроков можно [/COLOR][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/'][Color=crimson][U]*тут*[/U][/color][/URL].[/CENTER]<br><br>" +
	 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Нет доступа к доказательствам',
	  content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]К Вашим доказательствам нету доступа. Просьба написать новую жалобу и предоставить доступ к просмотру доказательств<br><br>" +
	 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Неадекватная жалоба',
	  content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Составьте жалобу в адекватной форме - без призераний, оскорблений и тд.<br><br>" +
		"[FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами подачи жалоб на игроков можно [/COLOR][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/'][Color=crimson][U]*тут*[/U][/color][/URL].[/CENTER]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	{
	title: 'Нету условий сделки',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]В данных доказательствах отсутствуют условия сделки<br><br>" +
        "[FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами подачи жалоб на игроков можно [/COLOR][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/'][Color=crimson][U]*тут*[/U][/color][/URL].[/CENTER]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Укажите таймкоды',
	  content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Укажите тайм коды нарушений игрока и создайте новую жалобу<br><br>" +
		"[FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами подачи жалоб на игроков можно [/COLOR][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/'][Color=crimson][U]*тут*[/U][/color][/URL].[/CENTER]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
       '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
{
      title: 'Более 72 часов',
      content:
       "[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]С момента нарушения прошло более 72 часов.<br><br>" +
		"[FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами подачи жалоб на игроков можно [/COLOR][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/'][Color=crimson][U]*тут*[/U][/color][/URL].[/CENTER]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
       '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

      prefix: UNACCEPT_PREFIX,
      status: false,
    },
	{
	  title: 'Нарушений не найдено',
	  content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Нарушений со стороны данного игрока не было найдено<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
      title: 'Дублирование',
      content:
       "[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple] {{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Ранее вам уже был дан корректный ответ на подобную жалобу, просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован<br><br>" +
        "[FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами подачи жалоб на игроков можно [/COLOR][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/'][Color=crimson][U]*тут*[/U][/color][/URL].[/CENTER]<br><br>" +
         '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Форма темы',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple] {{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Ваша жалоба составлена не по форме<br>" +
		"[FONT=TIMES NEW ROMAN] [I][SIZE=1][COLOR=cyan]  Ознакомиться с правилами подачи жалоб на игроков можно [/COLOR][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/'][Color=crimson][U]*тут*[/U][/color][/URL].[/CENTER]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Нужна видеофиксация',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]В таких случаях нужна видеофиксация нарушения.<br><br>" +
        "[FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами подачи жалоб на игроков можно [/COLOR][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/'][Color=crimson][U]*тут*[/U][/color][/URL].[/CENTER]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Нету /time',
	  content:
        "[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}},уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]На ваших доказательствах отсутствует /time<br><br>" +
		"[FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами подачи жалоб на игроков можно [/COLOR][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/'][Color=crimson][U]*тут*[/U][/color][/URL].[/CENTER]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Доква в соц сетях',
      content:
        "[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}},уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Доказательства в социальных сетях и т.д. не принимаются, загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее<br>" +
        'Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован<br><br>' +
        "[FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами подачи жалоб на игроков можно [/COLOR][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/'][Color=crimson][U]*тут*[/U][/color][/URL].[/CENTER]<br><br>" +
      '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

      prefix: UNACCEPT_PREFIX,
      status: false,
    },
	{
	  title: 'Доква отредактированы',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Ваши доказательства отредактированы, создайте жалобу с первоначальными доказательствами<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'Недостаточно доказательств',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Недостаточно доказательств на нарушение от данного игрока<br>" +
		'Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока<br><br>' +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
        {
        title: 'Доква не рабочие',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Ваши доказательства не работают. Залейте жалобу с рабочими доказательствами.<br><br>" +
		'[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED] Отказано [/COLOR][/FONT] [/CENTER]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
        prefix: UNACCEPT_PREFIX,
	    status: false,
        },
    {
     title: 'Долг через трейд',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]На ваших доказательствах представлены передачи денежных средств через трейд. Долги через них не рассматриваются, будут рассмотрены только через банк.<br><br>" +
		'[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED] Отказано [/COLOR][/FONT] [/CENTER]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
      title: 'Покупка слота',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Покупка доната/слота является нарушением правил 2.28, и такие жалобы не подлежат к рассмотрению.<br><br>" +
		'[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED] Отказано [/COLOR][/FONT] [/CENTER]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
	{
	  title: '------------------------------------------------------ Игровые Аккаунты -----------------------------------------------------------',
	},
	{
      title: 'Продажа ИВ',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил 2.28.<br>" +
	'2.28. Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги[COLOR=RED]|PermBan с обнулением аккаунта + ЧС проекта[/COLOR] <br><br>'+
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

     "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'Мультиаккаунт',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил 4.04.<br>" +
	'Разрешается зарегистрировать максимально только три игровых аккаунта на сервере [COLOR=RED]| PermBan [/COLOR] <br><br>'+
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

     "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'ППВ',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил 4.03.<br>" +
		' Запрещена совершенно любая передача игровых аккаунтов третьим лицам [COLOR=RED]| PermBan [/COLOR] <br><br>' +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одрбрено [/COLOR][/FONT] [/CENTER]'+
        "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/B][/COLOR]",
       prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'ППиВ',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил 2.42.<br>" +
		' Попытка продажи любого игрового имущества или игрового аккаунта за реальные деньги [COLOR=RED]| PermBan. [/COLOR] <br><br>' +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'Трансфер',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил 4.05.<br>" +
		' Запрещено передавать любые игровые ценности между игровыми аккаунтами, а также в целях удержания имущества [COLOR=RED]| Ban 15 - 30 дней / PermBan [/COLOR] <br><br>' +
  '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/B][/COLOR]",
  prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'Оск ник',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил 4.09.<br>" +
		' Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [COLOR=RED]| Устное замечание + смена игрового никнейма / PermBan [/COLOR] <br><br>' +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'Фэйк',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил 4.10.<br>" +
		' Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [COLOR=RED]| Устное замечание + смена игрового никнейма / PermBan [/COLOR] <br><br>' +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },


	{
      title: 'Копирование промо',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил 4.15.<br>" +
		' Запрещено создавать промокод, идентичный промокоду блогера проекта, а также любой промокод, который не относится к рефералу и имеет возможность пассивного заработка.<br>' +
		"Наказание: перманентная блокировка аккаунта или обнуление имущества, заработанного с помощью промокода, а также самого промокода.<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]',

      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: '------------------------------------------------------------- Одобрить жалобу --------------------------------------------------------------------------',
    },
    {
        title: 'Игрок будет наказан',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан. <br>" +
' Игрок будет наказан по правилам общих серверов. <br><br>' +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'DM',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил 2.19.<br>" +
		' Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [COLOR=RED]| Jail 60 минут[/COLOR]<br><br>' +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'DB',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}},уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		"[B][CENTER]Нарушитель будет наказан по пункту общих правил 2.13.<br>" +
		'Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [COLOR=RED] | Jail 60 минут [/COLOR]<br><br>' +
		'[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'SK',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил 2.16.<br>"+
		' Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [COLOR=RED]| Jail 60 минут / Warn [/COLOR] (за два и более убийства)<br><br>'+
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
         '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'PG',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил 2.17."+
		' Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь | Jail 30 минут <br><br>'+
  '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
         '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'RK',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил 2.17."+
		' Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти  [COLOR=RED]| Jail 30 минут[/COLOR]<br><br>'+
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
         '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ТК',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил 2.15."+
		'Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [COLOR=RED]| Jail 60 минут / Warn[/COLOR] (за два и более убийства)<br><br>'+
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

		"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

      prefix: ACCEPT_PREFIX,
	  status: false,
    },
{
      title: 'Мат в VIP чат',
      content:
		'[Color=MediumPurple][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый-(ая) {{ user.name }}.[/color][/CENTER]<br>' +

        "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.23. Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [Color=Red]| Mute 30 минут[/CENTER]<br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'MG',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил 2.18."+
		' Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе[COLOR=RED] | Mute 30 минут[/COLOR]<br><br>'+
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Caps',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил 3.02."+
		' Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате[COLOR=RED] | Mute 30 минут[/COLOR]<br><br>'+
	 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+
	"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
         '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Flood',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил 3.05."+
		' Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [COLOR=RED]| Mute 30 минут[/COLOR]<br><br>'+
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

		"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
         '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Оск',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил 3.03."+
		' Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены[COLOR=RED] | Mute 30 минут[/COLOR]<br><br>'+
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

		"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
         '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Упом родни',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил <br>" +
		'3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [COLOR=RED]| Mute 120 минут / Ban 7 - 15 дней.[/COLOR]<br><br>' +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Транслит',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил <br>3.20. Запрещено использование транслита в любом из чатов [COLOR=RED]| Mute 30 минут.[/COLOR]<br>Пример: «Privet», «Kak dela», «Narmalna».<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Объявы на территории ГОСС',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил <br>3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC)[COLOR=RED] | Mute 30 минут.[/COLOR]<br>Пример: в помещении центральной больницы писать в чат: «Продам эксклюзивную шапку дешево!!!»<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Угрозы наказанием со стороны Адм',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил <br>3.09. Запрещены любые угрозы о наказании игрока со стороны администрации [COLOR=RED]| Mute 30 минут.[/COLOR]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+
        "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

      prefix: ACCEPT_PREFIX,
	  status: false,
        },
	{
	  title: 'Скрытие нарушителей',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил <br>2.24. Запрещено скрывать от администрации нарушителей или злоумышленников  [COLOR=RED]| Ban 15 - 30 дней / PermBan + ЧС проекта.[/COLOR]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+
        "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Багаюз',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил <br>2.21. Запрещено пытаться обходить игровую систему или использовать любые баги сервера. [COLOR=RED]| Ban 15 - 30 дней /PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов).[/COLOR]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+
        "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'OOC угрозы',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил <br>2.37. Запрещены OOC угрозы, в том числе и завуалированные[COLOR=RED] | Mute 120 минут / Ban 7 дней[/COLOR]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Помеха РП',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил <br>2.51. Запрещено вмешательство в Role Play процесс с целью помехи и препятствования дальнейшего развития Role Play процесса[COLOR=RED] | Jail 30 минут.[/COLOR]<br>Пример: вмешательство в Role Play процесс при задержании игрока сотрудниками ГИБДД, вмешательство в проведение тренировки или мероприятия какой-либо фракции и тому подобные ситуации.<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'NonRP аксессуар',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил <br>2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут.<br>Пример: слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное.<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'NonRP поведение',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил <br>2.01 Запрещено поведение, нарушающее нормы процессов Role Play режима игры[COLOR=RED] | Jail 30 минут.[/COLOR]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+


"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'NRP drive',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.03. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [COLOR=RED]| Jail 30 минут.[/COLOR]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },{
      title: 'ознакомление с правилом долга',
      content:
        '[Color=MediumPurple][FONT=TIMES NEW ROMAN][CENTER][I]{{greeting}} , уважаемый-(ая) {{ user.name }}.[/color][/CENTER]<br>' +
        '[CENTER][FONT=TIMES NEW ROMAN][COLOR=lightgreen]Ознакомьтесь[/COLOR][/CENTER] <br>' +
        '[FONT=TIMES NEW ROMAN][Color=crimson]Примечание:[/color] займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется; <br>' +
        '[FONT=TIMES NEW ROMAN][Color=crimson]Примечание:[/color] при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда; <br>' +
        '[FONT=TIMES NEW ROMAN][Color=crimson]Примечание:[/color] жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/CENTER] <br>' +
        "[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED] Отказано [/COLOR][/FONT][/CENTER] <br>"+
        "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR] <br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
	  title: 'NRP drive фура/инко',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.47. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [COLOR=RED]| Jail 60 минут.[/COLOR]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДОЛГ',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил: <br> 2.57. Запрещается брать в долг игровые ценности и не возвращать их. [COLOR=RED]| Ban 30 дней / permban [/COLOR]<br><br>"+
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

		"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Cтороннее ПО',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками[COLOR=RED] |  Ban 15 - 30 дней / PermBan.[/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
    title: 'NRP обман',
      content:
       "[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

       " [FONT=georgia] [B][CENTER]Нарушитель буден наказан по следующему пункту общих правил серверов:<br><br>" +
       '2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [COLOR=RED]| PermBan[/COLOR]<br>' +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
	{
      title: 'Слив склада',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил <br>2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [COLOR=RED]| Ban 15 - 30 дней / PermBan[/COLOR]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Запрещен уход от наказания',
	  content:
'[CENTER][B][FONT=TIMES NEW ROMAN][COLOR=MediumPurple][SIZE=1]{{greeting}} ,уважаемый-(ая) {{user.name}}[/SIZE][/COLOR]<br><br>' +

'[COLOR=white][FONT=TIMES NEW ROMAN]Игроку будет выдано наказание по пункту правил: [/COLOR]<br><br>' +
'2.34.Запрещен уход от наказания [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней (суммируется к общему наказанию дополнительно)[/COLOR]<br><br>' +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Масс ДМ',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил <br>2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины более трем игрокам [COLOR=RED]| Warn / Ban 3 - 7 дней.[/COLOR]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Реклама промо',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [COLOR=RED]| Ban 30 дней.[/COLOR]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Продажа промо',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.43. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [COLOR=RED]| Mute 120 минут.[/COLOR]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неув обр. к Адм',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.54. Запрещено неуважительное обращение, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [COLOR=RED]| Mute 180 минут[/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
	   prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Обман адм',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.32. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [COLOR=RED]| Ban 7 - 15 дней / PermBan[/COLOR]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Выдача себя за адм',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>3.10. Запрещена выдача себя за администратора, если таковым не являетесь[COLOR=RED] | Ban 15 - 30 + ЧС администрации[/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Оск. Проекта',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.40.  Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [COLOR=RED]|Mute 300 минут / Ban 30 дней[/COLOR] (Ban выдается по согласованию с главным администратором)<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Призыв покинуть проект',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.40.  Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [COLOR=RED]|Mute 300 минут / Ban 30 дней [/COLOR](Ban выдается по согласованию с главным администратором)<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Сбив аним',
      content:
        "[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель буден наказан по следующему пункту общих правил серверов:<br><br>" +
        '2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. [COLOR=RED]| Jail 60 / 120 минут[/COLOR]<br><br>' +
        "Пример: если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде Jail на 120 минут. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками.<br><br>" +
        'Пример: если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде Jail на 60 минут.<br><br>' +
        '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
	{
	  title: 'Ввод в заблуждение',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple] {{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.32. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта[COLOR=RED] | Ban 7 - 15 дней[/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Уход от РП',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple] {{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.02 Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [COLOR=RED]| Jail 30 минут / Warn[/COLOR]<br>" +
		'Примечание: например, уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания / ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснутся Вашего персонажа и так далее<br><br>' +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
         '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Политика',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>3.18. Запрещено политическое и религиозное пропагандирование [COLOR=RED]| Mute 120 минут / Ban 10 дней[/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
         title: 'Помеха ИП',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.04. Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы.[COLOR=RED]|Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
       title: 'Оск родни в Voice',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>3.15. Запрещено оскорблять игроков или родных в Voice Chat.[COLOR=RED]| Mute 120 минут / Ban 7 - 15 дней[/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
         prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
       title: 'Музыка в Voice',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>3.14. Запрещено включать музыку в Voice Chat.[COLOR=RED] | Mute 60 минут[/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
         prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Шум в Voice',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>3.16. Запрещено создавать посторонние шумы или звуки.[COLOR=RED]| Mute 30 минут[/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
         prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
         title: 'Реклама в Voice',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>3.17. Запрещена реклама в Voice Chat не связанная с игровым процессом.[COLOR=RED]| Ban 7 - 15 дней[/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
         prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
 title: 'Оск в OOC чате',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены.[COLOR=RED]| Mute 30 минут[/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
         prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: 'Оскорбления секс характера',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>3.07. Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата.[COLOR=RED]| Mute 30 минут[/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
         prefix: ACCEPT_PREFIX,
	  status: false,

    },
    {
         title: 'Аморал действие',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков.[COLOR=RED]| Jail 30 минут / Warn[/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
         prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'Исп уязвимостью правил',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.33. Запрещено пользоваться уязвимостью правил.[COLOR=RED]| Ban 15 дней [/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
         prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
         title: 'Распростронение личной инфо игроков',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.38.Запрещено распространять личную информацию игроков и их родственников.[COLOR=RED]| Ban 15 - 30 дней / PermBan [/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
         prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Покупка репутации семьи',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.48. Запрещена продажа, передача, трансфер или покупка репутации семьи любыми способами, скрытие нарушителей, читеров лидером семьи.[COLOR=RED]| Обнуление рейтинга семьи / Обнуление игрового аккаунта лидера семьи [/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
         prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Многократная продажа покупка реп',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.49. Многократная продажа или покупка репутации семьи любыми способами.[COLOR=RED]| Ban 15 - 30 дней / PermBan + удаление семьи [/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
         prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
    title: 'задержания, аресты ауц,каз,системные мероприятия',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.50. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий.[COLOR=RED]| Ban 7 - 15 дней + увольнение из организации [/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
         prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {

	  title: '----------------------------------------------------------------- Правила ГОСС ------------------------------------------------------------------------',
    },
	{
      title: 'НРП розыск/штраф',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Нарушитель будет наказан по Пункту Правил ГОСС 7.02.<br>" +
		'7.02. Запрещено выдавать розыск, штраф без Role Play причины [COLOR=RED]| Warn [/COLOR]<br><br>' +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },


	{
      title: 'Правоохран. ограны на территории Bizwar за 10 мин до начала',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Нарушитель будет наказан по Пункту Правил ГОСС 1.14.<br>" +
		'1.14. Сотрудникам правоохранительных органов запрещается задерживать состав участников войны за бизнес за 10 минут непосредственно до начала самого бизвара.[COLOR=RED] | Jail 30 минут [/COLOR]<br>' +
		"Исключение: в случае, если состав участников войны за бизнес первый начал совершать действия, которые нарушают закон.<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'Подработка в РФ',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Нарушитель будет наказан по Пункту Правил ГОСС 1.07.<br>" +
		'1.07. Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [COLOR=RED]| Jail 30 минут[/COLOR] <br><br>' +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'Нарушение ПРО',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		"[B][CENTER]Нарушитель будет наказан по Пункту Правил ГОСС 4.01.<br>" +
		'4.01. Запрещено редактирование объявлений, не соответствующих ПРО [COLOR=RED]| Mute 30 минут [/COLOR]<br><br>' +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'НРП эфир ',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Нарушитель будет наказан по Пункту Правил ГОСС 4.02.<br>" +
		'4.02. Запрещено проведение эфиров, не соответствующих Role Play правилам и логике[COLOR=RED] | Mute 30 минут [/COLOR]<br><br>' +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'Редакт  в лц',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Нарушитель будет наказан по Пункту Правил ГОСС 4.04.<br>" +
		'4.04. Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком[COLOR=RED] | Ban 7 дней[/COLOR] + ЧС организации <br><br>' +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
       title: ' Слив СМИ',
	  content:
'[CENTER][B][FONT=TIMES NEW ROMAN][COLOR=MediumPurple][SIZE=1] {{greeting}}, уважаемый-(ая) {{user.name}} [/SIZE][/COLOR]<br><br>' +

'[COLOR=white]Игроку будет выдано наказание по пункту правил: [/COLOR]<br><br>' +
'3.08. Запрещены любые формы «слива» посредством использования глобальных чатов [COLOR=rgb(255, 0, 0)]| PermBan[/COLOR]<br><br>' +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',

   prefix:ACCEPT_PREFIX,
   status:false,

    },
	{
      title: 'НРП поведение',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} , уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Нарушитель будет наказан по Пункту Правил ГОСС 6.03.<br>" +
		'6.03. Запрещено nRP поведение[COLOR=RED] | Warn[/COLOR] <br><br>' +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },

	{
      title: 'Исп Т/С фракции в лич целях',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Нарушитель будет наказан по Пункту Правил ГОСС 1.08.<br>" +
		' Запрещено использование фракционного транспорта в личных целях [COLOR=RED]| Jail 30 минут.[/COLOR]<br><br>' +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'Одиночный патруль',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple] {{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Нарушитель будет наказан по Пункту Правил ГОСС 1.11.<br>" +
		' Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника [COLOR=RED]| Jail 30 минут.[/COLOR]<br><br>' +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'БУ/Казино/Конты/Вышки в РФ',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Нарушитель будет наказан по Пункту Правил ГОСС 1.13.<br>" +
		' Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работы в форме фракции[COLOR=RED] | Jail 30 минут[/COLOR] <br><br>' +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: '------------------------------------------------------------ Правила ОПГ ----------------------------------------------------------------------------',
    },
    {
      title: 'Nrp ВЧ',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Нарушитель будет наказан по Пункту Правил ОПГ 2.<br>" +
		'. За нарушение правил нападения на Войсковую Часть выдаётся предупреждение [COLOR=RED][COLOR=RED] | Jail 30 минут[/COLOR] (NonRP нападение) / Warn (Для сотрудников ОПГ) [/COLOR]<br><br>' +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]Azure[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },

    {
      title: '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| RP Биографии |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
      content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
      },
    {
        title: 'RP био одобрена',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография одобрена. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
     "[FONT=georgia][SIZE=4][CENTER][SPOILER][I][B][COLOR=rgb(0, 221, 0)]Одобрено [/COLOR][/CENTER][/SPOILER][/I][/SIZE][/FONT]<br><br>" ,
       prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
        title: 'ГКФ/ЗГКФ',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[COLOR=rgb(252, 15, 192)][I][FONT=georgia][SIZE=4]Ваша Role Play Биография переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(252, 15, 192)][I][FONT=georgia][SIZE=4]ГКФ [URL='https://vk.com/juniorgrand']*Нажмите сюда*[/URL] , ЗГКФ [URL='https://vk.com/papapetra']*Нажмите сюда*[/URL]  [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(252, 15, 192)][I][FONT=georgia][SIZE=4], ожидайте ответа в данной теме.[/SIZE][/FONT]<br><br>" +
    "[SPOILER][I][FONT=georgia][SIZE=4][COLOR=rgb(252, 15, 192)]Примечание: [/COLOR][/I][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован. [/COLOR][/SIZE][/FONT][/SPOILER]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 255, 0)][I][B][FONT=georgia][SIZE=4]На рассмотрении![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]",
       prefix: PIN_PREFIX,
      status: false,
    },
    {
        title: 'RP био отказана',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-Правила-создания-roleplay-биографии.5829805/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] Azure[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
    {
        title: 'На доработке',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография на доработке. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-Правила-создания-roleplay-биографии.5829805/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]На доработке!![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: PIN_PREFIX,
    },
     {
      title: '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| RP Био Отказы |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
      content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
      },
    {
        title: 'RP био NonRP nick',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к у вас NonRP NickName. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-Правила-создания-roleplay-биографии.5829805/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/B][/I][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP био заголовок не по форме',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. заголовок оформлен неправильно. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-Правила-создания-roleplay-биографии.5829805/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/B][/I][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'более 1 рп био на ник',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к запрещено создавать более одной RP Биографии на один Nick. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-Правила-создания-roleplay-биографии.5829805/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
    },
    {
        title: 'RP био некоррект. возраст',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. в ней указан некорректный возраст. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-Правила-создания-roleplay-биографии.5829805/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP био мало информации',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. в ней написано мало информации. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-Правила-создания-roleplay-биографии.5829805/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP био нет 18 лет',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. персонажу нет 18 лет. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-Правила-создания-roleplay-биографии.5829805/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP био от 3го лица',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. написана от 3-го лица. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-Правила-создания-roleplay-биографии.5829805/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/B][/I][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP био не по форме',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. она составлена не по форме. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-Правила-создания-roleplay-биографии.5829805/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP био не дополнил',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. вы её не дополнили. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-Правила-создания-roleplay-биографии.5829805/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP био неграмотная',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. она оформлена неграмотно. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-Правила-создания-roleplay-биографии.5829805/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/I][/B][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Тавтология — это риторическая фигура, представляющая собой необоснованное повторение одних и тех же (или однокоренных) или близких по смыслу слов.[/SIZE][/CENTER][/COLOR][/FONT]" +
    "[HEADING=3][CENTER][I][B][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/I][/B][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Грамматическая ошибка - это ошибка в структуре языковой единицы: в структуре слова, словосочетания или предложения; это нарушение какой-либо грамматической нормы - словообразовательной, морфологической, синтаксической.[/SIZE][/CENTER][/COLOR][/FONT]" +
    "[HEADING=3][CENTER][I][B][COLOR=rgb(0, 255, 255)][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/I][/B][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Пунктуационная ошибка - это неиспользование пишущим необходимого знака препинания или его употребление там, где он не требуется, а также необоснованная замена одного знака препинания другим.[/SIZE][/CENTER][/COLOR][/FONT]" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP био тавтология',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. она оформлена неграмотно. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-Правила-создания-roleplay-биографии.5829805/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/I][/B][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Тавтология — это риторическая фигура, представляющая собой необоснованное повторение одних и тех же (или однокоренных) или близких по смыслу слов.[/SIZE][/CENTER][/COLOR][/FONT]" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP био знаки препинания',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. она оформлена неграмотно. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-Правила-создания-roleplay-биографии.5829805/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][COLOR=rgb(0, 255, 255)][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/I][/B][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Пунктуационная ошибка - это неиспользование пишущим необходимого знака препинания или его употребление там, где он не требуется, а также необоснованная замена одного знака препинания другим.[/SIZE][/CENTER][/COLOR][/FONT]" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP био граммат. ошибки',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. она оформлена неграмотно. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-Правила-создания-roleplay-биографии.5829805/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/I][/B][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Грамматическая ошибка - это ошибка в структуре языковой единицы: в структуре слова, словосочетания или предложения; это нарушение какой-либо грамматической нормы - словообразовательной, морфологической, синтаксической.[/SIZE][/CENTER][/COLOR][/FONT]" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP био скопирована',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. она скопирована. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-Правила-создания-roleplay-биографии.5829805/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'скопирована со своей старой био',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. она скопирована с вашей прошлой РП Биографии на другой ник. Нужно на новый ник писать новую историю. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-Правила-создания-roleplay-биографии.5829805/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'мало инфо детство',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к в пункте Детство мало информации. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-Правила-создания-roleplay-биографии.5829805/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
    {
        title: 'мало инфо юность',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к в пункте Юность и Взрослая жизнь мало информации. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-Правила-создания-roleplay-биографии.5829805/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
    {
        title: 'мало инфо Взрослая жизнь',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к в пункте Взрослая жизнь мало информации. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-Правила-создания-roleplay-биографии.5829805/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
    {
        title: 'мало инфо',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к в пункте *Детство* и *Юность и Взрослая* жизнь мало информации. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-Правила-создания-roleplay-биографии.5829805/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
     {
        title: 'Пункт 8 Армия',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к в пункте 8. Период воинской службы (для мужчин) сделано не правельно. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-Правила-создания-roleplay-биографии.5829805/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимание: 6. Период воинской службы (для мужчин, дата должна быть полностью развернутой) Пример: 8. Период воинской службы (для мужчин): 07.11.2018 Закончил 07.11.2019 [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
     {
        title: 'Нет логики в пункте 11.3',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к в пункте 11.3 сделана не логично. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-Правила-создания-roleplay-биографии.5829805/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] Внимание:10.3. Взрослая жизнь (рассказываете о своей взрослой жизни): С 18-20 лет. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
      {
        title: 'Нет логики в пункте 11.2',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к в пункте 11.2 сделана не логично. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-Правила-создания-roleplay-биографии.5829805/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] Внимание:10.2. Юность (рассказываете о своей подростковой жизни); -С 13-15 лет до 18.. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
     {
        title: 'Нет логики в пункте 11.1',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к в пункте 11.1 сделана не логично. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-Правила-создания-roleplay-биографии.5829805/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] Внимание:10.1. Детство (описываете все, что случилось с Вашим персонажем в детстве); -С рождение - 12 лет до.. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
     {
        title: 'Нет логики в пункте 5',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к в пункте 5 сделана не логично. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-Правила-создания-roleplay-биографии.5829805/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] Внимание: В пункте номер 5 у вас должно стоять хотябы рост 150+ так как у вас будет всегда отказано изза роста, Пример: 5. Рост:183 См. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
     {
        title: 'Пункт 1 не совпадает с 3',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к в пункте 1 Не совпадает с пунктом 3. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-Правила-создания-roleplay-биографии.5829805/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] Внимание: 1. Фамилия Имя Отчество игрового персонажа. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] Примичание: 1.1. Если отчество будет не соответствовать Имени отца – Нет логики. Исключение: Если вы обыграете смену отчества через смену данных в паспорте.. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] Примичание: 1.2. Если в пункте будет записано выдуманный Nrp Nick-Name, кличка и тому подобное – Не по форме. . [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
     "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] Примичание: 3. Сведения о родителях: . [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
     "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] Примичание: 3.1. Если отчество будет не соответствовать имени отца – Нет логики. Исключение: Если вы обыграете смену отчества через смену данных в паспорте. . [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] Примичание: 3.2. Если в пункте 3 будет записана посторонняя информация про ваших других родственников – Не по форме. . [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
     {
        title: 'Нет логики в пункте 2',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к в пункте 2. Дата и место рождения: сделана не логично. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-Правила-создания-roleplay-биографии.5829805/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] Внимание: В пункте номер 2. Дата и место рождения: 2.1. Если ваш возраст от даты рождения в биографии до даты написания биографии будет меньше 18-20 лет – Нет логики. Пример: 10.05.2000 - 10.05.2017 . [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] 2.2. Если ваше место рождения не будет совпадать с местом рождения, которое вы вероятнее всего напишите в пункте 10.1-10.3 – Нет логики. . [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
    {
        title: 'Нет логики в пункте 4',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к в пункте 4 сделана не логично. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-Правила-создания-roleplay-биографии.5829805/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] Внимание: 4.1. Если вы указали в пункте 4 образование, на которое вы не отучились через текст в пунктах 10.1-10.3 – Нет логики.. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
     "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] Внимание: Пример: Игрок указал в пункте 4 Высшее профессиональное образование, а в биографии написал, что окончил всего 11 классов и не пошёл в университет.. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
    {
        title: 'Пункт 2 не совпадает с пунктом 11.1',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к в пункт 11.1 не совпадает с пунктом 2, тоесть  сделана не логично. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-Правила-создания-roleplay-биографии.5829805/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] Внимание: 2. Дата и место рождения: . [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
     "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] 2.1. Если ваш возраст от даты рождения в биографии до даты написания биографии будет меньше 18-20 лет – Нет логики. . [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
     "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] 2.2. Если ваше место рождения не будет совпадать с местом рождения, которое вы вероятнее всего напишите в пункте 10.1-10.3 – Нет логики.. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
      "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] Пример: 10.05.2000 - 10.05.2017. . [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
      "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] 10.1. Детство (описываете все, что случилось с Вашим персонажем в детстве);  [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
      "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] 10.2. Юность (рассказываете о своей подростковой жизни); -С 13-15 лет до 18. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
      "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] 10.3. Взрослая жизнь (рассказываете о своей взрослой жизни): [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
      "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] С 18-20 лет . [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
     {
        title: 'Пункт 2 отличается от пункта 8',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к в пункт 8 отличается от пункта 2. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-Правила-создания-roleplay-биографии.5829805/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] Внимание: 2. Дата и место рождения:. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] 2.1. Если ваш возраст от даты рождения в биографии до даты написания биографии будет меньше 18-20 лет – Нет логики. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] Пример: 10.05.2000 - 10.05.2017. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
     "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] 2.2. Если ваше место рождения не будет совпадать с местом рождения, которое вы вероятнее всего напишите в пункте 10.1-10.3 – Нет логики.. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
      "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] 6. Период воинской службы (для мужчин, дата должна быть полностью развернутой). [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
       "[HEADING=3][CENTER][I][COLOR=rgb(255, 182, 193)][FONT=georgia][SIZE=4] 8. Период воинской службы (для мужчин): 22.04.2018 - Закончи службу 21.04.2019. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
       status: false,
    },
    {
        title: 'Пункт 11.3 Нету армии',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. в вашем пункте 11.3 не написано про Армию, расспишите более подробно про нее. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-Правила-создания-roleplay-биографии.5829805/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'био отказ(Нет логики в пункте 11.2 11.3)',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. она В вашей RolePlay Биографии нету логики в пункте 8, прочитайте ее внимательно так как она должна состоять Юность с 13 лет по 17 лет а Взрослая жизнь с 18 и до того момента ч то вы сделали за это время 18 летие. . [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-Правила-создания-roleplay-биографии.5829805/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'био отказ(Возраст и Дата)',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. она Причиной отказа могло послужить несовпадение возраста и даты рождения. . [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-Правила-создания-roleplay-биографии.5829805/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'НЕ НАЖЫМАТЬ',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. она Причиной отказа могло послужить несовпадение возраста и даты рождения. . [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-Правила-создания-roleplay-биографии.5829805/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP био только исполнилось 18 лет',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к. вам только исполнилось 18 лет и вас забрать не смогут ( максимум через дней 4 ). [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-Правила-создания-roleplay-биографии.5829805/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
      title: '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| RP Ситуации, (КФ нельзя) |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
      content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
      },
      {
        title: 'RP ситуация одобрена',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - ситуация одобрена. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
     "[FONT=georgia][SIZE=4][CENTER][SPOILER][I][B][COLOR=rgb(0, 221, 0)]Одобрено [/COLOR][/CENTER][/SPOILER][/I][/SIZE][/FONT]<br><br>" ,
       prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'RP ситуация не по форме',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - ситуация отказана т.к. она составлена не по форме. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - ситуацию закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B9.600867/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'RP ситуация сделана не в тот раздел (ЖАЛОБА)',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - ситуация отказана т.к. вы обратились не в тот раздел, вам нужно в раздел Жалоб. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - ситуацию закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B9.600867/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'RP ситуация не в том раздел (РП био)',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - ситуация отказана т.к. вы обратились не в тот раздел, Вам нужно в Role Play Биографии. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - ситуацию закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B9.600867/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
     {
        title: 'RP ситуация отказано из-за Неправельного РП ',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - ситуация отказана т.к. у вас Неправельное Role Play Отыгровки. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - ситуацию закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B9.600867/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP ситуации граммат. ошибки',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - ситуация отказана т.к. она оформлена неграмотно. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B9.600867/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/I][/B][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Грамматическая ошибка - это ошибка в структуре языковой единицы: в структуре слова, словосочетания или предложения; это нарушение какой-либо грамматической нормы - словообразовательной, морфологической, синтаксической.[/SIZE][/CENTER][/COLOR][/FONT]" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP ситуация NonRP nick',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - биография отказана т.к у вас NonRP NickName. [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][B][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B9.600867/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br><br>" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/B][/I][/COLOR][/CENTER][/HEADING]<br>",
      prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: 'RP ситуации знаки препинания',
      content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR][/HEADING]<br><br>" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Ваша RolePlay - ситуация отказана т.к. она оформлена неграмотно. [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]" +
    "[HEADING=3][CENTER][I][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4] Внимательно прочитайте правила создания RP - ситуации закрепленные в данном разделе [URL='https://forum.blackrussia.online/threads/azure-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-roleplay-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B9.600867/']*Нажмите сюда*[/URL] [/SIZE][/FONT][/COLOR][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][I][B][COLOR=rgb(0, 255, 255)][COLOR=rgb(252, 15, 192)][FONT=georgia][SIZE=4]Примечание: [/SIZE][/I][/B][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Пунктуационная ошибка - это неиспользование пишущим необходимого знака препинания или его употребление там, где он не требуется, а также необоснованная замена одного знака препинания другим.[/SIZE][/CENTER][/COLOR][/FONT]" +
    "[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]<br>"+
     "[HEADING=3][CENTER][B][COLOR=rgb(0, 0, 0)][SIZE=5][FONT=georgia]Приятной игры на [/FONT][COLOR=rgb(255, 255, 255)][FONT=georgia]Black Russia[/FONT][/COLOR][/SIZE][/COLOR][SIZE=5][COLOR=rgb(0, 0, 0)][FONT=georgia] AZURE[/FONT][/COLOR][/SIZE][/B][I][B][I][COLOR=rgb(209, 213, 216)][SIZE=5][FONT=georgia].[/FONT][/SIZE][/COLOR][/I][/B][/I][/CENTER][/HEADING]<br>" +
    "[HEADING=3][CENTER][COLOR=rgb(255, 0, 0)][I][B][FONT=georgia][SIZE=4]Отказано![/SIZE][/FONT][/I][/B][/COLOR][/CENTER][/HEADING]<br>",
       prefix: UNACCEPT_PREFIX,
        status: false,
    },
     {
      title: '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| ЕСЛИ ВЫ ХОТИТЕ ЧТОТО УЛУЧШИТЬ ПИШИТЕ СОЗДАТЕЛЮ СКРИПТА @mosaklev_a_v |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
      },






    ];
      $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

              // Добавление кнопок при загрузке страницы
          addButton('Ответы для Кураторов Форума', 'selectAnswer');

              // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
    $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));

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







