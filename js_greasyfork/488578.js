// ==UserScript==
// @name         Админ скрипт для Администрации 14-го сервера
// @namespace    https://forum.matrp.ru
// @version      3.7
// @description  Скрипт для Администрации 14го сервера
// @author       Franklyn_Paradox | Шамиль Капуров.
// @match        https://forum.matrp.ru/index.php?threads/*
// @include      https://forum.matrp.ru/index.php?threads/
// @grant        none
// @license 	 MIT
// @collaborator paradox
// @icon https://i.postimg.cc/nVXG498S/image.png
// @downloadURL https://update.greasyfork.org/scripts/488578/%D0%90%D0%B4%D0%BC%D0%B8%D0%BD%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%90%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D0%B8%2014-%D0%B3%D0%BE%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/488578/%D0%90%D0%B4%D0%BC%D0%B8%D0%BD%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%90%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D0%B8%2014-%D0%B3%D0%BE%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCEPT_PREFIX = 5; // Префикс Отказано. prefix: UNACCEPT_PREFIX 
const ACCEPT_PREFIX = 9; // Префикс Одобрено. prefix: ACCEPT_PREFIX 
const RESHENO_PREFIX = 4; // Префикс Решено. prefix: RESHENO_PREFIX 
const PIN_PREFIX = 2; // Префикс Закреплено. prefix: PIN_PREFIX 
const COMMAND_PREFIX = 25; // Префикс Передано Руководству. prefix: COMMAND_PREFIX 
const CLOSE_PREFIX = 8; // Префикс Закрыто. prefix: CLOSE_PREFIX 
const CHECK_PREFIX = 10; // Префикс На рассмотрении. prefix: CHECK_PREFIX
const OPEN_PREFIX = 7; // Префикс Открыто. prefix: OPEN_PREFIX 
const INFO_PREFIX = 3; //Префикс Информация. prefix: INFO_PREFIX 
const buttons = [
	{
	  title: 'MAIN | Свой ответ',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br><br>" +
"ТЕКСТ.<br><br>" +
'Приятной игры на 14-м сервере!',
    },
    {
	  title: 'MAIN | Отчет следящего семей',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"[COLOR=rgb(61, 142, 185)][FONT=courier new][B]1[/B][/FONT][/COLOR][FONT=courier new][B]. Ваш ник: [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]NickName[/B][/FONT][/COLOR][FONT=courier new][/FONT]<br>" +
"[COLOR=rgb(61, 142, 185)][FONT=courier new][B]2[/B][/FONT][/COLOR][FONT=courier new][B]. Доказательства слежки:<br>" +
"Первый БизВар:<br>" +
"Второй БизВар:<br>" +
"Третий БизВар:<br>" +
'[COLOR=rgb(61, 142, 185)][FONT=courier new][B]3[/B][/FONT][/COLOR][FONT=courier new][B]. Дата отчета: [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]хх[/B][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]хх[/B][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]2024[/B][/FONT][COLOR=rgb(255, 255, 255)][FONT=courier new][B].[/B][/FONT][/COLOR][/COLOR]',
    },
    {
	  title: 'MAIN | Отчет Следящих за Гетто',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"[COLOR=rgb(61, 142, 185)][FONT=courier new][B]1[/B][/FONT][/COLOR][FONT=courier new][B]. Ваш ник: [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]NickName[/B][/FONT][/COLOR][FONT=courier new][/FONT]<br>" +
"[COLOR=rgb(61, 142, 185)][FONT=courier new][B]2[/B][/FONT][/COLOR][FONT=courier new][B]. Организация за которой следите:<br>" +
"[COLOR=rgb(61, 142, 185)][FONT=courier new][B]3[/B][/FONT][/COLOR][FONT=courier new][B]. Выполненная работа по пунктам:<br>" +
"[COLOR=rgb(61, 142, 185)][FONT=courier new][B]4[/B][/FONT][/COLOR][FONT=courier new][B]. Доказательства выполненной работы:<br>" +
'',
    },
    {
	  title: 'MAIN | Отчет Старших Следящих за Гетто',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"[COLOR=rgb(61, 142, 185)][FONT=courier new][B]1[/B][/FONT][/COLOR][FONT=courier new][B]. Ваш ник: [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]NickName[/B][/FONT][/COLOR][FONT=courier new][/FONT]<br>" +
"[COLOR=rgb(61, 142, 185)][FONT=courier new][B]2[/B][/FONT][/COLOR][FONT=courier new][B]. Организация за которой следите:<br>" +
"[COLOR=rgb(61, 142, 185)][FONT=courier new][B]3[/B][/FONT][/COLOR][FONT=courier new][B]. Выполненная работа по пунктам:<br>" +
"[COLOR=rgb(61, 142, 185)][FONT=courier new][B]4[/B][/FONT][/COLOR][FONT=courier new][B]. Доказательства выполненной работы:<br>" +
'',
    },
    {
	  title: 'MAIN | Отчет следящих за ГОСС',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"[COLOR=rgb(61, 142, 185)][FONT=courier new][B]1[/B][/FONT][/COLOR][FONT=courier new][B]. Ваш ник: [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]NickName[/B][/FONT][/COLOR][FONT=courier new][/FONT]<br>" +
"[COLOR=rgb(61, 142, 185)][FONT=courier new][B]2[/B][/FONT][/COLOR][FONT=courier new][B]. Организация за которой вы следите:<br>" +
"[COLOR=rgb(61, 142, 185)][FONT=courier new][B]3[/B][/FONT][/COLOR][FONT=courier new][B]. Дата отчёта:<br>" +
"[COLOR=rgb(61, 142, 185)][FONT=courier new][B]4[/B][/FONT][/COLOR][FONT=courier new][B]. Выполненная работа по пунктам:<br>" +
"[COLOR=rgb(61, 142, 185)][FONT=courier new][B]5[/B][/FONT][/COLOR][FONT=courier new][B]. Доказательства проделанной работы (Со скриншотами):<br>" +
'',
    },
    {
	  title: 'MAIN | Отчет Старших Следящих за ГОСС',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"[COLOR=rgb(61, 142, 185)][FONT=courier new][/FONT][/COLOR][FONT=courier new][B]Ваш ник: [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]NickName[/B][/FONT][/COLOR][FONT=courier new][/FONT]<br>" +
"[COLOR=rgb(61, 142, 185)][FONT=courier new][/FONT][/COLOR][FONT=courier new][B]Ваша должность: <br>" +
"[COLOR=rgb(61, 142, 185)][FONT=courier new][/FONT][/COLOR][FONT=courier new][B]Доказательство проделанной работы: <br>" +
"[COLOR=rgb(61, 142, 185)][FONT=courier new][/FONT][/COLOR][FONT=courier new][B]1. Проверка финда всех фракций которых Вы курируете: <br>" +
"[COLOR=rgb(61, 142, 185)][FONT=courier new][/FONT][/COLOR][FONT=courier new][B]2. Проверка жалоб на госс сотрудников (2-3 ссылки): <br>" +
"[COLOR=rgb(61, 142, 185)][FONT=courier new][/FONT][/COLOR][FONT=courier new][B]3. Работа с лидером / заместителем (скриншоты с VK): <br>" +
"[COLOR=rgb(61, 142, 185)][FONT=courier new][/FONT][/COLOR][FONT=courier new][B]4. Проверка на non Rp Ники фракций: <br>" +
"[COLOR=rgb(61, 142, 185)][FONT=courier new][/FONT][/COLOR][FONT=courier new][B]5. Участие на обзвонах: <br>" +
"[COLOR=rgb(61, 142, 185)][FONT=courier new][/FONT][/COLOR][FONT=courier new][B]6. Слежка за заместителем / лидером: <br>" +
"[COLOR=rgb(61, 142, 185)][FONT=courier new][/FONT][/COLOR][FONT=courier new][B]7. Проверка спец рации на пиар / флуд / капс: <br>" +
"[COLOR=rgb(61, 142, 185)][FONT=courier new][/FONT][/COLOR][FONT=courier new][B]8. Слежка за собеседованием: <br>" +
"[COLOR=rgb(61, 142, 185)][FONT=courier new][/FONT][/COLOR][FONT=courier new][B]1. <br>" +
"[COLOR=rgb(61, 142, 185)][FONT=courier new][/FONT][/COLOR][FONT=courier new][B]2. <br>" +
"[COLOR=rgb(61, 142, 185)][FONT=courier new][/FONT][/COLOR][FONT=courier new][B]9. Слежка за составом организации: <br>" +
'',
    },
    {
	  title: 'MAIN | Отчет о пиаре заявлений',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"[COLOR=rgb(61, 142, 185)][FONT=courier new][B]1[/B][/FONT][/COLOR][FONT=courier new][B]. Ваш ник: [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]NickName[/B][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br>" +
"[COLOR=rgb(61, 142, 185)][FONT=courier new][B]2[/B][/FONT][/COLOR][FONT=courier new][B]. Должность: [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]Должность[/B][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br>" +
'[COLOR=rgb(61, 142, 185)][FONT=courier new][B]3[/B][/FONT][/COLOR][FONT=courier new][B]. Доказательства: [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]LINK[/B][/FONT][/COLOR]',
    },
    {
	  title: 'MAIN | Отчет о рекламе саппов',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"[COLOR=rgb(61, 142, 185)][FONT=courier new][B]1[/B][/FONT][/COLOR][FONT=courier new][B]. Ваш ник: [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]NickName[/B][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br>" +
"[COLOR=rgb(61, 142, 185)][FONT=courier new][B]2[/B][/FONT][/COLOR][FONT=courier new][B]. Должность: [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]Должность[/B][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br>" +
"[COLOR=rgb(61, 142, 185)][FONT=courier new][B]3[/B][/FONT][/COLOR][FONT=courier new][B]. На какой пост?: [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]Пост Игрового Помощника[/B][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br>" +
'[COLOR=rgb(61, 142, 185)][FONT=courier new][B]4[/B][/FONT][/COLOR][FONT=courier new][B]. Доказательства: [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]LINK[/B][/FONT][/COLOR]',
    },
    {
	  title: 'ГА ЗГА Жалобы | Ответ админа выше, выдано верно.',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Ответ от администратора, выше.<br><br>" +
"Наказание выдано - верно.<br>" +
"Не нарушайте правила проекта.<br>" +
"Доказательства вашего нарушения: ТЫК<br>" +
"Администрация не вмешивается в подобные процессы.<br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Закрыто[/B][/FONT][/COLOR][FONT=courier new][B].<br><br>" +
'Благодарим за написанную жалобу, приятной игры на сервере! [/CENTER]',
    },
    {
	  title: '===========================Все следующие кнопки отправляют текст сразу==============================',
    },
    {
	  title: 'ГА ЗГА Жалобы | Одобрено',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Администратор не прав и понесет наказание, а вы получите компенсацию.<br><br>" +
'Благодарим за написанную жалобу, приятной игры на сервере! [/CENTER]',
    },
    {
	  title: 'ГА ЗГА Жалобы | Ответ был дан',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Ответ получили в прошлой вашей теме.<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Закрыто[/B][/FONT][/COLOR][FONT=courier new][B].<br><br>" +
'Благодарим за написанную жалобу, приятной игры на сервере! [/CENTER]',
    },
    {
	  title: 'ГА ЗГА Жалобы | Запросил док-ва',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Запросил доказательства у администратора.<br><br>" +
"Ожидайте ответа в данной теме, в течении 24-х часов.<br><br>" +
'Благодарим за написанную жалобу, приятной игры на сервере! [/CENTER]',
    },
    {
	  title: 'ГА ЗГА Жалобы | Ссылку на БИО',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Предоставьте ссылку на биографию.<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Закрыто[/B][/FONT][/COLOR][FONT=courier new][B].<br><br>" +
'Благодарим за написанную жалобу, приятной игры на сервере! [/CENTER]',
    },
    {
	  title: 'ГА ЗГА Жалобы | Ссылку на ЖБ',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Предоставьте ссылку на жалобу.<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Закрыто[/B][/FONT][/COLOR][FONT=courier new][B].<br><br>" +
'Благодарим за написанную жалобу, приятной игры на сервере! [/CENTER]',
    },
    {
	  title: 'ГА ЗГА Жалобы | Предоставьте доква',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Предоставьте доказательства выдачи наказания.<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Закрыто[/B][/FONT][/COLOR][FONT=courier new][B].<br><br>" +
'Благодарим за написанную жалобу, приятной игры на сервере! [/CENTER]',
    },
    {
	  title: 'ГА ЗГА Жалобы | Рассмотрено верно',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Рассмотрена - [COLOR=rgb(80, 200, 100)][FONT=courier new][B]верно[/B][/FONT][/COLOR][FONT=courier new][B].<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Закрыто[/B][/FONT][/COLOR][FONT=courier new][B].<br><br>" +
'Благодарим за написанную жалобу, приятной игры на сервере! [/CENTER]',
    },
    {
	  title: 'ГА ЗГА Жалобы | Передам руководству',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Передам вашу жалобу руководству.<br><br>" +
'Благодарим за написанную жалобу, приятной игры на сервере! [/CENTER]',
    },
    {
	  title: '=======================================================================================================',
    },
    {
	  title: 'ЖБ | Одобрено',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Жалоба [/B][/FONT][COLOR=rgb(26, 188, 156)][FONT=courier new][B]одобрена[/B][/FONT][/COLOR][FONT=courier new][B], игрок будет наказан.[/B][/FONT]<br><br>" +
"[COLOR=rgb(26, 188, 156)][FONT=courier new][B]Одобрено[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
'Благодарим за написанную жалобу, приятной игры на сервере! [/CENTER]',
    },
    {
	  title: 'ЖБ | Передано ГА | ЗГА',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Жалоба [/B][/FONT][COLOR=rgb(250, 197, 28)][FONT=courier new][B]передана ГА | ЗГА[/B][/FONT][/COLOR][FONT=courier new][B], ожидайте ответа, не дублируйте тему что бы не получить блокировку форумного аккаунта.[/B][/FONT]<br><br>" +
'Благодарим за написанную жалобу, приятной игры на сервере! [/CENTER]',
    },
    {
	  title: 'ЖБ | Заголовок не по форме',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Заголовок темы составлен не по форме.<br>" +
"Ознакомьтесь с правилами подачи жалоб - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-жалобы.66297/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
'Благодарим за написанную жалобу, приятной игры на сервере! [/CENTER]',
    },
    {
	  title: 'ЖБ | Нет даты времени на доках',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"На ваших доказательствах отсутствуют время или дата.<br>" +
"Ознакомьтесь с правилами подачи жалоб - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-жалобы.66297/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
'Благодарим за написанную жалобу, приятной игры на сервере! [/CENTER]',
    },
    {
	  title: 'ЖБ | Недостаточно доков',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Доказательств недостаточно для выдачи наказания.<br>" +
"Ознакомьтесь с правилами подачи жалоб - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-жалобы.66297/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
'Благодарим за написанную жалобу, приятной игры на сервере! [/CENTER]',
    },
    {
	  title: 'ЖБ | Жалоба от третьего лица',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Жалоба написана от третьего лица.<br>" +
"Ознакомьтесь с правилами подачи жалоб - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-жалобы.66297/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
'Благодарим за написанную жалобу, приятной игры на сервере! [/CENTER]',
    },
    {
	  title: 'ЖБ | Фрапс 2+ без тайм кодов',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"В доказательствах фрапс более 2-х минут, отсутствуют тайм-коды.<br>" +
"Ознакомьтесь с правилами подачи жалоб - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-жалобы.66297/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
'Благодарим за написанную жалобу, приятной игры на сервере! [/CENTER]',
    },
    {
	  title: 'ЖБ | Неадекватное содержание жалобы',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Неадекватное содержание жалобы.<br>" +
"Ознакомьтесь с правилами подачи жалоб - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-жалобы.66297/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
'Благодарим за написанную жалобу, приятной игры на сервере! [/CENTER]',
    },
    {
	  title: 'ЖБ | С момента нарушения прошло 24часа',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"С момента нарушения прошло более 24-х часов.<br>" +
"Ознакомьтесь с правилами подачи жалоб - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-жалобы.66297/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
'Благодарим за написанную жалобу, приятной игры на сервере! [/CENTER]',
    },
    {
	  title: 'ЖБ | Док-ва отредактированы.',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Доказательства содержат в себе момент редактирования.<br>" +
"Ознакомьтесь с правилами подачи жалоб - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-жалобы.66297/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
'Благодарим за написанную жалобу, приятной игры на сервере! [/CENTER]',
    },
    {
	  title: '=======================================================================================================',
    },
    {
	  title: 'ЖБ NONRP | Одобрено за развод',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Игрок будет наказан за развод.<br>" +
"[COLOR=rgb(97, 189, 109)][FONT=courier new][B]Одобрено[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
'Благодарим за написанную жалобу, приятной игры на сервере! [/CENTER]',
    },
    {
	  title: 'ЖБ NONRP | Одобрено за попытку',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Игрок будет наказан за попытку NonRP развода.<br>" +
"[COLOR=rgb(97, 189, 109)][FONT=courier new][B]Одобрено[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
'Благодарим за написанную жалобу, приятной игры на сервере! [/CENTER]',
    },
    {
	  title: 'ЖБ NONRP | Нету договора с игроком.',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Отсутствует договор с игроком.<br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
'Благодарим за написанную жалобу, приятной игры на сервере! [/CENTER]',
    },
    {
	  title: 'ЖБ NONRP | Договор в рп чате.',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"У вас был договор на деньги, но это является RP процессом.<br>" +
"4.42. Запрещены любые виды кредитования (под процент, без процента, в долг), если вы дали в долг, и его вам не вернули, то ответственность за это ложится на вас.<br>" +
"Администрация не вмешивается в подобные процессы.<br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
'Благодарим за написанную жалобу, приятной игры на сервере! [/CENTER]',
    },
    {
	  title: '=======================================================================================================',
    },
    {
	  title: 'РП БИО | Одобрено',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Ваша Role Play биография имеет статус - [/B][/FONT][COLOR=rgb(26, 188, 156)][FONT=courier new][B]одобрено.[/B][/FONT][/COLOR][FONT=courier new][B]Приятной игры[/B][/FONT]<br><br>" +
"[COLOR=rgb(26, 188, 156)][FONT=courier new][B]Одобрено[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
'Благодарим за написанную биографию, приятной игры на сервере! [/CENTER]',
        status: false,
        prefix: ACCEPT_PREFIX
    },
    {
	  title: 'РП БИО | КД Не прошло 2 часа',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"С момента ответа в прошлой РП Биографии не прошло 2 часа.<br>" +
'[QUOTE="Alice_Paradox ♡, post: 2716498, member: 30927"]<br>' +
'[FONT=arial][SIZE=4][B]Интервал между подачей "Отказанной" RP биографии - 2 часа, если биография была отказана и написаны две новые с нарушением интервала - форумный аккаунт блокируется на 2-е суток. [/B][/SIZE][/FONT][/CENTER]' +
'[/QUOTE]<br>' +
"[CENTER]Ознакомьтесь с правилами написания Role Play биографий - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-РП-Биографии.359768/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
'Благодарим за написанную биографию, приятной игры на сервере! [/CENTER]',
        status: false,
        prefix: UNACCEPT_PREFIX
    },
    {
	  title: 'РП БИО | Заголовок не по форме',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Заголовок не соответствует правилам.<br><br>" +
"Ознакомьтесь с правилами написания Role Play биографий - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-РП-Биографии.359768/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
'Благодарим за написанную биографию, приятной игры на сервере! [/CENTER]',
        status: false,
        prefix: UNACCEPT_PREFIX
    },
    {
	  title: 'РП БИО | Худ на фото',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"На Личной Фотографии присутствует худ (/invhud).<br><br>" +
"Ознакомьтесь с правилами написания Role Play биографий - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-РП-Биографии.359768/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
'Благодарим за написанную биографию, приятной игры на сервере! [/CENTER]',
        status: false,
        prefix: UNACCEPT_PREFIX
    },
    {
	  title: 'РП БИО | Дата рождения не по форме',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Формат даты рождения и возраст, не по форме..<br>" +
"Пример: 23 года, дата рождения 19.08.1999.<br><br>" +
"Ознакомьтесь с правилами написания Role Play биографий - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-РП-Биографии.359768/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
'Благодарим за написанную биографию, приятной игры на сервере! [/CENTER]',
        status: false,
        prefix: UNACCEPT_PREFIX
    },
    {
	  title: 'РП БИО | В био инфа реальных людей',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"В биографии присутствует информация из жизни реального человека.<br><br>" +
"Ознакомьтесь с правилами написания Role Play биографий - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-РП-Биографии.359768/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
'Благодарим за написанную биографию, приятной игры на сервере! [/CENTER]',
        status: false,
        prefix: UNACCEPT_PREFIX
    },
    {
	  title: 'РП БИО | Скопирована',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Биография скопирована.<br><br>" +
"Ознакомьтесь с правилами написания Role Play биографий - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-РП-Биографии.359768/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
'Благодарим за написанную биографию, приятной игры на сервере! [/CENTER]',
        status: false,
        prefix: UNACCEPT_PREFIX
    },
    {
	  title: 'РП БИО | Не по шаблону',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Биография написана не по шаблону.<br><br>" +
"Ознакомьтесь с правилами написания Role Play биографий - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-РП-Биографии.359768/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
'Благодарим за написанную биографию, приятной игры на сервере! [/CENTER]',
        status: false,
        prefix: UNACCEPT_PREFIX
    },
    {
	  title: 'РП БИО | Био не от 3го лица',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"В биографии имеется информация от первого лица.<br><br>" +
"Ознакомьтесь с правилами написания Role Play биографий - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-РП-Биографии.359768/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
'Благодарим за написанную биографию, приятной игры на сервере! [/CENTER]',
        status: false,
        prefix: UNACCEPT_PREFIX
    },
    {
	  title: 'РП БИО | 1 пункт на англ',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Первый пункт RP биографии (имя, фамилия) должен быть написан на русском языке.<br><br>" +
"Ознакомьтесь с правилами написания Role Play биографий - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-РП-Биографии.359768/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
'Благодарим за написанную биографию, приятной игры на сервере! [/CENTER]',
        status: false,
        prefix: UNACCEPT_PREFIX
    },
    {
	  title: 'РП БИО | Персонаж не совершеннолетний',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Персонаж должен быть совершеннолетним (18+ лет).<br><br>" +
"Ознакомьтесь с правилами написания Role Play биографий - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-РП-Биографии.359768/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
'Благодарим за написанную биографию, приятной игры на сервере! [/CENTER]',
        status: false,
        prefix: UNACCEPT_PREFIX
    },
    {
	  title: 'РП БИО | Много ошибок',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"В тексте биографии имеется много грамматических - пунктуационных ошибок, воспользуйтесь специализированными сайтами для проверки текста.<br><br>" +
"Ознакомьтесь с правилами написания Role Play биографий - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-РП-Биографии.359768/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
'Благодарим за написанную биографию, приятной игры на сервере! [/CENTER]',
        status: false,
        prefix: UNACCEPT_PREFIX
    },
    {
	  title: 'РП БИО | Мало информации',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new].<br>" +
"Биография содержит мало информации о персонаже.<br><br>" +
"Ознакомьтесь с правилами написания Role Play биографий - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-РП-Биографии.359768/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
'Благодарим за написанную биографию, приятной игры на сервере! [/CENTER]',
        status: false,
        prefix: UNACCEPT_PREFIX
    },
    {
	  title: 'РП БИО | Мало предложений',
      content:
'[CENTER][B][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new].<br>" +
"Биография содержит меньше 5-ти предложений в одном из пунктов (Детство, родители, образование, семья, настоящее время).<br><br>" +
"Ознакомьтесь с правилами написания Role Play биографий - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-РП-Биографии.359768/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
'Благодарим за написанную биографию, приятной игры на сервере! [/CENTER]',
        status: false,
        prefix: UNACCEPT_PREFIX
    },
    {
	  title: 'РП БИО | НРП ник',
      content:
'[CENTER][SIZE=4][FONT=courier new]<br>' +
"Приветствую, уважаемый(-ая) [/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Ваш Nick Name нонРП формата. Смените ник нейм, затем напишите снова биографию.<br><br>" +
"Ознакомьтесь с правилами написания Role Play биографий - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-РП-Биографии.359768/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
'Благодарим за написанную биографию, приятной игры на сервере! [/CENTER]',
        status: false,
        prefix: UNACCEPT_PREFIX
    },
];

$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
		addButton('Ответы by Franklyn_Paradox', 'selectAnswer');


	// Поиск информации о теме
	const threadData = getThreadData();
	$(`button#selectAnswer`).click(() => {
		XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
 buttons.forEach((btn, id) => {
        if (id > 9) {
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

  function pasteContent(id, data = {}, send = false) {
    const template = Handlebars.compile(buttons[id].content);
    if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

    $('span.fr-placeholder').empty();
    $('div.fr-element.fr-view p').append(template(data));
    $('a.overlay-titleCloser').trigger('click');

    if (send == true) {
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