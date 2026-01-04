// ==UserScript==
// @name        KOSTROMA | Скрипт для ГА/ЗГА/КУРАТОРОВ/ГКФ/ЗГКФ
// @namespace    https://forum.kingrussia.com
// @version      2.4
// @description  По вопросам обратная связь в Вк: https://vk.uznik25
// @author      capri0/resonance
// @match        https://forum.kingrussia.com/threads/*
// @include      https://forum.kingrussia.com/threads/
// @grant        none
// @license      MIT
// @collaborator
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/504648/KOSTROMA%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%90%D0%97%D0%93%D0%90%D0%9A%D0%A3%D0%A0%D0%90%D0%A2%D0%9E%D0%A0%D0%9E%D0%92%D0%93%D0%9A%D0%A4%D0%97%D0%93%D0%9A%D0%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/504648/KOSTROMA%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%90%D0%97%D0%93%D0%90%D0%9A%D0%A3%D0%A0%D0%90%D0%A2%D0%9E%D0%A0%D0%9E%D0%92%D0%93%D0%9A%D0%A4%D0%97%D0%93%D0%9A%D0%A4.meta.js
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
     
	            "[CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
	           
		        " [FONT=Times new roman][B][CENTER]Ваша жалоба взята на рассмотрение.<br>" +
		        'Не нужно создавать копии данной темы.<br>' +
		        "[B][CENTER]В противном случае Вам будет выдана блокировка ФА.<br><br>" +
		       '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=YELLOW]  На рассмотрении [/COLOR][/FONT] [/CENTER]'+
		        "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]Kostroma[/SIZE][/B][/COLOR]",
	  prefix: PIN_PREFIX,
	  status: true,
    },
	 {
      title: 'ГКФ',
      content:
	"[CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple] {{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
	
		"[FONT=times new roman][CENTER]Ваша жалоба передана на рассмотрение Главному Куратору Форума.<br>" +
		'Не нужно создавать копии данной темы.<br>' +
		"В противном случае Вам будет выдана блокировка ФА.<br><br>" , 
		
	  prefix: PIN_PREFIX,
	  status: true,
	},
 
     {
      title: 'ГА',
      content:
	"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ，уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
		" [FONT=georgia] [B][CENTER]Ваша жалоба передана на рассмотрение Главному Администратору сервера.<br>" +
		'Не нужно создавать копии данной темы.<br>' +
		"В противном случае Вам будет выдана блокировка ФА.<br><br>" +
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/GtpgYT8P/download-4.gif[/img][/url][/CENTER]' , 
	  prefix: GA_PREFIX,
	  status: true,
    },	
	{
      title: 'Теху',
      content:
	"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}， уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
		" [FONT=georgia] [B][CENTER]Ваша жалоба передана на рассмотрение Техническому Специалисту сервера.<br>" +
		'Не нужно создавать копии данной темы.<br>' +
		"В противном случае Вам будет выдана блокировка ФА.<br><br>" +
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
	
	"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]Kostroma[/SIZE][/B][/COLOR]", 
	  prefix: TEX_PREFIX,
	  status: false,
    },	
 
 
 
 
    {
	  title: '----------  Перенаправить  ---------------------------------------------------------------------------------------------------------------------------',
	},
	{
      title: 'Жалобы на Адм',
	  content:
	    "[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ， уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
	    
		" [FONT=georgia] [B][CENTER]Скорее всего, Вы ошиблись разделом, подайте жалобу в раздел Жалобы На Администрацию<br><br>" , 
 prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
      title: 'Жалобы на Лд',
	  content:
	    "[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ，уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
	    
		" [FONT=georgia] [B][CENTER]Скорее всего, Вы ошиблись разделом, подайте жалобу в раздел Жалобы На Лидеров<br><br>" , 
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
      title: 'Жалобы на Сотрудников',
	  content:
	    "[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}， уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
	    
		" [FONT=georgia] [B][CENTER]Скорее всего, Вы ошиблись разделом, подайте жалобу в раздел Жалобы На Сотрудников фракции<br><br>" , 
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
      title: 'РП Биографии',
	  content:
	    "[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ，уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
	    
		" [FONT=georgia] [B][CENTER]Скорее всего, Вы ошиблись разделом, напишите эту тему в раздел РП Биографии<br><br>" , 
		 
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
 
	{
      title: 'Обжалование',
	  content:
	    "[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}， уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+	
	    
                " [FONT=georgia] [B][CENTER]Скорее всего, Вы ошиблись разделом, подайте жалобу в Обжалование Наказаний<br><br>" , 
		prefix: CLOSE_PREFIX, 
	  status: false,
	},
	{
      title: 'Ошиблись разделом',
	  content:
	    "[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
	    
		" [FONT=georgia] [B][CENTER]Скорее всего, Вы ошиблись разделом, подайте жалобу в правильный на эту тему раздел<br><br>" , 
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: '----------  Отказать жалобу  ---------------------------------------------------------------------------------------------------------------------',
	},
	{
      title: 'За /try нету наказания',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
		" [FONT=georgia] [B][CENTER]За игру в /try нету наказаний от Администрации. Это уже ваше дело и игрока, если отдавать деньги или нет.<br><br>" +
		'[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED] Отказано [/COLOR][/FONT] [/CENTER]', 
	prefix: CLOSE_PREFIX, 
	  status: false,
    },
{
      title: 'Неполный фрапс',
      content:
        '[Color=MediumPurple][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        
        "[CENTER][B][I][FONT=georgia]Фрапс обрывается. Загрузите полный фрапс на ютуб.[/CENTER]" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]', 
 
      prefix: UNACCEPT_PREFIX, 
      status: false,
    },
	{
      title: 'РП отыгрывать не нужно',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
		" [FONT=georgia] [B][CENTER]Сотрудники правоохранительных органов не должны отыгрывать РП, за них это делает система.<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]', 
		
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Жалоба от 3 лица',
	  content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
		" [FONT=georgia] [B][CENTER]Жалоба должна быть написана от 1 лица<br><br>" +
		"[FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами подачи жалоб на игроков можно [/COLOR][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/'][Color=crimson][U]*тут*[/U][/color][/URL].[/CENTER]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]', 
	prefix: CLOSE_PREFIX, 
	  status: false,
    },
	{
	  title: 'Нету доказательств',
	  content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
		" [FONT=georgia] [B][CENTER]В Вашей жалобе отсуствуют доказательства. Просьба написать новую жалобу и прикрепить к ней доказательства о нарушении игрока<br><br>" +
		"[FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами подачи жалоб на игроков можно [/COLOR][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/'][Color=crimson][U]*тут*[/U][/color][/URL].[/CENTER]<br><br>" +
	 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]', 
		
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Нет доступа к доказательствам',
	  content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
		" [FONT=georgia] [B][CENTER]К Вашим доказательствам нету доступа. Просьба написать новую жалобу и предоставить доступ к просмотру доказательств<br><br>" +
	 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]', 
		
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Неадекватная жалоба',
	  content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
		" [FONT=georgia] [B][CENTER]Составьте жалобу в адекватной форме - без призераний, оскорблений и тд.<br><br>" +
		"[FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами подачи жалоб на игроков можно [/COLOR][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/'][Color=crimson][U]*тут*[/U][/color][/URL].[/CENTER]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]', 
		
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	{
	title: 'Нету условий сделки',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]В данных доказательствах отсутствуют условия сделки<br><br>" +
        "[FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами подачи жалоб на игроков можно [/COLOR][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/'][Color=crimson][U]*тут*[/U][/color][/URL].[/CENTER]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]', 
		
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Укажите таймкоды',
	  content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
		" [FONT=georgia] [B][CENTER]Укажите тайм коды нарушений игрока и создайте новую жалобу<br><br>" +
		"[FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами подачи жалоб на игроков можно [/COLOR][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/'][Color=crimson][U]*тут*[/U][/color][/URL].[/CENTER]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]', 
		
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
{
      title: 'Более 72 часов',
      content:
        '[Color=MediumPurple)][FONT=TIMES NEW ROMAN][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        
        "[CENTER][B][I][FONT=georgia]С момента получения наказания прошло более 72 часов[/CENTER]" +
        "[FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами подачи жалоб на игроков можно [/COLOR][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/'][Color=crimson][U]*тут*[/U][/color][/URL].[/CENTER]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]', 
 
      prefix: UNACCEPT_PREFIX, 
      status: false,
    },
	{
	  title: 'Нарушений не найдено',
	  content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
		" [FONT=georgia] [B][CENTER]Нарушений со стороны данного игрока не было найдено<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]', 
		 
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
      title: 'Дублирование',
      content:
       "[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple] {{greeting}} ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
       
        " [FONT=georgia] [B][CENTER]Ранее вам уже был дан корректный ответ на подобную жалобу, просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован<br><br>" +
        "[FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами подачи жалоб на игроков можно [/COLOR][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/'][Color=crimson][U]*тут*[/U][/color][/URL].[/CENTER]<br><br>" +
         '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]', 
         
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Форма темы',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple] {{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Ваша жалоба составлена не по форме<br>" +
		"[FONT=TIMES NEW ROMAN] [I][SIZE=1][COLOR=cyan]  Ознакомиться с правилами подачи жалоб на игроков можно [/COLOR][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/'][Color=crimson][U]*тут*[/U][/color][/URL].[/CENTER]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]', 
		 
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Нужна видеофиксация',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]В таких случаях нужна видеофиксация нарушения.<br><br>" +
        "[FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами подачи жалоб на игроков можно [/COLOR][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/'][Color=crimson][U]*тут*[/U][/color][/URL].[/CENTER]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]', 
		 
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Нету /time',
	  content:
        "[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}},уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        
		" [FONT=georgia] [B][CENTER]На ваших доказательствах отсутствует /time<br><br>" +
		"[FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами подачи жалоб на игроков можно [/COLOR][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/'][Color=crimson][U]*тут*[/U][/color][/URL].[/CENTER]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]', 
		 
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Доква в соц сетях',
      content:
        "[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}},уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        
        " [FONT=georgia] [B][CENTER]Доказательства в социальных сетях и т.д. не принимаются, загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее<br>" +
        'Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован<br><br>' +
        "[FONT=TIMES NEW ROMAN] [I][SIZE=3][COLOR=LightSlateGray]  Ознакомиться с правилами подачи жалоб на игроков можно [/COLOR][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/'][Color=crimson][U]*тут*[/U][/color][/URL].[/CENTER]<br><br>" +
      '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]', 
      
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
	{
	  title: 'Доква отредактированы',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
 
        " [FONT=georgia] [B][CENTER]Ваши доказательства отредактированы, создайте жалобу с первоначальными доказательствами<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]', 
		 
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'Недостаточно доказательств',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Недостаточно доказательств на нарушение от данного игрока<br>" +
		'Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока<br><br>' +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]', 
		 
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: '----------  Игровые Аккаунты  ---------------------------------------------------------------------------------------------------------------------',
	},
	{
      title: 'Мультиаккаунт',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил 4.04.<br>" +
	'Разрешается зарегистрировать максимально только три игровых аккаунта на сервере | PermBan<br><br>'+
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+
		 
     "[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]Kostroma[/SIZE][/B][/COLOR]", 
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'ППВ',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил 4.03.<br>" +
		' Запрещена совершенно любая передача игровых аккаунтов третьим лицам | PermBan<br><br>' +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одрбрено [/COLOR][/FONT] [/CENTER]'+
		 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]Kostroma[/SIZE][/B][/COLOR]", 
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'ППиВ',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
	
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил 2.42.<br>" +
		' Попытка продажи любого игрового имущества или игрового аккаунта за реальные деньги | PermBan.<br><br>' +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+
		 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]Kostroma[/SIZE][/B][/COLOR]", 
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'Трансфер',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил 4.05.<br>" +
		' Запрещено передавать любые игровые ценности между игровыми аккаунтами, а также в целях удержания имущества | Ban 15 - 30 дней / PermBan<br><br>' +
  '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
  prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'Оск ник',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил 4.09.<br>" +
		' Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) | Устное замечание + смена игрового никнейма / PermBan<br><br>' +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'Фэйк',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил 4.10.<br>" +
		' Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию | Устное замечание + смена игрового никнейма / PermBan<br><br>' +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
		 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
 
 
	{
      title: 'Копирование промо',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил 4.15.<br>" +
		' Запрещено создавать промокод, идентичный промокоду блогера проекта, а также любой промокод, который не относится к рефералу и имеет возможность пассивного заработка.<br>' +
		"Наказание: перманентная блокировка аккаунта или обнуление имущества, заработанного с помощью промокода, а также самого промокода.<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]', 
		 
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: '----------  Одобрить жалобу  ----------------------------------------------------------------------------------------------------------------------',
	},
    {
      title: 'DM',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил 2.19.<br>" +
		' Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [COLOR=RED]| Jail 60 минут[/COLOR]<br><br>' +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
		
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'DB',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}},уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+    
		
		"[B][CENTER]Нарушитель будет наказан по пункту общих правил 2.13.<br>" +
		'.  Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [COLOR=RED] | Jail 60 минут [/COLOR]<br><br>' +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
		 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
		
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'SK',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил 2.16.<br>"+
		' Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [COLOR=RED]| Jail 60 минут / Warn [/COLOR] (за два и более убийства)<br><br>'+
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
		 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
		
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'PG',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил 2.17."+
		' Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь | Jail 30 минут <br><br>'+
  '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
  
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
		
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'RK',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил 2.17."+
		' Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти  [COLOR=RED]| Jail 30 минут[/COLOR]<br><br>'+
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
		 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
		
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ТК',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
	
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил 2.15."+
		'Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [COLOR=RED]| Jail 60 минут / Warn[/COLOR] (за два и более убийства)<br><br>'+
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
		 
		"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
		
      prefix: ACCEPT_PREFIX, 
	  status: false,
    },
{
      title: 'Мат в VIP чат',
      content:
		'[Color=MediumPurple][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.name }}.[/color][/CENTER]<br>' +
		
        "[CENTER]Игрок будет наказан по данному пункту правил:<br>3.23. Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [Color=Red]| Mute 30 минут[/CENTER]<br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'MG',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил 2.18."+
		' Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе[COLOR=RED] | Mute 30 минут[/COLOR]<br><br>'+
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
		
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Caps',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил 3.02."+
		' Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате[COLOR=RED] | Mute 30 минут[/COLOR]<br><br>'+
	 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
	"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 	
		
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Flood',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил 3.05."+
		' Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [COLOR=RED]| Mute 30 минут[/COLOR]<br><br>'+
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
 
		"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
		
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Оск',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил 3.03."+
		' Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены[COLOR=RED] | Mute 30 минут[/COLOR]<br><br>'+
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
		 
		"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
		
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Упом родни',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил <br>" +
		'3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [COLOR=RED]| Mute 120 минут / Ban 7 - 15 дней.[/COLOR]<br><br>' +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
		 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
		
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Транслит',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил <br>3.20. Запрещено использование транслита в любом из чатов [COLOR=RED]| Mute 30 минут.[/COLOR]<br>Пример: «Privet», «Kak dela», «Narmalna».<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
		 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Объявы на территории ГОСС',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил <br>3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC)[COLOR=RED] | Mute 30 минут.[/COLOR]<br>Пример: в помещении центральной больницы писать в чат: «Продам эксклюзивную шапку дешево!!!»<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
		 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Угрозы наказанием со стороны Адм',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил <br>3.09. Запрещены любые угрозы о наказании игрока со стороны администрации [COLOR=RED]| Mute 30 минут.[/COLOR]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]', 
		 
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'OOC угрозы',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил <br>2.37. Запрещены OOC угрозы, в том числе и завуалированные[COLOR=RED] | Mute 120 минут / Ban 7 дней[/COLOR]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
		 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Помеха РП',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил <br>2.51. Запрещено вмешательство в Role Play процесс с целью помехи и препятствования дальнейшего развития Role Play процесса[COLOR=RED] | Jail 30 минут.[/COLOR]<br>Пример: вмешательство в Role Play процесс при задержании игрока сотрудниками ГИБДД, вмешательство в проведение тренировки или мероприятия какой-либо фракции и тому подобные ситуации.<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
		 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'NonRP аксессуар',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил <br>2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут.<br>Пример: слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное.<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
		 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'NonRP поведение',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил <br>2.01 Запрещено поведение, нарушающее нормы процессов Role Play режима игры[COLOR=RED] | Jail 30 минут.[/COLOR]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
		 
		 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'NRP drive',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.03. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [COLOR=RED]| Jail 30 минут.[/COLOR]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
		 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
      prefix: ACCEPT_PREFIX,
	  status: false,
    },{
      title: 'ознакомление с правилом долга',
      content:
        '[Color=MediumPurple][FONT=TIMES NEW ROMAN][CENTER][I]{{greeting}} , уважаемый {{ user.name }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=TIMES NEW ROMAN][COLOR=lightgreen]Ознакомьтесь[/COLOR][/CENTER]"+
            "[FONT=TIMES NEW ROMAN][Color=crimson]Примечание:[/color] займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется; <br>" +
            "[FONT=TIMES NEW ROMAN][Color=crimson]Примечание:[/color] при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда; <br>" +
            "[FONT=TIMES NEW ROMAN][Color=crimson]Примечание:[/color] жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/CENTER]<br><br>" +
         '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]', 
         
      prefix: UNACCEPT_PREFIX, 
      status: false,
    },
    {
	  title: 'NRP drive фура/инко',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.47. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [COLOR=RED]| Jail 60 минут.[/COLOR]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
		 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
      prefix: ACCEPT_PREFIX,
	  status: false,
    }, 
    {
      title: 'ДОЛГ',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил: <br> 2.57. Запрещается брать в долг игровые ценности и не возвращать их. [COLOR=RED]| Ban 30 дней / permban [/COLOR]<br><br>"+
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
 
		"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
		
      prefix: ACCEPT_PREFIX, 
	  status: false,
    },
    {
	  title: 'Постороннее ПО/Изм. Файлов игры',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками[COLOR=RED] |  Ban 15 - 30 дней / PermBan.[/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
    title: 'NRP обман',
      content:
       "[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
       
       " [FONT=georgia] [B][CENTER]Нарушитель буден наказан по следующему пункту общих правил серверов:<br><br>" +
       '2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [COLOR=RED]| PermBan[/COLOR]<br>' +
       "Примечание: после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.<br>" +
       'Примечание: разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).<br><br>' +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
      prefix: ACCEPT_PREFIX,
      status: false,
    },
	{
      title: 'Слив склада',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил <br>2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [COLOR=RED]| Ban 15 - 30 дней / PermBan[/COLOR]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
		 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: '2.34 Запрещен уход от наказания',
	  content:
'[CENTER][B][FONT=TIMES NEW ROMAN][COLOR=MediumPurple][SIZE=1]{{greeting}} ,уважаемый {{user.name}}[/SIZE][/COLOR]<br><br>' +
 
'[COLOR=white][FONT=TIMES NEW ROMAN]Игроку будет выдано наказание по пункту правил: [/COLOR]<br><br>' +
'2.34.Запрещен уход от наказания [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней (суммируется к общему наказанию дополнительно)[/COLOR]<br><br>' +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]', 
 
 
       prefix: ACCEPT_PREFIX, 
       status: 'false', 
    },
    
    {
      title: 'Масс ДМ',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
 
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил <br>2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины более трем игрокам [COLOR=RED]| Warn / Ban 3 - 7 дней.[/COLOR]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
		 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Реклама промо',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [COLOR=RED]| Ban 30 дней.[/COLOR]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
		 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Продажа промо',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.43. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [COLOR=RED]| Mute 120 минут.[/COLOR]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
		 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неув обр. к Адм',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.54. Запрещено неуважительное обращение, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [COLOR=RED]| Mute 180 минут[/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
	  status: false,
    },
    {
	  title: 'Обман адм',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}},уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.32. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [COLOR=RED]| Ban 7 - 15 дней / PermBan[/COLOR]<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
		 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Выдача себя за адм',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>3.10. Запрещена выдача себя за администратора, если таковым не являетесь[COLOR=RED] | Ban 15 - 30 + ЧС администрации[/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Оск. Проекта',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.40.  Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [COLOR=RED]|Mute 300 минут / Ban 30 дней[/COLOR] (Ban выдается по согласованию с главным администратором)<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Призыв покинуть проект',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.40.  Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [COLOR=RED]|Mute 300 минут / Ban 30 дней [/COLOR](Ban выдается по согласованию с главным администратором)<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Сбив аним',
      content:
        "[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        
        " [FONT=georgia] [B][CENTER]Нарушитель буден наказан по следующему пункту общих правил серверов:<br><br>" +
        '2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. [COLOR=RED]| Jail 60 / 120 минут[/COLOR]<br><br>' +
        "Пример: если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде Jail на 120 минут. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками.<br><br>" +
        'Пример: если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде Jail на 60 минут.<br><br>' +
        '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
       
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
      prefix: ACCEPT_PREFIX,
      status: false,
    },
	{
	  title: 'Ввод в заблуждение',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple] {{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.32. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта[COLOR=RED] | Ban 7 - 15 дней[/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Уход от РП',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple] {{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>2.02 Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [COLOR=RED]| Jail 30 минут / Warn[/COLOR]<br>" +
		'Примечание: например, уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания / ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснутся Вашего персонажа и так далее<br><br>' +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
		 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Политика',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Нарушитель будет наказан по пункту общих правил<br>3.18. Запрещено политическое и религиозное пропагандирование [COLOR=RED]| Mute 120 минут / Ban 10 дней[/COLOR]<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: '-----  Правила ГОСС  -----------------------------------------------------------------------------------------------------------------------------------',
	},
	{
      title: 'НРП розыск/штраф',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
		" [FONT=georgia] [B][CENTER]Нарушитель будет наказан по Пункту Правил ГОСС 7.02.<br>" +
		'7.02. Запрещено выдавать розыск, штраф без Role Play причины [COLOR=RED]| Warn [/COLOR]<br><br>' +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
 
 
	{
      title: 'Правоохран. ограны на территории Bizwar за 10 мин до начала',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
		" [FONT=georgia] [B][CENTER]Нарушитель будет наказан по Пункту Правил ГОСС 1.14.<br>" +
		'1.14. Сотрудникам правоохранительных органов запрещается задерживать состав участников войны за бизнес за 10 минут непосредственно до начала самого бизвара.[COLOR=RED] | Jail 30 минут [/COLOR]<br>' +
		"Исключение: в случае, если состав участников войны за бизнес первый начал совершать действия, которые нарушают закон.<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
		 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'Подработка в РФ',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
		" [FONT=georgia] [B][CENTER]Нарушитель будет наказан по Пункту Правил ГОСС 1.07.<br>" +
		'1.07. Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [COLOR=RED]| Jail 30 минут[/COLOR] <br><br>' +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
		 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'Нарушение ПРО',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+	
		
		"[B][CENTER]Нарушитель будет наказан по Пункту Правил ГОСС 4.01.<br>" +
		'4.01. Запрещено редактирование объявлений, не соответствующих ПРО [COLOR=RED]| Mute 30 минут [/COLOR]<br><br>' +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
		 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'НРП эфир ',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
		" [FONT=georgia] [B][CENTER]Нарушитель будет наказан по Пункту Правил ГОСС 4.02.<br>" +
		'4.02. Запрещено проведение эфиров, не соответствующих Role Play правилам и логике[COLOR=RED] | Mute 30 минут [/COLOR]<br><br>' +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
		 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'Редакт  в лц',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
		" [FONT=georgia] [B][CENTER]Нарушитель будет наказан по Пункту Правил ГОСС 4.04.<br>" +
		'4.04. Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком[COLOR=RED] | Ban 7 дней[/COLOR] + ЧС организации <br><br>' +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
       title: ' Слив СМИ',
	  content:
'[CENTER][B][FONT=TIMES NEW ROMAN][COLOR=MediumPurple][SIZE=1] {{greeting}}, уважаемый {{user.name}} [/SIZE][/COLOR]<br><br>' +
 
'[COLOR=white]Игроку будет выдано наказание по пункту правил: [/COLOR]<br><br>' +
'3.08. Запрещены любые формы «слива» посредством использования глобальных чатов [COLOR=rgb(255, 0, 0)]| PermBan[/COLOR]<br><br>' +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]', 
 
   prefix:ACCEPT_PREFIX, 
   status:false, 
        
    },
	{
      title: 'НРП поведение',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} , уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
		" [FONT=georgia] [B][CENTER]Нарушитель будет наказан по Пункту Правил ГОСС 6.03.<br>" +
		'6.03. Запрещено nRP поведение[COLOR=RED] | Warn[/COLOR] <br><br>' +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
		 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
 
	{
      title: 'Исп Т/С фракции в лич целях',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
		" [FONT=georgia] [B][CENTER]Нарушитель будет наказан по Пункту Правил ГОСС 1.08.<br>" +
		' Запрещено использование фракционного транспорта в личных целях [COLOR=RED]| Jail 30 минут.[/COLOR]<br><br>' +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'Одиночный патруль',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple] {{greeting}} ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
		" [FONT=georgia] [B][CENTER]Нарушитель будет наказан по Пункту Правил ГОСС 1.11.<br>" +
		' Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника [COLOR=RED]| Jail 30 минут.[/COLOR]<br><br>' +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
		 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
      title: 'БУ/Казино/Конты/Вышки в РФ',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
		" [FONT=georgia] [B][CENTER]Нарушитель будет наказан по Пункту Правил ГОСС 1.13.<br>" +
		' Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работы в форме фракции[COLOR=RED] | Jail 30 минут[/COLOR] <br><br>' +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
		 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: '-----  Правила ОПГ  -------------------------------------------------------------------------------------------------------------------------------------',
	},
	{
      title: 'Nrp ВЧ',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
		" [FONT=georgia] [B][CENTER]Нарушитель будет наказан по Пункту Правил ОПГ 2.<br>" +
		'. За нарушение правил нападения на Войсковую Часть выдаётся предупреждение [COLOR=RED][COLOR=RED] | Jail 30 минут[/COLOR] (NonRP нападение) / Warn (Для сотрудников ОПГ) [/COLOR]<br><br>' +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
		 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
 
    {
	  title: '-----  РП Биографии  -----------------------------------------------------------------------------------------------------------------------------------',
	},
     {
      title: 'Одобрено',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Ваша РП Биография получает статус<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
		 
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
		
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Отказано',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		 
        " [FONT=georgia] [B][CENTER]Ваша РП Биография получает статус<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
 
" [FONT=georgia] Причиной могло послужить любое нарушение Правил Подачи РП Биографии<br>" , 
      prefix: UNACCEPT_PREFIX,
	  status: false,
}, 
{
     title: 'Возраст не совпадает',
      content:
		'[Color=MediumPurple][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.name }}.[/color][/CENTER]<br>' +
		
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причина: Возраст не совпадает с датой рождения.", 
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    
    {
      title: 'Фамилия или имя в названии отличаются',
      content:
		'[Color=MediumPurple][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый {{ user.name }}.[/color][/CENTER]<br>' +
		
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причина: В названии вашей биографии и в пункте 1 различаются имя/фамилия."+
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]', 
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
{
      title: 'био отказ(18 лет)',
      content:
        '[Color=MediumPurple][FONT=TIMES NEW ROMAN][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причина отказа: минимальный возраст для составления биографии: 18 лет.[/CENTER][/FONT]" , 
    prefix: UNACCEPT_PREFIX,  
    status: false, 
}, 
     
 
     {
      title: 'Не по форме',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} , уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Ваша РП Биография получает статус<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
" [FONT=georgia] Причиной послужило написание РП Биографии не по форме<br>" , 
 
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'От 1-го лица',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} , уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Ваша РП Биография получает статус<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
		" [FONT=georgia] Причиной послужило написание РП Биографии от 1-лица", 
		
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Копипаст',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+   
		
		"[B][CENTER]Ваша РП Биография получает статус<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
		" [FONT=georgia] Причиной послужило копирование текста / темы<br>" , 
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Дублирование',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Ваша РП Биография получает статус<br><br>" +
	 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
		" [FONT=georgia] Причиной послужило дублирование РП Биографии<br>" , 
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Ошибки в словах',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
	
        " [FONT=georgia] [B][CENTER]Ваша РП Биография получает статус<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
" [FONT=georgia] Причиной послужило написание РП Биографии с грамматическими / орфографическими ошибками<br>" , 
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Заговолок',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Ваша РП Биография получает статус<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
	" [FONT=georgia] Причиной послужило написание заговолка РП Биографии не по форме<br>" , 
		prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Нету имени родных',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Ваша РП Биография получает статус<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
		" [FONT=georgia] Причиной послужило то, что вы не написали имя родителей и тд.<br>" , 
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
 
	 {
      title: 'Мало текста',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Ваша РП Биография получает статус<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
" [FONT=georgia] Причиной послужило то, что Вы написали мало текста в своей РП Биографии<br>" , 
		prefix: UNACCEPT_PREFIX,
	  status: false,
    },
 
	 {
	  title: '-----  РП Ситуации  -------------------------------------------------------------------------------------------------------------------------------------',
	},
	 {
      title: 'Одобрено',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
	
        " [FONT=georgia] [B][CENTER]Ваша РП Ситуация получает статус<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
		
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Отказано',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Ваша РП Ситуация получает статус<br><br>" +
 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
		" [FONT=georgia] Причиной могло послужить любое нарушение Правил Написания РП Ситуации<br>" , 
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 
 
	 {
      title: 'Дублирование',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}  ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Ваша РП Ситуация получает статус<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
		" [FONT=georgia] Причиной послужило дублирование темы<br>" , 
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
	  title: '-----  РП Организации  -------------------------------------------------------------------------------------------------------------------------------',
	},
	 {
      title: 'Одобрено',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}}, уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Ваша Неофициальная РП Организация получает статус<br><br>" +
  '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=lightgreen]  Одобрено [/COLOR][/FONT] [/CENTER]'+ 
  
"[I][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] Black Russia[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255,140,0)][B][SIZE=1]KOSTROMA[/SIZE][/B][/COLOR]", 
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Отказано',
      content:
		"[B][CENTER][FONT=TIMES NEW ROMAN][COLOR=MediumPurple]{{greeting}} ,уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
		
        " [FONT=georgia] [B][CENTER]Ваша Неофициальная РП Организация получает статус<br><br>" +
		 '[CENTER][FONT=TIMES NEW ROMAN] [COLOR=RED]  Отказано [/COLOR][/FONT] [/CENTER]'+
" [FONT=georgia] Причиной могло послужить любое нарушение Правил Подачи Заявления На Неофициальную РП Организацию<br>" , 
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