// ==UserScript==// ==UserScript==
// @name         Для руководства 51-55 / K. Stoyn
// @namespace    https://forum.blackrussia.online
// @version      1.14
// @description  Для модерирования и работы на форуме
// @author       Kalibr Stoyn
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license  MIT
// @collaborator
// @icon https://i.postimg.cc/PrdT1Ch8/95cb0bdbdaa969d13d2e602d9ff2b93a.jpg
// @downloadURL https://update.greasyfork.org/scripts/538690/%D0%94%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%2051-55%20%20K%20Stoyn.user.js
// @updateURL https://update.greasyfork.org/scripts/538690/%D0%94%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%2051-55%20%20K%20Stoyn.meta.js
// ==/UserScript==

	(function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // префикс отказано
	const PIN_PREFIX = 2; //  префикс закрепить
  const TRANSFER_PREFIX_JBT = 24; // перенос в глвный жб на техов
  const TRANSFER_PREFIX_TR46 = 20; // перенос в тех раздел 51
  const TRANSFER_PREFIX_OBJ46 = 21; // перенос обжалования 51
  const TRANSFER_PREFIX_ADM46 = 22; // перенос в жб адм 51
  const TRANSFER_PREFIX_PLAYER46 = 23; // перенос в жб игроков 51
  const TRANSFER_PREFIX_TR47 = 25; // перенос в тех раздел 52
  const TRANSFER_PREFIX_OBJ47 = 26; // перенос обжалования 52
  const TRANSFER_PREFIX_ADM47 = 27; // перенос в жб адм 52
  const TRANSFER_PREFIX_PLAYER47 = 28; // перенос в жб игроков 52
  const TRANSFER_PREFIX_TR48 = 29; // перенос в тех раздел 53
  const TRANSFER_PREFIX_OBJ48 = 30; // перенос обжалования 53
  const TRANSFER_PREFIX_ADM48 = 31; // перенос в жб адм 53
  const TRANSFER_PREFIX_PLAYER48 = 32; // перенос в жб игроков 53
  const TRANSFER_PREFIX_TR49 = 33; // перенос в тех раздел 54
  const TRANSFER_PREFIX_OBJ49 = 34; // перенос обжалования 54
  const TRANSFER_PREFIX_ADM49 = 35; // перенос в жб адм 54
  const TRANSFER_PREFIX_PLAYER49 = 36; // перенос в жб игроков 54
  const TRANSFER_PREFIX_TR50 = 37; // перенос в тех раздел 55
  const TRANSFER_PREFIX_OBJ50 = 38; // перенос обжалования 55
  const TRANSFER_PREFIX_ADM50 = 39; // перенос в жб адм 55
  const TRANSFER_PREFIX_PLAYER50 = 40; // перенос в жб игроков 55
	const COMMAND_PREFIX = 10; // команде проекта
	const CLOSE_PREFIX = 7; // префикс закрыто
	const DECIDED_PREFIX = 6; // префикс решено
	const TECHADM_PREFIX = 13 // префикс теху
	const WATCHED_PREFIX = 9; // рассмотрено
	const WAIT_PREFIX = 14; // ожидание (для переноса в баг-трекер)
	const NO_PREFIX = 0;
	const buttons = [
	{
	title: 'ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ ᅠ  Для жб на теховᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠᅠ ᅠ',
	color: 'oswald: 3px; color: #00ffff; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: 3px solid #00ffff; width: 96%',
	},
    {
	title: 'Приветствие',
	color: 'oswald: 3px; color: #FF6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][FONT=times new roman]Текст   [/FONT]<br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)] Префикс [/COLOR][/CENTER][/FONT][/SIZE]',
},
        {
        title: 'Перенаправление в поддержку',
	color: 'oswald: 3px; color: #ff0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
       '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/SIZE][/COLOR]<br><br>' +
        '[CENTER]Обратитесь в техническую поддержку проекта.<br><br>Контактная информация:[/CENTER]<br>'+
        '[CENTER]Telegram - @br_techBot[/CENTER]<br>'+
        '[CENTER]VK - vk.com/br_tech[/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(52,201,36)][SIZE=4][ICODE]Рассмотрено.[/ICODE][/COLOR][/FONT][/CENTER][/SIZE]<br>'+
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
        prefix: WATCHED_PREFIX,
        status: false,
    },
        {
        title: 'Передано Руководству',
	color: 'oswald: 3px; color: #FF6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/SIZE][/COLOR]<br><br>' +
		'[CENTER]Ваше обращение передано Вышестоящему руководству технического отдела.<br>Создавать подобные темы не нужно, пожалуйста, ожидайте ответа.[/FONT][/CENTER]<br>'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
		prefix: TRANSFER_PREFIX_JBT,
		status: true,
	},
        {
        title: 'взломал акк игрока',
	color: 'oswald: 3px; color: #ff0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
		"[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
       '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/SIZE][/COLOR]<br><br>' +
            '[CENTER]Поступило обращение от игрока, о взломе его игрового аккаунта. После восстановления доступа к игровому аккаунту, игрок обнаружил, то-что его игровое имущество пропало. <br>После проверки системы логирования, выяснилось, что данная игровая валюта во время взлома была переведена на ваш аккаунт. <br>Не думаю, что это совпадение.?<br>Ваш интернет протокол (IP) абсолютно схож с (IP) взломанного игрока.<br>Игровые аккаунты обжалованию/апелляции не подлежат.<br><br>[COLOR=rgb(255, 255, 0)][SIZE=4]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
        {
        title: 'Наказ. будет снято(24 часа(после взлома))',
	color: 'oswald: 3px; color: #ff0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/SIZE][/COLOR]<br><br>' +
		'[CENTER]Наказание, наложенное на ваш аккаунт, будет отменено в течение 24-ех часов. Это решение принято на основании пересмотра обстоятельств, связанных с вашим аккаунтом. Важно отметить, что отмена наказания не подразумевает, что подобные инциденты не могут произойти в будущем. Напротив, настоятельно рекомендуется проявлять повышенное внимание к мерам безопасности вашего аккаунта.[/CENTER]<br><br>' +
        '[CENTER]Безопасность аккаунта — это комплексная задача. Существует несколько ключевых аспектов, которые следует учитывать. Прежде всего, используйте сложные пароли. Пароли должны содержать буквы, цифры и специальные символы. Это затруднит доступ к вашему аккаунту для злоумышленников. Регулярная смена паролей также является важным шагом.[/CENTER]<br><br>' +
        '[CENTER]Кроме того, включение двухфакторной аутентификации значительно повысит уровень защиты. Этот метод требует дополнительного подтверждения вашей личности, что делает доступ к вашему аккаунту более безопасным. Также стоит быть внимательным к подозрительным ссылкам и уведомлениям. Не переходите по ним, если они вызывают сомнения.<br>Соблюдение этих рекомендаций поможет предотвратить возможные проблемы в будущем. Следите за активностью на вашем аккаунте. Если вы заметили какие-либо необычные действия, немедленно сообщите об этом службе поддержки. Защита вашего аккаунта — это ваша ответственность. Будьте бдительны и внимательны.[/CENTER]<br><br>' +
        '[CENTER][COLOR=rgb(255,0,0)][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]'+
         "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
		prefix: WATCHED_PREFIX,
		status: false,
	},
        {
        title: 'Покупка ив у бота',
	color: 'oswald: 3px; color: #ff0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/SIZE][/COLOR]<br><br>' +
		'[CENTER]На ваш банковский счет поступили денежные средства от Ботовода. Бот – это программа, задачей которой является выполнение определенных функций с целью заработать игровую валюту для последующей продажи. В результате, на ваш счет были зачислены игровые средства.[/CENTER]<br><br>' +
        '[CENTER]Прошло некоторое время, и вы без колебаний решили снять эти средства с банковского счета. Это было ожидаемо, так как вы знали о предстоящем переводе.[/CENTER]<br><br>' +
        '[CENTER]Следует отметить, что в наше время использование ботов для заработка игровой валюты становится все более распространенным явлением. Однако важно помнить, что подобные операции могут повлечь за собой нарушение пункта правил 2.28.[/CENTER]<br><br>' +
        '[CENTER][COLOR=rgb(255,0,0)][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]'+
         "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
		prefix: CLOSE_PREFIX,
		status: false,
	},
  {
	title: 'Рассмотрение рук-вом',
	color: 'oswald: 3px; color: #ff6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Тема взята в работу руководством отдела 51-55 и закреплена, ожидайте ответа в ней.<br>Часто рассмотрение темы может занять определенное время.<br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]Тема закреплена и находится на рассмотрении[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: PIN_PREFIX,
	status: true,
},
        {
        title: 'указал не верную почту',
	color: 'oswald: 3px; color: #ff0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
"[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
       '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/SIZE][/COLOR]<br><br>' +
            '[CENTER]Вы указали некорректную привязанную электронную почту вашего аккаунта. Если вы желаете снять блокировку, постарайтесь вспомнить правильный адрес.<br><br>[COLOR=rgb(255, 255, 0)][SIZE=4]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
        {
        title: 'указал не верный тг',
	color: 'oswald: 3px; color: #ff0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
"[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
       '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/SIZE][/COLOR]<br><br>' +
            '[CENTER]Вы указали неверную привязанную учетную запись телеграм, которая привязана к аккаунту. Если вы желаете снова разблокировать доступ, постарайтесь вспомнить правильные данные.<br><br>[COLOR=rgb(255, 255, 0)][SIZE=4]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
        {
        title: 'указал не верный вк',
	color: 'oswald: 3px; color: #ff0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
"[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
       '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][CENTER]{{ greeting }}, уважаемый {{ user.name }}.[/CENTER][/SIZE][/COLOR]<br><br>' +
            '[CENTER]Вы указали неверную привязанную учетную запись ВКонтакте, которая привязана к аккаунту. Если вы желаете снова разблокировать доступ, постарайтесь вспомнить правильные данные.<br><br>[COLOR=rgb(255, 255, 0)][SIZE=4]Закрыто.[/COLOR]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
{
	title: 'Уточнение',
	color: 'oswald: 3px; color: #FF6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Уточните, пожалуйста, согласны ли вы с выданным наказанием и хотите сократить его либо вовсе снять, или же категорически не согласны и требуете объяснения причин блокировки аккаунта?<br> Оставьте ответ в теме.<br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]Тема закреплена и находится на рассмотрении[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: PIN_PREFIX,
	status: open,
},
{
	title: 'Запрос привязок',
	color: 'oswald: 3px; color: #FF6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]VK ID(цифрами):<br>Telegramm id(цифрами):<br>Email:<br>[HR][/HR]<br>Если какие либо привязки отсутствовать поставьте прочерк.<br>[HR][/HR]<br>Если ваш игровой аккаунт был привязан к Telegram. Узнать его можно здесь: t.me/getmyid_bot<br>VK id : взять его можно через данный сайт: https://regvk.com<br>[HR][/HR]<br>[FONT=times new roman]У вас есть [U][COLOR=rgb(250, 197, 28)]24 часа[/COLOR][/U] что бы дать ответ.<br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]Тема закреплена и находится на рассмотрении.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: PIN_PREFIX,
	status: open,
},
 {
title: 'Отсутствие ответа',
	color: 'oswald: 3px; color: #ff0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/SIZE][/COLOR]<br><br>' +
"[CENTER]По техническим соображениям было принято решение закрыть данное обращение.<br>" +
"[CENTER] Пожалуйста, если данная проблема все ещё актуальна, оставьте новую заявку в данном разделе.<br><br>" +
'[CENTER][COLOR=rgb(255,0,0)][SIZE=4][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER]'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
	prefix: CLOSE_PREFIX,
	status: false,
},
                        {
        title: 'покупка ИВ через трейд',
	color: 'oswald: 3px; color: #ff0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
		"[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
       '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/SIZE][/COLOR]<br><br>' +
            '[CENTER]На ваш счёт с помощью системы трейда поступила игровая валюта от игрока, который продает игровую валюту. До этого момента вы не взаимодействовали; договорились встретиться вне игры, что нельзя подтвердить. Встретились, получили деньги, что является нарушением правил. Никаких обсуждений в игре не было, поэтому можно предположить, что произошла покупка игровой валюты.<br><br>Пункт 2.28<br>[SPOILER]<br>2.28. Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги | PermBan с обнулением аккаунта + ЧС проекта<br>Примечание: любые попытки покупки/продажи, попытки поинтересоваться о ней у другого игрока и прочее - наказуемы.<br>Примечание: также запрещен обмен доната на игровые ценности и наоборот;<br>Пример: пополнение донат счет любого игрока взамен на игровые ценности;<br>Исключение: официальная покупка через сайт.<br>[/SPOILER]<br><br>'+
               '[CENTER][COLOR=rgb(255, 255, 0)][SIZE=4][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
        prefix: CLOSE_PREFIX,
		status: true,
     },
        {
        title: 'Наруш правил при взломе',
	color: 'oswald: 3px; color: #ff0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
         "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
      '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/SIZE][/COLOR]<br><br>' +
        '[CENTER]К сожалению, если вы были жертвой взлома своего аккаунта, что привело к нарушению правил игры, это все равно не освобождает его от ответственности. Правила игры предусматривают наказание за нарушения, даже если они были совершены без ведома владельца аккаунта.[/CENTER]<br><br>'+
        '[CENTER]Наказание за нарушения правил обычно зависит от серьезности нарушения и может варьироваться от временной блокировки аккаунта до перманентной. В любом случае, Вы должны осознавать, что Вы несёте ответственность за безопасность своего аккаунта и должны предпринимать все необходимые меры для его защиты.[/CENTER]<br><br>' +
		'[CENTER]Таким образом, даже если Вы стали жертвой взлома аккаунта, он все равно может быть подвергнут наказанию за нарушение правил игры, если его аккаунт был использован для этого.[/CENTER]<br><br>' +
        '[CENTER][COLOR=rgb(255, 255, 0)][SIZE=4][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]'+
         "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
		prefix: CLOSE_PREFIX,
		status: true,
     },
             {
        title: 'Купил ИВ 2.28 через банк',
	color: 'oswald: 3px; color: #ff0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
         "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/SIZE][/COLOR]<br><br>' +
        '[CENTER]Благодарим вас за обратную связь. Ваше обращение было принято к рассмотрению, и я вынес следующий вердикт.[/CENTER]<br><br>'+
        '[CENTER]Была проведена повторная проверка. В ходе которой было выявлено следующее:<br><br>' +
        '[CENTER]4.01. Создавая игровой аккаунт на нашем проекте, игрок автоматически соглашается со всеми правилами проекта.<br><br>' +
        '[CENTER]Вам на банковский счёт переводились денежные средства от продавцов игровой валют. Ошибки в переводе быть не может, после перевода деньги благополучно снимались. Об ошибочном переводе вы никому не сообщали. Исходя из вышеперечисленного делаю вывод, что вы знали от кого и с какой целью вам переводиться денежные средства. Соответственно вы предполагали тот вариант, что ваш игровой аккаунт может быть заблокированным, но почему-то сослались на некомпетентность технического специалиста или же, что данное действие Вам сойдёт с рук. Мы понимаем, что блокировка аккаунта приносит вам не самые лучшие эмоции, но хочу вам напомнить, что ваш аккаунт был заблокирован из-за ваших отрицательных действий, которые в дальнейшем могли испортить экономику сервера. <br><br>' +
        '[CENTER]Пытаться обмануть техническую администрацию аналогично нету смысла, с данными игроками вы никогда не взаимодействовали и взаимодействовать не могли. Ваши действия противоречат основным принципам нашей игры, созданной для увлекательного и справедливого игрового опыта всех пользователей, которые присоединяются к нашему проекту чтобы получить незабываемые впечатления от игры.<br><br>' +
        '[CENTER]На основании имеющейся информации, решение технического специалиста признано корректным. Нарушений с его стороны нету. Доказательства на каждое слово и действие имеются. С учетом этого, решение технического специалиста выглядит обоснованным и справедливым, ссылаясь на правила проекта и попутно отвечая на Ваши вопросы.<br><br>' +
        '[CENTER]Наша задача - обеспечить честную и справедливую среду для всех пользователей, и нарушение правил в отношении игровой валюты может нанести вред игровой экономике и репутации проекта.<br><br>' +
        '[CENTER]Вы совершили грубейшее нарушение правил проекта, за что понесли заслуженное наказание от технических специалистов. Технический специалист действовал согласно должностным инструкциям, придерживаясь правила 2.28. Это правило имеет крайне серьезное значение, и мы призываем каждого участника соблюдать его безукоризненно. <br><br>' +
        '[CENTER]Мы также хотим вас проинформировать, что на данный момент обжалование по этому пункту правил отклонено. Важно понимать, что данный пункт не подлежит обжалованию, и каждый участник должен принять его как часть ответственности за свои действия.<br><br>' +
        '[CENTER]Для создания положительной и уважительной игровой атмосферы призываем каждого из вас проявлять сознательность и уважение к правилам. Вместе мы строим прекрасное и дружелюбное сообщество, которое уважает всех и каждого.<br><br>' +
        '[CENTER]С учетом всего сказанного, давайте будем бдительны и помнить, что соблюдение правил - это залог успешной и приятной игры для всех.<br><br>' +
        '[CENTER]Технический специалист действовал согласно должностным инструкциям, вердикт и наказание верны. В независимости от того, хотели Вы купить-продать или просто поинтересоваться, наказание предусмотрено по пункту 2.28 правил, Выше приложил описание. Любые шутки на тему покупки/продажи игровой валюты также наказуемы.<br><br>' +
        '[CENTER]Помните, что ваше поведение в игре оказывает влияние на ее общую атмосферу и удовлетворение всех игроков.<br><br>' +
        '[CENTER][COLOR=rgb(255, 255, 0)][SIZE=4][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/FONT][/SIZE]'+
         "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
                 prefix: CLOSE_PREFIX,
        status: true,
    },
{
	title: 'ФОРМА',
	color: 'oswald: 3px; color: #ff0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Ваша тема создана не по форме.<br>Пересоздайте тему и заполните форму, как указано ниже:<br><br> Название темы с NickName технического специалиста<br>Пример:<br> Lev_Kalashnikov | махинации<br>Форма заполнения темы:<br>[code]01. Ваш игровой никнейм:<br>02. Игровой никнейм технического специалиста:<br>03. Сервер, на котором Вы играете:<br>04. Описание ситуации (описать максимально подробно и раскрыто):<br>05. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>06. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/code]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'выдано верно',
	color: 'oswald: 3px; color: #FF0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px]Читайте внимательно ответ предоставленный ниже!<br>Проверив информацию через специальный сайт и проконсультировавшись с коллегами, было принято решение, что наказание выдано верно и не будет снято.<br>Искренне надеемся на ваше стремление к исправлению.[/SIZE][/FONT][/COLOR][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'наказание по ошибке',
	color: 'oswald: 3px; color: #FF6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]После проведения дополнительной тщательной проверки информации, осуществленной с использованием специализированного сайта, было принято решение о снятии вашего наказания. Наказание будет аннулировано в игре в течение 1 часа после ответа в данной теме.<br>Приносим свои извинения за предоставленные неудобства.<br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)] Рассмотрено, закрыто. [/COLOR][/CENTER][/FONT][/SIZE]',
  prefix: WATCHED_PREFIX,
	status: false
},
    {
        title: 'В ОБЖ отказано',
	color: 'oswald: 3px; color: #FF0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
      '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/SIZE][/COLOR]<br><br>' +
        '[CENTER]Это радует, что вы осознали свои ошибки!<br>На данный момент обжалование отказано. Важно понимать, что каждый игрок должен принять его как часть ответственности за свои действия.<br>Надеюсь, что данная ситуация станет для вас уроком и в будущем, вы больше не будете нарушать правила проекта.[/CENTER]<br>' +
        '[CENTER]Рекомендую вам ознакомиться с [URL= https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/][COLOR=rgb(255,207,64)]правилами проекта[/COLOR].[/URL], чтобы такого больше не повторилось. Мы очень надеемся, что данная ситуация станет для вас уроком. Можете попробовать оформить еще одно обжалование, но малость позже.[/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(255,0,0)][SIZE=4][ICODE]В обжаловании отказано.[/ICODE][/COLOR][/FONT][/CENTER]'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
     {
        title: 'Не подлежит обж',
	color: 'oswald: 3px; color: #FF0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
         "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/SIZE][/COLOR]<br><br>' +
		"[CENTER]Ваш аккаунт заблокирован за очень грубое нарушение общих правил. В соответствии с правилами проекта, аккаунт, на котором были совершенны действия соответствующие причине, не подлежит разблокировке или обжалованию.<br> Это окончательное решение, принятое на основании действующих правил проекта.<br><br>" +
        '[CENTER][COLOR=rgb(255,0,0)][SIZE=4][ICODE]В обжаловании отказано.[/ICODE][/COLOR][/FONT][/CENTER]'+
         "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]",
		prefix: CLOSE_PREFIX,
		status: false,
	},
     {
        title: 'В ОБЖ одобрено',
	color: 'oswald: 3px; color: #FF0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
       '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/SIZE][/COLOR]<br><br>' +
        '[CENTER]Мы рассмотрели ваше обжалование, и пришли к вердикту, что срок блокировки аккаунта будет будет сокращён.[/CENTER]<br>' +
        '[CENTER]Рекомендуем вам ознакомиться с [URL= https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/#post-25703465][COLOR=rgb(255,207,64)]правилами проекта[/COLOR][/URL], чтобы такого больше не повторилось. Мы очень надеемся, что данная ситуация станет для вас уроком.[/CENTER]<br>' +
        '[CENTER]К сожалению, мы не всегда сможем пойти к вам на встречу и обжаловать/амнистировать вас.[/FONT][/CENTER]<br><br>' +
        '[CENTER][COLOR=rgb(52,201,36)][SIZE=4][ICODE]Рассмотрено.[/ICODE][/COLOR][/CENTER][/SIZE]<br>',
		prefix: WATCHED_PREFIX,
		status: false,
    },
{
	title: 'Взломали и украли имущество',
	color: 'oswald: 3px; color: #FF6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Ваш аккаунт будет заблокирован в связи с его взломом. Аккаунт игрока, на которого перешли ваши средства, будет блокирован из-за манипуляций (махинаций).<br> Если желаете выйти из блокировки, создайте повторную тему в разделе Жалобы на технических специалистов. <br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]Рассмотрено.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: WATCHED_PREFIX,
	status: true,
},
{
	title: 'Взломали',
	color: 'oswald: 3px; color: #FF6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Аккаунт будет заблокирован по причине взлома.<br>Если желаете выйти из блокировки, создайте повторную тему в разделе Жалобы на технических специалистов. <br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]Рассмотрено.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: WATCHED_PREFIX,
	status: false,
},
    {
		title: 'Срок блокировки будет снижен',
	color: 'oswald: 3px; color: #FF6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/SIZE][/COLOR]<br><br>' +
		"[CENTER]Проверив вашу историю наказаний, было принято решение о снижении срока блокировки аккаунта.<br>Будьте аккуратнее в следующие разы, ведь на встречу пойти мы вряд-ли сможем.<br><br>" +
		'[CENTER][COLOR=rgb(255,0,0)][SIZE=4][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER]'+
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br><br>",
		prefix: CLOSE_PREFIX,
		status: false,
	},
{
	title: 'доки в соц. сетях',
	color: 'oswald: 3px; color: #ff0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Загрузите доказательства на любой разрешенный фото/видео хостиг. (Imgug, yapix , google photo). Доказательства не принимаются в социальных сетях.<br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
  title: 'доки на запрещенном фотохостинге',
	color: 'oswald: 3px; color: #ff0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Загрузите доказательства на разрешенный фото/видео хостинг. Данный работает в ограниченном режиме либо вообще не работает на территории России.<br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
	 prefix: CLOSE_PREFIX,
   status: false,
},
  {
	title: 'Рассмотрение техом',
	color: 'oswald: 3px; color: #ff6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Тема взята в работу и закреплена, ожидайте ответа в ней от нашего технического специалиста.<br>Часто рассмотрение темы может занять определенное время.<br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]Тема закреплена и находится на рассмотрении.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: TECHADM_PREFIX,
	status: true,
},
{
	title: 'Передача куратору',
	color: 'oswald: 3px; color: #FF6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Ваша тема закреплена и ожидает вердикта <u> Куратора Технических Специалистов</u>.<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]<u>Создавать подобные темы не нужно</u>.<br>[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: PIN_PREFIX,
	status: true,
},
{
	title: 'Нет окна блокировки',
	color: 'oswald: 3px; color: #FF0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Без окна о блокировке тема не подлежит рассмотрению - создайте новую тему, приложив окно блокировки с фото-хостинга<br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL]<br>(все кликабетильно).<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][CENTER][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
    {
	title: 'Дубликат',
	color: 'oswald: 3px; color: #FF0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER] [COLOR=rgb(209, 213, 216)]Эта тема является копией вашей предыдущей темы. Пожалуйста, не создавайте похожие или одинаковые темы, иначе [COLOR=rgb(255, 255, 255)] Ваш аккаунт на форуме может быть заблокирован.[/COLOR]<br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)] Закрыто. [/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
    {
        title: 'Работа с техом',
	color: 'oswald: 3px; color: #FF6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
        '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/SIZE][/COLOR]<br><br>' +
        '[CENTER]С техническим специалистом будет проведена необходимая работа.[/CENTER]<br>'+
        '[CENTER]Приносим свои извинения за предоставленные неудобства.[/CENTER]<br>' +
		'[CENTER][COLOR=rgb(52,201,36)][SIZE=4][ICODE]Рассмотрено.[/ICODE][/COLOR][/FONT][/CENTER][/SIZE]<br>'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
		prefix: WATCHED_PREFIX,
		status: false,
     },
{
	title: 'Правила раздела',
	color: 'oswald: 3px; color: #FF0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела в котором Вы создали тему, так как Ваш запрос не относится к жалобам на технических специалистов.<br>Что принимается в данном разделе:<br>Жалобы на технических специалистов, оформленные по форме подачи и не нарушающие правила подачи:<br> [FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Правила подачи жалобы на технических специалистов[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[QUOTE][FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01.[/COLOR] Ваш игровой никнейм:[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]<br>02.[/COLOR] Игровой никнейм технического специалиста:[COLOR=rgb(226, 80, 65)]<br>03.[/COLOR] Сервер, на котором Вы играете:[COLOR=rgb(226, 80, 65)]<br>04.[/COLOR] Описание ситуации (описать максимально подробно и раскрыто):[COLOR=rgb(226, 80, 65)]<br>05.[/COLOR] Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):[COLOR=rgb(226, 80, 65)]<br>06.[/COLOR] Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/SIZE][/FONT][/SIZE][/QUOTE]<br><br>[FONT=verdana][SIZE=4][FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]Примечание:[/COLOR] все оставленные заявки обращения в данный раздел обязательно должны быть составлены по шаблону предоставленному немного выше.<br>В ином случае, заявки обращения в данный раздел составленные не по форме — будут отклоняться.<br>Касательно названия заголовка темы — четких правил нет, но, желательно чтобы оно содержало лишь никнейм и сервер технического специалиста.<br>Заранее, настоятельно рекомендуем ознакомиться [U][B][URL='https://forum.blackrussia.online/index.php?forums/faq.231/']с данным разделом[/URL][/B][/U][/SIZE][/FONT][/SIZE][/FONT]<br>[CENTER][FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Какие жалобы не проверяются?[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]—[/COLOR] Если в содержании темы присутствует оффтоп/оскорбления.<br>[SIZE=4][COLOR=rgb(226, 80, 65)]—[/COLOR] Если в заголовке темы отсутствует никнейм технического специалиста.<br>[COLOR=rgb(226, 80, 65)]—[/COLOR] С момента выдачи наказания прошло более 7 дней.[/SIZE][/SIZE][/FONT]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Отказано.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
	{
        title: 'Бан по IP',
	color: 'oswald: 3px; color: #FF0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/SIZE][/COLOR]<br><br>' +
        '[CENTER]Вы попали на заблокированный айпи адрес. Ваш аккаунт не находится в блокировке. Переживать не стоит. Причиной попадания в данную ситуацию могло быть разное, например, смена мобильного интернета, переезд и тому подобное. Чтобы избежать данную ситуацию, вам необходимо перезагрузить телефон или воспользоваться услугами VPN. Приносим свои извинения за доставленные неудобства. [/CENTER]<br>'+
        '[CENTER]Желаем приятного времяпровождения на нашем проекте.[/CENTER]<br>'+
        '[CENTER][COLOR=rgb(52,201,36)][SIZE=4][ICODE]Рассмотрено.[/ICODE][/COLOR][/FONT][/CENTER][/SIZE]<br>'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
        prefix: WATCHED_PREFIX,
        status: false,
    },
	{
        title: 'Продажа ив через банк',
	color: 'oswald: 3px; color: #FF0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/SIZE][/COLOR]<br><br>' +
        '[CENTER] [/CENTER]Вы осуществляли передачу игровой валюты через банковскую систему игрокам, с которыми ранее не имели никаких взаимодействий в игре.<br>Мы понимаем, что вам сложно принять данное обстоятельство, и возможно у вас были на тог веские причины, однако это не освобождает вас от необходимости соблюдать правила проекта. Вы нарушили их, и за это последовало наказание. Надеемся, что в будущем вы сможете исправиться и не будете допускать подобных опрометчивых ошибок.<br>'+
        '[CENTER][/CENTER]Кроме того, вы будете внесены в общий черный список проекта без возможности восстановления.<br>[SPOILER="ОЧСП"]ЧС проекта – черный список, предназначенный для игроков, которым ограничен доступ ко всем ресурсам проекта, за исключением доступа к форуму, официальным Discord - серверам, а также к официальным сообществам ВКонтакте.[/SPOILER]<br>'+
        '[CENTER][COLOR=rgb(52,201,36)][SIZE=4][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/SIZE]<br>'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
        prefix: CLOSE_PREFIX,
        status: false,
    },
	{
        title: 'Продажа ив через трейд',
	color: 'oswald: 3px; color: #FF0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/SIZE][/COLOR]<br><br>' +
        '[CENTER] [/CENTER]Вы осуществляли передачу игровой валюты через систему трейдов игрокам, с которыми ранее не имели никаких взаимодействий в игре.<br>Мы понимаем, что вам сложно принять данное обстоятельство, и возможно у вас были на тог веские причины, однако это не освобождает вас от необходимости соблюдать правила проекта. Вы нарушили их, и за это последовало наказание. Надеемся, что в будущем вы сможете исправиться и не будете допускать подобных опрометчивых ошибок.<br>'+
        '[CENTER][/CENTER]Кроме того, вы будете внесены в общий черный список проекта без возможности восстановления.<br>[SPOILER="ОЧСП"]ЧС проекта – черный список, предназначенный для игроков, которым ограничен доступ ко всем ресурсам проекта, за исключением доступа к форуму, официальным Discord - серверам, а также к официальным сообществам ВКонтакте.[/SPOILER]<br>'+
        '[CENTER][COLOR=rgb(52,201,36)][SIZE=4][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER][/SIZE]<br>'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
        prefix: CLOSE_PREFIX,
        status: false,
    },
{
	title: 'Срок подачи жб',
	color: 'oswald: 3px; color: #FF0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px]С момента вынесения наказания техническим специалистом [COLOR=rgb(255, 255, 255)] прошло более 14 дней.[/COLOR]<br>В настоящее время изменить меру наказания невозможно. Однако Вы можете попробовать написать заявление на обжалование через определенный период времени.<br><br>Обращаем Ваше внимание, что некоторые наказания не подлежат обжалованию или амнистии. Детальнее ознакомиться с критериями можно здесь: [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B0%D1%80%D1%83%D1%88%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BF%D1%80%D0%B8-%D0%B2%D1%8B%D0%B4%D0%B0%D1%87%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BE%D1%82-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B3%D0%BE-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%B0.7552345/']нажмите[/URL]([/SIZE][/FONT][/COLOR][/CENTER]<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Восст.доступа к аккаунту',
	color: 'oswald: 3px; color: #FF6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Если Вы обезопасили Ваш аккаунт и [U]привязали его к странице во ВКонтакте[/U], то сбросить пароль или пин-код Вы всегда сможете обратившись в официальное сообщество проекта - https://vk.com/blackrussia.online.<br> Либо в телеграмм бот - https://t.me/br_helper_bot.<br> Напишите «Начать» в личные сообщения группы/бота, затем выберите нужные Вам функции.<br><br>" +
	"[CENTER][FONT=times new roman]Подробнее в данной теме - [URL='https://forum.blackrussia.online/index.php?threads/lime-Защита-игрового-аккаунта.1201253/']клик[/URL][/center]<br><br>" +
	"[CENTER]Если Вы обезопасили Ваш аккаунт и [U]привязали его к почте[/U], то сбросить пароль или пин-код Вы всегда сможете при вводе пароля на сервере. После подключения к серверу нажмите на кнопку «Войти в аккаунт», затем выберите кнопку «Восстановить пароль», после чего на Вашу почту будет отправлено письмо с одноразовым кодом восстановления.<br><br>" +
	"[CENTER]Если Вы [U]не обезопасили свой аккаунт - его невозможно вернуть[/U] Игрок самостоятельно несет отвественность за безопаность своего аккаунта.<br><br>" +
	'[CENTER]К сожалению, иногда решение подобных вопросов требует много времени. Надеемся, что Вы сможете восстановить доступ к аккаунту!<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[center][COLOR=rgb(127, 255, 0)]Рассмотрено.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: WATCHED_PREFIX,
	status: false,
},
    {
        title: 'Продан/Передан 2.41',
	color: 'oswald: 3px; color: #FF0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
       '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/SIZE][/COLOR]<br><br>' +
        '[CENTER]Технический специалист предоставил доказательства вашего нарушения. После проверки доказательств было принято решение, что наказание, выданное техническим специалистом, является верным.[/CENTER]<br>'+
        '[CENTER]Вы нарушили правило пункта 2.41 общих правил проекта. [SPOILER="2.41"][COLOR=rgb(255, 0, 0)]2.41. [/COLOR]Передача своего личного игрового аккаунта третьим лицам | [COLOR=rgb(255, 0, 0)]PermBan[/COLOR][/SPOILER][/CENTER] <br>' +
        '[CENTER][COLOR=rgb(255,0,0)][SIZE=4][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER]'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
        prefix: CLOSE_PREFIX,
        status: false,
    },

    {
        title: 'Трансфер 4.05',
	color: 'oswald: 3px; color: #FF0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/SIZE][/COLOR]<br><br>' +
        '[CENTER]Технический специалист предоставил доказательства вашего нарушения. После проверки доказательств было принято решение, что наказание, выданное техническим специалистом, является верным.[/CENTER]<br>'+
        '[CENTER]Вы нарушили правило пункта 4.05 общих правил проекта.[SPOILER="4.05"][COLOR=rgb(255, 0, 0)]4.05.[/COLOR] Запрещено передавать любые игровые ценности между игровыми аккаунтами, а также в целях удержания имущества | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan[/COLOR][/SPOILER][/CENTER] <br>' +
        '[CENTER][COLOR=rgb(255,0,0)][SIZE=4][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {

        title: 'Чужая привязка на акке',
	color: 'oswald: 3px; color: #FF6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
       '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/SIZE][/COLOR]<br><br>' +
        '[CENTER]К сожалению, обнаружена чужая привязка к вашему аккаунту, что может представлять угрозу для безопасности данных. В данной ситуации нам, к сожалению, не удастся разблокировать ваш аккаунт. Для обеспечения безопасности рекомендуется создать новый аккаунт и принять все возможные меры по защите данных. Наша команда технических специалистов настоятельно рекомендует вам установить дополнительные меры безопасности, такие как двухфакторную аутентификацию, сложные пароли и регулярное обновление паролей. [/CENTER] <br>' +
        '[CENTER]Пожалуйста, будьте внимательны при создании нового аккаунта и храните данные доступа в надежном месте. Мы приносим извинения за возможные неудобства, связанные с этой ситуацией, и стараемся обеспечить безопасность всех наших пользователей [/CENTER]<br><br>' +
        '[CENTER][COLOR=rgb(255,0,0)][SIZE=4][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER]'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
{
	title: 'Правила восстановления',
	color: 'oswald: 3px; color: #FF0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Пожалуйста, убедительная просьба, ознакомьтесь с правилами восстановлений - [URL='https://forum.blackrussia.online/index.php?threads/В-каких-случаях-мы-не-восстанавливаем-игровое-имущество.25277/']клик[/URL]<br> Вы создали тему, которая не относится к технической проблеме.[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Отказано.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
    title: 'Донат',
	color: 'oswald: 3px; color: #FF6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
    '[CENTER]Система построена таким образом, что деньги не спишутся, пока наша платформа не уведомит платежную систему о зачислении BLACK COINS. Для проверки зачисления BLACK COINS необходимо ввести в игре команду: /donat.<br>' +
    '[CENTER]В остальных же случаях, если не были зачислены BLACK COINS — вероятнее всего, была допущена ошибка при вводе реквизитов. <br>В данном случае мы не восстанавливаем денежные средства согласно нашей политике оферты - "[URL="https://blackrussia.online/oferta.php"]клик[/URL] <br>' +
    '[CENTER]Если Вы считаете, что ошибки быть не может и с момента оплаты не прошло более 24-х часов, то в обязательном порядке обратитесь в данное сообщество для дальнейшего решения: https://vk.com/br_tech.<br>' +
    '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Решено.[/CENTER][/FONT][/SIZE]',
    prefix: DECIDED_PREFIX,
    status: false,
},
    {
	  title: 'Не работают док-ва',
	color: 'oswald: 3px; color: #FF0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url].<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B].<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваши доказательства не рабочие или же битая ссылка, пожалуйста загрузите свои доказательства на YouTube, Yapix, Imgur или любой другой фото/видео хостинг.<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Док-ва отредактированы',
	color: 'oswald: 3px; color: #FF0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url].<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]Доброго времени суток, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B].<br><br>"+
		"[B][CENTER][COLOR=lavender] Представленные доказательства были отредактированы, обрезаны или в плохом качестве, пожалуйста прикрепите оригинал.<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано. Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
{
	title: 'Имущество восстановлено',
	color: 'oswald: 3px; color: #FF6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Ваше игровое имущество/денежные средства будут восстановлены в течение двух недель. <br>Убедительная просьба, <b><u>не менять никнейм до момента восстановления</u></b>.<br>" +
	'[CENTER]Для активации восстановления используйте команды:[COLOR=rgb(255, 213, 51)]/roulette[/COLOR], [COLOR=rgb(255, 213, 51)]/recovery[/COLOR][/CENTER]<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(127, 255, 0)]Решено.[/COLOR][/CENTER][/FONT][/SIZE]',
	status: false,
	prefix: DECIDED_PREFIX,
},
{
	title: 'НЕ ОТНОСИТСЯ',
	color: 'oswald: 3px; color: #FF0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Ваше обращение не относится к жалобам на технических специалистов.<br> Пожалуйста ознакомьтесь с праивилами данного раздела: [URL='https://forum.blackrussia.online/forums/Информация-для-игроков.231/']клик[/URL] <br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Отказано.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Игрок будет заблокирован(Жб игроков)',
	color: 'oswald: 3px; color: #FF6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER][SIZE=4][FONT=times new roman]После проверки доказательств и системы логирования вердикт:<br><br>[COLOR=rgb(65, 168, 95)][FONT=verdana]Игрок будет заблокирован[/COLOR][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER][SIZE=4][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]",
},
{
	title: 'Игрок не будет заблокирован(Жб игроков)',
	color: 'oswald: 3px; color: #FF0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER][SIZE=4][FONT=times new roman]После проверки доказательств и системы логирования вердикт:<br><br>[COLOR=rgb(255, 0, 0)]Доказательств недостаточно для блокировки игрока[/COLOR][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER][SIZE=4][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]",
},
	{
	title: 'ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ ᅠ  Для ответов в тех разделеᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠᅠ ᅠ',
	color: 'oswald: 3px; color: #00ff00; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: 3px solid #00ff00; width: 96%',
	},
{
	title: 'ФОРМА',
	color: 'oswald: 3px; color: #ff0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Пожалуйста, заполните форму, создав новую тему: <br>[CODE]01. Ваш игровой никнейм:<br>02. Сервер, на котором Вы играете:<br>03. Суть Вашей возникшей проблемы (описать максимально подробно и раскрыто): <br>04. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>05. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/CODE]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Отказано.[/COLOR][/CENTER][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Ошибся разделом жб на техов',
	color: 'oswald: 3px; color: #ff0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; width: 43%',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER] Вы ошиблись разделом при создании темы. Вам следует обратится в раздел жалоб на технических специалистов. <br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]Закрыто. Тему повторно создавать в этом разделе не нужно.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Нет скринов/видео',
	color: 'oswald: 3px; color: #FF0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Без доказательств (в частности скриншоты или видео) – решить проблему не получится. Если доказательства найдутся - создайте новую тему, приложив доказательства с фото-хостинга<br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL]<br>(все кликабельно).<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'offtop тех раздел',
	color: 'oswald: 3px; color: #FF0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела в котором Вы создали тему, так как Ваш запрос не относится к технической проблеме.<br>Что принимается в тех разделе:<br>Если возникли технические проблемы, которые так или иначе связаны с игровым модом<br>Форма заполнения:<br>[QUOTE]<br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01.[/COLOR] Ваш игровой никнейм:<br>[COLOR=rgb(226, 80, 65)]02.[/COLOR] Сервер, на котором Вы играете:<br>[COLOR=rgb(226, 80, 65)]03.[/COLOR] Суть возникшей проблемы (описать максимально подробно и раскрыто):<br>[COLOR=rgb(226, 80, 65)]04.[/COLOR] Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>[COLOR=rgb(226, 80, 65)]05.[/COLOR] Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/SIZE][/FONT][/QUOTE]<br>[/CENTER]<br><br>[CENTER][FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Если возникли технические проблемы, которые так или иначе связаны с вылетами из игры и любыми другими проблемами клиента[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[QUOTE]<br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01. [/COLOR]Ваш игровой ник:<br>[COLOR=rgb(226, 80, 65)]02. [/COLOR]Сервер:<br>[COLOR=rgb(226, 80, 65)]03.[/COLOR] Тип проблемы: Обрыв соединения | Проблема с ReCAPTCHA | Краш игры (закрытие игры) | Другое [Выбрать один вариант ответа]<br>[COLOR=rgb(226, 80, 65)]04. [/COLOR]Действия, которые привели к этому (при вылетах, по возможности предоставлять место сбоя):<br>[COLOR=rgb(226, 80, 65)]05.[/COLOR] Как часто данная проблема:<br>[COLOR=rgb(226, 80, 65)]06.[/COLOR] Полное название мобильного телефона:<br>[COLOR=rgb(226, 80, 65)]07.[/COLOR] Версия Android:<br>[COLOR=rgb(226, 80, 65)]08. [/COLOR]Дата и время (по МСК):<br>[COLOR=rgb(226, 80, 65)]09. [/COLOR]Связь с Вами по Telegram/VK:[/SIZE][/FONT][/QUOTE]" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Отказано.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Доп.Информация',
	color: 'oswald: 3px; color: #FF6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][SIZE=5][FONT=times new roman]Для дальнейшего рассмотрения темы, предоставьте:<br><BR>[QUOTE]1. Скриншоты или видео, подтверждающие факт владения этим имуществом.<BR>2. Все детали пропажи: дата, время, после каких действий имущество пропало.<BR>3. Информация о том, как вы изначально получили это имущество:<BR>дата покупки<br>способ приобретения (у игрока, в магазине или через донат;<br>фрапс покупки (если есть);<br>никнейм игрока, у которого было приобретено имущество, если покупка была сделана не в магазине.[/QUOTE]<BR>[/CENTER]'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]Тема закреплена и находится на рассмотрении.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: PIN_PREFIX,
	status: true,
},
{
	title: "Проблемы с Кешом",
	color: 'oswald: 3px; color: #FF6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[center]Если вы столкнулись с проблемой загрузки страниц форума, пожалуйста, выполните следующие действия:<br><br>• Откройте "Настройки".<br>• Найдите во вкладке "Приложения" свой браузер, через который вы пользуетесь нашим сайтом форума.<br>• Нажмите на браузер, после чего внизу выберите "Очистить" -> "Очистить Кэш".<br><br>После следуйте данным инструкциям:<br>• Перейдите в настройки браузера.<br>• Выберите "Конфиденциальность и безопасность" -> "Очистить историю".<br>• В основных и дополнительных настройках поставьте галочку в пункте "Файлы cookie и данные сайтов".<br>После этого нажмите "Удалить данные".<br><br>Ниже прилагаем видео-инструкции описанного процесса для разных браузеров:<br>Для браузера CHROME: https://youtu.be/FaGp2rRru9s<br>Для браузера OPERA: https://youtube.com/shorts/eJOxkc3Br6A?feature=share'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
 	title: 'Кик за ПО',
	color: 'oswald: 3px; color: #FF6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
 	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
 	'[CENTER]Уважаемый игрок, если вы были отключены от сервера Античитом<br><br>[COLOR=rgb(255, 0, 0)]Пример[/COLOR]:<br><br> [IMG]https://i.ibb.co/FXXrcVS/image.png[/IMG],<br>пожалуйста, обратите внимания на значения PacketLoss и Ping.<br><br>PacketLoss - минимальное значение 0.000000, максимальное 1.000000. При показателе, выше нуля, это означает, что у вас происходит задержка/потеря передаваемых пакетов информации на сервер. Это означает, что ваш интернет не передает достаточное количество данных из вашего устройства на наш сервер, в следствие чего система отключает вас от игрового процесса.<br><br>Ping - Чем меньше значение в данном пункте, тем быстрее передаются данные на сервер, и наоборот. Если значение выше 100, вы можете наблюдать отставания в игровом процессе из-за нестабильности интернет-соединения.<br><br>Если вы не заметили проблем в данных пунктах, скорее всего - у вас произошел скачек пинга при выполнении действия в игре, в таком случае, античит также отключает игрока из-за подозрения в использовании посторонних программ.<br><br>Решение данной проблемы: постарайтесь стабилизировать ваше интернет-соединение, при необходимости - сообщите о проблемах своему провайдеру (поставщику услуг интернета).<br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
 	prefix: CLOSE_PREFIX,
 	status: false,
},
{
	title: 'Для ошибок во время ОБТ на IOS',
	color: 'oswald: 3px; color: #FF6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Если вы нашли какую-либо ошибку во время Открытого Бэта Тестирования на IOS то сделайте следующие действия.<br><br>1. Отправьте пожалуйста найденную недоработку в данную форму - [URL="https://forms.gle/4adcNvKisfKF59Fi8"]клик[/URL]<br>2. Передайте данную форму своим друзьям, для ускорения процесса по сбору багов для их исправления.<br><br>Спасибо за ваш вклад в развитие игры!<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Законопослушность',
	color: 'oswald: 3px; color: #FF6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]К сожалению, администрация, технические специалисты и другие должностные лица BLACK RUSSIA не могут повлиять на законопослушность вашего аккаунта.<br>Повысить законопослушность можно тремя способами:<BR><BR>1. Каждый PayDay (00 минут каждого часа) вам начисляется одно очко законопослушности(Если только у вас нету PLATINUM VIP-статуса), если за прошедший час вы отыграли не менее 20 минут.<br>2. Приобрести законопослушность в /donate.<BR>3.На работе "Электрика"(доступна с 12 Игрового Уровня), для этого нужно починить 5 фонарей и тогда вам дадут 5 законопослушности.<br><br>[/CENTER]'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Отказано.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: "Баг со штрафами",
	color: 'oswald: 3px; color: #FF6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[center]У вас произошла ошибка со штрафами, для её исправления вам нужно совершить проезд на красный свет, переехать через сплошную и оплатить все штрафы в банке.<br>Тогда данный баг пропадет, Команде Проекта известно о данной недоработке и активно ведется иправление.<br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
		title: 'Отвязка привязок',
	color: 'oswald: 3px; color: #FF6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
		'[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/SIZE][/COLOR]<br><br>' +
		"[CENTER]Удалить установленные на аккаунт привязки не представляется возможным. В том случае, если на Ваш игровой аккаунт были установлены привязки взломщиком — он будет перманентно заблокирован с причиной «Чужая привязка». В данном случае дальнейшая разблокировка игрового аккаунта невозможна во избежание повторных случаев взлома — наша команда не может быть уверена в том, что злоумышленник не воспользуется установленной им привязкой в своих целях. <br><br>" +
		'[CENTER][COLOR=rgb(255,0,0)][SIZE=4][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER]'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
		prefix: CLOSE_PREFIX,
		status: false,
	},
{
	title: 'Команде проекта',
	color: 'oswald: 3px; color: #FF6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Ваша тема закреплена и находится на рассмотрении у команды проекта. Пожалуйста, ожидайте выноса вердикта разработчиков."+
	"[CENTER]Создавать новые темы с данной проблемой — не нужно, ожидайте ответа в данной теме. Если проблема решится - Вы всегда можете оставить своё сообщение в этой теме.<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>',
	prefix: COMMAND_PREFIX,
	status: true,
},
{
	title: 'Известно КП',
	color: 'oswald: 3px; color: #FF6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Команде проекта уже известно о данной проблеме, она обязательно будет рассмотрена и исправлена. Спасибо за Ваше обращение!<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'пропали все темы из раздела Жалобы',
	color: 'oswald: 3px; color: #FF6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Раздел "Жалобы" переведен в приватный режим, а именно:<br>Тему созданную пользователем пожет видеть <b>он сам</b> и <b>Администрация сервера</b>.<br>Ознакомиться с формой подачи тем в тот или иной раздел можно по данной ссылке: [URL="https://forum.blackrussia.online/index.php?forums/Правила-подачи-жалоб.202/"]клик[/URL]<br>Приятного времяпрепровождения на нашем форуме<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Не является багом',
	color: 'oswald: 3px; color: #FF0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Проблема с которой вы столкнулись не является багом, ошибкой сервера.<br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 0, 0)]Закрыто/[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'В раздел Госс Организаций.',
	color: 'oswald: 3px; color: #FF0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Ваша тема не относится к техническому разделу, пожалуйста оставьте ваше заявление в соответствующем разделе Государственных Организаций вашего сервера.[/CENTER]<br><br>'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'В раздел Криминальных Организаций',
	color: 'oswald: 3px; color: #FF0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Ваша тема не относится к техническому разделу, пожалуйста оставьте ваше заявление в соответствующем разделе Криминальных Организаций вашего сервера [/CENTER]'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Жб на лидеров',
	color: 'oswald: 3px; color: #FF0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Данная тема не относится к техническому разделу.<br>Данное нарушение было совершено Лидером или его Заместителем и нарушает правила сервера, пожалуйста обратитесь в <br>'Жалобы на Лидеров'<br>Вашего сервера.<br>Форма подачи жалобы - [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.3429391/']тык[/URL]" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Сервер не отвечает',
	color: 'oswald: 3px; color: #FF6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
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

	'[CENTER]📹 Включение продемонстрировано на видео: https://youtu.be/Wft0j69b9dk<br>'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
    title: 'Донат',
	color: 'oswald: 3px; color: #FF6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
    '[CENTER]Система построена таким образом, что деньги не спишутся, пока наша платформа не уведомит платежную систему о зачислении BLACK COINS. Для проверки зачисления BLACK COINS необходимо ввести в игре команду: /donat.<br>' +
    '[CENTER]В остальных же случаях, если не были зачислены BLACK COINS — вероятнее всего, была допущена ошибка при вводе реквизитов. <br>В данном случае мы не восстанавливаем денежные средства согласно нашей политике оферты - "[URL="https://blackrussia.online/oferta.php"]клик[/URL] <br>' +
    '[CENTER]Если Вы считаете, что ошибки быть не может и с момента оплаты не прошло более 24-х часов, то в обязательном порядке обратитесь в данное сообщество для дальнейшего решения: https://vk.com/br_tech.<br>' +
    '[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Решено[/CENTER][/FONT][/SIZE]',
    prefix: DECIDED_PREFIX,
    status: false,
},
{
	title: 'Слетел аккаунт',
	color: 'oswald: 3px; color: #FF6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Аккаунт не может пропасть или аннулироваться просто так. Даже если Вы меняете ник, используете кнопки «починить игру» или «сброс настроек» - Ваш аккаунт не удаляется. Система работает иначе.<br><br>" +
	"[CENTER]Проверьте ввод своих данных: пароль, никнейм и сервер. Зачастую игроки просто забывают ввести актуальные данные и считают, что их аккаунт был удален. Будьте внимательны!" +
	'[CENTER]Как ввести никнейм (на случай, если сменили в игре, но не поменяли в клиенте): https://youtu.be/c8rhVwkoFaU [/CENTER] <br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Рассмотрено[/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Будет исправленно',
	color: 'oswald: 3px; color: #FF6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Данная недоработка будет проверена и исправлена.<br> Спасибо, ценим Ваш вклад в развите проекта.<br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Рассмотрено[/CENTER][/FONT][/SIZE]',
	prefix: WATCHED_PREFIX,
	status: false,
},
{
	title: 'Правила восстановления',
	color: 'oswald: 3px; color: #FF6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Пожалуйста, убедительная просьба, ознакомьтесь с правилами восстановлений - [URL='https://forum.blackrussia.online/index.php?threads/В-каких-случаях-мы-не-восстанавливаем-игровое-имущество.25277/']клик[/URL]<br>Вы создали тему, которая не относится к технической проблеме.[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/CENTER]/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Хочу занять должность',
	color: 'oswald: 3px; color: #FF0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Команда технических специалистов не решает назначение на какую-либо должность, которая присутствует на проекте.<br>Для этого существуют заявления в главном разделе Вашего игрового сервера, где Вы можете ознакомиться с открытыми должностями и формами подач.<br>Приятной игры и желаем удачи в карьерной лестнице!<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Улучшения для серверов',
	color: 'oswald: 3px; color: #FF0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Ваша тема не относится к технической проблеме, если вы хотите предложить изменения в игровом моде - обратитесь в раздел <br> [URL="https://forum.blackrussia.online/index.php?categories/Предложения-по-улучшению.656/"] Предложения по улучшению → нажмите сюда[/URL]<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]' ,
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Вам нужны все прошивки',
	color: 'oswald: 3px; color: #FF0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER] Для активации какой либо прошивки необходимо поставить все детали данного типа "SPORT" "SPORT+" и т.п.<br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'ТЕСТЕРАМ',
	color: 'oswald: 3px; color: #FF6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]Ваша тема передана на тестирование.[/CENTER][/FONT][/SIZE]" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>',
	prefix: WAIT_PREFIX,
	status: false,
},
{
	title: 'Ответ от ТЕСТЕРОВ',
	color: 'oswald: 3px; color: #FF0000; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Ответ от тестерского отдела дан выше.<br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Пропали вещи с аукциона',
	color: 'oswald: 3px; color: #FF6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER]Если вы выставили свои вещи на аукцион, а их никто не купил, то воспользуйтесь командой [COLOR=rgb(251, 160, 38)]/reward[/COLOR]<br> В случае отсутствии вещей там, приложите скриншоты с + /time в новой теме<br>'+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(139, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'Если не работают ссылки',
	color: 'oswald: 3px; color: #FF6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	"[CENTER]По техническим причинам данное действие невозможно, пожалуйста воспользуйтесь копированием ссылки от сюда:<br>[img]https://i.ibb.co/SX77Fgw/photo-2022-08-20-16-31-57.jpg[/img]<br>Если данный способ не помогает, то используйте сервис сокращения ссылок https://clck.ru<br> Либо попробуйте вот так:<br>1) загрузка скриншота биографии на фотохостинг<br>2) в описание прикрепить ссылку с форума<br>3) скопировать пост с фотохостинга<br><br>2 способ:<br>Сократите ссылки для Ваших скриншотов и RP биографии, сделать можно тут goo.su  также Iformation замените на русский текст, просмотрите еще текст полностью и постарайтесь уменьшить такие знаки как !?<br>goo.su[/CENTER]<br>"+
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
	{
	title: 'ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ ᅠ  Для перемещенияᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠᅠ ᅠ',
	color: 'oswald: 3px; color: #8b00ff; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: 3px solid #8b00ff; width: 96%',
	},
{
	title: 'Ошибся разделом (перемещ в тех.раздел 51)',
	color: 'oswald: 3px; color: #ff6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; width: 43%',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER] Вы ошиблись разделом при создании темы. Перемещаю вашу тему в соответствующий технический раздел форума. <br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]Ожидайте ответа. Тему повторно создавать НЕ нужно.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: TRANSFER_PREFIX_TR46,
	status: open,
},
{
	title: 'Ошибся разделом (перемещ в обж 51)',
	color: 'oswald: 3px; color: #ff6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none width: 43%',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER] Вы ошиблись разделом при создании темы. Перемещаю вашу тему в соответствующий раздел «обжалования наказаний» сервера, где было вынесено решение о блокировке аккаунта. <br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]Ожидайте ответа. Тему повторно создавать НЕ нужно.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: TRANSFER_PREFIX_OBJ46,
	status: open,
},
{
	title: 'Ошибся разделом (перемещ в жб на адм 51)',
	color: 'oswald: 3px; color: #ff6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; width: 43%',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER] Вы ошиблись разделом при создании темы. Перемещаю вашу тему в соответствующий раздел «Жалобы на администрацию», сервера где было вынесено решение о блокировке аккаунта. <br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]Ожидайте ответа. Тему повторно создавать НЕ нужно.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: TRANSFER_PREFIX_ADM46,
	status: open,
},
{
	title: 'Ошибся разделом (перепещ в жб на игроков 51)',
	color: 'oswald: 3px; color: #ff6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; width: 43%',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER] Вы ошиблись разделом при создании темы. Перемещаю вашу тему в соответствующий раздел жалоб на игроков сервера, где произошло нарушение. <br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]Ожидайте ответа. Тему повторно создавать НЕ нужно.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: TRANSFER_PREFIX_PLAYER46,
	status: open,
},
	{
	title: 'ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ ᅠ   ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠᅠ ᅠ',
	color: 'oswald: 3px; color: #8b00ff; background: #000000; box-shadow: 0 0 1px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 1px 0 rgba(0,0,0,0.2); border: 3px solid #8b00ff; width: 96%',
	},
{
	title: 'Ошибся разделом (перемещ в тех.раздел 52)',
	color: 'oswald: 3px; color: #ff6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; width: 43%',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER] Вы ошиблись разделом при создании темы. Перемещаю вашу тему в соответствующий технический раздел форума. <br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]Ожидайте ответа. Тему повторно создавать НЕ нужно.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: TRANSFER_PREFIX_TR47,
	status: open,
},
{
	title: 'Ошибся разделом (перемещ в обж 52)',
	color: 'oswald: 3px; color: #ff6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none width: 43%',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER] Вы ошиблись разделом при создании темы. Перемещаю вашу тему в соответствующий раздел «обжалования наказаний» сервера, где было вынесено решение о блокировке аккаунта. <br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]Ожидайте ответа. Тему повторно создавать НЕ нужно.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: TRANSFER_PREFIX_OBJ47,
	status: open,
},
{
	title: 'Ошибся разделом (перемещ в жб на адм 52)',
	color: 'oswald: 3px; color: #ff6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; width: 43%',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER] Вы ошиблись разделом при создании темы. Перемещаю вашу тему в соответствующий раздел «Жалобы на администрацию», сервера где было вынесено решение о блокировке аккаунта. <br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]Ожидайте ответа. Тему повторно создавать НЕ нужно.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: TRANSFER_PREFIX_ADM47,
	status: open,
},
{
	title: 'Ошибся разделом (перепещ в жб на игроков 52)',
	color: 'oswald: 3px; color: #ff6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; width: 43%',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER] Вы ошиблись разделом при создании темы. Перемещаю вашу тему в соответствующий раздел жалоб на игроков сервера, где произошло нарушение. <br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]Ожидайте ответа. Тему повторно создавать НЕ нужно.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: TRANSFER_PREFIX_PLAYER47,
	status: open,
},
	{
	title: 'ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ ᅠ   ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠᅠ ᅠ',
	color: 'oswald: 3px; color: #8b00ff; background: #000000; box-shadow: 0 0 1px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 1px 0 rgba(0,0,0,0.2); border: 3px solid #8b00ff; width: 96%',
	},
{
	title: 'Ошибся разделом (перемещ в тех.раздел 53)',
	color: 'oswald: 3px; color: #ff6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; width: 43%',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER] Вы ошиблись разделом при создании темы. Перемещаю вашу тему в соответствующий технический раздел форума. <br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]Ожидайте ответа. Тему повторно создавать НЕ нужно.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: TRANSFER_PREFIX_TR48,
	status: open,
},
{
	title: 'Ошибся разделом (перемещ в обж 53)',
	color: 'oswald: 3px; color: #ff6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none width: 43%',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER] Вы ошиблись разделом при создании темы. Перемещаю вашу тему в соответствующий раздел «обжалования наказаний» сервера, где было вынесено решение о блокировке аккаунта. <br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]Ожидайте ответа. Тему повторно создавать НЕ нужно.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: TRANSFER_PREFIX_OBJ48,
	status: open,
},
{
	title: 'Ошибся разделом (перемещ в жб на адм 53)',
	color: 'oswald: 3px; color: #ff6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; width: 43%',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER] Вы ошиблись разделом при создании темы. Перемещаю вашу тему в соответствующий раздел «Жалобы на администрацию», сервера где было вынесено решение о блокировке аккаунта. <br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]Ожидайте ответа. Тему повторно создавать НЕ нужно.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: TRANSFER_PREFIX_ADM48,
	status: open,
},
{
	title: 'Ошибся разделом (перепещ в жб на игроков 53)',
	color: 'oswald: 3px; color: #ff6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; width: 43%',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER] Вы ошиблись разделом при создании темы. Перемещаю вашу тему в соответствующий раздел жалоб на игроков сервера, где произошло нарушение. <br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]Ожидайте ответа. Тему повторно создавать НЕ нужно.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: TRANSFER_PREFIX_PLAYER48,
	status: open,
},
	{
	title: 'ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ ᅠ   ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠᅠ ᅠ',
	color: 'oswald: 3px; color: #8b00ff; background: #000000; box-shadow: 0 0 1px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 1px 0 rgba(0,0,0,0.2); border: 3px solid #8b00ff; width: 96%',
	},
{
	title: 'Ошибся разделом (перемещ в тех.раздел 54)',
	color: 'oswald: 3px; color: #ff6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; width: 43%',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER] Вы ошиблись разделом при создании темы. Перемещаю вашу тему в соответствующий технический раздел форума. <br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]Ожидайте ответа. Тему повторно создавать НЕ нужно.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: TRANSFER_PREFIX_TR49,
	status: open,
},
{
	title: 'Ошибся разделом (перемещ в обж 54)',
	color: 'oswald: 3px; color: #ff6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none width: 43%',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER] Вы ошиблись разделом при создании темы. Перемещаю вашу тему в соответствующий раздел «обжалования наказаний» сервера, где было вынесено решение о блокировке аккаунта. <br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]Ожидайте ответа. Тему повторно создавать НЕ нужно.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: TRANSFER_PREFIX_OBJ49,
	status: open,
},
{
	title: 'Ошибся разделом (перемещ в жб на адм 54)',
	color: 'oswald: 3px; color: #ff6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; width: 43%',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER] Вы ошиблись разделом при создании темы. Перемещаю вашу тему в соответствующий раздел «Жалобы на администрацию», сервера где было вынесено решение о блокировке аккаунта. <br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]Ожидайте ответа. Тему повторно создавать НЕ нужно.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: TRANSFER_PREFIX_ADM49,
	status: open,
},
{
	title: 'Ошибся разделом (перепещ в жб на игроков 54)',
	color: 'oswald: 3px; color: #ff6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; width: 43%',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER] Вы ошиблись разделом при создании темы. Перемещаю вашу тему в соответствующий раздел жалоб на игроков сервера, где произошло нарушение. <br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]Ожидайте ответа. Тему повторно создавать НЕ нужно.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: TRANSFER_PREFIX_PLAYER49,
	status: open,
},
	{
	title: 'ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ ᅠ   ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠᅠ ᅠ',
	color: 'oswald: 3px; color: #8b00ff; background: #000000; box-shadow: 0 0 1px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 1px 0 rgba(0,0,0,0.2); border: 3px solid #8b00ff; width: 96%',
	},
{
	title: 'Ошибся разделом (перемещ в тех.раздел 55)',
	color: 'oswald: 3px; color: #ff6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; width: 43%',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER] Вы ошиблись разделом при создании темы. Перемещаю вашу тему в соответствующий технический раздел форума. <br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]Ожидайте ответа. Тему повторно создавать НЕ нужно.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: TRANSFER_PREFIX_TR50,
	status: open,
},
{
	title: 'Ошибся разделом (перемещ в обж 55)',
	color: 'oswald: 3px; color: #ff6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none width: 43%',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER] Вы ошиблись разделом при создании темы. Перемещаю вашу тему в соответствующий раздел «обжалования наказаний» сервера, где было вынесено решение о блокировке аккаунта. <br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]Ожидайте ответа. Тему повторно создавать НЕ нужно.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: TRANSFER_PREFIX_OBJ50,
	status: open,
},
{
	title: 'Ошибся разделом (перемещ в жб на адм 55)',
	color: 'oswald: 3px; color: #ff6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; width: 43%',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER] Вы ошиблись разделом при создании темы. Перемещаю вашу тему в соответствующий раздел «Жалобы на администрацию», сервера где было вынесено решение о блокировке аккаунта. <br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]Ожидайте ответа. Тему повторно создавать НЕ нужно.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: TRANSFER_PREFIX_ADM50,
	status: open,
},
{
	title: 'Ошибся разделом (перепещ в жб на игроков 55)',
	color: 'oswald: 3px; color: #ff6600; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.54),0 2px 2px 0 rgba(0,0,0,0.52),0 1px 3px 0 rgba(0,0,0,0.2); border: none; width: 43%',
	content:
	"[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=15px][CENTER]{{ greeting }}, уважаемый [/COLOR][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR].[/CENTER]<br><br>" +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER] Вы ошиблись разделом при создании темы. Перемещаю вашу тему в соответствующий раздел жалоб на игроков сервера, где произошло нарушение. <br><br>' +
	'[CENTER][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/CENTER]<br>' +
	'[CENTER][COLOR=rgb(255, 255, 0)]Ожидайте ответа. Тему повторно создавать НЕ нужно.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: TRANSFER_PREFIX_PLAYER50,
	status: open,
},
];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрение', 'pin','border-radius: 20px; margin-right: 11px; border: 2px solid; border-color: rgb(255, 173, 51, 0.5);');
	addButton('КП', 'teamProject','border-radius: 20px; margin-right: 100x; border: 2px solid;  border-color: rgb(255, 240, 110, 0.5);');
	addButton('Рассмотрено', 'watched','border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(110, 192, 113, 0.5)');
	addButton('Отказано', 'unaccept','border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);' );
	addButton('Решено', 'decided','border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(110, 192, 113, 0.5);');
	addButton('Закрыто', 'closed','border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);');
	addButton('Тех. спецу', 'techspec', 'techspec', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(17, 92, 208, 0.5);');
	addButton('CLOSE', 'closed_complaint','border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);');
	addAnswers();

	// Поиск информации о теме
	const threadData = getThreadData();

	$(`button#ff`).click(() => pasteContent(8, threadData, true));
	$(`button#prr`).click(() => pasteContent(2, threadData, true));
	$(`button#zhb`).click(() => pasteContent(21, threadData, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX_TR46, open));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX_OBJ46, open));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX_ADM46, open));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX_PLAYER46, open));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX_TR47, open));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX_OBJ47, open));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX_ADM47, open));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX_PLAYER47, open));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX_TR48, open));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX_OBJ48, open));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX_ADM48, open));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX_PLAYER48, open));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX_TR49, open));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX_OBJ49, open));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX_ADM49, open));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX_PLAYER49, open));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX_TR50, open));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX_OBJ50, open));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX_ADM50, open));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX_PLAYER50, open));
  $('button#transfer').click(() => editThreadData(TRANSFER_PREFIX_JBT, true));
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

		function addButton(name, id, hex = "grey") {
		$('.button--icon--reply').before(
		`<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 25px; margin-right: 5px; background-color: ${hex}">${name}</button>`,
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
			  `rippleButton" style="margin:5px; background-color: ${btn.color || "grey"}"><span class="button-text">${btn.title}</span></button>`,
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

	if(prefix == TRANSFER_PREFIX_JBT) {                //перемещение в жб на техов (главная)
	moveThread(prefix, 490); }

	if(prefix == WAIT_PREFIX) {                      //перемещение в багтрекер
	moveThread(prefix, 917);
	}

if(prefix == TRANSFER_PREFIX_TR46) {
				moveThread(prefix, 2262);
			}
if(prefix == TRANSFER_PREFIX_OBJ46) {
				moveThread(prefix, 2291);
			}                                            //перемещение в тула.
if(prefix == TRANSFER_PREFIX_ADM46) {
				moveThread(prefix, 2288);
			}
if(prefix == TRANSFER_PREFIX_PLAYER46) {
				moveThread(prefix, 2290);
			}

if(prefix == TRANSFER_PREFIX_TR47) {
				moveThread(prefix, 2304);
			}
if(prefix == TRANSFER_PREFIX_OBJ47) {
				moveThread(prefix, 2333);
			}                                            //перемещение в рязань.
if(prefix == TRANSFER_PREFIX_ADM47) {
				moveThread(prefix, 2330);
			}
if(prefix == TRANSFER_PREFIX_PLAYER47) {
				moveThread(prefix, 2332);
}

if(prefix == TRANSFER_PREFIX_TR48) {
				moveThread(prefix, 2346);
			}
if(prefix == TRANSFER_PREFIX_OBJ48) {
				moveThread(prefix, 2375);
			}                                            //перемещение в мурманск.
if(prefix == TRANSFER_PREFIX_ADM48) {
				moveThread(prefix, 2372);
			}
if(prefix == TRANSFER_PREFIX_PLAYER48) {
				moveThread(prefix, 2374);
			}

if(prefix == TRANSFER_PREFIX_TR49) {
				moveThread(prefix, 2388);
			}
if(prefix == TRANSFER_PREFIX_OBJ49) {
				moveThread(prefix, 2417);
			}                                            //перемещение в пенза.
if(prefix == TRANSFER_PREFIX_ADM49) {
				moveThread(prefix, 2414);
			}
if(prefix == TRANSFER_PREFIX_PLAYER49) {
				moveThread(prefix, 2416);
			}

if(prefix == TRANSFER_PREFIX_TR50) {
				moveThread(prefix, 2430);
			}
if(prefix == TRANSFER_PREFIX_OBJ50) {
				moveThread(prefix, 2459);
			}                                            //перемещение в курск.
if(prefix == TRANSFER_PREFIX_ADM50) {
				moveThread(prefix, 2456);
			}
if(prefix == TRANSFER_PREFIX_PLAYER50) {
				moveThread(prefix, 2458);

}}
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

//Снег by Темочка
(function () {
    'use strict';

    function createAnimatedSnow() {

        const snowflakes = [];

        function setupCanvas() {
            const canvas = document.createElement('canvas');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            canvas.id = 'snow-flakes';
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '99999';
            canvas.style.filter = 'blur(2px)';
            document.body.appendChild(canvas);

            return canvas.getContext('2d');
        }

        function createSnowflake(x, y) {
            const size = Math.random() * 2 + 1;
            const speedY = Math.random() * 1 + 1;
            const speedX = (Math.random() - 0.5) * 2;

            return { x, y, size, speedY, speedX };
        }

        function drawSnowflake(ctx, snowflake) {
            ctx.beginPath();
            ctx.arc(snowflake.x, snowflake.y, snowflake.size, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.closePath();
        }

        function updateSnowflakes(ctx) {
            for (let i = 0; i < snowflakes.length; i++) {
                const snowflake = snowflakes;

                snowflake.y += snowflake.speedY;
                snowflake.x += snowflake.speedX;

                if (snowflake.y > window.innerHeight || snowflake.x > window.innerWidth) {
                    snowflakes = createSnowflake(Math.random() * window.innerWidth, Math.random() * -window.innerHeight);
                }

                drawSnowflake(ctx, snowflake);
            }
        }

        function animateSnow() {
            const ctx = setupCanvas();

            for (let i = 0; i < 500; i++) {
                snowflakes.push(createSnowflake(Math.random() * window.innerWidth, Math.random() * window.innerHeight));
            }

            function animate() {
                ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                updateSnowflakes(ctx);
                requestAnimationFrame(animate);
            }

            animate();
        }

        animateSnow();

    }

    function removeAnimatedSnow() {
        const snowCanvas = document.querySelector('#snow-flakes');
        document.body.removeChild(snowCanvas);
    }



    const pageHeader = document.querySelector('.pageContent');
    const switchStyleBlock = document.createElement('label');
    switchStyleBlock.className = 'switch';
    switchStyleBlock.innerHTML = `
            <input type="checkbox" id="styleToggleCheck">
            <span class="slider round" style="padding-right: 20px;">
            <span class="addingText" style="display: block; width: max-content; margin: 5px; margin-left: 35px; margin-top: 2px;">Снег</span>
            </span>
        `;
    pageHeader.appendChild(switchStyleBlock);

    const styleToggleCheck = document.getElementById('styleToggleCheck');
    if (localStorage.getItem('snowEnabled') === 'true') {
        styleToggleCheck.checked = true;
        createAnimatedSnow();
    }
    styleToggleCheck.addEventListener('change', function () {
        if (styleToggleCheck.checked) {
            createAnimatedSnow();
            localStorage.setItem('snowEnabled', 'true');
        } else {
            removeAnimatedSnow();
            localStorage.setItem('snowEnabled', 'false');
        }
    });

    const sliderStyle = document.createElement('style');
    sliderStyle.id = 'slider-style';
    sliderStyle.textContent = `
    .switch {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 20px;
        padding-left: 20px;
        margin: 0 30px 0 auto;
    }
    .switch input { display: none; }
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 1px solid #34aaeb;
        background-color: #212428;
        transition: all .4s ease;
    }
    .slider:hover{
        background-color: #29686d;
    }
    .slider:before {
        position: absolute;
        content: "";
        height: 14px;
        width: 14px;
        left: 2px;
        bottom: 2px;
        background-color: #32a0a8;
        box-shadow: 0 0 5px #000000;
        transition: all .4s ease;
    }
    input:checked + .slider {
        background-color: #212428;
    }
    input:checked + .slider:hover {
        background-color: #29686d;
    }
    input:focus + .slider {
        box-shadow: 0 0 5px #222222;
        background-color: #444444;
    }
    input:checked + .slider:before {
        transform: translateX(19px);
    }
    .slider.round {
        border-radius: 34px;
    }
    .slider.round:before {
        border-radius: 50%;
    }
`;
    document.head.appendChild(sliderStyle);
})();

const bgButtons = document.querySelector(".pageContent");
const buttonConfig = (text, href) => {
  const button = document.createElement("button");
  button.textContent = text;
  button.classList.add("bgButton");
  button.addEventListener("click", () => {
    window.location.href = href;
  });
  return button;
};

const Button51 = buttonConfig("Игроки 51", 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2290/');
const Button52 = buttonConfig("Игроки 52", "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2332/");
const Button53 = buttonConfig("Игроки 53", "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2374/");
const Button54 = buttonConfig("Игроки 54", "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2416/");
const Button55 = buttonConfig("Игроки 55", "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2458/")
const ButtonTech51 = buttonConfig("Тех 51", "https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-tula.2262/")
const ButtonTech52 = buttonConfig("Тех 52", "https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-ryazan.2304/")
const ButtonTech53 = buttonConfig("Тех 53", "https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-murmansk.2346/")
const ButtonTech54 = buttonConfig("Тех 54", "https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-penza.2388/")
const ButtonTech55 = buttonConfig("Тех 55", "https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-kursk.2430/")
const ButtonComp51 = buttonConfig("Жб 51", "https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9651-tula.2261/")
const ButtonComp52 = buttonConfig("Жб 52", "https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9652-ryazan.2303/")
const ButtonComp53 = buttonConfig("Жб 53", "https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9653-murmansk.2345/")
const ButtonComp54 = buttonConfig("Жб 54", "https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9654-penza.2387/")
const ButtonComp55 = buttonConfig("Жб 55", "https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9655-kursk.2429/")
const ButtonComp533 = buttonConfig("ОПС", "https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/")

bgButtons.append(Button51);
bgButtons.append(Button52);
bgButtons.append(Button53);
bgButtons.append(Button54);
bgButtons.append(Button55);
bgButtons.append(ButtonTech51);
bgButtons.append(ButtonTech52);
bgButtons.append(ButtonTech53);
bgButtons.append(ButtonTech54);
bgButtons.append(ButtonTech55);
bgButtons.append(ButtonComp51);
bgButtons.append(ButtonComp52);
bgButtons.append(ButtonComp53);
bgButtons.append(ButtonComp54);
bgButtons.append(ButtonComp55);
bgButtons.append(ButtonComp533);


