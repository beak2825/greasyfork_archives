// ==UserScript==
// @name         Руководство 11-15
// @namespace    https://forum.blackrussia.online
// @version      1.1
// @description  Curator 11-15
// @author       Michael Phelps
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license      MIT
// @collaborator Michael Phelps
// @icon https://sun6-23.userapi.com/s/v1/ig1/Bg7Sgc3yqNZ1F5YedeolIhnyRKIclMmKRAjpf9Rzj0XKAsgR9fLgLgNB3TUBDBF_N7XKKgPK.jpg?size=2155x2155&quality=96&crop=2,2,2155,2155&ava=1
// @downloadURL https://update.greasyfork.org/scripts/513973/%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%BE%2011-15.user.js
// @updateURL https://update.greasyfork.org/scripts/513973/%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%BE%2011-15.meta.js
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
        title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ Жалобы на технических специалистовᅠ ᅠ ᅠᅠ ᅠ               ᅠ ᅠ                         ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
    },
	{
        title: 'На рассмотрении',
		content:
		'Здравствуйте. <br><br>' +
		'Ваша тема взята на рассмотрение.<br>',
		prefix: PIN_PREFIX,
		status: true,
	},
	{
        title: 'На рассмотрении у Тех.Спец',
		content:
		'Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		'Ваша тема взята на рассмотрение.<br>' +
        'Просьба ожидать ответа от Технического Специалиста.<br>' +
        'Иногда рассмотрение темы может занять определенное время.<br><br>' +
        'На рассмотрении.',
		prefix: TECHADM_PREFIX,
		status: true,
	},
	{
        title: 'Передано Руководству',
		content:
		'Здравствуйте. <br><br>' +
		'Ваша тема закреплена и ожидает вердикта команды проекта. Создавать подобные темы не нужно, пожалуйста, ожидайте ответа.<br>',
		prefix: COMMAND_PREFIX,
		status: true,
	},
	{
        title: 'Выдано верно',
        content:
        'Здравствуйте. <br><br>' +
        'Доказательства предоставлены. <br><br>' +
        'Наказание выдано верно, закрыто.<br>',
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
    title: 'Беседа с техом',
    content:
    'Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]!<br><br>' +
    'Благодарим вас за обращение..<br>Мы обеспечим принятие необходимых мер по поводу действий нашего технического специалиста.<br><br>'+
    'Рассмотрено',
    prefix: WATCHED_PREFIX,
    status: false,
  },
     {
        title: 'Трансфер 4.05',
        content:
        'Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
        'Технический специалист предоставил доказательства вашего нарушения. После проверки доказательств было принято решение, что наказание, выданное техническим специалистом, является верным.<br>'+
        'Вы нарушили правило пункта 4.05 общих правил проекта.[SPOILER="4.05"]4.05. Запрещено передавать любые игровые ценности между игровыми аккаунтами, а также в целях удержания имущества | Ban 15 - 30 дней / PermBan[/SPOILER] <br><br>' +
        'Наказание выдано верно, закрыто.<br>',
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
         title: 'Заблокированный IP',
        content:
        'Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
        'Вы попали на заблокированный айпи адрес. Ваш аккаунт не находится в блокировке, переживать не стоит. Причиной попадания в данную ситуацию могло быть разное, например, смена мобильного интернета, переезд и тому подобное. Чтобы избежать данную ситуацию, вам необходимо перезагрузить телефон или воспользоваться услугами VPN. <br>' +
        'Приносим свои извинения за доставленные неудобства. Желаем приятного времяпровождения на нашем проекте. <br><br>' +
		'Рассмотрено.',
		prefix: WATCHED_PREFIX,
		status: false,
     },
     {
        title: 'Чужая привязка',
        content:
        'Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
        'К сожалению, обнаружена чужая привязка к вашему аккаунту, что может представлять угрозу для безопасности данных. В данной ситуации нам, к сожалению, не удастся разблокировать ваш аккаунт. Для обеспечения безопасности рекомендуется создать новый аккаунт и принять все возможные меры по защите данных. Наша команда технических специалистов настоятельно рекомендует вам установить дополнительные меры безопасности, такие как двухфакторную аутентификацию, сложные пароли и регулярное обновление паролей.  <br><br>' +
        'Пожалуйста, будьте внимательны при создании нового аккаунта и храните данные доступа в надежном месте. Мы приносим извинения за возможные неудобства, связанные с этой ситуацией, и стараемся обеспечить безопасность всех наших пользователей. <br><br>' +
		'Закрыто.',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
        title: 'Аккаунт будет разблокирован',
        content:
        'Здравствуйте. <br><br>' +
        'Ваш аккаунт Будет разблокирован в течении 24ч. <br><br>' +
    'Закрыто.<br>',
		prefix: CLOSE_PREFIX,
		status: false,
     },
     {
        title: 'Не подлежит ОБЖ',
		content:
		'Здравствуйте. <br><br>' +
		'Данное наказание не подлежит обжалованию. <br><br>' +
        'Закрыто.<br>',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
        title: 'В ОБЖ отказано',
        content:
        'Здравствуйте. <br><br>' +
        'В обжаловании отказано. На данный момент, мы не готовы пойти к вам на встречу.<br>',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
        title: 'ОБЖ одобрено',
        content:
        'Здравствуйте. <br><br>' +
        'В обжаловании одобрено. <br><br>' +
        'Одобрено.',
		prefix: DECIDED_PREFIX,
		status: false,
    },
	{
        title: 'Дубль Темы',
		content:
		'Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		"Данная тема является дубликатом вашей предыдущей темы. Пожалуйста, прекратите создавать идентичные или похожие темы - иначе Ваш форумный аккаунт может быть заблокирован. На первый раз предупреждение будет устное, при повторном дублировании на ваш аккаунт будет выдвинуты санкции в виде штрафных баллов. При последующих нарушениях ваш формный аккаунт будет заблокирован. <br><br>" +
		'Отказано.',
		prefix: UNACCEPT_PREFIX,
		status: false,
     },
	 {
        title: 'Нет окна блокировки',
		content:
		'Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		"Без окна о блокировке тема не подлежит рассмотрению - создайте новую тему, приложив окно блокировки с фото-хостинга<br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL]<br>(все кликабельно).<br>" +
        'Благодарим вас за обращение!<br><br>' +
		'Отказано.',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
    {
		title: 'Нарушений со стороны теха нет',
		content:
		'Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]!<br><br>' +
		'Нарушений со стороны технического специалиста нет.<br><br>'+
		'Закрыто.',
		prefix: CLOSE_PREFIX,
		status: false,
	},
    {
		title: 'Зам. выдал наказание',
		content:
		'Доброго времени суток, уважаемый[B] {{ user.mention }}[/B]!<br><br>' +
		'Заместитель ясно изложил суть вашего нарушение.<br>Назначенное вам наказание было оправдано и остается неизменным.<br><br>'+
		'Закрыто.',
		prefix: CLOSE_PREFIX,
		status: false,
	},

	{
        title: 'Срок подачи жб',
		content:
		'Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		'С момента выдачи наказания от технического специалиста прошло более 14-и дней.<br>Пересмотр/изменение меры наказания новозможно, вы можете попробывать написать обжалование через N-ый промежуток времени.<br><br>Обращаем ваше внимание на то, что некоторые наказания не подлежат не обжалованию,амнистии.<br><br>'+
        'Отказано.',
		prefix: UNACCEPT_PREFIX,
		status: false,
    },
	{
        title: 'Нет ответа от игрока',
		content:
		'Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		"К сожалению, ответа от вас так и не поступило. <br>Пожалуйста, создайте новую тему, если вы все ещё не согласны с выданным наказанием.<br><br>" +
		'Закрыто.',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Восст. доступа к аккаунту',
		content:
		'Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		"Если Вы обезопасили Ваш аккаунт и [U]привязали его к странице во ВКонтакте[/U], то сбросить пароль или пин-код Вы всегда сможете обратившись в официальное сообщество проекта - https://vk.com/blackrussia.online.<br> Либо в телеграмм бот - https://t.me/br_helper_bot.<br> Напишите «Начать» в личные сообщения группы/бота, затем выберите нужные Вам функции.<br><br>" +
		"Если Вы обезопасили Ваш аккаунт и [U]привязали его к почте[/U], то сбросить пароль или пин-код Вы всегда сможете при вводе пароля на сервере. После подключения к серверу нажмите на кнопку «Войти в аккаунт», затем выберите кнопку «Восстановить пароль», после чего на Вашу почту будет отправлено письмо с одноразовым кодом восстановления.<br><br>" +
		"Если Вы [U]не обезопасили свой аккаунт - его невозможно вернуть[/U]. Игрок самостоятельно несет отвественность за безопаность своего аккаунта.<br><br>" +
		'Надеемся, что Вы сможете восстановить доступ к аккаунту!<br><br>' +
		'Рассмотрено.',
		prefix: WATCHED_PREFIX,
		status: false,
	},
    {
		title: 'Имущество будет восстановлено',
		content:
		'Доброго времени суток, уважаемый {{ user.mention }}!<br><br>' +
		"Ваше игровое имущество/денежные средства будут восстановлены в течение двух недель. Убедительная просьба не менять никнейм до момента восстановления. Для активации восстановления используйте команды: /roulette, /recovery.<br><br>" +
		'Решено',
		status: false,
		prefix: DECIDED_PREFIX,
	},
    {
		title: 'Переустановите игру',
		content:
		'Доброго времени суток, уважаемый {{ user.mention }}!<br><br>' +
		"Возможно в файлах вашей игры присутствует постороннее оборудование (дополнения/изменения). Рекомендуется удалить полностью лаунчер и связанные с ним файлы и установить игру заново с официального сайта - [URL='https://blackrussia.online']Клик[/URL].<br><br>" +
		'Рассмотрено.',
		prefix: DECIDED_PREFIX,
		status: false,
	},
    {
		title: 'Запрос доп. информации',
		content:
		'Доброго времени суток, уважаемый {{ user.mention }}!<br><br>' +
		' Для дальнейшего рассмотрения темы, предоставьте:<br><BR>[QUOTE][SIZE=5]1. Скриншоты или видео, подтверждающие факт владения этим имуществом.<BR>2. Все детали пропажи: дата, время, после каких действий имущество пропало.<BR>3. Информация о том, как вы изначально получили это имущество:<BR>дата покупки<br>способ приобретения (у игрока, в магазине или через донат;<br>фрапс покупки (если есть);<br>никнейм игрока, у которого было приобретено имущество, если покупка была сделана не в магазине.[/QUOTE]<BR>'+
		'На рассмотрении',
		prefix: PIN_PREFIX,
		status: true,
	},
    	{
		title: 'Вам в жб на специалистов',
		content:
		'Доброго времени суток, уважаемый {{ user.mention }}!<br><br>' +
		'Вы получили наказание от технического специалиста Вашего сервера.<br>Вам следует обратиться в раздел «Жалобы на технических специалистов» — в случае, если Вы не согласны с наказанием.<br><br>' +
		"Ссылка на раздел, где можно оформить жалобу на технического специалиста - [URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-технических-специалистов.490/']клик[/URL] <br><br>" +
		'Отказано',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
        title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ Чистка от жалоб на тех. специалистаᅠ ᅠ ᅠᅠ ᅠ ᅠ  ᅠ ᅠ ᅠ ᅠ ',
        dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
    },
	{
        title: 'Форма подачи "ЖБ НА ТЕХ"',
		content:
		'Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		"Пожалуйста, заполните форму, создав новую тему: Название темы с NickName технического специалиста<br>Пример:<br> Lev_Kalashnikov | махинации<br>Форма заполнения темы:<br>[code]01. Ваш игровой никнейм:<br>02. Игровой никнейм технического специалиста:<br>03. Сервер, на котором Вы играете:<br>04. Описание ситуации (описать максимально подробно и раскрыто):<br>05. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>06. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/code]<br>" +
        'Благодарим вас за обращение!<br><br>' +
        'Отказано.',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Правила раздела ЖБ на тех',
		content:
		'Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		"Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела в котором Вы создали тему, так как Ваш запрос не относится к жалобам на технических специалистов.<br>Что принимается в данном разделе:<br>Жалобы на технических специалистов, оформленные по форме подачи и не нарушающие правила подачи:<br> [FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Правила подачи жалобы на технических специалистов[/U][/SIZE][/FONT]<br><br>[QUOTE][FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01. Ваш игровой никнейм:[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]<br>02. Игровой никнейм технического специалиста:[COLOR=rgb(226, 80, 65)]<br>03. Сервер, на котором Вы играете:[COLOR=rgb(226, 80, 65)]<br>04. Описание ситуации (описать максимально подробно и раскрыто):[COLOR=rgb(226, 80, 65)]<br>05. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):[COLOR=rgb(226, 80, 65)]<br>06. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/SIZE][/FONT][/SIZE][/QUOTE]<br><br>[FONT=verdana][SIZE=4][FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]Примечание: все оставленные заявки обращения в данный раздел обязательно должны быть составлены по шаблону предоставленному немного выше.<br>В ином случае, заявки обращения в данный раздел составленные не по форме — будут отклоняться.<br>Касательно названия заголовка темы — четких правил нет, но, желательно чтобы оно содержало лишь никнейм и сервер технического специалиста.<br>Заранее, настоятельно рекомендуем ознакомиться [U][B][URL='https://forum.blackrussia.online/index.php?forums/faq.231/']с данным разделом[/URL][/B][/U].[/SIZE][/FONT][/SIZE][/FONT]<br>[FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Какие жалобы не проверяются?[/U][/SIZE][/FONT]<br><br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]— Если в содержании темы присутствует оффтоп/оскорбления.<br>[SIZE=4][COLOR=rgb(226, 80, 65)]— Если в заголовке темы отсутствует никнейм технического специалиста.<br>[COLOR=rgb(226, 80, 65)]— С момента выдачи наказания прошло более 7 дней.[/SIZE][/SIZE][/FONT]<br>" +
        'Благодарим вас за обращение!<br><br>' +
		'Отказано.',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
        title: 'В Тех. Раздел',
		content:
		'Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		'Ваше обращение не относится к разделу «Жалобы на Технических Специалистов».<br>' +
        'Пожалуйста, обратитесь с данной темой в «Технический Раздел вашего сервера» - [URL= https://forum.blackrussia.online/index.php?forums/Технический-раздел.22/]Кликабельно.[/URL]<br><br>' +
        'Отказано.',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Жб на адм',
		content:
		'Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		'Вы получили наказание от Администратора сервера. Ваше обращение не относится к разделу «Жалобы на Технических Специалистов».<br>' +
        'Пожалуйста, обратитесь в раздел «Жалобы на администрацию» вашего сервера.<br>Форма для подачи жалобы - [URL= https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/]Кликабельно.[/URL]<br><br>' +
        'Отказано.',
		prefix: UNACCEPT_PREFIX,
		status: false,
    },
	{
		title: 'ЖБ на игроков',
		content:
		'Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		"Данная тема не относится к разделу «Жалобы на Технических Специалистов». Данное действие было совершено игроком и нарушает правила сервера, пожалуйста обратитесь в «Жалобы на игроков» вашего сервера.<br>Форма подачи жалобы - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.3429394/']Клик[/URL] <br><br>" +
		'Отказано.',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
    {
		title: 'ОБЖ Наказания от адм',
		content:
		'Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		"Вы получили наказание от администратора своего сервера.<br> Для его снижения блокировки вам нужно обратиться в раздел «Обжалования» вашего сервера. <br> Форма подачи темы находится здесь - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']Кликабельно.[/URL] <br><br>" +
		'Отказано.',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Хочу занять должность',
		content:
		'Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		'Команда технических специалистов не решает назначение на какую-либо должность, которая присутствует на проекте.<br>Для этого существуют заявления в главном разделе вашего игрового сервера, где вы можете ознакомиться с открытыми должностями и формами подач.<br><br>' +
		'Отказано.',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
        title: 'Не в тот раздел написал',
		content:
		'Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
        "Вы ошиблись разделом. Переношу вашу тему в нужный раздел.",
    },
	{
        title: 'Перенаправление в поддержку',
        content:
        'Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
        'Пожалуйста, обратитесь в Техническую поддежку проекта.<br><br>Конктактная информация:<br>'+
        'Телеграмм -  [URL=http://t.me/br_techBot]t.me/br_techBot[/URL]<br>'+
        'ВКонтакте - [URL= https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly92ay5jb20vYnJfdGVjaA==]vk.com/br_tech[/URL] <br><br>' +
		'Рассмотрено.',
        prefix: WATCHED_PREFIX,
        status: false,
    },
	{
        title: 'НЕ ОТНОСИТСЯ',
		content:
		'Доброго времени суток, уважаемый(ая) {{ user.mention }}.<br><br>' +
		"Ваше обращение не относится к жалобам на технических специалистов. Пожалуйста ознакомьтесь с правилами данного раздела: [URL='https://forum.blackrussia.online/forums/Информация-для-игроков.231/']Кликабельно.[/URL]" +
        'Благодарим вас за обращение!<br><br>' +
		'Отказано.',
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

const Button06 = buttonConfig("Игроки 11", 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.519/');
const Button07 = buttonConfig("Игроки 12", "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.560/");
const Button08 = buttonConfig("Игроки 13", "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.599/");
const Button09 = buttonConfig("Игроки 14", "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.640/");
const Button10 = buttonConfig("Игроки 15", "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.682/")
const ButtonTech06 = buttonConfig("Тех 11", "https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-indigo.493/")
const ButtonTech07 = buttonConfig("Тех 12", "https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-white.554/")
const ButtonTech08 = buttonConfig("Тех 13", "https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-magenta.613/")
const ButtonTech09 = buttonConfig("Тех 14", "https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-crimson.653/")
const ButtonTech10 = buttonConfig("Тех 15", "https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-gold.660/")
const ButtonComp06 = buttonConfig("Жб 11", "https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9611-indigo.1192/")
const ButtonComp07 = buttonConfig("Жб 12", "https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9612-white.1193/")
const ButtonComp08 = buttonConfig("Жб 13", "https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9613-magenta.1194/")
const ButtonComp09 = buttonConfig("Жб 14", "https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9614-crimson.1195/")
const ButtonComp10 = buttonConfig("Жб 15", "https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9615-gold.1196/")

bgButtons.append(Button06);
bgButtons.append(Button07);
bgButtons.append(Button08);
bgButtons.append(Button09);
bgButtons.append(Button10);
bgButtons.append(ButtonTech06);
bgButtons.append(ButtonTech07);
bgButtons.append(ButtonTech08);
bgButtons.append(ButtonTech09);
bgButtons.append(ButtonTech10);
bgButtons.append(ButtonComp06);
bgButtons.append(ButtonComp07);
bgButtons.append(ButtonComp08);
bgButtons.append(ButtonComp09);
bgButtons.append(ButtonComp10);