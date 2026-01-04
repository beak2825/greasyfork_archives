// ==UserScript==
// @name         BLACK RUSSIA || Скрипт для Руководства Сервера
// @namespace    https://forum.blackrussia.online
// @version      1.4.1
// @description  Специально для BlackRussia
// @author       djust
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @collaborator QuenkM
// @icon data:image/jpeg;base64,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
// @downloadURL https://update.greasyfork.org/scripts/472732/BLACK%20RUSSIA%20%7C%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/472732/BLACK%20RUSSIA%20%7C%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0.meta.js
// ==/UserScript==
 
(function () {
  'use strict';
const UNACCСEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCСEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PINN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEXY_PREFIX = 13;
const OJIDANIE_PREFIX = 14;
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const REALIZOVANO_PREFIX = 5;
const VAJNO_PREFIX = 1;
const PREFIKS = 0;
const KACHESTVO = 15;
const RASSMOTRENO_PREFIX = 9;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const OTKAZORG_PREFIX = 4;
const ODOBRENOORG_PREFIX = 8;
const NARASSMOTRENIIORG_PREFIX = 2;
const buttons = [
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Рассмотрение жалоб ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'На рассмотрение(remastered)',
      content:
		"[B][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(184, 49, 47)]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3]Ваша жалоба взята на рассмотрение, пожалуйста не создавайте дубликатов.<br> Ожидайте ответа.[/SIZE][/FONT][/B]<br><br>"+
		'[B][CENTER][SIZE=3][FONT=georgia][COLOR=rgb(255, 173, 51)][ICODE]На рассмотрении[/ICODE][/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>',
      prefix: NARASSMOTRENIIBIO_PREFIX,
	  status: false,
	},
        {
      title: 'У администратора было запрошено опровержение(remastered)',
      content:
		"[B][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(184, 49, 47)]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=georgia][SIZE=3]У администратора были запрошены доказательства о выданном наказании.<br> Ожидайте ответа.[/SIZE][/FONT][/B]<br><br>"+
		'[B][CENTER][SIZE=3][FONT=georgia][COLOR=rgb(255, 173, 51)][ICODE]На рассмотрении[/ICODE][/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>',
      prefix: NARASSMOTRENIIBIO_PREFIX,
	  status: false,
	},
      {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Одобрение жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
   {
      title: 'Будет проведена беседа с админом',
      content:
		"[B][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(184, 49, 47)]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
		"[CENTER][B][SIZE=3][FONT=georgia]Ваша жалоба была одобрена, с администратором будет проведена беседа.[/SIZE][/FONT][/B]<br><br>"+
		'[B][CENTER][SIZE=3][FONT=georgia][COLOR=rgb(97, 189, 109)][ICODE]Одобрено[/ICODE][/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>',
      prefix: ACCСEPT_PREFIX,
	  status: true,
    },
    {
      title: 'Наказание',
      content:
		"[B][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(184, 49, 47)]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
		"[CENTER][B][SIZE=3][FONT=georgia]Ваша жалоба была одобрена, с администратором будет проведена беседа.<br>Также ваше наказание будет снято.[/SIZE][/FONT][/B]<br><br>"+
		'[B][CENTER][SIZE=3][FONT=georgia][COLOR=rgb(97, 189, 109)][ICODE]Одобрено[/ICODE][/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>',
      prefix: ACCСEPT_PREFIX,
	  status: true,
    },
    {
      title: 'Будет проведена работа с админом',
      content:
		"[B][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(184, 49, 47)]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
		"[CENTER][B][SIZE=3][FONT=georgia]Ваша жалоба была одобрена, с администратором будет проведена работа.[/SIZE][/FONT][/B]<br><br>"+
		'[B][CENTER][SIZE=3][FONT=georgia][COLOR=rgb(97, 189, 109)][ICODE]Одобрено[/ICODE][/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>',
      prefix: ACCСEPT_PREFIX,
	  status: true,
    },
     {
      title: 'Будет снят',
      content:
		"[B][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(184, 49, 47)]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
		"[CENTER][B][SIZE=3][FONT=georgia]Администратор будет снят с поста.[/SIZE][/FONT][/B]<br><br>"+
		'[B][CENTER][SIZE=3][FONT=georgia][COLOR=rgb(97, 189, 109)][ICODE]Одобрено[/ICODE][/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>',
      prefix: ACCСEPT_PREFIX,
	  status: true,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказ жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Отстутсвуют доказательства о нарушении администратора',
      content:
		"[B][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(184, 49, 47)]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
		"[CENTER][B][FONT=georgia][SIZE=3]В вашей жалобе отсутствуют доказательства о нарушении администратора.[/SIZE][/FONT][/B]<br><br>"+
		'[B][CENTER][SIZE=3][COLOR=rgb(184, 49, 47)][FONT=georgia][ICODE]Закрыто[/ICODE][/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>',
      prefix: CLOSE_PREFIX,
	  status: true,
    },
    {
      title: 'другой сервер',
      content:
		"[B][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(184, 49, 47)]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
		"[CENTER][B][FONT=georgia][SIZE=3]Обратитесь в раздел вашего сервера.[/SIZE][/FONT][/B]<br><br>"+
		'[B][CENTER][SIZE=3][COLOR=rgb(184, 49, 47)][FONT=georgia][ICODE]Закрыто[/ICODE][/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>',
      prefix: CLOSE_PREFIX,
	  status: true,
    },
    {
      title: 'скрин при входе',
      content:
		"[B][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(184, 49, 47)]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
		"[CENTER][B][FONT=georgia][SIZE=3]Прикрепите скриншот окна бана при входе в игру.[/SIZE][/FONT][/B]<br><br>"+
		'[B][CENTER][SIZE=3][COLOR=rgb(184, 49, 47)][FONT=georgia][ICODE]Закрыто[/ICODE][/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>',
      prefix: CLOSE_PREFIX,
	  status: true,
    },
    {
      title: 'нет доступа',
      content:
		"[B][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(184, 49, 47)]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
		"[CENTER][B][FONT=georgia][SIZE=3]Доказательства с ограниченным доступом.<br>Перенастройте доступ и создайте новую жалобу.[/SIZE][/FONT][/B]<br><br>"+
		'[B][CENTER][SIZE=3][COLOR=rgb(184, 49, 47)][FONT=georgia][ICODE]Закрыто[/ICODE][/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>',
      prefix: CLOSE_PREFIX,
	  status: true,
    },
    {
      title: 'Проверив опровержение администратора наказание было выдано верно ',
      content:
		"[B][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(184, 49, 47)]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
		"[CENTER][B][FONT=georgia][SIZE=3]Администратор, выдавший наказание предоставил опровержение на ваше нарушение.<br> Наказание выдано верно.[/SIZE][/FONT][/B]<br><br>"+
		'[B][CENTER][SIZE=3][COLOR=rgb(184, 49, 47)][FONT=georgia][ICODE]Отказано[/ICODE][/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>',
      prefix: UNACCСEPT_PREFIX,
	  status: true,
    },
     {
      title: 'Выдано верно',
      content:
		"[B][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(184, 49, 47)]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
		"[CENTER][B][FONT=georgia][SIZE=3]Наказание выдано верно.[/SIZE][/FONT][/B]<br><br>"+
		'[B][CENTER][SIZE=3][COLOR=rgb(184, 49, 47)][FONT=georgia][ICODE]Отказано[/ICODE][/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>',
      prefix: UNACCСEPT_PREFIX,
	  status: true,
    },
        {
      title: 'нарушений нет',
      content:
		"[B][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(184, 49, 47)]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
		"[CENTER][B][FONT=georgia][SIZE=3]Со стороны администратора не обнаружено каких-либо нарушений.[/SIZE][/FONT][/B]<br><br>"+
		'[B][CENTER][SIZE=3][COLOR=rgb(184, 49, 47)][FONT=georgia][ICODE]Отказано[/ICODE][/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>',
      prefix: UNACCСEPT_PREFIX,
	  status: true,
    },
        {
      title: 'Жалоба от 3-его лица',
      content:
		"[B][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(184, 49, 47)]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
		"[CENTER][B][FONT=georgia][SIZE=3]3.3. Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации)[/SIZE][/FONT][/B]<br><br>"+
		'[B][CENTER][SIZE=3][COLOR=rgb(184, 49, 47)][FONT=georgia][ICODE]Отказано[/ICODE][/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>',
      prefix: UNACCСEPT_PREFIX,
	  status: true,
    },
            {
      title: 'Доказательства предоставлены не в первоначальном виде',
      content:
		"[B][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(184, 49, 47)]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
		"[CENTER][B][FONT=georgia][SIZE=3]3.7. Доказательства должны быть в первоначальном виде.[/SIZE][/FONT][/B]<br><br>"+
		'[B][CENTER][SIZE=3][COLOR=rgb(184, 49, 47)][FONT=georgia][ICODE]Отказано[/ICODE][/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>',
      prefix: UNACCСEPT_PREFIX,
	  status: true,
    },
    {
      title: 'Форма темы',
      content:
		"[B][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(184, 49, 47)]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
		"[CENTER][B][FONT=georgia][SIZE=3]Ваша жалоба составлена не по форме.[/SIZE][/FONT][/B]<br><br>"+
		'[B][CENTER][SIZE=3][COLOR=rgb(184, 49, 47)][FONT=georgia][ICODE]Отказано[/ICODE][/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>',
      prefix: UNACCСEPT_PREFIX,
	  status: true,
    },
        {
      title: '48 часов написания жалобы',
      content:
		"[B][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(184, 49, 47)]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
		"[CENTER][B][FONT=georgia][SIZE=3]3.1. Срок написания жалобы составляет два дня (48 часов) с момента совершенного нарушения со стороны администратора сервера.[/SIZE][/FONT][/B]<br><br>"+
		'[B][CENTER][SIZE=3][COLOR=rgb(184, 49, 47)][FONT=georgia][ICODE]Отказано[/ICODE][/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>',
      prefix: UNACCСEPT_PREFIX,
	  status: true,
    },
        {
      title: 'Нету /time',
      content:
		"[B][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(184, 49, 47)]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
		"[CENTER][B][FONT=georgia][SIZE=3]В вашей жалобе отсутствует /time.[/SIZE][/FONT][/B]<br><br>"+
		'[B][CENTER][SIZE=3][COLOR=rgb(184, 49, 47)][FONT=georgia][ICODE]Отказано[/ICODE][/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>',
      prefix: UNACCСEPT_PREFIX,
	  status: true,
    },
            {
      title: 'Нету док-в.',
      content:
		"[B][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(184, 49, 47)]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
		"[CENTER][B][FONT=georgia][SIZE=3]В вашей жалобе отсутствуют доказательства о нарушении администратора.[/SIZE][/FONT][/B]<br><br>"+
		'[B][CENTER][SIZE=3][COLOR=rgb(184, 49, 47)][FONT=georgia][ICODE]Отказано[/ICODE][/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>',
      prefix: UNACCСEPT_PREFIX,
	  status: true,
    },
     {
      title: 'Признался в нарушении',
      content:
		"[B][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(184, 49, 47)]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
		"[CENTER][B][FONT=georgia][SIZE=3]Вы сами признались в своём нарушении.[/SIZE][/FONT][/B]<br><br>"+
		'[B][CENTER][SIZE=3][COLOR=rgb(184, 49, 47)][FONT=georgia][ICODE]Отказано[/ICODE][/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>',
      prefix: UNACCСEPT_PREFIX,
	  status: true,
    },
     {
      title: 'Смените IP',
      content:
		"[B][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(184, 49, 47)]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
		"[CENTER][B][FONT=georgia][SIZE=3]Смените IP adress.[/SIZE][/FONT][/B]<br><br>"+
		'[B][CENTER][SIZE=3][COLOR=rgb(184, 49, 47)][FONT=georgia][ICODE]Закрыто[/ICODE][/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>',
      prefix: CLOSE_PREFIX,
	  status: true,
    },
     {
      title: 'Вам в обжалования',
      content:
		"[B][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(184, 49, 47)]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
		"[CENTER][B][FONT=georgia][SIZE=3]Обратитесь в раздел для обжалования наказаний.[/SIZE][/FONT][/B]<br><br>"+
		'[B][CENTER][SIZE=3][COLOR=rgb(184, 49, 47)][FONT=georgia][ICODE]Закрыто[/ICODE][/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>',
      prefix: CLOSE_PREFIX,
	  status: true,
    },
     {
      title: 'Подобная жалоба(ответ не был дан)',
      content:
		"[B][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(184, 49, 47)]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
		"[CENTER][B][FONT=georgia][SIZE=3]Дублирование темы, ожидайте ответа в подобной жалобе.[/SIZE][/FONT][/B]<br><br>"+
		'[B][CENTER][SIZE=3][COLOR=rgb(184, 49, 47)][FONT=georgia][ICODE]Закрыто[/ICODE][/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>',
      prefix: CLOSE_PREFIX,
	  status: true,
    },
    {
      title: 'Наказание будет снято',
      content:
		"[B][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(184, 49, 47)]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
		"[CENTER][B][FONT=georgia][SIZE=3]Ваше наказание будет снято.[/SIZE][/FONT][/B]<br><br>"+
		'[B][CENTER][SIZE=3][COLOR=rgb(184, 49, 47)][FONT=georgia][ICODE]Закрыто[/ICODE][/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>',
      prefix: CLOSE_PREFIX,
	  status: true,
    },
    {
      title: 'Подобная жалоба (ответ был дан)',
      content:
		"[B][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(184, 49, 47)]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
		"[CENTER][B][FONT=georgia][SIZE=3]Ответ был дан в прошлой жалобе.[/SIZE][/FONT][/B]<br><br>"+
		'[B][CENTER][SIZE=3][COLOR=rgb(184, 49, 47)][FONT=georgia][ICODE]Закрыто[/ICODE][/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>',
      prefix: CLOSE_PREFIX,
	  status: true,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Передачи жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Вам в жалобы на тех.спецов',
      content:
		"[B][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(184, 49, 47)]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
		"[CENTER][B][FONT=georgia][SIZE=3]Обратитесь в раздел жалоб на технических специалистов.[/SIZE][/FONT][/B]<br><br>"+
		'[B][CENTER][SIZE=3][COLOR=rgb(184, 49, 47)][FONT=georgia][ICODE]Закрыто[/ICODE][/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>',
      prefix: CLOSE_PREFIX,
	  status: true,
    },
        {
      title: 'Вам в жалобы на игроков',
      content:
		"[B][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(184, 49, 47)]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
		"[CENTER][B][FONT=georgia][SIZE=3]Обратитесь в раздел жалоб на игроков.[/SIZE][/FONT][/B]<br><br>"+
		'[B][CENTER][SIZE=3][COLOR=rgb(184, 49, 47)][FONT=georgia][ICODE]Закрыто[/ICODE][/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>',
      prefix: CLOSE_PREFIX,
	  status: true,
    },
    {
      title: 'Техническому специалисту',
      content:
		"[B][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(184, 49, 47)]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
		"[CENTER][B][FONT=georgia][SIZE=3]Ваша жалоба была передана Техническому специалисту.<br> Ожидайте ответа.[/SIZE][/FONT][/B]<br><br>"+
		'[B][CENTER][SIZE=3][COLOR=rgb(44, 130, 201)][FONT=georgia][ICODE]Передано тех. специалисту[/ICODE][/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>',
      prefix: TEXY_PREFIX,
	  status: true,
    },
    {
      title: 'Передано ГА',
      content:
		"[B][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(184, 49, 47)]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
		"[CENTER][B][FONT=georgia][SIZE=3]Ваша жалоба была передана Главному администратору сервера.<br> Ожидайте ответа.[/SIZE][/FONT][/B]<br><br>"+
		'[B][CENTER][SIZE=3][COLOR=rgb(184, 49, 47)][FONT=georgia][ICODE]Передано ГА[/ICODE][/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>',
	    prefix: GA_PREFIX,
        status: true,
    },
    {
      title: 'Передано ЗГА',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=red][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>'+
		'[B][CENTER][COLOR=lavender]Ваша жалоба была передана Заместителю Главного Администратора. Ожидайте ответа.<br>'+
		'[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>',
	    prefix: NARASSMOTRENIIBIO_PREFIX,
        status: false,
    },
    {
      title: 'Передано Специальному администратору',
      content:
		"[B][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(184, 49, 47)]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
		"[CENTER][B][FONT=georgia][SIZE=3]Ваша жалоба была передана Спец. Администрации.<br> Ожидайте ответа.[/SIZE][/FONT][/B]<br><br>"+
		'[B][CENTER][SIZE=3][COLOR=rgb(184, 49, 47)][FONT=georgia][ICODE]Передано СА[/ICODE][/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>',
      prefix: SPECY_PREFIX,
	  status: true,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Рассмотрение обжалований ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Отказ обж',
      content:
		"[B][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(184, 49, 47)]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
		"[CENTER][B][FONT=georgia][SIZE=3]В обжаловании отказано.[/SIZE][/FONT][/B]<br><br>"+
		'[B][CENTER][SIZE=3][COLOR=rgb(184, 49, 47)][FONT=georgia][ICODE]Закрыто[/ICODE][/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>',
      prefix: CLOSE_PREFIX,
	  status: true,
    },
    {
      title: 'Передано ГА',
      content:
		"[B][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(184, 49, 47)]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
		"[CENTER][B][FONT=georgia][SIZE=3]Ваше обжалование передано Главному администратору сервера.[/SIZE][/FONT][/B]<br><br>"+
		'[B][CENTER][SIZE=3][COLOR=rgb(184, 49, 47)][FONT=georgia][ICODE]Передано ГА[/ICODE][/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'Обжалованию не подлежит',
      content:
		"[B][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(184, 49, 47)]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
		"[CENTER][B][FONT=georgia][SIZE=3]Обжалованию не подлежит.[/SIZE][/FONT][/B]<br><br>"+
		'[B][CENTER][SIZE=3][COLOR=rgb(184, 49, 47)][FONT=georgia][ICODE]Закрыто[/ICODE][/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>',
      prefix: CLOSE_PREFIX,
	  status: true,
    },
    {
      title: 'одобрено',
      content:
		"[B][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(184, 49, 47)]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
		"[CENTER][B][FONT=georgia][SIZE=3]После рассмотрения темы было принято решение о снятии / сокращении наказания.[/SIZE][/FONT][/B]<br><br>"+
		'[B][CENTER][SIZE=3][FONT=georgia][COLOR=rgb(97, 189, 109)][ICODE]Одобрено[/ICODE][/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>',
      prefix: ACCСEPT_PREFIX,
	  status: true,
    },
   {
      title: 'Форма темы',
      content:
		"[B][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(184, 49, 47)]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
		"[CENTER][B][FONT=georgia][SIZE=3]Ваше обжалование составлена не по форме.[/SIZE][/FONT][/B]<br><br>"+
		'[B][CENTER][SIZE=3][COLOR=rgb(184, 49, 47)][FONT=georgia][ICODE]Закрыто[/ICODE][/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>',
      prefix: CLOSE_PREFIX,
	  status: true,
    },
   {
      title: 'Не согласен',
      content:
		"[B][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(184, 49, 47)]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
		"[CENTER][B][FONT=georgia][SIZE=3]Если Вы не согласны с выданным наказанием, то обратитесь в раздел 'Жалобы на администрацию'[/SIZE][/FONT][/B]<br><br>"+
		'[B][CENTER][SIZE=3][COLOR=rgb(184, 49, 47)][FONT=georgia][ICODE]Закрыто[/ICODE][/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>',
      prefix: CLOSE_PREFIX,
	  status: true,
    },
   {
      title: 'В тех раздел',
      content:
		"[B][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(184, 49, 47)]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
		"[CENTER][B][FONT=georgia][SIZE=3]Обратитесь в технический раздел.[/SIZE][/FONT][/B]<br><br>"+
		'[B][CENTER][SIZE=3][COLOR=rgb(184, 49, 47)][FONT=georgia][ICODE]Закрыто[/ICODE][/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>',
      prefix: CLOSE_PREFIX,
	  status: true,
    },
   {
      title: 'nonrp обман',
      content:
		"[B][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(184, 49, 47)]Доброго времени суток, уважаемый игрок.[/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>"+
		"[CENTER][B][FONT=georgia][SIZE=3]Для обжалования такого наказания необходимо связаться с обманутой стороной<br>и обговорить условия возврата полной суммы причиненного ущерба, либо непосредственно самого имущества.[/SIZE][/FONT][/B]<br><br>"+
		'[B][CENTER][SIZE=3][COLOR=rgb(184, 49, 47)][FONT=georgia][ICODE]Закрыто[/ICODE][/COLOR][/FONT][/SIZE][/CENTER][/B]<br><br>',
      prefix: CLOSE_PREFIX,
	  status: true,
    },
  ];
 
  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение', 'pin');
    addButton('Важно', 'Vajno');
    addButton('Команде Проекта', 'teamProject');
    addButton('ГА', 'Ga');
    addButton('Спецу', 'Spec');
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('Теху', 'Texy');
    addButton('Решено', 'Resheno');
    addButton('Закрыто', 'Zakrito');
    addButton('Реализовано', 'Realizovano');
    addButton('Рассмотрено', 'Rassmotreno');
    addButton('Ожидание', 'Ojidanie');
    addButton('Без префикса', 'Prefiks');
    addButton('Проверено контролем качества', 'Kachestvo');
    addButton('Ответы', 'selectAnswer');
 
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
    $('button#Prefiks').click(() => editThreadData(PREFIKS, false));
    $('button#Kachestvo').click(() => editThreadData(KACHESTVO, false));
 
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
			pin: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
 
 
 
 
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
			pin: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
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
}
})();