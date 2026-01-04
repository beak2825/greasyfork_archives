// ==UserScript==
// @name         скрипт очень крутой для пацанов
// @namespace    http://tampermonkey.net/
// @version      3.9
// @description  Для рук-ва 79
// @author       ensemble
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @license 	 MIT
// @icon https://i.postimg.cc/s2LH4FPV/photo-2025-03-19-22-56-32.jpg
// @downloadURL https://update.greasyfork.org/scripts/531432/%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%BE%D1%87%D0%B5%D0%BD%D1%8C%20%D0%BA%D1%80%D1%83%D1%82%D0%BE%D0%B9%20%D0%B4%D0%BB%D1%8F%20%D0%BF%D0%B0%D1%86%D0%B0%D0%BD%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/531432/%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%BE%D1%87%D0%B5%D0%BD%D1%8C%20%D0%BA%D1%80%D1%83%D1%82%D0%BE%D0%B9%20%D0%B4%D0%BB%D1%8F%20%D0%BF%D0%B0%D1%86%D0%B0%D0%BD%D0%BE%D0%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';
const UNACCEPT_PREFIX = 4;
const ACCEPT_PREFIX = 8;
const RASSMOTENO_PREFIX = 9;
const PIN_PREFIX = 2;
const GA_PREFIX = 12;
const COMMAND_PREFIX = 10;
const DECIDED_PREFIX = 6;
const WAIT_PREFIX = 14;
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEX_PREFIX = 13;
const buttons = [
    {
      title: 'свой ответ',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman] . [/COLOR][/FONT][/CENTER]<br><br>" +
        '[CENTER][B][FONT=times new roman][COLOR=red] Закрыто. [/COLOR][/FONT][/CENTER]',
    },
    {
     title: '___________________________________________ОБЖАЛОВАНИЯ________________________________________________',
    },
    {
        title: 'до минимальных мер',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Срок наказания будет снижен до минимальных мер.[/FONT][/B][/COLOR][/CENTER]<br><br>" +
        '[CENTER][B][FONT=times new roman][COLOR=rgb(27, 255, 47)]Одобрено.[/COLOR][/FONT][/CENTER]',
        prefix: ACCEPT_PREFIX,
      status: true,
    },
    {
        title: 'наказание будет снято',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Наказание будет снято.[/FONT][/B][/COLOR][/CENTER]<br><br>" +
        '[CENTER][B][FONT=times new roman][COLOR=rgb(27, 255, 47)]Одобрено.[/COLOR][/FONT][/CENTER]',
        prefix: ACCEPT_PREFIX,
      status: true,
    },
    {
      title: 'обж отказано',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]В обжаловании отказано.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'на данный момент отказ',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]На данный момент мы не готовы пойти к вам навстречу и снизить ваше наказание.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ссылку на вк',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Прикрепите ссылку на вашу страницу ВК.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(230, 230, 250)]Ожидаю вашего ответа.[/COLOR][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'не по форме',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваше обжалование составлено не по форме.<br>Убедительная просьба ознакомиться [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/']с правилами подачи заявок на обжалование наказания (кликабельно)[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'смена ника',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваш аккаунт разблокирован на 24 часа, в течение этого времени смените игровой никнейм.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(230, 230, 250)]Обязательно отпишите в данную тему когда смените никнейм, тема открыта. В случае, если никнейм не будет сменен, аккаунт будет заблокирован без возможности обжалования.[/COLOR][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'не сменен ник',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Вами не было дано обратной связи, никнейм не был сменен.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'ник сменен',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Смена никнейма подтверждена, блокировка полностью снята.[/FONT][/B][/COLOR][/CENTER]<br><br>" +
        '[CENTER][B][FONT=times new roman][COLOR=rgb(27, 255, 47)]Одобрено.[/COLOR][/FONT][/CENTER]',
        prefix: ACCEPT_PREFIX,
      status: true,
    },
    {
      title: 'прошло 2 дня',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]С момента получения наказания прошло более 48-ми часов, обжалование не подлежит рассмотрению.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'дублирование темы',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Обжалование продублировано, вам уже был дан ответ. Напомним, что за неоднократное дублирование тем на ваш форумный аккаунт могут быть наложены санкции в виде блокировки.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на теха',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Наказание было выдано техническим специалистом, обратитесь в раздел [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/']Жалобы на технических специалистов (кликабельно)[/URL].[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'обжалованию не подлежит',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR] <br><br>' +
        "[COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваше наказание не подлежит обжалованию. Обращаем ваше внимание на список наказаний, не подлежащих обжалованию/амнистии:[/COLOR][/FONT] <br>" +
        "[QUOTE][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]- различные формы «слива»[/COLOR][/FONT]<br>" +
        "[COLOR=rgb(230, 230, 250)][B][FONT=times new roman]- продажа игровой валюты[/COLOR][/FONT]<br>" +
        "[COLOR=rgb(230, 230, 250)][B][FONT=times new roman]- махинации[/COLOR][/FONT]<br>" +
        "[COLOR=rgb(230, 230, 250)][B][FONT=times new roman]- целенаправленный багоюз[/COLOR][/FONT]<br>" +
        "[COLOR=rgb(230, 230, 250)][B][FONT=times new roman]- продажа, передача аккаунта[/COLOR][/FONT]<br>" +
        "[COLOR=rgb(230, 230, 250)][B][FONT=times new roman]- сокрытие ошибок, багов системы[/COLOR][/FONT]<br>" +
        "[COLOR=rgb(230, 230, 250)][B][FONT=times new roman]- использование стороннего программного обеспечения[/COLOR][/FONT]<br>" +
        "[COLOR=rgb(230, 230, 250)][B][FONT=times new roman]- распространение конфиденциальной информации[/COLOR][/FONT]<br>" +
        "[COLOR=rgb(230, 230, 250)][B][FONT=times new roman]-  обман администрации.[/COLOR][/FONT][/QUOTE]<br>" +
        '[FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
     title: '_________________________________________________ЖБ НА АДМ______________________________________________________',
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴На рассмотрении╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Запрошу доква(опру)',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Запросил доказательства у администратора.<br> Не нужно создавать копии этой жалобы, ожидайте ответа в данной теме.[/FONT][/B][/COLOR][/CENTER]<br><br>" +
        '[CENTER][B][FONT=times new roman][COLOR=rgb(230, 230, 250)]На рассмотрении.[/COLOR][/FONT][/CENTER]',
        prefix: PIN_PREFIX,
      status: true,
    },
    {
        title: 'На рассмотрении(жб)',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваша жалоба находится в процессе рассмотрения администрации сервера.[/FONT][/B][/COLOR][/CENTER]<br><br>" +
        '[CENTER][B][FONT=times new roman][COLOR=rgb(230, 230, 250)]Создавать копии данной темы - не требуется, ответ будет дан в этой теме, как только это будет возможно. Благодарим за терпение и ожидание.[/COLOR][/FONT][/CENTER]',
        prefix: PIN_PREFIX,
      status: true,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴передача ЖБ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'для Спец адм',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваша жалоба была передана на рассмотрение [Color=rgb(255, 0, 0)]Специальной администрации[/COLOR] проекта.[/FONT][/B][/COLOR][/CENTER] <br>" +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman] <br>" +
        '[CENTER][B][FONT=times new roman][COLOR=rgb(230, 230, 250)]Иногда решение/рассмотрение подобных жалоб может занять более двух дней, убедительная просьба не создавать дубликаты данной темы.[/COLOR][/FONT][/CENTER]',
      prefix: SPECY_PREFIX,
	  status: true,
    },
    {
      title: 'Для ЗГА ГОСС ОПГ',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваша жалоба была передана на рассмотрение  [Color=rgb(255, 0, 0)] Заместителю Главного Администратора по направлению ГОСС / ОПГ. [/Color] [/FONT][/B][/COLOR][/CENTER] <br><br>" +
        '[CENTER][B][FONT=times new roman][COLOR=rgb(230, 230, 250)]Ожидайте ответа.[/COLOR][/FONT][/CENTER]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'Для ОЗГА',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваша жалоба была передана на рассмотрение [Color=rgb(255, 0, 0)] Основному Заместителю Главного Администратора. [/Color] [/FONT][/B][/COLOR][/CENTER] <br>" +
        '[CENTER][B][FONT=times new roman][COLOR=rgb(230, 230, 250)]Ожидайте ответа.[/COLOR][/FONT][/CENTER]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'для ГА',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваша жалоба была передана на рассмотрение [Color=rgb(255, 0, 0)]Главному Администратору.[/COLOR] [/FONT][/B][/COLOR][/CENTER] <br>" +
        '[CENTER][B][FONT=times new roman][COLOR=rgb(230, 230, 250)]Ожидайте ответа.[/COLOR][/FONT][/CENTER]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'для рук-ва',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Жалоба передана на рассмотрение Руководству сервера.[/COLOR] [/FONT][/B][/COLOR][/CENTER] <br>" +
        '[CENTER][B][FONT=times new roman][COLOR=rgb(230, 230, 250)]Ожидайте ответа.[/COLOR][/FONT][/CENTER]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'для теха',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваша жалоба была передана на рассмотрение [Color=rgb(178, 34, 34)]Tехническому специалисту.[/COLOR] [/FONT][/B][/COLOR][/CENTER] <br>" +
        '[CENTER][B][FONT=times new roman][COLOR=rgb(230, 230, 250)]Ожидайте ответа.[/COLOR][/FONT][/CENTER]',
      prefix: TEX_PREFIX,
	  status: 123,
    },
    {
      title: 'для Куратора',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваша жалоба была передана на рассмотрение[Color=rgb(128, 0, 128)]Куратору Администрации.[/COLOR] [/FONT][/B][/COLOR][/CENTER] <br>" +
        '[CENTER][B][FONT=times new roman][COLOR=rgb(230, 230, 250)]Ожидайте ответа.[/COLOR][/FONT][/CENTER]',
      prefix:  PIN_PREFIX,
	  status: true,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ЖБ одобрена ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Наказание выдано ошибочно',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Наказание было выдано по ошибке, оно будет снято. С администратором будет проведена необходимая работа, приносим извинения за предоставленные неудобства.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(27, 255, 47)]Одобрено.[/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Будет проведена работа',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman] С Администратором будет проведена необходимая работа.<br>Приносим извинения за предоставленные неудобства.[/color][/FONT][/CENTER] <br>" +
        '[CENTER][B][FONT=times new roman][COLOR=rgb(250,0 ,0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'беседа без наказания',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]С администратором будет проведена беседа, приносим извинения за предоставленные неудобства.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(27, 255, 47)]Одобрено.[/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'беседа с наказанием',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]По отношению к администратору будут приняты необходимые меры, благодарим за обращение.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(27, 255, 47)]Одобрено.[/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'кф неправильный вердикт (жб)',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]С куратором форума будет проведена работа, жалоба будет пересмотрена.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(27, 255, 47)]Одобрено.[/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'кф неправильный вердикт (био)',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]С куратором форума будет проведена работа, RolePlay биография будет пересмотрена.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(27, 255, 47)]Одобрено.[/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴отказ жб ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
        title: 'Наказание выдано верно',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Доказательства предоставлены, наказание выдано верно.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
        title: 'Бан по IP',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Попробуйте перезагрузить интернет или телефон и снова войти.<br>Проблема должна пропасть.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'нарушений не найдено',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Нарушений со стороны администратора выявлено не было.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'недостаток докв',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Недостаточно доказательств на нарушение от Администратора. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Ответ дан в прошлой жб',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Вам уже был дан ответ, напомним, что за неоднократное дублирование тем на ваш форумный аккаунт могут быть наложены санкции в виде блокировки.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'не по форме',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-администрацию.3429349/']с правилами подачи жалоб на администрацию[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нет тайма',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]На ваших доказательствах отсутствует /time. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
        title: 'Отсутвуют доква',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Для рассмотрения жалобы необходимы докозательства.<br>Жалобы без докозательств не рассматриваются. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'более 48 часов',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]С момента выдачи наказания прошло более 48-ми часов.<br>Ваша жалоба не подлежит рассмотрению. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'соц сеть',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'неадекватность в жб',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Жалобы, в которых присутствует ненормативная лексика и/или неуважение к администрации рассмотрению не подлежат. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'нужен фрапс + промотка чата',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]В таких случаях нужен фрапс + промотка чата. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'фрапс обрывается',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваш фрапс обрывается, загрузите полный фрапс на ютуб. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Адм снят/ушел псж',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman] Игрок был снят/ушел с поста администратора. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'не работают доки',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman] Доказательства не работают. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'доква отредактированы',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваши доказательства отредактированы. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: '3-е лицо',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Жалоба от третьего лица не принимается. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'не тот сервер',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Вы ошиблись сервером.<br> Переношу жалобу в соответствующий раздел.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не написал ник',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Игровой ник автора жалобы, ник Администратора, на которого подается жалоба, должны быть указаны в соответствии с правилами подачи жалоб, даже если эта информация присутствует на доказательствах или в тексте жалобы. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не по теме',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]]Ваше сообщение никоим образом не относится к предназначению данного раздела.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'закрыт доступ к гугл диску',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]К гугл диску закрыт доступ, пожалуйста откройте доступ, либо загрузите доказательства на фотохостинг(YouTube, Япикс, imgur). <br> [SPOILER=Скрин][url=https://postimages.org/][img]https://i.postimg.cc/FRpfsF2k/image.png[/img][/url][/SPOILER] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'закрыт доступ к яндекс диску',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]К яндекс диску закрыт доступ, пожалуйста откройте доступ, либо загрузите доказательства на фотохостинг(YouTube, Япикс, imgur). <br> [SPOILER=Скрин][url=https://postimages.org/][img]https://i.postimg.cc/7YvGNcwR/image.png[/img][/url][/SPOILER] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'уже на рассмотрении',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Жалоба такого же содержания от Вас уже находится на рассмотрении.<br> Ожидайте ответа в прошлой жалобе и не нужно дублировать ее. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'прикрепите ссылку на жб',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Прикрепите ссылку на тему.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(230, 230, 250)]Тема открыта.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'нет окна бана',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]В предоставленных доказательствах отсутствует окно блокировки аккаунта. Для более оперативного рассмотрения вашего обращения зайдите на сервер и прикрепите окно блокировки аккаунта в новой жалобе.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'нет строки наказания',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]В предоставленных доказательствах отсутствует строка наказания от администратора.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
        title: 'кф правильный вердикт (жб)',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Со стороны Куратора форума отсутствуют нарушения, жалоба рассмотрена корректно.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
        title: 'кф правильный вердикт (био)',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Со стороны Куратора форума отсутствуют нарушения, RolePlay биография рассмотрена корректно.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: '___________________________________________________ЖБ На Игроков_____________________________________________________',
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴жб одобрена ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
        title: 'Будет забанен',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Игрок будет заблокирован. Благодарим за обращение[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(27, 255, 47)]Одобрено.[/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'Будет наказан',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Игрок будет наказан. Благодарим за обращение[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(27, 255, 47)]Одобрено.[/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴отказ жб ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'нарушений нет',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Нарушений со стороны игрока выявлено не было.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'слот',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Семейный слот - не является элементом рыночных отношений. Системно его передача, покупка и продажа напрямую между игроками не предусмотрена.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'недостаточно докв',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Предоставленных доказательств на нарушение от игрока недостаточно.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'отсутствуют доква',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]В вашей жалобе отсутствуют доказательства.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'отредакт доква',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Доказательства, которые были подвергнуты редактированию рассмотрению не подлежат.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'не по форме',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/']с правилами подачи жалоб на игроков[/URL].[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'нет /time',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]На ваших доказательствах отсутствует /time.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'прошло 3 дня',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]С момента совершенного нарушения со стороны игрока прошло более 72 часов. Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'некорректные условия',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]В ваших доказательствах отсутствуют, либо некорректно обговорены условия сделки.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'нужен фрапс',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman] В данной ситуации обязательно необходима запись экрана.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'доквы не открываются',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваши доказательства не открываются.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'займ через трейд',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Займ может быть осуществлен только через зачисление игровых ценностей на банковский счет.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'был наказан',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Данный игрок уже был наказан администрацией сервера. Мы благодарны вам за содействие и бдительность.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },

];

  $(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
    addButton('На рассмотрение', 'pin');
    addButton('ГА', 'Ga');
    addButton('Одобрено ✅', 'accepted');
    addButton('Отказано ❌', 'unaccept');
    addButton('Тех. Специалисту', 'Texy');
    addButton('Рассмотрено', 'Rasmotreno');
    addButton('Закрыто', 'Close');
    addButton('Ответы', 'selectAnswer');
    addButton('Спецу', 'Spec');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => pasteContent(2, threadData, true));
	$('button#Ga').click(() => pasteContent(8, threadData, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#Texy').click(() => pasteContent(7, threadData, true));
	$('button#Rasmotreno').click(() => editThreadData(RASSMOTENO_PREFIX, false));
	$('button#Close').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));

$(`button#selectAnswer`).click(() => {
XF.alert(buttonsMarkup(buttons), null, 'ВЫБЕРИТЕ ОТВЕТ');
buttons.forEach((btn, id) => {
if (id > 1) {
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
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 0px 20px; border-color: green; border-style: dashed solid; margin-right: 7px; margin-bottom: 10px; background: green; text-decoration-style: wavy;">${name}</button>`,
);
}

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
  .map(
	(btn, i) =>
	  `<button id="answers-${i}" class="button--primary button ` +
	  `rippleButton" style="border-radius: 10px; margin-right: 10px; margin-bottom: 10px"><span class="button-text">${btn.title}</span></button>`,
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
            discussion_open: 0,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
	if(pin == 123){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
            discussion_open: 1,
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
// Перемещение темы
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