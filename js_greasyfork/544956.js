// ==UserScript==
// @name script for forum to га/зга
// @namespace Masik
// @version 1.0
// @description Рабочая версия
// @author Masik Doxbinov
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant none
// @license MIT
// @collaborator
// @icon https://icons.iconarchive.com/icons/graphicloads/flat-finance/128/certificate-icon.png
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/544956/script%20for%20forum%20to%20%D0%B3%D0%B0%D0%B7%D0%B3%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/544956/script%20for%20forum%20to%20%D0%B3%D0%B0%D0%B7%D0%B3%D0%B0.meta.js
// ==/UserScript==
(function () {
'esversion 6' ;
const FAIL_PREFIX = 4;
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const OKAY_PREFIX = 8;
const WAIT_PREFIX = 2;
const WATCH_PREFIX = 9;
const SA_PREFIX = 11;
const CP_PREFIX = 10;
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECIAL_PREFIX = 11;
const TECH_PREFIX = 13;
const buttons = [
  {
 dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(83, 5, 252 , 0.5); font-family: UtromPressKachat',
    title: '------------------------------------------------------------- Жалобы на игроков -----------------------------------------------------------------',
     },
	{
title: '| Отправить на рассмотрение |',
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 165, 0, 178.5); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Ваша жалоба взята на рассмотрение. Пожалуйста, ожидайте ответа.[/CENTER]<br><br>" +
'[CENTER][COLOR=#ffd838]На рассмотрении…[/COLOR][/CENTER][/FONT][/SIZE]',
 prefix: PIN_PREFIX,
	  status: true,
    },
{
title: '| Не хватает /time |',
   dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(170, 0, 0 , 1); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]На доказательствах отсутствует /time.[/CENTER]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '| Док-ва более 3-х минут |',
  dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(170, 0, 0 , 1); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Ваши доказательства длятся более 3-ëх минут. Нужно указать тайм-коды: условий,обмена и момент обмана.[/CENTER]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '| Форма подачи жалобы |',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 255, 178.5); font-family: UtromPressKachat',
content:
'[SIZE=4][][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[B][CENTER][COLOR=lavender]Ваша жалоба составлена не по форме, пожалуйста ознакомьтесь с правилами подачи жалоб : [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-игроков.3429394/']*Нажмите сюда*[/URL]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{ title: '| Доказательства обрываются |',
 dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(170, 0, 0 , 1); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New[COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Ваши доказательства обрываются. Используйте фото/видео хостинги как Youtube/Rutube и создайте новую жалобу .[/CENTER]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: '| более 3 дней |',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(170, 0, 0 , 1); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]С момента нарушения прошло более 3 дней.[/CENTER]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '| Нет доказательств |',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(170, 0, 0 , 1); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]В вашей жалобе отсутсвуют доказательства. Используйте фото/видео хостинги как Imgur,Youtube,Япикс,Rutube. [/CENTER]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '| Недостаточно доказательств |',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(170, 0, 0 , 1); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]В вашей жалобе недостаточно доказательств. [/CENTER]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
    {
	  title: '| В ЖБ на сотрудников |',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(170, 0, 0 , 1); font-family: UtromPressKachat',
content:
'[SIZE=4][FON=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Обратитесь в раздел жалоб на сотрудников данной фракции. [/CENTER]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
	},
{
title: '| Передать Теху |',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 0, 255, 0.5); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[B][CENTER][COLOR=lavender] Ваша жалоба была передана техническому специалисту сервера, пожалуйста ожидайте ответа..<br><br>" +
'[CENTER][COLOR=blue]Передано Техническому Специалисту.[/COLOR][/CENTER]',
prefix: TECH_PREFIX,
status: true,
},
 {
title: '| нужен фрапс |',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(170, 0, 0 , 1); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]В таких случаях нужен фрапс (видеофиксация).[/CENTER]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
    {
 title: '| нет условий |',
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(170, 0, 0 , 1); font-family: UtromPressKachat',
 content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]В ваших доказательствах отсутствуют условия обмена[/CENTER]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
          {
title: '| Док-ва более 3-х минут |',
               dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(170, 0, 0 , 1); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Ваши доказательства длятся более 3-ëх минут. Нужно указать тайм-коды: условий,обмена и момент обмана.[/CENTER]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
     {
title: '| нет доступа к доказательствам |',
          dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(170, 0, 0 , 1); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]К вашим доказательствам нет доступа/битая ссылка. Просьба создать новую жалобу и предоставть рабочие доказательства[/CENTER]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '| Игрок будет наказан |',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 128, 0, 178.5); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'+
