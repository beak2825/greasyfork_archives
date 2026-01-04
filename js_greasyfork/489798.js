// ==UserScript==
// @name         Контроль Качества | Телефон
// @namespace    https://forum.blackrussia.online
// @version      13.7
// @description  Для борьбы с форумом
// @author       @its_times
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license 	 MIT
// @collaborator Nikita_Porodko
// @icon https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png
// @copyright 2022
// @downloadURL https://update.greasyfork.org/scripts/489798/%D0%9A%D0%BE%D0%BD%D1%82%D1%80%D0%BE%D0%BB%D1%8C%20%D0%9A%D0%B0%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%B0%20%7C%20%D0%A2%D0%B5%D0%BB%D0%B5%D1%84%D0%BE%D0%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/489798/%D0%9A%D0%BE%D0%BD%D1%82%D1%80%D0%BE%D0%BB%D1%8C%20%D0%9A%D0%B0%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%B0%20%7C%20%D0%A2%D0%B5%D0%BB%D0%B5%D1%84%D0%BE%D0%BD.meta.js
// ==/UserScript==
(function () {
 
// Названия префиксов
const RASSMOTRENO_PREFIX = 9; // Рассмотрено
const NARASSMOTRENII_PREFIX = 2; //   На рассмотрении
const QCUN_PREFIX = 15; // Проверено QC
const OBRATNOTECH_PREFIX = 13; // Теху
 
// Сервера
const S1 = 202;
const S2 = 203;
const S3 = 204;
const S4 = 205;
const S5 = 206;
const S6 = 207;
const S7 = 208;
const S8 = 209;
const S9 = 210;
const S10 = 211;
const S11 = 212;
const S12 = 213;
const S13 = 214;
const S14 = 215;
const S15 = 216;
const S16 = 217;
const S17 = 218;
const S18 = 219;
const S19 = 220;
const S20 = 221;
const S21 = 222;
const S22 = 223;
const S23 = 224;
const S24 = 225;
const S25 = 226;
const S26 = 227;
const S27 = 228;
const S28 = 229;
const S29 = 230;
const S30 = 231;
const S31 = 232;
const S32 = 233;
const S33 = 234;
const S34 = 235;
const S35 = 236;
const S36 = 237;
const S37 = 238;
const S38 = 239;
const S39 = 240;
const S40 = 241;
const S41 = 242;
const S42 = 243;
const S43 = 244;
const S44 = 245;
const S45 = 246;
const S46 = 247;
const S47 = 248;
const S48 = 249;
const S49 = 250;
const S50 = 251;
const S51 = 252;
const S52 = 253;
const S53 = 254;
const S54 = 255;
const S55 = 256;
const S56 = 257;
const S57 = 258;
const S58 = 259;
const S59 = 260;
const S60 = 261;
const S61 = 262;
const S62 = 263;
const S63 = 264;
const S64 = 265;
const S65 = 266;
const S66 = 267;
const S67 = 268;
const S68 = 269;
const S69 = 270;
const S70 = 271;
const S71 = 272;
const S72 = 273;
const S73 = 274;
 
// Кнопки в МЕНЮ
const buttons = [
 
    {
	  title: 'Приветствие',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
        '[CENTER] *текст* [/CENTER][/FONT][/SIZE]'
	},
	{
	  title: 'На рассмотрении',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша тема взята на рассмотрение.[/CENTER][/SIZE][/FONT]<br>",
	  prefix: NARASSMOTRENII_PREFIX,
	  status: true,
	},
	{
	    title: 'Обнаружено',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]После проверки вашей темы баг был обнаружен.[/CENTER]<br>" +
        "[CENTER]Данный баг был передан разработчикам проекта.[/CENTER]<br><br>" +
		'[CENTER]Проверено Контролем Качества.[/CENTER]<br>' +
		"[CENTER]Закрыто.[/CENTER][/SIZE][/FONT]",
	},
	{
	     title: 'Не обнаружено(SERV)',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]После проверки вашей темы, мы не обнаружили баг/недоработку системы.[/CENTER]<br>" +
        "[CENTER]Скорее всего, данный баг произошел из-за серверных ошибок, либо уже был исправлен.[/CENTER]<br><br>" +
        '[CENTER]Проверено Контролем Качества.[/CENTER]<br>' +
		"[CENTER]Закрыто.[/CENTER][/SIZE][/FONT]",
	},
    {
	     title: 'Не обнаружено(CLIENT)',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]После проверки вашей темы, мы не обнаружили баг/недоработку системы.[/CENTER]<br>" +
        "[CENTER]Если проблема актуальна - попробуйте заново скачать лаунчер с офф. сайта - https://blackrussia.online.[/CENTER]<br><br>" +
        '[CENTER]Проверено Контролем Качества.[/CENTER]<br>' +
		"[CENTER]Закрыто.[/CENTER][/SIZE][/FONT]",
	},
	{
	    title: 'Известно',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
        "[CENTER]После проверки вашей темы, стало ясно, что данная ошибка/недоработка уже известна нам.[/CENTER]<br>" +
        "[CENTER]В скором времени баг будет исправлен.[/CENTER]<br><br>" +
        '[CENTER]Проверено Контролем Качества.[/CENTER]<br>' +
		"[CENTER]Закрыто.[/CENTER][/SIZE][/FONT]",
	},
    {
	    title: 'Не баг',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
        "[CENTER]Данная система не является ошибкой/недоработкой.[/CENTER]<br><br>" +
        '[CENTER]Проверено Контролем Качества.[/CENTER]<br>' +
		"[CENTER]Закрыто.[/CENTER][/SIZE][/FONT]",
	},
	{
	     title: 'Док-ва',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Без дополнительных доказательств или более подробного описания для воспроизведения бага — решить проблему не получится.[/CENTER]<br><br>" +
        "[CENTER]Если проблема актуальна — создайте новую тему, с более подробным описанием для воспроизведения бага или приложите дополнительные доказательсва.[/CENTER]<br><br>" +
        '[CENTER]Проверено Контролем Качества.[/CENTER]<br>' +
		"[CENTER]Закрыто.[/CENTER][/SIZE][/FONT]",
	},
