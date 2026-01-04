// ==UserScript==
// @name         GOLD | Скрипт для Кураторов адм | ЗГА | ГА
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  По вопросам в ВК - https://vk.com/id564470649, туда же и по предложениям на улучшение скрипта)
// @author       Angel_Flyweather
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://i.pinimg.com/236x/12/bf/83/12bf83e848d6c4e18961e397b49ac186.jpg
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/510286/GOLD%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%B0%D0%B4%D0%BC%20%7C%20%D0%97%D0%93%D0%90%20%7C%20%D0%93%D0%90.user.js
// @updateURL https://update.greasyfork.org/scripts/510286/GOLD%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%B0%D0%B4%D0%BC%20%7C%20%D0%97%D0%93%D0%90%20%7C%20%D0%93%D0%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RASSMOTENO_PREFIX = 9; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEX_PREFIX = 13;
const buttons = [
      {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ Передача обжалований руководству ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Передано ГА',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Ваше обжалование было передано на рассмотрение [COLOR=#ff1a1a]Главному администратору[/COLOR] [/FONT] <br><br>" +
        '[FONT=georgia]Ожидайте его ответа.[/FONT]',
      prefix: GA_PREFIX,
	  status: true,
         },
    {
      title: 'Передано Спец. администрации',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Ваше обжалование было передано на рассмотрение [COLOR=#ff0000]Специальной администрации[/COLOR] [/FONT] <br><br>" +
        '[FONT=georgia]Ожидайте ответа.[/FONT]',
      prefix: SPECY_PREFIX,
	  status: true,
    },
    {
      title: 'Передано руководителю модеров',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Ваше обжалование было передано на рассмотрение [Color=#1E90FF]Руководителю модерации Discord[/COLOR] [/FONT] <br><br>" +
        '[FONT=georgia]Ожидайте его ответа.[/FONT]',
      prefix: COMMAND_PREFIX,
	  status: true,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ Вердикт по обжалованию ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
         },
    {
      title: 'Обжалование одобрено',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]В обжаловании одобрено, наказание будет снято. [/FONT] <br><br>" +
    '[FONT=georgia]Одобрено[/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
        },
    {
      title: 'На рассмотрении',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Ваше обжалование взято на рассмотрение.[/FONT] <br><br>" +
        '[FONT=georgia]На рассмотрении[/FONT]',
        prefix: PIN_PREFIX,
      status: true,
        },
    {
      title: 'Обжалование отказ',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Руководство сервера не готово полностью снять или же частично уменьшить ваше наказание.[/FONT] <br>" +
      "[FONT=georgia]В амнистии отказано.[/FONT] <br><br>" +
        '[FONT=georgia]Закрыто.[/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
      },
    {
      title: 'Обжалование отказ (доки предоставлены)',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Доказательства предоставлены, наказание выдано верно[/FONT] <br>" +
      "[FONT=georgia]В обжаловании отказано[/FONT] <br><br>" +
        '[FONT=georgia]Закрыто. [/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
        },
    {
      title: 'Не подлежит обжалованию',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Данное нарушение правил проекта является серьезным и не подлежит обжалованию. [/FONT] <br><br>" +
        '[FONT=georgia]В обжаловании отказано[/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
        },
    {
      title: 'Срок снижен на 7 дней',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Ваше наказание будет снижено [COLOR=#7fed2b]до 7 дней блокировки аккаунта. [/COLOR][/FONT] <br><br>" +
        '[FONT=georgia]Закрыто. [/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
         },
    {
      title: 'Срок снижен на 15 дней',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Ваше наказание будет снижено [COLOR=#7fed2b]до 15 дней блокировки аккаунта. [/COLOR][/FONT] <br><br>" +
        '[FONT=georgia]Закрыто. [/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
        },
    {
      title: 'Срок снижен на 30 дней',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Ваше наказание будет снижено [COLOR=#7fed2b]до 30 дней блокировки аккаунта. [/COLOR][/FONT] <br><br>" +
        '[FONT=georgia]Закрыто. [/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ Отказ обжалования ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Не по форме',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Ваше обжалование составлено не по форме.<br>Убедительная просьба ознакомиться с правилами подачи заявки на обжалование наказания - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']*Тык*[/URL] [/FONT] <br><br>" +
        '[FONT=georgia]Закрыто. [/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Нет доков',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]В вашем обжаловании отсутствуют доказательства / окно блокировки аккаунта. [/FONT] <br><br>" +
        '[FONT=georgia]Закрыто. [/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
          },
    {
      title: 'Дубликат',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Вам уже был дан ответ в подобной теме, просьба не создавать дубликаты.[/FONT] <br><br>" +
        '[FONT=georgia]Закрыто. [/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Уже был обжалован',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Ваше наказание уже было обжаловано, повторного обжалования не будет. [/FONT] <br><br>" +
        '[FONT=georgia]Закрыто. [/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Доки из соц. сетей',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). [/FONT] <br><br>" +
        '[FONT=georgia]Закрыто. [/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
	{
	  title: 'Ошиблись сервером',
	  content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Вы ошиблись сервером. <br>Переношу вашу тему в нужный раздел для дальнейшего рассмотрения.[/FONT] <br><br>" +
        '[FONT=georgia]Переадресовано[/FONT]',
        status: 123,
    },
    {
      title: 'ЧС организации будет снят',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Вы были вынесены из черного списка организации. [/FONT] <br><br>" +
        '[FONT=georgia]Одобрено[/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: '24 часа на смену ника',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Ваш аккаунт будет разблокирован на 24 часа для смены игрового NickName, после смены обязательно прикрепите скриншот с /time в данную тему. [/FONT] <br><br>" +
        '[FONT=georgia]На рассмотрении[/FONT]',
      prefix: PIN_PREFIX,
	  status: 123,
    },
    {
      title: 'НРП развод',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Если вы хотите хотите обжаловать наказание за nrp обман, Вы должны сами связаться с человеком, которого обманули.<br>"+
        "[FONT=georgia]После чего Вы должны прописать все условия возврата украденного имущества с подтверждением пострадавшей стороны, а уже после написать обжалование, прикрепив окно блокировки аккаунта и переписку с договором на возврат имущества.<br>"+
        "[FONT=georgia]По-другому Вы никак не сможете обжаловать наказание за nrp обман.<br>"+
        "[FONT=georgia]Возврат производится без моральной компенсации.<br><br>"+
        '[FONT=georgia]Закрыто. [/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'НРП развод (24 часа на возврат имущества)',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Ваш игровой аккаунт разблокирован на 24 часа, в течение этого времени Вы должны вернуть игроку украденное имущество.<br>"+
        "[FONT=georgia]Сам процесс возврата должен быть запечатлен на видеозапись с /time.<br>"+
        "[FONT=georgia]В конце сделки прикрепите фрапс возврата в данную тему.<br>"+
        '[FONT=georgia]На рассмотрении [/FONT] <br><br>',
      prefix: PIN_PREFIX,
	  status: 123,
         },
    {
      title: 'Прикрепите ссылку на VK',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Прикрепите ссылку на вашу страницу VK <br><br>" +
        '[FONT=georgia]На рассмотрении [/FONT] <br><br>',
      prefix: PIN_PREFIX,
	  status: 123,
     },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ Обратитесь в другой раздел ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'В жб на адм',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Если вы не согласны с выданным наказанием, то обратитесь в раздел Жалоб на Администрацию - [URL='https://forum.blackrussia.online/forums/Жалобы-на-администрацию.680/']*Тык*[/URL] [/FONT] <br><br>" +
        '[FONT=georgia]Закрыто. [/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'В жб на игроков',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Данный игрок не является администратором.<br>Обратитесь в раздел Жалоб на игроков - [URL='https://forum.blackrussia.online/forums/Жалобы-на-игроков.682/']*Тык*[/URL]. [/FONT] <br><br>" +
        '[FONT=georgia]Закрыто. [/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'В жб на лд',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Данный игрок является лидером.<br>Обратитесь в раздел Жалоб на лидеров - [URL='https://forum.blackrussia.online/forums/Жалобы-на-лидеров.681/']*Тык*[/URL]. [/FONT] <br><br>" +
        '[FONT=georgia]Закрыто. [/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'В обжалования',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Внимательно ознакомившись с вашей жалобой, было решено, что Вам нужно обраться в раздел Обжалований наказаний - [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.683/']*Тык*[/URL] [/FONT] <br><br>" +
        '[FONT=georgia]Закрыто. [/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'В тех раздел',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Вы ошиблись разделом.<br>Обратитесь в Технический раздел - [URL='https://forum.blackrussia.online/forums/Технический-раздел-gold.660/']*Тык*[/URL]. [/FONT] <br><br>" +
        '[FONT=georgia]Закрыто. [/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'В жб на теха',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Вам было выдано наказание Техническим специалистом, Вы можете написать жалобу/обжалование здесь - [URL='https://forum.blackrussia.online/forums/Сервер-№15-gold.1196/']*Тык*[/URL] [/FONT] <br><br>" +
        '[FONT=georgia]Закрыто. [/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },





  ];

  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрении 🍁', 'pin');
    addButton('КП 🐯', 'teamProject');
    addButton('ГА 🐰', 'Ga');
    addButton('Спецу 🦁', 'Spec');
    addButton('Одобрено ✅', 'accepted');
    addButton('Отказано ❌', 'unaccept');
    addButton('Тех. Специалисту 🐣', 'Texy');
    addButton('Рассмотрено 👍', 'Rasmotreno');
    addButton('Закрыто 🏚', 'Close');
    addButton('Ответы', 'selectAnswer');



	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#Ga').click(() => editThreadData(GA_PREFIX, true));
	$('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#Texy').click(() => editThreadData(TEX_PREFIX, true));
	$('button#Rasmotreno').click(() => editThreadData(RASSMOTENO_PREFIX, false));
	$('button#Close').click(() => editThreadData(CLOSE_PREFIX, false));
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
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 0px 20px; border-color: green; border-style: dashed solid; margin-right: 7px; margin-bottom: 10px; background: green; text-decoration-style: wavy;">${name}</button>`,
);
}

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
  .map(
	(btn, i) =>
	  `<button id="answers-${i}" class="button--primary button ` +
	  `rippleButton" style="border-radius: 10px; margin-right: 10px; margin-bottom: 10px"><span class="button-text">${btn.title}</span></button>`,
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
	if(pin == 123){
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

}

function getFormData(data) {
	const formData = new FormData();
	Object.entries(data).forEach(i => formData.append(i[0], i[1]));
	return formData;
  }
})();