"[CENTER]Игрок будет наказан. Благодарим вас за обращение.[/CENTER]<br><br>" +
'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
    {
 dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(83, 5, 252 , 0.5); font-family: UtromPressKachat',
title: '-------------------------------------------------------- Жалобы на администрацию --------------------------------------------------------',
},
{
title: '| Прошло более 48 часов |',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(170, 0, 0 , 1); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'+
"[CENTER]С момента выдачи наказания прошло более 48-ми часов.[/CENTER]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '| Окно бана |',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(170, 0, 0 , 1); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'+
"[CENTER]Зайдите в игру и сделайте скрин окна с баном после чего,напишите жалобу заново.[/CENTER]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '| Нет нарушений |',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(170, 0, 0 , 1); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'+
"[CENTER] Исходя из выше приложенных доказательств, нарушения со стороны администратора - не имееться!.[/CENTER]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '| Наказание верное |',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(170, 0, 0 , 1); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'+
"[B][CENTER][COLOR=lavender] Проверив доказательства администратора, было принято решение, что наказание выдано верно<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
    {
title: '| Форма подачи жалобы |',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 255, 178.5); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[B][CENTER][COLOR=lavender]Ваша жалоба составлена не по форме, пожалуйста ознакомьтесь с правилами подачи жалоб : [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-администрацию.3429349/']*Нажмите сюда*[/URL]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
    {
title: '| скриншот |',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(5, 248, 252, 178.5); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[B][CENTER][COLOR=lavender]Вы должны прикрепить конкретно скриншот окна с блокировкой.<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: '| В ЖБ на теха |',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 0, 255, 0.5); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'+
"[B][CENTER][COLOR=lavender] Вам было выдано наказания Техническим специалистом, вы можете написать жалобу здесь : [URL='https://forum.blackrussia.online/forums/Сервер-№87-podolsk.3816/']*Нажмите сюда*[/URL]<br><br>" +
'[CENTER][COLOR=#ff0000]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: '| Передать ГА |',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(128, 0, 0, 178.5); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'+
"[B][CENTER][COLOR=lavender] Жалоба передана Главному Администратору , пожалуйста ожидайте ответа.<br><br>" +
'[CENTER][COLOR=#ff0000]Передано Главному Администратору.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: GA_PREFIX,
status: true,
},
{
title: '| Наказание по ошибке |',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 128, 0, 178.5); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'+
"[B][CENTER][COLOR=lavender] В следствие беседы с администратором, было выяснено, наказание было выдано по ошибке.<br><br>" +
"[B][CENTER][COLOR=lavender] Наказание будет снято в течении 24-х часов если еще присутствует."+
'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
    {
title: '| отредачено |',
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(170, 0, 0 , 1); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'+
"[B][CENTER][COLOR=lavender] Ваши доказательства отредактированы, следовательно жалоба рассмотрению не подлежит<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '| Беседа с админом |',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 128, 0, 178.5); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'+
"[B][CENTER][COLOR=lavender] Ваша жалоба была одобрена и будет проведена беседа с администратором.<br><br>" +
"[B][CENTER][COLOR=lavender] Приносим свои извинения за данную ситуацию."+
'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
{
title: '| Передать спецам |',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 255, 102, 178.5); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New] [COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'+
"[B][CENTER][COLOR=lavender] Жалоба передана Специальному Администратору, а так же его Заместителям, пожалуйста ожидайте ответа..<br><br>" +
'[B][CENTER][COLOR=yellow]Передано Специальной Администрации[/FONT][/COLOR][/CENTER][/B]',
prefix: SPECIAL_PREFIX,
status: true,
},
    {
 dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(83, 5, 252 , 0.5); font-family: UtromPressKachat',
title: '-------------------------------------------------------------------- Обжалования --------------------------------------------------------------------',
},
    {
title: '| Обжалован |',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 128, 0, 178.5); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'+
"[CENTER]Ваше обжалование одобрено, наказание будет снято, впредь не совершайте подобных ошибок..[/CENTER]<br><br>"+
'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
    {
title: '| Снят ЧСС |',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 128, 0, 178.5); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'+
"[CENTER]Вы будете вынесеныы из Черного Списка Сервера.[/CENTER]<br><br>"+
'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
    {
title: '| Снят ЧСА |',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 128, 0, 178.5); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'+
"[CENTER]Вы будете вынесеныы из Черного Списка Администрации Проекта.[/CENTER]<br><br>"+
'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
    {
title: '| Снижено до 2 |',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 128, 0, 178.5); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier Newn][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'+
"[CENTER]Блокировка вашего аккаунта будет снижена до 2-ух дней.[/CENTER]<br><br>"+
'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
    {
title: '| Отказано |',
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(170, 0, 0 , 1); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'+
"[B][CENTER][COLOR=lavender]В обжаловании вашего наказания отказано.<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
   {
title: '| ответ дан |',
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(170, 0, 0 , 1); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'+
"[B][CENTER][COLOR=lavender]Ответ уже был дан в прошлой теме. За создание подобных тем ваш ФА может быть заблокирован.<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
    {
title: '| Отправить на рассмотрение |',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 165, 0, 178.5); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[CENTER]Ваше обжалование взято на рассмотрение. Пожалуйста, ожидайте ответа.[/CENTER]<br><br>" +
'[CENTER][COLOR=#ffd838]На рассмотрении…[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: PIN_PREFIX,
status: true,
},
    {
title: '| Не по форме |',
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 255, 178.5); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[B][CENTER][COLOR=lavender]Ваше обжалование составлено не по форме, пожалуйста ознакомьтесь с правилами подачи обжалований : [URL='https://forum.blackrussia.online/threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']*Нажмите сюда*[/URL]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: '| Передать Sakaro |',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 255, 102, 178.5); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'+
"[B][CENTER]Ваше обжалование передано<br><br>" +
"[B][CENTER][COLOR=#4169E1]Руководителю Модерации Дискорда.[/COLOR]<br><br>" +
'[B][CENTER][COLOR=yellow]Передано [COLOR=yellow][USER=17]Sakaro[/USER][/FONT][/COLOR][/CENTER][/B]',
prefix: COMMAND_PREFIX,
status: true,
    },
 {
title: '| Nrp обман |',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(170, 0, 0 , 1); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[B][CENTER][COLOR=lavender]Обжалование NonRP обмана возможно лишь в том случае ,если вы сами свяжитесь с обманутой стороной и будите готовы отдать украденное.​<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
    {
title: '| ошибка сервер |',
         dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(170, 0, 0 , 1); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[B][CENTER][COLOR=lavender]Вы ошиблись сервером.Обратитесь в раздел обжалований в нужном разделе.​<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
     {
title: '| ВК |',
           dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 165, 0, 178.5); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[B][CENTER][COLOR=lavender]Прикрепите ссылку на ваш ВК, на котором находится ЧС.​<br><br>" +
'[CENTER][COLOR=#ffd838]На рассмотрении…[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: PIN_PREFIX,
status: true,
},
    {
title: '| 24 часа |',
           dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 165, 0, 178.5); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[B][CENTER][COLOR=lavender]Ваш аккаунт будет разблокирован на 24 часа для исправления нарушения.​<br><br>" +
'[CENTER][COLOR=#ffd838]На рассмотрении…[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: PIN_PREFIX,
status: true,
    },
   {
 dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(83, 5, 252 , 0.5); font-family: UtromPressKachat',
    title: '------------------------------------------------------------ Жалобы на Лидеров -----------------------------------------------------------------',
	},
{
title: '| Беседа с лидером |',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 128, 0, 178.5); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'+
"[B][CENTER][COLOR=lavender] Ваша жалоба была одобрена и будет проведена беседа с лидером.<br><br>" +
"[B][CENTER][COLOR=lavender] Приносим свои извинения за данную ситуацию."+
'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
    {
title: '| Форма подачи жалобы |',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 255, 178.5); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>' +
"[B][CENTER][COLOR=lavender]Ваша жалоба составлена не по форме, пожалуйста ознакомьтесь с правилами подачи жалоб : [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.3429391/']*Нажмите сюда*[/URL]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
status: false,
},
{
title: '| Нет нарушений |',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(170, 0, 0 , 1); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'+
"[CENTER] Исходя из выше приложенных доказательств, нарушения со стороны лидера - не имееться!.[/CENTER]<br><br>" +
'[CENTER][COLOR=#ff0000]Отказано, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: UNACCEPT_PREFIX,
status: false,
},
{
title: '| Наказание лидеру |',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(0, 128, 0, 178.5); font-family: UtromPressKachat',
content:
'[SIZE=4][FONT=Courier New][COLOR=#6d00eb][CENTER]{{ greeting }}, уважаемый(ая) {{ user.mention }}![/COLOR][/CENTER]<br>'+
"[B][CENTER][COLOR=lavender] Ваша жалоба была одобрена и лидер получит соответствующие наказание.<br><br>" +
"[B][CENTER][COLOR=lavender] Приносим свои извинения за данную ситуацию."+
'[CENTER][COLOR=#38ff4c]Одобрено, закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
prefix: ACCEPT_PREFIX,
status: false,
},
     {
 dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(83, 5, 252 , 0.5); font-family: UtromPressKachat',
    title: '------------------------------------------------------------ Role Play Биографии ----------------------------------------------------------------',
	},
     {
	  title: '| Биография одобрена |',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(139, 0, 139, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER][COLOR=rgb(255, 102, 178)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url]"+
		"[CENTER]Ваша RolePlay биография получает статус [COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR] <br>" +
        "[CENTER][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url]"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Courier New][CENTER]Приятной игры на сервере [COLOR=rgb(255, 102, 178)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: '| Биография отказана |',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER][COLOR=rgb(108, 5, 252)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url]"+
		"[CENTER]Ваша RolePlay биография получает статус [COLOR=rgb(255, 102, 178)]Отказано.[/COLOR] <br>" +
        "[CENTER][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url]"+
		"[CENTER][COLOR=rgb(255, 102, 178)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Courier New][CENTER]Приятной игры на сервере [COLOR=rgb(255, 102, 178)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: '| Мало инфо |',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER][COLOR=rgb(108, 5, 252)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url]"+
		"[CENTER]Ваша RolePlay биография получает статус Отказано, т.к. она содержит мало информации. <br>" +
        "[CENTER][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url]"+
		"[CENTER][COLOR=rgb(255, 102, 178)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Courier New][CENTER]Приятной игры на сервере [COLOR=rgb(255, 102, 178)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: '| Дата несходится |',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER][COLOR=rgb(108, 5, 252)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url]"+
		"[CENTER]Ваша RolePlay биография получает статус Отказано, т.к. дата рождения не сходится с возрастом или написана не полностью. <br>" +
        "[CENTER][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url]"+
		"[CENTER][COLOR=rgb(255, 102, 178)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Courier New][CENTER]Приятной игры на сервере [COLOR=rgb(255, 102, 178)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: '| Дубликат |',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER][COLOR=rgb(108, 5, 252)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url]"+
		"[CENTER]Ваша RolePlay биография получает статус Отказано, т.к. можно иметь только 1 RolePlay биографию на один аккаунт. <br>" +
        "[CENTER][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url]"+
		"[CENTER][COLOR=rgb(255, 102, 178)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Courier New][CENTER]Приятной игры на сервере [COLOR=rgb(255, 102, 178)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: '| 3-е лицо |',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER][COLOR=rgb(108, 5, 252)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url]"+
		"[CENTER]Ваша RolePlay биография получает статус Отказано, т.к. она написана от третьего лица. <br>" +
        "[CENTER][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url]"+
		"[CENTER][COLOR=rgb(255, 102, 178)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Courier New][CENTER]Приятной игры на сервере [COLOR=rgb(255, 102, 178)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: '| Супер способности |',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER][COLOR=rgb(108, 5, 252)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url]"+
		"[CENTER]Ваша RolePlay биография получает статус Отказано, т.к. вы присвоили своему персонажу супер-способности. <br>" +
        "[CENTER][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url]"+
		"[CENTER][COLOR=rgb(255, 102, 178)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Courier New][CENTER]Приятной игры на сервере [COLOR=rgb(255, 102, 178)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: '| Заголовок |',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER][COLOR=rgb(108, 5, 252)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url]"+
		"[CENTER]Ваша RolePlay биография получает статус Отказано, т.к. заголовок написан не по форме. <br>" +
        "[CENTER][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url]"+
		"[CENTER][COLOR=rgb(255, 102, 178)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Courier New][CENTER]Приятной игры на сервере [COLOR=rgb(255, 102, 178)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: '| Ошибки |',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER][COLOR=rgb(108, 55, 252)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url]"+
		"[CENTER]Ваша RolePlay биография получает статус Отказано, т.к. в ней содержится много грамматических ошибок. <br>" +
        "[CENTER][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url]"+
		"[CENTER][COLOR=rgb(255, 102, 178)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Courier New][CENTER]Приятной игры на сервере [COLOR=rgb(255, 102, 178)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: '| Коппипаст |',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER][COLOR=rgb(108, 5, 252)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url]"+
		"[CENTER]Ваша RolePlay биография получает статус Отказано, т.к. она скопирована. <br>" +
        "[CENTER][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url]"+
		"[CENTER][COLOR=rgb(255, 102, 178)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Courier New][CENTER]Приятной игры на сервере [COLOR=rgb(255, 102, 178)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: '| ОФФТОП |',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER][COLOR=rgb(108, 5, 252)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url]"+
		"[CENTER]Ваша тема не относится к данному разделу. <br>" +
        "[CENTER][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url]"+
		"[CENTER][COLOR=rgb(255, 102, 178)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Courier New][CENTER]Приятной игры на сервере [COLOR=rgb(255, 102, 178)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: '| Неадекватная Биография |',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER][COLOR=rgb(108, 5, 252)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url]"+
		"[CENTER] Ваша RolePlay биография получает статус Отказано, т.к. в ней присутвует нецензурная брань или же оскорбления. <br>" +
        "[CENTER][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url]"+
		"[CENTER][COLOR=rgb(255, 102, 178)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Courier New][CENTER]Приятной игры на сервере [COLOR=rgb(255, 102, 178)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
   {
	  title: '| Повтор |',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER][COLOR=rgb(108, 5, 252)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url]"+
		"[CENTER]Ваша RolePlay биография получает статус Отказано, т.к. ответ был дан в предыдущей теме. <br>" +
        "[CENTER][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url]"+
		"[CENTER][COLOR=rgb(255, 102, 178)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Courier New][CENTER]Приятной игры на сервере [COLOR=rgb(255, 102, 178)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
	  title: '| не по форме |',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER][COLOR=rgb(108, 5, 252)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url]"+
        "[CENTER]Ваша Role Play Биография составлена не по форме.<br>" +
		"[CENTER]Создайте новую Биографию по форме.<br>" +
         "[CENTER][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url]"+
		'[FONT=Courier New][CENTER]Приятной игры на сервере [COLOR=rgb(255, 102, 178)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
 dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(83, 5, 252 , 0.5); font-family: UtromPressKachat',
    title: '---------------------------------------------------------------- Role Play Ситуации --------------------------------------------------------------',
	},
    {
	  title: '| Ситуация одобрена |',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(139, 0, 139, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER][COLOR=rgb(108, 5, 252)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url]"+
		"[CENTER]Ваша RolePlay ситуация получает статус [COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR] <br>" +
        "[CENTER][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url]"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Courier New][CENTER]Приятной игры на сервере [COLOR=rgb(255, 102, 178)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: '| Ситуация отказана |',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER][COLOR=rgb(108, 5, 252)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url]"+
		"[CENTER]Ваша RolePlay ситуация получает статус [COLOR=rgb(255, 102, 178)][COLOR=rgb(255, 102, 178)]Отказано.[/COLOR][/COLOR] <br>" +
        "[CENTER][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url]"+
		"[CENTER][COLOR=rgb(255, 102, 178)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Courier New][CENTER]Приятной игры на сервере [COLOR=rgb(255, 102, 178)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
     {
 dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(83, 5, 252 , 0.5); font-family: UtromPressKachat',
    title: '------------------------------------------------------ Неоф. Role Play организация --------------------------------------------------------',
	},
     {
	  title: '| Орг-ция одобрена |',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(139, 0, 139, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER][COLOR=rgb(108, 5, 252)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url]"+
		"[CENTER]Ваша Неофициальная RolePlay организация получает статус [COLOR=rgb(0, 255, 0)][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/COLOR] <br>" +
        "[CENTER][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url]"+
		"[CENTER][COLOR=rgb(0, 255, 0)][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Courier New][CENTER]Приятной игры на сервере [COLOR=rgb(255, 102, 178)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: OKAY_PREFIX,
	  status: false,
	},
    {
	  title: '| Орг-ция отказана |',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER][COLOR=rgb(108, 5, 252)]Доброго времени суток, уважаемый (-ая)[/COLOR] {{ user.mention }}.[/CENTER]<br>' +
        "[CENTER][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url]"+
		"[CENTER]Ваша Неофициальная RolePlay организация получает статус [COLOR=rgb(255, 102, 178)]Отказано.[/COLOR] <br>" +
        "[CENTER][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url][url=https://postimg.cc/f3Qn3c9W][img]https://i.postimg.cc/f3Qn3c9W/fYg51po.gif[/img][/url]"+
		"[CENTER][COLOR=rgb(255, 102, 178)][ICODE]Отказано, закрыто[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]" +
		'[FONT=Courier New][CENTER]Приятной игры на сервере [COLOR=rgb(255, 102, 178)]Podolsk(87).[/COLOR][/CENTER][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');


