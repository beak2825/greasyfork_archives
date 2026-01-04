// ==UserScript==
// @name         Лемонте
// @namespace    https://forum.blackrussia.online
// @version      1.1
// @description  nevertelka
// @author       maksim
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license      MIT
// @collaborator лемонте
// @icon https://sun6-23.userapi.com/s/v1/ig1/Bg7Sgc3yqNZ1F5YedeolIhnyRKIclMmKRAjpf9Rzj0XKAsgR9fLgLgNB3TUBDBF_N7XKKgPK.jpg?size=2155x2155&quality=96&crop=2,2,2155,2155&ava=1
// @downloadURL https://update.greasyfork.org/scripts/491190/%D0%9B%D0%B5%D0%BC%D0%BE%D0%BD%D1%82%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/491190/%D0%9B%D0%B5%D0%BC%D0%BE%D0%BD%D1%82%D0%B5.meta.js
// ==/UserScript==

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
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		'[CENTER] Сюда текст [/CENTER]',
    },
	{
        title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ Рассмотрение Жалоб на Теховᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
    },
	{
        title: 'На рассмотрении у Тех.Спец',
		content:
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		'[CENTER]Ваша тема взята на рассмотрение.[/CENTER]<br>' +
        '[CENTER]Просьба ожидать ответа от Технического Специалиста.[/CENTER]<br>' +
        '[CENTER]Иногда рассмотрение темы может занять определенное время.[/CENTER]<br>' +
        '[CENTER]Благодарим вас за обращение![/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении.[/COLOR][/CENTER]',
		prefix: TECHADM_PREFIX,
		status: true,
	},
	{
        title: 'На рассмотрении у Зам.Кур',
		content:
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		'[CENTER]Ваша тема взята на рассмотрение.[/CENTER]<br>' +
        '[CENTER]Просьба ожидать ответа от Заместителя Куратора Технических Специалистов.[/CENTER]<br>' +
        '[CENTER]Иногда рассмотрение темы может занять определенное время.[/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении.[/COLOR][/CENTER]',
		prefix: PIN_PREFIX,
		status: true,
	},
	{
        title: 'На рассмотрении у Куратора',
		content:
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		'[CENTER]Ваша тема взята на рассмотрение.[/CENTER]<br>' +
        '[CENTER]Просьба ожидать ответа от Куратора Технических Специалистов.[/CENTER]<br>' +
        '[CENTER]Иногда рассмотрение темы может занять определенное время.[/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении.[/COLOR][/CENTER]',
		prefix: PIN_PREFIX,
		status: true,
	},
	{
        title: 'Передано Куратору',
		content:
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		'[CENTER]Ваша тема передана на рассмотрение Куратору Технических Специалистов.[/CENTER]<br>' +
        '[CENTER]Просьба ожидать ответа и не создавать оффтоп.[/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении.[/COLOR][/CENTER]',
		prefix: PIN_PREFIX,
		status: true,
	},
	{
		title: 'Команде Проекта',
		content:
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		"[CENTER]Ваша тема закреплена и находится на рассмотрении у Команды Проекта. Пожалуйста, ожидайте выноса вердикта разработчиков."+
		"[CENTER]Создавать новые темы с данной проблемой — не нужно, ожидайте ответа в данной теме.<br>",
		prefix: COMMAND_PREFIX,
		status: true,
	},
	{
        title: 'Передано Глав. Кур.',
		content:
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		'[CENTER]Ваша тема передана на рассмотрение Главному Куратору Технических Специалистов.[/CENTER]<br>' +
        '[CENTER]Просьба ожидать ответа и не создавать оффтоп.[/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении.[/COLOR][/CENTER]',
		prefix: PIN_PREFIX,
		status: true,
	},
	{
		title: 'Будет разблокирован от КП',
		content:
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		'[CENTER]Благодарим за обращение. Относительно вашего заблокированного игрового аккаунта, наша команда разработки выявила использование уязвимости вами в игровой среде. В настоящее время ваш аккаунт был разблокирован, а предметы, полученные неправомерно, были удалены.[/CENTER]<br>' +
		"[CENTER]Мы призываем вас в будущем сообщать о подобных ситуациях и информировать технических специалистов, дабы избежать блокировки аккаунта. Напоминаем, что каждое нарушение влечет за собой наказание в виде временных ограничений или, возможно, даже перманентной блокировки аккаунта.[/CENTER]<br>" +
        "[CENTER]Благодарим за понимание и сотрудничество. Надеемся, что ваш опыт в игре станет более приятным и честным.[/CENTER]<br>" +
        '[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: 'Выдано верно',
        content:
        '[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
        '[CENTER]Проверив доказательства от Технического Специалиста, было принято решение:[/CENTER]<br>'+
        '[CENTER]Нарушений со стороны [COLOR=rgb(255, 69, 0)]Технического Специалиста[/COLOR] нет. [/CENTER]<br>'+
        '[CENTER]Наказание [COLOR=rgb(0, 255, 0)]выдано верно.[/COLOR][/CENTER]<br>'+
        '[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
	{
		title: 'Какие привязки?',
		content:
		'[SIZE=4][FONT=Veranda][CENTER]Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Какие привязки "Настройки безопасности" устанавливали на аккаунт именно вы? Пожалуйста, постарайтесь вспомнить и перечислить их.[/CENTER][/FONT][/SIZE]',
	},
	{
		title: 'Сбросьте пароль',
		content:
		'[CENTER]Пожалуйста, воспользуйтесь ботом ВКонтакте или Телеграмма для сброса пароля. После успешного выполнения действий, пожалуйста, сделайте скриншот, на котором будет отображено завершение процесса с ЗАМАЗАНЫМ паролем.[/CENTER]<br>'+
		'[CENTER]Ожидаю обратной связи в течении 24 часов![/CENTER]',
	},
    {
        title: 'Беседа с техом',
        content:
        '[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
        '[CENTER]С Техническим Специалистом будет проведена строгая профилактическая беседа.[/CENTER]<br>'+
        '[CENTER]Приносим свои извинения за предоставленные неудобства.[/CENTER]<br>' +
        '[CENTER]Благодарим вас за обращение![/CENTER]<br>' +
		'[COLOR=rgb(127, 255, 0)]Рассмотрено.[/COLOR][/CENTER]',
		prefix: WATCHED_PREFIX,
		status: false,
     },
    {
        title: 'Согласен с вердиктом теха',
        content:
        '[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
        '[CENTER]На основании имеющейся информации, решение специалиста признано корректным. Доказательства на каждое слово и действия имеются.[/CENTER]<br>'+
        '[CENTER]С учетом этого, решение выглядит обоснованным и справедливым, ссылаясь на правила проекта, попутно отвечая на Ваши вопросы.[/CENTER]<br>'+
        '[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
     {
        title: 'Купил/Продал ИВ 2.28',
        content:
        '[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
        '[CENTER]Проверив историю аккаунта данного игрока через систему логирования, я выяснил что он является продавцом игровой валюты а вы его очередной покупатель. <br><br>' +
        '[CENTER]Пытаться обмануть техническую администрацию аналогично нету смысла, с данными игроками вы никогда не взаимодействовали и взаимодействовать не могли. Ваши действия противоречат основным принципам нашей игры, созданной для увлекательного и справедливого игрового опыта всех пользователей, которые присоединяются к нашему проекту чтобы получить незабываемые впечатления от игры.  [/CENTER]<br><br>' +
        '[CENTER]На основании имеющейся информации, решение технического специалиста признано корректным. Нарушений с его стороны нету. Доказательства на каждое слово и действие имеются. С учетом этого, решение технического специалиста выглядит обоснованным и справедливым, ссылаясь на правила проекта и попутно отвечая на Ваши вопросы.  [/CENTER]<br><br>' +
        '[CENTER]Наша задача - обеспечить честную и справедливую среду для всех пользователей, и нарушение правил в отношении игровой валюты может нанести вред игровой экономике и репутации проекта.  [/CENTER]<br><br>'+
        '[CENTER]Вы совершили грубейшее  нарушение правил проекта, за что понесли заслуженное наказание от технических специалистов. Технический специалист действовал согласно должностным инструкциям, придерживаясь правила 2.28. Это правило имеет крайне серьезное значение, и мы призываем каждого участника соблюдать его безукоризненно.   [/CENTER]<br><br>'+
        '[CENTER]Мы также хотим вас проинформировать, что на данный момент обжалование по этому пункту правил отклонено. Важно понимать, что данный пункт не подлежит обжалованию, и каждый участник должен принять его как часть ответственности за свои действия.  [/CENTER]<br><br>'+
        '[CENTER]2.28. Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги | PermBan с обнулением аккаунта + ЧС проекта  [/CENTER]<br><br>'+
        '[CENTER]Для создания положительной и уважительной игровой атмосферы призываем каждого из вас проявлять сознательность и уважение к правилам. Вместе мы строим прекрасное и дружелюбное сообщество, которое уважает всех и каждого.  [/CENTER]<br><br>'+
        '[CENTER]С учетом всего сказанного, давайте будем бдительны и помнить, что соблюдение правил - это залог успешной и приятной игры для всех.[/CENTER]<br><br>'+
        '[CENTER]Технический специалист действовал согласно должностным инструкциям, вердикт и наказание верны.  [/CENTER]<br><br>'+
        '[CENTER]Помните, что ваше поведение в игре оказывает влияние на ее общую атмосферу и удовлетворение всех игроков.  [/CENTER]<br><br>'+
        '[CENTER]Наказание остается без изменений.[/CENTER]',
    },
    {
        title: 'Купил ИВ у бота 2.28',
        content:
        '[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
        '[CENTER]Вам поступила Игровая Валюта от игрока, который использовал Посторонее ПО, чтобы заработать Игрову Валюту, а затем ее продать. Вы же в свою очередь ее приобрели.[/CENTER]<br>' +
        '[CENTER]Вы нарушили правило пункта 2.28 общих правил проекта. [SPOILER="2.28"] 2.28.  Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги | PermBan с обнулением аккаунта + ЧС проекта [/SPOILER][/CENTER] <br>' +
        '[CENTER]Нарушений со стороны Технического Специалиста не обнаружено.[/CENTER]<br>' +
        '[CENTER]Технический Специалист действовал согласно регламенту.[/CENTER]<br>' +
        '[CENTER]Наказание остается без изменений.[/CENTER]<br>'+
        '[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: 'Обход системы 2.21',
        content:
        '[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
        '[CENTER]Вы нарушили правило пункта 2.21 общих правил проекта. [SPOILER="2.21"]2.21. Запрещено пытаться обходить игровую систему или использовать любые баги сервера | Ban 15 - 30 дней / PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов)[/SPOILER][/CENTER] <br>' +
        '[CENTER]Нарушений со стороны Технического Специалиста не обнаружено.[/CENTER]<br>' +
        '[CENTER]Технический Специалист действовал согласно регламенту.[/CENTER]<br>' +
        '[CENTER]Наказание остается без изменений.[/CENTER]<br>'+
        '[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: 'Продан/Передан 2.41',
        content:
        '[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
        '[CENTER]Вы нарушили правило пункта 2.41 общих правил проекта. [SPOILER="2.41"] 2.41. Передача своего личного игрового аккаунта третьим лицам | PermBan [/SPOILER][/CENTER] <br>' +
        '[CENTER]Нарушений со стороны Технического Специалиста не обнаружено.[/CENTER]<br>' +
        '[CENTER]Технический Специалист действовал согласно регламенту.[/CENTER]<br>' +
        '[CENTER]Наказание остается без изменений.[/CENTER]<br>'+
        '[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: 'Трансфер 4.05',
        content:
        '[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
        '[CENTER]Вы нарушили правило пункта 4.05 общих правил проекта.[SPOILER="4.05"]4.05. Запрещено передавать любые игровые ценности между игровыми аккаунтами, а также в целях удержания имущества | Ban 15 - 30 дней / PermBan[/SPOILER][/CENTER] <br>' +
        '[CENTER]Нарушений со стороны Технического Специалиста не обнаружено.[/CENTER]<br>' +
        '[CENTER]Технический Специалист действовал согласно регламенту.[/CENTER]<br>' +
        '[CENTER]Наказание остается без изменений.[/CENTER]<br>'+
        '[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: 'Аккаунт будет разблокирован',
        content:
        '[CENTER] Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
        '[CENTER] Ваш аккаунт будет разблокирован в течении 24 часов.[/CENTER]<br>' +
		'[CENTER]Закрыто[/CENTER]',
		 prefix: CLOSE_PREFIX,
        status: false,
     },
    {
        title: 'Забаненный IP',
        content:
        '[CENTER] Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
        '[CENTER] Вы попали на заблокированный айпи адрес. Ваш аккаунт не находится в блокировке. Переживать не стоит. Причиной попадания в данную ситуацию могло быть разное, например, смена мобильного интернета, переезд и тому подобное. [/CENTER]<br>'+
        '[CENTER] Чтобы избежать данную ситуацию, вам необходимо перезагрузить телефон или воспользоваться услугами VPN. Приносим свои извинения за доставленные неудобства. [/CENTER]<br>'+
        '[CENTER] Желаем приятного времяпровождения на нашем проекте.[/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
     {
        title: 'Не подлежит обж',
		content:
		'[CENTER] Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		"[CENTER] Мы рады, что вы осознали свои ошибки. Настоятельно рекомендуем вам изучить правила проекта.<br>" +
        '[CENTER] Мы также хотим вас проинформировать, что на данный момент обжалование по этому пункту правил отклонено. Важно понимать, что данный пункт не подлежит обжалованию, и каждый участник должен принять его как часть ответственности за свои действия.[/CENTER]<br>' +
        '[CENTER] Надеюсь, что данная ситуация станет для вас уроком и в будущем, вы больше не будете нарушать правила проекта.[/CENTER]<br>' +
        '[CENTER]В обжаловании отказано.[/CENTER]<br>' +
		'[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
     {
        title: 'Разбл. не подл.',
		content:
		'[CENTER] Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		"[CENTER] Благодарим за ваше обращение. <br>" +
        '[CENTER] Мы тщательно рассмотрели его. Проверили всевозможные варианты, которые могли привести к блокировке. После детальной проверки было вынесен следующий вердикт:[/CENTER]<br>' +
        '[CENTER] По истечению времени разблокировка аккаунта невозможна.[/CENTER]<br>' +
        '[CENTER] Аккаунт разблокировке не подлежит [/CENTER]<br>' +
		'[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
        title: 'В ОБЖ отказано',
        content:
        '[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
        '[CENTER]К сожалению, мы не готовы пойти к вам на встречу и снизить наказание. Мы рады, что вы осознали свою ошибку.[/CENTER]<br>' +
        '[CENTER]Рекомендуем вам ознакомиться с правилами проекта, чтобы такого больше не повторилось. Мы очень надеемся, что данная ситуация станет для вас уроком.[/CENTER]<br>' +
        '[CENTER]В обжаловании [COLOR=rgb(255, 0, 0)]отказано.[/CENTER][/COLOR]<br>' +
		'[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
        title: 'ОБЖ одобрено',
        content:
        '[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
        '[CENTER]Мы рассмотрели ваше обжалование, и пришли к вердикту, что срок блокировки аккаунта будет будет сокращён.[/CENTER]<br>' +
        '[CENTER]Рекомендуем вам ознакомиться с [URL= https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/#post-25703465]правилами проекта[/URL](кликабельно), чтобы такого больше не повторилось. Мы очень надеемся, что данная ситуация станет для вас уроком.[/CENTER]<br>' +
        '[CENTER]К сожалению, мы не всегда сможем пойти к вам на встречу и обжаловать/амнистировать вас.[/CENTER]<br>' +
        '[CENTER]Благодарим вас за обращение![/CENTER]<br>' +
        '[CENTER][COLOR=rgb(127, 255, 0)]Рассмотрено.[/COLOR][/CENTER]',
		prefix: WATCHED_PREFIX,
		status: false,
    },
	{
        title: 'Дубль Темы',
		content:
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		"[CENTER]Данная тема является <u>дубликатом вашей предыдущей темы</u>.<br>Пожалуйста, <b>прекратите создавать идентичные или похожие темы - иначе Ваш форумный аккаунт может быть заблокирован</b>.<br><br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]',
		prefix: CLOSE_PREFIX,
		status: false,
     },
	 {
        title: 'Доква трансфер',
		content:
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		'[CENTER]Доказать отсутствие трансфера можно доказать одним способом.<br>Вы должны взять 2 устройства, зайти на аккаунты и сделать фотографию окон блокировки на двух устройствах.<br><br><B>Важно, чтобы в кадр попало 2 устройства и окна блокировки.</B><br>Ожидаю вашего ответа. [/CENTER]<br><br>'+
		'[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении.[/COLOR][/CENTER]',
		prefix: PIN_PREFIX,
		status: true,
	},
	{
        title: 'Нет окна блокировки',
		content:
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		"[CENTER]Без окна о блокировке тема не подлежит рассмотрению - создайте новую тему, приложив окно блокировки с фото-хостинга<br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL]<br>(все кликабельно).<br>" +
        '[CENTER]Благодарим вас за обращение![/CENTER]<br>' +
		'[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
        title: 'Срок подачи жб',
		content:
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		'[CENTER]С момента выдачи наказания от технического специалиста прошло более 7-ми дней.<br>Пересмотр/изменение меры наказания новозможно, вы можете попробывать написать обжалование через N-ый промежуток времени.<br><br>Обращаем ваше внимание на то, что некоторые наказания не подлежат не обжалованию,амнистии.[/center]<br><br>'+
		'[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]',
		 prefix: CLOSE_PREFIX,
		 status: false,
    },
	{
		title: 'Восст.доступа к аккаунту',
		content:
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		"[CENTER]Если Вы обезопасили Ваш аккаунт и [U]привязали его к странице во ВКонтакте[/U], то сбросить пароль или пин-код Вы всегда сможете обратившись в официальное сообщество проекта - https://vk.com/blackrussia.online.<br> Либо в телеграмм бот - https://t.me/br_helper_bot.<br> Напишите «Начать» в личные сообщения группы/бота, затем выберите нужные Вам функции.<br><br>" +
		"[CENTER]Если Вы обезопасили Ваш аккаунт и [U]привязали его к почте[/U], то сбросить пароль или пин-код Вы всегда сможете при вводе пароля на сервере. После подключения к серверу нажмите на кнопку «Войти в аккаунт», затем выберите кнопку «Восстановить пароль», после чего на Вашу почту будет отправлено письмо с одноразовым кодом восстановления.<br><br>" +
		"[CENTER]Если Вы [U]не обезопасили свой аккаунт - его невозможно вернуть[/U]. Игрок самостоятельно несет отвественность за безопаность своего аккаунта.<br><br>" +
		'[CENTER]Надеемся, что Вы сможете восстановить доступ к аккаунту!<br>' +
        '[CENTER]Благодарим вас за обращение![/CENTER]<br>' +
		'[CENTER][COLOR=rgb(127, 255, 0)]Рассмотрено.[/COLOR][/CENTER]',
		prefix: WATCHED_PREFIX,
		status: false,
	},
{
		title: 'Донат',
		content:
		'[SIZE=4][FONT=Courier new][CENTER]Приветствую, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		'[CENTER]Мы рассмотрели ваш запрос о возврате денежных средств и сообщаем следующее.<br><br>' +
		'[SIZE=4][FONT=Courier new][CENTER]Запуская игру, пользователь <u>соглашается с правилами её использования</u>, которые изложены в <u>Пользовательском соглашении</u>, что по смыслу ст. 435 и 438 Гражданского кодекса РФ является принятием (акцептом) оферты Компании https://blackrussia.online/oferta.php, а равно заключением договора.<br><br>Согласно Пользовательскому соглашению <u>«Внутриигровая валюта» – виртуальная внутриигровая валюта</u>, являющаяся неактивированными данными и командами, которая не имеет денежной стоимости и не подлежит денежной оценке, хотя и имеет цену на момент приобретения.<br>' +
		'[SIZE=4][FONT=Courier new][CENTER]Согласно п. Политика возврата платежей, Пользовательского соглашения денежные средства за внутриигровые товары не подлежат возврату с момента появления Внутриигровой валюты на счете аккаунта.<br>' +
		'[SIZE=4][FONT=Courier new][CENTER]Согласно п. Политика возврата платежей, Пользовательского соглашения пользователь самостоятельно следит за безопасностью своего аккаунта, сам несет ответственность за все действия, которые выполняются в сервисах с помощью его аккаунта, а также в нем самом.<br>' +
		'[SIZE=4][FONT=Courier new][CENTER]Согласно п. Политика возврата платежей, Пользовательского соглашения пользователь гарантирует, что он имеет право использовать выбранные им платежные средства, не нарушая при этом законодательства РФ и/или законодательства иной страны, гражданином которой является пользователь, и прав третьих лиц.<br>' +
		'[SIZE=4][FONT=Courier new][CENTER]Компания /u>не несет ответственности за возможный ущерб третьим лицам</u>, причиненный в результате использования пользователем не принадлежащих ему средств оплаты.<br><br> ' +
		'[SIZE=4][FONT=Courier new][CENTER]</u>Совершая покупки внутри игры</u>, а также предоставляя платежную информацию, Вы гарантируете, что являетесь законным владельцем платёжного средства и аккаунта, связанного с данным платежом.<br><br>' +
		'[SIZE=4][FONT=Courier new][CENTER]Все действия с картой считаются совершенными с Вашего ведома и согласия, то есть лично владельцем карты.<br><br>' +
		'[SIZE=4][FONT=Courier new][CENTER]Кроме того, в соответствии законодательством РФ родители несут имущественную ответственность по сделкам малолетнего, в том числе по сделкам, совершенным им самостоятельно.<br>' +
		'[SIZE=4][FONT=Courier new][CENTER]Таким образом, если Вы являетесь законными представителем, Вы отвечаете за действия ребёнка внутри игры. Компания не может отслеживать действия несовершеннолетнего и нести за них ответственность.<br><br>' +
		'[SIZE=4][FONT=Courier new][CENTER]Таким образом основания для возврата денежных средств отсутствуют.<br>' +
		'[CENTER][I]Решено[/I].[/CENTER][/FONT][/SIZE]',
	 prefix: DECIDED_PREFIX,
	 status: false,
	},
{
		title: 'Если нет скринов/видео',
		content:
		'[SIZE=4][FONT=Courier new][CENTER]Приветствую, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]Без доказательств (в частности скриншоты или видео) – решить проблему не получится. Если доказательства найдутся - создайте новую тему, приложив доказательства с фото-хостинга<br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL]<br>(все кликабельно).<br>" +
		'[CENTER][I][COLOR=rgb(255, 255, 255)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
        title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ Чистка от оффтопа ЖБ на техᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
    },
	{
        title: 'Форма подачи "ЖБ НА ТЕХ"',
		content:
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		"[CENTER]Пожалуйста, заполните форму, создав новую тему: Название темы с NickName технического специалиста<br>Пример:<br> Lev_Kalashnikov | махинации<br>Форма заполнения темы:<br>[code]01. Ваш игровой никнейм:<br>02. Игровой никнейм технического специалиста:<br>03. Сервер, на котором Вы играете:<br>04. Описание ситуации (описать максимально подробно и раскрыто):<br>05. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>06. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/code]<br>" +
        '[CENTER]Благодарим вас за обращение![/CENTER]<br>' +
		'[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Правила раздела жб на тех',
		content:
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		"[CENTER]Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела в котором Вы создали тему, так как Ваш запрос не относится к жалобам на технических специалистов.<br>Что принимается в данном разделе:<br>Жалобы на технических специалистов, оформленные по форме подачи и не нарушающие правила подачи:<br> [FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Правила подачи жалобы на технических специалистов[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[QUOTE][FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01.[/COLOR] Ваш игровой никнейм:[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]<br>02.[/COLOR] Игровой никнейм технического специалиста:[COLOR=rgb(226, 80, 65)]<br>03.[/COLOR] Сервер, на котором Вы играете:[COLOR=rgb(226, 80, 65)]<br>04.[/COLOR] Описание ситуации (описать максимально подробно и раскрыто):[COLOR=rgb(226, 80, 65)]<br>05.[/COLOR] Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):[COLOR=rgb(226, 80, 65)]<br>06.[/COLOR] Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/SIZE][/FONT][/SIZE][/QUOTE]<br><br>[FONT=verdana][SIZE=4][FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]Примечание:[/COLOR] все оставленные заявки обращения в данный раздел обязательно должны быть составлены по шаблону предоставленному немного выше.<br>В ином случае, заявки обращения в данный раздел составленные не по форме — будут отклоняться.<br>Касательно названия заголовка темы — четких правил нет, но, желательно чтобы оно содержало лишь никнейм и сервер технического специалиста.<br>Заранее, настоятельно рекомендуем ознакомиться [U][B][URL='https://forum.blackrussia.online/index.php?forums/faq.231/']с данным разделом[/URL][/B][/U].[/SIZE][/FONT][/SIZE][/FONT]<br>[CENTER][FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Какие жалобы не проверяются?[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]—[/COLOR] Если в содержании темы присутствует оффтоп/оскорбления.<br>[SIZE=4][COLOR=rgb(226, 80, 65)]—[/COLOR] Если в заголовке темы отсутствует никнейм технического специалиста.<br>[COLOR=rgb(226, 80, 65)]—[/COLOR] С момента выдачи наказания прошло более 7 дней.[/SIZE][/SIZE][/FONT]<br>" +
        '[CENTER]Благодарим вас за обращение![/CENTER]<br>' +
		'[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
        title: 'В Тех. Раздел',
		content:
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		'[CENTER]Ваше обращение не относится к разделу «Жалобы на Технических Специалистов».<br>' +
        '[CENTER]Пожалуйста, обратитесь с данной темой в «Технический Раздел вашего сервера» - [URL= https://forum.blackrussia.online/index.php?forums/Технический-раздел.22/]Кликабельно.[/URL]<br><br>' +
		'[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Жб на адм',
		content:
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		'[CENTER]Вы получили наказание от Администратора сервера. Ваше обращение не относится к разделу «Жалобы на Технических Специалистов».<br>' +
        '[CENTER]Пожалуйста, обратитесь в раздел «Жалобы на администрацию» вашего сервера.<br>Форма для подачи жалобы - [URL= https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/]Кликабельно.[/URL]<br>' +
		'[CENTER]Благодарим вас за обращение![/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]',
	     prefix: CLOSE_PREFIX,
	     status: false,
    },
	{
		title: 'ЖБ на игроков',
		content:
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		"[CENTER]Данная тема не относится к разделу «Жалобы на Технических Специалистов».Данное действие было совершено игроком и нарушает правила сервера, пожалуйста обратитесь в «Жалобы на игроков» вашего сервера.<br>Форма подачи жалобы - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/']Клик[/URL]" +
		'[CENTER]Благодарим вас за обращение![/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
		title: 'ОБЖ Наказания от адм',
		content:
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		"[CENTER]Вы получили наказание от администратора своего сервера.<br> Для его снижения блокировки вам нужно обратиться в раздел <br>«Обжалования» вашего сервера.<br>Форма подачи темы находится здесь - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']Кликабельно.[/URL]" +
		'[CENTER]Благодарим вас за обращение![/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
        title: 'НЕ ОТНОСИТСЯ',
		content:
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		"[CENTER]Ваше обращение не относится к жалобам на технических специалистов.<br> Пожалуйста ознакомьтесь с правилами данного раздела: [URL='https://forum.blackrussia.online/forums/Информация-для-игроков.231/']Кликабельно.[/URL] <br>" +
        '[CENTER]Благодарим вас за обращение![/CENTER]<br>' +
		'[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]',
		 prefix: UNACCEPT_PREFIX,
		 status: false,
	},
{
        title: 'Слоты в фаму',
		content:
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		"[CENTER]Семейный слот - не является элементом рыночных отношений.<br> Системно его передача, покупка напрямую другим игрокам не предусмотрена.<br>" +
        '[CENTER]Данное действие приравнивается к пункту 2.28, на первый раз предупреждаю, но в следующий раз ваш аккаунт и аккаунт игрока при данный действий будет заблокирован за 2.28.[/CENTER]<br>' +
		'[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]',
		 prefix: UNACCEPT_PREFIX,
		 status: false,
	},
{
		title: 'Отсутствие ответа',
		content:
		'[SIZE=4][FONT=Courier new][CENTER]Приветствую, уважаемый[B] {{ user.mention }}[/B]![/CENTER]<br><br>' +
		"[CENTER]По техническими соображениям было принято решение закрыть данное обращение.<br><br>" +
		"[CENTER]Если данная проблема все ещё актуальна, пожалуйста оставьте новую заявку в данном разделе ещё раз.<br>" +
		'[CENTER][I][COLOR=rgb(255, 255, 255)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрении', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 173, 51, 0.5);');
    addButton('Тех. Спец', 'techspec', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(17, 92, 208, 0.5);');
	addButton('Рассмотрено', 'watched', 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(110, 192, 113, 0.5)');
	addButton('Решено', 'decided', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(110, 192, 113, 0.5);');
    addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);');
	addButton('Закрыто', 'closed', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);');
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

    function addButton(name, id, style) {
         $('.button--icon--reply').before(
	`<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`,
	);
	}
	function addAnswers() {
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 5px; margin-top: 10px; border-radius: 13px;">ОТВЕТЫ</button>`,
	);
	}

	function buttonsMarkup(buttons) {
	return `<div class="select_answer">${buttons
	.map(
	(btn, i) =>
	`<button id="answers-${i}" class="button--primary button ` +
	`rippleButton" style="margin:4px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
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