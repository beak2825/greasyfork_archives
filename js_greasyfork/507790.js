// ==UserScript==
// @name         Куратора форума MOSCOW | by L. Schweppes
// @namespace    https://forum.blackrussia.online/
// @version      1.1
// @description  VK - https://vk.com/bleyzov
// @author       Leonardo Schweppes
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507790/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%B0%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20MOSCOW%20%7C%20by%20L%20Schweppes.user.js
// @updateURL https://update.greasyfork.org/scripts/507790/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%B0%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20MOSCOW%20%7C%20by%20L%20Schweppes.meta.js
// ==/UserScript==

(function() {
		'use strict';
		const UNACCEPT_PREFIX = 4; // Префикс отказано
		const ACCEPT_PREFIX = 8; // Префикс одобрено
		const PIN_PREFIX = 2; //  Префикс закрепить
		const COMMAND_PREFIX = 10; // Команде проекта
		const CLOSE_PREFIX = 7; // Префикс закрыто
		const DECIDED_PREFIX = 6; // Префикс решено
		const WATCHED_PREFIX = 9; // Рассмотрено
		const TEX_PREFIX = 13; //  Техническому специалисту
		const NO_PREFIX = 0;
		const buttons = [{
				title: 'Приветствие',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +

					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
			}, {
				title: 'На рассмотрении',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [B][COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]взята на рассмотрение,[/COLOR] ожидайте ответа в данной теме.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][SIZE=4][FONT=verdana]Просьба [COLOR=rgb(105, 0, 198)]не создавать дубликаты данной темы,[/COLOR] иначе [COLOR=rgb(105, 0, 198)]Ваш форумный аккаунт может быть заблокирован.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
					"<br>" +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: PIN_PREFIX,
				status: true,
			}, {
				title: 'Не логируется',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [B][COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br>' +
					"[CENTER][SIZE=4][FONT=verdana]По[COLOR=rgb(105, 0, 198)]В системе логирования нарушений со стороны игрока не обнаружено.[/COLOR][/SIZE][/CENTER]<br>" +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/5yp8jHk1/20240402-135511.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: UNACCEPT_PREFIX,
				status: false,
			}, {
				title: 'NRP наказания',
				dpstyle: 'oswald: 3px; color: #fff; background: rgba(0, 0, 0, 0.2); box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid; border-color: rgb(105, 0, 198); margin-left: 250px; margin-right: 250px; width: 300px;',
      }, {
        title: 'DM',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.19.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Jail 60 минут[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					"[CENTER][SPOILER=Примечание][SIZE=4][COLOR=rgb(105, 0, 198)][FONT=verdana]Примечание:[/COLOR] разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/FONT][/CENTER][/SPOILER]" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'DB',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.13.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Jail 60 минут[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					"[CENTER][SPOILER=Исключение][SIZE=4][COLOR=rgb(105, 0, 198)][FONT=verdana]Исключение:[/COLOR] разрешается на территории проведения мероприятия по захвату упавшего семейного контейнера.[/FONT][/CENTER][/SPOILER]" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'RK',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.14.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Jail 30 минут[/SIZE][/FONT][/COLOR][/CENTER]" +
					'<br>' +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'TK',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.15.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Jail 60 минут / Warn (за два и более убийства)[/SIZE][/FONT][/COLOR][/CENTER]" +
					'<br>' +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'SK',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.16.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Jail 60 минут / Warn (за два и более убийства)[/SIZE][/FONT][/COLOR][/CENTER]" +
					'<br>' +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'PG',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.17.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Jail 30 минут[/SIZE][/FONT][/COLOR][/CENTER]" +
					'<br>' +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'MG',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.18.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					"[CENTER][SPOILER=Примечание][SIZE=4][COLOR=rgb(105, 0, 198)][FONT=verdana]Примечание:[/COLOR] использование смайлов в виде символов «))», «=D» запрещено в IC чате. Телефонное общение также является IC чатом. Исключение: за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.[/FONT][/CENTER][/SPOILER]" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Mass DM',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.20.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Warn / Ban 3 - 7 дней[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'nrp ограбление/похищение',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [B][COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту общих правил ограблений и похищений:[/SIZE][/FONT][/COLOR][/CENTER]" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]3.11.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Вставить текст[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | PermBan[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
				send: false,
			}, {
				title: 'Nrp Врач',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [B][COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту общих правил правил государственных структур:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]3.11.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено оказание медицинской помощи без Role Play отыгровок.[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Jail 30 минут[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Nrp Cop',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [B][COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту общих правил правил государственных структур:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]6.02.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено оказывать задержание без Role Play отыгровки.[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Warn[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Nrp Обыск',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [B][COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту общих правил правил государственных структур:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]8.05.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено проводить обыск игрока без Role Play отыгровки.[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Warn[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Nrp Розыск',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [B][COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту общих правил правил государственных структур:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]6.02.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено выдавать розыск без Role Play отыгровки.[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Warn[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Nrp В/Ч',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [B][COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту общих правил нападения на военную часть:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено нарушение правил нападения на военную часть.[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Н/П/Р/О',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [B][COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту общих правил правил государственных структур:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]4.01.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено редактирование объявлений, не соответствующих ПРО.[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'nRP поведение',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.01.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено поведение, нарушающее нормы процессов Role Play режима игры[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Jail 30 минут[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					"[CENTER][SPOILER=Примечание][SIZE=4][COLOR=rgb(105, 0, 198)][FONT=verdana]Примечание:[/COLOR] ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная rgb(105, 0, 198) в проведении различных собеседований и так далее.[/FONT][/CENTER][/SPOILER]" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Уход от RP',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.02.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Jail 30 минут / Warn[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					"[CENTER][SPOILER=Примечание][SIZE=4][COLOR=rgb(105, 0, 198)][FONT=verdana]Примечание:[/COLOR] уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания или ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа. Уходить в интерьер или зеленую зону во время перестрелки с целью избежать смерти или уйти от Role Play процесса и так далее.[/FONT][/CENTER][/SPOILER]" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'nRP езда',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.03.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Jail 30 минут[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					"[CENTER][SPOILER=Примечание][SIZE=4][COLOR=rgb(105, 0, 198)][FONT=verdana]Примечание:[/COLOR] езда на скутере по горам, езда на любом транспортном средстве по встречным полосам, нарушая все правила дорожного движения без какой-либо причины, намеренное создание аварийных ситуаций на дорогах и так далее.[/FONT][/CENTER][/SPOILER]" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Помеха ИП',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.04.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещены любые действия способные привести к rgb(105, 0, 198)м в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы.[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					"[CENTER][SPOILER=Пример][SIZE=4][COLOR=rgb(105, 0, 198)][FONT=verdana]Пример:[/COLOR] таран дальнобойщиков, инкассаторов под разными предлогами.[/FONT][/CENTER][/SPOILER]" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'nRP обман',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.05.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | PermBan[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					"[CENTER][SPOILER=Примечание][SIZE=4][COLOR=rgb(105, 0, 198)][FONT=verdana]Примечание:[/COLOR] после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/FONT][/CENTER][/SPOILER]" +
					"[CENTER][SPOILER=Примечание][SIZE=4][COLOR=rgb(105, 0, 198)][FONT=verdana]Примечание:[/COLOR] разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/FONT][/CENTER][/SPOILER]" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Отыгровки в свою пользу',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.06.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещены любые Role Play отыгровки в свою сторону или пользу[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Jail 30 минут[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					"[CENTER][SPOILER=Примечание][SIZE=4][COLOR=rgb(105, 0, 198)][FONT=verdana]Примечание:[/COLOR] при остановке Вашего транспортного средства правоохранительными органами у Вас очень резко и неожиданно заболевает сердце, ломаются руки, блокируются двери машины или окна и так далее.[/FONT][/CENTER][/SPOILER]" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Afk no ESC',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.07.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено нахождение в AFK без включенного ESC, создавая помеху другим игрокам[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Kick[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Аморал. действия',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.08.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещена любая форма аморальных действий сексуального характера в сторону игроков[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Jail 30 минут / Warn[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					"[CENTER][SPOILER=Исключение][SIZE=4][COLOR=rgb(105, 0, 198)][FONT=verdana]Исключение:[/COLOR] обоюдное согласие обеих сторон.[/FONT][/CENTER][/SPOILER]" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Слив склада',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.09.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Ban 15 - 30 дней / PermBan[/SIZE][/FONT][/COLOR][/CENTER]" +
					'<br>' +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Обман в /do',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.10.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Jail 30 минут / Warn[/SIZE][/FONT][/COLOR][/CENTER]" +
					'<br>' +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Рабочий/фракц. транспорт в л.ц.',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.11.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено использование рабочего или фракционного транспорта в личных целях[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Jail 30 минут[/SIZE][/FONT][/COLOR][/CENTER]" +
					'<br>' +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Затягивание RP',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.12.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено целенаправленное затягивание Role Play процесса[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Jail 30 минут[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					"[CENTER][SPOILER=Примечание][SIZE=4][COLOR=rgb(105, 0, 198)][FONT=verdana]Примечание:[/COLOR] /me начал доставать документы [1/100], начал доставать документы [2/100] и тому подобное.[/FONT][/CENTER][/SPOILER]" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
      }, {
				title: 'Багоюз',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.21.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено пытаться обходить игровую систему или использовать любые баги сервера | Ban 15 - 30 дней / PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов)[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			},

			{
				title: 'Сторонее ПО',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.22.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | Ban 15 - 30 дней / PermBan[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Скрытие багов',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.23.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено скрывать от администрации баги системы, а также распространять их игрокам | Ban 15 - 30 дней / PermBan[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Скрытие нарушителей',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.24.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено скрывать от администрации нарушителей или злоумышленников | Ban 15 - 30 дней / PermBan + ЧС проекта[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			},

			{
				title: 'Попытки/действия навредить репутации проекта',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.25.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещены попытки или действия, которые могут навредить репутации проекта | PermBan + ЧС проекта[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Вред ресурсам проекта',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.26.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено намеренно наносить вред ресурсам проекта (игровые серверы, форум, официальные Discord-серверы и так далее) | PermBan + ЧС проекта[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			},

			{
				title: 'Слив адм. информации',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.27.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено распространение информации и материалов, которые имеют непосредственное отношение к работе администрации проекта | PermBan + ЧС проекта[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			},

			{
				title: 'Продажа/Покупка ИВ',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.28.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги | PermBan с обнулением аккаунта + ЧС проекта[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			},

			{
				title: 'Трансфер',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.29.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещен трансфер имущества между серверами проекта | PermBan с обнулением аккаунта[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Ущерб экономике',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.30.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено пытаться нанести ущерб экономике сервера | Ban 15 - 30 дней / PermBan[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Реклама',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваше нарушение [COLOR=rgb(105, 0, 198)]рассмотрено,[/COLOR] и вы будете [COLOR=rgb(105, 0, 198)]наказаны согласно следующему правилу:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.31.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное | Ban 7 дней / PermBan[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Обман администрации',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваше нарушение [COLOR=rgb(105, 0, 198)]рассмотрено,[/COLOR] и вы будете [COLOR=rgb(105, 0, 198)]наказаны согласно следующему правилу:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.32.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта | Ban 7 - 15 дней[/SIZE][/FONT][/COLOR]" +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Исп. уязвимостью правил',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваше нарушение [COLOR=rgb(105, 0, 198)]рассмотрено,[/COLOR] и вы будете [COLOR=rgb(105, 0, 198)]наказаны согласно следующему правилу:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.33.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено пользоваться уязвимостью правил | Ban 15 дней[/SIZE][/FONT][/COLOR]" +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Уход от наказания',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.34.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещен уход от наказания | Ban 15 - 30 дней (суммируется к общему наказанию дополнительно)[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Регилиозная пропаганда',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.35.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | Mute 120 минут / Ban 7 дней[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Перенос конфликта',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.36.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено переносить конфликты из IC в OOC и наоборот | Warn[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'ООС угрозы',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.37.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещены OOC угрозы, в том числе и завуалированные | Mute 120 минут / Ban 7 дней[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Распространение личной инф.',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.38.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено распространять личную информацию игроков и их родственников | Ban 15 - 30 дней / PermBan[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Злоупотребление нарушениями',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.39.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Злоупотребление нарушениями правил сервера | Ban 7 - 30 дней[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Деструктивные действия к проекту',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.40.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к rgb(105, 0, 198)м в игровом процессе | Mute 300 минут / Ban 30 дней[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Передача игрового аккаунта',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.41.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Передача своего личного игрового аккаунта третьим лицам | PermBan[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Продажа аккаунта/имущества',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.42.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Попытка продажи любого игрового имущества или игрового аккаунта за реальные деньги | PermBan[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT[/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Продажа/обмен/покупка промокодов',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.43.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций | Mute 120 минут[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'RP сон',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.44.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] На серверах проекта запрещен Role Play сон (нахождение в AFK без ESC) | Kick[/SIZE][/FONT][/COLOR][/CENTER]" +
					'[SPOILER="Исключение"]сон разрешается с 23:00 до 6:00 в совершенно любых местах, но только на соответствующих и привычных для этого объектах (скамейки, кровати и так далее).[/SPOILER]' +
					'[SPOILER="Примечание"]сон запрещается в тех местах, где он может оказывать любую помеху другим игрокам сервера[/SPOILER]' +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'ЕПП',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.46.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено ездить по полям на любом транспорте | Jail 30 минут[/SIZE][/FONT][/COLOR][/CENTER]" +
					'[SPOILER="Исключение"]разрешено передвижение на кроссовых мотоциклах и внедорожниках[/SPOILER]' +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'ЕПП дально/инко',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.47.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) | Jail 60 минут[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Продажа репутации',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.48.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещена продажа, передача, трансфер или покупка репутации семьи любыми способами, скрытие нарушителей, читеров лидером семьи. | Обнуление рейтинга семьи / Обнуление игрового аккаунта лидера семьи[/SIZE][/FONT][/COLOR][/CENTER]" +
					'[SPOILER="Примечание"]сокрытие информации о продаже репутации семьи приравнивается к пункту правил 2.24[/SPOILER]' +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Многократная продажа репутации',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.49.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Многократная продажа или покупка репутации семьи любыми способами. | Ban 15 - 30 дней / PermBan + удаление семьи[/SIZE][/FONT][/COLOR][/CENTER]" +
					'[CENTER][SPOILER="Примечание"]Повторное нарушение правила может привести к удалению семьи[/SPOILER][/CENTER]' +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Аресты в интерьерах',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.50.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий | Ban 7 - 15 дней + увольнение из организации[/SIZE][/FONT][/COLOR][/CENTER]" +
					'[SPOILER="Примечание"]Нарушение данного правила может повлечь за собой увольнение из организации[/SPOILER]' +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Помеха RP',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.51.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено вмешательство в Role Play процесс с целью помехи и препятствования дальнейшего развития Role Play процесса | Jail 30 минут[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[SPOILER="Пример"]Вмешательство в Role Play процесс при задержании игрока сотрудниками ГИБДД, вмешательство в проведение тренировки или мероприятия какой-либо фракции и тому подобные ситуации.[/SPOILER]' +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'nRP аксессуары',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.52.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/SIZE][/FONT][/COLOR][/CENTER]" +
					'[SPOILER="Пример"]Слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное.[/SPOILER]' +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Нец. лексика в имуществе',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.53.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной наклонности | Ban 1 день / При повторном нарушении обнуление бизнеса[/SIZE][/FONT][/COLOR][/CENTER]" +
					'[SPOILER="Примечание"]Названия семей, бизнесов, компаний и т.д.[/SPOILER]' +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Оск. администрации',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.54.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | Mute 180 минут[/SIZE][/FONT][/COLOR][/CENTER]" +
					'[SPOILER="Пример"]Оформление жалобы в игре с текстом: "Быстро починил меня", "Админы вы задрали уже когда работать будете меня тут ДБшат я 3 жалобы уже подал!!!!!!!!", "МОЗГИ ВКЛЮЧИТЕ Я УВОЛЮ ВАС ЩА" и т.д. и т.п., а также при взаимодействии с другими игроками.[/SPOILER]' +
					'[SPOILER="Примечание"]Оскорбление администрации в любой чат, включая репорт подлежит наказанию в виде блокировки доступа к использованию всех видов чатов - Mute 180 минут.[/SPOILER]' +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Багоюз анимаций',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.55.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещается багоюз связанный с анимацией в любых проявлениях. | Jail 60 / 120 минут[/SIZE][/FONT][/COLOR][/CENTER]" +
					'[SPOILER="Пример"]Если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде Jail на 120 минут. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками.[/SPOILER]' +
					'[SPOILER="Пример"]Если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде Jail на 60 минут.[/SPOILER]' +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Объединение в команду в мини-играх',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.56.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещается объединение в команду между убийцей и выжившим на мини-игре \"Мертвая рука\" | Jail 30 минут[/SIZE][/FONT][/COLOR][/CENTER]" +
					'[SPOILER="Примечание"]Правило действует только на время Хэллоуинского ивента.[/SPOILER]' +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Нарушение долгов',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]2.57.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещается брать в долг игровые ценности и не возвращать их. | Ban 30 дней / permban[/SIZE][/FONT][/COLOR][/CENTER]" +
					'[SPOILER="Примечание"]Займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;<br>При невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда;<br>Жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/SPOILER]' +
					"<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Игровые чаты',
				dpstyle: 'oswald: 3px; color: #fff; background: rgba(0, 0, 0, 0.2); box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid; border-color: rgb(105, 0, 198); margin-left: 250px; margin-right: 250px; width: 300px;',
			}, {
				title: 'Русский язык на сервере',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]3.01.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Устное замечание / Mute 30 минут[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'CapsLock',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]3.02.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Оскорбления в OOC',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]3.03.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Оскорбление родных',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]3.04.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC)[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Mute 120 минут / Ban 7 - 15 дней[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					"[CENTER][SPOILER=Примечание][SIZE=4][COLOR=rgb(105, 0, 198)][FONT=verdana]Примечание:[/COLOR] термины \"MQ\", \"rnq\" расценивается, как упоминание родных.<br>[COLOR=rgb(105, 0, 198)][FONT=verdana]Исключение:[/COLOR] если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/FONT][/CENTER][/SPOILER]" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Флуд',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]3.05.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Злоупотребление знаками препинания',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]3.06.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено злоупотребление знаков препинания и прочих символов[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					"[CENTER][SPOILER=Пример][SIZE=4][COLOR=rgb(105, 0, 198)][FONT=verdana]Пример:[/COLOR] «???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/FONT][/CENTER][/SPOILER]" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Оскорбления сексуального характера',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]3.07.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					"[CENTER][SPOILER=Примечание][SIZE=4][COLOR=rgb(105, 0, 198)][FONT=verdana]Примечание:[/COLOR] «дырка», «шмара», «ведро», «мадагаскарский присосконог», «свиноногий бандикут», «скорострел» и так далее.[/FONT][/CENTER][/SPOILER]" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Слив глоб. чатов',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]3.08.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещены любые формы «слива» посредством использования глобальных чатов[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | PermBan[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Угрозы наказанием',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]3.09.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещены любые угрозы о наказании игрока со стороны администрации[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Выдача себя за администратора',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]3.10.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещена выдача себя за администратора, если таковым не являетесь[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Ban 7 - 15 + ЧС администрации[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Ввод в заблуждение',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]3.11.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Ban 15 - 30 дней / PermBan[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					"[CENTER][SPOILER=Примечание][SIZE=4][COLOR=rgb(105, 0, 198)][FONT=verdana]Примечание:[/COLOR] /me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена.[/FONT][/CENTER][/SPOILER]" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Репорт с транслитом, оффтопом, капсом',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]3.12.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено подавать репорт написанный транслитом, с сообщением не по теме (Offtop), с включенным Caps Lock и повторять обращение (если ответ был уже дан ранее)[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Report Mute 30 минут[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Нецензура в /report',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]3.13.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено подавать репорт с использованием нецензурной брани[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Report Mute 30 минут[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Музыка в Voice',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]3.14.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено включать музыку в Voice Chat[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Mute 60 минут[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Оскорбления в Voice',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]3.15.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено оскорблять игроков или родных в Voice Chat[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Mute 120 минут / Ban 7 - 15 дней[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			},

			{
				title: 'Посторонние звуки Voice',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]3.16.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено создавать посторонние шумы или звуки[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					"[CENTER][SPOILER=Примечание][SIZE=4][COLOR=rgb(105, 0, 198)][FONT=verdana]Примечание:[/COLOR] Посторонние звуки на фоне речи, мешающие взаимодействию игроков посредством голосового чата. Сильное искажение звука, исходящее из микрофона плохого качества. Намеренно портить игру другим игрокам (кричать, перебивать)[/FONT][/CENTER][/SPOILER]" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Реклама в Voice',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]3.17.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещена реклама в Voice Chat не связанная с игровым процессом[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Ban 7 - 15 дней[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					"[CENTER][SPOILER=Пример][SIZE=4][COLOR=rgb(105, 0, 198)][FONT=verdana]Пример:[/COLOR] реклама Discord серверов, групп, сообществ, ютуб каналов и т.д.[/FONT][/CENTER][/SPOILER]" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Пропаганда и провокация',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]3.18.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Mute 120 минут / Ban 10 дней[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Изменение голоса',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]3.19.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено использование любого софта для изменения голоса[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Mute 60 минут[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Транслит в чатах',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]3.20.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено использование транслита в любом из чатов[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					"[CENTER][SPOILER=Пример][SIZE=4][COLOR=rgb(105, 0, 198)][FONT=verdana]Пример:[/COLOR] «Privet», «Kak dela», «Narmalna».[/FONT][/CENTER][/SPOILER]" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Реклама промокодов',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]3.21.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах.[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Ban 30 дней[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					"[CENTER][SPOILER=Примечание][SIZE=4][COLOR=rgb(105, 0, 198)][FONT=verdana]Примечание:[/COLOR] чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.[/FONT][/CENTER][/SPOILER]" +
					"[CENTER][SPOILER=Исключение][SIZE=4][COLOR=rgb(105, 0, 198)][FONT=verdana]Исключение:[/COLOR] промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.[/FONT][/CENTER][/SPOILER]" +
					"[CENTER][SPOILER=Пример][SIZE=4][COLOR=rgb(105, 0, 198)][FONT=verdana]Пример:[/COLOR] если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.[/FONT][/CENTER][/SPOILER]" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Объявления в гос. организациях',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]3.22.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC)[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					"[CENTER][SPOILER=Пример][SIZE=4][COLOR=rgb(105, 0, 198)][FONT=verdana]Пример:[/COLOR] в помещении центральной больницы писать в чат: \"Продам эксклюзивную шапку дешево!!!\"[/FONT][/CENTER][/SPOILER]" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Нецензурная лексика в VIP чате',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]3.23.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Аккаунты:',
				dpstyle: 'oswald: 3px; color: #fff; background: rgba(0, 0, 0, 0.2); box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid; border-color: rgb(105, 0, 198); margin-left: 250px; margin-right: 250px; width: 300px;',
			}, {
				title: 'Передача аккаунта',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]4.03.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещена совершенно любая передача игровых аккаунтов третьим лицам[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | PermBan[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Количество аккаунтов',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]4.04.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Разрешается зарегистрировать максимально только три игровых аккаунта на сервере[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | PermBan[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					"[CENTER][SPOILER=Примечание][SIZE=4][COLOR=rgb(105, 0, 198)][FONT=verdana]Примечание:[/COLOR] блокировке подлежат все аккаунты созданные после третьего твинка.[/FONT][/CENTER][/SPOILER]" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Передача игровых ценностей',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]4.05.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено передавать любые игровые ценности между игровыми аккаунтами, а также в целях удержания имущества[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Ban 15 - 30 дней / PermBan[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					"[CENTER][SPOILER=Пример][SIZE=4][COLOR=rgb(105, 0, 198)][FONT=verdana]Пример:[/COLOR] перекинуть бизнес, АЗС, дом или любые другие игровые материальные ценности с одного аккаунта игрока на другой / используя свой твинк / договорившись заранее с игроком и иные способы удержания.[/FONT][/CENTER][/SPOILER]" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Формат никнейма',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]4.06.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Никнейм игрового аккаунта должен быть в формате \"Имя_Фамилия\" на английском языке[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Устное замечание + смена игрового никнейма[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					"[CENTER][SPOILER=Пример][SIZE=4][COLOR=rgb(105, 0, 198)][FONT=verdana]Пример:[/COLOR] John_Scatman — это правильный Role Play игровой никнейм, в котором не содержится ошибок.<br> _scatman_John — это неправильный Role Play игровой никнейм, в котором содержатся определенные ошибки.[/FONT][/CENTER][/SPOILER]" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Заглавные буквы в никнейме',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]4.07.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] В игровом никнейме запрещено использовать более двух заглавных букв[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Устное замечание + смена игрового никнейма[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					"[CENTER][SPOILER=Примечание][SIZE=4][COLOR=rgb(105, 0, 198)][FONT=verdana]Примечание:[/COLOR] одна заглавная буква в первой букве имени, вторая заглавная буква в первой букве фамилии, большего быть не может.[/FONT][/CENTER][/SPOILER]" +
					"[CENTER][SPOILER=Исключение][SIZE=4][COLOR=rgb(105, 0, 198)][FONT=verdana]Исключение:[/COLOR] приставки к фамилиям, например: DeSanta, MacWeazy и так далее.[/FONT][/CENTER][/SPOILER]" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Несоответствие никнейма',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]4.08.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено использовать никнейм, который не соответствует реальным именам и фамилиям и не несет в себе абсолютно никакой смысловой нагрузки[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Устное замечание + смена игрового никнейма[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					"[CENTER][SPOILER=Пример][SIZE=4][COLOR=rgb(105, 0, 198)][FONT=verdana]Пример:[/COLOR] Super_Man, Vlados_Vidos, Machine_Killer — это неправильные Role Play игровой никнеймы, в которых содержатся определенные ошибки.[/FONT][/CENTER][/SPOILER]" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Оскорбительный никнейм',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]4.09.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные)[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Устное замечание + смена игрового никнейма / PermBan[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Повторяющийся никнейм',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]4.10.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Устное замечание + смена игрового никнейма / PermBan[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					"[CENTER][SPOILER=Пример][SIZE=4][COLOR=rgb(105, 0, 198)][FONT=verdana]Пример:[/COLOR] подменять букву i на L и так далее, по аналогии.[/FONT][/CENTER][/SPOILER]" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Владение бизнесами',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]4.11.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Владеть бизнесами разрешается с одного основного аккаунта[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Обнуление аккаунта[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Неактивность владельца бизнеса',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]4.13.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено, имея бизнес или автозаправочную станцию (АЗС), заходить в игру только ради его оплаты и не проявлять активность в игре.[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Обнуление владения бизнесом[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					"[CENTER][SPOILER=Примечание][SIZE=4][COLOR=rgb(105, 0, 198)][FONT=verdana]Примечание:[/COLOR] минимальный онлайн для владельцев бизнесов, автозаправочных станций — 7 часов в неделю активной игры (нахождение в nRP / RP сне не считается за активную игру).[/FONT][/CENTER][/SPOILER]" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Неактивность владельца ТК/СК',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]4.14.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено, имея транспортную или строительную компанию не проявлять активность в игре.[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Обнуление компании без компенсации[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					"[CENTER][SPOILER=Примечание][SIZE=4][COLOR=rgb(105, 0, 198)][FONT=verdana]Примечание:[/COLOR] минимальный онлайн для владельцев строительных и транспортных компаний — 7 часов в неделю активной игры (нахождение в nRP / RP сне не считается за активную игру).<br>Примечание: если не заходить в игру в течении 5-ти дней, не чинить транспорт в ТК, не проявлять активность в СК - компания обнуляется автоматически.[/FONT][/CENTER][/SPOILER]" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Идентичный промокод блогера',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br><br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваша жалоба [COLOR=rgb(105, 0, 198)]успешно рассмотрена,[/COLOR] нарушитель будет [COLOR=rgb(105, 0, 198)]наказан по следующему пункту правил:[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
					"[CENTER][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4]4.15.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4] Запрещено создавать промокод, идентичный промокоду блогера проекта, а также любой промокод, который не относится к рефералу и имеет возможность пассивного заработка.[/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] | Перманентная блокировка аккаунта или обнуление имущества, заработанного с помощью промокода, а также самого промокода.[/SIZE][/FONT][/COLOR][/CENTER]" +
					"<br>" +
					'[CENTER][IMG height="45px"]https://i.postimg.cc/yYZV1qJp/20240402-135829.png[/IMG][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: ACCEPT_PREFIX,
				status: false,
			},

			{
				title: 'Перенаправление в другой раздел:',
				dpstyle: 'oswald: 3px; color: #fff; background: rgba(0, 0, 0, 0.2); box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid; border-color: rgb(105, 0, 198); margin-left: 250px; margin-right: 250px; width: 300px;',
			}, {
				title: 'Техническому специалисту',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [B][COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваше [/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][FONT=verdana][COLOR=rgb(255, 255, 255)][SIZE=4]обращение [/SIZE][/COLOR][/FONT][SIZE=4]переадресовано [/SIZE][/FONT][/COLOR][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]—  [/COLOR][COLOR=rgb(105, 0, 198)]Техническому специалисту.[/COLOR][/CENTER]<br>" +
					"[CENTER][SIZE=4][FONT=verdana]Просьба [COLOR=rgb(105, 0, 198)]не создавать дубликаты данной темы,[/COLOR] иначе [COLOR=rgb(105, 0, 198)]Ваш форумный аккаунт может быть заблокирован.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
					"<br>" +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][SIZE=4]На рассмотрении.[/B][/COLOR][/FONT][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: TEX_PREFIX,
				status: true,
			}, {
				title: 'Главному администратору',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [B][COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br>' +
					"[CENTER][COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4]Ваше [/SIZE][/FONT][/COLOR][COLOR=rgb(105, 0, 198)][FONT=verdana][FONT=verdana][COLOR=rgb(255, 255, 255)][SIZE=4]обращение [/SIZE][/COLOR][/FONT][SIZE=4]переадресовано [/SIZE][/FONT][/COLOR][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]—  [/COLOR][COLOR=rgb(105, 0, 198)]Главному администратору.[/COLOR][/CENTER]<br>" +
					"[CENTER][SIZE=4][FONT=verdana]Просьба [COLOR=rgb(105, 0, 198)]не создавать дубликаты данной темы,[/COLOR] иначе [COLOR=rgb(105, 0, 198)]Ваш форумный аккаунт может быть заблокирован.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
					"<br>" +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][SIZE=4]На рассмотрении.[/B][/COLOR][/FONT][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: PIN_PREFIX,
				status: true,
			}, {
				title: 'В жб на адм',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [B][COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br>' +
					"[CENTER][SIZE=4][FONT=verdana][COLOR=rgb(105, 0, 198)]Вы ошиблись разделом.<br>[/COLOR] Обратитесь в раздел [COLOR=rgb(105, 0, 198)]жалоб на Администрацию[/COLOR] — [/FONT][/SIZE][URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1080/'][SIZE=4][FONT=verdana][COLOR=rgb(105, 0, 198)]«Нажмите, для перехода»[/COLOR][/FONT][/SIZE][/URL][/CENTER]<br>" +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][SIZE=4]Закрыто.[/B][/COLOR][/FONT][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: UNACCEPT_PREFIX,
				status: false,
			}, {
				title: 'В жб на лидеров',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [B][COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br>' +
					"[CENTER][SIZE=4][FONT=verdana][COLOR=rgb(105, 0, 198)]Вы ошиблись разделом.<br>[/COLOR] Обратитесь в раздел [COLOR=rgb(105, 0, 198)]жалоб на Лидеров фракций[/COLOR] — [/FONT][/SIZE][URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.1081/'][SIZE=4][FONT=verdana][COLOR=rgb(105, 0, 198)]«Нажмите, для перехода»[/COLOR][/FONT][/SIZE][/URL][/CENTER]<br>" +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][SIZE=4]Закрыто.[/B][/COLOR][/FONT][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: UNACCEPT_PREFIX,
				status: false,
			}, {
				title: 'В жб на Хелперов',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [B][COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br>' +
					"[CENTER][SIZE=4][FONT=verdana][COLOR=rgb(105, 0, 198)]Вы ошиблись разделом.<br>[/COLOR] Обратитесь в раздел [COLOR=rgb(105, 0, 198)]жалоб на Агентов поддержки[/COLOR] — [/FONT][/SIZE][URL='https://forum.blackrussia.online/threads/moscow-%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D0%BE%D0%B2-%D0%9F%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.6656372/'][SIZE=4][FONT=verdana][COLOR=rgb(105, 0, 198)]«Нажмите, для перехода»[/COLOR][/FONT][/SIZE][/URL][/CENTER]<br>" +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][SIZE=4]Закрыто.[/B][/COLOR][/FONT][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: UNACCEPT_PREFIX,
				status: false,
			}, {
				title: 'В жб на сотрудников орг',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [B][COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br>' +
					"[CENTER][SIZE=4][FONT=verdana][COLOR=rgb(105, 0, 198)]Вы ошиблись разделом.<br>[/COLOR] Обратитесь в раздел [COLOR=rgb(105, 0, 198)]жалоб на сотрудников своей организации[/COLOR] — [/FONT][/SIZE][URL='https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9623-moscow.1055/'][SIZE=4][FONT=verdana][COLOR=rgb(105, 0, 198)]«Нажмите, для перехода»[/COLOR][/FONT][/SIZE][/URL][/CENTER]<br>" +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][SIZE=4]Закрыто.[/B][/COLOR][/FONT][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: UNACCEPT_PREFIX,
				status: false,
			}, {
				title: 'В Обжалования наказания',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [B][COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br>' +
					"[CENTER][SIZE=4][FONT=verdana][COLOR=rgb(105, 0, 198)]Вы ошиблись разделом.<br>[/COLOR] Обратитесь в раздел [COLOR=rgb(105, 0, 198)]обжалований наказаний[/COLOR] — [/FONT][/SIZE][URL='https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1083/'][SIZE=4][FONT=verdana][COLOR=rgb(105, 0, 198)]«Нажмите, для перехода»[/COLOR][/FONT][/SIZE][/URL][/CENTER]<br>" +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][SIZE=4]Закрыто.[/B][/COLOR][/FONT][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: UNACCEPT_PREFIX,
				status: false,
			},

			{
				title: 'Доказательства в жалобах:',
				dpstyle: 'oswald: 3px; color: #fff; background: rgba(0, 0, 0, 0.2); box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid; border-color: rgb(105, 0, 198); margin-left: 250px; margin-right: 250px; width: 300px;',
			}, {
				title: 'Недостаточно док-в',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [B][COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br>' +
					"[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][SIZE=4]Недостаточно доказательств для корректного рассмотрения вашей жалобы.[/SIZE][/COLOR][/FONT][/CENTER]<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/5yp8jHk1/20240402-135511.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: UNACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Отсутствуют док-ва',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [B][COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br>' +
					"[CENTER][SIZE=4][FONT=verdana][COLOR=rgb(105, 0, 198)]Отсутствуют доказательства [/COLOR]– следовательно,[COLOR=rgb(105, 0, 198)] рассмотрению не подлежит. <br>[/COLOR]Загрузите доказательства на фото-видео хостинги [COLOR=rgb(105, 0, 198)]YouTube, Imgur, Yapx [/COLOR]и так далее.[/FONT][/SIZE][/CENTER]<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/5yp8jHk1/20240402-135511.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: UNACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Не работает док-ва',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [B][COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br>' +
					"[CENTER][SIZE=4][COLOR=rgb(105, 0, 198)][FONT=verdana]Ваши доказательства – не рабочие. Убедитесь[/FONT][/COLOR][FONT=verdana] в правильности указанной [/FONT][COLOR=rgb(105, 0, 198)][FONT=verdana]Вами ссылки или ресурса,[/FONT][/COLOR][FONT=verdana] в который [/FONT][COLOR=rgb(105, 0, 198)][FONT=verdana]загружены доказательства.[/FONT][/COLOR][/SIZE][/CENTER]<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/5yp8jHk1/20240402-135511.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: UNACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Док-ва обрываются',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [B][COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br>' +
					"[CENTER][SIZE=4][FONT=verdana][COLOR=rgb(105, 0, 198)]Ваша видеозапись обрывается. Загрузите полную [/COLOR]видеозапись на[COLOR=rgb(105, 0, 198)] видео-хостинг YouTube.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/5yp8jHk1/20240402-135511.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: UNACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Док-ва отредакт',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [B][COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br>' +
					"[CENTER][SIZE=4][FONT=verdana][COLOR=rgb(105, 0, 198)]Доказательства были подвергнуты редактированию[/COLOR] – следовательно, [COLOR=rgb(105, 0, 198)]рассмотрению не подлежит.[/COLOR][/FONT][/SIZE][/CENTER]<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/5yp8jHk1/20240402-135511.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: UNACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Нужен фрапс',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [B][COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br>' +
					"[CENTER][SIZE=4][COLOR=rgb(105, 0, 198)][FONT=verdana]В данной ситуации необходима видео-фиксация всех моментов, нарушений, условий и тому подобного.[/FONT][/COLOR][/SIZE][/CENTER]<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/5yp8jHk1/20240402-135511.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: UNACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Док-ва в соц. сетях',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [B][COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br>' +
					"[CENTER][FONT=verdana][SIZE=4]Доказательства в соц. сетях[/SIZE][/FONT][COLOR=rgb(105, 0, 198)][FONT=verdana][SIZE=4] не принимаются. [/SIZE][/FONT][/COLOR][FONT=verdana][SIZE=4][COLOR=rgb(105, 0, 198)]Загрузите доказательства [/COLOR]на фото-видео хостинги [COLOR=rgb(105, 0, 198)]YouTube, Imgur, Yapx[/COLOR] и так далее.[/SIZE][/FONT][/CENTER]<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/5yp8jHk1/20240402-135511.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: UNACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Неполный фрапс',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [B][COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br>' +
					"[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][SIZE=4]Ваша видео-фиксация не полная. Возможно, [/SIZE][/COLOR][SIZE=4]отсутствуют[/SIZE][COLOR=rgb(105, 0, 198)][SIZE=4] условия сделки, [/SIZE][/COLOR][SIZE=4]отсутствует[/SIZE][COLOR=rgb(105, 0, 198)][SIZE=4] сам процесс сделки, [/SIZE][/COLOR][SIZE=4]либо другие[/SIZE][COLOR=rgb(105, 0, 198)][SIZE=4] ключевые моменты.[/SIZE][/COLOR][/FONT][/CENTER]<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/5yp8jHk1/20240402-135511.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: UNACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Нету time',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [B][COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br>' +
					"[CENTER][FONT=verdana][SIZE=4][COLOR=rgb(105, 0, 198)]В предоставленных доказательствах отсутствует «/time»[/COLOR] – следовательно, [COLOR=rgb(105, 0, 198)]рассмотрению не подлежит.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/5yp8jHk1/20240402-135511.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: UNACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Отсутствуют таймкоды',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [B][COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br>' +
					"[CENTER][FONT=verdana][SIZE=4][COLOR=rgb(105, 0, 198)]В предоставленных доказательствах отсутствуют тайм-коды. Если видео длится больше 3-ех минут[/COLOR] – [COLOR=rgb(105, 0, 198)]Вы должны указать таймкоды нарушений.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/5yp8jHk1/20240402-135511.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: UNACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Нет условий сделки',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [B][COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br>' +
					"[CENTER][FONT=verdana][SIZE=4][COLOR=rgb(105, 0, 198)]В предоставленных доказательствах отсутствуют условия сделки.[/COLOR][/SIZE][/FONT][/CENTER]" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/5yp8jHk1/20240402-135511.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: UNACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Нарушений нет',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [B][COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br>' +
					"[CENTER][FONT=verdana][SIZE=4][COLOR=rgb(105, 0, 198)]Нарушений со стороны игрока не было замечено.[/COLOR][/SIZE][/FONT][/CENTER]" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/5yp8jHk1/20240402-135511.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: UNACCEPT_PREFIX,
				status: false,
			},

			{
				title: 'Прочее:',
				dpstyle: 'oswald: 3px; color: #fff; background: rgba(0, 0, 0, 0.2); box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: 1px solid; border-color: rgb(105, 0, 198); margin-left: 250px; margin-right: 250px; width: 300px;',
			}, {
				title: '2 и более игрока',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [B][COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br>' +
					"[CENTER][FONT=verdana][SIZE=4][COLOR=rgb(105, 0, 198)]Запрещено формировать одну жалобу на двух и более игроков (на каждого игрока нужна отдельная жалоба)[/COLOR][/SIZE][/FONT][/CENTER]" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/5yp8jHk1/20240402-135511.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: UNACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Не по форме',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [B][COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br>' +
					"[CENTER][SIZE=4][FONT=verdana][COLOR=rgb(105, 0, 198)]Жалоба составлена не по форме.<br>[/COLOR] Внимательно прочтите [COLOR=rgb(105, 0, 198)]Общие правила подачи жалоб на игроков[/COLOR] — [/FONT][/SIZE][URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/'][SIZE=4][FONT=verdana][COLOR=rgb(105, 0, 198)]«Нажмите, для перехода»[/COLOR][/FONT][/SIZE][/URL][/CENTER]<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/5yp8jHk1/20240402-135511.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: UNACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Уже наказан',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [B][COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br>' +
					"[CENTER][FONT=verdana][SIZE=4][COLOR=rgb(105, 0, 198)]Нарушитель был наказан ранее.[/COLOR][/SIZE][/FONT][/CENTER]" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/5yp8jHk1/20240402-135511.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: UNACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Уже был дан ответ',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [B][COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br>' +
					"[CENTER][FONT=verdana][SIZE=4][COLOR=rgb(105, 0, 198)]Вам уже был дан ответ в прошлых жалобах.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/5yp8jHk1/20240402-135511.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: UNACCEPT_PREFIX,
				status: false,
			}, {
				title: 'Прошло 3 дня',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [B][COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br>' +
					"[CENTER][FONT=verdana][SIZE=4][COLOR=rgb(105, 0, 198)]С момента нарушения прошло более 72-х часов[/COLOR] – следовательно, [COLOR=rgb(105, 0, 198)]рассмотрению не подлежит.[/COLOR][/SIZE][/FONT][/CENTER]<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/5yp8jHk1/20240402-135511.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: UNACCEPT_PREFIX,
				status: false,
			}, {
				title: 'От 3 лица',
				dpstyle: 'background: rgba(0, 0, 0, 0.2); border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5)',
				content: '[COLOR=rgb(255, 255, 255)][FONT=verdana][SIZE=4][CENTER]{{ greeting }}, уважаемый [B][COLOR=rgb(105, 0, 198)][B][U]{{ user.name }}[/B][/U]![/COLOR][/CENTER][/SIZE][/FONT][/COLOR]<br>' +
					"[CENTER][SIZE=4][FONT=verdana][COLOR=rgb(105, 0, 198)]Жалоба составлена от 3-го лица.<br>[/COLOR] Внимательно прочтите [COLOR=rgb(105, 0, 198)]Общие правила подачи жалоб на игроков[/COLOR] — [/FONT][/SIZE][URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/'][SIZE=4][FONT=verdana][COLOR=rgb(105, 0, 198)]«Нажмите, для перехода»[/COLOR][/FONT][/SIZE][/URL][/CENTER]<br>" +
					'[CENTER][url=https://forum.blackrussia.online/members/leonardo-schweppes.191869/][IMG height="45px"]https://i.postimg.cc/5yp8jHk1/20240402-135511.png[/img][/url][/CENTER]<br>' +
					'[CENTER][U][FONT=verdana][SIZE=4][COLOR=rgb(255, 255, 255)]Благодарим Вас за обращение.[/COLOR][/FONT][/CENTER][/U]' +
					'[CENTER][FONT=verdana][COLOR=rgb(105, 0, 198)][B]BLACK RUSSIA MOSCOW[/B][/COLOR][/FONT][/CENTER][/SIZE]',
				prefix: UNACCEPT_PREFIX,
				status: false,
			},

		];

		$('head').append(`
        <style>
            .select_answer {
                display: flex;
                flex-wrap: wrap;
            }

            .button--primary {
                flex-grow: 1;
                margin: 4px;
            }
        </style>
    `);

		$(document).ready(() => {

			$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

			addAnswers();

			addButton('На рассмотрении', 'pin', 'border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(255, 118, 25, 0.7);', 'fa fa-eye');
			addButton('Отказано', 'unaccept', 'border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(241, 34, 0, 0.6);', 'fa fa-times-circle');
			addButton('Одобрено', 'accepted', 'border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(144, 255, 144, 0.8);', 'fa fa-check-circle');
			addButton('Закрыто', 'closed', 'border-radius: 5px; margin-right: 5px; border: 1px solid; border-color: rgb(164, 164, 164, 0.5);', 'fa fa-lock');

			const targetDiv = document.querySelector('.p-nav-inner > .p-nav-opposite');

      if (targetDiv) {
        targetDiv.insertAdjacentHTML('afterbegin', '<span style="margin-right: 10px; color: 212428;">Люблю Иру</span>');
      }

			const threadData = getThreadData();

			$(`button#ff`).click(() => pasteContent(8, threadData, true));
			$(`button#prr`).click(() => pasteContent(2, threadData, true));
			$(`button#zhb`).click(() => pasteContent(21, threadData, true));
			$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
			$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
			$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
			$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
			$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
			$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
			$('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
			$('button#closed_complaint').click(() => editThreadData(CLOSE_PREFIX, false));
			$('button#techspec').click(() => editThreadData(TEX_PREFIX, true));

			$(`button#selectAnswer`).click(() => {
				XF.alert(buttonsMarkup(buttons), null, 'Выберите нужный ответ');
				buttons.forEach((btn, id) => {
					if (id > 1) {
						$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
					} else {
						$(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
					}
				});
			});
		});

		function addAnswers() {
			$('.button--icon--reply').before(
				`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="border-radius: 5px; margin-right: 5px;">ОТВЕТЫ</button>`
			);
		}

		function addButton(name, id, style, icon) {
			$('#selectAnswer').after(
				`<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}"><i class="${icon}" style="margin-right: 5px;"></i>${name}</button>`
			);
		}

		function buttonsMarkup(buttons) {
			return `<div class="select_answer">${buttons
        .map(
            (btn, i) =>
                `<button id="answers-${i}" class="button--primary button ` +
                `rippleButton" style="margin:4px; margin-left:0px;${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`
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
                4 < hours && hours <= 12
                    ? 'Доброе утро'
                    : 12 < hours && hours <= 18
                    ? 'Добрый день'
                    : 18 < hours && hours <= 4
                    ? 'Добрый вечер'
                    : 'Доброй ночи',
        };
    }

    function editThreadData(prefix, pin = false) {
        // Получаем заголовок темы, так как он необходим при запросе
        const threadTitle = $('.p-title-value')[0].lastChild.textContent;

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
            }).then(() => location.reload());
        }
        if (pin == true) {
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