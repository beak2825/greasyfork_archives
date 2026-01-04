// ==UserScript==
// @name Технические шоколадки - GREEN
// @namespace https://forum.blackrussia.online
// @version 2.0
// @description Тех скрипт - Yupi_Wakupo
// @author t.me/cyberalg
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant t.me/cyberalg
// @license t.me/cyberalg
// @collaborator t.me/cyberalg
// @icon https://i.yapx.ru/ViO6c.png
// @downloadURL https://update.greasyfork.org/scripts/469755/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B5%20%D1%88%D0%BE%D0%BA%D0%BE%D0%BB%D0%B0%D0%B4%D0%BA%D0%B8%20-%20GREEN.user.js
// @updateURL https://update.greasyfork.org/scripts/469755/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B5%20%D1%88%D0%BE%D0%BA%D0%BE%D0%BB%D0%B0%D0%B4%D0%BA%D0%B8%20-%20GREEN.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // префикс отказано
	const PIN_PREFIX = 2; //  префикс закрепить
	const COMMAND_PREFIX = 10; // команде проекта
	const CLOSE_PREFIX = 7; // префикс закрыто
	const DECIDED_PREFIX = 6; // префикс решено
	const TECHADM_PREFIX = 13 // теху администратору
	const WATCHED_PREFIX = 9; // рассмотрено
	const WAIT_PREFIX = 14; // ожидание (для переноса в баг-трекер)
	const NO_PREFIX = 0;
	const buttons = [
	{
		title: '|',
		content:
		'[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		'[SIZE=4][B][FONT=trebuchet ms]текст[/FONT][/B][/SIZE]',
	},
	{
	  title: 'ᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠПОЛОЖИТЕЛЬНОᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠ',
	},
	{
		title: 'На рассмотрении',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		'[FONT=trebuchet ms][SIZE=4][B]Ваша тема взята на рассмотрение, ожидайте ответа. Рассмотрение может занять определенное время, не нужно создавать дубликатов темы.[/B][/SIZE][/FONT]<br><br>' +
		'[SIZE=4][B][COLOR=rgb(255, 152, 0)][FONT=trebuchet ms]На рассмотрении.[/FONT][/COLOR][/B][/SIZE]',
		prefix: PIN_PREFIX,
		status: true,
	},
	{
		title: 'Опровержение трансфера',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		'[FONT=trebuchet ms][SIZE=4][B]Доказать отсутствие трансфера можно одним способом:[/B][/SIZE][/FONT]<br><br>' +
        '[FONT=trebuchet ms][SIZE=4][B]Вы должны взять 2 устройства, зайти на аккаунты и сделать фотографию окон блокировки на двух устройствах. Важно, чтобы в кадр попало 2 устройства и окна блокировки. Ожидаю вашего ответа.[/B][/SIZE][/FONT]<br><br>' +
		'[SIZE=4][B][COLOR=rgb(255, 152, 0)][FONT=trebuchet ms]На рассмотрении.[/FONT][/COLOR][/B][/SIZE]',
		prefix: PIN_PREFIX,
		status: true,
	},
	{
		title: 'Наказание будет снижено',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		'[FONT=trebuchet ms][SIZE=4][B]Проверив Вашу историю наказаний, было принято решение о снижении срока блокировки аккаунта.[/B][/SIZE][/FONT]<br><br>' +
        '[FONT=trebuchet ms][SIZE=4][B]Будьте аккуратнее в следующие разы, на встречу идти мы больше не будем.[/B][/SIZE][/FONT]<br><br>' +
		'[SIZE=4][B][COLOR=rgb(65, 168, 95)][FONT=trebuchet ms]Рассмотрено.[/FONT][/COLOR][/B][/SIZE]',
		prefix: WATCHED_PREFIX,
		status: false,
	},
	{
		title: 'Если Вы обезопасили аккаунт',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		"[FONT=trebuchet ms][SIZE=4][B][1] Если Вы обезопасили свой аккаунт привязав его к странице [U]ВКонтакте[/U], то сбросить пароль или пин-код Вы всегда можете обратившись в официальное сообщество проекта - [URL='https://vk.com/blackrussia.online'][U]Тык[/U][/URL].[/B][/SIZE][/FONT]<br><br>" +
		"[FONT=trebuchet ms][SIZE=4][B][2] Если Вы обезопасили свой аккаунт привязав его к [U]Телеграмм[/U], то сбросить пароль или пин-код Вы всегда можете обратившись к боту - [URL='https://t.me/br_helper_bot'][U]Тык[/U][/URL].[/B][/SIZE][/FONT]<br><br>" +
        "[FONT=trebuchet ms][SIZE=4][B][3] Если Вы обезопасили свой аккаунт привязав его к [U]почте[/U], то сбросить пароль или пин-код Вы всегда можете при вводе пароля. После подключения к серверу нажмите на кнопку «Восстановить пароль», затем на указанную почту будет отправлено письмо с одноразовым кодом восстановления.[/B][/SIZE][/FONT]<br><br>" +
		"[FONT=trebuchet ms][SIZE=4][B]Если Вы НЕ обезопасили свой аккаунт - его никак не вернуть. Игрок сам несет ответственность за безопасность своего аккаунта.[/B][/SIZE][/FONT]<br><br>" +
        '[SIZE=4][B][COLOR=rgb(65, 168, 95)][FONT=trebuchet ms]Рассмотрено.[/FONT][/COLOR][/B][/SIZE]',
		prefix: WATCHED_PREFIX,
		status: false,
	},
	{
		title: 'Не возварщяем донат',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		"[FONT=trebuchet ms][SIZE=4][B]Основания для возврата денежных средств отсутствуют. Подробнее ознакомьтесь с политикой возврата платежей по ссылкам - [URL='https://blackrussia.online/oferta.php'][U]ДОГОВОР ОФЕРТЫ[/U][/URL] | [URL='https://blackrussia.online/politica.php'][U]ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ[/U][/URL].[/B][/SIZE][/FONT]<br><br>" +
        '[SIZE=4][B][COLOR=rgb(65, 168, 95)][FONT=trebuchet ms]Решено.[/FONT][/COLOR][/B][/SIZE]',
	  prefix: DECIDED_PREFIX,
	  status: false,
	},
	{
		title: 'Выдача компенсации',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		'[FONT=trebuchet ms][SIZE=4][B]Ваше игровое имущество / денежные средства будут восстановлены в течение двух недель. Не меняйте NickName до момента восстановления.[/B][/SIZE][/FONT]<br><br>' +
        '[FONT=trebuchet ms][SIZE=4][B]Для активации восстановления используйте команды: [U]/roulette[/U]; [U]/recovery[/U].[/B][/SIZE][/FONT]<br><br>' +
		'[SIZE=4][B][COLOR=rgb(65, 168, 95)][FONT=trebuchet ms]Решено.[/FONT][/COLOR][/B][/SIZE]',
		status: false,
		prefix: DECIDED_PREFIX,
	},
	{
		title: 'Будете разблокированы',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		'[FONT=trebuchet ms][SIZE=4][B]Аккаунт будет разблокирован.[/B][/SIZE][/FONT]<br><br>' +
		'[SIZE=4][B][COLOR=rgb(65, 168, 95)][FONT=trebuchet ms]Решено.[/FONT][/COLOR][/B][/SIZE]',
		prefix: DECIDED_PREFIX,
		status: true,
	},
	{
		title: 'Переустановите игру',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		'[FONT=trebuchet ms][SIZE=4][B]Возможно в файлах игры присутствует постороннее программное обеспечение (изменения / дополнения).[/B][/SIZE][/FONT]<br><br>' +
        "[FONT=trebuchet ms][SIZE=4][B]Рекомендуется полностью удалить лаунчер и связанные с ним файлы, затем установить игру заново с официального сайта - [URL='https://blackrussia.online'][U]Тык[/U][/URL].[/B][/SIZE][/FONT]<br><br>" +
		'[SIZE=4][B][COLOR=rgb(65, 168, 95)][FONT=trebuchet ms]Решено.[/FONT][/COLOR][/B][/SIZE]',
		prefix: DECIDED_PREFIX,
		status: false,
	},
	{
		title: 'Перезагрузите WI-FI',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		'[FONT=trebuchet ms][SIZE=4][B]Чаще всего данная проблема возникает при использовании VPN-сервисов.[/B][/SIZE][/FONT]<br><br>' +
        "[FONT=trebuchet ms][SIZE=4][B]Рекомендуется полностью перезагрузить WI-FI роутер, если ошибка повторится - обратитесь повторно.[/B][/SIZE][/FONT]<br><br>" +
		'[SIZE=4][B][COLOR=rgb(65, 168, 95)][FONT=trebuchet ms]Решено.[/FONT][/COLOR][/B][/SIZE]',
		prefix: DECIDED_PREFIX,
		status: false,
	},
	{
	  title: 'ᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠ------------------------ᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠ',
	},
	{
		title: 'Не по теме',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		'[FONT=trebuchet ms][SIZE=4][B]Ваше обращение не относится к данному разделу.[/B][/SIZE][/FONT]<br><br>' +
		'[SIZE=4][B][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Отказано.[/FONT][/COLOR][/B][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'В - ТЕХ раздел',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		"[FONT=trebuchet ms][SIZE=4][B]Ваше обращение не относится к данному разделу, обратитесь в Технический раздел - [URL='https://forum.blackrussia.online/index.php?forums/Технический-раздел.22/'][U]Тык[/U][/URL][/B][/SIZE][/FONT]<br><br>" +
		'[SIZE=4][B][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Отказано.[/FONT][/COLOR][/B][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'В ЖБ - на ТЕХОВ',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		"[FONT=trebuchet ms][SIZE=4][B]Ваше обращение не относится к данному разделу, обратитесь в раздел жалоб на Технических специалистов - [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/'][U]Тык[/U][/URL][/B][/SIZE][/FONT]<br><br>" +
		'[SIZE=4][B][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Отказано.[/FONT][/COLOR][/B][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'В ЖБ - АДМ',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		"[FONT=trebuchet ms][SIZE=4][B]Ваше обращение не относится к данному разделу, обратитесь раздел жалоб на администрацию.[/B][/SIZE][/FONT]<br><br>" +
		'[SIZE=4][B][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Отказано.[/FONT][/COLOR][/B][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'В ЖБ - игроки',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		"[FONT=trebuchet ms][SIZE=4][B]Ваше обращение не относится к данному разделу, обратитесь раздел жалоб на игроков.[/B][/SIZE][/FONT]<br><br>" +
		'[SIZE=4][B][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Отказано.[/FONT][/COLOR][/B][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'В - обжалование',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		"[FONT=trebuchet ms][SIZE=4][B]Ваше обращение не относится к данному разделу, обратитесь раздел обжалования наказаний.[/B][/SIZE][/FONT]<br><br>" +
		'[SIZE=4][B][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Отказано.[/FONT][/COLOR][/B][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Правила подачи (ЖБ на ТЕХОВ)',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		"[FONT=trebuchet ms][SIZE=4][B]Ознакомьтесь с правилами подачи жалоб на Технических специалистов по ссылке - [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.2090964/'][U]Тык[/U][/URL][/B][/SIZE][/FONT]<br><br>" +
		'[SIZE=4][B][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Отказано.[/FONT][/COLOR][/B][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Правила подачи (ТЕХ раздел)',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		"[FONT=trebuchet ms][SIZE=4][B]Ознакомьтесь с правилами подачи жалоб в Технический раздел по ссылке - [URL='https://forum.blackrussia.online/threads/%D0%A8%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D1%8B-%D0%B4%D0%BB%D1%8F-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BE%D0%BA-%D0%B2-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-%D0%B5%D1%81%D0%BB%D0%B8-%D0%BD%D0%B5-%D0%BF%D0%BE-%D1%84%D0%BE%D1%80%D0%BC%D0%B5-%E2%80%94-%D0%BE%D1%82%D0%BA%D0%B0%D0%B7.44668/'][U]Тык[/U][/URL][/B][/SIZE][/FONT]<br><br>" +
		'[SIZE=4][B][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Отказано.[/FONT][/COLOR][/B][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
	  title: 'ᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠОТРИЦАТЕЛЬНОᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠ',
	},
	{
		title: 'Нет ответа',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		'[FONT=trebuchet ms][SIZE=4][B]По техническими соображениям было принято решение закрыть данное обращение.[/B][/SIZE][/FONT]<br><br>' +
        "[FONT=trebuchet ms][SIZE=4][B]Если проблема все еще актуальна, оставьте новую заявку в данном разделе повторно.[/B][/SIZE][/FONT]<br><br>" +
		'[SIZE=4][B][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Закрыто.[/FONT][/COLOR][/B][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Нет окна блокировки',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		'[FONT=trebuchet ms][SIZE=4][B]Без окна о блокировке аккаунта тема не подлежит рассмотрению - создайте новую тему, приложив скриншот окна блокировки через любой фото-хостинг.[/B][/SIZE][/FONT]<br><br>' +
		'[SIZE=4][B][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Закрыто.[/FONT][/COLOR][/B][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Нет бага',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		'[FONT=trebuchet ms][SIZE=4][B]Не было замечено бага.[/B][/SIZE][/FONT]<br><br>' +
		'[SIZE=4][B][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Закрыто.[/FONT][/COLOR][/B][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Нет докв',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		'[FONT=trebuchet ms][SIZE=4][B]В жалобе отсутствуют доказательства / либо не рабочая ссылка. Без доказательств (в частности скриншоты или видео) – решить проблему не получится.[/B][/SIZE][/FONT]<br><br>' +
		'[SIZE=4][B][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Закрыто.[/FONT][/COLOR][/B][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'В обжаловании отказано',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		'[FONT=trebuchet ms][SIZE=4][B]В обжаловании отказано.[/B][/SIZE][/FONT]<br><br>' +
		'[SIZE=4][B][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Закрыто.[/FONT][/COLOR][/B][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Не пришел донат',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		'[FONT=trebuchet ms][SIZE=4][B]Система построена таким образом, что деньги не спишутся, пока наша платформа не уведомит платежную систему о зачислении BLACK COINS. Для проверки зачисления необходимо ввести в игре команду: [U]/donat[/U].[/B][/SIZE][/FONT]<br><br>' +
        '[FONT=trebuchet ms][SIZE=4][B]В остальных же случаях, если не были зачислены BLACK COINS — вероятнее всего, была допущена ошибка при вводе реквизитов. Вам необходимо быть внимательными при осуществлении покупок.[/B][/SIZE][/FONT]<br><br>' +
		"[FONT=trebuchet ms][SIZE=4][B]Если Вы считаете, что ошибки быть не может и с момента оплаты не прошло более 14 дней, то обратитесь в данное сообщество для дальнейшего решения - [URL='https://vk.com/br_tech'][U]Тык[/U][/URL][/B].[/SIZE][/FONT]<br><br>" +
        '[SIZE=4][B][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Закрыто.[/FONT][/COLOR][/B][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Правила восстановления имущества',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		"[FONT=trebuchet ms][SIZE=4][B]Внимательно ознакомьтесь с правилами восстановлений по ссылке - [URL='https://forum.blackrussia.online/index.php?threads/В-каких-случаях-мы-не-восстанавливаем-игровое-имущество.25277'][U]Тык[/U][/URL].[/B][/SIZE][/FONT]<br><br>" +
		'[SIZE=4][B][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Отказано.[/FONT][/COLOR][/B][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Обжалованию не подлежит',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		'[FONT=trebuchet ms][SIZE=4][B]Вы получили блокировку за серьезное нарушение правил проекта.[/B][/SIZE][/FONT]<br><br>' +
        '[FONT=trebuchet ms][SIZE=4][B]Мы не в силах снизить срок наказания/обнулить/амнистировать Вас.[/B][/SIZE][/FONT]<br><br>' +
		'[SIZE=4][B][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Отказано.[/FONT][/COLOR][/B][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Срок подачи 7',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		'[FONT=trebuchet ms][SIZE=4][B]С момента выдачи наказания прошло более 7-ми дней.[/B][/SIZE][/FONT]<br><br>' +
        '[FONT=trebuchet ms][SIZE=4][B]Пересмотр блокировки невозможен.[/B][/SIZE][/FONT]<br><br>' +
        '[FONT=trebuchet ms][SIZE=4][B]Вы можете попробовать написать обжалование через N-ый промежуток времени (если наказание вообще подлежит обжалованию).[/B][/SIZE][/FONT]<br><br>' +
		'[SIZE=4][B][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Отказано.[/FONT][/COLOR][/B][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Отвязали акк',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		'[FONT=trebuchet ms][SIZE=4][B]Ваш аккаунт был привязан нарушителем.[/B][/SIZE][/FONT]<br><br>' +
        '[FONT=trebuchet ms][SIZE=4][B]Мы не в силах обжаловать Вас.[/B][/SIZE][/FONT]<br><br>' +
		'[SIZE=4][B][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Отказано.[/FONT][/COLOR][/B][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Дублирование',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		'[FONT=trebuchet ms][SIZE=4][B]Данная тема является дубликатом вашей предыдущей темы.[/B][/SIZE][/FONT]<br><br>' +
        '[FONT=trebuchet ms][SIZE=4][B]Прекратите создавать идентичные или похожие темы - иначе Ваш форумный аккаунт может быть заблокирован.[/B][/SIZE][/FONT]<br><br>' +
		'[SIZE=4][B][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Закрыто.[/FONT][/COLOR][/B][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Ошибка сервером',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		'[FONT=trebuchet ms][SIZE=4][B]Вы ошиблись сервером. Подайте жалобу повторно на нужный Вам сервер.[/B][/SIZE][/FONT]<br><br>' +
		'[SIZE=4][B][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Закрыто.[/FONT][/COLOR][/B][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
	  title: 'ᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠПРОЧЕЕᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠ',
	},
	{
		title: 'Актуально?',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		'[FONT=trebuchet ms][SIZE=4][B]Ваше обращение еще актуально?[/B][/SIZE][/FONT]',
	},
	{
		title: 'Есть привязки?',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		'[FONT=trebuchet ms][SIZE=4][B]Имеются ли у Вас привязки к аккаунту?[/B][/SIZE][/FONT]<br><br>' +
        '[FONT=trebuchet ms][SIZE=4][B]Если да, смените пароль через привязку и прикрепите скриншот в эту тему. Новый пароль необходимо замазать.[/B][/SIZE][/FONT]',
	},
	{
		title: 'Пункт - ППВ',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		'[FONT=trebuchet ms][SIZE=4][B]Вы были наказаны по следующему пункту правил:[/B][/SIZE][/FONT]<br><br>' +
        '[FONT=trebuchet ms][SIZE=4][B]4.03. Запрещена совершенно любая передача игровых аккаунтов третьим лицам | PermBan[/B][/SIZE][/FONT]<br><br>' +
        '[FONT=trebuchet ms][SIZE=4][B]Согласны с выданным наказанием?[/B][/SIZE][/FONT]',
	},
	{
		title: 'Пункт - ППИВ',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		'[FONT=trebuchet ms][SIZE=4][B]Вы были наказаны по следующему пункту правил:[/B][/SIZE][/FONT]<br><br>' +
        '[FONT=trebuchet ms][SIZE=4][B]2.28. Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги | PermBan с обнулением аккаунта + ЧС проекта[/B][/SIZE][/FONT]<br><br>' +
        '[FONT=trebuchet ms][SIZE=4][B]Согласны с выданным наказанием?[/B][/SIZE][/FONT]',
	},
	{
		title: 'Пункт - мультиакк',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		'[FONT=trebuchet ms][SIZE=4][B]Вы были наказаны по следующему пункту правил:[/B][/SIZE][/FONT]<br><br>' +
        '[FONT=trebuchet ms][SIZE=4][B]4.04. Разрешается зарегистрировать максимально только три игровых аккаунта на сервере | PermBan[/B][/SIZE][/FONT]<br><br>' +
        '[FONT=trebuchet ms][SIZE=4][B]Согласны с выданным наказанием?[/B][/SIZE][/FONT]',
	},
	{
		title: 'Пункт - твинк трансфер',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		'[FONT=trebuchet ms][SIZE=4][B]Вы были наказаны по следующему пункту правил:[/B][/SIZE][/FONT]<br><br>' +
        '[FONT=trebuchet ms][SIZE=4][B]4.05. Запрещено передавать любые игровые ценности между игровыми аккаунтами, а также в целях удержания имущества | Ban 15 - 30 дней / PermBan[/B][/SIZE][/FONT]<br><br>' +
        '[FONT=trebuchet ms][SIZE=4][B]Согласны с выданным наказанием?[/B][/SIZE][/FONT]',
	},
	{
		title: 'Пункт - обход системы',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		'[FONT=trebuchet ms][SIZE=4][B]Вы были наказаны по следующему пункту правил:[/B][/SIZE][/FONT]<br><br>' +
        '[FONT=trebuchet ms][SIZE=4][B]2.21. Запрещено пытаться обходить игровую систему или использовать любые баги сервера | Ban 15 - 30 дней /PermBan[/B][/SIZE][/FONT]<br><br>' +
        '[FONT=trebuchet ms][SIZE=4][B]Согласны с выданным наказанием?[/B][/SIZE][/FONT]',
	},
	{
		title: 'Пункт - ПО',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		'[FONT=trebuchet ms][SIZE=4][B]Вы были наказаны по следующему пункту правил:[/B][/SIZE][/FONT]<br><br>' +
        '[FONT=trebuchet ms][SIZE=4][B]2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | Ban 15 - 30 дней / PermBan[/B][/SIZE][/FONT]<br><br>' +
        '[FONT=trebuchet ms][SIZE=4][B]Согласны с выданным наказанием?[/B][/SIZE][/FONT]',
	},
	{
		title: 'Пункт - порча эко',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		'[FONT=trebuchet ms][SIZE=4][B]Вы были наказаны по следующему пункту правил:[/B][/SIZE][/FONT]<br><br>' +
        '[FONT=trebuchet ms][SIZE=4][B]2.30. Запрещено пытаться нанести ущерб экономике сервера | Ban 15 - 30 дней / PermBan[/B][/SIZE][/FONT]<br><br>' +
        '[FONT=trebuchet ms][SIZE=4][B]Согласны с выданным наказанием?[/B][/SIZE][/FONT]',
	},
	{
		title: 'Будет заблокирован (ЖБ игроков)',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		'[FONT=trebuchet ms][SIZE=4][B]После проверки доказательств и системы логирования вердикт: [U]Аккаунт будет заблокирован[/U].[/B][/SIZE][/FONT]<br><br>' +
		'[SIZE=4][B][COLOR=rgb(65, 168, 95)][FONT=trebuchet ms]Решено.[/FONT][/COLOR][/B][/SIZE]',
	},
	{
		title: 'НЕ будет заблокирован (ЖБ игроков)',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		'[FONT=trebuchet ms][SIZE=4][B]После проверки доказательств и системы логирования вердикт: [U]Доказательств недостаточно для выдачи наказания[/U].[/B][/SIZE][/FONT]<br><br>' +
		'[SIZE=4][B][COLOR=rgb(255, 0, 0)][FONT=trebuchet ms]Закрыто.[/FONT][/COLOR][/B][/SIZE]',
	},
	{
		title: 'Продавец ИВ',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		'[FONT=trebuchet ms][SIZE=4][B]Игрок является продавцом игровой валюты, аккаунт был создан для её продажи.[/B][/SIZE][/FONT]<br><br>' +
		'[FONT=trebuchet ms][SIZE=4][B]Ожидайте вердикта [U]Куратора Технических специалистов[/U].[/B][/SIZE][/FONT]',
	},
	{
	  title: 'ᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠПЕРЕДАНОᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠᅠ',
	},
	{
		title: 'Ожидайте Куратора',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		'[FONT=trebuchet ms][SIZE=4][B]Ваша тема закреплена и ожидает вердикта [U]Куратора Технических специалистов[/U].[/B][/SIZE][/FONT]<br><br>' +
        '[FONT=trebuchet ms][SIZE=4][B]Ожидайте ответа в данной теме, копии создавать не нужно.[/B][/SIZE][/FONT]<br><br>' +
		'[SIZE=4][B][COLOR=rgb(255, 152, 0)][FONT=trebuchet ms]На рассмотрении.[/FONT][/COLOR][/B][/SIZE]',
		prefix: PIN_PREFIX,
		status: true,
	},
	{
		title: 'Команде проекта',
		content:
        '[SIZE=4][B][FONT=trebuchet ms]Доброго времени суток уважаемый игрок.[/FONT][/B][/SIZE]<br><br>' +
		'[FONT=trebuchet ms][SIZE=4][B]Ваша тема закреплена и передана [U]Команде проекта[/U].[/B][/SIZE][/FONT]<br><br>' +
        '[FONT=trebuchet ms][SIZE=4][B]Ожидайте ответа в данной теме, копии создавать не нужно.[/B][/SIZE][/FONT]<br><br>' +
		'[SIZE=4][B][COLOR=rgb(255, 152, 0)][FONT=trebuchet ms]На рассмотрении.[/FONT][/COLOR][/B][/SIZE]',
		prefix: COMMAND_PREFIX,
		status: true,
	},
	];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрении', 'pin');
	addButton('Отказано', 'unaccept');
	addButton('Решено', 'decided');
    addButton('|');
	addAnswers();

	// Поиск информации о теме
	const threadData = getThreadData();

	$(`button#ff`).click(() => pasteContent(8, threadData, true));
	$(`button#prr`).click(() => pasteContent(2, threadData, true));
	$(`button#zhb`).click(() => pasteContent(21, threadData, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
	$('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#closed_complaint').click(() => editThreadData(CLOSE_PREFIX, false, false));
	$('button#techspec').click(() => editThreadData(TECHADM_PREFIX, true));

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
	`<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 25px; margin-right: 5px;">${name}</button>`,
	);
	}
	function addAnswers() {
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 15px; border-radius: 25px;">ОТВЕТЫ</button>`,
	);
	}

	function buttonsMarkup(buttons) {
	return `<div class="select_answer">${buttons
	.map(
	(btn, i) =>
	`<button id="answers-${i}" class="button--primary button ` +
	`rippleButton" style="margin:4px"><span class="button-text">${btn.title}</span></button>`,
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
			if(prefix == UNACCEPT_PREFIX || prefix == WATCHED_PREFIX || prefix == CLOSE_PREFIX || prefix == DECIDED_PREFIX) {
				moveThread(prefix, 230); }

			if(prefix == WAIT_PREFIX) {
				moveThread(prefix, 917);
			}
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