// addButton('На рассмотрение', 'pin');
// addButton('Тех. спецу', 'tech');
	addButton('На рассмотрении', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255,165,0, 0.5); font-family: UtromPressKachat',);
    addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5); font-family: UtromPressKachat',)
    addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5); font-family: UtromPressKachat',)
    addButton('Ответы', 'selectAnswer', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(147, 112, 219, 0.5); font-family: UtromPressKachat',);
	// Поиск информации о теме
	const threadData = getThreadData();

 $('button#pin').click(() => editThreadData(WAIT_PREFIX, true));
 $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
 $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
 $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
 $('button#tech').click(() => editThreadData(TECH_PREFIX, true));
 $('button#accepted').click(() => editThreadData(OKAY_PREFIX, false));
 $('button#watch').click(() => editThreadData(WATCH_PREFIX, false));
 $('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
 $('button#unaccept').click(() => editThreadData(FAIL_PREFIX, false));
    $(`button#selectAnswer`).click(() => {
	XF.alert(buttonsMarkup(buttons), null, 'ОТВЕТЫ');
	buttons.forEach((btn, id) => {
	if (id > 1) {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
	}
	else {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
	}
	});
	});
	});

    function addButton(name, id, style) {
         $('.button--icon--reply').before(
	`<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`,
	);
	}
	function addAnswers() {
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 5px; margin-top: 10px; border-radius: 13px;">ОТВЕТЫ</button>`,
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
	6 < hours && hours <= 12
	  ? 'Доброе утро'
	  : 12 < hours && hours <= 17
	  ? 'Добрый день'
	  : 17 < hours && hours <= 6
	  ? 'Добрый вечер'
	  : 'Добрый вечер',
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
$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
  })();