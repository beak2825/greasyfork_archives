// ==UserScript==
// @name         Для Кураторов/Заместителей
// @namespace    https://forum.blackrussia.online
// @version      1.10
// @description  For Curators and Deputy Curators
// @author       Salat Kalashnikov
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license      MIT
// @collaborator Salat Kalashnikov
// @icon https://sun6-23.userapi.com/s/v1/ig1/Bg7Sgc3yqNZ1F5YedeolIhnyRKIclMmKRAjpf9Rzj0XKAsgR9fLgLgNB3TUBDBF_N7XKKgPK.jpg?size=2155x2155&quality=96&crop=2,2,2155,2155&ava=1
// @downloadURL https://update.greasyfork.org/scripts/477584/%D0%94%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%D0%97%D0%B0%D0%BC%D0%B5%D1%81%D1%82%D0%B8%D1%82%D0%B5%D0%BB%D0%B5%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/477584/%D0%94%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%D0%97%D0%B0%D0%BC%D0%B5%D1%81%D1%82%D0%B8%D1%82%D0%B5%D0%BB%D0%B5%D0%B9.meta.js
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
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		'[CENTER] Сюда текст [/CENTER]',
    },
	{
        title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ Рассмотрение Жалоб на Теховᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
    },
	{
        title: 'На рассмотрении',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		'[CENTER]Ваша тема взята на рассмотрение.[/CENTER]<br>',
		prefix: PIN_PREFIX,
		status: true,
	},
	{
        title: 'На рассмотрении у Тех.Спец',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		'[CENTER]Ваша тема взята на рассмотрение.[/CENTER]<br>' +
        '[CENTER]Просьба ожидать ответа от Технического Специалиста.[/CENTER]<br>' +
        '[CENTER]Иногда рассмотрение темы может занять определенное время.[/CENTER]<br>' +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
        '[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении.[/COLOR][/CENTER]',
		prefix: TECHADM_PREFIX,
		status: true,
	},
	{
        title: 'Передано Руководству',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		'[CENTER]Ваша тема закреплена и ожидает вердикта моего руководства. Создавать подобные темы не нужно, пожалуйста, ожидайте ответа.[/CENTER]<br>',
		prefix: COMMAND_PREFIX,
		status: true,
	},
	{
        title: 'Выдано верно',
        content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
        '[CENTER]Технический специалист предоставил доказательства вашего нарушения. После проверки доказательств было принято решение, что наказание, выданное техническим специалистом, является верным.[/CENTER]<br>'+
        '[CENTER]Нарушений со стороны Технического специалиста нет. [/CENTER]<br>'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
        '[CENTER]Наказание выдано верно, [COLOR=rgb(255, 0, 0)]закрыто.[/COLOR][/CENTER]<br>',
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: 'Беседа с техом',
        content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
        '[CENTER]С Техническим Специалистом будет проведена строгая профилактическая беседа.[/CENTER]<br>'+
        '[CENTER]Приносим свои извинения за предоставленные неудобства.[/CENTER]<br>' +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
		'[COLOR=rgb(127, 255, 0)]Рассмотрено.[/COLOR][/CENTER]',
		prefix: WATCHED_PREFIX,
		status: false,
     },
     {
        title: 'Купил ИВ у игрока',
        content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
        '[CENTER]Благодарим вас за обратную связь. Ваше обращение было принято к рассмотрению, и мы вынесли следующий вердикт.[/CENTER]<br><br>'+
        '[CENTER]Была проведена повторная проверка. В ходе которой было выявлено следующее:<br><br>' +
        '[CENTER]4.01. Создавая игровой аккаунт на нашем проекте, игрок автоматически соглашается со всеми правилами проекта.<br><br>' +
        '[CENTER]Вам на банковский счёт неоднократно переводились денежные средства от продавцов игровой валют. Ошибки в переводе быть не может, после перевода деньги благополучно снимались. Об ошибочном переводе вы никому не сообщали. Исходя из вышеперечисленного делаю вывод, что вы знали от кого и с какой целью вам переводяться денежные средства. Соответственно вы предполагали тот вариант, что ваш игровой аккаунт может быть заблокированным, но почему-то сослались на некомпетентность технического специалиста или же, что данное действие Вам сойдёт с рук. Мы понимаем, что блокировка аккаунта приносит вам не самые лучшие эмоции, но хочу вам напомнить, что ваш аккаунт был заблокирован из-за ваших отрицательных действий, которые в дальнейшем могли испортить экономику сервера. <br><br>' +
        '[CENTER]Пытаться обмануть техническую администрацию аналогично нету смысла, с данными игроками вы никогда не взаимодействовали и взаимодействовать не могли. Ваши действия противоречат основным принципам нашей игры, созданной для увлекательного и справедливого игрового опыта всех пользователей, которые присоединяются к нашему проекту чтобы получить незабываемые впечатления от игры.<br><br>' +
        '[CENTER]На основании имеющейся информации, решение технического специалиста признано корректным. Нарушений с его стороны нету. Доказательства на каждое слово и действие имеются. С учетом этого, решение технического специалиста выглядит обоснованным и справедливым, ссылаясь на правила проекта и попутно отвечая на Ваши вопросы.<br><br>' +
        '[CENTER]Наша задача - обеспечить честную и справедливую среду для всех пользователей, и нарушение правил в отношении игровой валюты может нанести вред игровой экономике и репутации проекта.<br><br>' +
        '[CENTER]Вы совершили грубейшее нарушение правил проекта, за что понесли заслуженное наказание от технических специалистов. Технический специалист действовал согласно должностным инструкциям, придерживаясь правила 2.28. Это правило имеет крайне серьезное значение, и мы призываем каждого участника соблюдать его безукоризненно. <br><br>' +
        '[CENTER]Мы также хотим вас проинформировать, что на данный момент обжалование по этому пункту правил отклонено. Важно понимать, что данный пункт не подлежит обжалованию, и каждый участник должен принять его как часть ответственности за свои действия.<br><br>' +
        '[CENTER]Для создания положительной и уважительной игровой атмосферы призываем каждого из вас проявлять сознательность и уважение к правилам. Вместе мы строим прекрасное и дружелюбное сообщество, которое уважает всех и каждого.<br><br>' +
        '[CENTER]С учетом всего сказанного, давайте будем бдительны и помнить, что соблюдение правил - это залог успешной и приятной игры для всех.<br><br>' +
        '[CENTER]Технический специалист действовал согласно должностным инструкциям, вердикт и наказание верны. В независимости от того, хотели Вы купить-продать или просто поинтересоваться, наказание предусмотрено по пункту 2.28 правил, Выше приложил описание. Любые шутки на тему покупки/продажи игровой валюты также наказуемы.<br><br>' +
        '[CENTER]Помните, что ваше поведение в игре оказывает влияние на ее общую атмосферу и удовлетворение всех игроков.<br><br>' +
         "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
        '[CENTER][COLOR=rgb(255,0,0)]Наказание остается без изменений.[/COLOR][/CENTER]<br>',
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: 'Покупка ИВ у бота',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		'[CENTER]На ваш банковский счет поступили денежные средства от Ботовода. Бот – это программа, задачей которой является выполнение определенных функций с целью заработать игровую валюту для последующей продажи. В результате, на ваш счет были зачислены игровые средства.[/CENTER]<br><br>' +
        '[CENTER]Прошло некоторое время, и вы без колебаний решили снять эти средства с банковского счета. Это было ожидаемо, так как вы знали о предстоящем переводе.[/CENTER]<br><br>' +
        '[CENTER]Следует отметить, что в наше время использование ботов для заработка игровой валюты становится все более распространенным явлением. Однако важно помнить, что подобные операции могут повлечь за собой нарушение пункта правил 2.28.[/CENTER]<br><br>' +
        '[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG][/CENTER]<br>' +
        "[CENTER][COLOR=rgb(255,0,0)]Отказано.[/COLOR][/CENTER]<br>",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
        title: 'Обход системы 2.21',
        content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
        '[CENTER]Технический специалист предоставил доказательства вашего нарушения. После проверки доказательств было принято решение, что наказание, выданное техническим специалистом, является верным.[/CENTER]<br>'+
        '[CENTER]Вы нарушили правило пункта 2.21 общих правил проекта. [SPOILER="2.21"][COLOR=rgb(255, 0, 0)]2.21. [/COLOR]Запрещено пытаться обходить игровую систему или использовать любые баги сервера | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов)[/COLOR][/SPOILER][/CENTER] <br>' +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
        '[CENTER]Наказание выдано верно, [COLOR=rgb(255, 0, 0)]закрыто.[/COLOR][/CENTER]<br>',
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: 'Продан/Передан 2.41',
        content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
        '[CENTER]Технический специалист предоставил доказательства вашего нарушения. После проверки доказательств было принято решение, что наказание, выданное техническим специалистом, является верным.[/CENTER]<br>'+
        '[CENTER]Вы нарушили правило пункта 2.41 общих правил проекта. [SPOILER="2.41"][COLOR=rgb(255, 0, 0)]2.41. [/COLOR]Передача своего личного игрового аккаунта третьим лицам | [COLOR=rgb(255, 0, 0)]PermBan[/COLOR][/SPOILER][/CENTER] <br>' +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
        '[CENTER]Наказание выдано верно, [COLOR=rgb(255, 0, 0)]закрыто.[/COLOR][/CENTER]<br>',
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: 'Трансфер 4.05',
        content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
        '[CENTER]Технический специалист предоставил доказательства вашего нарушения. После проверки доказательств было принято решение, что наказание, выданное техническим специалистом, является верным.[/CENTER]<br>'+
        '[CENTER]Вы нарушили правило пункта 4.05 общих правил проекта.[SPOILER="4.05"][COLOR=rgb(255, 0, 0)]4.05.[/COLOR] Запрещено передавать любые игровые ценности между игровыми аккаунтами, а также в целях удержания имущества | [COLOR=rgb(255, 0, 0)]Ban 15 - 30 дней / PermBan[/COLOR][/SPOILER][/CENTER] <br>' +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
        '[CENTER]Наказание выдано верно, [COLOR=rgb(255, 0, 0)]закрыто.[/COLOR][/CENTER]<br>',
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
         title: 'Заблокированный IP',
        content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
        '[CENTER]Вы попали на заблокированный айпи адрес. Ваш аккаунт не находится в блокировке, переживать не стоит. Причиной попадания в данную ситуацию могло быть разное, например, смена мобильного интернета, переезд и тому подобное. Чтобы избежать данную ситуацию, вам необходимо перезагрузить телефон или воспользоваться услугами VPN.[/CENTER] <br>' +
        '[CENTER]Приносим свои извинения за доставленные неудобства. Желаем приятного времяпровождения на нашем проекте.[/CENTER] <br>' +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
		'[COLOR=rgb(127, 255, 0)]Рассмотрено.[/COLOR][/CENTER]',
		prefix: WATCHED_PREFIX,
		status: false,
     },
     {
        title: 'Чужая привязка',
        content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
        '[CENTER]К сожалению, обнаружена чужая привязка к вашему аккаунту, что может представлять угрозу для безопасности данных. В данной ситуации нам, к сожалению, не удастся разблокировать ваш аккаунт. Для обеспечения безопасности рекомендуется создать новый аккаунт и принять все возможные меры по защите данных. Наша команда технических специалистов настоятельно рекомендует вам установить дополнительные меры безопасности, такие как двухфакторную аутентификацию, сложные пароли и регулярное обновление паролей. [/CENTER] <br><br>' +
        '[CENTER]Пожалуйста, будьте внимательны при создании нового аккаунта и храните данные доступа в надежном месте. Мы приносим извинения за возможные неудобства, связанные с этой ситуацией, и стараемся обеспечить безопасность всех наших пользователей. [/CENTER]<br>' +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
        title: 'Аккаунт разблокирован',
        content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
        '[CENTER]Ваш аккаунт был успешно разблокирован. [/CENTER]<br>' +
        '[CENTER]Ошибки со стороны технического специалиста иногда случаются, это нормально. [/CENTER]<br>' +
        '[CENTER]Надеемся, что в процессе разблокировки никакое имущество не слетело в государство.[/CENTER]<br>' +
        '[CENTER]Если возникли проблемы с имуществом, пожалуйста, создайте новую тему для обсуждения компенсации. [/CENTER]<br>' +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
		'[COLOR=rgb(127, 255, 0)]Рассмотрено.[/COLOR][/CENTER]',
		prefix: WATCHED_PREFIX,
		status: false,
     },
     {
        title: 'Не подлежит обж',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		'[CENTER]Мы рады, что вы осознали свою ошибку. Блокировка вашего аккаунта содержит серьёзное нарушение правил сервера.<br>Вы получили блокировку за серьезное нарушение, мы не в силах снизить срок вашего наказания/обнулить.<br><br>' +
        '[CENTER]Рекомендуем вам ознакомиться с правилами проекта, чтобы такого больше не повторилось. Мы надеемся, что вы понимаете данную ситуацию и не возникнет никаких претензий.[/CENTER]<br>' +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
        '[CENTER]В обжаловании отказано.[/CENTER]<br>',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
        title: 'В ОБЖ отказано',
        content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
        '[CENTER]Мы рады, что вы осознали свою ошибку.[/CENTER]<br>' +
        '[CENTER]Рекомендуем вам ознакомиться с правилами проекта, чтобы такого больше не повторилось. Мы надеемся, что вы понимаете данную ситуацию и не возникнет никаких претензий.[/CENTER]<br><br>' +
        '[CENTER]На данный момент мы не готовы снизить срок блокировки или разблокировать аккаунт.[/CENTER]<br>' +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
        '[CENTER]В обжаловании отказано.[/CENTER]<br>',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
        title: 'ОБЖ одобрено',
        content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
        '[CENTER]Мы рассмотрели ваше обжалование, и пришли к вердикту, что срок блокировки аккаунта будет будет сокращён.[/CENTER]<br>' +
        '[CENTER]Рекомендуем вам ознакомиться с [URL= https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/#post-25703465]правилами проекта[/URL](кликабельно), чтобы такого больше не повторилось. Мы очень надеемся, что данная ситуация станет для вас уроком.[/CENTER]<br>' +
        '[CENTER]К сожалению, мы не всегда сможем пойти к вам на встречу и обжаловать/амнистировать вас.[/CENTER]<br>' +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
        '[CENTER][COLOR=rgb(127, 255, 0)]Рассмотрено.[/COLOR][/CENTER]',
		prefix: WATCHED_PREFIX,
		status: false,
    },
	{
        title: 'Дубль Темы',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		"[CENTER]Данная тема является дубликатом вашей предыдущей темы. Пожалуйста, прекратите создавать идентичные или похожие темы - иначе Ваш форумный аккаунт может быть заблокирован. На первый раз предупреждение будет устное, при повторном дублировании на ваш аккаунт будет выдвинуты санкции в виде штрафных баллов. При последующих нарушениях ваш формный аккаунт будет заблокирован. <br>" +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]',
		prefix: UNACCEPT_PREFIX,
		status: false,
     },
	 {
        title: 'Нет окна блокировки',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		"[CENTER]Без окна о блокировке тема не подлежит рассмотрению - создайте новую тему, приложив окно блокировки с фото-хостинга<br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL]<br>(все кликабельно).<br>" +
        '[CENTER]Благодарим вас за обращение![/CENTER]<br>' +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
        title: 'Срок подачи жб',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		'[CENTER]С момента выдачи наказания от технического специалиста прошло более 14-и дней.<br>Пересмотр/изменение меры наказания новозможно, вы можете попробывать написать обжалование через N-ый промежуток времени.<br><br>Обращаем ваше внимание на то, что некоторые наказания не подлежат не обжалованию,амнистии.[/center]<br><br>'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
        '[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]',
		prefix: UNACCEPT_PREFIX,
		status: false,
    },
	{
        title: 'Нет ответа от игрока',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		"[CENTER]К сожалению, ответа от вас так и не поступило. <br>Пожалуйста, создайте новую тему, если вы все ещё не согласны с выданным наказанием.<br>" +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Восст. доступа к аккаунту',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		"[CENTER]Если Вы обезопасили Ваш аккаунт и [U]привязали его к странице во ВКонтакте[/U], то сбросить пароль или пин-код Вы всегда сможете обратившись в официальное сообщество проекта - https://vk.com/blackrussia.online.<br> Либо в телеграмм бот - https://t.me/br_helper_bot.<br> Напишите «Начать» в личные сообщения группы/бота, затем выберите нужные Вам функции.<br><br>" +
		"[CENTER]Если Вы обезопасили Ваш аккаунт и [U]привязали его к почте[/U], то сбросить пароль или пин-код Вы всегда сможете при вводе пароля на сервере. После подключения к серверу нажмите на кнопку «Войти в аккаунт», затем выберите кнопку «Восстановить пароль», после чего на Вашу почту будет отправлено письмо с одноразовым кодом восстановления.<br><br>" +
		"[CENTER]Если Вы [U]не обезопасили свой аккаунт - его невозможно вернуть[/U]. Игрок самостоятельно несет отвественность за безопаность своего аккаунта.<br><br>" +
		'[CENTER]Надеемся, что Вы сможете восстановить доступ к аккаунту!<br>' +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
		'[CENTER][COLOR=rgb(127, 255, 0)]Рассмотрено.[/COLOR][/CENTER]',
		prefix: WATCHED_PREFIX,
		status: false,
	},
	{
        title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ Чистка от оффтопа ЖБ на техᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
    },
	{
        title: 'Форма подачи "ЖБ НА ТЕХ"',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		"[CENTER]Пожалуйста, заполните форму, создав новую тему: Название темы с NickName технического специалиста<br>Пример:<br> Lev_Kalashnikov | махинации<br>Форма заполнения темы:<br>[code]01. Ваш игровой никнейм:<br>02. Игровой никнейм технического специалиста:<br>03. Сервер, на котором Вы играете:<br>04. Описание ситуации (описать максимально подробно и раскрыто):<br>05. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>06. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/code]<br>" +
        '[CENTER]Благодарим вас за обращение![/CENTER]<br>' +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
        '[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Правила раздела ЖБ на тех',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		"[CENTER]Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела в котором Вы создали тему, так как Ваш запрос не относится к жалобам на технических специалистов.<br>Что принимается в данном разделе:<br>Жалобы на технических специалистов, оформленные по форме подачи и не нарушающие правила подачи:<br> [FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Правила подачи жалобы на технических специалистов[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[QUOTE][FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01.[/COLOR] Ваш игровой никнейм:[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]<br>02.[/COLOR] Игровой никнейм технического специалиста:[COLOR=rgb(226, 80, 65)]<br>03.[/COLOR] Сервер, на котором Вы играете:[COLOR=rgb(226, 80, 65)]<br>04.[/COLOR] Описание ситуации (описать максимально подробно и раскрыто):[COLOR=rgb(226, 80, 65)]<br>05.[/COLOR] Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):[COLOR=rgb(226, 80, 65)]<br>06.[/COLOR] Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/SIZE][/FONT][/SIZE][/QUOTE]<br><br>[FONT=verdana][SIZE=4][FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]Примечание:[/COLOR] все оставленные заявки обращения в данный раздел обязательно должны быть составлены по шаблону предоставленному немного выше.<br>В ином случае, заявки обращения в данный раздел составленные не по форме — будут отклоняться.<br>Касательно названия заголовка темы — четких правил нет, но, желательно чтобы оно содержало лишь никнейм и сервер технического специалиста.<br>Заранее, настоятельно рекомендуем ознакомиться [U][B][URL='https://forum.blackrussia.online/index.php?forums/faq.231/']с данным разделом[/URL][/B][/U].[/SIZE][/FONT][/SIZE][/FONT]<br>[CENTER][FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Какие жалобы не проверяются?[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]—[/COLOR] Если в содержании темы присутствует оффтоп/оскорбления.<br>[SIZE=4][COLOR=rgb(226, 80, 65)]—[/COLOR] Если в заголовке темы отсутствует никнейм технического специалиста.<br>[COLOR=rgb(226, 80, 65)]—[/COLOR] С момента выдачи наказания прошло более 7 дней.[/SIZE][/SIZE][/FONT]<br>" +
        '[CENTER]Благодарим вас за обращение![/CENTER]<br>' +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
        title: 'В Тех. Раздел',
		content:
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[CENTER]Ваше обращение не относится к разделу «Жалобы на Технических Специалистов».<br>' +
        '[CENTER]Пожалуйста, обратитесь с данной темой в «Технический Раздел вашего сервера» - [URL= https://forum.blackrussia.online/index.php?forums/Технический-раздел.22/]Кликабельно.[/URL]<br><br>' +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
        '[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Жб на адм',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		'[CENTER]Вы получили наказание от Администратора сервера. Ваше обращение не относится к разделу «Жалобы на Технических Специалистов».<br>' +
        '[CENTER]Пожалуйста, обратитесь в раздел «Жалобы на администрацию» вашего сервера.<br>Форма для подачи жалобы - [URL= https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/]Кликабельно.[/URL]<br>' +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
        '[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]',
		prefix: UNACCEPT_PREFIX,
		status: false,
    },
	{
		title: 'ЖБ на игроков',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		"[CENTER]Данная тема не относится к разделу «Жалобы на Технических Специалистов». Данное действие было совершено игроком и нарушает правила сервера, пожалуйста обратитесь в «Жалобы на игроков» вашего сервера.<br>Форма подачи жалобы - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/']Клик[/URL]" +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
    {
		title: 'ОБЖ Наказания от адм',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		"[CENTER]Вы получили наказание от администратора своего сервера.<br> Для его снижения блокировки вам нужно обратиться в раздел «Обжалования» вашего сервера. <br> Форма подачи темы находится здесь - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']Кликабельно.[/URL]<br>" +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Хочу занять должность',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		'[CENTER]Команда технических специалистов не решает назначение на какую-либо должность, которая присутствует на проекте.<br>Для этого существуют заявления в главном разделе вашего игрового сервера, где вы можете ознакомиться с открытыми должностями и формами подач.<br><br>' +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
        title: 'Не в тот раздел написал',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
        "[CENTER]Вы ошиблись разделом. Переношу вашу тему в нужный раздел.[/CENTER]",
    },
	{
        title: 'Перенаправление в поддержку',
        content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
        '[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
        '[CENTER]Пожалуйста, обратитесь в Техническую поддежку проекта.<br><br>Конктактная информация:[/CENTER]<br>'+
        '[CENTER]Телеграмм -  [URL=http://t.me/br_techBot]t.me/br_techBot[/URL][/CENTER]<br>'+
        '[CENTER]ВКонтакте - [URL= https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly92ay5jb20vYnJfdGVjaA==]vk.com/br_tech[/URL] [/CENTER]<br>'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
		'[COLOR=rgb(127, 255, 0)]Рассмотрено.[/COLOR][/CENTER]',
        prefix: WATCHED_PREFIX,
        status: false,
    },
	{
        title: 'НЕ ОТНОСИТСЯ',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[CENTER]Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		"[CENTER]Ваше обращение не относится к жалобам на технических специалистов. Пожалуйста ознакомьтесь с правилами данного раздела: [URL='https://forum.blackrussia.online/forums/Информация-для-игроков.231/']Кликабельно.[/URL]" +
        '[CENTER]Благодарим вас за обращение![/CENTER]<br>' +
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>" +
		'[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]',
		 prefix: UNACCEPT_PREFIX,
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