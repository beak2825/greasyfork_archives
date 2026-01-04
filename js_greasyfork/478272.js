	// // ==UserScript==
// @name         Скрипт ответов жалобы на игроков CHELYABINSK
// @namespace    https://forum.blackrussia.online
// @version      2.7
// @description  Always remember who you are!
// @author       Maga_Rahimow
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @collaborator Maga_Rahimow
// @icon https://icons.iconarchive.com/icons/google/noto-emoji-people-bodyparts/256/11960-victory-hand-light-skin-tone-icon.png
// @downloadURL https://update.greasyfork.org/scripts/478272/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D0%BE%D0%B2%20%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B%20%D0%BD%D0%B0%20%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2%20CHELYABINSK.user.js
// @updateURL https://update.greasyfork.org/scripts/478272/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D0%BE%D0%B2%20%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B%20%D0%BD%D0%B0%20%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2%20CHELYABINSK.meta.js
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
const buttons = [
{
	title: '|',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
},
{
	title: 'Администрация не может выдать наказание',
	content:

	"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
	"[B][CENTER][COLOR=lavender][FONT=georgia][Color=#ff0000][/color] Администрация не может выдать наказание по вашим доказательствам[/color].[/CENTER][/B]<br><br>"+
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
	"[CENTER][I][B][COLOR=rgb(0, 255, 0)]Одобрено[/COLOR], [COLOR=rgb(255, 0, 0)]закрыто.[/COLOR][/B][/I][/CENTER]<br>"+
	"[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]",

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: '____________________________________________________ | УБИЙСТВА | _____________________________________________________',
},
{
	title: 'DM',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]2.19.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4] | Jail 60 минут[/SIZE][/FONT][/COLOR]<br>" +
	"[LEFT][FONT=times new roman][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
	"[LEFT][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/SIZE][/FONT][/COLOR][/LEFT]<br>" +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA RolePlay.[/SIZE][/FONT][/COLOR]<br><br>" +
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'MASS DM',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]2.20. [/SIZE][/FONT][/COLOR][I][B][FONT=times new roman][COLOR=rgb(209, 213, 216)]Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [/COLOR]|[COLOR=rgb(255, 0, 0)] Warn / Ban 3 - 7 дней[/COLOR][/FONT][/B][/I]<br>" +
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'RK',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]2.14. [/COLOR] [COLOR=rgb(209, 213, 216)]Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [/COLOR]| [COLOR=rgb(255, 0, 0)]Jail 30 минут[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'TK',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]2.15. [/COLOR] [COLOR=rgb(209, 213, 216)]Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины[/COLOR] | [COLOR=rgb(255,0,0)]Jail 60 минут[/COLOR] / Warn (за два и более убийства)[/FONT][/I][/B][/CENTER]<br>"+
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'SK',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(0, 255, 0)]2.16.[/COLOR] [COLOR=rgb(209, 213, 216)]Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [/COLOR]| [COLOR=rgb(0, 255, 0)]Jail 60 минут / Warn (за два и более убийства)[/COLOR] [/FONT][/I][/B][/CENTER]<br>"+
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: '____________________________________________________ | ОБЩИЕ | ______________________________________________________',
},
{
	title: 'PG',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]2.17.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь[/COLOR] | [COLOR=rgb(255, 0, 0)]Jail 30 минут[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'MG',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]2.18.[/COLOR] [COLOR=rgb(209, 213, 216)]Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе[/COLOR] | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	"[FONT=times new roman][B][I][CENTER][B][I][COLOR=rgb(255, 0, 0)]Примечание: использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/COLOR][/B][/CENTER][/I][/B][/FONT]<br>" +
	"[FONT=times new roman][B][I][CENTER][B][I][COLOR=rgb(255, 0, 0)]Примечание: телефонное общение также является IC чатом.[/COLOR][/I][/B][/CENTER][/I][/B][/FONT]<br>" +
	"[FONT=times new roman][B][I][CENTER][I][B][COLOR=rgb(255, 0, 0)]Исключение: за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.[/COLOR][/B][/I][/CENTER][/I][/B][/FONT]<br>"+
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'CAPS',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]3.02.[/COLOR] [COLOR=rgb(209, 213, 216)]Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате[/COLOR] | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'Не русский',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]3.01.[/COLOR] [COLOR=rgb(209, 213, 216)]Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке[/COLOR] | [COLOR=rgb(255, 0, 0)]Устное замечание / Mute 30 минут[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'УПОМ.РОД.',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]3.04.[/COLOR] [COLOR=rgb(209, 213, 216)]Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC)[/COLOR] | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 7 - 15 дней[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	"[FONT=times new roman][B][I][CENTER][B][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] [COLOR=rgb(209, 213, 216)]термины «MQ», «rnq» расценивается, как упоминание родных.[/COLOR][/I][/B][/CENTER][/I][/B][/FONT]<br>" +
	"[FONT=times new roman][B][I][CENTER][B][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] [COLOR=rgb(209, 213, 216)]если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/COLOR][/I][/B][/CENTER][/I][/B][/FONT]<br>" +
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'ФЛУД',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]3.05.[/COLOR] [COLOR=rgb(209, 213, 216)]Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока[/COLOR] | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'ОСК.ЧЕСТИ,ДОСТОИН.СЕКС.ХАР.',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]3.07.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата[/COLOR] | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	"[FONT=times new roman][B][I][CENTER][B][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] [COLOR=rgb(209, 213, 216)]«дырка», «шмара», «ведро», «мадагаскарский присосконог», «свиноногий бандикут», «скорострел» и так далее.[/COLOR][/I][/B][/CENTER][/I][/B][/FONT]<br>" +
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title:'ОСК ИЗД РАСЗМ ДИСКРИМ РЕЛИГ ВРАЖДЕБ В ООС ЧАТ',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]3.03.[/COLOR] [COLOR=rgb(209, 213, 216)]Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены[/COLOR] | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'ЗЛОУП.СИМВ.',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]3.06.[/COLOR] Запрещено злоупотребление знаков препинания и прочих символов | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	"[FONT=times new roman][B][I][CENTER][B][I][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] [COLOR=rgb(209, 213, 216)]«???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/COLOR][/I][/B][/CENTER][/I][/B][/FONT]<br>" +
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'УГРОЗА О НАКАЗАНИИ',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]3.09.[/COLOR] [COLOR=rgb(209, 213, 216)]Запрещены любые угрозы о наказании игрока со стороны администрации[/COLOR] | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'ВЫДАЧА ЗА АДМ.',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]3.10.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещена выдача себя за администратора, если таковым не являетесь[COLOR=rgb(209, 213, 216)] | [COLOR=rgb(255, 0, 0)]Ban 7 - 15 + ЧС администрации[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'ОСК.АДМ.',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]2.54.[/COLOR] [COLOR=rgb(209, 213, 216)]Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации[/COLOR] | [COLOR=rgb(255, 0, 0)]Mute 180 минут[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	"[FONT=times new roman][B][I][CENTER][B][I][COLOR=rgb(255, 0, 0)]Пример:[/COLOR][COLOR=rgb(209, 213, 216)] оформление жалобы в игре с текстом: |Быстро починил меня|, |Админы вы задрали уже когда работать будете меня тут ДБшат я 3 жалобы уже подал!!!!!!!!|, |МОЗГИ ВКЛЮЧИТЕ Я УВОЛЮ ВАС ЩА| и т.д. и т.п., а также при взаимодействии с другими игроками.[/COLOR][/I][/B][/CENTER][/I][/B][/FONT]<br>" +
	"[FONT=times new roman][B][I][CENTER][B][I][COLOR=rgb(255, 0, 0)]Пример:[/COLOR][COLOR=rgb(209, 213, 216)] оскорбление администрации в любой чат, включая репорт подлежит наказанию в виде блокировки доступа к использованию всех видов чатов[/COLOR] - [COLOR=rgb(255, 0, 0)Mute 180 минут.[/COLOR][/I][/B][/CENTER][/I][/B][/FONT]<br>" +
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: ' ОСК.ПРОЕКТА',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]2.40.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'УХОД ОТ НАКАЗАНИЯ',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]2.34.[/COLOR] [COLOR=rgb(209, 213, 216)]Запрещен уход от наказания | Ban 15 - 30 дней (суммируется к общему наказанию дополнительно)[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	"[FONT=times new roman][B][I][CENTER][B][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] [COLOR=rgb(209, 213, 216)]зная, что в данный момент игроку может быть выдано наказание за какое-либо нарушение, изменение никнейма или передача своего имущества на другие аккаунты и тому подобное.[/COLOR][/I][/B][/CENTER][/I][/B][/FONT]<br>" +
	"[FONT=times new roman][B][I][CENTER][B][I][COLOR=rgb(255, 0, 0)]Исключение:[/COLOR] [COLOR=rgb(209, 213, 216)]выход из игры не считатеся уходом от наказания[/COLOR][/I][/B][/CENTER][/I][/B][/FONT]<br>" +
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'РЕКЛАМА',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]2.31.[/COLOR] [COLOR=rgb(209, 213, 216)]Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [/COLOR]|[COLOR=rgb(255, 0, 0)] Ban 7 дней / PermBan[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'СЛИВ СКЛАДА',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]2.09.[/COLOR] [COLOR=rgb(209, 213, 216)]Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [/COLOR]|[COLOR=rgb(255, 0, 0) Ban 15 - 30 дней / PermBan[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'ППИВ',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]2.28. [/COLOR] [COLOR=rgb(209, 213, 216)]Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги | [/COLOR]|[COLOR=rgb(255, 0, 0) PermBan с обнулением аккаунта + ЧС проекта[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	"[FONT=times new roman][B][I][CENTER][B][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] [COLOR=rgb(209, 213, 216)]любые попытки покупки/продажи, попытки поинтересоваться о ней у другого игрока и прочее - наказуемы.[/COLOR][/I][/B][/CENTER][/I][/B][/FONT]<br>" +
	"[FONT=times new roman][B][I][CENTER][B][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] [COLOR=rgb(209, 213, 216)]также запрещен обмен доната на игровые ценности и наоборот;[/COLOR][/I][/B][/CENTER][/I][/B][/FONT]<br>" +
	"[FONT=times new roman][B][I][CENTER][B][I][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] [COLOR=rgb(209, 213, 216)]пополнение донат счет любого игрока взамен на игровые ценности;[/COLOR][/I][/B][/CENTER][/I][/B][/FONT]<br>" +
	"[FONT=times new roman][B][I][CENTER][B][I][COLOR=rgb(255, 0, 0)]Исключение:[/COLOR] [COLOR=rgb(209, 213, 216)]официальная покупка через сайт.[/COLOR][/I][/B][/CENTER][/I][/B][/FONT]<br>" +
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'ПОПЫТКА ПРОДАЖИ ЗА РЕАЛ БАБКИ',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]2.42.[/COLOR] [COLOR=rgb(209, 213, 216)]Попытка продажи любого игрового имущества или игрового аккаунта за реальные деньги [/COLOR]|[COLOR=rgb(255, 0, 0) PermBan[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'ПОМЕХА РП',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]2.51. [/COLOR] [COLOR=rgb(209, 213, 216)]Запрещено вмешательство в Role Play процесс с целью помехи и препятствования дальнейшего развития Role Play процесса[/COLOR]|[COLOR=rgb(255, 0, 0) Jail 30 минут[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	"[FONT=times new roman][B][I][CENTER][B][I][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] [COLOR=rgb(209, 213, 216)] вмешательство в Role Play процесс при задержании игрока сотрудниками ГИБДД, вмешательство в проведение тренировки или мероприятия какой-либо фракции и тому подобные ситуации.[/COLOR][/I][/B][/CENTER][/I][/B][/FONT]<br>" +
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'OOC И IC КОНФЛИКТ НАЦИЯ/РЕЛИГИЯ',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]2.35.[/COLOR] [COLOR=rgb(209, 213, 216)]На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [/COLOR]| [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 7 дней[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'ПЕРЕНОС КОНФЛИКТА OOC В IC НАОБОРОТ',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]2.36.[/COLOR] [COLOR=rgb(209, 213, 216)]Запрещено переносить конфликты из IC в OOC и наоборот [/COLOR]| [COLOR=rgb(255, 0, 0)]Warn[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	"[FONT=times new roman][B][I][CENTER][B][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] [COLOR=rgb(209, 213, 216)]все межфракционные конфликты решаются главными следящими администраторами.[/COLOR][/I][/B][/CENTER][/I][/B][/FONT]<br>" +
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'OOC УГРОЗЫ',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]2.37.[/COLOR] [COLOR=rgb(209, 213, 216)]Запрещены OOC угрозы, в том числе и завуалированные[/COLOR] | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 7 дней[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'ПОЛИТ./РЕЛИГ.ПРОПОГАНДА,ПРОВОКАЦИЯ К КОНФЛИК./ФЛУДУ/БЕЗПОРЯД.',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]3.18.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов[/COLOR] | [COLOR=rgb(255, 0, 0)]Mute 120 минут / Ban 10 дней[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'ТРАНСЛИТ',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]3.20.[/COLOR] Запрещено использование транслита в любом из чатов | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	"[FONT=times new roman][B][I][CENTER][B][I][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] [COLOR=rgb(209, 213, 216)]«Privet», «Kak dela», «Narmalna»..[/COLOR][/I][/B][/CENTER][/I][/B][/FONT]<br>" +
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'РЕКЛАМА ПРОМО',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]3.21.[/COLOR] [COLOR=rgb(209, 213, 216)]Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах.[/COLOR] | [COLOR=rgb(255, 0, 0)]Ban 30 дней[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	"[FONT=times new roman][B][I][CENTER][B][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] [COLOR=rgb(209, 213, 216)]чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.[/COLOR][/I][/B][/CENTER][/I][/B][/FONT]<br>" +
	"[FONT=times new roman][B][I][CENTER][B][I][COLOR=rgb(255, 0, 0)]Исключение:[/COLOR] [COLOR=rgb(209, 213, 216)]промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.[/COLOR][/I][/B][/CENTER][/I][/B][/FONT]<br>" +
	"[FONT=times new roman][B][I][CENTER][B][I][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] [COLOR=rgb(209, 213, 216)]если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.[/I][/B][/CENTER][/I][/B][/FONT]<br>" +
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'ПУБЛИКАЦИЯ ОБЪЯВЛ.В ПОМЕЩЕНИИ ГОСС.ОРГ',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]3.22.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [/COLOR]|[COLOR=rgb(255, 0, 0)] Mute 30 минут[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	"[FONT=times new roman][B][I][CENTER][B][I][COLOR=rgb(255, 0, 0)]Пример:[/COLOR][COLOR=rgb(209, 213, 216)] в помещении центральной больницы писать в чат: *Продам эксклюзивную шапку дешево!!!*[/COLOR][/I][/B][/CENTER][/I][/B][/FONT]<br>" +
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'МАТ В VIP',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]3.23.[/COLOR] [COLOR=rgb(209, 213, 216)]Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате[/COLOR] | [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: '____________________________________________________ИГРОВЫЕ АККАУНТЫ___________________________________',
},
{
	title: 'NONRP NICK',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]4.06.[/COLOR][COLOR=rgb(209, 213, 216)] Никнейм игрового аккаунта должен быть в формате *Имя_Фамилия* на английском языке | [COLOR=rgb(255, 0, 0)]Устное замечание + смена игрового никнейма[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	"[FONT=times new roman][B][I][CENTER][B][I][COLOR=rgb(255, 0, 0)]Пример: [COLOR=rgb(209, 213, 216)]John_Scatman — это правильный Role Play игровой никнейм, в котором не содержится ошибок.[/COLOR][/I][/B][/CENTER][/I][/B][/FONT]<br>" +
	"[FONT=times new roman][B][I][CENTER][B][I][COLOR=rgb(255, 0, 0)]Пример:[COLOR=rgb(209, 213, 216)] _scatman_John — это неправильный Role Play игровой никнейм, в котором содержатся определенные ошибки[/COLOR][/I][/B][/CENTER][/I][/B][/FONT]<br>" +
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'БОЛЬШЕ 2 ЗАГЛ.БУКВ NICK',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]4.07.[/COLOR][COLOR=rgb(209, 213, 216)] В игровом никнейме запрещено использовать более двух заглавных букв [/COLOR]| [COLOR=rgb(255, 0, 0)]Устное замечание + смена игрового никнейма[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	"[FONT=times new roman][B][I][CENTER][B][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] одна заглавная буква в первой букве имени, вторая заглавная буква в первой букве фамилии, большего быть не может.[/COLOR][/I][/B][/CENTER][/I][/B][/FONT]<br>" +
	"[FONT=times new roman][B][I][CENTER][B][I][COLOR=rgb(255, 0, 0)]Исключение:[/COLOR] [COLOR=rgb(209, 213, 216)]приставки к фамилиям, например: DeSanta, MacWeazy и так далее.[/COLOR][/I][/B][/CENTER][/I][/B][/FONT]<br>" +
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'NICK НЕ КАК В РЕАЛЕ',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new romantimes new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=georgtimes new romania][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]4.08.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено использовать никнейм, который не соответствует реальным именам и фамилиям и не несет в себе абсолютно никакой смысловой нагрузки[/COLOR] | [COLOR=rgb(255, 0, 0)]Устное замечание + смена игрового никнейма[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	"[FONT=times new roman][B][I][CENTER][B][I][COLOR=rgb(255, 0, 0)]Пример:[/COLOR] [COLOR=rgb(209, 213, 216)]Super_Man, Vlados_Vidos, Machine_Killer — это неправильные Role Play игровой никнеймы, в которых содержатся определенные ошибки.[/COLOR][/I][/B][/CENTER][/I][/B][/FONT]<br>" +
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'МАТ./ОСК НИК',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]4.09.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные)[/COLOR] |[COLOR=rgb(255, 0, 0)] Устное замечание + смена игрового никнейма / PermBan[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'ПОХОЖИЙ NICK НА УЖЕ СУЩЕСТВУЮЩИЕ',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]4.10.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [/COLOR]| [COLOR=rgb(255, 0, 0)]Устное замечание + смена игрового никнейма / PermBan[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	"[LIST]<br>" +
	"[FONT=times new roman][B][I][CENTER][B][I][COLOR=rgb(255, 0, 0)]Пример:[/COLOR][COLOR=rgb(209, 213, 216)] подменять букву i на L и так далее, по аналогии.[/COLOR][/I][/B][/CENTER][/I][/B][/FONT]<br>" +
	"[LIST]<br>" +
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},

{
	title: '____________________________________________________ | NONRP ОБМАНЫ(ЛЮБЫЕ) | ______________________',
},
{
	title: 'NONRP ОБМАН',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]2.05.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики[/COLOR] | [COLOR=rgb(255, 0, 0)]PermBan[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	"[FONT=times new roman][B][I][CENTER][B][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] [COLOR=rgb(209, 213, 216)]после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/COLOR][/I][/B][/CENTER][/I][/B][/FONT]<br>" +
	"[FONT=times new roman][B][I][CENTER][B][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] [COLOR=rgb(209, 213, 216)]разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/COLOR][/I][/B][/CENTER][/I][/B][/FONT]<br>" +
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'ВВОД В ЗАБЛУЖДЕНИЕ',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]3.11. [/COLOR][COLOR=rgb(209, 213, 216)] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	"[FONT=times new roman][B][I][CENTER][B][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] [COLOR=rgb(209, 213, 216)]/me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена.[/COLOR][/I][/B][/CENTER][/I][/B][/FONT]<br>" +
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'НЕ ВЕРНУЛ ДОЛГ',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]2.57.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещается брать в долг игровые ценности и не возвращать их. | Ban 30 дней / permban[/FONT][/I][/B][/CENTER]<br>"+
	"[FONT=times new roman][B][I][CENTER][B][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;[/COLOR][/I][/B][/CENTER][/I][/B][/FONT]<br>" +
	"[FONT=times new roman][B][I][CENTER][B][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда;[/COLOR][/I][/B][/CENTER][/I][/B][/FONT]<br>" +
	"[FONT=times new roman][B][I][CENTER][B][I][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/COLOR][/I][/B][/CENTER][/I][/B][/FONT]<br>" +
	"[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT= times new roman][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] [/COLOR][COLOR=rgb(209, 213, 216)]жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/COLOR}[/I][/B][/CENTER][/I][/B][/FONT]<br>"+
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: '____________________________________________________ | NONRP ОБМАНЫ(ЛЮБЫЕ)ОТКАЗЫ | ______________________',
},
{
	title: 'ДОЛГ ЧЕРЕЗ ТРЕЙД',
	content:
	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][CENTER][B][I]Долг считатется в том случае если средства были переданы через банк(/bank).[/I][/B][/CENTER][/SIZE][/FONT]<br><br>" +
	"[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][CENTER][B][I]В вашем случае средства были переданы через трейд.[/I][/B][/CENTER][/SIZE][/FONT]<br><br>" +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]НЕ создавайте дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/B][/CENTER][/COLOR]<br><br>" +
	'[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/FONT][/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'НЕТ УСЛОВИЙ',
	content:
	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][CENTER][B][I]На ваших доказательствах отсутвует условие сделки.[/I][/B][/CENTER][/SIZE][/FONT]<br><br>" +
	"[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][CENTER][B][I]Без условий сделки NonRP обман/долг не считается.[/I][/B][/CENTER][/SIZE][/FONT]<br><br>" +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]НЕ создавайте дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/B][/CENTER][/COLOR]<br><br>" +
	'[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/FONT][/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'БОЛЕЕ 10 ДНЕЙ(ДОЛГ)',
	content:
	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][CENTER][B][I]C момента невозврата долга прошло более 10 дней.[/I][/B][/CENTER][/SIZE][/FONT]<br><br>" +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]НЕ создавайте дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/B][/CENTER][/COLOR]<br><br>" +
	'[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/FONT][/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'НЕТ ДОК-В ТОГО ЧТО ИГРОК НЕ ВЕРНУЛ ДОЛГ',
	content:
	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][CENTER][B][I]У вас нет доказательств того что игрок не вернул средства.[/I][/B][/CENTER][/SIZE][/FONT]<br><br>" +
	"[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][CENTER][B][I]Прикрепите скриншоты/видео с операциями на ваш счет.[/I][/B][/CENTER][/SIZE][/FONT]<br><br>" +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]НЕ создавайте дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/B][/CENTER][/COLOR]<br><br>" +
	'[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/FONT][/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'NONRP ОБМАН ЧЕРЕЗ ТРЕЙД(НЕВНИМАТЕЛЬНОСТЬ)',
	content:
	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][CENTER][B][I] В данном случае NonRP обман/попытка  NonRP обмана не зафиксирована[/I][/B][/CENTER][/SIZE][/FONT]<br><br>" +
	"[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][CENTER][B][I]Будьте внимательны при обмене через трейд.[/I][/B][/CENTER][/SIZE][/FONT]<br><br>" +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]НЕ создавайте дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/B][/CENTER][/COLOR]<br><br>" +
	'[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/FONT][/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: '____________________________________________________ | NONRP КОП | ____________________________________________________',
},
{
	title: 'NONRP РОЗЫСК',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]6.02.[/COLOR](209, 213, 216)] Запрещено выдавать розыск без Role Play причины[/COLOR] |[COLOR=rgb(255, 0, 0)] Warn[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: ' NONRP ПОВЕДЕНИЕ',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]6.03.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено nRP поведение[/COLOR] | [COLOR=rgb(255, 0, 0)]Warn[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] [COLOR=rgb(209, 213, 216)]поведение, не соответствующее сотруднику ГОСС.[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]Пример:[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	"[LEFT][B][I][FONT=times new roman]- [COLOR=rgb(209, 213, 216)]открытие огня по игрокам без причины,[/COLOR][/FONT][/I][/B][/LEFT]<br>"+
	"[LEFT][B][I][FONT=times new roman]- [COLOR=rgb(209, 213, 216)]расстрел машин без причины,[/COLOR][/FONT][/I][/B][/LEFT]<br>"+
	"[LEFT][B][I][FONT=times new roman]- [COLOR=rgb(209, 213, 216)]нарушение ПДД без причины,[/COLOR][/FONT][/I][/B][/LEFT]<br>"+
	"[LEFT][B][I][FONT=times new roman]- [COLOR=rgb(209, 213, 216)]сотрудник на служебном транспорте кричит о наборе в свою семью на спавне.[/COLOR][/FONT][/I][/B][/LEFT]<br>"+
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'ЗАДЕРЖАНИЕ В АУКЦИОНЕ/КАЗИНО/СИСТ.МП(ПОД ВОПРОСОМ)',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]2.50.[/COLOR] [COLOR=rgb(209, 213, 216)]Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий[/COLOR]|[COLOR=rgb(255, 0, 0)] Warn[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: '____________________________________________________ | СМИ НАРУШЕНИЯ | _____________________________________________',
},
{
	title: 'СЛИВ.ГЧ(СМИ)',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][/FONT][COLOR=rgb(255, 0, 0)]3.08.[/COLOR] Запрещены любые формы «слива» посредством использования глобальных чатов | [COLOR=rgb(255, 0, 0)]PermBan[/COLOR][/I][/B][/CENTER]<br>"+
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'РЕДАКТ.С НАРУШЕНИЕМ ПРО',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]4.01.[/COLOR] [COLOR=rgb(209, 213, 216)]Запрещено редактирование объявлений, не соответствующих ПРО [/COLOR]| [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR}[/FONT][/I][/B][/CENTER]<br>"+
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]Пример:[/COLOR][COLOR=rgb(209, 213, 216)] игрок отправил одно слово, а редактор вставил полноценное объявление.[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'NONRP ЭФИР',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman][COLOR=rgb(255, 0, 0)]4.02.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [/COLOR]| [COLOR=rgb(255, 0, 0)]Mute 30 минут[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'РЕДАКТ.В Л/Ц',
	content:

	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
	"[CENTER][B][I][FONT=times new roman]	[COLOR=rgb(255, 0, 0)]	4.04.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком[/COLOR] |[COLOR=rgb(255, 0, 0)] Ban 7 дней + ЧС организации[/COLOR][/FONT][/I][/B][/CENTER]<br>"+
	'[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: '____________________________________________________ | ОТКАЗЫ ЖАЛОБ | _______________________________________________',
},
{
	title: 'НЕДОСТАТОЧНО ДОК-В',
	content:
	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][CENTER][B][I]Недостаточно доказательств для корректного рассмотрения вашей жалобы.[/I][/B][/CENTER][/SIZE][/FONT][/COLOR]<br><br>" +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/B][/CENTER]<br>" +
	'[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/FONT][/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'ОТСУТВИЕ ДОК-В',
	content:
	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][CENTER][B][I]Отсутствуют доказательства - следовательно, рассмотрению не подлежит. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/I][/B][/CENTER][/COLOR][/SIZE][/FONT]<br><br>" +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]НЕ создавайте дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/B][/CENTER]<br><br>" +
	'[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/FONT][/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: ' НАРУШЕНИЙ НЕТ',
	content:
	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][CENTER][B][I]Нарушений со стороны игрока не было замечено. [/I][/B][/CENTER][/SIZE][/FONT][/COLOR]<br>" +
	"Внимательно изучите общие правила серверов - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']*нажмите сюда*[/URL]<br>" +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]НЕ создавайте дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/B][/CENTER]<br>" +
	'[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/FONT][/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'РЕДАКТИРОВАННЫЕ ДОК-ВА',
	content:
	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]Доказательства были подвергнуты редактированию - следовательно, рассмотрению не подлежит. Для рассмотрения вашей жалобы загрузите оригинал доказательсв.[/SIZE][/FONT][/I][/B][/CENTER]<br><br>" +
	'[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/FONT][/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'ДОК-ВА ОБРЫВАЮТСЯ',
	content:
	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]Ваша видеозапись обрывается. Загрузите полную видеозапись на видео-хостинг YouTube.[/SIZE][/FONT][/I][/B][/CENTER]<br><br>" +
	'[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/FONT][/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'НЕ ПО ФОРМЕ',
	content:
	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]Ваша жалоба составлена не по форме. Внимательно прочитайте правила подачи жалоб на игроков, находящиеся в общих правилах серверов.[/SIZE][/FONT][/I][/B][/CENTER]<br>" +
	'[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/FONT][/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'БОЛЕЕ 72-УХ ЧАСОВ',
	content:
	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]С момента произошедшей ситуации прошло более 72-ух часов. Внимательно прочитайте правила подачи жалоб на игроков, находящиеся в общих правилах серверов.[/SIZE][/FONT][/I][/B][/CENTER]<br>" +
	'[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/FONT][/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'ДУБЛИКАТ',
	content:
	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]Ваша жалоба - это дубликат вашей прошлой жалобы. На которую уже был дан ответ.[/SIZE][/FONT][/I][/B][/CENTER]<br><br>" +
	'[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/FONT][/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'НИЗКОЕ КАЧЕСТВО',
	content:
	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]Ваши доказательства в низком качестве. Загрузите доказательства в более высоком качестве.[/SIZE][/FONT][/I][/B][/CENTER]<br><br>" +
	'[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/FONT][/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'НЕККОРЕКТНЫЙ ТЕКСТ',
	content:
	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]		Ваши жалоба содержит некорректный текст.[/SIZE][/FONT][/I][/B][/CENTER]<br><br>" +
	'[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/FONT][/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'НЕ ОТКРЫВАЮТСЯ',
	content:
	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]Ваши доказательства не открываются загрузите их на другие хостинг платформы.[/SIZE][/FONT][/I][/B][/CENTER][/COLOR]<br><br>" +
	'[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/FONT][/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'УЖЕ НАКАЗАН',
	content:
	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]Игрок уже был наказан.[/SIZE][/FONT][/I][/B][/CENTER][/COLOR]<br>" +
	'[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/FONT][/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'НЕT /time',
	content:
	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]На ваших доказательствах отсутcвует /timе — следовательно, рассмотрению не подлежит. [/SIZE][/FONT][/I][/B][/CENTER]<br><br>" +
	'[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/FONT][/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'НЕT ТАЙМКОДОВ',
	content:
	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]На ваших доказательствах отсутвуют таймкоды: если видео длится более 3-ех минут, вы обязаны оставить таймкоды нарушений. [/SIZE][/FONT][/I][/B][/CENTER]<br><br>" +
	'[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/FONT][/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'НЕВОЗМОЖНО ПОДВЕРДИТЬ В ЛОГАХ',
	content:
	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]Все нарушения должны быть подтверждены через определенные ресурсы, не только по доказательствам предоставленным игроком, но на тот момент подтверждение по техническим причинам получить было невозможно.[/SIZE][/FONT][/I][/B][/CENTER]"+
	'[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/FONT][/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'НУЖЕН ФРАПС',
	content:
	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]На данное нарушение нужен фрапс.[/SIZE][/FONT][/I][/B][/CENTER]<br><br>" +
	'[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/FONT][/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'ДОК-ВА В СОЦ.СЕТЯХ',
	content:
	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]Доказательства в социальных сетях не принимаются, разместите доказательства на хостинг платформах.[/SIZE][/FONT][/I][/B][/CENTER]<br>" +
	'[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/FONT][/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'МНОЖЕСТВО ВИДЕО ПО МИНУТЕ',
	content:
	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]Ваше видео доказательства невозможно рассмотреть корректно из за того, что одно видео разделено на множество частей, и они постоянно обрываются; загрузите полное не обрывающееся видео на другую хостинг платформу.  [/SIZE][/FONT][/I][/B][/CENTER]<br><br>" +
	'[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/FONT][/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'РАЗНЫЕ НИКИ',
	content:
	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]В ваших доказательствах и в вашей жалобе разные никнеймы.[/SIZE][/FONT][/I][/B][/CENTER]<br><br>" +
	'[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/FONT][/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: '____________________________________________________ | ПЕРЕАДРЕСАЦИЯ | ____________________________________________',
},
{
	title: 'ГКФ-у(ЖАЛОБА)',
	content:
	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]Ваша жалоба передана главному куратору форума.[/SIZE][/FONT][/I][/B][/CENTER]<br>" +
	"[I][FONT=times new roman][B][CENTER][SIZE=4][/SIZE]Ожидайте ответа в данной теме.[/FONT][/I][/B][/CENTER]<br>" +
	'[CENTER][I][B][COLOR=rgb(0, 0, 255)][FONT=times new roman]Главному куратору форума.[/FONT][/COLOR]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',
	prefix: PIN_PREFIX,
	status: true,
},
{
	title: 'ГКФ-у(РП СИТУАЦИИ,РП БИО,РП ОРГ)',
	content:
	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]Ваша жалоба передана главному куратору форума.[/SIZE][/FONT][/I][/B][/CENTER]<br>" +
	"[I][FONT=times new roman][B][CENTER][SIZE=4][/SIZE]Ожидайте ответа в данной теме.[/FONT][/I][/B][/CENTER]<br>" +
	'[CENTER][I][B][COLOR=rgb(0, 0, 255)][FONT=times new roman]Главному куратору форума.[/FONT][/COLOR]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',
	prefix: PIN_PREFIX,
	status: true,
},
{
	title: 'НА РАССМОТРЕНИИ',
	content:
	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]На рассмотрении.[/SIZE][/FONT][/I][/B][/CENTER]<br>" +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]Ожидайте ответов в этой теме. [/SIZE][/FONT][/I][/B][/CENTER]<br>" +
	'[CENTER][I][B][COLOR=rgb(250, 197, 28)][FONT=times new roman]Рассматривается.[/FONT][/COLOR]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',
	prefix: PIN_PREFIX,
	status: true,
},
{
	title: 'ТЕХУ',
	content:
	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/I][/SIZE][/FONT]<br><br>' +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]Ваша жалоба в компетенции технического специалиста.[/SIZE][/FONT][/I][/B][/CENTER]<br><br>" +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]Рассмотрение жалобы передано техническому специалисту 46 сервера. [/SIZE][/FONT][/I][/B][/CENTER]<br><br>" +
	'[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/COLOR][/FONT][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',
	prefix: TEX_PREFIX,
	status: true,
},
{
	title: 'НЕ ТУДА ПОПАЛИ(ПЕРЕМЕЩАЮ)',
	content:
	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]Вы попали в компетенцию не того раздела.[/SIZE][/FONT][/I][/B][/CENTER]" +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]Перемещаю вас в компетенцию раздела по вашей жалобе.[/SIZE][/FONT][/I][/B][/CENTER]" +
	'[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/FONT][/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'В ЖБ НА АДМ',
	content:
	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]Вы попали в компетенцию не того раздела.[/SIZE][/FONT][/I][/B][/CENTER]" +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]Обратитесь с вашей жалобой в «Жалобы на администрацию»[/SIZE][/FONT][/I][/B][/CENTER]" +
	'[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/FONT][/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'В ЖБ НА СОТРУДНИКОВ',
	content:
	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]Вы попали в компетенцию не того раздела.[/SIZE][/FONT][/I][/B][/CENTER]" +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]Обратитесь с вашей жалобой в «Жалобы на сотрудников»[/SIZE][/FONT][/I][/B][/CENTER]" +
	'[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/FONT][/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'В ТЕХ РАЗДЕЛ',
	content:
	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]Вы попали в компетенцию не того раздела.[/SIZE][/FONT][/I][/B][/CENTER]" +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]Обратитесь с вашей жалобой в «Технический раздел 46 сервера»[/SIZE][/FONT][/I][/B][/CENTER]" +
	'[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/FONT][/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',
	prefix: PIN_PREFIX,
	status: false,
},
{
	title: 'В ЖБ НА ТЕХ',
	content:
	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]Вы попали в компетенцию не того раздела.[/SIZE][/FONT][/I][/B][/CENTER]" +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]Обратитесь с вашей жалобой в «Жалобы на технических специалистов»[/SIZE][/FONT][/I][/B][/CENTER]" +
	'[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/FONT][/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'В ОБЖ',
	content:
	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]Вы попали в компетенцию не того раздела.[/SIZE][/FONT][/I][/B][/CENTER]" +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]Обратитесь с вашей жалобой в «Обжалование наказаний»[/SIZE][/FONT][/I][/B][/CENTER]" +
	'[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/FONT][/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'В ЖБ НА ЛИДЕРОВ',
	content:
	'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]Вы попали в компетенцию не того раздела.[/SIZE][/FONT][/I][/B][/CENTER]" +
	"[I][FONT=times new roman][B][CENTER][SIZE=4]Обратитесь с вашей жалобой в «Жалобы на лидеров»[/SIZE][/FONT][/I][/B][/CENTER]" +
	'[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/FONT][/COLOR][/B][/I][/CENTER]<br>'+
	'[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
 title: '________________________________________________________________________________________________'
},
{
 title: '________________________________________________________________________________________________'
},

