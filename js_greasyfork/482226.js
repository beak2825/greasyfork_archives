// ==UserScript==
// @name         Скрипт для форума.
// @namespace    https://forum.blackrussia.online/
// @version      1.0
// @description  Для руководства сервера.
// @author       Skay_Eagle
// @match        https://forum.blackrussia.online/threads/*
// @inaclude      https://forum.blackrussia.online/threads/
// @grant        none
// @license 	 MIT
// @collaborator Kuk
// @icon https://avatars.mds.yandex.net/i?id=e7371f38fb4d7fe174b4362d628c7f74-4988204-images-thumbs&n=13
// @copyright 2021, Kuk (https://openuserjs.org/users/Kuk)
// @downloadURL https://update.greasyfork.org/scripts/482226/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/482226/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0.meta.js
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
            title: 'Игрок будет наказан',
            content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Игрок получит соответствующее наказание согласно регламенту проекта.<br>" +
            "Одобрено,закрыто.[/FONT][/B][/CENTER]",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
        title: '________________________________________Жалобы на администрацию________________________________________',
    },
        {
            title: 'Жалоба составлена не по форме',
            content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER]Ваша жалоба составлена не по форме.<br>" +
            "[CENTER]Ознакомьтесь с правилами подачи жалоб на администрацию - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3429349/'][U]Правила подачи жалоб на администрацию.[/U][/URL]<br>" +
            "Отказано,закрыто.[/FONT][/B][/CENTER]",
            prefix: ZAKRITO_PREFIX,
            status: false,
        },
        {
	  title: 'Запросить доказательства у администратора.',
	  content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Запрошу доказательства у администратора.<br>" +
            "Ожидайте вынесения вердикта.<br>" +
            "На рассмотрении...[/FONT][/B][/CENTER]<br>",
            prefix: NARASSSMOTRENII_PREFIX,
            status: true,
        },
        {
	  title: 'Наказание выдано верно',
	  content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][FONT=verdana][B]Наказание выдано верно.<br>" +
            "Ознакомьтесь с правилами проекта - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.51/'][U]Правила проекта[/U][/URL].<br>" +
            "Отказано,закрыто.[/B][/FONT][/CENTER]<br>",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
      title: 'Нарушений со стороны администратора нет',
      content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Нарушений со стороны администратора не обнаружено.<br>" +
            "Отказано,закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	  title: 'С администратором будет проведена беседа',
	  content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]С администратором будет проведена профилактическая беседа.<br>" +
"Ваше наказание будет снято в течение дня(Если имеется).<br>" +
"Одобрено,закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	  title: 'Администратор получит наказание',
	  content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Администратор получит наказание.[/FONT][/B]<br>" +
"[FONT=verdana][B]Ваше наказание будет снято в течение дня(Если имеется).[/B][/FONT]<br>" +
"[B][FONT=verdana]Одобрено,закрыто. [/FONT][/B][/CENTER]<br>",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
	  title: 'Прошло более 48ч с момента выдачи наказания',
	  content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]С момента выдачи наказания прошло более 48 часов.<br>" +
"Жалоба рассмотрению не подлежит.<br>" +
"Отказано,закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
      title: 'Ответ был дан в прошой жалобе',
      content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Ответ был дан в прошлой жалобе.[/FONT][/B]<br>" +
"[FONT=verdana][B]Просьба не создавать повторные жалобы,иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>" +
"[B][FONT=verdana]Отказано,закрыто.[/FONT][/B][/CENTER]<br>",
                        prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
      title: 'Доказательства с Соц.Сетей',
      content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Доказательства с Социальных Сетей не принимаются.<br>" +
"Загрузите доказательства на Imgur/YouTube/Япикс и тому подобные источники.<br>" +
"Отказано,закрыто.[/FONT][/B][/CENTER]<br",
            prefix: ZAKRITO_PREFIX,
            status: false,
        },
        {
      title: 'Игрок словил бан по IP - ошибка',
      content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Возможно вы словили IP адрес другого человека.<br>" +
"Воспользуйтесь VPN или перезагрузите роутер.<br>" +
"Спасибо за обращение закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: ZAKRITO_PREFIX,
            status: false,
        },
        {
      title: 'Недостаточно доказательств для рассмотрения жалобы',
      content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Недостаточно доказательств для корректного рассмотрения вашей жалобы.<br>" +
"Отказано,закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	  title: 'Жалоба поданна от 3-его лица',
	  content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Жалоба подана от 3-го лица.<br>" +
"Отказано,закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
        title: 'Отсуствует табличка бана',
        content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Отсутствует табличка бана.<br>" +
"Отказано,закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
        title: 'Отсутствуют/не работают доказательства',
        content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]В вашей жалобе отсутствуют/не работают доказательства.<br>" +