// 	{
// 	  title: 'ОБТ',
// 	  content:
// 		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
// 		"[CENTER]Вы столкнулись с багом во время Открытого Бета-Теста(ОБТ) на [U]новом[/U] клиенте, его следует залить в форму, а не в технический раздел.[/CENTER]<br><br>" +
// 		"[CENTER]Ссылка на форму:[/CENTER]<br>" +
// 		"[CENTER]https://forms.gle/94Cpi9MvqmMpm2WB9[/CENTER]<br><br>" +
// 		'[CENTER]Баг с нового движка.[/CENTER]<br>' +
// 		"[CENTER]Закрыто.[/CENTER][/SIZE][/FONT]",
//          },
         {
    title: 'ОБТ IOS',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Вы столкнулись с багом во время Открытого Бета-Теста(ОБТ) на [U]iOS[/U] клиенте, его следует залить в форму, а не в технический раздел.[/CENTER]<br><br>" +
		"[CENTER]Ссылка на форму:[/CENTER]<br>" +
		"[CENTER]https://docs.google.com/forms/d/e/1FAIpQLSexETXyDfowKeNv-cgzyHQTel-idBZTlHvcO2i3b9NdSYpbSA/viewform[/CENTER]<br><br>" +
		'[CENTER]Баг с iOS клиента.[/CENTER]<br>' +
		"[CENTER]Закрыто.[/CENTER][/SIZE][/FONT]",
         },
         {
	     title: 'Штрафы',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Для решения данной проблемы: Получите любой штраф, потом в банкомате оплатите все штрафы(нажмите на "Оплатить штрафы">"Оплатить все штрафы")[/CENTER]<br><br>' +
        "[CENTER]Если у Вас есть порядок конкретных действий, которые привели к данному багу - создайте, пожалуйста, новую тему с багом, где будет чётко расписано при каких условиях данный баг происходит.[/CENTER]<br><br>" +
        '[CENTER]Проверено Контролем Качества.[/CENTER]<br>' +
		"[CENTER]Закрыто.[/CENTER][/SIZE][/FONT]",
	},
	{
	    title: 'Акс',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
        "[CENTER]Данная ошибка у игроков возникает в основном из-за того, что у них на нижних слотах инвентаря лежат различные предметы.[/CENTER]<br>" +
        "[CENTER]Для решения данной проблемы Вам нужно все предметы, которые находятся у Вас на нижних слотах инвентаря, переместить наверх.[/CENTER]<br><br>" +
        '[CENTER]Проверено Контролем Качества.[/CENTER]<br>' +
		"[CENTER]Закрыто.[/CENTER][/SIZE][/FONT]",
	},
	{
	     title: 'Не воспроизвести/Список ошибок(SERV)',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данную проблему невозможно воспроизвести специально, либо данный баг/ошибка могли произойти по одной из следующих причин:[/CENTER]<br>" +
        "[CENTER][QUOTE]1. Из-за серверных ошибок/сбоев[/CENTER]<br><br>" +
        "[CENTER]2. Либо данный баг уже был исправлен.[/QUOTE][/CENTER]<br><br>" +
        '[CENTER]Проверено Контролем Качества.[/CENTER]<br>' +
		"[CENTER]Закрыто.[/CENTER][/SIZE][/FONT]",
	},
	{
	     title: 'Не воспроизвести/Список ошибок(CLIENT)',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данную проблему невозможно воспроизвести специально, либо данный баг/ошибка могли произойти по одной из следующих причин:[/CENTER]<br>" +
        "[CENTER][QUOTE]1. Из-за проблемы в вашем телефоне[/CENTER]<br><br>" +
        "[CENTER]2. Из-за вашего плохого интернет-соединения[/CENTER]<br><br>" +
        "[CENTER]3. Из-за стороннего установленого клиента(лаунчера)[/CENTER]<br><br>" +
        "[CENTER]4. Либо данный баг уже был исправлен.[/QUOTE][/CENTER]<br><br>" +
        "[CENTER]Для решения проблемы попробуйте заново скачать лаунчер с офф. сайта - https://blackrussia.online[/CENTER]<br><br>" +
        '[CENTER]Проверено Контролем Качества.[/CENTER]<br>' +
		"[CENTER]Закрыто.[/CENTER][/SIZE][/FONT]",
	},
	{
	  title: 'Дубль',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ответ дан в другой,ранее созданной вами, теме.[/CENTER]<br><br>" +
		'[CENTER]Дубль.[/CENTER]<br>' +
		"[CENTER]Закрыто.[/CENTER][/SIZE][/FONT]",
	},
	{
	  title: 'В «Заявки с окончательными ответами»',
	  content:
		'',
	  prefix: QCUN_PREFIX,
	  status: false,
	},
	{
	  title: '-------------------Перемещение по серверам--------------',
	},
    {
	  title: 'Сервер №1 | RED',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «RED».[/CENTER][/SIZE][/FONT]',
      prefix: S1,
	  status: true
 
	},
    {
	  title: 'Сервер №2 | GREEN',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «GREEN».[/CENTER][/SIZE][/FONT]',
      prefix: S2,
	  status: true
 
	},
    {
	  title: 'Сервер №3 | BLUE',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «BLUE».[/CENTER][/SIZE][/FONT]',
      prefix: S3,
	  status: true
 
	},
    {
	  title: 'Сервер №4 | YELLOW',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «YELLOW».[/CENTER][/SIZE][/FONT]',
       prefix: S4,
	  status: true
 
	},
    {
	  title: 'Сервер №5 | ORANGE',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «ORANGE».[/CENTER][/SIZE][/FONT]',
	  prefix: S5,
	  status: true
 
	},
    {
	  title: 'Сервер №6 | PURPLE',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «PURPLE».[/CENTER][/SIZE][/FONT]',
      prefix: S6,
	  status: true
	},
    {
	  title: 'Сервер №7 | LIME',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «LIME».[/CENTER][/SIZE][/FONT]',
      prefix: S7,
	  status: true
	},
    {
	  title: 'Сервер №8 | PINK',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «PINK».[/CENTER][/SIZE][/FONT]',
	  prefix: S8,
	  status: true
	},
    {
	  title: 'Сервер №9 | CHERRY',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «CHERRY».[/CENTER][/SIZE][/FONT]',
	  prefix: S9,
	  status: true
	},{
	  title: 'Сервер №10 | BLACK',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «BLACK».[/CENTER][/SIZE][/FONT]',
	  prefix: S10,
	  status: true
	},
    {
	  title: 'Сервер №11 | INDIGO',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «INDIGO».[/CENTER][/SIZE][/FONT]',
	  prefix: S11,
	  status: true
	},
    {
	  title: 'Сервер №12 | WHITE',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «WHITE».[/CENTER][/SIZE][/FONT]',
	  prefix: S12,
	  status: true
	},
    {
	  title: 'Сервер №13 | MAGENTA',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «MAGENTA».[/CENTER][/SIZE][/FONT]',
	  prefix: S13,
	  status: true
	},
    {
	  title: 'Сервер №14 | CRIMSON',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «CRIMSON».[/CENTER][/SIZE][/FONT]',
	  prefix: S14,
	  status: true
	},
    {
	  title: 'Сервер №15 | GOLD',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «GOLD».[/CENTER][/SIZE][/FONT]',
	  prefix: S15,
	  status: true
	},
    {
	  title: 'Сервер №16 | AZURE',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «AZURE».[/CENTER][/SIZE][/FONT]',
	  prefix: S16,
	  status: true
	},
    {
	  title: 'Сервер №17 | PLATINUM',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «PLATINUM».[/CENTER][/SIZE][/FONT]',
	  prefix: S17,
	  status: true
	},
    {
	  title: 'Сервер №18 | AQUA',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «AQUA».[/CENTER][/SIZE][/FONT]',
	  prefix: S18,
	  status: true
	},{
	  title: 'Сервер №19 | GRAY',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «GRAY».[/CENTER][/SIZE][/FONT]',
	  prefix: S19,
	  status: true
	},
    {
	  title: 'Сервер №20 | ICE',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «ICE».[/CENTER][/SIZE][/FONT]',
	  prefix: S20,
	  status: true
	},
    {
	  title: 'Сервер №21 | CHILLI',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «CHILLI».[/CENTER][/SIZE][/FONT]',
	  prefix: S21,
	  status: true
	},
    {
	  title: 'Сервер №22 | CHOCO',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «CHOCO».[/CENTER][/SIZE][/FONT]',
	  prefix: S22,
	  status: true
	},
    {
	  title: 'Сервер №23 | MOSCOW',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «MOSCOW».[/CENTER][/SIZE][/FONT]',
	  prefix: S23,
	  status: true
	},
    {
	  title: 'Сервер №24 | SPB',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «SPB».[/CENTER][/SIZE][/FONT]',
	  prefix: S24,
	  status: true
	},
    {
	  title: 'Сервер №25 | UFA',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «UFA».[/CENTER][/SIZE][/FONT]',
	  prefix: S25,
	  status: true
	},
    {
	  title: 'Сервер №26 | SOCHI',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «SOCHI».[/CENTER][/SIZE][/FONT]',
	  prefix: S26,
	  status: true
	},
	{
	  title: 'Сервер №27 | KAZAN',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «KAZAN».[/CENTER][/SIZE][/FONT]',
	  prefix: S27,
	  status: true
	},
	{
	  title: 'Сервер №28 | SAMARA',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «SAMARA».[/CENTER][/SIZE][/FONT]',
	  prefix: S28,
	  status: true
	},
	{
	  title: 'Сервер №29 | ROSTOV',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «ROSTOV».[/CENTER][/SIZE][/FONT]',
	  prefix: S29,
	  status: true
	},
    {
	  title: 'Сервер №30 | ANAPA',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «ANAPA».[/CENTER][/SIZE][/FONT]',
	  prefix: S30,
	  status: true
	},
	{
	  title: 'Сервер №31 | EKB',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «ERB».[/CENTER][/SIZE][/FONT]',
	  prefix: S31,
	  status: true
	},
	{
	  title: 'Сервер №32 | KRASNODAR ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «KRASNODAR».[/CENTER][/SIZE][/FONT]',
	  prefix: S32,
	  status: true
	},
	{
	  title: 'Сервер №33 | ARZAMAS ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «ARZAMAS».[/CENTER][/SIZE][/FONT]',
	  prefix: S33,
	  status: true
	},
	{
	  title: 'Сервер №34 | NOVOSIBIRSK ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «NOVOSIBIRSK».[/CENTER][/SIZE][/FONT]',
	  prefix: S34,
	  status: true
	},
	{
	  title: 'Сервер №35 | GROZNY ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «GROZNY».[/CENTER][/SIZE][/FONT]',
	  prefix: S35,
	  status: true
	},
	{
	  title: 'Сервер №36 | SARATOV ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «SARATOV».[/CENTER][/SIZE][/FONT]',
	  prefix: S36,
	  status: true
	},
	{
	  title: 'Сервер №37 | OMSK ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «OMSK».[/CENTER][/SIZE][/FONT]',
	  prefix: S37,
	  status: true
	},
	{
	  title: 'Сервер №38 | IRKUTSK ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «IRKUTSK».[/CENTER][/SIZE][/FONT]',
	  prefix: S38,
	  status: true
	},
	{
	  title: 'Сервер №39 | VOLGOGRAD ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «VOLGOGRAD».[/CENTER][/SIZE][/FONT]',
	  prefix: S39,
	  status: true
	},
	{
	  title: 'Сервер №40 | VORONEZH ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «VORONEZH».[/CENTER][/SIZE][/FONT]',
	  prefix: S40,
	  status: true
	},
	{
	  title: 'Сервер №41 | BELGOROD ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «BELGOROD».[/CENTER][/SIZE][/FONT]',
	  prefix: S41,
	  status: true
	},
	{
	  title: 'Сервер №42 | MAKHACHKALA ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «MAKHACHKALA».[/CENTER][/SIZE][/FONT]',
	  prefix: S42,
	  status: true
	},
	{
	  title: 'Сервер №43 | VLADIKAVKAZ ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «VLADIKAVKAZ».[/CENTER][/SIZE][/FONT]',
	  prefix: S43,
	  status: true
	},
	{
	  title: 'Сервер №44 | VLADIVOSTOK ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «VLADIVOSTOK».[/CENTER][/SIZE][/FONT]',
	  prefix: S44,
	  status: true
	},
	{
	  title: 'Сервер №45 | KALININGRAD ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «KALININGRAD».[/CENTER][/SIZE][/FONT]',
	  prefix: S45,
	  status: true
	},
	{
	  title: 'Сервер №46 | CHELYABINSK ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «CHELYABINSK».[/CENTER][/SIZE][/FONT]',
	  prefix: S46,
	  status: true
	},
	{
	  title: 'Сервер №47 | KRASNOYARSK ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «KRASNOYARSK».[/CENTER][/SIZE][/FONT]',
	  prefix: S47,
	  status: true
	},
	{
	  title: 'Сервер №48 | CHEBOKSARY ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «CHEBOKSARY».[/CENTER][/SIZE][/FONT]',
	  prefix: S48,
	  status: true
	},
	{
	  title: 'Сервер №49 | KHABAROVSK ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «KHABAROVSK».[/CENTER][/SIZE][/FONT]',
	  prefix: S49,
	  status: true
	},
	{
	  title: 'Сервер №50 | PERM ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «PERM».[/CENTER][/SIZE][/FONT]',
	  prefix: S50,
	  status: true
	},
	{
	  title: 'Сервер №51 | TULA ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «TULA».[/CENTER][/SIZE][/FONT]',
	  prefix: S51,
	  status: true
	},
	{
	  title: 'Сервер №52 | RYAZAN ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «RYAZAN».[/CENTER][/SIZE][/FONT]',
	  prefix: S52,
	  status: true
	},
	{
	  title: 'Сервер №53 | MURMANSK ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «MURMANSK».[/CENTER][/SIZE][/FONT]',
	  prefix: S53,
	  status: true
	},
	{
	  title: 'Сервер №54 | PENZA ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «PENZA».[/CENTER][/SIZE][/FONT]',
	  prefix: S54,
	  status: true
	},
	{
	  title: 'Сервер №55 | KURSK ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «KURSK».[/CENTER][/SIZE][/FONT]',
	  prefix: S55,
	  status: true
	},
	{
	  title: 'Сервер №56 | ARKHANGELSK  ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «ARKHANGELSK ».[/CENTER][/SIZE][/FONT]',
	  prefix: S56,
	  status: true
	},
	{
	  title: 'Сервер №57 | ORENBURG ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «ORENBURG».[/CENTER][/SIZE][/FONT]',
	  prefix: S57,
	  status: true
	},
	{
	  title: 'Сервер №58 | KIROV ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «KIROV».[/CENTER][/SIZE][/FONT]',
	  prefix: S58,
	  status: true
	},
    {
	  title: 'Сервер №59 | KEMEROVO ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «KEMEROVO».[/CENTER][/SIZE][/FONT]',
	  prefix: S59,
	  status: true
	},
	{
	  title: 'Сервер №60 | TYUMEN ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «TYUMEN».[/CENTER][/SIZE][/FONT]',
	  prefix: S60,
	  status: true
	},
	{
	  title: 'Сервер №61 | TOLLYATTI ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «TOLLYATTI».[/CENTER][/SIZE][/FONT]',
	  prefix: S61,
	  status: true
	},
	{
	  title: 'Сервер №62 | IVANOVO ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «IVANOVO».[/CENTER][/SIZE][/FONT]',
	  prefix: S62,
	  status: true
	},
	{
	  title: 'Сервер №63 | STAVROPOL ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «STAVROPOL».[/CENTER][/SIZE][/FONT]',
	  prefix: S63,
	  status: true
	},
	{
	  title: 'Сервер №64 | SMOLENSK ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «SMOLENSK».[/CENTER][/SIZE][/FONT]',
	  prefix: S64,
	  status: true
	},
	{
	  title: 'Сервер №65 | PSKOV ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «PSKOV».[/CENTER][/SIZE][/FONT]',
	  prefix: S65,
	  status: true
	},
	{
	  title: 'Сервер №66 | BRYANSK ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «BRYANSK».[/CENTER][/SIZE][/FONT]',
	  prefix: S66,
	  status: true
	},
	{
	  title: 'Сервер №67 | OREL ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «OREL».[/CENTER][/SIZE][/FONT]',
	  prefix: S67,
	  status: true
	},
	{
	  title: 'Сервер №68 | YAROSLAVL ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «YAROSLAVL».[/CENTER][/SIZE][/FONT]',
	  prefix: S68,
	  status: true
	},
	{
	  title: 'Сервер №69 | BARNAUL ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «BARNAUL».[/CENTER][/SIZE][/FONT]',
	  prefix: S69,
	  status: true
	},
	{
	  title: 'Сервер №70 | LIPETSK ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «LIPETSK».[/CENTER][/SIZE][/FONT]',
	  prefix: S70,
	  status: true
	},
	{
	  title: 'Сервер №71 | ULYANOVSK ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «ULYANOVSK».[/CENTER][/SIZE][/FONT]',
	  prefix: S71,
	  status: true
	},
	{
	  title: 'Сервер №72 | YAKUTSK ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «YAKUTSK».[/CENTER][/SIZE][/FONT]',
	  prefix: S72,
	  status: true
	},
	{
	  title: 'Сервер №73 | TAMBOV ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «TAMBOV».[/CENTER][/SIZE][/FONT]',
	  prefix: S73,
	  status: true
	},
];
$(document).ready(() => {
 
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
// Добавление кнопок при загрузке страницы
addButton('>>>>>>>>>>>>>>>>>>>>>>МЕНЮ<<<<<<<<<<<<<<<<<<<<<<', 'selectAnswer');
 
 
// Поиск информации о теме
	const threadData = getThreadData();
 
	$('button#pin').click(() => editThreadData(NARASSMOTRENII_PREFIX, false)); // На рассмотрении
    $('button#watched').click(() => editThreadData(RASSMOTRENO_PREFIX, false)); // Рассмотрено
	$('button#checkk').click(() => editThreadData(QCCLOSED_PREFIX, false)); // Проверено QC
	$('button#tech').click(() => editThreadData(OBRATNOTECH_PREFIX, true)); // Теху
 
	$(`button#selectAnswer`).click(() => {
	   XF.alert(buttonsMarkup(buttons), null, '(v13.5)Выберите действие:');
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
            `<button type="button" class="button rippleButton" id="${id}" style="oswald: 3px;">${name}</button>`,
        );
    }
 
	   function buttonsMarkup(buttons) {
	   return `<div class="select_answer">${buttons
	   .map(
	   (btn, i) =>
	   `<button id="answers-${i}" class="button--primary button ` +
	   `rippleButton" style="margin:4px"><span class="button-text">${btn.title}</span></button>`,
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
				   discussion_open: 1,
				   sticky: 1,
				   _xfToken: XF.config.csrf,
				   _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
				   _xfWithData: 1,
				   _xfResponseType: 'json',
				 }),
			   }).then(() => location.reload());
			}
