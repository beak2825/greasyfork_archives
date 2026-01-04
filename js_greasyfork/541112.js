// ==UserScript==
// @name         скрипт очень крутой для пацанов супер новый молодежный
// @namespace    http://tampermonkey.net/
// @version      3.9
// @description  Для рук-ва 79
// @author       ensemble
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @license 	 MIT
// @icon https://i.postimg.cc/fTr94wQS/e8911e8d49b0cd937c49b3fac9d4896c-1.jpg
// @downloadURL https://update.greasyfork.org/scripts/541112/%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%BE%D1%87%D0%B5%D0%BD%D1%8C%20%D0%BA%D1%80%D1%83%D1%82%D0%BE%D0%B9%20%D0%B4%D0%BB%D1%8F%20%D0%BF%D0%B0%D1%86%D0%B0%D0%BD%D0%BE%D0%B2%20%D1%81%D1%83%D0%BF%D0%B5%D1%80%20%D0%BD%D0%BE%D0%B2%D1%8B%D0%B9%20%D0%BC%D0%BE%D0%BB%D0%BE%D0%B4%D0%B5%D0%B6%D0%BD%D1%8B%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/541112/%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%BE%D1%87%D0%B5%D0%BD%D1%8C%20%D0%BA%D1%80%D1%83%D1%82%D0%BE%D0%B9%20%D0%B4%D0%BB%D1%8F%20%D0%BF%D0%B0%D1%86%D0%B0%D0%BD%D0%BE%D0%B2%20%D1%81%D1%83%D0%BF%D0%B5%D1%80%20%D0%BD%D0%BE%D0%B2%D1%8B%D0%B9%20%D0%BC%D0%BE%D0%BB%D0%BE%D0%B4%D0%B5%D0%B6%D0%BD%D1%8B%D0%B9.meta.js
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
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana] Текст [/FONT][/CENTER]<br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
    },
    {
     title: '___________________________________________ОБЖАЛОВАНИЯ________________________________________________',
    },
    {
        title: 'обж на рассмотрении',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Ваше обжалование взято [COLOR=orange]на рассмотрение.[/COLOR] Создавать копии данной темы не требуется, ответ будет дан в этой теме, как только это будет возможно.[/FONT][/CENTER]<br>" +
        '<br>[CENTER][FONT=Verdana]Ожидайте ответа.[/FONT][/CENTER]',
        prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'обж для ГА',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Ваше обжалование передано на рассмотрение [Color=red]Главному Администратору. [/FONT][/COLOR][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana]Ожидайте ответа.[/FONT][/CENTER]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'обж для Спец адм',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Ваше обжалование передано на рассмотрение [Color=red]Специальной администрации[/COLOR] проекта.[/FONT][/CENTER] <br>" +
        "[CENTER][FONT=Verdana] <br>" +
        '[CENTER][FONT=Verdana]Иногда рассмотрение подобных обращений может занять более двух дней. Убедительная просьба не создавать копии/дубликаты данной темы.[/FONT][/CENTER]',
      prefix: SPECY_PREFIX,
	  status: true,
    },
    {
      title: 'обж для ЗРМ/РМ',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Ваше обжалование передано на рассмотрение[Color=#1E90FF] Руководству модерации проекта. [/FONT][/COLOR][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana]Ожидайте ответа.[/FONT][/CENTER]',
      prefix:  COMMAND_PREFIX,
	  status: true,
    },
    {
        title: 'до минимальных мер',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Срок наказания будет снижен до минимальных мер.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
        prefix: ACCEPT_PREFIX,
      status: true,
    },
    {
        title: 'наказание будет снято',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Администрация сервера готова пойти к вам навстречу и снять ваше наказание.[/FONT][/CENTER]<br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
        prefix: ACCEPT_PREFIX,
      status: true,
    },
    {
      title: 'обж отказано',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]В обжаловании отказано.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'обж пишет обманутая сторона',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Обжалование должна писать обманутая сторона, для этого вам нужно связаться с игроком которого вы обманули и обсудить условия возвращения имущества.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'возврат имущества игроку',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Аккаунт игрока будет разблокирован на 24 часа для возврата имущества/выдачи компенсации пострадавшей стороне.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana]Напоминаем, [U]любые попытки обмануть администрацию и перенести имущество на другие аккаунты караются блокировкой аккаунтов без возможности дальнейшего обжалования.[/U][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'на данный момент отказ',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]На данный момент мы не готовы пойти к вам навстречу и снизить ваше наказание.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ссылку на вк',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Прикрепите ссылку на вашу страницу ВК.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana]Ожидаю вашего ответа.[/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'отсутсвуют чс на сервере',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]У вас остуствуют черные списки, которые были выданы на нашем сервере.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не по форме',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Ваше обжалование составлено не по форме.<br>Убедительная просьба ознакомиться [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/']с правилами подачи заявок на обжалование наказания (Нажмите сюда)[/URL]. [/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'смена ника',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Ваш аккаунт разблокирован на 24 часа, в течение этого времени смените игровой никнейм.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana]Обязательно отпишите в данную тему когда смените никнейм, тема открыта. В случае, если никнейм не будет сменен, аккаунт будет заблокирован без возможности обжалования.[/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'не сменен ник',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Вами не было дано обратной связи, никнейм не был сменен.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'ник сменен',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Смена никнейма подтверждена, блокировка полностью снята.[/FONT][/CENTER]<br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
        prefix: ACCEPT_PREFIX,
      status: true,
    },
    {
      title: 'прошло 2 дня',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]С момента получения наказания прошло более 48-ми часов, обжалование не подлежит рассмотрению.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'обж от 3-го лица',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Обжалование написано от 3-го лица. Обращение должно быть составлено владельцем аккаунта.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'дублирование темы',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Обжалование продублировано, вам уже был дан ответ. Напомним, что за неоднократное дублирование тем на ваш форумный аккаунт могут быть наложены санкции в виде блокировки.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на теха',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Наказание было выдано техническим специалистом, обратитесь в раздел [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/']Жалобы на технических специалистов (Нажмите сюда)[/URL].[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'обжалованию не подлежит',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте. <br>' +
        "[FONT=Verdana]Ваше наказание не подлежит обжалованию. Обращаем ваше внимание на список наказаний, не подлежащих обжалованию/амнистии:[/FONT] <br>" +
        "[QUOTE][FONT=Verdana]- различные формы «слива»[/FONT]<br>" +
        "[FONT=Verdana]- продажа игровой валюты[/FONT]<br>" +
        "[FONT=Verdana]- махинации[/FONT]<br>" +
        "[FONT=Verdana]- целенаправленный багоюз[/FONT]<br>" +
        "[FONT=Verdana]- продажа, передача аккаунта[/FONT]<br>" +
        "[FONT=Verdana]- сокрытие ошибок, багов системы[/FONT]<br>" +
        "[FONT=Verdana]- использование стороннего программного обеспечения[/FONT]<br>" +
        "[FONT=Verdana]- распространение конфиденциальной информации[/FONT]<br>" +
        "[FONT=Verdana]-  обман администрации.[/FONT][/QUOTE]<br>" +
        '<br>[FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'переношу в нужный раздел',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Переношу вашу тему в необходимый раздел.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana]Ожидайте ответа.[/FONT][/CENTER]',
      prefix: WAIT_PREFIX,
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
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Запрошу доказательства у администратора. Ожидайте ответа. [/FONT][/CENTER]<br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=orange]На рассмотрении.[/COLOR][/FONT][/CENTER]',
        prefix: PIN_PREFIX,
      status: true,
    },
    {
        title: 'На рассмотрении(жб)',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Ваша жалоба взята [COLOR=orange]на рассмотрение.[/COLOR] Создавать копии данной темы не требуется, ответ будет дан в этой теме, как только это будет возможно.[/FONT][/CENTER]<br>" +
        '<br>[CENTER][FONT=Verdana]Ожидайте ответа.[/FONT][/CENTER]',
        prefix: PIN_PREFIX,
      status: true,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴передача ЖБ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'для Спец адм',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Ваша жалоба была передана на рассмотрение [Color=red]Специальной администрации[/COLOR] проекта.[/FONT][/CENTER] <br>" +
        "[CENTER][FONT=Verdana] <br>" +
        '[CENTER][FONT=Verdana]Иногда рассмотрение подобных обращений может занять более двух дней. Убедительная просьба не создавать копии/дубликаты данной темы.[/FONT][/CENTER]',
      prefix: SPECY_PREFIX,
	  status: true,
    },
    {
      title: 'Для ЗГА ГОСС ОПГ',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Ваша жалоба была передана на рассмотрение  [Color=red] Заместителю Главного Администратора.  [/FONT][/COLOR][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana]Ожидайте ответа.[/FONT][/CENTER]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'Для ОЗГА',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Ваша жалоба была передана на рассмотрение [Color=red] Основному Заместителю Главного Администратора.  [/FONT][/COLOR][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana]Ожидайте ответа.[/FONT][/CENTER]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'для ГА',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Ваша жалоба передана на рассмотрение [Color=red]Главному Администратору.[/FONT][/COLOR][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana]Ожидайте ответа.[/FONT][/CENTER]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'для теха',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Ваша жалоба была передана на рассмотрение [Color=ORANGE]Tехническому специалисту. [/FONT][/COLOR][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana]Ожидайте ответа.[/FONT][/CENTER]',
      prefix: TEX_PREFIX,
	  status: 123,
    },
    {
      title: 'для КП',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Жалоба передана на рассмотрение[Color=YELLOW] Команде проекта. [/FONT][/COLOR][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana]Ожидайте ответа.[/FONT][/CENTER]',
      prefix:  COMMAND_PREFIX,
	  status: true,
    },
    {
      title: 'для ЗРМ/РМ',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Жалоба передана на рассмотрение[Color=#1E90FF] Руководству модерации проекта. [/FONT][/COLOR][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana]Ожидайте ответа.[/FONT][/CENTER]',
      prefix:  COMMAND_PREFIX,
	  status: true,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ЖБ одобрена ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Наказание будет снято',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Наказание будет снято. Приносим извинения за доставленные неудобства.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Будет проведена работа',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana] С администратором будет проведена необходимая работа.<br>Приносим извинения за доставленные неудобства.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=rgb(250,0 ,0)]Закрыто.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'беседа без наказания',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]С администратором будет проведена беседа, приносим извинения за доставленные неудобства.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'беседа с наказанием',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]По отношению к администратору будут приняты необходимые меры, благодарим за обращение.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'неправильный вердикт жб',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]С администратором будет проведена работа. Жалоба будет пересмотрена.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'неправильный вердикт био',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]С администратором будет проведена работа. RolePlay биография будет пересмотрена.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴отказ жб ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
        title: 'Наказание выдано верно',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Доказательства предоставлены, наказание выдано верно.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
        title: 'наказание через форум',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Наказание было выдано в связи с поступлением на вас жалобы на форуме. <br> Доказательства предоставлены, наказание выдано верно.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
        title: 'Бан по IP',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Попробуйте перезагрузить интернет или телефон и снова войти.<br>Проблема должна пропасть.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'нарушений не найдено',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Нарушений со стороны администратора выявлено не было.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'недостаток докв',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Недостаточно доказательств на нарушение от Администратора. [/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'дублирование',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Просим вас воздержаться от создания дубликатов тем с подобным содержанием, в противном случае на ваш форумный аккаунт могут быть наложены санкции в виде блокировки. [/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'не по форме',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-администрацию.3429349/']с правилами подачи жалоб на администрацию (Нажмите сюда)[/URL]. [/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нет тайма',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]На ваших доказательствах отсутствует /time. Для более оперативного и корректного рассмотрения вашей жалобы нам потрубется /time.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
        title: 'Отсутвуют доква',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]В жалобе отсутствуют доказательства. Жалобы, в которых отсутстуют доказательства не подлежат рассмотрению.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'более 48 часов',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]С момента выдачи наказания прошло более 48-ми часов.<br> Жалоба не подлежит рассмотрению. [/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'соц сеть',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). [/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'неадекватность в жб',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Жалобы, в которых присутствует ненормативная лексика и/или неуважение к администрации рассмотрению не подлежат. [/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'нужен фрапс + промотка чата',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]В таких случаях нужен фрапс + промотка чата. [/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'фрапс обрывается',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Ваш фрапс обрывается, загрузите полный фрапс на ютуб. [/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Адм снят/ушел псж',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana] Игрок был снят/ушел с поста администратора. [/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'не работают доки',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana] Доказательства не работают. [/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'доква отредактированы',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Ваши доказательства отредактированы. [/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: '3-е лицо',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Жалоба от третьего лица не принимается. [/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'не тот сервер',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Вы ошиблись сервером.<br> Переношу жалобу в соответствующий раздел.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не написал ник',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Игровой ник автора жалобы, ник Администратора, на которого подается жалоба, должны быть указаны в соответствии с правилами подачи жалоб, даже если эта информация присутствует на доказательствах или в тексте жалобы. [/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не по теме',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]]Ваше сообщение никоим образом не относится к предназначению данного раздела.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'закрыт доступ к гугл диску',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]К гугл диску закрыт доступ, пожалуйста откройте доступ, либо загрузите доказательства на фотохостинг(YouTube, Япикс, imgur). <br> [url=https://postimages.org/][img]https://i.postimg.cc/FRpfsF2k/image.png[/img][/url][/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'закрыт доступ к яндекс диску',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]К яндекс диску закрыт доступ, пожалуйста откройте доступ, либо загрузите доказательства на фотохостинг(YouTube, Япикс, imgur). <br> [url=https://postimages.org/][img]https://i.postimg.cc/7YvGNcwR/image.png[/img][/url][/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'уже на рассмотрении',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Жалоба такого же содержания от Вас уже находится на рассмотрении.<br> Ожидайте ответа в прошлой жалобе и не нужно дублировать ее. [/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'прикрепите ссылку на жб',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Прикрепите ссылку на тему.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana]Тема открыта.[/FONT][/CENTER]',
      prefix: WAIT_PREFIX,
	  status: false,
    },
    {
      title: 'нет окна бана',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]В предоставленных доказательствах отсутствует окно блокировки аккаунта. Для более оперативного рассмотрения вашего обращения зайдите на сервер и прикрепите окно блокировки аккаунта в новой жалобе.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'нет строки наказания',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]В предоставленных доказательствах отсутствует строка наказания от администратора. Для более оперативного рассмотрения вашего обращения нам потребуется строка с выданным наказанием от администратора с /time.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
        title: 'кф правильный вердикт (жб)',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Со стороны Куратора форума отсутствуют нарушения, жалоба рассмотрена корректно.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
        title: 'кф правильный вердикт (био)',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Со стороны Куратора форума отсутствуют нарушения, RolePlay биография рассмотрена корректно.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
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
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Игрок будет заблокирован. Благодарим за обращение[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'Будет наказан',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Игрок будет наказан. Благодарим за обращение[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴отказ жб ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'нарушений нет',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Нарушений со стороны игрока выявлено не было.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'слот',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Семейный слот - не является элементом рыночных отношений. Системно его передача, покупка и продажа напрямую между игроками не предусмотрена.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'недостаточно докв',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Предоставленных доказательств на нарушение от игрока недостаточно.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'отсутствуют доква',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]В вашей жалобе отсутствуют доказательства.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'отредакт доква',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Доказательства, которые были подвергнуты редактированию рассмотрению не подлежат.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'не по форме',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/']с правилами подачи жалоб на игроков[/URL].[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'нет /time',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]На ваших доказательствах отсутствует /time.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'прошло 3 дня',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]С момента совершенного нарушения со стороны игрока прошло более 72 часов. Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'некорректные условия',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]В ваших доказательствах отсутствуют, либо некорректно обговорены условия сделки.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'нужен фрапс',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana] В данной ситуации обязательно необходима запись экрана.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'доквы не открываются',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Ваши доказательства не открываются.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'займ через трейд',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Займ может быть осуществлен только через зачисление игровых ценностей на банковский счет.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'был наказан',
      content:
		'[CENTER][FONT=Verdana]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=Verdana]Данный игрок уже был наказан администрацией сервера. Мы благодарны вам за содействие и бдительность.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=Verdana][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },

];

  $(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
    addButton('Закрыто', 'Close');
    addButton('Ответы', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => pasteContent(16, threadData, true));
	$('button#Ga').click(() => pasteContent(8, threadData, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#Texy').click(() => pasteContent(7, threadData, true));
	$('button#Rasmotreno').click(() => editThreadData(RASSMOTENO_PREFIX, false));
	$('button#Close').click(() => editThreadData(CLOSE_PREFIX, false));

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