"Отказано,закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
            title: 'Суть вашей жалобы неясна',
            content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Суть вашей жалобы неясна.<br>" +
"Подайте новую жалобу и распишите всю информацию более детальнее.<br>" +
"Отказано,закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: ZAKRITO_PREFIX,
            status: false,
        },
        {
            title: 'Сами же признались в своем нарушении',
            content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Сами же признались в своём нарушении.<br>" +
"Отказано,закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
            title: 'Доказательства обрезаны/подвергались редактированию',
            content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Доказательства обрезаны/подвергались редактированию.<br>" +
"Отказано,закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: ZAKRITO_PREFIX,
            status: false,
        },
        {
            title: 'Логи(для жб игроков)',
            content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B]Любое нарушение проверяется через логи,на данный момент мы не можем доказать данное нарушение.<br>" +
"Закрыто.[/B][/CENTER]<br>",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	  title: 'Перенаправить в раздел с Обжалованиями',
	  content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Если вы хотите смягчить наказание обратитесь в раздел с обжалованиями наказаний - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.786/'][U]Обжалование наказаний[/U][/URL].<br>" +
"Спасибо за обращение,закрыто.[/FONT][/B][/CENTER]<br>" ,
            prefix: ZAKRITO_PREFIX,
            status: false,
        },
        {
	  title: 'Перенаправить в жалобы на Тех.Специалиста',
	  content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Обратитесь в [URL='https://forum.blackrussia.online/index.php?forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB.22/'][U]Технический раздел[/U][/URL] --> [URL='https://forum.blackrussia.online/index.php?forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9617-platinum.1198/'][U]Жалобы на технических специалистов[/U][/URL].<br>" +
"Спасибо за обращение,закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: ZAKRITO_PREFIX,
            status: false,
        },
{
	  title: 'Передать жалобу Спец.Администратору',
	  content:
    '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
    "[CENTER][B][FONT=verdana]Передаю вашу жалобу Специальному Администратору.<br>" +
"Ожидайте вынесения вердикта.<br" +
"На рассмотрении...[/FONT][/B][/CENTER]<br>",
    prefix: SPECADMINY_PREFIX,
    status: true,
},
        {
	  title: 'Передать жалобу Главному Администратору',
	  content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Передаю вашу жалобу Главному Администратору.[/FONT][/B]<br>" +
"[FONT=verdana][B]Ожидайте вынесения вердикта.<br>" +
"На рассмотрении...[/B][/FONT][/CENTER]<br>",
            prefix: GLAVNOMYADMINY_PREFIX,
            status: true,
        },
        {
	  title: 'Передать жалобу Основному ЗГА',
	  content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Передаю вашу жалобу Основному Заместителю Главного Администратора.[/FONT][/B]<br>" +
"[FONT=verdana][B][B]Ожидайте вынесения вердикта.[/B]<br>" +
"На рассмотрении...[/B][/FONT][/CENTER]<br>",
            prefix: NARASSSMOTRENII_PREFIX,
            status: true,
        },
        {
	  title: 'Передать жалобу ЗГА по направлению ГОСС/ОПГ',
	  content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Передаю вашу жалобу Заместителю Главного Администратора по направлению ГОСС/ОПГ.[/FONT][/B]<br>" +
"[FONT=verdana][B][B]Ожидайте вынесения вердикта.[/B]<br>" +
"На рассмотрении...[/B][/FONT][/CENTER]<br>",
            prefix: NARASSSMOTRENII_PREFIX,
            status: true,
        },
        {
        title: '________________________________________Обжалования________________________________________',
    },
        {
	  title: 'Обжалование не по форме',
	  content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Ваше обжалование составлено не по форме.<br>" +
"Ознакомьтесь с правилами подачи обжалований - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/'][U]Правила подачи обжалований[/U][/URL].<br>" +
"Отказано,закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: ZAKRITO_PREFIX,
            status: false,
        },
{
	  title: 'Обжалование отказано',
	  content:
    '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
    "[CENTER][B][FONT=verdana]Ваше наказание обжаловано не будет.<br>" +
"Отказано,закрыто.[/FONT][/B][/CENTER]<br>",
    prefix: OTKAZANO_PREFIX,
    status: false,
},
        {
	  title: 'Обжалование одобрено',
	  content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Ваше обжалование одобрено.<br>" +
"В течение дня ваше наказание будет снижено.<br>" +
"Надеюсь вы осознали свою ошибку и больше такого от вас не повторится.<br>" +
"Одобрено,закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
        title: 'Обжалование на рассмотрении',
        content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Ставлю ваше обжалование на рассмотрение.<br>" +
"Ожидайте вынесения вердикта.<br>" +
"На рассмотрении...[/FONT][/B][/CENTER]<br>",
            prefix: NARASSSMOTRENII_PREFIX,
            status: true,
        },
        {
      title: 'Игрок словил бан по IP - ошибка',
      content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Возможно вы словили IP адрес другого человека.<br>" +
"Воспользуйтесь VPN или перезагрузите роутер.<br>" +
"Спасибо за обращение закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: ZAKRITO_PREFIX,
            status: false,
        },
        {
        title: 'Недостаточно доказательств для обжалования',
        content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Недостаточно доказательств для обжалования вашего наказания.<br>" +
"Отказано,закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: OTKAZANO_PREFIX,
    status: false,
},
        {
      title: 'Ответ уже был дан в прошлом обжаловании',
      content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Ответ был дан в прошлом обжаловании.[/FONT][/B]<br>" +
"[FONT=verdana][B]Просьба не создавать повторные обжалования,иначе ваш форумный аккаунт может быть заблокирован.[/B][/FONT]<br>" +
"[B][FONT=verdana]Отказано,закрыто.[/FONT][/B][/CENTER]<br>",
                        prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
	  title: 'Наказание уже было снижено',
	  content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Наказание было снижено в прошлом обжаловании.<br>" +
"Повторного снижения не будет.<br>" +
"Отказано,закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
        title: 'Отсутствуют/не работают доказательства',
        content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]В вашем обжаловании отсутствуют/не работают доказательства.<br>" +