{
 title: '____________________________________________________ | НЕОФИЦИАЛЬНЫЕ RP ОРГАНИЗАЦИИ | ____________________________________________'
},
{
  title: 'ОДОБРЕНО',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
  "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша организация одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
  '[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
  '[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

  prefix: ACCEPT_PREFIX,
  status: false,
},
{
  title: 'НА ДОПОЛНЕНИЕ(НАПИШИТЕ ЧТО НУЖНО ДОПОЛНИТЬ)',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
},
{
  title: 'ОТКАЗАНО(НАПИШИТЕ ЧТО НУЖНО ДОПОЛНИТЬ)',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
},
{
  title: 'НЕ ПО ФОРМЕ',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
  "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша организация составлена не по форме.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
  '[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/COLOR][/FONT][/B][/I][/CENTER]<br>'+
  '[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

  prefix: UNACCEPT_PREFIX,
  status: false,
},
{
  title: 'МАЛО ИНФОРМАЦИИ',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
  "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Мало информации об организации.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
  '[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/COLOR][/FONT][/B][/I][/CENTER]<br>'+
  '[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

  prefix: UNACCEPT_PREFIX,
  status: false,
},
{
  title: 'НАРУШЕНЫ ПРАВИЛА ПОДАЧИ(ЛЮБЫЕ)',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
  "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушены правила подачи. Ознакомьтесь с ними в закрепленной теме в этом разделе.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
  '[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/COLOR][/FONT][/B][/I][/CENTER]<br>'+
  '[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

  prefix: UNACCEPT_PREFIX,
  status: false,
},
{
  title: 'НЕТ СТАРТОГО СОСТАВА',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
  "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В вашей РП организации отсутвует минимальный стартовый состав. Ознакомьтесь с правилами подачи закрепленными в данном разделе.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
  '[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/COLOR][/FONT][/B][/I][/CENTER]<br>'+
  '[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

  prefix: UNACCEPT_PREFIX,
  status: false,
},
{
  title: 'ВЫХОДИТ ЗА РАМКИ РЕАЛЬНОГО',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
  "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша РП организации выходит за рамки РП процесса. Ознакомьтесь с правилами подачи закрепленными в данном разделе.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
  '[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/COLOR][/FONT][/B][/I][/CENTER]<br>'+
  '[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

  prefix: UNACCEPT_PREFIX,
  status: false,
},
{
 title: '____________________________________________________ | RP СИТУАЦИИ | ____________________________________________'
},
{
  title: 'ОДОБРЕНО',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
  "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша ситуация одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
  '[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
  '[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

  prefix: ACCEPT_PREFIX,
  status: false,
},
{
  title: 'НА ДОПОЛНЕНИЕ(НАПИШИТЕ ЧТО НУЖНО ДОПОЛНИТЬ)',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
},
{
  title: 'ОТКАЗАНО(НАПИШИТЕ ЧТО НУЖНО ДОПОЛНИТЬ)',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
},
{
  title: 'НЕ ПО ФОРМЕ',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
  "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша ситуация составлена не по форме.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
  '[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/COLOR][/FONT][/B][/I][/CENTER]<br>'+
  '[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

  prefix: UNACCEPT_PREFIX,
  status: false,
},
{
  title: 'МАЛО ИНФОРМАЦИИ',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
  "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Мало информации об ситуации.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
  '[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/COLOR][/FONT][/B][/I][/CENTER]<br>'+
  '[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

  prefix: UNACCEPT_PREFIX,
  status: false,
},
{
  title: 'НАРУШЕНЫ ПРАВИЛА ПОДАЧИ(ЛЮБЫЕ)',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
  "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушены правила подачи. Ознакомьтесь с ними в закрепленной теме в этом разделе.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
  '[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/COLOR][/FONT][/B][/I][/CENTER]<br>'+
  '[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

  prefix: UNACCEPT_PREFIX,
  status: false,
},
{
  title: 'ВЫХОДИТ ЗА РАМКИ РЕАЛЬНОГО',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
  "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша РП ситуация выходит за рамки РП процесса. Ознакомьтесь с правилами подачи закрепленными в данном разделе.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
  '[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/COLOR][/FONT][/B][/I][/CENTER]<br>'+
  '[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

  prefix: UNACCEPT_PREFIX,
  status: false,
},
{
 title: '____________________________________________________ | RP БИОГРАФИИ | ____________________________________________'
},
{
  title: 'ОДОБРЕНО',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
  "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша биография одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
  '[CENTER][I][B][COLOR=rgb(0, 255, 0)][FONT=times new roman]Одобрено[/COLOR],[COLOR=rgb(255, 0, 0)] закрыто.[/COLOR][/B][/I][/CENTER]<br>'+
  '[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

  prefix: ACCEPT_PREFIX,
  status: false,
},
{
  title: 'НА ДОПОЛНЕНИЕ(НАПИШИТЕ ЧТО НУЖНО ДОПОЛНИТЬ)',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
},
{
  title: 'ОТКАЗАНО(НАПИШИТЕ ПОЧЕМУ ОТКАЗАНО)',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>',
},

