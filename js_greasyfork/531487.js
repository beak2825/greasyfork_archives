// ==UserScript==
// @name         Black Russia CHIEF Scirpt
// @namespace    https://forum.blackrussia.online/
// @version      3.1.2
// @description  Скрипт для Руководства сервера 
// @author       Santiago Jackovic Кушнир продакшн представляет
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://freepngimg.com/thumb/eagle/20-eagle-black-siluet-png-image-download-thumb.png
// @downloadURL https://update.greasyfork.org/scripts/531487/Black%20Russia%20CHIEF%20Scirpt.user.js
// @updateURL https://update.greasyfork.org/scripts/531487/Black%20Russia%20CHIEF%20Scirpt.meta.js
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
            title: '----------------------------------------------------------|Куратор Администрации|---------------------------------------------------------',
      content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',

},
{
title: '| Запрос доказательств |',
content:
"[CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
"[CENTER] [COLOR=AQUA][ICODE] Запрошу у администратора все необходимые доказательства и предоставлю вам ответ, как только получу информацию.[/ICODE][/COLOR][/CENTER]<br><br>"+
"[CENTER] [COLOR=AQUA][ICODE] Ожидайте ответа [/ICODE][/COLOR][/CENTER]<br><br>"+
'[CENTER] [COLOR=AQUA][ICODE] Приятной игры на нашем сервере.  [/ICODE][/COLOR] [/CENTER]',
prefix: PIN_PREFIX,
status: true,
},
{
title: '| На рассмотрение |',
content:
"[CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
"[CENTER] [COLOR=AQUA][ICODE] Ваше жалоба взята на рассмотрение. Ожидайте, пожалуйста, ответа от администрации в ближайшее время. Мы просим воздержаться от создания дубликатов данной темы. Благодарим за понимание.[/ICODE][/COLOR][/CENTER]<br><br>"+
"[CENTER] [COLOR=AQUA][ICODE] Ожидайте ответа [/ICODE][/COLOR][/CENTER]<br><br>"+
'[CENTER] [COLOR=AQUA][ICODE] Приятной игры на нашем сервере.  [/ICODE][/COLOR] [/CENTER]',
prefix: PIN_PREFIX,
status: true,
},
{
title: '| Администратор прав |',
content:
"[CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
"[CENTER] [COLOR=AQUA][ICODE] Администратор предоставил все необходимые доказательства, подтверждающие правомерность решения. На основании представленных материалов наказание было назначено верно и в соответствии с правилами.[/ICODE][/COLOR][/CENTER]<br><br>"+
"[CENTER] [COLOR=AQUA][ICODE] Приятной игры на нашем сервере.[/ICODE][/COLOR][/CENTER]<br><br>"+
'[CENTER] [COLOR=AQUA][ICODE] Закрыто.  [/ICODE][/COLOR] [/CENTER]',
prefix: PIN_PREFIX,
status: true,
},
    {
title: 'Наказание за форум',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Игрок написал на вас жалобу, исходя из этой жалобы вам было выдано наказание.[/CENTER]<br><br>" +
"[CENTER]Проверю верность вредикта куратора форума , ожидайте ответа.[/CENTER]<br><br>" +
'[CENTER]Приятной игры на нашем сервере.[/CENTER][/FONT][/SIZE]',
prefix: PIN_PREFIX,
status: true,
},

