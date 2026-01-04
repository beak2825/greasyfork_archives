
// ==UserScript==
// @name Руководство 09
// @namespace https://forum.blackrussia.online
// @version 0.5.0
// @description kye
// @author B.Tabasko
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant none
// @license MIT
// @collaborator !
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/497374/%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%BE%2009.user.js
// @updateURL https://update.greasyfork.org/scripts/497374/%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%BE%2009.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
    const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
    const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
    const PIN_PREFIX = 2; // Prefix that will be set when thread pins
    const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
    const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
    const WATCHED_PREFIX = 9;
    const CLOSE_PREFIX = 7;
    const SA_PREFIX = 11;
    const buttons = [
    {
    title: 'СВОЙ ОТВЕТ',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "Твой текст <br><br>"+
     "Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/FONT][/CENTER][/B][/SIZE]",
    },
    {
        title: 'ЖАЛОБЫ НА АДМИНИСТРАЦИЮ',
        style: 'width: 97%; background: #8a0002; box-shadow: 0px 0px 5px #fff',
    },
    {
        title: 'Жалобы на рассмотрении',
        style: 'width: 97%; background: #8a0002; box-shadow: 0px 0px 5px #fff',
    },
    {
    title: 'Запрошу доказательства',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Запрошу докзательства у администратора. Просьба не создавать подобных тем, иначе форумный аккаунт может быть заблокирован.[/CENTER]<br><br>"+
    '[CENTER][Color=Orange]На рассмотрении.[/Color][/CENTER][/B][/SIZE]',
    prefix: PIN_PREFIX,
    status: true,
    },
    {
    title: 'На рассмотрении',
    content:
    '[SIZE=4][FONT=Courier New[CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Ваша жалоба взята [Color=Orange]на рассмотрение[/Color]. Просьба не создавать подобных тем, иначе форумный аккаунт может быть заблокирован[/CENTER]<br><br>"+
    '[CENTER]Ожидайте ответа.[/CENTER][/B][/SIZE]',
    prefix: PIN_PREFIX,
    status: true,
    },
    {
        title: 'Одобробренные / [Закрыто] жалобы',
        style: 'width: 97%; background: #8a0002; box-shadow: 0px 0px 5px #fff',
    },
    {
    title: 'Доки предоставлены (наказание снято)',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Ваша жалоба была одобрена. С администратором будет проведена беседа.<br>Наказание будет снято.[/CENTER]<br><br>"+
    "[CENTER][COLOR=rgb(76,175,80)]Одобрено.[/COLOR].[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'ПРОСТО НАКАЗАНИЕ СНЯТО.',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Наказание будет снято.[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Наказание снято и GW',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Ваша жалоба была одобрена. Наказание будет снято, GunWarn тоже.[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'проинструктирован',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Спасибо за обращение. Администратор будет проинструктирован.[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Будет проведена беседа с Администратором',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Ваша жалоба была одобрена. С администратором будет проведена беседа.[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Будет проведена беседа с Администратором(строгая)',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Ваша жалоба была одобрена. С администратором будет проведена строгая беседа.[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Будет проведена беседа с Администратором, ответ будет исправлен (КФ)',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Ваша жалоба была одобрена.<br>Ответ в жалобе будет исправлен.[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Администратор ошибся ',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Администратор допустил ошибку. Приносим извинения за предоставленные неудобства.[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: CLOSE_PREFIX,
    status: false,
    },
    {
    title: 'Администратор снят',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Администратор снят.[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: CLOSE_PREFIX,
    status: false,
    },
    {
    title: 'Игрок не является администратором',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Данный игрок не является администратором.[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: CLOSE_PREFIX,
    status: false,
    },
    {
    title: 'Проф беседа',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]С администратором будет проведена профилактическая беседа.[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Информация будет проверена.',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Информация будет проверена, в случае подтверждения информации администратор получит соответствующее наказание.[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: WATCHED_PREFIX,
    status: false,
    },
    {
    title: 'Наказание адм',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Администратор получит соответсвующее наказание.[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Не помог с репортом',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]У администратора произошли проблемы, из-за которых он вам не смог помочь. Приносим извинения за предоставленные неудобства. [/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Не успел зафиксировать, наруш не выдал',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]К сожалению администратор не успел зафиксировать наказание, поэтому наказание игроку не было выдано. Блата нет.[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: CLOSE_PREFIX,
    status: false,
    },
    {
    title: 'СНЯТО, перевыдано',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Ваше наказание было снято / перевыдано чуть позже, когда администратор увидел ошибку.[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: CLOSE_PREFIX,
    status: false,
    },
    {
    title: 'Не достал / починил',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Администратор не обязан доставать автомобиль из воды, или же чинить, т.к это является Role Play процессом. К примеру, Вы можете воспользоваться услугами такси, автобуса, либо попросить знакомых.<br>Нарушений со стороны администратора нет. [/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: CLOSE_PREFIX,
    status: false,
    },
    {
    title: ' типо блат, но сокращено с вип',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER] Прежде чем составлять подобные жалобы, нужно грамотно изучить мод игры. Игрокам с VIP статусом наказание снижается автоматически при его выдачи. То есть, администратор выдает наказание по регламенту, а система сама, исходя из пропорций снижает наказание. <br> Блата тут нет, нарушений тоже. [/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: CLOSE_PREFIX,
    status: false,
    },
    {
    title: 'Если не отпишут',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Создайте повторную заявку, если не отпишут в течении 24 часов, то напишите повторную жалобу.[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: CLOSE_PREFIX,
    },
    {
    title: 'будет исправлены (Заявки)',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Скоро будет все исправлено.[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: CLOSE_PREFIX,
    status: false,
    },
    {
    title: 'будет рассмотрены (Заявки)',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Скоро будет все рассмотрено..[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: CLOSE_PREFIX,
    status: false,
    },
    {
    title: 'скоро будут рассмотрены (жалобы/обж/био/сит)',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Скоро все будет рассмотрено, сроки рассмотрения не нарушаются.[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: CLOSE_PREFIX,
    status: false,
    },
    {
    title: 'ограничение vmute / rmute',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Выдача голосового чата только максимально 60 минут.<br> Выдача блокировки репорта максимально 120 минут.<br>Нарушений со стороны администратора нет.[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: CLOSE_PREFIX,
    status: false,
    },
    {
        title: 'Отказанные жалобы',
        style: 'width: 97%; background: #8a0002; box-shadow: 0px 0px 5px #fff',
    },
    {
    title: 'Доки предоставлены, наказание выдано верно',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Проверив доказательства администратора, было принято решение, что наказание выдано верно.<br>Впредь не нарушайте правила сервера, ознакомиться можно по ссылке - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/'][Color=rgb(255,0,0)]«Общие правила серверов»[/color].[/URL][/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Доки предоставлены, наказание выдано по жб на ф',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Наказание было выдано по жалобе на форуме. Проверив доказательство, было принято решение, что наказание выдано верно.<br>Впредь не нарушайте правила сервера, ознакомиться можно по ссылке - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/'][Color=rgb(255,0,0)]«Общие правила серверов»[/color].[/URL][/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Не по форме',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Ваша жалоба составлена не по форме. Ознакомьтесь с [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/'][COLOR=rgb(255,0,0)]«правилами подачи жалоб на администрацию».[/color][/URL][/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'В жалобы на тех.спец',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Обратитесь в раздел [URL='https://forum.blackrussia.online/index.php?forums/Сервер-№9-cherry.1190/']«Жалобы на технических Специалистов [Color=rgb(128,0,64)]CHERRY[/color]».[/URL][/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'В тех раздел',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Обратитесь со своей проблемов в  [URL='https://forum.blackrussia.online/index.php?forums/Сервер-№9-cherry.1190/']«Технический раздел [Color=rgb(128,0,64)]CHERRY[/COLOR]».[/URL][/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Вы ошиблись разделом/сервером',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Вы ошиблись разделом / сервером. Переподайте жалобу в нужный раздел / сервер.[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'жб 3-е лицо',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Жалоба составлена от 3-го лица, что не подлежит рассмотрению.[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Отсутствуют доки',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]В жалобе отсутствуют доказательство о нарушении от администратора. Создайте повторную жалобу и прикрепите доказательства.[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Прикрепление ссылки (КФ))',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Прикрепите в новой жалобе ссылку, где не согласны с вердиктом администратора.[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Недостаточно доказательств «ЖБ»',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Недостаточно доказательств, чтобы корректно рассмотреть данную жалобу.[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'доки обрезанные',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Ваши доказательства подверглись редактированию, создайте повторную тему и прикрепите доказательства в первоначальном виде.[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    status: false,
    },
    {
    title: 'не раб доки',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Не работают доказательства.[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Смайлик клоуна, оск в жб',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Жалобы с подобным содержанием не подлежат рассмотрению.[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Нарушений со стороны администратора нет.',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Нарушений со стороны администратора нет.[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Дублирование темы',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Вам уже ранее был дан корректный ответ, за создание дубликатов этой темы ваш форумный аккаунт может быть заблокирован.[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'прошло время+в обж',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]В вашем случае нужно было сразу реагировать на выданное наказание и обращаться в раздел жалоб на администрацию, в настоящий момент срок написания жалобы прошел.<br>Обратитесь в раздел Обжалование наказаний.<br>Просьба не создавать копии данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'В ОБЖ',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Если хотите как-то снизить свое наказание, то можете написать в раздел [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.436/'][Color=rgb(255,0,0)]«Обжалование наказаний»[/COLOR][/URL], но не факт, что обжалование одобрят.<br> Перед написанием обжалования внимательно ознакомьтесь с правилами подачи заявок на обжалование наказания[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Окно бана.',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Прикрепите в новой жалобе окно блокировки игрового аккаунта при входе в игру.[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'бан IP',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Перезагрузите роутер или переключите на другой провайдер, если блокировка IP останется, то напишите повторную жалобу. [/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: '72 часа',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]С момента получения наказания прошло 72 часа, жалоба не подлежит рассмотрению.[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Доки из соц сети',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Доказательства в социальных сетях и т.д. не принимаются. Загрузите доказательства на фото-видео хостинги:<br>[URL='https://imgur.com/']IMGUR[/URL]<br>[URL='https://yapx.ru/']Yapix[/URL]<br>[URL='https://postimages.org/']postimages[/URL]<br>[URL='https://ru.imgbb.com/']IBB[/URL]<br>[URL='https://clck.ru/8pxGW']YouTube[/URL] и.т.д<br><br>Все ссылки [COLOR=rgb(255,0,0)]кликабельны[/color].[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Нету /time',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]В доказательствах нету /time.[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Нету /myreports',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]В доказательствах нету  /myreports.[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Не по теме',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Убедительная просьба, ознакомиться с назначение данного раздела, в котором Вы создали тема. Ваша жалоба никоим образом не относится к данному разделу.[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Нет доступа к доказ (Гугл)',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Доступ к доказательствам закрыт - <br> [url=https://postimages.org/][img]https://i.postimg.cc/BvxnD9yw/image.png[/img][/url][/CENTER]<br>"+
    "[CENTER]Создайте новую жалобу и загрузите доказательства на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Нет доступа к доказ (Ютуб)',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Доступ к доказательствам закрыт - <br> [url=https://postimages.org/][img]https://i.postimg.cc/131G5gqy/image.png[/img][/url][/CENTER]<br>"+
    "[CENTER]Создайте новую жалобу и загрузите доказательства на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'уже есть на рассмотрении',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Подобная жалоба уже закреплена на рассмотрение. Ожидайте ответа там и не создавайте подобных, иначе форумный аккаунт может быть заблокирован.[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Системные наказания',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Наказания полученные системой, администрацией не снимаются.[/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
        title: 'Переданные',
        style: 'width: 97%; background: #8a0002; box-shadow: 0px 0px 5px #fff',
    },
    {
    title: 'Рук Модер ДС',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Ваша жалоба будет передана [COLOR=rgb(43,108,196)]Руководителю модераторов Forum/Discord[/color] - @sakaro [Color=Orange]на рассмотрение[/color]. Просьба не создавать подобных тем.[/CENTER]<br>",
    prefix: PIN_PREFIX,
    status: true,
    },
    {
    title: 'ГА',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Ваша жалоба будет передана [Color=Red]Главному администратору[/color] - @Ronald Kõlman ☭︎ [Color=Orange]на рассмотрение[/color]. Просьба не создавать подобных тем.[/CENTER]<br>",
    prefix: GA_PREFIX,
    status: true,
    },
    {
    title: 'ЗГА',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Ваша жалоба будет передана [Color=Red]Заместителю главного администратора[/color] - @Vanya Donissimo [Color=Orange]на рассмотрение[/color]. Просьба не создавать подобных тем.[/CENTER]<br>",
    prefix: PIN_PREFIX,
    status: true,
    },
    {
    title: 'Специальной Администрации',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Ваша жалоба будет передана [COLOR=rgb(204,6,5)]Специальной Администрации[/color] - @Sander_Kligan, @Clarence Crown, @Dmitry Dmitrich, @Myron_Capone, @Liana_Mironova[/CENTER]<br><br>"+
    '[CENTER][Color=Orange]На рассмотрении.[/Color][/CENTER][/B][/SIZE]',
    prefix: SA_PREFIX,
    status: true,
    },
    {
    title: 'Команде проекта',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Ваша жалоба будет передана [COLOR=rgb(239,211,52)]Команде проекта.[/color][/CENTER]<br><br>"+
    '[CENTER][Color=Orange]На рассмотрении.[/Color][/CENTER][/B][/SIZE]',
    prefix: COMMAND_PREFIX,
    status: true,
    },
    {
        title: 'ОБЖАЛОВАНИЕ НАКАЗАНИЙ',
        style: 'width: 97%; background: #8a0002; box-shadow: 0px 0px 5px #fff',
    },
    {
    title: 'На рассмотрении',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Ваше обжалование взятo [Color=Orange]на рассмотрение[/Color]. Просьба не создавать подобных тем.[/CENTER]<br><br>"+
    '[CENTER]Ожидайте ответа.[/CENTER][/B][/SIZE]',
    prefix: PIN_PREFIX,
    status: true,
    },
    {
    title: 'В жалобы на адм',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Внимательно ознакомившись с вашим обжалованием, было решено, что вам нужно обратится в раздел жалоб на администрацию.[/CENTER]<br><br>"+
    '[CENTER][COLOR=RED]Отказано[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Одобрено + полностью снято',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Ваше обжалование одобрено и ваше наказание будет полностью снято.[/CENTER]<br><br>"+
    '[CENTER][COLOR=GREEN]Одобрено[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'В жалобы на тех',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Вы получили наказание от технического специалиста Вашего сервера. Вам следует обратиться в раздел жалоб на технических специалистов в случае, если Вы не согласны с наказанием.[/CENTER]<br><br>"+
    '[CENTER][COLOR=RED]Отказано[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'ППВ',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Воспользуйтесь одним из способов восстановления вашего игрового аккаунта, затем создайте повторное обжалование и прикрепите все необходимые доказательства, предварительно закройте конфиденциальную информацию.[/CENTER]<br><br>"+
    '[CENTER][COLOR=RED]Отказано[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Одобрено до мин.срока',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Ваше обжалование одобрено и ваше наказание будет снижено до минимального срока.[/CENTER]<br><br>"+
    '[CENTER][COLOR=GREEN]Одобрено[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Уже снизили',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Вам итак уже снизили наказание.[/CENTER]<br><br>"+
    '[CENTER][COLOR=RED]Отказано[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'У вас мин.нак',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Вам итак выдано минимальное наказание.[/CENTER]<br><br>"+
    '[CENTER][COLOR=RED]Отказано[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Отказано',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Данному обжалованию отказано.[/CENTER]<br><br>"+
    '[CENTER][COLOR=RED]Отказано[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Не готовы',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Администрация не готова снизить вам наказание.[/CENTER]<br><br>"+
    '[CENTER][COLOR=RED]Отказано[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: '3-е лицо',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Обжалование от 3-го лица.[/CENTER]<br><br>"+
    '[CENTER][COLOR=RED]Отказано[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Окно бана',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Прикрепите окно бана при входе в игру.[/CENTER]<br><br>"+
    '[CENTER][COLOR=RED]Отказано[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Слив, ПИВ, Махинации (отказ)',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Ваше обжалование не будет рассматриваться и будет закрыто так как ваше наказание соответствует причинам которые обжалованию не подлежат: различные формы слива, продажа игровой валюты, махинации, целенаправленный багоюз, продажа, передача аккаунта, сокрытие ошибок, багов системы, использование стороннего программного обеспечения, распространение конфиденциальной информации, обман администрации.[/CENTER]<br><br>"+
    '[CENTER][COLOR=RED]Отказано[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Скриншот переписки',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Прикрепите скриншот с перепиской.[/CENTER]<br><br>"+
    '[CENTER][COLOR=RED]Отказано[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Окно бана+скрин переписки',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Прикрепите окно бана при входе в игру. И скриншот переписки.[/CENTER]<br><br>"+
    '[CENTER][COLOR=RED]Отказано[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'nRP obman',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Свяжитесь с игроком для возврата средств, затем он должен написать обжалование со скриншотами переписки и окном блокировки аккаунта.[/CENTER]<br><br>"+
    '[CENTER][COLOR=RED]Отказано[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'nRP obman(вк отписать)',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Ваша задача отписать мне в вконтакте: <br>[QUOTE]https://vk.com/michael_tratyu - Михаил Тратуй.[/QUOTE][/CENTER]<br><br>"+
    '[CENTER][COLOR=RED]Отказано[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Не по форме',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Ваше обжалование составлено не по форме. Ознакомьтесь с [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-заявки-на-обжалование-на%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/'][COLOR=rgb(255,0,0)]«Правила подачи заявки на обжалование наказания».[/color][/URL][/CENTER]<br><br>"+
    '[CENTER][COLOR=RED]Отказано[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Рук Модер ДС',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Ваше обжалование будет передано [COLOR=rgb(43,108,196)]Руководителю модераторов Forum/Discord[/color] - @sakaro [Color=Orange]на рассмотрение[/color]. Просьба не создавать подобных тем.[/CENTER]<br>",
    prefix: PIN_PREFIX,
    status: true,
    },
    {
    title: 'ГА',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Ваше обжалование будет передано [Color=Red]Главному Администратору[/color] - @Liana_Mironova [Color=Orange]на рассмотрение[/color]. Просьба не создавать подобных тем.[/CENTER]<br>",
    prefix: GA_PREFIX,
    status: true,
    },
    {
    title: 'Специальной Администрации',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Ваше обжалование будет передано[COLOR=rgb(204,6,5)]Специальной Администрации[/color] - @Sander_Kligan, @Clarence Crown, @Dmitry Dmitrich, @Myron_Capone[/CENTER]<br><br>"+
    '[CENTER][Color=Orange]На рассмотрении.[/Color][/CENTER][/B][/SIZE]',
    prefix: SA_PREFIX,
    status: true,
    },
    {
    title: 'Команде проекта',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Ваше обжалование будет передано [COLOR=rgb(239,211,52)]Команде проекта.[/color][/CENTER]<br><br>"+
    '[CENTER][Color=Orange]На рассмотрении.[/Color][/CENTER][/B][/SIZE]',
    prefix: COMMAND_PREFIX,
    status: true,
    },

    {
        title: 'ЖАЛОБЫ НА ИГРОКОВ',
        style: 'width: 97%; background: #8a0002; box-shadow: 0px 0px 5px #fff',
    },
    {
        title:'Правила Role Play процесса',
        style: 'width: 97%; background: #8a0002; box-shadow: 0px 0px 5px #fff',
    },
    {
    title: 'NonRP Поведение',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | Jail 30 минут<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Уход от RP процесса',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | Jail 30 минут / Warn<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'NonRP Drive',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "2.03. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | Jail 30 минут<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'NonRP обман',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | PermBan<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'RP отыгровки в свою пользу',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "2.06. Запрещены любые Role Play отыгровки в свою сторону или пользу | Jail 30 минут<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'AFK no ESC',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "2.07. Запрещено нахождение в AFK без включенного ESC, создавая помеху другим игрокам | Kick<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Аморальные поведения',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | Jail 30 минут / Warn<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Слив склада',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле | Ban 15 - 30 дней / PermBan<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Обман в /do',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "2.10. Запрещено в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже | Jail 30 минут / Warn<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Фракц тс в л/ц',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    " 2.11. Запрещено использование рабочего или фракционного транспорта в личных целях | Jail 30 минут<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Затягивание RP процесса',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "2.12. Запрещено целенаправленное затягивание Role Play процесса | Jail 30 минут<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'DB',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | Jail 60 минут<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'RK',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "2.14. Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти | Jail 30 минут<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'TK',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | Jail 60 минут / Warn (за два и более убийства)<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'SK',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | Jail 60 минут / Warn (за два и более убийства)<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'PG',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "2.17. Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь | Jail 30 минут<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'MG',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | Mute 30 минут<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'DM',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | Jail 60 минут<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Mass DM',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | Warn / Ban 3 - 7 дней<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Попытка обхода багов',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "2.21. Запрещено пытаться обходить игровую систему или использовать любые баги сервера | Ban 15 - 30 дней / PermBan<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: '',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    " <br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'СБОРКА',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | Ban 15 - 30 дней / PermBan<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Сокрытие багов от администрации',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "2.23. Запрещено скрывать от администрации баги системы, а также распространять их игрокам | Ban 15 - 30 дней / PermBan<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Сокрытие нарушителей',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "2.24. Запрещено скрывать от администрации нарушителей или злоумышленников | Ban 15 - 30 дней / PermBan + ЧС проект<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Репутация проекта',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "2.25. Запрещены попытки или действия, которые могут навредить репутации проекта | PermBan + ЧС проекта<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Вред ресурсам',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "2.26. Запрещено намеренно наносить вред ресурсам проекта (игровые серверы, форум, официальные Discord-серверы и так далее) | PermBan + ЧС проекта<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Распространение информации',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "2.27. Запрещено распространение информации и материалов, которые имеют непосредственное отношение к работе администрации проекта | PermBan + ЧС проекта<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'покупка/продажа внутриигровой',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "2.28. Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги | PermBan с обнулением аккаунта + ЧС проекта<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Трансфер',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "2.29. Запрещен трансфер имущества между серверами проекта | PermBan с обнулением аккаунта<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Ущерб экономике',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "2.30. Запрещено пытаться нанести ущерб экономике сервера | Ban 15 - 30 дней / PermBan<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Реклама серверов, дискорд',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "2.31. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное | Ban 7 дней / PermBan<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Введение в заблуждение обман информации',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "2.32. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта | Ban 7 - 15 дней<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'IC и OOC конфликты о нац или религ',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "2.35. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | Mute 120 минут / Ban 7 дней<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'OOC угрозы',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "2.37. Запрещены OOC угрозы, в том числе и завуалированные | Mute 120 минут / Ban 7 дней<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Оск проекта',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'ЕПП на любом виде транспорта',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "2.46. Запрещено ездить по полям на любом транспорте | Jail 30 минут<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'ЕПП инко / фура',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "2.47. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) | Jail 60 минут<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Зад-е в каз,аукц,мп',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "2.50. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий | Ban 7 - 15 дней + увольнение из организации<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Неув общение к адм',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "2.54. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | Mute 180 минут<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Багаюз с аним',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. | Jail 60 / 120 минут<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
        title: 'ИГРОВЫЕ ЧАТЫ',
        style: 'width: 97%; background: #8a0002; box-shadow: 0px 0px 5px #fff',
    },
    {
    title: 'ЯЗЫК',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "3.01. Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке | Устное замечание / Mute 30 минут<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'CAPSLOCK',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | Mute 30 минут<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'любой оск сексизма в OOC',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | Mute 30 минут<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Упоминание / оск род',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | Mute 120 минут / Ban 7 - 15 дней<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Флуд',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | Mute 30 минут<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Злоуп.знаков',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "3.06. Запрещено злоупотребление знаков препинания и прочих символов | Mute 30 минут<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Оск секс',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "3.07. Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата | Mute 30 минут<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Слив ГЧ',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "3.08. Запрещены любые формы «слива» посредством использования глобальных чатов | PermBan<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },{
    title: '',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    " <br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Угрозы со стороны админ',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "3.09. Запрещены любые угрозы о наказании игрока со стороны администрации | Mute 30 минут<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Выдача адм',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "3.10. Запрещена выдача себя за администратора, если таковым не являетесь | Ban 7 - 15 + ЧС администрации<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Введение игроков путем злоуп ком',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "3.11. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | Ban 15 - 30 дней / PermBan<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'нарушение в репорт',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "3.12. Запрещено подавать репорт написанный транслитом, с сообщением не по теме (Offtop), с включенным Caps Lock и повторять обращение (если ответ был уже дан ранее) | Report Mute 30 минут<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Нецензурная брань в репорт',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "3.13. Запрещено подавать репорт с использованием нецензурной брани | Report Mute 30 минут<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Музыка в войс',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "3.14. Запрещено включать музыку в Voice Chat | Mute 60 минут<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Оск игроков / родню в войс ',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "3.15. Запрещено оскорблять игроков или родных в Voice Chat | Mute 120 минут / Ban 7 - 15 дней<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Шумы в войс',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "3.16. Запрещено создавать посторонние шумы или звуки | Mute 30 минут<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Реклама в войс',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    " 3.17. Запрещена реклама в Voice Chat не связанная с игровым процессом | Ban 7 - 15 дней<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Политика',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "3.18. Запрещено политическое и религиозное пропагандирование | Mute 120 минут / Ban 10 дней<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Транслит',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "3.20. Запрещено использование транслита в любом из чатов | Mute 30 минут<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Реклама промо',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | Ban 30 дней <br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'торговля в помещении',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) | Mute 30 минут<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'ппв',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "4.03. Запрещена совершенно любая передача игровых аккаунтов третьим лицам | PermBan<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },

    {
    title: 'НИК',
    content:
    '[SIZE=4][FONT=Courier New][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
    "[CENTER]Нарушитель будет наказан по пункту регламента: <br>"+
    "4.09. Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) | Устное замечание + смена игрового никнейма / PermBan<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
        title: 'ОТКАЗАННЫЕ',
        style: 'width: 97%; background: #8a0002; box-shadow: 0px 0px 5px #fff',
    },
    {
    title: 'нет условия',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]В доказательствах отсутствуют условия сделки.<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'нет /time',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]В доказательствах нет /time.   <br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Заголовок не по форме.',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Заголовок жалобы составлен не по форме. Ознакомьтесь с [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/'][COLOR=rgb(255,0,0)]«правилами подачи жалоб на игроков».[/color][/URL][/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Заголовок не по форме+жалоба',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Жалобы составлена не по форме. Ознакомьтесь с [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/'][COLOR=rgb(255,0,0)]«правилами подачи жалоб на игроков».[/color][/URL][/CENTER]<br><br>"+
    '[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Жалоба от 3-его лица',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER] Ваша жалоба от 3-го лица, что не подлежит рассмотрению. <br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'прошло 72 часа',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER] С момента нарушения игрока прошло 72 часа. <br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Не верные ники',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER] Игровой ник автора жалобы, ник игрока, на которого подается жалоба, должны быть указаны в соответствии с правилами подачи жалоб, даже если эта информация присутствует на доказательствах или в тексте жалобы. <br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Отредактированы доказательства',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER] Ваши доказательства отредактированы.<br> · Примечание: Доказательства должны быть в первоначальном виде. <br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'В жалобы на сотрудников организации',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Обратитесь в жалобы на сотрудников. Выберите нужную организацию, в которой заметили нарушение со стороны сотрудника:<br><br>[URL='https://vk.cc/cl0peI']Правительство (кликабельно)[/URL]<br>[URL='https://vk.cc/cl0q7P']ФСБ (кликабельно)[/URL]<br>[URL='https://vk.cc/cl0qkc']ГИБДД (кликабельно)[/URL]<br>[URL='https://vk.cc/cl0qmk']УМВД (кликабельно)[/URL]<br>[URL='https://vk.cc/cl0qAs']Армия (кликабельно)[/URL]<br>[URL='https://vk.cc/cl0qDY']Больница (кликабельно)[/URL]<br>[URL='https://vk.cc/cl0qIJ']СМИ (кликабельно)[/URL]<br>[URL='https://vk.cc/cl0qOr']ФСИН(кликабельно)[/URL]<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'В жб на адм',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER] Вам в жалобы на администрацию. <br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'В жалобы на лидеров',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER] Вам в жалобы на лидеров. <br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Нет нарушений со стороны игрока',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Нарушений со стороны игрока нет<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Нужен фрапс',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER] В данном случае нужен фрапс.<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Нужен фрапс+промотка чата',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER] Нужен фрапс и промотка чата.<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Слив склада ( но не лидер)',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER] Нужен фрапс, где будет видно, что именно Вы являетесь лидером семьи, информация о том сколько можно брать патронов, логирование количества взятия патронов/материалов игрока и /time.<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Слив склада (зам)',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Подавать жалобу должен лидер семьи.<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Не полный фрапс',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER] Не полный фрапс, или обрывается. Загрузите его на YouTube.<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Не работают доки',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Предоставленные доказательства не работают. <br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Теху',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER] Ваша жалоба будет передана [Color=Orange]на рассмотрение[/Color] [COLOR=rgb(255,69,0)]техническому специалисту[/COLOR] нашего сервера - @Fernando_Fererra<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: '',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]  <br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Недостаточно доков',
    content:
    '[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]Недостаточно доказательств о нарушении от игрока.<br><br>"+
    '[CENTER]Приятной игры на сервере [COLOR=rgb(144,0,32)]CHERRY[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    ]


    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        // Добавление кнопок при загрузке страницы
        addButton('На рассмотрении', 'pin', 'background: #420; border: 2px solid #a50; border-radius: 10px');
        addButton('Важно', 'Vajno', 'background: #400; border: 2px solid #a00; border-radius: 10px');
        addButton('Команде Проекта', 'teamProject', 'background: #004; border: 2px solid #00a; border-radius: 10px');
        addButton('ГА', 'Ga', 'background: #400; border: 2px solid #a00; border-radius: 10px');
        addButton('Спецу', 'Spec', 'background: #400; border: 2px solid #a00; border-radius: 10px');
        addButton('Одобрено', 'accepted', 'background: #040; border: 2px solid #0a0; border-radius: 10px');
        addButton('Отказано', 'unaccept', 'background: #400; border: 2px solid #a00; border-radius: 10px');
        addButton('Теху', 'Texy', 'background: #400; border: 2px solid #a00; border-radius: 10px');
        addButton('Закрыто', 'Zakrito', 'background: #400; border: 2px solid #a00; border-radius: 10px');
        addButton('Ожидание', 'Ojidanie', 'background: #444; border: 2px solid #aaa; border-radius: 10px');
        addAnswers();

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
        $('button#Realizovano').click(() => editThreadData(REALIZOVANO_PREFIX, false));
        $('button#Vajno').click(() => editThreadData(VAJNO_PREFIX, false));
        $('button#Rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false));
        $('button#Ojidanie').click(() => editThreadData(OJIDANIE_PREFIX, false));

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

    function addButton(name, id, style) {
        $('.button--icon--reply').before(
            `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px; ${style}">${name}</button>`,
        );
    }
    function addAnswers() {
        $('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 25px; border: 3px solid; border-radius: 20px; background: #850002; padding: 0px 27px 0px 27px; font-family: JetBrains Mono; border-color: #fc0509;">ОТВЕТЫ</button>`,
                                       );
    }

    function buttonsMarkup(buttons) {
        return `<div class="select_answer" style="display:flex; flex-direction:row; flex-wrap:wrap">${buttons
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:5px; ${btn.style}"><span class="button-text">${btn.title}</span></button>`,
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
            6 < hours && hours <= 11 ?
            'Доброе утро' :
            12 < hours && hours <= 17 ?
            'Добрый день' :
            18 < hours && hours <= 23 ?
            'Добрый вечер' :
            0 < hours && hours <= 5 ?
            'Доброй ночи' :
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
                    sticky: 1,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: 'json',
                }),
            }).then(() => location.reload());
        }
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
})();