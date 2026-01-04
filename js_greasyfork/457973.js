// ==UserScript==
// @name         Скрипт для форума (био)
// @namespace    https://forum.blackrussia.online
// @version      2.4
// @author       B. Kalashnikov
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @description Для РП био
// @license MIT
// @icon https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png
// @downloadURL https://update.greasyfork.org/scripts/457973/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%28%D0%B1%D0%B8%D0%BE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/457973/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%28%D0%B1%D0%B8%D0%BE%29.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const buttons = [
	{
	  title: 'Биография одобрена',
      content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][COLOR=#d1d5d8][B][COLOR=#d1d5d8]Ваша RolePlay биография была проверена и получает статус [/COLOR][/B][/COLOR]<br><br>' +
'[COLOR=rgb(65, 168, 95)][B][SIZE=6]Одобрено[/SIZE][/B][/COLOR]<br><br>' +


'[COLOR=#d1d5d8][B][COLOR=#d1d5d8]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +
'[/CENTER]',
     },
     {
	  title: 'Орф и пунктуац ошибки',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][COLOR=#d1d5d8][B][COLOR=#d1d5d8]Ваша RolePlay биография была проверена и получает статус [/COLOR][/B][/COLOR]<br><br>' +
'[COLOR=rgb(184, 49, 47)][B][SIZE=6]Отказано[/SIZE][/B][/COLOR]<br><br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL=https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3500136/][B]*тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL=https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1570/]жалоб на администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина: Орфографические и пунктуационные ошибки [/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][COLOR=#d1d5d8]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
         },
     {
	  title: 'Доработайте',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +

'[CENTER][COLOR=#d1d5d8][B][COLOR=#d1d5d8]Ваша RolePlay биография была проверена и получает статус [/COLOR][/B][/COLOR]<br><br>' +
'[COLOR=rgb(250, 197, 28)][B][SIZE=6]На доработке[/SIZE][/B][/COLOR]<br><br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL=https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3500136/'][B]*тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL='https:https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1570/]жалоб на администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина: [/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][COLOR=#d1d5d8]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
           },
     {
	  title: 'Био от 1-го лица',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][COLOR=#d1d5d8][B][COLOR=#d1d5d8]Ваша RolePlay биография была проверена и получает статус [/COLOR][/B][/COLOR]<br><br>' +
'[COLOR=rgb(184, 49, 47)][B][SIZE=6]Отказано[/SIZE][/B][/COLOR]<br><br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL=https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3500136/][B]*тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL=https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1570/]жалоб на администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина: Биография от 1-го лица [/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][COLOR=#d1d5d8]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
         },
     {
	  title: 'Дата рождения некорректна',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][COLOR=#d1d5d8][B][COLOR=#d1d5d8]Ваша RolePlay биография была проверена и получает статус [/COLOR][/B][/COLOR]<br><br>' +
'[COLOR=rgb(184, 49, 47)][B][SIZE=6]Отказано[/SIZE][/B][/COLOR]<br><br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL=https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3500136/][B]*тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL=https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1570/]жалоб на администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина: Дата рождения некорректна [/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][COLOR=#d1d5d8]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
         },
     {
	  title: 'Информация не соответствует времени',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][COLOR=#d1d5d8][B][COLOR=#d1d5d8]Ваша RolePlay биография была проверена и получает статус [/COLOR][/B][/COLOR]<br><br>' +
'[COLOR=rgb(184, 49, 47)][B][SIZE=6]Отказано[/SIZE][/B][/COLOR]<br><br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL=https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3500136/][B]*тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL=https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1570/]жалоб на администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина: Информация в пунктах не соответствует временным рамкам [/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][COLOR=#d1d5d8]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
     },
     {
	  title: 'Возраст не совпал',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][COLOR=#d1d5d8][B][COLOR=#d1d5d8]Ваша RolePlay биография была проверена и получает статус [/COLOR][/B][/COLOR]<br><br>' +
'[COLOR=rgb(184, 49, 47)][B][SIZE=6]Отказано[/SIZE][/B][/COLOR]<br><br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL=https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3500136/][B]*тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL=https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1570/]жалоб на администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина: Возраст не совпадает с датой рождения [/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][COLOR=#d1d5d8]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
 },
     {
	  title: 'Слишком молод',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][COLOR=#d1d5d8][B][COLOR=#d1d5d8]Ваша RolePlay биография была проверена и получает статус [/COLOR][/B][/COLOR]<br><br>' +
'[COLOR=rgb(184, 49, 47)][B][SIZE=6]Отказано[/SIZE][/B][/COLOR]<br><br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL=https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3500136/][B]*тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL=https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1570/]жалоб на администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина: Некорректен возраст (слишком молод) [/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][COLOR=#d1d5d8]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
          },
     {
	  title: 'Биография скопирована',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][COLOR=#d1d5d8][B][COLOR=#d1d5d8]Ваша RolePlay биография была проверена и получает статус [/COLOR][/B][/COLOR]<br><br>' +
'[COLOR=rgb(184, 49, 47)][B][SIZE=6]Отказано[/SIZE][/B][/COLOR]<br><br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL=https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3500136/][B]*тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL=https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1570/]жалоб на администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина: Биография скопирована [/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][COLOR=#d1d5d8]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
          },
     {
	  title: 'Недостаточно РП информации',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][COLOR=#d1d5d8][B][COLOR=#d1d5d8]Ваша RolePlay биография была проверена и получает статус [/COLOR][/B][/COLOR]<br><br>' +
'[COLOR=rgb(184, 49, 47)][B][SIZE=6]Отказано[/SIZE][/B][/COLOR]<br><br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL=https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3500136/][B]*тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL=https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1570/]жалоб на администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина: Недостаточно РП информации [/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][COLOR=#d1d5d8]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
          },
     {
	  title: 'Не по форме',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][COLOR=#d1d5d8][B][COLOR=#d1d5d8]Ваша RolePlay биография была проверена и получает статус [/COLOR][/B][/COLOR]<br><br>' +
'[COLOR=rgb(184, 49, 47)][B][SIZE=6]Отказано[/SIZE][/B][/COLOR]<br><br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL=https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3500136/][B]*тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL=https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1570/]жалоб на администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина: Биография не по форме [/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][COLOR=#d1d5d8]Приятной игры![/COLOR][/B][/COLOR] <br><br>' +

'[/CENTER]',
           },
     {
	  title: 'Некоррект национальность',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][COLOR=#d1d5d8][B][COLOR=#d1d5d8]Ваша RolePlay биография была проверена и получает статус [/COLOR][/B][/COLOR]<br><br>' +
'[COLOR=rgb(184, 49, 47)][B][SIZE=6]Отказано[/SIZE][/B][/COLOR]<br><br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL=https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3500136/][B]*тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL=https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1570/]жалоб на администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина: Некорректная национальность [/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][COLOR=#d1d5d8]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
         },
     {
      title: 'Название не по форме',
	  content:
'[CENTER][B][FONT=courier new][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][COLOR=#d1d5d8][B][COLOR=#d1d5d8]Ваша RolePlay биография была проверена и получает статус [/COLOR][/B][/COLOR]<br><br>' +
'[COLOR=rgb(184, 49, 47)][B][SIZE=6]Отказано[/SIZE][/B][/COLOR]<br><br>' +

"[COLOR=rgb(163, 143, 132)][B]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL=https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.3500136/][B]*тут*[/B][/URL].<br><br>" +

"[B]При несогласии просьба обратиться в раздел *[URL=https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1570/]жалоб на администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=rgb(250, 197, 28)][B]Причина: Название темы не по форме [/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][COLOR=#d1d5d8]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
	},
];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрение', 'pin');
	addButton('Одобрено', 'accepted');
	addButton('Отказано', 'unaccept');
	addButton('Выбрать💥', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));

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