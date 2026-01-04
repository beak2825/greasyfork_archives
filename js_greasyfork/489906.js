// ==UserScript==
// @name         Скрипт для кураторов форума RYAZAN
// @namespace    https://forum.blackrussia.online
// @version      1.0
// @description  Версия для сервера RYAZAN
// @author       Dmitriy Ivlev
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license 	 MIT
// @icon https://i.postimg.cc/dVBdkWkh/free-icon-crown-6786696.png
// @copyright 2024,
// @downloadURL https://update.greasyfork.org/scripts/489906/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20RYAZAN.user.js
// @updateURL https://update.greasyfork.org/scripts/489906/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20RYAZAN.meta.js
// ==/UserScript==

;(function () {
	'use strict'
	const FAIL_PREFIX = 4
	const OKAY_PREFIX = 8
	const WAIT_PREFIX = 2
	const TECH_PREFIX = 13
	const WATCH_PREFIX = 9
	const CLOSE_PREFIX = 7

	const START_DECOR = `<div style="text-align: center"><span style="font-family: 'book antiqua'">`
	const END_DECOR = `</span></div>`

	const buttons = [
		{
			title: 'СВОЙ ОТВЕТ',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`.<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]${END_DECOR}`,
		},
		{
			title: 'Жалобу на рассмотрение',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Ваша жалоба взята на рассмотрение. Не создавайте дубликаты данной темы.<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(250, 197, 28)][B]Ожидайте ответа[/B][/COLOR].${END_DECOR}`,
			prefix: WAIT_PREFIX,
			status: true,
			move: 0,
		},
		{
			title: 'Передать жалобу техническому специалисту',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Ваша жалоба передана на рассмотрение техническому специалисту.<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(250, 197, 28)][B]Ожидайте ответа[/B][/COLOR].${END_DECOR}`,
			prefix: TECH_PREFIX,
			status: true,
			move: 0,
		},
		{
			title: '╴╴╴╴╴╴╴╴╴╴-----╴╴╴╴╴╴╴Отказы ЖБ ╴╴╴╴╴╴╴╴╴╴-----╴╴╴╴╴╴╴',
		},
		{
			title: 'Не по форме',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Ваша жалоба составлена не по форме, ознакомьтесь с правилами подачи жалоб → *[URL="https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/"]Кликабельно[/URL]*<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(235, 107, 86)][B]Отказано, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: FAIL_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Не тот сервер',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Вы ошиблись сервером при подаче заявки, обратитесь в нужный раздел.<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(235, 107, 86)][B]Отказано, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: FAIL_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'В жб на админинов',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Обратитесь в раздел жалоб на администрацию → *[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.86/']Кликабельно[/URL]*<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(235, 107, 86)][B]Отказано, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: FAIL_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'В обжалования',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Обратитесь в раздел обжалований наказаний → *[URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.89/']Кликабельно[/URL]*<br>` +
				`Закрыто.${END_DECOR}`,
			prefix: CLOSE_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'В жб на сотрудников',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Обратитесь в раздел жалоб на сотрудников фракции.<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(235, 107, 86)][B]Отказано, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: FAIL_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Нет тайма',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`В ваших доказательствах отсутствует /time.<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(235, 107, 86)][B]Отказано, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: FAIL_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Укажите тайм коды',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Ваше видеодоказательство длится более 3-х минут, поэтому укажите тайм-коды в течении 24-х часов.<br>В противном случае жалоба будет отказана. <br>[SPOILER=Тайм-коды это]Определённый отрезок времени из видеозаписи, в котором произошли ключевые моменты. <br> Пример: <br> 0:37 - Условия сделки. <br> 0:50 - Сам обмен. <br> 1:50 - Конец обмена. <br>2:03 - Сабвуфера нет. <br>2:06 - /time. [/SPOILER]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]${END_DECOR}`,
			prefix: WAIT_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: '3+ дня',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Вашим доказательствам более трёх дней.<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(235, 107, 86)][B]Отказано, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: FAIL_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Доква в соц сетях',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Загрузка доказательств в соц. сети (ВКонтакте, Instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, Imgur).<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(235, 107, 86)][B]Отказано, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: FAIL_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Нерабочая ссылка',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Ссылка на ваши доказательства не работает (или к доказательствам по ссылке закрыт доступ).<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(235, 107, 86)][B]Отказано, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: FAIL_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Жалоба от 3-го лица',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Ваша жалоба составлена от третьего лица.<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(235, 107, 86)][B]Отказано, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: FAIL_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Ответ был дан в предыдущей теме',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Ответ вам был дан в предыдущей теме.<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(235, 107, 86)][B]Отказано, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: FAIL_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Нет нарушений',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Исходя из Ваших доказательств, нарушений со стороны игрока нет.<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(235, 107, 86)][B]Отказано, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: FAIL_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Нет условий договора',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`В ваших доказательствах отсутствуют условия сделки.<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(235, 107, 86)][B]Отказано, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: FAIL_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Недостаточно доказательств',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`В вашей жалобе не предоставлено достаточного объёма доказательств для выдачи игроку наказания.<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(235, 107, 86)][B]Отказано, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: FAIL_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Нет доказательств',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`В вашей жалобе отсутствуют доказательства.<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(235, 107, 86)][B]Отказано, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: FAIL_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Загрузка доказательств',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Загрузите доказательства на любой фото/видео хостинг, например Imgur, Yapx, Youtube, и оставьте полученную ссылку в новой теме.<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(235, 107, 86)][B]Отказано, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: CLOSE_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Доказательства отредактированы',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Ваши доказательства отредактированы.<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(235, 107, 86)][B]Отказано, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: FAIL_PREFIX,
			status: false,
			move: 0,
		},
        {
			title: 'Неполный фрапс',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Фрапс обрывается. Загрузите полный фрапс на ютуб.<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(235, 107, 86)][B]Отказано, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: FAIL_PREFIX,
			status: false,
			move: 0,
		},
        {
			title: 'Не работают доква',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Не работают доказательства.<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(235, 107, 86)][B]Отказано, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: FAIL_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Док-ва в плохом качестве',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Ваши доказательства в плохом качестве.<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(235, 107, 86)][B]Отказано, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: FAIL_PREFIX,
			status: false,
			move: 0,
		},
         {
			title: 'Нужна промотка чата',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`В таких случаях нужна промотка чата.<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(235, 107, 86)][B]Отказано, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: FAIL_PREFIX,
			status: false,
			move: 0,
		},
         {
			title: 'нужен фрапс',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`В таких случаях нужен фрапс.<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(235, 107, 86)][B]Отказано, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: FAIL_PREFIX,
			status: false,
			move: 0,
		},
         {
			title: 'не написал ник',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Игровой ник автора жалобы, ник игрока, на которого подается жалоба, должны быть указаны в соответствии с правилами подачи жалоб, даже если эта информация присутствует на доказательствах или в тексте жалобы.<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(235, 107, 86)][B]Отказано, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: FAIL_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: '╴╴╴╴╴╴╴╴╴╴-----╴╴╴╴╴╴╴Одобрение ЖБ ╴╴╴╴╴╴╴╴╴╴-----╴╴╴╴╴╴╴',
		},
		{
			title: 'НРП Обман',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | PermBan.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Невозврат долга',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]2.57. Запрещается брать в долг игровые ценности и не возвращать их. | Ban 30 дней / permban.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'ДМ',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | Jail 60 минут.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'ДБ',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | Jail 60 минут.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'ПГ',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]2.17. Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь | Jail 30 минут.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'ТК',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | Jail 60 минут / Warn (за два и более убийства).[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'СК',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | Jail 60 минут / Warn (за два и более убийства).[/QUOTE]` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'МАСС ДМ',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | Warn / Ban 3 - 7 дней.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'МГ',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | Mute 30 минут.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'ОСК РОД',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | Mute 120 минут / Ban 7 - 15 дней.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'nRP Акс',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера | Jail 30 минут.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
        {
			title: 'Помеха работягам',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]2.04. Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. | Ban 10 дней / Обнуление аккаунта (при повторном нарушении)<br>
Пример: таран дальнобойщиков, инкассаторов под разными предлогами.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'нрп коп',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]Запрещено nRP поведение |  Warn[/QUOTE]<br>[SPOILER=Примечание]поведение, не соответствующее сотруднику УМВД/ГИБДД/ФСБ.[/SPOILER][/color] <br> [Color=#00FF00][SPOILER=Пример]- открытие огня по игрокам без причины <br> - расстрел машин без причины <br> - нарушение ПДД без причины <br> - сотрудник на служебном транспорте кричит о наборе в свою семью на спавне[/SPOILER]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Обман адм',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]2.32. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта | Ban 7 - 15 дней.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Оск адм',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]2.54. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | Mute 180 минут.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Оск проекта',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором).[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'ОСК | 3.03',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | Mute 30 минут.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'ОСК | 3.07 (18+)',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]3.07. Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата | Mute 30 минут.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Оск национальности или религии',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]2.35. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | Mute 120 минут / Ban 7 дней.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'КАПС',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | Mute 30 минут.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'ФЛУД',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | Mute 30 минут.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Транслит',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]3.20. Запрещено использование транслита в любом из чатов | Mute 30 минут.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'НРП поведение',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | Jail 30 минут.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Ндрайв',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]2.03. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | Jail 30 минут.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Фдрайв',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]2.47. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) | Jail 60 минут.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'НРП ВЧ',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан за нарушение правил нападения на Воинскую Часть.<br>` +
				`Подробнее с правилами можно ознакомиться по ссылке → [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BD%D0%B0%D0%BF%D0%B0%D0%B4%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B0-%D0%B2%D0%BE%D0%B5%D0%BD%D0%BD%D1%83%D1%8E-%D1%87%D0%B0%D1%81%D1%82%D1%8C.185332/']*Нажмите сюда*.[/URL]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'ООС Угрозы',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]2.37. Запрещены OOC угрозы, в том числе и завуалированные | Mute 120 минут / Ban 7 дней.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Угрозы наказанием от адм',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]3.09. Запрещены любые угрозы о наказании игрока со стороны администрации | Mute 30 минут.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Аморал',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | Jail 30 минут / Warn.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Промокоды',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | Ban 30 дней.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Выдача за адм',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]3.10. Запрещена выдача себя за администратора, если таковым не являетесь | Ban 7 - 15 + ЧС администрации.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Политическая пропаганда',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]3.18. Запрещено политическое и религиозное пропагандирование | Mute 120 минут / Ban 10 дней.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Прогул Р/Д',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]1.13. Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работы в форме фракции | Jail 30 минут.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Объявления в ГОСС',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) | Mute 30 минут.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Реклама',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]2.31. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное | Ban 7 дней / PermBan.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Слив глоб. чата',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]3.08. Запрещены любые формы «слива» посредством использования глобальных чатов | PermBan.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Замена объяв сми',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]4.04. Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком | Ban 7 дней + ЧС организации.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'nRP EDIT',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]4.01. Запрещено редактирование объявлений, не соответствующих ПРО | Mute 30 минут.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Мат в VIP',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]3.23. Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате | Mute 30 минут.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Слив склада',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле | Ban 15 - 30 дней / PermBan.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
            prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Злоуп. командами',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]3.11. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | Ban 15 - 30 дней / PermBan.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Злоуп. знаками',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]2.39. Злоупотребление нарушениями правил сервера | Ban 7 - 30 дней.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Злоуп. нарушениями',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]2.39. Злоупотребление нарушениями правил сервера | Ban 15 - 30 дней / PermBan.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Богоюз или Обход с-мы',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]2.21. Запрещено пытаться обходить игровую систему или использовать любые баги сервера | Ban 15 - 30 дней / PermBan.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Аним | 2.55',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. | Jail 60 / 120 минут.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Сбив темпа',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]2.02. Запрещено сбивать темп стрельбы | Jail 120 минут.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'ПО | 2.22',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | Ban 15 - 30 дней / PermBan.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'ППВ',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]4.03. Запрещена совершенно любая передача игровых аккаунтов третьим лицам | PermBan.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Фейк',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]4.10. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию | Устное замечание + смена игрового никнейма / PermBan.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Уход от РП',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | Jail 30 минут / Warn.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Любой оск в войс',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]3.15. Запрещено оскорблять игроков или родных в Voice Chat | Mute 120 минут / Ban 7 - 15 дней.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Задержание без отыгровок РП',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]6.03. Запрещено оказывать задержание без Role Play отыгровки | Warn.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Розыск или штраф без отыгровок РП',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]6.02. Запрещено выдавать розыск без Role Play причины | Jail 30 минут.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Любое НРП поведение ГОСС сотрудника',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]6.04. Запрещено nRP поведение | Warn.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Забрал В/У во время погони',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель будет наказан по пункту правил:[QUOTE]7.05. Запрещено отбирать водительские права во время погони за нарушителем | Warn.[/QUOTE]<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
		{
			title: 'Будет выдано предупреждение на ФА',
			content:
				`${START_DECOR}Здравствуйте, {{ user.mention }}.<br>[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>` +
				`Нарушитель получит предупреждение на форумный аккаунт.<br>` +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 0,
		},
	]

	const biography = [
		{
			title: 'Приветствие',
			content: `${START_DECOR}Здравствуйте,  {{ user.mention }}.<br>${END_DECOR}`,
		},
		{
			title: 'На доработку',
			content:
				`${START_DECOR}Здравствуйте,  {{ user.mention }}.<br>` +
				'При рассмотрении вашей темы, были выявлены следующие ошибки:<br>' +
				'<br>' +
				`На доработку у вас есть 24 часа.${END_DECOR}`,
		},
		{
			title: 'Биография одобрена',
			content:
				`${START_DECOR}Здравствуйте,  {{ user.mention }}.<br>` +
				'Ваша RolePlay биография проверена и одобрена.<br>' +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(97, 189, 109)][B]Одобрено, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: OKAY_PREFIX,
			status: false,
			move: 61,
		},
		{
			title: '_____________________ДОРАБОТКА_____________________',
		},
		{
			title: '_____________________ДОРАБОТКА_____________________',
		},
		{
			title: 'Заголовок биографии',
			content:
				`${START_DECOR}Здравствуйте,  {{ user.mention }}.<br>` +
				'Название темы должно быть строго по данной форме: «RolePlay биография гражданина {Имя} {Фамилия}».<br>' +
				"Подробнее ознакомиться с правилами составления RolePlay биографий можно тут → *[URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%B4%D0%BB%D1%8F-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.207481/']Кликабельно[/URL]*<br>" +
				`На доработку у вас есть 24 часа.${END_DECOR}`,
			prefix: WAIT_PREFIX,
			status: true,
			open: true,
			move: 62,
		},
		{
			title: 'От третьего лица',
			content:
				`${START_DECOR}Здравствуйте,  {{ user.mention }}.<br>` +
				'Повествование в вашей RolePlay биографии составлено от третьего лица.<br>' +
				"Подробнее ознакомиться с правилами составления RolePlay биографий можно тут → *[URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%B4%D0%BB%D1%8F-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.207481/']Кликабельно[/URL]*<br>" +
				`На доработку у вас есть 24 часа.${END_DECOR}`,
			prefix: WAIT_PREFIX,
			status: true,
			open: true,
			move: 62,
		},
		{
			title: 'Ошибки в тексте',
			content:
				`${START_DECOR}Здравствуйте,  {{ user.mention }}.<br>` +
				'В тексте вашей теме допущены ошибки.<br>' +
				`На доработку у вас есть 24 часа.${END_DECOR}`,
			prefix: WAIT_PREFIX,
			status: true,
			open: true,
			move: 62,
		},
		{
			title: 'Мало расписано | Детство',
			content:
				`${START_DECOR}Здравствуйте,  {{ user.mention }}.<br>` +
				'В пункте «Детство» указано мало информации. Распишите этот пункт подробнее.<br>' +
				`На доработку у вас есть 24 часа.${END_DECOR}`,
			prefix: WAIT_PREFIX,
			status: true,
			open: true,
			move: 62,
		},
		{
			title: 'Мало расписано | Юность и взрослая',
			content:
				`${START_DECOR}Здравствуйте,  {{ user.mention }}.<br>` +
				'В пункте «Юность и взрослая жизнь» указано мало информации. Распишите этот пункт подробнее.<br>' +
				`На доработку у вас есть 24 часа.${END_DECOR}`,
			prefix: WAIT_PREFIX,
			status: true,
			open: true,
			move: 62,
		},
		{
			title: 'Мало расписано | Настоящее время',
			content:
				`${START_DECOR}Здравствуйте,  {{ user.mention }}.<br>` +
				'В пункте «Настоящее время» указано мало информации. Распишите этот пункт подробнее.<br>' +
				`На доработку у вас есть 24 часа.${END_DECOR}`,
			prefix: WAIT_PREFIX,
			status: true,
			open: true,
			move: 62,
		},
		{
			title: 'Мало расписано | Несколько пунктов',
			content:
				`${START_DECOR}Здравствуйте,  {{ user.mention }}.<br>` +
				'В нескольких пунктах описания вашей жизни указано мало информации. Распишите эти пункты подробнее.<br>' +
				`На доработку у вас есть 24 часа.${END_DECOR}`,
			prefix: WAIT_PREFIX,
			status: true,
			open: true,
			move: 62,
		},
		{
			title: 'Дата рождения',
			content:
				`${START_DECOR}Здравствуйте,  {{ user.mention }}.<br>` +
				'Дата рождения персонажа не сходится с его возрастом в текущий момент.<br>' +
				`На доработку у вас есть 24 часа.${END_DECOR}`,
			prefix: WAIT_PREFIX,
			status: true,
			open: true,
			move: 62,
		},
		{
			title: 'Проблемы с возрастом',
			content:
				`${START_DECOR}Здравствуйте,  {{ user.mention }}.<br>` +
				'События, которые вы описали в биографии не могли произойти с человеком указанного вами возраста.<br>' +
				`На доработку у вас есть 24 часа.${END_DECOR}`,
			prefix: WAIT_PREFIX,
			status: true,
			open: true,
			move: 62,
		},
		{
			title: 'Заголовок не соотв. имени',
			content:
				`${START_DECOR}Здравствуйте,  {{ user.mention }}.<br>` +
				'Имя в форме биографии не соответствует заголовку.<br>' +
				`На доработку у вас есть 24 часа.${END_DECOR}`,
			prefix: WAIT_PREFIX,
			status: true,
			open: true,
			move: 62,
		},
		{
			title: '______________________ОТКАЗЫ______________________',
		},
		{
			title: '______________________ОТКАЗЫ______________________',
		},
		{
			title: 'Истёк срок рассмотрения',
			content:
				`${START_DECOR}Здравствуйте,  {{ user.mention }}.<br>` +
				'По истечению 24-х часов полного объёма изменений не последовало.<br>' +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(235, 107, 86)][B]Отказано, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: FAIL_PREFIX,
			status: false,
			move: 63,
		},
		{
			title: 'Сообщение не по теме',
			content:
				`${START_DECOR}Здравствуйте,  {{ user.mention }}.<br>` +
				'Ваше сообщение никаким образом не относится к теме данного раздела.<br>' +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(235, 107, 86)][B]Отказано, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: FAIL_PREFIX,
			status: false,
			move: 63,
		},
		{
			title: 'Ответ ранее',
			content:
				`${START_DECOR}Здравствуйте,  {{ user.mention }}.<br>` +
				'Ответ вам был дан в предыдущей теме.<br>' +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(235, 107, 86)][B]Отказано, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: FAIL_PREFIX,
			status: false,
			move: 63,
		},
		{
			title: 'Форма биографии',
			content:
				`${START_DECOR}Здравствуйте,  {{ user.mention }}.<br>` +
				'Ваша RolePlay биография составлена не по форме. Ниже представлена актуальная форма: Имя Фамилия:<br>Пол:<br>Национальность:<br>Возраст:<br>Дата и место рождения:<br>Семья:<br>Место текущего проживания:<br>Описание внешности:<br>Особенности характера:<br>(Отсюда требуется расписать каждый из пунктов) Детство:<br>Юность и взрослая жизнь:<br>Настоящее время:<br>Хобби:<br>' +
				"Подробнее ознакомиться с правилами составления RolePlay биографий можно тут → *[URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%B4%D0%BB%D1%8F-%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-rp-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.207481/']Кликабельно[/URL]*<br>" +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(235, 107, 86)][B]Отказано, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: FAIL_PREFIX,
			status: false,
			move: 63,
		},
		{
			title: 'Биография скопирована',
			content:
				`${START_DECOR}Здравствуйте,  {{ user.mention }}.<br>` +
				'Ваша RolePlay биография скопирована или слишком схожа с одной из уже существующих.<br>' +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(235, 107, 86)][B]Отказано, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: FAIL_PREFIX,
			status: false,
			move: 63,
		},
		{
			title: 'Слишком много ошибок',
			content:
				`${START_DECOR}Здравствуйте,  {{ user.mention }}.<br>` +
				'В вашей теме допущено слишком много ошибок.<br>' +
				`[IMG width="100%"]https://i.postimg.cc/xCKkf7PJ/vGgCZhi.png[/IMG]<br>[COLOR=rgb(235, 107, 86)][B]Отказано, закрыто[/B][/COLOR].${END_DECOR}`,
			prefix: FAIL_PREFIX,
			status: false,
			move: 63,
		},
	]

	const tasks = [
		{
			title: 'В архив',
			prefix: 0,
			move: 203,
		},
		{
			title: 'В одобренные био',
			prefix: OKAY_PREFIX,
			move: 61,
		},
		{
			title: 'Био на доработку',
			prefix: WAIT_PREFIX,
			move: 62,
		},
		{
			title: 'В отказанные био',
			prefix: FAIL_PREFIX,
			move: 63,
		},
		{
			title: 'В одобренные ситуации',
			prefix: OKAY_PREFIX,
			status: false,
			move: 90,
		},
		{
			title: 'Ситуацию на доработку',
			prefix: WAIT_PREFIX,
			status: false,
			move: 94,
		},
		{
			title: 'В отказанные ситуации',
			prefix: FAIL_PREFIX,
			status: false,
			move: 92,
		},
		{
			title: 'В одобренные организации',
			prefix: OKAY_PREFIX,
			status: false,
			move: 58,
		},
		{
			title: 'Организацию на доработку',
			prefix: WAIT_PREFIX,
			status: false,
			move: 96,
		},
		{
			title: 'В отказанные организации',
			prefix: FAIL_PREFIX,
			status: false,
			move: 97,
		},
	]

	$(document).ready(() => {
		// Загрузка скрипта для обработки шаблонов
		$('body').append(
			'<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>'
		)

		addButton('Одобрено', 'accepted')
		addButton('Отказано', 'unaccept')
		addButton('|', '')
		addButton('Перемещение', 'selectMoveTask')
		addButton('Меню биографий', 'selectBiographyAnswer')
		addButton('Меню жалоб', 'selectComplaintAnswer')
		addButton('|', '')

		// Поиск информации о теме
		const threadData = getThreadData()

		$('button#pin').click(() => editThreadData(0, WAIT_PREFIX, true))
		$('button#tech').click(() => editThreadData(0, TECH_PREFIX, true))
		$('button#accepted').click(() => editThreadData(0, OKAY_PREFIX, false))
		$('button#watch').click(() => editThreadData(0, WATCH_PREFIX, false))
		$('button#close').click(() => editThreadData(0, CLOSE_PREFIX, false))
		$('button#unaccept').click(() => editThreadData(0, FAIL_PREFIX, false))

		$(`button#selectComplaintAnswer`).click(() => {
			XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:')
			buttons.forEach((btn, id) => {
				if (id > 0) {
					$(`button#answers-${id}`).click(() =>
						pasteContent(id, threadData, true)
					)
				} else {
					$(`button#answers-${id}`).click(() =>
						pasteContent(id, threadData, false)
					)
				}
			})
		})
		$(`button#selectBiographyAnswer`).click(() => {
			XF.alert(buttonsMarkup(biography), null, 'Выберите ответ:')
			biography.forEach((btn, id) => {
				if (id > 1) {
					$(`button#answers-${id}`).click(() =>
						pasteContent2(id, threadData, true)
					)
				} else {
					$(`button#answers-${id}`).click(() =>
						pasteContent2(id, threadData, false)
					)
				}
			})
		})
		$(`button#selectMoveTask`).click(() => {
			XF.alert(tasksMarkup(tasks), null, 'Выберите действие:')
			tasks.forEach((btn, id) => {
				$(`button#answers-${id}`).click(() =>
					moveThread(tasks[id].prefix, tasks[id].move)
				)
			})
		})
	})

	function addButton(name, id) {
		$('.button--icon--reply').before(
			`<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`
		)
	}

	function buttonsMarkup(buttons) {
		return `<div class="select_answer">${buttons
			.map(
				(btn, i) =>
					`<button id="answers-${i}" class="button--primary button ` +
					`rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`
			)
			.join('')}</div>`
	}

	function tasksMarkup(buttons) {
		return `<div class="select_answer">${buttons
			.map(
				(btn, i) =>
					`<button id="answers-${i}" class="button--primary button ` +
					`rippleButton" style="margin:6px; width:345px"><span class="button-text">${btn.title}</span></button>`
			)
			.join('')}</div>`
	}

	function pasteContent(id, data = {}, send = false) {
		const template = Handlebars.compile(buttons[id].content)
		if ($('.fr-element.fr-view p').text() === '')
			$('.fr-element.fr-view p').empty()

		$('span.fr-placeholder').empty()
		$('div.fr-element.fr-view p').append(template(data))
		$('a.overlay-titleCloser').trigger('click')

		if (send == true) {
			editThreadData(
				buttons[id].move,
				buttons[id].prefix,
				buttons[id].status,
				buttons[id].open
			)
			$('.button--icon.button--icon--reply.rippleButton').trigger('click')
		}
	}

	function pasteContent2(id, data = {}, send = false) {
		const template = Handlebars.compile(biography[id].content)
		if ($('.fr-element.fr-view p').text() === '')
			$('.fr-element.fr-view p').empty()

		$('span.fr-placeholder').empty()
		$('div.fr-element.fr-view p').append(template(data))
		$('a.overlay-titleCloser').trigger('click')

		if (send == true) {
			editThreadData(
				biography[id].move,
				biography[id].prefix,
				biography[id].status,
				biography[id].open
			)
			$('.button--icon.button--icon--reply.rippleButton').trigger('click')
		}
	}

	function getThreadData() {
		const authorID = $('a.username')[0].attributes['data-user-id'].nodeValue
		const authorName = $('a.username').html()
		const hours = new Date().getHours()
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
		}
	}

	function editThreadData(move, prefix, pin = false, open = false) {
		// Получаем заголовок темы, так как он необходим при запросе
		const threadTitle = $('.p-title-value')[0].lastChild.textContent

		if (pin == false) {
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
			}).then(() => location.reload())
		} else if (pin == true && open) {
			fetch(`${document.URL}edit`, {
				method: 'POST',
				body: getFormData({
					prefix_id: prefix,
					discussion_open: 1,
					title: threadTitle,
					sticky: 1,
					_xfToken: XF.config.csrf,
					_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
					_xfWithData: 1,
					_xfResponseType: 'json',
				}),
			}).then(() => location.reload())
		} else {
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
			}).then(() => location.reload())
		}
		if (move > 0) {
			moveThread(prefix, move)
		}
	}

	function moveThread(prefix, type) {
		// Функция перемещения тем
		const threadTitle = $('.p-title-value')[0].lastChild.textContent

		fetch(`${document.URL}move`, {
			method: 'POST',
			body: getFormData({
				prefix_id: prefix,
				title: threadTitle,
				target_node_id: type,
				redirect_type: 'none',
				notify_watchers: 1,
				starter_alert: 1,
				starter_alert_reason: '',
				_xfToken: XF.config.csrf,
				_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
				_xfWithData: 1,
				_xfResponseType: 'json',
			}),
		}).then(() => location.reload())
	}

	function getFormData(data) {
		const formData = new FormData()
		Object.entries(data).forEach(i => formData.append(i[0], i[1]))
		return formData
	}
})()
