// ==UserScript==
// @name         Script for КФ
// @namespace    https://forum.blackrussia.online/
// @version      1.4
// @description  new gen for КФ by Xwello <3
// @author       Neko_Xwello
// @match        https://forum.blackrussia.online/threads/*
// @inaclude      https://forum.blackrussia.online/threads/
// @match        https://forum.blackrussia.online/forums*
// @include      https://forum.blackrussia.online/forums
// @grant        none
// @license 	 KF
// @collaborator Kuk
// @icon https://avatars.mds.yandex.net/i?id=e7371f38fb4d7fe174b4362d628c7f74-4988204-images-thumbs&n=13
// @copyright 2021, Kuk (https://openuserjs.org/users/Kuk)
// @downloadURL https://update.greasyfork.org/scripts/517203/Script%20for%20%D0%9A%D0%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/517203/Script%20for%20%D0%9A%D0%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const VAJNO_PREFIX = 1;
    const NARASSSMOTRENII_PREFIX = 2;
    const BEZPREFIXA_PREFIX = 3;
    const OTKAZANO_PREFIX = 4;
    const REALIZOVANNO_PREFIX = 5;
    const RESHENO_PREFIX = 6;
    const ZAKRITO_PREFIX = 7;
    const ODOBRENO_PREFIX = 8;
    const RASSMORTENO_PREFIX = 9;
    const KOMANDEPROEKTA_PREFIX = 10;
    const SPECADMINY_PREFIX = 11;
    const GLAVNOMYADMINY_PREFIX = 12;
    const TEXSPECY_PREFIX = 13;
    const OJIDANIE_PREFIX = 14;
    const PROVERENOKONTRKACH_PREFIX = 15;
    const buttons = [
        {
        title: 'Приветствие',
        content:
        '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>',
    },
        {
        title: '_____________________________________________________Жалобы____________________________________________________'
    },
     {
      title: 'Одобрено, закрыто',
      content: "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан.[/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	 status: false,
    },
    {
      title: 'На рассмотрении...',
      content: "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Ваша жалоба взята на рассмотрение.<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]✿❯────「Ожидайте ответа.」────❮✿[/ICODE][/COLOR][/CENTER]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>',
      prefix: NARASSSMOTRENII_PREFIX,
	  status: false,
    },
    {
        title: ' - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Нарушение чата - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -'
    },
{
      title: 'Шум в Voice',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.16. Запрещено создавать посторонние шумы или звуки | Mute 30 минут [/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },

{
      title: 'Музыка в войс',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE] 3.14. Запрещено включать музыку в Voice Chat | Mute 60 минут. [/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
{
      title: 'Реклама в войс',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.17. Запрещена реклама в Voice Chat не связанная с игровым процессом | Ban 7 - 15 дней. [/ICODE][/COLOR][/CENTER]<br>" +
        "[LEFT][COLOR=#FFFFFF][COLOR=Red]Пример:[/COLOR]реклама Discord серверов, групп, сообществ, ютуб каналов и т.д. [/LEFT][/COLOR]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
    {
      title: 'Реклама сторонних ресурсов',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.31. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное | Ban 7 дней / PermBan. [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
    {
      title: 'Угрозы о наказании со стороны адм',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пункту правил:<br>3.09. Запрещены любые угрозы о наказании игрока со стороны администрации | Mute 30 минут. [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
    {
      title: 'Оск. | Упом. родни',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | Mute 120 минут / Ban 7 - 15 дней. [/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
    {
      title: 'Выдача себя за Адм',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.10. Запрещена выдача себя за администратора, если таковым не являетесь | Ban 7 - 15 + ЧС администрации. [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
    {
      title: 'Оск. Адм',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.32. Запрещено введение в заблуждение, обман, оскорбление, неконструктивная критика администрации на всех ресурсах проекта | Ban 7 - 15 дней / PermBan. [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
    {
      title: 'IC и OCC угрозы',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.35. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | Mute 120 минут / Ban 7 дней. [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
{
      title: 'МГ',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | Mute 30 минут [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
{
      title: 'Оскорбление',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.07. Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата | Mute 30 минут. [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
    {
      title: 'Торговля на ТТ ГОСС структур',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) | Mute 30 минут. [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",

      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
    {
      title: 'Религиозное и политическая пропаганда',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.18. Запрещено политическое и религиозное пропагандирование | Mute 120 минут / Ban 10 дней. [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",

      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
{
      title: 'CapsLock',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | Mute 30 минут. [/ICODE][/COLOR][/CENTER]<br>" +
        "[LEFT][COLOR=#FFFFFF]Примечание: использование смайлов в виде символов «))», «=D» запрещено в IC чате. [LEFT][/COLOR]<br>" +
        "[LEFT][COLOR=#FFFFFF]Примечание: телефонное общение также является IC чатом. [/LEFT][/COLOR]<br>" +
        "[LEFT][COLOR=#FFFFFF]Примечание: за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается. [/LEFT][/COLOR]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
    {
      title: 'Оск. проекта',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором). [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
    {
     title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Правила RP процесса - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
 {
      title: 'Багоюз',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>' +
        "[CENTER][COLOR=#ffff00][ICODE]Игрок будет наказан по пункту правил: 2.21. Запрещено пытаться обходить игровую систему или использовать любые баги сервера | Ban 15 - 30 дней / PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов).[/ICODE][/CENTER]" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#00FF00][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
 {
      title: 'Аморал. действия',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | Jail 30 минут / Warn. [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
    {
      title: 'nRP поведение',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url][/url]<br>' +
        "[CENTER][COLOR=#ffff00][ICODE]Игрок будет наказан по пункту правил: 2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | Jail 30 минут.[/ICODE][/CENTER] " +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#00FF00][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
    {
      title: 'Уход от РП',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }}. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        "[CENTER][COLOR=#ffff00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | Jail 30 минут / Warn. [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
    {
      title: 'nRP вождение',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>' +
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.03. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | Jail 30 минут. [/ICODE][/COLOR][/CENTER]<br>"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
{
      title: 'Помеха строй',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пункту правил:<br>2.51. Запрещено вмешательство в Role Play процесс с целью помехи и препятствования дальнейшего развития Role Play процесса | Jail 30 минут [/ICODE][/COLOR][/CENTER]<br>" +
        "[LEFT][COLOR=#FFFFFF][COLOR=Red]Пример:[/COLOR]вмешательство в Role Play процесс при задержании игрока сотрудниками ГИБДД, вмешательство в проведение тренировки или мероприятия какой-либо фракции и тому подобные ситуации. [/LEFT][/COLOR]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
{
      title: 'Читы',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пункту правил:<br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | Ban 15 - 30 дней / PermBan. [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
{
      title: 'ДМ',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | Jail 60 минут. [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
    {
      title: 'Масс ДМ',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины более трем игрокам | Warn / Ban 3 - 7 дней. [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
{
      title: 'Помеха игровому процессу',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.04. Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. | Ban 10 дней / Обнуление [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
{
      title: 'Помеха блогерам',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.12. Запрещена помеха в работе блогеров, стримеров (медиа лиц), которые находятся на официальном сотрудничестве с проектом | Ban 7 дней [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
{
      title: 'Слив склада',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле | Ban 15 - 30 дней / PermBan [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
{
      title: 'ДБ',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | Jail 60 минут. [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
{
      title: 'РК',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.14. Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти | Jail 30 минут. [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
    {
      title: 'ТК',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | Jail 60 минут / Warn (за два и более убийства). [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
    {
      title: 'СК',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>' +
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | Jail 60 минут / Warn (за два и более убийства). [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
    {
      title: 'ПГ',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.17. Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь | Jail 30 минут. [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
    {
      title: 'Нонрп акс',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут. [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
    {
      title: 'Неув обр. к Адм',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.54. Запрещено неуважительное обращение, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | Mute 180 минут. [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
    {
      title: 'Баг аним',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. | Jail 60 / 120 минутПример: если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде Jail на 120 минут. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками. Пример: если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде Jail на 60 минут. [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
    {
      title: 'Спасатели ЭКО',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.04. Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. | Ban 10 дней / Обнуление аккаунта (при повторном нарушении). [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
 {
        title: ' - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Обманы/Попытки - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -'
    },
{
      title: 'Не вернул долг',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по следующему пункту правил: 2.57. Запрещается брать в долг игровые ценности и не возвращать их. | Ban 30 дней / Permban [/ICODE][/COLOR][/CENTER]<br>" +
        "[LEFT][COLOR=#FFFFFF]Примечание: займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется. [LEFT][/COLOR]<br>" +
        "[LEFT][COLOR=#FFFFFF]Примечание: при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда. [/LEFT][/COLOR]<br>" +
        "[LEFT][COLOR=#FFFFFF]Примечание:жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами. [LEFT][/COLOR]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
{
      title: 'nRP Обман',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | PermBan [/ICODE][/COLOR][/CENTER]<br>" +
        "[COLOR=#FFFFFF][ICODE]Примечание: после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации. | PermBan [/ICODE][/COLOR]<br>" +
        "[COLOR=#FFFFFF][ICODE]Примечание: разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/ICODE][/COLOR]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
{
      title: 'Ввод в заблуждение',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.11. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | Ban 15 - 30 дней / PermBan. [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
    {
     title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Правила Гос.Структур - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
{
      title: 'Н/П/Р/О (Объявы)',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>Нарушитель будет наказан по пунтку правил:[Color=Red]4.01[/color]. Запрещено редактирование объявлений, не соответствующих ПРО | [Color=Red]Mute 30 минут[/color][/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
{
      title: 'Н/П/П/Э (Эфиры)',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>Нарушитель будет наказан по пунтку правил:[Color=Red]4.02[/color]. Запрещено проведение эфиров, не соответствующих Role Play правилам и логике | [Color=Red]Mute 30 минут[/color][/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
    {
      title: 'Слив СМИ',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>3.08. Запрещены любые формы «слива» посредством использования глобальных чатов | PermBan. [/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
{
      title: 'Ред.объяв.лич.цел',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>Нарушитель будет наказан по пунтку правил:[Color=Red]4.04.[/color]. Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком | [Color=Red]Ban 7 дней + ЧС организации[/color][/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
{
      title: 'Прогул Р/Д',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>Нарушитель будет наказан по пунтку правил: [Color=Red]1.07[/color]. Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции | [Color=Red]Jail 30 минут [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
{
      title: 'Исп. фрак т/с в личных целях',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>Нарушитель будет наказан по пунтку правил: [Color=Red]1.08[/color]. 1.08. Запрещено использование фракционного транспорта в личных целях | [Color=Red]Jail 30 минут [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
{
      title: 'ДМ/Масс дм от МО',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:[Color=Red]2.02[/color]. Наносить урон игрокам, которые находятся вне территории воинской части, запрещено | [Color=Red]Jail 30 минут / Warn[/color] [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
{
      title: 'Розыск без причины (УМВД)',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>6.02. Запрещено выдавать розыск без Role Play причины | Warn. [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
    {
      title: 'ДМ | Масс от УМВД',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пунтку правил: 6.01. Запрещено наносить урон игрокам без Role Play причины на территории УМВД | Jail 30 минут / Warn. [/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#FF00FF][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
{
      title: 'nRP поведение (УМВД)',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>6.03. Запрещено nRP поведение | Warn. [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
{
      title: 'nRP розыск | штраф',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>7.02. Запрещено выдавать розыск, штраф без Role Play причины | Warn. [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
    {
      title: 'Забирание В/У во время погони (ГИБДД)',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пунтку правил: 7.04. Запрещено отбирать водительские права во время погони за нарушителем | Warn. [/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
    {
      title: 'ДМ | Масс от ФСБ',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пунтку правил: 8.01. Запрещено наносить урон игрокам без Role Play причины на территории ФСБ | Jail 30 минут / Warn. [/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#FF00FF][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
    {
     title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Правила ОПГ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'Нарушение правил В/Ч',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пунтку правил: За нарушение правил нападения на Воинскую Часть выдаётся предупреждение | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ). [/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=##00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
    {
      title: 'Нападение на В/Ч через стену',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пунтку правил: Нападение на Военную Часть разрешено только через блокпост КПП с последовательностью взлома | /Warn NonRP В/Ч. [/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]'+
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
    {
      title: 'Похищение | Ограбления нарушение правил',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан за NonRP Ограбление | Похищениее в соответствии с этими правилами [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BE%D0%B3%D1%80%D0%B0%D0%B1%D0%BB%D0%B5%D0%BD%D0%B8%D0%B9-%D0%B8-%D0%BF%D0%BE%D1%85%D0%B8%D1%89%D0%B5%D0%BD%D0%B8%D0%B9.29/']Click[/URL][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
    {
     title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Положение об аккаунтах - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'Фейк аккаунт',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>4.10. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию | Устное замечание + смена игрового никнейма / PermBan. [/ICODE][/COLOR][/CENTER]<br>" +
         '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「✔️ Одобрено, закрыто. ✔️」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",

      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
    {
     title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Передачи жалобы - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
 {
      title: 'Техническому Специалисту',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Ваша жалоба была передана на рассмотрение Техническому Специалисту.[/ICODE][/COLOR][/CENTER]<br>" +
         '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Ожидайте ответа.[/ICODE].[/CENTER][/COLOR]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: TEXSPECY_PREFIX,
	  status: true,
    },
{
      title: 'Передано Главному Администратору',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Ваша жалоба была передана на рассмотрение Главному Администратору.[/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Ожидайте ответа.[/ICODE].[/CENTER][/COLOR]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: GLAVNOMYADMINY_PREFIX,
	  status: true,
    },
    {
      title: 'Передано Главному Куратору Форума',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Ваша жалоба была передана на рассмотрение Главному Куратору Форума.[/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Ожидайте ответа.[/ICODE].[/CENTER][/COLOR]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
    },
    {
      title: 'Передано Зам. Главному Куратору Форума',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Ваша жалоба была передана на рассмотрение Заместителю Главного Куратора Форума.[/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Ожидайте ответа.[/ICODE].[/CENTER][/COLOR]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
    },
 {
     title: ' - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Отказ ЖБ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
{
      title: 'Нету /time',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE] В ваших доказательствах отсутствует /time [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「❌ Отказано, закрыто. ❌」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: OTKAZANO_PREFIX,
	  status: false,
    },
{
      title: 'Отредактирована',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE] Ваши доказательства отредактированы [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「❌ Отказано, закрыто. ❌」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: OTKAZANO_PREFIX,
	  status: false,
    },
{
      title: 'Не полный фрапс',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE] Ваши доказательства обрываются загрузите полный фрапс [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「❌ Отказано, закрыто. ❌」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: OTKAZANO_PREFIX,
	  status: false,
    },
{
      title: 'Нужен фрапс',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE] В таких случаях нужен фрапс [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「❌ Отказано, закрыто. ❌」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: OTKAZANO_PREFIX,
	  status: false,
    },
{
      title: 'Подстава',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE] Ваши доказательства Подставные [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「❌ Отказано, закрыто. ❌」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: OTKAZANO_PREFIX,
	  status: false,
    },
{
      title: 'соц сети',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE] Мы не принимаем наказание которые сделаны в соц сетях [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「❌ Отказано, закрыто. ❌」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: OTKAZANO_PREFIX,
	  status: false,
    },
{
      title: 'От третего лица',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE] Нельзя отправлять жалобы от других лиц [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「❌ Отказано, закрыто. ❌」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: OTKAZANO_PREFIX,
	  status: false,
    },
{
      title: 'Плохое качество фрапса',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE] Ваши доказательства в плохом качестве [/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]✿❯────「❌ Отказано, закрыто. ❌」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: OTKAZANO_PREFIX,
	  status: false,
    },
    {
	  title: 'Нарушений не найдено',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00][ICODE]Нарушений со стороны данного игрока не было найдено.[/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「❌ Отказано, закрыто. ❌」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: OTKAZANO_PREFIX,
	  status: false,
    },
    {
	  title: 'Ответ дан в прошлой ЖБ',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]hhttps://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00][ICODE]Ответ был дан в прошлой жалобе.[/ICODE][/COLOR][/CENTER]<br>" +
		'[[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「❌ Отказано, закрыто. ❌」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: OTKAZANO_PREFIX,
	  status: false,
    },
    {
      title: 'Недостаточно доказательств',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Недостаточно доказательств на нарушение от данного игрока.<br>Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「❌ Отказано, закрыто. ❌」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: OTKAZANO_PREFIX,
	  status: false,
    },
    {
      title: 'Ответственность за фам склад',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Ответственность за семейным складом несет только лидер. [/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「❌ Отказано, закрыто. ❌」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: OTKAZANO_PREFIX,
	  status: false,
    },
    {
      title : 'Уже был наказан' ,
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		'[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00][ICODE]Ваша жалоба отказана, так как нарушитель уже был наказан ранее.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「❌ Отказано, закрыто. ❌」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: OTKAZANO_PREFIX,
      status: false,
    },
    {
      title: 'Дублирование темы',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Дублирование темы.<br>Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован на 3 дня и более.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「❌ Отказано, закрыто. ❌」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: OTKAZANO_PREFIX,
	  status: false,
    },
    {
      title: 'В жалобы на адм',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00]Вы ошиблись разделом.<br>Обратитесь в раздел [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.783/']Жалобы на администрацию[/URL].[/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「❌ Отказано, закрыто. ❌」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: OTKAZANO_PREFIX,
	  status: false,
    },
    {
      title: 'В обжалования',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00]Вы ошиблись разделом.<br>Обратитесь в раздел [URL='https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.786/']Обжалование наказаний[/URL].[/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「❌ Отказано, закрыто. ❌」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: OTKAZANO_PREFIX,
	  status: false,
    },
    {
      title: 'В жалобу орг',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00]Вы ошиблись разделом.<br> Переношу вас в ту тему на что и жалоба[/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「❌ Отказано, закрыто. ❌」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: OTKAZANO_PREFIX,
	  status: false,
    },
{
      title: '__________________________________________РП ситуация__________________________________________',
    },
   {
	  title: 'РП ситуация одобрено',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay ситуация была проверена и получает статус - [COLOR=#00FF00]✔️ Одобрено.[/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
       prefix: ODOBRENO_PREFIX,
	  status: false,
     },
    {
	  title: 'РП ситуация на доработке',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00][ICODE]Вам дается 24 часа на дополнение Вашей РП ситуации [/ICODE][/COLOR][/CENTER]<br>" +
		 '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
       prefix: NARASSSMOTRENII_PREFIX,
	  status: false,
      },
    {
	  title: 'РП ситуация отказ',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша РП ситуация получает статус - [Color=#FF0000]❌ Отказано.<br>" +
        "[CENTER][COLOR=#FFFF00]Причиной отказа могло послужить какое-либо нарушение из Правила RP ситуаций.[/COLOR][/CENTER]<br>" +
		 '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
       prefix: OTKAZANO_PREFIX,
	  status: false,
     },
    {
      title: ' - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -Отказ(причины) - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
	  title: 'Нету одобреной биографии',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша РП ситуация получает статус - [Color=#FF0000]❌ Отказано.<br>" +
        "[CENTER][COLOR=#FFFF00]Причина: Отказана РП биография.[/COLOR][/CENTER]<br>" +
		 '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
       prefix: OTKAZANO_PREFIX,
	  status: false,
     },
    {
	  title: 'Нету Док-в',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша РП ситуация получает статус - [Color=#FF0000]❌ Отказано.<br>" +
        "[CENTER][COLOR=#FFFF00]Причина: Нету видеозаписи рп ситуации.[/COLOR][/CENTER]<br>" +
		 '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
       prefix: OTKAZANO_PREFIX,
	  status: false,
     },
    {
	  title: 'Не по форме',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша РП ситуация получает статус - [Color=#FF0000]❌ Отказано.<br>" +
        "[CENTER][COLOR=#FFFF00]Причина: Рп ситуация не по форме.[/COLOR][/CENTER]<br>" +
		 '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
       prefix: OTKAZANO_PREFIX,
	  status: false,
     },
    {
	  title: 'ошибки в тексте',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша РП ситуация получает статус - [Color=#FF0000]❌ Отказано.<br>" +
        "[CENTER][COLOR=#FFFF00]Причина: Ошибки в тексте.[/COLOR][/CENTER]<br>" +
		 '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
       prefix: OTKAZANO_PREFIX,
	  status: false,
     },
 {
      title: '__________________________________________Неофицальная организация__________________________________________',
    },
    {
	  title: 'Неофицальная Орг Одобрено',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша неофициальная RolePlay организация получает статус - [COLOR=#00FF00]✔️ Одобрено.[/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
     },
    {
	  title: 'Неофицальная Орг на доработке',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00][ICODE]Вам дается 24 часа на дополнение Вашей неофицальной организации.[/ICODE][/COLOR][/CENTER]<br>" +
		 '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
       prefix: NARASSSMOTRENII_PREFIX,
	  status: false,
     },
    {
	  title: 'Неофицальная Орг отказ',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша РП ситуация получает статус - [Color=#FF0000]❌ Отказано. <br>"+
        "[CENTER][COLOR=#FFFF00]Причиной отказа могло послужить какое-либо нарушение из Правила создания неофицальной RolePlay организации.[/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
       prefix:  OTKAZANO_PREFIX,
	  status: false,
    },
 {
      title: '__________________________________________РП биографии__________________________________________',
    },
 {
      title: ' - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Одобрено - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
	  title: 'РП биография ||Одобрено||',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#00FF00]✔️ Одобрено.[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>' +
        '[RIGHT][B][COLOR=#ff0000]Полезные ссылки.[/COLOR][/B]'+ '[RIGHT][/RIGHT] '+ "[SIZE=3][FONT=georgia]Заявление на пост Агента Поддержки - [URL]https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3173/[/URL]" + '[RIGHT][/RIGHT] '+ "Заявление на пост Лидера - [URL]https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3174/[/URL] [/FONT][/SIZE][/RIGHT]",
      prefix: ODOBRENO_PREFIX,
	  status: false,
    },
 {
      title: ' - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -Дороботка - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
	  title: 'Дороботка ||ИФО||',
	 content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFFFF]Вам даётся 24 часа на дополнение/исправление вашей RolePlay биографии.<br>[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFFFF]Иправить ФИО то есть фамилия имя отчество, У вас ИФО.[COLOR=#FFFFFF] Исправьте это.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: NARASSSMOTRENII_PREFIX,
      status: true,
    },
    {
	  title: 'Дороботка ||Дописать детство||',
	 content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFFFF]Вам даётся 24 часа на дополнение/исправление вашей RolePlay биографии.<br>[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFFFF]Дописать несколько предложений в теме "Детство".[COLOR=#FFFFFF] Исправьте это.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: NARASSSMOTRENII_PREFIX,
      status: true,
    },
    {
	  title: 'Дороботка ||Дописать юность||',
	 content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFFFF]Вам даётся 24 часа на дополнение/исправление вашей RolePlay биографии.<br>[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFFFF]Дописать несколько предложений в теме "Юность"[COLOR=#FFFFFF] Исправьте это.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: NARASSSMOTRENII_PREFIX,
      status: true,
    },
    {
	  title: 'Дороботка ||Дописать настоящие время||',
	 content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFFFF]Вам даётся 24 часа на дополнение/исправление вашей RolePlay биографии.<br>[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFFFF]Дописать несколько предложений в теме "Настоящие время".[COLOR=#FFFFFF] Исправьте это.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: NARASSSMOTRENII_PREFIX,
      status: true,
    },
    {
	  title: 'Дороботка ||Хобби||',
	 content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFFFF]Вам даётся 24 часа на дополнение/исправление вашей RolePlay биографии.<br>[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFFFF]Иправить хобби на спортивное зантяие либо другое. [COLOR=#FFFFFF] Исправьте это.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: NARASSSMOTRENII_PREFIX,
      status: true,
    },
    {
	  title: 'Дороботка ||Адрес||',
	 content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFFFF]Вам даётся 24 часа на дополнение/исправление вашей RolePlay биографии.<br>[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFFFF]Исправить адрес, пример: Г."Арзамас" дом-78 квартира 4. [COLOR=#FFFFFF] Исправьте это.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: NARASSSMOTRENII_PREFIX,
      status: true,
    },
    {
	  title: 'Дороботка ||Орф. Ошибки||',
	 content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFFFF]Вам даётся 24 часа на дополнение/исправление вашей RolePlay биографии.<br>[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFFFF]Исправить орфаграфические ошибки. [COLOR=#FFFFFF] Исправьте это.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: NARASSSMOTRENII_PREFIX,
      status: true,
    },
    {
	  title: 'Дороботка ||Пункт. Ошибки||',
	 content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFFFF]Вам даётся 24 часа на дополнение/исправление вашей RolePlay биографии.<br>[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFFFF]Исправить пунктуационные ошибки. [COLOR=#FFFFFF] Исправьте это.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: NARASSSMOTRENII_PREFIX,
      status: true,
    },
    {
      title: ' - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -Отказ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
 {
        title: 'nRP Фамилия',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/platinum-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.8227403/']с правилами написания RolePlay биографий.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Фамилия является nonRP.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
 {
        title: 'nRP имя',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/platinum-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.8227403/']с правилами написания RolePlay биографий.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Имя является nonRP.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
 {
        title: 'Юность с 13 лет',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/platinum-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.8227403/']с правилами написания RolePlay биографий.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Юность с 13 лет.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
 {
        title: 'Не дополнил',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/platinum-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.8227403/']с правилами написания RolePlay биографий.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Вы спустя время не дополнили/не исправили биографию.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
 {
        title: 'Пункт ФИО некорректен',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/platinum-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.8227403/']с правилами написания RolePlay биографий.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Пункт ФИО заполнен некорректно.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
    {
        title: 'Отсутствует ФИО в пункте семьи',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/platinum-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.8227403/']с правилами написания RolePlay биографий.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Отсутствует ФИО в пункте семьи.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
        },
    {
        title: 'Отличие отчества и имени отца',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/platinum-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.8227403/']с правилами написания RolePlay биографий.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Отчество отличается от имени отца.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
    },
    {
        title: 'Орф и Пунктуационные ошибки',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/platinum-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.8227403/']с правилами написания RolePlay биографий.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Орфографические и пунктуационные ошибки.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
    },
    {
        title: 'Пунктуационные ошибки',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/platinum-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.8227403/']с правилами написания RolePlay биографий.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Пунктуационные ошибки.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
    },
    {
        title: 'Орфографические ошибки',
        content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/platinum-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.8227403/']с правилами написания RolePlay биографий.[/URL][/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Орфографические ошибки.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
    },
    {
        title: 'Био от 3-го лица',
        content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/platinum-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.8227403/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Биография от 3-го лица.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
    },
    {
        title: 'Дата рождения некорректна',
        content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/platinum-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.8227403/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Дата рождения некорректна.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
    },
    {
        title: 'Информация не соответствует времени',
        content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/platinum-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.8227403/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Информация в пунктах не соответствует временным рамкам.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
    },
    {
        title: 'Возраст не совпал',
        content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/platinum-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.8227403/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Возраст не совпадает с датой рождения.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
    },
    {
        title: 'Слишком молод',
        content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/platinum-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.8227403/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Некорректен возраст (слишком молод).[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
    },
    {
        title: 'Информация с фантастикой',
        content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/platinum-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.8227403/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]В предоставленной информации присутствуют фантастические или аномальные явления, что является некорректным.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
    },
    {
        title: 'Биография скопирована',
        content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/platinum-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.8227403/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Биография скопирована.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
    },
    {
        title: 'Недостаточно РП информации',
        content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/platinum-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.8227403/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Недостаточно РП информации.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
    },
    {
        title: 'Не по форме bio',
        content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/platinum-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.8227403/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Биография не по форме.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
    },
    {
        title: 'Некоррект национальность',
        content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/platinum-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.8227403/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Некорректная национальность.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
    },
    {
        title: 'Неккорект хобби',
        content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/platinum-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.8227403/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Пункт хобби заполнен неккоректно, ибо вы указали работу или написали действие, которое никак не относится к данному пункту.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
    },
  {
        title: 'Неккорект место проживания',
        content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/platinum-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.8227403/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Пункты, связанные с местом проживания заполнены неккоректно.[/B][/COLOR]' +
        '[CENTER][COLOR=#FFFF00]Пример: [COLOR=#FFFFFF]Место проживания на момент проживания с родителями/Место текущего проживания: Г. Арзамас, дом 24-Б, кв. 78.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
    },
  {
        title: 'Неккорект ФИО родителей',
        content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/platinum-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.8227403/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Пункты, связанные с местом проживания заполнены неккоректно.[/B][/COLOR]' +
        '[B][CENTER][COLOR=#FFFF00]Пример: [COLOR=#FFFFFF]ФИО родителей неккоректное, форма ФИО родителей "Перцов Максим Егорович" [/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
    },
    {
        title: 'Отсутствие фото персонажа',
        content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/platinum-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.8227403/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Отсутствие фото персонажа.[/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]',
      prefix: OTKAZANO_PREFIX,
      status: false,
    },
    {
        title: 'Заголовок не по форме bio',
        content:
        "[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]❌ Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/platinum-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.8227403/']с правилами написания RolePlay биографий[/URL].[/CENTER]<br>" +
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Заголовок темы составлен не по форме.[COLOR=#FFFF00]<br>Заголовок RP биографии должен быть оформлен по форме ниже:[COLOR=#FFFFFF]<br>[QUOTE]RolePlay биография гражданина Имя Фамилия (в родительном падеже) [/QUOTE][/CENTER][/B][/COLOR]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png][/img][/url]<br>',
      prefix: OTKAZANO_PREFIX,
      status: false,
    }
];

var titles = document.getElementsByClassName('structItem-title');
    var count_ojidanie = 0;
    var count_ga = 0;
    var count_na_rassmotrenii = 0;
    var count_sa = 0;

    for (var i = 0; i < titles.length; i++) {
        var prefix_ojidanie = titles[i].querySelector('.labelLink .label--silver');
        if (prefix_ojidanie && prefix_ojidanie.textContent.trim() === 'Ожидание') {
            count_ojidanie++;
        }
        var prefix_ga = titles[i].querySelector('.label.label--red');
        if (prefix_ga && prefix_ga.textContent.trim() === 'Главному администратору') {
            count_ga++;
        }
        var prefix_na_rassmotrenii = titles[i].querySelector('.label.label--orange');
        if (prefix_na_rassmotrenii && prefix_na_rassmotrenii.textContent.trim() === 'На рассмотрении') {
            count_na_rassmotrenii++;
        }
        var prefix_sa = titles[i].querySelector('.label.label--accent');
        if (prefix_sa && prefix_sa.textContent.trim() === 'Специальному администратору') {
            count_sa++;
        }
    }

    function getColor(count) {
        if (count < 7) {
            return 'lime';
        } else if (count >= 7 && count < 15) {
            return 'orange';
        } else {
            return 'red';
        }
    }

    var headers = document.getElementsByClassName('block-minorHeader uix_threadListSeparator');
    if (headers.length > 0) {
        var firstHeader = headers[0];
        var secondHeader = headers[1];

        var countElementGA = document.createElement('span');
        countElementGA.style.marginLeft = '10px';
        countElementGA.style.fontSize = '1.4rem';
        countElementGA.style.color = getColor(count_ga);
        countElementGA.textContent = 'Глав.Админу: ' + count_ga + ' ||';

        var countElementNaRassmotrenii = document.createElement('span');
        countElementNaRassmotrenii.style.marginLeft = '10px';
        countElementNaRassmotrenii.style.fontSize = '1.4rem';
        countElementNaRassmotrenii.style.color = getColor(count_na_rassmotrenii);
        countElementNaRassmotrenii.textContent = 'На рассмотрении: ' + count_na_rassmotrenii + ' ||';

        var countElementSA = document.createElement('span');
        countElementSA.style.marginLeft = '10px';
        countElementSA.style.fontSize = '1.4rem';
        countElementSA.style.color = getColor(count_sa);
        countElementSA.textContent = 'Спец.Админу: ' + count_sa;

        var arrowIcon = firstHeader.querySelector('.uix_threadCollapseTrigger');
        firstHeader.insertBefore(countElementGA, arrowIcon);
        firstHeader.insertBefore(countElementNaRassmotrenii, arrowIcon);
        firstHeader.insertBefore(countElementSA, arrowIcon);

        var countElementOjidanie = document.createElement('span');
        countElementOjidanie.style.marginLeft = '10px';
        countElementOjidanie.style.fontSize = '1.4rem';
        countElementOjidanie.style.color = getColor(count_ojidanie);
        countElementOjidanie.textContent = 'Ожидание: ' + count_ojidanie;

        arrowIcon = secondHeader.querySelector('.uix_threadCollapseTrigger');
        secondHeader.insertBefore(countElementOjidanie, arrowIcon);
    }

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
    addButton('Рассмотрено', 'rassmotreno');
    addButton('На рассмотрении', 'pin');
    addButton('Отказано', 'otkaz');
    addButton('Закрыто', 'unaccept');
    addButton('Одобрено', 'accepted');
    addButton('Ответы', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(NARASSSMOTRENII_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ODOBRENO_PREFIX, false));
    $('button#unaccept').click(() => editThreadData(ZAKRITO_PREFIX, false));
    $('button#rassmotreno').click(() => editThreadData(RASSMORTENO_PREFIX, false));
    $('button#otkaz').click(() => editThreadData(OTKAZANO_PREFIX, false));


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
      `<button type="button" class="button rippleButton" id="${id}" style="background-image: linear-gradient(to right, #000000 0%, #808080  51%, #000000  100%);margin: 10px;border-radius: 10px;">${name}</button>`,
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