"Отказано,закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: ZAKRITO_PREFIX,
            status: false,
        },
        {
        title: 'Отсуствует табличка бана',
        content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
"[CENTER][B][FONT=verdana]Отсутствует табличка бана.<br>" +
"[B]Отказано,закрыто.[/B][/FONT][/B][/CENTER]<br>",
            prefix: ZAKRITO_PREFIX,
            status: false,
        },
        {
	  title: 'Обжалование не рассматривается',
	  content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Наказания подобного типа обжалованию не подлежат согласно правилам проекта.<br>" +
"Отказано,закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: OTKAZANO_PREFIX,
            status: false,
        },
        {
      title: 'Доказательства с Соц.Сетей',
      content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Доказательства с Социальных Сетей не принимаются.<br>" +
"Загрузите доказательства на Imgur/YouTube/Япикс и тому подобные источники.<br>" +
"Отказано,закрыто.[/FONT][/B][/CENTER]<br",
            prefix: ZAKRITO_PREFIX,
            status: false,
        },
        {
            title: 'Суть вашего обжалования неясна',
            content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Суть вашего обжалования неясна.<br>" +
"Подайте новое обжалование и распишите всю информацию более детальнее.<br>" +
"Отказано,закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: ZAKRITO_PREFIX,
            status: false,
        },
        {
            title: 'Доказательства обрезаны/подвергались редактированию',
            content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Доказательства обрезаны/подвергались редактированию.<br>" +
"Отказано,закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: ZAKRITO_PREFIX,
            status: false,
        },
        {
        title: 'Чтобы обжаловать нрп обман - вернуть ущерб игроку',
        content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Для обжалования наказания нужно что бы вы связались с пострадавшей стороной и оба дали согласия на возврат имущества.<br>" +
"После согласия повторно подайте обжалование.<br>" +
"Отказано,закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: ZAKRITO_PREFIX,
            status: false,
        },
        {
      title: 'Требования(двух сторон) для обжалования NonRp обмана',
      content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER]Для обжалования наказания - необходимо чтобы обманутая сторона подтвердила ваше условие на возврат имущества под моим профилем форумного аккаунта - у вас есть 24 часа.<br>" +
"На рассмотрении...<br>",
            prefix: NARASSSMOTRENII_PREFIX,
            status: true,
        },
        {
      title: 'Возврат имущества обманутой стороне',
      content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][FONT=verdana][B]В течении дня ваш игровой аккаунт будет разблокирован на 24 часа для возврата имущества обманутой стороне.<br>" +
