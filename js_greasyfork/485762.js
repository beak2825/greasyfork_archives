// ==UserScript==
// @name         BLACK RUSSIA || Скрипт для Руководства Сервера by R.Shtorm.
// @namespace    https://forum.blackrussia.online
// @version      1.2.4
// @description  Специально для BlackRussia || by R.Shtorm.
// @author       Roma Shtorm
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @collaborator QuenkM
// @icon https://emoji.gg/assets/emoji/9372-blurple-boost-level-9.png
// @downloadURL https://update.greasyfork.org/scripts/485762/BLACK%20RUSSIA%20%7C%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%20by%20RShtorm.user.js
// @updateURL https://update.greasyfork.org/scripts/485762/BLACK%20RUSSIA%20%7C%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%20by%20RShtorm.meta.js
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
      title: 'На рассмотрении(remastered)',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба взята на рассмотрение, пожалуйста не создавайте дубликатов. Ожидайте ответа.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]',
      prefix: NARASSMOTRENIIBIO_PREFIX,
	  status: false,
	},
        {
      title: 'У администратора было запрошено опровержение(remastered)',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]У администратора были запрошены доказательства о выданном наказании. Ожидайте ответа[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении[/ICODE][/COLOR][/CENTER][/B]',
      prefix: NARASSMOTRENIIBIO_PREFIX,
	  status: false,
	},
      {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Одобрение жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
   {
      title: 'Будет проведена беседа с админом',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба была одобрена и будет проведена беседа с администратором.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
	  status: true,
    },
    {
      title: 'Будет проведена работа с админом',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба была одобрена и будет проведена работа с администратором по данной жалобе.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
	  status: true,
    },
     {
      title: 'Будет снят',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба была одобрена и администратор будет снят с поста.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
	  status: true,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказ жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Отстутсвуют доказательства о нарушении администратора',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]В вашей жалобе отсутствуют доказательства о нарушении администратора.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
      prefix: CLOSE_PREFIX,
	  status: true,
    },
    {
      title: 'Проверив опровержение администратора наказание было выдано верно ',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Администратор, выдавший наказание предоставил опровержение на ваше нарушение. Наказание выданное вам, было выдано верно.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
	  status: true,
    },
        {
      title: 'Жалоба от 3-его лица',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]3.3. Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации).[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
      prefix: CLOSE_PREFIX,
	  status: true,
    },
            {
      title: 'Доказательства предоставлены не в первоначальном виде',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]3.7. Доказательства должны быть в первоначальном виде.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
      prefix: CLOSE_PREFIX,
	  status: true,
    },
    {
      title: 'Форма темы',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба составлена не по форме. С формой создания темы можно ознакомиться тут:[SIZE=4]<br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender] 1. Ваш Nick_Name [SIZE=4]<br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender] 2.Nick_Name администратора<br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender] 3.Дата выдачи/получения наказания:<br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender] 4.Суть жалобы:[SIZE=4]<br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender] 5.Доказательство: <br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
	  status: true,
    },
        {
      title: '48 часов написания жалобы',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]3.1. Срок написания жалобы составляет два дня (48 часов) с момента совершенного нарушения со стороны администратора сервера.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
	  status: true,
    },
        {
      title: 'Нету /time',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]В вашей жалобе отсутствует /time.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
	  status: true,
    },
            {
      title: 'Нету док-в.',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]В вашей жалобе отсутсвуют доказательства о нарушении администратора[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
	  status: true,
    },
     {
      title: 'Признался в нарушении',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Вы сами признались в своём нарушении.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
	  status: true,
    },
     {
      title: 'Смените IP',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Смените IP adress.[SIZE=4] <br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
      prefix: CLOSE_PREFIX,
	  status: true,
    },
     {
      title: 'Вам в обжалования',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Вам в раздел для обжалования наказаний.[SIZE=4] <br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
      prefix: CLOSE_PREFIX,
	  status: true,
    },
     {
      title: 'Подобная жалоба(ответ не был дан)',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Дублирование темы, ожидайте ответа в подобной жалобе. [SIZE=4]<br>"+
        "[B][CENTER][COLOR=lavender] В случае продолжения дублирования тем, ваш форумный аккаунт будет заблокирован на 3 и более дней. <br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
      prefix: CLOSE_PREFIX,
	  status: true,
    },
         {
      title: 'Подобная жалоба (ответ был дан)',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Дублирование темы,  ответ был дан в подобной жалобе. <br>"+
        "[B][CENTER][COLOR=lavender] В случае продолжения дублирования тем, ваш форумный аккаунт будет заблокирован на 3 и более дней.[SIZE=4] <br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
      prefix: CLOSE_PREFIX,
	  status: true,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Обжалования ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'В обжаловании отказано',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]В обжаловании отказано. [SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
	  status: true,
    },
    {
      title: 'Обжалованию не подлежит',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender] Данный тип нарушения обжалованию не подлежит. [SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
	  status: true,
    },
    {
      title: ' Ответ бы дан ранее',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Дублирование темы,  ответ был дан в прошлой теме. <br>"+
        "[B][CENTER][COLOR=lavender] В случае продолжения дублирования тем, ваш форумный аккаунт будет заблокирован на 3 и более дней.[SIZE=4] <br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
      prefix: CLOSE_PREFIX,
	  status: true,
    },
    {
      title: 'Прошло меньше 48ч',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Со времени выданного наказания не прошло 48 часов для обжалования. [SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
	  status: true,
    },
    {
      title: 'Не по форме',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender] Ваша обжалование составлено не по форме, с формой подачи можно ознакомиться тут: [SIZE=4]<br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender] 1. Ваш Nick_Name [SIZE=4]<br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender] 2.Nick_Name администратора<br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender] 3.Дата выдачи/получения наказания:<br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender] 4.Суть заявки:[SIZE=4]<br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender] 5.Доказательство: <br>"+
        "[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
	  status: true,
    },
     {
      title: 'Не рабочие доква/нет докв',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Отсутствуют доказательства - следовательно, рассмотрению не подлежит. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее. [SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
	  status: true,
    },
    {
      title: 'бан ip',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Попробуйте перезагрузить роутер или телефон.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
	  status: true,
    },
    {
      title: 'Наказание будет смягчено',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваше наказание будет смягчено, впредь не совершайте подобных ошибок. <br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
      prefix: CLOSE_PREFIX,
	  status: true,
    },
    {
      title: 'Обжаловать nRp obman "одобрено" ',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваше обжалование одобрено, аккаунт остается разблокирован. [SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено.[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
	  status: true,
    },
     {
      title: 'Передать ГА',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=red][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>'+
		'[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваше обжалование было передано Главному администратору сервера. Ожидайте ответа.[SIZE=4]<br>'+
		'[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>',
	    prefix: GA_PREFIX,
        status: true,
    },
    {
      title: 'Возврат имущества разбан на 24 часа',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Аккаунт будет разблокирован на 24 часа, в течении этого времени, вы должны вернуть имущество игроку по договоренности. [SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]',
      prefix: PINN_PREFIX,
	  status: false,
    },
    {
      title: 'Обжалование на рассмотрении',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваше обжалование взято на рассмотрение, ожидайте ответа.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]',
      prefix: PINN_PREFIX,
	  status: false,
    },
    {
      title: 'Смена Ника',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваш аккаунт будет разблокирован на 24 часа для смены NickName.[SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]',
      prefix: PINN_PREFIX,
	  status: false,
    },
    {
      title: 'Обжалован',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваше обжалование одобрено, наказание будет снято. [SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=green][ICODE]Одобрено.[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCСEPT_PREFIX,
	  status: true,
    },
    {
      title: 'В жалобы на адм',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Если вы не согласны с выданным наказанием, то вам в раздел Жалобы на администрацию. [SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано, закрыто.[/ICODE][/COLOR][/CENTER][/B]',
      prefix: UNACCСEPT_PREFIX,
	  status: true,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Передачи жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Вам в жалобы на тех.спецов',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Вам в жалобы на технических специалистов.[SIZE=3] <br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
      prefix: CLOSE_PREFIX,
	  status: true,
    },
        {
      title: 'Вам в жалобы на игроков',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=yellow][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Вам в жалобы на игроков.[SIZE=4] <br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
      prefix: CLOSE_PREFIX,
	  status: true,
    },
    {
      title: 'Техническому специалисту',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=orange][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>'+
		'[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба была передана Техническому Специалисту сервера. Ожидайте ответа.[SIZE=4]<br>'+
		'[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>',
      prefix: TEXY_PREFIX,
	  status: true,
    },
    {
      title: 'Передано ГА',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=red][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>'+
		'[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба была передана Главному администратору сервера. Ожидайте ответа.[SIZE=4]<br>'+
		'[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>',
	    prefix: GA_PREFIX,
        status: true,
    },
    {
      title: 'Передано ЗГА',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=red][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>'+
		'[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба была передана Заместителю Главного Администратора. Ожидайте ответа.[SIZE=4]<br>'+
		'[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>',
	    prefix: NARASSMOTRENIIBIO_PREFIX,
        status: false,
    },
    {
      title: 'Передано Специальному администратору',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=red][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>'+
		'[B][CENTER][FONT=times new roman][SIZE=4][COLOR=lavender]Ваша жалоба была передана Специальному администратору сервера. Ожидайте ответа.[SIZE=4]<br>'+
		'[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>',
      prefix: SPECY_PREFIX,
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