// ==UserScript==
// @name VOLGOGRAD | Для жалоб на игроков
// @namespace https://forum.blackrussia.online
// @version 6.2
// @description Best Curators
// @author Lucky Moonlight // Для улучшения скрипта или добавления новых ответов напиши мне VK / TG - @idyamaloyy 
// @updateversion Создан 8 марта 2023 / глобальное обновление 05 января 2024
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant none
// @license MIT
// @copyright 2024,
// @icon https://forum.blackrussia.online/data/avatars/o/11/11193.jpg
// @downloadURL https://update.greasyfork.org/scripts/461441/VOLGOGRAD%20%7C%20%D0%94%D0%BB%D1%8F%20%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1%20%D0%BD%D0%B0%20%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/461441/VOLGOGRAD%20%7C%20%D0%94%D0%BB%D1%8F%20%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1%20%D0%BD%D0%B0%20%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.meta.js
// ==/UserScript==

(function () {
'esversion 6' ;
const FAIL_PREFIX = 4;
const OKAY_PREFIX = 8;
const WAIT_PREFIX = 2;
const TECH_PREFIX = 13;
const WATCH_PREFIX = 9;
const CLOSE_PREFIX = 7;
const GA_PREFIX = 12;
const SA_PREFIX = 11;
const CP_PREFIX = 10;
const buttons = [
   {
	  title: 'Приветствие',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url][/CENTER]<br>"+
		"[CENTER]ТЕКСТ[/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url][/CENTER]<br>"+
		"[CENTER]ТЕКСТ[/CENTER][/FONT][/SIZE]",
	},
    {
	  title: 'Техническому специалсту',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба передана на рассмотрение техническому специалисту - @Adelard Lemonte[/CENTER]<br>" +
        "[CENTER]Убедительная просьба не создавать копий данной темы.[/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		'[CENTER]Ожидайте ответа.[/CENTER][/FONT][/SIZE]',
	  prefix: TECH_PREFIX,
	  status: true,
	},
    {
	  title: 'На рассмотрение',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Ваша жалоба взята на рассмотрение, ожидайте ответа в данной теме.<br>Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		'[CENTER]Ожидайте ответа.[/CENTER][/SIZE][/FONT]',
      prefix: WAIT_PREFIX,
	  status: true,
	},
	{
       title: 'Заголовок',
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
       content:
            "[CENTER][FONT=Verdana]Доброго времени суток, уважаемый(-ая) {{ user.mention }}.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Заголовок темы должен быть строго по данной форме: «Nick_Name | Причина».<br>" +
            "• Пример: [COLOR=RED]Lucky_Moonlight | MG[/COLOR][/FONT].<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[CENTER][SIZE=4][COLOR=rgb(255, 255, 255)][FONT=verdana]Создайте новую тему, исправив заголовок жалобы. Закрыто.[/FONT][/COLOR][/SIZE][/CENTER]',
       prefix: FAIL_PREFIX,
       status: false,
        },
     {
	  title: 'Оффтоп',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Ваше сообщение не относится к теме данного раздела. Убедительная просьба ознакомиться с правилами раздела.[/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		'[CENTER]Отказано. Закрыто.[/CENTER][/FONT][/SIZE]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ  ОТВЕТЫ ДЛЯ ОТКАЗА ЖАЛОБᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
      dpstyle: 'oswald: 3px;     color: #fff; background: #7851A9; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
	},

    {
	  title: 'Жалоба не по форме',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба составлена не по форме.<br>" +
		"[CENTER]Заполните данную форму и подайте новую заявку:<br>" +
        "[QUOTE][SIZE=4]1. Ваш Nick_Name:<br>2. Nick_Name игрока:<br>3. Суть жалобы:<br>4. Доказательство:[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
	{
	  title: 'Не тот сервер',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
        "[CENTER]При составлении жалобы, Вы ошиблись сервером.[/CENTER]<br>" +
		"[CENTER]Подайте жалобу в раздел Вашего сервера.[/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: "В жб на администраторов",
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
        "[CENTER]Обратитесь в раздел жалоб на администрацию.[/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][FONT=Georgia][COLOR=rgb(255, 0, 0)][SIZE=5]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/COLOR]<br>',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'В жб на сотрудников',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
        "[CENTER]Обратитесь в раздел жалоб на сотрудников фракции.[/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Нет тайма',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
        "[CENTER]На ваших доказательствах отсутствует /time.[/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Нет таймкодов',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
        "[CENTER]Если видеодоказательство длится более 3 минут, Вы должны указать тайм-коды нарушений.[/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: '3+ дня',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
        "[CENTER]Вашим доказательствам более трёх дней.[/CENTER]<br>" +
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Доква в соц сетях',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Жалоба от 3-го лица',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба составлена от третьего лица.[/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Ответ был дан в предыдущей жалобе',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
        "[CENTER]Ответ на вашу жалобу был дан в предыдущей теме.[/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Нет нарушений',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]На ваших доказательствах отсутствуют нарушения игрока.<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Недостаточно доказательств',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]В вашей жалобе недостаточно доказательств на нарушение игрока.<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
	    {
	  title: 'Ссылка не работает',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Ссылка с доказательствами нерабочая. Проверьте работоспособность ссылки и напишите новую жалобу.<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Доказательства отредактированы',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Видеодоказательства, которые были отредактированы и на которых присутствует посторонняя музыка, неадекватная речь, нецензурные слова или выражения, могут быть не рассмотрены в качестве доказательств.<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
        {
	  title: 'ИМГУР',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Доказательства в вашей жалобе обрываются после первых 60 секунд. Загрузите полный фрагмент нарушения игрока на платформу 'Youtube' и создайте новую жалобу.<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
        {
	  title: 'Нет доков',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]В вашей жалобе не загружены доказательства на нарушение игрока. Создайте новую жалобу, загрузив доказательства с нарушениями игрока.<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
   {
	  title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ  Для выдачи деморгана ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
      dpstyle: 'oswald: 3px;     color: #fff; background: #7851A9; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
	},
	{
	  title: 'nRP поведение',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | Jail 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
     {
	  title: 'Уход от РП',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | Jail 30 минут / Warn.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
     {
	  title: 'nRP Drive',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.03. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | Jail 30 минут[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Помеха дально',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
        "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.04. Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. | Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'nRP обман',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | PermBan.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Аморал',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | Jail 30 минут / Warn.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Слив склада',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле | Ban 15 - 30 дней / PermBan.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Фрак. т/с в л/ц',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.11. Запрещено использование рабочего или фракционного транспорта в личных целях | Jail 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'DB',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | Jail 60 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    	{
	  title: 'ТК',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
        "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | Jail 60 минут / Warn (за два и более убийства)[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'RK',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.14. Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти | Jail 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'SK',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | Jail 60 минут / Warn (за два и более убийства).[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
	{
	  title: 'PG',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.17. Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь | Jail 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'MG',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | Mute 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'DM',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | Jail 60 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
	{
	  title: 'MASS DM',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | Warn / Ban 3 - 7 дней.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'ЧИТЫ',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | Ban 15 - 30 дней / PermBan.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Реклама',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.31. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное | Ban 7 дней / PermBan.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Обман адм',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.32. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта | Ban 7 - 15 дней.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Уход от наказ',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.34. Запрещен уход от наказания | Ban 15 - 30 дней (суммируется к общему наказанию дополнительно).[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Конф. на почве нац',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.35. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | Mute 120 минут / Ban 7 дней.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'OOC угрозы',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.37. Запрещены OOC угрозы, в том числе и завуалированные | Mute 120 минут / Ban 7 дней.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Оскр. проекта',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором).[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Продажа промо',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.43. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций | Mute 120 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'ЕПП',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
        "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.46. Запрещено ездить по полям на любом транспорте | Jail 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'ЕПП ФиИ',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.47. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) | Jail 60 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Арест аук/каз/мп',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.50. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий | Ban 7 - 15 дней + увольнение из организации.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Помеха РП',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.51. Запрещено вмешательство в Role Play процесс с целью помехи и препятствования дальнейшего развития Role Play процесса | Jail 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'nRP акс',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		'[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Оск адм',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.54. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | Mute 180 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Баг аним',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
        "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. | Jail 60 / 120 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Долг',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
        "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.57. Запрещается брать в долг игровые ценности и не возвращать их. | Ban 30 дней / permban[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
    },
    {
    title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ  Для БЛОКИРОВКИ ЧАТАᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
    dpstyle: 'oswald: 3px;     color: #fff; background: #7851A9; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
	},
    {
      title: 'Другой Язык',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.01. Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке | Устное замечание / Mute 30 минут[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'CAPS',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
        "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | Mute 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'ООС ОСК',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | Mute 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  status: false,
	},
     {
	  title: 'ОСК РОД',
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
        "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | Mute 120 минут / Ban 7 - 15 дней[/SIZE][/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'FLOOD',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
        "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | Mute 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
	{
	  title: 'TRANSLIT',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
        "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.20. Запрещено использование транслита в любом из чатов | Mute 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Злоуп. знаками',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.06. Запрещено злоупотребление знаков препинания и прочих символов | Mute 30 минут[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'SEX ОСК',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
        "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.07. Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата | Mute 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Слив чата',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
        "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.08. Запрещены любые формы «слива» посредством использования глобальных чатов | PermBan.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Угрозы',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
        "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.09. Запрещены любые угрозы о наказании игрока со стороны администрации | Mute 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Выдача за адм',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
        "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.10. Запрещена выдача себя за администратора, если таковым не являетесь | Ban 7 - 15 + ЧС администрации.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Ввод в заб',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
        "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.11. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | Ban 15 - 30 дней / PermBan.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Музыка Voice',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.14. Запрещено включать музыку в Voice Chat | Mute 60 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
     {
	  title: 'ОСК в Voice',
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]4истраторов по их написанию | Устное замечание + смена игрового никнейма / PermBan.[/SIZE][/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Политика',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
        "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.18. Запрещено политическое и религиозное пропагандирование | Mute 120 минут / Ban 10 дней.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Реклама промо',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
        "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | Ban 30 дней.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Реклама инта госс',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
        "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) | Mute 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
	   {
	  title: 'nRP /d',
           dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
           "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
        "[CENTER]Нарушитель будет наказан за нарушение правил чата департамента (/d).[/SIZE][/CENTER]<br>" +
        "[CENTER]С правилами можно ознакомиться по ссылке → [URL='https://forum.blackrussia.online/index.php?threads/Правила-общения-в-рации-департамента-d.3353861/']*Кликабельно*[/URL].[/CENTER]<br>" +
           "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'МАТ В ВИП',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
    "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
        "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.23. Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате | Mute 30 минут[/SIZE][/QUOTE][/CENTER]<br>" +
    "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
	 {
	  title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ  Для РАЗНЫЕ ПУНКТЫᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
      dpstyle: 'oswald: 3px;     color: #fff; background: #7851A9; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
	},
    {
	  title: 'Игрок Фейк',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
        "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]4.10. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию | Устное замечание + смена игрового никнейма / PermBan.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
     {
	  title: 'ОСК НИК',
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
         "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
        "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]4.09. Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) | Устное замечание + смена игрового никнейма / PermBan[/SIZE][/QUOTE][/CENTER]<br>" +
         "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
	{
	  title: 'Работа в форме',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
        "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]1.07. Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции | Jail 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
	{
	  title: 'Соло патруль',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
        "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]1.11. Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника | Jail 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
	{
	  title: 'Гос БУ',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
        "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]1.13. Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работы в форме фракции | Jail 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
	{
	  title: 'nRP ПРО',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
        "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]4.01. Запрещено редактирование объявлений, не соответствующих ПРО | Mute 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
	{
	  title: 'nRP ВЧ',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
        "[CENTER]Нарушитель будет наказан за нарушение правил военной части.[/CENTER]<br>" +
		"[CENTER]Подробнее о правилах вы можете ознакомиться тут - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B0%D0%B4%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B0-%D0%B2%D0%BE%D0%B5%D0%BD%D0%BD%D1%83%D1%8E-%D1%87%D0%B0%D1%81%D1%82%D1%8C.185332/'][U]Кликабельно[/U][/URL][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
	{
	  title: 'Замена объяв',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
        "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]4.04. Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком | Ban 7 дней + ЧС организации.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
	{
	  title: 'Розыск nRP',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
        "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]6.02. Запрещено выдавать розыск без Role Play причины | Warn.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
		{
	  title: 'nRP cop',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(66,170,255, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
            "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
        "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]6.03. Запрещено nRP поведение | Warn.[/SIZE][/QUOTE][/CENTER]<br>" +
            "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Приятной игры и времяпровождение на сервере VOLGOGRAD (39)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');


// addButton('На рассмотрение', 'pin');
// addButton('Тех. спецу', 'tech');
	addButton('На рассмотрении', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255,165,0, 0.5);');
    addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5);')
    addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);')
	addButton('Тех. спецу', 'tech', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0,0,255, 0.5);');
	addAnswers();

	// Поиск информации о теме
	const threadData = getThreadData();

 $('button#pin').click(() => editThreadData(WAIT_PREFIX, true));
 $('button#tech').click(() => editThreadData(TECH_PREFIX, true));
 $('button#accepted').click(() => editThreadData(OKAY_PREFIX, false));
 $('button#watch').click(() => editThreadData(WATCH_PREFIX, false));
 $('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
 $('button#unaccept').click(() => editThreadData(FAIL_PREFIX, false));

	$(`button#selectAnswer`).click(() => {
	XF.alert(buttonsMarkup(buttons), null, 'РЕШИ СУДЬБУ ИГРОКА СВОИМ ОТВЕТОМ');
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

    function addButton(name, id, style) {
         $('.button--icon--reply').before(
	`<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`,
	);
	}
	function addAnswers() {
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 5px; margin-top: 10px; border-radius: 13px;">ОТВЕТЫ</button>`,
	);
	}

	function buttonsMarkup(buttons) {
	return `<div class="select_answer">${buttons
	.map(
	(btn, i) =>
	`<button id="answers-${i}" class="button--primary button ` +
	`rippleButton" style="margin:4px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
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
	12 < hours && hours <= 18
	  ? 'Доброе утро'
	  : 18 < hours && hours <= 23
	  ? 'Добрый день'
	  : 23 < hours && hours <= 12
	  ? 'Добрый вечер'
	  : 'Добрый вечер',
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