// ==UserScript==
// @name         Скрипт для Форума
// @namespace    https://forum.blackrussia.online
// @version      1.789
// @description  Скрипт для ГА/ЗГА by Graanovskiy
// @author       Never Graanovskiy
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license    MIT
// @icon https://forum.blackrussia.online/data/avatars/o/11/11193.jpg
// @downloadURL https://update.greasyfork.org/scripts/478223/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/478223/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACСEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PINN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEXY_PREFIX = 13;
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const OTKAZORG_PREFIX = 4;
const ODOBRENOORG_PREFIX = 8;
const NARASSMOTRENIIORG_PREFIX = 2;
const buttons = [
     {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴•Жалоба на администрацию•╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Передана СА',
      content:
		'[CENTER][Color=#FF0000][FONT=times new roman][I]Здравствуйте![/CENTER][/Color]' +
        '<br>[CENTER]Передаю вашу жалобу [color=#FFFF00]Специальному Администратору.[/color]<br>' +
        '<br>Ожидайте, пожалуйста, ответа. Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт будет заблокирован.[/CENTER]<br>' +
        '<br>[CENTER][color=#FFFF00]На рассмотрении.[/color][/CENTER][/FONT]',
      prefix: SPECY_PREFIX,
	  status: false,
    },
    {
     title: 'Передана ГА',
      content:
		'[CENTER][Color=#FF0000][FONT=times new roman][I]Здравствуйте![/CENTER][/Color]' +
        "<br>[CENTER]Передаю вашу жалобу [color=#FF0000]Главному Администратору.[/color]<br>" +
        '<br>Ожидайте, пожалуйста, ответа. Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт будет заблокирован.[/CENTER]<br>' +
        '<br>[CENTER][color=#FFFF00]На рассмотрении.[/color][/CENTER][/FONT]',
      prefix: GA_PREFIX,
	  status: false,
},
    {
        title: 'На рассмотрение',
      content:
		'[CENTER][Color=#FF0000][FONT=times new roman][I]Доброго времени суток, уважаемый игрок![/CENTER][/Color]' +
        "<br>[CENTER]Ваша жалоба взята на [color=#FFFF00]рассмотрение.[/color] Пожалуйста, ожидайте ответа.[/CENTER]<br>" +
        '<br>[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт будет заблокирован.[/CENTER][/FONT]',
      prefix: NARASSMOTRENIIORG_PREFIX,
	  status: true,
    },
    {
      title: 'ЖБ на рассмотр',
      content:
		'[CENTER][Color=#FF0000][FONT=times new roman][I]Здравствуйте, уважаемый игрок![/CENTER][/Color]' +
        "<br>[CENTER]Ваша жалоба уже стоит на [color=#FFFF00]рассмотрении.[/color][/CENTER]<br>" +
        '<br>[CENTER]Не создавайте дубликаты данной темы. Иначе ваш форумный аккаунт будет заблокирован.[/CENTER][/FONT]',
      prefix: NARASSMOTRENIIORG_PREFIX,
	  status: true,
    },
    {
      title: 'Одобрено ЖБ на адм',
      content:
		'[CENTER][Color=#FF0000][FONT=times new roman][I]Здравствуйте![/CENTER][/Color]' +
        "<br>[CENTER]С администратором будет проведена беседа/выдано наказание. А также ваше наказание будет снято.<br>" +
        '<br>Извиняемся за предоставленные неудобства. Приятной игры и времяпровождения![/CENTER]<br>' +
        '<br>[CENTER][color=#FF0000]Закрыто.[/color][/CENTER][/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Отказ ЖБ на адм',
      content:
		'[CENTER][Color=#FF0000][FONT=times new roman][I]Приветствую![/CENTER][/Color]' +
        "<br>[CENTER]Нарушений со стороны Администратора нет. Наказание выдано верно. <br>" +
        '<br>Приятной игры на сервере TYUMEN![/CENTER]<br>' +
        '<br>[CENTER][color=#FF0000]Закрыто.[/color][/CENTER][/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'Адм +выг',
      content:
		'[CENTER][Color=#FF0000][FONT=times new roman][I]Доброго времени суток![/CENTER][/Color]' +
        "<br>[CENTER]Администратор получил выговор. Извиняемся за предоставленные неудобства. <br>" +
        '<br>[CENTER][color=#00FF00]Одобрено.[/color][/CENTER][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
        },
        {
      title: 'Снят адм',
      content:
		'[CENTER][Color=#FF0000][FONT=times new roman][I]Доброго времени суток![/CENTER][/Color]' +
        "<br>[CENTER]Данный администратор был снят со своего поста. <br>" +
        '<br>Приятной игры на TYUMEN![/CENTER]<br>' +
        '<br>[CENTER][color=#00FF00]Решено.[/color][/CENTER][/FONT]',
      prefix: RESHENO_PREFIX,
	  status: false,
    },
        {
      title: 'Завуал.оск/упом род',
      content:
		'[CENTER][Color=#FF0000][FONT=times new roman][I]Здравствуйте![/CENTER][/Color]' +
        "<br>[CENTER]Проверив систему логирования, могу сказать вам, что это завуалированное оскорбление/упоминание родных, не нужно обладать особыми способностями, чтобы понять, кого и как Вы хотели унизить/оскорбить. <br>" +
        '<br>Со стороны Администратора нарушений не найдено.[/CENTER]<br>' +
        '<br>[CENTER][color=#FF0000]Закрыто.[/color][/CENTER][/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
        {
      title: 'Меры',
      content:
		'[CENTER][Color=#FF0000][FONT=times new roman][I]Доброго времени суток, уважаемый игрок![/CENTER][/Color]' +
        "<br>[CENTER]Будут приняты необходимые меры. Благодарю за обращение![/CENTER]<br>" +
        '<br>[CENTER][color=#00FF00]Одобрено.[/color][/CENTER][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
        },
        {
      title: 'Не по форме',
      content:
		'[CENTER][Color=#FF0000][FONT=times new roman][I]Здравствуйте![/CENTER][/Color]' +
        "<br>[CENTER]Ваша жалоба составлена не по форме. Напишите свою жалобу по форме ниже:<br>" +
        '<br> 1. Ваш Nick_Name:<br>'  +
        '<br> 2. Nick_Name администратора:<br>' +
        '<br> 3. Дата выдачи/получения наказания:<br>' +
        '<br> 4. Суть жалобы:<br>' +
        '<br> 5. Доказательство:<br>' +
        '<br>[CENTER][color=#FF0000]Отказано.[/color][/CENTER][/FONT]',
      prefix: UNACСEPT_PREFIX,
	  status: false,
    },
    {
            title: 'Прошел срок',
      content:
		'[CENTER][Color=#FF0000][FONT=times new roman][I]Приветствую![/CENTER][/Color]' +
        "<br>[CENTER]3.1. Срок написания жалобы составляет двое суток (48 часов) с момента совершенного нарушения со стороны администратора сервера. <br>" +
        '<br>Примечание: в случае истечения срока жалоба рассмотрению не подлежит.<br>' +
        '<br>[CENTER][color=#FF0000]Отказано.[/color][/CENTER][/FONT]',
      prefix: UNACСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Доква в соц. сети',
      content:
		'[CENTER][Color=#FF0000][FONT=times new roman][I]Доброго времени суток, уважаемый игрок![/CENTER][/Color]<br>' +
        '<br>[CENTER]3.6. Прикрепление доказательств обязательно.<br>' +
        'Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).<br>' +
        'Примечание: в случае истечения срока жалоба рассмотрению не подлежит.<br>' +
        '<br>[CENTER][color=#FF0000]Отказано.[/color][/CENTER][/FONT]',
      prefix: UNACСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Отсут-т док-ва',
      content:
		'[CENTER][Color=#FF0000][FONT=times new roman][I]Здравствуйте![/CENTER][/Color]' +
        "<br>[CENTER]У вас отсутствуют доказательства. <br>" +
        '<br>[CENTER][color=#FF0000]Отказано.[/color][/CENTER][/FONT]',
      prefix: UNACСEPT_PREFIX,
	  status: false,

    },
    {
      title: 'Не по теме',
      content:
		'[CENTER][Color=#FF0000][FONT=times new roman][I]Приветствую![/CENTER][/Color]' +
        "<br>[CENTER]Ваше обращение не по теме. <br>" +
        '<br>[CENTER][color=#FF0000]Отказано.[/color][/CENTER][/FONT]',
        prefix: UNACСEPT_PREFIX,
        status: false,
    },
    {
        title: 'Отсутствует тайм',
      content:
		'[CENTER][Color=#FF0000][FONT=times new roman][I]Здравствуйте![/CENTER][/Color]' +
        "<br>[CENTER]Отсутствует /time. <br>" +
        '<br>[CENTER][color=#FF0000]Отказано.[/color][/CENTER][/FONT]',
        prefix: UNACСEPT_PREFIX,
        status: false,
    },
    {
      title: 'Восс. на должность',
      content:
		'[CENTER][Color=#FF0000][FONT=times new roman][I]Приветствую![/CENTER][/Color]' +
        "<br>[CENTER]Вы будете восстановлены на свою должность в скором времени. Извиняемся за предоставленные неудобства. [/CENTER]<br>" +
        '<br>[CENTER][color=#00FF00]Решено.[/color][/CENTER][/FONT]',
      prefix: RESHENO_PREFIX,
	  status: false,
        },
        {
         title: 'Неадек.жб',
      content:
		'[CENTER][Color=#FF0000][FONT=times new roman][I]Здравствуйте![/CENTER][/Color]' +
        "<br>[CENTER]Пожалуйста, составьте свою жалобу в адекватной формe. <br>" +
        '<br>[CENTER][color=#FF0000]Отказано.[/color][/CENTER][/FONT]',
        prefix: UNACСEPT_PREFIX,
        status: false,
    },
    {
         title: 'Доква нераб.',
      content:
		'[CENTER][Color=#FF0000][FONT=times new roman][I]Приветствую![/CENTER][/Color]' +
        "<br>[CENTER]Нерабочие ссылки на доказательства. <br>" +
        '<br>[CENTER][color=#FF0000]Отказано.[/color][/CENTER][/FONT]',
        prefix: UNACСEPT_PREFIX,
        status: false,
    },
    {
      title: 'Ответ был дан ранее',
      content:
		'[CENTER][Color=#FF0000][FONT=times new roman][I]Доброго времени суток![/CENTER][/Color]' +
        "<br>[CENTER]Ранее вам был выдан ответ. <br>" +
        '<br>Не создавайте дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.<br>' +
        '<br>[CENTER][color=#FF0000]Закрыто.[/color][/CENTER][/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
        },
        {
        title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴•Обжалование•╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Одобрено ОБЖ',
      content:
		'[CENTER][Color=#FF0000][FONT=times new roman][I]Здравствуйте, уважаемый игрок![/CENTER][/Color]' +
        "<br>[CENTER]В обжаловании - одобрено. Наказание будет снято/снижено. Впредь не повторяйте подобных ошибок.<br>" +
        '<br>Приятной игры на TYUMEN!<br>' +
        '<br>[CENTER][color=#00FF00]Одобрено.[/color][/CENTER][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Отказано ОБЖ',
	  content:
		'[CENTER][Color=#FF0000][FONT=times new roman][I]Доброго времени суток, уважаемый игрок![/CENTER][/Color]' +
        "<br>[CENTER]Администрация не готова сократить или снять вам наказание. В обжаловании - отказано. <br>" +
        "<br>[CENTER]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.<br>" +
        '<br>[CENTER][color=#FF0000]Отказано.[/color][/CENTER][/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
      title: 'Не тот раздел/сервер',
      content:'[CENTER][Color=#FF0000][FONT=times new roman][I]Здравствуйте![/CENTER][/Color]' +
              "<br>[CENTER]Вы ошиблись разделом/сервером. Переношу вашу тему в нужный раздел/сервер. <br>",
    },
    {
      title: 'Нет окно бана',
      content:
		'[CENTER][Color=#FF0000][FONT=times new roman][I]Приветствую![/CENTER][/Color]' +
        "<br>[CENTER]Прикрепите окно блокировки вашего аккаунта при входе в игру.<br>" +
        '<br>[CENTER][color=#FF0000]Отказано.[/color][/CENTER][/FONT]',
      prefix: UNACСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не сохр логи',
      content:
		'[CENTER][Color=#FF0000][FONT=times new roman][I]Доброго времени суток, уважаемый игрок![/CENTER][/Color]' +
        "<br>[CENTER]По предоставленным доказательствам наказание на данный момент выдать невозможно. Это техническая проблема.<br>" +
        '<br>[CENTER][color=#FF0000]Закрыто.[/color][/CENTER][/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
	  title: 'ОБЖ не подлежит',
	  content:
		'[CENTER][Color=#FF0000][FONT=times new roman][I]Здравствуйте![/CENTER][/Color]' +
        "<br>[CENTER]Данное нарушение обжалованию не подлежит.<br>" +
        '<br>[CENTER]Нарушения, по которым заявка на обжалование не рассматривается:<br>' +
        '<br>4.1. различные формы "слива";<br>'  +
        '4.2. продажа игровой валюты;<br>' +
        '4.3. махинации;<br>' +
        '4.4. целенаправленный багоюз;:<br>' +
        '4.5. продажа, передача аккаунта;<br>' +
        '4.6. сокрытие ошибок, багов системы;<br>' +
        '4.7. использование стороннего программного обеспечения;<br>' +
        '4.8. распространение конфиденциальной информации;<br>' +
        '4.9. обман администрации.<br>' +
        '<br>[CENTER][color=#FF0000]Отказано.[/color][/CENTER][/FONT]',
      prefix: UNACСEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Тех. раздел',
      content:
		'[CENTER][Color=#FF0000][FONT=times new roman][I]Приветствую![/CENTER][/Color]' +
        "<br>[CENTER]Обратитесь в Технический раздел.<br>" +
        '<br>[CENTER][color=#FF0000]Закрыто.[/color][/CENTER][/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'NonRP обман',
      content:
		'[CENTER][Color=#FF0000][FONT=times new roman][I]Доброго времени суток, уважаемый игрок![/CENTER][/Color]' +
        "<br>[CENTER]Ваш аккаунт будет разблокирован на 24 часа.<br>" +
        '<br>[CENTER]Ваша задача найти игрока которого вы обманули, и под видеозапись фиксировать ваш разговор, и то как вы передаёте нажитое имущество нечестным путём (с /time), далее прикрепляете видеозапись в этой теме.[/CENTER]<br>'+
        '<br>[CENTER][color=#FFFF00]На рассмотрении.[/color][/CENTER][/FONT]',
      prefix: NARASSMOTRENIIORG_PREFIX,
	  status: false,
    },
    {
        title: 'Смена ника',
      content:
		'[CENTER][Color=#FF0000][FONT=times new roman][I]Здравствуйте![/CENTER][/Color]' +
        "<br>[CENTER]Вам даётся 24 часа на смену Nickname.[/CENTER]<br>" +
        '<br>[CENTER][color=#FFFF00]На рассмотрении...[/color][/CENTER][/FONT]',
      prefix: NARASSMOTRENIIORG_PREFIX,
	  status: false,
    },
    {
              title: 'Взлом',
      content:
		'[CENTER][Color=#FF0000][FONT=times new roman][I]Здравствуйте![/CENTER][/Color]' +
        '<br>[CENTER]Если у вас есть привязки к аккаунту, через ВК/Email попытайтесь восстановить.[/CENTER]<br>'+
         '<br>[CENTER]Скриншот того, что вы сменили пароль, прикрепите тут. Код - можете замазать.[/CENTER]<br>'+
        '<br>[CENTER]Тема открыта.[/CENTER]<br>'+
        '<br>[CENTER][color=#FFFF00]На рассмотрении.[/color][/CENTER][/FONT]',
      prefix: NARASSMOTRENIIORG_PREFIX,
	  status: true,
    }
        ]

  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('Закрыто', 'Zakrito');
    addButton('На рассмотрении', 'NaRassmotrenii');
    addButton('Решено', 'Resheno');
    addButton('Вердикты', 'selectAnswer');
    addButton('Скрипт Tyumen');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
    $('button#NaRassmotrenii').click(() => editThreadData(NARASSMOTRENIIORG_PREFIX, false));
    $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));

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
        10 < hours && hours <= 17 ?
        'Добрый день' :
        17 < hours && hours <= 24 ?
        'Добрый вечер' :
        24 < hours && hours <= 10 ?
        'Добрый день' :
        'Добрый день',
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
