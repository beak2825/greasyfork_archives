// ==UserScript==
// @name BLACK RUSSIA | Технический отдел
// @namespace https://forum.blackrussia.online
// @version 0.4.2 
// @description Для технических шоколадок BLACK RUSSIA 
// @author maksim_vitalievich
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant maksim_vitalievich
// @license maksim_vitalievich
// @collaborator maksim_vitalievich
// @icon https://i.yapx.ru/ViO6c.png
// @downloadURL https://update.greasyfork.org/scripts/477166/BLACK%20RUSSIA%20%7C%20%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9%20%D0%BE%D1%82%D0%B4%D0%B5%D0%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/477166/BLACK%20RUSSIA%20%7C%20%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9%20%D0%BE%D1%82%D0%B4%D0%B5%D0%BB.meta.js
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
	  title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ  Для Логирования ᅠ ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ',
	},
{
		title: 'На рассмотрение',
		content:
'[SIZE=4][FONT=Times New Roman][CENTER][color=rgb(209, 213, 216)][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br><br>'+
'[CENTER][FONT=georgia]Ваша тема взята [COLOR=rgb(255, 152, 0)]на рассмотрение[/COLOR]. Ожидайте ответ в ближайшее время.<br>Часто рассмотрение темы может занять определенное время.<br>[U]Просьба не создавать подобных тем, иначе форумный аккаунт может быть заблокирован.[/U]<br><br>'+
"[COLOR=rgb(255, 152, 0)]На рассмотрении[/COLOR].[/FONT][/CENTER]",
prefix: PIN_PREFIX,
		status: true,
	},
{
		title: 'Жалоба передана руководству',
		content:
'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
"[CENTER][FONT=georgia]Жалоба передана на окончательный вердикт моему [COLOR=rgb(251, 160, 38)]руководству[/COLOR].<br><br>"+
"Ожидайте ответа. Новые темы создавать [/FONT]— [FONT=georgia]не нужно.<br><br>"+
"[COLOR=rgb(255, 152, 0)]На рассмотрении[/COLOR].[/FONT][/CENTER]",
prefix: PIN_PREFIX,
		status: true,
	},
{
		title: 'Обжалование передано руководству',
		content:
'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
"[CENTER][FONT=georgia]Обжалование передано руководству на окончательный вердикт моему [COLOR=rgb(251, 160, 38)]руководству[/COLOR].<br><br>"+
"Ожидайте ответа. Новые темы создавать [/FONT]— [FONT=georgia]не нужно.<br><br>"+
"[COLOR=rgb(255, 152, 0)]На рассмотрении[/COLOR].[/FONT][/CENTER]",
prefix: PIN_PREFIX,
		status: true,
	},
{
		title: 'Дубликат',
		content:
'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
"[CENTER][FONT=georgia]Данная тема является дубликатом вашей предыдущей темы.<br>Пожалуйста, прекратите создавать идентичные или похожие темы — иначе Ваш форумный аккаунт может быть заблокирован.<br><br>"+
"[COLOR=rgb(211, 47, 47)]Отказано[/COLOR].[/FONT][/CENTER]",
prefix: UNACCEPT_PREFIX,
		status: false,
},
{
		title: 'Не по форме "ЖБ ТЕХ"',
		content:
'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
"[CENTER]Пожалуйста, заполните форму, создав новую тему: Название темы с Nick_Name технического специалиста<br>Пример:<br> Lev_Kalashnikov | махинации<br>Форма заполнения темы:<br>[code]01. Ваш игровой никнейм:<br>02. Игровой никнейм технического специалиста:<br>03. Сервер, на котором Вы играете:<br>04. Описание ситуации (описать максимально подробно и раскрыто):<br>05. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>06. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/code]<br><br>" +
"[COLOR=rgb(211, 47, 47)]Отказано[/COLOR].[/FONT][/CENTER]",
prefix: UNACCEPT_PREFIX,
		status: false,
},
{
		title: 'Правила раздела',
		content:
'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+

		"[CENTER] Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела в котором Вы создали тему, так как Ваш запрос не относится к жалобам на технических специалистов.<br>Что принимается в данном разделе:<br>Жалобы на технических специалистов, оформленные по форме подачи и не нарушающие правила подачи:<br> [FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Правила подачи жалобы на технических специалистов[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[QUOTE][FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01.[/COLOR] Ваш игровой никнейм:[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]<br>02.[/COLOR] Игровой никнейм технического специалиста:[COLOR=rgb(226, 80, 65)]<br>03.[/COLOR] Сервер, на котором Вы играете:[COLOR=rgb(226, 80, 65)]<br>04.[/COLOR] Описание ситуации (описать максимально подробно и раскрыто):[COLOR=rgb(226, 80, 65)]<br>05.[/COLOR] Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):[COLOR=rgb(226, 80, 65)]<br>06.[/COLOR] Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/SIZE][/FONT][/SIZE][/QUOTE]<br><br>[FONT=verdana][SIZE=4][FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]Примечание:[/COLOR] все оставленные заявки обращения в данный раздел обязательно должны быть составлены по шаблону предоставленному немного выше.<br>В ином случае, заявки обращения в данный раздел составленные не по форме — будут отклоняться.<br>Касательно названия заголовка темы — четких правил нет, но, желательно чтобы оно содержало лишь никнейм и сервер технического специалиста.<br>Заранее, настоятельно рекомендуем ознакомиться [U][B][URL='https://forum.blackrussia.online/index.php?forums/faq.231/']с данным разделом[/URL][/B][/U].[/SIZE][/FONT][/SIZE][/FONT]<br>[CENTER][FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Какие жалобы не проверяются?[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]—[/COLOR] Если в содержании темы присутствует оффтоп/оскорбления.<br>[SIZE=4][COLOR=rgb(226, 80, 65)]—[/COLOR] Если в заголовке темы отсутствует никнейм технического специалиста.<br>[COLOR=rgb(226, 80, 65)]—[/COLOR] С момента выдачи наказания прошло более 14 дней.[/SIZE][/SIZE][/FONT]<br><br>" +
"[COLOR=rgb(211, 47, 47)]Отказано[/COLOR].[/FONT][/CENTER]",
prefix: UNACCEPT_PREFIX,
		status: false,
		},


