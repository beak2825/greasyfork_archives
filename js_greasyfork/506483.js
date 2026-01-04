// ==UserScript==
// @name         KALUGA | Script для ГС/ЗГС
// @namespace    https://forum.blackrussia.online
// @version      1.1
// @description  Удачной работы <3
// @author       Ferz Sheldon
// @match        https://forum.blackrussia.online/*
// @icon         https://forum.blackrussia.online/
// @license      ferz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506483/KALUGA%20%7C%20Script%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/506483/KALUGA%20%7C%20Script%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%A1%D0%97%D0%93%D0%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closes.
const WATCHED_PREFIX = 9;
const TEX_PREFIX = 13;
const buttons = [
         {
 		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                        Раздел жалобы на лидеров           ⠀    ⠀   ᅠ ᅠ     ᅠ ᅠ ',
         dpstyle: 'oswald: 3px;     color: white; background: #181513; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #d4ad72; width: 96%',
         },
    {
	  title: 'Не найдено в логах',
	  content:
		"[B][CENTER][color=#ffe066][size=4] Доброго времени суток. [/color][/CENTER]<br>"+
		"[B][CENTER]Данное нарушение не найдено в системе логирования.<br><br>"+
		'[B][CENTER][color=#f56464]Закрыто.[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
      },
      {
        title: 'Запрошу док-ва',
    content:
    "[B][CENTER][size=4][color=#ffe066] Доброго времени суток. [/color][/CENTER]<br>"+
    "[B][CENTER]Запрошу доказательства у лидера.<br><br>"+
    '[B][CENTER][color=#de823c]На рассмотрении.[/CENTER]',
    prefix: PIN_PREFIX,
    status: true,
      },
  {
    title: 'Док-ва предоставлены',
    content:
    "[B][CENTER][color=#ffe066][size=4] Доброго времени суток. [/color][/CENTER]<br>"+
    "[B][CENTER]Доказательства предоставлены, наказание выдано верно.<br><br>"+
    '[B][CENTER][color=#f56464]Закрыто.[/color][/CENTER]',
    prefix: CLOSE_PREFIX,
    status: false,
        },
  {
    title: 'Будет проведена работа',
    content:
    "[B][CENTER][color=#ffe066][SIZE=4]Доброго времени суток.[/CENTER][/color]<br>"+
    "[B][CENTER]В сторону лидера будет проведена работа.<br><br>"+
    '[B][CENTER][color=#62b559]Рассмотрено.[/CENTER][/B]',
    prefix: WATCHED_PREFIX,
    status: false,
      },
  {
    title: 'Будет проведена беседа',
    content:
    "[B][CENTER][COLOR=#ffe066][size=4]Доброго времени суток.[/CENTER][/COLOR]<br>"+
    "[B][CENTER]С лидером будет проведена профилактическая беседа.<br><br>"+
    '[B][CENTER][COLOR=#62b559]Рассмотрено.[/CENTER][/B]',
    prefix: WATCHED_PREFIX,
    status: false,
      },
  {
        title: 'Будет наказан',
	  content:
		"[B][CENTER][size=4][color=#ffe066] Доброго времени суток.[/CENTER][/color]<br>"+
		"[B][CENTER]Лидеру будет выдано соответствующее наказание.<br><br>"+
		'[B][CENTER][color=#62b559]Одобрено.[/CENTER]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
      },
          {
    title: 'На рассмотрение',
    content:
    "[B][CENTER][size=4][color=#ffe066] Доброго времени суток. [/color][/CENTER]<br>"+
    "[B][CENTER]Ваша жалоба взята на рассмотрение, не создавайте дубликатов и ожидайте ответа  от администрации.<br><br>"+
    '[B][CENTER][color=#f2811d]На рассмотрении.[/CENTER]',
    prefix: PIN_PREFIX,
    status: true,
          },
{
 		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                     Отказанные жалобы на лидеров   ᅠᅠ ᅠᅠ          ⠀        ⠀  ⠀',
  dpstyle: 'oswald: 3px;     color: white; background: #181513; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #d4ad72; width: 96%',
   },
    {
	  title: 'Не по форме',
	  content:
		"[B][CENTER][size=4][color=#ffe066] Доброго времени суток.[/CENTER][/color]<br>"+
		"[B][CENTER]Вашa жалобa составленa не по форме, пожалуйста, ознакомьтесь с правилами подачи жалоб.<br><br>"+
		'[B][CENTER][color=#E25041]Закрыто.[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Заголовок не по форме',
	  content:
		"[B][CENTER][size=4][color=#ffe066] Доброго времени суток.[/color][/CENTER]<br>"+
		"[B][CENTER]Заголовок Вашей жалобы составлен не по форме, пожалуйста, ознакомьтесь с правилами подачи жалоб.<br><br>"+
		'[B][CENTER][color=#E25041]Закрыто.[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Не по теме',
	  content:
		"[B][CENTER][size=4][color=#ffe066] Доброго времени суток.[/color][/CENTER]<br>"+
		"[B][CENTER]Ваше обращение выходит из рамки темы этого раздела. Убедительно просим ознакомиться с назначением данного раздела.<br><br>"+
		'[B][CENTER][color=#E25041]Закрыто.[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Нет нарушений',
	  content:
		"[B][CENTER][size=4][color=#ffe066] Доброго времени суток.[/color][/CENTER]<br>"+
		"[B][CENTER]Со стороны лидера нет нарушений.<br><br>"+
		'[B][CENTER][color=#E25041]Закрыто.[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
  {
    title: 'РП отыгровки необязательны',
    content:
    "[B][CENTER][size=4][color=#ffe066] Доброго времени суток.[/color][/CENTER]<br>"+
    "[B][CENTER]RolePlay отыгровки необязательны, достаточно системных. Со стороны лидера нет нарушений.<br><br>"+
    '[B][CENTER][color=#E25041]Закрыто.[/color][/CENTER]',
    prefix: CLOSE_PREFIX,
    status: false,
    },
    {
	  title: 'Дубликат',
	  content:
		"[B][CENTER][size=4][color=#ffe066] Доброго времени суток.[/color][/CENTER]<br>"+
		"[B][CENTER]Вам был дан ответ в прошлой жалобе. При последующем создании копии данной темы - форумный аккаунт будет заблокирован.<br><br>"+
		'[B][CENTER][color=#E25041]Закрыто.[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
  {
    title: 'Ник с ошибками',
    content:
    "[B][CENTER][size=4][color=#ffe066] Доброго времени суток.[/color][/CENTER]<br>"+
    "[B][CENTER]Ваш никнейм, либо никнейм игрока написан с ошибками.<br><br>"+
    '[B][CENTER][color=#E25041]Закрыто.[/color][/CENTER]',
    prefix: CLOSE_PREFIX,
    status: false,
	},
    {
	  title: 'Уже был наказан',
	  content:
		"[B][CENTER][size=4][color=#ffe066] Доброго времени суток.[/color][/CENTER]<br>"+
		"[B][CENTER]Данный лидер уже был наказан ранее.<br><br>"+
		'[B][CENTER][color=#E25041]Закрыто.[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
        title: 'Неадекватное поведение',
	  content:
		"[B][CENTER][size=4][color=#ffe066] Доброго времени суток.[/color][/CENTER]<br>"+
		"[B][CENTER]В жалобе присутствует неадекватное поведение. Убедительно просим ознакомиться с правилами подачи жалоб.<br><br>"+
		'[B][CENTER][color=#E25041]Закрыто.[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: '2 и более лидера',
	  content:
		"[B][CENTER][size=4][color=#ffe066] Доброго времени суток.[/color][/CENTER]<br>"+
		"[B][CENTER]Запрещено писать жалобу на 2-х и более лидеров.<br>"+
    "[B][CENTER]Составьте одну жалобу на одного лидера, а другую жалобу на другого лидера.<br><br>"+
		'[B][CENTER][color=#E25041]Закрыто.[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
  {
	  title: 'пункт не заполнен',
	  content:
		"[B][CENTER][size=4][color=#ffe066] Доброго времени суток.[/color][/CENTER]<br>"+
		"[B][CENTER]В жалобе не заполнен один из пунктов.<br><br>"+
		'[B][CENTER][color=#E25041]Закрыто.[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
 },
     {
	  title: 'Нету док-ва',
	  content:
		"[B][CENTER][size=4][color=#ffe066] Доброго времени суток.[/color][/CENTER]<br>"+
		"[B][CENTER]Отсутствуют доказательства на нарушение, прикрепите их, создав новую жалобу.<br><br>"+
		'[B][CENTER][color=#E25041]Закрыто.[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
        title: 'От 3 лица',
	  content:
		"[B][CENTER][size=4][color=#ffe066] Доброго времени суток.[/color][/CENTER]<br>"+
		"[B][CENTER]Жалоба составлена от 3-го лица, рассмотрению не подлежит.<br><br>"+
		'[B][CENTER][color=#E25041]Закрыто.[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
  {
	  title: 'Недостаточно док-в',
	  content:
		"[B][CENTER][size=4][color=#ffe066] Доброго времени суток.[/color][/CENTER]<br>"+
		"[B][CENTER]Недостаточно доказательств на нарушение для принятия решения.<br><br>"+
		'[B][CENTER][color=#E25041]Закрыто.[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Доква отредакт.',
	  content:
		"[B][CENTER][size=4][color=#ffe066] Доброго времени суток.[/color][/CENTER]<br>"+
		"[B][CENTER]Доказательства подвергнуты редактированию, рассмотрению не подлежит. <br><br>"+
		'[B][CENTER][color=#E25041]Закрыто.[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
     {
	  title: 'Доква в соц-сети',
	  content:
		"[B][CENTER][size=4][color=#ffe066] Доброго времени суток.[/color][/CENTER]<br>"+
		"[B][CENTER]Доказательства, загруженные в соц. сети не принимаются. Загрузите их на фото/видео хостинги, как YouTube, Imgur, Япикс.<br><br>"+
		'[B][CENTER][color=#E25041]Закрыто.[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Идентичная на рассмотрении',
	  content:
		"[B][CENTER][size=4][color=#ffe066] Доброго времени суток.[/color][/CENTER]<br>"+
		"[B][CENTER]Идентичная жалоба на данного лидера уже находится на рассмотрении.<br><br>"+
		'[B][CENTER][color=#E25041]Закрыто.[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'Нужен фрапс',
	  content:
		"[B][CENTER][size=4][color=#ffe066] Доброго времени суток.[/color][/CENTER]<br>"+
		"[B][CENTER]В данной ситуации нужна видеофиксация.<br><br>"+
		'[B][CENTER][color=#E25041]Закрыто.[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Не работают док-ва',
	  content:
		"[B][CENTER][size=4][color=#ffe066] Доброго времени суток.[/color][/CENTER]<br>"+
		"[B][CENTER]Ваши доказательства не рабочие или же битая ссылка.<br><br>"+
		'[B][CENTER][color=#E25041]Закрыто.[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
  {
    title: 'Доступ закрыт',
    content:
    "[B][CENTER][size=4][color=#ffe066] Доброго времени суток.[/color][/CENTER]<br>"+
    "[B][CENTER]Доступ к доказательствам закрыт.<br><br>"+
    '[B][CENTER][color=#E25041]Закрыто.[/color][/CENTER]',
    prefix: CLOSE_PREFIX,
    status: false,
	},
    {
	  title: 'Возрастные ограничения',
	  content:
		"[B][CENTER][size=4][color=#ffe066] Доброго времени суток.[/color][/CENTER]<br>"+
		"[B][CENTER]На доказательства установлены возрастные ограничения, пожалуйста, загрузите видеофиксацию без ограничений. <br><br>"+
		'[B][CENTER][color=#E25041]Закрыто.[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Нету Таймкодов',
	  content:
		"[B][CENTER][size=4][color=#ffe066] Доброго времени суток.[/color][/CENTER]<br>"+
		"[B][CENTER]Видеофиксация нарушения длится 3-х и более минут, вам следует указать таймкоды.<br><br>"+
		'[B][CENTER][color=#E25041]Закрыто.[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Нету /time',
	  content:
		"[B][CENTER][size=4][color=#ffe066] Доброго времени суток.[/color][/CENTER]<br>"+
		"[B][CENTER]На предоставленных доказательствах отсутствует /time, не подлежит рассмотрению.<br><br>"+
		'[B][CENTER][color=#E25041]Закрыто.[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
  {
    title: 'Не видно /time',
    content:
    "[B][CENTER][SIZE=4][color#ffe066] Доброго времени суток.[/color][/CENTER]<br>"+
    "[B][CENTER]На предоставленных доказательствах не видна дата, либо время нарушения.<br><br>"+
    '[B][CENTER][COLOR=#E25041]Закрыто.[/CENTER]',
    prefix: CLOSE_PREFIX,
    status: false,
  },
  {
	  title: 'Не полный фрапс',
	  content:
		"[B][CENTER][size=4][color=#ffe066] Доброго времени суток.[/color][/CENTER]<br>"+
		"[B][CENTER]Видеофиксация обрывается, загрузите полную видеофиксацию нарушения на видео/фото хостинг, создав новую жалобу.<br><br>"+
		'[B][CENTER][color=#E25041]Закрыто.[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
 {
	  title: 'Прошло 2 дня',
	  content:
		"[B][CENTER][size=4][color=#ffe066] Доброго времени суток.[/color][/CENTER]<br>"+
		"[B][CENTER]Вы своевременно не оформили жалобу на лидера, с момента совершения нарушения прошло более 48 часов.<br><br>"+
		'[B][CENTER][color=#E25041]Закрыто.[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
            title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ        Ошибка раздела   ᅠᅠ ᅠᅠ          ⠀                        ',
      dpstyle: 'oswald: 3px;     color: #d4ad72; background: #181513; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #d4ad72; width: 96%',
           },
    {
	  title: 'В ЖБ на АДМ',
	  content:
		"[B][CENTER][size=4][color=#ffe066] Доброго времени суток.[/color][/CENTER]<br>"+
		"[B][CENTER]Вы ошиблись разделом, обратитесь в раздел жалоб на администрацию. <br><br>"+
		'[B][CENTER][color=#E25041]Закрыто.[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'В ЖБ на игроков',
	  content:
		"[B][CENTER][size=4][color=#ffe066] Доброго времени суток.[/color][/CENTER]<br>"+
		"[B][CENTER]Вы ошиблись разделом, обратитесь в раздел жалоб на игроков. <br><br>"+
		'[B][CENTER][color=#E25041]Закрыто.[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    	{
	  title: 'В ЖБ на хелперов',
	  content:
		"[B][CENTER][size=4][color=#ffe066] Доброго времени суток.[/color][/CENTER]<br>"+
		"[B][CENTER]Вы ошиблись разделом, обратитесь в раздел жалоб на агентов поддержки. <br><br>"+
		'[B][CENTER][color=#E25041]Закрыто.[/color][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'В ЖБ на сотрудников',
	  content:
		"[B][CENTER][size=4][color=#ffe066] Доброго времени суток.[/color][/CENTER]<br"+
    "[B][CENTER]Вы ошиблись разделом, обратитесь в раздел жалоб на сотрудников данной организации.<br><br>"+
    '[B][CENTER][COLOR=#E25041]Закрытo.[/COLOR][/B]',
    prefix: CLOSE_PREFIX,
    status: false,
  },
  {
            title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ              ᅠᅠ ᅠᅠ          ⠀     ⠀',
      dpstyle: 'oswald: 3px;     color: #d4ad72; background: #181513; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #d4ad72; width: 96%',
     },
 ];
 $(document).ready(() => {
     // Загрузка скрипта для обработки шаблонов
     $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

     // Добавление кнопок при загрузке страницы
     addButton('Ответы', 'selectAnswer');

     // Поиск информации о теме
     const threadData = getThreadData();

     $('button#pin').click(() => editThreadData(PIN_PREFIX, false));
     $('button#Ga').click(() => editThreadData(GA_PREFIX, false));
     $('button#Spec').click(() => editThreadData(SPECY_PREFIX, false));
     $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, false));
     $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
     $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
     $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
     $('button#rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false));

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
       `<button type="button" class="button rippleButton" id="${id}" style="border-radius: 13px; background: #232529; margin-right: 6px; border: 2px solid #232529;">${name}</button>`,
     );
   }

 	function buttonsMarkup(buttons) {
 	return `<div class="select_answer">${buttons
 	.map(
 	(btn, i) =>
 	`<button id="answers-${i}" class="button--primary button ` +
 	`rippleButton" style="margin:4px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
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
         18 < hours && hours <= 21 ?
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
                               sticky: 1,
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