// ==UserScript==
// @name         Скрипт для кураторов адм/руководства || GOLD
// @namespace    http://tampermonkey.net/
// @version      1.1.3
// @description  Скрипт для кураторов адм/руководства
// @author       Angel Flyweather
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://sun6-22.userapi.com/s/v1/ig2/aORGB3HymEDAjWpHXVMFHI0tKDdntOLO_EkfmttSOy8B5ttH2AhaXFUTCfkoFlyhpAkE57rYo4mU7b8IEZj4PTkF.jpg?size=981x981&quality=95&crop=40,39,981,981&ava=1
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/478645/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%B0%D0%B4%D0%BC%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%7C%7C%20GOLD.user.js
// @updateURL https://update.greasyfork.org/scripts/478645/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%B0%D0%B4%D0%BC%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%7C%7C%20GOLD.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const UNACCСEPT_PREFIX = 4; // префикс отказано
	const ACCСEPT_PREFIX = 8; // префикс одобрено
	const PINN_PREFIX = 2; //  префикс закрепить
	const SPECADM_PREFIX = 11; // специальному администратору
	const GA_PREFIX = 12; // главному администратору
    const CLOSE_PREFIX = 7;
    const TEXY_PREFIX = 13;
    const REALIZOVANO_PREFIX = 5;
    const VAJNO_PREFIX = 1;
    const OJIDANIE_PREFIX = 14;