{
title: 'Бан по IP',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Попробуйте изменить подключение на вашем устройстве. Пример: зайти в игру с подключением к Wi-Fi, мобильным интернетом или с сервисом VPN [/CENTER]<br><br>" +
"[CENTER]После проделанного метода вы должны оставить сообщение в данной теме, получилось или нет.<br><br>" +
'[CENTER]Приятной игры на нашем сервере.[/CENTER][/FONT][/SIZE]',
prefix: WATCHED_PREFIX,
status: false,
},
{
title: 'Жалоба одобрена в сторону игрока',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба была одобрена и будет проведена беседа с администратором.<br>Ваше наказание будет снято.[/CENTER]<br><br>" +
'[CENTER]Приятной игры на нашем сервере.[/CENTER][/FONT][/SIZE]',
prefix: WATCHED_PREFIX,
status: false,
},
{
title: 'Наказать адм',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба была одобрена и администратор будет наказан,Cпасибо за информацию.[/CENTER]<br><br>" +
'[CENTER]Приятной игры на нашем сервере.[/CENTER][/FONT][/SIZE]',
prefix: WATCHED_PREFIX,
status: false,
},
{
title: 'Дублирование темы ',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Если вы дальше будете дублировать темы, то ваш форумный аккаунт будет заблокирован на 3 дня и более.[/CENTER]<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Ответ в прошлой жалобе ',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ответ был дан в прошлой теме [/CENTER]<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: 'Беседа с админом',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]С администратором будет проведена беседа,Cпасибо за информацию.[/CENTER]<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Ошиблись сервером',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Вы ошиблись сервером. Подайте жалобу в разделе своего форума.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Качество докв',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Пересоздайте жалобу и прикрепите туда доказательства в нормальном качестве[/CENTER]<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'отсутствует скриншот окна блокировки аккаунта',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]В вашей жалобе отсутствует скриншот окна блокировки аккаунта.[/CENTER]<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Отказано.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},

{
title: 'Админ прав,опру на самооборону',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Доказательства были предоставлены, наказание выдано верно.[/CENTER]<br><br>" +
"[CENTER]Если Dm и вправду был ответным вы должны предоставить доказательства[/CENTER]<br><br>" +
"[CENTER][COLOR=rgb(255, 0, 0)]2.19.[/COLOR] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [COLOR=rgb(255, 0, 0)]| Jail 60 минут[/COLOR][/CENTER]<br><br>" +
"[CENTER][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/CENTER]<br><br>" +
"[CENTER]Переподайте жалобу с прикреплёнными доказательствами[/CENTER]<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'КФ прав',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Проверив поданную жалобу на вас от игрока, было принято решение, что наказание выдано верно.[/CENTER]<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Жалоба не по форме',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Жалоба составлена не по форме. Внимательно прочитайте правила составления жалобы, которые закреплены в этом разделе. <br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]" +
'[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Доква не в имгур япикс',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). <br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Отстутствуют доказательств',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]В вашей жалобе отсутствуют доказательства.<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Недостаточно доказательст',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]В вашей жалобе недостаточно доказательств.<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Отказано.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'направить в Технический раздел',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обраться в технический раздел.[/CENTER]<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Более 48 часов',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]С момента выдачи наказания прошло более 48 часов.[/CENTER]<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'отсутствует скриншот выдачи наказания.',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]В вашей жалобе отсутствует скриншот выдачи наказания.<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Передано ЗГА',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба будет передана Заместителю Главного Администратора на рассмотрение. Ожидайте его ответа.<br><br>" +
'[CENTER]Приятной игры на нашем сервере.[/CENTER][/FONT][/SIZE]',
prefix: PIN_PREFIX,
status: true,
},
{
title: 'Передано ГА',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба будет передана Главному Администратору на рассмотрение. Ожидайте его ответа.<br><br>" +
'[CENTER]Приятной игры на нашем сервере.[/CENTER][/FONT][/SIZE]',
prefix: PIN_PREFIX,
status: true,
},
{
title: 'Передано СА',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба передана [COLOR=rgb(255, 0, 0)]Специальной администрации[/COLOR] <br><br>" +
"[CENTER] Ответ может занять более 48 часов. [/CENTER] <br><br>" +
'[CENTER]Приятной игры на нашем сервере.[/CENTER][/FONT][/SIZE]',
prefix: PIN_PREFIX,
status: true,
},
{
title: 'Передано Sakaro',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба передана [COLOR=rgb(44, 130, 201)]Руководителю модерации Discord [/COLOR] <br><br>" +
"[CENTER] @sakaro [/CENTER] <br><br>" +
"[CENTER] Ответ может занять более 48 часов. [/CENTER] <br><br>" +
'[CENTER]Приятной игры на нашем сервере.[/CENTER][/FONT][/SIZE]',
prefix: PIN_PREFIX,
status: true,
},
{
title: 'Направить в раздел Обжалование',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обраться в раздел Обжалование наказаний.<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Отказано.[/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},

{
title: 'Снять админа',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Администратор будет снят со своего поста.<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Беседа с кф',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]С куратором форума будет проведена беседа, ваша жалоба будет перерассмотрена.<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Наказать кф',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Куратор форума будет наказан, ваша жалоба будет перерассмотрена.<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Жалоба от 3 лица',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба составлена от 3-го лица.<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Жб с редактом',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Доказательства должны быть без обрезок/замазок.<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Оскорбительная жалоба',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]В вашей жалобе имеется слова оскорбительного характера, данная тема рассмотрению не пожлежит.<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Некликабельная ссылка',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ссылка на ваше доказательство не кликабельная, создайте новую тему с нормальной ссылкой.<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Не работают доказательства',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ссылка на ваше доказательство не работает, создайте новую тему с нормальной ссылкой.<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Нарушений от адм нету',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Нарушений со стороны администратора нет.[/CENTER]<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Смена наказания',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваше наказание будет заменено на другое.[/CENTER]<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Снять наказание',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваше наказание снято.<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Нету ссылки на жб',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Нужно предоставить ссылку на вашу жалобу.<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Нету /time',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]В вашей жалобе отсутствует /time.<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},

