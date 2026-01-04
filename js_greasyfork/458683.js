/// ==UserScript==
// @name         KF SKRIPT | R.Witdahoodie
// @namespace    https://forum.blackrussia.online
// @version      2.1.1Final?
// @description  KF SKRIPT Moscow
// @author       Ruslan_Witdahoodie
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license    MIT
// @collaborator 
// @icon https://vk.com/sticker/1-76845-128
// @downloadURL https://update.greasyfork.org/scripts/458683/KF%20SKRIPT%20%7C%20RWitdahoodie.user.js
// @updateURL https://update.greasyfork.org/scripts/458683/KF%20SKRIPT%20%7C%20RWitdahoodie.meta.js
// ==/UserScript==


(function () {
  'use strict';
const UNACCСEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCСEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PINN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEXY_PREFIX = 13;
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const OTKAZORG_PREFIX = 4;
const ODOBRENOORG_PREFIX = 8;
const NARASSMOTRENIIORG_PREFIX = 2;
const buttons = [
     {
      title: 'Приветствие',
      content: '[COLOR=rgb(187, 187, 187)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}![/color][/CENTER]' + '',
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Без опр. пунтка╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Не выполнения условий выше',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Ваша Жалоба получает статус: [Color=FireBrick]Отказано.[/color]Причиной отказа послужило - не выполение условий выше[/I][/FONT][/color][/CENTER]" ,
      prefix: OTKAZBIO_PREFIX,
	 status: false,
    },
    {
	  title: 'Нету доков',
	  content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
		"[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]В вашей жалобе нету доказательств.[/color][/CENTER]" +
		'[COLOR=rgb(255, 0, 0)][CENTER]Отказано,закрыто.[/color][/CENTER][/FONT]',
         prefix: UNACCСEPT_PREFIX,
	 status: false,
	},
    {
	  title: 'Нарушений нету',
	  content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
		"[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Нарушений со стороны данного игрока не было найдено.[/color][/CENTER]" +
		'[COLOR=rgb(255, 0, 0)][CENTER]Отказано,закрыто.[/color][/CENTER][/FONT]',
        prefix: UNACCСEPT_PREFIX,
	 status: false,
	},
    {
      title: 'Недостаточно доказательств',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][SIZE=4][CENTER]Недостаточно доказательств на нарушение от данного игрока.Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока.[/color][/CENTER]" +
		'[COLOR=rgb(255, 0, 0)][CENTER]Отказано,закрыто.[/color][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	 status: false,
       },
    {
      title: 'Копия темы',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]'+
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован на 3 дня и более.[/color][/CENTER]" +
		'[COLOR=rgb(255, 0, 0)][CENTER]Отказано,закрыто.[/color][/CENTER][/FONT]',
             prefix: UNACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'В жалобы на адм',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Вы ошиблись разделом.Обратитесь в раздел [URL=https://forum.blackrussia.online/index.php?forums/Жалобы-на-администрацию.271/] «Жалобы на администрацию».[/URL][/color][/CENTER]" +
		'[COLOR=rgb(255, 0, 0)][CENTER]Отказано,закрыто.[/color][/CENTER][/FONT]',
              prefix: UNACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'В обжалования',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Вы ошиблись разделом.Обратитесь в раздел [URL=https://forum.blackrussia.online/index.php?forums/Обжалование-наказаний.274/] «Обжалования наказаний».[/URL][/color][/CENTER]" +
		'[COLOR=rgb(255, 0, 0)][CENTER]Отказано,закрыто.[/color][/CENTER][/FONT]',
             prefix: UNACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Форма темы',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Ваша жалоба составлена не по форме.Убедительная просьба ознакомиться с [URL=https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/]«Правилами подачи жалоб».[/URL][/color][/CENTER]" +
		'[COLOR=rgb(255, 0, 0)][CENTER]Отказано,закрыто.[/color][/CENTER][/FONT]',
             prefix: UNACCСEPT_PREFIX,
	 status: false,
    },
	{
	  title: 'Нету /time',
	  content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
		"[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]На ваших доказательствах отсутствует /time.[/color][/CENTER]" +
		'[COLOR=rgb(255, 0, 0)][CENTER]Отказано,закрыто.[/color][/CENTER][/FONT]',
              prefix: UNACCСEPT_PREFIX,
	 status: false,
	},
    {
	  title: 'Укажите таймкоды',
	  content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
		"[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Укажите таймкоды[/color][/CENTER]" +
		'[Color=rgb(255, 140, 0)][CENTER]На рассмотрении[/I][/CENTER][/color][/FONT]',
      prefix: PINN_PREFIX,
	 status: true,
	},
    {
      title: 'Жалоба на рассмотрении',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Ваша жалоба взята на рассмотрение.Просьба ожидать ответа и не создавать дубликаты данной темы.[/color][/CENTER]" +
		'[Color=rgb(255, 140, 0)][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]',
      prefix: PINN_PREFIX,
	 status: true,
    },
      {
      title: 'Больше 72 часов',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER][B][I]Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера.[/color][/CENTER]" +
		'[COLOR=rgb(255, 0, 0)][CENTER]Отказано,закрыто.[/color][/CENTER][/FONT]',
               prefix: UNACCСEPT_PREFIX,
	 status: false,
    },
      {
      title: 'Доква через соц сети вк  инста',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER][B][I]3.6. Прикрепление доказательств обязательно.[COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/color][/CENTER]" +
		'[COLOR=rgb(255, 0, 0)][CENTER]Отказано,закрыто.[/color][/CENTER][/FONT]',
               prefix: UNACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Нету условий сделки',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER][B][I]В данных доказательствах отсутствуют условия сделки[/color][/CENTER]" +
		'[COLOR=rgb(255, 0, 0)][CENTER]Отказано,закрыто.[/color][/CENTER][/FONT]',
              prefix: UNACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Нужен фарапс',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER][B][I]В таких случаях нужна видеозапись[/color][/CENTER]" +
		'[COLOR=rgb(255, 0, 0)][CENTER]Отказано,закрыто.[/color][/CENTER][/FONT]',
            prefix: UNACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Нужен фарпс + промотка чата',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER][B][I]В таких случаях нужна видеозапись + промотка чата.[/color][/CENTER]" +
		'[COLOR=rgb(255, 0, 0)][CENTER]Отказано,закрыто.[/color][/CENTER][/FONT]',
              prefix: UNACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Нужна промотка чата',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER][B][I]В таких случаях нужна промотка чата.[/color][/CENTER]" +
		'[COLOR=rgb(255, 0, 0)][CENTER]Отказано,закрыто.[/color][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Неполный фрапс',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER][B][I]Видео запись обрывается. Загрузите полную видеозапись на ютуб.[/color][/CENTER]" +
		'[COLOR=rgb(255, 0, 0)][CENTER]Отказано,закрыто.[/color][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Не работают доква',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Не работают доказательства[/color][/CENTER]" +
		'[Color=Flame][CENTER]Закрыто[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	 status: false,
    },
     {
      title: 'Доква отредактированы',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER][B][I]Ваши доказательства отредактированы.[/color][/CENTER]" +
		'[COLOR=rgb(255, 0, 0)][CENTER]Отказано,закрыто.[/color][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'От 3-го лица',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER][B][I]Жалобы от 3-их лиц не принимаются[/color][/CENTER]" +
		'[COLOR=rgb(187, 187, 187)][CENTER]Отказано,  закрыто.[/color][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Ответный ДМ',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER][B][I]В случае ответного ДМ нужен видиозапись. Пересоздайте тему и прекрепите видиозапись.[/color][/CENTER]" +
		'[COLOR=rgb(255, 0, 0)][CENTER]Отказано,закрыто.[/color][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Ошиблись разделом',

      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Вы ошиблись Сервером/разделом, переподайте жалобу в нужный раздел.[/color][/CENTER]",
      prefix: UNACCСEPT_PREFIX,
	 status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Чат╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'MG',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | [COLOR=rgb(255, 0, 0)] Mute 30 минут [/COLOR].[/color][/CENTER]" +
        "[CENTER][SPOILER=Примечание][I][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] использование смайлов в виде символов «))», «=D» запрещено в IC чате." +
        "[CENTER][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] телефонное общение также является IC чатом.[/color][/CENTER]" +
        "[CENTER][COLOR=rgb(255, 0, 0)]Исключение[/COLOR] за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.[/I][/CENTER][/SPOILER]" +
        '[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
     {
      title: 'Транслит',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:3.01. Общепризнанный язык сервера — русский. Общение в IC и OOC чатах во всех RolePlay ситуациях обязательно должно проходить исключительно на русском языке |Устное замечание / [COLOR=rgb(255, 0, 0)] Mute 30 минут [/COLOR] [/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
	  title: 'Капс',
	  content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
		"[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | [COLOR=rgb(255, 0, 0)] Mute 30 минут [/COLOR].[/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
	},
     {
      title: 'Оск в ООС',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | [COLOR=rgb(255, 0, 0)] Mute 30 минут [/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Оск  Упом родни',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | [COLOR=rgb(255, 0, 0)] Mute 120 минут /  Ban 7 - 15 дней [/color].[/color][/CENTER]" +
        "[CENTER][SPOILER=Примечание][I][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] термин [COLOR=rgb(255, 0, 0)]MQ[/COLOR]   расценивается, как упоминание родных." +
        "[CENTER][COLOR=rgb(255, 0, 0)]Исключение[/COLOR] если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/I][/CENTER][/SPOILER]" +
        '[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
	  title: 'Флуд',
	  content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
		"[Color=rgb(187, 187, 187)][FONT=courier new][Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | [COLOR=rgb(255, 0, 0)] Mute 30 минут [/COLOR].[/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
	},
    {
      title: 'Злоуп знаками',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][Color=rgb(187, 187, 187)][FONT=courier new][Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:3.06. Запрещено злоупотребление знаков препинания и прочих символов | [COLOR=rgb(255, 0, 0)] Mute 30 минут [/color][/CENTER]" +
        "[CENTER][SPOILER=Примечание][I][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] «???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее." +
               '[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Оскорбление ',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:3.07. Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата | [COLOR=rgb(255, 0, 0)] Mute 30 минут [/color][/CENTER]" +
         "[CENTER][SPOILER=Примечание][I][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] «дырка», «шмара», «ведро», «мадагаскарский присосконог», «свиноногий бандикут», «скорострел» и так далее. " +
               '[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
     {
      title: 'Слив сми в эфире',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:3.08. Запрещены любые формы «слива» посредством использования глобальных чатов | [COLOR=rgb(255, 0, 0)] PermBan[/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'редактирование поданных объявлений в личных целях',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком |[COLOR=rgb(255, 0, 0)] Ban 7 дней + ЧС организации[/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Угрозы о наказании со стороны адм',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][Color=rgb(187, 187, 187)][FONT=courier new][Color=rgb(187, 187, 187)][FONT=courier new][CENTER][B][I]Игрок будет наказан по пункту правил:[/FONT][/I][/B][I][B]3.09. Запрещены любые угрозы о наказании игрока со стороны администрации | [COLOR=rgb(255, 0, 0)] Mute 30 минут [/COLOR] [/B][/I][/FONT][B][I]Одобрено, закрыто[/FONT][/I][/B][/color][/CENTER]",
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Выдача себя за адм ',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:3.10. Запрещена выдача себя за администратора, если таковым не являетесь |Ban 7 - 15 + ЧС администрации[/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Ввод в заблуждение',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:3.11. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | [COLOR=rgb(255, 0, 0)] Ban 15 - 30 дней / PermBan[/color][/CENTER]" +
		      " [CENTER][SPOILER=Примечание][I][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] /me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена." +
        '[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
        	 status: false,
    },
    {
      title: 'Реклама промо',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | [COLOR=rgb(255, 0, 0)] Ban 30 дней.[/color][/CENTER]" +
		 "[CENTER][SPOILER=Примечание][I][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее." +
        "[CENTER][COLOR=rgb(255, 0, 0)]Исключение[/COLOR] промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.[/color][/CENTER]" +
        "[CENTER][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.[/I][/CENTER][/SPOILER]" +
                '[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Торговля на тт госс',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) | [COLOR=rgb(255, 0, 0)] Mute 30 минут [/color][/CENTER]" +
        "[CENTER][SPOILER=Примечание][I][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] в помещении центральной больницы писать в чат: *Продам эксклюзивную шапку дешево!!!*[/I][/CENTER][/SPOILER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Религиозное и политическая пропоганда',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:3.18. Запрещено политическое и религиозное пропагандирование | [COLOR=rgb(255, 0, 0)] Mute 120 минут / Ban 10 дней[/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
        {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴войс╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Музыка в войс',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:3.14. Запрещено включать музыку в Voice Chat | [COLOR=rgb(255, 0, 0)] Mute 60 минут[/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Оск/Упом род в войс',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:3.15. Запрещено оскорблять игроков или родных в Voice Chat |[COLOR=rgb(255, 0, 0)] Mute 120 минут /  Ban 7 - 15 дней [/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Шум в войс',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:3.16. Запрещено создавать посторонние шумы или звуки | [COLOR=rgb(255, 0, 0)] Mute 30 минут [/color][/CENTER]" +
        "[CENTER][SPOILER=Примечание][I][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] Посторонние звуки на фоне речи, мешающие взаимодействию игроков посредством голосового чата. Сильное искажение звука, исходящее из микрофона плохого качества. Намеренно портить игру другим игрокам (кричать, перебивать)[/color][/CENTER][/SPOILER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
     {
      title: 'Продажа в войс',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:3.17. Запрещена реклама в Voice Chat не связанная с игровым процессом | [COLOR=rgb(255, 0, 0)] Ban 7 - 15 дней [/color] [/color][/CENTER]" +
        "[CENTER][SPOILER=Примечание][I][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] [COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] реклама Discord серверов, групп, сообществ, ютуб каналов и т.д.[/I][/CENTER][/SPOILER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
     {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Игровой Ак╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Фейк аккаунт',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:4.10. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию |[COLOR=rgb(255, 0, 0)] Устное замечание + смена игрового никнейма / PermBan[/color][/CENTER]" +
        "[CENTER][SPOILER=Примечание][I][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] подменять букву i на L и так далее, по аналогии.[/I][/CENTER][/SPOILER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
     {
      title: 'Сторонне ПО',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER][B][I]Игрок будет наказан по пункту правил:[/I][/B][/FONT][B][I]2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками| [COLOR=rgb(255, 0, 0)] Ban 15 - 30 дней / PermBan[/color][/CENTER]" +
         "[CENTER][SPOILER=Примечание][I][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] запрещено внесение любых изменений в оригинальные файлы игры.[/color][/CENTER]" +
         "[CENTER][COLOR=rgb(255, 0, 0)]Исключение[/COLOR] разрешено изменение шрифта, его размера и длины чата (кол-во строк).[/color][/CENTER]" +
         "[CENTER][COLOR=rgb(255, 0, 0)]Исключение[/COLOR] блокировка за включенный счетчик FPS не выдается.[/I][/CENTER][/SPOILER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'мульти ак',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER][B][I]Игрок будет наказан по пункту правил:[/I][/B][/FONT][B][I]4.04. Разрешается зарегистрировать максимально только три игровых аккаунта на сервере |[COLOR=rgb(255, 0, 0)] PermBan[/color][/CENTER]" +
        "[CENTER][SPOILER=Примечание][I][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR]блокировке подлежат все аккаунты созданные после третьего твинка.[/color][/CENTER][/SPOILER]" +
        '[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
        prefix: ACCСEPT_PREFIX,
	    status: false,
    },
    {
      title: 'обход игровой системы',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER][B][I]Игрок будет наказан по пункту правил:[/I][/B][/FONT][B][I]2.21. Запрещено пытаться обходить игровую систему или использовать любые баги сервера | [COLOR=rgb(255, 0, 0)] Ban 15 - 30 дней / PermBan[/color][/CENTER]" +
        "[CENTER][SPOILER=Примечание][I][COLOR=rgb(255, 255, 255)]Примечание:[/COLOR]под игровой системой подразумеваются функции и возможности, которые реализованы в игре для взаимодействия между игроками, а также взаимодействия игроков с функциями, у которых есть свое конкретное предназначение.[/color][/CENTER]" +
        "[CENTER][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 0, 0)]Пример:[/COLOR]аптечка предназначена для пополнения уровня здоровья, доступна всем игрокам по фиксированной цене в любом магазине. Но она не предназначена для перепродажи по завышенной цене с целью передачи виртуальной валюты между игроками;[/color][/CENTER]" +
        "[CENTER]Аксессуары предназначены для украшения внешнего вида персонажа, не предназначены для передачи виртуальной валюты между игроками;[/color][/CENTER]" +
        "[CENTER]Банк и личные счета предназначены для передачи денежных средств между игроками;[/color][/CENTER]" +
        "[CENTER]Транспортное средство предназначено для передвижения игроков, не предназначено для передачи денег тем или иным способом, включая обмен с завышенными доплатами.[/I][/CENTER][/SPOILER]" +
        		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
        prefix: ACCСEPT_PREFIX,
	    status: false,
    },
      {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила Role Play процесса ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Нонрп поведение',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER][I][B]Игрок будет наказан по пункту правил: 2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | [COLOR=rgb(255, 0, 0)]Jail 30 минут / Warn [/FONT][/I][/B][/color][/CENTER] " +
        "[CENTER][SPOILER=Примечание][I][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/SPOILER][/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Уход от РП',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами |[COLOR=rgb(255, 0, 0)]Jail 30 минут [/COLOR] / Warn[/color][/CENTER]" +
        "[CENTER][SPOILER=Примечание][I][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания или ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа. Уходить в интерьер или зеленую зону во время перестрелки с целью избежать смерти или уйти от Role Play процесса и так далее.[/SPOILER][/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Нонрп вождение',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:2.03. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере |[COLOR=rgb(255, 0, 0)]Jail 30 минут [/color][/CENTER]" +
        "[CENTER][SPOILER=Примечание][I][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] езда на скутере по горам, езда на любом транспортном средстве по встречным полосам, нарушая все правила дорожного движения без какой-либо причины, намеренное создание аварийных ситуаций на дорогах и так далее.[/I][/color][/SPOILER][/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
     {
      title: 'Нонрп вождение Фура Инко',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:2.47. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [COLOR=rgb(255, 0, 0)] | Jail 60 минут [/COLOR] [/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
        {
      title: 'NonRP Обман',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | [COLOR=rgb(255, 0, 0)] PermBan.[/color][/CENTER]" +
		"[CENTER][SPOILER=Примечание][I][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/color][/CENTER]" +
		"[CENTER][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/I][/CENTER][/SPOILER]" +
        '[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Аморал действия',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков |[COLOR=rgb(255, 0, 0)]Jail 30 минут  / Warn [/color][/CENTER]" +
        "[CENTER][SPOILER=Примечание][I][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 0, 0)]Исключение[/COLOR] обоюдное согласие обеих сторон.[/color][/CENTER][/I][/color][/SPOILER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Слив склада',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле | [COLOR=rgb(255, 0, 0)] Ban 15 - 30 дней / PermBan[/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'ДБ',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [COLOR=rgb(255, 0, 0)] | Jail 60 минут [/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'РК',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:2.14. Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти |[COLOR=rgb(255, 0, 0)]Jail 30 минут [/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'ТК',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [COLOR=rgb(255, 0, 0)] | Jail 60 минут [/COLOR] [/COLOR] / Warn (за два и более убийства)[/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'СК',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [COLOR=rgb(255, 0, 0)] | Jail 60 минут [/COLOR] [/COLOR] / Warn (за два и более убийства).[/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'ПГ',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:2.17. Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь |[COLOR=rgb(255, 0, 0)]Jail 30 минут [/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
        {
      title: 'ДМ',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [COLOR=rgb(255, 0, 0)] | Jail 60 минут [/color][/CENTER]" +
        "[CENTER][SPOILER=Примечание][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/color][/CENTER]" +
		"[CENTER][COLOR=rgb(255, 0, 0)]Примечание:  нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/I][/CENTER][/SPOILER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Масс ДМ',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины более трем игрокам [COLOR=rgb(255, 0, 0)] || Warn / Ban 3 - 7 дней[/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Реклама сторонние ресурсы',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:2.31. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [COLOR=rgb(255, 0, 0)]|  Ban 7 дней / PermBan [/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Оск адм',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:2.32. Запрещено введение в заблуждение, обман, оскорбление, неконструктивная критика администрации на всех ресурсах проекта | [COLOR=rgb(255, 0, 0)] Ban 7 - 15 дней [/color] [/color][/CENTER]" +
        "[CENTER][SPOILER=Примечание][I][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] подделка доказательств, искажение информации в свою пользу, предоставление неполной информации о ситуации.[/I][/color][/SPOILER][/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'IC и OCC угрозы',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:2.35. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате |[COLOR=rgb(255, 0, 0)] Mute 120 минут / Ban 7 дней [/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Уход от наказания',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:2.34. Запрещен уход от наказания | [COLOR=rgb(255, 0, 0)] Ban 15 - 30 дней (суммируется к общему наказанию дополнительно)[/color][/CENTER]" +
        "[CENTER][SPOILER=Примечание][I][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 0, 0)]Пример:[/COLOR][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] зная, что в данный момент игроку может быть выдано наказание за какое-либо нарушение, изменение никнейма или передача своего имущества на другие аккаунты и тому подобное.[/color][/CENTER]" +
        "[CENTER][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] выход игрока из игры не является уходом от наказания.[/I][/color][/SPOILER][/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
     {
      title: 'Угрозы OOC',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER][B][I]Игрок будет наказан по пункту правил:[/FONT][/I][/B][I][B]2.37. Запрещены OOC угрозы, в том числе и завуалированные |[COLOR=rgb(255, 0, 0)] Mute 120 минут / Ban 7 дней[/color][/CENTER]" +
        '[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Злоуп наказаниями',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER][B][I]Игрок будет наказан по пункту правил:2.39. Злоупотребление нарушениями правил сервера |[COLOR=rgb(255, 0, 0)]Ban 7 - 30 дней[/color][/CENTER]" +
        "[CENTER][SPOILER=Примечание][I][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] неоднократное (от шести и более) нарушение правил сервера, которые были совершены за прошедшие 7 дней.[/color][/CENTER]" +
        "[CENTER][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] наказания выданные за нарушения правил текстовых чатов, помеху (kick) в учет не идут.[/color][/CENTER]" +
        "[CENTER][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] было получено пять наказаний за DM, шестое будет злоупотреблением. Если было получено одно наказание за упоминание родных, два наказания за DB и два наказания за DM, следующее будет считаться злоупотреблением.[/I][/color][/SPOILER][/color][/CENTER]" +
        '[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Оск проекта',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:2.40 Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | [COLOR=rgb(255, 0, 0)] Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Продажа промо',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:2.43. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций |[COLOR=rgb(255, 0, 0)] Mute 120 минут [/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Помеха РП процессу',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:2.51. Запрещено вмешательство в Role Play процесс с целью помехи и препятствования дальнейшего развития Role Play процесса |[COLOR=rgb(255, 0, 0)]Jail 30 минут [/color][/CENTER]" +
        "[CENTER][SPOILER=Примечание][I][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] вмешательство в Role Play процесс при задержании игрока сотрудниками ГИБДД, вмешательство в проведение тренировки или мероприятия какой-либо фракции и тому подобные ситуации.[/I][/color][/SPOILER][/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Нонрп акс',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. |[COLOR=rgb(255, 0, 0)]  При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/color][/CENTER]" +
        "[CENTER][SPOILER=Примечание][I][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное.[/I][/color][/SPOILER][/color][/CENTER]" +
        '[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Неув обр. к адм',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:2.54. Запрещено неуважительное обращение, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации |[COLOR=rgb(255, 0, 0)] Mute 180 минут[/color][/CENTER]" +
        "[CENTER][SPOILER=Примечание][I][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] оскорбление администрации в любой чат, включая репорт подлежит наказанию в виде блокировки доступа к использованию всех видов чатов - Mute 180 минут.[/color][/CENTER]" +
        "[CENTER][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] оформление жалобы в игре с текстом: *Быстро починил меня*, *Админы вы задрали уже когда работать будете меня тут ДБшат я 3 жалобы уже подал!!!!!!!!*, *МОЗГИ ВКЛЮЧИТЕ Я УВОЛЮ ВАС ЩА* и т.д. и т.п., а также при взаимодействии с другими игроками.[/I][/color][/SPOILER][/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Баг аним',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по данному пункту правил:2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. |[COLOR=rgb(255, 0, 0)] Jail 60 / 120 минут[/color][/CENTER]" +
        "[CENTER][SPOILER=Примечание][I][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде Jail на 120 минут. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками.[/color][/CENTER]" +
        "[CENTER][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 0, 0)]Пример:[/COLOR][COLOR=rgb(255, 255, 255)][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде Jail на 60 минут.[/I][/color][/SPOILER][/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Передача╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Тех. спецу',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Ваша жалоба была передана на рассмотрение [I][Color=rgb(255, 69, 0)]техническому специалисту.[/I][/CENTER]" +
		'[Color=rgb(255, 140, 0)][FONT=courier new][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]',
      prefix: TEXY_PREFIX,
	 status: false,
    },
    {
      title: 'Передано ГА',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Ваша жалоба была передана на рассмотрение [I][Color=rgb(255, 0, 0)]Главному Администратору.[/I][/CENTER]" +
		'[Color=rgb(255, 140, 0)][FONT=courier new][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]',
      prefix: GA_PREFIX,
	 status: false,
    },
    {
      title: 'Передано Спецу',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Ваша жалоба была передана на рассмотрение [I][Color=rgb(255, 0, 0)]Специальному администратору.[/I][/CENTER]" +
		'[Color=rgb(255, 140, 0)][FONT=courier new][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]',
      prefix: SPECY_PREFIX,
	 status: false,
    },
        {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴РП биографии╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
      {
      title: 'одобрено',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Ваша РП биография получает статус: [Color=rgb(0, 255, 0)]Одобрено.[/I][/CENTER][/color][/FONT]",
      prefix: ODOBRENOBIO_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴РП биографии дополнения╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: ' дополните детсво',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER][B][I]Вам даётся 24 часа на дополнение пункта Детство[/color][/CENTER]" +
        '[Color=rgb(255, 140, 0)][CENTER]На рассмотрении[/I][/CENTER][/color][/FONT]',
      prefix: NARASSMOTRENIIBIO_PREFIX,
       status: true,
    },
    {
      title: ' дополните пункт юность и взрослая жизнь',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER][B][I]Вам даётся 24 часа на дополнение пункта Юность и взрослая жизнь[/color][/CENTER]" +
        '[Color=rgb(255, 140, 0)][CENTER]На рассмотрении[/I][/CENTER][/color][/FONT]',
      prefix: NARASSMOTRENIIBIO_PREFIX,
       status: true,
    },
    {
      title: ' дополните пункт настоящее время',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER][B][I]Вам даётся 24 часа на дополнение пункта Настоящее время[/color][/CENTER]" +
        '[Color=rgb(255, 140, 0)][CENTER]На рассмотрении[/I][/CENTER][/color][/FONT]',
      prefix: NARASSMOTRENIIBIO_PREFIX,
       status: true,
    },
    {
      title: 'дополните хобби',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER][B][I]Вам даётся 24 часа на дополнение пункта Хобби[/color][/CENTER]" +
        '[Color=rgb(255, 140, 0)][CENTER]На рассмотрении[/I][/CENTER][/color][/FONT]',
      prefix: NARASSMOTRENIIBIO_PREFIX,
       status: false,
    },
    {
      title: ' некорректный возраст',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER][B][I]Вам даётся 24 часа на исправление пункта возраст[/color][/CENTER]" +
        '[Color=rgb(255, 140, 0)][CENTER]На рассмотрении[/I][/CENTER][/color][/FONT]',
      prefix: NARASSMOTRENIIBIO_PREFIX,
       status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴РП биографии отказ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'отказ не выполнение условий',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Ваша РП биография получает статус: [Color=FireBrick]Отказано.[/color]Причиной отказа послужило - не выполение условий выше[/I][/FONT][/color][/CENTER]" ,
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: '  отказ заголовок',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Ваша РП биография получает статус: [Color=FireBrick]Отказано.[/color]Причиной отказа послужило - Заголовок создаваемой темы должен быть написан строго по данной форме: “ RolePlay биография гражданина Имя Фамилия. “[/I][/FONT][/color][/CENTER]" ,
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'отказ нонрп ник',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Ваша РП биография получает статус: [Color=FireBrick]Отказано.[/color]Причиной отказа послужило - Запрещено создание Role Play биографии, если у Вас NonRolePlay никнейм.[/I][/FONT][/color][/CENTER]" ,
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: ' отказ нижнее подчеркивание в нике',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Ваша РП биография получает статус: [Color=FireBrick]Отказано.[/color]Причиной отказа послужило - Никнейм должен быть указан без нижнего подчеркивания на русском как в заголовке, так и в самой теме.[/I][/FONT][/color][/CENTER]" ,
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: ' отказ не от 3-го лица',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Ваша РП биография получает статус: [Color=FireBrick]Отказано.[/color]Причиной отказа послужило - Биография должна быть написана от третьего лица персонажа.[/I][/FONT][/color][/CENTER]" ,
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: 'отказ более чем 1 рп био на 1 акк',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Ваша РП биография получает статус: [Color=FireBrick]Отказано.[/color]Причиной отказа послужило - Запрещено создавать более чем одной биографии для одного игрового аккаунта.[/I][/FONT][/color][/CENTER]",
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: ' отказ био известных лиц',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Ваша РП биография получает статус: [Color=FireBrick]Отказано.[/color]Причиной отказа послужило - Запрещено использовать биографии известных личностей, лидеров, администраторов сервера, разработчиков, руководителей.[/I][/FONT][/color][/CENTER]",
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: ' отказ копипаси',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Ваша РП биография получает статус: [Color=FireBrick]Отказано.[/color]Причиной отказа послужило - Запрещено полное и частичное копирование биографий из данного раздела или из разделов RP биографий других серверов.[/I][/FONT][/color][/CENTER]",
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: ' отказ приписывание супер способностей',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Ваша РП биография получает статус: [Color=FireBrick]Отказано.[/color]Причиной отказа послужило - Запрещено приписывание своему персонажу супер-способностей.[/I][/FONT][/color][/CENTER]" ,
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
      title: ' отказ много ошибок',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Ваша РП биография получает статус: [Color=FireBrick]Отказано.[/color]Причиной отказа послужило многочисленные грамматические ошибки[/I][/FONT][/color][/CENTER]" ,
      prefix: OTKAZBIO_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴РП ситуации╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'РП ситуация одобрено',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Ваша РП ситуация получает статус: [Color=rgb(0, 255, 0)]Одобрено.[/I][/CENTER][/color][/FONT]",
      prefix: ODOBRENORP_PREFIX,
	  status: false,
    },
    {
      title: 'РП ситуация на дороботке',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER][B][I]Вам даётся 24 часа на дополнение вашей РП ситуации[/color][/CENTER]" +
        '[Color=rgb(255, 140, 0)][CENTER]На рассмотрении[/I][/CENTER][/color][/FONT]',
      prefix: NARASSMOTRENIIRP_PREFIX,
	  status: true,
    },
    {
      title: 'РП ситуация отказ',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Ваша РП ситуация получает статус: [Color=FireBrick]Отказано.[/color]Причиной отказа могло послужить какое-либо нарушение из [URL=https://forum.blackrussia.online/index.php?threads/moscow-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-role-play-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B9.1809166]Тык[/URL][/color][/CENTER][/FONT]",
      prefix: OTKAZRP_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Неофициал. орг.╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Неофициальная Орг Одобрено',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        '[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Ваша РП ситуация получает статус: [Color=rgb(0, 255, 0)]Одобрено.[/I][/CENTER][/color][/FONT]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][/color][/CENTER]Приятной игры [/color][/CENTER]",
      prefix: ODOBRENOORG_PREFIX,
	  status: false,
    },
    {
      title: 'Неофициальная Орг на дороботке',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER][B][I]Вам даётся 24 часа на дополнение вашей Неофициальная Орг[/color][/CENTER]" +
        '[Color=rgb(255, 140, 0)][CENTER]На рассмотрении[/I][/CENTER][/color][/FONT]',
      prefix: NARASSMOTRENIIORG_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Неофициал. орг. отказ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Неофициальная Орг отказ',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Ваша РП ситуация получает статус: [Color=FireBrick]Отказано.[/color]Причиной отказа могло послужить какое-либо нарушение из [URL='https://forum.blackrussia.online/index.php?threads/moscow-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B5%D0%BE%D1%84%D0%B8%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B9-roleplay-%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8.1809163/']Правила создания неофициальной RolePlay организации[/URL].[/color][/CENTER][/FONT]",
      prefix: OTKAZORG_PREFIX,
	  status: false,
    },
    {
      title: 'Неофициальная Орг отказ нету стартового состава',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Ваша РП ситуация получает статус: [Color=FireBrick]Отказано.[/color]Причиной отказа послужило - Для создания своей организации, её лидер должен иметь стартовый состав от 3+ человек, которые уже зарегистрированы на проекте.[/color][/CENTER][/FONT]",
      prefix: OTKAZORG_PREFIX,
	  status: false,
    },
    {
      title: 'Неофициальная Орг отказ нету истории орг',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Ваша РП ситуация получает статус: [Color=FireBrick]Отказано.[/color]Причиной отказа послужило - В теме должна быть описана история появления организации, её дальнейшие занятия.[/color][/CENTER][/FONT]",
      prefix: OTKAZORG_PREFIX,
	  status: false,
    },
    {
      title: 'Неофициальная Орг отказ плохое оформление',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Ваша РП ситуация получает статус: [Color=FireBrick]Отказано.[/color]Причиной отказа послужило - Оформление темы должно быть опрятным, если текст будет не читабелен, проверяющий вправе отклонить вашу заявку, переместив её в специальную тему.[/color][/CENTER][/FONT]",
      prefix: OTKAZORG_PREFIX,
	  status: false,
    },
    {
      title: 'Неофициальная Орг отказ некорректное название',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Ваша РП ситуация получает статус: [Color=FireBrick]Отказано.[/color]Причиной отказа послужило - Название темы должно быть по форме Название организации| Дата создания.[/color][/CENTER][/FONT]",
      prefix: OTKAZORG_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Неофициал. орг. активность╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
      {
      title: 'Неофициальная Орг запроси активности',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER][B][I]Ваша неофициальная РП организация может быть закрыта по пункту правил: Неактив в топике организации более недели, он закрывается. Прекрипите отчёт о активности организации в виде скриншотов. Через 24 часа если отчёта не будет или он будет некорректный организация будет закрыта.[/color][/CENTER]",
              prefix: PINN_PREFIX,
	 status: true
,
    },
    {
      title: 'Неофициальная Орг закрытие активности',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER][B][I]Активность небыла предоставлена. Организация закрыта.[/color][/CENTER]",
              prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила Гос.Структур╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Прогул Р/Д',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по пунтку правил: 1.07. Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции |[COLOR=rgb(255, 0, 0)]Jail 30 минут [/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Нон РП обыск',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по пунтку правил: 7.03. Запрещено проводить обыск без Role Play отыгровки | Warn[/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Исп. фрак т/с в личных целях',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по пунтку правил: 1.08. Запрещено использование фракционного транспорта в личных целях |[COLOR=rgb(255, 0, 0)]Jail 30 минут [/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'ДМ/Масс дм от МО',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по пунтку правил: 2.02. Наносить урон игрокам, которые находятся вне территории воинской части, запрещено |[COLOR=rgb(255, 0, 0)]Jail 30 минут  / Warn [/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Н/П/Р/О (Объявы)',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по пунтку правил: 4.01. Запрещено редактирование объявлений, не соответствующих ПРО | [COLOR=rgb(255, 0, 0)] Mute 30 минут [/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Н/П/П/Э (Эфиры)',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по пунтку правил: 4.02. Запрещено проведение эфиров, не соответствующих Role Play правилам и логике | [COLOR=rgb(255, 0, 0)] Mute 30 минут [/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'ДМ/Масс от УМВД',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по пунтку правил: 6.01. Запрещено наносить урон игрокам без Role Play причины на территории УМВД |[COLOR=rgb(255, 0, 0)]Jail 30 минут  / Warn [/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Розыск без причины(УМВД)',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по пунтку правил: 6.02. Запрещено выдавать розыск без Role Play причины |[COLOR=rgb(255, 0, 0)]Jail 30 минут [/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Задержание без РП(Нонрп коп)(УМВД)',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по пунтку правил: 6.03. Запрещено оказывать задержание без Role Play отыгровки | Warn[/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Нонрп поведение(УМВД)',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по пунтку правил: 6.04. Запрещено nRP поведение | Warn[/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'ДМ/Масс от ГИБДД',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по пунтку правил: 7.01. Запрещено наносить урон игрокам без Role Play причины на территории ГИБДД |[COLOR=rgb(255, 0, 0)]Jail 30 минут  / Warn [/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Штраф без рп(ГИБДД)',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по пунтку правил: 7.02. Запрещено выдавать розыск, штраф без Role Play причины |[COLOR=rgb(255, 0, 0)]Jail 30 минут [/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Розыск без причины(ГИБДД)',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по пунтку правил: 6.02. Запрещено выдавать розыск без Role Play причины |[COLOR=rgb(255, 0, 0)]Jail 30 минут [/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Забирание В/У во время погони(ГИБДД)',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по пунтку правил: 7.05. Запрещено отбирать водительские права во время погони за нарушителем | Warn[/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'ДМ/Масс от УФСБ',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по пунтку правил: 8.01. Запрещено наносить урон игрокам без Role Play причины на территории ФСБ |[COLOR=rgb(255, 0, 0)]Jail 30 минут  / Warn [/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Розыск без причины(УФСБ)',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по пунтку правил: 8.02. Запрещено выдавать розыск без Role Play причины |[COLOR=rgb(255, 0, 0)]Jail 30 минут [/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Задержание без РП(Нонрп коп)(ФСИН)',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по пунтку правил: 9.01. Запрещено наносить урон игрокам без Role Play причины на территории ФСИН |[COLOR=rgb(255, 0, 0)]Jail 30 минут  / Warn [/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила ОПГ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Нарушение правил В/Ч',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан по пунтку правил: За нарушение правил нападения на Войсковую Часть выдаётся предупреждение |[COLOR=rgb(255, 0, 0)]Jail 30 минут  (NonRP нападение) / Warn (Для сотрудников ОПГ)[/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Нападение на В/Ч через стену',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][FONT=Courier New][CENTER]Игрок будет наказан по пунтку правил: Нападение на военную часть разрешено только через блокпост КПП с последовательностью взлома | /Warn NonRP В/Ч[/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'Похищение/Ограбления нарушение правил',
      content:
		'[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][CENTER][I]{{ greeting }}, {{ user.mention }}[/color][/CENTER]' +
        "[Color=rgb(187, 187, 187)][FONT=courier new][CENTER]Игрок будет наказан за Нонрп Ограбление\Похищениее в соответствии с этими правилами [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BE%D0%B3%D1%80%D0%B0%D0%B1%D0%BB%D0%B5%D0%BD%D0%B8%D0%B9-%D0%B8-%D0%BF%D0%BE%D1%85%D0%B8%D1%89%D0%B5%D0%BD%D0%B8%D0%B9.29/']Тык[/URL][/color][/CENTER]" +
		'[Color=rgb(0, 255, 0)][CENTER]Одобрено, закрыто.[/color][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
  ];

  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение','pin');
    addButton('Тех. Специалисту', 'Texy');
    addButton('Закрыто', 'Zakrito');
    addButton('Ответы', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, true));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, true));
    $('button#Texy').click(() => editThreadData(TEXY_PREFIX, true));
    $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, true));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, true));

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
	4 < hours && hours <= 11
	  ? 'Здравствуйте'
	  : 11 < hours && hours <= 15
	  ? 'Здравствуйте'
	  : 15 < hours && hours <= 21
	  ? 'Здравствуйте'
	  : 'Здравствуйте',
};

  }

    function editThreadData(prefix, pin = false) {
// Получаем заголовок темы, так как он необходим при запросе
	const threadTitle = $('.p-title-value')[0].lastChild.textContent;

	if(pin == true){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
              discussion_open: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	} else {
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
               discussion_open: 1,
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
	      discussion_open: 1,
	target_node_id: type,
	FireBrickirect_type: 'none',
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