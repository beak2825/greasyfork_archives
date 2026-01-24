// ==UserScript==
// @name         Скрипт для кураторов администрации
// @namespace    https://forum.blackrussia.online
// @version      2.2
// @description  Скрипт 
// @author       Rasul
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @collaborator ya
// @icon         https://i.postimg.cc/mkYpYfXx/photo-2025-05-01-19-08-17.jpg
// @downloadURL https://update.greasyfork.org/scripts/531901/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/531901/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D0%B8.meta.js
// ==/UserScript==

(function () {
'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SA_PREFIX = 11;
const TEXU_PREFIX = 13;


const glassButtonCSS = `
<style>
.glass-button {
    position: relative;
    display: inline-block;
    padding: 8px 16px;
    margin: 4px;
    text-decoration: none;
    text-transform: uppercase;
    color: white;
    font-weight: 600;
    font-size: 14px;
    letter-spacing: 0.5px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    overflow: hidden;
    cursor: pointer;
    z-index: 1;
}

.glass-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0));
    z-index: -1;
    transition: all 0.3s ease;
    opacity: 0;
}

.glass-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
}

.glass-button:hover::before {
    opacity: 1;
}

.glass-button:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}


.glass-button.answer {
    background: rgba(138, 43, 226, 0.3);
    border-color: rgba(138, 43, 226, 0.5);
}

.glass-button.reject {
    background: rgba(255, 0, 0, 0.3);
    border-color: rgba(255, 0, 0, 0.5);
}

.glass-button.approve {
    background: rgba(0, 255, 0, 0.3);
    border-color: rgba(0, 255, 0, 0.5);
}

.glass-button.review {
    background: rgba(255, 152, 0, 0.3);
    border-color: rgba(255, 152, 0, 0.5);
}

.glass-button.ga {
    background: rgba(216, 0, 0, 0.3);
    border-color: rgba(216, 0, 0, 0.5);
}

.glass-button.special {
    background: rgba(255, 203, 0, 0.3);
    border-color: rgba(255, 203, 0, 0.5);
}

.glass-button.close {
    background: rgba(255, 0, 0, 0.3);
    border-color: rgba(255, 0, 0, 0.5);
}

.glass-button.divider {
    background: rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    cursor: default;
    pointer-events: none;
    width: 100%;
    text-align: center;
    margin: 10px 0;
    padding: 8px 0;
}

.select_answer {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 10px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    margin: 10px 0;
}

.button-container {
    display: flex;
    flex-wrap: wrap;
    margin: 10px 0;
    justify-content: center;
}

.section-title {
    width: 100%;
    text-align: center;
    font-weight: bold;
    color: white;
    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
    margin: 10px 0 5px 0;
}
</style>
`;


document.head.insertAdjacentHTML('beforeend', glassButtonCSS);

const buttons = [
  {
        title: ' Свой Ответ ',
        content:
            '[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)][B]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>' +
            "Твой текст <br><br>",
        class: 'answer'
    },
    {
        title: ' На рассмотрение (запрос докв) ',
        content:
            '[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>' +
            "[CENTER]Запрошу доказательства у администратора. Просьба не создавать подобных тем, иначе ваш Форумный аккаунт может быть [Color=rgb(255, 0, 0)][U]заблокирован.[/U][/Color][/CENTER]<br><br>" +
            '[CENTER][Color=rgb(255, 255, 0)]На Рассмотрении...[/Color][/CENTER][/SIZE]',
        prefix: PIN_PREFIX,
        status: true,
        class: 'review'
    },
   {
title: 'На рассмотрение',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваша жалоба принята и находится на рассмотрении. Просим воздержаться от создания подобных тем в будущем, так как это может привести к [Color=rgb(255, 0, 0)][U]блокировке[/U][/Color] вашего Форумного аккаунта.[/CENTER]<br><br>"+
'[CENTER][Color=rgb(255,255,0)][ICODE]На Рассмотрении...[/ICODE][/Color][/CENTER]',
prefix: PIN_PREFIX,
status: true,
class: 'review'
},
{
title: '𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩ОТКАЗЫ𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪',
class: 'divider'
},

{
title: ' Не по Форме ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваша жалоба составлена не по форме.<br>"+
"[CENTER]Ознакомьтесь с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3429349/'][COLOR=rgb(255,0,0)]«правилами подачи жалоб на администрацию».[/color][/URL][/CENTER]<br><br>"+
"[CENTER][Color=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/Color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(255, 0, 122)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
},
{
title: ' нету /time ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]В вашей жалобе отсутствует /time.<br>"+
"[CENTER][Color=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/Color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(255, 0, 122)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
},
{
title: ' Подделка докв, обман адм ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]В вашей жалобе обнаружены поддельные доказательства. Ваш форумный аккаунт будет заблокирован за обман администрации.<br>"+
"[CENTER][Color=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/Color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(255, 0, 122)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
},
{
title: ' Нет Док-в ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]В вашей жалобе отсутствуют доказательства нарушения со стороны администратора. Пожалуйста, создайте повторную жалобу и прикрепите необходимые доказательства.<br><br>"+
"[CENTER][Color=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/Color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(255, 0, 122)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
},
{
title: 'Соцсети',
content: '[SIZE=4][FONT=Times New Roman][CENTER][COLOR=rgb(255, 0, 255)]{{ greeting }},[/COLOR] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Доказательства из социальных сетей не принимаются.<br>"+
"Пожалуйста, загрузите материалы на imgur.com и создайте новую жалобу.<br><br>"+
"Рекомендуется ознакомиться с правилами подачи обжалования.<br><br>"+
"[COLOR=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/COLOR]<br>"+
"Приятной игры на сервере [COLOR=rgb(255, 0, 122)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]",
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
},  
{
  title: ' Наказание выдано верно ',
  content:
    '[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/color] уважаемый {{ user.mention }}!<br><br>'+
    "[CENTER]После тщательной проверки представленных доказательств администратором принято окончательное решение: [COLOR=rgb(0, 255, 0)]наказание вынесено справедливо[/COLOR].<br>"+
    "[CENTER]В дальнейшем настоятельно рекомендуем соблюдать правила сервера. Ознакомиться с ними можно по ссылке - [URL='https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/'][COLOR=rgb(255,0,0)]««Общие правила серверов»».[/color][/URL][/CENTER]<br><br>"+
    "[CENTER][Color=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/Color]<br>"+
    '[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(255, 0, 122)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
  prefix: UNACCEPT_PREFIX,
  status: false,
  class: 'reject'
},
{
title: ' Прошло 72 часа ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] С момента получения наказания прошло [Color=rgb(255, 0, 0)]72 часа[/color],жалоба не подлежит рассмотрению. <br><br>"+
"[CENTER][Color=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/Color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(255, 0, 122)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
},
{
title: ' Недостаточно Док-в ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Предоставленных доказательств недостаточно для корректного рассмотрения данной жалобы.<br><br>"+
"[CENTER][Color=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/Color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(255, 0, 122)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
},
{
title: ' Ошиблись Разделом/Сервером ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Вы ошиблись разделом/сервером. Пожалуйста, переподайте жалобу в нужный раздел/на нужный сервер.<br><br>"+
"[CENTER][Color=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/Color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(255, 0, 122)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
},
{
title: ' Не работают Док-ва ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Предоставленные доказательства не работают. Пожалуйста, загрузите их снова.<br><br>"+
"[CENTER][Color=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/Color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(255, 0, 122)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
},
{
title: ' Дубликат ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER] Прекратите создавать дубликаты жалоб. В дальнейшем, ваш форумный аккаунт будет заблокирован.<br><br>"+
"[CENTER][Color=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/Color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(255, 0, 122)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
},
{
title: ' Нет Нарушений АДМ ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Нарушений со стороны администратора нет.<br><br>"+
"[CENTER][Color=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/Color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(255, 0, 122)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
},
{
title: ' Жб от 3 лица ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Жалоба составлена от третьего лица, соответственно, она не подлежит рассмотрению.<br><br>"+
"[CENTER][Color=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/Color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(255, 0, 122)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
},
{
title: ' В Обжалование Наказаний ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]В вашем случае следовало сразу реагировать на выданное наказание и обращаться в раздел жалоб на администрацию. В настоящий момент срок для подачи жалобы прошел.<br>"+
"[CENTER]Обратитесь в раздел [URL='https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.2501/'][COLOR=rgb(255,0,0)]««Обжалование наказаний»».[/color][/URL][/CENTER].<br><br>"+
"[CENTER][Color=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/Color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(255, 0, 122)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
},
{
title: ' Уже Был Дан Ответ ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Вам уже был дан корректный ответ. За создание дубликатов этой темы ваш форумный аккаунт может быть заблокирован.<br><br>"+
"[CENTER][Color=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/Color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(255, 0, 122)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
},
{
title: ' Нужна ссылка на отказ Куратора ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Создайте повторно тему,прикрепив в ней ссылку на отказанную жалобу от Куратора.<br><br>"+
"[CENTER][Color=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/Color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(255, 0, 122)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
},
{
title: ' Окно Блокировки ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Прикрепите в новой жалобе скриншот окна блокировки игрового аккаунта при входе в игру.<br><br>"+
"[CENTER][Color=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/Color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(255, 0, 122)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
},
{
title: ' ЖБ На Теха ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Данный администратор является или являлся техническим специалистом, поэтому вам необходимо обратиться в раздел [URL='https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9656-arkhangelsk.2471/'][COLOR=rgb(255,0,0)]««Жалобы на технических специалистов»».[/color][/URL][/CENTER].<br><br>"+
"[CENTER][Color=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/Color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(255, 0, 122)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
},
{
title: ' Неадекватное Содержание ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Жалобы с подобным содержанием не подлежат рассмотрению.<br><br>"+
"[CENTER][Color=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/Color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(255, 0, 122)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
},
{
title: ' На Скрине Читы/Сборка ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваша жалоба не подлежит рассмотрению, поскольку вы используете неоригинальные файлы игры. (Сборка/Постороннее ПО)<br><br>"+
"[CENTER][Color=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/Color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(255, 0, 122)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
},
{
title: ' Наказание Выдано По Форуму,Верно ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Наказание было выдано по жалобе на форуме. После проверки доказательств было принято решение, что наказание выдано верно.<br>"+
"[CENTER]В дальнейшем настоятельно рекомендуем соблюдать правила сервера. Ознакомиться с ними можно по ссылке - [URL='https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/'][COLOR=rgb(255,0,0)]««Общие правила серверов».».[/color][/URL][/CENTER]<br><br>"+
"[CENTER][Color=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/Color]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(255, 0, 122)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
class: 'reject'
},
{
title: '𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩ОДОБРЕНИЯ𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪',
class: 'divider'
},
{
title: ' Одобрено,беседа ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваша жалоба одобрена. С администратором будет проведена соответствующая беседа.<br><br>"+
"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено.[/ICODE][/COLOR]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(255, 0, 122)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
class: 'approve'
},
{
title: ' Наказание будет снято ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Наказание будет снято. С администратором проведена беседа.<br><br>"+
"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено.[/ICODE][/COLOR]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(255, 0, 122)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
class: 'approve'
},
{
title: ' [Forum] Жалобы будут пересмотрены ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Жалобы будут пересмотрены, с администратором будет проведена беседа.<br><br>"+
"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено.[/ICODE][/COLOR]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(255, 0, 122)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
class: 'approve'
},
{
title: ' [Forum] Ответ будет исправлен ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ответ в жалобе будет исправлен.<br><br>"+
"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено.[/ICODE][/COLOR]<br>"+
'[CENTER]Приятной игры и времяпровождения на сервере [COLOR=rgb(255, 0, 122)]ARKHANGELSK[/COLOR].[/CENTER][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
class: 'approve'
},
{
title: '𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩𓆩НА РАССМОТРЕНИЕ𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪𓆪',
class: 'divider'
},
{
title: ' ГА ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваша жалоба будет передана [Color=rgb(255, 0, 0)]Главному администратору[/Color] - @Candy_Rotmans на рассмотрение.<br>"+
"[CENTER]Просьба не создавать подобных тем, иначе форумный аккаунт может быть заблокирован.<br><br>"+
'[CENTER][Color=rgb(255, 255, 0)]На Рассмотрении...[/Color][/CENTER][/SIZE]',
prefix: GA_PREFIX,
status: true,
class: 'ga'
},
{
title: ' ЗГА ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваша жалоба будет передана [Color=rgb(255, 0, 0)]Заместителям Главного Администратора[/Color] -  @Persona Makaravll @Deda Holmes на рассмотрение.<br>"+
"[CENTER]Просьба не создавать подобных тем, иначе форумный аккаунт может быть заблокирован.<br><br>"+
'[CENTER][Color=rgb(255, 255, 0)]На Рассмотрении...[/Color][/CENTER][/SIZE]',
prefix: PIN_PREFIX,
status: true,
class: 'ga'
},
{
title: ' СПЕЦ.АДМ ',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][Color=rgb(255, 0, 255)]{{ greeting }},[/Color] уважаемый {{ user.mention }}!<br><br>'+
"[CENTER]Ваша жалоба будет передана [Color=rgb(255, 0, 0)]Специальной Администрации[/Color] -︎  @Sander_Kligan, @Clarence Crown, @Dmitry Dmitrich, @Myron_Capone @Liana_Mironova на рассмотрение.<br>"+
"[CENTER]Просьба не создавать подобных тем, иначе форумный аккаунт может быть заблокирован.<br><br>"+
'[CENTER][Color=rgb(255, 255, 0)]На Рассмотрении...[/Color][/CENTER][/SIZE]',
prefix: SA_PREFIX,
status: true,
class: 'special'
}
  ];

$(document).ready(() => {

    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');


    const buttonContainer = $('<div class="button-container"></div>');
    $('.button--icon--reply').before(buttonContainer);


    addButton(' Рассмотрение ', 'pin', 'review');
    addButton(' Одобрено ', 'accepted', 'approve');
    addButton(' Отказано ', 'unaccept', 'reject');
    addButton(' ГА ', 'Ga', 'ga');
    addButton(' Закрыто ', 'Zakrito', 'close');
    addButton(' Ответы ', 'selectAnswer', 'answer');


    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
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

function addButton(name, id, styleClass = '') {
    $(`.button-container`).append(
        `<button type="button" class="glass-button ${styleClass}" id="${id}" style="margin: 3px;">${name}</button>`,
    );
}

function buttonsMarkup(buttons) {
    return `<div class="select_answer">${buttons
        .map(
            (btn, i) =>
                `<button id="answers-${i}" class="glass-button ${btn.class || ''}" ` +
                `style="margin:5px"><span class="button-text">${btn.title}</span></button>`,
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
            12 < hours && hours <= 18
                ? 'Доброго времени Суток'
                : 18 < hours && hours <= 21
                ? 'Доброго времени Суток'
                : 21 < hours && hours <= 4
                ? 'Доброго времени Суток'
                : 'Доброго времени Суток',
    };
}

function editThreadData(prefix, pin = false) {

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