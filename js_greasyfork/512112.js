// ==UserScript==
// @name         Форумный скрипт для руководящей администрации | VLADIMIR
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Скрипт для ГА/ЗГА/Кураторов
// @author       Pavel_Bewerly
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://i.postimg.cc/13kkNtx3/12.jpg
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/512112/%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%BD%D1%8B%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%8F%D1%89%D0%B5%D0%B9%20%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D0%B8%20%7C%20VLADIMIR.user.js
// @updateURL https://update.greasyfork.org/scripts/512112/%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%BD%D1%8B%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%8F%D1%89%D0%B5%D0%B9%20%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D0%B8%20%7C%20VLADIMIR.meta.js
// ==/UserScript==

(function () {
  'use strict';
const PROJECT_TEAM = 10; // ПРЕФИКС - КОМАНДЕ ПРОЕКТА
const SPEC_ADMIN = 11; // ПРЕФИКС - СПЕЦ.АДМИНИСТРАТОРУ
const GL_ADMIN = 12; // ПРЕФИКС - ГЛАВНОМУ АДМИНИСТРАТОРУ
const TECH_SPEC = 13; // ПРЕФИКС - ТЕХ.СПЕЦИАЛИСТУ
const REWIED_PREFIX = 2; // ПРЕФИКС - НА РАССМОТРЕНИЕ
const APPROVED_PREFIX = 8; // ПРЕФИКС - ОДОБРЕНО
const CLOSE_PREFIX = 7; // ПРЕФИКС - ЗАКРЫТО
const REFUSED_PREFIX = 4; // ПРЕФИКС - ОТКАЗАНО
const REVIEWED_PREFIX = 9; // ПРЕФИКС - РАССМОТРЕНО
const DECIDED_PREFIX = 6; // ПРЕФИКС - РЕШЕНО
const OSH_PREFIX = 14; // ПРЕФИКС - ОЖИДАНИЕ
const CLAIM_FORMADM = 'https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-администрацию.3429349/'; // ФОРМА ПОДАЧИ - ЖАЛОБЫ НА АДМИНОВ
const CLAIM_FORMLEAD = 'https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-лидеров.3429391/'; // ФОРМА ПОДАЧИ - ЖАЛОБЫ НА ЛИДЕРОВ
const CLAIM_FORMPL = 'https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-игроков.3429394/'; // ФОРМА ПОДАЧИ - ЖАЛОБЫ НА ИГРОКОВ
const CLAIM_FORMOBSH = 'https://forum.blackrussia.online/threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/'; // ФОРМА ПОДАЧИ - ОБЖАЛОВАНИЕ НАКАЗАНИЙ
const CLAIM_TECH78 = 'https://forum.blackrussia.online/forums/Сервер-№78-vladimir.3463/'; // ЖАЛОБЫ НА ТЕХ.СПЕЦИАЛИСТОВ - 78 СЕРВЕР
const TECH_RAZDEL78 = 'https://forum.blackrussia.online/forums/Технический-раздел-vladimir.3464/'; // ТЕХНИЧЕСКИЙ РАЗДЕЛ - 78 СЕРВЕР

const bAdmins = [
	{
		title: 'На рассмотрение',
		content:
			"[CENTER][SIZE=4][FONT=courier new]{{ greeting }}, уважаемый {{ user.name }} [/FONT][/SIZE][/CENTER]<br><br>"+
			"[CENTER][FONT=courier new]Ваша жалоба взята на рассмотрение, пожалуйста ожидайте ответа и не нужно создавать повторные темы.[/FONT][/CENTER]<br><br>"+
			"[CENTER][SIZE=4][FONT=courier new][COLOR=yellow]На рассмотрение[/COLOR][/FONT][/CENTER]<br><br>"+
			"[CENTER][SIZE=4][FONT=courier new]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=red]RUSSIA[/COLOR] [COLOR=rgb(255, 198, 180)]VLADIMIR[/COLOR][/FONT][/CENTER]",
		prefix: REWIED_PREFIX,
		status: false,
		dpstyle: 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 200, 0, 0.5);',
	},
	{
		title: 'Ошиблись сервером',
		content:
			"[CENTER][SIZE=4][FONT=courier new]{{ greeting }}, уважаемый {{ user.name }} [/FONT][/SIZE][/CENTER]<br><br>"+
			"[CENTER][FONT=courier new]Вы ошиблись сервером, перенаправляю вашу жалобу на нужный сервер.[/FONT][/CENTER]<br>"+
			"[QUOTE][FONT=courier new]Тема была закрыта от оффтопа и находится на рассмотрение администрации вашего сервера[/FONT][/QUOTE]<br><br>"+
			"[CENTER][SIZE=4][FONT=courier new][COLOR=yellow]На рассмотрение...[/COLOR][/FONT][/CENTER]<br>"+
			"[CENTER][SIZE=4][FONT=courier new]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=red]RUSSIA[/COLOR] [COLOR=rgb(255, 198, 180)]VLADIMIR[/COLOR][/FONT][/CENTER]",
		prefix: APPROVED_PREFIX,
		status: false,
		dpstyle: 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5);',
	},
	{
		title: ' >╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ ПЕРЕДАЧА ЖАЛОБ ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴<',
		dpstyle: 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(22, 133, 0, 0.5);'
		
	},
	{
		title: 'КОМАНДЕ ПРОЕКТА',
		content:
			"[CENTER][SIZE=4][FONT=courier new]{{ greeting }}, уважаемый {{ user.name }} [/FONT][/SIZE][/CENTER]<br><br>"+
			"[CENTER][SIZE=4][FONT=courier new]Ваша жалоба передана [COLOR=yellow]Команде проекта[/COLOR][/FONT][/CENTER]<br><br>"+
			"[CENTER][SIZE=4][FONT=courier new]Ожидайте ответа и не создавайте дубликаты темы, на рассмотрении...[/FONT][/CENTER]<br><br>"+
			"[CENTER][SIZE=4][FONT=courier new]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=red]RUSSIA[/COLOR] [COLOR=rgb(255, 198, 180)]VLADIMIR[/COLOR][/FONT][/CENTER]",
		prefix: PROJECT_TEAM,
		status: false,
		dpstyle: 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 200, 152, 0.5);',
	},
	{
		title: 'СПЕЦ.АДМИНУ',
		content:
			"[CENTER][SIZE=4][FONT=courier new]{{ greeting }}, уважаемый {{ user.name }} [/FONT][/SIZE][/CENTER]<br><br>"+
			"[SIZE=4][FONT=courier new]Ваша жалоба передана [COLOR=red]Специальному администратору[/COLOR][/FONT]<br><br>"+
			"[SIZE=4][FONT=courier new]Ожидайте ответа и не создавайте дубликаты темы, на рассмотрении...[/FONT]<br><br>"+
			"[CENTER][SIZE=4][FONT=courier new]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=red]RUSSIA[/COLOR] [COLOR=rgb(255, 198, 180)]VLADIMIR[/COLOR][/FONT][/CENTER]",
		prefix: SPEC_ADMIN,
		status: false,
		dpstyle: 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5);',
	},
	{
		title: 'ГЛ.АДМИНУ',
		content:
			"[CENTER][SIZE=4][FONT=courier new]{{ greeting }}, уважаемый {{ user.name }} [/FONT][/SIZE][/CENTER]<br><br>"+
			"[SIZE=4][FONT=courier new]Ваша жалоба передана [COLOR=red]Главному администратору[/COLOR][/FONT]<br><br>"+
			"[SIZE=4][FONT=courier new]Ожидайте ответа и не создавайте дубликаты темы, на рассмотрении...[/FONT]<br><br>"+
			"[CENTER][SIZE=4][FONT=courier new]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=red]RUSSIA[/COLOR] [COLOR=rgb(255, 198, 180)]VLADIMIR[/COLOR][/FONT][/CENTER]",
		prefix: GL_ADMIN,
		status: false,
		dpstyle: 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5);',
	},
	{
		title: 'ТЕХ.СПЕЦИАЛИСТУ',
		content:
			"[CENTER][SIZE=4][FONT=courier new]{{ greeting }}, уважаемый {{ user.name }} [/FONT][/SIZE][/CENTER]<br><br>"+
			"[SIZE=4][FONT=courier new]Ваша жалоба передана [COLOR=rgb(3, 156, 255)]Техническому специалисту[/COLOR][/FONT]<br><br>"+
			"[SIZE=4][FONT=courier new]Ожидайте ответа и не создавайте дубликаты темы, на рассмотрении...[/FONT]<br><br>"+
			"[CENTER][SIZE=4][FONT=courier new]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=red]RUSSIA[/COLOR] [COLOR=rgb(255, 198, 180)]VLADIMIR[/COLOR][/FONT][/CENTER]",
		prefix: TECH_SPEC,
		status: false,
		dpstyle: 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(0, 13, 133, 0.5);',
	},
	{
		title: ' >╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ ОДОБРЕНО ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴<',
		dpstyle: 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(22, 133, 0, 0.5);',
	},
	{
		title: 'Беседа с администратором',
		content:
			"[CENTER][SIZE=4][FONT=courier new]{{ greeting }}, уважаемый {{ user.name }} [/FONT][/SIZE][/CENTER]<br><br>"+
			"[CENTER][FONT=courier new]Ваша жалоба была одобрена и будет проведена беседа с администратором.[/FONT][/CENTER]<br>"+
			"[CENTER][SIZE=4][FONT=courier new][COLOR=lime]Одобрено[/COLOR][/FONT][/CENTER]<br><br>"+
			"[CENTER][SIZE=4][FONT=courier new]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=red]RUSSIA[/COLOR] [COLOR=rgb(255, 198, 180)]VLADIMIR[/COLOR][/FONT][/CENTER]",
		prefix: APPROVED_PREFIX,
		status: false,
		dpstyle: 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(22, 133, 0, 0.5);',
	},
	{
		title: 'Наказание адм',
		content:
			"[CENTER][SIZE=4][FONT=courier new]{{ greeting }}, уважаемый {{ user.name }} [/FONT][/SIZE][/CENTER]<br><br>"+
			"[CENTER][FONT=courier new]Над администратором будут приняты необходимые меры.[/FONT][/CENTER]<br>"+
			"[CENTER][FONT=courier new]Приносим извинения за предоставленные неудобства![/FONT][/CENTER]<br>"+
			"[CENTER][SIZE=4][FONT=courier new][COLOR=lime]Одобрено[/COLOR][/FONT][/CENTER]<br><br>"+
			"[CENTER][SIZE=4][FONT=courier new]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=red]RUSSIA[/COLOR] [COLOR=rgb(255, 198, 180)]VLADIMIR[/COLOR][/FONT][/CENTER]",
		prefix: APPROVED_PREFIX,
		status: false,
		dpstyle: 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(22, 133, 0, 0.5);',
	},
	{
		title: 'Администратор ошибся',
		content:
			"[CENTER][SIZE=4][FONT=courier new]{{ greeting }}, уважаемый {{ user.name }} [/FONT][/SIZE][/CENTER]<br><br>"+
			"[CENTER][FONT=courier new]В следствие беседы с администратором, было выяснено, что наказание было выдано по ошибке.[/FONT][/CENTER]<br>"+
			"[CENTER][FONT=courier new]Ваше наказание будет полностью снято.[/FONT][/CENTER]<br>"+
			"[CENTER][SIZE=4][FONT=courier new][COLOR=lime]Одобрено[/COLOR][/FONT][/CENTER]<br><br>"+
			"[CENTER][SIZE=4][FONT=courier new]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=red]RUSSIA[/COLOR] [COLOR=rgb(255, 198, 180)]VLADIMIR[/COLOR][/FONT][/CENTER]",
		prefix: APPROVED_PREFIX,
		status: false,
		dpstyle: 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(22, 133, 0, 0.5);',
	},
	{
		title: ' >╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ ОТКАЗАНО ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴<',
		dpstyle: 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);',
		
	},
	{
		title: 'Нет time',
		content:
			"[CENTER][SIZE=4][FONT=courier new]{{ greeting }}, уважаемый {{ user.name }} [/FONT][/SIZE][/CENTER]<br><br>"+
			"[CENTER][FONT=courier new]На ваших доказательствах отсутствует /time.[/FONT][/CENTER]<br>"+
			"[FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию - [URL={{ CLAIM_FORMADM }}]тут[/URL].[/FONT]<br><br>"+
			"[CENTER][SIZE=4][FONT=courier new][COLOR=red]Отказано[/COLOR][/FONT][/CENTER]<br><br>"+
			"[CENTER][SIZE=4][FONT=courier new]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=red]RUSSIA[/COLOR] [COLOR=rgb(255, 198, 180)]VLADIMIR[/COLOR][/FONT][/CENTER]",
		prefix: REFUSED_PREFIX,
		status: false,
		dpstyle: 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5);',
	},
	{
		title: 'Не по теме',
		content:
			"[CENTER][SIZE=4][FONT=courier new]{{ greeting }}, уважаемый {{ user.name }} [/FONT][/SIZE][/CENTER]<br><br>"+
			"[CENTER][FONT=courier new]Ваше сообщение никоим образом не относится к предназначению данного раздела.[/FONT][/CENTER]<br>"+
			"[CENTER][SIZE=4][FONT=courier new][COLOR=red]Закрыто[/COLOR][/FONT][/CENTER]<br><br>"+
			"[CENTER][SIZE=4][FONT=courier new]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=red]RUSSIA[/COLOR] [COLOR=rgb(255, 198, 180)]VLADIMIR[/COLOR][/FONT][/CENTER]",
		prefix: CLOSE_PREFIX,
		status: false,
		dpstyle: 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5);',
	},
	{
		title: 'Дубликат жалобы',
		content:
			"[CENTER][SIZE=4][FONT=courier new]{{ greeting }}, уважаемый {{ user.name }} [/FONT][/SIZE][/CENTER]<br><br>"+
			"[CENTER][FONT=courier new]Вам уже ранее был дан корректный ответ, за создание дубликатов этой темы ваш форумный аккаунт может быть заблокирован.[/FONT][/CENTER]<br>"+
			"[CENTER][SIZE=4][FONT=courier new][COLOR=red]Отказано[/COLOR][/FONT][/CENTER]<br><br>"+
			"[CENTER][SIZE=4][FONT=courier new]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=red]RUSSIA[/COLOR] [COLOR=rgb(255, 198, 180)]VLADIMIR[/COLOR][/FONT][/CENTER]",
		prefix: REFUSED_PREFIX,
		status: false,
		dpstyle: 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5);',
	},
	{
		title: 'Жалобу на тех.спец',
		content:
			"[CENTER][SIZE=4][FONT=courier new]{{ greeting }}, уважаемый {{ user.name }} [/FONT][/SIZE][/CENTER]<br><br>"+
			"[CENTER][FONT=courier new]Обратитесь в раздел жалоб на Технических специалистов  - [URL={{ CLAIM_TECH78 }}]тут[/URL].[/FONT][/CENTER]<br>"+
			"[FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию - [URL={{ CLAIM_FORMADM }}]тут[/URL].[/FONT]<br><br>"+
			"[CENTER][SIZE=4][FONT=courier new][COLOR=red]Отказано[/COLOR][/FONT][/CENTER]<br><br>"+
			"[CENTER][SIZE=4][FONT=courier new]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=red]RUSSIA[/COLOR] [COLOR=rgb(255, 198, 180)]VLADIMIR[/COLOR][/FONT][/CENTER]",
		prefix: REFUSED_PREFIX,
		status: false,
		dpstyle: 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5);',
	},
	{
		title: 'Недостаточно док-в',
		content:
			"[CENTER][SIZE=4][FONT=courier new]{{ greeting }}, уважаемый {{ user.name }} [/FONT][/SIZE][/CENTER]<br><br>"+
			"[CENTER][FONT=courier new]Проверив вашу жалобу, то было обнаружено, что у вас недостаточно доказательств, на нарушение администратора.[/FONT][/CENTER]<br>"+
			"[FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию - [URL={{ CLAIM_FORMADM }}]тут[/URL].[/FONT]<br><br>"+
			"[CENTER][SIZE=4][FONT=courier new][COLOR=red]Отказано[/COLOR][/FONT][/CENTER]<br><br>"+
			"[CENTER][SIZE=4][FONT=courier new]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=red]RUSSIA[/COLOR] [COLOR=rgb(255, 198, 180)]VLADIMIR[/COLOR][/FONT][/CENTER]",
		prefix: REFUSED_PREFIX,
		status: false,
		dpstyle: 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5);',
	},
	{
		title: 'Док-ва отредактирована',
		content:
			"[CENTER][SIZE=4][FONT=courier new]{{ greeting }}, уважаемый {{ user.name }} [/FONT][/SIZE][/CENTER]<br><br>"+
			"[CENTER][FONT=courier new]Ваши доказательства были подвергнуты изменениям (редактированию), прикрепите оригинальные файлы.[/FONT][/CENTER]<br>"+
			"[FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию - [URL={{ CLAIM_FORMADM }}]тут[/URL].[/FONT]<br><br>"+
			"[CENTER][SIZE=4][FONT=courier new][COLOR=red]Отказано[/COLOR][/FONT][/CENTER]<br><br>"+
			"[CENTER][SIZE=4][FONT=courier new]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=red]RUSSIA[/COLOR] [COLOR=rgb(255, 198, 180)]VLADIMIR[/COLOR][/FONT][/CENTER]",
		prefix: REFUSED_PREFIX,
		status: false,
		dpstyle: 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5);',
	},
	{
		title: 'Нужен фрапс',
		content:
			"[CENTER][SIZE=4][FONT=courier new]{{ greeting }}, уважаемый {{ user.name }} [/FONT][/SIZE][/CENTER]<br><br>"+
			"[CENTER][FONT=courier new]Недостаточно доказательств для корректного рассмотрения жалобы. В данном случае требуются видео - доказательства..[/FONT][/CENTER]<br>"+
			"[FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию - [URL={{ CLAIM_FORMADM }}]тут[/URL].[/FONT]<br><br>"+
			"[CENTER][SIZE=4][FONT=courier new][COLOR=red]Отказано[/COLOR][/FONT][/CENTER]<br><br>"+
			"[CENTER][SIZE=4][FONT=courier new]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=red]RUSSIA[/COLOR] [COLOR=rgb(255, 198, 180)]VLADIMIR[/COLOR][/FONT][/CENTER]",
		prefix: REFUSED_PREFIX,
		status: false,
		dpstyle: 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5);',
	},
	{
		title: 'Нет док-в',
		content:
			"[CENTER][SIZE=4][FONT=courier new]{{ greeting }}, уважаемый {{ user.name }} [/FONT][/SIZE][/CENTER]<br><br>"+
			"[CENTER][FONT=courier new]Проверив вашу жалобу, то было обнаружено, что у вас нет доказательств, на нарушение администратора.[/FONT][/CENTER]<br>"+
			"[FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию - [URL={{ CLAIM_FORMADM }}]тут[/URL].[/FONT]<br><br>"+
			"[CENTER][SIZE=4][FONT=courier new][COLOR=red]Отказано[/COLOR][/FONT][/CENTER]<br><br>"+
			"[CENTER][SIZE=4][FONT=courier new]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=red]RUSSIA[/COLOR] [COLOR=rgb(255, 198, 180)]VLADIMIR[/COLOR][/FONT][/CENTER]",
		prefix: REFUSED_PREFIX,
		status: false,
		dpstyle: 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5);',
	},
	{
		title: 'В обжалование',
		content:
			"[CENTER][SIZE=4][FONT=courier new]{{ greeting }}, уважаемый {{ user.name }} [/FONT][/SIZE][/CENTER]<br><br>"+
			"[CENTER][FONT=courier new]Обратитесь в раздел обжалований наказаний.[/FONT][/CENTER]<br><br>"+
			"[CENTER][SIZE=4][FONT=courier new][COLOR=red]Закрыто.[/COLOR][/FONT][/CENTER]<br>"+
			"[CENTER][SIZE=4][FONT=courier new]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=red]RUSSIA[/COLOR] [COLOR=rgb(255, 198, 180)]VLADIMIR[/COLOR][/FONT][/CENTER]",
		prefix: CLOSE_PREFIX,
		status: false,
		dpstyle: 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5);',
	},
	{
		title: 'Прошло >48 часов',
		content:
			"[CENTER][SIZE=4][FONT=courier new]{{ greeting }}, уважаемый {{ user.name }} [/FONT][/SIZE][/CENTER]<br><br>"+
			"[CENTER][FONT=courier new]Срок написания жалобы - 48 часов с момента выдачи наказания.[/FONT][/CENTER]<br>"+
			"[FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию - [URL={{ CLAIM_FORMADM }}]тут[/URL].[/FONT]<br><br>"+
			"[CENTER][SIZE=4][FONT=courier new][COLOR=red]Отказано[/COLOR][/FONT][/CENTER]<br><br>"+
			"[CENTER][SIZE=4][FONT=courier new]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=red]RUSSIA[/COLOR] [COLOR=rgb(255, 198, 180)]VLADIMIR[/COLOR][/FONT][/CENTER]",
		prefix: APPROVED_PREFIX,
		status: false,
		dpstyle: 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5);',
	},
	{
		title: 'Не по форме',
		content:
			"[CENTER][SIZE=4][FONT=courier new]{{ greeting }}, уважаемый {{ user.name }} [/FONT][/SIZE][/CENTER]<br><br>"+
			"[CENTER][FONT=courier new]Ваша жалоба составлена не по форме, или же не соответствует правилам подачи.[/FONT][/CENTER]<br>"+
			"[FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию - [URL={{ CLAIM_FORMADM }}]тут[/URL].[/FONT]<br><br>"+
			"[CENTER][SIZE=4][FONT=courier new][COLOR=red]Отказано[/COLOR][/FONT][/CENTER]<br><br>"+
			"[CENTER][SIZE=4][FONT=courier new]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=red]RUSSIA[/COLOR] [COLOR=rgb(255, 198, 180)]VLADIMIR[/COLOR][/FONT][/CENTER]",
		prefix: REFUSED_PREFIX,
		status: false,
		dpstyle: 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5);',
	},
	{
		title: 'Док-ва не там',
		content:
			"[CENTER][SIZE=4][FONT=courier new]{{ greeting }}, уважаемый {{ user.name }} [/FONT][/SIZE][/CENTER]<br><br>"+
			"[CENTER][FONT=courier new]ДДоказательства в социальных сетях (VK,Instagram,FaceBook) не принимаются, загрузите доказательства на фохостинг (Imgur,Yapix,Youtube).[/FONT][/CENTER]<br>"+
			"[FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию - [URL={{ CLAIM_FORMADM }}]тут[/URL].[/FONT]<br><br>"+
			"[CENTER][SIZE=4][FONT=courier new][COLOR=red]Отказано[/COLOR][/FONT][/CENTER]<br><br>"+
			"[CENTER][SIZE=4][FONT=courier new]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=red]RUSSIA[/COLOR] [COLOR=rgb(255, 198, 180)]VLADIMIR[/COLOR][/FONT][/CENTER]",
		prefix: REFUSED_PREFIX,
		status: false,
		dpstyle: 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5);',
	},
	{
		title: 'Администратор прав',
		content:
			"[CENTER][SIZE=4][FONT=courier new]{{ greeting }}, уважаемый {{ user.name }} [/FONT][/SIZE][/CENTER]<br><br>"+
			"[CENTER][FONT=courier new]Проверив доказательства администратора, было принято решение, что наказание было выдано верно.[/FONT][/CENTER]<br>"+
			"[FONT=courier new]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию - [URL={{ CLAIM_FORMADM }}]тут[/URL].[/FONT]<br><br>"+
			"[CENTER][SIZE=4][FONT=courier new][COLOR=red]Отказано[/COLOR][/FONT][/CENTER]<br><br>"+
			"[CENTER][SIZE=4][FONT=courier new]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=red]RUSSIA[/COLOR] [COLOR=rgb(255, 198, 180)]VLADIMIR[/COLOR][/FONT][/CENTER]",
		prefix: REFUSED_PREFIX,
		status: false,
		dpstyle: 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5);',
	}
];