"Просьба пострадавшему отписать под моим профилем как ущерб будет возмещён, вы в эту очередь предоставляется видео-запись возврата.<br>" +
"На рассмотрении...[/B][/FONT][/CENTER]<br>",
            prefix: NARASSSMOTRENII_PREFIX,
            status: true,
        },
        {
      title: 'Игрок вернул имущество обманутой стороне',
      content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Ваше наказание будет заменено на ban 30 дней.<br>" +
"Надеюсь вы осознали свою ошибку и больше от вас такого не повторится.<br>" +
"Одобрено,закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
        title: 'Смена ника - разбан',
        content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Ваш игровой аккаунт будет разблокирован на 24 часа для смены NickName.<br>" +
"С помощью /mm>10 смените свой NickName.<br>" +
"На рассмотрении...[/FONT][/B][/CENTER]<br>",
            prefix: NARASSSMOTRENII_PREFIX,
            status: true,
        },
        {
        title: 'Смена ника - сменил',
        content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]NickName был сменён.<br>" +
"Одобрено,закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: ODOBRENO_PREFIX,
            status: false,
        },
        {
            title: 'ППВ',
        content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
"[CENTER][FONT=verdana][B][SIZE=4]Для обжалования наказания заполните следующую форму - [URL='https://docs.google.com/forms/d/e/1FAIpQLSdjLc-S3Y3H6ImlFtSBwQoNOGlJ7JYuKoP_QYmgltjlm_8-Cw/viewform']Кликабельно[/URL]<br>" +
"На рассмотрении...[/SIZE][/B][/FONT][/CENTER]<br>",
            prefix: NARASSSMOTRENII_PREFIX,
            status: false,
        },
        {
	  title: 'Перенаправить в жалобы на администрацию',
	  content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Если вы не согласны с выданным наказанием оставьте жалобу на данного администратора в раздел - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.783/'][U]Жалобы на администрацию[/U][/URL].<br>" +
"Спасибо за обращение,закрыто.[/FONT][/B][/CENTER]<br>",
prefix: ZAKRITO_PREFIX,
            status: false,
        },
        {
	  title: 'Перенаправить в жалобы на Тех.Специалиста',
	  content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Обратитесь в [URL='https://forum.blackrussia.online/index.php?forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB.22/'][U]Технический раздел[/U][/URL] --> [URL='https://forum.blackrussia.online/index.php?forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9617-platinum.1198/'][U]Жалобы на технических специалистов[/U][/URL].<br>" +
"Спасибо за обращение,закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: ZAKRITO_PREFIX,
            status: false,
        },
        {
	  title: 'Передать обжалование Спец.Администратору',
	  content:
    '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
    "[CENTER][B][FONT=verdana]Передаю ваше обжалование Специальному Администратору.<br>" +
"Ожидайте вынесения вердикта.<br" +
"На рассмотрении...[/FONT][/B][/CENTER]<br>",
    prefix: SPECADMINY_PREFIX,
    status: true,
},
        {
	  title: 'Передать обжалование Главному Администратору',
	  content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Передаю ваше обжалование Главному Администратору.[/FONT][/B]<br>" +
"[FONT=verdana][B]Ожидайте вынесения вердикта.<br>" +
"На рассмотрении...[/B][/FONT][/CENTER]<br>",
            prefix: GLAVNOMYADMINY_PREFIX,
            status: true,
        },
        {
	  title: 'Передать обжалование Тех.Специалисту',
	  content:
            '[SIZE=4][FONT=Verdana][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=verdana]Передаю ваше обжалование Техническому Специалисту.[/FONT][/B]<br>" +
"[FONT=verdana][B]Ожидайте вынесения вердикта.<br>" +
"На рассмотрении...[/B][/FONT][/CENTER]<br>",
            prefix: TEXSPECY_PREFIX,
            status: true,
        },
        {
            title: 'Биография не по форме',
            content:
            '[SIZE=4][FONT=courier new][color=#fff][B][CENTER]{{ greeting }}, уважаемый {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][B][FONT=courier new]Ваша РП биография составлена не по форме.<br>" +
"Ознакомьтесь с правилами подачи РП биографий и подайте еще раз.<br>" +
"Закрыто.[/FONT][/B][/CENTER]<br>",
            prefix: ZAKRITO_PREFIX,
            status: true,
        },
];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('Ответы', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEX_PREFIX, false));
    $('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#spec').click(() => editThreadData(SPEC_PREFIX, true));

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