// в окончательные ответы
if (prefix == QCUN_PREFIX) {
	moveThread(prefix, 230);
    }
//Перемещение по серверам
if (prefix == S1) {
	moveThread(OBRATNOTECH_PREFIX, 226);
	}
if (prefix == S2) {
	moveThread(OBRATNOTECH_PREFIX, 227);
	}
if (prefix == S3) {
	moveThread(OBRATNOTECH_PREFIX, 228);
	}
if (prefix == S4) {
	moveThread(OBRATNOTECH_PREFIX, 229);
	}
if (prefix == S5) {
	moveThread(OBRATNOTECH_PREFIX, 245);
	}
if (prefix == S6) {
	moveThread(OBRATNOTECH_PREFIX, 325);
	}
if (prefix == S7) {
	moveThread(OBRATNOTECH_PREFIX, 365);
	}
if (prefix == S8) {
	moveThread(OBRATNOTECH_PREFIX, 396);
	}
if (prefix == S9) {
	moveThread(OBRATNOTECH_PREFIX, 408);
	}
if (prefix == S10) {
	moveThread(OBRATNOTECH_PREFIX, 488);
	}
if (prefix == S11) {
	moveThread(OBRATNOTECH_PREFIX, 493);
	}
if (prefix == S12) {
	moveThread(OBRATNOTECH_PREFIX, 554);
	}
