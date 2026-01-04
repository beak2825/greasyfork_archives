// ==UserScript==
// @name         Для форума
// @namespace    https://forum.blackrussia.online
// @version      0.1
// @description  Скрипт для форума
// @author       Teddy Golden
// @match        https://forum.blackrussia.online/index.php?threads/*
// @icon         https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license    MIT
// @icon data: https://vk.com/sticker/1-74419-256b
// @downloadURL https://update.greasyfork.org/scripts/458650/%D0%94%D0%BB%D1%8F%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/458650/%D0%94%D0%BB%D1%8F%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0.meta.js
// ==/UserScript==

(function() {
   'use strict';
const UNACCСEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCСEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PINN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const PIN_PREFIX = 2; //  префикс закрепить
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
const NARASSMOTRENIIORG_PREFIX = 2;
const buttons = [
{
    title: 'Приветствие',
      content: '[FONT=Courier New][CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER][/SIZE][/FONT]<br>' + '[CENTER][FONT=times new roman][SIZE=4]  [/CENTER][/SIZE][/FONT]<br>',
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴передача ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'ГА',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Ваша жалоба передана - Главному администратору.[/CENTER][/SIZE][/FONT]<br> " +
		'[CENTER][FONT=times new roman][SIZE=4]На рассмотрении.[/CENTER][/SIZE][/FONT]<br>',
      prefix: GA_PREFIX,
	  status: true,
        },
    {
      title: 'Спецам',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Ваша жалоба передана - Специальному Администратору.[/CENTER][/SIZE][/FONT]<br> " +
		'[CENTER][FONT=times new roman][SIZE=4]На рассмотрении.[/CENTER][/SIZE][/FONT]<br>',
      prefix: SPECY_PREFIX,
	  status: true,
        },
     {
      title: 'обж передано ГА',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Ваше обжалование передано ГА.[/CENTER][/SIZE][/FONT]<br>" +
		'[CENTER][FONT=times new roman][SIZE=4]На расмотрении[/CENTER][/SIZE][/FONT]<br>',
      prefix: GA_PREFIX,
	  status: true,
        },
    {
      title: 'обж передано Спецам',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Ваше обжалование передано - Специальному Администратору.[/CENTER][/SIZE][/FONT]<br> " +
		'[CENTER][FONT=times new roman][SIZE=4]На рассмотрении.[/CENTER][/SIZE][/FONT]<br>',
      prefix: SPECY_PREFIX,
	  status: true,
        },
     {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Жалобы на АДМ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'На рассмотрении',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
       '[CENTER][FONT=times new roman][SIZE=4]Ваша жалоба взята на рассмотрение, не нужно создавать копии данной жалобы.[/CENTER][/SIZE][/FONT]<br>',
      prefix: NARASSMOTRENIIORG_PREFIX,
	  status: true,
    },
    {
      title: 'Не по форме',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Ваша жалоба составлена не по форме, изучите правила подачи жалобы.[/CENTER][/SIZE][/FONT]<br>" +
        "[CENTER][FONT=times new roman][SIZE=4]Ознакомиться с правилами подачи жалоб можно тут:https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1814871/[/CENTER][/SIZE][/FONT]<br>" +
		'[CENTER][FONT=times new roman][SIZE=4]Закрыто[/CENTER][/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'проведена беседа + снято наказание',
      content:
		'[FONT=times new roman][CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
        "[CENTER][FONT=times new roman][SIZE=4]С администратором будет проведена беседа, ваше наказание будет снято.[/CENTER][/SIZE][/FONT]<br>" +
		'[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'получит наказание+снято наказание',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Наказание будет снято, Администратор получит наказание.[/CENTER][/SIZE][/FONT]<br>" +
		'[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
     {
      title: 'фотошоп',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
         "[CENTER][FONT=times new roman][SIZE=4]Ваши доказательства были подвергнуты изменениям (редактированию),а именно фотошопу.[/CENTER][/SIZE][/FONT]<br>" +
         '[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
	  status: false,
         },
    {
      title: 'выдано верно',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
         "[CENTER][FONT=times new roman][SIZE=4]Наказание выдано верно.[/CENTER][/SIZE][/FONT]<br>" +
         '[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
	  status: false,
         },
    {
      title: 'нет доказательств',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
         "[CENTER][FONT=times new roman][SIZE=4]Отстутствуют доказательства нарушения от Администратора.[/CENTER][/SIZE][/FONT]<br>" +
         '[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
	  status: false,
         },
    {
      title: 'Скрин отредачен',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
         "[CENTER][FONT=times new roman][SIZE=4]Ваш скриншот отредактирован.[/CENTER][/SIZE][/FONT]<br>" +
         '[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
	  status: false,
         },
    {
      title: 'Наруш правил написания жалоб',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
         "[CENTER][FONT=times new roman][SIZE=4]Ваша жалоба написана с нарушенияими правил подачи жалоб на Администрацию. Ознакомиться с правилами можно тут : https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1814871/[/CENTER][/SIZE][/FONT]<br>" +
         '[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
	  status: false,
         },
    {
      title: '3-е лицо',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
         "[CENTER][FONT=times new roman][SIZE=4]Ваша жалоба написана от 3-го лица.[/CENTER][/SIZE][/FONT]<br>" +
         '[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
	  status: false,
         },
    {
      title: 'Копия тем',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
         "[CENTER][FONT=times new roman][SIZE=4]Вам уже ранее был дан корректный ответ, за создание дубликатов этой темы ваш форумный аккаунт может быть заблокирован.[/CENTER][/SIZE][/FONT]<br>" +
         '[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
	  status: false,
         },
    {
      title: 'Прошло 48ч',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
         "[CENTER][FONT=times new roman][SIZE=4]Прошло более 48 - часов после выдачи наказания.[/CENTER][/SIZE][/FONT]<br>" +
         '[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
	  status: false,
         },
    {
      title: 'Недостаточно док',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
         "[CENTER][FONT=times new roman][SIZE=4]Недостаточно доказательств на нарушение Администратора.[/CENTER][/SIZE][/FONT]<br>" +
         '[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
	  status: false,
         },
    {
      title: 'Нету /time',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
         "[CENTER][FONT=times new roman][SIZE=4]Нету /time[/CENTER][/SIZE][/FONT]<br>" +
         '[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
	  status: false,
         },
    {
      title: 'Блокировка перевыдана',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
         "[CENTER][FONT=times new roman][SIZE=4]Блокировка была перевыдана.[/CENTER][/SIZE][/FONT]<br>" +
         '[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
	  status: false,
         },
    {
      title: 'ссылка не кликабельна',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
         "[CENTER][FONT=times new roman][SIZE=4]Ваша ссылка не кликабельная.[/CENTER][/SIZE][/FONT]<br>" +
         '[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
	  status: false,
         },
    {
      title: 'Док в соц сети',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
         "[CENTER][FONT=times new roman][SIZE=4]Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER][/SIZE][/FONT]<br>" +
         '[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
	  status: false,
         },
    {
      title: 'Обращение спецам',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
         "[CENTER][FONT=times new roman][SIZE=4]Специальная администрация не проверяет подобные обращения, вы их можете выразить в официальной группе - https://vk.com/sa.sanderkligan , или же на форуме в разделе улучшений - https://forum.blackrussia.online/index.php?categories/Предложения-по-улучшению.656/ .[/CENTER][/SIZE][/FONT]<br>" +
         '[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
	  status: false,
         },
    {
      title: 'блок была выдана ранее',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
         "[CENTER][FONT=times new roman][SIZE=4]Блокировка была выдана ранее.[/CENTER][/SIZE][/FONT]<br>" +
         '[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
	  status: false,
         },
    {
      title: 'спс за инф',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
         "[CENTER][FONT=times new roman][SIZE=4]Спасибо за информацию.[/CENTER][/SIZE][/FONT]<br>" +
         '[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
	  status: false,
         },
    {
      title: 'наруш от адм нету',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
         "[CENTER][FONT=times new roman][SIZE=4]Нарушения от Администратора не найдены.[/CENTER][/SIZE][/FONT]<br>" +
         '[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
	  status: false,
        },
{
      title: 'в обж иди',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Советую обратиться в : Обжалование наказаний.[/CENTER][/SIZE][/FONT]<br>" +
		'[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
{
      title: 'в обж иди',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Советую обратиться в : Обжалование наказаний.[/CENTER][/SIZE][/FONT]<br>" +
		'[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
      {
      title: 'Обратитесь в : Технический раздел',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Обратитесь в : Технический раздел[/CENTER][/SIZE][/FONT]<br>" +
		'[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'в Жалобы на теха',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Обратитесь в : Жалобы на технических специалистов[/CENTER][/SIZE][/FONT]<br>" +
		'[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
{
      title: 'в обж иди',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Советую обратиться в : Обжалование наказаний.[/CENTER][/SIZE][/FONT]<br>" +
		'[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'наказ не актуально',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Данное наказание не актуально.[/CENTER][/SIZE][/FONT]<br>" +
		'[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
	  status: false,
    },{
      title: 'блокировка перевыдана',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Блокировка перевыдана.[/CENTER][/SIZE][/FONT]<br>" +
		'[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
    title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ОБЖ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
      {
          title: 'В обжаловании отказано.',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
        "[CENTER][FONT=times new roman][SIZE=4]В обжаловании отказано.[/CENTER][/SIZE][/FONT]<br>" +
		'[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Руководителю Модерации',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Передаю Ваше обжалование Руководителю Модерации Discord @sakaro[/CENTER][/SIZE][/FONT]<br>" +
		'[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix:  NARASSMOTRENIIORG_PREFIX,
	  status: true,
    },
    {
      title: 'в Жалобы на теха',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Обратитесь в : Жалобы на технических специалистов[/CENTER][/SIZE][/FONT]<br>" +
		'[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Одобрено обж',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Ваше обжалование было рассмотрено и принято решение о сокращении вашего наказания до минимальных мер.[/CENTER][/SIZE][/FONT]<br>" +
		'[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не по форме',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Ваше обжалование составлено не по форме.[/CENTER][/SIZE][/FONT]<br>" +
		'[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'не согласны с решением Администратора',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Обратитесь в :Жалобы на администрацию , если не согласны с решением Администратора.[/CENTER][/SIZE][/FONT]<br>" +
		'[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Обратитесь в : Технический раздел',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Обратитесь в : Технический раздел[/CENTER][/SIZE][/FONT]<br>" +
		'[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Нет окна блокировки',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Без окна о блокировке тема не подлежит рассмотрению - создайте новую тему, приложив окно блокировки с фото-хостинга [URL='https://yapx.ru/']yapx.ru[/URL], [URL='https://imgur.com/']imgur.com[/URL], [URL='https://www.youtube.com/']youtube.com[/URL],[URL='https://imgbb.com']ImgBB.com[/URL](все кликабетильно).[/CENTER][/SIZE][/FONT]<br>" +
		'[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
     {
      title: 'Ответ был дан в прошлом обжаловании.',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
        "[CENTER][FONT=times new roman][SIZE=4][SIZE=4][FONT=times new roman] Ответ был дан в прошлом обжаловании.[/CENTER][/SIZE][/FONT]<br>" +
		'[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
 {
        title: 'Дубль тема',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
        "[CENTER][FONT=times new roman][SIZE=4][SIZE=4][FONT=times new roman]Дубль тема.[/CENTER][/SIZE][/FONT]<br>" +
		'[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
        title: 'Данное наказ не обж',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
        "[CENTER][FONT=times new roman][SIZE=4][SIZE=4][FONT=times new roman]Данное наказание не обжалуется.[/CENTER][/SIZE][/FONT]<br>" +
		'[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
        title: 'обжалование нрп обмана',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
        "[CENTER][FONT=times new roman][SIZE=4][SIZE=4][FONT=times new roman]У вас есть 24ч на поиск игрока с помощью твинк аккаунта, чтобы договорится об возварте имущества. Фрапс договора прикрепите в данную тему.[/CENTER][/SIZE][/FONT]<br>" +
		'[CENTER][FONT=times new roman][SIZE=4]На рассмотрении.[/CENTER][/SIZE][/FONT]<br>',
      prefix: NARASSMOTRENIIORG_PREFIX,
	  status: true,
    },
    {
        title: 'нарушение правил напис обж',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
        "[CENTER][FONT=times new roman][SIZE=4][SIZE=4][FONT=times new roman]Ваша тема написана с нарушениями правилами подачи заявки на обжалование наказания. Ознакомиться с правилами можно тут: https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/ [/CENTER][/SIZE][/FONT]<br>" +
		'[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'наказ не актуально',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Данное наказание не актуально.[/CENTER][/SIZE][/FONT]<br>" +
		'[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
{
      title: 'юзани vpn',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Используйте VPN для смены ip адреса.[/CENTER][/SIZE][/FONT]<br>" +
		'[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
	  status: false,
    },{
      title: 'обж ппв',
      content:
		'[CENTER][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/CENTER][/SIZE][/FONT]<br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Если у вас присутствую все 3 привязки, или хотя бы 1!Тогда стоит полноценно изменить свой пароль, после чего написать повторное обжалование.В случае отсутствия привязанных услуг, обжалование будет отказано.[/CENTER][/SIZE][/FONT]<br>" +
		'[CENTER][FONT=times new roman][SIZE=4]Закрыто.[/CENTER][/SIZE][/FONT]<br>',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    ];

$(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('Ответы', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, true));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, true));
    $('button#Texy').click(() => editThreadData(TEXY_PREFIX, true));

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
	4 < hours && hours <= 11
	  ? 'Здравствуйте'
	  : 11 < hours && hours <= 15
	  ? 'Здравствуйте'
	  : 15 < hours && hours <= 21
	  ? 'Здравствуйте'
	  : 'Здравствуйте',
};

  }

    function editThreadData(prefix, pin = false) {
// Получаем заголовок темы, так как он необходим при запросе
	const threadTitle = $('.p-title-value')[0].lastChild.textContent

	if(pin == true){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
              discussion_open: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	} else {
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
               discussion_open: 1,
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
	      discussion_open: 1,
	target_node_id: type,
	FireBrickirect_type: 'none',
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