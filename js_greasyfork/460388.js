// ==UserScript==
// @name         Руководство сервера NOVOSIBIRSK
// @namespace    https://forum.blackrussia.online
// @version      2.0
// @description  Скрипт для Кураторов администрации/ЗГА/ГА | Black Russia от S.Crown
// @author       Sogeking
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license    MIT
// @icon       https://sun9-north.userapi.com/sun9-78/s/v1/ig2/lmx7wrjUY9ADt1rLWlItXCFMfSeB-XL6s-iwGSmkVGGdaCr2PSQRrjphE1RyNlif8bVVOpdPV8fl3ifwf3dCY7Ll.jpg?size=1536x1536&quality=95&type=album
// @downloadURL https://update.greasyfork.org/scripts/460388/%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%BE%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%20NOVOSIBIRSK.user.js
// @updateURL https://update.greasyfork.org/scripts/460388/%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%BE%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%20NOVOSIBIRSK.meta.js
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

      title: 'Свой ответ (Одобрено,Отказано)',
       content:
       "[B][CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		 '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
        '[B][CENTER][COLOR=#ffff00][ICODE]Свой текст[/ICODE][/COLOR][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
         '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
		'[Color=#ff00ff][CENTER][I][ICODE]Одобрено, закрыто.[/ICODE][/I][/CENTER][/color]',
     },
    {


     title: '- - - - - -  - - - - - - - - -  - - - - - - - - - - - - - - - - - Жалобы на администрацию - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'Будет беседа с админом',
      content:
        "[B][CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		 '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
        '[B][CENTER][COLOR=#ffff00][ICODE]С администратором будет проведена работа.[/ICODE][/COLOR][/CENTER]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
         '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
		'[Color=#ff00ff][CENTER][I][ICODE]Одобрено, закрыто.[/ICODE][/I][/CENTER][/color]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Будет беседа с админом и наказание будет снято',
      content:
		"[B][CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
    "[B][CENTER][COLOR=#ffff00][ICODE]С администратором будет проведена работа.<br>Ваше наказание будет снято в течение нескольких часов.[/ICODE][/CENTER][/COLOR]" +
         '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
		 '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
		'[Color=#ff00ff][CENTER][I][ICODE]Одобрено, закрыто.[/ICODE][/I][/CENTER][/color]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ЖБ на рассмотрении',
      content:
		"[B][CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
        "[CENTER][COLOR=#ffff00][ICODE]Ваша жалоба взята на рассмотрение.<br>Ожидайте вынесения вердикта и не создавайте копии данной темы.[/ICODE][/CENTER][/COLOR]<br>" +
         '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
		'[Color=Orange][CENTER][ICODE]На рассмотрении...[/ICODE][/CENTER][/color]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'С момента выдачи наказания более 48ч',
      content:
		"[B][CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
        "[CENTER][COLOR=#ffff00][ICODE]Срок написания жалобы составляет два дня (48 часов) с момента совершенного нарушения со стороны администратора сервера.[/ICODE][/CENTER][/COLOR]<br>" +
         '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
		'[Color=#FF0000][CENTER][I][ICODE]Отказано, закрыто.[/ICODE][/I][/CENTER][/color]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Адм предоставил док-ва',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
        "[CENTER][COLOR=#ffff00][ICODE]Администратор предоставил доказательства, наказание выдано верно.[/ICODE][/CENTER][/COLOR]<br>" +
		 '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
		'[Color=#FF0000][CENTER][I][ICODE]Отказано, закрыто.[/ICODE][/I][/CENTER][/color]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'дата в жб отличается от даты в скрине',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
        "[CENTER][COLOR=#ffff00][ICODE]Дата указанная в жалобе, отличается от даты на скриншоте.[/ICODE][/CENTER][/COLOR]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
		'[Color=#FF0000][CENTER][I][ICODE]Отказано, закрыто.[/ICODE][/I][/CENTER][/color]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Недостаточно док-в',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
        "[CENTER][COLOR=#ffff00][ICODE]Недостаточно доказательств нарушения со стороны администратора.[/ICODE][/CENTER][/COLOR]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
		'[Color=#FF0000][CENTER][I][ICODE]Отказано, закрыто.[/ICODE][/I][/CENTER][/color]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нарушений со стороны адм нет',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
        "[CENTER][COLOR=#ffff00][ICODE]Нарушений со стороны администратора не было найдено.[/ICODE][/CENTER][/COLOR]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
		'[Color=#FF0000][CENTER][I][ICODE]Отказано, закрыто.[/ICODE][/I][/CENTER][/color]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нужен Скрин бана',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
        "[CENTER][COLOR=#ffff00][ICODE]Как доказательство прикладывается скриншот окна бана при входе на сервер.<br>Подайте новую жалобу и прикрепите такой скриншот, если он у вас имеется.[/ICODE][/CENTER][/COLOR]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
		'[Color=#FF0000][CENTER][I][ICODE]Отказано, закрыто.[/ICODE][/I][/CENTER][/color]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ЖБ не по форме',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
        "[CENTER][COLOR=#ffff00]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3429349/']*с правилами подачи жалоб на администрацию*[/URL].[/CENTER][/COLOR]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
		'[Color=#FF0000][CENTER][I][ICODE]Отказано, закрыто.[/ICODE][/I][/CENTER][/color]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В обжалования',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
        "[CENTER][COLOR=#ffff00]Вы ошиблись разделом.<br>Обратитесь в раздел [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1573/']*Обжалование наказаний*[/URL].[/CENTER][/COLOR]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
		'[Color=#FF0000][CENTER][I][ICODE]Отказано, закрыто.[/ICODE][/I][/CENTER][/color]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Техническому специалисту',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
        "[CENTER][COLOR=#ffff00][ICODE]Ваша жалоба была передана на рассмотрение техническому специалисту.<br>Ожидайте вынесения вердикта и не создавайте копии данной темы.[/ICODE][/CENTER][/COLOR]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
		'[Color=#FF0000][CENTER][ICODE]Ожидайте ответа.[/ICODE][/CENTER][/color]',
      prefix: TEXY_PREFIX,
	  status: true,
    },
    {
      title: 'Передано ГА',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
        "[CENTER][COLOR=#ffff00][ICODE]Ваша жалоба была передана на рассмотрение Главному Администратору.<br>Ожидайте вынесения вердикта и не создавайте копии данной темы.[/ICODE][/CENTER][/COLOR]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
		'[Color=#FF0000][CENTER][ICODE]Ожидайте ответа.[/ICODE][/CENTER][/color]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'Передано Специальному администратору',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
        "[CENTER][COLOR=#ffff00][ICODE]Ваша жалоба была передана на рассмотрение Специальному администратору.<br>Ожидайте вынесения вердикта и не создавайте копии данной темы.[/ICODE][/CENTER][/COLOR]<br>" +
		 '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
		'[Color=#FF0000][CENTER][ICODE]Ожидайте ответа.[/ICODE][/CENTER][/color]',
      prefix: SPECY_PREFIX,
	  status: true,
    },
    {
      title: 'В тех. раздел',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
        "[CENTER][COLOR=#ffff00]Вы ошиблись разделом.<br>Обратитесь в [URL='https://forum.blackrussia.online/index.php?forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-novosibirsk.1544/']*технический раздел*[/URL].[/CENTER][/COLOR]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
		'[Color=#FF0000][CENTER][I][ICODE]Отказано, закрыто.[/ICODE][/I][/CENTER][/color]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Дублирование темы',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
        "[CENTER][COLOR=#ffff00][ICODE]Дублирование темы.<br>При дальнейшем дублировании подобных жалоб, ваш форумный аккаунт будет заблокирован за нарушение правил пользования форумом.[/ICODE][/CENTER][/COLOR]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
		'[Color=#FF0000][CENTER][I][ICODE]Отказано, закрыто.[/ICODE][/I][/CENTER][/color]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ошиблись разделом',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
        "[CENTER][COLOR=#ffff00][ICODE]Вы ошиблись сервером/разделом, переподайте жалобу в нужный раздел.[/ICODE][/CENTER][/color]<br>"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
		'[Color=#FF0000][CENTER][I][ICODE]Отказано, закрыто.[/ICODE][/I][/CENTER][/color]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ЖБ от 3-го лица',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
        "[CENTER][COLOR=#ffff00][ICODE]Жалобы от 3-их лиц не принимаются.[/ICODE][/CENTER][/COLOR]" +
		   '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
		'[Color=#FF0000][CENTER][I][ICODE]Отказано, закрыто.[/ICODE][/I][/CENTER][/color]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Нету /time',
	  content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
		"[CENTER][COLOR=#ffff00][ICODE]На ваших доказательствах отсутствует /time.[/ICODE][/CENTER][/COLOR]<br>" +
		   '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
		'[Color=#FF0000][CENTER][I][ICODE]Отказано, закрыто.[/ICODE][/I][/CENTER][/color]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Док-ва в соц. сетях',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
        "[CENTER][COLOR=#ffff00][ICODE]3.6. Прикрепление доказательств обязательно. Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/ICODE][/CENTER][/COLOR]" +
	      '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
		'[Color=#FF0000][CENTER][I][ICODE]Отказано, закрыто.[/ICODE][/I][/CENTER][/color]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не работают док-ва',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
        "[CENTER][COLOR=#ffff00][ICODE]Не работают доказательства.[/ICODE][/CENTER][/COLOR]<br>" +
		  '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
		'[Color=#FF0000][CENTER][I][ICODE]Отказано, закрыто.[/ICODE][/I][/CENTER][/color]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Док-ва отредактированы',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
        "[CENTER][COLOR=#ffff00][ICODE]Ваши доказательства отредактированы.[/ICODE][/CENTER][/COLOR]" +
		 '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
		'[Color=#FF0000][CENTER][I][ICODE]Отказано, закрыто.[/ICODE][/I][/CENTER][/color]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
          title: 'Ответ дан в прошлой ЖБ',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00][ICODE]Ответ был дан в прошлой теме.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
        '[Color=#FF00FF][FONT=times new roman][CENTER][I][ICODE]Отказано, закрыто.[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
      },
    {

     title: '- - - - - -  - - - - - - - - -  - - - - - - - - - - - - - - - - - - - Обжалования наказаний - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'Срок снижен до 30 дней',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
        "[CENTER][COLOR=#ffff00][ICODE]Срок блокировки аккаунта будет снижен до 30 дней.<br>С момента разблокировки аккаунта, не повторяйте подобных действий.[/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
		'[Color=#00FF00][CENTER][I][ICODE]Одобрено, закрыто.[/ICODE][/I][/CENTER][/color]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Срок снижен до 15 дней',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
        "[CENTER][COLOR=#ffff00][ICODE]Срок блокировки аккаунта будет снижен до 15 дней.<br>С момента разблокировки аккаунта, не повторяйте подобных действий.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
		'[Color=#00FF00][CENTER][I][ICODE]Одобрено, закрыто.[/ICODE][/I][/CENTER][/color]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Срок снижен до 7 дней',
      content:
		"[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
        "[CENTER][COLOR=#ffff00][ICODE]Срок блокировки аккаунта будет снижен до 7 дней.<br>С момента разблокировки аккаунта, не повторяйте подобных действий.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
		'[Color=#00FF00][CENTER][I][ICODE]Одобрено, закрыто.[/ICODE][/I][/CENTER][/color]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Срок снижен до 3 дней',
      content:
	    "[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
        "[CENTER][COLOR=#ffff00][ICODE]Срок блокировки аккаунта будет снижен до 3 дней.<br>С момента разблокировки аккаунта, не повторяйте подобных действий.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
		'[Color=#00FF00][CENTER][I][ICODE]Одобрено, закрыто.[/ICODE][/I][/CENTER][/color]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Обж отказано',
      content:
	     "[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
        "[CENTER][COLOR=#ffff00][ICODE]К сожалению, вам отказано в смягчении наказания.<br>Не расстраивайтесь и всего вам доброго.[/ICODE][/COLOR][/CENTER]<br>" +
		 '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
		'[Color=#FF0000][CENTER][I][ICODE]Отказано, закрыто.[/ICODE][/I][/CENTER][/color]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '24ч на возврат имущества',
      content:
		 "[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
        "[CENTER][COLOR=#ffff00][ICODE]Тема будет находится в закреплении, у вас есть 24 часа на возвращение имущества, и предъявления видеофиксации.<br>Обманутая сторона также может отписать о возвращении оговоренного имущества.[/ICODE][/CENTER][/COLOR]<br>" +
         '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
		'[Color=Orange][CENTER]На рассмотрении...[/CENTER][/color]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
      title: 'В ЖБ на адм',
      content:
		 "[CENTER][COLOR=#ff0000]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>' +
        "[CENTER][COLOR=#ffff00]Вы ошиблись разделом.<br>Обратитесь в раздел [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1570/']*жалобы на администрацию*[/URL].[/CENTER]<br>" +
		 '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>'+
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры на NOVOSIBIRSK.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/fy4k2Vjj/RvBD5.gif[/img][/url]<br>'+
		'[Color=#FF0000][CENTER][I][ICODE]Отказано, закрыто.[/ICODE][/I][/CENTER][/color]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    }

  ];

  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение', 'pin');
    addButton('КП', 'teamProject');
    addButton('Га', 'Ga');
    addButton('Спецу', 'Spec');
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('Тех. Специалисту', 'Texy');
    addButton('Решено', 'Resheno');
    addButton('Закрыто', 'Zakrito');
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