const bBio = [
	{
		title: 'РАЗРАБОТКА СКРИПТА (ОБЖАЛОВАНИЕ НАКАЗАНИЙ)',
		dpstyle: 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);'
	}
];

const bSituat = [
	{
		title: 'Команде проекта',
		content: '',
		dpstyle: 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 230, 0, 0.5);',
		prefix: PROJECT_TEAM,
		status: false
	},
	{
		title: 'Спец. администратору',
		content: '',
		dpstyle: 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5);',
		prefix: SPEC_ADMIN,
		status: false
	},
	{
		title: 'Главному администратору',
		content: '',
		dpstyle: 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5);',
		prefix: GL_ADMIN,
		status: false
	},
	{
		title: 'Тех. специалисту',
		content: '',
		dpstyle: 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(0, 0, 255, 0.5);',
		prefix: TECH_SPEC,
		status: false
	},
	{
		title: 'На рассмотрение',
		content: '',
		dpstyle: 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 183, 0, 0.5);',
		prefix: REWIED_PREFIX,
		status: false
	},
	{
		title: 'Отказано',
		content: '',
		dpstyle: 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5);',
		prefix: REFUSED_PREFIX,
		status: false
	},
	{
		title: 'Закрыто',
		content: '',
		dpstyle: 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 0, 0, 0.5);',
		prefix: CLOSE_PREFIX,
		status: false
	},
	{
		title: 'Одобрено',
		content: '',
		dpstyle: 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);',
		prefix: APPROVED_PREFIX,
		status: false
	},
	{
		title: 'Рассмотрено',
		content: '',
		dpstyle: 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);',
		prefix: REVIEWED_PREFIX,
		status: false
	},
	{
		title: 'Решено',
		content: '',
		dpstyle: 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);',
		prefix: DECIDED_PREFIX,
		status: false
	},
	{
		title: 'Ожидание',
		content: '',
		dpstyle: 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(166, 166, 166, 0.5);',
		prefix: OSH_PREFIX,
		status: false
	}
];