if (prefix == S13) {
	moveThread(OBRATNOTECH_PREFIX, 613);
	}
if (prefix == S14) {
	moveThread(OBRATNOTECH_PREFIX, 653);
	}
if (prefix == S15) {
	moveThread(OBRATNOTECH_PREFIX, 660);
	}
if (prefix == S16) {
	moveThread(OBRATNOTECH_PREFIX, 701);
	}
if (prefix == S17) {
	moveThread(OBRATNOTECH_PREFIX, 757);
	}
if (prefix == S18) {
	moveThread(OBRATNOTECH_PREFIX, 815);
	}
if (prefix == S19) {
	moveThread(OBRATNOTECH_PREFIX, 857);
	}
if (prefix == S20) {
	moveThread(OBRATNOTECH_PREFIX, 925);
	}
if (prefix == S21) {
	moveThread(OBRATNOTECH_PREFIX, 1007);
	}
if (prefix == S22) {
	moveThread(OBRATNOTECH_PREFIX, 1048);
	}
if (prefix == S23) {
	moveThread(OBRATNOTECH_PREFIX, 1052);
	}
if (prefix == S24) {
	moveThread(OBRATNOTECH_PREFIX, 1095);
	}
if (prefix == S25) {
	moveThread(OBRATNOTECH_PREFIX, 1138);
	}
