// ==UserScript==
// @name Administration Curator
// @namespace https://forum.blackrussia.online
// @version 1.1
// @description ..
// @author Gleb
// @match https://forum.blackrussia.online/index.php?threads/*
// @include https://forum.blackrussia.online/index.php?threads/
// @grant none
// @license MIT
// @collaborator
// @downloadURL https://update.greasyfork.org/scripts/457122/Administration%20Curator.user.js
// @updateURL https://update.greasyfork.org/scripts/457122/Administration%20Curator.meta.js
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
       '[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
          "[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=times new roman]Ваша жалоба взята на рассмотрение, ожидайте ответ в данной теме. [/FONT][/COLOR]<br><br>" +
        '[SIZE=4][FONT=times new roman][COLOR=rgb(128, 255, 202)][U]Не нужно создавать копии данной жалобы.[/U][/COLOR][/FONT][/SIZE][/CENTER]',
      prefix: PIN_PREFIX ,
      status: true,
    },
    {
         title: 'Админ прав',
      content:
        '[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman]Нарушений со стороны администратора нет.[/FONT][/SIZE]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][CENTER][FONT=times new roman][SIZE=4]Отказано, закрыто.[/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Админ не прав',
      content:
        '[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[SIZE=4][FONT=times new roman][COLOR=rgb(209, 213, 216)]С администратором будет проведена беседа.[/COLOR][/FONT][/SIZE]<br>" +
        "[FONT=times new roman][COLOR=#d1d5d8][SIZE=4]Приносим извинения за доставленные неудобства.<br>" +
        '[COLOR=lime][FONT=times new roman][SIZE=4]Одобрено, закрыто.[/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Ответ дан раннее',
      content:
       '[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][SIZE=4][FONT=times new roman][COLOR=rgb(209, 213, 216)]Вам уже ранее был дан корректный ответ, за создание дубликатов этой темы Ваш форумный аккаунт может быть заблокирован.[/COLOR][/FONT][/SIZE]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Отказано, закрыто.[/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Недостаточно док-в',
      content:
       '[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[COLOR=rgb(209, 213, 216)][CENTER][FONT=times new roman][SIZE=4]Недостаточно доказательств для корректного рассмотрения Вашего обращения.[/SIZE][/FONT][/COLOR]<br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Отказано, закрыто.[/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нужен фрапс',
      content:
        '[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        '[COLOR=rgb(209, 213, 216)][FONT=times new roman][CENTER][SIZE=4]Недостаточно доказательств для корректного рассмотрения жалобы. В данном случае требуются видео - доказательства.[/SIZE][/FONT]<br>' +
        '[FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе Ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/COLOR]<br>' +
       '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Отказано, закрыто.[/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Док-ва отред.',
      content:
        '[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        '[COLOR=rgb(209, 213, 216)][FONT=times new roman][CENTER][SIZE=4]Ваши доказательства были подвергнуты изменениям (редактированию), прикрепите оригинальные файлы.[/SIZE][/FONT]<br>' +
        '[FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/COLOR]<br>' +
         '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Отказано, закрыто.[/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {

     title: 'Отсутст. док-ва',
      content:
        '[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[COLOR=rgb(209, 213, 216)][CENTER][FONT=times new roman][SIZE=4]Отсутствуют доказательства - следовательно, рассмотрению не подлежит.[/SIZE][/FONT][/COLOR]<br>" +
        "[SIZE=4][COLOR=rgb(209, 213, 216)][FONT=times new roman]Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/FONT][/COLOR][/SIZE]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Отказано, закрыто.[/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Тех. спец.',
      content:
        '[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[COLOR=rgb(209, 213, 216)][CENTER][FONT=times new roman][SIZE=4]Обратитесь в раздел жалоб на Технических специалистов - [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/']*Нажмите сюда*[/URL]<br>" +
        "Просьба не создавать дубликаты данной темы в этом разделе, иначе Ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/COLOR]<br><br>" +
       '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Отказано, закрыто.[/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'В обжалования',
      content:
        '[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        '[COLOR=rgb(209, 213, 216)][CENTER][FONT=times new roman][SIZE=4]Обратитесь в раздел "Обжалование наказаний".[/SIZE][/FONT][/COLOR]<br><br>' +
        '[COLOR=rgb(209, 213, 216)][CENTER][FONT=times new roman][SIZE=4][URL="https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.724/"] Обжалование наказаний сервера AZURE → нажмите сюда[/URL][/SIZE][/FONT][/COLOR]<br><br>' +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'В тех раздел',
      content:
     '[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[COLOR=rgb(209, 213, 216)][CENTER][FONT=times new roman][SIZE=4]Обратитесь в технический раздел.[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(209, 213, 216)][CENTER][FONT=times new roman][SIZE=4][URL="https://forum.blackrussia.online/index.php?forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB.22/"] Технический раздел → нажмите сюда[/URL][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы в этом разделе, иначе Ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/COLOR]<br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Закрыто.[/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Срок написания истёк',
      content:
       '[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[COLOR=rgb(209, 213, 216)][CENTER][FONT=times new roman][SIZE=4]Срок написания жалобы - истёк.[/SIZE][/color][/CENTER][/FONT]<br>" +
        '[QUOTE="Sander_Kligan, post: 15771101, member: 195"]<br>' +
        'Срок написания жалобы составляет [COLOR=rgb(255, 0, 0)]два дня[/COLOR] (48 часов) с момента совершенного нарушения со стороны администратора сервера.<br>' +
        '[LIST]<br>' +
         '[*][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] в случае истечения срока жалоба рассмотрению не подлежит.<br>' +
          '[/LIST]<br>' +
          "[/QUOTE]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][CENTER][FONT=times new roman][SIZE=4]Отказано, закрыто.[/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нужно окно бана',
      content:
       '[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        '[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Прикрепите в доказательства скриншот окна блокировки, которое появляется сразу после входа в игру.<br>' +
        "Для загрузки доказательств используйте такие сервисы, как [URL='https://yapx.ru/']yapx.ru[/URL], [URL='https://imgur.com/']imgur.com[/URL], [URL='https://www.youtube.com/']youtube.com[/URL].<br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Отказано, закрыто.[/SIZE][/FONT][/COLOR][/CENTER]',
        prefix: UNACCEPT_PREFIX,
      status: false,
        },
    {
        title: 'Не по форме',
      content:
       '[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[SIZE=4][FONT=times new roman][CENTER][COLOR=rgb(209, 213, 216)]Ваша жалоба составлена не по форме.[/COLOR]<br><br>" +
        '[SIZE=4][FONT=times new roman][CENTER][COLOR=rgb(209, 213, 216)]Форма подачи:[/CENTER][/COLOR]<br>' +
        '[LEFT][QUOTE]1. Ваш Nick_Name:<br>2. Nick_Name администратора:<br>3. Дата выдачи/получения наказания:<br>4. Суть жалобы:<br>5. Доказательство:[/QUOTE][/LEFT]<br><br>' +
        '[COLOR=rgb(255, 0, 0)][CENTER][FONT=times new roman][SIZE=4]Отказано, закрыто.[/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
        },
    {
      title: 'Не по теме',
      content:
        '[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][CENTER][SIZE=4]Ваше сообщение никоим образом не относится к данному разделу.[/SIZE][/FONT][/COLOR]<br>" +
       '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Отказано, закрыто.[/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
        },
    {
        title: 'Запрошу док-ва',
      content:
        '[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=times new roman]Запрошу доказательства у администратора, ожидайте ответ в данной теме. [/FONT][/COLOR]<br><br>" +
        '[FONT=times new roman][COLOR=rgb(249, 172, 0)]На рассмотрении. [/COLOR][/FONT][/SIZE][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
        title: 'Выдано верно',
      content:
       '[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
       "[COLOR=rgb(209, 213, 216)][CENTER][SIZE=4][FONT=times new roman]Администратор предоставил доказательства, [U]наказание выдано верно[/U].[/FONT][/SIZE]<br>" +
        "[COLOR=rgb(209, 213, 216)]Внимательно прочтите общие правила серверов и впредь, пожалуйста, не нарушайте - [/COLOR][COLOR=rgb(209, 213, 216)][URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*Нажмите сюда*[/URL][/COLOR][/SIZE][/FONT]<br>" +
        "[SIZE=4][FONT=times new roman][COLOR=rgb(209, 213, 216)]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/COLOR][/FONT][/SIZE]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Отказано, закрыто.[/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
         title: 'Выдано не верно',
      content:
        '[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[SIZE=4][CENTER][FONT=times new roman][COLOR=rgb(209, 213, 216)]Ваша жалоба была одобрена и будет проведена беседа с администратором, Ваше наказание будет снято.[/COLOR]<br><br>" +
        "[COLOR=rgb(209, 213, 216)]Приносим свои извинения за доставленные неудобства.[/COLOR]<br><br>" +
        '[COLOR=lime][FONT=times new roman][SIZE=4]Одобрено, закрыто.[/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Док-ва в соц. сетях',
      content:
       '[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[COLOR=rgb(209, 213, 216)][CENTER][SIZE=4][FONT=times new roman]Доказательства в социальных сетях и т.п. не принимаются.[/FONT][/SIZE]<br>" +
        "Для загрузки доказательств используйте такие сервисы, как [URL='https://yapx.ru/']yapx.ru[/URL], [URL='https://imgur.com/']imgur.com[/URL], [URL='https://www.youtube.com/']youtube.com[/URL].<br><br>" +
        '[COLOR=rgb(255, 0, 0)][CENTER][FONT=times new roman][SIZE=4]Отказано, закрыто.[/SIZE][/FONT][/COLOR][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
        },
    {
        title: 'Передано ГА',
      content:
       '[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Главному Администратору.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)]Ожидайте ответа в данной теме, создавать копии не нужно.<br><br>" +
        '[FONT=times new roman][COLOR=rgb(249, 172, 0)]На рассмотрении. [/COLOR][/FONT][/SIZE][/CENTER]',
      prefix: GA_PREFIX,
      status: true,
    },
    {
        title: 'Передано СА',
      content:
        '[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Специальной Администрации.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>" +
         '[SIZE=4][FONT=times new roman][COLOR=rgb(128, 255, 202)]Ожидайте ответа в данной теме, [U]копии создавать не нужно.[/U][/COLOR][/SIZE][/FONT][/CENTER]',
      prefix: SA_PREFIX,
      status: true,
    },
    {
         title: 'Наказание по МСК',
	  content:
		 	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		'[CENTER]Наказание любого вида снимается в соответствии с московским часовым поясом. <br><br>' +
        '[Color=Red][CENTER]Закрыто.[/CENTER][/color][/FONT]',
	prefix: CLOSE_PREFIX,
	status: false,
	},
    {
        title: 'Улучшения для серверов',
	content:
	  	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
	'[CENTER] Ваша тема не относится к Жалобам на Администрацию, если Вы хотите предложить изменения в игровом моде - обратитесь в раздел <br> [URL="https://forum.blackrussia.online/index.php?categories/Предложения-по-улучшению.656/"] Предложения по улучшению → нажмите сюда[/URL].<br> [/CENTER][/FONT]' ,
prefix: CLOSE_PREFIX,
	status: false,
    },
   {
       title: 'Не тот сервер',
	  content:
		  	'[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
		"[CENTER]Вы ошиблись сервером.[/CENTER]<br><br>" +
	'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color][/FONT]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
        title: 'Передано ЗГА',
      content:
       '[Color=yellow][SIZE=4][FONT=Times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
        "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Заместителю Главного Администратора.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)]Ожидайте ответа в данной теме, создавать копии не нужно.<br><br>" +
        '[FONT=times new roman][COLOR=rgb(249, 172, 0)]На рассмотрении. [/COLOR][/FONT][/SIZE][/CENTER]',
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
'Доброе утро' :
11 < hours && hours <= 15 ?
'Добрый день' :
15 < hours && hours <= 22 ?
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