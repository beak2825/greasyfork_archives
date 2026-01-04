// ==UserScript==
// @name         Для ЗГА от Дози
// @namespace    https://forum.blackrussia.online
// @version      2.2
// @description  Скрипт для Зга by Doze_Sulaymonov
// @author     Doze_Sulaymonov
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include       https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license    MIT
// @collaborator Дозя
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/450003/%D0%94%D0%BB%D1%8F%20%D0%97%D0%93%D0%90%20%D0%BE%D1%82%20%D0%94%D0%BE%D0%B7%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/450003/%D0%94%D0%BB%D1%8F%20%D0%97%D0%93%D0%90%20%D0%BE%D1%82%20%D0%94%D0%BE%D0%B7%D0%B8.meta.js
// ==/UserScript==
 
 
(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPEC_PREFIX = 11;
const buttons = [
     {
      title: 'Приветствие',
      content: '[FONT=trebuchet ms][CENTER][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER][/SIZE][/CENTER][/FONT]',
    },
    {
      title: '_______________________________________для обж________________________________________________',
    },
     {
      title: 'Отказ в обж',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]' +
        "[CENTER]На данный момент мы не готовы пойти вам на встречу и снизить срок наказания<br>Приятной игры на сервере White[COLOR=#ff0000][/COLOR][/CENTER]" +
		'[Color=#ff0000][CENTER]Отказано, закрыто.[/SIZE][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ответ уже был дан',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' +
        "[CENTER]Ответ был дан в прошлом обжаловании. Просьба не создавать похожие темы.<br>Приятной игры на сервере White[/CENTER]" +
		'[Color=#ff0000][CENTER]Отказано, закрыто.[/SIZE][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не работают доки',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' +
        "[CENTER]Не работают доказательства, подайте снова но уже с рабочими доказательствами.<br> Приятной игры на сервере White[/CENTER]" +
		'[Color=#ff0000][CENTER]Отказано, закрыто.[/SIZE][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В жалобу на адм',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' +
        "[CENTER]Если у вас есть претензии к работе Администрации, обратитесь в раздел[Color=#ff4500](Жалобы на администрацию)<br>Приятной игры на сервере White[/COLOR][/CENTER]<br>" +
		'[Color=#ff0000][CENTER]Закрыто.[/SIZE][/CENTER][/color][/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Нет доков на обж',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' +
        "[CENTER]В обжалование отказано.<br>[Color=#ff0000]Причина[/COLOR]: нет доказательств, пожалуйста подайте снова но уже с доказательствами.<br>Приятной игры на сервере White[/CENTER]<br>" +
		'[Color=#ff0000][CENTER]Отказано, закрыто.[/SIZE][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'обж передано ГА',
	  content:
		'[Color=Red][CENTER][B]{{ greeting }}, уважаемый игрок.[/color][/CENTER][/B]' +
		"[CENTER]Ваше обжалование будет передано Главному Администратору на рассмотрение.[/CENTER]<br><br>" +
		'[Color=Red][CENTER][B]Ожидайте ответа.[/CENTER][/color][/B]',
	  prefix: GA_PREFIX,
	  status: true,
	},
    {
title: 'На рассмотрении',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' +
        "[CENTER]Ваше обжалование находится на рассмотрение[/CENTER]" +
		'[Color=#ff4500][CENTER]На рассмотрении.[/SIZE][/CENTER][/color][/FONT]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'Не по форме',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' +
        "[CENTER]Ваше обжалование не по форме, прочитайте внимательно правила подачи обжалование, и подайте снова.<br>Приятной игры на сервере White[/CENTER]<br>" +
		'[Color=#ff0000][CENTER]Отказано, закрыто.[/SIZE][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'будет разблок акк',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' +
        "[CENTER]Ваш аккаунт будет [Color=#00ff00] разблокирован[/COLOR], впредь больше не нарушайте.<br>Приятной игры на сервере White[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/SIZE][/CENTER][/color][/FONT]',
      prefix: ACCEPTED_PREFIX,
	  status: false,
    },
    {
      title: 'Сливы не обжалываются',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' +
        "[CENTER]В обжалование [Color=#ff0000] отказано[/COLOR].<br>4.1. различные формы (Слива); (не обжалуются)[/CENTER]<br>" +
		'[Color=#ff0000][CENTER]Отказано, закрыто.[/SIZE][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Обман адм не обжалывается',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' +
        "[CENTER]В обжалование [Color=#ff0000]отказано[/COLOR].<br>4.9. обман администрации. (не обжалуется)[/CENTER]<br>" +
		'[Color=#FF0000][CENTER]Отказано, закрыто.[/SIZE][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нонрп обман',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' +
        "[CENTER]В вашем обжаловании отказано.Пострадавший игрок должен написать обжалование в котором должен согласиться на возврат обманутого имущества.<br>После этого Вы должны дать ответ в этом обжаловании,что согласны вернуть игроку имущество.Только после этого обжалование будет взято на рассмотрение. [/CENTER]" +
		'[Color=#ff0000][CENTER]Отказано, закрыто.[/SIZE][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'На рассмотрение нонрп обман',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' +
        "[CENTER] Ваш аккаунт будет разблокирован на 24 часа.<br>За это время вы должны связаться с жертвой обмана и вернуть ему украденное имущество. После чего видео фиксацию возврата имущества предоставить в этой жалобе. Если вы выполните все условия, ваш аккаунт будет полностью разблокирован. Если же украденное имущество будет передано друзьям/твинк аккаунт, то аккаунты будут заблокированы без возможности обжаловать наказание.[/CENTER]<br>" +
		'[Color=#ff4500][CENTER]На рассмотрении.[/SIZE][/CENTER][/color][/FONT]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: '__________________________________ДЛЯ ЖАЛОБ НА АДМИНИСТРАЦИЮ______________________________________',
    },
     {
	  title: 'Беседа',
	  content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' +
		"[CENTER]С администратором будет проведена беседа.[/CENTER]" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/SIZE][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'АДМ будет наказан',
	  content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' +
		"[CENTER]Администратор будет [COLOR=#ff0000]наказан[/COLOR][/CENTER]" +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/SIZE][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'На рассмотрении',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' +
        "[CENTER]Запросил доказательства у администратора ожидайте вердикта[/CENTER]" +
		'[Color=#ff4500][CENTER]На рассмотрении.[/SIZE][/CENTER][/color][/FONT]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'наказание выдано верно',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' +
        "[CENTER]Наказание было выдано[COLOR=#00ff00] верно [/COLOR].[/CENTER]" +
		'[Color=#ff0000][CENTER]Отказано, закрыто.[/SIZE][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не по форме',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' +
        "[CENTER]Ваша жалоба не по форме, прочитайте внимательно правило подачи жалоб и подайте снова.[/CENTER]" +
		'[Color=#ff0000][CENTER]Отказано, закрыто.[/SIZE][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нет доков жб',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' +
        "[CENTER]В вашей жалобе нету доказательств, подайте снова но уже с доказательствами.[/CENTER]" +
		'[Color=#ff0000][CENTER]Отказано, закрыто.[/SIZE][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В ОБЖ',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' +
        "[CENTER]Обратитесь в раздел [Color=#00ff00](Обжалование наказание)[/COLOR].[/CENTER]" +
		'[Color=#ff0000][CENTER]Отказано, закрыто.[/SIZE][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Доки в вк',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' +
        "[CENTER]В обжалование [Color=#ff0000] отказано[/COLOR].<br>3.3. Прикрепление доказательств обязательно. [Color=#ff0000]Примечание:[/COLOR] загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается.[/CENTER]<br>" +
		'[Color=#ff0000][CENTER]Отказано, закрыто.[/SIZE][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'В тех.раздел',
	  content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' +
		"[CENTER]Обратитесь в технический раздел. Раздел жалоб на технических специалистов.[/CENTER]" +
		'[Color=#ff0000][CENTER]Отказано, закрыто.[/SIZE][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Сборка',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' +
        "[CENTER]В обжалование [COLOR=#ff0000]отказано[/COLOR],<br>4.7. использование стороннего программного обеспечения; [Color=#ffff00](обжалованию не подлежит)[/COLOR][/CENTER]<br>" +
		'[Color=#ff0000][CENTER]Отказано. Закрыто[/SIZE][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Гл.Адм',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' +
        "[CENTER]Ваша жалоба была передана [Color=#ff0000]Главному Администратору[/COLOR].<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Ожидайте ответа.[/SIZE][/CENTER][/color][/FONT]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'Команде Проекта',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' +
        "[CENTER]Ваша жалоба была передана [Color=#ffff00]Команде проекта[/COLOR].<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Ожидайте ответа.[/SIZE][/CENTER][/color][/FONT]',
      prefix: COMMAND_PREFIX,
	  status: true,
    },
    {
      title: 'Спец.адм',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' +
        "[CENTER]Ваша жалоба была передана [Color=#ff0000]Специальному администратору[/COLOR].<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br>" +
		'[Color=#00FF00][CENTER]Ожидайте ответа.[/SIZE][/CENTER][/color][/FONT]',
      prefix: SPEC_PREFIX,
	  status: true,
    },
    {
      title: 'Срок ЖБ',
      content:
		'[Color=#ffffff][FONT=trebuchet ms][CENTER][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' +
        "[CENTER]Срок подачи жалобы [Color=#ff0000]истёк[/COLOR].[/CENTER]" +
		'[Color=#ff0000][CENTER]Отказано закрыто.[/SIZE][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
  ];
 
  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение', 'pin');
    addButton('КП', 'teamProject');
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('Ответы', 'selectAnswer');
 
    // Поиск информации о теме
    const threadData = getThreadData();
 
    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
 
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
        11 < hours && hours <= 18 ?
        'Добрый день' :
        18 < hours && hours <= 22 ?
        'Добрый вечер' :
        'Доброй ночи',
    };
  }
 
  function editThreadData(prefix, pin = false) {
    // Получаем заголовок темы, так как он необходим при запросе
    const threadTitle = $('.p-title-value')[0].lastChild.textContent;
 
    if (pin == false) {
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
    if (pin == true) {
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