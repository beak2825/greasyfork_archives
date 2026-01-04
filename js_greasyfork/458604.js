// ==UserScript==
// @name administration curator 2.0
// @namespace https://forum.blackrussia.online
// @version 1.4
// @description ..
// @author Gleb
// @match https://forum.blackrussia.online/index.php?threads/*
// @include https://forum.blackrussia.online/index.php?threads/
// @grant none
// @license MIT
// @collaborator
// @downloadURL https://update.greasyfork.org/scripts/458604/administration%20curator%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/458604/administration%20curator%2020.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // отказано
const ACCEPT_PREFIX = 8; // одобрено
const PIN_PREFIX = 2; // на рассмотрении
const COMMAND_PREFIX = 10; //команде проекта
const WATCHED_PREFIX = 9; // рассмотрено
const CLOSE_PREFIX = 7; //закрыто
const SA_PREFIX = 11;// спец админу
const GA_PREFIX = 12;//глав админу
const V_PREFIX = 1;//важно
const WAIT_PREFIX = 14; //oжидание
const buttons = [
   {
      title: '|',
      content:
        '[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
	'[CENTER]  [/CENTER]',
    },
    {
      title: 'На рассмотрении',
      content:
       '{{ greeting }} <br>' +
          "На рассмотрении.<br><br>",
      prefix: PIN_PREFIX ,
      status: true,
    },
    {
         title: 'Админ прав',
      content:
        "Нарушений со стороны администратора нет.<br><br>" +
        'Отказано.',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Админ не прав',
      content:
        "С администратором будет проведена беседа.<br>" +
        "Приносим извинения за доставленные неудобства.<br><br>" +
        'Одобрено.',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Ответ дан раннее',
      content:
       '{{ greeting }} <br>' +
        "Ответ был дан ранее.<br>" +
        'Закрыто.',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Недостаточно док-в',
      content:
       '{{ greeting }} <br>' +
        "Недостаточно доказательств.<br>" +
        'Отказано.',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нужен фрапс',
      content:
        '{{ greeting }} <br>' +
        'Недостаточно доказательств. В данном случае требуются видео - доказательства.<br>' +
       'Отказано.',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Док-ва отред.',
      content:
      '{{ greeting }} <br>' +
        'Ваши доказательства были подвергнуты изменениям (редактированию), прикрепите оригинальные файлы.<br>' +
          'Отказано.',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {

     title: 'Отсутст. док-ва',
      content:
       '{{ greeting }} <br>' +
        "Отсутствуют доказательства.<br>"+
          'Отказано.',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Тех. спец.',
      content:
     '{{ greeting }} <br>' +
        "Обратитесь в раздел жалоб на Технических специалистов.<br>"+
          'Закрыто.',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'В обжалования',
      content:
        '{{ greeting }} <br>' +
        'Обратитесь в раздел "Обжалование наказаний".<br>' +
                  'Закрыто.',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'В тех раздел',
      content:
     '{{ greeting }} <br>' +
        "Обратитесь в технический раздел.<br><br>" +
                  'Закрыто.',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Срок написания истёк',
      content:
       '{{ greeting }} <br>' +
        "Срок написания жалобы - истёк.<br>" +
        //'[QUOTE="Sander_Kligan, post: 15771101, member: 195"]<br>' +
       // 'Срок написания жалобы составляет [COLOR=rgb(255, 0, 0)]два дня[/COLOR] (48 часов) с момента совершенного нарушения со стороны администратора сервера.<br>' +
        //'[LIST]<br>' +
        // '[*][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] в случае истечения срока жалоба рассмотрению не подлежит.<br>' +
        //  '[/LIST]<br>' +
        //  "[/QUOTE]<br><br>" +
        'Отказано.',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нужно окно бана',
      content:
       '{{ greeting }} <br>' +
        'Прикрепите в доказательства скриншот окна блокировки.<br>' +
        'Отказано.',
        prefix: UNACCEPT_PREFIX,
      status: false,
        },
    {
        title: 'Не по форме',
      content:
      '{{ greeting }} <br>' +
        "Ваша жалоба составлена не по форме.<br><br>" +
        'Форма подачи:<br>' +
        '1. Ваш Nick_Name:<br>2. Nick_Name администратора:<br>3. Дата выдачи/получения наказания:<br>4. Суть жалобы:<br>5. Доказательство:<br><br>' +
         'Отказано.',
      prefix: UNACCEPT_PREFIX,
      status: false,
        },
    {
      title: 'Не по теме',
      content:
       '{{ greeting }} <br>' +
        "Ваше сообщение не относится к данному разделу.<br>" +
          'Отказано.',
      prefix: UNACCEPT_PREFIX,
      status: false,
        },
    {
        title: 'Запрошу док-ва',
      content:
       '{{ greeting }} <br>' +
        "Запрошу доказательства у администратора.",
      prefix: PIN_PREFIX,
      status: true,
    },
    {
        title: 'Выдано верно',
      content:
       
       "Наказание выдано верно.<br>"+
           'Отказано.',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
         title: 'Выдано не верно',
      content:
       
        "Администратор допустил ошибку, Ваше наказание будет снято.<br><br>" +
        'Одобрено.',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Док-ва в соц. сетях',
      content:
       '{{ greeting }} <br>' +
        "Доказательства в социальных сетях и т.п. не принимаются.<br>" +
        "Для загрузки доказательств используйте такие сервисы, как [URL='https://yapx.ru/']yapx.ru[/URL], [URL='https://imgur.com/']imgur.com[/URL], [URL='https://www.youtube.com/']youtube.com[/URL].<br><br>" +
           'Отказано.',
      prefix: UNACCEPT_PREFIX,
      status: false,
        },
    {
        title: 'Передано ГА',
      content:
       '{{ greeting }} <br>' +
        "Передано Главному Администратору.<br>",
      prefix: GA_PREFIX,
      status: true,
    },
    {
        title: 'Передано СА',
      content:
        '{{ greeting }} <br>' +
        "Передано Специальной Администрации.<br>",
      prefix: SA_PREFIX,
      status: true,
    },
    {
         title: 'Наказание по МСК',
	  content:
		 	'{{ greeting }} <br>' +
		'Наказание любого вида снимается в соответствии с московским часовым поясом.<br>' +
        'Закрыто.',
	prefix: CLOSE_PREFIX,
	status: false,
	},
    {
        title: 'Улучшения для серверов',
	content:
	  	'{{ greeting }} <br>' +
	'Ваша тема не относится к Жалобам на Администрацию, если Вы хотите предложить изменения  - обратитесь в раздел <br> [URL="https://forum.blackrussia.online/index.php?categories/Предложения-по-улучшению.656/"] Предложения по улучшению → нажмите сюда[/URL].<br> ' ,
prefix: CLOSE_PREFIX,
	status: false,
    },
   {
       title: 'Не тот сервер',
	  content:
		  	'{{ greeting }} <br>' +
		"Вы ошиблись сервером.<br><br>" +
	   'Отказано.',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
        title: 'Передано ЗГА',
      content:
       '{{ greeting }} <br>' +
        "Передано руководству сервера.<br>",
      prefix: PIN_PREFIX,
      status: true,
    },
    {
        title: 'test1',
      content:
       '[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        '[SIZE=4][FONT=times new roman][COLOR=rgb(128, 255, 202)][U]тест1[/U][/COLOR][/FONT][/SIZE][/CENTER]',
      prefix: V_PREFIX,
      status: true,
    }
];

$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

// Добавление кнопок при загрузке страницы
addButton('Ф', 'ff');
addButton('ПР', 'prr');
addButton('соц', 'soc');
addButton('|', '');
addButton('Закрыто', 'close');
addButton('На рассмотрение', 'pin');
addButton('Одобрено', 'accepted');
addButton('Отказано', 'unaccept');
addButton('СА', 'SA');
addButton('ГА', 'GA');
addButton('|', '');
addButton('запрос', 'request');
addButton('верно', 'right');
addButton('не верно', 'incorrect');
addButton('Меню', 'selectAnswer');



    // Поиск информации о теме
    const threadData = getThreadData();

    $(`button#ff`).click(() => pasteContent(14, threadData, true));
    $(`button#prr`).click(() => pasteContent(15, threadData, true));
    $(`button#soc`).click(() => pasteContent(19, threadData, true));
    $(`button#request`).click(() => pasteContent(16, threadData, true));
    $(`button#right`).click(() => pasteContent(17, threadData, true));
    $(`button#incorrect`).click(() => pasteContent(18, threadData, true));
    $(`button#SA`).click(() => pasteContent(21, threadData, true));
    $(`button#GA`).click(() => pasteContent(20, threadData, true));
    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
    //$('button#SA').click(() => editThreadData(SA_PREFIX, true));//префикс
    //$('button#GA').click(() => editThreadData(GA_PREFIX, true)); //префикс


    $(`button#selectAnswer`).click(() => {
        XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
        buttons.forEach((btn, id) => {
            if(id > 0) {
                $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
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
4 < hours && hours <= 11 ?
'Приветствую. ' :
11 < hours && hours <= 15 ?
'Добрый день. ' :
15 < hours && hours <= 22 ?
'Добрый вечер. ' :
'Здравствуйте. ',
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