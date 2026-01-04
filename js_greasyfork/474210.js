// ==UserScript==
// @name         скрипт 
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Скрипт
// @author       Valik
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://klike.net/uploads/posts/2021-12/1638345168_12.jpg
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/474210/%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/474210/%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82.meta.js
// ==/UserScript==
 
(function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // префикс отказано
	const ACCEPT_PREFIX = 8; // префикс одобрено
	const PIN_PREFIX = 2; //  префикс закрепить
	const SPECADM_PREFIX = 11; // специальному администратору
	const MAINADM_PREFIX = 12; // главному адамнистратору
    const CLOSE_PREFIX = 7;
    const TEXY_PREFIX = 13;
    const REALIZOVANO_PREFIX = 5;
    const VAJNO_PREFIX = 1;
    const OJIDANIE_PREFIX = 14;
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const PREFIKS = 0;
const KACHESTVO = 15;
const RASSMOTRENO_PREFIX = 9;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const OTKAZORG_PREFIX = 4;
const ODOBRENOORG_PREFIX = 8;
const NARASSMOTRENIIORG_PREFIX = 2;
const buttons = [
    {
	title: 'Приветсвие',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	'текст <br><br>' +
    'Закрыто. [/FONT][/SIZE]',
},
{
	title: 'Свяжитесь со мной',
	content: 
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"Свяжитесь со мной вконтакте: https://vk.com/77oleinik77<br><br>" +
	'На рассмотрении.[/FONT]',
	prefix: PIN_PREFIX,
	status: true,
},
{
	title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ Жалобы на Администрацию ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ',
},
{
	title: 'На рассмотрении',
	content: 
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"Ваша жалоба взята на рассмотрение. Ожидайте дальнейшего ответа, создавать копии данной темы не нужно.<br><br>" +
	'Ожидайте ответа.[/FONT]',
	prefix: PIN_PREFIX,
	status: true,
},
{
    	title: 'Ссылку на тему',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	" Приложите, пожалуйста, в следующей теме ссылку на тему.[/CODE]<br><br>" +
	'Отказано, закрыто.[/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
        	title: 'Ответ дан ранее',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	" Ранее вам давался ответ на идентичную тему, чтобы не получить блокировку аккаунта перестаньте писать подобные темы.[/CODE]<br><br>" +
	'Отказано, закрыто.[/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{

        	title: 'Другой сервер',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	" Составьте тему на форуме вашего сервера.<br><br>" +
	'Отказано, закрыто.[/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Название жалобы составлено не по форме',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"Название жалобы составлено не по форме. Внимательно прочитайте правила составления жалобы на Админстратрацию:[URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/']*Клик*[/URL] <br>В названии темы необходимо написать: “Nick_Name администратора | Суть жалобы <br><br>Форма для составление темы<br>[ICODE]1. Ваш Nick_Name:<br>2. Nick_Name администратора:<br>3. Дата выдачи/получения наказания:<br>4. Суть жалобы:<br>5. Доказательство:[/ICODE]<br><br>" +
	'Отказано, закрыто.[/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Запрос доказательств',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"У администратора были запрошены доказательства.<br><br>" +
	'На рассмотрении[/FONT]',
	prefix: PIN_PREFIX,
	status: true,
},
{
	title: 'Наказание выдано верно',
	content: 
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"Админстратор предоставил доказательства вашего нарушения.<br>Нарушений со стороны администратора нет.<br><br>" +
	'Закрыто[/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{

    	title: 'Отсуствуют док-ва',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"Приложите доказательства в следующей теме..<br><br>" +
	'Закрыто[/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Ошибка Админа',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	'Ваше наказание снято, с администратором проведена беседа.<br>Приятного времяприпровождения.[/SIZE]<br><br>' +
	'Закрыто[/FONT]',
	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'Беседа с администратором',
	content: 
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"С данным администратором будет проведенна строгая профилактическая беседа.<br><br>" +
	'Решено.[/FONT]',
	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'Передача ГА',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	'Ваша жалоба передана Главному Администратору.<br><br>'+
	'Ожидайте ответа.[/FONT][/SIZE]',
	prefix: MAINADM_PREFIX,
	status: true,
},
{
    	title: 'Передача СА',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	'Ваша жалоба передана Специальной Администрации.<br><br>'+
	'Ожидайте ответа.[/FONT][/SIZE]',
	prefix: SPECADM_PREFIX,
	status: true,
},
{
	title: 'В технический раздел',
	content: 
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"Ваша тема не относиться к жалобам на администрацию, вам в технический раздел нашего сервера.<br><br>" +
	'Закрыто.[/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'В жалобы на тех',
	content: 
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"Вам было выдано наказание от технического специалиста, обратитесь в раздел 'Жалобы на технических специалистов' нашего сервера.<br><br>" +
	'Закрыто.[/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Жалобы от 3-его лица',
	content: 
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"Жалоба оформлена от 3-го лица.<br>" +
	'Закрыто.[/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Присутвуют редактирования',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"Доказательства должны быть в первоначальном виде, без присутствия редактирования с помощью сторонних программ.<br><br>" +
	'Закрыто.[/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Нет окна блокировки',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"Без окна о блокирвке тема не подлежит рассмотрению - создайте новую тему, приложив окно блокировки с фото-хостинга<br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL]<br>(все кликабельно).<br><br>" +
	'Закрыто.[/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Нет /time',
	content: 
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"В вашем доказательстве отсутствует /time.<br>" +
	'Закрыто.[/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Прошло более 48 часов',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"Ваша жалоба рассмотрению не подлежит так как после момента выдачи наказания прошло более 48 часов.<br><br>" +
	'Закрыто.[/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'В обжалования',
	content: 
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"Обратитесь в раздел Обжалование наказаний  нашего сервера.<br><br>" +
	'Закрыто.[/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Доква с соц сетей не принимаются',
	content: 
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"Доказательства путем использования соц.сетей ( ВК, Инстаграм ) запрещенны.<br><br>" +
	'Закрыто.[/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Не относится к разделу',
	content: 
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"Созданная тема никоим образом не относится к назначению и задачам данного раздела.<br><br>" +
	'Закрыто.[/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Дублирование темы',
	content: 
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"Данная ема является дубликатом предыдущей, при 3-ем дублировании ваш форумный аккаунт будет заблокирован.<br><br>" +
	'Закрыто.[/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Недостаточно доказательств',
	content: 
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"Недостаточно доказательств на нарушение от данного администратора.<br><br>" +
	'Закрыто.[/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠРаздел Обжалования ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ',
},
{
	title: 'Обжалование на рассмотрении',
	content: 
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"Ваше обжалование взято на рассмотрение. Не нужно создавать копии этой темы.<br><br>" +
	'Ожидайте ответа.[/FONT]',
	prefix: PIN_PREFIX,
	status: true,
},
{
    	title: 'Передача ГА',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	'Ваше обжалование передано Главному Администратору.<br><br>'+
	'Ожидайте ответа.[/FONT][/SIZE]',
	prefix: MAINADM_PREFIX,
	status: true,
},
{
    	title: 'Передача СА',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	'Ваше обжалование передано Специальной Администрации.<br><br>'+
	'Ожидайте ответа.[/FONT][/SIZE]',
	prefix: SPECADM_PREFIX,
	status: true,
},
{
	title: 'В жалобы на админов',
	content: 
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"Если вы считаете что наказание было выдано неверно обратитесь в раздел жалоб на администрацию.<br><br>" +
	'Отказано.[/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
    	title: 'П/П/В',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"Приложите скриншоты привязок аккаунта в следующей теме.<br><br>" +
	'Отказано.[/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{

	title: 'В жалобы на тех',
	content: 
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"Вам было выдано наказание от технического специалиста, обратитесь в раздел 'Жалобы на технических специалистов' нашего сервера.<br><br>" +
	'Закрыто.[/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Жалобы от 3-его лица',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"Обжалование составлено от 3-го лица.<br><br>" +
	'Закрыто.[/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Присутвуют редактирования',
	content: 
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"Доказательства должны быть в первоначальном виде, без присутствия редактирования с помощью сторонних программ.<br><br>" +
	'Закрыто.[/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Нет окна блокировки',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"Без окна о блокирвке тема не подлежит рассмотрению - создайте новую тему, приложив окно блокировки	 с фото-хостинга<br>[URL='https://yapx.ru/']yapx.ru[/URL],<br>[URL='https://imgur.com/']imgur.com[/URL],<br>[URL='https://www.youtube.com/']youtube.com[/URL],<br>[URL='https://imgbb.com']ImgBB.com[/URL]<br>(все кликабельно).<br><br>" +
	'Закрыто.[/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Обжалование не по форме',
	content: 
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	" Ваше обжалование составлено не по форме. Пожалуйста создайте новую тему соблюдая форму подачи:<br>Ваш никнейм и причина блокировки, пример:<br>Bruce_Banner | Массовый DM.<br>и форму обжалований:<br>[ICODE]1. Ваш Nick_Name:<br>2. Nick_Name администратора:<br>3. Дата выдачи/получения наказания:<br>4. Суть заявки:<br>5. Доказательство:[/ICODE]<br><br>" +
	'Закрыто.[/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Доква с соц сетей не принимаются',
	content: 
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"Доказательства с соц.сетей, не принимаются.<br>Загрузите их на фото-хостинг [URL='https://yapx.ru/']yapx.ru[/URL], [URL='https://imgur.com/']imgur.com[/URL], [URL='https://www.youtube.com/']youtube.com[/URL],[URL='https://imgbb.com']ImgBB.com[/URL](все кликабетильно).<br><br>" +
	'Закрыто.[/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'В другой раздел',
	content: 	
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"Созданная тема никоим образом не относится к назначению и задачам данного раздела.<br><br>" +
	'Закрыто.[/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Дублирование темы',
	content: 
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"Дублирование темы. При дальнейших дублированиях тем ваш форумный аккаунт будет заблокирован.<br><br>" +
	'Закрыто.[/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'НонРП Обман',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	" Если вы готовы возместить ущерб игроку, Свяжитесь с игроком для возврата имущества, затем он должен оформить обжалование.<br><br>" +
	' Закрыто.[/FONT]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},	
{
	title: 'Наказание снято',
	content:
	'[SIZE=4][FONT=Verdana]Доброго времени суток, уважаемый {{ user.mention }}<br><br>' +
	"Рассмотрев ваше наказание было принято решение о снятие наказания.<br><br>" +
	'Одобрено, закрыто.[/FONT][/SIZE]',
	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'ранее был обжалован',
	content: 
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"Вам уже было одобрено обжалование.<br><br>" +
	'Закрыто.[/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Обжалованию не подлежит',
	content: 
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"Ваше обжалование не будет рассматриваться и будет закрыто так как ваше наказание соответствует причинам которые обжалованию не подлежат: различные формы слива, продажа игровой валюты, махинации, целенаправленный багоюз, продажа, передача аккаунта, сокрытие ошибок, багов системы, использование стороннего программного обеспечения, распространение конфиденциальной информации, обман администрации.<br><br>" +
	'Отказано.[/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Отказано',
	content: 
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"На данный момент мы не готовы пойти вам навстречу.<br><br>" +
	'Закрыто.[/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
{
	title: 'Наказание сокращено',
	content: 
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"Ваше обжалование было рассмотрено и принято решение о сокращении вашего наказания.<br><br>" +
	'Одобрено.[/FONT][/SIZE]',
	prefix: ACCEPT_PREFIX,
	status: false,
},
{
	title: 'В данный момент отказано',
	content: 
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	" На данный момент времени ваше обжалование не имеет шансов получить положительный ответ. Спустя некоторое время подайте его повторно.<br><br>" +
	'Закрыто.[/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
    },
{
	title: 'ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠРаздел Кураторы Форума ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠ ᅠ',
},
{
    	title: 'Игрок будет наказан',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"Игрок получит соответсвующее наказание.<br><br>" +
	'Закрыто.[/FONT][/SIZE]',
	prefix: ACCEPT_PREFIX,
	status: false,
    },
{
    	title: 'Название жалобы составлено не по форме',
	content:
	'[SIZE=4][FONT=Verdana]Здравствуйте.<br><br>' +
	"Ваша жалоба составлена не по форме. Внимательно прочитайте правила составления жалобы на игроков:[URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/]*Клик*[/URL] <br>В названии темы необходимо написать: “Nick_Name администратора | Суть жалобы <br><br>Форма для составление темы<br>1. Ваш Nick_Name:<br>2. Nick_Name администратора:<br>3. Дата выдачи/получения наказания:<br>4. Суть жалобы:<br>5. Доказательство:<br><br>" +
	'Отказано, закрыто.[/FONT][/SIZE]',
	prefix: UNACCEPT_PREFIX,
	status: false,
},
];
 
 
	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрение', 'pin');
	addButton('Отказано⛔', 'unaccept');
	addButton('Одобрено✅', 'accepted');
	addButton('Специальному Администратору💥', 'specadm');
    addButton('Теху', 'Texy');
	addButton('Главному Администратору💥', 'mainadm');
    addButton('Закрыто⛔', 'Zakrito');
    addButton('Решено✅', 'Resheno');
    addButton('Закрыто⛔', 'Zakrito');
    addButton('Реализовано💫', 'Realizovano');
    addButton('Рассмотрено✅', 'Rassmotreno');
    addButton('Ожидание', 'Ojidanie');
    addButton('Без префикса⛔', 'Prefiks');
    addButton('Проверено контролем качества', 'Kachestvo');
	addButton('Ответы💥', 'selectAnswer');
 
	// Поиск информации о теме
	const threadData = getThreadData();
 
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#specadm').click(() => editThreadData(SPECADM_PREFIX, true));
	$('button#mainadm').click(() => editThreadData(MAINADM_PREFIX, true));
     $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
    $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#Realizovano').click(() => editThreadData(REALIZOVANO_PREFIX, false));
    $('button#Vajno').click(() => editThreadData(VAJNO_PREFIX, false));
    $('button#Rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false));
    $('button#Ojidanie').click(() => editThreadData(OJIDANIE_PREFIX, false));
    $('button#Prefiks').click(() => editThreadData(PREFIKS, false));
    $('button#Kachestvo').click(() => editThreadData(KACHESTVO, false));
 
 
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
	})();
 
 
 