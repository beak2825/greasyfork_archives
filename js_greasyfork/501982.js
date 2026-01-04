// ==UserScript==
// @name         ORANGE || Скрипт для Кураторов форума
// @namespace    https://forum.blackrussia.online
// @version      2.5
// @description  По вопросам(ВК): https://vk.com/lykatok
// @author       Romantic Melodies
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license 	 MIT
// @collaborator none
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/501982/ORANGE%20%7C%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/501982/ORANGE%20%7C%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closes.
const TECHADM_PREFIX = 13 // Prefix that will be set when thread techadm
const VAJNO_PREFIX = 1;
const WATCHED_PREFIX = 9;
const TEX_PREFIX = 13;
const PREFIKS = 0;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const NARASSMOTRENIIORG_PREFIX = 2;
const buttons = [
	{
        title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ⠀ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ Для Кураторов по форуме ЛОГИᅠ ᅠ   ᅠ ᅠ ᅠ ᅠ ⠀ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ⠀',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	},
   {
		title: 'Взято на рассмотрение',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Ваша тема взята на рассмотрение, ожидайте ответ в ближайшее время<br>Часто рассмотрение темы может занять определенное время.<br>[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/CENTER][/FONT][/SIZE]',
		prefix: PIN_PREFIX,
		status: true,
	},
    {
		title: 'Оффтоп',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваше обращение содержит контент, который нарушает правила пользования форумом. Пожалуйста, прекратите создавать подобные обращения, иначе Ваш форумный аккаунт может быть наделен статусом временной или постоянной блокировки.<br>Ознакомиться с правилами пользования форумом Вы можете здесь: [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/']клик[/URL] <br>" +
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
{
	  title: '| Нету в системе логов |',
	  content:
        '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
        "[CENTER]В системе логирования нарушений не обнаружено..<br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Нет нарушений |',
	  content:
		 '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Со стороны игрока не найдены какие либо нарушение, пожалуйста ознакомьтесь с правилами проекта..<br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: '| От 3 лица |',
	  content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Жалоба составлена от 3-го лица, мы не можем ее рассмотреть.<br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Отсутствуют док-ва |',
	  content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Вы не предоставили какие либо доказательства, прикрепите доказательства загруженные на фото/видео хостинг.<br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Недостаточно док-в |',
	  content:
        '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Предоставленные доказательства недостаточно для принятие решения, если у вас имеют дополнительные доказательства прикрепите.<br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: '| Док-ва отредактированы |',
	  content:
        '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER] Доказательства были подвергнуты редактированию - следовательно, рассмотрению не подлежит. <br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: '| Док-ва в соц-сети |',
	  content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER] Вашa жалобa отказана т.к доказательства загруженные в соцсети не принимаются. Загрузите док-ва в фото/видео хостинги как YouTube, Imgur, Япикс. <br><br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Не работают док-ва |',
	  content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
        "[CENTER]Ваши доказательства не рабочие или же битая ссылка, пожалуйста загрузите на видео/фото хостинге.<br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| Нету /time |',
	  content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER][CENTER]В предоставленных доказательств отсутствует время (/time), не подлежит рассмотрению.<br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Нужен фрапс |',
	  content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]В данной ситуации обязательно должен быть фрапс (видео фиксация) всех моментов, в противном случае жалоба будет отказана.<br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: '| Неполный фрапс |',
	  content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Видео запись не полная, к сожелению мы вынуждены отказать.<br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Нету условий сделки |',
	  content:
        '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER] В ваших доказательствах отсутствуют условия сделки, соответственно рассмотрению не подлежит.<br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Нету Тайм-кодов |',
	  content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER] Если видео длится 3х и более минут, вам следует указать таймкоды, в противном случае жалоба будет отказана.<br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
      {
	  title: '| Системный промо |',
	  content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была проверена и вердикт такой: данный промокод является системным, или был выпущен  разработчиками [/Spoiler]<br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Уже был ответ |',
	  content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Вам уже был дан ответ в прошлой жалобе, пожалуйста перестаньте делать дубликаты, иначе ваш Форумный аккаунт будет заблокирован.<br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| Уже был наказан |',
	  content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба отказана, т.к нарушитель уже был наказан ранее. Просьба не создавать дубликаты данной темы.<br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Прошло 72 часа |',
	  content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]С момента совершения нарушения прошло 72 часа, не подлежит рассмотрению.<br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: '| Долг был дан не через банк |',
	  content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Займ может быть осуществлен только через зачисление игровых ценностей на банковский счет.<br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
      {
	  title: '| После срока возврата долга прошло 10 дней |',
	  content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Жалоба на должника подается в течение 10 дней после истечения срока займа.<br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: '| Условия о долге в соц. сетях |',
	  content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Договоры вне игры не будут считаться доказательствами.<br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 {
        title: ' ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ⠀ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ⠀ᅠ ᅠ  RP Нарушенияᅠ ᅠᅠ ᅠ ᅠ    ᅠ ᅠ ᅠ ᅠ ⠀ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ⠀ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	},
   {
	  title: '| DM |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]2.19 | Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины.[color=red]  | Jail 60 минут[/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
       '[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| DB |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]2.13 | Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [color=red] | Jail 60 минут. [/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| RK |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]2.14 |  Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [color=red] | Jail 30 минут. [/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| TK |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]2.15 |  Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины.[color=red]  | Jail 60 минут / Warn (за два и более убийства)[/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| SK |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER][COLOR=lavender]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]2.16 | Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них.[color=red]  | Jail 60 минут / Warn (за два и более убийства)[/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Mass DM |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]2.20 |  Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более.[color=red]  | Warn / Бан 7-15 дней.[/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| ЕПП  |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]2.47 |Запрещено ездить по полям на легковые машины и мотоциклах. [color=red]  | Jail 30 минут[/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| ЕПП фура/инко |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]2.47 | [ Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [color=red]  | Jail 60 минут[/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Уход от RolePlay |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]2.02 | Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [color=red] | Jail 30 минут / Warn [/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Сбив анимки |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]2.55 |  Запрещается багоюз связанный с анимацией в любых проявлениях. [color=red]  | Jail 60-120 минут[/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Обход системы |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]2.21 |  Запрещено пытаться обходить игровую систему или использовать любые баги сервера [color=red]  | Ban 15-30 дней / Permban[/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Слив склада |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]2.21 |  2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [color=red]  | Ban 15-30 дней / Permban[/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Амаральные действия |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]2.08 |  Запрещена любая форма аморальных действий сексуального характера в сторону игроков [color=red]  | Jail 30 минут / Warn[/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Обман на долг |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]2.57 |  Запрещается брать в долг игровые ценности и не возвращать их.[color=red]  | Ban 30 дней / Permban[/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Читы/Стороннее ПО/Сборка |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]2.05 |  Запрещено хранить / использовать / распространять стороннее программное обеспечение, сборки или любые другие средства, позволяющие получить преимущество над другими игроками[color=red] | Ban 15 - 30 дней / PermBan [/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Редактирование в личных целях |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]* | Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком[color=red]  | Ban 7 дней + ЧС организации [/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Убийство при задержании |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler] |  Запрещено целенаправленно убивать преступника во время задержания без весомой Role Play причины.  [color=red]  | Warn [/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Арест в казино/аукционе |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]2.50  | Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [color=red]  | Ban 7 - 15 дней + увольнение из организации[/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
 {
        title: ' ᅠ ᅠ ᅠ ᅠ ⠀ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ⠀ᅠ ᅠ  ⠀ᅠ ᅠ  Чат Нарушения ᅠ ᅠ ᅠ ᅠ ᅠ ⠀ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ⠀ᅠ ᅠ  ⠀ᅠ ᅠ  ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	},
    {
	  title: '| КАПС |',
	  content:
        '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]RВаша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]3.02 | Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [color=red]  | Mute 30 минут[/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Флуд |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]3.05 | Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока[color=red]  | Mute 30 минут[/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: '| MG |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]2.18  Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе.[color=red]  | Mute 30 минут.[/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Оск в /n |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]3.03 |  Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены[color=red]  | Mute 30 минут[/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Оск/Упом родни |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]3.04 |  Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC)  [color=red]  | Mute 120 минут / Ban 7-15 дней.[/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Мат в /v |',
      content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]3.23 | Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате[color=red]  | Mute 30 минут[/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Слив чата |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]3.08 | Запрещены любые формы «слива» посредством использования глобальных чатов[color=red]  | Permban[/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Угрозы наказаниями |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]3.09 | Запрещены любые угрозы о наказании игрока со стороны администрации [color=red]  | Mute 30 минут[/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Оск адм |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]2.54 |  Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации.   [color=red]  | Mute 180 минут.[/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Ввод в забл. (командами) |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]3.11 |Запрещено введение игроков проекта в заблуждение путем злоупотребления командами[color=red]  | Ban 15-30 / Permban[/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Полит/Религ/Подстрек на наруш игроков |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]3.18 | Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов[color=red]  | Mute 120 минут / Ban 10 дней. [/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Транслит |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]3.20 | Запрещено использование транслита в любом из чатов[color=red]  | Mute 30 минут[/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Общение на других языках |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]3.01 |  Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке [color=red]  | Mute 30 минут [/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Промокоды |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]3.21 | Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [color=red]  | Ban 30 дней.[/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Объявления в госс |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]3.22 |  Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [color=red]  | Mute 30 минут[/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
	  title: '| ООС угрозы |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]2.37 |  Запрещены OOC угрозы, в том числе и завуалированные [color=red]  | Ban 15-30 дней / Permban [/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Перенос конфликта |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]2.36 | Запрещено переносить конфликты из IC в OOC, и наоборот [color=red]  | Warn / Ban 15-30 дней [/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Реклама |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]2.31 |  Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное  [color=red] | Ban 7 дней / PermBan [/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
	  title: '| Оскорбление адм |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]*  |Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации[color=red]  | Mute 180 минут[/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
	  title: '| Выдача себя за адм |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]*  |  Запрещена выдача себя за администратора, если таковым не являетесь[color=red]  | Ban 7 - 15 + ЧС администрации[/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
     {
        title: ' ᅠ ᅠ ᅠ ᅠ ᅠ ⠀ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ⠀ᅠ ᅠ  ⠀ᅠ ᅠ  NRP Нарушения ᅠ ᅠ ᅠ ᅠ ⠀ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ⠀ᅠ ᅠ  ⠀ᅠ ᅠ  ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	},
      {
	  title: '| NonRP поведение |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]2.13 |  Запрещено поведение, нарушающее нормы процессов Role Play режима игры [color=red] | Jail 30 минут. [/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
	  title: '| NonRP обман |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]2.05 |  Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики[color=red]  | Permban[/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
	  title: '| NonRP edit |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red] | Запрещено редактирование объявлений, не соответствующих ПРО[color=red]  | Mute 30 минут[/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
	  title: '| NonRP эфир |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]| Запрещено проведение эфиров, не соответствующих Role Play правилам и логике[color=red]  | Mute 30 минут[/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
title: '| NonRP розыск |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red] | Запрещено выдавать розыск без Role Play причины[color=red]  | Warn / Jail 30 минут [/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| NonRP В/ч |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red] |  Запрещено нападать на военную часть нарушая Role Play [color=red]  | Warn (для ОПГ) / Jail 30 минут (для Гражданских)  [/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
	  title: '| NonRP охранник |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]  | Охраннику казино запрещено выгонять игрока без причины[color=red]  | Увольнение с должности | Jail 30 минут[/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| Nick_Name оск |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red] |  Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные)[color=red]  | Устное замечание + смена игрового никнейма / PermBan[/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| Фейк |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была рассмотрена и одобрена, игрок получит следующие наказание.[Spoiler][color=red]* 4.10 | Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию. Пример: подменять букву i на L и так далее, по аналогии. [color=red]  | PermBan [/Spoiler]<br>"+
		"[CENTER] Наказание будет выдано в течение 24 часов.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
 {
        title: ' ᅠ ᅠ ᅠ ᅠ ⠀ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ⠀ᅠ ᅠ  ⠀ᅠ ᅠ    Передача жалобы ᅠ ᅠ ᅠ ᅠ ⠀ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ⠀ᅠ ᅠ  ⠀ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	},
     {
	  title: '| Передать ГКФ |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была передана [COLOR=RED]Главному[/COLOR] [COLOR=yellow]Куратору[/COLOR] [COLOR=blue]Форума[/COLOR] на рассмотрение<br>"+
        "[B][CENTER][COLOR=lavender]Возможно на рассмотрении жалобы потребуется больше времени. Просьба ожидать ответа и не создавать копий данной темы. <br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Ожидайте.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: VAJNO_PREFIX,
	  status: true,
	},
    {
	  title: '| Передать Теху |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была передана Техническому специалисту сервера на рассмотрение<br>"+
        "[B][CENTER][COLOR=lavender]Возможно на рассмотрении жалобы потребуется больше времени. Просьба ожидать ответа и не создавать копий данной темы. <br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Ожидайте.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: TEX_PREFIX,
	  status: true,
	},
{
	  title: '| Передать Га |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была передана Главному Администратору на рассмотрение<br>"+
        "[B][CENTER][COLOR=lavender]Возможно на рассмотрении жалобы потребуется больше времени. Просьба ожидать ответа и не создавать копий данной темы. <br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Ожидайте.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: GA_PREFIX,
	  status: true,
	},

 {
     title: 'ᅠ ᅠ ᅠ ⠀ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ⠀ᅠ ᅠ  ⠀ᅠ ᅠ      ᅠᅠ В другой раздел ᅠ ᅠ ᅠ ᅠ ⠀ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ⠀ᅠ ᅠ  ⠀ᅠ ᅠ    ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	},

    {
	  title: '| В жалобы на АДМ |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Вы ошиблись разделом, обратитесь в раздел жалоб на администрацию. <br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Закрыто.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: '| В жалобы на лидеров |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Вы ошиблись разделом, обратитесь в раздел жалоб на лидеров. <br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Закрыто.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    	{
	  title: '| В жалобы на хелперов |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Обратитесь в раздел жалобу на агентов поддержки. <br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Закрыто.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: '| В жалобы на сотрудников |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Вы ошиблись разделом, обратитесь в раздел жалоб на сотрудников данной организации. <br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Закрыто.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
        title: '  ᅠ ᅠ ᅠ ᅠ ⠀ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ⠀ᅠ ᅠ  ⠀ᅠ ᅠ ᅠ RP Биография  ᅠ ᅠ ᅠ ᅠ ⠀ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ⠀ᅠ ᅠ  ⠀ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	},
	{
	  title: '| Одобрено |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER] Ваша RolePlay биография одобрена.<br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: '| Отказано |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша RolePlay биография отказана. Внимательно прочтите правила создания РП биографий закрепленые в данном разделе.<br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]отказана.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: '| Не по форме |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER] Ваша RolePlay биография составлена не по форме. Внимательно прочтите правила создания РП биографий закрепленые в данном разделе.<br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Закрыто.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: '| Заголовок не по форме |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER] Заголовок вашей RolePlay биографии составлен не по форме. Внимательно прочтите правила создания РП биографий закрепленые в данном разделе.<br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Закрыто.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: '| На доработке |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]В вашей RolePlay - биографии недостаточно информации. Даю вам 24 часа на ее дополнение/ исправление, иначе РП биография будет отказана.  <br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Закрыто.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: '| Не дополнил в течении 24 часов |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша RolePlay - биография отказана т.к вы ее не дополнили. Внимательно прочтите правила создания РП биографий закрепленые в данном разделе.<br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Уже одобрена |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша RolePlay - биография отказана т.к она уже была одобрена.<br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: '| Недостаточно инфы/неграмотно |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша RolePlay биография отказана, т.к в ней недостаточно информации, либо в ней допущены грамматические ошибки.<br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Недостаточно инфы во внешности |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша RolePlay биография отказана, т.к в ней недостаточно информации об описании внешности.<br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
{
	  title: '| Недостаточно инфы о характере |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша RolePlay биография отказана, т.к в ней недостаточно информации об описании характера.<br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
{
	  title: '| Недостаточно инфы об учёбе |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша RolePlay биография отказана, т.к в ней недостаточно информации об годах учёбы(образовании).<br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
{
	  title: '| Недостаточно инфы о детстве |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER] Ваша RolePlay биография отказана, т.к в ней недостаточно информации о годах жизни в период детства и юности.<br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
{
	  title: '| Недостаточно инфы о взрослой жизни |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER] Ваша RolePlay биография отказана, т.к в ней недостаточно информации о годах жизни в период взрослости.<br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
{
	  title: '| Мало инфы о семье |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша RolePlay - биография отказана т.к в пункте (Семья) не достаточно информации. Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. <br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: '| От 3-его лица |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER] Ваша RolePlay - биография отказана т.к она написана от 3-его лица. Внимательно прочтите правила создания РП биографий закрепленые в данном разделе.<br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Супергерой |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша RolePlay - биография отказана т.к вы приписали суперспособности своему персонажу. Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. <br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: '| Копипаст |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER] Ваша RolePlay - биография отказана т.к вы ее скопировали. Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. <br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: '| Нонрп ник |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша RolePlay - биография отказана т.к у вас NonRP NickName. Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. <br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: '| Ник англ |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша RolePlay - биография отказана т.к ваш NickName должен быть написан на русском языке. Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. <br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Д.Р. не совпадает с годом |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша RolePlay - биография отказана т.к дата рождения вашего персонажа и возраст не совпадают. Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. <br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: '| Дата рождения не полностью |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша RolePlay - биография отказана т.к ваша дата рождения расписана не полностью. Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. <br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 {
        title: '  ᅠ ᅠ ᅠ ᅠ ⠀ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ⠀ᅠ ᅠ  ⠀ᅠ ᅠ ᅠ ᅠRP Ситуации  ᅠ ᅠ ᅠ ᅠ ⠀ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ⠀ᅠ ᅠ  ⠀ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	},
    	{
	  title: '| Одобрено |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER] Ваша RolePlay - ситуация одобрена.<br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
     	{
	  title: '| Отказано |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша RolePlay - ситуация отказана. <br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| Не по форме |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша RolePlay - ситуация отказана т.к она составлена не по форме. <br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| Заголовок не по форме |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER] Заголовок вашей RolePlay ситуации составлен не по форме. Внимательно прочтите правила создания РП ситуаций закрепленые в данном разделе.<br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Закрыто.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  {
	  title: '| На доработке |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]В вашей RolePlay - ситуации недостаточно информации. Даю вам 24 часа на ее дополнение/ исправление, иначе РП ситуация будет отказана.  <br>"+
       '[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    	{
	  title: '| Не дополнил |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша RolePlay - ситуация отказана т.к вы ее не дополнили. Внимательно прочтите правила создания РП ситуаций закрепленые в данном разделе.<br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: '| Не туда |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша RolePlay - ситуация отказана т.к вы не туда попали. <br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| Не пишите лишнее(Счет банка и т.п. |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша RolePlay - ситуация отказана. Оформите ее без добавлений от себя, по типу (Банк счет...) и тд...<br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: '| Неграмотно |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER] Ваша RolePlay - ситуация отказана т.к она оформлена неграмотно. <br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: '| Копипаст |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша RolePlay - ситуация отказана т.к вы ее скопировали у другого человека. Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе. <br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Супергерой |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша RolePlay - ситуация отказана т.к вы приписали суперспособности своему персонажу. Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе. <br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 {
        title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ⠀ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ⠀ᅠ ᅠ Неоф.RP Организацииᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ⠀ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ⠀ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	},
    {
	  title: '| Одобрено |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша RolePlay - организация одобрена.<br>"+
		'[CENTER][I][COLOR=rgb(255,0,0)]Одобрено.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| Не по форме |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша RolePlay - организация отказана т.к она составлена не по форме. <br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
       {
	  title: '| На доработке |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]В вашей RolePlay - организации недостаточно информации. Даю вам 24 часа на ее дополнение/ исправление, иначе РП организация  будет отказана.  <br>"+
       '[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/CENTER][/FONT][/SIZE]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: '| Не дополнил |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша RolePlay - организация отказана т.к вы ее не дополнили. Внимательно прочтите правила создания РП организаций закрепленые в данном разделе.<br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: '| Не туда |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша RolePlay - организация отказана т.к вы не туда попали. <br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: '| Ник по англ(нужно русские) |',
	  content:
        '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша RolePlay - организация отказана т.к ваш все никнеймы должны быть написаны на русском языке. Внимательно прочитайте правила создания RP - организаций закрепленные в данном разделе. <br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: '| Неграмотно |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша RolePlay - организация отказана т.к она оформлена неграмотно. <br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: '| Копипаст |',
	  content:
       '[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша RolePlay - организация отказана т.к вы ее скопировали у другого человека. Внимательно прочитайте правила создания RP - организаций закрепленные в данном разделе. <br>"+
        '[CENTER][I][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
];
$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
   	addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);');
    addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);');
    addButton('На рассмотрении', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 173, 51, 0.5);');
    addButton('Техническому специалисту', 'techspec', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(17, 92, 208, 0.5);');
    addButton('ОТВЕТЫ','selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#techspec').click(() => editThreadData(TECHADM_PREFIX, true));

		$(`button#selectAnswer`).click(() => {
		XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
		buttons.forEach((btn, id) => {
			if(id > 1) {
				$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
			} else {
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