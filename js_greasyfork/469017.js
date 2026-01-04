// ==UserScript==
// @name         Контроль Качества 
// @namespace    https://forum.blackrussia.online
// @version      1.1.1.3
// @description  пон да
// @author       @xmoore
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license 	 MIT
// @collaborator Maximillian Miller
// @icon https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png
// @copyright 2023
// @downloadURL https://update.greasyfork.org/scripts/469017/%D0%9A%D0%BE%D0%BD%D1%82%D1%80%D0%BE%D0%BB%D1%8C%20%D0%9A%D0%B0%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/469017/%D0%9A%D0%BE%D0%BD%D1%82%D1%80%D0%BE%D0%BB%D1%8C%20%D0%9A%D0%B0%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%B0.meta.js
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
 
// Кнопки в МЕНЮ
const buttons = [
    
    {
	  title: '-------------------------------------------------Ответы для "Баги из Тех.раздела"-------------------------------------------------',
	},
    {
	  title: 'Приветствие',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
        '[CENTER] *текст* [/CENTER][/FONT][/SIZE]'
	},
	{
	  title: 'На рассмотрении',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша тема взята на рассмотрение.[/CENTER][/SIZE][/FONT]<br>",
	  prefix: NARASSMOTRENII_PREFIX,
	  status: true,
	},
	{
	    title: 'Обнаружено',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]После проверки вашей темы баг был обнаружен.[/CENTER]<br>" +
        "[CENTER]Данный баг был передан разработчикам проекта.[/CENTER]<br><br>" +
		'[CENTER]Проверено Контролем Качества.[/CENTER]<br>' +
		"[CENTER]Закрыто.[/CENTER][/SIZE][/FONT]",
		prefix: QCUN_PREFIX,
	  status: false,
	},
	{
	     title: 'Не обнаружено(SERV)',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]После проверки вашей темы, мы не обнаружили баг/недоработку системы.[/CENTER]<br>" +
        "[CENTER]Скорее всего, данный баг произошел из-за серверных ошибок, либо уже был исправлен.[/CENTER]<br><br>" +
        '[CENTER]Проверено Контролем Качества.[/CENTER]<br>' +
		"[CENTER]Закрыто.[/CENTER][/SIZE][/FONT]",
		prefix: QCUN_PREFIX,
	  status: false,
	},
    {
	     title: 'Не обнаружено(CLIENT)',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]После проверки вашей темы, мы не обнаружили баг/недоработку системы.[/CENTER]<br>" +
        "[CENTER]Если проблема актуальна - попробуйте заново скачать лаунчер с офф. сайта - https://blackrussia.online.[/CENTER]<br><br>" +
        '[CENTER]Проверено Контролем Качества.[/CENTER]<br>' +
		"[CENTER]Закрыто.[/CENTER][/SIZE][/FONT]",
		prefix: QCUN_PREFIX,
	  status: false,
	},
	{
	    title: 'Известно',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
        "[CENTER]После проверки вашей темы, стало ясно, что данная ошибка/недоработка уже известна нам.[/CENTER]<br>" +
        "[CENTER]В скором времени баг будет исправлен.[/CENTER]<br><br>" +
        '[CENTER]Проверено Контролем Качества.[/CENTER]<br>' +
		"[CENTER]Закрыто.[/CENTER][/SIZE][/FONT]",
		prefix: QCUN_PREFIX,
	  status: false,
	},
    {
	    title: 'Не баг',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
        "[CENTER]Данная система не является ошибкой/недоработкой.[/CENTER]<br><br>" +
        '[CENTER]Проверено Контролем Качества.[/CENTER]<br>' +
		"[CENTER]Закрыто.[/CENTER][/SIZE][/FONT]",
		prefix: QCUN_PREFIX,
	  status: false,
	},
	{
	     title: 'Док-ва',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Без дополнительных доказательств или более подробного описания для воспроизведения бага — решить проблему не получится.[/CENTER]<br><br>" +
        "[CENTER]Если проблема актуальна — создайте новую тему, с более подробным описанием для воспроизведения бага или приложите дополнительные доказательсва.[/CENTER]<br><br>" +
        '[CENTER]Проверено Контролем Качества.[/CENTER]<br>' +
		"[CENTER]Закрыто.[/CENTER][/SIZE][/FONT]",
		prefix: QCUN_PREFIX,
	  status: false,
	},
	{
	  title: 'ОБТ',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Вы столкнулись с багом во время Открытого Бета-Теста(ОБТ) на [U]новом[/U] клиенте, его следует залить в форму, а не в технический раздел.[/CENTER]<br><br>" +
		"[CENTER]Ссылка на форму:[/CENTER]<br>" +
		"[CENTER]https://forms.gle/94Cpi9MvqmMpm2WB9[/CENTER]<br><br>" +
		'[CENTER]Баг с нового движка.[/CENTER]<br>' +
		"[CENTER]Закрыто.[/CENTER][/SIZE][/FONT]",
		prefix: QCUN_PREFIX,
	  status: false,
         },
{
    title: 'ОБТ IOS',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Вы столкнулись с багом во время Открытого Бета-Теста(ОБТ) на [U]iOS[/U] клиенте, его следует залить в форму, а не в технический раздел.[/CENTER]<br><br>" +
		"[CENTER]Ссылка на форму:[/CENTER]<br>" +
		"[CENTER]https://docs.google.com/forms/d/e/1FAIpQLSexETXyDfowKeNv-cgzyHQTel-idBZTlHvcO2i3b9NdSYpbSA/viewform[/CENTER]<br><br>" +
		'[CENTER]Баг с iOS движка.[/CENTER]<br>' +
		"[CENTER]Закрыто.[/CENTER][/SIZE][/FONT]",
		prefix: QCUN_PREFIX,
	  status: false,
         },
         {
	     title: 'Штрафы',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Чтобы решить данную проблему Вам нужно получить штраф, потом его оплатить.[/CENTER]<br><br>" +
        "[CENTER]Если у Вас есть порядок конкретных действий, которые привели к данному багу - создайте, пожалуйста, новую тему с багом, где будет чётко расписано при каких условиях данный баг происходит.[/CENTER]<br><br>" +
        '[CENTER]Проверено Контролем Качества.[/CENTER]<br>' +
		"[CENTER]Закрыто.[/CENTER][/SIZE][/FONT]",
		prefix: QCUN_PREFIX,
	  status: false,
	},
	{
	    title: 'Акс',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
        "[CENTER]Данная ошибка у игроков возникает в основном из-за того, что у них на нижних слотах инвентаря лежат различные предметы.[/CENTER]<br>" +
        "[CENTER]Для решения данной проблемы Вам нужно все предметы, которые находятся у Вас на нижних слотах инвентаря, переместить наверх.[/CENTER]<br><br>" +
        '[CENTER]Проверено Контролем Качества.[/CENTER]<br>' +
		"[CENTER]Закрыто.[/CENTER][/SIZE][/FONT]",
		prefix: QCUN_PREFIX,
	  status: false,
	},
	{
	     title: 'Не воспроизвести/Список ошибок(SERV)',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данную проблему невозможно воспроизвести специально, либо данный баг/ошибка могли произойти по одной из следующих причин:[/CENTER]<br>" +
        "[CENTER][QUOTE]1. Из-за серверных ошибок/сбоев[/CENTER]<br><br>" +
        "[CENTER]2. Либо данный баг уже был исправлен.[/QUOTE][/CENTER]<br><br>" +
        '[CENTER]Проверено Контролем Качества.[/CENTER]<br>' +
		"[CENTER]Закрыто.[/CENTER][/SIZE][/FONT]",
		prefix: QCUN_PREFIX,
	  status: false,
	},
	{
	     title: 'Не воспроизвести/Список ошибок(CLIENT)',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данную проблему невозможно воспроизвести специально, либо данный баг/ошибка могли произойти по одной из следующих причин:[/CENTER]<br>" +
        "[CENTER][QUOTE]1. Из-за проблемы в вашем телефоне[/CENTER]<br><br>" +
        "[CENTER]2. Из-за вашего плохого интернет-соединения[/CENTER]<br><br>" +
        "[CENTER]3. Из-за стороннего установленого клиента(лаунчера)[/CENTER]<br><br>" +
        "[CENTER]4. Либо данный баг уже был исправлен.[/QUOTE][/CENTER]<br><br>" +
        "[CENTER]Для решения проблемы попробуйте заново скачать и переустановить лаунчер с офф. сайта - https://blackrussia.online[/CENTER]<br><br>" +
        '[CENTER]Проверено Контролем Качества.[/CENTER]<br>' +
		"[CENTER]Закрыто.[/CENTER][/SIZE][/FONT]",
		prefix: QCUN_PREFIX,
	  status: false,
	},
	{
	  title: 'Дубль',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ответ дан в другой,ранее созданной вами, теме.[/CENTER]<br><br>" +
		'[CENTER]Дубль.[/CENTER]<br>' +
		"[CENTER]Закрыто.[/CENTER][/SIZE][/FONT]",
		prefix: QCUN_PREFIX,
	  status: false,
	},
	{
	  title: 'В «Заявки с окончательными ответами»',
	  content:
		'',
	  prefix: QCUN_PREFIX,
	  status: false,
	},
	{
	  title: '-----------------------------------------------------Перемещение по серверам------------------------------------------------------',
	},
    {
	  title: 'Сервер №1 | RED',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «RED».[/CENTER][/SIZE][/FONT]',
      prefix: S1,
	  status: true
 
	},
    {
	  title: 'Сервер №2 | GREEN',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «GREEN».[/CENTER][/SIZE][/FONT]',
      prefix: S2,
	  status: true
 
	},
    {
	  title: 'Сервер №3 | BLUE',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «BLUE».[/CENTER][/SIZE][/FONT]',
      prefix: S3,
	  status: true
 
	},
    {
	  title: 'Сервер №4 | YELLOW',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «YELLOW».[/CENTER][/SIZE][/FONT]',
       prefix: S4,
	  status: true
 
	},
    {
	  title: 'Сервер №5 | ORANGE',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «ORANGE».[/CENTER][/SIZE][/FONT]',
	  prefix: S5,
	  status: true		
 
	},
    {
	  title: 'Сервер №6 | PURPLE',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «PURPLE».[/CENTER][/SIZE][/FONT]',	
      prefix: S6,
	  status: true
	},
    {
	  title: 'Сервер №7 | LIME',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «LIME».[/CENTER][/SIZE][/FONT]',
      prefix: S7,
	  status: true
	},
    {
	  title: 'Сервер №8 | PINK',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «PINK».[/CENTER][/SIZE][/FONT]',
	  prefix: S8,
	  status: true
	},
    {
	  title: 'Сервер №9 | CHERRY',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «CHERRY».[/CENTER][/SIZE][/FONT]',
	  prefix: S9,
	  status: true
	},{
	  title: 'Сервер №10 | BLACK',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «BLACK».[/CENTER][/SIZE][/FONT]',
	  prefix: S10,
	  status: true
	},
    {
	  title: 'Сервер №11 | INDIGO',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «INDIGO».[/CENTER][/SIZE][/FONT]',
	  prefix: S11,
	  status: true
	},
    {
	  title: 'Сервер №12 | WHITE',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «WHITE».[/CENTER][/SIZE][/FONT]',
	  prefix: S12,
	  status: true
	},
    {
	  title: 'Сервер №13 | MAGENTA',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «MAGENTA».[/CENTER][/SIZE][/FONT]',
	  prefix: S13,
	  status: true
	},
    {
	  title: 'Сервер №14 | CRIMSON',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «CRIMSON».[/CENTER][/SIZE][/FONT]',
	  prefix: S14,
	  status: true
	},
    {
	  title: 'Сервер №15 | GOLD',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «GOLD».[/CENTER][/SIZE][/FONT]',
	  prefix: S15,
	  status: true
	},
    {
	  title: 'Сервер №16 | AZURE',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «AZURE».[/CENTER][/SIZE][/FONT]',
	  prefix: S16,
	  status: true
	},
    {
	  title: 'Сервер №17 | PLATINUM',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «PLATINUM».[/CENTER][/SIZE][/FONT]',
	  prefix: S17,
	  status: true
	},
    {
	  title: 'Сервер №18 | AQUA',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «AQUA».[/CENTER][/SIZE][/FONT]',
	  prefix: S18,
	  status: true
	},{
	  title: 'Сервер №19 | GRAY',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «GRAY».[/CENTER][/SIZE][/FONT]',
	  prefix: S19,
	  status: true
	},
    {
	  title: 'Сервер №20 | ICE',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «ICE».[/CENTER][/SIZE][/FONT]',
	  prefix: S20,
	  status: true
	},
    {
	  title: 'Сервер №21 | CHILLI',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «CHILLI».[/CENTER][/SIZE][/FONT]',
	  prefix: S21,
	  status: true
	},
    {
	  title: 'Сервер №22 | CHOCO',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «CHOCO».[/CENTER][/SIZE][/FONT]',
	  prefix: S22,
	  status: true
	},
    {
	  title: 'Сервер №23 | MOSCOW',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «MOSCOW».[/CENTER][/SIZE][/FONT]',
	  prefix: S23,
	  status: true
	},
    {
	  title: 'Сервер №24 | SPB',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «SPB».[/CENTER][/SIZE][/FONT]',
	  prefix: S24,
	  status: true
	},
    {
	  title: 'Сервер №25 | UFA',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «UFA».[/CENTER][/SIZE][/FONT]',
	  prefix: S25,
	  status: true		
	},
    {
	  title: 'Сервер №26 | SOCHI',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «SOCHI».[/CENTER][/SIZE][/FONT]',
	  prefix: S26,
	  status: true		
	},
	{
	  title: 'Сервер №27 | KAZAN',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «KAZAN».[/CENTER][/SIZE][/FONT]',
	  prefix: S27,
	  status: true		
	},
	{
	  title: 'Сервер №28 | SAMARA',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «SAMARA».[/CENTER][/SIZE][/FONT]',
	  prefix: S28,
	  status: true		
	},
	{
	  title: 'Сервер №29 | ROSTOV',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «ROSTOV».[/CENTER][/SIZE][/FONT]',
	  prefix: S29,
	  status: true		
	},
    {
	  title: 'Сервер №30 | ANAPA',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «ANAPA».[/CENTER][/SIZE][/FONT]',
	  prefix: S30,
	  status: true		
	},
	{
	  title: 'Сервер №31 | EKB',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «ERB».[/CENTER][/SIZE][/FONT]',
	  prefix: S31,
	  status: true		
	},
	{
	  title: 'Сервер №32 | KRASNODAR ',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «KRASNODAR».[/CENTER][/SIZE][/FONT]',
	  prefix: S32,
	  status: true		
	},
	{
	  title: 'Сервер №33 | ARZAMAS ',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «ARZAMAS».[/CENTER][/SIZE][/FONT]',
	  prefix: S33,
	  status: true		
	},
	{
	  title: 'Сервер №34 | NOVOSIBIRSK ',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «NOVOSIBIRSK».[/CENTER][/SIZE][/FONT]',
	  prefix: S34,
	  status: true		
	},
	{
	  title: 'Сервер №35 | GROZNY ',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «GROZNY».[/CENTER][/SIZE][/FONT]',
	  prefix: S35,
	  status: true		
	},
	{
	  title: 'Сервер №36 | SARATOV ',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «SARATOV».[/CENTER][/SIZE][/FONT]',
	  prefix: S36,
	  status: true		
	},
	{
	  title: 'Сервер №37 | OMSK ',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «OMSK».[/CENTER][/SIZE][/FONT]',
	  prefix: S37,
	  status: true		
	},
	{
	  title: 'Сервер №38 | IRKUTSK ',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «IRKUTSK».[/CENTER][/SIZE][/FONT]',
	  prefix: S38,
	  status: true		
	},
	{
	  title: 'Сервер №39 | VOLGOGRAD ',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «VOLGOGRAD».[/CENTER][/SIZE][/FONT]',
	  prefix: S39,
	  status: true		
	},
	{
	  title: 'Сервер №40 | VORONEZH ',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «VORONEZH».[/CENTER][/SIZE][/FONT]',
	  prefix: S40,
	  status: true		
	},
	{
	  title: 'Сервер №41 | BELGOROD ',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «BELGOROD».[/CENTER][/SIZE][/FONT]',
	  prefix: S41,
	  status: true		
	},
	{
	  title: 'Сервер №42 | MAKHACHKALA ',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «MAKHACHKALA».[/CENTER][/SIZE][/FONT]',
	  prefix: S42,
	  status: true		
	},
	{
	  title: 'Сервер №43 | VLADIKAVKAZ ',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема передается обратно Техническому специалисту.[/CENTER]<br>" +
        "[CENTER]Последующие решения будут от него.[/CENTER]<br><br>" +
        '[CENTER]На рассмотрении у Технического специалиста сервера «VLADIKAVKAZ».[/CENTER][/SIZE][/FONT]',
	  prefix: S43,
	  status: true		
	},
];
$(document).ready(() => {
 
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
// Добавление кнопок при загрузке страницы
addButton('>>>>>>>>>>>>>>>>>>>>МЕНЮ(TEХ)<<<<<<<<<<<<<<<<<<<<', 'selectAnswer');
 
 
// Поиск информации о теме
	const threadData = getThreadData();
 
	$('button#pin').click(() => editThreadData(NARASSMOTRENII_PREFIX, false)); // На рассмотрении
    $('button#watched').click(() => editThreadData(RASSMOTRENO_PREFIX, false)); // Рассмотрено
	$('button#checkk').click(() => editThreadData(QCCLOSED_PREFIX, false)); // Проверено QC
	$('button#tech').click(() => editThreadData(OBRATNOTECH_PREFIX, true)); // Теху
 
	$(`button#selectAnswer`).click(() => {
	   XF.alert(buttonsMarkup(buttons), null, '(v12.2.2)Выберите действие:');
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
(function () {
    // Названия префиксов
const RASSMOTRENO_PREFIX = 9; // Рассмотрено
const NARASSMOTRENII_PREFIX = 2; //   На рассмотрении
 
// Кнопки в МЕНЮ
const buttons = [
    
    {
	  title: '--------------Ответы для Багов от Тестеров----------',
	},
    {
	  title: 'Приветствие',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
        '[CENTER] *текст* [/CENTER][/FONT][/SIZE]'
	},
	{
	  title: 'На рассмотрении',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша тема взята на рассмотрение.[/CENTER][/SIZE][/FONT]<br>",
	  prefix: NARASSMOTRENII_PREFIX,
	  status: true,
	},
	{
	    title: 'Обнаружено(#высокая)',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]После проверки вашей темы баг был обнаружен.[/CENTER]<br>" +
        "[CENTER]Данный баг был передан разработчикам проекта.[/CENTER]<br><br>" +
        "[CENTER]За найденный баг вы получите 15 баллов.[/CENTER]<br><br>" +
		'[CENTER]Проверено Контролем Качества.[/CENTER]<br>' +
		"[CENTER]Закрыто.[/CENTER][/SIZE][/FONT]",
		prefix: RASSMOTRENO_PREFIX,
	    status: false,
	},
	{
	    title: 'Обнаружено(#средняя)',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]После проверки вашей темы баг был обнаружен.[/CENTER]<br>" +
        "[CENTER]Данный баг был передан разработчикам проекта.[/CENTER]<br><br>" +
        "[CENTER]За найденный баг вы получите 10 баллов.[/CENTER]<br><br>" +
		'[CENTER]Проверено Контролем Качества.[/CENTER]<br>' +
		"[CENTER]Закрыто.[/CENTER][/SIZE][/FONT]",
		prefix: RASSMOTRENO_PREFIX,
	    status: false,
	},
	{
	    title: 'Обнаружено(#низкая)',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]После проверки вашей темы баг был обнаружен.[/CENTER]<br>" +
        "[CENTER]Данный баг был передан разработчикам проекта.[/CENTER]<br><br>" +
        "[CENTER]За найденный баг вы получите 5 баллов.[/CENTER]<br><br>" +
		'[CENTER]Проверено Контролем Качества.[/CENTER]<br>' +
		"[CENTER]Закрыто.[/CENTER][/SIZE][/FONT]",
		prefix: RASSMOTRENO_PREFIX,
	    status: false,
	},
	{
	     title: 'Не обнаружено',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]После проверки вашей темы, мы не обнаружили баг/недоработку системы.[/CENTER]<br>" +
        "[CENTER]Скорее всего, данный баг произошел из-за серверных ошибок, либо уже был исправлен.[/CENTER]<br><br>" +
        '[CENTER]Проверено Контролем Качества.[/CENTER]<br>' +
		"[CENTER]Закрыто.[/CENTER][/SIZE][/FONT]",
		prefix: RASSMOTRENO_PREFIX,
	    status: false,
	},
	{
	    title: 'Известно',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
        "[CENTER]После проверки вашей темы, стало ясно, что данная ошибка/недоработка уже известна нам.[/CENTER]<br>" +
        "[CENTER]В скором времени баг будет исправлен.[/CENTER]<br><br>" +
        '[CENTER]Проверено Контролем Качества.[/CENTER]<br>' +
		"[CENTER]Закрыто.[/CENTER][/SIZE][/FONT]",
		prefix: RASSMOTRENO_PREFIX,
	    status: false,
	},
	{
	    title: 'Не баг',
	  content:
		'[FONT=Courier new][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
        "[CENTER]Данная система не является ошибкой/недоработкой.[/CENTER]<br><br>" +
        '[CENTER]Проверено Контролем Качества.[/CENTER]<br>' +
		"[CENTER]Закрыто.[/CENTER][/SIZE][/FONT]",
		prefix: RASSMOTRENO_PREFIX,
	    status: false,
	},
];
$(document).ready(() => {
 
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
// Добавление кнопок при загрузке страницы
addButton('>>>>>>>>>>>>>>>>>>МЕНЮ(TESTERS)<<<<<<<<<<<<<<<<<', 'selectAnswer1'); 
 
 
// Поиск информации о теме
	const threadData = getThreadData();
 
	$('button#pin').click(() => editThreadData(NARASSMOTRENII_PREFIX, false)); // На рассмотрении
    $('button#watched').click(() => editThreadData(RASSMOTRENO_PREFIX, false)); // Рассмотрено
 
	$(`button#selectAnswer1`).click(() => {
	   XF.alert(buttonsMarkup(buttons), null, '(v12.2.2)Выберите действие:');
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