{
  title: 'НЕ ПО ФОРМЕ',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
  "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша биография составлена не по форме.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
  '[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/COLOR][/FONT][/B][/I][/CENTER]<br>'+
  '[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

  prefix: UNACCEPT_PREFIX,
  status: false,
},
{
  title: 'МАЛО ИНФОРМАЦИИ',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
  "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Мало информации.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
  '[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/COLOR][/FONT][/B][/I][/CENTER]<br>'+
  '[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

  prefix: UNACCEPT_PREFIX,
  status: false,
},
{
  title: 'НАРУШЕНЫ ПРАВИЛА ПОДАЧИ(ЛЮБЫЕ)',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
  "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушены правила подачи. Ознакомьтесь с ними в закрепленной теме в этом разделе.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
  '[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/COLOR][/FONT][/B][/I][/CENTER]<br>'+
  '[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

  prefix: UNACCEPT_PREFIX,
  status: false,
},
{
  title: 'ВЫХОДИТ ЗА РАМКИ РЕАЛЬНОГО',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
  "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша РП биография выходит за рамки РП процесса. Ознакомьтесь с правилами подачи закрепленными в данном разделе.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
  '[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/COLOR][/FONT][/B][/I][/CENTER]<br>'+
  '[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

  prefix: UNACCEPT_PREFIX,
  status: false,
},
{
  title: 'НЕТ ЛИЧНОГО ФОТО',
  content:

  '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
  "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В вашей РП биографии отсутвует личное фото. Ознакомьтесь с правилами подачи закрепленными в данном разделе.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
  '[CENTER][I][B][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано,[/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=times new roman] закрыто.[/COLOR][/FONT][/B][/I][/CENTER]<br>'+
  '[RIGHT][I][B][SIZE=2][FONT=arial][COLOR=rgb(255, 0, 0)]CHELYABINSK[/COLOR][/FONT][/SIZE][/B][/I][/RIGHT]',

  prefix: UNACCEPT_PREFIX,
  status: false,
},

];
	$(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
		$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');


    // Добавление кнопок при загрузке страницы
		addButton('Закрыто', 'close'); 
		addButton('На рассмотрение', 'pin');
		addButton('Одобрено', 'accepted');
		addButton('Отказано', 'unaccept');
		addButton('Ответы', 'selectAnswer');



    // Поиск информации о теме
		const threadData = getThreadData();


		$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
		$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
		$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
		$('button#close').click(() => editThreadData(CLOSE_PREFIX, false));


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
