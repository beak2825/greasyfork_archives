// ==UserScript==
// @name         MATRP
// @namespace    https://forum.matrp.ru/index.php
// @version      2.6
// @description  Работа с форумом
// @author      Eclipse_Deluna
// @match        https://forum.matrp.ru/index.php*
// @include      https://forum.matrp.ru/index.php
// @grant        none
// @license 	 MIT
// @icon https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png
// @downloadURL https://update.greasyfork.org/scripts/441567/MATRP.user.js
// @updateURL https://update.greasyfork.org/scripts/441567/MATRP.meta.js
// ==/UserScript==
 
(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 6; // Prefix that will be set when thread solved
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const buttons = [
	{
	  title: 'Приветствие',
	  content:
		'[FONT=sans-serif][SIZE=18px][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
        '[CENTER][/CENTER][/FONT][/SIZE]'
	},
{
title: 'Жалобы с NonRP разводом',
content:
'[[FONT=sans-serif][SIZE=18px][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
'[CENTER]Вам требуется обратится в раздел <<Жалоб>> с названием <<NonRP разводы>>[/CENTER]<br><br>' +
'[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]'
},
{
title: 'Администратор будет наказан',
content:
'[CENTER]Приветствую, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
'[CENTER]Администратор понесет дисциплинарное наказание[/CENTER]<br><br>' +
'[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]'
},
{
title: 'Жалобы на гос. сотрудников',
content:
'[FONT=Arial][SIZE=16px][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
'[CENTER]Указанный игрок состоит в государственной организаци, обратитесь в раздел <<Жалобы на государственных сотрудников.[/CENTER]<br><br>' +
'[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]'
},
{
title: 'Жалобы на ОПГ',
content:
'[FONT=Arial][SIZE=16px][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
'[CENTER]Указанный игрок состоит в  преступной организаци, обратитесь в раздел <<Жалобы на ОПГ.[/CENTER]<br><br>' +
'[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]'
},
{
title: 'Жалобы на несост',
content:
'[FONT=Arial][SIZE=16px][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
'[CENTER]Указанный игрок не состоит во фракции, обратитесь в раздел <<Жалобы на не состоящих в орг.[/CENTER]<br><br>' +
'[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]'
},

{
	  title: 'Беседа с лидером',
	  content:
		'[FONT=Arial][SIZE=16px][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
        '[CENTER]С лидером будет проведена профилактическая беседа.[/CENTER]<br><br>' +
 '[CENTER]Рассмотрено, закрыто.[/CENTER][/FONT][/SIZE]'
	},
{
	  title: 'Одобренная жалоба на игрока',
	  content:
		'[FONT=Arial][SIZE=16px][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
        '[CENTER]Указанный вами игрок будет наказан за нарушение правил проекта.[/CENTER]<br><br>' +
 '[CENTER]Одобрено, закрыто.[/CENTER][/FONT][/SIZE]'
	},
{
	  title: 'Дублирование темы',
	  content:
		'[FONT=Arial][SIZE=16px][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
        '[CENTER]Ответ уже был дан в подобной теме. Пожалуйста, прекратите создавать идентичные или похожие темы - иначе Ваш форумный аккаунт может быть заблокирован.<br><br>' +    
 '[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]'
	},
{
title: 'Жалоба на адм не по форме',
content:
'[FONT=Arial][SIZE=16px][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
'[CENTER]Ваша жалоба составлена не по форме, убедительная просьба, ознакомиться с правилами подачи жалобы на администрацию, которые закреплены в данном разделе.[/CENTER]<br><br>' +
'[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]'
},
{
title: 'Жалоба на лидера не по форме',
content:
'[FONT=Arial][SIZE=16px][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
'[CENTER]Ваша жалоба составлена не по форме, убедительная просьба, ознакомиться с правилами подачи жалобы на лидеров, которые закреплены в данном разделе.[/CENTER]<br><br>' +
'[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]'
},
{
	  title: 'Форма помощь',
	  content:
		'[FONT=Arial][SIZE=16px][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
        '[CENTER]Заполните своё обращение по форме:[/CENTER]<br><br>' +
 '[CENTER]1. Ваш никнейм: <br> 2. Номер сервера :<br> 3. Суть: <br> 4. Скриншот/видеозапись от своего лица c /time:[/CENTER][/FONT][/SIZE]'
	},
{
	  title: 'Нет нарушений от игрока',
	  content:
		'[FONT=Arial][SIZE=16px][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
        '[CENTER]Указанный вами игрок не нарушил правила проекта.[/CENTER]<br><br>' +
 '[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]'
	},
{
	  title: 'Наказание будет снято',
	  content:
		'[FONT=Courier New][SIZE=15px][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
        '[CENTER]Выданное мною наказание будет аннулировано, выплачу вам компенсацию, прошу прощения.[/CENTER]<br><br>' +
 '[CENTER]Ожидайте вердикта.[/CENTER][/FONT][/SIZE]'
	},
{
	  title: 'Технический раздел',
	  content:
		'[FONT=Arial][SIZE=16px][SIZE=15px][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
        '[CENTER]Обратитесь в технический раздел проекта: [URL=https://forum.matrp.ru/index.php?forums/Технический-раздел.10/]кликабельно[/URL][/CENTER]<br><br>' + '[CENTER]Либо же в группу технической поддержки: [URL=https://vk.com/matrp_help]кликабельно[/URL][/CENTER][/FONT][/SIZE]'
	},
{
	  title: 'Правила раздела',
	  content:
		'[FONT=Arial][SIZE=16px][CENTER]{{ greeting }}, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела в котором Вы создали тему, так как Ваш запрос никоим образом не относится к данному разделу.[/CENTER]<br><br>" +
        '[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]'
},
{
	  title: 'Обратитесь в раздел жалоб своего сервера',
	  content:
		'[FONT=Arial][SIZE=16px][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
    "[LEFT]Обратитесь в раздел «Жалобы» Вашего сервера:<br><br><br>[URL='https://forum.matrp.ru/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.18/'][B]Сервер №1[/B] → нажмите сюда[/URL]<br>[URL='https://forum.matrp.ru/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.23/'][B]Сервер №2[/B] → нажмите сюда[/URL]<br>[URL='https://forum.matrp.ru/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.76/'][B]Сервер №3[/B] → нажмите сюда[/URL]<br>[URL='https://forum.matrp.ru/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.102/'][B]Сервер №4[/B] → нажмите сюда[/URL]<br>[URL='https://forum.matrp.ru/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.102/'][B]Сервер №4[/B] → нажмите сюда[/URL]<br>[URL='https://forum.matrp.ru/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.153/'][B]Сервер №5[/B] → нажмите сюда[/URL]<br>[URL='https://forum.matrp.ru/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.187/'][B]Сервер №6[/B] → нажмите сюда[/URL]<br>[URL='https://forum.matrp.ru/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.214/'][B]Сервер №7[/B] → нажмите сюда[/URL]<br>[URL='https://forum.matrp.ru/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.242/'][B]Сервер №8[/B] → нажмите сюда[/URL]<br>[URL='https://forum.matrp.ru/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.269/'][B]Сервер №9[/B] → нажмите сюда[/URL]<br>[URL='https://forum.matrp.ru/index.php?forums/Жалобы.296/'][B]Сервер №10[/B] → нажмите сюда[/URL]<br><br>" +

     '[CENTER]Не забудьте ознакомиться с правилами создания жалобы в закрепленной теме раздела.[/CENTER][/FONT][/SIZE]'
 },
{
	  title: 'Жалоба на игроков не по форме',
	  content:
		'[FONT=Arial][SIZE=16px][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.name }}[/B]![/CENTER]<br><br>' +
        '[CENTER]Ваша жалоба составлена не по форме, убедительная просьба, ознакомиться с правилами подачи жалобы на игроков, которые закреплены в данном разделе.[/CENTER]<br><br>' +
 '[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]'
	},
];
 

 
$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
// Добавление кнопок при загрузке страницы
    addButton('Одобрено✅', 'accepted');
    addButton('Отказано🚫', 'unaccept');
    addButton('На рассмотрении🤔', 'pin');
    addButton('Ответы💥', 'selectAnswer');
 
 
// Поиск информации о теме
    const threadData = getThreadData();
 
    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
 
    $(`button#selectAnswer`).click(() => {
        XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
        buttons.forEach((btn, id) => {
            if(id > 0) {
                $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
            } else {
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