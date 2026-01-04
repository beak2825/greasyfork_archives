// ==UserScript==
// @name         [INDIGO] | Курация администрации
// @namespace    https://forum.blackrussia.online
// @version      1.0
// @description  Мой скриптик, надеюсь вам понравиться
// @author       David_Louezze
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license 	 MIT
// @collaborator Quenk269
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/529280/%5BINDIGO%5D%20%7C%20%D0%9A%D1%83%D1%80%D0%B0%D1%86%D0%B8%D1%8F%20%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/529280/%5BINDIGO%5D%20%7C%20%D0%9A%D1%83%D1%80%D0%B0%D1%86%D0%B8%D1%8F%20%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D0%B8.meta.js
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
		"[B][CENTER][COLOR=#FF5555][FONT=courier new] Доброго времени суток,уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] [/CENTER][/COLOR][/B]",
	},
	{
	  title: '| На рассмотрение |',
	  content:
        '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender]Запрошу доказательства у администратора. Ожидайте ответа.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=yellow]На рассмотрении[/FONT][/COLOR][/CENTER][/B]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: '| Не по форме |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender]Ваша жалоба составлена не по форме, пожалуйста ознакомьтесь с правилами подачи жалоб : [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3429349/']*Нажмите сюда*[/URL]<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED]Отказано[/FONT][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: '| Нет /time |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender]В предоставленных доказательствах отсутствует время (/time), не подлежит рассмотрению.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED]Отказано[/FONT][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: '| От 3 лица |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender]Жалоба составлена от 3-го лица, мы не можем ее рассмотреть.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED]Отказано[/FONT][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: '| Нужен фрапс |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender]В данной ситуации обязательно должен быть фрапс (видео фиксация) всех моментов, в противном случае жалоба будет отказана.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED]Закрыто[/FONT][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
        {
	  title: '| Неполный фрапс |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender]Видео запись не полная либо же нет условии сделки, к сожелению мы вынуждены отказать..<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red]Закрыто[/FONT][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Дока-во отредактированы |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] Представленные доказательства были отредактированные или в плохом качестве, пожалуйста прикрепите оригинал.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red]Закрыто[/FONT][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Прошло более 48 часов |',
	  content:
	   '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] С момента выдачи наказания прошло более 48-ми часов, жалоба не подлежит рассмотрению.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED]Закрыто[/FONT][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: '| Нет док-в |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
        "[B][CENTER][COLOR=lavender]В вашей жалобе отсутствуют доказательства для рассмотра.<br>"+
		"[B][CENTER][COLOR=lavender]Пожалуйста,прикрепите доказательства в хорошем качестве на разрешенных платформах. (Yapix/Imgur/Youtube/Disk)<br>"+
        "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED]Отказано[/FONT][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: '| Не рабочие док-ва |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] Предоставленные доказательства не рабочие либо же битая ссылка, пожалуйста загрузите доказательства на фото/видео хостинге.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED]Закрыто[/FONT][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Окно бана |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] Зайдите в игру и сделайте скрин окна с баном после чего, заново напишите жалобу.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED]Закрыто[/FONT][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Дублирование |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] Ответ был дан в прошлой жалобе, за дублирование тем ваш форумный аккаунт может быть заблокирован.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red]Закрыто[/FONT][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Проинструктировать |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] Благодарим за ваше обращение! Администратор будет проинструктирован.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00EE00]Одобрено[/FONT][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Беседа с админом |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] Ваша жалоба была одобрена и будет проведена беседа с администратором.<br>"+
        "[B][CENTER][COLOR=lavender] Приносим свои извинения за данную ситуацию.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00EE00]Одобрено[/FONT][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Строгая беседа с админом |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] Ваша жалоба была одобрена и будет проведена строгая беседа с администратором.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00EE00]Одобрено[/FONT][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Админ будет наказан |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] Ваша жалоба была одобрена и администратор получит наказание.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00EE00]Одобрено[/FONT][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Нет нарушений |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] Исходя из выше приложенных доказательств, нарушения со стороны администратора - не имееться!<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red]Отказано[/FONT][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Наказание верное |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] Проверив доказательства администратора, было принято решение, что наказание выдано верно.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED]Закрыто[/FONT][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
        },
	{
	  title: '| Наказание верное ДМ |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] Проверив доказательства администратора, было принято решение, что наказание выдано верно.<br>"+
        "[B][CENTER][COLOR=lavender] Если у вас есть видеодоказательства об ответном ДМе,то напишите повторную жалобу прикрепив доказательства <br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED]Закрыто[/FONT][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Наказание по ошибке |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] В следствие беседы с администратором, было выяснено, наказание было выдано по ошибке.<br>"+
        "[B][CENTER][COLOR=lavender] Наказание будет снято в течении 24-х часов если еще присутствует.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00EE00]Одобрено[/FONT][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Админ Снят/ПСЖ |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] Администратор был снят/ушел с поста администратора.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00EE00]Рассмотрено[/FONT][/COLOR][/CENTER][/B]',
	  prefix: WATCHED_PREFIX,
	  status: false,
	},
	{
	  title: '| Передано ГА |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] Жалоба передана Главному Администратору - @Ilya Vifer♡, пожалуйста ожидайте ответа..<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red]Передано Главному Администратору[/FONT][/COLOR][/CENTER][/B]',
	  prefix: GA_PREFIX,
	  status: true,
	},
	{
	  title: '| Передано ЗГА  |',
	  content:
		"[B][CENTER][COLOR=#FF5555][FONT=trebuchet ms] Доброго времени суток,уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Жалоба передана Заместителю Главного Администратора - @Danya Borzov | @Kirya Stark, пожалуйста ожидайте ответа  ..<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red]Передано ЗГА  & ОПГ[/FONT][/COLOR][/CENTER][/B]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
	{
	  title: '| Передано Теху |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] Ваша жалоба была передана техническому специалисту сервера, пожалуйста ожидайте ответа..<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=blue]Передано Техническому Специалисту[/FONT][/COLOR][/CENTER][/B]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
	{
	  title: '| Передано Спецу и Заму Спеца |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] Жалоба передана Специальному Администратору, а так же его Заместителю - @Sander_Kligan / @Clarence Crown, пожалуйста ожидайте ответа..<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red]Передано Специальному Администратору[/FONT][/COLOR][/CENTER][/B]',
	  prefix: SPECIAL_PREFIX,
	  status: true,
	},
	{
	  title: '| Соц. сети |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] Доказательства из соц сетей не принимаются, вам нужно загрузить доказательств на видео/фото хостинге.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red]Отказано[/FONT][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: '| В Тех раздел |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] Пожалуйста составьте свою жалобу в Технический раздел сервера : [URL='https://forum.blackrussia.online/index.php?forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-samara.1292/']*Нажмите сюда*[/URL]<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red]Отказано[/FONT][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: '| В ЖБ на теха |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] Вам было выдано наказания Техническим специалистом, вы можете написать жалобу здесь : [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/']*Нажмите сюда*[/URL]<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red]Отказано[/FONT][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: '| В обжалование |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] Если вы согласны с выданным наказанием, то напишите в раздел Обжалование.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red]Отказано[/FONT][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
      },
	{
	  title: '| Соц. сети |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] Доказательства из соц сетей не принимаются, вам нужно загрузить доказательства на видео/фото хостинге.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red]Отказано[/FONT][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
      },
    {
	  title: '| Наказание будет снято |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] Наказание будет снято если еще присутствует.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00EE00]Одобрено[/FONT][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: '| Передано ЗГА Хелперов |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] Жалоба передана Заместителю Главного Администратора по направлению Хелперов - @Mikhail Capone♱︎, пожалуйста ожидайте ответа..<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red]Передано ЗГА Хелперов[/FONT][/COLOR][/CENTER][/B]',
	  prefix: PIN_PREFIX,
	  status: true,
        },
	{
	  title: '| Ссылка на жб |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender]Укажите ссылку на данную жалобу и повторно напишите жалобу.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED]Закрыто[/FONT][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
        },
	{
	  title: '| Ссылка на био |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender]Укажите ссылку на данную биографию и повторно напишите жалобу.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED]Закрыто[/FONT][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
      	},
	{
	  title: '| Биография рассмотрена верно |',
	  content:
	    '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] Биография рассмотрена верно.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED]Закрыто[/FONT][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
       	},
	{
	  title: '| Биография будет пересмотрена |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] Биография будет пересмотрена.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FF00]Одобрено[/FONT][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
        },
	{
	  title: '| Передано Сакаро |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] Жалоба передана Руководителю Модераторов Дискорда - @sakaro, пожалуйста ожидайте ответа..<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#0000EE]Передано Руководителю Модераторов Дискорда[/FONT][/COLOR][/CENTER][/B]',
	  prefix: PIN_PREFIX,
	  status: true,
       	},
	{
	   title: '| Жалоба  рассмотрена верно |',
	  content:
		"[B][CENTER][COLOR=#FF5555][FONT=courier new] Доброго времени суток,уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Жалоба рассмотрена верно.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED]Закрыто[/FONT][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
        	},

	{
	   title: '| Жалоба будет пересмотрена |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] Жалоба будет пересмотрена.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FF00]Одобрено[/FONT][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
      	},
	{
	  title: '| Скрин без доков |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] Прикрепите скриншот с выданным наказанием с /time и повторно напишите жалобу.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED]Закрыто[/FONT][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
      	},
	{
	  title: '| Скрин /notif |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] Прикрепите скриншот /notif с выданным наказанием и повторно напишите жалобу.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED]Закрыто[/FONT][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
        },
	{
	  title: '| Бан по IP |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender]Вы попали под заблокированный ip адрес,попробуйте перезагрузить роутер.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED]Закрыто[/FONT][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
         },
	{
	  title: '| Тайм коды |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] Ваше видео длится больше 3-ех минут - Вы должны указать time коды нарушений.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED]Закрыто[/FONT][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
      },
    {
	  title: '| В жб на АП |',
	  content:
	   '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender]Ваша жалоба была оставлена не в том разделе,напиши жалобу в раздел *Жалобы на Агентов Поддержки* : [URL='https://forum.blackrussia.online/index.php?threads/indigo-%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B3%D0%B5%D0%BD%D1%82%D0%BE%D0%B2-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.4965677/']*Нажмите сюда*[/URL]<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED]Отказано[/FONT][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
      },
	{
	  title: '| Доки на возврат имущества |',
	  content:
	    '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] Приложите доказательства, ваших договоренностей на возврат имущества.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED]Закрыто[/FONT][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
        },
	{
	  title: '| Жб обман стороной |',
	  content:
	    '[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] Жалоба должна быть написана обманутой стороной.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED]Закрыто[/FONT][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
      },
	{
	  title: '| Перенос в нужный раздел |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender]Переношу вашу жалобу в нужный раздел.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED]Закрыто[/FONT][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
      },
	{
	  title: '| Скрин /myreports |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] Прикрепите скриншот /myreports и повторно напишите жалобу.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED]Закрыто[/FONT][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
       },
	{
	  title: '| Не помог с лодкой |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] Вам было необходимо отправиться на причал и взять новую лодку.<br>"+
        "[B][CENTER][COLOR=lavender] Нарушения со стороны администратора не имеется.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED]Закрыто[/FONT][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
      },
	{
	  title: '| Не помог с тс |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] Вы могли воспользоваться общественным транспортом, такси или попутными машинами для того, чтобы добраться до нужного Вам пункта назначения.<br>"+
		"[B][CENTER][COLOR=lavender] Нарушения со стороны администратора не имеется.<br>"+
        "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED]Закрыто[/FONT][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '----> Раздел Обжалование <-----',
	},
    {
	  title: '| Не по форме |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender]Ваше обжалование составлено не по форме, пожалуйста ознакомьтесь с правилами подачи обжалований : [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.2639626/']*Нажмите сюда*[/URL]<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED]Отказано[/FONT][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: '| Обжалованию не подлежит |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender]Данное нарушения не подлежит обжалованию, администрация не может снизить вам его.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED]Отказано[/FONT][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: '| Не готовы снизить |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender]Администрация сервера не готова снизить вам наказания, пожалуйста не создавайте дубликаты, создание дубликатов карается баном форумного аккаунта.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED]Отказано[/FONT][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: '| ОБЖ на рассмотрение |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender]Ваше обжалование взято на рассмотрении, пожалуйста не создавайте дубликатов. Ожидайте ответа.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=yellow]На рассмотрении[/FONT][/COLOR][/CENTER][/B]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: '| Уже есть мин. наказания |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender]Вам было выдано минимальное наказание, обжалованию не подлежит.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=RED]Отказано[/FONT][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: '| Обжалование одобрено |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender]Обжалование одобрено, ваше наказание будет снято/снижено в течение 24-ех часов..<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=#00FA9A]Одобрено[/FONT][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Передано ГА обж |',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>'+
		"[B][CENTER][COLOR=lavender] Обжалование передано Главному Администратору - @Vitaliy_Kuk,пожалуйста ожидайте ответа..<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=yellow]На рассмотрении[/FONT][/COLOR][/CENTER][/B]',
	  prefix: GA_PREFIX,
	  status: true,
	
	},
	{
	  title: '| В жб на админов |',
	  content:
		"[B][CENTER][COLOR=#FF5555][FONT=trebuchet ms] Доброго времени суток,уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Если вы не согласны с выданным наказанием, то напишите в раздел Жалобы на Администрацию.<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red]Отказано[/FONT][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
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
	addButton(`КП`, `teamProject`);
    addButton ('Спецу', 'specialAdmin');
    addButton ('ГА', 'mainAdmin');
    addButton('Тех.Спецу', 'techspec');


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
})();// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();