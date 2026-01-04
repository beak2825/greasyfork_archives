// ==UserScript==
// @name         Технические специалисты отдела 18 88
// @namespace    https://forum.blackrussia.online
// @version      2.2
// @description  Для Яматика
// @author       Raf_Piatigorsky
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license  MIT
// @collaborator Yamato_Yozimotov
// @icon https://avatars.mds.yandex.net/i?id=2e5b30b9c5657d05784ad9708e8c9b3597a65679-12890014-images-thumbs&n=13
// @downloadURL https://update.greasyfork.org/scripts/544749/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B5%20%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D1%8B%20%D0%BE%D1%82%D0%B4%D0%B5%D0%BB%D0%B0%2018%2088.user.js
// @updateURL https://update.greasyfork.org/scripts/544749/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B5%20%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D1%8B%20%D0%BE%D1%82%D0%B4%D0%B5%D0%BB%D0%B0%2018%2088.meta.js
// ==/UserScript==

 (function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // префикс отказано
        const ODOBRENO_PREFIX = 8; // префикс одобрено
	const PIN_PREFIX = 2; //  префикс закрепить
	const COMMAND_PREFIX = 10; // префикс команде проекта
	const CLOSE_PREFIX = 7; // префикс закрыто
	const DECIDED_PREFIX = 6; // префикс решено
	const TECHADM_PREFIX = 13; // префикс техническому специалисту
	const WATCHED_PREFIX = 9; // префикс рассмотрено
	const WAIT_PREFIX = 14; // префикс ожидание (для переноса в баг-трекер)
	const NO_PREFIX = 0; // префикс отсутствует
        const TRANSFER_PREFIX1 = 30; //  префикс передачи админам 18
        const TRANSFER_PREFIX2 = 31; //  префикс передачи в обжалования 18
        const TRANSFER_PREFIX3 = 32; //  префикс передачи в жб на игроков 18
        const TRANSFER_PREFIX4 = 33; //  префикс передачи в тех раздел 18
        const TRANSFER_PREFIX5 = 34; //  префикс передачи в жб на тех 18
        const TRANSFER_PREFIX6 = 35; //  префикс передачи админам 88
        const TRANSFER_PREFIX7 = 36; //  префикс передачи в обжалования 88
        const TRANSFER_PREFIX8 = 37; //  префикс передачи в жб на игроков 88
        const TRANSFER_PREFIX9 = 38; //  префикс передачи в тех раздел 88
        const TRANSFER_PREFIX10 = 39; //  префикс передачи в жб на тех 88
     const buttons =[
{
	title: 'Приветствие',
	content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
  '[CENTER] текст [/CENTER][/FONT]',
},
{
	title: 'Дубликат',
	content:
	'[SIZE=4][FONT=Verdana][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
	"[CENTER]Данная тема является дубликатом вашей предыдущей темы, ссылка на тему - <br>Пожалуйста, <b>прекратите создавать идентичные или похожие темы - иначе Ваш форумный аккаунт может быть заблокирован</b>.<br><br>" +
	'[B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B]',
},
{
	title: 'Покупка ИВ у бота',
	content:
	'[SIZE=4][FONT=Verdana][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Внимательно изучив вашу систему логирования, было выявлено, что бот через (какую систему была передача) передал Вам игровую валюту в размере (размер), данная совокупность действий в полной мере противоречит правилам проекта пункта 2.28, прошу вас настоятельно с ним ознакомиться и впредь не нарушать.[/COLOR][/FONT][/B][/CENTER]<br><br>' +
  '[CENTER][COLOR=rgb(255, 0, 0)]2.28[/COLOR]. Запрещена покупка/продажа внутриигровой валюты за реальные деньги в любом виде | [COLOR=rgb(255, 0, 0)]PermBan с обнулением аккаунта + ЧС проекта.[/COLOR][/FONT][FONT=verdana]<br>[B]Примечание: любые попытки купить или продать внутриигровую валюту, интересоваться этим у других игроков или обсуждать это – наказуемо.<br>Примечание: нельзя обменивать донат валюту (например, рубли, пополненные через сайт) на игровые ценности и наоборот.<br>Пример: пополнение донат-счёта другого игрока в обмен на игровую валюту или другие ценности запрещено.<br>Примечание: продавать или обменивать игровые ценности, которые были куплены за донат-валюту, не запрещено.[/B][/FONT][B][FONT=verdana]Исключение: покупка игровой валюты или ценностей через официальный сайт разрешена.<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  "[CENTER]Ваша тема закреплена и ожидает вердикта <u>Куратора Технических Специалистов / Заместителя Куратора Технических Специалистов</u>.<br><br>" +
  '[CENTER]@Raf_Piatigorsky , @Andrew_Benassy[/CENTER][/FONT][/SIZE]<br><br>' +
	'[SIZE=4][FONT=Verdana][CENTER]<u>Создавать подобные темы не нужно</u>.<br>[B][COLOR=rgb(255, 255, 0)][FONT=verdana]На рассмотрении[/FONT][/COLOR][/B]',
},
{
	title: 'Покупка ИВ у игрока',
	content:
	'[SIZE=4][FONT=Verdana][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Внимательно изучив вашу систему логирования, было выявлено, что продавец игровой валюты с никнеймом (ник продавца) через (какую систему была передача) передал Вам игровую валюту в размере (размер), данная совокупность действий в полной мере противоречит правилам проекта пункта 2.28, прошу вас настоятельно с ним ознакомиться и впредь не нарушать.[/FONT][/COLOR][/B][/CENTER]<br><br>' +
  '[CENTER][COLOR=rgb(255, 0, 0)]2.28[/COLOR]. Запрещена покупка/продажа внутриигровой валюты за реальные деньги в любом виде | [COLOR=rgb(255, 0, 0)]PermBan с обнулением аккаунта + ЧС проекта.[/COLOR][/FONT][FONT=verdana]<br>[B]Примечание: любые попытки купить или продать внутриигровую валюту, интересоваться этим у других игроков или обсуждать это – наказуемо.<br>Примечание: нельзя обменивать донат валюту (например, рубли, пополненные через сайт) на игровые ценности и наоборот.<br>Пример: пополнение донат-счёта другого игрока в обмен на игровую валюту или другие ценности запрещено.<br>Примечание: продавать или обменивать игровые ценности, которые были куплены за донат-валюту, не запрещено.[/B][/FONT][B][FONT=verdana]Исключение: покупка игровой валюты или ценностей через официальный сайт разрешена.<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  "[CENTER]Ваша тема закреплена и ожидает вердикта <u>Куратора Технических Специалистов / Заместителя Куратора Технических Специалистов</u>.<br><br>" +
  '[CENTER]@Raf_Piatigorsky , @Andrew_Benassy[/CENTER][/FONT][/SIZE]<br><br>' +
	'[SIZE=4][FONT=Verdana][CENTER]<u>Создавать подобные темы не нужно</u>.<br>[B][COLOR=rgb(255, 255, 0)][FONT=verdana]На рассмотрении[/FONT][/COLOR][/B]',
},
{
	title: 'Трансфер на твинк',
	content:
	'[SIZE=4][FONT=Verdana][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana]Внимательно изучив вашу систему логирования, было выявлено, что с вашего основного аккаунта с никнеймом (Никнейм) через (какую систему была передача) передавали (что передали) на второй аккаунт с никнеймом (Никнейм).[/FONT][/B][/CENTER]<br><br>' +
  '[CENTER][B][FONT=verdana]Данная совокупность действий в полной мере противоречит правилам проекта пункта [COLOR=rgb(255, 0, 0)]4.05[/COLOR], прошу вас настоятельно с ним ознакомиться и впредь не нарушать.<br><br>[/FONT][/B][/CENTER]' +
  '[CENTER][COLOR=rgb(255, 0, 0)][B][FONT=verdana]4.05[/FONT][/B][/COLOR][FONT=verdana][B]. Запрещена передача либо трансфер игровых ценностей, между игровыми аккаунтами либо серверами, а также в целях удержания имущества | [/B][COLOR=rgb(255, 0, 0)][B]Ban 15 - 30 дней / PermBan[/B][/COLOR][/FONT][B][FONT=verdana]<br>Пример: передать бизнес, АЗС, дом или любые другие игровые материальные ценности с одного аккаунта игрока на другой / используя свой твинк / договорившись заранее с игроком и иные способы удержания.[/FONT][/B][/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  "[CENTER]Ваша тема закреплена и ожидает вердикта <u>Куратора Технических Специалистов / Заместителя Куратора Технических Специалистов</u>.<br><br>" +
  '[CENTER]@Raf_Piatigorsky , @Andrew_Benassy[/CENTER][/FONT][/SIZE]<br><br>' +
	'[SIZE=4][FONT=Verdana][CENTER]<u>Создавать подобные темы не нужно</u>.<br>[B][COLOR=rgb(255, 255, 0)][FONT=verdana]На рассмотрении[/FONT][/COLOR][/B]',
},
{
	title: 'Продажа ИВ игроку',
	content:
	'[SIZE=4][FONT=Verdana][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Внимательно изучив вашу систему логирования, было выявлено, что вы продали игровую валюту через (какую систему была передача) игроку с никнеймом (Никнейм) в размере (размер). [/COLOR][/FONT][/B]<br><br>' +
  '[CENTER][B][FONT=verdana]Данная совокупность действий в полной мере противоречит правилам проекта пункта [COLOR=rgb(255, 0, 0)]2.28[/COLOR], прошу вас настоятельно с ним ознакомиться и впредь не нарушать.<br><br>[/FONT][/B][/CENTER]' +
  '[CENTER][COLOR=rgb(255, 0, 0)]2.28[/COLOR]. Запрещена покупка/продажа внутриигровой валюты за реальные деньги в любом виде | [COLOR=rgb(255, 0, 0)]PermBan с обнулением аккаунта + ЧС проекта.[/COLOR][/FONT][FONT=verdana]<br>[B]Примечание: любые попытки купить или продать внутриигровую валюту, интересоваться этим у других игроков или обсуждать это – наказуемо.<br>Примечание: нельзя обменивать донат валюту (например, рубли, пополненные через сайт) на игровые ценности и наоборот.<br>Пример: пополнение донат-счёта другого игрока в обмен на игровую валюту или другие ценности запрещено.<br>Примечание: продавать или обменивать игровые ценности, которые были куплены за донат-валюту, не запрещено.[/B][/FONT][B][FONT=verdana]Исключение: покупка игровой валюты или ценностей через официальный сайт разрешена.<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  "[CENTER]Ваша тема закреплена и ожидает вердикта <u>Куратора Технических Специалистов / Заместителя Куратора Технических Специалистов</u>.<br><br>" +
  '[CENTER]@Raf_Piatigorsky , @Andrew_Benassy[/CENTER][/FONT][/SIZE]<br><br>' +
	'[SIZE=4][FONT=Verdana][CENTER]<u>Создавать подобные темы не нужно</u>.<br>[B][COLOR=rgb(255, 255, 0)][FONT=verdana]На рассмотрении[/FONT][/COLOR][/B]',
},

{
  title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ ЖАЛОБЫ НА ТЕХ. СПЕЦОВ ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
  dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
},
{
	title: 'Рассмотрение',
	color: '',
	content:
	'[SIZE=4][FONT=Verdana][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Тема взята в работу и закреплена, пожалуйста, ожидайте ответа в ней.<br> Рассмотрение темы может занять определенное время.<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]',
	prefix: TECHADM_PREFIX,
	status: true,
},
{
	title: 'Ожидайте вердикта руководства',
	color: '',
	content:
	'[SIZE=4][FONT=Verdana][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Ваша тема закреплена и ожидает вердикта <u>Куратора Технических Специалистов / Заместителя Куратора Технических Специалистов</u>.<br><br>" +
  '[CENTER]@Raf_Piatigorsky , @Andrew_Benassy[/CENTER][/FONT][/SIZE]' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[SIZE=4][FONT=Verdana][CENTER]<u>Создавать подобные темы не нужно</u>.<br>' +
  '[B][COLOR=rgb(255, 255, 0)][FONT=verdana]На рассмотрении[/FONT][/COLOR][/B]',
	prefix: PIN_PREFIX,
	status: true,
},
{
	title: 'Форма подачи ЖБ ТС',
	color: '',
	content:
	'[SIZE=4][FONT=Verdana][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Ваше обращение составлено не по форме.[/FONT][/COLOR][/B][/CENTER]<br>' +
	"[CENTER]Пожалуйста, заполните форму, создав новую тему: Название темы с NickName технического специалиста<br>Пример:<br> Lev_Kalashnikov | махинации<br>Форма заполнения темы:<br>[code]01. Ваш игровой никнейм:<br>02. Игровой никнейм технического специалиста:<br>03. Сервер, на котором Вы играете:<br>04. Описание ситуации (описать максимально подробно и раскрыто):<br>05. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>06. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/code]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Нет окна блокировки',
	color: '',
	content:
	'[SIZE=4][FONT=Verdana][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  "[CENTER]Без окна о блокировке тема не подлежит рассмотрению - создайте новую тему, прикрепив окно блокировки с фотохостинга или видеохостинга.<br> Также обращаем ваше внимание на то, что доказательства из социальных сетей <u>не принимаются</u>.<br><br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL],<br>[FONT=verdana][URL='https://imgfoto.host/']ImgFoto.host[/URL],<br>[URL='https://postimages.org/']Postimages.org[/URL][/FONT]<br>(все кликабельно).<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Ошибка, будет разбан',
	color: '',
	content:
	'[SIZE=4][FONT=Verdana][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]После дополнительной перепроверки была выявлена ошибка, ваш аккаунт будет разблокирован в течение 24-х часов. Приносим свои извининения за предоставленные неудобства.<br>[/CENTER]<br>'+
	"[CENTER]Ваша тема закреплена и ожидает вердикта <u>Куратора Технических Специалистов / Заместителя Куратора Технических Специалистов</u>.<br><br>" +
  '[CENTER]@Raf_Piatigorsky , @Andrew_Benassy[/CENTER][/FONT][/SIZE]' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[SIZE=4][FONT=Verdana][CENTER]<u>Создавать подобные темы не нужно</u>.<br>' +
  '[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/CENTER]',
	prefix: PIN_PREFIX,
	status: true,
},
{
	title: 'Правила раздела',
	color: '',
	content:
	'[SIZE=4][FONT=Verdana][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела в котором Вы создали тему, так как Ваш запрос не относится к жалобам на технических специалистов.<br>Что принимается в данном разделе:<br>Жалобы на технических специалистов, оформленные по форме подачи и не нарушающие правила подачи:<br> [FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Правила подачи жалобы на технических специалистов[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[QUOTE][FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01.[/COLOR] Ваш игровой никнейм:[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]<br>02.[/COLOR] Игровой никнейм технического специалиста:[COLOR=rgb(226, 80, 65)]<br>03.[/COLOR] Сервер, на котором Вы играете:[COLOR=rgb(226, 80, 65)]<br>04.[/COLOR] Описание ситуации (описать максимально подробно и раскрыто):[COLOR=rgb(226, 80, 65)]<br>05.[/COLOR] Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):[COLOR=rgb(226, 80, 65)]<br>06.[/COLOR] Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/SIZE][/FONT][/SIZE][/QUOTE]<br><br>[FONT=verdana][SIZE=4][FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]Примечание:[/COLOR] все оставленные заявки обращения в данный раздел обязательно должны быть составлены по шаблону предоставленному немного выше.<br>В ином случае, заявки обращения в данный раздел, составленные не по форме — будут отклоняться.<br>Касательно названия заголовка темы — четких правил нет, но, желательно, чтобы оно содержало лишь никнейм технического специалиста и причину.<br>Заранее, настоятельно рекомендуем ознакомиться [U][B][URL='https://forum.blackrussia.online/index.php?forums/faq.231/']с данным разделом[/URL][/B][/U][/SIZE][/FONT][/SIZE][/FONT]<br>[CENTER][FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Какие жалобы не проверяются?[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]—[/COLOR] Если в содержании темы присутствуют оффтоп/оскорбления.<br>[COLOR=rgb(226, 80, 65)]—[/COLOR] С момента выдачи наказания прошло более 14 дней.[/SIZE][/FONT]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Срок подачи жб',
	color: '',
	content:
	'[SIZE=4][FONT=Verdana][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]С момента выдачи наказания от технического специалиста прошло более 14-ти дней.[/center]<br><br>'+
	"[CENTER]Ваша тема закреплена и ожидает вердикта <u>Куратора Технических Специалистов / Заместителя Куратора Технических Специалистов</u>.<br><br>" +
  '[CENTER]@Raf_Piatigorsky , @Andrew_Benassy[/CENTER][/FONT][/SIZE]' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[SIZE=4][FONT=Verdana][CENTER]<u>Создавать подобные темы не нужно</u>.<br>' +
  '[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/CENTER]',
	prefix: PIN_PREFIX,
	status: true,
},
{
	title: 'Имущество восстановлено',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Убедительная просьба, <b><u>не менять никнейм до момента восстановления</u></b>.<br>" +
	'[CENTER]Для активации восстановления используйте команды: [COLOR=rgb(255, 213, 51)]/roulette[/COLOR], [COLOR=rgb(255, 213, 51)]/recovery[/COLOR][/CENTER]<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)][B][FONT=verdana]Ожидайте вердикта от команды проекта[/FONT][/B][/COLOR][/CENTER]',
	status: true,
	prefix: COMMAND_PREFIX,
},
{
	title: 'Не относится',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Ваше обращение не относится к жалобам на технических специалистов.<br> Пожалуйста, будьте добры, ознакомьтесь с правилами данного раздела: [URL='https://forum.blackrussia.online/forums/Информация-для-игроков.231/']клик[/URL] <br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Запрос привязок',
	color: '',
	content:
	'[SIZE=4][FONT=Verdana][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]1. Укажите ваш Telegram ID, если ваш игровой аккаунт был привязан к Telegram. Узнать его можно здесь: t.me/getmyid_bot<br>[/FONT][/COLOR][/B][COLOR=rgb(255, 255, 255)][FONT=verdana][B]2. Укажите ваш оригинальный ID страницы ВКонтакте, которая привязана к аккаунту (взять его можно через данный сайт - https://regvk.com/ )<br>[/B][/FONT][/COLOR][B][COLOR=rgb(255, 255, 255)][FONT=verdana]3. Укажите почту, которая привязана к аккаунту[/FONT][/COLOR][/B][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  "[CENTER][I][COLOR=rgb(247, 218, 100)][FONT=verdana]Ожидаю ваш ответ.[/FONT][/COLOR][/I][/CENTER]",
  prefix: TECHADM_PREFIX,
	status: true,
},
{
  title: 'Смена пароля',
  color: '',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Сбросьте пароль через любую из привязок ВКонтакте или Telegram, после чего, убедительная просьба, сообщить об этом в данной теме.<br><br>Ожидаю вашего ответа.<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/FONT][/SIZE][/COLOR]',
	prefix: TECHADM_PREFIX,
	status: true,
},

{
  title: ' ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ Технический раздел ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠᅠ  ᅠ ᅠ ᅠ ᅠ ᅠ  ᅠ ᅠ ',
  dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
},
{
	title: 'Форма подачи ТР',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Ваше обращение составлено не по форме.[/FONT][/COLOR][/B][/CENTER]<br>' +
	"[CENTER]Пожалуйста, заполните форму, создав новую тему: <br>[CODE]01. Ваш игровой никнейм:<br>02. Сервер, на котором Вы играете:<br>03. Суть Вашей возникшей проблемы (описать максимально подробно и раскрыто): <br>04. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>05. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/CODE]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{	title: 'Нет скринов/видео',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  "[CENTER]Без доказательств (в частности скриншоты или видео) – решить проблему не получится. Если доказательства найдутся - создайте новую тему, прикрепив доказательства с фотохостинга или видеохостинга<br> Также обращаем ваше внимание на то, что доказательства из социальных сетей <u>не принимаются</u>.<br><br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL],<br>[FONT=verdana][URL='https://imgfoto.host/']ImgFoto.host[/URL],<br>[URL='https://postimages.org/']Postimages.org[/URL][/FONT]<br>(все кликабельно).<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Правила раздела',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела, в котором Вы создали тему, поскольку Ваш запрос не относится к технической проблеме.<br>Что принимается в тех разделе:<br>Если возникли технические проблемы, которые так или иначе связаны с игровым модом<br>Форма заполнения:<br>[QUOTE]<br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01.[/COLOR] Ваш игровой никнейм:<br>[COLOR=rgb(226, 80, 65)]02.[/COLOR] Сервер, на котором Вы играете:<br>[COLOR=rgb(226, 80, 65)]03.[/COLOR] Суть возникшей проблемы (описать максимально подробно и раскрыто):<br>[COLOR=rgb(226, 80, 65)]04.[/COLOR] Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>[COLOR=rgb(226, 80, 65)]05.[/COLOR] Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/SIZE][/FONT][/QUOTE]<br>[/CENTER]<br><br>[CENTER][FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Если возникли технические проблемы, которые так или иначе связаны с вылетами из игры и любыми другими проблемами клиента[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[QUOTE]<br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01. [/COLOR]Ваш игровой ник:<br>[COLOR=rgb(226, 80, 65)]02. [/COLOR]Сервер:<br>[COLOR=rgb(226, 80, 65)]03.[/COLOR] Тип проблемы: Обрыв соединения | Проблема с ReCAPTCHA | Краш игры (закрытие игры) | Другое [Выбрать один вариант ответа]<br>[COLOR=rgb(226, 80, 65)]04. [/COLOR]Действия, которые привели к этому (при вылетах, по возможности предоставлять место сбоя):<br>[COLOR=rgb(226, 80, 65)]05.[/COLOR] Как часто данная проблема:<br>[COLOR=rgb(226, 80, 65)]06.[/COLOR] Полное название мобильного телефона:<br>[COLOR=rgb(226, 80, 65)]07.[/COLOR] Версия Android:<br>[COLOR=rgb(226, 80, 65)]08. [/COLOR]Дата и время (по МСК):<br>[COLOR=rgb(226, 80, 65)]09. [/COLOR]Связь с Вами по Telegram/VK:[/SIZE][/FONT][/QUOTE]" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Передача логисту',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Ваша тема закреплена и передана <u>Техническому Специалисту по Логированию</u> для дальнейшего вердикта, пожалуйста, ожидайте ответ в данной теме.<br><br>" +
	'[CENTER]Создавать новые темы с данной проблемой не нужно.<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/color][/CENTER][/FONT][/SIZE]',
	prefix: TECHADM_PREFIX,
	status: true,
},
{
  title: 'Забыл пароль',
	color: '',
	content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)]В решении данной проблемы вам могут помочь только установленные привязки на аккаунте.<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)]Вы можете через специализированного бота в привязанных социальных сетях восстановить доступ к игровому аккаунту, сбросив пароль через окно "ввода пароля" при входе в игру или же поменяв пароль в самом боте. Если же на вашем игровом аккаунте отсутствуют привязки — мы ничем не сможем вам помочь, ибо каждый игрок несёт ответственность за свой игровой аккаунт и за игровые ценности на нём.<br><br>' +
  "Помощник Кирилл (Telegram) - [I][URL='https://t.me/br_helper_bot']клик[/URL][/I] (кликабельно)<br>" +
  "[CENTER][B][FONT=verdana]BLACK RUSSIA - Мобильная онлайн-игра (ВКонтакте) - [URL='https://vk.com/blackrussia.online'][I]клик [/I][/URL](кликабельно)[/FONT][/B][/CENTER]<br><br>" +
  '[COLOR=rgb(255, 255, 255)][B]После регистрации игрового аккаунта мы настоятельно рекомендуем каждому пользователю обезопасить свой игровой аккаунт всеми возможными соответствующими привязками, дабы в дальнейшем не попадать в подобные ситуации и не попадаться на несанкционированный вход со стороны злоумышленников.<br><br>' +
  '[COLOR=rgb(255, 255, 255)][B] Мы не сбрасываем пароли и не отвязываем возможно утерянные привязки от игровых аккаунтов.<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Пропало имущество(доп.инфа)',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][SIZE=5][FONT=Verdana]Для дальнейшего рассмотрения темы, предоставьте:<br><BR>[QUOTE]1. Скриншоты или видео, подтверждающие факт владения этим имуществом.<BR>2. Все детали пропажи: дата, время, после каких действий имущество пропало.<BR>3. Информация о том, как вы изначально получили это имущество:<BR>4. Дата покупки;<br>5. Способ приобретения (у игрока, в магазине или через донат;<br>6. Видеофиксация покупки (если присутствует);<br>7. Никнейм игрока, у которого было приобретено имущество, если покупка была сделана не в магазине.[/QUOTE]<BR>[/CENTER]'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]Тема закреплена и находится на рассмотрении[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: PIN_PREFIX,
	status: true,
},
{
	title: "Проблемы с Кешом",
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[center]Если вы столкнулись с проблемой загрузки страниц форума, пожалуйста, выполните следующие действия:<br><br>• Откройте "Настройки".<br>• Найдите во вкладке "Приложения" свой браузер, через который вы пользуетесь нашим сайтом форума.<br>• Нажмите на браузер, после чего внизу выберите "Очистить" -> "Очистить Кэш".<br><br>После следуйте данным инструкциям:<br>• Перейдите в настройки браузера.<br>• Выберите "Конфиденциальность и безопасность" -> "Очистить историю".<br>• В основных и дополнительных настройках поставьте галочку в пункте "Файлы cookie и данные сайтов".<br>После этого нажмите "Удалить данные".<br><br>Ниже прилагаем видео-инструкции описанного процесса для разных браузеров:<br>Для браузера CHROME: https://youtu.be/FaGp2rRru9s<br>Для браузера OPERA: https://youtube.com/shorts/eJOxkc3Br6A?feature=share'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Законопослушность',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]К сожалению, администрация, технические специалисты и другие должностные лица BLACK RUSSIA не могут повлиять на законопослушность вашего аккаунта.<br>Повысить законопослушность можно двумя способами:<BR><BR>1. Каждый PayDay (00 минут каждого часа) вам начисляется одно очко законопослушности(Если только у вас нет PLATINUM VIP-статуса), если за прошедший час вы отыграли не менее 20 минут.<br>2. Приобрести законопослушность в /donate.<br>[/CENTER]'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Команде проекта',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Ваша тема закреплена и находится на рассмотрении у команды проекта.<br>" +
	"[CENTER]Создавать новые темы с данной проблемой — не нужно, ожидайте ответа в данной теме. Если проблема решится - Вы всегда можете оставить своё сообщение в этой теме.<br>" +
	"[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>" +
  '[CENTER][COLOR=rgb(255, 255, 0)]Передано команде проекта.[/color][/CENTER][/FONT][/SIZE]',
	prefix: COMMAND_PREFIX,
	status: true,
},
{
	title: 'Известно КП',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Команде проекта уже известно о данной проблеме, она обязательно будет рассмотрена и исправлена.<br>Спасибо за Ваше обращение!<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Не является багом',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Проблема, с которой вы столкнулись, не является багом или ошибкой сервера.<br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'В раздел Госс Организаций.',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Ваша тема не относится к техническому разделу, пожалуйста, оставьте ваше заявление в соответствующем разделе Государственных Организаций вашего сервера.[/CENTER]<br><br>'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'В раздел Криминальных Организаций',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Ваша тема не относится к техническому разделу, пожалуйста, оставьте ваше заявление в соответствующем разделе Криминальных Организаций вашего сервера.[/CENTER]'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Жб на адм',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Обратитесь в раздел 'Жалобы на администрацию' вашего сервера.<br>Форма для подачи жалобы - [I][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/']клик[/URL][/I] (кликабельно)<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Жб на лидеров',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Данная тема не относится к техническому разделу.<br>Пожалуйста, обратитесь в раздел 'Жалобы на Лидеров' Вашего сервера.<br>Форма подачи жалобы - [I][URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.3429391/']клик[/URL][/I] (кликабельно)" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Жб на игроков',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Данная тема не относится к техническому разделу.<br>Пожалуйста, обратитесь в раздел 'Жалобы на игроков' Вашего сервера.<br>Форма подачи жалобы - [I][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/']клик[/URL][/I] (кликабельно)" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Обжалования',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Вы получили наказание от администратора своего сервера.<br> Для его снижения/обжалования обратитесь в раздел<br><<Обжалования>> вашего сервера.<br>Форма подачи темы - [I][URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']клик[/URL][/I] (кликабельно)" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Сервер не отвечает',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Если у Вас встречаются такие проблемы, как «Сервер не отвечает», не отображаются сервера в лаунчере, не удаётся выполнить вход на сайт/форум, попробуйте совершить следующие действия: <br><br>" +
	"[LEFT]• Сменить IP-адрес любыми средствами; <br>" +
	"[LEFT]• Переключиться на Wi-Fi/мобильный интернет или на любую доступную сеть; <br>"+
	"[LEFT]• Использование VPN; <br>"+
	"[LEFT]• Перезагрузка роутера.<br><br>" +
	"[CENTER]Если методы выше не помогли, то переходим к следующим шагам: <br><br>" +
	'[LEFT]1. Устанавливаем приложение «1.1.1.1: Faster & Safer Internet» Ссылка: https://clck.ru/ZP6Av и переходим в него.<br>'+
	'[LEFT]2. Соглашаемся со всей политикой приложения.<br>'+
	'[LEFT]3. Нажимаем на ползунок и ждем, когда текст изменится на «Подключено».<br>'+
	'[LEFT]4. Проверяем: Отображаются ли серверы? Удается ли выполнить вход в игру? Работают ли другие источники (сайт, форум)? <br>' +
	'[CENTER]📹 Включение продемонстрировано на видео: https://youtu.be/Wft0j69b9dk<br>'+
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
  title: 'Перенаправление в поддержку',
	color: '',
	content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)]В том случае, если у вас произошла одна из указанных проблем:[/COLOR][/B][/CENTER]<br>' +
  '[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana]1. Баланс доната (BC) стал отрицательным.<br> 2. Донат не был зачислен на аккаунт.<br> 3. Донат был зачислен не в полном объеме.<br> 4. Отсутствие подарка при подключении или продлении тарифа Tele-2.<br> 5. Частые переподключения к серверу.[/FONT][/COLOR][/CENTER]<br><br>' +
  '[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Вам в срочном порядке необходимо обратиться в техническую поддержку нашего проекта https://vk.com/br_tech (ВКонтакте) или https://t.me/br_techBot (Telegram).[/FONT][/COLOR][/B][/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Сим-карта',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][SIZE=4][FONT=Veranda][FONT=verdana][COLOR=rgb(255, 255, 255)][B]Если вы приобрели тариф Black Russia, но награды не были зачислены или у Вас не получается активировать номер с тарифом Black Russia , тогда [/B][I][B]убедитесь в следующем:[/B][/I][/COLOR][/FONT][/FONT][/FONT][/SIZE][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana]1. У вас тариф Black Russia, а не другой тариф, например, тариф Black[/FONT][/B][/CENTER]<br>' +
  '[B][FONT=verdana][COLOR=rgb(255, 255, 255)]2. Номер активирован.[/COLOR][/FONT]<br>' +
  '[B][FONT=verdana][COLOR=rgb(255, 255, 255)]3. После активации номера [U]прошло более 48-ми часов.[/U][/COLOR][/FONT]<br><br>' +
  '[B][FONT=verdana][COLOR=rgb(255, 255, 255)]Если пункты выше не описывают вашу ситуацию в обязательном порядке обратитесь в службу поддержки[I] для дальнейшего решения:[/I][/COLOR][/FONT]<br>' +
  '[B][FONT=verdana][COLOR=rgb(255, 255, 255)]На сайте через виджет обратной связи или посредством месенджеров: ВКонтакте: vk.com/br_tech, Telegram: t.me/br_techBot[/COLOR][/FONT]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Правила восстановления',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Пожалуйста, убедительная просьба, ознакомьтесь с правилами восстановлений - [URL='https://forum.blackrussia.online/index.php?threads/В-каких-случаях-мы-не-восстанавливаем-игровое-имущество.25277/']клик[/URL]<br>Вы создали тему, которая не относится к технической проблеме.[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Хочу стать адм/хелп',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Технические специалисты не принимают решения по назначению на должности.<br>Для этого есть раздел заявок на форуме - [I][URL='https://forum.blackrussia.online/forums/%D0%97%D0%90%D0%AF%D0%92%D0%9A%D0%98-%D0%9D%D0%90-%D0%94%D0%9E%D0%9B%D0%96%D0%9D%D0%9E%D0%A1%D0%A2%D0%98-%D0%9B%D0%98%D0%94%D0%95%D0%A0%D0%9E%D0%92-%D0%98-%D0%90%D0%93%D0%95%D0%9D%D0%A2%D0%9E%D0%92-%D0%9F%D0%9E%D0%94%D0%94%D0%95%D0%A0%D0%96%D0%9A%D0%98.3066/']клик[/URL][/I] (кликабельно), где вы можете ознакомиться с актуальными заявками и формами подачи.<br>Приятной игры и удачи в карьерном росте!<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Предложение по улучш.',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Ваша тема не относится к технической проблеме.<br>Если вы хотите предложить улучшение, пожалуйста, перейдите в соответствующий раздел.<br> [URL="https://forum.blackrussia.online/index.php?categories/Предложения-по-улучшению.656/"] Предложения по улучшению → нажмите сюда[/URL]<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Нужны все прошивки',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER] Для активации какой либо прошивки необходимо поставить все детали данного типа "SPORT" "SPORT+" и т.п.<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Тестерам',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Ваша тема передана на тестирование.[/CENTER][/FONT][/SIZE]" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>',
	prefix: WAIT_PREFIX,
	status: false,
},
{
	title: 'Пропали вещи с аукц/маркет',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Если вы выставили свои вещи на аукцион а их никто не купил, то воспользуйтесь командой [COLOR=rgb(251, 160, 38)]/reward[/COLOR]<br> В случае отсутствии вещей там, приложите скриншоты с + /time в новой теме<br><br>Если же вещи пропали с маркетплейса, значит их никто не купил, вам следует забрать их с ПВЗ (пункта выдачи заказов) в течение 7 дней, иначе предметы системно уничтожатся.<br>'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Отвязка привязок',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Удалить установленные привязки на вашем аккаунте не представляется возможным ни нам, ни команде проекта.[/FONT][/COLOR][/B]<br><br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Бывают случаи, когда злоумышленник, получив несанкционированный доступ к аккаунту, устанавливает на него свою привязку. В такой ситуации аккаунт блокируется перманентно с причиной "Чужая привязка". Дальнейшая разблокировка игрового аккаунта невозможна во избежания повторных случаев взлома.[/COLOR][/FONT][/B][/CENTER]' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Нерабочая ссылка',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]К сожалению, ссылка на ваши прикрепленные доказательства недоступна или не работает.[/COLOR][/FONT][/B]<br>' +
  '[CENTER][B][FONT=verdana]Пожалуйста, отправьте новое обращение, убедившись, что ссылка на  доказательства работает и содержит качественные фотографии или видеозаписи.[/FONT][/B][/CENTER]' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Заблокированный IP',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 255)][FONT=Verdana][size=15px]Вы оказались на заблокированном IP-адресе. Ваш аккаунт не заблокирован, так что поводов для беспокойства нет. Такая ситуация может возникнуть по разным причинам, например, из-за смены мобильного интернета или переезда. Чтобы избежать этой проблемы, перезагрузите телефон или используйте VPN.[/CENTER] <br>' +
	'[CENTER]Приносим свои извинения за доставленные неудобства. Желаем приятного времяпровождения на нашем проекте.[/CENTER]<br>' +
  '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
  title: 'Восстановление после взлома',
  content:
  "[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana]Компенсация и возврат имущества после взлома аккаунта невозможны. За безопасность аккаунта отвечаете лично Вы, следовательно за потерянное имущество, компенсация согласно общему регламенту правил, а также правил восстановлений имущества, не полагается. Технические специалисты лишь отслеживают переданное имущество на аккаунт злоумышленника и фиксируют нарушение.[/FONT][/B][/CENTER]<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
  title: 'Нет ответа от игрока',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][COLOR=rgb(255, 255, 255)][FONT=verdana]Ваше обращение закрывается в связи с отсутствием обратной связи.[/FONT][/COLOR][/B][/CENTER]<br>' +
  '[CENTER][B][FONT=verdana][COLOR=rgb(255, 255, 255)]Если ваша проблема является актуальной - подайте новое обращение.[/COLOR][/FONT][/B][/CENTER]<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/FONT][/I][/B][CENTER]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
  title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ ЖАЛОБЫ НА ИГРОКОВ ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ     ',
  dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
    },
{
	title: 'Игрок будет заблокирован',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER][SIZE=4][FONT=Verdana]После проверки доказательств и системы логирования вердикт:<br><br>[FONT=verdana]Игрок будет заблокирован[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER][I][FONT=verdana][COLOR=rgb(0, 255, 0)][B]Одобрено[/B][/COLOR][/FONT][/I][/CENTER]",
  prefix: ODOBRENO_PREFIX,
  status: false
},
{
	title: 'Игрок не будет заблокирован',
	color: '',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=Verdana][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER][SIZE=4][FONT=Verdana]После проверки доказательств и системы логирования вердикт:<br><br>Доказательств недостаточно для блокировки игрока[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER][B][I][FONT=verdana][COLOR=rgb(255, 0, 0)]Отказано[/COLOR][/FONT][/I][/B][/CENTER]",
  prefix: UNACCEPT_PREFIX,
  status: false
},
];