{
		title: 'Срок вышел',
		content:
'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
'[CENTER]С момента выдачи наказания от технического специалиста прошло более 7-ми дней.<br>Пересмотр/изменение меры наказания новозможно, вы можете попробывать написать обжалование через N-ый промежуток времени.<br><br>Обращаем ваше внимание на то, что некоторые наказания не подлежат не обжалованию,амнистии.[/center]<br><br>'+
'[COLOR=rgb(211, 47, 47)]Закрыто[/COLOR].[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
		status: false,


	},
{
		title: 'В тех раздел',
		content:
'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
"[CENTER]Ваша тема не как не относится к жалобам на технических специалистов, обратитесь с данной темой в <u>технический раздел вашего сервера</u> - [URL='https://forum.blackrussia.online/index.php?forums/Технический-раздел.22/']клик[/URL]<br><br>" +
'[COLOR=rgb(211, 47, 47)]Закрыто[/COLOR].[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
		status: false,

},
{
		title: 'Окно блокировки',
		content:
'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
"[CENTER]Без окна о блокировке тема не подлежит рассмотрению — загрузите на любой фото-хостинг окно блокировки и прикрепите ссылку.<br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL]<br>(все кликабетильно).<br><br>"+
'[COLOR=rgb(211, 47, 47)]Закрыто[/COLOR].[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
		status: false,


	},
{
		title: 'Донат',
		content:
'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
"[CENTER]Обратитесь в техническую поддержку проекта:<br>ВКонтакте - https://vk.com/br_tech <br> Telegram - https://t.me/br_techBot[/CENTER]<br><br>"+
'[CENTER][COLOR=rgb(127, 255, 0)]Решено[/COLOR].[/CENTER][/FONT][/SIZE]',
		status: false,
		prefix: DECIDED_PREFIX,
	},
{
		title: 'Будет восстановлено',
		content:
'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
"[CENTER]Ваше игровое имущество/денежные средства будут восстановлены в течение двух недель. <br>Убедительная просьба, <b><u>не менять никнейм до момента восстановления</u></b>.<br>" +
		'[CENTER]Для активации восстановления используйте команды:[COLOR=rgb(255, 213, 51)]/roulette[/COLOR], [COLOR=rgb(255, 213, 51)]/recovery[/COLOR].[/CENTER]<br><br>' +
'[CENTER][COLOR=rgb(127, 255, 0)]Решено[/COLOR].[/CENTER][/FONT][/SIZE]',
		status: false,
		prefix: DECIDED_PREFIX,
	},


{
		title: 'НЕ ОТНОСИТСЯ',
		content:
'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
"[CENTER]Ваше обращение не относится к жалобам на технических специалистов.<br> Пожалуйста ознакомьтесь с праивилами данного раздела: [URL='https://forum.blackrussia.online/forums/Информация-для-игроков.231/']клик[/URL] <br><br>" +
'[COLOR=rgb(211, 47, 47)]Закрыто[/COLOR].[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
		status: false,
    
},
{
title: 'какие привязки?',
content:
"[SIZE=4][FONT=Times New Roman][CENTER][B]Какие привязки есть на аккаунте? Перечислите, пожалуйста.[/CENTER][/FONT][/SIZE]<br><br>",
prefix: PIN_PREFIX,
		status: true,
},
{
title: 'Сброс пароля',
content:
"[SIZE=4][FONT=Times New Roman][CENTER][B]Совершите сброс пароля через привязки в ВК/Телеграм. Прикрепите скриншот сброса сюда(Не забудьте закрасить новый пароль)[/CENTER][/FONT][/SIZE]<br><br>",
prefix: PIN_PREFIX,
		status: true,
},
{
title: 'Не можем разблокировать(взлом)',
content:
"[CENTER][FONT=Times New Roman]Увы, мы не можем разблокировать Ваш аккаунт, поскольку на аккаунте есть чужая привязка, которая была привязана в момент взлома<br>Также Ваш акккаунт не подлежит разблокировке.<br>К сожалению, отвязать привязку - не можем.[/CENTER]<br><br>"+
"[CENTER][COLOR=RED]Закрыто[/color][/FONT].",
prefix: CLOSE_PREFIX,
		status: false,
},
{
title: 'Аккаунт будет разблокирован',
content:
'[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>'+
"[CENTER]Аккаунт будет разблокирован.<br>Приношу извинения за доставленные неудобства.[/CENTER]<br><br>"+
"[CENTER][COLOR=RED]Закрыто[/color][/FONT].",
prefix: CLOSE_PREFIX,
		status: false,
},
{
title: 'На ответ 24 часа',
content:
"[CENTER]На ответ дается 24 часа, если ответа не будет - жалоба закрывается с отрицательным результатом.[/CENTER]",
},
{
title: 'нет ответа',
content:
"[SIZE=4][FONT=Times New Roman][CENTER][B]Ответа не поступило.<br>Если не согласны с блокировкой - напишите новую жалобу.[/CENTER][/FONT][/SIZE]<br><br>"+
"[CENTER][COLOR=RED]Закрыто[/color].",
prefix: CLOSE_PREFIX,
		status: false,
},
{
title: 'Страница ВК',
content:
"[SIZE=4][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>Прикрепите ссылку на свою страницу ВКонтакте.",
prefix: PIN_PREFIX,
		status: true,
},
{
		title: 'Будет заблокирован',
		content:
'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
"[CENTER][SIZE=4][FONT=Georgia]После проверки доказательств и системы логирования вердикт:<br><br>[COLOR=rgb(65, 168, 95)]<br>Игрок будет заблокирован[/COLOR][/CENTER]<br><br>" +
'[COLOR=rgb(211, 47, 47)]Закрыто[/COLOR].[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
		status: false,

	},
{
		title: 'Нет нарушений',
		content:
'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
	"[CENTER][SIZE=4][FONT=Georgia]После проверки доказательств и системы логирования вердикт:<br><br>[COLOR=rgb(255, 0, 0)]Доказательств недостаточно для блокировки игрока[/COLOR].[/CENTER]<br><br>" +
'[COLOR=rgb(211, 47, 47)]Закрыто[/COLOR].[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
		status: false,
},