if (prefix == S26) {
	moveThread(OBRATNOTECH_PREFIX, 1248);
	}
if (prefix == S27) {
	moveThread(OBRATNOTECH_PREFIX, 1290);
	}
if (prefix == S28) {
	moveThread(OBRATNOTECH_PREFIX, 1292);
    }
if (prefix == S29) {
	moveThread(OBRATNOTECH_PREFIX, 1334);
    }
if (prefix == S30) {
	moveThread(OBRATNOTECH_PREFIX, 1416);
    }
if (prefix == S31) {
	moveThread(OBRATNOTECH_PREFIX, 1458);
    }
if (prefix == S32) {
	moveThread(OBRATNOTECH_PREFIX, 1460);
    }
if (prefix == S33) {
	moveThread(OBRATNOTECH_PREFIX, 1502);
    }
if (prefix == S34) {
	moveThread(OBRATNOTECH_PREFIX, 1544);
    }
if (prefix == S35) {
	moveThread(OBRATNOTECH_PREFIX, 1586);
    }
if (prefix == S36) {
	moveThread(OBRATNOTECH_PREFIX, 1628);
    }
if (prefix == S37) {
	moveThread(OBRATNOTECH_PREFIX, 1670);
    }
if (prefix == S38) {
	moveThread(OBRATNOTECH_PREFIX, 1712);
    }