const bOrg = [
	{
		title: 'РАЗРАБОТКА СКРИПТА (ЖАЛОБЫ НА ИГРОКОВ)',
		dpstyle: 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);'
	}
];

$(document).ready(() => {
 // Загрузка скрипта для обработки шаблонов
 $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);

 // Добавление кнопок при загрузке страницы
 addButton(`ЖАЛОБЫ НА АДМИНИСТРАЦИЮ`, `selectAdmins`, 'border-radius: 13px; margin-right: 5px; margin-left: 5px; margin-bottom: 5px; border: none; background: #483D8B');
 addButton(`ОБЖАЛОВАНИЯ НАКАЗАНИЙ`, `selectAppeal`, 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);');
 addButton(`ЖАЛОБА НА ИГРОКОВ`, `selectPlayer`, 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);');
 addButton(`ПРЕФИКСЫ`, `selectPrefix`, 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);');
 // Поиск информации о теме
 const threadData = getThreadData();

		$(`button#selectAdmins`).click(() => {
            XF.alert(buttonsClaim(bAdmins), null, 'Выберите ответ для жалобы на администратора:');
            bAdmins.forEach((btn, id) => {
                if(id > 1) {
                    $(`button#answers-${id}`).click(() => pasteContent1(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent1(id, threadData, false));
                }
            });
        });
		$(`button#selectAppeal`).click(() => {
            XF.alert(buttonsBiog(bBio), null, 'Выберите ответ для обжалования');
            bBio.forEach((btn, id) => {
                if(id > 1) {
                    $(`button#answers-${id}`).click(() => pasteContent2(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent2(id, threadData, false));
                }
            });
        });
		$(`button#selectPrefix`).click(() => {
            XF.alert(buttonsSituat(bSituat), null, 'Выберите префикс который необходим:');
            bSituat.forEach((btn, id) => {
                if(id > 1) {
                    $(`button#answers-${id}`).click(() => pasteContent3(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent3(id, threadData, false));
                }
            });
        });
		$(`button#selectPlayer`).click(() => {
            XF.alert(buttonsOrga(bOrg), null, 'Выберите ответ для жалобы на игрока:');
            bOrg.forEach((btn, id) => {
                if(id > 1) {
                    $(`button#answers-${id}`).click(() => pasteContent4(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent4(id, threadData, false));
                }
            });
        });
    });

    function addButton(name, id, style) {
		$('.button--icon--reply').before(
		`<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`,
		);
	}

    function buttonsClaim(bAdmins) {
		return `<div class="select_answer">${bAdmins
		.map(
		(btn, i) =>
		`<button id="answers-${i}" class="button--primary button ` +
		`rippleButton" style="margin:4px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
		)
		.join('')}</div>`;
	}

    function buttonsBiog(bBio) {
		return `<div class="select_answer">${bBio
		.map(
		(btn, i) =>
		`<button id="answers-${i}" class="button--primary button ` +
		`rippleButton" style="margin:4px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
		)
		.join('')}</div>`;
	}

    function buttonsSituat(bSituat) {
		return `<div class="select_answer">${bSituat
		.map(
		(btn, i) =>
		`<button id="answers-${i}" class="button--primary button ` +
		`rippleButton" style="margin:4px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
		)
		.join('')}</div>`;
	}

    function buttonsOrga(bOrg) {
		return `<div class="select_answer">${bOrg
		.map(
		(btn, i) =>
		`<button id="answers-${i}" class="button--primary button ` +
		`rippleButton" style="margin:4px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
		)
		.join('')}</div>`;
	}

	/* ОТПРАВКА КОНТЕНТА */

    function pasteContent1(id, data = {}, send = false) {
        const template = Handlebars.compile(bAdmins[id].content);
        if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

        $('span.fr-placeholder').empty();
        $('div.fr-element.fr-view p').append(template(data));
        $('a.overlay-titleCloser').trigger('click');

        if(send == true){
            editThreadData(bAdmins[id].prefix, bAdmins[id].status);
            $('.button--icon.button--icon--reply.rippleButton').trigger('click');
        }
    }

    function pasteContent2(id, data = {}, send = false) {
        const template = Handlebars.compile(bBio[id].content);
        if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

        $('span.fr-placeholder').empty();
        $('div.fr-element.fr-view p').append(template(data));
        $('a.overlay-titleCloser').trigger('click');

        if(send == true){
            editThreadData(bBio[id].prefix, bBio[id].status);
            $('.button--icon.button--icon--reply.rippleButton').trigger('click');
        }
    }

    function pasteContent3(id, data = {}, send = false) {
        const template = Handlebars.compile(bSituat[id].content);
        if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

        $('span.fr-placeholder').empty();
        $('div.fr-element.fr-view p').append(template(data));
        $('a.overlay-titleCloser').trigger('click');

        if(send == true){
            editThreadData(bSituat[id].prefix, bSituat[id].status);
            $('.button--icon.button--icon--reply.rippleButton').trigger('click');
        }
    }

    function pasteContent4(id, data = {}, send = false) {
        const template = Handlebars.compile(bOrg[id].content);
        if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

        $('span.fr-placeholder').empty();
        $('div.fr-element.fr-view p').append(template(data));
        $('a.overlay-titleCloser').trigger('click');

        if(send == true){
            editThreadData(bOrg[id].prefix, bOrg[id].status);
            $('.button--icon.button--icon--reply.rippleButton').trigger('click');
        }
    }

    function getMessageData() {
  const $username = $('a.username');
  const authorID = $username.attr('data-user-id');
  const authorName = $username.html();
  return {
    user: {
      id: authorID,
      name: authorName,
      mention: `[USER=${authorID}]${authorName}[/USER]`
    }
  };
}
    function getThreadData() {
  const hours = new Date().getHours();
  return {
      greeting: 4 < hours && hours <= 11
      ? 'Доброе утро'
      : 11 < hours && hours <= 15
      ? 'Добрый день'
      : 15 < hours && hours <= 21
      ? 'Добрый вечер'
      : 'Доброй ночи'
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