{
		title: 'ᅠ ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ ᅠ  Для Форумников  ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ ᅠ',
	},
{
		title: 'Не по форме',
		content:
'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
"[CENTER]Пожалуйста, заполните форму, создав новую тему: <br>[CODE]01. Ваш игровой никнейм:<br>02. Сервер, на котором Вы играете:<br>03. Суть Вашей возникшей проблемы (описать максимально подробно и раскрыто): <br>04. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>05. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/CODE]<br><br>" +
'[COLOR=rgb(211, 47, 47)]Закрыто[/COLOR].[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
		status: false,

	},
{
		title: 'Правила',
		content:
'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
"[CENTER]Пожалуйста, убедительная просьба, ознакомиться с назначением данного раздела в котором Вы создали тему, так как Ваш запрос не относится к технической проблеме.<br>Что принимается в тех разделе:<br>Если возникли технические проблемы, которые так или иначе связаны с игровым модом<br>Форма заполнения:<br>[QUOTE]<br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01.[/COLOR] Ваш игровой никнейм:<br>[COLOR=rgb(226, 80, 65)]02.[/COLOR] Сервер, на котором Вы играете:<br>[COLOR=rgb(226, 80, 65)]03.[/COLOR] Суть возникшей проблемы (описать максимально подробно и раскрыто):<br>[COLOR=rgb(226, 80, 65)]04.[/COLOR] Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>[COLOR=rgb(226, 80, 65)]05.[/COLOR] Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/SIZE][/FONT][/QUOTE]<br>[/CENTER]<br><br>[CENTER][FONT=verdana][SIZE=7][COLOR=rgb(226, 80, 65)][U]Если возникли технические проблемы, которые так или иначе связаны с вылетами из игры и любыми другими проблемами клиента[/U][/COLOR][/SIZE][/FONT][/CENTER]<br><br>[QUOTE]<br>[FONT=verdana][SIZE=4][COLOR=rgb(226, 80, 65)]01. [/COLOR]Ваш игровой ник:<br>[COLOR=rgb(226, 80, 65)]02. [/COLOR]Сервер:<br>[COLOR=rgb(226, 80, 65)]03.[/COLOR] Тип проблемы: Обрыв соединения | Проблема с ReCAPTCHA | Краш игры (закрытие игры) | Другое [Выбрать один вариант ответа]<br>[COLOR=rgb(226, 80, 65)]04. [/COLOR]Действия, которые привели к этому (при вылетах, по возможности предоставлять место сбоя):<br>[COLOR=rgb(226, 80, 65)]05.[/COLOR] Как часто данная проблема:<br>[COLOR=rgb(226, 80, 65)]06.[/COLOR] Полное название мобильного телефона:<br>[COLOR=rgb(226, 80, 65)]07.[/COLOR] Версия Android:<br>[COLOR=rgb(226, 80, 65)]08. [/COLOR]Дата и время (по МСК):<br>[COLOR=rgb(226, 80, 65)]09. [/COLOR]Связь с Вами по Telegram/VK:[/SIZE][/FONT][/QUOTE]<br><br>"+
'[COLOR=rgb(211, 47, 47)]Закрыто[/COLOR].[/CENTER][/FONT][/SIZE]',
prefix: CLOSE_PREFIX,
		status: false,
	},
{
	title: "Проблемы с Кешом",
	content:
'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
    '[center]Если вы столкнулись с проблемой загрузки страниц форума, пожалуйста, выполните следующие действия:<br><br>• Откройте "Настройки".<br>• Найдите во вкладке "Приложения" свой браузер, через который вы пользуетесь нашим сайтом форума.<br>• Нажмите на браузер, после чего внизу выберите "Очистить" -> "Очистить Кэш".<br><br>После следуйте данным инструкциям:<br>• Перейдите в настройки браузера.<br>• Выберите "Конфиденциальность и безопасность" -> "Очистить историю".<br>• В основных и дополнительных настройках поставьте галочку в пункте "Файлы cookie и данные сайтов".<br>После этого нажмите "Удалить данные".<br><br>Ниже прилагаем видео-инструкции описанного процесса для разных браузеров:<br>Для браузера CHROME: https://youtu.be/FaGp2rRru9s<br>Для браузера OPERA: https://youtube.com/shorts/eJOxkc3Br6A?feature=share,<br><br>'+ 
	'[CENTER[COLOR=RED]Закрыто[/COLOR].[/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,		
	},	
{
	title: "Логисту",
	content:
'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
    '[center]Ваше обращение передано техническому специалисту по логированию.<br>Новые темы создавать — не нужно.<br><br>Ожидайте ответа.<br><br>', 
prefix: TECHADM_PREFIX,
		status: true,		
	},
{
		title: 'Законопослушность',
		content:
'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
		'[CENTER]К сожалению, администрация, технические специалисты и другие должностные лица BLACK RUSSIA не могут повлиять на законопослушность вашего аккаунта.<br>Повысить законопослушность можно двумя способами:<BR><BR>1. Каждый PayDay (00 минут каждого часа) вам начисляется одно очко законопослушности(Если только у вас нету PLATINUM VIP-статуса), если за прошедший час вы отыграли не менее 20 минут.<br>2. Приобрести законопослушность в /donate.<BR><br>[/CENTER]'+
		'[CENTER][COLOR=RED]Отказано[/COLOR].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
{
	title: "Баг со штрафами",
	content:
'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
	'[center]У вас произошла ошибка со штрафами, для её исправления вам нужно совершить проезд на красный свет, переехать через сплошную и оплатить все штрафы в банке.<br>Тогда данный баг пропадет, Команде Проекто известно о данной недоработке и активно ведется иправление.<br><br>' +
	'[CENTER][COLOR=RED]Закрыто[/COLOR].[/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
},
{
	title: 'ЖБ на ТЕХОВ',
		content:
'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
		'[CENTER]Вы получили наказание от технического специалиста Вашего сервера.<br>Вам следует обратиться в раздел «Жалобы на технических специалистов» — в случае, если Вы не согласны с наказанием.<br><br>' +
		"[CENTER]Ссылка на раздел, где можно оформить жалобу на технического специалиста - [URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-технических-специалистов.490/']клик[/URL] <br><br>" +
		'[CENTER][COLOR=RED]Отказано[/COLOR].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Команде проекта',
		content:
'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
		"[CENTER]Ваша тема закреплена и находится на рассмотрении у команды проекта. Пожалуйста, ожидайте выноса вердикта разработчиков.<br><br>"+
		"[CENTER]Создавать новые темы с данной проблемой — не нужно, ожидайте ответа в данной теме. Если проблема решится - Вы всегда можете оставить своё сообщение в этой теме.<br>",
		prefix: COMMAND_PREFIX,
		status: true,
	},
	{
		title: 'Известно КП',
		content:
'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
		"[CENTER]Команде проекта уже известно о данной проблеме, она обязательно будет рассмотрена и исправлена. Спасибо за Ваше обращение!<br><br>" +
		'[CENTER][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR].[/CENTER][/FONT][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Для ошибок во время ОБТ',
		content:
	'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
		"[CENTER]Если вы нашли какую-либо ошибку во время Открытого Бэта Тестирования то сделайте следующие действия.<br><br>1. Отправьте пожалуйста найденную недоработку в данную форму - [URL='https://docs.google.com/forms/d/e/1FAIpQLSexVwEcvQ9gI6KDjvb65M5A6Yoc5QLyVGWcHjBb21_4BKaX4w/viewform']клик[/URL]<br>2. Передайте данную форму своим друзьям, для ускорения процесса по сбору багов для их исправления.<br><br>Спасибо за ваш вклад в развитие игры!<br>[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]",
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Для ошибок во время ОБТ на IOS',
		content:
		'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
		"[CENTER]Если вы нашли какую-либо ошибку во время Открытого Бэта Тестирования на IOS то сделайте следующие действия.<br><br>1. Отправьте пожалуйста найденную недоработку в данную форму - [URL='https://forms.gle/4adcNvKisfKF59Fi8']клик[/URL]<br>2. Передайте данную форму своим друзьям, для ускорения процесса по сбору багов для их исправления.<br><br>Спасибо за ваш вклад в развитие игры!<br>[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]",
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Почему у меня пропали все темы из раздела Жалобы?',
		content:
'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
		"[CENTER]Раздел 'Жалобы' переведен в приватный режим, а именно:<br>Тему созданную пользователем может видеть <b>он сам</b> и <b>Администрация сервера</b>.<br>Ознакомиться с формой подачи тем в тот или иной раздел можно по данной ссылке: [URL='https://forum.blackrussia.online/index.php?forums/Правила-подачи-жалоб.202/']клик[/URL]<br>Приятного времяпрепровождения на нашем форуме<br>[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]",
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Не весь рейтинг за груз',
		content:
		'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
		'[CENTER]Наша система постоена следующим образом<br>Рейтинг зависит от поломки автомобиля чем серьёзнее поломка, тем меньше будет засчитан рейтинг.<br>Поломка учитывается вся за время рейса с грузом, в независимости от того если Вы почините Ваш автомобиль, поломка до, будет учтена.<br>[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	},
 	{
		title: 'Не является багом',
		content:
		'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
		'[CENTER]Проблема с которой вы столкнулись не является багом, ошибкой сервера.<br><br>[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'ТЕСТЕРАМ',
		content:
		'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
		"[CENTER]Ваша тема передана на тестирование.[/CENTER][/FONT][/SIZE]",
		  prefix: WAIT_PREFIX,
		  status: false,
	},
	{
		title: 'Ответ от ТЕСТЕРОВ',
		content:
		'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
		'[CENTER]Ответ от тестерского отдела дан выше.<br><br>' +
		'[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
		title: 'Пропали вещи с аукциона',
		content:
		'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
		'[CENTER]Если вы выставили свои вещи на аукцион а их никто не купил, то воспользуйтесь командой [COLOR=rgb(251, 160, 38)]/reward[/COLOR]<br> В случае отсутствии вещей там, приложите скриншоты с + /time в новой теме<br>[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Если не работают ссылки',
		content:
		'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
		"[CENTER]По техническим причинам данное действие невозможно, пожалуйста воспользуйтесь копированием ссылки от сюда:<br>[img]https://i.ibb.co/SX77Fgw/photo-2022-08-20-16-31-57.jpg[/img]<br>Если данный способ не помогает, то используйте сервис сокращения ссылок https://clck.ru<br> Либо попробуйте вот так:<br>1) загрузка скриншота биографии на фотохостинг<br>2) в описание прикрепить ссылку с форума<br>3) скопировать пост с фотохостинга<br><br>2 способ:<br>Сократите ссылки для Ваших скриншотов и RP биографии, сделать можно тут goo.su  также Iformation замените на русский текст, просмотрите еще текст полностью и постарайтесь уменьшить такие знаки как !?<br>goo.su[/CENTER]<br>"+
		'[CENTER][I][COLOR=rgb(255, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'В раздел Госс Организаций.',
		content:
		'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
		'[CENTER]Ваша тема не относится к техническому разделу, пожалуйста оставьте ваше заявление в соответствующем разделе Государственных Организаций вашего сервера.[/CENTER]<br><br>'+
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'В раздел Криминальных Организаций',
		content:
		'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
		'[CENTER]Ваша тема не относится к техническому разделу, пожалуйста оставьте ваше заявление в соответствующем разделе Криминальных Организаций вашего сервера [/CENTER]'+
		'[CENTER][I][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/I].[/CENTER][/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Жб на адм',
		content:
		'[SIZE=4][Color=AQUA][FONT=Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
		"[CENTER]Вы получили наказание которое не относится к технической части, оно относится к Административной части.<br> Обратитесь в раздел Жалобы на администрацию вашего сервера.<br>Выбрать свой сервере можно ниже:<br> [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.86/']«Жалобы на администрацию [Color=RED]RED[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.117/']«Жалобы на администрацию [Color=GREEN]GREEN[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.154/']«Жалобы на администрацию [Color=BLUE]BLUE[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.192/']«Жалобы на администрацию [Color=YELLOW]YELLOW[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.271/']«Жалобы на администрацию [Color=ORANGE]ORANGE[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']«Жалобы на администрацию [Color=PURPLE]PURPLE[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.350/']«Жалобы на администрацию [Color=LIME]LIME[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.392/']«Жалобы на администрацию [Color=PINK]PINK[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.433/']«Жалобы на администрацию [Color=rgb(144,0,32)]CHERRY[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.468/']«Жалобы на администрацию [Color=BLACK]BLACK[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.517/']«Жалобы на администрацию [Color=INDIGO]INDIGO[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.558/']«Жалобы на администрацию [Color=WHITE]WHITE[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.597/']«Жалобы на администрацию [Color=MAGENTA]MAGENTA[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.638/']«Жалобы на администрацию [Color=CRIMSON]CRIMSON[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.680/']«Жалобы на администрацию [Color=GOLD]GOLD[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.721/']«Жалобы на администрацию [Color=rgb(0,128,255)]AZURE[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.783/']«Жалобы на администрацию [Color=rgb(229,228,226)]PLATINUM[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.842/']«Жалобы на администрацию [Color=AQUA]AQUA[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9619-gray.858/']«Жалобы на администрацию [Color=GRAY]CRAY[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9620-ice.927/']«Жалобы на администрацию [Color=rgb(128,241,254)]ICE[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.992/']«Жалобы на администрацию [Color=rgb(227,34,39)]CHILLI[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1034/']«Жалобы на администрацию [Color=rgb(191,131,92)]CHOCO[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1080/']«Жалобы на администрацию [Color=rgb(255,43,59)]MOSCOW[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1122/']«Жалобы на администрацию [Color=rgb(17,166,250)]SPB[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1165/']«Жалобы на администрацию [Color=rgb(255,186,8)]UFA[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1232/']«Жалобы на администрацию [Color=rgb(1,175,214)]SOCHI[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1274/']«Жалобы на администрацию [Color=rgb(0,125,178)]KAZAN[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1318/']«Жалобы на администрацию [Color=rgb(130,51,157)]SAMARA[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1360/']«Жалобы на администрацию [Color=rgb(251,176,64)]ROSTOV[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1400/']«Жалобы на администрацию [Color=rgb(36,172,248)]ANAPA[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1442/']«Жалобы на администрацию [Color=rgb(147,240,164)]EKB[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1486/']«Жалобы на администрацию [Color=rgb(160,52,41)]KRASNODAR[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1529/']«Жалобы на администрацию [Color=rgb(255,247,45)]ARZAMAS[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1570/']«Жалобы на администрацию [Color=rgb(153,213,59)]NOVOSIBIRSK[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1654/']«Жалобы на администрацию [Color=rgb(5,151,235)]SARATOV[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1696/']«Жалобы на администрацию [Color=rgb(88,225,165)]OMSK[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1738/']«Жалобы на администрацию [Color=rgb(6,225,255)]IRKUTSK[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1784/']«Жалобы на администрацию [Color=rgb(254,0,0)]VORGOGRAD[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1826/']«Жалобы на администрацию [Color=rgb(255,242,0)]VORONEZH[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1868/']«Жалобы на администрацию [Color=rgb(0,57,166)]BELGOROD[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1910/']«Жалобы на администрацию [Color=rgb(66,173,66)]MAKHACHKALA[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1952/']«Жалобы на администрацию [Color=RGB(142,176,217)]VLADIKAVKAZ[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1994/']«Жалобы на администрацию [Color=RGB(58,149,255)]VLADIVOSTOK[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2036/']«Жалобы на администрацию [Color=rgb(240,235,201)]KALININGRAD[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2078/']«Жалобы на администрацию [Color=RGB(255,107,0)]CHELYABINSK[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2120/']«Жалобы на администрацию [Color=RGB(217,157,28)]KRASNOYARSK[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2162/']«Жалобы на администрацию [Color=RGB(108,187,116)]CHEBOKSARY[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9649-khabarovsk.2179/']«Жалобы на администрацию [Color=RGB(1,132,196)]KHABAROVSK[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2246/']«Жалобы на администрацию [Color=RGB(255,215,0)]PERM][/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2288/']«Жалобы на администрацию [Color=RGB(242,182,71)]TULA[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2330/']«Жалобы на администрацию [Color=RGB(198,89,235)]RYAZAN[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2372/']«Жалобы на администрацию [Color=rgb(57,103,151)]MURMANSK[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2414/']«Жалобы на администрацию [Color=rgb(83,226,149)]PENZA[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2456/']«Жалобы на администрацию [Color=rgb(158,28,0)]KURSK[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2498/']«Жалобы на администрацию [Color=rgb(258,0,122)]ARKHANGELSK[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2543/']«Жалобы на администрацию [Color=rgb(227,144,18)]ORENBURG[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2582/']«Жалобы на администрацию [Color=rgb(147,147,147)]KIROV[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2624/']«Жалобы на администрацию [Color=rgb(246,26,27)]KEMEROVO[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2661/']«Жалобы на администрацию [Color=rgb(68,201,243)]TYUMEN[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2700/']«Жалобы на администрацию [Color=rgb(143,0,255)]TOLYATTI[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2733/']«Жалобы на администрацию [Color=rgb(213,175,128)]IVANOVO[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2765/']«Жалобы на администрацию [Color=rgb(63,107,233)]STAVROPOL[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2797/']«Жалобы на администрацию [Color=rgb(238,112,62)]SMOLENSK[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2797/']«Жалобы на администрацию [Color=rgb(238,112,62)]PSKOV[/COLOR]».[/URL]<br><br>"+
	"[CENTER][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR].[/CENTER][/FONT][/SIZE]",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
{
		title: 'Жалобы на игроков',
		content:
		'[SIZE=4][Color=Aqua][FONT=​Times New Roman][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
		"[CENTER]Вы ошиблись разделом, обратитесь в «Жалобы на игроков» Вашего сервера. Выбрать свой сервере можно ниже: <br> [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.88/']«Жалобы на игроков [Color=RED]RED[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.119/']«Жалобы на игроков [Color=GREEN]GREEN[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.156/']«Жалобы на игроков [Color=BLUE]BLUE[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.194/']«Жалобы на игроков [Color=YELLOW]YELLOW[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.273/']«Жалобы на игроков [Color=ORANGE]ORANGE[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.312/']«Жалобы на игроков [Color=PURPLE]PURPLE[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.352/']«Жалобы на игроков [Color=LIME]LIME[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.394/']«Жалобы на игроков [Color=PINK]PINK[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.435/']«Жалобы на игроков [Color=CHERRY]CHERRY[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.470/']«Жалобы на игроков [Color=BLACK]BLACK[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9611-indigo.492/']«Жалобы на игроков [Color=INDIGO]INDIGO[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.560/']«Жалобы на игроков [Color=WHITE]WHITE[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.599/']«Жалобы на игроков [Color=MAGENTA]MAGENTA[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.640/']«Жалобы на игроков [Color=CRIMSON]CRIMSON[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/categories/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.700/']«Жалобы на игроков [Color=GOLD]GOLD[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.723/']«Жалобы на игроков [Color=AZURE]AZURE[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.785/']«Жалобы на игроков [Color=PLATINUM]PLATINUM[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.844/']«Жалобы на игроков [Color=AQUA]AQUA[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.885/']«Жалобы на игроков [Color=GRAY]GRAY[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/Жалобы-на-игроков.954/']«Жалобы на игроков» [Color=rgb(182,241,254)]ICE[/COLOR].[/URL]<br>[URL='https://forum.blackrussia.online/forums/Жалобы-на-игроков.994/']«Жалобы на игроков» [Color=rgb(227,34,39)]CHILLI[/COLOR].[/URL]<br>[URL='https://forum.blackrussia.online/forums/Жалобы-на-игроков.1036/']«Жалобы на игроков [Color=rgb(191,131,92)]CHOCO[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/Жалобы-на-игроков.1082/']«Жалобы на игроков [Color=rgb(255,43,59)]MOSCOW[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/Жалобы-на-игроков.1124/']«Жалобы на игроков [Color=rgb(17,166,250)]SPB[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/Жалобы-на-игроков.1167/']«Жалобы на игроков [Color=rgb(255,168,8)]UFA[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/Жалобы-на-игроков.1234/']«Жалобы на игроков [Color=rgb(1,175,214)]SOCHI[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/Жалобы-на-игроков.1276/']«Жалобы на игроков [Color=rgb(0,125,178)]KAZAN[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/Жалобы-на-игроков.1320/']«Жалобы на игроков [Color=rgb(130,51,157)]SAMARA[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/Жалобы-на-игроков.1362/']«Жалобы на игроков [Color=rgb(251,176,64)]ROSTOV[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/Жалобы-на-игроков.1402/']«Жалобы на игроков [Color=rgb(36,172,248)]ANAPA[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1444/']«Жалобы на игроков [Color=rgb(147,240,164)]EKB[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1488/']«Жалобы на игроков [Color=rgb(160,52,41)]KRASNODAR[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1531/']«Жалобы на игроков [Color=rgb(255,247,45)]ARZAMAS[/COLOR]».[/URL]<br> [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1572/']«Жалобы на игроков [Color=rgb(153,213,59)]NOVOSIBISRK[/COLOR]».[/URL]<br> [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1614/']«Жалобы на игроков [Color=rgb(0,150,34)]GROZNY[/COLOR]».[/URL]<br> [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1656/']«Жалобы на игроков [Color=rgb(5,151,235)]SARATOV[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1698/']«Жалобы на игроков [Color=rgb(88,225,165)]OMSK[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1740/']«Жалобы на игроков [Color=rgb(6,225,255)]IRKUTSK[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1786/']«Жалобы на игроков [Color=rgb(254,0,0)]VOLGOGRAD[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1828/']«Жалобы на игроков [Color=rgb(255,242,0)]VORONEZH[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1870/']«Жалобы на игроков [Color=rgb(0,57,166)]BELGOROD[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1912/']«Жалобы на игроков [Color=rgb(66,173,66)]MAKHACHKALA[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1954/']«Жалобы на игроков [Color=rgb(142,176,217)]VLADIKAVKAZ[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.1996/']«Жалобы на игроков [Color=rgb(58,149,255)]VLADIVOSTOK[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2038/']«Жалобы на игроков [Color=rgb(240,235,201)]KALININGRAD[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2080/']«Жалобы на игроков [Color=rgb(255,107,0)]CHELYABINSK[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2122/']«Жалобы на игроков [Color=rgb(217,157,28)]KRASNOYARSK[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2164/']«Жалобы на игроков [Color=rgb(108,187,116)]CHEBOKSARY[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2206/']«Жалобы на игроков [Color=rgb(1,132,196)]KHABAROVSK[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2248/']«Жалобы на игроков [Color=rgb(255,215,0)]PERM[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2290/']«Жалобы на игроков [Color=rgb(242,182,71)]TULA[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2332/']«Жалобы на игроков [Color=rgb(198,89,235)]RYAZAN[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2374/']«Жалобы на игроков [Color=rgb(57,103,151)]MURMANSK[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2416/']«Жалобы на игроков [Color=rgb(83,226,149)]PENZA[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2458/']«Жалобы на игроков [Color=rgb(158,28,0)]KURSK[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2500/']«Жалобы на игроков [Color=rgb(255,0,122)]ARKHANGELSK[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2545/']«Жалобы на игроков [Color=rgb(227,144,18)]ORENBURG[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2584/']«Жалобы на игроков [Color=rgb(147,147,147)]KIROV[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2626/']«Жалобы на игроков [Color=rgb(246,26,27)]KEMEROVO[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2663/']«Жалобы на игроков [Color=rgb(68,201,243)]TYUMEN[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2702/']«Жалобы на игроков [Color=rgb(143,0,255)]TOLYATTI[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2735/']«Жалобы на игроков [Color=rgb(213,175,128)]IVANOVO[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2767/']«Жалобы на игроков [Color=rgb(63,107,233)]STAVROPOL[/COLOR]».[/URL]<br>[URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2799/']«Жалобы на игроков [Color=rgb(238,112,62)]SMOLENSK[/COLOR]».[/URL]<br>[URL='']«Жалобы на игроков [Color=rgb(99,166,46)]PSKOV[/COLOR]».[/URL]<br><br>"+
		'[CENTER][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR].[/CENTER][/SIZE]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
		title: 'Обжалования',
		content:
		'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
		"[CENTER]Вы получили наказание от администратора своего сервера.<br> Для его снижения/обжалования обратитесь в раздел<br><<Обжалования>> вашего сервера.<br>Форма подачи темы - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']клик[/URL]" +
		'[CENTER][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR].[/CENTER][/FONT][/SIZE]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
		title: 'Сервер не отвечает',
		content:
		'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
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
	
		"[CENTER]📹 Включение продемонстрировано на видео: https://youtu.be/Wft0j69b9dk<br>[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR][/I].[/CENTER][/FONT][/SIZE]",
		prefix: CLOSE_PREFIX,
		status: false,
	},
{
	title: 'Кик за ПО',
	content:
	'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
	'[CENTER]Уважаемый игрок, если вы были отключены от сервера Античитом<br><br>[COLOR=rgb(255, 0, 0)]Пример[/COLOR]:<br><br> [IMG]https://i.ibb.co/FXXrcVS/image.png[/IMG],<br>пожалуйста, обратите внимания на значения PacketLoss и Ping.<br><br>PacketLoss - минимальное значение 0.000000, максимальное 1.000000. При показателе, выше нуля, это означает, что у вас происходит задержка/потеря передаваемых пакетов информации на сервер. Это означает, что ваш интернет не передает достаточное количество данных из вашего устройства на наш сервер, в следствие чего система отключает вас от игрового процесса.<br><br>Ping - Чем меньше значение в данном пункте, тем быстрее передаются данные на сервер, и наоборот. Если значение выше 100, вы можете наблюдать отставания в игровом процессе из-за нестабильности интернет-соединения.<br><br>Если вы не заметили проблем в данных пунктах, скорее всего - у вас произошел скачек пинга при выполнении действия в игре, в таком случае, античит также отключает игрока из-за подозрения в использовании посторонних программ.<br><br>Решение данной проблемы: постарайтесь стабилизировать ваше интернет-соединение, при необходимости - сообщите о проблемах своему провайдеру (поставщику услуг интернета).<br>[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]',
	prefix: CLOSE_PREFIX,
	status: false,
	},
{
		title: 'ХОЧУ СТАТЬ АДМ/ХЕЛПЕРОМ',
		content:
				'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
		"[CENTER]Команда технических специалистов не решает назначение на какую-либо должность, которая присутствует на проекте.<br>Для этого существуют заявления в главном разделе Вашего игрового сервера, где Вы можете ознакомиться с открытыми должностями и формами подач.<br>Приятной игры и желаем удачи в карьерной лестнице!<br><br>" +
		'[CENTER][COLOR=rgb(139, 0, 0)]Отказано[/COLOR].[/CENTER][/FONT][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Улучшения для серверов',
		content:
		'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
		'[CENTER]Ваша тема не относится к технической проблеме, если вы хотите предложить изменения в игровом моде - обратитесь в раздел <br> [URL="https://forum.blackrussia.online/index.php?categories/Предложения-по-улучшению.656/"] Предложения по улучшению → нажмите сюда[/URL].<br>[CENTER][I][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR].[/CENTER][/FONT][/SIZE]' ,
		prefix: CLOSE_PREFIX,
		status: false,
	},
	{
		title: 'Вам нужны все прошивки',
		content:
		'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
		'[CENTER] Для активации какой либо прошивки необходимо поставить все детали данного типа "SPORT" "SPORT+" и т.п.<br>[CENTER][COLOR=rgb(139, 0, 0)]Закрыто[/COLOR].[/CENTER][/FONT][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
{
		title: 'КРАШ/ВЫЛЕТ',
		content:
		'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
		"[CENTER]В том случае, если Вы вылетели из игры во время игрового процесса (произошел краш), в обязательном порядке необходимо обратиться в данную тему в любом техническом разделе [img]https://i.ibb.co/sPhBGjx/NVIDIA-Share-1-Tde-EHim0u.png[/img][/CENTER]<br>" +
		"[CENTER][CODE]01. Ваш игровой никнейм: <br> 02. Сервер: <br> 03. Тип проблемы: Обрыв соединения | Проблема с ReCAPTCHA | Краш игры (закрытие игры) | Другое [Выбрать один вариант ответа] <br> 04. Действия, которые привели к этому (при вылетах, по возможности предоставлять место сбоя): <br> 05. Как часто данная проблема: <br> 06. Полное название мобильного телефона: <br> 07. Версия Android: <br> 08. Дата и время (по МСК): <br> 09. Связь с Вами по Telegram/VK:[/CODE]<br><br>" +
		'[CENTER][COLOR=rgb(139, 0, 0)]Отказано[/COLOR][/CENTER].[/FONT][/SIZE]',
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
	{
		title: 'Баг ФСИН(не выпустило)',
		content:
		'[SIZE=4][Color=Aqua][FONT=​Georgia][CENTER][B]{{ greeting }}, уважаемый {{ user.mention }}![/Color]<br>'+
		'[CENTER]Скоро будете выпущены,ожидайте.[/CENTER][/FONT][/SIZE]',
		prefix: CLOSE_PREFIX,
		status: false,
	},
	
	]
 
 
$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
// Добавление кнопок при загрузке страницы
 
 
addButton('На рассмотрение', 'pin');
addButton('Одобрено', 'accepted');
addButton('Отказано', 'unaccept');
addButton('Закрыто', 'Zakrito');
addButton('ГА', 'GA');
addButton('Ответы', 'selectAnswer');
// Поиск информации о теме
const threadData = getThreadData();
 
$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
$('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
$('button#Ga').click(() => editThreadData(GA_PREFIX, true));
$(`button#selectAnswer`).click(() => {
XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
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
12 < hours && hours <= 18
? 'Доброго времени суток'
: 18 < hours && hours <= 21
? 'Доброго времени суток'
: 21 < hours && hours <= 4
? 'Доброго времени суток'
: 'Доброго времени суток',
};
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