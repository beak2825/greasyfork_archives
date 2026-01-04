// ==UserScript==
// @name         Lerion RP Официальный Скрипт | Курация администрации 3.0
// @namespace    https://forum.lerion-rp.ru
// @version      3.0
// @description  Lerion RP Официальный Скрипт
// @author       LERION RP
// @match        https://forum.lerion-rp.ru/*
// @include      https://forum.lerion-rp.ru/
// @grant        none
// @license    MIT
// @icon https://emoji.gg/assets/emoji/9372-blurple-boost-level-9.png
// @downloadURL https://update.greasyfork.org/scripts/525525/Lerion%20RP%20%D0%9E%D1%84%D0%B8%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%7C%20%D0%9A%D1%83%D1%80%D0%B0%D1%86%D0%B8%D1%8F%20%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D0%B8%2030.user.js
// @updateURL https://update.greasyfork.org/scripts/525525/Lerion%20RP%20%D0%9E%D1%84%D0%B8%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%7C%20%D0%9A%D1%83%D1%80%D0%B0%D1%86%D0%B8%D1%8F%20%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D0%B8%2030.meta.js
// ==/UserScript==
 
(function ()  {
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
     title: '- - - - - -  - - - - - - - - -  - - - - - - - - - - - - - - - - - Административные Руководство - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'Заявление на ЧС одобрено',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый администратор. [/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваше заявление на внесения игрока в Чёрный Список было одобрено. [/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN ]Приятной игры на просторах проекта [color=lighgreen] Lerion RP [/color][/FONT][/I][/CENTER] " +
                "[url=https://postimages.org/][img]https://i.postimg.cc/pVzWfFKJ/etl-Os-MImk-Zs-1-preview-rev-1.png[/img][/url]<br>"+
		'[Color=Green][CENTER]Одобрено, чс был выдан.[/I][/B][/CENTER][/color][/FONT]',
    }, 
    {
      title: 'Заявление на ЧС отказано нет докв',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый администратор. [/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваше заявление на внесения игрока в Чёрный Список было отказано. [/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN ]Приятной игры на просторах проекта [color=lighgreen] Lerion RP [/color][/FONT][/I][/CENTER] " +
                "[url=https://postimages.org/][img]https://i.postimg.cc/pVzWfFKJ/etl-Os-MImk-Zs-1-preview-rev-1.png[/img][/url]<br>"+
		'[Color=Red][CENTER]Отказано, чс не был выдан потому-что отсутствуют доказательства.[/I][/B][/CENTER][/color][/FONT]',
    }, 
    {
      title: 'Заявление на ЧС отказано не по форме',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый администратор. [/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваше заявление на внесения игрока в Чёрный Список было отказано. [/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN ]Приятной игры на просторах проекта [color=lighgreen] Lerion RP [/color][/FONT][/I][/CENTER] " +
                "[url=https://postimages.org/][img]https://i.postimg.cc/pVzWfFKJ/etl-Os-MImk-Zs-1-preview-rev-1.png[/img][/url]<br>"+
		'[Color=Red][CENTER]Отказано, чс не был выдан, подайте заявление по форме.[/I][/B][/CENTER][/color][/FONT]',
    }, 
    {
      title: 'Заявление на Неактив Куратора одобрено',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый Куратор Администрации. [/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваше заявление на неактив было одобрено. [/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN ]Приятной игры на просторах проекта [color=lighgreen] Lerion RP [/color][/FONT][/I][/CENTER] " +
                "[url=https://postimages.org/][img]https://i.postimg.cc/pVzWfFKJ/etl-Os-MImk-Zs-1-preview-rev-1.png[/img][/url]<br>"+
		'[Color=Green][CENTER]Одобрено, неактив был выдан.[/I][/B][/CENTER][/color][/FONT]',
    }, 
    {
      title: 'Заявление на Неактив Куратора отказ',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый куратор. [/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваше заявление на неактив было отказано. [/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN ]Приятной игры на просторах проекта [color=lighgreen] Lerion RP [/color][/FONT][/I][/CENTER] " +
                "[url=https://postimages.org/][img]https://i.postimg.cc/pVzWfFKJ/etl-Os-MImk-Zs-1-preview-rev-1.png[/img][/url]<br>"+
		'[Color=Red][CENTER]Отказано, причину озвучу в личные сообщения в VK.[/I][/B][/CENTER][/color][/FONT]',
    }, 
    {
      title: 'Заявление на Неактив ЗГА/ГА одобрено',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый ЗГА/ГА. [/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваше заявление на неактив было одобрено. [/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN ]Приятной игры на просторах проекта [color=lighgreen] Lerion RP [/color][/FONT][/I][/CENTER] " +
                "[url=https://postimages.org/][img]https://i.postimg.cc/pVzWfFKJ/etl-Os-MImk-Zs-1-preview-rev-1.png[/img][/url]<br>"+
		'[Color=Green][CENTER]Одобрено, неактив был выдан.[/I][/B][/CENTER][/color][/FONT]',
    }, 
    {
      title: 'Заявление на Неактив ЗГА/ГА отказ',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый ЗГА/ГА. [/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваше заявление на неактив было отказано. [/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN ]Приятной игры на просторах проекта [color=lighgreen] Lerion RP [/color][/FONT][/I][/CENTER] " +
                "[url=https://postimages.org/][img]https://i.postimg.cc/pVzWfFKJ/etl-Os-MImk-Zs-1-preview-rev-1.png[/img][/url]<br>"+
		'[Color=Red][CENTER]Отказано, причину озвучу в личные сообщения в VK.[/I][/B][/CENTER][/color][/FONT]',
    }, 

    {
     title: '- - - - - -  - - - - - - - - -  - - - - - - - - - - - - - - - - - Административные - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'Заявление на Неактив Админа одобрено',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый Администратор. [/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваше заявление на неактив было одобрено. [/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN ]Приятной игры на просторах проекта [color=lighgreen] Lerion RP [/color][/FONT][/I][/CENTER] " +
                "[url=https://postimages.org/][img]https://i.postimg.cc/pVzWfFKJ/etl-Os-MImk-Zs-1-preview-rev-1.png[/img][/url]<br>"+
		'[Color=Green][CENTER]Одобрено, неактив был выдан.[/I][/B][/CENTER][/color][/FONT]',
    }, 
    {
      title: 'Заявление на Неактив Админа отказ',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый Администратор. [/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваше заявление на неактив было отказано. [/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN ]Приятной игры на просторах проекта [color=lighgreen] Lerion RP [/color][/FONT][/I][/CENTER] " +
                "[url=https://postimages.org/][img]https://i.postimg.cc/pVzWfFKJ/etl-Os-MImk-Zs-1-preview-rev-1.png[/img][/url]<br>"+
		'[Color=Red][CENTER]Отказано, причину озвучу в личные сообщения в VK.[/I][/B][/CENTER][/color][/FONT]',
    }, 
    {
      title: 'Заявление на пропуск собрания одобрено',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый Администратор. [/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваше заявление на пропуск собрания было одобрено. [/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN ]Приятной игры на просторах проекта [color=lighgreen] Lerion RP [/color][/FONT][/I][/CENTER] " +
                "[url=https://postimages.org/][img]https://i.postimg.cc/pVzWfFKJ/etl-Os-MImk-Zs-1-preview-rev-1.png[/img][/url]<br>"+
		'[Color=Green][CENTER]Одобрено, пропуск собрания был выдан.[/I][/B][/CENTER][/color][/FONT]',
    }, 
    {
      title: 'Заявление на пропуск собрания отказ',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый Администратор. [/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваше заявление на пропуск собрания было отказано. [/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN ]Приятной игры на просторах проекта [color=lighgreen] Lerion RP [/color][/FONT][/I][/CENTER] " +
                "[url=https://postimages.org/][img]https://i.postimg.cc/pVzWfFKJ/etl-Os-MImk-Zs-1-preview-rev-1.png[/img][/url]<br>"+
		'[Color=Red][CENTER]Отказано, причину озвучу в личные сообщения в VK.[/I][/B][/CENTER][/color][/FONT]',
    },
    {
      title: 'Заявление на снятие наказания одобрено',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый Администратор. [/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваше заявление на снятие наказания было одобрено. [/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN ]Приятной игры на просторах проекта [color=lighgreen] Lerion RP [/color][/FONT][/I][/CENTER] " +
                "[url=https://postimages.org/][img]https://i.postimg.cc/pVzWfFKJ/etl-Os-MImk-Zs-1-preview-rev-1.png[/img][/url]<br>"+
		'[Color=Green][CENTER]Одобрено, наказания было снято, впредь не нарушайте.[/I][/B][/CENTER][/color][/FONT]',
    }, 
    {
      title: 'Заявление на снятия наказания отказ',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый Администратор. [/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваше заявление на снятия наказания было отказано. [/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN ]Приятной игры на просторах проекта [color=lighgreen] Lerion RP [/color][/FONT][/I][/CENTER] " +
                "[url=https://postimages.org/][img]https://i.postimg.cc/pVzWfFKJ/etl-Os-MImk-Zs-1-preview-rev-1.png[/img][/url]<br>"+
		'[Color=Red][CENTER]Отказано, причину озвучу в личные сообщения в VK.[/I][/B][/CENTER][/color][/FONT]',
    },

    {
     title: '- - - - - -  - - - - - - - - -  - - - - - - - - - - - - - - - - - Жалобы на администрацию - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'На рассмотрение',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][font=times new roman] Ваша жалоба была взята в рассмотрение.<br> Ожидайте вынесения вердикта и не создавайте копии данной темы.[/font][/CENTER]<br>" +
	"[url=https://postimages.org/][img]https://i.postimg.cc/pVzWfFKJ/etl-Os-MImk-Zs-1-preview-rev-1.png[/img][/url]<br>"+	
        '[Color=Orange][CENTER] На рассмотрении...[/I][/CENTER][/color][/FONT]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'Будет беседа с админом',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок. [/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]С администратором будет проведена строгая беседа. Спасибо за Ваше обращение. [/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN ]Приятной игры на просторах проекта [color=lighgreen] Lerion RP [/color][/FONT][/I][/CENTER] " +
                "[url=https://postimages.org/][img]https://i.postimg.cc/pVzWfFKJ/etl-Os-MImk-Zs-1-preview-rev-1.png[/img][/url]<br>"+
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/B][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    }, 
    {
      title: 'Будет беседа с админом и наказание будет снято',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]С администратором будет проведена строгая беседа.<br> Ваше наказание будет снято в течение нескольких часов.<br> Спасибо за Ваше обращение.[/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN] Приятной игры на просторах проекта [color=lightgreen]Lerion RP[/color]. [/FONT][/I][/CENTER] " +
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Запрошу док-ву',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][font=times new roman] Запрошу доказательства у администратора.<br> Ожидайте вынесения вердикта и не создавайте копии данной темы.[/font][/CENTER]<br>" +
	"[url=https://postimages.org/][img]https://i.postimg.cc/pVzWfFKJ/etl-Os-MImk-Zs-1-preview-rev-1.png[/img][/url]<br>"+	
        '[Color=Orange][CENTER] На рассмотрении...[/I][/CENTER][/color][/FONT]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'С момента выдачи наказания более 24ч',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][font=times new roman]Срок написания жалобы составляет один день (24 часа) с момента совершенного нарушения со стороны администратора сервера.[/font][/center]"+
        "[center][font=georgia]Приятной игры на просторах проекта[color=lightgreen] Lerion RP[/color].[/font][/CENTER]<br>" +
	"[url=https://postimages.org/][img]https://i.postimg.cc/pVzWfFKJ/etl-Os-MImk-Zs-1-preview-rev-1.png[/img][/url]<br>"+	
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Адм предоставил док-ва',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][font=times new roman] Администратор предоставил доказательства, наказание выдано верно.[/font][/center]"+
       "[CENTER][FONT=GEORGIA]Приятной игры на просторах проекта[color=lightgreen] Lerion RP[/color].[/FONT][/CENTER]<br>" +
                "[url=https://postimages.org/][img]https://i.postimg.cc/pVzWfFKJ/etl-Os-MImk-Zs-1-preview-rev-1.png[/img][/url]<br>"+
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'дата в жб отличается от даты в скрине',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][font=times new roman] Дата указанная в жалобе, отличается от даты на скриншоте.[/font] [/center]"+
        "[CENTER][font=times new roman] Приятной игры на просторах проекта Lerion RP.[/font][/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Недостаточно док-в',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][font=times new roman] Недостаточно доказательств нарушения со стороны администратора.<br>Благодарим вас за ваше обращение.<br>[/font] [/center]"+
        "[CENTER][font=times new roman] Приятной игры на просторах проекта[color=lightgreen] Lerion RP[/color].[/font][/CENTER]<br>" +
                "[url=https://postimages.org/][img]https://i.postimg.cc/pVzWfFKJ/etl-Os-MImk-Zs-1-preview-rev-1.png[/img][/url]<br>"+
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нарушений со стороны адм нет',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][font=times new roman] Нарушений со стороны администратора не было найдено.[/font][/center]"+
        "[center][font=times new roman] Приятной игры на просторах проекта[color=lightgreen] Lerion RP[/color].[/font][/CENTER]<br>" +
                "[url=https://postimages.org/][img]https://i.postimg.cc/pVzWfFKJ/etl-Os-MImk-Zs-1-preview-rev-1.png[/img][/url]<br>"+
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нужен Скрин бана',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][font=times new roman] Как доказательство прикладывается скриншот окна бана при входе на сервер.<br> Подайте новую жалобу и прикрепите такой скриншот, если он у вас имеется.<br> Благодарим вас за обращение.[/font][/center]"+
        "[center][font=times new roman] Приятной игры на просторах проекта[color=lightgreen] Lerion RP[/color].[/font][/CENTER]<br>" +
               "[url=https://postimages.org/][img]https://i.postimg.cc/pVzWfFKJ/etl-Os-MImk-Zs-1-preview-rev-1.png[/img][/url]<br>"+
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ЖБ не по форме',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба составлена не по форме.<br> С правилами подачи жалоб/обжалований можно ознакомиться  [URL='https://forum.lerion-rp.ru/index.php?threads/Правила-подачи-заявки-на-обжалование-наказания.41/'][COLOR=CRIMSON][U]*тут*[/U][/COLOR][/URL].[/CENTER]", 
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В обжалования',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Вы ошиблись разделом.<br> С правилами подачи жалоб/обжалований можно ознакомиться  [URL='https://forum.lerion-rp.ru/index.php?forums/Обжалование-наказаний.41/'][COLOR=CRIMSON][U]*тут*[/U][/COLOR][/URL].[/CENTER]"+
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
 
    {
      title: 'Передано ГА',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба была передана на рассмотрение Главному Администратору.<br>Ожидайте вынесения вердикта и не создавайте копии данной темы.[/CENTER]<br>" +
		'[Color=Flame][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]'+
                "[url=https://postimages.org/][img]https://i.postimg.cc/pVzWfFKJ/etl-Os-MImk-Zs-1-preview-rev-1.png[/img][/url]<br>"+
		"[CENTER][FONT=GEORGIA] Приятной игры на просторах проекта[COLOR=lightgreen]Lerion RP[/COLOR][/FONT][/CENTER] " , 
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'Передано Руководству Проекта',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба была передана на рассмотрение Руководству Проекта.<br> Ожидайте вынесения вердикта и не создавайте копии данной темы.[/CENTER]<br>" +
		'[Color=Flame][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]'+
                "[url=https://postimages.org/][img]https://i.postimg.cc/pVzWfFKJ/etl-Os-MImk-Zs-1-preview-rev-1.png[/img][/url]<br>"+		"[CENTER][FONT=GEORGIA] Приятной игры на просторах проекта[COLOR=lightgreen]Lerion RP[/COLOR][/FONT][/CENTER] " , 
      prefix: SPECY_PREFIX,
	  status: true,
    },
    {
      title: 'В тех. раздел',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Вы ошиблись разделом.<br>Обратитесь в [URL='https://forum.lerion-rp.ru/index.php?forums/Технический-раздел.7/']*тех.раздел*[/URL].[/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]'+
                "[url=https://postimages.org/][img]https://i.postimg.cc/pVzWfFKJ/etl-Os-MImk-Zs-1-preview-rev-1.png[/img][/url]<br>"+
		"[CENTER][FONT=GEORGIA] Приятной игры на просторах проекта[COLOR=lightgreen] Lerion RP[/COLOR][/FONT][/CENTER] " , 
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Дублирование темы',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Дублирование темы.<br>При дальнейшем дублировании подобных жалоб, ваш форумный аккаунт будет заблокирован за нарушение правил пользования форумом.[/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]'+
                "[url=https://postimages.org/][img]https://i.postimg.cc/pVzWfFKJ/etl-Os-MImk-Zs-1-preview-rev-1.png[/img][/url]<br>"+
		"[CENTER][FONT=GEORGIA] Приятной игры на просторах проекта[COLOR=lightgreen] Lerion RP[/COLOR][/FONT][/CENTER] " , 
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ошиблись разделом',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Вы ошиблись сервером/разделом, переподайте жалобу в нужный раздел.[/CENTER]<br>"+
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ЖБ от 3-го лица',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Жалобы от 3-их лиц не принимаются.[/CENTER]" +
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]'+
		"[CENTER][FONT=GEORGIA] Приятной игры на просторах проекта[COLOR=lightgreen] Lerion RP[/COLOR][/FONT][/CENTER] " , 
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Нету /time',
	  content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER][font=times new roman] На ваших доказательствах отсутствует /time.[/font][/CENTER]<br> С правилами подачи жалоб можно ознакомиться  [URL='https://forum.lerion-rp.ru/index.php?threads/Правила-подачи-жалоб-на-администрацию.35/'][COLOR=CRIMSON][U]*тут*[/U][/COLOR][/URL]"+
		'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color]'+
                "[url=https://postimages.org/][img]https://i.postimg.cc/pVzWfFKJ/etl-Os-MImk-Zs-1-preview-rev-1.png[/img][/url]<br>"+
		"[center][FONT=GEORGIA] Приятной игры на просторах сервера [COLOR=lightgreen] Lerion RP[/COLOR][/FONT][/center]" , 
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Док-ва в соц. сетях',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Прикрепление доказательств обязательно. Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER]<br> С правилами подачи жалоб можно ознакомиться  [URL='https://forum.lerion-rp.ru/index.php?threads/Правила-подачи-жалоб-на-администрацию.35/'][COLOR=CRIMSON][U]*тут*[/U][/COLOR][/URL]."+
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]'+
                "[url=https://postimages.org/][img]https://i.postimg.cc/pVzWfFKJ/etl-Os-MImk-Zs-1-preview-rev-1.png[/img][/url]<br>"+
		"[CENTER][FONT=GEORGIA] Приятной игры на просторах проекта[COLOR=lightgreen] Lerion RP[/COLOR][/FONT][/CENTER] " , 
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не работают док-ва',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Не работают доказательства.[/CENTER]<br>" +
		'[Color=Flame][CENTER]Закрыто.[/I][/CENTER][/color][/FONT]'+
                "[url=https://postimages.org/][img]https://i.postimg.cc/pVzWfFKJ/etl-Os-MImk-Zs-1-preview-rev-1.png[/img][/url]<br>"+
		"[CENTER][FONT=GEORGIA] Приятной игры на просторах проекта[COLOR=lightgreen] Lerion RP[/COLOR][/FONT][/CENTER] " , 
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Док-ва отредактированы',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваши доказательства отредактированы.[/CENTER]<br> С правилами подачи жалоб можно ознакомиться  [URL='https://forum.lerion-rp.ru/index.php?threads/Правила-подачи-жалоб-на-администрацию.27/'][COLOR=CRIMSON][U]*тут*[/U][/COLOR][/URL]."+
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]'+
                "[url=https://postimages.org/][img]https://i.postimg.cc/pVzWfFKJ/etl-Os-MImk-Zs-1-preview-rev-1.png[/img][/url]<br>"+
		"[CENTER][FONT=GEORGIA] Приятной игры на просторах проекта[COLOR=lightgreen] Lerion RP[/COLOR][/FONT][/CENTER] " , 
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '- - - - - -  - - - - - - - - -  - - - - - - - - - - - - - - - - - - - Обжалования наказаний - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'На рассмотрение',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][font=times new roman] Ваше обжалование взято в рассмотрение.<br> Ожидайте вынесения вердикта и не создавайте копии данной темы.[/font][/CENTER]<br>" +
	"[url=https://postimages.org/][img]https://i.postimg.cc/pVzWfFKJ/etl-Os-MImk-Zs-1-preview-rev-1.png[/img][/url]<br>"+	
        '[Color=Orange][CENTER] На рассмотрении...[/I][/CENTER][/color][/FONT]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'Срок снижен до 30 дней',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Срок блокировки аккаунта будет снижен до 30 дней.<br> С момента разблокировки аккаунта, не повторяйте подобных действий.<br>Приятной игры на просторах проекта[COLOR=LIGHTGREEN]Lerion RP[/color].[/CENTER]<br>" +
                "[url=https://postimages.org/][img]https://i.postimg.cc/pVzWfFKJ/etl-Os-MImk-Zs-1-preview-rev-1.png[/img][/url]<br>"+
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Срок снижен до 15 дней',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Срок блокировки аккаунта будет снижен до 15 дней.<br> С момента разблокировки аккаунта, не повторяйте подобных действий.<br>Приятной игры на просторах проекта[COLOR=LIGHTGREEN]Lerion RP[/color].[/CENTER]<br>" +
                "[url=https://postimages.org/][img]https://i.postimg.cc/pVzWfFKJ/etl-Os-MImk-Zs-1-preview-rev-1.png[/img][/url]<br>"+
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Срок снижен до 7 дней',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Срок блокировки аккаунта будет снижен до 7 дней.<br> С момента разблокировки аккаунта, не повторяйте подобных действий.<br>Приятной игры на просторах проекта[color=lightgreen]Lerion R{[/color].[/CENTER]<br>" +
                "[url=https://postimages.org/][img]https://i.postimg.cc/pVzWfFKJ/etl-Os-MImk-Zs-1-preview-rev-1.png[/img][/url]<br>"+
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Срок снижен до 3 дней',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Срок блокировки аккаунта будет снижен до 3 дней.<br> С момента разблокировки аккаунта, не повторяйте подобных действий.<br>Приятной игры на просторах проекта[color=lightgreen]Lerion RP[/color].[/CENTER]<br>" +
                "[url=https://postimages.org/][img]https://i.postimg.cc/pVzWfFKJ/etl-Os-MImk-Zs-1-preview-rev-1.png[/img][/url]<br>"+
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Обж отказано',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]К сожалению, вам отказано в смягчении наказания.<br> Не расстраивайтесь и всего вам доброго.<br> Приятной игры на просторах проекта[color=lightgreen] Lerion RP[/color].[/CENTER]<br>" +
                "[url=https://postimages.org/][img]https://i.postimg.cc/pVzWfFKJ/etl-Os-MImk-Zs-1-preview-rev-1.png[/img][/url]<br>"+
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '24ч на возврат имущества',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Тема будет находится в закреплении, у вас есть 24 часа на возвращение имущества, и предъявления видеофиксации.<br> Обманутая сторона также может отписать о возвращении оговоренного имущества.[/CENTER]<br>" +
                "[url=https://postimages.org/][img]https://i.postimg.cc/pVzWfFKJ/etl-Os-MImk-Zs-1-preview-rev-1.png[/img][/url]<br>"+		
                '[Color=Orange][CENTER]На рассмотрении...[/I][/CENTER][/color][/FONT]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'В ЖБ на адм',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Вы ошиблись разделом.<br>Обратитесь в раздел [URL='https://forum.lerion-rp.ru/index.php?forums/Жалоба-на-администрацию.17/']*жалобы на администрацию*[/URL]. Приятной игры на просторах проекта[color=lightgreen] Lerion RP[/color].[/CENTER]<br>" +
                "[url=https://postimages.org/][img]https://i.postimg.cc/pVzWfFKJ/etl-Os-MImk-Zs-1-preview-rev-1.png[/img][/url]<br>"+
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
  ];
 
  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
    // Добавление кнопок при загрузке страницы
    addButton('Ответы', 'selectAnswer');
 
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