// ==UserScript==
// @name         скрипт очень крутой для пацанов
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  Для руководства KALUGA (от 14.09.25)
// @author       ensemble mansory
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @license 	 MIT
// @icon https://i.postimg.cc/LXGCnTn7/6713bfbf59ea100676740f11f338bf8c.jpg
// @downloadURL https://update.greasyfork.org/scripts/543026/%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%BE%D1%87%D0%B5%D0%BD%D1%8C%20%D0%BA%D1%80%D1%83%D1%82%D0%BE%D0%B9%20%D0%B4%D0%BB%D1%8F%20%D0%BF%D0%B0%D1%86%D0%B0%D0%BD%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/543026/%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%BE%D1%87%D0%B5%D0%BD%D1%8C%20%D0%BA%D1%80%D1%83%D1%82%D0%BE%D0%B9%20%D0%B4%D0%BB%D1%8F%20%D0%BF%D0%B0%D1%86%D0%B0%D0%BD%D0%BE%D0%B2.meta.js
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
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms] Текст [/FONT][/CENTER]<br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
    },
    {
     title: 'ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤОБЖАЛОВАНИЯㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ',
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴обж на рассмотрении╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
        title: 'обж на рассмотрении',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Ваше обжалование взято [COLOR=orange]на рассмотрение[/COLOR]. Мы изучим ситуацию и дадим ответ.[/FONT][/CENTER]<br>" +
        '<br>[CENTER][FONT=trebuchet ms]Ожидайте.[/FONT][/CENTER]',
        prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'смена ника',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Ваш аккаунт разблокирован на 24 часа, в течение этого времени смените игровой никнейм.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms]После смены никнейма прикрепите доказательства, тема открыта. В случае, если никнейм не будет сменен, аккаунт будет заблокирован без возможности обжалования.[/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: 123,
    },
    {
      title: 'возврат имущества игроку',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Аккаунт игрока будет разблокирован на 24 часа для возврата имущества/выдачи компенсации пострадавшей стороне.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms]Напоминаем, [U]любые попытки обмануть администрацию и перенести имущество на другие аккаунты караются блокировкой аккаунтов без возможности дальнейшего обжалования.[/U][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: 123,
    },
    {
      title: 'ссылку на вк',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Прикрепите ссылку на вашу страницу ВК.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms]Ожидаю ответа, тема открыта.[/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: 123,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴передача обж╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'обж для ГА',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Ваше обжалование передано на рассмотрение [Color=red]Главному администратору. [/FONT][/COLOR][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms]Ожидайте ответа.[/FONT][/CENTER]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'обж для Спец адм',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Ваше обжалование передано на рассмотрение [Color=red]Специальной администрации[/COLOR] проекта.[/FONT][/CENTER] <br>" +
        "[CENTER][FONT=trebuchet ms] <br>" +
        '[CENTER][FONT=trebuchet ms]Ответ может занять больше времени, чем два дня. Убедительная просьба не создавать копии/дубликаты данной темы.[/FONT][/CENTER]',
      prefix: SPECY_PREFIX,
	  status: true,
    },
    {
      title: 'обж для ЗРМ/РМ',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Ваше обжалование передано на рассмотрение[Color=#1E90FF] Руководству модерации[/COLOR] проекта. [/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms]Ответ может занять больше времени, чем два дня. Убедительная просьба не создавать копии/дубликаты данной темы.[/FONT][/CENTER]',
      prefix:  COMMAND_PREFIX,
	  status: true,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Одобрено╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
        title: 'полностью снижено',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Мы готовы пойти к вам навстречу и полностью снять ваше наказание. <br> Советуем повторно ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']правилами проекта (Нажмите сюда)[/URL], во избежание повторения подобных случаев.[/FONT][/CENTER]<br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
        prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'частично снижено',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Мы готовы пойти к вам навстречу, срок наказания будет частично снижен. <br> Советуем повторно ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']правилами проекта (Нажмите сюда)[/URL], во избежание повторения подобных случаев.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
        prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'снижено до мута',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Мы готовы пойти к вам навстречу, блокировка аккаунта будет заменена на блокировку чата. <br> Советуем повторно ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']правилами проекта (Нажмите сюда)[/URL], во избежание повторения подобных случаев.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
        prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'ник сменен',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Обжалование одобрено, блокировка полностью снята. <br> Советуем повторно ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']правилами проекта (Нажмите сюда)[/URL], во избежание повторения подобных случаев.[/FONT][/CENTER]<br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
        prefix: ACCEPT_PREFIX,
      status: true,
    },
    {
        title: 'чс снят',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Мы готовы пойти к вам навстречу, черный список будет снят. <br> Советуем повторно ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']правилами проекта (Нажмите сюда)[/URL], во избежание повторения подобных случаев.[/FONT][/CENTER]<br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
        prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказано╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'обж отказано',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Мы не готовы пойти к вам навстречу. В обжаловании отказано.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не по форме',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Ваше обжалование составлено не по форме.<br>Просим вас перед подачей заявки на обжалование ознакомиться [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/']с правилами подачи заявок на обжалование наказания (Нажмите сюда)[/URL]. [/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'на данный момент отказ',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]На данный момент мы не готовы пойти к вам навстречу и снять ваше наказание.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'мин. наказание',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Вам было выдано минимальное наказание. В полном снятии вашего наказания отказано.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'дубль темы',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Тема продублирована, вам уже был дан ответ. За неоднократное дублирование тем на ваш форумный аккаунт могут быть наложены санкции в виде блокировки.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'док-ва не работают',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Ваши доказательства не работают или не открываются. Загрузите доказательства на другой хостинг и создайте обжалование повторно.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'док-ва отсутствуют',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Доказательства отсутствуют. Для того, чтобы мы изучили ситуацию и вынесли корректный вердикт вы должны прикрепить доказательства.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на адм',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Данный раздел предназначен для игроков, которые согласны с своим наказанием и хотят его полного или частичного снятия. <br>Если вы не согласны с наказанием, то вам следует обратиться в раздел [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3517/']«Жалобы на администрацию» (Нажмите сюда).[/URL][/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'прошло много времени',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]С момента выдачи наказания прошло слишком много времени. Корректно изучить ситуацию и вынести вердикт в вашем случае невозможно.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'неадекват в обж',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Обжалования, в которых присутствует неуважение, оскорбления, неадекватное поведение по отношению к администрации рассмотрению не подлежат.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'бан фа за неадек',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Обжалования с таким содержанием рассмотрению не подлежат. Форумный аккаунт будет заблокирован за неадекватное поведение. [/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'отказ взлом акка',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игроки самостоятельно несут ответственность за свой аккаунт, в обжаловании отказано.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'обж от 3-го лица',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Обжалование написано от 3-го лица. Обращение должно быть составлено владельцем аккаунта.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'бан фа за дубль',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Ранее вам был дан ответ. Форумный аккаунт будет заблокирован за неоднократное дублирование тем.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'уже на рассмотрении',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Обжалование такого же содержания от Вас уже находится на рассмотрении.<br> Ожидайте ответа в прошлой теме. [/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на теха',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Наказание было выдано техническим специалистом. Обратитесь в раздел [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/']Жалобы на технических специалистов (Нажмите сюда)[/URL].[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'обжалованию не подлежит',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте. <br>' +
        "<br>[FONT=trebuchet ms]Ваше наказание не подлежит обжалованию. Обращаем ваше внимание на список наказаний, не подлежащих обжалованию:[/FONT] <br>" +
        "[QUOTE][FONT=trebuchet ms]- различные формы «слива»[/FONT]<br>" +
        "[FONT=trebuchet ms]- продажа игровой валюты[/FONT]<br>" +
        "[FONT=trebuchet ms]- махинации[/FONT]<br>" +
        "[FONT=trebuchet ms]- целенаправленный багоюз[/FONT]<br>" +
        "[FONT=trebuchet ms]- продажа, передача аккаунта[/FONT]<br>" +
        "[FONT=trebuchet ms]- сокрытие ошибок, багов системы[/FONT]<br>" +
        "[FONT=trebuchet ms]- использование стороннего программного обеспечения[/FONT]<br>" +
        "[FONT=trebuchet ms]- распространение конфиденциальной информации[/FONT]<br>" +
        "[FONT=trebuchet ms]-  обман администрации.[/FONT][/QUOTE]<br>" +
        '<br>[FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'обж пишет обманутая сторона',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Обжалование должен писать игрок, которого вы обманули. Вы должны с ним связаться и обсудить условия возвращения украденного имущества или компенсации, равной стоимости украденного имущества.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'остуствуют чс',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]У вас остуствуют черные списки, которые были выданы на нашем сервере.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нет окна бана',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]В предоставленных доказательствах отсутствует окно блокировки аккаунта. Для того, чтобы мы изучили ситуацию и дали корректный ответ вы должны зайти на сервер и прикрепить окно блокировки аккаунта в новом обжаловании.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'ник не сменен',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Вами не было дано обратной связи, никнейм не был сменен. В обжаловании отказано.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴перенос темы╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'переношу в нужный раздел',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Вы ошиблись разделом, переношу вашу тему в необходимый раздел.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms]Ожидайте ответа.[/FONT][/CENTER]',
      prefix: WAIT_PREFIX,
	  status: false,
    },
    {
      title: 'переношу в жб на адм',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Вы ошиблись разделом, переношу вашу тему в раздел «Жалобы на администрацию»[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms]Ожидайте ответа.[/FONT][/CENTER]',
      prefix: WAIT_PREFIX,
	  status: false,
    },
    {
      title: 'переношу в тех раздел',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Наказание было выдано техническим специалистом. Переношу вашу тему в раздел «Жалобы на технических специалистов»[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms]Ожидайте ответа.[/FONT][/CENTER]',
      prefix: TEX_PREFIX,
	  status: false,
    },
    {
     title: 'ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤЖБ НА АДМㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ',
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴На рассмотрении╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Запрошу доква',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Запрошу доказательства у администратора. Ожидайте ответа. [/FONT][/CENTER]<br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=orange]На рассмотрении.[/COLOR][/FONT][/CENTER]',
        prefix: PIN_PREFIX,
      status: true,
    },
    {
        title: 'На рассмотрении',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Ваша жалоба взята [COLOR=orange]на рассмотрение.[/COLOR] Мы изучим ситуацию и дадим ответ.[/FONT][/CENTER]<br>" +
        '<br>[CENTER][FONT=trebuchet ms]Ожидайте.[/FONT][/CENTER]',
        prefix: PIN_PREFIX,
      status: true,
    },
    {
        title: 'укажите таймкоды',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]В течении 24-ех часов укажите [U]развернутые[/U] таймкоды нарушений и ключевых моментов на ваших доказательствах, иначе жалоба будет отказана. [/FONT][/CENTER]<br>" +
        '<br>[CENTER][FONT=trebuchet ms]Пример: 0:10 - договор, 0:20 - /time, 0:30 - игрок совершил обман. Тема открыта, ждем вашего ответа.[/CENTER]<br>',
        prefix: PIN_PREFIX,
      status: true,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴передача ЖБ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'для Спец адм',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Ваша жалоба передана на рассмотрение [Color=red]Специальной администрации[/COLOR] проекта.[/FONT][/CENTER] <br>" +
        "[CENTER][FONT=trebuchet ms] <br>" +
        '[CENTER][FONT=trebuchet ms]Ответ может занять больше времени, чем два дня. Убедительная просьба не создавать копии/дубликаты данной темы.[/FONT][/CENTER]',
      prefix: SPECY_PREFIX,
	  status: true,
    },
    {
      title: 'Для ЗГА ГОСС ОПГ',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Ваша жалоба была передана на рассмотрение  [Color=red] Заместителю Главного Администратора.  [/FONT][/COLOR][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms]Ожидайте ответа.[/FONT][/CENTER]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'Для ОЗГА',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Ваша жалоба была передана на рассмотрение [Color=red] Основному Заместителю Главного Администратора.  [/FONT][/COLOR][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms]Ожидайте ответа.[/FONT][/CENTER]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'для ГА',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Ваша жалоба передана на рассмотрение [Color=red]Главному администратору.[/FONT][/COLOR][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms]Ожидайте ответа.[/FONT][/CENTER]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'для главной адм',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Ваша жалоба передана на рассмотрение [Color=red]Главной администрации[/FONT][/COLOR] сервера.[/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms]Ожидайте ответа.[/FONT][/CENTER]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'для теха',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Ваша жалоба была передана на рассмотрение [Color=ORANGE]Tехническому специалисту. [/FONT][/COLOR][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms]Ожидайте ответа.[/FONT][/CENTER]',
      prefix: TEX_PREFIX,
	  status: true,
    },
    {
      title: 'для ЗРМ/РМ',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Жалоба передана на рассмотрение[Color=#1E90FF] Руководству модерации[/COLOR] проекта. [/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms]Ответ может занять больше времени, чем два дня. Убедительная просьба не создавать копии/дубликаты данной темы.[/FONT][/CENTER]',
      prefix:  COMMAND_PREFIX,
	  status: true,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ЖБ одобрена ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Наказание будет снято',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Наказание было снято. Приносим извинения за доставленные неудобства.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'будет разблокирован',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Информация была перепроверена, аккаунт разблокирован. Приносим извинения за доставленные неудобства.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'проведена работа',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms] С администратором будет проведена необходимая работа.<br>Приносим извинения за доставленные неудобства.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=rgb(250,0 ,0)]Закрыто.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'проведена беседа',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]С администратором будет проведена беседа, приносим извинения за доставленные неудобства.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'неправильный вердикт жб',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]С администратором будет проведена работа. Жалоба будет пересмотрена.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'неправильный вердикт био',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]С администратором будет проведена работа. RolePlay биография будет пересмотрена.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴отказано╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
        title: 'Наказание выдано верно',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Доказательства предоставлены, наказание выдано верно.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
        title: 'наказание через форум',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Наказание было выдано в связи с поступлением на вас жалобы на форуме. <br> Доказательства предоставлены, наказание выдано верно.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'нарушений не найдено',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Нарушений со стороны администратора выявлено не было.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'недостаток докв',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Недостаточно доказательств на нарушение от Администратора. [/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на теха',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Наказание было выдано техническим специалистом. Обратитесь в раздел [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/']Жалобы на технических специалистов (Нажмите сюда)[/URL].[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'дублирование',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Тема продублирована, просим вас воздержаться от создания дубликатов тем с подобным содержанием, в противном случае на ваш форумный аккаунт могут быть наложены санкции в виде блокировки. [/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'не по форме',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Ваша жалоба составлена не по форме.<br> Убедительная просьба ознакомиться [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-администрацию.3429349/']с правилами подачи жалоб на администрацию (Нажмите сюда)[/URL]. [/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нет тайма',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]На ваших доказательствах отсутствует /time. Для рассмотрения вашей жалобы нам потрубется /time.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
        title: 'Отсутвуют доква',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]В жалобе отсутствуют доказательства. Жалобы, в которых отсутстуют доказательства не подлежат рассмотрению.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'более 48 часов',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]С момента выдачи наказания прошло более 48-ми часов.<br> Жалоба не подлежит рассмотрению. [/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'соц сеть',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). [/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'неадекватность в жб',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Жалобы, в которых присутствует ненормативная лексика и/или неуважение к администрации рассмотрению не подлежат. [/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'фрапс обрывается',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Ваш фрапс обрывается, загрузите полный фрапс на ютуб. [/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Адм снят/ушел псж',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Администратор был снят/ушел с поста администратора. [/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'не работают доки',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms] Доказательства не работают. [/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'доква отредактированы',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Ваши доказательства были подвергнуты редактированию. [/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: '3-е лицо',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Жалоба от третьего лица не принимается. [/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'не тот сервер',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Вы ошиблись сервером.<br> Переношу жалобу в соответствующий раздел.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не написал ник',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игровой ник автора жалобы, ник Администратора, на которого подается жалоба, должны быть указаны в соответствии с правилами подачи жалоб, даже если эта информация присутствует на доказательствах или в тексте жалобы. [/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не по теме',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]]Ваше сообщение никоим образом не относится к предназначению данного раздела.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'закрыт доступ к гугл диску',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]К гугл диску закрыт доступ, пожалуйста откройте доступ, либо загрузите доказательства на фотохостинг(YouTube, Япикс, imgur). <br> [url=https://postimages.org/][img]https://i.postimg.cc/FRpfsF2k/image.png[/img][/url][/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'закрыт доступ к яндекс диску',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]К яндекс диску закрыт доступ, пожалуйста откройте доступ, либо загрузите доказательства на фотохостинг(YouTube, Япикс, imgur). <br> [url=https://postimages.org/][img]https://i.postimg.cc/7YvGNcwR/image.png[/img][/url][/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'уже на рассмотрении',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Жалоба такого же содержания от Вас уже находится на рассмотрении.<br> Ожидайте ответа в прошлой жалобе и не нужно дублировать ее. [/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'прикрепите ссылку на жб',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Прикрепите ссылку на тему.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms]Тема открыта.[/FONT][/CENTER]',
      prefix: WAIT_PREFIX,
	  status: false,
    },
    {
      title: 'нет окна бана',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]В предоставленных доказательствах отсутствует окно блокировки аккаунта. Зайдите на сервер и прикрепите окно блокировки аккаунта в новой жалобе.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'нет строки наказания',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]В предоставленных доказательствах отсутствует строка наказания от администратора.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
        title: 'кф правильный вердикт (жб)',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Со стороны Куратора форума отсутствуют нарушения, жалоба рассмотрена корректно.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
        title: 'кф правильный вердикт (био)',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Со стороны Куратора форума отсутствуют нарушения, RolePlay биография рассмотрена корректно.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤЖБ На Игроковㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ',
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴Одобрено (Правила игр. проц.) ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
        title: 'Будет забанен',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет заблокирован. Благодарим за обращение[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'nRP поведение',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.01.[/COLOR] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [COLOR=red]| Jail 30 минут[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'уход от РП',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.02.[/COLOR] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [COLOR=red]| Jail 30 минут / Warn[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'nRP drive',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.03.[/COLOR] Запрещён NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [COLOR=red]| Jail 30 минут [/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'помеха рп',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.04.[/COLOR]  Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы [COLOR=red]| Ban 10 дней / Обнуление аккаунта (при повторном нарушении) [/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'nRP обман',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.05.[/COLOR]  Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [COLOR=red]| Permban [/COLOR][/CENTER]<br>' +
        '[CENTER][FONT=trebuchet ms][COLOR=red]Пример:[/COLOR] после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'аморал действия',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.08.[/COLOR] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [COLOR=red]| Jail 30 минут / Warn [/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'слив склада',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.09.[/COLOR]  Запрещено сливать склад фракции / семьи путем взятия большого количества ресурсов или превышая допустимый лимит, установленный лидером  [COLOR=red]| Ban 15 - 30 дней / PermBan [/COLOR][/CENTER]<br>' +
        '[CENTER][FONT=trebuchet ms][COLOR=red]Примечание:[/COLOR] исключение всех или части игроков из состава семьи без ведома лидера также считается сливом.[/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'DB',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.13.[/COLOR] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [COLOR=red]| Jail 60 минут[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'TK',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.15.[/COLOR] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [COLOR=red]| Jail 60 минут / Warn (за два и более убийства)[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'MG',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.18.[/COLOR] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [COLOR=red]| Mute 30 минут[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'DM',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.19.[/COLOR] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [COLOR=red]| Jail 60 минут[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'Mass DM',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.20.[/COLOR] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [COLOR=red]| Warn / Ban 3 - 7 дней[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'Читы/Сборки',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.22.[/COLOR]  Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [COLOR=red]| Ban 15 - 30 дней / PermBan[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'продажа ив (попытка)',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.28.[/COLOR] Запрещена покупка/продажа внутриигровой валюты за реальные деньги в любом виде [COLOR=red]| PermBan с обнулением аккаунта.[/COLOR][/CENTER]<br>' +
        '[CENTER][FONT=trebuchet ms][COLOR=red]Примечание:[/COLOR] любые попытки купить или продать внутриигровую валюту, интересоваться этим у других игроков или обсуждать это – наказуемо.[/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'реклама соц сетей',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.31.[/COLOR] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube-каналы и тому подобное  [COLOR=red]| Ban 7 дней / PermBan[/COLOR][/CENTER]<br>' +
        '[CENTER][FONT=trebuchet ms][COLOR=red]Примечание:[/COLOR] если игрок не использует глобальный чат, чтобы дать свои контактные данные для связи, это не будет являться рекламой.[/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'нац. / религ. конфликты',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.35.[/COLOR] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [COLOR=red]| Mute 120 минут / Ban 7 дней[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'оос угрозы',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.37.[/COLOR] Запрещены OOC-угрозы, в том числе и завуалированные, а также угрозы наказанием со стороны администрации [COLOR=red]| Mute 120 минут / Ban 7 - 15 дней.[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'оск проекта',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.40.[/COLOR] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [COLOR=red]| Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'nRP drive фура/инко',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.47.[/COLOR] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [COLOR=red]| Jail 60 минут[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'арест в аукционе',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.50.[/COLOR] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [COLOR=red]| Ban 7 - 15 дней + увольнение из организации[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'nRP аксесуар',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.52.[/COLOR] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [COLOR=red]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + Jail 30 минут[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'неуваж/оск адм',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.54.[/COLOR] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [COLOR=red]| Mute 180 минут[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'сбив аним/темпа',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.55.[/COLOR]  Запрещается багоюз, связанный с анимацией в любых проявлениях. [COLOR=red]| Jail 120 минут[/COLOR][/CENTER]<br>' +
        '[CENTER][FONT=trebuchet ms][COLOR=red]Примечание:[/COLOR] наказание применяется в случаях, когда игрок, используя ошибку, получает преимущество перед другими игроками.[/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'невозврат долга',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового процесса:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.57.[/COLOR]  Запрещается брать в долг игровые ценности и не возвращать их. [COLOR=red]| Ban 30 дней / permban[/COLOR][/CENTER]<br>' +
        '[CENTER][FONT=trebuchet ms][COLOR=red]Примечание:[/COLOR] при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда.[/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴Одобрено (Правила Чата) ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
        title: 'CapsLock',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового чата:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]3.02.[/COLOR] Запрещено использование верхнего регистра (Caps Lock) при написании любого текста в любом чате [COLOR=red]| Mute 30 минут[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'оск в оос',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового чата:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]3.03.[/COLOR] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [COLOR=red]| Mute 30 минут[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'оск/упом родных',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового чата:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]3.04.[/COLOR] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [COLOR=red]| Mute 120 минут / Ban 7 - 15 дней[/COLOR][/CENTER]<br>' +
        '[CENTER][FONT=trebuchet ms][COLOR=red]Примечание:[/COLOR] термины "MQ", "rnq" расценивается, как упоминание родных.[/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'флуд',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового чата:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]3.05.[/COLOR] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [COLOR=red]| Mute 30 минут[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'злоуп символами',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового чата:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]3.05.[/COLOR] Запрещено злоупотребление знаков препинания и прочих символов [COLOR=red]| Mute 30 минут[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'слив глобал чата',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового чата:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]3.08.[/COLOR] Запрещены любые формы «слива» посредством использования глобальных чатов [COLOR=red]| Permban[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'выдача за адм',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового чата:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]3.10.[/COLOR] Запрещена выдача себя за администратора, если таковым не являетесь [COLOR=red]| Ban 7 - 15 дней.[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'ввод в заблуждение',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового чата:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]3.11.[/COLOR] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [COLOR=red]| Ban 15 - 30 дней / PermBan[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'музыка войс',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового чата:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]3.14.[/COLOR] Запрещено включать музыку в Voice Chat [COLOR=red]| Mute 60 минут[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'шум войс',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового чата:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]3.16.[/COLOR] Запрещено создавать посторонние шумы или звуки [COLOR=red]| Mute 30 минут[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'призыв к флуду, полит/религ пропаганда',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового чата:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]3.18.[/COLOR] Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов [COLOR=red]| Mute 120 минут / Ban 10 дней[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'транслит',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового чата:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]3.20.[/COLOR] Запрещено использование транслита в любом из чатов [COLOR=red]| Mute 30 минут[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'реклама промо',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового чата:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]3.21.[/COLOR] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [COLOR=red]| Ban 30 дней[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'обьявы ГОСС',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового чата:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]3.22.[/COLOR] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [COLOR=red]| Mute 30 минут[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'мат в VIP',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил игрового чата:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]3.23.[/COLOR] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [COLOR=red]| Mute 30 минут[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴Одобрено (Правила ГОСС/ОПГ) ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
        title: 'работа в форме',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил госс. организаций:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]1.08.[/COLOR] Запрещено использование фракционного транспорта в личных целях [COLOR=red]| Jail 30 минут[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'nRP ГОСС',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил госс. организаций:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]1.13.[/COLOR] Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в семейных активностях, находится на Б/У рынке с целью покупки или продажи авто, находится на аукционе с целью покупки или продажи лота [COLOR=red]| Jail 30 минут[/COLOR][/CENTER]<br>' +
        '[CENTER][FONT=trebuchet ms][COLOR=red]Пример:[/COLOR] Семейные активности — захват семейного контейнера, битва за территорию, битва семей.[/CENTER]<br>' +
        '[CENTER][FONT=trebuchet ms][COLOR=red]Примечание:[/COLOR] за участие в семейных активностях в форме организации, игроку по решению администрации может быть выдано предупреждение [COLOR=red]| Warn[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'nRP адвокат (пра-во)',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил госс. организаций:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]3.01.[/COLOR] Запрещено оказывать услуги адвоката на территории ФСИН находясь вне комнаты свиданий [COLOR=red]| Warn[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'nRP edit (СМИ)',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил госс. организаций:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]4.01.[/COLOR] Запрещено редактирование объявлений, не соответствующих ПРО [COLOR=red]| Mute 30 минут[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'редакт в личных целях (СМИ)',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил госс. организаций:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]4.04.[/COLOR] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [COLOR=red]| Ban 7 дней + ЧС организации[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
        {
        title: 'nRP врач (ЦБ)',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил госс. организаций:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]5.02.[/COLOR] Запрещено вводить в заблуждение игроков, путем злоупотребления фракционными командами [COLOR=red]| Ban 3-5 дней + ЧС организации[/COLOR][/CENTER]<br>' +
        '[CENTER][FONT=trebuchet ms][COLOR=red]Пример:[/COLOR] Игрок обращается к сотруднику больницы с просьбой о лечении. Сотрудник применяет команду лечения, а затем выполняет команду для смены пола.[/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'nRP розыск (ГИБДД/УМВД/ФСБ)',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил госс. организаций:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]6.02.[/COLOR] Запрещено выдавать розыск без Role Play причины [COLOR=red]| Warn[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'nRP коп (ГИБДД/УМВД/ФСБ)',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил госс. организаций:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]6.03.[/COLOR] Запрещено nRP поведение [COLOR=red]| Warn[/COLOR][/CENTER]<br>' +
        '[CENTER][FONT=trebuchet ms][COLOR=red]Пример:[/COLOR] открытие огня по игрокам без причины, расстрел машин без причины, нарушение ПДД без причины, сотрудник на служебном транспорте кричит о наборе в свою семью на спавне, сотрудник с целью облегчить процесс конвоирования, убивает преступника в наручниках [U]и тому подобные ситуации[/U].[/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'nRP штраф (ГИБДД)',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил госс. организаций:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]7.02.[/COLOR] Запрещено выдавать розыск, штраф без Role Play причины [COLOR=red]| Warn[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'nRP изьятие прав (ГИБДД)',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил госс. организаций:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]7.04.[/COLOR] Запрещено отбирать водительские права во время погони за нарушителем или без веской причины. [COLOR=red]| Warn[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'nRP ФСИН',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил госс. организаций:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]9.01.[/COLOR] Запрещено освобождать заключённых, нарушая игровую логику организации [COLOR=red]| Warn[/COLOR][/CENTER]<br>' +
        '[CENTER][FONT=trebuchet ms][COLOR=red]Пример:[/COLOR] Выводить заключённых за территорию, используя фракционные команды, или открывать ворота территории ФСИН для выхода заключённых.[/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'nRP карцер (ФСИН)',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил госс. организаций:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]9.02.[/COLOR] Запрещено выдавать выговор или поощрять заключенных, а также сажать их в карцер без особой IC причины [COLOR=red]| Warn[/COLOR][/CENTER]<br>' +
        '[CENTER][FONT=trebuchet ms][COLOR=red]Пример:[/COLOR] сотруднику ФСИН не понравилось имя заключенного и он решил его наказать выговором или посадить в карцер.[/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
        title: 'nRP ВЧ (ОПГ)',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Игрок будет наказан по следующему пункту правил криминальных структур:<br>[/FONT][/CENTER] <br>" +
        '[CENTER][FONT=trebuchet ms][COLOR=red]2.[/COLOR] За нарушение правил нападения на Войсковую Часть выдаётся предупреждение [COLOR=red]| Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/COLOR][/CENTER]<br>' +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=LIME]Одобрено.[/FONT][/CENTER]',
      prefix: WATCHED_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴отказано ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'нарушений нет',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Нарушений со стороны игрока выявлено не было.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'слот',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Семейный слот не является элементом рыночных отношений. Передача, покупка и продажа семейных слотов напрямую между игроками не предусмотрена.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'недостаточно докаазательств',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Предоставленных доказательств на нарушение от игрока недостаточно.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'отсутствуют доква',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]В вашей жалобе отсутствуют доказательства.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не логируется/не найдено в логах',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Исходя из предоставленных доказательств, выдать наказание игроку не представляется возможным.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'отредактированные док-ва',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Доказательства, которые были подвергнуты редактированию рассмотрению не подлежат.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не по форме',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/']с правилами подачи жалоб на игроков (Нажмите сюда)[/URL].[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нет /time',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]На ваших доказательствах отсутствует /time.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'качество док-в',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Доказательства предоставлены в плохом качестве. Повысьте качество доказательств или смените хостинг, затем создайте новую жалобу.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'прошло 3 дня',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]С момента совершенного нарушения со стороны игрока прошло более 72 часов. Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: '3-е лицо',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Жалоба от третьего лица не принимается. Жалоба дожна быть подана участником ситуации. [/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'некорректные условия',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]В ваших доказательствах отсутствуют, либо некорректно обговорены условия сделки.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нужен фрапс',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms] В данной ситуации обязательно необходима запись экрана. Предоставленных доказательств недостаточно.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'доквы не открываются',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Ваши доказательства не открываются. Смените хостинг или перезагрузите доказательства, затем создайте новую жалобу.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'займ через трейд',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Займ может быть осуществлен только через зачисление игровых ценностей на банковский счет.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нет условий склада',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Вами не было предоставлено условий склада или доказательств, что вы являетесь лидером семьи. На данный момент жалоба не подлежит рассмотрению.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'дублирование',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Тема продублирована, просим вас воздержаться от создания дубликатов тем с подобным содержанием, в противном случае на ваш форумный аккаунт могут быть наложены санкции в виде блокировки. [/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'уже на рассмотрении',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Жалоба такого же содержания от Вас уже находится на рассмотрении.<br> Ожидайте ответа в прошлой жалобе и не нужно дублировать ее. [/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'был наказан',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Данный игрок уже был наказан администрацией сервера. Мы благодарны вам за содействие и бдительность.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Отказано.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на сотрудников',
      content:
		'[CENTER][FONT=trebuchet ms]Здравствуйте.[/CENTER] <br>' +
        "[CENTER][FONT=trebuchet ms]Вы обратились не в тот раздел, обратитесь в «Жалобы на сотрудников» данной организации.[/FONT][/CENTER] <br>" +
        '<br>[CENTER][FONT=trebuchet ms][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
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