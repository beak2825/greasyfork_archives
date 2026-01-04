// ==UserScript==
// @name Yakutsk Полный скрипт by Voodman
// @namespace https://forum.blackrussia.online
// @version 1.1
// @description Полный скрипт для КФ ГС/ЗГС ГОСС/ОПГ by S.Voodman
// @author S.Voodman
// @updateversion Создан 14 июня
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant none
// @license MIT
// @copyright 2024,
// @icon https://forum.blackrussia.online/data/avatars/o/11/11193.jpg
// @downloadURL https://update.greasyfork.org/scripts/540305/Yakutsk%20%D0%9F%D0%BE%D0%BB%D0%BD%D1%8B%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20by%20Voodman.user.js
// @updateURL https://update.greasyfork.org/scripts/540305/Yakutsk%20%D0%9F%D0%BE%D0%BB%D0%BD%D1%8B%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20by%20Voodman.meta.js
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
     const string = "https://vk.com/id559817046"
const buttons = [
  {
    title: '««««««««««««««««««««««««««««««««««« Передача тем на рассмотрение »»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»',
   dpstyle: 'oswald: 3px;     color: #fff; background: #20B2AA; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #20B2AA',
	},
{
	  title: 'Главному Администратору',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба передана на рассмотрение Главному Администратору - [user=1098111]Pasha_Versachi[/user]<br>" +
        "[CENTER]Убедительная просьба не создавать копий данной темы.[/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		'[CENTER]Ожидайте ответа.[/CENTER][/FONT][/SIZE]',
	  prefix: GA_PREFIX,
	  status: true,
	},
    {
	  title: 'Техническому специалисту',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба передана на рассмотрение техническому специалисту [/CENTER]<br>" +
        "[CENTER]Убедительная просьба не создавать копий данной темы.[/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		'[CENTER]Ожидайте ответа.[/CENTER][/FONT][/SIZE]',
	  prefix: TECH_PREFIX,
	  status: true,
	},
     {
	  title: 'ГКФ|ЗГКФ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба передана на рассмотрение Главному / Заместителю кураторов форума - @John Harris / @Mishanya Grozny[/CENTER]<br>" +
        "[CENTER]Убедительная просьба не создавать копий данной темы.[/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		'[CENTER]Ожидайте ответа.[/CENTER][/FONT][/SIZE]',
	  prefix: WAIT_PREFIX,
	  status: true,
	},
    {
	  title: 'На рассмотрение',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
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
  title: '««««««««««««««««««««««««««««««««««««««««««««««  Отказ жалоб »»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»',
   dpstyle: 'oswald: 3px;     color: #fff; background: #20B2AA; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #20B2AA',
	},
     {
	  title: 'Жалоба не по форме',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
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
  title: 'не лидер',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
        "[CENTER]На доказательствах Вы обязательно должны показать, что являетесь владельцем семьи.<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Не тот сервер',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
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

	  title: "В ЖБ на администраторов",
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
        "[CENTER]Обратитесь в раздел жалоб на администрацию.[/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][FONT=Georgia][COLOR=rgb(32, 178, 170)][SIZE=4]Приятной игры и времяпровождение на сервере Yakutsk (72)[/COLOR]<br>',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Нету в логах',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
        "[CENTER]Нарушений со стороны игрока в системе логирования не было найдено.[/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]",
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'В ЖБ на сотрудников',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
        "[CENTER]Обратитесь в раздел жалоб на сотрудников фракции.[/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Нет тайма',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
        "[CENTER]На ваших доказательствах отсутствует /time.[/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Нет условий',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
        "[CENTER]На ваших доказательствах отсутствуют условия сделки.[/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Нет таймкодов',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая) {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
        "[CENTER]Если видеодоказательство длится более 3 минут, Вы должны указать тайм-коды нарушений.[/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: '3+ дня',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
        "[CENTER]Вашим доказательствам более трёх дней.[/CENTER]<br>" +
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Доква в соц сетях',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Загрузка доказательств в соц. сети (ВКонтакте, instagram и других сайтов с обязательной регистрацией) запрещается, доказательства должны быть загружены на фото/видео хостинги [CENTER]Загрузите доказательства через <br> [URL='https://yapx.ru/']*yapx.ru*[/URL]<br> [URL='https://imgur.com/']*imgur*[/URL]<br> [URL='https://www.youtube.com/']*youtube*[/URL]<br> [URL='https://imgbb.com/']*ImgBB*[/URL]<br>  (все кликабельно). .[/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Жалоба от 3-го лица',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
        "[CENTER]Ваша жалоба составлена от третьего лица.[/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Ответ был дан в предыдущей теме',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
        "[CENTER]Ответ на вашу жалобу был дан в предыдущей теме.[/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Нет нарушений',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]На ваших доказательствах отсутствуют нарушения игрока.<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Недостаточно доказательств',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]В вашей жалобе недостаточно доказательств на нарушение игрока.<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
	    {
	  title: 'Ссылка не работает',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Ссылка с доказательствами нерабочая. Проверьте работоспособность ссылки и напишите новую жалобу.<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Доказательства отредактированы',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Ваши доказательства были отредактированы монтажом, пожалуйста, прикрепите оригинал.<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
        {
	  title: 'Фрапс обрывыется',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Доказательства в вашей жалобе обрываются после первых 60 секунд. Загрузите полный фрагмент нарушения игрока на платформу 'Youtube' и создайте новую жалобу.<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
        {
	  title: 'Отсутвуют док-ва',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]В вашей жалобе не загружены доказательства на нарушение игрока. Создайте новую жалобу, загрузив доказательства с нарушениями игрока.<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
{
	  title: '«««««««««««««««««««««««««««««««««««««««««« Правила Текстового Чата »»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»',
     dpstyle: 'oswald: 3px;     color: #fff; background: #20B2AA; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #20B2AA',
	},
     {
	  
	  title: 'CapsLock',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.02.  Запрещено использование верхнего регистра (Caps Lock) при написании любого текста в любом чате | Mute 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Россизм',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | Mute 30 минут. [/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Упом/Оск Родни',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | Mute 120 минут / Ban 7 - 15 дней. [/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'FLOOD',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | Mute 30 минут. [/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Злоуп Символами',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.06. Запрещено злоупотребление знаков препинания и прочих символов | Mute 30 минут. [/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	
	  title: 'Слив Глоб Чатов',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.08. Запрещены любые формы «слива» посредством использования глобальных чатов | PermBan. [/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  
	  title: 'Выдача себя за адм',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.10. Запрещена выдача себя за администратора, если таковым не являетесь | Ban 7 - 15 дней. [/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Злоуп командами',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.11. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | Ban 15 - 30 дней / PermBan. [/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Наруш в репорт',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.12. Запрещено подавать репорт, написанный транслитом, с сообщением не по теме (Offtop), с включённым Caps Lock, с использованием нецензурной брани, и повторять обращение (если ответ уже был дан ранее) | Report Mute 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	 
	  title: 'Музыка в Voice чат',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.14. Запрещено включать музыку в Voice Chat | Mute 60 минут. [/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	
	  title: 'Шумы',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.16. Запрещено создавать посторонние шумы или звуки | Mute 30 минут. [/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	
	  title: 'Политика/Религия',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.18. Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов | Mute 120 минут / Ban 10 дней. [/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Софт для голоса',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.19. Запрещено использование любого софта для изменения голоса | Mute 60 минут. [/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Транслит',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.20. Запрещено использование транслита в любом из чатов | Mute 30 минут. [/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Реклама Промо',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | Ban 30 дней. [/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'ГОСС обьявления',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) | Mute 30 минут. [/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Мат в VIP чат',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]3.23. Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате | Mute 30 минут. [/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
   {
	   title: '«««««««««««««««««««««««««««««««««««««««  Правила RolePlay Процесса  »»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»',
     dpstyle: 'oswald: 3px;     color: #fff; background: #20B2AA; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #20B2AA',
       },
 {
	  title: 'nRP повидение',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | Jail 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'nRP коп',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]6.03. Запрещено nRP поведение для сотрудников государственных организаций | Warn.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Уход от RP',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | Jail 30 минут / Warn.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'NonRP Drive',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.03. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | Jail 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Помеха RP',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.04. Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. | Ban 10 дней / Обнуление аккаунта (при повторном нарушении).[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},

      {
         title: 'Фейк ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:4.10. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию | Устное замечание + смена игрового никнейма / PermBan[QUOTE][SIZE=4][/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
},
 {
  title: 'nRP ник(мат) ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]4.09. Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) | Устное замечание + смена игрового никнейма / PermBan[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},

      {
         title: 'nRP ник(не по форме) ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]4.06. Никнейм игрового аккаунта должен быть в формате Имя_Фамилия на английском языке | Устное замечание + смена игрового никнейма[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
      {
	  title: 'nRP обман/попытка ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.05.Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | PermBan.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
		  title: 'AFK без ESC ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.07. Запрещено нахождение в AFK без включенного ESC, создавая помеху другим игрокам | Kick.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Аморальные действия',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
            "[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | Jail 30 минут / Warn.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
 {
	  title: 'Обман в /do ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.10. Запрещено в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже | Jail 30 минут / Warn[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Фракционный тс в личных целях ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.11. Запрещено использование рабочего или фракционного транспорта в личных целях | Jail 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Затягивание RP',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.12. Запрещено целенаправленное затягивание Role Play процесса | Jail 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'DB ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | Jail 60 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	
	  title: 'TK ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | Jail 60 минут / Warn (за два и более убийства).[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'SK ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | Jail 60 минут / Warn (за два и более убийства).[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	 
	  title: 'MG',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | Mute 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'DM',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | Jail 60 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Mass DM',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | Warn / Ban 3 - 7 дней.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'NonRP ВЧ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан:[QUOTE][SIZE=4]За нарушение правил нападения на Войсковую Часть выдаётся предупреждение | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Посторонние ПО',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | Ban 15 - 30 дней / PermBan.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Скрытие багов',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.23.  Запрещено скрывать от администрации ошибки игровых систем, а также распространять их игрокам | Ban 15 - 30 дней / PermBan[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Скрытие от администрации нарушителей',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.24. Запрещено скрывать от администрации нарушителей или злоумышленников | Ban 15 - 30 дней / PermBan + ЧС проекта.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Вред репутиции проекта',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.25. Запрещены попытки или действия, которые могут навредить репутации проекта | PermBan + ЧС проекта.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'намеренно наносить вред ресурсам проекта',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.26. Запрещено намеренно наносить вред ресурсам проекта (игровые серверы, форум, официальные Discord-серверы и так далее) | PermBan + ЧС проекта.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Cлив админ инфы',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.27. Запрещено распространение информации и материалов, непосредственно связанных с деятельностью администрации проекта, которые могут повлиять на работу и систему администрации | PermBan + ЧС проекта[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Реклама соц сетей',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.31. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube-каналы и тому подобное | Ban 7 дней / PermBan.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: ' обман администрации',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.32. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта | Ban 7 - 15 дней[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'уязвимость правил',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.33. Запрещено пользоваться уязвимостью правил | Ban 15 - 30 дней / PermBan[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	 
	  title: 'конфликты о национальности',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.35. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | Mute 120 минут / Ban 7 дней.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	 
	  title: 'OOC угрозы',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.37.  Запрещены OOC-угрозы, в том числе и завуалированные, а также угрозы наказанием со стороны администрации | Mute 120 минут / Ban 7 - 15 дней.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'распространение личной информации',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.38. Запрещено распространять личную информацию игроков и их родственников | Ban 15 - 30 дней / PermBan + ЧС проекта[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Злоупотребление нарушениями',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.72. Злоупотребление нарушениями правил сервера | Ban 7 - 30 дней.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Критика проекта',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором).[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'nRP сон',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.44. На серверах проекта запрещен Role Play сон (нахождение в AFK без ESC) | Kick.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'ЕПП',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.46. Запрещено ездить по полям на любом транспорте | Jail 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'ЕПП инко/дальнобощика',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.47. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) | Jail 60 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Арексты в интерьере',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.50. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий | Ban 7 - 15 дней + увольнение из организации.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'nRP аксессуар',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Оск адм',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.54. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | Mute 180 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
	  title: 'Багаюз с аним',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. | Jail 60 / 120 минут.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
{
    title: '««««««««««««««««««««««««««««««««««««««««««««««« Для ГКФ|ЗГКФ »»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»',
   dpstyle: 'oswald: 3px;     color: #fff; background: #20B2AA; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #20B2AA',
	},
    {
	  title: 'Слив склада',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле | Ban 15 - 30 дней / PermBan.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Сумма незначительна',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER][QUOTE][SIZE=4]Ваша жалоба отказана, т.к. сумма взятая со склада незначительна. [/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Вина Лидера',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER][QUOTE][SIZE=4]2.09. Запрещено сливать с семью путем исключения членов семьи.| Ban 15 - 30 дней / PermBan [/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
     {
	  title: 'ЖБ не от лица Лидера',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER][QUOTE][SIZE=4]Ваша жалоба отказана, т.к. она была написана не от лица Лидера семьи. [/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
{
	  title: 'Обход системы',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.21. Запрещено пытаться обходить игровую систему или использовать любые баги сервера | Ban 15 - 30 дней /PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов).[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'ППИВ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.28. Запрещена покупка, продажа внутриигровой валюты за реальные деньги в любом виде | PermBan с обнулением аккаунта + ЧС проекта.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {  
	  title: 'ущерб экономике',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.30. Запрещено пытаться нанести ущерб экономике сервера | Ban 15 - 30 дней / PermBan.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'ППВ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.41. Передача своего личного игрового аккаунта третьим лицам | PermBan.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Попытка продажи ИВ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.42. Попытка продажи любого игрового имущества или игрового аккаунта за реальные деньги | PermBan.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Покупка/продажа реп.семьи',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.48. Продажа или покупка репутации семьи любыми способами, скрытие нарушителей, читеров лидером семьи. | Обнуление рейтинга семьи / Обнуление игрового аккаунта лидера семьи.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
		  title: 'Оск название бизнеса',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.53.  Запрещено устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной направленности | Принудительная смена названия семьи / Ban 1 день / При повторном нарушении – обнуление бизнеса.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Не возврат долга',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Нарушитель будет наказан по пункту правил:[QUOTE][SIZE=4]2.57. Запрещается брать в долг игровые ценности и не возвращать их. | Ban 30 дней / permban.[/SIZE][/QUOTE][/CENTER]<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]" +
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
     {
    title: '«««««««««««««««««««««««««««««««««««««««««« RolePlay Биографии »»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»',
   dpstyle: 'oswald: 3px;     color: #fff; background: #20B2AA; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #20B2AA',
	},
     {
	  title: 'Биография одобрена',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Ваша RolePlay получает статус Одобрено. <br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Русский ник',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Ваша Roleplay биография получает статус Отказано,ваш NickName в заголовке должен быть написан на русском. <br>" +
"[CENTER] С другими правилами написания RolePlay биографии можете ознакомиться [url=https://forum.blackrussia.online/threads/%E2%98%ACyakutsk-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8-%D0%BF%D0%B5%D1%80%D1%81%D0%BE%D0%BD%D0%B0%D0%B6%D0%B0.7672555/]тут[/url].<br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
},
    {
         title: 'на дополнение',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]В вашей биографии недостаточно информации, Вам выдаётся 24 часа на дополнение. <br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]На рассмотрении.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
  prefix:  WAIT_PREFIX,
	     status: true,
},
    {
	  title: 'возраст не совпал ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Ваша RolePlay биография получает статус Отказано, т.к. ваш возраст или возраст родных не совпал с датой рождения . <br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Меньше 18-ти лет',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Ваша RolePlay биография  получает статус Отказано, т.к. Некорректен возраст (слишком молод). <br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: ' MG',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Ваша RolePlay биография  получает статус Отказано,биография не по форме (Вся информация в биографии является IC. Запрещено проявление в ней OOC.) <br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: ' Некорректная национальность',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Ваша RolePlay биография  получает статус отказано, некорректная национальность. <br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Нет логики',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Ваша RolePlay получает статус Отказано, т.к. в ней отсутствует логика. <br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: '3-е лицо',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Ваша RolePlay  биография  получает статус Отказано, т.к. она написана от третьего лица. <br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'Заголовок',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Ваша RolePlay биография  получает статус Отказано, т.к. заголовок написан не по форме. <br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Коппипаст',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Ваша RolePlay биография  получает статус Отказано, т.к. она полностью или частично скопирована. <br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'Не тот раздел',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Вы ошиблись разделом, обратитесь в нужный вам раздел. <br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: 'не по форме',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Ваша RolePlay  биография  получает статус Отказано, т.к. она составлена не по форме. <br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
    title: '«««««««««««««««««««««««««««««««««««««««««««« RolePlay Ситуации »»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»',
   dpstyle: 'oswald: 3px;     color: #fff; background: #20B2AA; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #20B2AA',
	},
    {
	  title: 'Ситуация одобрена',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Ваша RolePlay ситуация получает статус Одобрено. <br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Ситуация отказана',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Ваша RolePlay ситуация получает статус Отказано. <br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Ошиблись разделом',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Вы ошиблись разделом, обратитесь в нужный вам раздел. <br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
    title: '««««««««««««««««««««««««««««««««««««««« Неоф. RolePlay организация »»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»',
   dpstyle: 'oswald: 3px;     color: #fff; background: #20B2AA; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #20B2AA',
	},
     {
	  title: 'Орг-ция одобрена',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Ваша Неофициальная RolePlay организация получает статус Одобрено. <br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: 'Орг-ция отказана',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Ваша Неофициальная RolePlay организация получает статус Отказано. <br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Ошиблись разделом',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Вы ошиблись разделом, обратитесь в нужный вам раздел. <br>" +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
		"[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]" +
		'[CENTER][COLOR=rgb(32, 178, 170)][SIZE=4][FONT=georgia]Приятной игры и времяпровождение на сервере Yakutsk (72)[/FONT][/SIZE][/COLOR][/CENTER]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
{
    title: '««««««««««««««««««««««««««««««««««««««««««««««« ОПГ/ГОСС »»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»»',
   dpstyle: 'oswald: 3px;     color: #fff; background: #20B2AA; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #20B2AA',
	},
{
            title: `Приветствие`,
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',

            content:
"[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
'[SIZE=4][FONT=Georgia][CENTER]Доброго времени суток, уважаемый (-ая)  {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
                `[CENTER]      [/CENTER][/FONT][/SIZE]`,
        },
     {
            title: `Запрос док-вы у лидера`,
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
            content: `[SIZE=4][FONT=georgia][CENTER]  Доброго времени суток, уважаемый {{ user.mention }}
                 [CENTER] Запросил доказательства у лидера.<br><br>` +
                `Пожалуйста ожидайте ответа.<br>` +
                `[COLOR=DarkOrange]На рассмотрении.[/color][/CENTER][/FONT][/SIZE]`,
            prefix: WAIT_PREFIX,
            status: true,
        },
          {
            title: ` Не являеться ЛД`,
              dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
            content: `[SIZE=4][FONT=georgia][CENTER]Доброго времени суток, уважаемый{{ user.mention }}[/CENTER]<br><br>` +
                `[CENTER]Данный игрок больше не являеться лидером.<br>` +
                `[CENTER] [COLOR=red] Отказано[/color],закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
     {
            title: `Лидер был снят`,
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
            content: `[SIZE=4][FONT=georgia][CENTER]Доброго времени суток, уважаемый{{ user.mention }}[/CENTER]<br><br>` +
                ` [CENTER] Благодарим за ваше обращение, лидер снят!<br>` +
                ` [CENTER]  [color=lime]Одобрено[/color],закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
     {
            title: `Лидер получит наказание`,
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
            content: `[SIZE=4][FONT=georgia][CENTER]Доброго времени суток, уважаемый{{ user.mention }}[/CENTER]<br><br>` +
                ` [CENTER] Благодарим за ваше обращение, лидер получит соответствующее наказание!<br>` +
                ` [CENTER]  [color=lime]Одобрено[/color],закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
     {
            title: `Беседа с лидером`,
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
            content: `[SIZE=4][FONT=georgia][CENTER]Доброго времени суток, уважаемый{{ user.mention }}[/CENTER]<br><br>` +
                ` [CENTER] Благодарим за ваше обращение, с лидером будет проведена беседа!<br>` +
                ` [CENTER]  [color=lime]Одобрено[/color],закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
            {
            title: `Недостаточно док-вы`,
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
            content:`[SIZE=4][FONT=georgia][CENTER]Доброго времени суток, уважаемый{{ user.mention }}[/CENTER]<br><br>` +
            `[CENTER] Недостаточно доказательств, которые потверждают нарушение лидера.<br>`+
            ` [CENTER][COLOR=crimson] Отказано[/color],закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
      {
            title: `Правила раздела`,
          dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
            content:`[SIZE=4][FONT=georgia][CENTER]Доброго времени суток, уважаемый{{ user.mention }}[/CENTER]<br><br>` +
            `[CENTER]Пожалуйста, убедительная просьба, ознакомится с назначением данного раздела в котором Вы создали тему, так как ваш запрос никоим образом не относится к предназначению данного раздела.[/CENTER]`+
		    `[CENTER][COLOR=red] Отказано[/color], закрыто.[/CENTER][/FONT]<br><br>`,
            prefix: CLOSE_PREFIX,
            status:false,
         },
     {
            title: `Есть док-ва`,
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
            content:`[SIZE=4][FONT=georgia][CENTER]Доброго времени суток, уважаемый{{ user.mention }}[/CENTER]<br><br>` +
            `[CENTER] Лидер предоставил доказательства вашего нарушения, наказание было выдано верно!!<br>`+
            `[CENTER] [COLOR=red] Отказано[/color], закрыто. [/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
  {
            title: `Возврат должности`,
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
            content: `[SIZE=4][FONT=georgia][CENTER]Доброго времени суток, уважаемый{{ user.mention }}!<br>` +
                `Благодарим за ваше обращение!<br>` +
                `Лидер будет наказан, должность вам вернут обратно` +
                ` [color=lime]Одобрено[/color],закрыто [/CENTER][/FONT][/SIZE]`,
            prefix:  OKAY_PREFIX ,
            status: false,
        },
      {
            title: `Снятие наказания`,
          dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
            content: `[SIZE=4][FONT=georgia][CENTER]Доброго времени суток, уважаемый{{ user.mention }}!<br>` +
                `Благодарим за ваше обращение!<br><br>` +
                `Проверив доказательства лидера было принято решение то что вам снимут наказание.` +
                ` [color=lime]Одобрено[/color],закрыто [/CENTER][/FONT][/SIZE]`,
            prefix:  OKAY_PREFIX ,
            status: false,
        },
            {
            title: `Заявки на рассмотрении`,
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
            content: `[SIZE=4][FONT=georgia][CENTER]Доброго времени суток, уважаемые игроки![/CENTER]<br>` +
                `[CENTER] Заявления на пост лидера на рассмотрении.<br><br>` +
                `Пожалуйста ожидайте результатов.<br><br>` +
                `[COLOR=orange]На рассмотрение.[/color] [/CENTER][/FONT][/SIZE]`,
            prefix:WAIT_PREFIX,
            status: true,
        },
     {
            title: `Просмотр еженедельного отчета`,
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(175, 238, 238); font-family: UtromPressKachat',
            content: `[SIZE=4][FONT=georgia][CENTER]Доброго времени суток, уважаемый{{ user.mention }}!<br>` +
                `Ваш отчет был просмотрен!<br>` +
                `Вы получите баллы в количестве -  <br><br>` +
                ` [COLOR=lime]Рассмотрено[/color],закрыто [/CENTER][/FONT][/SIZE]`,
            prefix:  OKAY_PREFIX
        },
]

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
	XF.alert(buttonsMarkup(buttons), null, 'ОТВЕТЫ');
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
    }
    }
      async function getThreadData() {
        const authorID = $(`a.username`)[0].attributes[`data-user-id`].nodeValue;
        const authorName = $(`a.username`).html();
        const hours = new Date().getHours();
        const greeting = 4 < hours && hours <= 11
          ? `Доброе утро`
            : 11 < hours && hours <= 15
                ? `Добрый день`
                : 15 < hours && hours <= 21
                    ? `Добрый вечер`
                    : `Доброй ночи`
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