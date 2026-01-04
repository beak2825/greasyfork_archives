// ==UserScript==
// @name         Скрипт для Grand Bonus
// @namespace    http://tampermonkey.net/
// @version      1.13
// @description  Скрипт для Grand Bonus:)
// @author      Petr_Toretto
// @match        https://forum.crmp.online/*
// @icon         https://klike.net/uploads/posts/2021-12/1638345168_12.jpg
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/513390/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20Grand%20Bonus.user.js
// @updateURL https://update.greasyfork.org/scripts/513390/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20Grand%20Bonus.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const UNACCСEPT_PREFIX = 3; // префикс отказано
	const ACCСEPT_PREFIX = 2; // префикс одобрено
	const PINN_PREFIX = 2; //  префикс закрепить
    const CLOSE_PREFIX = 7;
    const TEXY_PREFIX = 13;
    const REALIZOVANO_PREFIX = 5;
    const VAJNO_PREFIX = 1;
    const OJIDANIE_PREFIX = 14;
const OTKAZBIO_PREFIX = 3;
const ODOBRENOBIO_PREFIX = 2;
const NARASSMOTRENIIBIO_PREFIX = 4;
const PREFIKS = 0;
const KACHESTVO = 15;
const RASSMOTRENO_PREFIX = 5;
const OTKAZRP_PREFIX = 3;
const ODOBRENORP_PREFIX = 2;
const NARASSMOTRENIIRP_PREFIX = 4;
const OTKAZORG_PREFIX = 3;
const ODOBRENOORG_PREFIX = 2;
const NARASSMOTRENIIORG_PREFIX = 4;
const buttons = [
{
                        	  title: '| Приветствие |',
	  content:
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Текст <br><br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black][/COLOR] Grand [COLOR=RED][/COLOR] Bonus [COLOR=indigo]:3[/COLOR].<br><br>"+
		"[img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img]<br>",
},
    {
                         	  title: '| Жалоба одобрена |',
	  content:
        "[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br>"+
		"[B][CENTER][COLOR=lavender] Жалоба одобрена. <br> "+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]Grand[/COLOR] [COLOR=RED]Bonus[/COLOR] [COLOR=indigo][/COLOR].<br>"+
		"[img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img]",
},
     {
                         	  title: '| Жалоба отказана |',
	  content:
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br>"+
		"[B][CENTER][COLOR=lavender] Жалоба отказана. <br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]Grand[/COLOR] [COLOR=RED]Bonus[/COLOR] [COLOR=indigo][/COLOR].<br>"+
		"[img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img]",
         prefix: UNACCСEPT_PREFIX,
},
     {
      title: 'На рассмотрении',
      content:
	           "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
	            "[CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		        "[FONT=Times new roman][B][CENTER]Ваша жалоба взята на рассмотрение.<br>" +
		        'Не нужно создавать копии данной темы.<br>' +
		        "[B][CENTER]В противном случае, вам будет выдана блокировка ФА.<br><br>" +
		        '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=YELLOW]  На рассмотрении [/COLOR][/FONT] [/CENTER]'+
		        "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Grand Bonus[/B][/COLOR] [/SIZE][/I][COLOR=rgb(0, 115, 255)][B][SIZE=1]:3[/SIZE][/B][/COLOR]" +
                '"[IMG]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/IMG][/CENTER]"+<br>',
    },
     {
      title: 'Передача Зам основа, основа',
      content:
	"[CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple] {{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][CENTER]Ваша жалоба передана на рассмотрение заместителя основателя и основателя.<br>" +
		'Не нужно создавать копии данной темы.<br>' +
		"В противном случае, вам будет выдана блокировка ФА.<br><br>" +
         "@Legendary Ded - @Vladislav_Krasin <br>" +
        '[img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img]<br>',
	},
	     {
      title: 'Передана руку',
      content:
	"[CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple] {{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][CENTER]Ваша жалоба передана на рассмотрение руководителю.<br>" +
		'Не нужно создавать копии данной темы.<br>' +
		"В противном случае. вам будет выдана блокировка ФА.<br><br>" +
         "@Ruffl_Smith <br>" +
        '[img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img]<br>',
	},
    {
	  title: '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Жалоба на адм нет нарушений |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'
},
   {
	  title: 'Нарушений от ГА не найдены',
	  content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Нарушений со стороны Главного администартора не было найдено<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
        '[img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img]<br>',
	},
{
	  title: 'Нарушений ЗГА не найдены',
	  content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Нарушений со стороны Заместителя Главного администартора не было найдено<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
        '[img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img]<br>',
	},
{
	  title: 'Нарушений спец адм не найдены',
	  content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Нарушений со стороны [COLOR=RED]Специального администартора[/COLOR] не было найдено<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
        '[img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img]<br>',
},
{
	  title: 'Нарушений адм не найдены',
	  content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Нарушений со стороны Администратора не было найдено<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
        '[img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img]<br>',
},
 {
	  title: '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Жалоба на адм одобрено |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'
},
   {
	  title: 'Одобрено на ГА ( беседа )',
	  content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]С Главным администартором будет проведена беседа.<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=green]  Одобрено. [/COLOR][/FONT] [/CENTER]'+
        '[img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img]<br>',
},
 {
	  title: 'Одобрено на ЗГА ( беседа )',
	  content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]С Заместителем Главного администартора будет проведена беседа.<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=green]  Одобрено. [/COLOR][/FONT] [/CENTER]'+
        '[img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img]<br>',
},
 {
	  title: 'Одобрено на Спец ( беседа )',
	  content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]С [COLOR=RED]Специальным администратором[/COLOR] будет проведена беседа.<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=green]  Одобрено. [/COLOR][/FONT] [/CENTER]'+
        '[img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img]<br>',
},
{
	  title: 'Одобрено на Спец ( наказание )',
	  content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER] [COLOR=RED]Специальному администратору[/COLOR] будет выдано наказание.<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=green]  Одобрено. [/COLOR][/FONT] [/CENTER]'+
        '[img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img]<br>',
},
{
	  title: 'Одобрено на ГА ( наказание )',
	  content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER] Главному администратору будет выдано наказание.<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=green]  Одобрено. [/COLOR][/FONT] [/CENTER]'+
        '[img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img]<br>',
},
{
	  title: 'Одобрено на ЗГА ( наказание )',
	  content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER] Заместителю Главного администратора будет выдано наказание.<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=green]  Одобрено. [/COLOR][/FONT] [/CENTER]'+
        '[img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img]<br>',
},
{
	  title: 'Одобрено на Спец ( снят )',
	  content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER] [COLOR=RED]Специальный администратор[/COLOR] будет снят.<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=green]  Одобрено. [/COLOR][/FONT] [/CENTER]'+
        '[img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img]<br>',
},
    {
	  title: 'Одобрено на ГА ( снят )',
	  content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER] Главный администратор будет снят.<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=green]  Одобрено. [/COLOR][/FONT] [/CENTER]'+
        '[img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img]<br>',
},
        {
	  title: 'Одобрено на ЗГА ( снят )',
	  content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER] Заместитель Главного администратора будет снят.<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=green]  Одобрено. [/COLOR][/FONT] [/CENTER]'+
        '[img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img]<br>',
},
{
	  title: '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Жалоба на игроков |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'
},

    {
                         	  title: '| Доква через другие сайты (Игрок)  |',
	  content:
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br>"+
		"[B][CENTER][COLOR=lavender] загрузите доказательства на такие фотохостинги как yapix, imgur, postimages, youtube.<br>"+
        "[FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами подачи жалоб на игроков можно [/COLOR][URL='https://forum.crmp.online/threads/grand-bonus-%D0%A4%D0%BE%D1%80%D0%BC%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.49738/'][Color=crimson][U]*тут*[/U][/color][/URL].[/CENTER]<br><br>" +
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]Grand[/COLOR] [COLOR=RED]Bonus[/COLOR] [COLOR=indigo][/COLOR].<br>"+
		"[img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img]",
               prefix: UNACCСEPT_PREFIX,
},
{
      title: 'Ошиблись сервером',
	  content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
	    "[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ， уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Скорее всего, Вы ошиблись сервером.<br>" +
        '[FONT=georgia] [B][CENTER]Перенапровляю в нужный раздел.<br>' +
        '[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img]<br>',
	},
   {
      title: 'Заголовок не по форме',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]В названии темы необходимо указать никнейм игрока, на которого подается жалоба, и суть жалобы: Nick_Name | Суть жалобы.<br>"+
         "[FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами подачи жалоб на игроков можно [/COLOR][URL='https://forum.crmp.online/threads/grand-bonus-%D0%A4%D0%BE%D1%80%D0%BC%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.49738/'][Color=crimson][U]*тут*[/U][/color][/URL].[/CENTER]<br><br>" +
		'[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED] Отказано [/COLOR][/FONT] [/CENTER]'+
        '[img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img]<br>',
    },
    {
      title: 'Неполный фрапс',
      content:
        '[Color=MediumPurple][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый-(ая) {{ user.mention }}.[/color][/CENTER]<br>' +

        "[CENTER][B][I][FONT=georgia]Фрапс обрывается. Загрузите полный фрапс на ютуб.[/CENTER]" +
        '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+

        '[img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img]<br>',
    },
    {
	  title: 'Жалоба от 3 лица',
	  content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Жалоба должна быть написана от 1 лица<br><br>" +
		"[FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами подачи жалоб на игроков можно [/COLOR][URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2812849/'][Color=crimson][U]*тут*[/U][/color][/URL].[/CENTER]<br><br>" +
		'[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
        '[img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img]<br>',
    },
    {
	  title: 'Нету доказательств',
	  content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]В Вашей жалобе отсуствуют доказательства. Просьба написать новую жалобу и прикрепить к ней доказательства о нарушении игрока<br><br>" +
		"[FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами подачи жалоб на игроков можно [/COLOR][URL='https://forum.crmp.online/threads/grand-bonus-%D0%A4%D0%BE%D1%80%D0%BC%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.49738/'][Color=crimson][U]*тут*[/U][/color][/URL].[/CENTER]<br><br>" +
	 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
        '[img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img]<br>',
    },
    {
	  title: 'Нет доступа к доказательствам',
	  content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]К Вашим доказательствам нету доступа. Просьба написать новую жалобу и предоставить доступ к просмотру доказательств<br><br>" +
	 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
        '[img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img]<br>',
	},
	{
	  title: 'Нарушений не найдено',
	  content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

		" [FONT=georgia] [B][CENTER]Нарушений со стороны данного игрока не было найдено<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
        '[img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img]<br>',
	},
	{
	  title: 'Нужна видеофиксация',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]В таких случаях нужна видеофиксация нарушения.<br><br>" +
        "[FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами подачи жалоб на игроков можно [/COLOR][URL='https://forum.crmp.online/threads/grand-bonus-%D0%A4%D0%BE%D1%80%D0%BC%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.49738/'][Color=crimson][U]*тут*[/U][/color][/URL].[/CENTER]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
        '[img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img]<br>',
    },
    {
      title: 'Недостаточно доказательств',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый-(ая) {{ user.name }} [/COLOR][/CENTER]<br><br>"+

        " [FONT=georgia] [B][CENTER]Недостаточно доказательств на нарушение от данного игрока<br>" +
		'Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока<br><br>' +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
        '[img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img]<br>',
    },
	{
	  title: '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~| Роспись от Dagovsky |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'
},
{
      title: 'Dagovsky',
	  content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/JnbTx0Q8/P0ZTE.png[/IMG]<br>"+
		" [FONT=georgia] [B][CENTER] Dagovsky club :3 .<br>" +
        '[img]https://i.postimg.cc/j2pLjFs5/2776718330-preview-P84-Rw.png[/img]<br>',
	},
 {
      title: '~~~~~~~~~~~~~~~~~~| ЕСЛИ ВЫ ХОТИТЕ ЧТОТО УЛУДЩИТЬ ПИШИТЕ СОЗДАТЕЛЮ СКРИПТА @mosaklev_a_v |~~~~~~~~~~~~~~~~~~~',
      },

];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('💥 Открыть скрипт 💥', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PINN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
	$('button#specadm').click(() => editThreadData(SPECADM_PREFIX, true));
	$('button#mainadm').click(() => editThreadData(GA_PREFIX, true));
    $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#Realizovano').click(() => editThreadData(REALIZOVANO_PREFIX, false));
    $('button#Vajno').click(() => editThreadData(VAJNO_PREFIX, false));
    $('button#Rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false));
    $('button#Ojidanie').click(() => editThreadData(OJIDANIE_PREFIX, false));
    $('button#Prefiks').click(() => editThreadData(PREFIKS, false));
    $('button#Kachestvo').click(() => editThreadData(KACHESTVO, false));


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


	}

	function getFormData(data) {
	const formData = new FormData();
	Object.entries(data).forEach(i => formData.append(i[0], i[1]));
	return formData;
	}
	})();