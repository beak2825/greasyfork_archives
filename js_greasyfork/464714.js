// ==UserScript==
// @name         Воронеж (био)
// @namespace    https://forum.blackrussia.online
// @version      2.0
// @author       Lukas_Kuzy
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @description Для РП био
// @license MIT
// @icon https://forum.blackrussia.online/data/avatars/o/11/11193.jpg
// @downloadURL https://update.greasyfork.org/scripts/464714/%D0%92%D0%BE%D1%80%D0%BE%D0%BD%D0%B5%D0%B6%20%28%D0%B1%D0%B8%D0%BE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/464714/%D0%92%D0%BE%D1%80%D0%BE%D0%BD%D0%B5%D0%B6%20%28%D0%B1%D0%B8%D0%BE%29.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const CLOSE_PREFIX = 7;
const buttons = [
    {
title: 'СВОЙ ОТВЕТ',
content:
'[SIZE=4][COLOR=rgb(255,255,0)][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/COLOR]<br>'+
"[FONT=Georgia][COLOR=#EE82EE]Твой текст <br><br>"+
'[CENTER][FONT=Georgia][COLOR=#FF1493]Приятной игры![/COLOR][/CENTER][/B][/SIZE]',
},



	{
	  title: 'Биография одобрена',
      content:
'[CENTER][B][FONT=Georgia][COLOR=#FFFF00][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][B][FONT=Georgia][COLOR=#00FFFF]Ваша RolePlay биография была проверена и получает статус [/COLOR][/B][/COLOR]<br><br>' +
'[COLOR=#7CFC00][B][FONT=Georgia][SIZE=6]Одобрено[/SIZE][/B][/COLOR]<br><br>' +

"[COLOR=rgb(163, 143, 132)][B][FONT=Georgia] При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1826/']жалоб на администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=#d1d5d8][B][FONT=Georgia][COLOR=#FF1493]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +
'[/CENTER]',
  prefix: ODOBRENOBIO_PREFIX,
  status: false,
     },
     {
	  title: 'Орф и пунктуац ошибки',
	  content:
'[CENTER][B][FONT=Georgia][COLOR=#FFFF00][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][B][FONT=Georgia][COLOR=#00FFFF]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B][/COLOR]<br><br>' +
'[COLOR=#FF0000][B][FONT=Georgia][SIZE=6]Отказано[/SIZE][/B][/COLOR]<br><br>' +

"[COLOR=rgb(163, 143, 132)][B][FONT=Georgia]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-rp-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.4597417/'][B]*тут*[/B][/URL].<br><br>" +

"[B][FONT=Georgia]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1826/']жалоб на администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=#FF8C00][B][FONT=Georgia]Причина: [COLOR=rgb(250, 197, 28)]Орфографические и пунктуационные ошибки. [/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][FONT=Georgia][COLOR=#FF1493]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
   prefix: OTKAZBIO_PREFIX,
   status: false,
     },
     {
	  title: 'Возраст не совпал с датой',
	  content:
'[CENTER][B][FONT=Georgia][COLOR=#FFFF00][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][B][FONT=Georgia][COLOR=#00FFFF]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B][/COLOR]<br><br>' +
'[COLOR=#FF0000][B][FONT=Georgia][SIZE=6]Отказано[/SIZE][/B][/COLOR]<br><br>' +

"[COLOR=rgb(163, 143, 132)][B][FONT=Georgia]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-rp-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.4597417/'][B]*тут*[/B][/URL].<br><br>" +

"[B][FONT=Georgia]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1826/']жалоб на администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=#FF8C00][B][FONT=Georgia]Причина: [COLOR=rgb(250, 197, 28)]Ваш возраст не совпадает с датой рождения. [/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][FONT=Georgia][COLOR=#FF1493]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
 prefix: OTKAZBIO_PREFIX,
 status: false,
 },
     {
	  title: 'Слишком молод',
	  content:
'[CENTER][B][FONT=Georgia][COLOR=#FFFF00][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][B][FONT=Georgia][COLOR=#00FFFF]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B][/COLOR]<br><br>' +
'[COLOR=#FF0000][B][FONT=Georgia][SIZE=6]Отказано[/SIZE][/B][/COLOR]<br><br>' +

"[COLOR=rgb(163, 143, 132)][B][FONT=Georgia]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-rp-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.4597417/'][B]*тут*[/B][/URL].<br><br>" +

"[B][FONT=Georgia]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1826/']жалоб на администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=#FF8C00][B][FONT=Georgia]Причина: [COLOR=rgb(250, 197, 28)]Некорректен возраст (слишком молод) [/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][FONT=Georgia][COLOR=#FF1493]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
 prefix: OTKAZBIO_PREFIX,
 status: false,
          },
     {
	  title: 'Биография скопирована',
	  content:
'[CENTER][B][FONT=Georgia][COLOR=#FFFF00][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][B][FONT=Georgia][COLOR=#00FFFF]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B][/COLOR]<br><br>' +
'[COLOR=#FF0000][B][FONT=Georgia][SIZE=6]Отказано[/SIZE][/B][/COLOR]<br><br>' +

"[COLOR=rgb(163, 143, 132)][B][FONT=Georgia]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-rp-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.4597417/'][B]*тут*[/B][/URL].<br><br>" +

"[B][FONT=Georgia]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1826/']жалоб на администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=#FF8C00][B][FONT=Georgia]Причина: [COLOR=rgb(250, 197, 28)]Ваша Role Play Биография украдена или скопирована. [/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][FONT=Georgia][COLOR=#FF1493]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
 prefix: OTKAZBIO_PREFIX,
 status: false,
          },
    {
	  title: 'ник с _ либо англ',
	  content:
'[CENTER][B][FONT=Georgia][COLOR=#FFFF00][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][B][FONT=Georgia][COLOR=#00FFFF]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B][/COLOR]<br><br>' +
'[COLOR=#FF0000][B][FONT=Gorgia][SIZE=6]Отказано[/SIZE][/B][/COLOR]<br><br>' +

"[COLOR=rgb(163, 143, 132)][B][FONT=Georgia]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-rp-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.4597417/'][B]*тут*[/B][/URL].<br><br>" +

"[B][FONT=Georgia]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1826/']жалоб на администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=#FF8C00][B][FONT=Georgia]Причина: [COLOR=rgb(250, 197, 28)]Никнейм должен быть указан без нижнего подчеркивания на русском как в заголовке, так и в самой теме. [/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][FONT=Georgia][COLOR=#FF1493]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
 prefix: OTKAZBIO_PREFIX,
 status: false,
          },
     {
	  title: '3 лицо',
	  content:
'[CENTER][B][FONT=Georgia][COLOR=#FFFF00][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][B][FONT=Georgia][COLOR=#00FFFF]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B][/COLOR]<br><br>' +
'[COLOR=#FF0000][B][FONT=Georgia][SIZE=6]Отказано[/SIZE][/B][/COLOR]<br><br>' +

"[COLOR=rgb(163, 143, 132)][B][FONT=Georgia]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-rp-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.4597417/'][B]*тут*[/B][/URL].<br><br>" +

"[B][FONT=Georgia]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1826/']жалоб на администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=#FF8C00][B][FONT=Georgia]Причина: [COLOR=rgb(250, 197, 28)]Role Play Биография должна быть написана от первого лица персонажа. [/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][FONT=Georgia][COLOR=#FF1493]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
 prefix: OTKAZBIO_PREFIX,
 status: false,
          },
    {
	  title: 'Супер способности',
	  content:
'[CENTER][B][FONT=Georgia][COLOR=#FFFF00][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][B][FONT=Georgia][COLOR=#00FFFF]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B][/COLOR]<br><br>' +
'[COLOR=#FF0000][B][FONT=Georgia][SIZE=6]Отказано[/SIZE][/B][/COLOR]<br><br>' +

"[COLOR=rgb(163, 143, 132)][B][FONT=Georgia]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-rp-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.4597417/'][B]*тут*[/B][/URL].<br><br>" +

"[B][FONT=Georgia]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1826/']жалоб на администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=#FF8C00][B][FONT=Georgia]Причина: [COLOR=rgb(250, 197, 28)]Запрещено приписывание своему персонажу супер-способностей. [/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][FONT=Georgia][COLOR=#FF1493]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
 prefix: OTKAZBIO_PREFIX,
 status: false,
          },
     {
	  title: 'Недостаточно РП информации',
	  content:
'[CENTER][B][FONT=Georgia][COLOR=#FFFF00][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][B][FONT=Georgia][COLOR=#00FFFF]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B][/COLOR]<br><br>' +
'[COLOR=#FF0000][B][FONT=Georgia][SIZE=6]Отказано[/SIZE][/B][/COLOR]<br><br>' +

"[COLOR=rgb(163, 143, 132)][B][FONT=Georgia]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-rp-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.4597417/'][B]*тут*[/B][/URL].<br><br>" +

"[B][FONT=Georgia]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1826/']жалоб на администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=#FF8C00][B][FONT=Georgia]Причина: [COLOR=rgb(250, 197, 28)]Недостаточно РП информации. [/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][FONT=Georgia][COLOR=#FF1493]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
 prefix: OTKAZBIO_PREFIX,
 status: false,
          },
    {
	  title: 'Не по форме',
	  content:
'[CENTER][B][FONT=Georgia][COLOR=#FFFF00][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][B][FONT=Georgia][COLOR=#00FFFF]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B][/COLOR]<br><br>' +
'[COLOR=#FF0000][B][FONT=Georgia][SIZE=6]Отказано[/SIZE][/B][/COLOR]<br><br>' +

"[COLOR=rgb(163, 143, 132)][B][FONT=Georgia]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-rp-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.4597417/'][B]*тут*[/B][/URL].<br><br>" +

"[B][FONT=Georgia]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1826/']жалоб на администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=#FF8C00][B][FONT=Georgia]Причина: [COLOR=rgb(250, 197, 28)]Ваша Role Play Биография составлена не по форме. [/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][FONT=Georgia][COLOR=#FF1493]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
 prefix: OTKAZBIO_PREFIX,
 status: false,
          },
    {
	  title: 'Заголовок не по форме',
	  content:
'[CENTER][B][FONT=Georgia][COLOR=#FFFF00][SIZE=4]{{ greeting }}, уважаемый(- ая) {{ user.mention }}.[/SIZE][/FONT][/B][/CENTER]<br><br>' +
'[CENTER][B][FONT=Georgia][COLOR=#00FFFF]Ваша RolePlay биография была проверена и получает статус: [/COLOR][/B][/COLOR]<br><br>' +
'[COLOR=#FF0000][B][FONT=Georgia][SIZE=6]Отказано[/SIZE][/B][/COLOR]<br><br>' +

"[COLOR=rgb(163, 143, 132)][B][FONT=Georgia]Ознакомиться с правилами написания RolePlay биографий можно [/B][URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-rp-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.4597417/'][B]*тут*[/B][/URL].<br><br>" +

"[B][FONT=Georgia]При несогласии просьба обратиться в раздел *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1826/']жалоб на администрацию[/URL]*[/B][/COLOR]<br><br>" +

'[COLOR=#FF8C00][B][FONT=Georgia]Причина: [COLOR=rgb(250, 197, 28)]Заголовок Role Play Биографии составлен не по форме. [/B][/COLOR]<br><br>' +

'[COLOR=#d1d5d8][B][FONT=Georgia][COLOR=#FF1493]Приятной игры![/COLOR][/B][/COLOR]<br><br>' +

'[/CENTER]',
 prefix: OTKAZBIO_PREFIX,
 status: false,
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