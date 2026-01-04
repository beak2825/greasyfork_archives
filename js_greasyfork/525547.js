// ==UserScript==
// @name         Lerion RP Официальный Скрипт | Руководство 1.4
// @namespace    https://forum.lerion-rp.ru
// @version      1.4
// @description  Lerion RP Официальный Скрипт
// @author       LERION RP
// @match        https://forum.lerion-rp.ru/*
// @include      https://forum.lerion-rp.ru/
// @grant        none
// @license    MIT
// @icon https://emoji.gg/assets/emoji/9372-blurple-boost-level-9.png
// @downloadURL https://update.greasyfork.org/scripts/525547/Lerion%20RP%20%D0%9E%D1%84%D0%B8%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%7C%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%BE%2014.user.js
// @updateURL https://update.greasyfork.org/scripts/525547/Lerion%20RP%20%D0%9E%D1%84%D0%B8%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%7C%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%BE%2014.meta.js
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
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
		'[Color=Green][CENTER]Одобрено, чс был выдан.[/I][/B][/CENTER][/color][/FONT]',
    }, 
    {
      title: 'Заявление на ЧС отказано нет докв',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый администратор. [/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваше заявление на внесения игрока в Чёрный Список было отказано. [/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN ]Приятной игры на просторах проекта [color=lighgreen] Lerion RP [/color][/FONT][/I][/CENTER] " +
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
		'[Color=Green][CENTER]Отказано, чс не был выдан потому-что отсутствуют доказательства.[/I][/B][/CENTER][/color][/FONT]',
    }, 
    {
      title: 'Заявление на ЧС отказано не по форме',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый администратор. [/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваше заявление на внесения игрока в Чёрный Список было отказано. [/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN ]Приятной игры на просторах проекта [color=lighgreen] Lerion RP [/color][/FONT][/I][/CENTER] " +
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
		'[Color=Green][CENTER]Отказано, чс не был выдан, подайте заявление по форме.[/I][/B][/CENTER][/color][/FONT]',
    }, 
    {
      title: 'Заявление на Неактив Куратора одобрено',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый Куратор Администрации. [/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваше заявление на неактив было одобрено. [/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN ]Приятной игры на просторах проекта [color=lighgreen] Lerion RP [/color][/FONT][/I][/CENTER] " +
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
		'[Color=Green][CENTER]Одобрено, неактив был выдан.[/I][/B][/CENTER][/color][/FONT]',
    }, 
    {
      title: 'Заявление на Неактив Куратора отказ',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый куратор. [/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваше заявление на неактив было отказано. [/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN ]Приятной игры на просторах проекта [color=lighgreen] Lerion RP [/color][/FONT][/I][/CENTER] " +
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
		'[Color=Green][CENTER]Отказано, причину озвучу в личные сообщения в VK.[/I][/B][/CENTER][/color][/FONT]',
    }, 
    {
      title: 'Заявление на Неактив ЗГА/ГА одобрено',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый ЗГА/ГА. [/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваше заявление на неактив было одобрено. [/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN ]Приятной игры на просторах проекта [color=lighgreen] Lerion RP [/color][/FONT][/I][/CENTER] " +
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
		'[Color=Green][CENTER]Одобрено, неактив был выдан.[/I][/B][/CENTER][/color][/FONT]',
    }, 
    {
      title: 'Заявление на Неактив ЗГА/ГА отказ',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый ЗГА/ГА. [/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваше заявление на неактив было отказано. [/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN ]Приятной игры на просторах проекта [color=lighgreen] Lerion RP [/color][/FONT][/I][/CENTER] " +
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
		'[Color=Green][CENTER]Отказано, причину озвучу в личные сообщения в VK.[/I][/B][/CENTER][/color][/FONT]',
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
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
		'[Color=Green][CENTER]Одобрено, неактив был выдан.[/I][/B][/CENTER][/color][/FONT]',
    }, 
    {
      title: 'Заявление на Неактив Админа отказ',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый Администратор. [/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваше заявление на неактив было отказано. [/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN ]Приятной игры на просторах проекта [color=lighgreen] Lerion RP [/color][/FONT][/I][/CENTER] " +
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
		'[Color=Green][CENTER]Отказано, причину озвучу в личные сообщения в VK.[/I][/B][/CENTER][/color][/FONT]',
    }, 
    {
      title: 'Заявление на пропуск собрания одобрено',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый Администратор. [/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваше заявление на пропуск собрания было одобрено. [/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN ]Приятной игры на просторах проекта [color=lighgreen] Lerion RP [/color][/FONT][/I][/CENTER] " +
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
		'[Color=Green][CENTER]Одобрено, пропуск собрания был выдан.[/I][/B][/CENTER][/color][/FONT]',
    }, 
    {
      title: 'Заявление на пропуск собрания отказ',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый Администратор. [/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваше заявление на пропуск собрания было отказано. [/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN ]Приятной игры на просторах проекта [color=lighgreen] Lerion RP [/color][/FONT][/I][/CENTER] " +
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
		'[Color=Green][CENTER]Отказано, причину озвучу в личные сообщения в VK.[/I][/B][/CENTER][/color][/FONT]',
    },
    {
      title: 'Заявление на снятие наказания одобрено',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый Администратор. [/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваше заявление на снятие наказания было одобрено. [/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN ]Приятной игры на просторах проекта [color=lighgreen] Lerion RP [/color][/FONT][/I][/CENTER] " +
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
		'[Color=Green][CENTER]Одобрено, наказания было снято, впредь не нарушайте.[/I][/B][/CENTER][/color][/FONT]',
    }, 
    {
      title: 'Заявление на снятия наказания отказ',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый Администратор. [/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваше заявление на снятия наказания было отказано. [/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN ]Приятной игры на просторах проекта [color=lighgreen] Lerion RP [/color][/FONT][/I][/CENTER] " +
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
		'[Color=Green][CENTER]Отказано, причину озвучу в личные сообщения в VK.[/I][/B][/CENTER][/color][/FONT]',
    },
    {
     title: '- - - - - -  - - - - - - - - -  - - - - - - - - - - - - - - - - - Тех Админы - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'Заявление на Неактив одобрено',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый Технический Специалист. [/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваше заявление на неактив было одобрено. [/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN ]Приятной игры на просторах проекта [color=lighgreen] Lerion RP [/color][/FONT][/I][/CENTER] " +
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
		'[Color=Green][CENTER]Одобрено, неактив был выдан.[/I][/B][/CENTER][/color][/FONT]',
    }, 
    {
      title: 'Заявление на неактив отказ',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый Технический Специалист. [/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваше заявление на неактив было отказано. [/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN ]Приятной игры на просторах проекта [color=lighgreen] Lerion RP [/color][/FONT][/I][/CENTER] " +
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
		'[Color=Green][CENTER]Отказано, причину озвучу в личные сообщения в VK.[/I][/B][/CENTER][/color][/FONT]',
    }, 
    {
      title: 'Заявление на пропуск собрания одобрено',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый Технический Специалист. [/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваше заявление на пропуск собрания было одобрено. [/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN ]Приятной игры на просторах проекта [color=lighgreen] Lerion RP [/color][/FONT][/I][/CENTER] " +
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
		'[Color=Green][CENTER]Одобрено, пропуск собрания был выдан.[/I][/B][/CENTER][/color][/FONT]',
    }, 
    {
      title: 'Заявление на пропуск собрания отказ',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый Технический Специалист. [/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваше заявление на пропуск собрания было отказано. [/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN ]Приятной игры на просторах проекта [color=lighgreen] Lerion RP [/color][/FONT][/I][/CENTER] " +
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
		'[Color=Green][CENTER]Отказано, причину озвучу в личные сообщения в VK.[/I][/B][/CENTER][/color][/FONT]',
    },
    {
      title: 'Заявление на снятие наказания одобрено',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый Технический Специалист. [/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваше заявление на снятие наказания было одобрено. [/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN ]Приятной игры на просторах проекта [color=lighgreen] Lerion RP [/color][/FONT][/I][/CENTER] " +
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
		'[Color=Green][CENTER]Одобрено, наказания было снято, впредь не нарушайте.[/I][/B][/CENTER][/color][/FONT]',
    }, 
    {
      title: 'Заявление на снятия наказания отказ',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый Технический Специалист. [/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваше заявление на снятия наказания было отказано. [/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN ]Приятной игры на просторах проекта [color=lighgreen] Lerion RP [/color][/FONT][/I][/CENTER] " +
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
		'[Color=Green][CENTER]Отказано, причину озвучу в личные сообщения в VK.[/I][/B][/CENTER][/color][/FONT]',
    },
    
    {
     title: '- - - - - -  - - - - - - - - -  - - - - - - - - - - - - - - - - - Тех Раздел - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'На рассмотрение',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок. [/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваша заявка в Технический Раздел была взята на рассмотрение Руководством Проекта, не создавайте одинаковые темы. [/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN ]Приятной игры на просторах проекта [color=lighgreen] Lerion RP [/color][/FONT][/I][/CENTER] " +
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
		'[Color=Green][CENTER]На рассмотрение, закрыто.[/I][/B][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    }, 
    {
      title: 'Одобрено',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок. [/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваша заявка в Технический Раздел была рассмотрена. [/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN ]Приятной игры на просторах проекта [color=lighgreen] Lerion RP [/color][/FONT][/I][/CENTER] " +
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
		'[Color=Green][CENTER]Данный баг был пофикшен, закрыто.[/I][/B][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Отказ не по форме',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
        "[CENTER]Ваша заявка в Технический Раздел создана не по форме.<br> С правилами подачи улучшений можно ознакомиться [URL='https://forum.lerion-rp.ru/index.php?threads/Шаблон-для-подачи-заявки-в-технический-раздел-если-не-по-форме-—-отказ.54/'][COLOR=CRIMSON][U]*Правила подачи*[/U][/COLOR][/URL].[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
            title: 'Дублированное обращение',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Эта тема является копией вашей предыдущей темы. Пожалуйста, не создавайте похожие или одинаковые темы, иначе [COLOR=rgb(255, 255, 255)] Ваш аккаунт на форуме может быть заблокирован.[/COLOR][/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
    },
    {
            title: 'Переустановите игру',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Возможно, в файлы вашей игры были внесены изменения или дополнения.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Рекомендуется полностью удалить лаунчер и связанные файлы, а затем установить игру заново с официального сайта: [URL='lerion-rp.ru']нажмите[/URL][/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(127, 255, 0)][ICODE]Рассмотрено[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: DECIDED_PREFIX,
            status: false,
    },
    {
            title: 'Проблемы с загрузкой форума',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Если вы столкнулись с проблемой загрузки страниц форума, пожалуйста, выполните следующие действия:<br><br>• Откройте Настройки.<br>• Найдите во вкладке Приложения свой браузер, через который вы пользуетесь нашим сайтом форума.<br>• Нажмите на браузер, после чего внизу выберите Очистить -> Очистить Кэш.<br><br>После следуйте данным инструкциям:<br>• Перейдите в настройки браузера.<br>• Выберите Конфиденциальность и безопасность -> Очистить историю.<br>• В основных и дополнительных настройках поставьте галочку в пункте Файлы cookie и данные сайтов.<br>После этого нажмите Удалить данные.<br><br>Ниже прилагаем видео-инструкции описанного процесса для разных браузеров:<br>Для браузера CHROME: https://youtu.be/FaGp2rRru9s<br>Для браузера OPERA: https://youtube.com/shorts/eJOxkc3Br6A?feature=share [/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
    },
    {
            title: 'Проблема известна команде проекта',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Команде проекта уже известно о данной проблеме, она обязательно будет рассмотрена и исправлена. Спасибо за Ваше обращение![/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
    },
    {
            title: 'Не является багом',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Проблема, с которой Вы столкнулись, не является недоработкой/ошибкой сервера.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
    },
    {
            title: 'Передача тестерам',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваша тема передана на тестирование.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url][/CENTER]',
            prefix: PIN_PREFIX,
            status: true,
    },
    {
            title: 'Если не работают ссылки',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]По техническим причинам данное действие невозможно, пожалуйста воспользуйтесь копированием ссылки от сюда:<br>[img]https://i.ibb.co/SX77Fgw/photo-2022-08-20-16-31-57.jpg[/img]<br>Если данный способ не помогает, то используйте сервис сокращения ссылок https://clck.ru<br> Либо попробуйте вот так:<br>1) загрузка скриншота биографии на фотохостинг<br>2) в описание прикрепить ссылку с форума<br>3) скопировать пост с фотохостинга<br><br>2 способ:<br>Сократите ссылки для Ваших скриншотов и RP биографии, сделать можно тут goo.su  также Iformation замените на русский текст, просмотрите еще текст полностью и постарайтесь уменьшить такие знаки как !<br>goo.su[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
    },
    {
            title: 'Сервер не отвечает',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Если у Вас встречаются такие проблемы, как «Сервер не отвечает», не отображаются сервера в лаунчере, не удаётся выполнить вход на сайт/форум, попробуйте совершить следующие действия:<br>1) менить IP-адрес любыми средствами<br>2) Переключиться на Wi-Fi/мобильный интернет или на любую доступную сеть<br>3) Использование VPN <br>4) Перезагрузка роутера<br><br>Если методы выше не помогли, то переходим к следующим шагам:<br>1) Устанавливаем приложение «1.1.1.1: Faster & Safer Internet» Ссылка: https://clck.ru/ZP6Av и переходим в него.<br>2)Соглашаемся со всей политикой приложения.<br>3) Нажимаем на ползунок и ждем, когда текст изменится на «Подключено». <br>4) Проверяем: Отображаются ли серверы? Удается ли выполнить вход в игру? Работают ли другие источники (сайт, форум)?[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Включение продемонстрировано на видео: https://youtu.be[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
    },
    {
            title: 'Кикнули за ПО',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Уважаемый игрок, если вы были отключены от сервера Античитом<br><br>[COLOR=rgb(255, 0, 0)]Пример[/COLOR]:<br><br> [IMG]https://i.ibb.co/FXXrcVS/image.png[/IMG],<br>пожалуйста, обратите внимания на значения PacketLoss и Ping.<br><br>PacketLoss - минимальное значение 0.000000, максимальное 1.000000. При показателе, выше нуля, это означает, что у вас происходит задержка/потеря передаваемых пакетов информации на сервер. Это означает, что ваш интернет не передает достаточное количество данных из вашего устройства на наш сервер, в следствие чего система отключает вас от игрового процесса.<br><br>Ping - Чем меньше значение в данном пункте, тем быстрее передаются данные на сервер, и наоборот. Если значение выше 100, вы можете наблюдать отставания в игровом процессе из-за нестабильности интернет-соединения.<br><br>Если вы не заметили проблем в данных пунктах, скорее всего - у вас произошел скачек пинга при выполнении действия в игре, в таком случае, античит также отключает игрока из-за подозрения в использовании посторонних программ.<br><br>Решение данной проблемы: постарайтесь стабилизировать ваше интернет-соединение, при необходимости - сообщите о проблемах своему провайдеру (поставщику услуг интернета).[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
    },
    {
            title: 'Нет фото/видеофиксации',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Без доказательств (в частности скриншоты или видео) – решить проблему не получится. Если доказательства найдутся - создайте новую тему, приложив доказательства с фото-хостинга: [URL='https://yapx.ru/']yapx.ru[/URL],[URL='https://imgur.com/']imgur.com[/URL],[URL='https://www.youtube.com/']youtube.com[/URL],[URL='https://imgbb.com']ImgBB.com[/URL](все кликабельно).[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
    },
    {
            title: 'Баг будет исправлен',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Данная недоработка будет проверена и исправлена. Спасибо, ценим Ваш вклад в развите проекта.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(127, 255, 0)][ICODE]Рассмотрено[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: WATCHED_PREFIX,
            status: false,
    },
    {
            title: 'По крашам/вылетам',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваш запрос о вылетах был получен. Данные о вылетах отправляются разработчикам автоматически, поэтому дублирование их в техническом разделе не требуется.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Если возникли проблемы с подключением к игре, то в ближайшее время они будут решены. [/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Отказано[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
    },
    {
            title: 'По предложениям по улучшению',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url][/CENTER]<br>' +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)][ICODE]{{ user.name }}[/ICODE][/COLOR].[/CENTER][/SIZE]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][SIZE=15px]Ваша тема не относится к технической проблеме, если вы хотите предложить изменения в игровом моде - обратитесь в раздел <br> [URL='https://forum.lerion-rp.ru/index.php?forums/Предложения-по-улучшению.6/']Предложения по улучшению → нажмите сюда[/URL][/SIZE][/FONT][/COLOR][/CENTER]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url][/CENTER]<br>' +
            '[CENTER][SIZE=15px][COLOR=rgb(255, 0, 0)][ICODE]Закрыто[/ICODE][/SIZE][/CENTER][/COLOR]',
            prefix: CLOSE_PREFIX,
            status: false,
    },

    {
     title: '- - - - - -  - - - - - - - - -  - - - - - - - - - - - - - - - - - Улучшения - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'На рассмотрение',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок. [/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваше улучшение было взято на рассмотрение, не создавайте одинаковые темы. [/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN ]Приятной игры на просторах проекта [color=lighgreen] Lerion RP [/color][/FONT][/I][/CENTER] " +
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
		'[Color=Green][CENTER]На рассмотрение, закрыто.[/I][/B][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    }, 
    {
      title: 'В реализацию',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок. [/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваше улучшение было взято в реализацию, не создавайте одинаковые темы. [/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN ]Приятной игры на просторах проекта [color=lighgreen] Lerion RP [/color][/FONT][/I][/CENTER] " +
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
		'[Color=Green][CENTER]Было взято в реализацию, закрыто.[/I][/B][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    }, 
    {
      title: 'Реализовано',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок. [/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваше улучшение было реализовано, спасибо вам за улучшение. [/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN ]Приятной игры на просторах проекта [color=lighgreen] Lerion RP [/color][/FONT][/I][/CENTER] " +
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
		'[Color=Green][CENTER]Было взято в реализацию, закрыто.[/I][/B][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    }, 
    {
      title: 'Улучшение не по форме',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
        "[CENTER]Ваше улучшение было создано не по форме.<br> С правилами подачи улучшений можно ознакомиться [URL='https://forum.lerion-rp.ru/index.php?threads/Правила-создания-темы.55/'][COLOR=CRIMSON][U]*Правила подачи*[/U][/COLOR][/URL].[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Уже реализовано',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок. [/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Ваше улучшение уже было реализовано. [/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN ]Приятной игры на просторах проекта [color=lighgreen] Lerion RP [/color][/FONT][/I][/CENTER] " +
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    }, 

    {
     title: '- - - - - -  - - - - - - - - -  - - - - - - - - - - - - - - - - - Жалобы на администрацию - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'Будет беседа с админом',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок. [/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]С администратором будет проведена строгая беседа. Спасибо за Ваше обращение. [/B][/I][/FONT][/CENTER]"+
        "[CENTER][I][FONT=TIMES NEW ROMAN ]Приятной игры на просторах проекта [color=lighgreen] Lerion RP [/color][/FONT][/I][/CENTER] " +
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
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
      title: 'ЖБ на рассмотрении',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][font=times new roman] Запрошу доказательства у администратора.<br> Ожидайте вынесения вердикта и не создавайте копии данной темы.[/font][/CENTER]<br>" +
	"[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+	
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
	"[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+	
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
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
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
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
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
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
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
               "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ЖБ не по форме',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба составлена не по форме.<br> С правилами подачи жалоб/обжалований можно ознакомиться  [URL='https://forum.lerion-rp.ru/index.php?threads/Правила-и-форма-для-подачи-заявления-на-амнистию.142/'][COLOR=CRIMSON][U]*тут*[/U][/COLOR][/URL].[/CENTER]", 
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В обжалования',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Вы ошиблись разделом.<br> С правилами подачи жалоб/обжалований можно ознакомиться  [URL='https://forum.lerion-rp.ru/index.php?threads/Правила-и-форма-для-подачи-заявления-на-амнистию.142/'][COLOR=CRIMSON][U]*тут*[/U][/COLOR][/URL].[/CENTER]"+
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
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
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
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+		"[CENTER][FONT=GEORGIA] Приятной игры на просторах проекта[COLOR=lightgreen]Lerion RP[/COLOR][/FONT][/CENTER] " , 
      prefix: SPECY_PREFIX,
	  status: true,
    },
    {
      title: 'В тех. раздел',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Вы ошиблись разделом.<br>Обратитесь в [URL='https://forum.lerion-rp.ru/index.php?forums/Технический-раздел.9/']*тех.раздел*[/URL].[/CENTER]<br>" +
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]'+
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
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
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
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
		"[CENTER][font=times new roman] На ваших доказательствах отсутствует /time.[/font][/CENTER]<br> С правилами подачи жалоб можно ознакомиться  [URL='https://forum.lerion-rp.ru/index.php?threads/Правила-подачи-жалоб-на-администрацию.27/'][COLOR=CRIMSON][U]*тут*[/U][/COLOR][/URL]"+
		'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color]'+
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
		"[center][FONT=GEORGIA] Приятной игры на просторах сервера [COLOR=lightgreen] Lerion RP[/COLOR][/FONT][/center]" , 
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Док-ва в соц. сетях',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Прикрепление доказательств обязательно. Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER]<br> С правилами подачи жалоб можно ознакомиться  [URL='https://forum.lerion-rp.ru/index.php?threads/Правила-подачи-жалоб-на-администрацию.27/'][COLOR=CRIMSON][U]*тут*[/U][/COLOR][/URL]."+
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]'+
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
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
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
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
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
		"[CENTER][FONT=GEORGIA] Приятной игры на просторах проекта[COLOR=lightgreen] Lerion RP[/COLOR][/FONT][/CENTER] " , 
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '- - - - - -  - - - - - - - - -  - - - - - - - - - - - - - - - - - - - Обжалования наказаний - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'Срок снижен до 30 дней',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Срок блокировки аккаунта будет снижен до 30 дней.<br> С момента разблокировки аккаунта, не повторяйте подобных действий.<br>Приятной игры на просторах проекта[COLOR=LIGHTGREEN]Lerion RP[/color].[/CENTER]<br>" +
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Срок снижен до 15 дней',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Срок блокировки аккаунта будет снижен до 15 дней.<br> С момента разблокировки аккаунта, не повторяйте подобных действий.<br>Приятной игры на просторах проекта[COLOR=LIGHTGREEN]Lerion RP[/color].[/CENTER]<br>" +
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Срок снижен до 7 дней',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Срок блокировки аккаунта будет снижен до 7 дней.<br> С момента разблокировки аккаунта, не повторяйте подобных действий.<br>Приятной игры на просторах проекта[color=lightgreen]Lerion R{[/color].[/CENTER]<br>" +
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Срок снижен до 3 дней',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Срок блокировки аккаунта будет снижен до 3 дней.<br> С момента разблокировки аккаунта, не повторяйте подобных действий.<br>Приятной игры на просторах проекта[color=lightgreen]Lerion RP[/color].[/CENTER]<br>" +
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
		'[Color=Green][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Обж отказано',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]К сожалению, вам отказано в смягчении наказания.<br> Не расстраивайтесь и всего вам доброго.<br> Приятной игры на просторах проекта[color=lightgreen] Lerion RP[/color].[/CENTER]<br>" +
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
		'[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '24ч на возврат имущества',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Тема будет находится в закреплении, у вас есть 24 часа на возвращение имущества, и предъявления видеофиксации.<br> Обманутая сторона также может отписать о возвращении оговоренного имущества.[/CENTER]<br>" +
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+		
                '[Color=Orange][CENTER]На рассмотрении...[/I][/CENTER][/color][/FONT]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'В ЖБ на адм',
      content:
		'[Color=Cyan][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER]Вы ошиблись разделом.<br>Обратитесь в раздел [URL='https://forum.lerion-rp.ru/index.php?threads/Правила-подачи-жалоб-на-администрацию.27/']*жалобы на администрацию*[/URL]. Приятной игры на просторах проекта[color=lightgreen] Lerion RP[/color].[/CENTER]<br>" +
                "[url=https://postimages.org/][img]https://i.postimg.cc/Z5S1QFJk/LerionRP.png[/img][/url]<br>"+
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