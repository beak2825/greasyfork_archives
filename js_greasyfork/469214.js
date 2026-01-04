// ==UserScript==
// @name         Скрипт для ГС/ЗГС | Black by M. Tenside
// @namespace    // @namespace    https://forum.blackrussia.online
// @version      0.4
// @description  Специально для BlackRussia | BLACK M.Tenside
// @author       M.Tenside
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @collaborator M.Tenside
// @icon         https://icons.iconarchive.com/icons/google/noto-emoji-people-bodyparts/512/12003-OK-hand-light-skin-tone-icon.png
// @downloadURL https://update.greasyfork.org/scripts/469214/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%7C%20Black%20by%20M%20Tenside.user.js
// @updateURL https://update.greasyfork.org/scripts/469214/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%7C%20Black%20by%20M%20Tenside.meta.js
// ==/UserScript==

(function () {
  'use strict';
'esversion 6' ;
 const UNACCEPT_PREFIX = 4; // Префикс "Отказано"
 const ACCEPT_PREFIX = 8; // Префикс "Одобрено"
 const PIN_PREFIX = 2; // Префикс "На рассмотрении"
 const COMMAND_PREFIX = 10; // Префикс "Команде проекта"
 const WATCHED_PREFIX = 9; //Префикс "Рассмотрено"
 const CLOSE_PREFIX = 7; // Префикс "Закрыто"
 const TEX_PREFIX = 13; // Префикс "Тех. специалисту"
 const GA_PREFIX = 12; // Префикс "Главному администратору"
 const V_PREFIX = 1;
 const buttons = [
     {
    title: `--------------------------------------------------------->>>>>   ГС/ЗГС ГОСС   <<<<<---------------------------------------------------------`,
 },
 {
     title: `------------------------------------------------------>>>>>   Открытие заявок на Лд   <<<<<------------------------------------------------------`,
 },
 {
     title: "Заявка на Лд",
     content:
     "[CENTER][IMG alt=ddnddd10.png]https://i.postimg.cc/d0vz79cM/ddnddd10.png[/IMG][/CENTER]<br>" +
     "[CENTER][I][B][COLOR=rgb(0, 221, 0)][FONT=georgia][SIZE=4]Доброго времени суток, каждый из игроков подходящий по критериям ниже имеет право оставить это заявление, и побороться за лидерство. Помните главное, данный пост это серьезный шаг, делая его Вы соглашаетесь со всеми критериями, а так же понимаете то что должны будете отдавать игре много времени, для поддержания стабильной работы вашей организации. Только после понимания того на что вы идете, пишите это заявление и просим вас не тратить наше время на то, чтобы проверить бессмысленные заявления![/SIZE][/I][/B][/FONT][/COLOR][/CENTER]<br>" +
     "[HEADING=3][CENTER][/CENTER][/HEADING]<br>" +
     "[CENTER][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Критерии для подачи заявления:[/FONT][/SIZE][/COLOR][/CENTER]<br>" +
     "[HEADING=3][CENTER][/CENTER][/HEADING]<br>" +
     "[CENTER][COLOR=rgb(255, 255, 0)][FONT=georgia][SIZE=4][I][B]Игровой уровень не менее 10-го.[/B][/I][/SIZE][/FONT][/CENTER]<br>" +
     "[CENTER][COLOR=rgb(255, 255, 0)][FONT=georgia][SIZE=4][I][B]Не иметь действующих наказаний.[/B][/I][/SIZE][/FONT][/CENTER]<br>" +
     "[CENTER][COLOR=rgb(255, 255, 0)][FONT=georgia][SIZE=4][I][B]Минимальный суточный онлайн +4 часа.[/B][/I][/SIZE][/FONT][/CENTER]<br>" +
     "[CENTER][COLOR=rgb(255, 255, 0)][FONT=georgia][SIZE=4][I][B]Реальный возраст от 15 лет (Исключение даются в крайних случаях).[/B][/I][/SIZE][/FONT][/CENTER]<br>" +
     "[CENTER][COLOR=rgb(255, 255, 0)][FONT=georgia][SIZE=4][I][B]Знание правил Role-Play и правила отыгровки RP.[/B][/I][/SIZE][/FONT][/CENTER]<br>" +
     "[CENTER][COLOR=rgb(255, 255, 0)][FONT=georgia][SIZE=4][I][B]Открытый профиль в *VK*, дабы была возможность добавлять в беседы.[/B][/I][/SIZE][/FONT][/CENTER]<br>" +
     "[CENTER][COLOR=rgb(255, 255, 0)][FONT=georgia][SIZE=4][I][B]Ваш аккаунт в VK должен быть мминиммум создан за 3 месяца до подачи заявок.[/B][/I][/SIZE][/FONT][/CENTER]<br>" +
     "[HEADING=3][CENTER][/CENTER][/HEADING]<br>" +
     "[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Примечание:[/SIZE][/FONT][/COLOR][/B][/CENTER][/I]<br>" +
     "[CENTER][COLOR=rgb(255, 255, 0)][B][FONT=georgia]Если вы не выполнили/не подходите по вышеперечисленным критериям, следящая администрация имеет право вам отказать в заявление на пост «Лидера».[/FONT][/B][/CENTER][/COLOR]<br>" +
     "[HEADING=3][CENTER][/CENTER][/HEADING]<br>" +
     "[CENTER][I][B][COLOR=rgb(255, 0, 0)][SIZE=5][FONT=georgia]Форма подачи заявления:.[/FONT][/SIZE][/CENTER][/COLOR][/B][/I]<br>" +
     "[CENTER][IMG width=462px alt=download.gif]https://i.postimg.cc/DfJZr1wn/download.gif[/IMG][/CENTER]<br>" +
     "[CENTER][FONT=georgia][B][COLOR=rgb(0, 221, 0)][SIZE=4]Ваш NickName:.[/SIZE][/COLOR][/B][/FONT]<br>" +
     "[CENTER][FONT=georgia][B][COLOR=rgb(0, 221, 0)][SIZE=4]Ваш игровой уровень:.[/SIZE][/COLOR][/B][/FONT]<br>" +
     "[CENTER][FONT=georgia][B][COLOR=rgb(0, 221, 0)][SIZE=4]Ваша статистика (/stats):.[/SIZE][/COLOR][/B][/FONT]<br>" +
     "[CENTER][FONT=georgia][B][COLOR=rgb(0, 221, 0)][SIZE=4]Скриншот лицензий (/lic):[/SIZE][/COLOR][/B][/FONT]<br>" +
     "[CENTER][FONT=georgia][B][COLOR=rgb(0, 221, 0)][SIZE=4]Скриншот истории смены игровых NickName'ов (/history):[/SIZE][/COLOR][/B][/FONT]<br>" +
     "[CENTER][FONT=georgia][B][COLOR=rgb(0, 221, 0)][SIZE=4]Ваша RolePlay биография [Одобренная]:.[/SIZE][/COLOR][/B][/FONT]<br>" +
     "[CENTER][IMG width=507px alt=download-1.gif]https://i.postimg.cc/MpbXcxKB/download-1.gif[/IMG][/CENTER]<br>" +
     "[B][COLOR=rgb(0, 221, 0)][FONT=georgia][SIZE=4]Ваше реальное имя и фамилия:[/SIZE][/FONT][/COLOR][/B]<br>" +
     "[B][COLOR=rgb(0, 221, 0)][FONT=georgia][SIZE=4]Ваш возраст:[/SIZE][/FONT][/COLOR][/B]<br>" +
     "[B][COLOR=rgb(0, 221, 0)][FONT=georgia][SIZE=4]Страна город/страна проживания:[/SIZE][/FONT][/COLOR][/B]<br>" +
     "[B][COLOR=rgb(0, 221, 0)][FONT=georgia][SIZE=4]Часовой пояс (указать в часах от мск):[/SIZE][/FONT][/COLOR][/B]<br>" +
     "[B][COLOR=rgb(0, 221, 0)][FONT=georgia][SIZE=4]Ваш средний суточный онлайн:[/SIZE][/FONT][/COLOR][/B]<br>" +
     "[B][COLOR=rgb(0, 221, 0)][FONT=georgia][SIZE=4]Расскажите о себе (чем увлекаетесь, занимаетесь в свободное время):[/SIZE][/FONT][/COLOR][/B]<br>" +
     "[B][COLOR=rgb(0, 221, 0)][FONT=georgia][SIZE=4]Почему именно вы должны занять данный пост, и администрация должна выбрать именно вас?:[/SIZE][/FONT][/COLOR][/B]<br>" +
     "[B][COLOR=rgb(0, 221, 0)][FONT=georgia][SIZE=4]Имеется ли опыт на посту лидера:[/SIZE][/FONT][/COLOR][/B]<br>" +
     "[B][COLOR=rgb(0, 221, 0)][FONT=georgia][SIZE=4]Представьте ситуацию - У вас завязался сильный конфликт с лидером другой организации, ваши действия и рассуждения в данной ситуации? Как Вы будете решать эту ситуацию?:[/SIZE][/FONT][/COLOR][/B]<br>" +
     "[B][COLOR=rgb(0, 221, 0)][FONT=georgia][SIZE=4]Вы сможете удерживать members 10+ стабильно?:[/SIZE][/FONT][/COLOR][/B]<br>" +
     "[B][COLOR=rgb(0, 221, 0)][FONT=georgia][SIZE=4]Ваш логин в Discord:[/SIZE][/FONT][/COLOR][/B]<br>" +
     "[B][COLOR=rgb(0, 221, 0)][FONT=georgia][SIZE=4]Ссылка на Вашу страничку VK:[/SIZE][/FONT][/COLOR][/B]<br>" +
     "[HEADING=3][CENTER][/CENTER][/HEADING]<br>" +
     "[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4]Примечание:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
     "[B][COLOR=rgb(255, 255, 0)][B][SIZE=3][FONT=georgia]1. В анкетах всегда поощряется полное описание всего! Меньше воды, больше интересной информации дабы мы могли представить Вас как личность! Заявки(анкеты), это тоже один из важнейших этапов прохождения на пост лидерства, отнеситесь к этому очень серьезно![/FONT][/COLOR][/SIZE][/B]<br>" +
     "[B][COLOR=rgb(255, 255, 0)][B][SIZE=3][FONT=georgia]2. Чьи анкеты по мнению администрации не несут в себе достаточной информации, могут быть отклонены или удалены без объяснения причины![/FONT][/COLOR][/SIZE][/B]<br>" +
     "[B][COLOR=rgb(255, 255, 0)][B][SIZE=3][FONT=georgia]3. Все скриншоты должны быть с /time.[/FONT][/COLOR][/SIZE][/B]<br>" +
     "[B][COLOR=rgb(255, 255, 0)][B][SIZE=3][FONT=georgia]4. Скриншоты должны быть сделаны после открытия заявок на пост лидера фракции.[/FONT][/COLOR][/SIZE][/B]<br>" +
     "[B][COLOR=rgb(255, 255, 0)][B][SIZE=3][FONT=georgia]5. Ваша страница в ВК не должна быть *Фейком*.[/FONT][/COLOR][/SIZE][/B]<br>" +
     "[B][COLOR=rgb(255, 255, 0)][B][SIZE=3][FONT=georgia]6. Нельзя занимать места в заявках. За нарушение этого, Ваше сообщение будет удалено.[/FONT][/COLOR][/SIZE][/B]<br>" +
     "[B][COLOR=rgb(255, 255, 0)][B][SIZE=3][FONT=georgia]Обман администрации даже в анкетах, несет за собой нарушение правил проекта, а именно *2.34. Запрещен обман администрации*,[/FONT][/COLOR][/SIZE][/B]<br>" +
     "[B][COLOR=rgb(255, 255, 0)][B][SIZE=3][FONT=georgia]Если, у Вас есть уверенность в том, что Вам действительно нужен данный пост - Вы можете подавать заявку. Если Вы не уверены, что сможете отстоять хотя бы 7 дней, не стоит совершать данный поступок.[/FONT][/COLOR][/SIZE][/B]<br>" +
     "[FONT=georgia][B][I][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR][/SIZE][/I][/B][/FONT]<br>" +
     "[B][COLOR=rgb(255, 255, 0)][B][SIZE=3][FONT=georgia]Помните, что при уходе с данного поста, при этом не отстояв срок в 15 дней, Вы получить блокировку аккаунта на 15 дней.[/FONT][/SIZE][/COLOR][/B][/CENTER]<br>" +
     "[B][COLOR=rgb(255, 255, 0)][B][SIZE=3][FONT=georgia]Примечание: После одобрение, с вами свяжится Старшая Администрация. Вам будет необходимо добавить представителя старшей администрации в друзья, после вас добавят в специальную беседу.[/FONT][/SIZE][/COLOR][/B][/CENTER]<br>" +
     "[B][COLOR=rgb(255, 255, 0)][B][SIZE=3][FONT=georgia]Никто из состава администрации не будет просить у вас все различные пароли, пин-коды, информация о привязках и так далее. Не ведитесь на обманы![/FONT][/SIZE][/COLOR][/B][/CENTER]<br>" ,
      prefix: V_PREFIX,
      status: true,
      
 },
 
   ];
      $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

              // Добавление кнопок при загрузке страницы
          addButton('Ответы ГС', 'selectAnswer');

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