const buttons = [
    {
    title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Рассмотрение жалоб ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'На рассмотрении',
      content:
		 "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Приветствую, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Ваша жалоба взята на рассмотрение, ожидайте ответа и не создавайте тем-дубликатов.[/SIZE][/FONT] <br><br>"+
                "[B][CENTER][FONT=georgia][SIZE=4][COLOR=YELLOW][ICODE]На рассмотрении[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
      prefix: PINN_PREFIX,
      status: true,
	},
        {
      title: 'У администратора была запрошена опра',
      content:
	 "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Приветствую, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]У администратора были запрошены доказательства на выдачу наказания, ожидайте ответа.[/SIZE][/FONT] <br><br>"+
                "[B][CENTER][FONT=georgia][SIZE=4][COLOR=YELLOW][ICODE]На рассмотрении[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
      prefix: PINN_PREFIX,
      status: true,
	},
      {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Одобрение жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
   {
      title: 'Будет проведена беседа с админом',
      content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Приветствую, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Ваша жалоба одобрена, с администратором будет проведена профилактическая беседа.[/SIZE][/FONT] <br><br>"+
                "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Будет проведена работа с админом',
      content:
	"[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Приветствую, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Ваша жалоба одобрена, с администратором будет проведена работа по данному случаю.[/SIZE][/FONT] <br><br>"+
                "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
     {
      title: 'Админ будет снят',
      content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Приветствую, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Ваша жалоба одобрена, администратор будет снят со своего поста.[/SIZE][/FONT] <br><br>"+
                "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказ жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Отсутствуют доказательства о нарушении администратора',
      content:
		 "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Приветствую, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]В вашей жалобе отсутствуют доказательства о нарушении со стороны администратора.[/COLOR][/SIZE][/FONT] <br><br>"+
                "[B][CENTER][FONT=georgia][SIZE=4][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Наказание выдано верно ',
      content:
		 "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Приветствую, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Нарушений со стороны администратора не найдено, наказание выдано верно.[/SIZE][/FONT] <br><br>"+
                "[B][CENTER][FONT=georgia][SIZE=4][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
        {
      title: 'Жалоба от 3-его лица',
      content:
		 "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Приветствую, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]3.3.[/COLOR][COLOR=lavender]Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации).[/COLOR][/SIZE][/FONT] <br><br>"+
                "[B][CENTER][FONT=georgia][SIZE=4][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
      prefix: CLOSE_PREFIX,
      status: false,
    },
            {
      title: 'Доказательства отредактированы',
      content:
		 "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Приветствую, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]3.7.[/COLOR][COLOR=lavender]Доказательства должны быть предоставлены в первоначальном виде.[/COLOR][/SIZE][/FONT] <br><br>"+
                "[B][CENTER][FONT=georgia][SIZE=4][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Форма темы',
      content:
		 "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Приветствую, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Ваша жалоба составлена не по форме. С формой создания темы можно ознакомиться тут:<br>"+
        "[B][CENTER][COLOR=lavender][url=https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.559802/][/url]<br>"+
                "[B][CENTER][FONT=georgia][SIZE=4][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
        {
      title: '48 часов написания жалобы',
      content:
		 "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Приветствую, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]3.1.[/COLOR][COLOR=lavender]Срок написания жалобы составляет два дня (48 часов) с момента совершенного нарушения со стороны администратора сервера.[/SIZE][/FONT] <br><br>"+
                "[B][CENTER][FONT=georgia][SIZE=4][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
        {
      title: 'Нет /time',
      content:
		 "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Приветствую, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]В вашей жалобе отсутствует /time[/SIZE][/FONT] <br><br>"+
                "[B][CENTER][FONT=georgia][SIZE=4][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
     {
      title: 'Признался в нарушении',
      content:
	 "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Приветствую, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Вы сами признались в своём нарушении.[/SIZE][/FONT] <br><br>"+
                "[B][CENTER][FONT=georgia][SIZE=4][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
     {
      title: 'Смените IP',
      content:
		 "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Приветствую, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Смените IP adress[/COLOR][/SIZE][/FONT] <br><br>"+
                "[B][CENTER][FONT=georgia][SIZE=4][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
      prefix: CLOSE_PREFIX,
      status: false,
    },
     {
      title: 'В обжалования',
      content:
		 "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Приветствую, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Обратитесь в раздел обжалований наказаний.[/COLOR][/SIZE][/FONT] <br><br>"+
                "[B][CENTER][FONT=georgia][SIZE=4][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
      prefix: CLOSE_PREFIX,
      status: false,
    },
     {
      title: 'Подобная жалоба (ответ не был дан)',
      content:
		 "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Приветствую, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Дублирование темы, ожидайте ответа в подобной жалобе, иначе Вы можете получить блокировку форумного аккаунта.[/COLOR][/SIZE][/FONT] <br><br>"+
                "[B][CENTER][FONT=georgia][SIZE=4][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
      prefix: CLOSE_PREFIX,
      status: false,
    },
         {
      title: 'Подобная жалоба (ответ был дан)',
      content:
		 "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Приветствую, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Дублирование темы,  ответ был дан в подобной жалобе, иначе Вы можете получить блокировку форумного аккаунта.[/COLOR][/SIZE][/FONT] <br><br>"+
                "[B][CENTER][FONT=georgia][SIZE=4][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Передача жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'В жалобы на тех.спецов',
      content:
		 "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Приветствую, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Обратитесь в раздел жалоб на тех. специалистов.[/COLOR][/SIZE][/FONT] <br><br>"+
                "[B][CENTER][FONT=georgia][SIZE=4][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
      prefix: CLOSE_PREFIX,
      status: false,
    },
        {
      title: 'В жалобы на игроков',
      content:
	 "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Приветствую, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Обратитесь в раздел жалоб на игроков.[/COLOR][/SIZE][/FONT] <br><br>"+
                "[B][CENTER][FONT=georgia][SIZE=4][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: 'Техническому специалисту',
      content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Приветствую, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Ваша жалоба была передана Техническому Специалисту сервера, ожидайте ответа.[/COLOR][/SIZE][/FONT] <br><br>"+
                "[B][CENTER][FONT=georgia][SIZE=4][COLOR=RED][ICODE]Передано тех. специалисту[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
      prefix: TEXY_PREFIX,
	  status: true,
    },
    {
      title: 'Передано ГА',
      content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Приветствую, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Ваша жалоба была передана Главному администратору, ожидайте ответа.[/COLOR][/SIZE][/FONT] <br><br>"+
                "[B][CENTER][FONT=georgia][SIZE=4][COLOR=RED][ICODE]Передано ГА[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
	    prefix: GA_PREFIX,
        status: true,
    },
    {
      title: 'Передано ЗГА',
      content:
		"[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Приветствую, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Ваша жалоба была передана Заместителю Главного Администратора, ожидайте ответа.[/COLOR][/SIZE][/FONT] <br><br>"+
                "[B][CENTER][FONT=georgia][SIZE=4][COLOR=RED][ICODE]Передано ЗГА[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
	    prefix: PINN_PREFIX,
        status: true,
    },
    {
      title: 'Передано Специальному администратору',
      content:
	"[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Приветствую, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Ваша жалоба была передана Специальному администратору, ожидайте ответа.[/COLOR][/SIZE][/FONT] <br><br>"+
                "[B][CENTER][FONT=georgia][SIZE=4][COLOR=RED][ICODE]Передано Специальному администратору[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
      prefix: SPECADM_PREFIX,
	  status: true,
    },
    {
	  title: '|>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Раздел: Вердикт по обжалованию <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<|'
         },
{
	  title: '| Обжалование одобрено |',
      content:
    "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Приветствую, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Ваше наказание будет снижено/снято.[/SIZE][/FONT] <br><br>"+
                "[B][CENTER][FONT=georgia][SIZE=4][COLOR=GREEN][ICODE]Одобрено[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
      prefix: ACCСEPT_PREFIX,
      status: false,
        },
{
	  title: '| Обжалование отказано |',
      content:
    "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Приветствую, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Администрация не готова снизить Вам наказание.[/SIZE][/FONT] <br><br>"+
                "[B][CENTER][FONT=georgia][SIZE=4][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,
},
{
	  title: '| На рассмотрении у ГА|',
	  content:
    "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Приветствую, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Ваше обжалование передано на рассмотрение [COLOR=YELLOW][U]Главному администратору сервера[/U][/COLOR], ожидайте ответа.[/SIZE][/FONT] <br><br>"+
                "[B][CENTER][FONT=georgia][SIZE=4][COLOR=RED][ICODE]Передано ГA[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
        prefix: GA_PREFIX,
	  status: true,
      },
{
	  title: '| Возврат имущки |',
      content:
    "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Приветствую, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Аккаунт будет разблокирован. У Вас есть ровно [COLOR=YELLOW][U]24 часа[/U][/COLOR] на возврат имущества игроку, полный фрапс с возвратом прикрепите в данную тему. (фрапс должен содержать /time) [/SIZE][/FONT] <br><br>"+
                "[B][CENTER][FONT=georgia][SIZE=4][COLOR=YELLOW][ICODE]На рассмотрении[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
      prefix: PINN_PREFIX,
      status: true,
     },
{
	  title: '| Не согласен с решением адм |',
      content:
    "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Приветствую, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Если Вы не согласны с наказанием, то обратитесь в раздел [COLOR=ORANGE][U]«Жалобы на администрацию»[/COLOR][/U][/SIZE][/FONT] <br><br>"+
                "[B][CENTER][FONT=georgia][SIZE=4][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
      prefix: CLOSE_PREFIX,
      status: false,
     },
{
	  title: '| Необх. договориться о возвр. |',
      content:
    "[B][CENTER][FONT=georgia][SIZE=3][COLOR=RED]Приветствую, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=georgia][SIZE=3][COLOR=lavender]Для обжалования nRP обмана необходимо договориться с обманутой стороной на компенсацию/возврат украденного имущества.[/SIZE][/FONT] <br><br>"+
                "[B][CENTER][FONT=georgia][SIZE=4][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/SIZE][/FONT]<br><br>",
      prefix: UNACCСEPT_PREFIX,
      status: false,


},

];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('★ На рассмотрении ★', 'pin');
	addButton('★ Отказано ★', 'unaccept');
	addButton('★ Одобрено ★', 'accepted');
	addButton('★ Теху ★', 'Texy');
    addButton('★ Закрыто ★', 'Zakrito');
    addButton('★ Ожидание ★', 'Ojidanie');
 	addButton('★ Ответы ★', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PINN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#Realizovano').click(() => editThreadData(REALIZOVANO_PREFIX, false));
    $('button#Vajno').click(() => editThreadData(VAJNO_PREFIX, false));
    $('button#Rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false));
    $('button#Ojidanie').click(() => editThreadData(OJIDANIE_PREFIX, false));
    $('button#Prefiks').click(() => editThreadData(PREFIKS, false));



	$(`button#selectAnswer`).click(() => {
	XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
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
	})();// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://forum.blackrussia.online/threads/%D1%82%D0%B5%D1%81%D1%82.6285985/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blackrussia.online
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();