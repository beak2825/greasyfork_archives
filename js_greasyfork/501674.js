// ==UserScript==
// @name         GOLD | Скрипт для руководства сервера
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  По вопросам в ВК - https://vk.com/id564470649, туда же и по предложениям по улучшению скрипта
// @author       Angel_Flyweather
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://i.pinimg.com/236x/12/bf/83/12bf83e848d6c4e18961e397b49ac186.jpg
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/501674/GOLD%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/501674/GOLD%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0.meta.js
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
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴ Жалобы на администрацию (рассмотрение) ╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
        },
    {
      title: 'На рассмотрении',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Ваша жалоба взята на рассмотрение, ожидайте ответа.[/FONT]<br><br>" +
        '[FONT=georgia]На рассмотрении [/FONT]',
      prefix: PIN_PREFIX,
	  status: true,
          },
    {
      title: 'Запрошены док-ва у админа',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]У администратора были запрошены доказательства на выданное наказание, ожидайте ответа.[/FONT]<br><br>" +
        '[FONT=georgia]На рассмотрении [/FONT]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'Наказание выдано верно',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Доказательства были предоставлены, наказание выдано верно.[/FONT]<br><br>" +
        '[FONT=georgia]Закрыто. [/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Наказание выдано неверно',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Ваша жалоба одобрена, с администратором будет проведена необходимая работа по данному случаю. Наказание будет снято в течение 24 часов.[/FONT]<br><br>" +
        '[FONT=georgia]Одобрено[/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
        },
    {
      title: 'Блокировка акка будет снята',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Ваш игровой аккаунт будет [COLOR=#00FF00]разблокирован[/COLOR][/FONT]<br><br>" +
        '[FONT=georgia]Закрыто. [/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ Жалобы на администрацию (отказ) ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Не по форме',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/']*Тык*[/URL] [/FONT] <br><br>" +
        '[FONT=georgia]Закрыто. [/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
         },
    {
      title: 'Жалоба в неадекватном формате',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Ваша жалоба составлена в неадекватном формате, в подобном виде она рассмотрена не будет.<br>Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/']*Тык*[/URL] [/FONT] <br><br>" +
        '[FONT=georgia]Закрыто. [/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Нет /time',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]В предоставленных доказательствах отсутствует /time. [/FONT] <br><br>" +
        '[FONT=georgia]Закрыто. [/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
         },
    {
      title: 'Док-ва в соц. сетях',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Ваши доказательства загружены в соц. сети, создайте новую тему, загрузив доказательства в Imgur, Япикс и др. фото- / видеохостинги. [/FONT] <br><br>" +
        '[FONT=georgia]Закрыто. [/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Нет /myreports',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]В предоставленных доказательствах отсутствует /myreports. [/FONT] <br><br>" +
        '[FONT=georgia]Закрыто. [/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'От 3 лица',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Жалобы,написанные от 3-его лица, не подлежат рассмотрению. [/FONT] <br><br>" +
        '[FONT=georgia]Закрыто. [/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Нужен фрапс',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]В данной ситуации обязательно должен быть фрапс (видеозапись) всех моментов. [/FONT] <br><br>" +
        '[FONT=georgia]Закрыто. [/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Фрапс обрывается',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Ваш фрапс обрывается, загрузите полную видеозапись на YouTube[/FONT] <br><br>" +
        '[FONT=georgia]Закрыто. [/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Дока-ва отредактированы',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Предоставленные доказательства отредактированы, предоставьте доказательства в первоначальном виде. [/FONT] <br><br>" +
        '[FONT=georgia]Закрыто. [/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Прошло более 48 часов',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]С момента выданного наказания / нарушения со стороны администрации сервера прошло более 48 часов, жалоба не подлежит дальнейшему рассмотрению.[/FONT] <br><br>" +
        '[FONT=georgia]Закрыто. [/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Нет строки выдачи наказания',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]На ваших доказательствах отсутствует строка чата с выдачей наказания. [/FONT] <br><br>" +
        '[FONT=georgia]Закрыто. [/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Нет окна бана',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]На ваших доказательствах отсутствует окно блокировки аккаунта. [/FONT] <br><br>" +
        '[FONT=georgia]Закрыто. [/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Нет доказательств',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]В вашей жалобе отсутствуют доказательства на нарушения со стороны администрации. [/FONT] <br><br>" +
        '[FONT=georgia]Закрыто. [/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Не работают док-ва',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Предоставленные доказательства не открываются.[/FONT] <br><br>" +
        '[FONT=georgia]Закрыто. [/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Дубликат',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Дублирование темы.<br>Если Вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован. [/FONT] <br><br>" +
        '[FONT=georgia]Закрыто. [/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Будет проведена беседа',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Ваша жалоба была одобрена, с администратором будет проведена профилактическая беседа.[/FONT] <br><br>" +
        '[FONT=georgia]Одобрено[/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Будет проведена строгая беседа',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Ваша жалоба была одобрена, с администратором будет проведена строгая беседа.[/FONT] <br><br>" +
        '[FONT=georgia]Одобрено[/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
          },
    {
      title: 'Будет проведена работа с адм',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Ваша жалоба была одобрена, с администратором будет проведена необходимая работа по данному случаю.[/FONT] <br><br>" +
        '[FONT=georgia]Одобрено[/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Адм будет наказан',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Ваша жалоба была одобрена, администратор получит наказание.[/FONT] <br><br>" +
        '[FONT=georgia]Одобрено[/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нет нарушений',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Исходя из ваших доказательств, нарушений со стороны администратора я не увидел. [/FONT] <br><br>" +
        '[FONT=georgia]Закрыто. [/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Адм снят / псж',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Администратор был снят/ушел со своего поста. [/FONT] <br><br>" +
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
    },
	{
	  title: 'Нет ссылки на жб',
	  content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Нет ссылки на данную жалобу.[/FONT] <br><br>" +
        '[FONT=georgia]Закрыто. [/FONT]',
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
	{
	  title: 'Не написал ник',
	  content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Игровой ник автора жалобы, ник администратора, на которого подается жалоба, дата выдачи наказания должны быть указаны в соответствии с правилами подачи жалоб, даже если эта информация присутствует на доказательствах или в тексте жалобы.[/FONT] <br><br>" +
        '[FONT=georgia]Закрыто. [/FONT]',
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
	{
	  title: 'Перезагрузите роутер',
	  content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Смените IP-адрес, перезагрузив роутер.[/FONT] <br><br>" +
        '[FONT=georgia]Закрыто. [/FONT]',
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ Передача жалобы руководству ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
         },
    {
      title: 'Передано руководству',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Ваша жалоба передана на рассмотрение моему руководству [/FONT] <br><br>" +
        '[FONT=georgia]На рассмотрении[/FONT]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'Передано ЗГА по ГОС/ОПГ',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Ваша жалоба была передана на рассмотрение [COLOR=#c42727]Заместителю Главного Администратора по ГОС/ОПГ[/COLOR] [/FONT] <br><br>" +
        '[FONT=georgia]Ожидайте его ответа.[/FONT]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'Передано Основному ЗГА',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Ваша жалоба была передана на рассмотрение [COLOR=#ed0c0c]Основному Заместителю Главного Администратора[/COLOR] [/FONT] <br><br>" +
        '[FONT=georgia]Ожидайте его ответа.[/FONT]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'Передано ГА',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Ваша жалоба была передана на рассмотрение [COLOR=#ff1a1a]Главному Администратору[/COLOR] [/FONT] <br><br>" +
        '[FONT=georgia]Ожидайте его ответа.[/FONT]',
      prefix: GA_PREFIX,
	  status: true,
         },
    {
      title: 'Передано Спец. администрации',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Ваша жалоба была передана на рассмотрение [COLOR=#eb2828]Специальной Администрации[/COLOR] [/FONT] <br><br>" +
        '[FONT=georgia]Ожидайте ответа.[/FONT]',
      prefix: SPECY_PREFIX,
	  status: true,
    },
    {
      title: 'Передано руководителю модеров',
      content:
		'[FONT=georgia]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT] <br><br>' +
        "[FONT=georgia]Ваша жалоба была передана на рассмотрение [Color=#1E90FF]Руководителю Модерации Дискорда[/COLOR] [/FONT] <br><br>" +
        '[FONT=georgia]Ожидайте его ответа.[/FONT]',
      prefix: PIN_PREFIX,
	  status: true,
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