// ==UserScript==
// @name         Скрипт для КФ 29
// @namespace    https://forum.blackrussia.online
// @version      6.1
// @description
// @author       Neko_Elems
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @collaborator
// @icon         data:image/jpeg;base64,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
// @downloadURL
// @updateURL
// @description author Neko_Elems
// @downloadURL https://update.greasyfork.org/scripts/498517/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%2029.user.js
// @updateURL https://update.greasyfork.org/scripts/498517/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%2029.meta.js
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
	  title: '------------------------------------------------------- Передать жалобу -------------------------------------------------------------',
    },
    {
      title: 'Приветствие',
      content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]',
     },
     {
      title: 'На рассмотрении',
      content:
	            "[CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		        "[FONT=Times new roman][B][CENTER]Ваша жалоба взята на рассмотрение.<br>" +
		        'Не нужно создавать копии данной темы.<br>' +
		        "[B][CENTER]В противном случае Вам будет выдана блокировка ФА.<br><br>" +
		        '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=YELLOW]  На рассмотрении [/COLOR][/FONT] [/CENTER]'+
		        "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]" +
                '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
	  prefix: PIN_PREFIX,
	  status: true,
    },
	 {
      title: 'ГКФ',
      content:
	"[CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple] {{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		"[FONT=times new roman][CENTER]Ваша жалоба передана на рассмотрение Главному Куратору Форума.<br>" +
		'Не нужно создавать копии данной темы.<br>' +
		"В противном случае Вам будет выдана блокировка ФА.<br><br>" +
         "@Neko_Elems <br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

	  prefix: PIN_PREFIX,
	  status: true,
	},

     {
      title: 'ГА',
      content:
	"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ，уважаемый-(ая) {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
		" [FONT=georgia] [B][CENTER]Ваша жалоба передана на рассмотрение Главному Администратору сервера.<br>" +
		'Не нужно создавать копии данной темы.<br>' +
		"В противном случае Вам будет выдана блокировка ФА.<br><br>" +
         "@Ilya_Zubachenkov <br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
	  prefix: GA_PREFIX,
	  status: true,
    },
	{
      title: 'Теху',
      content:
        "[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}},уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		" [FONT=georgia] [B][CENTER]Ваша жалоба передана на рассмотрение Техническому Специалисту сервера.<br>" +
		'Не нужно создавать копии данной темы.<br>' +
		"В противном случае Вам будет выдана блокировка ФА.<br><br>" +
        " @Franc_Astolf <br>" +
	"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
	  prefix: TEX_PREFIX,
	  status: false,
    },
    {
 title: 'ЗГКФ',
      content:
	"[CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple] {{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		"[FONT=times new roman][CENTER]Ваша жалоба передана на рассмотрение Заместителю Главного Куратора Форума.<br>" +
		'Не нужно создавать копии данной темы.<br>' +
		"В противном случае Вам будет выдана блокировка ФА.<br><br>" +
         "@Kasandra Hennessy♂ <br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

	  prefix: PIN_PREFIX,
	  status: true,
	},

     {

	  title: '-------------------------------------------------- Перенаправить ------------------------------------------------------------------------------------',
         },
	{
      title: 'Ошились сервером',
	  content:
	    "[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ， уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Скорее всего, Вы ошиблись сервером.<br>" +
        '[FONT=georgia] [B][CENTER]Перенапровляю в нужный раздел.<br>' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
	},
	{
      title: 'Жалобы на Адм',
	  content:
	    "[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ， уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Скорее всего, Вы ошиблись разделом, подайте жалобу в раздел Жалобы На Администрацию<br><br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
 prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
      title: 'Жалобы на Лд',
	  content:
	    "[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ，уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Скорее всего, Вы ошиблись разделом, подайте жалобу в раздел Жалобы На Лидеров<br><br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
      title: 'Жалобы на Сотрудников',
	  content:
	    "[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}， уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Скорее всего, Вы ошиблись разделом, подайте жалобу в раздел Жалобы На Сотрудников фракции<br><br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
      title: 'РП Биографии',
	  content:
	    "[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ，уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Скорее всего, Вы ошиблись разделом, напишите эту тему в раздел РП Биографии<br><br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

	  prefix: CLOSE_PREFIX,
	  status: false,
	},

	{
      title: 'Обжалование',
	  content:
	    "[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}， уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

                " [FONT=georgia] [B][CENTER]Скорее всего, Вы ошиблись разделом, подайте жалобу в Обжалование Наказаний<br><br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
		prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
      title: 'Ошиблись разделом',
	  content:
	    "[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Скорее всего, Вы ошиблись разделом, подайте жалобу в правильный на эту тему раздел<br><br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
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
         "[FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами подачи жалоб на игроков можно [/COLOR][URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2812849/'][Color=crimson][U]*тут*[/U][/color][/URL].[/CENTER]<br><br>" +
		'[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED] Отказано [/COLOR][/FONT] [/CENTER]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

      prefix: CLOSE_PREFIX,
	  status: false,
      },
	{
      title: 'Nick_Name нарушителя не по форме',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER] Игровой ник автора жалобы, ник игрока, на которого подается жалоба, должны быть указаны в соответствии с правилами подачи жалоб, даже если эта информация присутствует на доказательствах или в тексте жалобы.<br>"+
         "[FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами подачи жалоб на игроков можно [/COLOR][URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2812849/'][Color=crimson][U]*тут*[/U][/color][/URL].[/CENTER]<br><br>" +
		'[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED] Отказано [/COLOR][/FONT] [/CENTER]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

      prefix: CLOSE_PREFIX,
	  status: false,
    },
	{
      title: 'Заголовок не по форме',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]В названии темы необходимо указать никнейм игрока, на которого подается жалоба, и суть жалобы: Nick_Name | Суть жалобы.<br>"+
         "[FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами подачи жалоб на игроков можно [/COLOR][URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2812849/'][Color=crimson][U]*тут*[/U][/color][/URL].[/CENTER]<br><br>" +
		'[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED] Отказано [/COLOR][/FONT] [/CENTER]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'За /try нету наказания',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]За игру в /try нету наказаний от Администрации. Это уже ваше дело и игрока, если отдавать деньги или нет.<br><br>" +
		'[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED] Отказано [/COLOR][/FONT] [/CENTER]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
	prefix: CLOSE_PREFIX,
	  status: false,
    },
{
      title: 'Неполный фрапс',
      content:
        '[Color=MediumPurple][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый-(ая) {{ user.mention }}.[/color][/CENTER]<br>' +

        "[CENTER][B][I][FONT=georgia]Фрапс обрывается. Загрузите полный фрапс на ютуб.[/CENTER]" +
        '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+

        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

      prefix: UNACCEPT_PREFIX,
      status: false,
    },
	{
      title: 'РП отыгрывать не нужно',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Сотрудники правоохранительных органов не должны отыгрывать РП, за них это делает система.<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Жалоба от 3 лица',
	  content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Жалоба должна быть написана от 1 лица<br><br>" +
		"[FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами подачи жалоб на игроков можно [/COLOR][URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2812849/'][Color=crimson][U]*тут*[/U][/color][/URL].[/CENTER]<br><br>" +
		'[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
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
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Нет доступа к доказательствам',
	  content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]К Вашим доказательствам нету доступа. Просьба написать новую жалобу и предоставить доступ к просмотру доказательств<br><br>" +
	 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

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
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

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
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

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
       '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

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
       '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

      prefix: UNACCEPT_PREFIX,
      status: false,
    },
	{
	  title: 'Нарушений не найдено',
	  content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Нарушений со стороны данного игрока не было найдено<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

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
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

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
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

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
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

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
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

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
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

      prefix: UNACCEPT_PREFIX,
      status: false,
    },
	{
	  title: 'Доква отредактированы',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Ваши доказательства отредактированы, создайте жалобу с первоначальными доказательствами<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

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
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
        {
        title: 'Доква не рабочие',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Ваши доказательства не работают. Залейте жалобу с рабочими доказательствами.<br><br>" +
		'[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED] Отказано [/COLOR][/FONT] [/CENTER]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
        prefix: UNACCEPT_PREFIX,
	    status: false,
        },
    {
     title: 'Долг через трейд',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]На ваших доказательствах представлены передачи денежных средств через трейд. Долги через них не рассматриваются, будут рассмотрены только через банк.<br><br>" +
		'[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED] Отказано [/COLOR][/FONT] [/CENTER]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
      title: 'Покупка слота',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Покупка доната/слота является нарушением правил 2.28, и такие жалобы не подлежат к рассмотрению.<br><br>" +
		'[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED] Отказано [/COLOR][/FONT] [/CENTER]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
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

     "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/B][/COLOR]",
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

     "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/B][/COLOR]",
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
        "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/B][/COLOR]",
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

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/B][/COLOR]",
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
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/B][/COLOR]",
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
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/B][/COLOR]",
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

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/B][/COLOR]",
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

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

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

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

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

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

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

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
         '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

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

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
         '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

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

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
         '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

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

		"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

      prefix: ACCEPT_PREFIX,
	  status: false,
    },
{
      title: 'Мат в VIP чат',
      content:
		'[Color=MediumPurple][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый-(ая) {{ user.name }}.[/color][/CENTER]<br>' +

        "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.23. Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [Color=Red]| Mute 30 минут[/CENTER]<br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]",
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

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

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
	"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
         '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

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

		"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
         '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

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

		"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
         '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

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

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Транслит',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил <br>3.20. Запрещено использование транслита в любом из чатов [COLOR=RED]| Mute 30 минут.[/COLOR]<br>Пример: «Privet», «Kak dela», «Narmalna».<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Объявы на территории ГОСС',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил <br>3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC)[COLOR=RED] | Mute 30 минут.[/COLOR]<br>Пример: в помещении центральной больницы писать в чат: «Продам эксклюзивную шапку дешево!!!»<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Угрозы наказанием со стороны Адм',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил <br>3.09. Запрещены любые угрозы о наказании игрока со стороны администрации [COLOR=RED]| Mute 30 минут.[/COLOR]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+
        "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

      prefix: ACCEPT_PREFIX,
	  status: false,
        },
	{
	  title: 'Скрытие нарушителей',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил <br>2.24. Запрещено скрывать от администрации нарушителей или злоумышленников  [COLOR=RED]| Ban 15 - 30 дней / PermBan + ЧС проекта.[/COLOR]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+
        "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Багаюз',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил <br>2.21. Запрещено пытаться обходить игровую систему или использовать любые баги сервера. [COLOR=RED]| Ban 15 - 30 дней /PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов).[/COLOR]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+
        "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'OOC угрозы',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил <br>2.37. Запрещены OOC угрозы, в том числе и завуалированные[COLOR=RED] | Mute 120 минут / Ban 7 дней[/COLOR]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Помеха РП',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил <br>2.51. Запрещено вмешательство в Role Play процесс с целью помехи и препятствования дальнейшего развития Role Play процесса[COLOR=RED] | Jail 30 минут.[/COLOR]<br>Пример: вмешательство в Role Play процесс при задержании игрока сотрудниками ГИБДД, вмешательство в проведение тренировки или мероприятия какой-либо фракции и тому подобные ситуации.<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'NonRP аксессуар',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил <br>2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут.<br>Пример: слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное.<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'NonRP поведение',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил <br>2.01 Запрещено поведение, нарушающее нормы процессов Role Play режима игры[COLOR=RED] | Jail 30 минут.[/COLOR]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+


"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'NRP drive',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.03. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [COLOR=RED]| Jail 30 минут.[/COLOR]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
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
        "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR] <br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
	  title: 'NRP drive фура/инко',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.47. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [COLOR=RED]| Jail 60 минут.[/COLOR]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДОЛГ',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил: <br> 2.57. Запрещается брать в долг игровые ценности и не возвращать их. [COLOR=RED]| Ban 30 дней / permban [/COLOR]<br><br>"+
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

		"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Cтороннее ПО',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками[COLOR=RED] |  Ban 15 - 30 дней / PermBan.[/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
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

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
	{
      title: 'Слив склада',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил <br>2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [COLOR=RED]| Ban 15 - 30 дней / PermBan[/COLOR]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
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
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Масс ДМ',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил <br>2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины более трем игрокам [COLOR=RED]| Warn / Ban 3 - 7 дней.[/COLOR]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Реклама промо',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [COLOR=RED]| Ban 30 дней.[/COLOR]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Продажа промо',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.43. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [COLOR=RED]| Mute 120 минут.[/COLOR]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неув обр. к Адм',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.54. Запрещено неуважительное обращение, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [COLOR=RED]| Mute 180 минут[/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
	   prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Обман адм',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.32. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [COLOR=RED]| Ban 7 - 15 дней / PermBan[/COLOR]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Выдача себя за адм',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>3.10. Запрещена выдача себя за администратора, если таковым не являетесь[COLOR=RED] | Ban 15 - 30 + ЧС администрации[/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Оск. Проекта',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.40.  Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [COLOR=RED]|Mute 300 минут / Ban 30 дней[/COLOR] (Ban выдается по согласованию с главным администратором)<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Призыв покинуть проект',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.40.  Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [COLOR=RED]|Mute 300 минут / Ban 30 дней [/COLOR](Ban выдается по согласованию с главным администратором)<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
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

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
	{
	  title: 'Ввод в заблуждение',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple] {{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.32. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта[COLOR=RED] | Ban 7 - 15 дней[/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
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

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
         '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Политика',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>3.18. Запрещено политическое и религиозное пропагандирование [COLOR=RED]| Mute 120 минут / Ban 10 дней[/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
         title: 'Помеха ИП',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.04. Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы.[COLOR=RED]|Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
       title: 'Оск родни в Voice',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>3.15. Запрещено оскорблять игроков или родных в Voice Chat.[COLOR=RED]| Mute 120 минут / Ban 7 - 15 дней[/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
         prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
       title: 'Музыка в Voice',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>3.14. Запрещено включать музыку в Voice Chat.[COLOR=RED] | Mute 60 минут[/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
         prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Шум в Voice',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>3.16. Запрещено создавать посторонние шумы или звуки.[COLOR=RED]| Mute 30 минут[/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
         prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
         title: 'Реклама в Voice',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>3.17. Запрещена реклама в Voice Chat не связанная с игровым процессом.[COLOR=RED]| Ban 7 - 15 дней[/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
         prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
 title: 'Оск в OOC чате',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены.[COLOR=RED]| Mute 30 минут[/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
         prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: 'Оскорбления секс характера',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>3.07. Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата.[COLOR=RED]| Mute 30 минут[/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
         prefix: ACCEPT_PREFIX,
	  status: false,

    },
    {
         title: 'Аморал действие',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков.[COLOR=RED]| Jail 30 минут / Warn[/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
         prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'Исп уязвимостью правил',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.33. Запрещено пользоваться уязвимостью правил.[COLOR=RED]| Ban 15 дней [/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
         prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
         title: 'Распростронение личной инфо игроков',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.38.Запрещено распространять личную информацию игроков и их родственников.[COLOR=RED]| Ban 15 - 30 дней / PermBan [/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
         prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Покупка репутации семьи',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.48. Запрещена продажа, передача, трансфер или покупка репутации семьи любыми способами, скрытие нарушителей, читеров лидером семьи.[COLOR=RED]| Обнуление рейтинга семьи / Обнуление игрового аккаунта лидера семьи [/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
         prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Многократная продажа покупка реп',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.49. Многократная продажа или покупка репутации семьи любыми способами.[COLOR=RED]| Ban 15 - 30 дней / PermBan + удаление семьи [/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
         prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
    title: 'задержания, аресты ауц,каз,системные мероприятия',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.50. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий.[COLOR=RED]| Ban 7 - 15 дней + увольнение из организации [/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
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

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
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

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
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

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
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

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
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

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
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

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
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
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

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

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
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

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
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

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
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

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
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

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },

    {
	  title: '---------------------------------------------  РП Биографии ---------------------------------------------------------------------------------------',
	},
     {
      title: 'Одобрено',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Ваша РП Биография получает статус<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
         '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Отказано',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Ваша РП Биография получает статус<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+

" [FONT=georgia] Причиной могло послужить любое нарушение Правил Подачи РП Биографии<br>" +
         '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
     title: 'Возраст не совпадает',
      content:
		'[Color=MediumPurple][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый-(ая) {{ user.name }}.[/color][/CENTER]<br>' +

        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причина: Возраст не совпадает с датой рождения."+
    '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },

    {
      title: 'Фамилия или имя в названии отличаются',
      content:
		'[Color=MediumPurple][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый-(ая) {{ user.name }}.[/color][/CENTER]<br>' +

        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причина: В названии вашей биографии и в пункте 1 различаются имя/фамилия."+
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
{
      title: 'био отказ(18 лет)',
      content:
        '[Color=MediumPurple][FONT=TIMES NEW ROMAN][CENTER][I]{{ greeting }}, уважаемый-(ая) {{ user.mention }}.[/color][/CENTER]<br>' +

        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причина отказа: минимальный возраст для составления биографии: 18 лет.[/CENTER][/FONT]" +
    '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
    prefix: UNACCEPT_PREFIX,
    status: false,
},


     {
      title: 'Не по форме',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} , уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Ваша РП Биография получает статус<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
" [FONT=georgia] Причиной послужило написание РП Биографии не по форме<br>" +
         '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',

	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'От 3-го лица',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} , уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Ваша РП Биография получает статус<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
		" [FONT=georgia] Причиной послужило написание РП Биографии от 3-лица"+
         '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Копипаст',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		"[B][CENTER]Ваша РП Биография получает статус<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
		" [FONT=georgia] Причиной послужило копирование текста / темы<br>" +
         '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Дублирование',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Ваша РП Биография получает статус<br><br>" +
	 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
		" [FONT=georgia] Причиной послужило дублирование РП Биографии<br>" +
         '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Ошибки в словах',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Ваша РП Биография получает статус<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
" [FONT=georgia] Причиной послужило написание РП Биографии с грамматическими / орфографическими ошибками<br>" +
         '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Заговолок',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Ваша РП Биография получает статус<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
	" [FONT=georgia] Причиной послужило написание заговолка РП Биографии не по форме<br>" +
         '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
		prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Нету имени родных',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Ваша РП Биография получает статус<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
		" [FONT=georgia] Причиной послужило то, что вы не написали имя родителей и тд.<br>" +
         '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },

	 {
      title: 'Мало RP инфо',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Ваша РП Биография получает статус<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
" [FONT=georgia] Причиной послужило мало RP информации.<br>" +
         '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
		prefix: UNACCEPT_PREFIX,
	  status: false,
    },

	 {
	  title: '--------------------------------------------- РП Ситуации ---------------------------------------------------------------------------------------------',
     },
	 {
      title: 'Одобрено',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Ваша РП Ситуация получает статус<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
         '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Отказано',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Ваша РП Ситуация получает статус<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
		" [FONT=georgia] Причиной могло послужить любое нарушение Правил Написания РП Ситуации<br>" +
         '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },


	 {
      title: 'Дублирование',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}  ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Ваша РП Ситуация получает статус<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
		" [FONT=georgia] Причиной послужило дублирование темы<br>" +
         '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
	  title: '---------------------------------------------------  РП Организации  --------------------------------------------------------------',
	},
	 {
      title: 'Одобрено',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Ваша Неофициальная РП Организация получает статус<br><br>" +
  '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+

"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 140, 0)][B][SIZE=1]Rostov[/SIZE][/B][/COLOR]"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Отказано',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Ваша Неофициальная РП Организация получает статус<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
" [FONT=georgia] Причиной могло послужить любое нарушение Правил Подачи Заявления На Неофициальную РП Организацию<br>" +
         '[url=https://postimages.org/][img]https://i.postimg.cc/Y2zpKt0Z/image.png[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
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
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('Тех. Специалисту', 'Texy');
    addButton('Закрыто', 'Zakrito');
    addButton('Ответы', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

     $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEX_PREFIX, false));
    $('button#Resheno').click(() => editThreadData(ACCEPT_PREFIX, false));
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