if (prefix == S39) {
	moveThread(OBRATNOTECH_PREFIX, 1758);
    }
if (prefix == S40) {
	moveThread(OBRATNOTECH_PREFIX, 1800);
    }
if (prefix == S41) {
	moveThread(OBRATNOTECH_PREFIX, 1842);
    }
if (prefix == S42) {
	moveThread(OBRATNOTECH_PREFIX, 1884);
    }
if (prefix == S43) {
	moveThread(OBRATNOTECH_PREFIX, 1926);
    }
if (prefix == S44) {
	moveThread(OBRATNOTECH_PREFIX, 1968);
    }
if (prefix == S45) {
	moveThread(OBRATNOTECH_PREFIX, 2010);
    }
if (prefix == S46) {
	moveThread(OBRATNOTECH_PREFIX, 2052);
    }
if (prefix == S47) {
	moveThread(OBRATNOTECH_PREFIX, 2094);
    }
if (prefix == S48) {
	moveThread(OBRATNOTECH_PREFIX, 2136);
    }
if (prefix == S49) {
	moveThread(OBRATNOTECH_PREFIX, 2178);
    }
if (prefix == S50) {
	moveThread(OBRATNOTECH_PREFIX, 2220);
    }
if (prefix == S51) {
	moveThread(OBRATNOTECH_PREFIX, 2262);
    }
