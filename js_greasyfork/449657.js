// ==UserScript==
// @name         Техническая империя
// @namespace    https://forum.blackrussia.online
// @version      3.0
// @description  Yes
// @author       M. Pearson
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license 	 MIT
// @icon https://i.yapx.ru/RMTMT.png
// @copyright 2021,
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/449657/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F%20%D0%B8%D0%BC%D0%BF%D0%B5%D1%80%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/449657/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F%20%D0%B8%D0%BC%D0%BF%D0%B5%D1%80%D0%B8%D1%8F.meta.js
// ==/UserScript==

(function () {
  'use strict';
const FAIL_PREFIX = 4;
const OKAY_PREFIX = 8;
const WAIT_PREFIX = 2;
const TECH_PREFIX = 13;
const WATCH_PREFIX = 9;
const CLOSE_PREFIX = 7;
const GA_PREFIX = 12;
const SA_PREFIX = 11;
const CP_PREFIX = 10;
const TEST_PREFIX = 17;
const RESH_PREFIX = 6;
const buttons = [
    {
	  title: 'Приветствие',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте, {{ user.mention }}.[/CENTER]<br><br>' +
		"[CENTER][/CENTER]<br><br>" +
		'[CENTER][/CENTER][/SIZE][/FONT]',
	},
    {
	  title: 'Не по форме',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте, {{ user.mention }}.[/CENTER]<br><br>' +
		"[CENTER]Ваше сообщение составлено не по форме.[/CENTER]<br><br>" +
        '[CENTER]Если вы подаёте заявку в техническом разделе, заполните данную форму:[/CENTER]<br>' +
        '[LEFT][QUOTE]01. Ваш игровой никнейм:<br>02. Сервер, на котором Вы играете:<br>03. Суть возникшей проблемы (описать максимально подробно и раскрыто):<br>04. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>05.Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/QUOTE][/LEFT]<br><br>' +
        '[CENTER]Если вы подаёте жалобу на тех. специалиста, заполните данную форму:[/CENTER]<br>' +
        '[LEFT][QUOTE]01. Ваш игровой никнейм:<br>02. Игровой никнейм технического специалиста:<br>03. Сервер, на котором Вы играете:<br>04. Описание ситуации (описать максимально подробно и раскрыто):<br>05. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>06.Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/QUOTE][/LEFT]<br><br>' +
		'[CENTER]Отказано, закрыто.[/CENTER][/SIZE][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Не по теме',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте, {{ user.mention }}.[/CENTER]<br><br>' +
		"[CENTER]Ваше сообщение никаким образом не относится к теме раздела.[/CENTER]<br><br>" +
		'[CENTER]Отказано, закрыто.[/CENTER][/SIZE][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'В тех раздел',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте, {{ user.mention }}.[/CENTER]<br><br>' +
		"[CENTER]Оставьте заявку в техническом разделе нужного сервера.[/CENTER]<br><br>" +
		'[CENTER]Отказано, закрыто.[/CENTER][/SIZE][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'В жб на техов',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте, {{ user.mention }}.[/CENTER]<br><br>' +
		"[CENTER]Оставьте заявку в техническом разделе нужного сервера.[/CENTER]<br><br>" +
		'[CENTER]Отказано, закрыто.[/CENTER][/SIZE][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Ответ ранее',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте, {{ user.mention }}.[/CENTER]<br><br>' +
		"[CENTER]Ответ был дан в прошлой теме.[/CENTER]<br><br>" +
		'[CENTER]Отказано, закрыто.[/CENTER][/SIZE][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Доступ к аккаунту',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте, {{ user.mention }}.[/CENTER]<br><br>' +
		"[CENTER]Если Вы обезопасили Ваш аккаунт и привязали его к странице во ВКонтакте, то сбросить пароль или пин-код Вы всегда сможете обратившись в официальное сообщество проекта - https://vk.com/blackrussia.online. Напишите «Начать» в личные сообщения группы, затем выберите нужные Вам функции.<br><br>" +
		"[CENTER]Если Вы обезопасили Ваш аккаунт и привязали его к почте, то сбросить пароль или пин-код Вы всегда сможете при вводе пароля на сервере. Выберите кнопку «Восст», затем выберите нужные Вам функции.<br><br>" +
        "[CENTER]Если Вы не обезопасили свой аккаунт - его невозможно вернуть. Игрок самостоятельно несет ответственность за безопаность своего аккаунта.<br><br>" +
        '[CENTER]Закрыто.[/CENTER][/SIZE][/FONT]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'На рассмотрение',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте, {{ user.mention }}.[/CENTER]<br><br>' +
		"[CENTER]Ваша заявка взята на рассмотрение.[/CENTER]<br>" +
        "[CENTER]Просьба не создавать копии заявок.[/CENTER]<br><br>" +
		'[CENTER]Ожидайте ответа.[/CENTER][/SIZE][/FONT]',
	  prefix: WAIT_PREFIX,
	  status: true,
	},
    {
	  title: 'КП',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте, {{ user.mention }}.[/CENTER]<br><br>' +
		"[CENTER]Жалоба передана Команде Проекта.[/CENTER]<br><br>" +
        "[CENTER]Ожидайте ответа в этой теме.[/CENTER]<br>" +
		'[CENTER]На рассмотрении.[/CENTER][/SIZE][/FONT]',
	  prefix: CP_PREFIX,
	  status: true,
	},
    {
	  title: 'Тостерам',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте, {{ user.mention }}.[/CENTER]<br><br>' +
		"[CENTER]Заявка передана на тестирование.[/CENTER]<br><br>" +
		'[CENTER]Ожидайте ответа.[/CENTER][/SIZE][/FONT]',
	  prefix: 888,
	  status: false,
	},
    {
	  title: 'Переместить',
	  content:
		'[FONT=Georgia][SIZE=4][CENTER]Тема перенесена.[/CENTER][/SIZE][/FONT]',
	  prefix: TEST_PREFIX,
	  status: false,
	},
    {
	  title: 'Компенсация',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте, {{ user.mention }}.[/CENTER]<br><br>' +
		"[CENTER]Ваше игровое имущество/денежные средства будут восстановлены в течение месяца.<br>" +
        "[CENTER]Убедительная просьба, не менять никнейм до момента восстановления.<br>" +
        "[CENTER]Для активации восстановления используйте команды: /roulette, /recovery.[/CENTER]<br><br>" +
		'[CENTER]Решено, закрыто.[/CENTER][/SIZE][/FONT]',
        prefix: RESH_PREFIX,
	    status: false,
	},
    {
	  title: 'Донат',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте, {{ user.mention }}.[/CENTER]<br><br>' +
		'[CENTER]Система построена таким образом, что деньги не спишутся, пока наша платформа не уведомит платежную систему о зачислении BLACK COINS. Для проверки зачисления BLACK COINS необходимо ввести в игре команду: /donat.<br>' +
		'[CENTER]В остальных же случаях, если не были зачислены BLACK COINS — вероятнее всего, была допущена ошибка при вводе реквизитов. К нашему сожалению, из-за большого количества попыток обмана, мы перестали рассматривать подобные жалобы. Вам необходимо быть внимательными при осуществлении покупок.<br>' +
		'[CENTER]Если Вы считаете, что ошибки быть не может и с момента оплаты не прошло более 7 дней, то в обязательном порядке обратитесь в данное сообщество для дальнейшего решения: https://vk.com/br_tech.<br><br>' +
		'[CENTER]Рассмотрено.[/CENTER][/SIZE][/FONT]',
	  prefix: WATCH_PREFIX,
	  status: false,
	},
    {
	  title: 'О проблеме уже известно',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте, {{ user.mention }}.[/CENTER]<br><br>' +
		"[CENTER]О данной проблеме уже известно. Команда проекта ведёт работы по её устранению.[/CENTER]<br><br>" +
		'[CENTER]Спасибо за обращение![/CENTER][/SIZE][/FONT]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Не тех проблема',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте, {{ user.mention }}.[/CENTER]<br><br>' +
		"[CENTER]Не является технической проблемой.[/CENTER]<br><br>" +
		'[CENTER]Закрыто.[/CENTER][/SIZE][/FONT]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Правила восстановлений',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте, {{ user.mention }}.[/CENTER]<br><br>' +
		"[CENTER]В данном случае ваше обращение не уместно. Ознакомьтесь с правилами восстановлений - [URL='https://forum.blackrussia.online/index.php?threads/%D0%92-%D0%BA%D0%B0%D0%BA%D0%B8%D1%85-%D1%81%D0%BB%D1%83%D1%87%D0%B0%D1%8F%D1%85-%D0%BC%D1%8B-%D0%BD%D0%B5-%D0%B2%D0%BE%D1%81%D1%81%D1%82%D0%B0%D0%BD%D0%B0%D0%B2%D0%BB%D0%B8%D0%B2%D0%B0%D0%B5%D0%BC-%D0%B8%D0%B3%D1%80%D0%BE%D0%B2%D0%BE%D0%B5-%D0%B8%D0%BC%D1%83%D1%89%D0%B5%D1%81%D1%82%D0%B2%D0%BE.25277/']*Кликабельно*[/URL][/CENTER]<br><br>" +
		'[CENTER]Отказано, закрыто.[/CENTER][/SIZE][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Не тот сервер',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте, {{ user.mention }}.[/CENTER]<br><br>' +
		"[CENTER]Вы ошиблись сервером.[/CENTER]<br><br>" +
		'[CENTER]Отказано, закрыто.[/CENTER][/SIZE][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Сервер не отвечает',
	  content:
	    '[SIZE=4][FONT=Georgia][CENTER]Здравствуйте, {{ user.mention }}.[/CENTER]<br><br>' +
	    "[CENTER]Если у Вас встречаются такие проблемы, как «Сервер не отвечает», не отображаются сервера в лаунчере, не удаётся выполнить вход на сайт/форум, попробуйте совершить следующие действия:<br>" +
	    "[QUOTE][LEFT]• Сменить IP-адрес любыми средствами; <br>• Переключиться на Wi-Fi/мобильный интернет или на любую доступную сеть; <br>• Использование VPN; <br>• Перезагрузка роутера.[/QUOTE][/LEFT]<br><br>" +
        "[CENTER]Если методы выше не помогли, то переходим к следующим шагам:<br>" +
        '[QUOTE][LEFT]1. Устанавливаем приложение «1.1.1.1: Faster & Safer Internet» Ссылка: https://clck.ru/ZP6Av и переходим в него. <br>2. Соглашаемся со всей политикой приложения. <br>3. Нажимаем на ползунок и ждем, когда текст изменится на «Подключено». <br>4. Проверяем: Отображаются ли серверы? Удается ли выполнить вход в игру? Работают ли другие источники (сайт, форум)?<br>[/QUOTE][/LEFT]'+
        "[CENTER][SIZE=4]📹 Включение продемонстрировано на видео: [URL='https://youtu.be/Wft0j69b9dk']*Кликабельно*[/URL]<br><br>" +
	    '[CENTER]Рассмотрено.[/SIZE][/FONT][/CENTER]',
      prefix: WATCH_PREFIX,
	  status: false,
	},
    {
	  title: 'Бан IP',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте, {{ user.mention }}.[/CENTER]<br><br>' +
		"[CENTER]Возможно, IP адрес был заблокирован не вам, а вы случайно попали на заблокированный IP.<br>Перезагрузите роутер, либо же смените способ подключения к интернету.[/CENTER]<br><br>" +
		'[CENTER]Рассмотрено, закрыто.[/SIZE][/FONT][/CENTER]',
      prefix: WATCH_PREFIX,
	  status: false,
	},
    {
	  title: 'Краш/вылет',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте, {{ user.mention }}.[/CENTER]<br><br>' +
		"[CENTER]В том случае, если Вы вылетели из игры во время игрового процесса (произошел краш), в обязательном порядке необходимо обратиться в данную тему: [URL='https://vk.cc/cdKifm']*Кликабельно*[/URL][/CENTER]<br><br>" +
		'[CENTER]Закрыто.[/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: '7+ дней с момента бана',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте, {{ user.mention }}.[/CENTER]<br><br>' +
		"[CENTER]С момента выдачи наказания прошло более 7-ми дней.[/CENTER]<br><br>" +
		'[CENTER]Отказано, закрыто.[/CENTER][/SIZE][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'Жалобы',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте, {{ user.mention }}.[/CENTER]<br><br>' +
		"[LEFT]Обратитесь в раздел «Жалобы» Вашего сервера:<br><br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.54/'][B]Сервер №1 | Red[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.98/'][B]Сервер №2 | Green[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.138/'][B]Сервер №3 | Blue[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.174/'][B]Сервер №4 | Yellow[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.251/'][B]Сервер №5 | Orange[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.291/'][B]Сервер №6 | Purple[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.331/'][B]Сервер №7 | Lime[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.373/'][B]Сервер №8 | Pink[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.414/'][B]Сервер №9 | Cherry[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.467/'][B]Сервер №10 | Black[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.498/'][B]Сервер №11 | Indigo[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.654/'][B]Сервер №12 | White[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.655/'][B]Сервер №13 | Magenta[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/Жалобы.619/'][B]Сервер №14 | Crimson[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.700/'][B]Сервер №15 | Gold[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.720/'][B]Сервер №16 | Azure[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?categories/Жалобы.763/'][B]Сервер №17 | Platinum[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.822/'] [B] Сервер №18 | Aqua[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.863/'][B]Сервер №19 | Gray[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.932/'] [B]Сервер №20 | Ice [/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.972/'] [B]Сервер №21 | Chilli [/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/Сервер-№22-choco.1009/'] [B]Сервер №22 | Choco [/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1082/'] [B]Сервер №23 | Moscow[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1124/'] [B]Сервер №24 | SPB[/B] → нажмите сюда[/URL]<br>[URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.1145/'] [B]Сервер №25 | UFA[/B] → нажмите сюда[/URL]<br><br>" +
		'[CENTER]Отказано.[/CENTER][/SIZE][/FONT]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Заголовок жалобы',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте, {{ user.mention }}.[/CENTER]<br><br>' +
		"[CENTER]Название Вашей жалобы составлено не по правилам.[/CENTER]<br>" +
        "[CENTER]В заголовке обязательно должен присутствовать никнейм специалиста.[/CENTER]<br><br>" +
		'[CENTER]Отказано, закрыто.[/CENTER][/SIZE][/FONT]',
	  prefix: FAIL_PREFIX,
	  status: false,
	},
    {
	  title: 'SELLCAR',
	  content:
		'[SIZE=4][FONT=Georgia][CENTER]Здравствуйте, {{ user.mention }}.[/CENTER]<br><br>' +
		"[CENTER]Всем автомобилям, которые были приобретены до 02 июня 05:00, будет добавлена возможность продажи по старой государственной цене.[/CENTER]<br><br>" +
        "[CENTER]Обращаем внимание, что в случае, если автомобиль будет продан на руки, государственная стоимость обновится до новой, то есть продажа автомобиля государству будет дешевле..[/CENTER]<br><br>" +
        "[CENTER]Приносим извинения за доставленные неудобства.[/CENTER]<br><br>" +
		'[CENTER]Закрыто.[/CENTER][/SIZE][/FONT]',
	  prefix: CLOSE_PREFIX,
	  status: true,
	},

];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('Ф', 'forma');
	addButton('Т', 'tema');
	addButton('ЖБ', 'zhb');
	addButton('|', '');
	addButton('Закрыто', 'close');
    addButton('Решено', 'done');
    addButton('|', '');
	addButton('Менюшка', 'selectAnswer');
    addButton('|', '');

	// Поиск информации о теме
	const threadData = getThreadData();

    $(`button#forma`).click(() => pasteContent(1, threadData, true));
	$(`button#tema`).click(() => pasteContent(2, threadData, true));
	$(`button#zhb`).click(() => pasteContent(21, threadData, true));
	$('button#pin').click(() => editThreadData(WAIT_PREFIX, true));
	$('button#accepted').click(() => editThreadData(OKAY_PREFIX, false));
	$('button#teamProject').click(() => editThreadData(CP_PREFIX, true));
    $('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#done').click(() => editThreadData(RESH_PREFIX, false));
	$('button#unaccept').click(() => editThreadData(FAIL_PREFIX, false));

	$(`button#selectAnswer`).click(() => {
		XF.alert(buttonsMarkup(buttons), null, '  ');
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
    if(prefix == FAIL_PREFIX || prefix == OKAY_PREFIX || prefix == RESH_PREFIX || prefix == CLOSE_PREFIX || prefix == WATCH_PREFIX) {
		moveThread(prefix, 230);
	}
    if(prefix == TEST_PREFIX) {
		moveThread(prefix, 917);
	}
}

function moveThread(prefix, type) {
// Перемещение темы в раздел окончательных ответов
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