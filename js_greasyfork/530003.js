// ==UserScript==
// @name         Скрит для РС TVER
// @namespace    https://forum.blackrussia.online/
// @version      5.2
// @description  Для Руководства Сервера TVER
// @author       Киря
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://icons.iconarchive.com/icons/graphicloads/flat-finance/128/certificate-icon.png
// @downloadURL https://update.greasyfork.org/scripts/530003/%D0%A1%D0%BA%D1%80%D0%B8%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A0%D0%A1%20TVER.user.js
// @updateURL https://update.greasyfork.org/scripts/530003/%D0%A1%D0%BA%D1%80%D0%B8%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A0%D0%A1%20TVER.meta.js
// ==/UserScript==
 
(function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // отказ жб
	const ACCEPT_PREFIX = 8; // одобрение жб
	const PIN_PREFIX = 2; //  повесить на закреп
    const GA_PREFIX = 12; // для га
    const SPEC_PREFIX = 11; // для спецов
    const RESENO_PREFIX = 6 // решено
	const COMMAND_PREFIX = 10; // для кп
	const WATCHED_PREFIX = 9; // рассмотрено
    const CLOSE_PREFIX = 7; // закрытие жб
	const buttons = [
	{
		title: 'Приветствие',
		content:
'[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/DmVFhZ8S/IMG-0268.jpg[/img][/url]<br>' +
'[SIZE=4][FONT=Times New Roman][COLOR=#FF1493][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'
	},
	{
      title: '------------------------------------------------------------ВЗЯТЬ НА РАССМОТРЕНИЕ------------------------------------------------------------',
	},
        {
            title: 'запрос доков',
            content:
            '[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/DmVFhZ8S/IMG-0268.jpg[/img][/url]<br>' +
"[SIZE=4][FONT=Times New Roman][COLOR=#FF1493][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>"+
            "[CENTER]У администратора были запрошены доказательства.<br>Просьба ожидать ответа в данной теме, и не создавать новых.<br><br>"+
            "[CENTER][COLOR=#FF8C00]На рассмотрении..[/COLOR]<br><br>"+
            '[CENTER]Приятного времяпровождения на сервере [COLOR=#00BFFF]TVER[/COLOR][/CENTER]',
            prefix: PIN_PREFIX,
            status: true,
        },
         {
            title: 'на рассмотрении',
            content:
            '[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/DmVFhZ8S/IMG-0268.jpg[/img][/url]<br>' +
"[SIZE=4][FONT=Times New Roman][COLOR=#FF1493][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>"+
            "[CENTER]Ваша жалоба была взята на рассмотрение.<br>Просьба ожидать ответа в данной теме, и не создавать новых.<br><br>"+
            "[CENTER][COLOR=#FF8C00]На рассмотрении..[/COLOR]<br><br>"+
            '[CENTER]Приятного времяпровождения на сервере [COLOR=#00BFFF]TVER[/COLOR][/CENTER]',
            prefix: PIN_PREFIX,
            status: true,
         },
        {
            title: 'для га/зга',
            content:
            '[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/DmVFhZ8S/IMG-0268.jpg[/img][/url]<br>' +
"[SIZE=4][FONT=Times New Roman][COLOR=#FF1493][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>"+
            "[CENTER]Ваша жалоба была передана [COLOR=#FF0000]Главному Администратору[/COLOR] / [COLOR=#FF0000]Заместителю Главного Администратора[/COLOR].<br>Просьба ожидать ответа в данной теме, и не создавать новых.<br><br>"+
            "[CENTER][COLOR=#FF8C00]На рассмотрении..[/COLOR]<br><br>"+
            '[CENTER]Приятного времяпровождения на сервере [COLOR=#00BFFF]TVER[/COLOR][/CENTER]',
            prefix: GA_PREFIX,
            status: true,
         },
        {
            title: 'для га',
            content:
            '[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/DmVFhZ8S/IMG-0268.jpg[/img][/url]<br>' +
"[SIZE=4][FONT=Times New Roman][COLOR=#FF1493][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>"+
            "[CENTER]Ваша жалоба была передана [COLOR=#FF0000]Главному Администратору[/COLOR].<br>Просьба ожидать ответа в данной теме, и не создавать новых.<br><br>"+
            "[CENTER][COLOR=#FF8C00]На рассмотрении..[/COLOR]<br><br>"+
            '[CENTER]Приятного времяпровождения на сервере [COLOR=#00BFFF]TVER[/COLOR][/CENTER]',
            prefix: GA_PREFIX,
            status: true,
         },
        {
            title: 'для са',
            content:
            '[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/DmVFhZ8S/IMG-0268.jpg[/img][/url]<br>' +
"[SIZE=4][FONT=Times New Roman][COLOR=#FF1493][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>"+
            "[CENTER]Ваша жалоба была передана [COLOR=#FFFF00]Специальной Администрации[/COLOR].<br>Просьба ожидать ответа в данной теме, и не создавать новых.<br><br>"+
            "[CENTER][COLOR=#FF8C00]На рассмотрении..[/COLOR]<br><br>"+
            '[CENTER]Приятного времяпровождения на сервере [COLOR=#00BFFF]TVER[/COLOR][/CENTER]',
            prefix: SPEC_PREFIX,
            status: true,
         },
        {
            title: 'смена ника 24 часа',
            content:
            '[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/DmVFhZ8S/IMG-0268.jpg[/img][/url]<br>' +
"[SIZE=4][FONT=Times New Roman][COLOR=#FF1493][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>"+
            "[CENTER]Аккаунт будет разблокирован на 24 часа для смены НикНейма. Сменить его можно с помощью /mm - 8.<br><br>"+
            "[CENTER][COLOR=#FF8C00]На рассмотрении..[/COLOR]<br><br>"+
            '[CENTER]Приятного времяпровождения на сервере [COLOR=#00BFFF]TVER[/COLOR][/CENTER]',
            prefix: PIN_PREFIX,
            status: true,
        },
        {
      title: '---------------------------------------------------------------ОДОБРЕНИЕ ЖАЛОБЫ---------------------------------------------------------------',
	},
        {
            title: 'наказание снято',
            content:
            '[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/DmVFhZ8S/IMG-0268.jpg[/img][/url]<br>' +
"[SIZE=4][FONT=Times New Roman][COLOR=#FF1493][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>"+
            "[CENTER]Наказание было выдано ошибочно. Ожидайте снятия в ближайшее время.<br><br>"+
            "[CENTER][COLOR=#7CFC00]Одобрено[/COLOR]. Закрыто.<br><br>"+
            '[CENTER]Приятного времяпровождения на сервере [COLOR=#00BFFF]TVER[/COLOR][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false
        },
        {
            title: 'работа с адм',
            content:
            '[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/DmVFhZ8S/IMG-0268.jpg[/img][/url]<br>' +
"[SIZE=4][FONT=Times New Roman][COLOR=#FF1493][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>"+
            "[CENTER]С администратором будет проведена необходимая работа по данной жалобе.<br><br>"+
            "[CENTER][COLOR=#7CFC00]Одобрено[/COLOR]. Закрыто.<br><br>"+
            '[CENTER]Приятного времяпровождения на сервере [COLOR=#00BFFF]TVER[/COLOR][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false
        },
        {
            title: 'получит наказание',
            content:
            '[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/DmVFhZ8S/IMG-0268.jpg[/img][/url]<br>' +
"[SIZE=4][FONT=Times New Roman][COLOR=#FF1493][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>"+
            "[CENTER]Администратор получит наказание. Благодарим за информацию.<br><br>"+
            "[CENTER][COLOR=#7CFC00]Одобрено[/COLOR]. Закрыто.<br><br>"+
            '[CENTER]Приятного времяпровождения на сервере [COLOR=#00BFFF]TVER[/COLOR][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false
        },
        {
            title: 'будет снят',
            content:
            '[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/DmVFhZ8S/IMG-0268.jpg[/img][/url]<br>' +
"[SIZE=4][FONT=Times New Roman][COLOR=#FF1493][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>"+
            "[CENTER]Администратор будет снят со своего поста. Благодарим за информацию.<br><br>"+
            "[CENTER][COLOR=#7CFC00]Одобрено[/COLOR]. Закрыто.<br><br>"+
            '[CENTER]Приятного времяпровождения на сервере [COLOR=#00BFFF]TVER[/COLOR][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false
        },
        {
            title: 'изменил ник',
            content:
            '[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/DmVFhZ8S/IMG-0268.jpg[/img][/url]<br>' +
"[SIZE=4][FONT=Times New Roman][COLOR=#FF1493][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>"+
            "[CENTER]Вижу что НикНейм был изменен, постарайтесь больше не нарушать.<br><br>"+
            "[CENTER][COLOR=#7CFC00]Одобрено[/COLOR]. Закрыто.<br><br>"+
            '[CENTER]Приятного времяпровождения на сервере [COLOR=#00BFFF]TVER[/COLOR][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false
        },
        {
      title: '-------------------------------------------------------------------ОТКАЗ ЖАЛОБЫ-------------------------------------------------------------------',
	},
        {
            title: 'не изменил ник',
            content:
            '[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/DmVFhZ8S/IMG-0268.jpg[/img][/url]<br>' +
"[SIZE=4][FONT=Times New Roman][COLOR=#FF1493][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>"+
            "[CENTER]Аккаунт был вновь заблокирован так как НикНейм так и не изменился.<br><br>"+
            "[CENTER][COLOR=#7CFC00]Отказано[/COLOR]. Закрыто.<br><br>"+
            '[CENTER]Приятного времяпровождения на сервере [COLOR=#00BFFF]TVER[/COLOR][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false
        },
         {
            title: 'доки предоставлены',
            content:
            '[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/DmVFhZ8S/IMG-0268.jpg[/img][/url]<br>' +
"[SIZE=4][FONT=Times New Roman][COLOR=#FF1493][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>"+
            "[CENTER]Администратор предоставил доказательства.<br>Наказание было выдано верно.<br><br>"+
            "[CENTER][COLOR=#FF0000]Отказано[/COLOR]. Закрыто.<br><br>"+
            '[CENTER]Приятного времяпровождения на сервере [COLOR=#00BFFF]TVER[/COLOR][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false
         },
        {
            title: 'окошко бана',
            content:
            '[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/DmVFhZ8S/IMG-0268.jpg[/img][/url]<br>' +
"[SIZE=4][FONT=Times New Roman][COLOR=#FF1493][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>"+
            "[CENTER]В качестве доказательств прикрепите окошко блокировки при входе в игру.<br><br>"+
            "[CENTER][COLOR=#FF0000]Отказано[/COLOR]. Закрыто.<br><br>"+
            '[CENTER]Приятного времяпровождения на сервере [COLOR=#00BFFF]TVER[/COLOR][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false
         },
        {
            title: 'форма подачи',
            content:
            '[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/DmVFhZ8S/IMG-0268.jpg[/img][/url]<br>' +
"[SIZE=4][FONT=Times New Roman][COLOR=#FF1493][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>"+
            "[CENTER]Ваша жалоба составлена не по форме. Просьба ознакомится с формой подачи.<br>"+
            "[CENTER]1. Ваш NickName :<br>2. NickName администратора :<br>3. Дата выдачи/получения наказания :<br>4. Суть жалобы :<br>5. Доказательство :<br><br>"+
            "[CENTER][COLOR=#FF0000]Отказано[/COLOR]. Закрыто.<br><br>"+
            '[CENTER]Приятного времяпровождения на сервере [COLOR=#00BFFF]TVER[/COLOR][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false
         },
        {
            title: 'нету доков',
            content:
            '[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/DmVFhZ8S/IMG-0268.jpg[/img][/url]<br>' +
"[SIZE=4][FONT=Times New Roman][COLOR=#FF1493][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>"+
            "[CENTER]В вашей жалобе отсутствуют доказательства.<br><br>"+
            "[CENTER][COLOR=#FF0000]Отказано[/COLOR]. Закрыто.<br><br>"+
            '[CENTER]Приятного времяпровождения на сервере [COLOR=#00BFFF]TVER[/COLOR][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false
         },
        {
            title: 'нету тайма',
            content:
            '[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/DmVFhZ8S/IMG-0268.jpg[/img][/url]<br>' +
"[SIZE=4][FONT=Times New Roman][COLOR=#FF1493][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>"+
            "[CENTER]На ваших доказательствах отсутствует команда /time.<br><br>"+
            "[CENTER][COLOR=#FF0000]Отказано[/COLOR]. Закрыто.<br><br>"+
            '[CENTER]Приятного времяпровождения на сервере [COLOR=#00BFFF]TVER[/COLOR][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false
         },
        {
            title: '48 часов',
            content:
            '[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/DmVFhZ8S/IMG-0268.jpg[/img][/url]<br>' +
"[SIZE=4][FONT=Times New Roman][COLOR=#FF1493][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>"+
            "[CENTER]С момента выдачи наказания прошло более 48 часов. Вам следует обратиться в раздел обжалований наказаний.<br><br>"+
            "[CENTER][COLOR=#FF0000]Отказано[/COLOR]. Закрыто.<br><br>"+
            '[CENTER]Приятного времяпровождения на сервере [COLOR=#00BFFF]TVER[/COLOR][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false
         },
        {
            title: 'дублирование (прошлая с ответом)',
            content:
            '[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/DmVFhZ8S/IMG-0268.jpg[/img][/url]<br>' +
"[SIZE=4][FONT=Times New Roman][COLOR=#FF1493][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>"+
            "[CENTER]Ответ был дан в прошлой жалобе. Напоминаем что за дублирование тем можно получить блокировку форумного аккаунта.<br><br>"+
            "[CENTER][COLOR=#FF0000]Отказано[/COLOR]. Закрыто.<br><br>"+
            '[CENTER]Приятного времяпровождения на сервере [COLOR=#00BFFF]TVER[/COLOR][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false
         },
        {
            title: 'дублирование (прошлая без ответа)',
            content:
            '[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/DmVFhZ8S/IMG-0268.jpg[/img][/url]<br>' +
"[SIZE=4][FONT=Times New Roman][COLOR=#FF1493][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>"+
            "[CENTER]Ожидайте ответа в прошлой жалобе и не создавайте новых.<br><br>"+
            "[CENTER][COLOR=#FF0000]Отказано[/COLOR]. Закрыто.<br><br>"+
            '[CENTER]Приятного времяпровождения на сервере [COLOR=#00BFFF]TVER[/COLOR][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false
         },
        {
            title: 'доки подделаны',
            content:
            '[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/DmVFhZ8S/IMG-0268.jpg[/img][/url]<br>' +
"[SIZE=4][FONT=Times New Roman][COLOR=#FF1493][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>"+
            "[CENTER]Ваши доказательства были подделаны или же подверглись редактированию.<br><br>"+
            "[CENTER][COLOR=#FF0000]Отказано[/COLOR]. Закрыто.<br><br>"+
            '[CENTER]Приятного времяпровождения на сервере [COLOR=#00BFFF]TVER[/COLOR][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false
         },
         {
            title: '3 лицо',
            content:
            '[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/DmVFhZ8S/IMG-0268.jpg[/img][/url]<br>' +
"[SIZE=4][FONT=Times New Roman][COLOR=#FF1493][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>"+
            "[CENTER]Ваша жалоба составлена от 3-го лица. Игрок получившый наказание должен писать жалобу сам.<br><br>"+
            "[CENTER][COLOR=#FF0000]Отказано[/COLOR]. Закрыто.<br><br>"+
            '[CENTER]Приятного времяпровождения на сервере [COLOR=#00BFFF]TVER[/COLOR][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false
         },
        {
            title: 'в обжалования',
            content:
            '[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/DmVFhZ8S/IMG-0268.jpg[/img][/url]<br>' +
"[SIZE=4][FONT=Times New Roman][COLOR=#FF1493][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>"+
            "[CENTER]С данной просьбой вам нужно обратится в раздел обжалований.<br><br>"+
            "[CENTER][COLOR=#FF0000]Отказано[/COLOR]. Закрыто.<br><br>"+
            '[CENTER]Приятного времяпровождения на сервере [COLOR=#00BFFF]TVER[/COLOR][/CENTER]',
            prefix: UNACCEPT_PREFIX,
            status: false
         },
        {
      title: '--------------------------------------------------------------------ОБЖАЛОВАНИЯ--------------------------------------------------------------------',
	},
        {
            title: 'отказ обж',
            content:
            '[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/DmVFhZ8S/IMG-0268.jpg[/img][/url]<br>' +
"[SIZE=4][FONT=Times New Roman][COLOR=#FF1493][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>"+
            "[CENTER]В данный момент мы не готовы пойти к вам на встречу.<br><br>"+
            "[CENTER][COLOR=#FF0000]Отказано[/COLOR]. Закрыто.<br><br>"+
            '[CENTER]Приятного времяпровождения на сервере [COLOR=#00BFFF]TVER[/COLOR][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false
         },
        {
            title: 'одобрение обж',
            content:
            '[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/DmVFhZ8S/IMG-0268.jpg[/img][/url]<br>' +
"[SIZE=4][FONT=Times New Roman][COLOR=#FF1493][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>"+
            "[CENTER]Наказание будет снято, постарайтесь не повторять данных ошибок в дальнейшем.<br><br>"+
            "[CENTER][COLOR=#7CFC00]Одобрено[/COLOR]. Закрыто.<br><br>"+
            '[CENTER]Приятного времяпровождения на сервере [COLOR=#00BFFF]TVER[/COLOR][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false
        },
        {
            title: 'на рассмотрении',
            content:
            '[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/DmVFhZ8S/IMG-0268.jpg[/img][/url]<br>' +
"[SIZE=4][FONT=Times New Roman][COLOR=#FF1493][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>"+
            "[CENTER]Ваше обжалование было взято на рассмотрение.<br>Просьба ожидать ответа в данной теме, и не создавать новых.<br><br>"+
            "[CENTER][COLOR=#FF8C00]На рассмотрении..[/COLOR]<br><br>"+
            '[CENTER]Приятного времяпровождения на сервере [COLOR=#00BFFF]TVER[/COLOR][/CENTER]',
            prefix: PIN_PREFIX,
            status: true,
         },
        {
            title: 'в жалобы',
            content:
            '[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/DmVFhZ8S/IMG-0268.jpg[/img][/url]<br>' +
"[SIZE=4][FONT=Times New Roman][COLOR=#FF1493][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>"+
            "[CENTER]Вам следует обратиться в раздел жалоб на администрацию.<br><br>"+
            "[CENTER][COLOR=#FF0000]Отказано[/COLOR]. Закрыто.<br><br>"+
            '[CENTER]Приятного времяпровождения на сервере [COLOR=#00BFFF]TVER[/COLOR][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false
         },
                {
            title: 'для га',
            content:
            '[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/DmVFhZ8S/IMG-0268.jpg[/img][/url]<br>' +
"[SIZE=4][FONT=Times New Roman][COLOR=#FF1493][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>"+
            "[CENTER]Ваше обжалование передано [COLOR=#FF0000]Главному Администратору[/COLOR].<br>Просьба ожидать ответа в данной теме, и не создавать новых.<br><br>"+
            "[CENTER][COLOR=#FF8C00]На рассмотрении..[/COLOR]<br><br>"+
            '[CENTER]Приятного времяпровождения на сервере [COLOR=#00BFFF]TVER[/COLOR][/CENTER]',
            prefix: GA_PREFIX,
            status: true,
         },
        {
            title: 'для са',
            content:
            '[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/DmVFhZ8S/IMG-0268.jpg[/img][/url]<br>' +
"[SIZE=4][FONT=Times New Roman][COLOR=#FF1493][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>"+
            "[CENTER]Ваше обжалование передано [COLOR=#FFFF00]Специальной Администрации[/COLOR].<br>Просьба ожидать ответа в данной теме, и не создавать новых.<br><br>"+
            "[CENTER][COLOR=#FF8C00]На рассмотрении..[/COLOR]<br><br>"+
            '[CENTER]Приятного времяпровождения на сервере [COLOR=#00BFFF]TVER[/COLOR][/CENTER]',
            prefix: SPEC_PREFIX,
            status: true,
         },
        {
            title: 'не подлежит',
            content:
            '[CENTER][url=https://postimg.cc/18bVwz6h][img]https://i.postimg.cc/DmVFhZ8S/IMG-0268.jpg[/img][/url]<br>' +
"[SIZE=4][FONT=Times New Roman][COLOR=#FF1493][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>"+
            "[CENTER]Данное наказание обжалованию не подлежит.<br><br>"+
            "[CENTER][COLOR=#FF0000]Отказано[/COLOR]. Закрыто.<br><br>"+
            '[CENTER]Приятного времяпровождения на сервере [COLOR=#00BFFF]TVER[/COLOR][/CENTER]',
            prefix: CLOSE_PREFIX,
            status: false
         },

 
 
  ];


$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрение', 'pin');
	addButton('Одобрено', 'accepted');
	addButton('Отказано', 'unaccept');
    addButton('ГА', 'GA');
    addButton('Спец', 'SPEC');
    addButton('решено', 'RESENO');
    addButton('закрыто', 'CLOSE');
	addButton('Ответы', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#GA').click(() => editThreadData(GA_PREFIX, true));
    $('button#SPEC').click(() => editThreadData(SPEC_PREFIX, true));
    $('button#RESENO').click(() => editThreadData(RESENO_PREFIX, false));
    $('button#CLOSE').click(() => editThreadData(CLOSE_PREFIX, false));


	$(`button#selectAnswer`).click(() => {
		XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
		buttons.forEach((btn, id) => {
			if(id > 0) {
				$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
			} else {
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
