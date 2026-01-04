// ==UserScript==
// @name         QC & Tech
// @namespace    https://forum.blackrussia.online
// @version      13.1.1
// @description  Специально для техов и кк
// @author       xmoore
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license 	 MIT
// @collaborator Maximka55
// @icon https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png
// @copyright 2022
// @downloadURL https://update.greasyfork.org/scripts/465712/QC%20%20Tech.user.js
// @updateURL https://update.greasyfork.org/scripts/465712/QC%20%20Tech.meta.js
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
 
// Кнопки в МЕНЮ
const buttons = [
    
    {
	  title: '-------------------------------------------------Ответы для "Баги из Тех.раздела"-------------------------------------------------',
	},
    {
	  title: 'Приветствие',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
        '[CENTER] *текст* [/CENTER][/FONT][/SIZE]'
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
	     title: 'Не обнаружено',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]После проверки вашей темы, мы не обнаружили баг/недоработку системы.[/CENTER]<br>" +
        "[CENTER]Скорее всего, данный баг произошел из-за серверных ошибок, либо уже был исправлен.[/CENTER]<br><br>" +
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
	{
	  title: 'ОБТ',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Вы столкнулись с багом во время Открытого Бета-Теста(ОБТ) на [U]новом[/U] клиенте, его следует залить в форму, а не в технический раздел.[/CENTER]<br><br>" +
		"[CENTER]Ссылка на форму:[/CENTER]<br>" +
		"[CENTER]https://forms.gle/94Cpi9MvqmMpm2WB9[/CENTER]<br><br>" +
		'[CENTER]Баг с нового движка.[/CENTER]<br>' +
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
        "[CENTER]Для решения проблемы попробуйте заново скачать и переустановить лаунчер с офф. сайта - https://blackrussia.online[/CENTER]<br><br>" +
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
	  title: '-----------------------------------------------------Перемещение по серверам------------------------------------------------------',
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
	   XF.alert(buttonsMarkup(buttons), null, '(v12.0)Выберите действие:');
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
	  title: '---------------------------------------------------Ответы для Багов от Тестеров---------------------------------------------------',
	},
    {
	  title: 'Приветствие',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
        '[CENTER] *текст* [/CENTER][/FONT][/SIZE]'
	},
	{
	    title: 'Обнаружено(#высокая)',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]После проверки вашей темы баг был обнаружен.[/CENTER]<br>" +
        "[CENTER]Данный баг был передан разработчикам проекта.[/CENTER]<br><br>" +
        "[CENTER]За найденный баг вы получите 15 баллов.[/CENTER]<br><br>" +
		'[CENTER]Проверено Контролем Качества.[/CENTER]<br>' +
		"[CENTER]Закрыто.[/CENTER][/SIZE][/FONT]",
	},
	{
	    title: 'Обнаружено(#средняя)',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]После проверки вашей темы баг был обнаружен.[/CENTER]<br>" +
        "[CENTER]Данный баг был передан разработчикам проекта.[/CENTER]<br><br>" +
        "[CENTER]За найденный баг вы получите 10 баллов.[/CENTER]<br><br>" +
		'[CENTER]Проверено Контролем Качества.[/CENTER]<br>' +
		"[CENTER]Закрыто.[/CENTER][/SIZE][/FONT]",
	},
	{
	    title: 'Обнаружено(#низкая)',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]После проверки вашей темы баг был обнаружен.[/CENTER]<br>" +
        "[CENTER]Данный баг был передан разработчикам проекта.[/CENTER]<br><br>" +
        "[CENTER]За найденный баг вы получите 5 баллов.[/CENTER]<br><br>" +
		'[CENTER]Проверено Контролем Качества.[/CENTER]<br>' +
		"[CENTER]Закрыто.[/CENTER][/SIZE][/FONT]",
	},
	{
	     title: 'Не обнаружено',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Приветствую, уважаемый(-ая)[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]После проверки вашей темы, мы не обнаружили баг/недоработку системы.[/CENTER]<br>" +
        "[CENTER]Скорее всего, данный баг произошел из-за серверных ошибок, либо уже был исправлен.[/CENTER]<br><br>" +
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
	  title: 'Префикс "Рассмотрено"',
	  content:
		'',
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
	   XF.alert(buttonsMarkup(buttons), null, '(v12.0)Выберите действие:');
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
(function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // префикс отказано
	const PIN_PREFIX = 2; //  префикс закрепить
	const COMMAND_PREFIX = 10; // команде проекта
	const CLOSE_PREFIX = 7; // префикс закрыто
	const DECIDED_PREFIX = 6; // префикс решено
	const TECHADM_PREFIX = 13 // теху администратору
	const WATCHED_PREFIX = 9; // рассмотрено
	const WAIT_PREFIX = 14; // ожидание (для переноса в баг-трекер)
	const NO_PREFIX = 0;
	const buttons = [
	{
		title: 'Приветсвие',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER] текст [/CENTER][/FONT][/SIZE]',
	},
	{
	  title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ  Для Логировщиков ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
	},
	{
		title: 'Рассмотрение',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Ваша тема взята на рассмотрение, ожидайте ответ в ближайшее время<br>Часто рассмотрение темы может занять определенное время.<br>[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/CENTER][/FONT][/SIZE]',
		prefix: PIN_PREFIX,
		status: true,
	},
	{
		title: 'Ожидайте вердикта Куратора',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша тема закреплена и ожидает вердикта <u>Куратора Технических специалистов</u>.<br>" +
		'[CENTER]<u>Создавать подобные темы не нужно</u>.<br>[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/CENTER][/FONT][/SIZE]',
		prefix: PIN_PREFIX,
		status: true,
	},
	{
		title: 'ДУБЛИРОВАНИЕ',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема является <u>дубликатом вашей предыдущей темы</u>.<br>Пожалуйста, <u><b>прекратите создавать идентичные или похожие темы - иначе Ваш форумный аккаунт может быть заблокирован</b></u>.<br><br>" +
		'[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Будете разблокированы',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]<br> Ваша жалоба переадресована  Куратору Технических специалистов<br>Аккаунт был разблокирован, приношу свои извинения.<br>Ожидайте ответа в данной теме, копии создавать не нужно.<br>[/CENTER]<br>'+
		'[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/CENTER][/FONT][/SIZE]',
		prefix: PIN_PREFIX,
		status: true,
	},
	{
		title: 'Форма подачи "ЖБ НА ТЕХ"',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Пожалуйста, заполните форму, создав новую тему: Название темы с NickName технического специалиста<br>Пример:<br> Lev_Kalashnikov | махинации<br>Форма заполнения темы:<br>[code]01. Ваш игровой никнейм:<br>02. Игровой никнейм технического специалиста:<br>03. Сервер, на котором Вы играете:<br>04. Описание ситуации (описать максимально подробно и раскрыто):<br>05. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>06. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/code]<br>" +
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'ПРАВИЛА РАЗДЕЛА',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела в котором Вы создали тему, так как Ваш запрос не относится к жалобам на технических специалистов.<br>Что принимается в данном разделе:<br>Жалобы на технических специалистов, оформленные по форме подачи и не нарушающие правила подачи:<br> [FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Правила подачи жалобы на технических специалистов[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[QUOTE][FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01.[/COLOR] Ваш игровой никнейм:[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]<br>02.[/COLOR] Игровой никнейм технического специалиста:[COLOR=rgb(226, 80, 65)]<br>03.[/COLOR] Сервер, на котором Вы играете:[COLOR=rgb(226, 80, 65)]<br>04.[/COLOR] Описание ситуации (описать максимально подробно и раскрыто):[COLOR=rgb(226, 80, 65)]<br>05.[/COLOR] Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):[COLOR=rgb(226, 80, 65)]<br>06.[/COLOR] Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/SIZE][/FONT][/SIZE][/QUOTE]<br><br>[FONT=verdana][SIZE=4][FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]Примечание:[/COLOR] все оставленные заявки обращения в данный раздел обязательно должны быть составлены по шаблону предоставленному немного выше.<br>В ином случае, заявки обращения в данный раздел составленные не по форме — будут отклоняться.<br>Касательно названия заголовка темы — четких правил нет, но, желательно чтобы оно содержало лишь никнейм и сервер технического специалиста.<br>Заранее, настоятельно рекомендуем ознакомиться [U][B][URL='https://forum.blackrussia.online/index.php?forums/faq.231/']с данным разделом[/URL][/B][/U].[/SIZE][/FONT][/SIZE][/FONT]<br>[CENTER][FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Какие жалобы не проверяются?[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]—[/COLOR] Если в содержании темы присутствует оффтоп/оскорбления.<br>[SIZE=4][COLOR=rgb(226, 80, 65)]—[/COLOR] Если в заголовке темы отсутствует никнейм технического специалиста.<br>[COLOR=rgb(226, 80, 65)]—[/COLOR] С момента выдачи наказания прошло более 7 дней.[/SIZE][/SIZE][/FONT]<br>" +
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Срок подачи жб',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER] С момента выдачи наказания прошло более 7-ми дней.<br>Рассмотрение невозможно[/center]<br><br>'+
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Вам в Технический раздел',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша тема не как не относится к жалобам на технических специалистов, обратитесь с данной темой в <u>технический раздел вашего сервера</u> - [URL='https://forum.blackrussia.online/index.php?forums/Технический-раздел.22/']клик[/URL]<br><br>" +
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'обжалование не подлежит вообще',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша блокировка не подлежит обжалованию.<br>Вы получили блокировку за серьезное нарушение, которое невозможно обжаловать/обнулить.<br>" +
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Наказание будет снижено',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Проверив вашу историю наказаний, было принято решение о снижении срока блокировки аккаунта.<br>Будьте аккуратнее в следующие разы, ведь на встречу пойти мы врятли сможем.<br>" +
		'[CENTER][CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Восст.доступа к аккаунту',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Если Вы обезопасили Ваш аккаунт и [U]привязали его к странице во ВКонтакте[/U], то сбросить пароль или пин-код Вы всегда сможете обратившись в официальное сообщество проекта - https://vk.com/blackrussia.online.<br> Либо в телеграмм бот - https://t.me/br_helper_bot.<br> Напишите «Начать» в личные сообщения группы/бота, затем выберите нужные Вам функции.<br><br>" +
		"[CENTER][FONT=Veranda]Подробнее в данной теме - [URL='https://forum.blackrussia.online/index.php?threads/lime-Защита-игрового-аккаунта.1201253/']клик[/URL][/center]<br><br>" +
		"[CENTER]Если Вы обезопасили Ваш аккаунт и [U]привязали его к почте[/U], то сбросить пароль или пин-код Вы всегда сможете при вводе пароля на сервере. После подключения к серверу нажмите на кнопку «Войти в аккаунт», затем выберите кнопку «Восстановить пароль», после чего на Вашу почту будет отправлено письмо с одноразовым кодом восстановления.<br><br>" +
		"[CENTER]Если Вы [U]не обезопасили свой аккаунт - его невозможно вернуть[/U]. Игрок самостоятельно несет отвественность за безопаность своего аккаунта.<br><br>" +
		'[CENTER]К сожалению, иногда решение подобных вопросов требует много времени. Надеемся, что Вы сможете восстановить доступ к аккаунту!<br>' +
		'[I][COLOR=rgb(127, 255, 0)]Рассмотрено[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: WATCHED_PREFIX,
		status: false,
	},
	{
		title: 'Нет окна блокировки',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Без окна о блокировке тема не подлежит рассмотрению - создайте новую тему, приложив окно блокировки с фото-хостинга<br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL]<br>(все кликабетильно).<br>" +
		'[CENTER][CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR].[/CENTER][/FONT][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Правила восстановления',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Пожалуйста, убедительная просьба, ознакомьтесь с правилами восстановлений - [URL='https://forum.blackrussia.online/index.php?threads/В-каких-случаях-мы-не-восстанавливаем-игровое-имущество.25277/']клик[/URL].<br> Вы создали тему, которая не относится к технической проблеме.[/CENTER]<br><br>" +
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Если не пришел донат',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Система построена таким образом, что <b>деньги не спишутся, пока наша платформа не уведомит платежную систему о зачислении BLACK COINS</b>. Для проверки зачисления BLACK COINS необходимо ввести в игре команду: <u>/donat</u>.<br>' +
		'[CENTER]В остальных же случаях, <b>если не были зачислены BLACK COINS — вероятнее всего, была допущена ошибка при вводе реквизитов</b>. К нашему сожалению, из-за большого количества попыток обмана, мы перестали рассматривать подобные жалобы.<br><i>Вам необходимо быть внимательными при осуществлении покупок</i>.<br>' +
		'[CENTER]Если Вы считаете, что ошибки быть не может и с момента оплаты не прошло более 14 дней, то в обязательном порядке обратитесь в данное сообщество для дальнейшего решения: https://vk.com/br_tech.<br>' +
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Донат',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Мы рассмотрели ваш запрос о возврате денежных средств и сообщаем следующее.<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Запуская игру, пользователь <u>соглашается с правилами её использования</u>, которые изложены в <u>Пользовательском соглашении</u>, что по смыслу ст. 435 и 438 Гражданского кодекса РФ является принятием (акцептом) оферты Компании https://blackrussia.online/oferta.php, а равно заключением договора.<br><br>Согласно Пользовательскому соглашению <u>«Внутриигровая валюта» – виртуальная внутриигровая валюта</u>, являющаяся неактивированными данными и командами, которая не имеет денежной стоимости и не подлежит денежной оценке, хотя и имеет цену на момент приобретения.<br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Согласно п. Политика возврата платежей, Пользовательского соглашения денежные средства за внутриигровые товары не подлежат возврату с момента появления Внутриигровой валюты на счете аккаунта.<br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Согласно п. Политика возврата платежей, Пользовательского соглашения пользователь самостоятельно следит за безопасностью своего аккаунта, сам несет ответственность за все действия, которые выполняются в сервисах с помощью его аккаунта, а также в нем самом.<br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Согласно п. Политика возврата платежей, Пользовательского соглашения пользователь гарантирует, что он имеет право использовать выбранные им платежные средства, не нарушая при этом законодательства РФ и/или законодательства иной страны, гражданином которой является пользователь, и прав третьих лиц.<br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Компания /u>не несет ответственности за возможный ущерб третьим лицам</u>, причиненный в результате использования пользователем не принадлежащих ему средств оплаты.<br><br> ' +
		'[SIZE=4][FONT=Veranda][CENTER]</u>Совершая покупки внутри игры</u>, а также предоставляя платежную информацию, Вы гарантируете, что являетесь законным владельцем платёжного средства и аккаунта, связанного с данным платежом.<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Все действия с картой считаются совершенными с Вашего ведома и согласия, то есть лично владельцем карты.<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Кроме того, в соответствии законодательством РФ родители несут имущественную ответственность по сделкам малолетнего, в том числе по сделкам, совершенным им самостоятельно.<br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Таким образом, если Вы являетесь законными представителем, Вы отвечаете за действия ребёнка внутри игры. Компания не может отслеживать действия несовершеннолетнего и нести за них ответственность.<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Таким образом основания для возврата денежных средств отсутствуют.<br>' +
		'[CENTER][I][COLOR=rgb(127, 255, 0)]Решено[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: DECIDED_PREFIX,
	  status: false,
	},
	{
		title: 'Выдача компенсации',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваше игровое имущество/денежные средства будут восстановлены в течение недели. <br>Убедительная просьба, <b><u>не менять никнейм до момента восстановления</u></b>.<br>" +
		'[CENTER]Для активации восстановления используйте команды:[COLOR=rgb(255, 213, 51)]/roulette[/COLOR], [COLOR=rgb(255, 213, 51)]/recovery[/COLOR].[/CENTER]<br>' +
		'[CENTER][COLOR=rgb(127, 255, 0)]Решено[/COLOR].[/CENTER][/FONT][/SIZE]',
		status: false,
		prefix: DECIDED_PREFIX,
	},
	{
		title: 'Переустановите игру',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Возможно в файлах вашей игры присутствуют постороннее оборудование(дополнения/изменения).<br>" +
		"[CENTER]Рекомендуется удалить полностью лаунчер и связанные с ним файлы и установить игру заново с официального сайта - [URL='https://blackrussia.online']перейти[/URL]. <br>" +
		'[CENTER][I][COLOR=rgb(127, 255, 0)]Рассмотрено[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: DECIDED_PREFIX,
		status: false,
	},
	{
		title: 'Актуально?',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваше обращение актуально?[/CENTER][/FONT][/SIZE]",
		status: true,
	},
	{
		title: 'Отсутствие ответа',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]По техническими соображениям было принято решение закрыть данное обращение.<br><br>" +
		"[CENTER]Если данная проблема все ещё актуальна, пожалуйста оставьте новую заявку в данном разделе ещё раз.<br>" +
		'[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'НЕ ОТНОСИТСЯ',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Ваше обращение не относится к жалобам на технических специалистов.<br>' +
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Игрок будет заблокирован(Жб игроков)',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER][SIZE=4][FONT=Veranda]После проверки доказательств и системы логирования вердикт:<br><br>[COLOR=rgb(65, 168, 95)][FONT=verdana]Игрок будет заблокирован[/COLOR][/CENTER]<br><br>" +
		"[CENTER][SIZE=4][FONT=Veranda][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/FONT][/CENTER]",
	},
	{
		title: 'Игрок не будет заблокирован(Жб игроков)',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER][SIZE=4][FONT=Veranda]После проверки доказательств и системы логирования вердикт:<br><br>[COLOR=rgb(255, 0, 0)]Доказательств недостаточно для блокировки игрока[/COLOR].[/CENTER]<br><br>" +
		"[CENTER][SIZE=4][FONT=Veranda][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/FONT][/CENTER]",
	},
	{
		title: 'ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ ᅠ  Для Форумников  ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ ᅠ',
	},
	{
		title: 'ФОРМА',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Пожалуйста, заполните форму, создав новую тему: <br>[CODE]01. Ваш игровой никнейм:<br>02. Сервер, на котором Вы играете:<br>03. Суть Вашей возникшей проблемы (описать максимально подробно и раскрыто): <br>04. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>05. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/CODE]<br><br>" +
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/CENTER][/I].[/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'ПРАВИЛА РАЗДЕЛА',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела в котором Вы создали тему, так как Ваш запрос не относится к технической проблеме.<br>Что принимается в тех разделе:<br>Если возникли технические проблемы, которые так или иначе связаны с игровым модом<br>Форма заполнения:<br>[QUOTE]<br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01.[/COLOR] Ваш игровой никнейм:<br>[COLOR=rgb(226, 80, 65)]02.[/COLOR] Сервер, на котором Вы играете:<br>[COLOR=rgb(226, 80, 65)]03.[/COLOR] Суть возникшей проблемы (описать максимально подробно и раскрыто):<br>[COLOR=rgb(226, 80, 65)]04.[/COLOR] Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>[COLOR=rgb(226, 80, 65)]05.[/COLOR] Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/SIZE][/FONT][/QUOTE]<br>[/CENTER]<br><br>[CENTER][FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Если возникли технические проблемы, которые так или иначе связаны с вылетами из игры и любыми другими проблемами клиента[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[QUOTE]<br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01. [/COLOR]Ваш игровой ник:<br>[COLOR=rgb(226, 80, 65)]02. [/COLOR]Сервер:<br>[COLOR=rgb(226, 80, 65)]03.[/COLOR] Тип проблемы: Обрыв соединения | Проблема с ReCAPTCHA | Краш игры (закрытие игры) | Другое [Выбрать один вариант ответа]<br>[COLOR=rgb(226, 80, 65)]04. [/COLOR]Действия, которые привели к этому (при вылетах, по возможности предоставлять место сбоя):<br>[COLOR=rgb(226, 80, 65)]05.[/COLOR] Как часто данная проблема:<br>[COLOR=rgb(226, 80, 65)]06.[/COLOR] Полное название мобильного телефона:<br>[COLOR=rgb(226, 80, 65)]07.[/COLOR] Версия Android:<br>[COLOR=rgb(226, 80, 65)]08. [/COLOR]Дата и время (по МСК):<br>[COLOR=rgb(226, 80, 65)]09. [/COLOR]Связь с Вами по Telegram/VK:[/SIZE][/FONT][/QUOTE]" +
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Передано логисту для проверки',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша тема закреплена и передана <u>Техническому специалисту по логированию для дальнейшего вердикта</u>,ожидайте ответ в данной теме.<br><br>" +
		'[CENTER]Создавать новые темы с данной проблемой — не нужно.[/CENTER][/FONT][/SIZE]',
		prefix: TECHADM_PREFIX,
		status: true,
	},
	{
		title: 'ЖБ на ТЕХОВ',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Вы получили наказание от технического специалиста Вашего сервера.<br>Вам следует обратиться в раздел «Жалобы на технических специалистов» — в случае, если Вы не согласны с наказанием.<br><br>' +
		"[CENTER]Ссылка на раздел, где можно оформить жалобу на технического специалиста - [URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-технических-специалистов.490/']клик[/URL] <br><br>" +
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Для ошибок во время ОБТ',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' + 
		"[CENTER]Если вы нашли какую-либо ошибку во время Открытого Бэта Тестирования то сделайте следующие действия.<br><br>1. Отправьте пожалуйста найденную недоработку в данную форму - [URL='https://docs.google.com/forms/d/e/1FAIpQLSexVwEcvQ9gI6KDjvb65M5A6Yoc5QLyVGWcHjBb21_4BKaX4w/viewform']клик[/URL]<br>2. Передайте данную форму своим друзьям, для ускорения процесса по сбору багов для их исправления.<br><br>Спасибо за ваш вклад в развитие игры!<br>[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]",
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Почему у меня пропали все темы из раздела Жалобы?',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Раздел 'Жалобы' переведен в приватный режим, а именно:<br>Тему созданную пользователем пожет видеть <b>он сам</b> и <b>администрация сервера</b>.<br>Ознакомиться с формой подачи тем в тот или иной раздел можно по данной ссылке: [URL='https://forum.blackrussia.online/index.php?forums/Правила-подачи-жалоб.202/']клик[/URL]<br>Приятного времяпрепровождения на нашем форуме<br>[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]",
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Не весь рейтинг за груз',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' + 
		'[CENTER]Наша система постоена следующим образом<br>Рейтинг зависит от поломки автомобиля чем серьёзнее поломка, тем меньше будет засчитан рейтинг.<br>Поломка учитывается вся за время рейса с грузом, в независимости от того если Вы почините Ваш автомобиль, поломка до, будет учтена.<br>[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	},
	{
		title: 'Не является багом',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Данная "фича" не является багом.<br><br>',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'ТЕСТЕРАМ',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша тема передана на тестирование.[/CENTER][/FONT][/SIZE]",
		  prefix: WAIT_PREFIX,
		  status: false,
	},
	{
		title: 'Ответ от ТЕСТЕРОВ',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Ответ от тестерского отдела дан выше.<br><br>' +
		'[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
		title: 'Пропали вещи с аукциона',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Если вы выставили свои вещи на аукцион а их никто не купил, то воспользуйтесь командой [COLOR=rgb(251, 160, 38)]/reward[/COLOR]<br> В случае отсутствии вещей там, приложите скриншоты с + /time в новой теме<br>[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Если не работают ссылки',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]По техническим причинам данное действие невозможно, пожалуйста воспользуйтесь копированием ссылки от сюда:<br>[img]https://i.ibb.co/SX77Fgw/photo-2022-08-20-16-31-57.jpg[/img]<br>Если данный способ не помогает, то используйте сервис сокращения ссылок https://clck.ru<br> Либо попробуйте вот так:<br>1) загрузка скриншота биографии на фотохостинг<br>2) в описание прикрепить ссылку с форума<br>3) скопировать пост с фотохостинга<br><br>2 способ:<br>Сократите ссылки для Ваших скриншотов и RP биографии, сделать можно тут goo.su  также Iformation замените на русский текст, просмотрите еще текст полностью и постарайтесь уменьшить такие знаки как !?<br>goo.su[/CENTER]<br>"+
		'[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'В раздел Госс Организаций.',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Ваша тема не относится к техническому разделу, пожалуйста оставьте ваше заявление в соответствующем разделе Государственных Организаций вашего сервера.[/CENTER]<br><br>'+
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'В раздел Криминальных Организаций',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Ваша тема не относится к техническому разделу, пожалуйста оставьте ваше заявление в соответствующем разделе Криминальных Организаций вашего сервера [/CENTER]'+
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Жб на адм',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Если вы не согласны с выданным наказанием от администратора сервера и прошло не более 48-ех часов с момента выдачи наказания, обратитесь в раздел Жалобы на администрацию вашего сервера.<br>Форма для подачи жалобы - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/']тут[/URL]<br>" +
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
		title: 'Жб на игроков',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная тема не относится к техническому разделу.<br> Если с момента проишествия не прошло более 3-ех дней, создайте тему в разделе<br>'Жалобы на игроков'<br>Вашего сервера.<br>Форма подачи жалобы - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/']тык[/URL]" +
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
		title: 'Обжалования',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Вы получили наказание от администратора своего сервера.<br> Для его снижения/обжалования обратитесь в раздел<br><<Обжалования>> вашего сервера.<br>Форма подачи темы - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']клик[/URL]" +
		'[[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
		title: 'Сервер не отвечает',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Если у Вас встречаются такие проблемы, как «Сервер не отвечает», не отображаются сервера в лаунчере, не удаётся выполнить вход на сайт/форум, попробуйте совершить следующие действия: <br><br>" +
		"[LEFT]• Сменить IP-адрес любыми средствами; <br>" +
		"[LEFT]• Переключиться на Wi-Fi/мобильный интернет или на любую доступную сеть; <br>"+
		"[LEFT]• Использование VPN; <br>"+
		"[LEFT]• Перезагрузка роутера.<br><br>" +
	
		"[CENTER]Если методы выше не помогли, то переходим к следующим шагам: <br><br>" +
	
		'[LEFT]1. Устанавливаем приложение «1.1.1.1: Faster & Safer Internet» Ссылка: https://clck.ru/ZP6Av и переходим в него.<br>'+
		'[LEFT]2. Соглашаемся со всей политикой приложения.<br>'+
		'[LEFT]3. Нажимаем на ползунок и ждем, когда текст изменится на «Подключено».<br>'+
		'[LEFT]4. Проверяем: Отображаются ли серверы? Удается ли выполнить вход в игру? Работают ли другие источники (сайт, форум)? <br>' +
	
		"[CENTER]📹 Включение продемонстрировано на видео: https://youtu.be/Wft0j69b9dk<br>[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]",
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Кик за ПО',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Если вы были кикнуты из игры за "Подозрительное ПО"<br>Это могло произойти по одной из причин:<br><b>Вы полностью не остановились на метке для разгрузки/загрузки на работе дальнобойщика</b><br>При стрельбе вы постоянно нажимали на кнопку стрельбы.<br>Старайтесь избегать данных действий.<br>[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Если не пришел донат',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Система построена таким образом, что <b>деньги не спишутся, пока наша платформа не уведомит платежную систему о зачислении BLACK COINS</b>. Для проверки зачисления BLACK COINS необходимо ввести в игре команду: <u>/donat</u>.<br>' +
		'[CENTER]В остальных же случаях, <b>если не были зачислены BLACK COINS — вероятнее всего, была допущена ошибка при вводе реквизитов</b>. К нашему сожалению, из-за большого количества попыток обмана, мы перестали рассматривать подобные жалобы.<br><i>Вам необходимо быть внимательными при осуществлении покупок</i>.<br>' +
		'[CENTER]Если Вы считаете, что ошибки быть не может и с момента оплаты не прошло более 14 дней, то в обязательном порядке обратитесь в данное сообщество для дальнейшего решения: https://vk.com/br_tech.<br>' +
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Донат',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Мы рассмотрели ваш запрос о возврате денежных средств и сообщаем следующее.<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Запуская игру, пользователь <u>соглашается с правилами её использования</u>, которые изложены в <u>Пользовательском соглашении</u>, что по смыслу ст. 435 и 438 Гражданского кодекса РФ является принятием (акцептом) оферты Компании https://blackrussia.online/oferta.php, а равно заключением договора.<br><br>Согласно Пользовательскому соглашению <u>«Внутриигровая валюта» – виртуальная внутриигровая валюта</u>, являющаяся неактивированными данными и командами, которая не имеет денежной стоимости и не подлежит денежной оценке, хотя и имеет цену на момент приобретения.<br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Согласно п. Политика возврата платежей, Пользовательского соглашения денежные средства за внутриигровые товары не подлежат возврату с момента появления Внутриигровой валюты на счете аккаунта.<br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Согласно п. Политика возврата платежей, Пользовательского соглашения пользователь самостоятельно следит за безопасностью своего аккаунта, сам несет ответственность за все действия, которые выполняются в сервисах с помощью его аккаунта, а также в нем самом.<br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Согласно п. Политика возврата платежей, Пользовательского соглашения пользователь гарантирует, что он имеет право использовать выбранные им платежные средства, не нарушая при этом законодательства РФ и/или законодательства иной страны, гражданином которой является пользователь, и прав третьих лиц.<br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Компания /u>не несет ответственности за возможный ущерб третьим лицам</u>, причиненный в результате использования пользователем не принадлежащих ему средств оплаты.<br><br> ' +
		'[SIZE=4][FONT=Veranda][CENTER]</u>Совершая покупки внутри игры</u>, а также предоставляя платежную информацию, Вы гарантируете, что являетесь законным владельцем платёжного средства и аккаунта, связанного с данным платежом.<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Все действия с картой считаются совершенными с Вашего ведома и согласия, то есть лично владельцем карты.<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Кроме того, в соответствии законодательством РФ родители несут имущественную ответственность по сделкам малолетнего, в том числе по сделкам, совершенным им самостоятельно.<br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Таким образом, если Вы являетесь законными представителем, Вы отвечаете за действия ребёнка внутри игры. Компания не может отслеживать действия несовершеннолетнего и нести за них ответственность.<br><br>' +
		'[SIZE=4][FONT=Veranda][CENTER]Таким образом основания для возврата денежных средств отсутствуют.<br>' +
		'[CENTER][I]Решено[/I].[/CENTER][/FONT][/SIZE]',
	  prefix: DECIDED_PREFIX,
	  status: false,
	},
	{
		title: 'Слетел аккаунт',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Аккаунт не может пропасть или аннулироваться просто так. Даже если Вы меняете ник, используете кнопки «починить игру» или «сброс настроек» - Ваш аккаунт не удаляется. Система работает иначе.<br><br>" +
		"[CENTER]Проверьте ввод своих данных: пароль, никнейм и сервер. Зачастую игроки просто забывают ввести актуальные данные и считают, что их аккаунт был удален. Будьте внимательны!" +
		'[CENTER]Как ввести никнейм (на случай, если сменили в игре, но не поменяли в клиенте): https://youtu.be/c8rhVwkoFaU [/CENTER] <br><br>' +
		'[CENTER][I]Рассмотрено[/I].[/CENTER][/FONT][/SIZE]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
		title: 'Если нет скринов/видео',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Без доказательств (в частности скриншоты или видео) – решить проблему не получится. Если доказательства найдутся - создайте новую тему, приложив доказательства с фото-хостинга<br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL]<br>(все кликабельно).<br>" +
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Будет исправленно',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Данная недоработка будет проверена и исправлена.<br> Спасибо, ценим Ваш вклад в развите проекта.<br>" +
		'[CENTER][I]Рассмотрено[/I].[/CENTER][/FONT][/SIZE]',
		prefix: WATCHED_PREFIX,
		status: false,
	},
	{
		title: 'Правила восстановления',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Пожалуйста, убедительная просьба, ознакомьтесь с правилами восстановлений - [URL='https://forum.blackrussia.online/index.php?threads/В-каких-случаях-мы-не-восстанавливаем-игровое-имущество.25277/']клик[/URL].<br>Вы создали тему, которая не относится к технической проблеме.[/CENTER]<br><br>" +
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/CENTER][/I].[/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'КРАШ/ВЫЛЕТ',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]В том случае, если Вы вылетели из игры во время игрового процесса (произошел краш), в обязательном порядке необходимо обратиться в данную тему в любом техническом разделе [img]https://i.ibb.co/sPhBGjx/NVIDIA-Share-1-Tde-EHim0u.png[/img][/CENTER]<br>" +
		"[CENTER][CODE]01. Ваш игровой никнейм: <br> 02. Сервер: <br> 03. Тип проблемы: Обрыв соединения | Проблема с ReCAPTCHA | Краш игры (закрытие игры) | Другое [Выбрать один вариант ответа] <br> 04. Действия, которые привели к этому (при вылетах, по возможности предоставлять место сбоя): <br> 05. Как часто данная проблема: <br> 06. Полное название мобильного телефона: <br> 07. Версия Android: <br> 08. Дата и время (по МСК): <br> 09. Связь с Вами по Telegram/VK:[/CODE]<br><br>" +
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/CENTER][/I].[/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Баг ФСИН(не выпустило)',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Скоро будете выпущены,ожидайте.[/CENTER][/FONT][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'ХОЧУ СТАТЬ АДМ/ХЕЛПЕРОМ',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Команда технических специалистов не решает назначение на какую-либо должность, которая присутствует на проекте.<br>Для этого существуют заявления в главном разделе Вашего игрового сервера, где Вы можете ознакомиться с открытыми должностями и формами подач.<br>Приятной игры и желаем удачи в карьерной лестнице!<br><br>" +
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Команде проекта',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Ваша тема закреплена и находится на рассмотрении у команды проекта. Пожалуйста, ожидайте выноса вердикта разработчиков."+
		"[CENTER]Создавать новые темы с данной проблемой — не нужно, ожидайте ответа в данной теме. Если проблема решится - Вы всегда можете оставить своё сообщение в этой теме.<br>",
		prefix: COMMAND_PREFIX,
		status: true,
	},
	{
		title: 'Известно КП',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Команде проекта уже известно о данной проблеме, она обязательно будет рассмотрена и исправлена. Спасибо за Ваше обращение!<br><br>" +
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Улучшения для серверов',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Ваша тема не относится к технической проблеме, если вы хотите предложить изменения в игровом моде - обратитесь в раздел <br> [URL="https://forum.blackrussia.online/index.php?categories/Предложения-по-улучшению.656/"] Предложения по улучшению → нажмите сюда[/URL].<br>[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]' ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Вам нужны все прошивки',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброе время суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER] Для активации какой либо прошивки необходимо поставить все детали данного типа "SPORT" "SPORT+" и т.п.<br>[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	];
	
	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
	
	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрении', 'pin');
	addButton('КП', 'teamProject');
	addButton('Рассмотрено', 'watched');
	addButton('Отказано', 'unaccept');
	addButton('Решено', 'decided');
	addButton('Закрыто', 'closed');
	addButton('Тех. спецу', 'techspec');
	addButton('CLOSE', 'closed_complaint');
	addAnswers();
	
	// Поиск информации о теме
	const threadData = getThreadData();
	
	$(`button#ff`).click(() => pasteContent(8, threadData, true));
	$(`button#prr`).click(() => pasteContent(2, threadData, true));
	$(`button#zhb`).click(() => pasteContent(21, threadData, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
	$('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#closed_complaint').click(() => editThreadData(CLOSE_PREFIX, false, false));
	$('button#techspec').click(() => editThreadData(TECHADM_PREFIX, true));
	
	$(`button#selectAnswer`).click(() => {
	XF.alert(buttonsMarkup(buttons), null, 'ВЫБЕРИТЕ ОТВЕТ');
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
	`<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 25px; margin-right: 5px;">${name}</button>`,
	);
	}
	function addAnswers() {
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 15px; border-radius: 25px;">ОТВЕТЫ</button>`,
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
	
	function editThreadData(prefix, pin = false, may_lens = true) {
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
		if(may_lens === true) {
			if(prefix == UNACCEPT_PREFIX || prefix == WATCHED_PREFIX || prefix == CLOSE_PREFIX || prefix == DECIDED_PREFIX) {
				moveThread(prefix, 230); }
	
			if(prefix == WAIT_PREFIX) {
				moveThread(prefix, 917);
			}
		}
	}
	
	function moveThread(prefix, type) {
	// Перемещение темы
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