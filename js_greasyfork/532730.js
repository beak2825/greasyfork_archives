// ==UserScript==
// @name         Cherepovets script for chief 2.0
// @namespace    https://forum.blackrussia.online/
// @version      3.31
// @description  for chief
// @author       rolex
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://freepngimg.com/thumb/eagle/20-eagle-black-siluet-png-image-download-thumb.png
// @downloadURL https://update.greasyfork.org/scripts/532730/Cherepovets%20script%20for%20chief%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/532730/Cherepovets%20script%20for%20chief%2020.meta.js
// ==/UserScript==
 
(function () {
'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closes.
const TEX_PREFIX = 13;
const GA_PREFIX = 12;
const V_PREFIX = 1;
const NARASSSMOTRENII_PREFIX = 3;
const SPECIAL_PREFIX = 11;
const buttons = [
        {
		title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ   👨‍💻 Жалобы на администрацию 👨‍💻    ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #BF40BF; width: 96%',
	},
{
title: 'на рассмотрении',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial] {{ user.mention }}[HR][/HR]'+
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial][B]Ваша жалоба взята на рассмотрение, убедительная просьба не создавать идентичных жалоб и ожидать ответа в данной теме[/B][/FONT][/COLOR][/SIZE]<br><br>" +
"[COLOR=rgb(247, 218, 100)][ICODE]на рассмотрении[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: PIN_PREFIX,
status: true,
},
{
title: 'Дублирование темы ',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial] {{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]'+
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]Ваша предыдущая жалоба находится на рассмотрении либо уже рассмотрена, не стоит продолжать создавать идентичные жалобы, иначе ваш форумный аккаунт может быть заблокирован[/FONT][/COLOR]<br><br>" +
"[COLOR=rgb(226, 80, 65)][ICODE]закрыто[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Жалоба не по форме',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial] {{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]'+
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]Ваша жалоба составлена не по форме, составьте новую жалобу по следующей форме:[/FONT][/COLOR][/SIZE] <br><br>" +
"[FONT=arial][SPOILER=Форма подачи жалобы][/SPOILER][SPOILER=Форма подачи жалобы]<br><br>" +
"[COLOR=rgb(209, 213, 216)][B]1. Ваш Nick_Name:<br>" +
"2. Nick_Name администратора:<br>" +
"3. Дата выдачи/получения наказания:<br>" +
"4. Суть жалобы:<br>" +
"5. Доказательство:[/B][/COLOR][/SPOILER][/FONT]" +
"[COLOR=rgb(226, 80, 65)][ICODE]закрыто[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Доква нужны в имгур япикс и т д',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial]{{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]'+
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]Прикрепите доказательства через фотохостинги [/FONT][COLOR=rgb(255, 255, 255)][FONT=arial]Imgur/Япикс/R[B]adikal[/B][/FONT][/COLOR][FONT=arial][B] и тп.[/B][/FONT][/COLOR][/SIZE] <br><br>" +
"[COLOR=rgb(226, 80, 65)][ICODE]закрыто[/ICODE][/COLOR][/CENTER][CENTER][SIZE=4]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Более 48 часов',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial] {{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]'+
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]С момента выдачи наказания прошло более 48 часов, рассмотрению не подлежит[/FONT][/COLOR]<br><br>" +
"[COLOR=rgb(226, 80, 65)][ICODE]закрыто[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'в тех раздел',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial] {{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]'+
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]Вы попали не туда, обратитесь в технический раздел - [/FONT][/COLOR][/SIZE][URL='https://forum.blackrussia.online/forums/Технический-раздел-cherepovets.3978/']тык[/URL][/FONT][/COLOR][/SIZE]<br><br>" +
"[COLOR=rgb(226, 80, 65)][ICODE]закрыто[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'передано рук.модерации',
content:
"[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial]{{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]" +
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]Ваша жалоба передана на рассмотрение [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=arial]руководству модерации[/FONT][/COLOR][/SIZE]<br><br>" +
"[COLOR=rgb(247, 218, 100)][ICODE]на рассмотрении[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: COMMAND_PREFIX,
status: true,
},
{
title: 'передано спецам',
content:
"[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial]{{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]" +
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]Ваша жалоба передана на рассмотрение[/FONT][COLOR=rgb(226, 80, 65)][FONT=arial] специальной администрации[/FONT][/COLOR][/COLOR][/SIZE]<br><br>" +
"[COLOR=rgb(247, 218, 100)][ICODE]на рассмотрении[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: SPECIAL_PREFIX,
status: true,
},
{
title: 'передано га',
content:
"[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial]{{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]" +
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]Ваша жалоба передана на рассмотрение[/FONT][COLOR=rgb(226, 80, 65)][FONT=arial] главному администратору[/FONT][/COLOR][/COLOR][/SIZE]<br><br>" +
"[COLOR=rgb(247, 218, 100)][ICODE]на рассмотрении[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: GA_PREFIX,
status: true,
},
{
title: 'передано зга',
content:
"[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial]{{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]" +
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]Ваша жалоба передана на рассмотрение[/FONT][COLOR=rgb(226, 80, 65)][FONT=arial] заместителю главного администратора[/FONT][/COLOR][/COLOR][/SIZE]<br><br>" +
"[COLOR=rgb(247, 218, 100)][ICODE]на рассмотрении[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: PIN_PREFIX,
status: true,
},
{
title: 'в жб на теха',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial] {{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]'+
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]Вы попали не туда, обратитесь в раздел жалоб на технических специалистов - [/FONT][/COLOR][/SIZE][URL='https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9689-cherepovets.3946/']тык[/URL][/FONT][/COLOR][/SIZE]<br><br>" +
"[COLOR=rgb(226, 80, 65)][ICODE]закрыто[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'в обж',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial] {{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]'+
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]Вы попали не туда, обратитесь в раздел обжалования наказаний - [/FONT][/COLOR][/SIZE][URL='https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.3968/']тык[/URL][/FONT][/COLOR][/SIZE]<br><br>" +
"[COLOR=rgb(226, 80, 65)][ICODE]закрыто[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'неуваж контекст жб',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial] {{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]'+
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial][SIZE=4][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]Ваша жалоба составлена в неуважительном контексте по отношению к администрации, значит рассмотрена не будет[/FONT][/COLOR][/SIZE][/SIZE][/FONT][/COLOR]<br><br>" +
"[COLOR=rgb(226, 80, 65)][ICODE]закрыто[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'док-ва отредактированы',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial] {{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]'+
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial][SIZE=4][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]Ваши доказательства были подвергнуты редактированию, загрузите оригинальные (в первоначальном виде) доказательства[/FONT][/COLOR][/SIZE][/SIZE][/FONT][/COLOR]<br><br>" +
"[COLOR=rgb(226, 80, 65)][ICODE]закрыто[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'недостаточно доказательств,',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial] {{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]'+
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial][SIZE=4][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]Доказательств, предоставленных вами недостаточно для принятия каких-либо мер в сторону администрации[/FONT][/COLOR][/SIZE][/SIZE][/FONT][/COLOR]<br><br>" +
"[COLOR=rgb(226, 80, 65)][ICODE]закрыто[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'обрываются',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial] {{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]'+
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]Ваши доказательства обрываются, загрузите их на платформу[/FONT][/COLOR][/SIZE][/FONT][/COLOR][/SIZE]<br><br>" +
"[COLOR=rgb(226, 80, 65)][ICODE]закрыто[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'нет тайма',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial] {{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]'+
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial][SIZE=4][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]В ваших доказательствах отсутствует /time, рассмотрению не подлежит[/FONT][/COLOR][/SIZE][/SIZE][/FONT][/COLOR]<br><br>" +
"[COLOR=rgb(226, 80, 65)][ICODE]закрыто[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'от 3-го лица',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial] {{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]'+
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial][SIZE=4][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]Ваша жалоба составлена от 3-го лица, рассмотрению не подлежит[/FONT][/COLOR][/SIZE][/SIZE][/FONT][/COLOR]<br><br>" +
"[COLOR=rgb(226, 80, 65)][ICODE]закрыто[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'бан айпи',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial] {{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]'+
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial][SIZE=4][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]Попробуйте перезагрузить ваше устройство и роутер, еще как вариант переключиться на мобильный/домашний интернет, в случае если ошибка не исправится, напишите повторную жалобу[/FONT][/COLOR][/SIZE][/SIZE][/FONT][/COLOR]<br><br>" +
"[COLOR=rgb(226, 80, 65)][ICODE]закрыто[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'нет вк',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial] {{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]'+
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial][SIZE=4][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]В вашей жалобе отсутствует ссылка на ваш [/FONT][/COLOR][/SIZE][COLOR=rgb(209, 213, 216)][SIZE=4][COLOR=rgb(255, 255, 255)][FONT=arial]VKontakte, [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=arial]прикрепите в течение 24 часов[/FONT][/COLOR][/SIZE][/COLOR][/SIZE][/FONT][/COLOR]<br><br>" +
"[COLOR=rgb(247, 218, 100)][ICODE]на рассмотрении[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: PIN_PREFIX,
status: true,
},
{
title: 'выдано верно',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial] {{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]'+
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial][SIZE=4][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]Проверив доказательства администратора, выношу вердикт что наказание выдано верно[/FONT][/COLOR][/SIZE][/SIZE][/FONT][/COLOR]<br><br>" +
"[COLOR=rgb(226, 80, 65)][ICODE]закрыто[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'с адм проведена работа',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial] {{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]'+
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]С администратором будет проведена необходимая работа, приносим свои извинения[/FONT][/COLOR]<br><br>" +
"[COLOR=rgb(97, 189, 109)][ICODE]одобрено[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'нет нарушений',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial] {{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]'+
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]Нарушений от администратора не было замечено[/FONT][/COLOR][/SIZE][/FONT][/COLOR]<br><br>" +
"[COLOR=rgb(226, 80, 65)][ICODE]закрыто[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ                                ᅠ⠀             ⠀ ⠀⠀ᅠ ᅠ😭 Обжалование наказаний 😭 ᅠᅠ ᅠᅠ          ⠀        ⠀    ⠀      ⠀ᅠ     ᅠ ᅠ     ᅠ ᅠ ᅠ ',
dpstyle: 'oswald: 3px;     color: #fff; background: #212428; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid #BF40BF; width: 96%',
},
{
title: 'на рассмотрение ',
content:
"[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial]{{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]" +
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]Ваше обжалование взято на рассмотрение, [B]убедительная просьба не создавать идентичных обжалований и ожидать ответа в данной теме[/B][/FONT][/COLOR]<br><br>" +
"[COLOR=rgb(247, 218, 100)][ICODE]на рассмотрении[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: PIN_PREFIX,
status: true,
},
{
title: 'обж не по форме',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial] {{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]'+
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]Ваша обжалование составлена не по форме, составьте новое обжалование по следующей форме:[/FONT][/COLOR][/SIZE] <br><br>" +
"[FONT=arial][SPOILER=Форма подачи обжалования][/SPOILER][SPOILER=Форма подачи обжалования]<br>" +
"[COLOR=rgb(209, 213, 216)][B]1. Ваш Nick_Name:<br>" +
"2. Nick_Name администратора:<br>" +
"3. Дата выдачи/получения наказания:<br>" +
"4. Суть заявки:<br>" +
"5. Доказательство:[/B][/COLOR][/SPOILER][/FONT]<br>" +
"[COLOR=rgb(226, 80, 65)][ICODE]закрыто[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Дублирование темы ',
content:
"[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial] {{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]"+
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]Ваше предыдущее обжалование находится на рассмотрении либо уже рассмотрено, не стоит продолжать создавать идентичные обжалования, иначе ваш форумный аккаунт может быть заблокирован[/FONT][/COLOR]<br><br>" +
"[COLOR=rgb(226, 80, 65)][ICODE]закрыто[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'отказано',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial] {{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]'+
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]На данный момент мы не готовы пойти к вам на встречу и обжаловать ваше наказание[/FONT][/COLOR][/SIZE]<br><br>" +
"[COLOR=rgb(226, 80, 65)][ICODE]отказано[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'до мин. мер',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial] {{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]'+
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]Мы пойдем к вам на встречу и снизим ваше наказание до минимальных мер, но при условии того, что вы прекратите нарушать правила[/FONT][/COLOR][/SIZE]<br><br>" +
"[COLOR=rgb(97, 189, 109)][ICODE]одобрено[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'не подлежит',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial] {{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]'+
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]Ваше наказание обжалованию не подлежит[/FONT][/COLOR][/SIZE]<br><br>" +
"[COLOR=rgb(226, 80, 65)][ICODE]отказано[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'в тех раздел',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial] {{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]'+
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]Вы попали не туда, обратитесь в технический раздел - [/FONT][/COLOR][/SIZE][URL='https://forum.blackrussia.online/forums/Технический-раздел-cherepovets.3978/']тык[/URL][/FONT][/COLOR][/SIZE]<br><br>" +
"[COLOR=rgb(226, 80, 65)][ICODE]закрыто[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'в жб на теха',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial] {{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]'+
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]Вы попали не туда, обратитесь в раздел жалоб на технических специалистов - [/FONT][/COLOR][/SIZE][URL='https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9689-cherepovets.3946/']тык[/URL][/FONT][/COLOR][/SIZE]<br><br>" +
"[COLOR=rgb(226, 80, 65)][ICODE]закрыто[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'в жб на адм',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial] {{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]'+
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]Вы попали не туда, обратитесь в раздел обжалования наказаний - [/FONT][/COLOR][/SIZE][URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3965/']тык[/URL][/FONT][/COLOR][/SIZE]<br><br>" +
"[COLOR=rgb(226, 80, 65)][ICODE]закрыто[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'передано рук.модерации',
content:
"[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial]{{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]" +
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]Ваше обжалование передано на рассмотрение [/FONT][/COLOR][COLOR=rgb(44, 130, 201)][FONT=arial]руководству модерации[/FONT][/COLOR][/SIZE]<br><br>" +
"[COLOR=rgb(247, 218, 100)][ICODE]на рассмотрении[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: COMMAND_PREFIX,
status: true,
},
{
title: 'передано спецам',
content:
"[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial]{{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]" +
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]Ваше обжалование передана на рассмотрение[/FONT][COLOR=rgb(226, 80, 65)][FONT=arial] специальной администрации[/FONT][/COLOR][/COLOR][/SIZE]<br><br>" +
"[COLOR=rgb(247, 218, 100)][ICODE]на рассмотрении[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: SPECIAL_PREFIX,
status: true,
},
{
title: 'передано га',
content:
"[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial]{{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]" +
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]Ваше обжалование передано на рассмотрение[/FONT][COLOR=rgb(226, 80, 65)][FONT=arial] главному администратору[/FONT][/COLOR][/COLOR][/SIZE]<br><br>" +
"[COLOR=rgb(247, 218, 100)][ICODE]на рассмотрении[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: GA_PREFIX,
status: true,
},
{
title: 'смена ника',
content:
"[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial]{{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]" +
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]Ваш аккаунт разблокирован, у вас есть 24 часа на то, чтобы сменить игровой никнейм и отписаться в данную тему, в ином случае ваш аккаунт будет заблокирован вновь[/FONT][/COLOR][/SIZE][/FONT][/COLOR]<br><br>" +
"[COLOR=rgb(247, 218, 100)][ICODE]на рассмотрении[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: PIN_PREFIX,
status: true,
},
{
title: 'ник сменен',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial] {{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]'+
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]В смене никнейма убедился, блокировка снята[/FONT][/COLOR][/SIZE][/FONT][/COLOR]<br><br>" +
"[COLOR=rgb(97, 189, 109)][ICODE]одобрено[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: 'ник не сменен',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial] {{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]'+
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]Никнейм сменен не был, блокировка остается[/FONT][/COLOR][/SIZE][/FONT][/COLOR]<br><br>" +
"[COLOR=rgb(226, 80, 65)][ICODE]отказано[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'нрп обман',
content:
"[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial]{{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]" +
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]Предоставьте контакты другой стороны, для этого свяжитесь со мной в [/FONT][COLOR=rgb(255, 255, 255)][FONT=arial]VKontakte[/FONT][/COLOR][/COLOR][/SIZE][/FONT][/COLOR]<br><br>" +
"[COLOR=rgb(247, 218, 100)][ICODE]на рассмотрении[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: PIN_PREFIX,
status: true,
},
{
title: 'неуваж контекст',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial] {{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]'+
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]Обжалование с неуважением к администрации рассмотрена не будет[/FONT][/COLOR][/SIZE][/FONT][/COLOR<br><br>" +
"[COLOR=rgb(226, 80, 65)][ICODE]отказано[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'переношу в нужный раздел',
content:
"[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial]{{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]" +
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]Переношу ваше обжалование в нужный раздел..[/FONT][/COLOR][/SIZE][/FONT][/COLOR]<br><br>" +
"[COLOR=rgb(247, 218, 100)][ICODE]на рассмотрении[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: PIN_PREFIX,
status: true,
},
{
title: 'Одобрено',
content:
'[CENTER][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=arial][COLOR=rgb(56, 133, 233)]Добрый день, уважаемый (-ая)[/COLOR][/FONT][/SIZE] [/COLOR][SIZE=4][FONT=arial] {{ user.mention }}[/FONT][/SIZE][/CENTER][HR][/HR]'+
"[CENTER][SIZE=4][COLOR=rgb(209, 213, 216)][FONT=arial]Мы приняли решение, что вы обдумали свои действия и больше не будете совершать подобного, поэтому мы снимем полностью ваше наказание[/FONT][/COLOR][/SIZE]<br><br>" +
"[COLOR=rgb(97, 189, 109)][ICODE]одобрено[/ICODE][/COLOR][/CENTER]<br><br>" +
"[RIGHT][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR] [COLOR=rgb(56, 133, 233)]Cherepovets[/COLOR][/RIGHT]",
prefix: ACCEPT_PREFIX,
status: false,
},
];
 
$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
// Добавление кнопок при загрузке страницы
addButton('Тык', 'selectAnswer');
 
// Поиск информации о теме
const threadData = getThreadData();
 
$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
$('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
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
const threadTitle =
$('.p-title-value')[0].lastChild.textContent;
 
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