{
title: 'Жалоба оффтоп',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваша тема никак не отностится к разделу жалобы на администрацию.<br><br>" +
"[CENTER]Приятной игры на нашем сервере.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: 'Наказать админа и снять наказание',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваша жалоба одобрена, администратор будет наказан.<br>Ваше наказание будет снято.[/CENTER]<br><br>" +
'[CENTER]Приятной игры на нашем сервере.[/CENTER]',
prefix: WATCHED_PREFIX,
status: false,
},
{
title: 'Подделка докв',
content:
'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
"[CENTER]Ваши доказательства подделаны, форумный аккаунт будет заблокирован.[/CENTER]<br><br>" +
'[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]',
prefix: WATCHED_PREFIX,
status: false,
},
 {
            title: '----------------------------------------------------------------|Куратор форума|---------------------------------------------------------------',
      content:
          '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',

},
    {
title: '| ОСКОРБЛЕНИЕ РОДНИ 7 ДНЕЙ |',
content:
"[CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
"[CENTER] [COLOR=AQUA][ICODE] После проверки вашей жалобы было выяснено, что игрок нарушил пункт 3.04 общих правил сервера , следственно он получает наказание ввиде блокировки аккаунта на 7 дней [/ICODE][/COLOR][/CENTER]<br><br>"+
"[CENTER] [COLOR=AQUA][ICODE] Одобрено [/ICODE][/COLOR][/CENTER]<br><br>"+
'[CENTER] [COLOR=AQUA][ICODE] Приятной игры на нашем сервере.  [/ICODE][/COLOR] [/CENTER]',
prefix: PIN_PREFIX,
status: true,
},
       {
title: '| ОСКОРБЛЕНИЕ РОДНИ 15 ДНЕЙ |',
content:
"[CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
"[CENTER] [COLOR=AQUA][ICODE] После проверки вашей жалобы было выяснено, что игрок нарушил пункт 3.04 общих правил сервера , следственно он получает наказание ввиде блокировки аккаунта на 15 дней [/ICODE][/COLOR][/CENTER]<br><br>"+
"[CENTER] [COLOR=AQUA][ICODE] Одобрено [/ICODE][/COLOR][/CENTER]<br><br>"+
'[CENTER] [COLOR=AQUA][ICODE] Приятной игры на нашем сервере.  [/ICODE][/COLOR] [/CENTER]',
prefix: PIN_PREFIX,
status: true,
},
       {
title: '| УПОМИНАНИЕ РОДНИ 120 МУТ |',
content:
"[CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
"[CENTER] [COLOR=AQUA][ICODE] После проверки вашей жалобы было выяснено, что игрок нарушил пункт 3.04 общих правил сервера , следственно он получает наказание ввиде блокировки игрового чата на 120 минут [/ICODE][/COLOR][/CENTER]<br><br>"+
"[CENTER] [COLOR=AQUA][ICODE] Одобрено [/ICODE][/COLOR][/CENTER]<br><br>"+
'[CENTER] [COLOR=AQUA][ICODE] Приятной игры на нашем сервере.  [/ICODE][/COLOR] [/CENTER]',
prefix: PIN_PREFIX,
status: true,
},
        {
title: '| НОН РП ОБМАН |',
content:
"[CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
"[CENTER] [COLOR=AQUA][ICODE] После проверки вашей жалобы было установлено, что игрок нарушил пункт 2.05 общих правил сервера, касающийся нон-РП обмана. В связи с этим, аккаунт игрока будет заблокирован навсегда.[/ICODE][/COLOR][/CENTER]<br><br>"+
"[CENTER] [COLOR=AQUA][ICODE] Одобрено [/ICODE][/COLOR][/CENTER]<br><br>"+
'[CENTER] [COLOR=AQUA][ICODE] Приятной игры на нашем сервере.  [/ICODE][/COLOR] [/CENTER]',
prefix: PIN_PREFIX,
status: true,
},
    {
title: '| СТОРОННЕЕ ПО |',
content:
"[CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER]<br><br>"+
"[CENTER] [COLOR=AQUA][ICODE] После проверки вашей жалобы было установлено, что игрок нарушил пункт 2.22 общих правил сервера, связанный с использованием читов. В связи с этим, игрок будет заблокирован навсегда.[/ICODE][/COLOR][/CENTER]<br><br>"+
"[CENTER] [COLOR=AQUA][ICODE] Одобрено [/ICODE][/COLOR][/CENTER]<br><br>"+
'[CENTER] [COLOR=AQUA][ICODE] Приятной игры на нашем сервере.  [/ICODE][/COLOR] [/CENTER]',
prefix: PIN_PREFIX,
status: true,
},

];

$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

// Добавление кнопок при загрузке страницы
addButton('На рассмотрение', 'pin');
addButton('КП', 'teamProject');
addButton('Одобрено', 'accepted');
addButton('Отказано', 'unaccept');
addButton('Закрыто', 'close');
addButton('Ответы', 'selectAnswer');

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