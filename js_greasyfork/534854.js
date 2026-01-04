// ==UserScript==
// @name         Для работы ЗКТС/КТС
// @namespace    https://forum.blackrussia.online
// @version      1.0
// @description  Для определенного круга лиц
// @author       Shyne
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license 	 none
// @downloadURL https://update.greasyfork.org/scripts/534854/%D0%94%D0%BB%D1%8F%20%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%8B%20%D0%97%D0%9A%D0%A2%D0%A1%D0%9A%D0%A2%D0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/534854/%D0%94%D0%BB%D1%8F%20%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%8B%20%D0%97%D0%9A%D0%A2%D0%A1%D0%9A%D0%A2%D0%A1.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // префикс отказано
    const PIN_PREFIX = 2; //  префикс закрепить
    const COMMAND_PREFIXX = 10; // команде проекта
	const COMMAND_PREFIX = 10; // команде проекта
	const CLOSE_PREFIX = 7; // префикс закрыто
	const DECIDED_PREFIX = 6; // префикс решено
	const TECHADM_PREFIX = 13 // тех администратору
	const WATCHED_PREFIX = 9; // рассмотрено
	const WAIT_PREFIX = 14; // ожидание (для переноса в баг-трекер)
	const NO_PREFIX = 0;
	const buttons = [

                 {
        title: 'Приветствие',
        dpstyle: 'oswald: 3px; color: #DC143C; background: #DCDCDC; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
        "[FONT=Verdana][SIZE=13px]Приветствую, {{ user.mention }}.<br><br><br><br>" +
         ' [/FONT]',
         },

{
	title: 'Рассмотрение',
	dpstyle: 'oswald: 3px; color: #DC143C; background: #DCDCDC; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[FONT=Verdana][SIZE=13px]Приветствую, {{ user.mention }}.<br><br>" +
	"На рассмотрении.<br>",
	prefix: PIN_PREFIX,
	status: true,
},

{
	title: 'На рассмотрении у теха',
	dpstyle: 'oswald: 3px; color: #DC143C; background: #DCDCDC; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[FONT=Verdana][SIZE=13px]Приветствую, {{ user.mention }}.<br><br>" +
	'Ваша тема взята на рассмотрение.<br>' +
    'Пожалуйста, ожидайте ответа от нашего технического специалиста.<br>'+
    "Иногда рассмотрение темы может занять определенное время.<br><br>"+
    'На рассмотрении.<br>',
	prefix: TECHADM_PREFIX,
	status: true,
},
{
	title: 'Ответ выше',
	dpstyle: 'oswald: 3px; color: #DC143C; background: #DCDCDC; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[FONT=Verdana][SIZE=13px]Приветствую, {{ user.mention }}.<br><br>" +
	"Ответ выше.<br><br>"+
    'Закрыто.<br>',
	prefix: CLOSE_PREFIX,
	status: false,
},
        {
        title: 'Не по форме',
       dpstyle: 'oswald: 3px; color: #DC143C; background: #DCDCDC; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
		'[CENTER]Пожалуйста, заполните форму, создав новую тему: Название темы с NickName технического специалиста<br>' +
        '[CENTER]Пример: Lev_Kalashnikov | махинации<br>[COLOR=rgb(255, 0, 0)]Форма заполнения темы:[/COLOR]<br>[code]01. Ваш игровой никнейм:<br>02. Игровой никнейм технического специалиста:<br>03. Сервер, на котором Вы играете:<br>04. Описание ситуации (описать максимально подробно и раскрыто):<br>05. Любые скриншоты, которые могут помочь в решении проблемы (если таковые имеются):<br>06. Дата и время произошедшей технической проблемы (постарайтесь указать максимально точно):[/code][/CENTER]<br><br>' +
        '[CENTER][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR] все оставленные заявки обращения в данный раздел обязательно должны быть составлены по шаблону предоставленному немного выше. В ином случае, заявки обращения в данный раздел составленные не по форме — будут отклоняться. Касательно названия заголовка темы — четких правил нет, но, желательно чтобы оно содержало лишь никнейм и сервер технического специалиста. Заранее, настоятельно рекомендуем ознакомиться с [URL= https://forum.blackrussia.online/forums/%D0%98%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D1%8F-%D0%B4%D0%BB%D1%8F-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.231/][COLOR=rgb(225,204,79)]данным разделом[/COLOR].[/URL][/CENTER]<br><br>' +
        '[CENTER][COLOR=rgb(244,169,0)]Ваша жалоба также может быть отказана[/COLOR]<br><br>А) Если в содержании темы присутствует оффтоп/оскорбления.<br> Б) Если в заголовке темы отсутствует никнейм технического специалиста.<br>В) С момента выдачи наказания прошло более 14 дней.[/CENTER]<br><br>' +
        '[CENTER][COLOR=rgb(0,128,0)]Благодарим вас за обращение![/COLOR][/CENTER]<br>' +
		'[CENTER][COLOR=rgb(255,0,0)][SIZE=4][I][ICODE]Отказано.[/ICODE][/COLOR][/FONT][/CENTER]'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
		prefix: UNACCEPT_PREFIX,
		status: false,
	},
                                {
	title: 'Не относится',
	dpstyle: 'oswald: 3px; color: #DC143C; background: #DCDCDC; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[FONT=Verdana][SIZE=13px]Приветствую, {{ user.mention }}.<br><br>" +
	"Ваше обращение не относится к жалобам на технических специалистов. Пожалуйста ознакомьтесь с правилами данного раздела.<br><br>"+
    'Закрыто.<br>',
	prefix: UNACCEPT_PREFIX,
	status: false,
},

                {
	title: 'Жб на адм',
	dpstyle: 'oswald: 3px; color: #DC143C; background: #DCDCDC; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[FONT=Verdana][SIZE=13px]Приветствую, {{ user.mention }}.<br><br>" +
	"Обратитесь в раздел жалоб на админстрацию вашего сервера.<br><br>"+
    'Закрыто.<br>',
	prefix: CLOSE_PREFIX,
	status: false,
},
                  {
	title: 'Жб на игроков',
	dpstyle: 'oswald: 3px; color: #DC143C; background: #DCDCDC; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[FONT=Verdana][SIZE=13px]Приветствую, {{ user.mention }}.<br><br>" +
	"Обратитесь в раздел жалоб на игроков вашего сервера.<br><br>"+
    'Закрыто.<br>',
	prefix: CLOSE_PREFIX,
	status: false,
},
        {
	title: 'В обж адм',
	dpstyle: 'oswald: 3px; color: #DC143C; background: #DCDCDC; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[FONT=Verdana][SIZE=13px]Приветствую, {{ user.mention }}.<br><br>" +
	"Вы получили наказание от администратора своего сервера. Для его снижения, вам нужно обратиться в раздел «Обжалования» вашего сервера.<br><br>"+
    'Закрыто.<br>',
	prefix: CLOSE_PREFIX,
	status: false,
},
                         {
	title: 'В поддержку',
	dpstyle: 'oswald: 3px; color: #DC143C; background: #DCDCDC; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[FONT=Verdana][SIZE=13px]Приветствую, {{ user.mention }}.<br><br>" +
	"Обратитесь в техническую поддежку проекта.<br><br>"+
     "Конктактная информация:<br>"+
     "Telegram - @br_techBot<br>"+
     "VK - vk.com/br_tech<br><br>"+
      'Рассмотрено.<br>',
	prefix: WATCHED_PREFIX,
	status: false,
},
                             {
	title: 'Хочу занять должность',
	dpstyle: 'oswald: 3px; color: #DC143C; background: #DCDCDC; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[FONT=Verdana][SIZE=13px]Приветствую, {{ user.mention }}.<br><br>" +
	"Команда технических специалистов не решает назначение на какую-либо должность, которая присутствует на проекте. Для этого существуют заявления в главном разделе Вашего игрового сервера, где Вы можете ознакомиться с открытыми должностями и формами подач.<br>Приятной игры и желаем удачи в карьерной лестнице!<br><br>"+
    'Закрыто.<br>',
	prefix: CLOSE_PREFIX,
	status: false,
},
                {
	title: 'Окно бана',
	dpstyle: 'oswald: 3px; color: #DC143C; background: #DCDCDC; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[FONT=Verdana][SIZE=13px]Приветствую, {{ user.mention }}.<br><br>" +
	"Отсутствует окно блокировки.<br><br>"+
    'Закрыто.<br>',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
                        {
	title: '14 дней',
	dpstyle: 'oswald: 3px; color: #DC143C; background: #DCDCDC; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[FONT=Verdana][SIZE=13px]Приветствую, {{ user.mention }}.<br><br>" +
	"С момента выдачи наказания прошло более 14-ти дней. Пересмотр наказания невозможен.<br><br>"+
    'Закрыто.<br>',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
        {
	title: 'Ответ дан ранее',
	dpstyle: 'oswald: 3px; color: #DC143C; background: #DCDCDC; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[FONT=Verdana][SIZE=13px]Приветствую, {{ user.mention }}.<br><br>" +
	"Ответ был дан ранее. За создание дубликатов следует наказание.<br><br>"+
    'Закрыто.<br>',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
         {
	title: 'Ответ не поступил',
	dpstyle: 'oswald: 3px; color: #DC143C; background: #DCDCDC; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[FONT=Verdana][SIZE=13px]Приветствую, {{ user.mention }}.<br><br>" +
	"Ответа так и не поступило.<br><br>"+
    'Закрываю обращение.<br>',
	prefix: CLOSE_PREFIX,
	status: false,
},
        {
	title: 'Выдано верно',
	dpstyle: 'oswald: 3px; color: #DC143C; background: #DCDCDC; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[FONT=Verdana][SIZE=13px]Приветствую, {{ user.mention }}.<br><br>" +
	"Наказание выдано верно.<br><br>"+
    'Закрыто.<br>',
	prefix: CLOSE_PREFIX,
	status: false,
},

{
	title: 'Обж отказ',
	dpstyle: 'oswald: 3px; color: #DC143C; background: #DCDCDC; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[FONT=Verdana][SIZE=13px]Приветствую, {{ user.mention }}.<br><br>" +
	"В обжаловании отказано.<br><br>"+
    'Закрыто.<br>',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
        {
	title: 'Не подлежит обж',
	dpstyle: 'oswald: 3px; color: #DC143C; background: #DCDCDC; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[FONT=Verdana][SIZE=13px]Приветствую, {{ user.mention }}.<br><br>" +
	"Данное нарушение не подлежит обжалованию.<br><br>"+
    'Закрыто.<br>',
	prefix: CLOSE_PREFIX,
	status: false,
},
     {
	title: 'Не подлежит обж 2',
	dpstyle: 'oswald: 3px; color: #DC143C; background: #DCDCDC; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[FONT=Verdana][SIZE=13px]Приветствую, {{ user.mention }}.<br><br>" +
	"В соответствии с правилами проекта, аккаунт, который был заблокирован, не подлежит разблокировке или обжалованию. Это окончательное решение, принятое на основании действующих правил проекта.<br><br>"+
    'В обжаловании отказано.<br>',
	prefix: CLOSE_PREFIX,
	status: false,
},

        {
	title: 'Унбан',
	dpstyle: 'oswald: 3px; color: #DC143C; background: #DCDCDC; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[FONT=Verdana][SIZE=13px]Приветствую, {{ user.mention }}.<br><br>" +
	"Аккаунт будет разблокирован.<br><br>"+
    'Закрыто.<br>',
	prefix: CLOSE_PREFIX,
	status: false,
},
          {
	title: 'ЗАПРОС ПРИВЯЗОК',
    dpstyle: 'oswald: 3px; color: #DC143C; background: #DCDCDC; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
    "[FONT=Verdana][SIZE=13px]Приветствую, {{ user.mention }}.<br><br>" +
    "Укажите привязки[VK/Telegram/почта], которые были установлены к вашему игровому аккаунту.<br><br>" +
    'Ваша жалоба принята к рассмотрению.<br><br>',
        prefix: PIN_PREFIX,
	status: true,
},


        {
	title: 'Чужая привязка',
	dpstyle: 'oswald: 3px; color: #DC143C; background: #DCDCDC; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[FONT=Verdana][SIZE=13px]Приветствую, {{ user.mention }}.<br><br>" +
	"На вашем аккаунте установлена чужая привязка. Аккаунт разблокировке не подлежит.<br><br>"+
    'Закрыто.<br>',
	prefix: CLOSE_PREFIX,
	status: false,
},

  {
	title: 'Отсутсвует доступ к привязке',
	dpstyle: 'oswald: 3px; color: #DC143C; background: #DCDCDC; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[FONT=Verdana][SIZE=13px]Приветствую, {{ user.mention }}.<br><br>" +
	"Мы не можем подтвердить ваши слова без предоставления доказательств. Удаленный аккаунт привязки указывает на то, что на аккаунте может быть привязка другого пользователя.<br><br>"+
    'Закрыто.<br>',
	prefix: CLOSE_PREFIX,
	status: false,
},
  {
	title: 'Отвязка привязок',
	dpstyle: 'oswald: 3px; color: #DC143C; background: #DCDCDC; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[FONT=Verdana][SIZE=13px]Приветствую, {{ user.mention }}.<br><br>" +
	"Удалить установленные на аккаунт привязки не представляется возможным.<br><br>"+
    'Закрыто.<br>',
	prefix: CLOSE_PREFIX,
	status: false,
},
          {
	title: 'Законопослушность',
	dpstyle: 'oswald: 3px; color: #DC143C; background: #DCDCDC; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[FONT=Verdana][SIZE=13px]Приветствую, {{ user.mention }}.<br><br>" +
	"К сожалению, администрация, технические специалисты и другие должностные лица BLACK RUSSIA не могут повлиять на законопослушность вашего аккаунта.<br><br>"+
    'Закрыто.<br>',
	prefix: CLOSE_PREFIX,
	status: false,
},
                  {
	title: 'Не баг',
	dpstyle: 'oswald: 3px; color: #DC143C; background: #DCDCDC; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[FONT=Verdana][SIZE=13px]Приветствую, {{ user.mention }}.<br><br>" +
	"Проблема с которой вы столкнулись не является багом, ошибкой сервера.<br><br>"+
    'Закрыто.<br>',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
          {
	title: 'Известно КП',
	dpstyle: 'oswald: 3px; color: #DC143C; background: #DCDCDC; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[FONT=Verdana][SIZE=13px]Приветствую, {{ user.mention }}.<br><br>" +
	"Команде проекта уже известно о данной проблеме, она обязательно будет рассмотрена и исправлена. Спасибо за Ваше обращение!<br><br>"+
    'Закрыто.<br>',
	prefix: CLOSE_PREFIX,
	status: false,
},
  {
	title: 'Тестерам',
	dpstyle: 'oswald: 3px; color: #DC143C; background: #DCDCDC; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[FONT=Verdana][SIZE=13px]Приветствую, {{ user.mention }}.<br><br>" +
	"Ваша тема передана на тестирование.<br>",
	prefix: WAIT_PREFIX,
	status: false,
},
  {
	title: 'КП',
	dpstyle: 'oswald: 3px; color: #DC143C; background: #DCDCDC; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
	"[FONT=Verdana][SIZE=13px]Приветствую, {{ user.mention }}.<br><br>" +
	"Ваша тема закреплена и находится на рассмотрении у команды проекта. Пожалуйста, ожидайте выноса вердикта разработчиков.<br><br>"+
    "Создавать новые темы с данной проблемой — не нужно, ожидайте ответа в данной теме. Если проблема решится - Вы всегда можете оставить своё сообщение в этой теме.<br>",
	prefix: COMMAND_PREFIX,
	status: false,
},





	{
		title: 'Восст. доступа к аккаунту',
       dpstyle: 'oswald: 3px; color: #DC143C; background: #DCDCDC; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
        "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
		'[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
		"[CENTER]Если Вы обезопасили Ваш аккаунт и [U]привязали его к странице во ВКонтакте[/U], то сбросить пароль или пин-код Вы всегда сможете обратившись в официальное сообщество проекта - https://vk.com/blackrussia.online.<br> Либо в телеграмм бот - https://t.me/br_helper_bot.<br> Напишите «Начать» в личные сообщения группы/бота, затем выберите нужные Вам функции.<br><br>" +
		"[CENTER]Если Вы обезопасили Ваш аккаунт и [U]привязали его к почте[/U], то сбросить пароль или пин-код Вы всегда сможете при вводе пароля на сервере. После подключения к серверу нажмите на кнопку «Войти в аккаунт», затем выберите кнопку «Восстановить пароль», после чего на Вашу почту будет отправлено письмо с одноразовым кодом восстановления.<br><br>" +
		"[CENTER]Если Вы [U]не обезопасили свой аккаунт - его невозможно вернуть[/U]. Игрок самостоятельно несет ответственность за безопасность своего аккаунта.<br><br>" +
		'[CENTER]Надеемся, что Вы сможете восстановить доступ к аккаунту!<br>' +
        '[CENTER]Благодарим вас за обращение![/CENTER]<br>' +
		'[CENTER][COLOR=rgb(52,201,36)][SIZE=4][I][ICODE]Рассмотрено.[/ICODE][/COLOR][/FONT][/CENTER][/I][/SIZE]<br>'+
        "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG][/FONT]<br>",
		prefix: WATCHED_PREFIX,
		status: false,
	},




        {
	title: 'Сервер не отвечает',
	dpstyle: 'oswald: 3px; color: #DC143C; background: #DCDCDC; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
	content:
            "[CENTER][IMG width=695px]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/IMG]<br>"+
	'[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
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

	"[CENTER]📹 Включение продемонстрировано на видео: https://youtu.be/Wft0j69b9dk<br>[CENTER][COLOR=rgb(255,0,0)][SIZE=4][I][ICODE]Закрыто.[/ICODE][/COLOR][/FONT][/CENTER]<br>"+
            "[CENTER][IMG width=695px]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG]<br>",
	prefix: CLOSE_PREFIX,
	status: false,
},

        {
		title: 'Запрос доп. информации',
		dpstyle: 'oswald: 3px; color: #DC143C; background: #DCDCDC; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
		content:
		'[COLOR=rgb(0, 255, 127)][FONT=georgia][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/COLOR]<br><br>' +
		'[CENTER] Для дальнейшего рассмотрения темы, предоставьте:<br><BR>[QUOTE][SIZE=5][FONT=Veranda]1. Скриншоты или видео, подтверждающие факт владения этим имуществом.<BR>2. Все детали пропажи: дата, время, после каких действий имущество пропало.<BR>3. Информация о том, как вы изначально получили это имущество:<BR>дата покупки<br>способ приобретения (у игрока, в магазине или через донат;<br>фрапс покупки (если есть);<br>никнейм игрока, у которого было приобретено имущество, если покупка была сделана не в магазине.[/QUOTE]<BR>[/CENTER]'+
		'[CENTER][COLOR=rgb(255,165,0)][SIZE=4][I][ICODE]На рассмотрении...[/ICODE][/COLOR][/FONT][/CENTER]',
		prefix: PIN_PREFIX,
		status: true,
	},

	];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрении', 'pin', 'border-radius: 50px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 173, 51, 0.5);');
    addButton('Тех. Спец', 'techspec', 'border-radius: 50px; margin-right: 5px; border: 2px solid; border-color: rgb(17, 92, 208, 0.5);');
	addButton('Рассмотрено', 'watched', 'border-radius: 50px; margin-right: 5px; border: 2px solid;  border-color: rgb(110, 192, 113, 0.5)');
	addButton('Решено', 'decided', 'border-radius: 50px; margin-right: 5px; border: 2px solid; border-color: rgb(110, 192, 113, 0.5);');
    addButton('Отказано', 'unaccept', 'border-radius: 50px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);');
	addButton('Закрыто', 'closed', 'border-radius: 50px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);');
    addButton('Команде проекта', 'teamProject', 'border-radius: 50px; margin-right: 10px; border: 2px solid;  border-color: rgb(255, 240, 110, 0.5);');
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
    $('button#teamProject1').click(() => editThreadData(COMMAND_PREFIXX, true));

	$(`button#selectAnswer`).click(() => {
	XF.alert(buttonsMarkup(buttons), null, 'ВЫБЕРИТЕ ОТВЕТ');
	buttons.forEach((btn, id) => {
	if (id > 0) {
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
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="georgia: 3px; margin-left: 3px; margin-top: 10px; border-radius: 30px;">ДАТЬ ОТПОР</button>`,
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
				moveThread(prefix, 917); }
		}
        if(prefix == COMMAND_PREFIXX) {
				moveThread(prefix, 490); }
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