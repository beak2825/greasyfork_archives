// ==UserScript==
// @name         [ANAPA] | Главный следящий | Заместитель главного следящего
// @namespace    https://forum.blackrussia.online
// @version      1.4
// @description  Для ГС/ЗГС
// @author       Vertigo
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license 	 MIT
// @collaborator Quenk269
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/499781/%5BANAPA%5D%20%7C%20%D0%93%D0%BB%D0%B0%D0%B2%D0%BD%D1%8B%D0%B9%20%D1%81%D0%BB%D0%B5%D0%B4%D1%8F%D1%89%D0%B8%D0%B9%20%7C%20%D0%97%D0%B0%D0%BC%D0%B5%D1%81%D1%82%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%20%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D0%BE%D0%B3%D0%BE%20%D1%81%D0%BB%D0%B5%D0%B4%D1%8F%D1%89%D0%B5%D0%B3%D0%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/499781/%5BANAPA%5D%20%7C%20%D0%93%D0%BB%D0%B0%D0%B2%D0%BD%D1%8B%D0%B9%20%D1%81%D0%BB%D0%B5%D0%B4%D1%8F%D1%89%D0%B8%D0%B9%20%7C%20%D0%97%D0%B0%D0%BC%D0%B5%D1%81%D1%82%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%20%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D0%BE%D0%B3%D0%BE%20%D1%81%D0%BB%D0%B5%D0%B4%D1%8F%D1%89%D0%B5%D0%B3%D0%BE.meta.js
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
const SPECIAL_PREFIX = 11;
const TECH_PREFIX = 13;
const buttons = [
    {
	  title: '----> Раздел Жалоб <-----',
	},
    {
	  title: '| Приветствие |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] [/CENTER][/COLOR][/B]",
	},	
	{
	  title: '| На рассмотрение |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба взята на рассмотрение, пожалуйста не создавайте дубликатов. Ожидайте ответа.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрение[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: '| Не по форме |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша жалоба составлена не по форме, пожалуйста ознакомьтесь с правилами подачи жалоб : [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-лидеров.3429391/']*Нажмите сюда*[/URL]<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: '| Нет /time |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В предоставленных доказательствах отсутствует время (/time), не подлежит рассмотрению.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},	
	{
	  title: '| От 3 лица |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Жалоба составлена от 3-го лица, следовательно не подлежит рассмотрению.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: '| Нужен фрапс |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В данной ситуации обязательно должен быть фрапс (видео фиксация) всех моментов, в противном случае жалоба будет отказана.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
        {
	  title: '| Неполный фрапс |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Видео запись не полная либо же нет условии сделки, к сожалению мы вынуждены отказать.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: '| Док-во отредактировано |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Представленные доказательства были отредактированные или в плохом качестве, пожалуйста прикрепите оригинал.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: '| Прошло более 48 часов |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Прошло более 48-ми часов, жалоба не подлежит рассмотрению.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },	
    {
	  title: '| Нет док-в |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В вашей жалобе отсутствуют доказательства для её рассмотрения. Пожалуйста прикрепите доказательства в хорошем качестве на разрешенных платформах. (Yapix/Imgur/Youtube/Disk)<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: '| Не рабочие док-ва |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Предоставленные доказательства не рабочие либо же битая ссылка, пожалуйста загрузите доказательства на фото/видео хостинге.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: '| Дублирование |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Напоминаю, за дублирование жалоб, ваш форумный аккаунт может быть заблокирован.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Проинструктировать Лидера |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Благодарим за ваше обращение! Лидер будет проинструктирован.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Беседа с лидером |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба была одобрена, следовательно будет проведена беседа с лидером.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},	
	{
	  title: '| Строгая беседа с лидером |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба была одобрена, следовательно будет проведена строгая беседа с лидером.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Лидер будет наказан |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба была одобрена, следовательно лидер получит наказание.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},		
	{
	  title: '| Нет нарушений |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Исходя из выше приложенных доказательств, нарушения со стороны лидера - не имеется!<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Наказание верное |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Проверив доказательства лидера, было принято решение, что наказание выдано верно.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},		
	{
	  title: '| Наказание по ошибке |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] В следствие беседы с лидером, было выяснено, наказание было выдано по ошибке.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},	
	{
	  title: '| Лидер Снят/ПСЖ |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Игрок был снят/ушел с поста лидера.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Рассмотрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: WATCHED_PREFIX,
	  status: false,
	},
	{
	  title: '| Передано ЗГА ГОСС & ОПГ |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Жалоба передана Заместителю Главного Администратора по направление ОПГ и ГОСС - @Marcus_Dark, пожалуйста ожидайте ответа.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Передано ЗГА ГОСС / ОПГ[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: GA_PREFIX,
	  status: true,
	},
	{
	  title: '| Соц. сети |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Доказательства из социальных сетей не принимаются, вам нужно загрузить доказательств на видео/фото хостинге.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},	
    {
	  title: '----> Заместитель <-----',
	},
   {
	  title: '| Беседа с заместителем |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба была одобрена, следовательно будет проведена беседа с заместителем.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},	
    {
	  title: '| Проинструктировать Заместителя |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Благодарим за ваше обращение! Заместитель будет проинструктирован.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},	
   {
	  title: '| Строгая беседа с заместителем |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба была одобрена, следовательно будет проведена строгая беседа с заместителем.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: '| Заместитель будет наказан |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба была одобрена, следовательно заместитель получит наказание.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},		
    {
	  title: '| Нет нарушений |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Исходя из выше приложенных доказательств, нарушения со стороны заместителя - не имеется!<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Наказание верное |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Проверив доказательства заместителя, было принято решение, что наказание выдано верно.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},	
   {
	  title: '| Наказание по ошибке |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] В следствие беседы с заместителем, было выяснено, наказание было выдано по ошибке.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},	
	{
	  title: '| Заместитель Снят/ПСЖ |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Игрок был снят/ушел с поста заместителя.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Рассмотрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: WATCHED_PREFIX,
	  status: false,
	}
];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('Меню', 'selectAnswer');
	addButton('Одобрить', 'accepted');
	addButton('Отказать', 'unaccept');
	addButton('На рассмотрение', 'pin');
	addButton('Рассмотрено', 'watched');
	addButton('Закрыть', 'closed');
	

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
	$(`button#techspec`).click(() => editThreadData( TECH_PREFIX , true));
	$(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
	$(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
	$(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true));
	
	$(`button#specialAdmin`).click(() => editThreadData(SPECIAL_PREFIX, true));
	
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));

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