if (prefix == S52) {
	moveThread(OBRATNOTECH_PREFIX, 2304);
    }
if (prefix == S53) {
	moveThread(OBRATNOTECH_PREFIX, 2346);
    }
if (prefix == S54) {
	moveThread(OBRATNOTECH_PREFIX, 2388);
    }
if (prefix == S55) {
	moveThread(OBRATNOTECH_PREFIX, 2430);
    }
if (prefix == S56) {
	moveThread(OBRATNOTECH_PREFIX, 2472);
    }
if (prefix == S57) {
	moveThread(OBRATNOTECH_PREFIX, 2514);
    }
if (prefix == S58) {
	moveThread(OBRATNOTECH_PREFIX, 2516);
    }
if (prefix == S59) {
	moveThread(OBRATNOTECH_PREFIX, 2598);
    }
if (prefix == S60) {
	moveThread(OBRATNOTECH_PREFIX, 2639);
    }
if (prefix == S61) {
	moveThread(OBRATNOTECH_PREFIX, 2682);
    }
if (prefix == S62) {
	moveThread(OBRATNOTECH_PREFIX, 2714);
    }
if (prefix == S63) {
	moveThread(OBRATNOTECH_PREFIX, 2747);
    }
if (prefix == S64) {
	moveThread(OBRATNOTECH_PREFIX, 2779);
    }
if (prefix == S65) {
	moveThread(OBRATNOTECH_PREFIX, 2811);
    }
if (prefix == S66) {
	moveThread(OBRATNOTECH_PREFIX, 2843);
    }
if (prefix == S67) {
	moveThread(OBRATNOTECH_PREFIX, 2875);
    }
if (prefix == S68) {
	moveThread(OBRATNOTECH_PREFIX, 2907);
    }
if (prefix == S69) {
	moveThread(OBRATNOTECH_PREFIX, 2939);
    }
if (prefix == S70) {
    moveThread(OBRATNOTECH_PREFIX, 2971)
    }
if (prefix == S71) {
    moveThread(OBRATNOTECH_PREFIX, 3003)
    }
if (prefix == S72) {
    moveThread(OBRATNOTECH_PREFIX, 3035)
    }
if (prefix == S73) {
    moveThread(OBRATNOTECH_PREFIX, 3067)
    }
}

 
// Перемещение тем
 	   function moveThread(prefix, type) {
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
		   })();