const buttons1 = [
{
        title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ Перенаправление тем 18ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
},
{
  title: 'Перенаправление в ТР 18',
	content:
  "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
  "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
	'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Технический раздел"[/COLOR] сервера [COLOR=rgb(0, 255, 255)]18 | AQUA. [/color][/center]',
	prefix: TRANSFER_PREFIX4,
	status: false,
},
{
  title: 'Перенаправление в ЖБ Тех 18',
	content:
  "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
  "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
	'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Жалобы на технических специалистов"[/COLOR] сервера [COLOR=rgb(0, 255, 255)]18 | AQUA. [/color][/center]',
	prefix: TRANSFER_PREFIX5,
	status: false,
},
{
  title: 'Перенаправление в ЖБ Адм 18',
	content:
  "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
  "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
	'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Жалобы на администрацию"[/COLOR] сервера [COLOR=rgb(0, 255, 255)]18 | AQUA. [/color][/center]',
	prefix: TRANSFER_PREFIX1,
	status: false,
},
{
  title: 'Перенаправление в ЖБ Игр 18',
	content:
  "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
  "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
	'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Жалобы на игроков"[/COLOR] сервера [COLOR=rgb(0, 255, 255)]18 | AQUA. [/color][/center]',
	prefix: TRANSFER_PREFIX3,
	status: false,
},
{
  title: 'Перенаправление в ОБЖ Адм 18',
	content:
  "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
  "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
	'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Обжалование наказаний"[/COLOR] сервера [COLOR=rgb(0, 255, 255)]18 | AQUA. [/color][/center]',
	prefix: TRANSFER_PREFIX2,
	status: false,
},
{
        title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ Перенаправление тем 88ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
},
{
  title: 'Перенаправление в ТР 88',
	content:
  "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
  "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
	'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Технический раздел"[/COLOR] сервера 88 Magadan[/center]',
	prefix: TRANSFER_PREFIX9,
	status: false,
},
{
  title: 'Перенаправление в ЖБ Тех 88',
	content:
  "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
  "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
	'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Жалобы на технических специалистов"[/COLOR] сервера 88 Magadan[/center]',
	prefix: TRANSFER_PREFIX10,
	status: false,
},
{
  title: 'Перенаправление в ЖБ Адм 88',
	content:
  "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
  "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
	'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Жалобы на администрацию"[/COLOR] сервера 88 Magadan[/center]',
		prefix: TRANSFER_PREFIX6,
		status: false,
},
{
  title: 'Перенаправление в ЖБ Игр 88',
	content:
  "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
  "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
	'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Жалобы на игроков"[/COLOR] сервера 88 Magadan[/center]',
	prefix: TRANSFER_PREFIX8,
	status: false,
},
{
  title: 'Перенаправление в ОБЖ Адм 88',
	content:
  "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
  "[COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px][CENTER]Доброго времени суток, уважаемый(-ая) {{ user.mention }}[/CENTER]<br><br>" +
	'[CENTER][COLOR=rgb(209, 213, 216)][FONT=Arial][size=15px]Вы ошиблись разделом. Переношу вашу тему в раздел [COLOR=rgb(255,207,64)]"Обжалование наказаний"[/COLOR] сервера 88 Magadan[/center]',
	prefix: TRANSFER_PREFIX7,
	status: false,
},
];
$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрение', 'pin', 'border-radius: 20px; margin-right: 11px; border: 2px solid; border-color: rgb(255, 165, 0);');
	addButton('КП', 'teamProject', 'border-radius: 20px; margin-right: 100x; border: 2px solid; border-color: rgb(255, 255, 0);');
	addButton('Рассмотрено', 'watched', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0);');
	addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0);');
	addButton('Решено', 'decided', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 255, 0);');
	addButton('Закрыто', 'closed', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 0);');
	addButton('Тех. спецу', 'techspec', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 0, 255);');
  addButton('Одобрено', 'odobreno', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(128, 255, 128);');
	addAnswers();
  addAnswers1();

	// Поиск информации о теме
	const threadData = getThreadData();

	$(`button#ff`).click(() => pasteContent(8, threadData, true));
	$(`button#prr`).click(() => pasteContent(2, threadData, true));
	$(`button#zhb`).click(() => pasteContent(21, threadData, false));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
	$('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#odobreno').click(() => editThreadData(ODOBRENO_PREFIX, false));
	$('button#techspec').click(() => editThreadData(TECHADM_PREFIX, true));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX1, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX2, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX3, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX4, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX5, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX6, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX7, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX8, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX9, false));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX10, false));

	$(`button#selectAnswers`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
            buttons.forEach((btn, id) => {
                if (id > 5) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });

   $(`button#selectAnswers1`).click(() => {
            XF.alert(buttons1Markup(buttons1), null, 'Выберите ответ:');
            buttons1.forEach((btn, id) => {
                if (id > 0) {
                    $(`button#answers-${id}`).click(() => pasteContent1(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent1(id, threadData, false));
                }
            });
        })});


    function addButton(name, id, hex = "grey") {
		$('.button--icon--reply').before(
		`<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 25px; margin-right: 5px; background-color: ${hex}">${name}</button>`,
		);
		}
   function addAnswers() {
        $('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswers" style="oswald: 3px; margin-left: 5px; margin-top: 1px; border-radius: 13px; background-color: #FF4500; border-color: #E6E6FA">Ответы</button>`,
        );
    }
   function addAnswers1() {
        $('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswers1" style="oswald: 3px; margin-left: 5px; margin-top: 1px; border-radius: 13px; background-color: #FF4500; border-color: #E6E6FA">Перемещения</button>`,
        );
    }


    function buttonsMarkup(buttons) {
    return `<div class="select_answer">${buttons
        .map(
        (btn, i) =>
        `<button id="answers-${i}" class="button--primary button rippleButton" style="margin:4px; border-radius: 13px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
    )
        .join('')}</div>`;
    }
function buttons1Markup(buttons1) {
        return `<div class="select_answer">${buttons1
            .map(
            (btn, i) =>
        `<button id="answers-${i}" class="button--primary button rippleButton" style="margin:4px; border-radius: 13px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
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
        function pasteContent1(id, data = {}, send = false) {
    const template = Handlebars.compile(buttons1[id].content);
    if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

    $('span.fr-placeholder').empty();
    $('div.fr-element.fr-view p').append(template(data));
    $('a.overlay-titleCloser').trigger('click');

    if (send == true) {
        editThreadData(buttons1[id].prefix, buttons1[id].status);
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

	function editThreadData(prefix, pin = false, may_lens = true) {
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
	discussion_open: 1,
	sticky: 1,
	_xfToken: XF.config.csrf,
	_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
	_xfWithData: 1,
	_xfResponseType: 'json',
	}),
	}).then(() => location.reload());
	}
	if(may_lens === true) {
	if(prefix == WATCHED_PREFIX || prefix == CLOSE_PREFIX || prefix == DECIDED_PREFIX) {
	moveThread(prefix, 230); }

	if(prefix == WAIT_PREFIX) {
	moveThread(prefix, 917);
	}}
        if(prefix == TRANSFER_PREFIX1) {
        moveThread(prefix, 842);
      }
        if(prefix == TRANSFER_PREFIX3) {
        moveThread(prefix, 844);
      }
        if(prefix == TRANSFER_PREFIX5) {
        moveThread(prefix, 1199);
      }
        if(prefix == TRANSFER_PREFIX4) {
        moveThread(prefix, 815);
      }
        if(prefix == TRANSFER_PREFIX2) {
        moveThread(prefix, 845);
      }
        if(prefix == TRANSFER_PREFIX6) {
        moveThread(prefix, 3930);
      }
        if(prefix == TRANSFER_PREFIX8) {
        moveThread(prefix, 3932);
      }
        if(prefix == TRANSFER_PREFIX10) {
        moveThread(prefix, 3911);
      }
        if(prefix == TRANSFER_PREFIX9) {
        moveThread(prefix, 3912);
      }
        if(prefix == TRANSFER_PREFIX7) {
        moveThread(prefix, 3933);
      }
	};

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
const bgButtons = document.querySelector(".pageContent");

const buttonConfig = (text, href) => {
    const button = document.createElement("button");

    // Стили на чистом JavaScript для совместимости с iOS и других браузеров.
    button.style.color = "#FFFFFF"; // Белый текст
    button.style.backgroundColor = "#212529"; // Серо-черный фон (слегка темнее)
    button.style.borderColor = "#6c757d"; // Серый цвет рамки (более мягкий)
    button.style.borderRadius = "13px"; // Закругленные углы
    button.style.borderStyle = "solid"; // Добавляем стиль границы, чтобы ее было видно
    button.style.borderWidth = "1px";   // Толщина рамки.  Можно убрать, если вам нужна кнопка без видимой рамки.
    button.style.padding = "0.5rem 1rem"; // Отступы
    button.style.fontSize = "1rem"; // Размер шрифта
    button.style.cursor = "pointer"; // Курсор при наведении
    button.style.transition = "background-color 0.3s ease"; // Плавный переход цвета

    button.textContent = text;
    button.classList.add("bgButton");

    button.addEventListener("mouseover", () => {
        button.style.backgroundColor = "#343a40"; // Более светлый серо-черный при наведении
    });

    button.addEventListener("mouseout", () => {
        button.style.backgroundColor = "#212529"; // Возвращаем исходный цвет
    });

    button.addEventListener("click", () => {
        window.location.href = href;
    });
    return button;
};


const Button18 = buttonConfig("ЖБ ТЕХ 18", 'https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9618-aqua.1199/');
const ButtonTech88 = buttonConfig("ТР 88", 'https://forum.blackrussia.online/forums/Технический-раздел-magadan.3912/');
const ButtonTech18 = buttonConfig("ТР 18", 'https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-aqua.815/');
const ButtonComp18 = buttonConfig("ЖБ ИГР 18", 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.844/');
const ButtonComp111 = buttonConfig("ОПС", "https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/")

bgButtons.append(Button18); // ЖБ ТЕХ 18
bgButtons.append(ButtonTech88); // ТР 88
bgButtons.append(ButtonTech18); // ТР 18
bgButtons.append(ButtonComp18); // ЖБ ИГР 18
bgButtons.append(ButtonComp111); // ОБШИЕ ПРАВИЛА ПРОЕКТА

// Скролл для мобильных
const scrollCSS = `
    @media (max-width: 768px) {
        .pageContent {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            white-space: nowrap;
        }
        .pageContent > button {
            display: inline-block;
            white-space: normal;
        }
    }
`;
document.head.insertAdjacentHTML("beforeend", `<style>${scrollCSS}</style>`);
